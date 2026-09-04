import { useState } from "react";
import { X, Activity, AlertCircle, CheckCircle2, XCircle, ChevronRight } from "lucide-react";

// Define types for hardware devices
interface Scanner {
  id: string;
  name: string;
  location: string;
  status: "up" | "down";
  totalScans: number;
  scansPerHour: number;
  lastScan: string;
  laneRouting: { lane: string; count: number }[];
  area?: string;
  uptime?: string;
}

interface Conveyor {
  id: string;
  name: string;
  location: string;
  status: "up" | "down";
  area?: string;
  uptime?: string;
}

interface Palletizer {
  id: string;
  name: string;
  location: string;
  status: "up" | "down";
  currentWorkList: string | null;
  workType: string | null;
  itemsProcessed: number;
  itemsRemaining: number;
  currentSpeed: string;
  uptime: string;
  area?: string;
}

interface Robot {
  id: string;
  name: string;
  type: string;
  location: string;
  status: "up" | "down";
  currentWorkList: string | null;
  workType: string | null;
  itemsProcessed: number;
  itemsRemaining: number;
  batteryLevel: number;
  currentTask: string;
  area?: string;
  uptime?: string;
}

type HardwareDevice = Scanner | Conveyor | Palletizer | Robot;

interface MHEVisualViewProps {
  scannersData: Scanner[];
  conveyorsData: Conveyor[];
  palletizersData: Palletizer[];
  robotsData: Robot[];
}

// Assign areas to hardware and calculate uptime
const assignAreasAndUptime = (
  scanners: Scanner[],
  conveyors: Conveyor[],
  palletizers: Palletizer[],
  robots: Robot[]
) => {
  const areas = ["Inbound", "Outbound", "Fulfillment"];
  
  const scannersWithAreas = scanners.map((scanner, idx) => ({
    ...scanner,
    area: areas[idx % areas.length],
    uptime: scanner.status === "up" ? `${95 + Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 10)}%` : "0.0%"
  }));
  
  const conveyorsWithAreas = conveyors.map((conveyor, idx) => ({
    ...conveyor,
    area: areas[idx % areas.length],
    uptime: conveyor.status === "up" ? `${92 + Math.floor(Math.random() * 8)}.${Math.floor(Math.random() * 10)}%` : "0.0%"
  }));
  
  const palletizersWithAreas = palletizers.map((palletizer) => ({
    ...palletizer,
    area: areas[Math.floor(Math.random() * areas.length)]
  }));
  
  const robotsWithAreas = robots.map((robot, idx) => ({
    ...robot,
    area: areas[idx % areas.length],
    uptime: robot.status === "up" ? `${90 + Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}%` : "0.0%"
  }));
  
  return {
    scanners: scannersWithAreas,
    conveyors: conveyorsWithAreas,
    palletizers: palletizersWithAreas,
    robots: robotsWithAreas
  };
};

