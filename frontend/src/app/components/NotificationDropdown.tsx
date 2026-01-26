"use client";

import React, { useState, useEffect } from "react";
import { useNotification, Notification } from "../contexts/Notificationcontext";
import Link from "next/link";
import { useLanguage } from "../contexts/Languagecontext";
import {
  CheckCircleIcon,
  XCircleIcon,
  InfoIcon,
  BellIcon,
  TrashIcon,
  CheckIcon,
} from "lucide-react";

export function NotificationDropdown() {
  const { notifications, markAsRead, clearAll } = useNotification();
  const { language } = useLanguage();
  const [groupedNotifications, setGroupedNotifications] = useState<{
    today: Notification[];
    yesterday: Notification[];
    lastWeek: Notification[];
    older: Notification[];
  }>({
    today: [],
    yesterday: [],
    lastWeek: [],
    older: [],
  });

  const translations = {
    mn: {
      noNotifications: "Мэдэгдэл байхгүй",
      markAllAsRead: "Бүгдийг уншсан гэж тэмдэглэх",
      clearAll: "Бүгдийг устгах",
      viewDetails: "Дэлгэрэнгүйг үзэх",
      highConfidence: "Өндөр итгэлцүүрийн",
      mediumConfidence: "Дунд итгэлцүүрийн",
      lowConfidence: "Нам итгэлцүүрийн",
      matchScore: "Тохирлын оноо",
      totalMatches: "нийт тохирол олдлоо",
      notifications: "Мэдэгдлүүд",
      today: "Өнөөдөр",
      yesterday: "Өчигдөр",
      lastWeek: "Энэ долоо хоног",
      older: "Хуучин",
      noOlderNotifications: "Хуучин мэдэгдэл байхгүй",
    },
    en: {
      noNotifications: "No notifications",
      markAllAsRead: "Mark all as read",
      clearAll: "Clear all",
      viewDetails: "View details",
      highConfidence: "High confidence",
      mediumConfidence: "Medium confidence",
      lowConfidence: "Low confidence",
      matchScore: "Match score",
      totalMatches: "total matches found",
      notifications: "Notifications",
      today: "Today",
      yesterday: "Yesterday",
      lastWeek: "This week",
      older: "Older",
      noOlderNotifications: "No older notifications",
    },
  };

  const t = translations[language];

  // Get time category
  const getTimeCategory = (timestamp: Date) => {
    const now = new Date();
    const notificationDate = new Date(timestamp);

    // Reset times for comparison
    now.setHours(0, 0, 0, 0);
    notificationDate.setHours(0, 0, 0, 0);

    const diffTime = now.getTime() - notificationDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays === 0) return "today";
    if (diffDays === 1) return "yesterday";
    if (diffDays < 7) return "lastWeek";
    return "older";
  };

  // Format time
  const formatTime = (timestamp: Date) => {
    const date = new Date(timestamp);
    const now = new Date();

    const sameDay = date.toDateString() === now.toDateString();

    if (sameDay) {
      return date.toLocaleTimeString(language === "mn" ? "mn-MN" : "en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    return date.toLocaleDateString(language === "mn" ? "mn-MN" : "en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Sort and group notifications
  useEffect(() => {
    if (notifications.length === 0) {
      setGroupedNotifications({
        today: [],
        yesterday: [],
        lastWeek: [],
        older: [],
      });
      return;
    }

    // Sort by timestamp (newest first)
    const sorted = [...notifications].sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );

    // Group by time
    const grouped = {
      today: sorted.filter((n) => getTimeCategory(n.timestamp) === "today"),
      yesterday: sorted.filter(
        (n) => getTimeCategory(n.timestamp) === "yesterday",
      ),
      lastWeek: sorted.filter(
        (n) => getTimeCategory(n.timestamp) === "lastWeek",
      ),
      older: sorted.filter((n) => getTimeCategory(n.timestamp) === "older"),
    };

    setGroupedNotifications(grouped);
  }, [notifications, language]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "match":
        return (
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
            <BellIcon className="w-4 h-4" />
          </div>
        );
      case "success":
        return (
          <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-600 shrink-0">
            <CheckCircleIcon className="w-4 h-4" />
          </div>
        );
      case "error":
        return (
          <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center text-red-600 shrink-0">
            <XCircleIcon className="w-4 h-4" />
          </div>
        );
      case "info":
        return (
          <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-600 shrink-0">
            <InfoIcon className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="w-6 h-6 rounded-full bg-gray-500/20 flex items-center justify-center text-gray-600 shrink-0">
            <BellIcon className="w-4 h-4" />
          </div>
        );
    }
  };

  const getConfidenceColor = (confidence?: string) => {
    switch (confidence) {
      case "HIGH":
        return "🟢";
      case "MEDIUM":
        return "🟡";
      case "LOW":
        return "🔴";
      default:
        return "⚪";
    }
  };

  const getConfidenceText = (confidence?: string) => {
    switch (confidence) {
      case "HIGH":
        return t.highConfidence;
      case "MEDIUM":
        return t.mediumConfidence;
      case "LOW":
        return t.lowConfidence;
      default:
        return "";
    }
  };

  const renderNotificationGroup = (
    title: string,
    items: Notification[],
    isEmpty: boolean = false,
  ) => {
    if (items.length === 0 && isEmpty) {
      return (
        <div key={title} className="p-4 text-center text-muted text-sm">
          <p>{t.noOlderNotifications}</p>
        </div>
      );
    }

    if (items.length === 0) {
      return null;
    }

    return (
      <div key={title} className="border-t border-card-border first:border-t-0">
        <div className="bg-card-bg px-4 py-2 border-b border-card-border">
          <h4 className="text-xs font-bold text-muted uppercase tracking-wider">
            {title}
          </h4>
        </div>
        <div className="divide-y divide-card-border">
          {items.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 hover:bg-primary/5 transition-colors cursor-pointer border-l-4 ${
                notification.type === "match"
                  ? "border-l-primary"
                  : notification.type === "success"
                    ? "border-l-green-500"
                    : notification.type === "error"
                      ? "border-l-red-500"
                      : "border-l-blue-500"
              } ${!notification.read ? "bg-primary/5" : ""}`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex gap-3">
                {/* Icon */}
                <div>{getNotificationIcon(notification.type)}</div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Title & Time */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">
                        {notification.title}
                      </h4>
                      <p className="text-xs text-muted mt-0.5">
                        {formatTime(notification.timestamp)}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                    )}
                  </div>

                  {/* Message */}
                  <p className="text-xs text-muted mt-2 line-clamp-2">
                    {notification.message}
                  </p>

                  {/* Match Details */}
                  {notification.type === "match" &&
                    notification.matchData &&
                    notification.matchData.matches && (
                      <div className="mt-3 space-y-2">
                        {/* Summary */}
                        {notification.matchData.totalMatches && (
                          <div className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded w-fit">
                            🎯 {notification.matchData.totalMatches}{" "}
                            {t.totalMatches}
                          </div>
                        )}

                        {/* Top matches preview */}
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {notification.matchData.matches
                            .slice(0, 2)
                            .map((match, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between text-xs bg-background px-2 py-1.5 rounded border border-card-border"
                              >
                                <div className="flex items-center gap-2">
                                  <span>
                                    {getConfidenceColor(match.confidence)}
                                  </span>
                                  <div>
                                    <p className="font-medium text-foreground">
                                      Match #{idx + 1}
                                    </p>
                                    <p className="text-muted text-xs">
                                      {getConfidenceText(match.confidence)}
                                    </p>
                                  </div>
                                </div>
                                <span className="font-bold text-primary">
                                  {match.matchScore}%
                                </span>
                              </div>
                            ))}
                          {notification.matchData.matches.length > 2 && (
                            <p className="text-xs text-muted text-center py-1">
                              +{notification.matchData.matches.length - 2}{" "}
                              {language === "mn" ? "илүү" : "more"}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                  {/* Single Match Details */}
                  {notification.type === "match" &&
                    notification.matchData &&
                    notification.matchData.matchId && (
                      <div className="mt-2 p-2 bg-primary/10 rounded flex items-center justify-between border border-primary/20">
                        <div className="text-xs">
                          <p className="font-medium text-foreground">
                            {getConfidenceColor(
                              notification.matchData.confidence,
                            )}{" "}
                            {getConfidenceText(
                              notification.matchData.confidence,
                            )}
                          </p>
                          <p className="text-muted">
                            {t.matchScore}: {notification.matchData.matchScore}%
                          </p>
                        </div>
                      </div>
                    )}

                  {/* Action Button */}
                  {notification.action && (
                    <Link href={notification.action.href}>
                      <button className="mt-2 text-xs px-3 py-1.5 rounded bg-primary/20 text-primary hover:bg-primary/30 transition-all font-medium cursor-pointer">
                        {notification.action.label}
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (notifications.length === 0) {
    return (
      <div className="p-8 text-center min-h-64 flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <BellIcon className="w-8 h-8 text-muted" />
        </div>
        <p className="text-muted text-sm">{t.noNotifications}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-h-96">
      {/* Header */}
      <div className="bg-card-bg border-b border-card-border px-4 py-3 flex flex-col gap-5 items-center justify-between z-10 shrink-0">
        <h3 className="font-semibold text-foreground text-sm">
          {t.notifications}
        </h3>
        <div className="flex gap-2">
          {notifications.some((n) => !n.read) && (
            <button
              onClick={() => {
                notifications.forEach((n) => {
                  if (!n.read) markAsRead(n.id);
                });
              }}
              className="text-xs cursor-pointer px-2 py-1 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-all flex items-center gap-1"
              title={t.markAllAsRead}
            >
              <CheckIcon className="w-3 h-3" />
              <span className="hidden sm:inline text-xs">
                {t.markAllAsRead}
              </span>
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="text-xs cursor-pointer px-2 py-1 rounded bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all flex items-center gap-1"
              title={t.clearAll}
            >
              <TrashIcon className="w-3 h-3" />
              <span className="hidden sm:inline text-xs">{t.clearAll}</span>
            </button>
          )}
        </div>
      </div>

      {/* Notifications List - Grouped by Time */}
      <div className="flex-1 overflow-y-auto divide-y divide-card-border">
        {renderNotificationGroup(t.today, groupedNotifications.today)}
        {renderNotificationGroup(t.yesterday, groupedNotifications.yesterday)}
        {renderNotificationGroup(t.lastWeek, groupedNotifications.lastWeek)}
        {renderNotificationGroup(t.older, groupedNotifications.older, true)}
      </div>
    </div>
  );
}
