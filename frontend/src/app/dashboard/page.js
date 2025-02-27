import { cookies } from 'next/headers';
import { checkSession } from "@/utils/checkSession";
import Dashboard from "./Dashboard";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await checkSession('/dashboard');

  if (!session) {
    redirect('/login');
  }

  return <Dashboard />;
}
