import React from "react";
import { X, Info, Zap } from "lucide-react";

export type PanelStatusType = "success" | "warning" | "error" | "info" | "neutral" | "primary";

export interface PanelStatus {
  label: string;
  type?: PanelStatusType;
  dotColor?: string;
  textColor?: string;
}

export interface PanelTab {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  isAction?: boolean;
}

export interface DetailSidePanelProps {
  /** Title of the side panel (e.g. "R1020202", "WL-001", "Conductor Service") */
  title: React.ReactNode;
  /** Subtitle text (e.g. "Zone1", "Pick Work Item Details", "System Service") */
  subtitle?: React.ReactNode;
  /** Optional icon displayed inside the header square box */
  icon?: React.ReactNode;
  /** Current status rendered strictly inline next to the header title followed by • */
  status?: string | PanelStatus;

  /** Active selected tab ID */
  activeTab?: string;
  /** Tab change callback */
  onTabChange?: (tabId: string) => void;
  /** Tabs array. If omitted, defaults to Details and Actions tabs. Custom tabs can be inserted */
  tabs?: PanelTab[];
  /** Hide the tabs bar altogether if panel doesn't need tabs */
  hideTabs?: boolean;

  /** Close handler */
  onClose: () => void;

  /** Width class (default: "w-[600px] md:w-[700px]") */
  widthClass?: string;
  /** Additional class for container */
  className?: string;

  /** Children / content of the active panel body */
  children: React.ReactNode;
  /** Optional sticky footer (e.g. Save button / Apply changes) */
  footer?: React.ReactNode;
}

const statusDotColors: Record<PanelStatusType, string> = {
  success: "bg-[var(--state-success)]",
  warning: "bg-[var(--state-warning)]",
  error: "bg-[var(--state-error)]",
  info: "bg-[var(--state-info)]",
  primary: "bg-[var(--primary)]",
  neutral: "bg-[var(--muted-foreground)]",
};

const statusTextColors: Record<PanelStatusType, string> = {
  success: "text-[var(--state-success)]",
  warning: "text-[var(--state-warning)]",
  error: "text-[var(--state-error)]",
  info: "text-[var(--state-info)]",
  primary: "text-[var(--primary)]",
  neutral: "text-[var(--muted-foreground)]",
};

function resolveStatus(status?: string | PanelStatus): {
  label: string;
  dotClass: string;
  textClass: string;
} | null {
  if (!status) return null;
  if (typeof status === "string") {
    const s = status.trim().toLowerCase();
    let type: PanelStatusType = "neutral";
    if (
      s === "healthy" ||
      s === "operational" ||
      s === "connected" ||
      s === "online" ||
      s === "completed" ||
      s === "complete" ||
      s === "running" ||
      s === "available" ||
      s === "active" ||
      s === "ready" ||
      s === "empty"
    ) {
      type = "success";
    } else if (
      s === "occupied" ||
      s === "open" ||
      s === "released" ||
      s === "info" ||
      s === "in transit" ||
      s === "in_transit" ||
      s === "moving" ||
      s === "unallocated"
    ) {
      type = "info";
    } else if (
      s === "warning" ||
      s === "degraded" ||
      s === "reserved" ||
      s === "partial" ||
      s === "shorted" ||
      s === "queued" ||
      s === "held" ||
      s === "pending" ||
      s === "logout" ||
      s === "staged" ||
      s === "allocated" ||
      s === "inactive" ||
      s === "suspended"
    ) {
      type = "warning";
    } else if (
      s === "down" ||
      s === "error" ||
      s === "failed" ||
      s === "blocked" ||
      s === "locked" ||
      s === "cancelled" ||
      s === "critical" ||
      s === "full" ||
      s === "stopped" ||
      s === "service restart" ||
      s === "offline" ||
      s === "purged" ||
      s === "disconnected" ||
      s === "discontinued"
    ) {
      type = "error";
    } else if (
      s === "in progress" ||
      s === "in_progress" ||
      s === "processing" ||
      s === "started"
    ) {
      type = "primary";
    }
    return {
      label: status,
      dotClass: statusDotColors[type],
      textClass: statusTextColors[type],
    };
  }

  const type = status.type || "neutral";
  return {
    label: status.label,
    dotClass: status.dotColor || statusDotColors[type],
    textClass: status.textColor || statusTextColors[type],
  };
}

