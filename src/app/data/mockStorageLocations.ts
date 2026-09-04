// Mock data for Storage Locations

export type StorageLocation = {
  id: string;
  name: string;
  parentStorage: string;
  status: string;
  type: string;
  attribute1: string;
  attribute2: string;
  attribute3: string;
  attribute4: string;
  attribute5: string;
  created: string;
  createdBy: string;
  isMoveable: boolean;
  fillStatus?: string;
  itemType?: string;
};

// Generate mock storage locations
function generateStorageLocations(): StorageLocation[] {
  const locations: StorageLocation[] = [];
  const types = ["Pallet", "Shelf", "Bin", "Rack", "Tray", "Gaylord", "Conventional"];
  const statuses = ["Available", "Occupied", "Reserved", "Locked"];
  const accessibilities = ["Standard", "High Reach"];
  const restrictions = ["None", "Hazmat Only"];
  const fillStatuses = ["Empty", "Partial", "Full"];
  const itemTypes = ["Trash", "Cardboard", "Plastic", "Damaged Material"];

  let counter = 1;
  const now = new Date();

  // First pass: Generate Racks and Shelves (Locations)
  // These have Zone as parent storage
  const racks: StorageLocation[] = [];
  const shelves: StorageLocation[] = [];

  for (let zone = 1; zone <= 4; zone++) {
    for (let aisle = 1; aisle <= 5; aisle++) {
      for (let level = 1; level <= 3; level++) {
        for (let position = 1; position <= 2; position++) {
          const aisleStr = String(aisle).padStart(2, "0");
          const levelStr = String(level).padStart(2, "0");
          const positionStr = String(position).padStart(2, "0");

          const type = types[counter % types.length];

          // Generate location code based on type
          const typePrefix = type === "Pallet" ? "P" :
                            type === "Shelf" ? "S" :
                            type === "Bin" ? "B" :
                            type === "Tray" ? "T" :
                            type === "Gaylord" ? "G" :
                            type === "Conventional" ? "C" : "R"; // Rack
          const locationCode = `${typePrefix}${zone}${aisleStr}${levelStr}${positionStr}`;

          const status = statuses[counter % statuses.length];

          const capacity = type === "Pallet" ? 2000 :
                          type === "Shelf" ? 500 :
                          type === "Bin" ? 200 : 1500;

          const occupancyPercent = status === "Available" ? 0 :
                                  status === "Blocked" ? 10 :
                                  50 + (counter % 40);

          const currentOccupancy = Math.floor(capacity * occupancyPercent / 100);
          const itemCount = status === "Available" ? 0 : 5 + (counter % 20);
          const containerCount = status === "Available" ? 0 : counter % 8;

          const lastAccessed = new Date(now.getTime() - (counter % 30) * 24 * 60 * 60 * 1000).toISOString();
          const lastReplenished = new Date(now.getTime() - (counter % 60) * 24 * 60 * 60 * 1000).toISOString();
          const created = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString();
          const modified = new Date(now.getTime() - (counter % 7) * 24 * 60 * 60 * 1000).toISOString();

          // Determine if this is a container type
          const isContainer = type === "Bin" || type === "Pallet" || type === "Tray" || type === "Gaylord" || type === "Conventional";

          // Generate fillStatus and itemType for containers
          const fillStatus = isContainer ? fillStatuses[counter % fillStatuses.length] : undefined;
          const itemType = isContainer && (status === "Occupied" || status === "Reserved")
            ? itemTypes[counter % itemTypes.length]
            : undefined;

          const location: StorageLocation = {
            id: counter.toString(),
            name: locationCode,
            parentStorage: `Zone${zone}`,
            status,
            type,
            attribute1: accessibilities[counter % accessibilities.length],
            attribute2: restrictions[counter % restrictions.length],
            attribute3: `Capacity: ${capacity}`,
            attribute4: `Current Occupancy: ${currentOccupancy}`,
            attribute5: `Item Count: ${itemCount}`,
            created,
            createdBy: "Admin",
            isMoveable: type !== "Rack" && type !== "Shelf", // Racks and Shelves are fixed
            fillStatus,
            itemType,
          };

          // Store Racks and Shelves separately for use as parent storage
          if (type === "Rack") {
            racks.push(location);
          } else if (type === "Shelf") {
            shelves.push(location);
          }

          locations.push(location);
          counter++;
        }
      }
    }
  }

  // Combine racks and shelves for parent storage pool
  const parentLocations = [...racks, ...shelves];

  // Update all container types to have parent storage from Racks/Shelves
  locations.forEach(location => {
    const isContainer = location.type === "Bin" || location.type === "Pallet" ||
                       location.type === "Tray" || location.type === "Gaylord" ||
                       location.type === "Conventional";

    if (isContainer) {
      // Assign a parent from the available racks and shelves
      if (parentLocations.length > 0) {
        const parentIndex = parseInt(location.id) % parentLocations.length;
        location.parentStorage = parentLocations[parentIndex].name;
      }
    }
  });

  return locations;
}

export const mockStorageLocations = generateStorageLocations();