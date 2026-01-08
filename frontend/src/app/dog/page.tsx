"use client";

import { useState } from "react";
import { People } from "../components/people";
import { Adopt } from "../components/adopt";

export default function ReportPage() {
  const [showPeople, setShowPeople] = useState(false);

  const [showAdopt, setShowAdopt] = useState(false);

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Мэдээлэл оруулах
          </h1>
        </div>

        {/* Status Selection */}
        <div className="bg-card-bg rounded-2xl border border-card-border p-6">
          <h2 className="text-xl font-bold mb-4">Та юу мэдээлж байна вэ?</h2>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => {
                setShowPeople(true);
                setShowAdopt(false);
              }}
              className={`p-6 rounded-xl border-2 transition-all ${
                showPeople
                  ? "border-primary bg-primary/10"
                  : "border-card-border hover:border-primary/50"
              }`}
            >
              <div className="text-4xl mb-2">🔍</div>
              <div className="font-bold text-lg">Амьтан үрчлүүлэх</div>
              <p className="text-sm text-muted mt-1">Амьтанд эзэн хайж байна</p>
            </button>

            <button
              type="button"
              onClick={() => {
                setShowAdopt(true);
                setShowPeople(false);
              }}
              className={`p-6 rounded-xl border-2 transition-all ${
                showAdopt
                  ? "border-primary bg-primary/10"
                  : "border-card-border hover:border-primary/50"
              }`}
            >
              <div className="text-4xl mb-2">🏠</div>
              <div className="font-bold text-lg">Амьтан үрчилж авах</div>
              <p className="text-sm text-muted mt-1">
                Амьтан үрчилж авмаар байна
              </p>
            </button>
          </div>
        </div>

        {showPeople && (
          <div className="mt-8">
            <People />
          </div>
        )}

        {showAdopt && (
          <div className="mt-8">
            <Adopt />
          </div>
        )}
      </div>
    </div>
  );
}
