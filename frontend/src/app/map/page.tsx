"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* ===============================
   Fix Leaflet default icon (Next.js)
================================ */
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* ===============================
   Constants
================================ */
const UB_CENTER: LatLngExpression = [47.918, 106.917];

const UB_BOUNDS: [[number, number], [number, number]] = [
  [47.75, 106.7],
  [48.05, 107.2],
];

/* ===============================
   Custom icons
================================ */
const dogIcon = new L.Icon({
  iconUrl:
    "https://images.vexels.com/media/users/3/131625/isolated/preview/35942a8a6bb75dc1842582deb7168bf8-orange-location-marker-infographic.png",
  iconSize: [50, 50],
  iconAnchor: [20, 40],
  popupAnchor: [0, -36],
});

const catIcon = new L.Icon({
  iconUrl:
    "https://images.vexels.com/media/users/3/131625/isolated/preview/35942a8a6bb75dc1842582deb7168bf8-orange-location-marker-infographic.png",
  iconSize: [50, 50],
  iconAnchor: [20, 40],
  popupAnchor: [0, -36],
});

/* ===============================
   Marker type
================================ */
interface AnimalMarker {
  id: number;
  position: [number, number];
  name: string;
  type: "Нохой" | "Муур";
  status: "Төөрсөн" | "Олдсон";
  description: string;
  icon: L.Icon;
  image: string;
}

/* ===============================
   Marker data
================================ */
const markers: AnimalMarker[] = [
  {
    id: 1,
    position: [47.918, 106.917],
    name: "Макс",
    type: "Нохой",
    status: "Төөрсөн",
    description: "Найрсаг алтан ретривер, цэнхэр хүзүүвчтэй",
    icon: dogIcon,
    image:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?w=100&h=100&fit=crop",
  },
  {
    id: 2,
    position: [47.921, 106.923],
    name: "Луна",
    type: "Муур",
    status: "Олдсон",
    description: "Үзэсгэлэнтэй сиам муур, тайван",
    icon: catIcon,
    image:
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=100&h=100&fit=crop",
  },
];

/* ===============================
   Component
================================ */
export default function UBMap() {
  return (
    <div className="flex justify-center my-8">
      <MapContainer
        center={UB_CENTER}
        zoom={15}
        minZoom={13}
        maxZoom={18}
        scrollWheelZoom
        maxBounds={UB_BOUNDS}
        style={{ height: "600px", width: "85%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
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
                      <strong>Төлөв:</strong> {marker.status}
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
