import { useTranslation } from "react-i18next";
import { motion } from "motion/react";

function HowItWorksSection() {
  const { t } = useTranslation();

  const steps = [
    {
      image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&q=80",
      title: t("howItWorks.step1Title"),
      description: t("howItWorks.step1Desc"),
    },
    {
      image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&q=80",
      title: t("howItWorks.step2Title"),
      description: t("howItWorks.step2Desc"),
    },
    {
      image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&q=80",
      title: t("howItWorks.step3Title"),
      description: t("howItWorks.step3Desc"),
    },
  ];

  return (
    <section id="how" className="py-20 px-6 bg-ocean-50">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-4xl mb-14 text-center text-ocean-700"
      >
        {t("howItWorks.title")}
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {steps.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            whileHover={{ y: -8 }}
            className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
          >
            <img
              src={step.image}
              alt={step.title}
              className="w-full h-44 object-cover"
            />
            <div className="p-6 text-center">
              <div className="inline-block bg-coral-100 text-coral-600 font-bold text-sm w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-3">
                {index + 1}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-ocean-800">{step.title}</h3>
              <p className="text-gray-600 text-sm">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default HowItWorksSection;