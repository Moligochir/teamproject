"use client";

import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";


const customMarkerIcon = new L.Icon({
  iconUrl:
    "https://images.vexels.com/media/users/3/131625/isolated/preview/35942a8a6bb75dc1842582deb7168bf8-orange-location-marker-infographic.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});
interface Type {
  position: string;
  icon: string;
}

// Marker icon fix
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

function SearchControl({ onSelect }: { onSelect: (loc: Location) => void }) {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();

    const searchControl = new (GeoSearchControl as any)({
      provider,
      style: "bar",
      showMarker: false,
      autoClose: true,
      retainZoomLevel: false,
      searchLabel: "Байршил хайх...",
    });

    map.addControl(searchControl);

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

  return null;
}

export default function MapLocationPicker({
  onSelect,
}: {
  onSelect: (loc: Location) => void;
}) {
  const [position, setPosition] = useState<[number, number] | null>(null);

  return (
    <div className="w-full h-87.5 rounded-xl overflow-hidden border">
      <MapContainer
        center={[47.918, 106.917]} // УБ
        zoom={13}
        className="w-full h-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap"
        />

        <SearchControl
          onSelect={(loc) => {
            setPosition([loc.lat, loc.lng]);
            onSelect(loc);
          }}
        />
        {position && <Marker position={position} icon={customMarkerIcon} />}
      </MapContainer>
    </div>
  );
}
