"use client";
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [userInfo, setUserInfo] = useState(null);

    // usado no BtnSignOut
    const [isModalOpen, setIsModalOpen] = useState(false);
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const login = async (inputs) => {
        try {
            const res = await axios.post(
                // `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/login`,
                `http://localhost:4000/api/user/login`,
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

            if (!res.data.token || !res.data.user) return null;

            if (!currentUser || currentUser.id !== res.data.user.id) {
                setCurrentUser(res.data.user);
            }
            if (!isAuthenticated) {
                setIsAuthenticated(true);
            }
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
        setCurrentUser(null);
        setIsAuthenticated(false);
        router.push("/login");
    };

    useEffect(() => {
        const fetchUserData = async () => {
            const tokenId = Cookies.get("userToken");

            if (tokenId) {
                try {

                    const res = await axios.get(
                        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/info`,
                        {
                            headers: {
                                Authorization: `Bearer ${tokenId}`,
                            },
                        }
                    );
         
                    if (res.data) {
                        setUserInfo(res.data);

                        if (!currentUser || currentUser.id !== res.data.id) {
                            setCurrentUser(res.data);
                        }
                        if (!isAuthenticated) {
                            setIsAuthenticated(true);
                        }
                    }
                } catch {
                    setIsAuthenticated(false);
                    return null;
                }
            }
        };

        if (!currentUser) {
            fetchUserData();
        }
    }, [currentUser, isAuthenticated]);


    useEffect(() => {
        const checkAuth = async () => {
            const token = Cookies.get("userToken");

            if (token && !currentUser) {
                try {
                    const decodedToken = jwtDecode(token);

                    setCurrentUser(decodedToken);
                    setIsAuthenticated(true);
                } catch (error) {
                    setIsAuthenticated(false);
                    setCurrentUser(null);
                    Cookies.remove("token");
                }
            }
        };

        checkAuth();
    }, [currentUser]);


    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                currentUser,
                login,
                logout,
                userInfo,
                setCurrentUser,
                setIsAuthenticated,
                isModalOpen,
                setIsModalOpen,
                toggleModal
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};