import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import AdminShell from "@/components/admin/AdminShell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const auth = await isAdminAuthenticated();
  if (!auth) redirect("/admin/login");
  return <AdminShell>{children}</AdminShell>;
}
