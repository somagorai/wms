import { useNavigate } from "react-router-dom";
import { X, Sparkles, Navigation as NavigationIcon, Zap, FileText, HelpCircle } from "lucide-react";
import { motion } from "motion/react";
import { useState, KeyboardEvent } from "react";
import { OPTOCapabilitiesGrid, OPTO_CAPABILITIES } from "./OPTOCapabilitiesGrid";
import { HelpPopup } from "./HelpPopup";
import { AddUserHelpPopup } from "./AddUserHelpPopup";
import { AuthorizationHelpPopup } from "./AuthorizationHelpPopup";
import { ColumnActionConfirmation } from "./ColumnActionConfirmation";
import { ReportOverlay } from "./ReportOverlay";
import { TroubleshootingModal } from "./TroubleshootingModal";
import { useLayout } from "../contexts/LayoutContext";
import { useAuth } from "../contexts/AuthContext";

interface AIOverlayProps {
 onClose: () => void;
}

// Column mapping for different screens
const columnMappings: { [screen: string]: { [key: string]: string } } = {
 "work list": {
 "attribute 1": "attribute1",
 "attribute 2": "attribute2",
 "attribute 3": "attribute3",
 "attribute 4": "attribute4",
 "attribute 5": "attribute5",
 "work list": "workList",
 "type": "type",
 "status": "status",
 "priority": "priority",
 "priority date time": "priorityDateTime",
 "hot": "isHot",
 "sub type": "subType",
 "started": "started",
 "storage": "storage",
 "destination": "destination",
 "created": "created",
 "modified": "modified"
 }
};

// Display names for columns
const columnDisplayNames: { [key: string]: string } = {
 "attribute1": "Attribute 1",
 "attribute2": "Attribute 2",
 "attribute3": "Attribute 3",
 "attribute4": "Attribute 4",
 "attribute5": "Attribute 5",
 "workList": "Work List",
 "type": "Type",
 "status": "Status",
 "priority": "Priority",
 "priorityDateTime": "Priority Date Time",
 "isHot": "Hot",
 "subType": "Sub Type",
 "started": "Started",
 "storage": "Storage",
 "destination": "Destination",
 "created": "Created",
 "modified": "Modified"
};

