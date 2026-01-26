"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

export interface MatchData {
  matchId?: string;
  matchScore?: number;
  confidence?: "HIGH" | "MEDIUM" | "LOW";
  totalMatches?: number;
  matches?: Array<{
    matchId: string;
    matchScore: number;
    confidence: "HIGH" | "MEDIUM" | "LOW";
  }>;
}

export interface NotificationAction {
  label: string;
  href: string;
}

export interface Notification {
  id: string;
  type: "success" | "error" | "info" | "match";
  title: string;
  message: string;
  matchData?: MatchData;
  action?: NotificationAction;
  timestamp: Date;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (
    notification: Omit<Notification, "id" | "timestamp" | "read">,
  ) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

const STORAGE_KEY = "pawfinder_notifications";
const MAX_NOTIFICATIONS = 50;

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load notifications from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert timestamp strings back to Date objects
        const notificationsWithDates = parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp),
        }));
        setNotifications(notificationsWithDates);
      }
    } catch (err) {
      console.log("Error loading notifications from localStorage:", err);
    }
    setIsLoaded(true);
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    if (!isLoaded) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch (err) {
      console.log("Error saving notifications to localStorage:", err);
    }
  }, [notifications, isLoaded]);

  const addNotification = useCallback(
    (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
      const id = Date.now().toString();
      const newNotification: Notification = {
        ...notification,
        id,
        timestamp: new Date(),
        read: false,
      };

      setNotifications((prev) => {
        // Add new notification and keep only latest MAX_NOTIFICATIONS
        const updated = [newNotification, ...prev].slice(0, MAX_NOTIFICATIONS);
        return updated;
      });

      // Auto remove after 5 seconds (for non-match notifications)
      if (notification.type !== "match") {
        setTimeout(() => {
          removeNotification(id);
        }, 5000);
      }

      return id;
    },
    [],
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        markAsRead,
        clearAll,
        unreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context;
};
