export type Inventory = {
  storageLocation: string;
  quantity: number;
  status: string;
  parentStorage: string;
  fifoDate: string;
  attribute1: string;
  attribute2: string;
  attribute3: string;
  attribute4: string;
  attribute5: string;
  created: string;
  createdBy: string;
  modified: string;
  modifiedBy: string;
};

// Generate inventory records for items across various storage locations
export function getInventoryForItem(itemId: string): Inventory[] {
  // Sample inventory distribution
  const inventoryMap: { [key: string]: Inventory[] } = {
    "ITEM-001": [
      {
        storageLocation: "A-01-01-01",
        quantity: 150,
        status: "Available",
        parentStorage: "A-01-01",
        fifoDate: "2024-03-01",
        attribute1: "Batch-2024-001",
        attribute2: "Zone-A",
        attribute3: "Regular",
        attribute4: "",
        attribute5: "",
        created: "2024-03-01 08:00:00",
        createdBy: "system",
        modified: "2024-03-16 10:30:00",
        modifiedBy: "jsmith"
      },
      {
        storageLocation: "B-02-03-02",
        quantity: 75,
        status: "Available",
        parentStorage: "B-02-03",
        fifoDate: "2024-03-10",
        attribute1: "Batch-2024-002",
        attribute2: "Zone-B",
        attribute3: "Regular",
        attribute4: "",
        attribute5: "",
        created: "2024-03-10 14:20:00",
        createdBy: "system",
        modified: "2024-03-16 09:15:00",
        modifiedBy: "admin"
      },
      {
        storageLocation: "C-03-01-01",
        quantity: 25,
        status: "Reserved",
        parentStorage: "C-03-01",
        fifoDate: "2024-03-05",
        attribute1: "Batch-2024-001",
        attribute2: "Zone-C",
        attribute3: "Express",
        attribute4: "",
        attribute5: "",
        created: "2024-03-05 11:00:00",
        createdBy: "system",
        modified: "2024-03-15 16:45:00",
        modifiedBy: "jsmith"
      }
    ],
    "ITEM-002": [
      {
        storageLocation: "A-01-02-01",
        quantity: 45,
        status: "Available",
        parentStorage: "A-01-02",
        fifoDate: "2024-02-20",
        attribute1: "Batch-2024-ALU",
        attribute2: "Zone-A",
        attribute3: "Regular",
        attribute4: "",
        attribute5: "",
        created: "2024-02-20 09:30:00",
        createdBy: "system",
        modified: "2024-03-14 13:20:00",
        modifiedBy: "admin"
      },
      {
        storageLocation: "D-04-01-03",
        quantity: 30,
        status: "Available",
        parentStorage: "D-04-01",
        fifoDate: "2024-03-08",
        attribute1: "Batch-2024-ALU",
        attribute2: "Zone-D",
        attribute3: "Regular",
        attribute4: "",
        attribute5: "",
        created: "2024-03-08 10:45:00",
        createdBy: "system",
        modified: "2024-03-16 08:30:00",
        modifiedBy: "jsmith"
      }
    ],
    "ITEM-003": [
      {
        storageLocation: "A-01-01-02",
        quantity: 200,
        status: "Available",
        parentStorage: "A-01-01",
        fifoDate: "2024-03-12",
        attribute1: "Batch-USB-001",
        attribute2: "Zone-A",
        attribute3: "Fast Moving",
        attribute4: "",
        attribute5: "",
        created: "2024-03-12 07:15:00",
        createdBy: "system",
        modified: "2024-03-16 11:40:00",
        modifiedBy: "jsmith"
      },
      {
        storageLocation: "B-02-01-01",
        quantity: 150,
        status: "Available",
        parentStorage: "B-02-01",
        fifoDate: "2024-03-14",
        attribute1: "Batch-USB-002",
        attribute2: "Zone-B",
        attribute3: "Fast Moving",
        attribute4: "",
        attribute5: "",
        created: "2024-03-14 08:30:00",
        createdBy: "system",
        modified: "2024-03-16 14:20:00",
        modifiedBy: "admin"
      },
      {
        storageLocation: "E-05-02-01",
        quantity: 50,
        status: "Reserved",
        parentStorage: "E-05-02",
        fifoDate: "2024-03-13",
        attribute1: "Batch-USB-001",
        attribute2: "Zone-E",
        attribute3: "Fast Moving",
        attribute4: "",
        attribute5: "",
        created: "2024-03-13 12:00:00",
        createdBy: "system",
        modified: "2024-03-15 10:15:00",
        modifiedBy: "jsmith"
      }
    ],
    "ITEM-004": [
      {
        storageLocation: "A-01-03-01",
        quantity: 60,
        status: "Available",
        parentStorage: "A-01-03",
        fifoDate: "2024-03-01",
        attribute1: "Batch-KB-2024",
        attribute2: "Zone-A",
        attribute3: "Premium",
        attribute4: "",
        attribute5: "",
        created: "2024-03-01 13:45:00",
        createdBy: "system",
        modified: "2024-03-15 15:30:00",
        modifiedBy: "admin"
      },
      {
        storageLocation: "C-03-02-01",
        quantity: 40,
        status: "Available",
        parentStorage: "C-03-02",
        fifoDate: "2024-03-07",
        attribute1: "Batch-KB-2024",
        attribute2: "Zone-C",
        attribute3: "Premium",
        attribute4: "",
        attribute5: "",
        created: "2024-03-07 09:20:00",
        createdBy: "system",
        modified: "2024-03-16 12:10:00",
        modifiedBy: "jsmith"
      }
    ],
    "ITEM-005": [
      {
        storageLocation: "B-02-02-01",
        quantity: 85,
        status: "Available",
        parentStorage: "B-02-02",
        fifoDate: "2024-03-05",
        attribute1: "Batch-CAM-001",
        attribute2: "Zone-B",
        attribute3: "Regular",
        attribute4: "",
        attribute5: "",
        created: "2024-03-05 10:00:00",
        createdBy: "system",
        modified: "2024-03-16 09:45:00",
        modifiedBy: "admin"
      },
      {
        storageLocation: "D-04-02-01",
        quantity: 65,
        status: "Available",
        parentStorage: "D-04-02",
        fifoDate: "2024-03-11",
        attribute1: "Batch-CAM-002",
        attribute2: "Zone-D",
        attribute3: "Regular",
        attribute4: "",
        attribute5: "",
        created: "2024-03-11 11:30:00",
        createdBy: "system",
        modified: "2024-03-15 14:55:00",
        modifiedBy: "jsmith"
      }
    ],
    "ITEM-006": [
      {
        storageLocation: "C-03-03-01",
        quantity: 120,
        status: "Available",
        parentStorage: "C-03-03",
        fifoDate: "2024-02-28",
        attribute1: "Batch-MAT-001",
        attribute2: "Zone-C",
        attribute3: "Bulk",
        attribute4: "",
        attribute5: "",
        created: "2024-02-28 08:15:00",
        createdBy: "system",
        modified: "2024-03-14 16:20:00",
        modifiedBy: "admin"
      }
    ],
    "ITEM-007": [
      {
        storageLocation: "E-05-01-01",
        quantity: 25,
        status: "Available",
        parentStorage: "E-05-01",
        fifoDate: "2024-03-02",
        attribute1: "Batch-ARM-001",
        attribute2: "Zone-E",
        attribute3: "Heavy",
        attribute4: "",
        attribute5: "",
        created: "2024-03-02 14:00:00",
        createdBy: "system",
        modified: "2024-03-15 11:30:00",
        modifiedBy: "jsmith"
      },
      {
        storageLocation: "F-06-01-01",
        quantity: 15,
        status: "Available",
        parentStorage: "F-06-01",
        fifoDate: "2024-03-09",
        attribute1: "Batch-ARM-001",
        attribute2: "Zone-F",
        attribute3: "Heavy",
        attribute4: "",
        attribute5: "",
        created: "2024-03-09 09:45:00",
        createdBy: "system",
        modified: "2024-03-16 13:15:00",
        modifiedBy: "admin"
      }
    ],
    "ITEM-008": [
      {
        storageLocation: "A-01-04-01",
        quantity: 70,
        status: "Available",
        parentStorage: "A-01-04",
        fifoDate: "2024-03-06",
        attribute1: "Batch-LAMP-001",
        attribute2: "Zone-A",
        attribute3: "Regular",
        attribute4: "",
        attribute5: "",
        created: "2024-03-06 12:30:00",
        createdBy: "system",
        modified: "2024-03-16 10:50:00",
        modifiedBy: "jsmith"
      },
      {
        storageLocation: "B-02-04-01",
        quantity: 55,
        status: "Available",
        parentStorage: "B-02-04",
        fifoDate: "2024-03-13",
        attribute1: "Batch-LAMP-002",
        attribute2: "Zone-B",
        attribute3: "Regular",
        attribute4: "",
        attribute5: "",
        created: "2024-03-13 15:10:00",
        createdBy: "system",
        modified: "2024-03-15 12:40:00",
        modifiedBy: "admin"
      }
    ],
    "ITEM-009": [
      {
        storageLocation: "A-01-01-03",
        quantity: 180,
        status: "Available",
        parentStorage: "A-01-01",
        fifoDate: "2024-03-15",
        attribute1: "Batch-CHG-001",
        attribute2: "Zone-A",
        attribute3: "Fast Moving",
        attribute4: "",
        attribute5: "",
        created: "2024-03-15 08:20:00",
        createdBy: "system",
        modified: "2024-03-16 15:05:00",
        modifiedBy: "jsmith"
      },
      {
        storageLocation: "C-03-01-02",
        quantity: 90,
        status: "Available",
        parentStorage: "C-03-01",
        fifoDate: "2024-03-16",
        attribute1: "Batch-CHG-002",
        attribute2: "Zone-C",
        attribute3: "Fast Moving",
        attribute4: "",
        attribute5: "",
        created: "2024-03-16 07:45:00",
        createdBy: "system",
        modified: "2024-03-16 14:30:00",
        modifiedBy: "admin"
      }
    ],
    "ITEM-010": [
      {
        storageLocation: "D-04-03-01",
        quantity: 300,
        status: "Available",
        parentStorage: "D-04-03",
        fifoDate: "2024-03-04",
        attribute1: "Batch-ORG-001",
        attribute2: "Zone-D",
        attribute3: "Bulk",
        attribute4: "",
        attribute5: "",
        created: "2024-03-04 11:15:00",
        createdBy: "system",
        modified: "2024-03-15 13:25:00",
        modifiedBy: "jsmith"
      }
    ],
    "ITEM-011": [
      {
        storageLocation: "E-05-03-01",
        quantity: 35,
        status: "Available",
        parentStorage: "E-05-03",
        fifoDate: "2024-02-25",
        attribute1: "Batch-STAND-001",
        attribute2: "Zone-E",
        attribute3: "Premium",
        attribute4: "Limited",
        attribute5: "",
        created: "2024-02-25 10:30:00",
        createdBy: "system",
        modified: "2024-03-14 09:20:00",
        modifiedBy: "admin"
      }
    ],
    "ITEM-012": [
      {
        storageLocation: "A-01-05-01",
        quantity: 50,
        status: "Available",
        parentStorage: "A-01-05",
        fifoDate: "2024-03-10",
        attribute1: "Batch-SSD-001",
        attribute2: "Zone-A",
        attribute3: "High Value",
        attribute4: "",
        attribute5: "",
        created: "2024-03-10 13:00:00",
        createdBy: "system",
        modified: "2024-03-16 11:10:00",
        modifiedBy: "jsmith"
      },
      {
        storageLocation: "B-02-05-01",
        quantity: 40,
        status: "Reserved",
        parentStorage: "B-02-05",
        fifoDate: "2024-03-12",
        attribute1: "Batch-SSD-001",
        attribute2: "Zone-B",
        attribute3: "High Value",
        attribute4: "",
        attribute5: "",
        created: "2024-03-12 09:30:00",
        createdBy: "system",
        modified: "2024-03-15 15:45:00",
        modifiedBy: "admin"
      }
    ],
    "ITEM-013": [
      {
        storageLocation: "C-03-04-01",
        quantity: 95,
        status: "Available",
        parentStorage: "C-03-04",
        fifoDate: "2024-03-08",
        attribute1: "Batch-GLASS-001",
        attribute2: "Zone-C",
        attribute3: "Regular",
        attribute4: "",
        attribute5: "",
        created: "2024-03-08 14:20:00",
        createdBy: "system",
        modified: "2024-03-16 10:05:00",
        modifiedBy: "jsmith"
      }
    ],
    "ITEM-014": [
      {
        storageLocation: "D-04-04-01",
        quantity: 110,
        status: "Available",
        parentStorage: "D-04-04",
        fifoDate: "2024-03-05",
        attribute1: "Batch-WRIST-001",
        attribute2: "Zone-D",
        attribute3: "Regular",
        attribute4: "",
        attribute5: "",
        created: "2024-03-05 11:50:00",
        createdBy: "system",
        modified: "2024-03-15 16:15:00",
        modifiedBy: "admin"
      }
    ],
    "ITEM-015": [
      {
        storageLocation: "E-05-04-01",
        quantity: 45,
        status: "Available",
        parentStorage: "E-05-04",
        fifoDate: "2024-03-07",
        attribute1: "Batch-PRIV-001",
        attribute2: "Zone-E",
        attribute3: "Regular",
        attribute4: "",
        attribute5: "",
        created: "2024-03-07 08:40:00",
        createdBy: "system",
        modified: "2024-03-16 12:55:00",
        modifiedBy: "jsmith"
      },
      {
        storageLocation: "F-06-02-01",
        quantity: 30,
        status: "Available",
        parentStorage: "F-06-02",
        fifoDate: "2024-03-11",
        attribute1: "Batch-PRIV-001",
        attribute2: "Zone-F",
        attribute3: "Regular",
        attribute4: "",
        attribute5: "",
        created: "2024-03-11 10:15:00",
        createdBy: "system",
        modified: "2024-03-14 14:40:00",
        modifiedBy: "admin"
      }
    ]
  };

  return inventoryMap[itemId] || [];
}
