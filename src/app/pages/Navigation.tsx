import { Settings, Cpu, Monitor, Package, Archive, Box, MapPin, BarChart2, Briefcase, Sliders, Users, Shield, Eye, Languages, Database, FileText, ClipboardCheck, RefreshCw, Search, PackageX, Package2, Settings2, MonitorSmartphone, Server, Activity, ScanLine, BookOpen, Layers, Wifi, ChevronDown, ChevronRight, ListTodo, Calendar, Clock, Star, LayoutDashboard, BarChart3, ClipboardList, Cog, ScrollText, AlertCircle, TrendingUp, Home, Power } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useLayout } from "../contexts/LayoutContext";
import { useAuth } from "../contexts/AuthContext";
import type { PinnedItem } from "../contexts/LayoutContext";
import { GearArrowIcon } from "../components/icons/GearArrowIcon";

export function Navigation() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedSubOption, setSelectedSubOption] = useState<{ mainId: string; subId: string } | null>(null);
  const [showWorkstationWarning, setShowWorkstationWarning] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
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
      color: "from-zinc-700 to-zinc-800",
      hoverColor: "hover:from-zinc-600 hover:to-zinc-700",
      bgColor: "bg-zinc-700",
      subOptions: [
        { id: "operations-dashboard", title: "Operations Dashboard", icon: LayoutDashboard, path: "/app/dashboard" },
        { id: "health-dashboard", title: "Monitoring Dashboard", icon: Activity, path: "/app/health" },
        { id: "mhe-dashboard", title: "MHE Dashboard", icon: GearArrowIcon, path: "/app/mhe" },
        { id: "executive-dashboard", title: "Executive Dashboard", icon: TrendingUp, path: "/app/executive" },
        { id: "analytics", title: "Analytics", icon: BarChart3, path: "/app/analytics" },
        { id: "activity-report", title: "User/Workstation Activity", icon: ClipboardList, path: "/app/activity-report" },
      ],
    },
    {
      id: "operations",
      title: "Operations",
      description: "Manage operational workflows",
      icon: Settings,
      color: "from-zinc-700 to-zinc-800",
      hoverColor: "hover:from-zinc-600 hover:to-zinc-700",
      bgColor: "bg-zinc-700",
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
      color: "from-zinc-700 to-zinc-800",
      hoverColor: "hover:from-zinc-600 hover:to-zinc-700",
      bgColor: "bg-zinc-700",
      subOptions: [
        { id: "parameter-management", title: "Parameter Management", icon: Sliders },
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
      color: "from-zinc-700 to-zinc-800",
      hoverColor: "hover:from-zinc-600 hover:to-zinc-700",
      bgColor: "bg-zinc-700",
      subOptions: [
        { id: "pick", title: "Pick", icon: ClipboardCheck, path: "/app/pick" },
        { id: "replenishment", title: "Replenishment", icon: RefreshCw, path: "/app/replenishment" },
        { id: "mhe-control-panel", title: "MHE Control Panel", icon: Power, path: "/app/mhe-control-panel" },
        { id: "cycle-count", title: "Cycle Count", icon: Search },
        { id: "inspection", title: "Inspection", icon: PackageX },
        { id: "de-wrap", title: "De-Wrap", icon: Package2, path: "/app/dewrap" },
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

  const handleSubOptionClick = (mainId: string, subOption: any) => {
    // Check if this is from Workstation Operations and no workstation is assigned
    if (mainId === "workstation" && !assignedWorkstation) {
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
    <div className="p-8 min-h-screen flex flex-col">
      {/* Breadcrumb Navigation */}
      <div className="mb-4 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-500">
        <Link to="/app/home" className="hover:text-[#0d9488] dark:hover:text-[#50e080] transition-colors flex items-center gap-1">
          <Home size={14} />
          Home
        </Link>
        <ChevronRight size={14} />
        <span className="text-zinc-900 dark:text-white font-medium">Navigation</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-zinc-900 dark:text-white mb-3">Navigation</h2>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg">
          Select an option to continue
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
              className={`group flex-1 relative bg-gradient-to-br ${option.color} ${option.hoverColor} rounded-xl p-6 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl border-2 ${
                isSelected ? "border-[#0d9488] dark:border-[#50e080] ring-4 ring-[#0d9488]/30 dark:ring-[#50e080]/30" : "border-white/10 hover:border-white/20"
              }`}
            >
              {/* Content */}
              <div className="relative flex flex-col items-center text-center space-y-3">
                {/* Icon */}
                <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
                  <Icon size={32} className="text-white" />
                </div>

                {/* Text */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    {option.title}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {option.description}
                  </p>
                </div>
                
                {/* Sub-menu indicator */}
                <div className="flex items-center gap-1 text-white/60 text-xs mt-1">
                  <ChevronDown size={14} className="group-hover:text-white/80 transition-colors" />
                  <span className="group-hover:text-white/80 transition-colors">
                    {option.subOptions.length} options
                  </span>
                </div>
              </div>

              {/* Pin Button */}
              <button
                className={`absolute top-3 right-3 rounded-full p-2 transition-all duration-200 transform hover:scale-110 active:scale-95 ${
                  isPinnedMain 
                    ? 'bg-[#0d9488]/20 dark:bg-[#50e080]/20' 
                    : 'bg-white/10 opacity-0 group-hover:opacity-100'
                }`}
                onClick={(e) => handlePinMainOption(e, option)}
              >
                <Star 
                  size={18} 
                  className={`transition-colors ${
                    isPinnedMain 
                      ? 'fill-[#0d9488] dark:fill-[#50e080] text-[#0d9488] dark:text-[#50e080]' 
                      : 'text-white hover:fill-white'
                  }`}
                />
              </button>

              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute left-1/2 -translate-x-1/2 -bottom-3 h-2 w-12 bg-[#0d9488] dark:bg-[#50e080] rounded-full shadow-lg" />
              )}
            </button>
          );
        })}
      </div>

      {/* Secondary and Tertiary Areas Container */}
      {selectedOptionData && (
        <div className="flex-1 flex flex-col gap-8">
          {/* Secondary Navigation Area */}
          <div className="w-full bg-zinc-100 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800 p-8">
            {/* Secondary Area Header - Minimized */}
            <div className="mb-6 pb-4 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${selectedOptionData.bgColor} rounded-lg flex items-center justify-center`}>
                  <selectedOptionData.icon size={20} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{selectedOptionData.title}</h3>
                <span className="text-zinc-500 dark:text-zinc-500 text-sm">• Select a function</span>
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
                    className={`group bg-zinc-200 dark:bg-zinc-800/50 hover:bg-zinc-300 dark:hover:bg-zinc-800 rounded-lg p-6 transition-all duration-200 transform hover:scale-105 active:scale-95 border-2 ${
                      isSubSelected ? "border-[#0d9488] dark:border-[#50e080] ring-2 ring-[#0d9488]/30 dark:ring-[#50e080]/30" : "border-zinc-300 dark:border-zinc-700 hover:border-[#0d9488]/50 dark:hover:border-[#50e080]/50"
                    } hover:shadow-lg hover:shadow-[#0d9488]/10 dark:hover:shadow-[#50e080]/10 relative`}
                  >
                    <div className="flex flex-col items-center text-center space-y-3">
                      {/* Icon */}
                      <div className="w-14 h-14 bg-zinc-300 dark:bg-zinc-700/50 group-hover:bg-[#0d9488]/20 dark:group-hover:bg-[#50e080]/20 rounded-lg flex items-center justify-center transition-colors duration-200">
                        <SubIcon size={28} className="text-zinc-600 dark:text-zinc-400 group-hover:text-[#0d9488] dark:group-hover:text-[#50e080] transition-colors duration-200" />
                      </div>

                      {/* Title */}
                      <h4 className="text-sm font-semibold text-zinc-900 dark:text-white leading-tight">
                        {subOption.title}
                      </h4>
                      
                      {/* Sub-menu indicator */}
                      {hasSubMenu && (
                        <div className="flex items-center gap-1 text-zinc-500 dark:text-zinc-500 group-hover:text-[#0d9488] dark:group-hover:text-[#50e080] text-xs transition-colors">
                          <ChevronDown size={12} />
                        </div>
                      )}
                    </div>
                    
                    {/* Pin Button */}
                    <div
                      className={`absolute top-2 right-2 rounded-full p-2 transition-all duration-200 transform hover:scale-110 active:scale-95 cursor-pointer ${
                        isPinnedSub 
                          ? 'bg-[#0d9488]/20 dark:bg-[#50e080]/20' 
                          : 'bg-zinc-200 dark:bg-zinc-800/50 opacity-0 group-hover:opacity-100'
                      }`}
                      onClick={(e) => handlePinSubOption(e, selectedOptionData.id, subOption)}
                    >
                      <Star 
                        size={16} 
                        className={`transition-colors ${
                          isPinnedSub 
                            ? 'fill-[#0d9488] dark:fill-[#50e080] text-[#0d9488] dark:text-[#50e080]' 
                            : 'text-zinc-500 dark:text-zinc-400 hover:text-[#0d9488] dark:hover:text-[#50e080]'
                        }`}
                      />
                    </div>
                    
                    {/* Selection Indicator - Bottom bar */}
                    {isSubSelected && (
                      <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 h-1 w-8 bg-[#0d9488] dark:bg-[#50e080] rounded-full shadow-lg" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tertiary Navigation Area (below secondary, for sub-options with tertiary options) */}
          {selectedSubOptionData && selectedSubOptionData.tertiaryOptions && (
            <div className="w-full bg-zinc-100 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800 p-8 animate-in fade-in duration-300">
              {/* Tertiary Area Header - Minimized */}
              <div className="mb-6 pb-4 border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#0d9488] dark:bg-[#50e080] rounded-lg flex items-center justify-center">
                    <selectedSubOptionData.icon size={20} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{selectedSubOptionData.title}</h3>
                  <span className="text-zinc-500 dark:text-zinc-500 text-sm">• Select an option</span>
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
                      className="group bg-zinc-200 dark:bg-zinc-800/50 hover:bg-zinc-300 dark:hover:bg-zinc-800 rounded-lg p-6 transition-all duration-200 transform hover:scale-105 active:scale-95 border border-zinc-300 dark:border-zinc-700 hover:border-[#0d9488]/50 dark:hover:border-[#50e080]/50 hover:shadow-lg hover:shadow-[#0d9488]/10 dark:hover:shadow-[#50e080]/10 flex flex-col items-center text-center space-y-3 relative"
                    >
                      {/* Icon */}
                      <div className="w-14 h-14 bg-zinc-300 dark:bg-zinc-700/50 group-hover:bg-[#0d9488]/20 dark:group-hover:bg-[#50e080]/20 rounded-lg flex items-center justify-center transition-colors duration-200">
                        <TertiaryIcon size={28} className="text-zinc-600 dark:text-zinc-400 group-hover:text-[#0d9488] dark:group-hover:text-[#50e080] transition-colors duration-200" />
                      </div>

                      {/* Title */}
                      <h4 className="text-sm font-semibold text-zinc-900 dark:text-white leading-tight">
                        {tertiaryOption.title}
                      </h4>
                      
                      {/* Pin Button */}
                      <div
                        className={`absolute top-2 right-2 rounded-full p-2 transition-all duration-200 transform hover:scale-110 active:scale-95 cursor-pointer ${
                          isPinnedTertiary 
                            ? 'bg-[#0d9488]/20 dark:bg-[#50e080]/20' 
                            : 'bg-zinc-200 dark:bg-zinc-800/50 opacity-0 group-hover:opacity-100'
                        }`}
                        onClick={(e) => handlePinTertiaryOption(e, selectedSubOption!.mainId, selectedSubOption!.subId, tertiaryOption)}
                      >
                        <Star 
                          size={16} 
                          className={`transition-colors ${
                            isPinnedTertiary 
                              ? 'fill-[#0d9488] dark:fill-[#50e080] text-[#0d9488] dark:text-[#50e080]' 
                              : 'text-zinc-500 dark:text-zinc-400 hover:text-[#0d9488] dark:hover:text-[#50e080]'
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
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <AlertCircle size={24} className="text-orange-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Workstation Not Registered</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">This action requires a registered workstation</p>
              </div>
            </div>

            <p className="text-zinc-700 dark:text-zinc-300 mb-6">
              This action cannot be performed until a workstation is registered. Would you like to register a workstation now?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowWorkstationWarning(false)}
                className="flex-1 px-4 py-3 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-lg font-medium transition-colors"
              >
                No
              </button>
              <button
                onClick={() => {
                  setShowWorkstationWarning(false);
                  setShowWorkstations(true);
                }}
                className="flex-1 px-4 py-3 bg-[#0d9488] dark:bg-[#50e080] hover:bg-[#0b7a70] dark:hover:bg-[#3bc76a] text-white rounded-lg font-medium transition-colors"
              >
                Yes, Register Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}