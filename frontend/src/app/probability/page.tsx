"use client";

import { useState, useEffect } from "react";
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

export default function ProbabilityPage() {
  const [secondIndex, setSecondIndex] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSecondIndex((prev) => (prev + 1 >= dogs.length ? 1 : prev + 1));
    setTimeout(() => setIsAnimating(false), 400);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSecondIndex((prev) => (prev - 1 < 1 ? dogs.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 400);
  };

  const breedMatch = dogs[0].breed === dogs[secondIndex].breed;
  const locationMatch = dogs[0].location === dogs[secondIndex].location;

  const similarityScore =
    ((dogs[0].type === dogs[secondIndex].type ? 0.4 : 0) +
      (breedMatch ? 0.35 : 0) +
      (locationMatch ? 0.25 : 0)) *
    100;

  return (
    <div className="relative min-h-screen overflow-hidden ">
      {/* Decorative gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>

      <div className="relative z-10 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold bg-linear-to-r from-slate-900 via-blue-800 to-slate-900 bg-clip-text text-transparent mb-3">
              Pup Compatibility
            </h1>
            <p className="text-slate-600 text-lg font-light">
              Discover how similar these good boys and girls are
            </p>
          </div>

          {/* Main comparison container */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border border-white/60">
            <div className="flex flex-col lg:flex-row justify-center items-center gap-8 lg:gap-12">
              {/* First dog */}
              <div className="transform hover:scale-105 transition-transform duration-300">
                <div className="mb-4">
                  <span className="inline-block px-4 py-2 bg-linear-to-r from-blue-500 to-indigo-500 text-white text-sm font-semibold rounded-full">
                    Profile 1
                  </span>
                </div>
                <DogCard dog={dogs[0]} />
              </div>

              {/* VS divider */}
              <div className="hidden lg:flex flex-col items-center gap-4">
                <div className="text-3xl font-light text-slate-400">vs</div>
                <div className="h-24 w-1 bg-linear-to-b from-blue-400 to-indigo-400 rounded-full"></div>
              </div>

              {/* Second dog with animation */}
              <div
                className={`transform hover:scale-105 transition-all duration-300 ${
                  isAnimating ? "scale-95 opacity-50" : "scale-100 opacity-100"
                }`}
              >
                <div className="mb-4">
                  <span className="inline-block px-4 py-2 bg-linear-to-r from-indigo-500 to-purple-500 text-white text-sm font-semibold rounded-full">
                    Profile 2
                  </span>
                </div>
                <DogCard dog={dogs[secondIndex]} />
              </div>

              {/* Navigation controls */}
              <div className="flex lg:flex-col gap-3 mt-8 lg:mt-0">
                <button
                  onClick={handlePrev}
                  disabled={isAnimating}
                  className="group w-14 h-14 flex items-center justify-center rounded-full bg-linear-to-br from-slate-900 to-slate-700 hover:from-slate-800 hover:to-slate-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 text-white text-2xl font-light"
                  aria-label="Previous dog"
                >
                  <span className="group-hover:-translate-y-1 transition-transform">
                    ↑
                  </span>
                </button>

                <button
                  onClick={handleNext}
                  disabled={isAnimating}
                  className="group w-14 h-14 flex items-center justify-center rounded-full bg-linear-to-br from-slate-900 to-slate-700 hover:from-slate-800 hover:to-slate-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 text-white text-2xl font-light"
                  aria-label="Next dog"
                >
                  <span className="group-hover:translate-y-1 transition-transform">
                    ↓
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Similarity score section */}
          <div className="flex justify-center mt-12">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-indigo-500 rounded-2xl blur-lg opacity-30 animate-pulse"></div>

              {/* Score card */}
              <div className="relative bg-linear-to-r from-blue-500 to-indigo-500 px-8 py-6 rounded-2xl shadow-xl">
                <div className="flex flex-col items-center gap-2">
                  <p className="text-white/80 text-sm font-medium uppercase tracking-wider">
                    Compatibility Score
                  </p>
                  <div className="text-5xl font-bold text-white">
                    {Math.round(similarityScore)}
                    <span className="text-3xl ml-1">%</span>
                  </div>
                </div>

                {/* Score breakdown */}
                <div className="mt-6 pt-6 border-t border-white/20 grid grid-cols-3 gap-4 text-center">
                  <div className="text-white/90">
                    <p className="text-xs font-semibold uppercase tracking-widest mb-1">
                      Type
                    </p>
                    <p className="text-lg font-bold">40%</p>
                  </div>
                  <div className="text-white/90">
                    <p className="text-xs font-semibold uppercase tracking-widest mb-1">
                      Breed
                    </p>
                    <p
                      className={`text-lg font-bold ${breedMatch ? "text-green-300" : "text-red-300"}`}
                    >
                      {breedMatch ? "35%" : "0%"}
                    </p>
                  </div>
                  <div className="text-white/90">
                    <p className="text-xs font-semibold uppercase tracking-widest mb-1">
                      Location
                    </p>
                    <p
                      className={`text-lg font-bold ${locationMatch ? "text-green-300" : "text-red-300"}`}
                    >
                      {locationMatch ? "25%" : "0%"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation info */}
          <div className="text-center mt-10">
            <p className="text-slate-500 text-sm">
              Showing Profile 2 of {dogs.length - 1} • Use ↑↓ to browse
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.35;
          }
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}
