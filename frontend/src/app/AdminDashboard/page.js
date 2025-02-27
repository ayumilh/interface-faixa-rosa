import { redirect } from "next/navigation";
import { checkSession } from "@/utils/checkSession";
import DashboardContent from "@/components/AdminDashboard/DashboardContent";

export default async function AdminDashboardPage() {
  const session = await checkSession('/adminDashboard');

  if (!session) {
    return redirect('/login');
  }

  return <DashboardContent />;
}
