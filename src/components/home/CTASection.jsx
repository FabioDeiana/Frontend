import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function CTASection() {
  const { t } = useTranslation();

  return (
    <section className="py-16 px-6 bg-green-700 text-white text-center">
      <h2 className="text-3xl font-bold mb-4">{t("cta.title")}</h2>
      <p className="text-lg mb-8 max-w-xl mx-auto">
        {t("cta.subtitle")}
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/register"
          className="bg-white text-green-700 font-semibold px-6 py-3 rounded-full hover:bg-green-100 transition"
        >
          {t("cta.registerUser")}
        </Link>
        <Link
          to="/register?type=owner"
          className="bg-green-900 text-white font-semibold px-6 py-3 rounded-full hover:bg-green-800 transition border border-white"
        >
          {t("cta.registerBusiness")}
        </Link>
      </div>
    </section>
  );
}

export default CTASection;