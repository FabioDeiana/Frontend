import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      <p className="text-7xl font-bold text-green-700 mb-4">404</p>
      <h1 className="text-2xl font-semibold mb-2">{t("notFound.title")}</h1>
      <p className="text-gray-500 mb-8">{t("notFound.text")}</p>
      <Link
        to="/"
        className="bg-green-700 text-white font-semibold px-6 py-3 rounded-full hover:bg-green-800 transition"
      >
        {t("notFound.backHome")}
      </Link>
    </div>
  );
}

export default NotFound;