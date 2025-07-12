"use client";
import { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userInfo, setUserInfo] = useState(null); // Novo: dados complementares do usuário
    const [currentUser, setCurrentUser] = useState(null);
    const [sessionInfo, setSessionInfo] = useState(null); // Novo: info da sessão Better Auth
    const [loadingUserInfo, setLoadingUserInfo] = useState(true);

    // usado no BtnSignOut
    const [isModalOpen, setIsModalOpen] = useState(false);
    const toggleModal = () => setIsModalOpen(!isModalOpen);

    const login = async (inputs) => {
        try {
            const fp = await FingerprintJS.load();
            const result = await fp.get();
            const fingerprint = result.visitorId;

            const loginData = {
                ...inputs,
                browser_fingerprint: fingerprint
            };

            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/signin/email`, // Endpoint Better Auth
                loginData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                    }
                }
            );

            // Após login bem-sucedido, buscar dados da sessão
            await fetchUserData();

            return { user: res.data.user }; // Ou personalizar conforme necessário
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
            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/signout`, {}, { withCredentials: true });
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
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/me`, {
                withCredentials: true,
                validateStatus: (status) => status < 500, // evita erro 401 no DevTools
            });

            const sessionObj = res.data.session?.session;
            const user = res.data.session?.user;
            const userType = res.data.appUser?.userType;

            if (!user || !sessionObj || !userType) {
                console.warn("Sessão inválida ou não autenticada. Redirecionando...");
                setIsAuthenticated(false);
                setCurrentUser(null);
                setSessionInfo(null);
                setUserInfo(null);
                router.push("/");
                return;
            }

            setCurrentUser({ ...user, userType }); // junta user + userType
            setSessionInfo(sessionObj);
            setIsAuthenticated(true);

            // Busca dados complementares
            try {
                const extra = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/info?tipoPerfil=${userType}`,
                    {
                        withCredentials: true,
                    }
                );
                setUserInfo(extra.data);
            } catch (err) {
                console.warn("Erro ao buscar dados complementares do usuário:", err);
                setUserInfo(null);
            }

        } catch (err) {
            if (err?.response?.status === 401) {
                console.warn("Sessão expirada ou inválida. Redirecionando...");
                router.push("/");
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
    }, [router]);


    // Carrega a sessão ao iniciar
    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                currentUser,
                sessionInfo,
                login,
                logout,
                userInfo,
                fetchUserData,
                setCurrentUser,
                setIsAuthenticated,
                isModalOpen,
                setIsModalOpen,
                toggleModal,
                loadingUserInfo
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
