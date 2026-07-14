import { useTranslation } from "react-i18next";
import { motion } from "motion/react";

function MissionSection() {
  const { t } = useTranslation();

  return (
    <section className="py-20 px-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl text-ocean-700 mb-6">
            {t("mission.title")}
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            {t("mission.text")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <img
            src="https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&q=80"
            alt="Mercato locale con prodotti freschi"
            className="rounded-3xl shadow-xl w-full h-80 object-cover"
          />
          <div className="absolute -bottom-4 -left-4 bg-sun-300 text-ocean-800 font-semibold px-4 py-2 rounded-xl shadow-lg text-sm">
            🌱 100% community-driven
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default MissionSection;