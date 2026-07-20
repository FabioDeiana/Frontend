import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    navigate("/");
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language.startsWith("it") ? "en" : "it");
  };

  const closeMenu = () => setMenuOpen(false);

  const linkClass =
    "text-ocean-700 font-medium px-3 py-2 rounded-full hover:bg-ocean-50 transition text-sm";
  const mobileLinkClass =
    "text-ocean-700 font-medium px-4 py-3 rounded-xl hover:bg-ocean-50 transition block";

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-ocean-100"
    >
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-ocean-700 font-display" onClick={closeMenu}>
          🌍 OpenPlaces
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex gap-2 items-center">
          <Link to="/" className={linkClass}>
            {t("navbar.home")}
          </Link>
          <Link to="/about" className={linkClass}>
            {t("navbar.about")}
          </Link>

          {user ? (
            <>
              {user.role === "admin" && (
                <Link to="/admin" className={linkClass}>
                  {t("navbar.admin")}
                </Link>
              )}
              <Link to="/profile" className={linkClass}>
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
              <Link to="/login" className={linkClass}>
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

        {/* Mobile: lingua + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleLanguage}
            className="text-sm font-medium text-ocean-700 border border-ocean-200 px-3 py-1.5 rounded-full"
          >
            {i18n.language.startsWith("it") ? "🇮🇹" : "🇬🇧"}
          </button>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="text-ocean-700 text-2xl w-10 h-10 flex items-center justify-center rounded-xl hover:bg-ocean-50 transition"
            aria-label="Menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile menu a tendina */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden border-t border-ocean-100 bg-white overflow-hidden"
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              <Link to="/" className={mobileLinkClass} onClick={closeMenu}>
                {t("navbar.home")}
              </Link>
              <Link to="/about" className={mobileLinkClass} onClick={closeMenu}>
                {t("navbar.about")}
              </Link>

              {user ? (
                <>
                  {user.role === "admin" && (
                    <Link to="/admin" className={mobileLinkClass} onClick={closeMenu}>
                      {t("navbar.admin")}
                    </Link>
                  )}
                  <Link to="/profile" className={mobileLinkClass} onClick={closeMenu}>
                    {t("navbar.profile")}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-ocean-700 text-white font-semibold px-4 py-3 rounded-xl hover:bg-ocean-800 transition text-left mt-1"
                  >
                    {t("navbar.logout")}
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className={mobileLinkClass} onClick={closeMenu}>
                    {t("navbar.login")}
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="bg-coral-500 text-white font-semibold px-4 py-3 rounded-xl hover:bg-coral-600 transition text-center mt-1 shadow-md shadow-coral-500/30"
                  >
                    {t("navbar.register")}
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

export default Navbar;