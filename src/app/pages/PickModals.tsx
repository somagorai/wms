import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
 ArrowLeft,
 AlertCircle,
 Box,
 Check,
 CheckCircle2,
 ClipboardList,
 Flame,
 Grid3x3,
 History,
 Info,
 List,
 Package,
 Search,
 Star,
 Plus,
 Minus,
 Printer,
 Scan,
 Trash2,
 X,
} from "lucide-react";
import { toast } from "sonner";
import { WorkListDetailsPanel } from "../components/WorkListDetailsPanel";
import {
 mockPickLists,
 initialSortbars,
 mockWorkstationHistory,
 generateMockItems,
} from "./PickData";
import type {
 ReplenItem,
 WorkLine,
 WorkOperation,
 WorkItem,
 SortbarRegistration,
} from "./PickData";

export interface PickModalsProps {
 // Slide-out panel / panel view
 showSortbarMenu: boolean;
 panelView: "menu" | "list" | "lpn" | "details";
 setPanelView: (view: "menu" | "list" | "lpn" | "details") => void;
 selectedSortbarData: { id: string; name: string; zone: string; capacity: number } | undefined;
 currentRegistration: SortbarRegistration | undefined;
 workListDetail: WorkItem | null;
 workLines: WorkLine[];
 workOperations: WorkOperation[];
 sortbarRegistrations: SortbarRegistration[];
 lpnInput: string;
 setLpnInput: (v: string) => void;
 handleCloseSortbarMenu: () => void;
 handleRegistrationMethodSelect: (method: "list" | "lpn") => void;
 handleListSelect: (listId: string) => void;
 handleLpnSubmit: () => void;
 handleUnregister: () => void;
 handleShowDetails: () => void;
 handleChangeContainerClick: () => void;

 // List Selection Modal
 showListSelection: boolean;
 setShowListSelection: (v: boolean) => void;

 // LPN Input Modal
 showLpnInput: boolean;
 setShowLpnInput: (v: boolean) => void;

 // Completion Confirmation Modal
 showCompletionConfirmation: boolean;
 items: ReplenItem[];
 processedItems: Map<string, number>;
 handleCompleteConfirmation: () => void;

 // Adjust Inventory Modal
 showAdjustInventory: boolean;
 adjustInventoryStep: "select-item" | "adjust-quantity" | "reason-code";
 compartmentInventory: Map<string, number>;
 selectedAdjustItem: ReplenItem | null;
 adjustInventoryDelta: number;
 setAdjustInventoryDelta: (v: number) => void;
 adjustInventoryReasonCode: string;
 setAdjustInventoryReasonCode: (v: string) => void;
 handleAdjustInventoryCancel: () => void;
 handleAdjustItemSelect: (item: ReplenItem) => void;
 handleAdjustInventoryBack: () => void;
 handleAdjustQuantityConfirm: () => void;
 handleAdjustInventoryFinalConfirm: () => void;

 // SKU Verification Modal
 showSkuVerification: boolean;
 selectedItem: ReplenItem | null;
 skuVerificationInput: string;
 setSkuVerificationInput: (v: string) => void;
 handleSkuVerificationCancel: () => void;
 handleSkuVerificationSubmit: () => void;

 // History Side Panel
 showHistory: boolean;
 setShowHistory: (v: boolean) => void;

 // Change Container Modal
 showChangeContainer: boolean;
 newContainerLpn: string;
 setNewContainerLpn: (v: string) => void;
 currentContainerLpn: string;
 handleChangeContainerCancel: () => void;
 handleChangeContainerSubmit: (action: "swap" | "split" | "change") => void;

 // Reason Code Modal
 showReasonCodeModal: boolean;
 pendingShortItem: ReplenItem | null;
 processedQuantity: number;
 reasonCodeInput: string;
 setReasonCodeInput: (v: string) => void;
 handleReasonCodeSubmit: () => void;
 handleReasonCodeCancel: () => void;

 // Compartment Empty Confirmation Modal
 showCompartmentEmptyConfirm: boolean;
 pendingCompartmentEmpty: { item: ReplenItem; compartmentId: string } | null;
 handleCompartmentEmptyConfirm: (isEmpty: boolean) => void;

 // Swap Prompt Modal
 showSwapPrompt: boolean;
 originalContainerLpn: string;
 handleSwapContinue: (useNewContainer: boolean) => void;

 // Legend Side Panel
 showLegend: boolean;
 setShowLegend: (v: boolean) => void;

 // Number Pad Modal
 showNumberPad: boolean;
 quantityInput: string;
 handleNumberPadCancel: () => void;
 handleNumberPadInput: (digit: string) => void;
 handleNumberPadConfirm: () => void;

 // Auto Register Modal
 showAutoRegister: boolean;
 setShowAutoRegister: (v: boolean) => void;
 autoRegisterStep: "count" | "confirm" | "scan";
 setAutoRegisterStep: (v: "count" | "confirm" | "scan") => void;
 autoRegisterCount: number;
 setAutoRegisterCount: (v: number) => void;
 autoRegisterAssignments: Array<{ sortbarId: string; sortbarName: string; workListId: string; workListName: string }>;
 setAutoRegisterAssignments: (v: Array<{ sortbarId: string; sortbarName: string; workListId: string; workListName: string }>) => void;
 autoRegisterCurrentIndex: number;
 setAutoRegisterCurrentIndex: (v: number) => void;
 autoRegisterLpnInput: string;
 setAutoRegisterLpnInput: (v: string) => void;
 setSortbarRegistrations: (v: SortbarRegistration[]) => void;
 setActiveSortbar: (v: string | null) => void;
 setSelectedSortbar: (v: string | null) => void;
 setItems: (v: ReplenItem[]) => void;
 setSelectedList: (v: string | null) => void;
 setProcessedItems: (v: Map<string, number>) => void;
 setCurrentContainerLpn: (v: string) => void;
 setOriginalContainerLpn: (v: string) => void;
 setCompartmentInventory: (v: Map<string, number>) => void;
 setSelectedItem: (v: ReplenItem | null) => void;
 setProcessedQuantity: (v: number) => void;
 setItemPickStartTime: (v: Date | null) => void;
 layoutMode: "pick-port" | "pack-hold" | "pack-hold-horizontal";
 itemBinAssignments: Map<string, 1 | 2>;
 setItemBinAssignments: (v: Map<string, 1 | 2>) => void;
 setBinArrivals: (v: Set<1 | 2>) => void;
 setFlashingSortbar: (v: string | null) => void;
 setPickListStartTime: (v: Date | null) => void;

 // Single LPN Modal
 showSingleLpnModal: boolean;
 setShowSingleLpnModal: (v: boolean) => void;
 singleLpnInput: string;
 setSingleLpnInput: (v: string) => void;
 singleLpnSortbarId: string | null;
 setSingleLpnSortbarId: (v: string | null) => void;
 singleLpnWorkListId: string | null;
 setSingleLpnWorkListId: (v: string | null) => void;
 handleSingleLpnSubmit: () => void;
}

