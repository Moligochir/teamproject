"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "../contexts/Languagecontext";
import dynamic from "next/dynamic";

// Ulaanbaatar bounding box
const UB_BOUNDS: [[number, number], [number, number]] = [
  [47.75, 106.7],
  [48.05, 107.2],
];

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

const LeafletMap = dynamic(() => import("./Leaflet"), {
  ssr: false,
  loading: () => (
    <div style={{ height: 600, display: "grid", placeItems: "center" }}>
      Loading map...
    </div>
  ),
});

export default function UBMap() {
  const [animalData, setAnimalData] = useState<LostFound[]>([]);
  const [filter, setFilter] = useState<"all" | "lost" | "found">("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { language } = useLanguage();

  const translations = {
    mn: {
      seemore: "Дэлгэрэнгүй үзэх",
      status: "Төрөл:",
      loc: "Байршил:",
      lost: "🔍 Төөрсөн",
      found: "✓ Олдсон",
      filter: "Шүүлтүүр",
      allPets: "Бүх амьтан",
      lostOnly: "Төөрсөн",
      foundOnly: "Олдсон",
      noResults: "амьтан олдлоо",
      loading: "Уншиж байна...",
      errorTitle: "Алдаа гарлаа",
      mapLoading: "Газрын зураг ачаалж байна...",
    },
    en: {
      seemore: "View Details",
      status: "Pet Type:",
      loc: "Location:",
      lost: "🔍 Lost",
      found: "✓ Found",
      filter: "Filter",
      allPets: "All Pets",
      lostOnly: "Lost",
      foundOnly: "Found",
      noResults: "pets found",
      loading: "Loading...",
      errorTitle: "Error",
      mapLoading: "Loading map...",
    },
  };

  const t = translations[(language as "mn" | "en") ?? "mn"];

  const translatePetType = (petType: string) => {
    const normalized = (petType ?? "").toLowerCase();
    if (normalized === "dog" || normalized === "нохой")
      return language === "mn" ? "Нохой" : "Dog";
    if (normalized === "cat" || normalized === "муур")
      return language === "mn" ? "Муур" : "Cat";
    return petType;
  };

  const isLostRole = (role: string) => {
    const r = (role ?? "").toLowerCase();
    return r === "lost" || role === "Төөрсөн";
  };

  const apiBase = process.env.NEXT_PUBLIC_API_URL;

  const fetchLostFound = async () => {
    try {
      setError(null);
      setLoading(true);

      if (!apiBase) {
        throw new Error(
          "NEXT_PUBLIC_API_URL тохируулаагүй байна. Local дээр frontend/.env.local, Vercel дээр Environment Variables дээр нэм.",
        );
      }

      const res = await fetch(`${apiBase}/lostFound`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        cache: "no-store",
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`API error ${res.status}: ${txt}`);
      }

      const data = (await res.json()) as LostFound[];
      setAnimalData(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e?.message ?? "Unknown error");
      setAnimalData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLostFound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredData = animalData.filter((item) => {
    const lost = isLostRole(item.role);
    const found = !lost;

    if (filter === "lost") return lost;
    if (filter === "found") return found;
    return true;
  });

  return (
    <div className="space-y-4 mt-8">
      {/* Filter Tabs */}
      <div className="flex justify-center gap-3 px-4">
        <button
          onClick={() => setFilter("all")}
          className={`px-6 py-2.5 rounded-full font-semibold transition-all cursor-pointer ${
            filter === "all"
              ? "bg-primary text-white shadow-lg shadow-primary/30"
              : "bg-card-bg border border-card-border text-muted hover:border-primary hover:text-primary"
          }`}
        >
          🐾 {t.allPets}
        </button>

        <button
          onClick={() => setFilter("lost")}
          className={`px-6 py-2.5 rounded-full font-semibold transition-all cursor-pointer ${
            filter === "lost"
              ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
              : "bg-card-bg border border-card-border text-muted hover:border-red-500 hover:text-red-500"
          }`}
        >
          🔍 {t.lostOnly}
        </button>

        <button
          onClick={() => setFilter("found")}
          className={`px-6 py-2.5 rounded-full font-semibold transition-all cursor-pointer ${
            filter === "found"
              ? "bg-green-500 text-white shadow-lg shadow-green-500/30"
              : "bg-card-bg border border-card-border text-muted hover:border-green-500 hover:text-green-500"
          }`}
        >
          ✓ {t.foundOnly}
        </button>
      </div>

      {/* Loading / Error / Results count */}
      <div className="text-center text-muted text-sm">
        {loading ? (
          <span>{t.loading}</span>
        ) : error ? (
          <span className="text-red-500">
            {t.errorTitle}: {error}
          </span>
        ) : (
          <span>
            {filteredData.length} {t.noResults}
          </span>
        )}
      </div>

      {/* Map */}
      <div className="flex justify-center items-center">
        <div className="w-full max-w-6xl rounded-2xl overflow-hidden border-2 border-card-border shadow-lg">
          <LeafletMap
            bounds={UB_BOUNDS}
            data={filteredData}
            t={t}
            translatePetType={translatePetType}
            isLostRole={isLostRole}
          />
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
