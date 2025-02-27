import { checkSession } from "@/utils/checkSession";
import { redirect } from "next/navigation";
import DashboardContent from "@/components/adminDashboard/DashboardContent";

export default async function DashboardPage() {
  const session = await checkSession('/dashboard');

  if (!session) {
    redirect('/login');
  }

  return <DashboardContent />;
}