export function PickModals(props: PickModalsProps) {
 const autoRegisterSubmitRef = useRef<HTMLButtonElement>(null);
 const [listSearch, setListSearch] = useState("");

 const {
 showSortbarMenu,
 panelView,
 setPanelView,
 selectedSortbarData,
 currentRegistration,
 workListDetail,
 workLines,
 workOperations,
 sortbarRegistrations,
 lpnInput,
 setLpnInput,
 handleCloseSortbarMenu,
 handleRegistrationMethodSelect,
 handleListSelect,
 handleLpnSubmit,
 handleUnregister,
 handleShowDetails,
 handleChangeContainerClick,
 showListSelection,
 setShowListSelection,
 showLpnInput,
 setShowLpnInput,
 showCompletionConfirmation,
 items,
 processedItems,
 handleCompleteConfirmation,
 showAdjustInventory,
 adjustInventoryStep,
 compartmentInventory,
 selectedAdjustItem,
 adjustInventoryDelta,
 setAdjustInventoryDelta,
 adjustInventoryReasonCode,
 setAdjustInventoryReasonCode,
 handleAdjustInventoryCancel,
 handleAdjustItemSelect,
 handleAdjustInventoryBack,
 handleAdjustQuantityConfirm,
 handleAdjustInventoryFinalConfirm,
 showSkuVerification,
 selectedItem,
 skuVerificationInput,
 setSkuVerificationInput,
 handleSkuVerificationCancel,
 handleSkuVerificationSubmit,
 showHistory,
 setShowHistory,
 showChangeContainer,
 newContainerLpn,
 setNewContainerLpn,
 currentContainerLpn,
 handleChangeContainerCancel,
 handleChangeContainerSubmit,
 showReasonCodeModal,
 pendingShortItem,
 processedQuantity,
 reasonCodeInput,
 setReasonCodeInput,
 handleReasonCodeSubmit,
 handleReasonCodeCancel,
 showCompartmentEmptyConfirm,
 pendingCompartmentEmpty,
 handleCompartmentEmptyConfirm,
 showSwapPrompt,
 originalContainerLpn,
 handleSwapContinue,
 showLegend,
 setShowLegend,
 showNumberPad,
 quantityInput,
 handleNumberPadCancel,
 handleNumberPadInput,
 handleNumberPadConfirm,
 showAutoRegister,
 setShowAutoRegister,
 autoRegisterStep,
 setAutoRegisterStep,
 autoRegisterCount,
 setAutoRegisterCount,
 autoRegisterAssignments,
 setAutoRegisterAssignments,
 autoRegisterCurrentIndex,
 setAutoRegisterCurrentIndex,
 autoRegisterLpnInput,
 setAutoRegisterLpnInput,
 setSortbarRegistrations,
 setActiveSortbar,
 setSelectedSortbar,
 setItems,
 setSelectedList,
 setProcessedItems,
 setCurrentContainerLpn,
 setOriginalContainerLpn,
 setCompartmentInventory,
 setSelectedItem,
 setProcessedQuantity,
 setItemPickStartTime,
 layoutMode,
 itemBinAssignments,
 setItemBinAssignments,
 setBinArrivals,
 setFlashingSortbar,
 setPickListStartTime,
 showSingleLpnModal,
 setShowSingleLpnModal,
 singleLpnInput,
 setSingleLpnInput,
 singleLpnSortbarId,
 setSingleLpnSortbarId,
 singleLpnWorkListId,
 setSingleLpnWorkListId,
 handleSingleLpnSubmit,
 } = props;

 return (
 <>
 {/* Sortbar Action Menu - Slide Out Panel (No backdrop, so main content remains interactive) */}
 <AnimatePresence>
 {showSortbarMenu && selectedSortbarData && (
 <motion.div
 initial={{ x: "100%" }}
 animate={{ x: 0 }}
 exit={{ x: "100%" }}
 transition={{ type: "spring", damping: 25, stiffness: 300 }}
 className={`fixed right-0 top-0 bottom-0 bg-[var(--surface-container-high)] text-[var(--foreground)] border-l-2 border-[var(--primary)] dark:border-[var(--primary)] z-50 overflow-y-auto ${
 panelView === "menu" ? "w-96" : "w-[calc(100vw-43%)]"
 }`}
 >
 {/* Header */}
 <div className="bg-[var(--primary)] p-6 text-[var(--primary-foreground)] sticky top-0 z-10">
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
 <h3 className="font-semibold text-[var(--foreground)]  mb-3">Registration Method</h3>
 <button
 onClick={() => handleRegistrationMethodSelect("list")}
 className="w-full p-4 rounded-lg border-[var(--border)]  hover:border-[var(--primary)] dark:hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 /5 transition-all"
 >
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 bg-[var(--primary)]/10 /10 rounded-lg flex items-center justify-center">
 <List size={20} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 </div>
 <div className="text-left">
 <p className="font-medium text-[var(--foreground)] ">Replen List by List</p>
 <p className="text-xs text-[var(--muted-foreground)]">Select from available work lists</p>
 </div>
 </div>
 </button>
 <button
 onClick={() => handleRegistrationMethodSelect("lpn")}
 className="w-full p-4 rounded-lg border-[var(--border)]  hover:border-[var(--primary)] dark:hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 /5 transition-all"
 >
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 bg-[var(--primary)]/10 /10 rounded-lg flex items-center justify-center">
 <Scan size={20} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 </div>
 <div className="text-left">
 <p className="font-medium text-[var(--foreground)] ">Replen List by LPN</p>
 <p className="text-xs text-[var(--muted-foreground)]">Scan or enter LPN for pick container</p>
 </div>
 </div>
 </button>
 </>
 ) : (
 <>
 <h3 className="font-semibold text-[var(--foreground)]  mb-3">Actions</h3>
 <button
 onClick={handleShowDetails}
 className="w-full p-4 rounded-lg border-[var(--border)]  hover:border-[var(--primary)] dark:hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 /5 transition-all"
 >
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 bg-[var(--primary)]/10 /10 rounded-lg flex items-center justify-center">
 <ClipboardList size={20} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 </div>
 <div className="text-left">
 <p className="font-medium text-[var(--foreground)] ">View Details</p>
 <p className="text-xs text-[var(--muted-foreground)]">See work list and line details</p>
 </div>
 </div>
 </button>
 <button
 onClick={handleChangeContainerClick}
 className="w-full p-4 rounded-lg border-[var(--border)]  hover:border-[var(--primary)] dark:hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 /5 transition-all"
 >
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 bg-[var(--primary)]/10 /10 rounded-lg flex items-center justify-center">
 <Box size={20} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 </div>
 <div className="text-left">
 <p className="font-medium text-[var(--foreground)] ">Change LPN</p>
 <p className="text-xs text-[var(--muted-foreground)]">Update container LPN</p>
 </div>
 </div>
 </button>
 <button
 onClick={() => toast.info("Print Label", { description: "Label printing feature coming soon" })}
 className="w-full p-4 rounded-lg border-[var(--border)]  hover:border-[var(--primary)] dark:hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 /5 transition-all"
 >
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 bg-[var(--primary)]/10 /10 rounded-lg flex items-center justify-center">
 <Printer size={20} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 </div>
 <div className="text-left">
 <p className="font-medium text-[var(--foreground)] ">Print Label</p>
 <p className="text-xs text-[var(--muted-foreground)]">Print container label</p>
 </div>
 </div>
 </button>
 <button
 onClick={handleUnregister}
 className="w-full p-4 rounded-lg border border-[var(--state-error)]/40 dark:border-[var(--state-error)] hover:border-[var(--state-error)]/40 dark:hover:border-[var(--state-error)]/40 hover:bg-[var(--state-error-container)] dark:hover:bg-[var(--state-error-container)]/10 transition-all"
 >
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 bg-[var(--state-error)]/10 rounded-lg flex items-center justify-center">
 <X size={20} className="text-[var(--state-error)] dark:text-[var(--state-error)]" />
 </div>
 <div className="text-left">
 <p className="font-medium text-[var(--state-error)] dark:text-[var(--state-error)]">Unregister Pick List</p>
 <p className="text-xs text-[var(--muted-foreground)]">Clear sortbar registration</p>
 </div>
 </div>
 </button>
 </>
 )}
 </div>
 )}

 {/* List Selection View */}
 {panelView === "list" && (() => {
 const available = mockPickLists.filter(
 list => !sortbarRegistrations.some(reg => reg.workListId === list.id)
 );
 // Recommended = highest priority Ready list first, then any
 const recommended = available.find(l => l.priority === "High" && l.status === "Ready")
 ?? available.find(l => l.status === "Ready")
 ?? available[0]
 ?? null;
 const query = listSearch.toLowerCase().trim();
 const additional = available
 .filter(l => l !== recommended)
 .filter(l => !query || l.id.toLowerCase().includes(query) || l.name.toLowerCase().includes(query));

 const ListCard = ({ list, isRecommended }: { list: typeof available[0]; isRecommended?: boolean }) => (
 <button
 onClick={() => { handleListSelect(list.id); setListSearch(""); }}
 className={`w-full text-left p-3.5 rounded-xl border-2 transition-all group ${
 isRecommended
 ? "border-[var(--primary)] dark:border-[var(--primary)] bg-[var(--primary)]/5 /5 hover:bg-[var(--primary)]/10 /10"
 : "border-[var(--border)]  hover:border-[var(--primary)] dark:hover:border-[var(--primary)] hover:bg-[var(--surface-container-lowest)] hover:bg-[var(--surface-container-high)]"
 }`}
 >
 <div className="flex items-start justify-between gap-2 mb-1.5">
 <div className="flex items-center gap-2 min-w-0">
 {isRecommended && <Star size={13} className="text-[var(--primary)] dark:text-[var(--primary)] flex-shrink-0 fill-current" />}
 <h3 className="font-semibold text-[var(--foreground)]  text-sm leading-tight truncate">{list.name}</h3>
 </div>
 <div className="flex items-center gap-1.5 flex-shrink-0">
 <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
 list.priority === "High"
 ? "bg-[var(--state-error)]/10 text-[var(--state-error)] dark:text-[var(--state-error)]"
 : "bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)] text-[var(--muted-foreground)]"
 }`}>{list.priority}</span>
 <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
 list.status === "Ready"
 ? "bg-[var(--state-success-container)]/60 text-[var(--state-on-success-container)] dark:text-[var(--state-success)]"
 : "bg-[var(--state-warning)]/10 text-[var(--state-on-warning-container)] dark:text-[var(--state-warning)]"
 }`}>{list.status}</span>
 </div>
 </div>
 <div className="flex items-center gap-3 text-xs text-[var(--muted-foreground)]">
 <span className="font-mono">{list.id}</span>
 <span>{list.itemCount} items</span>
 </div>
 </button>
 );

 return (
 <div className="flex flex-col h-full">
 {/* Search */}
 <div className="px-6 pt-4 pb-3 flex-shrink-0">
 <div className="relative">
 <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] pointer-events-none" />
 <input
 type="text"
 value={listSearch}
 onChange={e => setListSearch(e.target.value)}
 placeholder="Search by ID or name…"
 className="w-full pl-9 pr-3 py-2.5 bg-[var(--surface-container-low)] dark:bg-[var(--card)] border-[var(--border)]  rounded-lg text-sm text-[var(--foreground)]  placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-[var(--primary)] dark:focus:border-[var(--primary)] transition-colors"
 />
 </div>
 </div>

 <div className="flex-1 overflow-y-auto px-6 pb-6">
 {/* Recommended */}
 {recommended && (!query || recommended.id.toLowerCase().includes(query) || recommended.name.toLowerCase().includes(query)) && (
 <div className="mb-4">
 <p className="text-[11px] font-bold text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] uppercase tracking-widest mb-2 flex items-center gap-1.5">
 <Star size={11} className="fill-current" />
 Recommended
 </p>
 <ListCard list={recommended} isRecommended />
 </div>
 )}

 {/* Additional */}
 {additional.length > 0 && (
 <div>
 <p className="text-[11px] font-bold text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] uppercase tracking-widest mb-2">
 {query ? "Results" : "Additional Options"}
 </p>
 <div className="space-y-2">
 {additional.map(list => <ListCard key={list.id} list={list} />)}
 </div>
 </div>
 )}

 {available.length === 0 && (
 <div className="text-center py-10">
 <List size={32} className="text-[var(--foreground)] dark:text-[var(--muted-foreground)] mx-auto mb-2" />
 <p className="text-sm text-[var(--muted-foreground)]">No available pick lists</p>
 </div>
 )}

 {available.length > 0 && query && additional.length === 0 && !(recommended && (recommended.id.toLowerCase().includes(query) || recommended.name.toLowerCase().includes(query))) && (
 <div className="text-center py-10">
 <Search size={28} className="text-[var(--foreground)] dark:text-[var(--muted-foreground)] mx-auto mb-2" />
 <p className="text-sm text-[var(--muted-foreground)]">No lists match "<span className="font-medium">{listSearch}</span>"</p>
 </div>
 )}
 </div>
 </div>
 );
 })()}

 {/* LPN Input View */}
 {panelView === "lpn" && (
 <div className="p-6">
 <div className="mb-6">
 <label className="block text-sm font-medium text-[var(--foreground)]  mb-2">
 LPN Number
 </label>
 <input
 type="text"
 value={lpnInput}
 onChange={(e) => setLpnInput(e.target.value)}
 onKeyDown={(e) => e.key === "Enter" && handleLpnSubmit()}
 placeholder="Scan or enter LPN..."
 autoFocus
 className="w-full px-4 py-3 bg-[var(--surface-container-low)] dark:bg-[var(--card)] border-[var(--border)]  rounded-lg text-[var(--foreground)]  placeholder-zinc-500 dark:placeholder-zinc-500 focus:outline-none focus:border-[var(--primary)] dark:focus:border-[var(--primary)] transition-colors font-mono"
 />
 </div>
 <div className="flex gap-3">
 <button
 onClick={() => setPanelView("menu")}
 className="flex-1 px-4 py-3 bg-[var(--surface-container)] dark:bg-[var(--card)] hover:bg-[var(--surface-container-high)] text-[var(--foreground)]  rounded-lg font-medium transition-colors"
 >
 Cancel
 </button>
 <button
 onClick={handleLpnSubmit}
 disabled={!lpnInput.trim()}
 className="flex-1 px-4 py-3 bg-[var(--primary)] hover:opacity-90 active:scale-[0.98] text-[var(--primary-foreground)] rounded-lg font-medium transition-colors disabled:bg-[var(--surface-container-high)] disabled:text-[var(--muted-foreground)] disabled:border-transparent disabled:opacity-60 disabled:cursor-not-allowed"
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
 className="flex-1 px-4 py-3 bg-[var(--primary)] hover:opacity-90 active:scale-[0.98] text-[var(--primary-foreground)] rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
 >
 <Box size={18} />
 Change LPN
 </button>
 <button
 onClick={() => toast.info("Print Label", { description: "Label printing feature coming soon" })}
 className="flex-1 px-4 py-3 bg-[var(--state-info)] dark:bg-[var(--state-info-container)] hover:bg-[var(--state-info)] dark:hover:bg-[var(--state-info)] text-[var(--state-on-info-container)] rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
 >
 <Printer size={18} />
 Print Label
 </button>
 <button
 onClick={handleUnregister}
 className="flex-1 px-4 py-3 bg-[var(--state-error-container)] dark:bg-[var(--state-error)] hover:bg-[var(--state-error)] dark:hover:bg-[var(--state-error)] text-[var(--state-error-foreground)] rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
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
 <div className="absolute inset-0 bg-black/50" />
 <motion.div
 initial={{ scale: 0.9, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 exit={{ scale: 0.9, opacity: 0 }}
 onClick={(e) => e.stopPropagation()}
 className="relative w-full max-w-2xl bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-2xl overflow-hidden"
 >
 <div className="bg-[var(--primary)] p-6 text-[var(--primary-foreground)]">
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
 className="w-full text-left p-4 border-[var(--border)]  rounded-lg hover:border-[var(--primary)] dark:hover:border-[var(--primary)] hover:bg-[var(--surface-container-lowest)] hover:bg-[var(--surface-container-high)] transition-all"
 >
 <div className="flex items-center justify-between mb-2">
 <h3 className="font-semibold text-[var(--foreground)] ">{list.name}</h3>
 <span
 className={`text-xs px-2 py-1 rounded-full ${
 list.priority === "High"
 ? "bg-[var(--state-error)]/10 text-[var(--state-error)] dark:text-[var(--state-error)]"
 : "bg-[var(--state-debug)]/10 text-[var(--muted-foreground)]"
 }`}
 >
 {list.priority}
 </span>
 </div>
 <div className="flex items-center gap-4 text-sm text-[var(--muted-foreground)]">
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
 <div className="absolute inset-0 bg-black/50" />
 <motion.div
 initial={{ scale: 0.9, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 exit={{ scale: 0.9, opacity: 0 }}
 onClick={(e) => e.stopPropagation()}
 className="relative w-full max-w-md bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-2xl overflow-hidden"
 >
 <div className="bg-[var(--primary)] p-6 text-[var(--primary-foreground)]">
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
 <label className="block text-sm font-medium text-[var(--foreground)]  mb-2">
 LPN Number
 </label>
 <input
 type="text"
 value={lpnInput}
 onChange={(e) => setLpnInput(e.target.value)}
 onKeyDown={(e) => e.key === "Enter" && handleLpnSubmit()}
 placeholder="Scan or enter LPN..."
 autoFocus
 className="w-full px-4 py-3 bg-[var(--surface-container-low)] dark:bg-[var(--card)] border-[var(--border)]  rounded-lg text-[var(--foreground)]  placeholder-zinc-500 dark:placeholder-zinc-500 focus:outline-none focus:border-[var(--primary)] dark:focus:border-[var(--primary)] transition-colors font-mono"
 />
 </div>
 <div className="flex gap-3">
 <button
 onClick={() => setShowLpnInput(false)}
 className="flex-1 px-4 py-3 bg-[var(--surface-container)] dark:bg-[var(--card)] hover:bg-[var(--surface-container-high)] text-[var(--foreground)]  rounded-lg font-medium transition-colors"
 >
 Cancel
 </button>
 <button
 onClick={handleLpnSubmit}
 disabled={!lpnInput.trim()}
 className="flex-1 px-4 py-3 bg-[var(--primary)] hover:opacity-90 active:scale-[0.98] text-[var(--primary-foreground)] rounded-lg font-medium transition-colors disabled:bg-[var(--surface-container-high)] disabled:text-[var(--muted-foreground)] disabled:border-transparent disabled:opacity-60 disabled:cursor-not-allowed"
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
 <div className="absolute inset-0 bg-black/50" />
 <motion.div
 initial={{ scale: 0.9, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 exit={{ scale: 0.9, opacity: 0 }}
 onClick={(e) => e.stopPropagation()}
 className="relative w-full max-w-2xl bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-2xl overflow-hidden"
 >
 <div className="bg-[var(--state-success)] dark:bg-[var(--state-success)] p-6 text-[var(--state-success-foreground)]">
 <div className="flex items-center gap-3">
 <CheckCircle2 size={28} />
 <h2 className="text-2xl font-bold">Pick List Complete</h2>
 </div>
 <p className="text-[var(--foreground)]/80 mt-2 text-sm">
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
 ? "border-[var(--border)]  bg-[var(--state-success)]/10 dark:bg-[var(--state-success)]/10"
 : isShorted
 ? "border-[var(--border)]  bg-[var(--state-warning)]/10 dark:bg-[var(--state-warning)]/10"
 : "border-[var(--border)]  bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)]"
 }`}
 >
 <div className="flex items-start justify-between gap-4">
 <div className="flex-1 min-w-0">
 <div className="flex items-center gap-2 mb-1">
 {isComplete ? (
 <CheckCircle2 size={18} className="text-[var(--state-on-success-container)] dark:text-[var(--state-success)]" />
 ) : isShorted ? (
 <AlertCircle size={18} className="text-[var(--state-on-warning-container)] dark:text-[var(--state-warning)]" />
 ) : (
 <AlertCircle size={18} className="text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]" />
 )}
 <span className="font-mono font-semibold text-[var(--foreground)] ">
 {item.sku}
 </span>
 {isProcessed && (
 <span
 className={`text-xs px-2 py-0.5 rounded-full font-medium ml-auto ${
 isComplete
 ? "bg-[var(--state-success)]/20 text-[var(--state-on-success-container)] dark:text-[var(--state-success)]"
 : "bg-[var(--state-warning)]/20 text-[var(--state-on-warning-container)] dark:text-[var(--state-warning)]"
 }`}
 >
 {isComplete ? "Complete" : "Shorted"}
 </span>
 )}
 {!isProcessed && (
 <span className="text-xs px-2 py-0.5 rounded-full font-medium ml-auto bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)] text-[var(--muted-foreground)]">
 Not Processed
 </span>
 )}
 </div>
 <p className="text-sm text-[var(--muted-foreground)] mb-2 truncate">
 {item.description}
 </p>
 <div className="flex items-center gap-4 text-xs text-[var(--muted-foreground)]">
 <span>Location: {item.location}</span>
 </div>
 </div>
 <div className="text-right flex-shrink-0">
 <div className={`text-2xl font-bold leading-none ${
 isComplete
 ? "text-[var(--state-on-success-container)] dark:text-[var(--state-success)]"
 : isShorted
 ? "text-[var(--state-on-warning-container)] dark:text-[var(--state-warning)]"
 : "text-[var(--foreground)]"
 }`}>
 {processedQty} / {totalQty}
 </div>
 <div className="text-xs text-[var(--muted-foreground)] mt-0.5">quantity</div>
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
 <div className="bg-[var(--surface-container-low)] dark:bg-[var(--card)] rounded-lg p-4 mb-4">
 <div className="grid grid-cols-4 gap-4 text-center">
 <div>
 <div className="text-2xl font-bold text-[var(--foreground)] ">{items.length}</div>
 <div className="text-xs text-[var(--muted-foreground)]">Total Items</div>
 </div>
 <div>
 <div className="text-2xl font-bold text-[var(--primary)] dark:text-[var(--primary)]">
 {Array.from(processedItems.values()).filter(qty => qty > 0).length}
 </div>
 <div className="text-xs text-[var(--muted-foreground)]">Processed</div>
 </div>
 <div>
 <div className="text-2xl font-bold text-[var(--foreground)] ">
 {items.reduce((sum, item) => sum + item.quantity, 0)}
 </div>
 <div className="text-xs text-[var(--muted-foreground)]">Total Quantity</div>
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
 ? "text-[var(--state-on-success-container)] dark:text-[var(--state-success)]"
 : hasAnyShorted
 ? "text-[var(--state-on-warning-container)] dark:text-[var(--state-warning)]"
 : "text-[var(--primary)] dark:text-[var(--primary)]";
 })()
 }`}>
 {Array.from(processedItems.values()).reduce((sum, qty) => sum + qty, 0)}
 </div>
 <div className="text-xs text-[var(--muted-foreground)]">Quantity Processed</div>
 </div>
 </div>
 </div>

 {/* Action Message */}
 <div className="bg-[var(--state-success-container)] dark:bg-[var(--state-on-success-container)]/20 border border-[var(--state-success)]/40 dark:border-[var(--state-success)] rounded-lg p-4 mb-4">
 <p className="text-sm text-[var(--state-on-success-container)] dark:text-[var(--state-success)]">
 <strong>Pick List Complete!</strong> Click below to finalize this pick session and unregister the sortbar.
 </p>
 </div>

 {/* Action Button */}
 <button
 onClick={handleCompleteConfirmation}
 className="w-full px-6 py-3 bg-[var(--primary)] hover:opacity-90 active:scale-[0.98] text-[var(--primary-foreground)] rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
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
 <div className="absolute inset-0 bg-black/50" onClick={handleAdjustInventoryCancel} />
 <motion.div
 initial={{ scale: 0.9, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 exit={{ scale: 0.9, opacity: 0 }}
 onClick={(e) => e.stopPropagation()}
 className="relative w-full max-w-lg bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-xl overflow-hidden"
 >
 <div className="bg-[var(--state-info)] dark:bg-[var(--state-info-container)] p-6 text-[var(--state-on-info-container)]">
 <h2 className="text-xl font-bold">
 {adjustInventoryStep === "select-item" && "Select Item to Adjust"}
 {adjustInventoryStep === "adjust-quantity" && "Adjust Quantity"}
 {adjustInventoryStep === "reason-code" && "Adjustment Reason"}
 </h2>
 <p className="text-[var(--foreground)]/80 mt-1 text-sm">
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
 className="w-full text-left p-4 rounded-lg border-2 border-[var(--border)]  hover:border-[var(--state-info)]/40 dark:hover:border-[var(--state-info)] hover:bg-[var(--state-info-container)] dark:hover:bg-[var(--state-info-container)]/10 transition-all"
 >
 <div className="flex items-start justify-between gap-3">
 <div className="flex-1">
 <div className="font-mono text-sm font-bold text-[var(--foreground)]  mb-1">
 {item.sku}
 </div>
 <div className="text-sm text-[var(--muted-foreground)] mb-2">
 {item.description}
 </div>
 <div className="flex items-center gap-3 text-xs text-[var(--muted-foreground)]">
 <span>Bin: {item.binNumber}</span>
 <span>Compartment: <span className="font-mono text-[var(--primary)] dark:text-[var(--primary)] font-bold">
 {item.compartmentLpn.split('-').pop()}
 </span></span>
 </div>
 </div>
 <div className="text-right">
 <div className="text-xl font-bold text-[var(--foreground)] ">
 {currentQty}
 </div>
 <div className="text-xs text-[var(--muted-foreground)]">units</div>
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
 <div className="bg-[var(--surface-container-low)] dark:bg-[var(--card)] rounded-lg p-4 mb-4">
 <div className="font-mono text-sm font-bold text-[var(--foreground)]  mb-1">
 {selectedAdjustItem.sku}
 </div>
 <div className="text-sm text-[var(--muted-foreground)] mb-2">
 {selectedAdjustItem.description}
 </div>
 <div className="text-xs text-[var(--muted-foreground)]">
 Bin: {selectedAdjustItem.binNumber} · Compartment: <span className="font-mono text-[var(--primary)] dark:text-[var(--primary)] font-bold">
 {selectedAdjustItem.compartmentLpn.split('-').pop()}
 </span>
 </div>
 </div>

 <div className="mb-6">
 <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
 Current Quantity
 </label>
 <div className="text-3xl font-bold text-[var(--foreground)]  mb-4">
 {compartmentInventory.get(selectedAdjustItem.compartmentLpn) || 0} units
 </div>

 <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
 Adjustment Amount
 </label>
 <div className="flex items-center gap-3 mb-3">
 <button
 onClick={() => setAdjustInventoryDelta(Math.max(adjustInventoryDelta - 1, -(compartmentInventory.get(selectedAdjustItem.compartmentLpn) || 0)))}
 className="w-12 h-12 bg-[var(--state-error)] hover:bg-[var(--state-error-container)] text-[var(--state-error-foreground)] rounded-lg font-bold text-xl transition-colors"
 >
 -
 </button>
 <input
 type="number"
 value={adjustInventoryDelta}
 onChange={(e) => setAdjustInventoryDelta(parseInt(e.target.value) || 0)}
 className="flex-1 px-4 py-3 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg text-[var(--foreground)]  text-center text-2xl font-bold focus:outline-none focus: focus: focus:border-transparent"
 />
 <button
 onClick={() => setAdjustInventoryDelta(adjustInventoryDelta + 1)}
 className="w-12 h-12 bg-[var(--state-success)] hover:bg-[var(--state-success)] text-[var(--state-success-foreground)] rounded-lg font-bold text-xl transition-colors"
 >
 +
 </button>
 </div>

 <div className="bg-[var(--state-info-container)] dark:bg-[var(--state-info-container)]/20 border border-[var(--secondary)]/30 dark:border-[var(--secondary-container)]/30 rounded-lg p-3">
 <div className="text-sm text-[var(--state-on-info-container)] dark:text-[var(--state-info)]">
 New quantity: <span className="font-bold">
 {(compartmentInventory.get(selectedAdjustItem.compartmentLpn) || 0) + adjustInventoryDelta} units
 </span>
 </div>
 </div>
 </div>

 <div className="flex gap-3">
 <button
 onClick={handleAdjustInventoryBack}
 className="flex-1 px-4 py-3 bg-[var(--surface-container)] dark:bg-[var(--card)] hover:bg-[var(--surface-container-high)] text-[var(--foreground)]  rounded-lg font-medium transition-colors"
 >
 Back
 </button>
 <button
 onClick={handleAdjustQuantityConfirm}
 disabled={adjustInventoryDelta === 0}
 className="flex-1 px-4 py-3 bg-[var(--state-info)] dark:bg-[var(--state-info-container)] hover:bg-[var(--state-info)] dark:hover:bg-[var(--state-info)] text-[var(--state-on-info-container)] rounded-lg font-medium transition-colors disabled:bg-[var(--surface-container-high)] disabled:text-[var(--muted-foreground)] disabled:border-transparent disabled:opacity-60 disabled:cursor-not-allowed"
 >
 Next
 </button>
 </div>
 </div>
 )}

 {/* Step 3: Reason Code */}
 {adjustInventoryStep === "reason-code" && selectedAdjustItem && (
 <div>
 <div className="bg-[var(--surface-container-low)] dark:bg-[var(--card)] rounded-lg p-4 mb-4">
 <div className="font-mono text-sm font-bold text-[var(--foreground)]  mb-1">
 {selectedAdjustItem.sku} - {selectedAdjustItem.compartmentLpn.split('-').pop()}
 </div>
 <div className="text-sm text-[var(--muted-foreground)]">
 Adjustment: <span className={`font-bold ${adjustInventoryDelta > 0 ? 'text-[var(--state-on-success-container)]' : 'text-[var(--state-error)]'}`}>
 {adjustInventoryDelta > 0 ? '+' : ''}{adjustInventoryDelta}
 </span> units
 </div>
 </div>

 <div className="mb-6">
 <label className="block text-sm font-medium text-[var(--foreground)] mb-3">
 Reason Code
 </label>
 <div className="grid grid-cols-2 gap-2 mb-3">
 {["Count Error", "Damaged", "Lost", "Found", "System Error", "Other"].map((code) => (
 <button
 key={code}
 onClick={() => setAdjustInventoryReasonCode(code)}
 className={`px-3 py-2 text-sm rounded-lg font-medium transition-colors text-left ${
 adjustInventoryReasonCode === code
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
 value={adjustInventoryReasonCode}
 onChange={(e) => setAdjustInventoryReasonCode(e.target.value)}
 placeholder="Or enter custom reason..."
 className="w-full px-4 py-3 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg text-[var(--foreground)]  placeholder-zinc-500 dark:placeholder-zinc-500 focus:outline-none focus: focus: focus:border-transparent"
 />
 </div>

 <div className="flex gap-3">
 <button
 onClick={handleAdjustInventoryBack}
 className="flex-1 px-4 py-3 bg-[var(--surface-container)] dark:bg-[var(--card)] hover:bg-[var(--surface-container-high)] text-[var(--foreground)]  rounded-lg font-medium transition-colors"
 >
 Back
 </button>
 <button
 onClick={handleAdjustInventoryFinalConfirm}
 disabled={!adjustInventoryReasonCode.trim()}
 className="flex-1 px-4 py-3 bg-[var(--state-info)] dark:bg-[var(--state-info-container)] hover:bg-[var(--state-info)] dark:hover:bg-[var(--state-info)] text-[var(--state-on-info-container)] rounded-lg font-medium transition-colors disabled:bg-[var(--surface-container-high)] disabled:text-[var(--muted-foreground)] disabled:border-transparent disabled:opacity-60 disabled:cursor-not-allowed"
 >
 Confirm Adjustment
 </button>
 </div>
 </div>
 )}

 {adjustInventoryStep === "select-item" && (
 <button
 onClick={handleAdjustInventoryCancel}
 className="w-full mt-3 px-4 py-3 bg-[var(--surface-container)] dark:bg-[var(--card)] hover:bg-[var(--surface-container-high)] text-[var(--foreground)]  rounded-lg font-medium transition-colors"
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
 <div className="absolute inset-0 bg-black/50" onClick={handleSkuVerificationCancel} />
 <motion.div
 initial={{ scale: 0.9, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 exit={{ scale: 0.9, opacity: 0 }}
 onClick={(e) => e.stopPropagation()}
 className="relative w-full max-w-md bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-xl overflow-hidden"
 >
 <div className="bg-[var(--primary)] p-6 text-[var(--primary-foreground)]">
 <h2 className="text-xl font-bold">Verify SKU</h2>
 <p className="text-[var(--foreground)]/80 mt-1 text-sm">
 Scan or enter the SKU to confirm the item
 </p>
 </div>

 <div className="p-6">
 <div className="mb-6">
 <div className="bg-[var(--surface-container-low)] dark:bg-[var(--card)] rounded-lg p-4 mb-4">
 <div className="text-sm text-[var(--muted-foreground)] mb-2">
 {selectedItem.description}
 </div>
 <div className="flex items-center gap-2">
 <span className="text-xs text-[var(--muted-foreground)]">Expected SKU:</span>
 <span className="font-mono text-lg font-bold text-[var(--primary)] dark:text-[var(--primary)]">
 {selectedItem.sku}
 </span>
 </div>
 </div>

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
 onClick={handleSkuVerificationCancel}
 className="flex-1 px-4 py-3 bg-[var(--surface-container)] dark:bg-[var(--card)] hover:bg-[var(--surface-container-high)] text-[var(--foreground)]  rounded-lg font-medium transition-colors"
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
 className="fixed inset-0 bg-black/50 z-40"
 />

 {/* Side Panel */}
 <motion.div
 initial={{ x: "100%" }}
 animate={{ x: 0 }}
 exit={{ x: "100%" }}
 transition={{ type: "spring", damping: 25, stiffness: 200 }}
 className="fixed right-0 top-0 bottom-0 w-[600px] bg-[var(--surface-container-high)] text-[var(--foreground)] border-l border-[var(--border)]  z-50 overflow-y-auto"
 >
 {/* Header */}
 <div className="sticky top-0 bg-[var(--surface-container-low)] dark:bg-[var(--card)] p-6 border-b border-[var(--border)] ">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 bg-[var(--primary)] rounded-lg flex items-center justify-center">
 <History size={20} className="text-[var(--foreground)]" />
 </div>
 <div>
 <h2 className="text-2xl font-bold text-[var(--foreground)] ">Workstation History</h2>
 <p className="text-sm text-[var(--muted-foreground)]">Last 10 operations on this terminal</p>
 </div>
 </div>
 <button
 onClick={() => setShowHistory(false)}
 className="w-10 h-10 bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)] hover:bg-[var(--surface-container-high)] rounded-lg flex items-center justify-center transition-colors"
 >
 <X size={20} className="text-[var(--foreground)] " />
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
 className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg p-4 hover:border-[var(--primary)]/50 dark:hover:border-[var(--primary)]/50 transition-all"
 >
 {/* Header Row */}
 <div className="flex items-start justify-between gap-3 mb-3">
 <div className="flex-1 min-w-0">
 <div className="flex items-center gap-2 mb-1">
 <h3 className="font-semibold text-[var(--foreground)] ">{entry.action}</h3>
 <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
 entry.status === "Success"
 ? "bg-[var(--state-success)]/10 text-[var(--state-on-success-container)] dark:text-[var(--state-success)]"
 : entry.status === "Warning"
 ? "bg-[var(--state-warning)]/10 text-[var(--state-on-warning-container)] dark:text-[var(--state-warning)]"
 : "bg-[var(--state-error)]/10 text-[var(--state-error)] dark:text-[var(--state-error)]"
 }`}>
 {entry.status}
 </span>
 </div>
 <p className="text-sm text-[var(--muted-foreground)]">{entry.details}</p>
 </div>
 </div>

 {/* Footer Row */}
 <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)] pt-3 border-t border-[var(--border)] ">
 <div className="flex items-center gap-2">
 <div className="w-6 h-6 bg-[var(--primary)]/10 /10 rounded-full flex items-center justify-center">
 <span className="text-[10px] font-semibold text-[var(--primary)] dark:text-[var(--primary)]">
 {entry.operator.split(' ').map((n: string) => n[0]).join('')}
 </span>
 </div>
 <span className="font-medium text-[var(--foreground)]">{entry.operator}</span>
 </div>
 <span className="font-mono">{entry.timestamp}</span>
 </div>
 </motion.div>
 ))}
 </div>

 {/* Empty State or Load More */}
 {mockWorkstationHistory.length === 0 && (
 <div className="text-center py-12">
 <History size={48} className="mx-auto mb-4 text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]" />
 <p className="text-[var(--muted-foreground)]">No history available</p>
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
 <div className="absolute inset-0 bg-black/50" onClick={handleChangeContainerCancel} />
 <motion.div
 initial={{ scale: 0.9, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 exit={{ scale: 0.9, opacity: 0 }}
 onClick={(e) => e.stopPropagation()}
 className="relative w-full max-w-md bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-xl overflow-hidden"
 >
 <div className="bg-[var(--primary)] p-6 text-[var(--primary-foreground)]">
 <h2 className="text-xl font-bold">Change Container</h2>
 <p className="text-[var(--foreground)]/80 mt-1 text-sm">
 Enter new container LPN and select action
 </p>
 </div>

 <div className="p-6">
 <div className="mb-6">
 <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
 New Container LPN
 </label>
 <input
 type="text"
 value={newContainerLpn}
 onChange={(e) => setNewContainerLpn(e.target.value)}
 placeholder="Scan or enter LPN..."
 className="w-full px-4 py-3 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg text-[var(--foreground)]  placeholder-zinc-500 dark:placeholder-zinc-500 focus:outline-none focus: focus:)] dark:focus:)] focus:border-transparent text-lg font-mono"
 autoFocus
 />
 <p className="text-xs text-[var(--muted-foreground)] mt-2">
 Current: {currentContainerLpn}
 </p>
 </div>

 <div className="space-y-3">
 <button
 onClick={() => handleChangeContainerSubmit("swap")}
 disabled={!newContainerLpn.trim()}
 className="w-full px-4 py-3 bg-[var(--state-info)] dark:bg-[var(--state-info-container)] hover:bg-[var(--state-info)] dark:hover:bg-[var(--state-info)] text-[var(--state-on-info-container)] rounded-lg font-medium transition-colors disabled:bg-[var(--surface-container-high)] disabled:text-[var(--muted-foreground)] disabled:border-transparent disabled:opacity-60 disabled:cursor-not-allowed text-left"
 >
 <div className="font-semibold">Swap</div>
 <div className="text-xs text-[var(--foreground)]/80">Move to next item with new container</div>
 </button>
 <button
 onClick={() => handleChangeContainerSubmit("split")}
 disabled={!newContainerLpn.trim()}
 className="w-full px-4 py-3 bg-[var(--state-warning)] dark:bg-[var(--state-warning)] hover:bg-[var(--state-warning)] dark:hover:bg-[var(--state-warning)] text-[var(--foreground)] rounded-lg font-medium transition-colors disabled:bg-[var(--surface-container-high)] disabled:text-[var(--muted-foreground)] disabled:border-transparent disabled:opacity-60 disabled:cursor-not-allowed text-left"
 >
 <div className="font-semibold">Split</div>
 <div className="text-xs text-[var(--foreground)]/80">Prompt to continue picking current item</div>
 </button>
 <button
 onClick={() => handleChangeContainerSubmit("change")}
 disabled={!newContainerLpn.trim()}
 className="w-full px-4 py-3 bg-[var(--primary)] hover:opacity-90 active:scale-[0.98] text-[var(--primary-foreground)] rounded-lg font-medium transition-colors disabled:bg-[var(--surface-container-high)] disabled:text-[var(--muted-foreground)] disabled:border-transparent disabled:opacity-60 disabled:cursor-not-allowed text-left"
 >
 <div className="font-semibold">Change</div>
 <div className="text-xs text-[var(--foreground)]/80">Replace container for all remaining items</div>
 </button>
 </div>

 <button
 onClick={handleChangeContainerCancel}
 className="w-full mt-4 px-4 py-3 bg-[var(--surface-container)] dark:bg-[var(--card)] hover:bg-[var(--surface-container-high)] text-[var(--foreground)]  rounded-lg font-medium transition-colors"
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
 <div className="absolute inset-0 bg-black/50" onClick={handleReasonCodeCancel} />
 <motion.div
 initial={{ scale: 0.9, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 exit={{ scale: 0.9, opacity: 0 }}
 onClick={(e) => e.stopPropagation()}
 className="relative w-full max-w-md bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-xl overflow-hidden"
 >
 <div className="bg-[var(--state-warning)] dark:bg-[var(--state-warning)] p-6 text-[var(--foreground)]">
 <h2 className="text-xl font-bold">Item Shorted - Reason Required</h2>
 <p className="text-[var(--foreground)]/80 mt-1 text-sm">
 You are shorting this item. Please provide a reason code.
 </p>
 </div>

 <div className="p-6">
 {pendingShortItem && (
 <div className="mb-4 p-3 bg-[var(--surface-container-low)] dark:bg-[var(--card)] rounded-lg">
 <div className="text-sm text-[var(--muted-foreground)]">Item</div>
 <div className="font-mono font-bold text-[var(--foreground)] ">{pendingShortItem.sku}</div>
 <div className="text-sm text-[var(--muted-foreground)] mt-1">
 Picked: {processedQuantity} / {pendingShortItem.quantity} ({Math.round((processedQuantity / pendingShortItem.quantity) * 100)}%)
 </div>
 </div>
 )}

 <div className="mb-4">
 <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
 Reason Code
 </label>
 <div className="grid grid-cols-2 gap-2 mb-3">
 {["Out of Stock", "Damaged", "Mispick", "Customer Request", "Wrong Location", "Other"].map((code) => (
 <button
 key={code}
 onClick={() => setReasonCodeInput(code)}
 className={`px-3 py-2 text-sm rounded-lg font-medium transition-colors text-left ${
 reasonCodeInput === code
 ? "bg-[var(--state-warning)] dark:bg-[var(--state-warning)] text-white"
 : "bg-[var(--surface-container-low)] dark:bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--surface-container-high)]"
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
 className="w-full px-4 py-3 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg text-[var(--foreground)]  placeholder-zinc-500 dark:placeholder-zinc-500 focus:outline-none focus: focus: focus:border-transparent"
 />
 </div>

 <div className="space-y-2">
 <button
 onClick={handleReasonCodeSubmit}
 disabled={!reasonCodeInput.trim()}
 className="w-full px-4 py-3 bg-[var(--state-warning)] dark:bg-[var(--state-warning)] hover:bg-[var(--state-warning)] dark:hover:bg-[var(--state-warning)] text-[var(--foreground)] rounded-lg font-medium transition-colors disabled:bg-[var(--surface-container-high)] disabled:text-[var(--muted-foreground)] disabled:border-transparent disabled:opacity-60 disabled:cursor-not-allowed"
 >
 Confirm Short
 </button>
 <button
 onClick={handleReasonCodeCancel}
 className="w-full px-4 py-3 bg-[var(--surface-container)] dark:bg-[var(--card)] hover:bg-[var(--surface-container-high)] text-[var(--foreground)]  rounded-lg font-medium transition-colors"
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
 <div className="absolute inset-0 bg-black/50" />
 <motion.div
 initial={{ scale: 0.9, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 exit={{ scale: 0.9, opacity: 0 }}
 onClick={(e) => e.stopPropagation()}
 className="relative w-full max-w-md bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-xl overflow-hidden"
 >
 <div className="bg-[var(--state-info)] dark:bg-[var(--state-info-container)] p-6 text-[var(--state-on-info-container)]">
 <h2 className="text-xl font-bold">Confirm Compartment Empty</h2>
 <p className="text-[var(--foreground)]/80 mt-1 text-sm">
 Verify that the compartment is now empty
 </p>
 </div>

 <div className="p-6">
 <div className="bg-[var(--surface-container-low)] dark:bg-[var(--card)] rounded-lg p-4 mb-6">
 <div className="text-center">
 <div className="text-sm text-[var(--muted-foreground)] mb-2">
 Compartment
 </div>
 <div className="text-4xl font-bold font-mono text-[var(--primary)] dark:text-[var(--primary)] mb-3">
 {pendingCompartmentEmpty.compartmentId}
 </div>
 <div className="font-mono text-sm font-semibold text-[var(--foreground)]  mb-1">
 {pendingCompartmentEmpty.item.sku}
 </div>
 <div className="text-sm text-[var(--muted-foreground)]">
 {pendingCompartmentEmpty.item.description}
 </div>
 </div>
 </div>

 <div className="bg-[var(--state-warning-container)] dark:bg-[var(--state-warning-container)]/20 border border-[var(--state-warning)]/40 dark:border-[var(--state-warning)] rounded-lg p-4 mb-6">
 <p className="text-sm text-[var(--state-on-warning-container)] dark:text-[var(--state-warning)]">
 <strong>Please verify:</strong> You picked all items from this compartment. Is compartment <span className="font-mono font-bold">{pendingCompartmentEmpty.compartmentId}</span> now empty?
 </p>
 </div>

 <div className="flex gap-3">
 <button
 onClick={() => handleCompartmentEmptyConfirm(false)}
 className="flex-1 px-6 py-3 bg-[var(--surface-container)] dark:bg-[var(--card)] hover:bg-[var(--surface-container-high)] text-[var(--foreground)]  rounded-lg font-semibold transition-colors"
 >
 No, Not Empty
 </button>
 <button
 onClick={() => handleCompartmentEmptyConfirm(true)}
 className="flex-1 px-6 py-3 bg-[var(--state-info)] dark:bg-[var(--state-info-container)] hover:bg-[var(--state-info)] dark:hover:bg-[var(--state-info)] text-[var(--state-on-info-container)] rounded-lg font-semibold transition-colors"
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
 <div className="absolute inset-0 bg-black/50" />
 <motion.div
 initial={{ scale: 0.9, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 exit={{ scale: 0.9, opacity: 0 }}
 onClick={(e) => e.stopPropagation()}
 className="relative w-full max-w-md bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-xl overflow-hidden"
 >
 <div className="bg-[var(--state-info)] dark:bg-[var(--state-info-container)] p-6 text-[var(--state-on-info-container)]">
 <h2 className="text-xl font-bold">Next Item Container</h2>
 <p className="text-[var(--foreground)]/80 mt-1 text-sm">
 Which container should the next item go into?
 </p>
 </div>

 <div className="p-6">
 <div className="mb-6">
 <p className="text-[var(--foreground)] mb-2">
 Choose whether to continue with the new container or return to the original.
 </p>
 <div className="bg-[var(--surface-container-low)] dark:bg-[var(--card)] rounded-lg p-3">
 <div className="text-xs text-[var(--muted-foreground)] mb-1">Current Container:</div>
 <div className="font-mono text-sm font-bold text-[var(--primary)] dark:text-[var(--primary)]">{currentContainerLpn}</div>
 <div className="text-xs text-[var(--muted-foreground)] mt-2 mb-1">Original Container:</div>
 <div className="font-mono text-sm font-bold text-[var(--muted-foreground)]">{originalContainerLpn}</div>
 </div>
 </div>

 <div className="space-y-3">
 <button
 onClick={() => handleSwapContinue(true)}
 className="w-full px-4 py-3 bg-[var(--primary)] hover:opacity-90 active:scale-[0.98] text-[var(--primary-foreground)] rounded-lg font-medium transition-colors text-left"
 >
 <div className="font-semibold">Use New Container</div>
 <div className="text-xs text-[var(--foreground)]/80">Continue with {currentContainerLpn}</div>
 </button>
 <button
 onClick={() => handleSwapContinue(false)}
 className="w-full px-4 py-3 bg-[var(--state-info)] dark:bg-[var(--state-info-container)] hover:bg-[var(--state-info)] dark:hover:bg-[var(--state-info)] text-[var(--state-on-info-container)] rounded-lg font-medium transition-colors text-left"
 >
 <div className="font-semibold">Use Original Container</div>
 <div className="text-xs text-[var(--foreground)]/80">Return to {originalContainerLpn}</div>
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
 className="fixed inset-0 bg-black/50 z-40"
 />

 {/* Side Panel */}
 <motion.div
 initial={{ x: "100%" }}
 animate={{ x: 0 }}
 exit={{ x: "100%" }}
 transition={{ type: "spring", damping: 25, stiffness: 200 }}
 className="fixed right-0 top-0 bottom-0 w-[500px] bg-[var(--surface-container-high)] text-[var(--foreground)] border-l border-[var(--border)]  z-50 overflow-y-auto"
 >
 {/* Header */}
 <div className="sticky top-0 bg-[var(--surface-container-low)] dark:bg-[var(--card)] p-6 border-b border-[var(--border)] ">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 bg-[var(--primary)] rounded-lg flex items-center justify-center">
 <Info size={20} className="text-[var(--foreground)]" />
 </div>
 <h2 className="text-2xl font-bold text-[var(--foreground)] ">Color Legend</h2>
 </div>
 <button
 onClick={() => setShowLegend(false)}
 className="w-10 h-10 bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)] hover:bg-[var(--surface-container-high)] rounded-lg flex items-center justify-center transition-colors"
 >
 <X size={20} className="text-[var(--foreground)] " />
 </button>
 </div>
 </div>

 {/* Content */}
 <div className="p-6 space-y-8">
 {/* Sortbar Locations Section */}
 <div>
 <h3 className="text-lg font-bold text-[var(--foreground)]  mb-4 flex items-center gap-2">
 <Grid3x3 size={18} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 Sortbar Locations
 </h3>
 <div className="space-y-3">
 {/* Available */}
 <div className="p-3 rounded-lg border-2 border-[var(--border)]  bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)]">
 <div className="font-semibold text-[var(--foreground)]  mb-1">Available</div>
 <p className="text-sm text-[var(--muted-foreground)]">Sortbar is ready for registration and use</p>
 </div>

 {/* Selected (Not Registered) */}
 <div className="p-3 rounded-lg border-2 border-[var(--primary)] dark:border-[var(--primary)] bg-[var(--primary)]/10 /10">
 <div className="font-semibold text-[var(--foreground)]  mb-1">Selected (Not Registered)</div>
 <p className="text-sm text-[var(--muted-foreground)]">Sortbar is selected for registration</p>
 </div>

 {/* In Use (Registered) */}
 <div className="p-3 rounded-lg border-2 border-[var(--state-info)]/40 dark:border-[var(--state-info)]/30 bg-[var(--state-info)]/5 dark:bg-[var(--state-info)]/5">
 <div className="font-semibold text-[var(--foreground)]  mb-1">In Use (Registered)</div>
 <p className="text-sm text-[var(--muted-foreground)]">Sortbar is registered with a work list</p>
 </div>

 {/* Active & Registered - Flashing Border */}
 <div className="p-3 rounded-lg border-[3px] bg-[var(--state-info)]/5 dark:bg-[var(--state-info)]/5 animate-pulse" style={{ borderColor: 'rgb(59 130 246)' }}>
 <div className="font-semibold text-[var(--foreground)]  mb-1 flex items-center gap-2">
 Active & Working
 <span className="inline-block px-2 py-0.5 bg-[var(--state-info-container)] text-[var(--state-on-info-container)] text-xs rounded-full">Flashing</span>
 </div>
 <p className="text-sm text-[var(--muted-foreground)]">Currently viewing/processing items from this sortbar. The flashing blue border helps you identify which sortbar you're actively working on.</p>
 </div>

 {/* Maintenance */}
 <div className="p-3 rounded-lg border-2 border-[var(--border)]  bg-[var(--surface-container-low)] dark:bg-[var(--card)] opacity-50">
 <div className="font-semibold text-[var(--foreground)]  mb-1">Maintenance</div>
 <p className="text-sm text-[var(--muted-foreground)]">Sortbar is unavailable (disabled)</p>
 </div>
 </div>
 </div>

 {/* Items Section */}
 <div>
 <h3 className="text-lg font-bold text-[var(--foreground)]  mb-4 flex items-center gap-2">
 <Package size={18} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 Items Status
 </h3>
 <div className="space-y-3">
 {/* Selected Item */}
 <div className="p-3 rounded-lg border border-[var(--primary)] dark:border-[var(--primary)] bg-[var(--primary)]/5 /5">
 <div className="font-semibold text-[var(--foreground)]  mb-1">Selected Item</div>
 <p className="text-sm text-[var(--muted-foreground)]">Currently processing this item</p>
 </div>

 {/* Completed (Full Quantity) */}
 <div className="p-3 rounded-lg border-[var(--border)]  bg-[var(--state-success)]/10 dark:bg-[var(--state-success)]/10">
 <div className="font-semibold text-[var(--state-on-success-container)] dark:text-[var(--state-success)] mb-1">Completed</div>
 <p className="text-sm text-[var(--muted-foreground)]">Full quantity processed (100%)</p>
 </div>

 {/* Partial/Shorted */}
 <div className="p-3 rounded-lg border-[var(--border)]  bg-[var(--state-warning)]/10 dark:bg-[var(--state-warning)]/10">
 <div className="font-semibold text-[var(--state-on-warning-container)] dark:text-[var(--state-warning)] mb-1">Partial/Shorted</div>
 <p className="text-sm text-[var(--muted-foreground)]">Less than expected quantity processed</p>
 </div>

 {/* Pending */}
 <div className="p-3 rounded-lg border-[var(--border)]  bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)]">
 <div className="font-semibold text-[var(--foreground)]  mb-1">Pending</div>
 <p className="text-sm text-[var(--muted-foreground)]">Not yet processed</p>
 </div>
 </div>
 </div>

 {/* Priority Indicators */}
 <div>
 <h3 className="text-lg font-bold text-[var(--foreground)]  mb-4 flex items-center gap-2">
 <AlertCircle size={18} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 Priority Levels
 </h3>
 <div className="space-y-3">
 {/* High Priority */}
 <div className="p-3 rounded-lg border-[var(--border)] ">
 <div className="flex items-center gap-2 mb-1">
 <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-[var(--state-error)]/10 text-[var(--state-error)] dark:text-[var(--state-error)]">
 High
 </span>
 <Flame size={16} className="text-[var(--state-warning)]" />
 </div>
 <p className="text-sm text-[var(--muted-foreground)]">Urgent work items (may include flame icon)</p>
 </div>

 {/* Normal Priority */}
 <div className="p-3 rounded-lg border-[var(--border)] ">
 <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-[var(--state-debug)]/10 text-[var(--muted-foreground)] mb-1">
 Normal
 </span>
 <p className="text-sm text-[var(--muted-foreground)]">Standard work items</p>
 </div>
 </div>
 </div>

 {/* Work Status */}
 <div>
 <h3 className="text-lg font-bold text-[var(--foreground)]  mb-4 flex items-center gap-2">
 <CheckCircle2 size={18} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 Work Status
 </h3>
 <div className="space-y-3">
 {/* In Progress */}
 <div className="p-3 rounded-lg border-[var(--border)] ">
 <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-[var(--state-warning)]/10 text-[var(--state-on-warning-container)] dark:text-[var(--state-warning)] mb-1">
 In Progress
 </span>
 <p className="text-sm text-[var(--muted-foreground)]">Work is actively being processed</p>
 </div>

 {/* Completed */}
 <div className="p-3 rounded-lg border-[var(--border)] ">
 <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-[var(--primary)]/10 /10 text-[var(--primary)] dark:text-[var(--primary)] mb-1">
 Completed
 </span>
 <p className="text-sm text-[var(--muted-foreground)]">Work has been finished</p>
 </div>

 {/* Queued */}
 <div className="p-3 rounded-lg border-[var(--border)] ">
 <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-[var(--state-debug)]/10 text-[var(--muted-foreground)] mb-1">
 Queued
 </span>
 <p className="text-sm text-[var(--muted-foreground)]">Waiting to be started</p>
 </div>
 </div>
 </div>

 {/* Statistics Colors */}
 <div>
 <h3 className="text-lg font-bold text-[var(--foreground)]  mb-4">Statistics Colors</h3>
 <div className="space-y-3">
 <div className="p-3 rounded-lg border-[var(--border)] ">
 <div className="font-semibold text-[var(--state-on-success-container)] dark:text-[var(--state-success)] mb-1">Green</div>
 <p className="text-sm text-[var(--muted-foreground)]">All items fully processed</p>
 </div>

 <div className="p-3 rounded-lg border-[var(--border)] ">
 <div className="font-semibold text-[var(--state-on-warning-container)] dark:text-[var(--state-warning)] mb-1">Amber/Yellow</div>
 <p className="text-sm text-[var(--muted-foreground)]">Some items shorted or partially processed</p>
 </div>

 <div className="p-3 rounded-lg border-[var(--border)] ">
 <div className="font-semibold text-[var(--primary)] dark:text-[var(--primary)] mb-1">Teal/Green</div>
 <p className="text-sm text-[var(--muted-foreground)]">Active processing or brand accent color</p>
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
 className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
 onClick={handleNumberPadCancel}
 >
 <motion.div
 initial={{ scale: 0.9, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 exit={{ scale: 0.9, opacity: 0 }}
 onClick={(e) => e.stopPropagation()}
 className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-2xl border-[var(--border)]  p-6 w-full max-w-md"
 >
 {/* Header */}
 <div className="mb-6">
 <div className="flex items-center justify-between mb-2">
 <h3 className="text-xl font-bold text-[var(--foreground)] ">Enter Quantity</h3>
 <button
 onClick={handleNumberPadCancel}
 className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] dark:hover:text-[var(--foreground)] transition-colors"
 >
 <X size={24} />
 </button>
 </div>
 <p className="text-sm text-[var(--muted-foreground)]">
 Max: {selectedItem.quantity} units
 </p>
 </div>

 {/* Display */}
 <div className="bg-[var(--surface-container-low)] dark:bg-[var(--card)] rounded-lg p-4 mb-6 border-2 border-[var(--border)] ">
 <div className="text-4xl font-bold text-center text-[var(--foreground)]  min-h-[3rem] flex items-center justify-center">
 {quantityInput || "0"}
 </div>
 <div className="text-center text-sm text-[var(--muted-foreground)] mt-2">
 / {selectedItem.quantity}
 </div>
 </div>

 {/* Number Pad */}
 <div className="grid grid-cols-3 gap-3 mb-4">
 {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => (
 <button
 key={digit}
 onClick={() => handleNumberPadInput(digit)}
 className="bg-[var(--surface-container-low)] dark:bg-[var(--card)] hover:bg-[var(--surface-container-high)] text-[var(--foreground)]  text-2xl font-semibold rounded-lg py-4 transition-colors active:scale-95"
 >
 {digit}
 </button>
 ))}
 <button
 onClick={() => handleNumberPadInput("clear")}
 className="bg-[var(--state-error-container)] dark:bg-[var(--state-error-container)] hover:bg-[var(--state-error-container)] dark:hover:bg-[var(--state-error-container)]/50 text-[var(--state-error)] dark:text-[var(--state-error)] text-lg font-semibold rounded-lg py-4 transition-colors active:scale-95"
 >
 Clear
 </button>
 <button
 onClick={() => handleNumberPadInput("0")}
 className="bg-[var(--surface-container-low)] dark:bg-[var(--card)] hover:bg-[var(--surface-container-high)] text-[var(--foreground)]  text-2xl font-semibold rounded-lg py-4 transition-colors active:scale-95"
 >
 0
 </button>
 <button
 onClick={() => handleNumberPadInput("backspace")}
 className="bg-[var(--state-warning-container)] dark:bg-[var(--state-warning-container)]/30 hover:bg-[var(--state-warning-container)] dark:hover:bg-[var(--state-warning-container)]/50 text-[var(--state-on-warning-container)] dark:text-[var(--state-warning)] text-lg font-semibold rounded-lg py-4 transition-colors active:scale-95 flex items-center justify-center"
 >
 ←
 </button>
 </div>

 {/* Action Buttons */}
 <div className="flex gap-3">
 <button
 onClick={handleNumberPadCancel}
 className="flex-1 px-6 py-3 bg-[var(--surface-container)] dark:bg-[var(--card)] hover:bg-[var(--surface-container-high)] text-[var(--foreground)]  rounded-lg font-semibold transition-colors"
 >
 Cancel
 </button>
 <button
 onClick={handleNumberPadConfirm}
 disabled={!quantityInput || parseInt(quantityInput) > selectedItem.quantity}
 className="flex-1 px-6 py-3 bg-[var(--primary)] hover:opacity-90 active:scale-[0.98] text-[var(--primary-foreground)] rounded-lg font-semibold transition-colors disabled:bg-[var(--surface-container-high)] disabled:text-[var(--muted-foreground)] disabled:border-transparent disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
 >
 <Check size={20} />
 Confirm
 </button>
 </div>
 </motion.div>
 </motion.div>
 )}
 </AnimatePresence>

 {/* Auto Register Modal */}
 <AnimatePresence>
 {showAutoRegister && (
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
 onClick={() => setShowAutoRegister(false)}
 >
 <motion.div
 initial={{ scale: 0.9, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 exit={{ scale: 0.9, opacity: 0 }}
 onClick={(e) => e.stopPropagation()}
 className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-2xl border-[var(--border)]  p-6 w-full max-w-2xl"
 >
 {/* Header */}
 <div className="mb-6">
 <div className="flex items-center justify-between mb-2">
 <h3 className="text-xl font-bold text-[var(--foreground)] ">
 Auto Register Sortbars
 </h3>
 <button
 onClick={() => setShowAutoRegister(false)}
 className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] dark:hover:text-[var(--foreground)] transition-colors"
 >
 <X size={24} />
 </button>
 </div>
 <p className="text-sm text-[var(--muted-foreground)]">
 {autoRegisterStep === 'count' && 'Select the number of sortbars to register (up to 12)'}
 {autoRegisterStep === 'confirm' && 'Confirm work list assignments'}
 {autoRegisterStep === 'scan' && 'Scan LPN for each sortbar'}
 </p>
 </div>

 {/* Step 1: Select Count */}
 {autoRegisterStep === 'count' && (
 <div className="space-y-4">
 <div>
 <label className="block text-sm font-medium text-[var(--foreground)]  mb-3">
 How many sortbars do you want to register?
 </label>
 <div className="grid grid-cols-4 gap-3">
 {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((count) => (
 <button
 key={count}
 onClick={() => {
 setAutoRegisterCount(count);
 const allSortbars = ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6'];
 const assignments: Array<{sortbarId: string, sortbarName: string, workListId: string, workListName: string}> = [];
 for (let i = 0; i < count && i < allSortbars.length; i++) {
 const sortbarName = allSortbars[i];
 const sortbar = initialSortbars.find(sb => sb.name === sortbarName);
 if (sortbar && !sortbarRegistrations.some(reg => reg.sortbarId === sortbar.id)) {
 const availableList = mockPickLists.find(list => {
 const usedInExisting = sortbarRegistrations.some(reg => reg.workListId === list.id);
 const usedInCurrent = assignments.some(a => a.workListId === list.id);
 return !usedInExisting && !usedInCurrent;
 });
 if (availableList) {
 assignments.push({
 sortbarId: sortbar.id,
 sortbarName: sortbar.name,
 workListId: availableList.id,
 workListName: availableList.name,
 });
 }
 }
 }
 setAutoRegisterAssignments(assignments);
 setAutoRegisterStep('confirm');
 }}
 className="p-4 rounded-lg border-2 transition-all border-[var(--border)]  hover:border-[var(--primary)] dark:hover:border-[var(--primary)] hover:bg-[var(--primary)]/10 /10 active:scale-95"
 >
 <div className="text-2xl font-bold text-[var(--foreground)] ">{count}</div>
 <div className="text-xs text-[var(--muted-foreground)]">sortbar{count > 1 ? 's' : ''}</div>
 </button>
 ))}
 </div>
 </div>
 </div>
 )}

 {/* Step 2: Confirm Assignments */}
 {autoRegisterStep === 'confirm' && (
 <div className="space-y-4">
 <div className="space-y-3 max-h-96 overflow-y-auto">
 {autoRegisterAssignments.map((assignment, index) => (
 <div
 key={assignment.sortbarId}
 className="p-4 rounded-lg border-[var(--border)]  bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)]"
 >
 <div className="flex items-center justify-between">
 <div>
 <div className="font-semibold text-[var(--foreground)] ">
 Sortbar {assignment.sortbarName}
 </div>
 <div className="text-sm text-[var(--muted-foreground)]">
 {assignment.workListId} - {assignment.workListName}
 </div>
 </div>
 <div className="text-2xl font-bold text-[var(--primary)] dark:text-[var(--primary)]">
 {index + 1}
 </div>
 </div>
 </div>
 ))}
 </div>

 <div className="flex gap-3 pt-4">
 <button
 onClick={() => setAutoRegisterStep('count')}
 className="flex-1 px-6 py-3 bg-[var(--surface-container)] dark:bg-[var(--card)] hover:bg-[var(--surface-container-high)] text-[var(--foreground)]  rounded-lg font-semibold transition-colors"
 >
 Back
 </button>
 <button
 onClick={() => {
 setAutoRegisterCurrentIndex(0);
 setAutoRegisterStep('scan');
 }}
 className="flex-1 px-6 py-3 bg-[var(--primary)] hover:opacity-90 active:scale-[0.98] text-[var(--primary-foreground)] rounded-lg font-semibold transition-colors"
 >
 Confirm & Continue
 </button>
 </div>
 </div>
 )}

 {/* Step 3: Scan LPNs */}
 {autoRegisterStep === 'scan' && autoRegisterCurrentIndex < autoRegisterAssignments.length && (
 <div className="space-y-4">
 <div className="bg-[var(--primary)]/10 /10 rounded-lg p-4 mb-4">
 <div className="text-sm text-[var(--muted-foreground)] mb-1">
 Progress: {autoRegisterCurrentIndex + 1} of {autoRegisterAssignments.length}
 </div>
 <div className="h-2 bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)] rounded-full overflow-hidden">
 <div
 className="h-full bg-[var(--primary)]  transition-all"
 style={{ width: `${((autoRegisterCurrentIndex + 1) / autoRegisterAssignments.length) * 100}%` }}
 />
 </div>
 </div>

 <div className="p-4 rounded-lg border-2 border-[var(--primary)] dark:border-[var(--primary)] bg-[var(--primary)]/5 /5">
 <div className="text-lg font-bold text-[var(--foreground)]  mb-2">
 Sortbar {autoRegisterAssignments[autoRegisterCurrentIndex].sortbarName}
 </div>
 <div className="text-sm text-[var(--muted-foreground)]">
 {autoRegisterAssignments[autoRegisterCurrentIndex].workListId} - {autoRegisterAssignments[autoRegisterCurrentIndex].workListName}
 </div>
 </div>

 <div>
 <label className="block text-sm font-medium text-[var(--foreground)]  mb-2">
 Scan or Enter LPN
 </label>
 <input
 type="text"
 value={autoRegisterLpnInput}
 onChange={(e) => setAutoRegisterLpnInput(e.target.value.toUpperCase())}
 onKeyDown={(e) => { if (e.key === 'Enter') autoRegisterSubmitRef.current?.click(); }}
 placeholder="Enter LPN..."
 className="w-full px-4 py-3 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg text-[var(--foreground)]  placeholder-zinc-500 focus:outline-none focus:border-[var(--primary)] dark:focus:border-[var(--primary)] transition-colors font-mono"
 autoFocus
 />
 </div>

 <div className="flex gap-3 pt-4">
 <button
 onClick={() => {
 setShowAutoRegister(false);
 setAutoRegisterLpnInput("");
 setAutoRegisterStep('count');
 }}
 className="flex-1 px-6 py-3 bg-[var(--surface-container)] dark:bg-[var(--card)] hover:bg-[var(--surface-container-high)] text-[var(--foreground)]  rounded-lg font-semibold transition-colors"
 >
 Cancel
 </button>
 <button
 onClick={() => {
 if (!autoRegisterLpnInput) return;

 const assignment = autoRegisterAssignments[autoRegisterCurrentIndex];
 const itemsList = generateMockItems(assignment.workListId, assignment.sortbarId);
 const totalQty = itemsList.reduce((sum: number, item: ReplenItem) => sum + item.quantity, 0);

 // Add this registration
 const newRegistration = {
 sortbarId: assignment.sortbarId,
 workListId: assignment.workListId,
 lpn: autoRegisterLpnInput,
 registrationMethod: "list" as const,
 itemCount: itemsList.length,
 totalQuantity: totalQty,
 items: itemsList,
 processedItems: new Map(),
 selectedItemId: itemsList[0]?.id || null
 };

 const updatedRegistrations = [...sortbarRegistrations, newRegistration];
 setSortbarRegistrations(updatedRegistrations);

 toast.success("Sortbar Registered", {
 description: `${assignment.sortbarName} - ${assignment.workListId}`,
 duration: 3000,
 });

 // Move to next sortbar or finish
 if (autoRegisterCurrentIndex + 1 < autoRegisterAssignments.length) {
 setAutoRegisterCurrentIndex(autoRegisterCurrentIndex + 1);
 setAutoRegisterLpnInput("");
 } else {
 // All done - now start the workflow
 const allRegistrations = updatedRegistrations;

 // Find the first sortbar with items to pick
 const firstSortbarWithItems = allRegistrations.find((reg: SortbarRegistration) => reg.items.length > 0);

 if (firstSortbarWithItems) {
 // Set this sortbar as active
 setActiveSortbar(firstSortbarWithItems.sortbarId);
 setSelectedSortbar(firstSortbarWithItems.sortbarId);

 // Load its items
 setItems([...firstSortbarWithItems.items]);
 setSelectedList(firstSortbarWithItems.workListId);
 setProcessedItems(new Map(firstSortbarWithItems.processedItems));
 setCurrentContainerLpn(firstSortbarWithItems.lpn ?? "");
 setOriginalContainerLpn(firstSortbarWithItems.lpn ?? "");

 // Initialize compartment inventory
 const inventoryMap = new Map<string, number>();
 firstSortbarWithItems.items.forEach((item: ReplenItem) => {
 if (item.compartmentLpn) {
 const extraUnits = Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 10) + 1;
 inventoryMap.set(item.compartmentLpn, item.quantity + extraUnits);
 }
 });
 setCompartmentInventory(inventoryMap);

 // Set the first item as selected
 const firstItem = firstSortbarWithItems.items[0];
 if (firstItem) {
 setSelectedItem(firstItem);
 setProcessedQuantity(firstSortbarWithItems.processedItems.get(firstItem.id) ?? firstItem.quantity);
 setItemPickStartTime(new Date());

 // In Pack & Hold mode, assign to bins
 if (layoutMode === "pack-hold") {
 const binAssignments = new Map(itemBinAssignments);
 firstSortbarWithItems.items.forEach((item: ReplenItem) => {
 if (!binAssignments.has(item.id)) {
 const bin = Math.random() < 0.5 ? 1 : 2;
 binAssignments.set(item.id, bin as 1 | 2);
 }
 });
 setItemBinAssignments(binAssignments);

 // Ensure bin 1 is arrived
 setBinArrivals(new Set([1]));
 }
 }

 // Flash the sortbar where items should be placed
 setFlashingSortbar(firstSortbarWithItems.sortbarId);

 // Start pick list timer
 setPickListStartTime(new Date());
 }

 toast.success("Auto Registration Complete", {
 description: `${autoRegisterAssignments.length} sortbars registered - Starting workflow`,
 duration: 4000,
 });

 setShowAutoRegister(false);
 setAutoRegisterLpnInput("");
 setAutoRegisterStep('count');
 setAutoRegisterCurrentIndex(0);
 }
 }}
 ref={autoRegisterSubmitRef}
 disabled={!autoRegisterLpnInput}
 className="flex-1 px-6 py-3 bg-[var(--primary)] hover:opacity-90 active:scale-[0.98] text-[var(--primary-foreground)] rounded-lg font-semibold transition-colors disabled:bg-[var(--surface-container-high)] disabled:text-[var(--muted-foreground)] disabled:border-transparent disabled:opacity-60 disabled:cursor-not-allowed"
 >
 {autoRegisterCurrentIndex + 1 < autoRegisterAssignments.length ? 'Next Sortbar' : 'Complete'}
 </button>
 </div>
 </div>
 )}
 </motion.div>
 </motion.div>
 )}
 </AnimatePresence>

 {/* Single Sortbar LPN Modal */}
 <AnimatePresence>
 {showSingleLpnModal && singleLpnSortbarId && singleLpnWorkListId && (
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
 >
 <motion.div
 initial={{ scale: 0.95, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 exit={{ scale: 0.95, opacity: 0 }}
 className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-xl w-full max-w-md"
 onClick={(e) => e.stopPropagation()}
 >
 <div className="p-6 border-b border-[var(--border)] ">
 <h2 className="text-xl font-bold text-[var(--foreground)] ">Register Pick</h2>
 <p className="text-sm text-[var(--muted-foreground)] mt-1">Enter LPN for the pick container</p>
 </div>
 <div className="p-6 space-y-4">
 {/* Progress indicator */}
 <div className="bg-[var(--primary)]/10 /10 rounded-lg p-4">
 <div className="text-sm text-[var(--muted-foreground)] mb-1">Progress: 1 of 1</div>
 <div className="h-2 bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)] rounded-full overflow-hidden">
 <div className="h-full bg-[var(--primary)]  w-full" />
 </div>
 </div>

 {/* Sortbar + Worklist info */}
 <div className="p-4 rounded-lg border-2 border-[var(--primary)] dark:border-[var(--primary)] bg-[var(--primary)]/5 /5">
 <div className="text-lg font-bold text-[var(--foreground)]  mb-1">
 Sortbar {initialSortbars.find(s => s.id === singleLpnSortbarId)?.name ?? singleLpnSortbarId}
 </div>
 <div className="text-sm text-[var(--muted-foreground)]">
 {singleLpnWorkListId} - {mockPickLists.find(l => l.id === singleLpnWorkListId)?.name ?? singleLpnWorkListId}
 </div>
 </div>

 {/* LPN input */}
 <div>
 <label className="block text-sm font-medium text-[var(--foreground)]  mb-2">
 Scan or Enter LPN
 </label>
 <input
 type="text"
 value={singleLpnInput}
 onChange={(e) => setSingleLpnInput(e.target.value.toUpperCase())}
 onKeyDown={(e) => e.key === "Enter" && handleSingleLpnSubmit()}
 placeholder="Enter LPN..."
 className="w-full px-4 py-3 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg text-[var(--foreground)]  placeholder-zinc-500 focus:outline-none focus:border-[var(--primary)] dark:focus:border-[var(--primary)] transition-colors font-mono"
 autoFocus
 />
 </div>

 <div className="flex gap-3 pt-2">
 <button
 onClick={() => {
 setShowSingleLpnModal(false);
 setSingleLpnInput("");
 setSingleLpnSortbarId(null);
 setSingleLpnWorkListId(null);
 }}
 className="flex-1 px-6 py-3 bg-[var(--surface-container)] dark:bg-[var(--card)] hover:bg-[var(--surface-container-high)] text-[var(--foreground)]  rounded-lg font-semibold transition-colors"
 >
 Cancel
 </button>
 <button
 onClick={handleSingleLpnSubmit}
 disabled={!singleLpnInput.trim()}
 className="flex-1 px-6 py-3 bg-[var(--primary)] hover:opacity-90 active:scale-[0.98] text-[var(--primary-foreground)] rounded-lg font-semibold transition-colors disabled:bg-[var(--surface-container-high)] disabled:text-[var(--muted-foreground)] disabled:border-transparent disabled:opacity-60 disabled:cursor-not-allowed"
 >
 Register
 </button>
 </div>
 </div>
 </motion.div>
 </motion.div>
 )}
 </AnimatePresence>
 </>
 );
}
