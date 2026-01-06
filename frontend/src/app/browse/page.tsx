"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

// Жишээ өгөгдөл
const allPets = [
  {
    id: 1,
    name: "Макс",
    type: "dog",
    breed: "Алтан ретривер",
    status: "lost",
    location: "Төв цэцэрлэгт хүрээлэн",
    date: "2026.01.03",
    image:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop",
    description: "Найрсаг алтан ретривер, цэнхэр хүзүүвчтэй",
  },
  {
    id: 2,
    name: "Луна",
    type: "cat",
    breed: "Сиам",
    status: "found",
    location: "Царс гудамж",
    date: "2026.01.04",
    image:
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop",
    description: "Үзэсгэлэнтэй сиам муур, тайван найрсаг",
  },
  {
    id: 3,
    name: "Бадди",
    type: "dog",
    breed: "Лабрадор",
    status: "lost",
    location: "Голын эрэг",
    date: "2026.01.02",
    image:
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop",
    description: "Хар лабрадор, цээжин дээр цагаан толботой",
  },
  {
    id: 4,
    name: "Мишка",
    type: "cat",
    breed: "Табби",
    status: "found",
    location: "Нарлаг гудамж",
    date: "2026.01.05",
    image:
      "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&h=400&fit=crop",
    description: "Улбар шар табби муур, маш тоглоомч",
  },
  {
    id: 5,
    name: "Роки",
    type: "dog",
    breed: "Герман хоньч",
    status: "lost",
    location: "Хотын төв",
    date: "2026.01.01",
    image:
      "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400&h=400&fit=crop",
    description: "Том герман хоньч, Роки гэж дуудахад хариулдаг",
  },
  {
    id: 6,
    name: "Мими",
    type: "cat",
    breed: "Перс",
    status: "found",
    location: "Нарсны гудамж",
    date: "2026.01.04",
    image:
      "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=400&h=400&fit=crop",
    description: "Цагаан перс муур, хөх нүдтэй",
  },
  {
    id: 7,
    name: "Чарли",
    type: "dog",
    breed: "Бигль",
    status: "lost",
    location: "Хойд дүүрэг",
    date: "2025.12.30",
    image:
      "https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=400&h=400&fit=crop",
    description: "Жижиг бигль, хүрэн цагаан толботой",
  },
  {
    id: 8,
    name: "Сүүдэр",
    type: "cat",
    breed: "Хар богино үст",
    status: "lost",
    location: "Баруун хэсэг",
    date: "2026.01.02",
    image:
      "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400&h=400&fit=crop",
    description: "Бүхэлдээ хар муур, ногоон нүдтэй",
  },
  {
    id: 9,
    name: "Цэцэг",
    type: "dog",
    breed: "Пүүдл",
    status: "found",
    location: "Төв талбай",
    date: "2026.01.05",
    image:
      "https://images.unsplash.com/photo-1516371535707-512a1e83bb9a?w=400&h=400&fit=crop",
    description: "Цагаан пүүдл, маш найрсаг",
  },
  {
    id: 10,
    name: "Занга",
    type: "cat",
    breed: "Мэйн кун",
    status: "lost",
    location: "Далайн эрэг",
    date: "2025.12.28",
    image:
      "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=400&h=400&fit=crop",
    description: "Том ноосон улбар шар мэйн кун",
  },
  {
    id: 11,
    name: "Купер",
    type: "dog",
    breed: "Хаски",
    status: "found",
    location: "Уулын зам",
    date: "2026.01.03",
    image:
      "https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=400&h=400&fit=crop",
    description: "Хөх нүдтэй хаски, маш эрч хүчтэй",
  },
  {
    id: 12,
    name: "Клео",
    type: "cat",
    breed: "Рэгдолл",
    status: "found",
    location: "Нарлаг цэцэрлэг",
    date: "2026.01.04",
    image:
      "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop",
    description: "Ноосон рэгдолл муур, хөх нүдтэй",
  },
];

