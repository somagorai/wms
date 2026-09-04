import { X, AlertCircle, CheckCircle2, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

interface TroubleshootingModalProps {
 isOpen: boolean;
 onClose: () => void;
 workListId: string;
}

export function TroubleshootingModal({ isOpen, onClose, workListId }: TroubleshootingModalProps) {
 const navigate = useNavigate();
 
 if (!isOpen) return null;

 const handleNavigateToLogs = () => {
 // Close modal first to prevent message port errors
 onClose();
 // Use setTimeout to ensure navigation happens after modal cleanup
 setTimeout(() => {
 navigate(`/app/logs?service=Host Adapter&workListId=${workListId}&openPanel=true&tab=payload`);
 }, 0);
 };

 return (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
 {/* Backdrop */}
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="absolute inset-0 bg-black/50"
 onClick={onClose}
 />

 {/* Modal */}
 <motion.div
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 exit={{ opacity: 0, scale: 0.95 }}
 className="relative w-full max-w-2xl bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] rounded-lg border border-[var(--border)] "
 >
 {/* Header */}
 <div className="flex items-center justify-between p-6 border-b border-[var(--border)] ">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-lg bg-[var(--state-warning)]/10 dark:bg-[var(--state-warning)]/20 flex items-center justify-center">
 <AlertCircle className="w-5 h-5 text-[var(--state-on-warning-container)] dark:text-[var(--state-warning)]" />
 </div>
 <div>
 <h2 className="text-xl font-semibold text-[var(--foreground)] ">
 Troubleshooting Assistant
 </h2>
 <p className="text-sm text-[var(--muted-foreground)]">
 We're sorry you're experiencing an issue
 </p>
 </div>
 </div>
 <button
 onClick={onClose}
 className="p-2 hover:bg-[var(--surface-container-low)] hover:bg-[var(--surface-container-high)] rounded-lg transition-colors"
 >
 <X className="w-5 h-5 text-[var(--muted-foreground)]" />
 </button>
 </div>

 {/* Content */}
 <div className="p-6 space-y-6">
 {/* Issue Summary */}
 <div className="p-4 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] rounded-lg border border-[var(--border)] ">
 <div className="flex items-start gap-3">
 <div className="w-2 h-2 mt-2 rounded-full bg-[var(--state-warning)] flex-shrink-0" />
 <div>
 <p className="font-medium text-[var(--foreground)] ">Issue Detected</p>
 <p className="text-sm text-[var(--muted-foreground)] mt-1">
 Missing replenishment result for <span className="font-mono font-semibold text-[var(--primary)]">{workListId}</span>
 </p>
 </div>
 </div>
 </div>

 {/* Search Results */}
 <div className="space-y-3">
 <div className="flex items-center gap-2">
 <div className="w-1 h-5 bg-[var(--primary)] rounded-full" />
 <h3 className="font-semibold text-[var(--foreground)] ">Search Results</h3>
 </div>
 
 <div className="p-4 bg-[var(--state-success-container)] dark:bg-[var(--state-success)]/30 rounded-lg border border-[var(--state-success)]/40 dark:border-[var(--state-success)]">
 <div className="flex items-start gap-3">
 <CheckCircle2 className="w-5 h-5 text-[var(--state-on-success-container)] dark:text-[var(--state-success)] flex-shrink-0 mt-0.5" />
 <div>
 <p className="font-medium text-[var(--state-on-success-container)] dark:text-[var(--state-success)]">
 Outbound Replen Result Found
 </p>
 <p className="text-sm text-[var(--state-on-success-container)] dark:text-[var(--state-success)] mt-1">
 Our system successfully sent an outbound replenishment result for work list <span className="font-mono font-semibold">{workListId}</span> to the host system.
 </p>
 </div>
 </div>
 </div>
 </div>

 {/* Resolution Steps */}
 <div className="space-y-3">
 <div className="flex items-center gap-2">
 <div className="w-1 h-5 bg-[var(--primary)] rounded-full" />
 <h3 className="font-semibold text-[var(--foreground)] ">Resolution Steps</h3>
 </div>
 
 <div className="p-4 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] rounded-lg border border-[var(--border)]  space-y-3">
 <p className="text-sm text-[var(--foreground)] font-medium">
 To resolve this issue, follow these steps:
 </p>
 
 <div className="space-y-2">
 <div className="flex gap-3">
 <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center text-xs font-bold">
 1
 </div>
 <p className="text-sm text-[var(--muted-foreground)] pt-0.5">
 Click the <span className="font-semibold text-[var(--primary)]">"View in Host Log"</span> button below to navigate to the Logs screen
 </p>
 </div>
 
 <div className="flex gap-3">
 <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center text-xs font-bold">
 2
 </div>
 <p className="text-sm text-[var(--muted-foreground)] pt-0.5">
 The log will be automatically filtered to show <span className="font-semibold">Host Adapter</span> logs for work list <span className="font-mono font-semibold text-[var(--primary)]">{workListId}</span>
 </p>
 </div>
 
 <div className="flex gap-3">
 <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center text-xs font-bold">
 3
 </div>
 <p className="text-sm text-[var(--muted-foreground)] pt-0.5">
 The detail panel will open automatically with the <span className="font-semibold">Payload</span> tab active
 </p>
 </div>
 
 <div className="flex gap-3">
 <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center text-xs font-bold">
 4
 </div>
 <p className="text-sm text-[var(--muted-foreground)] pt-0.5">
 Review the payload data and click the <span className="font-semibold text-[var(--primary)]">"Resend"</span> button to retransmit the replenishment result to the host
 </p>
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* Footer */}
 <div className="p-6 border-t border-[var(--border)]  flex items-center justify-end gap-3">
 <button
 onClick={onClose}
 className="px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--surface-container-low)] hover:bg-[var(--surface-container-high)] rounded-lg transition-colors"
 >
 Close
 </button>
 <button
 onClick={handleNavigateToLogs}
 className="px-4 py-2 text-sm font-medium bg-[var(--primary)] hover:bg-[var(--brand-accent-light)] text-[var(--primary-foreground)] rounded-lg transition-colors flex items-center gap-2"
 >
 View in Host Log
 <ChevronRight className="w-4 h-4" />
 </button>
 </div>
 </motion.div>
 </div>
 );
}