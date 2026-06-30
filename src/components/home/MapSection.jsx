import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const mockActivities = [
  {
    id: 1,
    name: "Ristorante Verde",
    type: "restaurant",
    lat: 41.9028,
    lng: 12.4964,
  },
  {
    id: 2,
    name: "EcoShop Bio",
    type: "shop",
    lat: 41.9109,
    lng: 12.4818,
  },
  {
    id: 3,
    name: "Mercato Contadino",
    type: "market",
    lat: 41.8919,
    lng: 12.5113,
  },
];

function MapSection() {
  return (
    <section id="map" className="py-16 px-6">
      <h2 className="text-3xl font-bold mb-8 text-center text-green-700">
        Esplora le attività sulla mappa
      </h2>

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

          {mockActivities.map((activity) => (
            <Marker key={activity.id} position={[activity.lat, activity.lng]}>
              <Popup>
                <strong>{activity.name}</strong>
                <br />
                {activity.type}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </section>
  );
}

export default MapSection;