import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useLayout } from "../contexts/LayoutContext";
import { UserDetailPanel } from "../components/UserDetailPanel";
import {
  Search,
  Filter,
  Download,
  Plus,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Check,
  User,
  CheckCircle2,
  XCircle,
  Clock,
  Sun,
  Moon,
  Globe,
  X,
  Eye,
  EyeOff,
  Trash2,
  Home,
} from "lucide-react";
import { mockGroups, getAllAuthorizations, type Authorization, type Group as GroupType } from "../data/mockGroupsAndUsers";

type UserData = {
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
};

type SortField = keyof UserData;
type SortDirection = "asc" | "desc";

// Mock user data
const generateUsers = (): UserData[] => {
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
    },
  ];

  return users;
};

const mockUserData = generateUsers();

// User groups for filter
const userGroups = [
  "Administrators",
  "Warehouse Managers",
  "Warehouse Associates",
  "Quality Control",
  "Inventory Managers",
  "Supervisors",
  "Data Analysts",
  "System Users",
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Active":
      return <CheckCircle2 size={16} className="text-green-500" />;
    case "Inactive":
      return <XCircle size={16} className="text-zinc-500" />;
    case "Locked":
      return <Clock size={16} className="text-red-500" />;
    default:
      return <CheckCircle2 size={16} className="text-zinc-500" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "text-green-500";
    case "Inactive":
      return "text-zinc-500";
    case "Locked":
      return "text-red-500";
    default:
      return "text-zinc-500";
  }
};

