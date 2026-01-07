"use client";

import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { useState } from "react";
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
              Нүүр
            </Link>
            <Link
              href="/browse"
              className="text-muted hover:text-primary font-medium"
            >
              Амьтад харах
            </Link>
            <Link
              href="/about"
              className="text-muted hover:text-primary font-medium"
            >
              Бидний тухай
            </Link>
            <Link
              href="/map"
              className="text-muted hover:text-primary font-medium"
            >
              Map
            </Link>
            <Link
              href="/dog"
              className="text-muted hover:text-primary font-medium"
            >
              Dog
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3 cursor-pointer">
            <ThemeToggle />

            {/* Auth buttons */}
            <SignedOut>
              <SignInButton mode="modal">
                <button className="hidden sm:block px-4 py-2 rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition-all cursor-pointer">
                  Нэвтрэх
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>

            <Link
              href="/report"
              className="hidden sm:block px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-full font-semibold transition-all hover:shadow-lg hover:shadow-primary/30"
            >
              Зар оруулах
            </Link>
            <div className="py-2 px-3.5 bg-[#e47a3d] cursor-pointer rounded-2xl shadow-lg">
              EN
            </div>
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

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-card-border">
            <div className="flex flex-col gap-4">
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                Нүүр
              </Link>
              <Link href="/browse" onClick={() => setMobileMenuOpen(false)}>
                Амьтад үзэх
              </Link>
              <Link href="/about" onClick={() => setMobileMenuOpen(false)}>
                Бидний тухай
              </Link>

              <SignedOut>
                <SignInButton mode="modal">
                  <button className="px-5 py-2.5 border border-primary text-primary rounded-full font-semibold">
                    Нэвтрэх
                  </button>
                </SignInButton>
              </SignedOut>

              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>

              <Link
                href="/report"
                onClick={() => setMobileMenuOpen(false)}
                className="px-5 py-2.5 bg-primary text-white rounded-full font-semibold text-center"
              >
                Зар оруулах
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
