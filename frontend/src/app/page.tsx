"use client";

import Link from "next/link";
import { toast } from "react-hot-toast";

import { useAuth, useClerk } from "@clerk/nextjs";

import {
  CatIcon,
  ContactIcon,
  DogIcon,
  FoundIcon,
  NotificationIcon,
  SearchIcon,
  SearchIconn,
  Stat1,
  Stat2,
  Stat4,
} from "./components/icons";
import { useEffect, useState } from "react";
import { useLanguage } from "./contexts/Languagecontext";
import PetCard from "./components/petcard";

type lostFound = {
  role: string;
  name: string;
  gender: string;
  location: string;
  description: string;
  Date: Date;
  lat: number;
  lng: number;
  petType: string;
  image: string;
  breed: string;
  _id: string;
  phonenumber: number;
};

// Animated Counter Component
function AnimatedCounter({
  target,
  delay = 0,
}: {
  target: number;
  delay?: number;
}) {
  const [count, setCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
  }, []);

  useEffect(() => {
    if (!isAnimating) return;

    const timer = setTimeout(() => {
      const duration = 2000;
      const steps = 60;
      const increment = target / steps;
      let current = 0;

      const interval = setInterval(() => {
        current += increment;
        if (current >= target) {
          setCount(target);
          clearInterval(interval);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [isAnimating, target, delay]);

  return <span>{count}</span>;
}

// Stats Section Component
function StatsSection({
  animalData,
  t,
  language,
}: {
  animalData: lostFound[];
  t: any;
  language: "mn" | "en";
}) {
  const totalCount = animalData.length;
  const lostCount = animalData.filter(
    (d) => d.role === "Lost" || d.role.toLowerCase() === "lost",
  ).length;
  const foundCount = animalData.filter(
    (d) => d.role === "Found" || d.role.toLowerCase() === "found",
  ).length;
  const reunitedCount = 8;

  return (
    <section className="py-16 -mt-16 relative z-20">
      <style>{`
        @keyframes float-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse-ring {
          0% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
          }
          70% {
            box-shadow: 0 0 0 20px rgba(59, 130, 246, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
          }
        }

        .stat-card {
          animation: float-up 0.8s ease-out forwards;
        }

        .stat-card:nth-child(1) {
          animation-delay: 0.1s;
        }

        .stat-card:nth-child(2) {
          animation-delay: 0.2s;
        }

        .stat-card:nth-child(3) {
          animation-delay: 0.3s;
        }

        .stat-card:nth-child(4) {
          animation-delay: 0.4s;
        }

        .stat-icon {
          animation: pulse-ring 2s infinite;
        }

        .stat-value {
          font-variant-numeric: tabular-nums;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-sm:grid-cols-2">
          {/* Total Listings */}
          <div className="stat-card group">
            <div className="h-full rounded-2xl border-2 border-primary/30 bg-linear-to-br from-primary/10 to-primary/5 p-6 hover:border-primary/60 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 overflow-hidden relative">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-primary to-primary-dark flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300 stat-icon">
                  <Stat1 />
                </div>

                <div className="space-y-1">
                  <div className="text-4xl sm:text-5xl font-black text-foreground stat-value">
                    <AnimatedCounter target={totalCount} delay={100} />
                  </div>
                  <p className="text-sm font-semibold text-muted uppercase tracking-wider">
                    {t.stats.total}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          </div>

          {/* Lost Pets */}
          <div className="stat-card group">
            <div className="h-full rounded-2xl border-2 border-red-500/30 bg-linear-to-br from-red-500/10 to-rose-500/5 p-6 hover:border-red-500/60 hover:shadow-xl hover:shadow-red-500/20 transition-all duration-300 overflow-hidden relative">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-red-500 to-rose-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300 stat-icon">
                  <Stat2 />
                </div>

                <div className="space-y-1">
                  <div className="text-4xl sm:text-5xl font-black text-red-600 dark:text-red-400 stat-value">
                    <AnimatedCounter target={lostCount} delay={200} />
                  </div>
                  <p className="text-sm font-semibold text-muted uppercase tracking-wider">
                    {t.stats.lost}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Found Pets */}
          <div className="stat-card group">
            <div className="h-full rounded-2xl border-2 border-green-500/30 bg-linear-to-br from-green-500/10 to-emerald-500/5 p-6 hover:border-green-500/60 hover:shadow-xl hover:shadow-green-500/20 transition-all duration-300 overflow-hidden relative">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-green-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300 stat-icon">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>

                <div className="space-y-1">
                  <div className="text-4xl sm:text-5xl font-black text-green-600 dark:text-green-400 stat-value">
                    <AnimatedCounter target={foundCount} delay={300} />
                  </div>
                  <p className="text-sm font-semibold text-muted uppercase tracking-wider">
                    {t.stats.found}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Reunited */}
          <div className="stat-card group">
            <div className="h-full rounded-2xl border-2 border-cyan-500/30 bg-linear-to-br from-cyan-500/10 to-blue-500/5 p-6 hover:border-cyan-500/60 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300 overflow-hidden relative">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300 stat-icon">
                  <Stat4 />
                </div>

                <div className="space-y-1">
                  <div className="text-4xl sm:text-5xl font-black text-cyan-600 dark:text-cyan-400 stat-value">
                    <AnimatedCounter target={reunitedCount} delay={400} />
                  </div>
                  <p className="text-sm font-semibold text-muted uppercase tracking-wider">
                    {t.stats.reunited}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();
  const [animalData, setAnimalData] = useState<lostFound[]>([]);
  const { language } = useLanguage();

  const translations = {
    mn: {
      hero: {
        badge: "Тэжээвэр амьтдыг гэртээ буцаахад туслана",
        title1: "Төөрсөн Амьтдыг",
        title2: "Гэр Бүлтэй нь Холбоно",
        description:
          "Төөрсөн амьтан олсон уу эсвэл өөрийн тэжээвэр амьтнаа алдсан уу? Манай платформ төөрсөн амьтдыг эзэдтэй нь холбоход туслана.",
        reportButton: "Мэдээлэл оруулах",
        browseButton: "Зарлалууд үзэх",
      },
      stats: {
        total: "Нийт зарлал",
        lost: "Төөрсөн",
        found: "Олдсон",
        reunited: "Үрчлүүлэх Зар",
      },
      categories: {
        title: "Ангилалаар хайх",
        description: "Төрөл болон төлөвөөр ангилсан амьтдыг үзэх",
        dog: "Нохой",
        cat: "Муур",
        lost: "Төөрсөн",
        found: "Олдсон",
      },
      recent: {
        title: "Сүүлийн зарлалууд",
        description: "Эдгээр амьтдыг гэртээ буцаахад туслаарай",
        viewAll: "Бүгдийг үзэх",
      },
      howItWorks: {
        title: "Хэрхэн ажилладаг вэ?",
        description: "Амьтдыг гэр бүлтэй нь холбох энгийн алхамууд",
        step1: {
          title: "1. Мэдээлэх",
          description:
            "Амьтан олсон уу эсвэл алдсан уу? Зураг болон байршлын дэлгэрэнгүй мэдээлэлтэй зарлал үүсгэнэ үү.",
        },
        step2: {
          title: "2. Хайх",
          description:
            "Зарлалуудыг үзэж, байршил, амьтны төрөл, төлөвөөр шүүж тохирохыг олно уу.",
        },
        step3: {
          title: "3. Холбогдох",
          description:
            "Амьтны эзэн эсвэл олсон хүнтэй холбогдож, амьтдыг гэртээ буцаахад туслаарай!",
        },
      },
      cta: {
        title: "Туслахад бэлэн үү?",
        description:
          "Зарлал бүр төөрсөн амьтныг гэртээ нэг алхам ойртуулна. Манай нийгэмлэгт нэгдээрэй!",
        reportPet: "Олдсон амьтан мэдээлэх",
        searchPet: "Төөрсөн амьтад хайх",
      },
      loginRequired: "Та нэвтрэх шаардлагатай",
      nerguiii: "Нэр мэдэгдэхгүй",
    },
    en: {
      hero: {
        badge: "Helping pets find their way home",
        title1: "Reuniting Lost Pets",
        title2: "With Their Families",
        description:
          "Found a lost pet or lost your own? Our platform helps reconnect lost pets with their owners.",
        reportButton: "Submit Report",
        browseButton: "Browse Listings",
      },
      stats: {
        total: "Total Listings",
        lost: "Lost",
        found: "Found",
        reunited: "Adoption",
      },
      categories: {
        title: "Browse by Category",
        description: "View pets organized by type and status",
        dog: "Dogs",
        cat: "Cats",
        lost: "Lost",
        found: "Found",
      },
      recent: {
        title: "Recent Listings",
        description: "Help these pets find their way home",
        viewAll: "View All",
      },
      howItWorks: {
        title: "How It Works?",
        description: "Simple steps to reunite pets with their families",
        step1: {
          title: "1. Report",
          description:
            "Found or lost a pet? Create a listing with photos and detailed location information.",
        },
        step2: {
          title: "2. Search",
          description:
            "Browse listings and filter by location, pet type, and status to find matches.",
        },
        step3: {
          title: "3. Connect",
          description:
            "Contact the owner or finder and help reunite pets with their homes!",
        },
      },
      cta: {
        title: "Ready to Help?",
        description:
          "Every listing brings a lost pet one step closer to home. Join our community!",
        reportPet: "Report Found Pet",
        searchPet: "Search Lost Pets",
      },
      loginRequired: "You need to sign in",
      nerguiii: "Unknown",
    },
  };

  const t = translations[language];

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isSignedIn) {
      e.preventDefault();
      toast(t.loginRequired);
      openSignIn({ redirectUrl: "/report" });
    }
  };

  const GetLostFound = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/lostFound`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
        },
      );
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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-hero paw-pattern min-h-[85vh] flex items-center relative overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/3 w-64 h-64 bg-accent/15 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute top-10 right-1/4 w-48 h-48 bg-primary/10 rounded-full blur-2xl animate-float" />
        <div
          className="absolute bottom-1/3 left-20 w-32 h-32 bg-secondary/15 rounded-full blur-2xl animate-float"
          style={{ animationDelay: "0.5s" }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-background/70" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up stagger-1">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-primary/30 animate-glow-pulse">
                <span className="animate-pulse">●</span>
                {t.hero.badge}
              </div>

              <h1 className="text-5xl md:text-7xl max-sm:text-4xl font-black mb-6 leading-tight tracking-tight">
                {t.hero.title1}
                <br />
                <span className="relative inline-block">
                  <span className="relative z-10 text-primary">
                    {t.hero.title2}
                  </span>
                  <div className="absolute -bottom-2 left-0 right-0 h-4 bg-primary/20 blur-lg -z-10"></div>
                </span>
              </h1>

              <p className="text-lg md:text-xl text-muted mb-8 max-w-lg leading-relaxed animate-slide-up stagger-2">
                {t.hero.description}
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap gap-4 animate-slide-up stagger-3">
                <Link
                  href="/report"
                  onClick={handleClick}
                  className="px-8 py-4 bg-primary hover:bg-primary-dark max-sm:w-[65%] text-white rounded-full font-bold text-lg transition-all hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-1 active:scale-95 relative overflow-hidden group"
                >
                  <span className="relative z-10">{t.hero.reportButton}</span>
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
                <Link
                  href="/browse"
                  className="px-8 py-4 bg-card-bg border-2 border-card-border max-sm:w-[65%] hover:border-primary text-foreground rounded-full font-bold text-lg transition-all hover:-translate-y-1 active:scale-95 relative group"
                >
                  <span className="relative z-10 group-hover:text-primary transition-colors">
                    {t.hero.browseButton}
                  </span>
                </Link>
              </div>
            </div>

            <div className="relative animate-slide-down stagger-2 hidden lg:block">
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-secondary/20 rounded-full animate-pulse-slow blob" />
                <div
                  className="absolute inset-4 bg-linear-to-br from-primary/30 to-secondary/30 rounded-full animate-rotate-slow rotating"
                  style={{ animationDuration: "30s" }}
                />

                <div className="absolute inset-8 rounded-full overflow-hidden border-4 border-transparent bg-linear-to-br from-primary via-primary to-pink-500 p-1 shadow-2xl animate-glow-pulse">
                  <div className="w-full h-full rounded-full overflow-hidden bg-background">
                    <img
                      src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=600&fit=crop"
                      alt="Dogs and cats"
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>

                <div className="absolute -top-4 -right-4 bg-white dark:bg-card-bg rounded-2xl shadow-2xl p-4 animate-float animate-glow-pulse card-hover-lift">
                  <span className="text-4xl">
                    <DogIcon />
                  </span>
                </div>
                <div
                  className="absolute -bottom-4 -left-4 bg-white dark:bg-card-bg rounded-2xl shadow-2xl p-4 animate-float animate-glow-pulse card-hover-lift"
                  style={{ animationDelay: "1s" }}
                >
                  <span className="text-4xl">
                    <CatIcon />
                  </span>
                </div>

                <div className="absolute top-1/4 -right-8 w-4 h-4 bg-primary rounded-full animate-pulse" />
                <div
                  className="absolute bottom-1/4 -left-8 w-3 h-3 bg-secondary rounded-full animate-pulse"
                  style={{ animationDelay: "0.5s" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection animalData={animalData} t={t} language={language} />

      {/* Categories Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-slide-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4  bg-clip-text text-white">
              {t.categories.title}
            </h2>
            <p className="text-muted text-lg">{t.categories.description}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* dog */}
            <Link
              href={"/browse?type=dog"}
              className={`group block animate-fade-up opacity-0 stagger-1`}
            >
              <div className="h-full rounded-2xl border-2 border-primary/30 bg-linear-to-br from-primary/10 to-primary/5 p-6 hover:border-primary/60 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 overflow-hidden relative">
                {/* Glow effect */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10 space-y-5">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl  flex items-center justify-center  shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <DogIcon />
                  </div>

                  {/* Text section */}
                  <div className="space-y-1">
                    <div className="text-4xl sm:text-5xl font-black text-foreground stat-value">
                      {
                        animalData.filter(
                          (d) =>
                            d.petType === "Dog" ||
                            d.petType.toLowerCase() === "dog",
                        ).length
                      }
                    </div>

                    <p className="text-sm font-semibold text-muted uppercase tracking-wider">
                      {t.categories.dog}
                    </p>

                    <p className="text-xs text-muted/70">
                      {
                        animalData.filter(
                          (d) =>
                            d.petType === "Dog" ||
                            d.petType.toLowerCase() === "dog",
                        ).length
                      }{" "}
                      зарлал
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            {/* cat */}
            <Link
              href={"/browse?type=dog"}
              className={`group block animate-fade-up opacity-0 stagger-2`}
            >
              <div className="h-full rounded-2xl border-2 border-primary/30 bg-linear-to-br from-primary/10 to-primary/5 p-6 hover:border-primary/60 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 overflow-hidden relative">
                {/* Glow effect */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10 space-y-5">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl  flex items-center justify-center  shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <CatIcon />
                  </div>

                  {/* Text section */}
                  <div className="space-y-1">
                    <div className="text-4xl sm:text-5xl font-black text-foreground stat-value">
                      {
                        animalData.filter(
                          (d) =>
                            d.petType === "Cat" ||
                            d.petType.toLowerCase() === "cat",
                        ).length
                      }
                    </div>

                    <p className="text-sm font-semibold text-muted uppercase tracking-wider">
                      {t.categories.cat}
                    </p>

                    <p className="text-xs text-muted/70">
                      {
                        animalData.filter(
                          (d) =>
                            d.petType === "Cat" ||
                            d.petType.toLowerCase() === "cat",
                        ).length
                      }{" "}
                      зарлал
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            {/* lost */}
            <Link
              href={"/browse?type=dog"}
              className={`group block animate-fade-up opacity-0 stagger-2`}
            >
              <div className="h-full rounded-2xl border-2 border-primary/30 bg-linear-to-br from-primary/10 to-primary/5 p-6 hover:border-primary/60 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 overflow-hidden relative">
                {/* Glow effect */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10 space-y-5">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl  flex items-center justify-center  shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <SearchIconn />
                  </div>

                  {/* Text section */}
                  <div className="space-y-1">
                    <div className="text-4xl sm:text-5xl font-black text-foreground stat-value">
                      {
                        animalData.filter(
                          (d) =>
                            d.role === "Lost" ||
                            d.role.toLowerCase() === "lost",
                        ).length
                      }
                    </div>

                    <p className="text-sm font-semibold text-muted uppercase tracking-wider">
                      {t.categories.lost}
                    </p>

                    <p className="text-xs text-muted/70">
                      {
                        animalData.filter(
                          (d) =>
                            d.role === "Lost" ||
                            d.role.toLowerCase() === "lost",
                        ).length
                      }{" "}
                      зарлал
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            {/* found */}
            <Link
              href={"/browse?type=dog"}
              className={`group block animate-fade-up opacity-0 stagger-2`}
            >
              <div className="h-full rounded-2xl border-2 border-primary/30 bg-linear-to-br from-primary/10 to-primary/5 p-6 hover:border-primary/60 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 overflow-hidden relative">
                {/* Glow effect */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10 ">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl  flex items-center justify-center  shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <FoundIcon />
                  </div>

                  {/* Text section */}
                  <div className="space-y-1">
                    <div className="text-4xl sm:text-5xl font-black text-foreground stat-value">
                      {
                        animalData.filter(
                          (d) =>
                            d.role === "Found" ||
                            d.role.toLowerCase() === "found",
                        ).length
                      }
                    </div>

                    <p className="text-sm font-semibold text-muted uppercase tracking-wider">
                      {t.categories.found}
                    </p>

                    <p className="text-xs text-muted/70">
                      {
                        animalData.filter(
                          (d) =>
                            d.role === "Found" ||
                            d.role.toLowerCase() === "found",
                        ).length
                      }{" "}
                      зарлал
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Listings */}
      <section className="py-16 bg-card-bg/50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-between mb-12">
            <div className="animate-slide-up">
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                {t.recent.title}
              </h2>
              <p className="text-muted text-lg">{t.recent.description}</p>
            </div>
            <Link
              href="/browse"
              className="hidden md:flex items-center gap-2 text-primary hover:text-primary-dark font-semibold transition-all hover:gap-4 group"
            >
              {t.recent.viewAll}{" "}
              <span className="group-hover:translate-x-2 transition-transform">
                →
              </span>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-sm:grid-cols-2 gap-6">
            {animalData.slice(0, 8).map((pet, index) => (
              <div
                key={pet._id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <PetCard
                  role={pet.role}
                  name={pet.name || t.nerguiii}
                  gender={pet.gender}
                  location={pet.location}
                  description={pet.description}
                  Date={pet.Date}
                  petType={pet.petType}
                  image={pet.image}
                  breed={pet.breed}
                  _id={pet._id}
                  phonenumber={pet.phonenumber}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-2 opacity-5">
          <div className="border-r border-primary"></div>
          <div></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t.howItWorks.title}
            </h2>
            <p className="text-muted text-lg">{t.howItWorks.description}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center animate-slide-up stagger-1 group">
              <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-primary/20">
                <NotificationIcon />
              </div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                {t.howItWorks.step1.title}
              </h3>
              <p className="text-muted leading-relaxed">
                {t.howItWorks.step1.description}
              </p>
              <div className="mt-4 h-1 w-12 bg-primary mx-auto group-hover:w-24 transition-all duration-300"></div>
            </div>

            <div className="text-center animate-slide-up stagger-2 group md:mt-8">
              <div className="w-24 h-24 bg-secondary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-secondary/20 group-hover:scale-110 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-secondary/20">
                <SearchIcon />
              </div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-secondary transition-colors">
                {t.howItWorks.step2.title}
              </h3>
              <p className="text-muted leading-relaxed">
                {t.howItWorks.step2.description}
              </p>
              <div className="mt-4 h-1 w-12 bg-secondary mx-auto group-hover:w-24 transition-all duration-300"></div>
            </div>

            <div className="text-center animate-slide-up stagger-3 group">
              <div className="w-24 h-24 bg-accent/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/20 group-hover:scale-110 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-accent/20">
                <ContactIcon />
              </div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-accent transition-colors">
                {t.howItWorks.step3.title}
              </h3>
              <p className="text-muted leading-relaxed">
                {t.howItWorks.step3.description}
              </p>
              <div className="mt-4 h-1 w-12 bg-accent mx-auto group-hover:w-24 transition-all duration-300"></div>
            </div>
          </div>

          <div className="hidden md:block absolute top-1/3 left-1/4 right-1/4 h-1 bg-linear-to-r from-transparent via-primary/30 to-transparent -z-0"></div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-linear-to-br from-primary to-primary-dark text-white relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="animate-slide-up">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              {t.cta.title}
            </h2>
            <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto leading-relaxed">
              {t.cta.description}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 animate-slide-up stagger-1">
            <Link
              href="/report"
              onClick={handleClick}
              className="px-10 py-4 bg-white text-primary hover:bg-gray-100 rounded-full font-bold text-lg transition-all hover:shadow-2xl hover:-translate-y-1 active:scale-95 relative overflow-hidden group"
            >
              <span className="relative z-10">{t.cta.reportPet}</span>
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <Link
              href="/browse"
              className="px-10 py-4 bg-transparent border-2 border-white hover:bg-white/10 rounded-full font-bold text-lg transition-all hover:-translate-y-1 active:scale-95 backdrop-blur-sm"
            >
              {t.cta.searchPet}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
