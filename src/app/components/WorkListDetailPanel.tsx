import { X, ArrowLeft, CheckCircle2, Circle, TrendingUp, ListChecks, FileCode, Clock, Server, ChevronDown, ChevronUp, Search, Flame, AlertCircle, Inbox, Loader2, Info, AlertTriangle, Skull, Zap, Monitor, XCircle, ChevronLeft, Check } from "lucide-react";
import { useState } from "react";
import { mockWorkstations, mockSortbars } from "../data/mockWorkstations";

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
        return "text-red-500 dark:text-red-400";
      case "High":
        return "text-orange-500 dark:text-orange-400";
      case "Medium":
        return "text-yellow-500 dark:text-yellow-400";
      case "Low":
        return "text-zinc-400";
      default:
        return "text-zinc-400";
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
        return <Skull size={14} className="text-red-600 dark:text-red-400" />;
      case "ERROR":
        return <AlertCircle size={14} className="text-red-600 dark:text-red-400" />;
      case "WARN":
        return <AlertTriangle size={14} className="text-orange-500 dark:text-orange-400" />;
      case "INFO":
        return <Info size={14} className="text-blue-500 dark:text-blue-400" />;
      case "DEBUG":
        return <Circle size={10} className="text-zinc-400" />;
      default:
        return <Circle size={10} className="text-zinc-400" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "CRITICAL":
      case "ERROR":
        return "text-red-600 dark:text-red-400";
      case "WARN":
        return "text-orange-500 dark:text-orange-400";
      case "INFO":
        return "text-blue-500 dark:text-blue-400";
      case "DEBUG":
        return "text-zinc-500 dark:text-zinc-400";
      default:
        return "text-zinc-600 dark:text-zinc-400";
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

  return (
    <>
      {/* Slide-out Panel */}
      <div className="fixed right-0 top-0 h-full w-[900px] bg-white dark:bg-zinc-900 border-l border-[#0d9488] dark:border-[#50e080] shadow-2xl z-50 animate-in slide-in-from-right duration-300 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            {selectedItem && (
              <button
                onClick={handleBack}
                className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                {selectedItem ? selectedItem.workList : `${type} - ${status} (${count})`}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                {selectedItem
                  ? "Work Item Details"
                  : (section === "worklist" ? "Work Lists" : "Work Operations")
                }
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {selectedItem && (
          /* Tabs */
          <div className="flex border-b border-zinc-200 dark:border-zinc-800 px-6">
            <button
              onClick={() => setActiveTab("details")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "details"
                  ? "border-[#0d9488] dark:border-[#50e080] text-zinc-900 dark:text-white"
                  : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab("worklist")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "worklist"
                  ? "border-[#0d9488] dark:border-[#50e080] text-zinc-900 dark:text-white"
                  : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              Work List
            </button>
            <button
              onClick={() => setActiveTab("logs")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === "logs"
                  ? "border-[#0d9488] dark:border-[#50e080] text-zinc-900 dark:text-white"
                  : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              <FileCode size={16} />
              Logs
              {mockLogs.length > 0 && (
                <span className="px-1.5 py-0.5 bg-[#0d9488] dark:bg-[#50e080] text-white text-xs rounded">
                  {mockLogs.length}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                setActiveTab("actions");
                setActiveAction(null);
              }}
              className={`ml-auto px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === "actions"
                  ? "border-orange-500 text-zinc-900 dark:text-white bg-orange-500/10"
                  : "border-transparent text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 hover:bg-orange-500/5"
              }`}
            >
              <Zap size={16} />
              Actions
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {selectedItem ? (
            // Detail View with Tabs
            <>
              {activeTab === "details" && (
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-[#0d9488] dark:text-[#50e080]" />
                      Basic Information
                    </h4>
                    <div className="bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
                      <table className="w-full">
                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                          <tr>
                            <td className="px-4 py-3 text-sm font-medium text-zinc-600 dark:text-zinc-400 w-1/3">Work List</td>
                            <td className="px-4 py-3 text-sm text-zinc-900 dark:text-white">{selectedItem.workList}</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm font-medium text-zinc-600 dark:text-zinc-400">Type</td>
                            <td className="px-4 py-3 text-sm text-zinc-900 dark:text-white">{selectedItem.type}</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm font-medium text-zinc-600 dark:text-zinc-400">Status</td>
                            <td className="px-4 py-3 text-sm text-zinc-900 dark:text-white">{selectedItem.status}</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm font-medium text-zinc-600 dark:text-zinc-400">Priority</td>
                            <td className="px-4 py-3 text-sm">
                              <span className={`font-medium ${getPriorityColor(selectedItem.priority)}`}>
                                {selectedItem.priority}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm font-medium text-zinc-600 dark:text-zinc-400">Priority Date Time</td>
                            <td className="px-4 py-3 text-sm text-zinc-900 dark:text-white">{selectedItem.priorityDateTime}</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm font-medium text-zinc-600 dark:text-zinc-400">Hot Item</td>
                            <td className="px-4 py-3 text-sm text-zinc-900 dark:text-white">
                              {selectedItem.isHot ? (
                                <span className="flex items-center gap-2 text-red-500">
                                  <Flame size={14} />
                                  Yes
                                </span>
                              ) : "No"}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm font-medium text-zinc-600 dark:text-zinc-400">Attribute 1</td>
                            <td className="px-4 py-3 text-sm text-zinc-900 dark:text-white">{selectedItem.attribute1}</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm font-medium text-zinc-600 dark:text-zinc-400">Attribute 2</td>
                            <td className="px-4 py-3 text-sm text-zinc-900 dark:text-white">{selectedItem.attribute2}</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm font-medium text-zinc-600 dark:text-zinc-400">Attribute 3</td>
                            <td className="px-4 py-3 text-sm text-zinc-900 dark:text-white">{selectedItem.attribute3}</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm font-medium text-zinc-600 dark:text-zinc-400">Attribute 4</td>
                            <td className="px-4 py-3 text-sm text-zinc-900 dark:text-white">{selectedItem.attribute4}</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm font-medium text-zinc-600 dark:text-zinc-400">Attribute 5</td>
                            <td className="px-4 py-3 text-sm text-zinc-900 dark:text-white">{selectedItem.attribute5}</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm font-medium text-zinc-600 dark:text-zinc-400">Sub Type</td>
                            <td className="px-4 py-3 text-sm text-zinc-900 dark:text-white">{selectedItem.subType}</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm font-medium text-zinc-600 dark:text-zinc-400">Started</td>
                            <td className="px-4 py-3 text-sm text-zinc-900 dark:text-white">{selectedItem.started}</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm font-medium text-zinc-600 dark:text-zinc-400">Storage</td>
                            <td className="px-4 py-3 text-sm text-zinc-900 dark:text-white font-mono">{selectedItem.storage}</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm font-medium text-zinc-600 dark:text-zinc-400">Destination</td>
                            <td className="px-4 py-3 text-sm text-zinc-900 dark:text-white">{selectedItem.destination}</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm font-medium text-zinc-600 dark:text-zinc-400">Created</td>
                            <td className="px-4 py-3 text-sm text-zinc-900 dark:text-white">{selectedItem.created}</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm font-medium text-zinc-600 dark:text-zinc-400">Modified</td>
                            <td className="px-4 py-3 text-sm text-zinc-900 dark:text-white">{selectedItem.modified}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Work List Journey Section */}
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                      <TrendingUp size={16} className="text-[#0d9488] dark:text-[#50e080]" />
                      Work List Journey
                    </h4>
                    <div className="space-y-3">
                      {getJourneySteps(selectedItem.type, selectedItem.status).map((step, index) => (
                        <div
                          key={index}
                          className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                            step.completed
                              ? 'bg-green-50 dark:bg-[#50e080]/10 border-green-200 dark:border-[#50e080]/20'
                              : 'bg-zinc-50 dark:bg-zinc-800/30 border-zinc-200 dark:border-zinc-800 opacity-50'
                          }`}
                        >
                          <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                            step.completed
                              ? 'bg-green-500 dark:bg-[#50e080] border-green-500 dark:border-[#50e080]'
                              : 'bg-transparent border-zinc-300 dark:border-zinc-700'
                          }`}>
                            {step.completed ? (
                              <CheckCircle2 size={14} className="text-white" />
                            ) : (
                              <Circle size={10} className="text-zinc-400 dark:text-zinc-700" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${
                              step.completed ? 'text-zinc-900 dark:text-white' : 'text-zinc-500 dark:text-zinc-500'
                            }`}>
                              {step.label}
                            </p>
                            {step.completed && (
                              <p className="text-xs text-green-600 dark:text-[#50e080] mt-1">Completed</p>
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
                    <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                      <ListChecks size={16} className="text-[#0d9488] dark:text-[#50e080]" />
                      Work Lines
                    </h4>
                    <div className="bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-lg p-8 text-center">
                      <ListChecks size={32} className="text-zinc-400 dark:text-zinc-600 mx-auto mb-3" />
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">No work lines available for this work list</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "logs" && (
                <div className="space-y-4">
                  {/* Matching Field Indicator */}
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                      <FileCode size={14} className="text-blue-600 dark:text-blue-400" />
                      <span className="text-blue-900 dark:text-blue-100">
                        Showing log entries for{" "}
                        <span className="font-semibold">Work List ID: {selectedItem.workList}</span>
                      </span>
                    </div>
                  </div>

                  {/* Logs Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                    <input
                      type="text"
                      placeholder="Search logs..."
                      value={logsSearchTerm}
                      onChange={(e) => setLogsSearchTerm(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg pl-10 pr-3 py-2 text-sm text-zinc-900 dark:text-white placeholder-zinc-500"
                    />
                    {logsSearchTerm && (
                      <button
                        onClick={() => setLogsSearchTerm("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded transition-colors"
                      >
                        <X size={14} className="text-zinc-400" />
                      </button>
                    )}
                  </div>

                  {/* Logs Content */}
                  {filteredLogs.length === 0 ? (
                    <div className="text-center py-12">
                      <FileCode size={48} className="mx-auto text-zinc-400 mb-4" />
                      <p className="text-zinc-600 dark:text-zinc-400">
                        {logsSearchTerm ? "No matching log entries found" : "No log entries for this work list"}
                      </p>
                      {logsSearchTerm && (
                        <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-1">Try adjusting your search</p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-0">
                      {Object.entries(groupedLogs).map(([service, entries]) => (
                        <div key={service} className="border-b border-zinc-200 dark:border-zinc-800 last:border-0">
                          {/* Group Header */}
                          <div
                            className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                            onClick={() => toggleLogGroup(service)}
                          >
                            <div className="flex items-center gap-3">
                              {expandedLogGroups.has(service) ? (
                                <ChevronDown size={20} className="text-zinc-600 dark:text-zinc-400" />
                              ) : (
                                <ChevronUp size={20} className="text-zinc-600 dark:text-zinc-400" />
                              )}
                              <Server size={18} className="text-[#0d9488] dark:text-[#50e080]" />
                              <span className="font-semibold text-zinc-900 dark:text-white">{service}</span>
                              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                                ({entries.length} {entries.length === 1 ? "entry" : "entries"})
                              </span>
                            </div>
                          </div>

                          {/* Group Content */}
                          {expandedLogGroups.has(service) && (
                            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                              {entries.map((entry) => (
                                <div
                                  key={entry.id}
                                  className="p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors"
                                >
                                  {/* Entry Header */}
                                  <div className="flex items-start justify-between gap-4 mb-2">
                                    <div className="flex items-center gap-2 min-w-0 flex-1">
                                      {getLevelIcon(entry.level)}
                                      <span className={`text-xs font-semibold ${getLevelColor(entry.level)}`}>
                                        {entry.level}
                                      </span>
                                      <span className="text-xs text-zinc-500 dark:text-zinc-500">•</span>
                                      <span className="text-xs text-zinc-500 dark:text-zinc-500 font-mono">
                                        {entry.id}
                                      </span>
                                      <span className="text-xs text-zinc-500 dark:text-zinc-500">•</span>
                                      <span className="text-xs text-zinc-500 dark:text-zinc-500 truncate">
                                        {entry.logFileName}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                      <Clock size={12} className="text-zinc-400" />
                                      <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                        {new Date(entry.timestamp).toLocaleTimeString()}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Message */}
                                  <p className="text-sm text-zinc-900 dark:text-white mb-3 pl-6">
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
                      className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors group"
                    >
                      <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                      <span className="text-sm font-medium">Back to Actions</span>
                    </button>
                  )}

                  {/* Action Selection Header */}
                  {!activeAction && !showApplyChangesConfirmation && (
                    <div className="text-center py-2">
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">Select an action to perform</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {!showApplyChangesConfirmation && (
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setActiveAction("assign")}
                        className={`relative p-4 rounded-lg border-2 text-left transition-all ${
                          activeAction === "assign"
                            ? "border-[#0d9488] dark:border-[#50e080] bg-[#0d9488]/10 dark:bg-[#50e080]/10"
                            : "border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/30 hover:border-zinc-300 dark:hover:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                        }`}
                      >
                        {pendingAssignment && (
                          <div className="absolute top-2 right-2 w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
                        )}
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            activeAction === "assign" ? "bg-[#0d9488] dark:bg-[#50e080]" : "bg-zinc-300 dark:bg-zinc-700"
                          }`}>
                            <Monitor size={16} className="text-white" />
                          </div>
                          <h5 className="text-base font-semibold text-zinc-900 dark:text-white">Assign</h5>
                        </div>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400">Assign workstation</p>
                        {pendingAssignment && (
                          <p className="text-xs text-orange-500 dark:text-orange-400 mt-1">Changes pending</p>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          setActiveAction("cancel");
                          setCancelConfirmed(false);
                        }}
                        className={`relative p-4 rounded-lg border-2 text-left transition-all ${
                          activeAction === "cancel"
                            ? "border-red-500 bg-red-500/10"
                            : "border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/30 hover:border-zinc-300 dark:hover:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                        }`}
                      >
                        {pendingCancellation && (
                          <div className="absolute top-2 right-2 w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
                        )}
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            activeAction === "cancel" ? "bg-red-500" : "bg-zinc-300 dark:bg-zinc-700"
                          }`}>
                            <XCircle size={16} className="text-white" />
                          </div>
                          <h5 className="text-base font-semibold text-zinc-900 dark:text-white">Cancel</h5>
                        </div>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400">Cancel this work list</p>
                        {pendingCancellation && (
                          <p className="text-xs text-orange-500 dark:text-orange-400 mt-1">Changes pending</p>
                        )}
                      </button>
                    </div>
                  )}

                  {showApplyChangesConfirmation ? (
                    /* Apply Changes Confirmation Dialog */
                    <div className="bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 space-y-4">
                      {!applyComplete ? (
                        <>
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                              <AlertCircle size={24} className="text-orange-500 dark:text-orange-400" />
                            </div>
                            <div>
                              <h5 className="text-lg font-semibold text-zinc-900 dark:text-white">Confirm Changes</h5>
                              <p className="text-sm text-zinc-600 dark:text-zinc-400">Please review the changes that will be applied</p>
                            </div>
                          </div>

                          {/* Changes Summary */}
                          <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 space-y-4">
                            <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
                              <span className="text-sm text-zinc-600 dark:text-zinc-400">Work List:</span>
                              <span className="text-sm font-medium text-zinc-900 dark:text-white">{selectedItem.workList}</span>
                            </div>

                            {pendingAssignment && (
                              <div className="space-y-2">
                                <h6 className="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                                  <Monitor size={16} className="text-[#0d9488] dark:text-[#50e080]" />
                                  Workstation Assignment
                                </h6>
                                <div className="pl-6 space-y-2 text-sm">
                                  <div className="flex items-center justify-between">
                                    <span className="text-zinc-600 dark:text-zinc-400">Workstation:</span>
                                    <span className="text-zinc-900 dark:text-white">
                                      {mockWorkstations.find(ws => ws.id === pendingAssignment.workstation)?.name}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-zinc-600 dark:text-zinc-400">Sortbar:</span>
                                    <span className="text-zinc-900 dark:text-white">{pendingAssignment.sortbar.split('/')[1]}</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-zinc-600 dark:text-zinc-400">Container:</span>
                                    <span className="text-zinc-900 dark:text-white">
                                      {mockSortbars.find(sb => `${sb.workstationId}/${sb.id}` === pendingAssignment.sortbar)?.container}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {pendingCancellation && (
                              <div className="space-y-2">
                                <h6 className="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                                  <XCircle size={16} className="text-red-500 dark:text-red-400" />
                                  Work List Cancellation
                                </h6>
                                <div className="pl-6 space-y-2 text-sm">
                                  <div className="flex items-center justify-between">
                                    <span className="text-zinc-600 dark:text-zinc-400">Reason:</span>
                                    <span className="text-zinc-900 dark:text-white">{pendingCancellation.reason || "(No reason provided)"}</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Confirmation Buttons */}
                          <div className="flex items-center gap-3 pt-4">
                            <button
                              onClick={handleConfirmApplyChanges}
                              className="flex-1 px-6 py-3 bg-[#0d9488] dark:bg-[#50e080] hover:bg-[#0b7a70] dark:hover:bg-[#3bc76a] text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                            >
                              <Check size={18} />
                              Apply Changes
                            </button>
                            <button
                              onClick={handleCancelApplyChanges}
                              className="px-6 py-3 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-900 dark:text-white rounded-lg font-medium transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </>
                      ) : (
                        /* Success Message */
                        <div className="text-center py-8">
                          <div className="w-16 h-16 bg-[#0d9488] dark:bg-[#50e080] rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 size={32} className="text-white" />
                          </div>
                          <h5 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">Changes Applied!</h5>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            Your changes have been successfully applied to {selectedItem.workList}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      {/* Assign Workstation Section */}
                      {activeAction === "assign" && (
                        <div className="bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 space-y-4">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-[#0d9488]/20 dark:bg-[#50e080]/20 rounded-lg flex items-center justify-center">
                              <Monitor size={20} className="text-[#0d9488] dark:text-[#50e080]" />
                            </div>
                            <div>
                              <h5 className="text-lg font-semibold text-zinc-900 dark:text-white">Assign Workstation</h5>
                              <p className="text-sm text-zinc-600 dark:text-zinc-400">Select a workstation to assign this work list</p>
                            </div>
                          </div>

                          {/* Current Work Item Info */}
                          <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-700 rounded-lg p-4">
                            <h6 className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-2">SELECTED WORK ITEM</h6>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-zinc-600 dark:text-zinc-400">Work List:</span>
                                <span className="text-sm font-medium text-zinc-900 dark:text-white">{selectedItem.workList}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-zinc-600 dark:text-zinc-400">Type:</span>
                                <span className="text-sm text-zinc-900 dark:text-white">{selectedItem.type}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-zinc-600 dark:text-zinc-400">Priority:</span>
                                <span className={`text-sm font-medium ${getPriorityColor(selectedItem.priority)}`}>
                                  {selectedItem.priority}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Workstation Selection */}
                          <div>
                            <label className="block text-sm font-medium text-zinc-900 dark:text-white mb-2">
                              Select Workstation
                            </label>
                            <select
                              value={selectedWorkstation}
                              onChange={(e) => {
                                setSelectedWorkstation(e.target.value);
                                setSelectedSortbar("");
                              }}
                              className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white"
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
                              <label className="block text-sm font-medium text-zinc-900 dark:text-white mb-2">
                                Select Sortbar
                              </label>
                              <select
                                value={selectedSortbar}
                                onChange={(e) => setSelectedSortbar(e.target.value)}
                                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white"
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
                            className="w-full px-4 py-3 bg-[#0d9488] dark:bg-[#50e080] hover:bg-[#0b7a70] dark:hover:bg-[#3bc76a] disabled:bg-zinc-200 dark:disabled:bg-zinc-800 disabled:text-zinc-500 dark:disabled:text-zinc-600 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
                          >
                            {pendingAssignment ? "Update Assignment" : "Assign Workstation"}
                          </button>
                        </div>
                      )}

                      {/* Cancel Work List Section */}
                      {activeAction === "cancel" && (
                        <div className="bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 space-y-4">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                              <XCircle size={20} className="text-red-500" />
                            </div>
                            <div>
                              <h5 className="text-lg font-semibold text-zinc-900 dark:text-white">Cancel Work List</h5>
                              <p className="text-sm text-zinc-600 dark:text-zinc-400">This action will cancel the work list</p>
                            </div>
                          </div>

                          {/* Warning */}
                          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                            <p className="text-sm text-red-900 dark:text-red-100">
                              <strong>Warning:</strong> Cancelling this work list cannot be undone.
                            </p>
                          </div>

                          {/* Reason Input */}
                          <div>
                            <label className="block text-sm font-medium text-zinc-900 dark:text-white mb-2">
                              Reason for Cancellation (Optional)
                            </label>
                            <textarea
                              value={cancelReason}
                              onChange={(e) => setCancelReason(e.target.value)}
                              placeholder="Enter reason for cancelling this work list..."
                              rows={3}
                              className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white placeholder-zinc-500"
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
                            <label htmlFor="cancelConfirm" className="text-sm text-zinc-900 dark:text-white">
                              I understand that this action cannot be undone and want to proceed with cancelling work list {selectedItem.workList}
                            </label>
                          </div>

                          {/* Cancel Button */}
                          <button
                            onClick={handleCancelWorkList}
                            disabled={!cancelConfirmed}
                            className="w-full px-4 py-3 bg-red-500 hover:bg-red-600 disabled:bg-zinc-200 dark:disabled:bg-zinc-800 disabled:text-zinc-500 dark:disabled:text-zinc-600 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
                          >
                            {pendingCancellation ? "Update Cancellation" : "Cancel Work List"}
                          </button>
                        </div>
                      )}
                    </>
                  )}

                  {/* Apply Changes Button */}
                  {hasPendingChanges() && !showApplyChangesConfirmation && (
                    <div className="sticky bottom-0 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 pt-4 -mx-6 px-6 -mb-6 pb-6">
                      <button
                        onClick={handleApplyChanges}
                        className="w-full px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Zap size={18} />
                        Apply Pending Changes
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            // List View
            <>
              {items.length === 0 ? (
                <div className="flex items-center justify-center h-full text-zinc-500 dark:text-zinc-500">
                  No work lists found for this selection.
                </div>
              ) : (
                <div className="bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-zinc-200 dark:border-zinc-800">
                        <th className="text-left py-3 px-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                          ID
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                          Name
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                          Priority
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                          Priority Date Time
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                          Plan
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                          Last Event
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, index) => (
                        <tr
                          key={item.id}
                          className={`border-b border-zinc-200 dark:border-zinc-800 last:border-0 hover:bg-zinc-200 dark:hover:bg-zinc-700/50 transition-colors cursor-pointer ${
                            index % 2 === 0 ? "bg-zinc-50 dark:bg-zinc-900/30" : ""
                          }`}
                          onClick={() => handleRowClick(item)}
                        >
                          <td className="py-3 px-4">
                            <span className="text-zinc-900 dark:text-white text-sm font-medium">
                              {item.id}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-zinc-900 dark:text-white text-sm">{item.name}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`text-sm font-medium ${getPriorityColor(
                                item.priority
                              )}`}
                            >
                              {item.priority}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-zinc-700 dark:text-zinc-300 text-sm">{item.priorityDateTime}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-zinc-900 dark:text-white text-sm">{item.plan}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-zinc-700 dark:text-zinc-300 text-sm">
                              {item.lastEvent}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
