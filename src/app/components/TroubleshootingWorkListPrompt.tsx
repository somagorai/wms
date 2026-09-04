import { X, AlertTriangle } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

interface TroubleshootingWorkListPromptProps {
 onClose: () => void;
 onSubmit: (workListId: string) => void;
}

export function TroubleshootingWorkListPrompt({ onClose, onSubmit }: TroubleshootingWorkListPromptProps) {
 const [workListInput, setWorkListInput] = useState("");
 const [error, setError] = useState("");

 const handleSubmit = () => {
 const trimmed = workListInput.trim();
 
 if (!trimmed) {
 setError("Please enter a Work List ID");
 return;
 }

 // Extract work list number from various formats like "WL-101", "WL 101", "101"
 const match = trimmed.match(/(?:wl[\s-]*)?(\d+)/i);
 
 if (!match) {
 setError("Please enter a valid Work List ID (e.g., WL-101 or 101)");
 return;
 }

 const workListNumber = match[1].padStart(3, '0');
 onSubmit(`WL-${workListNumber}`);
 };

 const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
 if (e.key === "Enter") {
 handleSubmit();
 }
 };

 return (
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="fixed inset-0 z-50 flex items-center justify-center p-4"
 onClick={onClose}
 >
 {/* Backdrop */}
 <div className="absolute inset-0 bg-black/50" />

 {/* Center Modal */}
 <motion.div
 initial={{ scale: 0.9, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 exit={{ scale: 0.9, opacity: 0 }}
 transition={{ type: "spring", damping: 25, stiffness: 200 }}
 onClick={(e) => e.stopPropagation()}
 className="relative w-full max-w-md bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] border border-[var(--border)]  rounded-2xl overflow-hidden"
 >
 {/* Close button */}
 <button
 onClick={onClose}
 className="absolute top-4 right-4 w-8 h-8 bg-[var(--surface-container-low)] dark:bg-[var(--card)] hover:bg-[var(--surface-container-high)] rounded-full flex items-center justify-center transition-colors z-10"
 >
 <X size={16} className="text-[var(--muted-foreground)]" />
 </button>

 {/* Header */}
 <div className="p-6 border-b border-[var(--border)] ">
 <div className="flex items-center gap-3 mb-2">
 <div className="w-10 h-10 bg-[var(--state-warning-container)] dark:bg-[var(--state-warning-container)]/30 rounded-full flex items-center justify-center">
 <AlertTriangle size={20} className="text-[var(--state-on-warning-container)] dark:text-[var(--state-warning)]" />
 </div>
 <h2 className="text-xl font-bold text-[var(--foreground)] ">
 Troubleshoot Missing Replen Result
 </h2>
 </div>
 <p className="text-[var(--muted-foreground)] text-sm">
 Which Work List would you like to troubleshoot?
 </p>
 </div>

 {/* Content */}
 <div className="p-6">
 <label className="block text-sm font-medium text-[var(--foreground)]  mb-2">
 Work List ID
 </label>
 <input
 type="text"
 value={workListInput}
 onChange={(e) => {
 setWorkListInput(e.target.value);
 setError("");
 }}
 onKeyPress={handleKeyPress}
 placeholder="e.g., WL-101 or 101"
 autoFocus
 className="w-full px-4 py-3 bg-[var(--surface-container)] text-[var(--foreground)] border border border-[var(--border)]  rounded-lg text-[var(--foreground)]  placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-[var(--primary)] dark:focus:border-[var(--primary)] transition-colors"
 />
 {error && (
 <p className="mt-2 text-sm text-[var(--state-error)]">{error}</p>
 )}

 {/* Example Work Lists */}
 <div className="mt-4 p-3 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] border border-[var(--border)]  rounded-lg">
 <p className="text-xs font-medium text-[var(--foreground)] mb-2">
 Common Work Lists:
 </p>
 <div className="flex flex-wrap gap-2">
 {["WL-101", "WL-102", "WL-103", "WL-104"].map((wl) => (
 <button
 key={wl}
 onClick={() => setWorkListInput(wl)}
 className="px-3 py-1.5 bg-[var(--surface-container-lowest)] dark:bg-[var(--surface-container-high)] border border-[var(--border)] dark:border-[var(--border)] rounded-md text-xs text-[var(--foreground)] hover:bg-[var(--primary)]/10 /10 hover:border-[var(--primary)] dark:hover:border-[var(--primary)] transition-colors"
 >
 {wl}
 </button>
 ))}
 </div>
 </div>
 </div>

 {/* Footer Actions */}
 <div className="p-6 border-t border-[var(--border)]  flex gap-3">
 <button
 onClick={onClose}
 className="flex-1 px-4 py-2.5 bg-[var(--surface-container-low)] dark:bg-[var(--card)] hover:bg-[var(--surface-container-high)] text-[var(--foreground)]  rounded-lg transition-colors font-medium"
 >
 Cancel
 </button>
 <button
 onClick={handleSubmit}
 className="flex-1 px-4 py-2.5 bg-[var(--primary)]  hover:opacity-90 active:scale-[0.98] text-[var(--primary-foreground)] rounded-lg transition-colors font-medium "
 >
 Start Troubleshooting
 </button>
 </div>
 </motion.div>
 </motion.div>
 );
}