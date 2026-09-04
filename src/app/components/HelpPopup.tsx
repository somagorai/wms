import { useNavigate } from "react-router-dom";
import { X, CheckCircle2, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

interface HelpPopupProps {
 onClose: () => void;
}

export function HelpPopup({ onClose }: HelpPopupProps) {
 const navigate = useNavigate();

 const handleNavigate = (path: string) => {
 navigate(path);
 onClose();
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
 className="relative w-full max-w-3xl max-h-[90vh] bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] border border-[var(--border)]  rounded-2xl overflow-y-auto"
 >
 {/* Close button */}
 <button
 onClick={onClose}
 className="absolute top-6 right-6 w-10 h-10 bg-[var(--surface-container-low)] dark:bg-[var(--card)] hover:bg-[var(--surface-container-high)] rounded-full flex items-center justify-center transition-colors z-10"
 >
 <X size={20} className="text-[var(--foreground)] " />
 </button>

 {/* Panel Content */}
 <div className="p-8 pt-16">
 {/* Title */}
 <div className="mb-8">
 <h2 className="text-[var(--foreground)]  text-2xl font-bold mb-2">How to Assign a Work List to a Workstation</h2>
 <p className="text-[var(--muted-foreground)]">There are two ways to assign a work list to a workstation. Choose the method that works best for you.</p>
 </div>

 {/* Option 1 */}
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.1 }}
 className="mb-6"
 >
 <div className="bg-[var(--surface-container-low)] dark:bg-[var(--card)] border border-[var(--border)]  rounded-xl p-6">
 <div className="flex items-center gap-3 mb-4">
 <div className="w-8 h-8 bg-[var(--primary)]  rounded-full flex items-center justify-center flex-shrink-0">
 <span className="text-[var(--foreground)] font-bold text-sm">1</span>
 </div>
 <h3 className="text-[var(--foreground)]  text-xl font-semibold">Via Workstations Button</h3>
 </div>

 <div className="space-y-3 mb-6">
 <div className="flex items-start gap-3">
 <CheckCircle2 size={20} className="text-[var(--primary)] dark:text-[var(--primary)] flex-shrink-0 mt-0.5" />
 <p className="text-[var(--foreground)]">
 Go to the <span className="text-[var(--foreground)]  font-medium">Work List</span> screen
 </p>
 </div>
 <div className="flex items-start gap-3">
 <CheckCircle2 size={20} className="text-[var(--primary)] dark:text-[var(--primary)] flex-shrink-0 mt-0.5" />
 <p className="text-[var(--foreground)]">
 Click on the <span className="text-[var(--foreground)]  font-medium">Workstations</span> button
 </p>
 </div>
 <div className="flex items-start gap-3">
 <CheckCircle2 size={20} className="text-[var(--primary)] dark:text-[var(--primary)] flex-shrink-0 mt-0.5" />
 <p className="text-[var(--foreground)]">
 Select a <span className="text-[var(--foreground)]  font-medium">workstation/sortbar</span> combination from the list by clicking on the sortbar row or selecting it from the workstation dropdown
 </p>
 </div>
 <div className="flex items-start gap-3">
 <CheckCircle2 size={20} className="text-[var(--primary)] dark:text-[var(--primary)] flex-shrink-0 mt-0.5" />
 <p className="text-[var(--foreground)]">
 Select a <span className="text-[var(--foreground)]  font-medium">work list</span> to assign
 </p>
 </div>
 <div className="flex items-start gap-3">
 <CheckCircle2 size={20} className="text-[var(--primary)] dark:text-[var(--primary)] flex-shrink-0 mt-0.5" />
 <p className="text-[var(--foreground)]">
 Click <span className="text-[var(--foreground)]  font-medium">Save</span> to complete the assignment
 </p>
 </div>
 </div>

 <div className="pt-4 border-t border-[var(--border)] ">
 <p className="text-[var(--muted-foreground)] text-sm mb-3">Ready to get started?</p>
 <button
 onClick={() => handleNavigate("/app/worklist?workstations=true")}
 className="w-full bg-[var(--primary)]  hover:opacity-90 active:scale-[0.98] text-[var(--primary-foreground)] font-medium px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
 >
 Go to Work List Screen with Workstations
 <ArrowRight size={18} />
 </button>
 </div>
 </div>
 </motion.div>

 {/* Option 2 */}
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.2 }}
 >
 <div className="bg-[var(--surface-container-low)] dark:bg-[var(--card)] border border-[var(--border)]  rounded-xl p-6">
 <div className="flex items-center gap-3 mb-4">
 <div className="w-8 h-8 bg-[var(--state-info)] rounded-full flex items-center justify-center flex-shrink-0">
 <span className="text-[var(--foreground)] font-bold text-sm">2</span>
 </div>
 <h3 className="text-[var(--foreground)]  text-xl font-semibold">Via Work List Grid</h3>
 </div>

 <div className="space-y-3 mb-6">
 <div className="flex items-start gap-3">
 <CheckCircle2 size={20} className="text-[var(--state-info)] flex-shrink-0 mt-0.5" />
 <p className="text-[var(--foreground)]">
 Go to the <span className="text-[var(--foreground)]  font-medium">Work List</span> screen
 </p>
 </div>
 <div className="flex items-start gap-3">
 <CheckCircle2 size={20} className="text-[var(--state-info)] flex-shrink-0 mt-0.5" />
 <p className="text-[var(--foreground)]">
 Find a <span className="text-[var(--foreground)]  font-medium">work list</span> in the grid
 </p>
 </div>
 <div className="flex items-start gap-3">
 <CheckCircle2 size={20} className="text-[var(--state-info)] flex-shrink-0 mt-0.5" />
 <p className="text-[var(--foreground)]">
 <span className="text-[var(--foreground)]  font-medium">Click on the work list</span> to open the detail panel
 </p>
 </div>
 <div className="flex items-start gap-3">
 <CheckCircle2 size={20} className="text-[var(--state-info)] flex-shrink-0 mt-0.5" />
 <p className="text-[var(--foreground)]">
 Click the <span className="text-[var(--foreground)]  font-medium">Assign</span> tab
 </p>
 </div>
 <div className="flex items-start gap-3">
 <CheckCircle2 size={20} className="text-[var(--state-info)] flex-shrink-0 mt-0.5" />
 <p className="text-[var(--foreground)]">
 Select an available <span className="text-[var(--foreground)]  font-medium">workstation/sortbar</span> combination from the dropdown
 </p>
 </div>
 <div className="flex items-start gap-3">
 <CheckCircle2 size={20} className="text-[var(--state-info)] flex-shrink-0 mt-0.5" />
 <p className="text-[var(--foreground)]">
 Click <span className="text-[var(--foreground)]  font-medium">Save</span> to complete the assignment
 </p>
 </div>
 </div>

 <div className="pt-4 border-t border-[var(--border)] ">
 <p className="text-[var(--muted-foreground)] text-sm mb-3">Ready to get started?</p>
 <button
 onClick={() => handleNavigate("/app/worklist")}
 className="w-full bg-[var(--state-info-container)] hover:bg-[var(--state-info)] text-[var(--state-on-info-container)] font-medium px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
 >
 Go to Work List Screen
 <ArrowRight size={18} />
 </button>
 </div>
 </div>
 </motion.div>
 </div>
 </motion.div>
 </motion.div>
 );
}