"use client";

import "leaflet/dist/leaflet.css";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

import { DetailIcon, LocationPinIcon, TypeIcon } from "../components/icons";

type LostFound = {
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

type Props = {
  bounds: [[number, number], [number, number]];
  data: LostFound[];
  t: {
    seemore: string;
    status: string;
    loc: string;
    lost: string;
    found: string;
    mapLoading: string;
  };
  translatePetType: (petType: string) => string;
  isLostRole: (role: string) => boolean;
};

export default function LeafletMap({
  bounds,
  data = [],
  t,
  translatePetType,
  isLostRole,
}: Props) {
  const router = useRouter();

  const handleViewDetails = (petId: string) => {
    router.push(`/pet/${petId}`);
  };

  // Leaflet icons: browser дээр л үүсгэнэ
  const { lostIcon, foundIcon } = useMemo(() => {
    if (typeof window === "undefined") {
      return {
        lostIcon: undefined as unknown as L.Icon,
        foundIcon: undefined as unknown as L.Icon,
      };
    }

    const lost = new L.Icon({
      iconUrl:
        "https://png.pngtree.com/png-clipart/20230123/original/pngtree-flat-red-location-sign-png-image_8927579.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
      iconSize: [46, 46],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    const found = new L.Icon({
      iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    return { lostIcon: lost, foundIcon: found };
  }, []);

  const iconsReady = Boolean(lostIcon && foundIcon);

  const getMarkerIcon = (role: string) => {
    return isLostRole(role) ? lostIcon : foundIcon;
  };

  if (!iconsReady) {
    return (
      <div
        style={{
          height: 600,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {t.mapLoading}
      </div>
    );
  }

  return (
    <MapContainer
      center={[47.918, 106.917]}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: "600px", width: "100%" }}
      maxBounds={bounds}
      minZoom={12}
      maxZoom={18}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
      />

      {(data ?? []).map((marker) => {
        const lost = isLostRole(marker.role);

        return (
          <Marker
            key={marker._id}
            position={[marker.lat, marker.lng]}
            icon={getMarkerIcon(marker.role)}
          >
            <Popup maxWidth={120} minWidth={320}>
              <div className="w-[320px] bg-white rounded-xl overflow-hidden">
                <div className="relative w-full aspect-4/3 overflow-hidden bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={marker.image}
                    alt={marker.name}
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />

                  <div className="absolute top-3 left-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm text-white ${
                        lost ? "status-lost" : "status-found"
                      }`}
                    >
                      {lost ? t.lost : t.found}
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
                      <span className="text-sm text-gray-500 min-w-12.5">
                        {t.loc}
                      </span>
                      <span className="text-sm text-gray-600 line-clamp-1 flex-1">
                        {marker.location}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <DetailIcon />
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 flex-1">
                        {marker.description}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleViewDetails(marker._id)}
                    className="w-full mt-4 px-4 py-2.5 text-white rounded-lg font-semibold text-sm transition-all duration-200 transform cursor-pointer hover:shadow-lg active:scale-95 bg-primary hover:bg-primary-dark"
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
  );
}
