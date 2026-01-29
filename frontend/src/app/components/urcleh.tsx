"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "../contexts/Languagecontext";
import toast from "react-hot-toast";
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
  description: string;
  Date: Date;
  petType: string;
  image: string;
  breed: string;
  _id: string;
  phonenumber: number;
  age: number;
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
  const [loading, setLoading] = useState(true);

  const GetAdopts = async () => {
    try {
      setLoading(true);
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
      toast.error(language === "mn" ? "Алдаа гарлаа" : "Error occurred");
    } finally {
      setLoading(false);
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
      status: "Төлөв",
      allStatus: "Бүх төлөв",
      viewDetails: "Дэлгэрэнгүй →",
      age: "Нас:",
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
      status: "Status",
      allStatus: "All Status",
      viewDetails: "View details →",
      age: "Age:",
    },
  };

  const t = translations[language];

  const handleUpdate = () => {
    onChange({ searchTerm, typeFilter, statusFilter });
  };

  // Filter pets based on search and filters
  const filteredPets = animalData.filter((pet) => {
    const matchesSearch =
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.breed.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      typeFilter === "all" ||
      pet.petType.toLowerCase() === typeFilter.toLowerCase();

    const matchesStatus =
      statusFilter === "all" ||
      pet.role.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Filters Section */}
      <div className="bg-card-bg rounded-2xl border border-card-border p-6">
        <div className="grid md:grid-cols-3 gap-4">
          {/* Search Input */}
          <div className="md:col-span-1">
            <label className="block text-sm font-semibold mb-2">
              {t.search}
            </label>
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
                className="w-full pl-10 pr-4 py-3 bg-background border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Type Dropdown */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              {t.petType}
            </label>
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value as "all" | "dog" | "cat");
                handleUpdate();
              }}
              className="w-full px-4 py-3 bg-background border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none cursor-pointer transition-all"
            >
              <option value="all">{t.allTypes}</option>
              <option value="dog">{t.dog}</option>
              <option value="cat">{t.cat}</option>
            </select>
          </div>

          {/* Status Dropdown */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              {t.status}
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as "all" | "lost" | "found");
                handleUpdate();
              }}
              className="w-full px-4 py-3 bg-background border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none cursor-pointer transition-all"
            >
              <option value="all">{t.allStatus}</option>
              <option value="lost">{t.lost}</option>
              <option value="found">{t.found}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {language === "mn"
            ? `${filteredPets.length} амьтан олдлоо`
            : `${filteredPets.length} pets found`}
        </h2>
      </div>

      {/* Pet Cards Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-card-bg rounded-2xl border border-card-border overflow-hidden animate-pulse"
            >
              <div className="w-full aspect-square bg-gray-300 dark:bg-gray-700"></div>
              <div className="p-4 space-y-3">
                <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredPets.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-xl font-bold mb-2">
            {language === "mn" ? "Амьтан олдсонгүй" : "No pets found"}
          </h3>
          <p className="text-muted">
            {language === "mn"
              ? "Та хайлтын шалгуур өөрчилж үзнэ үү"
              : "Try adjusting your search criteria"}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredPets.map((adopt) => (
            <div
              key={adopt._id}
              className="bg-card-bg rounded-2xl border border-card-border overflow-hidden hover:border-primary/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
              onClick={() => router.push(`/adopt/${adopt._id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  router.push(`/adopt/${adopt._id}`);
                }
              }}
            >
              {/* Image Section */}
              <div className="relative w-full aspect-4/3 overflow-hidden bg-gray-100 dark:bg-gray-700">
                <img
                  src={adopt.image || "/default-pet.jpg"}
                  alt={adopt.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-black/10" />

                {/* Status Badge - Top Left */}

                {/* Pet Type Badge - Top Right */}
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

              {/* Content Section */}
              <div className="p-4 space-y-3">
                {/* Name and Breed */}
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-bold text-lg leading-snug line-clamp-1">
                    {adopt.name}
                  </h3>
                  <p className="text-muted text-sm whitespace-nowrap font-medium">
                    {adopt.breed}
                  </p>
                </div>

                {/* Gender and Date */}
                <div className="flex items-center gap-2 text-sm text-muted">
                  {adopt.gender && (
                    <span className="inline-block px-2 py-1 bg-muted/10 rounded-lg text-xs font-medium">
                      {adopt.gender}
                    </span>
                  )}
                  {adopt.Date && (
                    <span className="text-xs">
                      {new Date(adopt.Date).toLocaleDateString(
                        language === "mn" ? "mn-MN" : "en-US",
                      )}
                    </span>
                  )}
                </div>

                {/* Description */}
                {adopt.description && (
                  <p className="text-sm text-muted line-clamp-2 leading-relaxed">
                    {adopt.description}
                  </p>
                )}

                {/* Location */}
                <div className="flex items-center gap-2 text-sm text-muted pt-2 border-t border-card-border">
                  {t.age}
                  <span className="line-clamp-1">{adopt.age}</span>
                </div>

                {/* View Details Link */}
                <div className="pt-2">
                  <span className="inline-flex items-center text-sm font-semibold text-primary group-hover:gap-1 gap-0 transition-all">
                    {t.viewDetails}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
