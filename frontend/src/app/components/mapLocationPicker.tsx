"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  Popup,
  CircleMarker,
} from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import { useLanguage } from "../contexts/Languagecontext";
import { BulbIcon } from "./icons";

// Enhanced custom marker icon
const customMarkerIcon = new L.Icon({
  iconUrl:
    "https://images.vexels.com/media/users/3/131625/isolated/preview/35942a8a6bb75dc1842582deb7168bf8-orange-location-marker-infographic.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
  className: "shadow-lg",
});

// Default Leaflet marker fix
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

type Location = {
  lat: number;
  lng: number;
  address: string;
};

// Улаанбаатар хотын төв цэг
const UB_CENTER = {
  lat: 47.918,
  lng: 106.917,
};

// 150км радиус
const SEARCH_RADIUS_KM = 150;
const KM_TO_DEGREES = 0.009;

// Translation object
const translations = {
  mn: {
    searchPlaceholder: "🔍 Байршил хайх...",
    notFound: "Байршил олдсонгүй",
    selectedLocation: "📍 Сонгосон байршил",
    locationSelected: "Байршил сонгогдлоо",
    latitude: "Өргөрөг",
    longitude: "Урт",
    instructions:
      "Газрын зураг дээр дараад эсвэл дээрх хайлтыг ашиглан байршилаа сонгоно уу",
  },
  en: {
    searchPlaceholder: "🔍 Search Location...",
    notFound: "Location not found",
    selectedLocation: "📍 Selected Location",
    locationSelected: "Location Selected",
    latitude: "Latitude",
    longitude: "Longitude",
    instructions:
      "Click on the map or use the search above to select your location",
  },
};

