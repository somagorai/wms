import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Filter, X, Table as TableIcon, LineChart, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Clock, Package, Home, Star } from "lucide-react";
import { BarChart as RechartsBarChart, Bar, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useBookmarks } from "../contexts/BookmarkContext";

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6'];

// Mock data for metrics
const mockAutomationData = [
  { area: "Picking", availability: 98.5, target: 95 },
  { area: "Sorting", availability: 96.2, target: 95 },
  { area: "Packing", availability: 94.8, target: 95 },
  { area: "Conveyor", availability: 97.3, target: 95 },
  { area: "AGV Fleet", availability: 92.1, target: 90 },
];

const mockBottleneckData = [
  { zone: "Pack Zone 2", utilization: 98, queueLength: 45, impact: "High", constraint: "Capacity" },
  { zone: "Sort Lane 5", utilization: 95, queueLength: 38, impact: "High", constraint: "Throughput" },
  { zone: "Pick Zone A", utilization: 87, queueLength: 22, impact: "Medium", constraint: "Resources" },
  { zone: "Receiving Dock 3", utilization: 82, queueLength: 18, impact: "Medium", constraint: "Processing" },
  { zone: "Ship Zone 1", utilization: 76, queueLength: 12, impact: "Low", constraint: "Staging" },
];

const mockExceptionData = [
  { category: "Inventory", count: 12, trend: "up" },
  { category: "Equipment", count: 5, trend: "down" },
  { category: "Order", count: 8, trend: "up" },
  { category: "Quality", count: 3, trend: "stable" },
  { category: "System", count: 2, trend: "down" },
];

const mockOnTimeShipData = [
  { date: "Mon", percentage: 96.5 },
  { date: "Tue", percentage: 97.2 },
  { date: "Wed", percentage: 95.8 },
  { date: "Thu", percentage: 98.1 },
  { date: "Fri", percentage: 97.5 },
  { date: "Sat", percentage: 96.9 },
  { date: "Today", percentage: 97.8 },
];

interface WarehouseStatusMetric {
  label: string;
  value: string | number;
  status: "good" | "warning" | "critical";
  icon: any;
}

