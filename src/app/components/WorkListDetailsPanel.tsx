import { useState } from "react";
import { ClipboardList, List, TrendingUp, Flame } from "lucide-react";
import { motion } from "motion/react";
import {
  MasterTableContainer,
  MasterTable,
  MasterTableHead,
  MasterTableTh,
  MasterTableBody,
  MasterTableCell,
} from "./tables/MasterTable";

export type WorkItem = {
  id: string;
  workList: string;
  type: string;
  status: string;
  priority: string;
  priorityDateTime: string;
  isHot: boolean;
  attribute1: string;
  attribute2?: string;
  attribute3?: string;
  attribute4?: string;
  attribute5?: string;
  subType?: string;
  started?: string;
  created?: string;
};

export type WorkLine = {
  id: string;
  workLine: string;
  priority: string;
  item: string;
  quantity: number;
  status: string;
  started: string;
  comment: string;
};

export type WorkOperation = {
  id: string;
  workLineId: string;
  workOperation: string;
  type: string;
  destinationLocation: string;
  sourceLocation: string;
  status: string;
  started: string;
  comment: string;
};

type WorkListDetailsPanelProps = {
  workListDetail: WorkItem;
  workLines: WorkLine[];
  workOperations: WorkOperation[];
};

export function WorkListDetailsPanel({
  workListDetail,
  workLines,
  workOperations
}: WorkListDetailsPanelProps) {
  const [selectedWorkLine, setSelectedWorkLine] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Work List Information Section */}
      <div>
        <h4 className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-4">Work List Information</h4>
        <div className="bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-sm text-[var(--muted-foreground)]">Work List</span>
            <span className="font-mono text-sm font-medium text-[var(--foreground)]">{workListDetail.workList}</span>
          </div>
          <div className="flex justify-between items-start">
            <span className="text-sm text-[var(--muted-foreground)]">Type</span>
            <span className="text-sm text-[var(--foreground)]">{workListDetail.type}</span>
          </div>
          <div className="flex justify-between items-start">
            <span className="text-sm text-[var(--muted-foreground)]">Status</span>
            <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--state-warning)]/10 text-[var(--state-on-warning-container)] dark:text-[var(--state-warning)]">
              {workListDetail.status}
            </span>
          </div>
          <div className="flex justify-between items-start">
            <span className="text-sm text-[var(--muted-foreground)]">Priority</span>
            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
              workListDetail.priority === "High"
                ? "bg-[var(--state-error)]/10 text-[var(--state-error)]"
                : "bg-[var(--state-debug)]/10 text-[var(--muted-foreground)]"
            }`}>
              {workListDetail.priority}
            </span>
          </div>
          <div className="flex justify-between items-start">
            <span className="text-sm text-[var(--muted-foreground)]">Priority Date/Time</span>
            <span className="font-mono text-sm text-[var(--foreground)]">{workListDetail.priorityDateTime}</span>
          </div>
          <div className="flex justify-between items-start">
            <span className="text-sm text-[var(--muted-foreground)]">Hot Item</span>
            {workListDetail.isHot ? (
              <span className="flex items-center gap-1 text-sm font-medium text-[var(--state-error)]">
                <Flame size={14} />
                Yes
              </span>
            ) : (
              <span className="text-sm text-[var(--foreground)]">No</span>
            )}
          </div>
          <div className="flex justify-between items-start">
            <span className="text-sm text-[var(--muted-foreground)]">Attribute 1</span>
            <span className="text-sm text-[var(--foreground)]">{workListDetail.attribute1}</span>
          </div>
          <div className="flex justify-between items-start">
            <span className="text-sm text-[var(--muted-foreground)]">Sub Type</span>
            <span className="text-sm text-[var(--foreground)]">{workListDetail.subType || "-"}</span>
          </div>
          <div className="flex justify-between items-start">
            <span className="text-sm text-[var(--muted-foreground)]">Started</span>
            <span className="font-mono text-sm text-[var(--foreground)]">{workListDetail.started || "-"}</span>
          </div>
          <div className="flex justify-between items-start">
            <span className="text-sm text-[var(--muted-foreground)]">Created</span>
            <span className="font-mono text-sm text-[var(--foreground)]">{workListDetail.created || "-"}</span>
          </div>
        </div>
      </div>

      {/* Work Lines Section */}
      <div>
        <h4 className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-4">Work Lines ({workLines.length})</h4>
        <MasterTableContainer type="nested" className="border border-[var(--border)] rounded-xl overflow-hidden">
          <MasterTable type="nested">
            <MasterTableHead type="nested">
              <tr>
                <MasterTableTh type="nested" density="compact">Work Line</MasterTableTh>
                <MasterTableTh type="nested" density="compact">Priority</MasterTableTh>
                <MasterTableTh type="nested" density="compact">Item</MasterTableTh>
                <MasterTableTh type="nested" density="compact" align="right">Quantity</MasterTableTh>
                <MasterTableTh type="nested" density="compact">Status</MasterTableTh>
                <MasterTableTh type="nested" density="compact">Started</MasterTableTh>
                <MasterTableTh type="nested" density="compact">Comment</MasterTableTh>
              </tr>
            </MasterTableHead>
            <MasterTableBody type="nested">
              {workLines.map((line, index) => (
                <motion.tr
                  key={line.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedWorkLine(line.workLine)}
                  className={`border-b border-[var(--border)] cursor-pointer transition-colors ${
                    selectedWorkLine === line.workLine
                      ? 'bg-[var(--primary)]/10 hover:bg-[var(--primary)]/15'
                      : 'hover:bg-[var(--primary)]/10'
                  }`}
                >
                  <MasterTableCell type="nested" density="compact">
                    <span className="font-mono text-sm font-medium text-[var(--foreground)] ">{line.workLine}</span>
                  </MasterTableCell>
                  <MasterTableCell type="nested" density="compact">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      line.priority === "High"
                        ? "bg-[var(--state-error)]/10 text-[var(--state-error)] dark:text-[var(--state-error)]"
                        : "bg-[var(--state-debug)]/10 text-[var(--muted-foreground)]"
                    }`}>
                      {line.priority}
                    </span>
                  </MasterTableCell>
                  <MasterTableCell type="nested" density="compact">
                    <span className="font-mono text-sm text-[var(--foreground)] ">{line.item}</span>
                  </MasterTableCell>
                  <MasterTableCell type="nested" density="compact" align="right">
                    <span className="text-sm font-semibold text-[var(--foreground)] ">{line.quantity}</span>
                  </MasterTableCell>
                  <MasterTableCell type="nested" density="compact">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      line.status === "In Progress"
                        ? "bg-[var(--state-warning)]/10 text-[var(--state-on-warning-container)] dark:text-[var(--state-warning)]"
                        : line.status === "Completed"
                        ? "bg-[var(--primary)]/10 text-[var(--primary)] dark:text-[var(--primary)]"
                        : "bg-[var(--state-debug)]/10 text-[var(--muted-foreground)]"
                    }`}>
                      {line.status}
                    </span>
                  </MasterTableCell>
                  <MasterTableCell type="nested" density="compact">
                    <span className="font-mono text-sm text-[var(--foreground)] ">{line.started || "-"}</span>
                  </MasterTableCell>
                  <MasterTableCell type="nested" density="compact">
                    <span className="text-sm text-[var(--muted-foreground)] italic">{line.comment || "-"}</span>
                  </MasterTableCell>
                </motion.tr>
              ))}
            </MasterTableBody>
          </MasterTable>
        </MasterTableContainer>
      </div>

      {/* Work Operations Section */}
      <div>
        <h4 className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-4">
          Work Operations
          {selectedWorkLine && (
            <span className="text-xs text-[var(--muted-foreground)] font-normal ml-2 lowercase">
              ({selectedWorkLine})
            </span>
          )}
        </h4>
        {selectedWorkLine ? (
          <MasterTableContainer type="nested" className="border border-[var(--border)] rounded-xl overflow-hidden">
            <MasterTable type="nested">
              <MasterTableHead type="nested">
                <tr>
                  <MasterTableTh type="nested" density="compact">Work Operation</MasterTableTh>
                  <MasterTableTh type="nested" density="compact">Type</MasterTableTh>
                  <MasterTableTh type="nested" density="compact">Destination Location</MasterTableTh>
                  <MasterTableTh type="nested" density="compact">Source Location</MasterTableTh>
                  <MasterTableTh type="nested" density="compact">Status</MasterTableTh>
                  <MasterTableTh type="nested" density="compact">Started</MasterTableTh>
                  <MasterTableTh type="nested" density="compact">Comment</MasterTableTh>
                </tr>
              </MasterTableHead>
              <MasterTableBody type="nested">
                {workOperations
                  .filter(op => op.workLineId === selectedWorkLine)
                  .map((operation, index) => (
                    <motion.tr
                      key={operation.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-[var(--border)] hover:bg-[var(--primary)]/10 transition-colors"
                    >
                      <MasterTableCell type="nested" density="compact">
                        <span className="font-mono text-sm font-medium text-[var(--foreground)] ">{operation.workOperation}</span>
                      </MasterTableCell>
                      <MasterTableCell type="nested" density="compact">
                        <span className="text-sm text-[var(--foreground)] ">{operation.type}</span>
                      </MasterTableCell>
                      <MasterTableCell type="nested" density="compact">
                        <span className="text-sm text-[var(--foreground)] ">{operation.destinationLocation}</span>
                      </MasterTableCell>
                      <MasterTableCell type="nested" density="compact">
                        <span className="text-sm text-[var(--foreground)] ">{operation.sourceLocation}</span>
                      </MasterTableCell>
                      <MasterTableCell type="nested" density="compact">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          operation.status === "In Progress"
                            ? "bg-[var(--state-warning)]/10 text-[var(--state-on-warning-container)] dark:text-[var(--state-warning)]"
                            : operation.status === "Completed"
                            ? "bg-[var(--primary)]/10 text-[var(--primary)] dark:text-[var(--primary)]"
                            : "bg-[var(--state-debug)]/10 text-[var(--muted-foreground)]"
                        }`}>
                          {operation.status}
                        </span>
                      </MasterTableCell>
                      <MasterTableCell type="nested" density="compact">
                        <span className="font-mono text-sm text-[var(--foreground)] ">{operation.started || "-"}</span>
                      </MasterTableCell>
                      <MasterTableCell type="nested" density="compact">
                        <span className="text-sm text-[var(--muted-foreground)] italic">{operation.comment || "-"}</span>
                      </MasterTableCell>
                    </motion.tr>
                  ))}
              </MasterTableBody>
            </MasterTable>
          </MasterTableContainer>
        ) : (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-[var(--surface-container-low)] dark:bg-[var(--card)] rounded-full flex items-center justify-center mx-auto mb-3">
              <List size={32} className="text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]" />
            </div>
            <p className="text-sm text-[var(--muted-foreground)]">
              Select a Work Line to view its operations
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
