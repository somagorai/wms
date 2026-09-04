import { X, Eye, EyeOff, Pin, Check } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
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
 iconBg: "bg-[var(--state-success-container)] dark:bg-[var(--state-success-container)]",
 iconColor: "text-[var(--state-on-success-container)] dark:text-[var(--state-success)]"
 };
 case "hide":
 return {
 icon: EyeOff,
 iconBg: "bg-[var(--state-warning-container)] dark:bg-[var(--state-warning-container)]/30",
 iconColor: "text-[var(--state-on-warning-container)] dark:text-[var(--state-warning)]"
 };
 case "pin":
 return {
 icon: Pin,
 iconBg: "bg-[var(--state-fatal-container)] dark:bg-[var(--state-fatal-container)]",
 iconColor: "text-[var(--tertiary)] dark:text-[var(--state-fatal)]"
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
 <div className="absolute inset-0 bg-black/50" />

 {/* Center Modal */}
 <motion.div
 initial={{ scale: 0.9, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 exit={{ scale: 0.9, opacity: 0 }}
 transition={{ type: "spring", damping: 25, stiffness: 200 }}
 onClick={(e) => e.stopPropagation()}
 className="relative w-full max-w-md bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] border border-[var(--border)]  rounded-2xl overflow-hidden"
 >
 {/* Close button */}
 <button
 onClick={onClose}
 className="absolute top-4 right-4 w-8 h-8 bg-[var(--surface-container-low)] dark:bg-[var(--card)] hover:bg-[var(--surface-container-high)] rounded-full flex items-center justify-center transition-colors z-10"
 >
 <X size={16} className="text-[var(--muted-foreground)]" />
 </button>

 {/* Header */}
 <div className="p-6 border-b border-[var(--border)] ">
 <div className="flex items-center gap-3 mb-2">
 <div className={`w-10 h-10 ${headerIconConfig.iconBg} rounded-full flex items-center justify-center`}>
 <HeaderIcon size={20} className={headerIconConfig.iconColor} />
 </div>
 <h2 className="text-xl font-bold text-[var(--foreground)] ">
 {hasMixedActions ? "Manage Columns" : uniqueActions[0] === "show" ? "Show Columns" : uniqueActions[0] === "hide" ? "Hide Columns" : "Pin Columns"}
 </h2>
 </div>
 <p className="text-[var(--muted-foreground)] text-sm">
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
 className="flex items-center gap-3 p-3 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] border border-[var(--border)]  rounded-lg"
 >
 <div className={`w-8 h-8 ${actionIcon.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
 <ActionIcon size={16} className={actionIcon.iconColor} />
 </div>
 <div className="flex-1">
 <span className="text-[var(--foreground)]  text-sm font-medium">
 {columnAction.columnDisplayName}
 </span>
 <p className="text-[var(--muted-foreground)] text-xs mt-0.5">
 Will be {columnAction.action === "show" ? "shown" : columnAction.action === "hide" ? "hidden" : "pinned"}
 </p>
 </div>
 <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] border border-[var(--border)]  rounded-md">
 <ActionIcon size={12} className={actionIcon.iconColor} />
 <span className={`text-xs font-medium ${actionIcon.iconColor}`}>
 {columnAction.action.charAt(0).toUpperCase() + columnAction.action.slice(1)}
 </span>
 </div>
 </div>
 );
 })}
 </div>

 <div className="mt-4 p-3 bg-[var(--state-info-container)] dark:bg-[var(--state-info-container)]/20 border border-[var(--secondary)]/30 dark:border-[var(--secondary-container)]/30 rounded-lg">
 <p className="text-[var(--state-on-info-container)] dark:text-[var(--state-info)] text-xs">
 💡 You can manage column visibility anytime via the Property Visibility screen or by asking OPTO.
 </p>
 </div>
 </div>

 {/* Actions */}
 <div className="p-6 border-t border-[var(--border)]  flex gap-3">
 <Button
 btnType="secondary"
 size="lg"
 className="flex-1"
 onClick={onClose}
 >
 Cancel
 </Button>
 <Button
 btnType="primary"
 size="lg"
 className="flex-1"
 onClick={handleConfirm}
 >
 {hasMixedActions ? "Apply Changes" : uniqueActions[0] === "show" ? "Show Columns" : uniqueActions[0] === "hide" ? "Hide Columns" : "Pin Columns"}
 </Button>
 </div>
 </motion.div>
 </motion.div>
 );
}