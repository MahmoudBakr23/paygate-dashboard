import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { api, type ApiKey } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ApiKeysClient } from "./client";

export default async function ApiKeysPage() {
  const jar = await cookies();
  const token = jar.get("paygate_token")?.value;
  if (!token) redirect("/login");

  let apiKeys: ApiKey[] = [];
  try {
    apiKeys = await api.apiKeys.list(token);
  } catch {
    // empty state
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight">API Keys</h1>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Keys</CardTitle>
          <ApiKeysClient token={token} />
        </CardHeader>
        <CardContent>
          {apiKeys.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No API keys yet. Generate a key pair above to get started.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-3 font-medium">Public key</th>
                  <th className="pb-3 font-medium">Environment</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Last used</th>
                  <th className="pb-3 font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {apiKeys.map((key) => (
                  <tr key={key.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="py-3 font-mono text-xs">{key.public_key}</td>
                    <td className="py-3 capitalize">
                      <Badge variant="secondary">{key.environment}</Badge>
                    </td>
                    <td className="py-3">
                      <Badge variant={key.revoked_at ? "destructive" : "success"}>
                        {key.revoked_at ? "Revoked" : "Active"}
                      </Badge>
                    </td>
                    <td className="py-3 text-muted-foreground text-xs">
                      {key.last_used_at ? formatDate(key.last_used_at) : "Never"}
                    </td>
                    <td className="py-3 text-muted-foreground text-xs">
                      {formatDate(key.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
