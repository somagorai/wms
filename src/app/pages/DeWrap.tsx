import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Home, ChevronRight, Package, Box, CheckCircle2, AlertCircle, Info, XCircle, RefreshCw, ArrowLeftRight, Archive } from "lucide-react";
import { toast } from "sonner";
import macAndCheeseImage from "../../imports/image-10.png";

// Mock data for pallet
const mockPalletData = {
  palletId: "PLT-12345",
  location: "R102S03P01",
  sku: "SKU-4521",
  description: "Kraft Macaroni & Cheese Original",
  totalLayers: 6,
  totalCases: 18,
  layersToDeWrap: 2,
  casesPerLayer: 3,
  status: "Ready for De-Wrap"
};

// Generate pallet layers
const generatePalletLayers = (totalLayers: number, casesPerLayer: number, layersToDeWrap: number) => {
  const layers = [];

  for (let i = 0; i < totalLayers; i++) {
    layers.push({
      id: `layer-${i + 1}`,
      layerNumber: i + 1,
      casesInLayer: casesPerLayer,
      needsDeWrap: i < layersToDeWrap
    });
  }

  return layers;
};

export function DeWrap() {
  const [palletPresent, setPalletPresent] = useState(false);
  const [palletConfirmed, setPalletConfirmed] = useState(false);
  const [layersConfirmed, setLayersConfirmed] = useState(false);
  const [enteredLayers, setEnteredLayers] = useState("");
  const [palletData, setPalletData] = useState(mockPalletData);
  const [palletLayers, setPalletLayers] = useState<any[]>([]);
  const [showDeWrapConfirmation, setShowDeWrapConfirmation] = useState(false);

  // Simulate pallet arrival after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setPalletPresent(true);
      toast.success(`${palletData.palletId} has arrived`, {
        description: `Location: ${palletData.location}`,
        duration: 4000,
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, [palletData.palletId, palletData.location]);

  const handleKeypadPress = (value: string) => {
    if (value === "clear") {
      setEnteredLayers("");
    } else if (value === "backspace") {
      setEnteredLayers(enteredLayers.slice(0, -1));
    } else {
      if (enteredLayers.length < 2) {
        setEnteredLayers(enteredLayers + value);
      }
    }
  };

  const handleConfirmPallet = () => {
    setPalletConfirmed(true);
  };

  const handleConfirmLayers = () => {
    const layers = parseInt(enteredLayers);
    if (layers > 0) {
      // Update pallet data with entered layers
      const updatedPalletData = {
        ...palletData,
        totalLayers: layers,
        totalCases: layers * palletData.casesPerLayer
      };
      setPalletData(updatedPalletData);

      // Generate pallet layers
      const layersList = generatePalletLayers(
        layers,
        palletData.casesPerLayer,
        palletData.layersToDeWrap
      );
      setPalletLayers(layersList);

      setLayersConfirmed(true);
    }
  };

  const handleDeWrapComplete = () => {
    setShowDeWrapConfirmation(true);
  };

  const handleConfirmDeWrap = () => {
    // Reset all states
    setShowDeWrapConfirmation(false);
    setPalletPresent(false);
    setPalletConfirmed(false);
    setLayersConfirmed(false);
    setEnteredLayers("");
    setPalletLayers([]);

    // Show success toast
    toast.success("De-Wrap completed successfully", {
      description: `${palletData.palletId} - ${palletData.layersToDeWrap} layers de-wrapped`,
      duration: 4000,
    });
  };

  const handleCancelDeWrap = () => {
    setShowDeWrapConfirmation(false);
  };

  const handleAdjustInventory = () => {
    console.log("Adjust Inventory clicked");
  };

  const handleChangeInventory = () => {
    console.log("Change Inventory clicked");
  };

  const handleSwapPallet = () => {
    console.log("Swap Pallet clicked");
  };

  const handleRequestGaylord = () => {
    console.log("Request Gaylord clicked");
  };

  const handleRejectPallet = () => {
    console.log("Reject Pallet clicked");
  };

  return (
    <div className="h-screen flex flex-col bg-zinc-950">
      {/* Header */}
      <div className="bg-zinc-900 border-b border-zinc-800 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm">
            <Link
              to="/app/home"
              className="text-zinc-400 hover:text-[#0d9488] dark:hover:text-[#50e080] transition-colors flex items-center gap-1"
            >
              <Home size={14} />
              Home
            </Link>
            <ChevronRight size={16} className="text-zinc-600" />
            <Link
              to="/app/navigation"
              className="text-zinc-400 hover:text-[#0d9488] dark:hover:text-[#50e080] transition-colors"
            >
              Navigation
            </Link>
            <ChevronRight size={16} className="text-zinc-600" />
            <Link
              to="/app/navigation?section=workstation-operations"
              className="text-zinc-400 hover:text-[#0d9488] dark:hover:text-[#50e080] transition-colors"
            >
              Workstation Operations
            </Link>
            <ChevronRight size={16} className="text-zinc-600" />
            <span className="text-white font-semibold text-lg flex items-center gap-2">
              <Package size={20} className="text-[#0d9488] dark:text-[#50e080]" />
              De-Wrap
            </span>
          </nav>

        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-6 p-6 overflow-hidden">
        {/* Left Panel - Pallet Details & Item Details */}
        <div className="w-80 flex flex-col gap-4">
          {/* Pallet Details */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#0d9488]/20 dark:bg-[#50e080]/20 rounded-lg flex items-center justify-center">
                <Package size={20} className="text-[#0d9488] dark:text-[#50e080]" />
              </div>
              <h2 className="text-lg font-semibold text-white">Pallet Details</h2>
            </div>

{!palletPresent ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Package size={48} className="text-zinc-600 mb-3" />
                <p className="text-zinc-400 text-center">No Pallet</p>
                <p className="text-zinc-600 text-sm text-center mt-2">Waiting for pallet arrival...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block">Pallet ID</label>
                  <p className="text-white font-mono font-semibold">{palletData.palletId}</p>
                </div>

                <div>
                  <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block">Location</label>
                  <p className="text-white font-mono">{palletData.location}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-800">
                  <div>
                    <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block">Cases Per Layer</label>
                    <p className="text-white font-semibold text-lg">{palletData.casesPerLayer}</p>
                  </div>
                  {layersConfirmed && (
                    <div>
                      <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block">Total Layers</label>
                      <p className="text-white font-semibold text-lg">{palletData.totalLayers}</p>
                    </div>
                  )}
                </div>

                {layersConfirmed && (
                  <div className="pt-4 border-t border-zinc-800">
                    <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block">Total Cases</label>
                    <p className="text-white font-semibold text-lg">{palletData.totalCases}</p>
                  </div>
                )}

                <div className="pt-4 border-t border-zinc-800">
                  <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block">Status</label>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p className="text-green-500 font-medium">{palletData.status}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Item Details */}
          {palletPresent && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Box size={20} className="text-blue-400" />
                </div>
                <h2 className="text-lg font-semibold text-white">Item Details</h2>
              </div>

              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 flex items-center justify-center">
                  <img
                    src={macAndCheeseImage}
                    alt="Kraft Macaroni & Cheese"
                    className="max-w-full h-auto"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block">SKU</label>
                  <p className="text-white font-mono">{palletData.sku}</p>
                </div>

                <div>
                  <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block">Description</label>
                  <p className="text-white">{palletData.description}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Center Panel - Pallet Visualization */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#0d9488]/20 dark:bg-[#50e080]/20 rounded-lg flex items-center justify-center">
                  <Box size={20} className="text-[#0d9488] dark:text-[#50e080]" />
                </div>
                <h2 className="text-lg font-semibold text-white">Pallet</h2>
              </div>

{layersConfirmed && (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500/20 border-2 border-green-500 rounded"></div>
                    <span className="text-sm text-zinc-400">Layers to De-Wrap</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-zinc-700 border-2 border-zinc-600 rounded"></div>
                    <span className="text-sm text-zinc-400">Wrapped</span>
                  </div>
                </div>
              )}
            </div>

{/* Pallet Grid, Confirmation, or Keypad */}
            <div className="flex-1 flex items-center justify-center">
              {!palletPresent ? (
                // No Pallet State
                <div className="flex flex-col items-center justify-center">
                  <Package size={96} className="text-zinc-700 mb-4" />
                  <p className="text-xl text-zinc-400 font-semibold">No Pallet</p>
                  <p className="text-zinc-600 mt-2">Waiting for pallet to arrive at station...</p>
                </div>
              ) : !palletConfirmed ? (
                // Pallet Confirmation State
                <div className="max-w-md w-full">
                  <div className="bg-zinc-800/50 rounded-xl border border-zinc-700 p-8">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package size={32} className="text-blue-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">Confirm Pallet Information</h3>
                      <p className="text-sm text-zinc-400">Please verify the pallet details below</p>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div className="bg-zinc-900/50 rounded-lg p-4">
                        <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block">Pallet ID</label>
                        <p className="text-white font-mono font-semibold text-lg">{palletData.palletId}</p>
                      </div>

                      <div className="bg-zinc-900/50 rounded-lg p-4">
                        <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block">Location</label>
                        <p className="text-white font-mono text-lg">{palletData.location}</p>
                      </div>

                      <div className="bg-zinc-900/50 rounded-lg p-4">
                        <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block">SKU</label>
                        <p className="text-white font-mono text-lg">{palletData.sku}</p>
                      </div>

                      <div className="bg-zinc-900/50 rounded-lg p-4">
                        <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block">Description</label>
                        <p className="text-white">{palletData.description}</p>
                      </div>
                    </div>

                    <button
                      onClick={handleConfirmPallet}
                      className="w-full px-6 py-4 bg-[#0d9488]/80 dark:bg-[#50e080]/80 hover:bg-[#0d9488] dark:hover:bg-[#50e080] text-white rounded-lg font-semibold transition-all shadow-lg shadow-[#0d9488]/30 dark:shadow-[#50e080]/30 hover:shadow-[#0d9488]/50 dark:hover:shadow-[#50e080]/50 border border-[#0d9488] dark:border-[#50e080] flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 size={20} />
                      Confirm Pallet
                    </button>
                  </div>
                </div>
              ) : !layersConfirmed ? (
                // Layer Entry Keypad State
                <div className="max-w-md w-full">
                  <div className="bg-zinc-800/50 rounded-xl border border-zinc-700 p-8">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package size={32} className="text-blue-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">Enter Number of Layers</h3>
                      <p className="text-sm text-zinc-400">How many layers are on this pallet?</p>
                    </div>

                    {/* Display */}
                    <div className="bg-zinc-900 rounded-lg p-6 mb-6 border-2 border-zinc-700">
                      <p className="text-4xl font-bold text-white text-center font-mono min-h-[3rem] flex items-center justify-center">
                        {enteredLayers || "0"}
                      </p>
                    </div>

                    {/* Keypad */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
                        <button
                          key={num}
                          onClick={() => handleKeypadPress(num)}
                          className="aspect-square bg-zinc-800 hover:bg-zinc-700 text-white text-2xl font-semibold rounded-lg transition-colors border border-zinc-700"
                        >
                          {num}
                        </button>
                      ))}
                      <button
                        onClick={() => handleKeypadPress("clear")}
                        className="aspect-square bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm font-semibold rounded-lg transition-colors border border-red-500/30"
                      >
                        Clear
                      </button>
                      <button
                        onClick={() => handleKeypadPress("0")}
                        className="aspect-square bg-zinc-800 hover:bg-zinc-700 text-white text-2xl font-semibold rounded-lg transition-colors border border-zinc-700"
                      >
                        0
                      </button>
                      <button
                        onClick={() => handleKeypadPress("backspace")}
                        className="aspect-square bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-semibold rounded-lg transition-colors border border-zinc-700"
                      >
                        ←
                      </button>
                    </div>

                    <button
                      onClick={handleConfirmLayers}
                      disabled={!enteredLayers || parseInt(enteredLayers) === 0}
                      className="w-full px-6 py-4 bg-green-500 hover:bg-green-600 disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 size={20} />
                      Confirm Layers
                    </button>
                  </div>
                </div>
              ) : (
                // Pallet Visualization State
                <div className="flex flex-col gap-2 p-8 bg-zinc-800/50 rounded-xl border border-zinc-700 max-w-lg w-full">
                  {palletLayers.map((layer) => (
                    <div
                      key={layer.id}
                      className={`w-full h-20 rounded-lg border-2 flex items-center justify-center transition-all ${
                        layer.needsDeWrap
                          ? 'bg-green-500/10 border-green-500 hover:bg-green-500/20'
                          : 'bg-zinc-700 border-zinc-600 hover:bg-zinc-600'
                      }`}
                    >
                      <div className="text-center">
                        <p className={`text-sm font-medium ${layer.needsDeWrap ? 'text-green-400' : 'text-zinc-400'}`}>
                          Layer {layer.layerNumber}
                        </p>
                        <p className={`text-lg font-bold ${layer.needsDeWrap ? 'text-green-300' : 'text-zinc-500'}`}>
                          {layer.casesInLayer} Cases
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Instructions & Actions */}
        <div className="w-80 flex flex-col gap-4">
          {layersConfirmed ? (
            <>
              {/* De-Wrap Instructions */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Info size={20} className="text-blue-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-white">De-Wrap Instructions</h2>
                </div>

                <div className="space-y-4">
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <p className="text-sm text-blue-400 mb-2">Layers to De-Wrap:</p>
                    <p className="text-3xl font-bold text-blue-400">{palletData.layersToDeWrap}</p>
                  </div>

                  <div className="bg-zinc-800/50 rounded-lg p-4 space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-zinc-300">Remove wrap from the top {palletData.layersToDeWrap} layer(s)</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-zinc-300">Verify all cases are accessible</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-zinc-300">Click "De-Wrap Complete" when finished</p>
                    </div>
                  </div>

                  <button
                    onClick={handleDeWrapComplete}
                    className="w-full px-4 py-3 bg-[#0d9488]/80 dark:bg-[#50e080]/80 hover:bg-[#0d9488] dark:hover:bg-[#50e080] text-white rounded-lg font-semibold transition-all shadow-lg shadow-[#0d9488]/30 dark:shadow-[#50e080]/30 hover:shadow-[#0d9488]/50 dark:hover:shadow-[#50e080]/50 border border-[#0d9488] dark:border-[#50e080] flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={20} />
                    De-Wrap Complete
                  </button>
                </div>
              </div>

              {/* Secondary Actions */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-zinc-700 rounded-lg flex items-center justify-center">
                    <Package size={20} className="text-zinc-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-white">Secondary Actions</h2>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleAdjustInventory}
                    className="w-full px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 border border-zinc-700"
                  >
                    <RefreshCw size={18} />
                    Adjust Inventory
                  </button>

                  <button
                    onClick={handleChangeInventory}
                    className="w-full px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 border border-zinc-700"
                  >
                    <ArrowLeftRight size={18} />
                    Change Inventory
                  </button>

                  <button
                    onClick={handleSwapPallet}
                    className="w-full px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 border border-zinc-700"
                  >
                    <Box size={18} />
                    Swap Pallet
                  </button>

                  <button
                    onClick={handleRequestGaylord}
                    className="w-full px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 border border-zinc-700"
                  >
                    <Archive size={18} />
                    Request Gaylord
                  </button>

                  <button
                    onClick={handleRejectPallet}
                    className="w-full px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors flex items-center justify-center gap-2 border border-red-500/30"
                  >
                    <XCircle size={18} />
                    Reject Pallet
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex-1 flex items-center justify-center">
              <div className="text-center">
                <Info size={48} className="text-zinc-700 mx-auto mb-3" />
                {!palletPresent ? (
                  <>
                    <p className="text-zinc-400">Awaiting Pallet</p>
                    <p className="text-zinc-600 text-sm mt-2">Instructions will appear when pallet arrives</p>
                  </>
                ) : !palletConfirmed ? (
                  <>
                    <p className="text-zinc-400">Confirm Pallet</p>
                    <p className="text-zinc-600 text-sm mt-2">Please confirm pallet information</p>
                  </>
                ) : (
                  <>
                    <p className="text-zinc-400">Enter Layers</p>
                    <p className="text-zinc-600 text-sm mt-2">Please enter number of layers</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* De-Wrap Confirmation Dialog */}
      {showDeWrapConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} className="text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Confirm De-Wrap Complete</h3>
              <p className="text-sm text-zinc-400">Please confirm the de-wrap operation has been completed</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-zinc-800/50 rounded-lg p-4">
                <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block">Pallet ID</label>
                <p className="text-white font-mono font-semibold text-lg">{palletData.palletId}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-800/50 rounded-lg p-4">
                  <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block">Layers De-Wrapped</label>
                  <p className="text-green-400 font-bold text-2xl">{palletData.layersToDeWrap}</p>
                </div>

                <div className="bg-zinc-800/50 rounded-lg p-4">
                  <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block">Total Cases</label>
                  <p className="text-white font-bold text-2xl">{palletData.layersToDeWrap * palletData.casesPerLayer}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCancelDeWrap}
                className="flex-1 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-semibold transition-colors border border-zinc-700"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeWrap}
                className="flex-1 px-6 py-3 bg-[#0d9488]/80 dark:bg-[#50e080]/80 hover:bg-[#0d9488] dark:hover:bg-[#50e080] text-white rounded-lg font-semibold transition-all shadow-lg shadow-[#0d9488]/30 dark:shadow-[#50e080]/30 hover:shadow-[#0d9488]/50 dark:hover:shadow-[#50e080]/50 border border-[#0d9488] dark:border-[#50e080]"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
