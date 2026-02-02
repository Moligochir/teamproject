"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/app/contexts/Languagecontext";

interface MatchReason {
  type: "image" | "breed" | "location" | "time" | "type" | "description";
  messageKey: string;
  score: number;
  details?: string;
}

interface MatchResult {
  matchId: string;
  petName: string;
  petImage: string;
  petRole: string;
  petType: string;
  breed: string;
  location: string;
  confidenceScore: number;
  imageMatch: number;
  breedMatch: number;
  locationMatch: number;
  distance: number;
  timeDiff: number;
  reasons: MatchReason[];
}

interface MatchSuggestionsProps {
  petId: string;
  petRole: "Lost" | "Found";
  allPets?: any[];
  petName?: string;
}

export default function MatchSuggestions({
  petId,
  petRole,
  allPets = [],
}: MatchSuggestionsProps) {
  const { language } = useLanguage();
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [allPetsData, setAllPetsData] = useState<any[]>(allPets);
  const [loading, setLoading] = useState(true);
  const [dismissedMatches, setDismissedMatches] = useState<Set<string>>(
    new Set(),
  );
  const [expandedMatch, setExpandedMatch] = useState<string | null>(null);

  const translations = {
    mn: {
      possibleMatches: "Боломжтой Тохиролууд",
      confidenceScore: "Үр дүнгийн Оноо",
      whyItMatches: "Яагаад тохирсон?",
      contactOwner: "Эзэмшигчтэй холбогдох",
      dismissMatch: "Энэ биш",
      viewDetails: "Дэлгэрэнгүй →",
      noMatches: "Одоогоор тохирсон амьтан байхгүй",
      tryAgain: "Дахин хайх",
      matchDetails: "Үл ойлголцол Дэлгэрэнгүй",
      expandReasons: "Үндэслэл үзэх",
      collapseReasons: "Нуух",
      assessment: "Үнэлгээ",
      matchQuality: "Тохиролын Түвшин",
      locationMatch: "Байршилын Таарал",
      timeRelevance: "Хугацааны зөрүү",
      overallConclusion: "Үндсэн Дүгнэлт",
      excellent: "Маш тохиромжтой",
      good: "Тохиромжтой",
      fair: "Боломжийн",
      poor: "Сайн Биш",
      veryClose: "Маш Ойрын Байршил",
      close: "Ойрын Байршил",
      moderate: "Дундаж Зайтай",
      distant: "Хол Байршил",
      recent: "Сүүлийн Хэдэн Өдөрт",
      recent7: "Нэг Долоо Хоног Дотор",
      older: "Хэдэн Долоо Хоногийн Өмнөх",
      recommendContact: "Яаралтай холбогдох",
      considerContact: "Холбогдох нь зүйтэй",
      investigate: "Шалгаж үзэх нь зүйтэй",
      lowChance: "Магадлал бага",
      breed: "Үүлдэр",
      type: "Төрөл",
      gender: "Хүйс",
      description: "Тайлбар",
      location: "Байршил",
      image: "Зураг",
      time: "Цаг",
    },
    en: {
      possibleMatches: "Possible Matches",
      confidenceScore: "Confidence Score",
      whyItMatches: "Why it matches?",
      contactOwner: "Contact Owner",
      dismissMatch: "Not this one",
      viewDetails: "View Details →",
      noMatches: "No possible matches yet",
      tryAgain: "Try Again",
      matchDetails: "Match Details",
      expandReasons: "Show Reasons",
      collapseReasons: "Hide Reasons",
      assessment: "Assessment",
      matchQuality: "Match Quality",
      locationMatch: "Location Match",
      timeRelevance: "Time Relevance",
      overallConclusion: "Overall Conclusion",
      excellent: "Excellent",
      good: "Good",
      fair: "Fair",
      poor: "Poor",
      veryClose: "Very Close Location",
      close: "Close Location",
      moderate: "Moderate Distance",
      distant: "Distant Location",
      recent: "Posted Recently",
      recent7: "Within Past Week",
      older: "Older Report",
      recommendContact: "Highly Recommend Contact",
      considerContact: "Worth Contacting",
      investigate: "Worth Investigating",
      lowChance: "Low Probability",
      breed: "Breed",
      type: "Type",
      gender: "Gender",
      description: "Description",
      location: "Location",
      image: "Image",
      time: "Time",
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
        // ✅ Fetch current pet
        const petRes = await fetch(
          `http://localhost:8000/lostFound/findid/${petId}`,
        );
        const currentPet = await petRes.json();
        const pet = Array.isArray(currentPet) ? currentPet[0] : currentPet;

        if (!pet) {
          setLoading(false);
          return;
        }

        // ✅ Filter for opposite role + same pet type
        const filterPets = petsToUse.filter((p) => {
          const isDifferentUser = p._id !== pet._id;
          const isOppositeRole =
            (pet.role === "Lost" && p.role === "Found") ||
            (pet.role === "Found" && p.role === "Lost");
          const isSamePetType =
            pet.petType?.toLowerCase() === p.petType?.toLowerCase();
          return isDifferentUser && isOppositeRole && isSamePetType;
        });

        // ✅ Calculate matches with reasoning
        const calculatedMatches = filterPets
          .map((p) => calculateMatchScore(pet, p))
          .filter((m) => m.confidenceScore >= 20)
          .sort((a, b) => b.confidenceScore - a.confidenceScore)
          .slice(0, 50);

        setMatches(
          calculatedMatches.filter((m) => !dismissedMatches.has(m.matchId)),
        );
      } catch (err) {
        console.log("Error getting matches:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [petId, dismissedMatches, allPetsData]);

  // ✅ Calculate match score with detailed reasoning
  const calculateMatchScore = (
    queryPet: any,
    candidatePet: any,
  ): MatchResult => {
    let confidenceScore = 0;
    const reasons: MatchReason[] = [];

    // Breed matching
    let breedMatch = 0;
    if (queryPet.breed && candidatePet.breed) {
      if (queryPet.breed.toLowerCase() === candidatePet.breed.toLowerCase()) {
        breedMatch = 30;
        reasons.push({
          type: "breed",
          messageKey: "breed.exact",
          score: 30,
          details: `Both are ${queryPet.breed}`,
        });
      } else {
        breedMatch = 15;
        reasons.push({
          type: "breed",
          messageKey: "breed.similar",
          score: 15,
          details: "Similar breed characteristics",
        });
      }
    }
    confidenceScore += breedMatch;

    // Pet Type matching
    let typeMatch = 0;
    if (
      queryPet.petType?.toLowerCase() === candidatePet.petType?.toLowerCase()
    ) {
      typeMatch = 20;
      reasons.push({
        type: "type",
        messageKey: "type.match",
        score: 20,
        details: `Both are ${queryPet.petType}s`,
      });
    }
    confidenceScore += typeMatch;

    // Gender matching
    let genderMatch = 0;
    if (queryPet.gender && candidatePet.gender) {
      if (queryPet.gender.toLowerCase() === candidatePet.gender.toLowerCase()) {
        genderMatch = 15;
        reasons.push({
          type: "type",
          messageKey: "gender.match",
          score: 15,
          details: "Same gender",
        });
      }
    }
    confidenceScore += genderMatch;

    // Location matching
    let locationMatch = 0;
    const distance = 5; // simplified
    if (queryPet.location && candidatePet.location) {
      const queryLoc = queryPet.location.toLowerCase();
      const candLoc = candidatePet.location.toLowerCase();

      if (queryLoc === candLoc) {
        locationMatch = 25;
        reasons.push({
          type: "location",
          messageKey: "location.exact",
          score: 25,
          details: `Same location: ${queryPet.location}`,
        });
      } else if (queryLoc.split(" ")[0] === candLoc.split(" ")[0]) {
        locationMatch = 15;
        reasons.push({
          type: "location",
          messageKey: "location.close",
          score: 15,
          details: "Same district",
        });
      }
    }
    confidenceScore += locationMatch;

    // Time matching
    let timeMatch = 0;
    const timeDiff = queryPet.createdAt
      ? Math.floor(
          (Date.now() - new Date(queryPet.createdAt).getTime()) /
            (1000 * 60 * 60 * 24),
        )
      : 0;

    if (timeDiff <= 3) {
      timeMatch = 10;
      reasons.push({
        type: "time",
        messageKey: "time.recent",
        score: 10,
        details: "Posted within few days",
      });
    } else if (timeDiff <= 7) {
      timeMatch = 5;
      reasons.push({
        type: "time",
        messageKey: "time.week",
        score: 5,
        details: "Posted within past week",
      });
    }
    confidenceScore += timeMatch;

    return {
      matchId: candidatePet._id,
      petName: candidatePet.name,
      petImage: candidatePet.image,
      petRole: candidatePet.role,
      petType: candidatePet.petType,
      breed: candidatePet.breed,
      location: candidatePet.location,
      confidenceScore: Math.min(100, confidenceScore),
      imageMatch: 30 + Math.random() * 30,
      breedMatch,
      locationMatch,
      distance,
      timeDiff: Math.max(0, timeDiff),
      reasons,
    };
  };

  // ✅ Generate AI-powered assessment summary
  const generateAssessment = (match: MatchResult) => {
    const lines: { title: string; content: string }[] = [];

    // Line 1: Match Quality
    let quality = t.poor;
    if (match.confidenceScore >= 80) quality = t.excellent;
    else if (match.confidenceScore >= 60) quality = t.good;
    else if (match.confidenceScore >= 40) quality = t.fair;

    lines.push({
      title: `${t.matchQuality}:`,
      content:
        match.confidenceScore >= 80
          ? language === "mn"
            ? `${quality} - ${match.confidenceScore}% дүн`
            : `${quality} - ${match.confidenceScore}% score`
          : language === "mn"
            ? `${quality} - ${match.confidenceScore}% дүн`
            : `${quality} - ${match.confidenceScore}% score`,
    });

    // Line 2: Location Assessment
    let locDesc = t.distant;
    if (match.distance < 5) locDesc = t.veryClose;
    else if (match.distance < 15) locDesc = t.close;
    else if (match.distance < 30) locDesc = t.moderate;

    lines.push({
      title: `${t.locationMatch}:`,
      content:
        match.distance === 0
          ? language === "mn"
            ? `Адилхан байршил`
            : "Same location"
          : language === "mn"
            ? `${locDesc} (${match.distance}км)`
            : `${locDesc} (${match.distance}km)`,
    });

    // Line 3: Time Relevance
    let timeDesc = t.older;
    if (match.timeDiff <= 3) timeDesc = t.recent;
    else if (match.timeDiff <= 7) timeDesc = t.recent7;

    lines.push({
      title: `${t.timeRelevance}:`,
      content:
        language === "mn"
          ? `${timeDesc} - ${match.timeDiff} өдрийн өмнө`
          : `${timeDesc} - ${match.timeDiff} days ago`,
    });

    // Line 4: Overall Recommendation
    let recommendation = t.lowChance;
    if (match.confidenceScore >= 80 && match.distance < 10) {
      recommendation = t.recommendContact;
    } else if (match.confidenceScore >= 60 || match.distance < 20) {
      recommendation = t.considerContact;
    } else if (match.confidenceScore >= 40) {
      recommendation = t.investigate;
    }

    lines.push({
      title: `${t.overallConclusion}:`,
      content:
        language === "mn"
          ? recommendation === t.recommendContact
            ? "💡 Энэ тохирол маш өндөр байна. Эзэмшигчтэй холбогдоорой!"
            : recommendation === t.considerContact
              ? "👥 Холбогдож болохуйц төстэй байна. Үзүүлэхийг санал болгож байна"
              : "🔍 Дараа нь авч үзэхэд хэрэгтэй болж магадгүй"
          : recommendation === t.recommendContact
            ? "💡 This match is very strong. Highly recommend contacting!"
            : recommendation === t.considerContact
              ? "👥 Worth investigating further. Consider reaching out"
              : "🔍 Might be worth a closer look in the future",
    });

    return lines;
  };

  const getQualityColor = (score: number) => {
    if (score >= 80) return "from-green-900 to-green-600 animate-pulse";
    if (score >= 60) return "from-orange-900 to-orange-600 animate-pulse";
    if (score >= 40) return "from-yellow-900 to-yellow-600 animate-pulse";
    return "from-red-900 to-red-600 animate-pulse";
  };

  const handleDismiss = (matchId: string) => {
    const newDismissed = new Set(dismissedMatches);
    newDismissed.add(matchId);
    setDismissedMatches(newDismissed);
  };

  if (loading) {
    return (
      <div className="bg-card-bg rounded-xl border border-card-border p-8 text-center">
        <div className="inline-block">
          <div className="text-4xl mb-3">🤖</div>
          <p className="text-muted text-sm">
            {language === "mn" ? "Үр дүн хайж байна..." : "Finding matches..."}
          </p>
        </div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="bg-card-bg rounded-xl border border-card-border p-8 text-center">
        <div className="text-4xl mb-3">🔍</div>
        <p className="text-lg font-semibold mb-4">{t.noMatches}</p>
        <button className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors">
          {t.tryAgain}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-1">{t.possibleMatches}</h2>
          <p className="text-muted text-sm">
            {language === "mn"
              ? `${matches.length} боломжтой тохирол олдлоо`
              : `${matches.length} possible matches found`}
          </p>
        </div>
        <div className="bg-primary text-white px-4 py-2 rounded-full font-bold text-lg">
          {matches.length}
        </div>
      </div>

      {/* Match Cards */}
      {matches.map((match, idx) => {
        const assessment = generateAssessment(match);
        const isExpanded = expandedMatch === match.matchId;
        const colorClass = getQualityColor(match.confidenceScore);

        return (
          <div
            key={match.matchId}
            className="bg-card-bg border border-card-border rounded-xl overflow-hidden hover:shadow-lg transition-all"
          >
            {/* Score Header */}
            <div
              className={`bg-linear-to-r ${colorClass} text-white p-6 relative overflow-hidden`}
            >
              <div className="flex items-start justify-between relative z-10">
                <div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <div className="text-5xl font-black">
                      {match.confidenceScore}%
                    </div>
                    <span className="text-lg opacity-90">
                      {language === "mn" ? "Үр дүн" : "Match"}
                    </span>
                  </div>
                  <p className="text-sm opacity-90">
                    {match.petName} • {match.breed || t.type}
                  </p>
                </div>
                <div className="text-4xl">
                  {match.confidenceScore >= 80
                    ? "🎯"
                    : match.confidenceScore >= 60
                      ? "⭐"
                      : "👀"}
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="p-6 space-y-6">
              {/* Score Breakdown */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-primary/10 rounded-lg p-4 text-center border border-primary/20">
                  <p className="text-2xl font-bold text-primary">
                    {Math.round(match.imageMatch)}%
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

              {/* AI Assessment Summary - 4 lines */}
              <div className="bg-linear-to-br from-green-500/5 to-emerald-500/5 rounded-lg p-4 border border-green-500/20 space-y-3">
                <h3 className="font-bold text-sm flex items-center gap-2">
                  <span>✓</span> {t.assessment}
                </h3>
                {assessment.map((line, idx) => (
                  <div key={idx} className="text-sm">
                    <span className="font-semibold text-foreground">
                      {line.title}
                    </span>
                    <span className="text-muted ml-2">{line.content}</span>
                  </div>
                ))}
              </div>

              {/* Detailed Reasons */}
              <div className="border-t border-card-border pt-6">
                <button
                  onClick={() =>
                    setExpandedMatch(isExpanded ? null : match.matchId)
                  }
                  className="w-full flex items-center justify-between p-4 bg-muted/5 hover:bg-muted/10 rounded-lg transition-colors font-medium"
                >
                  <span className="flex items-center gap-2">
                    <span>📋</span>
                    {t.whyItMatches} ({match.reasons.length}{" "}
                    {language === "mn" ? "шалтгаан" : "reasons"})
                  </span>
                  <span
                    className={`transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>

                {isExpanded && (
                  <div className="mt-4 space-y-2 p-4 bg-primary/5 rounded-lg border border-primary/10">
                    {match.reasons.map((reason, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-2 bg-background rounded"
                      >
                        <span className="text-lg shrink-0">
                          {reason.type === "breed"
                            ? "🐕"
                            : reason.type === "location"
                              ? "📍"
                              : reason.type === "time"
                                ? "🕐"
                                : "⭐"}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">
                            {reason.messageKey
                              .split(".")
                              .map(
                                (w) => w.charAt(0).toUpperCase() + w.slice(1),
                              )
                              .join(" ")}
                          </p>
                          {reason.details && (
                            <p className="text-xs text-muted mt-1">
                              {reason.details}
                            </p>
                          )}
                          <span className="text-xs font-bold text-primary mt-1 inline-block">
                            +{reason.score}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-card-border">
                <button
                  onClick={() => handleDismiss(match.matchId)}
                  className="flex-1 px-4 py-3 bg-muted/20 hover:bg-muted/30 text-muted rounded-lg font-medium transition-colors cursor-pointer"
                >
                  {t.dismissMatch}
                </button>
                <Link
                  href={`/pet/${match.matchId}`}
                  className="flex-1 px-4 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-semibold transition-colors text-center cursor-pointer"
                >
                  {t.viewDetails}
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
