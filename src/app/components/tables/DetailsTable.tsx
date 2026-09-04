import React, { ReactNode } from "react";
import { MasterTable, MasterTableContainer, MasterTableBody, MasterTableRow, MasterTableCell } from "./MasterTable";

export interface DetailRow {
  label: ReactNode;
  value: ReactNode;
  icon?: ReactNode;
}

export interface DetailsTableProps {
  rows?: DetailRow[];
  children?: ReactNode;
  className?: string;
  labelWidth?: string;
}

export function DetailsTable({
  rows,
  children,
  className = "",
  labelWidth = "w-1/3",
}: DetailsTableProps) {
  return (
    <MasterTableContainer variant="details" className={className}>
      <MasterTable variant="details">
        <MasterTableBody variant="details">
          {rows
            ? rows.map((row, idx) => (
                <MasterTableRow key={idx} variant="details">
                  <MasterTableCell className={`font-medium text-[var(--muted-foreground)] ${labelWidth} flex items-center gap-2`}>
                    {row.icon}
                    <span>{row.label}</span>
                  </MasterTableCell>
                  <MasterTableCell className="text-[var(--foreground)] font-normal">
                    {row.value}
                  </MasterTableCell>
                </MasterTableRow>
              ))
            : children}
        </MasterTableBody>
      </MasterTable>
    </MasterTableContainer>
  );
}
