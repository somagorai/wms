import { mockWorkListData, mockWorkLines, mockWorkOperations, type WorkItem, type WorkLine, type WorkOperation } from "../pages/WorkList";
import { mockStorageLocations } from "./mockStorageLocations";

// Mock data for Storage Location Inventory
export interface StorageLocationInventory {
  id: string;
  itemNumber: string;
  itemDescription: string;
  quantity: number;
  uom: string;
  lotNumber: string;
  serialNumber: string;
  receivedDate: string;
  expirationDate: string;
}

// Mock data for Storage Location Allocations
export interface StorageLocationAllocation {
  id: string;
  workList: string;
  workLine: string;
  workOperation: string;
  workOperationType: string;
  status: string;
  created: string;
  createdBy: string;
  completed?: string; // Only for history
}

// Mock data for Container Linkage Events
export interface ContainerLinkageEvent {
  id: string;
  containerName: string;
  containerType: string;
  linkedFrom: string;
  linkedTo: string;
  createdBy: string;
  isCurrent: boolean; // true if still linked, false if historical
}

// Mock data for Parent Change Events (for containers)
export interface ParentChangeEvent {
  id: string;
  eventType: 'parent_change';
  oldParent: string;
  newParent: string;
  changedDate: string;
  changedBy: string;
}

// Simple hash function for deterministic random generation
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Seeded random number generator
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed % 2147483647;
    if (this.seed <= 0) this.seed += 2147483646;
  }

  next(): number {
    this.seed = (this.seed * 16807) % 2147483647;
    return (this.seed - 1) / 2147483646;
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  nextBool(probability: number = 0.5): boolean {
    return this.next() < probability;
  }
}

// Helper function to generate inventory data for a location
function generateInventoryForLocation(locationName: string, status: string): StorageLocationInventory[] {
  const seed = hashCode(locationName);
  const rng = new SeededRandom(seed);

  // Only generate inventory for Occupied and Reserved locations
  if (status !== "Occupied" && status !== "Reserved") {
    return [];
  }

  // Use deterministic check - ensure ~70% of occupied/reserved locations have inventory
  if (!rng.nextBool(0.7)) {
    return [];
  }

  const items: StorageLocationInventory[] = [];
  const itemCount = rng.nextInt(1, 3); // 1-3 items per location
  
  const itemDescriptions = [
    "Widget Assembly Standard",
    "Bearing Housing Unit",
    "Hydraulic Pump Component",
    "Steel Plate 1/4 inch",
    "Fastener Kit Assorted",
    "Electric Motor 5HP",
    "Pneumatic Cylinder 4x6",
    "Control Valve Assembly",
    "Servo Motor 3.5kW",
    "Gear Box Assembly",
    "Conveyor Belt Section",
    "Sensor Module Digital",
    "Cable Harness Assembly",
    "Filter Cartridge HEPA",
    "Mounting Bracket Set",
    "Drive Shaft Component",
    "Cooling Fan Unit",
    "Power Supply Module",
    "Circuit Board Assembly",
    "Actuator Linear 12V"
  ];

  const uoms = ["EA", "SHT", "KIT", "BOX", "SET"];
  const users = ["user@company.com", "admin@company.com", "operator@company.com"];

  for (let i = 0; i < itemCount; i++) {
    const itemNum = 10000 + rng.nextInt(0, 90000);
    const quantity = 10 + rng.nextInt(0, 490);
    const lotNum = `LOT-2024-${String(rng.nextInt(1, 999)).padStart(3, "0")}`;
    const hasSerial = rng.nextBool(0.2);
    const serialNum = hasSerial ? `SN-${String(rng.nextInt(1, 9999)).padStart(4, "0")}` : "";
    
    const daysAgo = rng.nextInt(1, 60);
    const receivedDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
    
    const hasExpiration = rng.nextBool(0.5);
    const expirationDate = hasExpiration 
      ? new Date(Date.now() + (365 + rng.nextInt(0, 365)) * 24 * 60 * 60 * 1000).toISOString()
      : "";

    items.push({
      id: `inv-${locationName}-${i}`,
      itemNumber: `ITEM-${itemNum}`,
      itemDescription: itemDescriptions[rng.nextInt(0, itemDescriptions.length - 1)],
      quantity,
      uom: uoms[rng.nextInt(0, uoms.length - 1)],
      lotNumber: lotNum,
      serialNumber: serialNum,
      receivedDate,
      expirationDate,
    });
  }

  return items;
}

