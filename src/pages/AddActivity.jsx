import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../services/api";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { useTranslation } from "react-i18next";
import { CATEGORIES, DIET_OPTIONS, ACCESSIBILITY_OPTIONS } from "../utils/constants";

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
  const [tags, setTags] = useState({ diet: [], accessibility: [] });
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

  // Geocoding con Nominatim (OpenStreetMap)
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
        }
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
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-green-700 mb-2">
        {t("addActivity.title")}
      </h1>
      <p className="text-gray-500 mb-8">{t("addActivity.subtitle")}</p>

      {error && (
        <p className="bg-red-100 text-red-700 text-sm px-4 py-2 rounded-lg mb-4">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Nome */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("addActivity.name")}
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Descrizione */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("addActivity.description")}
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Categoria */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("addActivity.category")}
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFormData({ ...formData, category: cat })}
                className={`px-3 py-1 rounded-full text-sm font-medium border transition ${
                  formData.category === cat
                    ? "bg-green-700 text-white border-green-700"
                    : "bg-white text-gray-600 border-gray-300 hover:border-green-400"
                }`}
              >
                {t(`categories.${cat}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Indirizzo + Città + Geocoding */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("addActivity.address")}
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="Via Roma 12"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("addActivity.city")}
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              placeholder="Roma"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleGeocode}
          disabled={geoLoading || !formData.address || !formData.city}
          className="bg-green-100 text-green-700 font-semibold py-2 rounded-lg hover:bg-green-200 transition disabled:opacity-50"
        >
          {geoLoading ? t("addActivity.searching") : `📍 ${t("addActivity.findOnMap")}`}
        </button>

        {geoError && (
          <p className="bg-yellow-100 text-yellow-700 text-sm px-4 py-2 rounded-lg">
            {geoError}
          </p>
        )}

        {/* Mini-mappa con marker trascinabile */}
        {coordinates && (
          <div>
            <p className="text-sm text-gray-500 mb-2">
              {t("addActivity.dragHint")}
            </p>
            <div className="h-64 rounded-xl overflow-hidden border border-gray-200">
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
          </div>
        )}

        {/* Tag dieta */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🥗 {t("addActivity.dietTags")}
          </label>
          <div className="flex flex-wrap gap-2">
            {DIET_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => toggleTag("diet", option)}
                className={`px-3 py-1 rounded-full text-sm font-medium border transition ${
                  tags.diet.includes(option)
                    ? "bg-green-700 text-white border-green-700"
                    : "bg-white text-gray-600 border-gray-300 hover:border-green-400"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Tag accessibilità */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ♿ {t("addActivity.accessibilityTags")}
          </label>
          <div className="flex flex-wrap gap-2">
            {ACCESSIBILITY_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => toggleTag("accessibility", option)}
                className={`px-3 py-1 rounded-full text-sm font-medium border transition ${
                  tags.accessibility.includes(option)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-green-700 text-white font-semibold py-3 rounded-lg hover:bg-green-800 transition disabled:opacity-50"
        >
          {submitting ? t("addActivity.submitting") : t("addActivity.submit")}
        </button>
      </form>
    </div>
  );
}

export default AddActivity;