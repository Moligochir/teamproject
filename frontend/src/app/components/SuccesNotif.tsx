import { useEffect, useState } from "react";
import { SuccesIcon } from "./icons";

type SuccessNotificationProps = {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
};

export function SuccessNotification({
  message,
  isVisible,
  onClose,
  duration = 3000,
}: SuccessNotificationProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(() => {
          onClose();
        }, 300);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible && !isAnimating) return null;

  return (
    <div
      className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 transition-all duration-300 ${
        isAnimating ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
    >
      <div className="bg-white dark:bg-card-bg rounded-2xl shadow-2xl p-8 border border-green-200 dark:border-green-800 max-w-sm w-full mx-auto">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center animate-bounce">
            <SuccesIcon />
          </div>
        </div>

        <p className="text-center text-lg font-semibold text-gray-900 dark:text-white">
          {message}
        </p>

        <div className="mt-6 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full animate-shrink"
            style={{
              animation: `shrink ${duration}ms linear`,
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}
