import { useState } from "react";
import { Link } from "react-router-dom";
import { Home, ChevronRight, Power, Square, AlertTriangle, CheckCircle, ChevronDown, ChevronUp, Clock, User, PlayCircle, StopCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";

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
        return "text-emerald-600 dark:text-emerald-400";
      case "Stopped":
        return "text-red-600 dark:text-red-400";
    }
  };

  const getStateBgColor = (state: PanelState) => {
    switch (state) {
      case "Running":
        return "bg-emerald-100 dark:bg-emerald-900/30";
      case "Stopped":
        return "bg-red-100 dark:bg-red-900/30";
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
    <div className="p-8 min-h-screen">
      {/* Sticky Header Section */}
      <div className={`sticky top-0 z-30 bg-white dark:bg-zinc-900 pb-6 -mt-8 pt-8 -mx-8 px-8 mb-6 transition-all duration-300 ${showAuditPanel ? 'mr-[480px]' : ''}`}>
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex items-center gap-2 text-sm">
            <Link
              to="/app/home"
              className="text-zinc-600 dark:text-zinc-400 hover:text-[#0d9488] dark:hover:text-[#50e080] transition-colors flex items-center gap-1"
            >
              <Home size={16} />
              Home
            </Link>
            <ChevronRight size={16} className="text-zinc-400 dark:text-zinc-600" />
            <span className="text-zinc-900 dark:text-white font-medium">MHE Control Panel</span>
          </nav>
        </div>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#0d9488] dark:bg-[#50e080] rounded-xl flex items-center justify-center">
                <Power size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
                  MHE Control Panel
                </h1>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Material Handling Equipment Operations
                </p>
              </div>
            </div>

            {/* Global Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAuditPanel(!showAuditPanel)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  showAuditPanel
                    ? "bg-[#0d9488] dark:bg-[#50e080] text-white"
                    : "bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white hover:bg-zinc-300 dark:hover:bg-zinc-700"
                }`}
              >
                <Clock size={18} />
                Audit Trail
              </button>
              <button
                onClick={() => handleAllAction("start")}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <PlayCircle size={18} />
                Start All
              </button>
              <button
                onClick={() => handleAllAction("stop")}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <StopCircle size={18} />
                Stop All
              </button>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => handleStatusFilterClick("all")}
            className={`text-left bg-white dark:bg-zinc-900 border rounded-lg p-4 transition-all duration-200 hover:scale-105 active:scale-95 ${
              statusFilter === "all"
                ? "border-[#0d9488] dark:border-[#50e080] ring-2 ring-[#0d9488]/30 dark:ring-[#50e080]/30 shadow-lg"
                : "border-zinc-200 dark:border-zinc-800 hover:border-[#0d9488]/50 dark:hover:border-[#50e080]/50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Total Panels</p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-white">{totalPanels}</p>
              </div>
              <Power size={24} className="text-[#0d9488] dark:text-[#50e080]" />
            </div>
          </button>
          <button
            onClick={() => handleStatusFilterClick("Running")}
            className={`text-left bg-white dark:bg-zinc-900 border rounded-lg p-4 transition-all duration-200 hover:scale-105 active:scale-95 ${
              statusFilter === "Running"
                ? "border-emerald-500 ring-2 ring-emerald-500/30 shadow-lg"
                : "border-emerald-500/20 hover:border-emerald-500/50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Running</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{totalRunning}</p>
              </div>
              <CheckCircle size={24} className="text-emerald-600 dark:text-emerald-400" />
            </div>
          </button>
          <button
            onClick={() => handleStatusFilterClick("Stopped")}
            className={`text-left bg-white dark:bg-zinc-900 border rounded-lg p-4 transition-all duration-200 hover:scale-105 active:scale-95 ${
              statusFilter === "Stopped"
                ? "border-red-500 ring-2 ring-red-500/30 shadow-lg"
                : "border-red-500/20 hover:border-red-500/50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Stopped</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{totalStopped}</p>
              </div>
              <Square size={24} className="text-red-600 dark:text-red-400" />
            </div>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`transition-all duration-300 ${showAuditPanel ? 'mr-[480px]' : ''}`}>
        {/* Active Filter Badge */}
        {statusFilter !== "all" && (
          <div className="mb-4 flex items-center gap-2">
            <span className="text-sm text-zinc-600 dark:text-zinc-400">Filtering by:</span>
            <span className="px-3 py-1 bg-[#0d9488] dark:bg-[#50e080] text-white rounded-full text-sm font-medium flex items-center gap-2">
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
            <div key={area} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
              {/* Area Header */}
              <div className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 p-4">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => toggleArea(area)}
                    className="flex items-center gap-3 flex-1 text-left"
                  >
                    {expandedAreas.has(area) ? (
                      <ChevronUp size={20} className="text-zinc-600 dark:text-zinc-400" />
                    ) : (
                      <ChevronDown size={20} className="text-zinc-600 dark:text-zinc-400" />
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{area}</h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {stats.running} Running • {stats.stopped} Stopped
                      </p>
                    </div>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAreaAction(area, "start")}
                      className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5"
                    >
                      <PlayCircle size={16} />
                      Start Area
                    </button>
                    <button
                      onClick={() => handleAreaAction(area, "stop")}
                      className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5"
                    >
                      <StopCircle size={16} />
                      Stop Area
                    </button>
                  </div>
                </div>
              </div>

              {/* Panel List */}
              <AnimatePresence>
                {expandedAreas.has(area) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <table className="w-full">
                      <thead className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
                        <tr>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase">Panel ID</th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase">Panel Name</th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase">Zone</th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase">Status</th>
                          <th className="text-right py-3 px-4 text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                        {areaPanels.map(panel => (
                          <tr key={panel.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                            <td className="py-3 px-4">
                              <span className="font-mono text-sm text-zinc-900 dark:text-white">{panel.id}</span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-medium text-zinc-900 dark:text-white">{panel.name}</span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-sm text-zinc-600 dark:text-zinc-400">{panel.zone}</span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                {panel.state === "Running" && <CheckCircle size={16} className="text-emerald-500" />}
                                {panel.state === "Stopped" && <Square size={16} className="text-red-500" />}
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStateBgColor(panel.state)} ${getStateColor(panel.state)}`}>
                                  {panel.state}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handlePanelAction(panel, "start")}
                                  disabled={panel.state === "Running"}
                                  className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
                                >
                                  Start
                                </button>
                                <button
                                  onClick={() => handlePanelAction(panel, "stop")}
                                  disabled={panel.state === "Stopped"}
                                  className="px-3 py-1.5 bg-red-500 hover:bg-red-600 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
                                >
                                  Stop
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
              className="fixed top-0 right-0 bottom-0 w-[480px] bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col z-40"
            >
              {/* Panel Header */}
              <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Clock size={20} className="text-[#0d9488] dark:text-[#50e080]" />
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                      Audit Trail
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowAuditPanel(false)}
                    className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded transition-colors"
                  >
                    <X size={20} className="text-zinc-600 dark:text-zinc-400" />
                  </button>
                </div>

                {/* Filters */}
                <div className="space-y-3">
                  {/* Area Filter */}
                  <div>
                    <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                      Filter by Area
                    </label>
                    <select
                      value={auditFilterArea}
                      onChange={(e) => setAuditFilterArea(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
                    >
                      <option value="all">All Areas</option>
                      {areas.map(area => (
                        <option key={area} value={area}>{area}</option>
                      ))}
                    </select>
                  </div>

                  {/* Panel Filter */}
                  <div>
                    <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                      Filter by Panel
                    </label>
                    <select
                      value={auditFilterPanel}
                      onChange={(e) => setAuditFilterPanel(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
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
                      className="w-full px-3 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg text-sm font-medium transition-colors"
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
                    <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
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
                        className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-lg p-4"
                      >
                        {/* Event Type */}
                        <div className="flex items-center gap-2 mb-2">
                          {event.type === "Start" ? (
                            <PlayCircle size={18} className="text-emerald-500 dark:text-emerald-400" />
                          ) : (
                            <StopCircle size={18} className="text-red-500 dark:text-red-400" />
                          )}
                          <span className={`font-semibold ${
                            event.type === "Start"
                              ? "text-emerald-700 dark:text-emerald-300"
                              : "text-red-700 dark:text-red-300"
                          }`}>
                            {event.type}
                          </span>
                        </div>

                        {/* Panel/Area Info */}
                        <div className="mb-2">
                          {event.panelId ? (
                            <div>
                              <p className="font-medium text-zinc-900 dark:text-white text-sm">{event.panelName}</p>
                              <p className="text-xs text-zinc-500 dark:text-zinc-400">{event.panelId} • {event.area}</p>
                            </div>
                          ) : event.area ? (
                            <div>
                              <p className="font-medium text-zinc-900 dark:text-white text-sm">{event.area} Area</p>
                              <p className="text-xs text-zinc-500 dark:text-zinc-400">All panels</p>
                            </div>
                          ) : (
                            <p className="font-medium text-zinc-900 dark:text-white text-sm">All Areas</p>
                          )}
                        </div>

                        {/* Timestamp and Operator */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                            <Clock size={14} />
                            <span className="font-mono">{event.timestamp}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
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
              <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
                <p className="text-xs text-zinc-600 dark:text-zinc-400 text-center">
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowConfirmation(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`bg-white dark:bg-zinc-900 border-2 rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden ${
                confirmationType === "start"
                  ? "border-emerald-500 dark:border-emerald-400"
                  : "border-red-500 dark:border-red-400"
              }`}
            >
              {/* Header */}
              <div className={`p-6 text-white ${
                confirmationType === "start"
                  ? "bg-emerald-500 dark:bg-emerald-400"
                  : "bg-red-500 dark:bg-red-400"
              }`}>
                <div className="flex items-center gap-3">
                  <AlertTriangle size={24} />
                  <div>
                    <h2 className="text-xl font-bold">
                      Confirm {confirmationType === "start" ? "Start" : "Stop"}
                    </h2>
                    <p className={confirmationType === "start" ? "text-emerald-100 dark:text-emerald-900" : "text-red-100 dark:text-red-900"}>
                      {actionScope === "panel" && selectedPanel && `${selectedPanel.name}`}
                      {actionScope === "area" && selectedArea && `${selectedArea} Area - All Panels`}
                      {actionScope === "all" && "All Control Panels"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700 rounded-lg p-4 mb-6">
                  <p className="text-sm text-amber-900 dark:text-amber-100 mb-2">
                    <strong>Warning:</strong> This action will {confirmationType === "start" ? "start" : "stop"}{" "}
                    {actionScope === "panel" ? "the selected panel" : actionScope === "area" ? "all panels in the selected area" : "all control panels"}.
                  </p>
                  {confirmationType === "stop" && (
                    <ul className="text-sm text-amber-900 dark:text-amber-100 list-disc list-inside space-y-1 mt-2">
                      <li>Material handling operations will cease</li>
                      <li>Active work will be paused</li>
                      <li>Equipment will come to a controlled stop</li>
                    </ul>
                  )}
                </div>

                {confirmationType === "stop" && (
                  <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4 mb-6">
                    <p className="text-sm text-zinc-900 dark:text-white">
                      <strong>Note:</strong> For immediate emergency stop, use the physical e-stop buttons.
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="flex-1 px-4 py-3 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-lg font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmAction}
                    className={`flex-1 px-4 py-3 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                      confirmationType === "start"
                        ? "bg-emerald-500 hover:bg-emerald-600"
                        : "bg-red-500 hover:bg-red-600"
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
