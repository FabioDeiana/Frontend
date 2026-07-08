import axios from "axios";

// Istanza axios con configurazione di base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // invia sempre i cookie (refresh token)
});

// Il token vive qui, in memoria, a livello di modulo.
// AuthContext lo aggiorna tramite setAccessToken.
let accessToken = null;

export function setAccessToken(token) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

// INTERCEPTOR DI RICHIESTA:
// prima che ogni richiesta parta, attacca il token (il "badge")
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// INTERCEPTOR DI RISPOSTA:
// se una risposta è 401 (token scaduto), prova a rinnovare
// il token e ripete la richiesta originale una sola volta
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh") &&
      !originalRequest.url.includes("/auth/login")
    ) {
      originalRequest._retry = true;

      try {
        const response = await api.post("/auth/refresh");
        setAccessToken(response.data.accessToken);
        return api(originalRequest); // ripete la richiesta originale
      } catch (refreshError) {
        // refresh fallito: l'utente deve rifare il login
        setAccessToken(null);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;