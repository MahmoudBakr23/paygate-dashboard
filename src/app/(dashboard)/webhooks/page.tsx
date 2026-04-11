import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { api, type WebhookEndpoint } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WebhooksClient } from "./client";

export default async function WebhooksPage() {
  const jar = await cookies();
  const token = jar.get("paygate_token")?.value;
  if (!token) redirect("/login");

  let endpoints: WebhookEndpoint[] = [];
  try {
    endpoints = await api.webhooks.list(token);
  } catch {
    // empty state
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Webhooks</h1>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Endpoints</CardTitle>
          <WebhooksClient token={token} />
        </CardHeader>
        <CardContent>
          {endpoints.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No webhook endpoints yet. Add one above to receive event notifications.
            </p>
          ) : (
            <div className="space-y-4">
              {endpoints.map((endpoint) => (
                <div key={endpoint.id} className="rounded-lg border p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-mono text-sm font-medium truncate">{endpoint.url}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Created {formatDate(endpoint.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {endpoint.events.map((event) => (
                      <Badge key={event} variant="secondary" className="font-mono text-xs">
                        {event}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
