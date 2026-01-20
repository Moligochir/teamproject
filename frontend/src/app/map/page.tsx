"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { DetailIcon, TypeIcon } from "../components/icons";
import { useParams, useRouter } from "next/navigation";

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
  icon: L.Icon;
}

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

type lostFound = {
  role: string;
  name: string;
  gender: string;
  location: string;
  description: string;
  Date: Date;
  lat: number;
  lng: number;
  petType: string;
  image: string;
  breed: string;
  _id: string;
  phonenumber: number;
};
export default function UBMap() {
  const [animalData, setAnimalData] = useState<lostFound[]>([]);
  const router = useRouter();

  const GetLostFound = async () => {
    try {
      const res = await fetch(`http://localhost:8000/lostFound`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
      });
      const data = await res.json();
      console.log("User data:", data);
      setAnimalData(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    GetLostFound();
  }, []);
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

        {animalData.map((marker) => (
          <Marker
            key={marker._id}
            position={[marker.lat, marker.lng]}
            icon={marker.petType === "Нохой" ? maxIcon : lunaIcon}
          >
            <Popup>
              <div className="min-w-70 max-w-[320px]">
                <div className="relative h-32 rounded-t-lg overflow-hidden">
                  <img
                    src={marker.image}
                    alt={marker.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Status Badge on Image */}
                  <div className="absolute top-2 left-2">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
                        marker.role === "Төөрсөн"
                          ? "bg-lost text-white"
                          : "bg-found text-white"
                      }`}
                    >
                      {marker.role === "Төөрсөн" ? "🔍 Төөрсөн" : "✓ Олдсон"}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <h3 className="font-bold text-lg text-black leading-tight">
                    {marker.name}
                  </h3>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <TypeIcon />
                      <span className="text-sm text-muted">Төрөл:</span>
                      <span className="text-sm font-semibold">
                        {marker.petType}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <DetailIcon />
                      <p className="text-sm text-muted leading-relaxed line-clamp-2 flex-1">
                        {marker.description}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => router.push(`/pet/${id}`)}
                    className="w-full cursor-pointer mt-3 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-semibold text-sm transition-all"
                  >
                    Дэлгэрэнгүй үзэх
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}
