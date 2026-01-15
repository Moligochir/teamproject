"use client";

import { useState } from "react";
import DogCard from "../components/card";

/* -------------------- */
/* DATA                  */
/* -------------------- */
const dogs = [
  {
    id: "dog1",
    name: "Buddy",
    type: "dog",
    breed: "Golden Retriever",
    date: "2026-01-05",
    location: "Ulaanbaatar",
    image:
      "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop",
  },
  {
    id: "dog2",
    name: "Max",
    type: "dog",
    breed: "Labrador Retriever",
    date: "2026-01-06",
    location: "Ulaanbaatar",
    image:
      "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=400&h=400&fit=crop",
  },
  {
    id: "dog3",
    name: "Luna",
    type: "dog",
    breed: "Poodle",
    date: "2026-01-07",
    location: "Darkhan",
    image:
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=400&fit=crop",
  },
];

export default function ProbilityPage() {
  const [secondIndex, setSecondIndex] = useState(1);

  const handleNext = () => {
    setSecondIndex((prev) => (prev + 1 >= dogs.length ? 1 : prev + 1));
  };

  const handlePrev = () => {
    setSecondIndex((prev) => (prev - 1 < 1 ? dogs.length - 1 : prev - 1));
  };

  const similarityScore =
    ((dogs[0].type === dogs[secondIndex].type ? 0.5 : 0) +
      (dogs[0].breed === dogs[secondIndex].breed ? 0.5 : 0)) *
    100;

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-card-bg rounded-2xl  p-6 flex justify-evenly items-center gap-10">
          <DogCard dog={dogs[0]} />

          <DogCard dog={dogs[secondIndex]} />

          <div className="flex flex-col gap-3">
            <button
              onClick={handlePrev}
              className="
      w-12 h-12
      flex items-center justify-center
      rounded-full
      bg-white/70
      backdrop-blur-md
      border border-white/40
      shadow-md
      hover:bg-white/90
      active:scale-95
      transition
      text-xl
    "
            >
              ↑
            </button>

            <button
              onClick={handleNext}
              className="
      w-12 h-12
      flex items-center justify-center
      rounded-full
      bg-white/70
      backdrop-blur-md
      border border-white/40
      shadow-md
      hover:bg-white/90
      active:scale-95
      transition
      text-xl
    "
            >
              ↓
            </button>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg font-semibold">
            Similarity: {similarityScore}%
          </div>
        </div>
      </div>
    </div>
  );
}
