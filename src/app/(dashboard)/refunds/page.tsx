import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { api, type Charge } from "@/lib/api";
import { formatAmount, formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function RefundsPage() {
  const jar = await cookies();
  const token = jar.get("paygate_token")?.value;
  if (!token) redirect("/login");

  // Fetch refunded charges then load their refunds
  let refundRows: Array<{
    charge: Charge;
    refund: Awaited<ReturnType<typeof api.refunds.list>>["refunds"][0];
  }> = [];

  try {
    const { charges } = await api.charges.list(token, {
      status: "refunded",
      per_page: "50",
    });

    const refundGroups = await Promise.all(
      charges.map(async (charge) => {
        try {
          const { refunds } = await api.refunds.list(token, charge.id);
          return refunds.map((refund) => ({ charge, refund }));
        } catch {
          return [];
        }
      })
    );

    refundRows = refundGroups.flat();
  } catch {
    // empty state
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Refunds</h1>
      <Card>
        <CardHeader>
          <CardTitle>All refunds</CardTitle>
        </CardHeader>
        <CardContent>
          {refundRows.length === 0 ? (
            <p className="text-sm text-muted-foreground">No refunds yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-3 font-medium">Refund ID</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Reason</th>
                    <th className="pb-3 font-medium">Charge</th>
                    <th className="pb-3 font-medium">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {refundRows.map(({ refund, charge }) => (
                    <tr key={refund.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="py-3 font-mono text-xs text-muted-foreground">
                        {refund.id}
                      </td>
                      <td className="py-3 font-medium">
                        {formatAmount(refund.amount, refund.currency)}
                      </td>
                      <td className="py-3 capitalize text-muted-foreground">
                        {refund.reason?.replace(/_/g, " ") ?? "—"}
                      </td>
                      <td className="py-3 font-mono text-xs text-muted-foreground">
                        {charge.id.slice(0, 8)}…
                      </td>
                      <td className="py-3 text-muted-foreground text-xs">
                        {formatDate(refund.created_at)}
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
