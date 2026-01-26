"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/app/contexts/Languagecontext";
import {
  getMatchesForPet,
  MatchResult,
  PetForMatching,
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
  const [loading, setLoading] = useState(true);
  const [dismissedMatches, setDismissedMatches] = useState<Set<string>>(
    new Set(),
  );

  const translations = {
    mn: {
      possibleMatches: "Боломжтой Тохирлууд",
      confidenceScore: "Тохирoлын оноо",
      whyItMatches: "Яагаад тохирсон?",
      contactOwner: "Эзэмшигчтэй холбогдох",
      dismissMatch: "Энэ биш",
      viewDetails: "Дэлгэрэнгүй үзэх",
      noMatches: "Одоогоор тохирсон амьтан байхгүй",
      tryAgain: "Дахин хайх",
      imageMatch: "Зураг",
      breedMatch: "Үүлдэр",
      locationMatch: "Байршил",
      colorMatch: "Өнгө",
    },
    en: {
      possibleMatches: " Possible Matches",
      confidenceScore: "Match Score",
      whyItMatches: "Why it matches?",
      contactOwner: "Contact Owner",
      dismissMatch: "Not this one",
      viewDetails: "View Details",
      noMatches: "No possible matches yet",
      tryAgain: "Try Again",
      imageMatch: "Image",
      breedMatch: "Breed",
      locationMatch: "Location",
      colorMatch: "Color",
    },
  };

  const t = translations[language];

  useEffect(() => {
    const fetchMatches = async () => {
      if (allPets.length === 0) {
        // Fetch all pets if not provided
        try {
          const res = await fetch(`http://localhost:8000/lostFound`);
          const pets = await res.json();
          setAllPets(pets);
          const foundMatches = await getMatchesForPet(petId, pets);
          setMatches(
            foundMatches.filter((m) => !dismissedMatches.has(m.matchId)),
          );
        } catch (err) {
          console.log("Error fetching matches:", err);
        }
      } else {
        const foundMatches = await getMatchesForPet(petId, allPets);
        setMatches(
          foundMatches.filter((m) => !dismissedMatches.has(m.matchId)),
        );
      }
      setLoading(false);
    };

    fetchMatches();
  }, [petId, dismissedMatches]);

  const setAllPets = () => {};

  const handleDismiss = (matchId: string) => {
    const newDismissed = new Set(dismissedMatches);
    newDismissed.add(matchId);
    setDismissedMatches(newDismissed);
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-primary";
    return "bg-red-500";
  };

  if (loading) {
    return (
      <div className="bg-card-bg rounded-2xl border border-card-border p-8 text-center">
        <p className="text-muted animate-pulse">
          {language === "mn" ? "Хайж байна..." : "Searching..."}
        </p>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="bg-gradient-to-br from-orange-500/10 to-rose-500/10 rounded-2xl border border-orange-500/30 p-8 text-center backdrop-blur-sm">
        <p className="text-lg font-semibold mb-4">{t.noMatches}</p>
        <button className="px-6 py-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-full font-bold hover:shadow-lg transition-all">
          {t.tryAgain}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        {t.possibleMatches}
        <span className="inline-block bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
          {matches.length}
        </span>
      </h2>

      {matches.map((match) => (
        <div
          key={match.matchId}
          className="bg-card-bg border-2 border-card-border rounded-2xl overflow-hidden hover:border-orange-500/50 transition-all"
        >
          {/* Header with Confidence Score */}
          <div
            className={`${getConfidenceColor(match.confidenceScore)} p-6 text-white`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-2xl font-bold">
                {t.confidenceScore} → {match.confidenceScore}%
              </h3>
              <span className="text-3xl">
                {match.confidenceScore >= 80
                  ? "🎯"
                  : match.confidenceScore >= 60
                    ? "✨"
                    : "👀"}
              </span>
            </div>
            <p className="opacity-90 text-sm">
              {language === "mn"
                ? "Энэ амьтан таны амьтантай маш төстэй байж болзошгүй байна!"
                : "This pet closely matches your pet!"}
            </p>
          </div>

          {/* Match Details */}
          <div className="p-6 space-y-6">
            {/* Why it Matches */}
            <div>
              <h4 className="font-bold text-lg mb-3">{t.whyItMatches}</h4>
              <div className="space-y-2">
                {match.reasons.map((reason, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="text-green-500 font-bold mt-1">✓</span>
                    <p className="text-muted">{reason}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Match Scores */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-primary/10 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-primary">
                  {match.imageMatch}%
                </p>
                <p className="text-xs text-muted mt-1">{t.imageMatch}</p>
              </div>
              <div className="bg-secondary/10 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-secondary">
                  {match.breedMatch}%
                </p>
                <p className="text-xs text-muted mt-1">{t.breedMatch}</p>
              </div>
              <div className="bg-orange-500/10 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-orange-500">
                  {match.locationMatch}%
                </p>
                <p className="text-xs text-muted mt-1">{t.locationMatch}</p>
              </div>
              <div className="bg-rose-500/10 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-rose-500">
                  {match.distance}km
                </p>
                <p className="text-xs text-muted mt-1">
                  {language === "mn" ? "Зай" : "Distance"}
                </p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-muted/10 rounded-lg p-4 text-sm">
              <p className="text-muted">
                {language === "mn"
                  ? `${match.timeDiff} өдөр өмнө мэдээлэгдсэн`
                  : `Posted ${match.timeDiff} days ago`}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-card-border">
              <button
                onClick={() => handleDismiss(match.matchId)}
                className="flex-1 px-4 py-3 bg-muted/20 hover:bg-muted/30 text-muted rounded-lg font-semibold transition-all"
              >
                {t.dismissMatch}
              </button>
              <Link
                href={`/pet/${match.matchId}`}
                className="flex-1 px-4 py-3 bg-primary hover:shadow-lg text-white rounded-lg font-semibold transition-all text-center"
              >
                {t.viewDetails} →
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
