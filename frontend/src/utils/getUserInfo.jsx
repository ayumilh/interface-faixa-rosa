import Cookies from "js-cookie";

export const getUserInfoFromCookie = () => {
  const userInfo = Cookies.get("userInfo");
  if (userInfo) {
    return JSON.parse(userInfo);
  }
  return null;
};
