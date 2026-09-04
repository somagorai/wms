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
            <h2 className="text-zinc-900 dark:text-white text-2xl font-bold mb-2">How to Assign a Work List to a Workstation</h2>
            <p className="text-zinc-600 dark:text-zinc-400">There are two ways to assign a work list to a workstation. Choose the method that works best for you.</p>
          </div>

          {/* Option 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <div className="bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-[#0d9488] dark:bg-[#50e080] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                <h3 className="text-zinc-900 dark:text-white text-xl font-semibold">Via Workstations Button</h3>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-[#0d9488] dark:text-[#50e080] flex-shrink-0 mt-0.5" />
                  <p className="text-zinc-700 dark:text-zinc-300">
                    Go to the <span className="text-zinc-900 dark:text-white font-medium">Work List</span> screen
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-[#0d9488] dark:text-[#50e080] flex-shrink-0 mt-0.5" />
                  <p className="text-zinc-700 dark:text-zinc-300">
                    Click on the <span className="text-zinc-900 dark:text-white font-medium">Workstations</span> button
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-[#0d9488] dark:text-[#50e080] flex-shrink-0 mt-0.5" />
                  <p className="text-zinc-700 dark:text-zinc-300">
                    Select a <span className="text-zinc-900 dark:text-white font-medium">workstation/sortbar</span> combination from the list by clicking on the sortbar row or selecting it from the workstation dropdown
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-[#0d9488] dark:text-[#50e080] flex-shrink-0 mt-0.5" />
                  <p className="text-zinc-700 dark:text-zinc-300">
                    Select a <span className="text-zinc-900 dark:text-white font-medium">work list</span> to assign
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-[#0d9488] dark:text-[#50e080] flex-shrink-0 mt-0.5" />
                  <p className="text-zinc-700 dark:text-zinc-300">
                    Click <span className="text-zinc-900 dark:text-white font-medium">Save</span> to complete the assignment
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-700">
                <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-3">Ready to get started?</p>
                <button
                  onClick={() => handleNavigate("/app/worklist?workstations=true")}
                  className="w-full bg-[#0d9488] dark:bg-[#50e080] hover:bg-[#0f766e] dark:hover:bg-[#3bc76a] text-white font-medium px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
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
            <div className="bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                <h3 className="text-zinc-900 dark:text-white text-xl font-semibold">Via Work List Grid</h3>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
                  <p className="text-zinc-700 dark:text-zinc-300">
                    Go to the <span className="text-zinc-900 dark:text-white font-medium">Work List</span> screen
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
                  <p className="text-zinc-700 dark:text-zinc-300">
                    Find a <span className="text-zinc-900 dark:text-white font-medium">work list</span> in the grid
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
                  <p className="text-zinc-700 dark:text-zinc-300">
                    <span className="text-zinc-900 dark:text-white font-medium">Click on the work list</span> to open the detail panel
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
                  <p className="text-zinc-700 dark:text-zinc-300">
                    Click the <span className="text-zinc-900 dark:text-white font-medium">Assign</span> tab
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
                  <p className="text-zinc-700 dark:text-zinc-300">
                    Select an available <span className="text-zinc-900 dark:text-white font-medium">workstation/sortbar</span> combination from the dropdown
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
                  <p className="text-zinc-700 dark:text-zinc-300">
                    Click <span className="text-zinc-900 dark:text-white font-medium">Save</span> to complete the assignment
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-700">
                <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-3">Ready to get started?</p>
                <button
                  onClick={() => handleNavigate("/app/worklist")}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
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