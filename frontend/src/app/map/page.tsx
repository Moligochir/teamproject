"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { DetailIcon, LocationPinIcon, TypeIcon } from "../components/icons";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "../contexts/Languagecontext";

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
  const { language, toggleLanguage } = useLanguage();

  const translations = {
    mn: {
      seemore: "Дэлгэрэнгүй үзэх",
      status: "Төрөл:",
      loc: "Байршил:",
      lost: "Төөрсөн",
      found: "Олдсон",
      dog: "Нохой",
      cat: "Муур",
    },
    en: {
      seemore: "View Details",
      status: "Pet Type:",
      loc: "Location:",
      lost: "Lost",
      found: "Found",
      dog: "Dog",
      cat: "Cat",
    },
  };

  const t = translations[language];

  // Translate pet type
  const translatePetType = (petType: string) => {
    const normalized = petType.toLowerCase();

    if (normalized === "dog" || normalized === "нохой") {
      return language === "mn" ? "Нохой" : "Dog";
    } else if (normalized === "cat" || normalized === "муур") {
      return language === "mn" ? "Муур" : "Cat";
    }

    return petType; // Return original if not matched
  };

  // Translate status
  const translateStatus = (status: string) => {
    const normalized = status.toLowerCase();

    if (normalized === "төөрсөн" || normalized === "lost") {
      return language === "mn" ? "Төөрсөн" : "Lost";
    } else if (normalized === "олдсон" || normalized === "found") {
      return language === "mn" ? "Олдсон" : "Found";
    }

    return status;
  };

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

  const handleViewDetails = (petId: string) => {
    router.push(`/pet/${petId}`);
  };

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
            icon={
              marker.petType === "Нохой" ||
              marker.petType.toLowerCase() === "dog"
                ? maxIcon
                : lunaIcon
            }
          >
            <Popup maxWidth={320} minWidth={280}>
              <div className="w-[320px] bg-white rounded-xl overflow-hidden">
                <div className="relative w-full aspect-4/3 overflow-hidden bg-gray-100">
                  <img
                    src={marker.image}
                    alt={marker.name}
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />

                  <div className="absolute top-3 left-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm ${
                        marker.role === "Төөрсөн" ||
                        marker.role.toLowerCase() === "lost"
                          ? "status-lost"
                          : "status-found"
                      }`}
                    >
                      {marker.role === "Төөрсөн" ||
                      marker.role.toLowerCase() === "lost"
                        ? `🔍 ${translateStatus(marker.role)}`
                        : `✓ ${translateStatus(marker.role)}`}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <h3 className="font-bold text-xl text-black leading-tight line-clamp-2 min-h-14">
                    {marker.name}
                  </h3>

                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      <TypeIcon />
                      <span className="text-sm text-gray-500 min-w-12.5">
                        {t.status}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {translatePetType(marker.petType)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <LocationPinIcon />
                      <span className="text-sm text-gray-500  min-w-12.5">
                        {t.loc}
                      </span>
                      <span className="text-sm text-gray-600  line-clamp-1 flex-1">
                        {marker.location}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <DetailIcon />
                      <p className="text-sm text-gray-600  leading-relaxed line-clamp-3 flex-1">
                        {marker.description}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleViewDetails(marker._id)}
                    className="w-full mt-4 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-primary dark:hover:bg-primary-dark text-white rounded-lg font-semibold text-sm transition-all duration-200  transform cursor-pointer"
                  >
                    {t.seemore}
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
