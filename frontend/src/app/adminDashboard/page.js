import { checkSession } from "@/utils/checkSession";
import { redirect } from "next/navigation";
import DashboardContent from "@/components/adminDashboard/DashboardContent";

export default async function AdminDashboard() {
  const session = await checkSession('/adminDashboard');

  if (!session) {
    redirect('/login');
  }

  return <DashboardContent />;
}
