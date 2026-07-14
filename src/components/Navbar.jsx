import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";

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
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-ocean-100 px-6 py-3 flex items-center justify-between"
    >
      <Link to="/" className="text-xl font-bold text-ocean-700 font-display">
        🌍 OpenPlaces
      </Link>

      <div className="flex gap-1 sm:gap-2 items-center">
        <Link
          to="/"
          className="text-ocean-700 font-medium px-3 py-2 rounded-full hover:bg-ocean-50 transition text-sm"
        >
          {t("navbar.home")}
        </Link>
        <Link
          to="/about"
          className="text-ocean-700 font-medium px-3 py-2 rounded-full hover:bg-ocean-50 transition text-sm"
        >
          {t("navbar.about")}
        </Link>

        {user ? (
          <>
            {user.role === "admin" && (
              <Link
                to="/admin"
                className="text-ocean-700 font-medium px-3 py-2 rounded-full hover:bg-ocean-50 transition text-sm"
              >
                {t("navbar.admin")}
              </Link>
            )}
            <Link
              to="/profile"
              className="text-ocean-700 font-medium px-3 py-2 rounded-full hover:bg-ocean-50 transition text-sm"
            >
              {t("navbar.profile")}
            </Link>
            <button
              onClick={handleLogout}
              className="bg-ocean-700 text-white font-semibold px-4 py-2 rounded-full hover:bg-ocean-800 transition text-sm"
            >
              {t("navbar.logout")}
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-ocean-700 font-medium px-3 py-2 rounded-full hover:bg-ocean-50 transition text-sm"
            >
              {t("navbar.login")}
            </Link>
            <Link
              to="/register"
              className="bg-coral-500 text-white font-semibold px-4 py-2 rounded-full hover:bg-coral-600 transition text-sm shadow-md shadow-coral-500/30"
            >
              {t("navbar.register")}
            </Link>
          </>
        )}

        <button
          onClick={toggleLanguage}
          className="text-sm font-medium text-ocean-700 border border-ocean-200 hover:bg-ocean-50 px-3 py-1.5 rounded-full transition ml-1"
        >
          {i18n.language.startsWith("it") ? "🇮🇹 IT" : "🇬🇧 EN"}
        </button>
      </div>
    </motion.nav>
  );
}

export default Navbar;