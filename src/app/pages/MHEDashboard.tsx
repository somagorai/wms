import { Activity, CheckCircle2, XCircle, Package, TrendingUp, Boxes, Scan, Radio, Box, ChevronUp, ChevronDown, Filter, X, Check, LayoutGrid, BarChart3, ChevronRight, Home, Star, Scale, Printer, Ruler, Bot, Combine, Wind, Package2, Maximize2, Minimize2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { MHEVisualView } from "../components/MHEVisualView";
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
  const [viewMode, setViewMode] = useState<'data' | 'visual'>('data');
  const [selectedSections, setSelectedSections] = useState<Set<string>>(new Set(["DWS", "SubSystems", "Sorters", "Robots"]));
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["DWS", "SubSystems", "Sorters", "Robots"]));
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [sectionSearch, setSectionSearch] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<'section' | null>(null);
  const [showFilterTooltip, setShowFilterTooltip] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'up' | 'down'>('all');
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
    return status === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
  };

  const getStatusBgColor = (status: string) => {
    return status === 'up'
      ? 'border-green-200 dark:border-green-800'
      : 'border-red-200 dark:border-red-800';
  };

  const getOEEColor = (oee: number) => {
    if (oee >= 90) return 'text-green-600 dark:text-green-400';
    if (oee >= 75) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getOEEBgColor = (oee: number) => {
    if (oee >= 90) return 'bg-green-100 dark:bg-green-900/20';
    if (oee >= 75) return 'bg-yellow-100 dark:bg-yellow-900/20';
    return 'bg-red-100 dark:bg-red-900/20';
  };

  const filteredSectionOptions = allSections.filter(section =>
    section.toLowerCase().includes(sectionSearch.toLowerCase())
  );

  return (
    <div className="p-8 min-h-screen">
      {/* Breadcrumb */}
      {!isFullscreen && (
        <div className="mb-6">
          <nav className="flex items-center gap-2 text-sm">
            <Link
              to="/app/home"
              className="text-zinc-600 dark:text-zinc-400 hover:text-[#0d9488] dark:hover:text-[#50e080] transition-colors flex items-center gap-1"
            >
              <Home size={16} />
              Home
            </Link>
            <ChevronRight size={16} className="text-zinc-400 dark:text-zinc-600" />
            <Link
              to="/app/navigation?section=dashboards"
              className="text-zinc-600 dark:text-zinc-400 hover:text-[#0d9488] dark:hover:text-[#50e080] transition-colors"
            >
              Business Insights
            </Link>
            <ChevronRight size={16} className="text-zinc-400 dark:text-zinc-600" />
            <span className="text-zinc-900 dark:text-white font-medium">MHE Dashboard</span>
          </nav>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-2">
            MHE Dashboard
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Material Handling Equipment Status & Performance
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('data')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'data'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <BarChart3 size={16} className="inline-block mr-2" />
              Data View
            </button>
            <button
              onClick={() => setViewMode('visual')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'visual'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <LayoutGrid size={16} className="inline-block mr-2" />
              Visual View
            </button>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <button
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              onMouseEnter={() => setShowFilterTooltip(true)}
              onMouseLeave={() => setShowFilterTooltip(false)}
              className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors flex items-center gap-2"
            >
              <Filter size={16} />
              Filters
              {(statusFilter !== 'all' || robotTypeFilter !== 'all') && (
                <span className="w-2 h-2 bg-[#0d9488] dark:bg-[#50e080] rounded-full" />
              )}
            </button>

            {showFilterTooltip && !showFilterPanel && (
              <div className="absolute right-0 top-full mt-2 px-3 py-2 bg-zinc-900 dark:bg-zinc-800 text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-10">
                Filter by status or robot type
              </div>
            )}

            {showFilterPanel && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-lg z-20 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-zinc-900 dark:text-white">Filters</h3>
                  <button
                    onClick={() => setShowFilterPanel(false)}
                    className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
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
                            className="w-4 h-4 text-[#0d9488] focus:ring-[#0d9488]"
                          />
                          <span className="text-sm text-zinc-700 dark:text-zinc-300 capitalize">
                            {status === 'all' ? 'All Devices' : status === 'up' ? 'Online Only' : 'Offline Only'}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Robot Type Filter */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Robot Type
                    </label>
                    <select
                      value={robotTypeFilter}
                      onChange={(e) => setRobotTypeFilter(e.target.value as any)}
                      className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
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
                      className="w-full px-3 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg text-sm font-medium transition-colors"
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
            className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors flex items-center gap-2"
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          </button>

          {/* Section Filter */}
          <div className="relative" data-dropdown>
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'section' ? null : 'section')}
              className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors flex items-center gap-2"
            >
              Sections
              <ChevronDown size={16} />
            </button>

            {activeDropdown === 'section' && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-lg z-20">
                <div className="p-3 border-b border-zinc-200 dark:border-zinc-800">
                  <input
                    type="text"
                    placeholder="Search sections..."
                    value={sectionSearch}
                    onChange={(e) => setSectionSearch(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
                  />
                </div>
                <div className="max-h-64 overflow-y-auto p-2">
                  {filteredSectionOptions.map((section) => (
                    <label
                      key={section}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSections.has(section)}
                        onChange={() => toggleSectionSelection(section)}
                        className="w-4 h-4 text-[#0d9488] rounded focus:ring-[#0d9488]"
                      />
                      <span className="text-sm text-zinc-700 dark:text-zinc-300">{section}</span>
                    </label>
                  ))}
                </div>
                <div className="p-2 border-t border-zinc-200 dark:border-zinc-800 flex gap-2">
                  <button
                    onClick={() => setSelectedSections(new Set(allSections))}
                    className="flex-1 px-3 py-2 text-xs font-medium text-[#0d9488] dark:text-[#50e080] hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                  >
                    Select All
                  </button>
                  <button
                    onClick={() => setSelectedSections(new Set())}
                    className="flex-1 px-3 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {viewMode === 'visual' ? (
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
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <Activity className="text-[#0d9488] dark:text-[#50e080]" size={24} />
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-xs text-zinc-600 dark:text-zinc-400">Live</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-zinc-900 dark:text-white">
                    {totalDevices}
                  </span>
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">devices</span>
                </div>
                <h4 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Total Equipment</h4>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <CheckCircle2 className="text-green-600 dark:text-green-400" size={24} />
              </div>
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {totalUp}
                  </span>
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">online</span>
                </div>
                <h4 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Operational</h4>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <XCircle className="text-red-600 dark:text-red-400" size={24} />
              </div>
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {totalDown}
                  </span>
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">offline</span>
                </div>
                <h4 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Down</h4>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="text-[#0d9488] dark:text-[#50e080]" size={24} />
              </div>
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-zinc-900 dark:text-white">
                    {Math.round((totalUp / totalDevices) * 100)}%
                  </span>
                </div>
                <h4 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Uptime</h4>
              </div>
            </div>
          </div>

          {/* SECTION 1: DWS (Dimensioning, Weighing Scales, and Scanning) */}
          {selectedSections.has("DWS") && (
            <div className="mb-12">
              <div
                className="flex items-center gap-2 mb-6 cursor-pointer"
                onClick={() => toggleSectionExpansion("DWS")}
              >
                <Scan className="text-[#0d9488] dark:text-[#50e080]" size={20} />
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
                  Dimensioning, Weighing Scales, and Scanning (DWS)
                </h2>
                <span className="text-sm text-zinc-500">
                  ({dwsUp} up, {dwsDown} down)
                </span>
                <button className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors ml-2">
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
                      className={`bg-white dark:bg-zinc-900 border rounded-lg p-6 ${getStatusBgColor(device.status)} relative`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {device.type === 'Scanner' && <Scan size={20} className={getStatusColor(device.status)} />}
                            {device.type === 'Scale' && <Scale size={20} className={getStatusColor(device.status)} />}
                            {device.type === 'Dimensioner' && <Ruler size={20} className={getStatusColor(device.status)} />}
                            {device.type === 'Printer' && <Printer size={20} className={getStatusColor(device.status)} />}
                            <h3 className="font-bold text-lg text-zinc-900 dark:text-white">{device.name}</h3>
                            <span className="text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-600 dark:text-zinc-400">
                              {device.type}
                            </span>
                          </div>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">{device.id} • {device.location}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            device.status === 'up' ? 'bg-green-500' : 'bg-red-500'
                          } animate-pulse`} />
                          <span className={`${getStatusColor(device.status)} text-sm font-medium uppercase`}>
                            {device.status}
                          </span>
                          <button
                            onClick={(e) => handleBookmarkTile(e, tileId, device.name, "dws", device.status, "Scan", { id: device.id, location: device.location, totalReads: device.totalReads })}
                            className={`p-1 rounded transition-colors ${getStatusColor(device.status)} hover:bg-zinc-100 dark:hover:bg-zinc-800`}
                            title={isBookmarked(tileId) ? "Remove bookmark" : "Add bookmark"}
                          >
                            <Star className={`${isBookmarked(tileId) ? "fill-current" : ""}`} size={16} />
                          </button>
                        </div>
                      </div>

                      {device.status === "up" ? (
                        <>
                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-3">
                              <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">Total Reads</p>
                              <p className="text-xl font-bold text-zinc-900 dark:text-white">{device.totalReads}</p>
                            </div>
                            <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-3">
                              <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">Per Hour</p>
                              <p className="text-xl font-bold text-zinc-900 dark:text-white">{device.readsPerHour}</p>
                            </div>
                            <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-3">
                              <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">Last Read</p>
                              <p className="text-sm font-bold text-zinc-900 dark:text-white">{device.lastRead}</p>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-3">Read Quality</h4>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-zinc-600 dark:text-zinc-400">Good Reads</span>
                                <div className="flex items-center gap-2">
                                  <div className="w-32 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-green-500"
                                      style={{ width: `${goodReadPct}%` }}
                                    />
                                  </div>
                                  <span className="text-sm font-bold text-zinc-900 dark:text-white w-16 text-right">{goodReadPct}%</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-zinc-600 dark:text-zinc-400">No Reads</span>
                                <div className="flex items-center gap-2">
                                  <div className="w-32 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-red-500"
                                      style={{ width: `${noReadPct}%` }}
                                    />
                                  </div>
                                  <span className="text-sm font-bold text-zinc-900 dark:text-white w-16 text-right">{noReadPct}%</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-zinc-600 dark:text-zinc-400">No Codes</span>
                                <div className="flex items-center gap-2">
                                  <div className="w-32 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-amber-500"
                                      style={{ width: `${noCodePct}%` }}
                                    />
                                  </div>
                                  <span className="text-sm font-bold text-zinc-900 dark:text-white w-16 text-right">{noCodePct}%</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-zinc-600 dark:text-zinc-400">Multi Reads</span>
                                <div className="flex items-center gap-2">
                                  <div className="w-32 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-orange-500"
                                      style={{ width: `${multiReadPct}%` }}
                                    />
                                  </div>
                                  <span className="text-sm font-bold text-zinc-900 dark:text-white w-16 text-right">{multiReadPct}%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-8 text-zinc-500">
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
                <Radio className="text-[#0d9488] dark:text-[#50e080]" size={20} />
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Sub Systems</h2>
                <span className="text-sm text-zinc-500">
                  ({subSystemsUp} up, {subSystemsDown} down)
                </span>
                <button className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors ml-2">
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
                        className={`bg-white dark:bg-zinc-900 border rounded-lg p-6 ${getStatusBgColor(subsystem.status)}`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Radio size={20} className={getStatusColor(subsystem.status)} />
                              <h3 className="font-bold text-lg text-zinc-900 dark:text-white">{subsystem.name}</h3>
                            </div>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">{subsystem.id} • {subsystem.location}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              subsystem.status === 'up' ? 'bg-green-500' : 'bg-red-500'
                            } animate-pulse`} />
                            <span className={`${getStatusColor(subsystem.status)} text-sm font-medium uppercase`}>
                              {subsystem.status}
                            </span>
                            <button
                              onClick={(e) => handleBookmarkTile(e, tileId, subsystem.name, "subsystems", subsystem.status, "Radio", { id: subsystem.id, location: subsystem.location, oee: subsystem.oee })}
                              className={`p-1 rounded transition-colors ${getStatusColor(subsystem.status)} hover:bg-zinc-100 dark:hover:bg-zinc-800`}
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
                              <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">Overall Equipment Effectiveness (OEE)</p>
                              <p className={`text-3xl font-bold ${getOEEColor(subsystem.oee)}`}>{subsystem.oee}%</p>
                            </div>

                            {/* OEE Breakdown */}
                            <div className="space-y-3">
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-zinc-600 dark:text-zinc-400">Availability</span>
                                  <span className="font-medium text-zinc-900 dark:text-white">{subsystem.availability}%</span>
                                </div>
                                <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-[#0d9488] dark:bg-[#50e080]"
                                    style={{ width: `${subsystem.availability}%` }}
                                  />
                                </div>
                              </div>

                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-zinc-600 dark:text-zinc-400">Performance</span>
                                  <span className="font-medium text-zinc-900 dark:text-white">{subsystem.performance}%</span>
                                </div>
                                <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-[#0d9488] dark:bg-[#50e080]"
                                    style={{ width: `${subsystem.performance}%` }}
                                  />
                                </div>
                              </div>

                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-zinc-600 dark:text-zinc-400">Quality</span>
                                  <span className="font-medium text-zinc-900 dark:text-white">{subsystem.quality}%</span>
                                </div>
                                <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-[#0d9488] dark:bg-[#50e080]"
                                    style={{ width: `${subsystem.quality}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="text-center py-8 text-zinc-500">
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
                <Boxes className="text-[#0d9488] dark:text-[#50e080]" size={20} />
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Sorters</h2>
                <span className="text-sm text-zinc-500">
                  ({sortersUp} up, {sortersDown} down)
                </span>
                <button className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors ml-2">
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
                      className={`bg-white dark:bg-zinc-900 border rounded-lg p-6 ${getStatusBgColor(sorter.status)} relative`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Boxes size={20} className={getStatusColor(sorter.status)} />
                            <h3 className="font-bold text-lg text-zinc-900 dark:text-white">{sorter.name}</h3>
                          </div>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">{sorter.id} • {sorter.location}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            sorter.status === 'up' ? 'bg-green-500' : 'bg-red-500'
                          } animate-pulse`} />
                          <span className={`${getStatusColor(sorter.status)} text-sm font-medium uppercase`}>
                            {sorter.status}
                          </span>
                          <button
                            onClick={(e) => handleBookmarkTile(e, tileId, sorter.name, "sorters", sorter.status, "Boxes", { id: sorter.id, location: sorter.location, totalSorts: sorter.totalSorts })}
                            className={`p-1 rounded transition-colors ${getStatusColor(sorter.status)} hover:bg-zinc-100 dark:hover:bg-zinc-800`}
                            title={isBookmarked(tileId) ? "Remove bookmark" : "Add bookmark"}
                          >
                            <Star className={`${isBookmarked(tileId) ? "fill-current" : ""}`} size={16} />
                          </button>
                        </div>
                      </div>

                      {sorter.status === "up" ? (
                        <>
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-3">
                              <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">Total Sorts</p>
                              <p className="text-xl font-bold text-zinc-900 dark:text-white">{sorter.totalSorts}</p>
                            </div>
                            <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-3">
                              <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">Per Hour</p>
                              <p className="text-xl font-bold text-zinc-900 dark:text-white">{sorter.sortsPerHour}</p>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-2">Lane Routing</h4>
                            <div className="space-y-2">
                              {sorter.laneRouting.map((lane, idx) => (
                                <div key={idx} className="flex items-center justify-between">
                                  <span className="text-sm text-zinc-600 dark:text-zinc-400">{lane.lane}</span>
                                  <div className="flex items-center gap-2 flex-1 ml-4">
                                    <div className="flex-1 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-[#0d9488] dark:bg-[#50e080]"
                                        style={{ width: `${(lane.count / sorter.totalSorts) * 100}%` }}
                                      />
                                    </div>
                                    <span className="text-sm font-bold text-zinc-900 dark:text-white w-12 text-right">{lane.count}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-8 text-zinc-500">
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
                <Bot className="text-[#0d9488] dark:text-[#50e080]" size={20} />
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Robots</h2>
                <span className="text-sm text-zinc-500">
                  ({robotsUp} up, {robotsDown} down)
                </span>
                {robotTypeFilter !== 'all' && (
                  <span className="text-xs px-2 py-1 bg-[#0d9488]/10 dark:bg-[#50e080]/10 text-[#0d9488] dark:text-[#50e080] rounded-full">
                    Filtered: {robotTypeFilter}
                  </span>
                )}
                <button className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors ml-2">
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
                      className={`bg-white dark:bg-zinc-900 border rounded-lg p-6 ${getStatusBgColor(robot.status)}`}
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
                            <h3 className="font-bold text-lg text-zinc-900 dark:text-white">{robot.name}</h3>
                            <span className="text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-600 dark:text-zinc-400">
                              {robot.type}
                            </span>
                          </div>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">{robot.id} • {robot.location}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            robot.status === 'up' ? 'bg-green-500' : 'bg-red-500'
                          } animate-pulse`} />
                          <span className={`${getStatusColor(robot.status)} text-sm font-medium uppercase`}>
                            {robot.status}
                          </span>
                          <button
                            onClick={(e) => handleBookmarkTile(e, tileId, robot.name, "robots", robot.status, "Bot", { id: robot.id, location: robot.location, type: robot.type, oee: robot.oee })}
                            className={`p-1 rounded transition-colors ${getStatusColor(robot.status)} hover:bg-zinc-100 dark:hover:bg-zinc-800`}
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
                            <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">Overall Equipment Effectiveness (OEE)</p>
                            <p className={`text-3xl font-bold ${getOEEColor(robot.oee)}`}>{robot.oee}%</p>
                          </div>

                          {robot.currentWorkList && (
                            <div className="mb-4 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                              <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">Current Work List</p>
                              <p className="text-lg font-bold text-[#0d9488] dark:text-[#50e080]">{robot.currentWorkList}</p>
                              <p className="text-sm text-zinc-600 dark:text-zinc-400">{robot.workType}</p>
                            </div>
                          )}

                          {/* OEE Breakdown */}
                          <div className="space-y-2">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-zinc-600 dark:text-zinc-400">Availability</span>
                                <span className="font-medium text-zinc-900 dark:text-white">{robot.availability}%</span>
                              </div>
                              <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-[#0d9488] dark:bg-[#50e080]"
                                  style={{ width: `${robot.availability}%` }}
                                />
                              </div>
                            </div>

                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-zinc-600 dark:text-zinc-400">Performance</span>
                                <span className="font-medium text-zinc-900 dark:text-white">{robot.performance}%</span>
                              </div>
                              <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-[#0d9488] dark:bg-[#50e080]"
                                  style={{ width: `${robot.performance}%` }}
                                />
                              </div>
                            </div>

                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-zinc-600 dark:text-zinc-400">Quality</span>
                                <span className="font-medium text-zinc-900 dark:text-white">{robot.quality}%</span>
                              </div>
                              <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-[#0d9488] dark:bg-[#50e080]"
                                  style={{ width: `${robot.quality}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-8 text-zinc-500">
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
  );
}
