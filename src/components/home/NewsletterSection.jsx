import { useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";

function NewsletterSection() {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleSubscribe = async () => {
    if (!email) return;
    setLoading(true);
    setStatus(null);

    try {
      await api.post("/newsletter/subscribe", { email });
      setStatus("success");
      setMessage(t("newsletter.successSubscribe"));
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err.response?.data?.message || t("newsletter.error"));
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (subscribed) => {
    setLoading(true);
    setStatus(null);

    try {
      await api.put("/newsletter/preference", { subscribed });
      setStatus("success");
      setMessage(subscribed ? t("newsletter.successSubscribe") : t("newsletter.successUnsubscribe"));
    } catch (err) {
      setStatus("error");
      setMessage(t("newsletter.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 px-6 bg-ocean-50">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-ocean-700 mb-3">
          {t("newsletter.title")}
        </h2>
        <p className="text-gray-600 mb-2">
          {t("newsletter.subtitle")}
        </p>
        <p className="text-sm text-gray-400 mb-8">
          {t("newsletter.privacy")}
        </p>

        {status && (
          <p className={`text-sm px-4 py-2 rounded-lg mb-4 ${
            status === "success"
              ? "bg-mint-100 text-mint-700"
              : "bg-red-100 text-red-700"
          }`}>
            {message}
          </p>
        )}

        {user ? (
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => handleToggle(true)}
              disabled={loading}
              className="bg-coral-500 text-white font-semibold px-6 py-3 rounded-full hover:bg-coral-600 transition disabled:opacity-50 shadow-lg shadow-coral-500/30"
            >
              {t("newsletter.subscribe")}
            </button>
            <button
              onClick={() => handleToggle(false)}
              disabled={loading}
              className="bg-white text-ocean-700 font-semibold px-6 py-3 rounded-full border border-ocean-200 hover:bg-ocean-50 transition disabled:opacity-50"
            >
              {t("newsletter.unsubscribe")}
            </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("newsletter.placeholder")}
              className="border border-ocean-200 bg-white rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-ocean-400 sm:w-72"
            />
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="bg-coral-500 text-white font-semibold px-6 py-3 rounded-full hover:bg-coral-600 transition disabled:opacity-50 shadow-lg shadow-coral-500/30"
            >
              {loading ? "..." : t("newsletter.subscribe")}
            </button>
          </div>
        )}

        <p className="text-xs text-gray-400 mt-4">
          {t("newsletter.cancel")}
        </p>
      </div>
    </section>
  );
}

export default NewsletterSection;