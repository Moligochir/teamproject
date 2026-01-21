"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { DeleteIcon, EditIcon } from "./icons";
import { useLanguage } from "../contexts/Languagecontext";

export function UrcluulehPage() {
  const { user } = useUser();
  const { language } = useLanguage();

  const [formData, setFormData] = useState({
    petType: "dog",
    name: "",
    age: "",
    gender: "",
    image: "",
    breed: "",
    description: "",
    contactName: user?.fullName || "",
    contactEmail: user?.primaryEmailAddress?.emailAddress || "",
    contactPhone: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Translations
  const translations = {
    mn: {
      // Pet Type
      petTypeTitle: "Амьтны төрөл",
      dog: "Нохой",
      cat: "Муур",

      // Pet Information
      petInfoTitle: "Амьтны мэдээлэл",
      petName: "Амьтны нэр",
      petNamePlaceholder: "Макс, Луна",
      breed: "Үүлдэр",
      breedPlaceholder: "Алтан ретривер, Сиам",
      age: "Нас",
      agePlaceholder: "5",
      gender: "Хүйс",
      selectGender: "Сонгоно уу",
      male: "Эр",
      female: "Эм",
      description: "Тайлбар",
      descriptionPlaceholder: "Амьтныг таних нэмэлт мэдээлэл...",

      // Photo
      photoTitle: "Зураг",
      uploadPhoto: "Зураг оруулахын тулд дарна уу",
      imageFormats: "PNG, JPG",

      // Contact Info
      contactTitle: "Таны холбоо барих мэдээлэл",
      yourName: "Таны нэр",
      namePlaceholder: "Sunduibazrr",
      email: "Имэйл",
      emailPlaceholder: "example@email.com",
      phone: "Утасны дугаар",
      phonePlaceholder: "9911-2233",

      // Buttons
      submit: "Мэдээлэл илгээх",
      cancel: "Цуцлах",
    },
    en: {
      // Pet Type
      petTypeTitle: "Pet Type",
      dog: "Dog",
      cat: "Cat",

      // Pet Information
      petInfoTitle: "Pet Information",
      petName: "Pet Name",
      petNamePlaceholder: "Max, Luna",
      breed: "Breed",
      breedPlaceholder: "Golden Retriever, Siamese",
      age: "Age",
      agePlaceholder: "5",
      gender: "Gender",
      selectGender: "Select",
      male: "Male",
      female: "Female",
      description: "Description",
      descriptionPlaceholder: "Additional information about the pet...",

      // Photo
      photoTitle: "Photo",
      uploadPhoto: "Click to upload photo",
      imageFormats: "PNG, JPG",

      // Contact Info
      contactTitle: "Your Contact Information",
      yourName: "Your Name",
      namePlaceholder: "John Doe",
      email: "Email",
      emailPlaceholder: "example@email.com",
      phone: "Phone Number",
      phonePlaceholder: "555-1234",

      // Buttons
      submit: "Submit Information",
      cancel: "Cancel",
    },
  };

  const t = translations[language];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
  };

  const handleEdit = () => {
    inputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setSubmitted(true);
  };

  const handleDelete = () => {
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleAddChange = async () => {
    try {
      const res = await fetch(`http://localhost:8000/adopt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          petType: formData.petType === "dog" ? "Dog" : "Cat",
          name: formData.name,
          age: formData.age,
          breed: formData.breed,
          description: formData.description,
          userId: user?.id,
        }),
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
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
        <h2 className="text-xl font-bold mb-4">{t.petTypeTitle}</h2>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, petType: "dog" }))}
            className={`p-6 rounded-xl border-2 transition-all cursor-pointer ${
              formData.petType === "dog"
                ? "border-primary bg-primary/10"
                : "border-card-border hover:border-primary/50"
            }`}
          >
            <div className="text-4xl mb-2">🐕</div>
            <div className="font-bold text-lg">{t.dog}</div>
          </button>

          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, petType: "cat" }))}
            className={`p-6 rounded-xl border-2 transition-all cursor-pointer ${
              formData.petType === "cat"
                ? "border-primary bg-primary/10"
                : "border-card-border hover:border-primary/50"
            }`}
          >
            <div className="text-4xl mb-2">🐱</div>
            <div className="font-bold text-lg">{t.cat}</div>
          </button>
        </div>
      </div>

      {/* Animal Info */}
      <div className="bg-card-bg rounded-2xl border border-card-border p-6">
        <h2 className="text-xl font-bold mb-4">{t.petInfoTitle}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              {t.petName}
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={t.petNamePlaceholder}
              className="w-full px-4 py-3 bg-background border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{t.breed}</label>
            <input
              type="text"
              name="breed"
              value={formData.breed}
              onChange={handleChange}
              placeholder={t.breedPlaceholder}
              required
              className="w-full px-4 py-3 bg-background border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{t.age}</label>
            <input
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder={t.agePlaceholder}
              required
              className="w-full px-4 py-3 bg-background border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="gender" className="block text-sm font-medium mb-2">
              {t.gender}
            </label>
            <div className="relative w-full">
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full h-12 cursor-pointer px-4 pr-10 bg-background border border-card-border rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">{t.selectGender}</option>
                <option value="Male" className="bg-[#e47a3d]">
                  {t.male}
                </option>
                <option value="Female">{t.female}</option>
              </select>

              <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                <svg
                  className="h-4 w-4 text-muted-foreground"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">
              {t.description}
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
              placeholder={t.descriptionPlaceholder}
              className="w-full px-4 py-3 bg-background border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>
        </div>
      </div>

      {/* Photo Upload */}
      <div className="bg-card-bg rounded-2xl border border-card-border p-6">
        <h2 className="text-xl font-bold mb-4">{t.photoTitle}</h2>

        <div className="relative">
          {!preview ? (
            <label
              htmlFor="image-upload"
              className="border-2 border-dashed border-card-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer block"
            >
              <div className="text-4xl mb-3">📷</div>
              <p className="font-medium mb-1">{t.uploadPhoto}</p>
              <p className="text-xs text-muted mt-2">{t.imageFormats}</p>

              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                ref={inputRef}
              />
            </label>
          ) : (
            <div className="relative group">
              <img
                src={preview}
                alt="Preview"
                className="w-full max-h-72 object-contain rounded-xl"
              />

              {/* Overlay buttons */}
              <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={handleEdit}
                  className="bg-white p-2 rounded-full hover:bg-gray-100 transition"
                >
                  <EditIcon />
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                >
                  <DeleteIcon />
                </button>
              </div>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={inputRef}
                onChange={handleImageChange}
              />
            </div>
          )}
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-card-bg rounded-2xl border border-card-border p-6">
        <h2 className="text-xl font-bold mb-4">{t.contactTitle}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">
              {t.yourName}
            </label>
            <input
              type="text"
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
              placeholder={t.namePlaceholder}
              required
              className="w-full px-4 py-3 bg-background border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">{t.email}</label>
            <input
              type="email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              placeholder={t.emailPlaceholder}
              required
              className="w-full px-4 py-3 bg-background border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">{t.phone}</label>
            <input
              type="tel"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              placeholder={t.phonePlaceholder}
              className="w-full px-4 py-3 bg-background border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleAddChange}
          type="submit"
          className="flex-1 px-8 py-4 bg-primary text-white rounded-full font-bold text-lg hover:bg-primary-dark transition cursor-pointer"
        >
          {t.submit}
        </button>

        <Link
          href="/"
          className="px-8 py-4 bg-card-bg border border-card-border rounded-full font-bold text-lg text-center hover:border-primary transition cursor-pointer"
        >
          {t.cancel}
        </Link>
      </div>
    </div>
  );
}
