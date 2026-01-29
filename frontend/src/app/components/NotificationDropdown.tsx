"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/app/contexts/Languagecontext";
import { useNotification } from "@/app/contexts/Notificationcontext";
import { NotificationIcon, NotificationIcon2 } from "./icons";
import { useRouter } from "next/navigation";

export function NotificationDropdown() {
  const router = useRouter();
  const { language } = useLanguage();
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  } = useNotification();

  const translations = {
    mn: {
      notifications: "Мэдэгдэлүүд",
      markAllRead: "Бүгдийг уншсан гэж тэмдэглэх",
      clearAll: "Бүгдийг устгах",
      noNotifications: "Мэдэгдэл байхгүй байна",
      newPost: "✅ Амьтан зарлал амжилтай нэмэгдлээ",
      matchFound: "🎯 Тохирол олдлоо",
      contactRequest: "💬 Холбоо авалт",
      messageReceived: "✉️ Шинэ зурвас",
      viewAll: "Бүгдийг үзэх",
      justNow: "Дөнгөж сая",
      minutesAgo: "минутын өмнө",
      hoursAgo: "цагийн өмнө",
      daysAgo: "өдрийн өмнө",
    },
    en: {
      notifications: "Notifications",
      markAllRead: "Mark all as read",
      clearAll: "Clear all",
      noNotifications: "No notifications",
      newPost: "✅ New pet listing added",
      matchFound: "🎯 Match found",
      contactRequest: "💬 Contact request",
      messageReceived: "✉️ New message",
      viewAll: "View all",
      justNow: "Just now",
      minutesAgo: "minutes ago",
      hoursAgo: "hours ago",
      daysAgo: "days ago",
    },
  };

  const t = translations[language];

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const seconds = Math.floor(
      (now.getTime() - new Date(date).getTime()) / 1000,
    );

    if (seconds < 60) return t.justNow;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} ${t.minutesAgo}`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} ${t.hoursAgo}`;
    return `${Math.floor(seconds / 86400)} ${t.daysAgo}`;
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "match":
        return "border-l-4 border-l-green-500";
      case "post":
        return "border-l-4 border-l-blue-500";
      case "contact":
        return "border-l-4 border-l-orange-500";
      case "message":
        return "border-l-4 border-l-purple-500";
      default:
        return "border-l-4 border-l-primary";
    }
  };

  if (notifications.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-4xl mb-3">
          <NotificationIcon />
        </div>
        <p className="text-sm text-muted">{t.noNotifications}</p>
      </div>
    );
  }

  console.log(notifications, "notiff");

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className=" top-0 bg-card-bg border-b border-card-border p-4 flex flex-col gap-5 items-center justify-between">
        <h3 className="font-bold">{t.notifications}</h3>
        <div>
          {notifications.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={markAllAsRead}
                className="px-2 py-1 text-xs bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors cursor-pointer font-medium"
              >
                {t.markAllRead}
              </button>
              <button
                onClick={clearAll}
                className="px-2 py-1 text-xs bg-red-500/10 text-red-600 rounded hover:bg-red-500/20 transition-colors cursor-pointer font-medium"
              >
                {t.clearAll}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto divide-y divide-card-border">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`p-4 hover:bg-muted/5 transition-colors ${
              !notif.read ? "bg-primary/5" : ""
            } ${getNotificationColor(notif.type)}`}
          >
            {/* Content */}
            <Link
              href={notif.actionUrl || "#"}
              onClick={() => !notif.read && markAsRead(notif.id)}
            >
              <div className="flex gap-3 cursor-pointer">
                {/* Icon & Image */}
                <div className="shrink-0">
                  {notif.petImage ? (
                    <img
                      src={notif.petImage}
                      alt=""
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-lg">
                      <NotificationIcon2 />
                    </div>
                  )}
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm leading-tight">
                        {notif.title}
                      </h4>
                      <p className="text-xs text-muted mt-1 line-clamp-2">
                        {notif.description}
                      </p>
                    </div>
                    {!notif.read && (
                      <div className="shrink-0 w-2 h-2 rounded-full bg-primary mt-1"></div>
                    )}
                  </div>
                </div>

                {/* Delete Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    deleteNotification(notif.id);
                  }}
                  className="shrink-0 cursor-pointer text-muted hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  ✕
                </button>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Footer - View All Link */}
    </div>
  );
}
