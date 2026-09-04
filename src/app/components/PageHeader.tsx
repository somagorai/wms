import { useState, useRef, useEffect, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Home, ChevronRight, Filter, Bookmark, X } from "lucide-react";

export interface BreadcrumbItem {
 label: string;
 to?: string;
}

interface PageHeaderProps {
 /** Icon for the current page — e.g. <Package size={20} /> */
 icon: ReactNode;
 /** Label for the current page (shown large + bold) */
 title: string;
 /** Parent breadcrumb segments before the current page */
 breadcrumbs?: BreadcrumbItem[];
 /** Render a filter panel inline. If omitted, no filter button appears. */
 filterPanel?: ReactNode;
 /** Whether any filters are currently active */
 hasActiveFilters?: boolean;
 /** Count of active filters shown on button badge */
 activeFilterCount?: number;
 /** Tooltip content shown on hover when filters are active */
 filterSummary?: ReactNode;
 /** Called when bookmark icon is clicked */
 onSaveFilters?: () => void;
 /** Whether filters are currently saved/bookmarked */
 filtersSaved?: boolean;
 /** Extra action buttons to place on the right side of the header */
 actions?: ReactNode;
}

export function PageHeader({
 icon,
 title,
 breadcrumbs = [],
 filterPanel,
 hasActiveFilters = false,
 activeFilterCount,
 filterSummary,
 onSaveFilters,
 filtersSaved = false,
 actions,
}: PageHeaderProps) {
 const [showFilterPanel, setShowFilterPanel] = useState(false);
 const [showFilterTooltip, setShowFilterTooltip] = useState(false);
 const tooltipRef = useRef<HTMLDivElement>(null);

 // Close panel on outside click
 useEffect(() => {
 const handler = (e: MouseEvent) => {
 if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
 setShowFilterTooltip(false);
 }
 };
 document.addEventListener("mousedown", handler);
 return () => document.removeEventListener("mousedown", handler);
 }, []);

 const filterActive = showFilterPanel || hasActiveFilters;

 return (
 <div className="sticky top-0 z-40 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] border-b border-[var(--border)]  px-8 pt-6 pb-4">
 <div className="flex items-center justify-between gap-4">
 {/* Breadcrumb */}
 <nav className="flex items-center gap-2 text-sm min-w-0">
 <Link
 to="/app/home"
 className="text-[var(--muted-foreground)] hover:text-[var(--primary)] dark:hover:text-[var(--primary)] transition-colors flex items-center gap-1 shrink-0"
 >
 <Home size={14} />
 Home
 </Link>

 {breadcrumbs.map((crumb) => (
 <span key={crumb.label} className="flex items-center gap-2 shrink-0">
 <ChevronRight size={14} className="text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]" />
 {crumb.to ? (
 <Link
 to={crumb.to}
 className="text-[var(--muted-foreground)] hover:text-[var(--primary)] dark:hover:text-[var(--primary)] transition-colors"
 >
 {crumb.label}
 </Link>
 ) : (
 <span className="text-[var(--muted-foreground)]">{crumb.label}</span>
 )}
 </span>
 ))}

 <ChevronRight size={14} className="text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] shrink-0" />
 <span className="text-[var(--foreground)]  font-semibold text-lg flex items-center gap-2 truncate">
 <span className="text-[var(--primary)] dark:text-[var(--primary)] shrink-0">{icon}</span>
 {title}
 </span>
 </nav>

 {/* Right-side actions */}
 <div className="flex items-center gap-2 shrink-0">
 {actions}

 {filterPanel && (
 <div className="relative" ref={tooltipRef}>
 <button
 onClick={() => setShowFilterPanel((v) => !v)}
 onMouseEnter={() => setShowFilterTooltip(true)}
 onMouseLeave={() => setShowFilterTooltip(false)}
 className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 border text-sm font-medium ${
                  filterActive
                    ? "bg-[var(--primary)] hover:bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)]"
                    : "bg-[var(--surface-container-low)] dark:bg-[var(--surface-container)] hover:bg-[var(--surface-container-high)] text-[var(--foreground)] border-[var(--border)] "
                }`}
 >
 <Filter size={16} />
 Filter
 {hasActiveFilters && activeFilterCount != null && (
 <span className="px-1.5 py-0.5 bg-white/25 dark:bg-black/20 rounded text-xs font-bold">
 {activeFilterCount}
 </span>
 )}
 </button>

 {/* Hover tooltip when filters active */}
 {showFilterTooltip && hasActiveFilters && filterSummary && (
 <div className="absolute top-full right-0 mt-2 z-50 w-72 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] border border-[var(--border)]  rounded-xl p-4 animate-in fade-in slide-in- duration-150">
 <p className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wide mb-2">
 Active Filters
 </p>
 {filterSummary}
 </div>
 )}
 </div>
 )}

 {onSaveFilters && (
 <button
 onClick={onSaveFilters}
 title={filtersSaved ? "Filters saved" : "Save current filters"}
 className={`p-2 rounded-lg border transition-colors ${
 filtersSaved
 ? "text-[var(--primary)] dark:text-[var(--primary)] border-[var(--primary)] dark:border-[var(--primary)] bg-[var(--primary)]/10 /10"
 : "text-[var(--muted-foreground)] border-[var(--border)]  hover:border-[var(--border)] dark:hover:border-[var(--border)]"
 }`}
 >
 <Bookmark size={16} className={filtersSaved ? "fill-current" : ""} />
 </button>
 )}
 </div>
 </div>

 {/* Inline filter panel */}
 {showFilterPanel && filterPanel && (
 <div className="mt-4 pt-4 border-t border-[var(--border)] ">
 <div className="flex items-start justify-between gap-4">
 <div className="flex-1">{filterPanel}</div>
 <button
 onClick={() => setShowFilterPanel(false)}
 className="p-1.5 rounded-lg hover:bg-[var(--surface-container-high)] text-[var(--muted-foreground)] transition-colors shrink-0 mt-0.5"
 >
 <X size={16} />
 </button>
 </div>
 </div>
 )}
 </div>
 );
}
