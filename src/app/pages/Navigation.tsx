import { Settings, Cpu, Monitor, Package, Archive, Box, MapPin, BarChart2, Briefcase, Sliders, Users, Shield, Eye, Languages, Database, FileText, ClipboardCheck, RefreshCw, Search, PackageX, Package2, Settings2, MonitorSmartphone, Server, Activity, ScanLine, BookOpen, Layers, Wifi, ChevronDown, ChevronRight, ListTodo, Calendar, Clock, Star, LayoutDashboard, BarChart3, ClipboardList, Cog, ScrollText, AlertCircle, TrendingUp, Home, Power } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useLayout } from "../contexts/LayoutContext";
import { useVersionTheme } from "../contexts/VersionThemeContext";
import { useAuth } from "../contexts/AuthContext";
import type { PinnedItem } from "../contexts/LayoutContext";
import { GearArrowIcon } from "../components/icons/GearArrowIcon";

export function Navigation() {
 const [selectedOption, setSelectedOption] = useState<string | null>(null);
 const [selectedSubOption, setSelectedSubOption] = useState<{ mainId: string; subId: string } | null>(null);
 const [showWorkstationWarning, setShowWorkstationWarning] = useState(false);
 const [pendingNavPath, setPendingNavPath] = useState<string | null>(null);
 const navigate = useNavigate();
 const [searchParams] = useSearchParams();
 const { version } = useVersionTheme();
 const isV6 = version === "Master Blue V6";
 const { setShowAI, togglePinItem, isPinned, assignedWorkstation, setShowWorkstations } = useLayout();
 const { user } = useAuth();

 // Check if we should open OPTO on mount or handle breadcrumb navigation
 useEffect(() => {
 if (searchParams.get("opto") === "open") {
 setShowAI(true);
 }

 // Handle breadcrumb navigation - expand menus based on section/subsection params
 const section = searchParams.get("section");
 const subsection = searchParams.get("subsection");

 if (section) {
 setSelectedOption(section);
 
 if (subsection) {
 setSelectedSubOption({ mainId: section, subId: subsection });
 }
 }
 }, [searchParams, setShowAI]);

 const navigationOptions = [
 {
 id: "dashboards",
 title: "Business Insights",
 description: "View system dashboards",
 icon: LayoutDashboard,
 color: " ",
 hoverColor: " ",
 bgColor: "bg-[var(--surface-container-high)]",
 subOptions: [
 { id: "operations-dashboard", title: "Operations Dashboard", icon: LayoutDashboard, path: "/app/dashboard" },
 { id: "health-dashboard", title: "Monitoring Dashboard", icon: Activity, path: "/app/health" },
 { id: "mhe-dashboard", title: "MHE Dashboard", icon: GearArrowIcon, path: "/app/mhe" },
 { id: "executive-dashboard", title: "Executive Dashboard", icon: TrendingUp, path: "/app/executive" },
 { id: "analytics", title: "Analytics", icon: BarChart3, path: "/app/analytics" },
 { id: "user-workstation-activity", title: "User Workstation Activity", icon: Activity, path: "/app/user-workstation-activity" },
 { id: "throughput-monitor", title: "Throughput Controls Monitor", icon: Cpu, path: "/app/throughput-monitor" },
 ],
 },
 {
 id: "operations",
 title: "Operations",
 description: "Manage operational workflows",
 icon: Settings,
 color: " ",
 hoverColor: " ",
 bgColor: "bg-[var(--surface-container-high)]",
 subOptions: [
 { id: "items", title: "Items", icon: Package, path: "/app/items" },
 { id: "locations", title: "Locations", icon: MapPin, path: "/app/storage-locations" },
 { id: "containers", title: "Containers", icon: Box, path: "/app/containers" },
 {
 id: "data-analysis",
 title: "Data Analysis",
 icon: BarChart2,
 tertiaryOptions: [
 { id: "logs", title: "Logs", icon: ScrollText, path: "/app/logs" },
 { id: "lane-management", title: "Lane Management", icon: Layers, path: "/app/lane-management" },
 { id: "scan-statistics", title: "Scan Statistics", icon: Activity },
 { id: "scan-log", title: "Scan Log", icon: ScanLine },
 { id: "ledger", title: "Ledger", icon: BookOpen },
 { id: "queues", title: "Queues", icon: Layers },
 { id: "port-activity", title: "Port Activity", icon: Wifi },
 ],
 },
 { 
 id: "work", 
 title: "Work", 
 icon: Briefcase,
 tertiaryOptions: [
 { id: "work-list", title: "Work List", icon: ListTodo, path: "/app/worklist" },
 { id: "pick-lists", title: "Pick Lists", icon: ClipboardList, path: "/app/worklist?type=Pick" },
 { id: "replenishment-lists", title: "Replenishment Lists", icon: RefreshCw, path: "/app/worklist?type=Replenishment" },
 { id: "cycle-counts", title: "Cycle Counts", icon: Search, path: "/app/worklist?type=Cycle Count" },
 { id: "inspection-lists", title: "Inspection Lists", icon: PackageX, path: "/app/worklist?type=Inspection" },
 { id: "work-batch", title: "Work Batch", icon: Layers },
 { id: "planner", title: "Planner", icon: Calendar },
 { id: "scheduler", title: "Scheduler", icon: Clock },
 ],
 },
 ],
 },
 {
 id: "system",
 title: "System",
 description: "System configuration",
 icon: Cpu,
 color: " ",
 hoverColor: " ",
 bgColor: "bg-[var(--surface-container-high)]",
 subOptions: [
 { id: "parameter-management", title: "Parameter Management", icon: Sliders, path: "/app/system-parameters" },
 { id: "user-management", title: "User Management", icon: Users, path: "/app/user-management" },
 { id: "group-management", title: "Group Management", icon: Shield, path: "/app/group-management" },
 { id: "property-visibility", title: "Property Visibility", icon: Eye, path: "/app/property-visibility" },
 { id: "localization-management", title: "Localization Management", icon: Languages },
 { id: "storage-types", title: "Storage Types", icon: Database },
 { id: "reason-codes", title: "Reason Codes", icon: FileText },
 ],
 },
 {
 id: "workstation",
 title: "Workstation Operations",
 description: "Workstation controls",
 icon: Monitor,
 color: " ",
 hoverColor: " ",
 bgColor: "bg-[var(--surface-container-high)]",
 subOptions: [
 { id: "pick", title: "Pick", icon: ClipboardCheck, path: "/app/pick" },
 { id: "replenishment", title: "Replenishment", icon: RefreshCw, path: "/app/replenishment" },
 { id: "mhe-control-panel", title: "MHE Control Panel", icon: Power, path: "/app/mhe-control-panel" },
 { id: "asset-operations", title: "Asset Operations", icon: Archive, path: "/app/asset-operations" },
 { id: "mpc-operations", title: "MPC Operations", icon: ClipboardCheck, path: "/app/mpc-operations" },
 { id: "cycle-count", title: "Cycle Count", icon: Search, path: "/app/cycle-count" },
 { id: "inspection", title: "Inspection", icon: PackageX, path: "/app/inspection" },
 { id: "de-wrap", title: "DeWrap", icon: Package2, path: "/app/dewrap" },
 { id: "de-layer", title: "Manual DeLayer", icon: Package2, path: "/app/delayer" },
 { id: "configuration", title: "Configuration", icon: Settings2 },
 ],
 },
 ];

 const handleMainNavigation = (optionId: string) => {
 setSelectedOption(optionId);
 setSelectedSubOption(null);
 };

 const handleSubNavigation = (mainId: string, subId: string) => {
 console.log(`Navigating to: ${mainId} -> ${subId}`);
 setSelectedSubOption({ mainId, subId });
 // Sub-navigation logic will be implemented here
 };

 const handleTertiaryNavigation = (mainId: string, subId: string, tertiaryId: string) => {
 console.log(`Navigating to: ${mainId} -> ${subId} -> ${tertiaryId}`);
 
 // Map tertiary IDs to actual routes
 const routeMap: { [key: string]: string } = {
 'work-list': '/app/worklist',
 // Add more route mappings here as needed
 };
 
 const route = routeMap[tertiaryId];
 if (route) {
 navigate(route);
 } else {
 // For other tertiary options without routes yet
 console.log(`No route defined for: ${tertiaryId}`);
 }
 };

 const selectedOptionData = navigationOptions.find(opt => opt.id === selectedOption);
 const selectedSubOptionData = selectedOptionData?.subOptions.find(
 sub => sub.id === selectedSubOption?.subId
 );

 // Helper to get icon name from icon component
 const getIconName = (IconComponent: any): string => {
 // Direct component reference mapping
 if (IconComponent === Package) return 'Package';
 if (IconComponent === Archive) return 'Archive';
 if (IconComponent === Box) return 'Box';
 if (IconComponent === MapPin) return 'MapPin';
 if (IconComponent === BarChart2) return 'BarChart2';
 if (IconComponent === Briefcase) return 'Briefcase';
 if (IconComponent === Server) return 'Server';
 if (IconComponent === Activity) return 'Activity';
 if (IconComponent === ScanLine) return 'ScanLine';
 if (IconComponent === BookOpen) return 'BookOpen';
 if (IconComponent === Layers) return 'Layers';
 if (IconComponent === Wifi) return 'Wifi';
 if (IconComponent === ListTodo) return 'ListTodo';
 if (IconComponent === Calendar) return 'Calendar';
 if (IconComponent === Clock) return 'Clock';
 if (IconComponent === Sliders) return 'Sliders';
 if (IconComponent === Users) return 'Users';
 if (IconComponent === Shield) return 'Shield';
 if (IconComponent === Eye) return 'Eye';
 if (IconComponent === Languages) return 'Languages';
 if (IconComponent === Database) return 'Database';
 if (IconComponent === FileText) return 'FileText';
 if (IconComponent === ClipboardCheck) return 'ClipboardCheck';
 if (IconComponent === RefreshCw) return 'RefreshCw';
 if (IconComponent === Search) return 'Search';
 if (IconComponent === PackageX) return 'PackageX';
 if (IconComponent === Package2) return 'Package2';
 if (IconComponent === Settings2) return 'Settings2';
 if (IconComponent === MonitorSmartphone) return 'MonitorSmartphone';
 if (IconComponent === LayoutDashboard) return 'LayoutDashboard';
 if (IconComponent === Cog) return 'Cog';
 if (IconComponent === BarChart3) return 'BarChart3';
 if (IconComponent === Settings) return 'Settings';
 if (IconComponent === Cpu) return 'Cpu';
 if (IconComponent === Monitor) return 'Monitor';
 if (IconComponent === ScrollText) return 'ScrollText';
 if (IconComponent === AlertCircle) return 'AlertCircle';
 if (IconComponent === TrendingUp) return 'TrendingUp';
 if (IconComponent === Home) return 'Home';
 return 'Package'; // Default fallback
 };

 const handlePinMainOption = (e: React.MouseEvent, option: any) => {
 e.stopPropagation();
 
 const iconName = getIconName(option.icon);
 const pinItem: PinnedItem = {
 id: option.id,
 title: option.title,
 icon: iconName,
 };

 // Add all sub-options as children, including their tertiary options
 if (option.subOptions && option.subOptions.length > 0) {
 pinItem.children = option.subOptions.map((sub: any) => ({
 id: sub.id,
 title: sub.title,
 path: sub.path,
 tertiaryOptions: sub.tertiaryOptions ? sub.tertiaryOptions.map((tertiary: any) => ({
 id: tertiary.id,
 title: tertiary.title,
 path: tertiary.path,
 })) : undefined,
 }));
 }

 togglePinItem(pinItem);
 };

 const handlePinSubOption = (e: React.MouseEvent, mainId: string, subOption: any) => {
 e.stopPropagation();
 
 // Build the pin item - extract icon name from component
 const iconName = getIconName(subOption.icon);
 const pinItem: PinnedItem = {
 id: `${mainId}-${subOption.id}`,
 title: subOption.title,
 path: subOption.path,
 icon: iconName,
 };

 // If it has tertiary options, add them as children
 if (subOption.tertiaryOptions && subOption.tertiaryOptions.length > 0) {
 pinItem.children = subOption.tertiaryOptions.map((tertiary: any) => ({
 id: tertiary.id,
 title: tertiary.title,
 path: tertiary.path,
 }));
 }

 togglePinItem(pinItem);
 };

 const handlePinTertiaryOption = (e: React.MouseEvent, mainId: string, subId: string, tertiaryOption: any) => {
 e.stopPropagation();
 
 // Extract icon name from component
 const iconName = getIconName(tertiaryOption.icon);
 const pinItem: PinnedItem = {
 id: `${mainId}-${subId}-${tertiaryOption.id}`,
 title: tertiaryOption.title,
 path: tertiaryOption.path,
 icon: iconName,
 };

 togglePinItem(pinItem);
 };

 const handleDashboardClick = (path: string) => {
 navigate(path);
 };

 // Navigate to pending path once a workstation is registered
 useEffect(() => {
 if (assignedWorkstation && pendingNavPath) {
 navigate(pendingNavPath);
 setPendingNavPath(null);
 }
 }, [assignedWorkstation, pendingNavPath, navigate]);

 const handleSubOptionClick = (mainId: string, subOption: any) => {
 // Check if this is from Workstation Operations and no workstation is assigned
 if (mainId === "workstation" && !assignedWorkstation) {
 setPendingNavPath(subOption.path ?? null);
 setShowWorkstationWarning(true);
 return;
 }

 // If it has a path, navigate to it
 if (subOption.path) {
 navigate(subOption.path);
 } else {
 // Otherwise, expand it to show tertiary options
 handleSubNavigation(mainId, subOption.id);
 }
 };

  const handleTertiaryOptionClick = (mainId: string, subId: string, tertiaryOption: any) => {
    // If it has a path, navigate to it
    if (tertiaryOption.path) {
      navigate(tertiaryOption.path);
    } else {
      handleTertiaryNavigation(mainId, subId, tertiaryOption.id);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-[var(--background)]/95 backdrop-blur-md text-[var(--foreground)] border-b border-[var(--border)] px-8 h-[72px] min-h-[72px] flex items-center">
        <div className="w-full flex items-center justify-between gap-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/app/home" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors flex items-center gap-1">
              <Home size={14} />Home
            </Link>
            <ChevronRight size={14} className="text-[var(--muted-foreground)]" />
            <span className="text-[var(--foreground)] font-semibold text-lg flex items-center gap-2">
              <LayoutDashboard size={20} className="text-[var(--primary)]" />
              Navigation
            </span>
          </nav>
        </div>
      </div>

      <div className="flex-1 p-8 max-w-[1800px] w-full mx-auto">
        {/* Header Intro */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[var(--foreground)] mb-2">Navigation</h2>
          <p className="text-[var(--muted-foreground)] text-base">
            Select a category below to explore screens and workflows
          </p>
        </div>

        {/* Main Navigation Buttons - Horizontal at Top */}
        <div className="flex gap-6 mb-8">
 {navigationOptions
 .filter((option) => {
 // Hide System menu for non-admin users
 if (option.id === "system" && user?.role !== "admin") {
 return false;
 }
 return true;
 })
 .map((option) => {
 const Icon = option.icon;
 const isSelected = selectedOption === option.id;
 const isPinnedMain = isPinned(option.id);
 return (
    <button
      key={option.id}
      onClick={() => handleMainNavigation(option.id)}
      className={`group flex-1 relative bg-[var(--surface-container)] dark:bg-[var(--card)] hover:bg-[var(--surface-container-high)] dark:hover:bg-[var(--surface-container-high)] rounded-xl p-6 transition-all duration-300 ${isV6 ? "border" : "transform hover:scale-105 active:scale-95 border-2"} ${
        isSelected ? "border-[var(--primary)] dark:border-[var(--primary)]" : "border-[var(--border)]  hover:border-[var(--primary)]/50"
      }`}
    >
      {/* Content */}
      <div className="relative flex flex-col items-center text-center space-y-3">
        {/* Icon */}
        <div className="w-16 h-16 bg-[var(--surface-container-high)] dark:bg-[var(--surface-container-high)] rounded-lg flex items-center justify-center group-hover:bg-[var(--primary)]/20 dark:group-hover:bg-[var(--primary)]/20 transition-colors duration-300">
          <Icon size={32} className="text-[var(--foreground)] group-hover:text-[var(--primary)] dark:group-hover:text-[var(--primary)] transition-colors duration-300" />
        </div>

        {/* Text */}
        <div>
          <h3 className="text-xl font-bold text-[var(--foreground)] mb-1">
            {option.title}
          </h3>
          <p className="text-[var(--muted-foreground)] text-sm">
            {option.description}
          </p>
        </div>

        {/* Sub-menu indicator */}
        <div className="flex items-center gap-1 text-[var(--muted-foreground)] text-xs mt-1">
          <ChevronDown size={14} className="group-hover:text-[var(--primary)] transition-colors" />
          <span className="group-hover:text-[var(--primary)] transition-colors">
            {option.subOptions.length} options
          </span>
        </div>
      </div>

      {/* Pin Button */}
      <div
        role="button"
        tabIndex={0}
        className={`absolute top-3 right-3 rounded-full p-2 transition-all duration-200 transform hover:scale-110 active:scale-95 cursor-pointer ${
          isPinnedMain
            ? 'bg-[var(--primary)]/20 /20'
            : 'bg-[var(--surface-container-high)] opacity-0 group-hover:opacity-100'
        }`}
        onClick={(e) => handlePinMainOption(e, option)}
        onKeyDown={(e) => e.key === 'Enter' && handlePinMainOption(e as any, option)}
      >
        <Star
          size={18}
          className={`transition-colors ${
            isPinnedMain
              ? 'fill-[var(--primary)] dark:fill-[var(--primary)] text-[var(--primary)] dark:text-[var(--primary)]'
              : 'text-[var(--muted-foreground)] hover:fill-[var(--primary)]'
          }`}
        />
      </div>

      {/* Selection Indicator */}
      {isSelected && !isV6 && (
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-3 h-2 w-12 bg-[var(--primary)]  rounded-full " />
      )}
    </button>
 );
 })}
 </div>

 {/* Secondary and Tertiary Areas Container */}
 {selectedOptionData && (
 <div className="flex-1 flex flex-col gap-8">
 {/* Secondary Navigation Area */}
 <div className="w-full bg-transparent pt-6 pb-2 border-t border-[var(--border)] ">
 {/* Secondary Area Header - Minimized */}
 <div className="mb-6 pb-4 border-b border-[var(--border)] ">
 <div className="flex items-center gap-3">
 <div className={`w-10 h-10 ${selectedOptionData.bgColor} rounded-lg flex items-center justify-center`}>
 <selectedOptionData.icon size={20} className="text-[var(--foreground)]" />
 </div>
 <h3 className="text-xl font-bold text-[var(--foreground)] ">{selectedOptionData.title}</h3>
 <span className="text-[var(--muted-foreground)] text-sm">• Select a function</span>
 </div>
 </div>

 {/* Sub-Options Grid */}
 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
 {selectedOptionData.subOptions.map((subOption) => {
 const SubIcon = subOption.icon;
 const isSubSelected = selectedSubOption?.subId === subOption.id;
 const hasSubMenu = subOption.tertiaryOptions && subOption.tertiaryOptions.length > 0;
 const isPinnedSub = isPinned(`${selectedOptionData.id}-${subOption.id}`);
 return (
 <button
 key={subOption.id}
 onClick={() => handleSubOptionClick(selectedOptionData.id, subOption)}
 className={`group bg-[var(--surface-container)] dark:bg-[var(--card)] hover:bg-[var(--surface-container)] hover:bg-[var(--surface-container-high)] rounded-lg p-6 transition-all duration-200 ${isV6 ? "border" : "transform hover:scale-105 active:scale-95 border-2"} ${
 isSubSelected ? "border-[var(--primary)] dark:border-[var(--primary)] " : "border-[var(--border)]  hover:border-[var(--primary)]/50 dark:hover:border-[var(--primary)]/50"
 } relative`}
 >
 <div className="flex flex-col items-center text-center space-y-3">
 {/* Icon */}
 <div className="w-14 h-14 bg-[var(--surface-container-high)] group-hover:bg-[var(--primary)]/20 dark:group-hover:bg-[var(--primary)]/20 rounded-lg flex items-center justify-center transition-colors duration-200">
 <SubIcon size={28} className="text-[var(--muted-foreground)] group-hover:text-[var(--primary)] dark:group-hover:text-[var(--primary)] transition-colors duration-200" />
 </div>

 {/* Title */}
 <h4 className="text-sm font-semibold text-[var(--foreground)]  leading-tight">
 {subOption.title}
 </h4>
 
 {/* Sub-menu indicator */}
 {hasSubMenu && (
 <div className="flex items-center gap-1 text-[var(--muted-foreground)] group-hover:text-[var(--primary)] dark:group-hover:text-[var(--primary)] text-xs transition-colors">
 <ChevronDown size={12} />
 </div>
 )}
 </div>
 
 {/* Pin Button */}
 <div
 className={`absolute top-2 right-2 rounded-full p-2 transition-all duration-200 transform hover:scale-110 active:scale-95 cursor-pointer ${
 isPinnedSub 
 ? 'bg-[var(--primary)]/20 /20' 
 : 'bg-[var(--surface-container)] dark:bg-[var(--card)] opacity-0 group-hover:opacity-100'
 }`}
 onClick={(e) => handlePinSubOption(e, selectedOptionData.id, subOption)}
 >
 <Star 
 size={16} 
 className={`transition-colors ${
 isPinnedSub 
 ? 'fill-[var(--primary)] dark:fill-[var(--primary)] text-[var(--primary)] dark:text-[var(--primary)]' 
 : 'text-[var(--muted-foreground)] hover:text-[var(--primary)] dark:hover:text-[var(--primary)]'
 }`}
 />
 </div>
 
 {/* Selection Indicator - Bottom bar */}
 {isSubSelected && !isV6 && (
 <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 h-1 w-8 bg-[var(--primary)]  rounded-full " />
 )}
 </button>
 );
 })}
 </div>
 </div>

 {/* Tertiary Navigation Area (below secondary, for sub-options with tertiary options) */}
 {selectedSubOptionData && selectedSubOptionData.tertiaryOptions && (
 <div className="w-full bg-transparent pt-6 pb-2 border-t border-[var(--border)]  animate-in fade-in duration-300">
 {/* Tertiary Area Header - Minimized */}
 <div className="mb-6 pb-4 border-b border-[var(--border)] ">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 bg-[var(--primary)]  rounded-lg flex items-center justify-center">
 <selectedSubOptionData.icon size={20} className="text-[var(--foreground)]" />
 </div>
 <h3 className="text-xl font-bold text-[var(--foreground)] ">{selectedSubOptionData.title}</h3>
 <span className="text-[var(--muted-foreground)] text-sm">• Select an option</span>
 </div>
 </div>

 {/* Tertiary Options Grid */}
 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
 {selectedSubOptionData.tertiaryOptions.map((tertiaryOption) => {
 const TertiaryIcon = tertiaryOption.icon;
 const isPinnedTertiary = isPinned(`${selectedSubOption!.mainId}-${selectedSubOption!.subId}-${tertiaryOption.id}`);
 return (
 <button
 key={tertiaryOption.id}
 onClick={() => handleTertiaryOptionClick(
 selectedSubOption!.mainId,
 selectedSubOption!.subId,
 tertiaryOption
 )}
 className={`group bg-[var(--surface-container)] dark:bg-[var(--card)] hover:bg-[var(--surface-container)] hover:bg-[var(--surface-container-high)] rounded-lg p-6 transition-all duration-200 ${isV6 ? "border-[var(--border)]" : "transform hover:scale-105 active:scale-95 border-[var(--border)]"}  hover:border-[var(--primary)]/50 dark:hover:border-[var(--primary)]/50 flex flex-col items-center text-center space-y-3 relative`}
 >
 {/* Icon */}
 <div className="w-14 h-14 bg-[var(--surface-container-high)] group-hover:bg-[var(--primary)]/20 dark:group-hover:bg-[var(--primary)]/20 rounded-lg flex items-center justify-center transition-colors duration-200">
 <TertiaryIcon size={28} className="text-[var(--muted-foreground)] group-hover:text-[var(--primary)] dark:group-hover:text-[var(--primary)] transition-colors duration-200" />
 </div>

 {/* Title */}
 <h4 className="text-sm font-semibold text-[var(--foreground)]  leading-tight">
 {tertiaryOption.title}
 </h4>
 
 {/* Pin Button */}
 <div
 className={`absolute top-2 right-2 rounded-full p-2 transition-all duration-200 transform hover:scale-110 active:scale-95 cursor-pointer ${
 isPinnedTertiary 
 ? 'bg-[var(--primary)]/20 /20' 
 : 'bg-[var(--surface-container)] dark:bg-[var(--card)] opacity-0 group-hover:opacity-100'
 }`}
 onClick={(e) => handlePinTertiaryOption(e, selectedSubOption!.mainId, selectedSubOption!.subId, tertiaryOption)}
 >
 <Star 
 size={16} 
 className={`transition-colors ${
 isPinnedTertiary 
 ? 'fill-[var(--primary)] dark:fill-[var(--primary)] text-[var(--primary)] dark:text-[var(--primary)]' 
 : 'text-[var(--muted-foreground)] hover:text-[var(--primary)] dark:hover:text-[var(--primary)]'
 }`}
 />
 </div>
 </button>
 );
 })}
 </div>
 </div>
 )}
 </div>
 )}

 {/* Workstation Warning Dialog */}
 {showWorkstationWarning && (
 <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-xl border-[var(--border)]  p-8 max-w-md w-full mx-4 ">
 <div className="flex items-center gap-4 mb-6">
 <div className="w-12 h-12 bg-[var(--state-warning)]/20 rounded-lg flex items-center justify-center">
 <AlertCircle size={24} className="text-[var(--state-warning)]" />
 </div>
 <div>
 <h3 className="text-xl font-bold text-[var(--foreground)] ">Workstation Not Registered</h3>
 <p className="text-sm text-[var(--muted-foreground)]">This action requires a registered workstation</p>
 </div>
 </div>

 <p className="text-[var(--foreground)] mb-6">
 This action cannot be performed until a workstation is registered. Would you like to register a workstation now?
 </p>

 <div className="flex gap-3">
 <button
 onClick={() => setShowWorkstationWarning(false)}
 className="flex-1 px-4 py-3 bg-[var(--surface-container)] dark:bg-[var(--card)] hover:bg-[var(--surface-container-high)] text-[var(--foreground)]  rounded-lg font-medium transition-colors"
 >
 No
 </button>
 <button
 onClick={() => {
 setShowWorkstationWarning(false);
 setShowWorkstations(true);
 }}
 className="flex-1 px-4 py-3 bg-[var(--primary)]  hover:opacity-90 active:scale-[0.98] text-[var(--primary-foreground)] rounded-lg font-medium transition-colors"
 >
 Yes, Register Now
 </button>
 </div>
 </div>
 </div>
 )}
      </div>
    </div>
  );
}

export default Navigation;
