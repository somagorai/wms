import { Activity, TrendingUp, Users, FolderKanban, ChevronRight, ChevronDown, ChevronUp, Package, Warehouse, Monitor, ScanLine, Clock, CheckCircle2, AlertCircle, BarChart3, Filter, X, Calendar, Check, BarChart, Table, LineChart as LineChartIcon, Home, Star } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart as RechartsBarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { WorkListDetailPanel } from "../components/WorkListDetailPanel";
import { WorkListMetrics } from "../components/WorkListMetrics";
import { useLayout } from "../contexts/LayoutContext";
import { useBookmarks } from "../contexts/BookmarkContext";

// Mock data for Work Lists & Operations
const workListData = [
  { 
    type: "Pick", 
    warning: 3, 
    inProgress: 12, 
    queued: 8, 
    completed: 42, 
    shorted: 2,
    avgCompletionTime: "24m"
  },
  { 
    type: "Replenishment", 
    warning: 1, 
    inProgress: 5, 
    queued: 3, 
    completed: 38, 
    shorted: 0,
    avgCompletionTime: "18m"
  },
  { 
    type: "Cycle Count", 
    warning: 0, 
    inProgress: 2, 
    queued: 1, 
    completed: 28, 
    shorted: 0,
    avgCompletionTime: "15m"
  },
  { 
    type: "Inspection", 
    warning: 2, 
    inProgress: 4, 
    queued: 2, 
    completed: 35, 
    shorted: 1,
    avgCompletionTime: "32m"
  },
];

// Mock data for Work Operations
const workOperationsData = [
  { 
    type: "Pick", 
    warning: 5, 
    inProgress: 18, 
    queued: 12, 
    completed: 38, 
    shorted: 3,
    avgCompletionTime: "28m"
  },
  { 
    type: "Replenishment", 
    warning: 2, 
    inProgress: 8, 
    queued: 6, 
    completed: 41, 
    shorted: 1,
    avgCompletionTime: "22m"
  },
  { 
    type: "Cycle Count", 
    warning: 1, 
    inProgress: 3, 
    queued: 2, 
    completed: 32, 
    shorted: 0,
    avgCompletionTime: "19m"
  },
  { 
    type: "Inspection", 
    warning: 4, 
    inProgress: 6, 
    queued: 4, 
    completed: 29, 
    shorted: 2,
    avgCompletionTime: "35m"
  },
];

