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
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Center Modal */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-2xl overflow-hidden"
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
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
              <AlertTriangle size={20} className="text-amber-600 dark:text-amber-500" />
            </div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
              Troubleshoot Missing Replen Result
            </h2>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">
            Which Work List would you like to troubleshoot?
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          <label className="block text-sm font-medium text-zinc-900 dark:text-white mb-2">
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
            className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-[#0d9488] dark:focus:border-[#50e080] transition-colors"
          />
          {error && (
            <p className="mt-2 text-sm text-red-500">{error}</p>
          )}

          {/* Example Work Lists */}
          <div className="mt-4 p-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-lg">
            <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Common Work Lists:
            </p>
            <div className="flex flex-wrap gap-2">
              {["WL-101", "WL-102", "WL-103", "WL-104"].map((wl) => (
                <button
                  key={wl}
                  onClick={() => setWorkListInput(wl)}
                  className="px-3 py-1.5 bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded-md text-xs text-zinc-700 dark:text-zinc-300 hover:bg-[#0d9488]/10 dark:hover:bg-[#50e080]/10 hover:border-[#0d9488] dark:hover:border-[#50e080] transition-colors"
                >
                  {wl}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-lg transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2.5 bg-[#0d9488] dark:bg-[#50e080] hover:bg-[#0f766e] dark:hover:bg-[#3bc76a] text-white rounded-lg transition-colors font-medium shadow-lg shadow-[#0d9488]/30 dark:shadow-[#50e080]/30"
          >
            Start Troubleshooting
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}