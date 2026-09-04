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
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Center Modal */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-2xl overflow-hidden"
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
              <MessageSquare size={20} className="text-[#0d9488] dark:text-[#50e080]" />
            </div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
              Show/Hide Columns
            </h2>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">
            Choose how you'd like to manage column visibility
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Option 1: Interactive Flow */}
            <button
              onClick={() => setSelectedOption("interactive")}
              className="group p-6 bg-gradient-to-br from-[#0d9488]/5 to-[#0d9488]/10 dark:from-[#50e080]/5 dark:to-[#50e080]/10 hover:from-[#0d9488]/10 hover:to-[#0d9488]/20 dark:hover:from-[#50e080]/10 dark:hover:to-[#50e080]/20 border-2 border-[#0d9488]/30 dark:border-[#50e080]/30 hover:border-[#0d9488] dark:hover:border-[#50e080] rounded-xl text-left transition-all"
            >
              <div className="w-12 h-12 bg-[#0d9488] dark:bg-[#50e080] rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-[#0d9488]/30 dark:shadow-[#50e080]/30">
                <MessageSquare size={24} className="text-white" />
              </div>
              <h3 className="text-zinc-900 dark:text-white font-bold mb-2 text-lg">
                Option 1: Let me guide you
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-3">
                I'll ask you a few questions to help you show or hide columns interactively.
              </p>
              <ul className="space-y-1.5 text-sm text-zinc-600 dark:text-zinc-400">
                <li className="flex items-start gap-2">
                  <span className="text-[#0d9488] dark:text-[#50e080] mt-0.5">•</span>
                  <span>Select which screen to manage</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0d9488] dark:text-[#50e080] mt-0.5">•</span>
                  <span>Choose columns to show, hide, or pin</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0d9488] dark:text-[#50e080] mt-0.5">•</span>
                  <span>Review changes before applying</span>
                </li>
              </ul>
              <div className="mt-4 pt-4 border-t border-[#0d9488]/20 dark:border-[#50e080]/20">
                <span className="text-[#0d9488] dark:text-[#50e080] font-semibold text-sm group-hover:underline">
                  Start interactive flow →
                </span>
              </div>
            </button>

            {/* Option 2: Property Visibility Guide */}
            <button
              onClick={() => setSelectedOption("guide")}
              className="group p-6 bg-gradient-to-br from-blue-500/5 to-blue-500/10 dark:from-blue-400/5 dark:to-blue-400/10 hover:from-blue-500/10 hover:to-blue-500/20 dark:hover:from-blue-400/10 dark:hover:to-blue-400/20 border-2 border-blue-500/30 dark:border-blue-400/30 hover:border-blue-500 dark:hover:border-blue-400 rounded-xl text-left transition-all"
            >
              <div className="w-12 h-12 bg-blue-500 dark:bg-blue-400 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/30 dark:shadow-blue-400/30">
                <BookOpen size={24} className="text-white" />
              </div>
              <h3 className="text-zinc-900 dark:text-white font-bold mb-2 text-lg">
                Option 2: Show me the steps
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-3">
                Learn how to use the Property Visibility screen to manage columns yourself.
              </p>
              <ul className="space-y-1.5 text-sm text-zinc-600 dark:text-zinc-400">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 dark:text-blue-400 mt-0.5">•</span>
                  <span>Navigate to Property Visibility</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 dark:text-blue-400 mt-0.5">•</span>
                  <span>Step-by-step instructions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 dark:text-blue-400 mt-0.5">•</span>
                  <span>Direct link to the screen</span>
                </li>
              </ul>
              <div className="mt-4 pt-4 border-t border-blue-500/20 dark:border-blue-400/20">
                <span className="text-blue-500 dark:text-blue-400 font-semibold text-sm group-hover:underline">
                  View instructions →
                </span>
              </div>
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-6 p-4 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-lg">
            <p className="text-zinc-600 dark:text-zinc-400 text-sm">
              💡 <strong className="text-zinc-900 dark:text-white">Not sure which to choose?</strong> Use Option 1 if you want me to help you make changes right now. Use Option 2 if you want to learn the process for future reference.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-lg transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}