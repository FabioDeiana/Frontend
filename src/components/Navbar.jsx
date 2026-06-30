import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-green-700 text-white">
      <Link to="/" className="text-xl font-bold">
        GreenMap
      </Link>

      <div className="flex gap-4">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        <Link to="/about" className="hover:underline">
          About
        </Link>
        <Link to="/login" className="hover:underline">
          Login
        </Link>
        <Link to="/register" className="hover:underline">
          Registrati
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;