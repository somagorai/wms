import { X, Sparkles, Grid3x3, BarChart3, Download, Users, Activity, Monitor } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ReportOverlayProps {
  onClose: () => void;
  reportType: string;
  reportTitle: string;
}

// Mock data for logged-in users report
const generateUserProductivityData = () => {
  return [
    {
      id: 1,
      username: "john.smith",
      fullName: "John Smith",
      activityType: "Pick",
      workstation: "WS-101",
      pickRate: 42,
      putawayRate: 0,
      itemsProcessed: 168,
      hoursWorked: 4.0,
      status: "Active",
    },
    {
      id: 2,
      username: "sarah.jones",
      fullName: "Sarah Jones",
      activityType: "Putaway",
      workstation: "WS-205",
      pickRate: 0,
      putawayRate: 38,
      itemsProcessed: 152,
      hoursWorked: 4.0,
      status: "Active",
    },
    {
      id: 3,
      username: "mike.wilson",
      fullName: "Mike Wilson",
      activityType: "Pick",
      workstation: "WS-103",
      pickRate: 45,
      putawayRate: 0,
      itemsProcessed: 135,
      hoursWorked: 3.0,
      status: "Active",
    },
    {
      id: 4,
      username: "emily.davis",
      fullName: "Emily Davis",
      activityType: "Replenishment",
      workstation: "WS-310",
      pickRate: 0,
      putawayRate: 28,
      itemsProcessed: 84,
      hoursWorked: 3.0,
      status: "Active",
    },
    {
      id: 5,
      username: "robert.brown",
      fullName: "Robert Brown",
      activityType: "Pick",
      workstation: "WS-102",
      pickRate: 48,
      putawayRate: 0,
      itemsProcessed: 240,
      hoursWorked: 5.0,
      status: "Active",
    },
    {
      id: 6,
      username: "lisa.anderson",
      fullName: "Lisa Anderson",
      activityType: "Putaway",
      workstation: "WS-206",
      pickRate: 0,
      putawayRate: 35,
      itemsProcessed: 140,
      hoursWorked: 4.0,
      status: "Active",
    },
    {
      id: 7,
      username: "david.martinez",
      fullName: "David Martinez",
      activityType: "Cycle Count",
      workstation: "WS-405",
      pickRate: 0,
      putawayRate: 0,
      itemsProcessed: 65,
      hoursWorked: 3.5,
      status: "Active",
    },
    {
      id: 8,
      username: "jennifer.taylor",
      fullName: "Jennifer Taylor",
      activityType: "Pick",
      workstation: "WS-104",
      pickRate: 50,
      putawayRate: 0,
      itemsProcessed: 200,
      hoursWorked: 4.0,
      status: "Active",
    },
  ];
};