// Custom Provider with search bounds
class BoundedOSMProvider extends OpenStreetMapProvider {
  async search(options: any) {
    const { query } = options;

    const latOffset = SEARCH_RADIUS_KM * KM_TO_DEGREES;
    const lngOffset = SEARCH_RADIUS_KM * KM_TO_DEGREES;

    const bounds = {
      lat1: UB_CENTER.lat - latOffset,
      lng1: UB_CENTER.lng - lngOffset,
      lat2: UB_CENTER.lat + latOffset,
      lng2: UB_CENTER.lng + lngOffset,
    };

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query,
    )}&viewbox=${bounds.lng1},${bounds.lat1},${bounds.lng2},${bounds.lat2}&bounded=1&limit=10&accept-language=mn,en`;

    try {
      const response = await fetch(url);
      const results = await response.json();

      return results.map((result: any) => ({
        x: parseFloat(result.lon),
        y: parseFloat(result.lat),
        label: result.display_name,
        bounds: result.boundingbox
          ? [
              [
                parseFloat(result.boundingbox[0]),
                parseFloat(result.boundingbox[2]),
              ],
              [
                parseFloat(result.boundingbox[1]),
                parseFloat(result.boundingbox[3]),
              ],
            ]
          : null,
        raw: result,
      }));
    } catch (error) {
      console.error("Search failed:", error);
      return [];
    }
  }
}

interface SearchControlProps {
  onSelect: (loc: Location) => void;
  language: "mn" | "en";
}

function SearchControl({ onSelect, language }: SearchControlProps) {
  const map = useMapEvents({});
  const t = translations[language];

  useEffect(() => {
    const provider = new BoundedOSMProvider();

    const searchControl = new (GeoSearchControl as any)({
      provider,
      style: "bar",
      showMarker: false,
      autoClose: false,
      retainZoomLevel: false,
      searchLabel: t.searchPlaceholder,
      notFoundMessage: t.notFound,
      keepResult: true,
      maxMarkers: 1,
    });

    map.addControl(searchControl);

    // Хайлтын илэрц сонгогдох үед
    const handleLocationSelect = (result: any) => {
      const { x, y, label } = result.location;

      onSelect({
        lat: y,
        lng: x,
        address: label,
      });

      map.setView([y, x], 16);
    };

    map.on("geosearch/showlocation", handleLocationSelect);

    return () => {
      map.removeControl(searchControl);
      map.off("geosearch/showlocation", handleLocationSelect);
    };
  }, [map, onSelect, t]);

  // Enhanced CSS styling
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      /* Main search control */
      .leaflet-control-geosearch {
        border-radius: 12px !important;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2) !important;
        overflow: hidden !important;
        background: white !important;
        border: none !important;
      }

      .leaflet-control-geosearch.dark {
        background: #1f2937 !important;
      }

      /* Search form */
      .leaflet-control-geosearch form {
        border-radius: 12px !important;
        border: none !important;
        background: white !important;
      }

      .leaflet-control-geosearch.dark form {
        background: #1f2937 !important;
      }

  /* Input field */
.leaflet-control-geosearch input {
  padding: 12px 16px !important;
  font-size: 14px !important;
  font-weight: 500 !important;
  border-radius: 12px !important;
  background: white !important;
  color: #1f2937 !important;
  width: 100% !important;
  transition: all 0.3s ease !important;
  margin-top: 10px !important;
}

.leaflet-control-geosearch.dark input {
  background: #111827 !important;
  color: white !important;
}

.leaflet-control-geosearch input::placeholder {
  color: #9ca3af !important;
}

.leaflet-control-geosearch.dark input::placeholder {
  color: #6b7280 !important;
}

.leaflet-control-geosearch input:focus {
  outline: none !important;
  box-shadow: 0 0 0 4px rgba(255, 107, 53, 0.1) !important;
  background: white !important;
}

.leaflet-control-geosearch.dark input:focus {
  background: #111827 !important;
  box-shadow: 0 0 0 4px rgba(255, 107, 53, 0.2) !important;
}

      /* Results dropdown */
      .leaflet-control-geosearch .results {
        max-height: 320px !important;
        overflow-y: auto !important;
        border-radius: 8px !important;
        margin-top: 8px !important;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
        background: white !important;
        border: none !important;
      }

      .leaflet-control-geosearch.dark .results {
        background: #111827 !important;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4) !important;
      }

      /* Result items */
      .leaflet-control-geosearch .results > * {
        padding: 12px 16px !important;
        border-bottom: 1px solid #f3f4f6 !important;
        cursor: pointer !important;
        transition: all 0.2s ease !important;
        font-size: 13px !important;
        line-height: 1.6 !important;
        color: #1f2937 !important;
      }

      .leaflet-control-geosearch.dark .results > * {
        border-bottom-color: #374151 !important;
        color: #e5e7eb !important;
      }

      .leaflet-control-geosearch .results > *:hover {
        background-color: #f9fafb !important;
        padding-left: 20px !important;
      }

      .leaflet-control-geosearch.dark .results > *:hover {
        background-color: #1f2937 !important;
      }

      .leaflet-control-geosearch .results > *:last-child {
        border-bottom: none !important;
      }

      .leaflet-control-geosearch .results.active {
        display: block !important;
      }

      /* Reset button */
      .leaflet-control-geosearch .reset {
        width: 42px !important;
        height: 47px !important;
        line-height: 32px !important;
        border-radius: 8px !important;
        background: #f3f4f6 !important;
        color: #6b7280 !important;
        border: none !important;
        cursor: pointer !important;
        transition: all 0.2s ease !important;
        font-size: 16px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
      }

      .leaflet-control-geosearch.dark .reset {
        background: #374151 !important;
        color: #9ca3af !important;
      }

      .leaflet-control-geosearch .reset:hover {
        background-color: #fee2e2 !important;
        color: #dc2626 !important;
      }

      .leaflet-control-geosearch.dark .reset:hover {
        background-color: #7f1d1d !important;
        color: #fca5a5 !important;
      }

      /* Leaflet controls positioning */
      .leaflet-top.leaflet-left {
        z-index: 500 !important;
      }

      /* Map tiles styling */
      .leaflet-tile {
        filter: brightness(0.95);
      }

      /* Marker shadow */
      .leaflet-marker-shadow {
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
      }

      /* Popup styling */
      .leaflet-popup-content-wrapper {
        border-radius: 8px !important;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15) !important;
        background: white !important;
      }

      .leaflet-popup-content {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto !important;
        margin: 0 !important;
      }

      /* Scrollbar styling */
      .leaflet-control-geosearch .results::-webkit-scrollbar {
        width: 6px !important;
      }

      .leaflet-control-geosearch .results::-webkit-scrollbar-track {
        background: transparent !important;
      }

      .leaflet-control-geosearch .results::-webkit-scrollbar-thumb {
        background: #d1d5db !important;
        border-radius: 3px !important;
      }

      .leaflet-control-geosearch .results::-webkit-scrollbar-thumb:hover {
        background: #9ca3af !important;
      }

      .leaflet-control-geosearch.dark .results::-webkit-scrollbar-thumb {
        background: #4b5563 !important;
      }

      .leaflet-control-geosearch.dark .results::-webkit-scrollbar-thumb:hover {
        background: #6b7280 !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  return null;
}

// Click handler - газрын зураг дээр дарах
interface ClickHandlerProps {
  onLocationSelect: (loc: Location) => void;
}

function ClickHandler({ onLocationSelect }: ClickHandlerProps) {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;

      try {
        // Reverse geocoding - хаяг авах
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=mn,en`,
        );
        const data = await response.json();

        const address =
          data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

        // Pin үүсгэх
        onLocationSelect({
          lat,
          lng,
          address,
        });

        // Хайлтын input-д хаяг оруулах
        setTimeout(() => {
          const searchInput = document.querySelector(
            ".leaflet-control-geosearch input",
          ) as HTMLInputElement;

          if (searchInput) {
            searchInput.value = address;
          }
        }, 100);
      } catch (error) {
        console.error("Reverse geocoding failed:", error);

        const address = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

        onLocationSelect({
          lat,
          lng,
          address,
        });

        // Координат оруулах
        setTimeout(() => {
          const searchInput = document.querySelector(
            ".leaflet-control-geosearch input",
          ) as HTMLInputElement;

          if (searchInput) {
            searchInput.value = address;
          }
        }, 100);
      }
    },
  });

  return null;
}

