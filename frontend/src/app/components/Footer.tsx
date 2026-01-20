"use client";

import Link from "next/link";
import { useLanguage } from "../contexts/Languagecontext";

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
      copyright: "© 2026 PawFinder. Бүх тэжээвэр амьтдад ❤️ зориулав.",
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
      copyright: "© 2026 PawFinder. Made with ❤️ for all pets.",
    },
  };

  const t = translations[language];

  return (
    <footer className="bg-card-bg border-t border-card-border py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 18c-1.5 0-2.7 1.2-2.7 2.7s1.2 2.7 2.7 2.7 2.7-1.2 2.7-2.7-1.2-2.7-2.7-2.7zm-4.3-2.7c-.9 0-1.6.7-1.6 1.6s.7 1.6 1.6 1.6 1.6-.7 1.6-1.6-.7-1.6-1.6-1.6zm8.6 0c-.9 0-1.6.7-1.6 1.6s.7 1.6 1.6 1.6 1.6-.7 1.6-1.6-.7-1.6-1.6-1.6zm-6.5-2.7c-.9 0-1.6.7-1.6 1.6s.7 1.6 1.6 1.6 1.6-.7 1.6-1.6-.7-1.6-1.6-1.6zm4.3 0c-.9 0-1.6.7-1.6 1.6s.7 1.6 1.6 1.6 1.6-.7 1.6-1.6-.7-1.6-1.6-1.6z" />
                </svg>
              </div>
              <span className="text-xl font-bold">PawFinder</span>
            </div>
            <p className="text-muted max-w-md">{t.description}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t.quickLinks}</h3>
            <ul className="space-y-2 text-muted">
              <li>
                <Link
                  href="/browse"
                  className="hover:text-[#e47a3d] transition-all duration-300"
                >
                  {t.browse}
                </Link>
              </li>
              <li>
                <Link
                  href="/report"
                  className="hover:text-[#e47a3d] transition-all duration-300"
                >
                  {t.report}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-[#e47a3d] transition-all duration-300"
                >
                  {t.about}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t.categories}</h3>
            <ul className="space-y-2 text-muted">
              <li>
                <Link
                  href="/browse?type=dog"
                  className="hover:text-[#e47a3d] transition-all duration-300"
                >
                  {t.dog}
                </Link>
              </li>
              <li>
                <Link
                  href="/browse?type=cat"
                  className="hover:text-[#e47a3d] transition-all duration-300"
                >
                  {t.cat}
                </Link>
              </li>
              <li>
                <Link
                  href="/browse?status=lost"
                  className="hover:text-[#e47a3d] transition-all duration-300"
                >
                  {t.lost}
                </Link>
              </li>
              <li>
                <Link
                  href="/browse?status=found"
                  className="hover:text-[#e47a3d] transition-all duration-300"
                >
                  {t.found}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-card-border mt-8 pt-8 text-center text-muted">
          <p>{t.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
