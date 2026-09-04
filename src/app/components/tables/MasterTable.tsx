import React, { ReactNode } from "react";

// ─── Type System ────────────────────────────────────────────────────────────
/**
 * Table type variants for semantic usage:
 * - "actionable"  : Main page data grids. Row-click, selection, sorting.
 * - "display"     : Read-only dashboard / summary tables. No row interaction.
 * - "panel"       : Key-value or detail tables inside right-side sliding panels.
 * - "overlay"     : Compact tables inside modals or report overlays.
 * - "nested"      : Sub-tables inside expanded rows or detail sections.
 *
 * Density:
 * - "comfortable" : Standard row padding (py-4)
 * - "compact"     : Dense row padding (py-2.5)
 */
export type TableVariantType = "actionable" | "display" | "panel" | "overlay" | "nested";
export type TableDensity = "comfortable" | "compact";

/** @deprecated use TableVariantType instead */
export type LegacyVariant = "interactive" | "details" | "overlay" | "plain";

// ─── Container ──────────────────────────────────────────────────────────────
export interface MasterTableContainerProps {
  children: ReactNode;
  className?: string;
  /** Semantic variant that controls border, rounding, and overflow behaviour */
  type?: TableVariantType;
  /** @deprecated use type */
  variant?: LegacyVariant;
}

const CONTAINER_STYLES: Record<TableVariantType, string> = {
  actionable: "overflow-x-auto rounded-xl border border-[var(--border)] bg-transparent",
  display:    "overflow-x-auto rounded-xl border border-[var(--border)] bg-transparent",
  panel:      "rounded-xl bg-transparent overflow-hidden",
  overlay:    "rounded-xl border border-[var(--border)] bg-transparent overflow-hidden",
  nested:     "overflow-x-auto rounded-lg bg-transparent",
};

export function MasterTableContainer({
  children,
  className = "",
  type = "actionable",
  variant,
}: MasterTableContainerProps) {
  // Legacy shim
  const resolved: TableVariantType =
    variant === "interactive" ? "actionable" :
    variant === "details"     ? "panel"      :
    variant === "overlay"     ? "overlay"    :
    variant === "plain"       ? "display"    :
    type;

  return (
    <div className={`${CONTAINER_STYLES[resolved]} ${className}`}>
      <div className="w-full overflow-x-auto">{children}</div>
    </div>
  );
}

// ─── Table ───────────────────────────────────────────────────────────────────
export interface MasterTableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  children: ReactNode;
  className?: string;
  type?: TableVariantType;
  /** @deprecated use type */
  variant?: LegacyVariant;
  dense?: boolean;
  density?: TableDensity;
}

export function MasterTable({
  children,
  className = "",
  type,
  variant,
  dense,
  density,
  ...props
}: MasterTableProps) {
  return (
    <table
      className={`w-full text-left border-collapse bg-transparent ${className}`}
      {...props}
    >
      {children}
    </table>
  );
}

// ─── Head ────────────────────────────────────────────────────────────────────
export interface MasterTableHeadProps {
  children: ReactNode;
  className?: string;
  type?: TableVariantType;
  /** Sticks the header row to the top of a scrollable container */
  sticky?: boolean;
  /** @deprecated use type */
  variant?: LegacyVariant;
}

const HEAD_BG: Record<TableVariantType, string> = {
  actionable: "bg-transparent",
  display:    "bg-transparent",
  panel:      "bg-transparent",
  overlay:    "bg-transparent",
  nested:     "bg-transparent",
};

export function MasterTableHead({
  children,
  className = "",
  type = "actionable",
  sticky = false,
  variant,
}: MasterTableHeadProps) {
  const resolved: TableVariantType =
    variant === "interactive" ? "actionable" :
    variant === "details"     ? "panel"      :
    variant === "overlay"     ? "overlay"    :
    variant === "plain"       ? "display"    :
    type;

  return (
    <thead
      className={`${HEAD_BG[resolved]} border-b border-[var(--border)] ${sticky ? "sticky top-0 z-10 bg-[var(--surface-container)]" : ""} ${className}`}
    >
      {children}
    </thead>
  );
}

