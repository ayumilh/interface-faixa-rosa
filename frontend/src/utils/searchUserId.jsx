import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export const searchUserId = async () => {
    try {
        const token = Cookies.get("userToken");

        if (token) {
            const decodedToken = jwtDecode(token); 

            return {
                id: decodedToken.id,
                firstName: decodedToken.firstName,
                lastName: decodedToken.lastName,
                email: decodedToken.email,
                userType: decodedToken.userType,
            };
        }

        return null; // 🔥 Se não existir, retorna `null`
    } catch (error) {
        console.error("Erro ao recuperar os dados do cookie:", error);
        return null;
    }
};
