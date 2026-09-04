import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useLayout } from "../contexts/LayoutContext";
import { GroupDetailPanel } from "../components/GroupDetailPanel";
import {
  Search,
  Filter,
  Download,
  Plus,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Check,
  Shield,
  X,
  Trash2,
  Users,
  Home,
} from "lucide-react";
import { mockGroups, mockUserData, getAllAuthorizations, getUsersByGroup, type Group, type UserData } from "../data/mockGroupsAndUsers";

type SortField = keyof Group | "users" | "authorizations";
type SortDirection = "asc" | "desc";

export function GroupManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("modified");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [selectedAuthorizations, setSelectedAuthorizations] = useState<Set<string>>(new Set());
  const [userSearch, setUserSearch] = useState("");
  const [authorizationSearch, setAuthorizationSearch] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<'users' | 'authorizations' | null>(null);

  // Detail panel state
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [activeTab, setActiveTab] = useState<"details" | "authorizations" | "users" | "actions">("details");
  
  // Form state
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  
  // Authorizations tab state
  const [selectedScreenAuthorizations, setSelectedScreenAuthorizations] = useState<Set<string>>(new Set());
  const [selectedFunctionAuthorizations, setSelectedFunctionAuthorizations] = useState<Set<string>>(new Set());
  const [authorizationsSearch, setAuthorizationsSearch] = useState("");
  
  // Users tab state
  const [selectedGroupUsers, setSelectedGroupUsers] = useState<Set<string>>(new Set());
  const [groupUsersSearch, setGroupUsersSearch] = useState("");

  // Delete state
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedForDeletion, setSelectedForDeletion] = useState<Set<string>>(new Set());
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [groupsToDelete, setGroupsToDelete] = useState<Group[]>([]);

  // Save confirmation state
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);

  const selectAllCheckboxRef = useRef<HTMLInputElement>(null);

  // Get column visibility settings from layout context
  const { groupManagementHiddenColumns, groupManagementPinnedColumns } = useLayout() as any;

  // Tooltip state
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);
  const [hoveredColumn, setHoveredColumn] = useState<'users' | 'authorizations' | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const toggleUser = (user: string) => {
    const newUsers = new Set(selectedUsers);
    if (newUsers.has(user)) {
      newUsers.delete(user);
    } else {
      newUsers.add(user);
    }
    setSelectedUsers(newUsers);
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

  const filteredData = mockGroups.filter((group) => {
    // Apply search filter
    const matchesSearch = 
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase());

    // Apply user filter
    const groupUsers = getUsersByGroup(group.name);
    const matchesUserFilter = selectedUsers.size === 0 || 
      groupUsers.some(user => selectedUsers.has(user.username));

    // Apply authorization filter
    const matchesAuthorizationFilter = selectedAuthorizations.size === 0 ||
      group.authorizations.some(auth => 
        auth.items.some(item => selectedAuthorizations.has(item))
      );

    return matchesSearch && matchesUserFilter && matchesAuthorizationFilter;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    if (sortField === "users") {
      aValue = getUsersByGroup(a.name).length;
      bValue = getUsersByGroup(b.name).length;
    } else if (sortField === "authorizations") {
      aValue = a.authorizations.reduce((acc, auth) => acc + auth.items.length, 0);
      bValue = b.authorizations.reduce((acc, auth) => acc + auth.items.length, 0);
    } else {
      aValue = a[sortField as keyof Group];
      bValue = b[sortField as keyof Group];
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
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

  const hasActiveFilters = selectedUsers.size > 0 || selectedAuthorizations.size > 0;
  const totalFilterCount = selectedUsers.size + selectedAuthorizations.size;

  const filteredUserOptions = mockUserData.filter((user) =>
    `${user.firstName} ${user.lastName} (${user.username})`.toLowerCase().includes(userSearch.toLowerCase())
  );

  const allAuthorizations = getAllAuthorizations();
  const filteredAuthorizationOptions = allAuthorizations.filter((auth) =>
    auth.toLowerCase().includes(authorizationSearch.toLowerCase())
  );

  const clearFilters = () => {
    setSelectedUsers(new Set());
    setSelectedAuthorizations(new Set());
  };

  // Handler to open add panel
  const handleAddGroup = () => {
    setIsAddMode(true);
    setSelectedGroup(null);
    setActiveTab("details");
    setFormName("");
    setFormDescription("");
    setSelectedScreenAuthorizations(new Set());
    setSelectedFunctionAuthorizations(new Set());
    setSelectedGroupUsers(new Set());
    setShowDetailPanel(true);
  };

  // Handler to open edit panel
  const handleEditGroup = (group: Group) => {
    setIsAddMode(false);
    setSelectedGroup(group);
    setActiveTab("details");
    setFormName(group.name);
    setFormDescription(group.description);
    
    // Load authorizations
    const screens = group.authorizations.find(a => a.type === "Screens")?.items || [];
    const functions = group.authorizations.find(a => a.type === "Functions")?.items || [];
    setSelectedScreenAuthorizations(new Set(screens));
    setSelectedFunctionAuthorizations(new Set(functions));
    
    // Load users
    const users = getUsersByGroup(group.name).map(u => u.username);
    setSelectedGroupUsers(new Set(users));
    
    setShowDetailPanel(true);
  };

  // Handler to close detail panel
  const handleClosePanel = () => {
    setShowDetailPanel(false);
    setAuthorizationsSearch("");
    setGroupUsersSearch("");
  };

  // Handler for save/next button
  const handleSaveOrNext = () => {
    if (isAddMode) {
      if (activeTab === "details") {
        setActiveTab("authorizations");
      } else if (activeTab === "authorizations") {
        setActiveTab("users");
      } else {
        // Show confirmation dialog before saving
        setShowSaveConfirmation(true);
      }
    } else {
      // Show confirmation dialog before saving (edit mode)
      setShowSaveConfirmation(true);
    }
  };

  // Handler to execute the actual save after confirmation
  const handleExecuteSave = () => {
    console.log("Saving group...");
    console.log("Group Name:", formName);
    console.log("Description:", formDescription);
    console.log("Screen Authorizations:", Array.from(selectedScreenAuthorizations));
    console.log("Function Authorizations:", Array.from(selectedFunctionAuthorizations));
    console.log("Users:", Array.from(selectedGroupUsers));
    setShowSaveConfirmation(false);
    handleClosePanel();
  };

  // Handler to cancel save confirmation
  const handleCancelSave = () => {
    setShowSaveConfirmation(false);
  };

  // Get button text
  const getSaveButtonText = () => {
    if (isAddMode) {
      if (activeTab === "details") return "Next";
      if (activeTab === "authorizations") return "Next";
      return "Save";
    }
    return "Save";
  };

  // Check if save/next button should be enabled
  const isSaveEnabled = () => {
    if (isAddMode) {
      if (activeTab === "details") {
        return formName.trim() !== "" && formDescription.trim() !== "";
      } else if (activeTab === "authorizations") {
        return selectedScreenAuthorizations.size > 0 || selectedFunctionAuthorizations.size > 0;
      } else {
        return selectedGroupUsers.size > 0;
      }
    }
    return hasFormChanges();
  };

  // Check if form has changes (for edit mode)
  const hasFormChanges = () => {
    if (isAddMode) return true;
    if (!selectedGroup) return false;
    
    const currentScreens = selectedGroup.authorizations.find(a => a.type === "Screens")?.items || [];
    const currentFunctions = selectedGroup.authorizations.find(a => a.type === "Functions")?.items || [];
    const currentUsers = getUsersByGroup(selectedGroup.name).map(u => u.username);
    
    return (
      formName !== selectedGroup.name ||
      formDescription !== selectedGroup.description ||
      !setsEqual(selectedScreenAuthorizations, new Set(currentScreens)) ||
      !setsEqual(selectedFunctionAuthorizations, new Set(currentFunctions)) ||
      !setsEqual(selectedGroupUsers, new Set(currentUsers))
    );
  };

  const setsEqual = (a: Set<string>, b: Set<string>) => {
    if (a.size !== b.size) return false;
    for (const item of a) {
      if (!b.has(item)) return false;
    }
    return true;
  };

  // Column management
  type ColumnKey = "name" | "description" | "users" | "authorizations" | "created" | "createdBy" | "modified" | "modifiedBy";
  
  const allColumns: ColumnKey[] = [
    "name",
    "description",
    "users",
    "authorizations",
    "created",
    "createdBy",
    "modified",
    "modifiedBy",
  ];

  const columnDisplayNames: Record<ColumnKey, string> = {
    name: "Name",
    description: "Description",
    users: "Users",
    authorizations: "Authorizations",
    created: "Created",
    createdBy: "Created By",
    modified: "Modified",
    modifiedBy: "Modified By",
  };

  const columnWidths: Record<ColumnKey, number> = {
    name: 200,
    description: 300,
    users: 150,
    authorizations: 200,
    created: 180,
    createdBy: 120,
    modified: 180,
    modifiedBy: 120,
  };

  // Get visible columns
  const hiddenColumns = groupManagementHiddenColumns || [];
  const pinnedColumns = groupManagementPinnedColumns || [];
  
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

  const handleToggleGroupSelection = (groupId: string) => {
    const newSelection = new Set(selectedForDeletion);
    if (newSelection.has(groupId)) {
      newSelection.delete(groupId);
    } else {
      newSelection.add(groupId);
    }
    setSelectedForDeletion(newSelection);
  };

  const handleSelectAll = () => {
    if (selectedForDeletion.size === sortedData.length) {
      setSelectedForDeletion(new Set());
    } else {
      const allGroupIds = new Set(sortedData.map(group => group.id));
      setSelectedForDeletion(allGroupIds);
    }
  };

  const handleConfirmDelete = () => {
    const groupsToDeleteList = sortedData.filter((group) =>
      selectedForDeletion.has(group.id)
    );
    setGroupsToDelete(groupsToDeleteList);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteSingle = (group: Group) => {
    setGroupsToDelete([group]);
    setShowDeleteConfirmation(true);
  };

  const handleExecuteDelete = () => {
    console.log("Deleting groups:", groupsToDelete);
    setShowDeleteConfirmation(false);
    setGroupsToDelete([]);
    setDeleteMode(false);
    setSelectedForDeletion(new Set());
    setShowDetailPanel(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
    setGroupsToDelete([]);
  };

  // Helper to render cell content based on column type
  const renderCellContent = (group: Group, columnKey: ColumnKey) => {
    switch (columnKey) {
      case "name":
        return (
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-[#0d9488] dark:text-[#50e080]" />
            <span className="text-white font-medium">{group.name}</span>
          </div>
        );
      case "description":
        return <span className="text-zinc-400">{group.description}</span>;
      case "users":
        const groupUsers = getUsersByGroup(group.name);
        return (
          <div className="flex items-center gap-2">
            <Users size={14} className="text-zinc-400" />
            <span className="text-zinc-400">{groupUsers.length}</span>
          </div>
        );
      case "authorizations":
        const totalAuths = group.authorizations.reduce((acc, auth) => acc + auth.items.length, 0);
        return <span className="text-zinc-400">{totalAuths}</span>;
      case "created":
      case "modified":
        return <span className="text-zinc-400">{group[columnKey]}</span>;
      case "createdBy":
      case "modifiedBy":
        return <span className="text-zinc-400">{group[columnKey]}</span>;
      default:
        return null;
    }
  };

  // Tooltip content
  const renderTooltip = (group: Group, column: 'users' | 'authorizations') => {
    if (column === 'users') {
      const groupUsers = getUsersByGroup(group.name);
      return (
        <div className="max-w-xs">
          <div className="text-xs font-semibold text-white mb-2">Users ({groupUsers.length})</div>
          <div className="space-y-1">
            {groupUsers.map(user => (
              <div key={user.username} className="text-xs text-zinc-300">
                {user.firstName} {user.lastName} ({user.username})
              </div>
            ))}
            {groupUsers.length === 0 && (
              <div className="text-xs text-zinc-400 italic">No users</div>
            )}
          </div>
        </div>
      );
    } else {
      return (
        <div className="max-w-md">
          <div className="text-xs font-semibold text-white mb-2">Authorizations</div>
          <div className="space-y-3">
            {group.authorizations.map((auth, index) => (
              <div key={index}>
                <div className="text-xs font-medium text-[#50e080] mb-1">{auth.type}</div>
                <div className="space-y-0.5">
                  {auth.items.map((item, idx) => (
                    <div key={idx} className="text-xs text-zinc-300 pl-2">• {item}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
  };

  return (
    <div className={`p-8 transition-all duration-300 ${showDetailPanel ? 'mr-[700px]' : 'mr-0'}`}>
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
        <span className="text-zinc-900 dark:text-white font-medium">Group Management</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Group Management
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
                placeholder="Search groups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#0d9488] dark:focus:ring-[#50e080]"
              />
            </div>
            <button 
              title="Add Group"
              className="p-3 bg-[#0d9488] dark:bg-[#50e080] text-white rounded-lg hover:bg-[#0b7a70] dark:hover:bg-[#3bc76a] transition-colors flex items-center justify-center border border-[#0d9488] dark:border-[#50e080]"
              onClick={handleAddGroup}
            >
              <Plus size={18} />
            </button>
            <button 
              title={deleteMode ? "Cancel Delete" : "Delete Groups"}
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
              {/* Users Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Users
                </label>
                <div className="relative">
                  <button
                    onClick={() =>
                      setActiveDropdown(activeDropdown === "users" ? null : "users")
                    }
                    className="w-full px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-left text-zinc-900 dark:text-white flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <span className="text-sm">
                      {selectedUsers.size > 0
                        ? `${selectedUsers.size} selected`
                        : "Select users..."}
                    </span>
                    <ChevronDown size={16} className="text-zinc-500" />
                  </button>

                  {activeDropdown === "users" && (
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
                            placeholder="Search users..."
                            value={userSearch}
                            onChange={(e) => setUserSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded text-sm text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#0d9488] dark:focus:ring-[#50e080]"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>

                      {/* User options */}
                      <div className="overflow-y-auto max-h-60">
                        {filteredUserOptions.length > 0 ? (
                          filteredUserOptions.map((user) => (
                            <label
                              key={user.username}
                              className="flex items-center gap-3 px-4 py-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
                            >
                              <div className="relative flex items-center">
                                <input
                                  type="checkbox"
                                  checked={selectedUsers.has(user.username)}
                                  onChange={() => toggleUser(user.username)}
                                  className="w-4 h-4 border-2 border-zinc-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-900 checked:bg-[#0d9488] dark:checked:bg-[#50e080] checked:border-[#0d9488] dark:checked:border-[#50e080] focus:ring-2 focus:ring-[#0d9488] dark:focus:ring-[#50e080] focus:ring-offset-0 appearance-none cursor-pointer"
                                />
                                {selectedUsers.has(user.username) && (
                                  <Check
                                    size={12}
                                    className="absolute left-0.5 top-0.5 text-white pointer-events-none"
                                  />
                                )}
                              </div>
                              <span className="text-sm text-zinc-900 dark:text-zinc-300">
                                {user.firstName} {user.lastName} ({user.username})
                              </span>
                            </label>
                          ))
                        ) : (
                          <div className="px-4 py-8 text-center text-sm text-zinc-500">
                            No users found
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
                  {sortedData.map((group, index) => (
                    <tr
                      key={index}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer"
                      onClick={() => !deleteMode && handleEditGroup(group)}
                    >
                      {deleteMode && (
                        <td className="px-6 py-4 whitespace-nowrap bg-white dark:bg-zinc-900">
                          <input
                            type="checkbox"
                            checked={selectedForDeletion.has(group.id)}
                            onChange={() => handleToggleGroupSelection(group.id)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-4 h-4 border-2 border-zinc-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-900 checked:bg-red-500 checked:border-red-500 focus:ring-2 focus:ring-red-500 focus:ring-offset-0 appearance-none cursor-pointer"
                          />
                        </td>
                      )}
                      {sortedColumns.map((columnKey) => {
                        const isPinned = pinnedColumns.includes(columnKey);
                        const isHoverable = columnKey === 'users' || columnKey === 'authorizations';
                        
                        return (
                          <td
                            key={columnKey}
                            className={`px-6 py-4 whitespace-nowrap ${
                              isPinned
                                ? "bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800"
                                : "bg-white dark:bg-zinc-900"
                            }`}
                            style={getPinnedColumnStyle(columnKey)}
                            onMouseEnter={(e) => {
                              if (isHoverable) {
                                setHoveredGroup(group.id);
                                setHoveredColumn(columnKey as 'users' | 'authorizations');
                                const rect = e.currentTarget.getBoundingClientRect();
                                setTooltipPosition({ x: rect.left, y: rect.bottom + 5 });
                              }
                            }}
                            onMouseLeave={() => {
                              if (isHoverable) {
                                setHoveredGroup(null);
                                setHoveredColumn(null);
                              }
                            }}
                          >
                            {renderCellContent(group, columnKey)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Empty State */}
              {sortedData.length === 0 && (
                <div className="text-center py-12 text-zinc-500 bg-white dark:bg-zinc-900">
                  No groups found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {hoveredGroup && hoveredColumn && (
        <div
          className="fixed z-50 bg-zinc-800 dark:bg-zinc-900 border border-zinc-700 rounded-lg p-4 shadow-xl max-w-md"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
          }}
        >
          {renderTooltip(
            sortedData.find(g => g.id === hoveredGroup)!,
            hoveredColumn
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-8 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">
              Confirm Delete
            </h3>
            <p className="text-zinc-700 dark:text-zinc-300 mb-6">
              Are you sure you want to delete {groupsToDelete.length} group{groupsToDelete.length !== 1 ? 's' : ''}?
            </p>
            <div className="space-y-2 mb-6 max-h-40 overflow-y-auto">
              {groupsToDelete.map((group) => (
                <div
                  key={group.id}
                  className="px-3 py-2 bg-zinc-100 dark:bg-zinc-800 rounded text-sm text-zinc-900 dark:text-white"
                >
                  {group.name}
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCancelDelete}
                className="flex-1 px-4 py-3 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteDelete}
                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Confirmation Modal */}
      {showSaveConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-8 max-w-lg w-full mx-4 shadow-2xl max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">
              {isAddMode ? 'Confirm New Group' : 'Confirm Changes'}
            </h3>
            <p className="text-zinc-700 dark:text-zinc-300 mb-6">
              Please review the group details before saving:
            </p>
            
            {/* Group Details */}
            <div className="space-y-4 mb-6 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-1">
                  Group Name
                </label>
                <div className="text-sm font-medium text-zinc-900 dark:text-white">
                  {formName}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-1">
                  Description
                </label>
                <div className="text-sm text-zinc-900 dark:text-white">
                  {formDescription}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-1">
                  Screen Authorizations ({selectedScreenAuthorizations.size})
                </label>
                <div className="text-sm text-zinc-900 dark:text-white">
                  {selectedScreenAuthorizations.size > 0 ? (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {Array.from(selectedScreenAuthorizations).map((auth) => (
                        <span key={auth} className="px-2 py-1 bg-[#0d9488]/10 dark:bg-[#50e080]/10 text-[#0d9488] dark:text-[#50e080] rounded text-xs border border-[#0d9488]/20 dark:border-[#50e080]/20">
                          {auth}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-zinc-500 dark:text-zinc-400 italic">None selected</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-1">
                  Function Authorizations ({selectedFunctionAuthorizations.size})
                </label>
                <div className="text-sm text-zinc-900 dark:text-white">
                  {selectedFunctionAuthorizations.size > 0 ? (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {Array.from(selectedFunctionAuthorizations).map((auth) => (
                        <span key={auth} className="px-2 py-1 bg-[#0d9488]/10 dark:bg-[#50e080]/10 text-[#0d9488] dark:text-[#50e080] rounded text-xs border border-[#0d9488]/20 dark:border-[#50e080]/20">
                          {auth}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-zinc-500 dark:text-zinc-400 italic">None selected</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-1">
                  Users ({selectedGroupUsers.size})
                </label>
                <div className="text-sm text-zinc-900 dark:text-white">
                  {selectedGroupUsers.size > 0 ? (
                    <div className="space-y-1 mt-2">
                      {Array.from(selectedGroupUsers).map((username) => {
                        const user = mockUserData.find(u => u.username === username);
                        return (
                          <div key={username} className="text-xs">
                            {user ? `${user.firstName} ${user.lastName} (${username})` : username}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <span className="text-zinc-500 dark:text-zinc-400 italic">None selected</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCancelSave}
                className="flex-1 px-4 py-3 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteSave}
                className="flex-1 px-4 py-3 bg-[#0d9488] dark:bg-[#50e080] hover:bg-[#0b7a70] dark:hover:bg-[#3bc76a] text-white rounded-lg font-medium transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Panel */}
      {showDetailPanel && (
        <GroupDetailPanel
          isAddMode={isAddMode}
          selectedGroup={selectedGroup}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          formName={formName}
          setFormName={setFormName}
          formDescription={formDescription}
          setFormDescription={setFormDescription}
          selectedScreenAuthorizations={selectedScreenAuthorizations}
          selectedFunctionAuthorizations={selectedFunctionAuthorizations}
          setSelectedScreenAuthorizations={setSelectedScreenAuthorizations}
          setSelectedFunctionAuthorizations={setSelectedFunctionAuthorizations}
          authorizationsSearch={authorizationsSearch}
          setAuthorizationsSearch={setAuthorizationsSearch}
          selectedGroupUsers={selectedGroupUsers}
          setSelectedGroupUsers={setSelectedGroupUsers}
          groupUsersSearch={groupUsersSearch}
          setGroupUsersSearch={setGroupUsersSearch}
          onClose={handleClosePanel}
          onSave={handleSaveOrNext}
          onDelete={handleDeleteSingle}
          isSaveEnabled={isSaveEnabled()}
          saveButtonText={getSaveButtonText()}
        />
      )}
    </div>
  );
}