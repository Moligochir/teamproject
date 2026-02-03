"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type lostFound = {
  role: string;
  name: string;
  gender: string;
  location: string;
  description: string;
  Date: Date;
  lat: number;
  lng: number;
  petType: string;
  image: string;
  breed: string;
  _id: string;
  phonenumber: number;
  createdAt?: string;
};

export default function AdminPetsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "dog" | "cat">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "lost" | "found">(
    "all",
  );
  const [allPets, setAllPets] = useState<lostFound[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState<lostFound | null>(null);

  // Fetch pets from backend
  const GetAllPets = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/lostFound`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
        },
      );
      const data = await res.json();
      console.log("Fetched pets:", data);
      setAllPets(data);
    } catch (err) {
      console.error("Error fetching pets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetAllPets();
  }, []);

  // Filter pets
  const filteredPets = allPets.filter((pet) => {
    const matchesSearch =
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.breed?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.petType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      typeFilter === "all" ||
      (typeFilter === "dog" &&
        (pet.petType === "Dog" || pet.petType === "Нохой")) ||
      (typeFilter === "cat" &&
        (pet.petType === "Cat" || pet.petType === "Муур"));

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "lost" &&
        (pet.role === "Төөрсөн" || pet.role.toLowerCase() === "lost")) ||
      (statusFilter === "found" &&
        (pet.role === "Олдсон" || pet.role.toLowerCase() === "found"));

    return matchesSearch && matchesType && matchesStatus;
  });

  // Delete pet
  const handleDeletePet = async (petId: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/lostFound/${petId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (res.ok) {
        setAllPets(allPets.filter((pet) => pet._id !== petId));
        setDeleteModal(false);
        setSelectedPet(null);
        alert("Зар амжилттай устгагдлаа!");
      }
    } catch (err) {
      console.error("Error deleting pet:", err);
      alert("Зар устгахад алдаа гарлаа");
    }
  };

  // Format date
  const formatDate = (date: Date | string) => {
    if (!date) return "Огноо байхгүй";
    const d = new Date(date);
    return d.toLocaleDateString("mn-MN");
  };

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
              className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition"
            >
              Шинэ зарлал нэмэх
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex gap-2">
            {["all", "dog", "cat"].map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type as any)}
                className={`px-4 py-2 rounded-full border transition cursor-pointer ${
                  typeFilter === type
                    ? "bg-primary text-white border-primary"
                    : "bg-card-bg border-card-border hover:border-primary/50"
                }`}
              >
                {type === "all"
                  ? "Бүгд"
                  : type === "dog"
                    ? "🐕 Нохой"
                    : "🐱 Муур"}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {["all", "lost", "found"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status as any)}
                className={`px-4 py-2 rounded-full border transition cursor-pointer ${
                  statusFilter === status
                    ? "bg-primary text-white border-primary"
                    : "bg-card-bg border-card-border hover:border-primary/50"
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
        </div>

        <div className="mb-4 text-muted">
          <span className="text-primary">{filteredPets.length}</span> зарлал
          олдлоо
        </div>

        {loading ? (
          <div className="space-y-6">
            <div className="bg-linear-to-r from-card-bg via-card-border/20 to-card-bg rounded-2xl p-8 text-center">
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 flex items-center justify-center animate-pulse">
                  <svg
                    className="w-20 h-20 text-primary"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-7 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm14 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM5.5 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm13 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                  </svg>
                </div>

                <div className="absolute inset-0">
                  <div className="w-full h-full border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 animate-pulse">
                Зарлалуудыг уншиж байна...
              </h3>

              <div className="flex justify-center gap-1.5 mb-6">
                <span
                  className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></span>
                <span
                  className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></span>
                <span
                  className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></span>
              </div>

              {/* Progress Bar */}
              <div className="max-w-xs mx-auto">
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-primary to-secondary rounded-full animate-[loading_1.5s_ease-in-out_infinite]"
                    style={{
                      animation: "loading 1.5s ease-in-out infinite",
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-card-bg border border-card-border rounded-2xl overflow-hidden">
              <div className="bg-card-border/40 px-4 py-3 border-b border-card-border">
                <div className="grid grid-cols-8 gap-4">
                  {[
                    "Зураг",
                    "Нэр",
                    "Төрөл",
                    "Үүлдэр",
                    "Төлөв",
                    "Байршил",
                    "Огноо",
                    "Үйлдэл",
                  ].map((label, i) => (
                    <div
                      key={i}
                      className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"
                    ></div>
                  ))}
                </div>
              </div>

              <div className="divide-y divide-card-border">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="px-4 py-4 animate-pulse"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className="grid grid-cols-8 gap-4 items-center">
                      <div className="w-12 h-12 bg-linear-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg"></div>

                      <div className="h-4 bg-linear-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-3/4"></div>

                      <div className="h-4 bg-linear-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-2/3"></div>

                      <div className="h-4 bg-linear-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-1/2"></div>

                      <div className="h-7 bg-linear-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full w-20"></div>

                      <div className="h-4 bg-linear-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-full"></div>

                      <div className="h-4 bg-linear-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-2/3"></div>

                      <div className="flex gap-2">
                        <div className="h-8 bg-linear-to-r from-blue-400/30 to-blue-500/50 rounded-lg w-14"></div>
                        <div className="h-8 bg-linear-to-r from-red-400/30 to-red-500/50 rounded-lg w-16"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : filteredPets.length > 0 ? (
          <div className="bg-card-bg border border-card-border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-card-border/40">
                  <tr>
                    <th className="px-4 py-3">Зураг</th>
                    <th className="px-4 py-3">Нэр</th>
                    <th className="px-4 py-3">Төрөл</th>
                    <th className="px-4 py-3">Үүлдэр</th>
                    <th className="px-4 py-3">Төлөв</th>
                    <th className="px-4 py-3">Байршил</th>
                    <th className="px-4 py-3">Огноо</th>
                    <th className="px-4 py-3">Үйлдэл</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPets.map((pet) => (
                    <tr
                      key={pet._id}
                      className="border-t border-card-border cursor-pointer hover:bg-card-border/20 transition"
                    >
                      <td className="px-4 py-3">
                        <div className="w-12 h-12 relative rounded-lg overflow-hidden">
                          <img
                            src={pet.image}
                            alt={pet.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold">
                        {pet.name || "Нэргүй Мэдээллэгдсэн"}
                      </td>
                      <td className="px-4 py-3">{pet.petType}</td>
                      <td className="px-4 py-3 text-muted">
                        {pet.breed || "-"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            pet.role === "Төөрсөн" ||
                            pet.role.toLowerCase() === "lost"
                              ? "status-lost"
                              : "status-found"
                          }`}
                        >
                          {pet.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted">
                        {pet.location.slice(0, 80)}...
                      </td>
                      <td className="px-4 py-3 text-muted">
                        {formatDate(pet.createdAt || pet.Date)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Link
                            href={`/pet/${pet._id}`}
                            className="px-3 py-1 rounded-lg bg-primary hover:bg-primary-dark text-white text-sm transition"
                          >
                            Үзэх
                          </Link>
                          <button
                            onClick={() => {
                              setSelectedPet(pet);
                              setDeleteModal(true);
                            }}
                            className="px-3 py-1 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600 transition cursor-pointer"
                          >
                            Устгах
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-card-bg border border-card-border rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold mb-2">Зарлал олдсонгүй</h3>
            <p className="text-muted">
              Сонгосон шүүлтүүрт тохирох зарлал байхгүй байна
            </p>
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {deleteModal && selectedPet && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-card-bg rounded-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-600 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">
                Та энэ зарыг устгахдаа итгэлтэй байна уу?
              </h3>
              <p className="text-muted text-sm">
                Энэ үйлдлийг буцаах боломжгүй
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <img
                  src={selectedPet.image}
                  alt={selectedPet.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="font-semibold">{selectedPet.name}</p>
                  <p className="text-sm text-muted">{selectedPet.petType}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setDeleteModal(false);
                  setSelectedPet(null);
                }}
                className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition cursor-pointer"
              >
                Цуцлах
              </button>
              <button
                onClick={() => handleDeletePet(selectedPet._id)}
                className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition cursor-pointer"
              >
                Тийм, устга
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
