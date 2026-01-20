"use client";

import { useState } from "react";
import { UrclehPage } from "../components/adopt";
import { UrcluulehPage } from "../components/people";
import { useLanguage } from "../contexts/Languagecontext";

export default function ReportPage() {
  const [showPeople, setShowPeople] = useState(false);

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
    },
  };

  const t = translations[language];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t.createPost}
          </h1>
          <p className="text-muted text-lg max-w-2xl mx-auto">{t.subheading}</p>
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
            <UrcluulehPage />
          </div>
        )}

        {showAdopt && (
          <div className="mt-8">
            <UrclehPage />
          </div>
        )}
      </div>
    </div>
  );
}
