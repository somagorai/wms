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
 return <AlertTriangle size={18} className="text-[var(--state-error)] dark:text-[var(--state-error)]" />;
 case "High":
 return <AlertTriangle size={18} className="text-[var(--state-warning)] dark:text-[var(--state-warning)]" />;
 case "Normal":
 case "Low":
 return <Info size={18} className="text-[var(--state-info)] dark:text-[var(--state-info)]" />;
 }
 };

 const getTargetIcon = (target: NotificationTarget) => {
 switch (target) {
 case "User":
 return <User size={14} className="text-[var(--muted-foreground)]" />;
 case "Group":
 return <Users size={14} className="text-[var(--muted-foreground)]" />;
 case "System":
 return <Server size={14} className="text-[var(--muted-foreground)]" />;
 }
 };

 const getPriorityColor = (priority: NotificationPriority) => {
 switch (priority) {
 case "Critical":
 return "bg-[var(--state-error-container)] dark:bg-[var(--state-error-container)]/20 border-[var(--state-error)]/40 dark:border-[var(--state-error)]";
 case "High":
 return "bg-[var(--state-warning-container)] dark:bg-[var(--state-warning-container)]/20 border-[var(--state-warning)]/40 dark:border-[var(--state-warning)]";
 case "Normal":
 case "Low":
 return "bg-[var(--state-info-container)] dark:bg-[var(--state-info-container)]/20 border-[var(--secondary)]/30 dark:border-[var(--secondary-container)]/30";
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
 className="fixed inset-0 bg-black/20 dark:bg-black/50 z-40 transition-opacity"
 onClick={onClose}
 />
 )}

 {/* Panel */}
 <div
 className={`fixed top-0 right-0 h-full w-96 bg-[var(--surface-container-high)] text-[var(--foreground)] border-l border-[var(--border)]  z-50 transform transition-transform duration-300 ease-in-out ${
 isOpen ? "translate-x-0" : "translate-x-full"
 }`}
 >
 <div className="flex flex-col h-full">
 {/* Header */}
 <div className="p-6 border-b border-[var(--border)] ">
 <div className="flex items-center justify-between mb-4">
 <div className="flex items-center gap-2">
 <h2 className="text-xl font-semibold text-[var(--foreground)] ">
 {selectedNotification ? "Notification Details" : "Notifications"}
 </h2>
 {!selectedNotification && unreadCount > 0 && (
 <span className="px-2 py-0.5 bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-medium rounded-full">
 {unreadCount}
 </span>
 )}
 </div>
 <button
 onClick={selectedNotification ? handleBack : onClose}
 className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]  dark:hover:text-[var(--foreground)] transition-colors"
 >
 {selectedNotification ? <ChevronRight size={20} className="rotate-180" /> : <X size={20} />}
 </button>
 </div>
 
 {!selectedNotification && unreadCount > 0 && (
 <button
 onClick={onMarkAllAsRead}
 className="text-sm text-[var(--primary)] dark:text-[var(--primary)] hover:underline"
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
 <h3 className="font-semibold text-[var(--foreground)]  mb-1">
 {selectedNotification.title}
 </h3>
 <p className="text-sm text-[var(--muted-foreground)]">
 {selectedNotification.message}
 </p>
 </div>
 </div>
 </div>

 <div className="space-y-3">
 <div className="flex items-center justify-between text-sm">
 <span className="text-[var(--muted-foreground)]">Priority</span>
 <div className="flex items-center gap-2">
 {getPriorityIcon(selectedNotification.priority)}
 <span className="text-[var(--foreground)]  font-medium">
 {selectedNotification.priority}
 </span>
 </div>
 </div>

 <div className="flex items-center justify-between text-sm">
 <span className="text-[var(--muted-foreground)]">Target</span>
 <div className="flex items-center gap-2">
 {getTargetIcon(selectedNotification.target)}
 <span className="text-[var(--foreground)]  font-medium">
 {selectedNotification.target}
 </span>
 </div>
 </div>

 {selectedNotification.targetName && (
 <div className="flex items-center justify-between text-sm">
 <span className="text-[var(--muted-foreground)]">Recipient</span>
 <span className="text-[var(--foreground)]  font-medium">
 {selectedNotification.targetName}
 </span>
 </div>
 )}

 <div className="flex items-center justify-between text-sm">
 <span className="text-[var(--muted-foreground)]">Time</span>
 <span className="text-[var(--foreground)]  font-medium">
 {new Date(selectedNotification.timestamp).toLocaleString()}
 </span>
 </div>
 </div>

 {selectedNotification.details && (
 <div className="pt-4 border-t border-[var(--border)] ">
 <h4 className="text-sm font-semibold text-[var(--foreground)]  mb-2">
 Additional Details
 </h4>
 <p className="text-sm text-[var(--muted-foreground)] whitespace-pre-line">
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
 <Info size={48} className="mx-auto mb-4 text-[var(--foreground)] " />
 <p className="text-[var(--muted-foreground)]">No notifications</p>
 </div>
 ) : (
 notifications.map((notification) => (
 <button
 key={notification.id}
 onClick={() => handleNotificationClick(notification)}
 className={`w-full p-4 text-left hover:bg-[var(--surface-container-lowest)] hover:bg-[var(--surface-container-high)] transition-colors ${
 !notification.isRead ? (
 notification.priority === "Critical" ? "bg-[var(--state-error-container)]/50 dark:bg-[var(--state-error-container)]/10" :
 notification.priority === "High" ? "bg-[var(--state-warning-container)]/50 dark:bg-[var(--state-warning-container)]/10" :
 "bg-[var(--state-info-container)]/50 dark:bg-[var(--state-info-container)]/10"
 ) : ""
 }`}
 >
 <div className="flex items-start gap-3">
 <div className="flex-shrink-0 mt-1">
 {getPriorityIcon(notification.priority)}
 </div>
 <div className="flex-1 min-w-0">
 <div className="flex items-start justify-between gap-2 mb-1">
 <h4 className={`text-sm font-medium text-[var(--foreground)] ${
 !notification.isRead ? "font-semibold" : ""
 }`}>
 {notification.title}
 </h4>
 {!notification.isRead && (
 <div className="w-2 h-2 bg-[var(--primary)] rounded-full flex-shrink-0 mt-1" />
 )}
 </div>
 <p className="text-sm text-[var(--muted-foreground)] mb-2 line-clamp-2">
 {notification.message}
 </p>
 <div className="flex items-center gap-3 text-xs text-[var(--muted-foreground)]">
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
