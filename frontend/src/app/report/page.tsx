"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import MapLocationPicker from "../components/mapLocationPicker";
import { DeleteIcon, EditIcon } from "../components/icons";
import { useUser } from "@clerk/nextjs";
import * as React from "react";

type User = {
  _id: string;
  clerkId: string;
  email: string;
  name?: string; // ? → optional
  role?: "ADMIN" | "USER";
  createdAt?: string;
  updatedAt?: string;
};

const UPLOAD_PRESET = "Pawpew";
const CLOUD_NAME = "dyduodw7q";

export default function ReportPage() {
  const [usersdata, setUsersData] = useState<User[]>([]);
  const { user } = useUser();
  const createUser = async () => {
    try {
      const userInfo = await fetch(`http://localhost:8000/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clerkId: user?.id,
          email: user?.primaryEmailAddress?.emailAddress,
          name: user?.fullName,
          role: "USER",
          phonenumber: user?.phoneNumbers[0]?.phoneNumber || "",
        }),
      });
      const data = await userInfo.json();
      console.log("CreateUseryn hariu", data);
    } catch (err) {
      console.log(err);
    }
  };
  const createRef = useRef(false);
  useEffect(() => {
    if (user && !createRef.current) {
      createUser();
      createRef.current = true;
    }
  }, [user]);

  const GetUser = async () => {
    try {
      const res = await fetch(`http://localhost:8000/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
      });
      const data = await res.json();
      console.log("User data:", data);
      setUsersData(data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (user) {
      GetUser();
    }
  }, [user]);

  const FilterUser = usersdata.find((u) => u.clerkId === user?.id);
  useEffect(() => {
    if (FilterUser) {
      setFormData((prev) => ({
        ...prev,
        contactName: FilterUser.name || "",
        contactEmail: FilterUser.email || "",
      }));
    }
  }, [FilterUser]);

  const [formData, setFormData] = useState({
    status: "lost",
    type: "dog",
    name: "",
    breed: "",
    gender: "",
    location: "",
    date: "",
    description: "",
    contactName: user?.fullName || "",
    contactEmail: user?.primaryEmailAddress?.emailAddress || "",
    contactPhone: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [quit, setQuit] = useState(false);

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();

    formData.append("file", file);

    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,

        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      return data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload failed:", error);
    }
  };

  const handleLogoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;
    setUploading(true);

    try {
      const url = await uploadToCloudinary(file);
      setPreview(url);
      console.log(url);
    } catch (err: unknown) {
      console.log("Failed to upload logo: " + (err as Error).message);
    } finally {
      setUploading(false);
    }
  };
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const handleEdit = () => {
    inputRef.current?.click();
  };
  const handleDelete = () => {
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!preview) {
      alert("Зураг оруулна уу");
      return;
    }
    handleAddChange();
    setSubmitted(true);
    console.log("Form submitted:", formData);
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

  const handleAddChange = async () => {
    try {
      const res = await fetch(`http://localhost:8000/lostFound`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          role: formData.status === "lost" ? "Lost" : "Found",
          petType: formData.type === "dog" ? "Dog" : "Cat",
          name: formData.name,
          breed: formData.breed,
          gender: formData.gender,
          Date: formData.date,
          image: preview,
          description: formData.description,
          userId: FilterUser?._id,
        }),
      });
    } catch (err) {
      console.log(err);
    }
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
            <Link
              href="/probability"
              className="px-6 py-3 bg-card-bg border border-card-border hover:border-primary rounded-full font-semibold transition-all"
            >
              Магадлалтай тохирол үзэх
            </Link>
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Мэдээлэл оруулах
          </h1>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Төөрсөн амьтныг гэр бүлтэй нь холбоход туслахын тулд доорх
            мэдээллийг бөглөнө үү
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
                className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                  formData.status === "lost"
                    ? "border-lost bg-lost/10"
                    : "border-card-border hover:border-lost/50"
                }`}
              >
                <div className="text-4xl mb-2">🔍</div>
                <div className="font-bold text-lg">Төөрсөн амьтан</div>
                <p className="text-sm text-muted mt-1">Би амьтнаа хайж байна</p>
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, status: "found" }))
                }
                className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                  formData.status === "found"
                    ? "border-found bg-found/10"
                    : "border-card-border hover:border-found/50"
                }`}
              >
                <div className="text-4xl mb-2">✓</div>
                <div className="font-bold text-lg">Олдсон амьтан</div>
                <p className="text-sm text-muted mt-1">
                  Би төөрсөн амьтан олсон
                </p>
              </button>
            </div>
          </div>

          <div className="bg-card-bg rounded-2xl border border-card-border p-6">
            <h2 className="text-xl font-bold mb-4">Амьтны төрөл</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, type: "dog" }))
                }
                className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
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
                className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
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
                  Амьтны нэр
                  {formData.status === "found" && (
                    <span className="text-muted">(хэрэв мэдвэл)</span>
                  )}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Банхарь Шаариг"
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
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium mb-2"
                >
                  Хүйс
                </label>

                <div className="relative w-full">
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="
      w-full
      h-12
      px-4
      pr-10
      bg-background
      border
      border-card-border
      rounded-xl
      appearance-none
      focus:outline-none
      focus:ring-2
      focus:ring-primary
      focus:border-transparent
    "
                  >
                    <option value="">Сонгоно уу</option>
                    <option value="Male">Эрэгтэй</option>
                    <option value="Female">Эмэгтэй</option>
                    <option value="Unknown">Бусад</option>
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

              <div>
                <label className="block text-sm font-medium mb-2">
                  {formData.status === "lost"
                    ? "Сүүлд харсан огноо"
                    : "Олсон огноо"}
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
                <MapLocationPicker
                  onSelect={(loc) =>
                    setFormData((prev) => ({
                      ...prev,
                      lat: loc.lat,
                      lng: loc.lng,
                      location: loc.address,
                    }))
                  }
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

            <div className="relative">
              {!preview ? (
                <label
                  htmlFor="image-upload"
                  className="border-2 border-dashed border-card-border rounded-xl p-8
                       text-center hover:border-primary/50 transition-colors
                       cursor-pointer block"
                >
                  {!uploading ? (
                    <div>
                      {" "}
                      <div className="text-4xl mb-3">📷</div>
                      <p className="font-medium mb-1">
                        Зураг оруулахын тулд дарна уу
                      </p>
                      <p className="text-xs text-muted mt-2">PNG, JPG</p>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoUpload}
                        ref={inputRef}
                      />
                    </div>
                  ) : (
                    <p className="font-medium">Зураг ачааллаж байна...</p>
                  )}
                </label>
              ) : (
                <div className="relative group">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full max-h-72 object-contain rounded-xl"
                  />

                  {/* Overlay buttons */}
                  <div
                    className="absolute inset-0 bg-black/40 rounded-xl
                         opacity-0 group-hover:opacity-100
                         transition-opacity flex items-center justify-center gap-4"
                  >
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
                    onChange={handleLogoUpload}
                  />
                </div>
              )}
            </div>
          </div>
          {/* Contact Information */}
          <div className="bg-card-bg rounded-2xl border border-card-border p-6">
            <h2 className="text-xl font-bold mb-4">
              Таны холбоо барих мэдээлэл
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Таны нэр
                </label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName!}
                  onChange={handleChange}
                  placeholder="Sunduibazrr"
                  required
                  className="w-full px-4 py-3 bg-background border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Имэйл</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail!}
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
              className="flex-1 px-8 py-4 cursor-pointer bg-primary hover:bg-primary-dark text-white rounded-full font-bold text-lg transition-all hover:shadow-xl hover:shadow-primary/30"
            >
              Мэдээлэл илгээх
            </button>
            <button
              onClick={() => setQuit(true)}
              className="px-8 py-4 bg-card-bg cursor-pointer border border-card-border hover:border-primary text-foreground rounded-full font-bold text-lg transition-all text-center"
            >
              Цуцлах
            </button>
            {quit && (
              <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-9999 flex justify-center items-center">
                <div className="bg-black rounded-lg shadow-lg w-90 h-40">
                  <div className="p-5 flex flex-col justify-center gap-10">
                    <p className="text-white text-[20px] font-semibold">
                      Та гарахдаа итгэлтэй байна уу?
                    </p>
                    <div className="flex gap-8 justify-center">
                      <button
                        onClick={() => setQuit(false)}
                        className="px-6 py-3 rounded-lg shadow-lg cursor-pointer bg-[#e47a3d]"
                      >
                        Зар оруулах
                      </button>
                      <Link href={"/"}>
                        <button className="px-6 py-3 rounded-lg shadow-lg cursor-pointer bg-red-500">
                          Гарах
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
