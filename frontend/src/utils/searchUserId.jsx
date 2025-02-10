import { getSession } from "next-auth/react";

export const searchUserId = async () => {
    try {
        const session = await getSession(); // 🔥 Busca a sessão do NextAuth

        if (session?.user?.accessToken) {
            console.log("Token recuperado da sessão:", session.user.accessToken);
            return session.user.accessToken; // 🔥 Retorna o token armazenado no callback
        }

        return null; // 🔥 Se não existir, retorna `null`
    } catch (error) {
        console.error("Erro ao recuperar o token da sessão:", error);
        return null;
    }
};
