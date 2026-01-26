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
import { toast, Toaster } from "react-hot-toast";
import { useLanguage } from "../contexts/Languagecontext";
import {
  Arrow,
  Logo1,
  NotificationIcon,
  NotificationIcon2,
  TriggerIcon,
} from "./icons";
import { NotificationDropdown } from "./NotificationDropdown";
import { useNotification } from "../contexts/Notificationcontext";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [browseDropdownOpen, setBrowseDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("");

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
    }
  }, [pathname]);

  // Translation object
  const translations = {
    mn: {
      home: "Нүүр",
      browse: "Амьтад үзэх",
      browseSubLost: "Амьтан үрчлүүлэх",
      browseSubFound: "Амьтан үрчлэх",
      map: "Газарын зураг",
      about: "Бидний тухай",
      login: "Нэвтрэх",
      report: "Мэдээлэх",
      loginRequired: "Та нэвтрэх шаардлагатай",
      langButton: "EN",
      aboutUs: "Бидний тухай",
      toto: "Үрчлэгч тал",
      toto2: "Үрчлүүлэгч тал",
    },
    en: {
      home: "Home",
      browse: "Browse Pets",
      browseSubLost: "Pet adoption",
      browseSubFound: "Pet adoption",
      map: "Map",
      about: "About Us",
      login: "Sign In",
      report: "Report",
      loginRequired: "You need to sign in",
      langButton: "МON",
      aboutUs: "About Us",
      toto: "Adopter side",
      toto2: "Provider side",
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

  return (
    <nav className="fixed top-0 left-0 right-0 z-9999 bg-card-bg/80 backdrop-blur-md border-b border-card-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-lg bg-transparent flex items-center justify-center  transition-all">
              <Logo1 />
            </div>
            <span className="text-xl font-bold text-foreground">PawFinder</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {/* Home */}
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 relative ${
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
            <div className="relative group">
              <button
                className={`px-4 py-2 rounded-lg cursor-pointer font-medium transition-all duration-300 relative flex items-center gap-1 ${
                  isActive("browse")
                    ? "text-primary"
                    : "text-muted hover:text-primary"
                }`}
              >
                {t.browse}
                <Arrow />
                {isActive("browse") && (
                  <div className="absolute bottom-0 left-4 right-4 h-1 bg-primary rounded-t-lg"></div>
                )}
              </button>

              {/* Browse Dropdown Menu */}
              <div className="absolute left-0 mt-0 w-56 rounded-xl bg-card-bg border border-card-border shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <Link
                    href="/dog"
                    className="flex items-center gap-3 px-4 py-3 text-muted hover:text-primary hover:bg-primary/10 transition-all"
                  >
                    <span className="text-lg">✓</span>
                    <div>
                      <p className="font-semibold text-sm">{t.browseSubLost}</p>
                      <p className="text-xs text-muted">{t.toto2}</p>
                    </div>
                  </Link>
                  <Link
                    href="/dog"
                    className="flex items-center gap-3 px-4 py-3 text-muted hover:text-primary hover:bg-primary/10 transition-all"
                  >
                    <span className="text-lg">🔍</span>
                    <div>
                      <p className="font-semibold text-sm">
                        {t.browseSubFound}
                      </p>
                      <p className="text-xs text-muted">{t.toto}</p>
                    </div>
                  </Link>
                  <Link
                    href="/browse"
                    className="flex items-center gap-3 px-4 py-3 text-muted hover:text-primary hover:bg-primary/10 transition-all border-t border-card-border"
                  >
                    <span className="text-lg">🐾</span>
                    <div>
                      <p className="font-semibold text-sm">
                        {language === "mn" ? "Бүх амьтнууд" : "All Pets"}
                      </p>
                      <p className="text-xs text-muted">
                        {language === "mn"
                          ? "Бүх зарлалуудыг үзэх"
                          : "View all listings"}
                      </p>
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

            {/* About */}
            <Link
              href="/about"
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 relative ${
                isActive("about")
                  ? "text-primary"
                  : "text-muted hover:text-primary"
              }`}
            >
              {t.about}
              {isActive("about") && (
                <div className="absolute bottom-0 left-4 right-4 h-1 bg-primary rounded-t-lg"></div>
              )}
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* Auth buttons */}
            <SignedOut>
              <SignInButton mode="modal">
                <button className="hidden sm:block px-4 py-2 rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition-all cursor-pointer text-sm">
                  {t.login}
                </button>
              </SignInButton>
            </SignedOut>

            {/* Language & Profile Dropdown - CENTERED */}
            <div className="relative group max-sm:hidden">
              <button className="w-10 h-10 rounded-full cursor-pointer bg-card-bg border border-card-border flex items-center justify-center hover:border-primary transition-colors">
                <TriggerIcon />
              </button>

              {/* Dropdown - CENTER ALIGNED */}
              <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-48 rounded-xl bg-card-bg border border-card-border shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="flex flex-col p-3 gap-3">
                  <SignedIn>
                    <div
                      onClick={() => router.push(`/profile`)}
                      className="flex items-center justify-center cursor-pointer gap-2 h-12 w-full px-3 rounded-lg hover:bg-primary/10 transition-all duration-300 group/profile"
                    >
                      <UserButton />
                      <span className="px-3 py-1 rounded-lg cursor-pointer bg-primary/10 text-primary text-xs font-semibold group-hover/profile:bg-primary/20">
                        {user?.fullName || "User"}
                      </span>
                    </div>
                    <div className="h-px bg-card-border" />
                  </SignedIn>

                  <button
                    onClick={toggleLanguage}
                    className="w-full h-10 bg-primary cursor-pointer text-white rounded-lg font-semibold hover:bg-primary-dark transition-all"
                  >
                    {t.langButton}
                  </button>
                </div>
              </div>
            </div>

            {/* Notification Button - CENTERED */}
            <div className="relative group">
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="relative w-10 h-10 rounded-full cursor-pointer bg-card-bg border border-card-border flex items-center justify-center hover:border-primary transition-colors"
              >
                <NotificationIcon2 />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown - CENTER ALIGNED */}
              <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-80 rounded-xl bg-card-bg border border-card-border shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 max-h-96 overflow-y-auto">
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
                className={`px-4 py-2 rounded-lg font-medium ${
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
                  className={`w-full px-4 py-2 rounded-lg font-medium flex items-center justify-between ${
                    isActive("browse")
                      ? "bg-primary text-white"
                      : "text-muted hover:bg-primary/10"
                  }`}
                >
                  {t.browse}
                  <svg
                    className={`w-4 h-4 transition-transform ${
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
                      href="/browse/lost"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setBrowseDropdownOpen(false);
                      }}
                      className="text-sm text-muted hover:text-primary hover:bg-primary/10 px-3 py-2 rounded-lg"
                    >
                      🔍 {t.browseSubLost}
                    </Link>
                    <Link
                      href="/browse/found"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setBrowseDropdownOpen(false);
                      }}
                      className="text-sm text-muted hover:text-primary hover:bg-primary/10 px-3 py-2 rounded-lg"
                    >
                      ✓ {t.browseSubFound}
                    </Link>
                    <Link
                      href="/browse"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setBrowseDropdownOpen(false);
                      }}
                      className="text-sm text-muted hover:text-primary hover:bg-primary/10 px-3 py-2 rounded-lg border-t border-card-border pt-2"
                    >
                      🐾 {language === "mn" ? "Бүх амьтнууд" : "All Pets"}
                    </Link>
                  </div>
                )}
              </div>

              <Link
                href="/map"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  isActive("map")
                    ? "bg-primary text-white"
                    : "text-muted hover:bg-primary/10"
                }`}
              >
                {t.map}
              </Link>

              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  isActive("about")
                    ? "bg-primary text-white"
                    : "text-muted hover:bg-primary/10"
                }`}
              >
                {t.about}
              </Link>

              <div className="h-px bg-card-border my-2" />

              {/* Mobile Auth */}
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="w-full px-4 py-2 border border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-all">
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
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-semibold text-center hover:bg-primary-dark transition-all"
                >
                  {t.report}
                </Link>
                <button
                  onClick={() => {
                    toggleLanguage();
                  }}
                  className="flex-1 px-4 py-2 bg-primary/20 text-primary rounded-lg font-semibold hover:bg-primary/30 transition-all"
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
