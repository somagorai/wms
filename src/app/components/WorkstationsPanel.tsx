import { useState, useEffect } from "react";
import { X, Monitor, ChevronDown, ChevronRight, Check, Save } from "lucide-react";

// Mock workstation data
const mockWorkstations = [
  { id: "WS-001", name: "Workstation 1", zone: "Zone A", status: "Available", mode: "Auto", ipAddress: "192.168.1.101", registered: "2024-01-15", currentUser: "", type: "Pick" },
  { id: "WS-002", name: "Workstation 2", zone: "Zone A", status: "In Use", mode: "Manual", ipAddress: "192.168.1.102", registered: "2024-01-16", currentUser: "John Smith", type: "Pick" },
  { id: "WS-003", name: "Workstation 3", zone: "Zone B", status: "In Use", mode: "Auto", ipAddress: "192.168.1.103", registered: "2024-01-17", currentUser: "Sarah Jones", type: "Replenishment" },
  { id: "WS-004", name: "Workstation 4", zone: "Zone B", status: "Available", mode: "Auto", ipAddress: "192.168.1.104", registered: "2024-01-18", currentUser: "", type: "Replenishment" },
  { id: "WS-005", name: "Workstation 5", zone: "Zone C", status: "Available", mode: "Manual", ipAddress: "192.168.1.105", registered: "2024-01-19", currentUser: "", type: "Inspection" },
  { id: "WS-006", name: "Workstation 6", zone: "Zone C", status: "Maintenance", mode: "Auto", ipAddress: "192.168.1.106", registered: "2024-01-20", currentUser: "Maintenance", type: "Inspection" },
  { id: "WS-007", name: "Workstation 7", zone: "Zone D", status: "Available", mode: "Auto", ipAddress: "192.168.1.107", registered: "2024-01-21", currentUser: "", type: "Pick" },
  { id: "WS-008", name: "Workstation 8", zone: "Zone D", status: "Available", mode: "Manual", ipAddress: "192.168.1.108", registered: "2024-01-22", currentUser: "", type: "Replenishment" },
  { id: "WS-009", name: "Workstation 9", zone: "Zone E", status: "In Use", mode: "Auto", ipAddress: "192.168.1.109", registered: "2024-01-23", currentUser: "Mike Davis", type: "Cycle Count" },
];

// Mock sortbar data
const mockSortbars = [
  { id: "SB-001", workstationId: "WS-001", status: "Active", container: "CONT-A1", registrationSequence: "001", trailerType: "Type A" },
  { id: "SB-002", workstationId: "WS-001", status: "Inactive", container: "CONT-A2", registrationSequence: "002", trailerType: "Type B" },
  { id: "SB-003", workstationId: "WS-002", status: "Active", container: "CONT-B1", registrationSequence: "003", trailerType: "Type A" },
  { id: "SB-004", workstationId: "WS-003", status: "Active", container: "CONT-C1", registrationSequence: "004", trailerType: "Type C" },
  { id: "SB-005", workstationId: "WS-003", status: "Inactive", container: "CONT-C2", registrationSequence: "005", trailerType: "Type A" },
  { id: "SB-006", workstationId: "WS-004", status: "Active", container: "CONT-D1", registrationSequence: "006", trailerType: "Type B" },
  { id: "SB-007", workstationId: "WS-005", status: "Active", container: "CONT-E1", registrationSequence: "007", trailerType: "Type A" },
  { id: "SB-008", workstationId: "WS-007", status: "Active", container: "CONT-F1", registrationSequence: "008", trailerType: "Type C" },
  { id: "SB-009", workstationId: "WS-007", status: "Active", container: "CONT-F2", registrationSequence: "009", trailerType: "Type B" },
  { id: "SB-010", workstationId: "WS-008", status: "Active", container: "CONT-G1", registrationSequence: "010", trailerType: "Type A" },
  { id: "SB-011", workstationId: "WS-009", status: "Active", container: "CONT-H1", registrationSequence: "011", trailerType: "Type B" },
];

interface WorkstationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  assignedWorkstation: string | null;
  onAssignWorkstation: (workstationId: string | null) => void;
}

