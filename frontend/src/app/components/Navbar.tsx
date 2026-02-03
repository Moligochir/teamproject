"use client";

import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
  useClerk,
} from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-hot-toast";
import { useLanguage } from "../contexts/Languagecontext";
import { Logo1, NotificationIcon2, TriggerIcon } from "./icons";
import { NotificationDropdown } from "./NotificationDropdown";
import { useNotification } from "../contexts/Notificationcontext";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [browseDropdownOpen, setBrowseDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("");
  const [browseHovered, setBrowseHovered] = useState(false);
  const [othersHovered, setOthersHovered] = useState(false);

  const { language, toggleLanguage } = useLanguage();
  const { user } = useUser();
  const { unreadCount } = useNotification();

  const { isSignedIn } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { openSignIn } = useClerk();

  // Update active tab based on pathname
  useEffect(() => {
    if (pathname === "/") {
      setActiveTab("home");
    } else if (pathname.includes("/browse")) {
      setActiveTab("browse");
    } else if (pathname === "/map") {
      setActiveTab("map");
    } else if (pathname === "/about") {
      setActiveTab("about");
    } else if (pathname === "/shop") {
      setActiveTab("shop");
    }
  }, [pathname]);

  // Translation object
  const translations = {
    mn: {
      home: "Нүүр",
      browse: "Амьтад үзэх",
      browseSubLost: "Төөрсөн амьтан",
      browseSubFound: "Олдсон амьтан",
      map: "Газарын зураг",
      about: "Бидний тухай",
      login: "Нэвтрэх",
      report: "Мэдээлэх",
      loginRequired: "Та нэвтрэх шаардлагатай",
      langButton: "EN",
      aboutUs: "Бидний тухай",
      toto: "Үрчлэх",
      toto2: "Үрчлүүлэх",
      Others: "Бусад",
      Shop: "Дэлгүүр",
      Hospital: "Эмнэлэг",
      AllPets: "Бүх амьтнууд",
      ViewAll: "Бүх зарлалуудыг үзэх",
    },
    en: {
      home: "Home",
      browse: "Browse Pets",
      browseSubLost: "Lost Pets",
      browseSubFound: "Found Pets",
      map: "Map",
      about: "About Us",
      login: "Sign In",
      report: "Report",
      loginRequired: "You need to sign in",
      langButton: "МON",
      aboutUs: "About Us",
      toto: "Adopt",
      toto2: "Provider",
      Others: "Others",
      Shop: "Shop",
      Hospital: "Hospital",
      AllPets: "All Pets",
      ViewAll: "View all listings",
    },
  };

  const t = translations[language];

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
  ) => {
    if (!isSignedIn) {
      e.preventDefault();
      toast(t.loginRequired);

      openSignIn({
        redirectUrl: "/report",
      });
    }
  };

  // Check if nav link is active
  const isActive = (tab: string) => activeTab === tab;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Only close if clicking outside the dropdowns
      if (!target.closest(".group")) {
        setNotificationOpen(false);
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-9999 bg-card-bg/80 backdrop-blur-md border-b border-card-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-lg bg-transparent flex items-center justify-center transition-all">
              <Logo1 />
            </div>
            <span className="text-xl font-bold text-foreground ">
              PawFinder
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {/* Home */}
            <Link
              href="/"
              className={`px-4 py-2 cursor-pointer rounded-lg font-medium transition-all duration-300 relative ${
                isActive("home")
                  ? "text-primary"
                  : "text-muted hover:text-primary"
              }`}
            >
              {t.home}
              {isActive("home") && (
                <div className="absolute bottom-0 left-4 right-4 h-1 bg-primary rounded-t-lg"></div>
              )}
            </Link>

            {/* Browse with Dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => setBrowseHovered(true)}
              onMouseLeave={() => setBrowseHovered(false)}
            >
              <button
                className={`px-4 py-2 rounded-lg cursor-pointer font-medium transition-all duration-300 relative flex items-center gap-1 ${
                  isActive("browse")
                    ? "text-primary"
                    : "text-muted hover:text-primary"
                }`}
              >
                {t.browse}
                <svg
                  className={`w-4 h-4 transition-transform duration-300 ${
                    browseHovered ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>

                {isActive("browse") && (
                  <div className="absolute bottom-0 left-4 right-4 h-1 bg-primary rounded-t-lg"></div>
                )}
              </button>

              {/* Browse Dropdown Menu */}
              <div className="absolute left-0 mt-0 w-56 rounded-xl bg-card-bg border border-card-border shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <Link
                    href="/dog"
                    className="flex items-center cursor-pointer gap-3 px-4 py-3 text-muted hover:text-primary hover:bg-primary/10 transition-all"
                  >
                    <span className="text-lg">🔍</span>
                    <div>
                      <p className="font-semibold text-sm">{t.browseSubLost}</p>
                      <p className="text-xs text-muted">{t.toto}</p>
                    </div>
                  </Link>
                  <Link
                    href="/browse"
                    className="flex cursor-pointer items-center gap-3 px-4 py-3 text-muted hover:text-primary hover:bg-primary/10 transition-all border-t border-card-border"
                  >
                    <span className="text-lg">🐾</span>
                    <div>
                      <p className="font-semibold text-sm">{t.AllPets}</p>
                      <p className="text-xs text-muted">{t.ViewAll}</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Map */}
            <Link
              href="/map"
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 relative ${
                isActive("map")
                  ? "text-primary"
                  : "text-muted hover:text-primary"
              }`}
            >
              {t.map}
              {isActive("map") && (
                <div className="absolute bottom-0 left-4 right-4 h-1 bg-primary rounded-t-lg"></div>
              )}
            </Link>

            {/* Others with Dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => setOthersHovered(true)}
              onMouseLeave={() => setOthersHovered(false)}
            >
              <button
                className={`px-4 py-2 rounded-lg cursor-pointer font-medium transition-all duration-300 relative flex items-center gap-1 ${
                  isActive("shop") || isActive("hospital")
                    ? "text-primary"
                    : "text-muted hover:text-primary"
                }`}
              >
                {t.Others}
                <svg
                  className={`w-4 h-4 transition-transform duration-300 ${
                    othersHovered ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>

                {(isActive("shop") || isActive("hospital")) && (
                  <div className="absolute bottom-0 left-4 right-4 h-1 bg-primary rounded-t-lg"></div>
                )}
              </button>

              {/* Others Dropdown Menu */}
              <div className="absolute left-0 mt-0 w-56 rounded-xl bg-card-bg border border-card-border shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <Link
                    href="/shop"
                    className="flex items-center cursor-pointer gap-3 px-4 py-3 text-muted hover:text-primary hover:bg-primary/10 transition-all"
                  >
                    <span className="text-lg">🛒</span>
                    <div>
                      <p className="font-semibold text-sm">{t.Shop}</p>
                      <p className="text-xs text-muted">
                        {language === "mn"
                          ? "Бараа худалдаж авах"
                          : "Buy & Sell"}
                      </p>
                    </div>
                  </Link>
                  <Link
                    href="/hostipal"
                    className="flex items-center cursor-pointer gap-3 px-4 py-3 text-muted hover:text-primary hover:bg-primary/10 transition-all"
                  >
                    <span className="text-lg">🏥</span>
                    <div>
                      <p className="font-semibold text-sm">{t.Hospital}</p>
                      <p className="text-xs text-muted">
                        {language === "mn" ? "Эмнэлэг олох" : "Find hospitals"}
                      </p>
                    </div>
                  </Link>
                  <Link
                    href="/about"
                    className="flex items-center cursor-pointer gap-3 px-4 py-3 text-muted hover:text-primary hover:bg-primary/10 transition-all border-t border-card-border"
                  >
                    <span className="text-lg">📋</span>
                    <div>
                      <p className="font-semibold text-sm cursor-pointer">
                        {t.about}
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            {/* Auth buttons */}
            <SignedOut>
              <SignInButton mode="modal">
                <button className="hidden sm:block px-4 py-2 rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition-all cursor-pointer text-sm font-medium">
                  {t.login}
                </button>
              </SignInButton>
            </SignedOut>

            {/* Profile Dropdown - HOVER on Desktop, CLICK on Mobile */}
            <div
              className="relative group max-sm:hidden"
              onMouseEnter={() => setProfileDropdownOpen(true)}
              onMouseLeave={() => setProfileDropdownOpen(false)}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setProfileDropdownOpen(!profileDropdownOpen);
                }}
                className="w-10 h-10 rounded-full cursor-pointer bg-card-bg border border-card-border flex items-center justify-center hover:border-primary transition-colors"
              >
                <TriggerIcon />
              </button>

              {/* Dropdown - CENTER ALIGNED - Show on hover desktop or click mobile */}
              <div
                className={`absolute left-1/2 -translate-x-1/2 mt-3 w-48 rounded-xl bg-card-bg border border-card-border shadow-xl z-50 transition-all duration-200 ${
                  profileDropdownOpen
                    ? "opacity-100 visible"
                    : "opacity-0 invisible"
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex flex-col p-3 gap-3">
                  <SignedIn>
                    <div
                      onClick={() => {
                        router.push(`/profile`);
                        setProfileDropdownOpen(false);
                      }}
                      className="flex items-center justify-center cursor-pointer gap-2 h-12 w-full px-3 rounded-lg hover:bg-primary/10 transition-all"
                    >
                      <UserButton />
                      <span className="px-3 py-1 rounded-lg cursor-pointer bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20">
                        {user?.fullName || "User"}
                      </span>
                    </div>
                    <div className="h-px bg-card-border" />
                  </SignedIn>

                  <button
                    onClick={() => {
                      toggleLanguage();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full h-10 bg-primary cursor-pointer text-white rounded-lg font-semibold hover:bg-primary-dark transition-all text-sm"
                  >
                    {t.langButton}
                  </button>
                </div>
              </div>
            </div>

            {/* Notification Button - HOVER on Desktop, CLICK on Mobile */}
            <div
              className="relative group"
              onMouseEnter={() => setNotificationOpen(true)}
              onMouseLeave={() => setNotificationOpen(false)}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setNotificationOpen(!notificationOpen);
                }}
                className="relative w-10 h-10 rounded-full cursor-pointer bg-card-bg border border-card-border flex items-center justify-center hover:border-primary transition-colors"
              >
                <NotificationIcon2 />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown - CENTER ALIGNED - Show on hover desktop or click mobile */}
              <div
                className={`absolute left-1/2 -translate-x-1/2 mt-3 w-80 rounded-xl bg-card-bg border border-card-border shadow-xl z-50 max-h-96 overflow-y-auto transition-all duration-200 ${
                  notificationOpen
                    ? "opacity-100 visible"
                    : "opacity-0 invisible"
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <NotificationDropdown />
              </div>
            </div>

            {/* Report Button */}
            <Link
              href="/report"
              onClick={handleClick}
              className="hidden sm:block px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-full font-semibold transition-all hover:shadow-lg hover:shadow-primary/30 text-sm"
            >
              {t.report}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-full bg-card-bg border border-card-border flex items-center justify-center hover:border-primary transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-card-border">
            <div className="flex flex-col gap-3">
              {/* Mobile Navigation */}
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  isActive("home")
                    ? "bg-primary text-white"
                    : "text-muted hover:bg-primary/10"
                }`}
              >
                {t.home}
              </Link>

              {/* Browse Mobile Dropdown */}
              <div>
                <button
                  onClick={() => setBrowseDropdownOpen(!browseDropdownOpen)}
                  className={`w-full px-4 py-2 rounded-lg font-medium flex items-center justify-between transition-all ${
                    isActive("browse")
                      ? "bg-primary text-white"
                      : "text-muted hover:bg-primary/10"
                  }`}
                >
                  {t.browse}
                  <svg
                    className={`w-4 h-4 transition-transform duration-300 ${
                      browseDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </button>

                {browseDropdownOpen && (
                  <div className="mt-2 ml-4 flex flex-col gap-2 border-l-2 border-primary pl-4">
                    <Link
                      href="/dog"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setBrowseDropdownOpen(false);
                      }}
                      className="text-sm text-muted hover:text-primary hover:bg-primary/10 px-3 py-2 rounded-lg transition-all"
                    >
                      🔍 {t.browseSubLost}
                    </Link>
                    <Link
                      href="/browse"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setBrowseDropdownOpen(false);
                      }}
                      className="text-sm text-muted hover:text-primary hover:bg-primary/10 px-3 py-2 rounded-lg border-t border-card-border pt-2 transition-all"
                    >
                      🐾 {t.AllPets}
                    </Link>
                  </div>
                )}
              </div>

              <Link
                href="/map"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  isActive("map")
                    ? "bg-primary text-white"
                    : "text-muted hover:bg-primary/10"
                }`}
              >
                {t.map}
              </Link>

              {/* Others Mobile Dropdown */}
              <div>
                <button
                  onClick={() => setOthersHovered(!othersHovered)}
                  className={`w-full px-4 py-2 rounded-lg font-medium flex items-center justify-between transition-all ${
                    isActive("shop") || isActive("hospital")
                      ? "bg-primary text-white"
                      : "text-muted hover:bg-primary/10"
                  }`}
                >
                  {t.Others}
                  <svg
                    className={`w-4 h-4 transition-transform duration-300 ${
                      othersHovered ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </button>

                {othersHovered && (
                  <div className="mt-2 ml-4 flex flex-col gap-2 border-l-2 border-primary pl-4">
                    <Link
                      href="/shop"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setOthersHovered(false);
                      }}
                      className="text-sm text-muted hover:text-primary hover:bg-primary/10 px-3 py-2 rounded-lg transition-all"
                    >
                      🛒 {t.Shop}
                    </Link>
                    <Link
                      href="/hospital"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setOthersHovered(false);
                      }}
                      className="text-sm text-muted hover:text-primary hover:bg-primary/10 px-3 py-2 rounded-lg transition-all"
                    >
                      🏥 {t.Hospital}
                    </Link>
                    <Link
                      href="/about"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setOthersHovered(false);
                      }}
                      className="text-sm text-muted hover:text-primary hover:bg-primary/10 px-3 py-2 rounded-lg border-t border-card-border pt-2 transition-all"
                    >
                      📋 {t.about}
                    </Link>
                  </div>
                )}
              </div>

              <div className="h-px bg-card-border my-2" />

              {/* Mobile Auth */}
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="w-full px-4 py-2 border border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-all text-sm">
                    {t.login}
                  </button>
                </SignInButton>
              </SignedOut>

              <SignedIn>
                <div className="flex gap-2 items-center px-4 py-2 bg-primary/10 rounded-lg">
                  <UserButton />
                  <span
                    onClick={() => {
                      router.push(`/profile`);
                      setMobileMenuOpen(false);
                    }}
                    className="px-2 py-1 rounded-lg cursor-pointer bg-primary/20 text-primary text-xs font-semibold"
                  >
                    {user?.fullName || "User"}
                  </span>
                </div>
              </SignedIn>

              <div className="flex gap-2">
                <Link
                  href="/report"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleClick;
                  }}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-semibold text-center hover:bg-primary-dark transition-all text-sm"
                >
                  {t.report}
                </Link>
                <button
                  onClick={() => {
                    toggleLanguage();
                  }}
                  className="flex-1 px-4 py-2 bg-primary/20 text-primary rounded-lg font-semibold hover:bg-primary/30 transition-all text-sm"
                >
                  {t.langButton}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
