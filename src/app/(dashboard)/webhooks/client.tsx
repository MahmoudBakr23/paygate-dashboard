"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, type WebhookEndpointCreated, ApiError } from "@/lib/api";
import { Plus, Copy, Check } from "lucide-react";

const AVAILABLE_EVENTS = [
  "charge.pending",
  "charge.authorized",
  "charge.captured",
  "charge.failed",
  "charge.voided",
  "refund.created",
  "refund.succeeded",
  "refund.failed",
];

export function WebhooksClient({ token }: { token: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<string[]>(["charge.captured", "charge.failed"]);
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState<WebhookEndpointCreated | null>(null);
  const [copied, setCopied] = useState(false);

  function toggleEvent(event: string) {
    setSelectedEvents((prev) =>
      prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event]
    );
  }

  async function handleCreate() {
    if (!url || selectedEvents.length === 0) return;
    setLoading(true);
    try {
      const result = await api.webhooks.create(token, { url, events: selectedEvents });
      setCreated(result);
      router.refresh();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Failed to create endpoint");
    } finally {
      setLoading(false);
    }
  }

  async function copySecret() {
    if (!created) return;
    await navigator.clipboard.writeText(created.webhook_secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (created) {
    return (
      <div className="w-full rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm dark:border-amber-800 dark:bg-amber-950">
        <p className="mb-2 font-medium text-amber-900 dark:text-amber-100">
          Save your webhook secret — it will not be shown again.
        </p>
        <div className="flex items-center gap-2">
          <code className="flex-1 rounded bg-amber-100 px-2 py-1 font-mono text-xs dark:bg-amber-900">
            {created.webhook_secret}
          </code>
          <Button size="icon" variant="outline" className="h-7 w-7" onClick={copySecret}>
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          </Button>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="mt-3"
          onClick={() => { setCreated(null); setOpen(false); setUrl(""); }}
        >
          Done
        </Button>
      </div>
    );
  }

  if (!open) {
    return (
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus className="mr-1.5 h-4 w-4" />
        Add endpoint
      </Button>
    );
  }

  return (
    <div className="w-full space-y-4 rounded-lg border p-4">
      <div className="space-y-2">
        <Label htmlFor="webhook-url">Endpoint URL</Label>
        <Input
          id="webhook-url"
          type="url"
          placeholder="https://your-server.com/hooks/paygate"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>Events</Label>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_EVENTS.map((event) => (
            <button
              key={event}
              type="button"
              onClick={() => toggleEvent(event)}
              className={`rounded-full border px-2.5 py-0.5 text-xs font-mono transition-colors ${
                selectedEvents.includes(event)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:border-foreground"
              }`}
            >
              {event}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={handleCreate} disabled={loading || !url || selectedEvents.length === 0}>
          {loading ? "Creating…" : "Create endpoint"}
        </Button>
        <Button size="sm" variant="outline" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
