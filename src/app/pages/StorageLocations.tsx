import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLayout } from "../contexts/LayoutContext";
import { mockStorageLocations, type StorageLocation } from "../data/mockStorageLocations";
import {
  Search,
  Filter,
  Download,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  MapPin,
  Archive,
  Package,
  Box,
  AlertCircle,
  CheckCircle2,
  Clock,
  Warehouse,
  TrendingUp,
  X,
  Sparkles,
  Layers,
  Info,
  History,
  Zap,
  Edit,
  Trash2,
  Lock,
  Unlock,
  Home,
  BarChart3,
  Plus,
  RefreshCw,
  ChevronLeft,
} from "lucide-react";
import {
  getInventoryForLocation,
  getCurrentAllocationsForLocation,
  getAllocationHistoryForLocation,
  getContainerLinkageForLocation,
  type ContainerLinkageEvent
} from "../data/mockStorageLocationData";

type SortField = keyof StorageLocation;

// Locations component with comprehensive filtering and grouping
export function StorageLocations() {
  const navigate = useNavigate();
  const { setShowAI, storageLocationsHiddenColumns, storageLocationsPinnedColumns } = useLayout();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());
  const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(new Set());
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [groupByParent, setGroupByParent] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [typeSearch, setTypeSearch] = useState("");
  const [statusSearch, setStatusSearch] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<'type' | 'status' | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<StorageLocation | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'inventory' | 'events' | 'actions'>('details');
  const [locationInventory, setLocationInventory] = useState<any[]>([]);
  const [locationCurrentAllocations, setLocationCurrentAllocations] = useState<any[]>([]);
  const [locationAllocationHistory, setLocationAllocationHistory] = useState<any[]>([]);
  const [containerLinkageEvents, setContainerLinkageEvents] = useState<ContainerLinkageEvent[]>([]);
  const [newStatus, setNewStatus] = useState<string>('Available');
  const [showStatusConfirmation, setShowStatusConfirmation] = useState(false);
  const [showAllocationWarning, setShowAllocationWarning] = useState(false);
  const [showDateRangeDialog, setShowDateRangeDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportStartDate, setReportStartDate] = useState('');
  const [reportEndDate, setReportEndDate] = useState('');
  const [reportData, setReportData] = useState<any[]>([]);
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [addLocationStep, setAddLocationStep] = useState<'form' | 'confirmation'>('form');
  const [newLocationData, setNewLocationData] = useState({
    type: '',
    id: '',
    parentLocation: ''
  });
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [bulkDeleteMode, setBulkDeleteMode] = useState(false);
  const [selectedLocationIds, setSelectedLocationIds] = useState<Set<string>>(new Set());
  const [showBulkDeleteConfirmation, setShowBulkDeleteConfirmation] = useState(false);
  const [moveToLocation, setMoveToLocation] = useState<string>('');
  const [showMoveConfirmation, setShowMoveConfirmation] = useState(false);
  const [activeAction, setActiveAction] = useState<'status' | 'move' | 'report' | 'delete' | null>(null);

  // Update location data when selected location changes
  useEffect(() => {
    if (selectedLocation) {
      setLocationInventory(getInventoryForLocation(selectedLocation.name, selectedLocation.status));
      setLocationCurrentAllocations(getCurrentAllocationsForLocation(selectedLocation.name, selectedLocation.status));
      setLocationAllocationHistory(getAllocationHistoryForLocation(selectedLocation.name, selectedLocation.status));
      setContainerLinkageEvents(getContainerLinkageForLocation(selectedLocation.name, selectedLocation.type));
    }
  }, [selectedLocation]);

  // Get visible columns based on context
  const allColumns: (keyof StorageLocation)[] = [
    "name",
    "parentStorage",
    "status",
    "type",
    "attribute1",
    "attribute2",
    "attribute3",
    "attribute4",
    "attribute5",
    "created",
    "createdBy",
    "isMoveable",
  ];

  const visibleColumns = allColumns.filter(col => !storageLocationsHiddenColumns.includes(col));
  const pinnedColumns = visibleColumns.filter(col => storageLocationsPinnedColumns.includes(col));
  const unpinnedColumns = visibleColumns.filter(col => !storageLocationsPinnedColumns.includes(col));
  const orderedColumns = [...pinnedColumns, ...unpinnedColumns];

  // Safety check: ensure mockStorageLocations is available
  if (!mockStorageLocations || !Array.isArray(mockStorageLocations)) {
    return (
      <div className="p-8">
        <div className="text-white">Loading locations...</div>
      </div>
    );
  }

  // Calculate statistics (only Racks and Shelves for Locations)
  const locationsOnly = mockStorageLocations.filter(l => l.type === "Rack" || l.type === "Shelf");
  const totalLocations = locationsOnly.length;
  const availableLocations = locationsOnly.filter(l => l.status === "Available").length;
  const occupiedLocations = locationsOnly.filter(l => l.status === "Occupied").length;
  const reservedLocations = locationsOnly.filter(l => l.status === "Reserved").length;
  const blockedLocations = locationsOnly.filter(l => l.status === "Blocked").length;

  const utilizationRate = totalLocations > 0 ? ((occupiedLocations / totalLocations) * 100).toFixed(1) : "0.0";

  // Get unique values for filters (only Racks and Shelves for Locations)
  const uniqueTypes = Array.from(new Set(mockStorageLocations.filter(l => l.type === "Rack" || l.type === "Shelf").map(l => l.type))).sort();
  const uniqueStatuses = Array.from(new Set(mockStorageLocations.filter(l => l.type === "Rack" || l.type === "Shelf").map(l => l.status))).sort();

  // Count active filters
  const hasActiveFilters = selectedTypes.size > 0 || selectedStatuses.size > 0;
  const totalFilterCount = selectedTypes.size + selectedStatuses.size;

  const clearAllFilters = () => {
    setSelectedTypes(new Set());
    setSelectedStatuses(new Set());
    setActiveFilter(null);
  };

  const clearAdvancedFilters = () => {
    setSelectedTypes(new Set());
    setSelectedStatuses(new Set());
  };

  const handleTileClick = (filterKey: string) => {
    // Toggle filter: if clicking the same tile, clear the filter
    setActiveFilter(activeFilter === filterKey ? null : filterKey);
  };

  const toggleFilterOption = (category: 'type' | 'status', value: string) => {
    if (category === 'type') {
      const newSet = new Set(selectedTypes);
      if (newSet.has(value)) {
        newSet.delete(value);
      } else {
        newSet.add(value);
      }
      setSelectedTypes(newSet);
    } else if (category === 'status') {
      const newSet = new Set(selectedStatuses);
      if (newSet.has(value)) {
        newSet.delete(value);
      } else {
        newSet.add(value);
      }
      setSelectedStatuses(newSet);
    }
  };

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.filter-dropdown')) {
        setActiveDropdown(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle status change
  const handleStatusChange = (status: string) => {
    if (!selectedLocation) return;
    
    // Check if location has current allocations
    if (locationCurrentAllocations.length > 0) {
      setShowAllocationWarning(true);
      return;
    }
    
    setNewStatus(status);
    setShowStatusConfirmation(true);
  };

  const confirmStatusChange = () => {
    if (!selectedLocation) return;
    
    // Update the location status in the data
    selectedLocation.status = newStatus;
    setShowStatusConfirmation(false);
    
    // Show success toast
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    toast.textContent = `Status updated to ${newStatus} successfully`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  // Handle report generation
  const handleGenerateReport = () => {
    // Set default date range (last 30 days)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    
    setReportStartDate(startDate.toISOString().split('T')[0]);
    setReportEndDate(endDate.toISOString().split('T')[0]);
    setShowDateRangeDialog(true);
  };

  const confirmGenerateReport = () => {
    if (!selectedLocation || !reportStartDate || !reportEndDate) return;
    
    // Generate mock report data
    const start = new Date(reportStartDate);
    const end = new Date(reportEndDate);
    const data: any[] = [];
    
    // Generate status change events
    const statusChanges = [
      { type: 'Status Change', date: new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())), oldValue: 'Available', newValue: 'Unavailable', user: 'John Smith' },
      { type: 'Status Change', date: new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())), oldValue: 'Unavailable', newValue: 'Available', user: 'Sarah Johnson' },
      { type: 'Status Change', date: new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())), oldValue: 'Available', newValue: 'Blocked', user: 'Mike Davis' },
    ];
    
    // Generate inventory change events
    const inventoryChanges = [
      { type: 'Inventory Change', date: new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())), item: 'SKU-1001', oldQty: 150, newQty: 200, change: '+50', user: 'Emily Chen' },
      { type: 'Inventory Change', date: new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())), item: 'SKU-2045', oldQty: 0, newQty: 75, change: '+75', user: 'John Smith' },
      { type: 'Inventory Change', date: new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())), item: 'SKU-1001', oldQty: 200, newQty: 125, change: '-75', user: 'Sarah Johnson' },
      { type: 'Inventory Change', date: new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())), item: 'SKU-3078', oldQty: 50, newQty: 100, change: '+50', user: 'Mike Davis' },
      { type: 'Inventory Change', date: new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())), item: 'SKU-2045', oldQty: 75, newQty: 25, change: '-50', user: 'Emily Chen' },
    ];
    
    // Combine and sort by date
    const allEvents = [...statusChanges, ...inventoryChanges]
      .filter(event => event.date >= start && event.date <= end)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
    
    setReportData(allEvents);
    setShowDateRangeDialog(false);
    setShowReportDialog(true);
  };

  // Handle add location
  const handleAddLocation = () => {
    setNewLocationData({ type: '', id: '', parentLocation: '' });
    setAddLocationStep('form');
    setShowAddLocation(true);
    setSelectedLocation(null);
  };

  const handleSaveNewLocation = () => {
    // Validate required fields
    if (!newLocationData.type || !newLocationData.id) {
      return;
    }
    
    // Move to confirmation step
    setAddLocationStep('confirmation');
  };

  const confirmAddLocation = () => {
    // Create the new location object
    const newLocation: StorageLocation = {
      id: `loc-${Date.now()}`,
      name: newLocationData.id,
      parentStorage: newLocationData.parentLocation || '-',
      status: 'Available',
      type: newLocationData.type,
      attribute1: '-',
      attribute2: '-',
      attribute3: '-',
      attribute4: '-',
      attribute5: '-',
      created: new Date().toISOString(),
      createdBy: 'Current User'
    };
    
    // Add to the locations array
    mockStorageLocations.push(newLocation);
    
    // Close panel and reset
    setShowAddLocation(false);
    setAddLocationStep('form');
    setNewLocationData({ type: '', id: '', parentLocation: '' });
    
    // Show success toast
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    toast.textContent = `Location ${newLocation.name} created successfully`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const cancelAddLocation = () => {
    setShowAddLocation(false);
    setAddLocationStep('form');
    setNewLocationData({ type: '', id: '', parentLocation: '' });
  };

  // Handle delete location
  const handleDeleteLocation = () => {
    if (!selectedLocation) return;
    
    // Check if location has current allocations
    if (locationCurrentAllocations.length > 0) {
      return;
    }
    
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteLocation = () => {
    if (!selectedLocation) return;
    
    // Find and remove the location from the array
    const index = mockStorageLocations.findIndex(loc => loc.id === selectedLocation.id);
    if (index !== -1) {
      mockStorageLocations.splice(index, 1);
    }
    
    // Close panel and confirmation
    setShowDeleteConfirmation(false);
    setSelectedLocation(null);
    
    // Show success toast
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    toast.textContent = `Location deleted successfully`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  // Handle bulk delete mode
  const handleBulkDeleteMode = () => {
    if (bulkDeleteMode) {
      // Cancel bulk delete mode
      setBulkDeleteMode(false);
      setSelectedLocationIds(new Set());
    } else {
      // Enter bulk delete mode
      setBulkDeleteMode(true);
      setSelectedLocationIds(new Set());
    }
  };

  const toggleLocationSelection = (locationId: string) => {
    const newSelected = new Set(selectedLocationIds);
    if (newSelected.has(locationId)) {
      newSelected.delete(locationId);
    } else {
      newSelected.add(locationId);
    }
    setSelectedLocationIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedLocationIds.size === filteredData.length) {
      // Deselect all
      setSelectedLocationIds(new Set());
    } else {
      // Select all
      const allIds = new Set(filteredData.map(loc => loc.id));
      setSelectedLocationIds(allIds);
    }
  };

  const handleConfirmBulkDelete = () => {
    if (selectedLocationIds.size === 0) return;
    setShowBulkDeleteConfirmation(true);
  };

  const confirmBulkDelete = () => {
    // Get locations with allocations (cannot be deleted)
    const locationsWithAllocations: StorageLocation[] = [];
    const locationsToDelete: StorageLocation[] = [];

    selectedLocationIds.forEach(id => {
      const location = mockStorageLocations.find(loc => loc.id === id);
      if (location) {
        const allocations = getCurrentAllocationsForLocation(location.name, location.status);
        if (allocations.length > 0) {
          locationsWithAllocations.push(location);
        } else {
          locationsToDelete.push(location);
        }
      }
    });

    // Delete the allowed locations
    locationsToDelete.forEach(location => {
      const index = mockStorageLocations.findIndex(loc => loc.id === location.id);
      if (index !== -1) {
        mockStorageLocations.splice(index, 1);
      }
    });

    // Close dialog and exit delete mode
    setShowBulkDeleteConfirmation(false);
    setBulkDeleteMode(false);
    setSelectedLocationIds(new Set());

    // Show success toast
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    toast.textContent = `${locationsToDelete.length} location(s) deleted successfully`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  // Handle move location
  const handleMoveLocation = () => {
    if (!moveToLocation || !selectedLocation) return;
    setShowMoveConfirmation(true);
  };

  const confirmMoveLocation = () => {
    if (!selectedLocation || !moveToLocation) return;

    // Find the destination location
    const destinationLocation = mockStorageLocations.find(loc => loc.id === moveToLocation);
    if (!destinationLocation) return;

    // Update the selected location's parent storage
    const locationIndex = mockStorageLocations.findIndex(loc => loc.id === selectedLocation.id);
    if (locationIndex !== -1) {
      mockStorageLocations[locationIndex].parentStorage = destinationLocation.name;
    }

    // Close dialog and reset
    setShowMoveConfirmation(false);
    setMoveToLocation('');
    setSelectedLocation(mockStorageLocations[locationIndex]);

    // Show success toast
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    toast.textContent = `Location moved successfully to ${destinationLocation.name}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Available":
        return <CheckCircle2 size={16} className="text-green-500" />;
      case "Occupied":
        return <Archive size={16} className="text-blue-500" />;
      case "Reserved":
        return <Clock size={16} className="text-yellow-500" />;
      case "Blocked":
        return <AlertCircle size={16} className="text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "text-green-500";
      case "Occupied":
        return "text-blue-500";
      case "Reserved":
        return "text-yellow-500";
      case "Blocked":
        return "text-red-500";
      default:
        return "text-zinc-400";
    }
  };

  const renderCellValue = (field: string, value: any, item: StorageLocation) => {
    switch (field) {
      case "name":
        return (
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-[#0d9488] dark:text-[#50e080]" />
            <span className="font-mono font-medium text-white">{value}</span>
          </div>
        );
      case "status":
        return (
          <div className="flex items-center gap-2">
            {getStatusIcon(value)}
            <span className={`font-medium ${getStatusColor(value)}`}>{value}</span>
          </div>
        );
      case "created":
        return <span className="text-zinc-400 text-sm">{formatDate(value)}</span>;
      case "isMoveable":
        return (
          <div className="flex items-center gap-2">
            {value ? (
              <>
                <CheckCircle2 size={14} className="text-green-500" />
                <span className="text-green-500 font-medium">Yes</span>
              </>
            ) : (
              <>
                <X size={14} className="text-red-500" />
                <span className="text-red-500 font-medium">No</span>
              </>
            )}
          </div>
        );
      case "parentStorage":
      case "type":
      case "createdBy":
        return <span className="text-zinc-300">{value}</span>;
      case "attribute1":
      case "attribute2":
      case "attribute3":
      case "attribute4":
      case "attribute5":
        return <span className="text-zinc-400 text-sm">{value}</span>;
      default:
        return <span className="text-zinc-400">{value}</span>;
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredData = mockStorageLocations.filter((item) => {
    // Filter to only Racks and Shelves for Locations screen
    if (item.type !== "Rack" && item.type !== "Shelf") {
      return false;
    }

    // Apply search filter
    const matchesSearch = Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply tile filter
    let matchesTileFilter = true;
    if (activeFilter === "available") {
      matchesTileFilter = item.status === "Available";
    } else if (activeFilter === "occupied") {
      matchesTileFilter = item.status === "Occupied";
    } else if (activeFilter === "reserved") {
      matchesTileFilter = item.status === "Reserved";
    } else if (activeFilter === "blocked") {
      matchesTileFilter = item.status === "Blocked";
    }

    // Apply advanced filters
    const matchesType = selectedTypes.size === 0 || selectedTypes.has(item.type);
    const matchesStatus = selectedStatuses.size === 0 || selectedStatuses.has(item.status);

    return matchesSearch && matchesTileFilter && matchesType && matchesStatus;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ChevronUp size={16} />
    ) : (
      <ChevronDown size={16} />
    );
  };

  // Check if this is the initial state (no search or filters applied)
  // Note: "total" activeFilter should show the grid, not OPTO
  const isInitialState = searchTerm === "" && selectedTypes.size === 0 && selectedStatuses.size === 0 && !activeFilter;

  // Group data by parent storage
  const groupedData = sortedData.reduce((groups, item) => {
    const parent = item.parentStorage;
    if (!groups[parent]) {
      groups[parent] = [];
    }
    groups[parent].push(item);
    return groups;
  }, {} as Record<string, StorageLocation[]>);

  const toggleGroup = (groupName: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupName)) {
      newExpanded.delete(groupName);
    } else {
      newExpanded.add(groupName);
    }
    setExpandedGroups(newExpanded);
  };

  const expandAll = () => {
    setExpandedGroups(new Set(Object.keys(groupedData)));
  };

  const collapseAll = () => {
    setExpandedGroups(new Set());
  };

  // Column display names
  const columnNames: Record<string, string> = {
    name: "Name",
    parentStorage: "Parent Storage",
    status: "Status",
    type: "Type",
    attribute1: "Attribute 1",
    attribute2: "Attribute 2",
    attribute3: "Attribute 3",
    attribute4: "Attribute 4",
    attribute5: "Attribute 5",
    created: "Created",
    createdBy: "Created By",
    isMoveable: "Is Moveable",
  };

  return (
    <>
      <div className="flex h-screen overflow-hidden">
        {/* Main Content Area */}
      <div className={`flex-1 overflow-y-auto p-8 transition-all duration-300 ${selectedLocation ? 'mr-[600px]' : ''}`}>
      {/* Breadcrumb and Header Combined */}
      <div className="mb-3 flex items-center justify-between gap-4">
        {/* Breadcrumb with Locations Icon */}
        <nav className="flex items-center gap-2 text-sm">
          <Link to="/app/home" className="text-zinc-600 dark:text-zinc-400 hover:text-[#0d9488] dark:hover:text-[#50e080] transition-colors flex items-center gap-1">
            <Home size={14} />
            Home
          </Link>
          <ChevronRight size={16} className="text-zinc-400 dark:text-zinc-600" />
          <Link to="/app/navigation" className="text-zinc-600 dark:text-zinc-400 hover:text-[#0d9488] dark:hover:text-[#50e080] transition-colors">
            Navigation
          </Link>
          <ChevronRight size={16} className="text-zinc-400 dark:text-zinc-600" />
          <Link to="/app/navigation?section=operations" className="text-zinc-600 dark:text-zinc-400 hover:text-[#0d9488] dark:hover:text-[#50e080] transition-colors">
            Operations
          </Link>
          <ChevronRight size={16} className="text-zinc-400 dark:text-zinc-600" />
          <span className="text-zinc-900 dark:text-white font-semibold text-lg flex items-center gap-2">
            <MapPin size={20} className="text-[#0d9488] dark:text-[#50e080]" />
            Locations
          </span>
        </nav>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className={`px-4 py-2 text-white rounded-lg transition-colors flex items-center gap-2 border ${
                showFilterPanel || hasActiveFilters
                  ? "bg-[#0d9488] dark:bg-[#50e080] hover:bg-[#0b7a70] dark:hover:bg-[#3bc76a] border-[#0d9488] dark:border-[#50e080]"
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
          </div>
          <button className="px-4 py-2 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-lg transition-colors flex items-center gap-2 border border-zinc-300 dark:border-zinc-700">
            <Download size={18} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="mb-8">

        {/* Stats Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {/* Total Locations */}
          <button
            onClick={() => {
              setActiveFilter(activeFilter === "total" ? null : "total");
              setSelectedTypes(new Set());
              setSelectedStatuses(new Set());
            }}
            className={`bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 rounded-lg p-4 transition-all ${
              activeFilter === "total" ? "ring-2 ring-[#50e080]" : ""
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-zinc-700 rounded-lg flex items-center justify-center">
                <Warehouse size={20} className="text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-2xl font-bold text-white">{totalLocations}</p>
                <p className="text-xs text-zinc-400">Total Locations</p>
              </div>
            </div>
          </button>

          {/* Available */}
          <button
            onClick={() => handleTileClick("available")}
            className={`bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 rounded-lg p-4 transition-all ${
              activeFilter === "available" ? "ring-2 ring-[#50e080]" : ""
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle2 size={20} className="text-green-500" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-2xl font-bold text-white">{availableLocations}</p>
                <p className="text-xs text-zinc-400">Available</p>
              </div>
            </div>
          </button>

          {/* Occupied */}
          <button
            onClick={() => handleTileClick("occupied")}
            className={`bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 rounded-lg p-4 transition-all ${
              activeFilter === "occupied" ? "ring-2 ring-[#50e080]" : ""
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Archive size={20} className="text-blue-500" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-2xl font-bold text-white">{occupiedLocations}</p>
                <p className="text-xs text-zinc-400">Occupied</p>
              </div>
            </div>
          </button>

          {/* Reserved */}
          <button
            onClick={() => handleTileClick("reserved")}
            className={`bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 rounded-lg p-4 transition-all ${
              activeFilter === "reserved" ? "ring-2 ring-[#50e080]" : ""
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Clock size={20} className="text-yellow-500" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-2xl font-bold text-white">{reservedLocations}</p>
                <p className="text-xs text-zinc-400">Reserved</p>
              </div>
            </div>
          </button>

          {/* Blocked */}
          <button
            onClick={() => handleTileClick("blocked")}
            className={`bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 rounded-lg p-4 transition-all ${
              activeFilter === "blocked" ? "ring-2 ring-[#50e080]" : ""
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                <AlertCircle size={20} className="text-red-500" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-2xl font-bold text-white">{blockedLocations}</p>
                <p className="text-xs text-zinc-400">Blocked</p>
              </div>
            </div>
          </button>

          {/* Utilization Rate */}
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-[#0d9488]/20 dark:bg-[#50e080]/20 rounded-lg flex items-center justify-center">
                <TrendingUp size={20} className="text-[#0d9488] dark:text-[#50e080]" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-2xl font-bold text-white">{utilizationRate}%</p>
                <p className="text-xs text-zinc-400">Utilization</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilterPanel && (
        <div className="mb-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-zinc-900 dark:text-white font-semibold">Filters</h3>
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-[#0d9488] dark:text-[#50e080] hover:underline transition-colors"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={() => setShowFilterPanel(false)}
                className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 filter-dropdown">
            {/* Type Filter - Compact Multi-Select */}
            <div className="relative">
              <label className="text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-2 block">Type</label>
              <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2 min-h-[42px]">
                {/* Selected Items as Chips */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {Array.from(selectedTypes).map((type) => (
                    <span
                      key={type}
                      className="inline-flex items-center gap-1.5 px-2 py-1 bg-[#0d9488] dark:bg-[#50e080] text-white rounded text-xs font-medium"
                    >
                      {type}
                      <button
                        onClick={() => toggleFilterOption('type', type)}
                        className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                {/* Search and Dropdown */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search or select..."
                    value={typeSearch}
                    onChange={(e) => setTypeSearch(e.target.value)}
                    onFocus={() => setActiveDropdown('type')}
                    className="w-full bg-transparent text-zinc-900 dark:text-zinc-300 text-sm placeholder-zinc-500 outline-none"
                  />
                  {/* Dropdown Options */}
                  {activeDropdown === 'type' && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-xl max-h-48 overflow-y-auto z-10 filter-dropdown">
                      {uniqueTypes.filter(type => type.toLowerCase().includes(typeSearch.toLowerCase())).map((type) => (
                        <button
                          key={type}
                          onClick={() => {
                            toggleFilterOption('type', type);
                            setTypeSearch('');
                          }}
                          className={`w-full px-3 py-2 text-left text-sm transition-colors flex items-center gap-2 ${
                            selectedTypes.has(type)
                              ? 'bg-[#0d9488]/10 dark:bg-[#50e080]/10 text-[#0d9488] dark:text-[#50e080]'
                              : 'text-zinc-900 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                            selectedTypes.has(type)
                              ? 'bg-[#0d9488] dark:bg-[#50e080] border-[#0d9488] dark:border-[#50e080]'
                              : 'border-zinc-300 dark:border-zinc-600'
                          }`}>
                            {selectedTypes.has(type) && <CheckCircle2 size={12} className="text-white" />}
                          </div>
                          {type}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Status Filter - Compact Multi-Select */}
            <div className="relative">
              <label className="text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-2 block">Status</label>
              <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2 min-h-[42px]">
                {/* Selected Items as Chips */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {Array.from(selectedStatuses).map((status) => (
                    <span
                      key={status}
                      className="inline-flex items-center gap-1.5 px-2 py-1 bg-[#0d9488] dark:bg-[#50e080] text-white rounded text-xs font-medium"
                    >
                      {getStatusIcon(status)}
                      {status}
                      <button
                        onClick={() => toggleFilterOption('status', status)}
                        className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                {/* Search and Dropdown */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search or select..."
                    value={statusSearch}
                    onChange={(e) => setStatusSearch(e.target.value)}
                    onFocus={() => setActiveDropdown('status')}
                    className="w-full bg-transparent text-zinc-900 dark:text-zinc-300 text-sm placeholder-zinc-500 outline-none"
                  />
                  {/* Dropdown Options */}
                  {activeDropdown === 'status' && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-xl max-h-48 overflow-y-auto z-10 filter-dropdown">
                      {uniqueStatuses.filter(status => status.toLowerCase().includes(statusSearch.toLowerCase())).map((status) => (
                        <button
                          key={status}
                          onClick={() => {
                            toggleFilterOption('status', status);
                            setStatusSearch('');
                          }}
                          className={`w-full px-3 py-2 text-left text-sm transition-colors flex items-center gap-2 ${
                            selectedStatuses.has(status)
                              ? 'bg-[#0d9488]/10 dark:bg-[#50e080]/10 text-[#0d9488] dark:text-[#50e080]'
                              : 'text-zinc-900 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                            selectedStatuses.has(status)
                              ? 'bg-[#0d9488] dark:bg-[#50e080] border-[#0d9488] dark:border-[#50e080]'
                              : 'border-zinc-300 dark:border-zinc-600'
                          }`}>
                            {selectedStatuses.has(status) && <CheckCircle2 size={12} className="text-white" />}
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(status)}
                            {status}
                          </div>
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

      {/* Search Bar */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
            <input
              type="text"
              placeholder="Search locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#0d9488] dark:focus:ring-[#50e080] focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setGroupByParent(!groupByParent)}
            className={`px-4 py-3 rounded-lg transition-colors flex items-center gap-2 border whitespace-nowrap ${
              groupByParent
                ? "bg-[#0d9488] dark:bg-[#50e080] hover:bg-[#0b7a70] dark:hover:bg-[#3bc76a] border-[#0d9488] dark:border-[#50e080] text-white"
                : "bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white"
            }`}
          >
            <Layers size={18} />
            <span>Group by Parent</span>
          </button>
          {groupByParent && (
            <>
              <button
                onClick={expandAll}
                className="px-4 py-3 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-lg transition-colors border border-zinc-300 dark:border-zinc-700 whitespace-nowrap"
              >
                Expand All
              </button>
              <button
                onClick={collapseAll}
                className="px-4 py-3 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-lg transition-colors border border-zinc-300 dark:border-zinc-700 whitespace-nowrap"
              >
                Collapse All
              </button>
            </>
          )}
          <button
            onClick={handleAddLocation}
            title="Add Location"
            className="p-3 bg-[#0d9488] dark:bg-[#50e080] hover:bg-[#0b7a70] dark:hover:bg-[#3bc76a] text-white rounded-lg transition-colors border border-[#0d9488] dark:border-[#50e080]"
          >
            <Plus size={18} />
          </button>
          <button
            onClick={bulkDeleteMode ? handleConfirmBulkDelete : handleBulkDeleteMode}
            title={bulkDeleteMode ? "Confirm Deletion" : "Delete Locations"}
            className={`px-4 py-3 rounded-lg transition-colors flex items-center gap-2 border whitespace-nowrap ${
              bulkDeleteMode
                ? "bg-red-500 hover:bg-red-600 border-red-500 text-white"
                : "bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white"
            }`}
          >
            <Trash2 size={18} />
            {bulkDeleteMode && <span>Confirm</span>}
          </button>
          {bulkDeleteMode && (
            <button
              onClick={handleBulkDeleteMode}
              className="px-4 py-3 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-lg transition-colors border border-zinc-300 dark:border-zinc-700 whitespace-nowrap"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Data Grid or Ask OPTO prompt */}
      {isInitialState ? (
        <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 border border-zinc-700 rounded-lg p-16 flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-gradient-to-br from-[#0d9488] to-[#50e080] rounded-full flex items-center justify-center mb-6 shadow-lg shadow-[#0d9488]/20">
            <Sparkles size={40} className="text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">Ready to Explore Locations</h3>
          <p className="text-zinc-400 mb-6 text-center max-w-md">
            Use the filters above to view specific locations, or ask OPTO to help you find what you need.
          </p>
          <button
            onClick={() => setShowAI(true)}
            className="px-6 py-3 bg-gradient-to-r from-[#0d9488] to-[#50e080] hover:from-[#0b7a70] hover:to-[#3bc76a] text-white rounded-lg font-medium transition-all flex items-center gap-2 shadow-lg shadow-[#0d9488]/20"
          >
            <Sparkles size={20} />
            Ask OPTO
          </button>
        </div>
      ) : (
        <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg overflow-hidden">
          {/* Table Header */}
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full">
                <thead className="bg-zinc-900/50 border-b border-zinc-700">
                  <tr>
                    {bulkDeleteMode && (
                      <th className="px-4 py-3 text-left w-12">
                        <input
                          type="checkbox"
                          checked={selectedLocationIds.size === filteredData.length && filteredData.length > 0}
                          onChange={toggleSelectAll}
                          className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-[#0d9488] dark:text-[#50e080] focus:ring-2 focus:ring-[#0d9488] dark:focus:ring-[#50e080] cursor-pointer"
                        />
                      </th>
                    )}
                    {orderedColumns.map((column) => (
                      <th
                        key={column}
                        onClick={() => handleSort(column as SortField)}
                        className={`px-4 py-3 text-left text-xs font-semibold text-zinc-300 uppercase tracking-wider cursor-pointer hover:bg-zinc-800/50 transition-colors ${
                          storageLocationsPinnedColumns.includes(column) ? "sticky left-0 bg-zinc-900/80 z-10" : ""
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {columnNames[column]}
                          <SortIcon field={column as SortField} />
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-700">
                  {groupByParent ? (
                    // Grouped view
                    Object.keys(groupedData).sort().map((parentName) => {
                      const group = groupedData[parentName];
                      const isExpanded = expandedGroups.has(parentName);
                      return (
                        <>
                          {/* Group Header */}
                          <tr
                            key={`group-${parentName}`}
                            onClick={() => toggleGroup(parentName)}
                            className="bg-zinc-900/70 hover:bg-zinc-900 cursor-pointer transition-colors"
                          >
                            <td colSpan={bulkDeleteMode ? orderedColumns.length + 1 : orderedColumns.length} className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                {isExpanded ? (
                                  <ChevronDown size={18} className="text-[#0d9488] dark:text-[#50e080]" />
                                ) : (
                                  <ChevronRight size={18} className="text-zinc-400" />
                                )}
                                <Box size={18} className="text-[#0d9488] dark:text-[#50e080]" />
                                <span className="font-semibold text-white">{parentName}</span>
                                <span className="text-sm text-zinc-400">
                                  ({group.length} {group.length === 1 ? 'location' : 'locations'})
                                </span>
                              </div>
                            </td>
                          </tr>
                          
                          {/* Group Items */}
                          {isExpanded && group.map((item) => (
                            <tr
                              key={item.id}
                              onClick={(e) => {
                                if (!bulkDeleteMode) {
                                  setSelectedLocation(item);
                                }
                              }}
                              className="hover:bg-zinc-800/30 transition-colors cursor-pointer"
                            >
                              {bulkDeleteMode && (
                                <td className="px-4 py-3">
                                  <input
                                    type="checkbox"
                                    checked={selectedLocationIds.has(item.id)}
                                    onChange={(e) => {
                                      e.stopPropagation();
                                      toggleLocationSelection(item.id);
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-[#0d9488] dark:text-[#50e080] focus:ring-2 focus:ring-[#0d9488] dark:focus:ring-[#50e080] cursor-pointer"
                                  />
                                </td>
                              )}
                              {orderedColumns.map((column) => (
                                <td 
                                  key={column} 
                                  className={`px-4 py-3 whitespace-nowrap ${
                                    storageLocationsPinnedColumns.includes(column) ? "sticky left-0 bg-zinc-800/50 z-10" : ""
                                  }`}
                                >
                                  {renderCellValue(column, item[column as keyof StorageLocation], item)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </>
                      );
                    })
                  ) : (
                    // Flat view
                    sortedData.map((item) => (
                      <tr
                        key={item.id}
                        onClick={() => {
                          if (!bulkDeleteMode) {
                            setSelectedLocation(item);
                          }
                        }}
                        className="hover:bg-zinc-800/30 transition-colors cursor-pointer"
                      >
                        {bulkDeleteMode && (
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={selectedLocationIds.has(item.id)}
                              onChange={(e) => {
                                e.stopPropagation();
                                toggleLocationSelection(item.id);
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-[#0d9488] dark:text-[#50e080] focus:ring-2 focus:ring-[#0d9488] dark:focus:ring-[#50e080] cursor-pointer"
                            />
                          </td>
                        )}
                        {orderedColumns.map((column) => (
                          <td 
                            key={column} 
                            className={`px-4 py-3 whitespace-nowrap ${
                              storageLocationsPinnedColumns.includes(column) ? "sticky left-0 bg-zinc-800/50 z-10" : ""
                            }`}
                          >
                            {renderCellValue(column, item[column as keyof StorageLocation], item)}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-zinc-900/50 border-t border-zinc-700 px-4 py-3 flex items-center justify-between">
            <div className="text-sm text-zinc-400">
              Showing <span className="font-medium text-white">{sortedData.length}</span> of{" "}
              <span className="font-medium text-white">{totalLocations}</span> locations
              {groupByParent && (
                <span className="ml-2">
                  in <span className="font-medium text-white">{Object.keys(groupedData).length}</span> {Object.keys(groupedData).length === 1 ? 'group' : 'groups'}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
      </div>

      {/* Right Side Panel */}
      {selectedLocation && (
        <div className="fixed right-0 top-0 h-full w-[600px] bg-zinc-900 border-l border-zinc-700 shadow-2xl overflow-y-auto z-30 animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="bg-zinc-900 border-b border-zinc-700 p-6 sticky top-0 z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#0d9488]/20 dark:bg-[#50e080]/20 rounded-lg flex items-center justify-center">
                    <MapPin size={24} className="text-[#0d9488] dark:text-[#50e080]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white font-mono">{selectedLocation.name}</h3>
                    <p className="text-sm text-zinc-400">{selectedLocation.parentStorage}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedLocation(null)}
                  className="text-zinc-400 hover:text-white transition-colors p-2"
                >
                  <X size={20} />
                </button>
              </div>
              
              {/* Status Badge */}
              <div className="flex items-center gap-2 mb-4">
                {getStatusIcon(selectedLocation.status)}
                <span className={`font-medium ${getStatusColor(selectedLocation.status)}`}>
                  {selectedLocation.status}
                </span>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 border-b border-zinc-700 -mb-px">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                    activeTab === 'details'
                      ? 'text-[#0d9488] dark:text-[#50e080] border-[#0d9488] dark:border-[#50e080]'
                      : 'text-zinc-400 border-transparent hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Info size={16} />
                    <span>Details</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('inventory')}
                  className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                    activeTab === 'inventory'
                      ? 'text-[#0d9488] dark:text-[#50e080] border-[#0d9488] dark:border-[#50e080]'
                      : 'text-zinc-400 border-transparent hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Package size={16} />
                    <span>Inventory</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('events')}
                  className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                    activeTab === 'events'
                      ? 'text-[#0d9488] dark:text-[#50e080] border-[#0d9488] dark:border-[#50e080]'
                      : 'text-zinc-400 border-transparent hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <History size={16} />
                    <span>Events</span>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('actions');
                    setActiveAction(null);
                  }}
                  className={`ml-auto px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                    activeTab === 'actions'
                      ? 'border-orange-500 text-white bg-orange-500/10'
                      : 'border-transparent text-orange-400 hover:text-orange-300 hover:bg-orange-500/5'
                  }`}
                >
                  <Zap size={16} />
                  Actions
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Details Tab */}
              {activeTab === 'details' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Location Information</h4>
                    <div className="bg-zinc-800/50 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="text-sm text-zinc-400">Name</span>
                        <span className="text-sm text-white font-mono font-medium">{selectedLocation.name}</span>
                      </div>
                      <div className="flex justify-between items-start">
                        <span className="text-sm text-zinc-400">Parent Storage</span>
                        <span className="text-sm text-white">{selectedLocation.parentStorage}</span>
                      </div>
                      <div className="flex justify-between items-start">
                        <span className="text-sm text-zinc-400">Type</span>
                        <span className="text-sm text-white">{selectedLocation.type}</span>
                      </div>
                      <div className="flex justify-between items-start">
                        <span className="text-sm text-zinc-400">Status</span>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(selectedLocation.status)}
                          <span className={`text-sm font-medium ${getStatusColor(selectedLocation.status)}`}>
                            {selectedLocation.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Attributes</h4>
                    <div className="bg-zinc-800/50 rounded-lg p-4 space-y-3">
                      {selectedLocation.attribute1 && (
                        <div className="flex justify-between items-start">
                          <span className="text-sm text-zinc-400">Attribute 1</span>
                          <span className="text-sm text-white">{selectedLocation.attribute1}</span>
                        </div>
                      )}
                      {selectedLocation.attribute2 && (
                        <div className="flex justify-between items-start">
                          <span className="text-sm text-zinc-400">Attribute 2</span>
                          <span className="text-sm text-white">{selectedLocation.attribute2}</span>
                        </div>
                      )}
                      {selectedLocation.attribute3 && (
                        <div className="flex justify-between items-start">
                          <span className="text-sm text-zinc-400">Attribute 3</span>
                          <span className="text-sm text-white">{selectedLocation.attribute3}</span>
                        </div>
                      )}
                      {selectedLocation.attribute4 && (
                        <div className="flex justify-between items-start">
                          <span className="text-sm text-zinc-400">Attribute 4</span>
                          <span className="text-sm text-white">{selectedLocation.attribute4}</span>
                        </div>
                      )}
                      {selectedLocation.attribute5 && (
                        <div className="flex justify-between items-start">
                          <span className="text-sm text-zinc-400">Attribute 5</span>
                          <span className="text-sm text-white">{selectedLocation.attribute5}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Metadata</h4>
                    <div className="bg-zinc-800/50 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="text-sm text-zinc-400">Created</span>
                        <span className="text-sm text-white">{formatDate(selectedLocation.created)}</span>
                      </div>
                      <div className="flex justify-between items-start">
                        <span className="text-sm text-zinc-400">Created By</span>
                        <span className="text-sm text-white">{selectedLocation.createdBy}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Inventory Tab */}
              {activeTab === 'inventory' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Current Inventory</h4>
                    {locationInventory.length > 0 && (
                      <span className="text-xs bg-[#0d9488]/20 dark:bg-[#50e080]/20 text-[#0d9488] dark:text-[#50e080] px-2 py-1 rounded">
                        {locationInventory.length} {locationInventory.length === 1 ? 'item' : 'items'}
                      </span>
                    )}
                  </div>

                  {locationInventory.length > 0 ? (
                    <div className="space-y-3">
                      {locationInventory.map((inv) => (
                        <div key={inv.id} className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700 hover:border-[#0d9488] dark:hover:border-[#50e080] transition-colors">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                <Package size={20} className="text-blue-500" />
                              </div>
                              <div>
                                <p className="font-mono text-sm font-medium text-white">{inv.itemNumber}</p>
                                <p className="text-xs text-zinc-400">{inv.itemDescription}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-white">{inv.quantity}</p>
                              <p className="text-xs text-zinc-400">{inv.uom}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div>
                              <span className="text-zinc-400">Lot: </span>
                              <span className="text-white font-mono">{inv.lotNumber}</span>
                            </div>
                            {inv.serialNumber && (
                              <div>
                                <span className="text-zinc-400">Serial: </span>
                                <span className="text-white font-mono">{inv.serialNumber}</span>
                              </div>
                            )}
                            <div>
                              <span className="text-zinc-400">Received: </span>
                              <span className="text-white">{formatDate(inv.receivedDate)}</span>
                            </div>
                            {inv.expirationDate && (
                              <div>
                                <span className="text-zinc-400">Expires: </span>
                                <span className="text-white">{new Date(inv.expirationDate).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-zinc-800/30 rounded-lg p-8 text-center">
                      <Package size={48} className="mx-auto mb-3 text-zinc-600" />
                      <p className="text-zinc-400 text-sm">No inventory in this location</p>
                    </div>
                  )}
                </div>
              )}

              {/* Events Tab */}
              {activeTab === 'events' && (
                <div className="space-y-6">
                  {/* Current Allocations - Only shown if present */}
                  {locationCurrentAllocations.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Current Allocations</h4>
                        <span className="text-xs bg-[#0d9488]/20 dark:bg-[#50e080]/20 text-[#0d9488] dark:text-[#50e080] px-2 py-1 rounded">
                          {locationCurrentAllocations.length} active
                        </span>
                      </div>

                      <div className="space-y-3">
                        {locationCurrentAllocations.map((alloc) => (
                          <button
                            key={alloc.id}
                            onClick={() => navigate(`/app/worklist?workList=${alloc.workList}&openPanel=true`)}
                            className="w-full bg-zinc-800/50 rounded-lg p-4 border border-zinc-700 hover:border-[#0d9488] dark:hover:border-[#50e080] transition-colors text-left group"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${
                                  alloc.status === 'In Progress' ? 'bg-blue-500' :
                                  alloc.status === 'Queued' ? 'bg-yellow-500' :
                                  alloc.status === 'Warning' ? 'bg-red-500' :
                                  'bg-zinc-500'
                                }`} />
                                <span className="font-mono text-sm text-white font-medium group-hover:text-[#0d9488] dark:group-hover:text-[#50e080] transition-colors">{alloc.workList}</span>
                                <ChevronRight size={16} className="text-zinc-600 group-hover:text-[#0d9488] dark:group-hover:text-[#50e080] transition-colors" />
                              </div>
                              <span className={`text-xs px-2 py-1 rounded ${
                                alloc.status === 'In Progress' ? 'bg-blue-500/20 text-blue-400' :
                                alloc.status === 'Queued' ? 'bg-yellow-500/20 text-yellow-400' :
                                alloc.status === 'Warning' ? 'bg-red-500/20 text-red-400' :
                                'bg-zinc-500/20 text-zinc-400'
                              }`}>
                                {alloc.status}
                              </span>
                            </div>
                            <div className="space-y-2 text-xs">
                              <div className="flex items-center gap-4">
                                <div className="flex-1">
                                  <span className="text-zinc-400">Work Line: </span>
                                  <span className="text-white font-mono">{alloc.workLine}</span>
                                </div>
                                <div className="flex-1">
                                  <span className="text-zinc-400">Operation: </span>
                                  <span className="text-white font-mono">{alloc.workOperation}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="flex-1">
                                  <span className="text-zinc-400">Type: </span>
                                  <span className="text-white">{alloc.workOperationType}</span>
                                </div>
                                <div className="flex-1">
                                  <span className="text-zinc-400">Created: </span>
                                  <span className="text-white">{formatDate(alloc.created)}</span>
                                </div>
                              </div>
                              <div>
                                <span className="text-zinc-400">Created By: </span>
                                <span className="text-white">{alloc.createdBy}</span>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Container Linkage Events */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Container Linkage History</h4>
                      {containerLinkageEvents.length > 0 && (
                        <span className="text-xs bg-zinc-700 text-zinc-300 px-2 py-1 rounded">
                          {containerLinkageEvents.length} linkage{containerLinkageEvents.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>

                    {containerLinkageEvents.length > 0 ? (
                      <div className="space-y-3">
                        {containerLinkageEvents.map((event) => (
                          <div
                            key={event.id}
                            className={`rounded-lg p-4 border ${
                              event.isCurrent
                                ? 'bg-[#0d9488]/10 dark:bg-[#50e080]/10 border-[#0d9488]/30 dark:border-[#50e080]/30'
                                : 'bg-zinc-800/30 border-zinc-700/50'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <Box size={16} className={event.isCurrent ? 'text-[#0d9488] dark:text-[#50e080]' : 'text-zinc-400'} />
                                <span className={`font-mono text-sm font-medium ${
                                  event.isCurrent ? 'text-[#0d9488] dark:text-[#50e080]' : 'text-zinc-300'
                                }`}>
                                  {event.containerName}
                                </span>
                              </div>
                              {event.isCurrent && (
                                <span className="text-xs bg-[#0d9488]/20 dark:bg-[#50e080]/20 text-[#0d9488] dark:text-[#50e080] px-2 py-1 rounded font-medium">
                                  Currently Linked
                                </span>
                              )}
                            </div>
                            <div className="space-y-2 text-xs text-zinc-400">
                              <div className="flex items-center gap-2">
                                <span>Type:</span>
                                <span className="text-zinc-300">{event.containerType}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span>Linked From:</span>
                                <span className="text-zinc-300">{formatDate(event.linkedFrom)}</span>
                              </div>
                              {event.linkedTo && (
                                <div className="flex items-center gap-2">
                                  <span>Linked To:</span>
                                  <span className="text-zinc-300">{formatDate(event.linkedTo)}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <span>Linked By:</span>
                                <span className="text-zinc-300">{event.createdBy}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-zinc-800/30 rounded-lg p-8 text-center">
                        <Box size={48} className="mx-auto mb-3 text-zinc-600" />
                        <p className="text-zinc-400 text-sm">No container linkage history for this location</p>
                      </div>
                    )}
                  </div>

                  {/* Allocation History */}
                  {locationAllocationHistory.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Allocation History</h4>
                        <span className="text-xs bg-zinc-700 text-zinc-300 px-2 py-1 rounded">
                          {locationAllocationHistory.length} event{locationAllocationHistory.length !== 1 ? 's' : ''}
                        </span>
                      </div>

                      <div className="space-y-3">
                        {locationAllocationHistory.map((hist) => (
                          <button
                            key={hist.id}
                            onClick={() => navigate(`/app/worklist?workList=${hist.workList}&openPanel=true`)}
                            className="w-full bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/50 hover:border-[#0d9488]/50 dark:hover:border-[#50e080]/50 transition-colors text-left group"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <CheckCircle2 size={16} className="text-green-500" />
                                <span className="font-mono text-sm text-zinc-300 group-hover:text-[#0d9488] dark:group-hover:text-[#50e080] transition-colors">{hist.workList}</span>
                                <ChevronRight size={16} className="text-zinc-600 group-hover:text-[#0d9488] dark:group-hover:text-[#50e080] transition-colors" />
                              </div>
                              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                                {hist.status}
                              </span>
                            </div>
                            <div className="space-y-2 text-xs text-zinc-400">
                              <div className="flex items-center gap-4">
                                <div className="flex-1">
                                  <span>Work Line: </span>
                                  <span className="text-zinc-300 font-mono">{hist.workLine}</span>
                                </div>
                                <div className="flex-1">
                                  <span>Operation: </span>
                                  <span className="text-zinc-300 font-mono">{hist.workOperation}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="flex-1">
                                  <span>Type: </span>
                                  <span className="text-zinc-300">{hist.workOperationType}</span>
                                </div>
                                <div className="flex-1">
                                  <span>Started: </span>
                                  <span className="text-zinc-300">{formatDate(hist.created)}</span>
                                </div>
                              </div>
                              {hist.completed && (
                                <div>
                                  <span>Completed: </span>
                                  <span className="text-zinc-300">{formatDate(hist.completed)}</span>
                                </div>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Actions Tab */}
              {activeTab === 'actions' && (
                <div className="max-w-2xl mx-auto space-y-6">
                  {/* Back Arrow - shown when an action is selected */}
                  {activeAction && (
                    <button
                      onClick={() => setActiveAction(null)}
                      className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group"
                    >
                      <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                      <span className="text-sm font-medium">Back to Actions</span>
                    </button>
                  )}

                  {/* Action Selection Header */}
                  {!activeAction && (
                    <div className="text-center py-2">
                      <p className="text-sm text-zinc-400">Select an action to perform</p>
                    </div>
                  )}

                  {/* Allocation Warning - Always show at top if allocations present */}
                  {locationCurrentAllocations.length > 0 && (
                    <div className="flex items-start gap-2 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                      <Info size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
                      <div className="text-xs text-blue-400">
                        <p className="font-medium mb-1">Current Allocations Present</p>
                        <p className="text-blue-400/80">This location has {locationCurrentAllocations.length} active allocation(s). Some actions are disabled while allocations are present.</p>
                      </div>
                    </div>
                  )}

                  {/* Action Tiles */}
                  {!activeAction && (
                    <div className="grid grid-cols-2 gap-3">
                      {/* Change Status Tile */}
                      <button
                        onClick={() => setActiveAction('status')}
                        className="p-4 rounded-lg border-2 border-zinc-700 bg-zinc-800/30 hover:border-zinc-600 hover:bg-zinc-800/50 text-left transition-all"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-8 h-8 bg-zinc-700 rounded-lg flex items-center justify-center">
                            <RefreshCw size={16} className="text-white" />
                          </div>
                          <h5 className="text-base font-semibold text-white">Change Status</h5>
                        </div>
                        <p className="text-xs text-zinc-400">Update location status</p>
                      </button>

                      {/* Move Location Tile */}
                      <button
                        onClick={() => setActiveAction('move')}
                        disabled={!selectedLocation.isMoveable}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          !selectedLocation.isMoveable
                            ? 'border-zinc-700 bg-zinc-800/20 opacity-50 cursor-not-allowed'
                            : 'border-zinc-700 bg-zinc-800/30 hover:border-zinc-600 hover:bg-zinc-800/50'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            !selectedLocation.isMoveable ? 'bg-zinc-700/50' : 'bg-zinc-700'
                          }`}>
                            <MapPin size={16} className="text-white" />
                          </div>
                          <h5 className="text-base font-semibold text-white">Move Location</h5>
                        </div>
                        <p className="text-xs text-zinc-400">
                          {selectedLocation.isMoveable ? 'Change parent location' : 'Not moveable'}
                        </p>
                      </button>

                      {/* Activity Report Tile */}
                      <button
                        onClick={() => setActiveAction('report')}
                        className="p-4 rounded-lg border-2 border-zinc-700 bg-zinc-800/30 hover:border-zinc-600 hover:bg-zinc-800/50 text-left transition-all"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-8 h-8 bg-zinc-700 rounded-lg flex items-center justify-center">
                            <BarChart3 size={16} className="text-white" />
                          </div>
                          <h5 className="text-base font-semibold text-white">Activity Report</h5>
                        </div>
                        <p className="text-xs text-zinc-400">Generate report</p>
                      </button>

                      {/* Delete Location Tile */}
                      <button
                        onClick={() => setActiveAction('delete')}
                        disabled={locationCurrentAllocations.length > 0}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          locationCurrentAllocations.length > 0
                            ? 'border-zinc-700 bg-zinc-800/20 opacity-50 cursor-not-allowed'
                            : 'border-red-500/30 bg-red-500/10 hover:border-red-500 hover:bg-red-500/20'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            locationCurrentAllocations.length > 0 ? 'bg-zinc-700' : 'bg-red-500/20'
                          }`}>
                            <Trash2 size={16} className={locationCurrentAllocations.length > 0 ? 'text-zinc-500' : 'text-red-400'} />
                          </div>
                          <h5 className="text-base font-semibold text-white">Delete</h5>
                        </div>
                        <p className="text-xs text-zinc-400">
                          {locationCurrentAllocations.length > 0 ? 'Has allocations' : 'Remove location'}
                        </p>
                      </button>
                    </div>
                  )}

                  {/* Status Change Action Content */}
                  {activeAction === 'status' && (
                    <div className="bg-zinc-800/30 border border-zinc-700 rounded-lg p-6">
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-white mb-2">Change Status</h4>
                        <p className="text-sm text-zinc-400">Update the availability status of this location</p>
                      </div>

                      {/* Current Status Display */}
                      <div className="mb-6 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-xs text-zinc-400 mb-1">Current Status</p>
                          <p className="text-base font-semibold text-white">{selectedLocation.status}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              locationCurrentAllocations.length > 0
                                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                : 'bg-zinc-700/50 text-zinc-400 border border-zinc-600/30'
                            }`}>
                              {locationCurrentAllocations.length > 0 ? 'Allocated' : 'Unallocated'}
                            </span>
                          </div>
                        </div>
                        {getStatusIcon(selectedLocation.status)}
                      </div>
                      </div>

                      {/* Status Selection */}
                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-3">Select New Status</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => handleStatusChange('Available')}
                          disabled={selectedLocation.status === 'Available' || locationCurrentAllocations.length > 0}
                          className={`p-4 rounded-lg border-2 text-left transition-all ${
                            selectedLocation.status === 'Available' || locationCurrentAllocations.length > 0
                              ? 'border-zinc-700 bg-zinc-800/20 opacity-50 cursor-not-allowed'
                              : 'border-zinc-700 bg-zinc-800/30 hover:border-green-600 hover:bg-green-500/10'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <CheckCircle2 size={20} className={selectedLocation.status === 'Available' || locationCurrentAllocations.length > 0 ? 'text-zinc-600' : 'text-green-400'} />
                            <h5 className="text-base font-semibold text-white">Available</h5>
                          </div>
                          <p className="text-xs text-zinc-400">Location is ready for use</p>
                        </button>

                        <button
                          onClick={() => handleStatusChange('Unavailable')}
                          disabled={selectedLocation.status === 'Unavailable' || locationCurrentAllocations.length > 0}
                          className={`p-4 rounded-lg border-2 text-left transition-all ${
                            selectedLocation.status === 'Unavailable' || locationCurrentAllocations.length > 0
                              ? 'border-zinc-700 bg-zinc-800/20 opacity-50 cursor-not-allowed'
                              : 'border-zinc-700 bg-zinc-800/30 hover:border-orange-600 hover:bg-orange-500/10'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <AlertCircle size={20} className={selectedLocation.status === 'Unavailable' || locationCurrentAllocations.length > 0 ? 'text-zinc-600' : 'text-orange-400'} />
                            <h5 className="text-base font-semibold text-white">Unavailable</h5>
                          </div>
                          <p className="text-xs text-zinc-400">Location is not in use</p>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Report Generation Action Content */}
                  {activeAction === 'report' && (
                    <div className="bg-zinc-800/30 border border-zinc-700 rounded-lg p-6">
                      <div className="mb-4">
                        <h4 className="text-lg font-semibold text-white mb-2">Activity Report</h4>
                        <p className="text-sm text-zinc-400">Generate a detailed activity report for this location</p>
                      </div>

                      <button
                      onClick={handleGenerateReport}
                      className="w-full p-4 rounded-lg border-2 border-zinc-700 bg-zinc-800/30 hover:border-blue-600 hover:bg-blue-500/10 text-left transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-zinc-700 group-hover:bg-blue-500 rounded-lg flex items-center justify-center transition-colors">
                          <BarChart3 size={20} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <h5 className="text-base font-semibold text-white mb-1">Generate Activity Report</h5>
                          <p className="text-xs text-zinc-400">View status changes and inventory modifications over time</p>
                        </div>
                          <ChevronRight size={20} className="text-zinc-500 group-hover:text-blue-400 transition-colors" />
                        </div>
                      </button>
                    </div>
                  )}

                  {/* Move Location Action Content */}
                  {activeAction === 'move' && (
                    <div className={`bg-zinc-800/30 border border-zinc-700 rounded-lg p-6 ${!selectedLocation.isMoveable ? 'opacity-60' : ''}`}>
                      <div className="mb-4">
                        <h4 className="text-lg font-semibold text-white mb-2">Move Location</h4>
                        <p className="text-sm text-zinc-400">
                        {selectedLocation.isMoveable 
                          ? 'Move this location to a different parent location' 
                          : 'This location cannot be moved (fixed location type)'}
                      </p>
                    </div>

                    {!selectedLocation.isMoveable && (
                      <div className="flex items-start gap-2 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg mb-4">
                        <AlertCircle size={16} className="text-orange-400 mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-orange-400">
                          <p className="font-medium mb-1">Location is Not Moveable</p>
                          <p className="text-orange-400/80">This location type ({selectedLocation.type}) is fixed and cannot be moved to a different parent.</p>
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      {/* Current Parent Display */}
                      <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
                        <p className="text-xs text-zinc-400 mb-1">Current Parent Location</p>
                        <p className="text-base font-semibold text-white font-mono">{selectedLocation.parentStorage}</p>
                      </div>

                      {/* Destination Selection */}
                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-3">Move to Location</label>
                        <select
                          value={moveToLocation}
                          onChange={(e) => setMoveToLocation(e.target.value)}
                          disabled={!selectedLocation.isMoveable}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#0d9488] dark:focus:ring-[#50e080] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="">Select destination location...</option>
                          {mockStorageLocations
                            .filter(loc => !loc.isMoveable && loc.id !== selectedLocation.id)
                            .map(loc => (
                              <option key={loc.id} value={loc.id}>
                                {loc.name} - {loc.type}
                              </option>
                            ))}
                        </select>
                      </div>

                      {/* Move Button */}
                      <button
                        onClick={handleMoveLocation}
                        disabled={!selectedLocation.isMoveable || !moveToLocation}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all ${ 
                          !selectedLocation.isMoveable || !moveToLocation
                            ? 'border-zinc-700 bg-zinc-800/20 opacity-50 cursor-not-allowed'
                            : 'border-zinc-700 bg-zinc-800/30 hover:border-[#0d9488] dark:hover:border-[#50e080] hover:bg-[#0d9488]/10 dark:hover:bg-[#50e080]/10'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            !selectedLocation.isMoveable || !moveToLocation
                              ? 'bg-zinc-700'
                              : 'bg-[#0d9488]/20 dark:bg-[#50e080]/20'
                          }`}>
                            <MapPin size={20} className={!selectedLocation.isMoveable || !moveToLocation ? 'text-zinc-500' : 'text-[#0d9488] dark:text-[#50e080]'} />
                          </div>
                          <div className="flex-1">
                            <h5 className="text-base font-semibold text-white mb-1">Move Location</h5>
                            <p className="text-xs text-zinc-400">Update the parent location of this location</p>
                          </div>
                        </div>
                      </button>
                    </div>
                    </div>
                  )}

                  {/* Delete Location Action Content */}
                  {activeAction === 'delete' && (
                    <div className="bg-red-500/5 border-2 border-red-500/30 rounded-lg p-6">
                      <div className="mb-4">
                        <h4 className="text-lg font-semibold text-red-400 mb-2">Danger Zone</h4>
                        <p className="text-sm text-zinc-400">Irreversible and destructive actions</p>
                      </div>

                      <button
                      onClick={handleDeleteLocation}
                      disabled={locationCurrentAllocations.length > 0}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                        locationCurrentAllocations.length > 0
                          ? 'border-zinc-700 bg-zinc-800/20 opacity-50 cursor-not-allowed'
                          : 'border-red-500/30 bg-red-500/10 hover:border-red-500 hover:bg-red-500/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          locationCurrentAllocations.length > 0
                            ? 'bg-zinc-700'
                            : 'bg-red-500/20'
                        }`}>
                          <Trash2 size={20} className={locationCurrentAllocations.length > 0 ? 'text-zinc-500' : 'text-red-400'} />
                        </div>
                        <div className="flex-1">
                          <h5 className="text-base font-semibold text-white mb-1">Delete Location</h5>
                          <p className="text-xs text-zinc-400">Permanently remove this location from the system</p>
                        </div>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
      )}

      {/* Status Change Confirmation Dialog */}
      {showStatusConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-white mb-2">Confirm Status Change</h3>
              <p className="text-sm text-zinc-400">Please review and confirm the following change:</p>
            </div>

            {/* Change Summary */}
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 mb-6">
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-zinc-400 mb-1">Location</p>
                  <p className="text-sm font-semibold text-white">{selectedLocation?.name}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <p className="text-xs text-zinc-400 mb-1">Current Status</p>
                    <p className="text-sm font-semibold text-white">{selectedLocation?.status}</p>
                  </div>
                  <div className="text-zinc-600">→</div>
                  <div className="flex-1">
                    <p className="text-xs text-zinc-400 mb-1">New Status</p>
                    <p className="text-sm font-semibold text-orange-400">{newStatus}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowStatusConfirmation(false)}
                className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmStatusChange}
                className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors font-medium"
              >
                Confirm Change
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Move Location Confirmation Dialog */}
      {showMoveConfirmation && selectedLocation && (() => {
        const destinationLocation = mockStorageLocations.find(loc => loc.id === moveToLocation);
        return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-white mb-2">Confirm Location Move</h3>
                <p className="text-sm text-zinc-400">Please review and confirm the following change:</p>
              </div>

              {/* Move Summary */}
              <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 mb-6">
                <div className="mb-4">
                  <p className="text-xs text-zinc-400 mb-2">Location to Move</p>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-[#0d9488] dark:text-[#50e080]" />
                    <p className="text-sm font-semibold text-white font-mono">{selectedLocation.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 py-3 border-t border-zinc-700">
                  <div className="flex-1">
                    <p className="text-xs text-zinc-400 mb-1">Current Parent</p>
                    <p className="text-sm font-semibold text-white font-mono">{selectedLocation.parentStorage}</p>
                  </div>
                  <div className="text-zinc-600">→</div>
                  <div className="flex-1">
                    <p className="text-xs text-zinc-400 mb-1">New Parent</p>
                    <p className="text-sm font-semibold text-[#0d9488] dark:text-[#50e080] font-mono">{destinationLocation?.name}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowMoveConfirmation(false)}
                  className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmMoveLocation}
                  className="flex-1 px-4 py-2 bg-[#0d9488] dark:bg-[#50e080] hover:bg-[#0b7a70] dark:hover:bg-[#3bc76a] text-white rounded-lg transition-colors font-medium"
                >
                  Confirm Move
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Allocation Warning Dialog */}
      {showAllocationWarning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="mb-4">
              <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={24} className="text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 text-center">Cannot Change Status</h3>
              <p className="text-sm text-zinc-400 text-center">This location has active allocations</p>
            </div>

            {/* Warning Message */}
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 mb-6">
              <p className="text-sm text-orange-400">
                This location currently has <span className="font-semibold">{locationCurrentAllocations.length} active allocation(s)</span>. 
                The status cannot be changed while allocations are present. Please clear all allocations before attempting to change the status.
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowAllocationWarning(false)}
              className="w-full px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Delete Location Confirmation Dialog */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="mb-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={24} className="text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 text-center">Delete Location</h3>
              <p className="text-sm text-zinc-400 text-center">This action cannot be undone</p>
            </div>

            {/* Location Summary */}
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-3 mb-3 pb-3 border-b border-zinc-700">
                <MapPin size={20} className="text-[#0d9488] dark:text-[#50e080]" />
                <div>
                  <p className="text-xs text-zinc-400">Location</p>
                  <p className="text-sm font-semibold text-white font-mono">{selectedLocation?.name}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-zinc-400 mb-1">Type</p>
                  <p className="text-white">{selectedLocation?.type}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-400 mb-1">Status</p>
                  <p className="text-white">{selectedLocation?.status}</p>
                </div>
              </div>
            </div>

            {/* Warning Message */}
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-400">
                <span className="font-semibold">Warning:</span> Deleting this location will permanently remove it from the system. 
                This action cannot be undone.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteLocation}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium"
              >
                Delete Location
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Date Range Selection Dialog */}
      {showDateRangeDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Select Report Date Range</h3>
              <p className="text-sm text-zinc-400">Choose the time period for the activity report</p>
            </div>

            {/* Date Inputs */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Start Date</label>
                <input
                  type="date"
                  value={reportStartDate}
                  onChange={(e) => setReportStartDate(e.target.value)}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">End Date</label>
                <input
                  type="date"
                  value={reportEndDate}
                  onChange={(e) => setReportEndDate(e.target.value)}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Quick Selection Buttons */}
            <div className="mb-6">
              <p className="text-xs text-zinc-400 mb-2">Quick Select:</p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    const end = new Date();
                    const start = new Date();
                    start.setDate(start.getDate() - 7);
                    setReportStartDate(start.toISOString().split('T')[0]);
                    setReportEndDate(end.toISOString().split('T')[0]);
                  }}
                  className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs rounded-lg transition-colors"
                >
                  Last 7 Days
                </button>
                <button
                  onClick={() => {
                    const end = new Date();
                    const start = new Date();
                    start.setDate(start.getDate() - 30);
                    setReportStartDate(start.toISOString().split('T')[0]);
                    setReportEndDate(end.toISOString().split('T')[0]);
                  }}
                  className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs rounded-lg transition-colors"
                >
                  Last 30 Days
                </button>
                <button
                  onClick={() => {
                    const end = new Date();
                    const start = new Date();
                    start.setDate(start.getDate() - 90);
                    setReportStartDate(start.toISOString().split('T')[0]);
                    setReportEndDate(end.toISOString().split('T')[0]);
                  }}
                  className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs rounded-lg transition-colors"
                >
                  Last 90 Days
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowDateRangeDialog(false)}
                className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmGenerateReport}
                disabled={!reportStartDate || !reportEndDate}
                className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Generate Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Display Dialog */}
      {showReportDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl">
            {/* Header */}
            <div className="p-6 border-b border-zinc-700 flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Activity Report</h3>
                <p className="text-sm text-zinc-400">
                  {selectedLocation?.name} • {new Date(reportStartDate).toLocaleDateString()} - {new Date(reportEndDate).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => setShowReportDialog(false)}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Report Summary */}
            <div className="p-6 border-b border-zinc-700 bg-zinc-800/30">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{reportData.length}</p>
                  <p className="text-xs text-zinc-400 mt-1">Total Events</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-400">{reportData.filter(e => e.type === 'Status Change').length}</p>
                  <p className="text-xs text-zinc-400 mt-1">Status Changes</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-400">{reportData.filter(e => e.type === 'Inventory Change').length}</p>
                  <p className="text-xs text-zinc-400 mt-1">Inventory Changes</p>
                </div>
              </div>
            </div>

            {/* Report Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {reportData.length > 0 ? (
                <div className="space-y-3">
                  {reportData.map((event, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-2 ${
                        event.type === 'Status Change'
                          ? 'border-orange-500/30 bg-orange-500/5'
                          : 'border-blue-500/30 bg-blue-500/5'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {event.type === 'Status Change' ? (
                            <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                              <AlertCircle size={16} className="text-orange-400" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                              <Package size={16} className="text-blue-400" />
                            </div>
                          )}
                          <div>
                            <h5 className={`text-sm font-semibold ${
                              event.type === 'Status Change' ? 'text-orange-400' : 'text-blue-400'
                            }`}>
                              {event.type}
                            </h5>
                            <p className="text-xs text-zinc-400">
                              {event.date.toLocaleString()} • by {event.user}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {event.type === 'Status Change' ? (
                        <div className="ml-10 flex items-center gap-2 text-sm">
                          <span className="text-zinc-400">{event.oldValue}</span>
                          <span className="text-zinc-600">→</span>
                          <span className="text-white font-medium">{event.newValue}</span>
                        </div>
                      ) : (
                        <div className="ml-10 space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-zinc-400">Item:</span>
                            <span className="text-white font-medium">{event.item}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-zinc-400">Quantity:</span>
                            <span className="text-zinc-400">{event.oldQty}</span>
                            <span className="text-zinc-600">→</span>
                            <span className="text-white font-medium">{event.newQty}</span>
                            <span className={`ml-2 px-2 py-0.5 rounded text-xs font-semibold ${
                              event.change.startsWith('+')
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-red-500/20 text-red-400'
                            }`}>
                              {event.change}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BarChart3 size={48} className="mx-auto mb-3 text-zinc-600" />
                  <p className="text-zinc-400">No activity found in the selected date range</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-zinc-700 flex gap-3">
              <button
                onClick={() => {
                  const dataStr = JSON.stringify(reportData, null, 2);
                  const dataBlob = new Blob([dataStr], { type: 'application/json' });
                  const url = URL.createObjectURL(dataBlob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `activity-report-${selectedLocation?.name}-${reportStartDate}-${reportEndDate}.json`;
                  link.click();
                }}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Download size={16} />
                Export Report
              </button>
              <button
                onClick={() => setShowReportDialog(false)}
                className="ml-auto px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Dialog */}
      {showBulkDeleteConfirmation && (() => {
        // Calculate which locations can and cannot be deleted
        const locationsWithAllocations: StorageLocation[] = [];
        const locationsToDelete: StorageLocation[] = [];

        selectedLocationIds.forEach(id => {
          const location = mockStorageLocations.find(loc => loc.id === id);
          if (location) {
            const allocations = getCurrentAllocationsForLocation(location.name, location.status);
            if (allocations.length > 0) {
              locationsWithAllocations.push(location);
            } else {
              locationsToDelete.push(location);
            }
          }
        });

        return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-zinc-900 border border-zinc-700 rounded-xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl">
              {/* Header */}
              <div className="p-6 border-b border-zinc-700">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                      <AlertCircle size={24} className="text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Confirm Bulk Deletion</h3>
                      <p className="text-sm text-zinc-400">Review locations before deleting</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowBulkDeleteConfirmation(false)}
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-zinc-800/50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-white">{selectedLocationIds.size}</p>
                    <p className="text-xs text-zinc-400 mt-1">Total Selected</p>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-green-400">{locationsToDelete.length}</p>
                    <p className="text-xs text-zinc-400 mt-1">Can Delete</p>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-red-400">{locationsWithAllocations.length}</p>
                    <p className="text-xs text-zinc-400 mt-1">Cannot Delete</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Locations to Delete */}
                {locationsToDelete.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 size={20} className="text-green-400" />
                      <h4 className="text-lg font-semibold text-white">Locations to Delete ({locationsToDelete.length})</h4>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {locationsToDelete.map((location) => (
                        <div
                          key={location.id}
                          className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-3 flex items-center gap-3"
                        >
                          <MapPin size={16} className="text-[#0d9488] dark:text-[#50e080]" />
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-white font-mono">{location.name}</p>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs text-zinc-400">{location.type}</span>
                              <span className="text-xs text-zinc-600">•</span>
                              <span className={`text-xs ${getStatusColor(location.status)}`}>{location.status}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Locations that Cannot be Deleted */}
                {locationsWithAllocations.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle size={20} className="text-red-400" />
                      <h4 className="text-lg font-semibold text-white">Cannot Delete ({locationsWithAllocations.length})</h4>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-3">
                      <p className="text-sm text-red-400">
                        The following locations have active allocations and cannot be deleted. Clear allocations first to delete these locations.
                      </p>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {locationsWithAllocations.map((location) => (
                        <div
                          key={location.id}
                          className="bg-red-500/5 border border-red-500/30 rounded-lg p-3 flex items-center gap-3 opacity-60"
                        >
                          <MapPin size={16} className="text-red-400" />
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-white font-mono">{location.name}</p>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs text-zinc-400">{location.type}</span>
                              <span className="text-xs text-zinc-600">•</span>
                              <span className={`text-xs ${getStatusColor(location.status)}`}>{location.status}</span>
                              <span className="text-xs text-zinc-600">•</span>
                              <span className="text-xs text-red-400">Has Allocations</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-zinc-700 p-6 flex items-center justify-between gap-3">
                <p className="text-sm text-zinc-400">
                  {locationsToDelete.length > 0 ? (
                    <>This action cannot be undone</>
                  ) : (
                    <>No locations can be deleted</>
                  )}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowBulkDeleteConfirmation(false)}
                    className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  {locationsToDelete.length > 0 && (
                    <button
                      onClick={confirmBulkDelete}
                      className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium"
                    >
                      Delete {locationsToDelete.length} Location{locationsToDelete.length !== 1 ? 's' : ''}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Add Location Side Panel */}
      {showAddLocation && (
        <div className="fixed right-0 top-0 h-full w-[600px] bg-zinc-900 border-l border-zinc-700 shadow-2xl overflow-y-auto z-30 animate-in slide-in-from-right duration-300">
          {addLocationStep === 'form' ? (
            <>
              {/* Header */}
              <div className="bg-zinc-900 border-b border-zinc-700 p-6 sticky top-0 z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#0d9488] dark:bg-[#50e080] rounded-lg flex items-center justify-center">
                      <Plus size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Add Location</h3>
                      <p className="text-sm text-zinc-400">Create a new location</p>
                    </div>
                  </div>
                  <button
                    onClick={cancelAddLocation}
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Form */}
              <div className="p-6 space-y-6">
                {/* Location Type - Required */}
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Location Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newLocationData.type}
                    onChange={(e) => setNewLocationData({ ...newLocationData, type: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#0d9488] dark:focus:ring-[#50e080] focus:border-transparent"
                  >
                    <option value="">Select Type</option>
                    <option value="Rack">Rack</option>
                    <option value="Shelf">Shelf</option>
                  </select>
                </div>

                {/* Location ID - Required */}
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Location ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newLocationData.id}
                    onChange={(e) => setNewLocationData({ ...newLocationData, id: e.target.value })}
                    placeholder="e.g., Zone1-A-01-02"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#0d9488] dark:focus:ring-[#50e080] focus:border-transparent"
                  />
                </div>

                {/* Parent Location - Optional */}
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Parent Location <span className="text-zinc-500">(Optional)</span>
                  </label>
                  <select
                    value={newLocationData.parentLocation}
                    onChange={(e) => setNewLocationData({ ...newLocationData, parentLocation: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#0d9488] dark:focus:ring-[#50e080] focus:border-transparent"
                  >
                    <option value="">Select Parent Location</option>
                    {Array.from(new Set(mockStorageLocations.map(loc => loc.parentStorage).filter(p => p !== '-'))).map(parent => (
                      <option key={parent} value={parent}>{parent}</option>
                    ))}
                  </select>
                </div>

                {/* Info Box */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Info size={20} className="text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-300 font-medium mb-1">New Location Details</p>
                      <p className="text-xs text-blue-200/70">
                        The new location will be created with status "Available" and can be configured further after creation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-zinc-900 border-t border-zinc-700 p-6 flex items-center justify-end gap-3">
                <button
                  onClick={cancelAddLocation}
                  className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNewLocation}
                  disabled={!newLocationData.type || !newLocationData.id}
                  className="px-6 py-2 bg-[#0d9488] dark:bg-[#50e080] hover:bg-[#0b7a70] dark:hover:bg-[#3bc76a] text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Confirmation Screen */}
              <div className="bg-zinc-900 border-b border-zinc-700 p-6 sticky top-0 z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                      <AlertCircle size={20} className="text-orange-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Confirm New Location</h3>
                      <p className="text-sm text-zinc-400">Review and confirm the details</p>
                    </div>
                  </div>
                  <button
                    onClick={cancelAddLocation}
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Confirmation Details */}
              <div className="p-6">
                <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-6 space-y-4">
                  <div className="flex items-center gap-3 pb-4 border-b border-zinc-700">
                    <MapPin size={24} className="text-[#0d9488] dark:text-[#50e080]" />
                    <div>
                      <p className="text-sm text-zinc-400">Location ID</p>
                      <p className="text-lg font-bold text-white font-mono">{newLocationData.id}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-zinc-400 mb-1">Type</p>
                      <p className="text-white font-medium">{newLocationData.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-zinc-400 mb-1">Status</p>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-green-500" />
                        <span className="text-green-500 font-medium">Available</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-zinc-400 mb-1">Parent Location</p>
                    <p className="text-white font-medium">{newLocationData.parentLocation || 'None'}</p>
                  </div>
                </div>

                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 mt-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle size={20} className="text-orange-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-orange-300 font-medium mb-1">Confirm Creation</p>
                      <p className="text-xs text-orange-200/70">
                        Are you sure you want to create this location? This action will add the location to your system.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-zinc-900 border-t border-zinc-700 p-6 flex items-center justify-end gap-3">
                <button
                  onClick={() => setAddLocationStep('form')}
                  className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={confirmAddLocation}
                  className="px-6 py-2 bg-[#0d9488] dark:bg-[#50e080] hover:bg-[#0b7a70] dark:hover:bg-[#3bc76a] text-white rounded-lg transition-colors font-medium"
                >
                  Confirm
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
    </>
  );
}