"use client";

import Link from "next/link";
import { useLanguage } from "../contexts/Languagecontext";
import { LocccIcon } from "./icons";

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

export default function PetCard({
  role,
  name,

  location,

  image,
  breed,
  _id,
}: lostFound) {
  const { language } = useLanguage();

  const translations = {
    mn: {
      lost: "🔍 Төөрсөн",
      found: "✓ Олдсон",
      dog: "🐕 Нохой",
      cat: "🐱 Муур",
    },
    en: {
      lost: "🔍 Lost",
      found: "✓ Found",
      dog: "🐕 Dog",
      cat: "🐱 Cat",
    },
  };

  const t = translations[language];

  return (
    <Link
      href={`/pet/${_id}`}
      className="pet-card block bg-card-bg rounded-2xl overflow-hidden border border-card-border"
    >
      <div className="relative w-full aspect-square overflow-hidden bg-gray-100 rounded-t-xl">
        <img
          src={image || "/default-pet.jpg"}
          alt={name}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-black/10" />

        <div className="absolute top-4 left-3">
          <span
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold shadow-xl backdrop-blur-md ${
              role === "Lost" ? "status-lost" : "status-found"
            }`}
          >
            {role === "Lost" ? " " + t.lost : " " + t.found}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-lg">{name}</h3>
          <p className="text-muted text-sm mb-2">{breed}</p>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted">
          <LocccIcon />
          {location.slice(0, 30)}...
        </div>
      </div>
    </Link>
  );
}
