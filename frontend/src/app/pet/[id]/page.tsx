"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
type lostFound = {
  role: string;
  userId: {
    name: string;
    email: string;
    phoneNumber: number;
  };
  name: string;
  gender: string;
  location: string;
  description: string;
  Date: string;
  petType: string;
  image: string;
  breed: string;
  _id: string;
  phonenumber: number;
};
export default function PetDetailPage() {
  const params = useParams();
  const { id } = params;

  if (!id) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🐾</div>
          <h1 className="text-3xl font-bold mb-4">Амьтан олдсонгүй</h1>
          <p className="text-muted mb-6">
            Таны хайж буй амьтан байхгүй эсвэл устгагдсан байна.
          </p>
          <Link
            href="/browse"
            className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-full font-semibold transition-all"
          >
            Бүх амьтдыг үзэх
          </Link>
        </div>
      </div>
    );
  }
  const [animalData, setAnimalData] = useState<lostFound[]>([]);
  const GetLostFound = async () => {
    try {
      const res = await fetch(`http://localhost:8000/lostFound/findid/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
      });
      const data = await res.json();
      console.log("Userss:", data);
      setAnimalData(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    GetLostFound();
  }, []);
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-muted">
            <li>
              <Link href="/" className="hover:text-primary transition-colors">
                Нүүр
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link
                href="/browse"
                className="hover:text-primary transition-colors"
              >
                Амьтад
              </Link>
            </li>
            <li>/</li>
            <li className="text-foreground font-medium">
              {animalData[0]?.name}
            </li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden border border-card-border">
              <img
                src={animalData[0]?.image}
                alt={animalData[0]?.name}
                className="object-cover"
              />
              <div
                className={`absolute top-4 left-4 px-4 py-2 rounded-full text-sm font-bold ${
                  animalData[0]?.role === "lost"
                    ? "status-lost"
                    : "status-found"
                }`}
              >
                {animalData[0]?.role === "lost" ? "🔍 Төөрсөн" : "✓ Олдсон"}
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">
                  {animalData[0]?.petType === "dog" ? "🐕" : "🐱"}
                </span>
                <h1 className="text-4xl font-bold">{animalData[0]?.name}</h1>
              </div>
              <p className="text-xl text-muted">{animalData[0]?.breed}</p>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card-bg rounded-xl p-4 border border-card-border">
                <div className="text-sm text-muted mb-1">Төлөв</div>
                <div
                  className={`font-bold ${
                    animalData[0]?.role === "lost" ? "text-lost" : "text-found"
                  }`}
                >
                  {animalData[0]?.role === "lost" ? "Төөрсөн" : "Олдсон"}
                </div>
              </div>
              <div className="bg-card-bg rounded-xl p-4 border border-card-border">
                <div className="text-sm text-muted mb-1">Төрөл</div>
                <div className="font-bold">
                  {animalData[0]?.petType === "dog" ? "Нохой" : "Муур"}
                </div>
              </div>
              <div className="bg-card-bg rounded-xl p-4 border border-card-border">
                <div className="text-sm text-muted mb-1">Хүйс</div>
                <div className="font-bold">{animalData[0]?.gender}</div>
              </div>
              <div className="bg-card-bg rounded-xl p-4 border border-card-border">
                <div className="text-sm text-muted mb-1">Огноо</div>
                <div className="font-bold">
                  {animalData[0]?.Date.slice(0, 10)}
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-card-bg rounded-xl p-4 border border-card-border">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-5 h-5 text-primary"
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
                <span className="text-sm text-muted">
                  {animalData[0]?.role === "lost"
                    ? "Сүүлд харсан байршил"
                    : "Олсон байршил"}
                </span>
              </div>
              <div className="font-bold text-lg">{animalData[0]?.location}</div>
            </div>

            {/* Description */}
            <div className="bg-card-bg rounded-xl p-4 border border-card-border">
              <h3 className="font-bold mb-2">Тайлбар</h3>
              <p className="text-muted leading-relaxed">
                {animalData[0]?.description}
              </p>
            </div>

            {/* Contact Section */}
            <div className="bg-linear-to-br from-primary/10 to-secondary/10 rounded-xl p-6 border border-primary/20">
              <h3 className="font-bold text-lg mb-4">Холбоо барих мэдээлэл</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-muted">Оруулсан</div>
                    <div className="font-medium">
                      {animalData[0]?.userId?.name}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-muted">Имэйл</div>
                    <a
                      href={`mailto:${animalData[0]?.userId?.email}`}
                      className="font-medium text-primary hover:text-primary-dark transition-colors"
                    >
                      {animalData[0]?.userId?.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-muted">Утас</div>
                    <a
                      href={`tel:${animalData[0]?.phonenumber}`}
                      className="font-medium text-primary hover:text-primary-dark transition-colors"
                    >
                      {animalData[0]?.phonenumber}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={`mailto:${animalData[0]?.userId?.email}?subject=${animalData[0]?.role === "lost" ? "Төөрсөн" : "Олдсон"} ${animalData[0]?.petType === "dog" ? "нохой" : "муур"}: ${animalData[0]?.name}&body=Сайн байна уу,%0D%0A%0D%0AБи таны ${animalData[0]?.role === "lost" ? "төөрсөн" : "олдсон"} ${animalData[0]?.petType === "dog" ? "нохой" : "муур"} болох ${animalData[0]?.name} тухай мэдээллийг хараад танд хандаж байна.%0D%0A%0D%0A[Энд таны мессежийг бичнэ үү]%0D%0A%0D%0AХүндэтгэсэн,%0D%0A[Таны нэр]`}
                className="flex-1 px-6 py-4 bg-primary hover:bg-primary-dark text-white rounded-full font-bold text-center transition-all hover:shadow-xl hover:shadow-primary/30"
              >
                Имэйлээр холбогдох
              </a>
              <a
                href={`tel:${animalData[0]?.userId?.phoneNumber}`}
                className="flex-1 px-6 py-4 bg-card-bg border-2 border-card-border hover:border-primary text-foreground rounded-full font-bold text-center transition-all"
              >
                Утсаар залгах
              </a>
            </div>
          </div>
        </div>

        {/* Share Section */}
        <div className="mt-12 bg-card-bg rounded-2xl border border-card-border p-6 text-center">
          <h3 className="font-bold text-lg mb-3">Түгээхэд туслаарай</h3>
          <p className="text-muted mb-4">
            Энэ зарлалыг хуваалцаж {animalData[0]?.userId?.name}-д{" "}
            {animalData[0]?.role === "lost"
              ? "гэртээ буцахад"
              : "гэр бүлээ олоход"}{" "}
            туслаарай
          </p>
          <div className="flex justify-center gap-4">
            <button className="w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </button>
            <button className="w-12 h-12 bg-sky-500 hover:bg-sky-600 text-white rounded-full flex items-center justify-center transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
            </button>
            <button className="w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </button>
            <button className="w-12 h-12 bg-gray-600 hover:bg-gray-700 text-white rounded-full flex items-center justify-center transition-colors">
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
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
