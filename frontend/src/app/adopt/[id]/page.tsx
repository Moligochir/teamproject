"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/app/contexts/Languagecontext";

type Adopt = {
  _id: string;
  role?: string;
  adoptType?: string;
  name: string;
  gender?: string;
  location?: string;
  description?: string;
  Date?: string;
  petType?: string;
  image?: string;
  breed?: string;
  phonenumber?: number;
  age?: number;
  userId?: string;
};

export default function AdoptDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { language } = useLanguage();

  const [adopt, setAdopt] = useState<Adopt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const t =
    language === "mn"
      ? {
          back: "← Буцах",
          loading: "Уншиж байна...",
          contact: "Холбогдох мэдээлэл",
          contactOwner: "Эзэмшигчтэй холбогдох",
          phone: "Утас",
          location: "Байршил",
          breed: "Үүлдэр",
          gender: "Хүйс",
          date: "Огноо",
          age: "Нас",
          description: "Тайлбар",
          share: "Хуваалцах",
          notFound: "Амьтан олдсонгүй",
          months: "сар",
          male: "Эрэгтэй",
          female: "Эмэгтэй",
          dog: "Нохой",
          cat: "Муур",
          callNow: "Одоо дуудах",
        }
      : {
          back: "← Back",
          loading: "Loading...",
          contact: "Contact Information",
          contactOwner: "Contact Owner",
          phone: "Phone",
          location: "Location",
          breed: "Breed",
          gender: "Gender",
          date: "Date",
          age: "Age",
          description: "Description",
          share: "Share",
          notFound: "Pet not found",
          months: "months",
          male: "Male",
          female: "Female",
          dog: "Dog",
          cat: "Cat",
          callNow: "Call Now",
        };

  useEffect(() => {
    if (!id) return;

    const fetchAdopt = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try multiple endpoints
        let data;
        let res = await fetch(`http://localhost:8000/adopt/${id}`);

        if (!res.ok) {
          // Fallback to adopts endpoint
          res = await fetch(`http://localhost:8000/adopt/${id}`);
        }

        if (!res.ok) {
          throw new Error("Failed to fetch adopt data");
        }

        data = await res.json();
        const adoptData = Array.isArray(data) ? data[0] : data;

        if (!adoptData) {
          setError(t.notFound);
        } else {
          setAdopt(adoptData);
        }
      } catch (err) {
        console.log("Fetch error:", err);
        setError(t.notFound);
      } finally {
        setLoading(false);
      }
    };

    fetchAdopt();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center space-y-4">
          <div className="text-5xl animate-bounce">🤖</div>
          <p className="text-muted">{t.loading}</p>
        </div>
      </div>
    );
  }

  if (error || !adopt) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center space-y-4">
          <div className="text-5xl">🔍</div>
          <p className="text-xl font-bold">{t.notFound}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
          >
            {t.back}
          </button>
        </div>
      </div>
    );
  }

  console.log("adopt data:", adopt);

  // Helper functions
  const getPetTypeDisplay = (type?: string) => {
    if (!type) return "🐾 Pet";
    if (type.toLowerCase() === "dog") return "🐕 Dog";
    if (type.toLowerCase() === "cat") return "🐱 Cat";
    return `🐾 ${type}`;
  };

  const getGenderDisplay = (gender?: string) => {
    if (!gender) return "Unknown";
    if (gender.toLowerCase() === "male")
      return language === "mn" ? "Эрэгтэй" : "Male";
    if (gender.toLowerCase() === "female")
      return language === "mn" ? "Эмэгтэй" : "Female";
    return gender;
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
        >
          ← {t.back}
        </button>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Section */}
          <div className="flex flex-col gap-4">
            <div className="w-full aspect-square bg-gray-200 dark:bg-gray-700 rounded-2xl overflow-hidden shadow-lg">
              <img
                src={adopt.image || "/default-pet.jpg"}
                alt={adopt.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Quick Share */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: adopt.name,
                      text: `Check out ${adopt.name} - ${adopt.breed}`,
                      url: window.location.href,
                    });
                  }
                }}
                className="flex-1 px-4 py-3 bg-primary/10 text-primary rounded-lg font-semibold hover:bg-primary/20 transition-colors"
              >
                🔗 {t.share}
              </button>
            </div>
          </div>

          {/* Info Section */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-4xl sm:text-5xl font-black mb-3">
                {adopt.name}
              </h1>
              <p className="text-muted text-lg">
                {adopt.breed || "Unknown Breed"}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-3">
              {adopt.petType && (
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                  {getPetTypeDisplay(adopt.petType)}
                </span>
              )}
              {adopt.gender && (
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary font-semibold text-sm">
                  {getGenderDisplay(adopt.gender)}
                </span>
              )}
              {adopt.age && (
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 font-semibold text-sm">
                  🎂 {adopt.age} {t.months}
                </span>
              )}
              {adopt.Date && (
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/20 text-muted font-semibold text-sm">
                  📅{" "}
                  {new Date(adopt.Date).toLocaleDateString(
                    language === "mn" ? "mn-MN" : "en-US",
                  )}
                </span>
              )}
            </div>

            {/* Description */}
            {adopt.description && (
              <div className="space-y-3">
                <h3 className="font-bold text-lg">{t.description}</h3>
                <p className="text-muted leading-relaxed text-base">
                  {adopt.description}
                </p>
              </div>
            )}

            {/* Contact Section */}
            <div className="bg-card-bg rounded-2xl border border-card-border p-6 space-y-4">
              <h3 className="font-bold text-lg">{t.contact}</h3>

              {adopt.location && (
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📍</span>
                  <div>
                    <p className="font-semibold text-sm text-muted">
                      {t.location}
                    </p>
                    <p className="text-base font-medium">{adopt.location}</p>
                  </div>
                </div>
              )}

              {adopt.phonenumber && (
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📞</span>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-muted">
                      {t.phone}
                    </p>
                    <a
                      href={`tel:${adopt.phonenumber}`}
                      className="text-base font-medium text-primary hover:underline inline-flex items-center gap-2"
                    >
                      {adopt.phonenumber}
                    </a>
                  </div>
                </div>
              )}

              {/* Call Button */}
              {adopt.phonenumber && (
                <a
                  href={`tel:${adopt.phonenumber}`}
                  className="w-full mt-4 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-bold transition-colors text-center inline-block"
                >
                  ☎️ {t.callNow}
                </a>
              )}
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              {adopt.breed && (
                <div className="bg-muted/10 rounded-lg p-4">
                  <p className="text-muted text-xs font-semibold mb-1">
                    {t.breed}
                  </p>
                  <p className="font-medium">{adopt.breed}</p>
                </div>
              )}
              {adopt.age && (
                <div className="bg-muted/10 rounded-lg p-4">
                  <p className="text-muted text-xs font-semibold mb-1">
                    {t.age}
                  </p>
                  <p className="font-medium">
                    {adopt.age} {t.months}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
