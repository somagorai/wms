import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Home, ChevronRight, Package, Box, CheckCircle2, AlertCircle, Info, XCircle, RefreshCw, ArrowLeftRight, Archive, Search, Check, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import macAndCheeseImage from "../../imports/image-10.png";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { Button } from "../components/ui/button";

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
 status: "Ready for DeWrap"
};

// Generate mock Gaylord LPN
const generateGaylordLPN = () => {
 return `GAY-${Math.floor(Math.random() * 90000) + 10000}`;
};

// Mock rejection reasons
const rejectionReasons = [
 { value: "damaged-cases", label: "Damaged Cases" },
 { value: "incorrect-sku", label: "Incorrect SKU" },
 { value: "incorrect-quantity", label: "Incorrect Quantity" },
 { value: "quality-issue", label: "Quality Issue" },
 { value: "expired-product", label: "Expired Product" },
 { value: "wrong-location", label: "Wrong Location" },
 { value: "contamination", label: "Contamination" },
 { value: "packaging-issue", label: "Packaging Issue" },
 { value: "other", label: "Other" },
];

// Mock swap reasons
const swapReasons = [
 { value: "incorrect-lpn", label: "Incorrect LPN" },
 { value: "damaged-pallet", label: "Damaged Pallet" },
 { value: "wrong-sku", label: "Wrong SKU" },
 { value: "mixed-product", label: "Mixed Product" },
 { value: "scanning-error", label: "Scanning Error" },
 { value: "quantity-mismatch", label: "Quantity Mismatch" },
 { value: "relabel-required", label: "Relabel Required" },
 { value: "other", label: "Other" },
];

// Mock change item reasons
const changeItemReasons = [
 { value: "incorrect-sku-assigned", label: "Incorrect SKU Assigned" },
 { value: "product-substitution", label: "Product Substitution" },
 { value: "sku-correction", label: "SKU Correction" },
 { value: "mislabeled-product", label: "Mislabeled Product" },
 { value: "supplier-error", label: "Supplier Error" },
 { value: "system-error", label: "System Error" },
 { value: "other", label: "Other" },
];

// Mock SKU list
const mockSKUs = [
 { value: "SKU-4521", label: "SKU-4521 - Kraft Macaroni & Cheese Original", description: "Kraft Macaroni & Cheese Original" },
 { value: "SKU-4522", label: "SKU-4522 - Kraft Macaroni & Cheese Deluxe", description: "Kraft Macaroni & Cheese Deluxe" },
 { value: "SKU-3301", label: "SKU-3301 - Campbell's Tomato Soup", description: "Campbell's Tomato Soup" },
 { value: "SKU-3302", label: "SKU-3302 - Campbell's Chicken Noodle Soup", description: "Campbell's Chicken Noodle Soup" },
 { value: "SKU-5201", label: "SKU-5201 - Coca-Cola Classic 12pk", description: "Coca-Cola Classic 12pk" },
 { value: "SKU-5202", label: "SKU-5202 - Pepsi Cola 12pk", description: "Pepsi Cola 12pk" },
 { value: "SKU-7801", label: "SKU-7801 - Lay's Classic Potato Chips", description: "Lay's Classic Potato Chips" },
 { value: "SKU-7802", label: "SKU-7802 - Doritos Nacho Cheese", description: "Doritos Nacho Cheese" },
 { value: "SKU-9101", label: "SKU-9101 - Cheerios Original", description: "Cheerios Original" },
 { value: "SKU-9102", label: "SKU-9102 - Frosted Flakes", description: "Frosted Flakes" },
];

// Mock gaylord item types
const gaylordItemTypes = [
 { value: "trash", label: "Trash" },
 { value: "cardboard", label: "Cardboard" },
 { value: "plastic", label: "Plastic" },
 { value: "damaged-material", label: "Damaged Material" },
];

// Mock gaylord fill statuses
const gaylordFillStatuses = [
 { value: "partial", label: "Partial" },
 { value: "empty", label: "Empty" },
];

// Mock locations
const mockLocations = [
 { value: "R101S01P01", label: "R101S01P01 - Returns Area" },
 { value: "R101S02P01", label: "R101S02P01 - Quarantine" },
 { value: "R102S01P01", label: "R102S01P01 - Overflow" },
 { value: "R103S01P01", label: "R103S01P01 - Staging" },
 { value: "R104S01P01", label: "R104S01P01 - Quality Hold" },
 { value: "R105S01P01", label: "R105S01P01 - Damaged Goods" },
 { value: "R106S01P01", label: "R106S01P01 - Inspection" },
 { value: "R107S01P01", label: "R107S01P01 - Rework" },
];

// Generate pallet grid (3 columns x 6 rows for 18 cases)
const generatePalletGrid = (totalCases: number, casesPerLayer: number, layersToDeWrap: number) => {
 const totalLayers = Math.ceil(totalCases / casesPerLayer);
 const cases = [];

 for (let layer = 0; layer < totalLayers; layer++) {
 for (let position = 0; position < casesPerLayer; position++) {
 const caseNumber = layer * casesPerLayer + position + 1;
 if (caseNumber <= totalCases) {
 cases.push({
 id: `case-${caseNumber}`,
 layer: layer + 1,
 position: position + 1,
 isWrapped: layer < layersToDeWrap,
 caseNumber
 });
 }
 }
 }

 return cases;
};

