import { jwtDecode } from 'jwt-decode';
import { cookies } from 'next/headers';

const defaultRoutes = {
  CONTRATANTE: '/',
  ACOMPANHANTE: '/dashboard',
  ADMIN: '/adminDashboard',
};

const routePermissions = {
  CONTRATANTE: ['/'],
  ACOMPANHANTE: ['/dashboard'],
  ADMIN: ['/adminDashboard'],
};

const publicRoutes = ['/planos', '/login', '/register'];

export const checkSession = async (currentRoute) => {
  try {
    const cookieStore = await cookies();
    const userToken = cookieStore.get('userToken');

    if (!userToken) {
      return null;
    }

    let session;
    try {
      session = jwtDecode(userToken.value);

      if (!session.userType) {
        console.error("Erro: userType não encontrado no token.");
        return null;
      }
    } catch (error) {
      console.error("Erro ao decodificar o token:", error);
      return null;
    }

    const userType = session.userType.trim().toUpperCase();

    if (publicRoutes.includes(currentRoute)) {
      return session;
    }

    if (!Object.keys(routePermissions).includes(userType)) {
      console.error("Tipo de usuário inválido ou sem permissões.");
      return null;
    }

    if (userType === "ACOMPANHANTE" && (currentRoute === "/adminDashboard" || currentRoute === "/")) {
      console.warn(`BLOQUEADO: Acompanhante tentou acessar ${currentRoute}.`);
      return null;
    }


    if (userType === "ADMIN" && currentRoute !== "/adminDashboard") {
      return null;
    }

    if (userType === "CONTRATANTE" && currentRoute !== "/") {
      return null;
    }

    const isAuthorized = routePermissions[userType].includes(currentRoute);

    if (!isAuthorized) {
      return null;
    }

    return session;
  } catch (error) {
    console.error("Erro inesperado:", error);
    return null;
  }
};
