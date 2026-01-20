"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  Popup,
} from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";

// Custom marker icon
const customMarkerIcon = new L.Icon({
  iconUrl:
    "https://images.vexels.com/media/users/3/131625/isolated/preview/35942a8a6bb75dc1842582deb7168bf8-orange-location-marker-infographic.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
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

function SearchControl({ onSelect }: { onSelect: (loc: Location) => void }) {
  const map = useMapEvents({});

  useEffect(() => {
    const provider = new BoundedOSMProvider();

    const searchControl = new (GeoSearchControl as any)({
      provider,
      style: "bar",
      showMarker: false,
      autoClose: false,
      retainZoomLevel: false,
      searchLabel: "Байршил хайх...",
      notFoundMessage: "Байршил олдсонгүй",
      keepResult: true,
      maxMarkers: 1,
    });

    map.addControl(searchControl);

    // Хайлтын илэрц сонгогдох үед
    map.on("geosearch/showlocation", (result: any) => {
      const { x, y, label } = result.location;

      onSelect({
        lat: y,
        lng: x,
        address: label,
      });

      map.setView([y, x], 16);
    });

    return () => {
      map.removeControl(searchControl);
    };
  }, [map, onSelect]);

  // CSS styling
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .leaflet-control-geosearch {
        border-radius: 8px !important;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important;
      }

      .leaflet-control-geosearch form {
        border-radius: 8px !important;
      }

      .leaflet-control-geosearch .results {
        max-height: 300px !important;
        overflow-y: auto !important;
        border-radius: 8px !important;
        margin-top: 4px !important;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
      }

      .leaflet-control-geosearch .results > * {
        padding: 12px 16px !important;
        border-bottom: 1px solid #e5e7eb !important;
        cursor: pointer !important;
        transition: background-color 0.2s !important;
        font-size: 14px !important;
        line-height: 1.5 !important;
      }

      .leaflet-control-geosearch .results > *:hover {
        background-color: #f3f4f6 !important;
      }

      .leaflet-control-geosearch .results > *:last-child {
        border-bottom: none !important;
      }

      .leaflet-control-geosearch .results.active {
        display: block !important;
      }

      .leaflet-control-geosearch input {
        padding: 10px 12px !important;
        font-size: 14px !important;
        border-radius: 8px !important;
        border: 1px solid #d1d5db !important;
      }

      .leaflet-control-geosearch input:focus {
        outline: none !important;
        border-color: #e47a3d !important;
        box-shadow: 0 0 0 3px rgba(228, 122, 61, 0.1) !important;
      }

      .leaflet-control-geosearch .reset {
        width: 30px !important;
        height: 30px !important;
        line-height: 30px !important;
        border-radius: 6px !important;
      }

      .leaflet-control-geosearch .reset:hover {
        background-color: #fee2e2 !important;
        color: #dc2626 !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return null;
}

// Click handler - газрын зураг дээр дарах
function ClickHandler({
  onLocationSelect,
}: {
  onLocationSelect: (loc: Location) => void;
}) {
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

  const handleLocationSelect = (loc: Location) => {
    console.log("Location selected:", loc); // Debug log
    setPosition([loc.lat, loc.lng]);
    setAddress(loc.address);
    onSelect(loc);
  };

  return (
    <div className="w-full h-96 rounded-xl overflow-hidden border border-card-border">
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

        <SearchControl onSelect={handleLocationSelect} />
        <ClickHandler onLocationSelect={handleLocationSelect} />

        {position && (
          <Marker position={position} icon={customMarkerIcon}>
            <Popup>
              <div className="p-2">
                <p className="font-semibold mb-1">Сонгосон байршил</p>
                <p className="text-sm text-gray-600">{address}</p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
