"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import { DeleteIcon, EditIcon } from "./icons";
import { useLanguage } from "../contexts/Languagecontext";

const UPLOAD_PRESET = "Pawpew";
const CLOUD_NAME = "dyduodw7q";

type AdoptItem = {
  _id: string;
  petType: "Dog" | "Cat";
  name: string;
  age: string;
  gender: string;
  breed: string;
  description: string;
  image: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  userId?: string;
};

export function UrcluulehPage() {
  const { user } = useUser();
  const { language } = useLanguage();
  const params = useParams();
  const router = useRouter();

  // Edit хийх үед URL-аас id авч болно (route: /adopt/edit/[id])
  const id = (params as any)?.id as string | undefined;
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    petType: "dog", // UI дээр dog/cat гэж барина
    name: "",
    age: "",
    gender: "",
    breed: "",
    description: "",
    contactName: user?.fullName || "",
    contactEmail: user?.primaryEmailAddress?.emailAddress || "",
    contactPhone: "",
  });

  const [preview, setPreview] = useState<string | null>(null); // Cloudinary image URL
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // ====== Translations ======
  const translations = {
    mn: {
      petTypeTitle: "Амьтны төрөл",
      dog: "Нохой",
      cat: "Муур",
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
      photoTitle: "Зураг",
      uploadPhoto: "Зураг оруулахын тулд дарна уу",
      uploadingPhoto: "Зураг ачааллаж байна...",
      imageFormats: "PNG, JPG",
      contactTitle: "Таны холбоо барих мэдээлэл",
      yourName: "Таны нэр",
      namePlaceholder: "Sunduibazrr",
      email: "Имэйл",
      emailPlaceholder: "example@email.com",
      phone: "Утасны дугаар",
      phonePlaceholder: "+976 XXXX XXXX",
      submit: "Мэдээлэл илгээх",
      submitting: "Илгээж байна...",
      cancel: "Цуцлах",
      imageRequired: "Зураг заавал оруулна уу",
      loadFail: "Мэдээлэл ачаалж чадсангүй",
    },
    en: {
      petTypeTitle: "Pet Type",
      dog: "Dog",
      cat: "Cat",
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
      photoTitle: "Photo",
      uploadPhoto: "Click to upload photo",
      uploadingPhoto: "Uploading photo...",
      imageFormats: "PNG, JPG",
      contactTitle: "Your Contact Information",
      yourName: "Your Name",
      namePlaceholder: "John Doe",
      email: "Email",
      emailPlaceholder: "example@email.com",
      phone: "Phone Number",
      phonePlaceholder: "+976 XXXX XXXX",
      submit: "Submit",
      submitting: "Submitting...",
      cancel: "Cancel",
      imageRequired: "Photo is required",
      loadFail: "Failed to load data",
    },
  };

  const t = translations[language as "mn" | "en"];

  // ====== Cloudinary upload ======
  const uploadToCloudinary = async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: "POST", body: fd },
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data?.error?.message || "Upload failed");
    return data.secure_url as string;
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setPreview(url); // ✅ Cloudinary URL
    } catch (err) {
      console.log(err);
      setPreview(null);
      if (inputRef.current) inputRef.current.value = "";
      alert(t.imageRequired);
    } finally {
      setUploading(false);
    }
  };

  const handleEditImage = () => inputRef.current?.click();

  const handleDeleteImage = () => {
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  // ====== Edit mode: GET existing data ======
  useEffect(() => {
    if (!isEdit) return;

    (async () => {
      try {
        const res = await fetch(`http://localhost:8000/adopt/${id}`, {
          method: "GET",
          headers: { accept: "application/json" },
        });

        const json = await res.json();
        const item: AdoptItem = json?.data ?? json; // backend чинь data дотор хийдэг бол

        setFormData((prev) => ({
          ...prev,
          petType: item.petType === "Dog" ? "dog" : "cat",
          name: item.name || "",
          age: item.age || "",
          gender: item.gender || "",
          breed: item.breed || "",
          description: item.description || "",
          contactName: item.contactName || prev.contactName,
          contactEmail: item.contactEmail || prev.contactEmail,
          contactPhone: item.contactPhone || "",
        }));

        setPreview(item.image || null);
      } catch (err) {
        console.log(err);
        alert(t.loadFail);
      }
    })();
  }, [isEdit, id]);

  // ====== Submit (POST or PUT) ======
  const handleSubmit = async () => {
    // Create үед зураг заавал; Edit үед зураг байхгүй бол бас алдаа
    if (!preview) {
      alert(t.imageRequired);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        petType: formData.petType === "dog" ? "Dog" : "Cat",
        name: formData.name,
        age: formData.age,
        gender: formData.gender,
        breed: formData.breed,
        description: formData.description,
        image: preview, // ✅ Cloudinary URL
        contactName: formData.contactName,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        userId: user?.id,
      };

      const url = isEdit
        ? `http://localhost:8000/adopt/${id}`
        : `http://localhost:8000/adopt`;

      const method = isEdit ? "PUT" : "POST"; // эсвэл PATCH

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Saved:", data);

      // хүсвэл амжилтын хуудас руу
      router.push("/browse"); // эсвэл router.back()
    } catch (err) {
      console.log(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Animal Type */}
      <div className="bg-card-bg rounded-2xl border border-card-border p-6">
        <h2 className="text-xl font-bold mb-4">{t.petTypeTitle}</h2>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setFormData((p) => ({ ...p, petType: "dog" }))}
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
            onClick={() => setFormData((p) => ({ ...p, petType: "cat" }))}
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
            <label className="block text-sm font-medium mb-2">{t.petName}</label>
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
              className="w-full px-4 py-3 bg-background border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{t.gender}</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full h-12 cursor-pointer px-4 pr-10 bg-background border border-card-border rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">{t.selectGender}</option>
              <option value="Male">{t.male}</option>
              <option value="Female">{t.female}</option>
            </select>
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
              {!uploading ? (
                <>
                  <div className="text-4xl mb-3">📷</div>
                  <p className="font-medium mb-1">{t.uploadPhoto}</p>
                  <p className="text-xs text-muted mt-2">{t.imageFormats}</p>
                </>
              ) : (
                <p className="font-medium">{t.uploadingPhoto}</p>
              )}

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

              <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={handleEditImage}
                  className="bg-white p-2 rounded-full hover:bg-gray-100 transition"
                >
                  <EditIcon />
                </button>

                <button
                  type="button"
                  onClick={handleDeleteImage}
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
            <label className="block text-sm font-medium mb-2">{t.yourName}</label>
            <input
              type="text"
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
              placeholder={t.namePlaceholder}
              className="w-full px-4 py-3 bg-background border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
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
              className="w-full px-4 py-3 bg-background border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
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
              className="w-full px-4 py-3 bg-background border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={uploading || submitting}
          className={`flex-1 px-8 py-4 text-white rounded-full font-bold text-lg transition ${
            uploading || submitting
              ? "bg-gray-400 cursor-not-allowed opacity-60"
              : "bg-primary hover:bg-primary-dark cursor-pointer"
          }`}
        >
          {submitting ? t.submitting : t.submit}
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
