import Link from "next/link";
import Image from "next/image";
import { ContactIcon, NotificationIcon, SearchIcon } from "./components/icons";

// Жишээ өгөгдөл - бодит апп-д энэ нь өгөгдлийн сангаас ирнэ
const recentPets = [
  {
    id: 1,
    name: "Макс",
    type: "dog",
    breed: "Алтан ретривер",
    status: "lost",
    location: "Төв цэцэрлэгт хүрээлэн",
    date: "2026.01.03",
    image:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop",
    description: "Найрсаг алтан ретривер, цэнхэр хүзүүвчтэй",
  },
  {
    id: 2,
    name: "Луна",
    type: "cat",
    breed: "Сиам",
    status: "found",
    location: "Царс гудамж",
    date: "2026.01.04",
    image:
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop",
    description: "Үзэсгэлэнтэй сиам муур, тайван найрсаг",
  },
  {
    id: 3,
    name: "Бадди",
    type: "dog",
    breed: "Лабрадор",
    status: "lost",
    location: "Голын эрэг",
    date: "2026.01.02",
    image:
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop",
    description: "Хар лабрадор, цээжин дээр цагаан толботой",
  },
  {
    id: 4,
    name: "Мишка",
    type: "cat",
    breed: "Табби",
    status: "found",
    location: "Нарлаг гудамж",
    date: "2026.01.05",
    image:
      "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&h=400&fit=crop",
    description: "Улбар шар табби муур, маш тоглоомч",
  },
  {
    id: 5,
    name: "Роки",
    type: "dog",
    breed: "Герман хоньч",
    status: "lost",
    location: "Хотын төв",
    date: "2026.01.01",
    image:
      "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400&h=400&fit=crop",
    description: "Том герман хоньч, Роки гэж дуудахад хариулдаг",
  },
  {
    id: 6,
    name: "Мими",
    type: "cat",
    breed: "Перс",
    status: "found",
    location: "Нарсны гудамж",
    date: "2026.01.04",
    image:
      "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=400&h=400&fit=crop",
    description: "Цагаан перс муур, хөх нүдтэй",
  },
];

function PetCard({ pet }: { pet: (typeof recentPets)[0] }) {
  return (
    <Link
      href={`/pet/${pet.id}`}
      className="pet-card block bg-card-bg rounded-2xl overflow-hidden border border-card-border"
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={pet.image}
          alt={pet.name}
          fill
          className="object-cover transition-transform duration-300 hover:scale-110"
        />
        <div
          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-sm font-semibold ${
            pet.status === "lost" ? "status-lost" : "status-found"
          }`}
        >
          {pet.status === "lost" ? "🔍 Төөрсөн" : "✓ Олдсон"}
        </div>
        <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/50 text-white text-sm font-medium backdrop-blur-sm">
          {pet.type === "dog" ? "🐕 Нохой" : "🐱 Муур"}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-lg">{pet.name}</h3>
          <span className="text-sm text-muted">{pet.date}</span>
        </div>
        <p className="text-muted text-sm mb-2">{pet.breed}</p>
        <div className="flex items-center gap-1 text-sm text-muted">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          {pet.location}
        </div>
      </div>
    </Link>
  );
}

function StatCard({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: string;
}) {
  return (
    <div className="bg-card-bg rounded-2xl p-6 border border-card-border animate-fade-up opacity-0">
      <div
        className={`w-14 h-14 rounded-xl ${color} flex items-center justify-center mb-4`}
      >
        {icon}
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-muted">{label}</div>
    </div>
  );
}

function CategoryCard({
  icon,
  title,
  count,
  href,
  delay,
}: {
  icon: string;
  title: string;
  count: number;
  href: string;
  delay: string;
}) {
  return (
    <Link
      href={href}
      className={`pet-card bg-card-bg rounded-2xl p-6 border border-card-border text-center animate-fade-up opacity-0 ${delay}`}
    >
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="font-bold text-lg mb-1">{title}</h3>
      <p className="text-muted">{count} зарлал</p>
    </Link>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-hero paw-pattern min-h-[80vh] flex items-center relative overflow-hidden">
        {/* Decorative background shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/3 w-64 h-64 bg-accent/15 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
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
                  <Image
                    src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=600&fit=crop"
                    alt="Нохой муур хоёр"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                {/* Floating elements */}
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
              icon={
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              }
              value="248"
              label="Нийт зарлал"
              color="bg-primary"
            />
            <StatCard
              icon={
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              }
              value="112"
              label="Төөрсөн"
              color="bg-lost"
            />
            <StatCard
              icon={
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              }
              value="136"
              label="Олдсон"
              color="bg-found"
            />
            <StatCard
              icon={
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              }
              value="89"
              label="Эзэдтэй холбогдсон"
              color="bg-secondary"
            />
          </div>
        </div>
      </section>

      {/* Browse by Category */}
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
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-semibold transition-colors"
            >
              Бүх зарлалуудыг үзэх
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
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

      {/* CTA Section */}
      <section className="py-20 bg-linear-to-br from-primary to-primary-dark text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Туслахад бэлэн үү?
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Зарлал бүр төөрсөн амьтныг гэртээ нэг алхам ойртуулна. Манай
            нийгэмлэгт нэгдээрэй!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/report"
              className="px-8 py-4 bg-white text-primary hover:bg-gray-100 rounded-full font-bold text-lg transition-all hover:shadow-xl hover:-translate-y-1"
            >
              Олдсон амьтан мэдээлэх
            </Link>
            <Link
              href="/browse"
              className="px-8 py-4 bg-transparent border-2 border-white hover:bg-white/10 rounded-full font-bold text-lg transition-all hover:-translate-y-1"
            >
              Төөрсөн амьтад хайх
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
