import { X, Eye, EyeOff, Pin, Check } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useLayout } from "../contexts/LayoutContext";

interface ColumnActionConfirmationProps {
  columnActions: Array<{
    action: "show" | "hide" | "pin";
    columnKey: string;
    columnDisplayName: string;
  }>;
  screen: string;
  screenPath: string;
  onClose: () => void;
}

export function ColumnActionConfirmation({ 
  columnActions,
  screen, 
  screenPath,
  onClose 
}: ColumnActionConfirmationProps) {
  const navigate = useNavigate();
  const { workListHiddenColumns, setWorkListHiddenColumns, workListPinnedColumns, setWorkListPinnedColumns } = useLayout();

  // Format screen name for display
  const screenDisplayName = screen
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const handleConfirm = () => {
    if (screen === "work list" || screen === "Work List") {
      const columnsToShow: string[] = [];
      const columnsToHide: string[] = [];
      const columnsToPin: string[] = [];
      
      // Group actions by type
      columnActions.forEach(({ action, columnKey }) => {
        if (action === "show") {
          columnsToShow.push(columnKey);
        } else if (action === "hide") {
          columnsToHide.push(columnKey);
        } else if (action === "pin") {
          columnsToPin.push(columnKey);
        }
      });
      
      // Apply show actions
      if (columnsToShow.length > 0) {
        const newHiddenColumns = workListHiddenColumns.filter(col => !columnsToShow.includes(col));
        setWorkListHiddenColumns(newHiddenColumns);
      }
      
      // Apply hide actions
      if (columnsToHide.length > 0) {
        const newHiddenColumns = [...new Set([...workListHiddenColumns, ...columnsToHide])];
        setWorkListHiddenColumns(newHiddenColumns);
      }
      
      // Apply pin actions
      if (columnsToPin.length > 0) {
        const newPinnedColumns = [...new Set([...workListPinnedColumns, ...columnsToPin])];
        setWorkListPinnedColumns(newPinnedColumns);
      }
    }
    
    // Navigate to the screen
    navigate(screenPath);
    onClose();
  };

  // Get icon and color for a specific action
  const getActionIcon = (action: "show" | "hide" | "pin") => {
    switch (action) {
      case "show":
        return {
          icon: Eye,
          iconBg: "bg-green-100 dark:bg-green-900/30",
          iconColor: "text-green-600 dark:text-green-500"
        };
      case "hide":
        return {
          icon: EyeOff,
          iconBg: "bg-amber-100 dark:bg-amber-900/30",
          iconColor: "text-amber-600 dark:text-amber-500"
        };
      case "pin":
        return {
          icon: Pin,
          iconBg: "bg-purple-100 dark:bg-purple-900/30",
          iconColor: "text-purple-600 dark:text-purple-500"
        };
    }
  };

  // Determine if we have mixed actions
  const uniqueActions = [...new Set(columnActions.map(ca => ca.action))];
  const hasMixedActions = uniqueActions.length > 1;

  // Get header icon (use first action's icon or a generic icon for mixed)
  const headerIconConfig = getActionIcon(uniqueActions[0]);
  const HeaderIcon = headerIconConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Center Modal */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-2xl overflow-hidden"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full flex items-center justify-center transition-colors z-10"
        >
          <X size={16} className="text-zinc-600 dark:text-zinc-400" />
        </button>

        {/* Header */}
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-10 h-10 ${headerIconConfig.iconBg} rounded-full flex items-center justify-center`}>
              <HeaderIcon size={20} className={headerIconConfig.iconColor} />
            </div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
              {hasMixedActions ? "Manage Columns" : uniqueActions[0] === "show" ? "Show Columns" : uniqueActions[0] === "hide" ? "Hide Columns" : "Pin Columns"}
            </h2>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">
            {hasMixedActions ? `The following columns will be managed on the ${screenDisplayName}:` : uniqueActions[0] === "show" ? `The following columns will be shown on the ${screenDisplayName}:` : uniqueActions[0] === "hide" ? `The following columns will be hidden from the ${screenDisplayName}:` : `The following columns will be pinned on the ${screenDisplayName}:`}
          </p>
        </div>

        {/* Column List */}
        <div className="p-6">
          <div className="space-y-2">
            {columnActions.map((columnAction, index) => {
              const actionIcon = getActionIcon(columnAction.action);
              const ActionIcon = actionIcon.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-lg"
                >
                  <div className={`w-8 h-8 ${actionIcon.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <ActionIcon size={16} className={actionIcon.iconColor} />
                  </div>
                  <div className="flex-1">
                    <span className="text-zinc-900 dark:text-white text-sm font-medium">
                      {columnAction.columnDisplayName}
                    </span>
                    <p className="text-zinc-600 dark:text-zinc-400 text-xs mt-0.5">
                      Will be {columnAction.action === "show" ? "shown" : columnAction.action === "hide" ? "hidden" : "pinned"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md">
                    <ActionIcon size={12} className={actionIcon.iconColor} />
                    <span className={`text-xs font-medium ${actionIcon.iconColor}`}>
                      {columnAction.action.charAt(0).toUpperCase() + columnAction.action.slice(1)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-blue-800 dark:text-blue-300 text-xs">
              💡 You can manage column visibility anytime via the Property Visibility screen or by asking OPTO.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-lg transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-2.5 bg-[#0d9488] dark:bg-[#50e080] hover:bg-[#0f766e] dark:hover:bg-[#3bc76a] text-white rounded-lg transition-colors font-medium shadow-lg shadow-[#0d9488]/30 dark:shadow-[#50e080]/30"
          >
            {hasMixedActions ? "Apply Changes" : uniqueActions[0] === "show" ? "Show Columns" : uniqueActions[0] === "hide" ? "Hide Columns" : "Pin Columns"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}