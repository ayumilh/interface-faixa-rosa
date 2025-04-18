"use client";
import { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { searchUserId } from "@/utils/searchUserId";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [loadingUserInfo, setLoadingUserInfo] = useState(true);

    // usado no BtnSignOut
    const [isModalOpen, setIsModalOpen] = useState(false);
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const login = async (inputs) => {
        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/login`,
                inputs,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                    }
                }
            );

            Cookies.set("userToken", res.data.token, { expires: 1 });
            Cookies.set("userType", res.data.user.userType, { expires: 1 });


            if (!res.data.token || !res.data.user) return null;

            setIsAuthenticated(true);
            setCurrentUser(res.data.user);
            await fetchUserData();
            return {
                user: res.data.user,
                token: res.data.token,
            }
        } catch (error) {
            setIsAuthenticated(false);

            if (error.response && error.response.status === 401) {
                return { status: 401, message: error.response?.data?.error || 'Credenciais inválidas' };
            } else if (error.response && error.response.status === 404) {
                return { status: 404, message: error.response?.data?.error || 'Usuário não encontrado' };
            } else {
                // Para outros erros, retorna a mensagem do erro
                return { status: error.response?.status || 500, message: error.response?.data?.message || 'Ocorreu um erro ao realizar o login.' };
            }
        }
    };

    const logout = () => {
        Cookies.remove("token");
        Cookies.remove("userToken");
        Cookies.remove("userType");
        setCurrentUser(null);
        setIsAuthenticated(false);
        setUserInfo(null);
        router.push("/login");
    };


    const fetchUserData = useCallback(async () => {
        const tokenId = Cookies.get("userToken");
        const tipoPerfil = Cookies.get("userType");

        if (!tokenId || !tipoPerfil) {
            setUserInfo(null);
            setIsAuthenticated(false);
            setLoadingUserInfo(false);
            return;
        }

        if (tokenId) {
            try {

                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/info?tipoPerfil=${tipoPerfil}`,
                    {
                        headers: {
                            Authorization: `Bearer ${tokenId}`,
                        },
                    }
                );
                if (res.data) {
                    setUserInfo(res.data);
                    setCurrentUser(res.data);
                    setIsAuthenticated(true);
                }
            } catch (err) {
                console.error("Erro ao buscar dados do usuário:", err);
                setIsAuthenticated(false);
                setUserInfo(null);
            } finally {
                setLoadingUserInfo(false);
            }
        }
    }, [currentUser, isAuthenticated]);

    // Decodifica o token e faz login automático
    useEffect(() => {
        const token = Cookies.get("userToken");

        if (token && !currentUser) {
            try {
                const decoded = jwtDecode(token);
                setCurrentUser(decoded);
                setIsAuthenticated(true);
            } catch (err) {
                setCurrentUser(null);
                setIsAuthenticated(false);
                Cookies.remove("userToken");
            }
        }

        fetchUserData(); // ✅ garante que userInfo venha completo
    }, [fetchUserData]);

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                currentUser,
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