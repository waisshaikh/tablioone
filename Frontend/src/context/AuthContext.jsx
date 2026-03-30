import { createContext, useContext, useEffect, useState } from "react";
import { onAuth, auth } from "../components/firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuth(async (u) => {
      setUser(u);
      setToken(u ? await u.getIdToken() : null);
      setLoading(false);
    });
  }, []);

  const logout = async () => {
    await auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
