import { useTranslation } from "react-i18next";

function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="bg-green-700 text-white text-center py-20 px-6">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">
        {t("hero.title")}
      </h1>
      <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
        {t("hero.subtitle")}
      </p>
      <a href="#map" className="bg-white text-green-700 font-semibold px-6 py-3 rounded-full hover:bg-green-100 transition">
        {t("hero.cta")}
      </a>
    </section>
  );
}

export default HeroSection;