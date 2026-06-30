import { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

function MapSection() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchActivities() {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/activities",
        );
        setActivities(response.data);
      } catch (err) {
        setError("Errore nel recupero delle attività");
      } finally {
        setLoading(false);
      }
    }

    fetchActivities();
  }, []);

  return (
    <section id="map" className="py-16 px-6">
      <h2 className="text-3xl font-bold mb-8 text-center text-green-700">
        Esplora le attività sulla mappa
      </h2>

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
            >
              <Popup>
                <strong>{activity.name}</strong>
                <br />
                {activity.category}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </section>
  );
}

export default MapSection;
