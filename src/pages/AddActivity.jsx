import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../services/api";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import {
  CATEGORIES,
  DIET_OPTIONS,
  ACCESSIBILITY_OPTIONS,
  FOOD_BASE_OPTIONS,
} from "../utils/constants";

function AddActivity() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    address: "",
    city: "",
  });
  const [tags, setTags] = useState({
    diet: [],
    accessibility: [],
    foodBases: [],
  });
  const [coordinates, setCoordinates] = useState(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleTag = (field, value) => {
    setTags((prev) => {
      const current = prev[field];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [field]: updated };
    });
  };

  const handleGeocode = async () => {
    if (!formData.address || !formData.city) return;
    setGeoLoading(true);
    setGeoError(null);

    try {
      const query = `${formData.address}, ${formData.city}, Italia`;
      const response = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            q: query,
            format: "json",
            limit: 1,
          },
        },
      );

      if (response.data.length === 0) {
        setGeoError(t("addActivity.notFound"));
        return;
      }

      const { lat, lon } = response.data[0];
      setCoordinates({ lat: parseFloat(lat), lng: parseFloat(lon) });
    } catch (err) {
      setGeoError(t("addActivity.notFound"));
    } finally {
      setGeoLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.category) {
      setError(t("addActivity.missingCategory"));
      return;
    }

    if (!coordinates) {
      setError(t("addActivity.missingCoordinates"));
      return;
    }

    setSubmitting(true);

    try {
      await api.post("/activities", {
        ...formData,
        coordinates,
        tags: { ...tags, other: [] },
      });
      alert(t("addActivity.success"));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || t("addActivity.error"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-ocean-50 min-h-screen">
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <span className="text-5xl">📍</span>
          <h1 className="text-3xl text-ocean-700 mt-3 mb-2">
            {t("addActivity.title")}
          </h1>
          <p className="text-gray-500 max-w-lg mx-auto">
            {t("addActivity.subtitle")}
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          onSubmit={handleSubmit}
          className="flex flex-col gap-6"
        >
          {/* Card informazioni base */}
          <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8 flex flex-col gap-5">
            <h2 className="text-lg font-semibold text-ocean-800">
              📝 {t("addActivity.basicInfo")}
            </h2>

            <div>
              <label className="block text-sm font-medium text-ocean-800 mb-1">
                {t("addActivity.name")}
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-ocean-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ocean-400 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ocean-800 mb-1">
                {t("addActivity.description")}
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
                className="w-full border border-ocean-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ocean-400 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ocean-800 mb-2">
                {t("addActivity.category")}
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat })}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                      formData.category === cat
                        ? "bg-ocean-700 text-white border-ocean-700"
                        : "bg-white text-gray-600 border-ocean-200 hover:border-ocean-400"
                    }`}
                  >
                    {t(`categories.${cat}`)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Card posizione */}
          <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8 flex flex-col gap-5">
            <h2 className="text-lg font-semibold text-ocean-800">
              🗺️ {t("addActivity.location")}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ocean-800 mb-1">
                  {t("addActivity.address")}
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder="Via Roma 12"
                  className="w-full border border-ocean-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ocean-400 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ocean-800 mb-1">
                  {t("addActivity.city")}
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  placeholder="Roma"
                  className="w-full border border-ocean-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ocean-400 transition"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="button"
              onClick={handleGeocode}
              disabled={geoLoading || !formData.address || !formData.city}
              className="bg-ocean-100 text-ocean-700 font-semibold py-3 rounded-xl hover:bg-ocean-200 transition disabled:opacity-50"
            >
              {geoLoading
                ? t("addActivity.searching")
                : `📍 ${t("addActivity.findOnMap")}`}
            </motion.button>

            {geoError && (
              <p className="bg-sun-100 text-ocean-800 text-sm px-4 py-2 rounded-xl">
                {geoError}
              </p>
            )}

            {coordinates && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.4 }}
              >
                <p className="text-sm text-gray-500 mb-2">
                  {t("addActivity.dragHint")}
                </p>
                <div className="h-64 rounded-2xl overflow-hidden border border-ocean-100">
                  <MapContainer
                    center={[coordinates.lat, coordinates.lng]}
                    zoom={16}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker
                      position={[coordinates.lat, coordinates.lng]}
                      draggable={true}
                      eventHandlers={{
                        dragend: (e) => {
                          const pos = e.target.getLatLng();
                          setCoordinates({ lat: pos.lat, lng: pos.lng });
                        },
                      }}
                    />
                  </MapContainer>
                </div>
              </motion.div>
            )}
          </div>

          {/* Card caratteristiche */}
          <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8 flex flex-col gap-5">
            <h2 className="text-lg font-semibold text-ocean-800">
              ✨ {t("addActivity.features")}
            </h2>

            <div>
              <label className="block text-sm font-medium text-ocean-800 mb-2">
                🥗 {t("addActivity.dietTags")}
              </label>
              <div className="flex flex-wrap gap-2">
                {DIET_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleTag("diet", option)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                      tags.diet.includes(option)
                        ? "bg-mint-500 text-white border-mint-500"
                        : "bg-white text-gray-600 border-ocean-200 hover:border-mint-500"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-ocean-800 mb-2">
                ♿ {t("addActivity.accessibilityTags")}
              </label>
              <div className="flex flex-wrap gap-2">
                {ACCESSIBILITY_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleTag("accessibility", option)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                      tags.accessibility.includes(option)
                        ? "bg-ocean-600 text-white border-ocean-600"
                        : "bg-white text-gray-600 border-ocean-200 hover:border-ocean-400"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-ocean-800 mb-2">
                🌾 {t("addActivity.foodBases")}
              </label>
              <div className="flex flex-wrap gap-2">
                {FOOD_BASE_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleTag("foodBases", option)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                      tags.foodBases.includes(option)
                        ? "bg-sun-400 text-ocean-800 border-sun-400"
                        : "bg-white text-gray-600 border-ocean-200 hover:border-sun-400"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <p className="bg-red-100 text-red-700 text-sm px-4 py-2 rounded-xl">
              {error}
            </p>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={submitting}
            className="bg-coral-500 text-white font-semibold py-4 rounded-xl hover:bg-coral-600 transition disabled:opacity-50 shadow-lg shadow-coral-500/30"
          >
            {submitting ? t("addActivity.submitting") : t("addActivity.submit")}
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
}

export default AddActivity;
