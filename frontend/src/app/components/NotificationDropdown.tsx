"use client";

import Link from "next/link";

import { useRouter } from "next/navigation";
import React from "react";
import { useNotification } from "../contexts/Notificationcontext";

export function NotificationDropdown() {
  const { notifications, markAsRead, clearNotifications, unreadCount } =
    useNotification();
  const router = useRouter();

  const handleNotificationClick = (id: string) => {
    markAsRead(id);
    router.push("/probability");
  };

  const translations = {
    mn: {
      notifications: "Мэдэгдэл",
      noNotifications: "Мэдэгдэл байхгүй",
      newMatch: "Шинэ тохирол олдлоо!",
      clearAll: "Бүгдийг устгах",
      matchFound: "Post-тай",
    },
    en: {
      notifications: "Notifications",
      noNotifications: "No notifications",
      newMatch: "New match found!",
      clearAll: "Clear all",
      matchFound: "matches with",
    },
  };

  // Get language from localStorage or use 'en' as default
  const [language, setLanguage] = React.useState<"mn" | "en">("en");

  React.useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as "mn" | "en";
    if (savedLanguage) setLanguage(savedLanguage);
  }, []);

  const t = translations[language];

  return (
    <div className="absolute right-0 mt-3 w-80 rounded-xl bg-card-bg border border-card-border shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 max-h-96 overflow-y-auto">
      <div className="p-4 border-b border-card-border flex justify-between items-center sticky top-0 bg-card-bg">
        <h3 className="font-bold text-lg">{t.notifications}</h3>
        {notifications.length > 0 && (
          <button
            onClick={clearNotifications}
            className="text-xs text-primary hover:text-primary-dark font-semibold"
          >
            {t.clearAll}
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="p-8 text-center text-muted">
          <svg
            className="w-12 h-12 mx-auto mb-3 opacity-30"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <p>{t.noNotifications}</p>
        </div>
      ) : (
        <div className="divide-y divide-card-border">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleNotificationClick(notif.id)}
              className={`p-4 cursor-pointer hover:bg-primary/5 transition-colors ${
                !notif.read ? "bg-primary/10" : ""
              }`}
            >
              <div className="flex justify-between items-start gap-2 mb-2">
                <h4 className="font-semibold text-sm">{notif.title}</h4>
                {!notif.read && (
                  <span className="w-2 h-2 bg-primary rounded-full shrink-0 mt-1"></span>
                )}
              </div>
              <p className="text-xs text-muted mb-3">{notif.message}</p>

              {/* Match score display */}
              <div className="bg-linear-to-r from-blue-500/10 to-indigo-500/10 rounded-lg p-2 mb-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold">
                    {t.matchFound}{" "}
                    <span className="text-primary">
                      {notif.matchData.matchScore}%
                    </span>
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold ${
                      notif.matchData.confidence === "HIGH"
                        ? "bg-green-100 text-green-700"
                        : notif.matchData.confidence === "MEDIUM"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {notif.matchData.confidence}
                  </span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                {new Date(notif.timestamp).toLocaleString()}
              </p>

              <Link
                href="/probability"
                className="mt-3 block w-full text-center bg-primary hover:bg-primary-dark text-white text-xs font-semibold py-2 rounded-lg transition-colors"
              >
                {t.newMatch} →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
