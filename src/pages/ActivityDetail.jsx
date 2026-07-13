import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

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

  // Cerca la recensione già lasciata dall'utente loggato (se esiste)
  const userId = user?.id || user?._id;
  const myReview = user
    ? reviews.find((r) => (r.user?._id || r.user) === userId)
    : null;

  const averages =
    reviews.length > 0
      ? {
          eco: (reviews.reduce((sum, r) => sum + (r.ratings?.ecoFriendliness || 0), 0) / reviews.length).toFixed(1),
          accessibility: (reviews.reduce((sum, r) => sum + (r.ratings?.accessibility || 0), 0) / reviews.length).toFixed(1),
          diet: (reviews.reduce((sum, r) => sum + (r.ratings?.dietOptions || 0), 0) / reviews.length).toFixed(1),
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

  // Se l'utente ha già una recensione, precarica i suoi valori nel form
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
        // Modifica recensione esistente
        const response = await api.put(
          `/activities/${id}/reviews/${myReview._id}`,
          reviewForm
        );
        setReviews((prev) =>
          prev.map((r) =>
            r._id === myReview._id
              ? { ...response.data.review, user: myReview.user }
              : r
          )
        );
        setReviewSuccess(t("activity.reviewUpdated"));
      } else {
        // Nuova recensione
        const response = await api.post(`/activities/${id}/reviews`, reviewForm);
        setReviews((prev) => [...prev, response.data.review]);
        setReviewSuccess(t("activity.reviewCreated"));
      }
    } catch (err) {
      setReviewError(err.response?.data?.message || "Errore nell'invio della recensione");
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) return <p className="text-center py-20">Caricamento...</p>;
  if (error) return <p className="text-center py-20 text-red-600">{error}</p>;
  if (!activity) return null;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">

      {activity.image && (
        <img
          src={activity.image}
          alt={activity.name}
          className="w-full h-64 object-cover rounded-2xl mb-6"
        />
      )}

      <div className="mb-6">
        <span className="text-sm bg-ocean-100 text-ocean-700 font-medium px-3 py-1 rounded-full">
          {t(`categories.${activity.category}`)}
        </span>
        {activity.verified && (
          <span className="ml-2 text-sm bg-sun-100 text-ocean-700 font-medium px-3 py-1 rounded-full">
            ✓ {t("activity.verified")}
          </span>
        )}
        <h1 className="text-3xl font-bold mt-3 mb-1">{activity.name}</h1>
        <p className="text-gray-500">{activity.address}, {activity.city}</p>

        {averages && (
          <div className="flex flex-wrap gap-4 mt-3 bg-ocean-50 rounded-xl px-4 py-3 text-sm">
            <span className="font-medium">🌿 {averages.eco}/5</span>
            <span className="font-medium">♿ {averages.accessibility}/5</span>
            <span className="font-medium">🥗 {averages.diet}/5</span>
            <span className="text-gray-400">
              ({reviews.length} {t("activity.reviews").toLowerCase()})
            </span>
          </div>
        )}
      </div>

      <p className="text-gray-700 mb-8">{activity.description}</p>

      {(activity.tags?.diet?.length > 0 ||
        activity.tags?.accessibility?.length > 0 ||
        activity.tags?.other?.length > 0) && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Caratteristiche</h2>
          <div className="flex flex-wrap gap-2">
            {activity.tags.diet.map((tag) => (
              <span key={tag} className="bg-ocean-50 text-ocean-700 text-sm px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
            {activity.tags.accessibility.map((tag) => (
              <span key={tag} className="bg-ocean-100 text-ocean-700 text-sm px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
            {activity.tags.other.map((tag) => (
              <span key={tag} className="bg-ocean-50 text-gray-600 text-sm px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {activity.category === "ristorante" && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">{t("activity.menu")}</h2>
          {menuItems.length === 0 ? (
            <p className="text-gray-500 text-sm">{t("activity.noMenu")}</p>
          ) : (
            <div className="flex flex-col gap-3">
              {menuItems.map((item) => (
                <div key={item._id} className="bg-ocean-50 rounded-xl p-4 flex justify-between items-start">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    {item.description && (
                      <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                    )}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.dietTags.map((tag) => (
                        <span key={tag} className="bg-ocean-50 text-ocean-700 text-xs px-2 py-0.5 rounded-full">
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
                  <span className="font-semibold text-ocean-700 ml-4 whitespace-nowrap">
                    €{item.price.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {user && (
        <div className="mb-8 bg-ocean-50 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">
            {myReview ? t("activity.editReview") : t("activity.leaveReview")}
          </h2>

          {reviewError && (
            <p className="bg-red-100 text-red-700 text-sm px-4 py-2 rounded-lg mb-4">
              {reviewError}
            </p>
          )}
          {reviewSuccess && (
            <p className="bg-ocean-100 text-ocean-700 text-sm px-4 py-2 rounded-lg mb-4">
              {reviewSuccess}
            </p>
          )}

          <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
            {[
              { name: "ecoFriendliness", label: `🌿 ${t("activity.eco")}` },
              { name: "accessibility", label: `♿ ${t("activity.accessibility")}` },
              { name: "dietOptions", label: `🥗 ${t("activity.diet")}` },
            ].map(({ name, label }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {label}: {reviewForm.ratings[name]}/5
                </label>
                <input
                  type="range"
                  name={name}
                  min="1"
                  max="5"
                  value={reviewForm.ratings[name]}
                  onChange={handleReviewChange}
                  className="w-full accent-ocean-600"
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("activity.comment")}
              </label>
              <textarea
                name="comment"
                value={reviewForm.comment}
                onChange={handleReviewChange}
                required
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ocean-400"
              />
            </div>

            <button
              type="submit"
              disabled={reviewLoading}
              className="bg-ocean-700 text-white font-semibold py-2 rounded-lg hover:bg-ocean-800 transition disabled:opacity-50"
            >
              {reviewLoading
                ? t("activity.submitting")
                : myReview
                ? t("activity.updateReview")
                : t("activity.submitReview")}
            </button>
          </form>
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold mb-4">
          {t("activity.reviews")} ({reviews.length})
        </h2>

        {reviews.length === 0 ? (
          <p className="text-gray-500 text-sm">{t("activity.noReviews")}</p>
        ) : (
          <div className="flex flex-col gap-4">
            {reviews.map((review) => (
              <div key={review._id} className="bg-ocean-50 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{review.user?.name}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
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

export default ActivityDetail;