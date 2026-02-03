"use client";

import { ThemeProvider } from "../components/ThemeProvider";
import { LanguageProvider } from "../contexts/Languagecontext";
import { NotificationProvider } from "../contexts/Notificationcontext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <LanguageProvider>{children}</LanguageProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}