// Generate mock detailed work list items to match the exact counts
const generateDetailedWorkLists = () => {
  const workLists: Array<{
    id: string;
    name: string;
    workList: string;
    type: string;
    status: string;
    priority: string;
    priorityDateTime: string;
    plan: string;
    lastEvent: string;
    isHot: boolean;
    attribute1: string;
    attribute2: string;
    attribute3: string;
    attribute4: string;
    attribute5: string;
    subType: string;
    started: string;
    storage: string;
    destination: string;
    created: string;
    modified: string;
  }> = [];
  let counter = 1;

  const priorities = ["Critical", "High", "Medium", "Low"];
  const plans = ["Plan A", "Plan B", "Plan C"];
  const lastEvents = [
    "Item delayed 2hrs",
    "Security review pending",
    "Performance issues detected",
    "Started by WS-001",
    "60% complete",
    "Waiting for slot",
    "Scheduled for 3PM",
    "Deployment successful",
    "Awaiting approval",
    "Review completed",
    "Processing in warehouse",
    "Quality check complete",
    "Inventory updated",
    "Location verified",
    "Scanning complete"
  ];
  const attributes1 = ["Marketing", "Backend", "Frontend", "Security", "Quality", "UX", "Operations", "Warehouse"];
  const attributes2 = ["Q1 2024", "Q2 2024", "Sprint 12", "Sprint 13", "Sprint 14", "Plan A", "Plan B", "Plan C"];
  const attributes3 = ["Zone A", "Zone B", "Zone C", "Zone D", "North", "South", "East", "West"];
  const attributes4 = ["Active", "Pending", "Review", "Approved", "Rejected", "On Hold"];
  const attributes5 = ["Standard", "Express", "Overnight", "Economy", "Premium", "Rush"];
  const subTypes = ["Single", "Batch", "Wave", "Cluster", "Priority", "Regular"];
  const storageLocations = ["A1-01-02", "B2-03-04", "C3-05-06", "D4-07-08", "E5-09-10", "F6-11-12"];
  const destinations = ["Dock 1", "Dock 2", "Dock 3", "Stage A", "Stage B", "Packing", "Shipping"];

  const addItems = (type: string, status: string, count: number) => {
    for (let i = 0; i < count; i++) {
      const hour = 7 + Math.floor(Math.random() * 10);
      const minute = Math.floor(Math.random() * 60);
      const priority = priorities[Math.floor(Math.random() * priorities.length)];
      const isHot = status === "Warning" || priority === "Critical" || Math.random() > 0.8;
      const month = Math.floor(Math.random() * 3) + 1;
      const day = Math.floor(Math.random() * 28) + 1;

      workLists.push({
        id: counter.toString(),
        name: `WL-${counter.toString().padStart(3, '0')}`,
        workList: `WL-${counter.toString().padStart(3, '0')}`,
        type,
        status,
        priority,
        priorityDateTime: `2026-03-12 ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
        plan: plans[Math.floor(Math.random() * plans.length)],
        lastEvent: lastEvents[Math.floor(Math.random() * lastEvents.length)],
        isHot,
        attribute1: attributes1[Math.floor(Math.random() * attributes1.length)],
        attribute2: attributes2[Math.floor(Math.random() * attributes2.length)],
        attribute3: attributes3[Math.floor(Math.random() * attributes3.length)],
        attribute4: attributes4[Math.floor(Math.random() * attributes4.length)],
        attribute5: attributes5[Math.floor(Math.random() * attributes5.length)],
        subType: subTypes[Math.floor(Math.random() * subTypes.length)],
        started: status === "In Progress" || status === "Completed" ? `2026-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(Math.floor(Math.random() * 16) + 6).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}` : "-",
        storage: storageLocations[Math.floor(Math.random() * storageLocations.length)],
        destination: destinations[Math.floor(Math.random() * destinations.length)],
        created: `2026-${String(Math.floor(Math.random() * 3) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        modified: `2026-03-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}`
      });
      counter++;
    }
  };
  
  // Pick work lists - total 67
  addItems("Pick", "Warning", 3);
  addItems("Pick", "In Progress", 12);
  addItems("Pick", "Queued", 8);
  addItems("Pick", "Completed", 42);
  addItems("Pick", "Shorted", 2);
  
  // Replenishment work lists - total 47
  addItems("Replenishment", "Warning", 1);
  addItems("Replenishment", "In Progress", 5);
  addItems("Replenishment", "Queued", 3);
  addItems("Replenishment", "Completed", 38);
  
  // Cycle Count work lists - total 31
  addItems("Cycle Count", "In Progress", 2);
  addItems("Cycle Count", "Queued", 1);
  addItems("Cycle Count", "Completed", 28);
  
  // Inspection work lists - total 44
  addItems("Inspection", "Warning", 2);
  addItems("Inspection", "In Progress", 4);
  addItems("Inspection", "Queued", 2);
  addItems("Inspection", "Completed", 35);
  addItems("Inspection", "Shorted", 1);
  
  return workLists;
};

const mockDetailedWorkLists = generateDetailedWorkLists();

const stats = [
  {
    label: "Total Projects",
    value: "24",
    change: "+12%",
    icon: FolderKanban,
    color: "from-[#50e080] to-[#3bc76a]",
  },
  {
    label: "Active Users",
    value: "1,429",
    change: "+8%",
    icon: Users,
    color: "from-blue-500 to-cyan-500",
  },
  {
    label: "Engagement",
    value: "89%",
    change: "+3%",
    icon: TrendingUp,
    color: "from-emerald-500 to-green-500",
  },
  {
    label: "Activity",
    value: "542",
    change: "+18%",
    icon: Activity,
    color: "from-orange-500 to-red-500",
  },
];

export function Dashboard() {
  // Layout context
  const { isSidebarExpanded } = useLayout();

  // Bookmarks context
  const { toggleBookmark, isBookmarked } = useBookmarks();

  // URL search params
  const [searchParams, setSearchParams] = useSearchParams();

  // Handle bookmark tile
  const handleBookmarkTile = (e: React.MouseEvent, tileId: string, title: string, status: string, data: any) => {
    e.stopPropagation(); // Prevent tile click
    toggleBookmark({
      id: tileId,
      title,
      type: "operations",
      icon: status === "Warning" ? "AlertCircle" : status === "In Progress" ? "Activity" : status === "Queued" ? "Clock" : "CheckCircle2",
      data: {
        status,
        ...data
      }
    });
  };

  // Filter state
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [timeRange, setTimeRange] = useState<string>("");
  const [selectedSections, setSelectedSections] = useState<Set<string>>(new Set(["Work Lists & Operations", "Storage", "Workstation Activity", "Scan Data", "Automation Performance"]));
  const [sectionSearch, setSectionSearch] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<'time' | 'section' | 'worklistType' | null>(null);
  const [showCustomDateRange, setShowCustomDateRange] = useState(false);
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [showFilterTooltip, setShowFilterTooltip] = useState(false);

  // Work Lists & Operations section state
  const [workListViewMode, setWorkListViewMode] = useState<'table' | 'graph'>('table');
  const [selectedWorkListTypes, setSelectedWorkListTypes] = useState<Set<string>>(new Set(["Pick", "Replenishment", "Cycle Count", "Inspection"]));
  const [workListTypeSearch, setWorkListTypeSearch] = useState("");

  // Detail panel state
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [detailPanelType, setDetailPanelType] = useState<string>("");
  const [detailPanelStatus, setDetailPanelStatus] = useState<string>("");
  const [detailPanelSection, setDetailPanelSection] = useState<"worklist" | "operations">("worklist");
  const [detailPanelCount, setDetailPanelCount] = useState<number>(0);

  // Work Lists tile expansion state
  const [expandedWorkListTiles, setExpandedWorkListTiles] = useState<Set<string>>(new Set(["Warning", "In Progress", "Queued", "Completed"]));

  // Operations tile expansion state
  const [expandedOperationsTiles, setExpandedOperationsTiles] = useState<Set<string>>(new Set(["Warning", "In Progress", "Queued", "Completed"]));

  // Section expansion state
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["Work Lists & Operations", "Storage", "Workstation Activity", "Scan Data", "Automation Performance"]));

  const allSections = ["Work Lists & Operations", "Storage", "Workstation Activity", "Scan Data", "Automation Performance"];
  const allWorkListTypes = ["Pick", "Replenishment", "Cycle Count", "Inspection"];

  // Handle URL parameters on component mount
  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam && allWorkListTypes.includes(typeParam)) {
      // Set only the specified type
      setSelectedWorkListTypes(new Set([typeParam]));
      // Clear the URL parameter after applying it
      searchParams.delete('type');
      setSearchParams(searchParams, { replace: true });
    }
  }, []);

  const toggleSection = (section: string) => {
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

  const toggleWorkListType = (type: string) => {
    const newSelected = new Set(selectedWorkListTypes);
    if (newSelected.has(type)) {
      newSelected.delete(type);
    } else {
      newSelected.add(type);
    }
    setSelectedWorkListTypes(newSelected);
  };

  const toggleWorkListTile = (tile: string) => {
    const newExpanded = new Set(expandedWorkListTiles);
    if (newExpanded.has(tile)) {
      newExpanded.delete(tile);
    } else {
      newExpanded.add(tile);
    }
    setExpandedWorkListTiles(newExpanded);
  };

  const expandAllWorkListTiles = () => {
    setExpandedWorkListTiles(new Set(["Warning", "In Progress", "Queued", "Completed"]));
  };

  const collapseAllWorkListTiles = () => {
    setExpandedWorkListTiles(new Set());
  };

  const toggleOperationsTile = (tile: string) => {
    const newExpanded = new Set(expandedOperationsTiles);
    if (newExpanded.has(tile)) {
      newExpanded.delete(tile);
    } else {
      newExpanded.add(tile);
    }
    setExpandedOperationsTiles(newExpanded);
  };

  const expandAllOperationsTiles = () => {
    setExpandedOperationsTiles(new Set(["Warning", "In Progress", "Queued", "Completed"]));
  };

  const collapseAllOperationsTiles = () => {
    setExpandedOperationsTiles(new Set());
  };

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
    if (range === 'custom') {
      setShowCustomDateRange(true);
    } else {
      setShowCustomDateRange(false);
      setCustomStartDate("");
      setCustomEndDate("");
    }
  };

  const clearAllFilters = () => {
    setTimeRange("");
    setSelectedSections(new Set(allSections));
    setShowCustomDateRange(false);
    setCustomStartDate("");
    setCustomEndDate("");
    setSectionSearch("");
  };

  const hasActiveFilters = timeRange !== "" || selectedSections.size !== allSections.length;
  const totalFilterCount = (timeRange ? 1 : 0) + (selectedSections.size !== allSections.length ? 1 : 0);

  // Close dropdowns when clicking outside
  const handleClickOutside = () => {
    setActiveDropdown(null);
  };

  // Filter work list data based on selected types
  const filteredWorkListData = workListData.filter(item => selectedWorkListTypes.has(item.type));
  const filteredWorkOperationsData = workOperationsData.filter(item => selectedWorkListTypes.has(item.type));

  // Prepare data for horizontal bar chart - statuses on Y-axis, types as different bars
  const prepareHorizontalChartData = (data: typeof workListData) => {
    const statuses = ['Warning', 'In Progress', 'Queued', 'Completed', 'Shorted'];
    return statuses.map(status => {
      const dataPoint: any = { status };
      data.forEach(item => {
        switch(status) {
          case 'Warning':
            dataPoint[item.type] = item.warning;
            break;
          case 'In Progress':
            dataPoint[item.type] = item.inProgress;
            break;
          case 'Queued':
            dataPoint[item.type] = item.queued;
            break;
          case 'Completed':
            dataPoint[item.type] = item.completed;
            break;
          case 'Shorted':
            dataPoint[item.type] = item.shorted;
            break;
        }
      });
      return dataPoint;
    });
  };

  const workListChartData = prepareHorizontalChartData(filteredWorkListData);
  const workOperationsChartData = prepareHorizontalChartData(filteredWorkOperationsData);

  // Prepare data for chart - restructure so statuses are on X-axis and each type is a line
  const chartData = [
    {
      name: 'Warning',
      ...Object.fromEntries(filteredWorkListData.map(item => [item.type, item.warning]))
    },
    {
      name: 'In Progress',
      ...Object.fromEntries(filteredWorkListData.map(item => [item.type, item.inProgress]))
    },
    {
      name: 'Queued',
      ...Object.fromEntries(filteredWorkListData.map(item => [item.type, item.queued]))
    },
    {
      name: 'Completed',
      ...Object.fromEntries(filteredWorkListData.map(item => [item.type, item.completed]))
    },
    {
      name: 'Shorted',
      ...Object.fromEntries(filteredWorkListData.map(item => [item.type, item.shorted]))
    },
  ];

  // Prepare data for Work Operations chart
  const operationsChartData = [
    {
      name: 'Warning',
      ...Object.fromEntries(filteredWorkOperationsData.map(item => [item.type, item.warning]))
    },
    {
      name: 'In Progress',
      ...Object.fromEntries(filteredWorkOperationsData.map(item => [item.type, item.inProgress]))
    },
    {
      name: 'Queued',
      ...Object.fromEntries(filteredWorkOperationsData.map(item => [item.type, item.queued]))
    },
    {
      name: 'Completed',
      ...Object.fromEntries(filteredWorkOperationsData.map(item => [item.type, item.completed]))
    },
    {
      name: 'Shorted',
      ...Object.fromEntries(filteredWorkOperationsData.map(item => [item.type, item.shorted]))
    },
  ];

  // Define colors for each type - WCAG compliant and subtle
  const typeColors: Record<string, string> = {
    'Pick': '#059669', // Emerald 600
    'Replenishment': '#4f46e5', // Muted Indigo 600
    'Cycle Count': '#8b5cf6', // Violet 500
    'Inspection': '#b45309', // Muted Amber 700
  };

  // Handle cell click to open detail panel
  const handleCellClick = (type: string, status: string, section: "worklist" | "operations", count: number) => {
    setDetailPanelType(type);
    setDetailPanelStatus(status);
    setDetailPanelSection(section);
    setDetailPanelCount(count);
    setShowDetailPanel(true);
  };

  // Get filtered detail items based on type and status
  const getDetailItems = () => {
    return mockDetailedWorkLists.filter(item => {
      const matchesType = item.type === detailPanelType;
      const matchesStatus = item.status === detailPanelStatus;
      return matchesType && matchesStatus;
    });
  };

  const detailItems = showDetailPanel ? getDetailItems() : [];

  return (
    <div className={`p-8 transition-all duration-300 ${showDetailPanel ? 'mr-[900px]' : ''}`} onClick={handleClickOutside}>
      {/* Sticky Header Section */}
      <div className="sticky top-0 z-40 bg-white dark:bg-zinc-900 pb-4 -mt-8 pt-8 -mx-8 px-8">
        {/* Breadcrumb and Header Combined */}
        <div className="mb-3 flex items-center justify-between gap-4">
          {/* Breadcrumb with Operations Dashboard Icon */}
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/app/home" className="text-zinc-600 dark:text-zinc-400 hover:text-[#0d9488] dark:hover:text-[#50e080] transition-colors flex items-center gap-1">
              <Home size={14} />
              Home
            </Link>
            <ChevronRight size={16} className="text-zinc-400 dark:text-zinc-600" />
            <Link to="/app/navigation?section=dashboards" className="text-zinc-600 dark:text-zinc-400 hover:text-[#0d9488] dark:hover:text-[#50e080] transition-colors">
              Business Insights
            </Link>
            <ChevronRight size={16} className="text-zinc-400 dark:text-zinc-600" />
            <span className="text-zinc-900 dark:text-white font-semibold text-lg flex items-center gap-2">
              <Activity size={20} className="text-[#0d9488] dark:text-[#50e080]" />
              Operations Dashboard
            </span>
          </nav>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFilterPanel(!showFilterPanel);
                }}
                onMouseEnter={() => setShowFilterTooltip(true)}
                onMouseLeave={() => setShowFilterTooltip(false)}
                className={`px-4 py-2 text-white rounded-lg transition-colors flex items-center gap-2 border ${
                  showFilterPanel || hasActiveFilters
                    ? "bg-[#0d9488] dark:bg-[#50e080] hover:bg-[#0f766e] dark:hover:bg-[#3bc76a] border-[#0d9488] dark:border-[#50e080]"
                    : "bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white"
                }`}
              >
                <Filter size={18} />
                <span>Filter</span>
                {hasActiveFilters && (
                  <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded text-xs">
                    {totalFilterCount}
                  </span>
                )}
              </button>

              {/* Filter Tooltip */}
              {showFilterTooltip && hasActiveFilters && (
                <div className="absolute top-full left-0 mt-2 z-50 w-72 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-xl p-4 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">Active Filters</h4>
                      <span className="text-xs text-zinc-400">
                        {totalFilterCount} filter{totalFilterCount !== 1 ? 's' : ''}
                      </span>
                    </div>

                    {selectedSections.size !== allSections.length && (
                      <div>
                        <p className="text-xs font-medium text-zinc-400 mb-1.5">Sections</p>
                        <div className="flex flex-wrap gap-1.5">
                          {Array.from(selectedSections).map((section) => (
                            <span
                              key={section}
                              className="inline-flex items-center px-2 py-1 bg-[#50e080] text-white rounded text-xs"
                            >
                              {section}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {timeRange && (
                      <div>
                        <p className="text-xs font-medium text-zinc-400 mb-1.5">Time Range</p>
                        <div className="flex flex-wrap gap-1.5">
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-zinc-700 text-zinc-300 rounded text-xs">
                            <Calendar size={12} />
                            {timeRange === 'custom' ? (
                              `${customStartDate || 'Start'} - ${customEndDate || 'End'}`
                            ) : (
                              timeRange
                            )}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilterPanel && (
          <div className="mb-6 bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl p-6 animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-zinc-900 dark:text-white font-semibold">Filters</h3>
              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={() => setShowFilterPanel(false)}
                  className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Time Range Filter */}
              <div className="relative">
                <label className="text-sm font-medium text-zinc-300 mb-2 block">Time Range</label>
                <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-2 min-h-[42px]">
                  {/* Selected Time Range as Chip */}
                  {timeRange && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-[#50e080] text-white rounded text-xs font-medium">
                        <Calendar size={12} />
                        {timeRange === 'custom' ? (
                          `${customStartDate || 'Start'} - ${customEndDate || 'End'}`
                        ) : (
                          timeRange
                        )}
                        <button
                          onClick={() => {
                            setTimeRange("");
                            setShowCustomDateRange(false);
                            setCustomStartDate("");
                            setCustomEndDate("");
                          }}
                          className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    </div>
                  )}
                  <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      placeholder="Select time range..."
                      value={timeRange ? "" : ""}
                      onChange={(e) => handleTimeRangeChange(e.target.value)}
                      onFocus={() => setActiveDropdown('time')}
                      className="w-full bg-transparent text-zinc-300 text-sm placeholder-zinc-500 outline-none cursor-pointer"
                      readOnly
                    />
                    {/* Dropdown Options */}
                    {activeDropdown === 'time' && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl max-h-48 overflow-y-auto z-10">
                        {['1h', '2h', '4h', '8h', '12h', '24h', 'today', 'custom'].map((range) => (
                          <button
                            key={range}
                            onClick={() => {
                              handleTimeRangeChange(range);
                              setActiveDropdown(null);
                            }}
                            className={`w-full px-3 py-2 text-left text-sm transition-colors flex items-center gap-2 ${
                              timeRange === range
                                ? 'bg-[#50e080]/10 text-[#50e080]'
                                : 'text-zinc-300 hover:bg-zinc-700'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                              timeRange === range
                                ? 'bg-[#50e080] border-[#50e080]'
                                : 'border-zinc-600'
                            }`}>
                              {timeRange === range && <Check size={12} className="text-white" />}
                            </div>
                            {range === 'custom' ? (
                              <div className="flex items-center gap-2">
                                <Calendar size={12} />
                                <span>Custom</span>
                              </div>
                            ) : (
                              range
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {showCustomDateRange && (
                    <div className="mt-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="date"
                          value={customStartDate}
                          onChange={(e) => setCustomStartDate(e.target.value)}
                          className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-300 placeholder-zinc-500 outline-none"
                        />
                        <span className="text-zinc-400">to</span>
                        <input
                          type="date"
                          value={customEndDate}
                          onChange={(e) => setCustomEndDate(e.target.value)}
                          className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-300 placeholder-zinc-500 outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Section Filter - Multi-Select */}
              <div className="relative">
                <label className="text-sm font-medium text-zinc-300 mb-2 block">Sections</label>
                <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-2 min-h-[42px]">
                  {/* Selected Items as Chips */}
                  {selectedSections.size !== allSections.length && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {Array.from(selectedSections).map((section) => (
                        <span
                          key={section}
                          className="inline-flex items-center gap-1.5 px-2 py-1 bg-[#50e080] text-white rounded text-xs font-medium"
                        >
                          {section}
                          <button
                            onClick={() => toggleSection(section)}
                            className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  {/* Search and Dropdown */}
                  <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      placeholder="Search or select sections..."
                      value={sectionSearch}
                      onChange={(e) => setSectionSearch(e.target.value)}
                      onFocus={() => setActiveDropdown('section')}
                      className="w-full bg-transparent text-zinc-300 text-sm placeholder-zinc-500 outline-none"
                    />
                    {/* Dropdown Options */}
                    {activeDropdown === 'section' && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl max-h-48 overflow-y-auto z-10">
                        {allSections.filter(section => section.toLowerCase().includes(sectionSearch.toLowerCase())).map((section) => (
                          <button
                            key={section}
                            onClick={() => {
                              toggleSection(section);
                              setSectionSearch('');
                            }}
                            className={`w-full px-3 py-2 text-left text-sm transition-colors flex items-center gap-2 ${
                              selectedSections.has(section)
                                ? 'bg-[#50e080]/10 text-[#50e080]'
                                : 'text-zinc-300 hover:bg-zinc-700'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                              selectedSections.has(section)
                                ? 'bg-[#50e080] border-[#50e080]'
                                : 'border-zinc-600'
                            }`}>
                              {selectedSections.has(section) && <Check size={12} className="text-white" />}
                            </div>
                            {section}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* End Sticky Header Section */}

      {/* Work Lists & Operations */}
      {selectedSections.has("Work Lists & Operations") && (
      <div className="mb-8">
        <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl">
          {/* Section Header with Controls */}
          <div className="p-6 border-b border-zinc-300 dark:border-zinc-700">
            <div className="flex items-center justify-between">
              <div 
                className="flex items-center gap-2 cursor-pointer hover:text-[#50e080] transition-colors"
                onClick={() => toggleSectionExpansion("Work Lists & Operations")}
              >
                <Package className="text-[#0d9488] dark:text-[#50e080]" size={20} />
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">Operations</h3>
                <button className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors ml-2">
                  {expandedSections.has("Work Lists & Operations") ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </button>
              </div>

              {/* Controls - Only show when expanded */}
              {expandedSections.has("Work Lists & Operations") && (
              <div className="flex items-center gap-3">
              {/* Type Filter */}
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2 min-w-[200px]">
                  {selectedWorkListTypes.size !== allWorkListTypes.length && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {Array.from(selectedWorkListTypes).map((type) => (
                        <span
                          key={type}
                          className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#0d9488] dark:bg-[#50e080] text-white rounded text-xs font-medium"
                        >
                          {type}
                          <button
                            onClick={() => toggleWorkListType(type)}
                            className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                          >
                            <X size={10} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Filter by type..."
                      value={workListTypeSearch}
                      onChange={(e) => setWorkListTypeSearch(e.target.value)}
                      onFocus={() => setActiveDropdown('worklistType')}
                      className="w-full bg-transparent text-zinc-900 dark:text-zinc-300 text-xs placeholder-zinc-500 dark:placeholder-zinc-500 outline-none"
                    />
                    {activeDropdown === 'worklistType' && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-xl max-h-48 overflow-y-auto z-20">
                        {allWorkListTypes.filter(type => type.toLowerCase().includes(workListTypeSearch.toLowerCase())).map((type) => (
                          <button
                            key={type}
                            onClick={() => {
                              toggleWorkListType(type);
                              setWorkListTypeSearch('');
                            }}
                            className={`w-full px-3 py-2 text-left text-sm transition-colors flex items-center gap-2 ${
                              selectedWorkListTypes.has(type)
                                ? 'bg-[#0d9488]/10 dark:bg-[#50e080]/10 text-[#0d9488] dark:text-[#50e080]'
                                : 'text-zinc-900 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                              selectedWorkListTypes.has(type)
                                ? 'bg-[#0d9488] dark:bg-[#50e080] border-[#0d9488] dark:border-[#50e080]'
                                : 'border-zinc-300 dark:border-zinc-600'
                            }`}>
                              {selectedWorkListTypes.has(type) && <Check size={12} className="text-white" />}
                            </div>
                            {type}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-1">
                <button
                  onClick={() => setWorkListViewMode('table')}
                  className={`px-3 py-1.5 rounded text-sm transition-colors flex items-center gap-1.5 ${
                    workListViewMode === 'table'
                      ? 'bg-[#0d9488] dark:bg-[#50e080] text-white'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  <Table size={16} />
                  Table
                </button>
                <button
                  onClick={() => setWorkListViewMode('graph')}
                  className={`px-3 py-1.5 rounded text-sm transition-colors flex items-center gap-1.5 ${
                    workListViewMode === 'graph'
                      ? 'bg-[#0d9488] dark:bg-[#50e080] text-white'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  <BarChart size={16} />
                  Graph
                </button>
              </div>
              </div>
              )}
            </div>
          </div>

          {/* Section Content */}
          {expandedSections.has("Work Lists & Operations") && (
          <div className="p-6">
          {/* Table View */}
          {workListViewMode === 'table' && (
            <>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
              {/* Work Lists Subsection - Tile Layout */}
              <div className="bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 rounded-xl p-4 overflow-x-auto shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-zinc-500 dark:bg-zinc-600 rounded-lg flex items-center justify-center">
                      <Package className="text-white" size={16} />
                    </div>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">Work Lists</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={expandAllWorkListTiles}
                      className="px-2 py-1 text-xs bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
                    >
                      Expand All
                    </button>
                    <button
                      onClick={collapseAllWorkListTiles}
                      className="px-2 py-1 text-xs bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
                    >
                      Collapse All
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
                  {/* Warning Tile */}
                  <div>
                    <div className="relative bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-700 rounded-lg p-3 hover:shadow-xl hover:border-red-400 dark:hover:border-red-500 transition-all duration-300 hover:scale-[1.02] overflow-hidden group">
                      {/* Left Accent Line */}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/5 bg-red-500 dark:bg-red-400 rounded-r-full transition-all duration-300 group-hover:h-full group-hover:top-0 group-hover:translate-y-0 group-hover:rounded-r-none" />

                      <div
                        className="mb-3 pb-3 border-b-2 border-zinc-200 dark:border-zinc-700 cursor-pointer"
                        onClick={() => toggleWorkListTile("Warning")}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            <div className="w-6 h-6 bg-red-100 dark:bg-red-900/30 rounded-md flex items-center justify-center">
                              <AlertCircle className="text-red-600 dark:text-red-400" size={14} />
                            </div>
                            <div className="text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wide">Warning</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => handleBookmarkTile(e, "worklist-warning", "Work Lists - Warning", "Warning", { count: filteredWorkListData.reduce((sum, item) => sum + item.warning, 0) })}
                              className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                              title={isBookmarked("worklist-warning") ? "Remove bookmark" : "Add bookmark"}
                            >
                              <Star className={`${isBookmarked("worklist-warning") ? "fill-red-600 dark:fill-red-400" : ""} text-red-600 dark:text-red-400`} size={14} />
                            </button>
                            {expandedWorkListTiles.has("Warning") ? (
                              <ChevronUp className="text-red-600 dark:text-red-400" size={16} />
                            ) : (
                              <ChevronDown className="text-red-600 dark:text-red-400" size={16} />
                            )}
                          </div>
                        </div>
                        <div className="text-3xl font-bold text-red-600 dark:text-red-400 text-center">
                          {filteredWorkListData.reduce((sum, item) => sum + item.warning, 0)}
                        </div>
                      </div>
                      {expandedWorkListTiles.has("Warning") && (
                        <div className="space-y-2">
                          {filteredWorkListData.map((item) => (
                            <div
                              key={item.type}
                              className="flex items-center justify-between py-2 px-3 bg-gradient-to-r from-zinc-50 to-zinc-100 dark:from-zinc-800 dark:to-zinc-800/50 rounded-lg hover:from-red-50 hover:to-red-100 dark:hover:from-red-900/20 dark:hover:to-red-900/10 cursor-pointer transition-all duration-200 hover:shadow-md border border-transparent hover:border-red-200 dark:hover:border-red-800"
                              onClick={() => handleCellClick(item.type, "Warning", "worklist", item.warning)}
                            >
                              <span className="text-zinc-700 dark:text-zinc-300 text-sm font-semibold truncate mr-2">{item.type}</span>
                              <span className="text-lg font-bold text-red-600 dark:text-red-400 flex-shrink-0">{item.warning}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* In Progress Tile */}
                  <div>
                    <div className="relative bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-700 rounded-lg p-3 hover:shadow-xl hover:border-[#0d9488] dark:hover:border-[#50e080] transition-all duration-300 hover:scale-[1.02] overflow-hidden group">
                      {/* Left Accent Line */}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/5 bg-[#0d9488] dark:bg-[#50e080] rounded-r-full transition-all duration-300 group-hover:h-full group-hover:top-0 group-hover:translate-y-0 group-hover:rounded-r-none" />

                      <div
                        className="mb-3 pb-3 border-b-2 border-zinc-200 dark:border-zinc-700 cursor-pointer"
                        onClick={() => toggleWorkListTile("In Progress")}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            <div className="w-6 h-6 bg-[#0d9488]/10 dark:bg-[#50e080]/10 rounded-md flex items-center justify-center">
                              <Activity className="text-[#0d9488] dark:text-[#50e080]" size={14} />
                            </div>
                            <div className="text-[#0d9488] dark:text-[#50e080] text-xs font-bold uppercase tracking-wide">In Progress</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => handleBookmarkTile(e, "worklist-inprogress", "Work Lists - In Progress", "In Progress", { count: filteredWorkListData.reduce((sum, item) => sum + item.inProgress, 0) })}
                              className="p-1 hover:bg-[#0d9488]/10 dark:hover:bg-[#50e080]/10 rounded transition-colors"
                              title={isBookmarked("worklist-inprogress") ? "Remove bookmark" : "Add bookmark"}
                            >
                              <Star className={`${isBookmarked("worklist-inprogress") ? "fill-[#0d9488] dark:fill-[#50e080]" : ""} text-[#0d9488] dark:text-[#50e080]`} size={14} />
                            </button>
                            {expandedWorkListTiles.has("In Progress") ? (
                              <ChevronUp className="text-[#0d9488] dark:text-[#50e080]" size={16} />
                            ) : (
                              <ChevronDown className="text-[#0d9488] dark:text-[#50e080]" size={16} />
                            )}
                          </div>
                        </div>
                        <div className="text-3xl font-bold text-[#0d9488] dark:text-[#50e080] text-center">
                          {filteredWorkListData.reduce((sum, item) => sum + item.inProgress, 0)}
                        </div>
                      </div>
                      {expandedWorkListTiles.has("In Progress") && (
                        <div className="space-y-2">
                          {filteredWorkListData.map((item) => (
                            <div
                              key={item.type}
                              className="flex items-center justify-between py-2 px-3 bg-gradient-to-r from-zinc-50 to-zinc-100 dark:from-zinc-800 dark:to-zinc-800/50 rounded-lg hover:from-teal-50 hover:to-teal-100 dark:hover:from-teal-900/20 dark:hover:to-teal-900/10 cursor-pointer transition-all duration-200 hover:shadow-md border border-transparent hover:border-teal-200 dark:hover:border-teal-800"
                              onClick={() => handleCellClick(item.type, "In Progress", "worklist", item.inProgress)}
                            >
                              <span className="text-zinc-700 dark:text-zinc-300 text-sm font-semibold truncate mr-2">{item.type}</span>
                              <span className="text-lg font-bold text-[#0d9488] dark:text-[#50e080] flex-shrink-0">{item.inProgress}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Queued Tile */}
                  <div className="min-w-[180px]">
                    <div className="relative bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-700 rounded-lg p-3 hover:shadow-xl hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 hover:scale-[1.02] overflow-hidden group">
                      {/* Left Accent Line */}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/5 bg-blue-500 dark:bg-blue-400 rounded-r-full transition-all duration-300 group-hover:h-full group-hover:top-0 group-hover:translate-y-0 group-hover:rounded-r-none" />

                      <div
                        className="mb-3 pb-3 border-b-2 border-zinc-200 dark:border-zinc-700 cursor-pointer"
                        onClick={() => toggleWorkListTile("Queued")}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-md flex items-center justify-center">
                              <Clock className="text-blue-600 dark:text-blue-400" size={14} />
                            </div>
                            <div className="text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wide">Queued</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => handleBookmarkTile(e, "worklist-queued", "Work Lists - Queued", "Queued", { count: filteredWorkListData.reduce((sum, item) => sum + item.queued, 0) })}
                              className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors"
                              title={isBookmarked("worklist-queued") ? "Remove bookmark" : "Add bookmark"}
                            >
                              <Star className={`${isBookmarked("worklist-queued") ? "fill-blue-600 dark:fill-blue-400" : ""} text-blue-600 dark:text-blue-400`} size={14} />
                            </button>
                            {expandedWorkListTiles.has("Queued") ? (
                              <ChevronUp className="text-blue-600 dark:text-blue-400" size={16} />
                            ) : (
                              <ChevronDown className="text-blue-600 dark:text-blue-400" size={16} />
                            )}
                          </div>
                        </div>
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 text-center">
                          {filteredWorkListData.reduce((sum, item) => sum + item.queued, 0)}
                        </div>
                      </div>
                      {expandedWorkListTiles.has("Queued") && (
                        <div className="space-y-2">
                          {filteredWorkListData.map((item) => (
                            <div
                              key={item.type}
                              className="flex items-center justify-between py-2 px-3 bg-gradient-to-r from-zinc-50 to-zinc-100 dark:from-zinc-800 dark:to-zinc-800/50 rounded-lg hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-900/20 dark:hover:to-blue-900/10 cursor-pointer transition-all duration-200 hover:shadow-md border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
                              onClick={() => handleCellClick(item.type, "Queued", "worklist", item.queued)}
                            >
                              <span className="text-zinc-700 dark:text-zinc-300 text-sm font-semibold truncate mr-2">{item.type}</span>
                              <span className="text-lg font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">{item.queued}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Completed Tile */}
                  <div className="min-w-[180px]">
                    <div className="relative bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-700 rounded-lg p-3 hover:shadow-xl hover:border-green-400 dark:hover:border-green-500 transition-all duration-300 hover:scale-[1.02] overflow-hidden group">
                      {/* Left Accent Line */}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/5 bg-green-500 dark:bg-green-400 rounded-r-full transition-all duration-300 group-hover:h-full group-hover:top-0 group-hover:translate-y-0 group-hover:rounded-r-none" />

                      <div
                        className="mb-3 pb-3 border-b-2 border-zinc-200 dark:border-zinc-700 cursor-pointer"
                        onClick={() => toggleWorkListTile("Completed")}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-md flex items-center justify-center">
                              <CheckCircle2 className="text-green-600 dark:text-green-400" size={14} />
                            </div>
                            <div className="text-green-600 dark:text-green-400 text-xs font-bold uppercase tracking-wide">Completed</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => handleBookmarkTile(e, "worklist-completed", "Work Lists - Completed", "Completed", { count: filteredWorkListData.reduce((sum, item) => sum + item.completed, 0) })}
                              className="p-1 hover:bg-green-100 dark:hover:bg-green-900/30 rounded transition-colors"
                              title={isBookmarked("worklist-completed") ? "Remove bookmark" : "Add bookmark"}
                            >
                              <Star className={`${isBookmarked("worklist-completed") ? "fill-green-600 dark:fill-green-400" : ""} text-green-600 dark:text-green-400`} size={14} />
                            </button>
                            {expandedWorkListTiles.has("Completed") ? (
                              <ChevronUp className="text-green-600 dark:text-green-400" size={16} />
                            ) : (
                              <ChevronDown className="text-green-600 dark:text-green-400" size={16} />
                            )}
                          </div>
                        </div>
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400 text-center">
                          {filteredWorkListData.reduce((sum, item) => sum + item.completed, 0)}
                        </div>
                      </div>
                      {expandedWorkListTiles.has("Completed") && (
                        <div className="space-y-2">
                          {filteredWorkListData.map((item) => (
                            <div
                              key={item.type}
                              className="flex items-center justify-between py-2 px-3 bg-gradient-to-r from-zinc-50 to-zinc-100 dark:from-zinc-800 dark:to-zinc-800/50 rounded-lg hover:from-green-50 hover:to-green-100 dark:hover:from-green-900/20 dark:hover:to-green-900/10 cursor-pointer transition-all duration-200 hover:shadow-md border border-transparent hover:border-green-200 dark:hover:border-green-800"
                              onClick={() => handleCellClick(item.type, "Completed", "worklist", item.completed)}
                            >
                              <span className="text-zinc-700 dark:text-zinc-300 text-sm font-semibold truncate mr-2">{item.type}</span>
                              <span className="text-lg font-bold text-green-600 dark:text-green-400 flex-shrink-0">{item.completed}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {filteredWorkListData.length === 0 && (
                  <div className="text-center py-6 text-zinc-500 text-sm">
                    No work list types selected. Please adjust your filters.
                  </div>
                )}
              </div>

              {/* Work Operations Subsection - Tile Layout */}
              <div className="bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 rounded-xl p-4 overflow-x-auto shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-zinc-500 dark:bg-zinc-600 rounded-lg flex items-center justify-center">
                      <Warehouse className="text-white" size={16} />
                    </div>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">Work Operations</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={expandAllOperationsTiles}
                      className="px-2 py-1 text-xs bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
                    >
                      Expand All
                    </button>
                    <button
                      onClick={collapseAllOperationsTiles}
                      className="px-2 py-1 text-xs bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
                    >
                      Collapse All
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
                  {/* Warning Tile */}
                  <div>
                    <div className="relative bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-700 rounded-lg p-3 hover:shadow-xl hover:border-red-400 dark:hover:border-red-500 transition-all duration-300 hover:scale-[1.02] overflow-hidden group">
                      {/* Left Accent Line */}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/5 bg-red-500 dark:bg-red-400 rounded-r-full transition-all duration-300 group-hover:h-full group-hover:top-0 group-hover:translate-y-0 group-hover:rounded-r-none" />

                      <div
                        className="mb-3 pb-3 border-b-2 border-zinc-200 dark:border-zinc-700 cursor-pointer"
                        onClick={() => toggleOperationsTile("Warning")}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            <div className="w-6 h-6 bg-red-100 dark:bg-red-900/30 rounded-md flex items-center justify-center">
                              <AlertCircle className="text-red-600 dark:text-red-400" size={14} />
                            </div>
                            <div className="text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wide">Warning</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => handleBookmarkTile(e, "operations-warning", "Operations - Warning", "Warning", { count: filteredWorkOperationsData.reduce((sum, item) => sum + item.warning, 0) })}
                              className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                              title={isBookmarked("operations-warning") ? "Remove bookmark" : "Add bookmark"}
                            >
                              <Star className={`${isBookmarked("operations-warning") ? "fill-red-600 dark:fill-red-400" : ""} text-red-600 dark:text-red-400`} size={14} />
                            </button>
                            {expandedOperationsTiles.has("Warning") ? (
                              <ChevronUp className="text-red-600 dark:text-red-400" size={16} />
                            ) : (
                              <ChevronDown className="text-red-600 dark:text-red-400" size={16} />
                            )}
                          </div>
                        </div>
                        <div className="text-3xl font-bold text-red-600 dark:text-red-400 text-center">
                          {filteredWorkOperationsData.reduce((sum, item) => sum + item.warning, 0)}
                        </div>
                      </div>
                      {expandedOperationsTiles.has("Warning") && (
                        <div className="space-y-2">
                          {filteredWorkOperationsData.map((item) => (
                            <div
                              key={item.type}
                              className="flex items-center justify-between py-2 px-3 bg-gradient-to-r from-zinc-50 to-zinc-100 dark:from-zinc-800 dark:to-zinc-800/50 rounded-lg hover:from-red-50 hover:to-red-100 dark:hover:from-red-900/20 dark:hover:to-red-900/10 cursor-pointer transition-all duration-200 hover:shadow-md border border-transparent hover:border-red-200 dark:hover:border-red-800"
                              onClick={() => handleCellClick(item.type, "Warning", "operations", item.warning)}
                            >
                              <span className="text-zinc-700 dark:text-zinc-300 text-sm font-semibold truncate mr-2">{item.type}</span>
                              <span className="text-lg font-bold text-red-600 dark:text-red-400 flex-shrink-0">{item.warning}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* In Progress Tile */}
                  <div>
                    <div className="relative bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-700 rounded-lg p-3 hover:shadow-xl hover:border-[#0d9488] dark:hover:border-[#50e080] transition-all duration-300 hover:scale-[1.02] overflow-hidden group">
                      {/* Left Accent Line */}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/5 bg-[#0d9488] dark:bg-[#50e080] rounded-r-full transition-all duration-300 group-hover:h-full group-hover:top-0 group-hover:translate-y-0 group-hover:rounded-r-none" />

                      <div
                        className="mb-3 pb-3 border-b-2 border-zinc-200 dark:border-zinc-700 cursor-pointer"
                        onClick={() => toggleOperationsTile("In Progress")}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            <div className="w-6 h-6 bg-[#0d9488]/10 dark:bg-[#50e080]/10 rounded-md flex items-center justify-center">
                              <Activity className="text-[#0d9488] dark:text-[#50e080]" size={14} />
                            </div>
                            <div className="text-[#0d9488] dark:text-[#50e080] text-xs font-bold uppercase tracking-wide">In Progress</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => handleBookmarkTile(e, "operations-inprogress", "Operations - In Progress", "In Progress", { count: filteredWorkOperationsData.reduce((sum, item) => sum + item.inProgress, 0) })}
                              className="p-1 hover:bg-[#0d9488]/10 dark:hover:bg-[#50e080]/10 rounded transition-colors"
                              title={isBookmarked("operations-inprogress") ? "Remove bookmark" : "Add bookmark"}
                            >
                              <Star className={`${isBookmarked("operations-inprogress") ? "fill-[#0d9488] dark:fill-[#50e080]" : ""} text-[#0d9488] dark:text-[#50e080]`} size={14} />
                            </button>
                            {expandedOperationsTiles.has("In Progress") ? (
                              <ChevronUp className="text-[#0d9488] dark:text-[#50e080]" size={16} />
                            ) : (
                              <ChevronDown className="text-[#0d9488] dark:text-[#50e080]" size={16} />
                            )}
                          </div>
                        </div>
                        <div className="text-3xl font-bold text-[#0d9488] dark:text-[#50e080] text-center">
                          {filteredWorkOperationsData.reduce((sum, item) => sum + item.inProgress, 0)}
                        </div>
                      </div>
                      {expandedOperationsTiles.has("In Progress") && (
                        <div className="space-y-2">
                          {filteredWorkOperationsData.map((item) => (
                            <div
                              key={item.type}
                              className="flex items-center justify-between py-2 px-3 bg-gradient-to-r from-zinc-50 to-zinc-100 dark:from-zinc-800 dark:to-zinc-800/50 rounded-lg hover:from-teal-50 hover:to-teal-100 dark:hover:from-teal-900/20 dark:hover:to-teal-900/10 cursor-pointer transition-all duration-200 hover:shadow-md border border-transparent hover:border-teal-200 dark:hover:border-teal-800"
                              onClick={() => handleCellClick(item.type, "In Progress", "operations", item.inProgress)}
                            >
                              <span className="text-zinc-700 dark:text-zinc-300 text-sm font-semibold truncate mr-2">{item.type}</span>
                              <span className="text-lg font-bold text-[#0d9488] dark:text-[#50e080] flex-shrink-0">{item.inProgress}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Queued Tile */}
                  <div className="min-w-[180px]">
                    <div className="relative bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-700 rounded-lg p-3 hover:shadow-xl hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 hover:scale-[1.02] overflow-hidden group">
                      {/* Left Accent Line */}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/5 bg-blue-500 dark:bg-blue-400 rounded-r-full transition-all duration-300 group-hover:h-full group-hover:top-0 group-hover:translate-y-0 group-hover:rounded-r-none" />

                      <div
                        className="mb-3 pb-3 border-b-2 border-zinc-200 dark:border-zinc-700 cursor-pointer"
                        onClick={() => toggleOperationsTile("Queued")}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-md flex items-center justify-center">
                              <Clock className="text-blue-600 dark:text-blue-400" size={14} />
                            </div>
                            <div className="text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wide">Queued</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => handleBookmarkTile(e, "operations-queued", "Operations - Queued", "Queued", { count: filteredWorkOperationsData.reduce((sum, item) => sum + item.queued, 0) })}
                              className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors"
                              title={isBookmarked("operations-queued") ? "Remove bookmark" : "Add bookmark"}
                            >
                              <Star className={`${isBookmarked("operations-queued") ? "fill-blue-600 dark:fill-blue-400" : ""} text-blue-600 dark:text-blue-400`} size={14} />
                            </button>
                            {expandedOperationsTiles.has("Queued") ? (
                              <ChevronUp className="text-blue-600 dark:text-blue-400" size={16} />
                            ) : (
                              <ChevronDown className="text-blue-600 dark:text-blue-400" size={16} />
                            )}
                          </div>
                        </div>
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 text-center">
                          {filteredWorkOperationsData.reduce((sum, item) => sum + item.queued, 0)}
                        </div>
                      </div>
                      {expandedOperationsTiles.has("Queued") && (
                        <div className="space-y-2">
                          {filteredWorkOperationsData.map((item) => (
                            <div
                              key={item.type}
                              className="flex items-center justify-between py-2 px-3 bg-gradient-to-r from-zinc-50 to-zinc-100 dark:from-zinc-800 dark:to-zinc-800/50 rounded-lg hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-900/20 dark:hover:to-blue-900/10 cursor-pointer transition-all duration-200 hover:shadow-md border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
                              onClick={() => handleCellClick(item.type, "Queued", "operations", item.queued)}
                            >
                              <span className="text-zinc-700 dark:text-zinc-300 text-sm font-semibold truncate mr-2">{item.type}</span>
                              <span className="text-lg font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">{item.queued}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Completed Tile */}
                  <div className="min-w-[180px]">
                    <div className="relative bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-700 rounded-lg p-3 hover:shadow-xl hover:border-green-400 dark:hover:border-green-500 transition-all duration-300 hover:scale-[1.02] overflow-hidden group">
                      {/* Left Accent Line */}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/5 bg-green-500 dark:bg-green-400 rounded-r-full transition-all duration-300 group-hover:h-full group-hover:top-0 group-hover:translate-y-0 group-hover:rounded-r-none" />

                      <div
                        className="mb-3 pb-3 border-b-2 border-zinc-200 dark:border-zinc-700 cursor-pointer"
                        onClick={() => toggleOperationsTile("Completed")}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-md flex items-center justify-center">
                              <CheckCircle2 className="text-green-600 dark:text-green-400" size={14} />
                            </div>
                            <div className="text-green-600 dark:text-green-400 text-xs font-bold uppercase tracking-wide">Completed</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => handleBookmarkTile(e, "operations-completed", "Operations - Completed", "Completed", { count: filteredWorkOperationsData.reduce((sum, item) => sum + item.completed, 0) })}
                              className="p-1 hover:bg-green-100 dark:hover:bg-green-900/30 rounded transition-colors"
                              title={isBookmarked("operations-completed") ? "Remove bookmark" : "Add bookmark"}
                            >
                              <Star className={`${isBookmarked("operations-completed") ? "fill-green-600 dark:fill-green-400" : ""} text-green-600 dark:text-green-400`} size={14} />
                            </button>
                            {expandedOperationsTiles.has("Completed") ? (
                              <ChevronUp className="text-green-600 dark:text-green-400" size={16} />
                            ) : (
                              <ChevronDown className="text-green-600 dark:text-green-400" size={16} />
                            )}
                          </div>
                        </div>
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400 text-center">
                          {filteredWorkOperationsData.reduce((sum, item) => sum + item.completed, 0)}
                        </div>
                      </div>
                      {expandedOperationsTiles.has("Completed") && (
                        <div className="space-y-2">
                          {filteredWorkOperationsData.map((item) => (
                            <div
                              key={item.type}
                              className="flex items-center justify-between py-2 px-3 bg-gradient-to-r from-zinc-50 to-zinc-100 dark:from-zinc-800 dark:to-zinc-800/50 rounded-lg hover:from-green-50 hover:to-green-100 dark:hover:from-green-900/20 dark:hover:to-green-900/10 cursor-pointer transition-all duration-200 hover:shadow-md border border-transparent hover:border-green-200 dark:hover:border-green-800"
                              onClick={() => handleCellClick(item.type, "Completed", "operations", item.completed)}
                            >
                              <span className="text-zinc-700 dark:text-zinc-300 text-sm font-semibold truncate mr-2">{item.type}</span>
                              <span className="text-lg font-bold text-green-600 dark:text-green-400 flex-shrink-0">{item.completed}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {filteredWorkOperationsData.length === 0 && (
                  <div className="text-center py-6 text-zinc-500 text-sm">
                    No work operations types selected. Please adjust your filters.
                  </div>
                )}
              </div>
            </div>

            {/* Work List Metrics */}
            <WorkListMetrics />
            </>
          )}

          {/* Graph View */}
          {workListViewMode === 'graph' && (
            <div className="space-y-8">
              {/* Consolidated Vertical Bar Charts - Work Lists and Work Operations Side by Side */}
              <div className="grid grid-cols-1 xl:grid-cols-[1fr_auto_1fr] gap-6">
                {/* Work Lists Chart */}
                <div className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-700 rounded-lg p-5">
                  <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">Work Lists</h4>
                  <div className="h-96">
                    {filteredWorkListData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart 
                          data={workListChartData} 
                          margin={{ top: 5, right: 30, left: 10, bottom: 25 }}
                          id="work-list-chart"
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" key="grid" />
                          <XAxis 
                            type="category"
                            dataKey="status"
                            stroke="#71717a"
                            tick={{ fill: '#a1a1aa', fontSize: 11 }}
                            angle={-45}
                            textAnchor="end"
                            key="xaxis"
                          />
                          <YAxis 
                            type="number"
                            stroke="#71717a"
                            tick={{ fill: '#a1a1aa', fontSize: 11 }}
                            key="yaxis"
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#18181b', 
                              border: '1px solid #3f3f46',
                              borderRadius: '8px',
                              color: '#ffffff'
                            }}
                            labelStyle={{ color: '#a1a1aa' }}
                            key="tooltip"
                          />
                          {Array.from(selectedWorkListTypes).map(type => (
                            <Bar 
                              key={type}
                              dataKey={type} 
                              fill={typeColors[type]} 
                              name={type}
                            />
                          ))}
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full text-zinc-500 text-sm">
                        No data
                      </div>
                    )}
                  </div>
                </div>

                {/* Shared Legend */}
                <div className="flex items-center justify-center">
                  <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 rounded-lg p-4 h-fit">
                    <h5 className="text-xs font-semibold text-zinc-900 dark:text-white mb-3 text-center">Types</h5>
                    <div className="space-y-2">
                      {Array.from(selectedWorkListTypes).map(type => (
                        <div key={type} className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded" 
                            style={{ backgroundColor: typeColors[type] }}
                          />
                          <span className="text-xs text-zinc-700 dark:text-zinc-300 whitespace-nowrap">{type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Work Operations Chart */}
                <div className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-700 rounded-lg p-5">
                  <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">Work Operations</h4>
                  <div className="h-96">
                    {filteredWorkOperationsData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart 
                          data={workOperationsChartData} 
                          margin={{ top: 5, right: 30, left: 10, bottom: 25 }}
                          id="work-operations-chart"
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" key="grid" />
                          <XAxis 
                            type="category"
                            dataKey="status"
                            stroke="#71717a"
                            tick={{ fill: '#a1a1aa', fontSize: 11 }}
                            angle={-45}
                            textAnchor="end"
                            key="xaxis"
                          />
                          <YAxis 
                            type="number"
                            stroke="#71717a"
                            tick={{ fill: '#a1a1aa', fontSize: 11 }}
                            key="yaxis"
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#18181b', 
                              border: '1px solid #3f3f46',
                              borderRadius: '8px',
                              color: '#ffffff'
                            }}
                            labelStyle={{ color: '#a1a1aa' }}
                            key="tooltip"
                          />
                          {Array.from(selectedWorkListTypes).map(type => (
                            <Bar 
                              key={type}
                              dataKey={type} 
                              fill={typeColors[type]} 
                              name={type}
                            />
                          ))}
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full text-zinc-500 text-sm">
                        No data
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Metrics Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Pick Accuracy Bar Chart */}
                <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 rounded-lg p-5">
                  <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">Pick Accuracy</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={[
                        { type: 'Pick', value: 99.2 },
                        { type: 'Replenishment', value: 98.1 },
                        { type: 'Cycle Count', value: 97.8 },
                        { type: 'Inspection', value: 98.9 }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                        <XAxis 
                          dataKey="type" 
                          stroke="#71717a"
                          tick={{ fill: '#a1a1aa', fontSize: 11 }}
                          angle={-15}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis 
                          stroke="#71717a"
                          tick={{ fill: '#a1a1aa' }}
                          domain={[95, 100]}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#18181b', 
                            border: '1px solid #3f3f46',
                            borderRadius: '8px'
                          }}
                          formatter={(value: any) => `${value}%`}
                        />
                        <Bar dataKey="value" fill="#059669" name="Accuracy %" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Short Picks Bar Chart */}
                <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 rounded-lg p-5">
                  <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">Short Picks</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={[
                        { type: 'Pick', value: 0.8 },
                        { type: 'Replenishment', value: 1.9 },
                        { type: 'Cycle Count', value: 0.0 },
                        { type: 'Inspection', value: 2.1 }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                        <XAxis 
                          dataKey="type" 
                          stroke="#71717a"
                          tick={{ fill: '#a1a1aa', fontSize: 11 }}
                          angle={-15}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis 
                          stroke="#71717a"
                          tick={{ fill: '#a1a1aa' }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#18181b', 
                            border: '1px solid #3f3f46',
                            borderRadius: '8px'
                          }}
                          formatter={(value: any) => `${value}%`}
                        />
                        <Bar dataKey="value" fill="#b45309" name="Short Pick %" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Picks Per Hour Bar Chart */}
                <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 rounded-lg p-5">
                  <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">Picks Per Hour</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={[
                        { type: 'Pick', value: 156 },
                        { type: 'Replenishment', value: 128 },
                        { type: 'Cycle Count', value: 95 },
                        { type: 'Inspection', value: 118 }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                        <XAxis 
                          dataKey="type" 
                          stroke="#71717a"
                          tick={{ fill: '#a1a1aa', fontSize: 11 }}
                          angle={-15}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis 
                          stroke="#71717a"
                          tick={{ fill: '#a1a1aa' }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#18181b', 
                            border: '1px solid #3f3f46',
                            borderRadius: '8px'
                          }}
                        />
                        <Bar dataKey="value" fill="#4f46e5" name="Picks/Hour" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Task Completion Pie Chart */}
                <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 rounded-lg p-5">
                  <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">Task Completion</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Pick', value: 97.1 },
                            { name: 'Replenishment', value: 95.8 },
                            { name: 'Cycle Count', value: 96.2 },
                            { name: 'Inspection', value: 95.5 }
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          <Cell key="pick" fill="#059669" />
                          <Cell key="replenishment" fill="#4f46e5" />
                          <Cell key="cycle-count" fill="#8b5cf6" />
                          <Cell key="inspection" fill="#b45309" />
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#18181b', 
                            border: '1px solid #3f3f46',
                            borderRadius: '8px'
                          }}
                          formatter={(value: any) => `${value}%`}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Average Cycle Time Bar Chart */}
                <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 rounded-lg p-5">
                  <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">Average Cycle Time</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={[
                        { type: 'Pick', value: 24 },
                        { type: 'Replenishment', value: 18 },
                        { type: 'Cycle Count', value: 15 },
                        { type: 'Inspection', value: 32 }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                        <XAxis 
                          dataKey="type" 
                          stroke="#71717a"
                          tick={{ fill: '#a1a1aa', fontSize: 11 }}
                          angle={-15}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis 
                          stroke="#71717a"
                          tick={{ fill: '#a1a1aa' }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#18181b', 
                            border: '1px solid #3f3f46',
                            borderRadius: '8px'
                          }}
                          formatter={(value: any) => `${value}m`}
                        />
                        <Bar dataKey="value" fill="#ec4899" name="Cycle Time (min)" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Order Completion Rate Bar Chart */}
                <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 rounded-lg p-5">
                  <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">Order Completion Rate</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={[
                        { type: 'Pick', value: 95.8 },
                        { type: 'Replenishment', value: 93.5 },
                        { type: 'Cycle Count', value: 92.7 },
                        { type: 'Inspection', value: 94.1 }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                        <XAxis 
                          dataKey="type" 
                          stroke="#71717a"
                          tick={{ fill: '#a1a1aa', fontSize: 11 }}
                          angle={-15}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis 
                          stroke="#71717a"
                          tick={{ fill: '#a1a1aa' }}
                          domain={[90, 100]}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#18181b', 
                            border: '1px solid #3f3f46',
                            borderRadius: '8px'
                          }}
                          formatter={(value: any) => `${value}%`}
                        />
                        <Bar dataKey="value" fill="#14b8a6" name="Completion %" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}
          </div>
          )}
        </div>
      </div>
      )}

      {/* Storage */}
      {selectedSections.has("Storage") && (
      <div className="mb-8">
        <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl">
          {/* Section Header */}
          <div 
            className="flex items-center justify-between p-6 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
            onClick={() => toggleSectionExpansion("Storage")}
          >
            <div className="flex items-center gap-2">
              <Warehouse className="text-[#0d9488] dark:text-[#50e080]" size={20} />
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">Storage</h3>
            </div>
            <button className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              {expandedSections.has("Storage") ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </button>
          </div>

          {/* Section Content */}
          {expandedSections.has("Storage") && (
          <div className="p-6 pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {[
            { type: "Racks", capacity: 85, available: 156, total: 1000, status: "warning" },
            { type: "Containers", capacity: 62, available: 342, total: 900, status: "good" },
            { type: "Pallets", capacity: 94, available: 45, total: 750, status: "critical" },
            { type: "Pods", capacity: 48, available: 520, total: 1000, status: "good" },
          ].map((storage) => (
            <div
              key={storage.type}
              className="bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl p-6 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-zinc-900 dark:text-white">{storage.type}</h4>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleBookmarkTile(e, `storage-${storage.type.toLowerCase()}`, `Storage - ${storage.type}`, storage.status, { capacity: storage.capacity, available: storage.available, total: storage.total })}
                    className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded transition-colors"
                    title={isBookmarked(`storage-${storage.type.toLowerCase()}`) ? "Remove bookmark" : "Add bookmark"}
                  >
                    <Star className={`${isBookmarked(`storage-${storage.type.toLowerCase()}`) ? storage.status === "critical" ? "fill-red-500" : storage.status === "warning" ? "fill-orange-500" : "fill-[#0d9488] dark:fill-[#50e080]" : ""} ${storage.status === "critical" ? "text-red-500" : storage.status === "warning" ? "text-orange-500" : "text-[#0d9488] dark:text-[#50e080]"}`} size={14} />
                  </button>
                  {storage.status === "critical" && <AlertCircle size={20} className="text-red-500" />}
                  {storage.status === "warning" && <AlertCircle size={20} className="text-orange-500" />}
                  {storage.status === "good" && <CheckCircle2 size={20} className="text-[#0d9488] dark:text-[#50e080]" />}
                </div>
              </div>
              <div className="mb-3">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-zinc-600 dark:text-zinc-400">Capacity</span>
                  <span className={`font-medium ${
                    storage.capacity >= 90 ? "text-red-500" : 
                    storage.capacity >= 80 ? "text-orange-500" : 
                    "text-[#0d9488] dark:text-[#50e080]"
                  }`}>{storage.capacity}%</span>
                </div>
                <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      storage.capacity >= 90 ? "bg-red-500" : 
                      storage.capacity >= 80 ? "bg-orange-500" : 
                      "bg-[#0d9488] dark:bg-[#50e080]"
                    }`}
                    style={{ width: `${storage.capacity}%` }}
                  />
                </div>
              </div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                <div>{storage.available} / {storage.total} locations</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* Storage Activity - Picks and Replenishment */}
      {selectedSections.has("Storage") && (
      <div className="mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Locations Picked by Type */}
          <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">Locations Picked by Type</h4>
              <button
                onClick={(e) => handleBookmarkTile(e, "storage-locations-picked", "Storage - Locations Picked by Type", "summary", {
                  racks: { today: 342, thisWeek: 2156, trend: "+12%" },
                  containers: { today: 189, thisWeek: 1423, trend: "+8%" },
                  pallets: { today: 267, thisWeek: 1890, trend: "+15%" },
                  pods: { today: 421, thisWeek: 3012, trend: "+6%" }
                })}
                className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded transition-colors"
                title={isBookmarked("storage-locations-picked") ? "Remove bookmark" : "Add bookmark"}
              >
                <Star className={`${isBookmarked("storage-locations-picked") ? "fill-[#0d9488] dark:fill-[#50e080]" : ""} text-[#0d9488] dark:text-[#50e080]`} size={14} />
              </button>
            </div>
            <div className="space-y-3">
              {[
                { type: "Racks", today: 342, thisWeek: 2156, trend: "+12%" },
                { type: "Containers", today: 189, thisWeek: 1423, trend: "+8%" },
                { type: "Pallets", today: 267, thisWeek: 1890, trend: "+15%" },
                { type: "Pods", today: 421, thisWeek: 3012, trend: "+6%" },
              ].map((pick) => (
                <div
                  key={pick.type}
                  className="flex items-center justify-between p-3 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#0d9488]/10 dark:bg-[#50e080]/10 rounded-lg flex items-center justify-center">
                      <Package size={18} className="text-[#0d9488] dark:text-[#50e080]" />
                    </div>
                    <div>
                      <div className="text-zinc-900 dark:text-white font-medium text-sm">{pick.type}</div>
                      <div className="text-zinc-600 dark:text-zinc-400 text-xs">This week: {pick.thisWeek.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-zinc-900 dark:text-white text-lg font-bold">{pick.today}</div>
                    <div className="text-[#0d9488] dark:text-[#50e080] text-xs font-medium">{pick.trend}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Locations Replenished by Type */}
          <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">Locations Replenished by Type</h4>
              <button
                onClick={(e) => handleBookmarkTile(e, "storage-locations-replenished", "Storage - Locations Replenished by Type", "summary", {
                  racks: { today: 156, thisWeek: 1234, trend: "+10%" },
                  containers: { today: 203, thisWeek: 1567, trend: "+14%" },
                  pallets: { today: 89, thisWeek: 678, trend: "+5%" },
                  pods: { today: 312, thisWeek: 2345, trend: "+18%" }
                })}
                className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded transition-colors"
                title={isBookmarked("storage-locations-replenished") ? "Remove bookmark" : "Add bookmark"}
              >
                <Star className={`${isBookmarked("storage-locations-replenished") ? "fill-blue-500" : ""} text-blue-500`} size={14} />
              </button>
            </div>
            <div className="space-y-3">
              {[
                { type: "Racks", today: 156, thisWeek: 1234, trend: "+10%" },
                { type: "Containers", today: 203, thisWeek: 1567, trend: "+14%" },
                { type: "Pallets", today: 89, thisWeek: 678, trend: "+5%" },
                { type: "Pods", today: 312, thisWeek: 2345, trend: "+18%" },
              ].map((replen) => (
                <div
                  key={replen.type}
                  className="flex items-center justify-between p-3 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <TrendingUp size={18} className="text-blue-500" />
                    </div>
                    <div>
                      <div className="text-zinc-900 dark:text-white font-medium text-sm">{replen.type}</div>
                      <div className="text-zinc-600 dark:text-zinc-400 text-xs">This week: {replen.thisWeek.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-zinc-900 dark:text-white text-lg font-bold">{replen.today}</div>
                    <div className="text-blue-600 dark:text-blue-400 text-xs font-medium">{replen.trend}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
          </div>
          )}
        </div>
      </div>
      )}

      {/* Automation Performance */}
      {selectedSections.has("Automation Performance") && (
      <div className="mb-8">
        <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl">
          {/* Section Header */}
          <div 
            className="flex items-center justify-between p-6 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
            onClick={() => toggleSectionExpansion("Automation Performance")}
          >
            <div className="flex items-center gap-2">
              <Monitor className="text-[#0d9488] dark:text-[#50e080]" size={20} />
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">Automation Performance</h3>
            </div>
            <button className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              {expandedSections.has("Automation Performance") ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </button>
          </div>

          {/* Section Content */}
          {expandedSections.has("Automation Performance") && (
          <div className="p-6 pt-0">
            {/* Automation Uptime */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">Automation Uptime</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { name: "Sortation", uptime: 98.5, status: "good" },
                  { name: "Picking Robots", uptime: 96.2, status: "good" },
                  { name: "Conveyors", uptime: 99.1, status: "good" },
                  { name: "AS/RS", uptime: 87.3, status: "warning" },
                ].map((auto) => (
                  <div
                    key={auto.name}
                    className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-zinc-600 dark:text-zinc-400 text-sm font-medium">{auto.name}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleBookmarkTile(e, `automation-uptime-${auto.name.toLowerCase().replace(/[\/\s]/g, '-')}`, `Automation Uptime - ${auto.name}`, auto.status, { uptime: auto.uptime })}
                          className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded transition-colors"
                          title={isBookmarked(`automation-uptime-${auto.name.toLowerCase().replace(/[\/\s]/g, '-')}`) ? "Remove bookmark" : "Add bookmark"}
                        >
                          <Star className={`${isBookmarked(`automation-uptime-${auto.name.toLowerCase().replace(/[\/\s]/g, '-')}`) ? auto.status === "warning" ? "fill-orange-500" : "fill-[#0d9488] dark:fill-[#50e080]" : ""} ${auto.status === "warning" ? "text-orange-500" : "text-[#0d9488] dark:text-[#50e080]"}`} size={14} />
                        </button>
                        {auto.status === "good" && <CheckCircle2 size={16} className="text-[#0d9488] dark:text-[#50e080]" />}
                        {auto.status === "warning" && <AlertCircle size={16} className="text-orange-500" />}
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">{auto.uptime}%</div>
                    <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          auto.uptime >= 95 ? "bg-[#0d9488] dark:bg-[#50e080]" : "bg-orange-500"
                        }`}
                        style={{ width: `${auto.uptime}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Throughput per Automation Type */}
            <div>
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">Throughput per Automation Type</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { type: "Sortation", unitsPerHour: 2847, trend: "+8%" },
                  { type: "Picking Robots", unitsPerHour: 1523, trend: "+12%" },
                  { type: "Conveyors", unitsPerHour: 3421, trend: "+5%" },
                  { type: "AS/RS", unitsPerHour: 892, trend: "-3%" },
                ].map((auto) => (
                  <div
                    key={auto.type}
                    className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-zinc-600 dark:text-zinc-400 text-xs font-medium">{auto.type}</div>
                      <button
                        onClick={(e) => handleBookmarkTile(e, `automation-throughput-${auto.type.toLowerCase().replace(/[\/\s]/g, '-')}`, `Automation Throughput - ${auto.type}`, auto.trend.startsWith('+') ? 'positive' : 'negative', { unitsPerHour: auto.unitsPerHour, trend: auto.trend })}
                        className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded transition-colors"
                        title={isBookmarked(`automation-throughput-${auto.type.toLowerCase().replace(/[\/\s]/g, '-')}`) ? "Remove bookmark" : "Add bookmark"}
                      >
                        <Star className={`${isBookmarked(`automation-throughput-${auto.type.toLowerCase().replace(/[\/\s]/g, '-')}`) ? auto.trend.startsWith('+') ? "fill-[#0d9488] dark:fill-[#50e080]" : "fill-red-500" : ""} ${auto.trend.startsWith('+') ? "text-[#0d9488] dark:text-[#50e080]" : "text-red-500"}`} size={14} />
                      </button>
                    </div>
                    <div className="text-2xl font-bold text-zinc-900 dark:text-white">{auto.unitsPerHour.toLocaleString()}</div>
                    <div className={`text-xs mt-1 ${
                      auto.trend.startsWith('+') ? 'text-[#0d9488] dark:text-[#50e080]' : 'text-red-500'
                    }`}>
                      {auto.trend} units/hr
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
      )}



      {/* Bottom Grid - Workstation Activity & Scan Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workstation Activity */}
        {selectedSections.has("Workstation Activity") && (
        <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl">
          {/* Section Header */}
          <div 
            className="flex items-center justify-between p-6 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
            onClick={() => toggleSectionExpansion("Workstation Activity")}
          >
            <div className="flex items-center gap-2">
              <Monitor className="text-[#0d9488] dark:text-[#50e080]" size={20} />
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">Workstation Activity</h3>
            </div>
            <button className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              {expandedSections.has("Workstation Activity") ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </button>
          </div>

          {/* Section Content */}
          {expandedSections.has("Workstation Activity") && (
          <div className="px-6 pb-6">
          <div className="space-y-3">
            {[
              { id: "WS-001", user: "John Smith", status: "active", task: "Pick #1247", duration: "12m" },
              { id: "WS-002", user: "Sarah Johnson", status: "active", task: "Replen #856", duration: "8m" },
              { id: "WS-003", user: "Mike Davis", status: "idle", task: "—", duration: "3m" },
              { id: "WS-004", user: "Emily Chen", status: "active", task: "Inspection #423", duration: "15m" },
              { id: "WS-005", user: "Robert Lee", status: "idle", task: "—", duration: "1m" },
            ].map((workstation) => (
              <div
                key={workstation.id}
                className="flex items-center justify-between p-3 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    workstation.status === "active" ? "bg-[#0d9488] dark:bg-[#50e080]" : "bg-zinc-400 dark:bg-zinc-600"
                  }`} />
                  <div>
                    <div className="text-zinc-900 dark:text-white font-medium text-sm">{workstation.id}</div>
                    <div className="text-zinc-600 dark:text-zinc-400 text-xs">{workstation.user}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="text-zinc-900 dark:text-white text-sm">{workstation.task}</div>
                    <div className="text-zinc-600 dark:text-zinc-400 text-xs flex items-center gap-1 justify-end">
                      <Clock size={12} />
                      {workstation.duration}
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleBookmarkTile(e, `workstation-${workstation.id.toLowerCase()}`, `Workstation - ${workstation.id}`, workstation.status, { user: workstation.user, task: workstation.task, duration: workstation.duration })}
                    className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded transition-colors"
                    title={isBookmarked(`workstation-${workstation.id.toLowerCase()}`) ? "Remove bookmark" : "Add bookmark"}
                  >
                    <Star className={`${isBookmarked(`workstation-${workstation.id.toLowerCase()}`) ? workstation.status === "active" ? "fill-[#0d9488] dark:fill-[#50e080]" : "fill-zinc-400" : ""} ${workstation.status === "active" ? "text-[#0d9488] dark:text-[#50e080]" : "text-zinc-400 dark:text-zinc-600"}`} size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          </div>
          )}
        </div>
        )}

        {/* Scan Data */}
        {selectedSections.has("Scan Data") && (
        <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl">
          {/* Section Header */}
          <div 
            className="flex items-center justify-between p-6 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
            onClick={() => toggleSectionExpansion("Scan Data")}
          >
            <div className="flex items-center gap-2">
              <ScanLine className="text-[#0d9488] dark:text-[#50e080]" size={20} />
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">Scan Data</h3>
            </div>
            <button className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              {expandedSections.has("Scan Data") ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </button>
          </div>

          {/* Section Content */}
          {expandedSections.has("Scan Data") && (
          <div className="px-6 pb-6">
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-zinc-600 dark:text-zinc-400 text-sm">Total Scans</div>
                  <button
                    onClick={(e) => handleBookmarkTile(e, "scan-total", "Scan Data - Total Scans", "positive", { total: 2847, trend: "+12% today" })}
                    className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded transition-colors"
                    title={isBookmarked("scan-total") ? "Remove bookmark" : "Add bookmark"}
                  >
                    <Star className={`${isBookmarked("scan-total") ? "fill-[#0d9488] dark:fill-[#50e080]" : ""} text-[#0d9488] dark:text-[#50e080]`} size={14} />
                  </button>
                </div>
                <div className="text-2xl font-bold text-zinc-900 dark:text-white">2,847</div>
                <div className="text-[#0d9488] dark:text-[#50e080] text-xs mt-1">+12% today</div>
              </div>
              <div className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-zinc-600 dark:text-zinc-400 text-sm">Scan Rate</div>
                  <button
                    onClick={(e) => handleBookmarkTile(e, "scan-rate", "Scan Data - Scan Rate", "positive", { rate: "156/hr", trend: "+8% today" })}
                    className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded transition-colors"
                    title={isBookmarked("scan-rate") ? "Remove bookmark" : "Add bookmark"}
                  >
                    <Star className={`${isBookmarked("scan-rate") ? "fill-[#0d9488] dark:fill-[#50e080]" : ""} text-[#0d9488] dark:text-[#50e080]`} size={14} />
                  </button>
                </div>
                <div className="text-2xl font-bold text-zinc-900 dark:text-white">156/hr</div>
                <div className="text-[#0d9488] dark:text-[#50e080] text-xs mt-1">+8% today</div>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">Recent Scans</div>
            {[
              { item: "SKU-78934", type: "Pick", time: "2s ago", user: "WS-001" },
              { item: "SKU-45621", type: "Replen", time: "5s ago", user: "WS-002" },
              { item: "SKU-89012", type: "Inspection", time: "8s ago", user: "WS-004" },
              { item: "SKU-23456", type: "Pick", time: "12s ago", user: "WS-001" },
              { item: "SKU-67890", type: "Pick", time: "15s ago", user: "WS-003" },
            ].map((scan, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 border-b border-zinc-300 dark:border-zinc-700 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <ScanLine size={16} className="text-[#0d9488] dark:text-[#50e080]" />
                  <div>
                    <div className="text-zinc-900 dark:text-white text-sm font-medium">{scan.item}</div>
                    <div className="text-zinc-600 dark:text-zinc-400 text-xs">{scan.type}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-zinc-600 dark:text-zinc-400 text-xs">{scan.user}</div>
                  <div className="text-zinc-500 dark:text-zinc-500 text-xs">{scan.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
          )}
        </div>
        )}
      </div>

      {/* Detail Panel */}
      {showDetailPanel && (
        <WorkListDetailPanel
          isOpen={showDetailPanel}
          items={detailItems}
          type={detailPanelType}
          status={detailPanelStatus}
          section={detailPanelSection}
          count={detailPanelCount}
          onClose={() => setShowDetailPanel(false)}
        />
      )}
    </div>
  );
}