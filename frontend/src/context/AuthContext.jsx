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
        try {
            const res = await axios.post(`${process.env.local.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`,
                inputs,
                { withCredentials: true }
            );
            Cookies.set("userId", res.data.token);
            if (!currentUser || currentUser.id !== res.data.user.id) {
                setCurrentUser(res.data.user);
            }
            if (!isAuthenticated) {
                setIsAuthenticated(true);
            }
            return res.data.user;
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
            const tokenId = Cookies.get("userId") || null;

            if (tokenId) {
                const decodedToken = jwtDecode(tokenId);
                const userid = decodedToken.id;

                try {
                    // Atualiza ou registra o `userid` no backend
                    await axios.post(`${process.env.local.NEXT_PUBLIC_BACKEND_URL}/api/userId`, { userid });

                    // Busca as informações completas do usuário
                    const res = await axios.get(
                        `${process.env.local.NEXT_PUBLIC_BACKEND_URL}/api/users/info`,
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
