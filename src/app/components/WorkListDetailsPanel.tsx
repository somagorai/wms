import { useState } from "react";
import { ClipboardList, List, TrendingUp, Flame } from "lucide-react";
import { motion } from "motion/react";

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
      {/* Work List Section */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
        <div className="bg-zinc-100 dark:bg-zinc-800 p-4 border-b border-zinc-200 dark:border-zinc-700">
          <div className="flex items-center gap-2">
            <ClipboardList size={20} className="text-[#0d9488] dark:text-[#50e080]" />
            <h2 className="font-semibold text-zinc-900 dark:text-white">Work List</h2>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800">
                <th className="text-left py-3 px-4 text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase">Work List</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase">Type</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase">Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase">Priority</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase">Priority Date/Time</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase">Hot</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase">Attribute 1</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase">Sub Type</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase">Started</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase">Created</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                <td className="py-3 px-4">
                  <span className="font-mono text-sm font-medium text-zinc-900 dark:text-white">{workListDetail.workList}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-zinc-900 dark:text-white">{workListDetail.type}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    {workListDetail.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    workListDetail.priority === "High"
                      ? "bg-red-500/10 text-red-600 dark:text-red-400"
                      : "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400"
                  }`}>
                    {workListDetail.priority}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="font-mono text-sm text-zinc-900 dark:text-white">{workListDetail.priorityDateTime}</span>
                </td>
                <td className="py-3 px-4 text-center">
                  {workListDetail.isHot && <Flame size={18} className="text-orange-500 inline-block" />}
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-zinc-900 dark:text-white">{workListDetail.attribute1}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-zinc-900 dark:text-white">{workListDetail.subType || "-"}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="font-mono text-sm text-zinc-900 dark:text-white">{workListDetail.started || "-"}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="font-mono text-sm text-zinc-900 dark:text-white">{workListDetail.created || "-"}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Work Lines Section */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
        <div className="bg-zinc-100 dark:bg-zinc-800 p-4 border-b border-zinc-200 dark:border-zinc-700">
          <div className="flex items-center gap-2">
            <List size={20} className="text-[#0d9488] dark:text-[#50e080]" />
            <h2 className="font-semibold text-zinc-900 dark:text-white">Work Lines ({workLines.length})</h2>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800">
                <th className="text-left py-3 px-4 text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase">Work Line</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase">Priority</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase">Item</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase">Quantity</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase">Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase">Started</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase">Comment</th>
              </tr>
            </thead>
            <tbody>
              {workLines.map((line, index) => (
                <motion.tr
                  key={line.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedWorkLine(line.workLine)}
                  className={`border-b border-zinc-200 dark:border-zinc-800 cursor-pointer transition-colors ${
                    selectedWorkLine === line.workLine
                      ? 'bg-[#0d9488]/10 dark:bg-[#50e080]/10 hover:bg-[#0d9488]/15 dark:hover:bg-[#50e080]/15'
                      : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  <td className="py-3 px-4">
                    <span className="font-mono text-sm font-medium text-zinc-900 dark:text-white">{line.workLine}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      line.priority === "High"
                        ? "bg-red-500/10 text-red-600 dark:text-red-400"
                        : "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400"
                    }`}>
                      {line.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-sm text-zinc-900 dark:text-white">{line.item}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-sm font-semibold text-zinc-900 dark:text-white">{line.quantity}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      line.status === "In Progress"
                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        : line.status === "Completed"
                        ? "bg-[#0d9488]/10 dark:bg-[#50e080]/10 text-[#0d9488] dark:text-[#50e080]"
                        : "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400"
                    }`}>
                      {line.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-sm text-zinc-900 dark:text-white">{line.started || "-"}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400 italic">{line.comment || "-"}</span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Work Operations Section */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
        <div className="bg-zinc-100 dark:bg-zinc-800 p-4 border-b border-zinc-200 dark:border-zinc-700">
          <div className="flex items-center gap-2">
            <TrendingUp size={20} className="text-[#0d9488] dark:text-[#50e080]" />
            <h2 className="font-semibold text-zinc-900 dark:text-white">
              Work Operations
              {selectedWorkLine && (
                <span className="text-xs text-zinc-600 dark:text-zinc-400 font-normal ml-2">
                  ({selectedWorkLine})
                </span>
              )}
            </h2>
          </div>
        </div>
        {selectedWorkLine ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase">Work Operation</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase">Type</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase">Destination Location</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase">Source Location</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase">Started</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase">Comment</th>
                </tr>
              </thead>
              <tbody>
                {workOperations
                  .filter(op => op.workLineId === selectedWorkLine)
                  .map((operation, index) => (
                    <motion.tr
                      key={operation.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                    >
                      <td className="py-3 px-4">
                        <span className="font-mono text-sm font-medium text-zinc-900 dark:text-white">{operation.workOperation}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-zinc-900 dark:text-white">{operation.type}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-zinc-900 dark:text-white">{operation.destinationLocation}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-zinc-900 dark:text-white">{operation.sourceLocation}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          operation.status === "In Progress"
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                            : operation.status === "Completed"
                            ? "bg-[#0d9488]/10 dark:bg-[#50e080]/10 text-[#0d9488] dark:text-[#50e080]"
                            : "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400"
                        }`}>
                          {operation.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-sm text-zinc-900 dark:text-white">{operation.started || "-"}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-zinc-600 dark:text-zinc-400 italic">{operation.comment || "-"}</span>
                      </td>
                    </motion.tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-3">
              <List size={32} className="text-zinc-400 dark:text-zinc-600" />
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Select a Work Line to view its operations
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
