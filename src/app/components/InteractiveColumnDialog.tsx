import { X, Eye, EyeOff, Pin, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { ColumnActionConfirmation } from "./ColumnActionConfirmation";

interface InteractiveColumnDialogProps {
  onClose: () => void;
}

// Available screens and their columns
const screenOptions = {
  "work list": {
    displayName: "Work List",
    path: "/app/worklist",
    columns: [
      { key: "attribute1", name: "Attribute 1" },
      { key: "attribute2", name: "Attribute 2" },
      { key: "attribute3", name: "Attribute 3" },
      { key: "attribute4", name: "Attribute 4" },
      { key: "attribute5", name: "Attribute 5" },
      { key: "workList", name: "Work List" },
      { key: "type", name: "Type" },
      { key: "status", name: "Status" },
      { key: "priority", name: "Priority" },
      { key: "priorityDateTime", name: "Priority Date Time" },
      { key: "isHot", name: "Hot" },
      { key: "subType", name: "Sub Type" },
      { key: "started", name: "Started" },
      { key: "storage", name: "Storage" },
      { key: "destination", name: "Destination" },
      { key: "created", name: "Created" },
      { key: "modified", name: "Modified" },
    ]
  }
};

type Step = "screen" | "columns" | "action" | "confirmation";

export function InteractiveColumnDialog({ onClose }: InteractiveColumnDialogProps) {
  const [step, setStep] = useState<Step>("screen");
  const [selectedScreen, setSelectedScreen] = useState<string>("");
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [selectedAction, setSelectedAction] = useState<"show" | "hide" | "pin">("show");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [userInput, setUserInput] = useState("");

  const handleScreenSelect = (screen: string) => {
    setSelectedScreen(screen);
    setStep("columns");
    setUserInput("");
  };

  const handleColumnToggle = (columnKey: string) => {
    setSelectedColumns(prev => 
      prev.includes(columnKey) 
        ? prev.filter(k => k !== columnKey)
        : [...prev, columnKey]
    );
  };

  const handleTextInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && userInput.trim()) {
      processTextInput(userInput.toLowerCase().trim());
    }
  };

  const processTextInput = (input: string) => {
    if (step === "screen") {
      // Try to match screen name
      if (input.includes("work list") || input.includes("worklist")) {
        handleScreenSelect("work list");
      }
    } else if (step === "columns") {
      // Parse column names from input
      const screen = screenOptions[selectedScreen as keyof typeof screenOptions];
      if (screen) {
        const matchedColumns: string[] = [];
        screen.columns.forEach(col => {
          if (input.includes(col.name.toLowerCase()) || input.includes(col.key.toLowerCase())) {
            matchedColumns.push(col.key);
          }
        });
        
        if (matchedColumns.length > 0) {
          setSelectedColumns(matchedColumns);
          setUserInput("");
        }
      }
    }
  };

  const handleNext = () => {
    if (step === "columns" && selectedColumns.length > 0) {
      setStep("action");
    } else if (step === "action") {
      setShowConfirmation(true);
    }
  };

  const handleBack = () => {
    if (step === "action") {
      setStep("columns");
    } else if (step === "columns") {
      setStep("screen");
      setSelectedColumns([]);
    }
  };

  if (showConfirmation) {
    const screen = screenOptions[selectedScreen as keyof typeof screenOptions];
    const columnActions = selectedColumns.map(columnKey => {
      const column = screen.columns.find(c => c.key === columnKey);
      return {
        action: selectedAction,
        columnKey,
        columnDisplayName: column?.name || columnKey
      };
    });

    return (
      <ColumnActionConfirmation
        columnActions={columnActions}
        screen={selectedScreen}
        screenPath={screen.path}
        onClose={onClose}
      />
    );
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
              <MessageSquare size={20} className="text-[#0d9488] dark:text-[#50e080]" />
            </div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
              Column Management
            </h2>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">
            Let me help you manage column visibility
          </p>
        </div>

        {/* Content */}
        <div className="p-6 min-h-[300px]">
          <AnimatePresence mode="wait">
            {/* Step 1: Select Screen */}
            {step === "screen" && (
              <motion.div
                key="screen"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="mb-4">
                  <h3 className="text-zinc-900 dark:text-white font-semibold mb-1">
                    Which screen would you like to manage columns for?
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                    Select a screen or type the screen name below
                  </p>
                </div>

                <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl px-4 py-3 border border-zinc-200 dark:border-zinc-700">
                  <MessageSquare size={16} className="text-[#0d9488] dark:text-[#50e080]" />
                  <input
                    type="text"
                    placeholder="e.g., work list, analytics..."
                    className="flex-1 bg-transparent text-zinc-900 dark:text-white placeholder-zinc-500 outline-none"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={handleTextInput}
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {Object.entries(screenOptions).map(([key, screen]) => (
                    <button
                      key={key}
                      onClick={() => handleScreenSelect(key)}
                      className="p-4 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-[#0d9488]/10 dark:hover:bg-[#50e080]/10 border-2 border-zinc-200 dark:border-zinc-700 hover:border-[#0d9488] dark:hover:border-[#50e080] rounded-lg text-left transition-all"
                    >
                      <h4 className="text-zinc-900 dark:text-white font-medium mb-1">
                        {screen.displayName}
                      </h4>
                      <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                        {screen.columns.length} columns available
                      </p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Select Columns */}
            {step === "columns" && selectedScreen && (
              <motion.div
                key="columns"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="mb-4">
                  <h3 className="text-zinc-900 dark:text-white font-semibold mb-1">
                    Which columns would you like to manage?
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                    Select columns or type column names (e.g., "attribute 1, priority, status")
                  </p>
                </div>

                <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl px-4 py-3 border border-zinc-200 dark:border-zinc-700 mb-4">
                  <MessageSquare size={16} className="text-[#0d9488] dark:text-[#50e080]" />
                  <input
                    type="text"
                    placeholder="e.g., attribute 1, priority, status..."
                    className="flex-1 bg-transparent text-zinc-900 dark:text-white placeholder-zinc-500 outline-none"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={handleTextInput}
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
                  {screenOptions[selectedScreen as keyof typeof screenOptions].columns.map(column => (
                    <button
                      key={column.key}
                      onClick={() => handleColumnToggle(column.key)}
                      className={`p-3 rounded-lg text-left transition-all ${
                        selectedColumns.includes(column.key)
                          ? "bg-[#0d9488]/20 dark:bg-[#50e080]/20 border-2 border-[#0d9488] dark:border-[#50e080]"
                          : "bg-zinc-50 dark:bg-zinc-800/50 border-2 border-zinc-200 dark:border-zinc-700 hover:border-[#0d9488]/50 dark:hover:border-[#50e080]/50"
                      }`}
                    >
                      <span className="text-zinc-900 dark:text-white text-sm font-medium">
                        {column.name}
                      </span>
                    </button>
                  ))}
                </div>

                {selectedColumns.length > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-blue-800 dark:text-blue-300 text-sm">
                      {selectedColumns.length} column{selectedColumns.length > 1 ? "s" : ""} selected
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 3: Select Action */}
            {step === "action" && (
              <motion.div
                key="action"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="mb-4">
                  <h3 className="text-zinc-900 dark:text-white font-semibold mb-1">
                    What would you like to do with these columns?
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                    Choose an action to apply to the selected columns
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={() => setSelectedAction("show")}
                    className={`p-4 rounded-lg text-left transition-all ${
                      selectedAction === "show"
                        ? "bg-green-50 dark:bg-green-900/20 border-2 border-green-500"
                        : "bg-zinc-50 dark:bg-zinc-800/50 border-2 border-zinc-200 dark:border-zinc-700 hover:border-green-500/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                        <Eye size={20} className="text-green-600 dark:text-green-500" />
                      </div>
                      <div>
                        <h4 className="text-zinc-900 dark:text-white font-medium mb-1">Show Columns</h4>
                        <p className="text-zinc-600 dark:text-zinc-400 text-sm">Make these columns visible</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedAction("hide")}
                    className={`p-4 rounded-lg text-left transition-all ${
                      selectedAction === "hide"
                        ? "bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-500"
                        : "bg-zinc-50 dark:bg-zinc-800/50 border-2 border-zinc-200 dark:border-zinc-700 hover:border-amber-500/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                        <EyeOff size={20} className="text-amber-600 dark:text-amber-500" />
                      </div>
                      <div>
                        <h4 className="text-zinc-900 dark:text-white font-medium mb-1">Hide Columns</h4>
                        <p className="text-zinc-600 dark:text-zinc-400 text-sm">Remove these columns from view</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedAction("pin")}
                    className={`p-4 rounded-lg text-left transition-all ${
                      selectedAction === "pin"
                        ? "bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-500"
                        : "bg-zinc-50 dark:bg-zinc-800/50 border-2 border-zinc-200 dark:border-zinc-700 hover:border-purple-500/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                        <Pin size={20} className="text-purple-600 dark:text-purple-500" />
                      </div>
                      <div>
                        <h4 className="text-zinc-900 dark:text-white font-medium mb-1">Pin Columns</h4>
                        <p className="text-zinc-600 dark:text-zinc-400 text-sm">Keep these columns fixed on the left</p>
                      </div>
                    </div>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 flex gap-3">
          {step !== "screen" && (
            <button
              onClick={handleBack}
              className="px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-lg transition-colors font-medium"
            >
              Back
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-lg transition-colors font-medium"
          >
            Cancel
          </button>
          {step === "columns" && selectedColumns.length > 0 && (
            <button
              onClick={handleNext}
              className="flex-1 px-4 py-2.5 bg-[#0d9488] dark:bg-[#50e080] hover:bg-[#0f766e] dark:hover:bg-[#3bc76a] text-white rounded-lg transition-colors font-medium shadow-lg shadow-[#0d9488]/30 dark:shadow-[#50e080]/30"
            >
              Next
            </button>
          )}
          {step === "action" && (
            <button
              onClick={handleNext}
              className="flex-1 px-4 py-2.5 bg-[#0d9488] dark:bg-[#50e080] hover:bg-[#0f766e] dark:hover:bg-[#3bc76a] text-white rounded-lg transition-colors font-medium shadow-lg shadow-[#0d9488]/30 dark:shadow-[#50e080]/30"
            >
              Review Changes
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
