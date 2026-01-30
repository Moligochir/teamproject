"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "../contexts/Languagecontext";

import { useRouter } from "next/navigation";

type PetFiltersProps = {
  onChange: (filters: {
    searchTerm: string;
    typeFilter: "all" | "dog" | "cat";
    statusFilter: "all" | "lost" | "found";
  }) => void;
};

type adopt = {
  role: string;
  name: string;
  gender: string;
  location: string;
  description: string;
  Date: Date;
  petType: string;
  image: string;
  breed: string;
  _id: string;
  phonenumber: number;
};
export function UrclehPage({ onChange }: PetFiltersProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "dog" | "cat">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "lost" | "found">(
    "all",
  );
  const { language } = useLanguage();
  const [animalData, setAnimalData] = useState<adopt[]>([]);

  const GetAdopts = async () => {
    try {
      const res = await fetch(`http://localhost:8000/adopt`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
      });
      const data = await res.json();
      setAnimalData(data);
      console.log("data avyaa", data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    GetAdopts();
  }, []);

  const translations = {
    mn: {
      search: "Хайх",
      searchPlaceholder: "Нэр, үүлдэр, эсвэл байршлаар хайх...",
      petType: "Амьтны төрөл",
      allTypes: "Бүх төрөл",
      dog: "🐕 Нохой",
      cat: "🐱 Муур",
      lost: "🔍 Төөрсөн",
      found: "✓ Олдсон",
    },
    en: {
      search: "Search",
      searchPlaceholder: "Search by name, breed, or location...",
      petType: "Pet Type",
      allTypes: "All Types",
      dog: "🐕 Dog",
      cat: "🐱 Cat",
      lost: "🔍 Lost",
      found: "✓ Found",
    },
  };

  const t = translations[language];

  const handleUpdate = () => {
    onChange({ searchTerm, typeFilter, statusFilter });
  };

  return (
    <div className="bg-card-bg rounded-2xl border border-card-border p-6 mb-8">
      <div className="grid md:grid-cols-4 gap-4">
        {/* Search + Dropdown */}
        <div className="md:col-span-4 flex justify-between items-start gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">{t.search}</label>
            <div className="relative w-full">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  handleUpdate();
                }}
                className="w-full pl-10 pr-4 py-3 bg-background border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Type Dropdown */}
          <div className="w-60">
            <label className="block text-sm font-medium mb-2">
              {t.petType}
            </label>
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value as "all" | "dog" | "cat");
                handleUpdate();
              }}
              className="w-full px-4 py-3 bg-background border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none cursor-pointer"
            >
              <option value="all">{t.allTypes}</option>
              <option value="dog">{t.dog}</option>
              <option value="cat">{t.cat}</option>
            </select>
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mt-10">
        {animalData.map((adopt) => (
          <div
            key={adopt._id}
            // onClick={() => router.push(`/pet/${adopt._id}`)}
            className="bg-card-bg rounded-2xl border border-card-border overflow-hidden cursor-pointer hover:border-primary/50 hover:-translate-y-0.5 transition"
            role="button"
            tabIndex={0}
            // onKeyDown={(e) => {
            //   if (e.key === "Enter") router.push(`/pet/${adopt._id}`);
            // }}
          >
            <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
              <img
                src={adopt.image || "/default-pet.jpg"}
                alt={adopt.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-black/10" />

              <div className="absolute top-4 left-4">
                <span
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold shadow-xl backdrop-blur-md ${
                    adopt.role === "Lost" ? "status-lost" : "status-found"
                  }`}
                >
                  {adopt.role === "Lost" ? t.lost : t.found}
                </span>
              </div>

              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-black/40 text-white backdrop-blur-md">
                  {adopt.petType === "Dog"
                    ? "🐕 Dog"
                    : adopt.petType === "Cat"
                      ? "🐱 Cat"
                      : "🐾 Pet"}
                </span>
              </div>
            </div>

            <div className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-bold text-lg leading-snug">{adopt.name}</h3>
                <p className="text-muted text-sm whitespace-nowrap">
                  {adopt.breed}
                </p>
              </div>

              <div className="flex items-center gap-3 text-sm text-muted">
                {adopt.gender ? <span>{adopt.gender}</span> : null}
                {adopt.Date ? (
                  <span>• {new Date(adopt.Date).toLocaleDateString()}</span>
                ) : null}
              </div>

              {adopt.description ? (
                <p className="text-sm text-muted line-clamp-3">
                  {adopt.description}
                </p>
              ) : null}

              {/* <div className="pt-2">
                <span className="inline-flex items-center text-sm font-semibold text-primary">
                  {language === "mn" ? "Дэлгэрэнгүй харах →" : "View details →"}
                </span>
              </div> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
