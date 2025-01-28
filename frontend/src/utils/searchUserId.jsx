import Cookies from 'js-cookie';

export const searchUserId = () => {
    const tokenId = Cookies.get("userId") || null;

    if (tokenId) {
        return tokenId
    } else {
        return null; 
    }
}