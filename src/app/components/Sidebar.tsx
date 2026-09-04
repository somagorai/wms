import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
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
 PackageSearch,
} from "lucide-react";
import { useLayout } from "../contexts/LayoutContext";
import { useAuth } from "../contexts/AuthContext";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import logo from "figma:asset/0cbf7aa367bef87c8bd0f1fedc1e56dd4afd0a48.png";
import { GearArrowIcon } from "./icons/GearArrowIcon";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import type { PinnedItem } from "../contexts/LayoutContext";

// ─── PinnedItem component lives outside Sidebar to keep a stable reference ───
interface PinnedItemProps {
 item: PinnedItem;
 index: number;
 isExpanded: boolean;
 expandedPinned: string | null;
 expandedChildren: string | null;
 hoveredItem: string | null;
 flyoutPosition: { top: number } | null;
 closeTimeout: NodeJS.Timeout | null;
 assignedWorkstation: string | null;
 getIconComponent: (name?: string) => any;
 onToggle: () => void;
 togglePinnedItem: (id: string) => void;
 toggleChildren: (id: string) => void;
 setHoveredItem: (id: string | null) => void;
 setFlyoutPosition: (pos: { top: number } | null) => void;
 setCloseTimeout: (t: NodeJS.Timeout | null) => void;
 setShowWorkstationWarning: (v: boolean) => void;
 setPendingPath: (path: string | null) => void;
 reorderPinnedItems: (from: number, to: number) => void;
}

