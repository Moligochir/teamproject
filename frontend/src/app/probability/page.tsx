"use client";

import { useEffect, useState } from "react";

import { useUser } from "@clerk/nextjs";
import {
  getMatchesForPet,
  MatchResult,
  PetForMatching,
} from "@/app/lib/ai/petMatching";
import { useLanguage } from "@/app/contexts/Languagecontext";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

type PaginatedMatch = {
  currentMatch: MatchResult;
  matchedPet: PetForMatching;
  totalMatches: number;
  currentIndex: number;
};

export default function ProbabilityPage() {
  const { language } = useLanguage();
  const router = useRouter();
  const { user: clerkUser } = useUser();
  const [queryPet, setQueryPet] = useState<MatchPet | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<PaginatedMatch | null>(
    null,
  );
  const [allPets, setAllPets] = useState<PetForMatching[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const translations = {
    mn: {
      title: "🤖 AI Санал Болсон Тохирол",
      description: "Таны мэдээлэлтэй сайнаар тохирсон амьтнуудыг үзнэ үү",
      noMatches: "Тохирол олдсонгүй",
      noMatchesDesc: "Энэ амьтныг өөрийн постын эсрэг харьцуулна уу",
      searchAgain: "Буцах",
      matchScore: "Тохирлын оноо",
      breed: "Үүлдэр",
      gender: "Хүйс",
      type: "Төрөл",
      location: "Байршил",
      descriptionn: "Тайлбар",
      seeProfile: "Профайл үзэх",
      male: "Эрэгтэй",
      female: "Эмэгтэй",
      unknown: "Үл мэдэгдэх",
      dog: "Нохой",
      cat: "Муур",
      lost: "Төөрсөн",
      found: "Олдсон",
      loading: "Санал болсон тохирлуудыг ачаалж байна...",
      aiSuggestions: "🤖 Санал болсон тохирол",
      matchReasons: "Яагаад тохирсон?",
      next: "Дараа →",
      previous: "← Өмнө",
      of: "-ийн",
      confidenceScore: "Итгэлцүүлэлтийн оноо",
      closeDetails: "Хаах",
      imageMatch: "Зураг",
      breedMatch: "Үүлдэр",
      locationMatch: "Байршил",
      distance: "Зай",
      owner: "Эзэмшигч",
      email: "Имэйл",
      phone: "Утас",
      reportedBy: "Мэдээлсэн хүн",
      yourReport: "Таны мэдээлэл",
      matchDetails: "Тохирлын дэлгэрэнгүй",
    },
    en: {
      title: "🤖 AI Suggested Matches",
      description: "View pets that best match your report",
      noMatches: "No matches found",
      noMatchesDesc: "This post does not match with other reports",
      searchAgain: "Go Back",
      matchScore: "Match Score",
      breed: "Breed",
      gender: "Gender",
      type: "Type",
      location: "Location",
      descriptionn: "Description",
      seeProfile: "View Profile",
      male: "Male",
      female: "Female",
      unknown: "Unknown",
      dog: "Dog",
      cat: "Cat",
      lost: "Lost",
      found: "Found",
      loading: "Loading suggested matches...",
      aiSuggestions: "AI Suggested Match",
      matchReasons: "Why it matches?",
      next: "Next →",
      previous: "← Previous",
      of: "of",
      confidenceScore: "Confidence Score",
      closeDetails: "Close",
      imageMatch: "Image",
      breedMatch: "Breed",
      locationMatch: "Location",
      distance: "Distance",
      owner: "Owner",
      email: "Email",
      phone: "Phone",
      reportedBy: "Reported By",
      yourReport: "Your Report",
      matchDetails: "Match Details",
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
          `http://localhost:8000/lostFound/findid/${petIdParam}`,
        );
        const data = await res.json();
        pet = Array.isArray(data) ? data[0] : data;
      }

      if (!pet) {
        setQueryPet(null);
        setLoading(false);
        return;
      }

      setQueryPet(pet);

      const allPetsRes = await fetch("http://localhost:8000/lostFound");
      const allPetsData: PetForMatching[] = await allPetsRes.json();

      const otherUsersPets = allPetsData.filter(
        (p) => p._id !== pet._id && p.role !== pet.role,
      );

      if (otherUsersPets.length === 0) {
        setAllPets([]);
        setLoading(false);
        return;
      }

      setAllPets(otherUsersPets);

      const matches = await getMatchesForPet(pet._id, otherUsersPets);

      if (matches && matches.length > 0) {
        const firstMatchPet = otherUsersPets.find(
          (p) => p._id === matches[0].matchId,
        );
        if (firstMatchPet) {
          setAiSuggestions({
            currentMatch: matches[0],
            matchedPet: firstMatchPet,
            totalMatches: matches.length,
            currentIndex: 0,
          });
          setShowSuggestions(true);
        }
      }
    } catch (error) {
      console.log("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNextMatch = async () => {
    if (!aiSuggestions || !queryPet || !allPets.length) return;

    const matches = await getMatchesForPet(queryPet._id, allPets);
    if (matches && aiSuggestions.currentIndex < matches.length - 1) {
      const nextIndex = aiSuggestions.currentIndex + 1;
      const nextMatchPet = allPets.find(
        (p) => p._id === matches[nextIndex].matchId,
      );

      if (nextMatchPet) {
        setAiSuggestions({
          currentMatch: matches[nextIndex],
          matchedPet: nextMatchPet,
          totalMatches: matches.length,
          currentIndex: nextIndex,
        });
      }
    }
  };

  const handlePreviousMatch = async () => {
    if (!aiSuggestions || !queryPet || !allPets.length) return;

    const matches = await getMatchesForPet(queryPet._id, allPets);
    if (matches && aiSuggestions.currentIndex > 0) {
      const prevIndex = aiSuggestions.currentIndex - 1;
      const prevMatchPet = allPets.find(
        (p) => p._id === matches[prevIndex].matchId,
      );

      if (prevMatchPet) {
        setAiSuggestions({
          currentMatch: matches[prevIndex],
          matchedPet: prevMatchPet,
          totalMatches: matches.length,
          currentIndex: prevIndex,
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12 bg-gradient-to-br from-background via-card-bg to-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-5xl animate-bounce">🤖</div>
              </div>
              <div className="absolute inset-0">
                <div className="w-full h-full border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4 text-foreground animate-pulse">
              {t.title}
            </h1>
            <p className="text-muted text-lg max-w-2xl mx-auto animate-pulse">
              {t.description}
            </p>
          </div>

          {/* Skeleton Layout */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Left: Your Report Skeleton */}
            <div className="bg-card-bg rounded-2xl border-2 border-orange-500/30 p-8 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">📋</span>
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3 animate-pulse"></div>
              </div>

              <div className="space-y-4">
                {/* Image */}
                <div className="rounded-xl overflow-hidden h-64 bg-gray-300 dark:bg-gray-700 animate-pulse"></div>

                {/* Info */}
                <div>
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-3 animate-pulse"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-4 animate-pulse"></div>
                </div>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-2 gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="bg-background rounded-lg p-3 border border-card-border"
                    >
                      <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-2 animate-pulse"></div>
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                    </div>
                  ))}
                </div>

                {/* Description */}
                <div className="bg-background rounded-lg p-3 border border-card-border">
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-2 animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-5/6 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Match Score Skeleton */}
            <div className="bg-card-bg rounded-2xl border-2 border-primary/30 p-8 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">✨</span>
                  <div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-24 mb-2 animate-pulse"></div>
                    <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                  </div>
                </div>
                <div className="w-6 h-6 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>

              {/* Match Score */}
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 border border-primary/20 mb-6">
                <div className="text-center">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mx-auto mb-3 animate-pulse"></div>
                  <div className="h-16 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mx-auto animate-pulse"></div>
                </div>

                {/* Score Breakdown */}
                <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-primary/20">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="text-center">
                      <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mx-auto mb-2 animate-pulse"></div>
                      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mx-auto animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Matched Pet Preview */}
              <div className="rounded-xl overflow-hidden h-48 border border-card-border mb-4 bg-gray-300 dark:bg-gray-700 animate-pulse"></div>

              {/* Matched Pet Info */}
              <div>
                <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-3 animate-pulse"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Loading Message */}
          <div className="flex justify-center items-center gap-3 flex-wrap">
            <div
              className="w-2 h-2 bg-primary rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-primary rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-primary rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
            <span className="text-lg text-muted font-semibold">
              {t.loading}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!queryPet) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center bg-gradient-to-br from-background via-card-bg to-background">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-3xl font-bold mb-2">{t.noMatches}</h1>
          <p className="text-muted mb-8">{t.noMatchesDesc}</p>
          <Link
            href="/browse"
            className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-full font-semibold transition-all inline-block"
          >
            {t.searchAgain}
          </Link>
        </div>
      </div>
    );
  }

  if (!aiSuggestions || !showSuggestions) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center bg-gradient-to-br from-background via-card-bg to-background">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-3xl font-bold mb-2">{t.noMatches}</h1>
          <p className="text-muted mb-8">{t.noMatchesDesc}</p>
          <Link
            href="/browse"
            className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-full font-semibold transition-all inline-block"
          >
            {t.searchAgain}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-background via-card-bg to-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black mb-4 flex gap-3 items-center justify-center">
            <span className="text-4xl">🤖</span>
            {t.title}
          </h1>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            {t.description}
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Left: Your Report */}
          <div className="bg-card-bg rounded-2xl border-2 border-orange-500/30 p-8 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">📋</span>
              <h2 className="text-2xl font-bold text-foreground">
                {t.yourReport}
              </h2>
            </div>

            <div className="space-y-4">
              {/* Image */}
              <div className="rounded-xl overflow-hidden h-64">
                <img
                  src={queryPet.image}
                  alt={queryPet.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {queryPet.name}
                </h3>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                    queryPet.role?.toLowerCase() === "lost" ||
                    queryPet.role === "Төөрсөн"
                      ? "bg-red-500/20 text-red-700 dark:text-red-400 border border-red-500/50"
                      : "bg-green-500/20 text-green-700 dark:text-green-400 border border-green-500/50"
                  }`}
                >
                  {queryPet.role?.toLowerCase() === "lost" ||
                  queryPet.role === "Төөрсөн"
                    ? `🔍 ${t.lost}`
                    : `✓ ${t.found}`}
                </span>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-background rounded-lg p-3 border border-card-border">
                  <p className="text-xs text-muted font-medium">{t.breed}</p>
                  <p className="font-bold text-sm">{queryPet.breed}</p>
                </div>
                <div className="bg-background rounded-lg p-3 border border-card-border">
                  <p className="text-xs text-muted font-medium">{t.type}</p>
                  <p className="font-bold text-sm">
                    {translateValue("petType", queryPet.petType)}
                  </p>
                </div>
                <div className="bg-background rounded-lg p-3 border border-card-border">
                  <p className="text-xs text-muted font-medium">{t.gender}</p>
                  <p className="font-bold text-sm">
                    {translateValue("gender", queryPet.gender)}
                  </p>
                </div>
                <div className="bg-background rounded-lg p-3 border border-card-border">
                  <p className="text-xs text-muted font-medium">
                    📍 {t.location}
                  </p>
                  <p className="font-bold text-sm line-clamp-1">
                    {queryPet.location}
                  </p>
                </div>
              </div>

              {queryPet.description && (
                <div className="bg-background rounded-lg p-3 border border-card-border">
                  <p className="text-xs text-muted font-medium mb-1">
                    {t.descriptionn}
                  </p>
                  <p className="text-sm text-foreground line-clamp-2">
                    {queryPet.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Match Score Card */}
          <div className="bg-card-bg rounded-2xl border-2 border-primary/30 p-8 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">✨</span>
                <div>
                  <p className="text-sm text-muted">{t.aiSuggestions}</p>
                  <p className="text-lg font-bold text-foreground">
                    {aiSuggestions.currentIndex + 1} /{" "}
                    {aiSuggestions.totalMatches}
                  </p>
                </div>
              </div>
              <button
                onClick={() => router.push("/browse")}
                className="text-2xl text-muted hover:text-foreground transition-colors"
              >
                ×
              </button>
            </div>

            {/* Match Score */}
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 border border-primary/20 mb-6">
              <div className="text-center">
                <p className="text-sm text-muted font-medium mb-2">
                  {t.confidenceScore}
                </p>
                <p className="text-6xl font-black text-primary">
                  {aiSuggestions.currentMatch.confidenceScore}%
                </p>
              </div>

              {/* Score Breakdown */}
              <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-primary/20">
                <div className="text-center">
                  <p className="text-xs text-muted font-medium mb-1">🖼️</p>
                  <p className="text-2xl font-bold text-foreground">
                    {aiSuggestions.currentMatch.imageMatch}%
                  </p>
                  <p className="text-xs text-muted">{t.imageMatch}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted font-medium mb-1">🐕</p>
                  <p className="text-2xl font-bold text-foreground">
                    {aiSuggestions.currentMatch.breedMatch}%
                  </p>
                  <p className="text-xs text-muted">{t.breedMatch}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted font-medium mb-1">📍</p>
                  <p className="text-2xl font-bold text-foreground">
                    {aiSuggestions.currentMatch.locationMatch}%
                  </p>
                  <p className="text-xs text-muted">{t.locationMatch}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted font-medium mb-1">🗺️</p>
                  <p className="text-2xl font-bold text-foreground">
                    {aiSuggestions.currentMatch.distance}km
                  </p>
                  <p className="text-xs text-muted">{t.distance}</p>
                </div>
              </div>
            </div>

            {/* Matched Pet Preview */}
            <div className="rounded-xl overflow-hidden h-48 border border-card-border mb-4">
              <img
                src={aiSuggestions.matchedPet.image}
                alt={aiSuggestions.matchedPet.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Matched Pet Info */}
            <div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                {aiSuggestions.matchedPet.name}
              </h3>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                  aiSuggestions.matchedPet.role?.toLowerCase() === "lost" ||
                  aiSuggestions.matchedPet.role === "Төөрсөн"
                    ? "bg-red-500/20 text-red-700 dark:text-red-400 border border-red-500/50"
                    : "bg-green-500/20 text-green-700 dark:text-green-400 border border-green-500/50"
                }`}
              >
                {aiSuggestions.matchedPet.role?.toLowerCase() === "lost" ||
                aiSuggestions.matchedPet.role === "Төөрсөн"
                  ? `🔍 ${t.lost}`
                  : `✓ ${t.found}`}
              </span>
            </div>
          </div>
        </div>

        {/* Full Width: Match Reasons */}
        <div className="bg-card-bg rounded-2xl border border-card-border p-8 mb-12 shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">🎯</span>
            <h3 className="text-2xl font-bold text-foreground">
              {t.matchReasons}
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {aiSuggestions.currentMatch.reasons.map((reason, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-4 bg-background rounded-lg border border-card-border hover:border-primary/50 transition-all"
              >
                <span className="text-2xl shrink-0">
                  {reason.type === "image"
                    ? "🖼️"
                    : reason.type === "breed"
                      ? "🐕"
                      : reason.type === "location"
                        ? "📍"
                        : reason.type === "time"
                          ? "🕐"
                          : reason.type === "type"
                            ? "🐾"
                            : "📝"}
                </span>
                <div className="flex-1">
                  <p className="font-bold text-foreground">
                    {language === "mn"
                      ? reason.messageKey === "image.excellent"
                        ? "Зураг маш төстэй байна"
                        : reason.messageKey === "image.good"
                          ? "Зурагууд төстэй байна"
                          : reason.messageKey === "breed.exact"
                            ? "Адилхан үүлдэр"
                            : reason.messageKey === "breed.similar"
                              ? "Төстэй үүлдэр"
                              : reason.messageKey === "location.very_close"
                                ? "Маш ойрын байршил"
                                : reason.messageKey === "location.close"
                                  ? "Ойрын байршил"
                                  : reason.messageKey === "time.same_day"
                                    ? "Нэг өдрийн дотор"
                                    : reason.messageKey === "time.few_days"
                                      ? "Цөөн өдрийн зөрүү"
                                      : reason.messageKey
                      : reason.messageKey}
                  </p>
                  {reason.details && (
                    <p className="text-sm text-muted mt-1">{reason.details}</p>
                  )}
                  <p className="text-xs font-bold text-primary mt-2">
                    +{reason.score}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Full Width: Pet Details */}
        <div className="bg-card-bg rounded-2xl border border-card-border p-8 mb-12 shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">ℹ️</span>
            <h3 className="text-2xl font-bold text-foreground">
              {t.matchDetails}
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-background rounded-lg p-4 border border-card-border">
              <p className="text-xs text-muted font-medium mb-1">{t.breed}</p>
              <p className="text-lg font-bold text-foreground">
                {aiSuggestions.matchedPet.breed}
              </p>
            </div>
            <div className="bg-background rounded-lg p-4 border border-card-border">
              <p className="text-xs text-muted font-medium mb-1">{t.type}</p>
              <p className="text-lg font-bold text-foreground">
                {translateValue("petType", aiSuggestions.matchedPet.petType)}
              </p>
            </div>
            <div className="bg-background rounded-lg p-4 border border-card-border">
              <p className="text-xs text-muted font-medium mb-1">
                📍 {t.location}
              </p>
              <p className="text-lg font-bold text-foreground">
                {aiSuggestions.matchedPet.location}
              </p>
            </div>
            <div className="bg-background rounded-lg p-4 border border-card-border">
              <p className="text-xs text-muted font-medium mb-1">
                {t.reportedBy}
              </p>
              <p className="text-lg font-bold text-foreground">
                {language === "mn"
                  ? aiSuggestions.matchedPet.role === "Lost" ||
                    aiSuggestions.matchedPet.role === "Төөрсөн"
                    ? "Шинээр"
                    : "Олшруулсан"
                  : aiSuggestions.matchedPet.role === "Lost"
                    ? "New Report"
                    : "Found Report"}
              </p>
            </div>
          </div>

          {aiSuggestions.matchedPet.description && (
            <div className="bg-background rounded-lg p-4 border border-card-border">
              <p className="text-xs text-muted font-medium mb-2">
                {t.descriptionn}
              </p>
              <p className="text-foreground leading-relaxed">
                {aiSuggestions.matchedPet.description}
              </p>
            </div>
          )}
        </div>

        {/* Pagination & Controls */}
        <div className="space-y-6">
          {/* Pagination */}
          <div className="flex items-center justify-between gap-4 bg-card-bg rounded-2xl border border-card-border p-6">
            <button
              onClick={handlePreviousMatch}
              disabled={aiSuggestions.currentIndex === 0}
              className="px-6 py-3 bg-background border border-card-border disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary text-foreground rounded-lg font-semibold transition-all"
            >
              {t.previous}
            </button>

            <div className="flex-1 text-center">
              <p className="text-lg font-bold text-foreground mb-3">
                {aiSuggestions.currentIndex + 1} / {aiSuggestions.totalMatches}
              </p>
              <div className="w-full h-3 bg-background rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 transition-all duration-300"
                  style={{
                    width: `${
                      ((aiSuggestions.currentIndex + 1) /
                        aiSuggestions.totalMatches) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>

            <button
              onClick={handleNextMatch}
              disabled={
                aiSuggestions.currentIndex === aiSuggestions.totalMatches - 1
              }
              className="px-6 py-3 bg-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-dark text-white rounded-lg font-semibold transition-all"
            >
              {t.next}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() =>
                router.push(`/pet/${aiSuggestions.matchedPet._id}`)
              }
              className="flex-1 cursor-pointer px-6 py-4 bg-gradient-to-r from-orange-500 to-rose-500 hover:shadow-lg hover:shadow-orange-500/30 text-white rounded-xl font-bold transition-all hover:-translate-y-1 active:scale-95"
            >
              {t.seeProfile} →
            </button>
            <button
              onClick={() => router.push("/browse")}
              className="flex-1 cursor-pointer px-6 py-4 bg-card-bg border-2 border-card-border hover:border-primary text-foreground rounded-xl font-bold transition-all hover:-translate-y-1 active:scale-95"
            >
              {t.closeDetails}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