export function ExecutiveDashboard() {
  const { toggleBookmark, isBookmarked } = useBookmarks();
  const [viewMode, setViewMode] = useState<"table" | "graph">("graph");
  const [showFilters, setShowFilters] = useState(false);
  const [timeRange, setTimeRange] = useState("today");
  const [exceptionCount, setExceptionCount] = useState(30);

  // Handle bookmark tile
  const handleBookmarkTile = (e: React.MouseEvent, label: string, value: string | number, status: string, iconName: string) => {
    e.stopPropagation();
    const tileId = `executive-${label.toLowerCase().replace(/\s+/g, '-')}`;
    toggleBookmark({
      id: tileId,
      title: label,
      type: "executive",
      icon: iconName,
      data: {
        value,
        status
      }
    });
  };

  // Simulate real-time exception count updates
  useEffect(() => {
    const interval = setInterval(() => {
      setExceptionCount(prev => {
        const change = Math.floor(Math.random() * 5) - 2; // Random change between -2 and +2
        return Math.max(15, Math.min(50, prev + change)); // Keep between 15-50
      });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Calculate overall metrics for warehouse status
  const overallAvailability = mockAutomationData.reduce((sum, item) => sum + item.availability, 0) / mockAutomationData.length;
  const overallOnTimeShip = mockOnTimeShipData[mockOnTimeShipData.length - 1].percentage;
  const criticalBottlenecks = mockBottleneckData.filter(b => b.impact === "High").length;

  const warehouseStatus: WarehouseStatusMetric[] = [
    {
      label: "Automation Availability",
      value: `${overallAvailability.toFixed(1)}%`,
      status: overallAvailability >= 95 ? "good" : overallAvailability >= 90 ? "warning" : "critical",
      icon: CheckCircle2,
    },
    {
      label: "On-Time Ship Rate",
      value: `${overallOnTimeShip.toFixed(1)}%`,
      status: overallOnTimeShip >= 97 ? "good" : overallOnTimeShip >= 94 ? "warning" : "critical",
      icon: Package,
    },
    {
      label: "Critical Bottlenecks",
      value: criticalBottlenecks,
      status: criticalBottlenecks === 0 ? "good" : criticalBottlenecks <= 2 ? "warning" : "critical",
      icon: AlertTriangle,
    },
    {
      label: "Open Exceptions",
      value: exceptionCount,
      status: exceptionCount <= 20 ? "good" : exceptionCount <= 35 ? "warning" : "critical",
      icon: Clock,
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 p-6">
      <div className="max-w-[1800px] mx-auto">
        {/* Sticky Header Section */}
        <div className="sticky top-0 z-40 bg-white dark:bg-zinc-900 pb-3 -mt-6 pt-6 -mx-6 px-6">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mb-2">
            <Link to="/app/home" className="hover:text-[#0d9488] dark:hover:text-[#50e080] transition-colors flex items-center gap-1">
              <Home size={14} />
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/app/navigation" className="hover:text-[#0d9488] dark:hover:text-[#50e080] transition-colors">
              Navigation
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/app/navigation?section=dashboards" className="hover:text-[#0d9488] dark:hover:text-[#50e080] transition-colors">
              Business Insights
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-zinc-900 dark:text-white">Executive Dashboard</span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">Executive Dashboard</h1>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">High-level warehouse performance and operational metrics</p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("table")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                    viewMode === "table"
                      ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                >
                  <TableIcon className="w-4 h-4" />
                  Table
                </button>
                <button
                  onClick={() => setViewMode("graph")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                    viewMode === "graph"
                      ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                >
                  <LineChart className="w-4 h-4" />
                  Graph
                </button>
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  showFilters
                    ? "bg-[#0d9488] dark:bg-[#50e080] text-white dark:text-zinc-900"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                }`}
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Filters</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Time Range */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Time Range
                </label>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-600 rounded-lg text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488] dark:focus:ring-[#50e080]"
                >
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="last7days">Last 7 Days</option>
                  <option value="last30days">Last 30 Days</option>
                  <option value="thisweek">This Week</option>
                  <option value="thismonth">This Month</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>
            </div>
          </div>
        )}
        </div>

        {/* Overall Warehouse Status - Prominent KPI Dashboard */}
        <div className="bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-800 dark:to-zinc-800/50 border-2 border-zinc-300 dark:border-zinc-600 rounded-xl p-4 mb-4 shadow-lg">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
            <div className="w-2 h-6 bg-[#0d9488] dark:bg-[#50e080] rounded-full"></div>
            Overall Warehouse Status
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {warehouseStatus.map((metric) => {
              const Icon = metric.icon;
              const statusColors = {
                good: "bg-green-100 dark:bg-green-900/30 border-green-500 dark:border-green-500",
                warning: "bg-yellow-100 dark:bg-yellow-900/30 border-yellow-500 dark:border-yellow-500",
                critical: "bg-red-100 dark:bg-red-900/30 border-red-500 dark:border-red-500",
              };
              const iconColors = {
                good: "text-green-600 dark:text-green-400",
                warning: "text-yellow-600 dark:text-yellow-400",
                critical: "text-red-600 dark:text-red-400",
              };
              const textColors = {
                good: "text-green-900 dark:text-green-100",
                warning: "text-yellow-900 dark:text-yellow-100",
                critical: "text-red-900 dark:text-red-100",
              };

              const tileId = `executive-${metric.label.toLowerCase().replace(/\s+/g, '-')}`;
              const iconName = metric.icon === CheckCircle2 ? "CheckCircle2" : metric.icon === Package ? "Package" : metric.icon === AlertTriangle ? "AlertTriangle" : "Clock";

              return (
                <div
                  key={metric.label}
                  className={`${statusColors[metric.status]} border-2 rounded-lg p-4 transition-all hover:shadow-md relative`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className={`p-2 rounded-lg bg-white/50 dark:bg-zinc-900/30 ${iconColors[metric.status]}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-2">
                      {metric.label === "Open Exceptions" && (
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-zinc-600 dark:text-zinc-400">Live</span>
                        </div>
                      )}
                      <button
                        onClick={(e) => handleBookmarkTile(e, metric.label, metric.value, metric.status, iconName)}
                        className={`p-1 rounded transition-colors ${iconColors[metric.status]} hover:bg-white/30 dark:hover:bg-zinc-900/30`}
                        title={isBookmarked(tileId) ? "Remove bookmark" : "Add bookmark"}
                      >
                        <Star className={`${isBookmarked(tileId) ? `fill-current` : ""}`} size={16} />
                      </button>
                    </div>
                  </div>
                  <div className={`text-2xl font-bold ${textColors[metric.status]} mb-0.5`}>
                    {metric.value}
                  </div>
                  <div className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    {metric.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content - Table or Graph View */}
        {viewMode === "table" ? (
          <div className="space-y-4">
            {/* Automation Availability Table */}
            <div className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden">
              <div className="p-3 border-b border-zinc-200 dark:border-zinc-700">
                <h3 className="text-base font-semibold text-zinc-900 dark:text-white">Automation Availability %</h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">By functional area</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-zinc-100 dark:bg-zinc-800">
                      <th className="px-4 py-2 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase">Area</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase">Availability</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase">Target</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockAutomationData.map((item, index) => (
                      <tr key={index} className="border-t border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100/50 dark:hover:bg-zinc-700/30">
                        <td className="px-4 py-2 text-sm font-medium text-zinc-900 dark:text-white">{item.area}</td>
                        <td className="px-4 py-2 text-sm text-zinc-900 dark:text-white font-semibold">{item.availability}%</td>
                        <td className="px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400">{item.target}%</td>
                        <td className="px-4 py-2">
                          {item.availability >= item.target ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                              <CheckCircle2 className="w-3 h-3" />
                              On Target
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">
                              <AlertTriangle className="w-3 h-3" />
                              Below Target
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottlenecks Table */}
            <div className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden">
              <div className="p-3 border-b border-zinc-200 dark:border-zinc-700">
                <h3 className="text-base font-semibold text-zinc-900 dark:text-white">Bottlenecks</h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">Current constraints by zone</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-zinc-100 dark:bg-zinc-800">
                      <th className="px-4 py-2 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase">Zone/Resource</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase">Utilization</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase">Queue Length</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase">Constraint Type</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase">Impact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockBottleneckData.map((item, index) => (
                      <tr key={index} className="border-t border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100/50 dark:hover:bg-zinc-700/30">
                        <td className="px-4 py-2 text-sm font-medium text-zinc-900 dark:text-white">{item.zone}</td>
                        <td className="px-4 py-2 text-sm text-zinc-900 dark:text-white font-semibold">{item.utilization}%</td>
                        <td className="px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400">{item.queueLength} items</td>
                        <td className="px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400">{item.constraint}</td>
                        <td className="px-4 py-2">
                          {item.impact === "High" ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                              High Impact
                            </span>
                          ) : item.impact === "Medium" ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">
                              Medium Impact
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                              Low Impact
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Exception Count Table */}
            <div className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden">
              <div className="p-3 border-b border-zinc-200 dark:border-zinc-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-zinc-900 dark:text-white">Exception Count</h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">Open exceptions by category</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-green-700 dark:text-green-400">Auto-Updating</span>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-zinc-100 dark:bg-zinc-800">
                      <th className="px-4 py-2 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase">Category</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase">Open Count</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockExceptionData.map((item, index) => (
                      <tr key={index} className="border-t border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100/50 dark:hover:bg-zinc-700/30">
                        <td className="px-4 py-2 text-sm font-medium text-zinc-900 dark:text-white">{item.category}</td>
                        <td className="px-4 py-2 text-sm text-zinc-900 dark:text-white font-semibold">{item.count}</td>
                        <td className="px-4 py-2">
                          {item.trend === "up" ? (
                            <span className="inline-flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                              <TrendingUp className="w-4 h-4" />
                              Increasing
                            </span>
                          ) : item.trend === "down" ? (
                            <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                              <TrendingDown className="w-4 h-4" />
                              Decreasing
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-zinc-600 dark:text-zinc-400">
                              Stable
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* On-Time Ship Table */}
            <div className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden">
              <div className="p-3 border-b border-zinc-200 dark:border-zinc-700">
                <h3 className="text-base font-semibold text-zinc-900 dark:text-white">On-Time Ship %</h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">Daily performance trend</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-zinc-100 dark:bg-zinc-800">
                      <th className="px-4 py-2 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase">Date</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase">On-Time %</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockOnTimeShipData.map((item, index) => (
                      <tr key={index} className="border-t border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100/50 dark:hover:bg-zinc-700/30">
                        <td className="px-4 py-2 text-sm font-medium text-zinc-900 dark:text-white">{item.date}</td>
                        <td className="px-4 py-2 text-sm text-zinc-900 dark:text-white font-semibold">{item.percentage}%</td>
                        <td className="px-4 py-2">
                          {item.percentage >= 97 ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                              <CheckCircle2 className="w-3 h-3" />
                              Excellent
                            </span>
                          ) : item.percentage >= 94 ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">
                              Good
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                              <AlertTriangle className="w-3 h-3" />
                              Below Target
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* Graph View */
          <div className="space-y-4">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {/* Automation Availability Chart */}
              <div className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-700 rounded-lg p-4">
                <h3 className="text-base font-semibold text-zinc-900 dark:text-white mb-0.5">Automation Availability %</h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-3">By functional area</p>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={mockAutomationData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                      <XAxis dataKey="area" stroke="#71717a" tick={{ fontSize: 12 }} />
                      <YAxis stroke="#71717a" tick={{ fontSize: 12 }} domain={[0, 100]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#18181b",
                          border: "1px solid #3f3f46",
                          borderRadius: "8px",
                          color: "#fff",
                        }}
                      />
                      <Bar dataKey="availability" fill="#10b981" name="Current %" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="target" fill="#6b7280" name="Target %" radius={[8, 8, 0, 0]} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bottlenecks Chart */}
              <div className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-700 rounded-lg p-4">
                <h3 className="text-base font-semibold text-zinc-900 dark:text-white mb-0.5">Bottlenecks</h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-3">Utilization by zone</p>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={mockBottleneckData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                      <XAxis dataKey="zone" stroke="#71717a" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" height={80} />
                      <YAxis stroke="#71717a" tick={{ fontSize: 12 }} domain={[0, 100]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#18181b",
                          border: "1px solid #3f3f46",
                          borderRadius: "8px",
                          color: "#fff",
                        }}
                      />
                      <Bar dataKey="utilization" fill="#f59e0b" name="Utilization %" radius={[8, 8, 0, 0]} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Exception Count Chart */}
              <div className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-base font-semibold text-zinc-900 dark:text-white mb-0.5">Exception Count</h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">By category</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-green-700 dark:text-green-400">Live</span>
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mockExceptionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ category, count }) => `${category}: ${count}`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="count"
                        nameKey="category"
                      >
                        {mockExceptionData.map((entry, index) => (
                          <Cell key={`exception-cell-${entry.category}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div style={{
                                backgroundColor: "#18181b",
                                border: "1px solid #3f3f46",
                                borderRadius: "8px",
                                padding: "8px 12px",
                                color: "#fff",
                              }}>
                                <p>{`${payload[0].name}: ${payload[0].value}`}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* On-Time Ship Chart */}
              <div className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-700 rounded-lg p-4">
                <h3 className="text-base font-semibold text-zinc-900 dark:text-white mb-0.5">On-Time Ship %</h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-3">Daily trend</p>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={mockOnTimeShipData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                      <XAxis dataKey="date" stroke="#71717a" tick={{ fontSize: 12 }} />
                      <YAxis stroke="#71717a" tick={{ fontSize: 12 }} domain={[90, 100]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#18181b",
                          border: "1px solid #3f3f46",
                          borderRadius: "8px",
                          color: "#fff",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="percentage"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        name="On-Time %"
                        dot={{ fill: "#3b82f6", r: 5 }}
                        activeDot={{ r: 7 }}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExecutiveDashboard;