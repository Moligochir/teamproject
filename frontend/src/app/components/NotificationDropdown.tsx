"use client";

import React, { useState } from "react";
import { useNotification } from "../contexts/Notificationcontext";
import Link from "next/link";
import { useLanguage } from "../contexts/Languagecontext";

export function NotificationDropdown() {
  const { notifications, markAsRead, clearAll } = useNotification();
  const { language } = useLanguage();
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
    },
  };

  const t = translations[language];

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

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "match":
        return "🎉";
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "info":
        return "ℹ️";
      default:
        return "📢";
    }
  };

  if (notifications.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted text-sm">{t.noNotifications}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-card-bg border-b border-card-border px-4 py-3 flex items-center justify-between">
        <h3 className="font-semibold text-foreground">
          {language === "mn" ? "Мэдэгдэл" : "Notifications"}
        </h3>
        <div className="flex gap-2">
          {notifications.some((n) => !n.read) && (
            <button
              onClick={() => {
                notifications.forEach((n) => {
                  if (!n.read) markAsRead(n.id);
                });
              }}
              className="text-xs cursor-pointer px-2 py-1 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-all"
            >
              {t.markAllAsRead}
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="text-xs cursor-pointer px-2 py-1 rounded bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all"
            >
              {t.clearAll}
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="divide-y divide-card-border">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 hover:bg-primary/5 transition-colors cursor-pointer border-l-4 ${
              notification.type === "match"
                ? "border-l-primary"
                : notification.type === "success"
                  ? "border-l-found"
                  : notification.type === "error"
                    ? "border-l-lost"
                    : "border-l-muted"
            } ${!notification.read ? "bg-primary/5" : ""}`}
            onClick={() => markAsRead(notification.id)}
          >
            <div className="flex gap-3">
              {/* Icon */}
              <div className="text-2xl shrink-0">
                {getNotificationIcon(notification.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Title */}
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-foreground text-sm">
                    {notification.title}
                  </h4>
                  {!notification.read && (
                    <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                  )}
                </div>

                {/* Message */}
                <p className="text-xs text-muted mt-1 line-clamp-2">
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
                              className="flex items-center justify-between text-xs bg-background px-2 py-1.5 rounded"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-lg">
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
                            +{notification.matchData.matches.length - 2} more
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                {/* Single Match Details */}
                {notification.type === "match" &&
                  notification.matchData &&
                  notification.matchData.matchId && (
                    <div className="mt-2 p-2 bg-primary/10 rounded flex items-center justify-between">
                      <div className="text-xs">
                        <p className="font-medium text-foreground">
                          {getConfidenceColor(
                            notification.matchData.confidence,
                          )}{" "}
                          {getConfidenceText(notification.matchData.confidence)}
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
                    <button className="mt-2 text-xs px-3 py-1.5 rounded bg-primary/20 text-primary hover:bg-primary/30 transition-all font-medium">
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
}
