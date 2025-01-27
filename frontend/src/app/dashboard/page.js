import { checkSession } from "@/utils/checkSession";
import Dashboard from "./Dashboard";

export default async function DashboardPage() {
  await checkSession(); // Verifica a sessão no lado do servidor
  return <Dashboard />;
}
