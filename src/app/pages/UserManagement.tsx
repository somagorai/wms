import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useLayout } from "../contexts/LayoutContext";
import { UserDetailPanel } from "../components/UserDetailPanel";
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
 Users,
 RefreshCw,
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
 return <CheckCircle2 size={16} className="text-[var(--state-success)]" />;
 case "Inactive":
 return <XCircle size={16} className="text-[var(--muted-foreground)]" />;
 case "Locked":
 return <Clock size={16} className="text-[var(--state-error)]" />;
 default:
 return <CheckCircle2 size={16} className="text-[var(--muted-foreground)]" />;
 }
};

const getStatusColor = (status: string) => {
 switch (status) {
 case "Active":
 return "text-[var(--state-success)]";
 case "Inactive":
 return "text-[var(--muted-foreground)]";
 case "Locked":
 return "text-[var(--state-error)]";
 default:
 return "text-[var(--muted-foreground)]";
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
 <User size={14} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 <span className="text-[var(--foreground)] font-medium">{value}</span>
 </div>
 );
 case "firstName":
 case "lastName":
 return <span className="text-[var(--foreground)] font-medium">{value}</span>;
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
 <Moon size={14} className="text-[var(--muted-foreground)]" />
 ) : (
 <Sun size={14} className="text-[var(--state-warning)]" />
 )}
 <span className="text-[var(--muted-foreground)]">{value}</span>
 </div>
 );
 case "localization":
 return (
 <div className="flex items-center gap-2">
 <Globe size={14} className="text-[var(--muted-foreground)]" />
 <span className="text-[var(--muted-foreground)]">{value}</span>
 </div>
 );
 default:
 return <span className="text-[var(--muted-foreground)]">{value}</span>;
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
 <Users size={20} className="text-[var(--primary)] dark:text-[var(--primary)]" />User Management
 </span>
 </nav>
 <div className="flex items-center gap-2">
 <button onClick={() => {}} className="p-2 rounded-lg border border-[var(--border)]  bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] hover:bg-[var(--surface-container-low)] dark:hover:bg-[var(--surface-container-high)] text-[var(--muted-foreground)] transition-colors" title="Refresh"><RefreshCw size={16} /></button>
 <button className="p-2 rounded-lg border border-[var(--border)]  bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] hover:bg-[var(--surface-container-low)] dark:hover:bg-[var(--surface-container-high)] text-[var(--muted-foreground)] transition-colors" title="Export"><Download size={16} /></button>
 <button onClick={() => setShowFilterPanel(!showFilterPanel)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 border ${showFilterPanel || hasActiveFilters ? "bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90" : "bg-[var(--surface-container-high)] text-[var(--foreground)] hover:bg-[var(--surface-container-highest)] border border-transparent"}`}>
 <Filter size={16} />Filter{hasActiveFilters && <span className="px-1.5 py-0.5 bg-white/25 rounded text-xs">{totalFilterCount}</span>}
 </button>
 </div>
 </div>

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
 placeholder="Search users..."
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 className="w-full pl-12 pr-4 py-3 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] border border-[var(--border)]  rounded-lg text-[var(--foreground)]  placeholder-zinc-500 focus:outline-none focus: focus:)] dark:focus:)]"
 />
 </div>
 <button 
 title="Add User"
 className="p-3 bg-[var(--primary)]  text-[var(--primary-foreground)] rounded-lg hover:opacity-90 active:scale-[0.98] transition-colors flex items-center justify-center border border-[var(--primary)] dark:border-[var(--primary)]"
 onClick={handleAddUser}
 >
 <Plus size={18} />
 </button>
 <button 
 title={deleteMode ? "Cancel Delete" : "Delete Users"}
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
 <div className="mb-6 p-6 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] border border-[var(--border)]  rounded-lg">
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
 {/* Groups Filter */}
 <div className="space-y-2">
 <label className="block text-sm font-medium text-[var(--foreground)]">
 Groups
 </label>
 <div className="relative">
 <button
 onClick={() =>
 setActiveDropdown(activeDropdown === "groups" ? null : "groups")
 }
 className="w-full px-4 py-2 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] border border-[var(--border)]  rounded-lg text-left text-[var(--foreground)]  flex items-center justify-between hover:bg-[var(--primary)]/10 transition-colors"
 >
 <span className="text-sm">
 {selectedGroups.size > 0
 ? `${selectedGroups.size} selected`
 : "Select groups..."}
 </span>
 <ChevronDown size={16} className="text-[var(--muted-foreground)]" />
 </button>

 {activeDropdown === "groups" && (
 <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] border border-[var(--border)]  rounded-lg z-20 max-h-80 overflow-hidden flex flex-col">
 {/* Search within dropdown */}
 <div className="p-3 border-b border-[var(--border)] ">
 <div className="relative">
 <Search
 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--muted-foreground)]"
 size={16}
 />
 <input
 type="text"
 placeholder="Search groups..."
 value={groupSearch}
 onChange={(e) => setGroupSearch(e.target.value)}
 className="w-full pl-9 pr-3 py-2 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] border border-[var(--border)]  rounded text-sm text-[var(--foreground)]  placeholder-zinc-500 focus:outline-none focus: focus:)] dark:focus:)]"
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
 className="flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--surface-container-low)] hover:bg-[var(--surface-container-high)] cursor-pointer transition-colors"
 >
 <div className="relative flex items-center">
 <input
 type="checkbox"
 checked={selectedGroups.has(group)}
 onChange={() => toggleGroup(group)}
 className="w-4 h-4 border-2 border-[var(--border)] dark:border-[var(--border)] rounded bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] checked:bg-[var(--primary)] dark:checked:bg-[var(--primary)] checked:border-[var(--primary)] dark:checked:border-[var(--primary)] focus: focus:)] dark:focus:)] focus: appearance-none cursor-pointer"
 />
 {selectedGroups.has(group) && (
 <Check
 size={12}
 className="absolute left-0.5 top-0.5 text-[var(--foreground)] pointer-events-none"
 />
 )}
 </div>
 <span className="text-sm text-[var(--foreground)] ">
 {group}
 </span>
 </label>
 ))
 ) : (
 <div className="px-4 py-8 text-center text-sm text-[var(--muted-foreground)]">
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
 <label className="block text-sm font-medium text-[var(--foreground)]">
 Authorizations
 </label>
 <div className="relative">
 <button
 onClick={() =>
 setActiveDropdown(activeDropdown === "authorizations" ? null : "authorizations")
 }
 className="w-full px-4 py-2 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] border border-[var(--border)]  rounded-lg text-left text-[var(--foreground)]  flex items-center justify-between hover:bg-[var(--primary)]/10 transition-colors"
 >
 <span className="text-sm">
 {selectedAuthorizations.size > 0
 ? `${selectedAuthorizations.size} selected`
 : "Select authorizations..."}
 </span>
 <ChevronDown size={16} className="text-[var(--muted-foreground)]" />
 </button>

 {activeDropdown === "authorizations" && (
 <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] border border-[var(--border)]  rounded-lg z-20 max-h-80 overflow-hidden flex flex-col">
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
 className="w-full pl-9 pr-3 py-2 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] border border-[var(--border)]  rounded text-sm text-[var(--foreground)]  placeholder-zinc-500 focus:outline-none focus: focus:)] dark:focus:)]"
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
 className="w-4 h-4 border-2 border-[var(--border)] dark:border-[var(--border)] rounded bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] checked:bg-[var(--primary)] dark:checked:bg-[var(--primary)] checked:border-[var(--primary)] dark:checked:border-[var(--primary)] focus: focus:)] dark:focus:)] focus: appearance-none cursor-pointer"
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

 <div className="flex-1 overflow-y-auto px-8 pt-4 pb-8">
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
              {sortedData.map((user, index) => (
                <MasterTableRow
                  key={index}
                  type="actionable"
                  clickable
                  onClick={(e) => {
                    // Don't open detail panel if clicking checkbox
                    if (deleteMode && (e.target as HTMLElement).closest('input[type="checkbox"]')) {
                      return;
                    }
                    handleEditUser(user);
                  }}
                >
                  {deleteMode && (
                    <MasterTableCell type="actionable" density="compact">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedForDeletion.has(user.username)}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleToggleUserSelection(user.username);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="w-4 h-4 border-2 border-[var(--border)] dark:border-[var(--border)] rounded bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] checked:bg-[var(--state-error)] checked:border-[var(--state-error)]/40 cursor-pointer"
                        />
                        {selectedForDeletion.has(user.username) && (
                          <Check
                            size={12}
                            className="absolute left-0.5 top-0.5 text-[var(--foreground)] pointer-events-none"
                          />
                        )}
                      </div>
                    </MasterTableCell>
                  )}
                  {sortedColumns.map((columnKey) => {
                    const isPinned = pinnedColumns.includes(columnKey);
                    return (
                      <MasterTableCell
                        key={columnKey}
                        type="actionable"
                        density="compact"
                        className={
                          isPinned
                            ? "bg-[var(--surface-container)] text-[var(--foreground)] border-r-2 border-[var(--border)]"
                            : ""
                        }
                        style={getPinnedColumnStyle(columnKey)}
                      >
                        {renderCellContent(user, columnKey as ColumnKey)}
                      </MasterTableCell>
                    );
                  })}
                </MasterTableRow>
              ))}
              {sortedData.length === 0 && (
                <MasterTableEmptyRow colSpan={deleteMode ? sortedColumns.length + 1 : sortedColumns.length}>
                  No users found matching your search
                </MasterTableEmptyRow>
              )}
            </MasterTableBody>
          </MasterTable>
        </MasterTableContainer>

        {/* Footer with count */}
        <div className="bg-[var(--surface-container-low)] dark:bg-[var(--card)] px-6 py-4 border-t-2 border-[var(--border)] ">
          <p className="text-sm text-[var(--muted-foreground)]">
            Showing {sortedData.length} of {mockUserData.length} users
          </p>
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
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] rounded-xl border-2 border-[var(--border)]  max-w-2xl w-full mx-4">
 <div className="p-6 border-b border-[var(--border)] ">
 <h3 className="text-xl font-semibold text-[var(--foreground)] ">
 Confirm Delete
 </h3>
 </div>
 <div className="p-6">
 <p className="text-[var(--foreground)] mb-4">
 Are you sure you want to delete the following user{usersToDelete.length > 1 ? 's' : ''}?
 </p>
 <div className="bg-[var(--surface-container-low)] dark:bg-[var(--card)] rounded-lg p-4 max-h-60 overflow-y-auto">
 <ul className="space-y-2">
 {usersToDelete.map((user, index) => (
 <li key={index} className="flex items-center gap-3 text-[var(--foreground)] ">
 <User size={16} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 <span className="font-medium">{user.username}</span>
 <span className="text-[var(--muted-foreground)]">-</span>
 <span className="text-[var(--muted-foreground)]">
 {user.firstName} {user.lastName}
 </span>
 </li>
 ))}
 </ul>
 </div>
 <p className="text-sm text-[var(--state-error)] mt-4">
 This action cannot be undone.
 </p>
 </div>
 <div className="p-6 border-t-2 border-[var(--border)]  flex justify-end gap-3">
 <button
 onClick={handleCancelDelete}
 className="px-4 py-2 bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)] text-[var(--foreground)]  rounded-lg hover:bg-[var(--surface-container-high)] transition-colors"
 >
 Cancel
 </button>
 <button
 onClick={handleExecuteDelete}
 className="px-4 py-2 bg-[var(--state-error-container)] text-[var(--state-on-error-container)] rounded-lg hover:bg-[var(--state-error)] transition-colors flex items-center gap-2"
 >
 <Trash2 size={18} />
 <span>Delete {usersToDelete.length > 1 ? `(${usersToDelete.length})` : ''}</span>
 </button>
 </div>
 </div>
 </div>
 )}
 </div>
 </div>
 );
}