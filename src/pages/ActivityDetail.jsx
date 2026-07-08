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
  const [reviewLoading, setReviewLoading] = useState(false);

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
    setReviewLoading(true);

    try {
      const response = await api.post(`/activities/${id}/reviews`, reviewForm);
      setReviews((prev) => [...prev, response.data.review]);
      setReviewForm({
        comment: "",
        ratings: { ecoFriendliness: 5, accessibility: 5, dietOptions: 5 },
      });
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
        <span className="text-sm bg-green-100 text-green-700 font-medium px-3 py-1 rounded-full">
          {activity.category}
        </span>
        {activity.verified && (
          <span className="ml-2 text-sm bg-blue-100 text-blue-700 font-medium px-3 py-1 rounded-full">
            ✓ {t("activity.verified")}
          </span>
        )}
        <h1 className="text-3xl font-bold mt-3 mb-1">{activity.name}</h1>
        <p className="text-gray-500">{activity.address}, {activity.city}</p>
      </div>

      <p className="text-gray-700 mb-8">{activity.description}</p>

      {(activity.tags?.diet?.length > 0 ||
        activity.tags?.accessibility?.length > 0 ||
        activity.tags?.other?.length > 0) && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Caratteristiche</h2>
          <div className="flex flex-wrap gap-2">
            {activity.tags.diet.map((tag) => (
              <span key={tag} className="bg-green-50 text-green-700 text-sm px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
            {activity.tags.accessibility.map((tag) => (
              <span key={tag} className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
            {activity.tags.other.map((tag) => (
              <span key={tag} className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">
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
                <div key={item._id} className="bg-gray-50 rounded-xl p-4 flex justify-between items-start">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    {item.description && (
                      <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                    )}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.dietTags.map((tag) => (
                        <span key={tag} className="bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full">
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
                  <span className="font-semibold text-green-700 ml-4 whitespace-nowrap">
                    €{item.price.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {user && (
        <div className="mb-8 bg-green-50 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">{t("activity.leaveReview")}</h2>

          {reviewError && (
            <p className="bg-red-100 text-red-700 text-sm px-4 py-2 rounded-lg mb-4">
              {reviewError}
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
                  className="w-full accent-green-600"
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
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <button
              type="submit"
              disabled={reviewLoading}
              className="bg-green-700 text-white font-semibold py-2 rounded-lg hover:bg-green-800 transition disabled:opacity-50"
            >
              {reviewLoading ? t("activity.submitting") : t("activity.submitReview")}
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
              <div key={review._id} className="bg-gray-50 rounded-xl p-4">
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