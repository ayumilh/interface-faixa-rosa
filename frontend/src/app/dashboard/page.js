import { checkSession } from "@/utils/checkSession";
import Dashboard from "./Dashboard";

export default async function DashboardPage() {
  await checkSession('/dashboard'); // Verifica a sessão no lado do servidor
  return <Dashboard />;
}
