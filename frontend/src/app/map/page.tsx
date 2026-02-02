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

// Lost marker (Red)
const lostIcon = new L.Icon({
  iconUrl:
    "https://png.pngtree.com/png-clipart/20230123/original/pngtree-flat-red-location-sign-png-image_8927579.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [46, 46],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Found marker (Green)
const foundIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
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
  const [filter, setFilter] = useState<"all" | "lost" | "found">("all");
  const router = useRouter();
  const { language } = useLanguage();

  const translations = {
    mn: {
      seemore: "Дэлгэрэнгүй үзэх",
      status: "Төрөл:",
      loc: "Байршил:",
      lost: "🔍 Төөрсөн",
      found: "✓ Олдсон",
      dog: "Нохой",
      cat: "Муур",
      filter: "Шүүлтүүр",
      allPets: "Бүх амьтан",
      lostOnly: "Төөрсөн",
      foundOnly: "Олдсон",
      noResults: "амьтан олдлоо",
    },
    en: {
      seemore: "View Details",
      status: "Pet Type:",
      loc: "Location:",
      lost: "🔍 Lost",
      found: "✓ Found",
      dog: "Dog",
      cat: "Cat",
      filter: "Filter",
      allPets: "All Pets",
      lostOnly: "Lost",
      foundOnly: "Found",
      noResults: "pets found",
    },
  };

  const t = translations[language as "mn" | "en"];

  // Translate pet type
  const translatePetType = (petType: string) => {
    const normalized = petType.toLowerCase();

    if (normalized === "dog" || normalized === "нохой") {
      return language === "mn" ? "Нохой" : "Dog";
    } else if (normalized === "cat" || normalized === "муур") {
      return language === "mn" ? "Муур" : "Cat";
    }

    return petType;
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

  // Filter data based on selected filter
  const filteredData = animalData.filter((item) => {
    const isLost =
      item.role?.toLowerCase() === "lost" || item.role === "Төөрсөн";
    const isFound =
      item.role?.toLowerCase() === "found" || item.role === "Олдсон";

    if (filter === "lost") return isLost;
    if (filter === "found") return isFound;
    return true;
  });

  const handleViewDetails = (petId: string) => {
    router.push(`/pet/${petId}`);
  };

  const getMarkerIcon = (role: string) => {
    const isLost = role?.toLowerCase() === "lost" || role === "Төөрсөн";
    return isLost ? lostIcon : foundIcon;
  };

  return (
    <div className="space-y-4 mt-6">
      {/* Filter Tabs */}
      <div className="flex justify-center gap-3 px-4">
        <button
          onClick={() => setFilter("all")}
          className={`px-6 py-2.5 rounded-full cursor-pointer font-semibold transition-all ${
            filter === "all"
              ? "bg-primary text-white shadow-lg shadow-primary/30"
              : "bg-card-bg border border-card-border text-muted hover:border-primary hover:text-primary"
          }`}
        >
          🐾 {t.allPets}
        </button>
        <button
          onClick={() => setFilter("lost")}
          className={`px-6 py-2.5 rounded-full font-semibold cursor-pointer transition-all ${
            filter === "lost"
              ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
              : "bg-card-bg border border-card-border text-muted hover:border-red-500 hover:text-red-500"
          }`}
        >
          🔍 {t.lostOnly}
        </button>
        <button
          onClick={() => setFilter("found")}
          className={`px-6 py-2.5 rounded-full cursor-pointer font-semibold transition-all ${
            filter === "found"
              ? "status-found"
              : "bg-card-bg border border-card-border text-muted hover:border-green-500 hover:text-green-500"
          }`}
        >
          ✓ {t.foundOnly}
        </button>
      </div>

      {/* Results count */}
      <div className="text-center text-muted text-sm">
        {filteredData.length} {t.noResults}
      </div>

      {/* Map */}
      <div className="flex justify-center items-center">
        <div className="w-full max-w-6xl rounded-2xl overflow-hidden border-2 border-card-border shadow-lg">
          <MapContainer
            center={[47.918, 106.917]}
            zoom={13}
            scrollWheelZoom={true}
            style={{ height: "600px", width: "100%" }}
            maxBounds={UB_BOUNDS}
            minZoom={12}
            maxZoom={18}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            />

            {filteredData.map((marker) => {
              const isLost =
                marker.role?.toLowerCase() === "lost" ||
                marker.role === "Төөрсөн";

              return (
                <Marker
                  key={marker._id}
                  position={[marker.lat, marker.lng]}
                  icon={getMarkerIcon(marker.role)}
                >
                  <Popup maxWidth={120} minWidth={320}>
                    <div className="w-[320px] bg-white rounded-xl overflow-hidden">
                      {/* Image Section */}
                      <div className="relative w-full aspect-4/3 overflow-hidden bg-gray-100">
                        <img
                          src={marker.image}
                          alt={marker.name}
                          className="w-full h-full object-cover"
                        />

                        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />

                        {/* Status Badge */}
                        <div className="absolute top-3 left-3">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm text-white ${
                              isLost ? "status-lost" : "status-found"
                            }`}
                          >
                            {isLost ? t.lost : t.found}
                          </span>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-5 space-y-4">
                        <h3 className="font-bold text-xl text-black leading-tight line-clamp-2 min-h-14">
                          {marker.name}
                        </h3>

                        <div className="flex flex-col gap-4">
                          {/* Pet Type */}
                          <div className="flex items-center gap-2">
                            <TypeIcon />
                            <span className="text-sm text-gray-500 min-w-12.5">
                              {t.status}
                            </span>
                            <span className="text-sm font-semibold text-gray-900">
                              {translatePetType(marker.petType)}
                            </span>
                          </div>

                          {/* Location */}
                          <div className="flex items-center gap-2">
                            <LocationPinIcon />
                            <span className="text-sm text-gray-500 min-w-12.5">
                              {t.loc}
                            </span>
                            <span className="text-sm text-gray-600 line-clamp-1 flex-1">
                              {marker.location}
                            </span>
                          </div>

                          {/* Description */}
                          <div className="flex items-center gap-2">
                            <DetailIcon />
                            <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 flex-1">
                              {marker.description}
                            </p>
                          </div>
                        </div>

                        {/* View Details Button */}
                        <button
                          onClick={() => handleViewDetails(marker._id)}
                          className={`w-full mt-4 px-4 py-2.5 text-white rounded-lg font-semibold text-sm transition-all duration-200 transform cursor-pointer hover:shadow-lg active:scale-95 ${
                            isLost ? "bg-primary" : "bg-primary"
                          }`}
                        >
                          {t.seemore}
                        </button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-8 px-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-red-500 shadow-md"></div>
          <span className="text-sm font-medium text-muted">
            🔍 {t.lostOnly}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-green-500 shadow-md"></div>
          <span className="text-sm font-medium text-muted">
            ✓ {t.foundOnly}
          </span>
        </div>
      </div>
    </div>
  );
}
