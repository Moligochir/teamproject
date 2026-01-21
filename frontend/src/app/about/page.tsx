"use client";

import Link from "next/link";
import { useLanguage } from "../contexts/Languagecontext";

export default function AboutPage() {
  const { language } = useLanguage();

  const translations = {
    mn: {
      // Hero section
      missionBadge: "Бидний эрхэм зорилго",
      heroTitle1: "Амьтан бүр гэртээ",
      heroTitle2: "буцах эрхтэй",
      heroDescription:
        "PawFinder нь төөрсөн тэжээвэр амьтдыг хайртай гэр бүлтэй нь холбоход зориулагдсан нийгэмлэгийн платформ юм. Бид амьтан бүр олдох боломжтой гэдэгт итгэдэг.",

      // Stats
      registeredPets: "Бүртгэгдсэн амьтад",
      reunited: "Эзэдтэй холбогдсон",
      communityMembers: "Нийгэмлэгийн гишүүд",
      citiesCovered: "Хамрагдсан хотууд",

      // Our Story
      ourStoryTitle: "Бидний түүх",
      storyPara1:
        "PawFinder нь хувийн туршлагаас төрсөн юм. Манай үүсгэн байгуулагчийн хайртай нохой Макс хоёр долоо хоног алга болоход нийгэмлэг нэгдэж түүнийг гэртээ буцаахад туссан юм. Энэ туршлага биднийг ижил нөхцөлд байгаа бусад амьтны эзэдэд туслах платформ үүсгэхэд урам зориг өгсөн.",
      storyPara2:
        "Бид амьтнаа алдах зовлон, дахин уулзах баярыг ойлгодог. Тиймээс PawFinder-ийг энгийн, үр дүнтэй, нийгэмлэгт тулгуурласан байдлаар бүтээсэн. Манай платформ амьтны эзэд, олсон хүмүүс, туслахыг хүссэн сайн санаатнуудыг холбодог.",
      storyPara3:
        "Нээлтээсээ хойш бид олон зуун амьтныг гэр бүлтэй нь холбоход туссан бөгөөд бид дөнгөж эхэлж байна. Амжилтын түүх бүр биднийг сайжруулж, хүрээгээ тэлэхэд урамшуулдаг.",
      happyReunions: "Аз жаргалтай уулзалтууд!",
      happyPetsAlt: "Аз жаргалтай амьтад",

      // How It Works
      howItWorksTitle: "PawFinder хэрхэн ажилладаг",
      howItWorksDescription:
        "Манай энгийн үйл явц төөрсөн амьтдыг мэдээлэх, олоход хялбар болгодог",
      step1Title: "Мэдээлэх",
      step1Description:
        "Зураг, байршил, тайлбартай дэлгэрэнгүй зарлал үүсгэнэ үү. Мэдээлэл дэлгэрэнгүй байх тусам тохирох магадлал өндөр.",
      step2Title: "Хайх & Тохируулах",
      step2Description:
        "Манай нийгэмлэг зарлалуудаас тохирохыг хайдаг. Байршил, амьтны төрөл, төлөвөөр шүүнэ үү.",
      step3Title: "Холбогдох",
      step3Description:
        "Олсон хүн эсвэл эзэнтэй шууд холбогдоно уу. Эзэмшлийг баталгаажуулж, амьтныг гэр бүлтэй нь аюулгүй холбоно уу.",

      // Team
      teamTitle: "Манай баг",
      teamDescription: "Гэр бүлүүдийг холбоход зориулсан амьтан хайрлагчид",
      founder: "Багийн аxлагч ",
      communityManager: "Frontend - Туслах",
      operationsDirector: "Backend - Axлагч",
      uugana: "Frontend - Туслах",
      ariuk: "Backend - Туслах",
      ociro: "Backend - Туслах",

      // CTA
      ctaTitle: "Туслахад бэлэн үү?",
      ctaDescription:
        "Амьтан хайрлагчдын нийгэмлэгт нэгдэж, төөрсөн амьтдыг гэр бүлтэй нь холбоход туслаарай.",
      submitReport: "Мэдээлэл оруулах",
      viewListings: "Зарлалууд үзэх",
    },
    en: {
      // Hero section
      missionBadge: "Our Mission",
      heroTitle1: "Every Pet Deserves",
      heroTitle2: "to Come Home",
      heroDescription:
        "PawFinder is a community-driven platform dedicated to reuniting lost pets with their loving families. We believe every pet deserves a chance to be found.",

      // Stats
      registeredPets: "Registered Pets",
      reunited: "Successfully Reunited",
      communityMembers: "Community Members",
      citiesCovered: "Cities Covered",

      // Our Story
      ourStoryTitle: "Our Story",
      storyPara1:
        "PawFinder was born from personal experience. When our founder's beloved dog Max went missing for two weeks, the community rallied together to bring him home. This experience inspired us to create a platform to help other pet owners in similar situations.",
      storyPara2:
        "We understand the heartache of losing a pet and the joy of reunion. That's why we built PawFinder to be simple, effective, and community-focused. Our platform connects pet owners, finders, and good samaritans who want to help.",
      storyPara3:
        "Since our launch, we've helped reunite hundreds of pets with their families, and we're just getting started. Every success story motivates us to improve and expand our reach.",
      happyReunions: "Happy Reunions!",
      happyPetsAlt: "Happy Pets",

      // How It Works
      howItWorksTitle: "How PawFinder Works",
      howItWorksDescription:
        "Our simple process makes it easy to report and find lost pets",
      step1Title: "Report",
      step1Description:
        "Create a detailed listing with photos, location, and description. The more information, the better the chance of a match.",
      step2Title: "Search & Match",
      step2Description:
        "Our community searches listings for matches. Filter by location, pet type, and status.",
      step3Title: "Connect",
      step3Description:
        "Connect directly with finders or owners. Verify ownership and safely reunite pets with their families.",

      // Team
      teamTitle: "Our Team",
      teamDescription: "Pet lovers dedicated to reuniting families",
      founder: " Team Leader ",
      communityManager: "Frontend - Assistant",
      operationsDirector: "Backend - Leader",
      uugana: "Frontend - Assistant",
      ariuk: "Backend - Assistant",
      ociro: "Backend - Assistant",

      // CTA
      ctaTitle: "Ready to Help?",
      ctaDescription:
        "Join our community of pet lovers and help reunite lost pets with their families.",
      submitReport: "Submit a Report",
      viewListings: "Browse Listings",
    },
  };

  const t = translations[language];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <span className="text-xl">🐾</span>
            {t.missionBadge}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {t.heroTitle1}
            <br />
            <span className="text-primary">{t.heroTitle2}</span>
          </h1>
          <p className="text-xl text-muted max-w-3xl mx-auto">
            {t.heroDescription}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          <div className="bg-card-bg rounded-2xl p-6 border border-card-border text-center">
            <div className="text-4xl font-bold text-primary mb-2">248</div>
            <div className="text-muted">{t.registeredPets}</div>
          </div>
          <div className="bg-card-bg rounded-2xl p-6 border border-card-border text-center">
            <div className="text-4xl font-bold text-found mb-2">89</div>
            <div className="text-muted">{t.reunited}</div>
          </div>
          <div className="bg-card-bg rounded-2xl p-6 border border-card-border text-center">
            <div className="text-4xl font-bold text-secondary mb-2">1.2K</div>
            <div className="text-muted">{t.communityMembers}</div>
          </div>
          <div className="bg-card-bg rounded-2xl p-6 border border-card-border text-center">
            <div className="text-4xl font-bold text-accent mb-2">15</div>
            <div className="text-muted">{t.citiesCovered}</div>
          </div>
        </div>

        {/* Our Story */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold mb-6">{t.ourStoryTitle}</h2>
            <div className="space-y-4 text-muted leading-relaxed">
              <p>{t.storyPara1}</p>
              <p>{t.storyPara2}</p>
              <p>{t.storyPara3}</p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden border border-card-border">
              <img
                src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=600&h=600&fit=crop"
                alt={t.happyPetsAlt}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-primary text-white rounded-2xl p-6 shadow-xl max-w-50">
              <div className="text-3xl font-bold mb-1">89+</div>
              <div className="text-sm opacity-90">{t.happyReunions}</div>
            </div>
          </div>
        </div>

        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t.howItWorksTitle}</h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              {t.howItWorksDescription}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="bg-card-bg rounded-2xl p-8 border border-card-border h-full">
                <div className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center font-bold text-xl mb-6">
                  1
                </div>
                <h3 className="text-xl font-bold mb-3">{t.step1Title}</h3>
                <p className="text-muted">{t.step1Description}</p>
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
                <h3 className="text-xl font-bold mb-3">{t.step2Title}</h3>
                <p className="text-muted">{t.step2Description}</p>
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
                <h3 className="text-xl font-bold mb-3">{t.step3Title}</h3>
                <p className="text-muted">{t.step3Description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t.teamTitle}</h2>
            <p className="text-muted text-lg">{t.teamDescription} 🐾</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: language === "mn" ? "Сундуйбазар" : "Sunduibazrr",
                role: t.founder,
                image:
                  "https://png.pngtree.com/png-vector/20191110/ourmid/pngtree-avatar-icon-profile-icon-member-login-vector-isolated-png-image_1978396.jpg",
              },
              {
                name: language === "mn" ? "Ангараг" : "Angarag",
                role: t.communityManager,
                image:
                  "https://png.pngtree.com/png-vector/20191110/ourmid/pngtree-avatar-icon-profile-icon-member-login-vector-isolated-png-image_1978396.jpg",
              },
              {
                name: language === "mn" ? "Мандах" : "Mandah",
                role: t.operationsDirector,
                image:
                  "https://png.pngtree.com/png-vector/20191110/ourmid/pngtree-avatar-icon-profile-icon-member-login-vector-isolated-png-image_1978396.jpg",
              },
              {
                name: language === "mn" ? "Ууганаа" : "Uuganaa",
                role: t.uugana,
                image:
                  "https://png.pngtree.com/png-vector/20191110/ourmid/pngtree-avatar-icon-profile-icon-member-login-vector-isolated-png-image_1978396.jpg",
              },
              {
                name: language === "mn" ? "Ариук" : "Ariuk",
                role: t.ariuk,
                image:
                  "https://png.pngtree.com/png-vector/20191110/ourmid/pngtree-avatar-icon-profile-icon-member-login-vector-isolated-png-image_1978396.jpg",
              },
              {
                name: language === "mn" ? "Очироо" : "Ociroo",
                role: t.ociro,
                image:
                  "https://png.pngtree.com/png-vector/20191110/ourmid/pngtree-avatar-icon-profile-icon-member-login-vector-isolated-png-image_1978396.jpg",
              },
            ].map((member) => (
              <div key={member.name} className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-primary/20">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <h3 className="font-bold text-lg">{member.name}</h3>
                <p className="text-muted">{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-linear-to-br from-primary to-primary-dark text-white rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">{t.ctaTitle}</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            {t.ctaDescription}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/report"
              className="px-8 py-4 bg-white text-primary hover:bg-gray-100 rounded-full font-bold text-lg transition-all hover:shadow-xl"
            >
              {t.submitReport}
            </Link>
            <Link
              href="/browse"
              className="px-8 py-4 bg-transparent border-2 border-white hover:bg-white/10 rounded-full font-bold text-lg transition-all"
            >
              {t.viewListings}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
