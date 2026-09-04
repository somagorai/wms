import { Activity, CheckCircle2, XCircle, Package, TrendingUp, Boxes, Scan, Radio, Box, ChevronUp, ChevronDown, Filter, X, Check, LayoutGrid, BarChart3, ChevronRight, Home, Star, Scale, Printer, Ruler, Bot, Combine, Wind, Package2, Maximize2, Minimize2, Cpu, Monitor } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { MHEVisualView } from "../components/MHEVisualView";
import { TopCard } from "../components/TopCard";
import { useBookmarks } from "../contexts/BookmarkContext";
import { useLayout } from "../contexts/LayoutContext";

// Mock DWS (Dimensioning, Weighing Scales, and Scanning) Data
const dwsData = [
 {
 id: "DWS-001",
 name: "DWS Station A",
 type: "Scanner",
 location: "Dock 1",
 status: "up",
 totalReads: 1247,
 goodReads: 1189,
 noReads: 32,
 noCodes: 18,
 multiReads: 8,
 readsPerHour: 156,
 lastRead: "2 sec ago"
 },
 {
 id: "DWS-002",
 name: "DWS Station B",
 type: "Scanner",
 location: "Dock 2",
 status: "up",
 totalReads: 892,
 goodReads: 851,
 noReads: 24,
 noCodes: 12,
 multiReads: 5,
 readsPerHour: 112,
 lastRead: "5 sec ago"
 },
 {
 id: "DWS-003",
 name: "Scale Unit 1",
 type: "Scale",
 location: "Shipping",
 status: "up",
 totalReads: 534,
 goodReads: 528,
 noReads: 4,
 noCodes: 2,
 multiReads: 0,
 readsPerHour: 67,
 lastRead: "8 sec ago"
 },
 {
 id: "DWS-004",
 name: "Dimensioner Alpha",
 type: "Dimensioner",
 location: "Quality Check",
 status: "up",
 totalReads: 423,
 goodReads: 417,
 noReads: 4,
 noCodes: 2,
 multiReads: 0,
 readsPerHour: 53,
 lastRead: "3 sec ago"
 },
 {
 id: "DWS-005",
 name: "Label Printer 1",
 type: "Printer",
 location: "Pack Station A",
 status: "up",
 totalReads: 789,
 goodReads: 785,
 noReads: 2,
 noCodes: 2,
 multiReads: 0,
 readsPerHour: 99,
 lastRead: "1 sec ago"
 },
 {
 id: "DWS-006",
 name: "Outbound Scanner",
 type: "Scanner",
 location: "Shipping",
 status: "down",
 totalReads: 0,
 goodReads: 0,
 noReads: 0,
 noCodes: 0,
 multiReads: 0,
 readsPerHour: 0,
 lastRead: "N/A"
 },
];

// Mock Sub Systems Data (formerly Conveyors)
const subSystemsData = [
 {
 id: "SUB-001",
 name: "Inbound System",
 location: "Zone 1",
 status: "up",
 availability: 98.5,
 performance: 94.2,
 quality: 99.1,
 oee: 91.8
 },
 {
 id: "SUB-002",
 name: "Sortation System",
 location: "Zone 2",
 status: "up",
 availability: 96.3,
 performance: 91.7,
 quality: 98.4,
 oee: 86.9
 },
 {
 id: "SUB-003",
 name: "Pack System A",
 location: "Zone 3",
 status: "up",
 availability: 99.2,
 performance: 95.8,
 quality: 99.5,
 oee: 94.6
 },
 {
 id: "SUB-004",
 name: "Pack System B",
 location: "Zone 4",
 status: "down",
 availability: 45.2,
 performance: 0,
 quality: 0,
 oee: 0
 },
 {
 id: "SUB-005",
 name: "Shipping System",
 location: "Zone 5",
 status: "up",
 availability: 97.8,
 performance: 93.4,
 quality: 99.2,
 oee: 90.6
 },
];

// Mock Sorters Data (with lane routing)
const sortersData = [
 {
 id: "SORT-001",
 name: "Main Sorter A",
 location: "Sort Zone 1",
 status: "up",
 totalSorts: 2458,
 sortsPerHour: 307,
 laneRouting: [
 { lane: "Lane 1", count: 623 },
 { lane: "Lane 2", count: 587 },
 { lane: "Lane 3", count: 491 },
 { lane: "Lane 4", count: 389 },
 { lane: "Lane 5", count: 368 },
 ]
 },
 {
 id: "SORT-002",
 name: "Cross-Belt Sorter",
 location: "Sort Zone 2",
 status: "up",
 totalSorts: 1892,
 sortsPerHour: 236,
 laneRouting: [
 { lane: "Lane 6", count: 512 },
 { lane: "Lane 7", count: 489 },
 { lane: "Lane 8", count: 398 },
 { lane: "Lane 9", count: 298 },
 { lane: "Lane 10", count: 195 },
 ]
 },
];

// Mock Robot Data (including palletizers, descramblers, shuttles, stretch wrappers)
const robotsData = [
 {
 id: "ROB-001",
 name: "Palletizer Unit 1",
 type: "Palletizer",
 location: "Pallet Zone A",
 status: "up",
 availability: 99.2,
 performance: 96.5,
 quality: 99.8,
 oee: 95.6,
 currentWorkList: "WL-2847",
 workType: "Putaway"
 },
 {
 id: "ROB-002",
 name: "Palletizer Unit 2",
 type: "Palletizer",
 location: "Pallet Zone A",
 status: "up",
 availability: 98.7,
 performance: 95.2,
 quality: 99.5,
 oee: 93.5,
 currentWorkList: "WL-2851",
 workType: "Replenishment"
 },
 {
 id: "ROB-003",
 name: "Palletizer Unit 3",
 type: "Palletizer",
 location: "Pallet Zone B",
 status: "down",
 availability: 0,
 performance: 0,
 quality: 0,
 oee: 0,
 currentWorkList: null,
 workType: null
 },
 {
 id: "ROB-004",
 name: "AMR-Alpha",
 type: "Pick Robot",
 location: "Zone A",
 status: "up",
 availability: 96.8,
 performance: 92.3,
 quality: 99.2,
 oee: 88.6,
 currentWorkList: "WL-2849",
 workType: "Pick"
 },
 {
 id: "ROB-005",
 name: "AMR-Beta",
 type: "Pick Robot",
 location: "Zone A",
 status: "up",
 availability: 97.2,
 performance: 93.8,
 quality: 99.4,
 oee: 90.6,
 currentWorkList: "WL-2852",
 workType: "Pick"
 },
 {
 id: "ROB-006",
 name: "AMR-Gamma",
 type: "Transport Robot",
 location: "Zone B",
 status: "up",
 availability: 98.5,
 performance: 94.7,
 quality: 99.6,
 oee: 92.9,
 currentWorkList: "WL-2850",
 workType: "Replenishment"
 },
 {
 id: "ROB-007",
 name: "Descrambler Unit 1",
 type: "Descrambler",
 location: "Inbound",
 status: "up",
 availability: 97.3,
 performance: 91.2,
 quality: 98.9,
 oee: 87.8,
 currentWorkList: "WL-2845",
 workType: "Sorting"
 },
 {
 id: "ROB-008",
 name: "Shuttle System A",
 type: "Shuttle",
 location: "Storage Zone",
 status: "up",
 availability: 99.1,
 performance: 96.8,
 quality: 99.7,
 oee: 95.7,
 currentWorkList: "WL-2853",
 workType: "Storage"
 },
 {
 id: "ROB-009",
 name: "Shuttle System B",
 type: "Shuttle",
 location: "Storage Zone",
 status: "up",
 availability: 98.4,
 performance: 95.3,
 quality: 99.4,
 oee: 93.2,
 currentWorkList: "WL-2854",
 workType: "Retrieval"
 },
 {
 id: "ROB-010",
 name: "Stretch Wrapper 1",
 type: "Stretch Wrapper",
 location: "Shipping Prep",
 status: "up",
 availability: 96.7,
 performance: 93.1,
 quality: 99.8,
 oee: 89.9,
 currentWorkList: "WL-2846",
 workType: "Wrapping"
 },
 {
 id: "ROB-011",
 name: "Stretch Wrapper 2",
 type: "Stretch Wrapper",
 location: "Shipping Prep",
 status: "down",
 availability: 0,
 performance: 0,
 quality: 0,
 oee: 0,
 currentWorkList: null,
 workType: null
 },
 {
 id: "ROB-012",
 name: "ARM-001",
 type: "Robotic Arm",
 location: "Assembly",
 status: "up",
 availability: 98.9,
 performance: 97.2,
 quality: 99.9,
 oee: 96.1,
 currentWorkList: "WL-2848",
 workType: "Inspection"
 },
];

