import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { RefreshCw, Grid3x3, Package, Box, CheckCircle2, AlertCircle, Scan, List, X, ArrowLeft, ClipboardList, Flame, Plus, Minus, Check, Info, History, ChevronRight, ChevronLeft, Home, Trash2, Printer, GripVertical, Columns } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { WorkListDetailsPanel } from "../components/WorkListDetailsPanel";

// Type definitions
type WorkItem = {
  id: string;
  workList: string;
  type: string;
  status: string;
  priority: string;
  priorityDateTime: string;
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
};

type WorkLine = {
  id: string;
  workListId: string;
  workLine: string;
  priority: string;
  item: string;
  quantity: number;
  status: string;
  started: string;
  comment: string;
};

type WorkOperation = {
  id: string;
  workLineId: string;
  workOperation: string;
  type: string;
  destinationLocation: string;
  sourceLocation: string;
  status: string;
  started: string;
  comment: string;
};

type SortbarRegistration = {
  sortbarId: string;
  workListId: string;
  lpn?: string;
  registrationMethod: "list" | "lpn";
  itemCount: number;
  totalQuantity: number;
  items: ReplenItem[];
  processedItems: Map<string, number>;
  selectedItemId: string | null;
};

type ReplenItem = {
  id: string;
  sku: string;
  description: string;
  quantity: number;
  location: string;
  priority: string;
  containerName: string;
  compartmentLpn: string;
  binNumber: string;
  itemComment?: string;
  imageUrl?: string;
  compartmentConfig: { rows: number; cols: number };
};

type Compartment = {
  lpn: string;
  row: number;
  col: number;
};

// Mock data for sortbar locations
const initialSortbars = [
  { id: "SB-A1", name: "A1", zone: "Zone A", capacity: 24 },
  { id: "SB-A2", name: "A2", zone: "Zone A", capacity: 24 },
  { id: "SB-A3", name: "A3", zone: "Zone A", capacity: 32 },
  { id: "SB-A4", name: "A4", zone: "Zone A", capacity: 32 },
  { id: "SB-A5", name: "A5", zone: "Zone A", capacity: 24 },
  { id: "SB-A6", name: "A6", zone: "Zone A", capacity: 24 },
  { id: "SB-A7", name: "A7", zone: "Zone A", capacity: 32 },
  { id: "SB-A8", name: "A8", zone: "Zone A", capacity: 32 },
  { id: "SB-A9", name: "A9", zone: "Zone A", capacity: 24 },
  { id: "SB-A10", name: "A10", zone: "Zone A", capacity: 32 },
  { id: "SB-B1", name: "B1", zone: "Zone B", capacity: 32 },
  { id: "SB-B2", name: "B2", zone: "Zone B", capacity: 16 },
  { id: "SB-B3", name: "B3", zone: "Zone B", capacity: 16 },
  { id: "SB-B4", name: "B4", zone: "Zone B", capacity: 24 },
  { id: "SB-B5", name: "B5", zone: "Zone B", capacity: 24 },
  { id: "SB-B6", name: "B6", zone: "Zone B", capacity: 32 },
  { id: "SB-B7", name: "B7", zone: "Zone B", capacity: 32 },
  { id: "SB-B8", name: "B8", zone: "Zone B", capacity: 16 },
  { id: "SB-B9", name: "B9", zone: "Zone B", capacity: 24 },
  { id: "SB-B10", name: "B10", zone: "Zone B", capacity: 32 },
  { id: "SB-C1", name: "C1", zone: "Zone C", capacity: 32 },
  { id: "SB-C2", name: "C2", zone: "Zone C", capacity: 24 },
  { id: "SB-C3", name: "C3", zone: "Zone C", capacity: 24 },
  { id: "SB-C4", name: "C4", zone: "Zone C", capacity: 16 },
  { id: "SB-C5", name: "C5", zone: "Zone C", capacity: 32 },
  { id: "SB-C6", name: "C6", zone: "Zone C", capacity: 24 },
  { id: "SB-C7", name: "C7", zone: "Zone C", capacity: 32 },
  { id: "SB-C8", name: "C8", zone: "Zone C", capacity: 16 },
  { id: "SB-C9", name: "C9", zone: "Zone C", capacity: 24 },
  { id: "SB-C10", name: "C10", zone: "Zone C", capacity: 32 },
  { id: "SB-D1", name: "D1", zone: "Zone D", capacity: 24 },
  { id: "SB-D2", name: "D2", zone: "Zone D", capacity: 32 },
  { id: "SB-D3", name: "D3", zone: "Zone D", capacity: 24 },
  { id: "SB-D4", name: "D4", zone: "Zone D", capacity: 16 },
  { id: "SB-D5", name: "D5", zone: "Zone D", capacity: 32 },
  { id: "SB-D6", name: "D6", zone: "Zone D", capacity: 24 },
  { id: "SB-D7", name: "D7", zone: "Zone D", capacity: 32 },
  { id: "SB-D8", name: "D8", zone: "Zone D", capacity: 16 },
  { id: "SB-D9", name: "D9", zone: "Zone D", capacity: 24 },
  { id: "SB-D10", name: "D10", zone: "Zone D", capacity: 32 },
];

// Mock workstation history data - last 10 operations
const mockWorkstationHistory = [
  { id: 1, timestamp: "2024-03-16 14:35:22", operator: "John Smith", action: "Completed Work List", details: "WL-REP-001 - 8 items processed", status: "Success" },
  { id: 2, timestamp: "2024-03-16 14:30:15", operator: "John Smith", action: "Item Shorted", details: "ITM-5003 - Qty 25/30 (83%)", status: "Warning" },
  { id: 3, timestamp: "2024-03-16 14:22:08", operator: "John Smith", action: "Container Registered", details: "CNT-A-1234 on Sortbar A1", status: "Success" },
  { id: 4, timestamp: "2024-03-16 14:15:45", operator: "John Smith", action: "Work List Started", details: "WL-REP-001 - Replen A-Zone Morning", status: "Success" },
  { id: 5, timestamp: "2024-03-16 13:58:30", operator: "Sarah Johnson", action: "Sortbar Unregistered", details: "Sortbar B1 - Work completed", status: "Success" },
  { id: 6, timestamp: "2024-03-16 13:45:12", operator: "Sarah Johnson", action: "Item Completed", details: "ITM-7001 - Full qty 60/60 (100%)", status: "Success" },
  { id: 7, timestamp: "2024-03-16 13:30:55", operator: "Sarah Johnson", action: "Sortbar Registered", details: "Sortbar B1 - WL-REP-002", status: "Success" },
  { id: 8, timestamp: "2024-03-16 12:15:40", operator: "Mike Davis", action: "Work List Cancelled", details: "WL-REP-004 - User requested", status: "Warning" },
  { id: 9, timestamp: "2024-03-16 11:45:20", operator: "Mike Davis", action: "Container Registered", details: "CNT-B-5678 on Sortbar A2", status: "Success" },
  { id: 10, timestamp: "2024-03-16 11:20:05", operator: "Emily Chen", action: "Sortbar Registered", details: "Sortbar C1 - WL-REP-003", status: "Success" },
];

// Mock data for available replenishment work lists
const mockPickLists = [
  { id: "WL-PICK-001", name: "Pick A-Zone Morning", priority: "High", itemCount: 8, status: "Ready" },
  { id: "WL-PICK-002", name: "Pick B-Zone AM", priority: "Normal", itemCount: 8, status: "Ready" },
  { id: "WL-PICK-003", name: "Pick C-Zone Priority", priority: "High", itemCount: 8, status: "Ready" },
  { id: "WL-PICK-004", name: "Pick Multi-Zone", priority: "Normal", itemCount: 8, status: "Ready" },
  { id: "WL-PICK-005", name: "Pick Express", priority: "High", itemCount: 8, status: "Ready" },
  { id: "WL-PICK-006", name: "Pick External A3", priority: "Normal", itemCount: 8, status: "In Progress" },
  { id: "WL-PICK-007", name: "Pick External C3", priority: "High", itemCount: 8, status: "In Progress" },
];

// Generate mock work list detail
const generateWorkListDetail = (listId: string): WorkItem => {
  const listData = mockPickLists.find(l => l.id === listId);
  return {
    id: listId,
    workList: listId,
    type: "Pick",
    status: "In Progress",
    priority: listData?.priority || "Normal",
    priorityDateTime: "2024-03-16 08:30",
    isHot: listData?.priority === "High",
    attribute1: "Zone A",
    attribute2: "Q1 2024",
    attribute3: "Morning Shift",
    attribute4: "Active",
    attribute5: "Standard",
    subType: "Wave",
    started: "2024-03-16 08:15",
    storage: "A-01-02",
    destination: "Sortbar",
    created: "2024-03-16 07:00",
    modified: "2024-03-16 08:30",
  };
};

// Generate mock work lines
const generateWorkLines = (workListId: string): WorkLine[] => {
  return [
    { id: "1", workListId, workLine: "WL-001", priority: "High", item: "ITM-5001", quantity: 50, status: "In Progress", started: "2024-03-16 08:15", comment: "Urgent replen" },
    { id: "2", workListId, workLine: "WL-002", priority: "Normal", item: "ITM-5002", quantity: 75, status: "Queued", started: "", comment: "" },
    { id: "3", workListId, workLine: "WL-003", priority: "High", item: "ITM-5003", quantity: 30, status: "Queued", started: "", comment: "Low stock alert" },
    { id: "4", workListId, workLine: "WL-004", priority: "Normal", item: "ITM-6001", quantity: 100, status: "Queued", started: "", comment: "" },
    { id: "5", workListId, workLine: "WL-005", priority: "High", item: "ITM-6002", quantity: 45, status: "Queued", started: "", comment: "Express order" },
    { id: "6", workListId, workLine: "WL-006", priority: "Normal", item: "ITM-7001", quantity: 60, status: "Queued", started: "", comment: "" },
    { id: "7", workListId, workLine: "WL-007", priority: "Normal", item: "ITM-7002", quantity: 25, status: "Queued", started: "", comment: "" },
    { id: "8", workListId, workLine: "WL-008", priority: "High", item: "ITM-8001", quantity: 90, status: "Queued", started: "", comment: "High demand item" },
  ];
};

// Generate mock work operations for work lines
const generateWorkOperations = (workLines: WorkLine[]): WorkOperation[] => {
  const operations: WorkOperation[] = [];
  const types = ["Pick", "Put", "Move", "Count", "Pack"];
  const statuses = ["Queued", "In Progress", "Completed"];

  const aisles = ["AISLE-01", "AISLE-02", "AISLE-03", "AISLE-04", "AISLE-05"];
  const bins = ["BIN-A1", "BIN-A2", "BIN-B1", "BIN-B2", "BIN-C1", "BIN-C2"];
  const locations = aisles.flatMap(aisle => bins.map(bin => `${aisle}-${bin}`));
  const stations = ["PACK-01", "PACK-02", "QC-STATION-A", "STAGING-A", "STAGING-B"];

  const comments = ["In progress", "Standard operation", "Priority task", "Quality check required", ""];

  workLines.forEach((workLine, wlIndex) => {
    const opsPerLine = Math.floor(Math.random() * 3) + 2; // 2-4 operations per work line

    for (let i = 0; i < opsPerLine; i++) {
      const opStatus = workLine.status === "Completed" ? "Completed" :
                      workLine.status === "In Progress" && i === 0 ? "In Progress" :
                      "Queued";

      const hasStarted = opStatus === "In Progress" || opStatus === "Completed";
      const startDate = hasStarted ? `2024-03-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')} ${String(Math.floor(Math.random() * 16) + 6).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}` : "";

      operations.push({
        id: `WO-${wlIndex + 1}-${i + 1}`,
        workLineId: workLine.workLine,
        workOperation: `WO-${String((wlIndex * 10) + i + 1).padStart(3, '0')}`,
        type: types[Math.floor(Math.random() * types.length)],
        destinationLocation: Math.random() > 0.5 ? locations[Math.floor(Math.random() * locations.length)] : stations[Math.floor(Math.random() * stations.length)],
        sourceLocation: locations[Math.floor(Math.random() * locations.length)],
        status: opStatus,
        started: startDate,
        comment: comments[Math.floor(Math.random() * comments.length)]
      });
    }
  });

  return operations;
};

// Mock data for items (shown after registration)
const generateMockItems = (listId: string): ReplenItem[] => {
  const binNumbers = ["BIN-A-12-03", "BIN-A-14-05", "BIN-B-08-02", "BIN-B-10-07", "BIN-C-05-01", "BIN-A-18-04", "BIN-B-12-06", "BIN-C-09-03"];
  const comments = ["Handle with care", "Fragile item", "Check expiration date", "Count carefully", "Priority shipment", "Quality check needed", "Customer request", "Rush order"];
  const images = [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400",
    "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400",
    "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400",
    "https://images.unsplash.com/photo-1503602642458-232111445657?w=400",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
  ];

  // Different compartment configurations for variety
  const compartmentConfigs = [
    { rows: 1, cols: 1 },  // 1 compartment
    { rows: 1, cols: 2 },  // 2 compartments
    { rows: 2, cols: 2 },  // 4 compartments
    { rows: 2, cols: 3 },  // 6 compartments
    { rows: 2, cols: 4 },  // 8 compartments
    { rows: 3, cols: 4 },  // 12 compartments
    { rows: 4, cols: 3 },  // 12 compartments (different orientation)
    { rows: 6, cols: 3 },  // 18 compartments
  ];

  const allItems = [
    { id: "ITM-001", sku: "SKU-12345", description: "Widget A - Blue", quantity: 8, location: "A-12-03", priority: "High", containerName: "CONT-A-001", compartmentLpn: "LPN-A-001-C01", binNumber: binNumbers[0], itemComment: comments[0], imageUrl: images[0], compartmentConfig: compartmentConfigs[0] },
    { id: "ITM-002", sku: "SKU-12346", description: "Widget B - Red", quantity: 12, location: "A-14-05", priority: "Normal", containerName: "CONT-A-002", compartmentLpn: "LPN-A-002-C01", binNumber: binNumbers[1], itemComment: comments[1], imageUrl: images[1], compartmentConfig: compartmentConfigs[1] },
    { id: "ITM-003", sku: "SKU-12347", description: "Gadget C - Green", quantity: 5, location: "B-08-02", priority: "High", containerName: "CONT-B-001", compartmentLpn: "LPN-B-001-C03", binNumber: binNumbers[2], itemComment: comments[2], imageUrl: images[2], compartmentConfig: compartmentConfigs[2] },
    { id: "ITM-004", sku: "SKU-12348", description: "Tool D - Black", quantity: 15, location: "B-10-07", priority: "Normal", containerName: "CONT-B-002", compartmentLpn: "LPN-B-002-C04", binNumber: binNumbers[3], itemComment: comments[3], imageUrl: images[3], compartmentConfig: compartmentConfigs[3] },
    { id: "ITM-005", sku: "SKU-12349", description: "Part E - Silver", quantity: 7, location: "C-05-01", priority: "High", containerName: "CONT-C-001", compartmentLpn: "LPN-C-001-C05", binNumber: binNumbers[4], itemComment: comments[4], imageUrl: images[4], compartmentConfig: compartmentConfigs[4] },
    { id: "ITM-006", sku: "SKU-12350", description: "Component F - Yellow", quantity: 10, location: "A-18-04", priority: "Normal", containerName: "CONT-A-003", compartmentLpn: "LPN-A-003-C09", binNumber: binNumbers[5], itemComment: comments[5], imageUrl: images[5], compartmentConfig: compartmentConfigs[5] },
    { id: "ITM-007", sku: "SKU-12351", description: "Assembly G - Orange", quantity: 6, location: "B-12-06", priority: "High", containerName: "CONT-B-003", compartmentLpn: "LPN-B-003-C10", binNumber: binNumbers[6], itemComment: comments[6], imageUrl: images[6], compartmentConfig: compartmentConfigs[6] },
    { id: "ITM-008", sku: "SKU-12352", description: "Module H - Purple", quantity: 14, location: "C-09-03", priority: "Normal", containerName: "CONT-C-002", compartmentLpn: "LPN-C-002-C01", binNumber: binNumbers[7], itemComment: comments[7], imageUrl: images[7], compartmentConfig: compartmentConfigs[7] },
  ];

  // Generate a random number of items between 1 and 8
  const itemCount = Math.floor(Math.random() * 8) + 1;

  // Shuffle the array and take the first itemCount items
  const shuffled = [...allItems].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, itemCount);
};

// Generate compartments for a container based on configuration
const generateCompartments = (containerName: string, config: { rows: number; cols: number }): Compartment[] => {
  const compartments: Compartment[] = [];
  let compartmentNum = 1;

  for (let row = 0; row < config.rows; row++) {
    for (let col = 0; col < config.cols; col++) {
      const compartmentId = String(compartmentNum).padStart(2, '0');
      const containerPrefix = containerName.replace('CONT-', '');
      compartments.push({
        lpn: `LPN-${containerPrefix}-C${compartmentId}`,
        row,
        col,
      });
      compartmentNum++;
    }
  }

  return compartments;
};

// Generate initial pre-registered sortbars
const generateInitialRegistrations = (): SortbarRegistration[] => {
  // Pre-register A2 with WL-PICK-006
  const a2Items = generateMockItems("WL-PICK-006");
  const a2TotalQty = a2Items.reduce((sum, item) => sum + item.quantity, 0);

  return [
    {
      sortbarId: "SB-A2",
      workListId: "WL-PICK-006",
      lpn: "LPN-EXT-A2-001",
      registrationMethod: "list",
      itemCount: a2Items.length,
      totalQuantity: a2TotalQty,
      items: a2Items,
      processedItems: new Map(),
      selectedItemId: a2Items[0]?.id || null
    }
  ];
};

