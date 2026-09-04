import { useState } from "react";
import {
 X,
 Shield,
 Check,
 Search,
 ChevronDown,
 Zap,
 Trash2,
 User,
 Info,
} from "lucide-react";
import { mockUserData, mockGroups, getAllAuthorizations, type Group } from "../data/mockGroupsAndUsers";
import { DetailSidePanel, PanelSection, PanelRow } from "./panels/DetailSidePanel";

type GroupDetailPanelProps = {
 isAddMode: boolean;
 selectedGroup: Group | null;
 activeTab: "details" | "authorizations" | "users" | "actions";
 setActiveTab: (tab: "details" | "authorizations" | "users" | "actions") => void;
 formName: string;
 setFormName: (value: string) => void;
 formDescription: string;
 setFormDescription: (value: string) => void;
 selectedScreenAuthorizations: Set<string>;
 selectedFunctionAuthorizations: Set<string>;
 setSelectedScreenAuthorizations: (value: Set<string>) => void;
 setSelectedFunctionAuthorizations: (value: Set<string>) => void;
 authorizationsSearch: string;
 setAuthorizationsSearch: (value: string) => void;
 selectedGroupUsers: Set<string>;
 setSelectedGroupUsers: (value: Set<string>) => void;
 groupUsersSearch: string;
 setGroupUsersSearch: (value: string) => void;
 onClose: () => void;
 onSave: () => void;
 onDelete?: (group: Group) => void;
 isSaveEnabled: boolean;
 saveButtonText: string;
};

