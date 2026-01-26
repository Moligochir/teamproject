"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/app/contexts/Languagecontext";
import {
  getMatchesForPet,
  MatchResult,
  PetForMatching,
  getReasonMessage,
  MatchReason,
} from "../lib/ai/petMatching";

interface MatchSuggestionsProps {
  petId: string;
  petRole: "Lost" | "Found";
  allPets?: PetForMatching[];
}

export default function MatchSuggestions({
  petId,
  petRole,
  allPets = [],
}: MatchSuggestionsProps) {
  const { language } = useLanguage();
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [allPetsData, setAllPetsData] = useState<PetForMatching[]>(allPets);
  const [loading, setLoading] = useState(true);
  const [dismissedMatches, setDismissedMatches] = useState<Set<string>>(
    new Set(),
  );
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);

  const translations = {
    mn: {
      possibleMatches: "Боломжтой тохирoлууд",
      confidenceScore: "Тохирoлын оноо",
      whyItMatches: "Яагаад тохирсон?",
      contactOwner: "Эзэмшигчтэй холбогдох",
      dismissMatch: "Энэ биш",
      viewDetails: "Дэлгэрэнгүй үзэх",
      noMatches: "Одоогоор тохирсон амьтан байхгүй",
      tryAgain: "Дахин хайх",
      matchingFactors: "Тохирлын хүчин зүйлүүд",
      confidence: "үр дүн",
      excellent: "Гайхалтай",
      good: "Сайн",
      possible: "Боломжтой",
      totalScore: "Нийт оноо",
      reasons: "Үндэслэл",
      matchDetails: "Тохирлын нарийвчилал",
      reliability: "Тохирoлын оноо",
      expandReasons: "Нарийвчилалыг харах",
      collapseReasons: "Нуух",
    },
    en: {
      possibleMatches: "Possible Matches",
      confidenceScore: "Match Score",
      whyItMatches: "Why it matches?",
      contactOwner: "Contact Owner",
      dismissMatch: "Not this one",
      viewDetails: "View Details",
      noMatches: "No possible matches yet",
      tryAgain: "Try Again",
      matchingFactors: "Matching Factors",
      confidence: "Confidence Level",
      excellent: "Excellent",
      good: "Good",
      possible: "Possible",
      totalScore: "Total Score",
      reasons: "Reasons",
      matchDetails: "Match Details",
      reliability: "Reliability",
      expandReasons: "Show Details",
      collapseReasons: "Hide Details",
    },
  };

  const t = translations[language];

  useEffect(() => {
    const fetchMatches = async () => {
      let petsToUse = allPetsData;

      if (allPetsData.length === 0) {
        try {
          const res = await fetch(`http://localhost:8000/lostFound`);
          const pets = await res.json();
          petsToUse = pets;
          setAllPetsData(pets);
        } catch (err) {
          console.log("Error fetching pets:", err);
          setLoading(false);
          return;
        }
      }

      try {
        const foundMatches = await getMatchesForPet(petId, petsToUse);
        setMatches(
          foundMatches.filter((m) => !dismissedMatches.has(m.matchId)),
        );
      } catch (err) {
        console.log("Error getting matches:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [petId, dismissedMatches, allPetsData]);

  const handleDismiss = (matchId: string) => {
    const newDismissed = new Set(dismissedMatches);
    newDismissed.add(matchId);
    setDismissedMatches(newDismissed);
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 80) {
      return {
        bg: "bg-gradient-to-r from-green-900 via-green-800 to-green-500 animate-pulse",
        text: "text-green-600",
        level: t.excellent,
      };
    }
    if (score >= 60) {
      return {
        bg: "bg-gradient-to-r from-orange-600 to-yellow-500 animate-pulse",
        text: "text-orange-600",
        level: t.good,
      };
    }
    return {
      bg: "bg-gradient-to-r from-red-600 to-red-400 animate-pulse",
      text: "text-yellow-600",
      level: t.possible,
    };
  };

  const getReasonIcon = (type: MatchReason["type"]) => {
    const icons: Record<string, string> = {
      image: "◉",
      breed: "◉",
      location: "◉",
      time: "◉",
      type: "◉",
      description: "◉",
    };
    return icons[type] || "✓";
  };

  const renderReasonDetail = (reason: MatchReason) => {
    const message = getReasonMessage(language, reason.messageKey);

    return (
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-lg">{getReasonIcon(reason.type)}</span>
          <span className="font-medium">{message}</span>
          <span className="ml-auto px-2 py-1 bg-primary/20 text-primary rounded text-xs font-bold">
            +{reason.score}%
          </span>
        </div>
        {reason.details && (
          <p className="text-xs text-muted ml-6">{reason.details}</p>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-card-bg rounded-2xl border border-card-border p-8 text-center animate-pulse">
        <p className="text-muted">
          {language === "mn" ? "Хайж байна..." : "Searching..."}
        </p>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className=" rounded-2xl border-2 border-orange-500/30 p-8 text-center backdrop-blur-sm">
        <div className="text-4xl mb-4">🔍</div>
        <p className="text-lg font-semibold mb-4">{t.noMatches}</p>
        <button className="px-6 py-2 bg-primary text-white rounded-full font-bold hover:shadow-lg transition-all">
          {t.tryAgain}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold">{t.possibleMatches}</h2>
        <span className="inline-block bg-black text-white text-xs font-bold px-3 py-1 rounded-full">
          {matches.length}
        </span>
      </div>

      {matches.map((match, idx) => {
        const colorScheme = getConfidenceColor(match.confidenceScore);
        const isExpanded = selectedMatch === match.matchId;

        return (
          <div
            key={match.matchId}
            className="bg-card-bg border-2 border-card-border rounded-2xl overflow-hidden hover:border-orange-500/50 transition-all"
          >
            {/* Header Section */}
            <div className={`${colorScheme.bg} p-6 text-white`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-3xl">
                      {match.confidenceScore >= 80
                        ? "🎯"
                        : match.confidenceScore >= 60
                          ? "✨"
                          : "👀"}
                    </span>
                    <div>
                      <p className="text-3xl font-bold">
                        {match.confidenceScore}%
                      </p>
                    </div>
                  </div>
                  <p className="text-sm opacity-90">
                    {colorScheme.level} {t.confidence}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-md opacity-90 mb-1">
                    {`Match #${idx + 1}`}
                  </div>
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="p-6 space-y-6">
              {/* Match Scores Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-primary/10 rounded-lg p-4 text-center border border-primary/20">
                  <p className="text-2xl font-bold text-primary">
                    {match.imageMatch}%
                  </p>
                  <p className="text-xs text-muted mt-1">
                    {language === "mn" ? "Зураг" : "Image"}
                  </p>
                </div>
                <div className="bg-secondary/10 rounded-lg p-4 text-center border border-secondary/20">
                  <p className="text-2xl font-bold text-secondary">
                    {match.breedMatch}%
                  </p>
                  <p className="text-xs text-muted mt-1">
                    {language === "mn" ? "Үүлдэр" : "Breed"}
                  </p>
                </div>
                <div className="bg-orange-500/10 rounded-lg p-4 text-center border border-orange-500/20">
                  <p className="text-2xl font-bold text-orange-500">
                    {match.locationMatch}%
                  </p>
                  <p className="text-xs text-muted mt-1">
                    {language === "mn" ? "Байршил" : "Location"}
                  </p>
                </div>
                <div className="bg-rose-500/10 rounded-lg p-4 text-center border border-rose-500/20">
                  <p className="text-2xl font-bold text-rose-500">
                    {match.distance}km
                  </p>
                  <p className="text-xs text-muted mt-1">
                    {language === "mn" ? "Зай" : "Distance"}
                  </p>
                </div>
              </div>

              {/* Detailed Reasons Section */}
              <div className="border-t border-card-border pt-6">
                <div
                  onClick={() =>
                    setSelectedMatch(isExpanded ? null : match.matchId)
                  }
                  className="flex items-center justify-between cursor-pointer p-4 bg-muted/5 rounded-lg hover:bg-muted/10 transition-all mb-4"
                >
                  <div>
                    <h4 className="font-bold text-lg">{t.whyItMatches}</h4>
                    <p className="text-xs text-muted mt-1">
                      {match.reasons.length}{" "}
                      {language === "mn" ? "шалтгаан" : "reasons"}
                    </p>
                  </div>
                  <span
                    className={`text-2xl transition-transform ${isExpanded ? "rotate-180" : ""}`}
                  >
                    ▼
                  </span>
                </div>

                {isExpanded && (
                  <div className="space-y-3 p-4 bg-primary/5 rounded-lg border border-primary/10">
                    {match.reasons.map((reason, idx) => (
                      <div key={idx}>{renderReasonDetail(reason)}</div>
                    ))}
                  </div>
                )}
              </div>

              {/* Enhanced Reliability Info with 4 Summary Lines */}
              <div className="bg-linear-to-r from-green-500/10 to-emerald-500/10 rounded-lg p-4 border border-green-500/20">
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-2xl">✓</span>
                  <div className="flex-1">
                    <p className="font-bold text-sm">
                      {t.reliability}: {match.confidenceScore}%
                    </p>
                    <p className="text-xs text-muted mt-1">
                      {language === "mn"
                        ? `${match.timeDiff} өдрийн зөрүүтэй мэдээлэл`
                        : `Posted ${match.timeDiff} days ago`}
                    </p>
                  </div>
                </div>

                {/* Detailed Assessment Summary - 4 Lines */}
                <div className="space-y-2 pt-3 border-t border-green-500/20">
                  {/* Summary Line 1: Match Quality */}
                  <div className="text-xs text-muted flex items-center gap-2">
                    <span className="text-lg">
                      {match.confidenceScore >= 80
                        ? "◉"
                        : match.confidenceScore >= 60
                          ? "◉"
                          : "◉"}
                    </span>
                    <span>
                      {language === "mn"
                        ? match.confidenceScore >= 80
                          ? "Маш өндөр төстэй үр дүн"
                          : match.confidenceScore >= 60
                            ? "Өндөр төстэй үр дүн "
                            : "Биш байх магадлалтай"
                        : match.confidenceScore >= 80
                          ? "Excellent match quality"
                          : match.confidenceScore >= 60
                            ? "Good match likelihood"
                            : "Worth investigating"}
                    </span>
                  </div>

                  {/* Summary Line 2: Location Assessment */}
                  <div className="text-xs text-muted flex items-center gap-2">
                    <span className="text-lg">
                      {match.distance < 5
                        ? "◉"
                        : match.distance < 15
                          ? "◉"
                          : "◉"}
                    </span>
                    <span>
                      {language === "mn"
                        ? match.distance < 5
                          ? `${match.distance}км орчимд байршилтай`
                          : match.distance < 15
                            ? `${match.distance}км зайтай`
                            : `${match.distance}км хол`
                        : match.distance < 5
                          ? `Within ${match.distance}km radius`
                          : match.distance < 15
                            ? `${match.distance}km distance`
                            : `${match.distance}km apart`}
                    </span>
                  </div>

                  {/* Summary Line 3: Time Factor */}
                  <div className="text-xs text-muted flex items-center gap-2">
                    <span className="text-lg">
                      {match.timeDiff <= 3
                        ? "◉"
                        : match.timeDiff <= 7
                          ? "◉"
                          : "◉"}
                    </span>
                    <span>
                      {language === "mn"
                        ? match.timeDiff <= 3
                          ? "Сүүлийн хэдэн өдрийн хүрээнд"
                          : match.timeDiff <= 7
                            ? "Нэг долоо хоног доторх мэдээлэл"
                            : "Хэдэн долоо хоногийн өмнөх мэдээлэл"
                        : match.timeDiff <= 3
                          ? "Within past few days"
                          : match.timeDiff <= 7
                            ? "Within past week"
                            : "Older report"}
                    </span>
                  </div>

                  {/* Summary Line 4: Overall Verdict */}
                  <div className="text-xs text-muted flex items-center gap-2 pt-1 border-t border-green-500/10">
                    <span className="text-lg">◉</span>
                    <span>
                      {language === "mn"
                        ? match.confidenceScore >= 80 && match.distance < 10
                          ? "Гараа сунгах нь зүйтэй"
                          : match.confidenceScore >= 60
                            ? "Мөн байж болохуйц"
                            : "Илүү дэлгэрүүлэлт шаардагдаж байна"
                        : match.confidenceScore >= 80 && match.distance < 10
                          ? "Highly recommended to contact"
                          : match.confidenceScore >= 60
                            ? "Worth reaching out"
                            : "Request more information"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-card-border">
                <button
                  onClick={() => handleDismiss(match.matchId)}
                  className="flex-1 px-4 py-3 cursor-pointer bg-muted/20 hover:bg-muted/30 text-muted rounded-lg font-semibold transition-all"
                >
                  {t.dismissMatch}
                </button>
                <Link
                  href={`/pet/${match.matchId}`}
                  className="flex-1 px-4 py-3 bg-primary hover:shadow-lg hover:shadow-orange-500/30 text-white rounded-lg font-semibold transition-all text-center"
                >
                  {t.viewDetails} →
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
