"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
const MapLocationPicker = dynamic(
  () => import("../components/mapLocationPicker"),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 flex items-center justify-center text-muted">
        Газрын зураг ачаалж байна...
      </div>
    ),
  },
);
import { DeleteIcon, EditIcon } from "../components/icons";
import { useUser } from "@clerk/nextjs";
import * as React from "react";
import { useLanguage } from "../contexts/Languagecontext";
import { useNotification } from "../contexts/Notificationcontext";
import { useRouter } from "next/navigation";

type User = {
  _id: string;
  clerkId: string;
  email: string;
  name?: string;
  role?: "ADMIN" | "USER";
  createdAt?: string;
  updatedAt?: string;
};

type MatchData = {
  matchId: string;
  matchScore: number;
  confidence: "HIGH" | "MEDIUM" | "LOW";
};

type MatchResponse = {
  success: boolean;
  data: MatchData[];
  dataLength: number;
};

const BreedData = [
  {
    id: "1",
    Breed: "Golden Retru",
  },
  {
    id: "2",
    Breed: "Golden Retru",
  },
  {
    id: "3",
    Breed: "Golden Retru",
  },
  {
    id: "4",
    Breed: "Golden Retru",
  },
];

const UPLOAD_PRESET = "Pawpew";
const CLOUD_NAME = "dyduodw7q";

