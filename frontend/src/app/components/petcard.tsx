import Link from "next/link";
import Image from "next/image";

// export type Pet = {
//   id: number;
//   name: string;
//   type: "dog" | "cat";
//   breed: string;
//   status: "lost" | "found";
//   location: string;
//   date: string;
//   image: string;
// };

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
  gender,
  location,
  description,
  Date,
  petType,
  image,
  breed,
  _id,
  phonenumber,
}: lostFound) {
  return (
    <Link
      href={`/pet/${_id}`}
      className="pet-card block bg-card-bg rounded-2xl overflow-hidden border border-card-border"
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={image || "/default-pet.jpg"}
          alt={name}
          fill
          className="object-fit transition-transform duration-300 hover:scale-110"
        />
        <div
          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-sm font-semibold ${
            role === "Lost" ? "status-lost" : "status-found"
          }`}
        >
          {role === "Lost" ? "🔍 Төөрсөн" : "✓ Олдсон"}
        </div>
        <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/50 text-white text-sm font-medium backdrop-blur-sm">
          {petType === "Dog" ? "🐕 Нохой" : "🐱 Муур"}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-lg">{name}</h3>
          <span className="text-sm text-muted">hho</span>
        </div>
        <p className="text-muted text-sm mb-2">{breed}</p>
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
          {location}
        </div>
      </div>
    </Link>
  );
}
