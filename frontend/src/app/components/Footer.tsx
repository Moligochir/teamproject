"use client";

import Link from "next/link";
import { useLanguage } from "../contexts/Languagecontext";
import { Logo1 } from "./icons";

export default function Footer() {
  const { language } = useLanguage();

  const translations = {
    mn: {
      description:
        "Төөрсөн тэжээвэр амьтдыг хайртай гэр бүлтэй нь холбоход туслана. Амьтан бүр гэртээ буцах эрхтэй.",
      quickLinks: "Түргэн холбоосууд",
      browse: "Амьтад үзэх",
      report: "Мэдээлэл оруулах",
      about: "Бидний тухай",
      categories: "Ангилал",
      dog: "Нохой",
      cat: "Муур",
      lost: "Төөрсөн",
      found: "Олдсон",
      copyright: "© 2026 PawFinder.",
      map: "Газарын зураг",
    },
    en: {
      description:
        "Helping reunite lost pets with their loving families. Every pet deserves to come home.",
      quickLinks: "Quick Links",
      browse: "Browse Pets",
      report: "Submit Report",
      about: "About Us",
      categories: "Categories",
      dog: "Dogs",
      cat: "Cats",
      lost: "Lost",
      found: "Found",
      copyright: "© 2026 PawFinder.",
      map: "Map",
    },
  };

  const t = translations[language];

  return (
    <footer className="bg-card-bg border-t border-card-border py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
              <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center">
                <Logo1 />
              </div>
              <span className="text-xl font-bold">PawFinder</span>
            </div>
            <p className="text-muted max-w-md mx-auto md:mx-0">
              {t.description}
            </p>
          </div>

          {/* Mobile flex wrapper */}
          <div className="flex justify-center gap-30 md:contents">
            {/* Quick Links */}
            <div className="text-center md:text-left">
              <h3 className="font-semibold mb-4">{t.quickLinks}</h3>
              <ul className="space-y-4 text-muted">
                <li>
                  <Link
                    href="/browse"
                    className="hover:text-primary transition"
                  >
                    {t.browse}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/report"
                    className="hover:text-primary transition"
                  >
                    {t.report}
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-primary transition">
                    {t.about}
                  </Link>
                </li>
                <li>
                  <Link href="/map" className="hover:text-primary transition">
                    {t.map}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Categories */}
            <div className="text-center md:text-left">
              <h3 className="font-semibold mb-4">{t.categories}</h3>
              <ul className="space-y-2 text-muted">
                <li>
                  <Link
                    href="/browse?type=dog"
                    className="hover:text-primary transition"
                  >
                    {t.dog}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/browse?type=cat"
                    className="hover:text-primary transition"
                  >
                    {t.cat}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/browse?status=lost"
                    className="hover:text-primary transition"
                  >
                    {t.lost}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/browse?status=found"
                    className="hover:text-primary transition"
                  >
                    {t.found}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-card-border mt-8 pt-8 text-center text-muted">
          <p>{t.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
