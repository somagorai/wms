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
} from "lucide-react";

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

  return (
    <div className="fixed right-0 top-0 h-full w-[700px] bg-white dark:bg-zinc-900 border-l-2 border-zinc-300 dark:border-zinc-700 shadow-2xl z-50 overflow-hidden flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="bg-zinc-100 dark:bg-zinc-800 border-b-2 border-zinc-300 dark:border-zinc-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <User className="text-[#0d9488] dark:text-[#50e080]" size={24} />
            <div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                {isAddMode ? "Add User" : `Edit User: ${selectedUser?.username}`}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {isAddMode ? "Create a new user account" : "Modify user details and group assignments"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"
          >
            <X size={20} className="text-zinc-600 dark:text-zinc-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-zinc-800 dark:border-zinc-700">
          <button
            onClick={() => setActiveTab("details")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "details"
                ? "border-[#0d9488] dark:border-[#50e080] text-zinc-900 dark:text-white"
                : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab("groups")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "groups"
                ? "border-[#0d9488] dark:border-[#50e080] text-zinc-900 dark:text-white"
                : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            Groups{" "}
            {selectedUserGroups.size > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-black/20 rounded text-xs">
                {selectedUserGroups.size}
              </span>
            )}
          </button>
          {!isAddMode && (
            <button
              onClick={() => setActiveTab("actions")}
              className={`ml-auto px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === "actions"
                  ? "border-orange-500 text-zinc-900 dark:text-white bg-orange-500/10"
                  : "border-transparent text-orange-400 hover:text-orange-300 hover:bg-orange-500/5"
              }`}
            >
              <Zap size={16} />
              Actions
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === "details" && (
          <div className="space-y-6">
            {/* Primary Section - Editable */}
            <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-6 border-2 border-zinc-300 dark:border-zinc-700">
              <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-4">
                User Information
              </h4>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formUsername}
                    onChange={(e) => setFormUsername(e.target.value)}
                    disabled={!isAddMode}
                    className={`w-full px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#0d9488] dark:focus:ring-[#50e080] ${
                      !isAddMode ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  />
                  {!isAddMode && (
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                      Username cannot be changed
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#0d9488] dark:focus:ring-[#50e080]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formFirstName}
                    onChange={(e) => setFormFirstName(e.target.value)}
                    className="w-full px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#0d9488] dark:focus:ring-[#50e080]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formLastName}
                    onChange={(e) => setFormLastName(e.target.value)}
                    className="w-full px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#0d9488] dark:focus:ring-[#50e080]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Password {isAddMode && <span className="text-red-500">*</span>}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formPassword}
                      onChange={(e) => setFormPassword(e.target.value)}
                      placeholder={isAddMode ? "" : "Leave blank to keep current"}
                      className="w-full px-4 py-2 pr-10 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#0d9488] dark:focus:ring-[#50e080]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Confirm Password {isAddMode && <span className="text-red-500">*</span>}
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={formConfirmPassword}
                      onChange={(e) => setFormConfirmPassword(e.target.value)}
                      placeholder={isAddMode ? "" : "Leave blank to keep current"}
                      className="w-full px-4 py-2 pr-10 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#0d9488] dark:focus:ring-[#50e080]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Localization
                  </label>
                  <select
                    value={formLocalization}
                    onChange={(e) => setFormLocalization(e.target.value)}
                    className="w-full px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0d9488] dark:focus:ring-[#50e080]"
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
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Theme
                  </label>
                  <select
                    value={formTheme}
                    onChange={(e) => setFormTheme(e.target.value as "Dark" | "Light")}
                    className="w-full px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0d9488] dark:focus:ring-[#50e080]"
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
                        className="w-5 h-5 border-2 border-zinc-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-900 checked:bg-[#0d9488] dark:checked:bg-[#50e080] checked:border-[#0d9488] dark:checked:border-[#50e080] focus:ring-2 focus:ring-[#0d9488] dark:focus:ring-[#50e080] focus:ring-offset-0 appearance-none cursor-pointer"
                      />
                      {formStatus && (
                        <Check
                          size={14}
                          className="absolute left-0.5 top-0.5 text-white pointer-events-none"
                        />
                      )}
                    </div>
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      User Enabled
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Secondary Section - Read Only */}
            {!isAddMode && selectedUser && (
              <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-6 border-2 border-zinc-300 dark:border-zinc-700">
                <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-4">
                  System Information
                </h4>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                      Created
                    </label>
                    <p className="text-sm text-zinc-900 dark:text-white">
                      {selectedUser.created}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                      Created By
                    </label>
                    <p className="text-sm text-zinc-900 dark:text-white">
                      {selectedUser.createdBy}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                      Modified
                    </label>
                    <p className="text-sm text-zinc-900 dark:text-white">
                      {selectedUser.modified}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                      Modified By
                    </label>
                    <p className="text-sm text-zinc-900 dark:text-white">
                      {selectedUser.modifiedBy}
                    </p>
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
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                size={18}
              />
              <input
                type="text"
                placeholder="Search groups..."
                value={groupsSearch}
                onChange={(e) => setGroupsSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#0d9488] dark:focus:ring-[#50e080]"
              />
            </div>

            {/* Groups List */}
            <div className="space-y-2">
              {filteredGroupsForTab.map((group) => (
                <div
                  key={group.id}
                  className="border border-zinc-300 dark:border-zinc-700 rounded-lg overflow-hidden"
                >
                  {/* Group Header */}
                  <div className="bg-white dark:bg-zinc-800 p-4">
                    <div className="flex items-start gap-3">
                      <div className="relative flex items-center pt-1">
                        <input
                          type="checkbox"
                          checked={selectedUserGroups.has(group.name)}
                          onChange={() => toggleUserGroup(group.name)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-5 h-5 border-2 border-zinc-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-900 checked:bg-[#0d9488] dark:checked:bg-[#50e080] checked:border-[#0d9488] dark:checked:border-[#50e080] focus:ring-2 focus:ring-[#0d9488] dark:focus:ring-[#50e080] focus:ring-offset-0 appearance-none cursor-pointer"
                        />
                        {selectedUserGroups.has(group.name) && (
                          <Check
                            size={14}
                            className="absolute left-0.5 top-1.5 text-white pointer-events-none"
                          />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="text-sm font-semibold text-zinc-900 dark:text-white">
                              {group.name}
                            </h5>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                              {group.description}
                            </p>
                          </div>

                          <button
                            onClick={() => toggleExpandGroup(group.id)}
                            className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded transition-colors"
                          >
                            <ChevronDown
                              size={18}
                              className={`text-zinc-500 transition-transform ${
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
                    <div className="bg-zinc-50 dark:bg-zinc-900 p-4 border-t border-zinc-300 dark:border-zinc-700">
                      <h6 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
                        Authorizations
                      </h6>
                      <div className="space-y-3">
                        {group.authorizations.map((auth, index) => (
                          <div key={index}>
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#0d9488] dark:bg-[#50e080]" />
                              <span className="text-sm font-medium text-zinc-900 dark:text-white">
                                {auth.type}
                              </span>
                            </div>
                            <div className="ml-4 flex flex-wrap gap-1">
                              {auth.items.map((permission, pIndex) => (
                                <span
                                  key={pIndex}
                                  className="px-2 py-0.5 text-xs bg-[#0d9488]/10 dark:bg-[#50e080]/10 text-[#0d9488] dark:text-[#50e080] rounded border border-[#0d9488]/20 dark:border-[#50e080]/20"
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
                <div className="text-center py-12 text-zinc-500">
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
              <div className="bg-red-50 dark:bg-red-900/50 rounded-lg p-6 border-2 border-red-300 dark:border-red-700">
                <h4 className="text-sm font-semibold text-red-700 dark:text-red-300 uppercase tracking-wider mb-4">
                  Delete User
                </h4>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                      Username
                    </label>
                    <p className="text-sm text-zinc-900 dark:text-white">
                      {selectedUser.username}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                      Email
                    </label>
                    <p className="text-sm text-zinc-900 dark:text-white">
                      {selectedUser.email}
                    </p>
                  </div>

                  <div className="col-span-2">
                    <button
                      onClick={() => onDelete?.(selectedUser)}
                      className="px-6 py-2.5 rounded-lg font-medium transition-colors bg-red-500 dark:bg-red-600 text-white hover:bg-red-600 dark:hover:bg-red-500"
                    >
                      Delete User
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer with Save Button */}
      <div className="bg-zinc-100 dark:bg-zinc-800 border-t-2 border-zinc-300 dark:border-zinc-700 p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {activeTab === "groups" && (
              <>
                {selectedUserGroups.size} group{selectedUserGroups.size !== 1 ? "s" : ""} selected
              </>
            )}
          </p>
          <button
            onClick={onSave}
            disabled={!isSaveEnabled}
            className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
              isSaveEnabled
                ? "bg-[#0d9488] dark:bg-[#50e080] text-white hover:bg-[#0b7a70] dark:hover:bg-[#3bc76a]"
                : "bg-zinc-300 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-500 cursor-not-allowed"
            }`}
          >
            {saveButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}