export function Pick() {
  const [selectedSortbar, setSelectedSortbar] = useState<string | null>(null);
  const [registrationMethod, setRegistrationMethod] = useState<"list" | "lpn" | null>(null);
  const [showListSelection, setShowListSelection] = useState(false);
  const [showLpnInput, setShowLpnInput] = useState(false);
  const [selectedList, setSelectedList] = useState<string | null>(null);
  const [lpnInput, setLpnInput] = useState("");
  const [items, setItems] = useState<ReplenItem[]>([]);
  const [sortbarRegistrations, setSortbarRegistrations] = useState<SortbarRegistration[]>(generateInitialRegistrations());
  const [showSortbarMenu, setShowSortbarMenu] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ReplenItem | null>(null);
  const [processedQuantity, setProcessedQuantity] = useState(0);
  const [isEditingQuantity, setIsEditingQuantity] = useState(false);
  const [quantityInput, setQuantityInput] = useState("");
  const [processedItems, setProcessedItems] = useState<Map<string, number>>(new Map());
  const [compartmentInventory, setCompartmentInventory] = useState<Map<string, number>>(new Map());
  const [showAdjustInventory, setShowAdjustInventory] = useState(false);
  const [adjustInventoryStep, setAdjustInventoryStep] = useState<"select-item" | "adjust-quantity" | "reason-code">("select-item");
  const [selectedAdjustItem, setSelectedAdjustItem] = useState<ReplenItem | null>(null);
  const [adjustInventoryDelta, setAdjustInventoryDelta] = useState(0);
  const [adjustInventoryReasonCode, setAdjustInventoryReasonCode] = useState("");
  const [showSkuVerification, setShowSkuVerification] = useState(false);
  const [skuVerificationInput, setSkuVerificationInput] = useState("");
  const [showChangeContainer, setShowChangeContainer] = useState(false);
  const [newContainerLpn, setNewContainerLpn] = useState("");
  const [containerAction, setContainerAction] = useState<"swap" | "split" | "change" | null>(null);
  const [currentContainerLpn, setCurrentContainerLpn] = useState("");
  const [originalContainerLpn, setOriginalContainerLpn] = useState("");
  const [showSwapPrompt, setShowSwapPrompt] = useState(false);
  const [completedPicks, setCompletedPicks] = useState<Array<{ completedAt: Date; duration: number }>>([]); // Track completed picks for rate calculation
  const [itemPickStartTime, setItemPickStartTime] = useState<Date | null>(null);
  const [completedPickLists, setCompletedPickLists] = useState<Array<{ completedAt: Date; duration: number; itemCount: number }>>([]); // Track completed pick lists
  const [pickListStartTime, setPickListStartTime] = useState<Date | null>(null);
  const [showCompletionConfirmation, setShowCompletionConfirmation] = useState(false);
  const [activeSortbar, setActiveSortbar] = useState<string | null>(null); // Track which sortbar is currently active/selected for viewing
  const [showNumberPad, setShowNumberPad] = useState(false);
  const [showLegend, setShowLegend] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [sortbarCount, setSortbarCount] = useState<2 | 5 | 8 | 10 | 16 | 40>(40);
  const [panelView, setPanelView] = useState<"menu" | "list" | "lpn" | "details">("menu"); // Track which view is shown in the right panel
  const [showReasonCodeModal, setShowReasonCodeModal] = useState(false);
  const [reasonCodeInput, setReasonCodeInput] = useState("");
  const [pendingShortItem, setPendingShortItem] = useState<ReplenItem | null>(null);
  const [itemNavigationHistory, setItemNavigationHistory] = useState<string[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);
  const [showCompartmentEmptyConfirm, setShowCompartmentEmptyConfirm] = useState(false);
  const [pendingCompartmentEmpty, setPendingCompartmentEmpty] = useState<{ item: ReplenItem; compartmentId: string } | null>(null);
  const [sectionOrder, setSectionOrder] = useState<string[]>(["sortbar", "item", "bin"]);
  const [layoutMode, setLayoutMode] = useState<"pick-port" | "pack-hold" | "pack-hold-horizontal">("pick-port");
  const [itemBinAssignments, setItemBinAssignments] = useState<Map<string, 1 | 2>>(new Map());
  const [binArrivals, setBinArrivals] = useState<Set<1 | 2>>(new Set([1])); // Track which bins have arrived (bin 1 starts as arrived)
  const [binArrivalTimers, setBinArrivalTimers] = useState<Map<1 | 2, NodeJS.Timeout>>(new Map());

  // Cleanup timers on unmount or when switching modes
  useEffect(() => {
    return () => {
      binArrivalTimers.forEach(timer => clearTimeout(timer));
    };
  }, []);

  // Reset bin arrivals when switching sortbars or layout modes
  useEffect(() => {
    setBinArrivals(new Set([1])); // Reset to only bin 1 arrived
    binArrivalTimers.forEach(timer => clearTimeout(timer));
    setBinArrivalTimers(new Map());
  }, [activeSortbar, layoutMode]);

  // Check if sortbar is registered
  const isRegistered = (sortbarId: string) => {
    return sortbarRegistrations.some(reg => reg.sortbarId === sortbarId);
  };

  // Get registration for a sortbar
  const getRegistration = (sortbarId: string) => {
    return sortbarRegistrations.find(reg => reg.sortbarId === sortbarId);
  };

  // Get sortbar status
  const getSortbarStatus = (sortbarId: string) => {
    // Set A6 to maintenance status
    if (sortbarId === "SB-A6") return "maintenance";
    return isRegistered(sortbarId) ? "in-use" : "available";
  };

  const handleSortbarSelect = (sortbarId: string) => {
    if (getSortbarStatus(sortbarId) === "maintenance") return;
    
    // Save current sortbar state before switching
    if (selectedSortbar && isRegistered(selectedSortbar)) {
      setSortbarRegistrations(sortbarRegistrations.map(reg => 
        reg.sortbarId === selectedSortbar
          ? { ...reg, items: [...items], processedItems: new Map(processedItems), selectedItemId: selectedItem?.id || null }
          : reg
      ));
    }
    
    setSelectedSortbar(sortbarId);
    setRegistrationMethod(null);
    setShowListSelection(false);
    setShowLpnInput(false);
    setPanelView("menu");

    // Set as active sortbar
    setActiveSortbar(sortbarId);

    // If registered, load its data and show menu by default
    const registration = getRegistration(sortbarId);
    if (registration) {
      setShowSortbarMenu(true);
      // panelView already set to "menu" above - show sortbar actions by default for registered sortbars
      setItems([...registration.items]);
      setSelectedList(registration.workListId);
      setProcessedItems(new Map(registration.processedItems));
      setCurrentContainerLpn(registration.lpn);
      setOriginalContainerLpn(registration.lpn);

      // Initialize compartment inventory
      const inventoryMap = new Map<string, number>();
      registration.items.forEach(item => {
        if (item.compartmentLpn) {
          // Randomly set compartment inventory to either match pick quantity or have extra
          // 50% chance it matches exactly, 50% chance it has 1-10 extra units
          const extraUnits = Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 10) + 1;
          inventoryMap.set(item.compartmentLpn, item.quantity + extraUnits);
        }
      });
      setCompartmentInventory(inventoryMap);

      // In Pack & Hold mode, pre-assign all items to bins if not already assigned
      if (layoutMode === "pack-hold" && registration.items.length > 0) {
        const needsAssignment = registration.items.some(item => !itemBinAssignments.has(item.id));

        if (needsAssignment) {
          const assignments = new Map(itemBinAssignments);
          registration.items.forEach(item => {
            if (!assignments.has(item.id)) {
              const bin = Math.random() < 0.5 ? 1 : 2;
              assignments.set(item.id, bin as 1 | 2);
            }
          });
          setItemBinAssignments(assignments);

          // Trigger arrival timer for the second bin if there are multiple unprocessed items
          const unprocessedItems = registration.items.filter(item => !registration.processedItems.has(item.id));
          if (unprocessedItems.length > 1) {
            const firstItem = registration.items.find(item => item.id === registration.selectedItemId) || registration.items[0];
            const firstItemBin = assignments.get(firstItem.id);
            const otherBin = firstItemBin === 1 ? 2 : 1;

            // Check if any unprocessed items are assigned to the other bin
            const hasItemsInOtherBin = unprocessedItems.some(item =>
              assignments.get(item.id) === otherBin && item.id !== firstItem.id
            );

            if (hasItemsInOtherBin && !binArrivalTimers.has(otherBin)) {
              const timer = setTimeout(() => {
                setBinArrivals(prev => new Set(prev).add(otherBin));
                setBinArrivalTimers(prev => {
                  const newMap = new Map(prev);
                  newMap.delete(otherBin);
                  return newMap;
                });
              }, 5000);

              setBinArrivalTimers(prev => new Map(prev).set(otherBin, timer));
            }
          }
        }
      }

      // Load previously selected item or first item
      const targetItem = registration.items.find(item => item.id === registration.selectedItemId) || registration.items[0];
      if (targetItem) {
        // In Pack & Hold mode, use handleItemSelect to ensure bin assignment
        if (layoutMode === "pack-hold") {
          handleItemSelect(targetItem);
        } else {
          setSelectedItem(targetItem);
          setProcessedQuantity(registration.processedItems.get(targetItem.id) ?? targetItem.quantity);
          // Start timing if not already processed
          if (!registration.processedItems.has(targetItem.id)) {
            setItemPickStartTime(new Date());
          }
        }
      }
    } else {
      // Not registered - automatically go to list selection for Pick
      setShowSortbarMenu(true);
      setPanelView("list");  // Skip registration method selection, go straight to list
      setRegistrationMethod("list");  // Set to list method automatically
      setItems([]);
      setSelectedList(null);
      setSelectedItem(null);
      setProcessedQuantity(0);
      setProcessedItems(new Map());
    }
  };

  const handleCloseSortbarMenu = () => {
    setShowSortbarMenu(false);
    setSelectedSortbar(null);
    setPanelView("menu");
  };

  const handleRegistrationMethodSelect = (method: "list" | "lpn") => {
    setRegistrationMethod(method);
    if (method === "list") {
      setPanelView("list");
    } else {
      setPanelView("lpn");
    }
  };

  const handleListSelect = (listId: string) => {
    setSelectedList(listId);
    // After selecting list, prompt for LPN (what user will pick into)
    setPanelView("lpn");
  };

  const handleLpnSubmit = () => {
    if (lpnInput.trim() && selectedSortbar && selectedList) {
      // Complete registration with both work list and LPN
      const itemsList = generateMockItems(selectedList);

      // Ensure all items have compartmentLpn
      const itemsWithCompartments = itemsList.map(item => ({
        ...item,
        compartmentLpn: item.compartmentLpn || `${item.containerName.replace('CONT-', 'LPN-')}-C01`
      }));

      setItems(itemsWithCompartments);
      setProcessedItems(new Map());

      // Initialize compartment inventory
      const inventoryMap = new Map<string, number>();
      itemsWithCompartments.forEach(item => {
        // Randomly set compartment inventory to either match pick quantity or have extra
        // 50% chance it matches exactly, 50% chance it has 1-10 extra units
        const extraUnits = Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 10) + 1;
        inventoryMap.set(item.compartmentLpn, item.quantity + extraUnits);
      });
      setCompartmentInventory(inventoryMap);

      // In Pack & Hold mode, pre-assign all items to bins randomly
      if (layoutMode === "pack-hold" && itemsWithCompartments.length > 0) {
        const assignments = new Map<string, 1 | 2>();
        itemsWithCompartments.forEach(item => {
          const bin = Math.random() < 0.5 ? 1 : 2;
          assignments.set(item.id, bin as 1 | 2);
        });
        setItemBinAssignments(assignments);

        // Trigger arrival timer for the second bin if there are multiple items
        if (itemsWithCompartments.length > 1) {
          const firstItemBin = assignments.get(itemsWithCompartments[0].id);
          const otherBin = firstItemBin === 1 ? 2 : 1;

          // Check if any items are assigned to the other bin
          const hasItemsInOtherBin = itemsWithCompartments.some(item =>
            assignments.get(item.id) === otherBin
          );

          if (hasItemsInOtherBin && !binArrivalTimers.has(otherBin)) {
            const timer = setTimeout(() => {
              setBinArrivals(prev => new Set(prev).add(otherBin));
              setBinArrivalTimers(prev => {
                const newMap = new Map(prev);
                newMap.delete(otherBin);
                return newMap;
              });
            }, 5000);

            setBinArrivalTimers(prev => new Map(prev).set(otherBin, timer));
          }
        }
      }

      // Auto-select first item
      if (itemsWithCompartments.length > 0) {
        handleItemSelect(itemsWithCompartments[0]);
      }

      // Start timing for pick list
      setPickListStartTime(new Date());

      // Add to registrations
      const sortbarData = initialSortbars.find(s => s.id === selectedSortbar);
      const listData = mockPickLists.find(l => l.id === selectedList);
      const totalQty = itemsWithCompartments.reduce((sum, item) => sum + item.quantity, 0);

      setSortbarRegistrations([
        ...sortbarRegistrations,
        {
          sortbarId: selectedSortbar,
          workListId: selectedList,
          lpn: lpnInput,
          registrationMethod: "list",
          itemCount: itemsWithCompartments.length,
          totalQuantity: totalQty,
          items: itemsWithCompartments,
          processedItems: new Map(),
          selectedItemId: itemsWithCompartments[0]?.id || null
        }
      ]);

      // Set as active sortbar
      setActiveSortbar(selectedSortbar);

      // Initialize container LPNs
      setCurrentContainerLpn(lpnInput);
      setOriginalContainerLpn(lpnInput);
      setContainerAction(null);

      // Show success toast
      toast.success("Pick Registered", {
        description: `${sortbarData?.name} - List: ${listData?.name} - LPN: ${lpnInput}`,
        duration: 5000,
        style: {
          background: 'rgb(22 163 74)',
          color: 'white',
          border: '2px solid rgb(21 128 61)',
          fontSize: '1.125rem',
          padding: '1rem 1.5rem',
        },
      });

      // Close the sortbar menu after registration
      setPanelView("menu");
      setLpnInput("");
      setShowSortbarMenu(false);
      setSelectedSortbar(null);
    }
  };

  const handleShowDetails = () => {
    setPanelView("details");
  };

  const handleUnregister = () => {
    if (selectedSortbar) {
      setSortbarRegistrations(sortbarRegistrations.filter(reg => reg.sortbarId !== selectedSortbar));
      setItems([]);
      setSelectedList(null);
      setLpnInput("");
      setSelectedItem(null);
      setProcessedQuantity(0);
      setProcessedItems(new Map());
      setActiveSortbar(null);
      setShowSortbarMenu(false);
      setSelectedSortbar(null);
      
      toast.success("Sortbar Unregistered", {
        description: "The sortbar has been successfully unregistered",
        duration: 3000,
        style: {
          background: 'rgb(22 163 74)',
          color: 'white',
          border: '2px solid rgb(21 128 61)',
          fontSize: '1.125rem',
          padding: '1rem 1.5rem',
        },
      });
    }
  };

  const handleItemSelect = (item: ReplenItem, fromNavigation = false) => {
    setSelectedItem(item);
    // Load previously processed quantity if exists, otherwise default to item's quantity
    setProcessedQuantity(processedItems.get(item.id) ?? item.quantity);
    setIsEditingQuantity(false);
    // Start timing for this item if not already processed
    if (!processedItems.has(item.id)) {
      setItemPickStartTime(new Date());
    }

    // In Pack & Hold mode, check if we need to trigger arrival for the other bin when moving to next item
    if (layoutMode === "pack-hold") {
      const currentBin = itemBinAssignments.get(item.id);

      if (currentBin) {
        const otherBin = currentBin === 1 ? 2 : 1;

        // Check if there are remaining unprocessed items assigned to the other bin
        const remainingItemsInOtherBin = items.filter(i =>
          i.id !== item.id &&
          !processedItems.has(i.id) &&
          itemBinAssignments.get(i.id) === otherBin
        );

        if (remainingItemsInOtherBin.length > 0 && !binArrivals.has(otherBin) && !binArrivalTimers.has(otherBin)) {
          // Set a 5-second timer for the other bin to arrive
          const timer = setTimeout(() => {
            setBinArrivals(prev => new Set(prev).add(otherBin));
            setBinArrivalTimers(prev => {
              const newMap = new Map(prev);
              newMap.delete(otherBin);
              return newMap;
            });
          }, 5000);

          setBinArrivalTimers(prev => new Map(prev).set(otherBin, timer));
        }
      }
    }

    // Track navigation history only if not navigating via back/forward
    if (!fromNavigation) {
      setItemNavigationHistory(prev => [...prev.slice(0, currentHistoryIndex + 1), item.id]);
      setCurrentHistoryIndex(prev => prev + 1);
    }

    // Update the sortbar registration's selectedItemId
    if (activeSortbar) {
      setSortbarRegistrations(prev => prev.map(reg => {
        if (reg.sortbarId === activeSortbar) {
          return {
            ...reg,
            selectedItemId: item.id
          };
        }
        return reg;
      }));
    }
  };

  const handleQuantityIncrease = () => {
    if (selectedItem && processedQuantity < selectedItem.quantity) {
      setProcessedQuantity(processedQuantity + 1);
    }
  };

  const handleQuantityDecrease = () => {
    if (processedQuantity > 0) {
      setProcessedQuantity(processedQuantity - 1);
    }
  };

  const handleQuantityClick = () => {
    setQuantityInput(processedQuantity.toString());
    setShowNumberPad(true);
  };

  const handleNumberPadInput = (digit: string) => {
    if (digit === 'backspace') {
      setQuantityInput(prev => prev.slice(0, -1));
    } else if (digit === 'clear') {
      setQuantityInput("");
    } else {
      const newValue = quantityInput + digit;
      const numValue = parseInt(newValue) || 0;
      if (selectedItem && numValue >= 0 && numValue <= selectedItem.quantity) {
        setQuantityInput(newValue);
      }
    }
  };

  const handleNumberPadConfirm = () => {
    const numValue = parseInt(quantityInput) || 0;
    setProcessedQuantity(numValue);
    setShowNumberPad(false);
  };

  const handleNumberPadCancel = () => {
    setShowNumberPad(false);
  };

  const handleQuantityInputChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    if (selectedItem && numValue >= 0 && numValue <= selectedItem.quantity) {
      setQuantityInput(value);
    }
  };

  const handleQuantityInputBlur = () => {
    const numValue = parseInt(quantityInput) || 0;
    setProcessedQuantity(numValue);
    setIsEditingQuantity(false);
  };

  const handleNextOrConfirm = () => {
    // Show SKU verification modal instead of proceeding directly
    setShowSkuVerification(true);
    setSkuVerificationInput("");
  };

  const handleSkuVerificationSubmit = () => {
    if (!selectedItem) return;

    // Check if SKU matches (case-insensitive)
    if (skuVerificationInput.trim().toUpperCase() === selectedItem.sku.toUpperCase()) {
      // SKU matches - proceed
      setShowSkuVerification(false);
      setSkuVerificationInput("");

      // Check if compartment is now empty
      const compartmentQty = compartmentInventory.get(selectedItem.compartmentLpn) || 0;
      if (processedQuantity === compartmentQty && compartmentQty > 0) {
        // Compartment is now empty - ask for confirmation
        setPendingCompartmentEmpty({
          item: selectedItem,
          compartmentId: selectedItem.compartmentLpn.split('-').pop() || ''
        });
        setShowCompartmentEmptyConfirm(true);
        return; // Wait for user confirmation before proceeding
      }

      // Check if item is being shorted
      if (processedQuantity < selectedItem.quantity) {
        // Item is shorted - show reason code modal
        setPendingShortItem(selectedItem);
        setShowReasonCodeModal(true);
        setReasonCodeInput("");
      } else if (containerAction === "swap") {
        // Check if we're in swap mode
        setShowSwapPrompt(true);
      } else {
        // Proceed normally (includes split and change modes)
        proceedToNextItem();
      }
    } else {
      // SKU does not match - show error and return to pick screen
      toast.error("SKU Mismatch", {
        description: `Expected ${selectedItem.sku}, but received ${skuVerificationInput.trim() || '(empty)'}. Please pick the correct item.`,
        duration: 5000,
        style: {
          background: 'rgb(220 38 38)',
          color: 'white',
          border: '2px solid rgb(185 28 28)',
          fontSize: '1.125rem',
          padding: '1rem 1.5rem',
        },
      });
      setShowSkuVerification(false);
      setSkuVerificationInput("");
    }
  };

  const handleSkuVerificationCancel = () => {
    setShowSkuVerification(false);
    setSkuVerificationInput("");
  };

  const handleCompleteConfirmation = () => {
    // Calculate pick list duration if we have a start time
    if (pickListStartTime) {
      const duration = Math.round((new Date().getTime() - pickListStartTime.getTime()) / 1000);
      const itemCount = items.length;
      setCompletedPickLists(prev => [...prev, { completedAt: new Date(), duration, itemCount }]);
      setPickListStartTime(null);
    }

    setShowCompletionConfirmation(false);

    // Remove current sortbar from registrations
    const remainingRegistrations = activeSortbar
      ? sortbarRegistrations.filter(reg => reg.sortbarId !== activeSortbar)
      : sortbarRegistrations;

    setSortbarRegistrations(remainingRegistrations);

    // Check if there are other registered sortbars
    if (remainingRegistrations.length > 0) {
      // Transition to the next registered sortbar
      const nextRegistration = remainingRegistrations[0];

      // Set up the next pick list
      setActiveSortbar(nextRegistration.sortbarId);
      setSelectedSortbar(nextRegistration.sortbarId);
      setSelectedList(nextRegistration.workListId);
      setItems(nextRegistration.items);
      setProcessedItems(nextRegistration.processedItems);

      // Initialize compartment inventory for next list
      const inventoryMap = new Map<string, number>();
      nextRegistration.items.forEach(item => {
        // Randomly set compartment inventory to either match pick quantity or have extra
        // 50% chance it matches exactly, 50% chance it has 1-10 extra units
        const extraUnits = Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 10) + 1;
        inventoryMap.set(item.compartmentLpn, item.quantity + extraUnits);
      });
      setCompartmentInventory(inventoryMap);

      // Set container LPNs
      if (nextRegistration.lpn) {
        setCurrentContainerLpn(nextRegistration.lpn);
        setOriginalContainerLpn(nextRegistration.lpn);
      }
      setContainerAction(null);

      // Select first item or previously selected item
      const itemToSelect = nextRegistration.selectedItemId
        ? nextRegistration.items.find(i => i.id === nextRegistration.selectedItemId)
        : nextRegistration.items[0];

      if (itemToSelect) {
        // Reset navigation history for new pick list
        setItemNavigationHistory([]);
        setCurrentHistoryIndex(-1);
        handleItemSelect(itemToSelect);
      }

      // Start timing for next pick list
      setPickListStartTime(new Date());

      toast.success("Transitioning to Next Pick List", {
        description: `Now picking: ${nextRegistration.workListId}`,
        duration: 3000,
      });
    } else {
      // No more registered sortbars - reset everything
      setProcessedItems(new Map());
      setItems([]);
      setSelectedItem(null);
      setProcessedQuantity(0);
      setSelectedSortbar(null);
      setSelectedList(null);
      setActiveSortbar(null);
      setCurrentContainerLpn("");
      setOriginalContainerLpn("");
      setContainerAction(null);

      toast.success("All Pick Lists Completed", {
        description: "No more registered pick lists",
        duration: 3000,
      });
    }
  };

  const handleAdjustInventoryClick = () => {
    setAdjustInventoryStep("select-item");
    setSelectedAdjustItem(null);
    setAdjustInventoryDelta(0);
    setAdjustInventoryReasonCode("");
    setShowAdjustInventory(true);
  };

  const handleAdjustItemSelect = (item: ReplenItem) => {
    setSelectedAdjustItem(item);
    setAdjustInventoryDelta(0);
    setAdjustInventoryStep("adjust-quantity");
  };

  const handleAdjustQuantityConfirm = () => {
    if (selectedAdjustItem && adjustInventoryDelta !== 0) {
      setAdjustInventoryStep("reason-code");
      setAdjustInventoryReasonCode("");
    }
  };

  const handleAdjustInventoryFinalConfirm = () => {
    if (selectedAdjustItem && adjustInventoryReasonCode.trim()) {
      const currentQty = compartmentInventory.get(selectedAdjustItem.compartmentLpn) || 0;
      const newQty = currentQty + adjustInventoryDelta;
      const updatedInventory = new Map(compartmentInventory);
      updatedInventory.set(selectedAdjustItem.compartmentLpn, newQty);
      setCompartmentInventory(updatedInventory);

      toast.success("Inventory Adjusted", {
        description: `${selectedAdjustItem.compartmentLpn.split('-').pop()}: ${currentQty} ${adjustInventoryDelta > 0 ? '+' : ''}${adjustInventoryDelta} = ${newQty} units`,
      });

      setShowAdjustInventory(false);
      setSelectedAdjustItem(null);
      setAdjustInventoryDelta(0);
      setAdjustInventoryReasonCode("");
      setAdjustInventoryStep("select-item");
    }
  };

  const handleAdjustInventoryCancel = () => {
    setShowAdjustInventory(false);
    setSelectedAdjustItem(null);
    setAdjustInventoryDelta(0);
    setAdjustInventoryReasonCode("");
    setAdjustInventoryStep("select-item");
  };

  const handleAdjustInventoryBack = () => {
    if (adjustInventoryStep === "reason-code") {
      setAdjustInventoryStep("adjust-quantity");
      setAdjustInventoryReasonCode("");
    } else if (adjustInventoryStep === "adjust-quantity") {
      setAdjustInventoryStep("select-item");
      setSelectedAdjustItem(null);
      setAdjustInventoryDelta(0);
    }
  };

  const handleChangeContainerClick = () => {
    setNewContainerLpn("");
    setShowChangeContainer(true);
  };

  const handleChangeContainerSubmit = (action: "swap" | "split" | "change") => {
    if (newContainerLpn.trim()) {
      // For split, we don't need to keep the action mode - just change container once
      setContainerAction(action === "split" ? null : action);
      setCurrentContainerLpn(newContainerLpn);
      setShowChangeContainer(false);

      toast.success(`Container ${action === "swap" ? "Swapped" : action === "split" ? "Split" : "Changed"}`, {
        description: `New container: ${newContainerLpn}`,
      });

      setNewContainerLpn("");
    }
  };

  const handleChangeContainerCancel = () => {
    setShowChangeContainer(false);
    setNewContainerLpn("");
  };

  const handleSwapContinue = (useNewContainer: boolean) => {
    setShowSwapPrompt(false);

    if (useNewContainer) {
      // Keep the current (new) container and stay in swap mode
      // containerAction remains "swap"
      proceedToNextItem();
    } else {
      // Return to original container and exit swap mode
      setCurrentContainerLpn(originalContainerLpn);
      setContainerAction(null);
      toast.success("Container Restored", {
        description: `Returning to original container: ${originalContainerLpn}`,
      });
      proceedToNextItem();
    }
  };

  const handleReasonCodeSubmit = () => {
    if (reasonCodeInput.trim()) {
      setShowReasonCodeModal(false);
      toast.warning("Item Shorted", {
        description: `Reason: ${reasonCodeInput}`,
      });
      setReasonCodeInput("");
      setPendingShortItem(null);

      // Now proceed with the normal flow
      if (containerAction === "swap") {
        setShowSwapPrompt(true);
      } else {
        proceedToNextItem();
      }
    }
  };

  const handleReasonCodeCancel = () => {
    setShowReasonCodeModal(false);
    setReasonCodeInput("");
    setPendingShortItem(null);
  };

  const handleCompartmentEmptyConfirm = (isEmpty: boolean) => {
    setShowCompartmentEmptyConfirm(false);

    if (isEmpty) {
      toast.success("Compartment Confirmed Empty", {
        description: `${pendingCompartmentEmpty?.compartmentId} confirmed empty`,
        duration: 2000,
      });
    } else {
      toast.info("Compartment Not Empty", {
        description: `${pendingCompartmentEmpty?.compartmentId} marked as not empty`,
        duration: 2000,
      });
    }

    setPendingCompartmentEmpty(null);

    // Continue with the normal flow
    if (selectedItem) {
      // Check if item is being shorted
      if (processedQuantity < selectedItem.quantity) {
        // Item is shorted - show reason code modal
        setPendingShortItem(selectedItem);
        setShowReasonCodeModal(true);
        setReasonCodeInput("");
      } else if (containerAction === "swap") {
        // Check if we're in swap mode
        setShowSwapPrompt(true);
      } else {
        // Proceed normally (includes split and change modes)
        proceedToNextItem();
      }
    }
  };

  const handleNavigateBack = () => {
    if (currentHistoryIndex > 0) {
      const newIndex = currentHistoryIndex - 1;
      const itemId = itemNavigationHistory[newIndex];
      const item = items.find(i => i.id === itemId);
      if (item) {
        setCurrentHistoryIndex(newIndex);
        handleItemSelect(item, true);
      }
    }
  };

  const handleNavigateForward = () => {
    if (currentHistoryIndex < itemNavigationHistory.length - 1) {
      const newIndex = currentHistoryIndex + 1;
      const itemId = itemNavigationHistory[newIndex];
      const item = items.find(i => i.id === itemId);
      if (item) {
        setCurrentHistoryIndex(newIndex);
        handleItemSelect(item, true);
      }
    }
  };

  const proceedToNextItem = () => {
    if (!selectedItem) return;

    // Calculate pick duration if we have a start time
    if (itemPickStartTime) {
      const duration = Math.round((new Date().getTime() - itemPickStartTime.getTime()) / 1000);
      setCompletedPicks(prev => [...prev, { completedAt: new Date(), duration }]);
      setItemPickStartTime(null);
    }

    // Save the processed quantity for this item
    const newProcessedItems = new Map(processedItems);
    newProcessedItems.set(selectedItem.id, processedQuantity);
    setProcessedItems(newProcessedItems);

    // Update the sortbar registration's processedItems and selectedItemId
    if (activeSortbar) {
      setSortbarRegistrations(prev => prev.map(reg => {
        if (reg.sortbarId === activeSortbar) {
          return {
            ...reg,
            processedItems: newProcessedItems,
            selectedItemId: selectedItem.id
          };
        }
        return reg;
      }));
    }

    // Find current index
    const currentIndex = items.findIndex(i => i.id === selectedItem.id);
    const isLastItem = currentIndex === items.length - 1;

    if (!isLastItem) {
      // Move to next item
      const nextItem = items[currentIndex + 1];
      handleItemSelect(nextItem);
    } else {
      // This is the last item - check if all items processed
      const allItemsProcessed = items.every(item =>
        newProcessedItems.has(item.id) && (newProcessedItems.get(item.id) || 0) > 0
      );

      if (!allItemsProcessed) {
        // Some items not processed - show warning
        const unprocessedItems = items.filter(item =>
          !newProcessedItems.has(item.id) || (newProcessedItems.get(item.id) || 0) === 0
        );
        toast.warning("Incomplete Pick", {
          description: `${unprocessedItems.length} item(s) have not been processed.`,
        });
      }

      // Show completion confirmation regardless
      setShowCompletionConfirmation(true);
    }
  };

  const selectedSortbarData = initialSortbars.find(sb => sb.id === selectedSortbar);
  const selectedListData = mockPickLists.find(list => list.id === selectedList);
  const currentRegistration = selectedSortbar ? getRegistration(selectedSortbar) : null;
  const workListDetail = selectedList ? generateWorkListDetail(selectedList) : null;
  const workLines = selectedList ? generateWorkLines(selectedList) : [];
  const workOperations = selectedList ? generateWorkOperations(workLines) : [];

  // Move section handler
  const moveSection = (dragIndex: number, hoverIndex: number) => {
    const newOrder = [...sectionOrder];
    const [removed] = newOrder.splice(dragIndex, 1);
    newOrder.splice(hoverIndex, 0, removed);
    setSectionOrder(newOrder);
  };

  // Draggable Section Component
  const DraggableSection = ({ id, index, children, className }: { id: string; index: number; children: React.ReactNode; className?: string }) => {
    const ref = useRef<HTMLDivElement>(null);

    const [{ isDragging }, drag] = useDrag({
      type: 'section',
      item: { id, index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    const [, drop] = useDrop({
      accept: 'section',
      hover: (item: { id: string; index: number }) => {
        if (!ref.current) return;
        const dragIndex = item.index;
        const hoverIndex = index;
        if (dragIndex === hoverIndex) return;
        moveSection(dragIndex, hoverIndex);
        item.index = hoverIndex;
      },
    });

    drag(drop(ref));

    return (
      <div
        ref={ref}
        className={`${className} ${isDragging ? 'opacity-50' : 'opacity-100'} transition-opacity`}
        style={{ cursor: 'move' }}
      >
        <div className="absolute top-2 right-2 z-10 bg-zinc-200 dark:bg-zinc-700 rounded p-1 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors">
          <GripVertical size={16} className="text-zinc-600 dark:text-zinc-400" />
        </div>
        {children}
      </div>
    );
  };

  return (
    <div className="p-6 min-h-screen">
      {/* Breadcrumb and Header Combined */}
      <div className="mb-3 flex items-center justify-between gap-4">
        {/* Breadcrumb with Pick Icon */}
        <nav className="flex items-center gap-2 text-sm">
          <Link
            to="/app/home"
            className="text-zinc-600 dark:text-zinc-400 hover:text-[#0d9488] dark:hover:text-[#50e080] transition-colors flex items-center gap-1"
          >
            <Home size={14} />
            Home
          </Link>
          <ChevronRight size={16} className="text-zinc-400 dark:text-zinc-600" />
          <Link
            to="/app/navigation"
            className="text-zinc-600 dark:text-zinc-400 hover:text-[#0d9488] dark:hover:text-[#50e080] transition-colors"
          >
            Navigation
          </Link>
          <ChevronRight size={16} className="text-zinc-400 dark:text-zinc-600" />
          <Link
            to="/app/navigation?section=workstation"
            className="text-zinc-600 dark:text-zinc-400 hover:text-[#0d9488] dark:hover:text-[#50e080] transition-colors"
          >
            Workstation Operations
          </Link>
          <ChevronRight size={16} className="text-zinc-400 dark:text-zinc-600" />
          <span className="text-zinc-900 dark:text-white font-semibold text-lg flex items-center gap-2">
            <RefreshCw size={20} className="text-[#0d9488] dark:text-[#50e080]" />
            Pick
          </span>
        </nav>

        {/* Layout Mode Toggle */}
        <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-0.5 flex gap-0.5">
          <button
            onClick={() => setLayoutMode("pick-port")}
            className={`p-1.5 rounded-md transition-all ${
              layoutMode === "pick-port"
                ? "bg-[#0d9488]/80 dark:bg-[#50e080]/80 text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
            title="Pick Port"
          >
            <Grid3x3 size={16} />
          </button>
          <button
            onClick={() => setLayoutMode("pack-hold")}
            className={`p-1.5 rounded-md transition-all ${
              layoutMode === "pack-hold"
                ? "bg-[#0d9488]/80 dark:bg-[#50e080]/80 text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
            title="Pack & Hold"
          >
            <Columns size={16} />
          </button>
          <button
            onClick={() => setLayoutMode("pack-hold-horizontal")}
            className={`p-1.5 rounded-md transition-all ${
              layoutMode === "pack-hold-horizontal"
                ? "bg-[#0d9488]/80 dark:bg-[#50e080]/80 text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
            title="Pack & Hold Horizontal"
          >
            <Columns size={16} className="rotate-90" />
          </button>
        </div>

        {/* Information Section */}
        <div className="flex-1 flex justify-center">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 flex items-center gap-4">
              {/* Pick Rate */}
              <div className="flex flex-col items-center">
                <div className="text-[10px] text-zinc-600 dark:text-zinc-400 mb-0.5 uppercase tracking-wide">
                  Pick Rate
                </div>
                {completedPicks.length < 5 && completedPickLists.length === 0 ? (
                  <div className="text-[10px] text-zinc-600 dark:text-zinc-400 italic">
                    Perform {5 - completedPicks.length} more pick{5 - completedPicks.length !== 1 ? 's' : ''}
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-0.5">
                    {completedPicks.length >= 5 && (
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold text-[#0d9488] dark:text-[#50e080]">
                          {Math.round(completedPicks.reduce((sum, pick) => sum + pick.duration, 0) / completedPicks.length)}
                        </span>
                        <span className="text-[10px] text-zinc-600 dark:text-zinc-400">sec/item</span>
                      </div>
                    )}
                    {completedPickLists.length > 0 && (
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                          {Math.round(completedPickLists.reduce((sum, list) => sum + list.duration, 0) / completedPickLists.length)}
                        </span>
                        <span className="text-[10px] text-zinc-600 dark:text-zinc-400">sec/list</span>
                      </div>
                    )}
                    {itemPickStartTime && (
                      <div className="text-[10px] text-zinc-500 dark:text-zinc-500">
                        Current: {Math.round((new Date().getTime() - itemPickStartTime.getTime()) / 1000)}s
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-700"></div>

              {/* Registered Pick Lists */}
              <div className="flex flex-col items-center">
                <div className="text-[10px] text-zinc-600 dark:text-zinc-400 mb-0.5 uppercase tracking-wide">
                  Registered Lists
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold text-zinc-900 dark:text-white">
                    {sortbarRegistrations.length}
                  </span>
                  <span className="text-[10px] text-zinc-600 dark:text-zinc-400">list{sortbarRegistrations.length !== 1 ? 's' : ''}</span>
                </div>
              </div>

              {/* Divider */}
              <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-700"></div>

              {/* Pick Tasks */}
              <div className="flex flex-col items-center">
                <div className="text-[10px] text-zinc-600 dark:text-zinc-400 mb-0.5 uppercase tracking-wide">
                  Pick Tasks
                </div>
                {(() => {
                  const totalItems = sortbarRegistrations.reduce((sum, reg) => sum + reg.items.length, 0);
                  const completedItems = sortbarRegistrations.reduce((sum, reg) => {
                    return sum + reg.items.filter(item => {
                      const processed = reg.processedItems.get(item.id) || 0;
                      return processed > 0;
                    }).length;
                  }, 0);
                  const progressPercent = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

                  return (
                    <>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold text-zinc-900 dark:text-white">
                          {completedItems}
                        </span>
                        <span className="text-[10px] text-zinc-600 dark:text-zinc-400">/ {totalItems}</span>
                      </div>
                      {totalItems > 0 && (
                        <div className="w-16 h-1 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden mt-0.5">
                          <div
                            className="h-full bg-[#0d9488] dark:bg-[#50e080] transition-all duration-300"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>

              {/* Divider */}
              <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-700"></div>

              {/* Total QTY to Pick */}
              <div className="flex flex-col items-center">
                <div className="text-[10px] text-zinc-600 dark:text-zinc-400 mb-0.5 uppercase tracking-wide">
                  QTY to Pick
                </div>
                {(() => {
                  const totalQty = sortbarRegistrations.reduce((sum, reg) =>
                    sum + reg.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
                  );
                  const pickedQty = sortbarRegistrations.reduce((sum, reg) => {
                    return sum + reg.items.reduce((itemSum, item) => {
                      const processed = reg.processedItems.get(item.id) || 0;
                      return itemSum + processed;
                    }, 0);
                  }, 0);
                  const progressPercent = totalQty > 0 ? (pickedQty / totalQty) * 100 : 0;

                  return (
                    <>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold text-zinc-900 dark:text-white">
                          {pickedQty}
                        </span>
                        <span className="text-[10px] text-zinc-600 dark:text-zinc-400">/ {totalQty}</span>
                      </div>
                      {totalQty > 0 && (
                        <div className="w-16 h-1 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden mt-0.5">
                          <div
                            className="h-full bg-[#0d9488] dark:bg-[#50e080] transition-all duration-300"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHistory(true)}
            className="p-1.5 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-md transition-colors"
            title="History"
          >
            <History size={16} />
          </button>
          <button
            onClick={() => setShowLegend(true)}
            className="p-1.5 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-md transition-colors"
            title="Legend"
          >
            <Info size={16} />
          </button>
        </div>
      </div>

      <DndProvider backend={HTML5Backend}>
        {layoutMode === "pick-port" ? (
          /* Pick Port Layout - Left sortbars, center bin, right sortbars, and current item */
          <div
            className={`flex gap-4 transition-all duration-500 ease-in-out ${
                  showSortbarMenu && panelView === "menu" ? 'mr-[400px]' : showSortbarMenu && panelView !== "menu" ? 'mr-0' : 'mr-0'
                }`}
          >
            {/* Combined Sortbars and Bin Section */}
            <div className="flex-1 h-[calc(100vh-110px)] flex gap-4">
              {/* Left Sortbar Column - A1 to A4 */}
              <div className="w-[15%] min-w-[180px]">
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden h-full flex flex-col">
                  <div className="bg-zinc-100 dark:bg-zinc-800 p-3 border-b border-zinc-200 dark:border-zinc-700 flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <Grid3x3 size={20} className="text-[#0d9488] dark:text-[#50e080]" />
                      <h2 className="font-semibold text-zinc-900 dark:text-white text-base">Sortbar A</h2>
                    </div>
                  </div>
                <div className="p-4 flex-1 overflow-y-auto">
                    {/* Render sortbars A1-A4 in vertical stack */}
                    <div className="space-y-3">
                      {['A1', 'A2', 'A3', 'A4'].map(sortbarName => {
                        const sortbar = initialSortbars.find(sb => sb.name === sortbarName);
                        if (!sortbar) return null;
                        const registration = sortbarRegistrations.find(reg => reg.sortbarId === sortbar.id);
                        const isActive = activeSortbar === sortbar.id;
                        const isRegistered = !!registration;
                        const status = getSortbarStatus(sortbar.id);

                        return (
                          <button
                            key={sortbar.id}
                            onClick={() => handleSortbarSelect(sortbar.id)}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg border-2 h-[130px] flex flex-col ${
                              isActive && isRegistered
                                ? "bg-blue-500/5 dark:bg-blue-400/5 shadow-lg border-blue-500/50 dark:border-blue-400/50"
                                : isRegistered
                                ? "border-blue-500/30 dark:border-blue-400/30 bg-blue-500/5 dark:bg-blue-400/5 hover:border-blue-500/50 dark:hover:border-blue-400/50 transition-all"
                                : "border-zinc-300 dark:border-zinc-700 hover:border-[#0d9488] dark:hover:border-[#50e080] hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-all"
                            }`}
                          >
                            <div className="flex-1 flex flex-col">
                              <div className="flex items-center justify-between mb-0.5">
                                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{sortbar.name}</h3>
                                <span
                                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                                    status === "available"
                                      ? "bg-[#0d9488]/10 dark:bg-[#50e080]/10 text-[#0d9488] dark:text-[#50e080]"
                                      : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                  }`}
                                >
                                  {status}
                                </span>
                              </div>
                              {registration?.lpn && (
                                <div className="text-[10px] text-zinc-600 dark:text-zinc-400 mb-0.5 font-mono">
                                  LPN: {registration.lpn}
                                </div>
                              )}
                              <div className="pt-0.5 border-t border-zinc-200 dark:border-zinc-700 flex-1">
                                {registration ? (
                                  <>
                                    <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium mb-0.5">
                                      {registration.workListId}
                                    </p>
                                    <div className="flex items-baseline gap-2.5 mb-0.5">
                                      <div className="flex items-baseline gap-0.5">
                                        <div className="text-xl font-bold text-blue-600 dark:text-blue-400 leading-none">
                                          {registration.itemCount}
                                        </div>
                                        <div className="text-[10px] text-zinc-600 dark:text-zinc-400">items</div>
                                      </div>
                                      <div className="flex items-baseline gap-0.5">
                                        <div className="text-xl font-bold text-blue-600 dark:text-blue-400 leading-none">
                                          {registration.totalQuantity}
                                        </div>
                                        <div className="text-[10px] text-zinc-600 dark:text-zinc-400">qty</div>
                                      </div>
                                    </div>
                                    {(() => {
                                      const completedItems = registration.items.filter(item => {
                                        const processed = registration.processedItems.get(item.id) || 0;
                                        return processed > 0;
                                      }).length;
                                      const itemProgress = registration.itemCount > 0 ? (completedItems / registration.itemCount) * 100 : 0;

                                      return (
                                        <div className="h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                                          <div
                                            className="h-full bg-blue-500 dark:bg-blue-400 transition-all duration-300"
                                            style={{ width: `${itemProgress}%` }}
                                          />
                                        </div>
                                      );
                                    })()}
                                  </>
                                ) : (
                                  <p className="text-xs text-zinc-500 dark:text-zinc-500">Click to register</p>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Center - Single Bin */}
              <div className="flex-1">
                {(() => {
                  // Get the active sortbar's registration
                  const registration = activeSortbar ? sortbarRegistrations.find(reg => reg.sortbarId === activeSortbar) : null;
                  if (!registration) {
                    return (
                      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden h-full flex flex-col opacity-50">
                        <div className="bg-zinc-100 dark:bg-zinc-800 p-3 border-b border-zinc-200 dark:border-zinc-700 flex-shrink-0">
                          <div className="flex items-center gap-2">
                            <Box size={20} className="text-[#0d9488] dark:text-[#50e080]" />
                            <h2 className="font-semibold text-base text-zinc-900 dark:text-white">Bin</h2>
                          </div>
                        </div>
                        <div className="h-full flex items-center justify-center">
                          <div className="text-center max-w-xs">
                            <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-3">
                              <Box size={32} className="text-zinc-400 dark:text-zinc-600" />
                            </div>
                            <p className="text-zinc-600 dark:text-zinc-400">
                              No active sortbar
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden h-full flex flex-col">
                      <div className="bg-zinc-100 dark:bg-zinc-800 p-3 border-b border-zinc-200 dark:border-zinc-700 flex-shrink-0">
                        <div className="flex items-center gap-2">
                          <Box size={20} className="text-[#0d9488] dark:text-[#50e080]" />
                          <h2 className="font-semibold text-base text-zinc-900 dark:text-white">
                            Bin - {selectedItem?.binNumber || currentContainerLpn}
                          </h2>
                        </div>
                      </div>

                      {selectedItem ? (
                        <div className="flex-1 flex flex-col overflow-hidden">
                          {/* Compartment Grid */}
                          <div className="flex-1 p-3 flex flex-col">
                            <div className="mb-2">
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">
                                  Pick from Compartment
                                </p>
                                <button
                                  onClick={handleAdjustInventoryClick}
                                  className="px-2.5 py-1 text-xs bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded font-medium transition-colors"
                                >
                                  Adjust Inventory
                                </button>
                              </div>
                              {selectedItem.compartmentLpn && (
                                <p className="text-xl font-bold text-[#0d9488] dark:text-[#50e080] text-center mb-2">
                                  {selectedItem.compartmentLpn.split('-').pop()}
                                </p>
                              )}
                              {(() => {
                                const compartments = generateCompartments(selectedItem.containerName, selectedItem.compartmentConfig);
                                const { cols, rows } = selectedItem.compartmentConfig;
                                const isSingleCompartment = compartments.length === 1;

                                return (
                                  <div className="max-w-lg mx-auto">
                                    {/* Bin Container - Thick outer border */}
                                    <div className={`border-4 border-zinc-400 dark:border-zinc-600 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 shadow-lg ${
                                      isSingleCompartment ? 'min-h-[160px]' : ''
                                    }`}>
                                      <div
                                        className="w-full h-full"
                                        style={{
                                          display: 'grid',
                                          gridTemplateColumns: `repeat(${cols}, 1fr)`,
                                          gridTemplateRows: `repeat(${rows}, 1fr)`,
                                          minHeight: isSingleCompartment ? '160px' : `${rows * 70}px`,
                                          maxHeight: '240px'
                                        }}
                                      >
                                        {compartments.map((compartment, index) => {
                                          const isPickFrom = selectedItem.compartmentLpn && compartment.lpn === selectedItem.compartmentLpn;
                                          const qty = compartmentInventory.get(compartment.lpn) || 0;
                                          const row = Math.floor(index / cols);
                                          const col = index % cols;

                                          // Add borders to create compartment divisions
                                          const borderClasses = [];
                                          if (col < cols - 1) borderClasses.push('border-r'); // Right border except last column
                                          if (row < rows - 1) borderClasses.push('border-b'); // Bottom border except last row

                                          return (
                                            <div
                                              key={compartment.lpn}
                                              className={`flex flex-col items-center justify-center transition-all ${borderClasses.join(' ')} border-zinc-300 dark:border-zinc-600 ${
                                                isPickFrom
                                                  ? "bg-[#0d9488]/80 dark:bg-[#50e080]/80 shadow-inner"
                                                  : "bg-zinc-50 dark:bg-zinc-800/50"
                                              }`}
                                            >
                                              <div className={`text-lg font-mono font-bold leading-none ${
                                                isPickFrom
                                                  ? "text-white"
                                                  : "text-zinc-600 dark:text-zinc-400"
                                              }`}>
                                                {compartment.lpn.split('-').pop()}
                                              </div>
                                              {qty > 0 && (
                                                <div className={`text-[10px] font-medium mt-0.5 ${
                                                  isPickFrom
                                                    ? "text-white/80"
                                                    : "text-zinc-500 dark:text-zinc-500"
                                                }`}>
                                                  {qty} units
                                                </div>
                                              )}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>

                            {/* Quantity Controls */}
                            <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-700">
                              <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center mb-2 font-medium">Quantity Processed</p>

                              {/* Large Quantity Display/Input */}
                              <div className="mb-3 text-center">
                                <button
                                  onClick={handleQuantityClick}
                                  className="text-3xl font-bold text-[#0d9488] dark:text-[#50e080] hover:opacity-80 transition-opacity"
                                >
                                  {processedQuantity}
                                </button>
                                <div className="text-base text-zinc-400 mt-0.5">/ {selectedItem.quantity}</div>
                              </div>

                              {/* +/- Buttons */}
                              <div className="flex items-center justify-center gap-3">
                                <button
                                  onClick={handleQuantityDecrease}
                                  disabled={processedQuantity === 0}
                                  className="w-10 h-10 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-colors"
                                >
                                  <Minus size={18} className="text-zinc-900 dark:text-white" />
                                </button>
                                <button
                                  onClick={handleQuantityIncrease}
                                  disabled={processedQuantity >= selectedItem.quantity}
                                  className="w-10 h-10 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-colors"
                                >
                                  <Plus size={18} className="text-zinc-900 dark:text-white" />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Next/Confirm Button - Pinned */}
                          <div className="flex-shrink-0 p-3 px-4">
                            {(() => {
                              const currentIndex = items.findIndex(i => i.id === selectedItem.id);
                              const isLastItem = currentIndex === items.length - 1;
                              return (
                                <button
                                  onClick={handleNextOrConfirm}
                                  className="w-full px-5 py-2.5 bg-[#0d9488]/80 dark:bg-[#50e080]/80 hover:bg-[#0d9488] dark:hover:bg-[#50e080] text-white rounded-lg font-semibold text-base transition-colors flex items-center justify-center gap-2 shadow-lg"
                                >
                                  <Check size={20} />
                                  {isLastItem ? "Confirm" : "Next"}
                                </button>
                              );
                            })()}
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 flex items-center justify-center p-6">
                          <div className="text-center max-w-xs">
                            <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-3">
                              <Package size={32} className="text-zinc-400 dark:text-zinc-600" />
                            </div>
                            <p className="text-zinc-600 dark:text-zinc-400">
                              Select an item from the list to begin processing
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Right Sortbar Column - B1 to B4 */}
              <div className="w-[15%] min-w-[180px]">
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden h-full flex flex-col">
                  <div className="bg-zinc-100 dark:bg-zinc-800 p-3 border-b border-zinc-200 dark:border-zinc-700 flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <Grid3x3 size={20} className="text-[#0d9488] dark:text-[#50e080]" />
                      <h2 className="font-semibold text-zinc-900 dark:text-white text-base">Sortbar B</h2>
                    </div>
                  </div>
                  <div className="p-4 flex-1 overflow-y-auto">
                    {/* Render sortbars B1-B4 in vertical stack */}
                    <div className="space-y-3">
                      {['B1', 'B2', 'B3', 'B4'].map(sortbarName => {
                        const sortbar = initialSortbars.find(sb => sb.name === sortbarName);
                        if (!sortbar) return null;
                        const registration = sortbarRegistrations.find(reg => reg.sortbarId === sortbar.id);
                        const isActive = activeSortbar === sortbar.id;
                        const isRegistered = !!registration;
                        const status = getSortbarStatus(sortbar.id);

                        return (
                          <button
                            key={sortbar.id}
                            onClick={() => handleSortbarSelect(sortbar.id)}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg border-2 h-[130px] flex flex-col ${
                              isActive && isRegistered
                                ? "bg-blue-500/5 dark:bg-blue-400/5 shadow-lg border-blue-500/50 dark:border-blue-400/50"
                                : isRegistered
                                ? "border-blue-500/30 dark:border-blue-400/30 bg-blue-500/5 dark:bg-blue-400/5 hover:border-blue-500/50 dark:hover:border-blue-400/50 transition-all"
                                : "border-zinc-300 dark:border-zinc-700 hover:border-[#0d9488] dark:hover:border-[#50e080] hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-all"
                            }`}
                          >
                            <div className="flex-1 flex flex-col">
                              <div className="flex items-center justify-between mb-0.5">
                                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{sortbar.name}</h3>
                                <span
                                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                                    status === "available"
                                      ? "bg-[#0d9488]/10 dark:bg-[#50e080]/10 text-[#0d9488] dark:text-[#50e080]"
                                      : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                  }`}
                                >
                                  {status}
                                </span>
                              </div>
                              {registration?.lpn && (
                                <div className="text-[10px] text-zinc-600 dark:text-zinc-400 mb-0.5 font-mono">
                                  LPN: {registration.lpn}
                                </div>
                              )}
                              <div className="pt-0.5 border-t border-zinc-200 dark:border-zinc-700 flex-1">
                                {registration ? (
                                  <>
                                    <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium mb-0.5">
                                      {registration.workListId}
                                    </p>
                                    <div className="flex items-baseline gap-2.5 mb-0.5">
                                      <div className="flex items-baseline gap-0.5">
                                        <div className="text-xl font-bold text-blue-600 dark:text-blue-400 leading-none">
                                          {registration.itemCount}
                                        </div>
                                        <div className="text-[10px] text-zinc-600 dark:text-zinc-400">items</div>
                                      </div>
                                      <div className="flex items-baseline gap-0.5">
                                        <div className="text-xl font-bold text-blue-600 dark:text-blue-400 leading-none">
                                          {registration.totalQuantity}
                                        </div>
                                        <div className="text-[10px] text-zinc-600 dark:text-zinc-400">qty</div>
                                      </div>
                                    </div>
                                    {(() => {
                                      const completedItems = registration.items.filter(item => {
                                        const processed = registration.processedItems.get(item.id) || 0;
                                        return processed > 0;
                                      }).length;
                                      const itemProgress = registration.itemCount > 0 ? (completedItems / registration.itemCount) * 100 : 0;

                                      return (
                                        <div className="h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                                          <div
                                            className="h-full bg-blue-500 dark:bg-blue-400 transition-all duration-300"
                                            style={{ width: `${itemProgress}%` }}
                                          />
                                        </div>
                                      );
                                    })()}
                                  </>
                                ) : (
                                  <p className="text-xs text-zinc-500 dark:text-zinc-500">Click to register</p>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Item Section - Separate */}
            <div className="w-[30%] min-w-[400px] h-[calc(100vh-110px)]">
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden h-full flex flex-col">
                <div className="bg-zinc-100 dark:bg-zinc-800 p-3 border-b border-zinc-200 dark:border-zinc-700 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package size={20} className="text-[#0d9488] dark:text-[#50e080]" />
                      <h2 className="font-semibold text-base text-zinc-900 dark:text-white">
                        Current Item {selectedItem ? `(${items.findIndex(i => i.id === selectedItem.id) + 1} of ${items.length})` : `(0 of ${items.length})`}
                      </h2>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={handleNavigateBack}
                        disabled={currentHistoryIndex <= 0}
                        className="p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Previous item"
                      >
                        <ChevronLeft size={20} className="text-zinc-900 dark:text-white" />
                      </button>
                      <button
                        onClick={handleNavigateForward}
                        disabled={currentHistoryIndex >= itemNavigationHistory.length - 1}
                        className="p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Next item"
                      >
                        <ChevronRight size={20} className="text-zinc-900 dark:text-white" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="overflow-y-auto flex-1 p-3">
                  {selectedItem ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      {/* Item Image */}
                      {selectedItem.imageUrl && (
                        <div className="w-full aspect-[4/3] bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden">
                          <img
                            src={selectedItem.imageUrl}
                            alt={selectedItem.description}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {/* Item Details */}
                      <div className="space-y-2">
                        <div>
                          <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">SKU</div>
                          <div className="font-mono text-2xl font-bold text-zinc-900 dark:text-white">
                            {selectedItem.sku}
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">Description</div>
                          <div className="text-base text-zinc-900 dark:text-white leading-relaxed">
                            {selectedItem.description}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">Location</div>
                            <div className="text-base font-medium text-zinc-900 dark:text-white mb-1">
                              {selectedItem.location}
                            </div>
                            <div className="flex flex-col gap-0.5 text-xs text-zinc-600 dark:text-zinc-400">
                              <span>Bin: {selectedItem.binNumber}</span>
                              <span>Compartment: <span className="font-mono text-[#0d9488] dark:text-[#50e080] font-bold">
                                {selectedItem.compartmentLpn.split('-').pop()}
                              </span></span>
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">Priority</div>
                            <div>
                              <span
                                className={`text-xs px-2.5 py-1 rounded-full font-medium inline-block ${
                                  selectedItem.priority === "High"
                                    ? "bg-red-500/10 text-red-600 dark:text-red-400"
                                    : "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400"
                                }`}
                              >
                                {selectedItem.priority}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">Quantity to Pick</div>
                          <div className="text-3xl font-bold text-[#0d9488] dark:text-[#50e080]">
                            {selectedItem.quantity}
                          </div>
                        </div>

                        {selectedItem.itemComment && (
                          <div>
                            <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5 flex items-center gap-1.5">
                              <Info size={14} />
                              Item Comment
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-2 text-xs text-blue-900 dark:text-blue-300">
                              {selectedItem.itemComment}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center max-w-xs">
                        <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Package size={32} className="text-zinc-400 dark:text-zinc-600" />
                        </div>
                        <p className="text-zinc-600 dark:text-zinc-400">
                          No item selected. Select an item to begin picking.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : layoutMode === "pack-hold" ? (
          /* Pack & Hold Layout - Combined sortbars and bins with Current Item separate */
          <div
            className={`flex gap-4 transition-all duration-500 ease-in-out ${
                  showSortbarMenu && panelView === "menu" ? 'mr-[400px]' : showSortbarMenu && panelView !== "menu" ? 'mr-0' : 'mr-0'
                }`}
          >
            {/* Combined Sortbars and Bins Section */}
            <div className="flex-1 h-[calc(100vh-110px)] flex gap-4">
              {/* Left Sortbar */}
              <div className="w-[15%] min-w-[180px]">
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden h-full flex flex-col">
                  <div className="bg-zinc-100 dark:bg-zinc-800 p-3 border-b border-zinc-200 dark:border-zinc-700 flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <Grid3x3 size={20} className="text-[#0d9488] dark:text-[#50e080]" />
                      <h2 className="font-semibold text-zinc-900 dark:text-white text-base">Sortbar 1</h2>
                    </div>
                  </div>
                  <div className="p-4 flex-1 overflow-y-auto">
                    {/* Single sortbar display - will show A1 sortbar */}
                    {(() => {
                          const sortbar = initialSortbars.find(sb => sb.id === "SB-A1");
                          if (!sortbar) return null;
                          const registration = sortbarRegistrations.find(reg => reg.sortbarId === "SB-A1");
                          const isActive = activeSortbar === sortbar.id;
                          const isRegistered = !!registration;
                          const status = getSortbarStatus(sortbar.id);

                          return (
                            <button
                              onClick={() => handleSortbarSelect(sortbar.id)}
                              className={`w-full text-left px-2.5 py-1.5 rounded-lg border-2 h-[130px] flex flex-col ${
                                isActive && isRegistered
                                  ? "bg-blue-500/5 dark:bg-blue-400/5 shadow-lg border-blue-500/50 dark:border-blue-400/50"
                                  : isRegistered
                                  ? "border-blue-500/30 dark:border-blue-400/30 bg-blue-500/5 dark:bg-blue-400/5 hover:border-blue-500/50 dark:hover:border-blue-400/50 transition-all"
                                  : "border-zinc-300 dark:border-zinc-700 hover:border-[#0d9488] dark:hover:border-[#50e080] hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-all"
                              }`}
                            >
                              <div className="flex-1 flex flex-col">
                                <div className="flex items-center justify-between mb-0.5">
                                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{sortbar.name}</h3>
                                  <span
                                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                                      status === "available"
                                        ? "bg-[#0d9488]/10 dark:bg-[#50e080]/10 text-[#0d9488] dark:text-[#50e080]"
                                        : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                    }`}
                                  >
                                    {status}
                                  </span>
                                </div>
                                {registration?.lpn && (
                                  <div className="text-[10px] text-zinc-600 dark:text-zinc-400 mb-0.5 font-mono">
                                    LPN: {registration.lpn}
                                  </div>
                                )}
                                <div className="pt-0.5 border-t border-zinc-200 dark:border-zinc-700 flex-1">
                                  {registration ? (
                                    <>
                                      <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium mb-0.5">
                                        {registration.workListId}
                                      </p>
                                      <div className="flex items-baseline gap-2.5 mb-0.5">
                                        <div className="flex items-baseline gap-0.5">
                                          <div className="text-xl font-bold text-blue-600 dark:text-blue-400 leading-none">
                                            {registration.itemCount}
                                          </div>
                                          <div className="text-[10px] text-zinc-600 dark:text-zinc-400">items</div>
                                        </div>
                                        <div className="flex items-baseline gap-0.5">
                                          <div className="text-xl font-bold text-blue-600 dark:text-blue-400 leading-none">
                                            {registration.totalQuantity}
                                          </div>
                                          <div className="text-[10px] text-zinc-600 dark:text-zinc-400">qty</div>
                                        </div>
                                      </div>
                                      {(() => {
                                        const completedItems = registration.items.filter(item => {
                                          const processed = registration.processedItems.get(item.id) || 0;
                                          return processed > 0;
                                        }).length;
                                        const itemProgress = registration.itemCount > 0 ? (completedItems / registration.itemCount) * 100 : 0;

                                        return (
                                          <div className="h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                                            <div
                                              className="h-full bg-blue-500 dark:bg-blue-400 transition-all duration-300"
                                              style={{ width: `${itemProgress}%` }}
                                            />
                                          </div>
                                        );
                                      })()}
                                    </>
                                  ) : (
                                    <p className="text-xs text-zinc-500 dark:text-zinc-500">Click to register</p>
                                  )}
                                </div>
                              </div>
                            </button>
                          );
                        })()}
                  </div>
                </div>
              </div>

              {/* Center - Two Bins Side by Side */}
              <div className="flex-1 flex gap-4">
                    {/* Bin 1 */}
                    <div className="flex-1">
                      {(() => {
                        // Get the active sortbar's registration
                        const registration = activeSortbar ? sortbarRegistrations.find(reg => reg.sortbarId === activeSortbar) : null;
                        if (!registration) {
                          return (
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden h-full flex flex-col opacity-50">
                              <div className="bg-zinc-100 dark:bg-zinc-800 p-3 border-b border-zinc-200 dark:border-zinc-700 flex-shrink-0">
                                <div className="flex items-center gap-2">
                                  <Box size={20} className="text-[#0d9488] dark:text-[#50e080]" />
                                  <h2 className="font-semibold text-base text-zinc-900 dark:text-white">Bin 1</h2>
                                </div>
                              </div>
                              <div className="h-full flex items-center justify-center">
                                <div className="text-center max-w-xs">
                                  <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Box size={32} className="text-zinc-400 dark:text-zinc-600" />
                                  </div>
                                  <p className="text-zinc-600 dark:text-zinc-400">
                                    No active sortbar
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        }

                        // Check if this bin has any items assigned to it that haven't been picked yet
                        const bin1Items = registration.items.filter(item => {
                          const assignedToBin1 = itemBinAssignments.get(item.id) === 1;
                          const notCurrentItem = !selectedItem || item.id !== selectedItem.id;
                          return assignedToBin1 && notCurrentItem;
                        });
                        const hasBin1Items = bin1Items.length > 0;
                        const currentItemInBin1 = selectedItem && itemBinAssignments.get(selectedItem.id) === 1;
                        const isActive = currentItemInBin1;
                        const isReady = hasBin1Items && !currentItemInBin1 && binArrivals.has(1);

                        return (
                          <div className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden h-full flex flex-col ${
                            isActive ? 'ring-2 ring-blue-500 dark:ring-blue-400' : isReady ? 'ring-2 ring-amber-500 dark:ring-amber-400' : 'opacity-50'
                          }`}>
                            <div className="bg-zinc-100 dark:bg-zinc-800 p-3 border-b border-zinc-200 dark:border-zinc-700 flex-shrink-0">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Box size={20} className="text-[#0d9488] dark:text-[#50e080]" />
                                  <h2 className="font-semibold text-base text-zinc-900 dark:text-white">
                                    Bin 1 {isActive && selectedItem?.binNumber ? `- ${selectedItem.binNumber}` : ''}
                                  </h2>
                                </div>
                                {isReady && (
                                  <span className="text-xs px-2 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full font-medium">
                                    Ready
                                  </span>
                                )}
                              </div>
                            </div>
                            {isActive && selectedItem ? (
                          <div className="flex-1 flex flex-col overflow-hidden">
                            {/* Compartment Grid */}
                            <div className="flex-1 p-4 flex flex-col overflow-y-auto">
                              <div className="flex-shrink-0 mb-2">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                                    Pick from Compartment
                                  </p>
                                  <button
                                    onClick={handleAdjustInventoryClick}
                                    className="px-2 py-1 text-xs bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded font-medium transition-colors"
                                  >
                                    Adjust Inventory
                                  </button>
                                </div>
                                {selectedItem.compartmentLpn && (
                                  <p className="text-base font-bold text-[#0d9488] dark:text-[#50e080] text-center mb-2">
                                    {selectedItem.compartmentLpn.split('-').pop()}
                                  </p>
                                )}
                                {(() => {
                                  const compartments = generateCompartments(selectedItem.containerName, selectedItem.compartmentConfig);
                                  const { cols, rows } = selectedItem.compartmentConfig;
                                  const isSingleCompartment = compartments.length === 1;

                                  return (
                                    <div className="max-w-sm mx-auto">
                                      {/* Bin Container - Thick outer border */}
                                      <div className="border-4 border-zinc-400 dark:border-zinc-600 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 shadow-lg">
                                        <div
                                          className="w-full"
                                          style={{
                                            display: 'grid',
                                            gridTemplateColumns: `repeat(${cols}, 1fr)`,
                                            gridTemplateRows: `repeat(${rows}, 1fr)`,
                                            minHeight: isSingleCompartment ? '120px' : `${Math.min(rows * 60, 240)}px`
                                          }}
                                        >
                                          {compartments.map((compartment, index) => {
                                            const isPickFrom = selectedItem.compartmentLpn && compartment.lpn === selectedItem.compartmentLpn;
                                            const qty = compartmentInventory.get(compartment.lpn) || 0;
                                            const row = Math.floor(index / cols);
                                            const col = index % cols;

                                            const borderClasses = [];
                                            if (col < cols - 1) borderClasses.push('border-r');
                                            if (row < rows - 1) borderClasses.push('border-b');

                                            return (
                                              <div
                                                key={compartment.lpn}
                                                className={`flex flex-col items-center justify-center transition-all ${borderClasses.join(' ')} border-zinc-300 dark:border-zinc-600 ${
                                                  isPickFrom
                                                    ? "bg-[#0d9488]/80 dark:bg-[#50e080]/80 shadow-inner"
                                                    : "bg-zinc-50 dark:bg-zinc-800/50"
                                                }`}
                                              >
                                                <div className={`text-sm font-mono font-bold leading-none ${
                                                  isPickFrom
                                                    ? "text-white"
                                                    : "text-zinc-600 dark:text-zinc-400"
                                                }`}>
                                                  {compartment.lpn.split('-').pop()}
                                                </div>
                                                {qty > 0 && (
                                                  <div className={`text-[10px] font-medium mt-0.5 ${
                                                    isPickFrom
                                                      ? "text-white/80"
                                                      : "text-zinc-500 dark:text-zinc-500"
                                                  }`}>
                                                    {qty} units
                                                  </div>
                                                )}
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })()}
                              </div>

                              {/* Quantity Controls */}
                              <div className="flex-shrink-0 mt-2 pt-2 border-t border-zinc-200 dark:border-zinc-700">
                                <p className="text-xs text-zinc-600 dark:text-zinc-400 text-center mb-2">Quantity Processed</p>

                                {/* Large Quantity Display/Input */}
                                <div className="mb-2 text-center">
                                  <button
                                    onClick={handleQuantityClick}
                                    className="text-3xl font-bold text-[#0d9488] dark:text-[#50e080] hover:opacity-80 transition-opacity"
                                  >
                                    {processedQuantity}
                                  </button>
                                  <div className="text-sm text-zinc-400 mt-0.5">/ {selectedItem.quantity}</div>
                                </div>

                                {/* +/- Buttons */}
                                <div className="flex items-center justify-center gap-3">
                                  <button
                                    onClick={handleQuantityDecrease}
                                    disabled={processedQuantity === 0}
                                    className="w-10 h-10 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-colors"
                                  >
                                    <Minus size={18} className="text-zinc-900 dark:text-white" />
                                  </button>
                                  <button
                                    onClick={handleQuantityIncrease}
                                    disabled={processedQuantity >= selectedItem.quantity}
                                    className="w-10 h-10 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-colors"
                                  >
                                    <Plus size={18} className="text-zinc-900 dark:text-white" />
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Next/Confirm Button - Pinned */}
                            <div className="flex-shrink-0 p-3">
                              {(() => {
                                const currentIndex = items.findIndex(i => i.id === selectedItem.id);
                                const isLastItem = currentIndex === items.length - 1;
                                return (
                                  <button
                                    onClick={handleNextOrConfirm}
                                    className="w-full px-6 py-3 bg-[#0d9488]/80 dark:bg-[#50e080]/80 hover:bg-[#0d9488] dark:hover:bg-[#50e080] text-white rounded-lg font-semibold text-base transition-colors flex items-center justify-center gap-2 shadow-lg"
                                  >
                                    <Check size={20} />
                                    {isLastItem ? "Confirm" : "Next"}
                                  </button>
                                );
                              })()}
                            </div>
                          </div>
                        ) : (
                          <div className="h-full flex items-center justify-center">
                            <div className="text-center max-w-xs">
                              <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Box size={32} className="text-zinc-400 dark:text-zinc-600" />
                              </div>
                              <p className="text-zinc-600 dark:text-zinc-400">
                                No active pick for this bin
                              </p>
                            </div>
                          </div>
                        )}
                          </div>
                        );
                      })()}
                    </div>

                    {/* Bin 2 */}
                    <div className="flex-1">
                      {(() => {
                        // Get the active sortbar's registration
                        const registration = activeSortbar ? sortbarRegistrations.find(reg => reg.sortbarId === activeSortbar) : null;
                        if (!registration) {
                          return (
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden h-full flex flex-col opacity-50">
                              <div className="bg-zinc-100 dark:bg-zinc-800 p-3 border-b border-zinc-200 dark:border-zinc-700 flex-shrink-0">
                                <div className="flex items-center gap-2">
                                  <Box size={20} className="text-[#0d9488] dark:text-[#50e080]" />
                                  <h2 className="font-semibold text-base text-zinc-900 dark:text-white">Bin 2</h2>
                                </div>
                              </div>
                              <div className="h-full flex items-center justify-center">
                                <div className="text-center max-w-xs">
                                  <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Box size={32} className="text-zinc-400 dark:text-zinc-600" />
                                  </div>
                                  <p className="text-zinc-600 dark:text-zinc-400">
                                    No active sortbar
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        }

                        // Check if this bin has any items assigned to it that haven't been picked yet
                        const bin2Items = registration.items.filter(item => {
                          const assignedToBin2 = itemBinAssignments.get(item.id) === 2;
                          const notCurrentItem = !selectedItem || item.id !== selectedItem.id;
                          return assignedToBin2 && notCurrentItem;
                        });
                        const hasBin2Items = bin2Items.length > 0;
                        const currentItemInBin2 = selectedItem && itemBinAssignments.get(selectedItem.id) === 2;
                        const isActive = currentItemInBin2;
                        const isReady = hasBin2Items && !currentItemInBin2 && binArrivals.has(2);

                        return (
                          <div className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden h-full flex flex-col ${
                            isActive ? 'ring-2 ring-blue-500 dark:ring-blue-400' : isReady ? 'ring-2 ring-amber-500 dark:ring-amber-400' : 'opacity-50'
                          }`}>
                            <div className="bg-zinc-100 dark:bg-zinc-800 p-3 border-b border-zinc-200 dark:border-zinc-700 flex-shrink-0">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Box size={20} className="text-[#0d9488] dark:text-[#50e080]" />
                                  <h2 className="font-semibold text-base text-zinc-900 dark:text-white">
                                    Bin 2 {isActive && selectedItem?.binNumber ? `- ${selectedItem.binNumber}` : ''}
                                  </h2>
                                </div>
                                {isReady && (
                                  <span className="text-xs px-2 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full font-medium">
                                    Ready
                                  </span>
                                )}
                              </div>
                            </div>
                            {isActive && selectedItem ? (
                          <div className="flex-1 flex flex-col overflow-hidden">
                            {/* Compartment Grid */}
                            <div className="flex-1 p-4 flex flex-col overflow-y-auto">
                              <div className="flex-shrink-0 mb-2">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                                    Pick from Compartment
                                  </p>
                                  <button
                                    onClick={handleAdjustInventoryClick}
                                    className="px-2 py-1 text-xs bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded font-medium transition-colors"
                                  >
                                    Adjust Inventory
                                  </button>
                                </div>
                                {selectedItem.compartmentLpn && (
                                  <p className="text-base font-bold text-[#0d9488] dark:text-[#50e080] text-center mb-2">
                                    {selectedItem.compartmentLpn.split('-').pop()}
                                  </p>
                                )}
                                {(() => {
                                  const compartments = generateCompartments(selectedItem.containerName, selectedItem.compartmentConfig);
                                  const { cols, rows } = selectedItem.compartmentConfig;
                                  const isSingleCompartment = compartments.length === 1;

                                  return (
                                    <div className="max-w-sm mx-auto">
                                      {/* Bin Container - Thick outer border */}
                                      <div className="border-4 border-zinc-400 dark:border-zinc-600 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 shadow-lg">
                                        <div
                                          className="w-full"
                                          style={{
                                            display: 'grid',
                                            gridTemplateColumns: `repeat(${cols}, 1fr)`,
                                            gridTemplateRows: `repeat(${rows}, 1fr)`,
                                            minHeight: isSingleCompartment ? '120px' : `${Math.min(rows * 60, 240)}px`
                                          }}
                                        >
                                          {compartments.map((compartment, index) => {
                                            const isPickFrom = selectedItem.compartmentLpn && compartment.lpn === selectedItem.compartmentLpn;
                                            const qty = compartmentInventory.get(compartment.lpn) || 0;
                                            const row = Math.floor(index / cols);
                                            const col = index % cols;

                                            const borderClasses = [];
                                            if (col < cols - 1) borderClasses.push('border-r');
                                            if (row < rows - 1) borderClasses.push('border-b');

                                            return (
                                              <div
                                                key={compartment.lpn}
                                                className={`flex flex-col items-center justify-center transition-all ${borderClasses.join(' ')} border-zinc-300 dark:border-zinc-600 ${
                                                  isPickFrom
                                                    ? "bg-[#0d9488]/80 dark:bg-[#50e080]/80 shadow-inner"
                                                    : "bg-zinc-50 dark:bg-zinc-800/50"
                                                }`}
                                              >
                                                <div className={`text-sm font-mono font-bold leading-none ${
                                                  isPickFrom
                                                    ? "text-white"
                                                    : "text-zinc-600 dark:text-zinc-400"
                                                }`}>
                                                  {compartment.lpn.split('-').pop()}
                                                </div>
                                                {qty > 0 && (
                                                  <div className={`text-[10px] font-medium mt-0.5 ${
                                                    isPickFrom
                                                      ? "text-white/80"
                                                      : "text-zinc-500 dark:text-zinc-500"
                                                  }`}>
                                                    {qty} units
                                                  </div>
                                                )}
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })()}
                              </div>

                              {/* Quantity Controls */}
                              <div className="flex-shrink-0 mt-2 pt-2 border-t border-zinc-200 dark:border-zinc-700">
                                <p className="text-xs text-zinc-600 dark:text-zinc-400 text-center mb-2">Quantity Processed</p>

                                {/* Large Quantity Display/Input */}
                                <div className="mb-2 text-center">
                                  <button
                                    onClick={handleQuantityClick}
                                    className="text-3xl font-bold text-[#0d9488] dark:text-[#50e080] hover:opacity-80 transition-opacity"
                                  >
                                    {processedQuantity}
                                  </button>
                                  <div className="text-sm text-zinc-400 mt-0.5">/ {selectedItem.quantity}</div>
                                </div>

                                {/* +/- Buttons */}
                                <div className="flex items-center justify-center gap-3">
                                  <button
                                    onClick={handleQuantityDecrease}
                                    disabled={processedQuantity === 0}
                                    className="w-10 h-10 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-colors"
                                  >
                                    <Minus size={18} className="text-zinc-900 dark:text-white" />
                                  </button>
                                  <button
                                    onClick={handleQuantityIncrease}
                                    disabled={processedQuantity >= selectedItem.quantity}
                                    className="w-10 h-10 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-colors"
                                  >
                                    <Plus size={18} className="text-zinc-900 dark:text-white" />
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Next/Confirm Button - Pinned */}
                            <div className="flex-shrink-0 p-3">
                              {(() => {
                                const currentIndex = items.findIndex(i => i.id === selectedItem.id);
                                const isLastItem = currentIndex === items.length - 1;
                                return (
                                  <button
                                    onClick={handleNextOrConfirm}
                                    className="w-full px-6 py-3 bg-[#0d9488]/80 dark:bg-[#50e080]/80 hover:bg-[#0d9488] dark:hover:bg-[#50e080] text-white rounded-lg font-semibold text-base transition-colors flex items-center justify-center gap-2 shadow-lg"
                                  >
                                    <Check size={20} />
                                    {isLastItem ? "Confirm" : "Next"}
                                  </button>
                                );
                              })()}
                            </div>
                          </div>
                        ) : (
                          <div className="h-full flex items-center justify-center">
                            <div className="text-center max-w-xs">
                              <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Box size={32} className="text-zinc-400 dark:text-zinc-600" />
                              </div>
                              <p className="text-zinc-600 dark:text-zinc-400">
                                No active pick for this bin
                              </p>
                            </div>
                          </div>
                        )}
                          </div>
                        );
                      })()}
                    </div>
              </div>

              {/* Right Sortbar */}
              <div className="w-[15%] min-w-[180px]">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden h-full flex flex-col">
                      <div className="bg-zinc-100 dark:bg-zinc-800 p-3 border-b border-zinc-200 dark:border-zinc-700 flex-shrink-0">
                        <div className="flex items-center gap-2">
                          <Grid3x3 size={20} className="text-[#0d9488] dark:text-[#50e080]" />
                          <h2 className="font-semibold text-zinc-900 dark:text-white text-base">Sortbar 2</h2>
                        </div>
                      </div>
                      <div className="p-4 flex-1 overflow-y-auto">
                        {/* Single sortbar display - will show A2 sortbar */}
                        {(() => {
                          const sortbar = initialSortbars.find(sb => sb.id === "SB-A2");
                          if (!sortbar) return null;
                          const registration = sortbarRegistrations.find(reg => reg.sortbarId === "SB-A2");
                          const isActive = activeSortbar === sortbar.id;
                          const isRegistered = !!registration;
                          const status = getSortbarStatus(sortbar.id);

                          return (
                            <button
                              onClick={() => handleSortbarSelect(sortbar.id)}
                              className={`w-full text-left px-2.5 py-1.5 rounded-lg border-2 h-[130px] flex flex-col ${
                                isActive && isRegistered
                                  ? "bg-blue-500/5 dark:bg-blue-400/5 shadow-lg border-blue-500/50 dark:border-blue-400/50"
                                  : isRegistered
                                  ? "border-blue-500/30 dark:border-blue-400/30 bg-blue-500/5 dark:bg-blue-400/5 hover:border-blue-500/50 dark:hover:border-blue-400/50 transition-all"
                                  : "border-zinc-300 dark:border-zinc-700 hover:border-[#0d9488] dark:hover:border-[#50e080] hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-all"
                              }`}
                            >
                              <div className="flex-1 flex flex-col">
                                <div className="flex items-center justify-between mb-0.5">
                                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{sortbar.name}</h3>
                                  <span
                                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                                      status === "available"
                                        ? "bg-[#0d9488]/10 dark:bg-[#50e080]/10 text-[#0d9488] dark:text-[#50e080]"
                                        : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                    }`}
                                  >
                                    {status}
                                  </span>
                                </div>
                                {registration?.lpn && (
                                  <div className="text-[10px] text-zinc-600 dark:text-zinc-400 mb-0.5 font-mono">
                                    LPN: {registration.lpn}
                                  </div>
                                )}
                                <div className="pt-0.5 border-t border-zinc-200 dark:border-zinc-700 flex-1">
                                  {registration ? (
                                    <>
                                      <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium mb-0.5">
                                        {registration.workListId}
                                      </p>
                                      <div className="flex items-baseline gap-2.5 mb-0.5">
                                        <div className="flex items-baseline gap-0.5">
                                          <div className="text-xl font-bold text-blue-600 dark:text-blue-400 leading-none">
                                            {registration.itemCount}
                                          </div>
                                          <div className="text-[10px] text-zinc-600 dark:text-zinc-400">items</div>
                                        </div>
                                        <div className="flex items-baseline gap-0.5">
                                          <div className="text-xl font-bold text-blue-600 dark:text-blue-400 leading-none">
                                            {registration.totalQuantity}
                                          </div>
                                          <div className="text-[10px] text-zinc-600 dark:text-zinc-400">qty</div>
                                        </div>
                                      </div>
                                      {(() => {
                                        const completedItems = registration.items.filter(item => {
                                          const processed = registration.processedItems.get(item.id) || 0;
                                          return processed > 0;
                                        }).length;
                                        const itemProgress = registration.itemCount > 0 ? (completedItems / registration.itemCount) * 100 : 0;

                                        return (
                                          <div className="h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                                            <div
                                              className="h-full bg-blue-500 dark:bg-blue-400 transition-all duration-300"
                                              style={{ width: `${itemProgress}%` }}
                                            />
                                          </div>
                                        );
                                      })()}
                                    </>
                                  ) : (
                                    <p className="text-xs text-zinc-500 dark:text-zinc-500">Click to register</p>
                                  )}
                                </div>
                              </div>
                            </button>
                          );
                        })()}
                      </div>
                    </div>
              </div>
            </div>

            {/* Current Item Section - Separate */}
            <div className="w-[30%] min-w-[400px] h-[calc(100vh-110px)]">
                  <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden h-full flex flex-col">
                    <div className="bg-zinc-100 dark:bg-zinc-800 p-3 border-b border-zinc-200 dark:border-zinc-700 flex-shrink-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Package size={20} className="text-[#0d9488] dark:text-[#50e080]" />
                          <h2 className="font-semibold text-base text-zinc-900 dark:text-white">
                            Current Item {selectedItem ? `(${items.findIndex(i => i.id === selectedItem.id) + 1} of ${items.length})` : `(0 of ${items.length})`}
                          </h2>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={handleNavigateBack}
                            disabled={currentHistoryIndex <= 0}
                            className="p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Previous item"
                          >
                            <ChevronLeft size={20} className="text-zinc-900 dark:text-white" />
                          </button>
                          <button
                            onClick={handleNavigateForward}
                            disabled={currentHistoryIndex >= itemNavigationHistory.length - 1}
                            className="p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Next item"
                          >
                            <ChevronRight size={20} className="text-zinc-900 dark:text-white" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="overflow-y-auto flex-1 p-3">
                      {selectedItem ? (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-4"
                        >
                          {/* Item Image */}
                          {selectedItem.imageUrl && (
                            <div className="w-full aspect-[4/3] bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden">
                              <img
                                src={selectedItem.imageUrl}
                                alt={selectedItem.description}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}

                          {/* Item Details */}
                          <div className="space-y-2">
                            <div>
                              <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">SKU</div>
                              <div className="font-mono text-2xl font-bold text-zinc-900 dark:text-white">
                                {selectedItem.sku}
                              </div>
                            </div>

                            <div>
                              <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">Description</div>
                              <div className="text-base text-zinc-900 dark:text-white leading-relaxed">
                                {selectedItem.description}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">Location</div>
                                <div className="text-base font-medium text-zinc-900 dark:text-white mb-1">
                                  {selectedItem.location}
                                </div>
                                <div className="flex flex-col gap-0.5 text-xs text-zinc-600 dark:text-zinc-400">
                                  <span>Bin: {selectedItem.binNumber}</span>
                                  <span>Compartment: <span className="font-mono text-[#0d9488] dark:text-[#50e080] font-bold">
                                    {selectedItem.compartmentLpn.split('-').pop()}
                                  </span></span>
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">Priority</div>
                                <div>
                                  <span
                                    className={`text-xs px-2.5 py-1 rounded-full font-medium inline-block ${
                                      selectedItem.priority === "High"
                                        ? "bg-red-500/10 text-red-600 dark:text-red-400"
                                        : "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400"
                                    }`}
                                  >
                                    {selectedItem.priority}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div>
                              <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">Quantity to Pick</div>
                              <div className="text-3xl font-bold text-[#0d9488] dark:text-[#50e080]">
                                {selectedItem.quantity}
                              </div>
                            </div>

                            {selectedItem.itemComment && (
                              <div>
                                <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5 flex items-center gap-1.5">
                                  <Info size={14} />
                                  Item Comment
                                </div>
                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-2 text-xs text-blue-900 dark:text-blue-300">
                                  {selectedItem.itemComment}
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <div className="text-center max-w-xs">
                            <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-3">
                              <Package size={32} className="text-zinc-400 dark:text-zinc-600" />
                            </div>
                            <p className="text-zinc-600 dark:text-zinc-400">
                              No item selected. Select an item to begin picking.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
          </div>
        ) : (
          /* Pack & Hold Horizontal Layout - Sortbars top/bottom, bins stacked in middle */
          <div
            className={`flex gap-4 transition-all duration-500 ease-in-out ${
                  showSortbarMenu && panelView === "menu" ? 'mr-[400px]' : showSortbarMenu && panelView !== "menu" ? 'mr-0' : 'mr-0'
                }`}
          >
            {/* Combined Sortbars and Bins Section */}
            <div className="flex-1 h-[calc(100vh-110px)] flex flex-col gap-4">
              {/* Top Sortbars - A1 to A4 in horizontal row */}
              <div className="h-[15%] min-h-[140px]">
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden h-full flex flex-col">
                  <div className="bg-zinc-100 dark:bg-zinc-800 p-3 border-b border-zinc-200 dark:border-zinc-700 flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <Grid3x3 size={20} className="text-[#0d9488] dark:text-[#50e080]" />
                      <h2 className="font-semibold text-zinc-900 dark:text-white text-base">Sortbar Row A</h2>
                    </div>
                  </div>
                  <div className="p-4 flex-1 overflow-x-auto">
                    {/* Render sortbars A1-A4 in horizontal row */}
                    <div className="flex gap-3 h-full">
                      {['A1', 'A2', 'A3', 'A4'].map(sortbarName => {
                        const sortbar = initialSortbars.find(sb => sb.name === sortbarName);
                        if (!sortbar) return null;
                        const registration = sortbarRegistrations.find(reg => reg.sortbarId === sortbar.id);
                        const isActive = activeSortbar === sortbar.id;
                        const isRegistered = !!registration;
                        const status = getSortbarStatus(sortbar.id);

                        return (
                          <button
                            key={sortbar.id}
                            onClick={() => handleSortbarSelect(sortbar.id)}
                            className={`flex-1 min-w-[150px] text-left px-2.5 py-1.5 rounded-lg border-2 flex flex-col ${
                              isActive && isRegistered
                                ? "bg-blue-500/5 dark:bg-blue-400/5 shadow-lg border-blue-500/50 dark:border-blue-400/50"
                                : isRegistered
                                ? "border-blue-500/30 dark:border-blue-400/30 bg-blue-500/5 dark:bg-blue-400/5 hover:border-blue-500/50 dark:hover:border-blue-400/50 transition-all"
                                : "border-zinc-300 dark:border-zinc-700 hover:border-[#0d9488] dark:hover:border-[#50e080] hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-all"
                            }`}
                          >
                            <div className="flex-1 flex flex-col">
                              <div className="flex items-center justify-between mb-0.5">
                                <h3 className="text-base font-bold text-zinc-900 dark:text-white">{sortbar.name}</h3>
                                <span
                                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                                    status === "available"
                                      ? "bg-[#0d9488]/10 dark:bg-[#50e080]/10 text-[#0d9488] dark:text-[#50e080]"
                                      : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                  }`}
                                >
                                  {status}
                                </span>
                              </div>
                              {registration?.lpn && (
                                <div className="text-[10px] text-zinc-600 dark:text-zinc-400 mb-0.5 font-mono truncate">
                                  LPN: {registration.lpn}
                                </div>
                              )}
                              <div className="pt-0.5 border-t border-zinc-200 dark:border-zinc-700 flex-1">
                                {registration ? (
                                  <>
                                    <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium mb-0.5 truncate">
                                      {registration.workListId}
                                    </p>
                                    <div className="flex items-baseline gap-2 mb-0.5">
                                      <div className="flex items-baseline gap-0.5">
                                        <div className="text-sm font-bold text-blue-600 dark:text-blue-400 leading-none">
                                          {registration.itemCount}
                                        </div>
                                        <div className="text-[10px] text-zinc-600 dark:text-zinc-400">items</div>
                                      </div>
                                      <div className="flex items-baseline gap-0.5">
                                        <div className="text-sm font-bold text-blue-600 dark:text-blue-400 leading-none">
                                          {registration.totalQuantity}
                                        </div>
                                        <div className="text-[10px] text-zinc-600 dark:text-zinc-400">qty</div>
                                      </div>
                                    </div>
                                  </>
                                ) : (
                                  <p className="text-[10px] text-zinc-500 dark:text-zinc-500">Click to register</p>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Center - Two Bins Stacked Vertically */}
              <div className="flex-1 flex flex-col gap-4">
                {/* Bin 1 */}
                <div className="flex-1">
                  {(() => {
                    // Get the active sortbar's registration
                    const registration = activeSortbar ? sortbarRegistrations.find(reg => reg.sortbarId === activeSortbar) : null;
                    if (!registration) {
                      return (
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden h-full flex flex-col opacity-50">
                          <div className="bg-zinc-100 dark:bg-zinc-800 p-2 border-b border-zinc-200 dark:border-zinc-700 flex-shrink-0">
                            <div className="flex items-center gap-2">
                              <Box size={18} className="text-[#0d9488] dark:text-[#50e080]" />
                              <h2 className="font-semibold text-sm text-zinc-900 dark:text-white">Bin 1</h2>
                            </div>
                          </div>
                          <div className="h-full flex items-center justify-center">
                            <div className="text-center max-w-xs">
                              <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-2">
                                <Box size={24} className="text-zinc-400 dark:text-zinc-600" />
                              </div>
                              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                                No active sortbar
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    // Check if this bin has any items assigned to it that haven't been picked yet
                    const bin1Items = registration.items.filter(item => {
                      const assignedToBin1 = itemBinAssignments.get(item.id) === 1;
                      const notCurrentItem = !selectedItem || item.id !== selectedItem.id;
                      return assignedToBin1 && notCurrentItem;
                    });
                    const hasBin1Items = bin1Items.length > 0;
                    const currentItemInBin1 = selectedItem && itemBinAssignments.get(selectedItem.id) === 1;
                    const isActive = currentItemInBin1;
                    const isReady = hasBin1Items && !currentItemInBin1 && binArrivals.has(1);

                    return (
                      <div className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden h-full flex flex-col ${
                        isActive ? 'ring-2 ring-blue-500 dark:ring-blue-400' : isReady ? 'ring-2 ring-amber-500 dark:ring-amber-400' : 'opacity-50'
                      }`}>
                        <div className="bg-zinc-100 dark:bg-zinc-800 p-2 border-b border-zinc-200 dark:border-zinc-700 flex-shrink-0">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Box size={18} className="text-[#0d9488] dark:text-[#50e080]" />
                              <h2 className="font-semibold text-sm text-zinc-900 dark:text-white">
                                Bin 1 - {selectedItem?.binNumber || currentContainerLpn}
                              </h2>
                            </div>
                            {isReady && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium">
                                Ready
                              </span>
                            )}
                          </div>
                        </div>

                        {selectedItem && currentItemInBin1 ? (
                          <div className="flex-1 flex overflow-hidden">
                            {/* Compartment Grid - Compact Horizontal */}
                            <div className="flex-1 p-2 flex flex-col min-w-0">
                              <div className="mb-1">
                                <div className="flex items-center justify-between mb-1">
                                  <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                                    Pick from Compartment
                                  </p>
                                  <button
                                    onClick={handleAdjustInventoryClick}
                                    className="px-2 py-0.5 text-[10px] bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded font-medium transition-colors"
                                  >
                                    Adjust
                                  </button>
                                </div>
                                {selectedItem.compartmentLpn && (
                                  <p className="text-base font-bold text-[#0d9488] dark:text-[#50e080] text-center mb-1">
                                    {selectedItem.compartmentLpn.split('-').pop()}
                                  </p>
                                )}
                                {(() => {
                                  const compartments = generateCompartments(selectedItem.containerName, selectedItem.compartmentConfig);
                                  const { cols, rows } = selectedItem.compartmentConfig;
                                  const isSingleCompartment = compartments.length === 1;

                                  return (
                                    <div className="max-w-md mx-auto">
                                      {/* Bin Container - Compact */}
                                      <div className={`border-4 border-zinc-400 dark:border-zinc-600 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 shadow-lg ${
                                        isSingleCompartment ? 'min-h-[100px]' : ''
                                      }`}>
                                        <div
                                          className="w-full h-full"
                                          style={{
                                            display: 'grid',
                                            gridTemplateColumns: `repeat(${cols}, 1fr)`,
                                            gridTemplateRows: `repeat(${rows}, 1fr)`,
                                            minHeight: isSingleCompartment ? '100px' : `${rows * 50}px`,
                                            maxHeight: '140px'
                                          }}
                                        >
                                          {compartments.map((compartment, index) => {
                                            const isPickFrom = selectedItem.compartmentLpn && compartment.lpn === selectedItem.compartmentLpn;
                                            const qty = compartmentInventory.get(compartment.lpn) || 0;
                                            const row = Math.floor(index / cols);
                                            const col = index % cols;

                                            const borderClasses = [];
                                            if (col < cols - 1) borderClasses.push('border-r');
                                            if (row < rows - 1) borderClasses.push('border-b');

                                            return (
                                              <div
                                                key={compartment.lpn}
                                                className={`flex flex-col items-center justify-center transition-all ${borderClasses.join(' ')} border-zinc-300 dark:border-zinc-600 ${
                                                  isPickFrom
                                                    ? "bg-[#0d9488]/80 dark:bg-[#50e080]/80 shadow-inner"
                                                    : "bg-zinc-50 dark:bg-zinc-800/50"
                                                }`}
                                              >
                                                <div className={`text-sm font-mono font-bold leading-none ${
                                                  isPickFrom
                                                    ? "text-white"
                                                    : "text-zinc-600 dark:text-zinc-400"
                                                }`}>
                                                  {compartment.lpn.split('-').pop()}
                                                </div>
                                                {qty > 0 && (
                                                  <div className={`text-[9px] font-medium mt-0.5 ${
                                                    isPickFrom
                                                      ? "text-white/80"
                                                      : "text-zinc-500 dark:text-zinc-500"
                                                  }`}>
                                                    {qty}u
                                                  </div>
                                                )}
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })()}
                              </div>
                            </div>

                            {/* Quantity Controls - Compact Vertical */}
                            <div className="flex-shrink-0 p-2 border-l border-zinc-200 dark:border-zinc-700 flex flex-col items-center justify-center min-w-[140px]">
                              <p className="text-[10px] text-zinc-600 dark:text-zinc-400 text-center mb-2">Quantity Processed</p>

                              <div className="mb-2 text-center">
                                <button
                                  onClick={handleQuantityClick}
                                  className="text-2xl font-bold text-[#0d9488] dark:text-[#50e080] hover:opacity-80 transition-opacity"
                                >
                                  {processedQuantity}
                                </button>
                                <div className="text-xs text-zinc-400 mt-0.5">/ {selectedItem.quantity}</div>
                              </div>

                              <div className="flex items-center justify-center gap-2 mb-2">
                                <button
                                  onClick={handleQuantityDecrease}
                                  disabled={processedQuantity === 0}
                                  className="w-8 h-8 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-colors"
                                >
                                  <Minus size={14} className="text-zinc-900 dark:text-white" />
                                </button>
                                <button
                                  onClick={handleQuantityIncrease}
                                  disabled={processedQuantity >= selectedItem.quantity}
                                  className="w-8 h-8 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-colors"
                                >
                                  <Plus size={14} className="text-zinc-900 dark:text-white" />
                                </button>
                              </div>

                              {/* Next/Confirm Button */}
                              {(() => {
                                const currentIndex = items.findIndex(i => i.id === selectedItem.id);
                                const isLastItem = currentIndex === items.length - 1;
                                return (
                                  <button
                                    onClick={handleNextOrConfirm}
                                    className="w-full px-3 py-2 bg-[#0d9488]/80 dark:bg-[#50e080]/80 hover:bg-[#0d9488] dark:hover:bg-[#50e080] text-white rounded-lg font-semibold text-xs transition-colors flex items-center justify-center gap-1 shadow-lg"
                                  >
                                    <Check size={14} />
                                    {isLastItem ? "Confirm" : "Next"}
                                  </button>
                                );
                              })()}
                            </div>
                          </div>
                        ) : (
                          <div className="h-full flex items-center justify-center">
                            <div className="text-center max-w-xs">
                              <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-2">
                                <Box size={24} className="text-zinc-400 dark:text-zinc-600" />
                              </div>
                              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                                No active pick for this bin
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* Bin 2 */}
                <div className="flex-1">
                  {(() => {
                    // Get the active sortbar's registration
                    const registration = activeSortbar ? sortbarRegistrations.find(reg => reg.sortbarId === activeSortbar) : null;
                    if (!registration) {
                      return (
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden h-full flex flex-col opacity-50">
                          <div className="bg-zinc-100 dark:bg-zinc-800 p-2 border-b border-zinc-200 dark:border-zinc-700 flex-shrink-0">
                            <div className="flex items-center gap-2">
                              <Box size={18} className="text-[#0d9488] dark:text-[#50e080]" />
                              <h2 className="font-semibold text-sm text-zinc-900 dark:text-white">Bin 2</h2>
                            </div>
                          </div>
                          <div className="h-full flex items-center justify-center">
                            <div className="text-center max-w-xs">
                              <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-2">
                                <Box size={24} className="text-zinc-400 dark:text-zinc-600" />
                              </div>
                              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                                No active sortbar
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    // Check if this bin has any items assigned to it that haven't been picked yet
                    const bin2Items = registration.items.filter(item => {
                      const assignedToBin2 = itemBinAssignments.get(item.id) === 2;
                      const notCurrentItem = !selectedItem || item.id !== selectedItem.id;
                      return assignedToBin2 && notCurrentItem;
                    });
                    const hasBin2Items = bin2Items.length > 0;
                    const currentItemInBin2 = selectedItem && itemBinAssignments.get(selectedItem.id) === 2;
                    const isActive = currentItemInBin2;
                    const isReady = hasBin2Items && !currentItemInBin2 && binArrivals.has(2);

                    return (
                      <div className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden h-full flex flex-col ${
                        isActive ? 'ring-2 ring-blue-500 dark:ring-blue-400' : isReady ? 'ring-2 ring-amber-500 dark:ring-amber-400' : 'opacity-50'
                      }`}>
                        <div className="bg-zinc-100 dark:bg-zinc-800 p-2 border-b border-zinc-200 dark:border-zinc-700 flex-shrink-0">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Box size={18} className="text-[#0d9488] dark:text-[#50e080]" />
                              <h2 className="font-semibold text-sm text-zinc-900 dark:text-white">
                                Bin 2 - {selectedItem?.binNumber || currentContainerLpn}
                              </h2>
                            </div>
                            {isReady && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium">
                                Ready
                              </span>
                            )}
                          </div>
                        </div>

                        {selectedItem && currentItemInBin2 ? (
                          <div className="flex-1 flex overflow-hidden">
                            {/* Compartment Grid - Compact Horizontal */}
                            <div className="flex-1 p-2 flex flex-col min-w-0">
                              <div className="mb-1">
                                <div className="flex items-center justify-between mb-1">
                                  <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                                    Pick from Compartment
                                  </p>
                                  <button
                                    onClick={handleAdjustInventoryClick}
                                    className="px-2 py-0.5 text-[10px] bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded font-medium transition-colors"
                                  >
                                    Adjust
                                  </button>
                                </div>
                                {selectedItem.compartmentLpn && (
                                  <p className="text-base font-bold text-[#0d9488] dark:text-[#50e080] text-center mb-1">
                                    {selectedItem.compartmentLpn.split('-').pop()}
                                  </p>
                                )}
                                {(() => {
                                  const compartments = generateCompartments(selectedItem.containerName, selectedItem.compartmentConfig);
                                  const { cols, rows } = selectedItem.compartmentConfig;
                                  const isSingleCompartment = compartments.length === 1;

                                  return (
                                    <div className="max-w-md mx-auto">
                                      {/* Bin Container - Compact */}
                                      <div className={`border-4 border-zinc-400 dark:border-zinc-600 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 shadow-lg ${
                                        isSingleCompartment ? 'min-h-[100px]' : ''
                                      }`}>
                                        <div
                                          className="w-full h-full"
                                          style={{
                                            display: 'grid',
                                            gridTemplateColumns: `repeat(${cols}, 1fr)`,
                                            gridTemplateRows: `repeat(${rows}, 1fr)`,
                                            minHeight: isSingleCompartment ? '100px' : `${rows * 50}px`,
                                            maxHeight: '140px'
                                          }}
                                        >
                                          {compartments.map((compartment, index) => {
                                            const isPickFrom = selectedItem.compartmentLpn && compartment.lpn === selectedItem.compartmentLpn;
                                            const qty = compartmentInventory.get(compartment.lpn) || 0;
                                            const row = Math.floor(index / cols);
                                            const col = index % cols;

                                            const borderClasses = [];
                                            if (col < cols - 1) borderClasses.push('border-r');
                                            if (row < rows - 1) borderClasses.push('border-b');

                                            return (
                                              <div
                                                key={compartment.lpn}
                                                className={`flex flex-col items-center justify-center transition-all ${borderClasses.join(' ')} border-zinc-300 dark:border-zinc-600 ${
                                                  isPickFrom
                                                    ? "bg-[#0d9488]/80 dark:bg-[#50e080]/80 shadow-inner"
                                                    : "bg-zinc-50 dark:bg-zinc-800/50"
                                                }`}
                                              >
                                                <div className={`text-sm font-mono font-bold leading-none ${
                                                  isPickFrom
                                                    ? "text-white"
                                                    : "text-zinc-600 dark:text-zinc-400"
                                                }`}>
                                                  {compartment.lpn.split('-').pop()}
                                                </div>
                                                {qty > 0 && (
                                                  <div className={`text-[9px] font-medium mt-0.5 ${
                                                    isPickFrom
                                                      ? "text-white/80"
                                                      : "text-zinc-500 dark:text-zinc-500"
                                                  }`}>
                                                    {qty}u
                                                  </div>
                                                )}
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })()}
                              </div>
                            </div>

                            {/* Quantity Controls - Compact Vertical */}
                            <div className="flex-shrink-0 p-2 border-l border-zinc-200 dark:border-zinc-700 flex flex-col items-center justify-center min-w-[140px]">
                              <p className="text-[10px] text-zinc-600 dark:text-zinc-400 text-center mb-2">Quantity Processed</p>

                              <div className="mb-2 text-center">
                                <button
                                  onClick={handleQuantityClick}
                                  className="text-2xl font-bold text-[#0d9488] dark:text-[#50e080] hover:opacity-80 transition-opacity"
                                >
                                  {processedQuantity}
                                </button>
                                <div className="text-xs text-zinc-400 mt-0.5">/ {selectedItem.quantity}</div>
                              </div>

                              <div className="flex items-center justify-center gap-2 mb-2">
                                <button
                                  onClick={handleQuantityDecrease}
                                  disabled={processedQuantity === 0}
                                  className="w-8 h-8 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-colors"
                                >
                                  <Minus size={14} className="text-zinc-900 dark:text-white" />
                                </button>
                                <button
                                  onClick={handleQuantityIncrease}
                                  disabled={processedQuantity >= selectedItem.quantity}
                                  className="w-8 h-8 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-colors"
                                >
                                  <Plus size={14} className="text-zinc-900 dark:text-white" />
                                </button>
                              </div>

                              {/* Next/Confirm Button */}
                              {(() => {
                                const currentIndex = items.findIndex(i => i.id === selectedItem.id);
                                const isLastItem = currentIndex === items.length - 1;
                                return (
                                  <button
                                    onClick={handleNextOrConfirm}
                                    className="w-full px-3 py-2 bg-[#0d9488]/80 dark:bg-[#50e080]/80 hover:bg-[#0d9488] dark:hover:bg-[#50e080] text-white rounded-lg font-semibold text-xs transition-colors flex items-center justify-center gap-1 shadow-lg"
                                  >
                                    <Check size={14} />
                                    {isLastItem ? "Confirm" : "Next"}
                                  </button>
                                );
                              })()}
                            </div>
                          </div>
                        ) : (
                          <div className="h-full flex items-center justify-center">
                            <div className="text-center max-w-xs">
                              <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-2">
                                <Box size={24} className="text-zinc-400 dark:text-zinc-600" />
                              </div>
                              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                                No active pick for this bin
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Bottom Sortbars - B1 to B4 in horizontal row */}
              <div className="h-[15%] min-h-[140px]">
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden h-full flex flex-col">
                  <div className="bg-zinc-100 dark:bg-zinc-800 p-3 border-b border-zinc-200 dark:border-zinc-700 flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <Grid3x3 size={20} className="text-[#0d9488] dark:text-[#50e080]" />
                      <h2 className="font-semibold text-zinc-900 dark:text-white text-base">Sortbar Row B</h2>
                    </div>
                  </div>
                  <div className="p-4 flex-1 overflow-x-auto">
                    {/* Render sortbars B1-B4 in horizontal row */}
                    <div className="flex gap-3 h-full">
                      {['B1', 'B2', 'B3', 'B4'].map(sortbarName => {
                        const sortbar = initialSortbars.find(sb => sb.name === sortbarName);
                        if (!sortbar) return null;
                        const registration = sortbarRegistrations.find(reg => reg.sortbarId === sortbar.id);
                        const isActive = activeSortbar === sortbar.id;
                        const isRegistered = !!registration;
                        const status = getSortbarStatus(sortbar.id);

                        return (
                          <button
                            key={sortbar.id}
                            onClick={() => handleSortbarSelect(sortbar.id)}
                            className={`flex-1 min-w-[150px] text-left px-2.5 py-1.5 rounded-lg border-2 flex flex-col ${
                              isActive && isRegistered
                                ? "bg-blue-500/5 dark:bg-blue-400/5 shadow-lg border-blue-500/50 dark:border-blue-400/50"
                                : isRegistered
                                ? "border-blue-500/30 dark:border-blue-400/30 bg-blue-500/5 dark:bg-blue-400/5 hover:border-blue-500/50 dark:hover:border-blue-400/50 transition-all"
                                : "border-zinc-300 dark:border-zinc-700 hover:border-[#0d9488] dark:hover:border-[#50e080] hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-all"
                            }`}
                          >
                            <div className="flex-1 flex flex-col">
                              <div className="flex items-center justify-between mb-0.5">
                                <h3 className="text-base font-bold text-zinc-900 dark:text-white">{sortbar.name}</h3>
                                <span
                                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                                    status === "available"
                                      ? "bg-[#0d9488]/10 dark:bg-[#50e080]/10 text-[#0d9488] dark:text-[#50e080]"
                                      : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                  }`}
                                >
                                  {status}
                                </span>
                              </div>
                              {registration?.lpn && (
                                <div className="text-[10px] text-zinc-600 dark:text-zinc-400 mb-0.5 font-mono truncate">
                                  LPN: {registration.lpn}
                                </div>
                              )}
                              <div className="pt-0.5 border-t border-zinc-200 dark:border-zinc-700 flex-1">
                                {registration ? (
                                  <>
                                    <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium mb-0.5 truncate">
                                      {registration.workListId}
                                    </p>
                                    <div className="flex items-baseline gap-2 mb-0.5">
                                      <div className="flex items-baseline gap-0.5">
                                        <div className="text-sm font-bold text-blue-600 dark:text-blue-400 leading-none">
                                          {registration.itemCount}
                                        </div>
                                        <div className="text-[10px] text-zinc-600 dark:text-zinc-400">items</div>
                                      </div>
                                      <div className="flex items-baseline gap-0.5">
                                        <div className="text-sm font-bold text-blue-600 dark:text-blue-400 leading-none">
                                          {registration.totalQuantity}
                                        </div>
                                        <div className="text-[10px] text-zinc-600 dark:text-zinc-400">qty</div>
                                      </div>
                                    </div>
                                  </>
                                ) : (
                                  <p className="text-[10px] text-zinc-500 dark:text-zinc-500">Click to register</p>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Item Section - Separate */}
            <div className="w-[30%] min-w-[400px] h-[calc(100vh-110px)]">
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden h-full flex flex-col">
                <div className="bg-zinc-100 dark:bg-zinc-800 p-3 border-b border-zinc-200 dark:border-zinc-700 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package size={20} className="text-[#0d9488] dark:text-[#50e080]" />
                      <h2 className="font-semibold text-base text-zinc-900 dark:text-white">
                        Current Item {selectedItem ? `(${items.findIndex(i => i.id === selectedItem.id) + 1} of ${items.length})` : `(0 of ${items.length})`}
                      </h2>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={handleNavigateBack}
                        disabled={currentHistoryIndex <= 0}
                        className="p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Previous item"
                      >
                        <ChevronLeft size={20} className="text-zinc-900 dark:text-white" />
                      </button>
                      <button
                        onClick={handleNavigateForward}
                        disabled={currentHistoryIndex >= itemNavigationHistory.length - 1}
                        className="p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Next item"
                      >
                        <ChevronRight size={20} className="text-zinc-900 dark:text-white" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="overflow-y-auto flex-1 p-3">
                  {selectedItem ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      {/* Item Image */}
                      {selectedItem.imageUrl && (
                        <div className="w-full aspect-[4/3] bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden">
                          <img
                            src={selectedItem.imageUrl}
                            alt={selectedItem.description}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {/* Item Details */}
                      <div className="space-y-2">
                        <div>
                          <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">SKU</div>
                          <div className="font-mono text-2xl font-bold text-zinc-900 dark:text-white">
                            {selectedItem.sku}
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">Description</div>
                          <div className="text-base text-zinc-900 dark:text-white leading-relaxed">
                            {selectedItem.description}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">Location</div>
                            <div className="text-base font-medium text-zinc-900 dark:text-white mb-1">
                              {selectedItem.location}
                            </div>
                            <div className="flex flex-col gap-0.5 text-xs text-zinc-600 dark:text-zinc-400">
                              <span>Bin: {selectedItem.binNumber}</span>
                              <span>Compartment: <span className="font-mono text-[#0d9488] dark:text-[#50e080] font-bold">
                                {selectedItem.compartmentLpn.split('-').pop()}
                              </span></span>
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">Priority</div>
                            <div>
                              <span
                                className={`text-xs px-2.5 py-1 rounded-full font-medium inline-block ${
                                  selectedItem.priority === "High"
                                    ? "bg-red-500/10 text-red-600 dark:text-red-400"
                                    : "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400"
                                }`}
                              >
                                {selectedItem.priority}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">Quantity to Pick</div>
                          <div className="text-3xl font-bold text-[#0d9488] dark:text-[#50e080]">
                            {selectedItem.quantity}
                          </div>
                        </div>

                        {selectedItem.itemComment && (
                          <div>
                            <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5 flex items-center gap-1.5">
                              <Info size={14} />
                              Item Comment
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-2 text-xs text-blue-900 dark:text-blue-300">
                              {selectedItem.itemComment}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center max-w-xs">
                        <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Package size={32} className="text-zinc-400 dark:text-zinc-600" />
                        </div>
                        <p className="text-zinc-600 dark:text-zinc-400">
                          No item selected. Select an item to begin picking.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </DndProvider>

      {/* Sortbar Action Menu - Slide Out Panel (No backdrop, so main content remains interactive) */}
      <AnimatePresence>
        {showSortbarMenu && selectedSortbarData && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={`fixed right-0 top-0 bottom-0 bg-white dark:bg-zinc-900 border-l-2 border-[#0d9488] dark:border-[#50e080] shadow-2xl z-50 overflow-y-auto ${
                panelView === "menu" ? "w-96" : "w-[calc(100vw-43%)]"
              }`}
            >
              {/* Header */}
              <div className="bg-[#0d9488]/80 dark:bg-[#50e080]/80 p-6 text-white sticky top-0 z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {panelView !== "menu" && (
                      <button
                        onClick={() => setPanelView("menu")}
                        className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                      >
                        <ArrowLeft size={20} />
                      </button>
                    )}
                    <h2 className="text-xl font-bold">
                      {panelView === "menu" && "Sortbar Actions"}
                      {panelView === "list" && "Select Pick List"}
                      {panelView === "lpn" && "Enter Pick Container LPN"}
                      {panelView === "details" && "Work List Details"}
                    </h2>
                  </div>
                  <button
                    onClick={handleCloseSortbarMenu}
                    className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Sortbar Info */}
                {panelView === "menu" && (
                  <div className="bg-white/10 rounded-lg p-3">
                    <h3 className="font-semibold text-lg mb-1">{selectedSortbarData.name}</h3>
                    <p className="text-sm opacity-90">{selectedSortbarData.id}</p>
                    <div className="flex items-center gap-3 mt-2 text-sm opacity-90">
                      <span>{selectedSortbarData.zone}</span>
                      <span>•</span>
                      <span>Capacity: {selectedSortbarData.capacity}</span>
                    </div>
                    {currentRegistration && (
                      <div className="mt-2 pt-2 border-t border-white/20">
                        <p className="text-sm font-medium">
                          {currentRegistration.registrationMethod === "list"
                            ? `Registered: ${currentRegistration.workListId}`
                            : `LPN: ${currentRegistration.lpn}`}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Content based on panelView */}
              {panelView === "menu" && (
                <div className="p-6 space-y-4">
                  {!currentRegistration ? (
                    <>
                      <h3 className="font-semibold text-zinc-900 dark:text-white mb-3">Registration Method</h3>
                      <button
                        onClick={() => handleRegistrationMethodSelect("list")}
                        className="w-full p-4 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:border-[#0d9488] dark:hover:border-[#50e080] hover:bg-[#0d9488]/5 dark:hover:bg-[#50e080]/5 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#0d9488]/10 dark:bg-[#50e080]/10 rounded-lg flex items-center justify-center">
                            <List size={20} className="text-[#0d9488] dark:text-[#50e080]" />
                          </div>
                          <div className="text-left">
                            <p className="font-medium text-zinc-900 dark:text-white">Replen List by List</p>
                            <p className="text-xs text-zinc-600 dark:text-zinc-400">Select from available work lists</p>
                          </div>
                        </div>
                      </button>
                      <button
                        onClick={() => handleRegistrationMethodSelect("lpn")}
                        className="w-full p-4 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:border-[#0d9488] dark:hover:border-[#50e080] hover:bg-[#0d9488]/5 dark:hover:bg-[#50e080]/5 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#0d9488]/10 dark:bg-[#50e080]/10 rounded-lg flex items-center justify-center">
                            <Scan size={20} className="text-[#0d9488] dark:text-[#50e080]" />
                          </div>
                          <div className="text-left">
                            <p className="font-medium text-zinc-900 dark:text-white">Replen List by LPN</p>
                            <p className="text-xs text-zinc-600 dark:text-zinc-400">Scan or enter LPN for pick container</p>
                          </div>
                        </div>
                      </button>
                    </>
                  ) : (
                    <>
                      <h3 className="font-semibold text-zinc-900 dark:text-white mb-3">Actions</h3>
                      <button
                        onClick={handleShowDetails}
                        className="w-full p-4 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:border-[#0d9488] dark:hover:border-[#50e080] hover:bg-[#0d9488]/5 dark:hover:bg-[#50e080]/5 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#0d9488]/10 dark:bg-[#50e080]/10 rounded-lg flex items-center justify-center">
                            <ClipboardList size={20} className="text-[#0d9488] dark:text-[#50e080]" />
                          </div>
                          <div className="text-left">
                            <p className="font-medium text-zinc-900 dark:text-white">View Details</p>
                            <p className="text-xs text-zinc-600 dark:text-zinc-400">See work list and line details</p>
                          </div>
                        </div>
                      </button>
                      <button
                        onClick={handleChangeContainerClick}
                        className="w-full p-4 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:border-[#0d9488] dark:hover:border-[#50e080] hover:bg-[#0d9488]/5 dark:hover:bg-[#50e080]/5 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#0d9488]/10 dark:bg-[#50e080]/10 rounded-lg flex items-center justify-center">
                            <Box size={20} className="text-[#0d9488] dark:text-[#50e080]" />
                          </div>
                          <div className="text-left">
                            <p className="font-medium text-zinc-900 dark:text-white">Change LPN</p>
                            <p className="text-xs text-zinc-600 dark:text-zinc-400">Update container LPN</p>
                          </div>
                        </div>
                      </button>
                      <button
                        onClick={() => toast.info("Print Label", { description: "Label printing feature coming soon" })}
                        className="w-full p-4 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:border-[#0d9488] dark:hover:border-[#50e080] hover:bg-[#0d9488]/5 dark:hover:bg-[#50e080]/5 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#0d9488]/10 dark:bg-[#50e080]/10 rounded-lg flex items-center justify-center">
                            <Printer size={20} className="text-[#0d9488] dark:text-[#50e080]" />
                          </div>
                          <div className="text-left">
                            <p className="font-medium text-zinc-900 dark:text-white">Print Label</p>
                            <p className="text-xs text-zinc-600 dark:text-zinc-400">Print container label</p>
                          </div>
                        </div>
                      </button>
                      <button
                        onClick={handleUnregister}
                        className="w-full p-4 rounded-lg border border-red-300 dark:border-red-700 hover:border-red-500 dark:hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                            <X size={20} className="text-red-600 dark:text-red-400" />
                          </div>
                          <div className="text-left">
                            <p className="font-medium text-red-600 dark:text-red-400">Unregister Pick List</p>
                            <p className="text-xs text-zinc-600 dark:text-zinc-400">Clear sortbar registration</p>
                          </div>
                        </div>
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* List Selection View */}
              {panelView === "list" && (
                <div className="p-6">
                  <div className="space-y-3">
                    {mockPickLists
                      .filter(list => !sortbarRegistrations.some(reg => reg.workListId === list.id))
                      .map((list) => (
                        <button
                          key={list.id}
                          onClick={() => handleListSelect(list.id)}
                          className="w-full text-left p-4 border border-zinc-300 dark:border-zinc-700 rounded-lg hover:border-[#0d9488] dark:hover:border-[#50e080] hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-zinc-900 dark:text-white">{list.name}</h3>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                list.priority === "High"
                                  ? "bg-red-500/10 text-red-600 dark:text-red-400"
                                  : "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400"
                              }`}
                            >
                              {list.priority}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                            <span>{list.id}</span>
                            <span>{list.itemCount} items</span>
                            <span className="inline-flex items-center gap-1">
                              <CheckCircle2 size={14} />
                              {list.status}
                            </span>
                          </div>
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* LPN Input View */}
              {panelView === "lpn" && (
                <div className="p-6">
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-zinc-900 dark:text-white mb-2">
                      LPN Number
                    </label>
                    <input
                      type="text"
                      value={lpnInput}
                      onChange={(e) => setLpnInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleLpnSubmit()}
                      placeholder="Scan or enter LPN..."
                      autoFocus
                      className="w-full px-4 py-3 bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-500 focus:outline-none focus:border-[#0d9488] dark:focus:border-[#50e080] transition-colors font-mono"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setPanelView("menu")}
                      className="flex-1 px-4 py-3 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-lg font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleLpnSubmit}
                      disabled={!lpnInput.trim()}
                      className="flex-1 px-4 py-3 bg-[#0d9488]/80 dark:bg-[#50e080]/80 hover:bg-[#0d9488] dark:hover:bg-[#50e080] text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Register
                    </button>
                  </div>
                </div>
              )}

              {/* Work List Details View */}
              {panelView === "details" && workListDetail && (
                <>
                  {/* Action Buttons */}
                  <div className="p-6 pb-0 flex gap-3">
                    <button
                      onClick={handleChangeContainerClick}
                      className="flex-1 px-4 py-3 bg-[#0d9488]/80 dark:bg-[#50e080]/80 hover:bg-[#0d9488] dark:hover:bg-[#50e080] text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Box size={18} />
                      Change LPN
                    </button>
                    <button
                      onClick={() => toast.info("Print Label", { description: "Label printing feature coming soon" })}
                      className="flex-1 px-4 py-3 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Printer size={18} />
                      Print Label
                    </button>
                    <button
                      onClick={handleUnregister}
                      className="flex-1 px-4 py-3 bg-red-600 dark:bg-red-500 hover:bg-red-700 dark:hover:bg-red-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 size={18} />
                      Unregister Pick List
                    </button>
                  </div>
                  <div className="p-6">
                    <WorkListDetailsPanel
                      workListDetail={workListDetail}
                      workLines={workLines}
                      workOperations={workOperations}
                    />
                  </div>
                </>
              )}
            </motion.div>
        )}
      </AnimatePresence>

      {/* List Selection Modal */}
      <AnimatePresence>
        {showListSelection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setShowListSelection(false)}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-2xl overflow-hidden"
            >
              <div className="bg-[#0d9488]/80 dark:bg-[#50e080]/80 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <List size={24} />
                    <h2 className="text-2xl font-bold">Select Pick List</h2>
                  </div>
                  <button
                    onClick={() => setShowListSelection(false)}
                    className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <div className="space-y-3">
                  {mockPickLists
                    .filter(list => !sortbarRegistrations.some(reg => reg.workListId === list.id))
                    .map((list) => (
                      <button
                        key={list.id}
                        onClick={() => handleListSelect(list.id)}
                        className="w-full text-left p-4 border border-zinc-300 dark:border-zinc-700 rounded-lg hover:border-[#0d9488] dark:hover:border-[#50e080] hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-zinc-900 dark:text-white">{list.name}</h3>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              list.priority === "High"
                                ? "bg-red-500/10 text-red-600 dark:text-red-400"
                                : "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400"
                            }`}
                          >
                            {list.priority}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                          <span>{list.id}</span>
                          <span>{list.itemCount} items</span>
                          <span className="inline-flex items-center gap-1">
                            <CheckCircle2 size={14} />
                            {list.status}
                          </span>
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LPN Input Modal */}
      <AnimatePresence>
        {showLpnInput && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setShowLpnInput(false)}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-2xl overflow-hidden"
            >
              <div className="bg-[#0d9488]/80 dark:bg-[#50e080]/80 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Scan size={24} />
                    <h2 className="text-2xl font-bold">Enter LPN</h2>
                  </div>
                  <button
                    onClick={() => setShowLpnInput(false)}
                    className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-zinc-900 dark:text-white mb-2">
                    LPN Number
                  </label>
                  <input
                    type="text"
                    value={lpnInput}
                    onChange={(e) => setLpnInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLpnSubmit()}
                    placeholder="Scan or enter LPN..."
                    autoFocus
                    className="w-full px-4 py-3 bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-500 focus:outline-none focus:border-[#0d9488] dark:focus:border-[#50e080] transition-colors font-mono"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowLpnInput(false)}
                    className="flex-1 px-4 py-3 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLpnSubmit}
                    disabled={!lpnInput.trim()}
                    className="flex-1 px-4 py-3 bg-[#0d9488]/80 dark:bg-[#50e080]/80 hover:bg-[#0d9488] dark:hover:bg-[#50e080] text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Register
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completion Confirmation Modal */}
      <AnimatePresence>
        {showCompletionConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-2xl overflow-hidden"
            >
              <div className="bg-emerald-600 dark:bg-emerald-500 p-6 text-white">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={28} />
                  <h2 className="text-2xl font-bold">Pick List Complete</h2>
                </div>
                <p className="text-white/80 mt-2 text-sm">
                  Review your completed pick session below
                </p>
              </div>
              <div className="flex flex-col max-h-[70vh]">
                {/* Scrollable Items List */}
                <div className="flex-1 overflow-y-auto p-6 pb-4">
                  {/* Processed Items Summary */}
                  <div className="space-y-3">
                  {items.map((item) => {
                    const processedQty = processedItems.get(item.id) || 0;
                    const totalQty = item.quantity;
                    const isProcessed = processedQty > 0;
                    const isComplete = processedQty === totalQty;
                    const isShorted = isProcessed && processedQty < totalQty;
                    
                    return (
                      <div
                        key={item.id}
                        className={`p-4 rounded-lg border ${
                          isComplete
                            ? "border-zinc-300 dark:border-zinc-700 bg-emerald-500/10 dark:bg-emerald-400/10"
                            : isShorted
                            ? "border-zinc-300 dark:border-zinc-700 bg-amber-500/10 dark:bg-amber-400/10"
                            : "border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              {isComplete ? (
                                <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400" />
                              ) : isShorted ? (
                                <AlertCircle size={18} className="text-amber-600 dark:text-amber-400" />
                              ) : (
                                <AlertCircle size={18} className="text-zinc-400 dark:text-zinc-600" />
                              )}
                              <span className="font-mono font-semibold text-zinc-900 dark:text-white">
                                {item.sku}
                              </span>
                              {isProcessed && (
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full font-medium ml-auto ${
                                    isComplete
                                      ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                                      : "bg-amber-500/20 text-amber-700 dark:text-amber-300"
                                  }`}
                                >
                                  {isComplete ? "Complete" : "Shorted"}
                                </span>
                              )}
                              {!isProcessed && (
                                <span className="text-xs px-2 py-0.5 rounded-full font-medium ml-auto bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400">
                                  Not Processed
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2 truncate">
                              {item.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-zinc-600 dark:text-zinc-400">
                              <span>Location: {item.location}</span>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className={`text-2xl font-bold leading-none ${
                              isComplete
                                ? "text-emerald-600 dark:text-emerald-400"
                                : isShorted
                                ? "text-amber-600 dark:text-amber-400"
                                : "text-zinc-900 dark:text-white"
                            }`}>
                              {processedQty} / {totalQty}
                            </div>
                            <div className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">quantity</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  </div>
                </div>

                {/* Pinned Bottom Section */}
                <div className="flex-shrink-0 px-6 pb-6">
                  {/* Summary Stats */}
                  <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-zinc-900 dark:text-white">{items.length}</div>
                      <div className="text-xs text-zinc-600 dark:text-zinc-400">Total Items</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[#0d9488] dark:text-[#50e080]">
                        {Array.from(processedItems.values()).filter(qty => qty > 0).length}
                      </div>
                      <div className="text-xs text-zinc-600 dark:text-zinc-400">Processed</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-zinc-900 dark:text-white">
                        {items.reduce((sum, item) => sum + item.quantity, 0)}
                      </div>
                      <div className="text-xs text-zinc-600 dark:text-zinc-400">Total Quantity</div>
                    </div>
                    <div>
                      <div className={`text-2xl font-bold ${
                        (() => {
                          const hasAnyShorted = items.some(item => {
                            const processedQty = processedItems.get(item.id) || 0;
                            return processedQty > 0 && processedQty < item.quantity;
                          });
                          const allComplete = items.every(item => {
                            const processedQty = processedItems.get(item.id) || 0;
                            return processedQty === item.quantity;
                          });
                          return allComplete
                            ? "text-emerald-600 dark:text-emerald-400"
                            : hasAnyShorted
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-[#0d9488] dark:text-[#50e080]";
                        })()
                      }`}>
                        {Array.from(processedItems.values()).reduce((sum, qty) => sum + qty, 0)}
                      </div>
                      <div className="text-xs text-zinc-600 dark:text-zinc-400">Quantity Processed</div>
                    </div>
                  </div>
                  </div>

                  {/* Action Message */}
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4 mb-4">
                  <p className="text-sm text-emerald-900 dark:text-emerald-200">
                    <strong>Pick List Complete!</strong> Click below to finalize this pick session and unregister the sortbar.
                  </p>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={handleCompleteConfirmation}
                    className="w-full px-6 py-3 bg-[#0d9488]/80 dark:bg-[#50e080]/80 hover:bg-[#0d9488] dark:hover:bg-[#50e080] text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Check size={20} />
                    Confirm Completion
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Adjust Inventory Modal */}
      <AnimatePresence>
        {showAdjustInventory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleAdjustInventoryCancel} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-xl overflow-hidden"
            >
              <div className="bg-blue-600 dark:bg-blue-500 p-6 text-white">
                <h2 className="text-xl font-bold">
                  {adjustInventoryStep === "select-item" && "Select Item to Adjust"}
                  {adjustInventoryStep === "adjust-quantity" && "Adjust Quantity"}
                  {adjustInventoryStep === "reason-code" && "Adjustment Reason"}
                </h2>
                <p className="text-white/80 mt-1 text-sm">
                  {adjustInventoryStep === "select-item" && "Choose which item to adjust inventory for"}
                  {adjustInventoryStep === "adjust-quantity" && "Enter the quantity adjustment (+/-)"}
                  {adjustInventoryStep === "reason-code" && "Provide a reason for this adjustment"}
                </p>
              </div>

              <div className="p-6">
                {/* Step 1: Select Item */}
                {adjustInventoryStep === "select-item" && (
                  <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                    {items.map((item) => {
                      const currentQty = compartmentInventory.get(item.compartmentLpn) || 0;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleAdjustItemSelect(item)}
                          className="w-full text-left p-4 rounded-lg border-2 border-zinc-300 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="font-mono text-sm font-bold text-zinc-900 dark:text-white mb-1">
                                {item.sku}
                              </div>
                              <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                                {item.description}
                              </div>
                              <div className="flex items-center gap-3 text-xs text-zinc-600 dark:text-zinc-400">
                                <span>Bin: {item.binNumber}</span>
                                <span>Compartment: <span className="font-mono text-[#0d9488] dark:text-[#50e080] font-bold">
                                  {item.compartmentLpn.split('-').pop()}
                                </span></span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-zinc-900 dark:text-white">
                                {currentQty}
                              </div>
                              <div className="text-xs text-zinc-600 dark:text-zinc-400">units</div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Step 2: Adjust Quantity */}
                {adjustInventoryStep === "adjust-quantity" && selectedAdjustItem && (
                  <div>
                    <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-4 mb-4">
                      <div className="font-mono text-sm font-bold text-zinc-900 dark:text-white mb-1">
                        {selectedAdjustItem.sku}
                      </div>
                      <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                        {selectedAdjustItem.description}
                      </div>
                      <div className="text-xs text-zinc-600 dark:text-zinc-400">
                        Bin: {selectedAdjustItem.binNumber} · Compartment: <span className="font-mono text-[#0d9488] dark:text-[#50e080] font-bold">
                          {selectedAdjustItem.compartmentLpn.split('-').pop()}
                        </span>
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Current Quantity
                      </label>
                      <div className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">
                        {compartmentInventory.get(selectedAdjustItem.compartmentLpn) || 0} units
                      </div>

                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Adjustment Amount
                      </label>
                      <div className="flex items-center gap-3 mb-3">
                        <button
                          onClick={() => setAdjustInventoryDelta(Math.max(adjustInventoryDelta - 1, -(compartmentInventory.get(selectedAdjustItem.compartmentLpn) || 0)))}
                          className="w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold text-xl transition-colors"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={adjustInventoryDelta}
                          onChange={(e) => setAdjustInventoryDelta(parseInt(e.target.value) || 0)}
                          className="flex-1 px-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          onClick={() => setAdjustInventoryDelta(adjustInventoryDelta + 1)}
                          className="w-12 h-12 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold text-xl transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                        <div className="text-sm text-blue-900 dark:text-blue-300">
                          New quantity: <span className="font-bold">
                            {(compartmentInventory.get(selectedAdjustItem.compartmentLpn) || 0) + adjustInventoryDelta} units
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={handleAdjustInventoryBack}
                        className="flex-1 px-4 py-3 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-lg font-medium transition-colors"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleAdjustQuantityConfirm}
                        disabled={adjustInventoryDelta === 0}
                        className="flex-1 px-4 py-3 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Reason Code */}
                {adjustInventoryStep === "reason-code" && selectedAdjustItem && (
                  <div>
                    <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-4 mb-4">
                      <div className="font-mono text-sm font-bold text-zinc-900 dark:text-white mb-1">
                        {selectedAdjustItem.sku} - {selectedAdjustItem.compartmentLpn.split('-').pop()}
                      </div>
                      <div className="text-sm text-zinc-600 dark:text-zinc-400">
                        Adjustment: <span className={`font-bold ${adjustInventoryDelta > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                          {adjustInventoryDelta > 0 ? '+' : ''}{adjustInventoryDelta}
                        </span> units
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
                        Reason Code
                      </label>
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {["Count Error", "Damaged", "Lost", "Found", "System Error", "Other"].map((code) => (
                          <button
                            key={code}
                            onClick={() => setAdjustInventoryReasonCode(code)}
                            className={`px-3 py-2 text-sm rounded-lg font-medium transition-colors text-left ${
                              adjustInventoryReasonCode === code
                                ? "bg-blue-600 dark:bg-blue-500 text-white"
                                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700"
                            }`}
                          >
                            {code}
                          </button>
                        ))}
                      </div>
                      <input
                        type="text"
                        value={adjustInventoryReasonCode}
                        onChange={(e) => setAdjustInventoryReasonCode(e.target.value)}
                        placeholder="Or enter custom reason..."
                        className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={handleAdjustInventoryBack}
                        className="flex-1 px-4 py-3 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-lg font-medium transition-colors"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleAdjustInventoryFinalConfirm}
                        disabled={!adjustInventoryReasonCode.trim()}
                        className="flex-1 px-4 py-3 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Confirm Adjustment
                      </button>
                    </div>
                  </div>
                )}

                {adjustInventoryStep === "select-item" && (
                  <button
                    onClick={handleAdjustInventoryCancel}
                    className="w-full mt-3 px-4 py-3 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SKU Verification Modal */}
      <AnimatePresence>
        {showSkuVerification && selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleSkuVerificationCancel} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-xl overflow-hidden"
            >
              <div className="bg-[#0d9488]/80 dark:bg-[#50e080]/80 p-6 text-white">
                <h2 className="text-xl font-bold">Verify SKU</h2>
                <p className="text-white/80 mt-1 text-sm">
                  Scan or enter the SKU to confirm the item
                </p>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-4 mb-4">
                    <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                      {selectedItem.description}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-600 dark:text-zinc-400">Expected SKU:</span>
                      <span className="font-mono text-lg font-bold text-[#0d9488] dark:text-[#50e080]">
                        {selectedItem.sku}
                      </span>
                    </div>
                  </div>

                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Scan or Enter SKU
                  </label>
                  <input
                    type="text"
                    value={skuVerificationInput}
                    onChange={(e) => setSkuVerificationInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSkuVerificationSubmit()}
                    placeholder="Scan barcode or type SKU..."
                    className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#0d9488] dark:focus:ring-[#50e080] focus:border-transparent text-lg font-mono uppercase"
                    autoFocus
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleSkuVerificationCancel}
                    className="flex-1 px-4 py-3 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSkuVerificationSubmit}
                    disabled={!skuVerificationInput.trim()}
                    className="flex-1 px-4 py-3 bg-[#0d9488]/80 dark:bg-[#50e080]/80 hover:bg-[#0d9488] dark:hover:bg-[#50e080] text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Verify
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History Side Panel */}
      <AnimatePresence>
        {showHistory && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistory(false)}
              className="fixed inset-0 bg-black/30 z-40"
            />
            
            {/* Side Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-[600px] bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl z-50 overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-zinc-100 dark:bg-zinc-800 p-6 border-b border-zinc-200 dark:border-zinc-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#0d9488]/80 dark:bg-[#50e080]/80 rounded-lg flex items-center justify-center">
                      <History size={20} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Workstation History</h2>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">Last 10 operations on this terminal</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowHistory(false)}
                    className="w-10 h-10 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <X size={20} className="text-zinc-900 dark:text-white" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="space-y-4">
                  {mockWorkstationHistory.map((entry, index) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 hover:border-[#0d9488]/50 dark:hover:border-[#50e080]/50 transition-all"
                    >
                      {/* Header Row */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-zinc-900 dark:text-white">{entry.action}</h3>
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                              entry.status === "Success"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : entry.status === "Warning"
                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                : "bg-red-500/10 text-red-600 dark:text-red-400"
                            }`}>
                              {entry.status}
                            </span>
                          </div>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">{entry.details}</p>
                        </div>
                      </div>
                      
                      {/* Footer Row */}
                      <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-500 pt-3 border-t border-zinc-200 dark:border-zinc-700">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-[#0d9488]/10 dark:bg-[#50e080]/10 rounded-full flex items-center justify-center">
                            <span className="text-[10px] font-semibold text-[#0d9488] dark:text-[#50e080]">
                              {entry.operator.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <span className="font-medium text-zinc-700 dark:text-zinc-300">{entry.operator}</span>
                        </div>
                        <span className="font-mono">{entry.timestamp}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Empty State or Load More */}
                {mockWorkstationHistory.length === 0 && (
                  <div className="text-center py-12">
                    <History size={48} className="mx-auto mb-4 text-zinc-400 dark:text-zinc-600" />
                    <p className="text-zinc-600 dark:text-zinc-400">No history available</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Change Container Modal */}
      <AnimatePresence>
        {showChangeContainer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleChangeContainerCancel} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-xl overflow-hidden"
            >
              <div className="bg-[#0d9488]/80 dark:bg-[#50e080]/80 p-6 text-white">
                <h2 className="text-xl font-bold">Change Container</h2>
                <p className="text-white/80 mt-1 text-sm">
                  Enter new container LPN and select action
                </p>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    New Container LPN
                  </label>
                  <input
                    type="text"
                    value={newContainerLpn}
                    onChange={(e) => setNewContainerLpn(e.target.value)}
                    placeholder="Scan or enter LPN..."
                    className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#0d9488] dark:focus:ring-[#50e080] focus:border-transparent text-lg font-mono"
                    autoFocus
                  />
                  <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-2">
                    Current: {currentContainerLpn}
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => handleChangeContainerSubmit("swap")}
                    disabled={!newContainerLpn.trim()}
                    className="w-full px-4 py-3 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left"
                  >
                    <div className="font-semibold">Swap</div>
                    <div className="text-xs text-white/80">Move to next item with new container</div>
                  </button>
                  <button
                    onClick={() => handleChangeContainerSubmit("split")}
                    disabled={!newContainerLpn.trim()}
                    className="w-full px-4 py-3 bg-amber-600 dark:bg-amber-500 hover:bg-amber-700 dark:hover:bg-amber-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left"
                  >
                    <div className="font-semibold">Split</div>
                    <div className="text-xs text-white/80">Prompt to continue picking current item</div>
                  </button>
                  <button
                    onClick={() => handleChangeContainerSubmit("change")}
                    disabled={!newContainerLpn.trim()}
                    className="w-full px-4 py-3 bg-[#0d9488]/80 dark:bg-[#50e080]/80 hover:bg-[#0d9488] dark:hover:bg-[#50e080] text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left"
                  >
                    <div className="font-semibold">Change</div>
                    <div className="text-xs text-white/80">Replace container for all remaining items</div>
                  </button>
                </div>

                <button
                  onClick={handleChangeContainerCancel}
                  className="w-full mt-4 px-4 py-3 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reason Code Modal */}
      <AnimatePresence>
        {showReasonCodeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleReasonCodeCancel} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-xl overflow-hidden"
            >
              <div className="bg-amber-600 dark:bg-amber-500 p-6 text-white">
                <h2 className="text-xl font-bold">Item Shorted - Reason Required</h2>
                <p className="text-white/80 mt-1 text-sm">
                  You are shorting this item. Please provide a reason code.
                </p>
              </div>

              <div className="p-6">
                {pendingShortItem && (
                  <div className="mb-4 p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">Item</div>
                    <div className="font-mono font-bold text-zinc-900 dark:text-white">{pendingShortItem.sku}</div>
                    <div className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                      Picked: {processedQuantity} / {pendingShortItem.quantity} ({Math.round((processedQuantity / pendingShortItem.quantity) * 100)}%)
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Reason Code
                  </label>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {["Out of Stock", "Damaged", "Mispick", "Customer Request", "Wrong Location", "Other"].map((code) => (
                      <button
                        key={code}
                        onClick={() => setReasonCodeInput(code)}
                        className={`px-3 py-2 text-sm rounded-lg font-medium transition-colors text-left ${
                          reasonCodeInput === code
                            ? "bg-amber-600 dark:bg-amber-500 text-white"
                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700"
                        }`}
                      >
                        {code}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={reasonCodeInput}
                    onChange={(e) => setReasonCodeInput(e.target.value)}
                    placeholder="Or enter custom reason..."
                    className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <button
                    onClick={handleReasonCodeSubmit}
                    disabled={!reasonCodeInput.trim()}
                    className="w-full px-4 py-3 bg-amber-600 dark:bg-amber-500 hover:bg-amber-700 dark:hover:bg-amber-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Confirm Short
                  </button>
                  <button
                    onClick={handleReasonCodeCancel}
                    className="w-full px-4 py-3 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compartment Empty Confirmation Modal */}
      <AnimatePresence>
        {showCompartmentEmptyConfirm && pendingCompartmentEmpty && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-xl overflow-hidden"
            >
              <div className="bg-blue-600 dark:bg-blue-500 p-6 text-white">
                <h2 className="text-xl font-bold">Confirm Compartment Empty</h2>
                <p className="text-white/80 mt-1 text-sm">
                  Verify that the compartment is now empty
                </p>
              </div>

              <div className="p-6">
                <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-4 mb-6">
                  <div className="text-center">
                    <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                      Compartment
                    </div>
                    <div className="text-4xl font-bold font-mono text-[#0d9488] dark:text-[#50e080] mb-3">
                      {pendingCompartmentEmpty.compartmentId}
                    </div>
                    <div className="font-mono text-sm font-semibold text-zinc-900 dark:text-white mb-1">
                      {pendingCompartmentEmpty.item.sku}
                    </div>
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">
                      {pendingCompartmentEmpty.item.description}
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
                  <p className="text-sm text-amber-900 dark:text-amber-200">
                    <strong>Please verify:</strong> You picked all items from this compartment. Is compartment <span className="font-mono font-bold">{pendingCompartmentEmpty.compartmentId}</span> now empty?
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleCompartmentEmptyConfirm(false)}
                    className="flex-1 px-6 py-3 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-lg font-semibold transition-colors"
                  >
                    No, Not Empty
                  </button>
                  <button
                    onClick={() => handleCompartmentEmptyConfirm(true)}
                    className="flex-1 px-6 py-3 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
                  >
                    Yes, Confirmed Empty
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Swap Prompt Modal */}
      <AnimatePresence>
        {showSwapPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-xl overflow-hidden"
            >
              <div className="bg-blue-600 dark:bg-blue-500 p-6 text-white">
                <h2 className="text-xl font-bold">Next Item Container</h2>
                <p className="text-white/80 mt-1 text-sm">
                  Which container should the next item go into?
                </p>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <p className="text-zinc-700 dark:text-zinc-300 mb-2">
                    Choose whether to continue with the new container or return to the original.
                  </p>
                  <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-3">
                    <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">Current Container:</div>
                    <div className="font-mono text-sm font-bold text-[#0d9488] dark:text-[#50e080]">{currentContainerLpn}</div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 mb-1">Original Container:</div>
                    <div className="font-mono text-sm font-bold text-zinc-600 dark:text-zinc-400">{originalContainerLpn}</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => handleSwapContinue(true)}
                    className="w-full px-4 py-3 bg-[#0d9488]/80 dark:bg-[#50e080]/80 hover:bg-[#0d9488] dark:hover:bg-[#50e080] text-white rounded-lg font-medium transition-colors text-left"
                  >
                    <div className="font-semibold">Use New Container</div>
                    <div className="text-xs text-white/80">Continue with {currentContainerLpn}</div>
                  </button>
                  <button
                    onClick={() => handleSwapContinue(false)}
                    className="w-full px-4 py-3 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors text-left"
                  >
                    <div className="font-semibold">Use Original Container</div>
                    <div className="text-xs text-white/80">Return to {originalContainerLpn}</div>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend Side Panel */}
      <AnimatePresence>
        {showLegend && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLegend(false)}
              className="fixed inset-0 bg-black/30 z-40"
            />
            
            {/* Side Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-[500px] bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl z-50 overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-zinc-100 dark:bg-zinc-800 p-6 border-b border-zinc-200 dark:border-zinc-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#0d9488]/80 dark:bg-[#50e080]/80 rounded-lg flex items-center justify-center">
                      <Info size={20} className="text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Color Legend</h2>
                  </div>
                  <button
                    onClick={() => setShowLegend(false)}
                    className="w-10 h-10 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <X size={20} className="text-zinc-900 dark:text-white" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-8">
                {/* Sortbar Locations Section */}
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                    <Grid3x3 size={18} className="text-[#0d9488] dark:text-[#50e080]" />
                    Sortbar Locations
                  </h3>
                  <div className="space-y-3">
                    {/* Available */}
                    <div className="p-3 rounded-lg border-2 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900">
                      <div className="font-semibold text-zinc-900 dark:text-white mb-1">Available</div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">Sortbar is ready for registration and use</p>
                    </div>
                    
                    {/* Selected (Not Registered) */}
                    <div className="p-3 rounded-lg border-2 border-[#0d9488] dark:border-[#50e080] bg-[#0d9488]/10 dark:bg-[#50e080]/10">
                      <div className="font-semibold text-zinc-900 dark:text-white mb-1">Selected (Not Registered)</div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">Sortbar is selected for registration</p>
                    </div>
                    
                    {/* In Use (Registered) */}
                    <div className="p-3 rounded-lg border-2 border-blue-500/30 dark:border-blue-400/30 bg-blue-500/5 dark:bg-blue-400/5">
                      <div className="font-semibold text-zinc-900 dark:text-white mb-1">In Use (Registered)</div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">Sortbar is registered with a work list</p>
                    </div>
                    
                    {/* Active & Registered - Flashing Border */}
                    <div className="p-3 rounded-lg border-[3px] bg-blue-500/5 dark:bg-blue-400/5 animate-pulse" style={{ borderColor: 'rgb(59 130 246)' }}>
                      <div className="font-semibold text-zinc-900 dark:text-white mb-1 flex items-center gap-2">
                        Active & Working
                        <span className="inline-block px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">Flashing</span>
                      </div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">Currently viewing/processing items from this sortbar. The flashing blue border helps you identify which sortbar you're actively working on.</p>
                    </div>

                    {/* Maintenance */}
                    <div className="p-3 rounded-lg border-2 border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800/50 opacity-50">
                      <div className="font-semibold text-zinc-900 dark:text-white mb-1">Maintenance</div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">Sortbar is unavailable (disabled)</p>
                    </div>
                  </div>
                </div>

                {/* Items Section */}
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                    <Package size={18} className="text-[#0d9488] dark:text-[#50e080]" />
                    Items Status
                  </h3>
                  <div className="space-y-3">
                    {/* Selected Item */}
                    <div className="p-3 rounded-lg border border-[#0d9488] dark:border-[#50e080] bg-[#0d9488]/5 dark:bg-[#50e080]/5">
                      <div className="font-semibold text-zinc-900 dark:text-white mb-1">Selected Item</div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">Currently processing this item</p>
                    </div>
                    
                    {/* Completed (Full Quantity) */}
                    <div className="p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-emerald-500/10 dark:bg-emerald-400/10">
                      <div className="font-semibold text-emerald-700 dark:text-emerald-400 mb-1">Completed</div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">Full quantity processed (100%)</p>
                    </div>
                    
                    {/* Partial/Shorted */}
                    <div className="p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-amber-500/10 dark:bg-amber-400/10">
                      <div className="font-semibold text-amber-700 dark:text-amber-400 mb-1">Partial/Shorted</div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">Less than expected quantity processed</p>
                    </div>
                    
                    {/* Pending */}
                    <div className="p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900">
                      <div className="font-semibold text-zinc-900 dark:text-white mb-1">Pending</div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">Not yet processed</p>
                    </div>
                  </div>
                </div>

                {/* Priority Indicators */}
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                    <AlertCircle size={18} className="text-[#0d9488] dark:text-[#50e080]" />
                    Priority Levels
                  </h3>
                  <div className="space-y-3">
                    {/* High Priority */}
                    <div className="p-3 rounded-lg border border-zinc-300 dark:border-zinc-700">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-600 dark:text-red-400">
                          High
                        </span>
                        <Flame size={16} className="text-orange-500" />
                      </div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">Urgent work items (may include flame icon)</p>
                    </div>
                    
                    {/* Normal Priority */}
                    <div className="p-3 rounded-lg border border-zinc-300 dark:border-zinc-700">
                      <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 mb-1">
                        Normal
                      </span>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">Standard work items</p>
                    </div>
                  </div>
                </div>

                {/* Work Status */}
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-[#0d9488] dark:text-[#50e080]" />
                    Work Status
                  </h3>
                  <div className="space-y-3">
                    {/* In Progress */}
                    <div className="p-3 rounded-lg border border-zinc-300 dark:border-zinc-700">
                      <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-1">
                        In Progress
                      </span>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">Work is actively being processed</p>
                    </div>
                    
                    {/* Completed */}
                    <div className="p-3 rounded-lg border border-zinc-300 dark:border-zinc-700">
                      <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-[#0d9488]/10 dark:bg-[#50e080]/10 text-[#0d9488] dark:text-[#50e080] mb-1">
                        Completed
                      </span>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">Work has been finished</p>
                    </div>
                    
                    {/* Queued */}
                    <div className="p-3 rounded-lg border border-zinc-300 dark:border-zinc-700">
                      <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 mb-1">
                        Queued
                      </span>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">Waiting to be started</p>
                    </div>
                  </div>
                </div>

                {/* Statistics Colors */}
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Statistics Colors</h3>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg border border-zinc-300 dark:border-zinc-700">
                      <div className="font-semibold text-emerald-600 dark:text-emerald-400 mb-1">Green</div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">All items fully processed</p>
                    </div>
                    
                    <div className="p-3 rounded-lg border border-zinc-300 dark:border-zinc-700">
                      <div className="font-semibold text-amber-600 dark:text-amber-400 mb-1">Amber/Yellow</div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">Some items shorted or partially processed</p>
                    </div>
                    
                    <div className="p-3 rounded-lg border border-zinc-300 dark:border-zinc-700">
                      <div className="font-semibold text-[#0d9488] dark:text-[#50e080] mb-1">Teal/Green</div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">Active processing or brand accent color</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Number Pad Popup */}
      <AnimatePresence>
        {showNumberPad && selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            onClick={handleNumberPadCancel}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 w-full max-w-md"
            >
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Enter Quantity</h3>
                  <button
                    onClick={handleNumberPadCancel}
                    className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Max: {selectedItem.quantity} units
                </p>
              </div>

              {/* Display */}
              <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-4 mb-6 border-2 border-zinc-200 dark:border-zinc-700">
                <div className="text-4xl font-bold text-center text-zinc-900 dark:text-white min-h-[3rem] flex items-center justify-center">
                  {quantityInput || "0"}
                </div>
                <div className="text-center text-sm text-zinc-500 dark:text-zinc-400 mt-2">
                  / {selectedItem.quantity}
                </div>
              </div>

              {/* Number Pad */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => (
                  <button
                    key={digit}
                    onClick={() => handleNumberPadInput(digit)}
                    className="bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white text-2xl font-semibold rounded-lg py-4 transition-colors active:scale-95"
                  >
                    {digit}
                  </button>
                ))}
                <button
                  onClick={() => handleNumberPadInput("clear")}
                  className="bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 text-lg font-semibold rounded-lg py-4 transition-colors active:scale-95"
                >
                  Clear
                </button>
                <button
                  onClick={() => handleNumberPadInput("0")}
                  className="bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white text-2xl font-semibold rounded-lg py-4 transition-colors active:scale-95"
                >
                  0
                </button>
                <button
                  onClick={() => handleNumberPadInput("backspace")}
                  className="bg-amber-100 dark:bg-amber-900/30 hover:bg-amber-200 dark:hover:bg-amber-900/50 text-amber-600 dark:text-amber-400 text-lg font-semibold rounded-lg py-4 transition-colors active:scale-95 flex items-center justify-center"
                >
                  ←
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleNumberPadCancel}
                  className="flex-1 px-6 py-3 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleNumberPadConfirm}
                  disabled={!quantityInput || parseInt(quantityInput) > selectedItem.quantity}
                  className="flex-1 px-6 py-3 bg-[#0d9488]/80 dark:bg-[#50e080]/80 hover:bg-[#0d9488] dark:hover:bg-[#50e080] text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Check size={20} />
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}