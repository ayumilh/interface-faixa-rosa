"use client";
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useSession, signIn } from "next-auth/react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState();
    const { data: session } = useSession();

    // usado no BtnSignOut
    const [isModalOpen, setIsModalOpen] = useState(false);
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };


    const login = async (inputs) => {
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`,
                inputs,
                { withCredentials: true }
            );
            const userData = res.data.user;
            setCurrentUser(res.data.user);
            Cookies.set("userId", res.data.token, { expires: 1 });
            setIsAuthenticated(true);
            return userData;
        } catch (error) {
            if (error.response) {
                switch (error.response.status) {
                    case 400:
                        toast.error("Requisição inválida. Verifique os dados e tente novamente.");
                        break;
                    case 401:
                        toast.error("Não autorizado. Verifique suas credenciais.");
                        break;
                    case 403:
                        toast.error("Proibido. Você não tem permissão para realizar esta ação.");
                        break;
                    case 404:
                        toast.error("Recurso não encontrado.");
                        break;
                    case 500:
                        toast.error("Erro interno do servidor. Tente novamente mais tarde.");
                        break;
                    default:
                        toast.error(error.response.data.message || "Erro desconhecido.");
                }
            } else if (error.request) {
                toast.error("Sem resposta do servidor. Verifique sua conexão.");
            } else {
                toast.error(error.message);
            }
            return null;
        }
    };

    const loginWithGoogle = async () => {
        try {
            const response = await signIn("google", { callbackUrl: "/dashboard", redirect: false });
            if (response && response.ok) {
                const user = response.user;
                const googleLogin = true;

                // Chama o endpoint de login para gerar o token
                const loginResponse = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`, {
                    email: user.email,
                    googleLogin
                }, { withCredentials: true });

                const userData = loginResponse.data.user;
                const token = loginResponse.data.token;

                setCurrentUser(userData);
                Cookies.set("userId", token, { expires: 1 });
                setIsAuthenticated(true);
                return userData;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Erro ao fazer login com Google:", error);
            toast.error("Erro ao fazer login com Google.");
            return null;
        }
    };

    useEffect(() => {
        const fetchUserId = async () => {
            const getUserId = Cookies.get("userId")
                ? JSON.parse(Cookies.get("userId"))
                : null;

            if (getUserId && getUserId.token) {
                const decodedToken = jwtDecode(getUserId.token);
                const userid = decodedToken.userid;

                try {
                    await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/userId`,
                        { userid }
                    );
                } catch (err) {
                    console.error(err);
                }
            }
        };

        if (currentUser) {
            fetchUserId();
        }
    }, [currentUser]);

    useEffect(() => {
        if (session) {
            setCurrentUser(session.user);
            setIsAuthenticated(true);
        }
    }, [session]);

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                currentUser,
                login,
                loginWithGoogle,
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
