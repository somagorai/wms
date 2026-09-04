// Shared mock data for groups, users, and authorizations

export type Authorization = {
  type: "Screens" | "Functions";
  items: string[];
};

export type Group = {
  id: string;
  name: string;
  description: string;
  authorizations: Authorization[];
  created: string;
  createdBy: string;
  modified: string;
  modifiedBy: string;
};

export type UserData = {
  username: string;
  firstName: string;
  lastName: string;
  status: string;
  email: string;
  localization: string;
  theme: string;
  created: string;
  createdBy: string;
  modified: string;
  modifiedBy: string;
  groups?: string[]; // Array of group names
};

// Mock groups with authorizations
export const mockGroups: Group[] = [
  {
    id: "1",
    name: "Administrators",
    description: "Full system access",
    authorizations: [
      {
        type: "Screens",
        items: [
          "Executive Dashboard",
          "Operations Dashboard",
          "Work List",
          "Items",
          "Storage Locations",
          "Inventory",
          "User Management",
          "Group Management",
          "Parameter Management",
          "Property Visibility",
          "Health Dashboard",
        ],
      },
      {
        type: "Functions",
        items: [
          "User - Add",
          "User - Edit",
          "User - Delete",
          "Storage Location - Add",
          "Storage Location - Edit",
          "Storage Location - Delete",
          "Item - Add",
          "Item - Edit",
          "Item - Delete",
          "Inventory - Change Quantity",
          "Work List - Assign",
          "Work List - Cancel",
        ],
      },
    ],
    created: "2023-01-10 08:00",
    createdBy: "system",
    modified: "2024-02-15 14:30",
    modifiedBy: "admin",
  },
  {
    id: "2",
    name: "Warehouse Managers",
    description: "Manage warehouse operations",
    authorizations: [
      {
        type: "Screens",
        items: [
          "Operations Dashboard",
          "Work List",
          "Items",
          "Storage Locations",
          "Inventory",
          "Replenishment",
        ],
      },
      {
        type: "Functions",
        items: [
          "Item - Add",
          "Item - Edit",
          "Storage Location - Add",
          "Storage Location - Edit",
          "Work List - Assign",
          "Inventory - Change Quantity",
        ],
      },
    ],
    created: "2023-01-10 08:00",
    createdBy: "system",
    modified: "2024-01-20 10:15",
    modifiedBy: "admin",
  },
  {
    id: "3",
    name: "Warehouse Associates",
    description: "Execute warehouse tasks",
    authorizations: [
      {
        type: "Screens",
        items: [
          "Work List",
          "Items",
          "Storage Locations",
          "Inventory",
        ],
      },
      {
        type: "Functions",
        items: [
          "Work List - Execute",
        ],
      },
    ],
    created: "2023-01-10 08:00",
    createdBy: "system",
    modified: "2023-12-05 16:45",
    modifiedBy: "admin",
  },
  {
    id: "4",
    name: "Quality Control",
    description: "Quality assurance and control",
    authorizations: [
      {
        type: "Screens",
        items: [
          "Operations Dashboard",
          "Items",
          "Inventory",
        ],
      },
      {
        type: "Functions",
        items: [
          "Item - Edit",
          "Inventory - Change Quantity",
        ],
      },
    ],
    created: "2023-01-12 09:30",
    createdBy: "admin",
    modified: "2024-01-15 11:20",
    modifiedBy: "admin",
  },
  {
    id: "5",
    name: "Inventory Managers",
    description: "Manage inventory levels",
    authorizations: [
      {
        type: "Screens",
        items: [
          "Operations Dashboard",
          "Items",
          "Storage Locations",
          "Inventory",
          "Replenishment",
        ],
      },
      {
        type: "Functions",
        items: [
          "Item - Add",
          "Item - Edit",
          "Storage Location - Edit",
          "Inventory - Change Quantity",
          "Replenishment - Execute",
        ],
      },
    ],
    created: "2023-01-12 09:30",
    createdBy: "admin",
    modified: "2024-02-28 09:00",
    modifiedBy: "admin",
  },
  {
    id: "6",
    name: "Supervisors",
    description: "Supervise operations",
    authorizations: [
      {
        type: "Screens",
        items: [
          "Operations Dashboard",
          "Work List",
          "Team",
        ],
      },
      {
        type: "Functions",
        items: [
          "Work List - Assign",
        ],
      },
    ],
    created: "2023-02-01 10:00",
    createdBy: "admin",
    modified: "2023-11-10 15:30",
    modifiedBy: "admin",
  },
  {
    id: "7",
    name: "Data Analysts",
    description: "Access to analytics and reporting",
    authorizations: [
      {
        type: "Screens",
        items: [
          "Executive Dashboard",
          "Operations Dashboard",
        ],
      },
      {
        type: "Functions",
        items: [
          "Reports - Export",
        ],
      },
    ],
    created: "2023-03-15 11:00",
    createdBy: "admin",
    modified: "2024-03-01 13:45",
    modifiedBy: "admin",
  },
  {
    id: "8",
    name: "System Users",
    description: "Basic system access",
    authorizations: [
      {
        type: "Screens",
        items: [
          "Items",
          "Inventory",
        ],
      },
      {
        type: "Functions",
        items: [],
      },
    ],
    created: "2023-01-10 08:00",
    createdBy: "system",
    modified: "2023-08-20 14:00",
    modifiedBy: "admin",
  },
];

