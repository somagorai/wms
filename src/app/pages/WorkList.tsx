import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useLayout } from "../contexts/LayoutContext";
import { generateWorkListLogs, type LogEntry, type LogLevel } from "../data/mockLogs";
import {
  Search,
  Filter,
  Download,
  Plus,
  ChevronDown,
  ChevronUp,
  Flame,
  Circle,
  AlertCircle,
  CheckCircle2,
  Clock,
  ListChecks,
  Loader2,
  TrendingUp,
  Inbox,
  X,
  Save,
  Calendar,
  Sparkles,
  ChevronRight,
  Zap,
  Monitor,
  Check,
  XCircle,
  Info,
  Home,
  AlertTriangle,
  FileText,
  Skull,
  Server,
  FileCode,
  ChevronLeft,
} from "lucide-react";

type WorkItem = {
  id: string;
  workList: string;
  type: string;
  status: string;
  priority: string;
  priorityDateTime: string;
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

// LogLevel and LogEntry are now imported from ../data/mockLogs

// Generate mock data to match Dashboard counts:
// Pick: warning: 3, inProgress: 12, queued: 8, completed: 42, shorted: 2
// Replenishment: warning: 1, inProgress: 5, queued: 3, completed: 38, shorted: 0
// Cycle Count: warning: 0, inProgress: 2, queued: 1, completed: 28, shorted: 0
// Inspection: warning: 2, inProgress: 4, queued: 2, completed: 35, shorted: 1

const generateWorkLists = () => {
  const workLists: WorkItem[] = [];
  let counter = 1;
  
  const attributes1 = ["Marketing", "Backend", "Frontend", "Security", "Quality", "UX", "Operations", "Warehouse"];
  const attributes2 = ["Q1 2024", "Q2 2024", "Sprint 12", "Sprint 13", "Sprint 14", "Plan A", "Plan B", "Plan C"];
  const attributes3 = ["Zone A", "Zone B", "Zone C", "Zone D", "North", "South", "East", "West"];
  const attributes4 = ["Active", "Pending", "Review", "Approved", "Rejected", "On Hold"];
  const attributes5 = ["Standard", "Express", "Overnight", "Economy", "Premium", "Rush"];
  const subTypes = ["Single", "Batch", "Wave", "Cluster", "Priority", "Regular"];
  const storageLocations = ["A1-01-02", "B2-03-04", "C3-05-06", "D4-07-08", "E5-09-10", "F6-11-12"];
  const destinations = ["Dock 1", "Dock 2", "Dock 3", "Stage A", "Stage B", "Packing", "Shipping"];
  const priorities = ["Critical", "High", "Medium", "Low"];
  
  const addItems = (type: string, status: string, count: number) => {
    for (let i = 0; i < count; i++) {
      const priority = priorities[Math.floor(Math.random() * priorities.length)];
      const isHot = status === "Warning" || priority === "Critical" || Math.random() > 0.8;
      const month = Math.floor(Math.random() * 3) + 1;
      const day = Math.floor(Math.random() * 28) + 1;
      const hour = Math.floor(Math.random() * 24);
      const minute = Math.floor(Math.random() * 60);
      
      workLists.push({
        id: counter.toString(),
        workList: `WL-${counter.toString().padStart(3, '0')}`,
        type,
        status,
        priority,
        priorityDateTime: `2024-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
        isHot,
        attribute1: attributes1[Math.floor(Math.random() * attributes1.length)],
        attribute2: attributes2[Math.floor(Math.random() * attributes2.length)],
        attribute3: attributes3[Math.floor(Math.random() * attributes3.length)],
        attribute4: attributes4[Math.floor(Math.random() * attributes4.length)],
        attribute5: attributes5[Math.floor(Math.random() * attributes5.length)],
        subType: subTypes[Math.floor(Math.random() * subTypes.length)],
        started: status === "In Progress" || status === "Completed" ? `2024-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}` : "-",
        storage: storageLocations[Math.floor(Math.random() * storageLocations.length)],
        destination: destinations[Math.floor(Math.random() * destinations.length)],
        created: `2024-${String(Math.floor(Math.random() * 3) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        modified: `2024-03-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}`,
      });
      counter++;
    }
  };
  
  // Pick work lists
  addItems("Pick", "Warning", 3);
  addItems("Pick", "In Progress", 12);
  addItems("Pick", "Queued", 8);
  addItems("Pick", "Completed", 42);
  addItems("Pick", "Shorted", 2);
  
  // Replenishment work lists
  addItems("Replenishment", "Warning", 1);
  addItems("Replenishment", "In Progress", 5);
  addItems("Replenishment", "Queued", 3);
  addItems("Replenishment", "Completed", 38);
  
  // Cycle Count work lists
  addItems("Cycle Count", "In Progress", 2);
  addItems("Cycle Count", "Queued", 1);
  addItems("Cycle Count", "Completed", 28);
  
  // Inspection work lists
  addItems("Inspection", "Warning", 2);
  addItems("Inspection", "In Progress", 4);
  addItems("Inspection", "Queued", 2);
  addItems("Inspection", "Completed", 35);
  addItems("Inspection", "Shorted", 1);
  
  // Add specific WL-101 for demo purposes (override if it already exists)
  const wl101Index = workLists.findIndex(wl => wl.workList === "WL-101");
  const wl101Item: WorkItem = {
    id: "101",
    workList: "WL-101",
    type: "Pick",
    status: "In Progress",
    priority: "High",
    priorityDateTime: "2024-03-16 08:30",
    isHot: true,
    attribute1: "Warehouse",
    attribute2: "Q1 2024",
    attribute3: "Zone A",
    attribute4: "Active",
    attribute5: "Express",
    subType: "Wave",
    started: "2024-03-16 08:30",
    storage: "A1-01-02",
    destination: "Dock 1",
    created: "2024-03-16",
    modified: "2024-03-16",
  };
  
  if (wl101Index !== -1) {
    workLists[wl101Index] = wl101Item;
  } else {
    workLists.push(wl101Item);
  }
  
  return workLists;
};

const mockData: WorkItem[] = generateWorkLists();

// Generate log entries for all work lists using the shared function
const allWorkListLogs = generateWorkListLogs(mockData.map(item => item.workList));

type WorkLine = {
  id: string;
  workListId: string;
  workLine: string;
  priority: string;
  item: string;
  quantity: number;
  status: string;
  started: string;
  comment: string;
};

type WorkOperation = {
  id: string;
  workLineId: string;
  workOperation: string;
  type: string;
  destinationLocation: string;
  sourceLocation: string;
  status: string;
  started: string;
  comment: string;
};

// Generate work lines for all work list items
const generateWorkLines = (): WorkLine[] => {
  const workLines: WorkLine[] = [];
  let lineCounter = 1;
  
  const priorities = ["Critical", "High", "Medium", "Low"];
  const items = ["ITM-5001", "ITM-5002", "ITM-5003", "ITM-6001", "ITM-6002", "ITM-7001", "ITM-7002", "ITM-8001", "ITM-9001", "ITM-9002"];
  const comments = [
    "Priority shipment", "Standard pick", "Awaiting stock", "Bulk replenishment",
    "Quality check required", "Inspect before release", "Scheduled for tomorrow",
    "Urgent replen", "High demand item", "Low stock alert", "Express order",
    "Back order", "Seasonal item", "Clearance", "New arrival", ""
  ];
  
  mockData.forEach((workList) => {
    // Generate 2-5 work lines per work list
    const numLines = Math.floor(Math.random() * 4) + 2;
    
    for (let i = 0; i < numLines; i++) {
      const lineStatus = workList.status === "Completed" ? "Completed" :
                        workList.status === "In Progress" && i === 0 ? "In Progress" :
                        workList.status === "Queued" ? "Queued" :
                        workList.status === "Warning" ? "Warning" :
                        workList.status === "Shorted" ? "Shorted" :
                        i === 0 ? workList.status : ["Queued", "In Progress", "Completed"][Math.floor(Math.random() * 3)];
      
      const hasStarted = lineStatus === "In Progress" || lineStatus === "Completed";
      const startDate = hasStarted ? `2024-03-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')} ${String(Math.floor(Math.random() * 16) + 6).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}` : "";
      
      workLines.push({
        id: `WL${workList.id}-${i + 1}`,
        workListId: workList.id,
        workLine: `WL-${lineCounter.toString().padStart(3, '0')}`,
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        item: items[Math.floor(Math.random() * items.length)],
        quantity: Math.floor(Math.random() * 200) + 5,
        status: lineStatus,
        started: startDate,
        comment: comments[Math.floor(Math.random() * comments.length)]
      });
      
      lineCounter++;
    }
  });
  
  return workLines;
};

// Generate work operations for all work lines
const generateWorkOperations = (workLines: WorkLine[]): WorkOperation[] => {
  const operations: WorkOperation[] = [];
  let opCounter = 1;
  
  // Location pools
  const aisles = Array.from({length: 25}, (_, i) => `AISLE-${String(i + 1).padStart(2, '0')}`);
  const bins = Array.from({length: 30}, (_, i) => `BIN-${String(i + 1).padStart(2, '0')}`);
  const docks = ["DOCK-A1", "DOCK-A2", "DOCK-B1", "DOCK-B2", "DOCK-C1", "DOCK-C2", "DOCK-D1"];
  const stations = ["PACK-STATION-1", "PACK-STATION-2", "PACK-STATION-3", "QC-STATION-A", "QC-STATION-B", "QC-STATION-C"];
  const zones = ["STAGING-AREA-A", "STAGING-AREA-B", "SHIPPING-ZONE-A", "SHIPPING-ZONE-B", "RECEIVING-DOCK-1", "RECEIVING-DOCK-2", "RECEIVING-DOCK-3"];
  
  const getRandomLocation = (type: "aisle" | "dock" | "station" | "zone") => {
    switch (type) {
      case "aisle":
        return `${aisles[Math.floor(Math.random() * aisles.length)]}-${bins[Math.floor(Math.random() * bins.length)]}`;
      case "dock":
        return docks[Math.floor(Math.random() * docks.length)];
      case "station":
        return stations[Math.floor(Math.random() * stations.length)];
      case "zone":
        return zones[Math.floor(Math.random() * zones.length)];
    }
  };
  
  const comments = [
    "In progress", "Awaiting completion", "Standard operation", "Priority task",
    "Quality check required", "Verify before proceeding", "Express handling",
    "Hold for inspection", "Pending approval", "Urgent task", "Normal processing",
    "Scheduled", "On hold", "Expedite", ""
  ];
  
  workLines.forEach((workLine) => {
    const workListItem = mockData.find(w => w.id === workLine.workListId);
    if (!workListItem) return;
    
    // Determine number of operations (equal to or more than 1, usually 2-4)
    const numOps = Math.floor(Math.random() * 3) + 2;
    
    // Operation types based on work type
    let opTypes: string[] = [];
    switch (workListItem.type) {
      case "Pick":
        opTypes = ["Pick", "Stage", "Pack", "Verify", "Ship"];
        break;
      case "Replenishment":
        opTypes = ["Retrieve", "Move", "Transport", "Putaway", "Count", "Label"];
        break;
      case "Cycle Count":
        opTypes = ["Navigate", "Count", "Verify", "Record", "Reconcile", "Update"];
        break;
      case "Inspection":
        opTypes = ["Retrieve", "Inspect", "Visual Check", "Quality Test", "Document", "Approve", "Label"];
        break;
      default:
        opTypes = ["Process", "Verify", "Complete"];
    }
    
    for (let i = 0; i < numOps; i++) {
      const opStatus = workLine.status === "Completed" ? "Completed" :
                      workLine.status === "In Progress" && i === 0 ? "In Progress" :
                      workLine.status === "Queued" ? "Queued" :
                      workLine.status === "Warning" ? "Warning" :
                      workLine.status === "Shorted" ? "Shorted" :
                      i === 0 ? "In Progress" : ["Queued", "In Progress"][Math.floor(Math.random() * 2)];
      
      const hasStarted = opStatus === "In Progress" || opStatus === "Completed";
      const startDate = hasStarted ? `2024-03-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')} ${String(Math.floor(Math.random() * 16) + 6).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}` : "";
      
      operations.push({
        id: `WO${opCounter}`,
        workLineId: workLine.workLine,
        workOperation: `OP-${opCounter.toString().padStart(4, '0')}`,
        type: opTypes[i % opTypes.length],
        destinationLocation: getRandomLocation(i % 2 === 0 ? "aisle" : i % 3 === 0 ? "station" : i % 5 === 0 ? "zone" : "dock"),
        sourceLocation: getRandomLocation("aisle"),
        status: opStatus,
        started: startDate,
        comment: comments[Math.floor(Math.random() * comments.length)]
      });
      
      opCounter++;
    }
  });
  
  return operations;
};

const mockWorkLines: WorkLine[] = generateWorkLines();

const oldMockWorkLines: WorkLine[] = [
  // Work Lines for Work List ID 1 (Redesign Landing Page)
  { id: "WL1-1", workListId: "1", workLine: "WL-001", priority: "High", item: "ITM-5001", quantity: 25, status: "In Progress", started: "2024-03-10 09:15", comment: "Priority shipment" },
  { id: "WL1-2", workListId: "1", workLine: "WL-002", priority: "Medium", item: "ITM-5002", quantity: 50, status: "Completed", started: "2024-03-10 08:30", comment: "Standard pick" },
  { id: "WL1-3", workListId: "1", workLine: "WL-003", priority: "High", item: "ITM-5003", quantity: 15, status: "Queued", started: "", comment: "Awaiting stock" },
  
  // Work Lines for Work List ID 2 (API Integration)
  { id: "WL2-1", workListId: "2", workLine: "WL-004", priority: "Medium", item: "ITM-6001", quantity: 100, status: "Completed", started: "2024-03-05 10:00", comment: "Bulk replenishment" },
  { id: "WL2-2", workListId: "2", workLine: "WL-005", priority: "Low", item: "ITM-6002", quantity: 75, status: "Completed", started: "2024-03-05 11:30", comment: "" },
  
  // Work Lines for Work List ID 3 (User Authentication)
  { id: "WL3-1", workListId: "3", workLine: "WL-006", priority: "Critical", item: "ITM-7001", quantity: 10, status: "In Progress", started: "2024-03-11 14:20", comment: "Quality check required" },
  { id: "WL3-2", workListId: "3", workLine: "WL-007", priority: "High", item: "ITM-7002", quantity: 20, status: "In Progress", started: "2024-03-11 14:45", comment: "Inspect before release" },
  { id: "WL3-3", workListId: "3", workLine: "WL-008", priority: "Medium", item: "ITM-7003", quantity: 5, status: "Queued", started: "", comment: "" },
  
  // Work Lines for Work List ID 4 (Mobile Responsiveness)
  { id: "WL4-1", workListId: "4", workLine: "WL-009", priority: "Low", item: "ITM-8001", quantity: 30, status: "Queued", started: "", comment: "Scheduled for tomorrow" },
  
  // Work Lines for Work List ID 5 (Database Optimization)
  { id: "WL5-1", workListId: "5", workLine: "WL-010", priority: "Critical", item: "ITM-9001", quantity: 200, status: "In Progress", started: "2024-03-11 07:00", comment: "Urgent replen" },
  { id: "WL5-2", workListId: "5", workLine: "WL-011", priority: "Critical", item: "ITM-9002", quantity: 150, status: "In Progress", started: "2024-03-11 08:15", comment: "High demand item" },
];

// Mock workstation data with extended details
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
  { id: "SB-001", workstationId: "WS-001", status: "Active", container: "CONT-A1", registrationSequence: "001", trailerType: "Type A" },
  { id: "SB-002", workstationId: "WS-001", status: "Inactive", container: "CONT-A2", registrationSequence: "002", trailerType: "Type B" },
  { id: "SB-003", workstationId: "WS-002", status: "Active", container: "CONT-B1", registrationSequence: "003", trailerType: "Type A" },
  { id: "SB-004", workstationId: "WS-003", status: "Active", container: "CONT-C1", registrationSequence: "004", trailerType: "Type C" },
  { id: "SB-005", workstationId: "WS-003", status: "Inactive", container: "CONT-C2", registrationSequence: "005", trailerType: "Type A" },
  { id: "SB-006", workstationId: "WS-004", status: "Active", container: "CONT-D1", registrationSequence: "006", trailerType: "Type B" },
  { id: "SB-007", workstationId: "WS-005", status: "Active", container: "CONT-E1", registrationSequence: "007", trailerType: "Type A" },
  { id: "SB-008", workstationId: "WS-007", status: "Active", container: "CONT-F1", registrationSequence: "008", trailerType: "Type C" },
  { id: "SB-009", workstationId: "WS-007", status: "Active", container: "CONT-F2", registrationSequence: "009", trailerType: "Type B" },
  { id: "SB-010", workstationId: "WS-008", status: "Active", container: "CONT-G1", registrationSequence: "010", trailerType: "Type A" },
  { id: "SB-011", workstationId: "WS-009", status: "Active", container: "CONT-H1", registrationSequence: "011", trailerType: "Type B" },
];

const mockWorkOperations: WorkOperation[] = generateWorkOperations(mockWorkLines);

const oldMockWorkOperations: WorkOperation[] = [
  // Operations for WL-001
  { id: "WO1-1", workLineId: "WL-001", workOperation: "OP-001", type: "Pick", destinationLocation: "DOCK-A1", sourceLocation: "AISLE-12-BIN-05", status: "In Progress", started: "2024-03-10 09:15", comment: "In progress" },
  { id: "WO1-2", workLineId: "WL-001", workOperation: "OP-002", type: "Pack", destinationLocation: "PACK-STATION-3", sourceLocation: "DOCK-A1", status: "Queued", started: "", comment: "Awaiting pick completion" },
  
  // Operations for WL-002
  { id: "WO2-1", workLineId: "WL-002", workOperation: "OP-003", type: "Pick", destinationLocation: "DOCK-B2", sourceLocation: "AISLE-08-BIN-12", status: "Completed", started: "2024-03-10 08:30", comment: "Standard pick completed" },
  { id: "WO2-2", workLineId: "WL-002", workOperation: "OP-004", type: "Pack", destinationLocation: "PACK-STATION-1", sourceLocation: "DOCK-B2", status: "Completed", started: "2024-03-10 09:45", comment: "Packaged and ready" },
  { id: "WO2-3", workLineId: "WL-002", workOperation: "OP-005", type: "Ship", destinationLocation: "SHIPPING-ZONE-A", sourceLocation: "PACK-STATION-1", status: "Completed", started: "2024-03-10 10:30", comment: "Shipped via carrier XYZ" },
  
  // Operations for WL-003
  { id: "WO3-1", workLineId: "WL-003", workOperation: "OP-006", type: "Pick", destinationLocation: "DOCK-C3", sourceLocation: "AISLE-15-BIN-20", status: "Queued", started: "", comment: "Waiting for stock arrival" },
  
  // Operations for WL-004
  { id: "WO4-1", workLineId: "WL-004", workOperation: "OP-007", type: "Move", destinationLocation: "AISLE-20-BIN-01", sourceLocation: "RECEIVING-DOCK-1", status: "Completed", started: "2024-03-05 10:00", comment: "Bulk move completed" },
  { id: "WO4-2", workLineId: "WL-004", workOperation: "OP-008", type: "Putaway", destinationLocation: "AISLE-20-BIN-01", sourceLocation: "AISLE-20-BIN-01", status: "Completed", started: "2024-03-05 11:15", comment: "" },
  
  // Operations for WL-005
  { id: "WO5-1", workLineId: "WL-005", workOperation: "OP-009", type: "Move", destinationLocation: "AISLE-18-BIN-10", sourceLocation: "RECEIVING-DOCK-2", status: "Completed", started: "2024-03-05 11:30", comment: "" },
  { id: "WO5-2", workLineId: "WL-005", workOperation: "OP-010", type: "Putaway", destinationLocation: "AISLE-18-BIN-10", sourceLocation: "AISLE-18-BIN-10", status: "Completed", started: "2024-03-05 12:00", comment: "" },
  
  // Operations for WL-006
  { id: "WO6-1", workLineId: "WL-006", workOperation: "OP-011", type: "Inspect", destinationLocation: "QC-STATION-A", sourceLocation: "AISLE-05-BIN-08", status: "In Progress", started: "2024-03-11 14:20", comment: "Quality inspection in progress" },
  { id: "WO6-2", workLineId: "WL-006", workOperation: "OP-012", type: "Approve", destinationLocation: "APPROVED-ZONE", sourceLocation: "QC-STATION-A", status: "Queued", started: "", comment: "" },
  
  // Operations for WL-007
  { id: "WO7-1", workLineId: "WL-007", workOperation: "OP-013", type: "Inspect", destinationLocation: "QC-STATION-B", sourceLocation: "AISLE-05-BIN-15", status: "In Progress", started: "2024-03-11 14:45", comment: "Visual check underway" },
  { id: "WO7-2", workLineId: "WL-007", workOperation: "OP-014", type: "Document", destinationLocation: "QC-STATION-B", sourceLocation: "QC-STATION-B", status: "Queued", started: "", comment: "Pending inspection results" },
  { id: "WO7-3", workLineId: "WL-007", workOperation: "OP-015", type: "Approve", destinationLocation: "APPROVED-ZONE", sourceLocation: "QC-STATION-B", status: "Queued", started: "", comment: "" },
  
  // Operations for WL-008
  { id: "WO8-1", workLineId: "WL-008", workOperation: "OP-016", type: "Inspect", destinationLocation: "QC-STATION-C", sourceLocation: "AISLE-05-BIN-22", status: "Queued", started: "", comment: "Scheduled for next shift" },
  { id: "WO8-2", workLineId: "WL-008", workOperation: "OP-017", type: "Document", destinationLocation: "QC-STATION-C", sourceLocation: "QC-STATION-C", status: "Queued", started: "", comment: "" },
  { id: "WO8-3", workLineId: "WL-008", workOperation: "OP-018", type: "Label", destinationLocation: "QC-STATION-C", sourceLocation: "QC-STATION-C", status: "Queued", started: "", comment: "" },
  
  // Operations for WL-009
  { id: "WO9-1", workLineId: "WL-009", workOperation: "OP-019", type: "Pick", destinationLocation: "DOCK-D4", sourceLocation: "AISLE-10-BIN-18", status: "Queued", started: "", comment: "Low priority pick" },
  { id: "WO9-2", workLineId: "WL-009", workOperation: "OP-020", type: "Pack", destinationLocation: "PACK-STATION-2", sourceLocation: "DOCK-D4", status: "Queued", started: "", comment: "" },
  { id: "WO9-3", workLineId: "WL-009", workOperation: "OP-021", type: "Stage", destinationLocation: "STAGING-AREA-B", sourceLocation: "PACK-STATION-2", status: "Queued", started: "", comment: "Hold for batch shipment" },
  
  // Operations for WL-010
  { id: "WO10-1", workLineId: "WL-010", workOperation: "OP-022", type: "Move", destinationLocation: "AISLE-22-BIN-05", sourceLocation: "RECEIVING-DOCK-3", status: "In Progress", started: "2024-03-11 07:00", comment: "Urgent transfer" },
  { id: "WO10-2", workLineId: "WL-010", workOperation: "OP-023", type: "Putaway", destinationLocation: "AISLE-22-BIN-05", sourceLocation: "AISLE-22-BIN-05", status: "Queued", started: "", comment: "High priority" },
  { id: "WO10-3", workLineId: "WL-010", workOperation: "OP-024", type: "Count", destinationLocation: "AISLE-22-BIN-05", sourceLocation: "AISLE-22-BIN-05", status: "Queued", started: "", comment: "Verify quantity after putaway" },
  
  // Operations for WL-011
  { id: "WO11-1", workLineId: "WL-011", workOperation: "OP-025", type: "Move", destinationLocation: "AISLE-22-BIN-10", sourceLocation: "RECEIVING-DOCK-3", status: "In Progress", started: "2024-03-11 08:15", comment: "" },
  { id: "WO11-2", workLineId: "WL-011", workOperation: "OP-026", type: "Putaway", destinationLocation: "AISLE-22-BIN-10", sourceLocation: "AISLE-22-BIN-10", status: "Queued", started: "", comment: "" },
  { id: "WO11-3", workLineId: "WL-011", workOperation: "OP-027", type: "Label", destinationLocation: "AISLE-22-BIN-10", sourceLocation: "AISLE-22-BIN-10", status: "Queued", started: "", comment: "Apply location label" },
];

type SortField = keyof WorkItem;
type SortDirection = "asc" | "desc";

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Completed":
      return <CheckCircle2 size={16} className="text-green-500" />;
    case "In Progress":
      return <Clock size={16} className="text-blue-500" />;
    case "Queued":
      return <Circle size={16} className="text-zinc-500" />;
    case "Warning":
      return <AlertCircle size={16} className="text-red-500" />;
    case "Shorted":
      return <XCircle size={16} className="text-purple-500" />;
    default:
      return <AlertCircle size={16} className="text-zinc-500" />;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "Critical":
      return "bg-red-500/10 text-red-500 border-red-500/20";
    case "High":
      return "bg-orange-500/10 text-orange-500 border-orange-500/20";
    case "Medium":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    case "Low":
      return "bg-green-500/10 text-green-500 border-green-500/20";
    default:
      return "bg-zinc-500/10 text-zinc-500 border-zinc-500/20";
  }
};

