"use client";

import { useState } from "react";
import { useLanguage } from "../contexts/Languagecontext";

type PetFiltersProps = {
  onChange: (filters: {
    searchTerm: string;
    typeFilter: "all" | "dog" | "cat";
    statusFilter: "all" | "lost" | "found";
  }) => void;
};

export function UrclehPage({ onChange }: PetFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "dog" | "cat">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "lost" | "found">(
    "all"
  );
  const { language } = useLanguage();

  const translations = {
    mn: {
      search: "Хайх",
      searchPlaceholder: "Нэр, үүлдэр, эсвэл байршлаар хайх...",
      petType: "Амьтны төрөл",
      allTypes: "Бүх төрөл",
      dog: "🐕 Нохой",
      cat: "🐱 Муур",
    },
    en: {
      search: "Search",
      searchPlaceholder: "Search by name, breed, or location...",
      petType: "Pet Type",
      allTypes: "All Types",
      dog: "🐕 Dog",
      cat: "🐱 Cat",
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
    </div>
  );
}
