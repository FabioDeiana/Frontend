import { createContext, useState, useContext, useEffect } from "react";
import api, { setAccessToken } from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Al primo caricamento, proviamo a ottenere un nuovo accessToken
  // usando il refreshToken (cookie httpOnly) — se l'utente era già loggato
  useEffect(() => {
    async function tryRefresh() {
      try {
        const response = await api.post("/auth/refresh");
        setAccessToken(response.data.accessToken);

        const meResponse = await api.get("/auth/me");
        setUser(meResponse.data);
      } catch (error) {
        // Nessun refresh token valido, utente non loggato
        setUser(null);
        setAccessToken(null);
      } finally {
        setLoading(false);
      }
    }

    tryRefresh();
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    setAccessToken(token);
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Errore durante il logout", error);
    } finally {
      setUser(null);
      setAccessToken(null);
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
