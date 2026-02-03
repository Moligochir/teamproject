"use client";

import { useState } from "react";
import { Building2 } from "lucide-react";
import { useLanguage } from "../contexts/Languagecontext";

interface Hospital {
  id: number;
  name: string;
  image: string;
  address: string;
  phone: string;
}

const exampleHospitals: Hospital[] = [
  {
    id: 1,
    name: "UB Vet Animal Hospital",
    image: "/hospitals/ubvet.jpg",
    address:
      "Хан-Уул дүүрэг, 19-р хороолол, Хан-Уул товертой уулзвараар урагшаа эргээд 300 метр яваад замын баруун талдаа байршиж байна.",
    phone: "+976 75073555",
  },
  {
    id: 2,
    name: "Жонон мал эмнэлэг",
    image: "/hospitals/жонон.jpg",
    address:
      "Чингэлтэй дүүрэг, 6-р хороо Чикаго клубын зүүн талд ЖОНОН мал эмнэлэг",
    phone: "+976 8800 5566",
  },
  {
    id: 3,
    name: "SOS Pet Care & Salon",
    image: "/hospitals/sos.jpg",
    address:
      "Баянзүрх дүүрэг, Их Монгол хороолол 904-р байр үйлчилгээний 1тоот",
    phone: "+976 7600 1950",
  },
  {
    id: 4,
    name: "Амар мал эмнэлэг",
    image: "/hospitals/amar.jpg",
    address: "Баруун 4 зам Өгөөж ХХК-ны урд 39-р байр 1-р орц ",
    phone: "+976 9115 1471",
  },
  {
    id: 5,
    name: "Animals Healthy мал эмнэлэг",
    image: "/hospitals/animalshealthy.jpg",
    address: "Улаанбаатар хот Баянзүрх дүүрэг 7-р хороо 115-р байрны 4-р орц",
    phone: "+976 8804 4664",
  },
  {
    id: 6,
    name: "And pet clinic",
    image: "/hospitals/AndClinic.jpg",
    address: "Хан-Уул дүүрэг, 4-р хороо, Viva city хотхон N12-S2",
    phone: "+976 94199027",
  },
];

export default function HospitalPage() {
  const [hospitals] = useState<Hospital[]>(exampleHospitals);
  const { language } = useLanguage();

  const translations = {
    mn: {
      title: "Эмнэлэг",
      description: "Нийгэмд эмнэлгийн мэдээлэл хуваалцаж, холбоо барих",
      allHospitals: "Бүх эмнэлгүүд",
      total: "Нийт",
      hospitals: "эмнэлэг",
      noHospitalsYet: "Эмнэлэг одоогоор байхгүй байна",
    },
    en: {
      title: "Hospital",
      description:
        "Share and discover hospital information within the community",
      allHospitals: "All Hospitals",
      total: "Total",
      hospitals: "hospitals",
      noHospitalsYet: "No Hospitals Yet",
    },
  };

  const t = translations[language];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
            <Building2 className="w-10 h-10" />
            {t.title}
          </h1>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            {t.description}
          </p>
        </div>

        {/* Hospital List */}
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">{t.allHospitals}</h2>
            <p className="text-muted">
              {t.total}{" "}
              <span className="font-semibold text-foreground">
                {hospitals.length}
              </span>{" "}
              {t.hospitals}
            </p>
          </div>

          {hospitals.length === 0 ? (
            <div className="text-center py-20 bg-card-bg rounded-2xl border border-card-border">
              <div className="text-6xl mb-4">🏥</div>
              <h3 className="text-xl font-bold mb-2">{t.noHospitalsYet}</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hospitals.map((hospital) => (
                <div
                  key={hospital.id}
                  className="bg-card-bg rounded-2xl border border-card-border overflow-hidden hover:shadow-lg transition-all hover:border-primary"
                >
                  <img
                    src={hospital.image}
                    alt={hospital.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">
                      {hospital.name}
                    </h3>

                    <div className="flex items-start text-muted mb-2">
                      <svg
                        className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0"
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
                      <span className="text-sm">{hospital.address}</span>
                    </div>

                    <div className="flex items-center text-muted mb-2">
                      <svg
                        className="w-4 h-4 mr-2 flex-shrink-0"
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
                      <span className="text-sm">{hospital.phone}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
