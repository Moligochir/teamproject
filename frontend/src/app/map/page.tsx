"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Ulaanbaatar bounding box
const UB_BOUNDS: [[number, number], [number, number]] = [
  [47.75, 106.7],
  [48.05, 107.2],
];

// Custom marker icons
const maxIcon = new L.Icon({
  iconUrl:
    "https://images.unsplash.com/photo-1552053831-71594a27632d?w=100&h=100&fit=crop", // Макс зураг
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const lunaIcon = new L.Icon({
  iconUrl:
    "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=100&h=100&fit=crop", // Луна зураг
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

// Example markers
const markers = [
  {
    id: 1,
    position: [47.918, 106.917],
    name: "Макс",
    type: "Нохой",
    status: "Төөрсөн",
    description: "Найрсаг алтан ретривер, цэнхэр хүзүүвчтэй",
    icon: maxIcon,
  },
  {
    id: 2,
    position: [47.921, 106.923],
    name: "Луна",
    type: "Муур",
    status: "Олдсон",
    description: "Үзэсгэлэнтэй сиам муур, тайван найрсаг",
    icon: lunaIcon,
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
                <h3 className="font-bold text-lg">{marker.name}</h3>
                <p>
                  <span className="font-semibold">Төрөл:</span> {marker.type}
                </p>
                <p>
                  <span className="font-semibold">Төлөв:</span> {marker.status}
                </p>
                <p>{marker.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
