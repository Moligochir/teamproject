"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

type UserType = {
  _id: string;
  clerkId: string;
  email: string;
  name: string;
  role: string;
  phonenumber: number;
  createdAt?: string;
};

export default function SettingsPage() {
  const { user: clerkUser } = useUser();
  const [userData, setUserData] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phonenumber: "",
  });

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);

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

      const currentUser = data.find(
        (u: UserType) => u.clerkId === clerkUser.id,
      );

      if (currentUser) {
        setUserData(currentUser);
        setFormData({
          name: currentUser.name,
          email: currentUser.email,
          phonenumber: currentUser.phonenumber?.toString() || "",
        });
      }
    } catch (err) {
      console.log("Error fetching user:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (clerkUser?.id) {
      GetCurrentUser();
    }
  }, [clerkUser]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Save changes
  const handleSaveChanges = async () => {
    if (!userData) return;

    setSaving(true);
    try {
      const res = await fetch(`http://localhost:8000/users/${userData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phonenumber: parseInt(formData.phonenumber) || 0,
        }),
      });

      if (res.ok) {
        alert("Мэдээлэл амжилттай шинэчлэгдлээ!");
        GetCurrentUser();
      } else {
        alert("Алдаа гарлаа!");
      }
    } catch (err) {
      console.error("Error updating user:", err);
      alert("Холболтын алдаа гарлаа");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 flex items-center justify-center animate-pulse">
              <svg
                className="w-20 h-20 text-primary"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" />
              </svg>
            </div>
            <div className="absolute inset-0">
              <div className="w-full h-full border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
            Тохиргоо ачааллаж байна...
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Тохиргоо</h1>
          <p className="text-muted">
            Өөрийн мэдээлэл болон тохиргоогоо удирдах
          </p>
        </div>

        {/* Profile Section */}
        <div className="bg-card-bg rounded-2xl border border-card-border p-6 mb-6">
          <div className="flex items-center gap-6 mb-6">
            <div className="relative">
              <img
                src={
                  clerkUser?.imageUrl ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random`
                }
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
              />
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-dark transition">
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
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            </div>
            <div>
              <h2 className="text-2xl font-bold">{formData.name}</h2>
              <p className="text-muted">{formData.email}</p>
              <span
                className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${
                  userData?.role === "Admin"
                    ? "bg-purple-500/10 text-purple-500"
                    : "bg-blue-500/10 text-blue-500"
                }`}
              >
                {userData?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-card-bg rounded-2xl border border-card-border p-6 mb-6">
          <h3 className="text-xl font-bold mb-6">Хувийн мэдээлэл</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Нэр</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-background border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Таны нэр"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Имэйл</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-background border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="example@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Утасны дугаар
              </label>
              <input
                type="tel"
                name="phonenumber"
                value={formData.phonenumber}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-background border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="99112233"
              />
            </div>
          </div>
        </div>

        {/* Password Section */}
        <div className="bg-card-bg rounded-2xl border border-card-border p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">Нууц үг</h3>
          <p className="text-muted text-sm mb-4">
            Clerk authentication ашиглаж байгаа тул нууц үгийг Clerk
            dashboard-аас удирдана уу
          </p>
          <button className="px-6 py-3 bg-card-bg border border-card-border rounded-xl font-semibold hover:border-primary transition">
            Нууц үг солих
          </button>
        </div>

        {/* Notifications */}
        <div className="bg-card-bg rounded-2xl border border-card-border p-6 mb-6">
          <h3 className="text-xl font-bold mb-6">Мэдэгдэл</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-background border border-card-border rounded-xl">
              <div>
                <div className="font-semibold">Имэйл мэдэгдэл</div>
                <div className="text-sm text-muted">
                  Шинэ тохирол болон мессеж ирэхэд имэйл илгээх
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-background border border-card-border rounded-xl">
              <div>
                <div className="font-semibold">Push мэдэгдэл</div>
                <div className="text-sm text-muted">
                  Аппликэйшн дээр мэдэгдэл харуулах
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={pushNotifications}
                  onChange={(e) => setPushNotifications(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Save Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleSaveChanges}
            disabled={saving}
            className="px-8 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Хадгалж байна..." : "Өөрчлөлт хадгалах"}
          </button>
          <Link
            href="/profile"
            className="px-8 py-3 bg-card-bg border border-card-border rounded-xl font-semibold hover:border-primary transition text-center"
          >
            Цуцлах
          </Link>
        </div>

        {/* Danger Zone */}
        <div className="bg-card-bg rounded-2xl border border-red-200 dark:border-red-800 p-6 mt-6">
          <h3 className="text-xl font-bold mb-4 text-red-500">Аюултай бүс</h3>
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold text-red-600 dark:text-red-400">
                  Акаунт устгах
                </div>
                <div className="text-sm text-red-600/80 dark:text-red-400/80 mt-1">
                  Таны бүх өгөгдөл бүрмөсөн устах болно. Энэ үйлдлийг буцаах
                  боломжгүй.
                </div>
              </div>
              <button className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition">
                Акаунт устгах
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
