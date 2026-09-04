import { useState, KeyboardEvent, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Server, Database, Boxes, Wrench, Search, FileText, HelpCircle, Navigation as NavigationIcon, Zap, BarChart3, CheckCircle2, AlertTriangle, XCircle, Mic, MicOff, Activity, TrendingUp, Cpu, Monitor, Clock, Package, Star, Scan, Radio } from "lucide-react";
import { motion } from "motion/react";
import { useLayout } from "../contexts/LayoutContext";
import { useAuth } from "../contexts/AuthContext";
import { useBookmarks } from "../contexts/BookmarkContext";
import { HelpPopup } from "../components/HelpPopup";
import { AddUserHelpPopup } from "../components/AddUserHelpPopup";
import { AuthorizationHelpPopup } from "../components/AuthorizationHelpPopup";
import { ReportOverlay } from "../components/ReportOverlay";
import { TroubleshootingModal } from "../components/TroubleshootingModal";
import { TroubleshootingWorkListPrompt } from "../components/TroubleshootingWorkListPrompt";
import { InteractiveColumnDialog } from "../components/InteractiveColumnDialog";
import { ColumnManagementOptions } from "../components/ColumnManagementOptions";

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
    if (down > 0) return "text-[#dc2626] dark:text-[#ef4444]";
    if (degraded > 0) return "text-[#f59e0b] dark:text-[#fbbf24]";
    return "text-[#0d9488] dark:text-[#50e080]";
  };

  const getStatusBgColor = (healthy: number, degraded: number, down: number) => {
    if (down > 0) return "bg-[#dc2626]/10 dark:bg-[#ef4444]/10";
    if (degraded > 0) return "bg-[#f59e0b]/10 dark:bg-[#fbbf24]/10";
    return "bg-[#0d9488]/10 dark:bg-[#50e080]/10";
  };

  const getStatusIcon = (healthy: number, degraded: number, down: number) => {
    if (down > 0) return XCircle;
    if (degraded > 0) return AlertTriangle;
    return CheckCircle2;
  };

  return (
    <div className="min-h-full bg-white dark:bg-zinc-900 p-6 relative overflow-hidden">
      {/* Animated Spiderweb Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="w-full h-full opacity-[0.20]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="2" fill="#0d9488" className="dark:fill-[#50e080]" />
            </pattern>
          </defs>
          
          {/* Grid nodes */}
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Spiderweb connecting lines - creating a network pattern */}
          <g stroke="#0d9488" className="dark:stroke-[#50e080]" strokeWidth="1" fill="none" opacity="0.6">
            {/* Horizontal lines */}
            <line x1="0" y1="100" x2="400" y2="150" />
            <line x1="200" y1="200" x2="800" y2="250" />
            <line x1="400" y1="300" x2="1200" y2="350" />
            <line x1="100" y1="400" x2="700" y2="450" />
            <line x1="300" y1="500" x2="900" y2="550" />
            <line x1="500" y1="600" x2="1400" y2="650" />
            <line x1="200" y1="700" x2="1000" y2="750" />
            <line x1="600" y1="800" x2="1300" y2="850" />
            
            {/* Diagonal lines crossing */}
            <line x1="0" y1="0" x2="600" y2="400" />
            <line x1="400" y1="0" x2="1000" y2="600" />
            <line x1="800" y1="0" x2="1400" y2="400" />
            <line x1="1200" y1="100" x2="1600" y2="800" />
            
            <line x1="1600" y1="0" x2="1000" y2="400" />
            <line x1="1400" y1="200" x2="600" y2="600" />
            <line x1="1200" y1="400" x2="400" y2="800" />
            <line x1="800" y1="600" x2="0" y2="1000" />
            
            {/* Vertical connections */}
            <line x1="200" y1="0" x2="250" y2="1000" />
            <line x1="500" y1="100" x2="550" y2="900" />
            <line x1="800" y1="0" x2="850" y2="1000" />
            <line x1="1100" y1="100" x2="1150" y2="800" />
            <line x1="1400" y1="0" x2="1450" y2="1000" />
            
            {/* Random connecting lines for web effect */}
            <line x1="100" y1="150" x2="500" y2="350" />
            <line x1="300" y1="250" x2="700" y2="450" />
            <line x1="600" y1="150" x2="900" y2="550" />
            <line x1="800" y1="250" x2="1200" y2="650" />
            <line x1="1000" y1="350" x2="1400" y2="750" />
            
            <line x1="1500" y1="150" x2="1100" y2="350" />
            <line x1="1300" y1="250" x2="900" y2="450" />
            <line x1="1000" y1="150" x2="700" y2="550" />
            <line x1="800" y1="450" x2="400" y2="650" />
            <line x1="600" y1="550" x2="200" y2="750" />
            
            {/* Curved connections for organic feel */}
            <path d="M 100 200 Q 400 100, 700 300" />
            <path d="M 300 400 Q 600 300, 900 500" />
            <path d="M 500 100 Q 800 400, 1100 200" />
            <path d="M 700 500 Q 1000 300, 1300 600" />
            <path d="M 200 600 Q 500 800, 800 700" />
            <path d="M 900 100 Q 1200 500, 1500 300" />
            
            {/* Additional web nodes */}
            <circle cx="100" cy="150" r="3" fill="#0d9488" className="dark:fill-[#50e080]" opacity="0.8" />
            <circle cx="300" cy="250" r="3" fill="#0d9488" className="dark:fill-[#50e080]" opacity="0.8" />
            <circle cx="500" cy="350" r="3" fill="#0d9488" className="dark:fill-[#50e080]" opacity="0.8" />
            <circle cx="700" cy="450" r="3" fill="#0d9488" className="dark:fill-[#50e080]" opacity="0.8" />
            <circle cx="900" cy="550" r="3" fill="#0d9488" className="dark:fill-[#50e080]" opacity="0.8" />
            <circle cx="1100" cy="350" r="3" fill="#0d9488" className="dark:fill-[#50e080]" opacity="0.8" />
            <circle cx="1300" cy="250" r="3" fill="#0d9488" className="dark:fill-[#50e080]" opacity="0.8" />
            <circle cx="1500" cy="150" r="3" fill="#0d9488" className="dark:fill-[#50e080]" opacity="0.8" />
          </g>
        </svg>
      </div>

      <div className="max-w-[1600px] mx-auto relative z-10">
        {/* Sticky Header Section */}
        <div className="sticky top-0 bg-white dark:bg-zinc-900 z-40 pb-8 mb-6 -mx-6 px-6 -mt-6 pt-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-zinc-900 dark:text-white mb-2">Meet OPTO</h1>
            <p className="text-zinc-600 dark:text-zinc-400">Your intelligent warehouse assistant is here to help</p>
          </div>

          {/* Status Tiles */}
          <div className="bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-800/50 border-2 border-zinc-200 dark:border-zinc-700 rounded-xl p-5">
            {/* Overview Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#0d9488]/10 dark:bg-[#50e080]/10 rounded-lg flex items-center justify-center">
                <BarChart3 size={20} className="text-[#0d9488] dark:text-[#50e080]" />
              </div>
              <h2 className="text-zinc-900 dark:text-white font-semibold">Overview</h2>
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
                  if (tile.down > 0) return "bg-red-500 dark:bg-red-400";
                  if (tile.degraded > 0) return "bg-yellow-500 dark:bg-yellow-400";
                  return "bg-green-500 dark:bg-green-400";
                };

                // Get the hover border color based on status
                const getHoverBorderColor = () => {
                  if (tile.down > 0) return "hover:border-red-500 dark:hover:border-red-400";
                  if (tile.degraded > 0) return "hover:border-yellow-500 dark:hover:border-yellow-400";
                  return "hover:border-green-500 dark:hover:border-green-400";
                };

                return (
                  <motion.div
                    key={tile.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`group relative bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-800/50 border-2 border-zinc-200 dark:border-zinc-700 rounded-xl p-3 cursor-pointer hover:scale-105 hover:shadow-xl ${getHoverBorderColor()} transition-all duration-200 overflow-hidden`}
                    onClick={() => handleTileClick(tile.path, tile.section)}
                  >
                    {/* Left Accent Line */}
                    <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/5 ${getBorderAccent()} rounded-r-full transition-all duration-200 group-hover:h-full group-hover:top-0 group-hover:translate-y-0 group-hover:rounded-r-none`} />
                    
                    {/* Header with Icon and Status Badge */}
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-10 h-10 ${statusBgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-sm`}>
                        <Icon size={20} className={statusColor} />
                      </div>
                      <div className={`px-2 py-0.5 rounded-lg flex items-center gap-1 ${statusBgColor} border border-zinc-200 dark:border-zinc-700`}>
                        <StatusIcon size={12} className={statusColor} />
                        <span className={`text-xs font-bold ${statusColor}`}>{tile.total}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-zinc-900 dark:text-white font-bold text-sm mb-2 truncate group-hover:text-[#0d9488] dark:group-hover:text-[#50e080] transition-colors">
                      {tile.title}
                    </h3>

                    {/* Status Breakdown */}
                    <div className="flex items-center gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-green-400 animate-pulse" />
                        <span className="font-semibold text-green-600 dark:text-green-400">{tile.healthy}</span>
                      </div>
                      {tile.degraded > 0 && (
                        <>
                          <div className="w-px h-2.5 bg-zinc-300 dark:bg-zinc-600" />
                          <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 dark:bg-yellow-400 animate-pulse" />
                            <span className="font-semibold text-yellow-600 dark:text-yellow-400">{tile.degraded}</span>
                          </div>
                        </>
                      )}
                      {tile.down > 0 && (
                        <>
                          <div className="w-px h-2.5 bg-zinc-300 dark:bg-zinc-600" />
                          <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 dark:bg-red-400 animate-pulse" />
                            <span className="font-semibold text-red-600 dark:text-red-400">{tile.down}</span>
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
                let statusColor = "text-[#0d9488] dark:text-[#50e080]";
                let statusBgColor = "bg-[#0d9488]/10 dark:bg-[#50e080]/10";
                let StatusIcon = CheckCircle2;
                let borderAccent = "bg-green-500 dark:bg-green-400";
                let hoverBorderColor = "hover:border-green-500 dark:hover:border-green-400";

                // Check if this tile has status information
                if (data.status) {
                  if (data.status === "down" || data.status === "critical" || data.status === "Warning") {
                    statusColor = "text-red-600 dark:text-red-400";
                    statusBgColor = "bg-red-100 dark:bg-red-900/30";
                    StatusIcon = AlertTriangle;
                    borderAccent = "bg-red-500 dark:bg-red-400";
                    hoverBorderColor = "hover:border-red-400 dark:hover:border-red-500";
                  } else if (data.status === "up") {
                    // MHE tiles use "up" for operational status
                    statusColor = "text-green-600 dark:text-green-400";
                    statusBgColor = "bg-green-100 dark:bg-green-900/30";
                    StatusIcon = CheckCircle2;
                    borderAccent = "bg-green-500 dark:bg-green-400";
                    hoverBorderColor = "hover:border-green-400 dark:hover:border-green-500";
                  } else if (data.status === "warning") {
                    // Storage tiles use orange for warning status
                    statusColor = "text-orange-500";
                    statusBgColor = "bg-orange-100 dark:bg-orange-900/30";
                    StatusIcon = AlertTriangle;
                    borderAccent = "bg-orange-500";
                    hoverBorderColor = "hover:border-orange-400 dark:hover:border-orange-500";
                  } else if (data.status === "Queued") {
                    statusColor = "text-blue-600 dark:text-blue-400";
                    statusBgColor = "bg-blue-100 dark:bg-blue-900/30";
                    StatusIcon = Clock;
                    borderAccent = "bg-blue-500 dark:bg-blue-400";
                    hoverBorderColor = "hover:border-blue-400 dark:hover:border-blue-500";
                  } else if (data.status === "In Progress") {
                    statusColor = "text-[#0d9488] dark:text-[#50e080]";
                    statusBgColor = "bg-[#0d9488]/10 dark:bg-[#50e080]/10";
                    StatusIcon = Activity;
                    borderAccent = "bg-[#0d9488] dark:bg-[#50e080]";
                    hoverBorderColor = "hover:border-[#0d9488] dark:hover:border-[#50e080]";
                  } else if (data.status === "Completed" || data.status === "good") {
                    statusColor = "text-green-600 dark:text-green-400";
                    statusBgColor = "bg-green-100 dark:bg-green-900/30";
                    StatusIcon = CheckCircle2;
                    borderAccent = "bg-green-500 dark:bg-green-400";
                    hoverBorderColor = "hover:border-green-400 dark:hover:border-green-500";
                  } else if (data.status === "degraded") {
                    statusColor = "text-yellow-600 dark:text-yellow-400";
                    statusBgColor = "bg-yellow-100 dark:bg-yellow-900/30";
                    StatusIcon = AlertTriangle;
                    borderAccent = "bg-yellow-500 dark:bg-yellow-400";
                    hoverBorderColor = "hover:border-yellow-400 dark:hover:border-yellow-500";
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
                    className={`group relative bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-800/50 border-2 border-zinc-200 dark:border-zinc-700 rounded-xl p-3 cursor-pointer hover:scale-105 hover:shadow-xl ${hoverBorderColor} transition-all duration-200 overflow-hidden ${isLocationActivityTile ? 'col-span-2' : ''}`}
                    onClick={() => handleBookmarkedTileClick(bookmarkedTile)}
                  >
                    {/* Left Accent Line */}
                    <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/5 ${borderAccent} rounded-r-full transition-all duration-200 group-hover:h-full group-hover:top-0 group-hover:translate-y-0 group-hover:rounded-r-none`} />

                    {/* Storage Capacity Tile Layout */}
                    {isStorageCapacityTile ? (
                      <>
                        {/* Header with Title and Bookmark */}
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">{bookmarkedTile.title}</h3>
                          <button
                            onClick={(e) => handleRemoveBookmark(e, bookmarkedTile.id)}
                            className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded transition-colors"
                            title="Remove bookmark"
                          >
                            <Star className={`fill-current ${statusColor}`} size={14} />
                          </button>
                        </div>

                        {/* Capacity Bar */}
                        <div className="mb-2">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-zinc-600 dark:text-zinc-400">Capacity</span>
                            <span className={`font-medium ${
                              data.capacity >= 90 ? "text-red-500" :
                              data.capacity >= 80 ? "text-orange-500" :
                              "text-[#0d9488] dark:text-[#50e080]"
                            }`}>{data.capacity}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                data.capacity >= 90 ? "bg-red-500" :
                                data.capacity >= 80 ? "bg-orange-500" :
                                "bg-[#0d9488] dark:bg-[#50e080]"
                              }`}
                              style={{ width: `${data.capacity}%` }}
                            />
                          </div>
                        </div>

                        {/* Location Count */}
                        <div className="text-xs text-zinc-600 dark:text-zinc-400">
                          {data.available} / {data.total} locations
                        </div>
                      </>
                    ) : isLocationActivityTile ? (
                      /* Location Activity Tile Layout (Picked/Replenished) */
                      <>
                        {/* Header with Title and Bookmark */}
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-xs font-semibold text-zinc-900 dark:text-white">{bookmarkedTile.title}</h3>
                          <button
                            onClick={(e) => handleRemoveBookmark(e, bookmarkedTile.id)}
                            className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded transition-colors"
                            title="Remove bookmark"
                          >
                            <Star className={`fill-current ${bookmarkedTile.title.includes("Picked") ? "text-[#0d9488] dark:text-[#50e080]" : "text-blue-500"}`} size={14} />
                          </button>
                        </div>

                        {/* Activity Items */}
                        <div className="space-y-2">
                          {Object.entries(data as Record<string, { today: number; thisWeek: number; trend: string }>).map(([type, values]) => (
                            <div key={type} className="flex items-center justify-between p-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg">
                              <div className="flex items-center gap-2">
                                <div className={`w-8 h-8 ${bookmarkedTile.title.includes("Picked") ? "bg-[#0d9488]/10 dark:bg-[#50e080]/10" : "bg-blue-500/10"} rounded-lg flex items-center justify-center`}>
                                  <Package size={14} className={bookmarkedTile.title.includes("Picked") ? "text-[#0d9488] dark:text-[#50e080]" : "text-blue-500"} />
                                </div>
                                <div>
                                  <div className="text-zinc-900 dark:text-white font-medium text-xs capitalize">{type}</div>
                                  <div className="text-zinc-600 dark:text-zinc-400 text-[10px]">Week: {values.thisWeek.toLocaleString()}</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-zinc-900 dark:text-white text-sm font-bold">{values.today}</div>
                                <div className={`text-[10px] font-medium ${bookmarkedTile.title.includes("Picked") ? "text-[#0d9488] dark:text-[#50e080]" : "text-blue-600 dark:text-blue-400"}`}>{values.trend}</div>
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
                              data.status === "active" ? "bg-[#0d9488] dark:bg-[#50e080]" : "bg-zinc-400 dark:bg-zinc-600"
                            }`} />
                            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">{bookmarkedTile.title}</h3>
                          </div>
                          <button
                            onClick={(e) => handleRemoveBookmark(e, bookmarkedTile.id)}
                            className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded transition-colors"
                            title="Remove bookmark"
                          >
                            <Star className={`fill-current ${data.status === "active" ? "text-[#0d9488] dark:text-[#50e080]" : "text-zinc-400 dark:text-zinc-600"}`} size={14} />
                          </button>
                        </div>

                        <div className="space-y-2">
                          <div className="text-xs text-zinc-600 dark:text-zinc-400">
                            <span className="font-medium text-zinc-900 dark:text-white">{data.user}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-zinc-900 dark:text-white">{data.task}</div>
                            <div className="text-xs text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
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
                          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">{bookmarkedTile.title}</h3>
                          <button
                            onClick={(e) => handleRemoveBookmark(e, bookmarkedTile.id)}
                            className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded transition-colors"
                            title="Remove bookmark"
                          >
                            <Star className={`fill-current ${data.status === "up" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`} size={14} />
                          </button>
                        </div>

                        {/* Status Indicator */}
                        <div className="flex items-center gap-2 mb-3">
                          <div className={`w-2 h-2 rounded-full ${
                            data.status === 'up' ? 'bg-green-500' : 'bg-red-500'
                          } animate-pulse`} />
                          <span className={`${
                            data.status === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                          } text-xs font-medium uppercase`}>
                            {data.status}
                          </span>
                        </div>

                        {/* Scanner Data */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-zinc-600 dark:text-zinc-400">ID</span>
                            <span className="text-xs font-medium text-zinc-900 dark:text-white">{data.id}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-zinc-600 dark:text-zinc-400">Location</span>
                            <span className="text-xs font-medium text-zinc-900 dark:text-white">{data.location}</span>
                          </div>
                          {data.totalScans !== undefined && (
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-zinc-600 dark:text-zinc-400">Total Scans</span>
                              <span className="text-xs font-bold text-[#0d9488] dark:text-[#50e080]">{data.totalScans.toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      </>
                    ) : isMHEConveyorTile ? (
                      /* MHE Conveyor Tile Layout */
                      <>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">{bookmarkedTile.title}</h3>
                          <button
                            onClick={(e) => handleRemoveBookmark(e, bookmarkedTile.id)}
                            className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded transition-colors"
                            title="Remove bookmark"
                          >
                            <Star className={`fill-current ${data.status === "up" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`} size={14} />
                          </button>
                        </div>

                        {/* Status Indicator */}
                        <div className="flex items-center gap-2 mb-3">
                          <div className={`w-2 h-2 rounded-full ${
                            data.status === 'up' ? 'bg-green-500' : 'bg-red-500'
                          } animate-pulse`} />
                          <span className={`${
                            data.status === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                          } text-xs font-medium uppercase`}>
                            {data.status}
                          </span>
                        </div>

                        {/* Conveyor Data */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-zinc-600 dark:text-zinc-400">ID</span>
                            <span className="text-xs font-medium text-zinc-900 dark:text-white">{data.id}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-zinc-600 dark:text-zinc-400">Location</span>
                            <span className="text-xs font-medium text-zinc-900 dark:text-white">{data.location}</span>
                          </div>
                        </div>
                      </>
                    ) : isMHEPalletizerTile ? (
                      /* MHE Palletizer Tile Layout */
                      <>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">{bookmarkedTile.title}</h3>
                          <button
                            onClick={(e) => handleRemoveBookmark(e, bookmarkedTile.id)}
                            className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded transition-colors"
                            title="Remove bookmark"
                          >
                            <Star className={`fill-current ${data.status === "up" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`} size={14} />
                          </button>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <div className={`w-2 h-2 rounded-full ${
                            data.status === 'up' ? 'bg-green-500' : 'bg-red-500'
                          } animate-pulse`} />
                          <span className={`${
                            data.status === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                          } text-xs font-medium uppercase`}>
                            {data.status}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-zinc-600 dark:text-zinc-400">ID</span>
                            <span className="text-xs font-medium text-zinc-900 dark:text-white">{data.id}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-zinc-600 dark:text-zinc-400">Location</span>
                            <span className="text-xs font-medium text-zinc-900 dark:text-white">{data.location}</span>
                          </div>
                          {data.currentWorkList && (
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-zinc-600 dark:text-zinc-400">Work List</span>
                              <span className="text-xs font-bold text-[#0d9488] dark:text-[#50e080]">{data.currentWorkList}</span>
                            </div>
                          )}
                        </div>
                      </>
                    ) : isMHERobotTile ? (
                      /* MHE Robot Tile Layout */
                      <>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">{bookmarkedTile.title}</h3>
                          <button
                            onClick={(e) => handleRemoveBookmark(e, bookmarkedTile.id)}
                            className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded transition-colors"
                            title="Remove bookmark"
                          >
                            <Star className={`fill-current ${data.status === "up" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`} size={14} />
                          </button>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <div className={`w-2 h-2 rounded-full ${
                            data.status === 'up' ? 'bg-green-500' : 'bg-red-500'
                          } animate-pulse`} />
                          <span className={`${
                            data.status === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                          } text-xs font-medium uppercase`}>
                            {data.status}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-zinc-600 dark:text-zinc-400">ID</span>
                            <span className="text-xs font-medium text-zinc-900 dark:text-white">{data.id}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-zinc-600 dark:text-zinc-400">Type</span>
                            <span className="text-xs font-medium text-zinc-900 dark:text-white">{data.type}</span>
                          </div>
                          {data.currentWorkList && (
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-zinc-600 dark:text-zinc-400">Work List</span>
                              <span className="text-xs font-bold text-[#0d9488] dark:text-[#50e080]">{data.currentWorkList}</span>
                            </div>
                          )}
                        </div>
                      </>
                    ) : isHealthServiceTile ? (
                      /* Health Service Tile Layout */
                      <>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">{bookmarkedTile.title}</h3>
                          <button
                            onClick={(e) => handleRemoveBookmark(e, bookmarkedTile.id)}
                            className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded transition-colors"
                            title="Remove bookmark"
                          >
                            <Star className={`fill-current ${statusColor}`} size={14} />
                          </button>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <div className={`w-2 h-2 rounded-full ${
                            data.status === 'healthy' ? 'bg-green-500' : data.status === 'degraded' || data.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                          } animate-pulse`} />
                          <span className={`${statusColor} text-xs font-medium capitalize`}>
                            {data.status}
                          </span>
                        </div>

                        <div className="space-y-2">
                          {data.uptime && (
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-zinc-600 dark:text-zinc-400">Uptime</span>
                              <span className="text-xs font-medium text-zinc-900 dark:text-white">{data.uptime}</span>
                            </div>
                          )}
                          {data.responseTime && (
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-zinc-600 dark:text-zinc-400">Response</span>
                              <span className="text-xs font-medium text-zinc-900 dark:text-white">{data.responseTime}</span>
                            </div>
                          )}
                          {data.version && (
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-zinc-600 dark:text-zinc-400">Version</span>
                              <span className="text-xs font-medium text-zinc-900 dark:text-white">{data.version}</span>
                            </div>
                          )}
                        </div>
                      </>
                    ) : isHealthDatabaseTile ? (
                      /* Health Database Tile Layout */
                      <>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">{bookmarkedTile.title}</h3>
                          <button
                            onClick={(e) => handleRemoveBookmark(e, bookmarkedTile.id)}
                            className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded transition-colors"
                            title="Remove bookmark"
                          >
                            <Star className={`fill-current ${statusColor}`} size={14} />
                          </button>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <div className={`w-2 h-2 rounded-full ${
                            data.status === 'healthy' ? 'bg-green-500' : data.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                          } animate-pulse`} />
                          <span className={`${statusColor} text-xs font-medium capitalize`}>
                            {data.status}
                          </span>
                        </div>

                        <div className="space-y-2">
                          {data.name && (
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-zinc-600 dark:text-zinc-400">Type</span>
                              <span className="text-xs font-medium text-zinc-900 dark:text-white">{data.name}</span>
                            </div>
                          )}
                          {data.dataType && (
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-zinc-600 dark:text-zinc-400">Database</span>
                              <span className="text-xs font-medium text-zinc-900 dark:text-white">{data.dataType}</span>
                            </div>
                          )}
                          {data.connections !== undefined && data.maxConnections !== undefined && (
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-zinc-600 dark:text-zinc-400">Connections</span>
                              <span className="text-xs font-bold text-[#0d9488] dark:text-[#50e080]">{data.connections}/{data.maxConnections}</span>
                            </div>
                          )}
                          {data.size && (
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-zinc-600 dark:text-zinc-400">Size</span>
                              <span className="text-xs font-medium text-zinc-900 dark:text-white">{data.size}</span>
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      /* Default Tile Layout */
                      <>
                        {/* Header with Icon, Badge, and Bookmark Button */}
                        <div className="flex items-center justify-between mb-2">
                          <div className={`w-10 h-10 ${statusBgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-sm`}>
                            <Icon size={20} className={statusColor} />
                          </div>
                          <div className="flex items-center gap-1">
                            {data.count !== undefined && (
                              <div className={`px-2 py-0.5 rounded-lg flex items-center gap-1 ${statusBgColor} border border-zinc-200 dark:border-zinc-700`}>
                                <StatusIcon size={12} className={statusColor} />
                                <span className={`text-xs font-bold ${statusColor}`}>{data.count}</span>
                              </div>
                            )}
                            {data.value !== undefined && (
                              <div className={`px-2 py-0.5 rounded-lg flex items-center gap-1 ${statusBgColor} border border-zinc-200 dark:border-zinc-700`}>
                                <span className={`text-xs font-bold ${statusColor}`}>{data.value}</span>
                              </div>
                            )}
                            <button
                              onClick={(e) => handleRemoveBookmark(e, bookmarkedTile.id)}
                              className={`p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded transition-colors`}
                              title="Remove bookmark"
                            >
                              <Star className={`fill-current ${statusColor}`} size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-zinc-900 dark:text-white font-bold text-sm mb-1 truncate group-hover:text-[#0d9488] dark:group-hover:text-[#50e080] transition-colors">
                          {bookmarkedTile.title}
                        </h3>

                        {/* Trend or Dashboard Type Badge */}
                        {data.trend ? (
                          <div className="text-xs text-zinc-600 dark:text-zinc-400">
                            {data.trend}
                          </div>
                        ) : (
                          <div className="text-xs text-zinc-600 dark:text-zinc-400 capitalize">
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
        </div>

        {/* Main Content - Centered Ask OPTO */}
        <div className="flex justify-center">
          {/* Center Column - Ask OPTO */}
          <motion.div
            ref={optoContainerRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-2xl bg-gradient-to-br from-[#0d9488]/5 via-white to-[#0d9488]/5 dark:from-[#50e080]/5 dark:via-zinc-900 dark:to-[#50e080]/5 border-4 border-[#0d9488] dark:border-[#50e080] rounded-lg p-8 shadow-lg shadow-[#0d9488]/20 dark:shadow-[#50e080]/20"
          >
            <div className="flex flex-col items-center text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-[#0d9488] dark:bg-[#50e080] rounded-full flex items-center justify-center mb-4 shadow-lg shadow-[#0d9488]/50 dark:shadow-[#50e080]/50"
              >
                <Sparkles size={36} className="text-white" />
              </motion.div>
              <h2 className="text-zinc-900 dark:text-white font-bold mb-2">Ask OPTO</h2>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm">How can I help you navigate today?</p>
            </div>

            <div
              className="flex items-center gap-3 bg-white dark:bg-zinc-900 rounded-xl px-5 py-4 border-2 border-[#0d9488]/30 dark:border-[#50e080]/30 focus-within:border-[#0d9488] dark:focus-within:border-[#50e080] transition-colors shadow-sm cursor-text"
              onClick={() => setSectionsExpanded(true)}
            >
              <input
                type="text"
                placeholder="Ask me anything..."
                className="flex-1 bg-transparent text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-500 outline-none"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setSectionsExpanded(true)}
              />
              <button
                onClick={handleMicClick}
                className={`flex-shrink-0 transition-all ${
                  isListening
                    ? 'text-[#dc2626] dark:text-[#ef4444] animate-pulse'
                    : 'text-[#0d9488] dark:text-[#50e080] hover:scale-110'
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
                className="flex-shrink-0 text-[#0d9488] dark:text-[#50e080] hover:scale-110 transition-all"
                aria-label="Submit query"
              >
                <Sparkles size={20} />
              </button>
            </div>
            {micError && (
              <p className="text-red-500 text-sm mt-2">{micError}</p>
            )}
            {optoResponse && (
              <p className="text-zinc-900 dark:text-white text-sm mt-2">{optoResponse}</p>
            )}
          </motion.div>
        </div>

        {/* Expandable Sections - Show when Ask OPTO is focused */}
        {sectionsExpanded && (
          <div ref={sectionsContainerRef}>
            {/* Top Row - 3 columns */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6"
            >
              {/* Left Column - Navigation */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 rounded-lg p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#0d9488]/10 dark:bg-[#50e080]/10 rounded-lg flex items-center justify-center">
                    <NavigationIcon size={20} className="text-[#0d9488] dark:text-[#50e080]" />
                  </div>
                  <h2 className="text-zinc-900 dark:text-white font-semibold">Navigation</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {capabilities.navigation.map((cap, i) => (
                    <button
                      key={i}
                      onClick={() => handleCapabilityClick(cap)}
                      className="group px-4 py-2 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-900/50 dark:hover:to-blue-800/50 border-2 border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 rounded-lg text-sm text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 font-medium transition-all hover:shadow-md hover:scale-105 active:scale-95"
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
                className="bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 rounded-lg p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#0d9488]/10 dark:bg-[#50e080]/10 rounded-lg flex items-center justify-center">
                    <Zap size={20} className="text-[#0d9488] dark:text-[#50e080]" />
                  </div>
                  <h2 className="text-zinc-900 dark:text-white font-semibold">Actions</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {capabilities.actions.map((cap, i) => (
                    <button
                      key={i}
                      onClick={() => handleCapabilityClick(cap)}
                      className="group px-4 py-2 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-900/50 dark:hover:to-purple-800/50 border-2 border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 rounded-lg text-sm text-purple-700 dark:text-purple-300 hover:text-purple-800 dark:hover:text-purple-200 font-medium transition-all hover:shadow-md hover:scale-105 active:scale-95"
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
                className="bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 rounded-lg p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#0d9488]/10 dark:bg-[#50e080]/10 rounded-lg flex items-center justify-center">
                    <FileText size={20} className="text-[#0d9488] dark:text-[#50e080]" />
                  </div>
                  <h2 className="text-zinc-900 dark:text-white font-semibold">Report Generation</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {capabilities.reports.map((cap, i) => (
                    <button
                      key={i}
                      onClick={() => handleCapabilityClick(cap)}
                      className="group px-4 py-2 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/30 hover:from-emerald-100 hover:to-emerald-200 dark:hover:from-emerald-900/50 dark:hover:to-emerald-800/50 border-2 border-emerald-200 dark:border-emerald-800 hover:border-emerald-400 dark:hover:border-emerald-600 rounded-lg text-sm text-emerald-700 dark:text-emerald-300 hover:text-emerald-800 dark:hover:text-emerald-200 font-medium transition-all hover:shadow-md hover:scale-105 active:scale-95"
                    >
                      {cap.text}
                    </button>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Bottom Row - Help & Troubleshooting Centered */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, delay: 0.2, ease: "easeOut" }}
              className="flex justify-center mt-6"
            >
              <div className="w-full max-w-2xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 rounded-lg p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#0d9488]/10 dark:bg-[#50e080]/10 rounded-lg flex items-center justify-center">
                      <HelpCircle size={20} className="text-[#0d9488] dark:text-[#50e080]" />
                    </div>
                    <h2 className="text-zinc-900 dark:text-white font-semibold">Help & Troubleshooting</h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {capabilities.help.map((cap, i) => (
                      <button
                        key={i}
                        onClick={() => handleCapabilityClick(cap)}
                        className="group px-4 py-2 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/30 hover:from-orange-100 hover:to-orange-200 dark:hover:from-orange-900/50 dark:hover:to-orange-800/50 border-2 border-orange-200 dark:border-orange-800 hover:border-orange-400 dark:hover:border-orange-600 rounded-lg text-sm text-orange-700 dark:text-orange-300 hover:text-orange-800 dark:hover:text-orange-200 font-medium transition-all hover:shadow-md hover:scale-105 active:scale-95"
                      >
                        {cap.text}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
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