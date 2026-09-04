import { useState, useMemo } from "react";
import { useVersionTheme } from "../contexts/VersionThemeContext";
import { Link } from "react-router-dom";
import {
 Home, ChevronRight, Archive, Search, Filter, RefreshCw,
 ClipboardList, Package, CheckCircle2, AlertCircle, Clock,
 Play, X, Flame, ArrowUpDown, Truck, RotateCcw,
 Trash2, ArrowLeft, MapPin, ArrowRight, Box, PackageX,
 Info, ChevronDown, Plus, Recycle, ShoppingCart,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type MaterialCategory = "Supply" | "Raw Material";
type WorkStatus = "Queued" | "In Progress" | "Completed" | "Cancelled";
type Priority = "Critical" | "High" | "Medium" | "Low";
type WorkType = "Pick" | "Replenishment" | "Move" | "Putaway" | "Transfer";

type ActiveTask = {
 id: string;
 workList: string;
 type: WorkType;
 status: WorkStatus;
 priority: Priority;
 isHot: boolean;
 materialCategory: MaterialCategory;
 item: string;
 description: string;
 quantity: number;
 completedQty: number;
 storage: string;
 destination: string;
 assignedTo: string;
 eta: string;
};

type ReturnFlowType = "trial-run" | "non-inventory" | null;
type WasteAction = "deliver-empty" | "pickup-full" | "pickup-deliver" | null;

// ─────────────────────────────────────────────────────────────────────────────
// Mock data
// ─────────────────────────────────────────────────────────────────────────────

const mockLocations = [
 "A1-01-02", "A2-03-04", "B1-05-01", "B2-07-03", "C1-02-06",
 "C3-04-02", "D1-01-03", "D2-06-01", "Staging-A", "Staging-B",
];

const mockMaterials = [
 { id: "SUP-001", name: "Cardboard Box 12×10×8", type: "Packaging" },
 { id: "SUP-002", name: "Stretch Wrap Roll", type: "Packaging" },
 { id: "SUP-003", name: "Bubble Wrap 48\"", type: "Protective" },
 { id: "SUP-004", name: "Pallet Jack Fuel", type: "Equipment" },
 { id: "SUP-005", name: "Safety Labels", type: "Labels" },
 { id: "SUP-006", name: "Zip Ties (100pk)", type: "Fasteners" },
];

const mockTasks: ActiveTask[] = [
 { id: "AT-001", workList: "WL-PICK-001", type: "Pick", status: "In Progress", priority: "Critical", isHot: true, materialCategory: "Supply", item: "ITM-5001", description: "Cardboard Boxes (12×10×8)", quantity: 50, completedQty: 32, storage: "Receiving-01", destination: "A1-01-02", assignedTo: "John Smith", eta: "08:45" },
 { id: "AT-002", workList: "WL-REPL-002", type: "Replenishment", status: "Queued", priority: "High", isHot: false, materialCategory: "Supply", item: "ITM-5002", description: "Stretch Wrap Rolls", quantity: 24, completedQty: 0, storage: "Warehouse-B", destination: "Stage-A", assignedTo: "Sarah Jones", eta: "09:15" },
 { id: "AT-003", workList: "WL-MOVE-001", type: "Move", status: "Queued", priority: "High", isHot: false, materialCategory: "Raw Material", item: "ITM-6001", description: "Steel Coil Grade A", quantity: 5, completedQty: 0, storage: "D4-01-02", destination: "Line-3", assignedTo: "Mike Davis", eta: "09:30" },
 { id: "AT-004", workList: "WL-PICK-002", type: "Pick", status: "In Progress", priority: "Medium", isHot: false, materialCategory: "Supply", item: "ITM-7001", description: "Safety Labels (Roll)", quantity: 10, completedQty: 6, storage: "C2-03-01", destination: "Pack-Line-2",assignedTo: "John Smith", eta: "09:00" },
 { id: "AT-005", workList: "WL-TRAN-001", type: "Transfer", status: "Queued", priority: "Critical", isHot: true, materialCategory: "Raw Material", item: "ITM-8001", description: "Aluminum Sheet 4×8ft", quantity: 20, completedQty: 0, storage: "Yard-Gate-2", destination: "Line-1", assignedTo: "Unassigned", eta: "09:45" },
 { id: "AT-006", workList: "WL-REPL-003", type: "Replenishment", status: "Queued", priority: "Low", isHot: false, materialCategory: "Supply", item: "ITM-3003", description: "Bubble Wrap 48\" Roll", quantity: 6, completedQty: 0, storage: "Warehouse-C", destination: "Dock-1", assignedTo: "Emily Chen", eta: "10:00" },
 { id: "AT-007", workList: "WL-PUT-001", type: "Putaway", status: "In Progress", priority: "Medium", isHot: false, materialCategory: "Supply", item: "ITM-2002", description: "Packing Tape (48-rolls)", quantity: 48, completedQty: 20, storage: "Receiving-02", destination: "C3-04-02", assignedTo: "Sarah Jones", eta: "08:55" },
 { id: "AT-008", workList: "WL-MOVE-002", type: "Move", status: "In Progress", priority: "High", isHot: false, materialCategory: "Raw Material", item: "ITM-9001", description: "Copper Wire Spool 500m", quantity: 3, completedQty: 1, storage: "B2-07-03", destination: "Line-2", assignedTo: "Mike Davis", eta: "09:10" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Helper UI
// ─────────────────────────────────────────────────────────────────────────────

const priorityDot: Record<Priority, string> = {
 Critical: "bg-[var(--state-error)]",
 High: "bg-[var(--state-warning)]",
 Medium: "bg-[var(--state-warning)]",
 Low: "bg-zinc-400",
};

const statusBadge: Record<WorkStatus, string> = {
 "In Progress": "text-[var(--primary)] dark:text-[var(--primary)] bg-[var(--primary)]/10",
 "Queued": "text-[var(--state-info)] dark:text-[var(--state-info)] bg-[var(--state-info)]/10",
 "Completed": "text-[var(--state-on-success-container)] dark:text-[var(--state-success)] bg-[var(--state-success-container)]/60",
 "Cancelled": "text-[var(--muted-foreground)] bg-[var(--state-debug)]/10",
};

const typeBadge: Record<WorkType, string> = {
 Pick: "text-[var(--tertiary)] dark:text-[var(--tertiary)]",
 Replenishment: "text-[var(--primary)] dark:text-[var(--primary)]",
 Move: "text-indigo-600 dark:text-[var(--secondary)]",
 Putaway: "text-pink-600 dark:text-[var(--tertiary)]",
 Transfer: "text-[var(--state-on-warning-container)] dark:text-[var(--state-warning)]",
};

function pct(task: ActiveTask) {
 return task.quantity > 0 ? Math.round((task.completedQty / task.quantity) * 100) : 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// Action button shared style
// ─────────────────────────────────────────────────────────────────────────────
const actionBtn = "w-full flex items-center gap-3 px-4 py-4 rounded-xl border-2 font-semibold text-sm transition-all hover:scale-[1.01] active:scale-[0.99]";

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export function AssetOperations() {
  const { version } = useVersionTheme();
  const isV6 = version === "Master Blue V6";
 const [tasks, setTasks] = useState<ActiveTask[]>(mockTasks);
 const [selectedTask, setSelectedTask] = useState<ActiveTask | null>(null);
 const [search, setSearch] = useState("");
 const [sortField, setSortField] = useState<keyof ActiveTask>("priority");
 const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
 const [statusFilter, setStatusFilter] = useState<WorkStatus | "All">("All");

 // Modal / flow state
 const [activeFlow, setActiveFlow] = useState<"return" | "waste" | "request-pickup" | "supply-request" | null>(null);
 const [returnType, setReturnType] = useState<ReturnFlowType>(null);
 const [wasteAction, setWasteAction] = useState<WasteAction>(null);
 const [wasteLocation, setWasteLocation] = useState<string>("");
 const [dims, setDims] = useState({ width: "", height: "", length: "" });
 const [selectedMaterial, setSelectedMaterial] = useState<string>("");
 const [selectedLocation, setSelectedLocation] = useState<string>("");
 const [showCancelConfirm, setShowCancelConfirm] = useState<ActiveTask | null>(null);
 // Supply request state
 const [supplyItem, setSupplyItem] = useState<string>("");
 const [supplyQty, setSupplyQty] = useState<string>("1");
 const [supplyDelivery, setSupplyDelivery] = useState<string>("");
 const [supplyPriority, setSupplyPriority] = useState<Priority>("Medium");
 const [taskCounter, setTaskCounter] = useState(mockTasks.length + 1);

 // Filtered + sorted list
 const visible = useMemo(() => {
 let r = [...tasks];
 if (search) r = r.filter(t =>
 [t.workList, t.item, t.description, t.storage, t.destination, t.assignedTo]
 .some(v => v.toLowerCase().includes(search.toLowerCase()))
 );
 if (statusFilter !== "All") r = r.filter(t => t.status === statusFilter);
 r.sort((a, b) => {
 const av = String(a[sortField]), bv = String(b[sortField]);
 return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
 });
 return r;
 }, [tasks, search, statusFilter, sortField, sortDir]);

 function toggleSort(f: keyof ActiveTask) {
 if (sortField === f) setSortDir(d => d === "asc" ? "desc" : "asc");
 else { setSortField(f); setSortDir("asc"); }
 }

 function cancelTask(task: ActiveTask) {
 setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: "Cancelled" as WorkStatus } : t));
 toast.success("Task Cancelled", { description: task.description });
 if (selectedTask?.id === task.id) setSelectedTask({ ...task, status: "Cancelled" });
 setShowCancelConfirm(null);
 }

 function closeFlow() {
 setActiveFlow(null);
 setReturnType(null);
 setWasteAction(null);
 setWasteLocation("");
 setDims({ width: "", height: "", length: "" });
 setSelectedMaterial("");
 setSelectedLocation("");
 setSupplyItem("");
 setSupplyQty("1");
 setSupplyDelivery("");
 setSupplyPriority("Medium");
 }

 function submitSupplyRequest() {
 if (!supplyItem) { toast.error("Please select a supply item"); return; }
 if (!supplyDelivery) { toast.error("Please select a delivery location"); return; }
 const mat = mockMaterials.find(m => m.id === supplyItem);
 const qty = Math.max(1, parseInt(supplyQty) || 1);
 const newId = `AT-${String(taskCounter).padStart(3, "0")}`;
 const etaMinutes = supplyPriority === "Critical" ? 15 : supplyPriority === "High" ? 30 : supplyPriority === "Medium" ? 60 : 120;
 const eta = new Date(Date.now() + etaMinutes * 60000);
 const etaStr = `${String(eta.getHours()).padStart(2,"0")}:${String(eta.getMinutes()).padStart(2,"0")}`;
 const newTask: ActiveTask = {
 id: newId,
 workList: `WL-REQ-${String(taskCounter).padStart(3, "0")}`,
 type: "Replenishment",
 status: "Queued",
 priority: supplyPriority,
 isHot: supplyPriority === "Critical",
 materialCategory: "Supply",
 item: supplyItem,
 description: `${mat?.name ?? supplyItem} (Supply Request)`,
 quantity: qty,
 completedQty: 0,
 storage: "Supply Store",
 destination: supplyDelivery,
 assignedTo: "Unassigned",
 eta: etaStr,
 };
 setTasks(prev => [newTask, ...prev]);
 setTaskCounter(c => c + 1);
 toast.success("Supply Request Submitted", {
 description: `${mat?.name} × ${qty} → ${supplyDelivery}`,
 });
 closeFlow();
 }

 function submitReturn() {
 if (returnType === "trial-run") {
 if (!dims.width || !dims.height || !dims.length) { toast.error("Please enter all dimensions"); return; }
 toast.success("Trial Run Return Submitted", { description: `${dims.width}″ × ${dims.height}″ × ${dims.length}″` });
 } else {
 if (!selectedMaterial || !selectedLocation) { toast.error("Please select material and location"); return; }
 const mat = mockMaterials.find(m => m.id === selectedMaterial);
 toast.success("Non-Inventory Return Submitted", { description: `${mat?.name} → ${selectedLocation}` });
 }
 closeFlow();
 }

 function submitWaste() {
 if (wasteAction === "pickup-deliver") {
 if (!selectedTask) { toast.error("Select a task first"); return; }
 toast.success("Pickup & Deliver Confirmed", { description: `${selectedTask.workList} — ${selectedTask.description}` });
 setTasks(prev => prev.map(t => t.id === selectedTask.id ? { ...t, status: "In Progress" as WorkStatus } : t));
 } else if (wasteAction === "deliver-empty") {
 if (!wasteLocation) { toast.error("Please select a delivery location"); return; }
 toast.success("Empty Container Delivery Scheduled", { description: `Deliver to ${wasteLocation}` });
 } else if (wasteAction === "pickup-full") {
 if (!wasteLocation) { toast.error("Please select a pickup location"); return; }
 toast.success("Full Carrier Pickup Scheduled", { description: `Pickup from ${wasteLocation}` });
 }
 closeFlow();
 }

 function submitRequestPickup() {
 toast.success("Carrier Pickup Requested", { description: selectedLocation ? `From ${selectedLocation}` : "General request submitted" });
 closeFlow();
 }

 const SortIcon = ({ field }: { field: keyof ActiveTask }) => (
 <ArrowUpDown size={11} className={`inline ml-0.5 ${sortField === field ? "text-[var(--primary)] dark:text-[var(--primary)]" : "text-[var(--muted-foreground)]"}`} />
 );

 const counts = {
 inProgress: tasks.filter(t => t.status === "In Progress").length,
 queued: tasks.filter(t => t.status === "Queued").length,
 hot: tasks.filter(t => t.isHot).length,
 };

 return (
 <div className="h-screen flex flex-col bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)]">

 {/* ── Sticky Header ───────────────────────────────────────── */}
 <div className="sticky top-0 z-40 bg-[var(--background)]/95 backdrop-blur-md text-[var(--foreground)] border-b border-[var(--border)] px-8 pt-6 pb-4">
 <div className="flex items-center justify-between gap-4">
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
 <Archive size={20} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 Asset Operations
 </span>
 </nav>
 <button onClick={() => toast.info("Refreshed")} className="p-2 rounded-lg border-[var(--border)]  bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--surface-container-low)] dark:hover:bg-[var(--surface-container-high)] text-[var(--muted-foreground)] transition-colors" title="Refresh">
 <RefreshCw size={16} />
 </button>
 </div>
 </div>

 {/* ── Main Content ─────────────────────────────────────────── */}
 <div className={`flex-1 flex gap-4 px-6 pt-4 pb-6 min-h-0 overflow-hidden transition-all duration-300 ease-in-out ${activeFlow ? 'mr-[480px]' : 'mr-0'}`}>

 {/* ════════════════════════════════════════════════════════
 LEFT PANEL: Active Tasks (majority of screen)
 ════════════════════════════════════════════════════════ */}
 <div className="flex-1 flex flex-col min-h-0 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-xl overflow-hidden">

 {/* Task list toolbar */}
 <div className="px-4 pt-3 pb-2 border-b border-[var(--border)]  flex-shrink-0">
 <div className="flex items-center justify-between mb-2">
 <div className="flex items-center gap-2">
 <div className="w-8 h-8 bg-[var(--primary)]/20 /20 rounded-lg flex items-center justify-center">
 <ClipboardList size={16} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 </div>
 <h2 className="font-semibold text-[var(--foreground)] ">Active Tasks</h2>
 <span className="text-xs text-[var(--muted-foreground)]">({visible.length} of {tasks.length})</span>
 </div>
 <div className="flex items-center gap-2">
 {/* Quick status chips */}
 {(["All", "In Progress", "Queued"] as const).map(s => (
 <button key={s} onClick={() => setStatusFilter(s)} className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${statusFilter === s ? "bg-[var(--primary)] text-[var(--primary-foreground)]" : "bg-[var(--surface-container-low)] dark:bg-[var(--card)] text-[var(--muted-foreground)] hover:bg-[var(--surface-container-high)]"}`}>
 {s}{s !== "All" && <span className="ml-1 opacity-70">{s === "In Progress" ? counts.inProgress : counts.queued}</span>}
 </button>
 ))}
 {counts.hot > 0 && (
 <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--state-error)]/10 text-[var(--state-error)] dark:text-[var(--state-error)] flex items-center gap-1">
 <Flame size={10} />{counts.hot} Hot
 </span>
 )}
 {/* Search */}
 <div className="relative ml-2">
 <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] pointer-events-none" />
 <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…"
 className="w-44 pl-7 pr-3 py-1.5 text-sm bg-[var(--surface-container-low)] dark:bg-[var(--card)] border-[var(--border)]  rounded-lg text-[var(--foreground)]  placeholder-zinc-400 focus:outline-none focus:border-[var(--primary)] dark:focus:border-[var(--primary)] transition-colors" />
 </div>
 </div>
 </div>
 </div>

 {/* Column headers */}
 <div className="grid grid-cols-[3fr_1fr_1fr_1.2fr] gap-2 px-4 py-2 bg-[var(--surface-container)] text-[var(--foreground)] border-b border-[var(--border)] text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wide flex-shrink-0">
 <button className="text-left hover:text-[var(--foreground)] dark:hover:text-[var(--foreground)] transition-colors flex items-center gap-1" onClick={() => toggleSort("description")}>
 Item / Work List <SortIcon field="description" />
 </button>
 <button className="text-left hover:text-[var(--foreground)] dark:hover:text-[var(--foreground)] transition-colors" onClick={() => toggleSort("priority")}>Priority <SortIcon field="priority" /></button>
 <button className="text-left hover:text-[var(--foreground)] dark:hover:text-[var(--foreground)] transition-colors" onClick={() => toggleSort("status")}>Status <SortIcon field="status" /></button>
 <button className="text-left hover:text-[var(--foreground)] dark:hover:text-[var(--foreground)] transition-colors" onClick={() => toggleSort("materialCategory")}>Inventory <SortIcon field="materialCategory" /></button>
 </div>

 {/* Scrollable rows */}
 <div className="flex-1 overflow-y-auto">
 {visible.length === 0 ? (
 <div className="flex flex-col items-center justify-center h-full text-[var(--muted-foreground)] gap-3">
 <ClipboardList size={36} />
 <p className="text-sm">No active tasks match the current filter</p>
 </div>
 ) : visible.map(task => (
 <div
 key={task.id}
 onClick={() => setSelectedTask(sel => sel?.id === task.id ? null : task)}
 className={`grid grid-cols-[3fr_1fr_1fr_1.2fr] gap-2 px-4 py-3 border-b border-[var(--border)] /80 cursor-pointer transition-colors items-center ${
 selectedTask?.id === task.id
 ? (isV6 ? "bg-[var(--primary)]/10 ring-1 ring-inset ring-[var(--primary)]" : "bg-[var(--primary)]/6 /6 border-l-[3px] border-l-[var(--primary)] dark:border-l-[var(--primary)]")
 : "hover:bg-[var(--surface-container-lowest)] hover:bg-[var(--surface-container-high)]/40"
 } ${task.status === "Cancelled" ? "opacity-50" : ""}`}
 >
 {/* Item / Work List */}
 <div className="min-w-0">
 <div className="flex items-center gap-1.5 mb-0.5">
 {task.isHot && <Flame size={11} className="text-[var(--state-error)] flex-shrink-0" />}
 <span className="text-sm font-semibold text-[var(--foreground)]  truncate">{task.description}</span>
 </div>
 <div className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
 <span className="font-mono">{task.item}</span>
 <span>·</span>
 <span>{task.workList}</span>
 </div>
 </div>

 {/* Priority */}
 <div className="flex items-center gap-1.5">
 <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${priorityDot[task.priority]}`} />
 <span className="text-xs text-[var(--foreground)]">{task.priority}</span>
 </div>

 {/* Status */}
 <div>
 <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge[task.status]}`}>{task.status}</span>
 </div>

 {/* Inventory / Non-Inventory */}
 <div>
 {task.materialCategory === "Supply" ? (
 <span className="px-2 py-0.5 rounded-full text-xs font-medium text-[var(--state-info)] dark:text-[var(--state-info)] bg-[var(--state-info)]/10">Inventory</span>
 ) : (
 <span className="px-2 py-0.5 rounded-full text-xs font-medium text-[var(--state-on-warning-container)] dark:text-[var(--state-warning)] bg-[var(--state-warning)]/10">Non-Inventory</span>
 )}
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* ════════════════════════════════════════════════════════
 RIGHT PANEL: Operations / Functions
 ════════════════════════════════════════════════════════ */}
 <div className="w-72 flex flex-col gap-3 flex-shrink-0">

 {/* Selected task mini-card */}
 <div className={`rounded-xl border p-3 flex-shrink-0 transition-all ${selectedTask ? "bg-[var(--primary)]/6 /6 border-[var(--primary)]/30 dark:border-[var(--primary)]/30" : "bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)] "}`}>
 <div className="flex items-center gap-2 mb-1">
 <div className="w-7 h-7 bg-[var(--primary)]/20 /20 rounded-lg flex items-center justify-center flex-shrink-0">
 <Package size={13} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 </div>
 <span className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wide">Selected Task</span>
 </div>
 {selectedTask ? (
 <>
 <p className="text-sm font-semibold text-[var(--foreground)]  truncate">{selectedTask.description}</p>
 <div className="flex items-center gap-2 mt-1 text-xs text-[var(--muted-foreground)]">
 <span className="font-mono">{selectedTask.workList}</span>
 <span>·</span>
 <span className={`px-1.5 py-0.5 rounded-full ${statusBadge[selectedTask.status]}`}>{selectedTask.status}</span>
 </div>
 </>
 ) : (
 <p className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] mt-1">Tap a task in the list to select it</p>
 )}
 </div>

 {/* Operations panel */}
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-xl overflow-hidden flex flex-col flex-1">
 <div className="px-4 pt-3 pb-2 border-b border-[var(--border)]  flex-shrink-0">
 <div className="flex items-center gap-2">
 <div className="w-8 h-8 bg-[var(--primary)]/20 /20 rounded-lg flex items-center justify-center">
 <Archive size={15} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 </div>
 <h2 className="font-semibold text-[var(--foreground)] ">Operations</h2>
 </div>
 </div>

 <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5">

 {/* ① Request Supply Item */}
 <button
 onClick={() => setActiveFlow("supply-request")}
 className={`${actionBtn} bg-[var(--primary)] hover:opacity-90 active:scale-[0.98] border-[var(--primary)] dark:border-[var(--primary)] text-[var(--primary-foreground)] `}
 >
 <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
 <ShoppingCart size={18} />
 </div>
 <div className="text-left">
 <div className="font-bold">Request Supply Item</div>
 <div className="text-xs font-normal opacity-80">Order supplies to a location</div>
 </div>
 </button>

 {/* ② Return */}
 <button
 onClick={() => setActiveFlow("return")}
 className={`${actionBtn} bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)] dark:border-[var(--border)] text-[var(--foreground)]  hover:border-[var(--state-warning)] dark:hover:border-[var(--state-warning)]/40 hover:bg-[var(--state-warning)]/5`}
 >
 <div className="w-9 h-9 bg-[var(--state-warning)]/10 rounded-lg flex items-center justify-center flex-shrink-0 text-[var(--state-on-warning-container)] dark:text-[var(--state-warning)]">
 <RotateCcw size={18} />
 </div>
 <div className="text-left">
 <div className="font-bold">Return</div>
 <div className="text-xs font-normal text-[var(--muted-foreground)]">Trial run / Non-inventory</div>
 </div>
 </button>

 {/* ③ Waste / Recycling — includes Pickup & Deliver as sub-option */}
 <button
 onClick={() => setActiveFlow("waste")}
 className={`${actionBtn} bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)] dark:border-[var(--border)] text-[var(--foreground)]  hover:border-[var(--state-success)]/40 dark:hover:border-[var(--state-success)]/50 hover:bg-[var(--state-success)]/5`}
 >
 <div className="w-9 h-9 bg-[var(--state-success-container)]/60 rounded-lg flex items-center justify-center flex-shrink-0 text-[var(--state-on-success-container)] dark:text-[var(--state-success)]">
 <Recycle size={18} />
 </div>
 <div className="text-left">
 <div className="font-bold">Waste / Recycling</div>
 <div className="text-xs font-normal text-[var(--muted-foreground)]">Deliver empty · Pickup full · Pickup &amp; Deliver</div>
 </div>
 </button>

 {/* ④ Request Pickup (Carrier) — standalone, no task required */}
 <button
 onClick={() => setActiveFlow("request-pickup")}
 className={`${actionBtn} bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)] dark:border-[var(--border)] text-[var(--foreground)]  hover:border-[var(--primary)] dark:hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 /5`}
 >
 <div className="w-9 h-9 bg-[var(--surface-container-low)] dark:bg-[var(--card)] rounded-lg flex items-center justify-center flex-shrink-0 text-[var(--primary)] dark:text-[var(--primary)]">
 <Box size={18} />
 </div>
 <div className="text-left">
 <div className="font-bold">Request Pickup</div>
 <div className="text-xs font-normal text-[var(--muted-foreground)]">Empty carrier — standalone</div>
 </div>
 </button>

 {/* ⑤ Cancel Task — only for Supply items */}
 {selectedTask && selectedTask.materialCategory === "Supply" && selectedTask.status !== "Cancelled" && selectedTask.status !== "Completed" && (
 <button
 onClick={() => setShowCancelConfirm(selectedTask)}
 className={`${actionBtn} bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--state-error)]/40 dark:border-[var(--state-error)] text-[var(--state-error)] dark:text-[var(--state-error)] hover:bg-[var(--state-error-container)] dark:hover:bg-[var(--state-error-container)]/20 hover:border-[var(--state-error)]/50 dark:hover:border-red-600 mt-1`}
 >
 <div className="w-9 h-9 bg-[var(--state-error)]/10 rounded-lg flex items-center justify-center flex-shrink-0">
 <X size={18} />
 </div>
 <div className="text-left">
 <div className="font-bold">Cancel Task</div>
 <div className="text-xs font-normal opacity-70">{selectedTask.workList}</div>
 </div>
 </button>
 )}

 {selectedTask && selectedTask.materialCategory === "Raw Material" && (
 <div className="mt-1 px-3 py-2.5 rounded-xl bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  text-xs text-[var(--muted-foreground)] flex items-start gap-2">
 <Info size={13} className="mt-0.5 flex-shrink-0 text-[var(--muted-foreground)]" />
 Cancel is not available for raw material tasks.
 </div>
 )}

 {!selectedTask && (
 <div className="mt-1 px-3 py-2.5 rounded-xl bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  text-xs text-[var(--muted-foreground)] flex items-start gap-2">
 <Info size={13} className="mt-0.5 flex-shrink-0 text-[var(--muted-foreground)]" />
 Select a task to enable Cancel.
 </div>
 )}
 </div>
 </div>
 </div>
 </div>

 {/* ══════════════════════════════════════════════════════════
 SLIDE-OUT OPERATIONS PANEL
 ══════════════════════════════════════════════════════════ */}
 <AnimatePresence>
 {/* Cancel confirmation — kept as small modal (destructive action) */}
 {showCancelConfirm && (
 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
 <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-2xl p-6 w-full max-w-sm border-[var(--border)] ">
 <div className="flex items-center gap-3 mb-4">
 <div className="w-10 h-10 bg-[var(--state-error)]/10 rounded-xl flex items-center justify-center flex-shrink-0"><X size={20} className="text-[var(--state-error)] dark:text-[var(--state-error)]" /></div>
 <div>
 <h3 className="text-lg font-bold text-[var(--foreground)] ">Cancel Task?</h3>
 <p className="text-xs text-[var(--muted-foreground)] mt-0.5">This action cannot be undone</p>
 </div>
 </div>
 <p className="text-sm text-[var(--foreground)] mb-1 font-medium">{showCancelConfirm.description}</p>
 <p className="text-xs font-mono text-[var(--muted-foreground)] mb-6">{showCancelConfirm.item} · {showCancelConfirm.workList}</p>
 <div className="flex gap-3">
 <button onClick={() => setShowCancelConfirm(null)} className="flex-1 py-2.5 rounded-xl border-[var(--border)]  text-[var(--foreground)] font-medium text-sm hover:bg-[var(--surface-container-lowest)] hover:bg-[var(--surface-container-high)] transition-colors">Keep Task</button>
 <button onClick={() => cancelTask(showCancelConfirm)} className="flex-1 py-2.5 rounded-xl bg-[var(--state-error-container)] hover:bg-[var(--state-error)] text-[var(--state-error-foreground)] font-semibold text-sm transition-colors">Cancel Task</button>
 </div>
 </motion.div>
 </motion.div>
 )}

 {/* Slide-out operations panel */}
 {activeFlow && (
 <motion.div
 initial={{ x: "100%" }}
 animate={{ x: 0 }}
 exit={{ x: "100%" }}
 transition={{ type: "spring", damping: 25, stiffness: 300 }}
 className="fixed right-0 top-0 bottom-0 w-[480px] bg-[var(--surface-container-high)] text-[var(--foreground)] border-l-2 border-[var(--primary)] dark:border-[var(--primary)] z-50 flex flex-col"
 >
 {/* Panel header */}
 <div className="flex-shrink-0 bg-[var(--primary)] p-5 text-[var(--primary-foreground)]">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-3">
 {activeFlow === "return" && returnType && (
 <button onClick={() => setReturnType(null)} className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors flex-shrink-0">
 <ArrowLeft size={16} />
 </button>
 )}
 <div>
 <h2 className="text-lg font-bold">
 {activeFlow === "supply-request" && "Request Supply Item"}
 {activeFlow === "return" && !returnType && "Return"}
 {activeFlow === "return" && returnType === "trial-run" && "Return — Trial Run Material"}
 {activeFlow === "return" && returnType === "non-inventory" && "Return — Non-Inventory Supply"}
 {activeFlow === "waste" && "Waste / Recycling"}
 {activeFlow === "request-pickup" && "Request Pickup"}
 </h2>
 <p className="text-xs text-[var(--foreground)]/70 mt-0.5">
 {activeFlow === "supply-request" && "Order supplies to a location"}
 {activeFlow === "return" && !returnType && "Select the type of return"}
 {activeFlow === "return" && returnType === "trial-run" && "Capture dimensions to complete return"}
 {activeFlow === "return" && returnType === "non-inventory" && "Select material and pickup location"}
 {activeFlow === "waste" && "Select the action to perform"}
 {activeFlow === "request-pickup" && "Standalone carrier pickup request"}
 </p>
 </div>
 </div>
 <button onClick={closeFlow} className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors flex-shrink-0">
 <X size={18} />
 </button>
 </div>
 </div>

 {/* Panel body */}
 <div className="flex-1 overflow-y-auto p-6">

 {/* ── Supply Item Request ── */}
 {activeFlow === "supply-request" && (
 <div className="space-y-5">
 <div>
 <label className="block text-sm font-semibold text-[var(--foreground)] mb-1.5">Supply Item <span className="text-[var(--state-error)]">*</span></label>
 <select value={supplyItem} onChange={e => setSupplyItem(e.target.value)} className="w-full px-3 py-2.5 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)] dark:border-[var(--border)] rounded-xl text-[var(--foreground)]  text-sm focus:outline-none focus:border-[var(--primary)] dark:focus:border-[var(--primary)] transition-colors">
 <option value="">Select supply item…</option>
 {mockMaterials.map(m => <option key={m.id} value={m.id}>{m.name} — {m.type}</option>)}
 </select>
 </div>
 <div>
 <label className="block text-sm font-semibold text-[var(--foreground)] mb-1.5">Priority</label>
 <select value={supplyPriority} onChange={e => setSupplyPriority(e.target.value as Priority)} className="w-full px-3 py-2.5 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)] dark:border-[var(--border)] rounded-xl text-[var(--foreground)]  text-sm focus:outline-none focus:border-[var(--primary)] dark:focus:border-[var(--primary)] transition-colors">
 <option value="Low">Low</option>
 <option value="Medium">Medium</option>
 <option value="High">High</option>
 <option value="Critical">Critical — Urgent</option>
 </select>
 </div>
 <div>
 <label className="block text-sm font-semibold text-[var(--foreground)] mb-1.5">Deliver To <span className="text-[var(--state-error)]">*</span></label>
 <select value={supplyDelivery} onChange={e => setSupplyDelivery(e.target.value)} className="w-full px-3 py-2.5 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)] dark:border-[var(--border)] rounded-xl text-[var(--foreground)]  text-sm focus:outline-none focus:border-[var(--primary)] dark:focus:border-[var(--primary)] transition-colors">
 <option value="">Select delivery location…</option>
 {mockLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
 </select>
 </div>
 {supplyItem && supplyDelivery && (
 <div className="bg-[var(--primary)]/6 /6 border border-[var(--primary)]/20 dark:border-[var(--primary)]/20 rounded-xl p-4">
 <p className="text-xs font-semibold text-[var(--primary)] dark:text-[var(--primary)] uppercase tracking-wide mb-3">Request Preview</p>
 <div className="grid grid-cols-2 gap-3 text-sm">
 <div><span className="text-xs text-[var(--muted-foreground)]">Item</span><br /><span className="font-medium text-[var(--foreground)] ">{mockMaterials.find(m => m.id === supplyItem)?.name}</span></div>
 <div><span className="text-xs text-[var(--muted-foreground)]">Deliver To</span><br /><span className="font-medium font-mono text-[var(--foreground)] ">{supplyDelivery}</span></div>
 <div><span className="text-xs text-[var(--muted-foreground)]">Priority</span><br /><span className={`font-semibold ${supplyPriority === "Critical" ? "text-[var(--state-error)]" : supplyPriority === "High" ? "text-[var(--state-on-warning-container)]" : supplyPriority === "Medium" ? "text-[var(--state-on-warning-container)]" : "text-[var(--muted-foreground)]"}`}>{supplyPriority}</span></div>
 </div>
 <p className="text-xs text-[var(--muted-foreground)] mt-3 flex items-center gap-1.5">
 <Info size={11} className="flex-shrink-0" />
 This request will appear in Active Tasks and can be cancelled.
 </p>
 </div>
 )}
 </div>
 )}

 {/* ── Return ── */}
 {activeFlow === "return" && !returnType && (
 <div className="space-y-3">
 {selectedTask && (
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-xl p-4 mb-2">
 <p className="text-xs text-[var(--muted-foreground)] mb-1">Returning task</p>
 <p className="font-semibold text-[var(--foreground)] ">{selectedTask.description}</p>
 <p className="text-xs font-mono text-[var(--muted-foreground)] mt-0.5">{selectedTask.workList}</p>
 </div>
 )}
 <button onClick={() => setReturnType("trial-run")} className="w-full flex items-start gap-4 p-4 rounded-xl border-2 border-[var(--border)]  hover:border-[var(--state-warning)] dark:hover:border-[var(--state-warning)]/40 hover:bg-[var(--state-warning)]/5 transition-all text-left">
 <div className="w-10 h-10 bg-[var(--state-warning)]/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"><Package size={18} className="text-[var(--state-on-warning-container)] dark:text-[var(--state-warning)]" /></div>
 <div>
 <div className="font-semibold text-[var(--foreground)]  mb-1">Trial Run Material</div>
 <div className="text-sm text-[var(--muted-foreground)]">Capture dimensions (W × H × L) before returning</div>
 </div>
 </button>
 <button onClick={() => setReturnType("non-inventory")} className="w-full flex items-start gap-4 p-4 rounded-xl border-2 border-[var(--border)]  hover:border-[var(--state-warning)] dark:hover:border-[var(--state-warning)]/40 hover:bg-[var(--state-warning)]/5 transition-all text-left">
 <div className="w-10 h-10 bg-[var(--surface-container-low)] dark:bg-[var(--card)] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"><PackageX size={18} className="text-[var(--muted-foreground)]" /></div>
 <div>
 <div className="font-semibold text-[var(--foreground)]  mb-1">Non-Inventory Supply Material</div>
 <div className="text-sm text-[var(--muted-foreground)]">Select material and pickup location</div>
 </div>
 </button>
 </div>
 )}

 {activeFlow === "return" && returnType === "trial-run" && (
 <div className="space-y-5">
 <p className="text-sm text-[var(--muted-foreground)]">Enter the material dimensions to complete the return.</p>
 <div className="grid grid-cols-3 gap-3">
 {(["width", "height", "length"] as const).map(dim => (
 <div key={dim}>
 <label className="block text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wide mb-1.5">{dim} (in)</label>
 <input type="number" min="0" step="0.1" value={dims[dim]} onChange={e => setDims(d => ({ ...d, [dim]: e.target.value }))} placeholder="0.0"
 className="w-full px-3 py-2.5 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)] dark:border-[var(--border)] rounded-xl text-[var(--foreground)]  text-sm text-center font-mono focus:outline-none focus:border-[var(--primary)] dark:focus:border-[var(--primary)] transition-colors" />
 </div>
 ))}
 </div>
 {dims.width && dims.height && dims.length && (
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-xl p-3 text-sm text-[var(--muted-foreground)] text-center">
 Volume: <span className="font-bold text-[var(--foreground)] ">{(parseFloat(dims.width) * parseFloat(dims.height) * parseFloat(dims.length)).toFixed(1)} in³</span>
 </div>
 )}
 </div>
 )}

 {activeFlow === "return" && returnType === "non-inventory" && (
 <div className="space-y-5">
 <p className="text-sm text-[var(--muted-foreground)]">Select the supply material and the pickup location.</p>
 <div>
 <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">Material</label>
 <select value={selectedMaterial} onChange={e => setSelectedMaterial(e.target.value)} className="w-full px-3 py-2.5 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)] dark:border-[var(--border)] rounded-xl text-[var(--foreground)]  text-sm focus:outline-none focus:border-[var(--primary)] dark:focus:border-[var(--primary)] transition-colors">
 <option value="">Select material…</option>
 {mockMaterials.map(m => <option key={m.id} value={m.id}>{m.name} ({m.type})</option>)}
 </select>
 </div>
 <div>
 <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">Pickup Location</label>
 <select value={selectedLocation} onChange={e => setSelectedLocation(e.target.value)} className="w-full px-3 py-2.5 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)] dark:border-[var(--border)] rounded-xl text-[var(--foreground)]  text-sm focus:outline-none focus:border-[var(--primary)] dark:focus:border-[var(--primary)] transition-colors">
 <option value="">Select location…</option>
 {mockLocations.map(l => <option key={l} value={l}>{l}</option>)}
 </select>
 </div>
 </div>
 )}

 {/* ── Waste / Recycling ── */}
 {activeFlow === "waste" && (
 <div className="space-y-3">
 {([
 { key: "deliver-empty" as WasteAction, icon: <Box size={18} />, title: "Deliver an Empty", desc: "Deliver an empty container to the waste / recycling area" },
 { key: "pickup-full" as WasteAction, icon: <Trash2 size={18} />, title: "Pickup Full", desc: "Pick up a full waste or recycling carrier for disposal" },
 { key: "pickup-deliver" as WasteAction, icon: <Truck size={18} />, title: "Pickup & Deliver", desc: "Pickup the selected task item and deliver it" },
 ]).map(opt => (
 <button key={opt.key as string} onClick={() => setWasteAction(wasteAction === opt.key ? null : opt.key)}
 className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
 wasteAction === opt.key
 ? opt.key === "pickup-deliver"
 ? "border-[var(--primary)] dark:border-[var(--primary)] bg-[var(--primary)]/10 /10"
 : "border-[var(--state-success)]/40 bg-[var(--state-success-container)]/60"
 : "border-[var(--border)]  hover:border-[var(--border)] dark:hover:border-[var(--border)] hover:bg-[var(--surface-container-lowest)] hover:bg-[var(--surface-container-high)]"
 }`}
 >
 <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
 wasteAction === opt.key
 ? opt.key === "pickup-deliver" ? "bg-[var(--primary)]  text-[var(--primary-foreground)]" : "bg-[var(--state-success-container)] text-[var(--state-on-success-container)]"
 : opt.key === "pickup-deliver" ? "bg-[var(--primary)]/10 text-[var(--primary)] dark:text-[var(--primary)]" : "bg-[var(--state-success-container)]/60 text-[var(--state-on-success-container)] dark:text-[var(--state-success)]"
 }`}>
 {opt.icon}
 </div>
 <div className="flex-1">
 <div className="font-semibold text-[var(--foreground)] ">{opt.title}</div>
 <div className="text-sm text-[var(--muted-foreground)]">{opt.desc}</div>
 </div>
 {wasteAction === opt.key && <CheckCircle2 size={18} className={`flex-shrink-0 ${opt.key === "pickup-deliver" ? "text-[var(--primary)] dark:text-[var(--primary)]" : "text-[var(--state-on-success-container)] dark:text-[var(--state-success)]"}`} />}
 </button>
 ))}
 {wasteAction === "pickup-deliver" && !selectedTask && (
 <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-[var(--state-warning-container)] dark:bg-[var(--state-warning-container)]/20 border border-[var(--state-warning)]/40 dark:border-[var(--state-warning)] text-xs text-[var(--state-on-warning-container)] dark:text-[var(--state-warning)]">
 <Info size={13} className="mt-0.5 flex-shrink-0" />
 Select a task from the list first to use Pickup &amp; Deliver.
 </div>
 )}

 {/* Location dropdown for Deliver Empty / Pickup Full */}
 {(wasteAction === "deliver-empty" || wasteAction === "pickup-full") && (
 <div className="pt-1">
 <label className="block text-sm font-semibold text-[var(--foreground)] mb-1.5">
 {wasteAction === "deliver-empty" ? "Delivery Location" : "Pickup Location"}
 <span className="text-[var(--state-error)] ml-1">*</span>
 </label>
 <select
 value={wasteLocation}
 onChange={e => setWasteLocation(e.target.value)}
 className="w-full px-3 py-2.5 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)] dark:border-[var(--border)] rounded-xl text-[var(--foreground)]  text-sm focus:outline-none focus:border-[var(--primary)] dark:focus:border-[var(--primary)] transition-colors"
 >
 <option value="">Select location…</option>
 {mockLocations.map(l => <option key={l} value={l}>{l}</option>)}
 </select>
 </div>
 )}

 {selectedTask && (
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-xl p-3 text-sm">
 <p className="text-xs text-[var(--muted-foreground)] mb-1">Associated task</p>
 <p className="font-medium text-[var(--foreground)]  truncate">{selectedTask.description}</p>
 </div>
 )}
 </div>
 )}

 {/* ── Request Pickup (Carrier) ── */}
 {activeFlow === "request-pickup" && (
 <div className="space-y-5">
 <div>
 <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">Pickup Location</label>
 <select value={selectedLocation} onChange={e => setSelectedLocation(e.target.value)} className="w-full px-3 py-2.5 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)] dark:border-[var(--border)] rounded-xl text-[var(--foreground)]  text-sm focus:outline-none focus:border-[var(--primary)] dark:focus:border-[var(--primary)] transition-colors">
 <option value="">Select location…</option>
 {mockLocations.map(l => <option key={l} value={l}>{l}</option>)}
 </select>
 </div>
 <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  text-xs text-[var(--muted-foreground)]">
 <Info size={13} className="mt-0.5 flex-shrink-0" />
 Standalone request — no task selection required. A carrier will be dispatched to the selected location.
 </div>
 </div>
 )}

 </div>

 {/* Panel footer — action buttons */}
 <div className="flex-shrink-0 border-t border-[var(--border)]  p-4 flex gap-3 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)]">
 <button onClick={closeFlow} className="flex-1 py-2.5 rounded-xl border-[var(--border)]  text-[var(--foreground)] font-medium text-sm hover:bg-[var(--surface-container-lowest)] hover:bg-[var(--surface-container-high)] transition-colors">
 Cancel
 </button>
 <button
 onClick={() => {
 if (activeFlow === "supply-request") submitSupplyRequest();
 else if (activeFlow === "return") submitReturn();
 else if (activeFlow === "waste") submitWaste();
 else if (activeFlow === "request-pickup") submitRequestPickup();
 }}
 disabled={
 (activeFlow === "supply-request" && (!supplyItem || !supplyDelivery)) ||
 (activeFlow === "return" && returnType === "trial-run" && (!dims.width || !dims.height || !dims.length)) ||
 (activeFlow === "return" && returnType === "non-inventory" && (!selectedMaterial || !selectedLocation)) ||
 (activeFlow === "return" && !returnType) ||
 (activeFlow === "waste" && (!wasteAction ||
 (wasteAction === "pickup-deliver" && !selectedTask) ||
 ((wasteAction === "deliver-empty" || wasteAction === "pickup-full") && !wasteLocation)
 )) ||
 (activeFlow === "request-pickup" && !selectedLocation)
 }
 className="flex-1 py-2.5 rounded-xl bg-[var(--primary)] hover:opacity-90 active:scale-[0.98] text-[var(--primary-foreground)] font-semibold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed border border-[var(--primary)] dark:border-[var(--primary)] "
 >
 {activeFlow === "supply-request" && "Submit Request"}
 {activeFlow === "return" && !returnType && "Select a Type Above"}
 {activeFlow === "return" && returnType && "Confirm Return"}
 {activeFlow === "waste" && "Confirm"}
 {activeFlow === "request-pickup" && "Submit Request"}
 </button>
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 );
}
