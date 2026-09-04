import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLayout } from "../contexts/LayoutContext";
import { mockItems, type Item } from "../data/mockItems";
import { getInventoryForItem, type Inventory } from "../data/mockInventory";
import {
  Search,
  Filter,
  Download,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Package,
  Archive,
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
  FileText,
  Printer,
} from "lucide-react";

type SortField = keyof Item;
type InventorySortField = keyof Inventory;

// Items component with comprehensive filtering
export function Items() {
  const navigate = useNavigate();
  const { setShowAI, itemsHiddenColumns, itemsPinnedColumns, inventoryHiddenColumns, inventoryPinnedColumns } = useLayout();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("item");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [selectedClasses, setSelectedClasses] = useState<Set<string>>(new Set());
  const [selectedHandlingCodes, setSelectedHandlingCodes] = useState<Set<string>>(new Set());
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [classSearch, setClassSearch] = useState("");
  const [handlingCodeSearch, setHandlingCodeSearch] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<'class' | 'handlingCode' | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'inventory' | 'supplemental'>('details');
  const [itemInventory, setItemInventory] = useState<Inventory[]>([]);
  const [inventorySortField, setInventorySortField] = useState<InventorySortField>("storageLocation");
  const [inventorySortDirection, setInventorySortDirection] = useState<"asc" | "desc">("asc");
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const [inventoryColumnWidths, setInventoryColumnWidths] = useState<Record<string, number>>({});
  const [resizingColumn, setResizingColumn] = useState<string | null>(null);
  const [resizingInventoryColumn, setResizingInventoryColumn] = useState<string | null>(null);
  
  // Supplemental Attributes state
  const [topType, setTopType] = useState<'Full' | 'Tapered' | ''>('');
  const [topLength, setTopLength] = useState('');
  const [topWidth, setTopWidth] = useState('');
  const [itemType, setItemType] = useState<'Shrink Wrap' | 'Box' | 'Cans in Tray' | 'Boxes in Tray' | 'Bottles in Crates' | ''>('');
  const [trayPatternLengthCount, setTrayPatternLengthCount] = useState('');
  const [trayPatternWidthCount, setTrayPatternWidthCount] = useState('');
  const [trayPatternOrientationOpposite, setTrayPatternOrientationOpposite] = useState(false);
  const [shellType, setShellType] = useState<'2L' | '200oz' | '500ml' | ''>('');

  // Inventory Report state
  const [showInventoryMode, setShowInventoryMode] = useState(false);
  const [selectedItemsForInventory, setSelectedItemsForInventory] = useState<Set<string>>(new Set());
  const [showInventoryReport, setShowInventoryReport] = useState(false);
  const [reportStatusFilter, setReportStatusFilter] = useState<string>('');
  const [reportLocationFilter, setReportLocationFilter] = useState<string>('');
  const [reportParentFilter, setReportParentFilter] = useState<string>('');
  const [reportQuantityOperator, setReportQuantityOperator] = useState<'<=' | '>=' | '='>('=');
  const [reportQuantityValue, setReportQuantityValue] = useState('');

  // Inventory Actions state
  const [selectedInventoryRecord, setSelectedInventoryRecord] = useState<Inventory | null>(null);
  const [inventoryAction, setInventoryAction] = useState<'quantity' | 'status' | null>(null);
  const [newQuantity, setNewQuantity] = useState<number>(0);
  const [showQuantityPad, setShowQuantityPad] = useState(false);
  const [newInventoryStatus, setNewInventoryStatus] = useState<'Available' | 'Unavailable'>('Available');

  // Update inventory data when selected item changes
  useEffect(() => {
    if (selectedItem) {
      setItemInventory(getInventoryForItem(selectedItem.item));
    }
  }, [selectedItem]);

  // Auto-size columns to content on initial render
  useEffect(() => {
    // Only auto-size if columns haven't been manually sized yet
    if (Object.keys(columnWidths).length === 0) {
      const widths: Record<string, number> = {};
      orderedItemColumns.forEach((col) => {
        widths[col] = getItemColumnMinWidth(col);
      });
      setColumnWidths(widths);
    }
  }, []);

  // Get visible columns for Items grid
  const allItemColumns: (keyof Item)[] = [
    "item",
    "description",
    "itemClass",
    "handlingCode",
    "dimensionUnits",
    "length",
    "width",
    "height",
    "weightUnits",
    "weight",
    "replenWindow",
    "imageUrl",
    "attribute1",
    "attribute2",
    "attribute3",
    "attribute4",
    "attribute5",
    "fifoTracking",
    "expiryDateControlled",
    "comment",
    "created",
    "createdBy",
    "modified",
    "modifiedBy",
  ];

  const visibleItemColumns = allItemColumns.filter(col => !itemsHiddenColumns.includes(col));
  const pinnedItemColumns = visibleItemColumns.filter(col => itemsPinnedColumns.includes(col));
  const unpinnedItemColumns = visibleItemColumns.filter(col => !itemsPinnedColumns.includes(col));
  const orderedItemColumns = [...pinnedItemColumns, ...unpinnedItemColumns];

  // Get visible columns for Inventory tab grid
  const allInventoryColumns: (keyof Inventory)[] = [
    "storageLocation",
    "quantity",
    "status",
    "parentStorage",
    "fifoDate",
    "attribute1",
    "attribute2",
    "attribute3",
    "attribute4",
    "attribute5",
    "created",
    "createdBy",
    "modified",
    "modifiedBy",
  ];

  const visibleInventoryColumns = allInventoryColumns.filter(col => !inventoryHiddenColumns.includes(col));
  const pinnedInventoryColumns = visibleInventoryColumns.filter(col => inventoryPinnedColumns.includes(col));
  const unpinnedInventoryColumns = visibleInventoryColumns.filter(col => !inventoryPinnedColumns.includes(col));
  const orderedInventoryColumns = [...pinnedInventoryColumns, ...unpinnedInventoryColumns];

  // Safety check: ensure mockItems is available
  if (!mockItems || !Array.isArray(mockItems)) {
    return (
      <div className="p-8">
        <div className="text-white">Loading items...</div>
      </div>
    );
  }

  // Calculate statistics
  const totalItems = mockItems.length;
  const electronicsItems = mockItems.filter(i => i.itemClass === "Electronics").length;
  const officeSuppliesItems = mockItems.filter(i => i.itemClass === "Office Supplies").length;
  const healthSafetyItems = mockItems.filter(i => i.itemClass === "Health & Safety").length;
  const fifoTrackedItems = mockItems.filter(i => i.fifoTracking).length;

  // Get unique values for filters
  const uniqueClasses = Array.from(new Set(mockItems.map(i => i.itemClass))).sort();
  const uniqueHandlingCodes = Array.from(new Set(mockItems.map(i => i.handlingCode))).sort();

  // Count active filters
  const hasActiveFilters = selectedClasses.size > 0 || selectedHandlingCodes.size > 0;
  const totalFilterCount = selectedClasses.size + selectedHandlingCodes.size;

  const clearAllFilters = () => {
    setSelectedClasses(new Set());
    setSelectedHandlingCodes(new Set());
    setActiveFilter(null);
  };

  const clearAdvancedFilters = () => {
    setSelectedClasses(new Set());
    setSelectedHandlingCodes(new Set());
  };

  const handleTileClick = (filterKey: string) => {
    // Toggle filter: if clicking the same tile, clear the filter
    setActiveFilter(activeFilter === filterKey ? null : filterKey);
  };

  const toggleFilterOption = (category: 'class' | 'handlingCode', value: string) => {
    if (category === 'class') {
      const newSet = new Set(selectedClasses);
      if (newSet.has(value)) {
        newSet.delete(value);
      } else {
        newSet.add(value);
      }
      setSelectedClasses(newSet);
    } else if (category === 'handlingCode') {
      const newSet = new Set(selectedHandlingCodes);
      if (newSet.has(value)) {
        newSet.delete(value);
      } else {
        newSet.add(value);
      }
      setSelectedHandlingCodes(newSet);
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

  // Apply filters and search
  let filteredItems = mockItems;

  // Apply tile filter
  if (activeFilter === 'electronics') {
    filteredItems = filteredItems.filter(i => i.itemClass === 'Electronics');
  } else if (activeFilter === 'office-supplies') {
    filteredItems = filteredItems.filter(i => i.itemClass === 'Office Supplies');
  } else if (activeFilter === 'health-safety') {
    filteredItems = filteredItems.filter(i => i.itemClass === 'Health & Safety');
  } else if (activeFilter === 'fifo-tracked') {
    filteredItems = filteredItems.filter(i => i.fifoTracking);
  }

  // Apply advanced filters
  if (selectedClasses.size > 0) {
    filteredItems = filteredItems.filter(i => selectedClasses.has(i.itemClass));
  }
  if (selectedHandlingCodes.size > 0) {
    filteredItems = filteredItems.filter(i => selectedHandlingCodes.has(i.handlingCode));
  }

  // Apply search
  if (searchTerm) {
    const lowerSearch = searchTerm.toLowerCase();
    filteredItems = filteredItems.filter(
      i =>
        i.item.toLowerCase().includes(lowerSearch) ||
        i.description.toLowerCase().includes(lowerSearch) ||
        i.itemClass.toLowerCase().includes(lowerSearch) ||
        i.handlingCode.toLowerCase().includes(lowerSearch)
    );
  }

  // Apply sorting
  const sortedItems = [...filteredItems].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];

    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;

    let comparison = 0;
    if (typeof aVal === "string" && typeof bVal === "string") {
      comparison = aVal.localeCompare(bVal);
    } else if (typeof aVal === "number" && typeof bVal === "number") {
      comparison = aVal - bVal;
    } else if (typeof aVal === "boolean" && typeof bVal === "boolean") {
      comparison = aVal === bVal ? 0 : aVal ? 1 : -1;
    }

    return sortDirection === "asc" ? comparison : -comparison;
  });

  // Sort inventory
  const sortedInventory = [...itemInventory].sort((a, b) => {
    const aVal = a[inventorySortField];
    const bVal = b[inventorySortField];

    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;

    let comparison = 0;
    if (typeof aVal === "string" && typeof bVal === "string") {
      comparison = aVal.localeCompare(bVal);
    } else if (typeof aVal === "number" && typeof bVal === "number") {
      comparison = aVal - bVal;
    }

    return inventorySortDirection === "asc" ? comparison : -comparison;
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleInventorySort = (field: InventorySortField) => {
    if (inventorySortField === field) {
      setInventorySortDirection(inventorySortDirection === "asc" ? "desc" : "asc");
    } else {
      setInventorySortField(field);
      setInventorySortDirection("asc");
    }
  };

  const exportToCSV = () => {
    const csv = [
      orderedItemColumns.join(","),
      ...sortedItems.map(item => orderedItemColumns.map(col => {
        const val = item[col];
        if (typeof val === "string" && val.includes(",")) {
          return `"${val}"`;
        }
        return val;
      }).join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "items.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatColumnHeader = (key: string): string => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  const formatCellValue = (value: any, key: string): string => {
    if (value === null || value === undefined) return "-";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (typeof value === "number") return value.toFixed(2);
    return value.toString();
  };

  const getCellClassName = (key: keyof Item): string => {
    // Only allow 2-line wrapping for description, imageUrl, and comment
    // All other columns should NOT wrap at all
    if (key === 'description' || key === 'imageUrl' || key === 'comment') {
      return 'line-clamp-2 max-w-md';
    }
    return 'whitespace-nowrap';
  };

  const handleColumnResize = (columnKey: string, startX: number) => {
    const startWidth = columnWidths[columnKey] || 0;

    const handleMouseMove = (e: MouseEvent) => {
      const diff = e.clientX - startX;
      const newWidth = Math.max(50, startWidth + diff);
      setColumnWidths(prev => ({ ...prev, [columnKey]: newWidth }));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      setResizingColumn(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    setResizingColumn(columnKey);
  };

  const handleInventoryColumnResize = (columnKey: string, startX: number) => {
    const startWidth = inventoryColumnWidths[columnKey] || 0;

    const handleMouseMove = (e: MouseEvent) => {
      const diff = e.clientX - startX;
      const newWidth = Math.max(50, startWidth + diff);
      setInventoryColumnWidths(prev => ({ ...prev, [columnKey]: newWidth }));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      setResizingInventoryColumn(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    setResizingInventoryColumn(columnKey);
  };

  const getInventoryColumnMinWidth = (key: keyof Inventory): number => {
    const widths: Record<string, number> = {
      storageLocation: 180,
      quantity: 120,
      status: 140,
      parentStorage: 180,
      fifoDate: 140,
      attribute1: 180,
      attribute2: 180,
      attribute3: 180,
      attribute4: 180,
      attribute5: 180,
      created: 180,
      createdBy: 160,
      modified: 180,
      modifiedBy: 160,
    };
    return widths[key] || 150;
  };

  const getItemColumnMinWidth = (key: keyof Item): number => {
    const widths: Record<string, number> = {
      item: 120,
      description: 200,
      itemClass: 150,
      handlingCode: 150,
      dimensionUnits: 100,
      length: 100,
      width: 100,
      height: 100,
      weightUnits: 100,
      weight: 100,
      replenWindow: 100,
      imageUrl: 150,
      attribute1: 150,
      attribute2: 150,
      attribute3: 150,
      attribute4: 150,
      attribute5: 150,
      fifoTracking: 100,
      expiryDateControlled: 100,
      comment: 200,
      created: 150,
      createdBy: 150,
      modified: 150,
      modifiedBy: 150,
    };
    return widths[key] || 150;
  };

  const getFilteredClasses = () => {
    if (!classSearch) return uniqueClasses;
    return uniqueClasses.filter(c => c.toLowerCase().includes(classSearch.toLowerCase()));
  };

  const getFilteredHandlingCodes = () => {
    if (!handlingCodeSearch) return uniqueHandlingCodes;
    return uniqueHandlingCodes.filter(h => h.toLowerCase().includes(handlingCodeSearch.toLowerCase()));
  };

  const handleSelectAllItems = (checked: boolean) => {
    if (checked) {
      // Select all items (not just current page)
      setSelectedItemsForInventory(new Set(mockItems.map(item => item.item)));
    } else {
      setSelectedItemsForInventory(new Set());
    }
  };

  const handleSelectItem = (itemNumber: string, checked: boolean) => {
    const newSet = new Set(selectedItemsForInventory);
    if (checked) {
      newSet.add(itemNumber);
    } else {
      newSet.delete(itemNumber);
    }
    setSelectedItemsForInventory(newSet);
  };

  const allItemsSelected = mockItems.length > 0 && selectedItemsForInventory.size === mockItems.length;
  const someItemsSelected = selectedItemsForInventory.size > 0 && selectedItemsForInventory.size < mockItems.length;

  return (
    <div className="flex h-full bg-white dark:bg-zinc-900">
      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${selectedItem ? 'mr-[600px]' : ''}`}>
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-500">
            <Link to="/app/home" className="hover:text-[#0d9488] dark:hover:text-[#50e080] transition-colors flex items-center gap-1">
              <Home size={14} />
              Home
            </Link>
            <ChevronRight size={14} />
            <Link to="/app/navigation" className="hover:text-[#0d9488] dark:hover:text-[#50e080] transition-colors">
              Navigation
            </Link>
            <ChevronRight size={14} />
            <Link to="/app/navigation?section=operations" className="hover:text-[#0d9488] dark:hover:text-[#50e080] transition-colors">
              Operations
            </Link>
            <ChevronRight size={14} />
            <span className="text-zinc-900 dark:text-white font-medium">Items</span>
          </div>

          {/* Header */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Items</h2>
              </div>
              <div className="flex items-center gap-3">
                {showInventoryMode && selectedItemsForInventory.size > 0 && (
                  <button
                    onClick={() => setShowInventoryReport(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 border border-blue-500"
                  >
                    <BarChart3 size={18} />
                    <span>Generate Report ({selectedItemsForInventory.size})</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowInventoryMode(!showInventoryMode);
                    if (showInventoryMode) {
                      setSelectedItemsForInventory(new Set());
                    }
                  }}
                  className={`px-4 py-2 text-white rounded-lg transition-colors flex items-center gap-2 border ${
                    showInventoryMode
                      ? "bg-blue-600 hover:bg-blue-700 border-blue-500"
                      : "bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white"
                  }`}
                >
                  <Package size={18} />
                  <span>{showInventoryMode ? 'Cancel' : 'Inventory'}</span>
                </button>
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
                <button 
                  onClick={exportToCSV}
                  className="px-4 py-2 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-lg transition-colors flex items-center gap-2 border border-zinc-300 dark:border-zinc-700"
                >
                  <Download size={18} />
                  <span>Export</span>
                </button>
              </div>
            </div>

            {/* Statistics Tiles */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-6">
              {/* Total Items */}
              <button
                onClick={() => handleTileClick('total')}
                className={`bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 rounded-lg p-4 transition-all ${
                  activeFilter === 'total' ? "ring-2 ring-[#50e080]" : ""
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Package size={20} className="text-blue-500" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-2xl font-bold text-white">{totalItems}</p>
                    <p className="text-xs text-zinc-400">Total Items</p>
                  </div>
                </div>
              </button>

              {/* Electronics */}
              <button
                onClick={() => handleTileClick('electronics')}
                className={`bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 rounded-lg p-4 transition-all ${
                  activeFilter === 'electronics' ? "ring-2 ring-[#50e080]" : ""
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <Zap size={20} className="text-yellow-500" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-2xl font-bold text-white">{electronicsItems}</p>
                    <p className="text-xs text-zinc-400">Electronics</p>
                  </div>
                </div>
              </button>

              {/* Office Supplies */}
              <button
                onClick={() => handleTileClick('office-supplies')}
                className={`bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 rounded-lg p-4 transition-all ${
                  activeFilter === 'office-supplies' ? "ring-2 ring-[#50e080]" : ""
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <FileText size={20} className="text-purple-500" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-2xl font-bold text-white">{officeSuppliesItems}</p>
                    <p className="text-xs text-zinc-400">Office Supplies</p>
                  </div>
                </div>
              </button>

              {/* Health & Safety */}
              <button
                onClick={() => handleTileClick('health-safety')}
                className={`bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 rounded-lg p-4 transition-all ${
                  activeFilter === 'health-safety' ? "ring-2 ring-[#50e080]" : ""
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <AlertCircle size={20} className="text-red-500" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-2xl font-bold text-white">{healthSafetyItems}</p>
                    <p className="text-xs text-zinc-400">Health & Safety</p>
                  </div>
                </div>
              </button>

              {/* FIFO Tracked */}
              <button
                onClick={() => handleTileClick('fifo-tracked')}
                className={`bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 rounded-lg p-4 transition-all ${
                  activeFilter === 'fifo-tracked' ? "ring-2 ring-[#50e080]" : ""
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Clock size={20} className="text-green-500" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-2xl font-bold text-white">{fifoTrackedItems}</p>
                    <p className="text-xs text-zinc-400">FIFO Tracked</p>
                  </div>
                </div>
              </button>
            </div>

            {/* Advanced Filter Panel */}
            {showFilterPanel && (
              <div className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">Advanced Filters</h3>
                  {(selectedClasses.size > 0 || selectedHandlingCodes.size > 0) && (
                    <button
                      onClick={clearAdvancedFilters}
                      className="text-sm text-blue-400 hover:text-blue-300"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Item Class Filter */}
                  <div className="filter-dropdown relative">
                    <label className="block text-xs text-zinc-400 mb-2">Item Class</label>
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === 'class' ? null : 'class')}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-800/50 border border-zinc-700 text-left flex items-center justify-between text-sm text-white hover:border-zinc-600"
                    >
                      <span>
                        {selectedClasses.size === 0
                          ? "All Classes"
                          : `${selectedClasses.size} selected`}
                      </span>
                      <ChevronDown className="w-4 h-4 text-zinc-400" />
                    </button>

                    {activeDropdown === 'class' && (
                      <div className="absolute top-full left-0 right-0 mt-1 p-2 rounded-lg bg-zinc-800 border border-zinc-700 shadow-xl z-50 max-h-64 overflow-y-auto">
                        <input
                          type="text"
                          placeholder="Search classes..."
                          value={classSearch}
                          onChange={(e) => setClassSearch(e.target.value)}
                          className="w-full px-3 py-2 mb-2 rounded-lg bg-zinc-900/50 border border-zinc-700 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                        />
                        {getFilteredClasses().map((itemClass) => (
                          <button
                            key={itemClass}
                            onClick={() => toggleFilterOption('class', itemClass)}
                            className="w-full px-3 py-2 rounded-lg hover:bg-zinc-700/50 flex items-center gap-2 text-sm text-white"
                          >
                            <div className={`w-4 h-4 rounded border ${
                              selectedClasses.has(itemClass)
                                ? 'bg-blue-500 border-blue-500'
                                : 'border-zinc-600'
                            } flex items-center justify-center`}>
                              {selectedClasses.has(itemClass) && (
                                <CheckCircle2 className="w-3 h-3 text-white" />
                              )}
                            </div>
                            <span>{itemClass}</span>
                            <span className="ml-auto text-xs text-zinc-500">
                              {mockItems.filter(i => i.itemClass === itemClass).length}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Handling Code Filter */}
                  <div className="filter-dropdown relative">
                    <label className="block text-xs text-zinc-400 mb-2">Handling Code</label>
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === 'handlingCode' ? null : 'handlingCode')}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-800/50 border border-zinc-700 text-left flex items-center justify-between text-sm text-white hover:border-zinc-600"
                    >
                      <span>
                        {selectedHandlingCodes.size === 0
                          ? "All Codes"
                          : `${selectedHandlingCodes.size} selected`}
                      </span>
                      <ChevronDown className="w-4 h-4 text-zinc-400" />
                    </button>

                    {activeDropdown === 'handlingCode' && (
                      <div className="absolute top-full left-0 right-0 mt-1 p-2 rounded-lg bg-zinc-800 border border-zinc-700 shadow-xl z-50 max-h-64 overflow-y-auto">
                        <input
                          type="text"
                          placeholder="Search codes..."
                          value={handlingCodeSearch}
                          onChange={(e) => setHandlingCodeSearch(e.target.value)}
                          className="w-full px-3 py-2 mb-2 rounded-lg bg-zinc-900/50 border border-zinc-700 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                        />
                        {getFilteredHandlingCodes().map((code) => (
                          <button
                            key={code}
                            onClick={() => toggleFilterOption('handlingCode', code)}
                            className="w-full px-3 py-2 rounded-lg hover:bg-zinc-700/50 flex items-center gap-2 text-sm text-white"
                          >
                            <div className={`w-4 h-4 rounded border ${
                              selectedHandlingCodes.has(code)
                                ? 'bg-blue-500 border-blue-500'
                                : 'border-zinc-600'
                            } flex items-center justify-center`}>
                              {selectedHandlingCodes.has(code) && (
                                <CheckCircle2 className="w-3 h-3 text-white" />
                              )}
                            </div>
                            <span>{code}</span>
                            <span className="ml-auto text-xs text-zinc-500">
                              {mockItems.filter(i => i.handlingCode === code).length}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Active Filter Chips */}
                {(selectedClasses.size > 0 || selectedHandlingCodes.size > 0) && (
                  <div className="flex flex-wrap gap-2">
                    {Array.from(selectedClasses).map((itemClass) => (
                      <div
                        key={itemClass}
                        className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center gap-2 text-sm text-blue-400"
                      >
                        <span>{itemClass}</span>
                        <button
                          onClick={() => toggleFilterOption('class', itemClass)}
                          className="hover:text-blue-300"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    {Array.from(selectedHandlingCodes).map((code) => (
                      <div
                        key={code}
                        className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 flex items-center gap-2 text-sm text-green-400"
                      >
                        <span>{code}</span>
                        <button
                          onClick={() => toggleFilterOption('handlingCode', code)}
                          className="hover:text-green-300"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Search and Grid */}
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-zinc-900/50 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Data Grid */}
              <div className="rounded-lg border border-zinc-800 overflow-hidden bg-zinc-900/30">
                <div className="overflow-x-auto">
                  <div className="inline-block min-w-full align-middle">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b border-zinc-800 bg-zinc-900/50">
                          {showInventoryMode && (
                            <th className="sticky left-0 bg-zinc-900/90 z-10 px-4 py-3 w-12 border-r border-zinc-700">
                              <input
                                type="checkbox"
                                checked={allItemsSelected}
                                ref={(input) => {
                                  if (input) {
                                    input.indeterminate = someItemsSelected;
                                  }
                                }}
                                onChange={(e) => handleSelectAllItems(e.target.checked)}
                                className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-blue-500 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                              />
                            </th>
                          )}
                          {orderedItemColumns.map((key) => {
                            const isPinned = itemsPinnedColumns.includes(key);
                            return (
                              <th
                                key={key}
                                className={`relative px-4 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider group ${isPinned ? 'sticky bg-zinc-900/90 z-10 border-r border-zinc-700' : ''}`}
                                style={{
                                  ...(columnWidths[key] ? { width: `${columnWidths[key]}px`, minWidth: `${columnWidths[key]}px` } : { minWidth: `${getItemColumnMinWidth(key)}px` }),
                                  ...(isPinned && showInventoryMode ? { left: '60px' } : isPinned ? { left: '0' } : {})
                                }}
                              >
                                <div 
                                  className="flex items-center gap-2 cursor-pointer hover:text-zinc-300 transition-colors"
                                  onClick={() => handleSort(key)}
                                >
                                  {formatColumnHeader(key)}
                                  {sortField === key && (
                                    sortDirection === "asc" ? (
                                      <ChevronUp className="w-4 h-4" />
                                    ) : (
                                      <ChevronDown className="w-4 h-4" />
                                    )
                                  )}
                                </div>
                                {/* Resize Handle */}
                                <div
                                  className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-blue-500 group-hover:bg-blue-500/50"
                                  onMouseDown={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    const th = e.currentTarget.parentElement;
                                    if (th) {
                                      const startWidth = th.offsetWidth;
                                      handleColumnResize(key, e.clientX);
                                      if (!columnWidths[key]) {
                                        setColumnWidths(prev => ({ ...prev, [key]: startWidth }));
                                      }
                                    }
                                  }}
                                />
                              </th>
                            );
                          })}
                        </tr>
                      </thead>
                      <tbody>
                        {sortedItems.map((item, idx) => {
                          const isSelected = selectedItem?.item === item.item;
                          const isChecked = selectedItemsForInventory.has(item.item);
                          return (
                            <tr
                              key={item.item}
                              className={`border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors ${isSelected ? 'bg-blue-500/10' : ''}`}
                            >
                              {showInventoryMode && (
                                <td 
                                  className="sticky left-0 bg-zinc-900/90 z-10 px-4 py-3 border-r border-zinc-700/50"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={(e) => handleSelectItem(item.item, e.target.checked)}
                                    className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-blue-500 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                  />
                                </td>
                              )}
                              {orderedItemColumns.map((key) => {
                                const isPinned = itemsPinnedColumns.includes(key);
                                return (
                                  <td
                                    key={key}
                                    onClick={() => !showInventoryMode && setSelectedItem(item)}
                                    className={`px-4 py-3 text-sm text-zinc-300 ${getCellClassName(key)} ${!showInventoryMode ? 'cursor-pointer' : ''} ${isPinned ? 'sticky bg-zinc-900/90 z-10 border-r border-zinc-700/50' : ''} ${isSelected && isPinned ? 'bg-blue-500/10' : ''}`}
                                    style={{
                                      ...(columnWidths[key] ? { width: `${columnWidths[key]}px`, minWidth: `${columnWidths[key]}px` } : { minWidth: `${getItemColumnMinWidth(key)}px` }),
                                      ...(isPinned && showInventoryMode ? { left: '60px' } : isPinned ? { left: '0' } : {})
                                    }}
                                  >
                                    {formatCellValue(item[key], key)}
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Results Summary */}
              <div className="flex items-center justify-between text-sm text-zinc-400">
                <span>
                  Showing {sortedItems.length} of {totalItems} items
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side Panel */}
      {selectedItem && (
        <div className="fixed right-0 top-0 bottom-0 w-[600px] bg-zinc-900 border-l border-zinc-800 shadow-2xl z-40 flex flex-col">
          {/* Panel Header */}
          <div className="p-6 border-b border-zinc-800">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">{selectedItem.item}</h2>
                  <p className="text-sm text-zinc-400">{selectedItem.description}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-zinc-800">
              <button
                onClick={() => setActiveTab('details')}
                className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === 'details'
                    ? 'text-blue-400 border-blue-400'
                    : 'text-zinc-400 border-transparent hover:text-zinc-300'
                }`}
              >
                Details
              </button>
              <button
                onClick={() => setActiveTab('inventory')}
                className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === 'inventory'
                    ? 'text-blue-400 border-blue-400'
                    : 'text-zinc-400 border-transparent hover:text-zinc-300'
                }`}
              >
                Inventory
              </button>
              <button
                onClick={() => setActiveTab('supplemental')}
                className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === 'supplemental'
                    ? 'text-blue-400 border-blue-400'
                    : 'text-zinc-400 border-transparent hover:text-zinc-300'
                }`}
              >
                Supplemental Attributes
              </button>
            </div>
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'details' && (
              <div className="space-y-6">
                {/* Item Information Section */}
                <div>
                  <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Item Information</h4>
                  <div className="bg-zinc-800/50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-zinc-400">Item</span>
                      <span className="text-sm text-white font-mono font-medium">{selectedItem.item}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-zinc-400">Description</span>
                      <span className="text-sm text-white text-right max-w-xs">{selectedItem.description}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-zinc-400">Item Class</span>
                      <span className="text-sm text-white">{selectedItem.itemClass}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-zinc-400">Handling Code</span>
                      <span className="text-sm text-white">{selectedItem.handlingCode}</span>
                    </div>
                  </div>
                </div>

                {/* Physical Properties Section */}
                <div>
                  <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Physical Properties</h4>
                  <div className="bg-zinc-800/50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-zinc-400">Dimensions ({selectedItem.dimensionUnits})</span>
                      <span className="text-sm text-white font-mono">
                        {selectedItem.length} x {selectedItem.width} x {selectedItem.height}
                      </span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-zinc-400">Weight ({selectedItem.weightUnits})</span>
                      <span className="text-sm text-white font-mono">{selectedItem.weight}</span>
                    </div>
                  </div>
                </div>

                {/* Tracking & Control Section */}
                <div>
                  <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Tracking & Control</h4>
                  <div className="bg-zinc-800/50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-zinc-400">FIFO Tracking</span>
                      <div className="flex items-center gap-2">
                        {selectedItem.fifoTracking ? (
                          <>
                            <CheckCircle2 size={14} className="text-green-500" />
                            <span className="text-sm text-green-500 font-medium">Yes</span>
                          </>
                        ) : (
                          <>
                            <X size={14} className="text-red-500" />
                            <span className="text-sm text-red-500 font-medium">No</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-zinc-400">Expiry Date Controlled</span>
                      <div className="flex items-center gap-2">
                        {selectedItem.expiryDateControlled ? (
                          <>
                            <CheckCircle2 size={14} className="text-green-500" />
                            <span className="text-sm text-green-500 font-medium">Yes</span>
                          </>
                        ) : (
                          <>
                            <X size={14} className="text-red-500" />
                            <span className="text-sm text-red-500 font-medium">No</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-zinc-400">Replen Window</span>
                      <span className="text-sm text-white font-mono">{selectedItem.replenWindow} days</span>
                    </div>
                  </div>
                </div>

                {/* Attributes Section - Only show if at least one attribute exists */}
                {(selectedItem.attribute1 || selectedItem.attribute2 || selectedItem.attribute3 || selectedItem.attribute4 || selectedItem.attribute5) && (
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Attributes</h4>
                    <div className="bg-zinc-800/50 rounded-lg p-4 space-y-3">
                      {selectedItem.attribute1 && (
                        <div className="flex justify-between items-start">
                          <span className="text-sm text-zinc-400">Attribute 1</span>
                          <span className="text-sm text-white">{selectedItem.attribute1}</span>
                        </div>
                      )}
                      {selectedItem.attribute2 && (
                        <div className="flex justify-between items-start">
                          <span className="text-sm text-zinc-400">Attribute 2</span>
                          <span className="text-sm text-white">{selectedItem.attribute2}</span>
                        </div>
                      )}
                      {selectedItem.attribute3 && (
                        <div className="flex justify-between items-start">
                          <span className="text-sm text-zinc-400">Attribute 3</span>
                          <span className="text-sm text-white">{selectedItem.attribute3}</span>
                        </div>
                      )}
                      {selectedItem.attribute4 && (
                        <div className="flex justify-between items-start">
                          <span className="text-sm text-zinc-400">Attribute 4</span>
                          <span className="text-sm text-white">{selectedItem.attribute4}</span>
                        </div>
                      )}
                      {selectedItem.attribute5 && (
                        <div className="flex justify-between items-start">
                          <span className="text-sm text-zinc-400">Attribute 5</span>
                          <span className="text-sm text-white">{selectedItem.attribute5}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Comment Section - Only show if comment exists */}
                {selectedItem.comment && (
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Comment</h4>
                    <div className="bg-zinc-800/50 rounded-lg p-4">
                      <p className="text-sm text-white">{selectedItem.comment}</p>
                    </div>
                  </div>
                )}

                {/* Metadata Section */}
                <div>
                  <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Metadata</h4>
                  <div className="bg-zinc-800/50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-zinc-400">Created</span>
                      <span className="text-sm text-white">{selectedItem.created}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-zinc-400">Created By</span>
                      <span className="text-sm text-white">{selectedItem.createdBy}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-zinc-400">Modified</span>
                      <span className="text-sm text-white">{selectedItem.modified}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-zinc-400">Modified By</span>
                      <span className="text-sm text-white">{selectedItem.modifiedBy}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'inventory' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-white">Inventory Records</h3>
                    <span className="text-sm text-zinc-400">
                      {sortedInventory.length} location{sortedInventory.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        // Generate CSV for current item's inventory
                        const visibleColumns = allInventoryColumns.filter(col => !inventoryHiddenColumns.includes(col));
                        const csv = [
                          ['Item Number', ...visibleColumns.map(formatColumnHeader)].join(','),
                          ...sortedInventory.map(inv => {
                            return [selectedItem.item, ...visibleColumns.map(col => {
                              const val = inv[col];
                              if (typeof val === 'string' && val.includes(',')) {
                                return `"${val}"`;
                              }
                              return val;
                            })].join(',');
                          })
                        ].join('\n');

                        const blob = new Blob([csv], { type: 'text/csv' });
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `inventory-${selectedItem.item}.csv`;
                        a.click();
                        window.URL.revokeObjectURL(url);
                      }}
                      className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors flex items-center gap-2 text-sm"
                    >
                      <Download size={16} />
                      Export
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors flex items-center gap-2 text-sm"
                    >
                      <Printer size={16} />
                      Print
                    </button>
                  </div>
                </div>

                {sortedInventory.length === 0 ? (
                  <div className="text-center py-8">
                    <Archive className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                    <p className="text-sm text-zinc-400">No inventory records found</p>
                  </div>
                ) : (
                  <div className="rounded-lg border border-zinc-800 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-zinc-800 bg-zinc-800/50">
                            {orderedInventoryColumns.map((key) => (
                              <th
                                key={key}
                                className={`px-4 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider cursor-pointer hover:text-zinc-300 transition-colors ${
                                  inventoryPinnedColumns.includes(key) ? 'sticky left-0 bg-zinc-800/90 z-10' : ''
                                }`}
                                onClick={() => handleInventorySort(key)}
                              >
                                <div className="flex items-center gap-2">
                                  {formatColumnHeader(key)}
                                  {inventorySortField === key && (
                                    inventorySortDirection === "asc" ? (
                                      <ChevronUp className="w-4 h-4" />
                                    ) : (
                                      <ChevronDown className="w-4 h-4" />
                                    )
                                  )}
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {sortedInventory.map((inv, idx) => (
                            <tr
                              key={idx}
                              onClick={() => {
                                if (selectedInventoryRecord?.storageLocation === inv.storageLocation && selectedInventoryRecord?.status === inv.status) {
                                  setSelectedInventoryRecord(null);
                                  setInventoryAction(null);
                                } else {
                                  setSelectedInventoryRecord(inv);
                                  setInventoryAction(null);
                                  setNewQuantity(inv.quantity);
                                  setNewInventoryStatus(inv.status === 'Available' ? 'Available' : 'Unavailable');
                                }
                              }}
                              className={`border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors cursor-pointer ${
                                selectedInventoryRecord?.storageLocation === inv.storageLocation && selectedInventoryRecord?.status === inv.status
                                  ? 'bg-blue-500/10 border-blue-500/30'
                                  : ''
                              }`}
                            >
                              {orderedInventoryColumns.map((key) => (
                                <td
                                  key={key}
                                  className={`px-4 py-3 text-sm text-zinc-300 ${
                                    inventoryPinnedColumns.includes(key) ? 'sticky left-0 bg-zinc-900/90 z-10' : ''
                                  }`}
                                >
                                  {key === 'status' ? (
                                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                      inv.status === 'Available'
                                        ? 'bg-green-500/20 text-green-400'
                                        : inv.status === 'Reserved'
                                        ? 'bg-yellow-500/20 text-yellow-400'
                                        : 'bg-zinc-500/20 text-zinc-400'
                                    }`}>
                                      {inv.status}
                                    </span>
                                  ) : (
                                    formatCellValue(inv[key], key)
                                  )}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Inventory Actions */}
                {selectedInventoryRecord && (
                  <div className="space-y-4 mt-6">
                    <h4 className="text-sm font-semibold text-white">Actions</h4>
                    
                    {/* Action Buttons */}
                    {!inventoryAction && (
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => {
                            setInventoryAction('quantity');
                            setShowQuantityPad(false);
                          }}
                          className="p-4 rounded-lg border-2 border-zinc-700 bg-zinc-800/30 hover:border-blue-600 hover:bg-blue-500/10 text-left transition-all"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-8 h-8 bg-zinc-700 rounded-lg flex items-center justify-center">
                              <Edit size={16} className="text-white" />
                            </div>
                            <h5 className="text-base font-semibold text-white">Change Quantity</h5>
                          </div>
                          <p className="text-xs text-zinc-400">Adjust inventory quantity</p>
                        </button>

                        <button
                          onClick={() => setInventoryAction('status')}
                          className="p-4 rounded-lg border-2 border-zinc-700 bg-zinc-800/30 hover:border-green-600 hover:bg-green-500/10 text-left transition-all"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-8 h-8 bg-zinc-700 rounded-lg flex items-center justify-center">
                              <RefreshCw size={16} className="text-white" />
                            </div>
                            <h5 className="text-base font-semibold text-white">Change Status</h5>
                          </div>
                          <p className="text-xs text-zinc-400">Update availability status</p>
                        </button>
                      </div>
                    )}

                    {/* Change Quantity Action */}
                    {inventoryAction === 'quantity' && (
                      <div className="bg-zinc-800/30 border border-zinc-700 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-semibold text-white mb-1">Change Quantity</h4>
                            <p className="text-sm text-zinc-400">Adjust the inventory quantity for this location</p>
                          </div>
                          <button
                            onClick={() => {
                              setInventoryAction(null);
                              setShowQuantityPad(false);
                            }}
                            className="text-zinc-400 hover:text-white transition-colors"
                          >
                            <X size={20} />
                          </button>
                        </div>

                        {/* Current Quantity Display */}
                        <div className="mb-6 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
                          <p className="text-xs text-zinc-400 mb-1">Current Quantity</p>
                          <p className="text-2xl font-bold text-white">{selectedInventoryRecord.quantity}</p>
                          <p className="text-xs text-zinc-400 mt-1">
                            Location: {selectedInventoryRecord.storageLocation}
                          </p>
                        </div>

                        {/* Quantity Adjustment */}
                        {!showQuantityPad ? (
                          <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-3">New Quantity</label>
                            <div className="flex items-center gap-3 mb-4">
                              <button
                                onClick={() => setNewQuantity(Math.max(0, newQuantity - 1))}
                                className="w-12 h-12 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors flex items-center justify-center"
                              >
                                <Plus size={20} className="rotate-45" />
                              </button>
                              <button
                                onClick={() => setShowQuantityPad(true)}
                                className="flex-1 h-12 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors text-2xl font-bold"
                              >
                                {newQuantity}
                              </button>
                              <button
                                onClick={() => setNewQuantity(newQuantity + 1)}
                                className="w-12 h-12 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors flex items-center justify-center"
                              >
                                <Plus size={20} />
                              </button>
                            </div>

                            <button
                              onClick={() => {
                                // Apply quantity change
                                alert(`Quantity changed from ${selectedInventoryRecord.quantity} to ${newQuantity} for location ${selectedInventoryRecord.storageLocation}`);
                                setInventoryAction(null);
                                setSelectedInventoryRecord(null);
                              }}
                              className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                            >
                              Apply Change
                            </button>
                          </div>
                        ) : (
                          <div>
                            <div className="mb-4 p-4 bg-zinc-700 rounded-lg text-center">
                              <p className="text-3xl font-bold text-white">{newQuantity}</p>
                            </div>

                            {/* Number Pad */}
                            <div className="grid grid-cols-3 gap-2 mb-4">
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                                <button
                                  key={num}
                                  onClick={() => setNewQuantity(parseInt(`${newQuantity}${num}`))}
                                  className="h-12 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors text-lg font-medium"
                                >
                                  {num}
                                </button>
                              ))}
                              <button
                                onClick={() => setNewQuantity(Math.floor(newQuantity / 10))}
                                className="h-12 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors text-lg font-medium"
                              >
                                ←
                              </button>
                              <button
                                onClick={() => setNewQuantity(parseInt(`${newQuantity}0`))}
                                className="h-12 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors text-lg font-medium"
                              >
                                0
                              </button>
                              <button
                                onClick={() => setNewQuantity(0)}
                                className="h-12 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-lg font-medium"
                              >
                                C
                              </button>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={() => setShowQuantityPad(false)}
                                className="px-4 py-3 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors font-medium"
                              >
                                Back
                              </button>
                              <button
                                onClick={() => {
                                  // Apply quantity change
                                  alert(`Quantity changed from ${selectedInventoryRecord.quantity} to ${newQuantity} for location ${selectedInventoryRecord.storageLocation}`);
                                  setInventoryAction(null);
                                  setSelectedInventoryRecord(null);
                                  setShowQuantityPad(false);
                                }}
                                className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                              >
                                Apply
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Change Status Action */}
                    {inventoryAction === 'status' && (
                      <div className="bg-zinc-800/30 border border-zinc-700 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-semibold text-white mb-1">Change Status</h4>
                            <p className="text-sm text-zinc-400">Update the availability status for this inventory</p>
                          </div>
                          <button
                            onClick={() => setInventoryAction(null)}
                            className="text-zinc-400 hover:text-white transition-colors"
                          >
                            <X size={20} />
                          </button>
                        </div>

                        {/* Current Status Display */}
                        <div className="mb-6 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs text-zinc-400 mb-1">Current Status</p>
                              <p className="text-base font-semibold text-white">{selectedInventoryRecord.status}</p>
                              <p className="text-xs text-zinc-400 mt-2">
                                Location: {selectedInventoryRecord.storageLocation}
                              </p>
                            </div>
                            {selectedInventoryRecord.status === 'Available' ? (
                              <CheckCircle2 size={32} className="text-green-500" />
                            ) : (
                              <AlertCircle size={32} className="text-orange-500" />
                            )}
                          </div>
                        </div>

                        {/* Status Selection */}
                        <div>
                          <label className="block text-sm font-medium text-zinc-300 mb-3">Select New Status</label>
                          <div className="grid grid-cols-2 gap-3 mb-4">
                            <button
                              onClick={() => {
                                // Apply status change
                                alert(`Status changed from ${selectedInventoryRecord.status} to Available for location ${selectedInventoryRecord.storageLocation}`);
                                setInventoryAction(null);
                                setSelectedInventoryRecord(null);
                              }}
                              disabled={selectedInventoryRecord.status === 'Available'}
                              className={`p-4 rounded-lg border-2 text-left transition-all ${
                                selectedInventoryRecord.status === 'Available'
                                  ? 'border-zinc-700 bg-zinc-800/20 opacity-50 cursor-not-allowed'
                                  : 'border-zinc-700 bg-zinc-800/30 hover:border-green-600 hover:bg-green-500/10'
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <CheckCircle2 size={20} className={selectedInventoryRecord.status === 'Available' ? 'text-zinc-600' : 'text-green-400'} />
                                <h5 className="text-base font-semibold text-white">Available</h5>
                              </div>
                              <p className="text-xs text-zinc-400">Inventory is ready for use</p>
                            </button>

                            <button
                              onClick={() => {
                                // Apply status change
                                alert(`Status changed from ${selectedInventoryRecord.status} to Unavailable for location ${selectedInventoryRecord.storageLocation}`);
                                setInventoryAction(null);
                                setSelectedInventoryRecord(null);
                              }}
                              disabled={selectedInventoryRecord.status === 'Unavailable'}
                              className={`p-4 rounded-lg border-2 text-left transition-all ${
                                selectedInventoryRecord.status === 'Unavailable'
                                  ? 'border-zinc-700 bg-zinc-800/20 opacity-50 cursor-not-allowed'
                                  : 'border-zinc-700 bg-zinc-800/30 hover:border-orange-600 hover:bg-orange-500/10'
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <AlertCircle size={20} className={selectedInventoryRecord.status === 'Unavailable' ? 'text-zinc-600' : 'text-orange-400'} />
                                <h5 className="text-base font-semibold text-white">Unavailable</h5>
                              </div>
                              <p className="text-xs text-zinc-400">Inventory is not in use</p>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'supplemental' && (
              <div className="space-y-6">
                {/* Top Type Section */}
                <div>
                  <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Top Configuration</h4>
                  <div className="bg-zinc-800/50 rounded-lg p-4 space-y-4">
                    <div>
                      <label className="block text-sm text-zinc-400 mb-2">
                        Top Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={topType}
                        onChange={(e) => setTopType(e.target.value as 'Full' | 'Tapered' | '')}
                        className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="">Select Top Type</option>
                        <option value="Full">Full</option>
                        <option value="Tapered">Tapered</option>
                      </select>
                    </div>

                    {/* Conditional fields for Tapered */}
                    {topType === 'Tapered' && (
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div>
                          <label className="block text-sm text-zinc-400 mb-2">
                            Top Length <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={topLength}
                            onChange={(e) => setTopLength(e.target.value)}
                            placeholder="Enter top length"
                            className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-zinc-400 mb-2">
                            Top Width <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={topWidth}
                            onChange={(e) => setTopWidth(e.target.value)}
                            placeholder="Enter top width"
                            className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Item Type Section */}
                <div>
                  <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Item Configuration</h4>
                  <div className="bg-zinc-800/50 rounded-lg p-4 space-y-4">
                    <div>
                      <label className="block text-sm text-zinc-400 mb-2">
                        Item Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={itemType}
                        onChange={(e) => setItemType(e.target.value as 'Shrink Wrap' | 'Box' | 'Cans in Tray' | 'Boxes in Tray' | 'Bottles in Crates' | '')}
                        className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="">Select Item Type</option>
                        <option value="Shrink Wrap">Shrink Wrap</option>
                        <option value="Box">Box</option>
                        <option value="Cans in Tray">Cans in Tray</option>
                        <option value="Boxes in Tray">Boxes in Tray</option>
                        <option value="Bottles in Crates">Bottles in Crates</option>
                      </select>
                    </div>

                    {/* Conditional fields for tray-based types */}
                    {(itemType === 'Cans in Tray' || itemType === 'Boxes in Tray' || itemType === 'Bottles in Crates') && (
                      <div className="space-y-4 pt-2">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-zinc-400 mb-2">
                              Tray Pattern Length Count <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={trayPatternLengthCount}
                              onChange={(e) => setTrayPatternLengthCount(e.target.value)}
                              placeholder="Enter count"
                              className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-zinc-400 mb-2">
                              Tray Pattern Width Count <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={trayPatternWidthCount}
                              onChange={(e) => setTrayPatternWidthCount(e.target.value)}
                              placeholder="Enter count"
                              className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                            />
                          </div>
                        </div>

                        {/* Additional field for Boxes in Tray */}
                        {itemType === 'Boxes in Tray' && (
                          <div>
                            <label className="flex items-center gap-3 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={trayPatternOrientationOpposite}
                                onChange={(e) => setTrayPatternOrientationOpposite(e.target.checked)}
                                className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-blue-500 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                              />
                              <span className="text-sm text-zinc-400">
                                Tray Pattern Orientation Opposite <span className="text-red-500">*</span>
                              </span>
                            </label>
                          </div>
                        )}

                        {/* Additional field for Bottles in Crates */}
                        {itemType === 'Bottles in Crates' && (
                          <div>
                            <label className="block text-sm text-zinc-400 mb-2">
                              Shell Type <span className="text-red-500">*</span>
                            </label>
                            <select
                              value={shellType}
                              onChange={(e) => setShellType(e.target.value as '2L' | '200oz' | '500ml' | '')}
                              className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-blue-500"
                            >
                              <option value="">Select Shell Type</option>
                              <option value="2L">2L</option>
                              <option value="200oz">200oz</option>
                              <option value="500ml">500ml</option>
                            </select>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <button
                    className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    <CheckCircle2 size={18} />
                    Save Attributes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Inventory Report Modal */}
      {showInventoryReport && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 rounded-lg border border-zinc-800 shadow-2xl w-full max-w-7xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-zinc-800">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Inventory Report</h2>
                  <p className="text-sm text-zinc-400">
                    {selectedItemsForInventory.size} item{selectedItemsForInventory.size !== 1 ? 's' : ''} selected
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      // Generate CSV
                      const selectedInventory = mockItems
                        .filter(item => selectedItemsForInventory.has(item.item))
                        .flatMap(item => getInventoryForItem(item.item));
                      
                      const visibleColumns = allInventoryColumns.filter(col => !inventoryHiddenColumns.includes(col));
                      const csv = [
                        ['Item Number', ...visibleColumns.map(formatColumnHeader)].join(','),
                        ...selectedInventory.map(inv => {
                          const item = mockItems.find(i => i.item === inv.item);
                          return [item?.item || '', ...visibleColumns.map(col => {
                            const val = inv[col];
                            if (typeof val === 'string' && val.includes(',')) {
                              return `"${val}"`;
                            }
                            return val;
                          })].join(',');
                        })
                      ].join('\n');

                      const blob = new Blob([csv], { type: 'text/csv' });
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'inventory-report.csv';
                      a.click();
                      window.URL.revokeObjectURL(url);
                    }}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Download size={18} />
                    Export
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Printer size={18} />
                    Print
                  </button>
                  <button
                    onClick={() => setShowInventoryReport(false)}
                    className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
                  >
                    <X className="w-5 h-5 text-zinc-400" />
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs text-zinc-400 mb-2">Status</label>
                  <input
                    type="text"
                    placeholder="Filter by status..."
                    value={reportStatusFilter}
                    onChange={(e) => setReportStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-2">Storage Location</label>
                  <input
                    type="text"
                    placeholder="Filter by location..."
                    value={reportLocationFilter}
                    onChange={(e) => setReportLocationFilter(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-2">Parent Storage</label>
                  <input
                    type="text"
                    placeholder="Filter by parent..."
                    value={reportParentFilter}
                    onChange={(e) => setReportParentFilter(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-2">Quantity</label>
                  <div className="flex gap-2">
                    <select
                      value={reportQuantityOperator}
                      onChange={(e) => setReportQuantityOperator(e.target.value as '<=' | '>=' | '=')}
                      className="px-2 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm focus:outline-none focus:border-blue-500"
                    >
                      <option value="=">=</option>
                      <option value="<=">≤</option>
                      <option value=">=">≥</option>
                    </select>
                    <input
                      type="number"
                      placeholder="Value"
                      value={reportQuantityValue}
                      onChange={(e) => setReportQuantityValue(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-auto p-6">
              <div className="rounded-lg border border-zinc-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-zinc-800 bg-zinc-800/50">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                          Item Number
                        </th>
                        {allInventoryColumns
                          .filter(col => !inventoryHiddenColumns.includes(col))
                          .map(col => (
                            <th key={col} className="px-4 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                              {formatColumnHeader(col)}
                            </th>
                          ))}
                      </tr>
                    </thead>
                    <tbody>
                      {mockItems
                        .filter(item => selectedItemsForInventory.has(item.item))
                        .flatMap(item => {
                          const inventoryRecords = getInventoryForItem(item.item);
                          return inventoryRecords.map(inv => ({ ...inv, item: item.item }));
                        })
                        .filter(inv => {
                          // Apply filters
                          if (reportStatusFilter && !inv.status.toLowerCase().includes(reportStatusFilter.toLowerCase())) {
                            return false;
                          }
                          if (reportLocationFilter && !inv.storageLocation.toLowerCase().includes(reportLocationFilter.toLowerCase())) {
                            return false;
                          }
                          if (reportParentFilter && !inv.parentStorage.toLowerCase().includes(reportParentFilter.toLowerCase())) {
                            return false;
                          }
                          if (reportQuantityValue) {
                            const qty = inv.quantity;
                            const filterQty = parseFloat(reportQuantityValue);
                            if (reportQuantityOperator === '=' && qty !== filterQty) return false;
                            if (reportQuantityOperator === '<=' && qty > filterQty) return false;
                            if (reportQuantityOperator === '>=' && qty < filterQty) return false;
                          }
                          return true;
                        })
                        .map((inv, idx) => (
                          <tr key={idx} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                            <td className="px-4 py-3 text-sm text-zinc-300 font-mono font-medium">
                              {inv.item}
                            </td>
                            {allInventoryColumns
                              .filter(col => !inventoryHiddenColumns.includes(col))
                              .map(col => (
                                <td key={col} className="px-4 py-3 text-sm text-zinc-300">
                                  {col === 'status' ? (
                                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                      inv.status === 'Available'
                                        ? 'bg-green-500/20 text-green-400'
                                        : inv.status === 'Reserved'
                                        ? 'bg-yellow-500/20 text-yellow-400'
                                        : 'bg-zinc-500/20 text-zinc-400'
                                    }`}>
                                      {inv.status}
                                    </span>
                                  ) : (
                                    formatCellValue(inv[col], col)
                                  )}
                                </td>
                              ))}
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}