export default function ReportPage() {
  const router = useRouter();
  const [usersdata, setUsersData] = useState<User[]>([]);
  const { user } = useUser();
  const { language } = useLanguage();
  const { addNotification } = useNotification();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Translations
  const translations = {
    mn: {
      // Success page
      successTitle: "Мэдээлэл илгээгдлээ!",
      successDescription:
        "Тэжээвэр амьтдыг гэр бүлтэй нь холбоход туслаж байгаад баярлалаа. Таны зарлал удахгүй харагдах болно.",
      viewListings: "Зарлалууд үзэх",
      viewProbability: "Магадлалтай тохирол үзэх",

      // Header
      pageTitle: "Мэдээлэл оруулах",
      pageDescription:
        "Төөрсөн амьтныг гэр бүлтэй нь холбоход туслахын тулд доорх мэдээллийг бөглөнө үү",

      // Status selection
      statusTitle: "Та юу мэдээлж байна вэ?",
      lostPet: "Төөрсөн амьтан",
      lostPetDesc: "Би амьтнаа хайж байна",
      foundPet: "Олдсон амьтан",
      foundPetDesc: "Би төөрсөн амьтан олсон",

      // Pet type
      petTypeTitle: "Амьтны төрөл",
      dog: "Нохой",
      cat: "Муур",

      // Pet details
      petDetailsTitle: "Амьтны мэдээлэл",
      petName: "Амьтны нэр",
      ifKnown: "(хэрэв мэдвэл)",
      petNamePlaceholder: "Банхар, Шаариг",
      breed: "Үүлдэр",
      breedPlaceholder: "Жишээ нь: Алтан ретривер, Сиам",
      gender: "Хүйс",
      selectGender: "Сонгоно уу",
      male: "Эр",
      female: "Эм",
      unknown: "Бусад",
      lastSeenDate: "Сүүлд харсан огноо",
      foundDate: "Олсон огноо",
      lastSeenLocation: "Сүүлд харсан байршил",
      foundLocation: "Олсон байршил",
      description: "Тайлбар",
      descriptionPlaceholder:
        "Амьтныг таних нэмэлт мэдээллийг оруулна уу: хүзүүвч, тэмдэг, зан төлөв, онцлог шинж тэмдэг...",

      // Photo
      photoTitle: "Зураг",
      uploadPhoto: "Зураг оруулахын тулд дарна уу",
      uploadingPhoto: "Зураг ачааллаж байна...",
      imageFormats: "PNG, JPG, WEBP",

      // Contact info
      contactTitle: "Таны холбоо барих мэдээлэл",
      yourName: "Таны нэр",
      namePlaceholder: "Sunduibazrr",
      email: "Имэйл",
      emailPlaceholder: "example@email.com",
      phone: "Утасны дугаар",
      phonePlaceholder: "+976 XXXX XXXX",

      // Buttons
      submit: "Мэдээлэл илгээх",
      submitting: "Илгээж байна...",
      cancel: "Цуцлах",

      // Quit modal
      quitTitle: "Та гарахдаа итгэлтэй байна уу?",
      continueReport: "Зар оруулах",
      quit: "Гарах",

      // Validation errors
      breedRequired: "Үүлдэр оруулах шаардлагатай",
      genderRequired: "Хүйс сонгох шаардлагатай",
      dateRequired: "Огноо сонгох шаардлагатай",
      locationRequired: "Байршил сонгох шаардлагатай",
      descriptionRequired: "Тайлбар оруулах шаардлагатай",
      imageRequired: "Зураг оруулах шаардлагатай",
      nameRequired: "Нэр оруулах шаардлагатай",
      emailRequired: "Имэйл оруулах шаардлагатай",
      emailInvalid: "Зөв имэйл хаяг оруулна уу",
      phoneInvalid: "Утасны дугаар 8 оронтой тоо байх ёстой",

      // Match notifications
      matchFound: "🎉 Тохирол олдлоо!",
      matchFoundDesc: "{breed} үүлдрийн амьтантай {score}% тохирол",
      highConfidence: "Өндөр итгэлцүүрийн",
      mediumConfidence: "Дунд итгэлцүүрийн",
      lowConfidence: "Нам итгэлцүүрийн",
      viewMatches: "Тохирлуудыг үзэх",
      noMatches: "Төөрөлтгүй тохирол олдсонгүй",
      matchesFound: "{count} тохирол олдлоо",
      redirecting: "Тохирлын хуудас руу шилжиж байна...",
    },
    en: {
      // Success page
      successTitle: "Report Submitted!",
      successDescription:
        "Thank you for helping reunite pets with their families. Your listing will be visible shortly.",
      viewListings: "View Listings",
      viewProbability: "View Probability Matches",

      // Header
      pageTitle: "Submit Report",
      pageDescription:
        "Please fill out the information below to help reunite lost pets with their families",

      // Status selection
      statusTitle: "What are you reporting?",
      lostPet: "Lost Pet",
      lostPetDesc: "I'm looking for my pet",
      foundPet: "Found Pet",
      foundPetDesc: "I found a lost pet",

      // Pet type
      petTypeTitle: "Pet Type",
      dog: "Dog",
      cat: "Cat",

      // Pet details
      petDetailsTitle: "Pet Information",
      petName: "Pet Name",
      ifKnown: "(if known)",
      petNamePlaceholder: "Max, Bella",
      breed: "Breed",
      breedPlaceholder: "e.g., Golden Retriever, Siamese",
      gender: "Gender",
      selectGender: "Select",
      male: "Male",
      female: "Female",
      unknown: "Other",
      lastSeenDate: "Last Seen Date",
      foundDate: "Found Date",
      lastSeenLocation: "Last Seen Location",
      foundLocation: "Found Location",
      description: "Description",
      descriptionPlaceholder:
        "Provide additional information to identify the pet: collar, markings, behavior, distinctive features...",

      // Photo
      photoTitle: "Photo",
      uploadPhoto: "Click to upload photo",
      uploadingPhoto: "Uploading photo...",
      imageFormats: "PNG, JPG, WEBP",

      // Contact info
      contactTitle: "Your Contact Information",
      yourName: "Your Name",
      namePlaceholder: "John Doe",
      email: "Email",
      emailPlaceholder: "example@email.com",
      phone: "Phone Number",
      phonePlaceholder: "+976 XXXX XXXX",

      // Buttons
      submit: "Submit Report",
      submitting: "Submitting...",
      cancel: "Cancel",

      // Quit modal
      quitTitle: "Are you sure you want to leave?",
      continueReport: "Continue Report",
      quit: "Leave",

      // Validation errors
      breedRequired: "Breed is required",
      genderRequired: "Gender is required",
      dateRequired: "Date is required",
      locationRequired: "Location is required",
      descriptionRequired: "Description is required",
      imageRequired: "Photo is required",
      nameRequired: "Name is required",
      emailRequired: "Email is required",
      emailInvalid: "Please enter a valid email",
      phoneInvalid: "Phone number must be exactly 8 digits",

      // Match notifications
      matchFound: "🎉 Match Found!",
      matchFoundDesc: "{score}% match with {breed} pet",
      highConfidence: "High confidence",
      mediumConfidence: "Medium confidence",
      lowConfidence: "Low confidence",
      viewMatches: "View Matches",
      noMatches: "No matches found",
      matchesFound: "{count} matches found",
      redirecting: "Redirecting to matches...",
    },
  };

  const t = translations[language];

  const createUser = async () => {
    try {
      const userInfo = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clerkId: user?.id,
            email: user?.primaryEmailAddress?.emailAddress,
            name: user?.fullName,
            role: "USER",
            phonenumber: user?.phoneNumbers[0]?.phoneNumber || "",
          }),
        },
      );
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`, {
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
    lat: null as number | null,
    lng: null as number | null,
    date: "",
    description: "",
    contactName: user?.fullName || "",
    contactEmail: user?.primaryEmailAddress?.emailAddress || "",
    contactPhone: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [quit, setQuit] = useState(false);
  const [match, setMatch] = useState<MatchData[] | null>(null);
  const [redirecting, setRedirecting] = useState(false);
  const [createdPetId, setCreatedPetId] = useState<string | null>(null);

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
        },
      );
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload failed:", error);
    }
  };

  const handleLogoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);

    try {
      const url = await uploadToCloudinary(file);
      setPreview(url);
      setErrors((prev) => ({ ...prev, image: "" }));
      console.log(url);
    } catch (err: unknown) {
      console.log("Failed to upload logo: " + (err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleEdit = () => {
    inputRef.current?.click();
  };

  const handleDelete = () => {
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  // Check if form is valid
  const isFormValid = (): boolean => {
    return (
      formData.breed.trim() !== "" &&
      formData.gender !== "" &&
      formData.date !== "" &&
      formData.location !== "" &&
      formData.description.trim() !== "" &&
      preview !== null &&
      formData.contactName.trim() !== "" &&
      formData.contactEmail.trim() !== "" &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail) &&
      (formData.contactPhone.trim() === "" ||
        formData.contactPhone.replace(/\D/g, "").length === 8)
    );
  };

  // Validation function
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.breed.trim()) {
      newErrors.breed = t.breedRequired;
    }

    if (!formData.gender) {
      newErrors.gender = t.genderRequired;
    }

    if (!formData.date) {
      newErrors.date = t.dateRequired;
    }

    if (!formData.location) {
      newErrors.location = t.locationRequired;
    }

    if (!formData.description.trim()) {
      newErrors.description = t.descriptionRequired;
    }

    if (!preview) {
      newErrors.image = t.imageRequired;
    }

    if (!formData.contactName.trim()) {
      newErrors.contactName = t.nameRequired;
    }

    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = t.emailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = t.emailInvalid;
    }

    if (formData.contactPhone.trim()) {
      const phoneDigits = formData.contactPhone.replace(/\D/g, "");
      if (phoneDigits.length !== 8) {
        newErrors.contactPhone = t.phoneInvalid;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      const firstError = Object.keys(errors)[0];
      const element = document.getElementsByName(firstError)[0];
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    await handleAddChange();
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case "HIGH":
        return "🟢 " + t.highConfidence;
      case "MEDIUM":
        return "🟡 " + t.mediumConfidence;
      case "LOW":
        return "🔴 " + t.lowConfidence;
      default:
        return confidence;
    }
  };

  const handleAddChange = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/lostFound`,
        {
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
            location: formData.location,
            lat: formData.lat,
            lng: formData.lng,
            phonenumber: formData.contactPhone,
            userId: FilterUser?._id || null,
          }),
        },
      );
      const result = await res.json();
      console.log("LostFound create hariu:", result.data);

      const matchesData = result.data || [];
      const petId = result._id;

      setMatch(matchesData);
      setCreatedPetId(petId);

      // Send notifications for matches
      if (matchesData && Array.isArray(matchesData) && matchesData.length > 0) {
        // Main notification showing total matches found
        addNotification({
          type: "match",
          title: t.matchFound,
          description: t.matchesFound.replace(
            "{count}",
            matchesData.length.toString(),
          ),
          icon: "🎯",
          actionUrl: `/probability?petId=${petId}`,
          actionLabel: language === "mn" ? "Үзэх" : "View",
        });

        // Individual notifications for top 3 matches
        matchesData
          .slice(0, 3)
          .forEach((matchItem: MatchData, index: number) => {
            setTimeout(
              () => {
                addNotification({
                  type: "match",
                  title: `${t.matchFound} #${index + 1}`,
                  description: t.matchFoundDesc
                    .replace("{breed}", formData.breed)
                    .replace("{score}", matchItem.matchScore.toString()),
                  icon:
                    matchItem.matchScore >= 80
                      ? "🎯"
                      : matchItem.matchScore >= 60
                        ? "⭐"
                        : "👀",
                  actionUrl: `/pet/${matchItem.matchId}`,
                  actionLabel: language === "mn" ? "Үзэх" : "View",
                  matchScore: matchItem.matchScore,
                });
              },
              (index + 1) * 500,
            );
          });

        // ✅ Auto-redirect to probability page after 2 seconds
        setTimeout(() => {
          setRedirecting(true);
          setTimeout(() => {
            router.push(`/probability?petId=${petId}`);
          }, 1500);
        }, 1000);
      } else {
        // No matches found - show success page
        setTimeout(() => {
          setSubmitted(true);
          setIsSubmitting(false);
        }, 1000);

        // No matches notification
        addNotification({
          type: "info",
          title:
            "📝 " +
            (language === "mn" ? "Мэдээлэл илгээгдлээ" : "Report Submitted"),
          description: t.noMatches,
          icon: "✓",
        });
      }
    } catch (err) {
      console.log(err);
      setIsSubmitting(false);
      addNotification({
        type: "system",
        title: language === "mn" ? "❌ Алдаа" : "❌ Error",
        description:
          language === "mn"
            ? "Мэдээлэл илгээхэд алдаа гарлаа"
            : "Failed to submit report",
        icon: "❌",
      });
    }
  };

  // ✅ Show redirecting screen
  if (redirecting) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center space-y-6 w-full max-w-sm">
          <div className="flex justify-center">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"></div>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">{t.matchFound}</h2>
            <p className="text-muted text-sm sm:text-base">{t.redirecting}</p>
          </div>
          <div className="flex gap-2 justify-center">
            <div
              className="w-2 h-2 bg-primary rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-primary rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-primary rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen py-8 sm:py-12 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 sm:w-12 sm:h-12 text-green-500"
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
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">
            {t.successTitle}
          </h1>
          <p className="text-muted mb-6 sm:mb-8 text-sm sm:text-base">
            {t.successDescription}
          </p>
          {match && match.length > 0 && (
            <div className="mb-6 sm:mb-8 p-4 bg-primary/10 rounded-xl border border-primary/20">
              <p className="text-xs sm:text-sm font-semibold text-primary mb-2">
                {t.matchesFound.replace("{count}", match.length.toString())}
              </p>
              <div className="space-y-2">
                {match.slice(0, 3).map((m, idx) => (
                  <div key={idx} className="text-xs text-muted">
                    <p>
                      Match #{idx + 1}: {m.matchScore}% -{" "}
                      {getConfidenceColor(m.confidence)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex flex-col gap-3">
            <Link
              href="/browse"
              className="w-full px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-full font-semibold transition-all"
            >
              {t.viewListings}
            </Link>

            {createdPetId && (
              <Link
                href={`/probability?petId=${createdPetId}`}
                className="w-full px-6 py-3 bg-card-bg border border-card-border rounded-full font-semibold text-center hover:border-primary transition"
              >
                {t.viewProbability}
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 sm:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
            {t.pageTitle}
          </h1>
          <p className="text-muted text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
            {t.pageDescription}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          {/* Status Selection */}
          <div className="bg-card-bg rounded-2xl border border-card-border p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold mb-4">
              {t.statusTitle}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, status: "lost" }))
                }
                className={`p-4 sm:p-6 rounded-xl border-2 cursor-pointer transition-all ${
                  formData.status === "lost"
                    ? "border-red-500 bg-red-500/10"
                    : "border-card-border hover:border-red-500/50"
                }`}
              >
                <div className="text-3xl sm:text-4xl mb-2">🔍</div>
                <div className="font-bold text-base sm:text-lg">
                  {t.lostPet}
                </div>
                <p className="text-xs sm:text-sm text-muted mt-1">
                  {t.lostPetDesc}
                </p>
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, status: "found" }))
                }
                className={`p-4 sm:p-6 rounded-xl border-2 cursor-pointer transition-all ${
                  formData.status === "found"
                    ? "border-green-500 bg-green-500/10"
                    : "border-card-border hover:border-green-500/50"
                }`}
              >
                <div className="text-3xl sm:text-4xl mb-2">✓</div>
                <div className="font-bold text-base sm:text-lg">
                  {t.foundPet}
                </div>
                <p className="text-xs sm:text-sm text-muted mt-1">
                  {t.foundPetDesc}
                </p>
              </button>
            </div>
          </div>

          {/* Pet Type */}
          <div className="bg-card-bg rounded-2xl border border-card-border p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold mb-4">
              {t.petTypeTitle}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, type: "dog" }))
                }
                className={`p-4 sm:p-6 rounded-xl border-2 cursor-pointer transition-all ${
                  formData.type === "dog"
                    ? "border-primary bg-primary/10"
                    : "border-card-border hover:border-primary/50"
                }`}
              >
                <div className="text-3xl sm:text-4xl mb-2">🐕</div>
                <div className="font-bold text-base sm:text-lg">{t.dog}</div>
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, type: "cat" }))
                }
                className={`p-4 sm:p-6 rounded-xl border-2 cursor-pointer transition-all ${
                  formData.type === "cat"
                    ? "border-primary bg-primary/10"
                    : "border-card-border hover:border-primary/50"
                }`}
              >
                <div className="text-3xl sm:text-4xl mb-2">🐱</div>
                <div className="font-bold text-base sm:text-lg">{t.cat}</div>
              </button>
            </div>
          </div>

          {/* Pet Details */}
          <div className="bg-card-bg rounded-2xl border border-card-border p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold mb-4">
              {t.petDetailsTitle}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-2">
                  {t.petName}
                  {formData.status === "found" && (
                    <span className="text-muted"> {t.ifKnown}</span>
                  )}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t.petNamePlaceholder}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-background border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium mb-2">
                  {t.breed}
                </label>
                <input
                  type="text"
                  name="breed"
                  value={formData.breed}
                  onChange={handleChange}
                  placeholder={t.breedPlaceholder}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-background border ${
                    errors.breed ? "border-red-500" : "border-card-border"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base`}
                />
                {errors.breed && (
                  <p className="mt-1 text-xs sm:text-sm text-red-500">
                    {t.breedRequired}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="gender"
                  className="block text-xs sm:text-sm font-medium mb-2"
                >
                  {t.gender}
                </label>
                <div className="relative w-full">
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={`w-full h-10 sm:h-12 px-3 sm:px-4 pr-8 bg-background border cursor-pointer ${
                      errors.gender ? "border-red-500" : "border-card-border"
                    } rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base`}
                  >
                    <option value="">{t.selectGender}</option>
                    <option value="Male">{t.male}</option>
                    <option value="Female">{t.female}</option>
                    <option value="Unknown">{t.unknown}</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
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
                {errors.gender && (
                  <p className="mt-1 text-xs sm:text-sm text-red-500">
                    {t.genderRequired}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium mb-2">
                  {formData.status === "lost" ? t.lastSeenDate : t.foundDate}
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-background border ${
                    errors.date ? "border-red-500" : "border-card-border"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base`}
                />
                {errors.date && (
                  <p className="mt-1 text-xs sm:text-sm text-red-500">
                    {t.dateRequired}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs sm:text-sm font-medium mb-2">
                  {formData.status === "lost"
                    ? t.lastSeenLocation
                    : t.foundLocation}
                </label>
                <div
                  className={`${
                    errors.location ? "ring-2 ring-red-500 rounded-xl" : ""
                  }`}
                >
                  <MapLocationPicker
                    onSelect={(loc) => {
                      setFormData((prev) => ({
                        ...prev,
                        lat: loc.lat,
                        lng: loc.lng,
                        location: loc.address,
                      }));
                      setErrors((prev) => ({ ...prev, location: "" }));
                    }}
                  />
                </div>
                {errors.location && (
                  <p className="mt-1 text-xs sm:text-sm text-red-500">
                    {t.locationRequired}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs sm:text-sm font-medium mb-2">
                  {t.description}
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder={t.descriptionPlaceholder}
                  rows={3}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-background border ${
                    errors.description ? "border-red-500" : "border-card-border"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-sm sm:text-base`}
                />
                {errors.description && (
                  <p className="mt-1 text-xs sm:text-sm text-red-500">
                    {t.descriptionRequired}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Photo Upload */}
          <div className="bg-card-bg rounded-2xl border border-card-border p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold mb-4">
              {t.photoTitle}
            </h2>
            <div className="relative">
              {!preview ? (
                <label
                  htmlFor="image-upload"
                  className={`border-2 border-dashed ${
                    errors.image ? "border-red-500" : "border-card-border"
                  } rounded-xl p-6 sm:p-8 text-center hover:border-primary/50 transition-colors cursor-pointer block`}
                >
                  {!uploading ? (
                    <div>
                      <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">
                        📷
                      </div>
                      <p className="font-medium text-sm sm:text-base mb-1">
                        {t.uploadPhoto}
                      </p>
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
                      />
                    </div>
                  ) : (
                    <p className="font-medium text-sm sm:text-base">
                      {t.uploadingPhoto}
                    </p>
                  )}
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
                      onClick={handleEdit}
                      className="bg-white p-2 cursor-pointer rounded-full hover:bg-gray-100 transition"
                    >
                      <EditIcon />
                    </button>
                    <button
                      type="button"
                      onClick={handleDelete}
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
                    onChange={handleLogoUpload}
                  />
                </div>
              )}
              {errors.image && (
                <p className="mt-2 text-xs sm:text-sm text-red-500">
                  {t.imageRequired}
                </p>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-card-bg rounded-2xl border border-card-border p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold mb-4">
              {t.contactTitle}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs sm:text-sm font-medium mb-2">
                  {t.yourName}
                </label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName!}
                  onChange={handleChange}
                  placeholder={t.namePlaceholder}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-background border ${
                    errors.contactName ? "border-red-500" : "border-card-border"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base`}
                />
                {errors.contactName && (
                  <p className="mt-1 text-xs sm:text-sm text-red-500">
                    {t.nameRequired}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-2">
                  {t.email}
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail!}
                  onChange={handleChange}
                  placeholder={t.emailPlaceholder}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-background border ${
                    errors.contactEmail
                      ? "border-red-500"
                      : "border-card-border"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base`}
                />
                {errors.contactEmail && (
                  <p className="mt-1 text-xs sm:text-sm text-red-500">
                    {t.emailRequired}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-2">
                  {t.phone}
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone!}
                  onChange={handleChange}
                  placeholder={t.phonePlaceholder}
                  maxLength={8}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-background border ${
                    errors.contactPhone
                      ? "border-red-500"
                      : "border-card-border"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base`}
                />
                {errors.contactPhone && (
                  <p className="mt-1 text-xs sm:text-sm text-red-500">
                    {t.phoneInvalid}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={!isFormValid() || isSubmitting}
              className={`flex-1 px-6 sm:px-8 py-3 sm:py-4 text-white rounded-full font-bold text-sm sm:text-lg transition-all ${
                !isFormValid() || isSubmitting
                  ? "bg-gray-400 cursor-not-allowed opacity-60"
                  : "bg-primary hover:bg-primary-dark cursor-pointer hover:shadow-xl hover:shadow-primary/30"
              } flex items-center justify-center gap-2`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="hidden sm:inline">{t.submitting}</span>
                  <span className="sm:hidden">⏳</span>
                </>
              ) : (
                t.submit
              )}
            </button>
            <button
              type="button"
              onClick={() => setQuit(true)}
              disabled={isSubmitting}
              className={`px-6 sm:px-8 py-3 sm:py-4 border border-card-border text-foreground rounded-full font-bold text-sm sm:text-lg transition-all text-center ${
                isSubmitting
                  ? "bg-gray-200 cursor-not-allowed opacity-60"
                  : "bg-card-bg cursor-pointer hover:border-primary"
              }`}
            >
              {t.cancel}
            </button>
            {quit && (
              <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex justify-center items-center p-4">
                <div className="bg-card-bg rounded-2xl shadow-lg w-full max-w-sm border border-card-border p-6">
                  <div className="flex flex-col gap-6">
                    <p className="text-foreground text-lg sm:text-xl font-semibold">
                      {t.quitTitle}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button
                        onClick={() => setQuit(false)}
                        className="px-6 py-3 rounded-lg shadow-lg cursor-pointer bg-primary hover:bg-primary-dark text-white font-semibold text-sm sm:text-base"
                      >
                        {t.continueReport}
                      </button>
                      <Link href={"/"} className="w-full sm:w-auto">
                        <button className="w-full px-6 py-3 rounded-lg shadow-lg cursor-pointer bg-red-500 hover:bg-red-600 text-white font-semibold text-sm sm:text-base">
                          {t.quit}
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
