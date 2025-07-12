export const dynamic = 'force-dynamic';
import { checkSession } from "@/utils/checkSession";
import UserDashboard from "./UserDashboard";
import { redirect } from "next/navigation";

export default async function UserDashboardPage() {
  const session = await checkSession('/userDashboard');

  if (!session) {
    redirect('/');
  }

  return <UserDashboard />;
}
