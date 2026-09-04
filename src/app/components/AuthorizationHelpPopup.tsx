import { useNavigate } from "react-router-dom";
import { X, Users, Shield, Filter } from "lucide-react";
import { motion } from "motion/react";

interface AuthorizationHelpPopupProps {
 onClose: () => void;
 authorization: string;
}

export function AuthorizationHelpPopup({ onClose, authorization }: AuthorizationHelpPopupProps) {
 const navigate = useNavigate();

 const handleViewUsers = () => {
 // Navigate to User Management with the authorization filter pre-applied
 navigate(`/app/user-management?authorization=${encodeURIComponent(authorization)}`);
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
 className="relative w-full max-w-2xl bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] border border-[var(--border)]  rounded-2xl overflow-hidden"
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
 <Shield size={20} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 </div>
 <h2 className="text-xl font-bold text-[var(--foreground)] ">
 View Users with Authorization
 </h2>
 </div>
 <p className="text-[var(--muted-foreground)] text-sm">
 How to view users who have access to <span className="font-semibold text-[var(--primary)] dark:text-[var(--primary)]">{authorization}</span>
 </p>
 </div>

 {/* Content */}
 <div className="p-6">
 <div className="space-y-4 mb-6">
 {/* Step 1 */}
 <div className="flex gap-4">
 <div className="flex-shrink-0 w-8 h-8 bg-[var(--primary)]  rounded-full flex items-center justify-center text-[var(--primary-foreground)] font-bold text-sm">
 1
 </div>
 <div className="flex-1">
 <h3 className="font-semibold text-[var(--foreground)]  mb-1">
 Navigate to User Management
 </h3>
 <p className="text-[var(--muted-foreground)] text-sm">
 Go to <span className="font-medium">Navigation → System → User Management</span>
 </p>
 </div>
 </div>

 {/* Step 2 */}
 <div className="flex gap-4">
 <div className="flex-shrink-0 w-8 h-8 bg-[var(--primary)]  rounded-full flex items-center justify-center text-[var(--primary-foreground)] font-bold text-sm">
 2
 </div>
 <div className="flex-1">
 <h3 className="font-semibold text-[var(--foreground)]  mb-1">
 Open the Filters Panel
 </h3>
 <p className="text-[var(--muted-foreground)] text-sm">
 Click the <span className="inline-flex items-center gap-1 font-medium"><Filter size={12} className="inline" /> Filter</span> button in the top right
 </p>
 </div>
 </div>

 {/* Step 3 */}
 <div className="flex gap-4">
 <div className="flex-shrink-0 w-8 h-8 bg-[var(--primary)]  rounded-full flex items-center justify-center text-[var(--primary-foreground)] font-bold text-sm">
 3
 </div>
 <div className="flex-1">
 <h3 className="font-semibold text-[var(--foreground)]  mb-1">
 Select Authorization Filter
 </h3>
 <p className="text-[var(--muted-foreground)] text-sm">
 In the Authorizations filter dropdown, search for and select <span className="font-medium text-[var(--primary)] dark:text-[var(--primary)]">"{authorization}"</span>
 </p>
 </div>
 </div>

 {/* Step 4 */}
 <div className="flex gap-4">
 <div className="flex-shrink-0 w-8 h-8 bg-[var(--primary)]  rounded-full flex items-center justify-center text-[var(--primary-foreground)] font-bold text-sm">
 4
 </div>
 <div className="flex-1">
 <h3 className="font-semibold text-[var(--foreground)]  mb-1">
 View Filtered Users
 </h3>
 <p className="text-[var(--muted-foreground)] text-sm">
 The user list will automatically filter to show only users with access to this authorization through their group memberships
 </p>
 </div>
 </div>
 </div>

 {/* Info Box */}
 <div className="bg-[var(--primary)]/5 /5 border border-[var(--primary)]/20 dark:border-[var(--primary)]/20 rounded-lg p-4 mb-6">
 <p className="text-[var(--foreground)] text-sm">
 <span className="font-semibold text-[var(--primary)] dark:text-[var(--primary)]">Note:</span> Users receive authorizations through their group memberships. The filter will show all users who belong to groups that have the selected authorization.
 </p>
 </div>

 {/* Quick Action Button */}
 <div className="flex items-center gap-3">
 <button
 onClick={handleViewUsers}
 className="flex-1 px-6 py-3 bg-[var(--primary)]  hover:opacity-90 active:scale-[0.98] text-[var(--primary-foreground)] rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
 >
 <Users size={18} />
 <span>View Users with This Authorization</span>
 </button>
 <button
 onClick={onClose}
 className="px-6 py-3 bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)] hover:bg-[var(--surface-container-high)] text-[var(--foreground)]  rounded-lg font-medium transition-colors"
 >
 Close
 </button>
 </div>
 </div>
 </motion.div>
 </motion.div>
 );
}
