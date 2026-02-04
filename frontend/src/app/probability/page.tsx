"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useLanguage } from "@/app/contexts/Languagecontext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MatchSuggestions from "@/app/components/MatchSuggestions";

type MatchPet = {
  _id: string;
  name: string;
  breed: string;
  gender: string;
  petType: string;
  role: string;
  location: string;
  description: string;
  image: string;
  userId?: { _id: string; name: string; email: string };
  lat?: number;
  lng?: number;
  createdAt?: string;
};

export default function ProbabilityPage() {
  const { language } = useLanguage();
  const router = useRouter();
  const { user: clerkUser } = useUser();
  const [queryPet, setQueryPet] = useState<MatchPet | null>(null);
  const [allPets, setAllPets] = useState<MatchPet[]>([]);
  const [loading, setLoading] = useState(true);

  const translations = {
    mn: {
      title: "AI Тохирол",
      description: "Таны мэдээлэлтэй тохирсон амьтнуудыг үзнэ үү",
      noMatches: "Тохирол олдсонгүй",
      noMatchesDesc: "Энэ амьтныг өөрийн постын эсрэг харьцуулна уу",
      searchAgain: "Буцах",
      breed: "Үүлдэр",
      gender: "Хүйс",
      type: "Төрөл",
      location: "Байршил",
      descriptionn: "Тайлбар",
      seeProfile: "Үзэх",
      male: "Эрэгтэй",
      female: "Эмэгтэй",
      unknown: "Үл мэдэгдэх",
      dog: "Нохой",
      cat: "Муур",
      lost: "Төөрсөн",
      found: "Олдсон",
      loading: "Уншиж байна...",
      yourReport: "Таны мэдээлэл",
      findingMatches: "Тохирлыг хайж байна...",
      analyzing: "Мэдээлэл шинжилж байна...",
      searching: "Сүлжээнээс хайж байна...",
    },
    en: {
      title: "AI Matches",
      description: "View pets that match your report",
      noMatches: "No matches",
      noMatchesDesc: "This post does not match with other reports",
      searchAgain: "Go Back",
      breed: "Breed",
      gender: "Gender",
      type: "Type",
      location: "Location",
      descriptionn: "Description",
      seeProfile: "View",
      male: "Male",
      female: "Female",
      unknown: "Unknown",
      dog: "Dog",
      cat: "Cat",
      lost: "Lost",
      found: "Found",
      loading: "Loading...",
      yourReport: "Your Report",
      findingMatches: "Finding matches...",
      analyzing: "Analyzing data...",
      searching: "Searching network...",
    },
  };

  const t = translations[language];

  const translateValue = (field: string, value: string) => {
    if (field === "gender") {
      if (value?.toLowerCase() === "male" || value === "Эрэгтэй")
        return language === "mn" ? "Эрэгтэй" : "Male";
      if (value?.toLowerCase() === "female" || value === "Эмэгтэй")
        return language === "mn" ? "Эмэгтэй" : "Female";
      return t.unknown;
    }
    if (field === "petType") {
      if (value?.toLowerCase() === "dog" || value === "Нохой")
        return language === "mn" ? "Нохой" : "Dog";
      if (value?.toLowerCase() === "cat" || value === "Муур")
        return language === "mn" ? "Муур" : "Cat";
    }
    if (field === "role") {
      if (value?.toLowerCase() === "lost" || value === "Төөрсөн")
        return language === "mn" ? "Төөрсөн" : "Lost";
      if (value?.toLowerCase() === "found" || value === "Олдсон")
        return language === "mn" ? "Олдсон" : "Found";
    }
    return value;
  };

  useEffect(() => {
    fetchPetAndMatches();
  }, []);

  const fetchPetAndMatches = async () => {
    try {
      setLoading(true);

      const petIdParam = new URLSearchParams(window.location.search).get(
        "petId",
      );
      const sessionPetData = sessionStorage.getItem("queryPet");

      let pet: MatchPet | null = null;

      if (sessionPetData) {
        pet = JSON.parse(sessionPetData);
      } else if (petIdParam) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/lostFound/findid/${petIdParam}`,
        );
        const data = await res.json();
        pet = Array.isArray(data) ? data[0] : data;
      }

      if (!pet || !pet._id) {
        setQueryPet(null);
        setLoading(false);
        return;
      }

      setQueryPet(pet);

      // ✅ Fetch all pets for MatchSuggestions
      const allPetsRes = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/lostFound`,
      );
      const allPetsData: MatchPet[] = await allPetsRes.json();
      setAllPets(allPetsData);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8 pt-24">
        <div className="max-w-6xl mx-auto">
          {/* Header Skeleton */}
          <div className="mb-12">
            <div className="h-10 w-48 bg-gray-300 dark:bg-gray-700 rounded-lg mb-3 animate-pulse"></div>
            <div className="h-5 w-96 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
          </div>

          {/* Your Report Section Skeleton */}
          <div className="mb-12">
            <div className="h-8 w-32 bg-gray-300 dark:bg-gray-700 rounded-lg mb-6 animate-pulse"></div>
            <div className="bg-card-bg rounded-xl border border-card-border p-6">
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Image Skeleton */}
                <div className="w-full sm:w-48 h-48 rounded-lg bg-gray-300 dark:bg-gray-700 shrink-0 animate-pulse"></div>

                {/* Info Skeleton */}
                <div className="flex-1 space-y-4">
                  {/* Name */}
                  <div className="space-y-2">
                    <div className="h-8 w-40 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-5 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded mb-2 animate-pulse"></div>
                      <div className="h-5 w-24 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                    <div>
                      <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded mb-2 animate-pulse"></div>
                      <div className="h-5 w-24 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                    <div>
                      <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded mb-2 animate-pulse"></div>
                      <div className="h-5 w-24 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                    <div>
                      <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded mb-2 animate-pulse"></div>
                      <div className="h-5 w-24 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2 pt-2">
                    <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-4 w-5/6 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Match Suggestions Section Skeleton */}
          <div>
            {/* Header */}
            <div className="mb-6 space-y-2">
              <div className="h-8 w-48 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              <div className="h-4 w-64 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
            </div>

            {/* Match Cards Skeleton - 3 cards */}
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="mb-6 bg-card-bg border border-card-border rounded-xl overflow-hidden animate-pulse"
              >
                {/* Header Skeleton */}
                <div className="bg-gray-300 dark:bg-gray-700 p-6 h-24"></div>

                {/* Details Skeleton */}
                <div className="p-6 space-y-6">
                  {/* Score Breakdown Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[1, 2, 3, 4].map((j) => (
                      <div
                        key={j}
                        className="h-24 bg-gray-200 dark:bg-gray-800 rounded-lg"
                      ></div>
                    ))}
                  </div>

                  {/* Assessment Box */}
                  <div className="bg-gray-100 dark:bg-gray-900/30 rounded-lg p-4 space-y-3">
                    <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded"></div>
                      <div className="h-3 w-5/6 bg-gray-300 dark:bg-gray-700 rounded"></div>
                      <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded"></div>
                      <div className="h-3 w-5/6 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    </div>
                  </div>

                  {/* Reasons Button */}
                  <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                    <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Loading Message with Animation */}
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-primary text-white px-6 py-4 rounded-full shadow-lg flex items-center gap-3 z-50">
            <div className="flex gap-1.5">
              <div
                className="w-2 h-2 bg-white rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-white rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-white rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
            <span className="text-sm font-semibold">{t.findingMatches}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!queryPet) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="max-w-sm text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold mb-2">{t.noMatches}</h1>
          <p className="text-muted text-sm mb-6">{t.noMatchesDesc}</p>
          <Link
            href="/browse"
            className="inline-block px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            {t.searchAgain}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-black mb-2">{t.title}</h1>
          <p className="text-muted">{t.description}</p>
        </div>

        {/* Your Report Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">{t.yourReport}</h2>
          <div className="bg-linear-to-br from-card-bg to-card-bg/50 rounded-2xl  p-8 backdrop-blur-sm hover:border-orange-500/60 transition-all duration-300">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Image Section */}
              <div className="w-full lg:w-64 h-64 rounded-2xl overflow-hidden bg-linear-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 shrink-0 shadow-lg border-4 border-orange-500/20 hover:shadow-orange-500/30 transition-all duration-300 group">
                <img
                  src={queryPet.image}
                  alt={queryPet.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Info Section */}
              <div className="flex-1 space-y-6">
                {/* Header */}
                <div>
                  <h3 className="text-4xl font-black mb-3 text-white">
                    {queryPet.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`inline-block px-4 py-2 text-sm font-bold rounded-full transition-all ${
                        queryPet.role?.toLowerCase() === "lost" ||
                        queryPet.role === "Төөрсөн"
                          ? "status-lost"
                          : "status-found"
                      }`}
                    >
                      {queryPet.role?.toLowerCase() === "lost" ||
                      queryPet.role === "Төөрсөн"
                        ? t.lost
                        : t.found}
                    </span>
                    <span className="text-sm text-muted font-medium px-3 py-2 bg-white/5 rounded-full">
                      🐾 {translateValue("petType", queryPet.petType)}
                    </span>
                  </div>
                </div>

                {/* Details Grid - 2x2 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Breed */}
                  <div className="bg-linear-to-br from-white/10 to-white/5 rounded-xl p-4 border border-primary/30 hover:border-primary/60 transition-all hover:shadow-lg hover:shadow-primary/20">
                    <p className="text-muted text-xs font-bold mb-2 uppercase tracking-wider">
                      {t.breed}
                    </p>
                    <p className="font-bold text-lg text-white">
                      {queryPet.breed || "-"}
                    </p>
                  </div>

                  {/* Type */}
                  <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-4 border border-orange-500/30 hover:border-orange-500/60 transition-all hover:shadow-lg hover:shadow-orange-500/20">
                    <p className="text-muted text-xs font-bold mb-2 uppercase tracking-wider">
                      {t.type}
                    </p>
                    <p className="font-bold text-lg text-white">
                      {translateValue("petType", queryPet.petType)}
                    </p>
                  </div>

                  {/* Gender */}
                  <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-4 border border-primary/30 hover:border-primary/60 transition-all hover:shadow-lg hover:shadow-primary/20">
                    <p className="text-muted text-xs font-bold mb-2 uppercase tracking-wider">
                      {t.gender}
                    </p>
                    <p className="font-bold text-lg text-white">
                      {translateValue("gender", queryPet.gender) || "-"}
                    </p>
                  </div>

                  {/* Location */}
                  <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-4 border border-primary/30 hover:border-primary/60 transition-all hover:shadow-lg hover:shadow-primary/20">
                    <p className="text-muted text-xs font-bold mb-2 uppercase tracking-wider">
                      📍 {t.location}
                    </p>
                    <p className="font-bold text-lg text-white line-clamp-2">
                      {queryPet.location}
                    </p>
                  </div>
                </div>

                {/* Description */}
                {queryPet.description && (
                  <div className="bg-linear-to-r from-orange-500/10 to-rose-500/10 rounded-xl p-6 border border-orange-500/30 hover:border-orange-500/60 transition-all">
                    <p className="text-muted text-sm font-bold mb-3 uppercase tracking-widest flex items-center gap-2">
                      <span className="text-lg">📝</span>
                      {t.descriptionn}
                    </p>
                    <p className="text-sm leading-relaxed text-white/90 line-clamp-3 hover:line-clamp-none transition-all">
                      {queryPet.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Match Suggestions */}
        <div>
          <MatchSuggestions
            petId={queryPet._id}
            petRole={queryPet.role as "Lost" | "Found"}
            petName={queryPet.name}
            allPets={allPets}
          />
        </div>
      </div>
    </div>
  );
}
