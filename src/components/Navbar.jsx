import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-green-700 text-white">
      <Link to="/" className="text-xl font-bold">
        GreenMap
      </Link>

      <div className="flex gap-4 items-center">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        <Link to="/about" className="hover:underline">
          About
        </Link>

        {user ? (
          <>
            <Link to="/profile" className="hover:underline">
              Profilo
            </Link>
            <button
              onClick={handleLogout}
              className="bg-white text-green-700 font-semibold px-4 py-1 rounded-full hover:bg-green-100 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-white text-green-700 font-semibold px-4 py-1 rounded-full hover:bg-green-100 transition"
            >
              Registrati
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;