import { useState, useEffect } from "react";
import { X, Monitor, Check, Save, Grid3x3, ClipboardList, ChevronRight, ChevronDown, Search } from "lucide-react";

// Mock workstation data
const mockWorkstations = [
 { id: "WS-001", name: "Workstation 1", zone: "Zone A", status: "Available", mode: "Auto", ipAddress: "192.168.1.101", registered: "2024-01-15", currentUser: "", type: "Pick" },
 { id: "WS-002", name: "Workstation 2", zone: "Zone A", status: "In Use", mode: "Manual", ipAddress: "192.168.1.102", registered: "2024-01-16", currentUser: "John Smith", type: "Pick" },
 { id: "WS-003", name: "Workstation 3", zone: "Zone B", status: "In Use", mode: "Auto", ipAddress: "192.168.1.103", registered: "2024-01-17", currentUser: "Sarah Jones", type: "Replenishment" },
 { id: "WS-004", name: "Workstation 4", zone: "Zone B", status: "Available", mode: "Auto", ipAddress: "192.168.1.104", registered: "2024-01-18", currentUser: "", type: "Replenishment" },
 { id: "WS-005", name: "Workstation 5", zone: "Zone C", status: "Available", mode: "Manual", ipAddress: "192.168.1.105", registered: "2024-01-19", currentUser: "", type: "Inspection" },
 { id: "WS-006", name: "Workstation 6", zone: "Zone C", status: "Maintenance", mode: "Auto", ipAddress: "192.168.1.106", registered: "2024-01-20", currentUser: "Maintenance", type: "Inspection" },
 { id: "WS-007", name: "Workstation 7", zone: "Zone D", status: "Available", mode: "Auto", ipAddress: "192.168.1.107", registered: "2024-01-21", currentUser: "", type: "Pick" },
 { id: "WS-008", name: "Workstation 8", zone: "Zone D", status: "Available", mode: "Manual", ipAddress: "192.168.1.108", registered: "2024-01-22", currentUser: "", type: "Replenishment" },
 { id: "WS-009", name: "Workstation 9", zone: "Zone E", status: "In Use", mode: "Auto", ipAddress: "192.168.1.109", registered: "2024-01-23", currentUser: "Mike Davis", type: "Cycle Count" },
];

// Mock sortbar data
const mockSortbars = [
 { id: "SB-001", workstationId: "WS-001", workstationName: "Workstation 1", status: "Active", container: "CONT-A1", registrationSequence: "001", trailerType: "Type A" },
 { id: "SB-002", workstationId: "WS-001", workstationName: "Workstation 1", status: "Inactive", container: "CONT-A2", registrationSequence: "002", trailerType: "Type B" },
 { id: "SB-003", workstationId: "WS-002", workstationName: "Workstation 2", status: "Active", container: "CONT-B1", registrationSequence: "003", trailerType: "Type A" },
 { id: "SB-004", workstationId: "WS-003", workstationName: "Workstation 3", status: "Active", container: "CONT-C1", registrationSequence: "004", trailerType: "Type C" },
 { id: "SB-005", workstationId: "WS-003", workstationName: "Workstation 3", status: "Inactive", container: "CONT-C2", registrationSequence: "005", trailerType: "Type A" },
 { id: "SB-006", workstationId: "WS-004", workstationName: "Workstation 4", status: "Active", container: "CONT-D1", registrationSequence: "006", trailerType: "Type B" },
 { id: "SB-007", workstationId: "WS-005", workstationName: "Workstation 5", status: "Active", container: "CONT-E1", registrationSequence: "007", trailerType: "Type A" },
 { id: "SB-008", workstationId: "WS-007", workstationName: "Workstation 7", status: "Active", container: "CONT-F1", registrationSequence: "008", trailerType: "Type C" },
 { id: "SB-009", workstationId: "WS-007", workstationName: "Workstation 7", status: "Active", container: "CONT-F2", registrationSequence: "009", trailerType: "Type B" },
 { id: "SB-010", workstationId: "WS-008", workstationName: "Workstation 8", status: "Active", container: "CONT-G1", registrationSequence: "010", trailerType: "Type A" },
 { id: "SB-011", workstationId: "WS-009", workstationName: "Workstation 9", status: "Active", container: "CONT-H1", registrationSequence: "011", trailerType: "Type B" },
];