export function ReportOverlay({ onClose, reportType, reportTitle }: ReportOverlayProps) {
  const [viewMode, setViewMode] = useState<"grid" | "chart">("grid");
  const userData = generateUserProductivityData();

  // Prepare chart data
  const chartData = userData.map((user) => ({
    name: user.fullName.split(" ")[0], // First name only for cleaner chart
    "Pick Rate": user.pickRate,
    "Putaway Rate": user.putawayRate,
    activity: user.activityType,
  }));

  const handleExport = () => {
    // Create CSV content
    const headers = ["Username", "Full Name", "Activity Type", "Workstation", "Pick Rate (items/hr)", "Putaway Rate (items/hr)", "Items Processed", "Hours Worked", "Status"];
    const csvContent = [
      headers.join(","),
      ...userData.map((user) =>
        [
          user.username,
          user.fullName,
          user.activityType,
          user.workstation,
          user.pickRate,
          user.putawayRate,
          user.itemsProcessed,
          user.hoursWorked,
          user.status,
        ].join(",")
      ),
    ].join("\n");

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `user_productivity_report_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Calculate summary stats
  const totalUsers = userData.length;
  const avgPickRate = (userData.reduce((sum, u) => sum + u.pickRate, 0) / userData.filter((u) => u.pickRate > 0).length).toFixed(1);
  const avgPutawayRate = (userData.reduce((sum, u) => sum + u.putawayRate, 0) / userData.filter((u) => u.putawayRate > 0).length).toFixed(1);
  const totalItemsProcessed = userData.reduce((sum, u) => sum + u.itemsProcessed, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Report Modal */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-6xl max-h-[90vh] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0d9488] to-[#0b7a70] dark:from-[#50e080] dark:to-[#3bc76a] p-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center flex-shrink-0">
                <Sparkles size={28} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1">{reportTitle}</h2>
                <p className="text-white/90 text-sm">Generated by OPTO • {new Date().toLocaleString()}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur rounded-full flex items-center justify-center transition-colors"
            >
              <X size={20} className="text-white" />
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4 p-6 border-b border-zinc-200 dark:border-zinc-800">
          <div className="bg-zinc-100 dark:bg-zinc-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users size={18} className="text-[#0d9488] dark:text-[#50e080]" />
              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">Active Users</p>
            </div>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">{totalUsers}</p>
          </div>
          <div className="bg-zinc-100 dark:bg-zinc-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity size={18} className="text-[#0d9488] dark:text-[#50e080]" />
              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">Avg Pick Rate</p>
            </div>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">{avgPickRate} <span className="text-sm text-zinc-600 dark:text-zinc-400">items/hr</span></p>
          </div>
          <div className="bg-zinc-100 dark:bg-zinc-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Monitor size={18} className="text-[#0d9488] dark:text-[#50e080]" />
              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">Avg Putaway Rate</p>
            </div>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">{avgPutawayRate} <span className="text-sm text-zinc-600 dark:text-zinc-400">items/hr</span></p>
          </div>
          <div className="bg-zinc-100 dark:bg-zinc-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 size={18} className="text-[#0d9488] dark:text-[#50e080]" />
              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">Total Items</p>
            </div>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">{totalItemsProcessed.toLocaleString()}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                viewMode === "grid"
                  ? "bg-white dark:bg-zinc-900 text-[#0d9488] dark:text-[#50e080] shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              <Grid3x3 size={18} />
              <span className="font-medium">Grid</span>
            </button>
            <button
              onClick={() => setViewMode("chart")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                viewMode === "chart"
                  ? "bg-white dark:bg-zinc-900 text-[#0d9488] dark:text-[#50e080] shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              <BarChart3 size={18} />
              <span className="font-medium">Chart</span>
            </button>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-[#0d9488] dark:bg-[#50e080] hover:bg-[#0b7a70] dark:hover:bg-[#3bc76a] text-white rounded-lg transition-colors font-medium"
          >
            <Download size={18} />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {viewMode === "grid" ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">User</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">Activity</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">Workstation</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">Pick Rate</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">Putaway Rate</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">Items Processed</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">Hours</th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {userData.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-zinc-900 dark:text-white">{user.fullName}</p>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">{user.username}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#0d9488]/10 dark:bg-[#50e080]/10 text-[#0d9488] dark:text-[#50e080]">
                          {user.activityType}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Monitor size={16} className="text-zinc-500 dark:text-zinc-400" />
                          <span className="text-zinc-900 dark:text-white font-mono text-sm">{user.workstation}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="text-zinc-900 dark:text-white font-semibold">
                          {user.pickRate > 0 ? `${user.pickRate} items/hr` : "—"}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="text-zinc-900 dark:text-white font-semibold">
                          {user.putawayRate > 0 ? `${user.putawayRate} items/hr` : "—"}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="text-zinc-900 dark:text-white font-semibold">{user.itemsProcessed.toLocaleString()}</span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="text-zinc-900 dark:text-white">{user.hoursWorked.toFixed(1)}</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="w-2 h-2 bg-[#50e080] rounded-full animate-pulse"></span>
                          <span className="text-sm text-zinc-600 dark:text-zinc-400">{user.status}</span>
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Bar Chart for Pick/Putaway Rates */}
              <div className="bg-zinc-50 dark:bg-zinc-800/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">User Productivity Rates</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={chartData} id="user-productivity-chart">
                    <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" opacity={0.3} key="grid" />
                    <XAxis
                      dataKey="name"
                      stroke="#71717a"
                      tick={{ fill: "#a1a1aa" }}
                      style={{ fontSize: "12px" }}
                      key="xaxis"
                    />
                    <YAxis
                      stroke="#71717a"
                      tick={{ fill: "#a1a1aa" }}
                      style={{ fontSize: "12px" }}
                      label={{ value: "Items per Hour", angle: -90, position: "insideLeft", fill: "#a1a1aa" }}
                      key="yaxis"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#18181b",
                        border: "1px solid #3f3f46",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                      cursor={{ fill: "rgba(80, 224, 128, 0.1)" }}
                      key="tooltip"
                    />
                    <Legend
                      wrapperStyle={{ paddingTop: "20px" }}
                      iconType="circle"
                      key="legend"
                    />
                    <Bar dataKey="Pick Rate" fill="#0d9488" radius={[8, 8, 0, 0]} key="pick-rate-bar" />
                    <Bar dataKey="Putaway Rate" fill="#50e080" radius={[8, 8, 0, 0]} key="putaway-rate-bar" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Activity Type Breakdown */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-zinc-50 dark:bg-zinc-800/30 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Activity Distribution</h3>
                  <div className="space-y-3">
                    {Array.from(new Set(userData.map((u) => u.activityType))).map((activity) => {
                      const count = userData.filter((u) => u.activityType === activity).length;
                      const percentage = ((count / totalUsers) * 100).toFixed(0);
                      return (
                        <div key={activity}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-zinc-900 dark:text-white">{activity}</span>
                            <span className="text-sm text-zinc-600 dark:text-zinc-400">{count} users ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                            <div
                              className="bg-[#0d9488] dark:bg-[#50e080] h-2 rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-zinc-50 dark:bg-zinc-800/30 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Top Performers</h3>
                  <div className="space-y-3">
                    {userData
                      .sort((a, b) => Math.max(b.pickRate, b.putawayRate) - Math.max(a.pickRate, a.putawayRate))
                      .slice(0, 5)
                      .map((user, index) => (
                        <div key={user.id} className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#0d9488] dark:bg-[#50e080] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-zinc-900 dark:text-white text-sm">{user.fullName}</p>
                            <p className="text-xs text-zinc-600 dark:text-zinc-400">{user.activityType}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-zinc-900 dark:text-white">
                              {Math.max(user.pickRate, user.putawayRate)}
                            </p>
                            <p className="text-xs text-zinc-600 dark:text-zinc-400">items/hr</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}