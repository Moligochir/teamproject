"use client";

import { useEffect, useRef, useState } from "react";
import { ShoppingBag, X } from "lucide-react";
import { useLanguage } from "../contexts/Languagecontext";
import { toast } from "react-hot-toast";

interface Post {
  _id: string;
  ProductName: string;
  ImageURL: string;
  Price: number;
  PhoneNumber: number;
  createdAt: Date;
}

const UPLOAD_PRESET = "Pawpew";
const CLOUD_NAME = "dyduodw7q";

export default function ShopPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [phone, setPhone] = useState("");

  // Error states
  const [nameError, setNameError] = useState("");
  const [imageError, setImageError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const { language } = useLanguage();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Translations
  const translations = {
    mn: {
      title: "Дэлгүүр",
      description: "Олон нийтийн дотор бараа худалдаж авах, зарах",
      createListing: "Шинэ зар үүсгэх",
      productName: "Барааны нэр",
      productNamePlaceholder: "Барааны нэр оруулах",
      productImage: "Барааны зураг",
      uploadImage: "Зураг оруулахын тулд дарна уу",
      price: "Үнэ",
      pricePlaceholder: "₮0.00",
      contactPhone: "Холбоо барих утасны дугаар",
      phonePlaceholder: "+976 XXXX XXXX",
      postListing: "Зар нийтлэх",
      allListings: "Бүх зарууд",
      total: "Нийт",
      items: "бараа",
      noListingsYet: "Зар одоогоор байхгүй байна",
      imageFormats: "PNG, JPG, WEBP",
      createFirst: "Эхний зараа үүсгээрэй!",
      posted: "Нийтлэсэн:",
      needToSell: "Ямар нэг зүйл зарах шаардлагатай байна уу?",
      createConnect: "Зар үүсгэж, худалдан авагчидтай холбогдоорой",
      fillAllFields: "Бүх талбаруудыг бөглөнө үү",
      uploadingPhoto: "Зураг ачааллаж байна...",
      enterProductName: "Барааны нэр оруулна уу",
      uploadProductImage: "Барааны зураг оруулна уу",
      enterPrice: "Үнэ оруулна уу",
      priceOnlyNumbers: "Үнэ зөвхөн тоо байх ёстой",
      enterPhone: "Утасны дугаар оруулна уу",
      phoneOnlyNumbers: "Утасны дугаар зөвхөн тоо байх ёстой",
      postSuccess: "Зар амжилттай нийтлэгдлээ!",
      loading: "Уншиж байна...",
      loadingProducts: "Барааг уншиж байна...",
      error: "Алдаа гарлаа",
      loadError: "Барааг ачааллахад алдаа",
    },
    en: {
      title: "Shop",
      description: "Buy and sell items within the community",
      createListing: "Create New Listing",
      productName: "Product Name",
      productNamePlaceholder: "Product name",
      productImage: "Product Image",
      uploadImage: "Click to upload image",
      price: "Price",
      pricePlaceholder: "₮0.00",
      contactPhone: "Contact Phone Number",
      uploadingPhoto: "Uploading photo...",
      phonePlaceholder: "+976 XXXX XXXX",
      imageFormats: "PNG, JPG, WEBP",
      postListing: "Post Listing",
      allListings: "All Listings",
      total: "Total",
      items: "items",
      noListingsYet: "No Listings Yet",
      createFirst: "Create the first listing to get started!",
      posted: "Posted:",
      needToSell: "Need to Sell Something?",
      createConnect:
        "Create a listing and connect with buyers in your community",
      fillAllFields: "Please fill in all fields",
      enterProductName: "Please enter product name",
      uploadProductImage: "Please upload product image",
      enterPrice: "Please enter price",
      priceOnlyNumbers: "Price should be numbers only",
      enterPhone: "Please enter phone number",
      phoneOnlyNumbers: "Phone number should be numbers only",
      postSuccess: "Listing posted successfully!",
      loading: "Loading...",
      loadingProducts: "Loading products...",
      error: "An error occurred",
      loadError: "Failed to load products",
    },
  };

  const t = translations[language];

  // ✅ Upload to Cloudinary
  const uploadToCloudinary = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error("Cloudinary upload failed");
      }

      const data = await response.json();
      console.log("✅ Image uploaded:", data.secure_url);
      return data.secure_url;
    } catch (error) {
      console.error("❌ Cloudinary upload failed:", error);
      toast.error(
        language === "mn" ? "Зураг ачааллахад алдаа" : "Failed to upload image",
      );
      return null;
    }
  };

  // ✅ Handle Image Upload
  const handleLogoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const url = await uploadToCloudinary(file);
      if (url) {
        setPreview(url);
        setImageError("");
      }
    } catch (err) {
      console.log("Failed to upload logo:", err);
    } finally {
      setUploading(false);
    }
  };

  // ✅ Add Product to Shop
  const AddProduct = async () => {
    try {
      setIsSubmitting(true);

      const payload = {
        ProductName: name,
        ImageURL: preview,
        Price: parseInt(price),
        PhoneNumber: phone,
      };

      console.log("📤 Sending payload:", payload);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/shop`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      console.log(`📊 Response status: ${response.status}`);

      if (!response.ok) {
        const text = await response.text();
        console.error("❌ Server error response:", text.substring(0, 200));
        throw new Error("Failed to add product");
      }

      // ✅ Parse response as text first
      const responseText = await response.text();

      if (!responseText || responseText.trim() === "") {
        console.error("❌ Empty response from server");
        throw new Error("Server returned empty response");
      }

      // ✅ Check if response is JSON
      if (
        responseText.includes("<!DOCTYPE") ||
        responseText.includes("<html")
      ) {
        console.error("❌ Server returned HTML instead of JSON");
        throw new Error("Server error - check backend logs");
      }

      const data = JSON.parse(responseText);
      console.log("✅ Product added:", data);

      // Reset form
      setName("");
      setPreview(null);
      setPrice("");
      setPhone("");
      setNameError("");
      setImageError("");
      setPriceError("");
      setPhoneError("");

      toast.success(t.postSuccess);

      // Reload posts
      await GetProducts();
    } catch (error) {
      console.error("❌ Error adding product:", error);
      toast.error(
        language === "mn" ? "Зар нийтлэхэд алдаа" : "Failed to post listing",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Get All Products - WITH BETTER ERROR HANDLING
  const GetProducts = async () => {
    try {
      setLoading(true);
      console.log("🔄 Fetching from: http://localhost:8000/shop");

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/shop`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      console.log(`📊 Response status: ${res.status}`);

      if (!res.ok) {
        console.warn(`⚠️ Server returned ${res.status}`);
        // Try to get error message
        const errorText = await res.text();
        console.error("Error response:", errorText.substring(0, 200));
        setPosts([]);
        return;
      }

      // ✅ Get response as text first
      const text = await res.text();
      console.log("📨 Raw response (first 200 chars):", text.substring(0, 200));

      if (!text || text.trim() === "") {
        console.log("⚠️ Empty response from server");
        setPosts([]);
        return;
      }

      // ✅ Check if it's HTML instead of JSON
      if (text.includes("<!DOCTYPE") || text.includes("<html")) {
        console.error("❌ ERROR: Server returned HTML instead of JSON!");
        console.error("This means:");
        console.error("1. The /shop endpoint doesn't exist");
        console.error("2. The server crashed");
        console.error("3. The port is wrong");
        toast.error(
          language === "mn"
            ? "Сервер алдаатай байна. Логийг үзнэ үү"
            : "Server error. Check console logs",
        );
        setPosts([]);
        return;
      }

      // ✅ Try to parse JSON
      try {
        const data = JSON.parse(text);
        console.log("✅ Successfully parsed JSON:", data);

        // Handle both array and object response
        const productsList = Array.isArray(data) ? data : data.data || [];
        console.log(`📊 Found ${productsList.length} products`);
        setPosts(productsList);
      } catch (parseErr) {
        console.error("❌ JSON Parse Error:", parseErr);
        console.error("Response text:", text);
        toast.error(
          language === "mn"
            ? "Өгөгдөл боловсруулахад алдаа"
            : "Error parsing data",
        );
        setPosts([]);
      }
    } catch (error) {
      console.error("❌ Fetch Error:", error);
      toast.error(t.loadError);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Load products on mount
  useEffect(() => {
    GetProducts();
  }, []);

  const clearImage = () => {
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  // ✅ Handle Form Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Reset all errors
    setNameError("");
    setImageError("");
    setPriceError("");
    setPhoneError("");

    let hasError = false;

    // Validate product name
    if (!name.trim()) {
      setNameError(t.enterProductName);
      hasError = true;
    }

    // Validate image
    if (!preview) {
      setImageError(t.uploadProductImage);
      hasError = true;
    }

    // Validate price
    if (!price.trim()) {
      setPriceError(t.enterPrice);
      hasError = true;
    } else if (!/^\d+$/.test(price.trim())) {
      setPriceError(t.priceOnlyNumbers);
      hasError = true;
    }

    // Validate phone
    if (!phone.trim()) {
      setPhoneError(t.enterPhone);
      hasError = true;
    } else if (!/^\d+$/.test(phone.trim())) {
      setPhoneError(t.phoneOnlyNumbers);
      hasError = true;
    }

    // If there are any errors, don't submit
    if (hasError) {
      return;
    }

    AddProduct();
  };

  // ✅ ENHANCED LOADING SECTION
  if (loading) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center bg-linear-to-b from-background to-card-bg/50">
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          @keyframes shimmer {
            0% { background-position: -1000px 0; }
            100% { background-position: 1000px 0; }
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          .animate-shimmer {
            animation: shimmer 2s infinite;
            background: linear-gradient(90deg, rgba(0,0,0,0.1) 25%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.1) 75%);
            background-size: 1000px 100%;
          }
        `}</style>

        <div className="text-center max-w-3xl w-full px-4">
          {/* Animated Shopping Bag with Ring */}
          <div className="mb-12 relative w-32 h-32 mx-auto">
            {/* Outer rotating ring */}
            <div
              className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-primary animate-spin"
              style={{ animationDuration: "3s" }}
            ></div>

            {/* Inner rotating ring (opposite direction) */}
            <div
              className="absolute inset-2 rounded-full border-4 border-transparent border-b-orange-500 border-l-orange-500 animate-spin"
              style={{ animationDuration: "2s", animationDirection: "reverse" }}
            ></div>

            {/* Center floating icon */}
            <div className="absolute inset-0 flex items-center justify-center animate-float">
              <ShoppingBag className="w-16 h-16 text-primary" />
            </div>
          </div>

          {/* Loading Text */}
          <div className="mb-8">
            <h2 className="text-3xl font-black mb-3 bg-linear-to-r from-primary to-orange-500 bg-clip-text text-transparent">
              {t.loading}
            </h2>
            <p className="text-lg text-muted mb-4">{t.loadingProducts}</p>

            {/* Animated Dots */}
            <div className="flex justify-center gap-3">
              <div
                className="w-3 h-3 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: "0s" }}
              ></div>
              <div
                className="w-3 h-3 bg-orange-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-3 h-3 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
          </div>

          {/* Skeleton Loading Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-card-bg rounded-2xl border border-card-border overflow-hidden animate-pulse"
                style={{ animationDuration: "2s" }}
              >
                {/* Image Skeleton */}
                <div className="w-full h-48 bg-linear-to-r from-card-border via-card-bg to-card-border animate-shimmer"></div>

                {/* Content Skeleton */}
                <div className="p-4 space-y-3">
                  {/* Title skeleton */}
                  <div className="h-5 bg-linear-to-r from-card-border via-card-bg to-card-border rounded-lg animate-shimmer"></div>

                  {/* Price skeleton */}
                  <div className="h-8 bg-linear-to-r from-primary/30 via-primary/10 to-primary/30 rounded-lg w-1/2 animate-shimmer"></div>

                  {/* Phone skeleton */}
                  <div className="h-4 bg-linear-to-r from-card-border via-card-bg to-card-border rounded animate-shimmer w-2/3"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Fun message */}
          <p className="text-sm text-muted mt-12 font-medium">
            {language === "mn"
              ? " Хүлээнэ үү, гайхалтай зарнууд ирж байна..."
              : " Hang tight, amazing deals are loading..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
            <ShoppingBag className="w-10 h-10" />
            {t.title}
          </h1>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            {t.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Create Post */}
          <div className="lg:col-span-1">
            <div className="bg-card-bg rounded-2xl border border-card-border p-6 sticky top-8">
              <h2 className="text-xl font-semibold mb-4">{t.createListing}</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Product Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-2"
                  >
                    {t.productName}
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setNameError("");
                    }}
                    className={`w-full px-4 py-3 bg-background border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent ${
                      nameError
                        ? "border-red-500 focus:ring-red-500"
                        : "border-card-border focus:ring-primary"
                    }`}
                    placeholder={t.productNamePlaceholder}
                    disabled={isSubmitting}
                  />
                  {nameError && (
                    <p className="text-red-500 text-sm mt-1">{nameError}</p>
                  )}
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t.productImage}
                  </label>

                  {preview ? (
                    <div className="relative">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-xl border-2 border-card-border"
                      />
                      <button
                        type="button"
                        onClick={clearImage}
                        disabled={uploading}
                        className="absolute top-2 right-2 bg-primary text-white p-2 rounded-full hover:bg-primary-dark transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor="image-upload"
                      className={`border-2 border-dashed ${
                        imageError ? "border-red-500" : "border-card-border"
                      } rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer block ${
                        uploading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {!uploading ? (
                        <div>
                          <div className="text-4xl mb-3">📷</div>
                          <p className="font-medium mb-1">{t.uploadImage}</p>
                          <p className="text-xs text-muted mt-2">
                            {t.imageFormats}
                          </p>
                          <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleLogoUpload}
                            ref={inputRef}
                            disabled={uploading}
                          />
                        </div>
                      ) : (
                        <p className="font-medium">{t.uploadingPhoto}</p>
                      )}
                    </label>
                  )}
                  {imageError && (
                    <p className="text-red-500 text-sm mt-1">{imageError}</p>
                  )}
                </div>

                {/* Price */}
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium mb-2"
                  >
                    {t.price}
                  </label>
                  <input
                    type="text"
                    id="price"
                    value={price}
                    onChange={(e) => {
                      setPrice(e.target.value);
                      setPriceError("");
                    }}
                    className={`w-full px-4 py-3 bg-background border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent ${
                      priceError
                        ? "border-red-500 focus:ring-red-500"
                        : "border-card-border focus:ring-primary"
                    }`}
                    placeholder={t.pricePlaceholder}
                    disabled={isSubmitting}
                  />
                  {priceError && (
                    <p className="text-red-500 text-sm mt-1">{priceError}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium mb-2"
                  >
                    {t.contactPhone}
                  </label>
                  <input
                    type="text"
                    id="phone"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setPhoneError("");
                    }}
                    className={`w-full px-4 py-3 bg-background border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent ${
                      phoneError
                        ? "border-red-500 focus:ring-red-500"
                        : "border-card-border focus:ring-primary"
                    }`}
                    placeholder={t.phonePlaceholder}
                    disabled={isSubmitting}
                  />
                  {phoneError && (
                    <p className="text-red-500 text-sm mt-1">{phoneError}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || uploading}
                  className="w-full px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "⏳ " + t.postListing : t.postListing}
                </button>
              </form>
            </div>
          </div>

          {/* Right Side - All Posts */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">{t.allListings}</h2>
              <p className="text-muted">
                {t.total}{" "}
                <span className="font-semibold text-foreground">
                  {posts.length}
                </span>{" "}
                {t.items}
              </p>
            </div>

            {posts.length === 0 ? (
              <div className="text-center py-20 bg-card-bg rounded-2xl border border-card-border">
                <div className="text-6xl mb-4">🛍️</div>
                <h3 className="text-xl font-bold mb-2">{t.noListingsYet}</h3>
                <p className="text-muted mb-6">{t.createFirst}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-sm:grid-cols-2">
                {posts.map((post) => (
                  <div
                    key={post._id}
                    className="bg-card-bg rounded-2xl border border-card-border overflow-hidden hover:shadow-lg transition-all hover:border-primary cursor-pointer"
                  >
                    <img
                      src={post.ImageURL}
                      alt={post.ProductName}
                      className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                    />

                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                        {post.ProductName}
                      </h3>

                      <div className="flex justify-between items-center mb-3">
                        <span className="text-2xl font-bold text-primary">
                          ₮{post.Price.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center text-muted mb-2">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <span className="text-sm">
                          <a
                            href={`tel:${post.PhoneNumber}`}
                            className="hover:text-primary transition-colors cursor-pointer"
                          >
                            {post.PhoneNumber}
                          </a>
                        </span>
                      </div>

                      <div className="text-xs text-muted">
                        {t.posted}{" "}
                        {new Date(post.createdAt).toLocaleDateString(
                          language === "mn" ? "mn-MN" : "en-US",
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center bg-card-bg rounded-2xl border border-card-border p-8">
          <h2 className="text-2xl font-bold mb-3">{t.needToSell}</h2>
          <p className="text-muted mb-6">{t.createConnect}</p>
        </div>
      </div>
    </div>
  );
}
