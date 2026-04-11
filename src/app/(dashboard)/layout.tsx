import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Sidebar } from "@/components/dashboard/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jar = await cookies();
  const token = jar.get("paygate_token")?.value;
  if (!token) redirect("/login");

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-muted/20 p-8">{children}</main>
    </div>
  );
}
