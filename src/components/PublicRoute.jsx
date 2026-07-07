import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <p className="text-center py-20">Caricamento...</p>;

  if (user) return <Navigate to="/" />;

  return children;
}

export default PublicRoute;