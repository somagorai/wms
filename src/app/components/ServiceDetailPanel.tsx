import { X, Activity, Package, Cpu, GitBranch, Zap, TrendingUp, FileText, Search, ExternalLink, AlertCircle, AlertTriangle, Info, XCircle, Skull, Play, Square, RotateCw, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { generateGeneralLogs, type LogEntry, type LogLevel } from "../data/mockLogs";

interface ServiceDetailPanelProps {
  serviceName: string;
  onClose: () => void;
}

// Mock service details data
const getServiceDetails = (serviceName: string) => {
  return {
    health: {
      status: serviceName === "Scan" ? "Down" : serviceName === "Host Adapter" ? "Degraded" : serviceName === "Inventory" ? "Warning" : "Healthy",
      startTime: "2026-03-15 08:30:42",
      upTime: "72h 15m",
      upTimePercent: serviceName === "Scan" ? "0.00%" : serviceName === "Host Adapter" ? "98.50%" : serviceName === "Inventory" ? "97.80%" : "99.98%",
    },
    build: {
      artifact: `${serviceName.toLowerCase()}-service.jar`,
      name: `${serviceName} Service`,
      time: "2026-03-10 14:22:18",
      version: "v2.4.1",
      group: "com.kpi.opto.wes",
      dbType: "PostgreSQL",
    },
    process: {
      pid: Math.floor(Math.random() * 50000 + 10000),
      cpuUsage: serviceName === "Scan" ? "0.0%" : serviceName === "Host Adapter" ? "72.5%" : "42.3%",
      memoryUsage: serviceName === "Scan" ? "0 MB" : serviceName === "Host Adapter" ? "1.2 GB" : "856 MB",
    },
    git: {
      information: "main@a3f2b1c",
      branch: "main",
      id: "a3f2b1c4d5e6f7g8h9i0j1k2l3m4n5o6",
      time: "2026-03-10 12:45:30",
    },
    threads: {
      totalActiveThreads: serviceName === "Scan" ? 0 : Math.floor(Math.random() * 50 + 20),
      avgThreadResponseTime: serviceName === "Scan" ? "N/A" : `${Math.floor(Math.random() * 100 + 20)}ms`,
      chartData: serviceName === "Scan" 
        ? []
        : [
            { time: "00:00", threads: 42, responseTime: 34 },
            { time: "04:00", threads: 38, responseTime: 28 },
            { time: "08:00", threads: 65, responseTime: 45 },
            { time: "12:00", threads: 78, responseTime: 52 },
            { time: "16:00", threads: 71, responseTime: 48 },
            { time: "20:00", threads: 54, responseTime: 38 },
          ],
    },
  };
};

// Mock YML config data
const getYmlConfig = (serviceName: string) => {
  return `spring:
  application:
    name: ${serviceName} Service
  datasource:
    type: com.zaxxer.hikari.HikariDataSource
    driver-class-name: org.postgresql.Driver
    username: postgres
    password: postgres
    url: jdbc:postgresql://10.11.28.5:5432/camundadb
    hikari:
      maximum-pool-size: 50
      minimum-idle: 10
      max-lifetime: 30000
      idle-timeout: 10000
      connection-test-query: SELECT 1
  jackson:
    date-format: com.fasterxml.jackson.databind.util.StdDateFormat
    default-property-inclusion: NON_EMPTY
    serialization:
      write-date-keys-as-timestamps: false
      write-dates-as-timestamps: false
    time-zone: UTC
  boot.admin.client:
    url: http://localhost:53105
  rabbitmq:
    host: localhost
    port: 5672
    username: guest
    password: guest
    pick-list-queue: ${serviceName.toLowerCase()}
    pick-list-queue-consumer: ${serviceName.toLowerCase()}.storage-status
    host-outbound-queue: host-outbound-trigger
    host-outbound-consumer: host-outbound
  
server:
  servlet:
    context-path: /${serviceName.toLowerCase()}
  address: 0.0.0.0
  port: 53${Math.floor(Math.random() * 100 + 100)}
  compression.enabled: true
  http2.enabled: true
  error:
    include-message: always
management:
  endpoints.web.exposure.include: "*"
  endpoint.health.show-details: always
  endpoint.logfile.external-file: C:/KPI/logs/wes-${serviceName.toLowerCase()}-service.log
logging:
  file:
    name: C:/KPI/logs/wes-${serviceName.toLowerCase()}.log
    max-size: 10MB
    max-history: 7
  pattern:
    rolling-file-name: C:/KPI/logs/wes-${serviceName.toLowerCase()}-%d{yyyy-MM-dd}.%i.log
  level:
    root: INFO
    org.springframework: INFO
    com.kpi.opto.wes.${serviceName.toLowerCase()}: INFO
    com.kpi.opto.wes.${serviceName.toLowerCase()}.commons.camunda.config: DEBUG
  structured:
    format:
      console: ecs
      file: ecs`;
};

export function ServiceDetailPanel({ serviceName, onClose }: ServiceDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<"details" | "yml" | "logs" | "actions">("details");
  const [logLevelFilter, setLogLevelFilter] = useState<LogLevel | "ALL">("ALL");
  const [logSearchQuery, setLogSearchQuery] = useState("");
  const [serviceStatus, setServiceStatus] = useState<"Started" | "Stopped">(
    serviceName === "Scan" ? "Stopped" : "Started"
  );
  const [actionInProgress, setActionInProgress] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingAction, setPendingAction] = useState<"start" | "stop" | "restart" | null>(null);
  const details = getServiceDetails(serviceName);
  const navigate = useNavigate();

  // Get all logs for this service
  const allServiceLogs = generateGeneralLogs().filter(log => log.service === serviceName);
  
  // Apply filters
  const filteredLogs = allServiceLogs.filter(log => {
    // Level filter
    if (logLevelFilter !== "ALL" && log.level !== logLevelFilter) {
      return false;
    }
    // Search filter
    if (logSearchQuery && !log.message.toLowerCase().includes(logSearchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  // Count by level
  const logCounts = {
    ALL: allServiceLogs.length,
    FATAL: allServiceLogs.filter(l => l.level === "FATAL").length,
    ERROR: allServiceLogs.filter(l => l.level === "ERROR").length,
    WARNING: allServiceLogs.filter(l => l.level === "WARNING").length,
    INFO: allServiceLogs.filter(l => l.level === "INFO").length,
    DEBUG: allServiceLogs.filter(l => l.level === "DEBUG").length,
  };

  const handleOpenMainLogs = () => {
    // Navigate to main logs page with filters
    const params = new URLSearchParams();
    params.set("service", serviceName);
    if (logLevelFilter !== "ALL") {
      params.set("level", logLevelFilter);
    }
    if (logSearchQuery) {
      params.set("search", logSearchQuery);
    }
    navigate(`/app/logs?${params.toString()}`);
  };

  const getLevelIcon = (level: LogLevel) => {
    switch (level) {
      case "FATAL":
        return <Skull size={18} className="text-purple-500" />;
      case "ERROR":
        return <XCircle size={18} className="text-red-500" />;
      case "WARNING":
        return <AlertTriangle size={18} className="text-yellow-500" />;
      case "INFO":
        return <Info size={18} className="text-blue-500" />;
      case "DEBUG":
        return <AlertCircle size={18} className="text-zinc-500" />;
      default:
        return null;
    }
  };

  const getLevelColor = (level: LogLevel) => {
    switch (level) {
      case "FATAL":
        return "text-purple-500";
      case "ERROR":
        return "text-red-500";
      case "WARNING":
        return "text-yellow-500";
      case "INFO":
        return "text-blue-500";
      case "DEBUG":
        return "text-zinc-500";
      default:
        return "text-zinc-400";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "healthy":
        return "text-green-500";
      case "degraded":
      case "warning":
        return "text-yellow-500";
      case "down":
        return "text-red-500";
      default:
        return "text-zinc-400";
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "healthy":
        return "bg-green-500/10 border-green-500/20";
      case "degraded":
      case "warning":
        return "bg-yellow-500/10 border-yellow-500/20";
      case "down":
        return "bg-red-500/10 border-red-500/20";
      default:
        return "bg-zinc-500/10 border-zinc-500/20";
    }
  };

  const handleAction = (action: "start" | "stop" | "restart") => {
    setPendingAction(action);
    setShowConfirmation(true);
  };

  const confirmAction = () => {
    if (!pendingAction) return;
    
    setActionInProgress(true);
    setActionSuccess(false);
    setShowConfirmation(false);
    
    const duration = pendingAction === "restart" ? 3000 : 2000;
    
    setTimeout(() => {
      setActionInProgress(false);
      setActionSuccess(true);
      
      if (pendingAction === "start" || pendingAction === "restart") {
        setServiceStatus("Started");
      } else {
        setServiceStatus("Stopped");
      }
      
      setPendingAction(null);
    }, duration);
  };

  const cancelAction = () => {
    setPendingAction(null);
    setShowConfirmation(false);
  };

  // Get class names for icon container
  const getIconContainerClass = () => {
    if (!pendingAction) return "";
    if (pendingAction === "start") return "bg-[#0d9488]/20 dark:bg-[#50e080]/20";
    if (pendingAction === "stop") return "bg-red-500/20";
    return "bg-orange-500/20";
  };

  // Get icon component
  const getActionIcon = () => {
    if (!pendingAction) return null;
    if (pendingAction === "start") return <Play size={24} className="text-[#0d9488] dark:text-[#50e080]" />;
    if (pendingAction === "stop") return <Square size={24} className="text-red-500" />;
    return <RotateCw size={24} className="text-orange-500" />;
  };

  // Get action color class
  const getActionColorClass = () => {
    if (!pendingAction) return "";
    if (pendingAction === "start") return "text-[#0d9488] dark:text-[#50e080]";
    if (pendingAction === "stop") return "text-red-500";
    return "text-orange-500";
  };

  // Get warning message
  const getWarningMessage = () => {
    if (!pendingAction) return "";
    if (pendingAction === "restart") return "Restarting will temporarily interrupt service availability. Active connections will be terminated.";
    if (pendingAction === "stop") return "Stopping will halt all service operations. This action may impact dependent systems.";
    return "Starting will initialize the service and begin processing operations.";
  };

  // Get button class
  const getButtonClass = () => {
    if (!pendingAction) return "";
    if (pendingAction === "start") return "bg-[#0d9488] dark:bg-[#50e080] hover:bg-[#0f766e] dark:hover:bg-[#3bc76a] text-white";
    if (pendingAction === "stop") return "bg-red-500 hover:bg-red-600 text-white";
    return "bg-orange-500 hover:bg-orange-600 text-white";
  };

  return (
    <div className="fixed right-0 top-0 h-full w-[700px] bg-white dark:bg-zinc-900 border-l-2 border-zinc-300 dark:border-zinc-700 shadow-2xl z-50 overflow-hidden flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="bg-zinc-100 dark:bg-zinc-800 border-b-2 border-zinc-300 dark:border-zinc-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Activity className="text-[#0d9488] dark:text-[#50e080]" size={24} />
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">{serviceName} Service</h2>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-zinc-800 dark:border-zinc-700">
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
            onClick={() => setActiveTab("yml")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "yml"
                ? "border-[#0d9488] dark:border-[#50e080] text-zinc-900 dark:text-white"
                : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            YML Config
          </button>
          <button
            onClick={() => setActiveTab("logs")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "logs"
                ? "border-[#0d9488] dark:border-[#50e080] text-zinc-900 dark:text-white"
                : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            Logs
          </button>
          <button
            onClick={() => {
              setActiveTab("actions");
              setActionSuccess(false);
            }}
            className={`ml-auto px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "actions"
                ? "border-orange-500 text-zinc-900 dark:text-white bg-orange-500/10"
                : "border-transparent text-orange-400 hover:text-orange-300 hover:bg-orange-500/5"
            }`}
          >
            <Zap size={16} />
            Actions
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === "details" ? (
          <div className="space-y-6">
            {/* Health Section - rest of content continues... */}
            <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl overflow-hidden">
              <div className="bg-zinc-100 dark:bg-zinc-800 p-4 border-b-2 border-zinc-300 dark:border-zinc-700">
                <div className="flex items-center gap-2">
                  <Activity size={20} className="text-[#0d9488] dark:text-[#50e080]" />
                  <h3 className="font-semibold text-zinc-900 dark:text-white">Health</h3>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">Status</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusBgColor(details.health.status)} ${getStatusColor(details.health.status)}`}>
                    {details.health.status}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-3">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">Start Time</span>
                  <span className="font-mono text-sm text-zinc-900 dark:text-white">{details.health.startTime}</span>
                </div>
                <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-3">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">Up Time</span>
                  <span className="font-mono text-sm text-zinc-900 dark:text-white">{details.health.upTime}</span>
                </div>
                <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-3">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">Up Time %</span>
                  <span className="font-mono text-sm font-semibold text-zinc-900 dark:text-white">{details.health.upTimePercent}</span>
                </div>
              </div>
            </div>

            {/* Build Section */}
            <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl overflow-hidden">
              <div className="bg-zinc-100 dark:bg-zinc-800 p-4 border-b-2 border-zinc-300 dark:border-zinc-700">
                <div className="flex items-center gap-2">
                  <Package size={20} className="text-[#0d9488] dark:text-[#50e080]" />
                  <h3 className="font-semibold text-zinc-900 dark:text-white">Build</h3>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">Artifact</span>
                  <span className="font-mono text-sm text-zinc-900 dark:text-white">{details.build.artifact}</span>
                </div>
                <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-3">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">Name</span>
                  <span className="text-sm text-zinc-900 dark:text-white">{details.build.name}</span>
                </div>
                <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-3">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">Time</span>
                  <span className="font-mono text-sm text-zinc-900 dark:text-white">{details.build.time}</span>
                </div>
                <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-3">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">Version</span>
                  <span className="font-mono text-sm text-zinc-900 dark:text-white">{details.build.version}</span>
                </div>
                <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-3">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">Group</span>
                  <span className="font-mono text-sm text-zinc-900 dark:text-white">{details.build.group}</span>
                </div>
                <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-3">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">DB Type</span>
                  <span className="text-sm text-zinc-900 dark:text-white">{details.build.dbType}</span>
                </div>
              </div>
            </div>

            {/* Process Section */}
            <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl overflow-hidden">
              <div className="bg-zinc-100 dark:bg-zinc-800 p-4 border-b-2 border-zinc-300 dark:border-zinc-700">
                <div className="flex items-center gap-2">
                  <Cpu size={20} className="text-[#0d9488] dark:text-[#50e080]" />
                  <h3 className="font-semibold text-zinc-900 dark:text-white">Process</h3>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">PID</span>
                  <span className="font-mono text-sm text-zinc-900 dark:text-white">{details.process.pid}</span>
                </div>
                <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-3">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">CPU Usage</span>
                  <span className="font-mono text-sm text-zinc-900 dark:text-white">{details.process.cpuUsage}</span>
                </div>
                <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-3">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">Memory Usage</span>
                  <span className="font-mono text-sm text-zinc-900 dark:text-white">{details.process.memoryUsage}</span>
                </div>
              </div>
            </div>

            {/* GIT Section */}
            <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl overflow-hidden">
              <div className="bg-zinc-100 dark:bg-zinc-800 p-4 border-b-2 border-zinc-300 dark:border-zinc-700">
                <div className="flex items-center gap-2">
                  <GitBranch size={20} className="text-[#0d9488] dark:text-[#50e080]" />
                  <h3 className="font-semibold text-zinc-900 dark:text-white">GIT</h3>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">GIT Information</span>
                  <span className="font-mono text-sm text-zinc-900 dark:text-white">{details.git.information}</span>
                </div>
                <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-3">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">Branch</span>
                  <span className="font-mono text-sm text-zinc-900 dark:text-white">{details.git.branch}</span>
                </div>
                <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-3">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">ID</span>
                  <span className="font-mono text-xs text-zinc-900 dark:text-white break-all">{details.git.id}</span>
                </div>
                <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-3">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">Time</span>
                  <span className="font-mono text-sm text-zinc-900 dark:text-white">{details.git.time}</span>
                </div>
              </div>
            </div>

            {/* Threads Section */}
            <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl overflow-hidden">
              <div className="bg-zinc-100 dark:bg-zinc-800 p-4 border-b-2 border-zinc-300 dark:border-zinc-700">
                <div className="flex items-center gap-2">
                  <Zap size={20} className="text-[#0d9488] dark:text-[#50e080]" />
                  <h3 className="font-semibold text-zinc-900 dark:text-white">Threads</h3>
                </div>
              </div>
              <div className="p-4 space-y-4">
                {/* Thread Tiles */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Zap className="text-[#0d9488] dark:text-[#50e080]" size={18} />
                      <span className="text-2xl font-bold text-zinc-900 dark:text-white">{details.threads.totalActiveThreads}</span>
                    </div>
                    <h4 className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Total Active Threads</h4>
                  </div>
                  <div className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <TrendingUp className="text-[#0d9488] dark:text-[#50e080]" size={18} />
                      <span className="text-2xl font-bold text-zinc-900 dark:text-white">{details.threads.avgThreadResponseTime}</span>
                    </div>
                    <h4 className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Avg Thread Response Time</h4>
                  </div>
                </div>

                {/* Combo Chart */}
                {details.threads.chartData.length > 0 && (
                  <div className="mt-4">
                    <ResponsiveContainer width="100%" height={200}>
                      <ComposedChart data={details.threads.chartData} id={`chart-${serviceName}`}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" className="dark:stroke-zinc-700" key="grid" />
                        <XAxis 
                          dataKey="time" 
                          stroke="#71717a"
                          style={{ fontSize: '12px' }}
                          key="xaxis"
                        />
                        <YAxis 
                          yAxisId="left"
                          stroke="#71717a"
                          style={{ fontSize: '12px' }}
                          label={{ value: 'Threads', angle: -90, position: 'insideLeft', style: { fontSize: '12px', fill: '#71717a' } }}
                          key="yaxis-left"
                        />
                        <YAxis 
                          yAxisId="right"
                          orientation="right"
                          stroke="#71717a"
                          style={{ fontSize: '12px' }}
                          label={{ value: 'Response Time (ms)', angle: 90, position: 'insideRight', style: { fontSize: '12px', fill: '#71717a' } }}
                          key="yaxis-right"
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid #e5e5e5',
                            borderRadius: '8px',
                          }}
                          key="tooltip"
                        />
                        <Legend key="legend" />
                        <Bar 
                          key="threads-bar"
                          yAxisId="left"
                          dataKey="threads" 
                          fill="#0d9488" 
                          name="No of Threads Handled"
                          radius={[4, 4, 0, 0]}
                        />
                        <Line 
                          key="response-time-line"
                          yAxisId="right"
                          type="monotone" 
                          dataKey="responseTime" 
                          stroke="#50e080" 
                          strokeWidth={2}
                          name="Avg Response Time (ms)"
                          dot={{ fill: '#50e080', r: 4 }}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : activeTab === "yml" ? (
          // YML Config Tab
          <div className="bg-zinc-900 rounded-xl p-4 overflow-x-auto">
            <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap break-words">
              {getYmlConfig(serviceName)}
            </pre>
          </div>
        ) : activeTab === "logs" ? (
          // Logs Tab
          <div className="space-y-4">
            {/* Filter Tiles */}
            <div className="grid grid-cols-5 gap-2">
              <button
                onClick={() => setLogLevelFilter("ALL")}
                className={`p-3 rounded-lg border-2 transition-all text-center ${
                  logLevelFilter === "ALL"
                    ? "bg-[#0d9488] dark:bg-[#50e080] border-[#0d9488] dark:border-[#50e080] text-white"
                    : "bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white hover:border-[#0d9488] dark:hover:border-[#50e080]"
                }`}
              >
                <div className="text-lg font-bold">{logCounts.ALL}</div>
                <div className="text-xs">ALL</div>
              </button>
              
              <button
                onClick={() => setLogLevelFilter("FATAL")}
                className={`p-3 rounded-lg border-2 transition-all text-center ${
                  logLevelFilter === "FATAL"
                    ? "bg-purple-500 border-purple-500 text-white"
                    : "bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 hover:border-purple-500"
                }`}
              >
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Skull size={16} className={logLevelFilter === "FATAL" ? "text-white" : "text-purple-500"} />
                  <span className={`text-lg font-bold ${logLevelFilter === "FATAL" ? "text-white" : "text-purple-500"}`}>
                    {logCounts.FATAL}
                  </span>
                </div>
                <div className={`text-xs ${logLevelFilter === "FATAL" ? "text-white" : "text-zinc-900 dark:text-white"}`}>FATAL</div>
              </button>

              <button
                onClick={() => setLogLevelFilter("ERROR")}
                className={`p-3 rounded-lg border-2 transition-all text-center ${
                  logLevelFilter === "ERROR"
                    ? "bg-red-500 border-red-500 text-white"
                    : "bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 hover:border-red-500"
                }`}
              >
                <div className="flex items-center justify-center gap-1 mb-1">
                  <XCircle size={16} className={logLevelFilter === "ERROR" ? "text-white" : "text-red-500"} />
                  <span className={`text-lg font-bold ${logLevelFilter === "ERROR" ? "text-white" : "text-red-500"}`}>
                    {logCounts.ERROR}
                  </span>
                </div>
                <div className={`text-xs ${logLevelFilter === "ERROR" ? "text-white" : "text-zinc-900 dark:text-white"}`}>ERROR</div>
              </button>

              <button
                onClick={() => setLogLevelFilter("WARNING")}
                className={`p-3 rounded-lg border-2 transition-all text-center ${
                  logLevelFilter === "WARNING"
                    ? "bg-yellow-500 border-yellow-500 text-white"
                    : "bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 hover:border-yellow-500"
                }`}
              >
                <div className="flex items-center justify-center gap-1 mb-1">
                  <AlertTriangle size={16} className={logLevelFilter === "WARNING" ? "text-white" : "text-yellow-500"} />
                  <span className={`text-lg font-bold ${logLevelFilter === "WARNING" ? "text-white" : "text-yellow-500"}`}>
                    {logCounts.WARNING}
                  </span>
                </div>
                <div className={`text-xs ${logLevelFilter === "WARNING" ? "text-white" : "text-zinc-900 dark:text-white"}`}>WARN</div>
              </button>

              <button
                onClick={() => setLogLevelFilter("INFO")}
                className={`p-3 rounded-lg border-2 transition-all text-center ${
                  logLevelFilter === "INFO"
                    ? "bg-blue-500 border-blue-500 text-white"
                    : "bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 hover:border-blue-500"
                }`}
              >
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Info size={16} className={logLevelFilter === "INFO" ? "text-white" : "text-blue-500"} />
                  <span className={`text-lg font-bold ${logLevelFilter === "INFO" ? "text-white" : "text-blue-500"}`}>
                    {logCounts.INFO}
                  </span>
                </div>
                <div className={`text-xs ${logLevelFilter === "INFO" ? "text-white" : "text-zinc-900 dark:text-white"}`}>INFO</div>
              </button>

              <button
                onClick={() => setLogLevelFilter("DEBUG")}
                className={`p-3 rounded-lg border-2 transition-all text-center col-span-5 ${
                  logLevelFilter === "DEBUG"
                    ? "bg-zinc-500 border-zinc-500 text-white"
                    : "bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 hover:border-zinc-500"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <AlertCircle size={16} className={logLevelFilter === "DEBUG" ? "text-white" : "text-zinc-500"} />
                  <span className={`text-lg font-bold ${logLevelFilter === "DEBUG" ? "text-white" : "text-zinc-500"}`}>
                    {logCounts.DEBUG}
                  </span>
                  <span className={`text-xs ${logLevelFilter === "DEBUG" ? "text-white" : "text-zinc-900 dark:text-white"}`}>DEBUG</span>
                </div>
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
              <input
                type="text"
                placeholder="Search logs..."
                value={logSearchQuery}
                onChange={(e) => setLogSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:border-[#0d9488] dark:focus:border-[#50e080] transition-colors"
              />
            </div>

            {/* View Full Logs Link */}
            <button
              onClick={handleOpenMainLogs}
              className="w-full flex items-center justify-center gap-2 p-3 bg-[#0d9488] dark:bg-[#50e080] hover:bg-[#0f766e] dark:hover:bg-[#3bc76a] text-white rounded-lg transition-colors font-medium"
            >
              <ExternalLink size={18} />
              <span>View Full Logs Page</span>
            </button>

            {/* Log Entries */}
            <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl overflow-hidden">
              <div className="max-h-[500px] overflow-y-auto">
                {filteredLogs.length === 0 ? (
                  <div className="p-8 text-center">
                    <FileText size={48} className="mx-auto text-zinc-400 mb-3" />
                    <p className="text-zinc-600 dark:text-zinc-400">No logs found matching your filters</p>
                  </div>
                ) : (
                  filteredLogs.slice(0, 50).map((log, index) => (
                    <div
                      key={log.id}
                      className={`p-4 border-b border-zinc-200 dark:border-zinc-800 last:border-0 ${
                        log.level === "FATAL"
                          ? "bg-purple-500/5 hover:bg-purple-500/10"
                          : log.level === "ERROR"
                          ? "bg-red-500/5 hover:bg-red-500/10"
                          : log.level === "WARNING"
                          ? "bg-yellow-500/5 hover:bg-yellow-500/10"
                          : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      } transition-colors cursor-pointer`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {getLevelIcon(log.level)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-semibold ${getLevelColor(log.level)}`}>
                              {log.level}
                            </span>
                            <span className="text-xs text-zinc-500 dark:text-zinc-400">
                              {new Date(log.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm text-zinc-900 dark:text-white break-words">
                            {log.message}
                          </p>
                          {log.endpoint && (
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-mono">
                              {log.endpoint}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {filteredLogs.length > 50 && (
                <div className="p-3 bg-zinc-100 dark:bg-zinc-800 border-t-2 border-zinc-300 dark:border-zinc-700 text-center">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Showing 50 of {filteredLogs.length} logs. <button onClick={handleOpenMainLogs} className="text-[#0d9488] dark:text-[#50e080] hover:underline font-medium">View all on logs page</button>
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Actions Tab
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Service Status Display */}
            <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">Current Service Status</h4>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${serviceStatus === "Started" ? "bg-green-500" : "bg-red-500"} animate-pulse`} />
                    <span className={`text-2xl font-bold ${serviceStatus === "Started" ? "text-green-500" : "text-red-500"}`}>
                      {serviceStatus}
                    </span>
                  </div>
                </div>
                {serviceStatus === "Started" ? (
                  <Activity size={48} className="text-green-500/20" />
                ) : (
                  <Square size={48} className="text-red-500/20" />
                )}
              </div>
            </div>

            {/* Action Success Message */}
            {actionSuccess && (
              <div className="bg-green-500/10 border-2 border-green-500/20 rounded-xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
                <CheckCircle2 size={24} className="text-green-500" />
                <div>
                  <p className="text-sm font-semibold text-green-500">Action Completed Successfully</p>
                  <p className="text-xs text-green-600 dark:text-green-400">Service is now {serviceStatus}</p>
                </div>
              </div>
            )}

            {/* Action Buttons Grid */}
            <div className="grid grid-cols-1 gap-3">
              {/* Start Button */}
              <button
                onClick={() => handleAction("start")}
                disabled={serviceStatus === "Started" || actionInProgress}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  serviceStatus === "Stopped" && !actionInProgress
                    ? "border-[#0d9488] dark:border-[#50e080] bg-white dark:bg-zinc-900 hover:bg-[#0d9488]/5 dark:hover:bg-[#50e080]/5"
                    : "border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800/30 cursor-not-allowed opacity-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    serviceStatus === "Stopped" && !actionInProgress
                      ? "bg-[#0d9488] dark:bg-[#50e080]"
                      : "bg-zinc-300 dark:bg-zinc-700"
                  }`}>
                    <Play size={20} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h5 className="text-base font-semibold text-zinc-900 dark:text-white">Start Service</h5>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                      {serviceStatus === "Started"
                        ? "Service is already running"
                        : actionInProgress
                        ? "Starting service..."
                        : "Start the service and begin processing"}
                    </p>
                  </div>
                  {actionInProgress && serviceStatus === "Stopped" && (
                    <div className="w-5 h-5 border-2 border-[#0d9488] dark:border-[#50e080] border-t-transparent rounded-full animate-spin" />
                  )}
                </div>
              </button>

              {/* Stop Button */}
              <button
                onClick={() => handleAction("stop")}
                disabled={serviceStatus === "Stopped" || actionInProgress}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  serviceStatus === "Started" && !actionInProgress
                    ? "border-red-500 bg-white dark:bg-zinc-900 hover:bg-red-500/5"
                    : "border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800/30 cursor-not-allowed opacity-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    serviceStatus === "Started" && !actionInProgress
                      ? "bg-red-500"
                      : "bg-zinc-300 dark:bg-zinc-700"
                  }`}>
                    <Square size={20} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h5 className="text-base font-semibold text-zinc-900 dark:text-white">Stop Service</h5>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                      {serviceStatus === "Stopped"
                        ? "Service is already stopped"
                        : actionInProgress
                        ? "Stopping service..."
                        : "Stop the service and halt processing"}
                    </p>
                  </div>
                  {actionInProgress && serviceStatus === "Started" && (
                    <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                  )}
                </div>
              </button>

              {/* Restart Button */}
              <button
                onClick={() => handleAction("restart")}
                disabled={serviceStatus === "Stopped" || actionInProgress}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  serviceStatus === "Started" && !actionInProgress
                    ? "border-orange-500 bg-white dark:bg-zinc-900 hover:bg-orange-500/5"
                    : "border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800/30 cursor-not-allowed opacity-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    serviceStatus === "Started" && !actionInProgress
                      ? "bg-orange-500"
                      : "bg-zinc-300 dark:bg-zinc-700"
                  }`}>
                    <RotateCw size={20} className={`text-white ${
                      actionInProgress && serviceStatus === "Started" ? "animate-spin" : ""
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h5 className="text-base font-semibold text-zinc-900 dark:text-white">Restart Service</h5>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                      {serviceStatus === "Stopped"
                        ? "Service must be running to restart"
                        : actionInProgress
                        ? "Restarting service..."
                        : "Stop and immediately restart the service"}
                    </p>
                  </div>
                </div>
              </button>
            </div>

            {/* Info Box */}
            <div className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="text-[#0d9488] dark:text-[#50e080] mt-0.5" />
                <div>
                  <h6 className="text-sm font-semibold text-zinc-900 dark:text-white mb-1">Action Information</h6>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Service actions will affect the availability and performance of {serviceName}. Stopping or restarting the service may cause temporary disruptions.
                  </p>
                </div>
              </div>
            </div>

            {/* Confirmation Dialog */}
            {showConfirmation && pendingAction && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
                <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 rounded-lg shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
                  {/* Header */}
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getIconContainerClass()}`}>
                      {getActionIcon()}
                    </div>
                    <div>
                      <h5 className="text-lg font-semibold text-zinc-900 dark:text-white">Confirm {pendingAction.charAt(0).toUpperCase() + pendingAction.slice(1)}</h5>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">Please review this action</p>
                    </div>
                  </div>

                  {/* Details Box */}
                  <div className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-700">
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">Service:</span>
                      <span className="text-sm font-medium text-zinc-900 dark:text-white">{serviceName}</span>
                    </div>
                    <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-700">
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">Current Status:</span>
                      <span className={`text-sm font-semibold ${serviceStatus === "Started" ? "text-green-500" : "text-red-500"}`}>
                        {serviceStatus}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">Action:</span>
                      <span className={`text-sm font-semibold ${getActionColorClass()}`}>
                        {pendingAction.charAt(0).toUpperCase() + pendingAction.slice(1)} Service
                      </span>
                    </div>
                  </div>

                  {/* Warning */}
                  <div className="flex items-start gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                    <AlertTriangle size={16} className="text-yellow-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {getWarningMessage()}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={confirmAction}
                      className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${getButtonClass()}`}
                    >
                      <CheckCircle2 size={18} />
                      Confirm {pendingAction.charAt(0).toUpperCase() + pendingAction.slice(1)}
                    </button>
                    <button
                      onClick={cancelAction}
                      className="px-6 py-3 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-900 dark:text-white rounded-lg font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}