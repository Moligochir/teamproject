"use client";
import { Copy, Facebook, Twitter, Whatsapp } from "@/app/components/icons";
import { useLanguage } from "@/app/contexts/Languagecontext";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type lostFound = {
  role: string;
  userId: {
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
};

export default function PetDetailPage() {
  const params = useParams();
  const { id } = params;
  const { language } = useLanguage();

  const translations = {
    mn: {
      // Breadcrumb
      home: "Нүүр",
      pets: "Амьтад",

      // Pet info
      name: "Нэр",
      breed: "Үүлдэр",
      status: "Төлөв",
      type: "Төрөл",
      gender: "Хүйс",
      date: "Огноо",
      location: "Байршил",
      description: "Тайлбар",

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

      // Share section
      helpSpread: "Түгээхэд туслаарай",
      shareDescription1: "Энэ зарлалыг хуваалцаж",
      shareDescription2: "-д",
      returnHome: "гэртээ буцахад",
      findFamily: "гэр бүлээ олоход",
      shareDescriptionEnd: "туслаарай",

      // Not found
      notFoundTitle: "Амьтан олдсонгүй",
      notFoundDescription:
        "Таны хайж буй амьтан байхгүй эсвэл устгагдсан байна.",
      viewAllPets: "Бүх амьтдыг үзэх",

      // Email subject
      emailSubject: "амьтны талаар",
    },
    en: {
      // Breadcrumb
      home: "Home",
      pets: "Pets",

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

      // Share section
      helpSpread: "Help Spread the Word",
      shareDescription1: "Share this listing to help",
      shareDescription2: "",
      returnHome: "return home",
      findFamily: "find a loving family",
      shareDescriptionEnd: "",

      // Not found
      notFoundTitle: "Pet Not Found",
      notFoundDescription:
        "The pet you're looking for doesn't exist or has been removed.",
      viewAllPets: "View All Pets",

      // Email subject
      emailSubject: "about",
    },
  };

  const t = translations[language];

  const [animalData, setAnimalData] = useState<lostFound[]>([]);

  const GetLostFound = async () => {
    try {
      const res = await fetch(`http://localhost:8000/lostFound/findid/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
      });
      const data = await res.json();
      console.log("User data:", data);
      setAnimalData(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    GetLostFound();
  }, []);

  if (!id || animalData.length === 0) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🐾</div>
          <h1 className="text-3xl font-bold mb-4">{t.notFoundTitle}</h1>
          <p className="text-muted mb-6">{t.notFoundDescription}</p>
          <Link
            href="/browse"
            className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-full font-semibold transition-all"
          >
            {t.viewAllPets}
          </Link>
        </div>
      </div>
    );
  }

  const pet = animalData[0];
  const isLost = pet?.role === "Lost";
  const isDog = pet?.petType === "Dog";

  return (
    <div className="min-h-screen py-12">
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
                {t.pets}
              </Link>
            </li>
            <li>/</li>
            <li className="text-foreground font-medium">{pet?.name}</li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden border border-card-border">
              <img
                src={pet?.image}
                alt={pet?.name}
                className="object-cover w-full h-full"
              />
              <div
                className={`absolute top-4 left-4 px-4 py-2 rounded-full text-sm font-bold ${
                  isLost ? "status-lost" : "status-found"
                }`}
              >
                {isLost ? t.lostIcon : t.foundIcon}
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Name & Breed */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card-bg rounded-xl p-4 border border-card-border">
                <div className="text-sm text-muted mb-1">{t.name}</div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="font-bold">{pet?.name}</h1>
                </div>
              </div>
              <div className="bg-card-bg rounded-xl p-4 border border-card-border">
                <div className="text-sm text-muted mb-1">{t.breed}</div>
                <p className="text-white font-bold">{pet?.breed}</p>
              </div>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card-bg rounded-xl p-4 border border-card-border">
                <div className="text-sm text-muted mb-1">{t.status}</div>
                <div
                  className={`font-bold ${isLost ? "text-lost" : "text-found"}`}
                >
                  {isLost ? t.lost : t.found}
                </div>
              </div>
              <div className="bg-card-bg rounded-xl p-4 border border-card-border">
                <div className="text-sm text-muted mb-1">{t.type}</div>
                <div className="font-bold">{isDog ? t.dog : t.cat}</div>
              </div>
              <div className="bg-card-bg rounded-xl p-4 border border-card-border">
                <div className="text-sm text-muted mb-1">{t.gender}</div>
                <div className="font-bold">{pet?.gender}</div>
              </div>
              <div className="bg-card-bg rounded-xl p-4 border border-card-border">
                <div className="text-sm text-muted mb-1">{t.date}</div>
                <div className="font-bold">{pet?.Date?.slice(0, 10)}</div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-card-bg rounded-xl p-4 border border-card-border">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-sm text-muted">{t.location}</span>
              </div>
              <div className="font-bold text-lg">{pet?.location}</div>
            </div>

            {/* Description */}
            <div className="bg-card-bg rounded-xl p-4 border border-card-border">
              <h3 className="font-bold mb-2">{t.description}</h3>
              <p className="text-muted leading-relaxed">{pet?.description}</p>
            </div>

            {/* Contact Section */}
            <div className="bg-linear-to-br from-primary/10 to-secondary/10 rounded-xl p-6 border border-primary/20">
              <h3 className="font-bold text-lg mb-4">{t.contact}</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-muted">{t.reportOwner}</div>
                    <div className="font-medium">{pet?.userId?.name}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-primary"
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
                  </div>
                  <div>
                    <div className="text-sm text-muted">{t.email}</div>
                    <a
                      href={`mailto:${pet?.userId?.email}`}
                      className="font-medium text-primary hover:text-primary-dark transition-colors"
                    >
                      {pet?.userId?.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-primary"
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
                  </div>
                  <div>
                    <div className="text-sm text-muted">{t.phone}</div>
                    <a
                      href={`tel:${pet?.phonenumber}`}
                      className="font-medium text-primary hover:text-primary-dark transition-colors"
                    >
                      {pet?.phonenumber}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={`mailto:${pet?.userId?.email}?subject=${isLost ? t.lost : t.found} ${isDog ? t.dog : t.cat}: ${pet?.name}`}
                className="flex-1 px-6 py-4 bg-primary hover:bg-primary-dark text-white rounded-full font-bold text-center transition-all hover:shadow-xl hover:shadow-primary/30"
              >
                {t.emailContact}
              </a>
              <a
                href={`tel:${pet?.phonenumber}`}
                className="flex-1 px-6 py-4 bg-card-bg border-2 border-card-border hover:border-primary text-foreground rounded-full font-bold text-center transition-all"
              >
                {t.phoneContact}
              </a>
            </div>
          </div>
        </div>

        {/* Share Section */}
        <div className="mt-12 bg-card-bg rounded-2xl border border-card-border p-6 text-center">
          <h3 className="font-bold text-lg mb-3">{t.helpSpread}</h3>
          <p className="text-muted mb-4">
            {language === "mn" ? (
              <>
                {t.shareDescription1} {pet?.userId?.name}
                {t.shareDescription2} {isLost ? t.returnHome : t.findFamily}{" "}
                {t.shareDescriptionEnd}
              </>
            ) : (
              <>
                {t.shareDescription1} {pet?.userId?.name}{" "}
                {isLost ? t.returnHome : t.findFamily}
              </>
            )}
          </p>
          <div className="flex justify-center gap-4">
            <button className="w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors">
              <Facebook />
            </button>
            <button className="w-12 h-12 bg-sky-500 hover:bg-sky-600 text-white rounded-full flex items-center justify-center transition-colors">
              <Twitter />
            </button>
            <button className="w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center transition-colors">
              <Whatsapp />
            </button>
            <button className="w-12 h-12 bg-gray-600 hover:bg-gray-700 text-white rounded-full flex items-center justify-center transition-colors">
              <Copy />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
