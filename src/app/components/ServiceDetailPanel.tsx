import { X, Activity, Package, Cpu, GitBranch, Zap, TrendingUp, FileText, Search, ExternalLink, AlertCircle, AlertTriangle, Info, XCircle, Skull, Play, Square, RotateCw, CheckCircle2, History } from "lucide-react";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getServiceLogs, type LogEntry, type LogLevel } from "../data/mockLogs";
import { DetailSidePanel, PanelSection, PanelRow } from "./panels/DetailSidePanel";

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

 // Get stable logs for this service
 const allServiceLogs = useMemo(() => getServiceLogs(serviceName), [serviceName]);
 
 // Apply filters
 const filteredLogs = useMemo(() => {
   return allServiceLogs.filter(log => {
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
 }, [allServiceLogs, logLevelFilter, logSearchQuery]);

 // Count by level
 const logCounts = useMemo(() => ({
   ALL: allServiceLogs.length,
   FATAL: allServiceLogs.filter(l => l.level === "FATAL").length,
   ERROR: allServiceLogs.filter(l => l.level === "ERROR").length,
   WARNING: allServiceLogs.filter(l => l.level === "WARNING").length,
   INFO: allServiceLogs.filter(l => l.level === "INFO").length,
   DEBUG: allServiceLogs.filter(l => l.level === "DEBUG").length,
 }), [allServiceLogs]);

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
 return <Skull size={18} className="text-[var(--state-fatal)]" />;
 case "ERROR":
 return <XCircle size={18} className="text-[var(--state-error)]" />;
 case "WARNING":
 return <AlertTriangle size={18} className="text-[var(--state-warning)]" />;
 case "INFO":
 return <Info size={18} className="text-[var(--state-info)]" />;
 case "DEBUG":
 return <AlertCircle size={18} className="text-[var(--muted-foreground)]" />;
 default:
 return null;
 }
 };

 const getLevelColor = (level: LogLevel) => {
 switch (level) {
 case "FATAL":
 return "text-[var(--state-fatal)]";
 case "ERROR":
 return "text-[var(--state-error)]";
 case "WARNING":
 return "text-[var(--state-warning)]";
 case "INFO":
 return "text-[var(--state-info)]";
 case "DEBUG":
 return "text-[var(--muted-foreground)]";
 default:
 return "text-[var(--muted-foreground)]";
 }
 };

 const getStatusColor = (status: string) => {
 switch (status.toLowerCase()) {
 case "healthy":
 return "text-[var(--state-success)]";
 case "degraded":
 case "warning":
 return "text-[var(--state-warning)]";
 case "down":
 return "text-[var(--state-error)]";
 default:
 return "text-[var(--muted-foreground)]";
 }
 };

  const getStatusBgColor = (status: string) => {
  switch (status.toLowerCase()) {
  case "healthy":
  return "bg-[var(--surface-container-low)] dark:bg-[var(--card)] border-[var(--state-success)]/30 hover:border-[var(--state-success)]/60";
  case "degraded":
  case "warning":
  return "bg-[var(--surface-container-low)] dark:bg-[var(--card)] border-[var(--state-warning)]/30 hover:border-[var(--state-warning)]/60";
  case "down":
  return "bg-[var(--surface-container-low)] dark:bg-[var(--card)] border-[var(--state-error)]/30 hover:border-[var(--state-error)]/60";
  default:
  return "bg-[var(--surface-container-low)] dark:bg-[var(--card)] border-[var(--border)] ";
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
 if (pendingAction === "start") return "bg-[var(--primary)]/20 /20";
 if (pendingAction === "stop") return "bg-[var(--state-error)]/20";
 return "bg-[var(--state-warning)]/20";
 };

 // Get icon component
 const getActionIcon = () => {
 if (!pendingAction) return null;
 if (pendingAction === "start") return <Play size={24} className="text-[var(--primary)] dark:text-[var(--primary)]" />;
 if (pendingAction === "stop") return <Square size={24} className="text-[var(--state-error)]" />;
 return <RotateCw size={24} className="text-[var(--state-warning)]" />;
 };

 // Get action color class
 const getActionColorClass = () => {
 if (!pendingAction) return "";
 if (pendingAction === "start") return "text-[var(--primary)] dark:text-[var(--primary)]";
 if (pendingAction === "stop") return "text-[var(--state-error)]";
 return "text-[var(--state-warning)]";
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
 if (pendingAction === "start") return "bg-[var(--primary)]  hover:opacity-90 active:scale-[0.98] text-[var(--primary-foreground)]";
 if (pendingAction === "stop") return "bg-[var(--state-error)] hover:bg-[var(--state-error-container)] text-[var(--state-error-foreground)]";
 return "bg-[var(--state-warning-container)] hover:bg-[var(--state-warning)] text-[var(--state-on-warning-container)]";
 };

  const tabs = [
    { id: "details", label: "Details", icon: <Info size={16} /> },
    { id: "yml", label: "YML Config", icon: <FileText size={16} /> },
    { id: "logs", label: "Logs", icon: <History size={16} /> },
    { id: "actions", label: "Actions", icon: <Zap size={16} />, isAction: true },
  ];

  return (
    <DetailSidePanel
      title={`${serviceName} Service`}
      subtitle="System Service Details"
      icon={<Activity size={24} className="text-[var(--primary)]" />}
      status={details.health.status}
      activeTab={activeTab}
      onTabChange={(tab) => {
        setActiveTab(tab as any);
        if (tab === "actions") setActionSuccess(false);
      }}
      tabs={tabs}
      onClose={onClose}
    >
      {activeTab === "details" ? (
        <div className="space-y-6">
          {/* Health Section */}
          <PanelSection title="Health">
            <PanelRow
              label="Status"
              value={
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBgColor(details.health.status)} ${getStatusColor(details.health.status)}`}>
                  {details.health.status}
                </span>
              }
            />
            <PanelRow label="Start Time" value={details.health.startTime} mono />
            <PanelRow label="Up Time" value={details.health.upTime} mono />
            <PanelRow label="Up Time %" value={details.health.upTimePercent} mono />
          </PanelSection>

          {/* Build Section */}
          <PanelSection title="Build">
            <PanelRow label="Artifact" value={details.build.artifact} mono />
            <PanelRow label="Name" value={details.build.name} />
            <PanelRow label="Time" value={details.build.time} mono />
            <PanelRow label="Version" value={details.build.version} mono />
            <PanelRow label="Group" value={details.build.group} mono />
            <PanelRow label="DB Type" value={details.build.dbType} />
          </PanelSection>

          {/* Process Section */}
          <PanelSection title="Process">
            <PanelRow label="PID" value={details.process.pid} mono />
            <PanelRow label="CPU Usage" value={details.process.cpuUsage} mono />
            <PanelRow label="Memory Usage" value={details.process.memoryUsage} mono />
          </PanelSection>

          {/* GIT Section */}
          <PanelSection title="GIT">
            <PanelRow label="GIT Information" value={details.git.information} mono />
            <PanelRow label="Branch" value={details.git.branch} mono />
            <PanelRow label="ID" value={details.git.id} mono className="break-all" />
            <PanelRow label="Time" value={details.git.time} mono />
          </PanelSection>

            {/* Threads Section */}
            <div>
              <h4 className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-4">Threads</h4>
              <div className="bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] rounded-lg p-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[var(--surface-container-low)] dark:bg-[var(--card)] border border-[var(--border)] rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Zap className="text-[var(--primary)]" size={18} />
                      <span className="text-2xl font-bold text-[var(--foreground)]">{details.threads.totalActiveThreads}</span>
                    </div>
                    <p className="text-xs font-medium text-[var(--muted-foreground)]">Total Active Threads</p>
                  </div>
                  <div className="bg-[var(--surface-container-low)] dark:bg-[var(--card)] border border-[var(--border)] rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <TrendingUp className="text-[var(--primary)]" size={18} />
                      <span className="text-2xl font-bold text-[var(--foreground)]">{details.threads.avgThreadResponseTime}</span>
                    </div>
                    <p className="text-xs font-medium text-[var(--muted-foreground)]">Avg Thread Response Time</p>
                  </div>
                </div>

                {/* Combo Chart */}
                {details.threads.chartData.length > 0 && (
                  <div className="mt-4">
                    <ResponsiveContainer width="100%" height={200}>
                      <ComposedChart data={details.threads.chartData} id={`chart-${serviceName}`}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" className="dark:stroke-[var(--outline)]" key="grid" />
                        <XAxis 
                          dataKey="time" 
                          stroke="var(--muted-foreground)"
                          style={{ fontSize: '12px' }}
                          key="xaxis"
                        />
                        <YAxis 
                          yAxisId="left"
                          stroke="var(--muted-foreground)"
                          style={{ fontSize: '12px' }}
                          label={{ value: 'Threads', angle: -90, position: 'insideLeft', style: { fontSize: '12px', fill: 'var(--muted-foreground)' } }}
                          key="yaxis-left"
                        />
                        <YAxis 
                          yAxisId="right"
                          orientation="right"
                          stroke="var(--muted-foreground)"
                          style={{ fontSize: '12px' }}
                          label={{ value: 'Response Time (ms)', angle: 90, position: 'insideRight', style: { fontSize: '12px', fill: 'var(--muted-foreground)' } }}
                          key="yaxis-right"
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                          }}
                          key="tooltip"
                        />
                        <Legend key="legend" />
                        <Bar 
                          key="threads-bar"
                          yAxisId="left"
                          dataKey="threads" 
                          fill="var(--chart-blue)" 
                          name="No of Threads Handled"
                          radius={[4, 4, 0, 0]}
                        />
                        <Line 
                          key="response-time-line"
                          yAxisId="right"
                          type="monotone" 
                          dataKey="responseTime" 
                          stroke="var(--chart-orange)" 
                          strokeWidth={2}
                          name="Avg Response Time (ms)"
                          dot={{ fill: 'var(--chart-orange)', r: 4 }}
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
 <div className="bg-[var(--surface-container-high)] text-[var(--foreground)] rounded-xl p-4 overflow-x-auto border border-[var(--border)]  rounded-xl bg-[var(--surface-container-lowest)] dark:bg-[var(--surface-container)]">
 <pre className="text-sm text-[var(--state-success)] font-mono whitespace-pre-wrap break-words">
 {getYmlConfig(serviceName)}
 </pre>
 </div>
 ) : activeTab === "logs" ? (
 // Logs Tab
 <div className="space-y-4">
        {/* Filter Tiles */}
        <div className="grid grid-cols-5 gap-2">
          {/* ALL */}
          <button
            onClick={() => setLogLevelFilter("ALL")}
            className={`p-3 rounded-lg border transition-all text-center ${
              logLevelFilter === "ALL"
                ? "bg-[var(--primary)] border-[var(--primary)] text-[var(--primary-foreground)] shadow-xs"
                : "bg-[var(--card)] text-[var(--foreground)] border-[var(--border)] hover:border-[var(--primary)]"
            }`}
          >
            <div className={`text-lg font-bold ${logLevelFilter === "ALL" ? "text-[var(--primary-foreground)]" : "text-[var(--foreground)]"}`}>
              {logCounts.ALL}
            </div>
            <div className={`text-xs font-semibold ${logLevelFilter === "ALL" ? "text-[var(--primary-foreground)]" : "text-[var(--muted-foreground)]"}`}>
              ALL
            </div>
          </button>
          
          {/* FATAL (Exception Purple) */}
          <button
            onClick={() => setLogLevelFilter("FATAL")}
            className={`p-3 rounded-lg border transition-all text-center ${
              logLevelFilter === "FATAL"
                ? "bg-[var(--state-fatal-container)] border-2 border-[var(--state-fatal)] text-[var(--state-on-fatal-container)] shadow-xs"
                : "bg-[var(--card)] text-[var(--foreground)] border-[var(--border)] hover:border-[var(--state-fatal)]"
            }`}
          >
            <div className="flex items-center justify-center gap-1 mb-1">
              <Skull size={16} className={logLevelFilter === "FATAL" ? "text-[var(--state-on-fatal-container)]" : "text-[var(--state-fatal)]"} />
              <span className={`text-lg font-bold ${logLevelFilter === "FATAL" ? "text-[var(--state-on-fatal-container)]" : "text-[var(--state-fatal)]"}`}>
                {logCounts.FATAL}
              </span>
            </div>
            <div className={`text-xs font-semibold ${logLevelFilter === "FATAL" ? "text-[var(--state-on-fatal-container)]" : "text-[var(--muted-foreground)]"}`}>
              FATAL
            </div>
          </button>

          {/* ERROR (Crimson Red) */}
          <button
            onClick={() => setLogLevelFilter("ERROR")}
            className={`p-3 rounded-lg border transition-all text-center ${
              logLevelFilter === "ERROR"
                ? "bg-[var(--state-error-container)] border-2 border-[var(--state-error)] text-[var(--state-on-error-container)] shadow-xs"
                : "bg-[var(--card)] text-[var(--foreground)] border-[var(--border)] hover:border-[var(--state-error)]"
            }`}
          >
            <div className="flex items-center justify-center gap-1 mb-1">
              <XCircle size={16} className={logLevelFilter === "ERROR" ? "text-[var(--state-on-error-container)]" : "text-[var(--state-error)]"} />
              <span className={`text-lg font-bold ${logLevelFilter === "ERROR" ? "text-[var(--state-on-error-container)]" : "text-[var(--state-error)]"}`}>
                {logCounts.ERROR}
              </span>
            </div>
            <div className={`text-xs font-semibold ${logLevelFilter === "ERROR" ? "text-[var(--state-on-error-container)]" : "text-[var(--muted-foreground)]"}`}>
              ERROR
            </div>
          </button>

          {/* WARNING (Amber) */}
          <button
            onClick={() => setLogLevelFilter("WARNING")}
            className={`p-3 rounded-lg border transition-all text-center ${
              logLevelFilter === "WARNING"
                ? "bg-[var(--state-warning-container)] border-2 border-[var(--state-warning)] text-[var(--state-on-warning-container)] shadow-xs"
                : "bg-[var(--card)] text-[var(--foreground)] border-[var(--border)] hover:border-[var(--state-warning)]"
            }`}
          >
            <div className="flex items-center justify-center gap-1 mb-1">
              <AlertTriangle size={16} className={logLevelFilter === "WARNING" ? "text-[var(--state-on-warning-container)]" : "text-[var(--state-warning)]"} />
              <span className={`text-lg font-bold ${logLevelFilter === "WARNING" ? "text-[var(--state-on-warning-container)]" : "text-[var(--state-warning)]"}`}>
                {logCounts.WARNING}
              </span>
            </div>
            <div className={`text-xs font-semibold ${logLevelFilter === "WARNING" ? "text-[var(--state-on-warning-container)]" : "text-[var(--muted-foreground)]"}`}>
              WARN
            </div>
          </button>

          {/* INFO (Sky Blue) */}
          <button
            onClick={() => setLogLevelFilter("INFO")}
            className={`p-3 rounded-lg border transition-all text-center ${
              logLevelFilter === "INFO"
                ? "bg-[var(--state-info-container)] border-2 border-[var(--state-info)] text-[var(--state-on-info-container)] shadow-xs"
                : "bg-[var(--card)] text-[var(--foreground)] border-[var(--border)] hover:border-[var(--state-info)]"
            }`}
          >
            <div className="flex items-center justify-center gap-1 mb-1">
              <Info size={16} className={logLevelFilter === "INFO" ? "text-[var(--state-on-info-container)]" : "text-[var(--state-info)]"} />
              <span className={`text-lg font-bold ${logLevelFilter === "INFO" ? "text-[var(--state-on-info-container)]" : "text-[var(--state-info)]"}`}>
                {logCounts.INFO}
              </span>
            </div>
            <div className={`text-xs font-semibold ${logLevelFilter === "INFO" ? "text-[var(--state-on-info-container)]" : "text-[var(--muted-foreground)]"}`}>
              INFO
            </div>
          </button>

          {/* DEBUG */}
          <button
            onClick={() => setLogLevelFilter("DEBUG")}
            className={`p-3 rounded-lg border transition-all text-center col-span-5 ${
              logLevelFilter === "DEBUG"
                ? "bg-[var(--state-debug-container)] border-2 border-[var(--state-debug)] text-[var(--state-on-debug-container)] shadow-xs"
                : "bg-[var(--card)] text-[var(--foreground)] border-[var(--border)] hover:border-[var(--state-debug)]"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <AlertCircle size={16} className={logLevelFilter === "DEBUG" ? "text-[var(--state-on-debug-container)]" : "text-[var(--muted-foreground)]"} />
              <span className={`text-lg font-bold ${logLevelFilter === "DEBUG" ? "text-[var(--state-on-debug-container)]" : "text-[var(--muted-foreground)]"}`}>
                {logCounts.DEBUG}
              </span>
              <span className={`text-xs font-semibold ${logLevelFilter === "DEBUG" ? "text-[var(--state-on-debug-container)]" : "text-[var(--muted-foreground)]"}`}>DEBUG</span>
            </div>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" size={20} />
          <input
            type="text"
            placeholder="Search logs..."
            value={logSearchQuery}
            onChange={(e) => setLogSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[var(--card)] text-[var(--foreground)] border border-[var(--border)] rounded-lg placeholder-zinc-500 focus:outline-none focus:border-[var(--primary)] transition-colors shadow-2xs"
          />
        </div>

        {/* View Full Logs Link */}
        <button
          onClick={handleOpenMainLogs}
          className="w-full flex items-center justify-center gap-2 p-3 bg-[var(--primary)] hover:opacity-90 active:scale-[0.98] text-[var(--primary-foreground)] rounded-lg transition-colors font-medium shadow-xs"
        >
          <ExternalLink size={18} />
          <span>View All {allServiceLogs.length} Logs in Full Viewer</span>
        </button>

        {/* Log Entries List */}
        <div className="bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] rounded-xl overflow-hidden shadow-xs">
          <div className="max-h-[500px] overflow-y-auto">
            {filteredLogs.length === 0 ? (
              <div className="p-8 text-center">
                <FileText size={48} className="mx-auto text-[var(--muted-foreground)] mb-3" />
                <p className="text-[var(--muted-foreground)]">No logs found matching your filters</p>
              </div>
            ) : (
              filteredLogs.slice(0, 50).map((log, index) => (
                <div
                  key={log.id}
                  className={`p-4 border-b border-[var(--border)] last:border-0 ${
                    log.level === "FATAL"
                      ? "bg-[var(--state-fatal-container)]/25 hover:bg-[var(--state-fatal-container)]/40"
                      : log.level === "ERROR"
                      ? "bg-[var(--state-error-container)]/25 hover:bg-[var(--state-error-container)]/40"
                      : log.level === "WARNING"
                      ? "bg-[var(--state-warning-container)]/25 hover:bg-[var(--state-warning-container)]/40"
                      : "hover:bg-[var(--surface-container-high)]"
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
 <span className="text-xs text-[var(--muted-foreground)]">
 {new Date(log.timestamp).toLocaleTimeString()}
 </span>
 </div>
 <p className="text-sm text-[var(--foreground)]  break-words">
 {log.message}
 </p>
 {log.endpoint && (
 <p className="text-xs text-[var(--muted-foreground)] mt-1 font-mono">
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
 <div className="p-3 bg-[var(--surface-container-low)] dark:bg-[var(--card)] border-t-2 border-[var(--border)]  text-center">
 <p className="text-sm text-[var(--muted-foreground)]">
 Showing 50 of {filteredLogs.length} logs. <button onClick={handleOpenMainLogs} className="text-[var(--primary)] dark:text-[var(--primary)] hover:underline font-medium">View all on logs page</button>
 </p>
 </div>
 )}
 </div>
 </div>
 ) : (
 // Actions Tab
 <div className="max-w-2xl mx-auto space-y-6">
 {/* Service Status Display */}
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border border border-[var(--border)]  rounded-xl p-6">
 <div className="flex items-center justify-between">
 <div>
 <h4 className="text-sm font-medium text-[var(--muted-foreground)] mb-1">Current Service Status</h4>
 <div className="flex items-center gap-2">
 <div className={`w-3 h-3 rounded-full ${serviceStatus === "Started" ? "bg-[var(--state-success)]" : "bg-[var(--state-error)]"} animate-pulse`} />
 <span className={`text-2xl font-bold ${serviceStatus === "Started" ? "text-[var(--state-success)]" : "text-[var(--state-error)]"}`}>
 {serviceStatus}
 </span>
 </div>
 </div>
 {serviceStatus === "Started" ? (
 <Activity size={48} className="text-[var(--state-success)]/20" />
 ) : (
 <Square size={48} className="text-[var(--state-error)]/20" />
 )}
 </div>
 </div>

 {/* Action Success Message */}
 {actionSuccess && (
 <div className="bg-[var(--state-success-container)]/60 border-2 border-[var(--state-success)]/20 rounded-xl p-4 flex items-center gap-3 animate-in fade-in slide-in- duration-200">
 <CheckCircle2 size={24} className="text-[var(--state-success)]" />
 <div>
 <p className="text-sm font-semibold text-[var(--state-success)]">Action Completed Successfully</p>
 <p className="text-xs text-[var(--state-on-success-container)] dark:text-[var(--state-success)]">Service is now {serviceStatus}</p>
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
 ? "border-[var(--primary)] dark:border-[var(--primary)] bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] hover:bg-[var(--primary)]/5 /5"
 : "border-[var(--border)]  bg-[var(--surface-container-low)] dark:bg-[var(--surface-container)] cursor-not-allowed opacity-50"
 }`}
 >
 <div className="flex items-center gap-3">
 <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
 serviceStatus === "Stopped" && !actionInProgress
 ? "bg-[var(--primary)] "
 : "bg-[var(--surface-container-high)]"
 }`}>
 <Play size={20} className="text-[var(--foreground)]" />
 </div>
 <div className="flex-1">
 <h5 className="text-base font-semibold text-[var(--foreground)] ">Start Service</h5>
 <p className="text-xs text-[var(--muted-foreground)]">
 {serviceStatus === "Started"
 ? "Service is already running"
 : actionInProgress
 ? "Starting service..."
 : "Start the service and begin processing"}
 </p>
 </div>
 {actionInProgress && serviceStatus === "Stopped" && (
 <div className="w-5 h-5 border-2 border-[var(--primary)] dark:border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
 )}
 </div>
 </button>

 {/* Stop Button */}
 <button
 onClick={() => handleAction("stop")}
 disabled={serviceStatus === "Stopped" || actionInProgress}
 className={`p-4 rounded-lg border-2 text-left transition-all ${
 serviceStatus === "Started" && !actionInProgress
 ? "border-[var(--state-error)]/40 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] hover:bg-[var(--state-error)]/5"
 : "border-[var(--border)]  bg-[var(--surface-container-low)] dark:bg-[var(--surface-container)] cursor-not-allowed opacity-50"
 }`}
 >
 <div className="flex items-center gap-3">
 <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
 serviceStatus === "Started" && !actionInProgress
 ? "bg-[var(--state-error)]"
 : "bg-[var(--surface-container-high)]"
 }`}>
 <Square size={20} className={serviceStatus === "Started" && !actionInProgress ? "text-white" : "text-[var(--foreground)]"} />
 </div>
 <div className="flex-1">
 <h5 className="text-base font-semibold text-[var(--foreground)] ">Stop Service</h5>
 <p className="text-xs text-[var(--muted-foreground)]">
 {serviceStatus === "Stopped"
 ? "Service is already stopped"
 : actionInProgress
 ? "Stopping service..."
 : "Stop the service and halt processing"}
 </p>
 </div>
 {actionInProgress && serviceStatus === "Started" && (
 <div className="w-5 h-5 border-2 border-[var(--state-error)]/40 border-t-transparent rounded-full animate-spin" />
 )}
 </div>
 </button>

 {/* Restart Button */}
 <button
 onClick={() => handleAction("restart")}
 disabled={serviceStatus === "Stopped" || actionInProgress}
 className={`p-4 rounded-lg border-2 text-left transition-all ${
 serviceStatus === "Started" && !actionInProgress
 ? "border-[var(--state-warning)]/40 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] hover:bg-[var(--state-warning)]/5"
 : "border-[var(--border)]  bg-[var(--surface-container-low)] dark:bg-[var(--surface-container)] cursor-not-allowed opacity-50"
 }`}
 >
 <div className="flex items-center gap-3">
 <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
 serviceStatus === "Started" && !actionInProgress
 ? "bg-[var(--state-warning)]"
 : "bg-[var(--surface-container-high)]"
 }`}>
 <RotateCw size={20} className={`text-white ${
 actionInProgress && serviceStatus === "Started" ? "animate-spin" : ""
 }`} />
 </div>
 <div className="flex-1">
 <h5 className="text-base font-semibold text-[var(--foreground)] ">Restart Service</h5>
 <p className="text-xs text-[var(--muted-foreground)]">
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
 <div className="bg-[var(--surface-container-low)] dark:bg-[var(--card)] border border-[var(--border)]  rounded-lg p-4">
 <div className="flex items-start gap-3">
 <AlertCircle size={20} className="text-[var(--primary)] dark:text-[var(--primary)] mt-0.5" />
 <div>
 <h6 className="text-sm font-semibold text-[var(--foreground)]  mb-1">Action Information</h6>
 <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
 Service actions will affect the availability and performance of {serviceName}. Stopping or restarting the service may cause temporary disruptions.
 </p>
 </div>
 </div>
 </div>

 {/* Confirmation Dialog */}
 {showConfirmation && pendingAction && (
 <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border border border-[var(--border)]  rounded-lg max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
 {/* Header */}
 <div className="flex items-center gap-3">
 <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getIconContainerClass()}`}>
 {getActionIcon()}
 </div>
 <div>
 <h5 className="text-lg font-semibold text-[var(--foreground)] ">Confirm {pendingAction.charAt(0).toUpperCase() + pendingAction.slice(1)}</h5>
 <p className="text-xs text-[var(--muted-foreground)]">Please review this action</p>
 </div>
 </div>

 {/* Details Box */}
 <div className="bg-[var(--surface-container-low)] dark:bg-[var(--card)] border border-[var(--border)]  rounded-lg p-4 space-y-3">
 <div className="flex items-center justify-between pb-2 border-b border-[var(--border)] ">
 <span className="text-sm text-[var(--muted-foreground)]">Service:</span>
 <span className="text-sm font-medium text-[var(--foreground)] ">{serviceName}</span>
 </div>
 <div className="flex items-center justify-between pb-2 border-b border-[var(--border)] ">
 <span className="text-sm text-[var(--muted-foreground)]">Current Status:</span>
 <span className={`text-sm font-semibold ${serviceStatus === "Started" ? "text-[var(--state-success)]" : "text-[var(--state-error)]"}`}>
 {serviceStatus}
 </span>
 </div>
 <div className="flex items-center justify-between">
 <span className="text-sm text-[var(--muted-foreground)]">Action:</span>
 <span className={`text-sm font-semibold ${getActionColorClass()}`}>
 {pendingAction.charAt(0).toUpperCase() + pendingAction.slice(1)} Service
 </span>
 </div>
 </div>

 {/* Warning */}
 <div className="flex items-start gap-2 bg-[var(--state-warning)]/10 border border-[var(--state-warning)]/20 rounded-lg p-3">
 <AlertTriangle size={16} className="text-[var(--state-warning)] mt-0.5 flex-shrink-0" />
 <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
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
 className="px-6 py-3 bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)] hover:bg-[var(--surface-container-high)] text-[var(--foreground)]  rounded-lg font-medium transition-colors"
 >
 Cancel
 </button>
 </div>
 </div>
 </div>
 )}
 </div>
 )}
</DetailSidePanel>
  );
}