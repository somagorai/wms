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
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Center Modal */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-2xl overflow-hidden"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full flex items-center justify-center transition-colors z-10"
        >
          <X size={16} className="text-zinc-600 dark:text-zinc-400" />
        </button>

        {/* Header */}
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#0d9488]/10 dark:bg-[#50e080]/10 rounded-full flex items-center justify-center">
              <Shield size={20} className="text-[#0d9488] dark:text-[#50e080]" />
            </div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
              View Users with Authorization
            </h2>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">
            How to view users who have access to <span className="font-semibold text-[#0d9488] dark:text-[#50e080]">{authorization}</span>
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4 mb-6">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#0d9488] dark:bg-[#50e080] rounded-full flex items-center justify-center text-white font-bold text-sm">
                1
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-zinc-900 dark:text-white mb-1">
                  Navigate to User Management
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                  Go to <span className="font-medium">Navigation → System → User Management</span>
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#0d9488] dark:bg-[#50e080] rounded-full flex items-center justify-center text-white font-bold text-sm">
                2
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-zinc-900 dark:text-white mb-1">
                  Open the Filters Panel
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                  Click the <span className="inline-flex items-center gap-1 font-medium"><Filter size={12} className="inline" /> Filter</span> button in the top right
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#0d9488] dark:bg-[#50e080] rounded-full flex items-center justify-center text-white font-bold text-sm">
                3
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-zinc-900 dark:text-white mb-1">
                  Select Authorization Filter
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                  In the Authorizations filter dropdown, search for and select <span className="font-medium text-[#0d9488] dark:text-[#50e080]">"{authorization}"</span>
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#0d9488] dark:bg-[#50e080] rounded-full flex items-center justify-center text-white font-bold text-sm">
                4
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-zinc-900 dark:text-white mb-1">
                  View Filtered Users
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                  The user list will automatically filter to show only users with access to this authorization through their group memberships
                </p>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-[#0d9488]/5 dark:bg-[#50e080]/5 border border-[#0d9488]/20 dark:border-[#50e080]/20 rounded-lg p-4 mb-6">
            <p className="text-zinc-700 dark:text-zinc-300 text-sm">
              <span className="font-semibold text-[#0d9488] dark:text-[#50e080]">Note:</span> Users receive authorizations through their group memberships. The filter will show all users who belong to groups that have the selected authorization.
            </p>
          </div>

          {/* Quick Action Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleViewUsers}
              className="flex-1 px-6 py-3 bg-[#0d9488] dark:bg-[#50e080] hover:bg-[#0b7a70] dark:hover:bg-[#3bc76a] text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Users size={18} />
              <span>View Users with This Authorization</span>
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-900 dark:text-white rounded-lg font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
