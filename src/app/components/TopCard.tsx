import * as React from "react";
import { Star, ChevronDown, ChevronUp } from "lucide-react";
import { useVersionTheme } from "../contexts/VersionThemeContext";

export type TopCardType = "clickable" | "info" | "status" | "kpi" | "selectable";
export type TopCardLayout = "standard" | "compact" | "stacked";
export type TopCardStatus = "neutral" | "primary" | "success" | "warning" | "error" | "info";

export interface TopCardProps {
  type?: TopCardType;
  layout?: TopCardLayout;
  status?: TopCardStatus;
  label: React.ReactNode;
  value: React.ReactNode;
  subText?: React.ReactNode;
  icon?: React.ReactNode;
  isSelected?: boolean;
  isDimmed?: boolean;
  isLive?: boolean;
  isBookmarked?: boolean;
  onBookmarkToggle?: (e: React.MouseEvent) => void;
  onClick?: () => void;
  isExpanded?: boolean;
  badge?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

const statusTextColors: Record<TopCardStatus, string> = {
  neutral: "text-[var(--foreground)]",
  primary: "text-[var(--primary)]",
  success: "text-[var(--state-success)]",
  warning: "text-[var(--state-warning)]",
  error:   "text-[var(--state-error)]",
  info:    "text-[var(--state-info)]",
};

const statusIconBgColors: Record<TopCardStatus, string> = {
  neutral: "bg-[var(--surface-container-high)] text-[var(--foreground)]",
  primary: "bg-[var(--primary)]/10 text-[var(--primary)]",
  success: "bg-[var(--state-success-container)] text-[var(--state-on-success-container)]",
  warning: "bg-[var(--state-warning-container)] text-[var(--state-warning)]",
  error:   "bg-[var(--state-error-container)] text-[var(--state-error)]",
  info:    "bg-[var(--state-info-container)] text-[var(--state-info)]",
};

const statusSelectedBorders: Record<TopCardStatus, string> = {
  neutral: "border-[var(--primary)] bg-[var(--surface-container-high)]",
  primary: "border-[var(--primary)] bg-[var(--primary)]/10",
  success: "border-[var(--state-success)] bg-[var(--state-success-container)]/30",
  warning: "border-[var(--state-warning)] bg-[var(--state-warning-container)]/30",
  error:   "border-[var(--state-error)] bg-[var(--state-error-container)]/30",
  info:    "border-[var(--state-info)] bg-[var(--state-info-container)]/30",
};

const statusHoverBorders: Record<TopCardStatus, string> = {
  neutral: "hover:border-[var(--primary)]",
  primary: "hover:border-[var(--primary)]",
  success: "hover:border-[var(--state-success)]",
  warning: "hover:border-[var(--state-warning)]",
  error:   "hover:border-[var(--state-error)]",
  info:    "hover:border-[var(--state-info)]",
};

export function TopCard({
  type = "info",
  layout = "standard",
  status = "neutral",
  label,
  value,
  subText,
  icon,
  isSelected = false,
  isDimmed = false,
  isLive = false,
  isBookmarked,
  onBookmarkToggle,
  onClick,
  isExpanded,
  badge,
  className = "",
  children,
}: TopCardProps) {
  const { version } = useVersionTheme();
  const isV6 = version === "Master Blue V6";

  const isClickable = type === "clickable" || type === "selectable" || typeof onClick === "function";

  const v6GlowColor = status === "neutral" || status === "primary" ? "var(--primary)" : `var(--state-${status})`;
  
  const v6HoverGlow = isV6
    ? "hover:shadow-[0_0_15px_color-mix(in_srgb,var(--primary)_30%,transparent)] hover:border-transparent dark:hover:border-transparent"
    : "";

  // ── KPI CARD ─────────────────────────────────────────────────────────────
  if (type === "kpi") {
    const kpiBase = [
      "w-full rounded-xl border bg-[var(--card)] text-[var(--foreground)] overflow-hidden relative transition-all duration-200",
      isV6 ? v6HoverGlow : "hover:scale-[1.02]",
      isDimmed ? "opacity-60 hover:opacity-100" : "",
      isClickable ? "cursor-pointer" : "",
      className,
    ].filter(Boolean).join(" ");

    const inner = (
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          {icon && (
            <div className={`w-6 h-6 rounded-md flex items-center justify-center ${statusIconBgColors[status]}`}>
              {icon}
            </div>
          )}
          <div className={`text-xs font-bold uppercase tracking-wide flex-1 ${icon ? "ml-2" : ""} ${statusTextColors[status]}`}>
            {label}
          </div>
          <div className="flex items-center gap-1.5">
            {typeof isBookmarked === "boolean" && onBookmarkToggle && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onBookmarkToggle(e); }}
                className="p-1 rounded transition-colors text-[var(--muted-foreground)] hover:text-[var(--primary)]"
                aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
              >
                <Star size={14} className={isBookmarked ? "fill-[var(--primary)] text-[var(--primary)]" : ""} />
              </button>
            )}
            {isExpanded !== undefined && (
              isExpanded
                ? <ChevronUp className={statusTextColors[status]} size={16} />
                : <ChevronDown className={statusTextColors[status]} size={16} />
            )}
          </div>
        </div>
        <div className={`text-3xl font-bold text-center ${statusTextColors[status]}`}>
          {value}
        </div>
        {children && <div className="mt-2">{children}</div>}
      </div>
    );

    return isClickable
      ? <button type="button" onClick={onClick} className={kpiBase} aria-expanded={isExpanded}>{inner}</button>
      : <div className={kpiBase}>{inner}</div>;
  }

  // ── SELECTABLE CARD ───────────────────────────────────────────────────────
  if (type === "selectable") {
    const selectableBase = [
      "relative w-full rounded-xl border text-left transition-all duration-200 overflow-hidden",
      "bg-[var(--surface-container)] text-[var(--foreground)]",
      isSelected
        ? `border-2 ${statusSelectedBorders[status]}`
        : `border-[var(--border)] ${isV6 ? v6HoverGlow : `${statusHoverBorders[status]} hover:scale-[1.01]`}`,
      isDimmed ? "opacity-60 hover:opacity-100" : "",
      "cursor-pointer",
      className,
    ].filter(Boolean).join(" ");

    return (
      <button type="button" onClick={onClick} className={selectableBase} aria-pressed={isSelected}>
        <div className="flex items-center justify-between p-4">
          {icon && (
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${statusIconBgColors[status]}`}>
              {icon}
            </div>
          )}
          <span className={`text-3xl font-bold ${statusTextColors[status]}`}>{value}</span>
        </div>
        <div className="px-4 pb-3">
          <h4 className="text-sm font-semibold text-[var(--foreground)]">{label}</h4>
          {subText && <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{subText}</p>}
        </div>
        {children}
      </button>
    );
  }

  // ── INFO / CLICKABLE / STATUS (original) ──────────────────────────────────
  const baseClasses = [
    "w-full",
    "rounded-xl",
    "text-left",
    "relative",
    "transition-all duration-150 ease-in-out",
    "border",
    isSelected
      ? `border-2 ${statusSelectedBorders[status]}`
      : "bg-[var(--surface-container)] border-[var(--border)] text-[var(--foreground)]",
    isDimmed ? "opacity-60 hover:opacity-100" : "opacity-100",
    isClickable
      ? `cursor-pointer hover:bg-[var(--surface-container-high)] hover:border-[var(--outline)] active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:border-[var(--primary)] ${isV6 ? v6HoverGlow : ""}`
      : "cursor-default",
    className,
  ].filter(Boolean).join(" ");

  const isCompact = layout === "compact";
  const isStacked = layout === "stacked";

  const cardContent = (
    <div className={`flex ${isStacked ? "flex-col gap-2 p-4" : isCompact ? "items-center gap-3 p-3" : "items-center gap-3.5 p-4"} h-full`}>
      {icon && (
        <div className={`${isCompact ? "w-8 h-8" : "w-10 h-10"} rounded-lg flex items-center justify-center flex-shrink-0 ${statusIconBgColors[status]}`}>
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className={`${isCompact ? "text-lg" : "text-2xl"} font-bold tracking-tight leading-tight ${status === "neutral" ? "text-[var(--foreground)]" : statusTextColors[status]}`}>
            {value}
          </span>
          {subText && (
            <span className="text-xs text-[var(--muted-foreground)] truncate">{subText}</span>
          )}
        </div>
        <p className="text-xs font-medium text-[var(--muted-foreground)] truncate mt-0.5">{label}</p>
      </div>
      {(isLive || badge || (typeof isBookmarked === "boolean" && onBookmarkToggle)) && (
        <div className="flex items-center gap-1.5 flex-shrink-0 self-start">
          {isLive && (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-[var(--state-success)] bg-[var(--state-success-container)] px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--state-success)] animate-pulse" />
              Live
            </span>
          )}
          {badge}
          {typeof isBookmarked === "boolean" && onBookmarkToggle && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onBookmarkToggle(e); }}
              className="p-1 rounded-md text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:bg-[var(--surface-container-high)] transition-colors"
              aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
            >
              <Star size={14} className={isBookmarked ? "fill-[var(--primary)] text-[var(--primary)]" : "text-[var(--muted-foreground)]"} />
            </button>
          )}
        </div>
      )}
      {children && <div className="w-full mt-2">{children}</div>}
    </div>
  );

  if (isClickable) {
    return (
      <button type="button" onClick={onClick} className={baseClasses} aria-pressed={isSelected}>
        {cardContent}
      </button>
    );
  }

  return <div className={baseClasses}>{cardContent}</div>;
}

export default TopCard;
