import { useState } from "react";
import { Link } from "react-router-dom";
import { ClipboardList, ChevronRight, Package, CheckCircle2, Home, Grid3x3, Box, Check, ChevronLeft, Plus, Minus, Scan, X } from "lucide-react";
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

type CountItem = {
 id: string;
 sku: string;
 description: string;
 expectedQuantity: number;
 location: string;
 binNumber: string;
 compartmentLpn: string;
 imageUrl: string;
 priority: string;
};

type SortbarRegistration = {
 sortbarId: string;
 workListId: string;
 itemCount: number;
 totalQuantity: number;
 items: CountItem[];
 countedItems: Map<string, number>;
};

// Mock data for sortbar
const initialSortbars = [
 { id: "SB-CC1", name: "CC1", zone: "Cycle Count Zone", capacity: 24 },
 { id: "SB-CC2", name: "CC2", zone: "Cycle Count Zone", capacity: 24 },
 { id: "SB-CC3", name: "CC3", zone: "Cycle Count Zone", capacity: 32 },
 { id: "SB-CC4", name: "CC4", zone: "Cycle Count Zone", capacity: 32 },
];

// Mock work lists
const mockWorkLists: WorkItem[] = [
 { id: "WL-CC001", workList: "WL-CC001", type: "Cycle Count", status: "Available", priority: "Normal", created: "2026-06-02 08:00:00" },
 { id: "WL-CC002", workList: "WL-CC002", type: "Cycle Count", status: "Available", priority: "High", created: "2026-06-02 09:15:00" },
 { id: "WL-CC003", workList: "WL-CC003", type: "Cycle Count", status: "Available", priority: "Normal", created: "2026-06-02 10:30:00" },
];

// Generate mock items for cycle count
const generateMockCountItems = (): CountItem[] => {
 const items = [
 {
 sku: "SKU-1001",
 description: "Organic Whole Milk",
 expectedQuantity: 24,
 location: "A-12-3",
 binNumber: "BIN-A1-01",
 priority: "Normal",
 imageUrl: "https://images.unsplash.com/photo-1553301803-768cd4a59b9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwd2hvbGUlMjBtaWxrJTIwY2FydG9ufGVufDF8fHx8MTc4MDQzMjcxOHww&ixlib=rb-4.1.0&q=80&w=1080"
 },
 {
 sku: "SKU-1002",
 description: "Cheerios Original",
 expectedQuantity: 12,
 location: "B-08-2",
 binNumber: "BIN-A1-02",
 priority: "High",
 imageUrl: "https://images.unsplash.com/photo-1577118531916-3ae7e50778cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxjaGVlcmlvcyUyMGNlcmVhbCUyMGJveHxlbnwxfHx8fDE3ODA0MzI3MTl8MA&ixlib=rb-4.1.0&q=80&w=1080"
 },
 {
 sku: "SKU-1003",
 description: "Kraft Macaroni & Cheese",
 expectedQuantity: 8,
 location: "C-15-1",
 binNumber: "BIN-A1-03",
 priority: "Normal",
 imageUrl: macAndCheeseImage
 },
 {
 sku: "SKU-1004",
 description: "Coca-Cola 12-Pack",
 expectedQuantity: 18,
 location: "D-22-4",
 binNumber: "BIN-A1-04",
 priority: "Normal",
 imageUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2NhJTIwY29sYSUyMDEyJTIwcGFjayUyMGNhbnN8ZW58MXx8fHwxNzgwNDMyNzE5fDA&ixlib=rb-4.1.0&q=80&w=1080"
 },
 {
 sku: "SKU-1005",
 description: "Wonder Bread",
 expectedQuantity: 15,
 location: "E-05-2",
 binNumber: "BIN-A1-05",
 priority: "High",
 imageUrl: "https://images.unsplash.com/photo-1534620808146-d33bb39128b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxzbGljZWQlMjBicmVhZCUyMGxvYWYlMjBwYWNrYWdlfGVufDF8fHx8MTc4MDQzMjcyMHww&ixlib=rb-4.1.0&q=80&w=1080"
 },
 ];

 return items.map((item, index) => ({
 id: `item-${index + 1}`,
 ...item,
 compartmentLpn: `LPN-CC-${10000 + index}`,
 }));
};