function PetCard({ pet }: { pet: (typeof allPets)[0] }) {
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

export default function BrowsePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "dog" | "cat">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "lost" | "found">(
    "all"
  );

  const filteredPets = allPets.filter((pet) => {
    const matchesSearch =
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || pet.type === typeFilter;
    const matchesStatus = statusFilter === "all" || pet.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Бүх амьтдыг үзэх
          </h1>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Төөрсөн амьтдыг олох эсвэл олдсон амьтдыг эзэдтэй нь холбоход туслах
            зарлалуудыг хайна уу
          </p>
        </div>

        {/* Filters */}
        <div className="bg-card-bg rounded-2xl border border-card-border p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Хайх</label>
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Нэр, үүлдэр, эсвэл байршлаар хайх..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Pet Type */}
            <div>
              <label className="block text-sm font-medium mb-2">Амьтны төрөл</label>
              <select
                value={typeFilter}
                onChange={(e) =>
                  setTypeFilter(e.target.value as "all" | "dog" | "cat")
                }
                className="w-full px-4 py-3 bg-background border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none cursor-pointer"
              >
                <option value="all">Бүх төрөл</option>
                <option value="dog">🐕 Нохой</option>
                <option value="cat">🐱 Муур</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium mb-2">Төлөв</label>
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as "all" | "lost" | "found")
                }
                className="w-full px-4 py-3 bg-background border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none cursor-pointer"
              >
                <option value="all">Бүх төлөв</option>
                <option value="lost">🔍 Төөрсөн</option>
                <option value="found">✓ Олдсон</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quick Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => {
              setTypeFilter("all");
              setStatusFilter("all");
            }}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              typeFilter === "all" && statusFilter === "all"
                ? "bg-primary text-white"
                : "bg-card-bg border border-card-border hover:border-primary"
            }`}
          >
            Бүгд
          </button>
          <button
            onClick={() => {
              setTypeFilter("dog");
              setStatusFilter("all");
            }}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              typeFilter === "dog" && statusFilter === "all"
                ? "bg-primary text-white"
                : "bg-card-bg border border-card-border hover:border-primary"
            }`}
          >
            🐕 Нохой
          </button>
          <button
            onClick={() => {
              setTypeFilter("cat");
              setStatusFilter("all");
            }}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              typeFilter === "cat" && statusFilter === "all"
                ? "bg-primary text-white"
                : "bg-card-bg border border-card-border hover:border-primary"
            }`}
          >
            🐱 Муур
          </button>
          <button
            onClick={() => {
              setTypeFilter("all");
              setStatusFilter("lost");
            }}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              statusFilter === "lost" && typeFilter === "all"
                ? "bg-lost text-white"
                : "bg-card-bg border border-card-border hover:border-lost"
            }`}
          >
            🔍 Төөрсөн
          </button>
          <button
            onClick={() => {
              setTypeFilter("all");
              setStatusFilter("found");
            }}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              statusFilter === "found" && typeFilter === "all"
                ? "bg-found text-white"
                : "bg-card-bg border border-card-border hover:border-found"
            }`}
          >
            ✓ Олдсон
          </button>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted">
            Нийт{" "}
            <span className="font-semibold text-foreground">
              {filteredPets.length}
            </span>{" "}
            амьтан олдлоо
          </p>
        </div>

        {/* Pet Grid */}
        {filteredPets.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🐾</div>
            <h3 className="text-xl font-bold mb-2">Амьтан олдсонгүй</h3>
            <p className="text-muted mb-6">
              Хайлт эсвэл шүүлтүүрийг өөрчилж үзнэ үү
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setTypeFilter("all");
                setStatusFilter("all");
              }}
              className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-full font-semibold transition-all"
            >
              Шүүлтүүр арилгах
            </button>
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 text-center bg-card-bg rounded-2xl border border-card-border p-8">
          <h2 className="text-2xl font-bold mb-3">
            Хайж буй зүйлээ олсонгүй юу?
          </h2>
          <p className="text-muted mb-6">
            Төөрсөн эсвэл олдсон амьтны мэдээлэл оруулж, тэдгээрийг гэр бүлтэй нь
            холбоход туслаарай
          </p>
          <Link
            href="/report"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-full font-semibold transition-all"
          >
            Мэдээлэл оруулах
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
