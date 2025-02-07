import Cookies from 'js-cookie';

export const searchUserId = () => {
    const tokenId = Cookies.get("token") || null;

    if (tokenId) {
        return tokenId
    } else {
        return null; 
    }
}