// Mock user data with group assignments
export const generateUsers = (): UserData[] => {
  const users: UserData[] = [
    {
      username: "jdoe",
      firstName: "John",
      lastName: "Doe",
      status: "Active",
      email: "john.doe@warehouse.com",
      localization: "en-US",
      theme: "Dark",
      created: "2023-01-15 08:30",
      createdBy: "admin",
      modified: "2024-03-10 14:22",
      modifiedBy: "jdoe",
      groups: ["Administrators", "Warehouse Managers"],
    },
    {
      username: "asmith",
      firstName: "Alice",
      lastName: "Smith",
      status: "Active",
      email: "alice.smith@warehouse.com",
      localization: "en-US",
      theme: "Light",
      created: "2023-02-20 09:15",
      createdBy: "admin",
      modified: "2024-03-12 11:45",
      modifiedBy: "asmith",
      groups: ["Warehouse Managers", "Supervisors"],
    },
    {
      username: "bwilliams",
      firstName: "Bob",
      lastName: "Williams",
      status: "Inactive",
      email: "bob.williams@warehouse.com",
      localization: "en-GB",
      theme: "Dark",
      created: "2023-03-10 10:00",
      createdBy: "admin",
      modified: "2024-01-20 16:30",
      modifiedBy: "admin",
      groups: ["Warehouse Associates"],
    },
    {
      username: "mjohnson",
      firstName: "Mary",
      lastName: "Johnson",
      status: "Active",
      email: "mary.johnson@warehouse.com",
      localization: "en-US",
      theme: "Light",
      created: "2023-04-05 13:20",
      createdBy: "admin",
      modified: "2024-03-15 09:10",
      modifiedBy: "mjohnson",
      groups: ["Quality Control", "Inventory Managers"],
    },
    {
      username: "dgarcia",
      firstName: "David",
      lastName: "Garcia",
      status: "Active",
      email: "david.garcia@warehouse.com",
      localization: "es-ES",
      theme: "Dark",
      created: "2023-05-12 14:45",
      createdBy: "admin",
      modified: "2024-03-14 13:55",
      modifiedBy: "dgarcia",
      groups: ["Warehouse Associates"],
    },
    {
      username: "lmartinez",
      firstName: "Lisa",
      lastName: "Martinez",
      status: "Locked",
      email: "lisa.martinez@warehouse.com",
      localization: "en-US",
      theme: "Light",
      created: "2023-06-18 08:00",
      createdBy: "admin",
      modified: "2024-02-28 10:20",
      modifiedBy: "admin",
      groups: ["System Users"],
    },
    {
      username: "tanderson",
      firstName: "Thomas",
      lastName: "Anderson",
      status: "Active",
      email: "thomas.anderson@warehouse.com",
      localization: "en-US",
      theme: "Dark",
      created: "2023-07-22 11:30",
      createdBy: "jdoe",
      modified: "2024-03-16 15:40",
      modifiedBy: "tanderson",
      groups: ["Supervisors", "Warehouse Associates"],
    },
    {
      username: "sjones",
      firstName: "Sarah",
      lastName: "Jones",
      status: "Active",
      email: "sarah.jones@warehouse.com",
      localization: "en-AU",
      theme: "Light",
      created: "2023-08-09 09:45",
      createdBy: "jdoe",
      modified: "2024-03-11 12:30",
      modifiedBy: "sjones",
      groups: ["Data Analysts"],
    },
    {
      username: "rwilson",
      firstName: "Robert",
      lastName: "Wilson",
      status: "Inactive",
      email: "robert.wilson@warehouse.com",
      localization: "en-US",
      theme: "Dark",
      created: "2023-09-14 10:15",
      createdBy: "admin",
      modified: "2024-01-05 08:45",
      modifiedBy: "admin",
      groups: ["Warehouse Associates"],
    },
    {
      username: "ebrown",
      firstName: "Emma",
      lastName: "Brown",
      status: "Active",
      email: "emma.brown@warehouse.com",
      localization: "en-CA",
      theme: "Light",
      created: "2023-10-25 14:00",
      createdBy: "jdoe",
      modified: "2024-03-17 16:20",
      modifiedBy: "ebrown",
      groups: ["Inventory Managers"],
    },
    {
      username: "mlee",
      firstName: "Michael",
      lastName: "Lee",
      status: "Active",
      email: "michael.lee@warehouse.com",
      localization: "ko-KR",
      theme: "Dark",
      created: "2023-11-30 08:30",
      createdBy: "admin",
      modified: "2024-03-13 11:15",
      modifiedBy: "mlee",
      groups: ["Warehouse Managers"],
    },
    {
      username: "kmoore",
      firstName: "Karen",
      lastName: "Moore",
      status: "Active",
      email: "karen.moore@warehouse.com",
      localization: "en-US",
      theme: "Dark",
      created: "2023-12-08 13:45",
      createdBy: "jdoe",
      modified: "2024-03-18 10:05",
      modifiedBy: "kmoore",
      groups: ["Quality Control"],
    },
    {
      username: "jwhite",
      firstName: "James",
      lastName: "White",
      status: "Locked",
      email: "james.white@warehouse.com",
      localization: "en-US",
      theme: "Light",
      created: "2024-01-16 09:00",
      createdBy: "admin",
      modified: "2024-03-01 14:50",
      modifiedBy: "admin",
      groups: ["Warehouse Associates"],
    },
    {
      username: "ndavis",
      firstName: "Nancy",
      lastName: "Davis",
      status: "Active",
      email: "nancy.davis@warehouse.com",
      localization: "fr-FR",
      theme: "Light",
      created: "2024-02-10 10:30",
      createdBy: "jdoe",
      modified: "2024-03-16 09:35",
      modifiedBy: "ndavis",
      groups: ["Data Analysts"],
    },
    {
      username: "ctaylor",
      firstName: "Charles",
      lastName: "Taylor",
      status: "Active",
      email: "charles.taylor@warehouse.com",
      localization: "en-US",
      theme: "Dark",
      created: "2024-03-01 11:15",
      createdBy: "admin",
      modified: "2024-03-17 13:25",
      modifiedBy: "ctaylor",
      groups: ["Administrators"],
    },
  ];

  return users;
};

export const mockUserData = generateUsers();

// Helper to get users for a specific group
export const getUsersByGroup = (groupName: string): UserData[] => {
  return mockUserData.filter(user => user.groups?.includes(groupName));
};

// Helper to get all authorizations (unique list)
export const getAllAuthorizations = (): string[] => {
  const authSet = new Set<string>();
  mockGroups.forEach(group => {
    group.authorizations.forEach(auth => {
      auth.items.forEach(item => authSet.add(item));
    });
  });
  return Array.from(authSet).sort();
};
