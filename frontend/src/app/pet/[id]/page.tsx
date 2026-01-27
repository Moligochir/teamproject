"use client";
import {
  Copy,
  EmailIcon,
  Facebook,
  LocationPinIcon,
  PhoneIcon,
  Twitter,
  Whatsapp,
} from "@/app/components/icons";
import MatchSuggestions from "@/app/components/MatchSuggestions";
import { useLanguage } from "@/app/contexts/Languagecontext";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-hot-toast";

type lostFound = {
  role: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    phonenumber: number;
  };
  name: string;
  gender: string;
  location: string;
  description: string;
  Date: string;
  petType: string;
  image: string;
  breed: string;
  _id: string;
  phonenumber: number;
  lat?: number;
  lng?: number;
};

export default function PetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const { language } = useLanguage();
  const { user: clerkUser } = useUser();
  const [pet, setPet] = useState<lostFound | null>(null);
  const [allPets, setAllPets] = useState<lostFound[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const translations = {
    mn: {
      // Breadcrumb
      home: "Нүүр",
      pets: "Амьтад",
      browse: "Үзэх",

      // Pet info
      name: "Нэр",
      breed: "Үүлдэр",
      status: "Төлөв",
      type: "Төрөл",
      gender: "Хүйс",
      date: "Огноо",
      location: "Байршил",
      description: "Нэмэлт Тайлбар",

      // Status values
      lost: "Төөрсөн",
      found: "Олдсон",
      lostIcon: "🔍 Төөрсөн",
      foundIcon: "✓ Олдсон",

      // Pet type
      dog: "Нохой",
      cat: "Муур",

      // Contact
      contact: "Холбоо барих мэдээлэл",
      reportOwner: "Зар оруулсан",
      email: "Имэйл",
      phone: "Утас",
      emailContact: "Имэйлээр холбогдох",
      phoneContact: "Утсаар залгах",
      messageContact: "Мессеж илгээх",

      // Share section
      helpSpread: "Түгээхэд туслаарай",
      shareDescription1: "Энэ зарлалыг хуваалцаж",
      shareDescription2: "-д",
      returnHome: "гэртээ буцахад",
      findFamily: "гэр бүлээ олоход",
      shareDescriptionEnd: "туслаарай",
      copyLink: "Холбоос хуулах",
      shareFacebook: "Facebook-т хуваалцах",
      shareTwitter: "Twitter-т хуваалцах",
      shareWhatsapp: "WhatsApp-т хуваалцах",

      // Not found
      notFoundTitle: "Амьтан олдсонгүй",
      notFoundDescription:
        "Таны хайж буй амьтан байхгүй эсвэл устгагдсан байна.",
      viewAllPets: "Бүх амьтдыг үзэх",

      // Loading
      loading: "Уншиж байна...",

      // Actions
      save: "💾 Хадгалах",
      saved: "✓ Хадгалагдсан",
      report: "🚩 Мэдээлэх",
      viewOnMap: "Маp дээр үзэх",
      shareStory: "📸 Зургаа илгээх",
      editPost: "✏️ Засах",
      deletePost: "🗑️ Устгах",
      follow: "👤 Дагах",
      following: "✓ Дагаж байна",

      // Gallery
      photoGallery: "Фото галерей",
      previousPhoto: "Өмнөх",
      nextPhoto: "Дараа",

      // Additional info
      additionalInfo: "Нэмэлт мэдээлэл",
      color: "Өнгө",
      size: "Хэмжээ",
      age: "Нас",
      distinguishingFeatures: "Ялгаруулах шинж",

      // Success messages
      linkCopied: "Холбоос хуулагдсан!",
      posted: "нийтлэгдсэн",
      daysAgo: "Өдрийн өмнө",

      // Verification
      verified: "✓ Баталгаажсан",
      responseTime: "Хариу үйл ажиллагааны хугацаа",
      fast: "Хурдан",
    },
    en: {
      // Breadcrumb
      home: "Home",
      pets: "Pets",
      browse: "Browse",

      // Pet info
      name: "Name",
      breed: "Breed",
      status: "Status",
      type: "Pet Type",
      gender: "Gender",
      date: "Date",
      location: "Location",
      description: "Description",

      // Status values
      lost: "Lost",
      found: "Found",
      lostIcon: "🔍 Lost",
      foundIcon: "✓ Found",

      // Pet type
      dog: "Dog",
      cat: "Cat",

      // Contact
      contact: "Contact Information",
      reportOwner: "Report Owner",
      email: "Email",
      phone: "Phone Number",
      emailContact: "Contact via Email",
      phoneContact: "Call Phone",
      messageContact: "Send Message",

      // Share section
      helpSpread: "Help Spread the Word",
      shareDescription1: "Share this listing to help",
      shareDescription2: "",
      returnHome: "return home",
      findFamily: "find a loving family",
      shareDescriptionEnd: "",
      copyLink: "Copy Link",
      shareFacebook: "Share on Facebook",
      shareTwitter: "Share on Twitter",
      shareWhatsapp: "Share on WhatsApp",

      // Not found
      notFoundTitle: "Pet Not Found",
      notFoundDescription:
        "The pet you're looking for doesn't exist or has been removed.",
      viewAllPets: "View All Pets",

      // Loading
      loading: "Loading...",

      // Actions
      save: "💾 Save",
      saved: "✓ Saved",
      report: "🚩 Report",
      viewOnMap: "View on Map",
      shareStory: "📸 Share Story",
      editPost: "✏️ Edit Post",
      deletePost: "🗑️ Delete Post",
      follow: "👤 Follow",
      following: "✓ Following",

      // Gallery
      photoGallery: "Photo Gallery",
      previousPhoto: "Previous",
      nextPhoto: "Next",

      // Additional info
      additionalInfo: "Additional Information",
      color: "Color",
      size: "Size",
      age: "Age",
      distinguishingFeatures: "Distinguishing Features",

      // Success messages
      linkCopied: "Link copied to clipboard!",
      posted: "Posted",
      daysAgo: "days ago",

      // Verification
      verified: "✓ Verified",
      responseTime: "Response Time",
      fast: "Fast",
    },
  };

  const t = translations[language];

  // Fetch pet data
  const GetPetDetails = async () => {
    try {
      const res = await fetch(`http://localhost:8000/lostFound/findid/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
      });
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setPet(data[0]);
      } else {
        setPet(data);
      }
    } catch (err) {
      console.log("Error fetching pet:", err);
    }
  };

  // Fetch all pets for matching
  const GetAllPets = async () => {
    try {
      const res = await fetch(`http://localhost:8000/lostFound`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
      });
      const data = await res.json();
      setAllPets(data);
    } catch (err) {
      console.log("Error fetching pets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      GetPetDetails();
      GetAllPets();

      // Check if saved
      const saved = localStorage.getItem(`saved_${id}`);
      setIsSaved(!!saved);

      // Check if following user
      const following = localStorage.getItem(`following_${pet?.userId?._id}`);
      setIsFollowing(!!following);
    }
  }, [id]);

  // Handle save pet
  const handleSave = () => {
    if (!pet) return;

    if (isSaved) {
      localStorage.removeItem(`saved_${pet._id}`);
      setIsSaved(false);
      toast.success(
        language === "mn"
          ? "Уг амьтан хадгалалтаас хасагдсан"
          : "Pet removed from saved",
      );
    } else {
      localStorage.setItem(`saved_${pet._id}`, JSON.stringify(pet));
      setIsSaved(true);
      toast.success(t.saved);
    }
  };

  // Handle follow user
  const handleFollow = () => {
    if (!pet?.userId?._id) return;

    if (isFollowing) {
      localStorage.removeItem(`following_${pet.userId._id}`);
      setIsFollowing(false);
    } else {
      localStorage.setItem(
        `following_${pet.userId._id}`,
        JSON.stringify(pet.userId),
      );
      setIsFollowing(true);
      toast.success(language === "mn" ? "Дагагдлаа" : "Following");
    }
  };

  // Handle share
  const handleShare = (platform: string) => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text = `Check out this ${pet?.role.toLowerCase()} ${pet?.petType.toLowerCase()}: ${pet?.name}`;

    switch (platform) {
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          "_blank",
        );
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
          "_blank",
        );
        break;
      case "whatsapp":
        window.open(
          `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
          "_blank",
        );
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        toast.success(t.linkCopied);
        break;
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen py-12 bg-gradient-to-b from-background to-card-bg/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Loading Animation */}
          <div className="mb-8 text-center">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 flex items-center justify-center animate-pulse">
                <svg
                  className="w-20 h-20 text-primary"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-7 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm14 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM5.5 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm13 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
              </div>
              <div className="absolute inset-0">
                <div className="w-full h-full border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 animate-pulse">
              {t.loading}
            </h3>

            <div className="flex justify-center gap-1.5">
              <span
                className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></span>
              <span
                className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></span>
              <span
                className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></span>
            </div>
          </div>

          {/* Skeleton Layout */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Image Skeleton */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 animate-pulse"></div>
            </div>

            {/* Details Skeleton */}
            <div className="space-y-6">
              {/* Name & Breed */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card-bg rounded-xl p-4 border border-card-border animate-pulse">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
                <div className="bg-card-bg rounded-xl p-4 border border-card-border animate-pulse">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              </div>

              {/* Quick Info Skeleton */}
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="bg-card-bg rounded-xl p-4 border border-card-border animate-pulse"
                  >
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                    <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                  </div>
                ))}
              </div>

              {/* Location Skeleton */}
              <div className="bg-card-bg rounded-xl p-4 border border-card-border animate-pulse">
                <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
              </div>

              {/* Description Skeleton */}
              <div className="bg-card-bg rounded-xl p-4 border border-card-border animate-pulse">
                <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-3"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-4/6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not Found State
  if (!pet) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center bg-gradient-to-b from-background to-card-bg/50">
        <div className="text-center">
          <div className="text-6xl mb-4">🐾</div>
          <h1 className="text-3xl font-bold mb-4">{t.notFoundTitle}</h1>
          <p className="text-muted mb-6">{t.notFoundDescription}</p>
          <Link
            href="/browse"
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-rose-500 hover:shadow-lg text-white rounded-full font-semibold transition-all inline-block"
          >
            {t.viewAllPets}
          </Link>
        </div>
      </div>
    );
  }

  const isLost = pet.role === "Lost";
  const isDog = pet.petType === "Dog";

  const today = new Date();
  const petDate = new Date(pet.Date);

  today.setHours(0, 0, 0, 0);
  petDate.setHours(0, 0, 0, 0);

  const daysAgo = Math.floor(
    (today.getTime() - petDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  return (
    <div className="min-h-screen py-12 bg-linear-to-b from-background to-card-bg/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-muted">
            <li>
              <Link href="/" className="hover:text-primary transition-colors">
                {t.home}
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link
                href="/browse"
                className="hover:text-primary transition-colors"
              >
                {t.browse}
              </Link>
            </li>
            <li>/</li>
            <li className="text-foreground font-medium">{pet.name}</li>
          </ol>
        </nav>

        {/* Status Badge */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                isLost
                  ? "bg-red-500/20 text-red-500 border border-red-500/50"
                  : "bg-green-500/20 text-green-500 border border-green-500/50"
              }`}
            >
              {isLost ? t.lostIcon : t.foundIcon}
            </div>
            {pet.userId && (
              <div className="flex items-center gap-2 text-sm text-muted">
                <span>
                  {daysAgo} {t.daysAgo} {t.posted}
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden border-4 border-gradient-to-br from-orange-500 to-rose-500 shadow-xl">
              <img
                src={pet.image}
                alt={pet.name}
                className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Location Map Preview */}
            <div className="bg-card-bg rounded-2xl border border-card-border p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold flex items-center gap-2">
                  <LocationPinIcon />
                  {pet.location}
                </h3>
                <Link
                  href={`/map?lat=${pet.lat || 47.9}&lng=${pet.lng || 106.9}`}
                  className="text-sm text-primary hover:text-primary-dark font-semibold"
                >
                  {t.viewOnMap} →
                </Link>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Name & Key Info */}
            <div className="space-y-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-black mb-2 text-white bg-clip-text ">
                  {pet.name}
                </h1>
              </div>
            </div>

            {/* Quick Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className=" rounded-xl p-4 border border-primary/20">
                <div className="text-xs text-muted font-semibold mb-1 uppercase">
                  {t.breed}
                </div>
                <p className="text-lg font-bold">{pet.breed}</p>
              </div>
              <div className=" rounded-xl p-4 border border-orange-500/20">
                <div className="text-xs text-muted font-semibold mb-1 uppercase">
                  {t.status}
                </div>
                <p
                  className={`text-lg font-bold ${
                    isLost ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {isLost ? t.lost : t.found}
                </p>
              </div>
              <div className=" rounded-xl p-4 border border-orange-500/20">
                <div className="text-xs text-muted font-semibold mb-1 uppercase">
                  {t.type}
                </div>
                <p className="text-lg font-bold">{isDog ? t.dog : t.cat}</p>
              </div>
              <div className=" rounded-xl p-4 border border-orange-500/20">
                <div className="text-xs text-muted font-semibold mb-1 uppercase">
                  {t.gender}
                </div>
                <p className="text-lg font-bold">
                  {pet.gender === "Male" || pet.gender === "Эрэгтэй"
                    ? "♂️ " + (language === "mn" ? "Эрэгтэй" : "Male")
                    : "♀️ " + (language === "mn" ? "Эмэгтэй" : "Female")}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-card-bg rounded-xl p-6 border border-card-border">
              <h3 className="font-bold text-lg mb-3">{t.description}</h3>
              <p className="text-muted leading-relaxed">{pet.description}</p>
            </div>

            {/* Contact Section */}
            <div className=" rounded-xl p-6 border-2 border-orange-500/20 backdrop-blur-sm">
              <h3 className="font-bold text-lg mb-4">{t.contact}</h3>
              <div className="space-y-4">
                {/* Owner Card */}
                <div className="flex items-center gap-4 p-4 bg-white/50 dark:bg-white/5 rounded-lg backdrop-blur-sm">
                  <div className="w-12 h-12 rounded-full bg-linear-to-br from-orange-500 to-rose-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                    {pet.userId?.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-lg">{pet.userId?.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted mt-1">
                      <span> {t.verified}</span>
                    </div>
                  </div>
                </div>

                {/* Contact Methods */}
                <div className="space-y-2">
                  <a
                    href={`mailto:${pet.userId?.email}`}
                    className="flex items-center gap-3 p-3 bg-white/50 dark:bg-white/5 rounded-lg hover:bg-white/70 dark:hover:bg-white/10 transition-all"
                  >
                    <svg
                      className="w-5 h-5 text-primary shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-muted">{t.email}</div>
                      <div className="font-semibold truncate">
                        {pet.userId?.email}
                      </div>
                    </div>
                    <span className="text-primary text-sm">→</span>
                  </a>

                  <a
                    href={`tel:${pet.phonenumber || pet.userId?.phonenumber}`}
                    className="flex items-center gap-3 p-3 bg-white/50 dark:bg-white/5 rounded-lg hover:bg-white/70 dark:hover:bg-white/10 transition-all"
                  >
                    <svg
                      className="w-5 h-5 text-primary shrink-0"
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
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-muted">{t.phone}</div>
                      <div className="font-semibold">
                        {pet.phonenumber || pet.userId?.phonenumber}
                      </div>
                    </div>
                    <span className="text-primary text-sm">→</span>
                  </a>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={`mailto:${pet.userId?.email}?subject=${isLost ? t.lost : t.found} ${isDog ? t.dog : t.cat}: ${pet.name}`}
                className="flex gap-2 items-center px-6 py-4 bg-primary hover:shadow-lg hover:shadow-orange-500/30 text-white rounded-full font-bold text-center transition-all hover:-translate-y-1 active:scale-95"
              >
                {t.emailContact}
                <span>
                  <EmailIcon />
                </span>
              </a>
              <a
                href={`tel:${pet.phonenumber || pet.userId?.phonenumber}`}
                className="flex items-center gap-2 px-6 py-4 bg-card-bg border-2 border-card-border hover:border-primary text-foreground rounded-full font-bold text-center transition-all hover:-translate-y-1 active:scale-95"
              >
                {t.phoneContact}
                <span>
                  <PhoneIcon />
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* AI Match Suggestions */}
        <div className="mt-12 bg-card-bg rounded-2xl border border-card-border p-8">
          <MatchSuggestions
            petId={pet._id}
            petRole={pet.role}
            allPets={allPets}
          />
        </div>

        {/* Share Section */}
        <div className="mt-12 bg-black-500/10 rounded-2xl border-2 border-orange-500/30 p-8 backdrop-blur-sm text-center">
          <h3 className="font-bold text-2xl mb-3">{t.helpSpread}</h3>
          <p className="text-muted mb-6 text-lg">
            {language === "mn" ? (
              <>
                {t.shareDescription1}{" "}
                <span className="font-bold">{pet.userId?.name}</span>
                {t.shareDescription2} {isLost ? t.returnHome : t.findFamily}{" "}
                {t.shareDescriptionEnd}
              </>
            ) : (
              <>
                {t.shareDescription1}{" "}
                <span className="font-bold">{pet.userId?.name}</span>{" "}
                {isLost ? t.returnHome : t.findFamily}
              </>
            )}
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <button
              onClick={() => handleShare("facebook")}
              className="px-6 py-3 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white rounded-full font-bold transition-all hover:shadow-lg hover:-translate-y-1 flex items-center gap-2"
              title={t.shareFacebook}
            >
              <Facebook />
              Facebook
            </button>
            <button
              onClick={() => handleShare("twitter")}
              className="px-6 py-3 cursor-pointer bg-sky-500 hover:bg-sky-600 text-white rounded-full font-bold transition-all hover:shadow-lg hover:-translate-y-1 flex items-center gap-2"
              title={t.shareTwitter}
            >
              <Twitter />
              Twitter
            </button>
            <button
              onClick={() => handleShare("whatsapp")}
              className="px-6 py-3 cursor-pointer bg-green-500 hover:bg-green-600 text-white rounded-full font-bold transition-all hover:shadow-lg hover:-translate-y-1 flex items-center gap-2"
              title={t.shareWhatsapp}
            >
              <Whatsapp />
              WhatsApp
            </button>
            <button
              onClick={() => handleShare("copy")}
              className="px-6 py-3 cursor-pointer bg-gray-600 hover:bg-gray-700 text-white rounded-full font-bold transition-all hover:shadow-lg hover:-translate-y-1 flex items-center gap-2"
              title={t.copyLink}
            >
              <Copy />
              {t.copyLink}
            </button>
          </div>

          {/* Social Stats */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-orange-500/20">
            <div>
              <p className="text-2xl font-bold text-orange-500">1.2K</p>
              <p className="text-xs text-muted">
                {language === "mn" ? "Харагдсан" : "Views"}
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-rose-500">48</p>
              <p className="text-xs text-muted">
                {language === "mn" ? "Хуваалцсан" : "Shares"}
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">156</p>
              <p className="text-xs text-muted">
                {language === "mn" ? "Сэтгэгдэл" : "Comments"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
