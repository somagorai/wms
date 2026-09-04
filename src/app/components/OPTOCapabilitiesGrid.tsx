import React from "react";
import { motion } from "framer-motion";
import { Navigation as NavigationIcon, Zap, FileText, HelpCircle } from "lucide-react";

export interface CapabilityItem {
  text: string;
  path?: string;
}

export interface CapabilitiesData {
  navigation: CapabilityItem[];
  actions: CapabilityItem[];
  reports: CapabilityItem[];
  help: CapabilityItem[];
}

export const OPTO_CAPABILITIES: CapabilitiesData = {
  navigation: [
    { text: "View Operations Dashboard", path: "/app/dashboard" },
    { text: "Open Work List", path: "/app/worklist" },
    { text: "View Pick Lists", path: "/app/worklist?type=Pick" },
    { text: "View Replenishment", path: "/app/worklist?type=Replenishment" },
    { text: "Check Analytics", path: "/app/analytics" },
    { text: "Browse Projects", path: "/app/projects" },
    { text: "View Executive Dashboard", path: "/app/executive" },
    { text: "Monitor System Health", path: "/app/health" },
    { text: "Check MHE Status", path: "/app/mhe" },
  ],
  actions: [
    { text: "Show/Hide Columns" },
    { text: "Filter Work Items" },
    { text: "Assign Work Lists" },
    { text: "Manage Users" },
    { text: "View Processing Items", path: "/app/worklist?filter=processing" },
    { text: "Search Database Items", path: "/app/worklist?search=database" },
    { text: "Pin Columns" },
  ],
  reports: [
    { text: "User Productivity Report" },
    { text: "Pick/Putaway Rates" },
    { text: "Show Logged In Users" },
    { text: "Show me a list of users who have access to the Executive dashboard" },
    { text: "Performance Metrics" },
    { text: "Work Operations Summary" },
  ],
  help: [
    { text: "Assign Work List to Workstation" },
    { text: "How do I add a new user" },
    { text: "Troubleshoot Replen Result" },
    { text: "Column Management Guide" },
    { text: "Navigation Help" },
  ]
};

interface OPTOCapabilitiesGridProps {
  onCapabilityClick: (cap: CapabilityItem) => void;
  capabilities?: CapabilitiesData;
}

export function OPTOCapabilitiesGrid({
  onCapabilityClick,
  capabilities = OPTO_CAPABILITIES,
}: OPTOCapabilitiesGridProps) {
  return (
    <div className="space-y-6">
      {/* Top Row - 3 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)]  rounded-lg p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[var(--primary)]/10 /20 rounded-lg flex items-center justify-center">
              <NavigationIcon size={20} className="text-[var(--primary)] dark:text-[var(--primary)]" />
            </div>
            <h2 className="text-[var(--foreground)]  font-semibold">Navigation</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {capabilities.navigation.map((cap, i) => (
              <button
                key={i}
                onClick={() => onCapabilityClick(cap)}
                className="group px-4 py-2 bg-[var(--surface-container-low)] dark:bg-[var(--card)] border border-[var(--border)]  hover:border-[var(--primary)] dark:hover:border-[var(--primary)] hover:bg-[var(--surface-container-high)] dark:hover:bg-[var(--surface-container-high)] rounded-lg text-sm text-[var(--foreground)]  font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {cap.text}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Center Column - Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)]  rounded-lg p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[var(--tertiary-container)] dark:bg-[var(--tertiary-container)]/40 rounded-lg flex items-center justify-center">
              <Zap size={20} className="text-[var(--on-tertiary-container)] dark:text-[var(--tertiary)]" />
            </div>
            <h2 className="text-[var(--foreground)]  font-semibold">Actions</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {capabilities.actions.map((cap, i) => (
              <button
                key={i}
                onClick={() => onCapabilityClick(cap)}
                className="group px-4 py-2 bg-[var(--surface-container-low)] dark:bg-[var(--card)] border border-[var(--border)]  hover:border-[var(--tertiary)] dark:hover:border-[var(--tertiary)] hover:bg-[var(--surface-container-high)] dark:hover:bg-[var(--surface-container-high)] rounded-lg text-sm text-[var(--foreground)]  font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {cap.text}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Right Column - Report Generation */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)]  rounded-lg p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[var(--secondary-container)] dark:bg-[var(--secondary-container)]/40 rounded-lg flex items-center justify-center">
              <FileText size={20} className="text-[var(--on-secondary-container)] dark:text-[var(--secondary)]" />
            </div>
            <h2 className="text-[var(--foreground)]  font-semibold">Report Generation</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {capabilities.reports.map((cap, i) => (
              <button
                key={i}
                onClick={() => onCapabilityClick(cap)}
                className="group px-4 py-2 bg-[var(--surface-container-low)] dark:bg-[var(--card)] border border-[var(--border)]  hover:border-[var(--secondary)] dark:hover:border-[var(--secondary)] hover:bg-[var(--surface-container-high)] dark:hover:bg-[var(--surface-container-high)] rounded-lg text-sm text-[var(--foreground)]  font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {cap.text}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row - Help & Troubleshooting Centered */}
      <div className="flex justify-center">
        <div className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)]  rounded-lg p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[var(--state-info-container)] dark:bg-[var(--state-info-container)]/40 rounded-lg flex items-center justify-center">
                <HelpCircle size={20} className="text-[var(--state-on-info-container)] dark:text-[var(--state-info)]" />
              </div>
              <h2 className="text-[var(--foreground)]  font-semibold">Help & Troubleshooting</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {capabilities.help.map((cap, i) => (
                <button
                  key={i}
                  onClick={() => onCapabilityClick(cap)}
                  className="group px-4 py-2 bg-[var(--surface-container-low)] dark:bg-[var(--card)] border border-[var(--border)]  hover:border-[var(--state-info)] dark:hover:border-[var(--state-info)] hover:bg-[var(--surface-container-high)] dark:hover:bg-[var(--surface-container-high)] rounded-lg text-sm text-[var(--foreground)]  font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {cap.text}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
