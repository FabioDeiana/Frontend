import { useTranslation } from "react-i18next";
import { motion } from "motion/react";

function About() {
  const { t } = useTranslation();

  return (
    <div className="bg-ocean-50 min-h-screen">
      {/* Header con foto */}
      <div className="relative h-64">
        <img
          src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1920&q=80"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-ocean-800/70 flex items-center justify-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl text-white"
          >
            {t("about.title")}
          </motion.h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="bg-white rounded-3xl shadow-sm p-8 md:p-10 flex flex-col gap-6"
        >
          <p className="text-gray-600 text-lg leading-relaxed">{t("about.p1")}</p>
          <p className="text-gray-600 text-lg leading-relaxed">{t("about.p2")}</p>
          <p className="text-gray-600 text-lg leading-relaxed">{t("about.p3")}</p>
        </motion.div>
      </div>
    </div>
  );
}

export default About;