"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import { DeleteIcon, EditIcon } from "./icons";
import { useLanguage } from "../contexts/Languagecontext";
import toast from "react-hot-toast";

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
type ResultType = {
  Result: React.Dispatch<React.SetStateAction<boolean>>;
};
export function UrcluulehPage({ Result }: ResultType) {
  const { user } = useUser();
  const { language } = useLanguage();
  const params = useParams();

  const id = (params as any)?.id as string | undefined;
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    petType: "dog",
    name: "",
    age: "",
    gender: "",
    breed: "",
    description: "",
    contactName: user?.fullName || "",
    contactEmail: user?.primaryEmailAddress?.emailAddress || "",
    contactPhone: "",
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const inputRef = useRef<HTMLInputElement | null>(null);

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
      descriptionPlaceholder: "Амьтаны тухай нэмэлт мэдээлэл...",
      photoTitle: "Зураг",
      uploadPhoto: "Зураг оруулахын тулд дарна уу",
      uploadingPhoto: "Зураг ачааллаж байна...",
      imageFormats: "PNG, JPG",
      contactTitle: "Таны холбоо барих мэдээлэл",
      yourName: "Таны нэр",
      namePlaceholder: "Нэр",
      email: "Имэйл",
      emailPlaceholder: "example@email.com",
      phone: "Утасны дугаар",
      phonePlaceholder: "+976 XXXX XXXX",
      submit: "Мэдээлэл илгээх",
      submitting: "Илгээж байна...",
      cancel: "Цуцлах",
      loadFail: "Мэдээлэл ачаалж чадсангүй",
      submittedSuccess: "✅ Мэдээлэл амжилттай илгээгдлээ",
      submitError: "❌ Мэдээлэл илгээхэд алдаа гарлаа",
      // Error messages
      nameRequired: "Амьтны нэр заавал оруулна уу",
      breedRequired: "Үүлдэр заавал оруулна уу",
      ageRequired: "Нас заавал оруулна уу",
      genderRequired: "Хүйс заавал сонгоно уу",
      descriptionRequired: "Тайлбар заавал оруулна уу",
      imageRequired: "Зураг заавал оруулна уу",
      contactNameRequired: "Таны нэр заавал оруулна уу",
      emailRequired: "Имэйл заавал оруулна уу",
      emailInvalid: "Зөв имэйл оруулна уу",
      phoneRequired: "Утасны дугаар заавал оруулна уу",
      phoneInvalid: "Утасны дугаар 8 оронтой байх ёстой",
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
      namePlaceholder: "Name",
      email: "Email",
      emailPlaceholder: "example@email.com",
      phone: "Phone Number",
      phonePlaceholder: "+976 XXXX XXXX",
      submit: "Submit",
      submitting: "Submitting...",
      cancel: "Cancel",
      loadFail: "Failed to load data",
      submittedSuccess: "✅ Data submitted successfully",
      submitError: "❌ Error submitting data",
      // Error messages
      nameRequired: "Pet name is required",
      breedRequired: "Breed is required",
      ageRequired: "Age is required",
      genderRequired: "Gender is required",
      descriptionRequired: "Description is required",
      imageRequired: "Photo is required",
      contactNameRequired: "Your name is required",
      emailRequired: "Email is required",
      emailInvalid: "Invalid email address",
      phoneRequired: "Phone number is required",
      phoneInvalid: "Phone number must be exactly 8 digits",
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
      setPreview(url);
      setErrors((prev) => ({ ...prev, image: "" }));
    } catch (err) {
      console.log(err);
      setPreview(null);
      if (inputRef.current) inputRef.current.value = "";
      setErrors((prev) => ({ ...prev, image: t.imageRequired }));
    } finally {
      setUploading(false);
    }
  };

  const handleEditImage = () => inputRef.current?.click();

  const handleDeleteImage = () => {
    setPreview(null);
    setErrors((prev) => ({ ...prev, image: "" }));
    if (inputRef.current) inputRef.current.value = "";
  };

  // ====== Edit mode: GET existing data ======
  useEffect(() => {
    if (!isEdit) return;

    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/adopt/${id}`,
          {
            method: "GET",
            headers: { accept: "application/json" },
          },
        );

        const json = await res.json();
        const item: AdoptItem = json?.data ?? json;

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
        toast.error(t.loadFail);
      }
    })();
  }, [isEdit, id]);

  // ====== Complete Validation ======
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Pet name
    if (!formData.name.trim()) {
      newErrors.name = t.nameRequired;
    }

    // Breed
    if (!formData.breed.trim()) {
      newErrors.breed = t.breedRequired;
    }

    // Age
    if (!formData.age.trim()) {
      newErrors.age = t.ageRequired;
    }

    // Gender
    if (!formData.gender) {
      newErrors.gender = t.genderRequired;
    }

    // Description
    if (!formData.description.trim()) {
      newErrors.description = t.descriptionRequired;
    }

    // Image
    if (!preview) {
      newErrors.image = t.imageRequired;
    }

    // Contact name
    if (!formData.contactName.trim()) {
      newErrors.contactName = t.contactNameRequired;
    }

    // Email
    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = t.emailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = t.emailInvalid;
    }

    // Phone
    if (!formData.contactPhone.trim()) {
      newErrors.contactPhone = t.phoneRequired;
    } else {
      const phoneDigits = formData.contactPhone.replace(/\D/g, "");
      if (phoneDigits.length !== 8) {
        newErrors.contactPhone = t.phoneInvalid;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const [Data, setData] = useState<any>(null);
  // ====== Submit (POST or PUT) ======
  const handleSubmit = async () => {
    if (!validateForm()) {
      const firstErrorKey = Object.keys(errors)[0];
      const element = document.getElementsByName(firstErrorKey)[0];
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
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
        image: preview,
        contactName: formData.contactName,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        userId: user?.id,
      };

      const url = isEdit
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/adopt/${id}`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/adopt`;

      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Saved:", data);
      // ✅ Show success toast
      toast.success(t.submittedSuccess, {
        duration: 2000,
        position: "top-center",
        style: {
          background: "#10b981",
          color: "#fff",
          padding: "16px",
          borderRadius: "8px",
          fontSize: "16px",
          fontWeight: "bold",
        },
      });

      // ✅ Wait for toast to show, then redirect
      // setTimeout(() => {
      //   router.push(`/`);
      // }, 2000); // Wait 2 seconds to show the toast
    } catch (err) {
      console.log(err);
      toast.error(t.submitError, {
        duration: 2000,
        position: "top-center",
        style: {
          background: "#ef4444",
          color: "#fff",
          padding: "16px",
          borderRadius: "8px",
          fontSize: "16px",
          fontWeight: "bold",
        },
      });
    } finally {
      setSubmitting(false);
      Result(true);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
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
          {/* Pet Name */}
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
              className={`w-full px-4 py-3 bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                errors.name ? "border-red-500" : "border-card-border"
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                {errors.name}
              </p>
            )}
          </div>

          {/* Breed */}
          <div>
            <label className="block text-sm font-medium mb-2">{t.breed}</label>
            <input
              type="text"
              name="breed"
              value={formData.breed}
              onChange={handleChange}
              placeholder={t.breedPlaceholder}
              className={`w-full px-4 py-3 bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                errors.breed ? "border-red-500" : "border-card-border"
              }`}
            />
            {errors.breed && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                {errors.breed}
              </p>
            )}
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm font-medium mb-2">{t.age}</label>
            <input
              type="text"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder={t.agePlaceholder}
              className={`w-full px-4 py-3 bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                errors.age ? "border-red-500" : "border-card-border"
              }`}
            />
            {errors.age && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                {errors.age}
              </p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium mb-2">{t.gender}</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={`w-full h-12 cursor-pointer px-4 pr-10 bg-background border rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                errors.gender ? "border-red-500" : "border-card-border"
              }`}
            >
              <option value="">{t.selectGender}</option>
              <option value="Male">{t.male}</option>
              <option value="Female">{t.female}</option>
            </select>
            {errors.gender && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                {errors.gender}
              </p>
            )}
          </div>

          {/* Description */}
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
              className={`w-full px-4 py-3 bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none transition-all ${
                errors.description ? "border-red-500" : "border-card-border"
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                {errors.description}
              </p>
            )}
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
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer block ${
                errors.image
                  ? "border-red-500 hover:border-red-600"
                  : "border-card-border hover:border-primary/50"
              }`}
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
                  className="bg-white p-2 cursor-pointer rounded-full hover:bg-gray-100 transition"
                >
                  <EditIcon />
                </button>

                <button
                  type="button"
                  onClick={handleDeleteImage}
                  className="bg-red-500 cursor-pointer text-white p-2 rounded-full hover:bg-red-600 transition"
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

          {errors.image && (
            <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
              {errors.image}
            </p>
          )}
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-card-bg rounded-2xl border border-card-border p-6">
        <h2 className="text-xl font-bold mb-4">{t.contactTitle}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {/* Contact Name */}
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
              className={`w-full px-4 py-3 bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                errors.contactName ? "border-red-500" : "border-card-border"
              }`}
            />
            {errors.contactName && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                {errors.contactName}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2">{t.email}</label>
            <input
              type="email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              placeholder={t.emailPlaceholder}
              className={`w-full px-4 py-3 bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                errors.contactEmail ? "border-red-500" : "border-card-border"
              }`}
            />
            {errors.contactEmail && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                {errors.contactEmail}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-2">{t.phone}</label>
            <input
              type="tel"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              placeholder={t.phonePlaceholder}
              className={`w-full px-4 py-3 bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                errors.contactPhone ? "border-red-500" : "border-card-border"
              }`}
            />
            {errors.contactPhone && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                {errors.contactPhone}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={uploading || submitting}
          className={`flex-1 px-8 py-4 text-white rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2 ${
            uploading || submitting
              ? "bg-gray-400 cursor-not-allowed opacity-60"
              : "bg-primary hover:bg-primary-dark cursor-pointer hover:shadow-lg hover:shadow-primary/30 active:scale-95"
          }`}
        >
          {submitting && (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {submitting ? t.submitting : t.submit}
        </button>

        <Link
          href="/dog"
          className="px-8 py-4 bg-card-bg border border-card-border rounded-full font-bold text-lg text-center hover:border-primary transition-all cursor-pointer active:scale-95"
        >
          {t.cancel}
        </Link>
      </div>
    </div>
  );
}
