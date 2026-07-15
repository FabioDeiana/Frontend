import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion } from "motion/react";

import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import {
  CATEGORIES,
  DIET_OPTIONS,
  ACCESSIBILITY_OPTIONS,
  FOOD_BASE_OPTIONS,
} from "../../utils/constants";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const CATEGORY_EMOJI = {
  ristorante: "🍽️",
  negozio: "🛍️",
  mercato: "🥕",
  alloggio: "🛏️",
  punto_riciclo: "♻️",
  servizio: "🔧",
  altro: "📍",
};

function createMarkerIcon(category) {
  const emoji = CATEGORY_EMOJI[category] || "📍";
  return L.divIcon({
    className: "",
    html: `
      <div style="
        width: 40px;
        height: 40px;
        background: #FF7A55;
        border: 3px solid white;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 3px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <span style="transform: rotate(45deg); font-size: 18px;">${emoji}</span>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });
}

function MapSection() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();

  const [filters, setFilters] = useState({
    category: "",
    city: "",
    diet: [],
    accessibility: [],
    foodBases: [],
  });

  const [appliedFilters, setAppliedFilters] = useState({
    category: "",
    city: "",
    diet: [],
    accessibility: [],
    foodBases: [],
  });

  useEffect(() => {
    async function fetchActivities() {
      try {
        const params = {};
        if (appliedFilters.category) params.category = appliedFilters.category;
        if (appliedFilters.city) params.city = appliedFilters.city;
        if (appliedFilters.diet.length > 0)
          params.diet = appliedFilters.diet.join(",");
        if (appliedFilters.accessibility.length > 0)
          params.accessibility = appliedFilters.accessibility.join(",");
        if (appliedFilters.foodBases.length > 0)
          params.foodBases = appliedFilters.foodBases.join(",");

        const response = await api.get("/activities", { params });
        setActivities(response.data);
      } catch (err) {
        setError(t("map.error"));
      } finally {
        setLoading(false);
      }
    }

    fetchActivities();
  }, [appliedFilters, t]);

  const toggleOption = (field, value) => {
    setFilters((prev) => {
      const current = prev[field];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [field]: updated };
    });
  };

  const handleApply = () => {
    setAppliedFilters(filters);
    setShowFilters(false);
  };

  const handleReset = () => {
    const empty = {
      category: "",
      city: "",
      diet: [],
      accessibility: [],
      foodBases: [],
    };
    setFilters(empty);
    setAppliedFilters(empty);
    setShowFilters(false);
  };

  const activeFiltersCount =
    (appliedFilters.category ? 1 : 0) +
    (appliedFilters.city ? 1 : 0) +
    appliedFilters.diet.length +
    appliedFilters.accessibility.length +
    appliedFilters.foodBases.length;

  return (
    <section id="map" className="py-16 px-6">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-4xl mb-6 text-center text-ocean-700"
      >
        {t("map.title")}
      </motion.h2>

      {/* Bottone filtri */}
      <div className="flex justify-center gap-3 mb-6">
        <button
          onClick={() => setShowFilters((prev) => !prev)}
          className="flex items-center gap-2 bg-ocean-700 text-white px-5 py-2 rounded-full font-medium hover:bg-ocean-800 transition"
        >
          {t("map.filter")}
          {activeFiltersCount > 0 && (
            <span className="bg-white text-ocean-700 text-xs font-bold px-2 py-0.5 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {user && (
          <Link
            to="/add-activity"
            className="flex items-center gap-2 bg-white text-ocean-700 border border-ocean-700 px-5 py-2 rounded-full font-medium hover:bg-ocean-50 transition"
          >
            + {t("map.addActivity")}
          </Link>
        )}
      </div>

      {/* Pannello filtri */}
      {showFilters && (
        <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
          {/* Città */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("map.city")}
            </label>
            <input
              type="text"
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              placeholder="es. Roma"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ocean-400"
            />
          </div>

          {/* Categoria */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("map.category")}
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      category: prev.category === cat ? "" : cat,
                    }))
                  }
                  className={`px-3 py-1 rounded-full text-sm font-medium border transition ${
                    filters.category === cat
                      ? "bg-ocean-700 text-white border-ocean-700"
                      : "bg-white text-gray-600 border-gray-300 hover:border-ocean-200"
                  }`}
                >
                  {t(`categories.${cat}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Dieta */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("map.diet")}
            </label>
            <div className="flex flex-wrap gap-2">
              {DIET_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => toggleOption("diet", option)}
                  className={`px-3 py-1 rounded-full text-sm font-medium border transition ${
                    filters.diet.includes(option)
                      ? "bg-ocean-700 text-white border-ocean-700"
                      : "bg-white text-gray-600 border-gray-300 hover:border-ocean-200"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Accessibilità */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("map.accessibility")}
            </label>
            <div className="flex flex-wrap gap-2">
              {ACCESSIBILITY_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => toggleOption("accessibility", option)}
                  className={`px-3 py-1 rounded-full text-sm font-medium border transition ${
                    filters.accessibility.includes(option)
                      ? "bg-ocean-600 text-white border-ocean-600"
                      : "bg-white text-gray-600 border-gray-300 hover:border-ocean-400"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Basi Alimentari */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🌾 {t("map.foodBases")}
            </label>
            <div className="flex flex-wrap gap-2">
              {FOOD_BASE_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => toggleOption("foodBases", option)}
                  className={`px-3 py-1 rounded-full text-sm font-medium border transition ${
                    filters.foodBases.includes(option)
                      ? "bg-sun-400 text-ocean-800 border-sun-400"
                      : "bg-white text-gray-600 border-ocean-200 hover:border-sun-400"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Bottoni */}
          <div className="flex gap-3">
            <button
              onClick={handleApply}
              className="bg-ocean-700 text-white font-semibold px-5 py-2 rounded-lg hover:bg-ocean-800 transition"
            >
              {t("map.applyFilters")}
            </button>
            <button
              onClick={handleReset}
              className="bg-ocean-50 text-gray-600 font-semibold px-5 py-2 rounded-lg hover:bg-gray-200 transition"
            >
              {t("map.reset")}
            </button>
          </div>
        </div>
      )}

      {loading && <p className="text-center">{t("map.loading")}</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="h-[500px] w-full max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-xl"
      >
        <MapContainer
          center={[41.9028, 12.4964]}
          zoom={12}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {activities.map((activity) => (
            <Marker
              key={activity._id}
              position={[activity.coordinates.lat, activity.coordinates.lng]}
              icon={createMarkerIcon(activity.category)}
              eventHandlers={{
                click: () => navigate(`/activity/${activity._id}`),
              }}
            >
              <Tooltip direction="top" offset={[-15, -10]} opacity={1}>
                <div className="w-48">
                  <p className="font-semibold text-ocean-700">
                    {activity.name}
                  </p>
                  <p className="text-xs text-gray-500 mb-1">
                    {t(`categories.${activity.category}`)} · {activity.city}
                  </p>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {activity.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {activity.tags?.diet?.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="bg-ocean-50 text-ocean-700 text-[10px] px-1.5 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Tooltip>
            </Marker>
          ))}
        </MapContainer>
      </motion.div>
    </section>
  );
}

export default MapSection;
