"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BlogPostIcon,
  LostIcon,
  ScheduleClipboardIcon,
  UnknownLocationPinIcon,
} from "../components/icons";
import toast from "react-hot-toast";
import { useLanguage } from "@/app/contexts/Languagecontext";

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

type User = {
  _id: string;
  clerkId: string;
  email: string;
  name: string;
  phonenumber: number;
  createdAt: string;
};

export default function AdminDashboard() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "browse" | "users" | "settings"
  >("dashboard");
  const [filter, setFilter] = useState("all");
  const [animalData, setAnimalData] = useState<lostFound[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const translations = {
    mn: {
      adminDashboard: "Админ Dashboard",
      systemOverview: "Системийн ерөнхий хяналт",
      dashboard: "Dashboard",
      listings: "Зарлалууд",
      users: "Хэрэглэгчид",
      settings: "Тохиргоо",
      totalListings: "Нийт зарлал",
      lostPets: "Төөрсөн",
      foundPets: "Олдсон",
      totalUsers: "Хэрэглэгчид",
      recentActivity: "Сүүлийн үйлдлүүд",
      search: "Хайх...",
      image: "Зураг",
      name: "Нэр",
      type: "Төрөл",
      status: "Төлөв",
      location: "Байршил",
      date: "Огноо",
      action: "Action",
      view: "Үзэх",
      delete: "Устгах",
      all: "Бүгд",
      lost: "🔍 Төөрсөн",
      found: "✓ Олдсон",
      loading: "Уншиж байна...",
      noListings: "Зарлал олдсонгүй",
      email: "Имэйл",
      phone: "Утас",
      joinedDate: "Элссэн огноо",
      noUsers: "Хэрэглэгч олдсонгүй",
      systemInfo: "📊 Системийн мэдээлэл",
      maintenance: "🔧 Засвал хүргээ",
      refreshData: "🔄 Өгөгдлийг сэргээх",
      backup: "💾 Backup хийх",
      about: "ℹ️ Системийн мэдээлэл",
      systemName: "Системийн нэр",
      version: "Хувилбар",
      created: "Үүсгэсэн",
      copyright: "Copyright",
      listingDeleted: "Зарлал амжилттай устгагдлаа",
      deleteError: "Устгахад алдаа гарлаа",
      userDeleted: "Хэрэглэгч амжилттай устгагдлаа",
      dataRefreshed: "Өгөгдлийг сэргээсэн",
      backupSuccess: "Backup хийлээ",
      noDate: "Огноо байхгүй",
      pawfinder: "PawFinder",
    },
    en: {
      adminDashboard: "Admin Dashboard",
      systemOverview: "System Overview",
      dashboard: "Dashboard",
      listings: "Listings",
      users: "Users",
      settings: "Settings",
      totalListings: "Total Listings",
      lostPets: "Lost Pets",
      foundPets: "Found Pets",
      totalUsers: "Total Users",
      recentActivity: "Recent Activity",
      search: "Search...",
      image: "Image",
      name: "Name",
      type: "Type",
      status: "Status",
      location: "Location",
      date: "Date",
      action: "Action",
      view: "View",
      delete: "Delete",
      all: "All",
      lost: "🔍 Lost",
      found: "✓ Found",
      loading: "Loading...",
      noListings: "No listings found",
      email: "Email",
      phone: "Phone",
      joinedDate: "Joined Date",
      noUsers: "No users found",
      systemInfo: "📊 System Information",
      maintenance: "🔧 Maintenance",
      refreshData: "🔄 Refresh Data",
      backup: "💾 Backup",
      about: "ℹ️ System Information",
      systemName: "System Name",
      version: "Version",
      created: "Created",
      copyright: "Copyright",
      listingDeleted: "Listing deleted successfully",
      deleteError: "Error deleting",
      userDeleted: "User deleted successfully",
      dataRefreshed: "Data refreshed",
      backupSuccess: "Backup completed",
      noDate: "No date",
      pawfinder: "PawFinder",
    },
  };

  const t = translations[language as "mn" | "en"];

  const GetLostFound = async () => {
    try {
      const res = await fetch(`http://localhost:8000/lostFound`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
      });
      const data = await res.json();
      setAnimalData(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const GetUsers = async () => {
    try {
      const res = await fetch(`http://localhost:8000/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
      });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    GetLostFound();
    GetUsers();
  }, []);

  const filteredPosts = animalData
    .filter((post) => {
      if (filter === "all") return true;
      if (filter === "lost")
        return post.role === "Төөрсөн" || post.role.toLowerCase() === "lost";
      if (filter === "found")
        return post.role === "Олдсон" || post.role.toLowerCase() === "found";
      return true;
    })
    .filter((post) =>
      post.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const stats = [
    {
      label: t.totalListings,
      value: animalData.length,
      color: "bg-primary",
      inner: <BlogPostIcon />,
    },
    {
      label: t.lostPets,
      value: animalData.filter(
        (p) => p.role === "Төөрсөн" || p.role.toLowerCase() === "lost",
      ).length,
      color: "bg-red-500",
      inner: <UnknownLocationPinIcon />,
    },
    {
      label: t.foundPets,
      value: animalData.filter(
        (p) => p.role === "Олдсон" || p.role.toLowerCase() === "found",
      ).length,
      color: "bg-green-500",
      inner: <LostIcon />,
    },
    {
      label: t.totalUsers,
      value: users.length,
      color: "bg-blue-500",
      inner: <ScheduleClipboardIcon />,
    },
  ];

  const formatDate = (date: Date | string) => {
    if (!date) return t.noDate;
    const d = new Date(date);
    return d.toLocaleDateString(language === "mn" ? "mn-MN" : "en-US");
  };

  const handleDeletePost = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:8000/lostFound/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setAnimalData(animalData.filter((p) => p._id !== id));
        toast.success(t.listingDeleted);
      }
    } catch (err) {
      console.log(err);
      toast.error(t.deleteError);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:8000/users/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setUsers(users.filter((u) => u._id !== id));
        toast.success(t.userDeleted);
      }
    } catch (err) {
      console.log(err);
      toast.error(t.deleteError);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-card-bg border-r border-card-border hidden lg:flex flex-col sticky top-20 h-[calc(100vh-80px)]">
        <div className="p-6 font-extrabold text-2xl text-primary">🐾 Admin</div>
        <nav className="flex-1 px-4 space-y-2">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full  cursor-pointer text-left px-4 py-3 rounded-xl font-semibold transition-all ${
              activeTab === "dashboard"
                ? "bg-primary/10 text-primary"
                : "hover:bg-card-border"
            }`}
          >
            {t.dashboard}
          </button>
          <button
            onClick={() => setActiveTab("browse")}
            className={`w-full cursor-pointer text-left px-4 py-3 rounded-xl font-semibold transition-all ${
              activeTab === "browse"
                ? "bg-primary/10 text-primary"
                : "hover:bg-card-border"
            }`}
          >
            {t.listings}
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`w-full cursor-pointer text-left px-4 py-3 rounded-xl font-semibold transition-all ${
              activeTab === "users"
                ? "bg-primary/10 text-primary"
                : "hover:bg-card-border"
            }`}
          >
            {t.users}
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full cursor-pointer text-left px-4 py-3 rounded-xl font-semibold transition-all ${
              activeTab === "settings"
                ? "bg-primary/10 text-primary"
                : "hover:bg-card-border"
            }`}
          >
            {t.settings}
          </button>
        </nav>
        <div className="p-4 text-sm text-muted">© 2026 {t.pawfinder}</div>
      </aside>

      {/* Mobile Tabs */}
      <div className="lg:hidden fixed top-16 left-0 right-0 bg-card-bg border-b border-card-border z-40">
        <div className="flex gap-2 px-4 py-2 overflow-x-auto">
          {["dashboard", "browse", "users", "settings"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-3 py-2 rounded-lg font-semibold whitespace-nowrap transition-all text-sm ${
                activeTab === tab
                  ? "bg-primary text-white"
                  : "bg-card-border text-muted hover:text-foreground"
              }`}
            >
              {tab === "dashboard" && "📊"}
              {tab === "browse" && "📋"}
              {tab === "users" && "👥"}
              {tab === "settings" && "⚙️"}
            </button>
          ))}
        </div>
      </div>

      {/* Main */}
      <main className="flex-1 p-6 lg:pt-6 pt-24">
        {/* Search */}
        <div className="mb-6">
          <input
            placeholder={t.search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 rounded-xl border border-card-border bg-card-bg w-full md:w-64"
          />
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">{t.adminDashboard}</h1>
              <p className="text-muted">{t.systemOverview}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="bg-card-bg border border-card-border rounded-2xl p-5 hover:border-primary transition-all cursor-pointer"
                >
                  <div
                    className={`w-10 h-10 ${s.color} rounded-xl mb-4 flex justify-center items-center text-white`}
                  >
                    {s.inner}
                  </div>
                  <div className="text-3xl font-extrabold">{s.value}</div>
                  <div className="text-muted text-sm">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-card-bg border border-card-border rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">{t.recentActivity}</h2>
              <div className="space-y-3">
                {animalData.slice(0, 5).map((p) => (
                  <div
                    key={p._id}
                    className="flex items-center justify-between p-3 border border-card-border rounded-lg hover:bg-card-border/50 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3 cursor-pointer">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-semibold cursor-pointer">{p.name}</p>
                        <p className="text-sm text-muted cursor-pointer">
                          {formatDate(p.createdAt || p.Date)}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold cursor-pointer ${
                        p.role === "Төөрсөн" || p.role.toLowerCase() === "lost"
                          ? "status-lost"
                          : "status-found"
                      }`}
                    >
                      {p.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Browse Tab */}
        {activeTab === "browse" && (
          <div>
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-4">{t.listings}</h1>
              <div className="flex gap-3">
                {["all", "lost", "found"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-full border transition-all cursor-pointer ${
                      filter === f
                        ? "bg-primary text-white border-primary"
                        : "bg-card-bg border-card-border hover:border-primary"
                    }`}
                  >
                    {f === "all" ? t.all : f === "lost" ? t.lost : t.found}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted">{t.loading}</p>
              </div>
            ) : filteredPosts.length > 0 ? (
              <div className="bg-card-bg border border-card-border rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-card-border/40">
                      <tr>
                        <th className="px-4 py-3">{t.image}</th>
                        <th className="px-4 py-3">{t.name}</th>
                        <th className="px-4 py-3">{t.type}</th>
                        <th className="px-4 py-3">{t.status}</th>
                        <th className="px-4 py-3">{t.location}</th>
                        <th className="px-4 py-3">{t.date}</th>
                        <th className="px-4 py-3">{t.action}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPosts.map((p) => (
                        <tr
                          key={p._id}
                          className="border-t border-card-border hover:bg-card-border/20 transition-all"
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
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                p.role === "Төөрсөн" ||
                                p.role.toLowerCase() === "lost"
                                  ? "status-lost"
                                  : "status-found"
                              }`}
                            >
                              {p.role}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-muted text-xs max-w-xs truncate">
                            {p.location}
                          </td>
                          <td className="px-4 py-3 text-muted text-xs">
                            {formatDate(p.createdAt || p.Date)}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <Link
                                href={`/pet/${p._id}`}
                                className="px-3 py-1 rounded-lg bg-primary text-white text-xs hover:bg-primary-dark transition cursor-pointer"
                              >
                                {t.view}
                              </Link>
                              <button
                                onClick={() => handleDeletePost(p._id)}
                                className="px-3 py-1 rounded-lg bg-red-500 text-white text-xs hover:bg-red-600 transition cursor-pointer"
                              >
                                {t.delete}
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
              <div className="text-center py-12 bg-card-bg border border-card-border rounded-2xl">
                <p className="text-muted">{t.noListings}</p>
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div>
            <div className="mb-6">
              <h1 className="text-3xl font-bold">{t.users}</h1>
              <p className="text-muted">
                {t.totalUsers}: {users.length}
              </p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted">{t.loading}</p>
              </div>
            ) : filteredUsers.length > 0 ? (
              <div className="bg-card-bg border border-card-border rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-card-border/40">
                      <tr>
                        <th className="px-4 py-3">Avatar</th>
                        <th className="px-4 py-3">{t.name}</th>
                        <th className="px-4 py-3">{t.email}</th>
                        <th className="px-4 py-3">{t.phone}</th>
                        <th className="px-4 py-3">{t.joinedDate}</th>
                        <th className="px-4 py-3">{t.action}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr
                          key={user._id}
                          className="border-t border-card-border hover:bg-card-border/20 transition-all cursor-pointer"
                        >
                          <td className="px-4 py-3 cursor-pointer">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-linear-to-br from-primary to-orange-500/20 flex items-center justify-center text-white font-bold text-sm">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          </td>
                          <td className="px-4 py-3 font-semibold cursor-pointer">
                            {user.name}
                          </td>
                          <td className="px-4 py-3 cursor-pointer">
                            <a
                              href={`mailto:${user.email}`}
                              className="text-primary hover:underline cursor-pointer"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {user.email}
                            </a>
                          </td>
                          <td className="px-4 py-3 text-muted cursor-pointer">
                            {user.phonenumber ? (
                              <a
                                href={`tel:${user.phonenumber}`}
                                className="text-primary hover:underline cursor-pointer"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {user.phonenumber}
                              </a>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="px-4 py-3 text-muted text-xs cursor-pointer">
                            {formatDate(user.createdAt)}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className="px-3 py-1 rounded-lg bg-red-500 text-white text-xs hover:bg-red-600 transition cursor-pointer"
                            >
                              {t.delete}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-card-bg border border-card-border rounded-2xl cursor-pointer">
                <div className="text-6xl mb-4">👥</div>
                <p className="text-muted">{t.noUsers}</p>
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div>
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">{t.settings}</h1>
              <p className="text-muted">{t.systemInfo}</p>
            </div>

            <div className="space-y-6">
              {/* System Info */}
              <div className="bg-card-bg border border-card-border rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4">{t.systemInfo}</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-background rounded-lg">
                    <p className="text-sm text-muted mb-1">{t.totalListings}</p>
                    <p className="text-2xl font-bold">{animalData.length}</p>
                  </div>
                  <div className="p-4 bg-background rounded-lg">
                    <p className="text-sm text-muted mb-1">{t.totalUsers}</p>
                    <p className="text-2xl font-bold">{users.length}</p>
                  </div>
                  <div className="p-4 bg-background rounded-lg">
                    <p className="text-sm text-muted mb-1">{t.lostPets}</p>
                    <p className="text-2xl font-bold text-red-500">
                      {
                        animalData.filter(
                          (p) =>
                            p.role === "Төөрсөн" ||
                            p.role.toLowerCase() === "lost",
                        ).length
                      }
                    </p>
                  </div>
                  <div className="p-4 bg-background rounded-lg">
                    <p className="text-sm text-muted mb-1">{t.foundPets}</p>
                    <p className="text-2xl font-bold text-green-500">
                      {
                        animalData.filter(
                          (p) =>
                            p.role === "Олдсон" ||
                            p.role.toLowerCase() === "found",
                        ).length
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Maintenance */}
              <div className="bg-card-bg border border-card-border rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4">{t.maintenance}</h2>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      GetLostFound();
                      GetUsers();
                      toast.success(t.dataRefreshed);
                    }}
                    className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-semibold"
                  >
                    {t.refreshData}
                  </button>
                  <button
                    onClick={() => toast.success(t.backupSuccess)}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold"
                  >
                    {t.backup}
                  </button>
                </div>
              </div>

              {/* About */}
              <div className="bg-card-bg border border-card-border rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4">{t.about}</h2>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-muted">{t.systemName}:</span>{" "}
                    {t.pawfinder}
                  </p>
                  <p>
                    <span className="text-muted">{t.version}:</span> 1.0.0
                  </p>
                  <p>
                    <span className="text-muted">{t.created}:</span> 2024
                  </p>
                  <p>
                    <span className="text-muted">{t.copyright}:</span>{" "}
                    <a href="#" className="text-primary hover:underline">
                      © 2026 {t.pawfinder}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
