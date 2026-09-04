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
} from "lucide-react";
import { mockUserData, mockGroups, getAllAuthorizations, type Group } from "../data/mockGroupsAndUsers";

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

  return (
    <div className="fixed right-0 top-0 h-full w-[700px] bg-white dark:bg-zinc-900 border-l-2 border-zinc-300 dark:border-zinc-700 shadow-2xl z-50 overflow-hidden flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="bg-zinc-100 dark:bg-zinc-800 border-b-2 border-zinc-300 dark:border-zinc-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Shield className="text-[#0d9488] dark:text-[#50e080]" size={24} />
            <div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                {isAddMode ? "Add Group" : `Edit Group: ${selectedGroup?.name}`}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {isAddMode ? "Create a new group" : "Modify group details and assignments"}
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
            onClick={() => setActiveTab("authorizations")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "authorizations"
                ? "border-[#0d9488] dark:border-[#50e080] text-zinc-900 dark:text-white"
                : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            Authorizations{" "}
            {(selectedScreenAuthorizations.size + selectedFunctionAuthorizations.size) > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-black/20 rounded text-xs">
                {selectedScreenAuthorizations.size + selectedFunctionAuthorizations.size}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "users"
                ? "border-[#0d9488] dark:border-[#50e080] text-zinc-900 dark:text-white"
                : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            Users{" "}
            {selectedGroupUsers.size > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-black/20 rounded text-xs">
                {selectedGroupUsers.size}
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
                Group Information
              </h4>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Enter group name"
                    className="w-full px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#0d9488] dark:focus:ring-[#50e080]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Enter group description"
                    rows={4}
                    className="w-full px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#0d9488] dark:focus:ring-[#50e080] resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Secondary Section - Read Only */}
            {!isAddMode && selectedGroup && (
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
                      {selectedGroup.created}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                      Created By
                    </label>
                    <p className="text-sm text-zinc-900 dark:text-white">
                      {selectedGroup.createdBy}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                      Modified
                    </label>
                    <p className="text-sm text-zinc-900 dark:text-white">
                      {selectedGroup.modified}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                      Modified By
                    </label>
                    <p className="text-sm text-zinc-900 dark:text-white">
                      {selectedGroup.modifiedBy}
                    </p>
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
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                size={18}
              />
              <input
                type="text"
                placeholder="Search authorizations..."
                value={authorizationsSearch}
                onChange={(e) => setAuthorizationsSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#0d9488] dark:focus:ring-[#50e080]"
              />
            </div>

            {/* Authorization Groups */}
            <div className="space-y-4">
              {/* Screens */}
              <div className="border border-zinc-300 dark:border-zinc-700 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedAuthType(expandedAuthType === "Screens" ? null : "Screens")}
                  className="w-full bg-zinc-100 dark:bg-zinc-800 p-4 flex items-center justify-between hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                      Screens
                    </span>
                    <span className="px-2 py-0.5 bg-[#0d9488]/20 dark:bg-[#50e080]/20 text-[#0d9488] dark:text-[#50e080] rounded text-xs font-medium">
                      {selectedScreenAuthorizations.size} selected
                    </span>
                  </div>
                  <ChevronDown
                    size={18}
                    className={`text-zinc-500 transition-transform ${
                      expandedAuthType === "Screens" ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {expandedAuthType === "Screens" && (
                  <div className="bg-white dark:bg-zinc-900 p-4 border-t border-zinc-300 dark:border-zinc-700">
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {filteredScreens.length > 0 ? (
                        filteredScreens.map((screen) => (
                          <label
                            key={screen}
                            className="flex items-center gap-3 p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded cursor-pointer transition-colors"
                          >
                            <div className="relative flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedScreenAuthorizations.has(screen)}
                                onChange={() => toggleScreenAuthorization(screen)}
                                className="w-5 h-5 border-2 border-zinc-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-900 checked:bg-[#0d9488] dark:checked:bg-[#50e080] checked:border-[#0d9488] dark:checked:border-[#50e080] focus:ring-2 focus:ring-[#0d9488] dark:focus:ring-[#50e080] focus:ring-offset-0 appearance-none cursor-pointer"
                              />
                              {selectedScreenAuthorizations.has(screen) && (
                                <Check
                                  size={14}
                                  className="absolute left-0.5 top-0.5 text-white pointer-events-none"
                                />
                              )}
                            </div>
                            <span className="text-sm text-zinc-900 dark:text-white">
                              {screen}
                            </span>
                          </label>
                        ))
                      ) : (
                        <div className="text-center py-8 text-zinc-500 text-sm">
                          No screens found matching your search
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Functions */}
              <div className="border border-zinc-300 dark:border-zinc-700 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedAuthType(expandedAuthType === "Functions" ? null : "Functions")}
                  className="w-full bg-zinc-100 dark:bg-zinc-800 p-4 flex items-center justify-between hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                      Functions
                    </span>
                    <span className="px-2 py-0.5 bg-[#0d9488]/20 dark:bg-[#50e080]/20 text-[#0d9488] dark:text-[#50e080] rounded text-xs font-medium">
                      {selectedFunctionAuthorizations.size} selected
                    </span>
                  </div>
                  <ChevronDown
                    size={18}
                    className={`text-zinc-500 transition-transform ${
                      expandedAuthType === "Functions" ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {expandedAuthType === "Functions" && (
                  <div className="bg-white dark:bg-zinc-900 p-4 border-t border-zinc-300 dark:border-zinc-700">
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {filteredFunctions.length > 0 ? (
                        filteredFunctions.map((func) => (
                          <label
                            key={func}
                            className="flex items-center gap-3 p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded cursor-pointer transition-colors"
                          >
                            <div className="relative flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedFunctionAuthorizations.has(func)}
                                onChange={() => toggleFunctionAuthorization(func)}
                                className="w-5 h-5 border-2 border-zinc-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-900 checked:bg-[#0d9488] dark:checked:bg-[#50e080] checked:border-[#0d9488] dark:checked:border-[#50e080] focus:ring-2 focus:ring-[#0d9488] dark:focus:ring-[#50e080] focus:ring-offset-0 appearance-none cursor-pointer"
                              />
                              {selectedFunctionAuthorizations.has(func) && (
                                <Check
                                  size={14}
                                  className="absolute left-0.5 top-0.5 text-white pointer-events-none"
                                />
                              )}
                            </div>
                            <span className="text-sm text-zinc-900 dark:text-white">
                              {func}
                            </span>
                          </label>
                        ))
                      ) : (
                        <div className="text-center py-8 text-zinc-500 text-sm">
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
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                size={18}
              />
              <input
                type="text"
                placeholder="Search users..."
                value={groupUsersSearch}
                onChange={(e) => setGroupUsersSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#0d9488] dark:focus:ring-[#50e080]"
              />
            </div>

            {/* Users List */}
            <div className="space-y-2">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <label
                    key={user.username}
                    className="flex items-center gap-3 p-4 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 cursor-pointer transition-colors"
                  >
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedGroupUsers.has(user.username)}
                        onChange={() => toggleUser(user.username)}
                        className="w-5 h-5 border-2 border-zinc-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-900 checked:bg-[#0d9488] dark:checked:bg-[#50e080] checked:border-[#0d9488] dark:checked:border-[#50e080] focus:ring-2 focus:ring-[#0d9488] dark:focus:ring-[#50e080] focus:ring-offset-0 appearance-none cursor-pointer"
                      />
                      {selectedGroupUsers.has(user.username) && (
                        <Check
                          size={14}
                          className="absolute left-0.5 top-0.5 text-white pointer-events-none"
                        />
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <User size={16} className="text-[#0d9488] dark:text-[#50e080]" />
                      <div>
                        <div className="text-sm font-medium text-zinc-900 dark:text-white">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400">
                          {user.username} • {user.email}
                        </div>
                      </div>
                    </div>
                  </label>
                ))
              ) : (
                <div className="text-center py-12 text-zinc-500">
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
              <div className="bg-red-50 dark:bg-red-900/50 rounded-lg p-6 border-2 border-red-300 dark:border-red-700">
                <h4 className="text-sm font-semibold text-red-700 dark:text-red-300 uppercase tracking-wider mb-4">
                  Delete Group
                </h4>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                      Name
                    </label>
                    <p className="text-sm text-zinc-900 dark:text-white">
                      {selectedGroup.name}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                      Description
                    </label>
                    <p className="text-sm text-zinc-900 dark:text-white">
                      {selectedGroup.description}
                    </p>
                  </div>

                  <div className="col-span-2">
                    <button
                      onClick={() => onDelete?.(selectedGroup)}
                      className="px-6 py-2.5 rounded-lg font-medium transition-colors bg-red-500 dark:bg-red-600 text-white hover:bg-red-600 dark:hover:bg-red-500"
                    >
                      Delete Group
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
