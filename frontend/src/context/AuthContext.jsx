"use client";
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const { data: session } = useSession();
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [userInfo, setUserInfo] = useState();

    // usado no BtnSignOut
    const [isModalOpen, setIsModalOpen] = useState(false);
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    // Redireciona o usuário com base no tipo
    const redirectBasedOnUserType = (userType) => {
        switch (userType) {
            case "CONTRATANTE":
                router.push("/userDashboard");
                break;
            case "ACOMPANHANTE":
                router.push("/dashboard");
                break;
            case "ADMIN":
                router.push("/adminDashboard");
                break;
            default:
                break;
        }
    };

    const login = async (inputs) => {
        console.log("Inputs do login:", inputs);
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/login`,
                inputs, 
                {
                    withCredentials: true,  // Permite cookies e sessões autenticadas
                    headers: {
                        "Content-Type": "application/json", // Certifique-se de que o backend aceita JSON
                        "Accept": "application/json", // Garante que a resposta esperada seja JSON
                    }
                }
            );

            console.log("Resposta do login:", res.data);

            if (!res.data.token || !res.data.user) {
                return null;
            }

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
        } catch {
            setIsAuthenticated(false);
            return null;
        }
    };

    const loginWithGoogle = async () => {
        await signIn("google", { callbackUrl: "/dashboard" });
    };

    useEffect(() => {
        const fetchUserData = async () => {
            const tokenId = Cookies.get("token") || null;

            if (tokenId) {
                const decodedToken = jwtDecode(tokenId);
                const userid = decodedToken.id;

                try {
                    // Atualiza ou registra o `userid` no backend
                    await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/userId`, { userid });

                    // Busca as informações completas do usuário
                    const res = await axios.get(
                        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/info`,
                        {
                            headers: {
                                Authorization: `Bearer ${tokenId}`,
                            },
                            withCredentials: true,
                        }
                    );

                    if (res.data.user) {
                        setUserInfo(res.data.user);

                        // Atualiza apenas se necessário
                        if (!currentUser || currentUser.id !== res.data.user.id) {
                            setCurrentUser(res.data.user);
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
        if (session && !currentUser && session.token?.userType) {
            setCurrentUser(session.user);
            setIsAuthenticated(true);
        }
    }, [session, currentUser]);

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                currentUser,
                login,
                loginWithGoogle,
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
