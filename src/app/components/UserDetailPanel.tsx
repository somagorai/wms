import { useState } from "react";
import {
  X,
  User,
  Check,
  Eye,
  EyeOff,
  Search,
  ChevronDown,
  Zap,
  Trash2,
  Info,
  Shield,
} from "lucide-react";
import { DetailSidePanel, PanelSection, PanelRow } from "./panels/DetailSidePanel";

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

type Authorization = {
 type: "Screens" | "Functions";
 items: string[];
};

type Group = {
 id: string;
 name: string;
 description: string;
 authorizations: Authorization[];
};

type UserDetailPanelProps = {
 isAddMode: boolean;
 selectedUser: UserData | null;
 activeTab: "details" | "groups" | "actions";
 setActiveTab: (tab: "details" | "groups" | "actions") => void;
 formUsername: string;
 setFormUsername: (value: string) => void;
 formFirstName: string;
 setFormFirstName: (value: string) => void;
 formLastName: string;
 setFormLastName: (value: string) => void;
 formPassword: string;
 setFormPassword: (value: string) => void;
 formConfirmPassword: string;
 setFormConfirmPassword: (value: string) => void;
 formEmail: string;
 setFormEmail: (value: string) => void;
 formLocalization: string;
 setFormLocalization: (value: string) => void;
 formTheme: "Dark" | "Light";
 setFormTheme: (value: "Dark" | "Light") => void;
 formStatus: boolean;
 setFormStatus: (value: boolean) => void;
 selectedUserGroups: Set<string>;
 toggleUserGroup: (groupName: string) => void;
 groupsSearch: string;
 setGroupsSearch: (value: string) => void;
 expandedGroups: Set<string>;
 toggleExpandGroup: (groupId: string) => void;
 filteredGroupsForTab: Group[];
 onClose: () => void;
 onSave: () => void;
 onDelete?: (user: UserData) => void;
 isSaveEnabled: boolean;
 saveButtonText: string;
};

