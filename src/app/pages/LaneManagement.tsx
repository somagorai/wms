import { useState } from "react";
import { Link } from "react-router-dom";
import { Home, ChevronRight, Package, Search, Activity, Hospital, Play, Link2, X, Clock, Filter, Check, Layers } from "lucide-react";
import { toast } from "sonner";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { Button } from "../components/ui/button";

// Time range options
const timeRangeOptions = [
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

// Mock data for lanes v3 - Updated Hospital lane data
const mockLanes = [
 {
 id: "LANE-001",
 name: "Lane 1",
 containersSent: 45,
 containersArrived: 42,
 idleTime: "2m 15s",
 fullPercentage: 75,
 isHospital: false,
 items: [
 { sku: "SKU-4521", name: "Kraft Macaroni & Cheese", quantity: 120, inMultipleLanes: true },
 { sku: "SKU-3301", name: "Campbell's Tomato Soup", quantity: 85, inMultipleLanes: false },
 ],
 scans: [
 { lpn: "LPN-10001", scanTime: "2026-06-02\n14:32:15", item: "Kraft Macaroni & Cheese", itemQuantity: 24, scannerId: "SCAN-A1", reason: "System" },
 { lpn: "LPN-10002", scanTime: "2026-06-02\n14:28:42", item: "Kraft Macaroni & Cheese", itemQuantity: 24, scannerId: "SCAN-A1", reason: "System" },
 { lpn: "LPN-10003", scanTime: "2026-06-02\n14:25:18", item: "Campbell's Tomato Soup", itemQuantity: 12, scannerId: "SCAN-A2", reason: "System" },
 { lpn: "LPN-10004", scanTime: "2026-06-02\n14:21:55", item: "Kraft Macaroni & Cheese", itemQuantity: 24, scannerId: "SCAN-A1", reason: "System" },
 { lpn: "LPN-10005", scanTime: "2026-06-02\n14:18:33", item: "Campbell's Tomato Soup", itemQuantity: 12, scannerId: "SCAN-A2", reason: "System" },
 ],
 },
 {
 id: "LANE-002",
 name: "Lane 2",
 containersSent: 38,
 containersArrived: 33,
 idleTime: "5m 42s",
 fullPercentage: 92,
 isHospital: false,
 items: [
 { sku: "SKU-5201", name: "Coca-Cola Classic 12pk", quantity: 156, inMultipleLanes: false },
 ],
 scans: [
 { lpn: "LPN-20001", scanTime: "2026-06-02\n14:30:22", item: "Coca-Cola Classic 12pk", itemQuantity: 12, scannerId: "SCAN-B1", reason: "System" },
 { lpn: "LPN-20002", scanTime: "2026-06-02\n14:26:18", item: "Coca-Cola Classic 12pk", itemQuantity: 12, scannerId: "SCAN-B1", reason: "System" },
 { lpn: "LPN-20003", scanTime: "2026-06-02\n14:22:45", item: "Coca-Cola Classic 12pk", itemQuantity: 12, scannerId: "SCAN-B2", reason: "System" },
 ],
 },
 {
 id: "LANE-003",
 name: "Lane 3",
 containersSent: 0,
 containersArrived: 8,
 idleTime: "1m 08s",
 fullPercentage: 65,
 isHospital: true,
 items: [
 { sku: "SKU-4521", name: "Kraft Macaroni & Cheese", quantity: 48, inMultipleLanes: true },
 { sku: "SKU-7801", name: "Lay's Classic Potato Chips", quantity: 92, inMultipleLanes: false },
 { sku: "SKU-9101", name: "Cheerios Original", quantity: 36, inMultipleLanes: false },
 ],
 scans: [
 { lpn: "No Read", scanTime: "2026-06-02\n14:33:10", item: "Kraft Macaroni & Cheese", itemQuantity: 12, scannerId: "SCAN-C1", reason: "No Read" },
 { lpn: "LPN-30002", scanTime: "2026-06-02\n14:29:45", item: "Lay's Classic Potato Chips", itemQuantity: 24, scannerId: "SCAN-C2", reason: "Overweight" },
 { lpn: "No Read", scanTime: "2026-06-02\n14:25:30", item: "Cheerios Original", itemQuantity: 12, scannerId: "SCAN-C1", reason: "No Read" },
 { lpn: "LPN-30004", scanTime: "2026-06-02\n14:21:15", item: "Kraft Macaroni & Cheese", itemQuantity: 12, scannerId: "SCAN-C1", reason: "Overweight" },
 { lpn: "No Read", scanTime: "2026-06-02\n14:20:50", item: "Lay's Classic Potato Chips", itemQuantity: 24, scannerId: "SCAN-C2", reason: "No Read" },
 { lpn: "LPN-30005", scanTime: "2026-06-02\n14:18:22", item: "Cheerios Original", itemQuantity: 12, scannerId: "SCAN-C1", reason: "Overweight" },
 { lpn: "No Read", scanTime: "2026-06-02\n14:17:05", item: "Kraft Macaroni & Cheese", itemQuantity: 12, scannerId: "SCAN-C1", reason: "No Read" },
 { lpn: "LPN-30006", scanTime: "2026-06-02\n14:15:40", item: "Lay's Classic Potato Chips", itemQuantity: 24, scannerId: "SCAN-C2", reason: "Overweight" },
 ],
 },
 {
 id: "LANE-004",
 name: "Lane 4",
 containersSent: 41,
 containersArrived: 41,
 idleTime: "3m 55s",
 fullPercentage: 48,
 isHospital: false,
 items: [
 { sku: "SKU-3302", name: "Campbell's Chicken Noodle Soup", quantity: 78, inMultipleLanes: false },
 { sku: "SKU-5202", name: "Pepsi Cola 12pk", quantity: 64, inMultipleLanes: false },
 ],
 scans: [
 { lpn: "LPN-40001", scanTime: "2026-06-02\n14:31:50", item: "Campbell's Chicken Noodle Soup", itemQuantity: 12, scannerId: "SCAN-D1", reason: "System" },
 { lpn: "LPN-40002", scanTime: "2026-06-02\n14:27:35", item: "Pepsi Cola 12pk", itemQuantity: 12, scannerId: "SCAN-D2", reason: "System" },
 { lpn: "LPN-40003", scanTime: "2026-06-02\n14:23:20", item: "Campbell's Chicken Noodle Soup", itemQuantity: 12, scannerId: "SCAN-D1", reason: "System" },
 ],
 },
];

export function LaneManagement() {
 const [lanes, setLanes] = useState(mockLanes);
 const [selectedLane, setSelectedLane] = useState<typeof mockLanes[0] | null>(null);
 const [searchQuery, setSearchQuery] = useState("");
 const [hoveredItem, setHoveredItem] = useState<string | null>(null);
 const [resolvedScans, setResolvedScans] = useState<Set<string>>(new Set());
 const [showFilters, setShowFilters] = useState(false);
 const [selectedLaneFilters, setSelectedLaneFilters] = useState<string[]>([]);
 const [laneFilterOpen, setLaneFilterOpen] = useState(false);
 const [timeRange, setTimeRange] = useState("today");
 const [timeRangeOpen, setTimeRangeOpen] = useState(false);
 const [customStartDate, setCustomStartDate] = useState("");
 const [customEndDate, setCustomEndDate] = useState("");

 const handleReleaseLane = (laneId: string) => {
 const lane = lanes.find(l => l.id === laneId);
 toast.success(`${lane?.name} released`, {
 description: "All containers have been released from the lane",
 duration: 3000,
 });
 };

 const handleSetHospital = (laneId: string) => {
 setLanes(lanes.map(lane => ({
 ...lane,
 isHospital: lane.id === laneId ? !lane.isHospital : lane.isHospital,
 })));
 const lane = lanes.find(l => l.id === laneId);
 toast.success(lane?.isHospital ? `${lane.name} removed from hospital` : `${lane?.name} set as hospital lane`, {
 duration: 3000,
 });
 };

 const handleLaneClick = (lane: typeof mockLanes[0]) => {
 setSelectedLane(lane);
 setSearchQuery("");
 };

 const closeSidePanel = () => {
 setSelectedLane(null);
 setSearchQuery("");
 };

 const handleResolveScan = (laneId: string, lpn: string) => {
 const scanKey = `${laneId}-${lpn}`;
 setResolvedScans(prev => {
 const newSet = new Set(prev);
 newSet.add(scanKey);
 return newSet;
 });
 toast.success("Scan resolved", {
 description: `${lpn} has been marked as resolved`,
 duration: 2000,
 });
 };

 const filteredScans = selectedLane?.scans.filter(scan => {
 const query = searchQuery.toLowerCase();
 return (
 scan.lpn.toLowerCase().includes(query) ||
 scan.item.toLowerCase().includes(query) ||
 scan.scannerId.toLowerCase().includes(query) ||
 scan.scanTime.toLowerCase().includes(query) ||
 scan.itemQuantity.toString().includes(query) ||
 scan.reason.toLowerCase().includes(query)
 );
 });

 const toggleLaneFilter = (laneId: string) => {
 setSelectedLaneFilters(prev => {
 if (prev.includes(laneId)) {
 return prev.filter(id => id !== laneId);
 } else {
 return [...prev, laneId];
 }
 });
 };

 const filteredLanes = selectedLaneFilters.length > 0
 ? lanes.filter(lane => selectedLaneFilters.includes(lane.id))
 : lanes;

 return (
 <div className="h-screen flex flex-col bg-[var(--surface-container-high)] text-[var(--foreground)]">
 {/* Sticky Header */}
 <div className="sticky top-0 z-40 bg-[var(--background)]/95 backdrop-blur-md text-[var(--foreground)] border-b border-[var(--border)] px-8 pt-6 pb-4">
 <div className="flex items-center justify-between gap-4">
 <nav className="flex items-center gap-2 text-sm">
 <Link to="/app/home" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] dark:hover:text-[var(--primary)] transition-colors flex items-center gap-1">
 <Home size={14} />Home
 </Link>
 <ChevronRight size={14} className="text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]" />
 <Link to="/app/navigation?section=operations" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] dark:hover:text-[var(--primary)] transition-colors">
 Operations
 </Link>
 <ChevronRight size={14} className="text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]" />
 <span className="text-[var(--foreground)]  font-semibold text-lg flex items-center gap-2">
 <Layers size={20} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 Lane Management
 </span>
 </nav>
 <div className="flex items-center gap-2">
 <button
 onClick={() => setShowFilters(!showFilters)}
 className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 border ${
 showFilters
 ? 'bg-[var(--primary)] hover:opacity-90 active:scale-[0.98] text-[var(--primary-foreground)] border-[var(--primary)] dark:border-[var(--primary)] '
 : 'bg-[var(--surface-container-low)] dark:bg-[var(--card)] hover:bg-[var(--surface-container-high)] text-[var(--foreground)] border-[var(--border)] '
 }`}
 >
 <Filter size={16} />
 Filters
 </button>
 </div>
 </div>
 </div>

 {/* Filter Section */}
 {showFilters && (
 <div className="bg-[var(--surface-container-high)] text-[var(--foreground)] border-b border-[var(--border)]  px-6 py-4">
 <div className="flex flex-wrap gap-6">
 {/* Lane Filter */}
 <div className="w-80">
 <label className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-2 block">Filter by Lane</label>
 <Popover open={laneFilterOpen} onOpenChange={setLaneFilterOpen}>
 <PopoverTrigger asChild>
 <button className="w-full flex items-center justify-between px-4 py-3 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] border-[var(--border)]  rounded-lg text-[var(--foreground)] transition-colors">
 <span className={selectedLaneFilters.length > 0 ? "text-white" : "text-[var(--muted-foreground)]"}>
 {selectedLaneFilters.length > 0
 ? `${selectedLaneFilters.length} lane${selectedLaneFilters.length > 1 ? 's' : ''} selected`
 : "Select lanes..."}
 </span>
 <Search size={16} className="text-[var(--muted-foreground)]" />
 </button>
 </PopoverTrigger>
 <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
 <Command className="bg-[var(--surface-container-high)] text-[var(--foreground)] border-[var(--border)] ">
 <CommandInput placeholder="Search lanes..." className="text-[var(--foreground)]" />
 <CommandList>
 <CommandEmpty className="text-[var(--muted-foreground)] text-sm py-6 text-center">No lane found.</CommandEmpty>
 <CommandGroup>
 {lanes.map((lane) => (
 <CommandItem
 key={lane.id}
 value={lane.id}
 onSelect={() => toggleLaneFilter(lane.id)}
 className="text-[var(--foreground)] hover:bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)]"
 >
 <Check
 className={`mr-2 h-4 w-4 ${
 selectedLaneFilters.includes(lane.id) ? "opacity-100" : "opacity-0"
 }`}
 />
 {lane.name} ({lane.id})
 </CommandItem>
 ))}
 </CommandGroup>
 </CommandList>
 </Command>
 </PopoverContent>
 </Popover>
 {selectedLaneFilters.length > 0 && (
 <button
 onClick={() => setSelectedLaneFilters([])}
 className="mt-2 text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
 >
 Clear lane filter
 </button>
 )}
 </div>

 {/* Time Range Filter */}
 <div className="flex-1 flex gap-4">
 <div className="w-80">
 <label className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-2 block">
 Time Range
 <span className="text-[var(--muted-foreground)] ml-1">(affects Containers Sent/Arrived)</span>
 </label>
 <Popover open={timeRangeOpen} onOpenChange={setTimeRangeOpen}>
 <PopoverTrigger asChild>
 <button className="w-full flex items-center justify-between px-4 py-3 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] border-[var(--border)]  rounded-lg text-[var(--foreground)] transition-colors">
 <span className="text-[var(--foreground)]">
 {timeRangeOptions.find(option => option.value === timeRange)?.label || "Today"}
 </span>
 <ChevronRight size={16} className="text-[var(--muted-foreground)] rotate-90" />
 </button>
 </PopoverTrigger>
 <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
 <Command className="bg-[var(--surface-container-high)] text-[var(--foreground)] border-[var(--border)] ">
 <CommandList>
 <CommandGroup>
 {timeRangeOptions.map((option) => (
 <CommandItem
 key={option.value}
 value={option.value}
 onSelect={(value) => {
 setTimeRange(value);
 if (value !== "custom") {
 setTimeRangeOpen(false);
 }
 }}
 className="text-[var(--foreground)] hover:bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)]"
 >
 <Check
 className={`mr-2 h-4 w-4 ${
 timeRange === option.value ? "opacity-100" : "opacity-0"
 }`}
 />
 {option.label}
 </CommandItem>
 ))}
 </CommandGroup>
 </CommandList>
 </Command>
 </PopoverContent>
 </Popover>
 </div>

 {/* Custom Date Range Inputs - Show to the right */}
 {timeRange === "custom" && (
 <div className="flex gap-4 items-end">
 <div className="w-56">
 <label className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-2 block">Start Date & Time</label>
 <input
 type="datetime-local"
 value={customStartDate}
 onChange={(e) => setCustomStartDate(e.target.value)}
 className="w-full px-4 py-3 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] dark:focus:border-[var(--primary)] transition-colors"
 />
 </div>
 <div className="w-56">
 <label className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-2 block">End Date & Time</label>
 <input
 type="datetime-local"
 value={customEndDate}
 onChange={(e) => setCustomEndDate(e.target.value)}
 className="w-full px-4 py-3 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] dark:focus:border-[var(--primary)] transition-colors"
 />
 </div>
 </div>
 )}
 </div>
 </div>

 {/* Clear All Filters */}
 {(selectedLaneFilters.length > 0 || timeRange !== "today") && (
 <div className="mt-4">
 <button
 onClick={() => {
 setSelectedLaneFilters([]);
 setTimeRange("today");
 setCustomStartDate("");
 setCustomEndDate("");
 }}
 className="text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors underline"
 >
 Clear all filters
 </button>
 </div>
 )}
 </div>
 )}

 {/* Main Content */}
 <div className={`flex-1 overflow-y-auto px-8 py-6 transition-all duration-300 ${selectedLane ? 'pr-[1100px]' : ''}`}>
 <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
 {filteredLanes.map((lane) => (
 <div
 key={lane.id}
 className={`bg-[var(--surface-container-high)] text-[var(--foreground)] border ${lane.isHospital ? 'border-[var(--state-error)]/40' : 'border-[var(--border)] '} rounded-xl p-6 cursor-pointer hover:border-[var(--border)]  transition-colors relative`}
 onClick={() => handleLaneClick(lane)}
 >
 {/* Action Buttons - Top Right */}
 <div className="absolute top-6 right-6 flex items-center gap-2">
 <button
 onClick={(e) => {
 e.stopPropagation();
 handleReleaseLane(lane.id);
 }}
 className="w-8 h-8 bg-[var(--primary)] hover:opacity-90 active:scale-[0.98] text-[var(--primary-foreground)] rounded transition-colors flex items-center justify-center"
 title="Release Lane"
 >
 <Play size={14} />
 </button>
 <button
 onClick={(e) => {
 e.stopPropagation();
 handleSetHospital(lane.id);
 }}
 className={`w-8 h-8 ${
 lane.isHospital
 ? 'bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] hover:bg-[var(--surface-container-high)]'
 : 'bg-[var(--state-error)]/20 border border-[var(--state-error)]/40/50 hover:bg-[var(--state-error)]/30'
 } text-white rounded transition-colors flex items-center justify-center`}
 title={lane.isHospital ? 'Remove Hospital Lane' : 'Set as Hospital Lane'}
 >
 <Hospital size={14} />
 </button>
 </div>

 {/* Lane Header */}
 <div className="mb-4">
 <div className="flex items-center gap-2 mb-1">
 <h2 className="text-xl font-bold text-[var(--foreground)] ">{lane.name}</h2>
 {lane.isHospital && (
 <div className="inline-flex items-center gap-1 bg-[var(--state-error)]/20 border border-[var(--state-error)]/40/50 rounded px-2 py-1">
 <Hospital size={12} className="text-[var(--state-error)]" />
 <span className="text-xs text-[var(--state-error)] font-semibold">Hospital</span>
 </div>
 )}
 </div>
 <p className="text-sm text-[var(--muted-foreground)]">{lane.id}</p>
 </div>

 {/* Statistics Grid */}
 <div className="space-y-4">
 <div className="grid grid-cols-2 gap-4">
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-lg p-3">
 <p className="text-xs text-[var(--muted-foreground)] mb-1">Containers Sent</p>
 <p className="text-2xl font-bold text-[var(--foreground)] ">{lane.containersSent}</p>
 </div>
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-lg p-3">
 <p className="text-xs text-[var(--muted-foreground)] mb-1">Containers Arrived</p>
 <p className={`text-2xl font-bold ${lane.containersSent === lane.containersArrived ? 'text-[var(--state-success)]' : 'text-[var(--state-warning)]'}`}>
 {lane.containersArrived}
 </p>
 </div>
 </div>

 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-lg p-3">
 <p className="text-xs text-[var(--muted-foreground)] mb-1">Idle Time</p>
 <div className="flex items-center gap-2">
 <Clock size={16} className="text-[var(--muted-foreground)]" />
 <p className="text-lg font-semibold text-[var(--foreground)] ">{lane.idleTime}</p>
 </div>
 </div>

 {/* Lane Full Percentage */}
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-lg p-3">
 <div className="flex items-center justify-between mb-2">
 <p className="text-xs text-[var(--muted-foreground)]">Lane Full</p>
 <p className="text-sm font-semibold text-[var(--foreground)] ">{lane.fullPercentage}%</p>
 </div>
 <div className="w-full bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] rounded-full h-2">
 <div
 className={`h-2 rounded-full transition-all ${
 lane.fullPercentage >= 90 ? 'bg-[var(--state-error)]' :
 lane.fullPercentage >= 70 ? 'bg-[var(--state-warning)]' :
 'bg-[var(--state-success)]'
 }`}
 style={{ width: `${lane.fullPercentage}%` }}
 />
 </div>
 </div>

 {/* Items in Lane */}
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-lg p-3">
 <p className="text-xs text-[var(--muted-foreground)] mb-2">Items in Lane</p>
 {lane.items.length === 1 ? (
 <div className="space-y-2">
 <div className="flex items-center justify-between">
 <div className="flex-1">
 <div className="flex items-center gap-2">
 <p className="text-sm text-[var(--foreground)]">{lane.items[0].name}</p>
 {lane.items[0].inMultipleLanes && (
 <Link2 size={14} className="text-[var(--state-info)]" />
 )}
 </div>
 <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{lane.items[0].sku}</p>
 </div>
 <p className="text-sm font-semibold text-[var(--foreground)] ">{lane.items[0].quantity}</p>
 </div>
 </div>
 ) : (
 <div className="relative">
 <div
 className="bg-[var(--state-info)]/20 border border-[var(--state-info)]/40 rounded-lg p-2 text-center cursor-help"
 onMouseEnter={() => setHoveredItem(lane.id)}
 onMouseLeave={() => setHoveredItem(null)}
 >
 <p className="text-sm font-semibold text-[var(--state-info)]">{lane.items.length} Items</p>
 </div>

 {/* Hover Tooltip */}
 {hoveredItem === lane.id && (
 <div className="absolute z-10 top-full mt-2 left-0 right-0 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg p-3 ">
 <div className="space-y-3">
 {lane.items.map((item, idx) => (
 <div key={idx} className="flex items-center justify-between">
 <div className="flex-1">
 <div className="flex items-center gap-2">
 <p className="text-[var(--foreground)] text-xs">{item.name}</p>
 {item.inMultipleLanes && (
 <Link2 size={12} className="text-[var(--state-info)]" />
 )}
 </div>
 <p className="text-[var(--muted-foreground)] text-[10px] mt-0.5">{item.sku}</p>
 </div>
 <p className="text-[var(--muted-foreground)] font-semibold text-xs ml-2">{item.quantity}</p>
 </div>
 ))}
 </div>
 </div>
 )}
 </div>
 )}
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* Right Side Panel */}
 {selectedLane && (
 <div className="fixed inset-y-0 right-0 w-[1100px] bg-[var(--surface-container-high)] text-[var(--foreground)] border-l border-[var(--border)]  z-50 flex flex-col">
 {/* Panel Header */}
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-b border-[var(--border)] p-6 flex items-center justify-between">
 <div>
 <div className="flex items-center gap-3 mb-2">
 <h2 className="text-xl font-bold text-[var(--foreground)] ">{selectedLane.name} Scans</h2>
 {selectedLane.isHospital && (
 <div className="bg-[var(--state-error)]/20 border border-[var(--state-error)]/40/50 rounded-lg px-2 py-1 flex items-center gap-1">
 <Hospital size={12} className="text-[var(--state-error)]" />
 <span className="text-xs text-[var(--state-error)] font-semibold">Hospital</span>
 </div>
 )}
 </div>
 <p className="text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">{selectedLane.id}</p>
 </div>
 <button
 onClick={closeSidePanel}
 className="w-10 h-10 bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] hover:bg-[var(--surface-container-high)] rounded-lg flex items-center justify-center transition-colors"
 >
 <X size={20} className="text-[var(--foreground)]" />
 </button>
 </div>

 {/* Search */}
 <div className="p-6 border-b border-[var(--border)] ">
 <div className="relative">
 <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
 <input
 type="text"
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 placeholder="Search LPN, Item, Scanner ID, Time, Quantity..."
 className="w-full pl-10 pr-4 py-3 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg text-[var(--foreground)] placeholder-zinc-500 focus:outline-none focus:border-[var(--primary)] dark:focus:border-[var(--primary)] transition-colors"
 />
 </div>
 </div>

 {/* Scan List - Data Grid */}
 <div className="flex-1 overflow-y-auto">
 {filteredScans && filteredScans.length > 0 ? (
 <div className="min-w-full">
 {/* Table Header */}
 <div className="sticky top-0 z-40 bg-[var(--background)]/95 backdrop-blur-md text-[var(--foreground)] border-b border-[var(--border)] px-8 pt-6 pb-4">
 <div className="grid grid-cols-[140px_110px_minmax(200px,1fr)_70px_120px_120px_100px] gap-4 px-6 py-3 items-center">
 <div className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] uppercase tracking-wider font-semibold">LPN</div>
 <div className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] uppercase tracking-wider font-semibold">Scan Time</div>
 <div className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] uppercase tracking-wider font-semibold">Item</div>
 <div className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] uppercase tracking-wider font-semibold text-center">Qty</div>
 <div className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] uppercase tracking-wider font-semibold">Scanner ID</div>
 <div className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] uppercase tracking-wider font-semibold">Reason</div>
 <div className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] uppercase tracking-wider font-semibold text-center">Action</div>
 </div>
 </div>

 {/* Table Body */}
 <div>
 {filteredScans.map((scan, idx) => {
 const scanKey = `${selectedLane?.id}-${scan.lpn}`;
 const isResolved = resolvedScans.has(scanKey);

 return (
 <div
 key={idx}
 className={`grid grid-cols-[140px_110px_minmax(200px,1fr)_70px_120px_120px_100px] gap-4 px-6 py-3 border-b border-[var(--border)]  hover:bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] transition-colors items-center ${
 isResolved ? 'bg-[var(--state-success-container)]/60' : ''
 }`}
 >
 <div className={`text-sm font-mono line-clamp-2 ${scan.lpn === "No Read" ? 'text-[var(--state-error)]' : 'text-white'}`}>
 {scan.lpn}
 </div>
 <div className="text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] whitespace-pre-line leading-tight">{scan.scanTime}</div>
 <div className="text-sm text-[var(--foreground)] line-clamp-2">{scan.lpn === "No Read" ? '' : scan.item}</div>
 <div className="text-sm text-[var(--foreground)] font-semibold text-center">{scan.lpn === "No Read" ? '' : scan.itemQuantity}</div>
 <div className="text-sm text-[var(--foreground)] font-mono line-clamp-2">{scan.scannerId}</div>
 <div className="text-sm line-clamp-2">
 {isResolved ? (
 <span className="inline-flex items-center gap-1 text-[var(--state-success)]">
 <div className="w-2 h-2 bg-[var(--state-success)] rounded-full"></div>
 Resolved
 </span>
 ) : (
 <span className={`${
 scan.reason === "No Read" ? 'text-[var(--state-error)]' :
 scan.reason === "Overweight" ? 'text-[var(--state-warning)]' :
 'text-[var(--muted-foreground)]'
 }`}>
 {scan.reason}
 </span>
 )}
 </div>
 <div className="flex justify-center">
 {!isResolved && (
 <button
 onClick={() => handleResolveScan(selectedLane.id, scan.lpn)}
 className="px-2 py-1 bg-[var(--state-success-container)] border border-[var(--state-success)]/40/50 hover:bg-[var(--state-success)]/30 text-[var(--state-success)] rounded text-xs font-semibold transition-colors whitespace-nowrap"
 >
 Resolve
 </button>
 )}
 </div>
 </div>
 );
 })}
 </div>
 </div>
 ) : (
 <div className="text-center py-12">
 <Package size={48} className="text-[var(--foreground)] mx-auto mb-4" />
 <p className="text-[var(--muted-foreground)]">No scans found</p>
 </div>
 )}
 </div>
 </div>
 )}
 </div>
 );
}
