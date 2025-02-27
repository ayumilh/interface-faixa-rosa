import { cookies } from 'next/headers';
import { checkSession } from "@/utils/checkSession";
import UserDashboard from "./UserDashboard";
import { redirect } from "next/navigation";

export default async function UserDashboardPage() {
  const session = await checkSession(cookies());

  if (!session) {
    redirect('/login');
  }

  return <UserDashboard />;
}
