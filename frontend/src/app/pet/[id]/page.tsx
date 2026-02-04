"use client";
import {
  Copy,
  EmailIcon,
  Facebook,
  Instagram,
  LocationPinIcon,
  PhoneIcon,
  XIcon,
} from "@/app/components/icons";
import { useLanguage } from "@/app/contexts/Languagecontext";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-hot-toast";

type lostFound = {
  role: string;
  userId?: {
    _id: string;
    name: string;
    email: string;
    phonenumber: number;
    clerkId?: string;
  };
  createdAt: any;
  name: string;
  gender: string;
  location: string;
  description: string;
  Date: string;
  petType: string;
  image: string;
  breed: string;
  _id: string;
  phonenumber?: number;
  lat?: number;
  lng?: number;
};

export default function PetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const { language } = useLanguage();
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const [pet, setPet] = useState<lostFound | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [allPets, setAllPets] = useState<lostFound[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  const translations = {
    mn: {
      home: "Нүүр",
      pets: "Амьтад",
      browse: "Үзэх",
      name: "Нэр",
      breed: "Үүлдэр",
      status: "Төлөв",
      type: "Төрөл",
      gender: "Хүйс",
      date: "Огноо",
      location: "Байршил",
      description: "Нэмэлт Тайлбар",
      lost: "Төөрсөн",
      found: "Олдсон",
      lostIcon: "🔍 Төөрсөн",
      foundIcon: "✓ Олдсон",
      dog: "Нохой",
      cat: "Муур",
      contact: "Холбоо барих мэдээлэл",
      reportOwner: "Зар оруулсан",
      email: "Имэйл",
      phone: "Утас",
      emailContact: "Имэйлээр холбогдох",
      phoneContact: "Утсаар залгах",
      messageContact: "Мессеж илгээх",
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
      notFoundTitle: "Амьтан олдсонгүй",
      notFoundDescription:
        "Таны хайж буй амьтан байхгүй эсвэл устгагдсан байна.",
      viewAllPets: "Бүх амьтдыг үзэх",
      loading: "Уншиж байна...",
      save: "💾 Хадгалах",
      saved: "✓ Хадгалагдсан",
      report: "🚩 Мэдээлэх",
      viewOnMap: "Маp дээр үзэх",
      shareStory: "📸 Зургаа илгээх",
      editPost: "✏️ Засах",
      deletePost: "🗑️ Устгах",
      follow: "👤 Дагах",
      following: "✓ Дагаж байна",
      viewSuggestions: "Санал болгосон тохирол үзэх",
      myPost: "👤 Миний зар",
      linkCopied: "Холбоос хуулагдсан!",
      posted: "Нийтлэгдсэн:",
      verified: "✓ Баталгаажсан",
      responseTime: "Хариу үйл ажиллагааны хугацаа",
      fast: "Хурдан",
      goToProfile: "Профайлд очих",
      myPostMessage: "Энэ бол таны зар. Засахыг хүсч байна уу?",
      unknown: "Нэр мэдэгдэхгүй",
    },
    en: {
      home: "Home",
      pets: "Pets",
      browse: "Browse",
      name: "Name",
      breed: "Breed",
      status: "Status",
      type: "Pet Type",
      gender: "Gender",
      date: "Date",
      location: "Location",
      description: "Description",
      lost: "Lost",
      found: "Found",
      lostIcon: "🔍 Lost",
      foundIcon: "✓ Found",
      dog: "Dog",
      cat: "Cat",
      contact: "Contact Information",
      reportOwner: "Report Owner",
      email: "Email",
      phone: "Phone Number",
      emailContact: "Contact via Email",
      phoneContact: "Call Phone",
      messageContact: "Send Message",
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
      notFoundTitle: "Pet Not Found",
      notFoundDescription:
        "The pet you're looking for doesn't exist or has been removed.",
      viewAllPets: "View All Pets",
      loading: "Loading...",
      save: "💾 Save",
      saved: "✓ Saved",
      report: "🚩 Report",
      viewOnMap: "View on Map",
      shareStory: "📸 Share Story",
      editPost: "✏️ Edit Post",
      deletePost: "🗑️ Delete Post",
      follow: "👤 Follow",
      following: "✓ Following",
      viewSuggestions: "View AI Suggestions",
      myPost: "👤 My Post",
      linkCopied: "Link copied to clipboard!",
      posted: "Posted:",
      verified: "✓ Verified",
      responseTime: "Response Time",
      fast: "Fast",
      goToProfile: "Go to Profile",
      myPostMessage: "This is your post. Want to edit it?",
      unknown: "Unknown",
    },
  };

  const t = translations[language];

  const GetPetDetails = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/lostFound/findid/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
        },
      );
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setPet(data[0]);
        // If userId is just an ID string, fetch owner data
        if (typeof data[0].userId === "string") {
          await GetOwnerData(data[0].userId);
        }
      } else {
        setPet(data);
        // If userId is just an ID string, fetch owner data
        if (typeof data.userId === "string") {
          await GetOwnerData(data.userId);
        }
      }
    } catch (err) {
      console.log("Error fetching pet:", err);
    }
  };

  const GetUserData = async () => {
    if (!clerkUser?.id) {
      console.log("❌ No clerkUser.id");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
      });
      const data = await res.json();
      const currentUser = data.find((u: any) => u.clerkId === clerkUser.id);
      if (currentUser) {
        console.log("✅ Current user found:", currentUser);
        setUserData(currentUser);
      } else {
        console.log("❌ Current user not found in database");
      }
    } catch (err) {
      console.log("Error fetching current user data:", err);
    }
  };

  // ✅ Get owner data from pet userId
  const GetOwnerData = async (ownerId: string) => {
    if (!ownerId) {
      console.log("❌ No ownerId provided");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
      });
      const data = await res.json();
      const owner = data.find((u: any) => u._id === ownerId);

      if (owner) {
        console.log("✅ Owner found:", owner);
        // Update pet with full owner data
        setPet((prevPet) => {
          if (prevPet) {
            return {
              ...prevPet,
              userId: {
                _id: owner._id,
                name: owner.name,
                email: owner.email,
                phonenumber: owner.phonenumber,
                clerkId: owner.clerkId,
              },
            };
          }
          return prevPet;
        });
      } else {
        console.log("❌ Owner not found with ID:", ownerId);
      }
    } catch (err) {
      console.log("Error fetching owner data:", err);
    }
  };

  const GetAllPets = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/lostFound`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
        },
      );
      const data = await res.json();
      setAllPets(data);
    } catch (err) {
      console.log("Error fetching pets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (clerkLoaded) {
      if (id) {
        GetPetDetails();
        GetAllPets();
        GetUserData();
        const saved = localStorage.getItem(`saved_${id}`);
        setIsSaved(!!saved);
      }
    }
  }, [id, clerkLoaded]);

  // ✅ FIXED: Better owner detection with multiple checks
  useEffect(() => {
    if (pet && userData) {
      console.log("🔍 DEBUG INFO:");
      console.log("Pet:", pet);
      console.log("Pet userId:", pet.userId);
      console.log("Pet userId._id:", pet.userId?._id);
      console.log("Current user data:", userData);
      console.log("Current user _id:", userData._id);
      console.log("Clerk user ID:", clerkUser?.id);
      
      // ✅ Multiple ways to check if owner - any of these should work
      const isOwnerById = userData._id === pet.userId?._id;
      const isOwnerByEmail = userData.email === pet.userId?.email;
      const isOwnerByClerk = clerkUser?.id === pet.userId?.clerkId;
      
      console.log("Is Owner (by MongoDB ID):", isOwnerById);
      console.log("Is Owner (by Email):", isOwnerByEmail);
      console.log("Is Owner (by Clerk):", isOwnerByClerk);
      
      // Set isOwner to true if ANY check passes
      const ownerCheck = isOwnerById || isOwnerByEmail || isOwnerByClerk;
      console.log("Final IsOwner Result:", ownerCheck);
      setIsOwner(ownerCheck);
    } else {
      setIsOwner(false);
    }
  }, [pet, userData, clerkUser]);

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

  const handleViewSuggestions = async () => {
    if (!pet) {
      console.log("❌ Pet data missing");
      return;
    }

    try {
      console.log("📤 Storing pet data to sessionStorage:", pet);

      sessionStorage.setItem(
        "queryPet",
        JSON.stringify({
          _id: pet._id,
          name: pet.name,
          breed: pet.breed,
          gender: pet.gender,
          petType: pet.petType,
          role: pet.role,
          location: pet.location,
          description: pet.description,
          image: pet.image,
          userId: pet.userId,
          lat: pet.lat,
          lng: pet.lng,
          Date: pet.Date,
          phonenumber: pet.phonenumber,
        }),
      );

      const storedData = sessionStorage.getItem("queryPet");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        console.log("✅ Data stored successfully:", parsedData);
        console.log("✅ Navigating to probability page...");

        router.push(`/probability?petId=${pet._id}`);
      } else {
        console.log("❌ Failed to store data");
      }
    } catch (error) {
      console.error("❌ Error storing pet data:", error);
      toast.error(language === "mn" ? "Алдаа гарлаа" : "Error occurred");
    }
  };

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

  if (loading || !clerkLoaded) {
    return (
      <div className="min-h-screen py-12 bg-linear-to-b from-background to-card-bg/50 flex items-center justify-center">
        <div className="text-center">
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
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center bg-linear-to-b from-background to-card-bg/50">
        <div className="text-center">
          <div className="text-6xl mb-4">🐾</div>
          <h1 className="text-3xl font-bold mb-4">{t.notFoundTitle}</h1>
          <p className="text-muted mb-6">{t.notFoundDescription}</p>
          <Link
            href="/browse"
            className="px-6 py-3 bg-linear-to-r from-orange-500 to-rose-500 hover:shadow-lg text-white rounded-full font-semibold transition-all inline-block"
          >
            {t.viewAllPets}
          </Link>
        </div>
      </div>
    );
  }

  const isLost = pet.role === "Lost" || pet.role === "Төөрсөн";
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
            <li className="text-foreground font-medium">
              {pet.name || t.unknown}
            </li>
          </ol>
        </nav>

        {/* Status Badge */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3 flex-wrap">
            <div
              className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                isLost ? "status-lost" : "status-found"
              }`}
            >
              {isLost ? t.lostIcon : t.foundIcon}
            </div>
            {isOwner && (
              <div className="inline-block px-4 py-2 rounded-full text-sm font-bold bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/50 animate-pulse">
                {t.myPost}
              </div>
            )}
            {pet.userId && (
              <div className="flex items-center gap-2 text-sm text-muted">
                <span>
                  {t.posted} {pet.createdAt.slice(0, 10)}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Image Section */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden border-4 border-gradient-to-br from-orange-500 to-rose-500 shadow-xl">
              <img
                src={pet.image}
                alt={pet.name}
                className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
              />
            </div>

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

          {/* Right: Details Section */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-black mb-2 text-white bg-clip-text">
                {pet.name || t.unknown}
              </h1>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl p-4 border border-primary/20">
                <div className="text-xs text-muted font-semibold mb-1 uppercase">
                  {t.breed}
                </div>
                <p className="text-lg font-bold">{pet.breed}</p>
              </div>
              <div className="rounded-xl p-4 border border-orange-500/20">
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
              <div className="rounded-xl p-4 border border-orange-500/20">
                <div className="text-xs text-muted font-semibold mb-1 uppercase">
                  {t.type}
                </div>
                <p className="text-lg font-bold">{isDog ? t.dog : t.cat}</p>
              </div>
              <div className="rounded-xl p-4 border border-orange-500/20">
                <div className="text-xs text-muted font-semibold mb-1 uppercase">
                  {t.gender}
                </div>
                <p className="text-lg font-bold">
                  {pet.gender === "Male" || pet.gender === "Эр"
                    ? "♂️ " + (language === "mn" ? "Эр" : "Male")
                    : "♀️ " + (language === "mn" ? "Эм" : "Female")}
                </p>
              </div>
            </div>

            <div className="bg-card-bg rounded-xl p-6 border border-card-border">
              <h3 className="font-bold text-lg mb-3">{t.description}</h3>
              <p className="text-muted leading-relaxed">{pet.description}</p>
            </div>

            {/* Contact Section - Show for non-owners */}
            {!isOwner && pet?.userId && (
              <div className="rounded-xl p-6 border-2 border-orange-500/20 backdrop-blur-sm">
                <h3 className="font-bold text-lg mb-4">{t.contact}</h3>
                <div className="space-y-4">
                  {/* Owner Card */}
                  <div className="flex items-center gap-4 p-4 bg-white/50 dark:bg-white/5 rounded-lg backdrop-blur-sm">
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-orange-500 to-rose-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                      {pet.userId?.name && pet.userId.name.length > 0
                        ? pet.userId.name.charAt(0).toUpperCase()
                        : "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-lg">
                        {pet.userId?.name || "Unknown"}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted mt-1">
                        <span>{t.verified}</span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Methods */}
                  <div className="space-y-2">
                    {/* Email */}
                    {pet.userId?.email ? (
                      <a
                        href={`mailto:${pet.userId.email}`}
                        className="flex items-center gap-3 p-3 bg-white/50 dark:bg-white/5 rounded-lg hover:bg-white/70 dark:hover:bg-white/10 transition-all cursor-pointer"
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
                            {pet.userId.email}
                          </div>
                        </div>
                        <span className="text-primary text-sm">→</span>
                      </a>
                    ) : null}

                    {/* Phone */}
                    {pet.userId?.phonenumber || pet?.phonenumber ? (
                      <a
                        href={`tel:${pet.userId?.phonenumber || pet?.phonenumber}`}
                        className="flex items-center gap-3 p-3 bg-white/50 dark:bg-white/5 rounded-lg hover:bg-white/70 dark:hover:bg-white/10 transition-all cursor-pointer"
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
                            {pet.userId?.phonenumber || pet?.phonenumber}
                          </div>
                        </div>
                        <span className="text-primary text-sm">→</span>
                      </a>
                    ) : null}

                    {/* No contact info */}
                    {!pet.userId?.email &&
                      !pet.userId?.phonenumber &&
                      !pet?.phonenumber && (
                        <div className="p-3 bg-orange-500/10 rounded-lg text-orange-600 dark:text-orange-400 text-sm">
                          📞{" "}
                          {language === "mn"
                            ? "Холбоо барих мэдээлэл байхгүй"
                            : "No contact information available"}
                        </div>
                      )}
                  </div>
                </div>
              </div>
            )}

            {/* Owner Section */}
            {isOwner && (
              <div className="rounded-xl p-6 border-2 border-orange-500/20 bg-orange-500/5">
                <h3 className="font-bold text-lg mb-4">{t.myPost}</h3>
                <p className="text-muted mb-6">{t.myPostMessage}</p>
                <Link
                  href="/profile"
                  className="inline-block px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-all cursor-pointer"
                >
                  {t.goToProfile}
                </Link>
              </div>
            )}

            {/* CTA Buttons - Only for non-owners */}
            {!isOwner &&
              pet?.userId &&
              (pet.userId.email ||
                pet.userId.phonenumber ||
                pet.phonenumber) && (
                <div className="flex flex-col gap-3">
                  {pet.userId?.email && (
                    <a
                      href={`mailto:${pet.userId.email}?subject=${isLost ? t.lost : t.found} ${isDog ? t.dog : t.cat}: ${pet.name}`}
                      className="flex justify-center gap-2 items-center px-6 py-4 bg-primary hover:shadow-lg hover:shadow-orange-500/30 text-white rounded-full font-bold text-center transition-all hover:-translate-y-1 active:scale-95 cursor-pointer"
                    >
                      {t.emailContact}
                      <EmailIcon />
                    </a>
                  )}
                  {(pet.userId?.phonenumber || pet.phonenumber) && (
                    <a
                      href={`tel:${pet.userId?.phonenumber || pet.phonenumber}`}
                      className="flex items-center justify-center gap-2 px-6 py-4 bg-card-bg border-2 border-card-border hover:border-primary text-foreground rounded-full font-bold text-center transition-all hover:-translate-y-1 active:scale-95 cursor-pointer"
                    >
                      {t.phoneContact}
                      <PhoneIcon />
                    </a>
                  )}
                </div>
              )}
          </div>
        </div>

        {/* View Suggestions - Only for owners */}
        {isOwner && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={handleViewSuggestions}
              className="px-8 py-4 bg-primary cursor-pointer hover:shadow-lg hover:shadow-orange-500/30 text-white rounded-full font-bold text-lg transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-2"
            >
              {t.viewSuggestions}
            </button>
          </div>
        )}

        {/* Share Section */}
        <div className="mt-12 bg-black-500/10 rounded-2xl border-2 border-orange-500/30 p-8 backdrop-blur-sm text-center">
          <h3 className="font-bold text-2xl mb-3">{t.helpSpread}</h3>
          <p className="text-muted mb-6 text-lg">
            {language === "mn" ? (
              <>
                {t.shareDescription1}{" "}
                <span className="font-bold">{pet.name || "амьтан"}</span>
                {t.shareDescription2} {isLost ? t.returnHome : t.findFamily}{" "}
                {t.shareDescriptionEnd}
              </>
            ) : (
              <>
                {t.shareDescription1}{" "}
                <span className="font-bold">{pet.name || "pet"}</span>{" "}
                {isLost ? t.returnHome : t.findFamily}
              </>
            )}
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <button
              onClick={() => handleShare("facebook")}
              className="px-6 py-3 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white rounded-full font-bold transition-all hover:shadow-lg hover:-translate-y-1 flex items-center gap-2"
            >
              <Facebook />
              Facebook
            </button>
            <button
              onClick={() => handleShare("twitter")}
              className="px-6 py-3 cursor-pointer bg-black hover:bg-gray-800 text-white rounded-full font-bold transition-all hover:shadow-lg hover:-translate-y-1 flex items-center gap-2"
            >
              <XIcon />X
            </button>
            <button
              onClick={() => handleShare("instagram")}
              className="px-6 py-3 cursor-pointer bg-linear-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 text-white rounded-full font-bold transition-all hover:shadow-lg hover:-translate-y-1 flex items-center gap-2"
            >
              <Instagram />
              Instagram
            </button>
            <button
              onClick={() => handleShare("copy")}
              className="px-6 py-3 cursor-pointer bg-gray-600 hover:bg-gray-700 text-white rounded-full font-bold transition-all hover:shadow-lg hover:-translate-y-1 flex items-center gap-2"
            >
              <Copy />
              {t.copyLink}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}