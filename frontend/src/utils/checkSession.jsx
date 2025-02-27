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
  ACOMPANHANTE: ['/dashboard'],
  ADMIN: ['/adminDashboard'],
};

const publicRoutes = ['/planos', '/login', '/register'];

export const checkSession = async (currentRoute) => {
  try {
    const cookieStore = cookies();
    const userToken = cookieStore.get('userToken');

    if (!userToken) {
      redirect('/login');
      return null;
    }

    let session;
    try {
      session = jwtDecode(userToken.value);

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

    if (publicRoutes.includes(currentRoute)) {
      return session;
    }

    if (!Object.keys(routePermissions).includes(userType)) {
      console.error("Tipo de usuário inválido ou sem permissões.");
      redirect('/login');
      return null;
    }

    if (userType === "ACOMPANHANTE" && (currentRoute === "/adminDashboard" || currentRoute === "/userDashboard")) {
      console.warn(`BLOQUEADO: Acompanhante tentou acessar ${currentRoute}.`);
      redirect('/dashboard');
      return null;
    }

    if (userType === "ADMIN" && currentRoute !== "/adminDashboard") {
      redirect('/adminDashboard');
      return null;
    }

    if (userType === "CONTRATANTE" && currentRoute !== "/userDashboard") {
      redirect('/userDashboard');
      return null;
    }

    const isAuthorized = routePermissions[userType].includes(currentRoute);

    if (!isAuthorized) {
      redirect(defaultRoutes[userType] || '/login');
      return null;
    }

    return session;
  } catch (error) {
    console.error("Erro inesperado:", error);
    redirect('/login');
    return null;
  }
};
