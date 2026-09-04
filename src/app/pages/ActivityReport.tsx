import { useState, useRef, useEffect } from "react";
import { useLayout } from "../contexts/LayoutContext";
import { Link } from "react-router-dom";
import {
  Filter,
  RefreshCw,
  Download,
  ChevronRight,
  Home,
  Calendar,
  User,
  Monitor,
  Activity,
  Sparkles,
  Package,
  Clock,
  MapPin,
  Box,
  Hash,
  AlertCircle,
  Check,
  X,
  Search,
  ClipboardList,
} from "lucide-react";

type ActivityEntry = {
  id: string;
  workstationId: string;
  workstationName: string;
  timestamp: string;
  historyTable: string;
  user: string;
  operation: string;
  workList: string;
  workOperation: string;
  location: string;
  container: string;
  item: string;
  quantity: number;
  expectedQuantity: number;
  reasonCode?: string;
};

// Mock data generator
const generateMockData = (
  startDate: Date,
  endDate: Date,
  workstations: string[],
  users: string[],
  activities: string[]
): ActivityEntry[] => {
  const entries: ActivityEntry[] = [];
  const operations = ["Pick", "Replen", "Count", "Inspect", "Inventory Adjustment"];
  const filteredOps = activities.length > 0 ? operations.filter(op => activities.includes(op)) : operations;

  const workstationNames = {
    "WS-001": "Pick Station Alpha",
    "WS-002": "Pick Station Beta",
    "WS-003": "Replen Station 1",
    "WS-004": "Count Station A",
    "WS-005": "Inspection Bay 1",
  };

  const historyTables = ["PickHistory", "ReplenHistory", "CountHistory", "InspectionHistory", "InventoryAdjustment"];
  const workOperations = ["Complete", "Short", "Skip", "Adjust", "Verify"];
  const locations = ["A-01-01", "B-02-03", "C-03-05", "D-04-02", "E-05-01"];
  const containers = ["CNT-001", "CNT-002", "CNT-003", "CNT-004", "CNT-005"];
  const items = ["ITM-12345", "ITM-23456", "ITM-34567", "ITM-45678", "ITM-56789"];
  const reasonCodes = ["SHORT", "DAMAGED", "MISCOUNT", "QUALITY", undefined];

  const timeDiff = endDate.getTime() - startDate.getTime();
  const count = Math.floor(Math.random() * 100) + 50;

  for (let i = 0; i < count; i++) {
    const randomTime = new Date(startDate.getTime() + Math.random() * timeDiff);
    const operation = filteredOps[Math.floor(Math.random() * filteredOps.length)];
    const wsId = workstations.length > 0
      ? workstations[Math.floor(Math.random() * workstations.length)]
      : Object.keys(workstationNames)[Math.floor(Math.random() * Object.keys(workstationNames).length)];
    const user = users.length > 0
      ? users[Math.floor(Math.random() * users.length)]
      : `user${Math.floor(Math.random() * 10) + 1}`;

    entries.push({
      id: `ACT-${String(i + 1).padStart(6, "0")}`,
      workstationId: wsId,
      workstationName: workstationNames[wsId as keyof typeof workstationNames] || "Unknown Station",
      timestamp: randomTime.toISOString(),
      historyTable: historyTables[Math.floor(Math.random() * historyTables.length)],
      user,
      operation,
      workList: `WL-${String(Math.floor(Math.random() * 188) + 1).padStart(3, "0")}`,
      workOperation: workOperations[Math.floor(Math.random() * workOperations.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      container: containers[Math.floor(Math.random() * containers.length)],
      item: items[Math.floor(Math.random() * items.length)],
      quantity: Math.floor(Math.random() * 50) + 1,
      expectedQuantity: Math.floor(Math.random() * 50) + 1,
      reasonCode: reasonCodes[Math.floor(Math.random() * reasonCodes.length)],
    });
  }

  return entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export function ActivityReport() {
  const { setShowAI } = useLayout();
  const [activityData, setActivityData] = useState<ActivityEntry[]>([]);

  // Filter states
  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  });
  const [selectedWorkstations, setSelectedWorkstations] = useState<Set<string>>(new Set());
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [selectedActivities, setSelectedActivities] = useState<Set<string>>(new Set());

  // Dropdown states
  const [showWorkstationDropdown, setShowWorkstationDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showActivityDropdown, setShowActivityDropdown] = useState(false);
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);

  // Search states
  const [workstationSearch, setWorkstationSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [activitySearch, setActivitySearch] = useState("");

  // Refs for click-outside detection
  const workstationDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const activityDropdownRef = useRef<HTMLDivElement>(null);
  const dateRangeRef = useRef<HTMLDivElement>(null);

  // Available options
  const workstations = ["WS-001", "WS-002", "WS-003", "WS-004", "WS-005"];
  const users = ["user1", "user2", "user3", "user4", "user5", "user6", "user7", "user8", "user9", "user10"];
  const activities = ["Pick", "Replen", "Count", "Inspect", "Inventory Adjustment"];

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (workstationDropdownRef.current && !workstationDropdownRef.current.contains(event.target as Node)) {
        setShowWorkstationDropdown(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
      if (activityDropdownRef.current && !activityDropdownRef.current.contains(event.target as Node)) {
        setShowActivityDropdown(false);
      }
      if (dateRangeRef.current && !dateRangeRef.current.contains(event.target as Node)) {
        setShowDateRangePicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Real-time filtering - update data when filters change
  useEffect(() => {
    // Only load data if at least one filter is set
    const hasFilters =
      dateRange.start !== "" ||
      dateRange.end !== "" ||
      selectedWorkstations.size > 0 ||
      selectedUsers.size > 0 ||
      selectedActivities.size > 0;

    if (hasFilters) {
      // Use current date as default if not specified
      const startDate = dateRange.start ? new Date(dateRange.start) : new Date("2020-01-01");
      const endDate = dateRange.end ? new Date(dateRange.end) : new Date();
      endDate.setHours(23, 59, 59, 999);

      const data = generateMockData(
        startDate,
        endDate,
        Array.from(selectedWorkstations),
        Array.from(selectedUsers),
        Array.from(selectedActivities)
      );

      setActivityData(data);
    } else {
      setActivityData([]);
    }
  }, [dateRange, selectedWorkstations, selectedUsers, selectedActivities]);

  const handleShowToday = () => {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    setDateRange({
      start: todayStart.toISOString().split('T')[0],
      end: todayStart.toISOString().split('T')[0],
    });
  };

  const handleRefresh = () => {
    // Trigger re-fetch by updating a dummy state or just re-running the effect
    const hasFilters =
      dateRange.start !== "" ||
      dateRange.end !== "" ||
      selectedWorkstations.size > 0 ||
      selectedUsers.size > 0 ||
      selectedActivities.size > 0;

    if (hasFilters) {
      const startDate = dateRange.start ? new Date(dateRange.start) : new Date("2020-01-01");
      const endDate = dateRange.end ? new Date(dateRange.end) : new Date();
      endDate.setHours(23, 59, 59, 999);

      const data = generateMockData(
        startDate,
        endDate,
        Array.from(selectedWorkstations),
        Array.from(selectedUsers),
        Array.from(selectedActivities)
      );

      setActivityData(data);
    }
  };

  const handleExport = () => {
    // Export functionality would be implemented here
    alert("Exporting activity report data...");
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const toggleWorkstation = (ws: string) => {
    const newSelected = new Set(selectedWorkstations);
    if (newSelected.has(ws)) {
      newSelected.delete(ws);
    } else {
      newSelected.add(ws);
    }
    setSelectedWorkstations(newSelected);
  };

  const toggleUser = (user: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(user)) {
      newSelected.delete(user);
    } else {
      newSelected.add(user);
    }
    setSelectedUsers(newSelected);
  };

  const toggleActivity = (activity: string) => {
    const newSelected = new Set(selectedActivities);
    if (newSelected.has(activity)) {
      newSelected.delete(activity);
    } else {
      newSelected.add(activity);
    }
    setSelectedActivities(newSelected);
  };

  const selectAllWorkstations = () => setSelectedWorkstations(new Set(workstations));
  const deselectAllWorkstations = () => setSelectedWorkstations(new Set());
  const selectAllUsers = () => setSelectedUsers(new Set(users));
  const deselectAllUsers = () => setSelectedUsers(new Set());
  const selectAllActivities = () => setSelectedActivities(new Set(activities));
  const deselectAllActivities = () => setSelectedActivities(new Set());

  // Filtered options based on search
  const filteredWorkstations = workstations.filter(ws =>
    ws.toLowerCase().includes(workstationSearch.toLowerCase())
  );
  const filteredUsers = users.filter(user =>
    user.toLowerCase().includes(userSearch.toLowerCase())
  );
  const filteredActivities = activities.filter(activity =>
    activity.toLowerCase().includes(activitySearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 p-6">
      <div className="max-w-[1800px] mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="mb-6 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-500">
          <Link to="/app/home" className="hover:text-[#0d9488] dark:hover:text-[#50e080] transition-colors flex items-center gap-1">
            <Home size={14} />
            Home
          </Link>
          <ChevronRight size={14} />
          <Link to="/app/navigation" className="hover:text-[#0d9488] dark:hover:text-[#50e080] transition-colors">
            Navigation
          </Link>
          <ChevronRight size={14} />
          <Link to="/app/navigation?section=dashboards" className="hover:text-[#0d9488] dark:hover:text-[#50e080] transition-colors">
            Business Insights
          </Link>
          <ChevronRight size={14} />
          <span className="text-zinc-900 dark:text-white font-semibold text-lg flex items-center gap-2">
            <ClipboardList size={20} className="text-[#0d9488] dark:text-[#50e080]" />
            User/Workstation Activity
          </span>
        </div>

        {/* Filters Section */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 mb-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
              <Filter size={20} className="text-[#0d9488] dark:text-[#50e080]" />
              Filters
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Date Range */}
            <div ref={dateRangeRef}>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Date Range
              </label>
              <div
                className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2 cursor-pointer"
                onClick={() => setShowDateRangePicker(!showDateRangePicker)}
              >
                <div className="flex items-center gap-2 text-sm text-zinc-900 dark:text-white">
                  <Calendar size={16} className="text-zinc-400" />
                  <span>{dateRange.start} to {dateRange.end}</span>
                </div>
              </div>
              {showDateRangePicker && (
                <div className="absolute mt-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-xl p-4 z-20">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                        className="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                        className="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white"
                      />
                    </div>
                    <button
                      onClick={() => setShowDateRangePicker(false)}
                      className="w-full px-3 py-2 bg-[#0d9488] dark:bg-[#50e080] hover:bg-[#0f766e] dark:hover:bg-[#3bc76a] text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Workstation Filter */}
            <div className="relative" ref={workstationDropdownRef}>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Workstation
              </label>
              <div
                className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2 cursor-pointer"
                onClick={() => setShowWorkstationDropdown(!showWorkstationDropdown)}
              >
                {selectedWorkstations.size === 0 ? (
                  <span className="text-zinc-500 dark:text-zinc-500 text-sm">
                    No workstations selected
                  </span>
                ) : selectedWorkstations.size === 1 ? (
                  <span className="text-zinc-900 dark:text-white text-sm">
                    {Array.from(selectedWorkstations)[0]}
                  </span>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {Array.from(selectedWorkstations).slice(0, 2).map((ws) => (
                      <span
                        key={ws}
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#0d9488] dark:bg-[#50e080] text-white rounded text-xs"
                      >
                        {ws}
                      </span>
                    ))}
                    {selectedWorkstations.size > 2 && (
                      <span className="text-xs text-zinc-600 dark:text-zinc-400 px-2 py-0.5">
                        +{selectedWorkstations.size - 2} more
                      </span>
                    )}
                  </div>
                )}
              </div>
              {showWorkstationDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-xl max-h-64 overflow-y-auto z-20">
                  {/* Search */}
                  <div className="sticky top-0 bg-white dark:bg-zinc-800 p-2 border-b border-zinc-200 dark:border-zinc-700">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                      <input
                        type="text"
                        placeholder="Search workstations..."
                        value={workstationSearch}
                        onChange={(e) => setWorkstationSearch(e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded pl-9 pr-3 py-1.5 text-sm text-zinc-900 dark:text-white placeholder-zinc-500"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                  {/* Select All / Deselect All */}
                  <div className="sticky top-[52px] bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-700 p-2 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        selectAllWorkstations();
                      }}
                      className="flex-1 px-2 py-1.5 bg-[#0d9488] dark:bg-[#50e080] hover:bg-[#0f766e] dark:hover:bg-[#3bc76a] text-white rounded text-xs font-medium transition-colors"
                    >
                      Select All
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deselectAllWorkstations();
                      }}
                      className="flex-1 px-2 py-1.5 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-900 dark:text-white rounded text-xs font-medium transition-colors"
                    >
                      Deselect All
                    </button>
                  </div>
                  {filteredWorkstations.map((ws) => (
                    <button
                      key={ws}
                      onClick={() => toggleWorkstation(ws)}
                      className={`w-full px-3 py-2 text-left text-sm transition-colors flex items-center gap-2 ${
                        selectedWorkstations.has(ws)
                          ? "bg-[#50e080]/10 text-[#0d9488] dark:text-[#50e080]"
                          : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                        selectedWorkstations.has(ws)
                          ? "bg-[#0d9488] dark:bg-[#50e080] border-[#0d9488] dark:border-[#50e080]"
                          : "border-zinc-400 dark:border-zinc-600"
                      }`}>
                        {selectedWorkstations.has(ws) && <Check size={12} className="text-white" />}
                      </div>
                      {ws}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Filter */}
            <div className="relative" ref={userDropdownRef}>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                User
              </label>
              <div
                className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2 cursor-pointer"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
              >
                {selectedUsers.size === 0 ? (
                  <span className="text-zinc-500 dark:text-zinc-500 text-sm">
                    No users selected
                  </span>
                ) : selectedUsers.size === 1 ? (
                  <span className="text-zinc-900 dark:text-white text-sm">
                    {Array.from(selectedUsers)[0]}
                  </span>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {Array.from(selectedUsers).slice(0, 2).map((user) => (
                      <span
                        key={user}
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#0d9488] dark:bg-[#50e080] text-white rounded text-xs"
                      >
                        {user}
                      </span>
                    ))}
                    {selectedUsers.size > 2 && (
                      <span className="text-xs text-zinc-600 dark:text-zinc-400 px-2 py-0.5">
                        +{selectedUsers.size - 2} more
                      </span>
                    )}
                  </div>
                )}
              </div>
              {showUserDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-xl max-h-64 overflow-y-auto z-20">
                  {/* Search */}
                  <div className="sticky top-0 bg-white dark:bg-zinc-800 p-2 border-b border-zinc-200 dark:border-zinc-700">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded pl-9 pr-3 py-1.5 text-sm text-zinc-900 dark:text-white placeholder-zinc-500"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                  {/* Select All / Deselect All */}
                  <div className="sticky top-[52px] bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-700 p-2 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        selectAllUsers();
                      }}
                      className="flex-1 px-2 py-1.5 bg-[#0d9488] dark:bg-[#50e080] hover:bg-[#0f766e] dark:hover:bg-[#3bc76a] text-white rounded text-xs font-medium transition-colors"
                    >
                      Select All
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deselectAllUsers();
                      }}
                      className="flex-1 px-2 py-1.5 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-900 dark:text-white rounded text-xs font-medium transition-colors"
                    >
                      Deselect All
                    </button>
                  </div>
                  {filteredUsers.map((user) => (
                    <button
                      key={user}
                      onClick={() => toggleUser(user)}
                      className={`w-full px-3 py-2 text-left text-sm transition-colors flex items-center gap-2 ${
                        selectedUsers.has(user)
                          ? "bg-[#50e080]/10 text-[#0d9488] dark:text-[#50e080]"
                          : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                        selectedUsers.has(user)
                          ? "bg-[#0d9488] dark:bg-[#50e080] border-[#0d9488] dark:border-[#50e080]"
                          : "border-zinc-400 dark:border-zinc-600"
                      }`}>
                        {selectedUsers.has(user) && <Check size={12} className="text-white" />}
                      </div>
                      {user}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Activities Filter */}
            <div className="relative" ref={activityDropdownRef}>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Activities
              </label>
              <div
                className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2 cursor-pointer"
                onClick={() => setShowActivityDropdown(!showActivityDropdown)}
              >
                {selectedActivities.size === 0 ? (
                  <span className="text-zinc-500 dark:text-zinc-500 text-sm">
                    No activities selected
                  </span>
                ) : selectedActivities.size === 1 ? (
                  <span className="text-zinc-900 dark:text-white text-sm">
                    {Array.from(selectedActivities)[0]}
                  </span>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {Array.from(selectedActivities).slice(0, 2).map((activity) => (
                      <span
                        key={activity}
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#0d9488] dark:bg-[#50e080] text-white rounded text-xs"
                      >
                        {activity}
                      </span>
                    ))}
                    {selectedActivities.size > 2 && (
                      <span className="text-xs text-zinc-600 dark:text-zinc-400 px-2 py-0.5">
                        +{selectedActivities.size - 2} more
                      </span>
                    )}
                  </div>
                )}
              </div>
              {showActivityDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-xl max-h-64 overflow-y-auto z-20">
                  {/* Search */}
                  <div className="sticky top-0 bg-white dark:bg-zinc-800 p-2 border-b border-zinc-200 dark:border-zinc-700">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                      <input
                        type="text"
                        placeholder="Search activities..."
                        value={activitySearch}
                        onChange={(e) => setActivitySearch(e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded pl-9 pr-3 py-1.5 text-sm text-zinc-900 dark:text-white placeholder-zinc-500"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                  {/* Select All / Deselect All */}
                  <div className="sticky top-[52px] bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-700 p-2 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        selectAllActivities();
                      }}
                      className="flex-1 px-2 py-1.5 bg-[#0d9488] dark:bg-[#50e080] hover:bg-[#0f766e] dark:hover:bg-[#3bc76a] text-white rounded text-xs font-medium transition-colors"
                    >
                      Select All
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deselectAllActivities();
                      }}
                      className="flex-1 px-2 py-1.5 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-900 dark:text-white rounded text-xs font-medium transition-colors"
                    >
                      Deselect All
                    </button>
                  </div>
                  {filteredActivities.map((activity) => (
                    <button
                      key={activity}
                      onClick={() => toggleActivity(activity)}
                      className={`w-full px-3 py-2 text-left text-sm transition-colors flex items-center gap-2 ${
                        selectedActivities.has(activity)
                          ? "bg-[#50e080]/10 text-[#0d9488] dark:text-[#50e080]"
                          : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                        selectedActivities.has(activity)
                          ? "bg-[#0d9488] dark:bg-[#50e080] border-[#0d9488] dark:border-[#50e080]"
                          : "border-zinc-400 dark:border-zinc-600"
                      }`}>
                        {selectedActivities.has(activity) && <Check size={12} className="text-white" />}
                      </div>
                      {activity}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Data Grid or OPTO Placeholder */}
        {activityData.length === 0 ? (
          /* OPTO Initial State - No Data Loaded */
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
            <div className="py-24 text-center">
              <div className="flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-[#0d9488] dark:bg-[#50e080] rounded-full flex items-center justify-center mb-6 shadow-lg shadow-[#0d9488]/50 dark:shadow-[#50e080]/50">
                  <Sparkles size={36} className="text-white" />
                </div>
                <h3 className="text-zinc-900 dark:text-white text-2xl font-bold mb-3">Hi, I'm OPTO!</h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-lg mb-8 max-w-md">
                  What are you looking for today? Use the filters above to find activity data.
                </p>

                {/* Quick Suggestions */}
                <div className="flex flex-wrap gap-3 mb-10 justify-center">
                  <button
                    onClick={handleShowToday}
                    className="px-5 py-2.5 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-lg transition-all border border-zinc-300 dark:border-zinc-700 hover:border-[#0d9488] dark:hover:border-[#50e080] flex items-center gap-2 group"
                  >
                    <Calendar size={18} className="text-zinc-600 dark:text-zinc-400 group-hover:text-[#0d9488] dark:group-hover:text-[#50e080] transition-colors" />
                    <span>Show Today</span>
                  </button>
                </div>

                <div className="flex flex-col gap-3 text-left">
                  <div className="flex items-start gap-3 text-zinc-600 dark:text-zinc-300">
                    <div className="w-6 h-6 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Sparkles size={14} className="text-[#0d9488] dark:text-[#50e080]" />
                    </div>
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-white">Ask me anything</p>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">Use natural language to query activity data</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-zinc-600 dark:text-zinc-300">
                    <div className="w-6 h-6 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Filter size={14} className="text-[#0d9488] dark:text-[#50e080]" />
                    </div>
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-white">Real-time filtering</p>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">Data updates automatically as you select filters</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-zinc-600 dark:text-zinc-300">
                    <div className="w-6 h-6 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Download size={14} className="text-[#0d9488] dark:text-[#50e080]" />
                    </div>
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-white">Export results</p>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">Download activity data for further analysis</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Data Grid */
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
            {/* Grid Header with Actions */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                Showing <span className="font-semibold text-zinc-900 dark:text-white">{activityData.length}</span> activities
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRefresh}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
                >
                  <RefreshCw size={16} />
                  Refresh
                </button>
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
                >
                  <Download size={16} />
                  Export
                </button>
              </div>
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300">Workstation ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300">Workstation Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300">Timestamp</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300">History Table</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300">User</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300">Operation</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300">Work List</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300">Work Operation</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300">Location</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300">Container</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300">Item</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-700 dark:text-zinc-300">Quantity</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-700 dark:text-zinc-300">Expected Qty</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300">Reason Code</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {activityData.map((entry) => (
                    <tr key={entry.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                      <td className="px-4 py-3 text-sm font-mono text-zinc-900 dark:text-white">{entry.workstationId}</td>
                      <td className="px-4 py-3 text-sm text-zinc-900 dark:text-white">{entry.workstationName}</td>
                      <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">{formatTimestamp(entry.timestamp)}</td>
                      <td className="px-4 py-3 text-sm text-zinc-900 dark:text-white">{entry.historyTable}</td>
                      <td className="px-4 py-3 text-sm text-zinc-900 dark:text-white">{entry.user}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          entry.operation === "Pick"
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                            : entry.operation === "Replen"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                            : entry.operation === "Count"
                            ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                            : entry.operation === "Inspect"
                            ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400"
                            : "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400"
                        }`}>
                          {entry.operation}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-mono text-zinc-900 dark:text-white">{entry.workList}</td>
                      <td className="px-4 py-3 text-sm text-zinc-900 dark:text-white">{entry.workOperation}</td>
                      <td className="px-4 py-3 text-sm font-mono text-zinc-900 dark:text-white">{entry.location}</td>
                      <td className="px-4 py-3 text-sm font-mono text-zinc-900 dark:text-white">{entry.container}</td>
                      <td className="px-4 py-3 text-sm font-mono text-zinc-900 dark:text-white">{entry.item}</td>
                      <td className="px-4 py-3 text-sm text-right font-semibold text-zinc-900 dark:text-white">{entry.quantity}</td>
                      <td className="px-4 py-3 text-sm text-right text-zinc-600 dark:text-zinc-400">{entry.expectedQuantity}</td>
                      <td className="px-4 py-3 text-sm">
                        {entry.reasonCode ? (
                          <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded text-xs font-medium">
                            {entry.reasonCode}
                          </span>
                        ) : (
                          <span className="text-zinc-400 dark:text-zinc-600">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
