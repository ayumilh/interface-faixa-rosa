import { checkSession } from "@/utils/checkSession";
import { redirect } from "next/navigation";
import AdminDashboard from "./AdminDashboard";

export default async function AdminDashboardPage() {
  const session = await checkSession('/adminDashboard');

  if (!session) {
    redirect('/login');
  }

  return <AdminDashboard />;
}
