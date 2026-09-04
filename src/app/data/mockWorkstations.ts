// Mock workstation data
export const mockWorkstations = [
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
export const mockSortbars = [
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
