"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/app/contexts/Languagecontext";

type Adopt = {
  _id: string;
  role: string;
  name: string;
  gender?: string;
  location?: string;
  description?: string;
  Date?: string;
  petType?: string;
  image?: string;
  breed?: string;
  phonenumber?: number;
};

export default function AdoptDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { language } = useLanguage();

  const [adopt, setAdopt] = useState<Adopt | null>(null);
  const [loading, setLoading] = useState(true);

  const t =
    language === "mn"
      ? {
          back: "← Буцах",
          loading: "Уншиж байна...",
          contact: "Холбогдох",
          phone: "Утас",
          location: "Байршил",
          breed: "Үүлдэр",
          gender: "Хүйс",
          date: "Огноо",
          description: "Тайлбар",
        }
      : {
          back: "← Back",
          loading: "Loading...",
          contact: "Contact",
          phone: "Phone",
          location: "Location",
          breed: "Breed",
          gender: "Gender",
          date: "Date",
          description: "Description",
        };

  useEffect(() => {
    if (!id) return;

    const fetchAdopt = async () => {
      try {
        const res = await fetch(`http://localhost:8000/adopt/findid/${id}`);
        const data = await res.json();
        setAdopt(Array.isArray(data) ? data[0] : data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdopt();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {t.loading}
      </div>
    );
  }

  if (!adopt) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Not found
      </div>
    );
  }
  console.log(adopt, "adopt");

  return (
    <div className="min-h-screen max-w-6xl mx-auto p-6">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="mb-6 text-primary font-semibold"
      >
        {t.back}
      </button>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Image */}
        <div className="w-full aspect-square bg-gray-100 rounded-2xl overflow-hidden">
          <img
            src={adopt.image || "/default-pet.jpg"}
            alt={adopt.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-black mb-2">{adopt.name}</h1>
            <p className="text-muted">{adopt.breed}</p>
          </div>

          <div className="flex flex-wrap gap-4 text-sm">
            {adopt.petType && (
              <span className="px-4 py-2 rounded-full bg-muted">
                🐾 {adopt.petType}
              </span>
            )}
            {adopt.gender && (
              <span className="px-4 py-2 rounded-full bg-muted">
                {t.gender}: {adopt.gender}
              </span>
            )}
            {adopt.Date && (
              <span className="px-4 py-2 rounded-full bg-muted">
                {t.date}: {new Date(adopt.Date).toLocaleDateString()}
              </span>
            )}
          </div>

          {adopt.description && (
            <div>
              <h3 className="font-bold mb-2">{t.description}</h3>
              <p className="text-muted leading-relaxed">{adopt.description}</p>
            </div>
          )}

          {/* Contact */}
          <div className="border rounded-2xl p-6 space-y-3">
            <h3 className="font-bold text-lg">{t.contact}</h3>

            {adopt.location && (
              <p>
                <span className="font-semibold">{t.location}:</span>{" "}
                {adopt.location}
              </p>
            )}

            {adopt.phonenumber && (
              <p>
                <span className="font-semibold">{t.phone}:</span>{" "}
                <a
                  href={`tel:${adopt.phonenumber}`}
                  className="text-primary underline"
                >
                  {adopt.phonenumber}
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