function PinnedItemRow({
 item, index, isExpanded, expandedPinned, expandedChildren,
 hoveredItem, flyoutPosition, closeTimeout, assignedWorkstation,
 getIconComponent, onToggle, togglePinnedItem, toggleChildren,
 setHoveredItem, setFlyoutPosition, setCloseTimeout,
 setShowWorkstationWarning, setPendingPath, reorderPinnedItems,
}: PinnedItemProps) {
 const navigate = useNavigate();
 const location = useLocation();
 const ref = useRef<HTMLDivElement>(null);
 const Icon = getIconComponent(item.icon);
 const hasChildren = !!(item.children && item.children.length > 0);
 const isDropdownExpanded = expandedPinned === item.id;
 const isHovered = hoveredItem === item.id;

 const isWorkstationOperationsItem = item.id === "workstation" || item.id === "workstation-operations" || item.title === "Workstation Operations";
 const isOperationsItem = item.id === "operations" || item.title === "Operations";

 const isWorkstationChild = (childId: string) => childId.startsWith("workstation-");

 // Determine if this item or one of its routes is active
 const isItemActive = (() => {
  const pathname = location.pathname;
  const searchParams = new URLSearchParams(location.search);
  const section = searchParams.get("section");

  if (isWorkstationOperationsItem) {
   if (pathname === "/app/navigation" && section === "workstation") return true;
   return [
    "/app/pick", "/app/replenishment", "/app/cycle-count", 
    "/app/inspection", "/app/dewrap", "/app/delayer", 
    "/app/mhe-control-panel", "/app/asset-operations", 
    "/app/mpc-operations"
   ].some(p => pathname === p || pathname.startsWith(p));
  }
  if (isOperationsItem) {
    if (pathname === "/app/navigation" && section === "operations") return true;
    return [
     "/app/items", "/app/storage-locations", "/app/containers", 
     "/app/logs", "/app/lane-management", "/app/worklist"
    ].some(p => pathname === p || pathname.startsWith(p));
   }
  if (item.path) {
   if (pathname === item.path) return true;
   if (item.path !== "/app/home" && item.path !== "/app/navigation" && pathname.startsWith(item.path)) return true;
  }
  if (item.children && item.children.length > 0) {
   return item.children.some(child => {
    if (!child.path) return false;
    return pathname === child.path || (child.path !== "/app/home" && pathname.startsWith(child.path));
   });
  }
  return false;
 })();

 const handleChildNav = (e: React.MouseEvent, childId: string, path?: string) => {
  if (isWorkstationChild(childId) && !assignedWorkstation) {
   e.preventDefault();
   setPendingPath(path ?? null);
   setShowWorkstationWarning(true);
   return;
  }
  if (path) {
   e.preventDefault();
   setHoveredItem(null);
   setFlyoutPosition(null);
   navigate(path);
  }
 };

 const [{ isDragging }, drag] = useDrag({
  type: "pinnedItem",
  item: { id: item.id, index },
  collect: (monitor) => ({ isDragging: monitor.isDragging() }),
 });
 const [, drop] = useDrop({
  accept: "pinnedItem",
  hover: (dragged: { id: string; index: number }) => {
   if (!ref.current || dragged.index === index) return;
   reorderPinnedItems(dragged.index, index);
   dragged.index = index;
  },
 });
 drag(drop(ref));

 return (
  <div
   ref={ref}
   className={`relative ${isDragging ? "opacity-50" : "opacity-100"}`}
   onMouseEnter={(e) => {
    if (!isExpanded && hasChildren) {
     if (closeTimeout) { clearTimeout(closeTimeout); setCloseTimeout(null); }
     setHoveredItem(item.id);
     setFlyoutPosition({ top: e.currentTarget.getBoundingClientRect().top });
    }
   }}
   onMouseLeave={() => {
    if (!isExpanded && hasChildren) {
     setCloseTimeout(setTimeout(() => { setHoveredItem(null); setFlyoutPosition(null); }, 300));
    }
   }}
  >
   <Tooltip>
    <TooltipTrigger asChild>
     {hasChildren ? (
        <button
          onClick={(e) => {
          if (isWorkstationOperationsItem) {
            e.preventDefault();
            e.stopPropagation();
            navigate("/app/navigation?section=workstation");
          } else if (isOperationsItem) {
            e.preventDefault();
            e.stopPropagation();
            navigate("/app/navigation?section=operations");
          } else {
            if (!isExpanded) onToggle();
            togglePinnedItem(item.id);
          }
        }}
        className={`cursor-pointer w-full flex items-center py-2.5 rounded-xl transition-all ${
          isExpanded ? "gap-3 px-3.5" : "justify-center px-2"
        } ${
          isItemActive
            ? "border-2 border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)] font-semibold shadow-xs"
            : "border-2 border-transparent bg-transparent hover:bg-[var(--surface-container-high)] text-[var(--foreground)]"
        }`}
      >
        {Icon && (
          <Icon
            size={20}
            className={isItemActive ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]"}
          />
        )}
        {isExpanded && (
          <>
            <span className="flex-1 text-sm text-left">{item.title}</span>
            <ChevronDown 
              size={16} 
              onClick={(e) => {
                e.stopPropagation();
                togglePinnedItem(item.id);
              }}
              className={`transition-transform hover:opacity-80 ${isDropdownExpanded ? "rotate-180" : ""} ${isItemActive ? "text-[var(--primary)]" : ""}`} 
            />
          </>
        )}
      </button>
    ) : (
      <button
        onClick={() => {
          if (isWorkstationOperationsItem) {
            navigate("/app/navigation?section=workstation");
          } else if (isOperationsItem) {
            navigate("/app/navigation?section=operations");
          } else if (isWorkstationChild(item.id) && !assignedWorkstation) {
            setPendingPath(item.path ?? null);
            setShowWorkstationWarning(true);
          } else if (item.path) {
            navigate(item.path);
          }
        }}
        className={`cursor-pointer w-full flex items-center py-2.5 rounded-xl transition-all ${
          isExpanded ? "gap-3 px-3.5" : "justify-center px-2"
        } ${
          isItemActive
            ? "border-2 border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)] font-semibold shadow-xs"
            : "border-2 border-transparent bg-transparent hover:bg-[var(--surface-container-high)] text-[var(--foreground)]"
        }`}
      >
        {Icon && (
          <Icon
            size={20}
            className={isItemActive ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]"}
          />
        )}
        {isExpanded && <span className="flex-1 text-sm text-left">{item.title}</span>}
      </button>
    )}
  </TooltipTrigger>
  {!isExpanded && !hasChildren && (
    <TooltipContent side="right" className="bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)]">
      <p>{item.title}</p>
    </TooltipContent>
  )}
</Tooltip>

{/* Flyout for collapsed sidebar */}
{!isExpanded && hasChildren && isHovered && flyoutPosition && (
  <div
    className="fixed left-20 bg-[var(--surface-container-low)] text-[var(--foreground)] border border-[var(--border)] rounded-xl z-50 min-w-[220px] shadow-2xl overflow-hidden"
    style={{ top: flyoutPosition.top }}
    onMouseEnter={() => { if (closeTimeout) { clearTimeout(closeTimeout); setCloseTimeout(null); } }}
    onMouseLeave={() => setCloseTimeout(setTimeout(() => { setHoveredItem(null); setFlyoutPosition(null); }, 300))}
  >
    <button
      onClick={() => {
        setHoveredItem(null);
        setFlyoutPosition(null);
        if (isWorkstationOperationsItem) {
          navigate("/app/navigation?section=workstation");
        } else if (isOperationsItem) {
          navigate("/app/navigation?section=operations");
        } else {
          navigate(`/app/navigation?section=${item.id}`);
        }
      }}
      className="w-full flex items-center justify-between px-3.5 py-2.5 bg-[var(--surface-container)] text-xs font-bold text-[var(--foreground)] border-b border-[var(--border)] hover:bg-[var(--surface-container-high)] hover:text-[var(--primary)] transition-colors cursor-pointer"
    >
      <span>{assignedWorkstation && isWorkstationOperationsItem ? assignedWorkstation : item.title}</span>
      <ChevronRight size={14} className="text-[var(--muted-foreground)]" />
    </button>
    <div className="py-1">
      {item.children!.map((child) => {
       const hasTertiary = !!(child.tertiaryOptions && child.tertiaryOptions.length > 0);
       const childKey = `${item.id}-${child.id}`;
       const isChildExp = expandedChildren === childKey;
       const ChildIcon = getIconComponent(child.icon);
       const isChildActive = child.path ? location.pathname === child.path || (child.path !== "/app/home" && location.pathname.startsWith(child.path)) : false;

       return (
        <div key={child.id}>
         {hasTertiary ? (
          <>
           <button
            onClick={() => toggleChildren(childKey)}
            className="w-full flex items-center gap-2 py-2 px-3 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--surface-container-high)] transition-colors cursor-pointer"
           >
            {ChildIcon && <ChildIcon size={16} />}
            <span className="flex-1 text-left">{child.title}</span>
            <ChevronRight size={14} className={`transition-transform ${isChildExp ? "rotate-90" : ""}`} />
           </button>
           {isChildExp && (
            <div className="ml-6 space-y-0.5 py-1 border-l-2 border-[var(--border)] pl-2">
             {child.tertiaryOptions!.map((t) => {
              const isTertiaryActive = t.path ? location.pathname === t.path : false;
              return (
               <button
                key={t.id}
                onClick={(e) => handleChildNav(e, child.id, t.path)}
                className={`w-full text-left block py-1.5 px-2 text-xs rounded transition-colors cursor-pointer ${
                 isTertiaryActive
                  ? "border border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)] font-semibold"
                  : "border border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--surface-container-high)]"
                }`}
               >
                {t.title}
               </button>
              );
             })}
            </div>
           )}
          </>
         ) : (
          <button
           onClick={(e) => handleChildNav(e, child.id, child.path)}
           className={`w-full text-left flex items-center gap-2 py-2 px-3 text-sm rounded transition-colors cursor-pointer ${
            isChildActive
             ? "bg-[var(--primary)] text-[var(--primary-foreground)] font-medium"
             : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--surface-container-high)]"
           }`}
          >
           {ChildIcon && <ChildIcon size={16} className={isChildActive ? "text-[var(--primary-foreground)]" : "text-[var(--muted-foreground)]"} />}
           <span className="flex-1 text-left">{child.title}</span>
          </button>
         )}
        </div>
       );
      })}
     </div>
    </div>
   )}

   {/* Expanded inline dropdown */}
   {isExpanded && hasChildren && isDropdownExpanded && (
    <div className="mt-1 ml-4 space-y-1 pl-4 border-l-2 border-[var(--border)]">
     {item.children!.map((child) => {
      const hasTertiary = !!(child.tertiaryOptions && child.tertiaryOptions.length > 0);
      const childKey = `${item.id}-${child.id}`;
      const isChildExp = expandedChildren === childKey;
      const ChildIcon = getIconComponent(child.icon);
      const isChildActive = child.path ? location.pathname === child.path || (child.path !== "/app/home" && location.pathname.startsWith(child.path)) : false;

      return (
       <div key={child.id}>
        {hasTertiary ? (
         <button
          onClick={() => toggleChildren(childKey)}
          className="w-full flex items-center gap-2 py-2 px-3 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--surface-container-high)] rounded transition-colors cursor-pointer"
         >
          {ChildIcon && <ChildIcon size={16} />}
          <span className="flex-1 text-left">{child.title}</span>
          <ChevronRight size={14} className={`transition-transform ${isChildExp ? "rotate-90" : ""}`} />
         </button>
        ) : (
         <button
          onClick={(e) => handleChildNav(e, child.id, child.path)}
          className={`w-full text-left flex items-center gap-2 py-2 px-3 text-sm rounded transition-colors cursor-pointer ${
           isChildActive
            ? "bg-[var(--primary)] text-[var(--primary-foreground)] font-medium shadow-xs"
            : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--surface-container-high)]"
          }`}
         >
          {ChildIcon && <ChildIcon size={16} className={isChildActive ? "text-[var(--primary-foreground)]" : "text-[var(--muted-foreground)]"} />}
          <span className="flex-1 text-left">{child.title}</span>
         </button>
        )}
        {hasTertiary && isChildExp && (
         <div className="mt-1 ml-4 space-y-1 pl-3 border-l border-[var(--border)]">
          {child.tertiaryOptions!.map((t) => {
           const isTertiaryActive = t.path ? location.pathname === t.path : false;
           return (
            <button
             key={t.id}
             onClick={(e) => handleChildNav(e, child.id, t.path)}
             className={`w-full text-left block py-1.5 px-2 text-xs rounded transition-colors cursor-pointer ${
              isTertiaryActive
               ? "bg-[var(--primary)] text-[var(--primary-foreground)] font-medium"
               : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--surface-container-high)]"
             }`}
            >
             {t.title}
            </button>
           );
          })}
         </div>
        )}
       </div>
      );
     })}
    </div>
   )}
  </div>
 );
}

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
 const [pendingPath, setPendingPath] = useState<string | null>(null);
 const [expandedPinned, setExpandedPinned] = useState<string | null>(null);
 const [expandedChildren, setExpandedChildren] = useState<string | null>(null);
 const [hoveredItem, setHoveredItem] = useState<string | null>(null);
 const [flyoutPosition, setFlyoutPosition] = useState<{ top: number } | null>(null);
 const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);

 // Once a workstation is assigned, navigate to the page the user originally tried to open
 useEffect(() => {
 if (assignedWorkstation && pendingPath) {
 navigate(pendingPath);
 setPendingPath(null);
 }
 }, [assignedWorkstation, pendingPath, navigate]);

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
 PackageSearch,
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

 const isNavActive = location.pathname === "/app/navigation" && new URLSearchParams(location.search).get("section") !== "workstation" && new URLSearchParams(location.search).get("section") !== "operations";

 // Props object for PinnedItemRow — keeps the inline map concise
 const pinnedItemProps = {
 isExpanded, expandedPinned, expandedChildren,
 hoveredItem, flyoutPosition, closeTimeout, assignedWorkstation,
 getIconComponent, onToggle, togglePinnedItem, toggleChildren,
 setHoveredItem, setFlyoutPosition, setCloseTimeout,
 setShowWorkstationWarning, setPendingPath, reorderPinnedItems,
 };


 return (
 <>
 <DndProvider backend={HTML5Backend}>
 <aside
 className={`bg-[var(--surface-container-low)] border-r border-[var(--border)] flex flex-col transition-all duration-300 ${
 isExpanded ? "w-64" : "w-20"
 }`}
 >
 {/* Logo Section */}
 <div
 className={`p-6 flex items-center justify-center cursor-pointer hover:bg-[var(--surface-container-high)]/40 transition-colors ${!isExpanded && "px-2"}`}
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
 <div className="p-3 flex justify-center">
 <Tooltip>
 <TooltipTrigger asChild>
 <button
 onClick={onToggle}
 className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
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
 className="bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)]"
 >
 <p>{isExpanded ? "Collapse Sidebar" : "Expand Sidebar"}</p>
 </TooltipContent>
 </Tooltip>
 </div>

          {/* AI Button - Ask OPTO (Primary Filled) */}
          <div className={`px-4 py-2 ${!isExpanded && "px-4"}`}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onAIClick}
                  className={`w-full flex items-center py-3 bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 active:scale-[0.98] rounded-xl transition-all duration-150 shadow-xs cursor-pointer ${
                    isExpanded ? "gap-3 px-4" : "justify-center"
                  }`}
                >
                  <Sparkles size={20} className="text-[var(--primary-foreground)]" />
                  {isExpanded && (
                    <span className="flex-1 font-medium text-sm text-left">Ask OPTO</span>
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)]"
              >
                <p>Ask OPTO</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Navigation Button - Clean, Primary Outlined with Active Highlight */}
          <div className={`px-4 py-2 ${!isExpanded && "px-4"}`}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => navigate("/app/navigation")}
                  className={`w-full flex items-center py-2.5 rounded-xl transition-all duration-150 cursor-pointer ${
                    isExpanded ? "gap-3 px-3.5" : "justify-center px-2"
                  } ${
                    isNavActive
                      ? "border-2 border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)] font-semibold shadow-xs"
                      : "border-2 border-transparent bg-transparent hover:bg-[var(--surface-container-high)] text-[var(--foreground)]"
                  }`}
                >
                  <Compass size={20} className={isNavActive ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]"} />
                  {isExpanded && (
                    <span className="flex-1 text-sm text-left font-medium">Navigation</span>
                  )}
                </button>
              </TooltipTrigger>
              {!isExpanded && (
                <TooltipContent
                  side="right"
                  className="bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)]"
                >
                  <p>Navigation</p>
                </TooltipContent>
              )}
            </Tooltip>
          </div>

 {/* Pinned Section */}
 <nav className={`flex-1 px-4 py-2 space-y-1.5 ${!isExpanded && "px-4"} overflow-y-auto`}>
 {isExpanded && pinnedItems.length > 0 && (
 <p className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wide px-2 mb-2">
 Pinned
 </p>
 )}
 {pinnedItems.map((item, index) => (
 <PinnedItemRow key={item.id} item={item} index={index} {...pinnedItemProps} />
 ))}
 
 {pinnedItems.length === 0 && isExpanded && (
 <div className="text-center py-8 px-2">
 <p className="text-xs text-[var(--muted-foreground)]">
 No pinned items yet. Visit Navigation to pin your favorites.
 </p>
 </div>
 )}
 </nav>

 {/* Bottom Section - Workstation, Notifications, and User (Borderless) */}
 <div className="p-4 space-y-1.5">
 {/* Workstation Section */}
 <div>
 <Tooltip>
 <TooltipTrigger asChild>
 <button
 onClick={() => navigate("/app/navigation?section=workstation")}
 className={`flex items-center rounded-xl bg-transparent hover:bg-[var(--surface-container-high)] transition-all duration-150 cursor-pointer ${
 assignedWorkstation 
 ? "text-[var(--primary)]" 
 : "text-[var(--foreground)]"
 } ${
 isExpanded
 ? "w-full gap-3 px-4 py-3"
 : "w-10 h-10 justify-center mx-auto"
 }`}
 >
 {isExpanded ? (
 <>
 <Monitor size={20} className={assignedWorkstation ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]"} />
 <div className="flex-1 min-w-0 text-left">
 {assignedWorkstation ? (
 <>
 <p className="text-[var(--foreground)] text-sm font-medium truncate">
 {assignedWorkstation}
 </p>
 <p className="text-[var(--muted-foreground)] text-xs truncate">
 Workstation
 </p>
 </>
 ) : (
 <p className="text-[var(--muted-foreground)] text-sm font-medium">
 Select Workstation
 </p>
 )}
 </div>
 </>
 ) : (
 <Monitor size={20} className={assignedWorkstation ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]"} />
 )}
 </button>
 </TooltipTrigger>
 {!isExpanded && (
 <TooltipContent
 side="right"
 className="bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)]"
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
 className={`flex items-center rounded-xl bg-transparent hover:bg-[var(--surface-container-high)] text-[var(--foreground)] transition-all duration-150 cursor-pointer relative ${
 isExpanded
 ? "w-full gap-3 px-4 py-3"
 : "w-10 h-10 justify-center mx-auto"
 }`}
 >
 {isExpanded ? (
 <>
 <Bell size={20} className="text-[var(--muted-foreground)]" />
 <div className="flex-1 min-w-0 text-left">
 <p className="text-[var(--foreground)] text-sm font-medium">
 Notifications
 </p>
 <p className="text-[var(--muted-foreground)] text-xs">
 {unreadNotificationsCount > 0 ? `${unreadNotificationsCount} unread` : "No unread"}
 </p>
 </div>
 {unreadNotificationsCount > 0 && (
 <span className="px-2 py-0.5 bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-medium rounded-full">
 {unreadNotificationsCount}
 </span>
 )}
 </>
 ) : (
 <>
 <Bell size={20} className="text-[var(--muted-foreground)]" />
 {unreadNotificationsCount > 0 && (
 <span className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-medium rounded-full flex items-center justify-center">
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
 className="bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)]"
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
 className={`flex items-center rounded-xl bg-transparent hover:bg-[var(--surface-container-high)] text-[var(--foreground)] transition-all duration-150 cursor-pointer ${
 isExpanded
 ? "w-full gap-3 px-4 py-3"
 : "w-10 h-10 justify-center mx-auto"
 }`}
 >
 {isExpanded ? (
 <>
 <UserCircle size={20} className="text-[var(--muted-foreground)]" />
 <div className="flex-1 min-w-0 text-left">
 <p className="text-[var(--foreground)] text-sm font-medium truncate">
 {user?.username || "Guest"}
 </p>
 <p className="text-[var(--muted-foreground)] text-xs truncate capitalize">
 {user?.role || "User"}
 </p>
 </div>
 <ChevronDown size={16} className={`text-[var(--muted-foreground)] transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
 </>
 ) : (
 <UserCircle size={20} className="text-[var(--muted-foreground)]" />
 )}
 </button>
 </TooltipTrigger>
 {!isExpanded && (
 <TooltipContent
 side="right"
 className="bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)]"
 >
 <p>{user?.username || "Guest"}</p>
 </TooltipContent>
 )}
 </Tooltip>

 {/* User Menu Dropdown */}
 {userMenuOpen && isExpanded && (
 <div className="absolute bottom-full left-0 right-0 mb-2 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] rounded-xl py-2 z-50 animate-in fade-in slide-in- duration-150 shadow-md">
 <button
 onClick={onProfileClick}
 className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--surface-container-high)] transition-colors cursor-pointer"
 >
 <UserCircle size={16} className="text-[var(--muted-foreground)]" />
 <span>Profile</span>
 </button>
 <button
 onClick={handleInactivityReason}
 className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--surface-container-high)] transition-colors cursor-pointer"
 >
 <Clock size={16} className="text-[var(--muted-foreground)]" />
 <span>Inactivity Reason</span>
 </button>
 <div className="my-1 border-t border-[var(--border)]" />
 <button
 onClick={logout}
 className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[var(--state-error)] hover:bg-[var(--surface-container-high)] transition-colors cursor-pointer"
 >
 <LogOut size={16} />
 <span>Logout</span>
 </button>
 </div>
 )}
 
 {/* User Menu Dropdown - Collapsed Mode */}
 {userMenuOpen && !isExpanded && (
 <div className="absolute bottom-0 left-full ml-2 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] rounded-xl py-2 z-50 animate-in fade-in slide-in- duration-150 min-w-[200px] shadow-md">
 <button
 onClick={onProfileClick}
 className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--surface-container-high)] transition-colors cursor-pointer"
 >
 <UserCircle size={16} className="text-[var(--muted-foreground)]" />
 <span>Profile</span>
 </button>
 <button
 onClick={handleInactivityReason}
 className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--surface-container-high)] transition-colors cursor-pointer"
 >
 <Clock size={16} className="text-[var(--muted-foreground)]" />
 <span>Inactivity Reason</span>
 </button>
 <div className="my-1 border-t border-[var(--border)]" />
 <button
 onClick={logout}
 className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[var(--state-error)] hover:bg-[var(--surface-container-high)] transition-colors cursor-pointer"
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
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] rounded-xl border border-[var(--border)]  p-8 max-w-md w-full mx-4 ">
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
 onWorkstationsClick();
 }}
 className="flex-1 px-4 py-3 bg-[var(--primary)]  hover:opacity-90 active:scale-[0.98] text-[var(--primary-foreground)] rounded-lg font-medium transition-colors"
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