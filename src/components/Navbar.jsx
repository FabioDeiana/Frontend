import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language.startsWith("it") ? "en" : "it");
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-ocean-700 text-white">
      <Link to="/" className="text-xl font-bold">
        OpenPlaces
      </Link>

      <div className="flex gap-4 items-center">
        <Link to="/" className="hover:underline">
          {t("navbar.home")}
        </Link>
        <Link to="/about" className="hover:underline">
          {t("navbar.about")}
        </Link>

        {user ? (
          <>
            {user.role === "admin" && (
              <Link to="/admin" className="hover:underline">
                {t("navbar.admin")}
              </Link>
            )}
            <Link to="/profile" className="hover:underline">
              {t("navbar.profile")}
            </Link>
            <button
              onClick={handleLogout}
              className="bg-white text-ocean-700 font-semibold px-4 py-1 rounded-full hover:bg-ocean-100 transition"
            >
              {t("navbar.logout")}
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">
              {t("navbar.login")}
            </Link>
            <Link
              to="/register"
              className="bg-white text-ocean-700 font-semibold px-4 py-1 rounded-full hover:bg-ocean-100 transition"
            >
              {t("navbar.register")}
            </Link>
          </>
        )}

        {/* Switch lingua */}
        <button
          onClick={toggleLanguage}
          className="text-sm font-medium bg-ocean-600 hover:bg-ocean-400 px-3 py-1 rounded-full transition"
        >
          {i18n.language.startsWith("it") ? "🇮🇹 IT" : "🇬🇧 EN"}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;