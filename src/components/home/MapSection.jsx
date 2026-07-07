import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker } from "react-leaflet";

const CATEGORIES = [
  "ristorante",
  "negozio",
  "mercato",
  "alloggio",
  "punto_riciclo",
  "servizio",
  "altro",
];

const DIET_OPTIONS = [
  "vegetariano",
  "vegano",
  "senza glutine",
  "senza lattosio",
  "halal",
  "kosher",
];

const ACCESSIBILITY_OPTIONS = [
  "sedia a rotelle",
  "ipovedente",
  "ipoudente",
  "difficolta motorie",
];

function MapSection() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    category: "",
    city: "",
    diet: [],
    accessibility: [],
  });

  const [appliedFilters, setAppliedFilters] = useState({
    category: "",
    city: "",
    diet: [],
    accessibility: [],
  });

  useEffect(() => {
    async function fetchActivities() {
      try {
        const params = {};
        if (appliedFilters.category) params.category = appliedFilters.category;
        if (appliedFilters.city) params.city = appliedFilters.city;
        if (appliedFilters.diet.length > 0) params.diet = appliedFilters.diet.join(",");
        if (appliedFilters.accessibility.length > 0) params.accessibility = appliedFilters.accessibility.join(",");

        const response = await axios.get("http://localhost:5000/api/activities", { params });
        setActivities(response.data);
      } catch (err) {
        setError("Errore nel recupero delle attività");
      } finally {
        setLoading(false);
      }
    }

    fetchActivities();
  }, [appliedFilters]);

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
    const empty = { category: "", city: "", diet: [], accessibility: [] };
    setFilters(empty);
    setAppliedFilters(empty);
    setShowFilters(false);
  };

  const activeFiltersCount =
    (appliedFilters.category ? 1 : 0) +
    (appliedFilters.city ? 1 : 0) +
    appliedFilters.diet.length +
    appliedFilters.accessibility.length;

  return (
    <section id="map" className="py-16 px-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-green-700">
        Esplora le attività sulla mappa
      </h2>

      {/* Bottone filtri */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setShowFilters((prev) => !prev)}
          className="flex items-center gap-2 bg-green-700 text-white px-5 py-2 rounded-full font-medium hover:bg-green-800 transition"
        >
          Filtra
          {activeFiltersCount > 0 && (
            <span className="bg-white text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Pannello filtri */}
      {showFilters && (
        <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">

          {/* Città */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Città
            </label>
            <input
              type="text"
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              placeholder="es. Roma"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Categoria */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria
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
                      ? "bg-green-700 text-white border-green-700"
                      : "bg-white text-gray-600 border-gray-300 hover:border-green-400"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Dieta */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Opzioni dietetiche
            </label>
            <div className="flex flex-wrap gap-2">
              {DIET_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => toggleOption("diet", option)}
                  className={`px-3 py-1 rounded-full text-sm font-medium border transition ${
                    filters.diet.includes(option)
                      ? "bg-green-700 text-white border-green-700"
                      : "bg-white text-gray-600 border-gray-300 hover:border-green-400"
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
              Accessibilità
            </label>
            <div className="flex flex-wrap gap-2">
              {ACCESSIBILITY_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => toggleOption("accessibility", option)}
                  className={`px-3 py-1 rounded-full text-sm font-medium border transition ${
                    filters.accessibility.includes(option)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
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
              className="bg-green-700 text-white font-semibold px-5 py-2 rounded-lg hover:bg-green-800 transition"
            >
              Applica filtri
            </button>
            <button
              onClick={handleReset}
              className="bg-gray-100 text-gray-600 font-semibold px-5 py-2 rounded-lg hover:bg-gray-200 transition"
            >
              Azzera
            </button>
          </div>
        </div>
      )}

      {loading && <p className="text-center">Caricamento attività...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      <div className="h-[500px] w-full max-w-5xl mx-auto rounded-xl overflow-hidden shadow-lg">
        <MapContainer
          center={[41.9028, 12.4964]}
          zoom={12}
          scrollWheelZoom={false}
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
              eventHandlers={{
                click: () => navigate(`/activity/${activity._id}`),
              }}
            />
          ))}
        </MapContainer>
      </div>
    </section>
  );
}

export default MapSection;