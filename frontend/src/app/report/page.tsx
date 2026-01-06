"use client";

import { useState } from "react";
import Link from "next/link";

export default function ReportPage() {
  const [formData, setFormData] = useState({
    status: "lost",
    type: "dog",
    name: "",
    breed: "",
    color: "",
    location: "",
    date: "",
    description: "",
    contactName: "",
    contactEmail: "",
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

  if (submitted) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="w-24 h-24 bg-found/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
            <svg
              className="w-12 h-12 text-found"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4">Мэдээлэл илгээгдлээ!</h1>
          <p className="text-muted mb-8">
            Тэжээвэр амьтдыг гэр бүлтэй нь холбоход туслаж байгаад баярлалаа.
            Таны зарлал удахгүй харагдах болно.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/browse"
              className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-full font-semibold transition-all"
            >
              Зарлалууд үзэх
            </Link>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  status: "lost",
                  type: "dog",
                  name: "",
                  breed: "",
                  color: "",
                  location: "",
                  date: "",
                  description: "",
                  contactName: "",
                  contactEmail: "",
                  contactPhone: "",
                });
              }}
              className="px-6 py-3 bg-card-bg border border-card-border hover:border-primary rounded-full font-semibold transition-all"
            >
              Өөр мэдээлэл оруулах
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Мэдээлэл оруулах</h1>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Төөрсөн амьтныг гэр бүлтэй нь холбоход туслахын тулд доорх мэдээллийг
            бөглөнө үү
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Status Selection */}
          <div className="bg-card-bg rounded-2xl border border-card-border p-6">
            <h2 className="text-xl font-bold mb-4">Та юу мэдээлж байна вэ?</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, status: "lost" }))
                }
                className={`p-6 rounded-xl border-2 transition-all ${
                  formData.status === "lost"
                    ? "border-lost bg-lost/10"
                    : "border-card-border hover:border-lost/50"
                }`}
              >
                <div className="text-4xl mb-2">🔍</div>
                <div className="font-bold text-lg">Төөрсөн амьтан</div>
                <p className="text-sm text-muted mt-1">
                  Би амьтнаа хайж байна
                </p>
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, status: "found" }))
                }
                className={`p-6 rounded-xl border-2 transition-all ${
                  formData.status === "found"
                    ? "border-found bg-found/10"
                    : "border-card-border hover:border-found/50"
                }`}
              >
                <div className="text-4xl mb-2">✓</div>
                <div className="font-bold text-lg">Олдсон амьтан</div>
                <p className="text-sm text-muted mt-1">Би төөрсөн амьтан олсон</p>
              </button>
            </div>
          </div>

          {/* Pet Type */}
          <div className="bg-card-bg rounded-2xl border border-card-border p-6">
            <h2 className="text-xl font-bold mb-4">Амьтны төрөл</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, type: "dog" }))
                }
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
                onClick={() =>
                  setFormData((prev) => ({ ...prev, type: "cat" }))
                }
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

          {/* Pet Details */}
          <div className="bg-card-bg rounded-2xl border border-card-border p-6">
            <h2 className="text-xl font-bold mb-4">Амьтны мэдээлэл</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Амьтны нэр{" "}
                  {formData.status === "found" && (
                    <span className="text-muted">(хэрэв мэдвэл)</span>
                  )}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Жишээ нь: Макс, Луна"
                  className="w-full px-4 py-3 bg-background border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Үүлдэр</label>
                <input
                  type="text"
                  name="breed"
                  value={formData.breed}
                  onChange={handleChange}
                  placeholder="Жишээ нь: Алтан ретривер, Сиам"
                  required
                  className="w-full px-4 py-3 bg-background border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                  className="w-full px-4 py-3 bg-background border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {formData.status === "lost" ? "Сүүлд харсан огноо" : "Олсон огноо"}
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-background border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  {formData.status === "lost"
                    ? "Сүүлд харсан байршил"
                    : "Олсон байршил"}
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Жишээ нь: Төв цэцэрлэгт хүрээлэн, Номын сангийн ойролцоо"
                  required
                  className="w-full px-4 py-3 bg-background border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Тайлбар
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Амьтныг таних нэмэлт мэдээллийг оруулна уу: хүзүүвч, тэмдэг, зан төлөв, онцлог шинж тэмдэг..."
                  rows={4}
                  required
                  className="w-full px-4 py-3 bg-background border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
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

          {/* Contact Information */}
          <div className="bg-card-bg rounded-2xl border border-card-border p-6">
            <h2 className="text-xl font-bold mb-4">Таны холбоо барих мэдээлэл</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Таны нэр
                </label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  placeholder="Бат-Эрдэнэ"
                  required
                  className="w-full px-4 py-3 bg-background border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Имэйл</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  required
                  className="w-full px-4 py-3 bg-background border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                  placeholder="9911-2233"
                  className="w-full px-4 py-3 bg-background border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              className="flex-1 px-8 py-4 bg-primary hover:bg-primary-dark text-white rounded-full font-bold text-lg transition-all hover:shadow-xl hover:shadow-primary/30"
            >
              Мэдээлэл илгээх
            </button>
            <Link
              href="/"
              className="px-8 py-4 bg-card-bg border border-card-border hover:border-primary text-foreground rounded-full font-bold text-lg transition-all text-center"
            >
              Цуцлах
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
