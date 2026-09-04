import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useLayout } from "../contexts/LayoutContext";
import { GroupDetailPanel } from "../components/GroupDetailPanel";
import {
  MasterTableContainer,
  MasterTable,
  MasterTableHead,
  MasterTableTh,
  MasterTableBody,
  MasterTableRow,
  MasterTableCell,
  MasterTableEmptyRow,
} from "../components/tables/MasterTable";
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
 RefreshCw,
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
 <Shield size={14} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 <span className="text-[var(--foreground)] font-medium">{group.name}</span>
 </div>
 );
 case "description":
 return <span className="text-[var(--muted-foreground)]">{group.description}</span>;
 case "users":
 const groupUsers = getUsersByGroup(group.name);
 return (
 <div className="flex items-center gap-2">
 <Users size={14} className="text-[var(--muted-foreground)]" />
 <span className="text-[var(--muted-foreground)]">{groupUsers.length}</span>
 </div>
 );
 case "authorizations":
 const totalAuths = group.authorizations.reduce((acc, auth) => acc + auth.items.length, 0);
 return <span className="text-[var(--muted-foreground)]">{totalAuths}</span>;
 case "created":
 case "modified":
 return <span className="text-[var(--muted-foreground)]">{group[columnKey]}</span>;
 case "createdBy":
 case "modifiedBy":
 return <span className="text-[var(--muted-foreground)]">{group[columnKey]}</span>;
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
 <div className="text-xs font-semibold text-[var(--foreground)]  mb-2">Users ({groupUsers.length})</div>
 <div className="space-y-1">
 {groupUsers.map(user => (
 <div key={user.username} className="text-xs text-[var(--foreground)]">
 {user.firstName} {user.lastName} ({user.username})
 </div>
 ))}
 {groupUsers.length === 0 && (
 <div className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] italic">No users</div>
 )}
 </div>
 </div>
 );
 } else {
 return (
 <div className="max-w-md">
 <div className="text-xs font-semibold text-[var(--foreground)]  mb-2">Authorizations</div>
 <div className="space-y-3">
 {group.authorizations.map((auth, index) => (
 <div key={index}>
 <div className="text-xs font-medium text-[var(--primary)] mb-1">{auth.type}</div>
 <div className="space-y-0.5">
 {auth.items.map((item, idx) => (
 <div key={idx} className="text-xs text-[var(--foreground)] pl-2">• {item}</div>
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
 <div className={`flex flex-col min-h-screen transition-all duration-300 ${showDetailPanel ? 'mr-[700px]' : 'mr-0'}`}>
 {/* Sticky Header */}
 <div className="sticky top-0 z-40 bg-[var(--background)]/95 backdrop-blur-md text-[var(--foreground)] border-b border-[var(--border)] px-8 pt-6 pb-4">
 <div className="flex items-center justify-between gap-4">
 <nav className="flex items-center gap-2 text-sm">
 <Link to="/app/home" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] dark:hover:text-[var(--primary)] transition-colors flex items-center gap-1">
 <Home size={14} />Home
 </Link>
 <ChevronRight size={14} className="text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]" />
 <Link to="/app/navigation?section=system" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] dark:hover:text-[var(--primary)] transition-colors">System</Link>
 <ChevronRight size={14} className="text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]" />
 <span className="text-[var(--foreground)]  font-semibold text-lg flex items-center gap-2">
 <Users size={20} className="text-[var(--primary)] dark:text-[var(--primary)]" />Group Management
 </span>
 </nav>
 <div className="flex items-center gap-2">
 <button onClick={() => {}} className="p-2 rounded-lg border-[var(--border)]  bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--surface-container-low)] dark:hover:bg-[var(--surface-container-high)] text-[var(--muted-foreground)] transition-colors" title="Refresh"><RefreshCw size={16} /></button>
 <button className="p-2 rounded-lg border-[var(--border)]  bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--surface-container-low)] dark:hover:bg-[var(--surface-container-high)] text-[var(--muted-foreground)] transition-colors" title="Export"><Download size={16} /></button>
 <button onClick={() => setShowFilterPanel(!showFilterPanel)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 border ${showFilterPanel || hasActiveFilters ? "bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90" : "bg-[var(--surface-container-high)] text-[var(--foreground)] hover:bg-[var(--surface-container-highest)] border border-transparent"}`}>
 <Filter size={16} />Filter{hasActiveFilters && <span className="px-1.5 py-0.5 bg-white/25 rounded text-xs">{totalFilterCount}</span>}
 </button>
 </div>
 </div>
 </div>
 <div className="flex-1 overflow-y-auto p-8">
 <div className="mb-8">

 {/* Search Bar */}
 <div className="mb-6">
 <div className="flex items-center gap-3">
 <div className="relative flex-1">
 <Search
 className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--muted-foreground)]"
 size={20}
 />
 <input
 type="text"
 placeholder="Search groups..."
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 className="w-full pl-12 pr-4 py-3 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg text-[var(--foreground)]  placeholder-zinc-500 focus:outline-none focus: focus:)] dark:focus:)]"
 />
 </div>
 <button 
 title="Add Group"
 className="p-3 bg-[var(--primary)]  text-[var(--primary-foreground)] rounded-lg hover:opacity-90 active:scale-[0.98] transition-colors flex items-center justify-center border border-[var(--primary)] dark:border-[var(--primary)]"
 onClick={handleAddGroup}
 >
 <Plus size={18} />
 </button>
 <button 
 title={deleteMode ? "Cancel Delete" : "Delete Groups"}
 className={`p-3 rounded-lg transition-colors flex items-center justify-center border ${
 deleteMode ? "bg-[var(--state-error)] text-white border-[var(--state-error)] hover:opacity-90" : "bg-[var(--surface-container-low)] dark:bg-[var(--card)] text-[var(--foreground)] border-[var(--border)]  hover:bg-[var(--state-error)]/10 hover:text-[var(--state-error)] hover:border-[var(--state-error)]/30"
 }`}
 onClick={handleToggleDeleteMode}
 >
 {deleteMode ? <X size={18} /> : <Trash2 size={18} />}
 </button>
 {deleteMode && selectedForDeletion.size > 0 && (
 <button 
 title="Confirm Delete"
 className="px-4 py-3 bg-[var(--state-error)] text-white rounded-lg hover:opacity-90 transition-colors flex items-center gap-2 border border-[var(--state-error)]"
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
 <div className="mb-6 p-6 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg">
 <div className="flex items-center justify-between mb-4">
 <h3 className="text-lg font-semibold text-[var(--foreground)] ">
 Filters
 </h3>
 {hasActiveFilters && (
 <button
 onClick={clearFilters}
 className="text-sm text-[var(--primary)] dark:text-[var(--primary)] hover:underline"
 >
 Clear All
 </button>
 )}
 </div>

 <div className="grid grid-cols-2 gap-4">
 {/* Users Filter */}
 <div className="space-y-2">
 <label className="block text-sm font-medium text-[var(--foreground)]">
 Users
 </label>
 <div className="relative">
 <button
 onClick={() =>
 setActiveDropdown(activeDropdown === "users" ? null : "users")
 }
 className="w-full px-4 py-2 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg text-left text-[var(--foreground)]  flex items-center justify-between hover:bg-[var(--primary)]/10 transition-colors"
 >
 <span className="text-sm">
 {selectedUsers.size > 0
 ? `${selectedUsers.size} selected`
 : "Select users..."}
 </span>
 <ChevronDown size={16} className="text-[var(--muted-foreground)]" />
 </button>

 {activeDropdown === "users" && (
 <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg z-20 max-h-80 overflow-hidden flex flex-col">
 {/* Search within dropdown */}
 <div className="p-3 border-b border-[var(--border)] ">
 <div className="relative">
 <Search
 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--muted-foreground)]"
 size={16}
 />
 <input
 type="text"
 placeholder="Search users..."
 value={userSearch}
 onChange={(e) => setUserSearch(e.target.value)}
 className="w-full pl-9 pr-3 py-2 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded text-sm text-[var(--foreground)]  placeholder-zinc-500 focus:outline-none focus: focus:)] dark:focus:)]"
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
 className="flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--surface-container-low)] hover:bg-[var(--surface-container-high)] cursor-pointer transition-colors"
 >
 <div className="relative flex items-center">
 <input
 type="checkbox"
 checked={selectedUsers.has(user.username)}
 onChange={() => toggleUser(user.username)}
 className="w-4 h-4 border-2 border-[var(--border)] dark:border-[var(--border)] rounded bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] checked:bg-[var(--primary)] dark:checked:bg-[var(--primary)] checked:border-[var(--primary)] dark:checked:border-[var(--primary)] focus: focus:)] dark:focus:)] focus: appearance-none cursor-pointer"
 />
 {selectedUsers.has(user.username) && (
 <Check
 size={12}
 className="absolute left-0.5 top-0.5 text-[var(--foreground)] pointer-events-none"
 />
 )}
 </div>
 <span className="text-sm text-[var(--foreground)] ">
 {user.firstName} {user.lastName} ({user.username})
 </span>
 </label>
 ))
 ) : (
 <div className="px-4 py-8 text-center text-sm text-[var(--muted-foreground)]">
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
 <label className="block text-sm font-medium text-[var(--foreground)]">
 Authorizations
 </label>
 <div className="relative">
 <button
 onClick={() =>
 setActiveDropdown(activeDropdown === "authorizations" ? null : "authorizations")
 }
 className="w-full px-4 py-2 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg text-left text-[var(--foreground)]  flex items-center justify-between hover:bg-[var(--primary)]/10 transition-colors"
 >
 <span className="text-sm">
 {selectedAuthorizations.size > 0
 ? `${selectedAuthorizations.size} selected`
 : "Select authorizations..."}
 </span>
 <ChevronDown size={16} className="text-[var(--muted-foreground)]" />
 </button>

 {activeDropdown === "authorizations" && (
 <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg z-20 max-h-80 overflow-hidden flex flex-col">
 {/* Search within dropdown */}
 <div className="p-3 border-b border-[var(--border)] ">
 <div className="relative">
 <Search
 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--muted-foreground)]"
 size={16}
 />
 <input
 type="text"
 placeholder="Search authorizations..."
 value={authorizationSearch}
 onChange={(e) => setAuthorizationSearch(e.target.value)}
 className="w-full pl-9 pr-3 py-2 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded text-sm text-[var(--foreground)]  placeholder-zinc-500 focus:outline-none focus: focus:)] dark:focus:)]"
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
 className="flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--surface-container-low)] hover:bg-[var(--surface-container-high)] cursor-pointer transition-colors"
 >
 <div className="relative flex items-center">
 <input
 type="checkbox"
 checked={selectedAuthorizations.has(auth)}
 onChange={() => toggleAuthorization(auth)}
 className="w-4 h-4 border-2 border-[var(--border)] dark:border-[var(--border)] rounded bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] checked:bg-[var(--primary)] dark:checked:bg-[var(--primary)] checked:border-[var(--primary)] dark:checked:border-[var(--primary)] focus: focus:)] dark:focus:)] focus: appearance-none cursor-pointer"
 />
 {selectedAuthorizations.has(auth) && (
 <Check
 size={12}
 className="absolute left-0.5 top-0.5 text-[var(--foreground)] pointer-events-none"
 />
 )}
 </div>
 <span className="text-sm text-[var(--foreground)] ">
 {auth}
 </span>
 </label>
 ))
 ) : (
 <div className="px-4 py-8 text-center text-sm text-[var(--muted-foreground)]">
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
        <MasterTableContainer type="actionable">
          <MasterTable type="actionable">
            <MasterTableHead type="actionable">
              <tr>
                {deleteMode && (
                  <MasterTableTh type="actionable" density="compact" className="w-12">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                        ref={selectAllCheckboxRef}
                        className="w-4 h-4 border-2 border-[var(--border)] dark:border-[var(--border)] rounded bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] checked:bg-[var(--state-error)] checked:border-[var(--state-error)]/40 cursor-pointer"
                      />
                    </div>
                  </MasterTableTh>
                )}
                {sortedColumns.map((columnKey) => {
                  const isPinned = pinnedColumns.includes(columnKey);
                  return (
                    <MasterTableTh
                      key={columnKey}
                      type="actionable"
                      density="compact"
                      onClick={() => handleSort(columnKey as SortField)}
                      className={`cursor-pointer hover:bg-[var(--surface-container-high)] transition-colors select-none ${
                        isPinned
                          ? "bg-[var(--surface-container)] dark:bg-[var(--card)]/90 border-r-2 border-[var(--border)]"
                          : ""
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
                    </MasterTableTh>
                  );
                })}
              </tr>
            </MasterTableHead>
            <MasterTableBody type="actionable">
              {sortedData.map((group, index) => (
                <MasterTableRow
                  key={index}
                  type="actionable"
                  clickable={!deleteMode}
                  onClick={() => !deleteMode && handleEditGroup(group)}
                >
                  {deleteMode && (
                    <MasterTableCell type="actionable" density="compact">
                      <input
                        type="checkbox"
                        checked={selectedForDeletion.has(group.id)}
                        onChange={() => handleToggleGroupSelection(group.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-4 h-4 border-2 border-[var(--border)] dark:border-[var(--border)] rounded bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] checked:bg-[var(--state-error)] checked:border-[var(--state-error)]/40 cursor-pointer"
                      />
                    </MasterTableCell>
                  )}
                  {sortedColumns.map((columnKey) => {
                    const isPinned = pinnedColumns.includes(columnKey);
                    const isHoverable = columnKey === 'users' || columnKey === 'authorizations';
                    
                    return (
                      <MasterTableCell
                        key={columnKey}
                        type="actionable"
                        density="compact"
                        className={
                          isPinned
                            ? "bg-[var(--surface-container)] text-[var(--foreground)] border-r border-[var(--border)]"
                            : ""
                        }
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
                      </MasterTableCell>
                    );
                  })}
                </MasterTableRow>
              ))}
              {sortedData.length === 0 && (
                <MasterTableEmptyRow colSpan={deleteMode ? sortedColumns.length + 1 : sortedColumns.length}>
                  No groups found
                </MasterTableEmptyRow>
              )}
            </MasterTableBody>
          </MasterTable>
        </MasterTableContainer>

 {/* Tooltip */}
 {hoveredGroup && hoveredColumn && (
 <div
 className="fixed z-50 bg-[var(--surface-container-high)] text-[var(--foreground)] dark:bg-[var(--card)] border-[var(--border)]  rounded-lg p-4 max-w-md"
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
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-xl border-[var(--border)]  p-8 max-w-md w-full mx-4 ">
 <h3 className="text-xl font-bold text-[var(--foreground)]  mb-4">
 Confirm Delete
 </h3>
 <p className="text-[var(--foreground)] mb-6">
 Are you sure you want to delete {groupsToDelete.length} group{groupsToDelete.length !== 1 ? 's' : ''}?
 </p>
 <div className="space-y-2 mb-6 max-h-40 overflow-y-auto">
 {groupsToDelete.map((group) => (
 <div
 key={group.id}
 className="px-3 py-2 bg-[var(--surface-container-low)] dark:bg-[var(--card)] rounded text-sm text-[var(--foreground)] "
 >
 {group.name}
 </div>
 ))}
 </div>
 <div className="flex gap-3">
 <button
 onClick={handleCancelDelete}
 className="flex-1 px-4 py-3 bg-[var(--surface-container)] dark:bg-[var(--card)] hover:bg-[var(--surface-container-high)] text-[var(--foreground)]  rounded-lg font-medium transition-colors"
 >
 Cancel
 </button>
 <button
 onClick={handleExecuteDelete}
 className="flex-1 px-4 py-3 bg-[var(--state-error)] hover:bg-[var(--state-error-container)] text-[var(--state-error-foreground)] rounded-lg font-medium transition-colors"
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
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-xl border-[var(--border)]  p-8 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto">
 <h3 className="text-xl font-bold text-[var(--foreground)]  mb-4">
 {isAddMode ? 'Confirm New Group' : 'Confirm Changes'}
 </h3>
 <p className="text-[var(--foreground)] mb-6">
 Please review the group details before saving:
 </p>
 
 {/* Group Details */}
 <div className="space-y-4 mb-6 p-4 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-lg">
 <div>
 <label className="block text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wide mb-1">
 Group Name
 </label>
 <div className="text-sm font-medium text-[var(--foreground)] ">
 {formName}
 </div>
 </div>

 <div>
 <label className="block text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wide mb-1">
 Description
 </label>
 <div className="text-sm text-[var(--foreground)] ">
 {formDescription}
 </div>
 </div>

 <div>
 <label className="block text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wide mb-1">
 Screen Authorizations ({selectedScreenAuthorizations.size})
 </label>
 <div className="text-sm text-[var(--foreground)] ">
 {selectedScreenAuthorizations.size > 0 ? (
 <div className="flex flex-wrap gap-1 mt-2">
 {Array.from(selectedScreenAuthorizations).map((auth) => (
 <span key={auth} className="px-2 py-1 bg-[var(--primary)]/10 /10 text-[var(--primary)] dark:text-[var(--primary)] rounded text-xs border border-[var(--primary)]/20 dark:border-[var(--primary)]/20">
 {auth}
 </span>
 ))}
 </div>
 ) : (
 <span className="text-[var(--muted-foreground)] italic">None selected</span>
 )}
 </div>
 </div>

 <div>
 <label className="block text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wide mb-1">
 Function Authorizations ({selectedFunctionAuthorizations.size})
 </label>
 <div className="text-sm text-[var(--foreground)] ">
 {selectedFunctionAuthorizations.size > 0 ? (
 <div className="flex flex-wrap gap-1 mt-2">
 {Array.from(selectedFunctionAuthorizations).map((auth) => (
 <span key={auth} className="px-2 py-1 bg-[var(--primary)]/10 /10 text-[var(--primary)] dark:text-[var(--primary)] rounded text-xs border border-[var(--primary)]/20 dark:border-[var(--primary)]/20">
 {auth}
 </span>
 ))}
 </div>
 ) : (
 <span className="text-[var(--muted-foreground)] italic">None selected</span>
 )}
 </div>
 </div>

 <div>
 <label className="block text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wide mb-1">
 Users ({selectedGroupUsers.size})
 </label>
 <div className="text-sm text-[var(--foreground)] ">
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
 <span className="text-[var(--muted-foreground)] italic">None selected</span>
 )}
 </div>
 </div>
 </div>

 <div className="flex gap-3">
 <button
 onClick={handleCancelSave}
 className="flex-1 px-4 py-3 bg-[var(--surface-container)] dark:bg-[var(--card)] hover:bg-[var(--surface-container-high)] text-[var(--foreground)]  rounded-lg font-medium transition-colors"
 >
 Cancel
 </button>
 <button
 onClick={handleExecuteSave}
 className="flex-1 px-4 py-3 bg-[var(--primary)]  hover:opacity-90 active:scale-[0.98] text-[var(--primary-foreground)] rounded-lg font-medium transition-colors"
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
 </div>
 );
}