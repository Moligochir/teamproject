"use client";

import { useEffect, useRef, useState } from "react";
import { ShoppingBag, Upload, X } from "lucide-react";
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
      posted: "Нийтэлсэн",
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
      error: "Алдаа гарлаа",
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
      posted: "Posted",
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
      error: "An error occurred",
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

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Server error:", errorData);
        throw new Error(errorData.message || "Failed to add product");
      }

      const data = await response.json();
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

  // ✅ Get All Products
  const GetProducts = async () => {
    try {
      setLoading(true);
      console.log("🔄 Fetching products...");

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/shop`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
      });

      if (!res.ok) {
        console.warn(`⚠️ Server returned ${res.status}`);
        // Don't throw, just set empty posts
        setPosts([]);
        return;
      }

      const data = await res.json();
      console.log("✅ Products fetched:", data);

      // Handle both array and object response
      const productsList = Array.isArray(data) ? data : data.data || [];
      setPosts(productsList);
    } catch (error) {
      console.error("❌ Error fetching products:", error);
      // Set empty posts on error
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

    // Validate price - check if empty
    if (!price.trim()) {
      setPriceError(t.enterPrice);
      hasError = true;
    } else if (!/^\d+$/.test(price.trim())) {
      // Validate price - check if it's only numbers
      setPriceError(t.priceOnlyNumbers);
      hasError = true;
    }

    // Validate phone - check if empty
    if (!phone.trim()) {
      setPhoneError(t.enterPhone);
      hasError = true;
    } else if (!/^\d+$/.test(phone.trim())) {
      // Validate phone - check if it's only numbers
      setPhoneError(t.phoneOnlyNumbers);
      hasError = true;
    }

    // If there are any errors, don't submit
    if (hasError) {
      return;
    }

    AddProduct();
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted">{t.loading}</p>
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
                        className="absolute top-2 right-2 bg-primary text-white p-2 rounded-full hover:bg-primary-dark transition-colors disabled:opacity-50"
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            className="hover:text-primary transition-colors"
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
