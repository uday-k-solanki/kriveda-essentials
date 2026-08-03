import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export default async function AdminRoot() {
  const auth = await isAdminAuthenticated();
  if (!auth) redirect("/admin/login");
  redirect("/admin/dashboard");
}
