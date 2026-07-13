import { useTranslation } from "react-i18next";
import { motion } from "motion/react";

function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="bg-ocean-700 text-white text-center px-6 py-24 relative overflow-hidden">
      {/* Cerchi decorativi sullo sfondo */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-ocean-600 rounded-full opacity-40" />
      <div className="absolute -bottom-32 -right-16 w-96 h-96 bg-ocean-600 rounded-full opacity-40" />

      <div className="relative">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-6xl mb-6"
        >
          {t("hero.title")}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-ocean-100"
        >
          {t("hero.subtitle")}
        </motion.p>

        <motion.a
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          href="#map"
          className="inline-block bg-coral-500 text-white font-semibold px-8 py-4 rounded-full hover:bg-coral-600 transition-colors shadow-lg shadow-coral-500/30"
        >
          {t("hero.cta")} →
        </motion.a>
      </div>
    </section>
  );
}

export default HeroSection;