"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* ===============================
   Fix default Leaflet icon (Next.js)
================================ */
delete (L.Icon.Default.prototype as any)._getIconUrl;

/* ===============================
   Custom single marker icon
================================ */
const locationIcon = new L.Icon({
  iconUrl:
    "https://images.vexels.com/media/users/3/131625/isolated/preview/35942a8a6bb75dc1842582deb7168bf8-orange-location-marker-infographic.png",
  iconSize: [48, 48],
  iconAnchor: [24, 46],
});

/* ===============================
   Constants
================================ */
const UB_CENTER: [number, number] = [47.918, 106.917];

/* ===============================
   Props
================================ */
interface Props {
  onSelect: (data: { lat: number; lng: number; address: string }) => void;
}

/* ===============================
   Click marker logic
================================ */
function ClickMarker({ onSelect }: Props) {
  const [position, setPosition] = useState<[number, number] | null>(null);

  useMapEvents({
    click(e) {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      setPosition([lat, lng]);

      onSelect({
        lat,
        lng,
        address: `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`,
      });
    },
  });

  return position ? <Marker position={position} icon={locationIcon} /> : null;
}

/* ===============================
   Component
================================ */
export default function MapLocationPicker({ onSelect }: Props) {
  return (
    <div className="md:col-span-2 space-y-2">
      <label className="block text-sm font-medium">
        Байршлыг map дээр дарж сонгоно уу
      </label>

      <div className="rounded-xl overflow-hidden border border-card-border">
        <MapContainer
          center={UB_CENTER}
          zoom={15}
          minZoom={13}
          maxZoom={18}
          scrollWheelZoom
          style={{ height: "350px", width: "100%" }}
        >
         <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />

          <ClickMarker onSelect={onSelect} />
        </MapContainer>
      </div>

      <p className="text-xs text-muted">
        📍 Map дээр дарвал байршил автоматаар хадгалагдана
      </p>
    </div>
  );
}
