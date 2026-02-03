"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BlogPostIcon,
  LostIcon,
  ScheduleClipboardIcon,
  UnknownLocationPinIcon,
} from "../components/icons";

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

export default function AdminDashboard() {
  const [filter, setFilter] = useState("all");
  const [animalData, setAnimalData] = useState<lostFound[]>([]);
  const [loading, setLoading] = useState(true);

  const GetLostFound = async () => {
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
      console.log("User data:", data);
      setAnimalData(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetLostFound();
  }, []);

  const filteredPosts = animalData.filter((post) => {
    if (filter === "all") return true;
    if (filter === "lost")
      return post.role === "Төөрсөн" || post.role.toLowerCase() === "lost";
    if (filter === "found")
      return post.role === "Олдсон" || post.role.toLowerCase() === "found";
    return true;
  });

  const stats = [
    {
      label: "Нийт зарлал",
      value: animalData.length,
      color: "bg-primary",
      inner: <BlogPostIcon />,
    },
    {
      label: "Төөрсөн",
      value: animalData.filter(
        (p) => p.role === "Төөрсөн" || p.role.toLowerCase() === "lost",
      ).length,
      color: "bg-red-500",
      inner: <UnknownLocationPinIcon />,
    },
    {
      label: "Олдсон",
      value: animalData.filter(
        (p) => p.role === "Олдсон" || p.role.toLowerCase() === "found",
      ).length,
      color: "bg-green-500",
      inner: <LostIcon />,
    },
    {
      label: "Шалган хүлээгдэж буй",
      value: 0,
      color: "bg-yellow-500",
      inner: <ScheduleClipboardIcon />,
    },
  ];

  // Format date
  const formatDate = (date: Date | string) => {
    if (!date) return "Огноо байхгүй";
    const d = new Date(date);
    return d.toLocaleDateString("mn-MN");
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-card-bg border-r border-card-border hidden md:flex flex-col">
        <div className="p-6 font-extrabold text-2xl text-primary">🐾 Admin</div>
        <nav className="flex-1 px-4 space-y-2">
          <Link
            href="#"
            className="block px-4 py-3 rounded-xl bg-primary/10 text-primary font-semibold"
          >
            Dashboard
          </Link>
          <Link
            href="/adminBrowse"
            className="block px-4 py-3 rounded-xl hover:bg-card-border"
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

      {/* Main */}
      <main className="flex-1 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Админ Dashboard</h1>
            <p className="text-muted">Системийн ерөнхий хяналт</p>
          </div>
          <div className="flex items-center gap-3">
            <input
              placeholder="Хайх..."
              className="px-4 py-2 rounded-xl border border-card-border bg-card-bg"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-card-bg border border-card-border rounded-2xl p-5"
            >
              <div
                className={`w-10 h-10 ${s.color} rounded-xl mb-4 flex justify-center items-center`}
              >
                {s.inner}
              </div>
              <div className="text-3xl font-extrabold">{s.value}</div>
              <div className="text-muted text-sm">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mb-4">
          {["all", "lost", "found"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full border hover:border-primary duration-300 transition-all cursor-pointer ${
                filter === f
                  ? "bg-primary text-white border-primary"
                  : "bg-card-bg border-card-border"
              }`}
            >
              {f === "all" ? "Бүгд" : f === "lost" ? "Төөрсөн" : "Олдсон"}
            </button>
          ))}
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

              <div className="max-w-xs mx-auto">
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-linear-to-r from-primary to-secondary rounded-full animate-[loading-bar_1.5s_ease-in-out_infinite]"></div>
                </div>
              </div>
            </div>

            <div className="bg-card-bg border border-card-border rounded-2xl overflow-hidden">
              <div className="bg-card-border/40 px-4 py-3 border-b border-card-border">
                <div className="grid grid-cols-7 gap-4">
                  {[
                    "Зураг",
                    "Нэр",
                    "Төрөл",
                    "Төлөв",
                    "Байршил",
                    "Огноо",
                    "Action",
                  ].map((label, i) => (
                    <div
                      key={i}
                      className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"
                    ></div>
                  ))}
                </div>
              </div>

              <div className="divide-y divide-card-border">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="px-4 py-4 animate-pulse"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className="grid grid-cols-7 gap-4 items-center">
                      <div className="w-12 h-12 bg-linear-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg"></div>

                      <div className="h-4 bg-linear-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-3/4"></div>

                      <div className="h-4 bg-linear-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-2/3"></div>

                      <div className="h-7 bg-linear-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full w-20"></div>

                      <div className="h-4 bg-linear-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-full"></div>

                      <div className="h-4 bg-linear-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-1/2"></div>

                      <div className="flex gap-2">
                        <div className="h-8 bg-linear-to-r from-primary/30 to-primary/50 rounded-lg w-16"></div>
                        <div className="h-8 bg-linear-to-r from-red-400/30 to-red-500/50 rounded-lg w-16"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="bg-card-bg border border-card-border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-card-border/40">
                  <tr>
                    <th className="px-4 py-3">Зураг</th>
                    <th className="px-4 py-3">Нэр</th>
                    <th className="px-4 py-3">Төрөл</th>
                    <th className="px-4 py-3">Төлөв</th>
                    <th className="px-4 py-3">Байршил</th>
                    <th className="px-4 py-3">Огноо</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.map((p) => (
                    <tr
                      key={p._id}
                      className="border-t cursor-pointer border-card-border hover:bg-card-border/20"
                    >
                      <td className="px-4 py-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      </td>
                      <td className="px-4 py-3 font-semibold">{p.name}</td>
                      <td className="px-4 py-3">{p.petType}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            p.role === "Төөрсөн" ||
                            p.role.toLowerCase() === "lost"
                              ? "status-lost"
                              : "status-found"
                          }`}
                        >
                          {p.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted">
                        {p.location.slice(0, 80)}...
                      </td>
                      <td className="px-4 py-3 text-muted">
                        {formatDate(p.createdAt || p.Date)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Link
                            href={`/pet/${p._id}`}
                            className="px-3 py-1 rounded-lg bg-primary text-white text-sm hover:bg-primary-dark transition"
                          >
                            Үзэх
                          </Link>
                          <button className="px-3 py-1 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600 transition">
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
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-bold mb-2">Зарлал олдсонгүй</h3>
            <p className="text-muted">
              Сонгосон шүүлтүүрт тохирох зарлал байхгүй байна
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
