import { useState, useEffect, useRef } from "react";
import { useLayout } from "../contexts/LayoutContext";
import { useSearchParams, Link } from "react-router-dom";
import { generateWorkListLogs, generateGeneralLogs, type LogEntry, type LogLevel } from "../data/mockLogs";
import {
 Search,
 Filter,
 Download,
 ChevronDown,
 ChevronUp,
 X,
 Calendar,
 Clock,
 AlertCircle,
 CheckCircle2,
 XCircle,
 Info,
 AlertTriangle,
 FileText,
 Link as LinkIcon,
 Check,
 Server,
 Skull,
 Sparkles,
 Send,
 ArrowDown,
 ArrowUp,
 ChevronRight,
 Home,
} from "lucide-react";

// LogLevel and LogEntry are now imported from ../data/mockLogs

// Services from Monitoring Dashboard
const logServices = [
 "Conductor",
 "Gateway",
 "Host Adapter",
 "Work",
 "Scan",
 "Storage",
 "Item",
 "Inventory",
];

// Generate work list IDs to match WorkList.tsx (WL-001 through WL-188)
const generateWorkListIds = (): string[] => {
 const ids: string[] = [];
 // Pick: 67 items (3 + 12 + 8 + 42 + 2)
 // Replenishment: 47 items (1 + 5 + 3 + 38)
 // Cycle Count: 31 items (2 + 1 + 28)
 // Inspection: 43 items (2 + 4 + 2 + 35)
 // Total: 188 items
 for (let i = 1; i <= 188; i++) {
 ids.push(`WL-${String(i).padStart(3, '0')}`);
 }
 return ids;
};

const workListIdsForLogs = generateWorkListIds();