// Helper function to generate current allocations for a location using REAL work list data
function generateCurrentAllocationsForLocation(locationName: string, status: string): StorageLocationAllocation[] {
  const seed = hashCode(locationName + "-alloc");
  const rng = new SeededRandom(seed);

  // Only generate allocations for Occupied and Reserved locations
  if (status !== "Occupied" && status !== "Reserved") {
    return [];
  }

  // Filter work operations that are not completed (In Progress, Queued, Warning)
  const activeOperations = mockWorkOperations.filter(op => 
    op.status === "In Progress" || op.status === "Queued" || op.status === "Warning"
  );

  if (activeOperations.length === 0) {
    return [];
  }

  // Use deterministic check - ensure ~50% of occupied/reserved locations have allocations
  if (!rng.nextBool(0.5)) {
    return [];
  }

  const allocations: StorageLocationAllocation[] = [];
  const allocCount = rng.nextInt(1, 2); // 1-2 allocations per location
  
  const users = ["user@company.com", "admin@company.com", "operator@company.com"];

  for (let i = 0; i < allocCount; i++) {
    // Pick a random active operation
    const operation = activeOperations[rng.nextInt(0, activeOperations.length - 1)];
    
    // Find the corresponding work line
    const workLine = mockWorkLines.find(wl => wl.workLine === operation.workLineId);
    if (!workLine) continue;
    
    // Find the corresponding work list
    const workList = mockWorkListData.find(wl => wl.id === workLine.workListId);
    if (!workList) continue;

    const hoursAgo = rng.nextInt(1, 48);
    const createdDate = new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString();

    allocations.push({
      id: `alloc-${locationName}-${i}`,
      workList: workList.workList,
      workLine: workLine.workLine,
      workOperation: operation.workOperation,
      workOperationType: operation.type,
      status: operation.status,
      created: createdDate,
      createdBy: users[rng.nextInt(0, users.length - 1)],
    });
  }

  return allocations;
}

// Helper function to generate allocation history for a location using REAL work list data
function generateAllocationHistoryForLocation(locationName: string, status: string): StorageLocationAllocation[] {
  const seed = hashCode(locationName + "-history");
  const rng = new SeededRandom(seed);
  
  // Filter completed work operations
  const completedOperations = mockWorkOperations.filter(op => op.status === "Completed");

  if (completedOperations.length === 0) {
    return [];
  }

  // All locations can have history - use deterministic check for ~60% having history
  if (!rng.nextBool(0.6)) {
    return [];
  }

  const history: StorageLocationAllocation[] = [];
  const histCount = rng.nextInt(1, 4); // 1-4 historical records
  
  const users = ["user@company.com", "admin@company.com", "operator@company.com"];

  for (let i = 0; i < histCount; i++) {
    // Pick a random completed operation
    const operation = completedOperations[rng.nextInt(0, completedOperations.length - 1)];
    
    // Find the corresponding work line
    const workLine = mockWorkLines.find(wl => wl.workLine === operation.workLineId);
    if (!workLine) continue;
    
    // Find the corresponding work list
    const workList = mockWorkListData.find(wl => wl.id === workLine.workListId);
    if (!workList) continue;

    const daysAgo = rng.nextInt(1, 30);
    const createdDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
    const completedDate = new Date(new Date(createdDate).getTime() + (30 + rng.nextInt(0, 120)) * 60 * 1000).toISOString();

    history.push({
      id: `hist-${locationName}-${i}`,
      workList: workList.workList,
      workLine: workLine.workLine,
      workOperation: operation.workOperation,
      workOperationType: operation.type,
      status: "Completed",
      created: createdDate,
      createdBy: users[rng.nextInt(0, users.length - 1)],
      completed: completedDate,
    });
  }

  return history;
}

// Generate inventory data for all locations
export function getInventoryForLocation(locationName: string, status: string): StorageLocationInventory[] {
  return generateInventoryForLocation(locationName, status);
}

// Generate current allocations for all locations
export function getCurrentAllocationsForLocation(locationName: string, status: string): StorageLocationAllocation[] {
  return generateCurrentAllocationsForLocation(locationName, status);
}

// Generate allocation history for all locations
export function getAllocationHistoryForLocation(locationName: string, status: string): StorageLocationAllocation[] {
  return generateAllocationHistoryForLocation(locationName, status);
}

