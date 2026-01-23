"use client";

import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";

import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
  useClerk,
} from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import { useLanguage } from "../contexts/Languagecontext";
import { NotificationIcon, NotificationIcon2, TriggerIcon } from "./icons";
import { NotificationDropdown } from "./NotificationDropdown";
import { useNotification } from "../contexts/Notificationcontext";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const { language, toggleLanguage } = useLanguage();
  const { user } = useUser();
  const { unreadCount } = useNotification();

  const { isSignedIn } = useAuth();
  const router = useRouter();
  const { openSignIn } = useClerk();

  // Translation object
  const translations = {
    mn: {
      home: "Нүүр",
      browse: "Амьтад үзэх",
      map: "Map",
      dog: "Dog",
      about: "Бидний тухай",
      login: "Нэвтрэх",
      report: "Мэдээлэх",
      loginRequired: "Та нэвтрэх шаардлагатай",
      langButton: "EN",
      aboutUs: "Бидний тухай",
      mapp: "Газарын зураг",
    },
    en: {
      home: "Home",
      browse: " Pets",
      map: "Map",
      dog: "Dog",
      about: "About Us",
      login: "Sign In",
      report: "Report",
      loginRequired: "You need to sign in",
      langButton: "МON",
      aboutUs: "About Us",
      mapp: "Map",
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

  return (
    <nav className="fixed top-0 left-0 right-0 z-9999 bg-card-bg/80 backdrop-blur-md border-b border-card-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center group-hover:animate-pulse-glow transition-all">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 18c-1.5 0-2.7 1.2-2.7 2.7s1.2 2.7 2.7 2.7 2.7-1.2 2.7-2.7-1.2-2.7-2.7-2.7zm-4.3-2.7c-.9 0-1.6.7-1.6 1.6s.7 1.6 1.6 1.6 1.6-.7 1.6-1.6-.7-1.6-1.6-1.6zm8.6 0c-.9 0-1.6.7-1.6 1.6s.7 1.6 1.6 1.6 1.6-.7 1.6-1.6-.7-1.6-1.6-1.6zm-6.5-2.7c-.9 0-1.6.7-1.6 1.6s.7 1.6 1.6 1.6 1.6-.7 1.6-1.6-.7-1.6-1.6-1.6zm4.3 0c-.9 0-1.6.7-1.6 1.6s.7 1.6 1.6 1.6 1.6-.7 1.6-1.6-.7-1.6-1.6-1.6z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-foreground">PawFinder</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-muted hover:text-primary font-medium"
            >
              {t.home}
            </Link>
            <Link
              href="/browse"
              className="text-muted hover:text-primary font-medium"
            >
              {t.browse}
            </Link>

            <Link
              href="/map"
              className="text-muted hover:text-primary font-medium"
            >
              {t.mapp}
            </Link>
            <Link
              href="/dog"
              className="text-muted hover:text-primary font-medium"
            >
              {t.dog}
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <ThemeToggle />

            {/* Auth buttons */}
            <SignedOut>
              <SignInButton mode="modal">
                <button className="hidden sm:block px-4 py-2 rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition-all cursor-pointer">
                  {t.login}
                </button>
              </SignInButton>
            </SignedOut>

            {/* Language Toggle Button */}

            <div className="relative group max-sm:hidden">
              {/* Trigger button */}
              <button className="w-10 h-10 rounded-full cursor-pointer bg-card-bg border border-card-border flex items-center justify-center">
                <TriggerIcon />
              </button>

              {/* Dropdown */}
              <div className="absolute right-0 mt-3 w-48 rounded-xl bg-card-bg border border-card-border shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="flex flex-col p-3 gap-5 text-sm">
                  <div className="h-px bg-card-border my-1" />

                  <SignedIn>
                    <div
                      onClick={() => router.push(`/profile`)}
                      className="flex items-center justify-center cursor-pointer gap-2 h-12 w-full relative group hover:bg-primary/10 rounded-md transition-all duration-300"
                    >
                      <UserButton />
                      <span className="px-3 py-1 rounded-full cursor-pointer bg-primary/10 text-primary text-xs font-semibold">
                        {user?.fullName || "User"}
                      </span>
                    </div>
                  </SignedIn>
                  <button
                    onClick={toggleLanguage}
                    className="w-full h-10 bg-primary cursor-pointer text-white rounded-lg font-semibold hover:bg-primary-dark"
                  >
                    {t.langButton}
                  </button>
                </div>
              </div>
            </div>

            {/* Notification Button */}
            <div className="relative group">
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="relative w-10 h-10 rounded-full cursor-pointer bg-card-bg border border-card-border flex items-center justify-center hover:border-primary transition-colors"
              >
                <NotificationIcon2 />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              <div
                className={`absolute right-0 mt-3 w-80 rounded-xl bg-card-bg border border-card-border shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 max-h-96 overflow-y-auto`}
              >
                <NotificationDropdown />
              </div>
            </div>
            <Link
              href="/report"
              onClick={handleClick}
              className="hidden sm:block px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-full font-semibold transition-all hover:shadow-lg hover:shadow-primary/30"
            >
              {t.report}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-full bg-card-bg border border-card-border flex items-center justify-center"
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

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-card-border">
            <div className="flex flex-col gap-4">
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                {t.home}
              </Link>
              <Link href="/browse" onClick={() => setMobileMenuOpen(false)}>
                {t.browse}
              </Link>
              <Link href="/map" onClick={() => setMobileMenuOpen(false)}>
                {t.mapp}
              </Link>
              <Link href="/dog" onClick={() => setMobileMenuOpen(false)}>
                {t.dog}
              </Link>

              <SignedOut>
                <SignInButton mode="modal">
                  <button className="px-5 py-2.5 border border-primary max-sm:hidden text-primary rounded-full font-semibold">
                    {t.login}
                  </button>
                </SignInButton>
              </SignedOut>

              <SignedIn>
                <div className="flex gap-1 items-center">
                  <UserButton />
                  <span
                    onClick={() => router.push(`/profile`)}
                    className="px-3 py-1 rounded-full cursor-pointer bg-primary/10 text-primary text-xs font-semibold"
                  >
                    {user?.fullName || "User"}
                  </span>
                </div>
              </SignedIn>
              <div className="flex justify-between">
                <Link
                  href="/report"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-5 w-[49%] py-2.5 bg-primary text-white rounded-full font-semibold text-center"
                >
                  {t.report}
                </Link>
                <button
                  onClick={toggleLanguage}
                  className="w-[49%] h-10 bg-primary cursor-pointer text-white rounded-full font-semibold hover:bg-primary-dark"
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
