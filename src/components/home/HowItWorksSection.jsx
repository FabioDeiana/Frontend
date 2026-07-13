import { useTranslation } from "react-i18next";

function HowItWorksSection() {
  const { t } = useTranslation();

  const steps = [
    {
      emoji: "🗺️",
      title: t("howItWorks.step1Title"),
      description: t("howItWorks.step1Desc"),
    },
    {
      emoji: "⭐",
      title: t("howItWorks.step2Title"),
      description: t("howItWorks.step2Desc"),
    },
    {
      emoji: "🌱",
      title: t("howItWorks.step3Title"),
      description: t("howItWorks.step3Desc"),
    },
  ];

  return (
    <section className="py-16 px-6 bg-ocean-50">
      <h2 className="text-3xl font-bold mb-12 text-center text-ocean-700">
        ✨ {t("howItWorks.title")}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {steps.map((step) => (
          <div
            key={step.title}
            className="text-center bg-white rounded-3xl p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
          >
            <div className="text-5xl mb-4">{step.emoji}</div>
            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
            <p className="text-gray-600">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HowItWorksSection;