export default function MHEDashboard() {
 const { toggleBookmark, isBookmarked } = useBookmarks();
 const { isFullscreen, setIsFullscreen } = useLayout();
 const [viewMode, setViewMode] = useState<'data' | 'visual' | 'summary'>('data');
 const [selectedSections, setSelectedSections] = useState<Set<string>>(new Set(["DWS", "SubSystems", "Sorters", "Robots"]));
 const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["DWS", "SubSystems", "Sorters", "Robots"]));
 const [showFilterPanel, setShowFilterPanel] = useState(false);
 const [sectionSearch, setSectionSearch] = useState("");
 const [activeDropdown, setActiveDropdown] = useState<'section' | null>(null);
 const [showFilterTooltip, setShowFilterTooltip] = useState(false);
 const [statusFilter, setStatusFilter] = useState<'all' | 'up' | 'down'>('all');
 const [summaryTileFilter, setSummaryTileFilter] = useState<'all' | 'up' | 'down'>('all');
 const [robotTypeFilter, setRobotTypeFilter] = useState<'all' | 'Palletizer' | 'Pick Robot' | 'Transport Robot' | 'Descrambler' | 'Shuttle' | 'Stretch Wrapper' | 'Robotic Arm'>('all');

 // Handle bookmark tile
 const handleBookmarkTile = (e: React.MouseEvent, id: string, title: string, subType: string, status: string, iconName: string, data: any) => {
 e.stopPropagation();
 toggleBookmark({
 id,
 title,
 type: "mhe",
 subType,
 icon: iconName,
 data: {
 ...data,
 status
 }
 });
 };

 const allSections = ["DWS", "SubSystems", "Sorters", "Robots"];

 // Click-away handler for dropdown
 useEffect(() => {
 const handleClickOutside = (event: MouseEvent) => {
 const target = event.target as HTMLElement;
 if (!target.closest('[data-dropdown]')) {
 setActiveDropdown(null);
 }
 };

 document.addEventListener('mousedown', handleClickOutside);
 return () => document.removeEventListener('mousedown', handleClickOutside);
 }, []);

 // Filter functions
 const filteredDWSData = statusFilter === 'all' ? dwsData : dwsData.filter(d => d.status === statusFilter);
 const filteredSubSystemsData = statusFilter === 'all' ? subSystemsData : subSystemsData.filter(s => s.status === statusFilter);
 const filteredSortersData = statusFilter === 'all' ? sortersData : sortersData.filter(s => s.status === statusFilter);

 const filteredRobotsData = robotsData.filter(r => {
 const statusMatch = statusFilter === 'all' || r.status === statusFilter;
 const typeMatch = robotTypeFilter === 'all' || r.type === robotTypeFilter;
 return statusMatch && typeMatch;
 });

 const dwsUp = dwsData.filter(d => d.status === "up").length;
 const dwsDown = dwsData.filter(d => d.status === "down").length;
 const subSystemsUp = subSystemsData.filter(s => s.status === "up").length;
 const subSystemsDown = subSystemsData.filter(s => s.status === "down").length;
 const sortersUp = sortersData.filter(s => s.status === "up").length;
 const sortersDown = sortersData.filter(s => s.status === "down").length;
 const robotsUp = robotsData.filter(r => r.status === "up").length;
 const robotsDown = robotsData.filter(r => r.status === "down").length;

 const totalDevices = dwsData.length + subSystemsData.length + sortersData.length + robotsData.length;
 const totalUp = dwsUp + subSystemsUp + sortersUp + robotsUp;
 const totalDown = dwsDown + subSystemsDown + sortersDown + robotsDown;

 const toggleSectionSelection = (section: string) => {
 const newSelected = new Set(selectedSections);
 if (newSelected.has(section)) {
 newSelected.delete(section);
 } else {
 newSelected.add(section);
 }
 setSelectedSections(newSelected);
 };

 const toggleSectionExpansion = (section: string) => {
 const newExpanded = new Set(expandedSections);
 if (newExpanded.has(section)) {
 newExpanded.delete(section);
 } else {
 newExpanded.add(section);
 }
 setExpandedSections(newExpanded);
 };

 const getStatusColor = (status: string) => {
 return status === 'up' ? 'text-[var(--state-on-success-container)] dark:text-[var(--state-success)]' : 'text-[var(--state-error)] dark:text-[var(--state-error)]';
 };

 const getStatusBgColor = (status: string) => {
 return status === 'up'
 ? 'border-[var(--state-success)]/40 dark:border-[var(--state-success)]'
 : 'border-[var(--state-error)]/40 dark:border-[var(--state-error)]';
 };

 const getOEEColor = (oee: number) => {
 if (oee >= 90) return 'text-[var(--state-on-success-container)] dark:text-[var(--state-success)]';
 if (oee >= 75) return 'text-[var(--state-on-warning-container)] dark:text-[var(--state-warning)]';
 return 'text-[var(--state-error)] dark:text-[var(--state-error)]';
 };

 const getOEEBgColor = (oee: number) => {
 if (oee >= 90) return 'bg-[var(--state-success-container)] dark:bg-[var(--state-success-container)]/20';
 if (oee >= 75) return 'bg-[var(--state-warning-container)] dark:bg-[var(--state-warning-container)]/20';
 return 'bg-[var(--state-error-container)] dark:bg-[var(--state-error-container)]/20';
 };

 const filteredSectionOptions = allSections.filter(section =>
 section.toLowerCase().includes(sectionSearch.toLowerCase())
 );

 return (
 <div className="flex flex-col min-h-screen">
 {/* Sticky Header */}
 {!isFullscreen && (
 <div className="sticky top-0 z-40 bg-[var(--background)]/95 backdrop-blur-md text-[var(--foreground)] border-b border-[var(--border)] px-8 pt-6 pb-4">
 <div className="flex items-center justify-between gap-4">
 <nav className="flex items-center gap-2 text-sm">
 <Link to="/app/home" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] dark:hover:text-[var(--primary)] transition-colors flex items-center gap-1">
 <Home size={14} />Home
 </Link>
 <ChevronRight size={14} className="text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]" />
 <Link to="/app/navigation?section=dashboards" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] dark:hover:text-[var(--primary)] transition-colors">
 Business Insights
 </Link>
 <ChevronRight size={14} className="text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]" />
 <span className="text-[var(--foreground)]  font-semibold text-lg flex items-center gap-2">
 <Cpu size={20} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 MHE Dashboard
 </span>
 </nav>
 <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-[var(--surface-container)] dark:bg-[var(--surface-container-low)] rounded-xl p-1 border border-transparent">
              <button
                onClick={() => setViewMode('data')}
                className={`px-3.5 py-1.5 rounded-lg text-sm transition-all duration-150 flex items-center gap-1.5 font-medium cursor-pointer ${
                  viewMode === 'data'
                    ? 'bg-[var(--primary)] text-[var(--primary-foreground)] shadow-xs'
                    : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                }`}
              >
                <BarChart3 size={15} />
                Data View
              </button>
              <button
                onClick={() => setViewMode('visual')}
                className={`px-3.5 py-1.5 rounded-lg text-sm transition-all duration-150 flex items-center gap-1.5 font-medium cursor-pointer ${
                  viewMode === 'visual'
                    ? 'bg-[var(--primary)] text-[var(--primary-foreground)] shadow-xs'
                    : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                }`}
              >
                <LayoutGrid size={15} />
                Visual View
              </button>
              <button
                onClick={() => setViewMode('summary')}
                className={`px-3.5 py-1.5 rounded-lg text-sm transition-all duration-150 flex items-center gap-1.5 font-medium cursor-pointer ${
                  viewMode === 'summary'
                    ? 'bg-[var(--primary)] text-[var(--primary-foreground)] shadow-xs'
                    : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                }`}
              >
                <Monitor size={15} />
                Summary View
              </button>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <button
                onClick={() => setShowFilterPanel(!showFilterPanel)}
                onMouseEnter={() => setShowFilterTooltip(true)}
                onMouseLeave={() => setShowFilterTooltip(false)}
                className={`px-4 py-2 rounded-xl transition-all duration-150 flex items-center gap-2 font-medium text-sm cursor-pointer shadow-xs ${
                  showFilterPanel || statusFilter !== 'all' || robotTypeFilter !== 'all'
                    ? 'bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90'
                    : 'bg-[var(--surface-container-high)] text-[var(--foreground)] hover:bg-[var(--surface-container-highest)] border border-transparent'
                }`}
              >
                <Filter size={16} />
                Filter
                {(statusFilter !== 'all' || robotTypeFilter !== 'all') && (
                  <span className="w-2 h-2 bg-white rounded-full" />
                )}
              </button>

 {showFilterTooltip && !showFilterPanel && (
 <div className="absolute right-0 top-full mt-2 px-3 py-2 bg-[var(--surface-container-high)] text-[var(--foreground)] dark:bg-[var(--card)] text-[var(--foreground)] text-xs rounded-lg whitespace-nowrap z-10">
 Filter by status or robot type
 </div>
 )}

 {showFilterPanel && (
 <div className="absolute right-0 top-full mt-2 w-64 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg z-20 p-4">
 <div className="flex items-center justify-between mb-4">
 <h3 className="font-semibold text-[var(--foreground)] ">Filters</h3>
 <button
 onClick={() => setShowFilterPanel(false)}
 className="text-[var(--muted-foreground)] hover:text-[var(--muted-foreground)] dark:hover:text-[var(--foreground)]"
 >
 <X size={16} />
 </button>
 </div>

 <div className="space-y-4">
 {/* Status Filter */}
 <div>
 <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
 Status
 </label>
 <div className="space-y-2">
 {(['all', 'up', 'down'] as const).map((status) => (
 <label key={status} className="flex items-center gap-2 cursor-pointer">
 <input
 type="radio"
 name="status"
 value={status}
 checked={statusFilter === status}
 onChange={() => setStatusFilter(status)}
 className="w-4 h-4 text-[var(--primary)] focus:)]"
 />
 <span className="text-sm text-[var(--foreground)] capitalize">
 {status === 'all' ? 'All Devices' : status === 'up' ? 'Online Only' : 'Offline Only'}
 </span>
 </label>
 ))}
 </div>
 </div>

 {/* Robot Type Filter */}
 <div>
 <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
 Robot Type
 </label>
 <select
 value={robotTypeFilter}
 onChange={(e) => setRobotTypeFilter(e.target.value as any)}
 className="w-full px-3 py-2 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg text-sm text-[var(--foreground)]  focus:outline-none focus: focus:)]"
 >
 <option value="all">All Types</option>
 <option value="Palletizer">Palletizers</option>
 <option value="Pick Robot">Pick Robots</option>
 <option value="Transport Robot">Transport Robots</option>
 <option value="Descrambler">Descramblers</option>
 <option value="Shuttle">Shuttles</option>
 <option value="Stretch Wrapper">Stretch Wrappers</option>
 <option value="Robotic Arm">Robotic Arms</option>
 </select>
 </div>

 {/* Clear Filters */}
 {(statusFilter !== 'all' || robotTypeFilter !== 'all') && (
 <button
 onClick={() => {
 setStatusFilter('all');
 setRobotTypeFilter('all');
 }}
 className="w-full px-3 py-2 bg-[var(--surface-container-low)] dark:bg-[var(--card)] hover:bg-[var(--surface-container-high)] text-[var(--foreground)] rounded-lg text-sm font-medium transition-colors"
 >
 Clear All Filters
 </button>
 )}
 </div>
 </div>
 )}
 </div>

 {/* Fullscreen Toggle */}
 <button
 onClick={() => setIsFullscreen(!isFullscreen)}
 className="px-4 py-2 bg-[var(--surface-container-low)] dark:bg-[var(--card)] hover:bg-[var(--surface-container-high)] rounded-lg text-sm font-medium text-[var(--foreground)] transition-colors flex items-center gap-2"
 title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
 >
 {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
 {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
 </button>

 {/* Section Filter */}
 <div className="relative" data-dropdown>
 <button
 onClick={() => setActiveDropdown(activeDropdown === 'section' ? null : 'section')}
 className="px-4 py-2 bg-[var(--surface-container-low)] dark:bg-[var(--card)] hover:bg-[var(--surface-container-high)] rounded-lg text-sm font-medium text-[var(--foreground)] transition-colors flex items-center gap-2"
 >
 Sections
 <ChevronDown size={16} />
 </button>

 {activeDropdown === 'section' && (
 <div className="absolute right-0 top-full mt-2 w-64 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg z-20">
 <div className="p-3 border-b border-[var(--border)] ">
 <input
 type="text"
 placeholder="Search sections..."
 value={sectionSearch}
 onChange={(e) => setSectionSearch(e.target.value)}
 className="w-full px-3 py-2 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg text-sm text-[var(--foreground)]  placeholder-zinc-500 focus:outline-none focus: focus:)]"
 />
 </div>
 <div className="max-h-64 overflow-y-auto p-2">
 {filteredSectionOptions.map((section) => (
 <label
 key={section}
 className="flex items-center gap-2 px-3 py-2 hover:bg-[var(--surface-container-lowest)] hover:bg-[var(--surface-container-high)] rounded-lg cursor-pointer"
 >
 <input
 type="checkbox"
 checked={selectedSections.has(section)}
 onChange={() => toggleSectionSelection(section)}
 className="w-4 h-4 text-[var(--primary)] rounded focus:)]"
 />
 <span className="text-sm text-[var(--foreground)]">{section}</span>
 </label>
 ))}
 </div>
 <div className="p-2 border-t border-[var(--border)]  flex gap-2">
 <button
 onClick={() => setSelectedSections(new Set(allSections))}
 className="flex-1 px-3 py-2 text-xs font-medium text-[var(--primary)] dark:text-[var(--primary)] hover:bg-[var(--surface-container-lowest)] hover:bg-[var(--surface-container-high)] rounded-lg transition-colors"
 >
 Select All
 </button>
 <button
 onClick={() => setSelectedSections(new Set())}
 className="flex-1 px-3 py-2 text-xs font-medium text-[var(--muted-foreground)] hover:bg-[var(--surface-container-lowest)] hover:bg-[var(--surface-container-high)] rounded-lg transition-colors"
 >
 Clear All
 </button>
 </div>
 </div>
 )}
 </div>
 </div>
 </div>
 </div>
 )}

 <div className={`flex-1 ${viewMode === 'summary' ? 'overflow-hidden p-3' : 'overflow-y-auto p-8'}`}>
 {viewMode === 'summary' ? (
 /* ── SUMMARY VIEW ── wall-board display, no scrolling ── */
 (() => {
 const sfDws = dwsData.filter((d: typeof dwsData[0]) => statusFilter === 'all' || d.status === statusFilter);
 const sfSub = subSystemsData.filter((d: typeof subSystemsData[0]) => statusFilter === 'all' || d.status === statusFilter);
 const sfSor = sortersData.filter((d: typeof sortersData[0]) => statusFilter === 'all' || d.status === statusFilter);
 const sfRob = robotsData.filter((d: typeof robotsData[0]) => (statusFilter === 'all' || d.status === statusFilter) && (robotTypeFilter === 'all' || d.type === robotTypeFilter));

 const cardBase = (status: string) =>
 `rounded-xl border p-3 ${status === 'up'
 ? 'border-[var(--state-success)]/40 dark:border-green-700/60 bg-[var(--state-success-container)] dark:bg-[var(--state-success-container)]/15'
 : 'border-[var(--state-error)]/40 dark:border-[var(--state-error)]/60 bg-[var(--state-error-container)] dark:bg-[var(--state-error-container)]/15'}`;

 const dot = (status: string) =>
 <div className={`w-3 h-3 rounded-full flex-shrink-0 ${status === 'up' ? 'bg-[var(--state-success)]' : 'bg-[var(--state-error)]'}`} />;

 const sectionHeader = (icon: React.ReactNode, label: string, up: number, down: number) => (
 <div className="flex items-center gap-2 mb-2 flex-shrink-0 border-b border-[var(--border)]  pb-1.5">
 {icon}
 <span className="text-sm font-bold text-[var(--foreground)]  uppercase tracking-wide">{label}</span>
 <span className="ml-auto text-sm font-medium">
 <span className="text-[var(--state-on-success-container)] dark:text-[var(--state-success)]">{up} ↑</span>
 <span className="text-[var(--muted-foreground)] mx-1">/</span>
 <span className="text-[var(--state-error)] dark:text-[var(--state-error)]">{down} ↓</span>
 </span>
 </div>
 );

 // Height: 100vh minus sticky header (~80px), minus p-3 padding (~24px), minus KPI row (~72px), minus gap (~12px)
 const mainH = 'calc(100vh - 200px)';

 return (
 <div className="flex flex-col gap-3">
 {/* ── Compact KPI filter tiles ── */}
 <div className="grid grid-cols-4 gap-3 flex-shrink-0">
 <TopCard
   type="clickable"
   layout="compact"
   status="neutral"
   label="All Equipment"
   value={totalDevices}
   subText="devices"
   icon={<Activity size={18} />}
   isLive={true}
   isSelected={statusFilter === "all"}
   onClick={() => setStatusFilter(statusFilter === "all" ? "all" : "all")}
 />
 <TopCard
   type="clickable"
   layout="compact"
   status="success"
   label="Operational"
   value={totalUp}
   subText="online"
   icon={<CheckCircle2 size={18} />}
   isSelected={statusFilter === "up"}
   onClick={() => setStatusFilter(statusFilter === "up" ? "all" : "up")}
 />
 <TopCard
   type="clickable"
   layout="compact"
   status="error"
   label="Down"
   value={totalDown}
   subText="offline"
   icon={<XCircle size={18} />}
   isSelected={statusFilter === "down"}
   onClick={() => setStatusFilter(statusFilter === "down" ? "all" : "down")}
 />
 <TopCard
   type="info"
   layout="compact"
   status="neutral"
   label="Uptime"
   value={`${Math.round((totalUp / totalDevices) * 100)}%`}
   subText="avg"
   icon={<TrendingUp size={18} />}
 />
 </div>

 {/* ── Main grid ── */}
 <div className="grid grid-cols-12 gap-3" style={{ height: mainH }}>

 {/* LEFT: Robots — 4 col × 3 row grid */}
 <div className="col-span-7 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-xl p-3 flex flex-col">
 {sectionHeader(<Bot size={16} className="text-[var(--primary)] dark:text-[var(--primary)]" />, 'Robots', sfRob.filter(r=>r.status==='up').length, sfRob.filter(r=>r.status==='down').length)}
 <div className="grid grid-cols-4 gap-2 flex-1" style={{ gridTemplateRows: 'repeat(3, 1fr)' }}>
 {sfRob.map(r => (
 <div key={r.id} className={cardBase(r.status)}>
 <div className="flex items-center gap-2 mb-1">
 {dot(r.status)}
 <span className="text-sm font-bold text-[var(--foreground)]  truncate leading-tight">{r.name}</span>
 </div>
 <div className="text-xs text-[var(--muted-foreground)] mb-2 truncate">{r.type} · {r.location}</div>
 <div className={`text-2xl font-extrabold leading-none mb-1 ${getOEEColor(r.oee)}`}>{r.oee}%</div>
 <div className="grid grid-cols-3 gap-0.5 text-xs text-[var(--muted-foreground)]">
 <div><span className="font-semibold text-[var(--foreground)]">{r.availability}%</span><br/>Avail</div>
 <div><span className="font-semibold text-[var(--foreground)]">{r.performance}%</span><br/>Perf</div>
 <div><span className="font-semibold text-[var(--foreground)]">{r.quality}%</span><br/>Qual</div>
 </div>
 </div>
 ))}
 {sfRob.length === 0 && (
 <div className="col-span-4 row-span-3 flex items-center justify-center text-base text-[var(--muted-foreground)]">No robots match the current filter</div>
 )}
 </div>
 </div>

 {/* RIGHT: 3 stacked sections */}
 <div className="col-span-5 flex flex-col gap-3">

 {/* DWS — 3-col grid */}
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-xl p-3 flex flex-col flex-[2]">
 {sectionHeader(<Scan size={16} className="text-[var(--primary)] dark:text-[var(--primary)]" />, 'DWS — Scanners, Scales & Dimensioners', sfDws.filter(d=>d.status==='up').length, sfDws.filter(d=>d.status==='down').length)}
 <div className="grid grid-cols-3 gap-2 flex-1" style={{ gridTemplateRows: 'repeat(2, 1fr)' }}>
 {sfDws.map(d => (
 <div key={d.id} className={cardBase(d.status)}>
 <div className="flex items-center gap-2 mb-1">
 {dot(d.status)}
 <span className="text-sm font-bold text-[var(--foreground)]  truncate">{d.name}</span>
 </div>
 <div className="text-xs text-[var(--muted-foreground)] mb-2 truncate">{d.type} · {d.location}</div>
 <div className="flex items-baseline gap-2">
 <span className="text-xl font-extrabold text-[var(--primary)] dark:text-[var(--primary)]">{d.readsPerHour}</span>
 <span className="text-xs text-[var(--muted-foreground)]">/hr</span>
 <span className={`ml-auto text-sm font-bold ${d.status === 'up' ? 'text-[var(--state-on-success-container)] dark:text-[var(--state-success)]' : 'text-[var(--state-error)] dark:text-[var(--state-error)]'}`}>
 {Math.round((d.goodReads / Math.max(d.totalReads, 1)) * 100)}% qual
 </span>
 </div>
 </div>
 ))}
 {sfDws.length === 0 && <div className="col-span-3 row-span-2 flex items-center justify-center text-base text-[var(--muted-foreground)]">No items match filter</div>}
 </div>
 </div>

 {/* SubSystems — 3-col grid */}
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-xl p-3 flex flex-col flex-[2]">
 {sectionHeader(<Combine size={16} className="text-[var(--primary)] dark:text-[var(--primary)]" />, 'SubSystems', sfSub.filter(s=>s.status==='up').length, sfSub.filter(s=>s.status==='down').length)}
 <div className="grid grid-cols-3 gap-2 flex-1" style={{ gridTemplateRows: 'repeat(2, 1fr)' }}>
 {sfSub.map(s => (
 <div key={s.id} className={cardBase(s.status)}>
 <div className="flex items-center gap-2 mb-1">
 {dot(s.status)}
 <span className="text-sm font-bold text-[var(--foreground)]  truncate">{s.name}</span>
 </div>
 <div className="text-xs text-[var(--muted-foreground)] mb-2 truncate">{s.location}</div>
 <div className={`text-2xl font-extrabold leading-none mb-1 ${getOEEColor(s.oee)}`}>{s.oee}%</div>
 <div className="flex gap-2 text-xs text-[var(--muted-foreground)]">
 <span><b className="text-[var(--foreground)]">{s.availability}%</b> A</span>
 <span><b className="text-[var(--foreground)]">{s.performance}%</b> P</span>
 <span><b className="text-[var(--foreground)]">{s.quality}%</b> Q</span>
 </div>
 </div>
 ))}
 {sfSub.length === 0 && <div className="col-span-3 row-span-2 flex items-center justify-center text-base text-[var(--muted-foreground)]">No items match filter</div>}
 </div>
 </div>

 {/* Sorters — 2-col grid */}
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-xl p-3 flex flex-col flex-1">
 {sectionHeader(<Wind size={16} className="text-[var(--primary)] dark:text-[var(--primary)]" />, 'Sorters', sfSor.filter(s=>s.status==='up').length, sfSor.filter(s=>s.status==='down').length)}
 <div className="grid grid-cols-2 gap-2 flex-1">
 {sfSor.map(s => (
 <div key={s.id} className={cardBase(s.status)}>
 <div className="flex items-center gap-2 mb-1">
 {dot(s.status)}
 <span className="text-sm font-bold text-[var(--foreground)]  truncate">{s.name}</span>
 </div>
 <div className="text-xs text-[var(--muted-foreground)] mb-2">{s.location}</div>
 <div className="flex items-baseline gap-2 mb-1">
 <span className="text-2xl font-extrabold text-[var(--primary)] dark:text-[var(--primary)]">{s.sortsPerHour}</span>
 <span className="text-xs text-[var(--muted-foreground)]">/hr · {s.totalSorts.toLocaleString()} total</span>
 </div>
 <div className="flex flex-wrap gap-1.5">
 {s.laneRouting.slice(0, 4).map(l => (
 <span key={l.lane} className="text-xs bg-[var(--surface-container-low)] dark:bg-[var(--card)] px-2 py-0.5 rounded font-medium text-[var(--foreground)]">{l.lane}: {l.count}</span>
 ))}
 </div>
 </div>
 ))}
 {sfSor.length === 0 && <div className="col-span-2 flex items-center justify-center text-base text-[var(--muted-foreground)]">No items match filter</div>}
 </div>
 </div>
 </div>
 </div>
 </div>
 );
 })()
 ) : viewMode === 'visual' ? (
 <MHEVisualView
 scannersData={dwsData.filter(d => d.type === 'Scanner').map((d, idx) => ({
 id: `SCAN-${String(idx + 1).padStart(3, '0')}`,
 name: d.name,
 location: d.location,
 status: d.status,
 totalScans: d.totalReads,
 scansPerHour: d.readsPerHour,
 lastScan: d.lastRead,
 laneRouting: []
 }))}
 conveyorsData={subSystemsData.map((s, idx) => ({
 id: `CONV-${String(idx + 1).padStart(3, '0')}`,
 name: s.name,
 location: s.location,
 status: s.status
 }))}
 palletizersData={robotsData.filter(r => r.type === 'Palletizer').map((p, idx) => ({
 id: `PAL-${String(idx + 1).padStart(3, '0')}`,
 name: p.name,
 location: p.location,
 status: p.status,
 currentWorkList: p.currentWorkList,
 workType: p.workType,
 itemsProcessed: Math.floor((p.oee / 100) * 400),
 itemsRemaining: Math.floor((1 - p.oee / 100) * 400),
 currentSpeed: p.status === 'up' ? `${Math.floor(18 + Math.random() * 5)} items/min` : '0 items/min',
 uptime: `${p.availability}%`
 }))}
 robotsData={robotsData.filter(r => r.type !== 'Palletizer').map((r, idx) => ({
 id: `BOT-${String(idx + 1).padStart(3, '0')}`,
 name: r.name,
 type: r.type,
 location: r.location,
 status: r.status,
 currentWorkList: r.currentWorkList,
 workType: r.workType,
 itemsProcessed: Math.floor((r.oee / 100) * 400),
 itemsRemaining: Math.floor((1 - r.oee / 100) * 400),
 batteryLevel: r.status === 'up' ? Math.floor(60 + Math.random() * 40) : 15,
 currentTask: r.status === 'up' ? `Processing ${r.workType}` : 'Offline'
 }))}
 />
 ) : (
 <div className="space-y-8">
 {/* Summary Cards — also act as filters */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
 <TopCard
   type="clickable"
   status="neutral"
   label="All Equipment"
   value={totalDevices}
   subText="devices"
   icon={<Activity size={20} />}
   isLive={true}
   isSelected={statusFilter === "all"}
   onClick={() => setStatusFilter(statusFilter === "all" ? "all" : "all")}
 />
 <TopCard
   type="clickable"
   status="success"
   label="Operational"
   value={totalUp}
   subText="online"
   icon={<CheckCircle2 size={20} />}
   isSelected={statusFilter === "up"}
   onClick={() => setStatusFilter(statusFilter === "up" ? "all" : "up")}
 />
 <TopCard
   type="clickable"
   status="error"
   label="Down"
   value={totalDown}
   subText="offline"
   icon={<XCircle size={20} />}
   isSelected={statusFilter === "down"}
   onClick={() => setStatusFilter(statusFilter === "down" ? "all" : "down")}
 />
 <TopCard
   type="info"
   status="neutral"
   label="Uptime"
   value={`${Math.round((totalUp / totalDevices) * 100)}%`}
   icon={<TrendingUp size={20} />}
 />
 </div>

 {/* SECTION 1: DWS (Dimensioning, Weighing Scales, and Scanning) */}
 {selectedSections.has("DWS") && (
 <div className="mb-12">
 <div
 className="flex items-center gap-2 mb-6 cursor-pointer"
 onClick={() => toggleSectionExpansion("DWS")}
 >
 <Scan className="text-[var(--primary)] dark:text-[var(--primary)]" size={20} />
 <h2 className="text-2xl font-bold text-[var(--foreground)] ">
 Dimensioning, Weighing Scales, and Scanning (DWS)
 </h2>
 <span className="text-sm text-[var(--muted-foreground)]">
 ({dwsUp} up, {dwsDown} down)
 </span>
 <button className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] dark:hover:text-[var(--foreground)] transition-colors ml-2">
 {expandedSections.has("DWS") ? (
 <ChevronUp size={20} />
 ) : (
 <ChevronDown size={20} />
 )}
 </button>
 </div>

 {expandedSections.has("DWS") && (
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 {filteredDWSData.map((device) => {
 const tileId = `mhe-dws-${device.id}`;
 const goodReadPct = device.totalReads > 0 ? ((device.goodReads / device.totalReads) * 100).toFixed(1) : 0;
 const noReadPct = device.totalReads > 0 ? ((device.noReads / device.totalReads) * 100).toFixed(1) : 0;
 const noCodePct = device.totalReads > 0 ? ((device.noCodes / device.totalReads) * 100).toFixed(1) : 0;
 const multiReadPct = device.totalReads > 0 ? ((device.multiReads / device.totalReads) * 100).toFixed(1) : 0;

 return (
 <div
 key={device.id}
 className={`bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border rounded-lg p-6 ${getStatusBgColor(device.status)} relative`}
 >
 <div className="flex items-start justify-between mb-4">
 <div>
 <div className="flex items-center gap-2 mb-1">
 {device.type === 'Scanner' && <Scan size={20} className={getStatusColor(device.status)} />}
 {device.type === 'Scale' && <Scale size={20} className={getStatusColor(device.status)} />}
 {device.type === 'Dimensioner' && <Ruler size={20} className={getStatusColor(device.status)} />}
 {device.type === 'Printer' && <Printer size={20} className={getStatusColor(device.status)} />}
 <h3 className="font-bold text-lg text-[var(--foreground)] ">{device.name}</h3>
 <span className="text-xs px-2 py-1 bg-[var(--surface-container-low)] dark:bg-[var(--card)] rounded-full text-[var(--muted-foreground)]">
 {device.type}
 </span>
 </div>
 <p className="text-sm text-[var(--muted-foreground)]">{device.id} • {device.location}</p>
 </div>
 <div className="flex items-center gap-2">
 <div className={`w-2 h-2 rounded-full ${
 device.status === 'up' ? 'bg-[var(--state-success)]' : 'bg-[var(--state-error)]'
 } animate-pulse`} />
 <span className={`${getStatusColor(device.status)} text-sm font-medium uppercase`}>
 {device.status}
 </span>
 <button
 onClick={(e) => handleBookmarkTile(e, tileId, device.name, "dws", device.status, "Scan", { id: device.id, location: device.location, totalReads: device.totalReads })}
 className={`p-1 rounded transition-colors ${getStatusColor(device.status)} hover:bg-[var(--surface-container-low)] hover:bg-[var(--surface-container-high)]`}
 title={isBookmarked(tileId) ? "Remove bookmark" : "Add bookmark"}
 >
 <Star className={`${isBookmarked(tileId) ? "fill-current" : ""}`} size={16} />
 </button>
 </div>
 </div>

 {device.status === "up" ? (
 <>
 <div className="grid grid-cols-3 gap-4 mb-4">
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-lg p-3">
 <p className="text-xs text-[var(--muted-foreground)] mb-1">Total Reads</p>
 <p className="text-xl font-bold text-[var(--foreground)] ">{device.totalReads}</p>
 </div>
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-lg p-3">
 <p className="text-xs text-[var(--muted-foreground)] mb-1">Per Hour</p>
 <p className="text-xl font-bold text-[var(--foreground)] ">{device.readsPerHour}</p>
 </div>
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-lg p-3">
 <p className="text-xs text-[var(--muted-foreground)] mb-1">Last Read</p>
 <p className="text-sm font-bold text-[var(--foreground)] ">{device.lastRead}</p>
 </div>
 </div>

 <div>
 <h4 className="text-sm font-semibold text-[var(--foreground)]  mb-3">Read Quality</h4>
 <div className="space-y-2">
 <div className="flex items-center justify-between">
 <span className="text-sm text-[var(--muted-foreground)]">Good Reads</span>
 <div className="flex items-center gap-2">
 <div className="w-32 h-2 bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)] rounded-full overflow-hidden">
 <div
 className="h-full bg-[var(--state-success)]"
 style={{ width: `${goodReadPct}%` }}
 />
 </div>
 <span className="text-sm font-bold text-[var(--foreground)]  w-16 text-right">{goodReadPct}%</span>
 </div>
 </div>
 <div className="flex items-center justify-between">
 <span className="text-sm text-[var(--muted-foreground)]">No Reads</span>
 <div className="flex items-center gap-2">
 <div className="w-32 h-2 bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)] rounded-full overflow-hidden">
 <div
 className="h-full bg-[var(--state-error)]"
 style={{ width: `${noReadPct}%` }}
 />
 </div>
 <span className="text-sm font-bold text-[var(--foreground)]  w-16 text-right">{noReadPct}%</span>
 </div>
 </div>
 <div className="flex items-center justify-between">
 <span className="text-sm text-[var(--muted-foreground)]">No Codes</span>
 <div className="flex items-center gap-2">
 <div className="w-32 h-2 bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)] rounded-full overflow-hidden">
 <div
 className="h-full bg-[var(--state-warning)]"
 style={{ width: `${noCodePct}%` }}
 />
 </div>
 <span className="text-sm font-bold text-[var(--foreground)]  w-16 text-right">{noCodePct}%</span>
 </div>
 </div>
 <div className="flex items-center justify-between">
 <span className="text-sm text-[var(--muted-foreground)]">Multi Reads</span>
 <div className="flex items-center gap-2">
 <div className="w-32 h-2 bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)] rounded-full overflow-hidden">
 <div
 className="h-full bg-[var(--state-warning)]"
 style={{ width: `${multiReadPct}%` }}
 />
 </div>
 <span className="text-sm font-bold text-[var(--foreground)]  w-16 text-right">{multiReadPct}%</span>
 </div>
 </div>
 </div>
 </div>
 </>
 ) : (
 <div className="text-center py-8 text-[var(--muted-foreground)]">
 <XCircle className="mx-auto mb-2" size={32} />
 <p className="text-sm">Device is offline</p>
 </div>
 )}
 </div>
 );
 })}
 </div>
 )}
 </div>
 )}

 {/* SECTION 2: SUB SYSTEMS (formerly Conveyors) */}
 {selectedSections.has("SubSystems") && (
 <div className="mb-12">
 <div
 className="flex items-center gap-2 mb-6 cursor-pointer"
 onClick={() => toggleSectionExpansion("SubSystems")}
 >
 <Radio className="text-[var(--primary)] dark:text-[var(--primary)]" size={20} />
 <h2 className="text-2xl font-bold text-[var(--foreground)] ">Sub Systems</h2>
 <span className="text-sm text-[var(--muted-foreground)]">
 ({subSystemsUp} up, {subSystemsDown} down)
 </span>
 <button className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] dark:hover:text-[var(--foreground)] transition-colors ml-2">
 {expandedSections.has("SubSystems") ? (
 <ChevronUp size={20} />
 ) : (
 <ChevronDown size={20} />
 )}
 </button>
 </div>

 {expandedSections.has("SubSystems") && (
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 {filteredSubSystemsData.map((subsystem) => {
 const tileId = `mhe-subsystem-${subsystem.id}`;
 return (
 <div
 key={subsystem.id}
 className={`bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border rounded-lg p-6 ${getStatusBgColor(subsystem.status)}`}
 >
 <div className="flex items-start justify-between mb-4">
 <div>
 <div className="flex items-center gap-2 mb-1">
 <Radio size={20} className={getStatusColor(subsystem.status)} />
 <h3 className="font-bold text-lg text-[var(--foreground)] ">{subsystem.name}</h3>
 </div>
 <p className="text-sm text-[var(--muted-foreground)]">{subsystem.id} • {subsystem.location}</p>
 </div>
 <div className="flex items-center gap-2">
 <div className={`w-2 h-2 rounded-full ${
 subsystem.status === 'up' ? 'bg-[var(--state-success)]' : 'bg-[var(--state-error)]'
 } animate-pulse`} />
 <span className={`${getStatusColor(subsystem.status)} text-sm font-medium uppercase`}>
 {subsystem.status}
 </span>
 <button
 onClick={(e) => handleBookmarkTile(e, tileId, subsystem.name, "subsystems", subsystem.status, "Radio", { id: subsystem.id, location: subsystem.location, oee: subsystem.oee })}
 className={`p-1 rounded transition-colors ${getStatusColor(subsystem.status)} hover:bg-[var(--surface-container-low)] hover:bg-[var(--surface-container-high)]`}
 title={isBookmarked(tileId) ? "Remove bookmark" : "Add bookmark"}
 >
 <Star className={`${isBookmarked(tileId) ? "fill-current" : ""}`} size={16} />
 </button>
 </div>
 </div>

 {subsystem.status === "up" ? (
 <>
 {/* OEE Score - Prominent */}
 <div className={`mb-4 p-4 ${getOEEBgColor(subsystem.oee)} rounded-lg`}>
 <p className="text-xs text-[var(--muted-foreground)] mb-1">Overall Equipment Effectiveness (OEE)</p>
 <p className={`text-3xl font-bold ${getOEEColor(subsystem.oee)}`}>{subsystem.oee}%</p>
 </div>

 {/* OEE Breakdown */}
 <div className="space-y-3">
 <div>
 <div className="flex justify-between text-sm mb-1">
 <span className="text-[var(--muted-foreground)]">Availability</span>
 <span className="font-medium text-[var(--foreground)] ">{subsystem.availability}%</span>
 </div>
 <div className="w-full h-2 bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)] rounded-full overflow-hidden">
 <div
 className="h-full bg-[var(--primary)] "
 style={{ width: `${subsystem.availability}%` }}
 />
 </div>
 </div>

 <div>
 <div className="flex justify-between text-sm mb-1">
 <span className="text-[var(--muted-foreground)]">Performance</span>
 <span className="font-medium text-[var(--foreground)] ">{subsystem.performance}%</span>
 </div>
 <div className="w-full h-2 bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)] rounded-full overflow-hidden">
 <div
 className="h-full bg-[var(--primary)] "
 style={{ width: `${subsystem.performance}%` }}
 />
 </div>
 </div>

 <div>
 <div className="flex justify-between text-sm mb-1">
 <span className="text-[var(--muted-foreground)]">Quality</span>
 <span className="font-medium text-[var(--foreground)] ">{subsystem.quality}%</span>
 </div>
 <div className="w-full h-2 bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)] rounded-full overflow-hidden">
 <div
 className="h-full bg-[var(--primary)] "
 style={{ width: `${subsystem.quality}%` }}
 />
 </div>
 </div>
 </div>
 </>
 ) : (
 <div className="text-center py-8 text-[var(--muted-foreground)]">
 <XCircle className="mx-auto mb-2" size={32} />
 <p className="text-sm">Sub System is offline</p>
 </div>
 )}
 </div>
 );
 })}
 </div>
 )}
 </div>
 )}

 {/* SECTION 3: SORTERS (with lane routing) */}
 {selectedSections.has("Sorters") && (
 <div className="mb-12">
 <div
 className="flex items-center gap-2 mb-6 cursor-pointer"
 onClick={() => toggleSectionExpansion("Sorters")}
 >
 <Boxes className="text-[var(--primary)] dark:text-[var(--primary)]" size={20} />
 <h2 className="text-2xl font-bold text-[var(--foreground)] ">Sorters</h2>
 <span className="text-sm text-[var(--muted-foreground)]">
 ({sortersUp} up, {sortersDown} down)
 </span>
 <button className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] dark:hover:text-[var(--foreground)] transition-colors ml-2">
 {expandedSections.has("Sorters") ? (
 <ChevronUp size={20} />
 ) : (
 <ChevronDown size={20} />
 )}
 </button>
 </div>

 {expandedSections.has("Sorters") && (
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 {filteredSortersData.map((sorter) => {
 const tileId = `mhe-sorter-${sorter.id}`;
 return (
 <div
 key={sorter.id}
 className={`bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border rounded-lg p-6 ${getStatusBgColor(sorter.status)} relative`}
 >
 <div className="flex items-start justify-between mb-4">
 <div>
 <div className="flex items-center gap-2 mb-1">
 <Boxes size={20} className={getStatusColor(sorter.status)} />
 <h3 className="font-bold text-lg text-[var(--foreground)] ">{sorter.name}</h3>
 </div>
 <p className="text-sm text-[var(--muted-foreground)]">{sorter.id} • {sorter.location}</p>
 </div>
 <div className="flex items-center gap-2">
 <div className={`w-2 h-2 rounded-full ${
 sorter.status === 'up' ? 'bg-[var(--state-success)]' : 'bg-[var(--state-error)]'
 } animate-pulse`} />
 <span className={`${getStatusColor(sorter.status)} text-sm font-medium uppercase`}>
 {sorter.status}
 </span>
 <button
 onClick={(e) => handleBookmarkTile(e, tileId, sorter.name, "sorters", sorter.status, "Boxes", { id: sorter.id, location: sorter.location, totalSorts: sorter.totalSorts })}
 className={`p-1 rounded transition-colors ${getStatusColor(sorter.status)} hover:bg-[var(--surface-container-low)] hover:bg-[var(--surface-container-high)]`}
 title={isBookmarked(tileId) ? "Remove bookmark" : "Add bookmark"}
 >
 <Star className={`${isBookmarked(tileId) ? "fill-current" : ""}`} size={16} />
 </button>
 </div>
 </div>

 {sorter.status === "up" ? (
 <>
 <div className="grid grid-cols-2 gap-4 mb-4">
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-lg p-3">
 <p className="text-xs text-[var(--muted-foreground)] mb-1">Total Sorts</p>
 <p className="text-xl font-bold text-[var(--foreground)] ">{sorter.totalSorts}</p>
 </div>
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-lg p-3">
 <p className="text-xs text-[var(--muted-foreground)] mb-1">Per Hour</p>
 <p className="text-xl font-bold text-[var(--foreground)] ">{sorter.sortsPerHour}</p>
 </div>
 </div>

 <div>
 <h4 className="text-sm font-semibold text-[var(--foreground)]  mb-2">Lane Routing</h4>
 <div className="space-y-2">
 {sorter.laneRouting.map((lane, idx) => (
 <div key={idx} className="flex items-center justify-between">
 <span className="text-sm text-[var(--muted-foreground)]">{lane.lane}</span>
 <div className="flex items-center gap-2 flex-1 ml-4">
 <div className="flex-1 h-2 bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)] rounded-full overflow-hidden">
 <div
 className="h-full bg-[var(--primary)] "
 style={{ width: `${(lane.count / sorter.totalSorts) * 100}%` }}
 />
 </div>
 <span className="text-sm font-bold text-[var(--foreground)]  w-12 text-right">{lane.count}</span>
 </div>
 </div>
 ))}
 </div>
 </div>
 </>
 ) : (
 <div className="text-center py-8 text-[var(--muted-foreground)]">
 <XCircle className="mx-auto mb-2" size={32} />
 <p className="text-sm">Sorter is offline</p>
 </div>
 )}
 </div>
 );
 })}
 </div>
 )}
 </div>
 )}

 {/* SECTION 4: ROBOTS (includes all robot types with filter) */}
 {selectedSections.has("Robots") && (
 <div className="mb-12">
 <div
 className="flex items-center gap-2 mb-6 cursor-pointer"
 onClick={() => toggleSectionExpansion("Robots")}
 >
 <Bot className="text-[var(--primary)] dark:text-[var(--primary)]" size={20} />
 <h2 className="text-2xl font-bold text-[var(--foreground)] ">Robots</h2>
 <span className="text-sm text-[var(--muted-foreground)]">
 ({robotsUp} up, {robotsDown} down)
 </span>
 {robotTypeFilter !== 'all' && (
 <span className="text-xs px-2 py-1 bg-[var(--primary)]/10 /10 text-[var(--primary)] dark:text-[var(--primary)] rounded-full">
 Filtered: {robotTypeFilter}
 </span>
 )}
 <button className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] dark:hover:text-[var(--foreground)] transition-colors ml-2">
 {expandedSections.has("Robots") ? (
 <ChevronUp size={20} />
 ) : (
 <ChevronDown size={20} />
 )}
 </button>
 </div>

 {expandedSections.has("Robots") && (
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 {filteredRobotsData.map((robot) => {
 const tileId = `mhe-robot-${robot.id}`;
 return (
 <div
 key={robot.id}
 className={`bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border rounded-lg p-6 ${getStatusBgColor(robot.status)}`}
 >
 <div className="flex items-start justify-between mb-4">
 <div>
 <div className="flex items-center gap-2 mb-1">
 {robot.type === 'Palletizer' && <Package size={20} className={getStatusColor(robot.status)} />}
 {robot.type === 'Pick Robot' && <Box size={20} className={getStatusColor(robot.status)} />}
 {robot.type === 'Transport Robot' && <Box size={20} className={getStatusColor(robot.status)} />}
 {robot.type === 'Descrambler' && <Combine size={20} className={getStatusColor(robot.status)} />}
 {robot.type === 'Shuttle' && <Radio size={20} className={getStatusColor(robot.status)} />}
 {robot.type === 'Stretch Wrapper' && <Wind size={20} className={getStatusColor(robot.status)} />}
 {robot.type === 'Robotic Arm' && <Bot size={20} className={getStatusColor(robot.status)} />}
 <h3 className="font-bold text-lg text-[var(--foreground)] ">{robot.name}</h3>
 <span className="text-xs px-2 py-1 bg-[var(--surface-container-low)] dark:bg-[var(--card)] rounded-full text-[var(--muted-foreground)]">
 {robot.type}
 </span>
 </div>
 <p className="text-sm text-[var(--muted-foreground)]">{robot.id} • {robot.location}</p>
 </div>
 <div className="flex items-center gap-2">
 <div className={`w-2 h-2 rounded-full ${
 robot.status === 'up' ? 'bg-[var(--state-success)]' : 'bg-[var(--state-error)]'
 } animate-pulse`} />
 <span className={`${getStatusColor(robot.status)} text-sm font-medium uppercase`}>
 {robot.status}
 </span>
 <button
 onClick={(e) => handleBookmarkTile(e, tileId, robot.name, "robots", robot.status, "Bot", { id: robot.id, location: robot.location, type: robot.type, oee: robot.oee })}
 className={`p-1 rounded transition-colors ${getStatusColor(robot.status)} hover:bg-[var(--surface-container-low)] hover:bg-[var(--surface-container-high)]`}
 title={isBookmarked(tileId) ? "Remove bookmark" : "Add bookmark"}
 >
 <Star className={`${isBookmarked(tileId) ? "fill-current" : ""}`} size={16} />
 </button>
 </div>
 </div>

 {robot.status === "up" ? (
 <>
 {/* OEE Score - Prominent */}
 <div className={`mb-4 p-4 ${getOEEBgColor(robot.oee)} rounded-lg`}>
 <p className="text-xs text-[var(--muted-foreground)] mb-1">Overall Equipment Effectiveness (OEE)</p>
 <p className={`text-3xl font-bold ${getOEEColor(robot.oee)}`}>{robot.oee}%</p>
 </div>

 {robot.currentWorkList && (
 <div className="mb-4 p-3 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-lg">
 <p className="text-xs text-[var(--muted-foreground)] mb-1">Current Work List</p>
 <p className="text-lg font-bold text-[var(--primary)] dark:text-[var(--primary)]">{robot.currentWorkList}</p>
 <p className="text-sm text-[var(--muted-foreground)]">{robot.workType}</p>
 </div>
 )}

 {/* OEE Breakdown */}
 <div className="space-y-2">
 <div>
 <div className="flex justify-between text-sm mb-1">
 <span className="text-[var(--muted-foreground)]">Availability</span>
 <span className="font-medium text-[var(--foreground)] ">{robot.availability}%</span>
 </div>
 <div className="w-full h-2 bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)] rounded-full overflow-hidden">
 <div
 className="h-full bg-[var(--primary)] "
 style={{ width: `${robot.availability}%` }}
 />
 </div>
 </div>

 <div>
 <div className="flex justify-between text-sm mb-1">
 <span className="text-[var(--muted-foreground)]">Performance</span>
 <span className="font-medium text-[var(--foreground)] ">{robot.performance}%</span>
 </div>
 <div className="w-full h-2 bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)] rounded-full overflow-hidden">
 <div
 className="h-full bg-[var(--primary)] "
 style={{ width: `${robot.performance}%` }}
 />
 </div>
 </div>

 <div>
 <div className="flex justify-between text-sm mb-1">
 <span className="text-[var(--muted-foreground)]">Quality</span>
 <span className="font-medium text-[var(--foreground)] ">{robot.quality}%</span>
 </div>
 <div className="w-full h-2 bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)] rounded-full overflow-hidden">
 <div
 className="h-full bg-[var(--primary)] "
 style={{ width: `${robot.quality}%` }}
 />
 </div>
 </div>
 </div>
 </>
 ) : (
 <div className="text-center py-8 text-[var(--muted-foreground)]">
 <XCircle className="mx-auto mb-2" size={32} />
 <p className="text-sm">Robot is offline</p>
 </div>
 )}
 </div>
 );
 })}
 </div>
 )}
 </div>
 )}
 </div>
 )}
 </div>
 </div>
 );
}
