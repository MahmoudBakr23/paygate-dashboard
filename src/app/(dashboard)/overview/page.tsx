import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { api } from "@/lib/api";
import { formatAmount } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import { TrendingUp, CreditCard, CheckCircle, XCircle } from "lucide-react";

async function getDashboardData(token: string) {
  try {
    return await api.me.dashboard(token);
  } catch {
    return null;
  }
}

async function getRecentCharges(token: string) {
  try {
    const { charges } = await api.charges.list(token, { per_page: "5" });
    return charges;
  } catch {
    return [];
  }
}

export default async function OverviewPage() {
  const jar = await cookies();
  const token = jar.get("paygate_token")?.value;
  if (!token) redirect("/login");

  const [stats, recentCharges] = await Promise.all([
    getDashboardData(token),
    getRecentCharges(token),
  ]);

  const statCards = [
    {
      title: "Total Volume",
      value: stats ? formatAmount(stats.total_volume) : "—",
      icon: TrendingUp,
    },
    {
      title: "Total Charges",
      value: stats?.total_charges?.toLocaleString() ?? "—",
      icon: CreditCard,
    },
    {
      title: "Successful",
      value: stats?.successful_charges?.toLocaleString() ?? "—",
      icon: CheckCircle,
    },
    {
      title: "Success Rate",
      value: stats ? `${(stats.success_rate * 100).toFixed(1)}%` : "—",
      icon: XCircle,
    },
  ];

  const volumeByMethod = stats?.volume_by_method
    ? Object.entries(stats.volume_by_method).map(([name, value]) => ({
        name: name.replace("_", " "),
        value,
      }))
    : [];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Overview</h1>

      {/* Stat cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map(({ title, value, icon: Icon }) => (
          <Card key={title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart */}
      {volumeByMethod.length > 0 && (
        <div className="mb-6">
          <OverviewChart data={volumeByMethod} />
        </div>
      )}

      {/* Recent charges */}
      <Card>
        <CardHeader>
          <CardTitle>Recent charges</CardTitle>
        </CardHeader>
        <CardContent>
          {recentCharges.length === 0 ? (
            <p className="text-sm text-muted-foreground">No charges yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2 font-medium">ID</th>
                  <th className="pb-2 font-medium">Amount</th>
                  <th className="pb-2 font-medium">Method</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentCharges.map((charge) => (
                  <tr key={charge.id} className="border-b last:border-0">
                    <td className="py-3 font-mono text-xs text-muted-foreground">
                      {charge.id.slice(0, 8)}…
                    </td>
                    <td className="py-3 font-medium">
                      {formatAmount(charge.amount, charge.currency)}
                    </td>
                    <td className="py-3 capitalize">{charge.payment_method.replace("_", " ")}</td>
                    <td className="py-3">
                      <span
                        className={
                          charge.status === "captured"
                            ? "text-emerald-600"
                            : charge.status === "failed"
                            ? "text-red-500"
                            : "text-muted-foreground"
                        }
                      >
                        {charge.status}
                      </span>
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {new Date(charge.created_at).toLocaleDateString()}
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
