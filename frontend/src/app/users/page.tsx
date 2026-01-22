"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type UserType = {
  _id: string;
  clerkId: string;
  email: string;
  name: string;
  role: string;
  phonenumber: number;
  createdAt?: string;
  imageUrl?: string;
};

export default function AdminUsersPage() {
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [allUsers, setAllUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch users from backend
  const GetAllUsers = async () => {
    try {
      const res = await fetch(`http://localhost:8000/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
      });
      const data = await res.json();
      console.log("Fetched users:", data);
      setAllUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetAllUsers();
  }, []);

  // Filter users (if you have status field in backend)
  const filteredUsers = allUsers.filter((user) => {
    if (filterStatus === "all") return true;
    // Add status logic if backend has this field
    return true;
  });

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
            href="/admin"
            className="block px-4 py-3 rounded-xl hover:bg-card-border transition"
          >
            Dashboard
          </Link>
          <Link
            href="/adminBrowse"
            className="block px-4 py-3 rounded-xl hover:bg-card-border transition"
          >
            Зарлалууд
          </Link>
          <Link
            href="#"
            className="block px-4 py-3 rounded-xl bg-primary/10 text-primary font-semibold"
          >
            Хэрэглэгчид
          </Link>
          <Link
            href="#"
            className="block px-4 py-3 rounded-xl hover:bg-card-border transition"
          >
            Тайлан
          </Link>
          <Link
            href="/settings"
            className="block px-4 py-3 rounded-xl hover:bg-card-border transition"
          >
            Тохиргоо
          </Link>
        </nav>
        <div className="p-4 text-sm text-muted">© 2026 Pet Finder</div>
      </aside>

      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Хэрэглэгчид удирдах</h1>
          <div className="text-muted">
            Нийт:{" "}
            <span className="font-bold text-primary">{allUsers.length}</span>{" "}
            хэрэглэгч
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          {["all", "active", "inactive"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status as any)}
              className={`px-4 py-2 rounded-full border transition cursor-pointer ${
                filterStatus === status
                  ? "bg-primary text-white border-primary"
                  : "bg-card-bg border-card-border hover:border-primary/50"
              }`}
            >
              {status === "all"
                ? "Бүгд"
                : status === "active"
                  ? "Идэвхтэй"
                  : "Идэвхгүй"}
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
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <div className="absolute inset-0">
                  <div className="w-full h-full border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 animate-pulse">
                Хэрэглэгчдийг уншиж байна...
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
            </div>

            {/* Table Skeleton */}
            <div className="bg-card-bg border border-card-border rounded-2xl overflow-hidden">
              <div className="bg-card-border/40 px-4 py-3 border-b border-card-border">
                <div className="grid grid-cols-6 gap-4">
                  {["Avatar", "Нэр", "Email", "Утас", "Role", "Огноо"].map(
                    (label, i) => (
                      <div
                        key={i}
                        className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"
                      ></div>
                    ),
                  )}
                </div>
              </div>

              <div className="divide-y divide-card-border">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="px-4 py-4 animate-pulse"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className="grid grid-cols-6 gap-4 items-center">
                      <div className="w-10 h-10 bg-linear-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full"></div>
                      <div className="h-4 bg-linear-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-3/4"></div>
                      <div className="h-4 bg-linear-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-full"></div>
                      <div className="h-4 bg-linear-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-2/3"></div>
                      <div className="h-6 bg-linear-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full w-16"></div>
                      <div className="h-4 bg-linear-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="bg-card-bg border border-card-border cursor-pointer rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-card-border/40">
                  <tr>
                    <th className="px-4 py-3">Avatar</th>
                    <th className="px-4 py-3">Нэр</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Утас</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Элссэн огноо</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="border-t border-card-border hover:bg-card-border/20 transition"
                    >
                      <td className="px-4 py-3">
                        <div className="w-10 h-10 relative rounded-full overflow-hidden bg-gray-200">
                          <img
                            src={
                              user.imageUrl ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`
                            }
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold">{user.name}</td>
                      <td className="px-4 py-3 text-muted">{user.email}</td>
                      <td className="px-4 py-3 text-muted">
                        {user.phonenumber || "-"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            user.role === "Admin"
                              ? "bg-purple-500/10 text-purple-500"
                              : "bg-blue-500/10 text-blue-500"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted">
                        {formatDate(user.createdAt || new Date())}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-card-bg border border-card-border rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-bold mb-2">Хэрэглэгч олдсонгүй</h3>
            <p className="text-muted">Одоогоор хэрэглэгч бүртгэгдээгүй байна</p>
          </div>
        )}
      </main>
    </div>
  );
}
