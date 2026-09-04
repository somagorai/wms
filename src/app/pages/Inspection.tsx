import { useState } from "react";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { PackageSearch, ChevronRight, Package, CheckCircle2, Home, Grid3x3, Box, Check, ChevronLeft, Plus, Minus, ClipboardList, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import macAndCheeseImage from "../../imports/image-10.png";

// Type definitions
type WorkItem = {
 id: string;
 workList: string;
 type: string;
 status: string;
 priority: string;
 created: string;
};

type InspectionItem = {
 id: string;
 sku: string;
 description: string;
 inspectQuantity: number;
 location: string;
 binNumber: string;
 compartmentLpn: string;
 containerName: string;
 compartmentConfig: { rows: number; cols: number };
 imageUrl: string;
 priority: string;
};

type Compartment = {
 lpn: string;
 row: number;
 col: number;
};

type SortbarRegistration = {
 sortbarId: string;
 workListId: string;
 itemCount: number;
 totalQuantity: number;
 items: InspectionItem[];
 inspectedItems: Map<string, boolean>;
};

// Mock data for sortbars
const initialSortbars = [
 { id: "SB-INS1", name: "INS1", zone: "Inspection Zone", capacity: 24 },
 { id: "SB-INS2", name: "INS2", zone: "Inspection Zone", capacity: 24 },
 { id: "SB-INS3", name: "INS3", zone: "Inspection Zone", capacity: 32 },
 { id: "SB-INS4", name: "INS4", zone: "Inspection Zone", capacity: 32 },
];

// Mock work lists
const mockWorkLists: WorkItem[] = [
 { id: "WL-INS001", workList: "WL-INS001", type: "Inspection", status: "Available", priority: "Normal", created: "2026-06-10 08:00:00" },
 { id: "WL-INS002", workList: "WL-INS002", type: "Inspection", status: "Available", priority: "High", created: "2026-06-10 09:15:00" },
 { id: "WL-INS003", workList: "WL-INS003", type: "Inspection", status: "Available", priority: "Normal", created: "2026-06-10 10:30:00" },
];

// Compartment configs: 1–4 compartments
const compartmentConfigs = [
 { rows: 1, cols: 1 },
 { rows: 1, cols: 2 },
 { rows: 2, cols: 1 },
 { rows: 2, cols: 2 },
];

const generateCompartments = (containerName: string, config: { rows: number; cols: number }): Compartment[] => {
 const compartments: Compartment[] = [];
 let compartmentNum = 1;
 for (let row = 0; row < config.rows; row++) {
 for (let col = 0; col < config.cols; col++) {
 const compartmentId = String(compartmentNum).padStart(2, "0");
 const containerPrefix = containerName.replace("CONT-", "");
 compartments.push({ lpn: `LPN-${containerPrefix}-C${compartmentId}`, row, col });
 compartmentNum++;
 }
 }
 return compartments;
};

const generateMockInspectionItems = (): InspectionItem[] => {
 const items = [
 {
 sku: "SKU-2001",
 description: "Organic Whole Milk",
 inspectQuantity: 24,
 location: "A-12-3",
 binNumber: "BIN-INS-01",
 containerName: "CONT-INS-001",
 priority: "Normal",
 imageUrl: "https://images.unsplash.com/photo-1553301803-768cd4a59b9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
 },
 {
 sku: "SKU-2002",
 description: "Cheerios Original",
 inspectQuantity: 12,
 location: "B-08-2",
 binNumber: "BIN-INS-02",
 containerName: "CONT-INS-002",
 priority: "High",
 imageUrl: "https://images.unsplash.com/photo-1577118531916-3ae7e50778cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
 },
 {
 sku: "SKU-2003",
 description: "Kraft Macaroni & Cheese",
 inspectQuantity: 8,
 location: "C-15-1",
 binNumber: "BIN-INS-03",
 containerName: "CONT-INS-003",
 priority: "Normal",
 imageUrl: macAndCheeseImage,
 },
 {
 sku: "SKU-2004",
 description: "Coca-Cola 12-Pack",
 inspectQuantity: 18,
 location: "D-22-4",
 binNumber: "BIN-INS-04",
 containerName: "CONT-INS-004",
 priority: "Normal",
 imageUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
 },
 {
 sku: "SKU-2005",
 description: "Wonder Bread",
 inspectQuantity: 15,
 location: "E-05-2",
 binNumber: "BIN-INS-05",
 containerName: "CONT-INS-005",
 priority: "High",
 imageUrl: "https://images.unsplash.com/photo-1534620808146-d33bb39128b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
 },
 ];

 // Randomly pick 1–4 items
 const count = Math.floor(Math.random() * 4) + 1;
 const shuffled = [...items].sort(() => Math.random() - 0.5).slice(0, count);

 return shuffled.map((item, index) => {
 const config = compartmentConfigs[Math.floor(Math.random() * compartmentConfigs.length)];
 const totalCompartments = config.rows * config.cols;
 const compartmentNum = Math.floor(Math.random() * totalCompartments) + 1;
 const compartmentId = String(compartmentNum).padStart(2, "0");
 const containerPrefix = item.containerName.replace("CONT-", "");
 return {
 id: `ins-item-${index + 1}`,
 ...item,
 compartmentConfig: config,
 compartmentLpn: `LPN-${containerPrefix}-C${compartmentId}`,
 };
 });
};

// Adjust Inventory modal state types
type AdjustStep = "select-item" | "adjust-quantity" | "reason-code";

export function Inspection() {
 const [selectedSortbar, setSelectedSortbar] = useState<string | null>(null);
 const [activeSortbar, setActiveSortbar] = useState<string | null>(null);
 const [sortbarRegistrations, setSortbarRegistrations] = useState<SortbarRegistration[]>([]);
 const [showWorkListPanel, setShowWorkListPanel] = useState(false);
 const [selectedItem, setSelectedItem] = useState<InspectionItem | null>(null);
 const [showConfirmation, setShowConfirmation] = useState(false);
 const [items, setItems] = useState<InspectionItem[]>([]);

 // Adjust Inventory
 const [showAdjustInventory, setShowAdjustInventory] = useState(false);
 const [adjustStep, setAdjustStep] = useState<AdjustStep>("select-item");
 const [selectedAdjustItem, setSelectedAdjustItem] = useState<InspectionItem | null>(null);
 const [adjustDelta, setAdjustDelta] = useState(0);
 const [adjustReasonCode, setAdjustReasonCode] = useState("");
 const [compartmentInventory, setCompartmentInventory] = useState<Map<string, number>>(new Map());

 // Purge confirm
 const [showPurgeConfirm, setShowPurgeConfirm] = useState(false);
 const [purgeReasonCode, setPurgeReasonCode] = useState("");
 const [purgeReasonSearch, setPurgeReasonSearch] = useState("");
 const [purgeReasonDropdownOpen, setPurgeReasonDropdownOpen] = useState(false);

 const currentRegistration = activeSortbar
 ? sortbarRegistrations.find((reg) => reg.sortbarId === activeSortbar)
 : null;

 const getSortbarStatus = (sortbarId: string) => {
 return sortbarRegistrations.find((reg) => reg.sortbarId === sortbarId) ? "registered" : "available";
 };

 const handleSortbarSelect = (sortbarId: string) => {
 setSelectedSortbar(sortbarId);
 setActiveSortbar(sortbarId);
 const registration = sortbarRegistrations.find((reg) => reg.sortbarId === sortbarId);
 if (registration) {
 setItems(registration.items);
 setSelectedItem(registration.items[0]);
 setShowWorkListPanel(false);
 } else {
 setShowWorkListPanel(true);
 }
 };

 const handleWorkListSelect = (workListId: string) => {
 const mockItems = generateMockInspectionItems();
 const totalQty = mockItems.reduce((sum, item) => sum + item.inspectQuantity, 0);

 // Initialize compartment inventory
 const invMap = new Map<string, number>();
 mockItems.forEach((item) => {
 const extra = Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 10) + 1;
 invMap.set(item.compartmentLpn, item.inspectQuantity + extra);
 });
 setCompartmentInventory(invMap);

 const newRegistration: SortbarRegistration = {
 sortbarId: activeSortbar!,
 workListId,
 itemCount: mockItems.length,
 totalQuantity: totalQty,
 items: mockItems,
 inspectedItems: new Map(),
 };

 setSortbarRegistrations([...sortbarRegistrations, newRegistration]);
 setItems(mockItems);
 setSelectedItem(mockItems[0]);
 setShowWorkListPanel(false);
 toast.success("Inspection work list loaded");
 };

 const handleConfirm = () => {
 if (!currentRegistration || !selectedItem) return;

 const newInspected = new Map(currentRegistration.inspectedItems);
 newInspected.set(selectedItem.id, true);

 const updatedRegistrations = sortbarRegistrations.map((reg) =>
 reg.sortbarId === activeSortbar ? { ...reg, inspectedItems: newInspected } : reg
 );
 setSortbarRegistrations(updatedRegistrations);

 const currentIndex = items.findIndex((i) => i.id === selectedItem.id);
 const hasMoreItems = currentIndex < items.length - 1;

 if (hasMoreItems) {
 const nextItem = items[currentIndex + 1];
 setSelectedItem(nextItem);
 toast.success("Item confirmed");
 } else {
 setShowConfirmation(true);
 }
 };

 const handleComplete = () => {
 const updatedRegistrations = sortbarRegistrations.filter((reg) => reg.sortbarId !== activeSortbar);
 setSortbarRegistrations(updatedRegistrations);
 toast.success("Inspection completed!");
 setActiveSortbar(null);
 setSelectedSortbar(null);
 setItems([]);
 setSelectedItem(null);
 setShowConfirmation(false);
 };

 const purgeReasonOptions = [
 "Quality Failure",
 "Damaged Goods",
 "Wrong Items",
 "Quantity Mismatch",
 "Expired Product",
 "Contamination",
 "Incorrect Location",
 "System Error",
 "Customer Request",
 "Supplier Issue",
 "Other",
 ];

 // Purge handler
 const handlePurge = () => {
 setShowPurgeConfirm(false);
 setPurgeReasonCode("");
 setPurgeReasonSearch("");
 setPurgeReasonDropdownOpen(false);
 const updatedRegistrations = sortbarRegistrations.filter((reg) => reg.sortbarId !== activeSortbar);
 setSortbarRegistrations(updatedRegistrations);
 toast.success("Work list purged");
 setActiveSortbar(null);
 setSelectedSortbar(null);
 setItems([]);
 setSelectedItem(null);
 };

 // Adjust Inventory handlers
 const handleAdjustInventoryClick = () => {
 setAdjustStep("select-item");
 setSelectedAdjustItem(null);
 setAdjustDelta(0);
 setAdjustReasonCode("");
 setShowAdjustInventory(true);
 };

 const handleAdjustItemSelect = (item: InspectionItem) => {
 setSelectedAdjustItem(item);
 setAdjustDelta(0);
 setAdjustStep("adjust-quantity");
 };

 const handleAdjustQuantityConfirm = () => {
 if (selectedAdjustItem && adjustDelta !== 0) {
 setAdjustStep("reason-code");
 setAdjustReasonCode("");
 }
 };

 const handleAdjustFinalConfirm = () => {
 if (selectedAdjustItem && adjustReasonCode.trim()) {
 const currentQty = compartmentInventory.get(selectedAdjustItem.compartmentLpn) || 0;
 const newQty = currentQty + adjustDelta;
 const updated = new Map(compartmentInventory);
 updated.set(selectedAdjustItem.compartmentLpn, newQty);
 setCompartmentInventory(updated);
 toast.success("Inventory Adjusted", {
 description: `${selectedAdjustItem.compartmentLpn.split("-").pop()}: ${currentQty} ${adjustDelta > 0 ? "+" : ""}${adjustDelta} = ${newQty} units`,
 });
 setShowAdjustInventory(false);
 setSelectedAdjustItem(null);
 setAdjustDelta(0);
 setAdjustReasonCode("");
 setAdjustStep("select-item");
 }
 };

 const handleAdjustCancel = () => {
 setShowAdjustInventory(false);
 setSelectedAdjustItem(null);
 setAdjustDelta(0);
 setAdjustReasonCode("");
 setAdjustStep("select-item");
 };

 const handleAdjustBack = () => {
 if (adjustStep === "reason-code") {
 setAdjustStep("adjust-quantity");
 setAdjustReasonCode("");
 } else if (adjustStep === "adjust-quantity") {
 setAdjustStep("select-item");
 setSelectedAdjustItem(null);
 setAdjustDelta(0);
 }
 };

 return (
 <div className="flex flex-col min-h-screen bg-[var(--background)] dark:bg-[var(--background)] text-[var(--foreground)]">
 {/* Sticky Header */}
 <div className="sticky top-0 z-40 bg-[var(--background)]/95 backdrop-blur-md text-[var(--foreground)] border-b border-[var(--border)] px-8 pt-6 pb-4">
 <nav className="flex items-center gap-2 text-sm">
 <Link to="/app/home" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] dark:hover:text-[var(--primary)] transition-colors flex items-center gap-1">
 <Home size={14} />Home
 </Link>
 <ChevronRight size={14} className="text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]" />
 <Link to="/app/navigation?section=workstation-operations" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] dark:hover:text-[var(--primary)] transition-colors">
 Workstation Operations
 </Link>
 <ChevronRight size={14} className="text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]" />
 <span className="text-[var(--foreground)]  font-semibold text-lg flex items-center gap-2">
 <PackageSearch size={20} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 Inspection
 </span>
 </nav>
 </div>
 <div className="flex-1 overflow-y-auto p-6">

 {/* Completion Confirmation Screen */}
 <AnimatePresence>
 {showConfirmation && currentRegistration && (
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
 >
 <motion.div
 initial={{ scale: 0.9, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 exit={{ scale: 0.9, opacity: 0 }}
 className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden"
 >
 <div className="p-6 border-b border-[var(--border)] ">
 <h2 className="text-xl font-semibold text-[var(--foreground)]  flex items-center gap-2">
 <CheckCircle2 className="text-[var(--state-success)]" size={24} />
 Inspection Complete
 </h2>
 </div>

 <div className="p-6 max-h-[60vh] overflow-y-auto">
 <div className="mb-6">
 <div className="grid grid-cols-2 gap-4 mb-6">
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-lg p-4">
 <div className="text-sm text-[var(--muted-foreground)] mb-1">Total Items</div>
 <div className="text-2xl font-semibold text-[var(--foreground)] ">{items.length}</div>
 </div>
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-lg p-4">
 <div className="text-sm text-[var(--muted-foreground)] mb-1">Items Inspected</div>
 <div className="text-2xl font-semibold text-[var(--foreground)] ">{currentRegistration.inspectedItems.size}</div>
 </div>
 </div>

 <div className="space-y-2">
 <h3 className="font-medium text-[var(--foreground)]  mb-3">Inspection Summary</h3>
 {items.map((item) => {
 const inspected = currentRegistration.inspectedItems.get(item.id);
 return (
 <div key={item.id} className="flex items-center justify-between p-3 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-lg">
 <div className="flex items-center gap-3">
 {inspected
 ? <CheckCircle2 className="text-[var(--state-success)]" size={20} />
 : <Package className="text-[var(--muted-foreground)]" size={20} />}
 <div>
 <div className="font-medium text-[var(--foreground)] ">{item.sku}</div>
 <div className="text-sm text-[var(--muted-foreground)]">{item.description}</div>
 </div>
 </div>
 <div className="text-right">
 <div className={`font-semibold ${inspected ? "text-[var(--state-on-success-container)] dark:text-[var(--state-success)]" : "text-[var(--muted-foreground)]"}`}>
 {inspected ? "Inspected" : "Pending"}
 </div>
 <div className="text-sm text-[var(--muted-foreground)]">Qty: {item.inspectQuantity}</div>
 </div>
 </div>
 );
 })}
 </div>
 </div>
 </div>

 <div className="p-6 border-t border-[var(--border)]  flex gap-3">
 <button
 onClick={handleComplete}
 className="flex-1 bg-[var(--primary)] hover:opacity-90 active:scale-[0.98] text-[var(--primary-foreground)] rounded-lg py-3 font-medium transition-colors"
 >
 Complete
 </button>
 </div>
 </motion.div>
 </motion.div>
 )}
 </AnimatePresence>

 {/* Purge Confirm Modal */}
 <AnimatePresence>
 {showPurgeConfirm && (
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
 >
 <motion.div
 initial={{ scale: 0.9, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 exit={{ scale: 0.9, opacity: 0 }}
 className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-lg max-w-md w-full"
 >
 <div className="p-6 border-b border-[var(--border)] ">
 <h2 className="text-xl font-semibold text-[var(--foreground)]  flex items-center gap-2">
 <Trash2 className="text-[var(--state-error)]" size={22} />
 Purge Work List
 </h2>
 </div>
 <div className="p-6">
 <p className="text-[var(--muted-foreground)] mb-5">
 Select a reason for purging this work list. This will remove all inspection progress and cannot be undone.
 </p>

 {/* Searchable Reason Code Dropdown */}
 <div className="mb-6 relative">
 <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
 Reason Code <span className="text-[var(--state-error)]">*</span>
 </label>
 <div
 className="w-full px-4 py-3 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg flex items-center justify-between cursor-pointer hover:border-[var(--border)] dark:hover:border-[var(--border)] transition-colors"
 onClick={() => setPurgeReasonDropdownOpen(!purgeReasonDropdownOpen)}
 >
 <span className={purgeReasonCode ? "text-[var(--foreground)]" : "text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]"}>
 {purgeReasonCode || "Select a reason..."}
 </span>
 <ChevronRight
 size={16}
 className={`text-[var(--muted-foreground)] transition-transform ${purgeReasonDropdownOpen ? "rotate-90" : ""}`}
 />
 </div>

 {purgeReasonDropdownOpen && (
 <div className="absolute z-10 w-full mt-1 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg overflow-hidden">
 <div className="p-2 border-b border-[var(--border)] ">
 <input
 type="text"
 value={purgeReasonSearch}
 onChange={(e) => setPurgeReasonSearch(e.target.value)}
 placeholder="Search reason codes..."
 className="w-full px-3 py-2 bg-[var(--surface-container-low)] dark:bg-[var(--card)] border border-transparent rounded-md text-sm text-[var(--foreground)]  placeholder-zinc-400 focus:outline-none focus:border-[var(--border)] dark:focus:border-[var(--border)]"
 autoFocus
 onClick={(e) => e.stopPropagation()}
 />
 </div>
 <div className="max-h-48 overflow-y-auto">
 {purgeReasonOptions
 .filter((opt) => opt.toLowerCase().includes(purgeReasonSearch.toLowerCase()))
 .map((opt) => (
 <button
 key={opt}
 onClick={() => {
 setPurgeReasonCode(opt);
 setPurgeReasonSearch("");
 setPurgeReasonDropdownOpen(false);
 }}
 className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
 purgeReasonCode === opt
 ? "bg-[var(--state-error-container)] dark:bg-[var(--state-error-container)]/20 text-[var(--state-on-error-container)] dark:text-[var(--state-error)] font-medium"
 : "text-[var(--foreground)] hover:bg-[var(--surface-container-low)] hover:bg-[var(--surface-container-high)]"
 }`}
 >
 {opt}
 </button>
 ))}
 {purgeReasonOptions.filter((opt) => opt.toLowerCase().includes(purgeReasonSearch.toLowerCase())).length === 0 && (
 <div className="px-4 py-3 text-sm text-[var(--muted-foreground)] text-center">No matches found</div>
 )}
 </div>
 </div>
 )}
 </div>

 <div className="flex gap-3">
 <button
 onClick={() => {
 setShowPurgeConfirm(false);
 setPurgeReasonCode("");
 setPurgeReasonSearch("");
 setPurgeReasonDropdownOpen(false);
 }}
 className="flex-1 px-4 py-3 bg-[var(--surface-container)] dark:bg-[var(--card)] hover:bg-[var(--surface-container-high)] text-[var(--foreground)]  rounded-lg font-medium transition-colors"
 >
 Cancel
 </button>
 <Button
  btnType="destructive"
  size="lg"
  className="flex-1"
  disabled={!purgeReasonCode}
  onClick={handlePurge}
  >
  Purge
  </Button>
 </div>
 </div>
 </motion.div>
 </motion.div>
 )}
 </AnimatePresence>

 {/* Work List Selection Panel */}
 <AnimatePresence>
 {showWorkListPanel && (
 <motion.div
 initial={{ x: "100%" }}
 animate={{ x: 0 }}
 exit={{ x: "100%" }}
 transition={{ type: "spring", damping: 30, stiffness: 300 }}
 className="fixed right-0 top-0 h-full w-[500px] bg-[var(--surface-container-high)] text-[var(--foreground)] border-l border-[var(--border)]  z-40 flex flex-col"
 >
 <div className="p-6 border-b border-[var(--border)] ">
 <div className="flex items-center justify-between mb-4">
 <h2 className="text-xl font-semibold text-[var(--foreground)] ">Select Work List</h2>
 <button
 onClick={() => setShowWorkListPanel(false)}
 className="p-2 hover:bg-[var(--surface-container-low)] hover:bg-[var(--surface-container-high)] rounded-lg transition-colors"
 >
 <ChevronRight size={20} className="text-[var(--muted-foreground)]" />
 </button>
 </div>
 </div>

 <div className="flex-1 overflow-y-auto p-6">
 <div className="space-y-3">
 {mockWorkLists.map((workList) => (
 <button
 key={workList.id}
 onClick={() => handleWorkListSelect(workList.id)}
 className="w-full bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-lg p-4 border-[var(--border)]  hover:border-[var(--primary)] dark:hover:border-[var(--primary)] transition-colors text-left"
 >
 <div className="flex items-start justify-between mb-2">
 <div className="text-lg font-semibold text-[var(--foreground)] ">{workList.workList}</div>
 <span className={`px-2 py-1 rounded text-xs font-medium ${
 workList.priority === "High"
 ? "bg-[var(--state-error-container)] text-[var(--state-on-error-container)] dark:bg-[var(--state-error-container)] dark:text-[var(--state-error)]"
 : "bg-[var(--surface-container-low)] text-[var(--foreground)] dark:bg-[var(--surface-container-high)] "
 }`}>
 {workList.priority}
 </span>
 </div>
 <div className="space-y-1 text-sm text-[var(--muted-foreground)]">
 <div>Type: {workList.type}</div>
 <div>Status: {workList.status}</div>
 <div>Created: {workList.created}</div>
 </div>
 </button>
 ))}
 </div>
 </div>
 </motion.div>
 )}
 </AnimatePresence>

 {/* Main Layout */}
 <div className={`flex gap-3 transition-all duration-500 ease-in-out ${showWorkListPanel ? "mr-[500px]" : "mr-0"}`}>
 {/* Left - Sortbars Column */}
 <div className="w-[15%] min-w-[160px] h-[calc(100vh-100px)]">
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-xl overflow-hidden h-full flex flex-col">
 <div className="p-3 border-b border-[var(--border)]  flex-shrink-0">
 <div className="flex items-center gap-2">
 <div className="w-8 h-8 bg-[var(--primary)]/20 /20 rounded-lg flex items-center justify-center">
 <Grid3x3 size={16} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 </div>
 <h2 className="font-semibold text-[var(--foreground)] ">Sortbars</h2>
 </div>
 </div>
 <div className="p-3 flex-1 overflow-y-auto">
 <div className="space-y-2">
 {initialSortbars.map((sortbar) => {
 const registration = sortbarRegistrations.find((reg) => reg.sortbarId === sortbar.id);
 const isActive = activeSortbar === sortbar.id;
 const isRegistered = !!registration;
 const status = getSortbarStatus(sortbar.id);

 return (
 <button
 key={sortbar.id}
 onClick={() => handleSortbarSelect(sortbar.id)}
 className={`w-full text-left px-2 py-1.5 rounded-lg border-2 h-[110px] flex flex-col ${
 isActive && isRegistered
 ? "animate-pulse bg-[var(--primary)]/20 /20 border-[var(--primary)] dark:border-[var(--primary)] "
 : isRegistered
 ? "border-[var(--state-info)]/40 dark:border-[var(--state-info)]/30 bg-[var(--state-info)]/5 dark:bg-[var(--state-info)]/5 hover:border-[var(--state-info)]/40/50 dark:hover:border-[var(--state-info)]/50 transition-all"
 : "border-[var(--border)]  hover:border-[var(--primary)] dark:hover:border-[var(--primary)] hover:bg-[var(--surface-container-lowest)] hover:bg-[var(--surface-container-high)]/30 transition-all"
 }`}
 >
 <div className="flex-1 flex flex-col">
 <div className="flex items-center justify-between mb-0.5">
 <h3 className="text-base font-bold text-[var(--foreground)] ">{sortbar.name}</h3>
 <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
 status === "available"
 ? "bg-[var(--primary)]/10 /10 text-[var(--primary)] dark:text-[var(--primary)]"
 : "bg-[var(--state-info)]/10 text-[var(--state-info)] dark:text-[var(--state-info)]"
 }`}>
 {status}
 </span>
 </div>
 <div className="pt-0.5 border-t border-[var(--border)]  flex-1">
 {registration ? (
 <>
 <p className="text-[10px] text-[var(--state-info)] dark:text-[var(--state-info)] font-medium mb-0.5">
 {registration.workListId}
 </p>
 <div className="flex items-baseline gap-2 mb-0.5">
 <div className="flex items-baseline gap-0.5">
 <div className="text-lg font-bold text-[var(--state-info)] dark:text-[var(--state-info)] leading-none">
 {registration.itemCount}
 </div>
 <div className="text-[9px] text-[var(--muted-foreground)]">items</div>
 </div>
 <div className="flex items-baseline gap-0.5">
 <div className="text-lg font-bold text-[var(--state-info)] dark:text-[var(--state-info)] leading-none">
 {registration.totalQuantity}
 </div>
 <div className="text-[9px] text-[var(--muted-foreground)]">qty</div>
 </div>
 </div>
 {(() => {
 const progress = registration.itemCount > 0 ? (registration.inspectedItems.size / registration.itemCount) * 100 : 0;
 return (
 <div className="h-1.5 bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)] rounded-full overflow-hidden">
 <div className="h-full bg-[var(--state-info)] dark:bg-[var(--state-info)] transition-all duration-300" style={{ width: `${progress}%` }} />
 </div>
 );
 })()}
 </>
 ) : (
 <p className="text-xs text-[var(--muted-foreground)]">Click to register</p>
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

 {/* Center - Bin Section */}
 <div className="flex-1 h-[calc(100vh-100px)]">
 {(() => {
 if (!currentRegistration) {
 return (
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-xl overflow-hidden h-full flex flex-col opacity-50">
 <div className="p-3 border-b border-[var(--border)]  flex-shrink-0">
 <div className="flex items-center gap-2">
 <div className="w-8 h-8 bg-[var(--primary)]/20 /20 rounded-lg flex items-center justify-center">
 <Box size={16} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 </div>
 <h2 className="font-semibold text-[var(--foreground)] ">Bin</h2>
 </div>
 </div>
 <div className="h-full flex items-center justify-center">
 <div className="text-center max-w-xs">
 <div className="w-16 h-16 bg-[var(--surface-container-low)] dark:bg-[var(--card)] rounded-full flex items-center justify-center mx-auto mb-3">
 <Box size={32} className="text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]" />
 </div>
 <p className="text-[var(--muted-foreground)]">No active sortbar</p>
 </div>
 </div>
 </div>
 );
 }

 return (
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-xl overflow-hidden h-full flex flex-col">
 <div className="p-3 border-b border-[var(--border)]  flex-shrink-0">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <div className="w-8 h-8 bg-[var(--primary)]/20 /20 rounded-lg flex items-center justify-center">
 <Box size={16} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 </div>
 <h2 className="font-semibold text-[var(--foreground)] ">
 Bin — {selectedItem?.binNumber || "—"}
 </h2>
 </div>
 <button
 onClick={() => setShowPurgeConfirm(true)}
 className="px-2.5 py-1 text-xs bg-[var(--state-error-container)] dark:bg-[var(--state-error)] hover:bg-[var(--state-error)] dark:hover:bg-[var(--state-error)] text-[var(--state-error-foreground)] rounded font-medium transition-colors flex items-center gap-1"
 >
 <Trash2 size={12} />
 Purge
 </button>
 </div>
 </div>

 {selectedItem ? (
 <div className="flex-1 flex flex-col overflow-hidden">
 <div className="flex-1 p-3 flex flex-col">
 {/* Compartment header row */}
 <div className="flex items-center justify-between mb-2">
 <p className="text-sm text-[var(--muted-foreground)] font-medium">
 Inspect Compartment
 </p>
 <button
 onClick={handleAdjustInventoryClick}
 className="px-2.5 py-1 text-xs bg-[var(--state-info)] dark:bg-[var(--state-info-container)] hover:bg-[var(--state-info)] dark:hover:bg-[var(--state-info)] text-[var(--state-on-info-container)] rounded font-medium transition-colors"
 >
 Adjust Inventory
 </button>
 </div>

 {selectedItem.compartmentLpn && (
 <p className="text-xl font-bold text-[var(--primary)] dark:text-[var(--primary)] text-center mb-2">
 {selectedItem.compartmentLpn.split("-").pop()}
 </p>
 )}

 {/* Compartment Grid */}
 {(() => {
 const compartments = generateCompartments(selectedItem.containerName, selectedItem.compartmentConfig);
 const { cols, rows } = selectedItem.compartmentConfig;
 const isSingleCompartment = compartments.length === 1;

 return (
 <div className="max-w-lg mx-auto w-full">
 <div className={`border-4 border-[var(--border)] dark:border-[var(--border)] rounded-lg overflow-hidden bg-[var(--surface-container-low)] dark:bg-[var(--card)] ${isSingleCompartment ? "min-h-[160px]" : ""}`}>
 <div
 className="w-full h-full"
 style={{
 display: "grid",
 gridTemplateColumns: `repeat(${cols}, 1fr)`,
 gridTemplateRows: `repeat(${rows}, 1fr)`,
 minHeight: isSingleCompartment ? "160px" : `${rows * 70}px`,
 maxHeight: "240px",
 }}
 >
 {compartments.map((compartment, index) => {
 const isActive = selectedItem.compartmentLpn === compartment.lpn;
 const qty = compartmentInventory.get(compartment.lpn) || 0;
 const row = Math.floor(index / cols);
 const col = index % cols;
 const borderClasses: string[] = [];
 if (col < cols - 1) borderClasses.push("border-r");
 if (row < rows - 1) borderClasses.push("border-b");

 return (
 <div
 key={compartment.lpn}
 className={`flex flex-col items-center justify-center transition-all ${borderClasses.join(" ")} border-[var(--border)] dark:border-[var(--border)] ${
 isActive
 ? "bg-[var(--primary)] "
 : "bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)]"
 }`}
 >
 <div className={`text-lg font-mono font-bold leading-none ${isActive ? "text-white" : "text-[var(--muted-foreground)]"}`}>
 {compartment.lpn.split("-").pop()}
 </div>
 {qty > 0 && (
 <div className={`text-[10px] font-medium mt-0.5 ${isActive ? "text-[var(--muted-foreground)]" : "text-[var(--muted-foreground)]"}`}>
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

 {/* Quantity to Inspect */}
 <div className="mt-4 max-w-sm mx-auto w-full text-center">
 <div className="text-xs text-[var(--muted-foreground)] mb-1">Quantity to Inspect</div>
 <div className="text-5xl font-bold text-[var(--primary)] dark:text-[var(--primary)]">
 {selectedItem.inspectQuantity}
 </div>
 </div>
 </div>

 {/* Confirm Button */}
 <div className="flex-shrink-0 p-3">
 {(() => {
 const currentIndex = items.findIndex((i) => i.id === selectedItem.id);
 const isLastItem = currentIndex === items.length - 1;
 return (
 <button
 onClick={handleConfirm}
 className="w-full px-6 py-4 bg-[var(--primary)] hover:opacity-90 active:scale-[0.98] text-[var(--primary-foreground)] rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
 >
 <Check size={20} />
 {isLastItem ? "Confirm & Complete" : "Confirm"}
 </button>
 );
 })()}
 </div>
 </div>
 ) : (
 <div className="flex-1 flex items-center justify-center p-6">
 <div className="text-center max-w-xs">
 <div className="w-16 h-16 bg-[var(--surface-container-low)] dark:bg-[var(--card)] rounded-full flex items-center justify-center mx-auto mb-3">
 <Package size={32} className="text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]" />
 </div>
 <p className="text-[var(--muted-foreground)]">Select an item to begin inspection</p>
 </div>
 </div>
 )}
 </div>
 );
 })()}
 </div>

 {/* Right Column - Work List + Item */}
 <div className="w-[28%] min-w-[350px] h-[calc(100vh-100px)] flex flex-col gap-3">
 {/* Work List Section */}
 {currentRegistration && (
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-xl p-3 flex-shrink-0">
 <div className="flex items-center gap-2 mb-2">
 <div className="w-8 h-8 bg-[var(--primary)]/20 /20 rounded-lg flex items-center justify-center">
 <ClipboardList size={16} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 </div>
 <h2 className="font-semibold text-[var(--foreground)] ">Work List</h2>
 </div>
 <div className="space-y-1.5">
 <div>
 <label className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-0.5 block">Work List ID</label>
 <p className="text-[var(--foreground)]  font-mono text-sm">{currentRegistration.workListId}</p>
 </div>
 <div className="grid grid-cols-2 gap-2 text-xs text-[var(--muted-foreground)]">
 <div>Items: <span className="font-medium text-[var(--foreground)] ">{currentRegistration.itemCount}</span></div>
 <div>Inspected: <span className="font-medium text-[var(--foreground)] ">{currentRegistration.inspectedItems.size}</span></div>
 </div>
 </div>
 </div>
 )}

 {/* Current Item Section */}
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-xl overflow-hidden flex-1 flex flex-col min-h-0">
 <div className="p-3 border-b border-[var(--border)]  flex-shrink-0">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <div className="w-8 h-8 bg-[var(--primary)]/20 /20 rounded-lg flex items-center justify-center">
 <Package size={16} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 </div>
 <h2 className="font-semibold text-[var(--foreground)] ">
 Current Item {selectedItem ? `(${items.findIndex((i) => i.id === selectedItem.id) + 1} of ${items.length})` : `(0 of ${items.length})`}
 </h2>
 </div>
 <div className="flex items-center gap-1">
 <button
 onClick={() => {
 const idx = items.findIndex((i) => i.id === selectedItem?.id);
 if (idx > 0) setSelectedItem(items[idx - 1]);
 }}
 disabled={!selectedItem || items.findIndex((i) => i.id === selectedItem.id) <= 0}
 className="p-1.5 rounded hover:bg-[var(--surface-container-high)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
 >
 <ChevronLeft size={20} className="text-[var(--foreground)] " />
 </button>
 <button
 onClick={() => {
 const idx = items.findIndex((i) => i.id === selectedItem?.id);
 if (idx < items.length - 1) setSelectedItem(items[idx + 1]);
 }}
 disabled={!selectedItem || items.findIndex((i) => i.id === selectedItem.id) >= items.length - 1}
 className="p-1.5 rounded hover:bg-[var(--surface-container-high)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
 >
 <ChevronRight size={20} className="text-[var(--foreground)] " />
 </button>
 </div>
 </div>
 </div>

 <div className="overflow-y-auto flex-1 p-3">
 {selectedItem ? (
 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
 {selectedItem.imageUrl && (
 <div className="w-full aspect-[4/3] bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-lg overflow-hidden flex items-center justify-center p-4">
 <img src={selectedItem.imageUrl} alt={selectedItem.description} className="max-w-full max-h-full object-contain" />
 </div>
 )}

 <div className="space-y-1.5">
 <div>
 <div className="text-[10px] text-[var(--muted-foreground)] mb-0.5">SKU</div>
 <div className="font-mono text-xl font-bold text-[var(--foreground)] ">{selectedItem.sku}</div>
 </div>
 <div>
 <div className="text-[10px] text-[var(--muted-foreground)] mb-0.5">Description</div>
 <div className="text-sm text-[var(--foreground)]  leading-snug">{selectedItem.description}</div>
 </div>
 <div className="grid grid-cols-2 gap-2">
 <div>
 <div className="text-[10px] text-[var(--muted-foreground)] mb-0.5">Location</div>
 <div className="text-sm font-medium text-[var(--foreground)]  mb-0.5">{selectedItem.location}</div>
 <div className="flex flex-col gap-0.5 text-[10px] text-[var(--muted-foreground)]">
 <span>Bin: {selectedItem.binNumber}</span>
 <span>Compartment: <span className="font-mono text-[var(--primary)] dark:text-[var(--primary)] font-bold">{selectedItem.compartmentLpn}</span></span>
 </div>
 </div>
 <div>
 <div className="text-[10px] text-[var(--muted-foreground)] mb-0.5">Priority</div>
 <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium inline-block ${
 selectedItem.priority === "High"
 ? "bg-[var(--state-error)]/10 text-[var(--state-error)] dark:text-[var(--state-error)]"
 : "bg-[var(--state-debug)]/10 text-[var(--muted-foreground)]"
 }`}>
 {selectedItem.priority}
 </span>
 </div>
 </div>
 <div>
 <div className="text-[10px] text-[var(--muted-foreground)] mb-0.5">Inspect Quantity</div>
 <div className="text-2xl font-bold text-[var(--primary)] dark:text-[var(--primary)]">{selectedItem.inspectQuantity}</div>
 </div>
 </div>
 </motion.div>
 ) : (
 <div className="h-full flex items-center justify-center">
 <div className="text-center max-w-xs">
 <div className="w-16 h-16 bg-[var(--surface-container-low)] dark:bg-[var(--card)] rounded-full flex items-center justify-center mx-auto mb-3">
 <Package size={32} className="text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]" />
 </div>
 <p className="text-[var(--muted-foreground)]">No item selected. Select a sortbar to begin.</p>
 </div>
 </div>
 )}
 </div>
 </div>
 </div>
 </div>

 {/* Adjust Inventory Modal */}
 <AnimatePresence>
 {showAdjustInventory && (
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="fixed inset-0 z-50 flex items-center justify-center p-4"
 >
 <div className="absolute inset-0 bg-black/50" onClick={handleAdjustCancel} />
 <motion.div
 initial={{ scale: 0.9, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 exit={{ scale: 0.9, opacity: 0 }}
 onClick={(e) => e.stopPropagation()}
 className="relative w-full max-w-lg bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-xl overflow-hidden"
 >
 <div className="bg-[var(--state-info)] dark:bg-[var(--state-info-container)] p-6 text-[var(--state-on-info-container)]">
 <h2 className="text-xl font-bold">
 {adjustStep === "select-item" && "Select Item to Adjust"}
 {adjustStep === "adjust-quantity" && "Adjust Quantity"}
 {adjustStep === "reason-code" && "Adjustment Reason"}
 </h2>
 <p className="text-[var(--foreground)]/80 mt-1 text-sm">
 {adjustStep === "select-item" && "Choose which item to adjust inventory for"}
 {adjustStep === "adjust-quantity" && "Enter the quantity adjustment (+/-)"}
 {adjustStep === "reason-code" && "Provide a reason for this adjustment"}
 </p>
 </div>

 <div className="p-6">
 {/* Step 1: Select Item */}
 {adjustStep === "select-item" && (
 <div className="space-y-3 max-h-[60vh] overflow-y-auto">
 {items.map((item) => {
 const currentQty = compartmentInventory.get(item.compartmentLpn) || 0;
 return (
 <button
 key={item.id}
 onClick={() => handleAdjustItemSelect(item)}
 className="w-full text-left p-4 rounded-lg border-2 border-[var(--border)]  hover:border-[var(--state-info)]/40 dark:hover:border-[var(--state-info)] hover:bg-[var(--state-info-container)] dark:hover:bg-[var(--state-info-container)]/10 transition-all"
 >
 <div className="flex items-start justify-between gap-3">
 <div className="flex-1">
 <div className="font-mono text-sm font-bold text-[var(--foreground)]  mb-1">{item.sku}</div>
 <div className="text-sm text-[var(--muted-foreground)] mb-2">{item.description}</div>
 <div className="flex items-center gap-3 text-xs text-[var(--muted-foreground)]">
 <span>Bin: {item.binNumber}</span>
 <span>Compartment: <span className="font-mono text-[var(--primary)] dark:text-[var(--primary)] font-bold">{item.compartmentLpn.split("-").pop()}</span></span>
 </div>
 </div>
 <div className="text-right">
 <div className="text-xl font-bold text-[var(--foreground)] ">{currentQty}</div>
 <div className="text-xs text-[var(--muted-foreground)]">units</div>
 </div>
 </div>
 </button>
 );
 })}
 </div>
 )}

 {/* Step 2: Adjust Quantity */}
 {adjustStep === "adjust-quantity" && selectedAdjustItem && (
 <div>
 <div className="bg-[var(--surface-container-low)] dark:bg-[var(--card)] rounded-lg p-4 mb-4">
 <div className="font-mono text-sm font-bold text-[var(--foreground)]  mb-1">{selectedAdjustItem.sku}</div>
 <div className="text-sm text-[var(--muted-foreground)] mb-2">{selectedAdjustItem.description}</div>
 <div className="text-xs text-[var(--muted-foreground)]">
 Bin: {selectedAdjustItem.binNumber} · Compartment: <span className="font-mono text-[var(--primary)] dark:text-[var(--primary)] font-bold">{selectedAdjustItem.compartmentLpn.split("-").pop()}</span>
 </div>
 </div>

 <div className="mb-6">
 <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Current Quantity</label>
 <div className="text-3xl font-bold text-[var(--foreground)]  mb-4">
 {compartmentInventory.get(selectedAdjustItem.compartmentLpn) || 0} units
 </div>

 <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Adjustment Amount</label>
 <div className="flex items-center gap-3 mb-3">
 <button
 onClick={() => setAdjustDelta(Math.max(adjustDelta - 1, -(compartmentInventory.get(selectedAdjustItem.compartmentLpn) || 0)))}
 className="w-12 h-12 bg-[var(--state-error)] hover:bg-[var(--state-error-container)] text-[var(--state-error-foreground)] rounded-lg font-bold text-xl transition-colors"
 >
 -
 </button>
 <input
 type="number"
 value={adjustDelta}
 onChange={(e) => setAdjustDelta(parseInt(e.target.value) || 0)}
 className="flex-1 px-4 py-3 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg text-[var(--foreground)]  text-center text-2xl font-bold focus:outline-none focus: focus: focus:border-transparent"
 />
 <button
 onClick={() => setAdjustDelta(adjustDelta + 1)}
 className="w-12 h-12 bg-[var(--state-success)] hover:bg-[var(--state-success)] text-[var(--state-success-foreground)] rounded-lg font-bold text-xl transition-colors"
 >
 +
 </button>
 </div>

 <div className="bg-[var(--state-info-container)] dark:bg-[var(--state-info-container)]/20 border border-[var(--secondary)]/30 dark:border-[var(--secondary-container)]/30 rounded-lg p-3">
 <div className="text-sm text-[var(--state-on-info-container)] dark:text-[var(--state-info)]">
 New quantity: <span className="font-bold">{(compartmentInventory.get(selectedAdjustItem.compartmentLpn) || 0) + adjustDelta} units</span>
 </div>
 </div>
 </div>

 <div className="flex gap-3">
 <button onClick={handleAdjustBack} className="flex-1 px-4 py-3 bg-[var(--surface-container)] dark:bg-[var(--card)] hover:bg-[var(--surface-container-high)] text-[var(--foreground)]  rounded-lg font-medium transition-colors">Back</button>
 <button onClick={handleAdjustQuantityConfirm} disabled={adjustDelta === 0} className="flex-1 px-4 py-3 bg-[var(--state-info)] dark:bg-[var(--state-info-container)] hover:bg-[var(--state-info)] dark:hover:bg-[var(--state-info)] text-[var(--state-on-info-container)] rounded-lg font-medium transition-colors disabled:bg-[var(--surface-container-high)] disabled:text-[var(--muted-foreground)] disabled:border-transparent disabled:opacity-60 disabled:cursor-not-allowed">Next</button>
 </div>
 </div>
 )}

 {/* Step 3: Reason Code */}
 {adjustStep === "reason-code" && selectedAdjustItem && (
 <div>
 <div className="bg-[var(--surface-container-low)] dark:bg-[var(--card)] rounded-lg p-4 mb-4">
 <div className="font-mono text-sm font-bold text-[var(--foreground)]  mb-1">
 {selectedAdjustItem.sku} - {selectedAdjustItem.compartmentLpn.split("-").pop()}
 </div>
 <div className="text-sm text-[var(--muted-foreground)]">
 Adjustment: <span className={`font-bold ${adjustDelta > 0 ? "text-[var(--state-on-success-container)]" : "text-[var(--state-error)]"}`}>
 {adjustDelta > 0 ? "+" : ""}{adjustDelta}
 </span> units
 </div>
 </div>

 <div className="mb-6">
 <label className="block text-sm font-medium text-[var(--foreground)] mb-3">Reason Code</label>
 <div className="grid grid-cols-2 gap-2 mb-3">
 {["Count Error", "Damaged", "Lost", "Found", "System Error", "Other"].map((code) => (
 <button
 key={code}
 onClick={() => setAdjustReasonCode(code)}
 className={`px-3 py-2 text-sm rounded-lg font-medium transition-colors text-left ${
 adjustReasonCode === code
 ? "bg-[var(--state-info)] dark:bg-[var(--state-info-container)] text-[var(--state-on-info-container)]"
 : "bg-[var(--surface-container-low)] dark:bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--surface-container-high)]"
 }`}
 >
 {code}
 </button>
 ))}
 </div>
 <input
 type="text"
 value={adjustReasonCode}
 onChange={(e) => setAdjustReasonCode(e.target.value)}
 placeholder="Or enter custom reason..."
 className="w-full px-4 py-3 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg text-[var(--foreground)]  placeholder-zinc-500 dark:placeholder-zinc-500 focus:outline-none focus: focus: focus:border-transparent"
 />
 </div>

 <div className="flex gap-3">
 <button onClick={handleAdjustBack} className="flex-1 px-4 py-3 bg-[var(--surface-container)] dark:bg-[var(--card)] hover:bg-[var(--surface-container-high)] text-[var(--foreground)]  rounded-lg font-medium transition-colors">Back</button>
 <button onClick={handleAdjustFinalConfirm} disabled={!adjustReasonCode.trim()} className="flex-1 px-4 py-3 bg-[var(--state-info)] dark:bg-[var(--state-info-container)] hover:bg-[var(--state-info)] dark:hover:bg-[var(--state-info)] text-[var(--state-on-info-container)] rounded-lg font-medium transition-colors disabled:bg-[var(--surface-container-high)] disabled:text-[var(--muted-foreground)] disabled:border-transparent disabled:opacity-60 disabled:cursor-not-allowed">Confirm Adjustment</button>
 </div>
 </div>
 )}

 {adjustStep === "select-item" && (
 <button onClick={handleAdjustCancel} className="w-full mt-3 px-4 py-3 bg-[var(--surface-container)] dark:bg-[var(--card)] hover:bg-[var(--surface-container-high)] text-[var(--foreground)]  rounded-lg font-medium transition-colors">
 Cancel
 </button>
 )}
 </div>
 </motion.div>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 </div>
 );
}
