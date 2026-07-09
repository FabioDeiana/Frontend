import { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { DIET_OPTIONS, ACCESSIBILITY_OPTIONS, ALLERGEN_OPTIONS } from "../utils/constants";



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
          : t("newsletter.successUnsubscribe")
      );
    } catch (err) {
      setNewsletterError("Errore durante l'aggiornamento della preferenza");
    } finally {
      setNewsletterLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-green-700 mb-8">{t("profile.title")}</h1>

      {/* Dati base */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">{t("profile.personalData")}</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("profile.name")}
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("profile.email")}
          </label>
          <input
            type="email"
            value={user?.email || ""}
            disabled
            className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-50 text-gray-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("profile.role")}
          </label>
          <span className="inline-block bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full">
            {user?.role}
          </span>
        </div>
      </div>

      {/* Preferenze dietetiche */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">🥗 {t("profile.dietPrefs")}</h2>
        <div className="flex flex-wrap gap-2">
          {DIET_OPTIONS.map((option) => (
            <button
              key={option}
              onClick={() => toggleOption("diet", option)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                formData.preferences.diet.includes(option)
                  ? "bg-green-700 text-white border-green-700"
                  : "bg-white text-gray-600 border-gray-300 hover:border-green-400"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Allergie */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">⚠ {t("profile.allergens")}</h2>
        <div className="flex flex-wrap gap-2">
          {ALLERGEN_OPTIONS.map((option) => (
            <button
              key={option}
              onClick={() => toggleOption("allergens", option)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                formData.preferences.allergens.includes(option)
                  ? "bg-red-600 text-white border-red-600"
                  : "bg-white text-gray-600 border-gray-300 hover:border-red-400"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Accessibilità */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">♿ {t("profile.accessibility")}</h2>
        <div className="flex flex-wrap gap-2">
          {ACCESSIBILITY_OPTIONS.map((option) => (
            <button
              key={option}
              onClick={() => toggleOption("accessibility", option)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                formData.preferences.accessibility.includes(option)
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-lg font-semibold mb-2">📧 {t("profile.newsletter")}</h2>
        <p className="text-sm text-gray-500 mb-4">
          {user?.newsletter?.subscribed
            ? t("profile.newsletterSubscribed")
            : t("profile.newsletterNotSubscribed")}
        </p>

        {newsletterMessage && (
          <p className="bg-green-100 text-green-700 text-sm px-4 py-2 rounded-lg mb-4">
            {newsletterMessage}
          </p>
        )}
        {newsletterError && (
          <p className="bg-red-100 text-red-700 text-sm px-4 py-2 rounded-lg mb-4">
            {newsletterError}
          </p>
        )}

        <div className="flex gap-3">
          {!user?.newsletter?.subscribed ? (
            <button
              onClick={() => handleNewsletter(true)}
              disabled={newsletterLoading}
              className="bg-green-700 text-white font-semibold px-5 py-2 rounded-lg hover:bg-green-800 transition disabled:opacity-50"
            >
              {newsletterLoading ? "..." : t("newsletter.subscribe")}
            </button>
          ) : (
            <button
              onClick={() => handleNewsletter(false)}
              disabled={newsletterLoading}
              className="bg-red-100 text-red-600 font-semibold px-5 py-2 rounded-lg hover:bg-red-200 transition disabled:opacity-50"
            >
              {newsletterLoading ? "..." : t("newsletter.unsubscribe")}
            </button>
          )}
        </div>

        <p className="text-xs text-gray-400 mt-3">
          {t("newsletter.privacy")}
        </p>
      </div>

      {/* Messaggi salvataggio */}
      {error && (
        <p className="bg-red-100 text-red-700 text-sm px-4 py-2 rounded-lg mb-4">
          {error}
        </p>
      )}
      {successMessage && (
        <p className="bg-green-100 text-green-700 text-sm px-4 py-2 rounded-lg mb-4">
          {successMessage}
        </p>
      )}

      {/* Salva */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-green-700 text-white font-semibold px-6 py-3 rounded-lg hover:bg-green-800 transition disabled:opacity-50 mb-10"
      >
        {saving ? t("profile.saving") : t("profile.save")}
      </button>

      {/* Recensioni */}
      <div>
        <h2 className="text-lg font-semibold mb-4">{t("profile.myReviews")}</h2>
        {loading ? (
          <p className="text-gray-500 text-sm">Caricamento...</p>
        ) : reviews.length === 0 ? (
          <p className="text-gray-500 text-sm">{t("profile.noReviews")}</p>
        ) : (
          <div className="flex flex-col gap-4">
            {reviews.map((review) => (
              <div key={review._id} className="bg-gray-50 rounded-xl p-4">
                <p className="font-medium mb-1">{review.activity?.name}</p>
                <div className="flex gap-4 text-sm text-gray-600 mb-2">
                  <span>🌿 Eco: {review.ratings?.ecoFriendliness}/5</span>
                  <span>♿ {t("activity.accessibility")}: {review.ratings?.accessibility}/5</span>
                  <span>🥗 {t("activity.diet")}: {review.ratings?.dietOptions}/5</span>
                </div>
                <p className="text-gray-700 text-sm">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;