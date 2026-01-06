"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

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

export default function AdminPetsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "dog" | "cat">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "lost" | "found">(
    "all"
  );
  const [editModal, SetEditModal] = useState(false);

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
    <div className="min-h-screen flex bg-background">
      <aside className="w-64 bg-card-bg border-r border-card-border hidden md:flex flex-col">
        <div className="p-6 font-extrabold text-2xl text-primary">🐾 Admin</div>
        <nav className="flex-1 px-4 space-y-2">
          <Link
            href="/admin"
            className="block px-4 py-3 rounded-xl hover:bg-card-border"
          >
            Dashboard
          </Link>
          <Link
            href="#"
            className="block px-4 py-3 rounded-xl bg-primary/10 text-primary font-semibold"
          >
            Зарлалууд
          </Link>
          <Link
            href="/users"
            className="block px-4 py-3 rounded-xl hover:bg-card-border"
          >
            Хэрэглэгчид
          </Link>
          <Link
            href="#"
            className="block px-4 py-3 rounded-xl hover:bg-card-border"
          >
            Тайлан
          </Link>
          <Link
            href="#"
            className="block px-4 py-3 rounded-xl hover:bg-card-border"
          >
            Тохиргоо
          </Link>
        </nav>
        <div className="p-4 text-sm text-muted">© 2026 Pet Finder</div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Зарлал удирдах</h1>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Хайх..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 rounded-xl border border-card-border bg-card-bg"
            />
            <Link
              href="/report"
              className="px-4 py-2 bg-primary text-white rounded-xl"
            >
              Шинэ зарлал нэмэх
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-4">
          {["all", "dog", "cat"].map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type as any)}
              className={`px-4 py-2 rounded-full border ${
                typeFilter === type
                  ? "bg-primary text-white border-primary"
                  : "bg-card-bg border-card-border"
              }`}
            >
              {type === "all"
                ? "Бүгд"
                : type === "dog"
                ? "🐕 Нохой"
                : "🐱 Муур"}
            </button>
          ))}
          {["all", "lost", "found"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status as any)}
              className={`px-4 py-2 rounded-full border ${
                statusFilter === status
                  ? "bg-primary text-white border-primary"
                  : "bg-card-bg border-card-border"
              }`}
            >
              {status === "all"
                ? "Бүгд"
                : status === "lost"
                ? "🔍 Төөрсөн"
                : "✓ Олдсон"}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-card-bg border border-card-border rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-card-border/40">
              <tr>
                <th className="px-4 py-3">Зураг</th>
                <th className="px-4 py-3">Нэр</th>
                <th className="px-4 py-3">Төрөл</th>
                <th className="px-4 py-3">Төлөв</th>
                <th className="px-4 py-3">Байршил</th>
                <th className="px-4 py-3">Огноо</th>
              </tr>
            </thead>
            <tbody>
              {filteredPets.map((pet) => (
                <tr key={pet.id} className="border-t border-card-border">
                  <td className="px-4 py-3">
                    <div className="w-12 h-12 relative rounded-lg overflow-hidden">
                      <Image
                        src={pet.image}
                        alt={pet.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold">{pet.name}</td>
                  <td className="px-4 py-3">
                    {pet.type === "dog" ? "Нохой" : "Муур"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-semibold ${
                        pet.status === "lost"
                          ? "bg-red-500/10 text-red-500"
                          : "bg-green-500/10 text-green-500"
                      }`}
                    >
                      {pet.status === "lost" ? "Төөрсөн" : "Олдсон"}
                    </span>
                  </td>
                  <td className="px-4 py-3">{pet.location}</td>
                  <td className="px-4 py-3">{pet.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
