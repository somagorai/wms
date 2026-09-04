import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { AIOverlay } from "./AIOverlay";
import { ProfilePanel } from "./ProfilePanel";
import { WorkstationsPanel } from "./WorkstationsPanel";
import { NotificationsPanel } from "./NotificationsPanel";
import { NotificationTicker } from "./NotificationTicker";
import { Toaster } from "./ui/sonner";
import { useState, useEffect } from "react";
import { useLayout } from "../contexts/LayoutContext";
import { useAuth } from "../contexts/AuthContext";
import { generateMockNotifications } from "../data/mockNotifications";
import type { Notification } from "./NotificationsPanel";

// Main layout component with sidebar and content area
// Version: 2.0.1 - Context provider moved to App.tsx
export function Layout() {
  const {
    isSidebarExpanded,
    setIsSidebarExpanded,
    isFullscreen,
    showAI,
    setShowAI,
    showWorkstations,
    setShowWorkstations,
    assignedWorkstation,
    setAssignedWorkstation,
    initializePinnedItems
  } = useLayout();
  
  const { user } = useAuth();
  
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedNotificationId, setSelectedNotificationId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>(generateMockNotifications());

  // Initialize pinned items when user changes
  useEffect(() => {
    if (user) {
      initializePinnedItems(user.username, user.role);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]); // Only depend on user, not initializePinnedItems to avoid infinite loop

  // Generate random low-level notifications that appear and disappear
  useEffect(() => {
    const randomNotificationTitles = [
      "Workstation WS-007 is now active",
      "Pick rate increased by 3% this hour",
      "Zone B replenishment completed",
      "Scanner SC-12 battery low",
      "New work list assigned to your team",
      "Daily inventory sync completed",
      "User training session reminder",
      "Equipment inspection scheduled",
      "Shift handoff notes available",
      "Weekly metrics report ready"
    ];

    const randomNotificationMessages = [
      "System status update",
      "Routine operation completed",
      "Information update available",
      "Operational notification",
      "Status change detected",
      "Process completed successfully",
      "System information",
      "Operational update",
      "Status notification",
      "Process update"
    ];

    const generateRandomNotification = (): Notification => {
      const randomTitle = randomNotificationTitles[Math.floor(Math.random() * randomNotificationTitles.length)];
      const randomMessage = randomNotificationMessages[Math.floor(Math.random() * randomNotificationMessages.length)];
      const randomId = `random-notif-${Date.now()}-${Math.random()}`;

      return {
        id: randomId,
        type: "Info",
        priority: Math.random() > 0.5 ? "Low" : "Normal",
        target: Math.random() > 0.5 ? "User" : "Group",
        title: randomTitle,
        message: randomMessage,
        timestamp: new Date().toISOString(),
        isRead: false,
        targetName: Math.random() > 0.5 ? "John Smith" : "Warehouse Team",
        details: `${randomTitle}\n\n${randomMessage}\n\nThis is an automated system notification.`
      };
    };

    // Generate random notifications at random intervals (between 10-30 seconds)
    const scheduleRandomNotification = () => {
      const delay = Math.random() * 20000 + 10000; // 10-30 seconds

      const timeout = setTimeout(() => {
        // Only add if there's a 40% chance (to make it more random)
        if (Math.random() > 0.6) {
          const newNotification = generateRandomNotification();
          setNotifications(prev => [newNotification, ...prev]);

          // Auto-mark as read after it's been visible (it will auto-fade from ticker)
          setTimeout(() => {
            setNotifications(prev =>
              prev.map(n => n.id === newNotification.id ? { ...n, isRead: true } : n)
            );
          }, 10000); // Mark as read after 10 seconds
        }

        // Schedule the next random notification
        scheduleRandomNotification();
      }, delay);

      return timeout;
    };

    const timeout = scheduleRandomNotification();

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const handleTickerNotificationClick = (notification: Notification) => {
    setSelectedNotificationId(notification.id);
    setShowNotifications(true);
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }
  };

  const handleCloseNotifications = () => {
    setShowNotifications(false);
    setSelectedNotificationId(null);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="flex h-screen bg-white dark:bg-zinc-900">
      {!isFullscreen && (
        <Sidebar
          onAIClick={() => setShowAI(true)}
          isExpanded={isSidebarExpanded}
          onToggle={() => setIsSidebarExpanded(!isSidebarExpanded)}
          onProfileClick={() => setShowProfile(true)}
          onWorkstationsClick={() => setShowWorkstations(true)}
          onNotificationsClick={() => setShowNotifications(true)}
          assignedWorkstation={assignedWorkstation}
          unreadNotificationsCount={unreadCount}
        />
      )}
      <main className="flex-1 overflow-y-auto">
        {!isFullscreen && (
          <NotificationTicker
            notifications={notifications}
            onNotificationClick={handleTickerNotificationClick}
          />
        )}
        <Outlet />
      </main>
      {showAI && <AIOverlay onClose={() => setShowAI(false)} />}
      <ProfilePanel isOpen={showProfile} onClose={() => setShowProfile(false)} />
      <WorkstationsPanel 
        isOpen={showWorkstations} 
        onClose={() => setShowWorkstations(false)}
        assignedWorkstation={assignedWorkstation}
        onAssignWorkstation={setAssignedWorkstation}
      />
      <NotificationsPanel
        isOpen={showNotifications}
        onClose={handleCloseNotifications}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        initialSelectedId={selectedNotificationId}
      />
      <Toaster />
    </div>
  );
}