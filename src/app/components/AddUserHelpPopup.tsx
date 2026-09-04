import { useNavigate } from "react-router-dom";
import { X, CheckCircle2, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

interface AddUserHelpPopupProps {
  onClose: () => void;
}

export function AddUserHelpPopup({ onClose }: AddUserHelpPopupProps) {
  const navigate = useNavigate();

  const handleNavigateToAddUser = () => {
    navigate("/app/user-management?add=true");
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
        className="relative w-full max-w-3xl max-h-[90vh] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-2xl overflow-y-auto"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full flex items-center justify-center transition-colors z-10"
        >
          <X size={20} className="text-zinc-900 dark:text-white" />
        </button>

        {/* Panel Content */}
        <div className="p-8 pt-16">
          {/* Title */}
          <div className="mb-8">
            <h2 className="text-zinc-900 dark:text-white text-2xl font-bold mb-2">How to Add a New User</h2>
            <p className="text-zinc-600 dark:text-zinc-400">Follow these steps to create a new user account in the system.</p>
          </div>

          {/* Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-[#0d9488] dark:bg-[#50e080] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                <h3 className="text-zinc-900 dark:text-white text-xl font-semibold">Steps to Add a User</h3>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-[#0d9488] dark:text-[#50e080] flex-shrink-0 mt-0.5" />
                  <p className="text-zinc-700 dark:text-zinc-300">
                    Navigate to the <span className="text-zinc-900 dark:text-white font-medium">User Management</span> screen
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-[#0d9488] dark:text-[#50e080] flex-shrink-0 mt-0.5" />
                  <p className="text-zinc-700 dark:text-zinc-300">
                    Click the <span className="text-zinc-900 dark:text-white font-medium">Add (+)</span> button located next to the search bar
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-[#0d9488] dark:text-[#50e080] flex-shrink-0 mt-0.5" />
                  <p className="text-zinc-700 dark:text-zinc-300">
                    Fill in the <span className="text-zinc-900 dark:text-white font-medium">required fields</span>:
                  </p>
                </div>
                <div className="ml-10 space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-zinc-500 dark:text-zinc-400 text-sm">•</span>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                      <span className="font-medium text-zinc-900 dark:text-white">Username</span> - A unique identifier for the user
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-zinc-500 dark:text-zinc-400 text-sm">•</span>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                      <span className="font-medium text-zinc-900 dark:text-white">First Name</span> - User's first name
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-zinc-500 dark:text-zinc-400 text-sm">•</span>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                      <span className="font-medium text-zinc-900 dark:text-white">Last Name</span> - User's last name
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-zinc-500 dark:text-zinc-400 text-sm">•</span>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                      <span className="font-medium text-zinc-900 dark:text-white">Email</span> - User's email address
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-zinc-500 dark:text-zinc-400 text-sm">•</span>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                      <span className="font-medium text-zinc-900 dark:text-white">Password</span> - Initial password for the account
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-zinc-500 dark:text-zinc-400 text-sm">•</span>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                      <span className="font-medium text-zinc-900 dark:text-white">Confirm Password</span> - Re-enter the password
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-[#0d9488] dark:text-[#50e080] flex-shrink-0 mt-0.5" />
                  <p className="text-zinc-700 dark:text-zinc-300">
                    Set <span className="text-zinc-900 dark:text-white font-medium">preferences</span> like Localization and Theme
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-[#0d9488] dark:text-[#50e080] flex-shrink-0 mt-0.5" />
                  <p className="text-zinc-700 dark:text-zinc-300">
                    Switch to the <span className="text-zinc-900 dark:text-white font-medium">Groups</span> tab to assign the user to security groups
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-[#0d9488] dark:text-[#50e080] flex-shrink-0 mt-0.5" />
                  <p className="text-zinc-700 dark:text-zinc-300">
                    Click <span className="text-zinc-900 dark:text-white font-medium">Save</span> to create the user account
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-700">
                <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-3">Ready to add a new user?</p>
                <button
                  onClick={handleNavigateToAddUser}
                  className="w-full bg-[#0d9488] dark:bg-[#50e080] hover:bg-[#0f766e] dark:hover:bg-[#3bc76a] text-white font-medium px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  Go to User Management & Add User
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Additional Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6"
          >
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
              <h4 className="text-blue-900 dark:text-blue-300 font-semibold mb-3 flex items-center gap-2">
                <span>💡</span>
                <span>Helpful Tips</span>
              </h4>
              <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Username cannot be changed after creation, so choose carefully</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Users must be assigned to at least one security group to access the system</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>You can edit user details anytime by clicking on their row in the User Management grid</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>The "User Enabled" checkbox controls whether the account is active</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}