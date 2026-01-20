"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

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

        {animalData
          .filter((m) => m.lat != null && m.lng != null)
          .map((marker) => (
            <Marker
              key={marker._id}
              position={[marker.lat, marker.lng]}
              icon={marker.petType === "Нохой" ? maxIcon : lunaIcon}
            >
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
                        <strong>Төрөл:</strong> {marker.petType}
                      </p>
                      <p>
                        <strong>Төлөв:</strong>{" "}
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium
          ${
            marker.role === "Төөрсөн"
              ? "bg-red-100 text-red-600"
              : "bg-green-100 text-green-600"
          }`}
                        >
                          {marker.role === "Төөрсөн" ? "Төөрсөн" : "Олдсон"}
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
