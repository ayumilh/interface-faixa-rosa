import { checkSession } from "@/utils/checkSession";
import Dashboard from "./Dashboard";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await checkSession('/dashboard'); // Verifica a sessão no lado do servidor

  if (session.redirectTo) {
    redirect(session.redirectTo); // 🔥 Redireciona corretamente
  }
  return <Dashboard />;
}
