"use client";

import { useState } from "react";
import Image from "next/image";

const dog1 = {
  id: "dog1",
  name: "Buddy",
  type: "dog",
  breed: "Golden Retriever",
  date: "2026-01-05",
  location: "Ulaanbaatar",
  image:
    "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop",
};

const dog2 = {
  id: "dog2",
  name: "Max",
  type: "dog",
  breed: "Labrador Retriever",
  date: "2026-01-06",
  location: "Ulaanbaatar",
  image:
    "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=400&h=400&fit=crop",
};

const dog3 = {
  id: "dog3",
  name: "Luna",
  type: "dog",
  breed: "Poodle",
  date: "2026-01-07",
  location: "Darkhan",
  image:
    "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=400&fit=crop",
};

export default function ProbilityPage() {
  const dogs = [dog1, dog2, dog3];

  /* -------------------- */
  /* SECOND IMAGE CONTROL */
  /* -------------------- */
  const [secondIndex, setSecondIndex] = useState(1);

  const handleNext = () => {
    setSecondIndex((prev) => (prev + 1 >= dogs.length ? 1 : prev + 1));
  };

  const handlePrev = () => {
    setSecondIndex((prev) => (prev - 1 < 1 ? dogs.length - 1 : prev - 1));
  };

  /* -------------------- */
  /* SIMILARITY LOGIC     */
  /* -------------------- */
  const isSameType = dogs[0].type === dogs[secondIndex].type;
  const isSameBreed = dogs[0].breed === dogs[secondIndex].breed;

  const similarityScore =
    ((isSameType ? 0.5 : 0) + (isSameBreed ? 0.5 : 0)) * 100;

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* TITLE */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Төсөвтэй магадлал үзэх
          </h1>
        </div>

        {/* IMAGES */}
        <div className="bg-card-bg rounded-2xl border border-card-border p-6 flex justify-evenly gap-10 items-center">
          {/* FIRST IMAGE (FIXED) */}
          <DogCard dog={dogs[0]} />

          {/* CONTROLS + SECOND IMAGE */}
          <div className="flex flex-col items-center gap-4">
            <DogCard dog={dogs[secondIndex]} />
          </div>
          <div className="flex justify-evenly flex-col gap-10">
            <button
              onClick={handlePrev}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 font-semibold"
            >
              ⬆
            </button>

            <button
              onClick={handleNext}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 font-semibold"
            >
              ⬇
            </button>
          </div>
        </div>

        {/* SIMILARITY */}
        <div className="flex items-center justify-center p-4">
          <div className="text-center bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg font-semibold">
            Similarity: {similarityScore}%
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------- */
/* DOG CARD COMPONENT   */
/* -------------------- */
function DogCard({ dog }) {
  return (
    <div className="relative w-120 h-120 bg-card-bg border border-card-border rounded-2xl overflow-hidden shadow-md">
      <Image src={dog.image} alt={dog.name} fill className="object-cover" />

      <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/50 text-white text-sm font-medium backdrop-blur-sm">
        {dog.type === "dog" ? "🐕 Нохой" : "🐱 Муур"}
      </div>

      <div className="absolute bottom-0 w-full bg-black/50 text-white backdrop-blur-sm p-3 flex flex-col gap-1">
        <h3 className="font-bold text-lg">{dog.name}</h3>
        <p className="text-sm">{dog.breed}</p>
        <p className="text-sm">{dog.location}</p>
        <span className="text-xs text-gray-300">{dog.date}</span>
      </div>
    </div>
  );
}