export function GroupDetailPanel({
 isAddMode,
 selectedGroup,
 activeTab,
 setActiveTab,
 formName,
 setFormName,
 formDescription,
 setFormDescription,
 selectedScreenAuthorizations,
 selectedFunctionAuthorizations,
 setSelectedScreenAuthorizations,
 setSelectedFunctionAuthorizations,
 authorizationsSearch,
 setAuthorizationsSearch,
 selectedGroupUsers,
 setSelectedGroupUsers,
 groupUsersSearch,
 setGroupUsersSearch,
 onClose,
 onSave,
 onDelete,
 isSaveEnabled,
 saveButtonText,
}: GroupDetailPanelProps) {
 const [expandedAuthType, setExpandedAuthType] = useState<"Screens" | "Functions" | null>(null);

 // Get all unique authorizations grouped by type
 const allScreens = Array.from(new Set(mockGroups.flatMap(g => 
 g.authorizations.find(a => a.type === "Screens")?.items || []
 ))).sort();
 
 const allFunctions = Array.from(new Set(mockGroups.flatMap(g => 
 g.authorizations.find(a => a.type === "Functions")?.items || []
 ))).sort();

 // Filter authorizations based on search
 const filteredScreens = allScreens.filter(s => 
 s.toLowerCase().includes(authorizationsSearch.toLowerCase())
 );
 const filteredFunctions = allFunctions.filter(f => 
 f.toLowerCase().includes(authorizationsSearch.toLowerCase())
 );

 // Filter users based on search
 const filteredUsers = mockUserData.filter(user => 
 `${user.firstName} ${user.lastName} (${user.username})`.toLowerCase().includes(groupUsersSearch.toLowerCase())
 );

 // Toggle authorization
 const toggleScreenAuthorization = (auth: string) => {
 const newAuths = new Set(selectedScreenAuthorizations);
 if (newAuths.has(auth)) {
 newAuths.delete(auth);
 } else {
 newAuths.add(auth);
 }
 setSelectedScreenAuthorizations(newAuths);
 };

 const toggleFunctionAuthorization = (auth: string) => {
 const newAuths = new Set(selectedFunctionAuthorizations);
 if (newAuths.has(auth)) {
 newAuths.delete(auth);
 } else {
 newAuths.add(auth);
 }
 setSelectedFunctionAuthorizations(newAuths);
 };

 // Toggle user
 const toggleUser = (username: string) => {
 const newUsers = new Set(selectedGroupUsers);
 if (newUsers.has(username)) {
 newUsers.delete(username);
 } else {
 newUsers.add(username);
 }
 setSelectedGroupUsers(newUsers);
 };

  const tabs = [
    { id: "details", label: "Details" },
    {
      id: "authorizations",
      label: "Authorizations",
      badge: (selectedScreenAuthorizations.size + selectedFunctionAuthorizations.size) > 0 ? (
        <span className="px-1.5 py-0.5 bg-[var(--primary)] text-[var(--primary-foreground)] rounded text-xs">
          {selectedScreenAuthorizations.size + selectedFunctionAuthorizations.size}
        </span>
      ) : undefined,
    },
    {
      id: "users",
      label: "Users",
      badge: selectedGroupUsers.size > 0 ? (
        <span className="px-1.5 py-0.5 bg-[var(--primary)] text-[var(--primary-foreground)] rounded text-xs">
          {selectedGroupUsers.size}
        </span>
      ) : undefined,
    },
    ...(!isAddMode ? [{ id: "actions", label: "Actions", icon: <Zap size={16} />, isAction: true }] : []),
  ];

  const footerContent = (
    <div className="flex items-center justify-between">
      <p className="text-sm text-[var(--muted-foreground)]">
        {activeTab === "authorizations" && (
          <>
            {selectedScreenAuthorizations.size + selectedFunctionAuthorizations.size} authorization{selectedScreenAuthorizations.size + selectedFunctionAuthorizations.size !== 1 ? "s" : ""} selected
          </>
        )}
        {activeTab === "users" && (
          <>
            {selectedGroupUsers.size} user{selectedGroupUsers.size !== 1 ? "s" : ""} selected
          </>
        )}
      </p>
      <button
        onClick={onSave}
        disabled={!isSaveEnabled}
        className={`px-6 py-2.5 rounded-lg font-medium transition-colors cursor-pointer ${
          isSaveEnabled
            ? "bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 active:scale-[0.98]"
            : "bg-[var(--surface-container-high)] text-[var(--muted-foreground)] cursor-not-allowed"
        }`}
      >
        {saveButtonText}
      </button>
    </div>
  );

  return (
    <DetailSidePanel
      title={isAddMode ? "Add Group" : selectedGroup?.name}
      subtitle={isAddMode ? "Create a new group" : "Group Details & Assignments"}
      icon={<Shield size={24} className="text-[var(--primary)]" />}
      activeTab={activeTab}
      onTabChange={(tab) => setActiveTab(tab as any)}
      tabs={tabs}
      onClose={onClose}
      footer={footerContent}
    >
      {activeTab === "details" && (
        <div className="space-y-6">
          {/* Primary Section - Editable */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-4">
              Group Information
            </h4>
            <div className="bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] rounded-lg p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
 Name <span className="text-[var(--state-error)]">*</span>
 </label>
 <input
 type="text"
 value={formName}
 onChange={(e) => setFormName(e.target.value)}
 placeholder="Enter group name"
 className="w-full px-4 py-2 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] border border-[var(--border)]  rounded-lg text-[var(--foreground)]  placeholder-zinc-500 focus:outline-none focus: focus:)] dark:focus:)]"
 />
 </div>

 <div>
 <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
 Description <span className="text-[var(--state-error)]">*</span>
 </label>
 <textarea
 value={formDescription}
 onChange={(e) => setFormDescription(e.target.value)}
 placeholder="Enter group description"
 rows={4}
 className="w-full px-4 py-2 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] border border-[var(--border)]  rounded-lg text-[var(--foreground)]  placeholder-zinc-500 focus:outline-none focus: focus:)] dark:focus:)] resize-none"
 />
 </div>
 </div>
 </div>

            {/* Secondary Section - Read Only */}
            {!isAddMode && selectedGroup && (
              <div>
                <h4 className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-4">
                  Metadata
                </h4>
                <div className="bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-[var(--muted-foreground)]">Created</span>
                    <span className="font-mono text-sm text-[var(--foreground)]">{selectedGroup.created}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-[var(--muted-foreground)]">Created By</span>
                    <span className="text-sm text-[var(--foreground)]">{selectedGroup.createdBy}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-[var(--muted-foreground)]">Modified</span>
                    <span className="font-mono text-sm text-[var(--foreground)]">{selectedGroup.modified}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-[var(--muted-foreground)]">Modified By</span>
                    <span className="text-sm text-[var(--foreground)]">{selectedGroup.modifiedBy}</span>
                  </div>
                </div>
              </div>
            )}
 </div>
 )}

 {activeTab === "authorizations" && (
 <div className="space-y-4">
 {/* Search */}
 <div className="relative">
 <Search
 className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]"
 size={18}
 />
 <input
 type="text"
 placeholder="Search authorizations..."
 value={authorizationsSearch}
 onChange={(e) => setAuthorizationsSearch(e.target.value)}
 className="w-full pl-10 pr-4 py-3 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] border border-[var(--border)]  rounded-lg text-[var(--foreground)]  placeholder-zinc-500 focus:outline-none focus: focus:)] dark:focus:)]"
 />
 </div>

 {/* Authorization Groups */}
 <div className="space-y-4">
 {/* Screens */}
 <div className="border border-[var(--border)]  rounded-lg overflow-hidden">
 <button
 onClick={() => setExpandedAuthType(expandedAuthType === "Screens" ? null : "Screens")}
 className="w-full bg-[var(--surface-container-low)] dark:bg-[var(--card)] p-4 flex items-center justify-between hover:bg-[var(--surface-container-high)] transition-colors"
 >
 <div className="flex items-center gap-2">
 <span className="text-sm font-semibold text-[var(--foreground)] ">
 Screens
 </span>
 <span className="px-2 py-0.5 bg-[var(--primary)]/20 /20 text-[var(--primary)] dark:text-[var(--primary)] rounded text-xs font-medium">
 {selectedScreenAuthorizations.size} selected
 </span>
 </div>
 <ChevronDown
 size={18}
 className={`text-[var(--muted-foreground)] transition-transform ${
 expandedAuthType === "Screens" ? "rotate-180" : ""
 }`}
 />
 </button>

 {expandedAuthType === "Screens" && (
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] p-4 border-t border-[var(--border)] ">
 <div className="space-y-2 max-h-80 overflow-y-auto">
 {filteredScreens.length > 0 ? (
 filteredScreens.map((screen) => (
 <label
 key={screen}
 className="flex items-center gap-3 p-2 hover:bg-[var(--surface-container-lowest)] hover:bg-[var(--surface-container-high)] rounded cursor-pointer transition-colors"
 >
 <div className="relative flex items-center">
 <input
 type="checkbox"
 checked={selectedScreenAuthorizations.has(screen)}
 onChange={() => toggleScreenAuthorization(screen)}
 className="w-5 h-5 border-2 border-[var(--border)] dark:border-[var(--border)] rounded bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] checked:bg-[var(--primary)] dark:checked:bg-[var(--primary)] checked:border-[var(--primary)] dark:checked:border-[var(--primary)] focus: focus:)] dark:focus:)] focus: appearance-none cursor-pointer"
 />
 {selectedScreenAuthorizations.has(screen) && (
 <Check
 size={14}
 className="absolute left-0.5 top-0.5 text-[var(--primary-foreground)] pointer-events-none"
 />
 )}
 </div>
 <span className="text-sm text-[var(--foreground)] ">
 {screen}
 </span>
 </label>
 ))
 ) : (
 <div className="text-center py-8 text-[var(--muted-foreground)] text-sm">
 No screens found matching your search
 </div>
 )}
 </div>
 </div>
 )}
 </div>

 {/* Functions */}
 <div className="border border-[var(--border)]  rounded-lg overflow-hidden">
 <button
 onClick={() => setExpandedAuthType(expandedAuthType === "Functions" ? null : "Functions")}
 className="w-full bg-[var(--surface-container-low)] dark:bg-[var(--card)] p-4 flex items-center justify-between hover:bg-[var(--surface-container-high)] transition-colors"
 >
 <div className="flex items-center gap-2">
 <span className="text-sm font-semibold text-[var(--foreground)] ">
 Functions
 </span>
 <span className="px-2 py-0.5 bg-[var(--primary)]/20 /20 text-[var(--primary)] dark:text-[var(--primary)] rounded text-xs font-medium">
 {selectedFunctionAuthorizations.size} selected
 </span>
 </div>
 <ChevronDown
 size={18}
 className={`text-[var(--muted-foreground)] transition-transform ${
 expandedAuthType === "Functions" ? "rotate-180" : ""
 }`}
 />
 </button>

 {expandedAuthType === "Functions" && (
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] p-4 border-t border-[var(--border)] ">
 <div className="space-y-2 max-h-80 overflow-y-auto">
 {filteredFunctions.length > 0 ? (
 filteredFunctions.map((func) => (
 <label
 key={func}
 className="flex items-center gap-3 p-2 hover:bg-[var(--surface-container-lowest)] hover:bg-[var(--surface-container-high)] rounded cursor-pointer transition-colors"
 >
 <div className="relative flex items-center">
 <input
 type="checkbox"
 checked={selectedFunctionAuthorizations.has(func)}
 onChange={() => toggleFunctionAuthorization(func)}
 className="w-5 h-5 border-2 border-[var(--border)] dark:border-[var(--border)] rounded bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] checked:bg-[var(--primary)] dark:checked:bg-[var(--primary)] checked:border-[var(--primary)] dark:checked:border-[var(--primary)] focus: focus:)] dark:focus:)] focus: appearance-none cursor-pointer"
 />
 {selectedFunctionAuthorizations.has(func) && (
 <Check
 size={14}
 className="absolute left-0.5 top-0.5 text-[var(--primary-foreground)] pointer-events-none"
 />
 )}
 </div>
 <span className="text-sm text-[var(--foreground)] ">
 {func}
 </span>
 </label>
 ))
 ) : (
 <div className="text-center py-8 text-[var(--muted-foreground)] text-sm">
 No functions found matching your search
 </div>
 )}
 </div>
 </div>
 )}
 </div>
 </div>
 </div>
 )}

 {activeTab === "users" && (
 <div className="space-y-4">
 {/* Search */}
 <div className="relative">
 <Search
 className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]"
 size={18}
 />
 <input
 type="text"
 placeholder="Search users..."
 value={groupUsersSearch}
 onChange={(e) => setGroupUsersSearch(e.target.value)}
 className="w-full pl-10 pr-4 py-3 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] border border-[var(--border)]  rounded-lg text-[var(--foreground)]  placeholder-zinc-500 focus:outline-none focus: focus:)] dark:focus:)]"
 />
 </div>

 {/* Users List */}
 <div className="space-y-2">
 {filteredUsers.length > 0 ? (
 filteredUsers.map((user) => (
 <label
 key={user.username}
 className="flex items-center gap-3 p-4 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] border border-[var(--border)]  rounded-lg hover:bg-[var(--surface-container-lowest)] dark:hover:bg-[var(--surface-container-high)] cursor-pointer transition-colors"
 >
 <div className="relative flex items-center">
 <input
 type="checkbox"
 checked={selectedGroupUsers.has(user.username)}
 onChange={() => toggleUser(user.username)}
 className="w-5 h-5 border-2 border-[var(--border)] dark:border-[var(--border)] rounded bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] checked:bg-[var(--primary)] dark:checked:bg-[var(--primary)] checked:border-[var(--primary)] dark:checked:border-[var(--primary)] focus: focus:)] dark:focus:)] focus: appearance-none cursor-pointer"
 />
 {selectedGroupUsers.has(user.username) && (
 <Check
 size={14}
 className="absolute left-0.5 top-0.5 text-[var(--primary-foreground)] pointer-events-none"
 />
 )}
 </div>

 <div className="flex items-center gap-2">
 <User size={16} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 <div>
 <div className="text-sm font-medium text-[var(--foreground)] ">
 {user.firstName} {user.lastName}
 </div>
 <div className="text-xs text-[var(--muted-foreground)]">
 {user.username} • {user.email}
 </div>
 </div>
 </div>
 </label>
 ))
 ) : (
 <div className="text-center py-12 text-[var(--muted-foreground)]">
 No users found matching your search
 </div>
 )}
 </div>
 </div>
 )}

 {activeTab === "actions" && (
 <div className="space-y-4">
 {/* Delete Action */}
 {selectedGroup && (
 <div className="bg-[var(--state-error-container)] dark:bg-[var(--state-error-container)]/50 rounded-lg p-6 border-2 border-[var(--state-error)]/40 dark:border-[var(--state-error)]">
 <h4 className="text-sm font-semibold text-[var(--state-on-error-container)] dark:text-[var(--state-error)] uppercase tracking-wider mb-4">
 Delete Group
 </h4>

 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="block text-xs font-medium text-[var(--muted-foreground)] mb-1">
 Name
 </label>
 <p className="text-sm text-[var(--foreground)] ">
 {selectedGroup.name}
 </p>
 </div>

 <div>
 <label className="block text-xs font-medium text-[var(--muted-foreground)] mb-1">
 Description
 </label>
 <p className="text-sm text-[var(--foreground)] ">
 {selectedGroup.description}
 </p>
 </div>

 <div className="col-span-2">
 <button
 onClick={() => onDelete?.(selectedGroup)}
 className="px-6 py-2.5 rounded-lg font-medium transition-colors bg-[var(--state-error)] dark:bg-[var(--state-error-container)] text-[var(--state-error-foreground)] hover:bg-[var(--state-error)] dark:hover:bg-[var(--state-error)]"
 >
 Delete Group
 </button>
 </div>
 </div>
 </div>
 )}
 </div>
 )}
</DetailSidePanel>
  );
}