export function DeWrap() {
 const [palletPresent, setPalletPresent] = useState(false);
 const [palletConfirmed, setPalletConfirmed] = useState(false);
 const [layersConfirmed, setLayersConfirmed] = useState(false);
 const [deWrapComplete, setDeWrapComplete] = useState(false);
 const [showRejection, setShowRejection] = useState(false);
 const [showSwap, setShowSwap] = useState(false);
 const [showChangeItem, setShowChangeItem] = useState(false);
 const [showGaylord, setShowGaylord] = useState(false);
 const [showAdjustInventory, setShowAdjustInventory] = useState(false);
 const [isGaylordMode, setIsGaylordMode] = useState(false);
 const [gaylordPresent, setGaylordPresent] = useState(false);
 const [gaylordRequested, setGaylordRequested] = useState(false);
 const [pendingGaylordData, setPendingGaylordData] = useState<{lpn: string, itemType: string, fillStatus: string} | null>(null);
 const [scanFailed, setScanFailed] = useState(false);
 const [manualLPN, setManualLPN] = useState("");
 const [lpnLookupFailed, setLpnLookupFailed] = useState(false);
 const [lpnNotFoundError, setLpnNotFoundError] = useState(false);
 const [manualSKU, setManualSKU] = useState("");
 const [manualSKUDescription, setManualSKUDescription] = useState("");
 const [manualLayerCount, setManualLayerCount] = useState("");
 const [processedPalletCount, setProcessedPalletCount] = useState(0);
 const [enteredLayers, setEnteredLayers] = useState("");
 const [palletData, setPalletData] = useState(mockPalletData);
 const [casesGrid, setCasesGrid] = useState<any[]>([]);
 const [gaylordData, setGaylordData] = useState<{lpn: string, itemType: string, fillStatus: string} | null>(null);
 const [rejectionReason, setRejectionReason] = useState("");
 const [rejectionLocation, setRejectionLocation] = useState("");
 const [swapReason, setSwapReason] = useState("");
 const [newLPN, setNewLPN] = useState("");
 const [changeItemReason, setChangeItemReason] = useState("");
 const [newSKU, setNewSKU] = useState("");
 const [gaylordItemType, setGaylordItemType] = useState("");
 const [gaylordFillStatus, setGaylordFillStatus] = useState("");
 const [reasonOpen, setReasonOpen] = useState(false);
 const [locationOpen, setLocationOpen] = useState(false);
 const [swapReasonOpen, setSwapReasonOpen] = useState(false);
 const [changeItemReasonOpen, setChangeItemReasonOpen] = useState(false);
 const [newSKUOpen, setNewSKUOpen] = useState(false);
 const [gaylordItemTypeOpen, setGaylordItemTypeOpen] = useState(false);
 const [gaylordFillStatusOpen, setGaylordFillStatusOpen] = useState(false);
 const [manualSKUOpen, setManualSKUOpen] = useState(false);

 // Simulate pallet arrival after 5 seconds
 useEffect(() => {
 // Only trigger if no pallet is currently present
 if (palletPresent) {
 return;
 }

 const timer = setTimeout(() => {
 setPalletPresent(true);

 // Check if this is the 3rd pallet (after 2 successful ones)
 if (processedPalletCount === 2) {
 setScanFailed(true);
 toast.error("Scan failed", {
 description: "Unable to read pallet LPN",
 duration: 4000,
 });
 } else {
 toast.success(`${palletData.palletId} has arrived`, {
 description: `Location: ${palletData.location}`,
 duration: 4000,
 });
 }
 }, 5000);

 return () => clearTimeout(timer);
 }, [palletData.palletId, palletData.location, processedPalletCount, palletPresent]);

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

 const handleConfirmManualLPN = () => {
 if (manualLPN) {
 // Check if LPN starts with 2 (lookup will fail)
 if (manualLPN.startsWith('2')) {
 setLpnNotFoundError(true);
 setManualLPN("");
 toast.error("LPN not found", {
 description: "Please try again or reject the pallet",
 duration: 4000,
 });
 } else {
 // LPN found - populate data and continue
 setPalletData({
 ...palletData,
 palletId: manualLPN
 });

 // Clear all scan failure states
 setScanFailed(false);
 setLpnLookupFailed(false);
 setLpnNotFoundError(false);
 setPalletConfirmed(true);
 setManualLPN("");

 toast.success("LPN found", {
 description: `Loaded data for ${manualLPN}`,
 duration: 3000,
 });
 }
 }
 };

 const handleConfirmManualSKU = () => {
 if (manualSKU && manualSKUDescription && manualLayerCount) {
 const layers = parseInt(manualLayerCount);

 // Update pallet data with manual entries
 setPalletData({
 ...palletData,
 palletId: manualLPN,
 sku: manualSKU,
 description: manualSKUDescription,
 totalLayers: layers,
 totalCases: layers * palletData.casesPerLayer
 });

 // Generate cases grid
 const grid = generatePalletGrid(
 layers * palletData.casesPerLayer,
 palletData.casesPerLayer,
 palletData.layersToDeWrap
 );
 setCasesGrid(grid);

 // Reset and move to confirmed state
 setScanFailed(false);
 setLpnLookupFailed(false);
 setPalletConfirmed(true);
 setLayersConfirmed(true);
 setManualLPN("");
 setManualSKU("");
 setManualSKUDescription("");
 setManualLayerCount("");

 toast.success("Pallet information saved", {
 description: "Ready to begin dewrap",
 duration: 3000,
 });
 }
 };

 const handleBackToLPNEntry = () => {
 setLpnLookupFailed(false);
 setManualLPN("");
 setManualSKU("");
 setManualSKUDescription("");
 setManualLayerCount("");
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

 // Generate cases grid
 const grid = generatePalletGrid(
 layers * palletData.casesPerLayer,
 palletData.casesPerLayer,
 palletData.layersToDeWrap
 );
 setCasesGrid(grid);

 setLayersConfirmed(true);
 }
 };

 const handleDeWrapComplete = () => {
 setDeWrapComplete(true);
 };

 const handleConfirmCompletion = () => {
 // Increment processed pallet count
 setProcessedPalletCount(prev => prev + 1);

 // Reset to initial state for next pallet
 setPalletPresent(false);
 setPalletConfirmed(false);
 setLayersConfirmed(false);
 setDeWrapComplete(false);
 setScanFailed(false);
 setLpnLookupFailed(false);
 setLpnNotFoundError(false);
 setManualLPN("");
 setManualSKU("");
 setManualSKUDescription("");
 setManualLayerCount("");
 setEnteredLayers("");
 setCasesGrid([]);

 toast.success("DeWrap operation completed", {
 description: `${palletData.palletId} processed successfully`,
 duration: 3000,
 });

 // Check if a Gaylord was requested
 if (gaylordRequested && pendingGaylordData) {
 // Bring the Gaylord instead of the next pallet
 setTimeout(() => {
 setIsGaylordMode(true);
 setGaylordData(pendingGaylordData);
 setGaylordRequested(false);
 setPendingGaylordData(null);
 setGaylordPresent(true);

 toast.success(`${pendingGaylordData.lpn} has arrived`, {
 description: `${pendingGaylordData.itemType} Gaylord`,
 duration: 4000,
 });
 }, 5000);
 } else {
 // Simulate next pallet arrival after 5 seconds
 setTimeout(() => {
 setPalletPresent(true);

 // Check if this is the 3rd pallet (after 2 successful ones)
 if (processedPalletCount + 1 === 2) {
 setScanFailed(true);
 toast.error("Scan failed", {
 description: "Unable to read pallet LPN",
 duration: 4000,
 });
 } else {
 toast.success(`${palletData.palletId} has arrived`, {
 description: `Location: ${palletData.location}`,
 duration: 4000,
 });
 }
 }, 5000);
 }
 };

 const handleCancelCompletion = () => {
 setDeWrapComplete(false);
 };

 const handleAdjustInventory = () => {
 toast.info("Adjust Inventory functionality coming soon");
 };

 const handleChangeItem = () => {
 setShowChangeItem(true);
 };

 const handleConfirmChangeItem = () => {
 if (changeItemReason && newSKU) {
 const selectedSKU = mockSKUs.find(s => s.value === newSKU);

 toast.success("Item changed", {
 description: `SKU updated to ${newSKU}`,
 duration: 3000,
 });

 // Update pallet data with new SKU
 setPalletData({
 ...palletData,
 sku: newSKU,
 description: selectedSKU?.description || palletData.description
 });

 // Close change item screen and return to normal flow
 setShowChangeItem(false);
 setChangeItemReason("");
 setNewSKU("");
 }
 };

 const handleCancelChangeItem = () => {
 setShowChangeItem(false);
 setChangeItemReason("");
 setNewSKU("");
 };

 const handleSwapPallet = () => {
 setShowSwap(true);
 };

 const handleConfirmSwap = () => {
 if (swapReason && newLPN) {
 toast.success("Pallet swapped", {
 description: `${palletData.palletId} replaced with ${newLPN}`,
 duration: 3000,
 });

 // Update pallet data with new LPN
 setPalletData({
 ...palletData,
 palletId: newLPN
 });

 // Close swap screen and return to normal flow
 setShowSwap(false);
 setSwapReason("");
 setNewLPN("");
 }
 };

 const handleCancelSwap = () => {
 setShowSwap(false);
 setSwapReason("");
 setNewLPN("");
 };

 const handleRequestGaylord = () => {
 setShowGaylord(true);
 };

 const handleConfirmGaylord = () => {
 if (gaylordItemType && gaylordFillStatus) {
 const itemTypeLabel = gaylordItemTypes.find(t => t.value === gaylordItemType)?.label || "";
 const fillStatusLabel = gaylordFillStatuses.find(s => s.value === gaylordFillStatus)?.label || "";

 toast.success("Gaylord requested", {
 description: `${itemTypeLabel} - ${fillStatusLabel} - Will arrive after current pallet complete`,
 duration: 4000,
 });

 // Close gaylord screen and mark as requested
 setShowGaylord(false);
 setGaylordRequested(true);

 // Store the requested Gaylord info for when current pallet is complete
 const gaylordLPN = generateGaylordLPN();
 setPendingGaylordData({
 lpn: gaylordLPN,
 itemType: itemTypeLabel,
 fillStatus: fillStatusLabel
 });

 setGaylordItemType("");
 setGaylordFillStatus("");
 }
 };

 const handleCancelGaylord = () => {
 setShowGaylord(false);
 setGaylordItemType("");
 setGaylordFillStatus("");
 };

 const handleGaylordComplete = () => {
 toast.success("Gaylord complete", {
 description: `${gaylordData?.lpn} processed successfully`,
 duration: 3000,
 });

 // Reset to pallet mode and wait for next pallet
 setIsGaylordMode(false);
 setGaylordPresent(false);
 setGaylordData(null);

 // Simulate next pallet arrival after 5 seconds
 setTimeout(() => {
 setPalletPresent(true);
 toast.success(`${palletData.palletId} has arrived`, {
 description: `Location: ${palletData.location}`,
 duration: 4000,
 });
 }, 5000);
 };

 const handleRejectPallet = () => {
 setShowRejection(true);
 };

 const handleRejectFromScanFailed = () => {
 // Go directly to rejection screen from scan failed
 setScanFailed(false);
 setLpnNotFoundError(false);
 setManualLPN("");
 setShowRejection(true);
 };

 const handleConfirmRejection = () => {
 if (rejectionReason && rejectionLocation) {
 toast.error("Pallet rejected", {
 description: `${palletData.palletId} moved to ${rejectionLocation}`,
 duration: 3000,
 });

 // Reset to initial state
 setPalletPresent(false);
 setPalletConfirmed(false);
 setLayersConfirmed(false);
 setDeWrapComplete(false);
 setShowRejection(false);
 setEnteredLayers("");
 setCasesGrid([]);
 setRejectionReason("");
 setRejectionLocation("");

 // Simulate next pallet arrival after 5 seconds
 setTimeout(() => {
 setPalletPresent(true);
 toast.success(`${palletData.palletId} has arrived`, {
 description: `Location: ${palletData.location}`,
 duration: 4000,
 });
 }, 5000);
 }
 };

 const handleCancelRejection = () => {
 setShowRejection(false);
 setRejectionReason("");
 setRejectionLocation("");
 };

 return (
 <div className="h-screen flex flex-col bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)]">
 {/* Sticky Header */}
 <div className="sticky top-0 z-40 bg-[var(--background)]/95 backdrop-blur-md text-[var(--foreground)] border-b border-[var(--border)] px-8 pt-6 pb-4">
 <nav className="flex items-center gap-2 text-sm">
 <Link to="/app/home" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] dark:hover:text-[var(--primary)] transition-colors flex items-center gap-1">
 <Home size={14} />Home
 </Link>
 <ChevronRight size={14} className="text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]" />
 <Link to="/app/navigation?section=workstation-operations" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] dark:hover:text-[var(--primary)] transition-colors">
 Workstation Operations
 </Link>
 <ChevronRight size={14} className="text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]" />
 <span className="text-[var(--foreground)]  font-semibold text-lg flex items-center gap-2">
 <Package size={20} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 DeWrap
 </span>
 </nav>
 </div>

 {/* Main Content */}
 <div className="flex-1 flex gap-3 px-4 pb-3 overflow-hidden min-h-0">
 {/* Left Panel - Pallet Details & Item Details OR Gaylord Details */}
 <div className="w-72 flex flex-col gap-3 min-h-0">
 {/* Pallet/Gaylord Details */}
 <div className="bg-[var(--surface-container-high)] text-[var(--foreground)] border-[var(--border)]  rounded-xl p-4 flex-shrink-0">
 <div className="flex items-center gap-2 mb-4">
 <div className="w-8 h-8 bg-[var(--primary)]/20 /20 rounded-lg flex items-center justify-center">
 {isGaylordMode ? (
 <Archive size={20} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 ) : (
 <Package size={20} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 )}
 </div>
 <h2 className="font-semibold text-[var(--foreground)] ">{isGaylordMode ? "Gaylord Details" : "Pallet Details"}</h2>
 </div>

 {isGaylordMode ? (
 // Gaylord Details
 !gaylordPresent ? (
 <div className="flex flex-col items-center justify-center py-6">
 <Archive size={48} className="text-[var(--muted-foreground)] mb-3" />
 <p className="text-[var(--muted-foreground)] text-center">No Gaylord</p>
 <p className="text-[var(--muted-foreground)] text-sm text-center mt-2">Waiting for gaylord arrival...</p>
 </div>
 ) : (
 <div className="space-y-2">
 <div>
 <label className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-1 block">LPN</label>
 <p className="text-[var(--foreground)] font-mono text-sm">{gaylordData?.lpn}</p>
 </div>

 <div>
 <label className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-1 block">Item Type</label>
 <p className="text-[var(--foreground)] text-sm">{gaylordData?.itemType}</p>
 </div>

 <div>
 <label className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-1 block">Fill Status</label>
 <p className="text-[var(--foreground)] text-sm">{gaylordData?.fillStatus}</p>
 </div>

 <div className="pt-2 border-t border-[var(--border)] ">
 <label className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-1 block">Status</label>
 <div className="flex items-center gap-2">
 <div className="w-2 h-2 bg-[var(--state-success)] rounded-full"></div>
 <p className="text-[var(--state-success)] text-sm font-medium">Ready</p>
 </div>
 </div>
 </div>
 )
 ) : (
 // Pallet Details
 !palletPresent ? (
 <div className="flex flex-col items-center justify-center py-6">
 <Package size={48} className="text-[var(--muted-foreground)] mb-3" />
 <p className="text-[var(--muted-foreground)] text-center">No Pallet</p>
 <p className="text-[var(--muted-foreground)] text-sm text-center mt-2">Waiting for pallet arrival...</p>
 </div>
 ) : scanFailed ? (
 <div className="flex flex-col items-center justify-center py-6">
 <AlertCircle size={48} className="text-[var(--state-error)] mb-3" />
 <p className="text-[var(--state-error)] text-center">Scan Failed</p>
 <p className="text-[var(--muted-foreground)] text-sm text-center mt-2">Manual entry required</p>
 </div>
 ) : (
 <div className="space-y-2">
 <div>
 <label className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-1 block">LPN</label>
 <p className="text-[var(--foreground)] font-mono text-sm">{palletData.palletId}</p>
 </div>

 <div>
 <label className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-1 block">Location</label>
 <p className="text-[var(--foreground)] font-mono text-sm">{palletData.location}</p>
 </div>

 <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[var(--border)] ">
 <div>
 <label className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-1 block">Cases Per Layer</label>
 <p className="text-[var(--foreground)] font-semibold">{palletData.casesPerLayer}</p>
 </div>
 {layersConfirmed && (
 <div>
 <label className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-1 block">Total Layers</label>
 <p className="text-[var(--foreground)] font-semibold">{palletData.totalLayers}</p>
 </div>
 )}
 </div>

 {layersConfirmed && (
 <div className="pt-2 border-t border-[var(--border)] ">
 <label className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-1 block">Total Cases</label>
 <p className="text-[var(--foreground)] font-semibold">{palletData.totalCases}</p>
 </div>
 )}

 <div className="pt-2 border-t border-[var(--border)] ">
 <label className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-1 block">Status</label>
 <div className="flex items-center gap-2">
 <div className="w-2 h-2 bg-[var(--state-success)] rounded-full"></div>
 <p className="text-[var(--state-success)] text-sm font-medium">{palletData.status}</p>
 </div>
 </div>
 </div>
 )
 )}
 </div>

 {/* Item Details - Only show for pallets and when scan is successful */}
 {palletPresent && !isGaylordMode && !scanFailed && (
 <div className="bg-[var(--surface-container-high)] text-[var(--foreground)] border-[var(--border)]  rounded-xl p-4 flex-1 flex flex-col min-h-0 overflow-hidden">
 <div className="flex items-center gap-2 mb-3 flex-shrink-0">
 <div className="w-8 h-8 bg-[var(--state-info)]/20 rounded-lg flex items-center justify-center">
 <Box size={16} className="text-[var(--state-info)]" />
 </div>
 <h2 className="font-semibold text-[var(--foreground)] ">Item Details</h2>
 </div>

 <div className="space-y-3 flex-1 min-h-0 overflow-y-auto">
 <div className="bg-[var(--surface-container-lowest)] rounded-lg p-2 flex items-center justify-center">
 <img
 src={macAndCheeseImage}
 alt="Kraft Macaroni & Cheese"
 className="max-w-full h-auto max-h-32 object-contain"
 />
 </div>

 <div>
 <label className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-1 block">SKU</label>
 <p className="text-[var(--foreground)] font-mono text-sm">{palletData.sku}</p>
 </div>

 <div>
 <label className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-1 block">Description</label>
 <p className="text-[var(--foreground)] text-sm">{palletData.description}</p>
 </div>
 </div>
 </div>
 )}
 </div>

 {/* Center Panel - Pallet Visualization */}
 <div className="flex-1 flex flex-col gap-3 min-h-0">
 <div className="bg-[var(--surface-container-high)] text-[var(--foreground)] border-[var(--border)]  rounded-xl p-4 flex-1 flex flex-col min-h-0">
 <div className="flex items-center justify-between mb-4 flex-shrink-0">
 <div className="flex items-center gap-2">
 <div className="w-8 h-8 bg-[var(--primary)]/20 /20 rounded-lg flex items-center justify-center">
 <Box size={16} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 </div>
 <h2 className="font-semibold text-[var(--foreground)] ">Pallet</h2>
 </div>

