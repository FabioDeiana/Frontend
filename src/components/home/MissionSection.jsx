import { useTranslation } from "react-i18next";

function MissionSection() {
  const { t } = useTranslation();

  return (
    <section className="py-16 px-6 max-w-4xl mx-auto text-center">
      <h2 className="text-3xl font-bold mb-4 text-green-700">
        {t("mission.title")}
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        {t("mission.text")}
      </p>
    </section>
  );
}

export default MissionSection;