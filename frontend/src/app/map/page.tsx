"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Ulaanbaatar bounding box
const UB_BOUNDS: [[number, number], [number, number]] = [
  [47.75, 106.7],
  [48.05, 107.2],
];
interface AnimalMarker {
  id: number;
  position: [number, number];
  name: string;
  type: "Нохой" | "Муур";
  status: "Төөрсөн" | "Олдсон";
  description: string;
  image: string;
  icon: string;
}

// Custom marker icons
const maxIcon = new L.Icon({
  iconUrl:
    "https://images.vexels.com/media/users/3/131625/isolated/preview/35942a8a6bb75dc1842582deb7168bf8-orange-location-marker-infographic.png",
  iconSize: [50, 50],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const lunaIcon = new L.Icon({
  iconUrl:
    "https://images.vexels.com/media/users/3/131625/isolated/preview/35942a8a6bb75dc1842582deb7168bf8-orange-location-marker-infographic.png",
  iconSize: [50, 50],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

// Example markers
const markers: AnimalMarker[] = [
  {
    id: 1,
    position: [47.918, 106.917],
    name: "Макс",
    type: "Нохой",
    status: "Төөрсөн",
    description: "Найрсаг алтан ретривер, цэнхэр хүзүүвчтэй",
    icon: maxIcon,

    image:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?w=100&h=100&fit=crop",
  },
  {
    id: 2,
    position: [47.921, 106.923],
    name: "Луна",
    type: "Муур",
    status: "Олдсон",
    description: "Үзэсгэлэнтэй сиам муур, тайван найрсаг",
    icon: lunaIcon,

    image:
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=100&h=100&fit=crop",
  },
];

export default function UBMap() {
  return (
    <div className="flex justify-center items-center my-8">
      <MapContainer
        center={[47.918, 106.917]}
        zoom={16}
        scrollWheelZoom={true}
        style={{ height: "800px", width: "80%" }}
        maxBounds={UB_BOUNDS}
        minZoom={13}
        maxZoom={18}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />

        {markers.map((marker) => (
          <Marker key={marker.id} position={marker.position} icon={marker.icon}>
            <Popup>
              <div className="space-y-1">
                <div className="flex justify-center gap-10">
                  <img
                    src={`${marker.image}`}
                    className="w-30 h-30 rounded-lg"
                  />

                  <div>
                    <h3 className="font-bold text-lg">{marker.name}</h3>
                    <p>
                      <strong>Төрөл:</strong> {marker.type}
                    </p>
                    <p>
                      <strong>Төлөв:</strong>{" "}
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium
          ${
            marker.status === "Төөрсөн"
              ? "bg-red-100 text-red-600"
              : "bg-green-100 text-green-600"
          }`}
                      >
                        {marker.status}
                      </span>
                    </p>
                    <p>{marker.description}</p>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