export default function MapLocationPicker({
  onSelect,
}: {
  onSelect: (loc: Location) => void;
}) {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [address, setAddress] = useState<string>("");
  const [isDark, setIsDark] = useState(false);
  const { language } = useLanguage();
  const t = translations[language as "mn" | "en"];

  // Dark mode detection
  useEffect(() => {
    const checkDarkMode = () => {
      const isDarkMode = document.documentElement.classList.contains("dark");
      setIsDark(isDarkMode);
    };

    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  const handleLocationSelect = (loc: Location) => {
    console.log("Location selected:", loc);
    setPosition([loc.lat, loc.lng]);
    setAddress(loc.address);
    onSelect(loc);
  };

  useEffect(() => {
    const searchControl = document.querySelector(
      ".leaflet-control-geosearch",
    ) as HTMLElement;
    if (searchControl) {
      if (isDark) {
        searchControl.classList.add("dark");
      } else {
        searchControl.classList.remove("dark");
      }
    }
  }, [isDark]);

  return (
    <div className="space-y-4">
      {/* Map Container */}
      <div className="w-full  h-96 rounded-2xl overflow-hidden border-2 border-card-border shadow-lg hover:shadow-xl transition-shadow duration-300">
        <MapContainer
          center={[UB_CENTER.lat, UB_CENTER.lng]}
          zoom={13}
          scrollWheelZoom={true}
          className="w-full h-full"
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* 150km radius circle */}
          <CircleMarker
            center={[UB_CENTER.lat, UB_CENTER.lng]}
            radius={150 / 1.5}
            pathOptions={{
              color: "#FF6B35",
              weight: 2,
              opacity: 0.2,
              fillOpacity: 0.05,
            }}
          />

          <SearchControl
            onSelect={handleLocationSelect}
            language={language as "mn" | "en"}
          />
          <ClickHandler onLocationSelect={handleLocationSelect} />

          {position && (
            <Marker position={position} icon={customMarkerIcon}>
              <Popup>
                <div className="p-3 min-w-64">
                  <p className="font-bold text-lg mb-2 text-gray-800">
                    {t.selectedLocation}
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed wrap-break-word">
                    {address}
                  </p>
                  <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
                    <p>
                      <strong>{t.latitude}:</strong> {position[0].toFixed(6)}
                    </p>
                    <p>
                      <strong>{t.longitude}:</strong> {position[1].toFixed(6)}
                    </p>
                  </div>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {/* Info Section */}
      {address && (
        <div className="bg-linear-to-r  from-primary/10 to-orange-500/10 border border-primary/20 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✓</span>
            <div>
              <p className="font-semibold text-foreground mb-1">
                {t.locationSelected}
              </p>
              <p className="text-sm text-muted wrap-break-word">{address}</p>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-card-bg rounded-xl p-4 border border-card-border">
        <p className="text-sm text-muted flex items-center gap-2">
          <BulbIcon />
          <span>{t.instructions}</span>
        </p>
      </div>
    </div>
  );
}