export function CycleCount() {
 // State management
 const [selectedSortbar, setSelectedSortbar] = useState<string | null>(null);
 const [activeSortbar, setActiveSortbar] = useState<string | null>(null);
 const [sortbarRegistrations, setSortbarRegistrations] = useState<SortbarRegistration[]>([]);
 const [showWorkListPanel, setShowWorkListPanel] = useState(false);
 const [selectedItem, setSelectedItem] = useState<CountItem | null>(null);
 const [enteredCount, setEnteredCount] = useState<string>("");
 const [showConfirmation, setShowConfirmation] = useState(false);
 const [items, setItems] = useState<CountItem[]>([]);
 const [showSkuVerification, setShowSkuVerification] = useState(false);
 const [skuVerificationInput, setSkuVerificationInput] = useState("");
 const [isSkuVerified, setIsSkuVerified] = useState(false);

 const currentRegistration = activeSortbar ? sortbarRegistrations.find(reg => reg.sortbarId === activeSortbar) : null;

 // Get sortbar status
 const getSortbarStatus = (sortbarId: string) => {
 const registration = sortbarRegistrations.find(reg => reg.sortbarId === sortbarId);
 return registration ? "registered" : "available";
 };

 // Handle sortbar selection
 const handleSortbarSelect = (sortbarId: string) => {
 setSelectedSortbar(sortbarId);
 setActiveSortbar(sortbarId);

 const registration = sortbarRegistrations.find(reg => reg.sortbarId === sortbarId);

 if (registration) {
 // Load existing registration
 setItems(registration.items);
 setSelectedItem(registration.items[0]);
 setShowWorkListPanel(false);
 } else {
 // Show work list selection
 setShowWorkListPanel(true);
 }
 };

 // Handle work list selection
 const handleWorkListSelect = (workListId: string) => {
 const mockItems = generateMockCountItems();
 const totalQty = mockItems.reduce((sum, item) => sum + item.expectedQuantity, 0);

 const newRegistration: SortbarRegistration = {
 sortbarId: activeSortbar!,
 workListId,
 itemCount: mockItems.length,
 totalQuantity: totalQty,
 items: mockItems,
 countedItems: new Map(),
 };

 setSortbarRegistrations([...sortbarRegistrations, newRegistration]);
 setItems(mockItems);
 setSelectedItem(mockItems[0]);
 setShowWorkListPanel(false);
 setEnteredCount("");
 setIsSkuVerified(false);
 setSkuVerificationInput("");
 // Show SKU verification modal for first item
 setShowSkuVerification(true);
 toast.success("Work list loaded");
 };

 // Handle item selection
 const handleItemSelect = (item: CountItem) => {
 setSelectedItem(item);
 const counted = currentRegistration?.countedItems.get(item.id);
 setEnteredCount(counted !== undefined ? counted.toString() : "");
 setIsSkuVerified(false);
 setSkuVerificationInput("");
 // Show SKU verification modal
 setShowSkuVerification(true);
 };

 // Handle SKU verification
 const handleSkuVerificationSubmit = () => {
 if (!selectedItem) return;

 if (skuVerificationInput.trim().toUpperCase() === selectedItem.sku.toUpperCase()) {
 // SKU matches - proceed
 setShowSkuVerification(false);
 setSkuVerificationInput("");
 setIsSkuVerified(true);
 toast.success("SKU verified successfully");
 } else {
 // SKU mismatch
 toast.error("SKU mismatch", {
 description: `Expected ${selectedItem.sku}, but received ${skuVerificationInput.trim() || '(empty)'}. Please scan the correct item.`,
 duration: 5000,
 });
 setSkuVerificationInput("");
 }
 };

 // Handle number pad input
 const handleNumberInput = (num: string) => {
 if (num === "clear") {
 setEnteredCount("");
 } else if (num === "backspace") {
 setEnteredCount(prev => prev.slice(0, -1));
 } else {
 setEnteredCount(prev => prev + num);
 }
 };

 // Handle quantity increase/decrease
 const handleQuantityIncrease = () => {
 const current = parseInt(enteredCount) || 0;
 setEnteredCount((current + 1).toString());
 };

 const handleQuantityDecrease = () => {
 const current = parseInt(enteredCount) || 0;
 if (current > 0) {
 setEnteredCount((current - 1).toString());
 }
 };

 // Handle next item
 const handleNext = () => {
 if (!isSkuVerified) {
 toast.error("Please verify the SKU first");
 setShowSkuVerification(true);
 return;
 }

 if (!enteredCount) {
 toast.error("Please enter a count");
 return;
 }

 const entered = parseInt(enteredCount);
 if (isNaN(entered) || entered < 0) {
 toast.error("Please enter a valid count");
 return;
 }

 if (!currentRegistration || !selectedItem) return;

 // Save the count
 const newCountedItems = new Map(currentRegistration.countedItems);
 newCountedItems.set(selectedItem.id, entered);

 // Update registration
 const updatedRegistrations = sortbarRegistrations.map(reg =>
 reg.sortbarId === activeSortbar
 ? { ...reg, countedItems: newCountedItems }
 : reg
 );
 setSortbarRegistrations(updatedRegistrations);

 // Check if there are more items
 const currentIndex = items.findIndex(i => i.id === selectedItem.id);
 const hasMoreItems = currentIndex < items.length - 1;

 if (hasMoreItems) {
 const nextItem = items[currentIndex + 1];
 setSelectedItem(nextItem);
 const nextCounted = newCountedItems.get(nextItem.id);
 setEnteredCount(nextCounted !== undefined ? nextCounted.toString() : "");
 setIsSkuVerified(false);
 setSkuVerificationInput("");
 // Show SKU verification for next item
 setShowSkuVerification(true);
 toast.success("Count recorded");
 } else {
 // Show confirmation screen
 setShowConfirmation(true);
 }
 };

 // Handle completion
 const handleComplete = () => {
 // Remove registration
 const updatedRegistrations = sortbarRegistrations.filter(reg => reg.sortbarId !== activeSortbar);
 setSortbarRegistrations(updatedRegistrations);

 toast.success("Cycle count completed!");

 // Reset state
 setActiveSortbar(null);
 setSelectedSortbar(null);
 setItems([]);
 setSelectedItem(null);
 setEnteredCount("");
 setShowConfirmation(false);
 };

 // Handle cancel
 const handleCancel = () => {
 setShowWorkListPanel(false);
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
 <ClipboardList size={20} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 Cycle Count
 </span>
 </nav>
 </div>
 <div className="flex-1 overflow-y-auto p-6">

 {/* Confirmation Screen */}
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
 Cycle Count Complete
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
 <div className="text-sm text-[var(--muted-foreground)] mb-1">Items Counted</div>
 <div className="text-2xl font-semibold text-[var(--foreground)] ">{currentRegistration.countedItems.size}</div>
 </div>
 </div>

 <div className="space-y-2">
 <h3 className="font-medium text-[var(--foreground)]  mb-3">Count Summary</h3>
 {items.map((item) => {
 const counted = currentRegistration.countedItems.get(item.id);
 const isMatch = counted !== undefined && counted === item.expectedQuantity;
 const isVariance = counted !== undefined && counted !== item.expectedQuantity;

 return (
 <div
 key={item.id}
 className="flex items-center justify-between p-3 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-lg"
 >
 <div className="flex items-center gap-3">
 {isMatch && <CheckCircle2 className="text-[var(--state-success)]" size={20} />}
 {isVariance && <Package className="text-[var(--state-warning)]" size={20} />}
 <div>
 <div className="font-medium text-[var(--foreground)] ">{item.sku}</div>
 <div className="text-sm text-[var(--muted-foreground)]">{item.description}</div>
 </div>
 </div>
 <div className="text-right">
 {counted !== undefined ? (
 <>
 <div className={`font-semibold ${isMatch ? "text-[var(--state-on-success-container)] dark:text-[var(--state-success)]" : "text-[var(--state-on-warning-container)] dark:text-[var(--state-warning)]"}`}>
 {counted} counted
 </div>
 <div className="text-sm text-[var(--muted-foreground)]">
 Expected: {item.expectedQuantity}
 </div>
 </>
 ) : (
 <div className="text-sm text-[var(--muted-foreground)]">Not counted</div>
 )}
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
 onClick={handleCancel}
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

 {/* Main Layout - Three Column */}
 <div className={`flex gap-3 transition-all duration-500 ease-in-out ${showWorkListPanel ? 'mr-[500px]' : 'mr-0'}`}>
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
 {initialSortbars.map(sortbar => {
 const registration = sortbarRegistrations.find(reg => reg.sortbarId === sortbar.id);
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
 <span
 className={`text-[10px] px-1.5 py-0.5 rounded-full ${
 status === "available"
 ? "bg-[var(--primary)]/10 /10 text-[var(--primary)] dark:text-[var(--primary)]"
 : "bg-[var(--state-info)]/10 text-[var(--state-info)] dark:text-[var(--state-info)]"
 }`}
 >
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
 const countedCount = registration.countedItems.size;
 const progress = registration.itemCount > 0 ? (countedCount / registration.itemCount) * 100 : 0;

 return (
 <div className="h-1.5 bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)] rounded-full overflow-hidden">
 <div
 className="h-full bg-[var(--state-info)] dark:bg-[var(--state-info)] transition-all duration-300"
 style={{ width: `${progress}%` }}
 />
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

 {/* Center - Bin/Container Section */}
 <div className="flex-1 h-[calc(100vh-100px)]">
 {(() => {
 if (!currentRegistration) {
 return (
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-xl overflow-hidden h-full flex flex-col opacity-50">
 <div className="bg-[var(--surface-container-low)] dark:bg-[var(--card)] p-3 border-b border-[var(--border)]  flex-shrink-0">
 <div className="flex items-center gap-2">
 <Box size={20} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 <h2 className="font-semibold text-base text-[var(--foreground)] ">Bin</h2>
 </div>
 </div>
 <div className="h-full flex items-center justify-center">
 <div className="text-center max-w-xs">
 <div className="w-16 h-16 bg-[var(--surface-container-low)] dark:bg-[var(--card)] rounded-full flex items-center justify-center mx-auto mb-3">
 <Box size={32} className="text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]" />
 </div>
 <p className="text-[var(--muted-foreground)]">
 No active sortbar
 </p>
 </div>
 </div>
 </div>
 );
 }

 return (
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-xl overflow-hidden h-full flex flex-col">
 <div className="p-3 border-b border-[var(--border)]  flex-shrink-0">
 <div className="flex items-center gap-2">
 <div className="w-8 h-8 bg-[var(--primary)]/20 /20 rounded-lg flex items-center justify-center">
 <Box size={16} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 </div>
 <h2 className="font-semibold text-[var(--foreground)] ">
 Bin — {selectedItem?.binNumber || "BIN-A1-01"}
 </h2>
 </div>
 </div>

 {selectedItem ? (
 <div className="flex-1 flex flex-col overflow-hidden">
 {/* Compartment Section */}
 <div className="flex-1 p-3 flex flex-col">
 <div className="mb-2">
 <p className="text-xs text-[var(--muted-foreground)] font-medium mb-1">
 Count items in Compartment
 </p>
 {selectedItem.compartmentLpn && (
 <p className="text-lg font-bold text-[var(--primary)] dark:text-[var(--primary)] text-center mb-2">
 {selectedItem.compartmentLpn}
 </p>
 )}
 {/* Single Compartment Display */}
 <div className="max-w-sm mx-auto">
 <div className="border-4 border-[var(--border)] dark:border-[var(--border)] rounded-lg overflow-hidden bg-[var(--surface-container-low)] dark:bg-[var(--card)] min-h-[120px]">
 <div className="w-full h-full min-h-[120px] flex items-center justify-center bg-[var(--primary)]/5 /5">
 <div className="text-center p-4">
 <div className="text-sm font-medium text-[var(--muted-foreground)]">
 Compartment 1
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* Count Entry Section */}
 <div className="mt-3 max-w-sm mx-auto w-full">
 <div className="text-center mb-3">
 <div className="text-xs text-[var(--muted-foreground)] mb-2">Count Entered</div>
 <div className="text-5xl font-bold text-[var(--primary)] dark:text-[var(--primary)]">
 {enteredCount || "0"}
 </div>
 </div>

 {/* Increase/Decrease Buttons */}
 <div className="flex items-center gap-3 mb-3 justify-center">
 <button
 onClick={handleQuantityDecrease}
 className="w-20 h-12 bg-[var(--surface-container)] dark:bg-[var(--card)] hover:bg-[var(--surface-container-high)] rounded-lg flex items-center justify-center transition-colors"
 >
 <Minus size={20} className="text-[var(--foreground)] " />
 </button>
 <button
 onClick={handleQuantityIncrease}
 className="w-20 h-12 bg-[var(--surface-container)] dark:bg-[var(--card)] hover:bg-[var(--surface-container-high)] rounded-lg flex items-center justify-center transition-colors"
 >
 <Plus size={20} className="text-[var(--foreground)] " />
 </button>
 </div>

 {/* Keypad */}
 <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto">
 {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
 <button
 key={num}
 onClick={() => handleNumberInput(num.toString())}
 className="w-16 h-12 bg-[var(--surface-container)] dark:bg-[var(--card)] hover:bg-[var(--surface-container-high)] rounded-lg flex items-center justify-center text-[var(--foreground)]  font-semibold text-lg transition-colors"
 >
 {num}
 </button>
 ))}
 <button
 onClick={() => handleNumberInput("clear")}
 className="w-16 h-12 bg-[var(--surface-container)] dark:bg-[var(--card)] hover:bg-[var(--surface-container-high)] rounded-lg flex items-center justify-center text-[var(--foreground)]  font-semibold text-lg transition-colors"
 >
 C
 </button>
 <button
 onClick={() => handleNumberInput("0")}
 className="w-16 h-12 bg-[var(--surface-container)] dark:bg-[var(--card)] hover:bg-[var(--surface-container-high)] rounded-lg flex items-center justify-center text-[var(--foreground)]  font-semibold text-lg transition-colors"
 >
 0
 </button>
 <button
 onClick={() => handleNumberInput("backspace")}
 className="w-16 h-12 bg-[var(--state-error)]/20 dark:bg-[var(--state-error)]/30 hover:bg-[var(--state-error)]/30 dark:hover:bg-[var(--state-error)]/40 rounded-lg flex items-center justify-center text-[var(--state-error)] dark:text-[var(--state-error)] font-semibold transition-colors"
 >
 ⌫
 </button>
 </div>
 </div>
 </div>

 {/* Next/Confirm Button - Pinned at bottom */}
 <div className="flex-shrink-0 p-3">
 {(() => {
 const currentIndex = items.findIndex(i => i.id === selectedItem.id);
 const isLastItem = currentIndex === items.length - 1;
 return (
 <button
 onClick={handleNext}
 disabled={!isSkuVerified}
 className="w-full px-6 py-4 bg-[var(--primary)] hover:opacity-90 active:scale-[0.98] disabled:bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] disabled:text-[var(--muted-foreground)] disabled:cursor-not-allowed text-[var(--primary-foreground)] rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
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
 <div className="w-16 h-16 bg-[var(--surface-container-low)] dark:bg-[var(--card)] rounded-full flex items-center justify-center mx-auto mb-3">
 <Package size={32} className="text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]" />
 </div>
 <p className="text-[var(--muted-foreground)]">
 Select an item from the list to begin counting
 </p>
 </div>
 </div>
 )}
 </div>
 );
 })()}
 </div>

 {/* Right - Current Item Section */}
 <div className="w-[28%] min-w-[350px] h-[calc(100vh-100px)]">
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-xl overflow-hidden h-full flex flex-col">
 <div className="p-3 border-b border-[var(--border)]  flex-shrink-0">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <div className="w-8 h-8 bg-[var(--primary)]/20 /20 rounded-lg flex items-center justify-center">
 <Package size={16} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 </div>
 <h2 className="font-semibold text-[var(--foreground)] ">
 Current Item {selectedItem ? `(${items.findIndex(i => i.id === selectedItem.id) + 1} of ${items.length})` : `(0 of ${items.length})`}
 </h2>
 </div>
 <div className="flex items-center gap-1">
 <button
 onClick={() => {
 const currentIndex = items.findIndex(i => i.id === selectedItem?.id);
 if (currentIndex > 0) {
 const prevItem = items[currentIndex - 1];
 setSelectedItem(prevItem);
 const counted = currentRegistration?.countedItems.get(prevItem.id);
 setEnteredCount(counted !== undefined ? counted.toString() : "");
 setIsSkuVerified(false);
 setSkuVerificationInput("");
 setShowSkuVerification(true);
 }
 }}
 disabled={!selectedItem || items.findIndex(i => i.id === selectedItem.id) <= 0}
 className="p-1.5 rounded hover:bg-[var(--surface-container-high)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
 title="Previous item"
 >
 <ChevronLeft size={20} className="text-[var(--foreground)] " />
 </button>
 <button
 onClick={() => {
 const currentIndex = items.findIndex(i => i.id === selectedItem?.id);
 if (currentIndex < items.length - 1) {
 const nextItem = items[currentIndex + 1];
 setSelectedItem(nextItem);
 const counted = currentRegistration?.countedItems.get(nextItem.id);
 setEnteredCount(counted !== undefined ? counted.toString() : "");
 setIsSkuVerified(false);
 setSkuVerificationInput("");
 setShowSkuVerification(true);
 }
 }}
 disabled={!selectedItem || items.findIndex(i => i.id === selectedItem.id) >= items.length - 1}
 className="p-1.5 rounded hover:bg-[var(--surface-container-high)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
 title="Next item"
 >
 <ChevronRight size={20} className="text-[var(--foreground)] " />
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
 <div className="w-full aspect-[4/3] bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-lg overflow-hidden flex items-center justify-center p-4">
 <img
 src={selectedItem.imageUrl}
 alt={selectedItem.description}
 className="max-w-full max-h-full object-contain"
 />
 </div>
 )}

 {/* Item Details */}
 <div className="space-y-1.5">
 <div>
 <div className="text-[10px] text-[var(--muted-foreground)] mb-0.5">SKU</div>
 <div className="font-mono text-xl font-bold text-[var(--foreground)] ">
 {selectedItem.sku}
 </div>
 </div>

 <div>
 <div className="text-[10px] text-[var(--muted-foreground)] mb-0.5">Description</div>
 <div className="text-sm text-[var(--foreground)]  leading-snug">
 {selectedItem.description}
 </div>
 </div>

 <div className="grid grid-cols-2 gap-2">
 <div>
 <div className="text-[10px] text-[var(--muted-foreground)] mb-0.5">Location</div>
 <div className="text-sm font-medium text-[var(--foreground)]  mb-0.5">
 {selectedItem.location}
 </div>
 <div className="flex flex-col gap-0.5 text-[10px] text-[var(--muted-foreground)]">
 <span>Bin: {selectedItem.binNumber}</span>
 <span>Compartment: <span className="font-mono text-[var(--primary)] dark:text-[var(--primary)] font-bold">
 {selectedItem.compartmentLpn}
 </span></span>
 </div>
 </div>
 <div>
 <div className="text-[10px] text-[var(--muted-foreground)] mb-0.5">Priority</div>
 <div>
 <span
 className={`text-[10px] px-2 py-0.5 rounded-full font-medium inline-block ${
 selectedItem.priority === "High"
 ? "bg-[var(--state-error)]/10 text-[var(--state-error)] dark:text-[var(--state-error)]"
 : "bg-[var(--state-debug)]/10 text-[var(--muted-foreground)]"
 }`}
 >
 {selectedItem.priority}
 </span>
 </div>
 </div>
 </div>

 <div>
 <div className="text-[10px] text-[var(--muted-foreground)] mb-0.5">Expected Quantity</div>
 <div className="text-2xl font-bold text-[var(--primary)] dark:text-[var(--primary)]">
 {selectedItem.expectedQuantity}
 </div>
 </div>

 {/* Comparison */}
 {enteredCount && (
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-lg p-2 border-[var(--border)] ">
 <div className="text-xs font-medium text-[var(--foreground)]  mb-1.5">Comparison</div>
 <div className="space-y-0.5 text-xs">
 <div className="flex justify-between">
 <span className="text-[var(--muted-foreground)]">Expected:</span>
 <span className="font-medium text-[var(--foreground)] ">{selectedItem.expectedQuantity}</span>
 </div>
 <div className="flex justify-between">
 <span className="text-[var(--muted-foreground)]">Entered:</span>
 <span className={`font-medium ${
 parseInt(enteredCount) === selectedItem.expectedQuantity
 ? "text-[var(--state-on-success-container)] dark:text-[var(--state-success)]"
 : "text-[var(--state-on-warning-container)] dark:text-[var(--state-warning)]"
 }`}>
 {enteredCount}
 </span>
 </div>
 <div className="flex justify-between pt-1.5 border-t border-[var(--border)] ">
 <span className="text-[var(--muted-foreground)]">Variance:</span>
 <span className={`font-semibold ${
 parseInt(enteredCount) === selectedItem.expectedQuantity
 ? "text-[var(--state-on-success-container)] dark:text-[var(--state-success)]"
 : "text-[var(--state-on-warning-container)] dark:text-[var(--state-warning)]"
 }`}>
 {parseInt(enteredCount) - selectedItem.expectedQuantity > 0 ? '+' : ''}{parseInt(enteredCount) - selectedItem.expectedQuantity}
 </span>
 </div>
 </div>
 </div>
 )}
 </div>
 </motion.div>
 ) : (
 <div className="h-full flex items-center justify-center">
 <div className="text-center max-w-xs">
 <div className="w-16 h-16 bg-[var(--surface-container-low)] dark:bg-[var(--card)] rounded-full flex items-center justify-center mx-auto mb-3">
 <Package size={32} className="text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]" />
 </div>
 <p className="text-[var(--muted-foreground)]">
 No item selected. Select an item to begin counting.
 </p>
 </div>
 </div>
 )}
 </div>
 </div>
 </div>
 </div>

 {/* SKU Verification Modal */}
 <AnimatePresence>
 {showSkuVerification && selectedItem && (
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
 <div className="flex items-center justify-between mb-2">
 <h2 className="text-xl font-semibold text-[var(--foreground)]  flex items-center gap-2">
 <Scan className="text-[var(--primary)] dark:text-[var(--primary)]" size={24} />
 Verify Item SKU
 </h2>
 <button
 onClick={() => setShowSkuVerification(false)}
 className="p-1 hover:bg-[var(--surface-container-low)] dark:hover:bg-[var(--surface-container-high)] rounded transition-colors"
 >
 <X size={20} className="text-[var(--muted-foreground)]" />
 </button>
 </div>
 <p className="text-sm text-[var(--muted-foreground)]">
 Please scan or enter the item SKU to verify you are counting the correct item
 </p>
 </div>

 <div className="p-6">
 <div className="mb-4">
 <div className="text-sm text-[var(--muted-foreground)] mb-1">Expected SKU</div>
 <div className="font-mono text-2xl font-bold text-[var(--primary)] dark:text-[var(--primary)]">
 {selectedItem.sku}
 </div>
 </div>

 <div className="mb-4">
 <div className="text-sm text-[var(--muted-foreground)] mb-1">Expected Item</div>
 <div className="text-base text-[var(--foreground)] ">
 {selectedItem.description}
 </div>
 </div>

 <div className="mb-6">
 <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
 Scan or Enter SKU
 </label>
 <input
 type="text"
 value={skuVerificationInput}
 onChange={(e) => setSkuVerificationInput(e.target.value)}
 onKeyDown={(e) => e.key === "Enter" && handleSkuVerificationSubmit()}
 placeholder="Scan barcode or type SKU..."
 className="w-full px-4 py-3 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg text-[var(--foreground)]  placeholder-zinc-500 dark:placeholder-zinc-500 focus:outline-none focus: focus:)] dark:focus:)] focus:border-transparent text-lg font-mono uppercase"
 autoFocus
 />
 </div>

 <div className="flex gap-3">
 <button
 onClick={() => setShowSkuVerification(false)}
 className="flex-1 px-4 py-3 bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)] text-[var(--foreground)] rounded-lg font-medium hover:bg-[var(--surface-container-high)] transition-colors"
 >
 Cancel
 </button>
 <button
 onClick={handleSkuVerificationSubmit}
 disabled={!skuVerificationInput.trim()}
 className="flex-1 px-4 py-3 bg-[var(--primary)] hover:opacity-90 active:scale-[0.98] text-[var(--primary-foreground)] rounded-lg font-medium transition-colors disabled:bg-[var(--surface-container-high)] disabled:text-[var(--muted-foreground)] disabled:border-transparent disabled:opacity-60 disabled:cursor-not-allowed"
 >
 Verify
 </button>
 </div>
 </div>
 </motion.div>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 </div>
 );
}
