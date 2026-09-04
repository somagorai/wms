import { X, ArrowLeft, CheckCircle2, Circle, TrendingUp, ListChecks, FileCode, Clock, Server, ChevronDown, ChevronUp, Search, Flame, AlertCircle, Inbox, Loader2, Info, AlertTriangle, Skull, Zap, Monitor, XCircle, ChevronLeft, Check, List, ClipboardList } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { mockWorkstations, mockSortbars } from "../data/mockWorkstations";
import {
  MasterTableContainer,
  MasterTable,
  MasterTableHead,
  MasterTableTh,
  MasterTableBody,
  MasterTableRow,
  MasterTableCell,
} from "./tables/MasterTable";
import { DetailSidePanel, PanelSection, PanelRow } from "./panels/DetailSidePanel";


type WorkListItem = {
 id: string;
 name: string;
 workList: string;
 type: string;
 status: string;
 priority: string;
 priorityDateTime: string;
 plan: string;
 lastEvent: string;
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

type WorkListDetailPanelProps = {
 isOpen: boolean;
 onClose: () => void;
 type: string;
 status: string;
 section: "worklist" | "operations";
 count: number;
 items: Array<WorkListItem>;
};

export function WorkListDetailPanel({
 isOpen,
 onClose,
 type,
 status,
 section,
 count,
 items,
}: WorkListDetailPanelProps) {
 if (!isOpen) return null;

 const [selectedItem, setSelectedItem] = useState<WorkListItem | null>(null);
 const [activeTab, setActiveTab] = useState<"details" | "worklist" | "logs" | "actions">("details");
 const [expandedLogGroups, setExpandedLogGroups] = useState<Set<string>>(new Set(["WorkflowService", "InventoryService"]));
 const [logsSearchTerm, setLogsSearchTerm] = useState("");

 // Actions tab state
 const [activeAction, setActiveAction] = useState<"assign" | "cancel" | null>(null);
 const [selectedWorkstation, setSelectedWorkstation] = useState("");
 const [selectedSortbar, setSelectedSortbar] = useState("");
 const [cancelReason, setCancelReason] = useState("");
 const [cancelConfirmed, setCancelConfirmed] = useState(false);
 const [pendingAssignment, setPendingAssignment] = useState<{ workstation: string; sortbar: string } | null>(null);
 const [pendingCancellation, setPendingCancellation] = useState<{ reason: string } | null>(null);
 const [showApplyChangesConfirmation, setShowApplyChangesConfirmation] = useState(false);
 const [applyComplete, setApplyComplete] = useState(false);

 const getPriorityColor = (priority: string) => {
 switch (priority) {
 case "Critical":
 return "text-[var(--state-error)] dark:text-[var(--state-error)]";
 case "High":
 return "text-[var(--state-warning)] dark:text-[var(--state-warning)]";
 case "Medium":
 return "text-[var(--state-warning)] dark:text-[var(--state-warning)]";
 case "Low":
 return "text-[var(--muted-foreground)]";
 default:
 return "text-[var(--muted-foreground)]";
 }
 };

 const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "text-[var(--state-success)]";
      case "in progress":
        return "text-[var(--primary)]";
      case "warning":
      case "shorted":
        return "text-[var(--state-warning)]";
      case "cancelled":
      case "failed":
        return "text-[var(--state-error)]";
      default:
        return "text-[var(--muted-foreground)]";
    }
  };

 const handleRowClick = (item: WorkListItem) => {
 setSelectedItem(item);
 setActiveTab("details");
 };

 const handleBack = () => {
 setSelectedItem(null);
 setActiveTab("details");
 resetActionsState();
 };

 const handleClose = () => {
 setSelectedItem(null);
 setActiveTab("details");
 resetActionsState();
 onClose();
 };

 const resetActionsState = () => {
 setActiveAction(null);
 setSelectedWorkstation("");
 setSelectedSortbar("");
 setCancelReason("");
 setCancelConfirmed(false);
 setPendingAssignment(null);
 setPendingCancellation(null);
 setShowApplyChangesConfirmation(false);
 setApplyComplete(false);
 };

 const getJourneySteps = (type: string, status: string) => {
 const steps = [
 { label: "Work List Created", completed: true },
 { label: "Assigned to Workstation", completed: status !== "Queued" && status !== "Warning" },
 { label: "Work Started", completed: status === "In Progress" || status === "Completed" || status === "Shorted" },
 { label: "Work Completed", completed: status === "Completed" || status === "Shorted" },
 ];

 if (status === "Shorted") {
 steps.push({ label: "Items Shorted", completed: true });
 }

 return steps;
 };

 const toggleLogGroup = (service: string) => {
 const newExpanded = new Set(expandedLogGroups);
 if (newExpanded.has(service)) {
 newExpanded.delete(service);
 } else {
 newExpanded.add(service);
 }
 setExpandedLogGroups(newExpanded);
 };

 const getLevelIcon = (level: string) => {
 switch (level) {
 case "CRITICAL":
 return <Skull size={14} className="text-[var(--state-error)] dark:text-[var(--state-error)]" />;
 case "ERROR":
 return <AlertCircle size={14} className="text-[var(--state-error)] dark:text-[var(--state-error)]" />;
 case "WARN":
 return <AlertTriangle size={14} className="text-[var(--state-warning)] dark:text-[var(--state-warning)]" />;
 case "INFO":
 return <Info size={14} className="text-[var(--state-info)] dark:text-[var(--state-info)]" />;
 case "DEBUG":
 return <Circle size={10} className="text-[var(--muted-foreground)]" />;
 default:
 return <Circle size={10} className="text-[var(--muted-foreground)]" />;
 }
 };

 const getLevelColor = (level: string) => {
 switch (level) {
 case "CRITICAL":
 case "ERROR":
 return "text-[var(--state-error)] dark:text-[var(--state-error)]";
 case "WARN":
 return "text-[var(--state-warning)] dark:text-[var(--state-warning)]";
 case "INFO":
 return "text-[var(--state-info)] dark:text-[var(--state-info)]";
 case "DEBUG":
 return "text-[var(--muted-foreground)]";
 default:
 return "text-[var(--muted-foreground)]";
 }
 };

 // Mock log data for demonstration
 const mockLogs = selectedItem ? [
 {
 id: "LOG-001",
 level: "INFO",
 service: "WorkflowService",
 message: `Work list ${selectedItem.workList} created successfully`,
 timestamp: new Date().toISOString(),
 workListId: selectedItem.workList,
 logFileName: "workflow.log"
 },
 {
 id: "LOG-002",
 level: "INFO",
 service: "InventoryService",
 message: "Inventory check completed",
 timestamp: new Date().toISOString(),
 workListId: selectedItem.workList,
 logFileName: "inventory.log"
 }
 ] : [];

 const filteredLogs = mockLogs.filter(log =>
 !logsSearchTerm || log.message.toLowerCase().includes(logsSearchTerm.toLowerCase())
 );

 const groupedLogs = filteredLogs.reduce((acc, log) => {
 if (!acc[log.service]) {
 acc[log.service] = [];
 }
 acc[log.service].push(log);
 return acc;
 }, {} as Record<string, typeof mockLogs>);

 // Actions tab handlers
 const handleAssignWorkstation = () => {
 if (selectedWorkstation && selectedSortbar) {
 setPendingAssignment({ workstation: selectedWorkstation, sortbar: selectedSortbar });
 }
 };

 const handleCancelWorkList = () => {
 if (cancelConfirmed) {
 setPendingCancellation({ reason: cancelReason });
 }
 };

 const hasPendingChanges = () => {
 return pendingAssignment !== null || pendingCancellation !== null;
 };

 const handleApplyChanges = () => {
 setShowApplyChangesConfirmation(true);
 };

 const handleConfirmApplyChanges = () => {
 // Simulate applying changes
 setTimeout(() => {
 setApplyComplete(true);
 setTimeout(() => {
 resetActionsState();
 setActiveTab("details");
 }, 2000);
 }, 1000);
 };

 const handleCancelApplyChanges = () => {
 setShowApplyChangesConfirmation(false);
 };

 const availableWorkstations = selectedItem
 ? mockWorkstations.filter(ws => ws.status === "Available" && ws.type === selectedItem.type)
 : [];

 const availableSortbars = selectedWorkstation
 ? mockSortbars.filter(sb => sb.workstationId === selectedWorkstation && sb.status === "Active")
 : [];

  const tabs = [
    { id: "details", label: "Details", icon: <Info size={16} /> },
    { id: "worklist", label: "Work List", icon: <List size={16} /> },
    {
      id: "logs",
      label: "Logs",
      icon: <FileCode size={16} />,
      badge: mockLogs.length > 0 ? (
        <span className="px-1.5 py-0.5 bg-[var(--primary)] text-[var(--primary-foreground)] text-xs rounded">
          {mockLogs.length}
        </span>
      ) : undefined,
    },
    { id: "actions", label: "Actions", icon: <Zap size={16} />, isAction: true },
  ];

  return (
    <DetailSidePanel
      title={selectedItem ? selectedItem.workList : `${type} - ${status} (${count})`}
      subtitle={selectedItem ? `${selectedItem.type} Work Item Details` : (section === "worklist" ? "Work Lists" : "Work Operations")}
      status={selectedItem ? selectedItem.status : status}
      icon={<ClipboardList size={24} className="text-[var(--primary)]" />}
      activeTab={activeTab}
      onTabChange={(tab) => {
        setActiveTab(tab as any);
        if (tab === "actions") setActiveAction(null);
      }}
      tabs={selectedItem ? tabs : []}
      hideTabs={!selectedItem}
      widthClass="w-[900px]"
      onClose={handleClose}
    >
      {selectedItem ? (
        // Detail View with Tabs
        <>
          {activeTab === "details" && (
            <div className="space-y-6">
              {/* Work List Information Section */}
              <PanelSection title="Work List Information">
                <PanelRow label="Work List" value={selectedItem.workList} mono />
                <PanelRow label="Type" value={selectedItem.type} />
                <PanelRow
                  label="Status"
                  value={
                    <span className={`text-sm font-medium ${getStatusColor(selectedItem.status)}`}>
                      {selectedItem.status}
                    </span>
                  }
                />
                <PanelRow
                  label="Priority"
                  value={
                    <span className={`text-sm font-medium ${getPriorityColor(selectedItem.priority)}`}>
                      {selectedItem.priority}
                    </span>
                  }
                />
                <PanelRow label="Priority Date Time" value={selectedItem.priorityDateTime} mono />
                <PanelRow
                  label="Hot Item"
                  value={
                    selectedItem.isHot ? (
                      <span className="flex items-center gap-1 text-sm font-medium text-[var(--state-error)]">
                        <Flame size={14} />
                        Yes
                      </span>
                    ) : (
                      "No"
                    )
                  }
                />
                <PanelRow label="Sub Type" value={selectedItem.subType || "-"} />
                <PanelRow label="Started" value={selectedItem.started || "-"} mono />
                <PanelRow label="Storage" value={selectedItem.storage} mono />
                <PanelRow label="Destination" value={selectedItem.destination} />
              </PanelSection>

              {/* Attributes Section */}
              <PanelSection title="Attributes">
                <PanelRow label="Attribute 1" value={selectedItem.attribute1} />
                {selectedItem.attribute2 && <PanelRow label="Attribute 2" value={selectedItem.attribute2} />}
                {selectedItem.attribute3 && <PanelRow label="Attribute 3" value={selectedItem.attribute3} />}
                {selectedItem.attribute4 && <PanelRow label="Attribute 4" value={selectedItem.attribute4} />}
                {selectedItem.attribute5 && <PanelRow label="Attribute 5" value={selectedItem.attribute5} />}
              </PanelSection>

              {/* Metadata Section */}
              <PanelSection title="Metadata">
                <PanelRow label="Created" value={selectedItem.created} mono />
                <PanelRow label="Modified" value={selectedItem.modified} mono />
              </PanelSection>

                {/* Work List Journey Section */}
                <div>
                  <h4 className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-4 flex items-center gap-2">
                    <TrendingUp size={16} className="text-[var(--primary)] dark:text-[var(--primary)]" />
                    Work List Journey
                  </h4>
                  <div className="space-y-3">
                    {getJourneySteps(selectedItem.type, selectedItem.status).map((step, index) => (
                      <div
                        key={index}
                        className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                          step.completed
                            ? 'bg-[var(--state-success-container)] border-[var(--state-success)]/30 text-[var(--state-on-success-container)]'
                            : 'bg-[var(--surface-container-lowest)] dark:bg-[var(--surface-container)] border-[var(--border)]  opacity-50'
                        }`}
                      >
                        <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                          step.completed
                            ? 'bg-[var(--state-success)] text-[var(--state-success-foreground)] border-[var(--state-success)]'
                            : 'bg-transparent border-[var(--border)] '
                        }`}>
                          {step.completed ? (
                            <CheckCircle2 size={14} className="text-[var(--foreground)]" />
                          ) : (
                            <Circle size={10} className="text-[var(--muted-foreground)] " />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${
                            step.completed ? 'text-[var(--foreground)]' : 'text-[var(--muted-foreground)]'
                          }`}>
                            {step.label}
                          </p>
                          {step.completed && (
                            <p className="text-xs text-[var(--state-on-success-container)] dark:text-[var(--primary)] mt-1">Completed</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

 {activeTab === "worklist" && (
 <div className="space-y-6">
 <div>
 <h4 className="text-sm font-semibold text-[var(--foreground)]  mb-4 flex items-center gap-2">
 <ListChecks size={16} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 Work Lines
 </h4>
 <div className="bg-[var(--surface-container-low)] dark:bg-[var(--card)] border border-[var(--border)]  rounded-lg p-8 text-center">
 <ListChecks size={32} className="text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] mx-auto mb-3" />
 <p className="text-sm text-[var(--muted-foreground)]">No work lines available for this work list</p>
 </div>
 </div>
 </div>
 )}

 {activeTab === "logs" && (
 <div className="space-y-4">
 {/* Matching Field Indicator */}
 <div className="p-3 bg-[var(--state-info-container)] dark:bg-[var(--state-info-container)]/20 border border-[var(--secondary)]/30 dark:border-[var(--secondary-container)]/30 rounded-lg">
 <div className="flex items-center gap-2 text-sm">
 <FileCode size={14} className="text-[var(--state-info)] dark:text-[var(--state-info)]" />
 <span className="text-[var(--secondary)] dark:text-[var(--secondary)]">
 Showing log entries for{" "}
 <span className="font-semibold">Work List ID: {selectedItem.workList}</span>
 </span>
 </div>
 </div>

 {/* Logs Search */}
 <div className="relative">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" size={16} />
 <input
 type="text"
 placeholder="Search logs..."
 value={logsSearchTerm}
 onChange={(e) => setLogsSearchTerm(e.target.value)}
 className="w-full bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] border border-[var(--border)]  rounded-lg pl-10 pr-3 py-2 text-sm text-[var(--foreground)]  placeholder-zinc-500"
 />
 {logsSearchTerm && (
 <button
 onClick={() => setLogsSearchTerm("")}
 className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-[var(--surface-container-low)] dark:hover:bg-[var(--surface-container-high)] rounded transition-colors"
 >
 <X size={14} className="text-[var(--muted-foreground)]" />
 </button>
 )}
 </div>

 {/* Logs Content */}
 {filteredLogs.length === 0 ? (
 <div className="text-center py-12">
 <FileCode size={48} className="mx-auto text-[var(--muted-foreground)] mb-4" />
 <p className="text-[var(--muted-foreground)]">
 {logsSearchTerm ? "No matching log entries found" : "No log entries for this work list"}
 </p>
 {logsSearchTerm && (
 <p className="text-sm text-[var(--muted-foreground)] mt-1">Try adjusting your search</p>
 )}
 </div>
 ) : (
 <div className="space-y-0">
 {Object.entries(groupedLogs).map(([service, entries]) => (
 <div key={service} className="border-b border-[var(--border)]  last:border-0">
 {/* Group Header */}
 <div
 className="flex items-center justify-between p-4 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] cursor-pointer hover:bg-[var(--surface-container-low)] hover:bg-[var(--surface-container-high)] transition-colors"
 onClick={() => toggleLogGroup(service)}
 >
 <div className="flex items-center gap-3">
 {expandedLogGroups.has(service) ? (
 <ChevronDown size={20} className="text-[var(--muted-foreground)]" />
 ) : (
 <ChevronUp size={20} className="text-[var(--muted-foreground)]" />
 )}
 <Server size={18} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 <span className="font-semibold text-[var(--foreground)] ">{service}</span>
 <span className="text-sm text-[var(--muted-foreground)]">
 ({entries.length} {entries.length === 1 ? "entry" : "entries"})
 </span>
 </div>
 </div>

 {/* Group Content */}
 {expandedLogGroups.has(service) && (
 <div className="divide-y divide-[var(--border-light)]">
 {entries.map((entry) => (
 <div
 key={entry.id}
 className="p-4 hover:bg-[var(--surface-container-lowest)] hover:bg-[var(--primary)]/10 transition-colors"
 >
 {/* Entry Header */}
 <div className="flex items-start justify-between gap-4 mb-2">
 <div className="flex items-center gap-2 min-w-0 flex-1">
 {getLevelIcon(entry.level)}
 <span className={`text-xs font-semibold ${getLevelColor(entry.level)}`}>
 {entry.level}
 </span>
 <span className="text-xs text-[var(--muted-foreground)]">•</span>
 <span className="text-xs text-[var(--muted-foreground)] font-mono">
 {entry.id}
 </span>
 <span className="text-xs text-[var(--muted-foreground)]">•</span>
 <span className="text-xs text-[var(--muted-foreground)] truncate">
 {entry.logFileName}
 </span>
 </div>
 <div className="flex items-center gap-2 flex-shrink-0">
 <Clock size={12} className="text-[var(--muted-foreground)]" />
 <span className="text-xs text-[var(--muted-foreground)]">
 {new Date(entry.timestamp).toLocaleTimeString()}
 </span>
 </div>
 </div>

 {/* Message */}
 <p className="text-sm text-[var(--foreground)]  mb-3 pl-6">
 {entry.message}
 </p>
 </div>
 ))}
 </div>
 )}
 </div>
 ))}
 </div>
 )}
 </div>
 )}

 {activeTab === "actions" && (
 <div className="max-w-2xl mx-auto space-y-6">
 {/* Back Arrow - shown when an action is selected */}
 {activeAction && !showApplyChangesConfirmation && (
 <button
 onClick={() => {
 setActiveAction(null);
 setPendingAssignment(null);
 setPendingCancellation(null);
 setCancelConfirmed(false);
 setSelectedWorkstation("");
 setSelectedSortbar("");
 setCancelReason("");
 }}
 className="flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] dark:hover:text-[var(--foreground)] transition-colors group"
 >
 <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
 <span className="text-sm font-medium">Back to Actions</span>
 </button>
 )}

 {/* Action Selection Header */}
 {!activeAction && !showApplyChangesConfirmation && (
 <div className="text-center py-2">
 <p className="text-sm text-[var(--muted-foreground)]">Select an action to perform</p>
 </div>
 )}

 {/* Action Buttons */}
 {!showApplyChangesConfirmation && (
 <div className="grid grid-cols-2 gap-3">
 <button
 onClick={() => setActiveAction("assign")}
 className={`relative p-4 rounded-lg border-2 text-left transition-all ${
 activeAction === "assign"
 ? "border-[var(--primary)] dark:border-[var(--primary)] bg-[var(--primary)]/10 /10"
 : "border-[var(--border)]  bg-[var(--surface-container-lowest)] dark:bg-[var(--surface-container)] hover:border-[var(--border)] dark:hover:border-[var(--border)] hover:bg-[var(--surface-container-low)] hover:bg-[var(--surface-container-high)]"
 }`}
 >
 {pendingAssignment && (
 <div className="absolute top-2 right-2 w-3 h-3 bg-[var(--state-warning)] rounded-full animate-pulse" />
 )}
 <div className="flex items-center gap-2 mb-1">
 <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
 activeAction === "assign" ? "bg-[var(--primary)] " : "bg-[var(--surface-container-high)]"
 }`}>
 <Monitor size={16} className="text-[var(--foreground)]" />
 </div>
 <h5 className="text-base font-semibold text-[var(--foreground)] ">Assign</h5>
 </div>
 <p className="text-xs text-[var(--muted-foreground)]">Assign workstation</p>
 {pendingAssignment && (
 <p className="text-xs text-[var(--state-warning)] dark:text-[var(--state-warning)] mt-1">Changes pending</p>
 )}
 </button>

 <button
 onClick={() => {
 setActiveAction("cancel");
 setCancelConfirmed(false);
 }}
 className={`relative p-4 rounded-lg border-2 text-left transition-all ${
 activeAction === "cancel"
 ? "border-[var(--state-error)]/40 bg-[var(--state-error)]/10"
 : "border-[var(--border)]  bg-[var(--surface-container-lowest)] dark:bg-[var(--surface-container)] hover:border-[var(--border)] dark:hover:border-[var(--border)] hover:bg-[var(--surface-container-low)] hover:bg-[var(--surface-container-high)]"
 }`}
 >
 {pendingCancellation && (
 <div className="absolute top-2 right-2 w-3 h-3 bg-[var(--state-warning)] rounded-full animate-pulse" />
 )}
 <div className="flex items-center gap-2 mb-1">
 <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
 activeAction === "cancel" ? "bg-[var(--state-error)]" : "bg-[var(--surface-container-high)]"
 }`}>
 <XCircle size={16} className={activeAction === "cancel" ? "text-white" : "text-[var(--foreground)]"} />
 </div>
 <h5 className="text-base font-semibold text-[var(--foreground)] ">Cancel</h5>
 </div>
 <p className="text-xs text-[var(--muted-foreground)]">Cancel this work list</p>
 {pendingCancellation && (
 <p className="text-xs text-[var(--state-warning)] dark:text-[var(--state-warning)] mt-1">Changes pending</p>
 )}
 </button>
 </div>
 )}

 {showApplyChangesConfirmation ? (
 /* Apply Changes Confirmation Dialog */
 <div className="bg-[var(--surface-container-low)] dark:bg-[var(--card)] border border-[var(--border)]  rounded-lg p-6 space-y-4">
 {!applyComplete ? (
 <>
 <div className="flex items-center gap-3 mb-4">
 <div className="w-12 h-12 bg-[var(--state-warning)]/20 rounded-lg flex items-center justify-center">
 <AlertCircle size={24} className="text-[var(--state-warning)] dark:text-[var(--state-warning)]" />
 </div>
 <div>
 <h5 className="text-lg font-semibold text-[var(--foreground)] ">Confirm Changes</h5>
 <p className="text-sm text-[var(--muted-foreground)]">Please review the changes that will be applied</p>
 </div>
 </div>

 {/* Changes Summary */}
 <div className="bg-[var(--surface-container-lowest)] dark:bg-[var(--surface-container)] border border-[var(--border)]  rounded-lg p-4 space-y-4">
 <div className="flex items-center justify-between pb-2 border-b border-[var(--border)] ">
 <span className="text-sm text-[var(--muted-foreground)]">Work List:</span>
 <span className="text-sm font-medium text-[var(--foreground)] ">{selectedItem.workList}</span>
 </div>

 {pendingAssignment && (
 <div className="space-y-2">
 <h6 className="text-sm font-semibold text-[var(--foreground)]  flex items-center gap-2">
 <Monitor size={16} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 Workstation Assignment
 </h6>
 <div className="pl-6 space-y-2 text-sm">
 <div className="flex items-center justify-between">
 <span className="text-[var(--muted-foreground)]">Workstation:</span>
 <span className="text-[var(--foreground)] ">
 {mockWorkstations.find(ws => ws.id === pendingAssignment.workstation)?.name}
 </span>
 </div>
 <div className="flex items-center justify-between">
 <span className="text-[var(--muted-foreground)]">Sortbar:</span>
 <span className="text-[var(--foreground)] ">{pendingAssignment.sortbar.split('/')[1]}</span>
 </div>
 <div className="flex items-center justify-between">
 <span className="text-[var(--muted-foreground)]">Container:</span>
 <span className="text-[var(--foreground)] ">
 {mockSortbars.find(sb => `${sb.workstationId}/${sb.id}` === pendingAssignment.sortbar)?.container}
 </span>
 </div>
 </div>
 </div>
 )}

 {pendingCancellation && (
 <div className="space-y-2">
 <h6 className="text-sm font-semibold text-[var(--foreground)]  flex items-center gap-2">
 <XCircle size={16} className="text-[var(--state-error)] dark:text-[var(--state-error)]" />
 Work List Cancellation
 </h6>
 <div className="pl-6 space-y-2 text-sm">
 <div className="flex items-center justify-between">
 <span className="text-[var(--muted-foreground)]">Reason:</span>
 <span className="text-[var(--foreground)] ">{pendingCancellation.reason || "(No reason provided)"}</span>
 </div>
 </div>
 </div>
 )}
 </div>

 {/* Confirmation Buttons */}
 <div className="flex items-center gap-3 pt-4">
 <Button
 btnType="primary"
 size="lg"
 className="flex-1"
 onClick={handleConfirmApplyChanges}
 icon={<Check size={18} />}
 >
 Apply Changes
 </Button>
 <Button
 btnType="secondary"
 size="lg"
 onClick={handleCancelApplyChanges}
 >
 Cancel
 </Button>
 </div>
 </>
 ) : (
 /* Success Message */
 <div className="text-center py-8">
 <div className="w-16 h-16 bg-[var(--primary)]  rounded-full flex items-center justify-center mx-auto mb-4">
 <CheckCircle2 size={32} className="text-[var(--primary-foreground)]" />
 </div>
 <h5 className="text-xl font-semibold text-[var(--foreground)]  mb-2">Changes Applied!</h5>
 <p className="text-sm text-[var(--muted-foreground)]">
 Your changes have been successfully applied to {selectedItem.workList}
 </p>
 </div>
 )}
 </div>
 ) : (
 <>
 {/* Assign Workstation Section */}
 {activeAction === "assign" && (
 <div className="bg-[var(--surface-container-low)] dark:bg-[var(--card)] border border-[var(--border)]  rounded-lg p-6 space-y-4">
 <div className="flex items-center gap-3 mb-4">
 <div className="w-10 h-10 bg-[var(--primary)]/20 /20 rounded-lg flex items-center justify-center">
 <Monitor size={20} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 </div>
 <div>
 <h5 className="text-lg font-semibold text-[var(--foreground)] ">Assign Workstation</h5>
 <p className="text-sm text-[var(--muted-foreground)]">Select a workstation to assign this work list</p>
 </div>
 </div>

 {/* Current Work Item Info */}
 <div className="bg-[var(--surface-container-lowest)] dark:bg-[var(--surface-container)] border border-[var(--border)]  rounded-lg p-4">
 <h6 className="text-xs font-semibold text-[var(--muted-foreground)] mb-2">SELECTED WORK ITEM</h6>
 <div className="space-y-2">
 <div className="flex items-center justify-between">
 <span className="text-sm text-[var(--muted-foreground)]">Work List:</span>
 <span className="text-sm font-medium text-[var(--foreground)] ">{selectedItem.workList}</span>
 </div>
 <div className="flex items-center justify-between">
 <span className="text-sm text-[var(--muted-foreground)]">Type:</span>
 <span className="text-sm text-[var(--foreground)] ">{selectedItem.type}</span>
 </div>
 <div className="flex items-center justify-between">
 <span className="text-sm text-[var(--muted-foreground)]">Priority:</span>
 <span className={`text-sm font-medium ${getPriorityColor(selectedItem.priority)}`}>
 {selectedItem.priority}
 </span>
 </div>
 </div>
 </div>

 {/* Workstation Selection */}
 <div>
 <label className="block text-sm font-medium text-[var(--foreground)]  mb-2">
 Select Workstation
 </label>
 <select
 value={selectedWorkstation}
 onChange={(e) => {
 setSelectedWorkstation(e.target.value);
 setSelectedSortbar("");
 }}
 className="w-full bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] border border-[var(--border)]  rounded-lg px-3 py-2 text-sm text-[var(--foreground)] "
 >
 <option value="">-- Select Workstation --</option>
 {availableWorkstations.map((ws) => (
 <option key={ws.id} value={ws.id}>
 {ws.name} ({ws.zone})
 </option>
 ))}
 </select>
 </div>

 {/* Sortbar Selection */}
 {selectedWorkstation && (
 <div>
 <label className="block text-sm font-medium text-[var(--foreground)]  mb-2">
 Select Sortbar
 </label>
 <select
 value={selectedSortbar}
 onChange={(e) => setSelectedSortbar(e.target.value)}
 className="w-full bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] border border-[var(--border)]  rounded-lg px-3 py-2 text-sm text-[var(--foreground)] "
 >
 <option value="">-- Select Sortbar --</option>
 {availableSortbars.map((sb) => (
 <option key={sb.id} value={`${sb.workstationId}/${sb.id}`}>
 {sb.id} - {sb.container}
 </option>
 ))}
 </select>
 </div>
 )}

 {/* Assign Button */}
 <button
 onClick={handleAssignWorkstation}
 disabled={!selectedWorkstation || !selectedSortbar}
 className="w-full px-4 py-3 bg-[var(--primary)]  hover:opacity-90 active:scale-[0.98] disabled:bg-[var(--surface-container)] dark:disabled:bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] disabled:text-[var(--muted-foreground)] dark:disabled:text-[var(--muted-foreground)] text-[var(--primary-foreground)] font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
 >
 {pendingAssignment ? "Update Assignment" : "Assign Workstation"}
 </button>
 </div>
 )}

 {/* Cancel Work List Section */}
 {activeAction === "cancel" && (
 <div className="bg-[var(--surface-container-low)] dark:bg-[var(--card)] border border-[var(--border)]  rounded-lg p-6 space-y-4">
 <div className="flex items-center gap-3 mb-4">
 <div className="w-10 h-10 bg-[var(--state-error)]/20 rounded-lg flex items-center justify-center">
 <XCircle size={20} className="text-[var(--state-error)]" />
 </div>
 <div>
 <h5 className="text-lg font-semibold text-[var(--foreground)] ">Cancel Work List</h5>
 <p className="text-sm text-[var(--muted-foreground)]">This action will cancel the work list</p>
 </div>
 </div>

 {/* Warning */}
 <div className="bg-[var(--state-error-container)] dark:bg-[var(--state-error-container)]/20 border border-[var(--state-error)]/40 dark:border-[var(--state-error)] rounded-lg p-4">
 <p className="text-sm text-[var(--state-on-error-container)] dark:text-[var(--state-error)]">
 <strong>Warning:</strong> Cancelling this work list cannot be undone.
 </p>
 </div>

 {/* Reason Input */}
 <div>
 <label className="block text-sm font-medium text-[var(--foreground)]  mb-2">
 Reason for Cancellation (Optional)
 </label>
 <textarea
 value={cancelReason}
 onChange={(e) => setCancelReason(e.target.value)}
 placeholder="Enter reason for cancelling this work list..."
 rows={3}
 className="w-full bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] border border-[var(--border)]  rounded-lg px-3 py-2 text-sm text-[var(--foreground)]  placeholder-zinc-500"
 />
 </div>

 {/* Confirmation Checkbox */}
 <div className="flex items-start gap-3">
 <input
 type="checkbox"
 id="cancelConfirm"
 checked={cancelConfirmed}
 onChange={(e) => setCancelConfirmed(e.target.checked)}
 className="mt-1"
 />
 <label htmlFor="cancelConfirm" className="text-sm text-[var(--foreground)] ">
 I understand that this action cannot be undone and want to proceed with cancelling work list {selectedItem.workList}
 </label>
 </div>

 {/* Cancel Button */}
 <Button
 btnType="destructive"
 size="lg"
 className="w-full"
 disabled={!cancelConfirmed}
 onClick={handleCancelWorkList}
 icon={<XCircle size={18} />}
 >
 {pendingCancellation ? "Update Cancellation" : "Cancel Work List"}
 </Button>
 </div>
 )}
 </>
 )}

 {/* Apply Changes Button */}
 {hasPendingChanges() && !showApplyChangesConfirmation && (
 <div className="sticky bottom-0 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] border-t border-[var(--border)]  pt-4 -mx-6 px-6 -mb-6 pb-6">
 <Button
 btnType="primary"
 size="lg"
 className="w-full font-semibold shadow-xs"
 onClick={handleApplyChanges}
 icon={<Zap size={18} />}
 >
 Apply Pending Changes
 </Button>
 </div>
 )}
 </div>
 )}
 </>
 ) : (
 // List View
 <>
 {items.length === 0 ? (
 <div className="flex items-center justify-center h-full text-[var(--muted-foreground)]">
 No work lists found for this selection.
 </div>
 ) : (
 <MasterTableContainer type="panel" className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
 <MasterTable type="panel">
 <MasterTableHead type="panel">
 <tr>
 <MasterTableTh type="panel" density="compact">ID</MasterTableTh>
 <MasterTableTh type="panel" density="compact">Name</MasterTableTh>
 <MasterTableTh type="panel" density="compact">Priority</MasterTableTh>
 <MasterTableTh type="panel" density="compact">Priority Date Time</MasterTableTh>
 <MasterTableTh type="panel" density="compact">Plan</MasterTableTh>
 <MasterTableTh type="panel" density="compact">Last Event</MasterTableTh>
 </tr>
 </MasterTableHead>
 <MasterTableBody type="panel">
 {items.map((item) => (
 <MasterTableRow
 key={item.id}
 type="panel"
 clickable
 onClick={() => handleRowClick(item)}
 >
 <MasterTableCell type="panel" density="compact">
 <span className="text-[var(--foreground)] text-sm font-medium">
 {item.id}
 </span>
 </MasterTableCell>
 <MasterTableCell type="panel" density="compact">
 <span className="text-[var(--foreground)] text-sm">{item.name}</span>
 </MasterTableCell>
 <MasterTableCell type="panel" density="compact">
 <span
 className={`text-sm font-medium ${getPriorityColor(
 item.priority
 )}`}
 >
 {item.priority}
 </span>
 </MasterTableCell>
 <MasterTableCell type="panel" density="compact">
 <span className="text-[var(--foreground)] text-sm">{item.priorityDateTime}</span>
 </MasterTableCell>
 <MasterTableCell type="panel" density="compact">
 <span className="text-[var(--foreground)] text-sm">{item.plan}</span>
 </MasterTableCell>
 <MasterTableCell type="panel" density="compact">
 <span className="text-[var(--foreground)] text-sm">
 {item.lastEvent}
 </span>
 </MasterTableCell>
 </MasterTableRow>
 ))}
 </MasterTableBody>
 </MasterTable>
 </MasterTableContainer>
 )}
 </>
 )}
 </DetailSidePanel>
 );
}
