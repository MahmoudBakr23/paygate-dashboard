import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { api } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default async function SettingsPage() {
  const jar = await cookies();
  const token = jar.get("paygate_token")?.value;
  if (!token) redirect("/login");

  let merchant: Awaited<ReturnType<typeof api.me.get>>["merchant"] | null = null;
  try {
    const data = await api.me.get(token);
    merchant = data.merchant;
  } catch {
    // show empty state
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Settings</h1>

      <div className="max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Your merchant profile and environment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {merchant ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Business name</span>
                  <span className="text-sm font-medium">{merchant.name}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Email</span>
                  <span className="text-sm font-medium">{merchant.email}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Environment</span>
                  <Badge variant={merchant.environment === "live" ? "default" : "secondary"}>
                    {merchant.environment}
                  </Badge>
                </div>
                <Separator />
                <div className="flex items-start justify-between gap-4">
                  <span className="text-sm text-muted-foreground">Payment methods</span>
                  <div className="flex flex-wrap justify-end gap-1.5">
                    {merchant.enabled_payment_methods.map((method) => (
                      <Badge key={method} variant="outline" className="text-xs capitalize">
                        {method.replace(/_/g, " ")}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Member since</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(merchant.created_at).toLocaleDateString("en-SA", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Unable to load account details.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sandbox mode</CardTitle>
            <CardDescription>
              This account is in sandbox mode. Transactions are processed against provider test
              infrastructure — no real money is moved.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Live mode is architecture-complete but not activated in this portfolio instance.
              Use <code className="rounded bg-muted px-1 py-0.5 text-xs">sk_test_</code> keys
              for all API calls.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
