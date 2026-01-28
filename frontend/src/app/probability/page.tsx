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

      if (!pet || !pet._id) {
        setQueryPet(null);
        setLoading(false);
        return;
      }

      setQueryPet(pet);

      // ✅ Fetch all pets for MatchSuggestions
      const allPetsRes = await fetch("http://localhost:8000/lostFound");
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-5xl animate-bounce mb-4">🤖</div>
          <p className="text-muted">{t.loading}</p>
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
          <h2 className="text-2xl font-bold mb-6">{t.yourReport}</h2>
          <div className="bg-card-bg rounded-xl border border-card-border p-6">
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Image */}
              <div className="w-full sm:w-48 h-48 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 shrink-0">
                <img
                  src={queryPet.image}
                  alt={queryPet.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold mb-2">{queryPet.name}</h3>
                  <span
                    className={`inline-block px-3 py-1 text-xs font-bold rounded ${
                      queryPet.role?.toLowerCase() === "lost" ||
                      queryPet.role === "Төөрсөн"
                        ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                        : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                    }`}
                  >
                    {queryPet.role?.toLowerCase() === "lost" ||
                    queryPet.role === "Төөрсөн"
                      ? t.lost
                      : t.found}
                  </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-muted text-sm mb-1">{t.breed}</p>
                    <p className="font-semibold">{queryPet.breed || "-"}</p>
                  </div>
                  <div>
                    <p className="text-muted text-sm mb-1">{t.type}</p>
                    <p className="font-semibold">
                      {translateValue("petType", queryPet.petType)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted text-sm mb-1">{t.gender}</p>
                    <p className="font-semibold">
                      {translateValue("gender", queryPet.gender) || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted text-sm mb-1">{t.location}</p>
                    <p className="font-semibold">{queryPet.location}</p>
                  </div>
                </div>

                {/* Description */}
                {queryPet.description && (
                  <div>
                    <p className="text-muted text-sm mb-2">{t.descriptionn}</p>
                    <p className="text-sm leading-relaxed">
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
            allPets={allPets}
          />
        </div>
      </div>
    </div>
  );
}