export function WorkstationsPanel({ isOpen, onClose, assignedWorkstation, onAssignWorkstation }: WorkstationsPanelProps) {
  const [expandedWorkstations, setExpandedWorkstations] = useState<Set<string>>(new Set());
  const [selectedSortbar, setSelectedSortbar] = useState<string>("");
  const [selectedWorkstationForAssign, setSelectedWorkstationForAssign] = useState<string>("");
  const [selectedWorkListForAssign, setSelectedWorkListForAssign] = useState<string>("");
  const [showAssignmentConfirmation, setShowAssignmentConfirmation] = useState(false);
  const [workstationToAssign, setWorkstationToAssign] = useState<{ id: string; name: string } | null>(null);
  const [isUnassigning, setIsUnassigning] = useState(false);

  // Expand all workstations when panel opens
  useEffect(() => {
    if (isOpen) {
      const allWorkstationIds = new Set(mockWorkstations.map(ws => ws.id));
      setExpandedWorkstations(allWorkstationIds);
    }
  }, [isOpen]);

  // Update workstation data based on assignment
  const workstations = mockWorkstations.map(ws => {
    if (assignedWorkstation && ws.name === assignedWorkstation) {
      return {
        ...ws,
        status: "Unassign",
        currentUser: "John Doe"
      };
    }
    return ws;
  });

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      
      {/* Slide-out Panel */}
      <div className="fixed right-0 top-0 h-full w-[900px] bg-white dark:bg-zinc-900 border-l border-[#0d9488] dark:border-[#50e080] shadow-2xl z-50 animate-in slide-in-from-right duration-300 flex flex-col">
        {/* Header */}
        <div className="flex-none border-b border-zinc-200 dark:border-zinc-800 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0d9488]/20 dark:bg-[#50e080]/20 rounded-lg flex items-center justify-center">
                <Monitor size={20} className="text-[#0d9488] dark:text-[#50e080]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Workstations</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Manage workstation assignments</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 rounded-lg flex items-center justify-center transition-colors"
            >
              <X size={18} className="text-zinc-900 dark:text-white" />
            </button>
          </div>
          
          {/* Help Text */}
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <span className="font-semibold">How to use:</span> Select a <strong>Workstation</strong> to register it to this computer, or expand a workstation and select a <strong>Sortbar</strong> to assign it to a work list.
            </p>
          </div>
        </div>

        {/* Workstations List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-2 mb-6">
            {workstations.map((workstation) => {
              const isExpanded = expandedWorkstations.has(workstation.id);
              const sortbars = mockSortbars.filter(sb => sb.workstationId === workstation.id);
              
              return (
                <div key={workstation.id} className="bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden">
                  {/* Workstation Row */}
                  <div 
                    className={`${
                      workstation.status === 'Available' || workstation.status === 'Unassign'
                        ? 'cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800/70' 
                        : 'cursor-not-allowed opacity-60'
                    } transition-colors`}
                    onClick={() => {
                      if (workstation.status === 'Available') {
                        // Show confirmation dialog for workstation assignment
                        setWorkstationToAssign({ id: workstation.id, name: workstation.name });
                        setIsUnassigning(false);
                        setShowAssignmentConfirmation(true);
                      } else if (workstation.status === 'Unassign') {
                        // Show confirmation dialog for workstation unassignment
                        setWorkstationToAssign({ id: workstation.id, name: workstation.name });
                        setIsUnassigning(true);
                        setShowAssignmentConfirmation(true);
                      }
                    }}
                  >
                    <div className="p-4 grid grid-cols-6 gap-4 items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-900 dark:text-white font-medium">{workstation.name}</span>
                      </div>
                      <div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          workstation.status === 'Available' ? 'bg-green-500/20 text-green-600 dark:text-green-400' :
                          workstation.status === 'In Use' ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400' :
                          workstation.status === 'Unassign' ? 'bg-red-500/20 text-red-600 dark:text-red-400' :
                          'bg-orange-500/20 text-orange-600 dark:text-orange-400'
                        }`}>
                          {workstation.status}
                        </span>
                      </div>
                      <div className="text-zinc-700 dark:text-zinc-300">{workstation.mode}</div>
                      <div className="text-zinc-700 dark:text-zinc-300 font-mono text-sm">{workstation.ipAddress}</div>
                      <div className="text-zinc-600 dark:text-zinc-400 text-sm">{workstation.registered}</div>
                      <div className="text-zinc-700 dark:text-zinc-300">{workstation.currentUser || <span className="text-zinc-500">—</span>}</div>
                    </div>
                  </div>

                  {/* Sortbars (Expanded) */}
                  {isExpanded && sortbars.length > 0 && (
                    <div className="bg-zinc-200 dark:bg-zinc-900/50 border-t border-zinc-300 dark:border-zinc-700 p-4">
                      <div className="mb-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">Sortbars</div>
                      <div className="space-y-2">
                        {sortbars.map((sortbar) => (
                          <div 
                            key={sortbar.id}
                            className={`p-3 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 border border-zinc-300 dark:border-zinc-700 rounded-lg cursor-pointer transition-colors ${
                              selectedSortbar === `${workstation.id}/${sortbar.id}` ? 'ring-2 ring-[#0d9488] dark:ring-[#50e080]' : ''
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSortbar(`${workstation.id}/${sortbar.id}`);
                              setSelectedWorkstationForAssign(`${workstation.name} / ${sortbar.id}`);
                            }}
                          >
                            <div className="grid grid-cols-5 gap-3 items-center text-sm">
                              <div className="text-zinc-900 dark:text-white font-medium">{sortbar.id}</div>
                              <div>
                                <span className={`px-2 py-0.5 rounded text-xs ${
                                  sortbar.status === 'Active' ? 'bg-green-500/20 text-green-600 dark:text-green-400' : 'bg-zinc-500/20 text-zinc-600 dark:text-zinc-400'
                                }`}>
                                  {sortbar.status}
                                </span>
                              </div>
                              <div className="text-zinc-700 dark:text-zinc-300">{sortbar.container}</div>
                              <div className="text-zinc-600 dark:text-zinc-400">{sortbar.registrationSequence}</div>
                              <div className="text-zinc-700 dark:text-zinc-300">{sortbar.trailerType}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Assignment Section */}
          <div className="sticky bottom-0 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 pt-6 mt-6">
            <div className="bg-gradient-to-br from-[#0d9488]/10 dark:from-[#50e080]/10 to-[#0f766e]/10 dark:to-[#3bc76a]/10 border border-[#0d9488]/20 dark:border-[#50e080]/20 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#0d9488]/20 dark:bg-[#50e080]/20 rounded-lg flex items-center justify-center">
                  <Check size={20} className="text-[#0d9488] dark:text-[#50e080]" />
                </div>
                <h4 className="text-lg font-bold text-zinc-900 dark:text-white">Assign Workstation to Work List</h4>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Selected Workstation/Sortbar
                  </label>
                  <input
                    type="text"
                    value={selectedWorkstationForAssign}
                    readOnly
                    placeholder="Select a sortbar from the list above"
                    className="w-full bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2 text-zinc-900 dark:text-white placeholder-zinc-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Work List
                  </label>
                  <select
                    value={selectedWorkListForAssign}
                    onChange={(e) => setSelectedWorkListForAssign(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2 text-zinc-900 dark:text-white"
                  >
                    <option value="">Select a work list...</option>
                    <option value="WL-001">WL-001 - Pick (Ready)</option>
                    <option value="WL-002">WL-002 - Pack (Ready)</option>
                    <option value="WL-003">WL-003 - Ship (Ready)</option>
                  </select>
                </div>

                <button
                  onClick={() => {
                    if (selectedWorkstationForAssign && selectedWorkListForAssign) {
                      setShowAssignmentConfirmation(true);
                      setWorkstationToAssign({ id: selectedWorkstationForAssign, name: selectedWorkstationForAssign });
                    }
                  }}
                  disabled={!selectedWorkstationForAssign || !selectedWorkListForAssign}
                  className="w-full px-4 py-3 bg-[#0d9488] dark:bg-[#50e080] hover:bg-[#0f766e] dark:hover:bg-[#3bc76a] text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save size={18} />
                  Save Assignment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assignment Confirmation Modal */}
      {showAssignmentConfirmation && workstationToAssign && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-2xl w-96 border border-zinc-200 dark:border-zinc-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#0d9488]/20 dark:bg-[#50e080]/20 rounded-lg flex items-center justify-center">
                <Monitor size={20} className="text-[#0d9488] dark:text-[#50e080]" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                {isUnassigning ? "Unassign Workstation" : "Assign Workstation"}
              </h3>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
              {isUnassigning ? (
                <>
                  Do you want to unassign this terminal from <strong className="text-zinc-900 dark:text-white">{workstationToAssign.name}</strong>?
                </>
              ) : (
                <>
                  Do you want to assign this terminal to <strong className="text-zinc-900 dark:text-white">{workstationToAssign.name}</strong>?
                </>
              )}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowAssignmentConfirmation(false);
                  setWorkstationToAssign(null);
                  setIsUnassigning(false);
                }}
                className="px-4 py-2 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-medium rounded-lg transition-colors"
              >
                No
              </button>
              <button
                onClick={() => {
                  if (isUnassigning) {
                    onAssignWorkstation(null);
                  } else {
                    onAssignWorkstation(workstationToAssign.name);
                  }
                  setShowAssignmentConfirmation(false);
                  setWorkstationToAssign(null);
                  setIsUnassigning(false);
                  onClose();
                }}
                className="px-4 py-2 bg-[#0d9488] dark:bg-[#50e080] hover:bg-[#0f766e] dark:hover:bg-[#3bc76a] text-white font-medium rounded-lg transition-colors"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}