export function MHEVisualView({
  scannersData,
  conveyorsData,
  palletizersData,
  robotsData
}: MHEVisualViewProps) {
  const [selectedArea, setSelectedArea] = useState<string>("Inbound");
  const [selectedDevice, setSelectedDevice] = useState<HardwareDevice | null>(null);
  
  const { scanners, conveyors, palletizers, robots } = assignAreasAndUptime(
    scannersData,
    conveyorsData,
    palletizersData,
    robotsData
  );
  
  const allDevices = [
    ...scanners.map(s => ({ ...s, type: "Scanner" })),
    ...conveyors.map(c => ({ ...c, type: "Conveyor" })),
    ...palletizers.map(p => ({ ...p, type: "Palletizer" })),
    ...robots.map(r => ({ ...r, type: "Robot" }))
  ];
  
  const filteredDevices = allDevices.filter(device => device.area === selectedArea);
  
  // Define visual positions for devices in the warehouse layout
  const devicePositions: Record<string, { x: number; y: number; shape: "rect" | "circle" | "square"; width?: number; height?: number; radius?: number }> = {
    // Inbound Area
    "SCAN-001": { x: 50, y: 100, shape: "rect", width: 80, height: 40 },
    "SCAN-002": { x: 50, y: 200, shape: "rect", width: 80, height: 40 },
    "CONV-001": { x: 160, y: 100, shape: "rect", width: 200, height: 30 },
    "CONV-004": { x: 160, y: 180, shape: "rect", width: 200, height: 30 },
    "BOT-001": { x: 400, y: 100, shape: "circle", radius: 25 },
    
    // Outbound Area
    "SCAN-003": { x: 50, y: 350, shape: "rect", width: 80, height: 40 },
    "CONV-005": { x: 160, y: 350, shape: "rect", width: 200, height: 30 },
    "CONV-008": { x: 160, y: 420, shape: "rect", width: 200, height: 30 },
    "PAL-001": { x: 400, y: 350, shape: "square", width: 60, height: 60 },
    "BOT-002": { x: 500, y: 350, shape: "circle", radius: 25 },
    
    // Fulfillment Area
    "SCAN-004": { x: 600, y: 100, shape: "rect", width: 80, height: 40 },
    "CONV-002": { x: 600, y: 200, shape: "rect", width: 200, height: 30 },
    "CONV-003": { x: 600, y: 280, shape: "rect", width: 200, height: 30 },
    "CONV-006": { x: 600, y: 360, shape: "rect", width: 150, height: 30 },
    "CONV-007": { x: 780, y: 360, shape: "rect", width: 150, height: 30 },
    "PAL-002": { x: 850, y: 100, shape: "square", width: 60, height: 60 },
    "PAL-003": { x: 850, y: 200, shape: "square", width: 60, height: 60 },
    "BOT-003": { x: 950, y: 150, shape: "circle", radius: 25 },
    "BOT-004": { x: 950, y: 250, shape: "circle", radius: 25 },
    "BOT-005": { x: 700, y: 450, shape: "circle", radius: 30 }
  };

  const getDeviceColor = (status: "up" | "down") => {
    return status === "up" 
      ? "fill-emerald-500/20 stroke-emerald-500" 
      : "fill-red-500/20 stroke-red-500";
  };

  const getDeviceHoverColor = (status: "up" | "down") => {
    return status === "up" 
      ? "hover:fill-emerald-500/30" 
      : "hover:fill-red-500/30";
  };

  return (
    <div className="flex-1 flex flex-col gap-6 overflow-hidden">
      {/* Area Filter Tiles */}
      <div className="flex gap-3">
        {["Inbound", "Outbound", "Fulfillment"].map((area) => (
          <button
            key={area}
            onClick={() => setSelectedArea(area)}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              selectedArea === area
                ? "bg-[#50e080] text-zinc-900 shadow-lg shadow-[#50e080]/20"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
            }`}
          >
            {area}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex gap-6 min-h-0">
        {/* Left Sidebar - Hardware List */}
        <div className="w-80 flex flex-col gap-3 overflow-y-auto">
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
            {selectedArea} Hardware
          </h3>
          <div className="space-y-2">
            {filteredDevices.map((device) => (
              <button
                key={device.id}
                onClick={() => setSelectedDevice(device)}
                className={`w-full p-4 rounded-lg border transition-all text-left ${
                  selectedDevice?.id === device.id
                    ? "border-[#50e080] bg-[#50e080]/10 dark:bg-[#50e080]/5"
                    : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {device.status === "up" ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                      )}
                      <span className="font-medium text-sm text-zinc-900 dark:text-zinc-100 truncate">
                        {device.name}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                      {device.location}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                      {device.uptime || "N/A"}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Uptime</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Center - Visual Warehouse Layout */}
        <div className="flex-1 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6 overflow-auto">
          <div className="relative">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
              {selectedArea} Layout
            </h3>
            <svg
              viewBox="0 0 1000 550"
              className="w-full h-auto"
              style={{ minHeight: "500px" }}
            >
              {/* Background grid */}
              <defs>
                <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path
                    d="M 50 0 L 0 0 0 50"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    className="text-zinc-200 dark:text-zinc-800"
                  />
                </pattern>
              </defs>
              <rect width="1000" height="550" fill="url(#grid)" />

              {/* Render devices */}
              {filteredDevices.map((device) => {
                const pos = devicePositions[device.id];
                if (!pos) return null;

                const color = getDeviceColor(device.status);
                const hoverColor = getDeviceHoverColor(device.status);

                return (
                  <g
                    key={device.id}
                    onClick={() => setSelectedDevice(device)}
                    className={`cursor-pointer transition-all ${hoverColor}`}
                  >
                    {pos.shape === "rect" && (
                      <>
                        <rect
                          x={pos.x}
                          y={pos.y}
                          width={pos.width}
                          height={pos.height}
                          className={color}
                          strokeWidth="2"
                          rx="4"
                        />
                        <text
                          x={pos.x + (pos.width || 0) / 2}
                          y={pos.y + (pos.height || 0) / 2}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="text-xs font-medium fill-zinc-900 dark:fill-zinc-100 pointer-events-none"
                          style={{ fontSize: "10px" }}
                        >
                          {device.name}
                        </text>
                      </>
                    )}
                    {pos.shape === "square" && (
                      <>
                        <rect
                          x={pos.x}
                          y={pos.y}
                          width={pos.width}
                          height={pos.height}
                          className={color}
                          strokeWidth="2"
                          rx="4"
                        />
                        <text
                          x={pos.x + (pos.width || 0) / 2}
                          y={pos.y + (pos.height || 0) / 2}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="text-xs font-medium fill-zinc-900 dark:fill-zinc-100 pointer-events-none"
                          style={{ fontSize: "8px" }}
                        >
                          {device.id}
                        </text>
                      </>
                    )}
                    {pos.shape === "circle" && (
                      <>
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r={pos.radius}
                          className={color}
                          strokeWidth="2"
                        />
                        <text
                          x={pos.x}
                          y={pos.y}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="text-xs font-medium fill-zinc-900 dark:fill-zinc-100 pointer-events-none"
                          style={{ fontSize: "8px" }}
                        >
                          {device.id.split("-")[0]}
                        </text>
                      </>
                    )}
                    {/* Tooltip on hover */}
                    <title>{`${device.name} - ${device.status.toUpperCase()}`}</title>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Right Sidebar - Device Details */}
        {selectedDevice && (
          <div className="w-96 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {selectedDevice.name}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {selectedDevice.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedDevice(null)}
                className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded"
              >
                <X className="w-5 h-5 text-zinc-500" />
              </button>
            </div>

            {/* Status Badge */}
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                {selectedDevice.status === "up" ? (
                  <>
                    <Activity className="w-5 h-5 text-emerald-500" />
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                      Operational
                    </span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-700 dark:text-red-400">
                      Down
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Location</p>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {selectedDevice.location}
                </p>
              </div>

              {selectedDevice.uptime && (
                <div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Uptime</p>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {selectedDevice.uptime}
                  </p>
                </div>
              )}

              {"totalScans" in selectedDevice && (
                <>
                  <div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Total Scans</p>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {selectedDevice.totalScans.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Scans Per Hour</p>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {selectedDevice.scansPerHour}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Last Scan</p>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {selectedDevice.lastScan}
                    </p>
                  </div>
                  {selectedDevice.laneRouting.length > 0 && (
                    <div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">Lane Routing</p>
                      <div className="space-y-2">
                        {selectedDevice.laneRouting.map((lane) => (
                          <div key={lane.lane} className="flex items-center justify-between text-sm">
                            <span className="text-zinc-700 dark:text-zinc-300">{lane.lane}</span>
                            <span className="font-medium text-zinc-900 dark:text-zinc-100">{lane.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {"currentWorkList" in selectedDevice && (
                <>
                  {selectedDevice.currentWorkList && (
                    <div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Current Work List</p>
                      <p className="text-sm font-medium text-[#50e080]">
                        {selectedDevice.currentWorkList}
                      </p>
                    </div>
                  )}
                  {selectedDevice.workType && (
                    <div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Work Type</p>
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {selectedDevice.workType}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Items Processed</p>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {selectedDevice.itemsProcessed}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Items Remaining</p>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {selectedDevice.itemsRemaining}
                    </p>
                  </div>
                </>
              )}

              {"currentSpeed" in selectedDevice && (
                <div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Current Speed</p>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {selectedDevice.currentSpeed}
                  </p>
                </div>
              )}

              {"batteryLevel" in selectedDevice && (
                <>
                  <div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Battery Level</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            selectedDevice.batteryLevel > 50
                              ? "bg-emerald-500"
                              : selectedDevice.batteryLevel > 20
                              ? "bg-amber-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${selectedDevice.batteryLevel}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {selectedDevice.batteryLevel}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Current Task</p>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {selectedDevice.currentTask}
                    </p>
                  </div>
                  {"type" in selectedDevice && (
                    <div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Robot Type</p>
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {selectedDevice.type}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
