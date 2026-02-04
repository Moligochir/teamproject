"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "../contexts/Languagecontext";
import { UrcluulehPage } from "../components/urcluuleh";
import { UrclehPage } from "../components/urcleh";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { toast } from "react-hot-toast";

export default function AdoptionPage() {
  const [showPeople, setShowPeople] = useState(false);
  const [Result, setResult] = useState(false);
  const [showAdopt, setShowAdopt] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [selectedType, setSelectedType] = useState<"people" | "adopt" | null>(
    null
  );

  const { language } = useLanguage();
  const { isSignedIn } = useAuth();

  const translations = {
    mn: {
      createPost: "Үрчлүүлэх / Үрчилж авах",
      subheading:
        "Шинэ гэр бүлтэй нь холбохын тулд доорх мэдээллийг бөглөнө үү",
      question: "Та юу хийхийг хүсэж байна вэ?",
      posttype1: "Амьтан үрчлүүлэх",
      posttype2: "Амьтан үрчилж авах",
      dood1: "Амьтанд эзэн хайж байна",
      dood2: "Амьтан үрчилж авмаар байна",
      successTitle: "Мэдээлэл амжилттай илгээгдлээ",
      successButton: "Нүүр хуудас руу буцах",

      // Warning dialog
      warningTitle: "Та нэвтрээгүй байна",
      warningDescription:
        "Үрчлүүлэх / Үрчилж авах мэдээлэл оруулахын тулд та эхлээд нэвтрэх шаардлагатай байна.",
      warningMessage:
        "Ямар ч эзэн байхгүй амьтдыг өнөө мэдээлэлтэй хүмүүст холбоход туслах үүрэг хүлээе.",
      continueButton: "Нэвтрэх",
      cancelButton: "Цуцлах",

      // Additional info
      infoTitle: "Яагаад нэвтрэх шаардлагатай вэ?",
      infoPoint1: "✓ Таны мэдээлэл нарийн хадгалах",
      infoPoint2: "✓ Амьтан сонирхсон хүмүүстэй холбогдох",
      infoPoint3: "✓ Таны мэдээлэлийг удирдах",
    },
    en: {
      createPost: "Give a Pet / Adopt a Pet",
      subheading:
        "Please provide the details below to help them find a loving new home",
      question: "What would you like to do?",
      posttype1: "Give a Pet",
      posttype2: "Adopt a Pet",
      dood1: "Looking for an owner",
      dood2: "Looking to adopt a pet",
      successTitle: "Data submitted successfully",
      successButton: "Go to home page",

      // Warning dialog
      warningTitle: "You are not signed in",
      warningDescription:
        "You need to sign in first to submit pet adoption information.",
      warningMessage:
        "Help us connect pets without owners with the right families.",
      continueButton: "Sign In",
      cancelButton: "Cancel",

      // Additional info
      infoTitle: "Why do I need to sign in?",
      infoPoint1: "✓ Securely save your information",
      infoPoint2: "✓ Connect with interested people",
      infoPoint3: "✓ Manage your listings",
    },
  };

  const t = translations[language];

  // Check auth when component mounts or when clicking adoption options
  const handleAdoptionClick = (type: "people" | "adopt") => {
    if (!isSignedIn) {
      setSelectedType(type);
      setShowWarning(true);
    } else {
      if (type === "people") {
        setShowPeople(true);
        setShowAdopt(false);
      } else {
        setShowAdopt(true);
        setShowPeople(false);
      }
    }
  };

  // Handle sign in confirmation
  const handleSignInConfirm = () => {
    // Show toast message
    toast(
      language === "mn" ? "Та нэвтрэх хуудас руу шилжиж байна..." : "Redirecting to sign in...",
      {
        icon: "🔐",
      }
    );

    // Close warning
    setShowWarning(false);
    setSelectedType(null);

    // Redirect to sign in (you can use Clerk's useClerk hook if needed)
    // For now, just show the warning
  };

  return (
    <>
      {!Result ? (
        <div className="min-h-screen py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {t.createPost}
              </h1>
              <p className="text-muted text-lg max-w-2xl mx-auto">
                {t.subheading}
              </p>
            </div>

            {/* Selection Cards */}
            <div className="bg-card-bg rounded-2xl border border-card-border p-6 mb-8">
              <h2 className="text-xl font-bold mb-6">{t.question}</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Give a Pet */}
                <button
                  type="button"
                  onClick={() => handleAdoptionClick("people")}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer group hover:shadow-lg ${
                    showPeople
                      ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                      : "border-card-border hover:border-primary/50 hover:shadow-md"
                  }`}
                >
                  <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">
                    🐶
                  </div>
                  <div className="font-bold text-lg text-foreground">
                    {t.posttype1}
                  </div>
                  <p className="text-sm text-muted mt-2">{t.dood1}</p>
                </button>

                {/* Adopt a Pet */}
                <button
                  type="button"
                  onClick={() => handleAdoptionClick("adopt")}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer group hover:shadow-lg ${
                    showAdopt
                      ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                      : "border-card-border hover:border-primary/50 hover:shadow-md"
                  }`}
                >
                  <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">
                    🏠
                  </div>
                  <div className="font-bold text-lg text-foreground">
                    {t.posttype2}
                  </div>
                  <p className="text-sm text-muted mt-2">{t.dood2}</p>
                </button>
              </div>
            </div>

            {/* Info Section - Always visible */}
          

            {/* Form Content */}
            {showPeople && (
              <div className="mt-8 animate-fade-up">
                <UrcluulehPage Result={setResult} />
              </div>
            )}

            {showAdopt && (
              <div className="mt-8 animate-fade-up">
                <UrclehPage onChange={() => {}} />
              </div>
            )}
          </div>

          {/* Warning Dialog */}
          {showWarning && !isSignedIn && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-card-bg rounded-2xl shadow-2xl max-w-md w-full border border-card-border overflow-hidden animate-scale-in">
                {/* Header */}
                <div className="bg-linear-to-r from-primary to-primary-dark p-6 text-white">

                  <h2 className="text-2xl font-bold">{t.warningTitle}</h2>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-foreground mb-4">{t.warningDescription}</p>

                
                 

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowWarning(false);
                        setSelectedType(null);
                      }}
                      className="flex-1 cursor-pointer px-4 py-3 border border-card-border text-foreground rounded-lg font-semibold hover:bg-card-border/50 transition-all"
                    >
                      {t.cancelButton}
                    </button>
                    <button
                      onClick={handleSignInConfirm}
                      className="flex-1 px-4 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-all cursor-pointer"
                    >
                      {t.continueButton}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Success Page */
        <div className="min-h-screen py-12 flex items-center justify-center">
          <div className="max-w-md mx-auto text-center px-4">
            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
              <svg
                className="w-12 h-12 text-green-500 animate-pulse"
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
            <h1 className="text-3xl font-bold mb-4 text-green-500">
              {t.successTitle}
            </h1>
            <p className="text-muted mb-8">
              {language === "mn"
                ? "Таны мэдээлэл амжилттай илгээгдлээ. Сонирхсон хүмүүс тантай холбогдох болно."
                : "Your information has been submitted successfully. Interested people will contact you soon."}
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/browse"
                className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-full font-semibold transition-all hover:shadow-lg hover:shadow-primary/30"
              >
                {t.successButton}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}