import { X, Info, AlertTriangle, Users, User, Server, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

export type NotificationType = "Info" | "Warning";
export type NotificationTarget = "User" | "Group" | "System";
export type NotificationPriority = "Critical" | "High" | "Normal" | "Low";

export interface Notification {
  id: string;
  type: NotificationType;
  target: NotificationTarget;
  priority: NotificationPriority;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  details?: string;
  targetName?: string; // e.g., "Engineering Team", "John Doe", "All Systems"
}

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  initialSelectedId?: string | null;
}

export function NotificationsPanel({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  initialSelectedId
}: NotificationsPanelProps) {
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  // Auto-select notification when initialSelectedId is provided
  useEffect(() => {
    if (initialSelectedId && isOpen) {
      const notification = notifications.find((n) => n.id === initialSelectedId);
      if (notification) {
        setSelectedNotification(notification);
      }
    }
  }, [initialSelectedId, isOpen, notifications]);

  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification);
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
  };

  const handleBack = () => {
    setSelectedNotification(null);
  };

  const getPriorityIcon = (priority: NotificationPriority) => {
    switch (priority) {
      case "Critical":
        return <AlertTriangle size={18} className="text-red-600 dark:text-red-400" />;
      case "High":
        return <AlertTriangle size={18} className="text-orange-500 dark:text-orange-400" />;
      case "Normal":
      case "Low":
        return <Info size={18} className="text-blue-500 dark:text-blue-400" />;
    }
  };

  const getTargetIcon = (target: NotificationTarget) => {
    switch (target) {
      case "User":
        return <User size={14} className="text-zinc-500 dark:text-zinc-400" />;
      case "Group":
        return <Users size={14} className="text-zinc-500 dark:text-zinc-400" />;
      case "System":
        return <Server size={14} className="text-zinc-500 dark:text-zinc-400" />;
    }
  };

  const getPriorityColor = (priority: NotificationPriority) => {
    switch (priority) {
      case "Critical":
        return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
      case "High":
        return "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800";
      case "Normal":
      case "Low":
        return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    if (minutes < 2880) return "Yesterday";
    return date.toLocaleDateString();
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                  {selectedNotification ? "Notification Details" : "Notifications"}
                </h2>
                {!selectedNotification && unreadCount > 0 && (
                  <span className="px-2 py-0.5 bg-[#50e080] text-white text-xs font-medium rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              <button
                onClick={selectedNotification ? handleBack : onClose}
                className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
              >
                {selectedNotification ? <ChevronRight size={20} className="rotate-180" /> : <X size={20} />}
              </button>
            </div>
            
            {!selectedNotification && unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="text-sm text-[#0d9488] dark:text-[#50e080] hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {selectedNotification ? (
              /* Detail View */
              <div className="p-6 space-y-4">
                <div className={`p-4 rounded-lg border ${getPriorityColor(selectedNotification.priority)}`}>
                  <div className="flex items-start gap-3">
                    {getPriorityIcon(selectedNotification.priority)}
                    <div className="flex-1">
                      <h3 className="font-semibold text-zinc-900 dark:text-white mb-1">
                        {selectedNotification.title}
                      </h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {selectedNotification.message}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-500 dark:text-zinc-400">Priority</span>
                    <div className="flex items-center gap-2">
                      {getPriorityIcon(selectedNotification.priority)}
                      <span className="text-zinc-900 dark:text-white font-medium">
                        {selectedNotification.priority}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-500 dark:text-zinc-400">Target</span>
                    <div className="flex items-center gap-2">
                      {getTargetIcon(selectedNotification.target)}
                      <span className="text-zinc-900 dark:text-white font-medium">
                        {selectedNotification.target}
                      </span>
                    </div>
                  </div>

                  {selectedNotification.targetName && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-500 dark:text-zinc-400">Recipient</span>
                      <span className="text-zinc-900 dark:text-white font-medium">
                        {selectedNotification.targetName}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-500 dark:text-zinc-400">Time</span>
                    <span className="text-zinc-900 dark:text-white font-medium">
                      {new Date(selectedNotification.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>

                {selectedNotification.details && (
                  <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                    <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-2">
                      Additional Details
                    </h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-line">
                      {selectedNotification.details}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* List View */
              <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Info size={48} className="mx-auto mb-4 text-zinc-300 dark:text-zinc-700" />
                    <p className="text-zinc-500 dark:text-zinc-400">No notifications</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <button
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`w-full p-4 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors ${
                        !notification.isRead ? (
                          notification.priority === "Critical" ? "bg-red-50/50 dark:bg-red-900/10" :
                          notification.priority === "High" ? "bg-orange-50/50 dark:bg-orange-900/10" :
                          "bg-blue-50/50 dark:bg-blue-900/10"
                        ) : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getPriorityIcon(notification.priority)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className={`text-sm font-medium text-zinc-900 dark:text-white ${
                              !notification.isRead ? "font-semibold" : ""
                            }`}>
                              {notification.title}
                            </h4>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-[#50e080] rounded-full flex-shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                            <div className="flex items-center gap-1">
                              {getTargetIcon(notification.target)}
                              <span>{notification.target}</span>
                            </div>
                            <span>•</span>
                            <span>{formatTimestamp(notification.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
