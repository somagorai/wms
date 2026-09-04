import type { Notification } from "../components/NotificationsPanel";

export const generateMockNotifications = (): Notification[] => {
  const now = new Date();

  return [
    {
      id: "notif-000",
      type: "Warning",
      priority: "Critical",
      target: "System",
      title: "CRITICAL: Database Connection Lost",
      message: "Primary database connection has been lost. System operating in degraded mode.",
      timestamp: new Date(now.getTime() - 5 * 60000).toISOString(), // 5 minutes ago
      isRead: false,
      targetName: "All Systems",
      details: "CRITICAL ALERT\n\nThe primary database connection has been lost. The system is currently operating in degraded mode with limited functionality.\n\nImmediate Action Required:\n- Contact IT support immediately\n- Do not process critical transactions\n- Check database server status\n- Review connection logs\n\nIncident ID: INC-2024-001",
    },
    {
      id: "notif-001",
      type: "Warning",
      priority: "High",
      target: "System",
      title: "High Memory Usage Detected",
      message: "System memory usage has exceeded 85% on warehouse server WH-PROD-01",
      timestamp: new Date(now.getTime() - 15 * 60000).toISOString(), // 15 minutes ago
      isRead: false,
      targetName: "All Systems",
      details: "The warehouse production server (WH-PROD-01) is experiencing high memory usage. Current usage: 87%\n\nRecommended Action:\n- Review active processes\n- Consider scaling resources\n- Check for memory leaks in running applications",
    },
    {
      id: "notif-002",
      type: "Info",
      priority: "Low",
      target: "User",
      title: "Work List WL-001 Completed",
      message: "Your assigned work list WL-001 has been completed successfully",
      timestamp: new Date(now.getTime() - 45 * 60000).toISOString(), // 45 minutes ago
      isRead: false,
      targetName: "John Smith",
      details: "Work List Details:\n- Work List ID: WL-001\n- Type: Pick\n- Total Items: 25\n- Completed: 2024-03-16 10:45 AM\n- Operator: Station-05",
    },
    {
      id: "notif-003",
      type: "Warning",
      priority: "High",
      target: "Group",
      title: "Inventory Threshold Alert",
      message: "Item ITM-5001 has fallen below minimum stock level in Zone A",
      timestamp: new Date(now.getTime() - 2 * 60 * 60000).toISOString(), // 2 hours ago
      isRead: false,
      targetName: "Warehouse Operations Team",
      details: "Item: ITM-5001\nCurrent Stock: 45 units\nMinimum Threshold: 100 units\nLocation: Zone A, Aisle 12\n\nAction Required:\n- Create replenishment work list\n- Check incoming shipments\n- Notify purchasing if needed",
    },
    {
      id: "notif-004",
      type: "Info",
      priority: "Normal",
      target: "Group",
      title: "System Maintenance Scheduled",
      message: "Scheduled maintenance window on Saturday, March 18th from 2:00 AM - 6:00 AM",
      timestamp: new Date(now.getTime() - 4 * 60 * 60000).toISOString(), // 4 hours ago
      isRead: true,
      targetName: "All Users",
      details: "Maintenance Window Details:\n\nDate: Saturday, March 18, 2024\nTime: 2:00 AM - 6:00 AM EST\nDuration: Approximately 4 hours\n\nAffected Services:\n- Work List Management\n- Inventory Updates\n- Reporting Dashboard\n\nPlease ensure all critical work is completed before the maintenance window.",
    },
    {
      id: "notif-005",
      type: "Info",
      priority: "Low",
      target: "User",
      title: "New Feature: Property Visibility",
      message: "A new Property Visibility screen is now available for managing grid columns",
      timestamp: new Date(now.getTime() - 6 * 60 * 60000).toISOString(), // 6 hours ago
      isRead: true,
      targetName: "John Smith",
      details: "New Feature Available!\n\nThe Property Visibility screen allows you to:\n- Control which columns are visible in all grids\n- Save custom column configurations\n- Reset to default settings\n- Apply changes across all work list types\n\nAccess it from: Navigation → System → Property Visibility",
    },
    {
      id: "notif-006",
      type: "Warning",
      priority: "Critical",
      target: "System",
      title: "Host Adapter Connection Issue",
      message: "Intermittent connectivity issues detected with Host Adapter HA-02",
      timestamp: new Date(now.getTime() - 8 * 60 * 60000).toISOString(), // 8 hours ago
      isRead: true,
      targetName: "All Systems",
      details: "Connection Status: Unstable\nHost Adapter: HA-02\nLast Successful Connection: 2024-03-16 08:15 AM\n\nIssues Detected:\n- 3 failed connection attempts in the last hour\n- Average latency increased by 250ms\n- Packet loss: 2.3%\n\nIT Team has been notified and is investigating.",
    },
    {
      id: "notif-007",
      type: "Info",
      priority: "Low",
      target: "Group",
      title: "Performance Metrics Available",
      message: "February performance report is now available in the Analytics dashboard",
      timestamp: new Date(now.getTime() - 24 * 60 * 60000).toISOString(), // 1 day ago
      isRead: true,
      targetName: "Management Team",
      details: "February Performance Report\n\nHighlights:\n- 98.5% on-time completion rate\n- 15% increase in throughput\n- 5% reduction in errors\n- Average pick time: 2.3 minutes\n\nView the full report in the Analytics dashboard.",
    },
    {
      id: "notif-008",
      type: "Warning",
      priority: "High",
      target: "User",
      title: "Action Required: Pending Cycle Count",
      message: "You have a pending cycle count assignment for Zone C that is due today",
      timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60000).toISOString(), // 3 days ago
      isRead: true,
      targetName: "John Smith",
      details: "Cycle Count Assignment\n\nWork List: WL-125\nZone: C\nEstimated Items: 150\nDue Date: Today, 5:00 PM\nPriority: High\n\nPlease complete this cycle count before the end of your shift.",
    },
  ];
};
