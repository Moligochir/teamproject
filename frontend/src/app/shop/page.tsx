"use client";

import { useState } from "react";
import { ShoppingBag, Upload, X } from "lucide-react";
import { useLanguage } from "../contexts/Languagecontext";

interface Post {
  id: number;
  name: string;
  image: string;
  price: number;
  phone: string;
  createdAt: Date;
}

export default function ShopPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [name, setName] = useState("");
  const [image, setImage] = useState<string>("");
  const [price, setPrice] = useState("");
  const [phone, setPhone] = useState("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [postShop, setPostShop] = useState("");

  // Error states
  const [nameError, setNameError] = useState("");
  const [imageError, setImageError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const { language } = useLanguage();

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
      createFirst: "Эхний зараа үүсгээрэй!",
      posted: "Нийтэлсэн",
      needToSell: "Ямар нэг зүйл зарах шаардлагатай байна уу?",
      createConnect: "Зар үүсгэж, худалдан авагчидтай холбогдоорой",
      fillAllFields: "Бүх талбаруудыг бөглөнө үү",
      enterProductName: "Барааны нэр оруулна уу",
      uploadProductImage: "Барааны зураг оруулна уу",
      enterPrice: "Үнэ оруулна уу",
      priceOnlyNumbers: "Үнэ зөвхөн тоо байх ёстой",
      enterPhone: "Утасны дугаар оруулна уу",
      phoneOnlyNumbers: "Утасны дугаар зөвхөн тоо байх ёстой",
      postSuccess: "Зар амжилттай нийтлэгдлээ!",
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
      phonePlaceholder: "+976 XXXX XXXX",
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
    },
  };

  const t = translations[language];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImage(result);
        setImagePreview(result);
        setImageError(""); // Clear error when image is uploaded
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImage("");
    setImagePreview("");
  };

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
    if (!image) {
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

    const newPost: Post = {
      id: Date.now(),
      name: name.trim(),
      image,
      price: Number(price.trim()),
      phone: phone.trim(),
      createdAt: new Date(),
    };

    setPosts([newPost, ...posts]);

    // Clear form
    setName("");
    setImage("");
    setPrice("");
    setPhone("");
    setImagePreview("");
  };

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
                      setNameError(""); // Clear error on change
                    }}
                    className={`w-full px-4 py-3 bg-background border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent ${
                      nameError
                        ? "border-red-500 focus:ring-red-500"
                        : "border-card-border focus:ring-primary"
                    }`}
                    placeholder={t.productNamePlaceholder}
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

                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-xl border-2 border-card-border"
                      />
                      <button
                        type="button"
                        onClick={clearImage}
                        className="absolute top-2 right-2 bg-primary text-white p-2 rounded-full hover:bg-primary-dark transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label
                      className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer hover:bg-background transition-colors ${
                        imageError ? "border-red-500" : "border-card-border"
                      }`}
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-10 h-10 text-muted mb-2" />
                        <p className="text-sm text-muted">{t.uploadImage}</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
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
                      setPriceError(""); // Clear error on change
                    }}
                    className={`w-full px-4 py-3 bg-background border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent ${
                      priceError
                        ? "border-red-500 focus:ring-red-500"
                        : "border-card-border focus:ring-primary"
                    }`}
                    placeholder={t.pricePlaceholder}
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
                      setPhoneError(""); // Clear error on change
                    }}
                    className={`w-full px-4 py-3 bg-background border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent ${
                      phoneError
                        ? "border-red-500 focus:ring-red-500"
                        : "border-card-border focus:ring-primary"
                    }`}
                    placeholder={t.phonePlaceholder}
                  />
                  {phoneError && (
                    <p className="text-red-500 text-sm mt-1">{phoneError}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold transition-all cursor-pointer"
                >
                  {t.postListing}
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
                    key={post.id}
                    className="bg-card-bg rounded-2xl border border-card-border overflow-hidden hover:shadow-lg transition-all hover:border-primary"
                  >
                    <img
                      src={post.image}
                      alt={post.name}
                      className="w-full h-48 object-cover"
                    />

                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2">
                        {post.name}
                      </h3>

                      <div className="flex justify-between items-center mb-3">
                        <span className="text-2xl font-bold text-primary">
                          ₮{post.price.toLocaleString()}
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
                        <span className="text-sm">{post.phone}</span>
                      </div>

                      <div className="text-xs text-muted">
                        {t.posted} {post.createdAt.toLocaleString()}
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
