import { X, BookOpen, ArrowRight, Eye, EyeOff, Pin } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

interface PropertyVisibilityGuideProps {
  onClose: () => void;
}

export function PropertyVisibilityGuide({ onClose }: PropertyVisibilityGuideProps) {
  const navigate = useNavigate();

  const handleGoToPropertyVisibility = () => {
    navigate("/app/property-visibility");
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
        className="relative w-full max-w-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full flex items-center justify-center transition-colors z-10"
        >
          <X size={16} className="text-zinc-600 dark:text-zinc-400" />
        </button>

        {/* Header */}
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex-shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <BookOpen size={20} className="text-blue-600 dark:text-blue-500" />
            </div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
              How to Use Property Visibility
            </h2>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">
            Learn how to manage column visibility using the Property Visibility screen
          </p>
        </div>

        {/* Content - Scrollable */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Step 1 */}
          <div className="mb-6">
            <div className="flex items-start gap-4 mb-3">
              <div className="flex-shrink-0 w-8 h-8 bg-[#0d9488] dark:bg-[#50e080] rounded-full flex items-center justify-center text-white font-bold">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-zinc-900 dark:text-white font-semibold mb-2">
                  Navigate to Property Visibility
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-3">
                  Go to <strong>Navigation → System → Property Visibility</strong> or click the button at the bottom of this guide.
                </p>
                <div className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-lg p-3">
                  <p className="text-zinc-900 dark:text-white text-sm font-mono">
                    Navigation → System → Property Visibility
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="mb-6">
            <div className="flex items-start gap-4 mb-3">
              <div className="flex-shrink-0 w-8 h-8 bg-[#0d9488] dark:bg-[#50e080] rounded-full flex items-center justify-center text-white font-bold">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-zinc-900 dark:text-white font-semibold mb-2">
                  Select the Screen
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-3">
                  Use the <strong>Screen</strong> dropdown to select which screen you want to manage columns for (e.g., Work List, Analytics, etc.).
                </p>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="mb-6">
            <div className="flex items-start gap-4 mb-3">
              <div className="flex-shrink-0 w-8 h-8 bg-[#0d9488] dark:bg-[#50e080] rounded-full flex items-center justify-center text-white font-bold">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-zinc-900 dark:text-white font-semibold mb-2">
                  Manage Column Visibility
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-3">
                  You can perform three actions on columns:
                </p>
                <div className="space-y-3">
                  {/* Show */}
                  <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Eye size={16} className="text-green-600 dark:text-green-500" />
                    </div>
                    <div>
                      <h4 className="text-zinc-900 dark:text-white font-medium text-sm mb-1">Show Columns</h4>
                      <p className="text-zinc-600 dark:text-zinc-400 text-xs">
                        Toggle the visibility switch <strong>ON</strong> to show a column in the grid.
                      </p>
                    </div>
                  </div>

                  {/* Hide */}
                  <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <EyeOff size={16} className="text-amber-600 dark:text-amber-500" />
                    </div>
                    <div>
                      <h4 className="text-zinc-900 dark:text-white font-medium text-sm mb-1">Hide Columns</h4>
                      <p className="text-zinc-600 dark:text-zinc-400 text-xs">
                        Toggle the visibility switch <strong>OFF</strong> to hide a column from the grid.
                      </p>
                    </div>
                  </div>

                  {/* Pin */}
                  <div className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Pin size={16} className="text-purple-600 dark:text-purple-500" />
                    </div>
                    <div>
                      <h4 className="text-zinc-900 dark:text-white font-medium text-sm mb-1">Pin Columns</h4>
                      <p className="text-zinc-600 dark:text-zinc-400 text-xs">
                        Click the pin icon to keep a column fixed on the left side of the grid.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="mb-6">
            <div className="flex items-start gap-4 mb-3">
              <div className="flex-shrink-0 w-8 h-8 bg-[#0d9488] dark:bg-[#50e080] rounded-full flex items-center justify-center text-white font-bold">
                4
              </div>
              <div className="flex-1">
                <h3 className="text-zinc-900 dark:text-white font-semibold mb-2">
                  Save Your Changes
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-3">
                  Your changes are saved automatically. Navigate to the screen you modified to see the updated column visibility.
                </p>
              </div>
            </div>
          </div>

          {/* Additional Tips */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h4 className="text-blue-900 dark:text-blue-300 font-semibold text-sm mb-2 flex items-center gap-2">
              <span>💡</span>
              <span>Pro Tips</span>
            </h4>
            <ul className="space-y-1 text-blue-800 dark:text-blue-300 text-sm">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Use the search bar to quickly find specific columns</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Pin frequently used columns for quick access</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>You can also ask me to "show [column name] on [screen name]" for quick changes</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 flex gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-lg transition-colors font-medium"
          >
            Close
          </button>
          <button
            onClick={handleGoToPropertyVisibility}
            className="flex-1 px-4 py-2.5 bg-[#0d9488] dark:bg-[#50e080] hover:bg-[#0f766e] dark:hover:bg-[#3bc76a] text-white rounded-lg transition-colors font-medium shadow-lg shadow-[#0d9488]/30 dark:shadow-[#50e080]/30 flex items-center justify-center gap-2"
          >
            <span>Take me to Property Visibility</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