export function UserManagement() {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("modified");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set());
  const [groupSearch, setGroupSearch] = useState("");
  const [selectedAuthorizations, setSelectedAuthorizations] = useState<Set<string>>(new Set());
  const [authorizationSearch, setAuthorizationSearch] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<'groups' | 'authorizations' | null>(null);

  // Detail panel state
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState<"details" | "groups" | "actions">("details");
  
  // Form state
  const [formUsername, setFormUsername] = useState("");
  const [formFirstName, setFormFirstName] = useState("");
  const [formLastName, setFormLastName] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formConfirmPassword, setFormConfirmPassword] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formLocalization, setFormLocalization] = useState("en-US");
  const [formTheme, setFormTheme] = useState<"Dark" | "Light">("Dark");
  const [formStatus, setFormStatus] = useState(true); // true = Active/Enabled
  
  // Groups tab state
  const [selectedUserGroups, setSelectedUserGroups] = useState<Set<string>>(new Set());
  const [groupsSearch, setGroupsSearch] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Delete state
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedForDeletion, setSelectedForDeletion] = useState<Set<string>>(new Set());
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [usersToDelete, setUsersToDelete] = useState<UserData[]>([]);

  // Ref for username input focus
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const selectAllCheckboxRef = useRef<HTMLInputElement>(null);

  // Get column visibility settings from layout context
  const { userManagementHiddenColumns, userManagementPinnedColumns } = useLayout() as any;

  // Check for URL parameter to trigger add user panel
  useEffect(() => {
    const shouldAdd = searchParams.get('add');
    if (shouldAdd === 'true' && !showDetailPanel) {
      handleAddUser();
    }
    
    // Check for authorization filter from URL
    const authorizationParam = searchParams.get('authorization');
    if (authorizationParam) {
      setSelectedAuthorizations(new Set([authorizationParam]));
      setShowFilterPanel(true);
    }
  }, [searchParams]);

  // Focus username field when add panel opens
  useEffect(() => {
    if (showDetailPanel && isAddMode && formUsername === "") {
      // Give the panel time to render
      const timer = setTimeout(() => {
        // The UserDetailPanel should expose its own ref for the username input
        // For now, we'll need to update UserDetailPanel to support this
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [showDetailPanel, isAddMode]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const toggleGroup = (group: string) => {
    const newGroups = new Set(selectedGroups);
    if (newGroups.has(group)) {
      newGroups.delete(group);
    } else {
      newGroups.add(group);
    }
    setSelectedGroups(newGroups);
  };

  const toggleAuthorization = (authorization: string) => {
    const newAuthorizations = new Set(selectedAuthorizations);
    if (newAuthorizations.has(authorization)) {
      newAuthorizations.delete(authorization);
    } else {
      newAuthorizations.add(authorization);
    }
    setSelectedAuthorizations(newAuthorizations);
  };

  const filteredData = mockUserData.filter((user) => {
    // Apply search filter
    const matchesSearch = Object.values(user).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    // For this example, we're not filtering by groups since we don't have group data
    // In a real implementation, you'd check user.groups against selectedGroups
    return matchesSearch;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return 0;
  });

  const isAllSelected = sortedData.length > 0 && selectedForDeletion.size === sortedData.length;
  const isSomeSelected = selectedForDeletion.size > 0 && selectedForDeletion.size < sortedData.length;

  // Set indeterminate state on select all checkbox
  useEffect(() => {
    if (selectAllCheckboxRef.current) {
      selectAllCheckboxRef.current.indeterminate = isSomeSelected;
    }
  }, [isSomeSelected]);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ChevronUp size={16} />
    ) : (
      <ChevronDown size={16} />
    );
  };

  const hasActiveFilters = selectedGroups.size > 0 || selectedAuthorizations.size > 0;
  const totalFilterCount = selectedGroups.size + selectedAuthorizations.size;

  const filteredGroupOptions = userGroups.filter((group) =>
    group.toLowerCase().includes(groupSearch.toLowerCase())
  );

  // Get all unique authorizations from groups
  const allAuthorizations = getAllAuthorizations();
  const filteredAuthorizationOptions = allAuthorizations.filter((auth) =>
    auth.toLowerCase().includes(authorizationSearch.toLowerCase())
  );

  // Helper to render cell content based on column type
  const renderCellContent = (user: UserData, columnKey: ColumnKey) => {
    const value = user[columnKey];

    switch (columnKey) {
      case "username":
        return (
          <div className="flex items-center gap-2">
            <User size={14} className="text-[#0d9488] dark:text-[#50e080]" />
            <span className="text-white font-medium">{value}</span>
          </div>
        );
      case "firstName":
      case "lastName":
        return <span className="text-white font-medium">{value}</span>;
      case "status":
        return (
          <div className="flex items-center gap-2">
            {getStatusIcon(value as string)}
            <span className={`${getStatusColor(value as string)} font-medium`}>
              {value}
            </span>
          </div>
        );
      case "theme":
        return (
          <div className="flex items-center gap-2">
            {value === "Dark" ? (
              <Moon size={14} className="text-zinc-400" />
            ) : (
              <Sun size={14} className="text-yellow-500" />
            )}
            <span className="text-zinc-400">{value}</span>
          </div>
        );
      case "localization":
        return (
          <div className="flex items-center gap-2">
            <Globe size={14} className="text-zinc-400" />
            <span className="text-zinc-400">{value}</span>
          </div>
        );
      default:
        return <span className="text-zinc-400">{value}</span>;
    }
  };

  const clearFilters = () => {
    setSelectedGroups(new Set());
    setSelectedAuthorizations(new Set());
  };

  // Handler to open add panel
  const handleAddUser = () => {
    setIsAddMode(true);
    setSelectedUser(null);
    setActiveTab("details");
    setFormUsername("");
    setFormFirstName("");
    setFormLastName("");
    setFormPassword("");
    setFormConfirmPassword("");
    setFormEmail("");
    setFormLocalization("en-US");
    setFormTheme("Dark");
    setFormStatus(true);
    setSelectedUserGroups(new Set());
    setShowDetailPanel(true);
  };

  // Handler to open edit panel
  const handleEditUser = (user: UserData) => {
    setIsAddMode(false);
    setSelectedUser(user);
    setActiveTab("details");
    setFormUsername(user.username);
    setFormFirstName(user.firstName);
    setFormLastName(user.lastName);
    setFormPassword("");
    setFormConfirmPassword("");
    setFormEmail(user.email);
    setFormLocalization(user.localization);
    setFormTheme(user.theme as "Dark" | "Light");
    setFormStatus(user.status === "Active");
    // In a real app, you'd load the user's groups here
    setSelectedUserGroups(new Set(["Warehouse Managers", "System Users"])); // Mock
    setShowDetailPanel(true);
  };

  // Handler to close detail panel
  const handleClosePanel = () => {
    setShowDetailPanel(false);
    setExpandedGroups(new Set());
    setGroupsSearch("");
  };

  // Handler to toggle user group
  const toggleUserGroup = (groupName: string) => {
    const newGroups = new Set(selectedUserGroups);
    if (newGroups.has(groupName)) {
      newGroups.delete(groupName);
    } else {
      newGroups.add(groupName);
    }
    setSelectedUserGroups(newGroups);
  };

  // Handler to toggle expanded group
  const toggleExpandGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  // Check if form has changes (for edit mode)
  const hasFormChanges = () => {
    if (isAddMode) return true;
    if (!selectedUser) return false;
    
    return (
      formUsername !== selectedUser.username ||
      formFirstName !== selectedUser.firstName ||
      formLastName !== selectedUser.lastName ||
      formEmail !== selectedUser.email ||
      formLocalization !== selectedUser.localization ||
      formTheme !== selectedUser.theme ||
      (formStatus ? "Active" : "Inactive") !== selectedUser.status ||
      formPassword !== "" ||
      formConfirmPassword !== ""
    );
  };

  // Handler for save/next button
  const handleSaveOrNext = () => {
    if (isAddMode && activeTab === "details") {
      // Validation could go here
      setActiveTab("groups");
    } else {
      // Save logic would go here
      console.log("Saving user...");
      handleClosePanel();
    }
  };

  // Get button text
  const getSaveButtonText = () => {
    if (isAddMode) {
      return activeTab === "details" ? "Next" : "Save";
    }
    return "Save";
  };

  // Check if save/next button should be enabled
  const isSaveEnabled = () => {
    if (isAddMode) {
      if (activeTab === "details") {
        // Require basic fields for "Next"
        return formUsername.trim() !== "" && formFirstName.trim() !== "" && formLastName.trim() !== "" && formEmail.trim() !== "";
      } else {
        // Require at least one group selected for "Save"
        return selectedUserGroups.size > 0;
      }
    }
    // For edit mode, enable if there are changes
    return hasFormChanges();
  };

  // Filter groups for Groups tab
  const filteredGroupsForTab = mockGroups.filter((group) =>
    group.name.toLowerCase().includes(groupsSearch.toLowerCase()) ||
    group.description.toLowerCase().includes(groupsSearch.toLowerCase())
  );

  // Column management
  type ColumnKey = keyof UserData;
  
  const allColumns: ColumnKey[] = [
    "username",
    "firstName",
    "lastName",
    "status",
    "email",
    "localization",
    "theme",
    "created",
    "createdBy",
    "modified",
    "modifiedBy",
  ];

  const columnDisplayNames: Record<ColumnKey, string> = {
    username: "Username",
    firstName: "First Name",
    lastName: "Last Name",
    status: "Status",
    email: "Email",
    localization: "Localization",
    theme: "Theme",
    created: "Created",
    createdBy: "Created By",
    modified: "Modified",
    modifiedBy: "Modified By",
  };

  const columnWidths: Record<ColumnKey, number> = {
    username: 150,
    firstName: 150,
    lastName: 150,
    status: 120,
    email: 250,
    localization: 120,
    theme: 100,
    created: 180,
    createdBy: 120,
    modified: 180,
    modifiedBy: 120,
  };

  // Get visible columns
  const hiddenColumns = userManagementHiddenColumns || [];
  const pinnedColumns = userManagementPinnedColumns || [];
  
  const visibleColumns = allColumns.filter(
    (col) => !hiddenColumns.includes(col)
  );

  // Sort columns: pinned first, then others
  const sortedColumns = [
    ...visibleColumns.filter((col) => pinnedColumns.includes(col)),
    ...visibleColumns.filter((col) => !pinnedColumns.includes(col)),
  ];

  // Helper function to get pinned column styles
  const getPinnedColumnStyle = (columnKey: ColumnKey) => {
    const pinnedIndex = pinnedColumns.indexOf(columnKey);
    if (pinnedIndex === -1) return {};

    // Calculate left offset based on previous pinned columns
    let leftOffset = 0;
    if (deleteMode) {
      leftOffset += 60; // Width of checkbox column
    }
    for (let i = 0; i < pinnedIndex; i++) {
      const prevColumn = pinnedColumns[i];
      if (visibleColumns.includes(prevColumn)) {
        leftOffset += columnWidths[prevColumn];
      }
    }

    return {
      position: "sticky" as const,
      left: `${leftOffset}px`,
      zIndex: 10,
    };
  };

  // Delete handlers
  const handleToggleDeleteMode = () => {
    setDeleteMode(!deleteMode);
    setSelectedForDeletion(new Set());
  };

  const handleToggleUserSelection = (username: string) => {
    const newSelection = new Set(selectedForDeletion);
    if (newSelection.has(username)) {
      newSelection.delete(username);
    } else {
      newSelection.add(username);
    }
    setSelectedForDeletion(newSelection);
  };

  const handleSelectAll = () => {
    if (selectedForDeletion.size === sortedData.length) {
      // If all are selected, deselect all
      setSelectedForDeletion(new Set());
    } else {
      // Select all filtered users
      const allUsernames = new Set(sortedData.map(user => user.username));
      setSelectedForDeletion(allUsernames);
    }
  };

  const handleConfirmDelete = () => {
    const usersToDeleteList = sortedData.filter((user) =>
      selectedForDeletion.has(user.username)
    );
    setUsersToDelete(usersToDeleteList);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteSingle = (user: UserData) => {
    setUsersToDelete([user]);
    setShowDeleteConfirmation(true);
  };

  const handleExecuteDelete = () => {
    // In a real app, this would call an API to delete the users
    console.log("Deleting users:", usersToDelete);
    setShowDeleteConfirmation(false);
    setUsersToDelete([]);
    setDeleteMode(false);
    setSelectedForDeletion(new Set());
    setShowDetailPanel(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
    setUsersToDelete([]);
  };

  return (
    <div className={`p-8 transition-all duration-300 ${showDetailPanel ? 'mr-[700px]' : 'mr-0'}`}>
      {/* Sticky Header Section */}
      <div className="sticky top-0 bg-white dark:bg-zinc-900 z-40 pb-4 -mx-8 px-8 -mt-8 pt-8">
        {/* Breadcrumb Navigation */}
        <div className="mb-4 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-500">
          <Link to="/app/home" className="hover:text-[#0d9488] dark:hover:text-[#50e080] transition-colors flex items-center gap-1">
            <Home size={14} />
            Home
          </Link>
          <ChevronRight size={14} />
          <Link
            to="/app/navigation"
            className="hover:text-[#0d9488] dark:hover:text-[#50e080] transition-colors"
          >
            Navigation
          </Link>
          <ChevronRight size={14} />
          <Link
            to="/app/navigation?section=system"
            className="hover:text-[#0d9488] dark:hover:text-[#50e080] transition-colors"
          >
            System
          </Link>
          <ChevronRight size={14} />
          <span className="text-zinc-900 dark:text-white font-medium">User Management</span>
        </div>

        {/* Header */}
        <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              User Management
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilterPanel(!showFilterPanel)}
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

            <button className="px-4 py-2 bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors flex items-center gap-2 border border-zinc-300 dark:border-zinc-700">
              <Download size={18} />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-500"
                size={20}
              />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#0d9488] dark:focus:ring-[#50e080]"
              />
            </div>
            <button 
              title="Add User"
              className="p-3 bg-[#0d9488] dark:bg-[#50e080] text-white rounded-lg hover:bg-[#0b7a70] dark:hover:bg-[#3bc76a] transition-colors flex items-center justify-center border border-[#0d9488] dark:border-[#50e080]"
              onClick={handleAddUser}
            >
              <Plus size={18} />
            </button>
            <button 
              title={deleteMode ? "Cancel Delete" : "Delete Users"}
              className={`p-3 rounded-lg transition-colors flex items-center justify-center border ${
                deleteMode
                  ? "bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-white border-zinc-300 dark:border-zinc-600 hover:bg-zinc-300 dark:hover:bg-zinc-600"
                  : "bg-red-500 text-white border-red-500 hover:bg-red-600"
              }`}
              onClick={handleToggleDeleteMode}
            >
              {deleteMode ? <X size={18} /> : <Trash2 size={18} />}
            </button>
            {deleteMode && selectedForDeletion.size > 0 && (
              <button 
                title="Confirm Delete"
                className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 border border-red-500"
                onClick={handleConfirmDelete}
              >
                <Check size={18} />
                <span>Confirm ({selectedForDeletion.size})</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Panel */}
        {showFilterPanel && (
          <div className="mb-6 p-6 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                Filters
              </h3>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-[#0d9488] dark:text-[#50e080] hover:underline"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Groups Filter */}
              <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Groups
              </label>
              <div className="relative">
                <button
                  onClick={() =>
                    setActiveDropdown(activeDropdown === "groups" ? null : "groups")
                  }
                  className="w-full px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-left text-zinc-900 dark:text-white flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  <span className="text-sm">
                    {selectedGroups.size > 0
                      ? `${selectedGroups.size} selected`
                      : "Select groups..."}
                  </span>
                  <ChevronDown size={16} className="text-zinc-500" />
                </button>

                {activeDropdown === "groups" && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg shadow-lg z-20 max-h-80 overflow-hidden flex flex-col">
                    {/* Search within dropdown */}
                    <div className="p-3 border-b border-zinc-200 dark:border-zinc-800">
                      <div className="relative">
                        <Search
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500"
                          size={16}
                        />
                        <input
                          type="text"
                          placeholder="Search groups..."
                          value={groupSearch}
                          onChange={(e) => setGroupSearch(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded text-sm text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#0d9488] dark:focus:ring-[#50e080]"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>

                    {/* Group options */}
                    <div className="overflow-y-auto max-h-60">
                      {filteredGroupOptions.length > 0 ? (
                        filteredGroupOptions.map((group) => (
                          <label
                            key={group}
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
                          >
                            <div className="relative flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedGroups.has(group)}
                                onChange={() => toggleGroup(group)}
                                className="w-4 h-4 border-2 border-zinc-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-900 checked:bg-[#0d9488] dark:checked:bg-[#50e080] checked:border-[#0d9488] dark:checked:border-[#50e080] focus:ring-2 focus:ring-[#0d9488] dark:focus:ring-[#50e080] focus:ring-offset-0 appearance-none cursor-pointer"
                              />
                              {selectedGroups.has(group) && (
                                <Check
                                  size={12}
                                  className="absolute left-0.5 top-0.5 text-white pointer-events-none"
                                />
                              )}
                            </div>
                            <span className="text-sm text-zinc-900 dark:text-zinc-300">
                              {group}
                            </span>
                          </label>
                        ))
                      ) : (
                        <div className="px-4 py-8 text-center text-sm text-zinc-500">
                          No groups found
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Authorizations Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Authorizations
              </label>
              <div className="relative">
                <button
                  onClick={() =>
                    setActiveDropdown(activeDropdown === "authorizations" ? null : "authorizations")
                  }
                  className="w-full px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-left text-zinc-900 dark:text-white flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  <span className="text-sm">
                    {selectedAuthorizations.size > 0
                      ? `${selectedAuthorizations.size} selected`
                      : "Select authorizations..."}
                  </span>
                  <ChevronDown size={16} className="text-zinc-500" />
                </button>

                {activeDropdown === "authorizations" && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg shadow-lg z-20 max-h-80 overflow-hidden flex flex-col">
                    {/* Search within dropdown */}
                    <div className="p-3 border-b border-zinc-200 dark:border-zinc-800">
                      <div className="relative">
                        <Search
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500"
                          size={16}
                        />
                        <input
                          type="text"
                          placeholder="Search authorizations..."
                          value={authorizationSearch}
                          onChange={(e) => setAuthorizationSearch(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded text-sm text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#0d9488] dark:focus:ring-[#50e080]"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>

                    {/* Authorization options */}
                    <div className="overflow-y-auto max-h-60">
                      {filteredAuthorizationOptions.length > 0 ? (
                        filteredAuthorizationOptions.map((auth) => (
                          <label
                            key={auth}
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
                          >
                            <div className="relative flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedAuthorizations.has(auth)}
                                onChange={() => toggleAuthorization(auth)}
                                className="w-4 h-4 border-2 border-zinc-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-900 checked:bg-[#0d9488] dark:checked:bg-[#50e080] checked:border-[#0d9488] dark:checked:border-[#50e080] focus:ring-2 focus:ring-[#0d9488] dark:focus:ring-[#50e080] focus:ring-offset-0 appearance-none cursor-pointer"
                              />
                              {selectedAuthorizations.has(auth) && (
                                <Check
                                  size={12}
                                  className="absolute left-0.5 top-0.5 text-white pointer-events-none"
                                />
                              )}
                            </div>
                            <span className="text-sm text-zinc-900 dark:text-zinc-300">
                              {auth}
                            </span>
                          </label>
                        ))
                      ) : (
                        <div className="px-4 py-8 text-center text-sm text-zinc-500">
                          No authorizations found
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            </div>
          </div>
        )}
      </div>
      </div>

      {/* Data Grid */}
      <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl overflow-hidden">
        {/* Table Header */}
        <div className="overflow-x-auto">
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-zinc-100 dark:bg-zinc-800 border-b-2 border-zinc-300 dark:border-zinc-700">
                  <tr>
                    {deleteMode && (
                      <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 w-12">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={isAllSelected}
                            onChange={handleSelectAll}
                            ref={selectAllCheckboxRef}
                            className="w-4 h-4 border-2 border-zinc-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-900 checked:bg-red-500 checked:border-red-500 focus:ring-2 focus:ring-red-500 focus:ring-offset-0 appearance-none cursor-pointer"
                          />
                        </div>
                      </th>
                    )}
                    {sortedColumns.map((columnKey) => {
                      const isPinned = pinnedColumns.includes(columnKey);
                      return (
                        <th
                          key={columnKey}
                          onClick={() => handleSort(columnKey as SortField)}
                          className={`px-6 py-4 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors select-none ${
                            isPinned
                              ? "bg-zinc-200 dark:bg-zinc-900/90 border-r-2 border-zinc-300 dark:border-zinc-700"
                              : "bg-zinc-100 dark:bg-zinc-800"
                          }`}
                          style={{
                            ...getPinnedColumnStyle(columnKey),
                            minWidth: `${columnWidths[columnKey]}px`,
                          }}
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
                <tbody className="bg-white dark:bg-zinc-900 divide-y divide-zinc-200 dark:divide-zinc-800">
                  {sortedData.map((user, index) => (
                    <tr
                      key={index}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer"
                      onClick={(e) => {
                        // Don't open detail panel if clicking checkbox
                        if (deleteMode && (e.target as HTMLElement).closest('input[type="checkbox"]')) {
                          return;
                        }
                        handleEditUser(user);
                      }}
                    >
                      {deleteMode && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm bg-white dark:bg-zinc-900">
                          <div className="relative flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedForDeletion.has(user.username)}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleToggleUserSelection(user.username);
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="w-4 h-4 border-2 border-zinc-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-900 checked:bg-red-500 checked:border-red-500 focus:ring-2 focus:ring-red-500 focus:ring-offset-0 appearance-none cursor-pointer"
                            />
                            {selectedForDeletion.has(user.username) && (
                              <Check
                                size={12}
                                className="absolute left-0.5 top-0.5 text-white pointer-events-none"
                              />
                            )}
                          </div>
                        </td>
                      )}
                      {sortedColumns.map((columnKey) => {
                        const isPinned = pinnedColumns.includes(columnKey);
                        return (
                          <td
                            key={columnKey}
                            className={`px-6 py-4 whitespace-nowrap text-sm ${
                              isPinned
                                ? "bg-zinc-50 dark:bg-zinc-900/90 border-r-2 border-zinc-200 dark:border-zinc-700"
                                : "bg-white dark:bg-zinc-900"
                            }`}
                            style={getPinnedColumnStyle(columnKey)}
                          >
                            {renderCellContent(user, columnKey as ColumnKey)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>

              {sortedData.length === 0 && (
                <div className="text-center py-12 text-zinc-500">
                  No users found matching your search
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer with count */}
        <div className="bg-zinc-100 dark:bg-zinc-800 px-6 py-4 border-t-2 border-zinc-300 dark:border-zinc-700">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Showing {sortedData.length} of {mockUserData.length} users
          </p>
        </div>
      </div>

      {/* Detail Panel */}
      {showDetailPanel && (
        <UserDetailPanel
          isAddMode={isAddMode}
          selectedUser={selectedUser}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          formUsername={formUsername}
          setFormUsername={setFormUsername}
          formFirstName={formFirstName}
          setFormFirstName={setFormFirstName}
          formLastName={formLastName}
          setFormLastName={setFormLastName}
          formPassword={formPassword}
          setFormPassword={setFormPassword}
          formConfirmPassword={formConfirmPassword}
          setFormConfirmPassword={setFormConfirmPassword}
          formEmail={formEmail}
          setFormEmail={setFormEmail}
          formLocalization={formLocalization}
          setFormLocalization={setFormLocalization}
          formTheme={formTheme}
          setFormTheme={setFormTheme}
          formStatus={formStatus}
          setFormStatus={setFormStatus}
          selectedUserGroups={selectedUserGroups}
          toggleUserGroup={toggleUserGroup}
          groupsSearch={groupsSearch}
          setGroupsSearch={setGroupsSearch}
          expandedGroups={expandedGroups}
          toggleExpandGroup={toggleExpandGroup}
          filteredGroupsForTab={filteredGroupsForTab}
          onClose={handleClosePanel}
          onSave={handleSaveOrNext}
          onDelete={handleDeleteSingle}
          isSaveEnabled={isSaveEnabled()}
          saveButtonText={getSaveButtonText()}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border-2 border-zinc-300 dark:border-zinc-700 shadow-2xl max-w-2xl w-full mx-4">
            <div className="p-6 border-b-2 border-zinc-300 dark:border-zinc-700">
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                Confirm Delete
              </h3>
            </div>
            <div className="p-6">
              <p className="text-zinc-700 dark:text-zinc-300 mb-4">
                Are you sure you want to delete the following user{usersToDelete.length > 1 ? 's' : ''}?
              </p>
              <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-4 max-h-60 overflow-y-auto">
                <ul className="space-y-2">
                  {usersToDelete.map((user, index) => (
                    <li key={index} className="flex items-center gap-3 text-zinc-900 dark:text-white">
                      <User size={16} className="text-[#0d9488] dark:text-[#50e080]" />
                      <span className="font-medium">{user.username}</span>
                      <span className="text-zinc-500">-</span>
                      <span className="text-zinc-600 dark:text-zinc-400">
                        {user.firstName} {user.lastName}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-sm text-red-500 mt-4">
                This action cannot be undone.
              </p>
            </div>
            <div className="p-6 border-t-2 border-zinc-300 dark:border-zinc-700 flex justify-end gap-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-white rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
              >
                <Trash2 size={18} />
                <span>Delete {usersToDelete.length > 1 ? `(${usersToDelete.length})` : ''}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}