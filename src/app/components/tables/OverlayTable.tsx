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

export interface OverlayColumn<T> {
  key: string;
  header: ReactNode;
  render: (item: T) => ReactNode;
  align?: "left" | "center" | "right";
  width?: string;
}

export interface OverlayTableProps<T> {
  data: T[];
  columns: OverlayColumn<T>[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  className?: string;
  dense?: boolean;
}

export function OverlayTable<T>({
  data,
  columns,
  keyExtractor,
  onRowClick,
  className = "",
  dense = true,
}: OverlayTableProps<T>) {
  return (
    <MasterTableContainer variant="overlay" className={className}>
      <MasterTable variant="overlay" dense={dense}>
        <MasterTableHead variant="overlay">
          <tr>
            {columns.map((col) => (
              <MasterTableTh key={col.key} align={col.align} style={col.width ? { width: col.width } : undefined}>
                {col.header}
              </MasterTableTh>
            ))}
          </tr>
        </MasterTableHead>
        <MasterTableBody variant="overlay">
          {data.map((item) => (
            <MasterTableRow
              key={keyExtractor(item)}
              variant="overlay"
              clickable={!!onRowClick}
              onClick={onRowClick ? () => onRowClick(item) : undefined}
            >
              {columns.map((col) => (
                <MasterTableCell key={col.key} align={col.align} dense={dense}>
                  {col.render(item)}
                </MasterTableCell>
              ))}
            </MasterTableRow>
          ))}
        </MasterTableBody>
      </MasterTable>
    </MasterTableContainer>
  );
}
