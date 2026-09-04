import { X, AlertTriangle, Info, AlertOctagon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { useVersionTheme } from "../contexts/VersionThemeContext";
import type { Notification } from "./NotificationsPanel";

interface NotificationTickerProps {
  notifications: Notification[];
  onNotificationClick: (notification: Notification) => void;
}

/** Maps priority to semantic state tokens defined in theme.css for default versions.
 *  Uses tinted containers (never saturated fills) so text always passes WCAG AA. */
const DEFAULT_PRIORITY_CONFIG = {
  Critical: {
    container: "bg-[var(--state-error-container)]",
    text:      "text-[var(--state-on-error-container)]",
    border:    "border-[var(--state-error)]/40",
    iconColor: "text-[var(--state-error)]",
    label:     "CRITICAL",
    Icon:      AlertOctagon,
  },
  High: {
    container: "bg-[var(--state-warning-container)]",
    text:      "text-[var(--state-on-warning-container)]",
    border:    "border-[var(--state-warning)]/40",
    iconColor: "text-[var(--state-warning)]",
    label:     "HIGH",
    Icon:      AlertTriangle,
  },
  Normal: {
    container: "bg-[var(--state-info-container)]",
    text:      "text-[var(--state-on-info-container)]",
    border:    "border-[var(--state-info)]/40",
    iconColor: "text-[var(--state-info)]",
    label:     "INFO",
    Icon:      Info,
  },
  Low: {
    container: "bg-[var(--surface-container-low)]",
    text:      "text-[var(--foreground)]",
    border:    "border-[var(--border)]",
    iconColor: "text-[var(--muted-foreground)]",
    label:     "LOW",
    Icon:      Info,
  },
} as const;

/** V6 specific priority styling:
 *  Critical notifications are solid filled cards with high contrast text. */
const V6_PRIORITY_CONFIG = {
  Critical: {
    container: "bg-red-600 dark:bg-red-700 text-white border-red-700 dark:border-red-800 shadow-xl ring-1 ring-red-500/30",
    text:      "text-white",
    pillBg:    "bg-white/20 text-white border-white/30",
    iconColor: "text-white",
    closeBtn:  "text-white/80 hover:text-white hover:bg-white/20",
    label:     "CRITICAL",
    Icon:      AlertOctagon,
  },
  High: {
    container: "bg-[var(--card,#ffffff)] dark:bg-[var(--surface-container,#1e1e1e)] text-[var(--foreground)] border border-amber-500/40 dark:border-amber-500/30 shadow-lg",
    text:      "text-[var(--foreground)]",
    pillBg:    "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30",
    iconColor: "text-amber-600 dark:text-amber-400",
    closeBtn:  "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--surface-container-high)]",
    label:     "HIGH",
    Icon:      AlertTriangle,
  },
  Normal: {
    container: "bg-[var(--card,#ffffff)] dark:bg-[var(--surface-container,#1e1e1e)] text-[var(--foreground)] border border-[var(--border)] shadow-lg",
    text:      "text-[var(--foreground)]",
    pillBg:    "bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30",
    iconColor: "text-blue-600 dark:text-blue-400",
    closeBtn:  "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--surface-container-high)]",
    label:     "INFO",
    Icon:      Info,
  },
  Low: {
    container: "bg-[var(--card,#ffffff)] dark:bg-[var(--surface-container,#1e1e1e)] text-[var(--foreground)] border border-[var(--border)] shadow-lg",
    text:      "text-[var(--foreground)]",
    pillBg:    "bg-[var(--surface-container-high)] text-[var(--muted-foreground)] border border-[var(--border)]",
    iconColor: "text-[var(--muted-foreground)]",
    closeBtn:  "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--surface-container-high)]",
    label:     "LOW",
    Icon:      Info,
  },
} as const;

export function NotificationTicker({ notifications, onNotificationClick }: NotificationTickerProps) {
  const { version } = useVersionTheme();
  const isV6 = version === "Master Blue V6";
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  useEffect(() => {
    const activeNotifications = notifications.filter((n) => !n.isRead && !dismissedIds.has(n.id));

    activeNotifications.forEach((notification) => {
      // Critical notifications never auto-dismiss across all versions
      if (timersRef.current.has(notification.id) || notification.priority === "Critical") return;

      // In non-V6 versions, High priority also stays persistent
      if (!isV6 && notification.priority === "High") return;

      if (notification.priority === "Normal" || notification.priority === "Low" || (isV6 && notification.priority === "High")) {
        const timer = setTimeout(() => {
          setDismissedIds((prev) => {
            const newSet = new Set(prev);
            newSet.add(notification.id);
            return newSet;
          });
          timersRef.current.delete(notification.id);
        }, isV6 ? 6000 : 8000);
        timersRef.current.set(notification.id, timer);
      }
    });

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
      timersRef.current.forEach((timer) => clearTimeout(timer));
      timersRef.current.clear();
    };
  }, [notifications, dismissedIds, isV6]);

  const activeNotifications = notifications.filter((n) => !n.isRead && !dismissedIds.has(n.id));

  const handleDismiss = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDismissedIds((prev) => new Set(prev).add(id));
  };

  const handleNotificationClick = (notification: Notification) => {
    onNotificationClick(notification);
    setDismissedIds((prev) => new Set(prev).add(notification.id));
  };

  if (activeNotifications.length === 0) return null;

  // ─────────────────────────────────────────────
  // V6 Notification Stack: Bottom-Right, reduced width, solid-filled Critical
  // ─────────────────────────────────────────────
  if (isV6) {
    return (
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-[360px] w-full pointer-events-none items-end">
        <div className="flex flex-col gap-2.5 w-full pointer-events-auto">
          <AnimatePresence>
            {activeNotifications.map((notification) => {
              const priority = (notification.priority as keyof typeof V6_PRIORITY_CONFIG) ?? "Normal";
              const cfg = V6_PRIORITY_CONFIG[priority] ?? V6_PRIORITY_CONFIG.Normal;
              const { container, text, pillBg, iconColor, closeBtn, label, Icon } = cfg;
              const isCritical = priority === "Critical";

              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 14, x: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 24, scale: 0.95 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  onClick={() => handleNotificationClick(notification)}
                  className={`
                    flex items-start gap-3 p-3.5 rounded-lg cursor-pointer border
                    ${container}
                    transition-all hover:scale-[1.01] hover:shadow-2xl
                  `}
                >
                  {/* Severity level pill */}
                  <div className="mt-0.5 shrink-0">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded border border-current/30 ${pillBg}`}>
                      <Icon size={10} />
                      {label}
                    </span>
                  </div>

                  {/* Message content */}
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-xs leading-snug ${text}`}>{notification.title}</p>
                    {notification.message && (
                      <p className={`text-[11px] mt-0.5 line-clamp-2 leading-tight ${isCritical ? "text-white/90" : "text-[var(--muted-foreground)]"}`}>
                        {notification.message}
                      </p>
                    )}
                  </div>

                  {/* Dismiss button */}
                  <button
                    onClick={(e) => handleDismiss(e, notification.id)}
                    className={`shrink-0 p-1 rounded transition-colors ${closeBtn}`}
                    aria-label="Dismiss notification"
                  >
                    <X size={14} />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // Non-V6 Versions: Exact original top-center banner layout
  // ─────────────────────────────────────────────
  return (
    <div className="fixed top-[44px] left-0 right-0 z-[9999] flex justify-center pt-2 pointer-events-none">
      <div className="flex flex-col gap-2 max-w-3xl w-full px-4 pointer-events-auto">
        <AnimatePresence>
          {activeNotifications.map((notification) => {
            const priority = (notification.priority as keyof typeof DEFAULT_PRIORITY_CONFIG) ?? "Normal";
            const cfg = DEFAULT_PRIORITY_CONFIG[priority] ?? DEFAULT_PRIORITY_CONFIG.Normal;
            const { container, text, border, iconColor, label, Icon } = cfg;

            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: -16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -16, scale: 0.96 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                onClick={() => handleNotificationClick(notification)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer border shadow-2xl backdrop-blur-md
                  ${container} ${text} ${border}
                  transition-all hover:scale-[1.01] hover:shadow-2xl
                `}
              >
                {/* Severity level pill */}
                <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-widest px-1.5 py-0.5 rounded border border-current/30 opacity-90 shrink-0 shadow-2xs">
                  <Icon size={10} />
                  {label}
                </span>

                {/* State icon */}
                <Icon size={16} className={`shrink-0 ${iconColor}`} />

                {/* Message */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{notification.title}</p>
                </div>

                {/* Dismiss button */}
                <button
                  onClick={(e) => handleDismiss(e, notification.id)}
                  className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
                  aria-label="Dismiss notification"
                >
                  <X size={16} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

