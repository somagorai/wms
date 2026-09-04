import { useState, useEffect } from "react";
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
  MasterTableEmptyRow,
} from "../components/tables/MasterTable";
import { DetailSidePanel, PanelSection, PanelRow } from "../components/panels/DetailSidePanel";

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
 <div className="text-[var(--foreground)]">Loading items...</div>
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
 <div className="flex h-full bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)]">
 {/* Main Content Area */}
 <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${selectedItem ? 'mr-[600px]' : ''}`}>
 {/* Sticky Header */}
 <div className="sticky top-0 z-40 bg-[var(--background)]/95 backdrop-blur-md text-[var(--foreground)] border-b border-[var(--border)] px-8 pt-6 pb-4">
 <div className="flex items-center justify-between gap-4">
 <nav className="flex items-center gap-2 text-sm">
 <Link to="/app/home" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] dark:hover:text-[var(--primary)] transition-colors flex items-center gap-1">
 <Home size={14} />Home
 </Link>
 <ChevronRight size={14} className="text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]" />
 <Link to="/app/navigation?section=operations" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] dark:hover:text-[var(--primary)] transition-colors">Operations</Link>
 <ChevronRight size={14} className="text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]" />
 <span className="text-[var(--foreground)]  font-semibold text-lg flex items-center gap-2">
 <Package size={20} className="text-[var(--primary)] dark:text-[var(--primary)]" />Items
 </span>
 </nav>
 <div className="flex items-center gap-2">
 <button onClick={() => {}} className="p-2 rounded-lg border-[var(--border)]  bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--surface-container-low)] dark:hover:bg-[var(--surface-container-high)] text-[var(--muted-foreground)] transition-colors" title="Refresh"><RefreshCw size={16} /></button>
 <button onClick={exportToCSV} className="p-2 rounded-lg border-[var(--border)]  bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--surface-container-low)] dark:hover:bg-[var(--surface-container-high)] text-[var(--muted-foreground)] transition-colors" title="Export"><Download size={16} /></button>
 <div className="flex items-center gap-2">
 {showInventoryMode && selectedItemsForInventory.size > 0 && (
 <button
 onClick={() => setShowInventoryReport(true)}
 className="px-4 py-2 bg-[var(--primary)] hover:opacity-90 active:scale-[0.98] text-[var(--primary-foreground)] rounded-lg transition-all flex items-center gap-2 font-medium shadow-xs"
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
 className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 border ${
 showInventoryMode
 ? "bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 border-transparent font-medium shadow-xs"
 : "bg-[var(--surface-container-high)] text-[var(--foreground)] hover:bg-[var(--surface-container-highest)] border border-transparent"
 }`}
 >
 <Package size={18} />
 <span>{showInventoryMode ? 'Cancel' : 'Inventory'}</span>
 </button>
 <div className="relative">
 <button
 onClick={() => setShowFilterPanel(!showFilterPanel)}
 className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 border ${
 showFilterPanel || hasActiveFilters
 ? "bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 border border-transparent"
 : "bg-[var(--surface-container-high)] text-[var(--foreground)] hover:bg-[var(--surface-container-highest)] border border-transparent"
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
 </div>
 </div>
 </div>
 </div>

 <div className="flex-1 overflow-y-auto p-8 space-y-6">
        {/* Statistics Tiles */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-6">
          <TopCard
            type="clickable"
            status="neutral"
            label="Total Items"
            value={totalItems}
            icon={<Package size={18} />}
            isSelected={activeFilter === "total"}
            isDimmed={activeFilter !== null && activeFilter !== "total"}
            onClick={() => handleTileClick("total")}
          />
          <TopCard
            type="clickable"
            status="warning"
            label="Electronics"
            value={electronicsItems}
            icon={<Zap size={18} />}
            isSelected={activeFilter === "electronics"}
            isDimmed={activeFilter !== null && activeFilter !== "electronics"}
            onClick={() => handleTileClick("electronics")}
          />
          <TopCard
            type="clickable"
            status="info"
            label="Office Supplies"
            value={officeSuppliesItems}
            icon={<FileText size={18} />}
            isSelected={activeFilter === "office-supplies"}
            isDimmed={activeFilter !== null && activeFilter !== "office-supplies"}
            onClick={() => handleTileClick("office-supplies")}
          />
          <TopCard
            type="clickable"
            status="error"
            label="Health & Safety"
            value={healthSafetyItems}
            icon={<AlertCircle size={18} />}
            isSelected={activeFilter === "health-safety"}
            isDimmed={activeFilter !== null && activeFilter !== "health-safety"}
            onClick={() => handleTileClick("health-safety")}
          />
          <TopCard
            type="clickable"
            status="success"
            label="FIFO Tracked"
            value={fifoTrackedItems}
            icon={<Clock size={18} />}
            isSelected={activeFilter === "fifo-tracked"}
            isDimmed={activeFilter !== null && activeFilter !== "fifo-tracked"}
            onClick={() => handleTileClick("fifo-tracked")}
          />
        </div>

        {/* Advanced Filter Panel */}
 {showFilterPanel && (
 <div className="p-4 rounded-lg bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  space-y-4">
 <div className="flex items-center justify-between">
 <h3 className="text-sm font-semibold text-[var(--foreground)] ">Advanced Filters</h3>
 {(selectedClasses.size > 0 || selectedHandlingCodes.size > 0) && (
 <button
 onClick={clearAdvancedFilters}
 className="text-sm text-[var(--primary)] hover:underline font-medium"
 >
 Clear Filters
 </button>
 )}
 </div>

 <div className="grid grid-cols-2 gap-4">
 {/* Item Class Filter */}
 <div className="filter-dropdown relative">
 <label className="block text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] mb-2">Item Class</label>
 <button
 onClick={() => setActiveDropdown(activeDropdown === 'class' ? null : 'class')}
 className="w-full px-3 py-2 rounded-lg bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  text-left flex items-center justify-between text-sm text-[var(--foreground)] hover:border-[var(--border)]"
 >
 <span>
 {selectedClasses.size === 0
 ? "All Classes"
 : `${selectedClasses.size} selected`}
 </span>
 <ChevronDown className="w-4 h-4 text-[var(--muted-foreground)]" />
 </button>

 {activeDropdown === 'class' && (
 <div className="absolute top-full left-0 right-0 mt-1 p-2 rounded-lg bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  z-50 max-h-64 overflow-y-auto">
 <input
 type="text"
 placeholder="Search classes..."
 value={classSearch}
 onChange={(e) => setClassSearch(e.target.value)}
 className="w-full px-3 py-2 mb-2 rounded-lg bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  text-[var(--foreground)] text-sm placeholder-zinc-500 focus:outline-none focus:border-[var(--primary)]"
 />
 {getFilteredClasses().map((itemClass) => (
 <button
 key={itemClass}
 onClick={() => toggleFilterOption('class', itemClass)}
 className="w-full px-3 py-2 rounded-lg hover:bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)]/50 flex items-center gap-2 text-sm text-[var(--foreground)]"
 >
 <div className={`w-4 h-4 rounded border ${
 selectedClasses.has(itemClass)
 ? 'bg-[var(--primary)] border-[var(--primary)] text-[var(--primary-foreground)]'
 : 'border-[var(--border)]'
 } flex items-center justify-center`}>
 {selectedClasses.has(itemClass) && (
 <CheckCircle2 className="w-3 h-3 text-[var(--foreground)]" />
 )}
 </div>
 <span>{itemClass}</span>
 <span className="ml-auto text-xs text-[var(--muted-foreground)]">
 {mockItems.filter(i => i.itemClass === itemClass).length}
 </span>
 </button>
 ))}
 </div>
 )}
 </div>

 {/* Handling Code Filter */}
 <div className="filter-dropdown relative">
 <label className="block text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] mb-2">Handling Code</label>
 <button
 onClick={() => setActiveDropdown(activeDropdown === 'handlingCode' ? null : 'handlingCode')}
 className="w-full px-3 py-2 rounded-lg bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  text-left flex items-center justify-between text-sm text-[var(--foreground)] hover:border-[var(--border)]"
 >
 <span>
 {selectedHandlingCodes.size === 0
 ? "All Codes"
 : `${selectedHandlingCodes.size} selected`}
 </span>
 <ChevronDown className="w-4 h-4 text-[var(--muted-foreground)]" />
 </button>

 {activeDropdown === 'handlingCode' && (
 <div className="absolute top-full left-0 right-0 mt-1 p-2 rounded-lg bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  z-50 max-h-64 overflow-y-auto">
 <input
 type="text"
 placeholder="Search codes..."
 value={handlingCodeSearch}
 onChange={(e) => setHandlingCodeSearch(e.target.value)}
 className="w-full px-3 py-2 mb-2 rounded-lg bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  text-[var(--foreground)] text-sm placeholder-zinc-500 focus:outline-none focus:border-[var(--primary)]"
 />
 {getFilteredHandlingCodes().map((code) => (
 <button
 key={code}
 onClick={() => toggleFilterOption('handlingCode', code)}
 className="w-full px-3 py-2 rounded-lg hover:bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)]/50 flex items-center gap-2 text-sm text-[var(--foreground)]"
 >
 <div className={`w-4 h-4 rounded border ${
 selectedHandlingCodes.has(code)
 ? 'bg-[var(--primary)] border-[var(--primary)] text-[var(--primary-foreground)]'
 : 'border-[var(--border)]'
 } flex items-center justify-center`}>
 {selectedHandlingCodes.has(code) && (
 <CheckCircle2 className="w-3 h-3 text-[var(--foreground)]" />
 )}
 </div>
 <span>{code}</span>
 <span className="ml-auto text-xs text-[var(--muted-foreground)]">
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
 className="px-3 py-1 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/30 flex items-center gap-2 text-sm text-[var(--primary)]"
 >
 <span>{itemClass}</span>
 <button
 onClick={() => toggleFilterOption('class', itemClass)}
 className="hover:text-[var(--primary)]"
 >
 <X className="w-3 h-3" />
 </button>
 </div>
 ))}
 {Array.from(selectedHandlingCodes).map((code) => (
 <div
 key={code}
 className="px-3 py-1 rounded-full bg-[var(--state-success-container)] border border-[var(--state-success)]/30 flex items-center gap-2 text-sm text-[var(--state-success)]"
 >
 <span>{code}</span>
 <button
 onClick={() => toggleFilterOption('handlingCode', code)}
 className="hover:text-[var(--state-success)]"
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
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
 <input
 type="text"
 placeholder="Search items..."
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 className="w-full pl-10 pr-4 py-2 rounded-lg bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  text-[var(--foreground)] placeholder-zinc-500 focus:outline-none focus:border-[var(--primary)]"
 />
 </div>

      {/* Data Grid */}
      <MasterTableContainer type="actionable">
        <MasterTable type="actionable">
          <MasterTableHead type="actionable">
            <tr>
              {showInventoryMode && (
                <MasterTableTh type="actionable" density="compact" className="sticky left-0 bg-[var(--surface-container-high)] text-[var(--foreground)]/90 z-10 w-12 border-r border-[var(--border)]">
                  <input
                    type="checkbox"
                    checked={allItemsSelected}
                    ref={(input) => {
                      if (input) {
                        input.indeterminate = someItemsSelected;
                      }
                    }}
                    onChange={(e) => handleSelectAllItems(e.target.checked)}
                    className="w-4 h-4 rounded border-[var(--border)] bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)] cursor-pointer"
                  />
                </MasterTableTh>
              )}
              {orderedItemColumns.map((key) => {
                const isPinned = itemsPinnedColumns.includes(key);
                return (
                  <MasterTableTh
                    key={key}
                    type="actionable"
                    density="compact"
                    className={`relative group ${isPinned ? 'sticky bg-[var(--surface-container-high)] text-[var(--foreground)]/90 z-10 border-r border-[var(--border)]' : ''}`}
                    style={{
                      ...(columnWidths[key] ? { width: `${columnWidths[key]}px`, minWidth: `${columnWidths[key]}px` } : { minWidth: `${getItemColumnMinWidth(key)}px` }),
                      ...(isPinned && showInventoryMode ? { left: '60px' } : isPinned ? { left: '0' } : {})
                    }}
                  >
                    <div 
                      className="flex items-center gap-2 cursor-pointer hover:text-[var(--foreground)] transition-colors"
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
                      className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-[var(--primary)] group-hover:bg-[var(--primary)]/50"
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
                  </MasterTableTh>
                );
              })}
            </tr>
          </MasterTableHead>
          <MasterTableBody type="actionable">
            {sortedItems.map((item) => {
              const isSelected = selectedItem?.item === item.item;
              const isChecked = selectedItemsForInventory.has(item.item);
              return (
                <MasterTableRow
                  key={item.item}
                  type="actionable"
                  clickable={!showInventoryMode}
                  selected={isSelected}
                  onClick={() => !showInventoryMode && setSelectedItem(item)}
                >
                  {showInventoryMode && (
                    <MasterTableCell 
                      type="actionable"
                      density="compact"
                      className="sticky left-0 bg-[var(--surface-container-high)] text-[var(--foreground)]/90 z-10 border-r border-[var(--border)]/50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => handleSelectItem(item.item, e.target.checked)}
                        className="w-4 h-4 rounded border-[var(--border)] bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)] cursor-pointer"
                      />
                    </MasterTableCell>
                  )}
                  {orderedItemColumns.map((key) => {
                    const isPinned = itemsPinnedColumns.includes(key);
                    return (
                      <MasterTableCell
                        key={key}
                        type="actionable"
                        density="compact"
                        className={`${getCellClassName(key)} ${isPinned ? 'sticky bg-[var(--surface-container-high)] text-[var(--foreground)]/90 z-10 border-r border-[var(--border)]/50' : ''}`}
                        style={{
                          ...(columnWidths[key] ? { width: `${columnWidths[key]}px`, minWidth: `${columnWidths[key]}px` } : { minWidth: `${getItemColumnMinWidth(key)}px` }),
                          ...(isPinned && showInventoryMode ? { left: '60px' } : isPinned ? { left: '0' } : {})
                        }}
                      >
                        {formatCellValue(item[key], key)}
                      </MasterTableCell>
                    );
                  })}
                </MasterTableRow>
              );
            })}
          </MasterTableBody>
        </MasterTable>
      </MasterTableContainer>

 {/* Results Summary */}
 <div className="flex items-center justify-between text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">
 <span>
 Showing {sortedItems.length} of {totalItems} items
 </span>
 </div>
 </div>
 </div>
 </div>

      {/* Right Side Panel */}
      {selectedItem && (
        <DetailSidePanel
          title={selectedItem.item}
          subtitle={selectedItem.description}
          icon={<Package size={24} className="text-[var(--primary)]" />}
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab as any)}
          tabs={[
            { id: "details", label: "Details" },
            { id: "inventory", label: "Inventory" },
            { id: "supplemental", label: "Supplemental Attributes" },
          ]}
          onClose={() => setSelectedItem(null)}
        >
          {activeTab === "details" && (
            <div className="space-y-6">
              {/* Item Information Section */}
              <PanelSection title="Item Information">
                <PanelRow label="Item" value={selectedItem.item} mono />
                <PanelRow label="Description" value={selectedItem.description} />
                <PanelRow label="Item Class" value={selectedItem.itemClass} />
                <PanelRow label="Handling Code" value={selectedItem.handlingCode} />
              </PanelSection>

              {/* Physical Properties Section */}
              <PanelSection title="Physical Properties">
                <PanelRow
                  label={`Dimensions (${selectedItem.dimensionUnits})`}
                  value={`${selectedItem.length} x ${selectedItem.width} x ${selectedItem.height}`}
                  mono
                />
                <PanelRow label={`Weight (${selectedItem.weightUnits})`} value={selectedItem.weight} mono />
              </PanelSection>

              {/* Tracking & Control Section */}
              <PanelSection title="Tracking & Control">
                <PanelRow
                  label="FIFO Tracking"
                  value={
                    <div className="flex items-center gap-2 justify-end">
                      {selectedItem.fifoTracking ? (
                        <>
                          <CheckCircle2 size={14} className="text-[var(--state-success)]" />
                          <span className="text-sm text-[var(--state-success)] font-medium">Yes</span>
                        </>
                      ) : (
                        <>
                          <X size={14} className="text-[var(--state-error)]" />
                          <span className="text-sm text-[var(--state-error)] font-medium">No</span>
                        </>
                      )}
                    </div>
                  }
                />
                <PanelRow
                  label="Expiry Date Controlled"
                  value={
                    <div className="flex items-center gap-2 justify-end">
                      {selectedItem.expiryDateControlled ? (
                        <>
                          <CheckCircle2 size={14} className="text-[var(--state-success)]" />
                          <span className="text-sm text-[var(--state-success)] font-medium">Yes</span>
                        </>
                      ) : (
                        <>
                          <X size={14} className="text-[var(--state-error)]" />
                          <span className="text-sm text-[var(--state-error)] font-medium">No</span>
                        </>
                      )}
                    </div>
                  }
                />
                <PanelRow label="Replen Window" value={`${selectedItem.replenWindow} days`} mono />
              </PanelSection>

              {/* Attributes Section */}
              {(selectedItem.attribute1 ||
                selectedItem.attribute2 ||
                selectedItem.attribute3 ||
                selectedItem.attribute4 ||
                selectedItem.attribute5) && (
                <PanelSection title="Attributes">
                  {selectedItem.attribute1 && <PanelRow label="Attribute 1" value={selectedItem.attribute1} />}
                  {selectedItem.attribute2 && <PanelRow label="Attribute 2" value={selectedItem.attribute2} />}
                  {selectedItem.attribute3 && <PanelRow label="Attribute 3" value={selectedItem.attribute3} />}
                  {selectedItem.attribute4 && <PanelRow label="Attribute 4" value={selectedItem.attribute4} />}
                  {selectedItem.attribute5 && <PanelRow label="Attribute 5" value={selectedItem.attribute5} />}
                </PanelSection>
              )}

              {/* Comment Section */}
              {selectedItem.comment && (
                <PanelSection title="Comment">
                  <p className="text-sm text-[var(--foreground)]">{selectedItem.comment}</p>
                </PanelSection>
              )}

              {/* Metadata Section */}
              <PanelSection title="Metadata">
                <PanelRow label="Created" value={selectedItem.created} mono />
                <PanelRow label="Created By" value={selectedItem.createdBy} />
                <PanelRow label="Modified" value={selectedItem.modified} mono />
                <PanelRow label="Modified By" value={selectedItem.modifiedBy} />
              </PanelSection>
            </div>
          )}

 {activeTab === 'inventory' && (
 <div className="space-y-4">
 <div className="flex items-center justify-between">
 <div>
 <h3 className="text-sm font-semibold text-[var(--foreground)] ">Inventory Records</h3>
 <span className="text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">
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
 className="px-3 py-1.5 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] text-[var(--foreground)] rounded-lg transition-colors flex items-center gap-2 text-sm"
 >
 <Download size={16} />
 Export
 </button>
 <button
 onClick={() => window.print()}
 className="px-3 py-1.5 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] text-[var(--foreground)] rounded-lg transition-colors flex items-center gap-2 text-sm"
 >
 <Printer size={16} />
 Print
 </button>
 </div>
 </div>

 {sortedInventory.length === 0 ? (
 <div className="text-center py-8">
 <Archive className="w-12 h-12 text-[var(--muted-foreground)] mx-auto mb-3" />
 <p className="text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">No inventory records found</p>
 </div>
 ) : (
 <MasterTableContainer type="nested">
          <MasterTable type="nested">
            <MasterTableHead type="nested">
              <tr>
                {orderedInventoryColumns.map((key) => (
                  <MasterTableTh
                    key={key}
                    type="nested"
                    density="compact"
                    className={`cursor-pointer hover:text-[var(--foreground)] transition-colors ${
                      inventoryPinnedColumns.includes(key) ? 'sticky left-0 bg-[var(--surface-container)] text-[var(--foreground)] border-r border-[var(--border)] z-10' : ''
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
                  </MasterTableTh>
                ))}
              </tr>
            </MasterTableHead>
            <MasterTableBody type="nested">
              {sortedInventory.map((inv, idx) => (
                <MasterTableRow
                  key={idx}
                  type="nested"
                  clickable
                  selected={selectedInventoryRecord?.storageLocation === inv.storageLocation && selectedInventoryRecord?.status === inv.status}
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
                >
                  {orderedInventoryColumns.map((key) => (
                    <MasterTableCell
                      key={key}
                      type="nested"
                      density="compact"
                      className={inventoryPinnedColumns.includes(key) ? 'sticky left-0 bg-[var(--surface-container-high)] text-[var(--foreground)]/90 z-10 border-r border-[var(--border)]' : ''}
                    >
                      {key === 'status' ? (
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          inv.status === 'Available'
                            ? 'bg-[var(--state-success-container)] text-[var(--state-success)]'
                            : inv.status === 'Reserved'
                            ? 'bg-[var(--state-warning)]/20 text-[var(--state-warning)]'
                            : 'bg-[var(--state-debug)]/20 text-[var(--muted-foreground)]'
                        }`}>
                          {inv.status}
                        </span>
                      ) : (
                        formatCellValue(inv[key], key)
                      )}
                    </MasterTableCell>
                  ))}
                </MasterTableRow>
              ))}
            </MasterTableBody>
          </MasterTable>
        </MasterTableContainer>
 )}

 {/* Inventory Actions */}
 {selectedInventoryRecord && (
 <div className="space-y-4 mt-6">
 <h4 className="text-sm font-semibold text-[var(--foreground)] ">Actions</h4>
 
 {/* Action Buttons */}
 {!inventoryAction && (
 <div className="grid grid-cols-2 gap-3">
 <button
 onClick={() => {
 setInventoryAction('quantity');
 setShowQuantityPad(false);
 }}
 className="p-4 rounded-lg border-2 border-[var(--border)] bg-[var(--surface-container-lowest)] dark:bg-[var(--surface-container)] hover:border-[var(--primary)] hover:bg-[var(--primary)]/10 text-left transition-all"
 >
 <div className="flex items-center gap-2 mb-1">
 <div className="w-8 h-8 bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] rounded-lg flex items-center justify-center">
 <Edit size={16} className="text-[var(--foreground)]" />
 </div>
 <h5 className="text-base font-semibold text-[var(--foreground)] ">Change Quantity</h5>
 </div>
 <p className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">Adjust inventory quantity</p>
 </button>

 <button
 onClick={() => setInventoryAction('status')}
 className="p-4 rounded-lg border-2 border-[var(--border)]  bg-[var(--surface-container-lowest)] dark:bg-[var(--surface-container)] hover:border-[var(--state-success)] hover:bg-[var(--state-success-container)]/60 text-left transition-all"
 >
 <div className="flex items-center gap-2 mb-1">
 <div className="w-8 h-8 bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] rounded-lg flex items-center justify-center">
 <RefreshCw size={16} className="text-[var(--foreground)]" />
 </div>
 <h5 className="text-base font-semibold text-[var(--foreground)] ">Change Status</h5>
 </div>
 <p className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">Update availability status</p>
 </button>
 </div>
 )}

 {/* Change Quantity Action */}
 {inventoryAction === 'quantity' && (
 <div className="bg-[var(--surface-container-lowest)] dark:bg-[var(--surface-container)] border-[var(--border)]  rounded-lg p-6">
 <div className="flex items-center justify-between mb-4">
 <div>
 <h4 className="text-lg font-semibold text-[var(--foreground)]  mb-1">Change Quantity</h4>
 <p className="text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">Adjust the inventory quantity for this location</p>
 </div>
 <button
 onClick={() => {
 setInventoryAction(null);
 setShowQuantityPad(false);
 }}
 className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
 >
 <X size={20} />
 </button>
 </div>

 {/* Current Quantity Display */}
 <div className="mb-6 p-4 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-lg border-[var(--border)] ">
 <p className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] mb-1">Current Quantity</p>
 <p className="text-2xl font-bold text-[var(--foreground)] ">{selectedInventoryRecord.quantity}</p>
 <p className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] mt-1">
 Location: {selectedInventoryRecord.storageLocation}
 </p>
 </div>

 {/* Quantity Adjustment */}
 {!showQuantityPad ? (
 <div>
 <label className="block text-sm font-medium text-[var(--foreground)] mb-3">New Quantity</label>
 <div className="flex items-center gap-3 mb-4">
 <button
 onClick={() => setNewQuantity(Math.max(0, newQuantity - 1))}
 className="w-12 h-12 bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] hover:bg-[var(--surface-container-high)] text-[var(--foreground)] rounded-lg transition-colors flex items-center justify-center"
 >
 <Minus size={20} />
 </button>
 <button
 onClick={() => setShowQuantityPad(true)}
 className="flex-1 h-12 bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] hover:bg-[var(--surface-container-high)] text-[var(--foreground)] rounded-lg transition-colors text-2xl font-bold"
 >
 {newQuantity}
 </button>
 <button
 onClick={() => setNewQuantity(newQuantity + 1)}
 className="w-12 h-12 bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] hover:bg-[var(--surface-container-high)] text-[var(--foreground)] rounded-lg transition-colors flex items-center justify-center"
 >
 <Plus size={20} />
 </button>
 </div>

 <Button
 btnType="primary"
 size="lg"
 className="w-full"
 onClick={() => {
 setInventoryAction(null);
 setSelectedInventoryRecord(null);
 }}
 >
 Apply Change
 </Button>
 </div>
 ) : (
 <div>
 <div className="mb-4 p-4 bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] rounded-lg text-center">
 <p className="text-3xl font-bold text-[var(--foreground)] ">{newQuantity}</p>
 </div>

 {/* Number Pad */}
 <div className="grid grid-cols-3 gap-2 mb-4">
 {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
 <button
 key={num}
 onClick={() => setNewQuantity(parseInt(`${newQuantity}${num}`))}
 className="h-12 bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] hover:bg-[var(--surface-container-high)] text-[var(--foreground)] rounded-lg transition-colors text-lg font-medium"
 >
 {num}
 </button>
 ))}
 <button
 onClick={() => setNewQuantity(Math.floor(newQuantity / 10))}
 className="h-12 bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] hover:bg-[var(--surface-container-high)] text-[var(--foreground)] rounded-lg transition-colors text-lg font-medium"
 >
 ←
 </button>
 <button
 onClick={() => setNewQuantity(parseInt(`${newQuantity}0`))}
 className="h-12 bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] hover:bg-[var(--surface-container-high)] text-[var(--foreground)] rounded-lg transition-colors text-lg font-medium"
 >
 0
 </button>
 <button
 onClick={() => setNewQuantity(0)}
 className="h-12 bg-[var(--state-error-container)] hover:bg-[var(--state-error)] text-[var(--state-error-foreground)] rounded-lg transition-colors text-lg font-medium"
 >
 C
 </button>
 </div>

 <div className="grid grid-cols-2 gap-2">
 <button
 onClick={() => setShowQuantityPad(false)}
 className="px-4 py-3 bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] hover:bg-[var(--surface-container-high)] text-[var(--foreground)] rounded-lg transition-colors font-medium"
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
 className="px-4 py-3 bg-[var(--primary)] hover:opacity-90 text-[var(--primary-foreground)] rounded-lg transition-colors font-medium shadow-xs"
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
 <div className="bg-[var(--surface-container-lowest)] dark:bg-[var(--surface-container)] border-[var(--border)]  rounded-lg p-6">
 <div className="flex items-center justify-between mb-4">
 <div>
 <h4 className="text-lg font-semibold text-[var(--foreground)]  mb-1">Change Status</h4>
 <p className="text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">Update the availability status for this inventory</p>
 </div>
 <button
 onClick={() => setInventoryAction(null)}
 className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
 >
 <X size={20} />
 </button>
 </div>

 {/* Current Status Display */}
 <div className="mb-6 p-4 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-lg border-[var(--border)] ">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] mb-1">Current Status</p>
 <p className="text-base font-semibold text-[var(--foreground)] ">{selectedInventoryRecord.status}</p>
 <p className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] mt-2">
 Location: {selectedInventoryRecord.storageLocation}
 </p>
 </div>
 {selectedInventoryRecord.status === 'Available' ? (
 <CheckCircle2 size={32} className="text-[var(--state-success)]" />
 ) : (
 <AlertCircle size={32} className="text-[var(--state-warning)]" />
 )}
 </div>
 </div>

 {/* Status Selection */}
 <div>
 <label className="block text-sm font-medium text-[var(--foreground)] mb-3">Select New Status</label>
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
 ? 'border-[var(--border)]  bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)]/20 opacity-50 cursor-not-allowed'
 : 'border-[var(--border)]  bg-[var(--surface-container-lowest)] dark:bg-[var(--surface-container)] hover:border-[var(--state-success)] hover:bg-[var(--state-success-container)]/60'
 }`}
 >
 <div className="flex items-center gap-2 mb-1">
 <CheckCircle2 size={20} className={selectedInventoryRecord.status === 'Available' ? 'text-[var(--muted-foreground)]' : 'text-[var(--state-success)]'} />
 <h5 className="text-base font-semibold text-[var(--foreground)] ">Available</h5>
 </div>
 <p className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">Inventory is ready for use</p>
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
 ? 'border-[var(--border)]  bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)]/20 opacity-50 cursor-not-allowed'
 : 'border-[var(--border)]  bg-[var(--surface-container-lowest)] dark:bg-[var(--surface-container)] hover:border-[var(--state-warning)] hover:bg-[var(--state-warning)]/10'
 }`}
 >
 <div className="flex items-center gap-2 mb-1">
 <AlertCircle size={20} className={selectedInventoryRecord.status === 'Unavailable' ? 'text-[var(--muted-foreground)]' : 'text-[var(--state-warning)]'} />
 <h5 className="text-base font-semibold text-[var(--foreground)] ">Unavailable</h5>
 </div>
 <p className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">Inventory is not in use</p>
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
 <h4 className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-4">Top Configuration</h4>
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-lg p-4 space-y-4">
 <div>
 <label className="block text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] mb-2">
 Top Type <span className="text-[var(--state-error)]">*</span>
 </label>
 <select
 value={topType}
 onChange={(e) => setTopType(e.target.value as 'Full' | 'Tapered' | '')}
 className="w-full px-3 py-2 rounded-lg bg-[var(--surface-container-high)] text-[var(--foreground)] border-[var(--border)]  text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
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
 <label className="block text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] mb-2">
 Top Length <span className="text-[var(--state-error)]">*</span>
 </label>
 <input
 type="text"
 value={topLength}
 onChange={(e) => setTopLength(e.target.value)}
 placeholder="Enter top length"
 className="w-full px-3 py-2 rounded-lg bg-[var(--surface-container-high)] text-[var(--foreground)] border-[var(--border)]  text-[var(--foreground)] placeholder-zinc-500 focus:outline-none focus:border-[var(--primary)]"
 />
 </div>
 <div>
 <label className="block text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] mb-2">
 Top Width <span className="text-[var(--state-error)]">*</span>
 </label>
 <input
 type="text"
 value={topWidth}
 onChange={(e) => setTopWidth(e.target.value)}
 placeholder="Enter top width"
 className="w-full px-3 py-2 rounded-lg bg-[var(--surface-container-high)] text-[var(--foreground)] border-[var(--border)]  text-[var(--foreground)] placeholder-zinc-500 focus:outline-none focus:border-[var(--primary)]"
 />
 </div>
 </div>
 )}
 </div>
 </div>

 {/* Item Type Section */}
 <div>
 <h4 className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-4">Item Configuration</h4>
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-lg p-4 space-y-4">
 <div>
 <label className="block text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] mb-2">
 Item Type <span className="text-[var(--state-error)]">*</span>
 </label>
 <select
 value={itemType}
 onChange={(e) => setItemType(e.target.value as 'Shrink Wrap' | 'Box' | 'Cans in Tray' | 'Boxes in Tray' | 'Bottles in Crates' | '')}
 className="w-full px-3 py-2 rounded-lg bg-[var(--surface-container-high)] text-[var(--foreground)] border-[var(--border)]  text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
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
 <label className="block text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] mb-2">
 Tray Pattern Length Count <span className="text-[var(--state-error)]">*</span>
 </label>
 <input
 type="text"
 value={trayPatternLengthCount}
 onChange={(e) => setTrayPatternLengthCount(e.target.value)}
 placeholder="Enter count"
 className="w-full px-3 py-2 rounded-lg bg-[var(--surface-container-high)] text-[var(--foreground)] border-[var(--border)]  text-[var(--foreground)] placeholder-zinc-500 focus:outline-none focus:border-[var(--primary)]"
 />
 </div>
 <div>
 <label className="block text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] mb-2">
 Tray Pattern Width Count <span className="text-[var(--state-error)]">*</span>
 </label>
 <input
 type="text"
 value={trayPatternWidthCount}
 onChange={(e) => setTrayPatternWidthCount(e.target.value)}
 placeholder="Enter count"
 className="w-full px-3 py-2 rounded-lg bg-[var(--surface-container-high)] text-[var(--foreground)] border-[var(--border)]  text-[var(--foreground)] placeholder-zinc-500 focus:outline-none focus:border-[var(--primary)]"
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
 className="w-4 h-4 rounded border-[var(--border)] bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)] cursor-pointer"
 />
 <span className="text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">
 Tray Pattern Orientation Opposite <span className="text-[var(--state-error)]">*</span>
 </span>
 </label>
 </div>
 )}

 {/* Additional field for Bottles in Crates */}
 {itemType === 'Bottles in Crates' && (
 <div>
 <label className="block text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] mb-2">
 Shell Type <span className="text-[var(--state-error)]">*</span>
 </label>
 <select
 value={shellType}
 onChange={(e) => setShellType(e.target.value as '2L' | '200oz' | '500ml' | '')}
 className="w-full px-3 py-2 rounded-lg bg-[var(--surface-container-high)] text-[var(--foreground)] border-[var(--border)]  text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
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
 className="px-6 py-2 bg-[var(--primary)] hover:opacity-90 text-[var(--primary-foreground)] rounded-lg transition-colors flex items-center gap-2 font-medium"
 >
 <CheckCircle2 size={18} />
 Save Attributes
 </button>
 </div>
 </div>
 )}
 </DetailSidePanel>
 )}

 {/* Inventory Report Modal */}
 {showInventoryReport && (
 <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
 <div className="bg-[var(--surface-container-high)] text-[var(--foreground)] rounded-lg border-[var(--border)]  w-full max-w-7xl max-h-[90vh] flex flex-col">
 {/* Modal Header */}
 <div className="p-6 border-b border-[var(--border)] ">
 <div className="flex items-center justify-between mb-4">
 <div>
 <h2 className="text-2xl font-bold text-[var(--foreground)]  mb-1">Inventory Report</h2>
 <p className="text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">
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
 className="px-4 py-2 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] text-[var(--foreground)] rounded-lg transition-colors flex items-center gap-2"
 >
 <Download size={18} />
 Export
 </button>
 <button
 onClick={() => window.print()}
 className="px-4 py-2 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] text-[var(--foreground)] rounded-lg transition-colors flex items-center gap-2"
 >
 <Printer size={18} />
 Print
 </button>
 <button
 onClick={() => setShowInventoryReport(false)}
 className="p-2 rounded-lg hover:bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] transition-colors"
 >
 <X className="w-5 h-5 text-[var(--muted-foreground)]" />
 </button>
 </div>
 </div>

 {/* Filters */}
 <div className="grid grid-cols-4 gap-4">
 <div>
 <label className="block text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] mb-2">Status</label>
 <input
 type="text"
 placeholder="Filter by status..."
 value={reportStatusFilter}
 onChange={(e) => setReportStatusFilter(e.target.value)}
 className="w-full px-3 py-2 rounded-lg bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  text-[var(--foreground)] text-sm placeholder-zinc-500 focus:outline-none focus:border-[var(--primary)]"
 />
 </div>
 <div>
 <label className="block text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] mb-2">Storage Location</label>
 <input
 type="text"
 placeholder="Filter by location..."
 value={reportLocationFilter}
 onChange={(e) => setReportLocationFilter(e.target.value)}
 className="w-full px-3 py-2 rounded-lg bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  text-[var(--foreground)] text-sm placeholder-zinc-500 focus:outline-none focus:border-[var(--primary)]"
 />
 </div>
 <div>
 <label className="block text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] mb-2">Parent Storage</label>
 <input
 type="text"
 placeholder="Filter by parent..."
 value={reportParentFilter}
 onChange={(e) => setReportParentFilter(e.target.value)}
 className="w-full px-3 py-2 rounded-lg bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  text-[var(--foreground)] text-sm placeholder-zinc-500 focus:outline-none focus:border-[var(--primary)]"
 />
 </div>
 <div>
 <label className="block text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] mb-2">Quantity</label>
 <div className="flex gap-2">
 <select
 value={reportQuantityOperator}
 onChange={(e) => setReportQuantityOperator(e.target.value as '<=' | '>=' | '=')}
 className="px-2 py-2 rounded-lg bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  text-[var(--foreground)] text-sm focus:outline-none focus:border-[var(--primary)]"
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
 className="flex-1 px-3 py-2 rounded-lg bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  text-[var(--foreground)] text-sm placeholder-zinc-500 focus:outline-none focus:border-[var(--primary)]"
 />
 </div>
 </div>
 </div>
 </div>

 {/* Modal Content */}
 <div className="flex-1 overflow-auto p-6">
 <MasterTableContainer type="overlay">
          <MasterTable type="overlay">
            <MasterTableHead type="overlay">
              <tr>
                <MasterTableTh type="overlay" density="compact">
                  Item Number
                </MasterTableTh>
                {allInventoryColumns
                  .filter(col => !inventoryHiddenColumns.includes(col))
                  .map(col => (
                    <MasterTableTh key={col} type="overlay" density="compact">
                      {formatColumnHeader(col)}
                    </MasterTableTh>
                  ))}
              </tr>
            </MasterTableHead>
            <MasterTableBody type="overlay">
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
                  <MasterTableRow key={idx} type="overlay" clickable={false}>
                    <MasterTableCell type="overlay" density="compact" className="font-mono font-medium">
                      {inv.item}
                    </MasterTableCell>
                    {allInventoryColumns
                      .filter(col => !inventoryHiddenColumns.includes(col))
                      .map(col => (
                        <MasterTableCell key={col} type="overlay" density="compact">
                          {col === 'status' ? (
                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                              inv.status === 'Available'
                                ? 'bg-[var(--state-success-container)] text-[var(--state-success)]'
                                : inv.status === 'Reserved'
                                ? 'bg-[var(--state-warning)]/20 text-[var(--state-warning)]'
                                : 'bg-[var(--state-debug)]/20 text-[var(--muted-foreground)]'
                            }`}>
                              {inv.status}
                            </span>
                          ) : (
                            formatCellValue(inv[col], col)
                          )}
                        </MasterTableCell>
                      ))}
                  </MasterTableRow>
                ))}
            </MasterTableBody>
          </MasterTable>
        </MasterTableContainer>
        </div>
      </div>
    </div>
  )}
</div>
);
}