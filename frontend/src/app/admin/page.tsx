"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BlogPostIcon,
  LostIcon,
  ScheduleClipboardIcon,
  UnknownLocationPinIcon,
} from "../components/icons";

const stats = [
  {
    label: "Нийт зарлал",
    value: 248,
    color: "bg-primary",
    inner: <BlogPostIcon />,
  },
  {
    label: "Төөрсөн",
    value: 112,
    color: "bg-red-500",
    inner: <UnknownLocationPinIcon />,
  },
  {
    label: "Олдсон",
    value: 136,
    color: "bg-green-500",
    inner: <LostIcon />,
  },
  {
    label: "Шалган хүлээгдэж буй",
    value: 23,
    color: "bg-yellow-500",
    inner: <ScheduleClipboardIcon />,
  },
];

const posts = [
  {
    id: 1,
    name: "Макс",
    type: "Нохой",
    status: "Төөрсөн",
    location: "Төв цэцэрлэгт хүрээлэн",
    date: "2026.01.03",
  },
  {
    id: 2,
    name: "Луна",
    type: "Муур",
    status: "Олдсон",
    location: "Царс гудамж",
    date: "2026.01.04",
  },
  {
    id: 3,
    name: "Роки",
    type: "Нохой",
    status: "Төөрсөн",
    location: "Хотын төв",
    date: "2026.01.01",
  },
];

export default function AdminDashboard() {
  const [filter, setFilter] = useState("all");

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

        {/* Filters */}
        <div className="flex gap-3 mb-4">
          {["all", "lost", "found"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full border transition cursor-pointer ${
                filter === f
                  ? "bg-primary text-white border-primary"
                  : "bg-card-bg border-card-border"
              }`}
            >
              {f === "all" ? "Бүгд" : f === "lost" ? "Төөрсөн" : "Олдсон"}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-card-bg border border-card-border rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-card-border/40">
              <tr>
                <th className="px-4 py-3">Нэр</th>
                <th className="px-4 py-3">Төрөл</th>
                <th className="px-4 py-3">Төлөв</th>
                <th className="px-4 py-3">Байршил</th>
                <th className="px-4 py-3">Огноо</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="border-t border-card-border">
                  <td className="px-4 py-3 font-semibold">{p.name}</td>
                  <td className="px-4 py-3">{p.type}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        p.status === "Төөрсөн"
                          ? "bg-red-500/10 text-red-500"
                          : "bg-green-500/10 text-green-500"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">{p.location}</td>
                  <td className="px-4 py-3 text-muted">{p.date}</td>
                  <td className="px-4 py-3">
                    <button className="px-3 py-1 rounded-lg bg-primary text-white text-sm">
                      Шалгах
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
