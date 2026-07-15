import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";

const CATEGORY_IMAGES = {
  ristorante:
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=80",
  negozio:
    "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1600&q=80",
  mercato:
    "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1600&q=80",
  alloggio:
    "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=1600&q=80",
  punto_riciclo:
    "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=1600&q=80",
  servizio:
    "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=1600&q=80",
  altro:
    "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1600&q=80",
};

function ActivityDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [activity, setActivity] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [reviewForm, setReviewForm] = useState({
    comment: "",
    ratings: { ecoFriendliness: 5, accessibility: 5, dietOptions: 5 },
  });
  const [reviewError, setReviewError] = useState(null);
  const [reviewSuccess, setReviewSuccess] = useState(null);
  const [reviewLoading, setReviewLoading] = useState(false);

  const userId = user?.id || user?._id;
  const myReview = user
    ? reviews.find((r) => (r.user?._id || r.user) === userId)
    : null;

  const averages =
    reviews.length > 0
      ? {
          eco: (
            reviews.reduce(
              (sum, r) => sum + (r.ratings?.ecoFriendliness || 0),
              0,
            ) / reviews.length
          ).toFixed(1),
          accessibility: (
            reviews.reduce(
              (sum, r) => sum + (r.ratings?.accessibility || 0),
              0,
            ) / reviews.length
          ).toFixed(1),
          diet: (
            reviews.reduce((sum, r) => sum + (r.ratings?.dietOptions || 0), 0) /
            reviews.length
          ).toFixed(1),
        }
      : null;

  useEffect(() => {
    async function fetchData() {
      try {
        const [activityRes, reviewsRes, menuRes] = await Promise.all([
          api.get(`/activities/${id}`),
          api.get(`/activities/${id}/reviews`),
          api.get(`/activities/${id}/menu`),
        ]);
        setActivity(activityRes.data);
        setReviews(reviewsRes.data);
        setMenuItems(menuRes.data);
      } catch (err) {
        setError("Errore nel caricamento dell'attività");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  useEffect(() => {
    if (myReview) {
      setReviewForm({
        comment: myReview.comment || "",
        ratings: {
          ecoFriendliness: myReview.ratings?.ecoFriendliness || 5,
          accessibility: myReview.ratings?.accessibility || 5,
          dietOptions: myReview.ratings?.dietOptions || 5,
        },
      });
    }
  }, [myReview?._id]);

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    if (["ecoFriendliness", "accessibility", "dietOptions"].includes(name)) {
      setReviewForm((prev) => ({
        ...prev,
        ratings: { ...prev.ratings, [name]: Number(value) },
      }));
    } else {
      setReviewForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError(null);
    setReviewSuccess(null);
    setReviewLoading(true);

    try {
      if (myReview) {
        const response = await api.put(
          `/activities/${id}/reviews/${myReview._id}`,
          reviewForm,
        );
        setReviews((prev) =>
          prev.map((r) =>
            r._id === myReview._id
              ? { ...response.data.review, user: myReview.user }
              : r,
          ),
        );
        setReviewSuccess(t("activity.reviewUpdated"));
      } else {
        const response = await api.post(
          `/activities/${id}/reviews`,
          reviewForm,
        );
        setReviews((prev) => [...prev, response.data.review]);
        setReviewSuccess(t("activity.reviewCreated"));
      }
    } catch (err) {
      setReviewError(
        err.response?.data?.message || "Errore nell'invio della recensione",
      );
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) return <p className="text-center py-20">Caricamento...</p>;
  if (error) return <p className="text-center py-20 text-red-600">{error}</p>;
  if (!activity) return null;

  return (
    <div className="bg-ocean-50 min-h-screen pb-16">

      {/* Hero immersivo con immagine */}
      <div className="relative h-80 md:h-96">
        <img
          src={activity.image || CATEGORY_IMAGES[activity.category] || CATEGORY_IMAGES.altro}
          alt={activity.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ocean-800/90 via-ocean-800/30 to-transparent" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute bottom-0 left-0 right-0 max-w-5xl mx-auto px-6 pb-8 text-white"
        >
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-sm bg-white/20 backdrop-blur font-medium px-3 py-1 rounded-full">
              {t(`categories.${activity.category}`)}
            </span>
            {activity.verified && (
              <span className="text-sm bg-sun-300 text-ocean-800 font-medium px-3 py-1 rounded-full">
                ✓ {t("activity.verified")}
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-5xl mb-2">{activity.name}</h1>
          <p className="text-ocean-100">📍 {activity.address}, {activity.city}</p>
        </motion.div>
      </div>

      {/* Contenuto a due colonne */}
      <div className="max-w-5xl mx-auto px-6 -mt-6 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Colonna principale */}
          <div className="md:col-span-2 flex flex-col gap-6">

            {/* Descrizione */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-3xl p-6 md:p-8 shadow-sm"
            >
              <p className="text-gray-600 text-lg leading-relaxed">
                {activity.description}
              </p>
            </motion.div>

            {/* Menu — solo per ristoranti */}
            {activity.category === "ristorante" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-3xl p-6 md:p-8 shadow-sm"
              >
                <h2 className="text-xl mb-4 text-ocean-800">🍽️ {t("activity.menu")}</h2>
                {menuItems.length === 0 ? (
                  <p className="text-gray-500 text-sm">{t("activity.noMenu")}</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {menuItems.map((item) => (
                      <div key={item._id} className="bg-ocean-50 rounded-2xl p-5 flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-ocean-800">{item.name}</p>
                          {item.description && (
                            <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                          )}
                          <div className="flex flex-wrap gap-1 mt-2">
                            {item.dietTags.map((tag) => (
                              <span key={tag} className="bg-mint-100 text-mint-700 text-xs px-2 py-0.5 rounded-full">
                                {tag}
                              </span>
                            ))}
                            {item.allergens.map((allergen) => (
                              <span key={allergen} className="bg-red-50 text-red-600 text-xs px-2 py-0.5 rounded-full">
                                ⚠ {allergen}
                              </span>
                            ))}
                          </div>
                        </div>
                        <span className="font-bold text-coral-600 ml-4 whitespace-nowrap">
                          €{item.price.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Form recensione */}
            {user && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-3xl p-6 md:p-8 shadow-sm"
              >
                <h2 className="text-xl mb-5 text-ocean-800">
                  ✍️ {myReview ? t("activity.editReview") : t("activity.leaveReview")}
                </h2>

                {reviewError && (
                  <p className="bg-red-100 text-red-700 text-sm px-4 py-2 rounded-xl mb-4">
                    {reviewError}
                  </p>
                )}
                {reviewSuccess && (
                  <motion.p
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-mint-100 text-mint-700 text-sm px-4 py-2 rounded-xl mb-4"
                  >
                    {reviewSuccess}
                  </motion.p>
                )}

                <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
                  {[
                    { name: "ecoFriendliness", label: `🌿 ${t("activity.eco")}` },
                    { name: "accessibility", label: `♿ ${t("activity.accessibility")}` },
                    { name: "dietOptions", label: `🥗 ${t("activity.diet")}` },
                  ].map(({ name, label }) => (
                    <div key={name}>
                      <label className="block text-sm font-medium text-ocean-800 mb-1">
                        {label}: <span className="font-bold">{reviewForm.ratings[name]}/5</span>
                      </label>
                      <input
                        type="range"
                        name={name}
                        min="1"
                        max="5"
                        value={reviewForm.ratings[name]}
                        onChange={handleReviewChange}
                        className="w-full accent-coral-500"
                      />
                    </div>
                  ))}

                  <div>
                    <label className="block text-sm font-medium text-ocean-800 mb-1">
                      {t("activity.comment")}
                    </label>
                    <textarea
                      name="comment"
                      value={reviewForm.comment}
                      onChange={handleReviewChange}
                      required
                      rows={3}
                      className="w-full border border-ocean-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ocean-400 transition"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={reviewLoading}
                    className="bg-coral-500 text-white font-semibold py-3 rounded-xl hover:bg-coral-600 transition disabled:opacity-50 shadow-lg shadow-coral-500/30"
                  >
                    {reviewLoading
                      ? t("activity.submitting")
                      : myReview
                      ? t("activity.updateReview")
                      : t("activity.submitReview")}
                  </motion.button>
                </form>
              </motion.div>
            )}

            {/* Recensioni */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl p-6 md:p-8 shadow-sm"
            >
              <h2 className="text-xl mb-5 text-ocean-800">
                💬 {t("activity.reviews")} ({reviews.length})
              </h2>

              {reviews.length === 0 ? (
                <p className="text-gray-500 text-sm">{t("activity.noReviews")}</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {reviews.map((review) => (
                    <div key={review._id} className="bg-ocean-50 rounded-2xl p-5">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-ocean-700 text-white rounded-full flex items-center justify-center font-bold text-sm">
                            {review.user?.name?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                          <span className="font-semibold text-ocean-800">{review.user?.name}</span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-2">
                        <span>🌿 {review.ratings?.ecoFriendliness}/5</span>
                        <span>♿ {review.ratings?.accessibility}/5</span>
                        <span>🥗 {review.ratings?.dietOptions}/5</span>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6">

            {/* Card valutazioni */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-3xl p-6 shadow-sm"
            >
              <h3 className="font-semibold text-ocean-800 mb-4">⭐ {t("activity.ratings")}</h3>
              {averages ? (
                <div className="flex flex-col gap-3">
                  {[
                    { emoji: "🌿", label: t("activity.eco"), value: averages.eco },
                    { emoji: "♿", label: t("activity.accessibility"), value: averages.accessibility },
                    { emoji: "🥗", label: t("activity.diet"), value: averages.diet },
                  ].map((r) => (
                    <div key={r.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-500">{r.emoji} {r.label}</span>
                        <span className="font-bold text-ocean-700">{r.value}</span>
                      </div>
                      <div className="h-2 bg-ocean-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(r.value / 5) * 100}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                          className="h-full bg-coral-500 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                  <p className="text-xs text-gray-400 mt-1">
                    {reviews.length} {t("activity.reviews").toLowerCase()}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-400">{t("activity.noReviews")}</p>
              )}
            </motion.div>

            {/* Card caratteristiche */}
            {(activity.tags?.diet?.length > 0 ||
              activity.tags?.accessibility?.length > 0 ||
              activity.tags?.other?.length > 0) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white rounded-3xl p-6 shadow-sm"
              >
                <h3 className="font-semibold text-ocean-800 mb-4">✨ {t("activity.features")}</h3>
                <div className="flex flex-wrap gap-2">
                  {activity.tags.diet.map((tag) => (
                    <span key={tag} className="bg-mint-100 text-mint-700 text-sm font-medium px-3 py-1.5 rounded-full">
                      🥗 {tag}
                    </span>
                  ))}
                  {activity.tags.accessibility.map((tag) => (
                    <span key={tag} className="bg-ocean-100 text-ocean-700 text-sm font-medium px-3 py-1.5 rounded-full">
                      ♿ {tag}
                    </span>
                  ))}
                  {activity.tags.other.map((tag) => (
                    <span key={tag} className="bg-sun-100 text-ocean-700 text-sm font-medium px-3 py-1.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActivityDetail;
