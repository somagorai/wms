import { useState, KeyboardEvent, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Server, Database, Boxes, Wrench, Search, FileText, HelpCircle, Navigation as NavigationIcon, Zap, BarChart3, CheckCircle2, AlertTriangle, XCircle, Mic, MicOff, Activity, TrendingUp, Cpu, Monitor, Clock, Package, Star, Scan, Radio } from "lucide-react";
import { motion } from "motion/react";
import { useLayout } from "../contexts/LayoutContext";
import { useAuth } from "../contexts/AuthContext";
import { useVersionTheme } from "../contexts/VersionThemeContext";
import { useBookmarks } from "../contexts/BookmarkContext";
import { HelpPopup } from "../components/HelpPopup";
import { AddUserHelpPopup } from "../components/AddUserHelpPopup";
import { AuthorizationHelpPopup } from "../components/AuthorizationHelpPopup";
import { ReportOverlay } from "../components/ReportOverlay";
import { TroubleshootingModal } from "../components/TroubleshootingModal";
import { TroubleshootingWorkListPrompt } from "../components/TroubleshootingWorkListPrompt";
import { InteractiveColumnDialog } from "../components/InteractiveColumnDialog";
import { ColumnManagementOptions } from "../components/ColumnManagementOptions";
import { OPTOCapabilitiesGrid } from "../components/OPTOCapabilitiesGrid";

// Status tile data
const statusTiles = [
 {
 id: "mhe",
 title: "MHE Equipment",
 icon: Boxes,
 total: 19,
 healthy: 15,
 degraded: 1,
 down: 3,
 path: "/app/mhe",
 section: null
 },
 {
 id: "services",
 title: "Services",
 icon: Wrench,
 total: 8,
 healthy: 5,
 degraded: 1,
 down: 2,
 path: "/app/health",
 section: "services"
 },
 {
 id: "servers",
 title: "Servers",
 icon: Server,
 total: 8,
 healthy: 4,
 degraded: 1,
 down: 3,
 path: "/app/health",
 section: "servers"
 },
 {
 id: "databases",
 title: "Databases",
 icon: Database,
 total: 6,
 healthy: 5,
 degraded: 0,
 down: 1,
 path: "/app/health",
 section: "databases"
 }
];

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

