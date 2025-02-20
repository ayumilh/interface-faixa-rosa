import { redirect } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { cookies } from 'next/headers';

const defaultRoutes = {
  CONTRATANTE: '/userDashboard',
  ACOMPANHANTE: '/dashboard',
  ADMIN: '/adminDashboard',
};

const routePermissions = {
  CONTRATANTE: ['/userDashboard'],
  ACOMPANHANTE: ['/dashboard'], // Acompanhantes só podem acessar /dashboard
  ADMIN: ['/adminDashboard', '/userManagement'],
};

const publicRoutes = ['/planos', '/login', '/register']; // Adicionando mais rotas públicas

export const checkSession = async (currentRoute) => {
  try {
    const cookieStore = cookies();
    const userToken = cookieStore.get('userToken');

    if (publicRoutes.includes(currentRoute)) {
      return userToken ? { token: userToken.value } : null;
    }

    if (!userToken) {
      console.warn("Usuário não autenticado. Redirecionando para login.");
      redirect('/login');
      return null;
    }

    let session;
    try {
      session = jwtDecode(userToken.value);
      console.log("Token Decodificado:", session);

      if (!session.userType) {
        console.error("Erro: userType não encontrado no token.");
        redirect('/login');
        return null;
      }
    } catch (error) {
      console.error("Erro ao decodificar o token:", error);
      redirect('/login');
      return null;
    }

    const userType = session.userType.trim().toUpperCase();
    console.log("Tipo de usuário:", userType);
    console.log("Página sendo acessada:", currentRoute);

    if (!Object.keys(routePermissions).includes(userType)) {
      console.error("Tipo de usuário inválido ou sem permissões.");
      redirect('/login');
      return null;
    }

    // BLOQUEANDO ADMIN DASHBOARD E USER DASHBOARD PARA ACOMPANHANTES     
    if (userType === "ACOMPANHANTE" && (currentRoute === "/adminDashboard" || currentRoute === "/userDashboard")) {
      console.warn(`BLOQUEADO: Acompanhante tentou acessar ${currentRoute}. Redirecionando...`);
      redirect('/dashboard'); // Redireciona acompanhante para seu próprio painel
      return null;
    }

    const isAuthorized = routePermissions[userType].includes(currentRoute);

    if (!isAuthorized) {
      redirect(defaultRoutes[userType] || '/login');
      return null;
    }

    return session;
  } catch (error) {
    redirect('/login');
    return null;
  }
};
