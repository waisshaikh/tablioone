import Cookies from "js-cookie";

export const saveToken = (token) => {
  // we set cookie server-side as HttpOnly (prefer). But save in localStorage optionally:
  if (token) localStorage.setItem("token", token);
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const clearAuth = () => {
  localStorage.removeItem("token");
  // call backend /logout to clear cookie too
};
