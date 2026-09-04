import React, { ReactNode } from "react";
import {
  MasterTable,
  MasterTableContainer,
  MasterTableHead,
  MasterTableTh,
  MasterTableBody,
  MasterTableRow,
  MasterTableCell,
} from "./MasterTable";

export interface InteractiveColumn<T> {
  key: string;
  header: ReactNode;
  render: (item: T) => ReactNode;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  width?: string;
  minWidth?: string;
  isPinned?: boolean;
}

export interface InteractiveTableProps<T> {
  data: T[];
  columns: InteractiveColumn<T>[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  selectedId?: string | null;
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string) => void;
  selectable?: boolean;
  className?: string;
  containerClassName?: string;
  footer?: ReactNode;
  emptyState?: ReactNode;
}

export function InteractiveTable<T>({
  data,
  columns,
  keyExtractor,
  onRowClick,
  selectedId,
  selectedIds,
  onToggleSelect,
  selectable = false,
  className = "",
  containerClassName = "",
  footer,
  emptyState,
}: InteractiveTableProps<T>) {
  if (data.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <MasterTableContainer variant="interactive" className={containerClassName}>
      <MasterTable variant="interactive" className={className}>
        <MasterTableHead variant="interactive">
          <tr>
            {selectable && (
              <MasterTableTh className="w-12 px-4 py-3">
                {/* Select header slot if needed */}
              </MasterTableTh>
            )}
            {columns.map((col) => (
              <MasterTableTh
                key={col.key}
                align={col.align}
                style={{
                  ...(col.width ? { width: col.width } : {}),
                  ...(col.minWidth ? { minWidth: col.minWidth } : {}),
                }}
              >
                {col.header}
              </MasterTableTh>
            ))}
          </tr>
        </MasterTableHead>
        <MasterTableBody variant="interactive">
          {data.map((item) => {
            const id = keyExtractor(item);
            const isSelected = selectedId === id || (selectedIds ? selectedIds.has(id) : false);

            return (
              <MasterTableRow
                key={id}
                variant="interactive"
                selected={isSelected}
                clickable={!!onRowClick}
                onClick={onRowClick ? () => onRowClick(item) : undefined}
              >
                {selectable && onToggleSelect && (
                  <MasterTableCell className="w-12 px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedIds ? selectedIds.has(id) : false}
                      onChange={() => onToggleSelect(id)}
                      className="w-4 h-4 rounded border-[var(--border)] bg-[var(--surface)] text-[var(--primary)] cursor-pointer"
                    />
                  </MasterTableCell>
                )}
                {columns.map((col) => (
                  <MasterTableCell
                    key={col.key}
                    align={col.align}
                    style={{
                      ...(col.width ? { width: col.width } : {}),
                      ...(col.minWidth ? { minWidth: col.minWidth } : {}),
                    }}
                  >
                    {col.render(item)}
                  </MasterTableCell>
                ))}
              </MasterTableRow>
            );
          })}
        </MasterTableBody>
      </MasterTable>
      {footer}
    </MasterTableContainer>
  );
}
