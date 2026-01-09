"use client";
import Image from "next/image";
import Link from "next/link";
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
    "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop",
};

export default function ProbilityPage() {
  const isSameType = dog1.type === dog2.type;
  const isSameBreed = dog1.breed === dog2.breed;
  const similarityScore =
    ((isSameType ? 0.5 : 0) + (isSameBreed ? 0.5 : 0)) * 100;

  const dogs = [dog1, dog2];
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Төсөвтэй магадлал үзэх
          </h1>
        </div>
        <div className="bg-card-bg rounded-2xl border border-card-border p-6 flex">
          {dogs.map((dog) => (
            <div
              key={dog.id}
              className="relative w-64 h-64 bg-card-bg border border-card-border rounded-2xl overflow-hidden shadow-md"
            >
              {/* Image */}
              <Image
                src={dog.image}
                alt={dog.name}
                fill
                className="object-cover"
              />

             

              {/* Type */}
              <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/50 text-white text-sm font-medium backdrop-blur-sm">
                {dog.type === "dog" ? "🐕 Нохой" : "🐱 Муур"}
              </div>

              {/* Info Overlay */}
              <div className="absolute bottom-0 w-full bg-black/50 text-white backdrop-blur-sm p-3 flex flex-col gap-1">
                <h3 className="font-bold text-lg">{dog.name}</h3>
                <p className="text-sm">{dog.breed}</p>
                <p className="text-sm">{dog.location}</p>
                <span className="text-xs text-gray-300">{dog.date}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center w-full md:w-auto p-4">
          <div className="text-center bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg font-semibold">
            Similarity: {similarityScore}%
          </div>
        </div>
      </div>
    </div>
  );
}
