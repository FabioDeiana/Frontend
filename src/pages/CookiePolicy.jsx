import { useTranslation } from "react-i18next";
import { motion } from "motion/react";

function CookiePolicy() {
  const { t } = useTranslation();

  return (
    <div className="bg-ocean-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-sm p-8 md:p-10"
        >
          <h1 className="text-3xl text-ocean-700 mb-6">🍪 {t("cookie.title")}</h1>

          <p className="text-gray-600 leading-relaxed mb-6">
            {t("cookie.intro")}
          </p>

          <h2 className="text-xl text-ocean-800 mb-3">{t("cookie.techTitle")}</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            {t("cookie.techText")}
          </p>

          <h2 className="text-xl text-ocean-800 mb-3">{t("cookie.thirdTitle")}</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            {t("cookie.thirdText")}
          </p>

          <h2 className="text-xl text-ocean-800 mb-3">{t("cookie.manageTitle")}</h2>
          <p className="text-gray-600 leading-relaxed">
            {t("cookie.manageText")}
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default CookiePolicy;