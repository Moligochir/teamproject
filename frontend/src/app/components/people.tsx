"use client";

import { useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

export function People() {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    status: "lost",
    type: "dog",
    name: "",
    breed: "",
    color: "",
    location: "",
    date: "",
    description: "",
    contactName: user?.fullName || "",
    contactEmail: user?.primaryEmailAddress?.emailAddress || "",
    contactPhone: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setSubmitted(true);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Animal Type */}
      <div className="bg-card-bg rounded-2xl border border-card-border p-6">
        <h2 className="text-xl font-bold mb-4">Амьтны төрөл</h2>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, type: "dog" }))}
            className={`p-6 rounded-xl border-2 transition-all ${
              formData.type === "dog"
                ? "border-primary bg-primary/10"
                : "border-card-border hover:border-primary/50"
            }`}
          >
            <div className="text-4xl mb-2">🐕</div>
            <div className="font-bold text-lg">Нохой</div>
          </button>

          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, type: "cat" }))}
            className={`p-6 rounded-xl border-2 transition-all ${
              formData.type === "cat"
                ? "border-primary bg-primary/10"
                : "border-card-border hover:border-primary/50"
            }`}
          >
            <div className="text-4xl mb-2">🐱</div>
            <div className="font-bold text-lg">Муур</div>
          </button>
        </div>
      </div>

      {/* Animal Info */}
      <div className="bg-card-bg rounded-2xl border border-card-border p-6">
        <h2 className="text-xl font-bold mb-4">Амьтны мэдээлэл</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Амьтны нэр</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Жишээ нь: Макс, Луна"
              className="w-full px-4 py-3 bg-background border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Үйлдвэр</label>
            <input
              type="text"
              name="breed"
              value={formData.breed}
              onChange={handleChange}
              placeholder="Жишээ нь: Алтан ретривер, Сиам"
              required
              className="w-full px-4 py-3 bg-background border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Өнгө/Тэмдэг
            </label>
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleChange}
              placeholder="Жишээ нь: Алтлаг, Хар цагаан толботой"
              required
              className="w-full px-4 py-3 bg-background border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Тайлбар</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
              placeholder="Амьтныг таних нэмэлт мэдээлэл..."
              className="w-full px-4 py-3 bg-background border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>
        </div>
      </div>

      {/* Photo Upload */}
      <div className="bg-card-bg rounded-2xl border border-card-border p-6">
        <h2 className="text-xl font-bold mb-4">Зураг</h2>
        <div className="border-2 border-dashed border-card-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
          <div className="text-4xl mb-3">📷</div>
          <p className="font-medium mb-1">Зураг оруулахын тулд дарна уу</p>
          <p className="text-sm text-muted">эсвэл чирж оруулна уу</p>
          <p className="text-xs text-muted mt-2">PNG, JPG 10MB хүртэл</p>
          <input type="file" accept="image/*" className="hidden" />
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-card-bg rounded-2xl border border-card-border p-6">
        <h2 className="text-xl font-bold mb-4">Таны холбоо барих мэдээлэл</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Таны нэр</label>
            <input
              type="text"
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-background border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Имэйл</label>
            <input
              type="email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-background border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Утасны дугаар
            </label>
            <input
              type="tel"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-background border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          type="submit"
          className="flex-1 px-8 py-4 bg-primary text-white rounded-full font-bold text-lg hover:bg-primary-dark transition cursor-pointer"
        >
          Мэдээлэл илгээх
        </button>

        <Link
          href="/"
          className="px-8 py-4 bg-card-bg border border-card-border rounded-full font-bold text-lg text-center hover:border-primary transition cursor-pointer"
        >
          Цуцлах
        </Link>
      </div>
    </div>
  );
}