// Helper function to generate container linkage events for a location (Racks and Shelves)
function generateContainerLinkageForLocation(locationName: string, locationType: string): ContainerLinkageEvent[] {
  // Only generate for Racks and Shelves (Locations, not Containers)
  if (locationType !== "Rack" && locationType !== "Shelf") {
    return [];
  }

  const seed = hashCode(locationName + "-containers");
  const rng = new SeededRandom(seed);

  // Get all containers (all container types) that could be linked to this location
  const containerTypes = ["Bin", "Pallet", "Tray", "Gaylord", "Conventional"];
  const allContainers = mockStorageLocations.filter(loc => containerTypes.includes(loc.type));

  if (allContainers.length === 0) {
    return [];
  }

  const events: ContainerLinkageEvent[] = [];
  const users = ["user@company.com", "admin@company.com", "operator@company.com"];

  // Generate 2-5 linkage events (mix of current and historical)
  const eventCount = rng.nextInt(2, 5);

  for (let i = 0; i < eventCount; i++) {
    const container = allContainers[rng.nextInt(0, allContainers.length - 1)];
    const isCurrent = i === 0 && rng.nextBool(0.4); // 40% chance the first one is current

    const daysAgo = isCurrent ? rng.nextInt(1, 30) : rng.nextInt(30, 90);
    const linkedFromDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();

    const linkedToDate = isCurrent
      ? ""
      : new Date(new Date(linkedFromDate).getTime() + (rng.nextInt(1, 20) * 24 * 60 * 60 * 1000)).toISOString();

    events.push({
      id: `link-${locationName}-${i}`,
      containerName: container.name,
      containerType: container.type,
      linkedFrom: linkedFromDate,
      linkedTo: linkedToDate,
      createdBy: users[rng.nextInt(0, users.length - 1)],
      isCurrent,
    });
  }

  return events.sort((a, b) => {
    // Sort current first, then by date descending
    if (a.isCurrent && !b.isCurrent) return -1;
    if (!a.isCurrent && b.isCurrent) return 1;
    return new Date(b.linkedFrom).getTime() - new Date(a.linkedFrom).getTime();
  });
}

// Helper function to generate parent change events for a container
function generateParentChangeEventsForContainer(containerName: string, containerType: string): ParentChangeEvent[] {
  // Only generate for container types (not Locations like Racks and Shelves)
  const containerTypes = ["Bin", "Pallet", "Tray", "Gaylord", "Conventional"];
  if (!containerTypes.includes(containerType)) {
    return [];
  }

  const seed = hashCode(containerName + "-parents");
  const rng = new SeededRandom(seed);

  // Get all possible parent locations (Racks and Shelves)
  const possibleParents = mockStorageLocations.filter(loc => loc.type === "Rack" || loc.type === "Shelf");

  if (possibleParents.length === 0) {
    return [];
  }

  // Only generate history for ~70% of containers
  if (!rng.nextBool(0.7)) {
    return [];
  }

  const events: ParentChangeEvent[] = [];
  const users = ["user@company.com", "admin@company.com", "operator@company.com"];

  // Generate 1-4 parent change events
  const eventCount = rng.nextInt(1, 4);

  for (let i = 0; i < eventCount; i++) {
    const oldParent = possibleParents[rng.nextInt(0, possibleParents.length - 1)];
    const newParent = possibleParents[rng.nextInt(0, possibleParents.length - 1)];

    // Ensure old and new are different
    if (oldParent.name === newParent.name) continue;

    const daysAgo = rng.nextInt(1 + (i * 20), 30 + (i * 20));
    const changedDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();

    events.push({
      id: `parent-${containerName}-${i}`,
      eventType: 'parent_change',
      oldParent: oldParent.name,
      newParent: newParent.name,
      changedDate,
      changedBy: users[rng.nextInt(0, users.length - 1)],
    });
  }

  return events.sort((a, b) => new Date(b.changedDate).getTime() - new Date(a.changedDate).getTime());
}

// Generate container linkage events for locations
export function getContainerLinkageForLocation(locationName: string, locationType: string): ContainerLinkageEvent[] {
  return generateContainerLinkageForLocation(locationName, locationType);
}

// Generate parent change events for containers
export function getParentChangeEventsForContainer(containerName: string, containerType: string): ParentChangeEvent[] {
  return generateParentChangeEventsForContainer(containerName, containerType);
}
