import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';
import { redirect } from 'next/navigation';

// Rotas padrão para cada tipo de usuário
const defaultRoutes = {
  CONTRATANTE: '/userDashboard',
  ACOMPANHANTE: '/dashboard',
  ADMIN: '/adminDashboard',
};

// Rotas permitidas para cada tipo de usuário
const routePermissions = {
  CONTRATANTE: ['/userDashboard'],
  ACOMPANHANTE: ['/dashboard'],
  ADMIN: ['/adminDashboard', '/userManagement'],
};

const publicRoutes = ['/planos'];

export const checkSession = async (currentRoute) => {
  try {
    const token = Cookies.get('userToken');
    console.log("Token encontrado no servidor:", token);

    if (!token) {
      console.log("⚠️ Token não encontrado, redirecionando para login...");
      return { redirectTo: '/login' };
    }

    // Decodifica o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Usuário autenticado:", decoded);

    // Permite acesso irrestrito às rotas públicas
    if (publicRoutes.includes(currentRoute)) {
      return { user: decoded };
    }

    const { userType } = decoded;

    // Verifica permissão para acessar a rota
    const isAuthorized = routePermissions[userType]?.includes(currentRoute);
    if (!isAuthorized) {
      console.log(`Usuário ${userType} sem permissão para acessar ${currentRoute}, redirecionando...`);
      return { redirectTo: defaultRoutes[userType] || '/login' };
    }

    return { user: decoded };

  } catch (error) {
    console.error("🚨 Erro ao verificar sessão:", error);
    return { redirectTo: '/login' };
  }
};
