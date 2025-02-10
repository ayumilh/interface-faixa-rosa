import { checkSession } from "@/utils/checkSession";
import UserDashboard from "./UserDashboard";

export default async function UserDashboardPage() {
  const session = await checkSession('/userDashboard');

  if (!session) {
    redirect('/login');
  }

  return <UserDashboard />;
}