// OPTO capabilities organized by section
const capabilities = {
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

export function AIOverlay({ onClose }: AIOverlayProps) {
 const navigate = useNavigate();
 const [inputValue, setInputValue] = useState("");
 const [showHelp, setShowHelp] = useState(false);
 const [showAddUserHelp, setShowAddUserHelp] = useState(false);
 const [showColumnActionConfirmation, setShowColumnActionConfirmation] = useState(false);
 const [showPermissionError, setShowPermissionError] = useState(false);
 const [showAuthorizationHelp, setShowAuthorizationHelp] = useState(false);
 const [requestedAuthorization, setRequestedAuthorization] = useState("");
 const [showReport, setShowReport] = useState(false);
 const [reportData, setReportData] = useState<{
 type: string;
 title: string;
 } | null>(null);
 const [columnActionData, setColumnActionData] = useState<{
 columnActions: Array<{
 action: "show" | "hide" | "pin";
 columnKey: string;
 columnDisplayName: string;
 }>;
 screen: string;
 screenPath: string;
 } | null>(null);
 const [showTroubleshooting, setShowTroubleshooting] = useState(false);
 const [troubleshootingWorkListId, setTroubleshootingWorkListId] = useState("");
 const { setWorkListHiddenColumns } = useLayout();
 const { user } = useAuth();

 // Screen mapping - add new screens here for automatic navigation
 const screenMap: { [key: string]: string } = {
 // Business Insights
 'home': '/app/home',
 'homepage': '/app/home',
 'dashboard': '/app/dashboard',
 'operations dashboard': '/app/dashboard',
 'operations': '/app/dashboard',
 'monitoring dashboard': '/app/health',
 'monitoring': '/app/health',
 'health': '/app/health',
 'mhe dashboard': '/app/mhe',
 'mhe': '/app/mhe',
 'executive dashboard': '/app/executive',
 'executive': '/app/executive',
 'analytics': '/app/analytics',
 'activity report': '/app/activity-report',
 'user activity': '/app/activity-report',
 'workstation activity': '/app/activity-report',
 'user/workstation activity': '/app/activity-report',

 // Work List and variants
 'work list': '/app/worklist',
 'worklist': '/app/worklist',
 'pick': '/app/worklist?type=Pick',
 'pick list': '/app/worklist?type=Pick',
 'pick lists': '/app/worklist?type=Pick',
 'replenishment': '/app/worklist?type=Replenishment',
 'replenishment list': '/app/worklist?type=Replenishment',
 'replenishment lists': '/app/worklist?type=Replenishment',
 'cycle count': '/app/worklist?type=Cycle Count',
 'cycle counts': '/app/worklist?type=Cycle Count',
 'inspection': '/app/worklist?type=Inspection',
 'inspection list': '/app/worklist?type=Inspection',
 'inspection lists': '/app/worklist?type=Inspection',
 
 // System
 'property visibility': '/app/property-visibility',
 'logs': '/app/logs',
 'navigation': '/app/navigation',
 'user management': '/app/user-management',
 'users': '/app/user-management',
 'group management': '/app/group-management',
 'groups': '/app/group-management',
 
 // Other
 'projects': '/app/projects',
 'team': '/app/team',
 'settings': '/app/settings',
 };

 const handleCapabilityClick = (capability: any) => {
 // Set the input value for visual feedback
 setInputValue(capability.text);

 // If it has a path, navigate there and close
 if (capability.path) {
 navigate(capability.path);
 onClose();
 return;
 }

 // Otherwise, process the text through handleInputSubmit by temporarily setting inputValue
 // The handleInputSubmit function reads from inputValue state
 setTimeout(() => {
 handleInputSubmit();
 }, 0);
 };

 // Parse column commands (show/hide/pin column on screen)
 const parseColumnCommand = (input: string): {
 columnActions: Array<{
 action: "show" | "hide" | "pin";
 columnKey: string;
 columnDisplayName: string;
 }>;
 screen: string;
 screenPath: string;
 } | null => {
 const lowerInput = input.toLowerCase().trim();
 
 // Check if this is a column command at all
 const hasActionVerb = lowerInput.includes("show") || lowerInput.includes("display") || 
 lowerInput.includes("unhide") || lowerInput.includes("hide") || 
 lowerInput.includes("remove") || lowerInput.includes("pin");
 
 if (!hasActionVerb) return null;
 
 // Determine screen
 let screen = "work list";
 let screenPath = "/app/worklist";
 
 if (lowerInput.includes("work list") || lowerInput.includes("worklist")) {
 screen = "work list";
 screenPath = "/app/worklist";
 }
 // Add more screens here in the future
 
 const screenMapping = columnMappings[screen];
 if (!screenMapping) return null;
 
 // Split command by conjunctions to find multiple action segments
 const segments = lowerInput.split(/\s+and\s+|\s+then\s+|\s+also\s+|,\s*/);
 
 const columnActions: Array<{
 action: "show" | "hide" | "pin";
 columnKey: string;
 columnDisplayName: string;
 }> = [];
 
 // Process each segment
 for (const segment of segments) {
 const cleanSegment = segment.trim();
 
 // Determine action for this segment
 let segmentAction: "show" | "hide" | "pin" | null = null;
 if (cleanSegment.includes("show") || cleanSegment.includes("display") || cleanSegment.includes("unhide")) {
 segmentAction = "show";
 } else if (cleanSegment.includes("hide") || cleanSegment.includes("remove")) {
 segmentAction = "hide";
 } else if (cleanSegment.includes("pin")) {
 segmentAction = "pin";
 }
 
 if (!segmentAction) continue;
 
 // Create a cleaned segment by removing screen references and common phrases
 let cleanedSegment = cleanSegment;
 // Remove screen references
 cleanedSegment = cleanedSegment.replace(/on (the )?work list( screen)?/g, '');
 cleanedSegment = cleanedSegment.replace(/on (the )?worklist( screen)?/g, '');
 cleanedSegment = cleanedSegment.replace(/work list screen/g, '');
 cleanedSegment = cleanedSegment.replace(/worklist screen/g, '');
 // Remove the action words and common words
 cleanedSegment = cleanedSegment.replace(/\b(show|hide|display|unhide|remove|pin|me)\b/g, '');
 cleanedSegment = cleanedSegment.replace(/\b(column|columns|the|all|on)\b/g, '');
 cleanedSegment = cleanedSegment.trim();
 
 // Check for "all 5 attribute columns" or "all attribute columns"
 if ((cleanSegment.includes("all 5") || cleanSegment.includes("all attribute")) && cleanSegment.includes("attribute")) {
 columnActions.push(
 { action: segmentAction, columnKey: "attribute1", columnDisplayName: "Attribute 1" },
 { action: segmentAction, columnKey: "attribute2", columnDisplayName: "Attribute 2" },
 { action: segmentAction, columnKey: "attribute3", columnDisplayName: "Attribute 3" },
 { action: segmentAction, columnKey: "attribute4", columnDisplayName: "Attribute 4" },
 { action: segmentAction, columnKey: "attribute5", columnDisplayName: "Attribute 5" }
 );
 } 
 // Check for specific columns
 else {
 for (const [columnName, columnKey] of Object.entries(screenMapping)) {
 // Skip "work list" column name check to avoid confusion with screen name
 if (columnName === "work list") continue;
 
 // Check if the cleaned segment contains this column name
 if (cleanedSegment.includes(columnName)) {
 // Check if this column hasn't already been added with a different action
 const existingIndex = columnActions.findIndex(ca => ca.columnKey === columnKey);
 if (existingIndex === -1) {
 columnActions.push({
 action: segmentAction,
 columnKey,
 columnDisplayName: columnDisplayNames[columnKey] || columnName
 });
 }
 }
 }
 }
 }
 
 if (columnActions.length === 0) return null;
 
 return {
 columnActions,
 screen,
 screenPath
 };
 };

 const handleInputSubmit = () => {
 const lowerInput = inputValue.toLowerCase().trim();
 
 // Check for requests to view users with specific authorizations - CHECK THIS FIRST
 // This needs to be before screen navigation to avoid conflicts
 if (
 (lowerInput.includes("show me") || lowerInput.includes("list") || lowerInput.includes("view") || lowerInput.includes("who has")) &&
 (lowerInput.includes("user") || lowerInput.includes("users")) &&
 (lowerInput.includes("access to") || lowerInput.includes("access") || lowerInput.includes("authorization") || lowerInput.includes("permission"))
 ) {
 // Extract the authorization name from the input
 // Common patterns: "show me users who have access to X", "list users with X access", "who has access to X"
 let authorization = "";
 
 // First check for specific dashboard/screen names before trying regex
 if (lowerInput.includes("executive dashboard") || (lowerInput.includes("executive") && lowerInput.includes("dashboard"))) {
 authorization = "Executive Dashboard";
 } else if (lowerInput.includes("operations dashboard") || (lowerInput.includes("operations") && lowerInput.includes("dashboard"))) {
 authorization = "Operations Dashboard";
 } else if (lowerInput.includes("health dashboard") || (lowerInput.includes("monitoring") && lowerInput.includes("dashboard"))) {
 authorization = "Health Dashboard";
 } else if (lowerInput.includes("work list") && !lowerInput.includes("dashboard")) {
 authorization = "Work List";
 } else if (lowerInput.includes("user management")) {
 authorization = "User Management";
 } else if (lowerInput.includes("group management")) {
 authorization = "Group Management";
 } else {
 // Try to extract after "access to" using greedy regex
 const accessToMatch = lowerInput.match(/access to (?:the )?([a-z\s]+)/i);
 if (accessToMatch) {
 authorization = accessToMatch[1].trim();
 // Capitalize first letter of each word
 authorization = authorization.split(' ').map(word => 
 word.charAt(0).toUpperCase() + word.slice(1)
 ).join(' ');
 }
 }
 
 if (authorization) {
 setRequestedAuthorization(authorization);
 setShowAuthorizationHelp(true);
 return;
 }
 }
 
 // Check for troubleshooting request - replen result not received
 if (
 (lowerInput.includes("did not receive") || lowerInput.includes("didn't receive") || lowerInput.includes("not receive") || lowerInput.includes("missing")) &&
 (lowerInput.includes("replen") || lowerInput.includes("replenishment")) &&
 (lowerInput.includes("result") || lowerInput.includes("response"))
 ) {
 // Extract work list ID using regex - look for patterns like WL-XXX or WL XXX
 const workListMatch = lowerInput.match(/(?:wl|work\s*list)[\s-]*(\d+)/i);
 if (workListMatch) {
 const workListNumber = workListMatch[1].padStart(3, '0');
 setTroubleshootingWorkListId(`WL-${workListNumber}`);
 setShowTroubleshooting(true);
 return;
 }
 }
 
 // Check for report generation requests - user productivity report
 if (
 (lowerInput.includes("report") || lowerInput.includes("list") || lowerInput.includes("show me") || lowerInput.includes("generate")) &&
 (lowerInput.includes("logged in user") || lowerInput.includes("active user") || lowerInput.includes("user") && (lowerInput.includes("productivity") || lowerInput.includes("pick") || lowerInput.includes("putaway") || lowerInput.includes("rate")))
 ) {
 setReportData({
 type: "user-productivity",
 title: "User Productivity Report",
 });
 setShowReport(true);
 return;
 }
 
 // Also trigger report for simpler queries about logged in users
 if (
 (lowerInput.includes("logged in user") || lowerInput.includes("active user")) &&
 (lowerInput.includes("show") || lowerInput.includes("list") || lowerInput.includes("display"))
 ) {
 setReportData({
 type: "user-productivity",
 title: "User Productivity Report",
 });
 setShowReport(true);
 return;
 }
 
 // Try to parse as a column command first
 const columnCommand = parseColumnCommand(lowerInput);
 if (columnCommand) {
 // Check if user has permission to modify columns
 if (user?.role !== "admin") {
 setShowPermissionError(true);
 return;
 }
 setColumnActionData(columnCommand);
 setShowColumnActionConfirmation(true);
 return;
 }
 
 // Check for help requests about assigning work lists
 if (
 lowerInput.includes("assign") && 
 (lowerInput.includes("work list") || lowerInput.includes("worklist")) &&
 (lowerInput.includes("workstation") || lowerInput.includes("how") || lowerInput.includes("show me"))
 ) {
 setShowHelp(true);
 return;
 }
 
 // Check for help requests about adding a new user
 if (
 (lowerInput.includes("add") || lowerInput.includes("create") || lowerInput.includes("new")) && 
 lowerInput.includes("user") &&
 (lowerInput.includes("how") || lowerInput.includes("help") || lowerInput.includes("show me") || lowerInput.includes("guide"))
 ) {
 setShowAddUserHelp(true);
 return;
 }
 
 // Check for work list with ID - e.g., "Work List WL-101" or "WL-101"
 const workListIdMatch = lowerInput.match(/(?:wl|work\s*list)[:\s-]*(\d+)/i);
 if (workListIdMatch) {
 const workListNumber = workListIdMatch[1].padStart(3, '0');
 const workListId = `WL-${workListNumber}`;
 navigate(`/app/worklist?search=${encodeURIComponent(workListId)}`);
 onClose();
 return;
 }
 
 // Remove "open" prefix if present
 let searchTerm = lowerInput;
 if (searchTerm.startsWith('open ')) {
 searchTerm = searchTerm.substring(5).trim();
 }
 
 // Remove common suffixes like "screen", "page", "view"
 const suffixes = [' screen', ' page', ' view'];
 for (const suffix of suffixes) {
 if (searchTerm.endsWith(suffix)) {
 searchTerm = searchTerm.substring(0, searchTerm.length - suffix.length).trim();
 break;
 }
 }
 
 // Check if the input matches any screen name exactly
 if (screenMap[searchTerm]) {
 navigate(screenMap[searchTerm]);
 onClose();
 return;
 }
 
 // Check for partial matches (e.g., if user types part of a screen name)
 for (const [screenName, path] of Object.entries(screenMap)) {
 if (screenName.includes(searchTerm) || searchTerm.includes(screenName)) {
 navigate(path);
 onClose();
 return;
 }
 }
 
 // If no match found, do nothing (could add a "screen not found" message here in the future)
 };

 const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
 if (e.key === "Enter") {
 handleInputSubmit();
 }
 };

 if (showHelp) {
 return <HelpPopup onClose={onClose} />;
 }

 if (showAddUserHelp) {
 return <AddUserHelpPopup onClose={onClose} />;
 }

 if (showAuthorizationHelp && requestedAuthorization) {
 return <AuthorizationHelpPopup onClose={onClose} authorization={requestedAuthorization} />;
 }

 if (showPermissionError) {
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

 {/* Permission Error Modal */}
 <motion.div
 initial={{ scale: 0.9, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 exit={{ scale: 0.9, opacity: 0 }}
 transition={{ type: "spring", damping: 25, stiffness: 200 }}
 onClick={(e) => e.stopPropagation()}
 className="relative w-full max-w-lg bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] border border-[var(--border)]  rounded-2xl p-8"
 >
 {/* Close button */}
 <button
 onClick={onClose}
 className="absolute top-6 right-6 w-10 h-10 bg-[var(--surface-container-low)] dark:bg-[var(--card)] hover:bg-[var(--surface-container-high)] rounded-full flex items-center justify-center transition-colors z-10"
 >
 <X size={20} className="text-[var(--foreground)] " />
 </button>

 {/* Content */}
 <div className="flex flex-col items-center text-center pt-4">
 <motion.div
 initial={{ scale: 0 }}
 animate={{ scale: 1 }}
 transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
 className="w-20 h-20 bg-[var(--primary)]  rounded-full flex items-center justify-center mb-6 "
 >
 <Sparkles size={36} className="text-[var(--primary-foreground)]" />
 </motion.div>
 <h3 className="text-[var(--foreground)]  text-2xl font-bold mb-4">Access Restricted</h3>
 <p className="text-[var(--foreground)] text-base leading-relaxed mb-6">
 I am sorry, you are logged in with a user who does not have access to that function. Please contact your administrator to update your access.
 </p>
 <button
 onClick={onClose}
 className="px-6 py-3 bg-[var(--primary)]  hover:opacity-90 active:scale-[0.98] text-[var(--primary-foreground)] rounded-lg font-medium transition-colors"
 >
 OK
 </button>
 </div>
 </motion.div>
 </motion.div>
 );
 }

 if (showColumnActionConfirmation && columnActionData) {
 return (
 <ColumnActionConfirmation 
 columnActions={columnActionData.columnActions}
 screen={columnActionData.screen}
 screenPath={columnActionData.screenPath}
 onClose={onClose} 
 />
 );
 }

 if (showReport && reportData) {
 return (
 <ReportOverlay 
 reportType={reportData.type}
 reportTitle={reportData.title}
 onClose={onClose} 
 />
 );
 }

 if (showTroubleshooting) {
 return (
 <TroubleshootingModal 
 isOpen={showTroubleshooting}
 workListId={troubleshootingWorkListId}
 onClose={onClose} 
 />
 );
 }

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
 className="relative w-full max-w-6xl max-h-[90vh] bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] border border-[var(--border)]  rounded-2xl overflow-y-auto"
 >
 {/* Close button */}
 <button
 onClick={onClose}
 className="absolute top-6 right-6 w-10 h-10 bg-[var(--surface-container-low)] dark:bg-[var(--card)] hover:bg-[var(--surface-container-high)] rounded-full flex items-center justify-center transition-colors z-10"
 >
 <X size={20} className="text-[var(--foreground)] " />
 </button>

 {/* Panel Content */}
 <div className="p-8 pt-20">
 {/* AI Icon and Title */}
 <div className="flex flex-col items-center text-center mb-8">
 <motion.div
 initial={{ scale: 0 }}
 animate={{ scale: 1 }}
 transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
 className="w-20 h-20 bg-[var(--primary)]  rounded-full flex items-center justify-center mb-4 "
 >
 <Sparkles size={36} className="text-[var(--primary-foreground)]" />
 </motion.div>
 <h3 className="text-[var(--foreground)]  text-3xl font-bold mb-2">OPTO</h3>
 <p className="text-[var(--muted-foreground)] text-lg">How can I help you navigate today?</p>
 </div>

 {/* Input field */}
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.3 }}
 className="mb-8"
 >
 <div className="flex items-center gap-3 bg-[var(--surface-container-low)] dark:bg-[var(--card)] rounded-xl px-5 py-4 border border-[var(--border)]  focus-within:border-[var(--primary)] dark:focus-within:border-[var(--primary)] transition-colors">
 <input
 type="text"
 placeholder="Ask me anything about your workspace..."
 className="flex-1 bg-transparent text-[var(--foreground)]  placeholder-zinc-500 dark:placeholder-zinc-500 outline-none"
 autoFocus
 value={inputValue}
 onChange={(e) => setInputValue(e.target.value)}
 onKeyDown={handleKeyDown}
 />
 <Sparkles size={20} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 </div>
 </motion.div>

  {/* Capability Sections */}
  <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.4 }}
  >
  <OPTOCapabilitiesGrid onCapabilityClick={handleCapabilityClick} />
  </motion.div>
  </div>
  </motion.div>
  </motion.div>
  );
}