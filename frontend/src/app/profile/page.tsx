"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "../contexts/Languagecontext";
import { useUser } from "@clerk/nextjs";

type userType = {
  _id: string;
  clerkId: string;
  email: string;
  name: string;
  role: string;
  phonenumber: number;
};

type PostType = {
  _id: string;
  userId: string;
  name: string;
  petType: string;
  description: string;
  role: "Төөрсөн" | "Олдсон";
  image: string;
  location: string;
  createdAt: string;
  updatedAt: string;
};

export default function ProfilePage() {
  const { user: clerkUser } = useUser();
  const [userData, setUserData] = useState<userType | null>(null);
  const [myPosts, setMyPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);

  // Get current user data
  const GetCurrentUser = async () => {
    if (!clerkUser?.id) return;

    try {
      const res = await fetch(`http://localhost:8000/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
      });
      const data = await res.json();

      // Find current user by clerkId
      const currentUser = data.find(
        (u: userType) => u.clerkId === clerkUser.id,
      );
      if (currentUser) {
        setUserData(currentUser);

        GetUserPosts(currentUser._id);
      }
    } catch (err) {
      console.log("Error fetching user:", err);
    }
  };

  // Get user's posts
  const GetUserPosts = async (userId: string) => {
    try {
      const res = await fetch(
        `http://localhost:8000/lostFound?userId=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
        },
      );
      const data = await res.json();
      console.log("User posts:", data);
      setMyPosts(data);
    } catch (err) {
      console.log("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete post
  const handleDeletePost = async (postId: string) => {
    if (!confirm("Та энэ зарыг устгахдаа итгэлтэй байна уу?")) return;

    try {
      const res = await fetch(`http://localhost:8000/lostFound/${postId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        // Remove post from state
        setMyPosts(myPosts.filter((post) => post._id !== postId));
      }
    } catch (err) {
      console.log("Error deleting post:", err);
      alert("Зар устгахад алдаа гарлаа");
    }
  };

  useEffect(() => {
    if (clerkUser?.id) {
      GetCurrentUser();
    }
  }, [clerkUser]);

  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<"posts" | "saved" | "settings">(
    "posts",
  );

  // Calculate stats from actual posts
  const stats = {
    totalPosts: myPosts.length,
    reunited: myPosts.filter((post) => post.role === "Олдсон").length,
    active: myPosts.filter((post) => post.role === "Төөрсөн").length,
  };

  const translations = {
    mn: {
      // Header
      myProfile: "Миний профайл",
      memberSince: "Гишүүнээр элссэн",

      // Stats
      totalPosts: "Нийт зар",
      reunited: "Олдсон",
      activePosts: "Төөрсөн",

      // Tabs
      myPosts: "Миний зарлалууд",
      savedPosts: "Хадгалсан",
      settings: "Тохиргоо",

      // Posts
      edit: "Засах",
      delete: "Устгах",
      viewDetails: "Дэлгэрэнгүй",
      noPosts: "Танд зар байхгүй байна",
      noPostsDesc: "Төөрсөн эсвэл олдсон амьтны мэдээлэл оруулж эхлээрэй",
      createPost: "Зар үүсгэх",

      // Pet info
      lost: "Төөрсөн",
      found: "Олдсон",
      dog: "Нохой",
      cat: "Муур",

      // Settings
      personalInfo: "Хувийн мэдээлэл",
      name: "Нэр",
      email: "Имэйл",
      phone: "Утас",
      password: "Нууц үг",
      changePassword: "Нууц үг солих",
      notifications: "Мэдэгдэл",
      emailNotif: "Имэйл мэдэгдэл",
      emailNotifDesc: "Шинэ тохирол болон мессеж ирэхэд имэйл илгээх",
      pushNotif: "Push мэдэгдэл",
      pushNotifDesc: "Аппликэйшн дээр мэдэгдэл харуулах",
      saveChanges: "Өөрчлөлт хадгалах",
      cancel: "Цуцлах",

      // Account
      accountSettings: "Акаунтын тохиргоо",
      deleteAccount: "Акаунт устгах",
      deleteAccountDesc: "Таны бүх өгөгдөл бүрмөсөн устах болно",
      deleteBtn: "Акаунт устгах",

      loading: "Уншиж байна...",
    },
    en: {
      // Header
      myProfile: "My Profile",
      memberSince: "Member since",

      // Stats
      totalPosts: "Total Posts",
      reunited: "Found",
      activePosts: "Lost",

      // Tabs
      myPosts: "My Posts",
      savedPosts: "Saved",
      settings: "Settings",

      // Posts
      edit: "Edit",
      delete: "Delete",
      viewDetails: "View Details",
      noPosts: "You don't have any posts",
      noPostsDesc: "Start by reporting a lost or found pet",
      createPost: "Create Post",

      // Pet info
      lost: "Lost",
      found: "Found",
      dog: "Dog",
      cat: "Cat",

      // Settings
      personalInfo: "Personal Information",
      name: "Name",
      email: "Email",
      phone: "Phone",
      password: "Password",
      changePassword: "Change Password",
      notifications: "Notifications",
      emailNotif: "Email Notifications",
      emailNotifDesc: "Receive emails about new matches and messages",
      pushNotif: "Push Notifications",
      pushNotifDesc: "Show notifications in the app",
      saveChanges: "Save Changes",
      cancel: "Cancel",

      // Account
      accountSettings: "Account Settings",
      deleteAccount: "Delete Account",
      deleteAccountDesc: "All your data will be permanently deleted",
      deleteBtn: "Delete Account",

      loading: "Loading...",
    },
  };

  const t = translations[language];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🐾</div>
          <p className="text-muted">{t.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-card-bg rounded-2xl border border-card-border p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            {/* Avatar */}
            <div className="relative">
              <img
                src={
                  clerkUser?.imageUrl ||
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"
                }
                alt={userData?.name || "User"}
                className="w-32 h-32 rounded-full object-cover border-4 border-primary/20"
              />
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">
                {userData?.name || clerkUser?.fullName}
              </h1>
              <p className="text-muted mb-1">
                {userData?.email || clerkUser?.emailAddresses[0]?.emailAddress}
              </p>
              <p className="text-sm text-muted">
                {t.memberSince}{" "}
                {clerkUser?.createdAt
                  ? new Date(clerkUser.createdAt).toLocaleDateString()
                  : ""}
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {stats.totalPosts}
                </div>
                <div className="text-sm text-muted">{t.totalPosts}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-found">
                  {stats.reunited}
                </div>
                <div className="text-sm text-muted">{t.reunited}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-lost">
                  {stats.active}
                </div>
                <div className="text-sm text-muted">{t.activePosts}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-card-bg rounded-2xl border border-card-border overflow-hidden">
          {/* Tab Headers */}
          <div className="flex border-b border-card-border">
            <button
              onClick={() => setActiveTab("posts")}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === "posts"
                  ? "bg-primary text-white"
                  : "text-muted hover:bg-card-bg/50"
              }`}
            >
              {t.myPosts}
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === "saved"
                  ? "bg-primary text-white"
                  : "text-muted hover:bg-card-bg/50"
              }`}
            >
              {t.savedPosts}
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === "settings"
                  ? "bg-primary text-white"
                  : "text-muted hover:bg-card-bg/50"
              }`}
            >
              {t.settings}
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* My Posts Tab */}
            {activeTab === "posts" && (
              <div>
                {myPosts.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myPosts.map((post) => (
                      <div
                        key={post._id}
                        className="w-[320px] bg-white dark:bg-card-bg rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                      >
                        {/* Image Header - Fixed aspect ratio */}
                        <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
                          <img
                            src={post.image}
                            alt={post.name}
                            className="w-full h-full object-cover"
                          />
                          {/* Status Badge */}
                          <div className="absolute top-3 left-3">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm ${
                                post.role === "Төөрсөн"
                                  ? "bg-red-500/90 text-white"
                                  : "bg-green-500/90 text-white"
                              }`}
                            >
                              {post.role === "Төөрсөн"
                                ? "🔍 Төөрсөн"
                                : "✓ Олдсон"}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 space-y-4">
                          {/* Name */}
                          <h3 className="font-bold text-xl text-gray-900 dark:text-foreground leading-tight line-clamp-2">
                            {post.name}
                          </h3>

                          {/* Info Grid */}
                          <div className="space-y-3">
                            {/* Pet Type */}
                            <div className="flex items-center gap-2">
                              <svg
                                className="w-5 h-5 text-blue-600 dark:text-primary shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                />
                              </svg>
                              <span className="text-sm text-gray-500 dark:text-muted min-w-[45px]">
                                Төрөл:
                              </span>
                              <span className="text-sm font-semibold text-gray-900 dark:text-foreground">
                                {post.petType}
                              </span>
                            </div>

                            {/* Location */}
                            <div className="flex items-center gap-2">
                              <svg
                                className="w-5 h-5 text-blue-600 dark:text-primary shrink-0"
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
                              <span className="text-sm text-gray-600 dark:text-muted">
                                {post.location}
                              </span>
                            </div>

                            {/* Description */}
                            <div className="flex gap-2">
                              <svg
                                className="w-5 h-5 text-blue-600 dark:text-primary flex-shrink-0 mt-0.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <p className="text-sm text-gray-600 dark:text-muted leading-relaxed line-clamp-3 flex-1">
                                {post.description}
                              </p>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2 pt-2">
                            <Link
                              href={`/edit/${post._id}`}
                              className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-colors duration-200 text-center"
                            >
                              {t.edit}
                            </Link>
                            <button
                              onClick={() => handleDeletePost(post._id)}
                              className="px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold text-sm transition-colors duration-200"
                            >
                              {t.delete}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-xl font-bold mb-2">{t.noPosts}</h3>
                    <p className="text-muted mb-6">{t.noPostsDesc}</p>
                    <Link
                      href="/report"
                      className="inline-block px-6 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary-dark transition-all"
                    >
                      {t.createPost}
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Saved Posts Tab */}
            {activeTab === "saved" && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔖</div>
                <h3 className="text-xl font-bold mb-2">
                  {language === "mn"
                    ? "Хадгалсан зар байхгүй"
                    : "No Saved Posts"}
                </h3>
                <p className="text-muted">
                  {language === "mn"
                    ? "Дараа үзэх зарлалуудаа хадгална уу"
                    : "Save posts to view them later"}
                </p>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="space-y-8 max-w-2xl">
                {/* Personal Information */}
                <div>
                  <h3 className="text-xl font-bold mb-4">{t.personalInfo}</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t.name}
                      </label>
                      <input
                        type="text"
                        defaultValue={userData?.name}
                        className="w-full px-4 py-3 bg-background border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t.email}
                      </label>
                      <input
                        type="email"
                        defaultValue={userData?.email}
                        className="w-full px-4 py-3 bg-background border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t.phone}
                      </label>
                      <input
                        type="tel"
                        defaultValue={userData?.phonenumber}
                        className="w-full px-4 py-3 bg-background border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div>
                  <h3 className="text-xl font-bold mb-4">{t.password}</h3>
                  <button className="px-6 py-3 bg-card-bg border border-card-border rounded-xl font-semibold hover:border-primary transition-all">
                    {t.changePassword}
                  </button>
                </div>

                {/* Notifications */}
                <div>
                  <h3 className="text-xl font-bold mb-4">{t.notifications}</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-background border border-card-border rounded-xl">
                      <div>
                        <div className="font-semibold">{t.emailNotif}</div>
                        <div className="text-sm text-muted">
                          {t.emailNotifDesc}
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          defaultChecked
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-background border border-card-border rounded-xl">
                      <div>
                        <div className="font-semibold">{t.pushNotif}</div>
                        <div className="text-sm text-muted">
                          {t.pushNotifDesc}
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex gap-4">
                  <button className="px-8 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-all">
                    {t.saveChanges}
                  </button>
                  <button className="px-8 py-3 bg-card-bg border border-card-border rounded-xl font-semibold hover:border-primary transition-all">
                    {t.cancel}
                  </button>
                </div>

                {/* Danger Zone */}
                <div className="border-t border-card-border pt-8">
                  <h3 className="text-xl font-bold mb-4 text-red-500">
                    {t.accountSettings}
                  </h3>
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold text-red-600 dark:text-red-400">
                          {t.deleteAccount}
                        </div>
                        <div className="text-sm text-red-600/80 dark:text-red-400/80 mt-1">
                          {t.deleteAccountDesc}
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all">
                        {t.deleteBtn}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
