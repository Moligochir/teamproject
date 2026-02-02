"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "../contexts/Languagecontext";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type PetFiltersProps = {
  onChange: (filters: {
    searchTerm: string;
    typeFilter: "all" | "dog" | "cat";
    statusFilter: "all" | "yes" | "no";
  }) => void;
};

type adopt = {
  _id: string;
  name: string;
  petType: string;
  breed: string;
  description: string;
  image: string;
  age: number;
  adoptType: "YES" | "NO";
  createdAt: string;
};

export function UrclehPage({ onChange }: PetFiltersProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "dog" | "cat">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "yes" | "no">("all");
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

  const filteredPets = animalData.filter((pet) => {
    const matchesSearch =
      pet.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.breed?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      typeFilter === "all" || pet.petType?.toLowerCase() === typeFilter;

    const matchesStatus =
      statusFilter === "all" || pet.adoptType?.toLowerCase() === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Filters Section */}

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
