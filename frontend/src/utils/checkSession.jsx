// utils/checkSession.js
import { auth } from "@/utils/auth"; // sua instância do Better Auth
import { fromNodeHeaders } from "better-auth/node";
import { headers } from "next/headers";

const routePermissions = {
  CONTRATANTE: ["/"],
  ACOMPANHANTE: ["/dashboard"],
  ADMIN: ["/adminDashboard"],
};

const publicRoutes = ["/planos", "/login", "/register"];

export async function checkSession(currentRoute = "/") {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(headers()),
    });

    if (!session?.user) {
      return null;
    }

    const userType = session.user?.userType;

    if (!userType) return null;

    // ✅ Permissões
    if (publicRoutes.includes(currentRoute)) {
      return session;
    }

    const allowedRoutes = routePermissions[userType];
    if (!allowedRoutes || !allowedRoutes.includes(currentRoute)) {
      return null;
    }

    return session;
  } catch (error) {
    console.error("Erro ao verificar sessão:", error);
    return null;
  }
}