const mockWorkLists = [
 { id: "WL-001", name: "Pick A-Zone Morning", type: "Pick" },
 { id: "WL-002", name: "Pick B-Zone AM", type: "Pick" },
 { id: "WL-003", name: "Replen Zone A", type: "Replenishment" },
 { id: "WL-004", name: "Replen Zone B", type: "Replenishment" },
 { id: "WL-005", name: "Cycle Count Aisle 3", type: "Cycle Count" },
 { id: "WL-006", name: "Inspection Batch 1", type: "Inspection" },
];

type Mode = "assign-workstation" | "assign-worklist";

interface WorkstationsPanelProps {
 isOpen: boolean;
 onClose: () => void;
 assignedWorkstation: string | null;
 onAssignWorkstation: (workstationId: string | null) => void;
}

export function WorkstationsPanel({ isOpen, onClose, assignedWorkstation, onAssignWorkstation }: WorkstationsPanelProps) {
 const [mode, setMode] = useState<Mode>("assign-workstation");
 const [showConfirmation, setShowConfirmation] = useState(false);
 const [workstationToAssign, setWorkstationToAssign] = useState<{ id: string; name: string } | null>(null);
 const [isUnassigning, setIsUnassigning] = useState(false);

 // Assign Work List mode state
 const [selectedSortbarId, setSelectedSortbarId] = useState<string | null>(null);
 const [sortbarCollapsed, setSortbarCollapsed] = useState(false);
 const [selectedWorkListId, setSelectedWorkListId] = useState<string>("");
 const [workListSearch, setWorkListSearch] = useState("");

 // Default to assign-worklist mode if a workstation is already assigned
 useEffect(() => {
 if (isOpen) {
 setMode(assignedWorkstation ? "assign-worklist" : "assign-workstation");
 setSelectedSortbarId(null);
 setSortbarCollapsed(false);
 setSelectedWorkListId("");
 setWorkListSearch("");
 }
 }, [isOpen, assignedWorkstation]);

 const workstations = mockWorkstations.map(ws => {
 if (assignedWorkstation && ws.name === assignedWorkstation) {
 return { ...ws, status: "Unassign", currentUser: "John Doe" };
 }
 return ws;
 });

 if (!isOpen) return null;

 const selectedSortbar = mockSortbars.find(sb => sb.id === selectedSortbarId);

 return (
 <>
 {/* Backdrop */}
 <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

 {/* Slide-out Panel */}
 <div className="fixed right-0 top-0 h-full w-[900px] bg-[var(--surface-container-high)] text-[var(--foreground)] border-l border-[var(--primary)] dark:border-[var(--primary)] z-50 animate-in slide-in- duration-300 flex flex-col">

 {/* Header */}
 <div className="flex-none border-b border-[var(--border)]  p-6">
 <div className="flex items-center justify-between mb-4">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 bg-[var(--primary)]/20 /20 rounded-lg flex items-center justify-center">
 <Monitor size={20} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 </div>
 <div>
 <h3 className="text-xl font-bold text-[var(--foreground)] ">Workstations</h3>
 <p className="text-sm text-[var(--muted-foreground)]">
 {assignedWorkstation ? `Assigned: ${assignedWorkstation}` : "No workstation assigned"}
 </p>
 </div>
 </div>
 <button
 onClick={onClose}
 className="w-8 h-8 bg-[var(--surface-container)] dark:bg-[var(--card)] hover:bg-[var(--surface-container-high)] rounded-lg flex items-center justify-center transition-colors"
 >
 <X size={18} className="text-[var(--foreground)] " />
 </button>
 </div>

 {/* Mode Buttons */}
 <div className="flex gap-3">
 <button
 onClick={() => setMode("assign-workstation")}
 className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all border ${
 mode === "assign-workstation"
 ? "bg-[var(--primary)] hover:opacity-90 active:scale-[0.98] text-[var(--primary-foreground)] border-[var(--primary)] dark:border-[var(--primary)] "
 : "bg-[var(--surface-container-low)] dark:bg-[var(--card)] text-[var(--foreground)] border-[var(--border)]  hover:bg-[var(--surface-container-high)]"
 }`}
 >
 <Monitor size={16} />
 Assign Workstation
 </button>
 <button
 onClick={() => setMode("assign-worklist")}
 className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all border ${
 mode === "assign-worklist"
 ? "bg-[var(--primary)] hover:opacity-90 active:scale-[0.98] text-[var(--primary-foreground)] border-[var(--primary)] dark:border-[var(--primary)] "
 : "bg-[var(--surface-container-low)] dark:bg-[var(--card)] text-[var(--foreground)] border-[var(--border)]  hover:bg-[var(--surface-container-high)]"
 }`}
 >
 <ClipboardList size={16} />
 Assign Work List
 </button>
 </div>
 </div>

 {/* Body */}
 <div className="flex-1 overflow-y-auto p-6">

 {/* ── ASSIGN WORKSTATION MODE ── */}
 {mode === "assign-workstation" && (
 <div className="space-y-2">
 <p className="text-sm text-[var(--muted-foreground)] mb-4">
 Select an available workstation to assign this terminal to it.
 </p>
 {workstations.map(ws => {
 const isAvailable = ws.status === "Available";
 const isCurrentlyAssigned = ws.status === "Unassign";
 const isClickable = isAvailable || isCurrentlyAssigned;

 return (
 <div
 key={ws.id}
 className={`bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] border rounded-lg p-4 transition-colors ${
 isCurrentlyAssigned
 ? "border-[var(--primary)] dark:border-[var(--primary)] bg-[var(--primary)]/5 /5"
 : "border-[var(--border)] "
 } ${isClickable ? "cursor-pointer hover:bg-[var(--surface-container-low)] hover:bg-[var(--surface-container-high)]/70" : "cursor-not-allowed opacity-50"}`}
 onClick={() => {
 if (!isClickable) return;
 setWorkstationToAssign({ id: ws.id, name: ws.name });
 setIsUnassigning(isCurrentlyAssigned);
 setShowConfirmation(true);
 }}
 >
 <div className="grid grid-cols-6 gap-4 items-center">
 <div className="flex items-center gap-2">
 <Monitor size={16} className={isCurrentlyAssigned ? "text-[var(--primary)] dark:text-[var(--primary)]" : "text-[var(--muted-foreground)]"} />
 <span className="font-medium text-[var(--foreground)] ">{ws.name}</span>
 </div>
 <div>
 <span className={`px-2 py-0.5 rounded text-xs font-medium ${
 isCurrentlyAssigned ? "bg-[var(--primary)]/20 text-[var(--primary)] dark:text-[var(--primary)]" :
 ws.status === "Available" ? "bg-[var(--state-success-container)] text-[var(--state-on-success-container)] dark:text-[var(--state-success)]" :
 ws.status === "In Use" ? "bg-[var(--state-info)]/20 text-[var(--state-info)] dark:text-[var(--state-info)]" :
 "bg-[var(--state-warning)]/20 text-[var(--state-on-warning-container)] dark:text-[var(--state-warning)]"
 }`}>
 {isCurrentlyAssigned ? "Assigned" : ws.status}
 </span>
 </div>
 <div className="text-[var(--muted-foreground)] text-sm">{ws.zone}</div>
 <div className="text-[var(--muted-foreground)] text-sm">{ws.mode}</div>
 <div className="text-[var(--muted-foreground)] text-sm font-mono">{ws.ipAddress}</div>
 <div className="text-[var(--muted-foreground)] text-sm">{ws.currentUser || <span className="text-[var(--muted-foreground)]">—</span>}</div>
 </div>
 </div>
 );
 })}
 </div>
 )}

 {/* ── ASSIGN WORK LIST MODE ── */}
 {mode === "assign-worklist" && (
 <div>
 <p className="text-sm text-[var(--muted-foreground)] mb-4">
 Select a sortbar, then choose the work list to assign to it.
 </p>

 {/* Step 1 — Select Sortbar */}
 <div className="mb-6">
 <div className="flex items-center justify-between mb-3">
 <h4 className="text-sm font-semibold text-[var(--foreground)] uppercase tracking-wider flex items-center gap-2">
 <div className="w-5 h-5 rounded-full bg-[var(--primary)]  text-[var(--primary-foreground)] flex items-center justify-center text-xs font-bold">1</div>
 Select Sortbar
 {selectedSortbarId && !sortbarCollapsed && (
 <span className="text-[var(--primary)] dark:text-[var(--primary)] normal-case font-medium ml-1">
 <ChevronRight size={14} className="inline" /> {selectedSortbar?.id}
 </span>
 )}
 </h4>
 {selectedSortbarId && (
 <button
 onClick={() => setSortbarCollapsed(v => !v)}
 className="flex items-center gap-1 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] dark:hover:text-[var(--foreground)] transition-colors"
 >
 {sortbarCollapsed ? <ChevronDown size={14} /> : <ChevronDown size={14} className="rotate-180" />}
 {sortbarCollapsed ? "Change" : "Collapse"}
 </button>
 )}
 </div>

 {/* Collapsed summary */}
 {selectedSortbarId && sortbarCollapsed ? (
 <div className="border border-[var(--primary)] dark:border-[var(--primary)] rounded-lg p-3 bg-[var(--primary)]/10 /10 flex items-center gap-3">
 <Check size={16} className="text-[var(--primary)] dark:text-[var(--primary)] flex-shrink-0" />
 <Grid3x3 size={16} className="text-[var(--primary)] dark:text-[var(--primary)] flex-shrink-0" />
 <div>
 <span className="font-semibold text-[var(--foreground)] ">{selectedSortbar?.id}</span>
 <span className="text-[var(--muted-foreground)] text-sm ml-2">— {selectedSortbar?.workstationName} · {selectedSortbar?.container}</span>
 </div>
 </div>
 ) : (
 <div className="space-y-2">
 {mockSortbars.map(sb => {
 const isSelected = selectedSortbarId === sb.id;
 return (
 <div
 key={sb.id}
 className={`border rounded-lg p-3 cursor-pointer transition-colors ${
 isSelected
 ? "border-[var(--primary)] dark:border-[var(--primary)] bg-[var(--primary)]/10 /10"
 : "border-[var(--border)]  bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] hover:bg-[var(--surface-container-low)] hover:bg-[var(--surface-container-high)]/70"
 }`}
 onClick={() => {
 setSelectedSortbarId(sb.id);
 setSortbarCollapsed(true);
 setSelectedWorkListId("");
 setWorkListSearch("");
 }}
 >
 <div className="grid grid-cols-5 gap-3 items-center">
 <div className="flex items-center gap-2">
 {isSelected
 ? <Check size={14} className="text-[var(--primary)] dark:text-[var(--primary)] flex-shrink-0" />
 : <Grid3x3 size={14} className="text-[var(--muted-foreground)] flex-shrink-0" />
 }
 <span className="font-medium text-[var(--foreground)] ">{sb.id}</span>
 </div>
 <div>
 <span className={`px-2 py-0.5 rounded text-xs ${
 sb.status === "Active" ? "bg-[var(--state-success-container)] text-[var(--state-on-success-container)] dark:text-[var(--state-success)]" : "bg-[var(--state-debug)]/20 text-[var(--muted-foreground)]"
 }`}>
 {sb.status}
 </span>
 </div>
 <div className="text-[var(--muted-foreground)] text-sm">{sb.workstationName}</div>
 <div className="text-[var(--muted-foreground)] text-sm font-mono">{sb.container}</div>
 <div className="text-[var(--muted-foreground)] text-sm">{sb.trailerType}</div>
 </div>
 </div>
 );
 })}
 </div>
 )}
 </div>

 {/* Step 2 — Select Work List (shown after sortbar selected) */}
 {selectedSortbarId && (
 <div className="border-t border-[var(--border)]  pt-6">
 <h4 className="text-sm font-semibold text-[var(--foreground)] uppercase tracking-wider mb-3 flex items-center gap-2">
 <div className="w-5 h-5 rounded-full bg-[var(--primary)]  text-[var(--primary-foreground)] flex items-center justify-center text-xs font-bold">2</div>
 Select Work List
 </h4>

 {/* Search */}
 <div className="relative mb-3">
 <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] pointer-events-none" />
 <input
 type="text"
 value={workListSearch}
 onChange={e => setWorkListSearch(e.target.value)}
 placeholder="Search work lists..."
 className="w-full pl-9 pr-4 py-2 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] border border-[var(--border)]  rounded-lg text-sm text-[var(--foreground)]  placeholder-zinc-400 focus:outline-none focus:border-[var(--primary)] dark:focus:border-[var(--primary)] transition-colors"
 />
 </div>

 <div className="space-y-2 mb-6">
 {mockWorkLists
 .filter(wl =>
 !workListSearch ||
 wl.id.toLowerCase().includes(workListSearch.toLowerCase()) ||
 wl.name.toLowerCase().includes(workListSearch.toLowerCase()) ||
 wl.type.toLowerCase().includes(workListSearch.toLowerCase())
 )
 .map(wl => {
 const isSelected = selectedWorkListId === wl.id;
 return (
 <div
 key={wl.id}
 className={`border rounded-lg p-3 cursor-pointer transition-colors ${
 isSelected
 ? "border-[var(--primary)] dark:border-[var(--primary)] bg-[var(--primary)]/10 /10"
 : "border-[var(--border)]  bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] hover:bg-[var(--surface-container-low)] hover:bg-[var(--surface-container-high)]/70"
 }`}
 onClick={() => setSelectedWorkListId(wl.id)}
 >
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 {isSelected
 ? <Check size={14} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 : <ClipboardList size={14} className="text-[var(--muted-foreground)]" />
 }
 <span className="font-medium text-[var(--foreground)] ">{wl.id}</span>
 <span className="text-[var(--muted-foreground)] text-sm">— {wl.name}</span>
 </div>
 <span className="text-xs text-[var(--muted-foreground)] shrink-0">{wl.type}</span>
 </div>
 </div>
 );
 })}
 {mockWorkLists.filter(wl =>
 !workListSearch ||
 wl.id.toLowerCase().includes(workListSearch.toLowerCase()) ||
 wl.name.toLowerCase().includes(workListSearch.toLowerCase()) ||
 wl.type.toLowerCase().includes(workListSearch.toLowerCase())
 ).length === 0 && (
 <p className="text-sm text-[var(--muted-foreground)] text-center py-4">No work lists match your search.</p>
 )}
 </div>

 {selectedWorkListId && (
 <button
 onClick={() => {
 setSelectedSortbarId(null);
 setSortbarCollapsed(false);
 setSelectedWorkListId("");
 setWorkListSearch("");
 }}
 className="w-full px-4 py-3 bg-[var(--primary)] hover:opacity-90 active:scale-[0.98] text-[var(--primary-foreground)] font-semibold rounded-lg transition-all border border-[var(--primary)] dark:border-[var(--primary)] flex items-center justify-center gap-2"
 >
 <Save size={18} />
 Save Assignment — {selectedSortbar?.id} → {selectedWorkListId}
 </button>
 )}
 </div>
 )}
 </div>
 )}
 </div>
 </div>

 {/* Confirmation Modal */}
 {showConfirmation && workstationToAssign && (
 <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center">
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] p-6 rounded-xl w-96 border border-[var(--border)] ">
 <div className="flex items-center gap-3 mb-4">
 <div className="w-10 h-10 bg-[var(--primary)]/20 /20 rounded-lg flex items-center justify-center">
 <Monitor size={20} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 </div>
 <h3 className="text-xl font-bold text-[var(--foreground)] ">
 {isUnassigning ? "Unassign Workstation" : "Assign Workstation"}
 </h3>
 </div>
 <p className="text-sm text-[var(--muted-foreground)] mb-6">
 {isUnassigning ? (
 <>Do you want to unassign this terminal from <strong className="text-[var(--foreground)] ">{workstationToAssign.name}</strong>?</>
 ) : (
 <>Do you want to assign this terminal to <strong className="text-[var(--foreground)] ">{workstationToAssign.name}</strong>?</>
 )}
 </p>
 <div className="flex gap-3 justify-end">
 <button
 onClick={() => { setShowConfirmation(false); setWorkstationToAssign(null); }}
 className="px-4 py-2 bg-[var(--surface-container)] dark:bg-[var(--card)] hover:bg-[var(--surface-container-high)] text-[var(--foreground)]  font-medium rounded-lg transition-colors"
 >
 No
 </button>
 <button
 onClick={() => {
 onAssignWorkstation(isUnassigning ? null : workstationToAssign.name);
 setShowConfirmation(false);
 setWorkstationToAssign(null);
 onClose();
 }}
 className="px-4 py-2 bg-[var(--primary)]  hover:opacity-90 active:scale-[0.98] text-[var(--primary-foreground)] font-medium rounded-lg transition-colors"
 >
 Yes
 </button>
 </div>
 </div>
 </div>
 )}
 </>
 );
}
