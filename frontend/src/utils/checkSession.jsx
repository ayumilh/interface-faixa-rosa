import { redirect } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

const defaultRoutes = {
  CONTRATANTE: '/userDashboard',
  ACOMPANHANTE: '/dashboard',
  ADMIN: '/adminDashboard',
};

const routePermissions = {
  CONTRATANTE: ['/userDashboard'],
  ACOMPANHANTE: ['/dashboard'],
  ADMIN: ['/adminDashboard', '/userManagement'],
};

const publicRoutes = ['/planos'];

export const checkSession = async (currentRoute) => {
  // Aguarda a API assíncrona corretamente
  const { cookies } = await import('next/headers');
  const cookieStore = cookies();
  const userToken = cookieStore.get('userToken');

  if (publicRoutes.includes(currentRoute)) {
    return userToken ? { token: userToken.value } : null;
  }

  if (!userToken) {
    redirect('/login');
  }

  let session;
  try {
    session = jwtDecode(userToken.value); // Decodifica o JWT corretamente
  } catch (error) {
    console.error('Erro ao decodificar o token:', error);
    redirect('/login');
  }

  const { userType } = session;

  const isAuthorized = routePermissions[userType]?.includes(currentRoute);
  if (!isAuthorized) {
    redirect(defaultRoutes[userType] || '/login');
  }

  return session;
};
