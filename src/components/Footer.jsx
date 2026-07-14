import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-ocean-800 text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">

          {/* Logo + tagline */}
          <div>
            <p className="text-xl font-bold mb-3">🌍 OpenPlaces</p>
            <p className="text-sm text-ocean-200 leading-relaxed">
              {t("footer.tagline")}
            </p>
          </div>

          {/* Esplora */}
          <div>
            <p className="font-semibold mb-3 text-ocean-100">{t("footer.explore")}</p>
            <ul className="flex flex-col gap-2 text-sm text-ocean-200">
              <li><Link to="/" className="hover:text-white transition">{t("navbar.home")}</Link></li>
              <li><Link to="/about" className="hover:text-white transition">{t("navbar.about")}</Link></li>
              <li><Link to="/add-activity" className="hover:text-white transition">{t("map.addActivity")}</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <p className="font-semibold mb-3 text-ocean-100">{t("footer.account")}</p>
            <ul className="flex flex-col gap-2 text-sm text-ocean-200">
              <li><Link to="/login" className="hover:text-white transition">{t("navbar.login")}</Link></li>
              <li><Link to="/register" className="hover:text-white transition">{t("navbar.register")}</Link></li>
              <li><Link to="/profile" className="hover:text-white transition">{t("navbar.profile")}</Link></li>
            </ul>
          </div>

          {/* Legale + contatti */}
          <div>
            <p className="font-semibold mb-3 text-ocean-100">{t("footer.info")}</p>
            <ul className="flex flex-col gap-2 text-sm text-ocean-200">
              <li><Link to="/cookie-policy" className="hover:text-white transition">Cookie Policy</Link></li>
              <li>
                <a href="mailto:info@OpenPlaces.it" className="hover:text-white transition">
                  info@OpenPlaces.it
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Riga finale */}
        <div className="border-t border-ocean-600 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-ocean-200">
          <p>© {new Date().getFullYear()} OpenPlaces — {t("footer.rights")}</p>
          <p className="text-xs">{t("footer.madeWith")}</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;