// Old generateLogEntries function - now replaced with shared data
const generateLogEntriesOld = (): LogEntry[] => {
 const entries: LogEntry[] = [];
 const correlationIds = ["COR-001", "COR-002", "COR-003", "COR-004", "COR-005"];
 const userIds = ["user-123", "user-456", "user-789", "user-101", "user-202"];
 const sessionIds = ["sess-aaa", "sess-bbb", "sess-ccc", "sess-ddd"];
 
 // Work List IDs that will be shared across services
 const workListIds = [
 "WL-001", "WL-002", "WL-003", "WL-004", "WL-005",
 "WL-010", "WL-015", "WL-020", "WL-025", "WL-030",
 "WL-050", "WL-075", "WL-100", "WL-125", "WL-150"
 ];
 
 const endpoints = [
 "/api/inventory/update",
 "/api/work/assign",
 "/api/work/create",
 "/api/work/complete",
 "/api/storage/allocate",
 "/api/scan/verify",
 "/api/item/retrieve",
 ];
 
 const workListMessages = {
 INFO: [
 "Work list assigned successfully",
 "Work list created and queued",
 "Work list completed",
 "Work list status updated",
 "Work list validated",
 "Work list sent to device",
 "Work list acknowledged by operator",
 ],
 WARNING: [
 "Work list allocation timeout warning",
 "Work list priority changed",
 "Work list delayed due to resource constraints",
 "Work list reassignment required",
 ],
 ERROR: [
 "Failed to assign work list",
 "Work list validation error",
 "Work list update failed",
 "Work list not found",
 "Work list processing error",
 ],
 DEBUG: [
 "Work list query executed",
 "Work list state transition",
 "Work list allocation attempt",
 "Work list priority calculation",
 ],
 };
 
 const messages = {
 INFO: [
 "Request processed successfully",
 "User authentication completed",
 "Database connection established",
 "Cache updated successfully",
 "Task scheduled for execution",
 "Configuration loaded",
 "Service started successfully",
 "Health check passed",
 ],
 WARNING: [
 "High memory usage detected",
 "Slow query performance",
 "Retry attempt initiated",
 "Cache miss - fetching from database",
 "Rate limit approaching threshold",
 "Connection pool near capacity",
 "Deprecated API endpoint used",
 ],
 ERROR: [
 "Database connection timeout",
 "Failed to process request",
 "Authentication failed",
 "Null pointer exception",
 "Service unavailable",
 "Invalid request parameters",
 "Transaction rollback occurred",
 ],
 DEBUG: [
 "Entering method processRequest",
 "Query execution time: 45ms",
 "Cache lookup performed",
 "Parameter validation completed",
 "Response serialization started",
 "Connection acquired from pool",
 ],
 FATAL: [
 "System crash detected",
 "Critical error occurred",
 "Data corruption detected",
 "Service failure",
 "Unrecoverable error",
 ],
 };

 let counter = 1;
 const now = new Date();

 // First, generate work list related entries for Host Adapter, Work, and Conductor
 // This ensures each work list ID appears across these services
 const workListServices = ["Host Adapter", "Work", "Conductor"];
 
 workListIds.forEach((workListId) => {
 // Generate a timestamp for this work list lifecycle
 const baseMinutesAgo = Math.floor(Math.random() * 1440);
 
 workListServices.forEach((service, serviceIndex) => {
 // Each service has entries slightly offset in time (workflow progression)
 const minutesAgo = baseMinutesAgo - (serviceIndex * 2); // 2 minute offsets
 const timestamp = new Date(now.getTime() - minutesAgo * 60000);
 
 const level: LogLevel = Math.random() > 0.15 ? "INFO" : (["WARNING", "ERROR", "DEBUG"] as LogLevel[])[Math.floor(Math.random() * 3)];
 const messageList = workListMessages[level] || workListMessages.INFO;
 
 const fileDate = timestamp.toISOString().split('T')[0];
 const fileHour = timestamp.getHours();
 const fileSequence = Math.floor(counter / 50);
 const logFileName = `${service.toLowerCase().replace(/\s+/g, '-')}_${fileDate}_${String(fileHour).padStart(2, '0')}_${String(fileSequence).padStart(3, '0')}.log`;
 
 const entry: LogEntry = {
 id: `LOG-${String(counter).padStart(6, "0")}`,
 service,
 logFileName,
 timestamp: timestamp.toISOString(),
 level,
 message: messageList[Math.floor(Math.random() * messageList.length)],
 workListId,
 correlationId: Math.random() > 0.5 ? correlationIds[Math.floor(Math.random() * correlationIds.length)] : undefined,
 userId: Math.random() > 0.5 ? userIds[Math.floor(Math.random() * userIds.length)] : undefined,
 sessionId: Math.random() > 0.6 ? sessionIds[Math.floor(Math.random() * sessionIds.length)] : undefined,
 ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
 duration: Math.random() > 0.5 ? `${Math.floor(Math.random() * 500)}ms` : undefined,
 endpoint: Math.random() > 0.5 ? endpoints[Math.floor(Math.random() * endpoints.length)] : undefined,
 statusCode: Math.random() > 0.5 ? [200, 201, 400, 404, 500][Math.floor(Math.random() * 5)] : undefined,
 hostAdapterType: service === "Host Adapter" ? (Math.random() > 0.5 ? "Inbound" : "Outbound") : undefined,
 hostAdapterStatus: service === "Host Adapter" ? (Math.random() > 0.2 ? "Accepted" : "Rejected") : undefined,
 stackTrace: level === "ERROR" && Math.random() > 0.5 ? 
 `at com.warehouse.service.${service}Service.process(${service}Service.java:${Math.floor(Math.random() * 200) + 1})\n` +
 `at com.warehouse.controller.${service}Controller.handle(${service}Controller.java:${Math.floor(Math.random() * 100) + 1})\n` +
 `at com.warehouse.core.RequestProcessor.execute(RequestProcessor.java:${Math.floor(Math.random() * 150) + 1})` 
 : undefined,
 metadata: Math.random() > 0.7 ? {
 threadId: `thread-${Math.floor(Math.random() * 10) + 1}`,
 className: `${service}Service`,
 method: "processRequest",
 workListId,
 } : undefined,
 };
 
 entries.push(entry);
 counter++;
 });
 });

 // Then generate regular entries for all services
 logServices.forEach((service) => {
 // Generate 15-25 additional log entries per service (reduced since we added work list entries)
 const entryCount = Math.floor(Math.random() * 11) + 15;
 
 for (let i = 0; i < entryCount; i++) {
 const level: LogLevel = ["INFO", "WARNING", "ERROR", "DEBUG", "FATAL"][
 Math.floor(Math.random() * 100) < 70 ? 0 : Math.floor(Math.random() * 4) + 1
 ] as LogLevel;
 
 const correlationId = Math.random() > 0.7 ? correlationIds[Math.floor(Math.random() * correlationIds.length)] : undefined;
 const userId = Math.random() > 0.5 ? userIds[Math.floor(Math.random() * userIds.length)] : undefined;
 const sessionId = Math.random() > 0.6 ? sessionIds[Math.floor(Math.random() * sessionIds.length)] : undefined;
 
 const minutesAgo = Math.floor(Math.random() * 1440); // Last 24 hours
 const timestamp = new Date(now.getTime() - minutesAgo * 60000);
 
 // Generate log file name based on timestamp (shows rollover)
 const fileDate = timestamp.toISOString().split('T')[0]; // YYYY-MM-DD
 const fileHour = timestamp.getHours();
 const fileSequence = Math.floor(counter / 50); // Files roll over every ~50 entries
 const logFileName = `${service.toLowerCase().replace(/\s+/g, '-')}_${fileDate}_${String(fileHour).padStart(2, '0')}_${String(fileSequence).padStart(3, '0')}.log`;
 
 const entry: LogEntry = {
 id: `LOG-${String(counter).padStart(6, "0")}`,
 service,
 logFileName,
 timestamp: timestamp.toISOString(),
 level,
 message: messages[level][Math.floor(Math.random() * messages[level].length)],
 correlationId,
 userId,
 sessionId,
 ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
 duration: Math.random() > 0.5 ? `${Math.floor(Math.random() * 500)}ms` : undefined,
 endpoint: Math.random() > 0.5 ? endpoints[Math.floor(Math.random() * endpoints.length)] : undefined,
 statusCode: Math.random() > 0.5 ? [200, 201, 400, 404, 500][Math.floor(Math.random() * 5)] : undefined,
 hostAdapterType: service === "Host Adapter" ? (Math.random() > 0.5 ? "Inbound" : "Outbound") : undefined,
 hostAdapterStatus: service === "Host Adapter" ? (Math.random() > 0.2 ? "Accepted" : "Rejected") : undefined,
 stackTrace: level === "ERROR" && Math.random() > 0.5 ? 
 `at com.warehouse.service.${service}Service.process(${service}Service.java:${Math.floor(Math.random() * 200) + 1})\n` +
 `at com.warehouse.controller.${service}Controller.handle(${service}Controller.java:${Math.floor(Math.random() * 100) + 1})\n` +
 `at com.warehouse.core.RequestProcessor.execute(RequestProcessor.java:${Math.floor(Math.random() * 150) + 1})` 
 : undefined,
 metadata: Math.random() > 0.7 ? {
 threadId: `thread-${Math.floor(Math.random() * 10) + 1}`,
 className: `${service}Service`,
 method: "processRequest",
 } : undefined,
 };
 
 entries.push(entry);
 counter++;
 }
 });

 // Add related messages for some correlation IDs
 entries.forEach(entry => {
 if (entry.correlationId) {
 const relatedIds = entries
 .filter(e => e.correlationId === entry.correlationId && e.id !== entry.id)
 .slice(0, 5)
 .map(e => e.id);
 if (relatedIds.length > 0) {
 entry.relatedMessages = relatedIds;
 }
 }
 });

 return entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// Generate log entries using shared functions to match WorkList page
const workListLogs = generateWorkListLogs(workListIdsForLogs);
const generalLogs = generateGeneralLogs();
const allLogEntries = [...workListLogs, ...generalLogs].sort(
 (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
);

export function Logs() {
 const { theme, setShowAI } = useLayout();
 const [searchParams] = useSearchParams();
 const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set());
 const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
 const [filteredEntries, setFilteredEntries] = useState<LogEntry[]>([]);
 const [searchTerm, setSearchTerm] = useState("");
 const [selectedLevels, setSelectedLevels] = useState<Set<LogLevel>>(new Set(["INFO", "WARNING", "ERROR", "DEBUG", "FATAL"]));
 const [matchValue, setMatchValue] = useState("");
 const [matchField, setMatchField] = useState<"correlationId" | "userId" | "sessionId" | "workListId" | "messageId">("workListId");
 const [timeRange, setTimeRange] = useState("24h");
 const [showFilterDropdown, setShowFilterDropdown] = useState(false);
 const [showServiceDropdown, setShowServiceDropdown] = useState(false);
 const [showLevelDropdown, setShowLevelDropdown] = useState(false);
 const [selectedEntry, setSelectedEntry] = useState<LogEntry | null>(null);
 const [showDetailPanel, setShowDetailPanel] = useState(false);
 const [activeTab, setActiveTab] = useState<"entry" | "related" | "payload">("entry");
 const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
 const [relatedSearchTerm, setRelatedSearchTerm] = useState("");
 const [expandedRelatedGroups, setExpandedRelatedGroups] = useState<Set<string>>(new Set());
 const [groupByMessageId, setGroupByMessageId] = useState(false);

 // Refs for click-outside detection
 const serviceDropdownRef = useRef<HTMLDivElement>(null);
 const levelDropdownRef = useRef<HTMLDivElement>(null);

 // Handle click outside to close dropdowns
 useEffect(() => {
 const handleClickOutside = (event: MouseEvent) => {
 if (serviceDropdownRef.current && !serviceDropdownRef.current.contains(event.target as Node)) {
 setShowServiceDropdown(false);
 }
 if (levelDropdownRef.current && !levelDropdownRef.current.contains(event.target as Node)) {
 setShowLevelDropdown(false);
 }
 };

 document.addEventListener("mousedown", handleClickOutside);
 return () => {
 document.removeEventListener("mousedown", handleClickOutside);
 };
 }, []);

 // Handle URL parameters for troubleshooting navigation
 useEffect(() => {
 const service = searchParams.get("service");
 const workListId = searchParams.get("workListId");
 const openPanel = searchParams.get("openPanel");
 const tab = searchParams.get("tab");

 if (service) {
 setSelectedServices(new Set([service]));
 }

 if (workListId) {
 setMatchField("workListId");
 setMatchValue(workListId);
 }

 if (openPanel === "true" && tab) {
 setActiveTab(tab as "entry" | "related" | "payload");
 // Find the first matching entry and open it
 setTimeout(() => {
 const matchingEntry = allLogEntries.find(
 entry => entry.service === service && entry.workListId === workListId
 );
 if (matchingEntry) {
 setSelectedEntry(matchingEntry);
 setShowDetailPanel(true);
 }
 }, 100);
 }
 }, [searchParams]);

 useEffect(() => {
 // Filter by selected services
 let filtered = allLogEntries.filter(entry => selectedServices.has(entry.service));

 // Filter by time range
 const now = new Date();
 const timeRangeMap: Record<string, number> = {
 "1h": 60,
 "6h": 360,
 "12h": 720,
 "24h": 1440,
 "7d": 10080,
 "30d": 43200,
 };
 const minutes = timeRangeMap[timeRange] || 1440;
 const cutoff = new Date(now.getTime() - minutes * 60000);
 filtered = filtered.filter(entry => new Date(entry.timestamp) >= cutoff);

 // Filter by log level
 filtered = filtered.filter(entry => selectedLevels.has(entry.level));

 // Filter by match value
 if (matchValue.trim()) {
 filtered = filtered.filter(entry => {
 const fieldValue = entry[matchField];
 return fieldValue && fieldValue.toLowerCase().includes(matchValue.toLowerCase());
 });
 }

 // Filter by search term
 if (searchTerm.trim()) {
 const term = searchTerm.toLowerCase();
 filtered = filtered.filter(entry => 
 entry.message.toLowerCase().includes(term) ||
 entry.service.toLowerCase().includes(term) ||
 entry.id.toLowerCase().includes(term) ||
 (entry.endpoint && entry.endpoint.toLowerCase().includes(term))
 );
 }

 setFilteredEntries(filtered);
 }, [selectedServices, selectedLevels, timeRange, matchValue, matchField, searchTerm]);

 const toggleService = (service: string) => {
 const newSelected = new Set(selectedServices);
 if (newSelected.has(service)) {
 newSelected.delete(service);
 } else {
 newSelected.add(service);
 }
 setSelectedServices(newSelected);
 };

 const toggleLevel = (level: LogLevel) => {
 const newSelected = new Set(selectedLevels);
 if (newSelected.has(level)) {
 newSelected.delete(level);
 } else {
 newSelected.add(level);
 }
 // Ensure at least one level is selected
 if (newSelected.size > 0) {
 setSelectedLevels(newSelected);
 }
 };

 const selectAllServices = () => {
 setSelectedServices(new Set(logServices));
 };

 const deselectAllServices = () => {
 setSelectedServices(new Set());
 };

 const selectAllLevels = () => {
 setSelectedLevels(new Set(["INFO", "WARNING", "ERROR", "DEBUG", "FATAL"] as LogLevel[]));
 };

 const deselectAllLevels = () => {
 // Keep at least one level selected
 setSelectedLevels(new Set(["INFO"] as LogLevel[]));
 };

 const toggleGroup = (service: string) => {
 const newExpanded = new Set(expandedGroups);
 if (newExpanded.has(service)) {
 newExpanded.delete(service);
 } else {
 newExpanded.add(service);
 }
 setExpandedGroups(newExpanded);
 };

 const toggleRelatedGroup = (service: string) => {
 const newExpanded = new Set(expandedRelatedGroups);
 if (newExpanded.has(service)) {
 newExpanded.delete(service);
 } else {
 newExpanded.add(service);
 }
 setExpandedRelatedGroups(newExpanded);
 };

 const getLevelIcon = (level: LogLevel) => {
 switch (level) {
 case "INFO":
 return <Info size={14} className="text-[var(--state-info)]" />;
 case "WARNING":
 return <AlertTriangle size={14} className="text-[var(--state-warning)]" />;
 case "ERROR":
 return <XCircle size={14} className="text-[var(--state-error)]" />;
 case "DEBUG":
 return <FileText size={14} className="text-[var(--muted-foreground)]" />;
 case "FATAL":
 return <Skull size={14} className="text-[var(--state-error)]" />;
 }
 };

 const getLevelColor = (level: LogLevel) => {
 switch (level) {
 case "INFO":
 return "text-[var(--state-info)]";
 case "WARNING":
 return "text-[var(--state-warning)]";
 case "ERROR":
 return "text-[var(--state-error)]";
 case "DEBUG":
 return "text-[var(--muted-foreground)]";
 case "FATAL":
 return "text-[var(--state-error)]";
 }
 };

 const formatTimestamp = (timestamp: string) => {
 const date = new Date(timestamp);
 const now = new Date();
 const diff = now.getTime() - date.getTime();
 const minutes = Math.floor(diff / 60000);
 
 if (minutes < 1) return "Just now";
 if (minutes < 60) return `${minutes}m ago`;
 if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
 return date.toLocaleString();
 };

 const handleEntryClick = (entry: LogEntry) => {
 setSelectedEntry(entry);
 setShowDetailPanel(true);
 setActiveTab("entry");
 };

 const handleResend = (entry: LogEntry) => {
 // In a real application, this would send the message to the host system
 alert(`Resending ${entry.hostAdapterType} message:\n\nLog ID: ${entry.id}\nMessage: ${entry.message}\n\nThis would normally send the payload to the host adapter for reprocessing.`);
 };

 const generateHostAdapterPayload = (entry: LogEntry) => {
 // Generate GUID fallback if no messageId exists
 const generateGuid = () => {
 return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
 const r = Math.random() * 16 | 0;
 const v = c === 'x' ? r : (r & 0x3 | 0x8);
 return v.toString(16);
 });
 };

 return {
 version: "1.0.0",
 action: entry.hostAdapterType === "Inbound" ? "RECEIVE_ORDER" : "SEND_SHIPMENT",
 timestamp: entry.timestamp,
 messageId: entry.messageId || generateGuid(),
 messageSource: entry.messageSource || "HOST",
 instanceId: `inst-${Math.random().toString(36).substr(2, 9)}`,
 warehouseId: `WH-${Math.floor(Math.random() * 100) + 1}`,
 areaId: `AREA-${String.fromCharCode(65 + Math.floor(Math.random() * 5))}`,
 status: entry.statusCode?.toString() || "200",
 errorMsg: entry.level === "ERROR" ? entry.message : null,
 errorId: entry.level === "ERROR" ? `ERR_${Math.floor(Math.random() * 10000)}` : null,
 params: {
 workListId: entry.workListId || null,
 correlationId: entry.correlationId || null,
 userId: entry.userId || null,
 sessionId: entry.sessionId || null,
 },
 messageType: entry.hostAdapterType === "Inbound" ? "InboundOrder" : "OutboundShipment",
 createdTimestamp: entry.timestamp,
 modifiedTimestamp: new Date().toISOString(),
 errors: entry.level === "ERROR" ? [
 {
 errorId: `ERR_${Math.floor(Math.random() * 10000)}`,
 lineId: `LINE_${Math.floor(Math.random() * 100)}`,
 description: entry.message,
 }
 ] : [],
 isDuplicate: Math.random() > 0.8,
 };
 };

 const getRelatedEntries = (entry: LogEntry): LogEntry[] => {
 // Find all entries that share the same matching field value
 // Priority: messageId > workListId > correlationId > userId > sessionId
 const matchingField = entry.messageId 
 ? "messageId" 
 : entry.workListId 
 ? "workListId" 
 : entry.correlationId 
 ? "correlationId" 
 : entry.userId 
 ? "userId" 
 : entry.sessionId 
 ? "sessionId" 
 : null;
 
 if (!matchingField) {
 return [];
 }
 
 const matchingValue = entry[matchingField];
 if (!matchingValue) {
 return [];
 }
 
 // Return all entries (excluding the current one) that have the same matching field value
 return allLogEntries.filter(e => 
 e.id !== entry.id && e[matchingField] === matchingValue
 );
 };

 // Group entries by service when viewing across multiple logs with match value
 const shouldGroupByService = selectedServices.size > 1 && matchValue.trim() !== "" && !groupByMessageId;

 // Group entries by Message ID when groupByMessageId is enabled
 const shouldGroupByMessageId = groupByMessageId && selectedServices.has("Host Adapter");

 const groupedEntries = shouldGroupByService
 ? Array.from(selectedServices).reduce((acc, service) => {
 const serviceEntries = filteredEntries.filter(e => e.service === service);
 if (serviceEntries.length > 0) {
 acc[service] = serviceEntries;
 }
 return acc;
 }, {} as Record<string, LogEntry[]>)
 : {};

 // Group by Message ID
 const messageIdGroups = shouldGroupByMessageId
 ? filteredEntries.reduce((acc, entry) => {
 if (entry.messageId) {
 if (!acc[entry.messageId]) {
 acc[entry.messageId] = [];
 }
 acc[entry.messageId].push(entry);
 }
 return acc;
 }, {} as Record<string, LogEntry[]>)
 : {};

 const relatedEntries = selectedEntry ? getRelatedEntries(selectedEntry) : [];
 const hasRelatedEntries = relatedEntries.length > 0;

 // Filter and group related entries
 const filteredRelatedEntries = relatedEntries.filter(entry => {
 if (!relatedSearchTerm.trim()) return true;
 const term = relatedSearchTerm.toLowerCase();
 return (
 entry.message.toLowerCase().includes(term) ||
 entry.service.toLowerCase().includes(term) ||
 entry.id.toLowerCase().includes(term) ||
 (entry.endpoint && entry.endpoint.toLowerCase().includes(term))
 );
 });

 const groupedRelatedEntries = filteredRelatedEntries.reduce((acc, entry) => {
 if (!acc[entry.service]) {
 acc[entry.service] = [];
 }
 acc[entry.service].push(entry);
 return acc;
 }, {} as Record<string, LogEntry[]>);

 const hasMultipleRelatedServices = Object.keys(groupedRelatedEntries).length > 1;

 const clearAllFilters = () => {
 setSelectedServices(new Set());
 setSelectedLevels(new Set(["INFO", "WARNING", "ERROR", "DEBUG", "FATAL"] as LogLevel[]));
 setSearchTerm("");
 setMatchValue("");
 setTimeRange("24h");
 setGroupByMessageId(false);
 };

 const hasActiveFilters =
 selectedServices.size > 0 ||
 selectedLevels.size !== 5 ||
 searchTerm.trim() !== "" ||
 matchValue.trim() !== "" ||
 timeRange !== "24h" ||
 groupByMessageId;

 useEffect(() => {
 if (shouldGroupByService) {
 // Auto-expand all groups when grouping is active or when match value changes
 setExpandedGroups(new Set(Object.keys(groupedEntries)));
 } else if (shouldGroupByMessageId) {
 // Auto-expand all message ID groups
 setExpandedGroups(new Set(Object.keys(messageIdGroups)));
 } else {
 // Collapse all groups when not grouping
 setExpandedGroups(new Set());
 }
 }, [shouldGroupByService, shouldGroupByMessageId, matchValue, groupByMessageId]);

 useEffect(() => {
 if (hasMultipleRelatedServices) {
 // Auto-expand all related groups when there are multiple services
 setExpandedRelatedGroups(new Set(Object.keys(groupedRelatedEntries)));
 }
 }, [hasMultipleRelatedServices, activeTab]);

 return (
 <div className="flex flex-col min-h-screen bg-[var(--background)] dark:bg-[var(--background)] text-[var(--foreground)]">
 {/* Sticky Header */}
 <div className="sticky top-0 z-40 bg-[var(--background)]/95 backdrop-blur-md text-[var(--foreground)] border-b border-[var(--border)] px-8 pt-6 pb-4">
 <div className="flex items-center justify-between gap-4">
 <nav className="flex items-center gap-2 text-sm">
 <Link to="/app/home" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] dark:hover:text-[var(--primary)] transition-colors flex items-center gap-1">
 <Home size={14} />Home
 </Link>
 <ChevronRight size={14} className="text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]" />
 <Link to="/app/navigation?section=system" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] dark:hover:text-[var(--primary)] transition-colors">System</Link>
 <ChevronRight size={14} className="text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]" />
 <span className="text-[var(--foreground)]  font-semibold text-lg flex items-center gap-2">
 <FileText size={20} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 Logs
 </span>
 </nav>
 <div className="flex items-center gap-2">
 <button onClick={() => window.location.reload()} className="p-2 rounded-lg border-[var(--border)]  bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--surface-container-low)] dark:hover:bg-[var(--surface-container-high)] text-[var(--muted-foreground)] transition-colors" title="Refresh">
 <RefreshCw size={16} />
 </button>
 <button className="p-2 rounded-lg border-[var(--border)]  bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--surface-container-low)] dark:hover:bg-[var(--surface-container-high)] text-[var(--muted-foreground)] transition-colors" title="Export">
 <Download size={16} />
 </button>
 </div>
 </div>
 </div>
 <div className={`flex-1 overflow-y-auto p-6 transition-all duration-300 ${showDetailPanel ? 'mr-[600px]' : ''}`}>
 <div className="max-w-[1800px] mx-auto">

 {/* Filters */}
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-xl p-6 mb-6">
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
 {/* Service Selection */}
 <div className="relative" ref={serviceDropdownRef}>
 <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
 Services
 </label>
 <div
 className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg p-2 cursor-pointer"
 onClick={() => setShowServiceDropdown(!showServiceDropdown)}
 >
 {selectedServices.size === 0 ? (
 <span className="text-[var(--muted-foreground)] text-sm">
 No services selected
 </span>
 ) : selectedServices.size === 1 ? (
 <span className="text-[var(--foreground)]  text-sm">
 {Array.from(selectedServices)[0]}
 </span>
 ) : (
 <div className="flex flex-wrap gap-1">
 {Array.from(selectedServices).slice(0, 2).map((service) => (
 <span
 key={service}
 className="inline-flex items-center gap-1 px-2 py-0.5 bg-[var(--primary)]  text-[var(--primary-foreground)] rounded text-xs"
 >
 {service}
 </span>
 ))}
 {selectedServices.size > 2 && (
 <span className="text-xs text-[var(--muted-foreground)] px-2 py-0.5">
 +{selectedServices.size - 2} more
 </span>
 )}
 </div>
 )}
 </div>
 {showServiceDropdown && (
 <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg max-h-64 overflow-y-auto z-20">
 {/* Select All / Deselect All */}
 <div className="sticky top-0 z-40 bg-[var(--background)]/95 backdrop-blur-md text-[var(--foreground)] border-b border-[var(--border)] px-8 pt-6 pb-4">
 <button
 onClick={(e) => {
 e.stopPropagation();
 selectAllServices();
 }}
 className="flex-1 px-2 py-1.5 bg-[var(--primary)]  hover:opacity-90 active:scale-[0.98] text-[var(--primary-foreground)] rounded text-xs font-medium transition-colors"
 >
 Select All
 </button>
 <button
 onClick={(e) => {
 e.stopPropagation();
 deselectAllServices();
 }}
 className="flex-1 px-2 py-1.5 bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)] hover:bg-[var(--surface-container-high)] text-[var(--foreground)]  rounded text-xs font-medium transition-colors"
 >
 Deselect All
 </button>
 </div>
 {logServices.map((service) => (
 <button
 key={service}
 onClick={() => toggleService(service)}
 className={`w-full px-3 py-2 text-left text-sm transition-colors flex items-center gap-2 ${
 selectedServices.has(service)
 ? "bg-[var(--primary)]/10 text-[var(--primary)] dark:text-[var(--primary)]"
 : "text-[var(--foreground)] hover:bg-[var(--surface-container-low)] dark:hover:bg-[var(--surface-container-high)]"
 }`}
 >
 <div className={`w-4 h-4 rounded border flex items-center justify-center ${
 selectedServices.has(service)
 ? "bg-[var(--primary)]  border-[var(--primary)] dark:border-[var(--primary)]"
 : "border-[var(--border)] dark:border-[var(--border)]"
 }`}>
 {selectedServices.has(service) && <Check size={12} className="text-[var(--foreground)]" />}
 </div>
 {service}
 </button>
 ))}
 </div>
 )}
 </div>

 {/* Log Level Filter */}
 <div className="relative" ref={levelDropdownRef}>
 <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
 Log Levels
 </label>
 <div
 className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg p-2 cursor-pointer"
 onClick={() => setShowLevelDropdown(!showLevelDropdown)}
 >
 <div className="flex flex-wrap gap-1">
 {Array.from(selectedLevels).slice(0, 2).map((level) => (
 <span
 key={level}
 className="inline-flex items-center gap-1 px-2 py-0.5 bg-[var(--primary)]  text-[var(--primary-foreground)] rounded text-xs"
 >
 {level}
 </span>
 ))}
 {selectedLevels.size > 2 && (
 <span className="text-xs text-[var(--muted-foreground)] px-2 py-0.5">
 +{selectedLevels.size - 2} more
 </span>
 )}
 </div>
 </div>
 {showLevelDropdown && (
 <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg z-20">
 {/* Select All / Deselect All */}
 <div className="sticky top-0 z-40 bg-[var(--background)]/95 backdrop-blur-md text-[var(--foreground)] border-b border-[var(--border)] px-8 pt-6 pb-4">
 <button
 onClick={(e) => {
 e.stopPropagation();
 selectAllLevels();
 }}
 className="flex-1 px-2 py-1.5 bg-[var(--primary)]  hover:opacity-90 active:scale-[0.98] text-[var(--primary-foreground)] rounded text-xs font-medium transition-colors"
 >
 Select All
 </button>
 <button
 onClick={(e) => {
 e.stopPropagation();
 deselectAllLevels();
 }}
 className="flex-1 px-2 py-1.5 bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)] hover:bg-[var(--surface-container-high)] text-[var(--foreground)]  rounded text-xs font-medium transition-colors"
 >
 Deselect All
 </button>
 </div>
 {(["INFO", "WARNING", "ERROR", "DEBUG", "FATAL"] as LogLevel[]).map((level) => (
 <button
 key={level}
 onClick={() => toggleLevel(level)}
 className={`w-full px-3 py-2 text-left text-sm transition-colors flex items-center gap-2 ${
 selectedLevels.has(level)
 ? "bg-[var(--primary)]/10 text-[var(--primary)] dark:text-[var(--primary)]"
 : "text-[var(--foreground)] hover:bg-[var(--surface-container-low)] dark:hover:bg-[var(--surface-container-high)]"
 }`}
 >
 <div className={`w-4 h-4 rounded border flex items-center justify-center ${
 selectedLevels.has(level)
 ? "bg-[var(--primary)]  border-[var(--primary)] dark:border-[var(--primary)]"
 : "border-[var(--border)] dark:border-[var(--border)]"
 }`}>
 {selectedLevels.has(level) && <Check size={12} className="text-[var(--foreground)]" />}
 </div>
 {level}
 </button>
 ))}
 </div>
 )}
 </div>

 {/* Time Range */}
 <div>
 <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
 Time Range
 </label>
 <select
 value={timeRange}
 onChange={(e) => setTimeRange(e.target.value)}
 className="w-full bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg px-3 py-2 text-sm text-[var(--foreground)] "
 >
 <option value="1h">Last Hour</option>
 <option value="6h">Last 6 Hours</option>
 <option value="12h">Last 12 Hours</option>
 <option value="24h">Last 24 Hours</option>
 <option value="7d">Last 7 Days</option>
 <option value="30d">Last 30 Days</option>
 </select>
 </div>

 {/* Search */}
 <div>
 <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
 Search
 </label>
 <div className="relative">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" size={16} />
 <input
 type="text"
 placeholder="Search logs..."
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 className="w-full bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg pl-10 pr-3 py-2 text-sm text-[var(--foreground)]  placeholder-zinc-500"
 />
 </div>
 </div>
 </div>

 {/* Match Value Section */}
 <div className="mt-4 pt-4 border-t border-[var(--border)] ">
 <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
 View Across Logs by Matching Value
 </label>
 <div className="flex gap-2">
 <select
 value={matchField}
 onChange={(e) => setMatchField(e.target.value as any)}
 className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg px-3 py-2 text-sm text-[var(--foreground)] "
 >
 <option value="correlationId">Correlation ID</option>
 <option value="userId">User ID</option>
 <option value="sessionId">Session ID</option>
 <option value="workListId">Work List ID</option>
 <option value="messageId">Message ID</option>
 </select>
 <div className="relative flex-1">
 <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" size={16} />
 <input
 type="text"
 placeholder={`Enter ${matchField === "correlationId" ? "correlation" : matchField === "userId" ? "user" : matchField === "sessionId" ? "session" : matchField === "messageId" ? "message" : "work list"} ID...`}
 value={matchValue}
 onChange={(e) => setMatchValue(e.target.value)}
 className="w-full bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg pl-10 pr-3 py-2 text-sm text-[var(--foreground)]  placeholder-zinc-500"
 />
 </div>
 {matchValue && (
 <button
 onClick={() => setMatchValue("")}
 className="px-3 py-2 bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)] text-[var(--foreground)] rounded-lg hover:bg-[var(--surface-container-high)] transition-colors"
 >
 <X size={16} />
 </button>
 )}
 </div>
 {/* Group by Message ID option */}
 {selectedServices.has("Host Adapter") && (
 <div className="mt-3 flex items-center gap-2">
 <button
 onClick={() => setGroupByMessageId(!groupByMessageId)}
 className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
 groupByMessageId
 ? "bg-[var(--primary)]  text-[var(--primary-foreground)]"
 : "bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)] text-[var(--foreground)] hover:bg-[var(--surface-container-high)]"
 }`}
 >
 <div className={`w-4 h-4 rounded border flex items-center justify-center ${
 groupByMessageId
 ? "bg-[var(--surface-container-lowest)] border-white"
 : "border-[var(--border)] dark:border-zinc-500"
 }`}>
 {groupByMessageId && <Check size={12} className="text-[var(--primary)] dark:text-[var(--primary)]" />}
 </div>
 <span className="font-medium">Group by Message ID</span>
 </button>
 {groupByMessageId && (
 <span className="text-xs text-[var(--muted-foreground)]">
 Groups related Inbound and Outbound messages together
 </span>
 )}
 </div>
 )}
 </div>

 {/* Summary Stats */}
 <div className="mt-4 pt-4 border-t border-[var(--border)]  flex items-center justify-between">
 <div className="flex items-center gap-4 text-sm">
 <span className="text-[var(--muted-foreground)]">
 Showing <span className="font-semibold text-[var(--foreground)] ">{filteredEntries.length}</span> entries
 </span>
 {shouldGroupByService && (
 <span className="text-[var(--muted-foreground)]">
 Grouped by service
 </span>
 )}
 {shouldGroupByMessageId && (
 <span className="text-[var(--muted-foreground)]">
 Grouped by Message ID ({Object.keys(messageIdGroups).length} {Object.keys(messageIdGroups).length === 1 ? "group" : "groups"})
 </span>
 )}
 </div>
 <div className="flex items-center gap-2">
 {hasActiveFilters && (
 <button 
 onClick={clearAllFilters}
 className="flex items-center gap-2 px-3 py-1.5 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg text-sm text-[var(--foreground)] hover:bg-[var(--surface-container-lowest)] dark:hover:bg-[var(--surface-container-high)] transition-colors"
 >
 <X size={16} />
 Clear Filters
 </button>
 )}
 <button className="flex items-center gap-2 px-3 py-1.5 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg text-sm text-[var(--foreground)] hover:bg-[var(--surface-container-lowest)] dark:hover:bg-[var(--surface-container-high)] transition-colors">
 <Download size={16} />
 Export
 </button>
 </div>
 </div>
 </div>

 {/* Log Entries */}
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-xl overflow-hidden">
 {selectedServices.size === 0 ? (
 /* OPTO Initial State - No Service Selected */
 <div className="py-24 text-center">
 <div className="flex flex-col items-center justify-center">
 <div className="w-20 h-20 bg-[var(--primary)]  rounded-full flex items-center justify-center mb-6 ">
 <Sparkles size={36} className="text-[var(--primary-foreground)]" />
 </div>
 <h3 className="text-[var(--foreground)]  text-2xl font-bold mb-3">Select a Service to View Logs</h3>
 <p className="text-[var(--muted-foreground)] text-lg mb-8 max-w-md">
 Choose a service from the filters above or use the quick links below to view log entries.
 </p>
 
 {/* Quick Links */}
 <div className="flex flex-wrap gap-3 mb-10 justify-center">
 <button
 onClick={() => setSelectedServices(new Set(["Host Adapter"]))}
 className="px-6 py-3 bg-[var(--primary)]  hover:opacity-90 active:scale-[0.98] text-[var(--primary-foreground)] rounded-lg transition-all flex items-center gap-2 group font-medium"
 >
 <Server size={18} />
 <span>Host Adapter</span>
 </button>
 <button
 onClick={() => setSelectedServices(new Set(["Conductor"]))}
 className="px-6 py-3 bg-[var(--primary)]  hover:opacity-90 active:scale-[0.98] text-[var(--primary-foreground)] rounded-lg transition-all flex items-center gap-2 group font-medium"
 >
 <Server size={18} />
 <span>Conductor</span>
 </button>
 </div>

 <div className="flex flex-col gap-3 text-left max-w-lg">
 <div className="flex items-start gap-3 text-[var(--muted-foreground)] ">
 <div className="w-6 h-6 bg-[var(--surface-container)] dark:bg-[var(--card)] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
 <Sparkles size={14} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 </div>
 <div>
 <p className="font-medium text-[var(--foreground)] ">Ask OPTO</p>
 <p className="text-sm text-[var(--muted-foreground)]">Click the "Ask OPTO" button to query logs using natural language</p>
 </div>
 </div>
 <div className="flex items-start gap-3 text-[var(--muted-foreground)] ">
 <div className="w-6 h-6 bg-[var(--surface-container)] dark:bg-[var(--card)] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
 <Filter size={14} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 </div>
 <div>
 <p className="font-medium text-[var(--foreground)] ">Use Filters</p>
 <p className="text-sm text-[var(--muted-foreground)]">Select services, log levels, and time ranges to refine your search</p>
 </div>
 </div>
 <div className="flex items-start gap-3 text-[var(--muted-foreground)] ">
 <div className="w-6 h-6 bg-[var(--surface-container)] dark:bg-[var(--card)] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
 <LinkIcon size={14} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 </div>
 <div>
 <p className="font-medium text-[var(--foreground)] ">Match Across Services</p>
 <p className="text-sm text-[var(--muted-foreground)]">Use Work List ID or Correlation ID to trace logs across multiple services</p>
 </div>
 </div>
 </div>
 </div>
 </div>
 ) : filteredEntries.length === 0 ? (
 <div className="p-12 text-center">
 <FileText size={48} className="mx-auto text-[var(--muted-foreground)] mb-4" />
 <p className="text-[var(--muted-foreground)]">No log entries found</p>
 <p className="text-sm text-[var(--muted-foreground)] mt-1">Try adjusting your filters</p>
 </div>
 ) : shouldGroupByMessageId ? (
 // Grouped by Message ID view
 <div>
 {Object.entries(messageIdGroups).map(([messageId, entries]) => (
 <div key={messageId} className="border-b border-[var(--border)]  last:border-0">
 {/* Group Header */}
 <div
 className="flex items-center justify-between p-4 bg-[var(--state-info-container)] dark:bg-[var(--state-info-container)]/20 cursor-pointer hover:bg-[var(--state-info-container)] dark:hover:bg-[var(--state-info-container)]/30 transition-colors"
 onClick={() => toggleGroup(messageId)}
 >
 <div className="flex items-center gap-3 flex-1 min-w-0">
 {expandedGroups.has(messageId) ? (
 <ChevronDown size={20} className="text-[var(--state-on-info-container)] dark:text-[var(--state-info)]" />
 ) : (
 <ChevronUp size={20} className="text-[var(--state-on-info-container)] dark:text-[var(--state-info)]" />
 )}
 <LinkIcon size={18} className="text-[var(--state-on-info-container)] dark:text-[var(--state-info)]" />
 <span className="font-mono text-sm text-[var(--state-on-info-container)] dark:text-[var(--state-info)] truncate" title={messageId}>
 {messageId}
 </span>
 <span className="text-sm text-[var(--muted-foreground)] flex-shrink-0">
 ({entries.length} {entries.length === 1 ? "message" : "messages"})
 </span>
 {/* Show Inbound/Outbound badge if both exist */}
 <div className="flex items-center gap-1">
 {entries.some(e => e.hostAdapterType === "Inbound") && (
 <span className="text-xs px-2 py-0.5 bg-[var(--state-info-container)] dark:bg-[var(--state-info-container)] text-[var(--state-on-info-container)] dark:text-[var(--state-info)] rounded flex items-center gap-1">
 <ArrowDown size={12} />
 Inbound
 </span>
 )}
 {entries.some(e => e.hostAdapterType === "Outbound") && (
 <span className="text-xs px-2 py-0.5 bg-[var(--state-warning-container)] dark:bg-[var(--state-warning-container)]/30 text-[var(--state-on-warning-container)] dark:text-[var(--state-warning)] rounded flex items-center gap-1">
 <ArrowUp size={12} />
 Outbound
 </span>
 )}
 </div>
 </div>
 </div>

 {/* Group Entries */}
 {expandedGroups.has(messageId) && (
 <div>
 {entries.map((entry) => (
 <div
 key={entry.id}
 className="flex items-start gap-4 p-4 border-b border-[var(--border)]  last:border-0 hover:bg-[var(--surface-container-lowest)] hover:bg-[var(--surface-container-high)]/30 cursor-pointer transition-colors"
 onClick={() => handleEntryClick(entry)}
 >
 <div className="flex-shrink-0 mt-0.5">
 {getLevelIcon(entry.level)}
 </div>
 <div className="flex-1 min-w-0">
 <div className="flex items-center gap-3 mb-1">
 <span className="text-xs font-mono text-[var(--muted-foreground)]">
 {entry.id}
 </span>
 <span className={`text-xs font-semibold ${getLevelColor(entry.level)}`}>
 {entry.level}
 </span>
 <span className="text-xs text-[var(--muted-foreground)] flex items-center gap-1">
 <Clock size={12} />
 {formatTimestamp(entry.timestamp)}
 </span>
 {entry.hostAdapterType && (
 <span className={`text-xs px-2 py-0.5 rounded flex items-center gap-1 ${
 entry.hostAdapterType === "Inbound"
 ? "bg-[var(--state-info-container)] dark:bg-[var(--state-info-container)] text-[var(--state-on-info-container)] dark:text-[var(--state-info)]"
 : "bg-[var(--state-warning-container)] dark:bg-[var(--state-warning-container)]/30 text-[var(--state-on-warning-container)] dark:text-[var(--state-warning)]"
 }`}>
 {entry.hostAdapterType === "Inbound" ? (
 <ArrowDown size={12} />
 ) : (
 <ArrowUp size={12} />
 )}
 {entry.hostAdapterType}
 </span>
 )}
 {entry.messageSource && (
 <span className="text-xs px-2 py-0.5 bg-[var(--state-fatal-container)] dark:bg-[var(--state-fatal-container)] text-[var(--tertiary)] dark:text-[var(--state-fatal)] rounded">
 {entry.messageSource}
 </span>
 )}
 {entry.workListId && (
 <span className="text-xs px-2 py-0.5 bg-[var(--state-success-container)] dark:bg-[var(--state-success-container)] text-[var(--state-on-success-container)] dark:text-[var(--state-success)] rounded">
 {entry.workListId}
 </span>
 )}
 {entry.hostAdapterStatus && (
 <span className={`text-xs px-2 py-0.5 rounded ${
 entry.hostAdapterStatus === "Accepted"
 ? "bg-[var(--state-success-container)] dark:bg-[var(--state-success-container)] text-[var(--state-on-success-container)] dark:text-[var(--state-success)]"
 : "bg-[var(--state-error-container)] dark:bg-[var(--state-error-container)] text-[var(--state-on-error-container)] dark:text-[var(--state-error)]"
 }`}>
 {entry.hostAdapterStatus}
 </span>
 )}
 </div>
 <p className="text-sm text-[var(--foreground)]  mb-1">
 {entry.message}
 </p>
 {entry.endpoint && (
 <p className="text-xs text-[var(--muted-foreground)] font-mono">
 {entry.endpoint}
 </p>
 )}
 <p className="text-xs text-[var(--muted-foreground)] flex items-center gap-1 mt-1">
 <FileText size={11} />
 {entry.logFileName}
 </p>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 ))}
 </div>
 ) : shouldGroupByService ? (
 // Grouped view
 <div>
 {Object.entries(groupedEntries).map(([service, entries]) => (
 <div key={service} className="border-b border-[var(--border)]  last:border-0">
 {/* Group Header */}
 <div
 className="flex items-center justify-between p-4 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] cursor-pointer hover:bg-[var(--surface-container-low)] hover:bg-[var(--surface-container-high)] transition-colors"
 onClick={() => toggleGroup(service)}
 >
 <div className="flex items-center gap-3">
 {expandedGroups.has(service) ? (
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
 
 {/* Group Entries */}
 {expandedGroups.has(service) && (
 <div>
 {entries.map((entry) => (
 <div
 key={entry.id}
 className="flex items-start gap-4 p-4 border-b border-[var(--border)]  last:border-0 hover:bg-[var(--surface-container-lowest)] hover:bg-[var(--surface-container-high)]/30 cursor-pointer transition-colors"
 onClick={() => handleEntryClick(entry)}
 >
 <div className="flex-shrink-0 mt-0.5">
 {getLevelIcon(entry.level)}
 </div>
 <div className="flex-1 min-w-0">
 <div className="flex items-center gap-3 mb-1">
 <span className="text-xs font-mono text-[var(--muted-foreground)]">
 {entry.id}
 </span>
 <span className={`text-xs font-semibold ${getLevelColor(entry.level)}`}>
 {entry.level}
 </span>
 <span className="text-xs text-[var(--muted-foreground)] flex items-center gap-1">
 <Clock size={12} />
 {formatTimestamp(entry.timestamp)}
 </span>
 {entry.hostAdapterType && (
 <span className={`text-xs px-2 py-0.5 rounded flex items-center gap-1 ${
 entry.hostAdapterType === "Inbound"
 ? "bg-[var(--state-info-container)] dark:bg-[var(--state-info-container)] text-[var(--state-on-info-container)] dark:text-[var(--state-info)]"
 : "bg-[var(--state-warning-container)] dark:bg-[var(--state-warning-container)]/30 text-[var(--state-on-warning-container)] dark:text-[var(--state-warning)]"
 }`}>
 {entry.hostAdapterType === "Inbound" ? (
 <ArrowDown size={12} />
 ) : (
 <ArrowUp size={12} />
 )}
 {entry.hostAdapterType}
 </span>
 )}
 {entry.messageSource && (
 <span className="text-xs px-2 py-0.5 bg-[var(--state-fatal-container)] dark:bg-[var(--state-fatal-container)] text-[var(--tertiary)] dark:text-[var(--state-fatal)] rounded">
 {entry.messageSource}
 </span>
 )}
 {entry.correlationId && (
 <span className="text-xs px-2 py-0.5 bg-[var(--state-fatal-container)] dark:bg-[var(--state-fatal-container)] text-[var(--tertiary)] dark:text-[var(--state-fatal)] rounded">
 {entry.correlationId}
 </span>
 )}
 {entry.workListId && (
 <span className="text-xs px-2 py-0.5 bg-[var(--state-success-container)] dark:bg-[var(--state-success-container)] text-[var(--state-on-success-container)] dark:text-[var(--state-success)] rounded">
 {entry.workListId}
 </span>
 )}
 {entry.messageId && (
 <span
 className="text-xs px-2 py-0.5 bg-[var(--state-info-container)] dark:bg-[var(--state-info-container)]/30 text-[var(--state-on-info-container)] dark:text-[var(--state-info)] rounded cursor-pointer hover:bg-[var(--state-info-container)] dark:hover:bg-[var(--state-info-container)]/50 transition-colors font-mono"
 onClick={(e) => {
 e.stopPropagation();
 setMatchField("messageId");
 setMatchValue(entry.messageId || "");
 setSelectedServices(new Set(["Host Adapter"]));
 }}
 title={`Message ID: ${entry.messageId} (Click to filter)`}
 >
 {entry.messageId.substring(0, 8)}...
 </span>
 )}
 </div>
 <p className="text-sm text-[var(--foreground)]  mb-1">
 {entry.message}
 </p>
 {entry.endpoint && (
 <p className="text-xs text-[var(--muted-foreground)] font-mono">
 {entry.endpoint}
 </p>
 )}
 <p className="text-xs text-[var(--muted-foreground)] flex items-center gap-1 mt-1">
 <FileText size={11} />
 {entry.logFileName}
 </p>
 </div>
 {entry.relatedMessages && entry.relatedMessages.length > 0 && (
 <div className="flex-shrink-0">
 <span className="inline-flex items-center gap-1 px-2 py-1 bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)] text-[var(--foreground)] rounded text-xs">
 <LinkIcon size={12} />
 {entry.relatedMessages.length}
 </span>
 </div>
 )}
 </div>
 ))}
 </div>
 )}
 </div>
 ))}
 </div>
 ) : (
 // Standard list view
 <div>
 {filteredEntries.map((entry) => (
 <div
 key={entry.id}
 className="flex items-start gap-4 p-4 border-b border-[var(--border)]  last:border-0 hover:bg-[var(--surface-container-lowest)] hover:bg-[var(--surface-container-high)]/30 cursor-pointer transition-colors"
 onClick={() => handleEntryClick(entry)}
 >
 <div className="flex-shrink-0 mt-0.5">
 {getLevelIcon(entry.level)}
 </div>
 <div className="flex-1 min-w-0">
 <div className="flex items-center gap-3 mb-1">
 <span className="text-xs font-mono text-[var(--muted-foreground)]">
 {entry.id}
 </span>
 <span className={`text-xs font-semibold ${getLevelColor(entry.level)}`}>
 {entry.level}
 </span>
 <span className="text-xs px-2 py-0.5 bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)] text-[var(--foreground)] rounded">
 {entry.service}
 </span>
 <span className="text-xs text-[var(--muted-foreground)] flex items-center gap-1">
 <Clock size={12} />
 {formatTimestamp(entry.timestamp)}
 </span>
 {entry.hostAdapterType && (
 <span className={`text-xs px-2 py-0.5 rounded flex items-center gap-1 ${
 entry.hostAdapterType === "Inbound"
 ? "bg-[var(--state-info-container)] dark:bg-[var(--state-info-container)] text-[var(--state-on-info-container)] dark:text-[var(--state-info)]"
 : "bg-[var(--state-warning-container)] dark:bg-[var(--state-warning-container)]/30 text-[var(--state-on-warning-container)] dark:text-[var(--state-warning)]"
 }`}>
 {entry.hostAdapterType === "Inbound" ? (
 <ArrowDown size={12} />
 ) : (
 <ArrowUp size={12} />
 )}
 {entry.hostAdapterType}
 </span>
 )}
 {entry.messageSource && (
 <span className="text-xs px-2 py-0.5 bg-[var(--state-fatal-container)] dark:bg-[var(--state-fatal-container)] text-[var(--tertiary)] dark:text-[var(--state-fatal)] rounded">
 {entry.messageSource}
 </span>
 )}
 {entry.correlationId && (
 <span className="text-xs px-2 py-0.5 bg-[var(--state-fatal-container)] dark:bg-[var(--state-fatal-container)] text-[var(--tertiary)] dark:text-[var(--state-fatal)] rounded">
 {entry.correlationId}
 </span>
 )}
 {entry.workListId && (
 <span className="text-xs px-2 py-0.5 bg-[var(--state-success-container)] dark:bg-[var(--state-success-container)] text-[var(--state-on-success-container)] dark:text-[var(--state-success)] rounded">
 {entry.workListId}
 </span>
 )}
 {entry.messageId && (
 <span
 className="text-xs px-2 py-0.5 bg-[var(--state-info-container)] dark:bg-[var(--state-info-container)]/30 text-[var(--state-on-info-container)] dark:text-[var(--state-info)] rounded cursor-pointer hover:bg-[var(--state-info-container)] dark:hover:bg-[var(--state-info-container)]/50 transition-colors font-mono"
 onClick={(e) => {
 e.stopPropagation();
 setMatchField("messageId");
 setMatchValue(entry.messageId || "");
 setSelectedServices(new Set(["Host Adapter"]));
 }}
 title={`Message ID: ${entry.messageId} (Click to filter)`}
 >
 {entry.messageId.substring(0, 8)}...
 </span>
 )}
 </div>
 <p className="text-sm text-[var(--foreground)]  mb-1">
 {entry.message}
 </p>
 {entry.endpoint && (
 <p className="text-xs text-[var(--muted-foreground)] font-mono">
 {entry.endpoint}
 </p>
 )}
 <p className="text-xs text-[var(--muted-foreground)] flex items-center gap-1 mt-1">
 <FileText size={11} />
 {entry.logFileName}
 </p>
 </div>
 {entry.relatedMessages && entry.relatedMessages.length > 0 && (
 <div className="flex-shrink-0">
 <span className="inline-flex items-center gap-1 px-2 py-1 bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)] text-[var(--foreground)] rounded text-xs">
 <LinkIcon size={12} />
 {entry.relatedMessages.length}
 </span>
 </div>
 )}
 </div>
 ))}
 </div>
 )}
 </div>
 </div>

 {/* Detail Panel */}
 {showDetailPanel && selectedEntry && (
 <div className="fixed inset-y-0 right-0 w-[600px] bg-[var(--surface-container-high)] text-[var(--foreground)] border-l border-[var(--border)]  z-50 flex flex-col">
 {/* Panel Header */}
 <div className="flex items-center justify-between p-4 border-b border-[var(--border)] ">
 <h3 className="font-mono font-semibold text-[var(--foreground)] ">{selectedEntry.id}</h3>
 <div className="flex items-center gap-2">
 {selectedEntry.hostAdapterType === "Outbound" && (
 <button
 onClick={() => handleResend(selectedEntry)}
 className="px-3 py-2 bg-[var(--primary)]  hover:opacity-90 active:scale-[0.98] text-[var(--primary-foreground)] rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
 >
 <Send size={16} />
 Resend
 </button>
 )}
 <button
 onClick={() => setShowDetailPanel(false)}
 className="p-2 hover:bg-[var(--surface-container-low)] hover:bg-[var(--surface-container-high)] rounded-lg transition-colors"
 >
 <X size={20} className="text-[var(--muted-foreground)]" />
 </button>
 </div>
 </div>

 {/* Tabs */}
 <div className="flex border-b border-[var(--border)] ">
 <button
 onClick={() => setActiveTab("entry")}
 className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
 activeTab === "entry"
 ? "text-[var(--primary)] dark:text-[var(--primary)] border-b-2 border-[var(--primary)] dark:border-[var(--primary)]"
 : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] dark:hover:text-[var(--foreground)]"
 }`}
 >
 Details
 </button>
 {selectedEntry?.service === "Host Adapter" && (
 <button
 onClick={() => setActiveTab("payload")}
 className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
 activeTab === "payload"
 ? "text-[var(--primary)] dark:text-[var(--primary)] border-b-2 border-[var(--primary)] dark:border-[var(--primary)]"
 : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] dark:hover:text-[var(--foreground)]"
 }`}
 >
 Payload
 </button>
 )}
 <button
 onClick={() => setActiveTab("related")}
 className={`flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
 activeTab === "related"
 ? "text-[var(--primary)] dark:text-[var(--primary)] border-b-2 border-[var(--primary)] dark:border-[var(--primary)]"
 : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] dark:hover:text-[var(--foreground)]"
 }`}
 disabled={!hasRelatedEntries}
 >
 Related Messages
 {hasRelatedEntries && (
 <span className="px-1.5 py-0.5 bg-[var(--primary)]  text-[var(--primary-foreground)] text-xs rounded">
 {relatedEntries.length}
 </span>
 )}
 </button>
 </div>

 {/* Panel Content */}
 <div className="flex-1 overflow-y-auto p-4">
 {activeTab === "entry" ? (
 <div className="space-y-4">
 {/* Basic Info */}
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-lg p-4">
 <div className="flex items-center gap-2 mb-3">
 {getLevelIcon(selectedEntry.level)}
 <h4 className="font-semibold text-[var(--foreground)] ">Basic Information</h4>
 </div>
 <dl className="space-y-2 text-sm">
 <div className="flex justify-between">
 <dt className="text-[var(--muted-foreground)]">Log ID:</dt>
 <dd className="font-mono text-[var(--foreground)] ">{selectedEntry.id}</dd>
 </div>
 <div className="flex justify-between">
 <dt className="text-[var(--muted-foreground)]">Service:</dt>
 <dd className="font-semibold text-[var(--foreground)] ">{selectedEntry.service}</dd>
 </div>
 <div className="flex justify-between">
 <dt className="text-[var(--muted-foreground)]">Log File:</dt>
 <dd className="font-mono text-xs text-[var(--foreground)]  break-all">{selectedEntry.logFileName}</dd>
 </div>
 <div className="flex justify-between">
 <dt className="text-[var(--muted-foreground)]">Level:</dt>
 <dd className={`font-semibold ${getLevelColor(selectedEntry.level)}`}>{selectedEntry.level}</dd>
 </div>
 <div className="flex justify-between">
 <dt className="text-[var(--muted-foreground)]">Timestamp:</dt>
 <dd className="font-mono text-[var(--foreground)] ">{new Date(selectedEntry.timestamp).toLocaleString()}</dd>
 </div>
 </dl>
 </div>

 {/* Message */}
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-lg p-4">
 <h4 className="font-semibold text-[var(--foreground)]  mb-2">Message</h4>
 <p className="text-sm text-[var(--foreground)] ">{selectedEntry.message}</p>
 </div>

 {/* Host Adapter Details */}
 {(selectedEntry.hostAdapterType || selectedEntry.hostAdapterStatus) && (
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-lg p-4">
 <div className="flex items-center gap-2 mb-3">
 <Server size={16} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 <h4 className="font-semibold text-[var(--foreground)] ">Host Adapter Details</h4>
 </div>
 <dl className="space-y-2 text-sm">
 {selectedEntry.hostAdapterType && (
 <div className="flex justify-between">
 <dt className="text-[var(--muted-foreground)]">Type:</dt>
 <dd className={`font-semibold ${
 selectedEntry.hostAdapterType === "Inbound" 
 ? "text-[var(--state-info)] dark:text-[var(--state-info)]" 
 : "text-[var(--state-on-warning-container)] dark:text-[var(--state-warning)]"
 }`}>
 {selectedEntry.hostAdapterType}
 </dd>
 </div>
 )}
 {selectedEntry.hostAdapterStatus && (
 <div className="flex justify-between">
 <dt className="text-[var(--muted-foreground)]">Status:</dt>
 <dd className={`font-semibold ${
 selectedEntry.hostAdapterStatus === "Accepted" 
 ? "text-[var(--state-on-success-container)] dark:text-[var(--state-success)]" 
 : "text-[var(--state-error)] dark:text-[var(--state-error)]"
 }`}>
 {selectedEntry.hostAdapterStatus}
 </dd>
 </div>
 )}
 {selectedEntry.messageId && (
 <div className="flex justify-between">
 <dt className="text-[var(--muted-foreground)]">Message ID:</dt>
 <dd className="font-mono text-[var(--state-on-info-container)] dark:text-[var(--state-info)]">{selectedEntry.messageId}</dd>
 </div>
 )}
 {selectedEntry.messageSource && (
 <div className="flex justify-between">
 <dt className="text-[var(--muted-foreground)]">Message Source:</dt>
 <dd className="font-semibold text-[var(--tertiary)] dark:text-[var(--state-fatal)]">{selectedEntry.messageSource}</dd>
 </div>
 )}
 </dl>
 </div>
 )}

 {/* Request Details */}
 {(selectedEntry.endpoint || selectedEntry.duration || selectedEntry.statusCode) && (
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-lg p-4">
 <h4 className="font-semibold text-[var(--foreground)]  mb-3">Request Details</h4>
 <dl className="space-y-2 text-sm">
 {selectedEntry.endpoint && (
 <div className="flex justify-between">
 <dt className="text-[var(--muted-foreground)]">Endpoint:</dt>
 <dd className="font-mono text-[var(--foreground)] ">{selectedEntry.endpoint}</dd>
 </div>
 )}
 {selectedEntry.duration && (
 <div className="flex justify-between">
 <dt className="text-[var(--muted-foreground)]">Duration:</dt>
 <dd className="font-mono text-[var(--foreground)] ">{selectedEntry.duration}</dd>
 </div>
 )}
 {selectedEntry.statusCode && (
 <div className="flex justify-between">
 <dt className="text-[var(--muted-foreground)]">Status Code:</dt>
 <dd className={`font-mono ${selectedEntry.statusCode >= 400 ? "text-[var(--state-error)]" : "text-[var(--state-success)]"}`}>
 {selectedEntry.statusCode}
 </dd>
 </div>
 )}
 </dl>
 </div>
 )}

 {/* Context */}
 {(selectedEntry.correlationId || selectedEntry.userId || selectedEntry.sessionId || selectedEntry.workListId || selectedEntry.ipAddress) && (
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-lg p-4">
 <h4 className="font-semibold text-[var(--foreground)]  mb-3">Context</h4>
 <dl className="space-y-2 text-sm">
 {selectedEntry.workListId && (
 <div className="flex justify-between">
 <dt className="text-[var(--muted-foreground)]">Work List ID:</dt>
 <dd className="font-mono text-[var(--state-on-success-container)] dark:text-[var(--state-success)]">{selectedEntry.workListId}</dd>
 </div>
 )}
 {selectedEntry.correlationId && (
 <div className="flex justify-between">
 <dt className="text-[var(--muted-foreground)]">Correlation ID:</dt>
 <dd className="font-mono text-[var(--tertiary)] dark:text-[var(--state-fatal)]">{selectedEntry.correlationId}</dd>
 </div>
 )}
 {selectedEntry.userId && (
 <div className="flex justify-between">
 <dt className="text-[var(--muted-foreground)]">User ID:</dt>
 <dd className="font-mono text-[var(--foreground)] ">{selectedEntry.userId}</dd>
 </div>
 )}
 {selectedEntry.sessionId && (
 <div className="flex justify-between">
 <dt className="text-[var(--muted-foreground)]">Session ID:</dt>
 <dd className="font-mono text-[var(--foreground)] ">{selectedEntry.sessionId}</dd>
 </div>
 )}
 {selectedEntry.ipAddress && (
 <div className="flex justify-between">
 <dt className="text-[var(--muted-foreground)]">IP Address:</dt>
 <dd className="font-mono text-[var(--foreground)] ">{selectedEntry.ipAddress}</dd>
 </div>
 )}
 </dl>
 </div>
 )}

 {/* Stack Trace */}
 {selectedEntry.stackTrace && (
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-lg p-4">
 <h4 className="font-semibold text-[var(--foreground)]  mb-2">Stack Trace</h4>
 <pre className="text-xs font-mono text-[var(--state-error)] dark:text-[var(--state-error)] overflow-x-auto border border-[var(--border)] rounded-xl bg-transparent whitespace-pre-wrap">
 {selectedEntry.stackTrace}
 </pre>
 </div>
 )}

 {/* Metadata */}
 {selectedEntry.metadata && (
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-lg p-4">
 <h4 className="font-semibold text-[var(--foreground)]  mb-2">Metadata</h4>
 <pre className="text-xs font-mono text-[var(--foreground)]  overflow-x-auto border border-[var(--border)] rounded-xl bg-transparent">
 {JSON.stringify(selectedEntry.metadata, null, 2)}
 </pre>
 </div>
 )}
 </div>
 ) : activeTab === "related" ? (
 <div className="space-y-3">
 {relatedEntries.length === 0 ? (
 <div className="text-center py-12">
 <LinkIcon size={48} className="mx-auto text-[var(--muted-foreground)] mb-4" />
 <p className="text-[var(--muted-foreground)]">No related messages found</p>
 </div>
 ) : (
 <>
 {/* Matching Field Indicator */}
 {selectedEntry && (
 <div className="mb-3 p-3 bg-[var(--state-info-container)] dark:bg-[var(--state-info-container)]/20 border border-[var(--secondary)]/30 dark:border-[var(--secondary-container)]/30 rounded-lg">
 <div className="flex items-center gap-2 text-sm">
 <LinkIcon size={14} className="text-[var(--state-info)] dark:text-[var(--state-info)]" />
 <span className="text-[var(--secondary)] dark:text-[var(--secondary)]">
 Showing entries matching{" "}
 <span className="font-semibold">
 {selectedEntry.messageId
 ? `Message ID: ${selectedEntry.messageId}`
 : selectedEntry.workListId
 ? `Work List ID: ${selectedEntry.workListId}`
 : selectedEntry.correlationId
 ? `Correlation ID: ${selectedEntry.correlationId}`
 : selectedEntry.userId
 ? `User ID: ${selectedEntry.userId}`
 : selectedEntry.sessionId
 ? `Session ID: ${selectedEntry.sessionId}`
 : ""}
 </span>
 </span>
 </div>
 </div>
 )}
 {/* Related Messages Search */}
 <div className="relative mb-4">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" size={16} />
 <input
 type="text"
 placeholder="Search related messages..."
 value={relatedSearchTerm}
 onChange={(e) => setRelatedSearchTerm(e.target.value)}
 className="w-full bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg pl-10 pr-3 py-2 text-sm text-[var(--foreground)]  placeholder-zinc-500"
 />
 {relatedSearchTerm && (
 <button
 onClick={() => setRelatedSearchTerm("")}
 className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-[var(--surface-container-low)] dark:hover:bg-[var(--surface-container-high)] rounded transition-colors"
 >
 <X size={14} className="text-[var(--muted-foreground)]" />
 </button>
 )}
 </div>
 {filteredRelatedEntries.length === 0 ? (
 <div className="text-center py-12">
 <Search size={48} className="mx-auto text-[var(--muted-foreground)] mb-4" />
 <p className="text-[var(--muted-foreground)]">No matching related messages found</p>
 <p className="text-sm text-[var(--muted-foreground)] mt-1">Try adjusting your search</p>
 </div>
 ) : (
 Object.entries(groupedRelatedEntries).map(([service, entries]) => (
 <div key={service} className="border-b border-[var(--border)]  last:border-0">
 {/* Group Header */}
 <div
 className="flex items-center justify-between p-4 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] cursor-pointer hover:bg-[var(--surface-container-low)] hover:bg-[var(--surface-container-high)] transition-colors"
 onClick={() => toggleRelatedGroup(service)}
 >
 <div className="flex items-center gap-3">
 {expandedRelatedGroups.has(service) ? (
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
 
 {/* Group Entries */}
 {expandedRelatedGroups.has(service) && (
 <div>
 {entries.map((entry) => (
 <div
 key={entry.id}
 className="flex items-start gap-4 p-4 border-b border-[var(--border)]  last:border-0 hover:bg-[var(--surface-container-lowest)] hover:bg-[var(--surface-container-high)] cursor-pointer transition-colors"
 onClick={() => {
 setSelectedEntry(entry);
 setActiveTab("entry");
 }}
 >
 <div className="flex-shrink-0 mt-0.5">
 {getLevelIcon(entry.level)}
 </div>
 <div className="flex-1 min-w-0">
 <div className="flex items-center gap-2 mb-1">
 <span className="text-xs font-mono text-[var(--muted-foreground)]">
 {entry.id}
 </span>
 <span className={`text-xs font-semibold ${getLevelColor(entry.level)}`}>
 {entry.level}
 </span>
 <span className="text-xs px-2 py-0.5 bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)] text-[var(--foreground)] rounded">
 {entry.service}
 </span>
 </div>
 <p className="text-sm text-[var(--foreground)]  mb-1">
 {entry.message}
 </p>
 <p className="text-xs text-[var(--muted-foreground)] flex items-center gap-1">
 <Clock size={12} />
 {formatTimestamp(entry.timestamp)}
 </p>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 ))
 )}
 </>
 )}
 </div>
 ) : activeTab === "payload" ? (
 <div className="space-y-4">
 {/* Payload Header */}
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-lg p-4">
 <div className="flex items-center gap-2 mb-2">
 <Server size={16} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 <h4 className="font-semibold text-[var(--foreground)] ">JSON Payload</h4>
 </div>
 <p className="text-xs text-[var(--muted-foreground)] mb-3">
 Host Adapter request/response payload data
 </p>
 <div className="flex gap-2">
 <button
 onClick={() => {
 const payload = JSON.stringify(generateHostAdapterPayload(selectedEntry), null, 2);
 navigator.clipboard.writeText(payload);
 }}
 className="px-3 py-1.5 bg-[var(--primary)]  text-[var(--primary-foreground)] rounded text-xs font-medium hover:opacity-90 transition-opacity"
 >
 Copy to Clipboard
 </button>
 <button
 onClick={() => {
 const payload = JSON.stringify(generateHostAdapterPayload(selectedEntry), null, 2);
 const blob = new Blob([payload], { type: 'application/json' });
 const url = URL.createObjectURL(blob);
 const a = document.createElement('a');
 a.href = url;
 a.download = `payload_${selectedEntry.id}.json`;
 a.click();
 URL.revokeObjectURL(url);
 }}
 className="px-3 py-1.5 bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)] text-[var(--foreground)]  rounded text-xs font-medium hover:bg-[var(--surface-container-high)] transition-colors"
 >
 Download JSON
 </button>
 </div>
 </div>

 {/* JSON Payload Display */}
 <div className="bg-[var(--surface-container-high)] text-[var(--foreground)] dark:bg-black/50 rounded-lg p-4 overflow-x-auto border border-[var(--border)] rounded-xl bg-transparent">
 <pre className="text-xs text-[var(--state-success)] dark:text-[var(--state-success)] font-mono whitespace-pre">
 {JSON.stringify(generateHostAdapterPayload(selectedEntry), null, 2)}
 </pre>
 </div>

 {/* Payload Metadata */}
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-lg p-4">
 <h4 className="font-semibold text-[var(--foreground)]  mb-3">Payload Information</h4>
 <dl className="space-y-2 text-sm">
 <div className="flex justify-between">
 <dt className="text-[var(--muted-foreground)]">Message Type:</dt>
 <dd className="font-semibold text-[var(--foreground)] ">
 {selectedEntry.hostAdapterType === "Inbound" ? "InboundOrder" : "OutboundShipment"}
 </dd>
 </div>
 <div className="flex justify-between">
 <dt className="text-[var(--muted-foreground)]">Direction:</dt>
 <dd className="font-semibold text-[var(--foreground)] ">
 {selectedEntry.hostAdapterType}
 </dd>
 </div>
 <div className="flex justify-between">
 <dt className="text-[var(--muted-foreground)]">Status:</dt>
 <dd className="font-semibold text-[var(--foreground)] ">
 {selectedEntry.hostAdapterStatus}
 </dd>
 </div>
 <div className="flex justify-between">
 <dt className="text-[var(--muted-foreground)]">Size:</dt>
 <dd className="font-mono text-[var(--foreground)] ">
 {new Blob([JSON.stringify(generateHostAdapterPayload(selectedEntry))]).size} bytes
 </dd>
 </div>
 </dl>
 </div>
 </div>
 ) : null}
 </div>
 </div>
 )}
 </div>
 </div>
 );
}