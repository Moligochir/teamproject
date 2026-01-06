import type { Metadata } from "next";
import { Nunito, Nunito_Sans } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { ThemeProvider } from "./components/ThemeProvider";
import { Navbar } from "./components/Navbar";
import { ClerkProvider } from "@clerk/nextjs";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PawFinder - Төөрсөн & Олдсон Тэжээвэр Амьтад",
  description:
    "Төөрсөн тэжээвэр амьтдыг гэр бүлтэй нь холбоход туслана. Олдсон амьтдын мэдээлэл оруулах эсвэл төөрсөн найзаа хайх.",
};

function Footer() {
  return (
    <footer className="bg-card-bg border-t border-card-border py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 18c-1.5 0-2.7 1.2-2.7 2.7s1.2 2.7 2.7 2.7 2.7-1.2 2.7-2.7-1.2-2.7-2.7-2.7zm-4.3-2.7c-.9 0-1.6.7-1.6 1.6s.7 1.6 1.6 1.6 1.6-.7 1.6-1.6-.7-1.6-1.6-1.6zm8.6 0c-.9 0-1.6.7-1.6 1.6s.7 1.6 1.6 1.6 1.6-.7 1.6-1.6-.7-1.6-1.6-1.6zm-6.5-2.7c-.9 0-1.6.7-1.6 1.6s.7 1.6 1.6 1.6 1.6-.7 1.6-1.6-.7-1.6-1.6-1.6zm4.3 0c-.9 0-1.6.7-1.6 1.6s.7 1.6 1.6 1.6 1.6-.7 1.6-1.6-.7-1.6-1.6-1.6z" />
                </svg>
              </div>
              <span className="text-xl font-bold">PawFinder</span>
            </div>
            <p className="text-muted max-w-md">
              Төөрсөн тэжээвэр амьтдыг хайртай гэр бүлтэй нь холбоход туслана.
              Амьтан бүр гэртээ буцах эрхтэй.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Түргэн холбоосууд</h3>
            <ul className="space-y-2 text-muted">
              <li><Link href="/browse">Амьтад үзэх</Link></li>
              <li><Link href="/report">Мэдээлэл оруулах</Link></li>
              <li><Link href="/about">Бидний тухай</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Ангилал</h3>
            <ul className="space-y-2 text-muted">
              <li><Link href="/browse?type=dog">Нохой</Link></li>
              <li><Link href="/browse?type=cat">Муур</Link></li>
              <li><Link href="/browse?status=lost">Төөрсөн</Link></li>
              <li><Link href="/browse?status=found">Олдсон</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-card-border mt-8 pt-8 text-center text-muted">
          <p>© 2026 PawFinder. Бүх тэжээвэр амьтдад ❤️ зориулав.</p>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="mn" suppressHydrationWarning>
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  try {
                    var theme = localStorage.getItem('theme');
                    if (theme === 'dark') {
                      document.documentElement.classList.add('dark');
                    } else if (theme === 'light') {
                      document.documentElement.classList.add('light');
                    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                      document.documentElement.classList.add('dark');
                    } else {
                      document.documentElement.classList.add('light');
                    }
                  } catch (e) {}
                })();
              `,
            }}
          />
        </head>

        <body className={`${nunito.variable} ${nunitoSans.variable} antialiased`}>
          <ThemeProvider>
            <Navbar />
            <main className="pt-16">{children}</main>
            <Footer />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
