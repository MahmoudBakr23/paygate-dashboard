"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { api, type ApiKeyCreated, ApiError } from "@/lib/api";
import { Key, Copy, Check } from "lucide-react";

export function ApiKeysClient({ token }: { token: string }) {
  const router = useRouter();
  const [newKey, setNewKey] = useState<ApiKeyCreated | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function generate() {
    setLoading(true);
    try {
      const result = await api.apiKeys.create(token);
      setNewKey(result);
      router.refresh();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Failed to generate key");
    } finally {
      setLoading(false);
    }
  }

  async function copySecret() {
    if (!newKey) return;
    await navigator.clipboard.writeText(newKey.secret_key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col items-end gap-3">
      <Button size="sm" onClick={generate} disabled={loading}>
        <Key className="mr-1.5 h-4 w-4" />
        {loading ? "Generating…" : "Generate key pair"}
      </Button>

      {newKey && (
        <div className="w-full rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm dark:border-amber-800 dark:bg-amber-950">
          <p className="mb-2 font-medium text-amber-900 dark:text-amber-100">
            Save your secret key — it will not be shown again.
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded bg-amber-100 px-2 py-1 font-mono text-xs dark:bg-amber-900">
              {newKey.secret_key}
            </code>
            <Button size="icon" variant="outline" className="h-7 w-7" onClick={copySecret}>
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
