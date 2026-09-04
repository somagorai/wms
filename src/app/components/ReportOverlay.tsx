import { X, Sparkles, Grid3x3, BarChart3, Download, Users, Activity, Monitor } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import {
  MasterTableContainer,
  MasterTable,
  MasterTableHead,
  MasterTableTh,
  MasterTableBody,
  MasterTableCell,
} from "./tables/MasterTable";

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
 <div className="absolute inset-0 bg-black/50" />

 {/* Report Modal */}
 <motion.div
 initial={{ scale: 0.9, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 exit={{ scale: 0.9, opacity: 0 }}
 transition={{ type: "spring", damping: 25, stiffness: 200 }}
 onClick={(e) => e.stopPropagation()}
 className="relative w-full max-w-6xl max-h-[90vh] bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] border border-[var(--border)]  rounded-2xl overflow-hidden flex flex-col"
 >
 {/* Header */}
 <div className=")] )] )] )] p-6 text-[var(--foreground)]">
 <div className="flex items-start justify-between">
 <div className="flex items-start gap-4">
 <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center flex-shrink-0">
 <Sparkles size={28} className="text-[var(--primary-foreground)]" />
 </div>
 <div>
 <h2 className="text-2xl font-bold mb-1">{reportTitle}</h2>
 <p className="text-[var(--foreground)]/90 text-sm">Generated by OPTO • {new Date().toLocaleString()}</p>
 </div>
 </div>
 <button
 onClick={onClose}
 className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur rounded-full flex items-center justify-center transition-colors"
 >
 <X size={20} className="text-[var(--foreground)]" />
 </button>
 </div>
 </div>

 {/* Summary Stats */}
 <div className="grid grid-cols-4 gap-4 p-6 border-b border-[var(--border)] ">
 <div className="bg-[var(--surface-container-low)] dark:bg-[var(--card)] rounded-lg p-4">
 <div className="flex items-center gap-2 mb-2">
 <Users size={18} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 <p className="text-xs text-[var(--muted-foreground)] font-medium">Active Users</p>
 </div>
 <p className="text-2xl font-bold text-[var(--foreground)] ">{totalUsers}</p>
 </div>
 <div className="bg-[var(--surface-container-low)] dark:bg-[var(--card)] rounded-lg p-4">
 <div className="flex items-center gap-2 mb-2">
 <Activity size={18} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 <p className="text-xs text-[var(--muted-foreground)] font-medium">Avg Pick Rate</p>
 </div>
 <p className="text-2xl font-bold text-[var(--foreground)] ">{avgPickRate} <span className="text-sm text-[var(--muted-foreground)]">items/hr</span></p>
 </div>
 <div className="bg-[var(--surface-container-low)] dark:bg-[var(--card)] rounded-lg p-4">
 <div className="flex items-center gap-2 mb-2">
 <Monitor size={18} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 <p className="text-xs text-[var(--muted-foreground)] font-medium">Avg Putaway Rate</p>
 </div>
 <p className="text-2xl font-bold text-[var(--foreground)] ">{avgPutawayRate} <span className="text-sm text-[var(--muted-foreground)]">items/hr</span></p>
 </div>
 <div className="bg-[var(--surface-container-low)] dark:bg-[var(--card)] rounded-lg p-4">
 <div className="flex items-center gap-2 mb-2">
 <BarChart3 size={18} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 <p className="text-xs text-[var(--muted-foreground)] font-medium">Total Items</p>
 </div>
 <p className="text-2xl font-bold text-[var(--foreground)] ">{totalItemsProcessed.toLocaleString()}</p>
 </div>
 </div>

 {/* Controls */}
 <div className="flex items-center justify-between p-6 border-b border-[var(--border)] ">
 <div className="flex items-center gap-2 bg-[var(--surface-container-low)] dark:bg-[var(--card)] rounded-lg p-1">
 <button
 onClick={() => setViewMode("grid")}
 className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
 viewMode === "grid"
 ? "bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] text-[var(--primary)] dark:text-[var(--primary)] "
 : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] dark:hover:text-[var(--foreground)]"
 }`}
 >
 <Grid3x3 size={18} />
 <span className="font-medium">Grid</span>
 </button>
 <button
 onClick={() => setViewMode("chart")}
 className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
 viewMode === "chart"
 ? "bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] text-[var(--primary)] dark:text-[var(--primary)] "
 : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] dark:hover:text-[var(--foreground)]"
 }`}
 >
 <BarChart3 size={18} />
 <span className="font-medium">Chart</span>
 </button>
 </div>
 <button
 onClick={handleExport}
 className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)]  hover:opacity-90 active:scale-[0.98] text-[var(--primary-foreground)] rounded-lg transition-colors font-medium"
 >
 <Download size={18} />
 <span>Export CSV</span>
 </button>
 </div>

 {/* Content */}
 <div className="flex-1 overflow-auto p-6">
 {viewMode === "grid" ? (
 <MasterTableContainer type="overlay">
 <MasterTable type="overlay">
 <MasterTableHead type="overlay">
 <tr>
 <MasterTableTh type="overlay" density="compact">User</MasterTableTh>
 <MasterTableTh type="overlay" density="compact">Activity</MasterTableTh>
 <MasterTableTh type="overlay" density="compact">Workstation</MasterTableTh>
 <MasterTableTh type="overlay" density="compact" align="right">Pick Rate</MasterTableTh>
 <MasterTableTh type="overlay" density="compact" align="right">Putaway Rate</MasterTableTh>
 <MasterTableTh type="overlay" density="compact" align="right">Items Processed</MasterTableTh>
 <MasterTableTh type="overlay" density="compact" align="right">Hours</MasterTableTh>
 <MasterTableTh type="overlay" density="compact" align="center">Status</MasterTableTh>
 </tr>
 </MasterTableHead>
 <MasterTableBody type="overlay">
 {userData.map((user, index) => (
 <motion.tr
 key={user.id}
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: index * 0.05 }}
 className="border-b border-[var(--border)] hover:bg-[var(--primary)]/10 transition-colors"
 >
 <MasterTableCell type="overlay" density="compact">
 <div>
 <p className="font-medium text-[var(--foreground)] ">{user.fullName}</p>
 <p className="text-sm text-[var(--muted-foreground)]">{user.username}</p>
 </div>
 </MasterTableCell>
 <MasterTableCell type="overlay" density="compact">
 <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--primary)]/10 /10 text-[var(--primary)] dark:text-[var(--primary)]">
 {user.activityType}
 </span>
 </MasterTableCell>
 <MasterTableCell type="overlay" density="compact">
 <div className="flex items-center gap-2">
 <Monitor size={16} className="text-[var(--muted-foreground)]" />
 <span className="text-[var(--foreground)]  font-mono text-sm">{user.workstation}</span>
 </div>
 </MasterTableCell>
 <MasterTableCell type="overlay" density="compact" align="right">
 <span className="text-[var(--foreground)]  font-semibold">
 {user.pickRate > 0 ? `${user.pickRate} items/hr` : "—"}
 </span>
 </MasterTableCell>
 <MasterTableCell type="overlay" density="compact" align="right">
 <span className="text-[var(--foreground)]  font-semibold">
 {user.putawayRate > 0 ? `${user.putawayRate} items/hr` : "—"}
 </span>
 </MasterTableCell>
 <MasterTableCell type="overlay" density="compact" align="right">
 <span className="text-[var(--foreground)]  font-semibold">{user.itemsProcessed.toLocaleString()}</span>
 </MasterTableCell>
 <MasterTableCell type="overlay" density="compact" align="right">
 <span className="text-[var(--foreground)] ">{user.hoursWorked.toFixed(1)}</span>
 </MasterTableCell>
 <MasterTableCell type="overlay" density="compact" align="center">
 <span className="inline-flex items-center gap-1.5">
 <span className="w-2 h-2 bg-[var(--primary)] rounded-full animate-pulse"></span>
 <span className="text-sm text-[var(--muted-foreground)]">{user.status}</span>
 </span>
 </MasterTableCell>
 </motion.tr>
 ))}
 </MasterTableBody>
 </MasterTable>
 </MasterTableContainer>
 ) : (
 <div className="space-y-8">
 {/* Bar Chart for Pick/Putaway Rates */}
 <div className="bg-[var(--surface-container-lowest)] dark:bg-[var(--surface-container)] rounded-xl p-6">
 <h3 className="text-lg font-semibold text-[var(--foreground)]  mb-4">User Productivity Rates</h3>
 <ResponsiveContainer width="100%" height={400}>
 <BarChart data={chartData} id="user-productivity-chart">
 <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} key="grid" />
 <XAxis
 dataKey="name"
 stroke="var(--muted-foreground)"
 tick={{ fill: "var(--muted-foreground)" }}
 style={{ fontSize: "12px" }}
 key="xaxis"
 />
 <YAxis
 stroke="var(--muted-foreground)"
 tick={{ fill: "var(--muted-foreground)" }}
 style={{ fontSize: "12px" }}
 label={{ value: "Items per Hour", angle: -90, position: "insideLeft", fill: "var(--muted-foreground)" }}
 key="yaxis"
 />
 <Tooltip
 contentStyle={{
 backgroundColor: "var(--card)",
 border: "1px solid var(--border)",
 borderRadius: "8px",
 color: "var(--card)",
 }}
 cursor={{ fill: "var(--chart-cursor-hover, color-mix(in srgb, var(--primary) 20%, transparent))" }}
 key="tooltip"
 />
 <Legend
 wrapperStyle={{ paddingTop: "20px" }}
 iconType="circle"
 key="legend"
 />
 <Bar dataKey="Pick Rate" fill="var(--chart-blue)" radius={[8, 8, 0, 0]} key="pick-rate-bar" />
 <Bar dataKey="Putaway Rate" fill="var(--chart-teal)" radius={[8, 8, 0, 0]} key="putaway-rate-bar" />
 </BarChart>
 </ResponsiveContainer>
 </div>

 {/* Activity Type Breakdown */}
 <div className="grid grid-cols-2 gap-6">
 <div className="bg-[var(--surface-container-lowest)] dark:bg-[var(--surface-container)] rounded-xl p-6">
 <h3 className="text-lg font-semibold text-[var(--foreground)]  mb-4">Activity Distribution</h3>
 <div className="space-y-3">
 {Array.from(new Set(userData.map((u) => u.activityType))).map((activity) => {
 const count = userData.filter((u) => u.activityType === activity).length;
 const percentage = ((count / totalUsers) * 100).toFixed(0);
 return (
 <div key={activity}>
 <div className="flex items-center justify-between mb-2">
 <span className="text-sm font-medium text-[var(--foreground)] ">{activity}</span>
 <span className="text-sm text-[var(--muted-foreground)]">{count} users ({percentage}%)</span>
 </div>
 <div className="w-full bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)] rounded-full h-2">
 <div
 className="bg-[var(--primary)]  h-2 rounded-full transition-all"
 style={{ width: `${percentage}%` }}
 />
 </div>
 </div>
 );
 })}
 </div>
 </div>

 <div className="bg-[var(--surface-container-lowest)] dark:bg-[var(--surface-container)] rounded-xl p-6">
 <h3 className="text-lg font-semibold text-[var(--foreground)]  mb-4">Top Performers</h3>
 <div className="space-y-3">
 {userData
 .sort((a, b) => Math.max(b.pickRate, b.putawayRate) - Math.max(a.pickRate, a.putawayRate))
 .slice(0, 5)
 .map((user, index) => (
 <div key={user.id} className="flex items-center gap-3">
 <div className="w-8 h-8 bg-[var(--primary)]  rounded-full flex items-center justify-center text-[var(--primary-foreground)] font-bold text-sm flex-shrink-0">
 {index + 1}
 </div>
 <div className="flex-1">
 <p className="font-medium text-[var(--foreground)]  text-sm">{user.fullName}</p>
 <p className="text-xs text-[var(--muted-foreground)]">{user.activityType}</p>
 </div>
 <div className="text-right">
 <p className="font-semibold text-[var(--foreground)] ">
 {Math.max(user.pickRate, user.putawayRate)}
 </p>
 <p className="text-xs text-[var(--muted-foreground)]">items/hr</p>
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