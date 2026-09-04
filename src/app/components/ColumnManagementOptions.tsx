import { X, MessageSquare, BookOpen } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { InteractiveColumnDialog } from "./InteractiveColumnDialog";
import { PropertyVisibilityGuide } from "./PropertyVisibilityGuide";

interface ColumnManagementOptionsProps {
 onClose: () => void;
}

export function ColumnManagementOptions({ onClose }: ColumnManagementOptionsProps) {
 const [selectedOption, setSelectedOption] = useState<"interactive" | "guide" | null>(null);

 if (selectedOption === "interactive") {
 return <InteractiveColumnDialog onClose={onClose} />;
 }

 if (selectedOption === "guide") {
 return <PropertyVisibilityGuide onClose={onClose} />;
 }

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
 className="relative w-full max-w-5xl bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] border border-[var(--border)]  rounded-2xl overflow-hidden"
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
 <div className="w-10 h-10 bg-[var(--primary)]/10 /10 rounded-full flex items-center justify-center">
 <MessageSquare size={20} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 </div>
 <h2 className="text-xl font-bold text-[var(--foreground)] ">
 Show/Hide Columns
 </h2>
 </div>
 <p className="text-[var(--muted-foreground)] text-sm">
 Choose how you'd like to manage column visibility
 </p>
 </div>

 {/* Content */}
 <div className="p-6">
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
 {/* Option 1: Interactive Flow */}
 <button
 onClick={() => setSelectedOption("interactive")}
 className="group p-6 border-2 border-[var(--primary)]/30 dark:border-[var(--primary)]/30 hover:border-[var(--primary)] dark:hover:border-[var(--primary)] rounded-xl text-left transition-all"
 >
 <div className="w-12 h-12 bg-[var(--primary)]  rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ">
 <MessageSquare size={24} className="text-[var(--foreground)]" />
 </div>
 <h3 className="text-[var(--foreground)]  font-bold mb-2 text-lg">
 Option 1: Let me guide you
 </h3>
 <p className="text-[var(--muted-foreground)] text-sm mb-3">
 I'll ask you a few questions to help you show or hide columns interactively.
 </p>
 <ul className="space-y-1.5 text-sm text-[var(--muted-foreground)]">
 <li className="flex items-start gap-2">
 <span className="text-[var(--primary)] dark:text-[var(--primary)] mt-0.5">•</span>
 <span>Select which screen to manage</span>
 </li>
 <li className="flex items-start gap-2">
 <span className="text-[var(--primary)] dark:text-[var(--primary)] mt-0.5">•</span>
 <span>Choose columns to show, hide, or pin</span>
 </li>
 <li className="flex items-start gap-2">
 <span className="text-[var(--primary)] dark:text-[var(--primary)] mt-0.5">•</span>
 <span>Review changes before applying</span>
 </li>
 </ul>
 <div className="mt-4 pt-4 border-t border-[var(--primary)]/20 dark:border-[var(--primary)]/20">
 <span className="text-[var(--primary)] dark:text-[var(--primary)] font-semibold text-sm group-hover:underline">
 Start interactive flow →
 </span>
 </div>
 </button>

 {/* Option 2: Property Visibility Guide */}
 <button
 onClick={() => setSelectedOption("guide")}
 className="group p-6 border-2 border-[var(--state-info)]/40 dark:border-[var(--state-info)]/30 hover:border-[var(--state-info)]/40 dark:hover:border-[var(--state-info)] rounded-xl text-left transition-all"
 >
 <div className="w-12 h-12 bg-[var(--state-info)] dark:bg-[var(--state-info)] rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ">
 <BookOpen size={24} className="text-[var(--foreground)]" />
 </div>
 <h3 className="text-[var(--foreground)]  font-bold mb-2 text-lg">
 Option 2: Show me the steps
 </h3>
 <p className="text-[var(--muted-foreground)] text-sm mb-3">
 Learn how to use the Property Visibility screen to manage columns yourself.
 </p>
 <ul className="space-y-1.5 text-sm text-[var(--muted-foreground)]">
 <li className="flex items-start gap-2">
 <span className="text-[var(--state-info)] dark:text-[var(--state-info)] mt-0.5">•</span>
 <span>Navigate to Property Visibility</span>
 </li>
 <li className="flex items-start gap-2">
 <span className="text-[var(--state-info)] dark:text-[var(--state-info)] mt-0.5">•</span>
 <span>Step-by-step instructions</span>
 </li>
 <li className="flex items-start gap-2">
 <span className="text-[var(--state-info)] dark:text-[var(--state-info)] mt-0.5">•</span>
 <span>Direct link to the screen</span>
 </li>
 </ul>
 <div className="mt-4 pt-4 border-t border-[var(--state-info)]/40/20 dark:border-[var(--state-info)]/20">
 <span className="text-[var(--state-info)] dark:text-[var(--state-info)] font-semibold text-sm group-hover:underline">
 View instructions →
 </span>
 </div>
 </button>
 </div>

 {/* Help Text */}
 <div className="mt-6 p-4 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] border border-[var(--border)]  rounded-lg">
 <p className="text-[var(--muted-foreground)] text-sm">
 💡 <strong className="text-[var(--foreground)] ">Not sure which to choose?</strong> Use Option 1 if you want me to help you make changes right now. Use Option 2 if you want to learn the process for future reference.
 </p>
 </div>
 </div>

 {/* Footer */}
 <div className="p-6 border-t border-[var(--border)]  flex gap-3">
 <button
 onClick={onClose}
 className="flex-1 px-4 py-2.5 bg-[var(--surface-container-low)] dark:bg-[var(--card)] hover:bg-[var(--surface-container-high)] text-[var(--foreground)]  rounded-lg transition-colors font-medium"
 >
 Cancel
 </button>
 </div>
 </motion.div>
 </motion.div>
 );
}