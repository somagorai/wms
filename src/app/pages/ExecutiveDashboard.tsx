import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  ChevronRight, 
  Filter, 
  X, 
  Table as TableIcon, 
  LineChart, 
  BarChart3,
  Activity,
  Calendar,
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Package, 
  Home, 
  Star 
} from "lucide-react";
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { TopCard, type TopCardStatus } from "../components/TopCard";
import {
  MasterTableContainer,
  MasterTable,
  MasterTableHead,
  MasterTableTh,
  MasterTableBody,
  MasterTableRow,
  MasterTableCell,
} from "../components/tables/MasterTable";
import { useBookmarks } from "../contexts/BookmarkContext";

const COLORS = [
  'var(--chart-blue)',
  'var(--chart-orange)',
  'var(--chart-purple)',
  'var(--chart-green)',
  'var(--chart-yellow)',
  'var(--chart-teal)',
  'var(--chart-red)',
  'var(--chart-brown)',
];

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
  const [viewMode, setViewMode] = useState<"graph" | "table">("graph");
  const [showFilter, setShowFilter] = useState(false);
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
    <div className="flex flex-col min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-[var(--background)]/95 backdrop-blur-md text-[var(--foreground)] border-b border-[var(--border)] px-8 pt-6 pb-4">
        <div className="flex items-center justify-between gap-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/app/home" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors flex items-center gap-1">
              <Home size={14} />Home
            </Link>
            <ChevronRight size={14} className="text-[var(--muted-foreground)]" />
            <Link to="/app/navigation?section=dashboards" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">
              Business Insights
            </Link>
            <ChevronRight size={14} className="text-[var(--muted-foreground)]" />
            <span className="text-[var(--foreground)] font-semibold text-lg flex items-center gap-2">
              <TrendingUp size={20} className="text-[var(--primary)]" />
              Executive Dashboard
            </span>
          </nav>
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex bg-[var(--surface-container-low)] dark:bg-[var(--card)] rounded-lg p-1 border border-[var(--border)]">
              <button
                onClick={() => setViewMode("graph")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  viewMode === "graph"
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                }`}
              >
                <Activity size={16} />
                Analytics
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  viewMode === "table"
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                }`}
              >
                <TableIcon size={16} />
                Data Tables
              </button>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer border ${
                showFilter 
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)]" 
                  : "bg-[var(--surface-container-low)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--surface-container-high)]"
              }`}
            >
              <Filter size={16} />
              Filter
            </button>
          </div>
        </div>

        {/* Filter Drawer/Bar */}
        {showFilter && (
          <div className="mt-4 pt-4 border-t border-[var(--border)] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-[var(--muted-foreground)]" />
                <span className="text-sm font-medium text-[var(--foreground)]">Time Period:</span>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="bg-[var(--surface-container-low)] text-[var(--foreground)] border border-[var(--border)] text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                >
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>
            </div>
            <button
              onClick={() => setShowFilter(false)}
              className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] flex items-center gap-1 cursor-pointer"
            >
              <X size={14} /> Close
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 p-8 max-w-[1800px] w-full mx-auto">
        {/* Overall Warehouse Status - Prominent KPI Dashboard */}
        <div className="bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] rounded-xl p-6 mb-6">
          <h2 className="text-lg font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
            <div className="w-2 h-6 bg-[var(--primary)] rounded-full"></div>
            Overall Warehouse Status
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {warehouseStatus.map((metric) => {
              const Icon = metric.icon;
              const statusMap: Record<string, TopCardStatus> = {
                good: "success",
                warning: "warning",
                critical: "error",
              };
              const cardStatus = statusMap[metric.status] || "neutral";
              const tileId = `executive-${metric.label.toLowerCase().replace(/\s+/g, '-')}`;
              const iconName = metric.icon === CheckCircle2 ? "CheckCircle2" : metric.icon === Package ? "Package" : metric.icon === AlertTriangle ? "AlertTriangle" : "Clock";

              return (
                <TopCard
                  key={metric.label}
                  type="status"
                  status={cardStatus}
                  label={metric.label}
                  value={metric.value}
                  icon={<Icon size={20} />}
                  isLive={metric.label === "Open Exceptions"}
                  isBookmarked={isBookmarked(tileId)}
                  onBookmarkToggle={(e) => handleBookmarkTile(e, metric.label, metric.value, metric.status, iconName)}
                />
              );
            })}
          </div>
        </div>

        {/* Main Content - Table or Graph View */}
        {viewMode === "table" ? (
          <div className="space-y-4">
            {/* Automation Availability Table */}
            <div className="bg-[var(--surface-container)] border border-[var(--border)] rounded-xl overflow-hidden">
              <div className="p-4 border-b border-[var(--border)]">
                <h3 className="text-base font-semibold text-[var(--foreground)]">Automation Availability %</h3>
                <p className="text-xs text-[var(--muted-foreground)] mt-0.5">By functional area</p>
              </div>
              <MasterTableContainer type="display">
                <MasterTable type="display">
                  <MasterTableHead type="display">
                    <tr>
                      <MasterTableTh type="display" density="compact">Area</MasterTableTh>
                      <MasterTableTh type="display" density="compact">Availability</MasterTableTh>
                      <MasterTableTh type="display" density="compact">Target</MasterTableTh>
                      <MasterTableTh type="display" density="compact">Status</MasterTableTh>
                    </tr>
                  </MasterTableHead>
                  <MasterTableBody type="display">
                    {mockAutomationData.map((item, index) => (
                      <MasterTableRow key={index} type="display">
                        <MasterTableCell type="display" density="compact" className="font-medium">{item.area}</MasterTableCell>
                        <MasterTableCell type="display" density="compact" className="font-semibold">{item.availability}%</MasterTableCell>
                        <MasterTableCell type="display" density="compact" className="text-[var(--muted-foreground)]">{item.target}%</MasterTableCell>
                        <MasterTableCell type="display" density="compact">
                          {item.availability >= item.target ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--state-success-container)] text-[var(--state-on-success-container)] dark:text-[var(--state-success)]">
                              <CheckCircle2 className="w-3 h-3" />
                              On Target
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--state-warning-container)] text-[var(--state-on-warning-container)] dark:text-[var(--state-warning)]">
                              <AlertTriangle className="w-3 h-3" />
                              Below Target
                            </span>
                          )}
                        </MasterTableCell>
                      </MasterTableRow>
                    ))}
                  </MasterTableBody>
                </MasterTable>
              </MasterTableContainer>
            </div>

            {/* Bottlenecks Table */}
            <div className="bg-[var(--surface-container)] border border-[var(--border)] rounded-xl overflow-hidden">
              <div className="p-4 border-b border-[var(--border)]">
                <h3 className="text-base font-semibold text-[var(--foreground)]">Bottlenecks</h3>
                <p className="text-xs text-[var(--muted-foreground)] mt-0.5">Current constraints by zone</p>
              </div>
              <MasterTableContainer type="display">
                <MasterTable type="display">
                  <MasterTableHead type="display">
                    <tr>
                      <MasterTableTh type="display" density="compact">Zone/Resource</MasterTableTh>
                      <MasterTableTh type="display" density="compact">Utilization</MasterTableTh>
                      <MasterTableTh type="display" density="compact">Queue Length</MasterTableTh>
                      <MasterTableTh type="display" density="compact">Constraint Type</MasterTableTh>
                      <MasterTableTh type="display" density="compact">Impact</MasterTableTh>
                    </tr>
                  </MasterTableHead>
                  <MasterTableBody type="display">
                    {mockBottleneckData.map((item, index) => (
                      <MasterTableRow key={index} type="display">
                        <MasterTableCell type="display" density="compact" className="font-medium">{item.zone}</MasterTableCell>
                        <MasterTableCell type="display" density="compact" className="font-semibold">{item.utilization}%</MasterTableCell>
                        <MasterTableCell type="display" density="compact" className="text-[var(--muted-foreground)]">{item.queueLength} items</MasterTableCell>
                        <MasterTableCell type="display" density="compact" className="text-[var(--muted-foreground)]">{item.constraint}</MasterTableCell>
                        <MasterTableCell type="display" density="compact">
                          {item.impact === "High" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--state-error-container)] text-[var(--state-on-error-container)] dark:text-[var(--state-error)]">
                              High Impact
                            </span>
                          ) : item.impact === "Medium" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--state-warning-container)] text-[var(--state-on-warning-container)] dark:text-[var(--state-warning)]">
                              Medium Impact
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--state-info-container)] text-[var(--state-on-info-container)] dark:text-[var(--state-info)]">
                              Low Impact
                            </span>
                          )}
                        </MasterTableCell>
                      </MasterTableRow>
                    ))}
                  </MasterTableBody>
                </MasterTable>
              </MasterTableContainer>
            </div>

            {/* Exception Count Table */}
            <div className="bg-[var(--surface-container)] border border-[var(--border)] rounded-xl overflow-hidden">
              <div className="p-4 border-b border-[var(--border)]">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-[var(--foreground)]">Exception Count</h3>
                    <p className="text-xs text-[var(--muted-foreground)] mt-0.5">Open exceptions by category</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-[var(--state-success-container)] rounded-full">
                    <div className="w-2 h-2 bg-[var(--state-success)] rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-[var(--state-on-success-container)] dark:text-[var(--state-success)]">Auto-Updating</span>
                  </div>
                </div>
              </div>
              <MasterTableContainer type="display">
                <MasterTable type="display">
                  <MasterTableHead type="display">
                    <tr>
                      <MasterTableTh type="display" density="compact">Category</MasterTableTh>
                      <MasterTableTh type="display" density="compact">Open Count</MasterTableTh>
                      <MasterTableTh type="display" density="compact">Trend</MasterTableTh>
                    </tr>
                  </MasterTableHead>
                  <MasterTableBody type="display">
                    {mockExceptionData.map((item, index) => (
                      <MasterTableRow key={index} type="display">
                        <MasterTableCell type="display" density="compact" className="font-medium">{item.category}</MasterTableCell>
                        <MasterTableCell type="display" density="compact" className="font-semibold">{item.count}</MasterTableCell>
                        <MasterTableCell type="display" density="compact">
                          {item.trend === "up" ? (
                            <span className="inline-flex items-center gap-1 text-xs text-[var(--state-error)]">
                              <TrendingUp className="w-4 h-4" />
                              Increasing
                            </span>
                          ) : item.trend === "down" ? (
                            <span className="inline-flex items-center gap-1 text-xs text-[var(--state-on-success-container)] dark:text-[var(--state-success)]">
                              <TrendingDown className="w-4 h-4" />
                              Decreasing
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
                              Stable
                            </span>
                          )}
                        </MasterTableCell>
                      </MasterTableRow>
                    ))}
                  </MasterTableBody>
                </MasterTable>
              </MasterTableContainer>
            </div>

            {/* On-Time Ship Table */}
            <div className="bg-[var(--surface-container)] border border-[var(--border)] rounded-xl overflow-hidden">
              <div className="p-4 border-b border-[var(--border)]">
                <h3 className="text-base font-semibold text-[var(--foreground)]">On-Time Ship %</h3>
                <p className="text-xs text-[var(--muted-foreground)] mt-0.5">Daily performance trend</p>
              </div>
              <MasterTableContainer type="display">
                <MasterTable type="display">
                  <MasterTableHead type="display">
                    <tr>
                      <MasterTableTh type="display" density="compact">Date</MasterTableTh>
                      <MasterTableTh type="display" density="compact">On-Time %</MasterTableTh>
                      <MasterTableTh type="display" density="compact">Status</MasterTableTh>
                    </tr>
                  </MasterTableHead>
                  <MasterTableBody type="display">
                    {mockOnTimeShipData.map((item, index) => (
                      <MasterTableRow key={index} type="display">
                        <MasterTableCell type="display" density="compact" className="font-medium">{item.date}</MasterTableCell>
                        <MasterTableCell type="display" density="compact" className="font-semibold">{item.percentage}%</MasterTableCell>
                        <MasterTableCell type="display" density="compact">
                          {item.percentage >= 97 ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--state-success-container)] text-[var(--state-on-success-container)] dark:text-[var(--state-success)]">
                              <CheckCircle2 className="w-3 h-3" />
                              Excellent
                            </span>
                          ) : item.percentage >= 94 ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--state-warning-container)] text-[var(--state-on-warning-container)] dark:text-[var(--state-warning)]">
                              Good
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--state-error-container)] text-[var(--state-on-error-container)] dark:text-[var(--state-error)]">
                              <AlertTriangle className="w-3 h-3" />
                              Below Target
                            </span>
                          )}
                        </MasterTableCell>
                      </MasterTableRow>
                    ))}
                  </MasterTableBody>
                </MasterTable>
              </MasterTableContainer>
            </div>
          </div>
        ) : (
          /* Graph View */
          <div className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Automation Availability Chart */}
              <div className="bg-[var(--surface-container)] border border-[var(--border)] rounded-xl p-6">
                <h3 className="text-base font-semibold text-[var(--foreground)] mb-0.5">Automation Availability %</h3>
                <p className="text-xs text-[var(--muted-foreground)] mb-4">By functional area</p>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={mockAutomationData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="area" stroke="var(--muted-foreground)" tick={{ fontSize: 12 }} />
                      <YAxis stroke="var(--muted-foreground)" tick={{ fontSize: 12 }} domain={[0, 100]} />
                      <Tooltip
                        cursor={{ fill: "var(--chart-cursor-hover, color-mix(in srgb, var(--primary) 20%, transparent))" }}
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          borderColor: "var(--border)",
                          borderRadius: "8px",
                          color: "var(--foreground)",
                        }}
                      />
                      <Bar dataKey="availability" fill="var(--chart-blue)" name="Current %" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="target" fill="var(--muted-foreground)" opacity={0.3} name="Target %" radius={[6, 6, 0, 0]} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bottlenecks Chart */}
              <div className="bg-[var(--surface-container)] border border-[var(--border)] rounded-xl p-6">
                <h3 className="text-base font-semibold text-[var(--foreground)] mb-0.5">Bottlenecks</h3>
                <p className="text-xs text-[var(--muted-foreground)] mb-4">Utilization by zone</p>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={mockBottleneckData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="zone" stroke="var(--muted-foreground)" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" height={60} />
                      <YAxis stroke="var(--muted-foreground)" tick={{ fontSize: 12 }} domain={[0, 100]} />
                      <Tooltip
                        cursor={{ fill: "var(--chart-cursor-hover, color-mix(in srgb, var(--primary) 20%, transparent))" }}
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          borderColor: "var(--border)",
                          borderRadius: "8px",
                          color: "var(--foreground)",
                        }}
                      />
                      <Bar dataKey="utilization" fill="var(--chart-orange)" name="Utilization %" radius={[6, 6, 0, 0]} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Exception Count Chart */}
              <div className="bg-[var(--surface-container)] border border-[var(--border)] rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-semibold text-[var(--foreground)] mb-0.5">Exception Count</h3>
                    <p className="text-xs text-[var(--muted-foreground)]">By category</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-[var(--state-success-container)] rounded-full">
                    <div className="w-2 h-2 bg-[var(--state-success)] rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-[var(--state-on-success-container)] dark:text-[var(--state-success)]">Live</span>
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
                        outerRadius={100}
                        fill="var(--chart-blue)"
                        dataKey="count"
                        nameKey="category"
                      >
                        {mockExceptionData.map((entry, index) => (
                          <Cell key={`exception-cell-${entry.category}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        cursor={{ fill: "var(--chart-cursor-hover, color-mix(in srgb, var(--primary) 20%, transparent))" }}
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          borderColor: "var(--border)",
                          borderRadius: "8px",
                          color: "var(--foreground)",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* On-Time Ship Chart */}
              <div className="bg-[var(--surface-container)] border border-[var(--border)] rounded-xl p-6">
                <h3 className="text-base font-semibold text-[var(--foreground)] mb-0.5">On-Time Ship %</h3>
                <p className="text-xs text-[var(--muted-foreground)] mb-4">Daily trend</p>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={mockOnTimeShipData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="date" stroke="var(--muted-foreground)" tick={{ fontSize: 12 }} />
                      <YAxis stroke="var(--muted-foreground)" tick={{ fontSize: 12 }} domain={[90, 100]} />
                      <Tooltip
                        cursor={{ fill: "var(--chart-cursor-hover, color-mix(in srgb, var(--primary) 20%, transparent))" }}
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          borderColor: "var(--border)",
                          borderRadius: "8px",
                          color: "var(--foreground)",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="percentage"
                        stroke="var(--chart-blue)"
                        strokeWidth={3}
                        name="On-Time %"
                        dot={{ fill: "var(--chart-blue)", r: 4 }}
                        activeDot={{ r: 6 }}
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