// Export mock data for use in other components
export { mockData as mockWorkListData, mockWorkLines, mockWorkOperations };
export type { WorkItem, WorkLine, WorkOperation };

export function WorkList() {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("modified");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());
  const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(new Set());
  const [selectedPriorities, setSelectedPriorities] = useState<Set<string>>(new Set());
  const [typeSearch, setTypeSearch] = useState("");
  const [statusSearch, setStatusSearch] = useState("");
  const [prioritySearch, setPrioritySearch] = useState("");
  const [hasSavedFilters, setHasSavedFilters] = useState(false);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [showFilterTooltip, setShowFilterTooltip] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'type' | 'status' | 'priority' | 'time' | null>(null);
  
  // Time range filter state
  const [timeRange, setTimeRange] = useState<string>("");
  const [showCustomDateRange, setShowCustomDateRange] = useState(false);
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [isAiCommand, setIsAiCommand] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<WorkItem | null>(null);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "worklist" | "actions" | "logs">("details");
  const [selectedWorkLine, setSelectedWorkLine] = useState<string | null>(null);
  const [logsSearchTerm, setLogsSearchTerm] = useState("");
  const [expandedLogGroups, setExpandedLogGroups] = useState<Set<string>>(new Set());
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 100;
  
  // Actions tab state
  const [activeAction, setActiveAction] = useState<"assign" | "cancel" | null>(null);
  const [cancelConfirmed, setCancelConfirmed] = useState(false);
  const [showApplyChangesConfirmation, setShowApplyChangesConfirmation] = useState(false);
  const [applyComplete, setApplyComplete] = useState(false);
  const [showDiscardChangesDialog, setShowDiscardChangesDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<WorkItem | null>(null);
  
  // Assignment workflow state
  const [selectedWorkstation, setSelectedWorkstation] = useState<string>("");
  const [selectedSortbar, setSelectedSortbar] = useState<string>("");
  const [expandedWorkstations, setExpandedWorkstations] = useState<Set<string>>(new Set());
  const [pendingAssignment, setPendingAssignment] = useState<{workstation: string; sortbar: string} | null>(null);
  
  // Cancellation workflow state
  const [cancelReason, setCancelReason] = useState<string>("");
  const [pendingCancellation, setPendingCancellation] = useState<{reason: string} | null>(null);
  
  // Get workstations panel state from layout context
  const { showWorkstations, setShowWorkstations, workListHiddenColumns, workListPinnedColumns } = useLayout();

  // Debug: Log pinned columns
  useEffect(() => {
    console.log('WorkList - Pinned Columns:', workListPinnedColumns);
  }, [workListPinnedColumns]);

  // Define column configuration
  type ColumnKey = keyof WorkItem;
  const allColumns: ColumnKey[] = [
    "workList", "type", "status", "priority", "priorityDateTime", "isHot",
    "attribute1", "attribute2", "attribute3", "attribute4", "attribute5",
    "subType", "started", "storage", "destination", "created", "modified"
  ];

  const columnDisplayNames: Record<string, string> = {
    workList: "Work List",
    type: "Type",
    status: "Status",
    priority: "Priority",
    priorityDateTime: "Priority Date Time",
    isHot: "Hot",
    attribute1: "Attribute 1",
    attribute2: "Attribute 2",
    attribute3: "Attribute 3",
    attribute4: "Attribute 4",
    attribute5: "Attribute 5",
    subType: "Sub Type",
    started: "Started",
    storage: "Storage",
    destination: "Destination",
    created: "Created",
    modified: "Modified"
  };

  // Calculate column widths for sticky positioning (in pixels)
  const columnWidths: Record<string, number> = {
    workList: 120,
    type: 140,
    status: 140,
    priority: 120,
    priorityDateTime: 180,
    isHot: 80,
    attribute1: 140,
    attribute2: 140,
    attribute3: 140,
    attribute4: 140,
    attribute5: 140,
    subType: 120,
    started: 160,
    storage: 140,
    destination: 140,
    created: 160,
    modified: 160
  };

  // Calculate left offset for each pinned column
  const getPinnedColumnStyle = (columnKey: string): React.CSSProperties => {
    const pinnedIndex = workListPinnedColumns.indexOf(columnKey);
    if (pinnedIndex === -1) return {};
    
    let leftOffset = 0;
    for (let i = 0; i < pinnedIndex; i++) {
      const prevColumn = workListPinnedColumns[i];
      leftOffset += columnWidths[prevColumn] || 150;
    }
    
    return {
      position: 'sticky',
      left: `${leftOffset}px`,
      zIndex: 10
    };
  };

  // Organize columns: pinned first, then unpinned (excluding hidden)
  const visibleColumns = allColumns.filter(col => !workListHiddenColumns.includes(col));
  const pinnedCols = visibleColumns.filter(col => workListPinnedColumns.includes(col));
  const unpinnedCols = visibleColumns.filter(col => !workListPinnedColumns.includes(col));
  const orderedColumns = [...pinnedCols, ...unpinnedCols];

  // Load saved filters from localStorage on mount
  useEffect(() => {
    const savedFilters = localStorage.getItem('workListFilters');
    if (savedFilters) {
      try {
        const { types, statuses, priorities } = JSON.parse(savedFilters);
        setSelectedTypes(new Set(types || []));
        setSelectedStatuses(new Set(statuses || []));
        setSelectedPriorities(new Set(priorities || []));
        setHasSavedFilters(true);
      } catch (error) {
        console.error('Error loading saved filters:', error);
      }
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.filter-dropdown')) {
        setActiveDropdown(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Apply filter from URL on mount
  useEffect(() => {
    const filterParam = searchParams.get("filter");
    const searchParam = searchParams.get("search");
    const workListId = searchParams.get("workListId");
    const workstationsParam = searchParams.get("workstations");
    const typeParam = searchParams.get("type");
    const workListParam = searchParams.get("workList");
    const openPanelParam = searchParams.get("openPanel");
    
    // Handle workstations parameter for help navigation
    if (workstationsParam === "true") {
      setShowWorkstations(true);
    }
    
    // Handle workList parameter for navigation from Storage Locations
    if (workListParam && openPanelParam === "true") {
      const item = mockData.find(w => w.workList === workListParam);
      if (item) {
        // Set search to the work list name to filter
        setSearchTerm(workListParam);
        setActiveFilter(null);
        
        // Set the item as selected and open detail panel
        setSelectedItem(item);
        setShowDetailPanel(true);
        setActiveTab("details");
      }
    }
    // Handle workListId parameter for navigation from Dashboard
    else if (workListId) {
      const item = mockData.find(w => w.id === workListId);
      if (item) {
        // Clear filters and set search to the work list name
        setSearchTerm(item.workList);
        setActiveFilter(null);
        setSelectedTypes(new Set());
        setSelectedStatuses(new Set());
        setSelectedPriorities(new Set());
        setTimeRange("");
        
        // Set the item as selected and open detail panel
        setSelectedItem(item);
        setShowDetailPanel(true);
        // Only set default tab on initial navigation from Dashboard
        setActiveTab("details");
      }
    } else {
      // Only apply regular filters if not navigating from Dashboard
      if (filterParam) {
        setActiveFilter(filterParam);
      }
      
      if (searchParam) {
        setSearchTerm(searchParam);
      }

      // Handle type parameter for filtering by work type
      if (typeParam) {
        setSelectedTypes(new Set([typeParam]));
      }
    }
  }, [searchParams]);

  // Auto-expand all workstations when Assign action is selected
  useEffect(() => {
    if (activeAction === "assign" && selectedItem) {
      const workstationsForType = mockWorkstations
        .filter(ws => ws.type === selectedItem.type)
        .map(ws => ws.id);
      setExpandedWorkstations(new Set(workstationsForType));
    }
  }, [activeAction, selectedItem]);

  // Apply advanced filters to data
  const getFilteredDataForStats = () => {
    return mockData.filter((item) => {
      const matchesType = selectedTypes.size === 0 || selectedTypes.has(item.type);
      const matchesStatus = selectedStatuses.size === 0 || selectedStatuses.has(item.status);
      const matchesPriority = selectedPriorities.size === 0 || selectedPriorities.has(item.priority);
      return matchesType && matchesStatus && matchesPriority;
    });
  };

  // Calculate dashboard stats based on filtered data
  const filteredDataForStats = getFilteredDataForStats();
  const warningItems = filteredDataForStats.filter((item) => item.status === "Warning").length;
  const queuedItems = filteredDataForStats.filter((item) => item.status === "Queued").length;
  const processingItems = filteredDataForStats.filter((item) => item.status === "In Progress").length;
  const completedItems = filteredDataForStats.filter((item) => item.status === "Completed").length;
  const shortedItems = filteredDataForStats.filter((item) => item.status === "Shorted").length;
  const hotItems = filteredDataForStats.filter((item) => item.isHot).length;
  const allOpenItems = filteredDataForStats.filter((item) => item.status !== "Completed").length;
  const allItems = filteredDataForStats.length;

  const stats = [
    {
      label: "All Open",
      value: allOpenItems.toString(),
      icon: Clock,
      color: "from-cyan-500 to-blue-500",
      description: "All open items",
      filterKey: "allopen",
    },
    {
      label: "All",
      value: allItems.toString(),
      icon: ListChecks,
      color: "from-zinc-500 to-zinc-600",
      description: "All work lists",
      filterKey: "all",
    },
    {
      label: "Warning",
      value: warningItems.toString(),
      icon: AlertCircle,
      color: "from-red-500 to-orange-500",
      description: "Needs attention",
      filterKey: "warning",
    },
    {
      label: "Queued",
      value: queuedItems.toString(),
      icon: Inbox,
      color: "from-yellow-500 to-orange-500",
      description: "Pending items",
      filterKey: "queued",
    },
    {
      label: "In Progress",
      value: processingItems.toString(),
      icon: Loader2,
      color: "from-[#50e080] to-[#3bc76a]",
      description: "In progress",
      filterKey: "inprogress",
    },
    {
      label: "Completed",
      value: completedItems.toString(),
      icon: CheckCircle2,
      color: "from-emerald-500 to-green-500",
      description: "Finished items",
      filterKey: "completed",
    },
    {
      label: "Shorted",
      value: shortedItems.toString(),
      icon: XCircle,
      color: "from-purple-500 to-pink-500",
      description: "Short items",
      filterKey: "shorted",
    },
    {
      label: "Hot Items",
      value: hotItems.toString(),
      icon: Flame,
      color: "from-orange-500 to-red-500",
      description: "Priority items",
      filterKey: "hot",
    },
  ];

  const handleTileClick = (filterKey: string) => {
    // Toggle filter: if clicking the same tile, clear the filter
    setActiveFilter(activeFilter === filterKey ? null : filterKey);
    // Clear search box when clicking a tile
    setSearchTerm('');
    setIsAiCommand(false);
    setAiSuggestions([]);
  };

  const toggleFilterOption = (category: 'type' | 'status' | 'priority', value: string) => {
    if (category === 'type') {
      const newSet = new Set(selectedTypes);
      if (newSet.has(value)) {
        newSet.delete(value);
      } else {
        newSet.add(value);
      }
      setSelectedTypes(newSet);
    } else if (category === 'status') {
      const newSet = new Set(selectedStatuses);
      if (newSet.has(value)) {
        newSet.delete(value);
      } else {
        newSet.add(value);
      }
      setSelectedStatuses(newSet);
    } else if (category === 'priority') {
      const newSet = new Set(selectedPriorities);
      if (newSet.has(value)) {
        newSet.delete(value);
      } else {
        newSet.add(value);
      }
      setSelectedPriorities(newSet);
    }
  };

  const clearAllFilters = () => {
    setSelectedTypes(new Set());
    setSelectedStatuses(new Set());
    setSelectedPriorities(new Set());
    setTimeRange("");
    setShowCustomDateRange(false);
    setCustomStartDate("");
    setCustomEndDate("");
    setHasSavedFilters(false);
  };

  const hasActiveFilters = selectedTypes.size > 0 || selectedStatuses.size > 0 || selectedPriorities.size > 0 || timeRange !== "";

  // Calculate total filter count
  const totalFilterCount = selectedTypes.size + selectedStatuses.size + selectedPriorities.size + (timeRange ? 1 : 0);

  // Helper function to calculate time range
  const getTimeRangeDate = (range: string): Date | null => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (range) {
      case "1h":
        return new Date(now.getTime() - 1 * 60 * 60 * 1000);
      case "2h":
        return new Date(now.getTime() - 2 * 60 * 60 * 1000);
      case "4h":
        return new Date(now.getTime() - 4 * 60 * 60 * 1000);
      case "8h":
        return new Date(now.getTime() - 8 * 60 * 60 * 1000);
      case "12h":
        return new Date(now.getTime() - 12 * 60 * 60 * 1000);
      case "24h":
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
      case "today":
        return today;
      default:
        return null;
    }
  };

  // Helper function to check if date is within time range
  const isWithinTimeRange = (itemDate: string): boolean => {
    if (!timeRange) return true;
    
    if (timeRange === "custom") {
      if (!customStartDate && !customEndDate) return true;
      
      const itemDateTime = new Date(itemDate);
      
      if (customStartDate && customEndDate) {
        const startDateTime = new Date(customStartDate);
        const endDateTime = new Date(customEndDate);
        return itemDateTime >= startDateTime && itemDateTime <= endDateTime;
      } else if (customStartDate) {
        const startDateTime = new Date(customStartDate);
        return itemDateTime >= startDateTime;
      } else if (customEndDate) {
        const endDateTime = new Date(customEndDate);
        return itemDateTime <= endDateTime;
      }
    }
    
    const rangeDate = getTimeRangeDate(timeRange);
    if (!rangeDate) return true;
    
    const itemDateTime = new Date(itemDate);
    return itemDateTime >= rangeDate;
  };

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
    if (range === "custom") {
      setShowCustomDateRange(true);
    } else {
      setShowCustomDateRange(false);
      setCustomStartDate("");
      setCustomEndDate("");
    }
  };

  // Helper to render cell content based on column type
  const renderCellContent = (item: WorkItem, columnKey: ColumnKey) => {
    const value = item[columnKey];
    
    switch (columnKey) {
      case "workList":
        return (
          <div className="flex items-center gap-2">
            <span className="text-white font-medium">{value}</span>
          </div>
        );
      case "type":
        return <span className="text-zinc-400">{value}</span>;
      case "status":
        return (
          <div className="flex items-center gap-2">
            {getStatusIcon(value as string)}
            <span className="text-zinc-300">{value}</span>
          </div>
        );
      case "priority":
        return (
          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${getPriorityColor(value as string)}`}>
            {value}
          </span>
        );
      case "priorityDateTime":
        return <span className="text-zinc-400 text-sm">{value}</span>;
      case "isHot":
        return value ? (
          <div className="flex items-center gap-1.5">
            <Flame size={16} className="text-orange-500" />
            <span className="text-orange-500 text-sm font-medium">Hot</span>
          </div>
        ) : (
          <span className="text-zinc-600 text-sm">-</span>
        );
      default:
        return <span className="text-zinc-400">{value}</span>;
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredData = mockData.filter((item) => {
    // Apply search filter
    const matchesSearch = Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Apply tile filter
    let matchesTileFilter = true;
    if (activeFilter === "allopen") {
      matchesTileFilter = item.status !== "Completed";
    } else if (activeFilter === "all") {
      matchesTileFilter = true; // Show all items
    } else if (activeFilter === "warning") {
      matchesTileFilter = item.status === "Warning";
    } else if (activeFilter === "queued") {
      matchesTileFilter = item.status === "Queued";
    } else if (activeFilter === "inprogress") {
      matchesTileFilter = item.status === "In Progress";
    } else if (activeFilter === "completed") {
      matchesTileFilter = item.status === "Completed";
    } else if (activeFilter === "shorted") {
      matchesTileFilter = item.status === "Shorted";
    } else if (activeFilter === "hot") {
      matchesTileFilter = item.isHot;
    }
    
    // Apply advanced filters
    const matchesType = selectedTypes.size === 0 || selectedTypes.has(item.type);
    const matchesStatus = selectedStatuses.size === 0 || selectedStatuses.has(item.status);
    const matchesPriority = selectedPriorities.size === 0 || selectedPriorities.has(item.priority);
    
    return matchesSearch && matchesTileFilter && matchesType && matchesStatus && matchesPriority && isWithinTimeRange(item.modified);
  });

  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === "boolean" && typeof bValue === "boolean") {
      return sortDirection === "asc"
        ? (aValue ? 1 : -1) - (bValue ? 1 : -1)
        : (bValue ? 1 : -1) - (aValue ? 1 : -1);
    }
    
    return 0;
  });

  // Calculate pagination
  const totalItems = sortedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeFilter, selectedTypes, selectedStatuses, selectedPriorities, timeRange]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ChevronUp size={16} />
    ) : (
      <ChevronDown size={16} />
    );
  };

  const saveFilters = () => {
    const filters = {
      types: Array.from(selectedTypes),
      statuses: Array.from(selectedStatuses),
      priorities: Array.from(selectedPriorities),
    };
    localStorage.setItem('workListFilters', JSON.stringify(filters));
    setHasSavedFilters(true);
    setShowSaveConfirmation(true);
    setTimeout(() => setShowSaveConfirmation(false), 3000);
  };

  const clearSavedFilters = () => {
    localStorage.removeItem('workListFilters');
    setHasSavedFilters(false);
    clearAllFilters();
  };

  const handleShowAll = () => {
    setActiveFilter("all");
    clearAllFilters();
  };

  const handleShowProcessing = () => {
    setActiveFilter("processing");
    clearAllFilters();
  };

  const handleShowToday = () => {
    setActiveFilter(null);
    clearAllFilters();
    setTimeRange("today");
  };

  // AI Command Parser
  const parseAiCommand = (input: string): boolean => {
    const lowerInput = input.toLowerCase().trim();
    
    // Status filters
    if (lowerInput.match(/\b(show|display|find|get|filter)\s+(all\s+)?(processing|queued|completed)\s+(items?|work|tasks?|lists?)?/)) {
      clearAllFilters();
      if (lowerInput.includes('processing')) {
        setSelectedStatuses(new Set(['Processing']));
        setActiveFilter('processing');
      } else if (lowerInput.includes('queued')) {
        setSelectedStatuses(new Set(['Queued']));
        setActiveFilter('queued');
      } else if (lowerInput.includes('completed')) {
        setSelectedStatuses(new Set(['Completed']));
        setActiveFilter('completed');
      }
      setIsAiCommand(true);
      return true;
    }
    
    // Priority filters
    if (lowerInput.match(/\b(show|display|find|get|filter)\s+(all\s+)?(critical|high|medium|low)\s+(priority|items?|work|tasks?)?/)) {
      clearAllFilters();
      if (lowerInput.includes('critical')) {
        setSelectedPriorities(new Set(['Critical']));
      } else if (lowerInput.includes('high')) {
        setSelectedPriorities(new Set(['High']));
      } else if (lowerInput.includes('medium')) {
        setSelectedPriorities(new Set(['Medium']));
      } else if (lowerInput.includes('low')) {
        setSelectedPriorities(new Set(['Low']));
      }
      setIsAiCommand(true);
      return true;
    }
    
    // Type filters
    if (lowerInput.match(/\b(show|display|find|get|filter)\s+(all\s+)?(pick|replen|inspection|cycle)/)) {
      clearAllFilters();
      if (lowerInput.includes('pick')) {
        setSelectedTypes(new Set(['Pick']));
      } else if (lowerInput.includes('replen')) {
        setSelectedTypes(new Set(['Replenishment']));
      } else if (lowerInput.includes('inspection')) {
        setSelectedTypes(new Set(['Inspection']));
      } else if (lowerInput.includes('cycle')) {
        setSelectedTypes(new Set(['Cycle Count']));
      }
      setIsAiCommand(true);
      return true;
    }
    
    // Hot items
    if (lowerInput.match(/\b(show|display|find|get|filter)\s+(all\s+)?(hot|urgent|priority)\s+(items?|work|tasks?)?/)) {
      clearAllFilters();
      setActiveFilter('hot');
      setIsAiCommand(true);
      return true;
    }
    
    // Time range filters
    if (lowerInput.match(/\b(show|display|find|get|filter)\s+(items?|work)?\s*(from\s+)?(today|last\s+\d+\s*h)/)) {
      clearAllFilters();
      if (lowerInput.includes('today')) {
        setTimeRange('today');
      } else if (lowerInput.includes('1h') || lowerInput.includes('1 h')) {
        setTimeRange('1h');
      } else if (lowerInput.includes('2h') || lowerInput.includes('2 h')) {
        setTimeRange('2h');
      } else if (lowerInput.includes('4h') || lowerInput.includes('4 h')) {
        setTimeRange('4h');
      } else if (lowerInput.includes('8h') || lowerInput.includes('8 h')) {
        setTimeRange('8h');
      } else if (lowerInput.includes('12h') || lowerInput.includes('12 h')) {
        setTimeRange('12h');
      } else if (lowerInput.includes('24h') || lowerInput.includes('24 h')) {
        setTimeRange('24h');
      }
      setIsAiCommand(true);
      return true;
    }
    
    // Show all
    if (lowerInput.match(/\b(show|display|find|get)\s+(all|everything)\b/)) {
      clearAllFilters();
      setActiveFilter('all');
      setIsAiCommand(true);
      return true;
    }
    
    // Clear filters
    if (lowerInput.match(/\b(clear|reset|remove)\s+(all\s+)?(filters?|everything)\b/)) {
      clearAllFilters();
      setActiveFilter(null);
      setSearchTerm('');
      setIsAiCommand(true);
      return true;
    }
    
    setIsAiCommand(false);
    return false;
  };

  // Generate AI suggestions based on input
  const generateAiSuggestions = (input: string): string[] => {
    if (input.length < 2) return [];
    
    const lowerInput = input.toLowerCase();
    const suggestions: string[] = [];
    
    if (lowerInput.match(/\b(show|display|find)/)) {
      suggestions.push('show all processing items');
      suggestions.push('show high priority work');
      suggestions.push('show items from today');
      suggestions.push('show all hot items');
    }
    
    if (lowerInput.match(/\bpro/)) {
      suggestions.push('show processing items');
    }
    
    if (lowerInput.match(/\bhigh|priority/)) {
      suggestions.push('show high priority items');
      suggestions.push('show critical priority items');
    }
    
    if (lowerInput.match(/\btoday|time/)) {
      suggestions.push('show items from today');
      suggestions.push('show items from last 4h');
    }
    
    if (lowerInput.match(/\bhot|urgent/)) {
      suggestions.push('show all hot items');
    }
    
    if (lowerInput.match(/\bpick|replen|inspection|cycle/)) {
      if (lowerInput.includes('pick')) suggestions.push('show all pick items');
      if (lowerInput.includes('replen')) suggestions.push('show all replenishment items');
      if (lowerInput.includes('inspection')) suggestions.push('show all inspection items');
      if (lowerInput.includes('cycle')) suggestions.push('show all cycle count items');
    }
    
    return suggestions.slice(0, 3);
  };

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    
    // Try to parse as AI command
    const isCommand = parseAiCommand(value);
    
    // If it was a command, clear the search term so it doesn't interfere with filtering
    if (isCommand) {
      setTimeout(() => setSearchTerm(''), 100);
    }
    
    // Generate suggestions if not a complete command
    if (!isCommand && value.length >= 2) {
      const suggestions = generateAiSuggestions(value);
      setAiSuggestions(suggestions);
    } else {
      setAiSuggestions([]);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    parseAiCommand(suggestion);
    setAiSuggestions([]);
  };

  // Check if there are pending changes
  const hasPendingChanges = () => {
    return pendingAssignment !== null || pendingCancellation !== null;
  };

  // Handle row click with pending changes check
  const handleRowClick = (item: WorkItem) => {
    if (hasPendingChanges()) {
      setPendingNavigation(item);
      setShowDiscardChangesDialog(true);
      return;
    }
    
    setSelectedItem(item);
    setShowDetailPanel(true);
    // Don't reset activeTab - remember which tab user was on
    setActiveAction(null);
    setSelectedWorkstation("");
    setSelectedSortbar("");
  };
  
  const toggleWorkstation = (workstationId: string) => {
    setExpandedWorkstations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(workstationId)) {
        newSet.delete(workstationId);
      } else {
        newSet.add(workstationId);
      }
      return newSet;
    });
  };
  
  // Handle apply changes
  const handleApplyChanges = () => {
    setShowApplyChangesConfirmation(true);
  };
  
  const handleConfirmApplyChanges = () => {
    // Here you would make the actual API calls
    if (pendingAssignment) {
      console.log(`Assigning ${selectedItem?.workList} to ${pendingAssignment.sortbar}`);
    }
    if (pendingCancellation) {
      console.log(`Cancelling ${selectedItem?.workList} with reason: ${pendingCancellation.reason}`);
    }
    
    setApplyComplete(true);
    setTimeout(() => {
      setShowApplyChangesConfirmation(false);
      setApplyComplete(false);
      setPendingAssignment(null);
      setPendingCancellation(null);
      setSelectedWorkstation("");
      setSelectedSortbar("");
      setCancelReason("");
      setActiveAction(null);
    }, 2000);
  };
  
  const handleCancelApplyChanges = () => {
    setShowApplyChangesConfirmation(false);
  };
  
  // Handle discard changes
  const handleDiscardChanges = () => {
    setPendingAssignment(null);
    setPendingCancellation(null);
    setSelectedWorkstation("");
    setSelectedSortbar("");
    setCancelReason("");
    setActiveAction(null);
    setShowDiscardChangesDialog(false);
    
    if (pendingNavigation) {
      setSelectedItem(pendingNavigation);
      setShowDetailPanel(true);
      setPendingNavigation(null);
    } else {
      // If no pending navigation, user was trying to close the panel
      setShowDetailPanel(false);
    }
  };
  
  const handleKeepChanges = () => {
    setShowDiscardChangesDialog(false);
    setPendingNavigation(null);
  };

  // Get journey steps based on work type and status
  const getJourneySteps = (type: string, status: string) => {
    const baseSteps: { [key: string]: Array<{ label: string; completed: boolean }> } = {
      Pick: [
        { label: "Receive Pick Order", completed: true },
        { label: "Locate Item", completed: status === "In Progress" || status === "Completed" },
        { label: "Scan Item", completed: status === "Completed" },
        { label: "Verify Quantity", completed: status === "Completed" },
        { label: "Stage for Shipping", completed: status === "Completed" },
        { label: "Complete Pick", completed: status === "Completed" },
      ],
      Replenishment: [
        { label: "Identify Low Stock", completed: true },
        { label: "Retrieve Stock", completed: status === "In Progress" || status === "Completed" },
        { label: "Transport to Location", completed: status === "Completed" },
        { label: "Scan Location", completed: status === "Completed" },
        { label: "Update Inventory", completed: status === "Completed" },
        { label: "Confirm Replenishment", completed: status === "Completed" },
      ],
      "Cycle Count": [
        { label: "Receive Count Request", completed: true },
        { label: "Locate Items", completed: status === "In Progress" || status === "Completed" },
        { label: "Physical Count", completed: status === "Completed" },
        { label: "Scan Items", completed: status === "Completed" },
        { label: "Reconcile Variance", completed: status === "Completed" },
        { label: "Update System", completed: status === "Completed" },
      ],
      Inspection: [
        { label: "Receive Inspection Request", completed: true },
        { label: "Gather Items", completed: status === "In Progress" || status === "Completed" },
        { label: "Visual Inspection", completed: status === "Completed" },
        { label: "Quality Check", completed: status === "Completed" },
        { label: "Document Findings", completed: status === "Completed" },
        { label: "Approve/Reject", completed: status === "Completed" },
      ],
    };
    return baseSteps[type] || [];
  };

  // Check if this is the initial state (no search or filters applied)
  const isInitialState = searchTerm === "" && selectedTypes.size === 0 && selectedStatuses.size === 0 && selectedPriorities.size === 0 && timeRange === "" && !activeFilter;

  // Determine the page title based on the type parameter
  const typeParam = searchParams.get("type");
  const getPageTitle = () => {
    if (typeParam === "Pick") return "Pick Lists";
    if (typeParam === "Replenishment") return "Replenishment Lists";
    if (typeParam === "Cycle Count") return "Cycle Counts";
    if (typeParam === "Inspection") return "Inspection Lists";
    return "Work List";
  };

  // Log helper functions
  const getLevelIcon = (level: LogLevel) => {
    switch (level) {
      case "INFO":
        return <Info size={14} className="text-blue-500" />;
      case "WARNING":
        return <AlertTriangle size={14} className="text-yellow-500" />;
      case "ERROR":
        return <XCircle size={14} className="text-red-500" />;
      case "DEBUG":
        return <FileText size={14} className="text-zinc-500" />;
      case "FATAL":
        return <Skull size={14} className="text-red-500" />;
    }
  };

  const getLevelColor = (level: LogLevel) => {
    switch (level) {
      case "INFO":
        return "text-blue-500";
      case "WARNING":
        return "text-yellow-500";
      case "ERROR":
        return "text-red-500";
      case "DEBUG":
        return "text-zinc-500";
      case "FATAL":
        return "text-red-500";
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

  const toggleLogGroup = (service: string) => {
    const newExpanded = new Set(expandedLogGroups);
    if (newExpanded.has(service)) {
      newExpanded.delete(service);
    } else {
      newExpanded.add(service);
    }
    setExpandedLogGroups(newExpanded);
  };

  // Get logs for selected work list
  const workListLogs = selectedItem 
    ? allWorkListLogs.filter(log => log.workListId === selectedItem.workList)
    : [];

  // Filter and group work list logs
  const filteredWorkListLogs = workListLogs.filter(entry => {
    if (!logsSearchTerm.trim()) return true;
    const term = logsSearchTerm.toLowerCase();
    return (
      entry.message.toLowerCase().includes(term) ||
      entry.service.toLowerCase().includes(term) ||
      entry.id.toLowerCase().includes(term) ||
      (entry.endpoint && entry.endpoint.toLowerCase().includes(term))
    );
  });

  const groupedWorkListLogs = filteredWorkListLogs.reduce((acc, entry) => {
    if (!acc[entry.service]) {
      acc[entry.service] = [];
    }
    acc[entry.service].push(entry);
    return acc;
  }, {} as Record<string, LogEntry[]>);

  // Auto-expand log groups when logs tab is activated
  useEffect(() => {
    if (activeTab === "logs" && Object.keys(groupedWorkListLogs).length > 0) {
      setExpandedLogGroups(new Set(Object.keys(groupedWorkListLogs)));
    }
  }, [activeTab]);

  return (
    <div className={`p-8 transition-all duration-300 ${showDetailPanel ? 'mr-[900px]' : ''}`}>
      {/* Sticky Header Section */}
      <div className="sticky top-0 bg-white dark:bg-zinc-900 z-40 pb-4 -mx-8 px-8 -mt-8 pt-8">
        {/* Breadcrumb Navigation */}
        <div className="mb-4 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-500">
          <Link to="/app/home" className="hover:text-[#0d9488] dark:hover:text-[#50e080] transition-colors flex items-center gap-1">
            <Home size={14} />
            Home
          </Link>
          <ChevronRight size={14} />
          <Link to="/app/navigation" className="hover:text-[#0d9488] dark:hover:text-[#50e080] transition-colors">
            Navigation
          </Link>
          <ChevronRight size={14} />
          <Link to="/app/navigation?section=operations" className="hover:text-[#0d9488] dark:hover:text-[#50e080] transition-colors">
            Operations
          </Link>
          <ChevronRight size={14} />
          <Link to="/app/navigation?section=operations&subsection=work" className="hover:text-[#0d9488] dark:hover:text-[#50e080] transition-colors">
            Work
          </Link>
          <ChevronRight size={14} />
          <span className="text-zinc-900 dark:text-white font-medium">{getPageTitle()}</span>
        </div>

        {/* Header */}
        <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Work List</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button 
                onClick={() => setShowFilterPanel(!showFilterPanel)}
                onMouseEnter={() => setShowFilterTooltip(true)}
                onMouseLeave={() => setShowFilterTooltip(false)}
                className={`px-4 py-2 text-white rounded-lg transition-colors flex items-center gap-2 border ${
                  showFilterPanel || hasActiveFilters
                    ? "bg-[#0d9488] dark:bg-[#50e080] hover:bg-[#0b7a70] dark:hover:bg-[#3bc76a] border-[#0d9488] dark:border-[#50e080]"
                    : "bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white"
                }`}
              >
                <Filter size={18} />
                <span>Filter</span>
                {hasActiveFilters && (
                  <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded text-xs">
                    {totalFilterCount}
                  </span>
                )}
              </button>

              {/* Filter Tooltip */}
              {showFilterTooltip && hasActiveFilters && (
                <div className="absolute top-full left-0 mt-2 z-50 w-72 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-xl p-4 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">Active Filters</h4>
                      <span className="text-xs text-zinc-600 dark:text-zinc-400">
                        {totalFilterCount} applied
                      </span>
                    </div>

                    {selectedTypes.size > 0 && (
                      <div>
                        <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">Type</p>
                        <div className="flex flex-wrap gap-1.5">
                          {Array.from(selectedTypes).map((type) => (
                            <span
                              key={type}
                              className="inline-flex items-center px-2 py-1 bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-300 rounded text-xs"
                            >
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedStatuses.size > 0 && (
                      <div>
                        <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">Status</p>
                        <div className="flex flex-wrap gap-1.5">
                          {Array.from(selectedStatuses).map((status) => (
                            <span
                              key={status}
                              className="inline-flex items-center gap-1.5 px-2 py-1 bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-300 rounded text-xs"
                            >
                              {getStatusIcon(status)}
                              {status}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedPriorities.size > 0 && (
                      <div>
                        <p className="text-xs font-medium text-zinc-400 mb-1.5">Priority</p>
                        <div className="flex flex-wrap gap-1.5">
                          {Array.from(selectedPriorities).map((priority) => (
                            <span
                              key={priority}
                              className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(priority)}`}
                            >
                              {priority}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {timeRange && (
                      <div>
                        <p className="text-xs font-medium text-zinc-400 mb-1.5">Time Range</p>
                        <div className="flex flex-wrap gap-1.5">
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-zinc-700 text-zinc-300 rounded text-xs">
                            <Calendar size={12} />
                            {timeRange === 'custom' ? (
                              `${customStartDate || 'Start'} - ${customEndDate || 'End'}`
                            ) : (
                              timeRange
                            )}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <button className="px-4 py-2 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-lg transition-colors flex items-center gap-2 border border-zinc-300 dark:border-zinc-700">
              <Download size={18} />
              <span>Export</span>
            </button>
          </div>
        </div>
        </div>

        {/* Filter Panel */}
        {showFilterPanel && (
          <div className="mb-6 bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl p-6 animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-zinc-900 dark:text-white font-semibold">Filters</h3>
              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-zinc-400 hover:text-white transition-colors"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={() => setShowFilterPanel(false)}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Type Filter - Compact Multi-Select */}
              <div className="relative">
                <label className="text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-2 block">Type</label>
                <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2 min-h-[42px]">
                  {/* Selected Items as Chips */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {Array.from(selectedTypes).map((type) => (
                      <span
                        key={type}
                        className="inline-flex items-center gap-1.5 px-2 py-1 bg-[#0d9488] dark:bg-[#50e080] text-white rounded text-xs font-medium"
                      >
                        {type}
                        <button
                          onClick={() => toggleFilterOption('type', type)}
                          className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                  {/* Search and Dropdown */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search or select..."
                      value={typeSearch}
                      onChange={(e) => setTypeSearch(e.target.value)}
                      onFocus={() => setActiveDropdown('type')}
                      className="w-full bg-transparent text-zinc-900 dark:text-zinc-300 text-sm placeholder-zinc-500 outline-none"
                    />
                    {/* Dropdown Options */}
                    {activeDropdown === 'type' && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-xl max-h-48 overflow-y-auto z-10 filter-dropdown">
                        {['Pick', 'Replenishment', 'Cycle Count', 'Inspection'].filter(type => type.toLowerCase().includes(typeSearch.toLowerCase())).map((type) => (
                          <button
                            key={type}
                            onClick={() => {
                              toggleFilterOption('type', type);
                              setTypeSearch('');
                            }}
                            className={`w-full px-3 py-2 text-left text-sm transition-colors flex items-center gap-2 ${
                              selectedTypes.has(type)
                                ? 'bg-[#0d9488]/10 dark:bg-[#50e080]/10 text-[#0d9488] dark:text-[#50e080]'
                                : 'text-zinc-900 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                              selectedTypes.has(type)
                                ? 'bg-[#0d9488] dark:bg-[#50e080] border-[#0d9488] dark:border-[#50e080]'
                                : 'border-zinc-300 dark:border-zinc-600'
                            }`}>
                              {selectedTypes.has(type) && <CheckCircle2 size={12} className="text-white" />}
                            </div>
                            {type}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Filter - Compact Multi-Select */}
              <div className="relative">
                <label className="text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-2 block">Status</label>
                <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2 min-h-[42px]">
                  {/* Selected Items as Chips */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {Array.from(selectedStatuses).map((status) => (
                      <span
                        key={status}
                        className="inline-flex items-center gap-1.5 px-2 py-1 bg-[#0d9488] dark:bg-[#50e080] text-white rounded text-xs font-medium"
                      >
                        {getStatusIcon(status)}
                        {status}
                        <button
                          onClick={() => toggleFilterOption('status', status)}
                          className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                  {/* Search and Dropdown */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search or select..."
                      value={statusSearch}
                      onChange={(e) => setStatusSearch(e.target.value)}
                      onFocus={() => setActiveDropdown('status')}
                      className="w-full bg-transparent text-zinc-900 dark:text-zinc-300 text-sm placeholder-zinc-500 outline-none"
                    />
                    {/* Dropdown Options */}
                    {activeDropdown === 'status' && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-xl max-h-48 overflow-y-auto z-10 filter-dropdown">
                        {['Warning', 'Queued', 'In Progress', 'Completed', 'Shorted'].filter(status => status.toLowerCase().includes(statusSearch.toLowerCase())).map((status) => (
                          <button
                            key={status}
                            onClick={() => {
                              toggleFilterOption('status', status);
                              setStatusSearch('');
                            }}
                            className={`w-full px-3 py-2 text-left text-sm transition-colors flex items-center gap-2 ${
                              selectedStatuses.has(status)
                                ? 'bg-[#0d9488]/10 dark:bg-[#50e080]/10 text-[#0d9488] dark:text-[#50e080]'
                                : 'text-zinc-900 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                              selectedStatuses.has(status)
                                ? 'bg-[#0d9488] dark:bg-[#50e080] border-[#0d9488] dark:border-[#50e080]'
                                : 'border-zinc-300 dark:border-zinc-600'
                            }`}>
                              {selectedStatuses.has(status) && <CheckCircle2 size={12} className="text-white" />}
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(status)}
                              {status}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Priority Filter - Compact Multi-Select */}
              <div className="relative">
                <label className="text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-2 block">Priority</label>
                <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2 min-h-[42px]">
                  {/* Selected Items as Chips */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {Array.from(selectedPriorities).map((priority) => (
                      <span
                        key={priority}
                        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(priority)}`}
                      >
                        {priority}
                        <button
                          onClick={() => toggleFilterOption('priority', priority)}
                          className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                  {/* Search and Dropdown */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search or select..."
                      value={prioritySearch}
                      onChange={(e) => setPrioritySearch(e.target.value)}
                      onFocus={() => setActiveDropdown('priority')}
                      className="w-full bg-transparent text-zinc-900 dark:text-zinc-300 text-sm placeholder-zinc-500 outline-none"
                    />
                    {/* Dropdown Options */}
                    {activeDropdown === 'priority' && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-xl max-h-48 overflow-y-auto z-10 filter-dropdown">
                        {['Critical', 'High', 'Medium', 'Low'].filter(priority => priority.toLowerCase().includes(prioritySearch.toLowerCase())).map((priority) => (
                          <button
                            key={priority}
                            onClick={() => {
                              toggleFilterOption('priority', priority);
                              setPrioritySearch('');
                            }}
                            className={`w-full px-3 py-2 text-left text-sm transition-colors flex items-center gap-2 ${
                              selectedPriorities.has(priority)
                                ? 'bg-[#0d9488]/10 dark:bg-[#50e080]/10 text-[#0d9488] dark:text-[#50e080]'
                                : 'text-zinc-900 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                              selectedPriorities.has(priority)
                                ? 'bg-[#0d9488] dark:bg-[#50e080] border-[#0d9488] dark:border-[#50e080]'
                                : 'border-zinc-300 dark:border-zinc-600'
                            }`}>
                              {selectedPriorities.has(priority) && <CheckCircle2 size={12} className="text-white" />}
                            </div>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getPriorityColor(priority)}`}>
                              {priority}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Time Range Filter */}
            <div className="mt-4">
              <label className="text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-2 block">Time Range</label>
              <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2 min-h-[42px]">
                {/* Selected Time Range as Chip */}
                {timeRange && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-[#0d9488] dark:bg-[#50e080] text-white rounded text-xs font-medium">
                      <Calendar size={12} />
                      {timeRange === 'custom' ? (
                        `${customStartDate || 'Start'} - ${customEndDate || 'End'}`
                      ) : (
                        timeRange
                      )}
                      <button
                        onClick={() => {
                          setTimeRange("");
                          setShowCustomDateRange(false);
                          setCustomStartDate("");
                          setCustomEndDate("");
                        }}
                        className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  </div>
                )}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Select time range..."
                    value={timeRange ? "" : ""}
                    onChange={(e) => handleTimeRangeChange(e.target.value)}
                    onFocus={() => setActiveDropdown('time')}
                    className="w-full bg-transparent text-zinc-900 dark:text-zinc-300 text-sm placeholder-zinc-500 outline-none"
                    readOnly
                  />
                  {/* Dropdown Options */}
                  {activeDropdown === 'time' && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-xl max-h-48 overflow-y-auto z-10 filter-dropdown">
                      {['1h', '2h', '4h', '8h', '12h', '24h', 'today', 'custom'].map((range) => (
                        <button
                          key={range}
                          onClick={() => {
                            handleTimeRangeChange(range);
                            setActiveDropdown(null);
                          }}
                          className={`w-full px-3 py-2 text-left text-sm transition-colors flex items-center gap-2 ${
                            timeRange === range
                              ? 'bg-[#0d9488]/10 dark:bg-[#50e080]/10 text-[#0d9488] dark:text-[#50e080]'
                              : 'text-zinc-900 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                            timeRange === range
                              ? 'bg-[#0d9488] dark:bg-[#50e080] border-[#0d9488] dark:border-[#50e080]'
                              : 'border-zinc-300 dark:border-zinc-600'
                          }`}>
                            {timeRange === range && <CheckCircle2 size={12} className="text-white" />}
                          </div>
                          {range === 'custom' ? (
                            <div className="flex items-center gap-2">
                              <Calendar size={12} />
                              <span>Custom</span>
                            </div>
                          ) : (
                            range
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {showCustomDateRange && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        value={customStartDate}
                        onChange={(e) => setCustomStartDate(e.target.value)}
                        className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-zinc-300 placeholder-zinc-500 outline-none"
                      />
                      <span className="text-zinc-600 dark:text-zinc-400">to</span>
                      <input
                        type="date"
                        value={customEndDate}
                        onChange={(e) => setCustomEndDate(e.target.value)}
                        className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-zinc-300 placeholder-zinc-500 outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Save Filters Button */}
            {hasActiveFilters && !hasSavedFilters && (
              <button
                onClick={saveFilters}
                className="mt-4 px-4 py-2 bg-[#50e080] hover:bg-[#3bc76a] text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Save size={18} />
                <span>Save Filters</span>
              </button>
            )}

            {/* Save Confirmation */}
            {showSaveConfirmation && (
              <div className="mt-4 px-4 py-2 bg-[#50e080] hover:bg-[#3bc76a] text-white rounded-lg transition-colors flex items-center gap-2">
                <CheckCircle2 size={18} />
                <span>Filters Saved!</span>
              </div>
            )}
          </div>
        )}
        </div>

        {/* Stats Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-3 mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const isActive = activeFilter === stat.filterKey;
            return (
              <div
                key={index}
                onClick={() => handleTileClick(stat.filterKey)}
                className={`bg-white dark:bg-zinc-900 border-2 rounded-lg p-3 transition-all cursor-pointer ${
                  isActive
                    ? "border-[#0d9488] dark:border-[#50e080] ring-2 ring-[#0d9488]/20 dark:ring-[#50e080]/20"
                    : "border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon size={16} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-zinc-600 dark:text-zinc-400 text-xs">{stat.label}</p>
                    <p className="text-xl font-bold text-zinc-900 dark:text-white">{stat.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 relative">
            <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 rounded-lg px-4 py-3 border-2 border-zinc-300 dark:border-zinc-700 focus-within:border-[#0d9488] dark:focus-within:border-[#50e080] transition-colors">
              {isAiCommand ? (
                <Sparkles size={20} className="text-[#50e080]" />
              ) : (
                <Search size={20} className="text-zinc-500" />
              )}
              <input
                type="text"
                placeholder="Search work items or ask OPTO (e.g., 'show processing items')..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="flex-1 bg-transparent text-zinc-900 dark:text-white placeholder-zinc-500 outline-none"
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setIsAiCommand(false);
                    setAiSuggestions([]);
                  }}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            
            {/* AI Suggestions Dropdown */}
            {aiSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-xl z-50 overflow-hidden">
                <div className="p-2 border-b border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900">
                  <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                    <Sparkles size={14} className="text-[#0d9488] dark:text-[#50e080]" />
                    <span>OPTO Suggestions</span>
                  </div>
                </div>
                {aiSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-4 py-3 text-left text-sm text-zinc-900 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors flex items-center gap-2"
                  >
                    <Sparkles size={14} className="text-[#0d9488] dark:text-[#50e080]" />
                    <span>{suggestion}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          {(activeFilter || hasActiveFilters) && (
            <button
              onClick={() => {
                setActiveFilter(null);
                clearAllFilters();
              }}
              className="px-4 py-2 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-lg transition-colors flex items-center gap-2 border border-zinc-300 dark:border-zinc-700"
            >
              <X size={18} />
              <span>Clear Filters</span>
            </button>
          )}
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            {filteredData.length} items
          </div>
        </div>

      {/* Data Grid */}
      <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl overflow-hidden">
        {isInitialState ? (
          /* OPTO Initial State Prompt */
          <div className="py-24 text-center">
            <div className="flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-[#0d9488] dark:bg-[#50e080] rounded-full flex items-center justify-center mb-6 shadow-lg shadow-[#0d9488]/50 dark:shadow-[#50e080]/50">
                <Sparkles size={36} className="text-white" />
              </div>
              <h3 className="text-zinc-900 dark:text-white text-2xl font-bold mb-3">Hi, I'm OPTO!</h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-lg mb-8 max-w-md">
                What are you looking for today? Use the search bar or filters above to find your work items.
              </p>
              
              {/* Quick Suggestions */}
              <div className="flex flex-wrap gap-3 mb-10 justify-center">
                <button
                  onClick={handleShowAll}
                  className="px-5 py-2.5 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-lg transition-all border border-zinc-300 dark:border-zinc-700 hover:border-[#0d9488] dark:hover:border-[#50e080] flex items-center gap-2 group"
                >
                  <ListChecks size={18} className="text-zinc-600 dark:text-zinc-400 group-hover:text-[#0d9488] dark:group-hover:text-[#50e080] transition-colors" />
                  <span>Show All</span>
                </button>
                <button
                  onClick={handleShowProcessing}
                  className="px-5 py-2.5 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-lg transition-all border border-zinc-300 dark:border-zinc-700 hover:border-[#0d9488] dark:hover:border-[#50e080] flex items-center gap-2 group"
                >
                  <Loader2 size={18} className="text-zinc-600 dark:text-zinc-400 group-hover:text-[#0d9488] dark:group-hover:text-[#50e080] transition-colors" />
                  <span>Show Processing Work Lists</span>
                </button>
                <button
                  onClick={handleShowToday}
                  className="px-5 py-2.5 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-lg transition-all border border-zinc-300 dark:border-zinc-700 hover:border-[#0d9488] dark:hover:border-[#50e080] flex items-center gap-2 group"
                >
                  <Calendar size={18} className="text-zinc-400 group-hover:text-[#50e080] transition-colors" />
                  <span>Show Today</span>
                </button>
              </div>

              <div className="flex flex-col gap-3 text-left">
                <div className="flex items-start gap-3 text-zinc-300">
                  <div className="w-6 h-6 bg-zinc-800 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles size={14} className="text-[#50e080]" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Ask me anything</p>
                    <p className="text-sm text-zinc-400">Try "show processing items" or "show high priority work"</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-zinc-300">
                  <div className="w-6 h-6 bg-zinc-800 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Search size={14} className="text-[#50e080]" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Search for records</p>
                    <p className="text-sm text-zinc-400">Type any keyword to find specific work items</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-zinc-300">
                  <div className="w-6 h-6 bg-zinc-800 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Filter size={14} className="text-[#50e080]" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Use filters or tiles</p>
                    <p className="text-sm text-zinc-400">Click stat tiles or use the Filter button for advanced options</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-max">
            <thead className="bg-zinc-800/50 border-b border-zinc-800">
              <tr>
                {orderedColumns.map((columnKey) => {
                  const isPinned = workListPinnedColumns.includes(columnKey);
                  const pinnedStyle = isPinned ? getPinnedColumnStyle(columnKey) : {};
                  const baseClass = "px-6 py-4 text-left text-sm font-semibold text-zinc-300 cursor-pointer hover:text-white transition-colors";
                  const stickyClass = isPinned ? "bg-zinc-800/50 border-r-2 border-zinc-700" : "";
                  
                  return (
                    <th
                      key={columnKey}
                      className={`${baseClass} ${stickyClass}`}
                      style={pinnedStyle}
                      onClick={() => handleSort(columnKey as SortField)}
                    >
                      <div className="flex items-center gap-2">
                        {columnDisplayNames[columnKey]}
                        <SortIcon field={columnKey as SortField} />
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {paginatedData.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => handleRowClick(item)}
                  className="hover:bg-zinc-800/50 transition-colors cursor-pointer"
                >
                  {orderedColumns.map((columnKey) => {
                    const isPinned = workListPinnedColumns.includes(columnKey);
                    const pinnedStyle = isPinned ? getPinnedColumnStyle(columnKey) : {};
                    const baseClass = "px-6 py-4";
                    const stickyClass = isPinned ? "bg-zinc-900 hover:bg-zinc-900 border-r-2 border-zinc-700" : "";
                    
                    return (
                      <td
                        key={columnKey}
                        className={`${baseClass} ${stickyClass}`}
                        style={pinnedStyle}
                      >
                        {renderCellContent(item, columnKey)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
            </div>

            {/* Empty State */}
            {totalItems === 0 && (
              <div className="py-12 text-center">
                <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={24} className="text-zinc-500" />
                </div>
                <h3 className="text-white text-lg font-medium mb-2">No items found</h3>
                <p className="text-zinc-400 text-sm">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Pagination */}
      {totalItems > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} items
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg transition-colors text-sm border ${
                currentPage === 1
                  ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed border-zinc-300 dark:border-zinc-700'
                  : 'bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white border-zinc-300 dark:border-zinc-700'
              }`}
            >
              Previous
            </button>
            
            {getPageNumbers().map((page, index) => {
              if (page === '...') {
                return (
                  <span key={`ellipsis-${index}`} className="px-3 text-zinc-600 dark:text-zinc-400">
                    ...
                  </span>
                );
              }
              
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page as number)}
                  className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                    currentPage === page
                      ? 'bg-[#0d9488] dark:bg-[#50e080] text-white'
                      : 'bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-700'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            
            <button 
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg transition-colors text-sm border ${
                currentPage === totalPages
                  ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed border-zinc-300 dark:border-zinc-700'
                  : 'bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white border-zinc-300 dark:border-zinc-700'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Detail Panel */}
      {showDetailPanel && selectedItem && (
        <>
          {/* Slide-out Panel */}
          <div className="fixed right-0 top-0 h-full w-[900px] bg-white dark:bg-zinc-900 border-l border-[#0d9488] dark:border-[#50e080] shadow-2xl z-50 animate-in slide-in-from-right duration-300 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
              <div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{selectedItem.workList}</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Work Item Details</p>
              </div>
              <button
                onClick={() => {
                  if (hasPendingChanges()) {
                    setShowDiscardChangesDialog(true);
                  } else {
                    setShowDetailPanel(false);
                  }
                }}
                className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-zinc-800 px-6">
              <button
                onClick={() => setActiveTab("details")}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "details"
                    ? "border-[#50e080] text-white"
                    : "border-transparent text-zinc-400 hover:text-white"
                }`}
              >
                Details
              </button>
              <button
                onClick={() => setActiveTab("worklist")}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "worklist"
                    ? "border-[#50e080] text-white"
                    : "border-transparent text-zinc-400 hover:text-white"
                }`}
              >
                Work List
              </button>
              <button
                onClick={() => setActiveTab("logs")}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === "logs"
                    ? "border-[#50e080] text-white"
                    : "border-transparent text-zinc-400 hover:text-white"
                }`}
              >
                <FileCode size={16} />
                Logs
                {workListLogs.length > 0 && (
                  <span className="px-1.5 py-0.5 bg-[#0d9488] dark:bg-[#50e080] text-white text-xs rounded">
                    {workListLogs.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => {
                  setActiveTab("actions");
                  setActiveAction(null);
                  setSelectedWorkstation("");
                  setSelectedSortbar("");
                }}
                className={`ml-auto px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === "actions"
                    ? "border-orange-500 text-white bg-orange-500/10"
                    : "border-transparent text-orange-400 hover:text-orange-300 hover:bg-orange-500/5"
                }`}
              >
                <Zap size={16} />
                Actions
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === "actions" ? (
                <div className="max-w-2xl mx-auto space-y-6">
                  {/* Back Arrow - shown when an action is selected */}
                  {activeAction && (
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
                      className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group"
                    >
                      <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                      <span className="text-sm font-medium">Back to Actions</span>
                    </button>
                  )}

                  {/* Action Selection Header */}
                  {!activeAction && (
                    <div className="text-center py-2">
                      <p className="text-sm text-zinc-400">Select an action to perform</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {!showApplyChangesConfirmation && (
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setActiveAction("assign")}
                        className={`relative p-4 rounded-lg border-2 text-left transition-all ${
                          activeAction === "assign"
                            ? "border-[#50e080] bg-[#50e080]/10"
                            : "border-zinc-700 bg-zinc-800/30 hover:border-zinc-600 hover:bg-zinc-800/50"
                        }`}
                      >
                        {pendingAssignment && (
                          <div className="absolute top-2 right-2 w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
                        )}
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            activeAction === "assign" ? "bg-[#50e080]" : "bg-zinc-700"
                          }`}>
                            <Monitor size={16} className="text-white" />
                          </div>
                          <h5 className="text-base font-semibold text-white">Assign</h5>
                        </div>
                        <p className="text-xs text-zinc-400">Assign workstation</p>
                        {pendingAssignment && (
                          <p className="text-xs text-orange-400 mt-1">Changes pending</p>
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
                            : "border-zinc-700 bg-zinc-800/30 hover:border-zinc-600 hover:bg-zinc-800/50"
                        }`}
                      >
                        {pendingCancellation && (
                          <div className="absolute top-2 right-2 w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
                        )}
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            activeAction === "cancel" ? "bg-red-500" : "bg-zinc-700"
                          }`}>
                            <XCircle size={16} className="text-white" />
                          </div>
                          <h5 className="text-base font-semibold text-white">Cancel</h5>
                        </div>
                        <p className="text-xs text-zinc-400">Cancel this work list</p>
                        {pendingCancellation && (
                          <p className="text-xs text-orange-400 mt-1">Changes pending</p>
                        )}
                      </button>
                    </div>
                  )}

                  {showApplyChangesConfirmation ? (
                    /* Apply Changes Confirmation Dialog */
                    <div className="bg-zinc-800/50 border border-zinc-800 rounded-lg p-6 space-y-4">
                      {!applyComplete ? (
                        <>
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                              <AlertCircle size={24} className="text-orange-400" />
                            </div>
                            <div>
                              <h5 className="text-lg font-semibold text-white">Confirm Changes</h5>
                              <p className="text-sm text-zinc-400">Please review the changes that will be applied</p>
                            </div>
                          </div>

                          {/* Changes Summary */}
                          <div className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-4 space-y-4">
                            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                              <span className="text-sm text-zinc-400">Work List:</span>
                              <span className="text-sm font-medium text-white">{selectedItem.workList}</span>
                            </div>
                            
                            {pendingAssignment && (
                              <div className="space-y-2">
                                <h6 className="text-sm font-semibold text-white flex items-center gap-2">
                                  <Monitor size={16} className="text-[#50e080]" />
                                  Workstation Assignment
                                </h6>
                                <div className="pl-6 space-y-2 text-sm">
                                  <div className="flex items-center justify-between">
                                    <span className="text-zinc-400">Workstation:</span>
                                    <span className="text-white">
                                      {mockWorkstations.find(ws => ws.id === pendingAssignment.workstation)?.name}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-zinc-400">Sortbar:</span>
                                    <span className="text-white">{pendingAssignment.sortbar.split('/')[1]}</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-zinc-400">Container:</span>
                                    <span className="text-white">
                                      {mockSortbars.find(sb => `${sb.workstationId}/${sb.id}` === pendingAssignment.sortbar)?.container}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {pendingCancellation && (
                              <div className="space-y-2">
                                <h6 className="text-sm font-semibold text-white flex items-center gap-2">
                                  <XCircle size={16} className="text-red-400" />
                                  Work List Cancellation
                                </h6>
                                <div className="pl-6 space-y-2 text-sm">
                                  <div className="flex items-center justify-between">
                                    <span className="text-zinc-400">Reason:</span>
                                    <span className="text-white">{pendingCancellation.reason || "(No reason provided)"}</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Confirmation Buttons */}
                          <div className="flex items-center gap-3 pt-4">
                            <button
                              onClick={handleConfirmApplyChanges}
                              className="flex-1 px-6 py-3 bg-[#50e080] hover:bg-[#3bc76a] text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                            >
                              <Check size={18} />
                              Apply Changes
                            </button>
                            <button
                              onClick={handleCancelApplyChanges}
                              className="px-6 py-3 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg font-medium transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </>
                      ) : (
                        /* Success Message */
                        <div className="text-center py-8">
                          <div className="w-16 h-16 bg-[#50e080] rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 size={32} className="text-white" />
                          </div>
                          <h5 className="text-xl font-semibold text-white mb-2">Changes Applied!</h5>
                          <p className="text-sm text-zinc-400">
                            Your changes have been successfully applied to {selectedItem.workList}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      {/* Assign Workstation Section */}
                      {activeAction === "assign" && (
                      <div className="bg-zinc-800/50 border border-zinc-800 rounded-lg p-6 space-y-4">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-[#50e080]/20 rounded-lg flex items-center justify-center">
                            <Monitor size={20} className="text-[#50e080]" />
                          </div>
                          <div>
                            <h5 className="text-lg font-semibold text-white">Assign Workstation</h5>
                            <p className="text-sm text-zinc-400">Select a workstation to assign this work list</p>
                          </div>
                        </div>

                        {/* Current Work Item Info */}
                        <div className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-4">
                          <h6 className="text-xs font-semibold text-zinc-400 mb-2">SELECTED WORK ITEM</h6>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-zinc-400">Work List:</span>
                              <span className="text-sm font-medium text-white">{selectedItem.workList}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-zinc-400">Type:</span>
                              <span className="text-sm font-medium text-white">{selectedItem.type}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-zinc-400">Priority:</span>
                              <span className={`text-sm font-medium px-2 py-0.5 rounded ${getPriorityColor(selectedItem.priority)}`}>
                                {selectedItem.priority}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Workstation Selection */}
                        <div>
                          <label className="block text-sm font-medium text-white mb-3">
                            Select Sortbar <span className="text-red-400">*</span>
                          </label>
                          <div className="space-y-2">
                            {mockWorkstations
                              .filter(ws => ws.type === selectedItem.type)
                              .map((workstation) => {
                                const isExpanded = expandedWorkstations.has(workstation.id);
                                const sortbars = mockSortbars.filter(sb => sb.workstationId === workstation.id);
                                
                                return (
                                  <div key={workstation.id} className="bg-zinc-800/30 border border-zinc-700 rounded-lg overflow-hidden">
                                    {/* Workstation Row */}
                                    <div 
                                      className="p-4 cursor-pointer hover:bg-zinc-800/50 transition-colors"
                                      onClick={() => toggleWorkstation(workstation.id)}
                                    >
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                          {isExpanded ? (
                                            <ChevronDown size={20} className="text-zinc-400" />
                                          ) : (
                                            <ChevronUp size={20} className="text-zinc-400" />
                                          )}
                                          <div className="w-10 h-10 bg-zinc-700 rounded-lg flex items-center justify-center">
                                            <Monitor size={20} className="text-white" />
                                          </div>
                                          <div>
                                            <h6 className="text-sm font-semibold text-white">{workstation.name}</h6>
                                            <p className="text-xs text-zinc-400">{workstation.zone} • {workstation.type}</p>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span className={`text-xs px-2 py-1 rounded ${
                                            workstation.status === "Available"
                                              ? "bg-green-500/20 text-green-400"
                                              : workstation.status === "In Use"
                                              ? "bg-yellow-500/20 text-yellow-400"
                                              : "bg-red-500/20 text-red-400"
                                          }`}>
                                            {workstation.status}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Sortbars (Expanded) */}
                                    {isExpanded && sortbars.length > 0 && (
                                      <div className="bg-zinc-900/50 border-t border-zinc-700 p-4">
                                        <div className="mb-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Sortbars</div>
                                        <div className="space-y-2">
                                          {sortbars.map((sortbar) => {
                                            const isSelected = selectedSortbar === `${workstation.id}/${sortbar.id}`;
                                            return (
                                              <button
                                                key={sortbar.id}
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setSelectedSortbar(`${workstation.id}/${sortbar.id}`);
                                                  setSelectedWorkstation(workstation.id);
                                                  setPendingAssignment({
                                                    workstation: workstation.id,
                                                    sortbar: `${workstation.id}/${sortbar.id}`
                                                  });
                                                }}
                                                className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                                                  isSelected
                                                    ? "border-[#50e080] bg-[#50e080]/10"
                                                    : "border-zinc-700 bg-zinc-800/50 hover:border-zinc-600 hover:bg-zinc-800/70"
                                                }`}
                                              >
                                                <div className="flex items-center justify-between">
                                                  <div className="grid grid-cols-4 gap-3 flex-1 text-sm">
                                                    <div>
                                                      <span className="text-zinc-500 text-xs block">Sortbar ID</span>
                                                      <span className="text-white font-medium">{sortbar.id}</span>
                                                    </div>
                                                    <div>
                                                      <span className="text-zinc-500 text-xs block">Status</span>
                                                      <span className={`text-xs px-2 py-0.5 rounded inline-block ${
                                                        sortbar.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-zinc-500/20 text-zinc-400'
                                                      }`}>
                                                        {sortbar.status}
                                                      </span>
                                                    </div>
                                                    <div>
                                                      <span className="text-zinc-500 text-xs block">Container</span>
                                                      <span className="text-white">{sortbar.container}</span>
                                                    </div>
                                                    <div>
                                                      <span className="text-zinc-500 text-xs block">Trailer Type</span>
                                                      <span className="text-white">{sortbar.trailerType}</span>
                                                    </div>
                                                  </div>
                                                  {isSelected && (
                                                    <div className="w-6 h-6 bg-[#50e080] rounded-full flex items-center justify-center ml-3">
                                                      <Check size={14} className="text-white" />
                                                    </div>
                                                  )}
                                                </div>
                                              </button>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                          </div>
                        </div>

                      </div>
                      )}

                      {/* Cancel Work List Section */}
                      {activeAction === "cancel" && (
                      <div className="space-y-4">
                        {!cancelConfirmed ? (
                          /* Cancel Confirmation Tile */
                          <button
                            onClick={() => {
                              setCancelConfirmed(true);
                              setPendingCancellation({
                                reason: cancelReason
                              });
                            }}
                            className="w-full bg-zinc-800/50 border-2 border-red-500/20 hover:border-red-500/40 rounded-lg p-6 text-left transition-all group"
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-10 h-10 bg-red-500/20 group-hover:bg-red-500/30 rounded-lg flex items-center justify-center transition-colors">
                                <XCircle size={20} className="text-red-400" />
                              </div>
                              <div>
                                <h5 className="text-lg font-semibold text-white">Cancel Work List</h5>
                                <p className="text-sm text-zinc-400">Click to cancel this work list</p>
                              </div>
                            </div>

                            {/* Current Work Item Info */}
                            <div className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-4 mt-4">
                              <h6 className="text-xs font-semibold text-zinc-400 mb-2">WORK ITEM TO CANCEL</h6>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-zinc-400">Work List:</span>
                                  <span className="text-sm font-medium text-white">{selectedItem.workList}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-zinc-400">Type:</span>
                                  <span className="text-sm font-medium text-white">{selectedItem.type}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-zinc-400">Status:</span>
                                  <span className="text-sm font-medium text-white">{selectedItem.status}</span>
                                </div>
                              </div>
                            </div>
                          </button>
                        ) : (
                          /* Cancellation Form */
                          <div className="bg-zinc-800/50 border border-red-500/20 rounded-lg p-6 space-y-4">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                                <XCircle size={20} className="text-red-400" />
                              </div>
                              <div>
                                <h5 className="text-lg font-semibold text-white">Cancel Work List</h5>
                                <p className="text-sm text-zinc-400">Cancelling {selectedItem.workList}</p>
                              </div>
                            </div>

                            {/* Cancellation Reason */}
                            <div>
                              <label className="block text-sm font-medium text-white mb-2">
                                Reason for Cancellation (Optional)
                              </label>
                              <textarea
                                value={cancelReason}
                                onChange={(e) => {
                                  setCancelReason(e.target.value);
                                  setPendingCancellation({
                                    reason: e.target.value
                                  });
                                }}
                                placeholder="Enter reason for cancellation..."
                                rows={3}
                                className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all resize-none"
                              />
                            </div>

                            {/* Warning Message */}
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                              <p className="text-sm text-red-400">
                                <strong>Warning:</strong> Cancelling this work list will stop all associated operations and cannot be undone.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                      )}
                    </>
                  )}

                  {/* Apply Changes Button - Fixed at bottom */}
                  {!showApplyChangesConfirmation && hasPendingChanges() && (
                    <div className="sticky bottom-0 bg-gradient-to-br from-[#50e080]/10 to-[#3bc76a]/10 border border-[#50e080]/20 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-white">You have pending changes</p>
                          <p className="text-xs text-zinc-400 mt-0.5">
                            {pendingAssignment && pendingCancellation ? "Assignment & Cancellation" : 
                             pendingAssignment ? "Workstation Assignment" : "Work List Cancellation"}
                          </p>
                        </div>
                        <button
                          onClick={handleApplyChanges}
                          className="px-6 py-3 bg-[#50e080] hover:bg-[#3bc76a] text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                          <Check size={18} />
                          Apply Changes
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : activeTab === "details" ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Details Section */}
                  <div>
                  <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <ListChecks size={16} className="text-[#50e080]" />
                    Details
                  </h4>
                  <div className="bg-zinc-800/50 border border-zinc-800 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <tbody className="divide-y divide-zinc-800">
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-zinc-400">ID</td>
                          <td className="px-4 py-3 text-sm text-white">{selectedItem.id}</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-zinc-400">Work List</td>
                          <td className="px-4 py-3 text-sm text-white">{selectedItem.workList}</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-zinc-400">Type</td>
                          <td className="px-4 py-3 text-sm text-white">{selectedItem.type}</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-zinc-400">Status</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(selectedItem.status)}
                              <span className="text-sm text-white">{selectedItem.status}</span>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-zinc-400">Priority</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${getPriorityColor(selectedItem.priority)}`}>
                              {selectedItem.priority}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-zinc-400">Priority Date Time</td>
                          <td className="px-4 py-3 text-sm text-white">{selectedItem.priorityDateTime}</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-zinc-400">Hot Item</td>
                          <td className="px-4 py-3">
                            {selectedItem.isHot ? (
                              <div className="flex items-center gap-1.5">
                                <Flame size={16} className="text-orange-500" />
                                <span className="text-orange-500 text-sm font-medium">Yes</span>
                              </div>
                            ) : (
                              <span className="text-zinc-500 text-sm">No</span>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-zinc-400">Attribute 1</td>
                          <td className="px-4 py-3 text-sm text-white">{selectedItem.attribute1}</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-zinc-400">Attribute 2</td>
                          <td className="px-4 py-3 text-sm text-white">{selectedItem.attribute2}</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-zinc-400">Attribute 3</td>
                          <td className="px-4 py-3 text-sm text-white">{selectedItem.attribute3}</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-zinc-400">Attribute 4</td>
                          <td className="px-4 py-3 text-sm text-white">{selectedItem.attribute4}</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-zinc-400">Attribute 5</td>
                          <td className="px-4 py-3 text-sm text-white">{selectedItem.attribute5}</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-zinc-400">Sub Type</td>
                          <td className="px-4 py-3 text-sm text-white">{selectedItem.subType}</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-zinc-400">Started</td>
                          <td className="px-4 py-3 text-sm text-white">{selectedItem.started}</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-zinc-400">Storage</td>
                          <td className="px-4 py-3 text-sm text-white font-mono">{selectedItem.storage}</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-zinc-400">Destination</td>
                          <td className="px-4 py-3 text-sm text-white">{selectedItem.destination}</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-zinc-400">Created</td>
                          <td className="px-4 py-3 text-sm text-white">{selectedItem.created}</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-zinc-400">Modified</td>
                          <td className="px-4 py-3 text-sm text-white">{selectedItem.modified}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Work List Journey Section */}
                <div>
                  <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <TrendingUp size={16} className="text-[#50e080]" />
                    Work List Journey
                  </h4>
                  <div className="space-y-3">
                    {getJourneySteps(selectedItem.type, selectedItem.status).map((step, index) => (
                      <div
                        key={index}
                        className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                          step.completed
                            ? 'bg-[#50e080]/10 border-[#50e080]/20'
                            : 'bg-zinc-800/30 border-zinc-800 opacity-50'
                        }`}
                      >
                        <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                          step.completed
                            ? 'bg-[#50e080] border-[#50e080]'
                            : 'bg-transparent border-zinc-700'
                        }`}>
                          {step.completed ? (
                            <CheckCircle2 size={14} className="text-white" />
                          ) : (
                            <Circle size={10} className="text-zinc-700" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${
                            step.completed ? 'text-white' : 'text-zinc-500'
                          }`}>
                            {step.label}
                          </p>
                          {step.completed && (
                            <p className="text-xs text-[#50e080] mt-1">Completed</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              ) : activeTab === "logs" ? (
                <div className="space-y-4">
                  {/* Matching Field Indicator */}
                  {selectedItem && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <div className="flex items-center gap-2 text-sm">
                        <FileCode size={14} className="text-blue-600 dark:text-blue-400" />
                        <span className="text-blue-900 dark:text-blue-100">
                          Showing log entries for{" "}
                          <span className="font-semibold">Work List ID: {selectedItem.workList}</span>
                        </span>
                      </div>
                    </div>
                  )}

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
                  {filteredWorkListLogs.length === 0 ? (
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
                      {Object.entries(groupedWorkListLogs).map(([service, entries]) => (
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
                                        {formatTimestamp(entry.timestamp)}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Message */}
                                  <p className="text-sm text-zinc-900 dark:text-white mb-3 pl-6">
                                    {entry.message}
                                  </p>

                                  {/* Metadata Grid */}
                                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs pl-6">
                                    {entry.workListId && (
                                      <div className="flex items-center gap-2">
                                        <span className="text-zinc-500 dark:text-zinc-500">Work List ID:</span>
                                        <span className="text-zinc-900 dark:text-white font-mono">{entry.workListId}</span>
                                      </div>
                                    )}
                                    {entry.ipAddress && (
                                      <div className="flex items-center gap-2">
                                        <span className="text-zinc-500 dark:text-zinc-500">IP Address:</span>
                                        <span className="text-zinc-900 dark:text-white font-mono">{entry.ipAddress}</span>
                                      </div>
                                    )}
                                    {entry.duration && (
                                      <div className="flex items-center gap-2">
                                        <span className="text-zinc-500 dark:text-zinc-500">Duration:</span>
                                        <span className="text-zinc-900 dark:text-white font-mono">{entry.duration}</span>
                                      </div>
                                    )}
                                    {entry.hostAdapterType && (
                                      <div className="flex items-center gap-2">
                                        <span className="text-zinc-500 dark:text-zinc-500">Type:</span>
                                        <span className="text-zinc-900 dark:text-white">{entry.hostAdapterType}</span>
                                      </div>
                                    )}
                                    {entry.hostAdapterStatus && (
                                      <div className="flex items-center gap-2">
                                        <span className="text-zinc-500 dark:text-zinc-500">Status:</span>
                                        <span className={`font-medium ${
                                          entry.hostAdapterStatus === "Accepted" 
                                            ? "text-green-600 dark:text-green-400" 
                                            : "text-red-600 dark:text-red-400"
                                        }`}>
                                          {entry.hostAdapterStatus}
                                        </span>
                                      </div>
                                    )}
                                    <div className="flex items-center gap-2 col-span-2">
                                      <span className="text-zinc-500 dark:text-zinc-500">Timestamp:</span>
                                      <span className="text-zinc-900 dark:text-white font-mono text-xs">
                                        {new Date(entry.timestamp).toLocaleString()}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Work Lines Section */}
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                      <ListChecks size={16} className="text-[#50e080]" />
                      Work Lines
                    </h4>
                    <div className="bg-zinc-800/50 border border-zinc-800 rounded-lg overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-zinc-800/70">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-300 sticky left-0 z-10 bg-zinc-800/70">Work Line</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-300">Priority</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-300">Item</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-300">Quantity</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-300">Status</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-300">Started</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-300">Comment</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-800">
                            {mockWorkLines
                              .filter(wl => wl.workListId === selectedItem.id)
                              .map((workLine) => (
                                <tr
                                  key={workLine.id}
                                  onClick={() => setSelectedWorkLine(workLine.workLine)}
                                  className={`cursor-pointer transition-colors ${
                                    selectedWorkLine === workLine.workLine
                                      ? 'bg-[#50e080]/10 hover:bg-[#50e080]/15'
                                      : 'hover:bg-zinc-800/50'
                                  }`}
                                >
                                  <td className="px-4 py-3 text-sm text-white font-medium sticky left-0 z-10 bg-zinc-900">{workLine.workLine}</td>
                                  <td className="px-4 py-3">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getPriorityColor(workLine.priority)}`}>
                                      {workLine.priority}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-sm text-zinc-300">{workLine.item}</td>
                                  <td className="px-4 py-3 text-sm text-zinc-300">{workLine.quantity}</td>
                                  <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                      {getStatusIcon(workLine.status)}
                                      <span className="text-sm text-zinc-300">{workLine.status}</span>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 text-sm text-zinc-400">{workLine.started || "-"}</td>
                                  <td className="px-4 py-3 text-sm text-zinc-400">{workLine.comment || "-"}</td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Work Operations Section */}
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                      <TrendingUp size={16} className="text-[#50e080]" />
                      Work Operations
                      {selectedWorkLine && (
                        <span className="text-xs text-zinc-400 font-normal">
                          ({selectedWorkLine})
                        </span>
                      )}
                    </h4>
                    {selectedWorkLine ? (
                      <div className="bg-zinc-800/50 border border-zinc-800 rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-zinc-800/70">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-300 sticky left-0 z-10 bg-zinc-800/70">Work Operation</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-300">Type</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-300">Destination Location</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-300">Source Location</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-300">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-300">Started</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-300">Comment</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800">
                              {mockWorkOperations
                                .filter(wo => wo.workLineId === selectedWorkLine)
                                .map((operation) => (
                                  <tr
                                    key={operation.id}
                                    className="hover:bg-zinc-800/50 transition-colors"
                                  >
                                    <td className="px-4 py-3 text-sm text-white font-medium sticky left-0 z-10 bg-zinc-900">{operation.workOperation}</td>
                                    <td className="px-4 py-3 text-sm text-zinc-300">{operation.type}</td>
                                    <td className="px-4 py-3 text-sm text-zinc-300">{operation.destinationLocation}</td>
                                    <td className="px-4 py-3 text-sm text-zinc-300">{operation.sourceLocation}</td>
                                    <td className="px-4 py-3">
                                      <div className="flex items-center gap-2">
                                        {getStatusIcon(operation.status)}
                                        <span className="text-sm text-zinc-300">{operation.status}</span>
                                      </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-zinc-400">{operation.started || "-"}</td>
                                    <td className="px-4 py-3 text-sm text-zinc-400">{operation.comment || "-"}</td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-zinc-800/30 border border-zinc-800 rounded-lg p-8 text-center">
                        <ListChecks size={32} className="text-zinc-600 mx-auto mb-3" />
                        <p className="text-sm text-zinc-400">Select a Work Line to view its operations</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Discard Changes Dialog */}
      {showDiscardChangesDialog && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center">
          <div className="bg-zinc-900 p-6 rounded-lg shadow-2xl w-96 border border-zinc-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <AlertCircle size={20} className="text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Unsaved Changes</h3>
            </div>
            <p className="text-sm text-zinc-400 mb-6">
              You have pending changes that haven't been applied. What would you like to do?
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleApplyChanges}
                className="w-full px-4 py-3 bg-[#50e080] hover:bg-[#3bc76a] text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Check size={18} />
                Apply Changes
              </button>
              <button
                onClick={handleDiscardChanges}
                className="w-full px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <XCircle size={18} />
                Discard Changes
              </button>
              <button
                onClick={handleKeepChanges}
                className="w-full px-4 py-3 bg-zinc-700 hover:bg-zinc-600 text-white font-medium rounded-lg transition-colors"
              >
                Keep Editing
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}