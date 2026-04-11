import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { api, type Charge } from "@/lib/api";
import { formatAmount, formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function statusVariant(status: string) {
  switch (status) {
    case "captured": return "success" as const;
    case "failed": return "destructive" as const;
    case "refunded": return "secondary" as const;
    case "voided": return "warning" as const;
    default: return "outline" as const;
  }
}

export default async function ChargesPage() {
  const jar = await cookies();
  const token = jar.get("paygate_token")?.value;
  if (!token) redirect("/login");

  let charges: Charge[] = [];
  try {
    charges = await api.charges.list(token);
  } catch {
    // empty state
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Charges</h1>
      <Card>
        <CardHeader>
          <CardTitle>All charges</CardTitle>
        </CardHeader>
        <CardContent>
          {charges.length === 0 ? (
            <p className="text-sm text-muted-foreground">No charges yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-3 font-medium">Charge ID</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Method</th>
                    <th className="pb-3 font-medium">Provider</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {charges.map((charge) => (
                    <tr key={charge.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="py-3 font-mono text-xs text-muted-foreground">
                        {charge.id}
                      </td>
                      <td className="py-3 font-medium">
                        {formatAmount(charge.amount, charge.currency)}
                      </td>
                      <td className="py-3 capitalize">
                        {charge.payment_method.replace(/_/g, " ")}
                      </td>
                      <td className="py-3 capitalize">{charge.provider}</td>
                      <td className="py-3">
                        <Badge variant={statusVariant(charge.status)}>
                          {charge.status}
                        </Badge>
                      </td>
                      <td className="py-3 text-muted-foreground text-xs">
                        {formatDate(charge.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
