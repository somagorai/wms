import { useState, useEffect, Fragment } from "react";
import { useVersionTheme } from "../contexts/VersionThemeContext";
import { Link, useNavigate } from "react-router-dom";
import { useLayout } from "../contexts/LayoutContext";
import { mockStorageLocations, type StorageLocation } from "../data/mockStorageLocations";
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
import { DetailSidePanel, PanelSection, PanelRow } from "../components/panels/DetailSidePanel";

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
 ArrowRightLeft,
} from "lucide-react";
import {
 getInventoryForLocation,
 getCurrentAllocationsForLocation,
 getAllocationHistoryForLocation,
 getParentChangeEventsForContainer,
 type ParentChangeEvent
} from "../data/mockStorageLocationData";

type SortField = keyof StorageLocation;

// Containers component with comprehensive filtering and grouping
export function Containers() {
  const { version } = useVersionTheme();
  const isV6 = version === "Master Blue V6";
 const navigate = useNavigate();
 const { setShowAI, storageLocationsHiddenColumns, storageLocationsPinnedColumns } = useLayout();
 const [searchTerm, setSearchTerm] = useState("");
 const [sortField, setSortField] = useState<SortField>("name");
 const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
 const [showFilterPanel, setShowFilterPanel] = useState(false);
 const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());
 const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(new Set());
 const [selectedParentStorage, setSelectedParentStorage] = useState<Set<string>>(new Set());
 const [selectedMoveable, setSelectedMoveable] = useState<Set<string>>(new Set());
 const [selectedDeletable, setSelectedDeletable] = useState<Set<string>>(new Set());
 const [selectedOccupancy, setSelectedOccupancy] = useState<Set<string>>(new Set());
 const [selectedItemTypes, setSelectedItemTypes] = useState<Set<string>>(new Set());
 const [selectedFillStatuses, setSelectedFillStatuses] = useState<Set<string>>(new Set());
 const [activeFilter, setActiveFilter] = useState<string | null>(null);
 const [groupByParent, setGroupByParent] = useState(false);
 const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
 const [typeSearch, setTypeSearch] = useState("");
 const [statusSearch, setStatusSearch] = useState("");
 const [parentStorageSearch, setParentStorageSearch] = useState("");
 const [occupancySearch, setOccupancySearch] = useState("");
 const [itemTypeSearch, setItemTypeSearch] = useState("");
 const [fillStatusSearch, setFillStatusSearch] = useState("");
 const [activeDropdown, setActiveDropdown] = useState<'type' | 'status' | 'parentStorage' | 'occupancy' | 'itemType' | 'fillStatus' | null>(null);
 const [selectedLocation, setSelectedLocation] = useState<StorageLocation | null>(null);
 const [activeTab, setActiveTab] = useState<'details' | 'inventory' | 'events' | 'actions'>('details');
 const [locationInventory, setLocationInventory] = useState<any[]>([]);
 const [locationCurrentAllocations, setLocationCurrentAllocations] = useState<any[]>([]);
 const [locationAllocationHistory, setLocationAllocationHistory] = useState<any[]>([]);
 const [parentChangeEvents, setParentChangeEvents] = useState<ParentChangeEvent[]>([]);
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
 const [bulkMoveMode, setBulkMoveMode] = useState(false);
 const [selectedLocationIds, setSelectedLocationIds] = useState<Set<string>>(new Set());
 const [showBulkDeleteConfirmation, setShowBulkDeleteConfirmation] = useState(false);
 const [moveToLocation, setMoveToLocation] = useState<string>('');
 const [showMoveConfirmation, setShowMoveConfirmation] = useState(false);
 const [showBulkMoveDialog, setShowBulkMoveDialog] = useState(false);
 const [bulkMoveDestination, setBulkMoveDestination] = useState<string>('');
 const [locationSearchTerm, setLocationSearchTerm] = useState<string>('');
 const [activeAction, setActiveAction] = useState<'status' | 'move' | 'report' | 'delete' | null>(null);

 // Update location data when selected location changes
 useEffect(() => {
 if (selectedLocation) {
 setLocationInventory(getInventoryForLocation(selectedLocation.name, selectedLocation.status));
 setLocationCurrentAllocations(getCurrentAllocationsForLocation(selectedLocation.name, selectedLocation.status));
 setLocationAllocationHistory(getAllocationHistoryForLocation(selectedLocation.name, selectedLocation.status));
 setParentChangeEvents(getParentChangeEventsForContainer(selectedLocation.name, selectedLocation.type));
 }
 }, [selectedLocation]);

 // Get visible columns based on context
 const allColumns: (keyof StorageLocation)[] = [
 "name",
 "parentStorage",
 "status",
 "type",
 "fillStatus",
 "itemType",
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
 <div className="text-[var(--foreground)]">Loading containers...</div>
 </div>
 );
 }

 // Calculate statistics (all container types)
 const containerTypes = ["Bin", "Pallet", "Tray", "Gaylord", "Conventional"];
 const containersOnly = mockStorageLocations.filter(l => containerTypes.includes(l.type));
 const totalLocations = containersOnly.length;
 const availableLocations = containersOnly.filter(l => l.status === "Available").length;
 const occupiedLocations = containersOnly.filter(l => l.status === "Occupied").length;
 const reservedLocations = containersOnly.filter(l => l.status === "Reserved").length;
 const lockedLocations = containersOnly.filter(l => l.status === "Locked").length;

 // Calculate statistics by type
 const binCount = containersOnly.filter(l => l.type === "Bin").length;
 const palletCount = containersOnly.filter(l => l.type === "Pallet").length;
 const trayCount = containersOnly.filter(l => l.type === "Tray").length;
 const gaylordCount = containersOnly.filter(l => l.type === "Gaylord").length;
 const conventionalCount = containersOnly.filter(l => l.type === "Conventional").length;

 // Calculate statistics by fill status
 const emptyCount = containersOnly.filter(l => l.fillStatus === "Empty").length;
 const partialCount = containersOnly.filter(l => l.fillStatus === "Partial").length;
 const fullCount = containersOnly.filter(l => l.fillStatus === "Full").length;

 const utilizationRate = totalLocations > 0 ? ((occupiedLocations / totalLocations) * 100).toFixed(1) : "0.0";

 // Get unique values for filters (all container types)
 const uniqueTypes = Array.from(new Set(containersOnly.map(l => l.type))).sort();
 const uniqueStatuses = Array.from(new Set(containersOnly.map(l => l.status))).sort();
 const uniqueParentStorage = Array.from(new Set(containersOnly.map(l => l.parentStorage).filter(p => p && p !== '-'))).sort();
 const uniqueOccupancy = Array.from(new Set(containersOnly.map(l => l.attribute4).filter(o => o))).sort();
 const uniqueItemTypes = Array.from(new Set(containersOnly.map(l => l.itemType).filter(i => i))).sort();
 const uniqueFillStatuses = Array.from(new Set(containersOnly.map(l => l.fillStatus).filter(f => f))).sort();

 // Count active filters
 const hasActiveFilters = selectedTypes.size > 0 || selectedStatuses.size > 0 ||
 selectedParentStorage.size > 0 || selectedMoveable.size > 0 || selectedDeletable.size > 0 ||
 selectedOccupancy.size > 0 || selectedItemTypes.size > 0 || selectedFillStatuses.size > 0;
 const totalFilterCount = selectedTypes.size + selectedStatuses.size + selectedParentStorage.size +
 selectedMoveable.size + selectedDeletable.size + selectedOccupancy.size +
 selectedItemTypes.size + selectedFillStatuses.size;

 const clearAllFilters = () => {
 setSelectedTypes(new Set());
 setSelectedStatuses(new Set());
 setSelectedParentStorage(new Set());
 setSelectedMoveable(new Set());
 setSelectedDeletable(new Set());
 setSelectedOccupancy(new Set());
 setSelectedItemTypes(new Set());
 setSelectedFillStatuses(new Set());
 setActiveFilter(null);
 };

 const clearAdvancedFilters = () => {
 setSelectedTypes(new Set());
 setSelectedStatuses(new Set());
 setSelectedParentStorage(new Set());
 setSelectedMoveable(new Set());
 setSelectedDeletable(new Set());
 setSelectedOccupancy(new Set());
 setSelectedItemTypes(new Set());
 setSelectedFillStatuses(new Set());
 };

 const handleTileClick = (filterKey: string) => {
 // Toggle filter: if clicking the same tile, clear the filter
 setActiveFilter(activeFilter === filterKey ? null : filterKey);
 };

 const toggleFilterOption = (category: 'type' | 'status' | 'parentStorage' | 'moveable' | 'deletable' | 'occupancy' | 'itemType' | 'fillStatus', value: string) => {
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
 } else if (category === 'parentStorage') {
 const newSet = new Set(selectedParentStorage);
 if (newSet.has(value)) {
 newSet.delete(value);
 } else {
 newSet.add(value);
 }
 setSelectedParentStorage(newSet);
 } else if (category === 'moveable') {
 const newSet = new Set(selectedMoveable);
 if (newSet.has(value)) {
 newSet.delete(value);
 } else {
 newSet.add(value);
 }
 setSelectedMoveable(newSet);
 } else if (category === 'deletable') {
 const newSet = new Set(selectedDeletable);
 if (newSet.has(value)) {
 newSet.delete(value);
 } else {
 newSet.add(value);
 }
 setSelectedDeletable(newSet);
 } else if (category === 'occupancy') {
 const newSet = new Set(selectedOccupancy);
 if (newSet.has(value)) {
 newSet.delete(value);
 } else {
 newSet.add(value);
 }
 setSelectedOccupancy(newSet);
 } else if (category === 'itemType') {
 const newSet = new Set(selectedItemTypes);
 if (newSet.has(value)) {
 newSet.delete(value);
 } else {
 newSet.add(value);
 }
 setSelectedItemTypes(newSet);
 } else if (category === 'fillStatus') {
 const newSet = new Set(selectedFillStatuses);
 if (newSet.has(value)) {
 newSet.delete(value);
 } else {
 newSet.add(value);
 }
 setSelectedFillStatuses(newSet);
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
 toast.className = 'fixed bottom-4 right-4 bg-[var(--state-success-container)] text-[var(--state-on-success-container)] px-6 py-3 rounded-lg z-50';
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
 toast.className = 'fixed bottom-4 right-4 bg-[var(--state-success-container)] text-[var(--state-on-success-container)] px-6 py-3 rounded-lg z-50';
 toast.textContent = `Container ${newLocation.name} created successfully`;
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
 toast.className = 'fixed bottom-4 right-4 bg-[var(--state-success-container)] text-[var(--state-on-success-container)] px-6 py-3 rounded-lg z-50';
 toast.textContent = `Container deleted successfully`;
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

 // Handle bulk move mode
 const handleBulkMoveMode = () => {
 if (bulkMoveMode) {
 // Cancel bulk move mode
 setBulkMoveMode(false);
 setSelectedLocationIds(new Set());
 } else {
 // Enter bulk move mode
 setBulkMoveMode(true);
 setSelectedLocationIds(new Set());
 }
 };

 const handleConfirmBulkMove = () => {
 if (selectedLocationIds.size === 0) return;
 setBulkMoveDestination('');
 setLocationSearchTerm('');
 setShowBulkMoveDialog(true);
 };

 const confirmBulkMove = () => {
 if (!bulkMoveDestination || selectedLocationIds.size === 0) return;

 // Find the destination location
 const destinationLocation = mockStorageLocations.find(loc => loc.id === bulkMoveDestination);
 if (!destinationLocation) return;

 // Update all selected containers' parent storage
 selectedLocationIds.forEach(id => {
 const locationIndex = mockStorageLocations.findIndex(loc => loc.id === id);
 if (locationIndex !== -1) {
 mockStorageLocations[locationIndex].parentStorage = destinationLocation.name;
 }
 });

 // Close dialog and exit move mode
 setShowBulkMoveDialog(false);
 setBulkMoveMode(false);
 setSelectedLocationIds(new Set());
 setBulkMoveDestination('');
 setLocationSearchTerm('');

 // Show success toast
 const toast = document.createElement('div');
 toast.className = 'fixed bottom-4 right-4 bg-[var(--state-success-container)] text-[var(--state-on-success-container)] px-6 py-3 rounded-lg z-50';
 toast.textContent = `${selectedLocationIds.size} container(s) moved successfully to ${destinationLocation.name}`;
 document.body.appendChild(toast);
 setTimeout(() => toast.remove(), 3000);
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
 toast.className = 'fixed bottom-4 right-4 bg-[var(--state-success-container)] text-[var(--state-on-success-container)] px-6 py-3 rounded-lg z-50';
 toast.textContent = `${locationsToDelete.length} container(s) deleted successfully`;
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
 toast.className = 'fixed bottom-4 right-4 bg-[var(--state-success-container)] text-[var(--state-on-success-container)] px-6 py-3 rounded-lg z-50';
 toast.textContent = `Container moved successfully to ${destinationLocation.name}`;
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
 return <CheckCircle2 size={16} className="text-[var(--state-success)]" />;
 case "Occupied":
 return <Archive size={16} className="text-[var(--state-info)]" />;
 case "Reserved":
 return <Clock size={16} className="text-[var(--state-warning)]" />;
 case "Locked":
 return <Lock size={16} className="text-[var(--state-error)]" />;
 default:
 return null;
 }
 };

 const getStatusColor = (status: string) => {
 switch (status) {
 case "Available":
 return "text-[var(--state-success)]";
 case "Occupied":
 return "text-[var(--state-info)]";
 case "Reserved":
 return "text-[var(--state-warning)]";
 case "Locked":
 return "text-[var(--state-error)]";
 default:
 return "text-[var(--muted-foreground)]";
 }
 };

 const renderCellValue = (field: string, value: any, item: StorageLocation) => {
 switch (field) {
 case "name":
 return (
 <div className="flex items-center gap-2">
 <MapPin size={14} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 <span className="font-mono font-medium text-[var(--foreground)] ">{value}</span>
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
 return <span className="text-[var(--muted-foreground)] text-sm">{formatDate(value)}</span>;
 case "isMoveable":
 return (
 <div className="flex items-center gap-2">
 {value ? (
 <>
 <CheckCircle2 size={14} className="text-[var(--state-success)]" />
 <span className="text-[var(--state-success)] font-medium">Yes</span>
 </>
 ) : (
 <>
 <X size={14} className="text-[var(--state-error)]" />
 <span className="text-[var(--state-error)] font-medium">No</span>
 </>
 )}
 </div>
 );
 case "fillStatus":
 if (!value) return <span className="text-[var(--muted-foreground)] text-sm">-</span>;
 return (
 <div className="flex items-center gap-2">
 <span className={`px-2 py-1 rounded text-xs font-medium ${
 value === "Empty" ? "bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] text-[var(--foreground)]" :
 value === "Partial" ? "bg-[var(--state-warning)]/20 text-[var(--state-warning)]" :
 value === "Full" ? "bg-[var(--state-success-container)] text-[var(--state-success)]" :
 "bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] text-[var(--muted-foreground)]"
 }`}>
 {value}
 </span>
 </div>
 );
 case "itemType":
 if (!value) return <span className="text-[var(--muted-foreground)] text-sm">-</span>;
 return (
 <div className="flex items-center gap-2">
 <span className="px-2 py-1 rounded text-xs font-medium bg-[var(--state-info)]/20 text-[var(--state-info)]">
 {value}
 </span>
 </div>
 );
 case "parentStorage":
 case "type":
 case "createdBy":
 return <span className="text-[var(--foreground)]">{value}</span>;
 case "attribute1":
 case "attribute2":
 case "attribute3":
 case "attribute4":
 case "attribute5":
 return <span className="text-[var(--muted-foreground)] text-sm">{value}</span>;
 default:
 return <span className="text-[var(--muted-foreground)]">{value}</span>;
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
 // Filter to only container types for Containers screen
 if (!containerTypes.includes(item.type)) {
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
 } else if (activeFilter === "locked") {
 matchesTileFilter = item.status === "Locked";
 } else if (activeFilter === "bin") {
 matchesTileFilter = item.type === "Bin";
 } else if (activeFilter === "pallet") {
 matchesTileFilter = item.type === "Pallet";
 } else if (activeFilter === "tray") {
 matchesTileFilter = item.type === "Tray";
 } else if (activeFilter === "gaylord") {
 matchesTileFilter = item.type === "Gaylord";
 } else if (activeFilter === "conventional") {
 matchesTileFilter = item.type === "Conventional";
 } else if (activeFilter === "empty") {
 matchesTileFilter = item.fillStatus === "Empty";
 } else if (activeFilter === "partial") {
 matchesTileFilter = item.fillStatus === "Partial";
 } else if (activeFilter === "full") {
 matchesTileFilter = item.fillStatus === "Full";
 }

 // Apply advanced filters
 const matchesType = selectedTypes.size === 0 || selectedTypes.has(item.type);
 const matchesStatus = selectedStatuses.size === 0 || selectedStatuses.has(item.status);
 const matchesParentStorage = selectedParentStorage.size === 0 || selectedParentStorage.has(item.parentStorage);
 const matchesMoveable = selectedMoveable.size === 0 ||
 (selectedMoveable.has("true") && item.isMoveable) ||
 (selectedMoveable.has("false") && !item.isMoveable);
 const matchesDeletable = selectedDeletable.size === 0 ||
 (selectedDeletable.has("true") && !locationCurrentAllocations.length) ||
 (selectedDeletable.has("false") && locationCurrentAllocations.length > 0);
 const matchesOccupancy = selectedOccupancy.size === 0 || selectedOccupancy.has(item.attribute4 || '');
 const matchesItemType = selectedItemTypes.size === 0 || (item.itemType && selectedItemTypes.has(item.itemType));
 const matchesFillStatus = selectedFillStatuses.size === 0 || (item.fillStatus && selectedFillStatuses.has(item.fillStatus));

 return matchesSearch && matchesTileFilter && matchesType && matchesStatus &&
 matchesParentStorage && matchesMoveable && matchesDeletable && matchesOccupancy &&
 matchesItemType && matchesFillStatus;
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
 fillStatus: "Fill Status",
 itemType: "Item Type",
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
 <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${selectedLocation ? 'mr-[600px]' : ''}`}>
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
 <Box size={20} className="text-[var(--primary)] dark:text-[var(--primary)]" />Containers
 </span>
 </nav>
 <div className="flex items-center gap-2">
 <button onClick={() => {}} className="p-2 rounded-lg border-[var(--border)]  bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--surface-container-low)] dark:hover:bg-[var(--surface-container-high)] text-[var(--muted-foreground)] transition-colors" title="Refresh"><RefreshCw size={16} /></button>
 <button className="p-2 rounded-lg border-[var(--border)]  bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--surface-container-low)] dark:hover:bg-[var(--surface-container-high)] text-[var(--muted-foreground)] transition-colors" title="Export"><Download size={16} /></button>
 <button
 onClick={() => setShowFilterPanel(!showFilterPanel)}
 className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 border ${showFilterPanel || hasActiveFilters ? "bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90" : "bg-[var(--surface-container-high)] text-[var(--foreground)] hover:bg-[var(--surface-container-highest)] border border-transparent"}`}
 >
 <Filter size={16} />Filter{hasActiveFilters && <span className="px-1.5 py-0.5 bg-white/25 rounded text-xs">{totalFilterCount}</span>}
 </button>
 </div>
 </div>
 </div>

 <div className="flex-1 overflow-y-auto px-8 pt-4 pb-8">
 {/* Stats Section */}
 <div className="mb-8">

 {/* Stats Tiles */}
          {/* Fill Status Tiles */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
            <TopCard
              type="clickable"
              status="neutral"
              label="Total Containers"
              value={totalLocations}
              icon={<Warehouse size={18} />}
              isSelected={activeFilter === "total"}
              isDimmed={activeFilter !== null && activeFilter !== "total"}
              onClick={() => {
                setActiveFilter(activeFilter === "total" ? null : "total");
                setSelectedTypes(new Set());
                setSelectedStatuses(new Set());
              }}
            />
            <TopCard
              type="clickable"
              status="neutral"
              label="Empty"
              value={emptyCount}
              icon={<Box size={18} />}
              isSelected={activeFilter === "empty"}
              isDimmed={activeFilter !== null && activeFilter !== "empty"}
              onClick={() => handleTileClick("empty")}
            />
            <TopCard
              type="clickable"
              status="warning"
              label="Partial"
              value={partialCount}
              icon={<Box size={18} />}
              isSelected={activeFilter === "partial"}
              isDimmed={activeFilter !== null && activeFilter !== "partial"}
              onClick={() => handleTileClick("partial")}
            />
            <TopCard
              type="clickable"
              status="success"
              label="Full"
              value={fullCount}
              icon={<Box size={18} />}
              isSelected={activeFilter === "full"}
              isDimmed={activeFilter !== null && activeFilter !== "full"}
              onClick={() => handleTileClick("full")}
            />
            <TopCard
              type="clickable"
              status="error"
              label="Locked"
              value={lockedLocations}
              icon={<Lock size={18} />}
              isSelected={activeFilter === "locked"}
              isDimmed={activeFilter !== null && activeFilter !== "locked"}
              onClick={() => handleTileClick("locked")}
            />
            <TopCard
              type="info"
              status="primary"
              label="Utilization"
              value={`${utilizationRate}%`}
              icon={<TrendingUp size={18} />}
            />
          </div>

 {/* Type Tiles */}
 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
 {/* Bins */}
 <button
 onClick={() => handleTileClick("bin")}
 className={`bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--surface-container-lowest)] dark:hover:bg-[var(--surface-container-high)]/80 border-[var(--border)]  rounded-lg p-4 transition-all ${
 activeFilter === "bin" ? " )]" : ""
 }`}
 >
 <div className="flex items-center gap-3 mb-2">
 <div className="w-10 h-10 bg-[var(--tertiary)]/20 rounded-lg flex items-center justify-center">
 <Box size={20} className="text-[var(--state-fatal)]" />
 </div>
 <div className="flex-1 text-left">
 <p className="text-2xl font-bold text-[var(--foreground)] ">{binCount}</p>
 <p className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">Bins</p>
 </div>
 </div>
 </button>

 {/* Pallets */}
 <button
 onClick={() => handleTileClick("pallet")}
 className={`bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--surface-container-lowest)] dark:hover:bg-[var(--surface-container-high)]/80 border-[var(--border)]  rounded-lg p-4 transition-all ${
 activeFilter === "pallet" ? " )]" : ""
 }`}
 >
 <div className="flex items-center gap-3 mb-2">
 <div className="w-10 h-10 bg-[var(--state-warning)]/20 rounded-lg flex items-center justify-center">
 <Package size={20} className="text-[var(--state-warning)]" />
 </div>
 <div className="flex-1 text-left">
 <p className="text-2xl font-bold text-[var(--foreground)] ">{palletCount}</p>
 <p className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">Pallets</p>
 </div>
 </div>
 </button>

 {/* Trays */}
 <button
 onClick={() => handleTileClick("tray")}
 className={`bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--surface-container-lowest)] dark:hover:bg-[var(--surface-container-high)]/80 border-[var(--border)]  rounded-lg p-4 transition-all ${
 activeFilter === "tray" ? " )]" : ""
 }`}
 >
 <div className="flex items-center gap-3 mb-2">
 <div className="w-10 h-10 bg-[var(--state-info)]/20 rounded-lg flex items-center justify-center">
 <Layers size={20} className="text-[var(--state-info)]" />
 </div>
 <div className="flex-1 text-left">
 <p className="text-2xl font-bold text-[var(--foreground)] ">{trayCount}</p>
 <p className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">Trays</p>
 </div>
 </div>
 </button>

 {/* Gaylords */}
 <button
 onClick={() => handleTileClick("gaylord")}
 className={`bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--surface-container-lowest)] dark:hover:bg-[var(--surface-container-high)]/80 border-[var(--border)]  rounded-lg p-4 transition-all ${
 activeFilter === "gaylord" ? " )]" : ""
 }`}
 >
 <div className="flex items-center gap-3 mb-2">
 <div className="w-10 h-10 bg-[var(--tertiary)]/20 rounded-lg flex items-center justify-center">
 <Archive size={20} className="text-[var(--tertiary)]" />
 </div>
 <div className="flex-1 text-left">
 <p className="text-2xl font-bold text-[var(--foreground)] ">{gaylordCount}</p>
 <p className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">Gaylords</p>
 </div>
 </div>
 </button>

 {/* Conventional */}
 <button
 onClick={() => handleTileClick("conventional")}
 className={`bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--surface-container-lowest)] dark:hover:bg-[var(--surface-container-high)]/80 border-[var(--border)]  rounded-lg p-4 transition-all ${
 activeFilter === "conventional" ? " )]" : ""
 }`}
 >
 <div className="flex items-center gap-3 mb-2">
 <div className="w-10 h-10 bg-[var(--secondary)]/20 rounded-lg flex items-center justify-center">
 <Warehouse size={20} className="text-[var(--secondary)]" />
 </div>
 <div className="flex-1 text-left">
 <p className="text-2xl font-bold text-[var(--foreground)] ">{conventionalCount}</p>
 <p className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">Conventional</p>
 </div>
 </div>
 </button>
 </div>
 </div>

 {/* Filter Panel */}
 {showFilterPanel && (
 <div className="mb-6 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-xl p-6 animate-in slide-in- duration-200">
 <div className="flex items-center justify-between mb-4">
 <h3 className="text-[var(--foreground)]  font-semibold">Filters</h3>
 <div className="flex items-center gap-2">
 {hasActiveFilters && (
 <button
 onClick={clearAllFilters}
 className="text-sm text-[var(--primary)] dark:text-[var(--primary)] hover:underline transition-colors"
 >
 Clear All
 </button>
 )}
 <button
 onClick={() => setShowFilterPanel(false)}
 className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] dark:hover:text-[var(--foreground)] transition-colors"
 >
 <X size={20} />
 </button>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 filter-dropdown">
 {/* Type Filter - Compact Multi-Select */}
 <div className="relative">
 <label className="text-sm font-medium text-[var(--muted-foreground)]  mb-2 block">Type</label>
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg p-2 min-h-[42px]">
 {/* Selected Items as Chips */}
 <div className="flex flex-wrap gap-1.5 mb-2">
 {Array.from(selectedTypes).map((type) => (
 <span
 key={type}
 className="inline-flex items-center gap-1.5 px-2 py-1 bg-[var(--primary)]  text-[var(--primary-foreground)] rounded text-xs font-medium"
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
 className="w-full bg-transparent text-[var(--foreground)]  text-sm placeholder-zinc-500 outline-none"
 />
 {/* Dropdown Options */}
 {activeDropdown === 'type' && (
 <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg max-h-48 overflow-y-auto z-10 filter-dropdown">
 {uniqueTypes.filter(type => type.toLowerCase().includes(typeSearch.toLowerCase())).map((type) => (
 <button
 key={type}
 onClick={() => {
 toggleFilterOption('type', type);
 setTypeSearch('');
 }}
 className={`w-full px-3 py-2 text-left text-sm transition-colors flex items-center gap-2 ${
 selectedTypes.has(type)
 ? 'bg-[var(--primary)]/10 /10 text-[var(--primary)] dark:text-[var(--primary)]'
 : 'text-[var(--foreground)]  hover:bg-[var(--surface-container-low)] dark:hover:bg-[var(--surface-container-high)]'
 }`}
 >
 <div className={`w-4 h-4 rounded border flex items-center justify-center ${
 selectedTypes.has(type)
 ? 'bg-[var(--primary)]  border-[var(--primary)] dark:border-[var(--primary)]'
 : 'border-[var(--border)] dark:border-[var(--border)]'
 }`}>
 {selectedTypes.has(type) && <CheckCircle2 size={12} className="text-[var(--foreground)]" />}
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
 <label className="text-sm font-medium text-[var(--muted-foreground)]  mb-2 block">Status</label>
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg p-2 min-h-[42px]">
 {/* Selected Items as Chips */}
 <div className="flex flex-wrap gap-1.5 mb-2">
 {Array.from(selectedStatuses).map((status) => (
 <span
 key={status}
 className="inline-flex items-center gap-1.5 px-2 py-1 bg-[var(--primary)]  text-[var(--primary-foreground)] rounded text-xs font-medium"
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
 className="w-full bg-transparent text-[var(--foreground)]  text-sm placeholder-zinc-500 outline-none"
 />
 {/* Dropdown Options */}
 {activeDropdown === 'status' && (
 <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg max-h-48 overflow-y-auto z-10 filter-dropdown">
 {uniqueStatuses.filter(status => status.toLowerCase().includes(statusSearch.toLowerCase())).map((status) => (
 <button
 key={status}
 onClick={() => {
 toggleFilterOption('status', status);
 setStatusSearch('');
 }}
 className={`w-full px-3 py-2 text-left text-sm transition-colors flex items-center gap-2 ${
 selectedStatuses.has(status)
 ? 'bg-[var(--primary)]/10 /10 text-[var(--primary)] dark:text-[var(--primary)]'
 : 'text-[var(--foreground)]  hover:bg-[var(--surface-container-low)] dark:hover:bg-[var(--surface-container-high)]'
 }`}
 >
 <div className={`w-4 h-4 rounded border flex items-center justify-center ${
 selectedStatuses.has(status)
 ? 'bg-[var(--primary)]  border-[var(--primary)] dark:border-[var(--primary)]'
 : 'border-[var(--border)] dark:border-[var(--border)]'
 }`}>
 {selectedStatuses.has(status) && <CheckCircle2 size={12} className="text-[var(--foreground)]" />}
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

 {/* Parent Storage Filter - Compact Multi-Select */}
 <div className="relative">
 <label className="text-sm font-medium text-[var(--muted-foreground)]  mb-2 block">Parent Storage</label>
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg p-2 min-h-[42px]">
 <div className="flex flex-wrap gap-1.5 mb-2">
 {Array.from(selectedParentStorage).map((parent) => (
 <span
 key={parent}
 className="inline-flex items-center gap-1.5 px-2 py-1 bg-[var(--primary)]  text-[var(--primary-foreground)] rounded text-xs font-medium"
 >
 {parent}
 <button
 onClick={() => toggleFilterOption('parentStorage', parent)}
 className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
 >
 <X size={12} />
 </button>
 </span>
 ))}
 </div>
 <div className="relative">
 <input
 type="text"
 placeholder="Search or select..."
 value={parentStorageSearch}
 onChange={(e) => setParentStorageSearch(e.target.value)}
 onFocus={() => setActiveDropdown('parentStorage')}
 className="w-full bg-transparent text-[var(--foreground)]  text-sm placeholder-zinc-500 outline-none"
 />
 {activeDropdown === 'parentStorage' && (
 <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg max-h-48 overflow-y-auto z-10 filter-dropdown">
 {uniqueParentStorage.filter(parent => parent.toLowerCase().includes(parentStorageSearch.toLowerCase())).map((parent) => (
 <button
 key={parent}
 onClick={() => {
 toggleFilterOption('parentStorage', parent);
 setParentStorageSearch('');
 }}
 className={`w-full px-3 py-2 text-left text-sm transition-colors flex items-center gap-2 ${
 selectedParentStorage.has(parent)
 ? 'bg-[var(--primary)]/10 /10 text-[var(--primary)] dark:text-[var(--primary)]'
 : 'text-[var(--foreground)]  hover:bg-[var(--surface-container-low)] dark:hover:bg-[var(--surface-container-high)]'
 }`}
 >
 <div className={`w-4 h-4 rounded border flex items-center justify-center ${
 selectedParentStorage.has(parent)
 ? 'bg-[var(--primary)]  border-[var(--primary)] dark:border-[var(--primary)]'
 : 'border-[var(--border)] dark:border-[var(--border)]'
 }`}>
 {selectedParentStorage.has(parent) && <CheckCircle2 size={12} className="text-[var(--foreground)]" />}
 </div>
 {parent}
 </button>
 ))}
 </div>
 )}
 </div>
 </div>
 </div>

 {/* Moveable Filter */}
 <div className="relative">
 <label className="text-sm font-medium text-[var(--muted-foreground)]  mb-2 block">Moveable</label>
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg p-2">
 <div className="flex gap-2">
 <button
 onClick={() => toggleFilterOption('moveable', 'true')}
 className={`flex-1 px-3 py-2 text-sm rounded transition-colors ${
 selectedMoveable.has('true')
 ? 'bg-[var(--primary)]  text-[var(--primary-foreground)]'
 : 'bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] text-[var(--foreground)]  hover:bg-[var(--surface-container-high)]'
 }`}
 >
 Yes
 </button>
 <button
 onClick={() => toggleFilterOption('moveable', 'false')}
 className={`flex-1 px-3 py-2 text-sm rounded transition-colors ${
 selectedMoveable.has('false')
 ? 'bg-[var(--primary)]  text-[var(--primary-foreground)]'
 : 'bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] text-[var(--foreground)]  hover:bg-[var(--surface-container-high)]'
 }`}
 >
 No
 </button>
 </div>
 </div>
 </div>

 {/* Deletable Filter */}
 <div className="relative">
 <label className="text-sm font-medium text-[var(--muted-foreground)]  mb-2 block">Deletable</label>
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg p-2">
 <div className="flex gap-2">
 <button
 onClick={() => toggleFilterOption('deletable', 'true')}
 className={`flex-1 px-3 py-2 text-sm rounded transition-colors ${
 selectedDeletable.has('true')
 ? 'bg-[var(--primary)]  text-[var(--primary-foreground)]'
 : 'bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] text-[var(--foreground)]  hover:bg-[var(--surface-container-high)]'
 }`}
 >
 Yes
 </button>
 <button
 onClick={() => toggleFilterOption('deletable', 'false')}
 className={`flex-1 px-3 py-2 text-sm rounded transition-colors ${
 selectedDeletable.has('false')
 ? 'bg-[var(--primary)]  text-[var(--primary-foreground)]'
 : 'bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] text-[var(--foreground)]  hover:bg-[var(--surface-container-high)]'
 }`}
 >
 No
 </button>
 </div>
 </div>
 </div>

 {/* Occupancy Filter - Compact Multi-Select */}
 <div className="relative">
 <label className="text-sm font-medium text-[var(--muted-foreground)]  mb-2 block">Occupancy</label>
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg p-2 min-h-[42px]">
 <div className="flex flex-wrap gap-1.5 mb-2">
 {Array.from(selectedOccupancy).map((occupancy) => (
 <span
 key={occupancy}
 className="inline-flex items-center gap-1.5 px-2 py-1 bg-[var(--primary)]  text-[var(--primary-foreground)] rounded text-xs font-medium"
 >
 {occupancy}
 <button
 onClick={() => toggleFilterOption('occupancy', occupancy)}
 className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
 >
 <X size={12} />
 </button>
 </span>
 ))}
 </div>
 <div className="relative">
 <input
 type="text"
 placeholder="Search or select..."
 value={occupancySearch}
 onChange={(e) => setOccupancySearch(e.target.value)}
 onFocus={() => setActiveDropdown('occupancy')}
 className="w-full bg-transparent text-[var(--foreground)]  text-sm placeholder-zinc-500 outline-none"
 />
 {activeDropdown === 'occupancy' && (
 <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg max-h-48 overflow-y-auto z-10 filter-dropdown">
 {uniqueOccupancy.filter(occupancy => occupancy.toLowerCase().includes(occupancySearch.toLowerCase())).map((occupancy) => (
 <button
 key={occupancy}
 onClick={() => {
 toggleFilterOption('occupancy', occupancy);
 setOccupancySearch('');
 }}
 className={`w-full px-3 py-2 text-left text-sm transition-colors flex items-center gap-2 ${
 selectedOccupancy.has(occupancy)
 ? 'bg-[var(--primary)]/10 /10 text-[var(--primary)] dark:text-[var(--primary)]'
 : 'text-[var(--foreground)]  hover:bg-[var(--surface-container-low)] dark:hover:bg-[var(--surface-container-high)]'
 }`}
 >
 <div className={`w-4 h-4 rounded border flex items-center justify-center ${
 selectedOccupancy.has(occupancy)
 ? 'bg-[var(--primary)]  border-[var(--primary)] dark:border-[var(--primary)]'
 : 'border-[var(--border)] dark:border-[var(--border)]'
 }`}>
 {selectedOccupancy.has(occupancy) && <CheckCircle2 size={12} className="text-[var(--foreground)]" />}
 </div>
 {occupancy}
 </button>
 ))}
 </div>
 )}
 </div>
 </div>
 </div>

 {/* Item Type Filter - Compact Multi-Select */}
 <div className="relative">
 <label className="text-sm font-medium text-[var(--muted-foreground)]  mb-2 block">Item Type</label>
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg p-2 min-h-[42px]">
 <div className="flex flex-wrap gap-1.5 mb-2">
 {Array.from(selectedItemTypes).map((itemType) => (
 <span
 key={itemType}
 className="inline-flex items-center gap-1.5 px-2 py-1 bg-[var(--primary)]  text-[var(--primary-foreground)] rounded text-xs font-medium"
 >
 {itemType}
 <button
 onClick={() => toggleFilterOption('itemType', itemType)}
 className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
 >
 <X size={12} />
 </button>
 </span>
 ))}
 </div>
 <div className="relative">
 <input
 type="text"
 placeholder="Search or select..."
 value={itemTypeSearch}
 onChange={(e) => setItemTypeSearch(e.target.value)}
 onFocus={() => setActiveDropdown('itemType')}
 className="w-full bg-transparent text-[var(--foreground)]  text-sm placeholder-zinc-500 outline-none"
 />
 {activeDropdown === 'itemType' && (
 <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg max-h-48 overflow-y-auto z-10 filter-dropdown">
 {uniqueItemTypes.filter(itemType => itemType.toLowerCase().includes(itemTypeSearch.toLowerCase())).map((itemType) => (
 <button
 key={itemType}
 onClick={() => {
 toggleFilterOption('itemType', itemType);
 setItemTypeSearch('');
 }}
 className={`w-full px-3 py-2 text-left text-sm transition-colors flex items-center gap-2 ${
 selectedItemTypes.has(itemType)
 ? 'bg-[var(--primary)]/10 /10 text-[var(--primary)] dark:text-[var(--primary)]'
 : 'text-[var(--foreground)]  hover:bg-[var(--surface-container-low)] dark:hover:bg-[var(--surface-container-high)]'
 }`}
 >
 <div className={`w-4 h-4 rounded border flex items-center justify-center ${
 selectedItemTypes.has(itemType)
 ? 'bg-[var(--primary)]  border-[var(--primary)] dark:border-[var(--primary)]'
 : 'border-[var(--border)] dark:border-[var(--border)]'
 }`}>
 {selectedItemTypes.has(itemType) && <CheckCircle2 size={12} className="text-[var(--foreground)]" />}
 </div>
 {itemType}
 </button>
 ))}
 </div>
 )}
 </div>
 </div>
 </div>

 {/* Fill Status Filter - Compact Multi-Select */}
 <div className="relative">
 <label className="text-sm font-medium text-[var(--muted-foreground)]  mb-2 block">Fill Status</label>
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg p-2 min-h-[42px]">
 <div className="flex flex-wrap gap-1.5 mb-2">
 {Array.from(selectedFillStatuses).map((fillStatus) => (
 <span
 key={fillStatus}
 className="inline-flex items-center gap-1.5 px-2 py-1 bg-[var(--primary)]  text-[var(--primary-foreground)] rounded text-xs font-medium"
 >
 {fillStatus}
 <button
 onClick={() => toggleFilterOption('fillStatus', fillStatus)}
 className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
 >
 <X size={12} />
 </button>
 </span>
 ))}
 </div>
 <div className="relative">
 <input
 type="text"
 placeholder="Search or select..."
 value={fillStatusSearch}
 onChange={(e) => setFillStatusSearch(e.target.value)}
 onFocus={() => setActiveDropdown('fillStatus')}
 className="w-full bg-transparent text-[var(--foreground)]  text-sm placeholder-zinc-500 outline-none"
 />
 {activeDropdown === 'fillStatus' && (
 <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg max-h-48 overflow-y-auto z-10 filter-dropdown">
 {uniqueFillStatuses.filter(fillStatus => fillStatus.toLowerCase().includes(fillStatusSearch.toLowerCase())).map((fillStatus) => (
 <button
 key={fillStatus}
 onClick={() => {
 toggleFilterOption('fillStatus', fillStatus);
 setFillStatusSearch('');
 }}
 className={`w-full px-3 py-2 text-left text-sm transition-colors flex items-center gap-2 ${
 selectedFillStatuses.has(fillStatus)
 ? 'bg-[var(--primary)]/10 /10 text-[var(--primary)] dark:text-[var(--primary)]'
 : 'text-[var(--foreground)]  hover:bg-[var(--surface-container-low)] dark:hover:bg-[var(--surface-container-high)]'
 }`}
 >
 <div className={`w-4 h-4 rounded border flex items-center justify-center ${
 selectedFillStatuses.has(fillStatus)
 ? 'bg-[var(--primary)]  border-[var(--primary)] dark:border-[var(--primary)]'
 : 'border-[var(--border)] dark:border-[var(--border)]'
 }`}>
 {selectedFillStatuses.has(fillStatus) && <CheckCircle2 size={12} className="text-[var(--foreground)]" />}
 </div>
 {fillStatus}
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
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" size={20} />
 <input
 type="text"
 placeholder="Search containers..."
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 className="w-full bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg pl-10 pr-4 py-3 text-[var(--foreground)] placeholder-zinc-500 focus:outline-none focus: focus:)] dark:focus:)] focus:border-transparent"
 />
 </div>
 <button
 onClick={() => setGroupByParent(!groupByParent)}
 className={`px-4 py-3 rounded-lg transition-colors flex items-center gap-2 border whitespace-nowrap ${
 groupByParent
 ? "bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 border border-transparent text-[var(--primary-foreground)]"
 : "bg-[var(--surface-container-high)] text-[var(--foreground)] hover:bg-[var(--surface-container-highest)] border border-transparent"
 }`}
 >
 <Layers size={18} />
 <span>Group by Parent</span>
 </button>
 {groupByParent && (
 <>
 <button
 onClick={expandAll}
 className="px-4 py-3 bg-[var(--surface-container)] dark:bg-[var(--card)] hover:bg-[var(--surface-container-high)] text-[var(--foreground)]  rounded-lg transition-colors border-[var(--border)]  whitespace-nowrap"
 >
 Expand All
 </button>
 <button
 onClick={collapseAll}
 className="px-4 py-3 bg-[var(--surface-container)] dark:bg-[var(--card)] hover:bg-[var(--surface-container-high)] text-[var(--foreground)]  rounded-lg transition-colors border-[var(--border)]  whitespace-nowrap"
 >
 Collapse All
 </button>
 </>
 )}
 <button
 onClick={bulkMoveMode ? handleBulkMoveMode : handleBulkMoveMode}
 title={bulkMoveMode ? "Cancel Move" : "Move Containers"}
 className={`p-3 rounded-lg transition-colors border ${
 bulkMoveMode
 ? "bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 border border-transparent text-[var(--primary-foreground)]"
 : "bg-[var(--surface-container-high)] text-[var(--foreground)] hover:bg-[var(--surface-container-highest)] border border-transparent"
 }`}
 >
 <ArrowRightLeft size={18} />
 </button>
 {bulkMoveMode && (
 <button
 onClick={handleConfirmBulkMove}
 disabled={selectedLocationIds.size === 0}
 className="px-4 py-3 bg-[var(--primary)]  hover:opacity-90 active:scale-[0.98] text-[var(--primary-foreground)] rounded-lg transition-colors border border-[var(--primary)] dark:border-[var(--primary)] whitespace-nowrap disabled:bg-[var(--surface-container-high)] disabled:text-[var(--muted-foreground)] disabled:border-transparent disabled:opacity-60 disabled:cursor-not-allowed"
 >
 Confirm Move
 </button>
 )}
 <button
 onClick={handleAddLocation}
 title="Add Container"
 className="p-3 bg-[var(--primary)]  hover:opacity-90 active:scale-[0.98] text-[var(--primary-foreground)] rounded-lg transition-colors border border-[var(--primary)] dark:border-[var(--primary)]"
 >
 <Plus size={18} />
 </button>
 <button
 onClick={bulkDeleteMode ? handleConfirmBulkDelete : handleBulkDeleteMode}
 title={bulkDeleteMode ? "Confirm Deletion" : "Delete Containers"}
 className={`px-4 py-3 rounded-lg transition-colors flex items-center gap-2 border whitespace-nowrap ${
 bulkDeleteMode
 ? "bg-[var(--state-error)] hover:bg-[var(--state-error-container)] border-[var(--state-error)]/40 text-[var(--state-error-foreground)]"
 : "bg-[var(--surface-container-high)] text-[var(--foreground)] hover:bg-[var(--surface-container-highest)] border border-transparent"
 }`}
 >
 <Trash2 size={18} />
 {bulkDeleteMode && <span>Confirm</span>}
 </button>
 {bulkDeleteMode && (
 <button
 onClick={handleBulkDeleteMode}
 className="px-4 py-3 bg-[var(--surface-container)] dark:bg-[var(--card)] hover:bg-[var(--surface-container-high)] text-[var(--foreground)]  rounded-lg transition-colors border-[var(--border)]  whitespace-nowrap"
 >
 Cancel
 </button>
 )}
 </div>
 </div>

 {/* Data Grid or Ask OPTO prompt */}
 {isInitialState ? (
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg p-16 flex flex-col items-center justify-center">
 <div className="w-20 h-20 )] )] rounded-full flex items-center justify-center mb-6 ">
 <Sparkles size={40} className="text-[var(--primary-foreground)]" />
 </div>
 <h3 className="text-2xl font-bold text-[var(--foreground)]  mb-3">Ready to Explore Containers</h3>
 <p className="text-[var(--muted-foreground)] mb-6 text-center max-w-md">
 Use the filters above to view specific containers, or ask OPTO to help you find what you need.
 </p>
 <button
 onClick={() => setShowAI(true)}
 className="px-6 py-3 )] )] )] )] text-[var(--foreground)] rounded-lg font-medium transition-all flex items-center gap-2 "
 >
 <Sparkles size={20} />
 Ask OPTO
 </button>
 </div>
 ) : (
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg overflow-hidden">
        <MasterTableContainer type="actionable">
          <MasterTable type="actionable">
            <MasterTableHead type="actionable">
              <tr>
                {(bulkDeleteMode || bulkMoveMode) && (
                  <MasterTableTh type="actionable" density="compact" className="w-12">
                    <input
                      type="checkbox"
                      checked={selectedLocationIds.size === filteredData.length && filteredData.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-[var(--border)] bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] text-[var(--primary)] dark:text-[var(--primary)] cursor-pointer"
                    />
                  </MasterTableTh>
                )}
                {orderedColumns.map((column) => (
                  <MasterTableTh
                    key={column}
                    type="actionable"
                    density="compact"
                    onClick={() => handleSort(column as SortField)}
                    className={`cursor-pointer hover:bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] transition-colors ${
                      storageLocationsPinnedColumns.includes(column) ? "sticky left-0 bg-[var(--surface-container-high)] z-10" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {columnNames[column]}
                      <SortIcon field={column as SortField} />
                    </div>
                  </MasterTableTh>
                ))}
              </tr>
            </MasterTableHead>
            <MasterTableBody type="actionable">
              {groupByParent ? (
                // Grouped view
                Object.keys(groupedData).sort().map((parentName) => {
                  const group = groupedData[parentName];
                  const isExpanded = expandedGroups.has(parentName);
                  return (
                    <Fragment key={`group-${parentName}`}>
                      {/* Group Header */}
                      <MasterTableRow
                        type="actionable"
                        clickable
                        onClick={() => toggleGroup(parentName)}
                        className="bg-[var(--surface-container-high)] hover:bg-[var(--surface-container-highest)] cursor-pointer"
                      >
                        <MasterTableCell type="actionable" density="compact" colSpan={(bulkDeleteMode || bulkMoveMode) ? orderedColumns.length + 1 : orderedColumns.length}>
                          <div className="flex items-center gap-3">
                            {isExpanded ? (
                              <ChevronDown size={18} className="text-[var(--primary)] dark:text-[var(--primary)]" />
                            ) : (
                              <ChevronRight size={18} className="text-[var(--muted-foreground)]" />
                            )}
                            <Box size={18} className="text-[var(--primary)] dark:text-[var(--primary)]" />
                            <span className="font-semibold text-[var(--foreground)] ">{parentName}</span>
                            <span className="text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">
                              ({group.length} {group.length === 1 ? 'container' : 'containers'})
                            </span>
                          </div>
                        </MasterTableCell>
                      </MasterTableRow>
                      
                      {/* Group Items */}
                      {isExpanded && group.map((item) => (
                        <MasterTableRow
                          key={item.id}
                          type="actionable"
                          clickable={!bulkDeleteMode && !bulkMoveMode}
                          onClick={(e) => {
                            if (!bulkDeleteMode && !bulkMoveMode) {
                              setSelectedLocation(item);
                            }
                          }}
                        >
                          {(bulkDeleteMode || bulkMoveMode) && (
                            <MasterTableCell type="actionable" density="compact">
                              <input
                                type="checkbox"
                                checked={selectedLocationIds.has(item.id)}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  toggleLocationSelection(item.id);
                                }}
                                onClick={(e) => e.stopPropagation()}
                                className="w-4 h-4 rounded border-[var(--border)] bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] text-[var(--primary)] dark:text-[var(--primary)] cursor-pointer"
                              />
                            </MasterTableCell>
                          )}
                          {orderedColumns.map((column) => (
                            <MasterTableCell 
                              key={column} 
                              type="actionable"
                              density="compact"
                              className={
                                storageLocationsPinnedColumns.includes(column) ? "sticky left-0 bg-[var(--surface-container)] text-[var(--foreground)] border-r border-[var(--border)] z-10" : ""
                              }
                            >
                              {renderCellValue(column, item[column as keyof StorageLocation], item)}
                            </MasterTableCell>
                          ))}
                        </MasterTableRow>
                      ))}
                    </Fragment>
                  );
                })
              ) : (
                // Flat view
                sortedData.map((item) => (
                  <MasterTableRow
                    key={item.id}
                    type="actionable"
                    clickable={!bulkDeleteMode && !bulkMoveMode}
                    onClick={() => {
                      if (!bulkDeleteMode && !bulkMoveMode) {
                        setSelectedLocation(item);
                      }
                    }}
                  >
                    {(bulkDeleteMode || bulkMoveMode) && (
                      <MasterTableCell type="actionable" density="compact">
                        <input
                          type="checkbox"
                          checked={selectedLocationIds.has(item.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            toggleLocationSelection(item.id);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="w-4 h-4 rounded border-[var(--border)] bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] text-[var(--primary)] dark:text-[var(--primary)] cursor-pointer"
                        />
                      </MasterTableCell>
                    )}
                    {orderedColumns.map((column) => (
                      <MasterTableCell 
                        key={column} 
                        type="actionable"
                        density="compact"
                        className={
                          storageLocationsPinnedColumns.includes(column) ? "sticky left-0 bg-[var(--surface-container)] text-[var(--foreground)] border-r border-[var(--border)] z-10" : ""
                        }
                      >
                        {renderCellValue(column, item[column as keyof StorageLocation], item)}
                      </MasterTableCell>
                    ))}
                  </MasterTableRow>
                ))
              )}
            </MasterTableBody>
          </MasterTable>
        </MasterTableContainer>

        {/* Footer */}
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-t border-[var(--border)]  px-4 py-3 flex items-center justify-between">
 <div className="text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">
 Showing <span className="font-medium text-[var(--foreground)] ">{sortedData.length}</span> of{" "}
 <span className="font-medium text-[var(--foreground)] ">{totalLocations}</span> containers
 {groupByParent && (
 <span className="ml-2">
 in <span className="font-medium text-[var(--foreground)] ">{Object.keys(groupedData).length}</span> {Object.keys(groupedData).length === 1 ? 'group' : 'groups'}
 </span>
 )}
 </div>
 </div>
 </div>
 )}
 </div>
 </div>

      {/* Right Side Panel */}
      {selectedLocation && (
        <DetailSidePanel
          title={selectedLocation.name}
          subtitle={selectedLocation.parentStorage}
          icon={<MapPin size={24} className="text-[var(--primary)]" />}
          status={selectedLocation.status}
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab as any);
            if (tab === "actions") setActiveAction(null);
          }}
          tabs={[
            { id: "details", label: "Details", icon: <Info size={16} /> },
            { id: "inventory", label: "Inventory", icon: <Package size={16} /> },
            { id: "events", label: "Events", icon: <History size={16} /> },
            { id: "actions", label: "Actions", icon: <Zap size={16} />, isAction: true },
          ]}
          onClose={() => setSelectedLocation(null)}
        >
          {/* Details Tab */}
          {activeTab === "details" && (
            <div className="space-y-6">
              <PanelSection title="Container Information">
                <PanelRow label="Name" value={selectedLocation.name} mono />
                <PanelRow label="Parent Storage" value={selectedLocation.parentStorage} />
                <PanelRow label="Type" value={selectedLocation.type} />
                <PanelRow
                  label="Status"
                  value={
                    <div className="flex items-center gap-2 justify-end">
                      {getStatusIcon(selectedLocation.status)}
                      <span className={`text-sm font-medium ${getStatusColor(selectedLocation.status)}`}>
                        {selectedLocation.status}
                      </span>
                    </div>
                  }
                />
              </PanelSection>

              <PanelSection title="Attributes">
                {selectedLocation.attribute1 && <PanelRow label="Attribute 1" value={selectedLocation.attribute1} />}
                {selectedLocation.attribute2 && <PanelRow label="Attribute 2" value={selectedLocation.attribute2} />}
                {selectedLocation.attribute3 && <PanelRow label="Attribute 3" value={selectedLocation.attribute3} />}
                {selectedLocation.attribute4 && <PanelRow label="Attribute 4" value={selectedLocation.attribute4} />}
                {selectedLocation.attribute5 && <PanelRow label="Attribute 5" value={selectedLocation.attribute5} />}
              </PanelSection>

              <PanelSection title="Metadata">
                <PanelRow label="Created" value={formatDate(selectedLocation.created)} mono />
                <PanelRow label="Created By" value={selectedLocation.createdBy} />
              </PanelSection>
            </div>
          )}

 {/* Inventory Tab */}
 {activeTab === 'inventory' && (
 <div className="space-y-4">
 <div className="flex items-center justify-between mb-4">
 <h4 className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Current Inventory</h4>
 {locationInventory.length > 0 && (
 <span className="text-xs bg-[var(--primary)]/20 /20 text-[var(--primary)] dark:text-[var(--primary)] px-2 py-1 rounded">
 {locationInventory.length} {locationInventory.length === 1 ? 'item' : 'items'}
 </span>
 )}
 </div>

 {locationInventory.length > 0 ? (
 <div className="space-y-3">
 {locationInventory.map((inv) => (
 <div key={inv.id} className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-lg p-4 border-[var(--border)]  hover:border-[var(--primary)] dark:hover:border-[var(--primary)] transition-colors">
 <div className="flex items-start justify-between mb-3">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 bg-[var(--state-info)]/20 rounded-lg flex items-center justify-center">
 <Package size={20} className="text-[var(--state-info)]" />
 </div>
 <div>
 <p className="font-mono text-sm font-medium text-[var(--foreground)] ">{inv.itemNumber}</p>
 <p className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">{inv.itemDescription}</p>
 </div>
 </div>
 <div className="text-right">
 <p className="text-lg font-bold text-[var(--foreground)] ">{inv.quantity}</p>
 <p className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">{inv.uom}</p>
 </div>
 </div>
 <div className="grid grid-cols-2 gap-3 text-xs">
 <div>
 <span className="text-[var(--muted-foreground)]">Lot: </span>
 <span className="text-[var(--foreground)] font-mono">{inv.lotNumber}</span>
 </div>
 {inv.serialNumber && (
 <div>
 <span className="text-[var(--muted-foreground)]">Serial: </span>
 <span className="text-[var(--foreground)] font-mono">{inv.serialNumber}</span>
 </div>
 )}
 <div>
 <span className="text-[var(--muted-foreground)]">Received: </span>
 <span className="text-[var(--foreground)]">{formatDate(inv.receivedDate)}</span>
 </div>
 {inv.expirationDate && (
 <div>
 <span className="text-[var(--muted-foreground)]">Expires: </span>
 <span className="text-[var(--foreground)]">{new Date(inv.expirationDate).toLocaleDateString()}</span>
 </div>
 )}
 </div>
 </div>
 ))}
 </div>
 ) : (
 <div className="bg-[var(--surface-container-lowest)] dark:bg-[var(--surface-container)] rounded-lg p-8 text-center">
 <Package size={48} className="mx-auto mb-3 text-[var(--muted-foreground)]" />
 <p className="text-[var(--muted-foreground)] text-sm">No inventory in this container</p>
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
 <h4 className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Current Allocations</h4>
 <span className="text-xs bg-[var(--primary)]/20 /20 text-[var(--primary)] dark:text-[var(--primary)] px-2 py-1 rounded">
 {locationCurrentAllocations.length} active
 </span>
 </div>

 <div className="space-y-3">
 {locationCurrentAllocations.map((alloc) => (
 <button
 key={alloc.id}
 onClick={() => navigate(`/app/worklist?workList=${alloc.workList}&openPanel=true`)}
 className="w-full bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-lg p-4 border-[var(--border)]  hover:border-[var(--primary)] dark:hover:border-[var(--primary)] transition-colors text-left group"
 >
 <div className="flex items-center justify-between mb-3">
 <div className="flex items-center gap-2">
 <div className={`w-2 h-2 rounded-full ${
 alloc.status === 'In Progress' ? 'bg-[var(--state-info)]' :
 alloc.status === 'Queued' ? 'bg-[var(--state-warning)]' :
 alloc.status === 'Warning' ? 'bg-[var(--state-error)]' :
 'bg-[var(--state-debug)]'
 }`} />
 <span className="font-mono text-sm text-[var(--foreground)] font-medium group-hover:text-[var(--primary)] dark:group-hover:text-[var(--primary)] transition-colors">{alloc.workList}</span>
 <ChevronRight size={16} className="text-[var(--muted-foreground)] group-hover:text-[var(--primary)] dark:group-hover:text-[var(--primary)] transition-colors" />
 </div>
 <span className={`text-xs px-2 py-1 rounded ${
 alloc.status === 'In Progress' ? 'bg-[var(--state-info)]/20 text-[var(--state-info)]' :
 alloc.status === 'Queued' ? 'bg-[var(--state-warning)]/20 text-[var(--state-warning)]' :
 alloc.status === 'Warning' ? 'bg-[var(--state-error)]/20 text-[var(--state-error)]' :
 'bg-[var(--state-debug)]/20 text-[var(--muted-foreground)]'
 }`}>
 {alloc.status}
 </span>
 </div>
 <div className="space-y-2 text-xs">
 <div className="flex items-center gap-4">
 <div className="flex-1">
 <span className="text-[var(--muted-foreground)]">Work Line: </span>
 <span className="text-[var(--foreground)] font-mono">{alloc.workLine}</span>
 </div>
 <div className="flex-1">
 <span className="text-[var(--muted-foreground)]">Operation: </span>
 <span className="text-[var(--foreground)] font-mono">{alloc.workOperation}</span>
 </div>
 </div>
 <div className="flex items-center gap-4">
 <div className="flex-1">
 <span className="text-[var(--muted-foreground)]">Type: </span>
 <span className="text-[var(--foreground)]">{alloc.workOperationType}</span>
 </div>
 <div className="flex-1">
 <span className="text-[var(--muted-foreground)]">Created: </span>
 <span className="text-[var(--foreground)]">{formatDate(alloc.created)}</span>
 </div>
 </div>
 <div>
 <span className="text-[var(--muted-foreground)]">Created By: </span>
 <span className="text-[var(--foreground)]">{alloc.createdBy}</span>
 </div>
 </div>
 </button>
 ))}
 </div>
 </div>
 )}

 {/* Parent Change Events */}
 <div>
 <div className="flex items-center justify-between mb-4">
 <h4 className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Parent Location Changes</h4>
 {parentChangeEvents.length > 0 && (
 <span className="text-xs bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] text-[var(--foreground)] px-2 py-1 rounded">
 {parentChangeEvents.length} change{parentChangeEvents.length !== 1 ? 's' : ''}
 </span>
 )}
 </div>

 {parentChangeEvents.length > 0 ? (
 <div className="space-y-3">
 {parentChangeEvents.map((event) => (
 <div
 key={event.id}
 className="bg-[var(--surface-container-lowest)] dark:bg-[var(--surface-container)] rounded-lg p-4 border-[var(--border)] /50"
 >
 <div className="flex items-center gap-2 mb-3">
 <ArrowRightLeft size={16} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 <span className="text-sm font-medium text-[var(--foreground)] ">Location Moved</span>
 <span className="ml-auto text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">{formatDate(event.changedDate)}</span>
 </div>
 <div className="space-y-2 text-xs">
 <div className="flex items-center gap-3 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded p-2">
 <div className="flex-1">
 <span className="text-[var(--muted-foreground)]">From: </span>
 <span className="text-[var(--foreground)] font-mono">{event.oldParent}</span>
 </div>
 <div className="text-[var(--muted-foreground)]">→</div>
 <div className="flex-1">
 <span className="text-[var(--muted-foreground)]">To: </span>
 <span className="text-[var(--primary)] dark:text-[var(--primary)] font-mono font-medium">{event.newParent}</span>
 </div>
 </div>
 <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
 <span>Changed By:</span>
 <span className="text-[var(--foreground)]">{event.changedBy}</span>
 </div>
 </div>
 </div>
 ))}
 </div>
 ) : (
 <div className="bg-[var(--surface-container-lowest)] dark:bg-[var(--surface-container)] rounded-lg p-8 text-center">
 <ArrowRightLeft size={48} className="mx-auto mb-3 text-[var(--muted-foreground)]" />
 <p className="text-[var(--muted-foreground)] text-sm">No parent location changes recorded</p>
 </div>
 )}
 </div>

 {/* Allocation History */}
 {locationAllocationHistory.length > 0 && (
 <div>
 <div className="flex items-center justify-between mb-4">
 <h4 className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Allocation History</h4>
 <span className="text-xs bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] text-[var(--foreground)] px-2 py-1 rounded">
 {locationAllocationHistory.length} event{locationAllocationHistory.length !== 1 ? 's' : ''}
 </span>
 </div>

 <div className="space-y-3">
 {locationAllocationHistory.map((hist) => (
 <button
 key={hist.id}
 onClick={() => navigate(`/app/worklist?workList=${hist.workList}&openPanel=true`)}
 className="w-full bg-[var(--surface-container-lowest)] dark:bg-[var(--surface-container)] rounded-lg p-4 border-[var(--border)] /50 hover:border-[var(--primary)]/50 dark:hover:border-[var(--primary)]/50 transition-colors text-left group"
 >
 <div className="flex items-center justify-between mb-3">
 <div className="flex items-center gap-2">
 <CheckCircle2 size={16} className="text-[var(--state-success)]" />
 <span className="font-mono text-sm text-[var(--foreground)] group-hover:text-[var(--primary)] dark:group-hover:text-[var(--primary)] transition-colors">{hist.workList}</span>
 <ChevronRight size={16} className="text-[var(--muted-foreground)] group-hover:text-[var(--primary)] dark:group-hover:text-[var(--primary)] transition-colors" />
 </div>
 <span className="text-xs bg-[var(--state-success-container)] text-[var(--state-success)] px-2 py-1 rounded">
 {hist.status}
 </span>
 </div>
 <div className="space-y-2 text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">
 <div className="flex items-center gap-4">
 <div className="flex-1">
 <span>Work Line: </span>
 <span className="text-[var(--foreground)] font-mono">{hist.workLine}</span>
 </div>
 <div className="flex-1">
 <span>Operation: </span>
 <span className="text-[var(--foreground)] font-mono">{hist.workOperation}</span>
 </div>
 </div>
 <div className="flex items-center gap-4">
 <div className="flex-1">
 <span>Type: </span>
 <span className="text-[var(--foreground)]">{hist.workOperationType}</span>
 </div>
 <div className="flex-1">
 <span>Started: </span>
 <span className="text-[var(--foreground)]">{formatDate(hist.created)}</span>
 </div>
 </div>
 {hist.completed && (
 <div>
 <span>Completed: </span>
 <span className="text-[var(--foreground)]">{formatDate(hist.completed)}</span>
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
 className="flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors group"
 >
 <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
 <span className="text-sm font-medium">Back to Actions</span>
 </button>
 )}

 {/* Action Selection Header */}
 {!activeAction && (
 <div className="text-center py-2">
 <p className="text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">Select an action to perform</p>
 </div>
 )}

 {/* Allocation Warning - Always show at top if allocations present */}
 {locationCurrentAllocations.length > 0 && (
 <div className="flex items-start gap-2 p-3 bg-[var(--state-info)]/10 border border-[var(--state-info)]/40 rounded-lg">
 <Info size={16} className="text-[var(--state-info)] mt-0.5 flex-shrink-0" />
 <div className="text-xs text-[var(--state-info)]">
 <p className="font-medium mb-1">Current Allocations Present</p>
 <p className="text-[var(--state-info)]/80">This container has {locationCurrentAllocations.length} active allocation(s). Some actions are disabled while allocations are present.</p>
 </div>
 </div>
 )}

 {/* Action Tiles */}
 {!activeAction && (
 <div className="grid grid-cols-2 gap-3">
 {/* Change Status Tile */}
 <button
 onClick={() => setActiveAction('status')}
 className="p-4 rounded-lg border-2 border-[var(--border)]  bg-[var(--surface-container-lowest)] dark:bg-[var(--surface-container)] hover:border-[var(--border)] hover:bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] text-left transition-all"
 >
 <div className="flex items-center gap-2 mb-1">
 <div className="w-8 h-8 bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] rounded-lg flex items-center justify-center">
 <RefreshCw size={16} className="text-[var(--foreground)]" />
 </div>
 <h5 className="text-base font-semibold text-[var(--foreground)] ">Change Status</h5>
 </div>
 <p className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">Update container status</p>
 </button>

 {/* Move Container Tile */}
 <button
 onClick={() => setActiveAction('move')}
 disabled={!selectedLocation.isMoveable}
 className={`p-4 rounded-lg border-2 text-left transition-all ${
 !selectedLocation.isMoveable
 ? 'border-[var(--border)]  bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)]/20 opacity-50 cursor-not-allowed'
 : 'border-[var(--border)]  bg-[var(--surface-container-lowest)] dark:bg-[var(--surface-container)] hover:border-[var(--border)] hover:bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)]'
 }`}
 >
 <div className="flex items-center gap-2 mb-1">
 <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
 !selectedLocation.isMoveable ? 'bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)]/50' : 'bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)]'
 }`}>
 <MapPin size={16} className="text-[var(--foreground)]" />
 </div>
 <h5 className="text-base font-semibold text-[var(--foreground)] ">Move Container</h5>
 </div>
 <p className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">
 {selectedLocation.isMoveable ? 'Change parent location' : 'Not moveable'}
 </p>
 </button>

 {/* Activity Report Tile */}
 <button
 onClick={() => setActiveAction('report')}
 className="p-4 rounded-lg border-2 border-[var(--border)]  bg-[var(--surface-container-lowest)] dark:bg-[var(--surface-container)] hover:border-[var(--border)] hover:bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] text-left transition-all"
 >
 <div className="flex items-center gap-2 mb-1">
 <div className="w-8 h-8 bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] rounded-lg flex items-center justify-center">
 <BarChart3 size={16} className="text-[var(--foreground)]" />
 </div>
 <h5 className="text-base font-semibold text-[var(--foreground)] ">Activity Report</h5>
 </div>
 <p className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">Generate report</p>
 </button>

 {/* Delete Container Tile */}
 <button
 onClick={() => setActiveAction('delete')}
 disabled={locationCurrentAllocations.length > 0}
 className={`p-4 rounded-lg border-2 text-left transition-all ${
 locationCurrentAllocations.length > 0
 ? 'border-[var(--border)]  bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)]/20 opacity-50 cursor-not-allowed'
 : 'border-[var(--state-error)] bg-[var(--state-error)]/10 hover:border-[var(--state-error)] hover:bg-[var(--state-error)]/20'
 }`}
 >
 <div className="flex items-center gap-2 mb-1">
 <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
 locationCurrentAllocations.length > 0 ? 'bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)]' : 'bg-[var(--state-error)]/20'
 }`}>
 <Trash2 size={16} className={locationCurrentAllocations.length > 0 ? 'text-[var(--muted-foreground)]' : activeAction === 'delete' ? 'text-white' : 'text-[var(--state-error)]'} />
 </div>
 <h5 className="text-base font-semibold text-[var(--foreground)] ">Delete</h5>
 </div>
 <p className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">
 {locationCurrentAllocations.length > 0 ? 'Has allocations' : 'Remove location'}
 </p>
 </button>
 </div>
 )}

 {/* Status Change Action Content */}
 {activeAction === 'status' && (
 <div className="bg-[var(--surface-container-lowest)] dark:bg-[var(--surface-container)] border-[var(--border)]  rounded-lg p-6">
 <div className="mb-6">
 <h4 className="text-lg font-semibold text-[var(--foreground)]  mb-2">Change Status</h4>
 <p className="text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">Update the availability status of this location</p>
 </div>

 {/* Current Status Display */}
 <div className="mb-6 p-4 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-lg border-[var(--border)] ">
 <div className="flex items-center justify-between">
 <div className="flex-1">
 <p className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] mb-1">Current Status</p>
 <p className="text-base font-semibold text-[var(--foreground)] ">{selectedLocation.status}</p>
 <div className="flex items-center gap-2 mt-2">
 <span className={`px-2 py-1 rounded text-xs font-medium ${
 locationCurrentAllocations.length > 0
 ? 'bg-[var(--tertiary)]/20 text-[var(--state-fatal)] border border-purple-500/30'
 : 'bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)]/50 text-[var(--muted-foreground)] border-[var(--border)]/30'
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
 <label className="block text-sm font-medium text-[var(--foreground)] mb-3">Select New Status</label>
 <div className="grid grid-cols-2 gap-3">
 <button
 onClick={() => handleStatusChange('Available')}
 disabled={selectedLocation.status === 'Available' || locationCurrentAllocations.length > 0}
 className={`p-4 rounded-lg border-2 text-left transition-all ${
 selectedLocation.status === 'Available' || locationCurrentAllocations.length > 0
 ? 'border-[var(--border)]  bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)]/20 opacity-50 cursor-not-allowed'
 : 'border-[var(--border)]  bg-[var(--surface-container-lowest)] dark:bg-[var(--surface-container)] hover:border-[var(--state-success)] hover:bg-[var(--state-success-container)]/60'
 }`}
 >
 <div className="flex items-center gap-2 mb-1">
 <CheckCircle2 size={20} className={selectedLocation.status === 'Available' || locationCurrentAllocations.length > 0 ? 'text-[var(--muted-foreground)]' : 'text-[var(--state-success)]'} />
 <h5 className="text-base font-semibold text-[var(--foreground)] ">Available</h5>
 </div>
 <p className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">Location is ready for use</p>
 </button>

 <button
 onClick={() => handleStatusChange('Unavailable')}
 disabled={selectedLocation.status === 'Unavailable' || locationCurrentAllocations.length > 0}
 className={`p-4 rounded-lg border-2 text-left transition-all ${
 selectedLocation.status === 'Unavailable' || locationCurrentAllocations.length > 0
 ? 'border-[var(--border)]  bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)]/20 opacity-50 cursor-not-allowed'
 : 'border-[var(--border)]  bg-[var(--surface-container-lowest)] dark:bg-[var(--surface-container)] hover:border-[var(--state-warning)] hover:bg-[var(--state-warning)]/10'
 }`}
 >
 <div className="flex items-center gap-2 mb-1">
 <AlertCircle size={20} className={selectedLocation.status === 'Unavailable' || locationCurrentAllocations.length > 0 ? 'text-[var(--muted-foreground)]' : 'text-[var(--state-warning)]'} />
 <h5 className="text-base font-semibold text-[var(--foreground)] ">Unavailable</h5>
 </div>
 <p className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">Location is not in use</p>
 </button>
 </div>
 </div>
 </div>
 )}

 {/* Report Generation Action Content */}
 {activeAction === 'report' && (
 <div className="bg-[var(--surface-container-lowest)] dark:bg-[var(--surface-container)] border-[var(--border)]  rounded-lg p-6">
 <div className="mb-4">
 <h4 className="text-lg font-semibold text-[var(--foreground)]  mb-2">Activity Report</h4>
 <p className="text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">Generate a detailed activity report for this container</p>
 </div>

 <button
 onClick={handleGenerateReport}
 className="w-full p-4 rounded-lg border-2 border-[var(--border)]  bg-[var(--surface-container-lowest)] dark:bg-[var(--surface-container)] hover:border-[var(--state-info)] hover:bg-[var(--state-info)]/10 text-left transition-all group"
 >
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] group-hover:bg-[var(--state-info)] rounded-lg flex items-center justify-center transition-colors">
 <BarChart3 size={20} className="text-[var(--foreground)]" />
 </div>
 <div className="flex-1">
 <h5 className="text-base font-semibold text-[var(--foreground)]  mb-1">Generate Activity Report</h5>
 <p className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">View status changes and inventory modifications over time</p>
 </div>
 <ChevronRight size={20} className="text-[var(--muted-foreground)] group-hover:text-[var(--state-info)] transition-colors" />
 </div>
 </button>
 </div>
 )}

 {/* Move Container Action Content */}
 {activeAction === 'move' && (
 <div className={`bg-[var(--surface-container-lowest)] dark:bg-[var(--surface-container)] border-[var(--border)]  rounded-lg p-6 ${!selectedLocation.isMoveable ? 'opacity-60' : ''}`}>
 <div className="mb-4">
 <h4 className="text-lg font-semibold text-[var(--foreground)]  mb-2">Move Container</h4>
 <p className="text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">
 {selectedLocation.isMoveable 
 ? 'Move this container to a different parent location' 
 : 'This container cannot be moved (fixed location type)'}
 </p>
 </div>

 {!selectedLocation.isMoveable && (
 <div className="flex items-start gap-2 p-3 bg-[var(--state-warning)]/10 border border-[var(--state-warning)]/40 rounded-lg mb-4">
 <AlertCircle size={16} className="text-[var(--state-warning)] mt-0.5 flex-shrink-0" />
 <div className="text-xs text-[var(--state-warning)]">
 <p className="font-medium mb-1">Container is Not Moveable</p>
 <p className="text-[var(--state-warning)]/80">This container type ({selectedLocation.type}) is fixed and cannot be moved to a different parent.</p>
 </div>
 </div>
 )}

 <div className="space-y-4">
 {/* Current Parent Display */}
 <div className="p-4 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-lg border-[var(--border)] ">
 <p className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] mb-1">Current Parent Location</p>
 <p className="text-base font-semibold text-[var(--foreground)]  font-mono">{selectedLocation.parentStorage}</p>
 </div>

 {/* Destination Selection */}
 <div>
 <label className="block text-sm font-medium text-[var(--foreground)] mb-3">Move to Location</label>
 <select
 value={moveToLocation}
 onChange={(e) => setMoveToLocation(e.target.value)}
 disabled={!selectedLocation.isMoveable}
 className="w-full bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg px-4 py-3 text-[var(--foreground)] focus:outline-none focus: focus:)] dark:focus:)] focus:border-transparent disabled:bg-[var(--surface-container-high)] disabled:text-[var(--muted-foreground)] disabled:border-transparent disabled:opacity-60 disabled:cursor-not-allowed"
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
 ? 'border-[var(--border)]  bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)]/20 opacity-50 cursor-not-allowed'
 : 'border-[var(--border)]  bg-[var(--surface-container-lowest)] dark:bg-[var(--surface-container)] hover:border-[var(--primary)] dark:hover:border-[var(--primary)] hover:bg-[var(--primary)]/10 /10'
 }`}
 >
 <div className="flex items-center gap-3">
 <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
 !selectedLocation.isMoveable || !moveToLocation
 ? 'bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)]'
 : 'bg-[var(--primary)]/20 /20'
 }`}>
 <MapPin size={20} className={!selectedLocation.isMoveable || !moveToLocation ? 'text-[var(--muted-foreground)]' : 'text-[var(--primary)] dark:text-[var(--primary)]'} />
 </div>
 <div className="flex-1">
 <h5 className="text-base font-semibold text-[var(--foreground)]  mb-1">Move Container</h5>
 <p className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">Update the parent location of this container</p>
 </div>
 </div>
 </button>
 </div>
 </div>
 )}

 {/* Delete Container Action Content */}
 {activeAction === 'delete' && (
 <div className="bg-[var(--state-error)]/5 border-2 border-[var(--state-error)]/40 rounded-lg p-6">
 <div className="mb-4">
 <h4 className="text-lg font-semibold text-[var(--state-error)] mb-2">Danger Zone</h4>
 <p className="text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">Irreversible and destructive actions</p>
 </div>

 <button
 onClick={handleDeleteLocation}
 disabled={locationCurrentAllocations.length > 0}
 className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
 locationCurrentAllocations.length > 0
 ? 'border-[var(--border)]  bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)]/20 opacity-50 cursor-not-allowed'
 : 'border-[var(--state-error)] bg-[var(--state-error)]/10 hover:border-[var(--state-error)] hover:bg-[var(--state-error)]/20'
 }`}
 >
 <div className="flex items-center gap-3">
 <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
 locationCurrentAllocations.length > 0
 ? 'bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)]'
 : 'bg-[var(--state-error)]/20'
 }`}>
 <Trash2 size={20} className={locationCurrentAllocations.length > 0 ? 'text-[var(--muted-foreground)]' : 'text-[var(--state-error)]'} />
 </div>
 <div className="flex-1">
 <h5 className="text-base font-semibold text-[var(--foreground)]  mb-1">Delete Container</h5>
 <p className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">Permanently remove this container from the system</p>
 </div>
 </div>
 </button>
 </div>
 )}
 </div>
 )}
 </DetailSidePanel>
 )}

 {/* Status Change Confirmation Dialog */}
 {showStatusConfirmation && (
 <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
 <div className="bg-[var(--surface-container-high)] text-[var(--foreground)] border-[var(--border)]  rounded-xl p-6 max-w-md w-full mx-4 ">
 <div className="mb-4">
 <h3 className="text-xl font-bold text-[var(--foreground)]  mb-2">Confirm Status Change</h3>
 <p className="text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">Please review and confirm the following change:</p>
 </div>

 {/* Change Summary */}
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg p-4 mb-6">
 <div className="space-y-3">
 <div>
 <p className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] mb-1">Location</p>
 <p className="text-sm font-semibold text-[var(--foreground)] ">{selectedLocation?.name}</p>
 </div>
 <div className="flex items-center gap-3">
 <div className="flex-1">
 <p className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] mb-1">Current Status</p>
 <p className="text-sm font-semibold text-[var(--foreground)] ">{selectedLocation?.status}</p>
 </div>
 <div className="text-[var(--muted-foreground)]">→</div>
 <div className="flex-1">
 <p className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] mb-1">New Status</p>
 <p className="text-sm font-semibold text-[var(--state-warning)]">{newStatus}</p>
 </div>
 </div>
 </div>
 </div>

 {/* Action Buttons */}
 <div className="flex gap-3">
 <button
 onClick={() => setShowStatusConfirmation(false)}
 className="flex-1 px-4 py-2 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] text-[var(--foreground)] rounded-lg transition-colors"
 >
 Cancel
 </button>
 <button
 onClick={confirmStatusChange}
 className="flex-1 px-4 py-2 bg-[var(--state-warning-container)] hover:bg-[var(--state-warning)] text-[var(--state-on-warning-container)] rounded-lg transition-colors font-medium"
 >
 Confirm Change
 </button>
 </div>
 </div>
 </div>
 )}

 {/* Move Container Confirmation Dialog */}
 {showMoveConfirmation && selectedLocation && (() => {
 const destinationLocation = mockStorageLocations.find(loc => loc.id === moveToLocation);
 return (
 <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
 <div className="bg-[var(--surface-container-high)] text-[var(--foreground)] border-[var(--border)]  rounded-xl p-6 max-w-md w-full mx-4 ">
 <div className="mb-4">
 <h3 className="text-xl font-bold text-[var(--foreground)]  mb-2">Confirm Container Move</h3>
 <p className="text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">Please review and confirm the following change:</p>
 </div>

 {/* Move Summary */}
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg p-4 mb-6">
 <div className="mb-4">
 <p className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] mb-2">Container to Move</p>
 <div className="flex items-center gap-2">
 <MapPin size={16} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 <p className="text-sm font-semibold text-[var(--foreground)]  font-mono">{selectedLocation.name}</p>
 </div>
 </div>
 <div className="flex items-center gap-3 py-3 border-t border-[var(--border)] ">
 <div className="flex-1">
 <p className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] mb-1">Current Parent</p>
 <p className="text-sm font-semibold text-[var(--foreground)]  font-mono">{selectedLocation.parentStorage}</p>
 </div>
 <div className="text-[var(--muted-foreground)]">→</div>
 <div className="flex-1">
 <p className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] mb-1">New Parent</p>
 <p className="text-sm font-semibold text-[var(--primary)] dark:text-[var(--primary)] font-mono">{destinationLocation?.name}</p>
 </div>
 </div>
 </div>

 {/* Action Buttons */}
 <div className="flex gap-3">
 <button
 onClick={() => setShowMoveConfirmation(false)}
 className="flex-1 px-4 py-2 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] text-[var(--foreground)] rounded-lg transition-colors"
 >
 Cancel
 </button>
 <button
 onClick={confirmMoveLocation}
 className="flex-1 px-4 py-2 bg-[var(--primary)]  hover:opacity-90 active:scale-[0.98] text-[var(--primary-foreground)] rounded-lg transition-colors font-medium"
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
 <div className="bg-[var(--surface-container-high)] text-[var(--foreground)] border-[var(--border)]  rounded-xl p-6 max-w-md w-full mx-4 ">
 <div className="mb-4">
 <div className="w-12 h-12 bg-[var(--state-warning)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
 <AlertCircle size={24} className="text-[var(--state-warning)]" />
 </div>
 <h3 className="text-xl font-bold text-[var(--foreground)]  mb-2 text-center">Cannot Change Status</h3>
 <p className="text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] text-center">This container has active allocations</p>
 </div>

 {/* Warning Message */}
 <div className="bg-[var(--state-warning)]/10 border border-[var(--state-warning)]/40 rounded-lg p-4 mb-6">
 <p className="text-sm text-[var(--state-warning)]">
 This location currently has <span className="font-semibold">{locationCurrentAllocations.length} active allocation(s)</span>. 
 The status cannot be changed while allocations are present. Please clear all allocations before attempting to change the status.
 </p>
 </div>

 {/* Close Button */}
 <button
 onClick={() => setShowAllocationWarning(false)}
 className="w-full px-4 py-2 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] text-[var(--foreground)] rounded-lg transition-colors"
 >
 Close
 </button>
 </div>
 </div>
 )}

 {/* Delete Container Confirmation Dialog */}
 {showDeleteConfirmation && (
 <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
 <div className="bg-[var(--surface-container-high)] text-[var(--foreground)] border-[var(--border)]  rounded-xl p-6 max-w-md w-full mx-4 ">
 <div className="mb-4">
 <div className="w-12 h-12 bg-[var(--state-error)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
 <AlertCircle size={24} className="text-[var(--state-error)]" />
 </div>
 <h3 className="text-xl font-bold text-[var(--foreground)]  mb-2 text-center">Delete Container</h3>
 <p className="text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] text-center">This action cannot be undone</p>
 </div>

 {/* Location Summary */}
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg p-4 mb-4">
 <div className="flex items-center gap-3 mb-3 pb-3 border-b border-[var(--border)] ">
 <MapPin size={20} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 <div>
 <p className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">Location</p>
 <p className="text-sm font-semibold text-[var(--foreground)]  font-mono">{selectedLocation?.name}</p>
 </div>
 </div>
 <div className="grid grid-cols-2 gap-3 text-sm">
 <div>
 <p className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] mb-1">Type</p>
 <p className="text-[var(--foreground)]">{selectedLocation?.type}</p>
 </div>
 <div>
 <p className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] mb-1">Status</p>
 <p className="text-[var(--foreground)]">{selectedLocation?.status}</p>
 </div>
 </div>
 </div>

 {/* Warning Message */}
 <div className="bg-[var(--state-error)]/10 border border-[var(--state-error)]/40 rounded-lg p-4 mb-6">
 <p className="text-sm text-[var(--state-error)]">
 <span className="font-semibold">Warning:</span> Deleting this container will permanently remove it from the system. 
 This action cannot be undone.
 </p>
 </div>

 {/* Action Buttons */}
 <div className="flex gap-3">
 <button
 onClick={() => setShowDeleteConfirmation(false)}
 className="flex-1 px-4 py-2 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] text-[var(--foreground)] rounded-lg transition-colors"
 >
 Cancel
 </button>
 <button
 onClick={confirmDeleteLocation}
 className="flex-1 px-4 py-2 bg-[var(--state-error)] hover:bg-[var(--state-error-container)] text-[var(--state-error-foreground)] rounded-lg transition-colors font-medium"
 >
 Delete Container
 </button>
 </div>
 </div>
 </div>
 )}

 {/* Date Range Selection Dialog */}
 {showDateRangeDialog && (
 <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
 <div className="bg-[var(--surface-container-high)] text-[var(--foreground)] border-[var(--border)]  rounded-xl p-6 max-w-md w-full mx-4 ">
 <div className="mb-6">
 <h3 className="text-xl font-bold text-[var(--foreground)]  mb-2">Select Report Date Range</h3>
 <p className="text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">Choose the time period for the activity report</p>
 </div>

 {/* Date Inputs */}
 <div className="space-y-4 mb-6">
 <div>
 <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Start Date</label>
 <input
 type="date"
 value={reportStartDate}
 onChange={(e) => setReportStartDate(e.target.value)}
 className="w-full px-4 py-2 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--state-info)]/40"
 />
 </div>
 <div>
 <label className="block text-sm font-medium text-[var(--foreground)] mb-2">End Date</label>
 <input
 type="date"
 value={reportEndDate}
 onChange={(e) => setReportEndDate(e.target.value)}
 className="w-full px-4 py-2 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--state-info)]/40"
 />
 </div>
 </div>

 {/* Quick Selection Buttons */}
 <div className="mb-6">
 <p className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] mb-2">Quick Select:</p>
 <div className="grid grid-cols-3 gap-2">
 <button
 onClick={() => {
 const end = new Date();
 const start = new Date();
 start.setDate(start.getDate() - 7);
 setReportStartDate(start.toISOString().split('T')[0]);
 setReportEndDate(end.toISOString().split('T')[0]);
 }}
 className="px-3 py-2 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] text-[var(--foreground)] text-xs rounded-lg transition-colors"
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
 className="px-3 py-2 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] text-[var(--foreground)] text-xs rounded-lg transition-colors"
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
 className="px-3 py-2 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] text-[var(--foreground)] text-xs rounded-lg transition-colors"
 >
 Last 90 Days
 </button>
 </div>
 </div>

 {/* Action Buttons */}
 <div className="flex gap-3">
 <button
 onClick={() => setShowDateRangeDialog(false)}
 className="flex-1 px-4 py-2 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] text-[var(--foreground)] rounded-lg transition-colors"
 >
 Cancel
 </button>
 <button
 onClick={confirmGenerateReport}
 disabled={!reportStartDate || !reportEndDate}
 className="flex-1 px-4 py-2 bg-[var(--state-info-container)] hover:bg-[var(--state-info)] text-[var(--state-on-info-container)] rounded-lg transition-colors font-medium disabled:bg-[var(--surface-container-high)] disabled:text-[var(--muted-foreground)] disabled:border-transparent disabled:opacity-60 disabled:cursor-not-allowed"
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
 <div className="bg-[var(--surface-container-high)] text-[var(--foreground)] border-[var(--border)]  rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col ">
 {/* Header */}
 <div className="p-6 border-b border-[var(--border)]  flex items-start justify-between">
 <div>
 <h3 className="text-xl font-bold text-[var(--foreground)]  mb-1">Activity Report</h3>
 <p className="text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">
 {selectedLocation?.name} • {new Date(reportStartDate).toLocaleDateString()} - {new Date(reportEndDate).toLocaleDateString()}
 </p>
 </div>
 <button
 onClick={() => setShowReportDialog(false)}
 className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
 >
 <X size={24} />
 </button>
 </div>

 {/* Report Summary */}
 <div className="p-6 border-b border-[var(--border)]  bg-[var(--surface-container-lowest)] dark:bg-[var(--surface-container)]">
 <div className="grid grid-cols-3 gap-4">
 <div className="text-center">
 <p className="text-2xl font-bold text-[var(--foreground)] ">{reportData.length}</p>
 <p className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] mt-1">Total Events</p>
 </div>
 <div className="text-center">
 <p className="text-2xl font-bold text-[var(--state-warning)]">{reportData.filter(e => e.type === 'Status Change').length}</p>
 <p className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] mt-1">Status Changes</p>
 </div>
 <div className="text-center">
 <p className="text-2xl font-bold text-[var(--state-info)]">{reportData.filter(e => e.type === 'Inventory Change').length}</p>
 <p className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] mt-1">Inventory Changes</p>
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
 ? 'border-[var(--state-warning)]/40 bg-[var(--state-warning)]/5'
 : 'border-[var(--state-info)]/40 bg-[var(--state-info)]/5'
 }`}
 >
 <div className="flex items-start justify-between mb-2">
 <div className="flex items-center gap-2">
 {event.type === 'Status Change' ? (
 <div className="w-8 h-8 bg-[var(--state-warning)]/20 rounded-lg flex items-center justify-center">
 <AlertCircle size={16} className="text-[var(--state-warning)]" />
 </div>
 ) : (
 <div className="w-8 h-8 bg-[var(--state-info)]/20 rounded-lg flex items-center justify-center">
 <Package size={16} className="text-[var(--state-info)]" />
 </div>
 )}
 <div>
 <h5 className={`text-sm font-semibold ${
 event.type === 'Status Change' ? 'text-[var(--state-warning)]' : 'text-[var(--state-info)]'
 }`}>
 {event.type}
 </h5>
 <p className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">
 {event.date.toLocaleString()} • by {event.user}
 </p>
 </div>
 </div>
 </div>
 
 {event.type === 'Status Change' ? (
 <div className="ml-10 flex items-center gap-2 text-sm">
 <span className="text-[var(--muted-foreground)]">{event.oldValue}</span>
 <span className="text-[var(--muted-foreground)]">→</span>
 <span className="text-[var(--foreground)] font-medium">{event.newValue}</span>
 </div>
 ) : (
 <div className="ml-10 space-y-1">
 <div className="flex items-center gap-2 text-sm">
 <span className="text-[var(--muted-foreground)]">Item:</span>
 <span className="text-[var(--foreground)] font-medium">{event.item}</span>
 </div>
 <div className="flex items-center gap-2 text-sm">
 <span className="text-[var(--muted-foreground)]">Quantity:</span>
 <span className="text-[var(--muted-foreground)]">{event.oldQty}</span>
 <span className="text-[var(--muted-foreground)]">→</span>
 <span className="text-[var(--foreground)] font-medium">{event.newQty}</span>
 <span className={`ml-2 px-2 py-0.5 rounded text-xs font-semibold ${
 event.change.startsWith('+')
 ? 'bg-[var(--state-success-container)] text-[var(--state-success)]'
 : 'bg-[var(--state-error)]/20 text-[var(--state-error)]'
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
 <BarChart3 size={48} className="mx-auto mb-3 text-[var(--muted-foreground)]" />
 <p className="text-[var(--muted-foreground)]">No activity found in the selected date range</p>
 </div>
 )}
 </div>

 {/* Footer */}
 <div className="p-6 border-t border-[var(--border)]  flex gap-3">
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
 className="px-4 py-2 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] text-[var(--foreground)] rounded-lg transition-colors flex items-center gap-2"
 >
 <Download size={16} />
 Export Report
 </button>
 <button
 onClick={() => setShowReportDialog(false)}
 className="ml-auto px-6 py-2 bg-[var(--state-info-container)] hover:bg-[var(--state-info)] text-[var(--state-on-info-container)] rounded-lg transition-colors font-medium"
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
 <div className="bg-[var(--surface-container-high)] text-[var(--foreground)] border-[var(--border)]  rounded-xl max-w-3xl w-full max-h-[90vh] flex flex-col ">
 {/* Header */}
 <div className="p-6 border-b border-[var(--border)] ">
 <div className="flex items-start justify-between mb-4">
 <div className="flex items-center gap-3">
 <div className="w-12 h-12 bg-[var(--state-error)]/20 rounded-full flex items-center justify-center">
 <AlertCircle size={24} className="text-[var(--state-error)]" />
 </div>
 <div>
 <h3 className="text-xl font-bold text-[var(--foreground)] ">Confirm Bulk Deletion</h3>
 <p className="text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">Review locations before deleting</p>
 </div>
 </div>
 <button
 onClick={() => setShowBulkDeleteConfirmation(false)}
 className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
 >
 <X size={24} />
 </button>
 </div>

 {/* Summary Stats */}
 <div className="grid grid-cols-3 gap-3">
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-lg p-3 text-center">
 <p className="text-2xl font-bold text-[var(--foreground)] ">{selectedLocationIds.size}</p>
 <p className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] mt-1">Total Selected</p>
 </div>
 <div className="bg-[var(--state-success-container)]/60 border border-[var(--state-success)]/30 rounded-lg p-3 text-center">
 <p className="text-2xl font-bold text-[var(--state-success)]">{locationsToDelete.length}</p>
 <p className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] mt-1">Can Delete</p>
 </div>
 <div className="bg-[var(--state-error)]/10 border border-[var(--state-error)]/40 rounded-lg p-3 text-center">
 <p className="text-2xl font-bold text-[var(--state-error)]">{locationsWithAllocations.length}</p>
 <p className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] mt-1">Cannot Delete</p>
 </div>
 </div>
 </div>

 {/* Content */}
 <div className="flex-1 overflow-y-auto p-6 space-y-6">
 {/* Locations to Delete */}
 {locationsToDelete.length > 0 && (
 <div>
 <div className="flex items-center gap-2 mb-3">
 <CheckCircle2 size={20} className="text-[var(--state-success)]" />
 <h4 className="text-lg font-semibold text-[var(--foreground)] ">Locations to Delete ({locationsToDelete.length})</h4>
 </div>
 <div className="space-y-2 max-h-64 overflow-y-auto">
 {locationsToDelete.map((location) => (
 <div
 key={location.id}
 className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg p-3 flex items-center gap-3"
 >
 <MapPin size={16} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 <div className="flex-1">
 <p className="text-sm font-semibold text-[var(--foreground)]  font-mono">{location.name}</p>
 <div className="flex items-center gap-3 mt-1">
 <span className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">{location.type}</span>
 <span className="text-xs text-[var(--muted-foreground)]">•</span>
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
 <AlertCircle size={20} className="text-[var(--state-error)]" />
 <h4 className="text-lg font-semibold text-[var(--foreground)] ">Cannot Delete ({locationsWithAllocations.length})</h4>
 </div>
 <div className="bg-[var(--state-error)]/10 border border-[var(--state-error)]/40 rounded-lg p-4 mb-3">
 <p className="text-sm text-[var(--state-error)]">
 The following locations have active allocations and cannot be deleted. Clear allocations first to delete these locations.
 </p>
 </div>
 <div className="space-y-2 max-h-64 overflow-y-auto">
 {locationsWithAllocations.map((location) => (
 <div
 key={location.id}
 className="bg-[var(--state-error)]/5 border border-[var(--state-error)]/40 rounded-lg p-3 flex items-center gap-3 opacity-60"
 >
 <MapPin size={16} className="text-[var(--state-error)]" />
 <div className="flex-1">
 <p className="text-sm font-semibold text-[var(--foreground)]  font-mono">{location.name}</p>
 <div className="flex items-center gap-3 mt-1">
 <span className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">{location.type}</span>
 <span className="text-xs text-[var(--muted-foreground)]">•</span>
 <span className={`text-xs ${getStatusColor(location.status)}`}>{location.status}</span>
 <span className="text-xs text-[var(--muted-foreground)]">•</span>
 <span className="text-xs text-[var(--state-error)]">Has Allocations</span>
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>
 )}
 </div>

 {/* Footer */}
 <div className="border-t border-[var(--border)]  p-6 flex items-center justify-between gap-3">
 <p className="text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">
 {locationsToDelete.length > 0 ? (
 <>This action cannot be undone</>
 ) : (
 <>No locations can be deleted</>
 )}
 </p>
 <div className="flex gap-3">
 <button
 onClick={() => setShowBulkDeleteConfirmation(false)}
 className="px-6 py-2 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] text-[var(--foreground)] rounded-lg transition-colors"
 >
 Cancel
 </button>
 {locationsToDelete.length > 0 && (
 <button
 onClick={confirmBulkDelete}
 className="px-6 py-2 bg-[var(--state-error)] hover:bg-[var(--state-error-container)] text-[var(--state-error-foreground)] rounded-lg transition-colors font-medium"
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

 {/* Bulk Move Confirmation Dialog */}
 {showBulkMoveDialog && (() => {
 // Get available destination locations (Racks and Shelves only - non-moveable locations)
 const availableDestinations = mockStorageLocations.filter(loc =>
 (loc.type === "Rack" || loc.type === "Shelf") && !selectedLocationIds.has(loc.id)
 );

 // Filter destinations based on search
 const filteredDestinations = availableDestinations.filter(loc =>
 loc.name.toLowerCase().includes(locationSearchTerm.toLowerCase()) ||
 loc.type.toLowerCase().includes(locationSearchTerm.toLowerCase())
 );

 return (
 <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
 <div className="bg-[var(--surface-container-high)] text-[var(--foreground)] border-[var(--border)]  rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col ">
 {/* Header */}
 <div className="p-6 border-b border-[var(--border)] ">
 <div className="flex items-start justify-between mb-4">
 <div className="flex items-center gap-3">
 <div className="w-12 h-12 bg-[var(--primary)]/20 /20 rounded-full flex items-center justify-center">
 <ArrowRightLeft size={24} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 </div>
 <div>
 <h3 className="text-xl font-bold text-[var(--foreground)] ">Move Containers</h3>
 <p className="text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">Select destination location for {selectedLocationIds.size} container{selectedLocationIds.size !== 1 ? 's' : ''}</p>
 </div>
 </div>
 <button
 onClick={() => setShowBulkMoveDialog(false)}
 className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
 >
 <X size={24} />
 </button>
 </div>
 </div>

 {/* Content */}
 <div className="flex-1 overflow-y-auto p-6 space-y-6">
 {/* Search Input */}
 <div>
 <label className="block text-sm font-medium text-[var(--foreground)] mb-3">
 Destination Location <span className="text-[var(--state-error)]">*</span>
 </label>
 <div className="relative mb-3">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" size={20} />
 <input
 type="text"
 placeholder="Search locations..."
 value={locationSearchTerm}
 onChange={(e) => setLocationSearchTerm(e.target.value)}
 className="w-full bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg pl-10 pr-4 py-3 text-[var(--foreground)] placeholder-zinc-500 focus:outline-none focus: focus:)] dark:focus:)] focus:border-transparent"
 />
 </div>

 {/* Destination List */}
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg max-h-80 overflow-y-auto">
 {filteredDestinations.length > 0 ? (
 filteredDestinations.map((location) => (
 <button
 key={location.id}
 onClick={() => setBulkMoveDestination(location.id)}
 className={`w-full p-4 text-left transition-colors border-b border-[var(--border)] /50 last:border-b-0 ${
 bulkMoveDestination === location.id
 ? (isV6 ? 'bg-[var(--primary)]/10 ring-1 ring-inset ring-[var(--primary)]' : 'bg-[var(--primary)]/20 /20 border-l-4 border-l-[var(--primary)] dark:border-l-[var(--primary)]')
 : 'hover:bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)]'
 }`}
 >
 <div className="flex items-center gap-3">
 <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
 bulkMoveDestination === location.id
 ? 'bg-[var(--primary)]/20 /20'
 : 'bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)]'
 }`}>
 <MapPin size={20} className={
 bulkMoveDestination === location.id
 ? 'text-[var(--primary)] dark:text-[var(--primary)]'
 : 'text-[var(--muted-foreground)]'
 } />
 </div>
 <div className="flex-1">
 <p className={`text-sm font-semibold font-mono ${
 bulkMoveDestination === location.id
 ? 'text-[var(--primary)] dark:text-[var(--primary)]'
 : 'text-white'
 }`}>
 {location.name}
 </p>
 <div className="flex items-center gap-3 mt-1">
 <span className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">{location.type}</span>
 <span className="text-xs text-[var(--muted-foreground)]">•</span>
 <span className={`text-xs ${getStatusColor(location.status)}`}>{location.status}</span>
 </div>
 </div>
 {bulkMoveDestination === location.id && (
 <CheckCircle2 size={20} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 )}
 </div>
 </button>
 ))
 ) : (
 <div className="p-8 text-center">
 <MapPin size={48} className="mx-auto mb-3 text-[var(--muted-foreground)]" />
 <p className="text-[var(--muted-foreground)] text-sm">No locations found</p>
 </div>
 )}
 </div>
 </div>

 {/* Info Box */}
 <div className="bg-[var(--state-info)]/10 border border-[var(--state-info)]/40 rounded-lg p-4">
 <div className="flex items-start gap-3">
 <Info size={20} className="text-[var(--state-info)] flex-shrink-0 mt-0.5" />
 <div>
 <p className="text-sm text-[var(--state-info)] font-medium mb-1">Move Information</p>
 <p className="text-xs text-[var(--state-info)]/70">
 Moving {selectedLocationIds.size} container{selectedLocationIds.size !== 1 ? 's' : ''} to the selected location.
 Only fixed locations (Racks and Shelves) can be selected as destinations.
 </p>
 </div>
 </div>
 </div>
 </div>

 {/* Footer */}
 <div className="border-t border-[var(--border)]  p-6 flex items-center justify-end gap-3">
 <button
 onClick={() => setShowBulkMoveDialog(false)}
 className="px-6 py-2 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] text-[var(--foreground)] rounded-lg transition-colors"
 >
 Cancel
 </button>
 <button
 onClick={confirmBulkMove}
 disabled={!bulkMoveDestination}
 className="px-6 py-2 bg-[var(--primary)]  hover:opacity-90 active:scale-[0.98] text-[var(--primary-foreground)] rounded-lg transition-colors font-medium disabled:bg-[var(--surface-container-high)] disabled:text-[var(--muted-foreground)] disabled:border-transparent disabled:opacity-60 disabled:cursor-not-allowed"
 >
 Confirm Move
 </button>
 </div>
 </div>
 </div>
 );
 })()}

 {/* Add Location Side Panel */}
 {showAddLocation && (
 <div className="fixed right-0 top-0 h-full w-[600px] bg-[var(--surface-container-low)] text-[var(--foreground)] border-l border-[var(--border)] shadow-2xl overflow-y-auto z-30 animate-in slide-in- duration-300">
 {addLocationStep === 'form' ? (
 <>
 {/* Header */}
 <div className="bg-[var(--surface-container-low)] text-[var(--foreground)] border-b border-[var(--border)] p-6 sticky top-0 z-10">
 <div className="flex items-start justify-between mb-4">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 bg-[var(--primary)]  rounded-lg flex items-center justify-center">
 <Plus size={20} className="text-[var(--foreground)]" />
 </div>
 <div>
 <h3 className="text-xl font-bold text-[var(--foreground)] ">Add Container</h3>
 <p className="text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">Create a new container</p>
 </div>
 </div>
 <button
 onClick={cancelAddLocation}
 className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
 >
 <X size={24} />
 </button>
 </div>
 </div>

 {/* Form */}
 <div className="p-6 space-y-6">
 {/* Container Type - Required */}
 <div>
 <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
 Container Type <span className="text-[var(--state-error)]">*</span>
 </label>
 <select
 value={newLocationData.type}
 onChange={(e) => setNewLocationData({ ...newLocationData, type: e.target.value })}
 className="w-full bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg px-4 py-3 text-[var(--foreground)] focus:outline-none focus: focus:)] dark:focus:)] focus:border-transparent"
 >
 <option value="">Select Type</option>
 <option value="Bin">Bin</option>
 <option value="Pallet">Pallet</option>
 <option value="Tray">Tray</option>
 <option value="Gaylord">Gaylord</option>
 <option value="Conventional">Conventional</option>
 </select>
 </div>

 {/* Container ID - Required */}
 <div>
 <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
 Container ID <span className="text-[var(--state-error)]">*</span>
 </label>
 <input
 type="text"
 value={newLocationData.id}
 onChange={(e) => setNewLocationData({ ...newLocationData, id: e.target.value })}
 placeholder="e.g., Zone1-A-01-02"
 className="w-full bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg px-4 py-3 text-[var(--foreground)] placeholder-zinc-500 focus:outline-none focus: focus:)] dark:focus:)] focus:border-transparent"
 />
 </div>

 {/* Parent Location - Optional */}
 <div>
 <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
 Parent Location <span className="text-[var(--muted-foreground)]">(Optional)</span>
 </label>
 <select
 value={newLocationData.parentLocation}
 onChange={(e) => setNewLocationData({ ...newLocationData, parentLocation: e.target.value })}
 className="w-full bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg px-4 py-3 text-[var(--foreground)] focus:outline-none focus: focus:)] dark:focus:)] focus:border-transparent"
 >
 <option value="">Select Parent Location</option>
 {Array.from(new Set(mockStorageLocations.map(loc => loc.parentStorage).filter(p => p !== '-'))).map(parent => (
 <option key={parent} value={parent}>{parent}</option>
 ))}
 </select>
 </div>

 {/* Info Box */}
 <div className="bg-[var(--state-info)]/10 border border-[var(--state-info)]/40 rounded-lg p-4">
 <div className="flex items-start gap-3">
 <Info size={20} className="text-[var(--state-info)] flex-shrink-0 mt-0.5" />
 <div>
 <p className="text-sm text-[var(--state-info)] font-medium mb-1">New Container Details</p>
 <p className="text-xs text-[var(--state-info)]/70">
 The new container will be created with status "Available" and can be configured further after creation.
 </p>
 </div>
 </div>
 </div>
 </div>

 {/* Footer */}
 <div className="sticky bottom-0 bg-[var(--surface-container-high)] text-[var(--foreground)] border-t border-[var(--border)]  p-6 flex items-center justify-end gap-3">
 <button
 onClick={cancelAddLocation}
 className="px-6 py-2 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] text-[var(--foreground)] rounded-lg transition-colors"
 >
 Cancel
 </button>
 <button
 onClick={handleSaveNewLocation}
 disabled={!newLocationData.type || !newLocationData.id}
 className="px-6 py-2 bg-[var(--primary)]  hover:opacity-90 active:scale-[0.98] text-[var(--primary-foreground)] rounded-lg transition-colors font-medium disabled:bg-[var(--surface-container-high)] disabled:text-[var(--muted-foreground)] disabled:border-transparent disabled:opacity-60 disabled:cursor-not-allowed"
 >
 Save
 </button>
 </div>
 </>
 ) : (
 <>
 {/* Confirmation Screen */}
 <div className="bg-[var(--surface-container-high)] text-[var(--foreground)] border-b border-[var(--border)]  p-6 sticky top-0 z-10">
 <div className="flex items-start justify-between mb-4">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 bg-[var(--state-warning)]/20 rounded-lg flex items-center justify-center">
 <AlertCircle size={20} className="text-[var(--state-warning)]" />
 </div>
 <div>
 <h3 className="text-xl font-bold text-[var(--foreground)] ">Confirm New Container</h3>
 <p className="text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">Review and confirm the details</p>
 </div>
 </div>
 <button
 onClick={cancelAddLocation}
 className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
 >
 <X size={24} />
 </button>
 </div>
 </div>

 {/* Confirmation Details */}
 <div className="p-6">
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg p-6 space-y-4">
 <div className="flex items-center gap-3 pb-4 border-b border-[var(--border)] ">
 <MapPin size={24} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 <div>
 <p className="text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">Container ID</p>
 <p className="text-lg font-bold text-[var(--foreground)]  font-mono">{newLocationData.id}</p>
 </div>
 </div>

 <div className="grid grid-cols-2 gap-4">
 <div>
 <p className="text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] mb-1">Type</p>
 <p className="text-[var(--foreground)] font-medium">{newLocationData.type}</p>
 </div>
 <div>
 <p className="text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] mb-1">Status</p>
 <div className="flex items-center gap-2">
 <CheckCircle2 size={16} className="text-[var(--state-success)]" />
 <span className="text-[var(--state-success)] font-medium">Available</span>
 </div>
 </div>
 </div>

 <div>
 <p className="text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] mb-1">Parent Location</p>
 <p className="text-[var(--foreground)] font-medium">{newLocationData.parentLocation || 'None'}</p>
 </div>
 </div>

 <div className="bg-[var(--state-warning)]/10 border border-[var(--state-warning)]/40 rounded-lg p-4 mt-6">
 <div className="flex items-start gap-3">
 <AlertCircle size={20} className="text-[var(--state-warning)] flex-shrink-0 mt-0.5" />
 <div>
 <p className="text-sm text-[var(--state-warning)] font-medium mb-1">Confirm Creation</p>
 <p className="text-xs text-[var(--state-warning)]/70">
 Are you sure you want to create this container? This action will add the location to your system.
 </p>
 </div>
 </div>
 </div>
 </div>

 {/* Footer */}
 <div className="sticky bottom-0 bg-[var(--surface-container-high)] text-[var(--foreground)] border-t border-[var(--border)]  p-6 flex items-center justify-end gap-3">
 <button
 onClick={() => setAddLocationStep('form')}
 className="px-6 py-2 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] text-[var(--foreground)] rounded-lg transition-colors"
 >
 Back
 </button>
 <button
 onClick={confirmAddLocation}
 className="px-6 py-2 bg-[var(--primary)]  hover:opacity-90 active:scale-[0.98] text-[var(--primary-foreground)] rounded-lg transition-colors font-medium"
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