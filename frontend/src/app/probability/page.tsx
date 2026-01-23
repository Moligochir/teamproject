"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "../contexts/Languagecontext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BulbIcon, BulbIcon2 } from "../components/icons";

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
  matchScore: number;
  confidence: "HIGH" | "MEDIUM" | "LOW";
  matchId?: string;
};

export default function ProbabilityPage() {
  const { language } = useLanguage();
  const router = useRouter();
  const [matches, setMatches] = useState<MatchPet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState<MatchPet | null>(null);

  const translations = {
    mn: {
      title: " Тохирсон Амьтан",
      description: "Таны мэдээлэлтэй хамгийн сайн тохирсон амьтнуудыг үзнэ үү",
      noMatches: "Тохирол олдсонгүй",
      noMatchesDesc: "Дараагийн мэдээлэл илгээхэд тохирол олдох болно",
      searchAgain: "Дахин хайх",
      matchScore: "Тохирлын оноо",
      confidence: "Итгэлцүүрийн түвшин",
      highConfidence: "Өндөр",
      mediumConfidence: "Дунд",
      lowConfidence: "Нам",
      details: "Дэлгэрэнгүй",
      closeDetails: "Хаах",
      breed: "Үүлдэр",
      gender: "Хүйс",
      type: "Төрөл",
      location: "Байршил",
      descriptionn: "Тайлбар",
      contactOwner: "Эзэмшигчтэй холбогдох",
      seeProfile: "Профайл үзэх",
      male: "Эрэгтэй",
      female: "Эмэгтэй",
      unknown: "Үл мэдэгдэх",
      dog: "Нохой",
      cat: "Муур",
      lost: "Төөрсөн",
      found: "Олдсон",
      loading: "Ачаалж байна...",
      error: "Алдаа гарлаа",
    },
    en: {
      title: " Matched Pets",
      description: "View pets that best match your report",
      noMatches: "No matches found",
      noMatchesDesc: "Submit another report to find matches",
      searchAgain: "Search Again",
      matchScore: "Match Score",
      confidence: "Confidence Level",
      highConfidence: "High",
      mediumConfidence: "Medium",
      lowConfidence: "Low",
      details: "Details",
      closeDetails: "Close",
      breed: "Breed",
      gender: "Gender",
      type: "Type",
      location: "Location",
      descriptionn: "Description",
      contactOwner: "Contact Owner",
      seeProfile: "View Profile",
      male: "Male",
      female: "Female",
      unknown: "Unknown",
      dog: "Dog",
      cat: "Cat",
      lost: "Lost",
      found: "Found",
      loading: "Loading...",
      error: "Error occurred",
    },
  };

  const t = translations[language];

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case "HIGH":
        return "🟢 " + t.highConfidence;
      case "MEDIUM":
        return "🟡 " + t.mediumConfidence;
      case "LOW":
        return "🔴 " + t.lowConfidence;
      default:
        return t.unknown;
    }
  };

  const getConfidenceBgColor = (confidence: string) => {
    switch (confidence) {
      case "HIGH":
        return "bg-green-500/20 border-green-500/50 text-green-700";
      case "MEDIUM":
        return "bg-yellow-500/20 border-yellow-500/50 text-yellow-700";
      case "LOW":
        return "bg-red-500/20 border-red-500/50 text-red-700";
      default:
        return "bg-gray-500/20 border-gray-500/50 text-gray-700";
    }
  };

  const translateValue = (field: string, value: string) => {
    if (field === "gender") {
      if (value.toLowerCase() === "male" || value === "Эрэгтэй")
        return language === "mn" ? "Эрэгтэй" : "Male";
      if (value.toLowerCase() === "female" || value === "Эмэгтэй")
        return language === "mn" ? "Эмэгтэй" : "Female";
      return t.unknown;
    }
    if (field === "petType") {
      if (value.toLowerCase() === "dog" || value === "Нохой")
        return language === "mn" ? "Нохой" : "Dog";
      if (value.toLowerCase() === "cat" || value === "Муур")
        return language === "mn" ? "Муур" : "Cat";
    }
    if (field === "role") {
      if (value.toLowerCase() === "lost" || value === "Төөрсөн")
        return language === "mn" ? "Төөрсөн" : "Lost";
      if (value.toLowerCase() === "found" || value === "Олдсон")
        return language === "mn" ? "Олдсон" : "Found";
    }
    return value;
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      // Get from sessionStorage or localStorage if available
      const matchData = sessionStorage.getItem("matchData");

      if (matchData) {
        const parsedMatches = JSON.parse(matchData);
        setMatches(parsedMatches);
      } else {
        // If no data in session, try to fetch from API
        const response = await fetch("http://localhost:8000/lostFound", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setMatches(data.slice(0, 10)); // Limit to 10 matches
      }
    } catch (error) {
      console.log("Error fetching matches:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-muted">{t.loading}</p>
        </div>
      </div>
    );
  }

  if (!matches || matches.length === 0) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-3xl font-bold mb-2">{t.noMatches}</h1>
          <p className="text-muted mb-8">{t.noMatchesDesc}</p>
          <Link
            href="/report"
            className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-full font-semibold transition-all inline-block"
          >
            {t.searchAgain}
          </Link>
        </div>
      </div>
    );
  }
  console.log(matches, "matches");

  return (
    <div className="min-h-screen py-12 bg-linear-to-br from-background via-card-bg to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 flex gap-3 items-center justify-center">
            <span>
              <BulbIcon2 />
            </span>
            {t.title}
          </h1>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            {t.description}
          </p>
        </div>

        {/* Matches Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {matches.map((match, index) => (
            <div
              key={match._id || index}
              className="group bg-card-bg rounded-2xl border border-card-border overflow-hidden hover:border-primary/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              {/* Image Section */}
              <div className="relative h-56 overflow-hidden bg-gray-200">
                <img
                  src={match.image}
                  alt={match.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

                {/* Score Badge */}
                <div className="absolute top-4 right-4">
                  <div className="flex flex-col items-center gap-1 bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                    <span className="text-2xl font-bold text-primary">
                      {match.matchScore}%
                    </span>
                    <span className="text-xs font-semibold text-muted">
                      {t.matchScore}
                    </span>
                  </div>
                </div>

                {/* Confidence Badge */}
                <div className="absolute bottom-4 left-4">
                  <div
                    className={`px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm ${getConfidenceBgColor(match.confidence)} border`}
                  >
                    {getConfidenceColor(match.confidence)}
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6">
                {/* Pet Name */}
                <h3 className="text-2xl font-bold text-foreground mb-3 line-clamp-2">
                  {match.name || "Pet"}
                </h3>

                {/* Quick Info */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted font-medium">
                      {t.type}:
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      {translateValue("petType", match.petType)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted font-medium">
                      {t.breed}:
                    </span>
                    <span className="text-sm font-semibold text-foreground line-clamp-1">
                      {match.breed}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted font-medium">
                      {t.gender}:
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      {translateValue("gender", match.gender)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted font-medium flex gap-1 items-center">
                      {t.location.slice(0, 80)}:
                    </span>
                    <span className="text-sm text-foreground line-clamp-1">
                      {match.location}
                    </span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="mb-6">
                  <span
                    className={`inline-block px-4 py-2 rounded-full text-xs font-bold ${
                      match.role?.toLowerCase() === "lost" ||
                      match.role === "Төөрсөн"
                        ? "bg-red-500/20 text-red-700 border border-red-500/50"
                        : "bg-green-500/20 text-green-700 border border-green-500/50"
                    }`}
                  >
                    {match.role?.toLowerCase() === "lost" ||
                    match.role === "Төөрсөн"
                      ? `🔍 ${t.lost}`
                      : `✓ ${t.found}`}
                  </span>
                </div>

                {/* Description Preview */}
                <p className="text-sm text-muted mb-6 line-clamp-2">
                  {match.description}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedMatch(match)}
                    className="flex-1 px-4 py-2.5 cursor-pointer bg-primary/10 hover:bg-primary/20 text-primary rounded-lg font-semibold text-sm transition-all duration-200"
                  >
                    {t.details}
                  </button>
                  <button
                    onClick={() => router.push(`/pet/${match._id}`)}
                    className="flex-1 cursor-pointer px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg font-semibold text-sm transition-all duration-200"
                  >
                    {t.seeProfile}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedMatch && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card-bg rounded-2xl border border-card-border max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-card-bg border-b border-card-border p-6 flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-bold text-foreground">
                  {selectedMatch.name}
                </h2>
                <div className="flex gap-2 mt-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      selectedMatch.role?.toLowerCase() === "lost" ||
                      selectedMatch.role === "Төөрсөн"
                        ? "bg-red-500/20 text-red-700 border border-red-500/50"
                        : "bg-green-500/20 text-green-700 border border-green-500/50"
                    }`}
                  >
                    {selectedMatch.role?.toLowerCase() === "lost" ||
                    selectedMatch.role === "Төөрсөн"
                      ? `🔍 ${t.lost}`
                      : `✓ ${t.found}`}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${getConfidenceBgColor(selectedMatch.confidence)} border`}
                  >
                    {getConfidenceColor(selectedMatch.confidence)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedMatch(null)}
                className="text-muted hover:text-foreground text-3xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Image */}
              <div className="rounded-xl overflow-hidden h-96">
                <img
                  src={selectedMatch.image}
                  alt={selectedMatch.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Match Score */}
              <div className="bg-primary/10 rounded-xl p-6 border border-primary/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted font-medium mb-1">
                      {t.matchScore}
                    </p>
                    <p className="text-4xl font-bold text-primary">
                      {selectedMatch.matchScore}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted font-medium mb-1">
                      {t.confidence}
                    </p>
                    <p className="text-xl font-bold text-foreground">
                      {getConfidenceColor(selectedMatch.confidence)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-background rounded-xl p-4 border border-card-border">
                  <p className="text-xs text-muted font-medium mb-2">
                    {t.breed}
                  </p>
                  <p className="text-lg font-semibold text-foreground">
                    {selectedMatch.breed}
                  </p>
                </div>
                <div className="bg-background rounded-xl p-4 border border-card-border">
                  <p className="text-xs text-muted font-medium mb-2">
                    {t.gender}
                  </p>
                  <p className="text-lg font-semibold text-foreground">
                    {translateValue("gender", selectedMatch.gender)}
                  </p>
                </div>
                <div className="bg-background rounded-xl p-4 border border-card-border">
                  <p className="text-xs text-muted font-medium mb-2">
                    {t.type}
                  </p>
                  <p className="text-lg font-semibold text-foreground">
                    {translateValue("petType", selectedMatch.petType)}
                  </p>
                </div>
                <div className="bg-background rounded-xl p-4 border border-card-border">
                  <p className="text-xs text-muted font-medium mb-2 flex gap-1 items-center">
                    📍 {t.location}
                  </p>
                  <p className="text-lg font-semibold text-foreground">
                    {selectedMatch.location}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="bg-background rounded-xl p-4 border border-card-border">
                <p className="text-xs text-muted font-medium mb-2">
                  {t.descriptionn}
                </p>
                <p className="text-foreground leading-relaxed">
                  {selectedMatch.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => router.push(`/pet/${selectedMatch._id}`)}
                  className="flex-1 cursor-pointer px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-semibold transition-all"
                >
                  {t.seeProfile}
                </button>
                <button
                  onClick={() => setSelectedMatch(null)}
                  className="flex-1 cursor-pointer px-6 py-3 bg-card-bg border border-card-border hover:border-primary text-foreground rounded-lg font-semibold transition-all"
                >
                  {t.closeDetails}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
