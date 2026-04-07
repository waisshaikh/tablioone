import Cookies from "js-cookie";

export const saveToken = (token) => {
  if (!token) return;

  // localStorage (client-side access)
  localStorage.setItem("token", token);

  // optional: cookie (non-HttpOnly, only if needed)
  Cookies.set("token", token, { expires: 7 });
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const clearAuth = () => {
  localStorage.removeItem("token");
  Cookies.remove("token");

  // optional: call backend logout API
  // fetch("/api/logout", { method: "POST", credentials: "include" });
};