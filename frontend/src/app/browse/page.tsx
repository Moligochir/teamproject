"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth, useClerk } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { useLanguage } from "../contexts/Languagecontext";
import PetCard from "../components/petcard";
import { RightArrow } from "../components/icons";

type lostFound = {
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

export default function BrowsePage() {
  const [animalData, setAnimalData] = useState<lostFound[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "Dog" | "Cat">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "Lost" | "Found">(
    "all",
  );
  const [lostFoundData, setLostFoundData] = useState<lostFound[]>([]);
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
      setLostFoundData(data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    GetLostFound();
  }, []);

  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();
  const { language } = useLanguage();

  // Translations
  const translations = {
    mn: {
      title: "Бүх амьтдыг үзэх",
      description:
        "Төөрсөн амьтдыг олох эсвэл олдсон амьтдыг эзэдтэй нь холбоход туслах зарлалуудыг хайна уу",
      search: "Хайх",
      searchPlaceholder: "Нэр, үүлдэр, эсвэл байршлаар хайх...",
      petType: "Амьтны төрөл",
      status: "Төлөв",
      allTypes: "Бүх төрөл",
      dog: "🐕 Нохой",
      cat: "🐱 Муур",
      allStatuses: "Бүх төлөв",
      lost: "🔍 Төөрсөн",
      found: "☑️ Олдсон",
      all: "Бүгд",
      resultsCount: "амьтан олдлоо",
      total: "Нийт",
      noResults: "Амьтан олдсонгүй",
      noResultsDescription: "Хайлт эсвэл шүүлтүүрийг өөрчилж үзнэ үү",
      clearFilters: "Шүүлтүүр арилгах",
      notFoundTitle: "Хайж буй зүйлээ олсонгүй юу?",
      notFoundDescription:
        "Төөрсөн эсвэл олдсон амьтны мэдээлэл оруулж, тэдгээрийг гэр бүлтэй нь холбоход туслаарай",
      submitReport: "Мэдээлэл оруулах",
      loginRequired: "Та нэвтрэх шаардлагатай",
      fetchError: "Дата татахад алдаа гарлаа",
      allFilter: "Бүх төрөл",
      nerguiii: "Нэр мэдэгдэхгүй",
    },
    en: {
      title: "Browse All Pets",
      description:
        "Search listings to help find lost pets or connect found pets with their owners",
      search: "Search",
      searchPlaceholder: "Search by name, breed, or location...",
      petType: "Pet Type",
      status: "Status",
      allTypes: "All Types",
      dog: "🐕 Dog",
      cat: "🐱 Cat",
      allStatuses: "All Statuses",
      lost: "🔍 Lost",
      found: "☑️ Found",
      all: "All",
      resultsCount: "pets found",
      total: "Total",
      noResults: "No Pets Found",
      noResultsDescription: "Try adjusting your search or filters",
      clearFilters: "Clear Filters",
      notFoundTitle: "Didn't find what you're looking for?",
      notFoundDescription:
        "Submit a report about a lost or found pet and help reunite them with their family",
      submitReport: "Submit Report",
      loginRequired: "You need to sign in",
      fetchError: "Error fetching data",
      allFilter: "All filters",
      nerguiii: "Unknown",
    },
  };

  const t = translations[language];

  /* ================= LOGIN GUARD ================= */

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isSignedIn) {
      e.preventDefault();
      toast(t.loginRequired);
      openSignIn({ redirectUrl: "/browse" });
    }
  };

  /* ================= FETCH ================= */

  useEffect(() => {
    const GetLostFound = async () => {
      try {
        const res = await fetch("http://localhost:8000/lostFound");
        const data = await res.json();
        console.log("User data:", data);
        setAnimalData(data);
      } catch (err) {
        console.log(err);
        toast(t.fetchError);
      }
    };

    GetLostFound();
  }, [t.fetchError]);

  /* ================= FILTER ================= */

  const filteredPets = animalData.filter((pet) => {
    const matchesSearch =
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || pet.petType === typeFilter;
    const matchesStatus = statusFilter === "all" || pet.role === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t.title}</h1>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            {t.description}
          </p>
        </div>

        {/* Filters */}
        <div className="bg-card-bg rounded-2xl border border-card-border p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">
                {t.search}
              </label>
              <div className="relative">
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
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Pet Type */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {t.petType}
              </label>
              <select
                value={typeFilter}
                onChange={(e) =>
                  setTypeFilter(e.target.value as "all" | "Dog" | "Cat")
                }
                className="w-full px-4 py-3 bg-background border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none cursor-pointer"
              >
                <option value="all">{t.allFilter}</option>
                <option value="Dog">{t.dog}</option>
                <option value="Cat">{t.cat}</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {t.status}
              </label>
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as "all" | "Lost" | "Found")
                }
                className="w-full px-4 py-3 bg-background border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none cursor-pointer"
              >
                <option value="all">{t.allStatuses}</option>
                <option value="Lost">{t.lost}</option>
                <option value="Found">{t.found}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quick Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => {
              setTypeFilter("all");
              setStatusFilter("all");
            }}
            className={`px-4 py-2 rounded-full font-medium transition-all cursor-pointer ${
              typeFilter === "all" && statusFilter === "all"
                ? "bg-primary text-white"
                : "bg-card-bg border border-card-border hover:border-primary"
            }`}
          >
            {t.all}
          </button>
          <button
            onClick={() => {
              setTypeFilter("Dog");
              setStatusFilter("all");
            }}
            className={`px-4 py-2 rounded-full font-medium transition-all cursor-pointer ${
              typeFilter === "Dog" && statusFilter === "all"
                ? "bg-primary text-white"
                : "bg-card-bg border border-card-border hover:border-primary"
            }`}
          >
            {t.dog}
          </button>
          <button
            onClick={() => {
              setTypeFilter("Cat");
              setStatusFilter("all");
            }}
            className={`px-4 py-2 rounded-full font-medium transition-all cursor-pointer ${
              typeFilter === "Cat" && statusFilter === "all"
                ? "bg-primary text-white"
                : "bg-card-bg border border-card-border hover:border-primary"
            }`}
          >
            {t.cat}
          </button>
          <button
            onClick={() => {
              setTypeFilter("all");
              setStatusFilter("Lost");
            }}
            className={`px-4 py-2 rounded-full font-medium transition-all cursor-pointer ${
              statusFilter === "Lost" && typeFilter === "all"
                ? "bg-lost text-white"
                : "bg-card-bg border border-card-border hover:border-lost"
            }`}
          >
            {t.lost}
          </button>
          <button
            onClick={() => {
              setTypeFilter("all");
              setStatusFilter("Found");
            }}
            className={`px-4 py-2 rounded-full font-medium transition-all cursor-pointer ${
              statusFilter === "Found" && typeFilter === "all"
                ? "bg-found text-white"
                : "bg-card-bg border border-card-border hover:border-found"
            }`}
          >
            {t.found}
          </button>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted">
            {t.total}{" "}
            <span className="font-semibold text-foreground">
              {filteredPets.length}
            </span>{" "}
            {t.resultsCount}
          </p>
        </div>

        {/* Pet Grid */}
        {filteredPets.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPets.map((pet) => (
              <PetCard
                key={pet._id}
                role={pet.role}
                name={pet.name || t.nerguiii}
                gender={pet.gender}
                location={pet.location}
                description={pet.description}
                Date={pet.Date}
                petType={pet.petType}
                image={pet.image}
                breed={pet.breed}
                _id={pet._id}
                phonenumber={pet.phonenumber}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🐾</div>
            <h3 className="text-xl font-bold mb-2">{t.noResults}</h3>
            <p className="text-muted mb-6">{t.noResultsDescription}</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setTypeFilter("all");
                setStatusFilter("all");
              }}
              className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-full font-semibold transition-all"
            >
              {t.clearFilters}
            </button>
          </div>
        )}

        <div className="mt-16 text-center bg-card-bg rounded-2xl border border-card-border p-8">
          <h2 className="text-2xl font-bold mb-3">{t.notFoundTitle}</h2>
          <p className="text-muted mb-6">{t.notFoundDescription}</p>
          <Link
            href="/report"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-full font-semibold transition-all"
          >
            {t.submitReport}
            <RightArrow />
          </Link>
        </div>
      </div>
    </div>
  );
}
