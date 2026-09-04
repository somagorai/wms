import { useState } from "react";
import { Link } from "react-router-dom";
import { Home, ChevronRight, Power, Square, AlertTriangle, CheckCircle, ChevronDown, ChevronUp, Clock, User, PlayCircle, StopCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../components/ui/table";

type PanelState = "Stopped" | "Running";

type ControlPanel = {
 id: string;
 name: string;
 area: string;
 state: PanelState;
 zone: string;
 preStartChecks: PreStartCheck[];
};

type AuditEvent = {
 id: string;
 type: "Start" | "Stop";
 timestamp: string;
 operator: string;
 panelId?: string;
 panelName?: string;
 area?: string;
};

type PreStartCheck = {
 name: string;
 status: "pass" | "fail";
 message: string;
};

export function MHEControlPanel() {
 const { user } = useAuth();
 const [controlPanels, setControlPanels] = useState<ControlPanel[]>([
 {
 id: "CP-001",
 name: "Inbound Line A",
 area: "Inbound",
 state: "Running",
 zone: "Zone 1",
 preStartChecks: [
 { name: "E-Stop Circuit", status: "pass", message: "All e-stops clear" },
 { name: "Safety Interlocks", status: "pass", message: "All interlocks satisfied" },
 ]
 },
 {
 id: "CP-002",
 name: "Inbound Line B",
 area: "Inbound",
 state: "Stopped",
 zone: "Zone 1",
 preStartChecks: [
 { name: "E-Stop Circuit", status: "pass", message: "All e-stops clear" },
 { name: "Safety Interlocks", status: "pass", message: "All interlocks satisfied" },
 ]
 },
 {
 id: "CP-003",
 name: "Sortation System",
 area: "Inbound",
 state: "Running",
 zone: "Zone 2",
 preStartChecks: [
 { name: "E-Stop Circuit", status: "pass", message: "All e-stops clear" },
 { name: "Safety Interlocks", status: "pass", message: "All interlocks satisfied" },
 ]
 },
 {
 id: "CP-004",
 name: "Outbound Conveyor A",
 area: "Outbound",
 state: "Running",
 zone: "Zone 3",
 preStartChecks: [
 { name: "E-Stop Circuit", status: "pass", message: "All e-stops clear" },
 { name: "Safety Interlocks", status: "pass", message: "All interlocks satisfied" },
 ]
 },
 {
 id: "CP-005",
 name: "Outbound Conveyor B",
 area: "Outbound",
 state: "Stopped",
 zone: "Zone 3",
 preStartChecks: [
 { name: "E-Stop Circuit", status: "pass", message: "All e-stops clear" },
 { name: "Safety Interlocks", status: "pass", message: "All interlocks satisfied" },
 ]
 },
 {
 id: "CP-006",
 name: "Palletizer Station",
 area: "Outbound",
 state: "Running",
 zone: "Zone 4",
 preStartChecks: [
 { name: "E-Stop Circuit", status: "pass", message: "All e-stops clear" },
 { name: "Safety Interlocks", status: "pass", message: "All interlocks satisfied" },
 ]
 },
 {
 id: "CP-007",
 name: "Pack Line A",
 area: "Fulfillment",
 state: "Running",
 zone: "Zone 5",
 preStartChecks: [
 { name: "E-Stop Circuit", status: "pass", message: "All e-stops clear" },
 { name: "Safety Interlocks", status: "pass", message: "All interlocks satisfied" },
 ]
 },
 {
 id: "CP-008",
 name: "Pack Line B",
 area: "Fulfillment",
 state: "Stopped",
 zone: "Zone 5",
 preStartChecks: [
 { name: "E-Stop Circuit", status: "pass", message: "All e-stops clear" },
 { name: "Safety Interlocks", status: "pass", message: "All interlocks satisfied" },
 ]
 },
 {
 id: "CP-009",
 name: "Pick Module",
 area: "Fulfillment",
 state: "Running",
 zone: "Zone 6",
 preStartChecks: [
 { name: "E-Stop Circuit", status: "pass", message: "All e-stops clear" },
 { name: "Safety Interlocks", status: "pass", message: "All interlocks satisfied" },
 ]
 },
 ]);

 const [selectedPanel, setSelectedPanel] = useState<ControlPanel | null>(null);
 const [selectedArea, setSelectedArea] = useState<string | null>(null);
 const [confirmationType, setConfirmationType] = useState<"start" | "stop" | null>(null);
 const [actionScope, setActionScope] = useState<"panel" | "area" | "all">("panel");
 const [showConfirmation, setShowConfirmation] = useState(false);
 const [showAuditPanel, setShowAuditPanel] = useState(false);
 const [expandedAreas, setExpandedAreas] = useState<Set<string>>(new Set(["Inbound", "Outbound", "Fulfillment"]));
 const [auditFilterArea, setAuditFilterArea] = useState<string>("all");
 const [auditFilterPanel, setAuditFilterPanel] = useState<string>("all");
 const [statusFilter, setStatusFilter] = useState<"all" | "Running" | "Stopped">("all");

 const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([
 { id: "1", type: "Stop", timestamp: "2024-03-16 14:32:15", operator: "John Smith", panelId: "CP-001", panelName: "Inbound Line A", area: "Inbound" },
 { id: "2", type: "Start", timestamp: "2024-03-16 13:15:42", operator: "Sarah Johnson", panelId: "CP-004", panelName: "Outbound Conveyor A", area: "Outbound" },
 { id: "3", type: "Stop", timestamp: "2024-03-16 12:48:20", operator: "Mike Davis", area: "Fulfillment" },
 { id: "4", type: "Start", timestamp: "2024-03-16 08:30:10", operator: "Emily Brown" },
 { id: "5", type: "Stop", timestamp: "2024-03-16 05:15:05", operator: "Chris Wilson", panelId: "CP-007", panelName: "Pack Line A", area: "Fulfillment" },
 ]);

 const areas = ["Inbound", "Outbound", "Fulfillment"];

 const handleStatusFilterClick = (filter: "all" | "Running" | "Stopped") => {
 if (statusFilter === filter) {
 setStatusFilter("all");
 } else {
 setStatusFilter(filter);
 }
 };

 const handlePanelAction = (panel: ControlPanel, action: "start" | "stop") => {
 const failedChecks = panel.preStartChecks.filter(check => check.status === "fail");
 if (action === "start" && failedChecks.length > 0) {
 toast.error("Start Inhibited", {
 description: `${panel.name}: ${failedChecks.map(c => c.name).join(", ")}`,
 });
 return;
 }

 setSelectedPanel(panel);
 setConfirmationType(action);
 setActionScope("panel");
 setShowConfirmation(true);
 };

 const handleAreaAction = (area: string, action: "start" | "stop") => {
 setSelectedArea(area);
 setConfirmationType(action);
 setActionScope("area");
 setShowConfirmation(true);
 };

 const handleAllAction = (action: "start" | "stop") => {
 setConfirmationType(action);
 setActionScope("all");
 setShowConfirmation(true);
 };

 const handleConfirmAction = () => {
 const timestamp = new Date().toLocaleString('en-US', {
 year: 'numeric',
 month: '2-digit',
 day: '2-digit',
 hour: '2-digit',
 minute: '2-digit',
 second: '2-digit',
 hour12: false
 }).replace(',', '');

 if (actionScope === "panel" && selectedPanel) {
 // Update single panel
 setControlPanels(panels =>
 panels.map(p =>
 p.id === selectedPanel.id
 ? { ...p, state: confirmationType === "start" ? "Running" : "Stopped" }
 : p
 )
 );

 const newEvent: AuditEvent = {
 id: Date.now().toString(),
 type: confirmationType === "start" ? "Start" : "Stop",
 timestamp,
 operator: user?.username || "Unknown",
 panelId: selectedPanel.id,
 panelName: selectedPanel.name,
 area: selectedPanel.area
 };
 setAuditEvents([newEvent, ...auditEvents.slice(0, 9)]);

 toast.success(`Panel ${confirmationType === "start" ? "Started" : "Stopped"}`, {
 description: `${selectedPanel.name} ${confirmationType === "start" ? "started" : "stopped"} successfully`,
 });
 } else if (actionScope === "area" && selectedArea) {
 // Update all panels in area
 setControlPanels(panels =>
 panels.map(p =>
 p.area === selectedArea
 ? { ...p, state: confirmationType === "start" ? "Running" : "Stopped" }
 : p
 )
 );

 const newEvent: AuditEvent = {
 id: Date.now().toString(),
 type: confirmationType === "start" ? "Start" : "Stop",
 timestamp,
 operator: user?.username || "Unknown",
 area: selectedArea
 };
 setAuditEvents([newEvent, ...auditEvents.slice(0, 9)]);

 toast.success(`Area ${confirmationType === "start" ? "Started" : "Stopped"}`, {
 description: `All panels in ${selectedArea} ${confirmationType === "start" ? "started" : "stopped"} successfully`,
 });
 } else if (actionScope === "all") {
 // Update all panels
 setControlPanels(panels =>
 panels.map(p => ({ ...p, state: confirmationType === "start" ? "Running" : "Stopped" }))
 );

 const newEvent: AuditEvent = {
 id: Date.now().toString(),
 type: confirmationType === "start" ? "Start" : "Stop",
 timestamp,
 operator: user?.username || "Unknown"
 };
 setAuditEvents([newEvent, ...auditEvents.slice(0, 9)]);

 toast.success(`All Panels ${confirmationType === "start" ? "Started" : "Stopped"}`, {
 description: `All control panels ${confirmationType === "start" ? "started" : "stopped"} successfully`,
 });
 }

 setShowConfirmation(false);
 setSelectedPanel(null);
 setSelectedArea(null);
 };

 const toggleArea = (area: string) => {
 const newExpanded = new Set(expandedAreas);
 if (newExpanded.has(area)) {
 newExpanded.delete(area);
 } else {
 newExpanded.add(area);
 }
 setExpandedAreas(newExpanded);
 };

 const getStateColor = (state: PanelState) => {
 switch (state) {
 case "Running":
 return "text-[var(--state-on-success-container)] dark:text-[var(--state-success)]";
 case "Stopped":
 return "text-[var(--state-error)] dark:text-[var(--state-error)]";
 }
 };

 const getStateBgColor = (state: PanelState) => {
 switch (state) {
 case "Running":
 return "bg-[var(--state-success-container)] dark:bg-[var(--state-on-success-container)]/30";
 case "Stopped":
 return "bg-[var(--state-error-container)] dark:bg-[var(--state-error-container)]";
 }
 };

 const getAreaStats = (area: string) => {
 const areaPanels = controlPanels.filter(p => {
 const areaMatch = p.area === area;
 const statusMatch = statusFilter === "all" || p.state === statusFilter;
 return areaMatch && statusMatch;
 });
 const running = areaPanels.filter(p => p.state === "Running").length;
 const stopped = areaPanels.filter(p => p.state === "Stopped").length;
 return { total: areaPanels.length, running, stopped };
 };

 const totalPanels = controlPanels.length;
 const totalRunning = controlPanels.filter(p => p.state === "Running").length;
 const totalStopped = controlPanels.filter(p => p.state === "Stopped").length;

 // Filter audit events
 const filteredAuditEvents = auditEvents.filter(event => {
 const areaMatch = auditFilterArea === "all" || event.area === auditFilterArea || (!event.area && !event.panelId && auditFilterArea === "all");
 const panelMatch = auditFilterPanel === "all" || event.panelId === auditFilterPanel;
 return areaMatch && panelMatch;
 });

 return (
 <div className="flex flex-col min-h-screen">
 {/* Sticky Header */}
 <div className={`sticky top-0 z-40 bg-[var(--background)]/95 backdrop-blur-md text-[var(--foreground)] border-b border-[var(--border)] px-8 pt-6 pb-4 transition-all duration-300 ${showAuditPanel ? 'mr-[480px]' : ''}`}>
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
 <Power size={20} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 MHE Control Panel
 </span>
 </nav>

        {/* Global Controls */}
        <div className="flex items-center gap-2.5">
          <Button
            tier="secondary"
            variant="outlined"
            size="default"
            startIcon={<Clock size={16} />}
            onClick={() => setShowAuditPanel(!showAuditPanel)}
            isSelected={showAuditPanel}
          >
            Audit Trail
          </Button>
          <Button
            tier="success"
            size="default"
            startIcon={<PlayCircle size={16} />}
            onClick={() => handleAllAction("start")}
          >
            Start All
          </Button>
          <Button
            tier="destructive"
            size="default"
            startIcon={<StopCircle size={16} />}
            onClick={() => handleAllAction("stop")}
          >
            Stop All
          </Button>
        </div>
      </div>
    </div>

    <div className={`flex-1 overflow-y-auto px-8 py-6 transition-all duration-300 ${showAuditPanel ? 'mr-[480px]' : ''}`}>
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <button
          onClick={() => handleStatusFilterClick("all")}
          className={`text-left bg-transparent text-[var(--foreground)] border-[var(--border)] border rounded-lg p-4 transition-all duration-200 hover:scale-105 active:scale-95 ${
            statusFilter === "all"
              ? "border-[var(--primary)]"
              : "border-[var(--border)] hover:border-[var(--primary)]/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--muted-foreground)] mb-1">Total Panels</p>
              <p className="text-2xl font-bold text-[var(--foreground)]">{totalPanels}</p>
            </div>
            <Power size={24} className="text-[var(--primary)]" />
          </div>
        </button>
        <button
          onClick={() => handleStatusFilterClick("Running")}
          className={`text-left bg-transparent text-[var(--foreground)] border-[var(--border)] border rounded-lg p-4 transition-all duration-200 hover:scale-105 active:scale-95 ${
            statusFilter === "Running"
              ? "border-[var(--state-success)]"
              : "border-[var(--border)] hover:border-[var(--state-success)]/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--muted-foreground)] mb-1">Running</p>
              <p className="text-2xl font-bold text-[var(--state-on-success-container)] dark:text-[var(--state-success)]">{totalRunning}</p>
            </div>
            <CheckCircle size={24} className="text-[var(--state-on-success-container)] dark:text-[var(--state-success)]" />
          </div>
        </button>
        <button
          onClick={() => handleStatusFilterClick("Stopped")}
          className={`text-left bg-transparent text-[var(--foreground)] border-[var(--border)] border rounded-lg p-4 transition-all duration-200 hover:scale-105 active:scale-95 ${
            statusFilter === "Stopped"
              ? "border-[var(--state-error)]"
              : "border-[var(--border)] hover:border-[var(--state-error)]/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--muted-foreground)] mb-1">Stopped</p>
              <p className="text-2xl font-bold text-[var(--state-error)]">{totalStopped}</p>
            </div>
            <Square size={24} className="text-[var(--state-error)]" />
          </div>
        </button>
      </div>

      {/* Active Filter Badge */}
      {statusFilter !== "all" && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-sm text-[var(--muted-foreground)]">Filtering by:</span>
          <span className="px-3 py-1 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-full text-sm font-medium flex items-center gap-2">
            {statusFilter}
            <button
              onClick={() => setStatusFilter("all")}
              className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
            >
              <X size={14} />
            </button>
          </span>
        </div>
      )}

      {/* Control Panels by Area */}
      <div className="space-y-6">
        {areas.map(area => {
          const stats = getAreaStats(area);
          const areaPanels = controlPanels.filter(p => {
            const areaMatch = p.area === area;
            const statusMatch = statusFilter === "all" || p.state === statusFilter;
            return areaMatch && statusMatch;
          });

          // Skip areas with no panels matching the filter
          if (areaPanels.length === 0) return null;

          return (
            <div
              key={area}
              className="bg-transparent border border-[var(--border)] rounded-xl overflow-hidden"
            >
              {/* Area Header */}
              <div className="border-b border-[var(--border)] bg-transparent px-6 py-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => toggleArea(area)}
                  className="flex items-center gap-3 flex-1 text-left group"
                >
                  {expandedAreas.has(area) ? (
                    <ChevronUp size={20} className="text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-colors" />
                  ) : (
                    <ChevronDown size={20} className="text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-colors" />
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-[var(--foreground)]">{area}</h3>
                    <p className="text-xs font-medium text-[var(--muted-foreground)] mt-0.5">
                      <span className="text-[var(--state-success)] font-semibold">{stats.running} Running</span>
                      {" • "}
                      <span className="text-[var(--state-error)] font-semibold">{stats.stopped} Stopped</span>
                    </p>
                  </div>
                </button>

                <div className="flex items-center gap-2.5">
                  <Button
                    tier="success"
                    size="sm"
                    startIcon={<PlayCircle size={15} />}
                    onClick={() => handleAreaAction(area, "start")}
                  >
                    Start Area
                  </Button>
                  <Button
                    tier="destructive"
                    size="sm"
                    startIcon={<StopCircle size={15} />}
                    onClick={() => handleAreaAction(area, "stop")}
                  >
                    Stop Area
                  </Button>
                </div>
              </div>
            </div>

            {/* Panel List Table */}
            <AnimatePresence>
              {expandedAreas.has(area) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-x-auto"
                >
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[18%]">Panel ID</TableHead>
                        <TableHead className="w-[28%]">Panel Name</TableHead>
                        <TableHead className="w-[18%]">Zone</TableHead>
                        <TableHead className="w-[18%]">Status</TableHead>
                        <TableHead align="right" className="w-[18%]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {areaPanels.map((panel) => (
                        <TableRow key={panel.id}>
                          <TableCell className="font-mono text-sm font-semibold text-[var(--foreground)]">
                            {panel.id}
                          </TableCell>
                          <TableCell className="font-medium text-sm text-[var(--foreground)]">
                            {panel.name}
                          </TableCell>
                          <TableCell className="text-sm text-[var(--muted-foreground)]">
                            {panel.zone}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {panel.state === "Running" && (
                                <CheckCircle size={15} className="text-[var(--state-success)] shrink-0" />
                              )}
                              {panel.state === "Stopped" && (
                                <Square size={15} className="text-[var(--state-error)] shrink-0" />
                              )}
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStateBgColor(
                                  panel.state
                                )} ${getStateColor(panel.state)}`}
                              >
                                {panel.state}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell align="right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                tier="success"
                                size="xs"
                                disabled={panel.state === "Running"}
                                onClick={() => handlePanelAction(panel, "start")}
                              >
                                Start
                              </Button>
                              <Button
                                tier="destructive"
                                size="xs"
                                disabled={panel.state === "Stopped"}
                                onClick={() => handlePanelAction(panel, "stop")}
                              >
                                Stop
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
 </div>

 {/* Right Side Audit Trail Panel */}
 <AnimatePresence>
 {showAuditPanel && (
 <motion.div
 initial={{ x: 480, opacity: 0 }}
 animate={{ x: 0, opacity: 1 }}
 exit={{ x: 480, opacity: 0 }}
 transition={{ duration: 0.3 }}
 className="fixed top-0 right-0 bottom-0 w-[480px] bg-[var(--surface-container-high)] text-[var(--foreground)] border-l border-[var(--border)]  flex flex-col z-40"
 >
 {/* Panel Header */}
 <div className="p-4 border-b border-[var(--border)]  bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)]">
 <div className="flex items-center justify-between mb-4">
 <div className="flex items-center gap-3">
 <Clock size={20} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 <h3 className="text-lg font-semibold text-[var(--foreground)] ">
 Audit Trail
 </h3>
 </div>
 <button
 onClick={() => setShowAuditPanel(false)}
 className="p-1 hover:bg-[var(--surface-container-high)] rounded transition-colors"
 >
 <X size={20} className="text-[var(--muted-foreground)]" />
 </button>
 </div>

 {/* Filters */}
 <div className="space-y-3">
 {/* Area Filter */}
 <div>
 <label className="block text-xs font-medium text-[var(--muted-foreground)] mb-1">
 Filter by Area
 </label>
 <select
 value={auditFilterArea}
 onChange={(e) => setAuditFilterArea(e.target.value)}
 className="w-full px-3 py-2 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg text-sm text-[var(--foreground)]  focus:outline-none focus: focus:)]"
 >
 <option value="all">All Areas</option>
 {areas.map(area => (
 <option key={area} value={area}>{area}</option>
 ))}
 </select>
 </div>

 {/* Panel Filter */}
 <div>
 <label className="block text-xs font-medium text-[var(--muted-foreground)] mb-1">
 Filter by Panel
 </label>
 <select
 value={auditFilterPanel}
 onChange={(e) => setAuditFilterPanel(e.target.value)}
 className="w-full px-3 py-2 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg text-sm text-[var(--foreground)]  focus:outline-none focus: focus:)]"
 >
 <option value="all">All Panels</option>
 {controlPanels
 .filter(p => auditFilterArea === "all" || p.area === auditFilterArea)
 .map(panel => (
 <option key={panel.id} value={panel.id}>
 {panel.name} ({panel.id})
 </option>
 ))}
 </select>
 </div>

 {/* Clear Filters */}
 {(auditFilterArea !== "all" || auditFilterPanel !== "all") && (
 <button
 onClick={() => {
 setAuditFilterArea("all");
 setAuditFilterPanel("all");
 }}
 className="w-full px-3 py-2 bg-[var(--surface-container-low)] dark:bg-[var(--card)] hover:bg-[var(--surface-container-high)] text-[var(--foreground)] rounded-lg text-sm font-medium transition-colors"
 >
 Clear Filters
 </button>
 )}
 </div>
 </div>

 {/* Events List */}
 <div className="flex-1 overflow-y-auto">
 <div className="p-4 space-y-3">
 {filteredAuditEvents.length === 0 ? (
 <div className="text-center py-8 text-[var(--muted-foreground)]">
 <Clock size={32} className="mx-auto mb-2 opacity-50" />
 <p className="text-sm">No events found</p>
 </div>
 ) : (
 filteredAuditEvents.map((event, index) => (
 <motion.div
 key={event.id}
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: index * 0.05 }}
 className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg p-4"
 >
 {/* Event Type */}
 <div className="flex items-center gap-2 mb-2">
 {event.type === "Start" ? (
 <PlayCircle size={18} className="text-[var(--state-success)] dark:text-[var(--state-success)]" />
 ) : (
 <StopCircle size={18} className="text-[var(--state-error)] dark:text-[var(--state-error)]" />
 )}
 <span className={`font-semibold ${
 event.type === "Start"
 ? "text-[var(--state-on-success-container)] dark:text-[var(--state-success)]"
 : "text-[var(--state-on-error-container)] dark:text-[var(--state-error)]"
 }`}>
 {event.type}
 </span>
 </div>

 {/* Panel/Area Info */}
 <div className="mb-2">
 {event.panelId ? (
 <div>
 <p className="font-medium text-[var(--foreground)]  text-sm">{event.panelName}</p>
 <p className="text-xs text-[var(--muted-foreground)]">{event.panelId} • {event.area}</p>
 </div>
 ) : event.area ? (
 <div>
 <p className="font-medium text-[var(--foreground)]  text-sm">{event.area} Area</p>
 <p className="text-xs text-[var(--muted-foreground)]">All panels</p>
 </div>
 ) : (
 <p className="font-medium text-[var(--foreground)]  text-sm">All Areas</p>
 )}
 </div>

 {/* Timestamp and Operator */}
 <div className="space-y-1">
 <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
 <Clock size={14} />
 <span className="font-mono">{event.timestamp}</span>
 </div>
 <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
 <User size={14} />
 <span>{event.operator}</span>
 </div>
 </div>
 </motion.div>
 ))
 )}
 </div>
 </div>

 {/* Footer */}
 <div className="p-4 border-t border-[var(--border)]  bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)]">
 <p className="text-xs text-[var(--muted-foreground)] text-center">
 Showing {filteredAuditEvents.length} of {auditEvents.length} events
 </p>
 </div>
 </motion.div>
 )}
 </AnimatePresence>

 {/* Unified Confirmation Dialog */}
 <AnimatePresence>
 {showConfirmation && confirmationType && (
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
 onClick={() => setShowConfirmation(false)}
 >
 <motion.div
 initial={{ scale: 0.9, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 exit={{ scale: 0.9, opacity: 0 }}
 onClick={(e) => e.stopPropagation()}
 className={`bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-2 rounded-xl max-w-2xl w-full overflow-hidden ${
 confirmationType === "start"
 ? "border-emerald-500 dark:border-[var(--state-success)]/50"
 : "border-[var(--state-error)]/40 dark:border-[var(--state-error)]/50"
 }`}
 >
 {/* Header */}
 <div className={`p-6 text-white ${
 confirmationType === "start"
 ? "bg-[var(--state-success)] dark:bg-[var(--state-success)]"
 : "bg-[var(--state-error)] dark:bg-[var(--state-error)]"
 }`}>
 <div className="flex items-center gap-3">
 <AlertTriangle size={24} />
 <div>
 <h2 className="text-xl font-bold">
 Confirm {confirmationType === "start" ? "Start" : "Stop"}
 </h2>
 <p className={confirmationType === "start" ? "text-[var(--state-success-container)] dark:text-[var(--state-on-success-container)]" : "text-[var(--state-error-container)] dark:text-[var(--state-on-error-container)]"}>
 {actionScope === "panel" && selectedPanel && `${selectedPanel.name}`}
 {actionScope === "area" && selectedArea && `${selectedArea} Area - All Panels`}
 {actionScope === "all" && "All Control Panels"}
 </p>
 </div>
 </div>
 </div>

 {/* Content */}
 <div className="p-6">
 <div className="bg-[var(--state-warning-container)] dark:bg-[var(--state-warning-container)]/20 border border-[var(--state-warning)]/40 dark:border-[var(--state-warning)] rounded-lg p-4 mb-6">
 <p className="text-sm text-[var(--state-on-warning-container)] dark:text-[var(--state-warning)] mb-2">
 <strong>Warning:</strong> This action will {confirmationType === "start" ? "start" : "stop"}{" "}
 {actionScope === "panel" ? "the selected panel" : actionScope === "area" ? "all panels in the selected area" : "all control panels"}.
 </p>
 {confirmationType === "stop" && (
 <ul className="text-sm text-[var(--state-on-warning-container)] dark:text-[var(--state-warning)] list-disc list-inside space-y-1 mt-2">
 <li>Material handling operations will cease</li>
 <li>Active work will be paused</li>
 <li>Equipment will come to a controlled stop</li>
 </ul>
 )}
 </div>

 {confirmationType === "stop" && (
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-lg p-4 mb-6">
 <p className="text-sm text-[var(--foreground)] ">
 <strong>Note:</strong> For immediate emergency stop, use the physical e-stop buttons.
 </p>
 </div>
 )}

 {/* Action Buttons */}
 <div className="flex gap-3">
 <button
 onClick={() => setShowConfirmation(false)}
 className="flex-1 px-4 py-3 bg-[var(--surface-container)] dark:bg-[var(--card)] hover:bg-[var(--surface-container-high)] text-[var(--foreground)]  rounded-lg font-semibold transition-colors"
 >
 Cancel
 </button>
 <button
 onClick={handleConfirmAction}
 className={`flex-1 px-4 py-3 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
 confirmationType === "start"
 ? "bg-[var(--state-success)] hover:bg-[var(--state-success)]"
 : "bg-[var(--state-error)] hover:bg-[var(--state-error)]"
 }`}
 >
 {confirmationType === "start" ? (
 <>
 <PlayCircle size={18} />
 Confirm Start
 </>
 ) : (
 <>
 <StopCircle size={18} />
 Confirm Stop
 </>
 )}
 </button>
 </div>
 </div>
 </motion.div>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 );
}
