import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <span className="text-xl">🐾</span>
            Бидний эрхэм зорилго
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Амьтан бүр гэртээ
            <br />
            <span className="text-primary">буцах эрхтэй</span>
          </h1>
          <p className="text-xl text-muted max-w-3xl mx-auto">
            PawFinder нь төөрсөн тэжээвэр амьтдыг хайртай гэр бүлтэй нь холбоход
            зориулагдсан нийгэмлэгийн платформ юм. Бид амьтан бүр олдох
            боломжтой гэдэгт итгэдэг.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          <div className="bg-card-bg rounded-2xl p-6 border border-card-border text-center">
            <div className="text-4xl font-bold text-primary mb-2">248</div>
            <div className="text-muted">Бүртгэгдсэн амьтад</div>
          </div>
          <div className="bg-card-bg rounded-2xl p-6 border border-card-border text-center">
            <div className="text-4xl font-bold text-found mb-2">89</div>
            <div className="text-muted">Эзэдтэй холбогдсон</div>
          </div>
          <div className="bg-card-bg rounded-2xl p-6 border border-card-border text-center">
            <div className="text-4xl font-bold text-secondary mb-2">1.2K</div>
            <div className="text-muted">Нийгэмлэгийн гишүүд</div>
          </div>
          <div className="bg-card-bg rounded-2xl p-6 border border-card-border text-center">
            <div className="text-4xl font-bold text-accent mb-2">15</div>
            <div className="text-muted">Хамрагдсан хотууд</div>
          </div>
        </div>

        {/* Our Story */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold mb-6">Бидний түүх</h2>
            <div className="space-y-4 text-muted leading-relaxed">
              <p>
                PawFinder нь хувийн туршлагаас төрсөн юм. Манай үүсгэн
                байгуулагчийн хайртай нохой Макс хоёр долоо хоног алга болоход
                нийгэмлэг нэгдэж түүнийг гэртээ буцаахад туссан юм. Энэ туршлага
                биднийг ижил нөхцөлд байгаа бусад амьтны эзэдэд туслах платформ
                үүсгэхэд урам зориг өгсөн.
              </p>
              <p>
                Бид амьтнаа алдах зовлон, дахин уулзах баярыг ойлгодог. Тиймээс
                PawFinder-ийг энгийн, үр дүнтэй, нийгэмлэгт тулгуурласан
                байдлаар бүтээсэн. Манай платформ амьтны эзэд, олсон хүмүүс,
                туслахыг хүссэн сайн санаатнуудыг холбодог.
              </p>
              <p>
                Нээлтээсээ хойш бид олон зуун амьтныг гэр бүлтэй нь холбоход
                туссан бөгөөд бид дөнгөж эхэлж байна. Амжилтын түүх бүр биднийг
                сайжруулж, хүрээгээ тэлэхэд урамшуулдаг.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden border border-card-border">
              <img
                src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=600&h=600&fit=crop"
                alt="Аз жаргалтай амьтад"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-primary text-white rounded-2xl p-6 shadow-xl max-w-[200px]">
              <div className="text-3xl font-bold mb-1">89+</div>
              <div className="text-sm opacity-90">Аз жаргалтай уулзалтууд!</div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              PawFinder хэрхэн ажилладаг
            </h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              Манай энгийн үйл явц төөрсөн амьтдыг мэдээлэх, олоход хялбар
              болгодог
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="bg-card-bg rounded-2xl p-8 border border-card-border h-full">
                <div className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center font-bold text-xl mb-6">
                  1
                </div>
                <h3 className="text-xl font-bold mb-3">Мэдээлэх</h3>
                <p className="text-muted">
                  Зураг, байршил, тайлбартай дэлгэрэнгүй зарлал үүсгэнэ үү.
                  Мэдээлэл дэлгэрэнгүй байх тусам тохирох магадлал өндөр.
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-primary text-2xl">
                →
              </div>
            </div>
            <div className="relative">
              <div className="bg-card-bg rounded-2xl p-8 border border-card-border h-full">
                <div className="w-12 h-12 bg-secondary text-white rounded-xl flex items-center justify-center font-bold text-xl mb-6">
                  2
                </div>
                <h3 className="text-xl font-bold mb-3">Хайх & Тохируулах</h3>
                <p className="text-muted">
                  Манай нийгэмлэг зарлалуудаас тохирохыг хайдаг. Байршил, амьтны
                  төрөл, төлөвөөр шүүнэ үү.
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-primary text-2xl">
                →
              </div>
            </div>
            <div>
              <div className="bg-card-bg rounded-2xl p-8 border border-card-border h-full">
                <div className="w-12 h-12 bg-accent text-white rounded-xl flex items-center justify-center font-bold text-xl mb-6">
                  3
                </div>
                <h3 className="text-xl font-bold mb-3">Холбогдох</h3>
                <p className="text-muted">
                  Олсон хүн эсвэл эзэнтэй шууд холбогдоно уу. Эзэмшлийг
                  баталгаажуулж, амьтныг гэр бүлтэй нь аюулгүй холбоно уу.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Манай баг</h2>
            <p className="text-muted text-lg">
              Гэр бүлүүдийг холбоход зориулсан амьтан хайрлагчид
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Сараа",
                role: "Үүсгэн байгуулагч & CEO",
                image:
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
              },
              {
                name: "Батаа",
                role: "Нийгэмлэгийн менежер",
                image:
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
              },
              {
                name: "Оюунаа",
                role: "Үйл ажиллагааны удирдагч",
                image:
                  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
              },
            ].map((member) => (
              <div key={member.name} className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-primary/20">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="object-cover"
                  />
                </div>
                <h3 className="font-bold text-lg">{member.name}</h3>
                <p className="text-muted">{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-primary to-primary-dark text-white rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Туслахад бэлэн үү?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Амьтан хайрлагчдын нийгэмлэгт нэгдэж, төөрсөн амьтдыг гэр бүлтэй нь
            холбоход туслаарай.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/report"
              className="px-8 py-4 bg-white text-primary hover:bg-gray-100 rounded-full font-bold text-lg transition-all hover:shadow-xl"
            >
              Мэдээлэл оруулах
            </Link>
            <Link
              href="/browse"
              className="px-8 py-4 bg-transparent border-2 border-white hover:bg-white/10 rounded-full font-bold text-lg transition-all"
            >
              Зарлалууд үзэх
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
