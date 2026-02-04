"use client";

import { useState } from "react";

import { useLanguage } from "../contexts/Languagecontext";
import { UrcluulehPage } from "../components/urcluuleh";
import { UrclehPage } from "../components/urcleh";
import Link from "next/link";

export default function ReportPage() {
  const [showPeople, setShowPeople] = useState(false);
  const [Result, setResult] = useState(false);
  const [showAdopt, setShowAdopt] = useState(false);

  const { language, toggleLanguage } = useLanguage();

  const translations = {
    mn: {
      createPost: "Мэдээлэл оруулах",
      subheading:
        "Шинэ гэр бүлтэй нь холбохын тулд доорх мэдээллийг бөглөнө үү",
      question: "Та юу мэдээлж байна вэ?",
      posttype1: "Амьтан үрчлүүлэх",
      posttype2: "Амьтан үрчилж авах",
      dood1: "Амьтанд эзэн хайж байна",
      dood2: "Амьтан үрчилж авмаар байна",
      successTitle: "Мэдээлэл амжилттай илгээгдлээ",

      successButton: "Нүүр хуудас руу буцах",
    },
    en: {
      createPost: "Submit Report",
      subheading:
        "Please provide the details below to help them find a loving new home",
      question: "What are you reporting?",
      posttype1: "Pet Adopting",
      posttype2: "Adopt a Pet",
      dood1: "Looking for an owner",
      dood2: "Looking to adopt a pet",
      successTitle: "Data submitted successfully",

      successButton: "Go to home page",
    },
  };

  const t = translations[language];

  return (
    <>
      {!Result ? (
        <div className="min-h-screen py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {t.createPost}
              </h1>
              <p className="text-muted text-lg max-w-2xl mx-auto">
                {t.subheading}
              </p>
            </div>

            {/* Status Selection */}
            <div className="bg-card-bg rounded-2xl border border-card-border p-6">
              <h2 className="text-xl font-bold mb-4">{t.question}</h2>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowPeople(true);
                    setShowAdopt(false);
                  }}
                  className={`p-6 rounded-xl border-2 transition-all cursor-pointer ${
                    showPeople
                      ? "border-primary bg-primary/10"
                      : "border-card-border hover:border-primary/50"
                  }`}
                >
                  <div className="text-4xl mb-2">🔍</div>
                  <div className="font-bold text-lg">{t.posttype1}</div>
                  <p className="text-sm text-muted mt-1">{t.dood1}</p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowAdopt(true);
                    setShowPeople(false);
                  }}
                  className={`p-6 rounded-xl border-2 transition-all cursor-pointer ${
                    showAdopt
                      ? "border-primary bg-primary/10"
                      : "border-card-border hover:border-primary/50"
                  }`}
                >
                  <div className="text-4xl mb-2">🏠</div>
                  <div className="font-bold text-lg">{t.posttype2}</div>
                  <p className="text-sm text-muted mt-1">{t.dood2}</p>
                </button>
              </div>
            </div>

            {showPeople && (
              <div className="mt-8">
                <UrcluulehPage Result={setResult} />
              </div>
            )}

            {showAdopt && (
              <div className="mt-8">
                <UrclehPage onChange={() => {}} />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="min-h-screen py-12 flex items-center justify-center">
          <div className="max-w-md mx-auto text-center px-4">
            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-green-500"
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
            <h1 className="text-3xl font-bold mb-4">{t.successTitle}</h1>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/browse"
                className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-full font-semibold transition-all"
              >
                <p className="text-white">{t.successButton}</p>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
