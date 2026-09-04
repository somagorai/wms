// Shared log data types and mock data for Work List logs
// Used by both WorkList.tsx and Logs.tsx to ensure consistency

// Helper function to generate a GUID
const generateGuid = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export type LogLevel = "INFO" | "WARNING" | "ERROR" | "DEBUG" | "FATAL";

export type LogEntry = {
  id: string;
  service: string;
  logFileName: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  correlationId?: string;
  userId?: string;
  sessionId?: string;
  workListId?: string;
  ipAddress?: string;
  duration?: string;
  endpoint?: string;
  statusCode?: number;
  stackTrace?: string;
  metadata?: Record<string, any>;
  relatedMessages?: string[];
  // Host Adapter specific fields
  hostAdapterType?: "Inbound" | "Outbound";
  hostAdapterStatus?: "Rejected" | "Accepted";
  messageId?: string; // Unique message ID for Host Adapter records (shared across related inbound/outbound messages)
  messageSource?: string; // Message source system (e.g., "HOST", "WMS", "ERP")
};

// Generate realistic work list log entries
// This function will be called with the actual work list IDs from mockData
export const generateWorkListLogs = (workListIds: string[]): LogEntry[] => {
  const entries: LogEntry[] = [];
  const logServices = ["Host Adapter", "Work", "Conductor", "Gateway", "Scan"];
  
  // Generate a pool of message IDs (GUIDs) that will be shared across multiple Host Adapter records
  const messageIdPool: string[] = [];
  for (let i = 0; i < 50; i++) {
    messageIdPool.push(generateGuid());
  }
  
  const messages = {
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
    FATAL: [
      "Critical work list system failure",
      "Work list data corruption detected",
    ],
  };
  
  let counter = 1;
  const now = new Date();
  
  // Generate 3-8 log entries per work list
  workListIds.forEach((workListId) => {
    const entryCount = Math.floor(Math.random() * 6) + 3;
    const baseMinutesAgo = Math.floor(Math.random() * 1440);
    
    for (let i = 0; i < entryCount; i++) {
      const service = logServices[Math.floor(Math.random() * logServices.length)];
      const level: LogLevel = Math.random() > 0.15 ? "INFO" : (["WARNING", "ERROR", "DEBUG"] as LogLevel[])[Math.floor(Math.random() * 3)];
      const messageList = messages[level];
      const minutesAgo = baseMinutesAgo - (i * 5);
      const timestamp = new Date(now.getTime() - minutesAgo * 60000);
      
      const fileDate = timestamp.toISOString().split('T')[0];
      const fileHour = timestamp.getHours();
      const fileSequence = Math.floor(counter / 50);
      const logFileName = `${service.toLowerCase().replace(/\s+/g, '-')}_${fileDate}_${String(fileHour).padStart(2, '0')}_${String(fileSequence).padStart(3, '0')}.log`;
      
      const messageSources = ["HOST", "WMS", "ERP", "TMS", "OMS"];

      entries.push({
        id: `LOG-${String(counter).padStart(6, "0")}`,
        service,
        logFileName,
        timestamp: timestamp.toISOString(),
        level,
        message: messageList[Math.floor(Math.random() * messageList.length)],
        workListId,
        ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        duration: Math.random() > 0.5 ? `${Math.floor(Math.random() * 500)}ms` : undefined,
        hostAdapterType: service === "Host Adapter" ? (Math.random() > 0.5 ? "Inbound" : "Outbound") : undefined,
        hostAdapterStatus: service === "Host Adapter" ? (Math.random() > 0.2 ? "Accepted" : "Rejected") : undefined,
        messageId: service === "Host Adapter" ? messageIdPool[Math.floor(Math.random() * messageIdPool.length)] : undefined,
        messageSource: service === "Host Adapter" ? messageSources[Math.floor(Math.random() * messageSources.length)] : undefined,
      });
      counter++;
    }
  });
  
  return entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// Generate additional log entries for the Logs screen that aren't specific to work lists
export const generateGeneralLogs = (): LogEntry[] => {
  const entries: LogEntry[] = [];
  const logServices = ["Conductor", "Gateway", "Host Adapter", "Work", "Scan", "Storage", "Item", "Inventory"];
  const correlationIds = ["COR-001", "COR-002", "COR-003", "COR-004", "COR-005"];
  const userIds = ["user-123", "user-456", "user-789", "user-101", "user-202"];
  const sessionIds = ["sess-aaa", "sess-bbb", "sess-ccc", "sess-ddd"];
  
  // Generate a pool of message IDs (GUIDs) that will be shared across multiple Host Adapter records
  const messageIdPool: string[] = [];
  for (let i = 0; i < 30; i++) {
    messageIdPool.push(generateGuid());
  }
  
  const endpoints = [
    "/api/inventory/update",
    "/api/work/assign",
    "/api/work/create",
    "/api/work/complete",
    "/api/storage/allocate",
    "/api/scan/verify",
    "/api/item/retrieve",
  ];
  
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
      "System memory exhausted",
      "Database connection pool exhausted",
      "Critical service failure",
    ],
  };
  
  let counter = 50000; // Start from 50000 to avoid conflicts with work list logs
  const now = new Date();
  
  // Generate 100 general log entries
  for (let i = 0; i < 100; i++) {
    const service = logServices[Math.floor(Math.random() * logServices.length)];
    const level: LogLevel = (["INFO", "WARNING", "ERROR", "DEBUG", "FATAL"] as LogLevel[])[Math.floor(Math.random() * 5)];
    const messageList = messages[level];
    const minutesAgo = Math.floor(Math.random() * 2880); // Up to 2 days
    const timestamp = new Date(now.getTime() - minutesAgo * 60000);
    
    const fileDate = timestamp.toISOString().split('T')[0];
    const fileHour = timestamp.getHours();
    const fileSequence = Math.floor(counter / 50);
    const logFileName = `${service.toLowerCase().replace(/\s+/g, '-')}_${fileDate}_${String(fileHour).padStart(2, '0')}_${String(fileSequence).padStart(3, '0')}.log`;
    
    const messageSources = ["HOST", "WMS", "ERP", "TMS", "OMS"];

    const entry: LogEntry = {
      id: `LOG-${String(counter).padStart(6, "0")}`,
      service,
      logFileName,
      timestamp: timestamp.toISOString(),
      level,
      message: messageList[Math.floor(Math.random() * messageList.length)],
      correlationId: Math.random() > 0.3 ? correlationIds[Math.floor(Math.random() * correlationIds.length)] : undefined,
      userId: Math.random() > 0.4 ? userIds[Math.floor(Math.random() * userIds.length)] : undefined,
      sessionId: Math.random() > 0.5 ? sessionIds[Math.floor(Math.random() * sessionIds.length)] : undefined,
      ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      duration: Math.random() > 0.5 ? `${Math.floor(Math.random() * 500)}ms` : undefined,
      endpoint: Math.random() > 0.6 ? endpoints[Math.floor(Math.random() * endpoints.length)] : undefined,
      statusCode: Math.random() > 0.6 ? [200, 201, 400, 404, 500][Math.floor(Math.random() * 5)] : undefined,
      hostAdapterType: service === "Host Adapter" ? (Math.random() > 0.5 ? "Inbound" : "Outbound") : undefined,
      hostAdapterStatus: service === "Host Adapter" ? (Math.random() > 0.2 ? "Accepted" : "Rejected") : undefined,
      messageId: service === "Host Adapter" ? messageIdPool[Math.floor(Math.random() * messageIdPool.length)] : undefined,
      messageSource: service === "Host Adapter" ? messageSources[Math.floor(Math.random() * messageSources.length)] : undefined,
    };
    
    entries.push(entry);
    counter++;
  }
  
  return entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};