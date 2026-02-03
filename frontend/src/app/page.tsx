"use client";

import Link from "next/link";
import { toast } from "react-hot-toast";

import { useAuth, useClerk } from "@clerk/nextjs";

import StatCard from "./components/statcard";
import CategoryCard from "./components/categorycard";
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
  Stat3,
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

export default function Home() {
  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();
  const [animalData, setAnimalData] = useState<lostFound[]>([]);
  const { language } = useLanguage();

  // Translation object
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
        reunited: "Эзэдтэй холбогдсон",
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
        reunited: "Reunited",
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
      const res = await fetch(`http://localhost:8000/lostFound`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
      });
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
      <section className="gradient-hero paw-pattern min-h-[80vh] flex items-center relative overflow-hidden">
        {/* Background shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-accent/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-10 right-1/4 w-48 h-48 bg-primary/10 rounded-full blur-2xl" />
        <div className="absolute bottom-1/3 left-20 w-32 h-32 bg-secondary/15 rounded-full blur-2xl" />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-background/70" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-up opacity-0 stagger-1">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <span className="animate-pulse">●</span>
                {t.hero.badge}
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
                {t.hero.title1}
                <br />
                <span className="text-primary">{t.hero.title2}</span>
              </h1>
              <p className="text-xl text-muted mb-8 max-w-lg">
                {t.hero.description}
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/report"
                  onClick={handleClick}
                  className="px-8 py-4 bg-primary hover:bg-primary-dark text-white rounded-full font-bold text-lg transition-all hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-1"
                >
                  {t.hero.reportButton}
                </Link>
                <Link
                  href="/browse"
                  className="px-8 py-4 bg-card-bg border-2 border-card-border hover:border-primary text-foreground rounded-full font-bold text-lg transition-all hover:-translate-y-1"
                >
                  {t.hero.browseButton}
                </Link>
              </div>
            </div>

            <div className="relative animate-fade-up opacity-0 stagger-2">
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-secondary/20 rounded-full animate-pulse" />
                <div className="absolute inset-4 bg-linear-to-br from-primary/30 to-secondary/30 rounded-full" />
                <div className="absolute inset-8 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=600&fit=crop"
                    alt="Нохой муур хоёр"
                    className="object-cover"
                  />
                </div>
                {/* Floating icons */}
                <div className="absolute -top-4 -right-4 bg-white dark:bg-card-bg rounded-2xl shadow-xl p-4 animate-float">
                  <span className="text-3xl">
                    <DogIcon />
                  </span>
                </div>
                <div
                  className="absolute -bottom-4 -left-4 bg-white dark:bg-card-bg rounded-2xl shadow-xl p-4 animate-float"
                  style={{ animationDelay: "1s" }}
                >
                  <span className="text-3xl">
                    <CatIcon />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 -mt-16 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon={<Stat1 />}
              value={`${animalData.length}`}
              label={t.stats.total}
              color="bg-primary"
            />
            <StatCard
              icon={<Stat2 />}
              value={`${animalData.filter((d) => d.role === "Lost" || d.role.toLowerCase() === "lost").length}`}
              label={t.stats.lost}
              color="bg-gradient-to-br from-red-500 to-rose-500"
            />
            <StatCard
              icon={<Stat3 />}
              value={`${animalData.filter((d) => d.role === "Found" || d.role.toLowerCase() === "found").length}`}
              label={t.stats.found}
              color="bg-gradient-to-br from-green-500 to-emerald-500"
            />
            <StatCard
              icon={<Stat4 />}
              value="89"
              label={t.stats.reunited}
              color="bg-gradient-to-br from-cyan-500 to-blue-500"
            />
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t.categories.title}
            </h2>
            <p className="text-muted text-lg">{t.categories.description}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <CategoryCard
              icon={<DogIcon />}
              title={t.categories.dog}
              count={
                animalData.filter(
                  (d) =>
                    d.petType === "Dog" || d.petType.toLowerCase() === "dog",
                ).length
              }
              href="/browse?type=dog"
              delay="stagger-1"
            />
            <CategoryCard
              icon={<CatIcon />}
              title={t.categories.cat}
              count={
                animalData.filter(
                  (d) =>
                    d.petType === "Cat" || d.petType.toLowerCase() === "cat",
                ).length
              }
              href="/browse?type=cat"
              delay="stagger-2"
            />
            <CategoryCard
              icon={<SearchIconn />}
              title={t.categories.lost}
              count={
                animalData.filter(
                  (d) => d.role === "Lost" || d.role.toLowerCase() === "lost",
                ).length
              }
              href="/browse?status=lost"
              delay="stagger-3"
            />
            <CategoryCard
              icon={<FoundIcon />}
              title={t.categories.found}
              count={
                animalData.filter(
                  (d) => d.role === "Found" || d.role.toLowerCase() === "found",
                ).length
              }
              href="/browse?status=found"
              delay="stagger-4"
            />
          </div>
        </div>
      </section>

      {/* Recent Listings */}
      <section className="py-16 bg-card-bg/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                {t.recent.title}
              </h2>
              <p className="text-muted text-lg">{t.recent.description}</p>
            </div>
            <Link
              href="/browse"
              className="hidden md:flex items-center gap-2 text-primary hover:text-primary-dark font-semibold transition-colors"
            >
              {t.recent.viewAll} <span>→</span>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-sm:grid-cols-2 gap-6">
            {animalData.slice(0, 8).map((pet) => (
              <PetCard
                key={pet._id}
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
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t.howItWorks.title}
            </h2>
            <p className="text-muted text-lg">{t.howItWorks.description}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center animate-fade-up opacity-0 stagger-1">
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <NotificationIcon />
              </div>
              <h3 className="text-xl font-bold mb-3">
                {t.howItWorks.step1.title}
              </h3>
              <p className="text-muted">{t.howItWorks.step1.description}</p>
            </div>
            {/* Step 2 */}
            <div className="text-center animate-fade-up opacity-0 stagger-2">
              <div className="w-20 h-20 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <SearchIcon />
              </div>
              <h3 className="text-xl font-bold mb-3">
                {t.howItWorks.step2.title}
              </h3>
              <p className="text-muted">{t.howItWorks.step2.description}</p>
            </div>
            {/* Step 3 */}
            <div className="text-center animate-fade-up opacity-0 stagger-3">
              <div className="w-20 h-20 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ContactIcon />
              </div>
              <h3 className="text-xl font-bold mb-3">
                {t.howItWorks.step3.title}
              </h3>
              <p className="text-muted">{t.howItWorks.step3.description}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-linear-to-br from-primary to-primary-dark text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{t.cta.title}</h2>
          <p className="text-xl opacity-90 mb-8">{t.cta.description}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/report"
              onClick={handleClick}
              className="px-8 py-4 bg-white text-primary hover:bg-gray-100 rounded-full font-bold text-lg transition-all hover:shadow-xl hover:-translate-y-1"
            >
              {t.cta.reportPet}
            </Link>
            <Link
              href="/browse"
              className="px-8 py-4 bg-transparent border-2 border-white hover:bg-white/10 rounded-full font-bold text-lg transition-all hover:-translate-y-1"
            >
              {t.cta.searchPet}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