export function Home() {
  const { version } = useVersionTheme();
  const isV6 = version === "Master Blue V6";
 const navigate = useNavigate();
 const { bookmarkedTiles, toggleBookmark, isBookmarked } = useBookmarks();
 const [inputValue, setInputValue] = useState("");
 const [isListening, setIsListening] = useState(false);
 const [micError, setMicError] = useState("");
 const [optoResponse, setOptoResponse] = useState("");
 const [showHelp, setShowHelp] = useState(false);
 const [showAddUserHelp, setShowAddUserHelp] = useState(false);
 const [showAuthorizationHelp, setShowAuthorizationHelp] = useState(false);
 const [requestedAuthorization, setRequestedAuthorization] = useState("");
 const [showReport, setShowReport] = useState(false);
 const [reportData, setReportData] = useState<{
 type: string;
 title: string;
 } | null>(null);
 const [showTroubleshooting, setShowTroubleshooting] = useState(false);
 const [troubleshootingWorkListId, setTroubleshootingWorkListId] = useState("");
 const [showTroubleshootingPrompt, setShowTroubleshootingPrompt] = useState(false);
 const [showColumnDialog, setShowColumnDialog] = useState(false);
 const [sectionsExpanded, setSectionsExpanded] = useState(false);

 // Refs for click outside detection
 const optoContainerRef = useRef<HTMLDivElement>(null);
 const sectionsContainerRef = useRef<HTMLDivElement>(null);

 // Map icon names to icon components
 const getIconComponent = (iconName: string) => {
 const iconMap: { [key: string]: any } = {
 Boxes,
 Wrench,
 Server,
 Database,
 Activity,
 TrendingUp,
 Monitor,
 Cpu,
 CheckCircle2,
 AlertTriangle,
 XCircle,
 Clock,
 Package,
 Scan,
 Radio,
 };
 return iconMap[iconName] || Boxes;
 };

 // Handle bookmark removal from home screen
 const handleRemoveBookmark = (e: React.MouseEvent, tileId: string) => {
 e.stopPropagation();
 toggleBookmark({
 id: tileId,
 title: "",
 type: "operations",
 icon: "",
 data: {}
 });
 };

 // Handle bookmarked tile click
 const handleBookmarkedTileClick = (tile: any) => {
 // Navigate to the appropriate dashboard based on type
 const dashboardPaths: { [key: string]: string } = {
 operations: "/app/dashboard",
 executive: "/app/executive",
 mhe: "/app/mhe",
 health: "/app/health",
 };

 const path = dashboardPaths[tile.type];
 if (path) {
 navigate(path);
 }
 };

 // Handle clicks outside Ask OPTO to collapse sections
 useEffect(() => {
 const handleClickOutside = (event: MouseEvent) => {
 if (sectionsExpanded) {
 const target = event.target as Node;
 const clickedInsideOpto = optoContainerRef.current?.contains(target);
 const clickedInsideSections = sectionsContainerRef.current?.contains(target);

 if (!clickedInsideOpto && !clickedInsideSections) {
 setSectionsExpanded(false);
 }
 }
 };

 document.addEventListener('mousedown', handleClickOutside);
 return () => {
 document.removeEventListener('mousedown', handleClickOutside);
 };
 }, [sectionsExpanded]);

 // Screen mapping - same as AIOverlay
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

 const handleInputSubmit = (textOverride?: string) => {
 const lowerInput = (textOverride || inputValue).toLowerCase().trim();
 
 if (!lowerInput) {
 setOptoResponse("I'm here to help! Try clicking one of the suggested actions above, or ask me about navigating the system, managing users, generating reports, or troubleshooting issues.");
 return;
 }

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
 (lowerInput.includes("did not receive") || lowerInput.includes("didn't receive") || lowerInput.includes("not receive") || lowerInput.includes("missing") || lowerInput.includes("troubleshoot")) &&
 (lowerInput.includes("replen") || lowerInput.includes("replenishment")) &&
 (lowerInput.includes("result") || lowerInput.includes("response") || lowerInput.includes("troubleshoot"))
 ) {
 // Extract work list ID using regex - look for patterns like WL-XXX or WL XXX
 const workListMatch = lowerInput.match(/(?:wl|work\s*list)[\s-]*(\d+)/i);
 if (workListMatch) {
 const workListNumber = workListMatch[1].padStart(3, '0');
 setTroubleshootingWorkListId(`WL-${workListNumber}`);
 setShowTroubleshooting(true);
 } else {
 // No work list specified - show prompt to ask user
 setShowTroubleshootingPrompt(true);
 }
 return;
 }

 // Check for report generation requests
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

 // Check for column management
 if (lowerInput.includes("column") && (lowerInput.includes("show") || lowerInput.includes("hide") || lowerInput.includes("pin") || lowerInput.includes("manage"))) {
 // Open interactive column dialog
 setShowColumnDialog(true);
 return;
 }

 // Check for filter work items
 if (lowerInput.includes("filter work items") || lowerInput.includes("filter work")) {
 navigate("/app/worklist");
 setOptoResponse("");
 return;
 }

 // Check for manage users
 if (lowerInput.includes("manage users")) {
 navigate("/app/user-management");
 setOptoResponse("");
 return;
 }

 // Check for pin columns
 if (lowerInput.includes("pin columns")) {
 setShowColumnDialog(true);
 return;
 }

 // Check for show/hide columns
 if (lowerInput.includes("show/hide columns") || (lowerInput.includes("show") && lowerInput.includes("hide") && lowerInput.includes("columns"))) {
 setShowColumnDialog(true);
 return;
 }

 // Check for assign work lists
 if (lowerInput.includes("assign work lists") || lowerInput.includes("assign work list")) {
 setShowHelp(true);
 return;
 }

 // Check for pick/putaway rates
 if (lowerInput.includes("pick/putaway rates") || lowerInput.includes("pick putaway rates")) {
 navigate("/app/analytics");
 setOptoResponse("");
 return;
 }

 // Check for performance metrics
 if (lowerInput.includes("performance metrics")) {
 navigate("/app/analytics");
 setOptoResponse("");
 return;
 }

 // Check for work operations summary
 if (lowerInput.includes("work operations summary")) {
 navigate("/app/dashboard");
 setOptoResponse("");
 return;
 }

 // Check for navigation help
 if (lowerInput.includes("navigation help")) {
 navigate("/app/navigation");
 setOptoResponse("");
 return;
 }

 // Check for column management guide
 if (lowerInput.includes("column management guide")) {
 navigate("/app/worklist");
 setOptoResponse("");
 return;
 }
 
 // Check for work list with ID - e.g., "Work List WL-101" or "WL-101"
 const workListIdMatch = lowerInput.match(/(?:wl|work\s*list)[:\s-]*(\d+)/i);
 if (workListIdMatch) {
 const workListNumber = workListIdMatch[1].padStart(3, '0');
 const workListId = `WL-${workListNumber}`;
 navigate(`/app/worklist?search=${encodeURIComponent(workListId)}`);
 setOptoResponse("");
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
 setOptoResponse("");
 return;
 }
 
 // Check for partial matches
 for (const [screenName, path] of Object.entries(screenMap)) {
 if (screenName.includes(searchTerm) || searchTerm.includes(screenName)) {
 navigate(path);
 setOptoResponse("");
 return;
 }
 }
 
 // If no match found, show generic response
 setOptoResponse("I'm not sure what you're looking for. Try clicking one of the suggested actions above, or ask me about navigating the system, managing users, generating reports, or troubleshooting issues.");
 };

 const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
 if (e.key === "Enter") {
 handleInputSubmit();
 }
 };

 const handleMicClick = async () => {
 // Clear any previous errors
 setMicError("");

 // Check if running in an iframe (preview mode)
 if (window.self !== window.top) {
 setMicError('Voice input is not available in preview mode. This feature will work when deployed to a standalone environment.');
 return;
 }

 if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
 setMicError('Speech recognition is not supported in your browser.');
 return;
 }

 if (isListening) {
 // Stop listening
 setIsListening(false);
 return;
 }

 try {
 // Check current permission state
 const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
 
 if (result.state === 'denied') {
 setMicError('Microphone is blocked for this site. To fix: 1) Click the lock icon (🔒) in your browser address bar (left of the URL), 2) Find "Microphone" in the list, 3) Change it from "Block" to "Allow", 4) Refresh the page.');
 return;
 }

 // Now try to get microphone access
 const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
 
 // Permission granted! Stop the stream immediately
 stream.getTracks().forEach(track => track.stop());
 
 // Now start speech recognition with confirmed permissions
 setIsListening(true);
 
 const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
 const recognition = new SpeechRecognition();
 
 recognition.continuous = false;
 recognition.interimResults = false;
 recognition.lang = 'en-US';

 recognition.onstart = () => {
 // Successfully started
 setMicError("");
 };

 recognition.onresult = (event: any) => {
 const transcript = event.results[0][0].transcript;
 setInputValue(transcript);
 setIsListening(false);
 setMicError("");
 };

 recognition.onerror = (event: any) => {
 setIsListening(false);
 if (event.error === 'not-allowed') {
 setMicError('Speech recognition permission denied by browser.');
 } else if (event.error === 'no-speech') {
 setMicError('No speech detected. Please try again.');
 } else if (event.error === 'network') {
 setMicError('Network error. Please check your internet connection.');
 } else if (event.error === 'aborted') {
 setMicError("");
 } else if (event.error === 'service-not-allowed') {
 setMicError('Speech recognition service is not available. Please ensure you are using HTTPS or localhost.');
 } else {
 setMicError(`Speech recognition error: ${event.error}`);
 }
 };

 recognition.onend = () => {
 setIsListening(false);
 };

 recognition.start();
 } catch (err: any) {
 setIsListening(false);
 
 if (err.name === 'NotAllowedError') {
 setMicError('Microphone is blocked for this site. To fix: 1) Click the lock icon (🔒) in your browser address bar (left of the URL), 2) Find "Microphone" in the list, 3) Change it from "Block" to "Allow", 4) Refresh the page.');
 } else if (err.name === 'NotFoundError') {
 setMicError('No microphone found. Please connect a microphone and try again.');
 } else if (err.name === 'NotSupportedError') {
 setMicError('Microphone access requires HTTPS. Please use https:// or localhost.');
 } else {
 setMicError(`Error accessing microphone: ${err.message || err.name || 'Unknown error'}`);
 }
 }
 };

 const handleCapabilityClick = (capability: any) => {
 // Set the input value for visual feedback
 setInputValue(capability.text);
 
 // Immediately process the text through handleInputSubmit
 handleInputSubmit(capability.text);
 };

 const handleTileClick = (path: string, section: string | null) => {
 console.log('Tile clicked - path:', path, 'section:', section);
 if (section) {
 // Navigate with hash fragment - target page will handle scrolling
 const fullPath = `${path}#${section}`;
 console.log('Navigating to:', fullPath);
 navigate(fullPath);
 } else {
 navigate(path);
 }
 };

 const getStatusColor = (healthy: number, degraded: number, down: number) => {
 if (down > 0) return "text-[var(--destructive)] dark:text-[var(--destructive)]";
 if (degraded > 0) return "text-[var(--tertiary)] dark:text-[var(--tertiary)]";
 return "text-[var(--primary)] dark:text-[var(--primary)]";
 };

 const getStatusBgColor = (healthy: number, degraded: number, down: number) => {
 if (down > 0) return "bg-[var(--destructive)]/10 dark:bg-[var(--destructive)]/10";
 if (degraded > 0) return "bg-[var(--tertiary)]/10 dark:bg-[var(--tertiary)]/10";
 return "bg-[var(--primary)]/10 /10";
 };

 const getStatusIcon = (healthy: number, degraded: number, down: number) => {
 if (down > 0) return XCircle;
 if (degraded > 0) return AlertTriangle;
 return CheckCircle2;
 };

 return (
    <div className="min-h-screen p-8 relative flex flex-col overflow-hidden bg-[var(--background)]">
      {/* AI Ambient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--primary)]/[0.06] rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[var(--primary)]/[0.04] rounded-full blur-3xl" />
        <svg className="w-full h-full opacity-[0.12]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <circle cx="40" cy="40" r="1.5" fill="var(--primary)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <g stroke="var(--primary)" strokeWidth="1" fill="none" opacity="0.4">
            <line x1="0" y1="100" x2="400" y2="150" />
            <line x1="200" y1="200" x2="800" y2="250" />
            <line x1="400" y1="300" x2="1200" y2="350" />
            <line x1="100" y1="400" x2="700" y2="450" />
            <line x1="500" y1="600" x2="1400" y2="650" />
            <line x1="100" y1="150" x2="500" y2="350" />
            <line x1="300" y1="250" x2="700" y2="450" />
            <line x1="800" y1="250" x2="1200" y2="650" />
            <circle cx="100" cy="150" r="2.5" fill="var(--primary)" opacity="0.8" />
            <circle cx="500" cy="350" r="2.5" fill="var(--primary)" opacity="0.8" />
            <circle cx="900" cy="550" r="2.5" fill="var(--primary)" opacity="0.8" />
            <circle cx="1300" cy="250" r="2.5" fill="var(--primary)" opacity="0.8" />
          </g>
        </svg>
      </div>

      <div className="max-w-[1600px] w-full mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[var(--foreground)] mb-2 tracking-tight">Meet OPTO</h1>
          <p className="text-[var(--muted-foreground)] text-lg">Your intelligent warehouse assistant is here to help</p>
        </div>

        {/* Status Tiles */}
        <div className="border border-[var(--border)]/70 rounded-2xl p-6 bg-[var(--surface-container-low)] mb-12">
          {/* Overview Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center">
              <BarChart3 size={20} className="text-[var(--primary)]" />
            </div>
            <h2 className="text-[var(--foreground)] font-semibold">Overview</h2>
          </div>

          {/* Tiles Grid - Combine default tiles with bookmarked tiles */}
          <div className="grid grid-cols-4 gap-3">
            {statusTiles.map((tile) => {
              const Icon = tile.icon;
              const StatusIcon = getStatusIcon(tile.healthy, tile.degraded, tile.down);
              const statusColor = getStatusColor(tile.healthy, tile.degraded, tile.down);
              const statusBgColor = getStatusBgColor(tile.healthy, tile.degraded, tile.down);
              
              // Get the border accent color based on status
              const getBorderAccent = () => {
                if (tile.down > 0) return "bg-[var(--state-error)]";
                if (tile.degraded > 0) return "bg-[var(--state-warning)]";
                return "bg-[var(--state-success)]";
              };

              // Get the hover border color based on status
              const getHoverBorderColor = () => {
                if (tile.down > 0) return "hover:border-[var(--state-error)]/40";
                if (tile.degraded > 0) return "hover:border-[var(--state-warning)]";
                return "hover:border-[var(--state-success)]/40";
              };

              return (
                <motion.div
                  key={tile.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`group relative bg-[var(--surface)] border border-[var(--border)]/70 rounded-xl p-3 cursor-pointer transition-all duration-200 overflow-hidden ${isV6 ? "hover:shadow-[0_0_15px_color-mix(in_srgb,var(--primary)_30%,transparent)] hover:border-transparent dark:hover:border-transparent" : "hover:scale-105 " + getHoverBorderColor()}`}
                  onClick={() => handleTileClick(tile.path, tile.section)}
                >
                  {/* Left Accent Line */}
                  {!isV6 && <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/5 ${getBorderAccent()} rounded-r-full transition-all duration-200 group-hover:h-full group-hover:top-0 group-hover:translate-y-0 group-hover:rounded-r-none`} />}
                  
                  {/* Header with Icon and Status Badge */}
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-10 h-10 ${statusBgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                      <Icon size={20} className={statusColor} />
                    </div>
                    <div className={`px-2 py-0.5 rounded-lg flex items-center gap-1 ${statusBgColor} border border-[var(--border)]/50`}>
                      <StatusIcon size={12} className={statusColor} />
                      <span className={`text-xs font-bold ${statusColor}`}>{tile.total}</span>
                    </div>
                  </div>

 {/* Title */}
 <h3 className="text-[var(--foreground)]  font-bold text-sm mb-2 truncate group-hover:text-[var(--primary)] dark:group-hover:text-[var(--primary)] transition-colors">
 {tile.title}
 </h3>

 {/* Status Breakdown */}
 <div className="flex items-center gap-2 text-xs">
 <div className="flex items-center gap-1">
 <div className="w-1.5 h-1.5 rounded-full bg-[var(--state-success)] dark:bg-[var(--state-success)] animate-pulse" />
 <span className="font-semibold text-[var(--state-on-success-container)] dark:text-[var(--state-success)]">{tile.healthy}</span>
 </div>
 {tile.degraded > 0 && (
 <>
 <div className="w-px h-2.5 bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)]" />
 <div className="flex items-center gap-1">
 <div className="w-1.5 h-1.5 rounded-full bg-[var(--state-warning)] dark:bg-[var(--state-warning)] animate-pulse" />
 <span className="font-semibold text-[var(--state-on-warning-container)] dark:text-[var(--state-warning)]">{tile.degraded}</span>
 </div>
 </>
 )}
 {tile.down > 0 && (
 <>
 <div className="w-px h-2.5 bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)]" />
 <div className="flex items-center gap-1">
 <div className="w-1.5 h-1.5 rounded-full bg-[var(--state-error)] dark:bg-[var(--state-error)] animate-pulse" />
 <span className="font-semibold text-[var(--state-error)] dark:text-[var(--state-error)]">{tile.down}</span>
 </div>
 </>
 )}
 </div>
 </motion.div>
 );
 })}

 {/* Bookmarked Tiles */}
 {bookmarkedTiles.map((bookmarkedTile) => {
 const Icon = getIconComponent(bookmarkedTile.icon);
 const data = bookmarkedTile.data;

 // Determine status and colors based on tile data
 let statusColor = "text-[var(--primary)] dark:text-[var(--primary)]";
 let statusBgColor = "bg-[var(--primary)]/10 /10";
 let StatusIcon = CheckCircle2;
 let borderAccent = "bg-[var(--state-success)] dark:bg-[var(--state-success)]";
 let hoverBorderColor = "hover:border-[var(--state-success)]/40 dark:hover:border-[var(--state-success)]/50";

 // Check if this tile has status information
 if (data.status) {
 if (data.status === "down" || data.status === "critical" || data.status === "Warning") {
 statusColor = "text-[var(--state-error)] dark:text-[var(--state-error)]";
 statusBgColor = "bg-[var(--state-error-container)] dark:bg-[var(--state-error-container)]";
 StatusIcon = AlertTriangle;
 borderAccent = "bg-[var(--state-error)] dark:bg-[var(--state-error)]";
 hoverBorderColor = "hover:border-[var(--state-error)]/50 dark:hover:border-[var(--state-error)]/40";
 } else if (data.status === "up") {
 // MHE tiles use "up" for operational status
 statusColor = "text-[var(--state-on-success-container)] dark:text-[var(--state-success)]";
 statusBgColor = "bg-[var(--state-success-container)] dark:bg-[var(--state-success-container)]";
 StatusIcon = CheckCircle2;
 borderAccent = "bg-[var(--state-success)] dark:bg-[var(--state-success)]";
 hoverBorderColor = "hover:border-[var(--state-success)]/50 dark:hover:border-[var(--state-success)]/40";
 } else if (data.status === "warning") {
 // Storage tiles use orange for warning status
 statusColor = "text-[var(--state-warning)]";
 statusBgColor = "bg-[var(--state-warning-container)] dark:bg-[var(--state-warning-container)]/30";
 StatusIcon = AlertTriangle;
 borderAccent = "bg-[var(--state-warning)]";
 hoverBorderColor = "hover:border-[var(--state-warning)]/50 dark:hover:border-[var(--state-warning)]/40";
 } else if (data.status === "Queued") {
 statusColor = "text-[var(--state-info)] dark:text-[var(--state-info)]";
 statusBgColor = "bg-[var(--state-info-container)] dark:bg-[var(--state-info-container)]";
 StatusIcon = Clock;
 borderAccent = "bg-[var(--state-info)] dark:bg-[var(--state-info)]";
 hoverBorderColor = "hover:border-[var(--state-info)] dark:hover:border-[var(--state-info)]/40";
 } else if (data.status === "In Progress") {
 statusColor = "text-[var(--primary)] dark:text-[var(--primary)]";
 statusBgColor = "bg-[var(--primary)]/10 /10";
 StatusIcon = Activity;
 borderAccent = "bg-[var(--primary)] ";
 hoverBorderColor = "hover:border-[var(--primary)] dark:hover:border-[var(--primary)]";
 } else if (data.status === "Completed" || data.status === "good") {
 statusColor = "text-[var(--state-on-success-container)] dark:text-[var(--state-success)]";
 statusBgColor = "bg-[var(--state-success-container)] dark:bg-[var(--state-success-container)]";
 StatusIcon = CheckCircle2;
 borderAccent = "bg-[var(--state-success)] dark:bg-[var(--state-success)]";
 hoverBorderColor = "hover:border-[var(--state-success)]/50 dark:hover:border-[var(--state-success)]/40";
 } else if (data.status === "degraded") {
 statusColor = "text-[var(--state-on-warning-container)] dark:text-[var(--state-warning)]";
 statusBgColor = "bg-[var(--state-warning-container)] dark:bg-[var(--state-warning-container)]";
 StatusIcon = AlertTriangle;
 borderAccent = "bg-[var(--state-warning)] dark:bg-[var(--state-warning)]";
 hoverBorderColor = "hover:border-yellow-400 dark:hover:border-[var(--state-warning)]";
 }
 }

 // Check if this is a storage capacity tile
 const isStorageCapacityTile = data.capacity !== undefined && data.total !== undefined && data.available !== undefined;

 // Check if this is a locations picked/replenished tile (has racks, containers, pallets, pods data)
 const isLocationActivityTile = data.racks !== undefined && data.racks.today !== undefined;

 // Check if this is a workstation tile (has user, task, duration)
 const isWorkstationTile = data.user !== undefined && data.task !== undefined && data.duration !== undefined;

 // Check if this is an MHE scanner tile
 const isMHEScannerTile = bookmarkedTile.type === "mhe" && bookmarkedTile.subType === "scanners";

 // Check if this is an MHE conveyor tile
 const isMHEConveyorTile = bookmarkedTile.type === "mhe" && bookmarkedTile.subType === "conveyors";

 // Check if this is an MHE palletizer tile
 const isMHEPalletizerTile = bookmarkedTile.type === "mhe" && bookmarkedTile.subType === "palletizers";

 // Check if this is an MHE robot tile
 const isMHERobotTile = bookmarkedTile.type === "mhe" && bookmarkedTile.subType === "robots";

 // Check if this is a Health Dashboard service tile
 const isHealthServiceTile = bookmarkedTile.type === "health" && bookmarkedTile.subType === "services";

 // Check if this is a Health Dashboard database tile
 const isHealthDatabaseTile = bookmarkedTile.type === "health" && bookmarkedTile.subType === "databases";

 return (
 <motion.div
 key={bookmarkedTile.id}
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 className={`group relative border-2 border-[var(--border)]  rounded-xl p-3 cursor-pointer transition-all duration-200 overflow-hidden ${isLocationActivityTile ? 'col-span-2' : ''} ${isV6 ? "hover:shadow-[0_0_15px_color-mix(in_srgb,var(--primary)_30%,transparent)] hover:border-transparent dark:hover:border-transparent" : "hover:scale-105 " + hoverBorderColor}`}
 onClick={() => handleBookmarkedTileClick(bookmarkedTile)}
 >
 {/* Left Accent Line */}
 {!isV6 && <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/5 ${borderAccent} rounded-r-full transition-all duration-200 group-hover:h-full group-hover:top-0 group-hover:translate-y-0 group-hover:rounded-r-none`} />}

 {/* Storage Capacity Tile Layout */}
 {isStorageCapacityTile ? (
 <>
 {/* Header with Title and Bookmark */}
 <div className="flex items-center justify-between mb-3">
 <h3 className="text-sm font-semibold text-[var(--foreground)] ">{bookmarkedTile.title}</h3>
 <button
 onClick={(e) => handleRemoveBookmark(e, bookmarkedTile.id)}
 className="p-1 hover:bg-[var(--surface-container-high)] rounded transition-colors"
 title="Remove bookmark"
 >
 <Star className={`fill-current ${statusColor}`} size={14} />
 </button>
 </div>

 {/* Capacity Bar */}
 <div className="mb-2">
 <div className="flex items-center justify-between text-xs mb-1">
 <span className="text-[var(--muted-foreground)]">Capacity</span>
 <span className={`font-medium ${
 data.capacity >= 90 ? "text-[var(--state-error)]" :
 data.capacity >= 80 ? "text-[var(--state-warning)]" :
 "text-[var(--primary)] dark:text-[var(--primary)]"
 }`}>{data.capacity}%</span>
 </div>
 <div className="w-full h-1.5 bg-[var(--surface-container)] dark:bg-[var(--card)] rounded-full overflow-hidden">
 <div
 className={`h-full rounded-full ${
 data.capacity >= 90 ? "bg-[var(--state-error)]" :
 data.capacity >= 80 ? "bg-[var(--state-warning)]" :
 "bg-[var(--primary)] "
 }`}
 style={{ width: `${data.capacity}%` }}
 />
 </div>
 </div>

 {/* Location Count */}
 <div className="text-xs text-[var(--muted-foreground)]">
 {data.available} / {data.total} locations
 </div>
 </>
 ) : isLocationActivityTile ? (
 /* Location Activity Tile Layout (Picked/Replenished) */
 <>
 {/* Header with Title and Bookmark */}
 <div className="flex items-center justify-between mb-3">
 <h3 className="text-xs font-semibold text-[var(--foreground)] ">{bookmarkedTile.title}</h3>
 <button
 onClick={(e) => handleRemoveBookmark(e, bookmarkedTile.id)}
 className="p-1 hover:bg-[var(--surface-container-high)] rounded transition-colors"
 title="Remove bookmark"
 >
 <Star className={`fill-current ${bookmarkedTile.title.includes("Picked") ? "text-[var(--primary)] dark:text-[var(--primary)]" : "text-[var(--state-info)]"}`} size={14} />
 </button>
 </div>

 {/* Activity Items */}
 <div className="space-y-2">
 {Object.entries(data as Record<string, { today: number; thisWeek: number; trend: string }>).map(([type, values]) => (
 <div key={type} className="flex items-center justify-between p-2 bg-[var(--surface-container-low)] dark:bg-[var(--card)] border-[var(--border)]  rounded-lg">
 <div className="flex items-center gap-2">
 <div className={`w-8 h-8 ${bookmarkedTile.title.includes("Picked") ? "bg-[var(--primary)]/10 /10" : "bg-[var(--state-info)]/10"} rounded-lg flex items-center justify-center`}>
 <Package size={14} className={bookmarkedTile.title.includes("Picked") ? "text-[var(--primary)] dark:text-[var(--primary)]" : "text-[var(--state-info)]"} />
 </div>
 <div>
 <div className="text-[var(--foreground)]  font-medium text-xs capitalize">{type}</div>
 <div className="text-[var(--muted-foreground)] text-[10px]">Week: {values.thisWeek.toLocaleString()}</div>
 </div>
 </div>
 <div className="text-right">
 <div className="text-[var(--foreground)]  text-sm font-bold">{values.today}</div>
 <div className={`text-[10px] font-medium ${bookmarkedTile.title.includes("Picked") ? "text-[var(--primary)] dark:text-[var(--primary)]" : "text-[var(--state-info)] dark:text-[var(--state-info)]"}`}>{values.trend}</div>
 </div>
 </div>
 ))}
 </div>
 </>
 ) : isWorkstationTile ? (
 /* Workstation Tile Layout */
 <>
 <div className="flex items-center justify-between mb-3">
 <div className="flex items-center gap-2">
 <div className={`w-2 h-2 rounded-full ${
 data.status === "active" ? "bg-[var(--primary)] " : "bg-zinc-400 dark:bg-[var(--surface-container-high)]"
 }`} />
 <h3 className="text-sm font-semibold text-[var(--foreground)] ">{bookmarkedTile.title}</h3>
 </div>
 <button
 onClick={(e) => handleRemoveBookmark(e, bookmarkedTile.id)}
 className="p-1 hover:bg-[var(--surface-container-high)] rounded transition-colors"
 title="Remove bookmark"
 >
 <Star className={`fill-current ${data.status === "active" ? "text-[var(--primary)] dark:text-[var(--primary)]" : "text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]"}`} size={14} />
 </button>
 </div>

 <div className="space-y-2">
 <div className="text-xs text-[var(--muted-foreground)]">
 <span className="font-medium text-[var(--foreground)] ">{data.user}</span>
 </div>
 <div className="flex items-center justify-between">
 <div className="text-xs text-[var(--foreground)] ">{data.task}</div>
 <div className="text-xs text-[var(--muted-foreground)] flex items-center gap-1">
 <Clock size={10} />
 {data.duration}
 </div>
 </div>
 </div>
 </>
 ) : isMHEScannerTile ? (
 /* MHE Scanner Tile Layout */
 <>
 <div className="flex items-center justify-between mb-3">
 <h3 className="text-sm font-semibold text-[var(--foreground)] ">{bookmarkedTile.title}</h3>
 <button
 onClick={(e) => handleRemoveBookmark(e, bookmarkedTile.id)}
 className="p-1 hover:bg-[var(--surface-container-high)] rounded transition-colors"
 title="Remove bookmark"
 >
 <Star className={`fill-current ${data.status === "up" ? "text-[var(--state-on-success-container)] dark:text-[var(--state-success)]" : "text-[var(--state-error)] dark:text-[var(--state-error)]"}`} size={14} />
 </button>
 </div>

 {/* Status Indicator */}
 <div className="flex items-center gap-2 mb-3">
 <div className={`w-2 h-2 rounded-full ${
 data.status === 'up' ? 'bg-[var(--state-success)]' : 'bg-[var(--state-error)]'
 } animate-pulse`} />
 <span className={`${
 data.status === 'up' ? 'text-[var(--state-on-success-container)] dark:text-[var(--state-success)]' : 'text-[var(--state-error)] dark:text-[var(--state-error)]'
 } text-xs font-medium uppercase`}>
 {data.status}
 </span>
 </div>

 {/* Scanner Data */}
 <div className="space-y-2">
 <div className="flex items-center justify-between">
 <span className="text-xs text-[var(--muted-foreground)]">ID</span>
 <span className="text-xs font-medium text-[var(--foreground)] ">{data.id}</span>
 </div>
 <div className="flex items-center justify-between">
 <span className="text-xs text-[var(--muted-foreground)]">Location</span>
 <span className="text-xs font-medium text-[var(--foreground)] ">{data.location}</span>
 </div>
 {data.totalScans !== undefined && (
 <div className="flex items-center justify-between">
 <span className="text-xs text-[var(--muted-foreground)]">Total Scans</span>
 <span className="text-xs font-bold text-[var(--primary)] dark:text-[var(--primary)]">{data.totalScans.toLocaleString()}</span>
 </div>
 )}
 </div>
 </>
 ) : isMHEConveyorTile ? (
 /* MHE Conveyor Tile Layout */
 <>
 <div className="flex items-center justify-between mb-3">
 <h3 className="text-sm font-semibold text-[var(--foreground)] ">{bookmarkedTile.title}</h3>
 <button
 onClick={(e) => handleRemoveBookmark(e, bookmarkedTile.id)}
 className="p-1 hover:bg-[var(--surface-container-high)] rounded transition-colors"
 title="Remove bookmark"
 >
 <Star className={`fill-current ${data.status === "up" ? "text-[var(--state-on-success-container)] dark:text-[var(--state-success)]" : "text-[var(--state-error)] dark:text-[var(--state-error)]"}`} size={14} />
 </button>
 </div>

 {/* Status Indicator */}
 <div className="flex items-center gap-2 mb-3">
 <div className={`w-2 h-2 rounded-full ${
 data.status === 'up' ? 'bg-[var(--state-success)]' : 'bg-[var(--state-error)]'
 } animate-pulse`} />
 <span className={`${
 data.status === 'up' ? 'text-[var(--state-on-success-container)] dark:text-[var(--state-success)]' : 'text-[var(--state-error)] dark:text-[var(--state-error)]'
 } text-xs font-medium uppercase`}>
 {data.status}
 </span>
 </div>

 {/* Conveyor Data */}
 <div className="space-y-2">
 <div className="flex items-center justify-between">
 <span className="text-xs text-[var(--muted-foreground)]">ID</span>
 <span className="text-xs font-medium text-[var(--foreground)] ">{data.id}</span>
 </div>
 <div className="flex items-center justify-between">
 <span className="text-xs text-[var(--muted-foreground)]">Location</span>
 <span className="text-xs font-medium text-[var(--foreground)] ">{data.location}</span>
 </div>
 </div>
 </>
 ) : isMHEPalletizerTile ? (
 /* MHE Palletizer Tile Layout */
 <>
 <div className="flex items-center justify-between mb-3">
 <h3 className="text-sm font-semibold text-[var(--foreground)] ">{bookmarkedTile.title}</h3>
 <button
 onClick={(e) => handleRemoveBookmark(e, bookmarkedTile.id)}
 className="p-1 hover:bg-[var(--surface-container-high)] rounded transition-colors"
 title="Remove bookmark"
 >
 <Star className={`fill-current ${data.status === "up" ? "text-[var(--state-on-success-container)] dark:text-[var(--state-success)]" : "text-[var(--state-error)] dark:text-[var(--state-error)]"}`} size={14} />
 </button>
 </div>

 <div className="flex items-center gap-2 mb-3">
 <div className={`w-2 h-2 rounded-full ${
 data.status === 'up' ? 'bg-[var(--state-success)]' : 'bg-[var(--state-error)]'
 } animate-pulse`} />
 <span className={`${
 data.status === 'up' ? 'text-[var(--state-on-success-container)] dark:text-[var(--state-success)]' : 'text-[var(--state-error)] dark:text-[var(--state-error)]'
 } text-xs font-medium uppercase`}>
 {data.status}
 </span>
 </div>

 <div className="space-y-2">
 <div className="flex items-center justify-between">
 <span className="text-xs text-[var(--muted-foreground)]">ID</span>
 <span className="text-xs font-medium text-[var(--foreground)] ">{data.id}</span>
 </div>
 <div className="flex items-center justify-between">
 <span className="text-xs text-[var(--muted-foreground)]">Location</span>
 <span className="text-xs font-medium text-[var(--foreground)] ">{data.location}</span>
 </div>
 {data.currentWorkList && (
 <div className="flex items-center justify-between">
 <span className="text-xs text-[var(--muted-foreground)]">Work List</span>
 <span className="text-xs font-bold text-[var(--primary)] dark:text-[var(--primary)]">{data.currentWorkList}</span>
 </div>
 )}
 </div>
 </>
 ) : isMHERobotTile ? (
 /* MHE Robot Tile Layout */
 <>
 <div className="flex items-center justify-between mb-3">
 <h3 className="text-sm font-semibold text-[var(--foreground)] ">{bookmarkedTile.title}</h3>
 <button
 onClick={(e) => handleRemoveBookmark(e, bookmarkedTile.id)}
 className="p-1 hover:bg-[var(--surface-container-high)] rounded transition-colors"
 title="Remove bookmark"
 >
 <Star className={`fill-current ${data.status === "up" ? "text-[var(--state-on-success-container)] dark:text-[var(--state-success)]" : "text-[var(--state-error)] dark:text-[var(--state-error)]"}`} size={14} />
 </button>
 </div>

 <div className="flex items-center gap-2 mb-3">
 <div className={`w-2 h-2 rounded-full ${
 data.status === 'up' ? 'bg-[var(--state-success)]' : 'bg-[var(--state-error)]'
 } animate-pulse`} />
 <span className={`${
 data.status === 'up' ? 'text-[var(--state-on-success-container)] dark:text-[var(--state-success)]' : 'text-[var(--state-error)] dark:text-[var(--state-error)]'
 } text-xs font-medium uppercase`}>
 {data.status}
 </span>
 </div>

 <div className="space-y-2">
 <div className="flex items-center justify-between">
 <span className="text-xs text-[var(--muted-foreground)]">ID</span>
 <span className="text-xs font-medium text-[var(--foreground)] ">{data.id}</span>
 </div>
 <div className="flex items-center justify-between">
 <span className="text-xs text-[var(--muted-foreground)]">Type</span>
 <span className="text-xs font-medium text-[var(--foreground)] ">{data.type}</span>
 </div>
 {data.currentWorkList && (
 <div className="flex items-center justify-between">
 <span className="text-xs text-[var(--muted-foreground)]">Work List</span>
 <span className="text-xs font-bold text-[var(--primary)] dark:text-[var(--primary)]">{data.currentWorkList}</span>
 </div>
 )}
 </div>
 </>
 ) : isHealthServiceTile ? (
 /* Health Service Tile Layout */
 <>
 <div className="flex items-center justify-between mb-3">
 <h3 className="text-sm font-semibold text-[var(--foreground)] ">{bookmarkedTile.title}</h3>
 <button
 onClick={(e) => handleRemoveBookmark(e, bookmarkedTile.id)}
 className="p-1 hover:bg-[var(--surface-container-high)] rounded transition-colors"
 title="Remove bookmark"
 >
 <Star className={`fill-current ${statusColor}`} size={14} />
 </button>
 </div>

 <div className="flex items-center gap-2 mb-3">
 <div className={`w-2 h-2 rounded-full ${
 data.status === 'healthy' ? 'bg-[var(--state-success)]' : data.status === 'degraded' || data.status === 'warning' ? 'bg-[var(--state-warning)]' : 'bg-[var(--state-error)]'
 } animate-pulse`} />
 <span className={`${statusColor} text-xs font-medium capitalize`}>
 {data.status}
 </span>
 </div>

 <div className="space-y-2">
 {data.uptime && (
 <div className="flex items-center justify-between">
 <span className="text-xs text-[var(--muted-foreground)]">Uptime</span>
 <span className="text-xs font-medium text-[var(--foreground)] ">{data.uptime}</span>
 </div>
 )}
 {data.responseTime && (
 <div className="flex items-center justify-between">
 <span className="text-xs text-[var(--muted-foreground)]">Response</span>
 <span className="text-xs font-medium text-[var(--foreground)] ">{data.responseTime}</span>
 </div>
 )}
 {data.version && (
 <div className="flex items-center justify-between">
 <span className="text-xs text-[var(--muted-foreground)]">Version</span>
 <span className="text-xs font-medium text-[var(--foreground)] ">{data.version}</span>
 </div>
 )}
 </div>
 </>
 ) : isHealthDatabaseTile ? (
 /* Health Database Tile Layout */
 <>
 <div className="flex items-center justify-between mb-3">
 <h3 className="text-sm font-semibold text-[var(--foreground)] ">{bookmarkedTile.title}</h3>
 <button
 onClick={(e) => handleRemoveBookmark(e, bookmarkedTile.id)}
 className="p-1 hover:bg-[var(--surface-container-high)] rounded transition-colors"
 title="Remove bookmark"
 >
 <Star className={`fill-current ${statusColor}`} size={14} />
 </button>
 </div>

 <div className="flex items-center gap-2 mb-3">
 <div className={`w-2 h-2 rounded-full ${
 data.status === 'healthy' ? 'bg-[var(--state-success)]' : data.status === 'warning' ? 'bg-[var(--state-warning)]' : 'bg-[var(--state-error)]'
 } animate-pulse`} />
 <span className={`${statusColor} text-xs font-medium capitalize`}>
 {data.status}
 </span>
 </div>

 <div className="space-y-2">
 {data.name && (
 <div className="flex items-center justify-between">
 <span className="text-xs text-[var(--muted-foreground)]">Type</span>
 <span className="text-xs font-medium text-[var(--foreground)] ">{data.name}</span>
 </div>
 )}
 {data.dataType && (
 <div className="flex items-center justify-between">
 <span className="text-xs text-[var(--muted-foreground)]">Database</span>
 <span className="text-xs font-medium text-[var(--foreground)] ">{data.dataType}</span>
 </div>
 )}
 {data.connections !== undefined && data.maxConnections !== undefined && (
 <div className="flex items-center justify-between">
 <span className="text-xs text-[var(--muted-foreground)]">Connections</span>
 <span className="text-xs font-bold text-[var(--primary)] dark:text-[var(--primary)]">{data.connections}/{data.maxConnections}</span>
 </div>
 )}
 {data.size && (
 <div className="flex items-center justify-between">
 <span className="text-xs text-[var(--muted-foreground)]">Size</span>
 <span className="text-xs font-medium text-[var(--foreground)] ">{data.size}</span>
 </div>
 )}
 </div>
 </>
 ) : (
 /* Default Tile Layout */
 <>
 {/* Header with Icon, Badge, and Bookmark Button */}
 <div className="flex items-center justify-between mb-2">
 <div className={`w-10 h-10 ${statusBgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 `}>
 <Icon size={20} className={statusColor} />
 </div>
 <div className="flex items-center gap-1">
 {data.count !== undefined && (
 <div className={`px-2 py-0.5 rounded-lg flex items-center gap-1 ${statusBgColor} border-[var(--border)] `}>
 <StatusIcon size={12} className={statusColor} />
 <span className={`text-xs font-bold ${statusColor}`}>{data.count}</span>
 </div>
 )}
 {data.value !== undefined && (
 <div className={`px-2 py-0.5 rounded-lg flex items-center gap-1 ${statusBgColor} border-[var(--border)] `}>
 <span className={`text-xs font-bold ${statusColor}`}>{data.value}</span>
 </div>
 )}
 <button
 onClick={(e) => handleRemoveBookmark(e, bookmarkedTile.id)}
 className={`p-1 hover:bg-[var(--surface-container-high)] rounded transition-colors`}
 title="Remove bookmark"
 >
 <Star className={`fill-current ${statusColor}`} size={14} />
 </button>
 </div>
 </div>

 {/* Title */}
 <h3 className="text-[var(--foreground)]  font-bold text-sm mb-1 truncate group-hover:text-[var(--primary)] dark:group-hover:text-[var(--primary)] transition-colors">
 {bookmarkedTile.title}
 </h3>

 {/* Trend or Dashboard Type Badge */}
 {data.trend ? (
 <div className="text-xs text-[var(--muted-foreground)]">
 {data.trend}
 </div>
 ) : (
 <div className="text-xs text-[var(--muted-foreground)] capitalize">
 {bookmarkedTile.type} Dashboard
 </div>
 )}
 </>
 )}
 </motion.div>
 );
 })}
 </div>
 </div>

 {/* Main Content - Centered Ask OPTO */}
 <div className="flex justify-center">
 {/* Center Column - Ask OPTO */}
 <motion.div
 ref={optoContainerRef}
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.2 }}
 className={isV6
    ? "w-full max-w-2xl relative rounded-2xl p-8 overflow-hidden bg-[var(--surface)] border border-[var(--border)] shadow-[0_0_40px_-10px_color-mix(in_srgb,var(--primary)_25%,transparent)] transition-shadow duration-500 hover:shadow-[0_0_60px_-10px_color-mix(in_srgb,var(--primary)_40%,transparent)]"
    : "w-full max-w-2xl border-4 border-[var(--primary)] dark:border-[var(--primary)] rounded-lg p-8"
  }
 >
 {isV6 && (
    <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{
      background: "linear-gradient(135deg, color-mix(in srgb, var(--primary) 8%, transparent) 0%, transparent 50%, color-mix(in srgb, var(--primary) 4%, transparent) 100%)",
    }} />
  )}
  {isV6 && (
    <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{
      background: "radial-gradient(ellipse at 50% 0%, color-mix(in srgb, var(--primary) 12%, transparent) 0%, transparent 60%)",
    }} />
  )}
  <div className="flex flex-col items-center text-center mb-6 relative">
  <motion.div
  initial={{ scale: 0 }}
  animate={{ scale: 1 }}
  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
  className={isV6
    ? "relative w-20 h-20 flex items-center justify-center mb-4"
    : "w-20 h-20 bg-[var(--primary)] rounded-full flex items-center justify-center mb-4"
  }
  >
  <div className={isV6
    ? "w-20 h-20 bg-[var(--primary)] rounded-full flex items-center justify-center shadow-[0_0_28px_color-mix(in_srgb,var(--primary)_55%,transparent),0_0_8px_color-mix(in_srgb,var(--primary)_30%,transparent)]"
    : ""
  }>
    <Sparkles size={isV6 ? 30 : 36} className="text-[var(--primary-foreground)]" />
  </div>
  </motion.div>
  <h2 className={`text-[var(--foreground)] font-bold mb-2 ${isV6 ? "text-xl tracking-tight" : ""}`}>Ask OPTO</h2>
  <p className="text-[var(--muted-foreground)] text-sm">How can I help you navigate today?</p>
  </div>

  <div
  className={isV6
    ? "flex items-center gap-3 bg-[var(--surface-container)] text-[var(--foreground)] rounded-xl px-5 py-4 border border-[var(--border)] focus-within:border-[var(--primary)] focus-within:shadow-[0_0_0_3px_color-mix(in_srgb,var(--primary)_15%,transparent)] transition-all duration-200 cursor-text"
    : "flex items-center gap-3 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-xl px-5 py-4 border-2 border-[var(--primary)]/30 dark:border-[var(--primary)]/30 focus-within:border-[var(--primary)] dark:focus-within:border-[var(--primary)] transition-colors cursor-text"
  }
  onClick={() => setSectionsExpanded(true)}
  >
 <input
 type="text"
 placeholder="Ask me anything..."
 className="flex-1 bg-transparent text-[var(--foreground)]  placeholder-zinc-500 dark:placeholder-zinc-500 outline-none"
 value={inputValue}
 onChange={(e) => setInputValue(e.target.value)}
 onKeyDown={handleKeyDown}
 onFocus={() => setSectionsExpanded(true)}
 />
 <button
 onClick={handleMicClick}
 className={`flex-shrink-0 transition-all ${
 isListening
 ? 'text-[var(--destructive)] dark:text-[var(--destructive)] animate-pulse'
 : 'text-[var(--primary)] dark:text-[var(--primary)] hover:scale-110'
 }`}
 aria-label={isListening ? "Stop recording" : "Start voice input"}
 >
 {isListening ? (
 <MicOff size={20} />
 ) : (
 <Mic size={20} />
 )}
 </button>
 <button
 onClick={handleInputSubmit}
 className="flex-shrink-0 text-[var(--primary)] dark:text-[var(--primary)] hover:scale-110 transition-all"
 aria-label="Submit query"
 >
 <Sparkles size={20} />
 </button>
 </div>
 {micError && (
 <p className="text-[var(--state-error)] text-sm mt-2">{micError}</p>
 )}
 {optoResponse && (
 <p className="text-[var(--foreground)]  text-sm mt-2">{optoResponse}</p>
 )}
 </motion.div>
 </div>

 {/* Expandable Sections - Show when Ask OPTO is focused */}
 {sectionsExpanded && (
 <div ref={sectionsContainerRef} className="mt-6">
 <OPTOCapabilitiesGrid onCapabilityClick={handleCapabilityClick} />
 </div>
 )}
 </div>

 {/* Help Popups and Modals */}
 {showHelp && <HelpPopup onClose={() => setShowHelp(false)} />}
 {showAddUserHelp && <AddUserHelpPopup onClose={() => setShowAddUserHelp(false)} />}
 {showAuthorizationHelp && requestedAuthorization && (
 <AuthorizationHelpPopup 
 onClose={() => setShowAuthorizationHelp(false)} 
 authorization={requestedAuthorization}
 />
 )}
 {showReport && reportData && (
 <ReportOverlay
 onClose={() => {
 setShowReport(false);
 setReportData(null);
 }}
 type={reportData.type}
 title={reportData.title}
 />
 )}
 {showTroubleshooting && (
 <TroubleshootingModal
 isOpen={showTroubleshooting}
 onClose={() => setShowTroubleshooting(false)}
 workListId={troubleshootingWorkListId}
 />
 )}
 {showColumnDialog && (
 <ColumnManagementOptions
 onClose={() => setShowColumnDialog(false)}
 />
 )}
 {showTroubleshootingPrompt && (
 <TroubleshootingWorkListPrompt
 onClose={() => setShowTroubleshootingPrompt(false)}
 onSubmit={(workListId) => {
 setTroubleshootingWorkListId(workListId);
 setShowTroubleshootingPrompt(false);
 setShowTroubleshooting(true);
 }}
 />
 )}
 </div>
 );
}