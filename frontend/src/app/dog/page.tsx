"use client";

import { useState } from "react";
import { People } from "../components/people";

export default function ReportPage() {
  const [showPeople, setShowPeople] = useState(false);
  const [showAnimal, setShowAnimal] = useState(false);
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Мэдээлэл оруулах
          </h1>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Төөрсөн амьтныг гэр бүлтэй нь холбоход туслахын тулд доорх
            мэдээллийг бөглөнө үү
          </p>
        </div>

        {/* Status Selection */}
        <div className="bg-card-bg rounded-2xl border border-card-border p-6">
          <h2 className="text-xl font-bold mb-4">Та юу мэдээлж байна вэ?</h2>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setShowPeople(true)}
              className="p-4 border rounded-xl hover:bg-gray-100"
            >
              <div className="text-4xl mb-2">🔍</div>
              <div className="font-bold text-lg">Амьтан үрчлүүлэх</div>
            </button>

            <button
              type="button"
              onClick={() => setShowAnimal(true)}
              className="p-4 border rounded-xl hover:bg-gray-100"
            >
              <div className="text-4xl mb-2">🏠</div>
              <div className="font-bold text-lg">Амьтан үрчилж авах</div>
            </button>
          </div>
        </div>

        {/* 👇 Button дарахад People component гарч ирнэ */}
        {showPeople && (
          <div className="mt-8">
            <People />
          </div>
        )}
      </div>
    </div>
  );
}
