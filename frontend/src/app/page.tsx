"use client";

import Link from "next/link";
import { toast } from "react-hot-toast";

import { useAuth, useClerk } from "@clerk/nextjs";

import PetCard from "./components/petcard";
import StatCard from "./components/statcard";
import CategoryCard from "./components/categorycard";
import { ContactIcon, NotificationIcon, SearchIcon } from "./components/icons";
import { useEffect, useState } from "react";

type lostFound = {
  role: string;
  name: string;
  gender: string;
  location: string;
  description: string;
  Date: Date;
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

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isSignedIn) {
      e.preventDefault();
      toast("Та нэвтрэх шаардлагатай");

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
                Тэжээвэр амьтдыг гэртээ буцаахад туслана
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
                Төөрсөн Амьтдыг
                <br />
                <span className="text-primary">Гэр Бүлтэй нь Холбоно</span>
              </h1>
              <p className="text-xl text-muted mb-8 max-w-lg">
                Төөрсөн амьтан олсон уу эсвэл өөрийн тэжээвэр амьтнаа алдсан уу?
                Манай платформ төөрсөн амьтдыг эзэдтэй нь холбоход туслана.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/report"
                  onClick={handleClick}
                  className="px-8 py-4 bg-primary hover:bg-primary-dark text-white rounded-full font-bold text-lg transition-all hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-1"
                >
                  Мэдээлэл оруулах
                </Link>
                <Link
                  href="/browse"
                  className="px-8 py-4 bg-card-bg border-2 border-card-border hover:border-primary text-foreground rounded-full font-bold text-lg transition-all hover:-translate-y-1"
                >
                  Зарлалууд үзэх
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
                  <span className="text-3xl">🐕</span>
                </div>
                <div
                  className="absolute -bottom-4 -left-4 bg-white dark:bg-card-bg rounded-2xl shadow-xl p-4 animate-float"
                  style={{ animationDelay: "1s" }}
                >
                  <span className="text-3xl">🐱</span>
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
              icon={<svg>...</svg>}
              value="248"
              label="Нийт зарлал"
              color="bg-primary"
            />
            <StatCard
              icon={<svg>...</svg>}
              value="112"
              label="Төөрсөн"
              color="bg-lost"
            />
            <StatCard
              icon={<svg>...</svg>}
              value="136"
              label="Олдсон"
              color="bg-found"
            />
            <StatCard
              icon={<svg>...</svg>}
              value="89"
              label="Эзэдтэй холбогдсон"
              color="bg-secondary"
            />
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ангилалаар хайх
            </h2>
            <p className="text-muted text-lg">
              Төрөл болон төлөвөөр ангилсан амьтдыг үзэх
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <CategoryCard
              icon="🐕"
              title="Нохой"
              count={142}
              href="/browse?type=dog"
              delay="stagger-1"
            />
            <CategoryCard
              icon="🐱"
              title="Муур"
              count={106}
              href="/browse?type=cat"
              delay="stagger-2"
            />
            <CategoryCard
              icon="🔍"
              title="Төөрсөн"
              count={112}
              href="/browse?status=lost"
              delay="stagger-3"
            />
            <CategoryCard
              icon="✅"
              title="Олдсон"
              count={136}
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
                Сүүлийн зарлалууд
              </h2>
              <p className="text-muted text-lg">
                Эдгээр амьтдыг гэртээ буцаахад туслаарай
              </p>
            </div>
            <Link
              href="/browse"
              className="hidden md:flex items-center gap-2 text-primary hover:text-primary-dark font-semibold transition-colors"
            >
              Бүгдийг үзэх
              <svg className="w-5 h-5">...</svg>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {animalData.map((pet) => (
              <PetCard
                key={pet._id}
                petType={pet.petType}
                role={pet.role}
                name={pet.name}
                gender={pet.gender}
                location={pet.location}
                description={pet.description}
                Date={pet.Date}
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
              Хэрхэн ажилладаг вэ?
            </h2>
            <p className="text-muted text-lg">
              Амьтдыг гэр бүлтэй нь холбох энгийн алхамууд
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center animate-fade-up opacity-0 stagger-1">
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <NotificationIcon />
              </div>
              <h3 className="text-xl font-bold mb-3">1. Мэдээлэх</h3>
              <p className="text-muted">
                Амьтан олсон уу эсвэл алдсан уу? Зураг болон байршлын
                дэлгэрэнгүй мэдээлэлтэй зарлал үүсгэнэ үү.
              </p>
            </div>
            {/* Step 2 */}
            <div className="text-center animate-fade-up opacity-0 stagger-2">
              <div className="w-20 h-20 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <SearchIcon />
              </div>
              <h3 className="text-xl font-bold mb-3">2. Хайх</h3>
              <p className="text-muted">
                Зарлалуудыг үзэж, байршил, амьтны төрөл, төлөвөөр шүүж тохирохыг
                олно уу.
              </p>
            </div>
            {/* Step 3 */}
            <div className="text-center animate-fade-up opacity-0 stagger-3">
              <div className="w-20 h-20 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ContactIcon />
              </div>
              <h3 className="text-xl font-bold mb-3">3. Холбогдох</h3>
              <p className="text-muted">
                Амьтны эзэн эсвэл олсон хүнтэй холбогдож, амьтдыг гэртээ
                буцаахад туслаарай!
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-linear-to-br from-primary to-primary-dark text-white">
        {" "}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {" "}
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {" "}
            Туслахад бэлэн үү?{" "}
          </h2>{" "}
          <p className="text-xl opacity-90 mb-8">
            {" "}
            Зарлал бүр төөрсөн амьтныг гэртээ нэг алхам ойртуулна. Манай
            нийгэмлэгт нэгдээрэй!{" "}
          </p>{" "}
          <div className="flex flex-wrap justify-center gap-4">
            {" "}
            <Link
              href="/report"
              onClick={handleClick}
              className="px-8 py-4 bg-white text-primary hover:bg-gray-100 rounded-full font-bold text-lg transition-all hover:shadow-xl hover:-translate-y-1"
            >
              {" "}
              Олдсон амьтан мэдээлэх{" "}
            </Link>{" "}
            <Link
              href="/browse"
              className="px-8 py-4 bg-transparent border-2 border-white hover:bg-white/10 rounded-full font-bold text-lg transition-all hover:-translate-y-1"
            >
              {" "}
              Төөрсөн амьтад хайх{" "}
            </Link>{" "}
          </div>{" "}
        </div>{" "}
      </section>
    </div>
  );
}
