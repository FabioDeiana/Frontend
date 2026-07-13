import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function CTASection() {
  const { t } = useTranslation();

  return (
    <section className="py-16 px-6 bg-ocean-700 text-white text-center">
      <h2 className="text-3xl font-bold mb-4">{t("cta.title")}</h2>
      <p className="text-lg mb-8 max-w-xl mx-auto text-ocean-100">
        {t("cta.subtitle")}
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/register"
          className="bg-coral-500 text-white font-semibold px-6 py-3 rounded-full hover:bg-coral-600 transition shadow-lg shadow-coral-500/30"
        >
          {t("cta.registerUser")}
        </Link>
        <Link
          to="/register?type=owner"
          className="bg-transparent text-white font-semibold px-6 py-3 rounded-full hover:bg-ocean-600 transition border-2 border-white"
        >
          {t("cta.registerBusiness")}
        </Link>
      </div>
    </section>
  );
}

export default CTASection;