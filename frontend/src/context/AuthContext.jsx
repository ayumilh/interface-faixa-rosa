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

    // usado no BtnSignOut
    const [isModalOpen, setIsModalOpen] = useState(false);
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    useEffect(() => {
        const checkUser = () => {
            const cookieUserInfo = Cookies.get('userInfo');
            if (cookieUserInfo) {
                const parsedUserInfo = JSON.parse(cookieUserInfo);
                setCurrentUser(parsedUserInfo);
                setIsAuthenticated(true);
            }
        };

        checkUser();
    }, []);

    const login = async (inputs) => {
        try {
            const res = await axios.post(
                'http://localhost:4000/api/user/login',
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

            // Armazenar os dados no localStorage
            localStorage.setItem("userInfo", JSON.stringify(res.data.user));

            return {
                user: res.data.user,
                token: res.data.token,
            }
        } catch {
            setIsAuthenticated(false);
            return null;
        }
    };

    const logout = () => {
        Cookies.remove("token");
        Cookies.remove("userToken");
        Cookies.remove("userInfo");
        setCurrentUser(null);
        setIsAuthenticated(false);
        router.push("/login");
    };

    // Função para buscar os dados do usuário da API
    const fetchUserInfo = async (token) => {
        try {
            const response = await axios.get("http://localhost:4000/api/users/info", {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Armazenar os dados no localStorage
            localStorage.setItem('userInfo', JSON.stringify(response.data));

            return response.data;
        } catch (error) {
            console.error("Erro ao buscar dados do usuário:", error);
            return null;
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            const token = Cookies.get("userToken");

            if (token && !currentUser) {
                try {
                    const decodedToken = jwtDecode(token);

                    setCurrentUser(decodedToken);
                    setIsAuthenticated(true);

                    // Verifica se os dados do usuário estão no localStorage
                    const storedUserInfo = localStorage.getItem("userInfo");

                    if (storedUserInfo) {
                        const userInfo = JSON.parse(storedUserInfo);
                        setCurrentUser(userInfo);  // Atualiza com os dados do localStorage
                    } else {
                        // Se não houver dados no localStorage, faz a requisição à API
                        fetchUserInfo(token)
                            .then(userInfo => {
                                if (userInfo) {
                                    setCurrentUser(userInfo);
                                    setIsAuthenticated(true);
                                }
                            });
                    }
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
