import type { Metadata } from "next";
import { Nunito, Nunito_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import { Navbar } from "./components/Navbar";
import { ClerkProvider } from "@clerk/nextjs";

import Footer from "./components/Footer";
import { LanguageProvider } from "./contexts/Languagecontext";

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

        <body
          className={`${nunito.variable} ${nunitoSans.variable} antialiased `}
        >
          <ThemeProvider>
            <LanguageProvider>
              <Navbar />
              <main className="pt-16">{children}</main>
              <Footer />
            </LanguageProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
