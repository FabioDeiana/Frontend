import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Al primo caricamento, proviamo a ottenere un nuovo accessToken
  // usando il refreshToken (cookie httpOnly) — se l'utente era già loggato
  useEffect(() => {
    async function tryRefresh() {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/auth/refresh",
          {},
          { withCredentials: true }
        );
        setAccessToken(response.data.accessToken);

        const meResponse = await axios.get(
          "http://localhost:5000/api/auth/me",
          {
            headers: {
              Authorization: `Bearer ${response.data.accessToken}`,
            },
          }
        );
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
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Errore durante il logout", error);
    } finally {
      setUser(null);
      setAccessToken(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}