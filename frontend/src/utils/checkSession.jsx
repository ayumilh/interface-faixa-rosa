import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { nextAuthOptions } from '../app/api/auth/[...nextauth]/route';

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
  const session = await getServerSession(nextAuthOptions);

  // Permite acesso irrestrito às rotas públicas
  if (publicRoutes.includes(currentRoute)) {
    return session; // Retorna a sessão se existir, mas não redireciona
  }

  // Para rotas privadas, verifica a autenticação
  if (!session) {
    redirect('/login'); // Redireciona para login se não autenticado
  }

  const { userType } = session.token;

  // Verifica permissão para acessar a rota
  const isAuthorized = routePermissions[userType]?.includes(currentRoute);
  if (!isAuthorized) {
    redirect(defaultRoutes[userType] || '/login');
  }

  return session;
};
