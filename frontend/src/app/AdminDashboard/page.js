import { cookies } from 'next/headers';
import { redirect } from "next/navigation";
import { checkSession } from "@/utils/checkSession";
import AdminDashboard from "./AdminDashboard";

export default async function AdminDashboardPage() {
  const session = await checkSession('/adminDashboard');

  if (!session) {
    redirect('/login');
  }

  return <AdminDashboard />;
}
