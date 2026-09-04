import { createContext, useContext, ReactNode, useState, useEffect } from "react";

// Layout Context v3.0 - manages global layout state including sidebar, AI panel, and column visibility
// CACHE BUST: 2024-03-18-v3
export type PinnedItem = {
  id: string;
  title: string;
  path?: string;
  icon?: string;
  children?: {
    id: string;
    title: string;
    path?: string;
    icon?: string;
    tertiaryOptions?: {
      id: string;
      title: "string";
      path?: string;
      icon?: string;
    }[];
  }[];
};

type LayoutContextType = {
  isSidebarExpanded: boolean;
  setIsSidebarExpanded: (expanded: boolean) => void;
  isFullscreen: boolean;
  setIsFullscreen: (fullscreen: boolean) => void;
  showAI: boolean;
  setShowAI: (show: boolean) => void;
  showWorkstations: boolean;
  setShowWorkstations: (show: boolean) => void;
  assignedWorkstation: string | null;
  setAssignedWorkstation: (workstation: string | null) => void;
  pinnedItems: PinnedItem[];
  togglePinItem: (item: PinnedItem) => void;
  isPinned: (id: string) => boolean;
  initializePinnedItems: (username: string, role: string) => void; // New method
  reorderPinnedItems: (dragIndex: number, hoverIndex: number) => void;
  workListHiddenColumns: string[];
  setWorkListHiddenColumns: (columns: string[]) => void;
  workListPinnedColumns: string[];
  setWorkListPinnedColumns: (columns: string[]) => void;
  storageLocationsHiddenColumns: string[];
  setStorageLocationsHiddenColumns: (columns: string[]) => void;
  storageLocationsPinnedColumns: string[];
  setStorageLocationsPinnedColumns: (columns: string[]) => void;
  storageLocationAllocationHiddenColumns: string[];
  setStorageLocationAllocationHiddenColumns: (columns: string[]) => void;
  storageLocationAllocationPinnedColumns: string[];
  setStorageLocationAllocationPinnedColumns: (columns: string[]) => void;
  itemsHiddenColumns: string[];
  setItemsHiddenColumns: (columns: string[]) => void;
  itemsPinnedColumns: string[];
  setItemsPinnedColumns: (columns: string[]) => void;
  inventoryHiddenColumns: string[];
  setInventoryHiddenColumns: (columns: string[]) => void;
  inventoryPinnedColumns: string[];
  setInventoryPinnedColumns: (columns: string[]) => void;
  userManagementHiddenColumns: string[];
  setUserManagementHiddenColumns: (columns: string[]) => void;
  userManagementPinnedColumns: string[];
  setUserManagementPinnedColumns: (columns: string[]) => void;
  groupManagementHiddenColumns: string[];
  setGroupManagementHiddenColumns: (columns: string[]) => void;
  groupManagementPinnedColumns: string[];
  setGroupManagementPinnedColumns: (columns: string[]) => void;
};

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ 
  children
}: { 
  children: ReactNode; 
}) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [showWorkstations, setShowWorkstations] = useState(false);
  const [assignedWorkstation, setAssignedWorkstation] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<string>("");
  
  // Helper function to get default pinned items based on role
  const getDefaultPinnedItems = (role: string): PinnedItem[] => {
    // SIMPLIFIED: All users get the same pinned items - no role restrictions
    const defaultItems: PinnedItem[] = [
      { id: "dashboards-operations-dashboard", title: "Operations Dashboard", icon: "LayoutDashboard", path: "/app/dashboard" },
      { id: "dashboards-executive-dashboard", title: "Executive Dashboard", icon: "TrendingUp", path: "/app/executive" },
      { id: "dashboards-health-dashboard", title: "Monitoring Dashboard", icon: "Activity", path: "/app/health" },
      { id: "dashboards-mhe-dashboard", title: "MHE Dashboard", icon: "GearArrow", path: "/app/mhe" },
      {
        id: "workstation-operations",
        title: "Workstation Operations",
        icon: "Monitor",
        children: [
          { id: "workstation-replenishment", title: "Replenishment", icon: "RefreshCw", path: "/app/replenishment" },
          { id: "workstation-pick", title: "Pick", icon: "Package", path: "/app/pick" },
          { id: "workstation-dewrap", title: "De-Wrap", icon: "Package", path: "/app/dewrap" },
          { id: "workstation-mhe-control-panel", title: "MHE Control Panel", icon: "Power", path: "/app/mhe-control-panel" },
        ]
      },
      { 
        id: "operations", 
        title: "Operations", 
        icon: "Settings", 
        children: [
          { id: "operations-items", title: "Items", icon: "Package", path: "/app/items" },
          { id: "operations-locations", title: "Locations", icon: "MapPin", path: "/app/storage-locations" },
          { id: "operations-containers", title: "Containers", icon: "Box", path: "/app/containers" },
          {
            id: "operations-data-analysis", 
            title: "Data Analysis", 
            icon: "BarChart2",
            tertiaryOptions: [
              { id: "operations-data-analysis-logs", title: "Logs", icon: "ScrollText", path: "/app/logs" },
              { id: "operations-data-analysis-scan-statistics", title: "Scan Statistics", icon: "Activity" },
              { id: "operations-data-analysis-scan-log", title: "Scan Log", icon: "ScanLine" },
              { id: "operations-data-analysis-ledger", title: "Ledger", icon: "BookOpen" },
              { id: "operations-data-analysis-queues", title: "Queues", icon: "Layers" },
              { id: "operations-data-analysis-port-activity", title: "Port Activity", icon: "Wifi" },
            ]
          },
          { 
            id: "operations-work", 
            title: "Work", 
            icon: "Briefcase",
            tertiaryOptions: [
              { id: "operations-work-work-list", title: "Work List", icon: "ListTodo", path: "/app/worklist" },
              { id: "operations-work-pick-lists", title: "Pick Lists", icon: "ClipboardList", path: "/app/worklist?type=Pick" },
              { id: "operations-work-replenishment-lists", title: "Replenishment Lists", icon: "RefreshCw", path: "/app/worklist?type=Replenishment" },
              { id: "operations-work-cycle-counts", title: "Cycle Counts", icon: "Search", path: "/app/worklist?type=Cycle Count" },
              { id: "operations-work-inspection-lists", title: "Inspection Lists", icon: "PackageX", path: "/app/worklist?type=Inspection" },
              { id: "operations-work-work-batch", title: "Work Batch", icon: "Layers" },
              { id: "operations-work-planner", title: "Planner", icon: "Calendar" },
              { id: "operations-work-scheduler", title: "Scheduler", icon: "Clock" },
            ]
          },
        ]
      },
    ];

    return defaultItems;
  };

  // Initialize pinned items based on current user in localStorage
  const [pinnedItems, setPinnedItems] = useState<PinnedItem[]>(() => {
    // Try to get current user from localStorage
    const currentUserData = localStorage.getItem("currentUser");
    if (!currentUserData) {
      // No user logged in, return empty array
      return [];
    }
    
    try {
      const userData = JSON.parse(currentUserData);
      const username = userData.username;
      const role = userData.role;
      
      const storageKey = `pinnedItems_${username}`;
      const versionKey = `pinnedItemsVersion_${username}`;
      const saved = localStorage.getItem(storageKey);
      const version = localStorage.getItem(versionKey);
      const currentVersion = "2.9.0"; // Updated version for De-Wrap addition
      
      // Validate that saved items have paths
      let needsReset = false;
      if (saved && version === currentVersion) {
        try {
          const items = JSON.parse(saved);
          // Check if any top-level dashboard items are missing paths
          const hasMissingPaths = items.some((item: PinnedItem) => 
            item.id.startsWith('dashboards-') && !item.path
          );
          if (hasMissingPaths) {
            needsReset = true;
          }
        } catch {
          needsReset = true;
        }
      }
      
      if (saved && version === currentVersion && !needsReset) {
        const items = JSON.parse(saved);
        // Migrate old paths to new /app paths
        return items.map((item: PinnedItem) => ({
          ...item,
          path: item.path && !item.path.startsWith('/app') && item.path.startsWith('/') 
            ? `/app${item.path}` 
            : item.path,
          children: item.children?.map(child => ({
            ...child,
            path: child.path && !child.path.startsWith('/app') && child.path.startsWith('/') 
              ? `/app${child.path}` 
              : child.path,
            icon: child.icon, // Add icon to children
            tertiaryOptions: child.tertiaryOptions?.map(tertiary => ({
              ...tertiary,
              path: tertiary.path && !tertiary.path.startsWith('/app') && tertiary.path.startsWith('/') 
                ? `/app${tertiary.path}` 
                : tertiary.path,
              icon: tertiary.icon, // Add icon to tertiaryOptions
            })),
          })),
        }));
      } else {
        // Set new version and return defaults
        localStorage.setItem(versionKey, currentVersion);
        const defaultItems = getDefaultPinnedItems(role);
        localStorage.setItem(storageKey, JSON.stringify(defaultItems));
        return defaultItems;
      }
    } catch (error) {
      console.error("Error loading pinned items:", error);
      return [];
    }
  });

  // Initialize pinned items based on user
  const initializePinnedItems = (username: string, role: string) => {
    setCurrentUser(username);
    const storageKey = `pinnedItems_${username}`;
    const versionKey = `pinnedItemsVersion_${username}`;
    
    // FORCE CLEAR - Clear existing localStorage to ensure fresh start
    localStorage.removeItem(storageKey);
    localStorage.removeItem(versionKey);
    
    const currentVersion = "2.9.0"; // Bumped version for De-Wrap addition
    
    // Set new version
    localStorage.setItem(versionKey, currentVersion);
    // Default pinned items based on role
    const defaultItems = getDefaultPinnedItems(role);
    
    setPinnedItems(defaultItems);
    localStorage.setItem(storageKey, JSON.stringify(defaultItems));
  };

  // Save to localStorage whenever pinnedItems changes (user-specific)
  useEffect(() => {
    if (currentUser) {
      const storageKey = `pinnedItems_${currentUser}`;
      localStorage.setItem(storageKey, JSON.stringify(pinnedItems));
    }
  }, [pinnedItems, currentUser]);

  const togglePinItem = (item: PinnedItem) => {
    setPinnedItems((prev) => {
      const exists = prev.find((p) => p.id === item.id);
      if (exists) {
        return prev.filter((p) => p.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const isPinned = (id: string) => {
    return pinnedItems.some((item) => item.id === id);
  };

  const reorderPinnedItems = (dragIndex: number, hoverIndex: number) => {
    setPinnedItems((prev) => {
      const newItems = [...prev];
      const [draggedItem] = newItems.splice(dragIndex, 1);
      newItems.splice(hoverIndex, 0, draggedItem);
      return newItems;
    });
  };

  const [workListHiddenColumns, setWorkListHiddenColumns] = useState<string[]>(() => {
    // Load from localStorage on init
    try {
      const saved = localStorage.getItem("workListHiddenColumns");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error("Error loading workListHiddenColumns from localStorage:", error);
    }
    // Default hidden columns
    return [];
  });

  // Save to localStorage whenever workListHiddenColumns changes
  useEffect(() => {
    try {
      localStorage.setItem("workListHiddenColumns", JSON.stringify(workListHiddenColumns));
    } catch (error) {
      console.error("Error saving workListHiddenColumns to localStorage:", error);
    }
  }, [workListHiddenColumns]);

  const [workListPinnedColumns, setWorkListPinnedColumns] = useState<string[]>(() => {
    // Load from localStorage on init
    try {
      const saved = localStorage.getItem("workListPinnedColumns");
      if (saved) {
        const parsed = JSON.parse(saved);
        // If empty array is saved, use defaults instead
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (error) {
      console.error("Error loading workListPinnedColumns from localStorage:", error);
    }
    // Default pinned columns - matches Property Visibility defaults
    return ['workList'];
  });

  // Save to localStorage whenever workListPinnedColumns changes
  useEffect(() => {
    try {
      localStorage.setItem("workListPinnedColumns", JSON.stringify(workListPinnedColumns));
    } catch (error) {
      console.error("Error saving workListPinnedColumns to localStorage:", error);
    }
  }, [workListPinnedColumns]);

  const [storageLocationsHiddenColumns, setStorageLocationsHiddenColumns] = useState<string[]>(() => {
    // Load from localStorage on init
    try {
      const saved = localStorage.getItem("storageLocationsHiddenColumns");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error("Error loading storageLocationsHiddenColumns from localStorage:", error);
    }
    // Default hidden columns
    return [];
  });

  // Save to localStorage whenever storageLocationsHiddenColumns changes
  useEffect(() => {
    try {
      localStorage.setItem("storageLocationsHiddenColumns", JSON.stringify(storageLocationsHiddenColumns));
    } catch (error) {
      console.error("Error saving storageLocationsHiddenColumns to localStorage:", error);
    }
  }, [storageLocationsHiddenColumns]);

  const [storageLocationsPinnedColumns, setStorageLocationsPinnedColumns] = useState<string[]>(() => {
    // Load from localStorage on init
    try {
      const saved = localStorage.getItem("storageLocationsPinnedColumns");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error("Error loading storageLocationsPinnedColumns from localStorage:", error);
    }
    // Default pinned columns - "name" is pinned by default
    return ["name"];
  });

  // Save to localStorage whenever storageLocationsPinnedColumns changes
  useEffect(() => {
    try {
      localStorage.setItem("storageLocationsPinnedColumns", JSON.stringify(storageLocationsPinnedColumns));
    } catch (error) {
      console.error("Error saving storageLocationsPinnedColumns to localStorage:", error);
    }
  }, [storageLocationsPinnedColumns]);

  const [storageLocationAllocationHiddenColumns, setStorageLocationAllocationHiddenColumns] = useState<string[]>(() => {
    // Load from localStorage on init
    try {
      const saved = localStorage.getItem("storageLocationAllocationHiddenColumns");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error("Error loading storageLocationAllocationHiddenColumns from localStorage:", error);
    }
    // Default hidden columns
    return [];
  });

  // Save to localStorage whenever storageLocationAllocationHiddenColumns changes
  useEffect(() => {
    try {
      localStorage.setItem("storageLocationAllocationHiddenColumns", JSON.stringify(storageLocationAllocationHiddenColumns));
    } catch (error) {
      console.error("Error saving storageLocationAllocationHiddenColumns to localStorage:", error);
    }
  }, [storageLocationAllocationHiddenColumns]);

  const [storageLocationAllocationPinnedColumns, setStorageLocationAllocationPinnedColumns] = useState<string[]>(() => {
    // Load from localStorage on init
    try {
      const saved = localStorage.getItem("storageLocationAllocationPinnedColumns");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error("Error loading storageLocationAllocationPinnedColumns from localStorage:", error);
    }
    // Default pinned columns
    return [];
  });

  // Save to localStorage whenever storageLocationAllocationPinnedColumns changes
  useEffect(() => {
    try {
      localStorage.setItem("storageLocationAllocationPinnedColumns", JSON.stringify(storageLocationAllocationPinnedColumns));
    } catch (error) {
      console.error("Error saving storageLocationAllocationPinnedColumns to localStorage:", error);
    }
  }, [storageLocationAllocationPinnedColumns]);

  const [itemsHiddenColumns, setItemsHiddenColumns] = useState<string[]>(() => {
    // Load from localStorage on init
    try {
      const saved = localStorage.getItem("itemsHiddenColumns");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error("Error loading itemsHiddenColumns from localStorage:", error);
    }
    // Default hidden columns
    return [];
  });

  // Save to localStorage whenever itemsHiddenColumns changes
  useEffect(() => {
    try {
      localStorage.setItem("itemsHiddenColumns", JSON.stringify(itemsHiddenColumns));
    } catch (error) {
      console.error("Error saving itemsHiddenColumns to localStorage:", error);
    }
  }, [itemsHiddenColumns]);

  const [itemsPinnedColumns, setItemsPinnedColumns] = useState<string[]>(() => {
    // Load from localStorage on init
    try {
      const saved = localStorage.getItem("itemsPinnedColumns");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error("Error loading itemsPinnedColumns from localStorage:", error);
    }
    // Default pinned columns - Item column is pinned by default
    return ["item"];
  });

  // Save to localStorage whenever itemsPinnedColumns changes
  useEffect(() => {
    try {
      localStorage.setItem("itemsPinnedColumns", JSON.stringify(itemsPinnedColumns));
    } catch (error) {
      console.error("Error saving itemsPinnedColumns to localStorage:", error);
    }
  }, [itemsPinnedColumns]);

  const [inventoryHiddenColumns, setInventoryHiddenColumns] = useState<string[]>(() => {
    // Load from localStorage on init
    try {
      const saved = localStorage.getItem("inventoryHiddenColumns");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error("Error loading inventoryHiddenColumns from localStorage:", error);
    }
    // Default hidden columns
    return [];
  });

  // Save to localStorage whenever inventoryHiddenColumns changes
  useEffect(() => {
    try {
      localStorage.setItem("inventoryHiddenColumns", JSON.stringify(inventoryHiddenColumns));
    } catch (error) {
      console.error("Error saving inventoryHiddenColumns to localStorage:", error);
    }
  }, [inventoryHiddenColumns]);

  const [inventoryPinnedColumns, setInventoryPinnedColumns] = useState<string[]>(() => {
    // Load from localStorage on init
    try {
      const saved = localStorage.getItem("inventoryPinnedColumns");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error("Error loading inventoryPinnedColumns from localStorage:", error);
    }
    // Default pinned columns
    return [];
  });

  // Save to localStorage whenever inventoryPinnedColumns changes
  useEffect(() => {
    try {
      localStorage.setItem("inventoryPinnedColumns", JSON.stringify(inventoryPinnedColumns));
    } catch (error) {
      console.error("Error saving inventoryPinnedColumns to localStorage:", error);
    }
  }, [inventoryPinnedColumns]);

  const [userManagementHiddenColumns, setUserManagementHiddenColumns] = useState<string[]>(() => {
    // Load from localStorage on init
    try {
      const saved = localStorage.getItem("userManagementHiddenColumns");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error("Error loading userManagementHiddenColumns from localStorage:", error);
    }
    // Default hidden columns
    return [];
  });

  // Save to localStorage whenever userManagementHiddenColumns changes
  useEffect(() => {
    try {
      localStorage.setItem("userManagementHiddenColumns", JSON.stringify(userManagementHiddenColumns));
    } catch (error) {
      console.error("Error saving userManagementHiddenColumns to localStorage:", error);
    }
  }, [userManagementHiddenColumns]);

  const [userManagementPinnedColumns, setUserManagementPinnedColumns] = useState<string[]>(() => {
    // Load from localStorage on init
    try {
      const saved = localStorage.getItem("userManagementPinnedColumns");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error("Error loading userManagementPinnedColumns from localStorage:", error);
    }
    // Default pinned columns
    return ["username", "firstName", "lastName"];
  });

  // Save to localStorage whenever userManagementPinnedColumns changes
  useEffect(() => {
    try {
      localStorage.setItem("userManagementPinnedColumns", JSON.stringify(userManagementPinnedColumns));
    } catch (error) {
      console.error("Error saving userManagementPinnedColumns to localStorage:", error);
    }
  }, [userManagementPinnedColumns]);

  const [groupManagementHiddenColumns, setGroupManagementHiddenColumns] = useState<string[]>(() => {
    // Load from localStorage on init
    try {
      const saved = localStorage.getItem("groupManagementHiddenColumns");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error("Error loading groupManagementHiddenColumns from localStorage:", error);
    }
    // Default hidden columns
    return [];
  });

  // Save to localStorage whenever groupManagementHiddenColumns changes
  useEffect(() => {
    try {
      localStorage.setItem("groupManagementHiddenColumns", JSON.stringify(groupManagementHiddenColumns));
    } catch (error) {
      console.error("Error saving groupManagementHiddenColumns to localStorage:", error);
    }
  }, [groupManagementHiddenColumns]);

  const [groupManagementPinnedColumns, setGroupManagementPinnedColumns] = useState<string[]>(() => {
    // Load from localStorage on init
    try {
      const saved = localStorage.getItem("groupManagementPinnedColumns");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error("Error loading groupManagementPinnedColumns from localStorage:", error);
    }
    // Default pinned columns
    return [];
  });

  // Save to localStorage whenever groupManagementPinnedColumns changes
  useEffect(() => {
    try {
      localStorage.setItem("groupManagementPinnedColumns", JSON.stringify(groupManagementPinnedColumns));
    } catch (error) {
      console.error("Error saving groupManagementPinnedColumns to localStorage:", error);
    }
  }, [groupManagementPinnedColumns]);

  return (
    <LayoutContext.Provider value={{
      isSidebarExpanded,
      setIsSidebarExpanded,
      isFullscreen,
      setIsFullscreen,
      showAI,
      setShowAI,
      showWorkstations,
      setShowWorkstations,
      assignedWorkstation,
      setAssignedWorkstation,
      pinnedItems,
      togglePinItem,
      isPinned,
      initializePinnedItems, // Add the new method
      reorderPinnedItems,
      workListHiddenColumns,
      setWorkListHiddenColumns,
      workListPinnedColumns,
      setWorkListPinnedColumns,
      storageLocationsHiddenColumns,
      setStorageLocationsHiddenColumns,
      storageLocationsPinnedColumns,
      setStorageLocationsPinnedColumns,
      storageLocationAllocationHiddenColumns,
      setStorageLocationAllocationHiddenColumns,
      storageLocationAllocationPinnedColumns,
      setStorageLocationAllocationPinnedColumns,
      itemsHiddenColumns,
      setItemsHiddenColumns,
      itemsPinnedColumns,
      setItemsPinnedColumns,
      inventoryHiddenColumns,
      setInventoryHiddenColumns,
      inventoryPinnedColumns,
      setInventoryPinnedColumns,
      userManagementHiddenColumns,
      setUserManagementHiddenColumns,
      userManagementPinnedColumns,
      setUserManagementPinnedColumns,
      groupManagementHiddenColumns,
      setGroupManagementHiddenColumns,
      groupManagementPinnedColumns,
      setGroupManagementPinnedColumns
    }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
}

// Export the context type for external use
export type { LayoutContextType };