import { cookies } from "next/headers";
import axios from "axios";


const routePermissions = {
  CONTRATANTE: ["/"],
  ACOMPANHANTE: ["/dashboard"],
  ADMIN: ["/adminDashboard"],
};

const publicRoutes = ["/planos", "/login", "/register"];

export const checkSession = async (currentRoute) => {
  try {
    const cookieStore = cookies();
    const sessionToken = cookieStore.get("better-auth.session_token");

    if (!sessionToken) {
      return null;
    }

    const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/me`, {
      headers: {
        Cookie: `better-auth.session_token=${sessionToken.value}`,
      },
    });

    const data = res.data;

    const userType = data?.appUser?.userType || null;
 
    if (!userType) {
      console.error("userType ausente na resposta de /me");
      return null;
    }

    if (publicRoutes.includes(currentRoute)) {
      return data;
    }

    if (!Object.keys(routePermissions).includes(userType)) {
      return null;
    }

    const isAuthorized = routePermissions[userType].includes(currentRoute);

    if (!isAuthorized) {
      console.warn(`${userType} tentou acessar ${currentRoute}`);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Erro em checkSession:", err?.response?.data || err.message);
    return null;
  }
};
