import { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import {
  DIET_OPTIONS,
  ACCESSIBILITY_OPTIONS,
  ALLERGEN_OPTIONS,
} from "../utils/constants";

function Profile() {
  const { user, updateUser } = useAuth();
  const { t } = useTranslation();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [newsletterMessage, setNewsletterMessage] = useState(null);
  const [newsletterError, setNewsletterError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    preferences: {
      diet: [],
      accessibility: [],
      allergens: [],
    },
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        preferences: {
          diet: user.preferences?.diet || [],
          accessibility: user.preferences?.accessibility || [],
          allergens: user.preferences?.allergens || [],
        },
      });
    }
  }, [user]);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await api.get("/auth/me/reviews");
        setReviews(response.data);
      } catch (err) {
        // recensioni non disponibili, non blocchiamo la pagina
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, []);

  const toggleOption = (field, value) => {
    setFormData((prev) => {
      const current = prev.preferences[field];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return {
        ...prev,
        preferences: { ...prev.preferences, [field]: updated },
      };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await api.put("/auth/me", {
        name: formData.name,
        preferences: formData.preferences,
      });
      updateUser(response.data.user);
      setSuccessMessage(t("profile.saveSuccess"));
    } catch (err) {
      setError("Errore durante il salvataggio");
    } finally {
      setSaving(false);
    }
  };

  const handleNewsletter = async (subscribed) => {
    setNewsletterLoading(true);
    setNewsletterMessage(null);
    setNewsletterError(null);

    try {
      const response = await api.put("/newsletter/preference", { subscribed });
      updateUser(response.data.user);
      setNewsletterMessage(
        subscribed
          ? t("newsletter.successSubscribe")
          : t("newsletter.successUnsubscribe"),
      );
    } catch (err) {
      setNewsletterError("Errore durante l'aggiornamento della preferenza");
    } finally {
      setNewsletterLoading(false);
    }
  };

  const cardAnimation = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.4 },
  };

  return (
    <div className="bg-ocean-50 min-h-screen">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative bg-ocean-700 rounded-3xl p-8 mb-8 overflow-hidden text-white"
        >
          {/* Decorazioni */}
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-ocean-600 rounded-full opacity-60" />
          <div className="absolute -bottom-14 -left-8 w-40 h-40 bg-ocean-600 rounded-full opacity-40" />

          <div className="relative flex items-center gap-5">
            {/* Avatar a iniziale */}
            <div className="w-20 h-20 bg-coral-500 rounded-full flex items-center justify-center text-3xl font-bold shadow-lg shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl mb-1">{user?.name}</h1>
              <p className="text-ocean-200 text-sm">{user?.email}</p>
              <div className="flex gap-2 mt-2">
                <span className="bg-white/20 backdrop-blur text-xs font-medium px-3 py-1 rounded-full">
                  {user?.role}
                </span>
                {user?.newsletter?.subscribed && (
                  <span className="bg-sun-300 text-ocean-800 text-xs font-medium px-3 py-1 rounded-full">
                    📧 Newsletter
                  </span>
                )}
                <span className="bg-white/20 backdrop-blur text-xs font-medium px-3 py-1 rounded-full">
                  💬 {reviews.length} {t("activity.reviews").toLowerCase()}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Dati base */}
        <motion.div
          {...cardAnimation}
          className="bg-white rounded-3xl shadow-sm p-6 mb-6"
        >
          <h2 className="text-lg font-semibold mb-4 text-ocean-800">
            {t("profile.personalData")}
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-ocean-800 mb-1">
              {t("profile.name")}
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border border-ocean-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ocean-400 transition"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-ocean-800 mb-1">
              {t("profile.email")}
            </label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full border border-ocean-100 rounded-xl px-4 py-3 bg-ocean-50 text-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ocean-800 mb-1">
              {t("profile.role")}
            </label>
            <span className="inline-block bg-ocean-100 text-ocean-700 text-sm font-medium px-3 py-1 rounded-full">
              {user?.role}
            </span>
          </div>
        </motion.div>

        {/* Preferenze dietetiche */}
        <motion.div
          {...cardAnimation}
          className="bg-white rounded-3xl shadow-sm p-6 mb-6"
        >
          <h2 className="text-lg font-semibold mb-4 text-ocean-800">
            🥗 {t("profile.dietPrefs")}
          </h2>
          <div className="flex flex-wrap gap-2">
            {DIET_OPTIONS.map((option) => (
              <button
                key={option}
                onClick={() => toggleOption("diet", option)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                  formData.preferences.diet.includes(option)
                    ? "bg-mint-500 text-white border-mint-500"
                    : "bg-white text-gray-600 border-ocean-200 hover:border-mint-500"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Allergie */}
        <motion.div
          {...cardAnimation}
          className="bg-white rounded-3xl shadow-sm p-6 mb-6"
        >
          <h2 className="text-lg font-semibold mb-4 text-ocean-800">
            ⚠ {t("profile.allergens")}
          </h2>
          <div className="flex flex-wrap gap-2">
            {ALLERGEN_OPTIONS.map((option) => (
              <button
                key={option}
                onClick={() => toggleOption("allergens", option)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                  formData.preferences.allergens.includes(option)
                    ? "bg-coral-500 text-white border-coral-500"
                    : "bg-white text-gray-600 border-ocean-200 hover:border-coral-500"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Accessibilità */}
        <motion.div
          {...cardAnimation}
          className="bg-white rounded-3xl shadow-sm p-6 mb-6"
        >
          <h2 className="text-lg font-semibold mb-4 text-ocean-800">
            ♿ {t("profile.accessibility")}
          </h2>
          <div className="flex flex-wrap gap-2">
            {ACCESSIBILITY_OPTIONS.map((option) => (
              <button
                key={option}
                onClick={() => toggleOption("accessibility", option)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                  formData.preferences.accessibility.includes(option)
                    ? "bg-ocean-600 text-white border-ocean-600"
                    : "bg-white text-gray-600 border-ocean-200 hover:border-ocean-400"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Newsletter */}
        <motion.div
          {...cardAnimation}
          className="bg-white rounded-3xl shadow-sm p-6 mb-6"
        >
          <h2 className="text-lg font-semibold mb-2 text-ocean-800">
            📧 {t("profile.newsletter")}
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            {user?.newsletter?.subscribed
              ? t("profile.newsletterSubscribed")
              : t("profile.newsletterNotSubscribed")}
          </p>

          {newsletterMessage && (
            <p className="bg-mint-100 text-mint-700 text-sm px-4 py-2 rounded-xl mb-4">
              {newsletterMessage}
            </p>
          )}
          {newsletterError && (
            <p className="bg-red-100 text-red-700 text-sm px-4 py-2 rounded-xl mb-4">
              {newsletterError}
            </p>
          )}

          <div className="flex gap-3">
            {!user?.newsletter?.subscribed ? (
              <button
                onClick={() => handleNewsletter(true)}
                disabled={newsletterLoading}
                className="bg-coral-500 text-white font-semibold px-5 py-2 rounded-xl hover:bg-coral-600 transition disabled:opacity-50"
              >
                {newsletterLoading ? "..." : t("newsletter.subscribe")}
              </button>
            ) : (
              <button
                onClick={() => handleNewsletter(false)}
                disabled={newsletterLoading}
                className="bg-red-100 text-red-600 font-semibold px-5 py-2 rounded-xl hover:bg-red-200 transition disabled:opacity-50"
              >
                {newsletterLoading ? "..." : t("newsletter.unsubscribe")}
              </button>
            )}
          </div>

          <p className="text-xs text-gray-400 mt-3">
            {t("newsletter.privacy")}
          </p>
        </motion.div>

        {/* Messaggi salvataggio */}
        {error && (
          <p className="bg-red-100 text-red-700 text-sm px-4 py-2 rounded-xl mb-4">
            {error}
          </p>
        )}
        {successMessage && (
          <motion.p
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-mint-100 text-mint-700 text-sm px-4 py-2 rounded-xl mb-4"
          >
            {successMessage}
          </motion.p>
        )}

        {/* Salva */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={saving}
          className="bg-coral-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-coral-600 transition disabled:opacity-50 mb-10 shadow-lg shadow-coral-500/30"
        >
          {saving ? t("profile.saving") : t("profile.save")}
        </motion.button>

        {/* Recensioni */}
        <motion.div
          {...cardAnimation}
          className="bg-white rounded-3xl shadow-sm p-6"
        >
          <h2 className="text-lg font-semibold mb-4 text-ocean-800">
            💬 {t("profile.myReviews")}
          </h2>
          {loading ? (
            <p className="text-gray-500 text-sm">Caricamento...</p>
          ) : reviews.length === 0 ? (
            <p className="text-gray-500 text-sm">{t("profile.noReviews")}</p>
          ) : (
            <div className="flex flex-col gap-4">
              {reviews.map((review) => (
                <div key={review._id} className="bg-ocean-50 rounded-2xl p-5">
                  <p className="font-semibold mb-1 text-ocean-800">
                    {review.activity?.name}
                  </p>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-2">
                    <span>🌿 {review.ratings?.ecoFriendliness}/5</span>
                    <span>♿ {review.ratings?.accessibility}/5</span>
                    <span>🥗 {review.ratings?.dietOptions}/5</span>
                  </div>
                  <p className="text-gray-600 text-sm">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default Profile;
