import { useState, useMemo } from "react";
import { useVersionTheme } from "../contexts/VersionThemeContext";
import { Link } from "react-router-dom";
import {
 Home, ChevronRight, ClipboardCheck, Search, RefreshCw,
 ClipboardList, Package, X, Flame, ArrowUpDown,
 Info, Scan, CheckCircle2, Recycle, Box, Truck, Trash2,
 AlertCircle, BookOpen, Monitor,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type MaterialCategory = "Supply" | "Raw Material";
type WorkStatus = "Queued" | "In Progress" | "Completed" | "Cancelled";
type Priority = "Critical" | "High" | "Medium" | "Low";
type MPCWorkType = "Receive" | "Inspect" | "Stage" | "Hold" | "Transfer";
type WasteAction = "deliver-empty" | "pickup-full" | "pickup-deliver" | null;

type MPCTask = {
 id: string;
 workList: string;
 type: MPCWorkType;
 status: WorkStatus;
 priority: Priority;
 isHot: boolean;
 materialCategory: MaterialCategory;
 item: string;
 description: string;
 quantity: number;
 assignedTo: string;
 lpn?: string; // assigned after Receive scan
 workStand?: number; // 1-4, assigned after Receive
};

// ─────────────────────────────────────────────────────────────────────────────
// Mock data
// ─────────────────────────────────────────────────────────────────────────────

const mockMPCTasks: MPCTask[] = [
 { id: "MPC-001", workList: "WL-MPC-001", type: "Receive", status: "In Progress", priority: "Critical", isHot: true, materialCategory: "Raw Material", item: "ITM-6001", description: "Steel Coil Grade A — 3 units inbound", quantity: 3, assignedTo: "John Smith", lpn: "LPN-9901", workStand: 2 },
 { id: "MPC-002", workList: "WL-MPC-002", type: "Inspect", status: "Queued", priority: "High", isHot: false, materialCategory: "Raw Material", item: "ITM-8001", description: "Aluminum Sheet 4×8ft — Quality hold", quantity: 20, assignedTo: "Sarah Jones" },
 { id: "MPC-003", workList: "WL-MPC-003", type: "Stage", status: "Queued", priority: "High", isHot: false, materialCategory: "Raw Material", item: "ITM-9001", description: "Copper Wire Spool 500m — Pre-stage", quantity: 5, assignedTo: "Mike Davis" },
 { id: "MPC-004", workList: "WL-MPC-004", type: "Hold", status: "In Progress", priority: "Medium", isHot: false, materialCategory: "Raw Material", item: "ITM-4010", description: "Trial Roll Batch #A24 — Dims capture", quantity: 2, assignedTo: "Sarah Jones" },
 { id: "MPC-005", workList: "WL-MPC-005", type: "Receive", status: "Queued", priority: "Critical", isHot: true, materialCategory: "Raw Material", item: "ITM-1015", description: "Prototype Component Rev3 — Urgent", quantity: 1, assignedTo: "Unassigned" },
 { id: "MPC-006", workList: "WL-MPC-006", type: "Transfer", status: "In Progress", priority: "Medium", isHot: false, materialCategory: "Supply", item: "ITM-7020", description: "Non-Std Packaging Insert — 150 pcs", quantity: 150,assignedTo: "Emily Chen" },
 { id: "MPC-007", workList: "WL-MPC-007", type: "Inspect", status: "Queued", priority: "Low", isHot: false, materialCategory: "Raw Material", item: "ITM-3030", description: "Brass Fitting Batch — Routine inspection", quantity: 40, assignedTo: "John Smith" },
 { id: "MPC-008", workList: "WL-MPC-008", type: "Stage", status: "In Progress", priority: "High", isHot: false, materialCategory: "Raw Material", item: "ITM-2040", description: "Carbon Fibre Panel — Pre-cut staging", quantity: 8, assignedTo: "Mike Davis" },
];

// Work instructions per task type
const workInstructions: Record<MPCWorkType, string[]> = {
 Receive: [
 "Confirm quantity matches purchase order.",
 "Inspect packaging for external damage before opening.",
 "Record lot number, batch ID, and supplier reference.",
 "Affix LPN label to primary packaging.",
 "Stage item at assigned work stand — do not move until inspected.",
 ],
 Inspect: [
 "Compare item against approved specification sheet.",
 "Check dimensions, weight, and surface condition.",
 "Document any non-conformances with photo evidence.",
 "Record inspection result: Pass / Fail / Conditional.",
 "Update status and route to next station per result.",
 ],
 Stage: [
 "Verify item matches work order before staging.",
 "Place item in designated staging lane — face label outward.",
 "Ensure no contact with incompatible materials.",
 "Record staging time and operator ID.",
 "Notify downstream workstation when staging is complete.",
 ],
 Hold: [
 "Do not process or move item without authorisation.",
 "Apply HOLD tag — red label — visible on all sides.",
 "Document reason for hold and reference ticket number.",
 "Notify Quality team and await disposition decision.",
 "Log hold start time in the system.",
 ],
 Transfer: [
 "Confirm receiving workstation is ready to accept.",
 "Secure item for transit — use appropriate carrier.",
 "Scan LPN at origin and confirm at destination.",
 "Record transfer time and carrier details.",
 "Obtain sign-off from receiving operator.",
 ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
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

const actionBtn = "w-full flex items-center gap-3 px-4 py-4 rounded-xl border-2 font-semibold text-sm transition-all hover:scale-[1.01] active:scale-[0.99]";

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export function MPCOperations() {
  const { version } = useVersionTheme();
  const isV6 = version === "Master Blue V6";
 const [tasks, setTasks] = useState<MPCTask[]>(mockMPCTasks);
 const [selectedTask, setSelectedTask] = useState<MPCTask | null>(null);
 const [search, setSearch] = useState("");
 const [sortField, setSortField] = useState<keyof MPCTask>("priority");
 const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
 const [statusFilter, setStatusFilter] = useState<WorkStatus | "All">("All");

 // Slide-out panel state
 const [activeFlow, setActiveFlow] = useState<"receive" | "waste" | "instructions" | null>(null);
 const [wasteAction, setWasteAction] = useState<WasteAction>(null);
 const [wasteLocation, setWasteLocation] = useState<string>("");

 // Receive flow state
 const [receiveStep, setReceiveStep] = useState<"scan" | "stand" | "instructions">("scan");
 const [lpnInput, setLpnInput] = useState("");
 const [selectedStand, setSelectedStand] = useState<number | null>(null);

 // Outbound completion flow
 const [outboundStep, setOutboundStep] = useState(false);
 const [selectedOutbound, setSelectedOutbound] = useState<string | null>(null);

 // Cancel confirm
 const [showCancelConfirm, setShowCancelConfirm] = useState<MPCTask | null>(null);

 // Outbound locations (8 fixed options)
 const outboundLocations = [
 { id: "OB-1", name: "Outbound Bay 1", zone: "Shipping" },
 { id: "OB-2", name: "Outbound Bay 2", zone: "Shipping" },
 { id: "OB-3", name: "Outbound Bay 3", zone: "Shipping" },
 { id: "OB-4", name: "Outbound Bay 4", zone: "Shipping" },
 { id: "OB-5", name: "Staging Area A", zone: "Staging" },
 { id: "OB-6", name: "Staging Area B", zone: "Staging" },
 { id: "OB-7", name: "Asset Ops Input", zone: "Asset Ops" },
 { id: "OB-8", name: "Hold / QC Lane", zone: "Quality" },
 ];

 // Work stands — compute which are occupied
 const occupiedStands = useMemo(() => new Set(tasks.filter(t => t.workStand).map(t => t.workStand!)), [tasks]);
 const availableStands = [1, 2, 3, 4].filter(s => !occupiedStands.has(s));

 const visible = useMemo(() => {
 let r = [...tasks];
 if (search) r = r.filter(t =>
 [t.workList, t.item, t.description, t.assignedTo, t.lpn ?? ""]
 .some(v => v.toLowerCase().includes(search.toLowerCase()))
 );
 if (statusFilter !== "All") r = r.filter(t => t.status === statusFilter);
 r.sort((a, b) => {
 const av = String(a[sortField] ?? ""), bv = String(b[sortField] ?? "");
 return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
 });
 return r;
 }, [tasks, search, statusFilter, sortField, sortDir]);

 function toggleSort(f: keyof MPCTask) {
 if (sortField === f) setSortDir(d => d === "asc" ? "desc" : "asc");
 else { setSortField(f); setSortDir("asc"); }
 }

 function cancelTask(task: MPCTask) {
 setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: "Cancelled" as WorkStatus } : t));
 toast.success("Task Cancelled", { description: task.description });
 if (selectedTask?.id === task.id) setSelectedTask({ ...task, status: "Cancelled" });
 setShowCancelConfirm(null);
 }

 function closeFlow() {
 setActiveFlow(null);
 setWasteAction(null);
 setWasteLocation("");
 setReceiveStep("scan");
 setLpnInput("");
 setSelectedStand(null);
 setOutboundStep(false);
 setSelectedOutbound(null);
 }

 function confirmOutbound() {
 if (!selectedTask || !selectedOutbound) return;
 const loc = outboundLocations.find(l => l.id === selectedOutbound);
 setTasks(prev => prev.map(t =>
 t.id === selectedTask.id ? { ...t, status: "Completed" as WorkStatus } : t
 ));
 setSelectedTask(prev => prev ? { ...prev, status: "Completed" } : null);
 toast.success("Work Instructions Complete", {
 description: `${selectedTask.description} → ${loc?.name}`,
 });
 closeFlow();
 }

 function openReceive() {
 if (!selectedTask) { toast.error("Select a task from the list first"); return; }
 if (selectedTask.status === "Cancelled" || selectedTask.status === "Completed") {
 toast.error("Cannot receive a task in its current status"); return;
 }
 setReceiveStep("scan");
 setLpnInput(selectedTask.lpn ?? "");
 setSelectedStand(selectedTask.workStand ?? null);
 setActiveFlow("receive");
 }

 function confirmLPN() {
 if (!lpnInput.trim()) { toast.error("Please scan or enter an LPN"); return; }
 setReceiveStep("stand");
 }

 function confirmStand() {
 if (!selectedStand) { toast.error("Please select a work stand"); return; }
 // Update task with LPN + stand
 setTasks(prev => prev.map(t =>
 t.id === selectedTask!.id
 ? { ...t, lpn: lpnInput.trim(), workStand: selectedStand, status: "In Progress" as WorkStatus }
 : t
 ));
 setSelectedTask(prev => prev ? { ...prev, lpn: lpnInput.trim(), workStand: selectedStand, status: "In Progress" } : null);
 toast.success("LPN & Work Stand Assigned", { description: `${lpnInput.trim()} → Stand ${selectedStand}` });
 setReceiveStep("instructions");
 }

 function submitWaste() {
 if (wasteAction === "pickup-deliver") {
 if (!selectedTask) { toast.error("Select a task first"); return; }
 setTasks(prev => prev.map(t => t.id === selectedTask.id ? { ...t, status: "In Progress" as WorkStatus } : t));
 toast.success("Pickup & Deliver Confirmed", { description: selectedTask.description });
 } else if (wasteAction === "deliver-empty") {
 if (!wasteLocation) { toast.error("Please select a delivery location"); return; }
 toast.success("Empty Container Delivery Scheduled", { description: `Deliver to ${wasteLocation}` });
 } else if (wasteAction === "pickup-full") {
 if (!wasteLocation) { toast.error("Please select a pickup location"); return; }
 toast.success("Full Carrier Pickup Scheduled", { description: `Pickup from ${wasteLocation}` });
 }
 closeFlow();
 }

 const counts = {
 inProgress: tasks.filter(t => t.status === "In Progress").length,
 queued: tasks.filter(t => t.status === "Queued").length,
 hot: tasks.filter(t => t.isHot).length,
 };

 const SortIcon = ({ field }: { field: keyof MPCTask }) => (
 <ArrowUpDown size={11} className={`inline ml-0.5 ${sortField === field ? "text-[var(--primary)] dark:text-[var(--primary)]" : "text-[var(--muted-foreground)]"}`} />
 );

 return (
 <div className="h-screen flex flex-col bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)]">

 {/* Sticky Header */}
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
 <ClipboardCheck size={20} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 MPC Operations
 </span>
 </nav>
 <button onClick={() => toast.info("Refreshed")} className="p-2 rounded-lg border-[var(--border)]  bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--surface-container-low)] dark:hover:bg-[var(--surface-container-high)] text-[var(--muted-foreground)] transition-colors" title="Refresh">
 <RefreshCw size={16} />
 </button>
 </div>
 </div>

 {/* Main Content — shifts left when panel open */}
 <div className={`flex-1 flex gap-4 px-6 pt-4 pb-6 min-h-0 overflow-hidden transition-all duration-300 ease-in-out ${activeFlow ? 'mr-[480px]' : 'mr-0'}`}>

 {/* ═══ LEFT: Active Tasks ═══ */}
 <div className="flex-1 flex flex-col min-h-0 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-xl overflow-hidden">

 {/* Toolbar */}
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
 <div className="relative ml-2">
 <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] pointer-events-none" />
 <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…"
 className="w-44 pl-7 pr-3 py-1.5 text-sm bg-[var(--surface-container-low)] dark:bg-[var(--card)] border-[var(--border)]  rounded-lg text-[var(--foreground)]  placeholder-zinc-400 focus:outline-none focus:border-[var(--primary)] dark:focus:border-[var(--primary)] transition-colors" />
 </div>
 </div>
 </div>
 </div>

 {/* Column headers */}
 <div className="grid grid-cols-[3fr_1fr_1fr_1.2fr_1.2fr] gap-2 px-4 py-2 bg-[var(--surface-container)] text-[var(--foreground)] border-b border-[var(--border)] text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wide flex-shrink-0">
 <button className="text-left hover:text-[var(--foreground)] dark:hover:text-[var(--foreground)] transition-colors flex items-center gap-1" onClick={() => toggleSort("description")}>
 Item / Work List <SortIcon field="description" />
 </button>
 <button className="text-left hover:text-[var(--foreground)] dark:hover:text-[var(--foreground)] transition-colors" onClick={() => toggleSort("priority")}>Priority <SortIcon field="priority" /></button>
 <button className="text-left hover:text-[var(--foreground)] dark:hover:text-[var(--foreground)] transition-colors" onClick={() => toggleSort("status")}>Status <SortIcon field="status" /></button>
 <button className="text-left hover:text-[var(--foreground)] dark:hover:text-[var(--foreground)] transition-colors" onClick={() => toggleSort("materialCategory")}>Inventory <SortIcon field="materialCategory" /></button>
 <button className="text-left hover:text-[var(--foreground)] dark:hover:text-[var(--foreground)] transition-colors" onClick={() => toggleSort("lpn")}>LPN <SortIcon field="lpn" /></button>
 </div>

 {/* Rows */}
 <div className="flex-1 overflow-y-auto">
 {visible.length === 0 ? (
 <div className="flex flex-col items-center justify-center h-full text-[var(--muted-foreground)] gap-3">
 <ClipboardList size={36} /><p className="text-sm">No tasks match the current filter</p>
 </div>
 ) : visible.map(task => (
 <div
 key={task.id}
 onClick={() => {
 const alreadySelected = selectedTask?.id === task.id;
 setSelectedTask(alreadySelected ? null : task);
 if (!alreadySelected && task.lpn) {
 setActiveFlow("instructions");
 } else if (alreadySelected) {
 if (activeFlow === "instructions") setActiveFlow(null);
 } else if (!task.lpn && activeFlow === "instructions") {
 setActiveFlow(null);
 }
 }}
 className={`grid grid-cols-[3fr_1fr_1fr_1.2fr_1.2fr] gap-2 px-4 py-3 border-b border-[var(--border)] /80 cursor-pointer transition-colors items-center ${
 selectedTask?.id === task.id
 ? (isV6 ? "bg-[var(--primary)]/10 ring-1 ring-inset ring-[var(--primary)]" : "bg-[var(--primary)]/6 /6 border-l-[3px] border-l-[var(--primary)] dark:border-l-[var(--primary)]")
 : "hover:bg-[var(--surface-container-lowest)] hover:bg-[var(--surface-container-high)]/40"
 } ${task.status === "Cancelled" ? "opacity-50" : ""}`}
 >
 {/* Item */}
 <div className="min-w-0">
 <div className="flex items-center gap-1.5 mb-0.5">
 {task.isHot && <Flame size={11} className="text-[var(--state-error)] flex-shrink-0" />}
 <span className="text-sm font-semibold text-[var(--foreground)]  truncate">{task.description}</span>
 {task.workStand && (
 <span className="flex-shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-[var(--primary)]/10 text-[var(--primary)] dark:text-[var(--primary)] font-medium">Stand {task.workStand}</span>
 )}
 </div>
 <div className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
 <span className="font-mono">{task.item}</span><span>·</span><span>{task.workList}</span>
 </div>
 </div>
 {/* Priority */}
 <div className="flex items-center gap-1.5">
 <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${priorityDot[task.priority]}`} />
 <span className="text-xs text-[var(--foreground)]">{task.priority}</span>
 </div>
 {/* Status */}
 <div><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge[task.status]}`}>{task.status}</span></div>
 {/* Inventory */}
 <div>
 {task.materialCategory === "Supply"
 ? <span className="px-2 py-0.5 rounded-full text-xs font-medium text-[var(--state-info)] dark:text-[var(--state-info)] bg-[var(--state-info)]/10">Inventory</span>
 : <span className="px-2 py-0.5 rounded-full text-xs font-medium text-[var(--state-on-warning-container)] dark:text-[var(--state-warning)] bg-[var(--state-warning)]/10">Non-Inventory</span>
 }
 </div>
 {/* LPN */}
 <div>
 {task.lpn
 ? <span className="text-xs font-mono font-medium text-[var(--foreground)]  bg-[var(--surface-container-low)] dark:bg-[var(--card)] px-2 py-0.5 rounded">{task.lpn}</span>
 : <span className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">—</span>
 }
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* ═══ RIGHT: Operations Panel ═══ */}
 <div className="w-72 flex flex-col gap-3 flex-shrink-0">

 {/* Selected task card */}
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
 {selectedTask.lpn && (
 <div className="mt-1 text-xs text-[var(--muted-foreground)]">
 LPN: <span className="font-mono font-medium text-[var(--foreground)]">{selectedTask.lpn}</span>
 {selectedTask.workStand && <span className="ml-2 text-[var(--primary)] dark:text-[var(--primary)] font-medium">Stand {selectedTask.workStand}</span>}
 </div>
 )}
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
 <ClipboardCheck size={15} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 </div>
 <h2 className="font-semibold text-[var(--foreground)] ">Operations</h2>
 </div>
 </div>

 <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5">

 {/* Receive */}
 <button
 onClick={openReceive}
 className={`${actionBtn} bg-[var(--primary)] hover:opacity-90 active:scale-[0.98] border-[var(--primary)] dark:border-[var(--primary)] text-[var(--primary-foreground)] `}
 >
 <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
 <Scan size={18} />
 </div>
 <div className="text-left">
 <div className="font-bold">Receive</div>
 <div className="text-xs font-normal opacity-80">Scan LPN &amp; assign work stand</div>
 </div>
 </button>

 {/* Waste / Recycling */}
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

 {/* Cancel — supply items only */}
 {selectedTask && selectedTask.materialCategory === "Supply" &&
 selectedTask.status !== "Cancelled" && selectedTask.status !== "Completed" && (
 <button
 onClick={() => setShowCancelConfirm(selectedTask)}
 className={`${actionBtn} bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--state-error)]/40 dark:border-[var(--state-error)] text-[var(--state-error)] dark:text-[var(--state-error)] hover:bg-[var(--state-error-container)] dark:hover:bg-[var(--state-error-container)]/20 hover:border-[var(--state-error)]/50 dark:hover:border-red-600 mt-1`}
 >
 <div className="w-9 h-9 bg-[var(--state-error)]/10 rounded-lg flex items-center justify-center flex-shrink-0"><X size={18} /></div>
 <div className="text-left">
 <div className="font-bold">Cancel Task</div>
 <div className="text-xs font-normal opacity-70">{selectedTask.workList}</div>
 </div>
 </button>
 )}

 {(!selectedTask || selectedTask.materialCategory === "Raw Material") && (
 <div className="mt-1 px-3 py-2.5 rounded-xl bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  text-xs text-[var(--muted-foreground)] flex items-start gap-2">
 <Info size={13} className="mt-0.5 flex-shrink-0 text-[var(--muted-foreground)]" />
 {!selectedTask ? "Select a task to enable Receive." : "Cancel is not available for raw material tasks."}
 </div>
 )}
 </div>
 </div>
 </div>
 </div>

 {/* ══════════════════════════════════════════════════════════
 MODALS & SLIDE-OUT PANEL
 ══════════════════════════════════════════════════════════ */}
 <AnimatePresence>

 {/* Cancel confirmation modal */}
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
 {(activeFlow === "instructions" && outboundStep) && (
 <button onClick={() => { setOutboundStep(false); setSelectedOutbound(null); }} className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors flex-shrink-0">
 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
 </button>
 )}
 {activeFlow === "receive" && receiveStep !== "scan" && receiveStep !== "instructions" && (
 <button
 onClick={() => setReceiveStep(receiveStep === "stand" ? "scan" : "stand")}
 className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors flex-shrink-0"
 >
 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
 </button>
 )}
 <div>
 <h2 className="text-lg font-bold">
 {activeFlow === "receive" && receiveStep === "scan" && "Receive — Scan LPN"}
 {activeFlow === "receive" && receiveStep === "stand" && "Receive — Select Work Stand"}
 {activeFlow === "receive" && receiveStep === "instructions" && "Work Instructions"}
 {activeFlow === "instructions" && !outboundStep && "Work Instructions"}
 {activeFlow === "instructions" && outboundStep && "Select Outbound Location"}
 {activeFlow === "waste" && "Waste / Recycling"}
 </h2>
 <p className="text-xs text-[var(--foreground)]/70 mt-0.5">
 {activeFlow === "receive" && receiveStep === "scan" && (selectedTask ? selectedTask.description : "No task selected")}
 {activeFlow === "receive" && receiveStep === "stand" && `LPN: ${lpnInput} — choose an empty stand`}
 {activeFlow === "receive" && receiveStep === "instructions" && `Stand ${selectedStand} · ${lpnInput}`}
 {activeFlow === "instructions" && !outboundStep && selectedTask && `${selectedTask.workList} · LPN: ${selectedTask.lpn}${selectedTask.workStand ? ` · Stand ${selectedTask.workStand}` : ""}`}
 {activeFlow === "instructions" && outboundStep && "Choose where this item should go next"}
 {activeFlow === "waste" && "Select the action to perform"}
 </p>
 </div>
 </div>
 <button onClick={closeFlow} className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors flex-shrink-0">
 <X size={18} />
 </button>
 </div>
 {/* Step indicators for Receive flow only */}
 {activeFlow === "receive" && (
 <div className="flex gap-2 mt-4">
 {[["scan", "1. Scan LPN"], ["stand", "2. Work Stand"], ["instructions", "3. Instructions"]].map(([key, label]) => (
 <div key={key} className={`flex-1 py-1 rounded text-center text-xs font-medium transition-colors ${receiveStep === key ? "bg-[var(--surface-container-lowest)] text-[var(--primary)]" : "bg-white/20 text-white/60"}`}>
 {label}
 </div>
 ))}
 </div>
 )}
 </div>

 {/* Panel body */}
 <div className="flex-1 overflow-y-auto p-6">

 {/* ── Receive Step 1: Scan LPN ── */}
 {activeFlow === "receive" && receiveStep === "scan" && (
 <div className="space-y-5">
 {!selectedTask ? (
 <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--state-warning-container)] dark:bg-[var(--state-warning-container)]/20 border border-[var(--state-warning)]/40 dark:border-[var(--state-warning)] text-[var(--state-on-warning-container)] dark:text-[var(--state-warning)]">
 <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
 <p className="text-sm">No task selected. Close this panel and select a task from the list first.</p>
 </div>
 ) : (
 <>
 {/* Task summary */}
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-xl p-4">
 <p className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wide mb-2">Receiving Task</p>
 <p className="text-sm font-semibold text-[var(--foreground)] ">{selectedTask.description}</p>
 <div className="flex items-center gap-3 mt-1.5 text-xs text-[var(--muted-foreground)]">
 <span className="font-mono">{selectedTask.item}</span>
 <span>·</span>
 <span>{selectedTask.workList}</span>
 <span>·</span>
 <span>Qty: {selectedTask.quantity}</span>
 </div>
 </div>

 {/* LPN input */}
 <div>
 <label className="block text-sm font-semibold text-[var(--foreground)] mb-2">
 Scan or Enter LPN <span className="text-[var(--state-error)]">*</span>
 </label>
 <div className="relative">
 <Scan size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] pointer-events-none" />
 <input
 type="text"
 value={lpnInput}
 onChange={e => setLpnInput(e.target.value.toUpperCase())}
 onKeyDown={e => e.key === "Enter" && lpnInput.trim() && confirmLPN()}
 placeholder="Scan barcode or type LPN…"
 autoFocus
 className="w-full pl-10 pr-4 py-3 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] dark:border-[var(--border)] rounded-xl text-[var(--foreground)]  font-mono text-sm placeholder-zinc-400 focus:outline-none focus:border-[var(--primary)] dark:focus:border-[var(--primary)] transition-colors"
 />
 </div>
 <p className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] mt-1.5">Press Enter or click Continue to proceed</p>
 </div>
 </>
 )}
 </div>
 )}

 {/* ── Receive Step 2: Select Work Stand ── */}
 {activeFlow === "receive" && receiveStep === "stand" && (
 <div className="space-y-4">
 <p className="text-sm text-[var(--muted-foreground)]">Select an available work stand. Stands already in use are shown in grey.</p>

 <div className="grid grid-cols-2 gap-3">
 {[1, 2, 3, 4].map(stand => {
 const isOccupied = occupiedStands.has(stand) && selectedTask?.workStand !== stand;
 const isSelected = selectedStand === stand;
 return (
 <button
 key={stand}
 disabled={isOccupied}
 onClick={() => setSelectedStand(isSelected ? null : stand)}
 className={`p-5 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
 isOccupied
 ? "border-[var(--border)]  bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] opacity-50 cursor-not-allowed"
 : isSelected
 ? "border-[var(--primary)] dark:border-[var(--primary)] bg-[var(--primary)]/10 /10 "
 : "border-[var(--border)]  hover:border-[var(--primary)]/50 dark:hover:border-[var(--primary)]/50 hover:bg-[var(--surface-container-lowest)] hover:bg-[var(--surface-container-high)]"
 }`}
 >
 <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isSelected ? "bg-[var(--primary)]  text-[var(--primary-foreground)]" : isOccupied ? "bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)] text-[var(--muted-foreground)]" : "bg-[var(--surface-container-low)] dark:bg-[var(--card)] text-[var(--muted-foreground)]"}`}>
 <Monitor size={22} />
 </div>
 <div className="text-center">
 <div className={`text-base font-bold ${isSelected ? "text-[var(--primary)] dark:text-[var(--primary)]" : isOccupied ? "text-[var(--muted-foreground)]" : "text-[var(--foreground)] "}`}>
 Stand {stand}
 </div>
 <div className={`text-xs mt-0.5 ${isOccupied ? "text-[var(--muted-foreground)]" : "text-[var(--state-on-success-container)] dark:text-[var(--state-success)]"}`}>
 {isOccupied ? "In Use" : "Available"}
 </div>
 </div>
 {isSelected && <CheckCircle2 size={16} className="text-[var(--primary)] dark:text-[var(--primary)]" />}
 </button>
 );
 })}
 </div>

 {availableStands.length === 0 && (
 <div className="flex items-start gap-2 p-3 rounded-xl bg-[var(--state-warning-container)] dark:bg-[var(--state-warning-container)]/20 border border-[var(--state-warning)]/40 dark:border-[var(--state-warning)] text-xs text-[var(--state-on-warning-container)] dark:text-[var(--state-warning)]">
 <AlertCircle size={13} className="mt-0.5 flex-shrink-0" />
 All work stands are currently occupied. A stand must be freed before receiving.
 </div>
 )}
 </div>
 )}

 {/* ── Receive Step 3: Work Instructions ── */}
 {activeFlow === "receive" && receiveStep === "instructions" && selectedTask && (
 <div className="space-y-5">
 {/* Confirmation summary */}
 <div className="bg-[var(--state-success-container)] dark:bg-[var(--state-success-container)]/20 border border-[var(--state-success)]/40 dark:border-[var(--state-success)] rounded-xl p-4">
 <div className="flex items-center gap-2 mb-2">
 <CheckCircle2 size={16} className="text-[var(--state-on-success-container)] dark:text-[var(--state-success)]" />
 <span className="text-sm font-semibold text-[var(--state-on-success-container)] dark:text-[var(--state-success)]">Receive Confirmed</span>
 </div>
 <div className="grid grid-cols-2 gap-2 text-xs">
 <div><span className="text-[var(--muted-foreground)]">LPN</span><br /><span className="font-mono font-semibold text-[var(--foreground)] ">{lpnInput}</span></div>
 <div><span className="text-[var(--muted-foreground)]">Work Stand</span><br /><span className="font-semibold text-[var(--primary)] dark:text-[var(--primary)]">Stand {selectedStand}</span></div>
 <div className="col-span-2"><span className="text-[var(--muted-foreground)]">Item</span><br /><span className="font-medium text-[var(--foreground)]  truncate block">{selectedTask.description}</span></div>
 </div>
 </div>

 {/* Work instructions */}
 <div>
 <div className="flex items-center gap-2 mb-3">
 <div className="w-7 h-7 bg-[var(--primary)]/20 /20 rounded-lg flex items-center justify-center">
 <BookOpen size={14} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 </div>
 <h3 className="text-sm font-bold text-[var(--foreground)]  uppercase tracking-wide">Work Instructions</h3>
 </div>
 <div className="space-y-2">
 {workInstructions[selectedTask.type].map((step, i) => (
 <div key={i} className="flex items-start gap-3 p-3 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-lg border-[var(--border)] ">
 <span className="w-6 h-6 rounded-full bg-[var(--primary)]/20 /20 text-[var(--primary)] dark:text-[var(--primary)] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
 <p className="text-sm text-[var(--foreground)]">{step}</p>
 </div>
 ))}
 </div>
 </div>
 </div>
 )}

 {/* ── View Work Instructions (task selected with LPN) ── */}
 {activeFlow === "instructions" && selectedTask && !outboundStep && (
 <div className="space-y-5">
 {/* Task + LPN summary */}
 <div className="bg-[var(--state-success-container)] dark:bg-[var(--state-success-container)]/20 border border-[var(--state-success)]/40 dark:border-[var(--state-success)] rounded-xl p-4">
 <div className="flex items-center gap-2 mb-2">
 <CheckCircle2 size={16} className="text-[var(--state-on-success-container)] dark:text-[var(--state-success)]" />
 <span className="text-sm font-semibold text-[var(--state-on-success-container)] dark:text-[var(--state-success)]">LPN Assigned</span>
 </div>
 <div className="grid grid-cols-2 gap-2 text-xs">
 <div><span className="text-[var(--muted-foreground)]">LPN</span><br /><span className="font-mono font-semibold text-[var(--foreground)] ">{selectedTask.lpn}</span></div>
 {selectedTask.workStand && (
 <div><span className="text-[var(--muted-foreground)]">Work Stand</span><br /><span className="font-semibold text-[var(--primary)] dark:text-[var(--primary)]">Stand {selectedTask.workStand}</span></div>
 )}
 <div className="col-span-2"><span className="text-[var(--muted-foreground)]">Item</span><br /><span className="font-medium text-[var(--foreground)] ">{selectedTask.description}</span></div>
 <div><span className="text-[var(--muted-foreground)]">Work List</span><br /><span className="font-mono text-[var(--foreground)]">{selectedTask.workList}</span></div>
 <div><span className="text-[var(--muted-foreground)]">Priority</span><br /><span className={`font-semibold ${selectedTask.priority === "Critical" ? "text-[var(--state-error)]" : selectedTask.priority === "High" ? "text-[var(--state-on-warning-container)]" : selectedTask.priority === "Medium" ? "text-[var(--state-on-warning-container)]" : "text-[var(--muted-foreground)]"}`}>{selectedTask.priority}</span></div>
 </div>
 </div>

 {/* Work instructions */}
 <div>
 <div className="flex items-center gap-2 mb-3">
 <div className="w-7 h-7 bg-[var(--primary)]/20 /20 rounded-lg flex items-center justify-center">
 <BookOpen size={14} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 </div>
 <h3 className="text-sm font-bold text-[var(--foreground)]  uppercase tracking-wide">Work Instructions</h3>
 <span className="text-xs text-[var(--muted-foreground)] ml-1">({selectedTask.type})</span>
 </div>
 <div className="space-y-2">
 {workInstructions[selectedTask.type].map((step, i) => (
 <div key={i} className="flex items-start gap-3 p-3 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-lg border-[var(--border)] ">
 <span className="w-6 h-6 rounded-full bg-[var(--primary)]/20 /20 text-[var(--primary)] dark:text-[var(--primary)] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
 <p className="text-sm text-[var(--foreground)]">{step}</p>
 </div>
 ))}
 </div>
 </div>
 </div>
 )}

 {/* ── Select Outbound Location ── */}
 {activeFlow === "instructions" && selectedTask && outboundStep && (
 <div className="space-y-4">
 <p className="text-sm text-[var(--muted-foreground)]">Select where this item should be moved to next.</p>

 <div className="grid grid-cols-2 gap-3">
 {outboundLocations.map(loc => {
 const isSelected = selectedOutbound === loc.id;
 const zoneColor =
 loc.zone === "Shipping" ? "text-[var(--state-info)] dark:text-[var(--state-info)] bg-[var(--state-info)]/10" :
 loc.zone === "Staging" ? "text-[var(--state-on-warning-container)] dark:text-[var(--state-warning)] bg-[var(--state-warning)]/10" :
 loc.zone === "Asset Ops" ? "text-[var(--primary)] dark:text-[var(--primary)] bg-[var(--primary)]/10" :
 "text-[var(--state-error)] dark:text-[var(--state-error)] bg-[var(--state-error)]/10";
 return (
 <button
 key={loc.id}
 onClick={() => setSelectedOutbound(isSelected ? null : loc.id)}
 className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 text-center transition-all ${
 isSelected
 ? "border-[var(--primary)] dark:border-[var(--primary)] bg-[var(--primary)]/10 /10 "
 : "border-[var(--border)]  hover:border-[var(--primary)]/50 dark:hover:border-[var(--primary)]/50 hover:bg-[var(--surface-container-lowest)] hover:bg-[var(--surface-container-high)]"
 }`}
 >
 <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${
 isSelected ? "bg-[var(--primary)]  text-[var(--primary-foreground)]" : "bg-[var(--surface-container-low)] dark:bg-[var(--card)] text-[var(--muted-foreground)]"
 }`}>
 {loc.id.replace("OB-", "")}
 </div>
 <div>
 <div className={`text-sm font-semibold leading-tight ${isSelected ? "text-[var(--primary)] dark:text-[var(--primary)]" : "text-[var(--foreground)] "}`}>
 {loc.name}
 </div>
 <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full mt-1 inline-block ${zoneColor}`}>{loc.zone}</span>
 </div>
 {isSelected && <CheckCircle2 size={14} className="text-[var(--primary)] dark:text-[var(--primary)]" />}
 </button>
 );
 })}
 </div>
 </div>
 )}

 {/* ── Waste / Recycling ── */}
 {activeFlow === "waste" && (
 <div className="space-y-3">
 {([
 { key: "deliver-empty" as WasteAction, icon: <Box size={18} />, title: "Deliver an Empty", desc: "Deliver an empty container to the waste / recycling area", color: "green" },
 { key: "pickup-full" as WasteAction, icon: <Trash2 size={18} />, title: "Pickup Full", desc: "Pick up a full waste or recycling carrier for disposal", color: "green" },
 { key: "pickup-deliver" as WasteAction, icon: <Truck size={18} />, title: "Pickup & Deliver", desc: "Pickup the selected task item and deliver it", color: "teal" },
 ]).map(opt => (
 <button key={opt.key as string} onClick={() => setWasteAction(wasteAction === opt.key ? null : opt.key)}
 className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
 wasteAction === opt.key
 ? opt.color === "teal"
 ? "border-[var(--primary)] dark:border-[var(--primary)] bg-[var(--primary)]/10 /10"
 : "border-[var(--state-success)]/40 bg-[var(--state-success-container)]/60"
 : "border-[var(--border)]  hover:border-[var(--border)] dark:hover:border-[var(--border)] hover:bg-[var(--surface-container-lowest)] hover:bg-[var(--surface-container-high)]"
 }`}
 >
 <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
 wasteAction === opt.key
 ? opt.color === "teal" ? "bg-[var(--primary)]  text-[var(--primary-foreground)]" : "bg-[var(--state-success-container)] text-[var(--state-on-success-container)]"
 : opt.color === "teal" ? "bg-[var(--primary)]/10 text-[var(--primary)] dark:text-[var(--primary)]" : "bg-[var(--state-success-container)]/60 text-[var(--state-on-success-container)] dark:text-[var(--state-success)]"
 }`}>{opt.icon}</div>
 <div className="flex-1">
 <div className="font-semibold text-[var(--foreground)] ">{opt.title}</div>
 <div className="text-sm text-[var(--muted-foreground)]">{opt.desc}</div>
 </div>
 {wasteAction === opt.key && <CheckCircle2 size={18} className={`flex-shrink-0 ${opt.color === "teal" ? "text-[var(--primary)] dark:text-[var(--primary)]" : "text-[var(--state-on-success-container)] dark:text-[var(--state-success)]"}`} />}
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
 {outboundLocations.map(l => <option key={l.id} value={l.name}>{l.name} — {l.zone}</option>)}
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
 </div>

 {/* Panel footer */}
 <div className="flex-shrink-0 border-t border-[var(--border)]  p-4 flex gap-3 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)]">
 <button onClick={closeFlow} className="flex-1 py-2.5 rounded-xl border-[var(--border)]  text-[var(--foreground)] font-medium text-sm hover:bg-[var(--surface-container-lowest)] hover:bg-[var(--surface-container-high)] transition-colors">
 {(activeFlow === "receive" && receiveStep === "instructions") || (activeFlow === "instructions" && !outboundStep) ? "Close" : "Cancel"}
 </button>

 {/* Instructions view — Mark Complete button */}
 {activeFlow === "instructions" && !outboundStep && selectedTask?.status !== "Completed" && (
 <button
 onClick={() => { setOutboundStep(true); setSelectedOutbound(null); }}
 className="flex-1 py-2.5 rounded-xl bg-[var(--primary)] hover:opacity-90 active:scale-[0.98] text-[var(--primary-foreground)] font-semibold text-sm transition-colors border border-[var(--primary)] dark:border-[var(--primary)] "
 >
 Mark Instructions Complete →
 </button>
 )}

 {/* Outbound location step — Confirm */}
 {activeFlow === "instructions" && outboundStep && (
 <button
 onClick={confirmOutbound}
 disabled={!selectedOutbound}
 className="flex-1 py-2.5 rounded-xl bg-[var(--primary)] hover:opacity-90 active:scale-[0.98] text-[var(--primary-foreground)] font-semibold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed border border-[var(--primary)] dark:border-[var(--primary)] "
 >
 Confirm Location &amp; Complete
 </button>
 )}

 {/* Receive / Waste flows */}
 {!(activeFlow === "receive" && receiveStep === "instructions") && !(activeFlow === "instructions") && (
 <button
 onClick={() => {
 if (activeFlow === "receive" && receiveStep === "scan") confirmLPN();
 else if (activeFlow === "receive" && receiveStep === "stand") confirmStand();
 else if (activeFlow === "waste") submitWaste();
 }}
 disabled={
 (activeFlow === "receive" && receiveStep === "scan" && (!selectedTask || !lpnInput.trim())) ||
 (activeFlow === "receive" && receiveStep === "stand" && !selectedStand) ||
 (activeFlow === "waste" && (!wasteAction ||
 (wasteAction === "pickup-deliver" && !selectedTask) ||
 ((wasteAction === "deliver-empty" || wasteAction === "pickup-full") && !wasteLocation)
 ))
 }
 className="flex-1 py-2.5 rounded-xl bg-[var(--primary)] hover:opacity-90 active:scale-[0.98] text-[var(--primary-foreground)] font-semibold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed border border-[var(--primary)] dark:border-[var(--primary)] "
 >
 {activeFlow === "receive" && receiveStep === "scan" && "Continue →"}
 {activeFlow === "receive" && receiveStep === "stand" && "Assign Stand →"}
 {activeFlow === "waste" && "Confirm"}
 </button>
 )}
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 );
}
