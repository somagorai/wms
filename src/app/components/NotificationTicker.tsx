import { X, AlertTriangle, Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef } from "react";
import type { Notification } from "./NotificationsPanel";

interface NotificationTickerProps {
  notifications: Notification[];
  onNotificationClick: (notification: Notification) => void;
}

export function NotificationTicker({ notifications, onNotificationClick }: NotificationTickerProps) {
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Auto-fade non-critical notifications after 8 seconds
  useEffect(() => {
    // Filter for active unread notifications that haven't been dismissed
    const activeNotifications = notifications.filter((n) => !n.isRead && !dismissedIds.has(n.id));

    activeNotifications.forEach((notification) => {
      // Skip if already has a timer or is critical/high priority
      if (timersRef.current.has(notification.id) || notification.priority === "Critical" || notification.priority === "High") {
        return;
      }

      // Only auto-fade Normal and Low priority notifications
      if (notification.priority === "Normal" || notification.priority === "Low") {
        const timer = setTimeout(() => {
          setDismissedIds((prev) => {
            const newSet = new Set(prev);
            newSet.add(notification.id);
            return newSet;
          });
          timersRef.current.delete(notification.id);
        }, 8000);

        timersRef.current.set(notification.id, timer);
      }
    });

    // Clean up timers for notifications that are no longer active
    const activeIds = new Set(activeNotifications.map((n) => n.id));
    Array.from(timersRef.current.keys()).forEach((id) => {
      if (!activeIds.has(id)) {
        const timer = timersRef.current.get(id);
        if (timer) {
          clearTimeout(timer);
          timersRef.current.delete(id);
        }
      }
    });

    return () => {
      // Cleanup all timers on unmount
      timersRef.current.forEach((timer) => clearTimeout(timer));
      timersRef.current.clear();
    };
  }, [notifications, dismissedIds]);

  // Filter for active unread notifications that haven't been dismissed
  const activeNotifications = notifications.filter((n) => !n.isRead && !dismissedIds.has(n.id));

  const handleDismiss = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDismissedIds((prev) => new Set(prev).add(id));
  };

  const handleNotificationClick = (notification: Notification) => {
    onNotificationClick(notification);
    setDismissedIds((prev) => new Set(prev).add(notification.id));
  };

  if (activeNotifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-30 flex justify-center pt-3 pointer-events-none">
      <div className="flex flex-col gap-2 max-w-3xl w-full px-4 pointer-events-auto">
        <AnimatePresence>
          {activeNotifications.map((notification) => {
            const getBgColor = () => {
              if (notification.priority === "Critical") return "bg-red-600 text-white hover:bg-red-500";
              if (notification.priority === "High") return "bg-orange-500 text-white hover:bg-orange-400";
              return "bg-blue-500 text-blue-950 hover:bg-blue-400";
            };

            const getIcon = () => {
              if (notification.priority === "Critical" || notification.priority === "High") {
                return <AlertTriangle size={18} className="flex-shrink-0" />;
              }
              return <Info size={18} className="flex-shrink-0" />;
            };

            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                onClick={() => handleNotificationClick(notification)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg cursor-pointer
                  ${getBgColor()}
                  transition-colors
                `}
              >
                {getIcon()}

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">
                    {notification.title}
                  </p>
                </div>

                <button
                  onClick={(e) => handleDismiss(e, notification.id)}
                  className="flex-shrink-0 hover:opacity-70 transition-opacity"
                  aria-label="Dismiss notification"
                >
                  <X size={18} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
