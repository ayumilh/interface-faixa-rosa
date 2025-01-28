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

export const checkSession = async (currentRoute) => {
  const session = await getServerSession(nextAuthOptions);

  if (!session) {
    redirect('/login'); // Redireciona para login se não estiver autenticado
  }

  const { userType } = session.token; // Obtém o tipo de usuário

  // Verifica se o usuário tem permissão para acessar a rota atual
  const isAuthorized = routePermissions[userType]?.includes(currentRoute);

  if (!isAuthorized) {
    // Redireciona para a rota padrão do `userType`
    redirect(defaultRoutes[userType] || '/login');
  }

  return session;
};
