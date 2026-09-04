import { NavLink, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import {
  LayoutDashboard,
  BarChart3,
  FolderKanban,
  Users,
  Settings,
  Sparkles,
  ChevronLeft,
  PanelLeftClose,
  PanelLeft,
  ClipboardList,
  Compass,
  LogOut,
  UserCircle,
  Clock,
  ChevronDown,
  Monitor,
  Activity,
  Cog,
  ListTodo,
  Cpu,
  ChevronRight,
  Sliders,
  Shield,
  Eye,
  Languages,
  Database,
  FileText,
  Package,
  Archive,
  Box,
  MapPin,
  BarChart2,
  ScrollText,
  ScanLine,
  BookOpen,
  Layers,
  Wifi,
  Briefcase,
  RefreshCw,
  Search,
  PackageX,
  Package2,
  Settings2,
  ClipboardCheck,
  Calendar,
  Star,
  Bell,
  AlertCircle,
  TrendingUp,
  Home,
} from "lucide-react";
import { useLayout } from "../contexts/LayoutContext";
import { useAuth } from "../contexts/AuthContext";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import logo from "figma:asset/0cbf7aa367bef87c8bd0f1fedc1e56dd4afd0a48.png";
import { GearArrowIcon } from "./icons/GearArrowIcon";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import type { PinnedItem } from "../contexts/LayoutContext";

interface SidebarProps {
  onAIClick: () => void;
  isExpanded: boolean;
  onToggle: () => void;
  onProfileClick: () => void;
  onWorkstationsClick: () => void;
  onNotificationsClick: () => void;
  assignedWorkstation: string | null;
  unreadNotificationsCount: number;
}

export function Sidebar({ onAIClick, isExpanded, onToggle, onProfileClick, onWorkstationsClick, onNotificationsClick, assignedWorkstation, unreadNotificationsCount }: SidebarProps) {
  const navigate = useNavigate();
  const { pinnedItems, reorderPinnedItems } = useLayout();
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showWorkstationWarning, setShowWorkstationWarning] = useState(false);
  const [expandedPinned, setExpandedPinned] = useState<string | null>(null);
  const [expandedChildren, setExpandedChildren] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [flyoutPosition, setFlyoutPosition] = useState<{ top: number } | null>(null);
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);

  // Check if item is from Workstation Operations
  const isWorkstationItem = (itemId: string) => {
    return itemId.startsWith("workstation-");
  };

  // Handle click on pinned item - check for workstation requirement
  const handlePinnedItemClick = (e: React.MouseEvent, item: any) => {
    if (isWorkstationItem(item.id) && !assignedWorkstation) {
      setShowWorkstationWarning(true);
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const getIconComponent = (iconName?: string) => {
    const icons: { [key: string]: any } = {
      LayoutDashboard,
      Activity,
      Cog,
      GearArrow: GearArrowIcon,
      BarChart3,
      ClipboardList,
      ListTodo,
      Settings,
      Cpu,
      Monitor,
      Package,
      Archive,
      Box,
      MapPin,
      BarChart2,
      ScrollText,
      ScanLine,
      BookOpen,
      Layers,
      Wifi,
      Briefcase,
      RefreshCw,
      Search,
      PackageX,
      Package2,
      Settings2,
      ClipboardCheck,
      Sliders,
      Users,
      Shield,
      Eye,
      Languages,
      Database,
      FileText,
      Calendar,
      Clock,
      Star,
      Bell,
      AlertCircle,
      TrendingUp,
      Home,
    };
    return iconName ? icons[iconName] : null;
  };

  const togglePinnedItem = (id: string) => {
    setExpandedPinned(expandedPinned === id ? null : id);
  };

  const toggleChildren = (id: string) => {
    setExpandedChildren(expandedChildren === id ? null : id);
  };

  const handleInactivityReason = () => {
    setUserMenuOpen(false);
    // Future implementation - show inactivity reason dialog
  };

  // Draggable Pinned Item Component
  const DraggablePinnedItem = ({ item, index }: { item: PinnedItem; index: number }) => {
    const ref = useRef<HTMLDivElement>(null);
    const Icon = getIconComponent(item.icon);
    const hasChildren = item.children && item.children.length > 0;
    const isDropdownExpanded = expandedPinned === item.id;
    const isHovered = hoveredItem === item.id;

    const [{ isDragging }, drag] = useDrag({
      type: 'pinnedItem',
      item: { id: item.id, index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    const [, drop] = useDrop({
      accept: 'pinnedItem',
      hover: (draggedItem: { id: string; index: number }) => {
        if (!ref.current) return;
        const dragIndex = draggedItem.index;
        const hoverIndex = index;
        if (dragIndex === hoverIndex) return;
        reorderPinnedItems(dragIndex, hoverIndex);
        draggedItem.index = hoverIndex;
      },
    });

    drag(drop(ref));

    return (
      <div
        ref={ref}
        className={`relative ${isDragging ? 'opacity-50' : 'opacity-100'}`}
        onMouseEnter={(e) => {
          if (!isExpanded && hasChildren) {
            if (closeTimeout) {
              clearTimeout(closeTimeout);
              setCloseTimeout(null);
            }
            const rect = e.currentTarget.getBoundingClientRect();
            setHoveredItem(item.id);
            setFlyoutPosition({ top: rect.top });
          }
        }}
        onMouseLeave={() => {
          if (!isExpanded && hasChildren) {
            const timeout = setTimeout(() => {
              setHoveredItem(null);
              setFlyoutPosition(null);
            }, 300);
            setCloseTimeout(timeout);
          }
        }}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            {hasChildren ? (
              <button
                onClick={() => {
                  if (isExpanded) {
                    togglePinnedItem(item.id);
                  }
                }}
                className={`cursor-pointer w-full flex items-center py-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-lg transition-all border border-zinc-200 dark:border-zinc-700 ${
                  isExpanded ? "gap-3 px-4" : "justify-center"
                }`}
              >
                {Icon && <Icon size={20} className="text-zinc-600 dark:text-zinc-400" />}
                {isExpanded && (
                  <>
                    <span className="flex-1 text-sm">{item.title}</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${isDropdownExpanded ? "rotate-180" : ""}`}
                    />
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={(e) => handlePinnedItemClick(e, item)}
                className={`cursor-pointer w-full flex items-center py-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-lg transition-all border border-zinc-200 dark:border-zinc-700 ${
                  isExpanded ? "gap-3 px-4" : "justify-center"
                }`}
              >
                {Icon && <Icon size={20} className="text-zinc-600 dark:text-zinc-400" />}
                {isExpanded && <span className="flex-1 text-sm text-left">{item.title}</span>}
              </button>
            )}
          </TooltipTrigger>
          {!isExpanded && !hasChildren && (
            <TooltipContent
              side="right"
              className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white border-zinc-200 dark:border-zinc-700"
            >
              <p>{item.title}</p>
            </TooltipContent>
          )}
        </Tooltip>

        {/* Flyout menu for collapsed state with children */}
        {!isExpanded && hasChildren && isHovered && flyoutPosition && (
          <div
            className="fixed left-20 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-xl z-50 min-w-[200px]"
            style={{ top: flyoutPosition.top }}
            onMouseEnter={() => {
              if (closeTimeout) {
                clearTimeout(closeTimeout);
                setCloseTimeout(null);
              }
            }}
            onMouseLeave={() => {
              const timeout = setTimeout(() => {
                setHoveredItem(null);
                setFlyoutPosition(null);
              }, 300);
              setCloseTimeout(timeout);
            }}
          >
            <div className="py-1">
              {item.children!.map((child) => {
                const hasTertiaryOptions = child.tertiaryOptions && child.tertiaryOptions.length > 0;
                const childKey = `${item.id}-${child.id}`;
                const isChildExpanded = expandedChildren === childKey;
                const ChildIcon = getIconComponent(child.icon);

                return (
                  <div key={child.id}>
                    {hasTertiaryOptions ? (
                      <>
                        <button
                          onClick={() => toggleChildren(childKey)}
                          className="w-full flex items-center gap-2 py-2 px-3 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                          {ChildIcon && <ChildIcon size={16} />}
                          <span className="flex-1 text-left">{child.title}</span>
                          <ChevronRight
                            size={14}
                            className={`transition-transform ${isChildExpanded ? "rotate-90" : ""}`}
                          />
                        </button>

                        {isChildExpanded && (
                          <div className="ml-6 space-y-1 py-1 border-l-2 border-zinc-200 dark:border-zinc-700 pl-2">
                            {child.tertiaryOptions!.map((tertiary) => (
                              <NavLink
                                key={tertiary.id}
                                to={tertiary.path || "#"}
                                className="block py-1.5 px-2 text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors"
                                onClick={() => {
                                  setHoveredItem(null);
                                  setFlyoutPosition(null);
                                }}
                              >
                                {tertiary.title}
                              </NavLink>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <NavLink
                        to={child.path || "#"}
                        className="flex items-center gap-2 py-2 px-3 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        onClick={() => {
                          setHoveredItem(null);
                          setFlyoutPosition(null);
                        }}
                      >
                        {ChildIcon && <ChildIcon size={16} />}
                        {child.title}
                      </NavLink>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Expanded dropdown for children */}
        {isExpanded && hasChildren && isDropdownExpanded && (
          <div className="mt-1 ml-4 space-y-1 pl-4 border-l-2 border-zinc-200 dark:border-zinc-700">
            {item.children!.map((child) => {
              const hasTertiaryOptions = child.tertiaryOptions && child.tertiaryOptions.length > 0;
              const childKey = `${item.id}-${child.id}`;
              const isChildExpanded = expandedChildren === childKey;
              const ChildIcon = getIconComponent(child.icon);

              return (
                <div key={child.id}>
                  {hasTertiaryOptions ? (
                    <button
                      onClick={() => toggleChildren(childKey)}
                      className="w-full flex items-center gap-2 py-2 px-3 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors"
                    >
                      {ChildIcon && <ChildIcon size={16} />}
                      <span className="flex-1 text-left">{child.title}</span>
                      <ChevronRight
                        size={14}
                        className={`transition-transform ${isChildExpanded ? "rotate-90" : ""}`}
                      />
                    </button>
                  ) : (
                    <NavLink
                      to={child.path || "#"}
                      className="flex items-center gap-2 py-2 px-3 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors"
                    >
                      {ChildIcon && <ChildIcon size={16} />}
                      {child.title}
                    </NavLink>
                  )}

                  {hasTertiaryOptions && isChildExpanded && (
                    <div className="mt-1 ml-4 space-y-1 pl-3 border-l border-zinc-200 dark:border-zinc-700">
                      {child.tertiaryOptions!.map((tertiary) => (
                        <NavLink
                          key={tertiary.id}
                          to={tertiary.path || "#"}
                          className="block py-1.5 px-2 text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors"
                        >
                          {tertiary.title}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
    <DndProvider backend={HTML5Backend}>
      <aside
        className={`bg-white dark:bg-zinc-900 border-r border-[#0d9488] dark:border-[#50e080] flex flex-col transition-all duration-300 ${
          isExpanded ? "w-64" : "w-20"
        }`}
      >
      {/* Logo Section */}
      <div
        className={`p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-center cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors ${!isExpanded && "px-2"}`}
        onClick={() => navigate("/app/home")}
      >
        {isExpanded ? (
          <div className="flex items-center justify-center w-full">
            <img src={logo} alt="OPTO Logo" className="h-12 w-auto max-w-full" />
          </div>
        ) : (
          <div className="flex justify-center w-full">
            <img src={logo} alt="OPTO Logo" className="h-8 w-auto max-w-full object-contain" />
          </div>
        )}
      </div>

      {/* Toggle Button */}
      <div className="p-4 flex justify-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onToggle}
              className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              {isExpanded ? (
                <PanelLeftClose size={20} />
              ) : (
                <PanelLeft size={20} />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white border-zinc-200 dark:border-zinc-700"
          >
            <p>{isExpanded ? "Collapse Sidebar" : "Expand Sidebar"}</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* AI Button */}
      <div className={`p-4 ${!isExpanded && "px-4"}`}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onAIClick}
              className={`w-full flex items-center py-3 bg-[#0d9488]/80 dark:bg-[#50e080]/80 hover:bg-[#0d9488] dark:hover:bg-[#50e080] text-white rounded-lg transition-all shadow-lg shadow-[#0d9488]/30 dark:shadow-[#50e080]/30 hover:shadow-[#0d9488]/50 dark:hover:shadow-[#50e080]/50 border border-[#0d9488] dark:border-[#50e080] ${
                isExpanded ? "gap-3 px-4" : "justify-center"
              }`}
            >
              <Sparkles size={20} className="text-white" />
              {isExpanded && (
                <>
                  <span className="flex-1 font-medium">Ask OPTO</span>
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                </>
              )}
            </button>
          </TooltipTrigger>
          {!isExpanded && (
            <TooltipContent
              side="right"
              className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white border-zinc-200 dark:border-zinc-700"
            >
              <p>Ask OPTO</p>
            </TooltipContent>
          )}
        </Tooltip>
      </div>

      {/* Navigation Button - Separate */}
      <div className={`px-4 pb-4 border-b border-zinc-200 dark:border-zinc-800 ${!isExpanded && "px-4"}`}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => navigate("/app/navigation")}
              className={`w-full flex items-center py-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-lg transition-all border border-zinc-200 dark:border-zinc-700 ${
                isExpanded ? "gap-3 px-4" : "justify-center"
              }`}
            >
              {isExpanded ? (
                <>
                  <Compass size={20} className="text-zinc-600 dark:text-zinc-400" />
                  <span className="flex-1 text-sm">Navigation</span>
                </>
              ) : (
                <Compass size={20} className="text-zinc-600 dark:text-zinc-400" />
              )}
            </button>
          </TooltipTrigger>
          {!isExpanded && (
            <TooltipContent
              side="right"
              className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white border-zinc-200 dark:border-zinc-700"
            >
              <p>Navigation</p>
            </TooltipContent>
          )}
        </Tooltip>
      </div>

      {/* Pinned Section */}
      <nav className={`flex-1 p-4 space-y-2 ${!isExpanded && "px-4"} overflow-y-auto`}>
        {isExpanded && pinnedItems.length > 0 && (
          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-500 uppercase tracking-wide px-2 mb-2">
            Pinned
          </p>
        )}
        {pinnedItems.map((item, index) => (
          <DraggablePinnedItem key={item.id} item={item} index={index} />
        ))}
        
        {pinnedItems.length === 0 && isExpanded && (
          <div className="text-center py-8 px-2">
            <p className="text-xs text-zinc-500 dark:text-zinc-500">
              No pinned items yet. Visit Navigation to pin your favorites.
            </p>
          </div>
        )}
      </nav>

      {/* Bottom Section - Workstation, Notifications, and User */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 p-4 space-y-2">
        {/* Workstation Section */}
        <div>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onWorkstationsClick}
                className={`flex items-center rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 ${
                  assignedWorkstation 
                    ? "border-[#0d9488] dark:border-[#50e080] hover:border-[#0f766e] dark:hover:border-[#3bc76a]" 
                    : "hover:border-zinc-300 dark:hover:border-zinc-600"
                } transition-all cursor-pointer ${
                  isExpanded
                    ? "w-full gap-3 px-4 py-3"
                    : "w-10 h-10 justify-center mx-auto"
                }`}
              >
                {isExpanded ? (
                  <>
                    <Monitor size={20} className={assignedWorkstation ? "text-[#0d9488] dark:text-[#50e080]" : "text-zinc-600 dark:text-zinc-400"} />
                    <div className="flex-1 min-w-0 text-left">
                      {assignedWorkstation ? (
                        <>
                          <p className="text-zinc-900 dark:text-white text-sm font-medium truncate">
                            {assignedWorkstation}
                          </p>
                          <p className="text-zinc-500 dark:text-zinc-400 text-xs truncate">
                            Workstation
                          </p>
                        </>
                      ) : (
                        <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                          Select Workstation
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <Monitor size={20} className={assignedWorkstation ? "text-[#0d9488] dark:text-[#50e080]" : "text-zinc-600 dark:text-zinc-400"} />
                )}
              </button>
            </TooltipTrigger>
            {!isExpanded && (
              <TooltipContent
                side="right"
                className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white border-zinc-200 dark:border-zinc-700"
              >
                <p>{assignedWorkstation || "Select Workstation"}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </div>

        {/* Notifications Section */}
        <div>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onNotificationsClick}
                className={`flex items-center rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all cursor-pointer relative ${
                  isExpanded
                    ? "w-full gap-3 px-4 py-3"
                    : "w-10 h-10 justify-center mx-auto"
                }`}
              >
                {isExpanded ? (
                  <>
                    <Bell size={20} className="text-zinc-600 dark:text-zinc-400" />
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-zinc-900 dark:text-white text-sm font-medium">
                        Notifications
                      </p>
                      <p className="text-zinc-500 dark:text-zinc-400 text-xs">
                        {unreadNotificationsCount > 0 ? `${unreadNotificationsCount} unread` : "No unread"}
                      </p>
                    </div>
                    {unreadNotificationsCount > 0 && (
                      <span className="px-2 py-0.5 bg-[#0d9488]/80 dark:bg-[#50e080]/80 text-white text-xs font-medium rounded-full">
                        {unreadNotificationsCount}
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <Bell size={20} className="text-zinc-600 dark:text-zinc-400" />
                    {unreadNotificationsCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#0d9488]/80 dark:bg-[#50e080]/80 text-white text-xs font-medium rounded-full flex items-center justify-center">
                        {unreadNotificationsCount}
                      </span>
                    )}
                  </>
                )}
              </button>
            </TooltipTrigger>
            {!isExpanded && (
              <TooltipContent
                side="right"
                className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white border-zinc-200 dark:border-zinc-700"
              >
                <p>Notifications {unreadNotificationsCount > 0 && `(${unreadNotificationsCount})`}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </div>

        {/* User Section */}
        <div className="relative">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={`flex items-center rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all cursor-pointer ${
                  isExpanded
                    ? "w-full gap-3 px-4 py-3"
                    : "w-10 h-10 justify-center mx-auto"
                }`}
              >
                {isExpanded ? (
                  <>
                    <UserCircle size={20} className="text-zinc-600 dark:text-zinc-400" />
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-zinc-900 dark:text-white text-sm font-medium truncate">
                        {user?.username || "Guest"}
                      </p>
                      <p className="text-zinc-500 dark:text-zinc-400 text-xs truncate capitalize">
                        {user?.role || "User"}
                      </p>
                    </div>
                    <ChevronDown size={16} className={`text-zinc-600 dark:text-zinc-400 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                  </>
                ) : (
                  <UserCircle size={20} className="text-zinc-600 dark:text-zinc-400" />
                )}
              </button>
            </TooltipTrigger>
            {!isExpanded && (
              <TooltipContent
                side="right"
                className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white border-zinc-200 dark:border-zinc-700"
              >
                <p>{user?.username || "Guest"}</p>
              </TooltipContent>
            )}
          </Tooltip>

          {/* User Menu Dropdown */}
          {userMenuOpen && isExpanded && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-xl py-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
              <button
                onClick={onProfileClick}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
              >
                <UserCircle size={16} className="text-zinc-600 dark:text-zinc-400" />
                <span>Profile</span>
              </button>
              <button
                onClick={handleInactivityReason}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
              >
                <Clock size={16} className="text-zinc-600 dark:text-zinc-400" />
                <span>Inactivity Reason</span>
              </button>
              <div className="my-1 border-t border-zinc-200 dark:border-zinc-700" />
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
          
          {/* User Menu Dropdown - Collapsed Mode */}
          {userMenuOpen && !isExpanded && (
            <div className="absolute bottom-0 left-full ml-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-xl py-2 z-50 animate-in fade-in slide-in-from-left-2 duration-150 min-w-[200px]">
              <button
                onClick={onProfileClick}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
              >
                <UserCircle size={16} className="text-zinc-600 dark:text-zinc-400" />
                <span>Profile</span>
              </button>
              <button
                onClick={handleInactivityReason}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
              >
                <Clock size={16} className="text-zinc-600 dark:text-zinc-400" />
                <span>Inactivity Reason</span>
              </button>
              <div className="my-1 border-t border-zinc-200 dark:border-zinc-700" />
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
    </DndProvider>

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
                onWorkstationsClick();
              }}
              className="flex-1 px-4 py-3 bg-[#0d9488] dark:bg-[#50e080] hover:bg-[#0b7a70] dark:hover:bg-[#3bc76a] text-white rounded-lg font-medium transition-colors"
            >
              Yes, Register Now
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}