export function UserDetailPanel({
 isAddMode,
 selectedUser,
 activeTab,
 setActiveTab,
 formUsername,
 setFormUsername,
 formFirstName,
 setFormFirstName,
 formLastName,
 setFormLastName,
 formPassword,
 setFormPassword,
 formConfirmPassword,
 setFormConfirmPassword,
 formEmail,
 setFormEmail,
 formLocalization,
 setFormLocalization,
 formTheme,
 setFormTheme,
 formStatus,
 setFormStatus,
 selectedUserGroups,
 toggleUserGroup,
 groupsSearch,
 setGroupsSearch,
 expandedGroups,
 toggleExpandGroup,
 filteredGroupsForTab,
 onClose,
 onSave,
 onDelete,
 isSaveEnabled,
 saveButtonText,
}: UserDetailPanelProps) {
 const [showPassword, setShowPassword] = useState(false);
 const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const tabs = [
    { id: "details", label: "Details" },
    {
      id: "groups",
      label: "Groups",
      badge: selectedUserGroups.size > 0 ? (
        <span className="px-1.5 py-0.5 bg-[var(--primary)] text-[var(--primary-foreground)] rounded text-xs">
          {selectedUserGroups.size}
        </span>
      ) : undefined,
    },
    ...(!isAddMode ? [{ id: "actions", label: "Actions", icon: <Zap size={16} />, isAction: true }] : []),
  ];

  const footerContent = (
    <div className="flex items-center justify-between">
      <p className="text-sm text-[var(--muted-foreground)]">
        {activeTab === "groups" && (
          <>
            {selectedUserGroups.size} group{selectedUserGroups.size !== 1 ? "s" : ""} selected
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
      title={isAddMode ? "Add User" : selectedUser?.username}
      subtitle={isAddMode ? "Create a new user account" : "User Account Details"}
      icon={<User size={24} className="text-[var(--primary)]" />}
      status={!isAddMode && selectedUser ? selectedUser.status : undefined}
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
              User Information
            </h4>
              <div className="bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] rounded-lg p-4 space-y-4">
 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
 Username <span className="text-[var(--state-error)]">*</span>
 </label>
 <input
 type="text"
 value={formUsername}
 onChange={(e) => setFormUsername(e.target.value)}
 disabled={!isAddMode}
 className={`w-full px-4 py-2 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] border border-[var(--border)]  rounded-lg text-[var(--foreground)] placeholder-zinc-500 focus:outline-none focus: focus:)] dark:focus:)] ${
 !isAddMode ? "opacity-50 cursor-not-allowed" : ""
 }`}
 />
 {!isAddMode && (
 <p className="mt-1 text-xs text-[var(--muted-foreground)]">
 Username cannot be changed
 </p>
 )}
 </div>

 <div>
 <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
 Email <span className="text-[var(--state-error)]">*</span>
 </label>
 <input
 type="email"
 value={formEmail}
 onChange={(e) => setFormEmail(e.target.value)}
 className="w-full px-4 py-2 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] border border-[var(--border)]  rounded-lg text-[var(--foreground)]  placeholder-zinc-500 focus:outline-none focus: focus:)] dark:focus:)]"
 />
 </div>

 <div>
 <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
 First Name <span className="text-[var(--state-error)]">*</span>
 </label>
 <input
 type="text"
 value={formFirstName}
 onChange={(e) => setFormFirstName(e.target.value)}
 className="w-full px-4 py-2 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] border border-[var(--border)]  rounded-lg text-[var(--foreground)]  placeholder-zinc-500 focus:outline-none focus: focus:)] dark:focus:)]"
 />
 </div>

 <div>
 <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
 Last Name <span className="text-[var(--state-error)]">*</span>
 </label>
 <input
 type="text"
 value={formLastName}
 onChange={(e) => setFormLastName(e.target.value)}
 className="w-full px-4 py-2 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] border border-[var(--border)]  rounded-lg text-[var(--foreground)]  placeholder-zinc-500 focus:outline-none focus: focus:)] dark:focus:)]"
 />
 </div>

 <div>
 <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
 Password {isAddMode && <span className="text-[var(--state-error)]">*</span>}
 </label>
 <div className="relative">
 <input
 type={showPassword ? "text" : "password"}
 value={formPassword}
 onChange={(e) => setFormPassword(e.target.value)}
 placeholder={isAddMode ? "" : "Leave blank to keep current"}
 className="w-full px-4 py-2 pr-10 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] border border-[var(--border)]  rounded-lg text-[var(--foreground)]  placeholder-zinc-500 focus:outline-none focus: focus:)] dark:focus:)]"
 />
 <button
 type="button"
 onClick={() => setShowPassword(!showPassword)}
 className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] dark:hover:text-[var(--foreground)]"
 >
 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
 </button>
 </div>
 </div>

 <div>
 <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
 Confirm Password {isAddMode && <span className="text-[var(--state-error)]">*</span>}
 </label>
 <div className="relative">
 <input
 type={showConfirmPassword ? "text" : "password"}
 value={formConfirmPassword}
 onChange={(e) => setFormConfirmPassword(e.target.value)}
 placeholder={isAddMode ? "" : "Leave blank to keep current"}
 className="w-full px-4 py-2 pr-10 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] border border-[var(--border)]  rounded-lg text-[var(--foreground)]  placeholder-zinc-500 focus:outline-none focus: focus:)] dark:focus:)]"
 />
 <button
 type="button"
 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
 className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] dark:hover:text-[var(--foreground)]"
 >
 {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
 </button>
 </div>
 </div>

 <div>
 <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
 Localization
 </label>
 <select
 value={formLocalization}
 onChange={(e) => setFormLocalization(e.target.value)}
 className="w-full px-4 py-2 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] border border-[var(--border)]  rounded-lg text-[var(--foreground)]  focus:outline-none focus: focus:)] dark:focus:)]"
 >
 <option value="en-US">English (US)</option>
 <option value="en-GB">English (UK)</option>
 <option value="en-CA">English (Canada)</option>
 <option value="en-AU">English (Australia)</option>
 <option value="es-ES">Spanish (Spain)</option>
 <option value="fr-FR">French (France)</option>
 <option value="ko-KR">Korean (South Korea)</option>
 </select>
 </div>

 <div>
 <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
 Theme
 </label>
 <select
 value={formTheme}
 onChange={(e) => setFormTheme(e.target.value as "Dark" | "Light")}
 className="w-full px-4 py-2 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] border border-[var(--border)]  rounded-lg text-[var(--foreground)]  focus:outline-none focus: focus:)] dark:focus:)]"
 >
 <option value="Dark">Dark</option>
 <option value="Light">Light</option>
 </select>
 </div>

 <div className="col-span-2">
 <label className="flex items-center gap-3 cursor-pointer">
 <div className="relative flex items-center">
 <input
 type="checkbox"
 checked={formStatus}
 onChange={(e) => setFormStatus(e.target.checked)}
 className="w-5 h-5 border-2 border-[var(--border)] dark:border-[var(--border)] rounded bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] checked:bg-[var(--primary)] dark:checked:bg-[var(--primary)] checked:border-[var(--primary)] dark:checked:border-[var(--primary)] focus: focus:)] dark:focus:)] focus: appearance-none cursor-pointer"
 />
 {formStatus && (
 <Check
 size={14}
 className="absolute left-0.5 top-0.5 text-[var(--primary-foreground)] pointer-events-none"
 />
 )}
 </div>
 <span className="text-sm font-medium text-[var(--foreground)]">
 User Enabled
 </span>
 </label>
 </div>
 </div>
 </div>
            </div>

            {/* Secondary Section - Read Only */}
            {!isAddMode && selectedUser && (
              <div>
                <h4 className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-4">
                  Metadata
                </h4>
                <div className="bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-[var(--muted-foreground)]">Created</span>
                    <span className="font-mono text-sm text-[var(--foreground)]">{selectedUser.created}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-[var(--muted-foreground)]">Created By</span>
                    <span className="text-sm text-[var(--foreground)]">{selectedUser.createdBy}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-[var(--muted-foreground)]">Modified</span>
                    <span className="font-mono text-sm text-[var(--foreground)]">{selectedUser.modified}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-[var(--muted-foreground)]">Modified By</span>
                    <span className="text-sm text-[var(--foreground)]">{selectedUser.modifiedBy}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

 {activeTab === "groups" && (
 <div className="space-y-4">
 {/* Search */}
 <div className="relative">
 <Search
 className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]"
 size={18}
 />
 <input
 type="text"
 placeholder="Search groups..."
 value={groupsSearch}
 onChange={(e) => setGroupsSearch(e.target.value)}
 className="w-full pl-10 pr-4 py-3 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] border border-[var(--border)]  rounded-lg text-[var(--foreground)]  placeholder-zinc-500 focus:outline-none focus: focus:)] dark:focus:)]"
 />
 </div>

 {/* Groups List */}
 <div className="space-y-2">
 {filteredGroupsForTab.map((group) => (
 <div
 key={group.id}
 className="border border-[var(--border)]  rounded-lg overflow-hidden"
 >
 {/* Group Header */}
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] p-4">
 <div className="flex items-start gap-3">
 <div className="relative flex items-center pt-1">
 <input
 type="checkbox"
 checked={selectedUserGroups.has(group.name)}
 onChange={() => toggleUserGroup(group.name)}
 onClick={(e) => e.stopPropagation()}
 className="w-5 h-5 border-2 border-[var(--border)] dark:border-[var(--border)] rounded bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] checked:bg-[var(--primary)] dark:checked:bg-[var(--primary)] checked:border-[var(--primary)] dark:checked:border-[var(--primary)] focus: focus:)] dark:focus:)] focus: appearance-none cursor-pointer"
 />
 {selectedUserGroups.has(group.name) && (
 <Check
 size={14}
 className="absolute left-0.5 top-1.5 text-[var(--primary-foreground)] pointer-events-none"
 />
 )}
 </div>

 <div className="flex-1 min-w-0">
 <div className="flex items-center justify-between">
 <div>
 <h5 className="text-sm font-semibold text-[var(--foreground)] ">
 {group.name}
 </h5>
 <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
 {group.description}
 </p>
 </div>

 <button
 onClick={() => toggleExpandGroup(group.id)}
 className="p-1 hover:bg-[var(--surface-container-low)] dark:hover:bg-[var(--surface-container-high)] rounded transition-colors"
 >
 <ChevronDown
 size={18}
 className={`text-[var(--muted-foreground)] transition-transform ${
 expandedGroups.has(group.id) ? "rotate-180" : ""
 }`}
 />
 </button>
 </div>
 </div>
 </div>
 </div>

 {/* Expanded Authorization Details */}
 {expandedGroups.has(group.id) && (
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] p-4 border-t border-[var(--border)] ">
 <h6 className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-3">
 Authorizations
 </h6>
 <div className="space-y-3">
 {group.authorizations.map((auth, index) => (
 <div key={index}>
 <div className="flex items-center gap-2 mb-1">
 <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] " />
 <span className="text-sm font-medium text-[var(--foreground)] ">
 {auth.type}
 </span>
 </div>
 <div className="ml-4 flex flex-wrap gap-1">
 {auth.items.map((permission, pIndex) => (
 <span
 key={pIndex}
 className="px-2 py-0.5 text-xs bg-[var(--primary)]/10 /10 text-[var(--primary)] dark:text-[var(--primary)] rounded border border-[var(--primary)]/20 dark:border-[var(--primary)]/20"
 >
 {permission}
 </span>
 ))}
 </div>
 </div>
 ))}
 </div>
 </div>
 )}
 </div>
 ))}

 {filteredGroupsForTab.length === 0 && (
 <div className="text-center py-12 text-[var(--muted-foreground)]">
 No groups found matching your search
 </div>
 )}
 </div>
 </div>
 )}

 {activeTab === "actions" && (
 <div className="space-y-4">
 {/* Delete Action */}
 {selectedUser && (
 <div className="bg-[var(--state-error-container)] dark:bg-[var(--state-error-container)]/50 rounded-lg p-6 border-2 border-[var(--state-error)]/40 dark:border-[var(--state-error)]">
 <h4 className="text-sm font-semibold text-[var(--state-on-error-container)] dark:text-[var(--state-error)] uppercase tracking-wider mb-4">
 Delete User
 </h4>

 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="block text-xs font-medium text-[var(--muted-foreground)] mb-1">
 Username
 </label>
 <p className="text-sm text-[var(--foreground)] ">
 {selectedUser.username}
 </p>
 </div>

 <div>
 <label className="block text-xs font-medium text-[var(--muted-foreground)] mb-1">
 Email
 </label>
 <p className="text-sm text-[var(--foreground)] ">
 {selectedUser.email}
 </p>
 </div>

 <div className="col-span-2">
 <button
 onClick={() => onDelete?.(selectedUser)}
 className="px-6 py-2.5 rounded-lg font-medium transition-colors bg-[var(--state-error)] dark:bg-[var(--state-error-container)] text-[var(--state-error-foreground)] hover:bg-[var(--state-error)] dark:hover:bg-[var(--state-error)]"
 >
 Delete User
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