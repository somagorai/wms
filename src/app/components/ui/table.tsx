import * as React from "react";
import { cn } from "./utils";

export interface TableContainerProps extends React.ComponentProps<"div"> {
  variant?: "default" | "card" | "plain";
  padding?: "none" | "sm" | "md" | "lg";
}

function TableContainer({
  className,
  variant = "card",
  padding = "md",
  children,
  ...props
}: TableContainerProps) {
  const variantStyles = {
    card: "rounded-xl border border-[var(--border)] bg-transparent overflow-hidden",
    default: "rounded-xl border border-[var(--border)] bg-transparent overflow-hidden",
    plain: "w-full overflow-hidden",
  };

  const paddingStyles = {
    none: "",
    sm: "p-2",
    md: "p-0",
    lg: "p-6",
  };

  return (
    <div
      data-slot="table-container"
      className={cn(variantStyles[variant], paddingStyles[padding], className)}
      {...props}
    >
      <div className="w-full overflow-x-auto">{children}</div>
    </div>
  );
}

export interface TableProps extends React.ComponentProps<"table"> {
  dense?: boolean;
  striped?: boolean;
}

function Table({ className, dense = false, striped = false, ...props }: TableProps) {
  return (
    <table
      data-slot="table"
      data-dense={dense ? "true" : undefined}
      data-striped={striped ? "true" : undefined}
      className={cn("w-full text-left text-sm border-collapse bg-transparent", className)}
      {...props}
    />
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn(
        "bg-transparent border-b border-[var(--border)]",
        className
      )}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn(
        "divide-y divide-[var(--border-light,rgba(209,213,223,0.45))] [&_tr:last-child]:border-b-0",
        className
      )}
      {...props}
    />
  );
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-transparent font-semibold text-[var(--foreground)] border-t border-[var(--border)]",
        className
      )}
      {...props}
    />
  );
}

export interface TableRowProps extends React.ComponentProps<"tr"> {
  isSelected?: boolean;
}

function TableRow({ className, isSelected, ...props }: TableRowProps) {
  return (
    <tr
      data-slot="table-row"
      data-selected={isSelected ? "true" : undefined}
      className={cn(
        "border-b border-[var(--border-light,rgba(209,213,223,0.45))] last:border-b-0 transition-colors",
        "hover:bg-[var(--primary)]/10",
        "data-[selected=true]:bg-[var(--primary)]/15",
        className
      )}
      {...props}
    />
  );
}

export interface TableHeadProps extends React.ComponentProps<"th"> {
  align?: "left" | "center" | "right";
}

function TableHead({ className, align = "left", ...props }: TableHeadProps) {
  const alignClass =
    align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left";

  return (
    <th
      data-slot="table-head"
      className={cn(
        "px-6 py-3.5 text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider whitespace-nowrap align-middle first:pl-6 last:pr-6",
        alignClass,
        className
      )}
      {...props}
    />
  );
}

export interface TableCellProps extends React.ComponentProps<"td"> {
  align?: "left" | "center" | "right";
}

function TableCell({ className, align = "left", ...props }: TableCellProps) {
  const alignClass =
    align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left";

  return (
    <td
      data-slot="table-cell"
      className={cn(
        "px-6 py-4 text-sm text-[var(--foreground)] align-middle whitespace-nowrap first:pl-6 last:pr-6",
        alignClass,
        className
      )}
      {...props}
    />
  );
}

function TableCaption({ className, ...props }: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-4 text-xs text-[var(--muted-foreground)]", className)}
      {...props}
    />
  );
}

/**
 * High-Level Standard Table Component
 * Configured via 4 standard variables:
 * @param columns Array of column metadata
 * @param data Array of records
 * @param variant Visual style ("card" | "default" | "plain")
 * @param density Row vertical rhythm ("comfortable" | "compact")
 */
export interface StandardColumn<T> {
  key: string;
  header: React.ReactNode;
  width?: string;
  align?: "left" | "center" | "right";
  className?: string;
  render?: (row: T, index: number) => React.ReactNode;
}

export interface StandardTableProps<T> {
  columns: StandardColumn<T>[];
  data: T[];
  keyExtractor?: (row: T, index: number) => string | number;
  variant?: "card" | "default" | "plain";
  density?: "comfortable" | "compact";
  emptyMessage?: React.ReactNode;
  onRowClick?: (row: T, index: number) => void;
  selectedId?: string | number | null;
  className?: string;
}

function StandardTable<T>({
  columns,
  data,
  keyExtractor,
  variant = "card",
  density = "comfortable",
  emptyMessage = "No records found",
  onRowClick,
  selectedId,
  className,
}: StandardTableProps<T>) {
  const isCompact = density === "compact";

  return (
    <TableContainer variant={variant} className={className}>
      <Table dense={isCompact}>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead
                key={col.key}
                align={col.align}
                style={col.width ? { width: col.width } : undefined}
                className={cn(isCompact && "py-2.5 px-4 first:pl-4 last:pr-4", col.className)}
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="py-12 text-center text-sm text-[var(--muted-foreground)]"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => {
              const rowKey = keyExtractor ? keyExtractor(row, index) : (row as any).id ?? index;
              const isSelected = selectedId != null && selectedId === rowKey;

              return (
                <TableRow
                  key={rowKey}
                  isSelected={isSelected}
                  onClick={onRowClick ? () => onRowClick(row, index) : undefined}
                  className={cn(onRowClick && "cursor-pointer")}
                >
                  {columns.map((col) => (
                    <TableCell
                      key={col.key}
                      align={col.align}
                      className={cn(
                        isCompact && "py-2.5 px-4 first:pl-4 last:pr-4",
                        col.className
                      )}
                    >
                      {col.render ? col.render(row, index) : (row as any)[col.key]}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export {
  TableContainer,
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  StandardTable,
};
