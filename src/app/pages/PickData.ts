// Shared data, types, and utility functions for the Pick page and its sub-components.
// Extracted to allow PickModals.tsx to import without circular dependencies.

export type WorkItem = {
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

export type WorkLine = {
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

export type WorkOperation = {
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

export type ReplenItem = {
 id: string;
 sku: string;
 description: string;
 quantity: number;
 location: string;
 priority: string;
 containerName: string;
 compartmentLpn: string;
 binNumber: string;
 itemComment?: string;
 imageUrl?: string;
 compartmentConfig: { rows: number; cols: number };
};

export type Compartment = {
 lpn: string;
 row: number;
 col: number;
};

export type SortbarRegistration = {
 sortbarId: string;
 workListId: string;
 lpn?: string;
 registrationMethod: "list" | "lpn";
 itemCount: number;
 totalQuantity: number;
 items: ReplenItem[];
 processedItems: Map<string, number>;
 selectedItemId: string | null;
};

// Mock data for sortbar locations
export const initialSortbars = [
 { id: "SB-A1", name: "A1", zone: "Zone A", capacity: 24 },
 { id: "SB-A2", name: "A2", zone: "Zone A", capacity: 24 },
 { id: "SB-A3", name: "A3", zone: "Zone A", capacity: 32 },
 { id: "SB-A4", name: "A4", zone: "Zone A", capacity: 32 },
 { id: "SB-A5", name: "A5", zone: "Zone A", capacity: 24 },
 { id: "SB-A6", name: "A6", zone: "Zone A", capacity: 24 },
 { id: "SB-A7", name: "A7", zone: "Zone A", capacity: 32 },
 { id: "SB-A8", name: "A8", zone: "Zone A", capacity: 32 },
 { id: "SB-A9", name: "A9", zone: "Zone A", capacity: 24 },
 { id: "SB-A10", name: "A10", zone: "Zone A", capacity: 32 },
 { id: "SB-B1", name: "B1", zone: "Zone B", capacity: 32 },
 { id: "SB-B2", name: "B2", zone: "Zone B", capacity: 16 },
 { id: "SB-B3", name: "B3", zone: "Zone B", capacity: 16 },
 { id: "SB-B4", name: "B4", zone: "Zone B", capacity: 24 },
 { id: "SB-B5", name: "B5", zone: "Zone B", capacity: 24 },
 { id: "SB-B6", name: "B6", zone: "Zone B", capacity: 32 },
 { id: "SB-B7", name: "B7", zone: "Zone B", capacity: 32 },
 { id: "SB-B8", name: "B8", zone: "Zone B", capacity: 16 },
 { id: "SB-B9", name: "B9", zone: "Zone B", capacity: 24 },
 { id: "SB-B10", name: "B10", zone: "Zone B", capacity: 32 },
 { id: "SB-C1", name: "C1", zone: "Zone C", capacity: 32 },
 { id: "SB-C2", name: "C2", zone: "Zone C", capacity: 24 },
 { id: "SB-C3", name: "C3", zone: "Zone C", capacity: 24 },
 { id: "SB-C4", name: "C4", zone: "Zone C", capacity: 16 },
 { id: "SB-C5", name: "C5", zone: "Zone C", capacity: 32 },
 { id: "SB-C6", name: "C6", zone: "Zone C", capacity: 24 },
 { id: "SB-C7", name: "C7", zone: "Zone C", capacity: 32 },
 { id: "SB-C8", name: "C8", zone: "Zone C", capacity: 16 },
 { id: "SB-C9", name: "C9", zone: "Zone C", capacity: 24 },
 { id: "SB-C10", name: "C10", zone: "Zone C", capacity: 32 },
 { id: "SB-D1", name: "D1", zone: "Zone D", capacity: 24 },
 { id: "SB-D2", name: "D2", zone: "Zone D", capacity: 32 },
 { id: "SB-D3", name: "D3", zone: "Zone D", capacity: 24 },
 { id: "SB-D4", name: "D4", zone: "Zone D", capacity: 16 },
 { id: "SB-D5", name: "D5", zone: "Zone D", capacity: 32 },
 { id: "SB-D6", name: "D6", zone: "Zone D", capacity: 24 },
 { id: "SB-D7", name: "D7", zone: "Zone D", capacity: 32 },
 { id: "SB-D8", name: "D8", zone: "Zone D", capacity: 16 },
 { id: "SB-D9", name: "D9", zone: "Zone D", capacity: 24 },
 { id: "SB-D10", name: "D10", zone: "Zone D", capacity: 32 },
];

// Mock workstation history data - last 10 operations
export const mockWorkstationHistory = [
 { id: 1, timestamp: "2024-03-16 14:35:22", operator: "John Smith", action: "Completed Work List", details: "WL-REP-001 - 8 items processed", status: "Success" },
 { id: 2, timestamp: "2024-03-16 14:30:15", operator: "John Smith", action: "Item Shorted", details: "ITM-5003 - Qty 25/30 (83%)", status: "Warning" },
 { id: 3, timestamp: "2024-03-16 14:22:08", operator: "John Smith", action: "Container Registered", details: "CNT-A-1234 on Sortbar A1", status: "Success" },
 { id: 4, timestamp: "2024-03-16 14:15:45", operator: "John Smith", action: "Work List Started", details: "WL-REP-001 - Replen A-Zone Morning", status: "Success" },
 { id: 5, timestamp: "2024-03-16 13:58:30", operator: "Sarah Johnson", action: "Sortbar Unregistered", details: "Sortbar B1 - Work completed", status: "Success" },
 { id: 6, timestamp: "2024-03-16 13:45:12", operator: "Sarah Johnson", action: "Item Completed", details: "ITM-7001 - Full qty 60/60 (100%)", status: "Success" },
 { id: 7, timestamp: "2024-03-16 13:30:55", operator: "Sarah Johnson", action: "Sortbar Registered", details: "Sortbar B1 - WL-REP-002", status: "Success" },
 { id: 8, timestamp: "2024-03-16 12:15:40", operator: "Mike Davis", action: "Work List Cancelled", details: "WL-REP-004 - User requested", status: "Warning" },
 { id: 9, timestamp: "2024-03-16 11:45:20", operator: "Mike Davis", action: "Container Registered", details: "CNT-B-5678 on Sortbar A2", status: "Success" },
 { id: 10, timestamp: "2024-03-16 11:20:05", operator: "Emily Chen", action: "Sortbar Registered", details: "Sortbar C1 - WL-REP-003", status: "Success" },
];

// Mock data for available replenishment work lists
export const mockPickLists = [
 { id: "WL-PICK-001", name: "Pick A-Zone Morning", priority: "High", itemCount: 8, status: "Ready" },
 { id: "WL-PICK-002", name: "Pick B-Zone AM", priority: "Normal", itemCount: 8, status: "Ready" },
 { id: "WL-PICK-003", name: "Pick C-Zone Priority", priority: "High", itemCount: 8, status: "Ready" },
 { id: "WL-PICK-004", name: "Pick Multi-Zone", priority: "Normal", itemCount: 8, status: "Ready" },
 { id: "WL-PICK-005", name: "Pick Express", priority: "High", itemCount: 8, status: "Ready" },
 { id: "WL-PICK-006", name: "Pick External A3", priority: "Normal", itemCount: 8, status: "In Progress" },
 { id: "WL-PICK-007", name: "Pick External C3", priority: "High", itemCount: 8, status: "In Progress" },
];

// Generate mock work list detail
export const generateWorkListDetail = (listId: string): WorkItem => {
 const listData = mockPickLists.find(l => l.id === listId);
 return {
 id: listId,
 workList: listId,
 type: "Pick",
 status: "In Progress",
 priority: listData?.priority || "Normal",
 priorityDateTime: "2024-03-16 08:30",
 isHot: listData?.priority === "High",
 attribute1: "Zone A",
 attribute2: "Q1 2024",
 attribute3: "Morning Shift",
 attribute4: "Active",
 attribute5: "Standard",
 subType: "Wave",
 started: "2024-03-16 08:15",
 storage: "A-01-02",
 destination: "Sortbar",
 created: "2024-03-16 07:00",
 modified: "2024-03-16 08:30",
 };
};

// Generate mock work lines — count matches generateMockItems for the same listId
export const generateWorkLines = (workListId: string): WorkLine[] => {
 const allLines = [
 { id: "1", workListId, workLine: "WL-001", priority: "High", item: "ITM-5001", quantity: 50, status: "In Progress", started: "2024-03-16 08:15", comment: "Urgent replen" },
 { id: "2", workListId, workLine: "WL-002", priority: "Normal", item: "ITM-5002", quantity: 75, status: "Queued", started: "", comment: "" },
 { id: "3", workListId, workLine: "WL-003", priority: "High", item: "ITM-5003", quantity: 30, status: "Queued", started: "", comment: "Low stock alert" },
 { id: "4", workListId, workLine: "WL-004", priority: "Normal", item: "ITM-6001", quantity: 100, status: "Queued", started: "", comment: "" },
 { id: "5", workListId, workLine: "WL-005", priority: "High", item: "ITM-6002", quantity: 45, status: "Queued", started: "", comment: "Express order" },
 { id: "6", workListId, workLine: "WL-006", priority: "Normal", item: "ITM-7001", quantity: 60, status: "Queued", started: "", comment: "" },
 { id: "7", workListId, workLine: "WL-007", priority: "Normal", item: "ITM-7002", quantity: 25, status: "Queued", started: "", comment: "" },
 { id: "8", workListId, workLine: "WL-008", priority: "High", item: "ITM-8001", quantity: 90, status: "Queued", started: "", comment: "High demand item" },
 ];
 // Same seed logic as generateMockItems so line count always matches item count
 const rand = listPrng(workListId);
 const itemCount = Math.floor(rand() * 8) + 1;
 return allLines.slice(0, itemCount);
};

// Generate mock work operations for work lines
export const generateWorkOperations = (workLines: WorkLine[]): WorkOperation[] => {
 const operations: WorkOperation[] = [];
 const types = ["Pick", "Put", "Move", "Count", "Pack"];
 const statuses = ["Queued", "In Progress", "Completed"];

 const aisles = ["AISLE-01", "AISLE-02", "AISLE-03", "AISLE-04", "AISLE-05"];
 const bins = ["BIN-A1", "BIN-A2", "BIN-B1", "BIN-B2", "BIN-C1", "BIN-C2"];
 const locations = aisles.flatMap(aisle => bins.map(bin => `${aisle}-${bin}`));
 const stations = ["PACK-01", "PACK-02", "QC-STATION-A", "STAGING-A", "STAGING-B"];

 const comments = ["In progress", "Standard operation", "Priority task", "Quality check required", ""];

 workLines.forEach((workLine, wlIndex) => {
 const opsPerLine = Math.floor(Math.random() * 3) + 2; // 2-4 operations per work line

 for (let i = 0; i < opsPerLine; i++) {
 const opStatus = workLine.status === "Completed" ? "Completed" :
 workLine.status === "In Progress" && i === 0 ? "In Progress" :
 "Queued";

 const hasStarted = opStatus === "In Progress" || opStatus === "Completed";
 const startDate = hasStarted ? `2024-03-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')} ${String(Math.floor(Math.random() * 16) + 6).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}` : "";

 operations.push({
 id: `${wlIndex + 1}-${i + 1}`,
 workLineId: workLine.id,
 workOperation: `WO-${String(wlIndex * 4 + i + 1).padStart(3, '0')}`,
 type: types[(wlIndex + i) % types.length],
 destinationLocation: stations[i % stations.length],
 sourceLocation: locations[(wlIndex * 4 + i) % locations.length],
 status: opStatus,
 started: startDate,
 comment: comments[(wlIndex + i) % comments.length],
 });
 }
 });

 return operations;
};

// Deterministic hash so the same listId always produces the same items
// Simple seeded PRNG (LCG) — same seed always yields same sequence
function makePrng(seed: number) {
 let s = Math.abs(seed) >>> 0;
 return () => {
 s = (Math.imul(1664525, s) + 1013904223) >>> 0;
 return s / 0x100000000;
 };
}

function hashStr(str: string): number {
 let h = 5381;
 for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) & 0x7fffffff;
 return h;
}

// Returns a deterministic item count (1–8) and shuffle for a given listId.
// Same listId → same result every call; different listIds → different results.
function listPrng(listId: string) {
 return makePrng(hashStr(listId));
}

// Generate mock items for a pick list
export const generateMockItems = (listId: string, sortbarId?: string): ReplenItem[] => {
 const binNumbers = ["BIN-A-12-03", "BIN-A-14-05", "BIN-B-08-02", "BIN-B-10-07", "BIN-C-05-01", "BIN-A-18-04", "BIN-B-12-06", "BIN-C-09-03"];
 const comments = ["Handle with care", "Fragile item", "Check expiration date", "Count carefully", "Priority shipment", "Quality check needed", "Customer request", "Rush order"];
 const images = [
 "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
 "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400",
 "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
 "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400",
 "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400",
 "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400",
 "https://images.unsplash.com/photo-1503602642458-232111445657?w=400",
 "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
 ];

 // If sortbarId is A4 (SB-A4), force all items to use single compartment
 const isA4Sortbar = sortbarId === "SB-A4";

 const compartmentConfigs = isA4Sortbar
 ? [{ rows: 1, cols: 1 }]
 : [
 { rows: 1, cols: 1 },
 { rows: 1, cols: 2 },
 { rows: 2, cols: 2 },
 { rows: 2, cols: 3 },
 { rows: 2, cols: 4 },
 { rows: 3, cols: 4 },
 { rows: 4, cols: 3 },
 { rows: 6, cols: 3 },
 ];

 const allItems: ReplenItem[] = [
 { id: "ITM-001", sku: "SKU-12345", description: "Widget A - Blue", quantity: 8, location: "A-12-03", priority: "High", containerName: "CONT-A-001", compartmentLpn: "LPN-A-001-C01", binNumber: binNumbers[0], itemComment: comments[0], imageUrl: images[0], compartmentConfig: compartmentConfigs[0] },
 { id: "ITM-002", sku: "SKU-12346", description: "Widget B - Red", quantity: 12, location: "A-14-05", priority: "Normal", containerName: "CONT-A-002", compartmentLpn: "LPN-A-002-C01", binNumber: binNumbers[1], itemComment: comments[1], imageUrl: images[1], compartmentConfig: compartmentConfigs[Math.min(1, compartmentConfigs.length - 1)] },
 { id: "ITM-003", sku: "SKU-12347", description: "Gadget C - Green", quantity: 5, location: "B-08-02", priority: "High", containerName: "CONT-B-001", compartmentLpn: "LPN-B-001-C03", binNumber: binNumbers[2], itemComment: comments[2], imageUrl: images[2], compartmentConfig: compartmentConfigs[Math.min(2, compartmentConfigs.length - 1)] },
 { id: "ITM-004", sku: "SKU-12348", description: "Tool D - Black", quantity: 15, location: "B-10-07", priority: "Normal", containerName: "CONT-B-002", compartmentLpn: "LPN-B-002-C04", binNumber: binNumbers[3], itemComment: comments[3], imageUrl: images[3], compartmentConfig: compartmentConfigs[Math.min(3, compartmentConfigs.length - 1)] },
 { id: "ITM-005", sku: "SKU-12349", description: "Part E - Silver", quantity: 7, location: "C-05-01", priority: "High", containerName: "CONT-C-001", compartmentLpn: "LPN-C-001-C05", binNumber: binNumbers[4], itemComment: comments[4], imageUrl: images[4], compartmentConfig: compartmentConfigs[Math.min(4, compartmentConfigs.length - 1)] },
 { id: "ITM-006", sku: "SKU-12350", description: "Component F - Yellow", quantity: 10, location: "A-18-04", priority: "Normal", containerName: "CONT-A-003", compartmentLpn: "LPN-A-003-C09", binNumber: binNumbers[5], itemComment: comments[5], imageUrl: images[5], compartmentConfig: compartmentConfigs[Math.min(5, compartmentConfigs.length - 1)] },
 { id: "ITM-007", sku: "SKU-12351", description: "Assembly G - Orange", quantity: 6, location: "B-12-06", priority: "High", containerName: "CONT-B-003", compartmentLpn: "LPN-B-003-C10", binNumber: binNumbers[6], itemComment: comments[6], imageUrl: images[6], compartmentConfig: compartmentConfigs[Math.min(6, compartmentConfigs.length - 1)] },
 { id: "ITM-008", sku: "SKU-12352", description: "Module H - Purple", quantity: 14, location: "C-09-03", priority: "Normal", containerName: "CONT-C-002", compartmentLpn: "LPN-C-002-C01", binNumber: binNumbers[7], itemComment: comments[7], imageUrl: images[7], compartmentConfig: compartmentConfigs[Math.min(7, compartmentConfigs.length - 1)] },
 ];

 const rand = listPrng(listId);
 // Deterministic item count: 1–8, unique per list
 const itemCount = Math.floor(rand() * 8) + 1;
 // Deterministic Fisher-Yates shuffle
 const shuffled = [...allItems];
 for (let i = shuffled.length - 1; i > 0; i--) {
 const j = Math.floor(rand() * (i + 1));
 [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
 }
 return shuffled.slice(0, itemCount);
};

// Generate compartments for a container based on configuration
export const generateCompartments = (containerName: string, config: { rows: number; cols: number }): Compartment[] => {
 const compartments: Compartment[] = [];
 let compartmentNum = 1;

 for (let row = 0; row < config.rows; row++) {
 for (let col = 0; col < config.cols; col++) {
 const compartmentId = String(compartmentNum).padStart(2, '0');
 const containerPrefix = containerName.replace('CONT-', '');
 compartments.push({
 lpn: `LPN-${containerPrefix}-C${compartmentId}`,
 row,
 col,
 });
 compartmentNum++;
 }
 }

 return compartments;
};

// Generate initial pre-registered sortbars
export const generateInitialRegistrations = (): SortbarRegistration[] => {
 // Start with no pre-registered sortbars
 return [];
};
