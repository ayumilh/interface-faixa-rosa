"use client";

import { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useRouter, usePathname } from "next/navigation";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  // Defina aqui todas as rotas que precisam de autenticação
  const protectedRoutes = [
    "/dashboard",
    "/adminDashboard",
    "/userDashboard",
    "/checkout",
    "/planos-usuarios",
    "/videos",
    "/convenio",

    // …outras rotas privadas
  ];

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [sessionInfo, setSessionInfo] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loadingUserInfo, setLoadingUserInfo] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const login = async (inputs) => {
    try {
      const fp = await FingerprintJS.load();
      const { visitorId: browser_fingerprint } = await fp.get();

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/signin/email`,
        { ...inputs, browser_fingerprint },
        { withCredentials: true }
      );

      await fetchUserData();
      return { user: res.data.user };
    } catch (error) {
      setIsAuthenticated(false);
      if (error.response?.status === 401) {
        return { status: 401, message: error.response.data?.error || "Credenciais inválidas" };
      } else if (error.response?.status === 404) {
        return { status: 404, message: error.response.data?.error || "Usuário não encontrado" };
      } else {
        return { status: 500, message: error.response?.data?.message || "Erro ao realizar login." };
      }
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/signout`,
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.warn("Erro ao sair:", err);
    } finally {
      setCurrentUser(null);
      setIsAuthenticated(false);
      setSessionInfo(null);
      router.push("/login");
    }
  };

  const fetchUserData = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/me`,
        {
          withCredentials: true,
          validateStatus: (status) => status < 500,
        }
      );

      const sessionObj = res.data.session?.session;
      const user = res.data.session?.user;
      const userType = res.data.appUser?.userType;

      // Se faltar qualquer dado, limpa e redireciona apenas em rotas privadas
      if (!user || !sessionObj || !userType) {
        console.warn("Sessão inválida ou não autenticada.");
        setIsAuthenticated(false);
        setCurrentUser(null);
        setSessionInfo(null);
        setUserInfo(null);

        if (protectedRoutes.some((route) => pathname.startsWith(route))) {
          router.push("/");
        }
        return;
      }

      setCurrentUser({ ...user, userType });
      setSessionInfo(sessionObj);
      setIsAuthenticated(true);

      // Busca dados complementares do usuário
      try {
        const extra = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/info?tipoPerfil=${userType}`,
          { withCredentials: true }
        );
        setUserInfo(extra.data);
      } catch (err) {
        console.warn("Erro ao buscar dados complementares:", err);
        setUserInfo(null);
      }
    } catch (err) {
      // Se der 401, também só redireciona em rota protegida
      if (err.response?.status === 401) {
        console.warn("Sessão expirada ou inválida.");
        if (protectedRoutes.some((route) => pathname.startsWith(route))) {
          router.push("/");
        }
      } else {
        console.error("Erro ao buscar sessão do usuário:", err);
      }
      setIsAuthenticated(false);
      setCurrentUser(null);
      setSessionInfo(null);
      setUserInfo(null);
    } finally {
      setLoadingUserInfo(false);
    }
  }, [router, pathname]);

  // Carrega sessão ao montar o provider
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        sessionInfo,
        userInfo,
        loadingUserInfo,
        login,
        logout,
        fetchUserData,
        isModalOpen,
        toggleModal,
        setIsAuthenticated,
        setCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
