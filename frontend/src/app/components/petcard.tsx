import Link from "next/link";
import Image from "next/image";

export type Pet = {
  id: number;
  name: string;
  type: "dog" | "cat";
  breed: string;
  status: "lost" | "found";
  location: string;
  date: string;
  image: string;
};

interface PetCardProps {
  pet: Pet;
}

export default function PetCard({ pet }: PetCardProps) {
  return (
    <Link
      href={`/pet/${pet.id}`}
      className="pet-card block bg-card-bg rounded-2xl overflow-hidden border border-card-border"
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={pet.image}
          alt={pet.name}
          fill
          className="object-cover transition-transform duration-300 hover:scale-110"
        />
        <div
          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-sm font-semibold ${
            pet.status === "lost" ? "status-lost" : "status-found"
          }`}
        >
          {pet.status === "lost" ? "🔍 Төөрсөн" : "✓ Олдсон"}
        </div>
        <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/50 text-white text-sm font-medium backdrop-blur-sm">
          {pet.type === "dog" ? "🐕 Нохой" : "🐱 Муур"}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-lg">{pet.name}</h3>
          <span className="text-sm text-muted">{pet.date}</span>
        </div>
        <p className="text-muted text-sm mb-2">{pet.breed}</p>
        <div className="flex items-center gap-1 text-sm text-muted">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          {pet.location}
        </div>
      </div>
    </Link>
  );
}
