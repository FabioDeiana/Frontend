import { useTranslation } from "react-i18next";
import { motion } from "motion/react";

function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative text-white text-center px-6 min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Foto di sfondo con overlay scuro */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1920&q=80"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ocean-800/80 via-ocean-700/70 to-ocean-800/90" />
      </div>

      <div className="relative max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl md:text-6xl lg:text-7xl mb-6 leading-tight"
        >
          {t("hero.title")}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
          className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-ocean-100"
        >
          {t("hero.subtitle")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.a
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            href="#map"
            className="bg-coral-500 text-white font-semibold px-8 py-4 rounded-full hover:bg-coral-600 transition-colors shadow-lg shadow-coral-500/40"
          >
            {t("hero.cta")} →
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            href="#how"
            className="bg-white/10 backdrop-blur text-white font-semibold px-8 py-4 rounded-full border border-white/40 hover:bg-white/20 transition-colors"
          >
            {t("hero.secondary")}
          </motion.a>
        </motion.div>
      </div>

      {/* Indicatore scroll */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-2xl"
      >
        ↓
      </motion.div>
    </section>
  );
}

export default HeroSection;