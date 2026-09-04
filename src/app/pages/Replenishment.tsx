import { useState } from "react";
import { Link } from "react-router-dom";
import { RefreshCw, Grid3x3, Package, Box, CheckCircle2, AlertCircle, Scan, List, X, ArrowLeft, ClipboardList, Flame, Plus, Minus, Check, Info, History, ChevronRight, Home } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
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
const mockReplenishmentLists = [
  { id: "WL-REP-001", name: "Replen A-Zone Morning", priority: "High", itemCount: 8, status: "Ready" },
  { id: "WL-REP-002", name: "Replen B-Zone AM", priority: "Normal", itemCount: 8, status: "Ready" },
  { id: "WL-REP-003", name: "Replen C-Zone Priority", priority: "High", itemCount: 8, status: "Ready" },
  { id: "WL-REP-004", name: "Replen Multi-Zone", priority: "Normal", itemCount: 8, status: "Ready" },
  { id: "WL-REP-005", name: "Replen Express", priority: "High", itemCount: 8, status: "Ready" },
];

// Generate mock work list detail
const generateWorkListDetail = (listId: string): WorkItem => {
  const listData = mockReplenishmentLists.find(l => l.id === listId);
  return {
    id: listId,
    workList: listId,
    type: "Replenishment",
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
  return [
    { id: "ITM-001", sku: "SKU-12345", description: "Widget A - Blue", quantity: 50, location: "A-12-03", priority: "High", containerName: "CONT-A-001" },
    { id: "ITM-002", sku: "SKU-12346", description: "Widget B - Red", quantity: 75, location: "A-14-05", priority: "Normal", containerName: "CONT-A-002" },
    { id: "ITM-003", sku: "SKU-12347", description: "Gadget C - Green", quantity: 30, location: "B-08-02", priority: "High", containerName: "CONT-B-001" },
    { id: "ITM-004", sku: "SKU-12348", description: "Tool D - Black", quantity: 100, location: "B-10-07", priority: "Normal", containerName: "CONT-B-002" },
    { id: "ITM-005", sku: "SKU-12349", description: "Part E - Silver", quantity: 45, location: "C-05-01", priority: "High", containerName: "CONT-C-001" },
    { id: "ITM-006", sku: "SKU-12350", description: "Component F - Yellow", quantity: 60, location: "A-18-04", priority: "Normal", containerName: "CONT-A-003" },
    { id: "ITM-007", sku: "SKU-12351", description: "Assembly G - Orange", quantity: 25, location: "B-12-06", priority: "High", containerName: "CONT-B-003" },
    { id: "ITM-008", sku: "SKU-12352", description: "Module H - Purple", quantity: 90, location: "C-09-03", priority: "Normal", containerName: "CONT-C-002" },
  ];
};

export function Replenishment() {
  const [selectedSortbar, setSelectedSortbar] = useState<string | null>(null);
  const [registrationMethod, setRegistrationMethod] = useState<"list" | "lpn" | null>(null);
  const [showListSelection, setShowListSelection] = useState(false);
  const [showLpnInput, setShowLpnInput] = useState(false);
  const [selectedList, setSelectedList] = useState<string | null>(null);
  const [lpnInput, setLpnInput] = useState("");
  const [items, setItems] = useState<ReplenItem[]>([]);
  const [sortbarRegistrations, setSortbarRegistrations] = useState<SortbarRegistration[]>([]);
  const [showSortbarMenu, setShowSortbarMenu] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ReplenItem | null>(null);
  const [processedQuantity, setProcessedQuantity] = useState(0);
  const [isEditingQuantity, setIsEditingQuantity] = useState(false);
  const [quantityInput, setQuantityInput] = useState("");
  const [processedItems, setProcessedItems] = useState<Map<string, number>>(new Map());
  const [showCompletionConfirmation, setShowCompletionConfirmation] = useState(false);
  const [activeSortbar, setActiveSortbar] = useState<string | null>(null); // Track which sortbar is currently active/selected for viewing
  const [showNumberPad, setShowNumberPad] = useState(false);
  const [showLegend, setShowLegend] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [sortbarCount, setSortbarCount] = useState<2 | 5 | 8 | 10 | 16 | 40>(40);
  const [panelView, setPanelView] = useState<"menu" | "list" | "lpn" | "details">("menu"); // Track which view is shown in the right panel

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

    // If registered, load its data and show side panel for actions
    const registration = getRegistration(sortbarId);
    if (registration) {
      setShowSortbarMenu(true); // Show side panel with Unregister/Details options
      setItems([...registration.items]);
      setSelectedList(registration.workListId);
      setProcessedItems(new Map(registration.processedItems));
      
      // Load previously selected item or first item
      const targetItem = registration.items.find(item => item.id === registration.selectedItemId) || registration.items[0];
      if (targetItem) {
        setSelectedItem(targetItem);
        setProcessedQuantity(registration.processedItems.get(targetItem.id) ?? targetItem.quantity);
      }
    } else {
      // Not registered - show menu for registration
      setShowSortbarMenu(true);
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
    // Simulate registration
    const itemsList = generateMockItems(listId);
    setItems(itemsList);
    setProcessedItems(new Map());
    
    // Auto-select first item
    if (itemsList.length > 0) {
      setSelectedItem(itemsList[0]);
      setProcessedQuantity(itemsList[0].quantity);
    }
    
    // Add to registrations
    if (selectedSortbar) {
      const sortbarData = initialSortbars.find(s => s.id === selectedSortbar);
      const listData = mockReplenishmentLists.find(l => l.id === listId);
      
      setSortbarRegistrations([
        ...sortbarRegistrations,
        { 
          sortbarId: selectedSortbar, 
          workListId: listId, 
          registrationMethod: "list", 
          itemCount: listData?.itemCount || 0,
          items: itemsList,
          processedItems: new Map(),
          selectedItemId: itemsList[0]?.id || null
        }
      ]);
      
      // Set as active sortbar
      setActiveSortbar(selectedSortbar);
      
      // Show success toast
      toast.success("Replenishment Registered", {
        description: `${sortbarData?.name} - List: ${listData?.name}`,
        duration: 5000,
        style: {
          background: 'rgb(22 163 74)',
          color: 'white',
          border: '2px solid rgb(21 128 61)',
          fontSize: '1.125rem',
          padding: '1rem 1.5rem',
        },
      });
    }

    setPanelView("menu");
  };

  const handleLpnSubmit = () => {
    if (lpnInput.trim() && selectedSortbar) {
      // Simulate registration with LPN
      const itemsList = generateMockItems(lpnInput);
      setItems(itemsList);
      setProcessedItems(new Map());
      
      // Auto-select first item
      if (itemsList.length > 0) {
        setSelectedItem(itemsList[0]);
        setProcessedQuantity(itemsList[0].quantity);
      }
      
      // Add to registrations
      const sortbarData = initialSortbars.find(s => s.id === selectedSortbar);
      
      setSortbarRegistrations([
        ...sortbarRegistrations,
        { 
          sortbarId: selectedSortbar, 
          workListId: lpnInput, 
          lpn: lpnInput, 
          registrationMethod: "lpn", 
          itemCount: 0,
          items: itemsList,
          processedItems: new Map(),
          selectedItemId: itemsList[0]?.id || null
        }
      ]);
      
      // Set as active sortbar
      setActiveSortbar(selectedSortbar);
      
      // Show success toast
      toast.success("Replenishment Registered", {
        description: `${sortbarData?.name} - LPN: ${lpnInput}`,
        duration: 5000,
        style: {
          background: 'rgb(22 163 74)',
          color: 'white',
          border: '2px solid rgb(21 128 61)',
          fontSize: '1.125rem',
          padding: '1rem 1.5rem',
        },
      });

      setPanelView("menu");
      setLpnInput("");
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

  const handleItemSelect = (item: ReplenItem) => {
    setSelectedItem(item);
    // Load previously processed quantity if exists, otherwise default to item's quantity
    setProcessedQuantity(processedItems.get(item.id) ?? item.quantity);
    setIsEditingQuantity(false);
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
    if (selectedItem) {
      // Save the processed quantity for this item
      const newProcessedItems = new Map(processedItems);
      newProcessedItems.set(selectedItem.id, processedQuantity);
      setProcessedItems(newProcessedItems);
      
      // Find current index
      const currentIndex = items.findIndex(i => i.id === selectedItem.id);
      const isLastItem = currentIndex === items.length - 1;
      
      if (!isLastItem) {
        // Move to next item
        setSelectedItem(items[currentIndex + 1]);
        setProcessedQuantity(newProcessedItems.get(items[currentIndex + 1].id) ?? items[currentIndex + 1].quantity);
        setIsEditingQuantity(false);
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
          alert(`Warning: ${unprocessedItems.length} item(s) have not been processed. Please review all items.`);
        }
        
        // Show completion confirmation regardless
        setShowCompletionConfirmation(true);
      }
    }
  };

  const handleProcessMore = () => {
    setShowCompletionConfirmation(false);
    // Go back to first unprocessed item or first item
    const firstUnprocessed = items.find(item => 
      !processedItems.has(item.id) || (processedItems.get(item.id) || 0) === 0
    );
    const targetItem = firstUnprocessed || items[0];
    if (targetItem) {
      setSelectedItem(targetItem);
      setProcessedQuantity(processedItems.get(targetItem.id) ?? targetItem.quantity);
    }
  };

  const handleCompleteConfirmation = () => {
    setShowCompletionConfirmation(false);
    // Reset everything
    setProcessedItems(new Map());
    setItems([]);
    setSelectedItem(null);
    setProcessedQuantity(0);
    if (selectedSortbar) {
      setSortbarRegistrations(sortbarRegistrations.filter(reg => reg.sortbarId !== selectedSortbar));
    }
    setSelectedSortbar(null);
    setSelectedList(null);
  };

  const selectedSortbarData = initialSortbars.find(sb => sb.id === selectedSortbar);
  const selectedListData = mockReplenishmentLists.find(list => list.id === selectedList);
  const currentRegistration = selectedSortbar ? getRegistration(selectedSortbar) : null;
  const workListDetail = selectedList ? generateWorkListDetail(selectedList) : null;
  const workLines = selectedList ? generateWorkLines(selectedList) : [];
  const workOperations = selectedList ? generateWorkOperations(workLines) : [];

  return (
    <div className="p-8 min-h-screen">
      {/* Breadcrumb */}
      <div className="mb-6">
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
          <span className="text-zinc-900 dark:text-white font-medium">Replenishment</span>
        </nav>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-[#0d9488] dark:bg-[#50e080] rounded-xl flex items-center justify-center">
            <RefreshCw size={24} className="text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">
              Replenishment
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Workstation Operations
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowHistory(true)}
              className="px-4 py-2 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <History size={20} />
              History
            </button>
            <button
              onClick={() => setShowLegend(true)}
              className="px-4 py-2 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Info size={20} />
              Legend
            </button>
          </div>
        </div>
      </div>

      <div
        className={`grid grid-cols-12 gap-4 transition-all duration-500 ease-in-out ${
              showSortbarMenu && panelView === "menu" ? 'mr-[400px]' : showSortbarMenu && panelView !== "menu" ? 'mr-0' : 'mr-0'
            }`}
          >
            {/* Sortbar Locations Section */}
            <div className="col-span-5">
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
                <div className="bg-zinc-100 dark:bg-zinc-800 p-4 border-b border-zinc-200 dark:border-zinc-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Grid3x3 size={20} className="text-[#0d9488] dark:text-[#50e080]" />
                      <h2 className="font-semibold text-zinc-900 dark:text-white">Sortbar Locations</h2>
                    </div>
                    <div className="flex items-center gap-2">
                      {[2, 5, 8, 10, 16, 40].map((count) => (
                        <button
                          key={count}
                          onClick={() => setSortbarCount(count as 2 | 5 | 8 | 10 | 16 | 40)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            sortbarCount === count
                              ? "bg-[#0d9488] dark:bg-[#50e080] text-white"
                              : "bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600"
                          }`}
                        >
                          {count}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-4 max-h-[calc(100vh-220px)] overflow-y-auto">
                  {/* Helper function to render a sortbar button */}
                  {(() => {
                    const renderSortbarButton = (sortbar: typeof initialSortbars[0]) => {
                      const status = getSortbarStatus(sortbar.id);
                      const registration = getRegistration(sortbar.id);
                      const isActive = activeSortbar === sortbar.id;
                      const isRegistered = status === "in-use";
                      
                      return (
                        <motion.button
                          key={sortbar.id}
                          onClick={() => handleSortbarSelect(sortbar.id)}
                          disabled={status === "maintenance"}
                          animate={isActive && isRegistered ? {
                            borderColor: ["rgb(59 130 246)", "rgb(147 197 253)", "rgb(59 130 246)"],
                          } : {}}
                          transition={isActive && isRegistered ? {
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                          } : {}}
                          style={isActive && isRegistered ? { borderWidth: '3px' } : {}}
                          className={`w-full text-left p-4 rounded-lg border-2 h-[140px] flex flex-col ${
                            status === "maintenance"
                              ? "border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800/50 opacity-50 cursor-not-allowed"
                              : isActive && isRegistered
                              ? "bg-blue-500/5 dark:bg-blue-400/5 shadow-lg"
                              : isRegistered
                              ? "border-blue-500/30 dark:border-blue-400/30 bg-blue-500/5 dark:bg-blue-400/5 hover:border-blue-500/50 dark:hover:border-blue-400/50 transition-all"
                              : isActive
                              ? "border-[#0d9488] dark:border-[#50e080] bg-[#0d9488]/10 dark:bg-[#50e080]/10 transition-all"
                              : "border-zinc-300 dark:border-zinc-700 hover:border-[#0d9488] dark:hover:border-[#50e080] hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-all"
                          }`}
                        >
                          <div className="flex-1 flex flex-col">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{sortbar.name}</h3>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  status === "available"
                                    ? "bg-[#0d9488]/10 dark:bg-[#50e080]/10 text-[#0d9488] dark:text-[#50e080]"
                                    : status === "in-use"
                                    ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                    : "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400"
                                }`}
                              >
                                {status}
                              </span>
                            </div>
                            <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-2">
                              Capacity: {sortbar.capacity}
                            </div>
                            {/* Always show this section for consistent sizing */}
                            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-700 flex-1">
                              {registration ? (
                                <>
                                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">
                                    {registration.registrationMethod === "list" ? registration.workListId : `LPN: ${registration.lpn}`}
                                  </p>
                                  {registration.itemCount > 0 && (
                                    <div className="flex items-baseline gap-1">
                                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 leading-none">
                                        {registration.itemCount}
                                      </div>
                                      <div className="text-xs text-zinc-600 dark:text-zinc-400">items</div>
                                    </div>
                                  )}
                                </>
                              ) : (
                                <div className="h-full flex items-center justify-center opacity-30">
                                  <p className="text-xs text-zinc-500 dark:text-zinc-600">Not registered</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.button>
                      );
                    };

                    // Get the sortbars to display based on count
                    const getSortbarsToDisplay = () => {
                      if (sortbarCount === 2) return ['A1', 'A2'];
                      if (sortbarCount === 5) return ['A1', 'A2', 'A3', 'A4', 'A5'];
                      if (sortbarCount === 8) return ['A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'B3', 'B4'];
                      if (sortbarCount === 10) return ['A1', 'A2', 'A3', 'A4', 'A5', 'B1', 'B2', 'B3', 'B4', 'B5'];
                      if (sortbarCount === 16) return ['A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'B3', 'B4', 'C1', 'C2', 'C3', 'C4', 'D1', 'D2', 'D3', 'D4'];
                      // 40 sortbars
                      return ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10',
                              'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10',
                              'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10',
                              'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10'];
                    };

                    const sortbarsToDisplay = getSortbarsToDisplay();

                    // 2 sortbars: 2 side by side with space between
                    if (sortbarCount === 2) {
                      return (
                        <div className="grid grid-cols-2 gap-8">
                          {sortbarsToDisplay.map(name => 
                            initialSortbars.filter(sb => sb.name === name).map(renderSortbarButton)
                          )}
                        </div>
                      );
                    }

                    // 5 sortbars: 5 side by side
                    if (sortbarCount === 5) {
                      return (
                        <div className="grid grid-cols-5 gap-3">
                          {sortbarsToDisplay.map(name => 
                            initialSortbars.filter(sb => sb.name === name).map(renderSortbarButton)
                          )}
                        </div>
                      );
                    }

                    // 8 sortbars: 2 rows of 4 on each side with space between
                    if (sortbarCount === 8) {
                      return (
                        <div className="space-y-6">
                          <div className="flex items-center gap-3">
                            <div className="grid grid-cols-2 gap-3 flex-1">
                              {sortbarsToDisplay.slice(0, 2).map(name => 
                                initialSortbars.filter(sb => sb.name === name).map(renderSortbarButton)
                              )}
                            </div>
                            <div className="w-px h-32 bg-zinc-300 dark:bg-zinc-700"></div>
                            <div className="grid grid-cols-2 gap-3 flex-1">
                              {sortbarsToDisplay.slice(2, 4).map(name => 
                                initialSortbars.filter(sb => sb.name === name).map(renderSortbarButton)
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="grid grid-cols-2 gap-3 flex-1">
                              {sortbarsToDisplay.slice(4, 6).map(name => 
                                initialSortbars.filter(sb => sb.name === name).map(renderSortbarButton)
                              )}
                            </div>
                            <div className="w-px h-32 bg-zinc-300 dark:bg-zinc-700"></div>
                            <div className="grid grid-cols-2 gap-3 flex-1">
                              {sortbarsToDisplay.slice(6, 8).map(name => 
                                initialSortbars.filter(sb => sb.name === name).map(renderSortbarButton)
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }

                    // 10 sortbars: 2 rows of 5 on top of each other with space between
                    if (sortbarCount === 10) {
                      return (
                        <div className="space-y-6">
                          <div className="grid grid-cols-5 gap-3">
                            {sortbarsToDisplay.slice(0, 5).map(name => 
                              initialSortbars.filter(sb => sb.name === name).map(renderSortbarButton)
                            )}
                          </div>
                          <div className="w-full h-px bg-zinc-300 dark:bg-zinc-700"></div>
                          <div className="grid grid-cols-5 gap-3">
                            {sortbarsToDisplay.slice(5, 10).map(name => 
                              initialSortbars.filter(sb => sb.name === name).map(renderSortbarButton)
                            )}
                          </div>
                        </div>
                      );
                    }

                    // 16 sortbars: 4 rows of 4 with space between
                    if (sortbarCount === 16) {
                      return (
                        <div className="space-y-6">
                          <div className="flex items-center gap-3">
                            <div className="grid grid-cols-2 gap-3 flex-1">
                              {sortbarsToDisplay.slice(0, 2).map(name => 
                                initialSortbars.filter(sb => sb.name === name).map(renderSortbarButton)
                              )}
                            </div>
                            <div className="w-px h-32 bg-zinc-300 dark:bg-zinc-700"></div>
                            <div className="grid grid-cols-2 gap-3 flex-1">
                              {sortbarsToDisplay.slice(2, 4).map(name => 
                                initialSortbars.filter(sb => sb.name === name).map(renderSortbarButton)
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="grid grid-cols-2 gap-3 flex-1">
                              {sortbarsToDisplay.slice(4, 6).map(name => 
                                initialSortbars.filter(sb => sb.name === name).map(renderSortbarButton)
                              )}
                            </div>
                            <div className="w-px h-32 bg-zinc-300 dark:bg-zinc-700"></div>
                            <div className="grid grid-cols-2 gap-3 flex-1">
                              {sortbarsToDisplay.slice(6, 8).map(name => 
                                initialSortbars.filter(sb => sb.name === name).map(renderSortbarButton)
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="grid grid-cols-2 gap-3 flex-1">
                              {sortbarsToDisplay.slice(8, 10).map(name => 
                                initialSortbars.filter(sb => sb.name === name).map(renderSortbarButton)
                              )}
                            </div>
                            <div className="w-px h-32 bg-zinc-300 dark:bg-zinc-700"></div>
                            <div className="grid grid-cols-2 gap-3 flex-1">
                              {sortbarsToDisplay.slice(10, 12).map(name => 
                                initialSortbars.filter(sb => sb.name === name).map(renderSortbarButton)
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="grid grid-cols-2 gap-3 flex-1">
                              {sortbarsToDisplay.slice(12, 14).map(name => 
                                initialSortbars.filter(sb => sb.name === name).map(renderSortbarButton)
                              )}
                            </div>
                            <div className="w-px h-32 bg-zinc-300 dark:bg-zinc-700"></div>
                            <div className="grid grid-cols-2 gap-3 flex-1">
                              {sortbarsToDisplay.slice(14, 16).map(name => 
                                initialSortbars.filter(sb => sb.name === name).map(renderSortbarButton)
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }

                    // 40 sortbars: 4 columns of 10 (default) - A2 and D5 removed (open areas)
                    const sortbarGroups = {
                      col1: ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10'],
                      col2: ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10'],
                      col3: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10'],
                      col4: ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10']
                    };
                    
                    const openSpots = ['A2', 'D5']; // These locations are open/unavailable

                    return (
                      <div className="flex items-start gap-3">
                        <div className="flex flex-col gap-3 flex-1">
                          {sortbarGroups.col1.map(name => {
                            if (openSpots.includes(name)) {
                              return <div key={name} className="h-[120px]"></div>;
                            }
                            return initialSortbars.filter(sb => sb.name === name).map(renderSortbarButton);
                          })}
                        </div>
                        
                        <div className="flex flex-col gap-3 flex-1">
                          {sortbarGroups.col2.map(name => {
                            if (openSpots.includes(name)) {
                              return <div key={name} className="h-[120px]"></div>;
                            }
                            return initialSortbars.filter(sb => sb.name === name).map(renderSortbarButton);
                          })}
                        </div>
                        
                        <div className="w-px bg-zinc-300 dark:bg-zinc-700 self-stretch"></div>
                        
                        <div className="flex flex-col gap-3 flex-1">
                          {sortbarGroups.col3.map(name => {
                            if (openSpots.includes(name)) {
                              return <div key={name} className="h-[120px]"></div>;
                            }
                            return initialSortbars.filter(sb => sb.name === name).map(renderSortbarButton);
                          })}
                        </div>
                        
                        <div className="flex flex-col gap-3 flex-1">
                          {sortbarGroups.col4.map(name => {
                            if (openSpots.includes(name)) {
                              return <div key={name} className="h-[120px]"></div>;
                            }
                            return initialSortbars.filter(sb => sb.name === name).map(renderSortbarButton);
                          })}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="col-span-7">
              {!activeSortbar || !getRegistration(activeSortbar) ? (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-8 flex items-center justify-center min-h-[600px]">
                  <div className="text-center max-w-md">
                    <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertCircle size={40} className="text-zinc-400 dark:text-zinc-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
                      No Replenishment Registered
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      Select a sortbar location and choose a registration method to begin
                    </p>
                  </div>
                </div>
              ) : (
                <div key={activeSortbar || 'no-sortbar'} className="grid grid-cols-2 gap-6 h-[calc(100vh-300px)]">
                  {/* Items Section - Left */}
                  <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden h-full flex flex-col">
                    <div className="bg-zinc-100 dark:bg-zinc-800 p-4 border-b border-zinc-200 dark:border-zinc-700 flex-shrink-0">
                      <div className="flex items-center gap-2">
                        <Package size={20} className="text-[#0d9488] dark:text-[#50e080]" />
                        <h2 className="font-semibold text-zinc-900 dark:text-white">Items ({items.length})</h2>
                      </div>
                    </div>
                    <div className="overflow-y-auto flex-1 p-4 space-y-2">
                      {items.map((item, index) => {
                        const processedQty = processedItems.get(item.id) ?? 0;
                        const totalQty = item.quantity;
                        const isProcessed = processedQty > 0;
                        const isComplete = processedQty === totalQty;
                        const isShorted = isProcessed && processedQty < totalQty;
                        const isSelected = selectedItem?.id === item.id;
                        
                        return (
                          <motion.button
                            key={item.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => handleItemSelect(item)}
                            className={`w-full text-left p-4 rounded-lg border transition-all ${
                              isSelected
                                ? "border-[#0d9488] dark:border-[#50e080] bg-[#0d9488]/5 dark:bg-[#50e080]/5"
                                : isComplete
                                ? "border-zinc-300 dark:border-zinc-700 bg-emerald-500/10 dark:bg-emerald-400/10 hover:border-[#0d9488]/50 dark:hover:border-[#50e080]/50"
                                : isShorted
                                ? "border-zinc-300 dark:border-zinc-700 bg-amber-500/10 dark:bg-amber-400/10 hover:border-[#0d9488]/50 dark:hover:border-[#50e080]/50"
                                : "border-zinc-300 dark:border-zinc-700 hover:border-[#0d9488]/50 dark:hover:border-[#50e080]/50"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="font-mono text-sm font-semibold text-zinc-900 dark:text-white mb-1">{item.sku}</div>
                                <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-2 truncate">{item.description}</div>
                                <div className="flex items-center gap-3 text-xs text-zinc-600 dark:text-zinc-400">
                                  <span>Loc: {item.location}</span>
                                </div>
                              </div>
                              
                              <div className="flex flex-col items-end gap-2 shrink-0">
                                {/* Status Badge */}
                                {isProcessed && (
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                                      isComplete
                                        ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                                        : "bg-amber-500/20 text-amber-700 dark:text-amber-300"
                                    }`}
                                  >
                                    {isComplete ? "Complete" : "Shorted"}
                                  </span>
                                )}
                                {!isProcessed && (
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full ${
                                      item.priority === "High"
                                        ? "bg-red-500/10 text-red-600 dark:text-red-400"
                                        : "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400"
                                    }`}
                                  >
                                    {item.priority}
                                  </span>
                                )}
                                
                                {/* Quantity Display */}
                                <div className="text-right">
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
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quantity Control Section - Right */}
                  <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden h-full flex flex-col">
                    <div className="bg-zinc-100 dark:bg-zinc-800 p-4 border-b border-zinc-200 dark:border-zinc-700 flex-shrink-0">
                      <div className="flex items-center gap-2">
                        <Box size={20} className="text-[#0d9488] dark:text-[#50e080]" />
                        <h2 className="font-semibold text-zinc-900 dark:text-white">
                          Container {selectedItem ? `- ${selectedItem.containerName}` : ""}
                        </h2>
                      </div>
                    </div>
                    
                    {selectedItem ? (
                      <div className="flex-1 flex flex-col overflow-hidden">
                        {/* Selected Item Info - Pinned */}
                        <div className="flex-shrink-0 p-4 px-6">
                          <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-3">
                            <div className="font-mono text-base font-bold text-zinc-900 dark:text-white mb-1">{selectedItem.sku}</div>
                            <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">{selectedItem.description}</div>
                            <div className="flex items-center gap-4">
                              <div className="text-xs text-zinc-600 dark:text-zinc-400">
                                Location: <span className="font-mono text-zinc-900 dark:text-white">{selectedItem.location}</span>
                              </div>
                              <div className="text-xs text-zinc-600 dark:text-zinc-400">
                                Total: <span className="font-semibold text-zinc-900 dark:text-white">{selectedItem.quantity}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Quantity Controls - Pinned */}
                        <div className="flex-1 flex flex-col items-center justify-center px-6 min-h-0">
                          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">Quantity Processed</p>
                          
                          {/* Large Quantity Display/Input */}
                          <div className="mb-6">
                            <button
                              onClick={handleQuantityClick}
                              className="text-6xl font-bold text-[#0d9488] dark:text-[#50e080] hover:opacity-80 transition-opacity"
                            >
                              {processedQuantity}
                            </button>
                            <div className="text-center text-xl text-zinc-400 mt-1">/ {selectedItem.quantity}</div>
                          </div>

                          {/* +/- Buttons */}
                          <div className="flex items-center gap-4 mb-4">
                            <button
                              onClick={handleQuantityDecrease}
                              disabled={processedQuantity === 0}
                              className="w-14 h-14 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-colors"
                            >
                              <Minus size={24} className="text-zinc-900 dark:text-white" />
                            </button>
                            <button
                              onClick={handleQuantityIncrease}
                              disabled={processedQuantity >= selectedItem.quantity}
                              className="w-14 h-14 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-colors"
                            >
                              <Plus size={24} className="text-zinc-900 dark:text-white" />
                            </button>
                          </div>

                        </div>
                        
                        {/* Next/Confirm Button - Pinned */}
                        <div className="flex-shrink-0 p-4 px-6">
                          {(() => {
                            const currentIndex = items.findIndex(i => i.id === selectedItem.id);
                            const isLastItem = currentIndex === items.length - 1;
                            return (
                              <button
                                onClick={handleNextOrConfirm}
                                className="w-full px-8 py-4 bg-[#0d9488] dark:bg-[#50e080] hover:bg-[#0b7a70] dark:hover:bg-[#3bc76a] text-white rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-2 shadow-lg"
                              >
                                <Check size={24} />
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
                </div>
              )}
            </div>
          </div>

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
              <div className="bg-[#0d9488] dark:bg-[#50e080] p-6 text-white sticky top-0 z-10">
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
                      {panelView === "list" && "Select Replenishment List"}
                      {panelView === "lpn" && "Enter LPN"}
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
                            <p className="text-xs text-zinc-600 dark:text-zinc-400">Scan or enter LPN number</p>
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
                        onClick={handleUnregister}
                        className="w-full p-4 rounded-lg border border-red-300 dark:border-red-700 hover:border-red-500 dark:hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                            <X size={20} className="text-red-600 dark:text-red-400" />
                          </div>
                          <div className="text-left">
                            <p className="font-medium text-red-600 dark:text-red-400">Unregister Work List</p>
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
                    {mockReplenishmentLists
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
                      className="flex-1 px-4 py-3 bg-[#0d9488] dark:bg-[#50e080] hover:bg-[#0b7a70] dark:hover:bg-[#3bc76a] text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Register
                    </button>
                  </div>
                </div>
              )}

              {/* Work List Details View */}
              {panelView === "details" && workListDetail && (
                <div className="p-6">
                  <WorkListDetailsPanel
                    workListDetail={workListDetail}
                    workLines={workLines}
                    workOperations={workOperations}
                  />
                </div>
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
              <div className="bg-[#0d9488] dark:bg-[#50e080] p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <List size={24} />
                    <h2 className="text-2xl font-bold">Select Replenishment List</h2>
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
                  {mockReplenishmentLists
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
              <div className="bg-[#0d9488] dark:bg-[#50e080] p-6 text-white">
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
                    className="flex-1 px-4 py-3 bg-[#0d9488] dark:bg-[#50e080] hover:bg-[#0b7a70] dark:hover:bg-[#3bc76a] text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
              <div className="bg-[#0d9488] dark:bg-[#50e080] p-6 text-white">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={28} />
                  <h2 className="text-2xl font-bold">Review Replenishment</h2>
                </div>
                <p className="text-white/80 mt-2 text-sm">
                  Please review the items you have processed below
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
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-900 dark:text-blue-200">
                    <strong>Ready to complete?</strong> Confirming will finalize this replenishment session and unregister the sortbar.
                  </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                  <button
                    onClick={handleProcessMore}
                    className="flex-1 px-6 py-3 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={20} />
                    Process More
                  </button>
                  <button
                    onClick={handleCompleteConfirmation}
                    className="flex-1 px-6 py-3 bg-[#0d9488] dark:bg-[#50e080] hover:bg-[#0b7a70] dark:hover:bg-[#3bc76a] text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Check size={20} />
                    Complete & Finish
                  </button>
                  </div>
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
                    <div className="w-10 h-10 bg-[#0d9488] dark:bg-[#50e080] rounded-lg flex items-center justify-center">
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
                    <div className="w-10 h-10 bg-[#0d9488] dark:bg-[#50e080] rounded-lg flex items-center justify-center">
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
                  className="flex-1 px-6 py-3 bg-[#0d9488] dark:bg-[#50e080] hover:bg-[#0b7a70] dark:hover:bg-[#3bc76a] text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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