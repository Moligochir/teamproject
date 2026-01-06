"use client";

import { useState } from "react";

// Жишээ хэрэглэгчид
const allUsers = [
  {
    id: 1,
    name: "Sundui Bazar",
    email: "sundui@gmail.com",
    phone: "80360269",
    role: "Admin",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 2,
    name: "Angarag",
    email: "angarag@gmail.com",
    phone: "99112233",
    role: "Admin",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 3,
    name: "Mandah",
    email: "mandah@gmail.com",
    phone: "89914620",
    role: "User",
    status: "Inactive",
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: 4,
    name: "Ariukk",
    email: "ariukk@gmail.com",
    phone: "99110099",
    role: "User",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: 5,
    name: "Ociro",
    email: "ociro@gmail.com",
    phone: "99110099",
    role: "User",
    status: "Inactive",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 6,
    name: "Uugana",
    email: "uugna@gmail.com",
    phone: "99222982",
    role: "User",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=2",
  },
];

export default function AdminUsersPage() {
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "inactive"
  >("all");

  const filteredUsers = allUsers.filter((user) => {
    if (filterStatus === "all") return true;
    return user.status.toLowerCase() === filterStatus;
  });

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-card-bg border-r border-card-border hidden md:flex flex-col">
        <div className="p-6 font-extrabold text-2xl text-primary">🐾 Admin</div>
        <nav className="flex-1 px-4 space-y-2">
          <a
            href="/admin"
            className="block px-4 py-3 rounded-xl hover:bg-card-border"
          >
            Dashboard
          </a>
          <a
            href="/adminBrowse"
            className="block px-4 py-3 rounded-xl hover:bg-card-border"
          >
            Зарлалууд
          </a>
          <a
            href="/admin/users"
            className="block px-4 py-3 rounded-xl bg-primary/10 text-primary font-semibold"
          >
            Хэрэглэгчид
          </a>
          <a
            href="#"
            className="block px-4 py-3 rounded-xl hover:bg-card-border"
          >
            Тохиргоо
          </a>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Хэрэглэгчид удирдах</h1>

        {/* Status filter */}
        <div className="flex gap-3 mb-4">
          {["all", "active", "inactive"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status as any)}
              className={`px-4 py-2 rounded-full border ${
                filterStatus === status
                  ? "bg-primary text-white border-primary"
                  : "bg-card-bg border-card-border"
              }`}
            >
              {status === "all"
                ? "Бүгд"
                : status === "active"
                ? "Active"
                : "Inactive"}
            </button>
          ))}
        </div>

        {/* Users Table */}
        <div className="bg-card-bg border border-card-border rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-card-border/40">
              <tr>
                <th className="px-4 py-3">Avatar</th>
                <th className="px-4 py-3">Нэр</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-t border-card-border">
                  <td className="px-4 py-3">
                    <div className="w-10 h-10 relative rounded-full overflow-hidden">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.phone}</td>
                  <td className="px-4 py-3">{user.role}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-semibold ${
                        user.status === "Active"
                          ? "bg-green-500/10 text-green-500"
                          : "bg-red-500/10 text-red-500"
                      }`}
                    >
                      {user.status}
                    </span>
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
