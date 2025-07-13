export const dynamic = "force-dynamic";

import { checkSession } from "../../utils/checkSession";
import { redirect } from "next/navigation";
import AdminDashboardContent from "./AdminDashboardContent";

export default async function AdminDashboard() {
  const session = await checkSession('/adminDashboard');

  if (!session) {
    redirect('/');
  }

  return <AdminDashboardContent />;
}
