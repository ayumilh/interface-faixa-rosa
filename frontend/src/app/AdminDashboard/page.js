import { redirect } from "next/navigation";
import { checkSession } from "@/utils/checkSession";
import AdminDashboard from "./AdminDashboard.js";

export default async function AdminDashboardPage() {
  const session = await checkSession('/adminDashboard');

  if (!session) {
    return redirect('/login');
  }

  return <AdminDashboard />;
}