{layersConfirmed && (
 <div className="flex items-center gap-4">
 <div className="flex items-center gap-2">
 <div className="w-4 h-4 bg-[var(--state-success-container)] border-2 border-[var(--state-success)]/40 rounded"></div>
 <span className="text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">Layers to DeWrap</span>
 </div>
 <div className="flex items-center gap-2">
 <div className="w-4 h-4 bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] border-2 border-[var(--border)] rounded"></div>
 <span className="text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">Wrapped</span>
 </div>
 </div>
 )}
 </div>

{/* Pallet Grid, Confirmation, or Keypad */}
 <div className="flex-1 flex items-center justify-center">
 {isGaylordMode && gaylordPresent ? (
 // Gaylord Bin Visualization
 <div className="flex flex-col items-center justify-center">
 <div className="w-96 h-96 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-4 border-[var(--border)] rounded-2xl flex items-center justify-center relative ">
 <div className="absolute inset-4 border-2 border-[var(--border)]  rounded-xl"></div>
 <Archive size={96} className="text-[var(--muted-foreground)]" />
 </div>
 <p className="text-xl text-[var(--foreground)] font-semibold mt-6">{gaylordData?.itemType} Gaylord</p>
 <p className="text-[var(--muted-foreground)] mt-2">{gaylordData?.fillStatus}</p>
 </div>
 ) : !palletPresent && !gaylordPresent ? (
 // No Pallet/Gaylord State
 <div className="flex flex-col items-center justify-center">
 {isGaylordMode ? (
 <>
 <Archive size={96} className="text-[var(--foreground)] mb-4" />
 <p className="text-xl text-[var(--muted-foreground)] font-semibold">No Gaylord</p>
 <p className="text-[var(--muted-foreground)] mt-2">Waiting for gaylord to arrive at station...</p>
 </>
 ) : (
 <>
 <Package size={96} className="text-[var(--foreground)] mb-4" />
 <p className="text-xl text-[var(--muted-foreground)] font-semibold">No Pallet</p>
 <p className="text-[var(--muted-foreground)] mt-2">Waiting for pallet to arrive at station...</p>
 </>
 )}
 </div>
 ) : showSwap ? (
 // Swap Pallet State
 <div className="max-w-md w-full">
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-xl border-[var(--border)]  p-6">
 <div className="text-center mb-6">
 <div className="w-16 h-16 bg-[var(--state-info)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
 <Box size={32} className="text-[var(--state-info)]" />
 </div>
 <h3 className="text-xl font-semibold text-[var(--foreground)]  mb-2">Swap Pallet</h3>
 <p className="text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">Specify swap reason and new LPN</p>
 </div>

 <div className="space-y-4 mb-6">
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-lg p-4">
 <label className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-1 block">Current LPN</label>
 <p className="text-[var(--foreground)] font-mono font-semibold text-lg">{palletData.palletId}</p>
 </div>

 <div>
 <label className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-2 block">Swap Reason</label>
 <Popover open={swapReasonOpen} onOpenChange={setSwapReasonOpen}>
 <PopoverTrigger asChild>
 <button
 className="w-full flex items-center justify-between px-4 py-3 bg-[var(--surface-container-high)] text-[var(--foreground)] hover:bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg text-[var(--foreground)] transition-colors"
 >
 <span className={swapReason ? "text-white" : "text-[var(--muted-foreground)]"}>
 {swapReason
 ? swapReasons.find(r => r.value === swapReason)?.label
 : "Select reason..."}
 </span>
 <Search size={16} className="text-[var(--muted-foreground)]" />
 </button>
 </PopoverTrigger>
 <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
 <Command className="bg-[var(--surface-container-high)] text-[var(--foreground)] border-[var(--border)] ">
 <CommandInput placeholder="Search reasons..." className="text-[var(--foreground)]" />
 <CommandList>
 <CommandEmpty className="text-[var(--muted-foreground)] text-sm py-6 text-center">No reason found.</CommandEmpty>
 <CommandGroup>
 {swapReasons.map((reason) => (
 <CommandItem
 key={reason.value}
 value={reason.value}
 onSelect={(value) => {
 setSwapReason(value);
 setSwapReasonOpen(false);
 }}
 className="text-[var(--foreground)] hover:bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)]"
 >
 <Check
 className={`mr-2 h-4 w-4 ${
 swapReason === reason.value ? "opacity-100" : "opacity-0"
 }`}
 />
 {reason.label}
 </CommandItem>
 ))}
 </CommandGroup>
 </CommandList>
 </Command>
 </PopoverContent>
 </Popover>
 </div>

 <div>
 <label className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-2 block">New LPN</label>
 <input
 type="text"
 value={newLPN}
 onChange={(e) => setNewLPN(e.target.value.toUpperCase())}
 placeholder="Enter new LPN..."
 className="w-full px-4 py-3 bg-[var(--surface-container-high)] text-[var(--foreground)] border-[var(--border)]  rounded-lg text-[var(--foreground)] placeholder-zinc-500 focus:outline-none focus:border-[var(--primary)] dark:focus:border-[var(--primary)] transition-colors font-mono"
 />
 </div>
 </div>

 <div className="space-y-3">
 <button
 onClick={handleConfirmSwap}
 disabled={!swapReason || !newLPN}
 className="w-full px-6 py-4 bg-[var(--primary)] hover:opacity-90 active:scale-[0.98] disabled:bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] disabled:text-[var(--muted-foreground)] disabled:cursor-not-allowed text-[var(--primary-foreground)] rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
 >
 <CheckCircle2 size={20} />
 Confirm Swap
 </button>

 <button
 onClick={handleCancelSwap}
 className="w-full px-6 py-4 bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] hover:bg-[var(--surface-container-high)] text-[var(--foreground)] rounded-lg font-semibold transition-colors"
 >
 Cancel
 </button>
 </div>
 </div>
 </div>
 ) : showGaylord ? (
 // Request Gaylord State
 <div className="max-w-md w-full">
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-xl border-[var(--border)]  p-6">
 <div className="text-center mb-6">
 <div className="w-16 h-16 bg-[var(--state-info)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
 <Archive size={32} className="text-[var(--state-info)]" />
 </div>
 <h3 className="text-xl font-semibold text-[var(--foreground)]  mb-2">Request Gaylord</h3>
 <p className="text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">Specify item type and fill status</p>
 </div>

 <div className="space-y-4 mb-6">
 <div>
 <label className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-2 block">Item Type</label>
 <Popover open={gaylordItemTypeOpen} onOpenChange={setGaylordItemTypeOpen}>
 <PopoverTrigger asChild>
 <button
 className="w-full flex items-center justify-between px-4 py-3 bg-[var(--surface-container-high)] text-[var(--foreground)] hover:bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg text-[var(--foreground)] transition-colors"
 >
 <span className={gaylordItemType ? "text-white" : "text-[var(--muted-foreground)]"}>
 {gaylordItemType
 ? gaylordItemTypes.find(t => t.value === gaylordItemType)?.label
 : "Select item type..."}
 </span>
 <Search size={16} className="text-[var(--muted-foreground)]" />
 </button>
 </PopoverTrigger>
 <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
 <Command className="bg-[var(--surface-container-high)] text-[var(--foreground)] border-[var(--border)] ">
 <CommandInput placeholder="Search item types..." className="text-[var(--foreground)]" />
 <CommandList>
 <CommandEmpty className="text-[var(--muted-foreground)] text-sm py-6 text-center">No item type found.</CommandEmpty>
 <CommandGroup>
 {gaylordItemTypes.map((type) => (
 <CommandItem
 key={type.value}
 value={type.value}
 onSelect={(value) => {
 setGaylordItemType(value);
 setGaylordItemTypeOpen(false);
 }}
 className="text-[var(--foreground)] hover:bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)]"
 >
 <Check
 className={`mr-2 h-4 w-4 ${
 gaylordItemType === type.value ? "opacity-100" : "opacity-0"
 }`}
 />
 {type.label}
 </CommandItem>
 ))}
 </CommandGroup>
 </CommandList>
 </Command>
 </PopoverContent>
 </Popover>
 </div>

 <div>
 <label className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-2 block">Fill Status</label>
 <Popover open={gaylordFillStatusOpen} onOpenChange={setGaylordFillStatusOpen}>
 <PopoverTrigger asChild>
 <button
 className="w-full flex items-center justify-between px-4 py-3 bg-[var(--surface-container-high)] text-[var(--foreground)] hover:bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg text-[var(--foreground)] transition-colors"
 >
 <span className={gaylordFillStatus ? "text-white" : "text-[var(--muted-foreground)]"}>
 {gaylordFillStatus
 ? gaylordFillStatuses.find(s => s.value === gaylordFillStatus)?.label
 : "Select fill status..."}
 </span>
 <Search size={16} className="text-[var(--muted-foreground)]" />
 </button>
 </PopoverTrigger>
 <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
 <Command className="bg-[var(--surface-container-high)] text-[var(--foreground)] border-[var(--border)] ">
 <CommandInput placeholder="Search fill status..." className="text-[var(--foreground)]" />
 <CommandList>
 <CommandEmpty className="text-[var(--muted-foreground)] text-sm py-6 text-center">No fill status found.</CommandEmpty>
 <CommandGroup>
 {gaylordFillStatuses.map((status) => (
 <CommandItem
 key={status.value}
 value={status.value}
 onSelect={(value) => {
 setGaylordFillStatus(value);
 setGaylordFillStatusOpen(false);
 }}
 className="text-[var(--foreground)] hover:bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)]"
 >
 <Check
 className={`mr-2 h-4 w-4 ${
 gaylordFillStatus === status.value ? "opacity-100" : "opacity-0"
 }`}
 />
 {status.label}
 </CommandItem>
 ))}
 </CommandGroup>
 </CommandList>
 </Command>
 </PopoverContent>
 </Popover>
 </div>
 </div>

 <div className="space-y-3">
 <button
 onClick={handleConfirmGaylord}
 disabled={!gaylordItemType || !gaylordFillStatus}
 className="w-full px-6 py-4 bg-[var(--primary)] hover:opacity-90 active:scale-[0.98] disabled:bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] disabled:text-[var(--muted-foreground)] disabled:cursor-not-allowed text-[var(--primary-foreground)] rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
 >
 <CheckCircle2 size={20} />
 Confirm Request
 </button>

 <button
 onClick={handleCancelGaylord}
 className="w-full px-6 py-4 bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] hover:bg-[var(--surface-container-high)] text-[var(--foreground)] rounded-lg font-semibold transition-colors"
 >
 Cancel
 </button>
 </div>
 </div>
 </div>
 ) : showChangeItem ? (
 // Change Item State
 <div className="max-w-md w-full">
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-xl border-[var(--border)]  p-6">
 <div className="text-center mb-6">
 <div className="w-16 h-16 bg-[var(--state-info)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
 <Package size={32} className="text-[var(--state-info)]" />
 </div>
 <h3 className="text-xl font-semibold text-[var(--foreground)]  mb-2">Change Item</h3>
 <p className="text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">Specify reason and new SKU</p>
 </div>

 <div className="space-y-4 mb-6">
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-lg p-4">
 <label className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-1 block">Current SKU</label>
 <p className="text-[var(--foreground)] font-mono font-semibold text-lg">{palletData.sku}</p>
 <p className="text-[var(--muted-foreground)] text-sm mt-1">{palletData.description}</p>
 </div>

 <div>
 <label className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-2 block">Change Reason</label>
 <Popover open={changeItemReasonOpen} onOpenChange={setChangeItemReasonOpen}>
 <PopoverTrigger asChild>
 <button
 className="w-full flex items-center justify-between px-4 py-3 bg-[var(--surface-container-high)] text-[var(--foreground)] hover:bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg text-[var(--foreground)] transition-colors"
 >
 <span className={changeItemReason ? "text-white" : "text-[var(--muted-foreground)]"}>
 {changeItemReason
 ? changeItemReasons.find(r => r.value === changeItemReason)?.label
 : "Select reason..."}
 </span>
 <Search size={16} className="text-[var(--muted-foreground)]" />
 </button>
 </PopoverTrigger>
 <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
 <Command className="bg-[var(--surface-container-high)] text-[var(--foreground)] border-[var(--border)] ">
 <CommandInput placeholder="Search reasons..." className="text-[var(--foreground)]" />
 <CommandList>
 <CommandEmpty className="text-[var(--muted-foreground)] text-sm py-6 text-center">No reason found.</CommandEmpty>
 <CommandGroup>
 {changeItemReasons.map((reason) => (
 <CommandItem
 key={reason.value}
 value={reason.value}
 onSelect={(value) => {
 setChangeItemReason(value);
 setChangeItemReasonOpen(false);
 }}
 className="text-[var(--foreground)] hover:bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)]"
 >
 <Check
 className={`mr-2 h-4 w-4 ${
 changeItemReason === reason.value ? "opacity-100" : "opacity-0"
 }`}
 />
 {reason.label}
 </CommandItem>
 ))}
 </CommandGroup>
 </CommandList>
 </Command>
 </PopoverContent>
 </Popover>
 </div>

 <div>
 <label className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-2 block">New SKU</label>
 <Popover open={newSKUOpen} onOpenChange={setNewSKUOpen}>
 <PopoverTrigger asChild>
 <button
 className="w-full flex items-center justify-between px-4 py-3 bg-[var(--surface-container-high)] text-[var(--foreground)] hover:bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg text-[var(--foreground)] transition-colors"
 >
 <span className={newSKU ? "text-white" : "text-[var(--muted-foreground)]"}>
 {newSKU
 ? mockSKUs.find(s => s.value === newSKU)?.label
 : "Select SKU..."}
 </span>
 <Search size={16} className="text-[var(--muted-foreground)]" />
 </button>
 </PopoverTrigger>
 <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
 <Command className="bg-[var(--surface-container-high)] text-[var(--foreground)] border-[var(--border)] ">
 <CommandInput placeholder="Search SKUs..." className="text-[var(--foreground)]" />
 <CommandList>
 <CommandEmpty className="text-[var(--muted-foreground)] text-sm py-6 text-center">No SKU found.</CommandEmpty>
 <CommandGroup>
 {mockSKUs.map((sku) => (
 <CommandItem
 key={sku.value}
 value={sku.value}
 onSelect={(value) => {
 setNewSKU(value);
 setNewSKUOpen(false);
 }}
 className="text-[var(--foreground)] hover:bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)]"
 >
 <Check
 className={`mr-2 h-4 w-4 ${
 newSKU === sku.value ? "opacity-100" : "opacity-0"
 }`}
 />
 <div className="flex flex-col">
 <span className="font-mono">{sku.value}</span>
 <span className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">{sku.description}</span>
 </div>
 </CommandItem>
 ))}
 </CommandGroup>
 </CommandList>
 </Command>
 </PopoverContent>
 </Popover>
 </div>
 </div>

 <div className="space-y-3">
 <button
 onClick={handleConfirmChangeItem}
 disabled={!changeItemReason || !newSKU}
 className="w-full px-6 py-4 bg-[var(--primary)] hover:opacity-90 active:scale-[0.98] disabled:bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] disabled:text-[var(--muted-foreground)] disabled:cursor-not-allowed text-[var(--primary-foreground)] rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
 >
 <CheckCircle2 size={20} />
 Confirm Change
 </button>

 <button
 onClick={handleCancelChangeItem}
 className="w-full px-6 py-4 bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] hover:bg-[var(--surface-container-high)] text-[var(--foreground)] rounded-lg font-semibold transition-colors"
 >
 Cancel
 </button>
 </div>
 </div>
 </div>
 ) : scanFailed && !lpnLookupFailed ? (
 // Manual LPN Entry State
 <div className="max-w-md w-full">
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-xl border-[var(--border)]  p-6">
 <div className="text-center mb-6">
 <div className="w-16 h-16 bg-[var(--state-error)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
 <AlertCircle size={32} className="text-[var(--state-error)]" />
 </div>
 <h3 className="text-xl font-semibold text-[var(--foreground)]  mb-2">Scan Failed</h3>
 {lpnNotFoundError ? (
 <div className="space-y-2">
 <p className="text-sm text-[var(--state-error)] font-semibold">LPN Not Found</p>
 <p className="text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">Please try again or reject the pallet.</p>
 </div>
 ) : (
 <p className="text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">Unable to read pallet LPN. Please enter manually.</p>
 )}
 </div>

 <div className="space-y-4 mb-6">
 <div>
 <label className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-2 block">Enter LPN</label>
 <input
 type="text"
 value={manualLPN}
 onChange={(e) => setManualLPN(e.target.value.toUpperCase())}
 placeholder="Enter LPN..."
 className="w-full px-4 py-3 bg-[var(--surface-container-high)] text-[var(--foreground)] border-[var(--border)]  rounded-lg text-[var(--foreground)] placeholder-zinc-500 focus:outline-none focus:border-[var(--primary)] dark:focus:border-[var(--primary)] transition-colors font-mono"
 />
 </div>
 </div>

 <div className="space-y-3">
 <button
 onClick={handleConfirmManualLPN}
 disabled={!manualLPN}
 className="w-full px-6 py-4 bg-[var(--primary)] hover:opacity-90 active:scale-[0.98] disabled:bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] disabled:text-[var(--muted-foreground)] disabled:cursor-not-allowed text-[var(--primary-foreground)] rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
 >
 <CheckCircle2 size={20} />
 Confirm LPN
 </button>

 <button
 onClick={handleRejectFromScanFailed}
 className="w-full px-6 py-4 bg-[var(--state-error)]/20 hover:bg-[var(--state-error)]/30 text-[var(--state-error)] rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 border border-[var(--state-error)]/40"
 >
 <XCircle size={20} />
 Reject Pallet
 </button>
 </div>
 </div>
 </div>
 ) : lpnLookupFailed ? (
 // Manual SKU Entry State
 <div className="max-w-md w-full">
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-xl border-[var(--border)]  p-6">
 <div className="mb-4">
 <button
 onClick={handleBackToLPNEntry}
 className="flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
 >
 <ArrowLeft size={20} />
 <span className="text-sm">Back to LPN Entry</span>
 </button>
 </div>

 <div className="text-center mb-6">
 <div className="w-16 h-16 bg-[var(--state-error)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
 <AlertCircle size={32} className="text-[var(--state-error)]" />
 </div>
 <h3 className="text-xl font-semibold text-[var(--foreground)]  mb-2">LPN Not Found</h3>
 <p className="text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">Please enter SKU information manually</p>
 </div>

 <div className="space-y-4 mb-6">
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-lg p-4">
 <label className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-1 block">Entered LPN</label>
 <p className="text-[var(--foreground)] font-mono font-semibold text-lg">{manualLPN}</p>
 </div>

 <div>
 <label className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-2 block">SKU</label>
 <Popover open={manualSKUOpen} onOpenChange={setManualSKUOpen}>
 <PopoverTrigger asChild>
 <button
 className="w-full flex items-center justify-between px-4 py-3 bg-[var(--surface-container-high)] text-[var(--foreground)] hover:bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg text-[var(--foreground)] transition-colors"
 >
 <span className={manualSKU ? "text-white" : "text-[var(--muted-foreground)]"}>
 {manualSKU
 ? mockSKUs.find(s => s.value === manualSKU)?.label
 : "Select SKU..."}
 </span>
 <Search size={16} className="text-[var(--muted-foreground)]" />
 </button>
 </PopoverTrigger>
 <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
 <Command className="bg-[var(--surface-container-high)] text-[var(--foreground)] border-[var(--border)] ">
 <CommandInput placeholder="Search SKUs..." className="text-[var(--foreground)]" />
 <CommandList>
 <CommandEmpty className="text-[var(--muted-foreground)] text-sm py-6 text-center">No SKU found.</CommandEmpty>
 <CommandGroup>
 {mockSKUs.map((sku) => (
 <CommandItem
 key={sku.value}
 value={sku.value}
 onSelect={(value) => {
 setManualSKU(value);
 const selectedSKU = mockSKUs.find(s => s.value === value);
 if (selectedSKU) {
 setManualSKUDescription(selectedSKU.description);
 }
 setManualSKUOpen(false);
 }}
 className="text-[var(--foreground)] hover:bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)]"
 >
 <Check
 className={`mr-2 h-4 w-4 ${
 manualSKU === sku.value ? "opacity-100" : "opacity-0"
 }`}
 />
 <div className="flex flex-col">
 <span className="font-mono">{sku.value}</span>
 <span className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">{sku.description}</span>
 </div>
 </CommandItem>
 ))}
 </CommandGroup>
 </CommandList>
 </Command>
 </PopoverContent>
 </Popover>
 </div>

 <div>
 <label className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-2 block">Number of Layers</label>
 <input
 type="number"
 min="1"
 max="99"
 value={manualLayerCount}
 onChange={(e) => setManualLayerCount(e.target.value)}
 placeholder="Enter number of layers..."
 className="w-full px-4 py-3 bg-[var(--surface-container-high)] text-[var(--foreground)] border-[var(--border)]  rounded-lg text-[var(--foreground)] placeholder-zinc-500 focus:outline-none focus:border-[var(--primary)] dark:focus:border-[var(--primary)] transition-colors font-mono"
 />
 </div>
 </div>

 <button
 onClick={handleConfirmManualSKU}
 disabled={!manualSKU || !manualLayerCount}
 className="w-full px-6 py-4 bg-[var(--primary)] hover:opacity-90 active:scale-[0.98] disabled:bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] disabled:text-[var(--muted-foreground)] disabled:cursor-not-allowed text-[var(--primary-foreground)] rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
 >
 <CheckCircle2 size={20} />
 Confirm Information
 </button>
 </div>
 </div>
 ) : showRejection ? (
 // Rejection State
 <div className="max-w-md w-full">
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-xl border-[var(--border)]  p-6">
 <div className="text-center mb-6">
 <div className="w-16 h-16 bg-[var(--state-error)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
 <XCircle size={32} className="text-[var(--state-error)]" />
 </div>
 <h3 className="text-xl font-semibold text-[var(--foreground)]  mb-2">Reject Pallet</h3>
 <p className="text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">Specify rejection reason and destination</p>
 </div>

 <div className="space-y-4 mb-6">
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-lg p-4">
 <label className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-1 block">LPN</label>
 <p className="text-[var(--foreground)] font-mono font-semibold text-lg">{palletData.palletId}</p>
 </div>

 <div>
 <label className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-2 block">Rejection Reason</label>
 <Popover open={reasonOpen} onOpenChange={setReasonOpen}>
 <PopoverTrigger asChild>
 <button
 className="w-full flex items-center justify-between px-4 py-3 bg-[var(--surface-container-high)] text-[var(--foreground)] hover:bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg text-[var(--foreground)] transition-colors"
 >
 <span className={rejectionReason ? "text-white" : "text-[var(--muted-foreground)]"}>
 {rejectionReason
 ? rejectionReasons.find(r => r.value === rejectionReason)?.label
 : "Select reason..."}
 </span>
 <Search size={16} className="text-[var(--muted-foreground)]" />
 </button>
 </PopoverTrigger>
 <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
 <Command className="bg-[var(--surface-container-high)] text-[var(--foreground)] border-[var(--border)] ">
 <CommandInput placeholder="Search reasons..." className="text-[var(--foreground)]" />
 <CommandList>
 <CommandEmpty className="text-[var(--muted-foreground)] text-sm py-6 text-center">No reason found.</CommandEmpty>
 <CommandGroup>
 {rejectionReasons.map((reason) => (
 <CommandItem
 key={reason.value}
 value={reason.value}
 onSelect={(value) => {
 setRejectionReason(value);
 setReasonOpen(false);
 }}
 className="text-[var(--foreground)] hover:bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)]"
 >
 <Check
 className={`mr-2 h-4 w-4 ${
 rejectionReason === reason.value ? "opacity-100" : "opacity-0"
 }`}
 />
 {reason.label}
 </CommandItem>
 ))}
 </CommandGroup>
 </CommandList>
 </Command>
 </PopoverContent>
 </Popover>
 </div>

 <div>
 <label className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-2 block">Move to Location</label>
 <Popover open={locationOpen} onOpenChange={setLocationOpen}>
 <PopoverTrigger asChild>
 <button
 className="w-full flex items-center justify-between px-4 py-3 bg-[var(--surface-container-high)] text-[var(--foreground)] hover:bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg text-[var(--foreground)] transition-colors"
 >
 <span className={rejectionLocation ? "text-white" : "text-[var(--muted-foreground)]"}>
 {rejectionLocation
 ? mockLocations.find(l => l.value === rejectionLocation)?.label
 : "Select location..."}
 </span>
 <Search size={16} className="text-[var(--muted-foreground)]" />
 </button>
 </PopoverTrigger>
 <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
 <Command className="bg-[var(--surface-container-high)] text-[var(--foreground)] border-[var(--border)] ">
 <CommandInput placeholder="Search locations..." className="text-[var(--foreground)]" />
 <CommandList>
 <CommandEmpty className="text-[var(--muted-foreground)] text-sm py-6 text-center">No location found.</CommandEmpty>
 <CommandGroup>
 {mockLocations.map((location) => (
 <CommandItem
 key={location.value}
 value={location.value}
 onSelect={(value) => {
 setRejectionLocation(value);
 setLocationOpen(false);
 }}
 className="text-[var(--foreground)] hover:bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)]"
 >
 <Check
 className={`mr-2 h-4 w-4 ${
 rejectionLocation === location.value ? "opacity-100" : "opacity-0"
 }`}
 />
 {location.label}
 </CommandItem>
 ))}
 </CommandGroup>
 </CommandList>
 </Command>
 </PopoverContent>
 </Popover>
 </div>
 </div>

 <div className="space-y-3">
 <button
 onClick={handleConfirmRejection}
 disabled={!rejectionReason || !rejectionLocation}
 className="w-full px-6 py-4 bg-[var(--state-error)] hover:bg-[var(--state-error-container)] disabled:bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] disabled:text-[var(--muted-foreground)] disabled:cursor-not-allowed text-[var(--state-error-foreground)] rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
 >
 <XCircle size={20} />
 Confirm Rejection
 </button>

 <button
 onClick={handleCancelRejection}
 className="w-full px-6 py-4 bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] hover:bg-[var(--surface-container-high)] text-[var(--foreground)] rounded-lg font-semibold transition-colors"
 >
 Cancel
 </button>
 </div>
 </div>
 </div>
 ) : !palletConfirmed ? (
 // Pallet Confirmation State
 <div className="max-w-md w-full">
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-xl border-[var(--border)]  p-6">
 <div className="text-center mb-6">
 <div className="w-16 h-16 bg-[var(--state-info)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
 <Package size={32} className="text-[var(--state-info)]" />
 </div>
 <h3 className="text-xl font-semibold text-[var(--foreground)]  mb-2">Confirm Pallet Information</h3>
 <p className="text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">Please verify the pallet details below</p>
 </div>

 <div className="space-y-4 mb-6">
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-lg p-4">
 <label className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-1 block">LPN</label>
 <p className="text-[var(--foreground)] font-mono font-semibold text-lg">{palletData.palletId}</p>
 </div>

 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-lg p-4">
 <label className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-1 block">Location</label>
 <p className="text-[var(--foreground)] font-mono text-lg">{palletData.location}</p>
 </div>

 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-lg p-4">
 <label className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-1 block">SKU</label>
 <p className="text-[var(--foreground)] font-mono text-lg">{palletData.sku}</p>
 </div>

 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-lg p-4">
 <label className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-1 block">Description</label>
 <p className="text-[var(--foreground)]">{palletData.description}</p>
 </div>
 </div>

 <div className="space-y-3">
 <button
 onClick={handleConfirmPallet}
 className="w-full px-6 py-4 bg-[var(--primary)] hover:opacity-90 active:scale-[0.98] text-[var(--primary-foreground)] rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
 >
 <CheckCircle2 size={20} />
 Confirm Pallet
 </button>

 <button
 onClick={handleRejectPallet}
 className="w-full px-6 py-4 bg-[var(--state-error)]/20 hover:bg-[var(--state-error)]/30 text-[var(--state-error)] rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 border border-[var(--state-error)]/40"
 >
 <XCircle size={20} />
 Reject Pallet
 </button>
 </div>
 </div>
 </div>
 ) : !layersConfirmed ? (
 // Layer Entry Keypad State
 <div className="max-w-md w-full">
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-xl border-[var(--border)]  p-6">
 <div className="text-center mb-6">
 <div className="w-16 h-16 bg-[var(--state-info)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
 <Package size={32} className="text-[var(--state-info)]" />
 </div>
 <h3 className="text-xl font-semibold text-[var(--foreground)]  mb-2">Enter Number of Layers</h3>
 <p className="text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">How many layers are on this pallet?</p>
 </div>

 {/* Display */}
 <div className="bg-[var(--surface-container-high)] text-[var(--foreground)] rounded-lg p-6 mb-6 border-2 border-[var(--border)] ">
 <p className="text-4xl font-bold text-[var(--foreground)]  text-center font-mono min-h-[3rem] flex items-center justify-center">
 {enteredLayers || "0"}
 </p>
 </div>

 {/* Keypad */}
 <div className="grid grid-cols-3 gap-3 mb-6">
 {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
 <button
 key={num}
 onClick={() => handleKeypadPress(num)}
 className="aspect-square bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] text-[var(--foreground)] text-2xl font-semibold rounded-lg transition-colors border-[var(--border)] "
 >
 {num}
 </button>
 ))}
 <button
 onClick={() => handleKeypadPress("clear")}
 className="aspect-square bg-[var(--state-error)]/20 hover:bg-[var(--state-error)]/30 text-[var(--state-error)] text-sm font-semibold rounded-lg transition-colors border border-[var(--state-error)]/40"
 >
 Clear
 </button>
 <button
 onClick={() => handleKeypadPress("0")}
 className="aspect-square bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] text-[var(--foreground)] text-2xl font-semibold rounded-lg transition-colors border-[var(--border)] "
 >
 0
 </button>
 <button
 onClick={() => handleKeypadPress("backspace")}
 className="aspect-square bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] text-[var(--foreground)] text-sm font-semibold rounded-lg transition-colors border-[var(--border)] "
 >
 ←
 </button>
 </div>

 <button
 onClick={handleConfirmLayers}
 disabled={!enteredLayers || parseInt(enteredLayers) === 0}
 className="w-full px-6 py-4 bg-[var(--primary)] hover:opacity-90 active:scale-[0.98] disabled:bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] disabled:text-[var(--muted-foreground)] disabled:cursor-not-allowed text-[var(--primary-foreground)] rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
 >
 <CheckCircle2 size={20} />
 Confirm Layers
 </button>
 </div>
 </div>
 ) : deWrapComplete ? (
 // Completion Confirmation State
 <div className="max-w-md w-full">
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-xl border-[var(--border)]  p-6">
 <div className="text-center mb-6">
 <div className="w-16 h-16 bg-[var(--state-success-container)] rounded-full flex items-center justify-center mx-auto mb-4">
 <CheckCircle2 size={32} className="text-[var(--state-success)]" />
 </div>
 <h3 className="text-xl font-semibold text-[var(--foreground)]  mb-2">Confirm DeWrap Completion</h3>
 <p className="text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">Please verify the operation details</p>
 </div>

 <div className="space-y-4 mb-6">
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-lg p-4">
 <label className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-1 block">LPN</label>
 <p className="text-[var(--foreground)] font-mono font-semibold text-lg">{palletData.palletId}</p>
 </div>

 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-lg p-4">
 <label className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-1 block">Layers DeWrapped</label>
 <p className="text-[var(--state-success)] font-semibold text-3xl">{palletData.layersToDeWrap}</p>
 </div>

 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-lg p-4">
 <label className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-1 block">Cases Accessible</label>
 <p className="text-[var(--foreground)] font-semibold text-lg">{palletData.layersToDeWrap * palletData.casesPerLayer}</p>
 </div>
 </div>

 <div className="space-y-3">
 <button
 onClick={handleConfirmCompletion}
 className="w-full px-6 py-4 bg-[var(--primary)] hover:opacity-90 active:scale-[0.98] text-[var(--primary-foreground)] rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
 >
 <CheckCircle2 size={20} />
 Confirm Completion
 </button>

 <button
 onClick={handleCancelCompletion}
 className="w-full px-6 py-4 bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] hover:bg-[var(--surface-container-high)] text-[var(--foreground)] rounded-lg font-semibold transition-colors"
 >
 Cancel
 </button>
 </div>
 </div>
 </div>
 ) : (
 // Pallet Visualization State
 <div className="flex flex-col gap-3 p-6 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-xl border-[var(--border)] ">
 {Array.from({ length: palletData.totalLayers }, (_, index) => {
 const layerNumber = index + 1; // Count from top: 1, 2, 3...
 const isLayerToDeWrap = layerNumber <= palletData.layersToDeWrap;

 return (
 <div
 key={`layer-${layerNumber}`}
 className={`w-96 h-24 rounded-lg border-2 flex items-center justify-center transition-all ${
 isLayerToDeWrap
 ? 'bg-[var(--state-success-container)]/60 border-[var(--state-success)]/40'
 : 'bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] border-[var(--border)]'
 }`}
 >
 <div className="text-center">
 <p className="text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] mb-1">Layer {layerNumber}</p>
 <p className={`text-2xl font-bold ${isLayerToDeWrap ? 'text-[var(--state-success)]' : 'text-[var(--muted-foreground)]'}`}>
 {palletData.casesPerLayer} {palletData.casesPerLayer === 1 ? 'case' : 'cases'}
 </p>
 </div>
 </div>
 );
 })}
 </div>
 )}
 </div>
 </div>
 </div>

 {/* Right Panel - Instructions & Actions */}
 <div className="w-72 flex flex-col gap-3 min-h-0">
 {isGaylordMode && gaylordPresent ? (
 <>
 {/* Gaylord Instructions */}
 <div className="bg-[var(--surface-container-high)] text-[var(--foreground)] border-[var(--border)]  rounded-xl p-4 flex-shrink-0">
 <div className="flex items-center gap-2 mb-4">
 <div className="w-8 h-8 bg-[var(--state-info)]/20 rounded-lg flex items-center justify-center">
 <Info size={16} className="text-[var(--state-info)]" />
 </div>
 <h2 className="font-semibold text-[var(--foreground)] ">Gaylord Instructions</h2>
 </div>

 <div className="space-y-3">
 <div className="bg-[var(--state-info)]/10 border border-[var(--state-info)]/40 rounded-lg p-3">
 <p className="text-xs text-[var(--state-info)] mb-1">Item Type:</p>
 <p className="text-xl font-bold text-[var(--state-info)]">{gaylordData?.itemType}</p>
 </div>

 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-lg p-3 space-y-1.5">
 <div className="flex items-start gap-2">
 <CheckCircle2 size={14} className="text-[var(--state-success)] mt-0.5 flex-shrink-0" />
 <p className="text-xs text-[var(--foreground)]">Fill gaylord with {gaylordData?.itemType?.toLowerCase()}</p>
 </div>
 <div className="flex items-start gap-2">
 <CheckCircle2 size={14} className="text-[var(--state-success)] mt-0.5 flex-shrink-0" />
 <p className="text-xs text-[var(--foreground)]">Verify gaylord is properly filled</p>
 </div>
 <div className="flex items-start gap-2">
 <CheckCircle2 size={14} className="text-[var(--state-success)] mt-0.5 flex-shrink-0" />
 <p className="text-xs text-[var(--foreground)]">Click "Gaylord Complete" when finished</p>
 </div>
 </div>

 <button
 onClick={handleGaylordComplete}
 className="w-full px-4 py-3 bg-[var(--primary)] hover:opacity-90 active:scale-[0.98] text-[var(--primary-foreground)] rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
 >
 <CheckCircle2 size={18} />
 Gaylord Complete
 </button>
 </div>
 </div>
 </>
 ) : layersConfirmed ? (
 <>
 {/* DeWrap Instructions */}
 <div className="bg-[var(--surface-container-high)] text-[var(--foreground)] border-[var(--border)]  rounded-xl p-4 flex-shrink-0">
 <div className="flex items-center gap-2 mb-4">
 <div className="w-8 h-8 bg-[var(--state-info)]/20 rounded-lg flex items-center justify-center">
 <Info size={16} className="text-[var(--state-info)]" />
 </div>
 <h2 className="font-semibold text-[var(--foreground)] ">DeWrap Instructions</h2>
 </div>

 <div className="space-y-3">
 <div className="bg-[var(--state-info)]/10 border border-[var(--state-info)]/40 rounded-lg p-3">
 <p className="text-xs text-[var(--state-info)] mb-1">Layers to DeWrap:</p>
 <p className="text-2xl font-bold text-[var(--state-info)]">{palletData.layersToDeWrap}</p>
 </div>

 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-lg p-3 space-y-1.5">
 <div className="flex items-start gap-2">
 <CheckCircle2 size={14} className="text-[var(--state-success)] mt-0.5 flex-shrink-0" />
 <p className="text-xs text-[var(--foreground)]">Remove wrap from the top {palletData.layersToDeWrap} layer(s)</p>
 </div>
 <div className="flex items-start gap-2">
 <CheckCircle2 size={14} className="text-[var(--state-success)] mt-0.5 flex-shrink-0" />
 <p className="text-xs text-[var(--foreground)]">Verify all cases are accessible</p>
 </div>
 <div className="flex items-start gap-2">
 <CheckCircle2 size={14} className="text-[var(--state-success)] mt-0.5 flex-shrink-0" />
 <p className="text-xs text-[var(--foreground)]">Click "DeWrap Complete" when finished</p>
 </div>
 </div>

 <button
 onClick={handleDeWrapComplete}
 className="w-full px-4 py-3 bg-[var(--primary)] hover:opacity-90 active:scale-[0.98] text-[var(--primary-foreground)] rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
 >
 <CheckCircle2 size={18} />
 DeWrap Complete
 </button>
 </div>
 </div>

 {/* Exception Actions */}
 <div className="bg-[var(--surface-container-high)] text-[var(--foreground)] border-[var(--border)]  rounded-xl p-4 flex-1 flex flex-col min-h-0">
 <div className="flex items-center gap-2 mb-3 flex-shrink-0">
 <div className="w-8 h-8 bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] rounded-lg flex items-center justify-center">
 <Package size={16} className="text-[var(--muted-foreground)]" />
 </div>
 <h2 className="font-semibold text-[var(--foreground)] ">Exception Actions</h2>
 </div>

 <div className="space-y-2 flex-1 min-h-0 overflow-y-auto">
 <button
 onClick={handleAdjustInventory}
 className="w-full px-3 py-2 text-sm bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] text-[var(--foreground)] rounded-lg transition-colors flex items-center justify-center gap-2 border-[var(--border)] "
 >
 <RefreshCw size={16} />
 Adjust Inventory
 </button>

 <button
 onClick={handleChangeItem}
 className="w-full px-3 py-2 text-sm bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] text-[var(--foreground)] rounded-lg transition-colors flex items-center justify-center gap-2 border-[var(--border)] "
 >
 <ArrowLeftRight size={16} />
 Change Item
 </button>

 <button
 onClick={handleSwapPallet}
 className="w-full px-3 py-2 text-sm bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] text-[var(--foreground)] rounded-lg transition-colors flex items-center justify-center gap-2 border-[var(--border)] "
 >
 <Box size={16} />
 Swap Pallet
 </button>

 <button
 onClick={handleRequestGaylord}
 className="w-full px-3 py-2 text-sm bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] text-[var(--foreground)] rounded-lg transition-colors flex items-center justify-center gap-2 border-[var(--border)] "
 >
 <Archive size={16} />
 Request Gaylord
 </button>

 <button
 onClick={handleRejectPallet}
 className="w-full px-3 py-2 text-sm bg-[var(--state-error)]/20 hover:bg-[var(--state-error)]/30 text-[var(--state-error)] rounded-lg transition-colors flex items-center justify-center gap-2 border border-[var(--state-error)]/40"
 >
 <XCircle size={16} />
 Reject Pallet
 </button>
 </div>
 </div>
 </>
 ) : (
 <div className="bg-[var(--surface-container-high)] text-[var(--foreground)] border-[var(--border)]  rounded-xl p-6 flex-1 flex items-center justify-center">
 <div className="text-center">
 {isGaylordMode ? (
 <Archive size={48} className="text-[var(--foreground)] mx-auto mb-3" />
 ) : (
 <Info size={48} className="text-[var(--foreground)] mx-auto mb-3" />
 )}
 {isGaylordMode && !gaylordPresent ? (
 <>
 <p className="text-[var(--muted-foreground)]">Awaiting Gaylord</p>
 <p className="text-[var(--muted-foreground)] text-sm mt-2">Instructions will appear when gaylord arrives</p>
 </>
 ) : scanFailed && !lpnLookupFailed ? (
 <>
 <p className="text-[var(--state-error)]">Scan Failed</p>
 <p className="text-[var(--muted-foreground)] text-sm mt-2">Enter LPN manually</p>
 </>
 ) : lpnLookupFailed ? (
 <>
 <p className="text-[var(--state-error)]">LPN Not Found</p>
 <p className="text-[var(--muted-foreground)] text-sm mt-2">Enter SKU information manually</p>
 </>
 ) : !palletPresent ? (
 <>
 <p className="text-[var(--muted-foreground)]">Awaiting Pallet</p>
 <p className="text-[var(--muted-foreground)] text-sm mt-2">Instructions will appear when pallet arrives</p>
 </>
 ) : !palletConfirmed ? (
 <>
 <p className="text-[var(--muted-foreground)]">Confirm Pallet</p>
 <p className="text-[var(--muted-foreground)] text-sm mt-2">Please confirm pallet information</p>
 </>
 ) : (
 <>
 <p className="text-[var(--muted-foreground)]">Enter Layers</p>
 <p className="text-[var(--muted-foreground)] text-sm mt-2">Please enter number of layers</p>
 </>
 )}
 </div>
 </div>
 )}
 </div>
 </div>
 </div>
 );
}