export function DetailSidePanel({
  title,
  subtitle,
  icon,
  status,
  activeTab = "details",
  onTabChange,
  tabs,
  hideTabs = false,
  onClose,
  widthClass = "w-[600px] md:w-[700px]",
  className = "",
  children,
  footer,
}: DetailSidePanelProps) {
  const statusObj = resolveStatus(status);

  // Default tabs: Details and Actions if not provided
  const effectiveTabs: PanelTab[] = tabs ?? [
    { id: "details", label: "Details", icon: <Info size={16} /> },
    { id: "actions", label: "Actions", icon: <Zap size={16} />, isAction: true },
  ];

  const standardTabs = effectiveTabs.filter((t) => !t.isAction);
  const actionTabs = effectiveTabs.filter((t) => t.isAction);

  return (
    <div
      className={`fixed right-0 top-0 h-full ${widthClass} bg-[var(--surface-container-low)] text-[var(--foreground)] border-l border-[var(--border)] shadow-2xl z-50 overflow-hidden flex flex-col animate-in slide-in- duration-300 ${className}`}
    >
      {/* Header */}
      <div className="bg-[var(--surface-container-low)] text-[var(--foreground)] border-b border-[var(--border)] p-6 pb-4 sticky top-0 z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3.5 min-w-0">
            {icon && (
              <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                {icon}
              </div>
            )}
            <div className="min-w-0">
              {/* Title and inline status in brackets: [Title] ([Status Dot] [Status Text]) */}
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-['Nunito_Sans',sans-serif] font-bold text-xl text-[var(--foreground)] tracking-tight truncate">
                  {title}
                </h3>
                {statusObj && (
                  <div className="flex items-center gap-1.5 font-['Nunito_Sans',sans-serif] text-sm font-medium flex-shrink-0 text-[var(--muted-foreground)]">
                    <span>(</span>
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${statusObj.dotClass}`} />
                    <span className={statusObj.textClass}>{statusObj.label}</span>
                    <span>)</span>
                  </div>
                )}
              </div>
              {subtitle && (
                <p className="font-['Nunito_Sans',sans-serif] text-sm text-[var(--muted-foreground)] truncate mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--surface-container-high)] transition-colors p-2 rounded-lg cursor-pointer flex-shrink-0"
            aria-label="Close panel"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs Row */}
        {!hideTabs && effectiveTabs.length > 0 && (
          <div className="flex items-center gap-2 border-b border-[var(--border)] -mb-4 pt-1">
            {standardTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onTabChange?.(tab.id)}
                  className={`font-['Nunito_Sans',sans-serif] px-4 py-2.5 text-sm font-medium transition-colors border-b-2 cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? "border-[var(--primary)] text-[var(--primary)] font-semibold"
                      : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.badge && <span className="ml-1">{tab.badge}</span>}
                </button>
              );
            })}

            {actionTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onTabChange?.(tab.id)}
                  className={`font-['Nunito_Sans',sans-serif] ml-auto px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? "border-[var(--state-warning)] text-[var(--state-on-warning-container)] bg-[var(--state-warning)]/10"
                      : "border-transparent text-[var(--state-warning)] hover:text-[var(--state-warning)] hover:bg-[var(--state-warning)]/5"
                  }`}
                >
                  {tab.icon || <Zap size={16} />}
                  <span>{tab.label}</span>
                  {tab.badge && <span className="ml-1">{tab.badge}</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Content Body */}
      <div className="flex-1 overflow-y-auto p-6">{children}</div>

      {/* Optional Sticky Footer */}
      {footer && (
        <div className="bg-[var(--surface-container-low)] border-t border-[var(--border)] p-4 sticky bottom-0 z-10">
          {footer}
        </div>
      )}
    </div>
  );
}

/**
 * Standardized Section Container for Detail Panels
 */
export function PanelSection({
  title,
  children,
  action,
  className = "",
}: {
  title: React.ReactNode;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <h4 className="font-['Nunito_Sans',sans-serif] text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
          {title}
        </h4>
        {action}
      </div>
      <div className="bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] rounded-lg p-4 space-y-3">
        {children}
      </div>
    </div>
  );
}

/**
 * Standardized Key-Value Row for Detail Panels
 */
export function PanelRow({
  label,
  value,
  mono = false,
  className = "",
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  mono?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex justify-between items-start gap-4 ${className}`}>
      <span className="font-['Nunito_Sans',sans-serif] text-sm text-[var(--muted-foreground)] flex-shrink-0">
        {label}
      </span>
      <span
        className={`font-['Nunito_Sans',sans-serif] text-sm text-[var(--foreground)] font-medium text-right ${
          mono ? "font-mono" : ""
        } truncate`}
      >
        {value ?? "-"}
      </span>
    </div>
  );
}

export default DetailSidePanel;
