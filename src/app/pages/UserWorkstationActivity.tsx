import { useState, Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import { Activity, Home, ChevronRight, Filter, Clock, Package, RefreshCw, ClipboardList, Search, Settings, X, Calendar, RotateCw, Download, PackageOpen, Layers, ChevronLeft, ChevronDown, Check, Monitor } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { Button } from "../components/ui/button";
import { TopCard } from "../components/TopCard";
import {
  MasterTableContainer,
  MasterTable,
  MasterTableHead,
  MasterTableTh,
  MasterTableBody,
  MasterTableRow,
  MasterTableCell,
} from "../components/tables/MasterTable";

// Type definitions
type ActivityRecord = {
 id: string;
 workstation: string;
 user: string;
 operation: string;
 type: string;
 workList: string;
 container: string;
 item: string;
 quantity: number;
 expectedQuantity?: number;
 timestamp: string;
 duration: number; // in seconds
};

type TimeRangeOption = {
 value: string;
 label: string;
};

type GroupByOption = "none" | "user" | "workstation" | "worklist";

// Time range options - Updated to match Lane Management v2
const timeRangeOptions: TimeRangeOption[] = [
 { value: "today", label: "Today" },
 { value: "last-2-hours", label: "Last 2 Hours" },
 { value: "last-4-hours", label: "Last 4 Hours" },
 { value: "last-6-hours", label: "Last 6 Hours" },
 { value: "last-8-hours", label: "Last 8 Hours" },
 { value: "last-12-hours", label: "Last 12 Hours" },
 { value: "last-24-hours", label: "Last 24 Hours" },
 { value: "last-7-days", label: "Last 7 Days" },
 { value: "last-30-days", label: "Last 30 Days" },
 { value: "custom", label: "Custom" },
];

// Helper function to get unique values from activity data
const getUniqueTypes = (activities: ActivityRecord[]): string[] => {
 return Array.from(new Set(activities.map(a => a.type))).sort();
};

const getUniqueUsers = (activities: ActivityRecord[]): string[] => {
 return Array.from(new Set(activities.map(a => a.user))).sort();
};

const getUniqueWorkstations = (activities: ActivityRecord[]): string[] => {
 return Array.from(new Set(activities.map(a => a.workstation))).sort();
};

// Generate mock activity data
const generateMockActivityData = (): ActivityRecord[] => {
 const activities: ActivityRecord[] = [];
 let id = 1;

 // Pick activities - mix of full and short picks
 const pickWorkList = "WL-PK-001";
 [
 { sku: "SKU-1001", qty: 10, expected: 10, operation: "Full Pick" },
 { sku: "SKU-1002", qty: 12, expected: 15, operation: "Short Pick" },
 { sku: "SKU-1003", qty: 20, expected: 20, operation: "Full Pick" },
 { sku: "SKU-1004", qty: 18, expected: 25, operation: "Short Pick" },
 { sku: "SKU-1005", qty: 30, expected: 30, operation: "Full Pick" },
 ].forEach((item, index) => {
 activities.push({
 id: `ACT-${id++}`,
 workstation: "WS-PICK-01",
 user: "John Smith",
 operation: item.operation,
 type: "Pick",
 workList: pickWorkList,
 container: "CONT-A-001",
 item: item.sku,
 quantity: item.qty,
 expectedQuantity: item.expected,
 timestamp: "2026-06-02 08:15:00",
 duration: 45 + index * 10,
 });
 });

 // Replenishment activities - mix of full and short
 [
 { sku: "SKU-2001", qty: 20, expected: 20, operation: "Full Replenishment" },
 { sku: "SKU-2002", qty: 25, expected: 30, operation: "Short Replenishment" },
 { sku: "SKU-2003", qty: 40, expected: 40, operation: "Full Replenishment" },
 ].forEach((item, index) => {
 activities.push({
 id: `ACT-${id++}`,
 workstation: "WS-REPLEN-01",
 user: "Sarah Johnson",
 operation: item.operation,
 type: "Replenishment",
 workList: "WL-REP-001",
 container: "CONT-B-002",
 item: item.sku,
 quantity: item.qty,
 expectedQuantity: item.expected,
 timestamp: "2026-06-02 09:30:00",
 duration: 120 + index * 20,
 });
 });

 // Cycle Count activities
 ["SKU-3001", "SKU-3002"].forEach((sku, index) => {
 activities.push({
 id: `ACT-${id++}`,
 workstation: "WS-CC-01",
 user: "Michael Brown",
 operation: "Count",
 type: "Cycle Count",
 workList: "WL-CC-001",
 container: "BIN-A1-01",
 item: sku,
 quantity: 24,
 timestamp: "2026-06-02 10:45:00",
 duration: 60 + index * 15,
 });
 });

 // Inspection activities
 ["SKU-4001", "SKU-4002", "SKU-4003", "SKU-4004"].forEach((sku, index) => {
 activities.push({
 id: `ACT-${id++}`,
 workstation: "WS-INSPECT-01",
 user: "Emily Davis",
 operation: "Inspect",
 type: "Inspect",
 workList: "WL-INS-001",
 container: "CONT-C-003",
 item: sku,
 quantity: 1,
 timestamp: "2026-06-02 11:20:00",
 duration: 180 + index * 30,
 });
 });

 // Adjustment activities
 ["SKU-5001", "SKU-5002"].forEach((sku, index) => {
 activities.push({
 id: `ACT-${id++}`,
 workstation: "WS-PICK-02",
 user: "David Wilson",
 operation: "Adjust Inventory",
 type: "Adjustment",
 workList: "WL-ADJ-001",
 container: "CONT-D-004",
 item: sku,
 quantity: 5,
 timestamp: "2026-06-02 13:00:00",
 duration: 90 + index * 20,
 });
 });

 // More Pick activities from different user
 [
 { sku: "SKU-6001", qty: 15, expected: 15, operation: "Full Pick" },
 { sku: "SKU-6002", qty: 20, expected: 20, operation: "Full Pick" },
 { sku: "SKU-6003", qty: 22, expected: 25, operation: "Short Pick" },
 ].forEach((item, index) => {
 activities.push({
 id: `ACT-${id++}`,
 workstation: "WS-PICK-02",
 user: "Jessica Martinez",
 operation: item.operation,
 type: "Pick",
 workList: "WL-PK-002",
 container: "CONT-E-005",
 item: item.sku,
 quantity: item.qty,
 expectedQuantity: item.expected,
 timestamp: "2026-06-02 14:30:00",
 duration: 50 + index * 12,
 });
 });

 // DeWrap activities
 [
 { sku: "SKU-7001", operation: "Full DeWrap" },
 { sku: "SKU-7002", operation: "Partial DeWrap" },
 { sku: "SKU-7003", operation: "Full DeWrap" },
 { sku: "SKU-7004", operation: "Reject DeWrap" },
 ].forEach((item, index) => {
 activities.push({
 id: `ACT-${id++}`,
 workstation: "WS-DEWRAP-01",
 user: "Robert Taylor",
 operation: item.operation,
 type: "DeWrap",
 workList: "WL-DW-001",
 container: "PALLET-F-001",
 item: item.sku,
 quantity: item.operation === "Reject DeWrap" ? 0 : 48,
 timestamp: "2026-06-02 07:45:00",
 duration: 180 + index * 20,
 });
 });

 // Manual DeLayer activities
 [
 { sku: "SKU-8001", operation: "Full Manual DeLayer" },
 { sku: "SKU-8002", operation: "Partial Manual DeLayer" },
 { sku: "SKU-8003", operation: "Full Manual DeLayer" },
 { sku: "SKU-8004", operation: "Adjust Manual DeLayer" },
 ].forEach((item, index) => {
 activities.push({
 id: `ACT-${id++}`,
 workstation: "WS-DELAYER-01",
 user: "Jennifer Anderson",
 operation: item.operation,
 type: "DeLayer",
 workList: "WL-DL-001",
 container: "PALLET-G-001",
 item: item.sku,
 quantity: item.operation === "Adjust Manual DeLayer" ? 12 : 24,
 timestamp: "2026-06-02 08:00:00",
 duration: 150 + index * 25,
 });
 });

 return activities;
};

// Calculate metrics from activity data
const calculateMetrics = (activities: ActivityRecord[]) => {
 const typeMetrics = {
 Pick: { count: 0, totalDuration: 0 },
 Replenishment: { count: 0, totalDuration: 0 },
 "Cycle Count": { count: 0, totalDuration: 0 },
 Inspect: { count: 0, totalDuration: 0 },
 Adjustment: { count: 0, totalDuration: 0 },
 DeWrap: { count: 0, totalDuration: 0 },
 DeLayer: { count: 0, totalDuration: 0 },
 };

 activities.forEach((activity) => {
 if (typeMetrics[activity.type as keyof typeof typeMetrics]) {
 typeMetrics[activity.type as keyof typeof typeMetrics].count++;
 typeMetrics[activity.type as keyof typeof typeMetrics].totalDuration += activity.duration;
 }
 });

 // Calculate average duration per record
 return Object.entries(typeMetrics).map(([type, data]) => ({
 type,
 count: data.count,
 avgDuration: data.count > 0 ? Math.round(data.totalDuration / data.count) : 0,
 }));
};

// Format duration
const formatDuration = (seconds: number): string => {
 const hours = Math.floor(seconds / 3600);
 const minutes = Math.floor((seconds % 3600) / 60);
 const secs = seconds % 60;

 if (hours > 0) {
 return `${hours}h ${minutes}m`;
 } else if (minutes > 0) {
 return `${minutes}m ${secs}s`;
 } else {
 return `${secs}s`;
 }
};

export function UserWorkstationActivity() {
 const [showFilters, setShowFilters] = useState(false);
 const [timeRange, setTimeRange] = useState("today");
 const [customStartDate, setCustomStartDate] = useState("");
 const [customStartTime, setCustomStartTime] = useState("");
 const [customEndDate, setCustomEndDate] = useState("");
 const [customEndTime, setCustomEndTime] = useState("");
 const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
 const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
 const [selectedWorkstations, setSelectedWorkstations] = useState<string[]>([]);
 const [groupBy, setGroupBy] = useState<GroupByOption>("none");

 const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
 const [typeSearch, setTypeSearch] = useState("");
 const [userSearch, setUserSearch] = useState("");
 const [workstationSearch, setWorkstationSearch] = useState("");

 const [detailPanelOpen, setDetailPanelOpen] = useState(false);
 const [selectedRecord, setSelectedRecord] = useState<ActivityRecord | null>(null);
 const [selectedGroup, setSelectedGroup] = useState<{ key: string; records: ActivityRecord[] } | null>(null);
 const [previousGroup, setPreviousGroup] = useState<{ key: string; records: ActivityRecord[] } | null>(null);

 const allActivityData = generateMockActivityData();

 // Get unique values from data for filter dropdowns
 const activityTypes = getUniqueTypes(allActivityData);
 const availableUsers = getUniqueUsers(allActivityData);
 const availableWorkstations = getUniqueWorkstations(allActivityData);

 // Get active filters count and labels
 const getActiveFilters = () => {
 const filters: { label: string; value: string; onRemove: () => void }[] = [];

 // Time range
 const timeRangeLabel = timeRangeOptions.find(opt => opt.value === timeRange)?.label || "Today";
 filters.push({
 label: "Time",
 value: timeRangeLabel,
 onRemove: () => setTimeRange("today"),
 });

 // Selected types (from tiles)
 if (selectedTypes.length > 0 && selectedTypes.length < activityTypes.length) {
 filters.push({
 label: "Type",
 value: selectedTypes.length === 1 ? selectedTypes[0] : `${selectedTypes.length} types`,
 onRemove: () => setSelectedTypes([]),
 });
 }

 // Selected users
 if (selectedUsers.length > 0) {
 filters.push({
 label: "User",
 value: selectedUsers.length === 1 ? selectedUsers[0] : `${selectedUsers.length} users`,
 onRemove: () => setSelectedUsers([]),
 });
 }

 // Selected workstations
 if (selectedWorkstations.length > 0) {
 filters.push({
 label: "Workstation",
 value: selectedWorkstations.length === 1 ? selectedWorkstations[0] : `${selectedWorkstations.length} workstations`,
 onRemove: () => setSelectedWorkstations([]),
 });
 }

 // Group by
 if (groupBy !== "none") {
 filters.push({
 label: "Group By",
 value: groupBy === "user" ? "User" : groupBy === "workstation" ? "Workstation" : "Work List",
 onRemove: () => setGroupBy("none"),
 });
 }

 return filters;
 };

 const activeFilters = getActiveFilters();
 const nonDefaultFilterCount = activeFilters.length - 1; // Exclude time range from count

 // Close dropdown when clicking outside
 useEffect(() => {
 const handleClickOutside = (e: MouseEvent) => {
 const target = e.target as HTMLElement;
 if (!target.closest('.filter-dropdown') && !target.closest('input')) {
 setActiveDropdown(null);
 }
 };

 if (activeDropdown) {
 document.addEventListener('mousedown', handleClickOutside);
 return () => document.removeEventListener('mousedown', handleClickOutside);
 }
 }, [activeDropdown]);

 // Filter data based on selections
 const filteredData = allActivityData.filter((activity) => {
 if (selectedTypes.length > 0 && !selectedTypes.includes(activity.type)) return false;
 if (selectedUsers.length > 0 && !selectedUsers.includes(activity.user)) return false;
 if (selectedWorkstations.length > 0 && !selectedWorkstations.includes(activity.workstation)) return false;
 return true;
 });

 // Sort filtered data by timestamp (newest first)
 const sortedFilteredData = [...filteredData].sort((a, b) => {
 return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
 });

 const metrics = calculateMetrics(sortedFilteredData);

 // Group data if groupBy is set
 const groupedData = () => {
 if (groupBy === "none") {
 return [{ key: "all", records: sortedFilteredData }];
 }

 const groups: { [key: string]: ActivityRecord[] } = {};
 sortedFilteredData.forEach((record) => {
 let key = "";
 if (groupBy === "user") key = record.user;
 else if (groupBy === "workstation") key = record.workstation;
 else if (groupBy === "worklist") key = record.workList;

 if (!groups[key]) groups[key] = [];
 groups[key].push(record);
 });

 return Object.entries(groups).map(([key, records]) => ({ key, records }));
 };

 const handleToggleType = (type: string) => {
 setSelectedTypes((prev) =>
 prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
 );
 };

 const handleToggleUser = (user: string) => {
 setSelectedUsers((prev) =>
 prev.includes(user) ? prev.filter((u) => u !== user) : [...prev, user]
 );
 };

 const handleToggleWorkstation = (workstation: string) => {
 setSelectedWorkstations((prev) =>
 prev.includes(workstation) ? prev.filter((w) => w !== workstation) : [...prev, workstation]
 );
 };

 const handleTileClick = (type: string) => {
 setSelectedTypes((prev) => {
 if (prev.includes(type) && prev.length === 1) {
 // If this is the only selected type, deselect it (show all)
 return [];
 } else if (prev.includes(type)) {
 // If multiple types selected and this is one of them, remove it
 return prev.filter((t) => t !== type);
 } else {
 // Add this type to the selection
 return [...prev, type];
 }
 });
 };

 const handleRecordClick = (record: ActivityRecord, fromGroup?: { key: string; records: ActivityRecord[] }) => {
 setSelectedRecord(record);
 setSelectedGroup(null);
 if (fromGroup) {
 setPreviousGroup(fromGroup);
 } else {
 setPreviousGroup(null);
 }
 setDetailPanelOpen(true);
 };

 const handleGroupClick = (group: { key: string; records: ActivityRecord[] }) => {
 setSelectedGroup(group);
 setSelectedRecord(null);
 setPreviousGroup(null);
 setDetailPanelOpen(true);
 };

 const handleBackToGroup = () => {
 if (previousGroup) {
 setSelectedGroup(previousGroup);
 setSelectedRecord(null);
 }
 };

 const closeDetailPanel = () => {
 setDetailPanelOpen(false);
 setTimeout(() => {
 setSelectedRecord(null);
 setSelectedGroup(null);
 setPreviousGroup(null);
 }, 300);
 };

 return (
    <div className="flex flex-col min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-[var(--background)]/95 backdrop-blur-md text-[var(--foreground)] border-b border-[var(--border)] px-8 h-[72px] min-h-[72px] flex items-center">
        <div className="w-full flex items-center justify-between gap-4">
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
              <Monitor size={20} className="text-[var(--primary)]" />
              User Workstation Activity
            </span>
          </nav>

          <div className="flex items-center gap-3">
            {/* Active Filters Display */}
            <div className="flex items-center gap-2">
              {activeFilters.map((filter, index) => (
                <div
                  key={index}
                  className="group relative flex items-center gap-1.5 px-3 py-1.5 bg-[var(--surface-container-low)] dark:bg-[var(--card)] border border-[var(--border)] rounded-lg text-sm"
                >
                  <span className="text-[var(--muted-foreground)] font-medium">{filter.label}:</span>
                  <span className="text-[var(--foreground)]">{filter.value}</span>
                  {(filter.label !== "Time" || timeRange !== "today") && (
                    <button
                      onClick={filter.onRemove}
                      className="ml-1 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
                      title={`Remove ${filter.label} filter`}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer border ${
                  showFilters
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)] shadow-xs"
                    : "bg-[var(--surface-container-low)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--surface-container-high)]"
                }`}
              >
                <Filter size={16} />
                <span className="text-sm font-medium">Filters</span>
                {nonDefaultFilterCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-xs bg-[var(--primary)] text-[var(--primary-foreground)] font-bold">
                    {nonDefaultFilterCount}
                  </span>
                )}
              </button>

              <button onClick={() => window.location.reload()} className="p-2 rounded-lg border border-[var(--border)] bg-[var(--surface-container-low)] hover:bg-[var(--surface-container-high)] text-[var(--muted-foreground)] transition-colors cursor-pointer" title="Refresh">
                <RotateCw size={16} />
              </button>
              <button className="p-2 rounded-lg border border-[var(--border)] bg-[var(--surface-container-low)] hover:bg-[var(--surface-container-high)] text-[var(--muted-foreground)] transition-colors cursor-pointer" title="Export">
                <Download size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 p-8">
        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-6">
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)]  rounded-xl p-6">
 <div className="flex items-center justify-between mb-4">
 <h3 className="text-[var(--foreground)]  font-semibold">Filters</h3>
 <button
 onClick={() => setShowFilters(false)}
 className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] dark:hover:text-[var(--foreground)] transition-colors"
 >
 <X size={20} />
 </button>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
 {/* Time Range */}
 <div>
 <label className="text-sm font-medium text-[var(--muted-foreground)]  mb-2 block">
 Time Range
 </label>
 <select
 value={timeRange}
 onChange={(e) => setTimeRange(e.target.value)}
 className="w-full px-3 py-2 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg text-sm text-[var(--foreground)]  focus:outline-none focus: focus:)] dark:focus:)]"
 >
 {timeRangeOptions.map((option) => (
 <option key={option.value} value={option.value}>
 {option.label}
 </option>
 ))}
 </select>
 </div>

 {/* Type */}
 <div className="relative">
 <label className="text-sm font-medium text-[var(--muted-foreground)]  mb-2 block">Type</label>
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg px-3 py-2 min-h-[38px]">
 <div className="flex flex-wrap gap-1.5">
 {selectedTypes.map((type) => (
 <span
 key={type}
 className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[var(--primary)]  text-[var(--primary-foreground)] rounded text-xs font-medium"
 >
 {type}
 <button
 onClick={() => handleToggleType(type)}
 className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
 >
 <X size={12} />
 </button>
 </span>
 ))}
 </div>
 {selectedTypes.length > 0 && <div className="h-1"></div>}
 <div className="relative">
 <input
 type="text"
 placeholder="Search or select..."
 value={typeSearch}
 onChange={(e) => setTypeSearch(e.target.value)}
 onFocus={() => setActiveDropdown('type')}
 className="w-full bg-transparent text-[var(--foreground)]  text-sm placeholder-zinc-500 outline-none"
 />
 {activeDropdown === 'type' && (
 <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg max-h-48 overflow-y-auto z-10 filter-dropdown">
 {activityTypes.filter(type => type.toLowerCase().includes(typeSearch.toLowerCase())).map((type) => (
 <button
 key={type}
 onClick={() => {
 handleToggleType(type);
 setTypeSearch('');
 }}
 className={`w-full px-3 py-2 text-left text-sm transition-colors flex items-center gap-2 ${
 selectedTypes.includes(type)
 ? 'bg-[var(--primary)]/10 /10 text-[var(--primary)] dark:text-[var(--primary)]'
 : 'text-[var(--foreground)]  hover:bg-[var(--surface-container-low)] dark:hover:bg-[var(--surface-container-high)]'
 }`}
 >
 <div className={`w-4 h-4 rounded border flex items-center justify-center ${
 selectedTypes.includes(type)
 ? 'bg-[var(--primary)]  border-[var(--primary)] dark:border-[var(--primary)]'
 : 'border-[var(--border)] dark:border-[var(--border)]'
 }`}>
 {selectedTypes.includes(type) && <Check size={12} className="text-[var(--foreground)]" />}
 </div>
 {type}
 </button>
 ))}
 </div>
 )}
 </div>
 </div>
 </div>

 {/* User */}
 <div className="relative">
 <label className="text-sm font-medium text-[var(--muted-foreground)]  mb-2 block">User</label>
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg px-3 py-2 min-h-[38px]">
 <div className="flex flex-wrap gap-1.5">
 {selectedUsers.map((user) => (
 <span
 key={user}
 className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[var(--primary)]  text-[var(--primary-foreground)] rounded text-xs font-medium"
 >
 {user}
 <button
 onClick={() => handleToggleUser(user)}
 className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
 >
 <X size={12} />
 </button>
 </span>
 ))}
 </div>
 {selectedUsers.length > 0 && <div className="h-1"></div>}
 <div className="relative">
 <input
 type="text"
 placeholder="Search or select..."
 value={userSearch}
 onChange={(e) => setUserSearch(e.target.value)}
 onFocus={() => setActiveDropdown('user')}
 className="w-full bg-transparent text-[var(--foreground)]  text-sm placeholder-zinc-500 outline-none"
 />
 {activeDropdown === 'user' && (
 <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg max-h-48 overflow-y-auto z-10 filter-dropdown">
 {availableUsers.filter(user => user.toLowerCase().includes(userSearch.toLowerCase())).map((user) => (
 <button
 key={user}
 onClick={() => {
 handleToggleUser(user);
 setUserSearch('');
 }}
 className={`w-full px-3 py-2 text-left text-sm transition-colors flex items-center gap-2 ${
 selectedUsers.includes(user)
 ? 'bg-[var(--primary)]/10 /10 text-[var(--primary)] dark:text-[var(--primary)]'
 : 'text-[var(--foreground)]  hover:bg-[var(--surface-container-low)] dark:hover:bg-[var(--surface-container-high)]'
 }`}
 >
 <div className={`w-4 h-4 rounded border flex items-center justify-center ${
 selectedUsers.includes(user)
 ? 'bg-[var(--primary)]  border-[var(--primary)] dark:border-[var(--primary)]'
 : 'border-[var(--border)] dark:border-[var(--border)]'
 }`}>
 {selectedUsers.includes(user) && <Check size={12} className="text-[var(--foreground)]" />}
 </div>
 {user}
 </button>
 ))}
 </div>
 )}
 </div>
 </div>
 </div>

 {/* Workstation */}
 <div className="relative">
 <label className="text-sm font-medium text-[var(--muted-foreground)]  mb-2 block">Workstation</label>
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg px-3 py-2 min-h-[38px]">
 <div className="flex flex-wrap gap-1.5">
 {selectedWorkstations.map((workstation) => (
 <span
 key={workstation}
 className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[var(--primary)]  text-[var(--primary-foreground)] rounded text-xs font-medium"
 >
 {workstation}
 <button
 onClick={() => handleToggleWorkstation(workstation)}
 className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
 >
 <X size={12} />
 </button>
 </span>
 ))}
 </div>
 {selectedWorkstations.length > 0 && <div className="h-1"></div>}
 <div className="relative">
 <input
 type="text"
 placeholder="Search or select..."
 value={workstationSearch}
 onChange={(e) => setWorkstationSearch(e.target.value)}
 onFocus={() => setActiveDropdown('workstation')}
 className="w-full bg-transparent text-[var(--foreground)]  text-sm placeholder-zinc-500 outline-none"
 />
 {activeDropdown === 'workstation' && (
 <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg max-h-48 overflow-y-auto z-10 filter-dropdown">
 {availableWorkstations.filter(ws => ws.toLowerCase().includes(workstationSearch.toLowerCase())).map((workstation) => (
 <button
 key={workstation}
 onClick={() => {
 handleToggleWorkstation(workstation);
 setWorkstationSearch('');
 }}
 className={`w-full px-3 py-2 text-left text-sm transition-colors flex items-center gap-2 ${
 selectedWorkstations.includes(workstation)
 ? 'bg-[var(--primary)]/10 /10 text-[var(--primary)] dark:text-[var(--primary)]'
 : 'text-[var(--foreground)]  hover:bg-[var(--surface-container-low)] dark:hover:bg-[var(--surface-container-high)]'
 }`}
 >
 <div className={`w-4 h-4 rounded border flex items-center justify-center ${
 selectedWorkstations.includes(workstation)
 ? 'bg-[var(--primary)]  border-[var(--primary)] dark:border-[var(--primary)]'
 : 'border-[var(--border)] dark:border-[var(--border)]'
 }`}>
 {selectedWorkstations.includes(workstation) && <Check size={12} className="text-[var(--foreground)]" />}
 </div>
 {workstation}
 </button>
 ))}
 </div>
 )}
 </div>
 </div>
 </div>
 </div>

 {/* Custom Date Range */}
 {timeRange === "custom" && (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
 <div>
 <label className="text-sm font-medium text-[var(--muted-foreground)]  mb-2 block">
 Start Date & Time
 </label>
 <div className="flex gap-2">
 <input
 type="date"
 value={customStartDate}
 onChange={(e) => setCustomStartDate(e.target.value)}
 className="flex-1 px-3 py-2 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg text-sm text-[var(--foreground)]  focus:outline-none focus: focus:)] dark:focus:)]"
 />
 <input
 type="time"
 value={customStartTime}
 onChange={(e) => setCustomStartTime(e.target.value)}
 className="px-3 py-2 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg text-sm text-[var(--foreground)]  focus:outline-none focus: focus:)] dark:focus:)]"
 />
 </div>
 </div>
 <div>
 <label className="text-sm font-medium text-[var(--muted-foreground)]  mb-2 block">
 End Date & Time
 </label>
 <div className="flex gap-2">
 <input
 type="date"
 value={customEndDate}
 onChange={(e) => setCustomEndDate(e.target.value)}
 className="flex-1 px-3 py-2 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg text-sm text-[var(--foreground)]  focus:outline-none focus: focus:)] dark:focus:)]"
 />
 <input
 type="time"
 value={customEndTime}
 onChange={(e) => setCustomEndTime(e.target.value)}
 className="px-3 py-2 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg text-sm text-[var(--foreground)]  focus:outline-none focus: focus:)] dark:focus:)]"
 />
 </div>
 </div>
 </div>
 )}

 {/* Group By */}
 <div>
 <label className="text-sm font-medium text-[var(--muted-foreground)]  mb-2 block">
 Group By
 </label>
 <div className="flex gap-2">
 <button
 onClick={() => setGroupBy("none")}
 className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
 groupBy === "none"
 ? "bg-[var(--primary)]  text-[var(--primary-foreground)]"
 : "bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  text-[var(--foreground)]  hover:bg-[var(--surface-container-lowest)] dark:hover:bg-[var(--surface-container-high)]"
 }`}
 >
 None
 </button>
 <button
 onClick={() => setGroupBy("user")}
 className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
 groupBy === "user"
 ? "bg-[var(--primary)]  text-[var(--primary-foreground)]"
 : "bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  text-[var(--foreground)]  hover:bg-[var(--surface-container-lowest)] dark:hover:bg-[var(--surface-container-high)]"
 }`}
 >
 User
 </button>
 <button
 onClick={() => setGroupBy("workstation")}
 className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
 groupBy === "workstation"
 ? "bg-[var(--primary)]  text-[var(--primary-foreground)]"
 : "bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  text-[var(--foreground)]  hover:bg-[var(--surface-container-lowest)] dark:hover:bg-[var(--surface-container-high)]"
 }`}
 >
 Workstation
 </button>
 <button
 onClick={() => setGroupBy("worklist")}
 className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
 groupBy === "worklist"
 ? "bg-[var(--primary)]  text-[var(--primary-foreground)]"
 : "bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  text-[var(--foreground)]  hover:bg-[var(--surface-container-lowest)] dark:hover:bg-[var(--surface-container-high)]"
 }`}
 >
 Work List
 </button>
 </div>
 </div>
 </div>
 </div>
 )}

 {/* Metrics Tiles */}
 <div className="px-6 pb-4">
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-3">
 {metrics.map((metric) => {
 const isSelected = selectedTypes.includes(metric.type);
 const isAnySelected = selectedTypes.length > 0;

 const icon =
 metric.type === "Pick" ? <Package size={16} /> :
 metric.type === "Replenishment" ? <RefreshCw size={16} /> :
 metric.type === "Cycle Count" ? <ClipboardList size={16} /> :
 metric.type === "Inspect" ? <Search size={16} /> :
 metric.type === "Adjustment" ? <Settings size={16} /> :
 metric.type === "DeWrap" ? <PackageOpen size={16} /> :
 metric.type === "DeLayer" ? <Layers size={16} /> :
 <Package size={16} />;

 return (
 <TopCard
 key={metric.type}
 type="clickable"
 layout="compact"
 status="neutral"
 label={metric.type}
 value={metric.count}
 subText={`Avg: ${formatDuration(metric.avgDuration)}`}
 icon={icon}
 isSelected={isSelected}
 isDimmed={isAnySelected && !isSelected}
 onClick={() => handleTileClick(metric.type)}
 />
 );
 })}
 </div>
 </div>

 {/* Data Grid */}
 <div className="flex-1 px-6 pb-6 overflow-hidden">
 <MasterTableContainer type="actionable" className="h-full flex flex-col">
 <MasterTable type="actionable" className="min-w-max">
 <MasterTableHead type="actionable" sticky>
 <tr>
 <MasterTableTh type="actionable" density="compact">Workstation</MasterTableTh>
 <MasterTableTh type="actionable" density="compact">User</MasterTableTh>
 <MasterTableTh type="actionable" density="compact">Operation</MasterTableTh>
 <MasterTableTh type="actionable" density="compact">Type</MasterTableTh>
 <MasterTableTh type="actionable" density="compact">Work List</MasterTableTh>
 <MasterTableTh type="actionable" density="compact">Container</MasterTableTh>
 <MasterTableTh type="actionable" density="compact">Item</MasterTableTh>
 <MasterTableTh type="actionable" density="compact" align="right">Expected Qty</MasterTableTh>
 <MasterTableTh type="actionable" density="compact" align="right">Quantity</MasterTableTh>
 <MasterTableTh type="actionable" density="compact">Time Complete</MasterTableTh>
 <MasterTableTh type="actionable" density="compact" align="right">Duration</MasterTableTh>
 </tr>
 </MasterTableHead>
 <MasterTableBody type="actionable">
 {groupedData().map((group) => (
 <Fragment key={group.key}>
 {groupBy !== "none" && (
 <MasterTableRow
 key={`header-${group.key}`}
 type="actionable"
 clickable
 onClick={() => handleGroupClick(group)}
 className="hover:bg-[var(--surface-container-high)] transition-colors"
 >
 <MasterTableCell
 type="actionable"
 density="compact"
 colSpan={11}
 className="bg-[var(--surface-container-low)] dark:bg-[var(--card)] font-semibold text-sm text-[var(--foreground)] border-b border-[var(--border)]"
 >
 {groupBy === "user" && `User: ${group.key}`}
 {groupBy === "workstation" && `Workstation: ${group.key}`}
 {groupBy === "worklist" && `Work List: ${group.key}`}
 <span className="ml-2 text-xs text-[var(--muted-foreground)]">({group.records.length} records)</span>
 </MasterTableCell>
 </MasterTableRow>
 )}
 {group.records.map((record) => (
 <MasterTableRow
 key={record.id}
 type="actionable"
 clickable
 onClick={() => handleRecordClick(record)}
 >
 <MasterTableCell type="actionable" density="compact" className="font-mono">{record.workstation}</MasterTableCell>
 <MasterTableCell type="actionable" density="compact">{record.user}</MasterTableCell>
 <MasterTableCell type="actionable" density="compact">{record.operation}</MasterTableCell>
 <MasterTableCell type="actionable" density="compact">
 <span className={`px-2 py-0.5 rounded text-xs font-medium ${
 record.type === "Pick"
 ? "bg-[var(--state-info-container)] text-[var(--state-on-info-container)] dark:bg-[var(--state-info-container)] dark:text-[var(--state-info)]"
 : record.type === "Replenishment"
 ? "bg-[var(--state-fatal-container)] text-[var(--tertiary)] dark:bg-[var(--state-fatal-container)] dark:text-[var(--state-fatal)]"
 : record.type === "Cycle Count"
 ? "bg-[var(--state-success-container)] text-[var(--state-on-success-container)] dark:bg-[var(--state-success-container)] dark:text-[var(--state-success)]"
 : record.type === "Inspect"
 ? "bg-[var(--state-warning-container)] text-[var(--state-on-warning-container)] dark:bg-[var(--state-warning-container)]/30 dark:text-[var(--state-warning)]"
 : record.type === "DeWrap"
 ? "bg-[var(--state-error-container)] text-[var(--state-on-error-container)] dark:bg-[var(--state-error-container)]/30 dark:text-[var(--state-error)]"
 : record.type === "DeLayer"
 ? "bg-[var(--state-info-container)] text-[var(--state-on-info-container)] dark:bg-[var(--state-info-container)]/30 dark:text-[var(--state-info)]"
 : "bg-[var(--surface-container-low)] text-[var(--foreground)] dark:bg-[var(--surface-container-high)] "
 }`}>
 {record.type}
 </span>
 </MasterTableCell>
 <MasterTableCell type="actionable" density="compact" className="font-mono">{record.workList}</MasterTableCell>
 <MasterTableCell type="actionable" density="compact" className="font-mono">{record.container}</MasterTableCell>
 <MasterTableCell type="actionable" density="compact" className="font-mono">{record.item}</MasterTableCell>
 <MasterTableCell type="actionable" density="compact" align="right" className="font-medium">
 {record.expectedQuantity !== undefined ? record.expectedQuantity : "-"}
 </MasterTableCell>
 <MasterTableCell type="actionable" density="compact" align="right" className="font-medium">{record.quantity}</MasterTableCell>
 <MasterTableCell type="actionable" density="compact">{record.timestamp}</MasterTableCell>
 <MasterTableCell type="actionable" density="compact" align="right">{formatDuration(record.duration)}</MasterTableCell>
 </MasterTableRow>
 ))}
 </Fragment>
 ))}
 </MasterTableBody>
 </MasterTable>
 </MasterTableContainer>
 </div>

 {/* Detail Panel */}
 <AnimatePresence>
 {detailPanelOpen && (
 <>
 {/* Backdrop */}
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 onClick={closeDetailPanel}
 className="fixed inset-0 bg-black/20 dark:bg-black/50 z-40"
 />

 {/* Panel */}
 <motion.div
 initial={{ x: "100%" }}
 animate={{ x: 0 }}
 exit={{ x: "100%" }}
 transition={{ type: "spring", damping: 30, stiffness: 300 }}
 className="fixed right-0 top-0 h-full w-[600px] bg-[var(--surface-container-low)] text-[var(--foreground)] border-l border-[var(--border)] shadow-2xl z-50 overflow-y-auto"
 >
 {/* Header */}
 <div className="sticky top-0 z-40 bg-[var(--surface-container-low)] backdrop-blur-md text-[var(--foreground)] border-b border-[var(--border)] px-8 py-4 min-h-[72px] flex items-center justify-between">
 <div className="flex items-center gap-3">
 {selectedRecord && previousGroup && (
 <button
 onClick={handleBackToGroup}
 className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors p-2 hover:bg-[var(--surface-container-high)] rounded-lg cursor-pointer"
 title="Back to group"
 >
 <ChevronLeft size={20} />
 </button>
 )}
 <h2 className="text-xl font-bold text-[var(--foreground)]">
 {selectedRecord ? "Activity Detail" : "Group Details"}
 </h2>
 </div>
 <button
 onClick={closeDetailPanel}
 className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors p-2 hover:bg-[var(--surface-container-high)] rounded-lg cursor-pointer"
 >
 <X size={20} />
 </button>
 </div>

 {/* Content */}
 <div className="p-6">
 {selectedRecord && (
 <div className="space-y-6">
 {/* Type Badge */}
 <div>
 <span className={`inline-block px-3 py-1 rounded-lg text-sm font-medium ${
 selectedRecord.type === "Pick"
 ? "bg-[var(--state-info-container)] text-[var(--state-on-info-container)] dark:bg-[var(--state-info-container)] dark:text-[var(--state-info)]"
 : selectedRecord.type === "Replenishment"
 ? "bg-[var(--state-fatal-container)] text-[var(--tertiary)] dark:bg-[var(--state-fatal-container)] dark:text-[var(--state-fatal)]"
 : selectedRecord.type === "Cycle Count"
 ? "bg-[var(--state-success-container)] text-[var(--state-on-success-container)] dark:bg-[var(--state-success-container)] dark:text-[var(--state-success)]"
 : selectedRecord.type === "Inspect"
 ? "bg-[var(--state-warning-container)] text-[var(--state-on-warning-container)] dark:bg-[var(--state-warning-container)]/30 dark:text-[var(--state-warning)]"
 : selectedRecord.type === "DeWrap"
 ? "bg-rose-100 text-[var(--state-on-error-container)] dark:bg-rose-900/30 dark:text-rose-400"
 : selectedRecord.type === "DeLayer"
 ? "bg-[var(--state-info-container)] text-[var(--state-on-info-container)] dark:bg-[var(--state-info-container)]/30 dark:text-[var(--state-info)]"
 : "bg-[var(--surface-container-low)] text-[var(--foreground)] dark:bg-[var(--surface-container-high)] "
 }`}>
 {selectedRecord.type}
 </span>
 </div>

 {/* Details Grid */}
 <div className="grid grid-cols-1 gap-4">
 <div className="bg-[var(--surface)] text-[var(--foreground)] border border-[var(--border)]/50 rounded-xl p-4 shadow-xs">
 <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase">Activity ID</label>
 <p className="text-lg font-mono text-[var(--foreground)] mt-1">{selectedRecord.id}</p>
 </div>

 <div className="bg-[var(--surface)] text-[var(--foreground)] border border-[var(--border)]/50 rounded-xl p-4 shadow-xs">
 <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase">Operation</label>
 <p className="text-lg text-[var(--foreground)] mt-1">{selectedRecord.operation}</p>
 </div>

 <div className="grid grid-cols-2 gap-4">
 <div className="bg-[var(--surface)] text-[var(--foreground)] border border-[var(--border)]/50 rounded-xl p-4 shadow-xs">
 <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase">Workstation</label>
 <p className="text-lg font-mono text-[var(--foreground)] mt-1">{selectedRecord.workstation}</p>
 </div>

 <div className="bg-[var(--surface)] text-[var(--foreground)] border border-[var(--border)]/50 rounded-xl p-4 shadow-xs">
 <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase">User</label>
 <p className="text-lg text-[var(--foreground)] mt-1">{selectedRecord.user}</p>
 </div>
 </div>

 <div className="bg-[var(--surface)] text-[var(--foreground)] border border-[var(--border)]/50 rounded-xl p-4 shadow-xs">
 <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase">Work List</label>
 <p className="text-lg font-mono text-[var(--foreground)] mt-1">{selectedRecord.workList}</p>
 </div>

 <div className="grid grid-cols-2 gap-4">
 <div className="bg-[var(--surface)] text-[var(--foreground)] border border-[var(--border)]/50 rounded-xl p-4 shadow-xs">
 <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase">Container</label>
 <p className="text-lg font-mono text-[var(--foreground)] mt-1">{selectedRecord.container}</p>
 </div>

 <div className="bg-[var(--surface)] text-[var(--foreground)] border border-[var(--border)]/50 rounded-xl p-4 shadow-xs">
 <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase">Item</label>
 <p className="text-lg font-mono text-[var(--foreground)] mt-1">{selectedRecord.item}</p>
 </div>
 </div>

 <div className="grid grid-cols-2 gap-4">
 {selectedRecord.expectedQuantity !== undefined && (
 <div className="bg-[var(--surface)] text-[var(--foreground)] border border-[var(--border)]/50 rounded-xl p-4 shadow-xs">
 <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase">Expected Quantity</label>
 <p className="text-2xl font-bold text-[var(--foreground)] mt-1">{selectedRecord.expectedQuantity}</p>
 </div>
 )}

 <div className="bg-[var(--surface)] text-[var(--foreground)] border border-[var(--border)]/50 rounded-xl p-4 shadow-xs">
 <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase">Actual Quantity</label>
 <p className="text-2xl font-bold text-[var(--foreground)] mt-1">{selectedRecord.quantity}</p>
 </div>
 </div>

 <div className="grid grid-cols-2 gap-4">
 <div className="bg-[var(--surface)] text-[var(--foreground)] border border-[var(--border)]/50 rounded-xl p-4 shadow-xs">
 <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase flex items-center gap-1">
 <Clock size={12} />
 Time Complete
 </label>
 <p className="text-lg text-[var(--foreground)] mt-1">{selectedRecord.timestamp}</p>
 </div>

 <div className="bg-[var(--surface)] text-[var(--foreground)] border border-[var(--border)]/50 rounded-xl p-4 shadow-xs">
 <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase">Duration</label>
 <p className="text-lg font-semibold text-[var(--foreground)] mt-1">{formatDuration(selectedRecord.duration)}</p>
 </div>
 </div>
 </div>
 </div>
 )}

 {selectedGroup && (
 <div className="space-y-6">
 {/* Group Header */}
 <div className="bg-[var(--surface-container-low)] dark:bg-[var(--card)] rounded-lg p-4">
 <h3 className="text-lg font-bold text-[var(--foreground)] ">
 {groupBy === "user" && `User: ${selectedGroup.key}`}
 {groupBy === "workstation" && `Workstation: ${selectedGroup.key}`}
 {groupBy === "worklist" && `Work List: ${selectedGroup.key}`}
 </h3>
 <p className="text-sm text-[var(--muted-foreground)] mt-1">
 {selectedGroup.records.length} total activities
 </p>
 </div>

 {/* Summary Stats */}
 <div className="grid grid-cols-2 gap-4">
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-lg p-4">
 <label className="text-xs font-medium text-[var(--muted-foreground)] uppercase">Total Quantity</label>
 <p className="text-2xl font-bold text-[var(--foreground)]  mt-1">
 {selectedGroup.records.reduce((sum, r) => sum + r.quantity, 0)}
 </p>
 </div>

 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-lg p-4">
 <label className="text-xs font-medium text-[var(--muted-foreground)] uppercase">Total Duration</label>
 <p className="text-2xl font-bold text-[var(--foreground)]  mt-1">
 {formatDuration(selectedGroup.records.reduce((sum, r) => sum + r.duration, 0))}
 </p>
 </div>
 </div>

 {/* Activity List */}
 <div>
 <h4 className="text-sm font-semibold text-[var(--foreground)] mb-3">Activities</h4>
 <div className="space-y-2">
 {selectedGroup.records.map((record) => (
 <div
 key={record.id}
 onClick={() => handleRecordClick(record, selectedGroup)}
 className="bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)]  rounded-lg p-4 hover:border-[var(--primary)] dark:hover:border-[var(--primary)] transition-colors cursor-pointer"
 >
 <div className="flex items-start justify-between mb-2">
 <span className={`px-2 py-0.5 rounded text-xs font-medium ${
 record.type === "Pick"
 ? "bg-[var(--state-info-container)] text-[var(--state-on-info-container)] dark:bg-[var(--state-info-container)] dark:text-[var(--state-info)]"
 : record.type === "Replenishment"
 ? "bg-[var(--state-fatal-container)] text-[var(--tertiary)] dark:bg-[var(--state-fatal-container)] dark:text-[var(--state-fatal)]"
 : record.type === "Cycle Count"
 ? "bg-[var(--state-success-container)] text-[var(--state-on-success-container)] dark:bg-[var(--state-success-container)] dark:text-[var(--state-success)]"
 : record.type === "Inspect"
 ? "bg-[var(--state-warning-container)] text-[var(--state-on-warning-container)] dark:bg-[var(--state-warning-container)]/30 dark:text-[var(--state-warning)]"
 : record.type === "DeWrap"
 ? "bg-rose-100 text-[var(--state-on-error-container)] dark:bg-rose-900/30 dark:text-rose-400"
 : record.type === "DeLayer"
 ? "bg-[var(--state-info-container)] text-[var(--state-on-info-container)] dark:bg-[var(--state-info-container)]/30 dark:text-[var(--state-info)]"
 : "bg-[var(--surface-container-low)] text-[var(--foreground)] dark:bg-[var(--surface-container-high)] "
 }`}>
 {record.type}
 </span>
 <span className="text-xs font-mono text-[var(--muted-foreground)]">{record.id}</span>
 </div>
 <p className="text-sm text-[var(--foreground)]  font-medium mb-1">{record.operation}</p>
 <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
 <span className="font-mono">{record.item}</span>
 <div className="flex items-center gap-3">
 <span>Qty: {record.quantity}</span>
 <span>{formatDuration(record.duration)}</span>
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 )}
 </div>
 </motion.div>
 </>
 )}
 </AnimatePresence>
      </div>
    </div>
  );
}