// ─── Th ──────────────────────────────────────────────────────────────────────
export interface MasterTableThProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  type?: TableVariantType;
  density?: TableDensity;
  /** @deprecated use density */
  dense?: boolean;
}

export function MasterTableTh({
  children,
  className = "",
  align,
  type = "actionable",
  density = "comfortable",
  dense,
  ...props
}: MasterTableThProps) {
  const isCompact = dense || density === "compact";
  const padding = isCompact ? "px-4 py-2.5 first:pl-4 last:pr-4" : "px-6 py-3.5 first:pl-6 last:pr-6";

  const alignClass =
    align === "right" ? "text-right" :
    align === "center" ? "text-center" :
    "text-left";

  return (
    <th
      className={`${padding} text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider whitespace-nowrap align-middle ${alignClass} ${className}`}
      {...props}
    >
      {children}
    </th>
  );
}

// ─── Body ────────────────────────────────────────────────────────────────────
export interface MasterTableBodyProps {
  children: ReactNode;
  className?: string;
  type?: TableVariantType;
  /** @deprecated use type */
  variant?: LegacyVariant;
}

export function MasterTableBody({
  children,
  className = "",
  type,
  variant,
}: MasterTableBodyProps) {
  return (
    <tbody
      className={`divide-y divide-[var(--border)] [&_tr:last-child]:border-b-0 ${className}`}
    >
      {children}
    </tbody>
  );
}

// ─── Row ─────────────────────────────────────────────────────────────────────
export interface MasterTableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  type?: TableVariantType;
  /** @deprecated use type */
  variant?: LegacyVariant;
  selected?: boolean;
  clickable?: boolean;
  dimmed?: boolean;
}

const ROW_HOVER: Record<TableVariantType, string> = {
  actionable: "hover:bg-[var(--primary)]/10",
  display:    "hover:bg-[var(--surface-container-low)]",
  panel:      "hover:bg-[var(--primary)]/8",
  overlay:    "hover:bg-[var(--primary)]/10",
  nested:     "",
};

export function MasterTableRow({
  children,
  className = "",
  type = "actionable",
  variant,
  selected = false,
  clickable = false,
  dimmed = false,
  ...props
}: MasterTableRowProps) {
  const resolved: TableVariantType =
    variant === "interactive" ? "actionable" :
    variant === "details"     ? "panel"      :
    variant === "overlay"     ? "overlay"    :
    variant === "plain"       ? "display"    :
    type;

  const rowClasses = [
    "border-b border-[var(--border)] last:border-b-0 transition-colors duration-150",
    ROW_HOVER[resolved],
    clickable ? "cursor-pointer" : "",
    selected ? "bg-[var(--primary)]/15" : "",
    dimmed ? "opacity-50" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <tr className={rowClasses} {...props}>
      {children}
    </tr>
  );
}

// ─── Cell ────────────────────────────────────────────────────────────────────
export interface MasterTableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  type?: TableVariantType;
  density?: TableDensity;
  /** @deprecated use density */
  dense?: boolean;
}

export function MasterTableCell({
  children,
  className = "",
  align,
  type = "actionable",
  density = "comfortable",
  dense,
  ...props
}: MasterTableCellProps) {
  const isCompact = dense || density === "compact";
  const padding = isCompact ? "px-4 py-2.5 first:pl-4 last:pr-4" : "px-6 py-4 first:pl-6 last:pr-6";

  const alignClass =
    align === "right" ? "text-right" :
    align === "center" ? "text-center" :
    "text-left";

  return (
    <td
      className={`${padding} text-sm text-[var(--foreground)] align-middle whitespace-nowrap ${alignClass} ${className}`}
      {...props}
    >
      {children}
    </td>
  );
}

// ─── Empty State Row ─────────────────────────────────────────────────────────
export function MasterTableEmptyRow({
  colSpan,
  children,
  className = "",
}: {
  colSpan: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className={`py-16 text-center text-sm text-[var(--muted-foreground)] ${className}`}
      >
        {children}
      </td>
    </tr>
  );
}
