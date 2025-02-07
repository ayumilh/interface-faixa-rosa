import { checkSession } from "@/utils/checkSession";
import UserDashboard from "./UserDashboard";

export default async function UserDashboardPage() {
  await checkSession('/userDashboard'); // Verifica a sessão no lado do servidor
  return <UserDashboard />;
}
