import { useState, useRef, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { RefreshCw, Grid3x3, Package, Box, CheckCircle2, AlertCircle, AlertTriangle, Scan, List, X, ArrowLeft, ClipboardList, Flame, Plus, Minus, Check, Info, History, ChevronRight, ChevronLeft, Home, Trash2, Printer, GripVertical, Columns, MoreHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { WorkListDetailsPanel } from "../components/WorkListDetailsPanel";
import { PickModals } from "./PickModals";
import type {
 WorkItem,
 WorkLine,
 WorkOperation,
 SortbarRegistration,
 ReplenItem,
 Compartment,
} from "./PickData";
import {
 initialSortbars,
 mockPickLists,
 generateWorkListDetail,
 generateWorkLines,
 generateWorkOperations,
 generateMockItems,
 generateCompartments,
 generateInitialRegistrations,
} from "./PickData";

export function Pick() {
 const [selectedSortbar, setSelectedSortbar] = useState<string | null>(null);
 const [registrationMethod, setRegistrationMethod] = useState<"list" | "lpn" | null>(null);
 const [showListSelection, setShowListSelection] = useState(false);
 const [showLpnInput, setShowLpnInput] = useState(false);
 const [selectedList, setSelectedList] = useState<string | null>(null);
 const [lpnInput, setLpnInput] = useState("");
 const [items, setItems] = useState<ReplenItem[]>([]);
 const [sortbarRegistrations, setSortbarRegistrations] = useState<SortbarRegistration[]>(generateInitialRegistrations());
 const [showSortbarMenu, setShowSortbarMenu] = useState(false);
 const [selectedItem, setSelectedItem] = useState<ReplenItem | null>(null);
 const [processedQuantity, setProcessedQuantity] = useState(0);
 const [isEditingQuantity, setIsEditingQuantity] = useState(false);
 const [quantityInput, setQuantityInput] = useState("");
 const [processedItems, setProcessedItems] = useState<Map<string, number>>(new Map());
 const [compartmentInventory, setCompartmentInventory] = useState<Map<string, number>>(new Map());
 const [showAdjustInventory, setShowAdjustInventory] = useState(false);
 const [adjustInventoryStep, setAdjustInventoryStep] = useState<"select-item" | "adjust-quantity" | "reason-code">("select-item");
 const [selectedAdjustItem, setSelectedAdjustItem] = useState<ReplenItem | null>(null);
 const [adjustInventoryDelta, setAdjustInventoryDelta] = useState(0);
 const [adjustInventoryReasonCode, setAdjustInventoryReasonCode] = useState("");
 const [showSkuVerification, setShowSkuVerification] = useState(false);
 const [skuVerificationInput, setSkuVerificationInput] = useState("");
 const [showChangeContainer, setShowChangeContainer] = useState(false);
 const [newContainerLpn, setNewContainerLpn] = useState("");
 const [containerAction, setContainerAction] = useState<"swap" | "split" | "change" | null>(null);
 const [currentContainerLpn, setCurrentContainerLpn] = useState("");
 const [originalContainerLpn, setOriginalContainerLpn] = useState("");
 const [showSwapPrompt, setShowSwapPrompt] = useState(false);
 const [completedPicks, setCompletedPicks] = useState<Array<{ completedAt: Date; duration: number }>>([]); // Track completed picks for rate calculation
 const [itemPickStartTime, setItemPickStartTime] = useState<Date | null>(null);
 const [completedPickLists, setCompletedPickLists] = useState<Array<{ completedAt: Date; duration: number; itemCount: number }>>([]); // Track completed pick lists
 const [pickListStartTime, setPickListStartTime] = useState<Date | null>(null);
 const [showCompletionConfirmation, setShowCompletionConfirmation] = useState(false);
 const [activeSortbar, setActiveSortbar] = useState<string | null>(null); // Track which sortbar is currently active/selected for viewing
 const [showNumberPad, setShowNumberPad] = useState(false);
 const [showLegend, setShowLegend] = useState(false);
 const [showHistory, setShowHistory] = useState(false);
 const [sortbarCount, setSortbarCount] = useState<2 | 5 | 8 | 10 | 16 | 40>(40);
 const [panelView, setPanelView] = useState<"menu" | "list" | "lpn" | "details">("menu"); // Track which view is shown in the right panel
 const [showReasonCodeModal, setShowReasonCodeModal] = useState(false);
 const [reasonCodeInput, setReasonCodeInput] = useState("");
 const [pendingShortItem, setPendingShortItem] = useState<ReplenItem | null>(null);
 const [itemNavigationHistory, setItemNavigationHistory] = useState<string[]>([]);
 const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);
 const [showCompartmentEmptyConfirm, setShowCompartmentEmptyConfirm] = useState(false);
 const [pendingCompartmentEmpty, setPendingCompartmentEmpty] = useState<{ item: ReplenItem; compartmentId: string } | null>(null);
 const [sectionOrder, setSectionOrder] = useState<string[]>(["sortbar", "item", "bin"]);
 const [layoutMode, setLayoutMode] = useState<"pick-port" | "pack-hold" | "pack-hold-horizontal">("pick-port");
 const [itemBinAssignments, setItemBinAssignments] = useState<Map<string, 1 | 2>>(new Map());
 const [binArrivals, setBinArrivals] = useState<Set<1 | 2>>(new Set([1])); // Track which bins have arrived (bin 1 starts as arrived)
 const [binArrivalTimers, setBinArrivalTimers] = useState<Map<1 | 2, NodeJS.Timeout>>(new Map());
 const [autoRegisterEnabled, setAutoRegisterEnabled] = useState(false);
 const [showSingleLpnModal, setShowSingleLpnModal] = useState(false);
 const [singleLpnInput, setSingleLpnInput] = useState("");
 const [singleLpnSortbarId, setSingleLpnSortbarId] = useState<string | null>(null);
 const [singleLpnWorkListId, setSingleLpnWorkListId] = useState<string | null>(null);
 const [showAutoRegister, setShowAutoRegister] = useState(false);
 const [autoRegisterCount, setAutoRegisterCount] = useState<number>(1);
 const [autoRegisterStep, setAutoRegisterStep] = useState<'count' | 'confirm' | 'scan'>('count');
 const [autoRegisterAssignments, setAutoRegisterAssignments] = useState<Array<{sortbarId: string, sortbarName: string, workListId: string, workListName: string}>>([]);
 const [autoRegisterCurrentIndex, setAutoRegisterCurrentIndex] = useState(0);
 const [autoRegisterLpnInput, setAutoRegisterLpnInput] = useState("");
 const [flashingSortbar, setFlashingSortbar] = useState<string | null>(null);
 const [currentItemSortbars, setCurrentItemSortbars] = useState<string[]>([]); // Which sortbars need the current item
 const [currentItemSortbarIndex, setCurrentItemSortbarIndex] = useState(0); // Current sortbar index for the item
 const [horizSortbarPickIdx, setHorizSortbarPickIdx] = useState(0); // Horizontal layout: which sortbar in crossSortbarItems we're picking for
 const [sortbarAdjustedQtys, setSortbarAdjustedQtys] = useState<Map<string, number>>(new Map()); // Per-sortbar adjusted pick qty in horizontal layout
 const [confirmedSortbars, setConfirmedSortbars] = useState<Set<string>>(new Set()); // Which sortbars have been confirmed for current item
 const [horizBinRetrieving, setHorizBinRetrieving] = useState(false); // Show "retrieving bin" overlay between items
 const [horizItemRetrieving, setHorizItemRetrieving] = useState(false); // Show "retrieving item" overlay when item changes
 // Short-pick / split-container flow
 const [shortPickSortbarId, setShortPickSortbarId] = useState<string | null>(null);
 const [shortPickReasonCode, setShortPickReasonCode] = useState("");
 const [shortPickReasonSearch, setShortPickReasonSearch] = useState("");
 const [shortPickReasonDropdownOpen, setShortPickReasonDropdownOpen] = useState(false);
 const [pickChoiceSortbarId, setPickChoiceSortbarId] = useState<string | null>(null); // "Short pick or Split?" prompt
 const [splitStep, setSplitStep] = useState<"lpn" | null>(null); // null = choice shown, "lpn" = LPN entry
 const [splitLpnInput, setSplitLpnInput] = useState("");
 const [splitContainerQtyOverrides, setSplitContainerQtyOverrides] = useState<Map<string, number>>(new Map()); // sortbarId → remaining qty to pick
 const [splitContainerCredits, setSplitContainerCredits] = useState<Map<string, number>>(new Map()); // sortbarId → qty already picked from prior container(s)

 // Cleanup timers on unmount or when switching modes
 useEffect(() => {
 return () => {
 binArrivalTimers.forEach(timer => clearTimeout(timer));
 };
 }, []);

 // Reset bin arrivals when switching sortbars or layout modes
 useEffect(() => {
 setBinArrivals(new Set([1])); // Reset to only bin 1 arrived
 binArrivalTimers.forEach(timer => clearTimeout(timer));
 setBinArrivalTimers(new Map());
 }, [activeSortbar, layoutMode]);

 // Check if sortbar is registered
 const isRegistered = (sortbarId: string) => {
 return sortbarRegistrations.some(reg => reg.sortbarId === sortbarId);
 };

 // Get registration for a sortbar
 const getRegistration = (sortbarId: string) => {
 return sortbarRegistrations.find(reg => reg.sortbarId === sortbarId);
 };

 // Get sortbar status
 const getSortbarStatus = (sortbarId: string) => {
 // Set A6 to maintenance status
 if (sortbarId === "SB-A6") return "maintenance";
 return isRegistered(sortbarId) ? "in-use" : "available";
 };

 const handleSortbarSelect = (sortbarId: string) => {
 if (getSortbarStatus(sortbarId) === "maintenance") return;
 
 // Save current sortbar state before switching
 if (selectedSortbar && isRegistered(selectedSortbar)) {
 setSortbarRegistrations(sortbarRegistrations.map(reg => 
 reg.sortbarId === selectedSortbar
 ? { ...reg, items: [...items], processedItems: new Map(processedItems), selectedItemId: selectedItem?.id || null }
 : reg
 ));
 }
 
 setSelectedSortbar(sortbarId);
 setRegistrationMethod(null);
 setShowListSelection(false);
 setShowLpnInput(false);
 setPanelView("menu");

 // Set as active sortbar
 setActiveSortbar(sortbarId);

 // If registered, load its data and show menu by default
 const registration = getRegistration(sortbarId);
 if (registration) {
 setShowSortbarMenu(true);
 // panelView already set to "menu" above - show sortbar actions by default for registered sortbars
 setItems([...registration.items]);
 setSelectedList(registration.workListId);
 setProcessedItems(new Map(registration.processedItems));
 setCurrentContainerLpn(registration.lpn);
 setOriginalContainerLpn(registration.lpn);

 // Initialize compartment inventory
 const inventoryMap = new Map<string, number>();
 registration.items.forEach(item => {
 if (item.compartmentLpn) {
 // Randomly set compartment inventory to either match pick quantity or have extra
 // 50% chance it matches exactly, 50% chance it has 1-10 extra units
 const extraUnits = Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 10) + 1;
 inventoryMap.set(item.compartmentLpn, item.quantity + extraUnits);
 }
 });
 setCompartmentInventory(inventoryMap);

 // In Pack & Hold mode, pre-assign all items to bins if not already assigned
 if (layoutMode === "pack-hold" && registration.items.length > 0) {
 const needsAssignment = registration.items.some(item => !itemBinAssignments.has(item.id));

 if (needsAssignment) {
 const assignments = new Map(itemBinAssignments);
 registration.items.forEach(item => {
 if (!assignments.has(item.id)) {
 const bin = Math.random() < 0.5 ? 1 : 2;
 assignments.set(item.id, bin as 1 | 2);
 }
 });
 setItemBinAssignments(assignments);

 // Trigger arrival timer for the second bin if there are multiple unprocessed items
 const unprocessedItems = registration.items.filter(item => !registration.processedItems.has(item.id));
 if (unprocessedItems.length > 1) {
 const firstItem = registration.items.find(item => item.id === registration.selectedItemId) || registration.items[0];
 const firstItemBin = assignments.get(firstItem.id);
 const otherBin = firstItemBin === 1 ? 2 : 1;

 // Check if any unprocessed items are assigned to the other bin
 const hasItemsInOtherBin = unprocessedItems.some(item =>
 assignments.get(item.id) === otherBin && item.id !== firstItem.id
 );

 if (hasItemsInOtherBin && !binArrivalTimers.has(otherBin)) {
 const timer = setTimeout(() => {
 setBinArrivals(prev => new Set(prev).add(otherBin));
 setBinArrivalTimers(prev => {
 const newMap = new Map(prev);
 newMap.delete(otherBin);
 return newMap;
 });
 }, 5000);

 setBinArrivalTimers(prev => new Map(prev).set(otherBin, timer));
 }
 }
 }
 }

 // Load previously selected item or first item
 const targetItem = registration.items.find(item => item.id === registration.selectedItemId) || registration.items[0];
 if (targetItem) {
 // In Pack & Hold mode, use handleItemSelect to ensure bin assignment
 if (layoutMode === "pack-hold") {
 handleItemSelect(targetItem);
 } else {
 setSelectedItem(targetItem);
 setProcessedQuantity(registration.processedItems.get(targetItem.id) ?? targetItem.quantity);
 // Start timing if not already processed
 if (!registration.processedItems.has(targetItem.id)) {
 setItemPickStartTime(new Date());
 }
 }
 }
 } else {
 // Not registered
 // For A4 sortbar, auto-register with a work list
 if (sortbarId === "SB-A4") {
 // Find an available work list that's not already registered
 const availableList = mockPickLists.find(list =>
 !sortbarRegistrations.some(reg => reg.workListId === list.id)
 );

 if (availableList) {
 const listId = availableList.id;
 const lpn = `LPN-A4-${Date.now()}`; // Generate unique LPN

 // Generate items for this work list
 const itemsList = generateMockItems(listId, sortbarId);

 // Ensure all items have compartmentLpn
 const itemsWithCompartments = itemsList.map(item => ({
 ...item,
 compartmentLpn: item.compartmentLpn || `${item.containerName.replace('CONT-', 'LPN-')}-C01`
 }));

 setItems(itemsWithCompartments);
 setProcessedItems(new Map());
 setSelectedList(listId);
 setCurrentContainerLpn(lpn);
 setOriginalContainerLpn(lpn);

 // Initialize compartment inventory
 const inventoryMap = new Map<string, number>();
 itemsWithCompartments.forEach(item => {
 const extraUnits = Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 10) + 1;
 inventoryMap.set(item.compartmentLpn, item.quantity + extraUnits);
 });
 setCompartmentInventory(inventoryMap);

 // In Pack & Hold mode, pre-assign all items to bins
 if (layoutMode === "pack-hold" && itemsWithCompartments.length > 0) {
 const assignments = new Map<string, 1 | 2>();
 itemsWithCompartments.forEach(item => {
 const bin = Math.random() < 0.5 ? 1 : 2;
 assignments.set(item.id, bin as 1 | 2);
 });
 setItemBinAssignments(assignments);

 // Trigger arrival timer for the second bin if there are multiple items
 if (itemsWithCompartments.length > 1) {
 const firstItemBin = assignments.get(itemsWithCompartments[0].id);
 const otherBin = firstItemBin === 1 ? 2 : 1;

 const hasItemsInOtherBin = itemsWithCompartments.some(item =>
 assignments.get(item.id) === otherBin
 );

 if (hasItemsInOtherBin && !binArrivalTimers.has(otherBin)) {
 const timer = setTimeout(() => {
 setBinArrivals(prev => new Set(prev).add(otherBin));
 setBinArrivalTimers(prev => {
 const newMap = new Map(prev);
 newMap.delete(otherBin);
 return newMap;
 });
 }, 5000);

 setBinArrivalTimers(prev => new Map(prev).set(otherBin, timer));
 }
 }
 }

 // Auto-select first item
 if (itemsWithCompartments.length > 0) {
 if (layoutMode === "pack-hold") {
 handleItemSelect(itemsWithCompartments[0]);
 } else {
 setSelectedItem(itemsWithCompartments[0]);
 setProcessedQuantity(itemsWithCompartments[0].quantity);
 setItemPickStartTime(new Date());
 }
 }

 // Add to registrations
 const sortbarData = initialSortbars.find(s => s.id === sortbarId);
 const listData = mockPickLists.find(l => l.id === listId);
 const totalQty = itemsWithCompartments.reduce((sum, item) => sum + item.quantity, 0);

 setSortbarRegistrations([
 ...sortbarRegistrations,
 {
 sortbarId: sortbarId,
 workListId: listId,
 lpn: lpn,
 registrationMethod: "list",
 itemCount: itemsWithCompartments.length,
 totalQuantity: totalQty,
 items: itemsWithCompartments,
 processedItems: new Map(),
 selectedItemId: itemsWithCompartments[0]?.id || null
 }
 ]);

 // Show success toast
 toast.success("Pick List Auto-Registered", {
 description: `${sortbarData?.name} - Pick List: ${listId}`,
 duration: 5000,
 style: {
 background: 'rgb(22 163 74)',
 color: 'white',
 border: '2px solid rgb(21 128 61)',
 fontSize: '1.125rem',
 padding: '1rem 1.5rem',
 },
 });

 // Don't show the menu panel for A4
 setShowSortbarMenu(false);
 }
 } else {
 // Not A4 - automatically go to list selection for Pick
 if (autoRegisterEnabled) {
 // Auto-pick the first available worklist
 const usedListIds = new Set(sortbarRegistrations.map(r => r.workListId));
 const availableList = mockPickLists.find(l => !usedListIds.has(l.id));
 if (availableList) {
 setSingleLpnSortbarId(sortbarId);
 setSingleLpnWorkListId(availableList.id);
 setSingleLpnInput("");
 setShowSingleLpnModal(true);
 setItems([]);
 setSelectedList(null);
 setSelectedItem(null);
 setProcessedQuantity(0);
 setProcessedItems(new Map());
 } else {
 // No available lists — fall back to manual selection
 setShowSortbarMenu(true);
 setPanelView("list");
 setRegistrationMethod("list");
 setItems([]);
 setSelectedList(null);
 setSelectedItem(null);
 setProcessedQuantity(0);
 setProcessedItems(new Map());
 }
 } else {
 setShowSortbarMenu(true);
 setPanelView("list"); // Skip registration method selection, go straight to list
 setRegistrationMethod("list"); // Set to list method automatically
 setItems([]);
 setSelectedList(null);
 setSelectedItem(null);
 setProcessedQuantity(0);
 setProcessedItems(new Map());
 }
 }
 }
 };

 const handleCloseSortbarMenu = () => {
 setShowSortbarMenu(false);
 setSelectedSortbar(null);
 setPanelView("menu");
 };

 const handleRegistrationMethodSelect = (method: "list" | "lpn") => {
 setRegistrationMethod(method);
 if (method === "list") {
 setPanelView("list");
 } else {
 setPanelView("lpn");
 }
 };

 const handleListSelect = (listId: string) => {
 setSelectedList(listId);
 // Show centered LPN modal instead of side panel
 setSingleLpnSortbarId(selectedSortbar);
 setSingleLpnWorkListId(listId);
 setSingleLpnInput("");
 setShowSingleLpnModal(true);
 };

 const handleLpnSubmit = () => {
 if (lpnInput.trim() && selectedSortbar && selectedList) {
 // Complete registration with both work list and LPN
 const itemsList = generateMockItems(selectedList, selectedSortbar);

 // Ensure all items have compartmentLpn
 const itemsWithCompartments = itemsList.map(item => ({
 ...item,
 compartmentLpn: item.compartmentLpn || `${item.containerName.replace('CONT-', 'LPN-')}-C01`
 }));

 setItems(itemsWithCompartments);
 setProcessedItems(new Map());

 // Initialize compartment inventory
 const inventoryMap = new Map<string, number>();
 itemsWithCompartments.forEach(item => {
 // Randomly set compartment inventory to either match pick quantity or have extra
 // 50% chance it matches exactly, 50% chance it has 1-10 extra units
 const extraUnits = Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 10) + 1;
 inventoryMap.set(item.compartmentLpn, item.quantity + extraUnits);
 });
 setCompartmentInventory(inventoryMap);

 // In Pack & Hold mode, pre-assign all items to bins randomly
 if (layoutMode === "pack-hold" && itemsWithCompartments.length > 0) {
 const assignments = new Map<string, 1 | 2>();
 itemsWithCompartments.forEach(item => {
 const bin = Math.random() < 0.5 ? 1 : 2;
 assignments.set(item.id, bin as 1 | 2);
 });
 setItemBinAssignments(assignments);

 // Trigger arrival timer for the second bin if there are multiple items
 if (itemsWithCompartments.length > 1) {
 const firstItemBin = assignments.get(itemsWithCompartments[0].id);
 const otherBin = firstItemBin === 1 ? 2 : 1;

 // Check if any items are assigned to the other bin
 const hasItemsInOtherBin = itemsWithCompartments.some(item =>
 assignments.get(item.id) === otherBin
 );

 if (hasItemsInOtherBin && !binArrivalTimers.has(otherBin)) {
 const timer = setTimeout(() => {
 setBinArrivals(prev => new Set(prev).add(otherBin));
 setBinArrivalTimers(prev => {
 const newMap = new Map(prev);
 newMap.delete(otherBin);
 return newMap;
 });
 }, 5000);

 setBinArrivalTimers(prev => new Map(prev).set(otherBin, timer));
 }
 }
 }

 // Auto-select first item
 if (itemsWithCompartments.length > 0) {
 handleItemSelect(itemsWithCompartments[0]);
 }

 // Start timing for pick list
 setPickListStartTime(new Date());

 // Add to registrations
 const sortbarData = initialSortbars.find(s => s.id === selectedSortbar);
 const listData = mockPickLists.find(l => l.id === selectedList);
 const totalQty = itemsWithCompartments.reduce((sum, item) => sum + item.quantity, 0);

 setSortbarRegistrations([
 ...sortbarRegistrations,
 {
 sortbarId: selectedSortbar,
 workListId: selectedList,
 lpn: lpnInput,
 registrationMethod: "list",
 itemCount: itemsWithCompartments.length,
 totalQuantity: totalQty,
 items: itemsWithCompartments,
 processedItems: new Map(),
 selectedItemId: itemsWithCompartments[0]?.id || null
 }
 ]);

 // Set as active sortbar
 setActiveSortbar(selectedSortbar);

 // Initialize container LPNs
 setCurrentContainerLpn(lpnInput);
 setOriginalContainerLpn(lpnInput);
 setContainerAction(null);

 // Show success toast
 toast.success("Pick Registered", {
 description: `${sortbarData?.name} - Pick List: ${selectedList} - LPN: ${lpnInput}`,
 duration: 5000,
 style: {
 background: 'rgb(22 163 74)',
 color: 'white',
 border: '2px solid rgb(21 128 61)',
 fontSize: '1.125rem',
 padding: '1rem 1.5rem',
 },
 });

 // Close the sortbar menu after registration
 setPanelView("menu");
 setLpnInput("");
 setShowSortbarMenu(false);
 setSelectedSortbar(null);
 }
 };

 const handleSingleLpnSubmit = () => {
 if (!singleLpnInput.trim() || !singleLpnSortbarId || !singleLpnWorkListId) return;

 const itemsList = generateMockItems(singleLpnWorkListId, singleLpnSortbarId);
 const itemsWithCompartments = itemsList.map(item => ({
 ...item,
 compartmentLpn: item.compartmentLpn || `${item.containerName.replace('CONT-', 'LPN-')}-C01`
 }));

 const totalQty = itemsWithCompartments.reduce((sum, item) => sum + item.quantity, 0);
 const sortbarData = initialSortbars.find(s => s.id === singleLpnSortbarId);
 const listData = mockPickLists.find(l => l.id === singleLpnWorkListId);

 const inventoryMap = new Map<string, number>();
 itemsWithCompartments.forEach(item => {
 const extraUnits = Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 10) + 1;
 inventoryMap.set(item.compartmentLpn, item.quantity + extraUnits);
 });
 setCompartmentInventory(inventoryMap);

 const newRegistration = {
 sortbarId: singleLpnSortbarId,
 workListId: singleLpnWorkListId,
 lpn: singleLpnInput,
 registrationMethod: "list" as const,
 itemCount: itemsWithCompartments.length,
 totalQuantity: totalQty,
 items: itemsWithCompartments,
 processedItems: new Map(),
 selectedItemId: itemsWithCompartments[0]?.id || null
 };

 setSortbarRegistrations(prev => [...prev, newRegistration]);
 setActiveSortbar(singleLpnSortbarId);
 setSelectedSortbar(singleLpnSortbarId);
 setItems(itemsWithCompartments);
 setSelectedList(singleLpnWorkListId);
 setProcessedItems(new Map());
 setCurrentContainerLpn(singleLpnInput);
 setOriginalContainerLpn(singleLpnInput);
 setContainerAction(null);
 setPickListStartTime(new Date());

 if (itemsWithCompartments.length > 0) {
 handleItemSelect(itemsWithCompartments[0]);
 }

 toast.success("Pick Registered", {
 description: `${sortbarData?.name} - Pick List: ${listData?.name || singleLpnWorkListId} - LPN: ${singleLpnInput}`,
 duration: 5000,
 style: {
 background: 'rgb(22 163 74)',
 color: 'white',
 border: '2px solid rgb(21 128 61)',
 fontSize: '1.125rem',
 padding: '1rem 1.5rem',
 },
 });

 setShowSingleLpnModal(false);
 setSingleLpnInput("");
 setSingleLpnSortbarId(null);
 setSingleLpnWorkListId(null);
 setPanelView("menu");
 setShowSortbarMenu(false);
 };

 // Cross-sortbar quantity breakdown for the selected item's SKU
 // splitContainerQtyOverrides can override the expected qty per sortbar after a split
 const crossSortbarItems = useMemo(() => {
 if (!selectedItem) return [];
 return sortbarRegistrations
 .map(reg => {
 const match = reg.items.find(i => i.sku === selectedItem.sku);
 if (!match) return null;
 const sortbar = initialSortbars.find(s => s.id === reg.sortbarId);
 const quantity = splitContainerQtyOverrides.get(reg.sortbarId) ?? match.quantity;
 return { sortbarName: sortbar?.name ?? reg.sortbarId, quantity, sortbarId: reg.sortbarId };
 })
 .filter((x): x is { sortbarName: string; quantity: number; sortbarId: string } => x !== null);
 }, [selectedItem, sortbarRegistrations, splitContainerQtyOverrides]);

 // Reset horizontal sortbar state when the item SKU changes (i.e. truly a new item)
 useEffect(() => {
 setHorizSortbarPickIdx(0);
 setConfirmedSortbars(new Set());
 setSortbarAdjustedQtys(new Map());
 setSplitContainerQtyOverrides(new Map());
 setSplitContainerCredits(new Map());
 }, [selectedItem?.sku]);

 // Handler for horizontal layout Next/Confirm — cycles through sortbars for the same item before advancing
 const handleHorizNextOrConfirm = () => {
 if (!selectedItem || !activeSortbar) return;

 // Save processed qty into current sortbar's registration
 setSortbarRegistrations(prev => prev.map(reg => {
 if (reg.sortbarId !== activeSortbar) return reg;
 const newProcessed = new Map(reg.processedItems);
 newProcessed.set(selectedItem.id, processedQuantity);
 return { ...reg, processedItems: newProcessed };
 }));

 if (horizSortbarPickIdx < crossSortbarItems.length - 1) {
 // More sortbars need this same item — advance to next sortbar
 const nextIdx = horizSortbarPickIdx + 1;
 setHorizSortbarPickIdx(nextIdx);
 const nextSortbarId = crossSortbarItems[nextIdx].sortbarId;
 setActiveSortbar(nextSortbarId);

 // Load the matching item from the next registration
 const nextReg = sortbarRegistrations.find(r => r.sortbarId === nextSortbarId);
 if (nextReg) {
 const matchingItem = nextReg.items.find(i => i.sku === selectedItem.sku);
 if (matchingItem) {
 setSelectedItem(matchingItem);
 setProcessedQuantity(nextReg.processedItems.get(matchingItem.id) ?? matchingItem.quantity);
 }
 setItems(nextReg.items);
 setSelectedList(nextReg.workListId);
 }
 } else {
 // All sortbars done for this item — reset idx and advance to next item
 setHorizSortbarPickIdx(0);

 // Return to the first sortbar to pick the next item
 const firstSortbarId = crossSortbarItems[0]?.sortbarId ?? activeSortbar;
 setActiveSortbar(firstSortbarId);
 const firstReg = sortbarRegistrations.find(r => r.sortbarId === firstSortbarId);
 if (firstReg) {
 setItems(firstReg.items);
 setSelectedList(firstReg.workListId);
 const currentIdx = firstReg.items.findIndex(i => i.sku === selectedItem.sku);
 const nextItem = firstReg.items[currentIdx + 1] ?? null;
 if (nextItem) {
 setSelectedItem(nextItem);
 setProcessedQuantity(firstReg.processedItems.get(nextItem.id) ?? nextItem.quantity);
 } else {
 // All items in first reg are done — show completion toast
 toast.success("Pick List Complete", {
 description: `All items picked for ${firstReg.workListId}`,
 duration: 4000,
 style: { background: 'rgb(22 163 74)', color: 'white', border: '2px solid rgb(21 128 61)', fontSize: '1.125rem', padding: '1rem 1.5rem' },
 });
 setSelectedItem(null);
 setProcessedQuantity(0);
 }
 }
 }
 };

 const SHORT_PICK_REASONS = [
 "Product Not Available",
 "Insufficient Stock",
 "Damaged / Unsellable",
 "Wrong Item in Location",
 "Location Empty",
 "Bin Mismatch",
 "System Count Error",
 "Supervisor Override",
 "Other",
 ];

 // Perform the actual confirm (called directly or after reason-code entry for short picks)
 const doConfirmForSortbar = (sortbarId: string) => {
 const crossItem = crossSortbarItems.find(x => x.sortbarId === sortbarId);
 if (!crossItem || !selectedItem) return;

 // Add any qty already picked from a prior split container
 const credit = splitContainerCredits.get(sortbarId) ?? 0;
 const adjustedQty = (sortbarAdjustedQtys.get(sortbarId) ?? crossItem.quantity) + credit;
 if (credit > 0) {
 setSplitContainerCredits(prev => { const m = new Map(prev); m.delete(sortbarId); return m; });
 }

 const updatedRegistrations = sortbarRegistrations.map(reg => {
 if (reg.sortbarId !== sortbarId) return reg;
 const newProcessed = new Map(reg.processedItems);
 newProcessed.set(selectedItem.id, adjustedQty);
 return { ...reg, processedItems: newProcessed };
 });
 setSortbarRegistrations(updatedRegistrations);

 const newConfirmed = new Set(confirmedSortbars);
 newConfirmed.add(sortbarId);
 setConfirmedSortbars(newConfirmed);

 const allConfirmed = crossSortbarItems.every(x => newConfirmed.has(x.sortbarId));
 if (!allConfirmed) return;

 // Peek at the next item to decide whether to show the item-retrieval overlay
 const peekRemaining = updatedRegistrations.filter(r => !(() => {
 const byWl = new Map<string, typeof updatedRegistrations>();
 for (const reg of updatedRegistrations) { const a = byWl.get(reg.workListId) ?? []; a.push(reg); byWl.set(reg.workListId, a); }
 const done = new Set<string>();
 for (const [wlId, regs] of byWl) { if (regs.every(r => r.items.every(i => r.processedItems.has(i.id)))) done.add(wlId); }
 return done;
 })().has(r.workListId));
 const peekNextReg = peekRemaining.find(r => r.items.some(i => !r.processedItems.has(i.id))) ?? peekRemaining[0];
 const peekNextItem = peekNextReg?.items.find(i => !peekNextReg.processedItems.has(i.id)) ?? null;
 const itemChanging = peekNextItem?.sku !== selectedItem?.sku;

 setHorizBinRetrieving(true);
 if (itemChanging) setHorizItemRetrieving(true);
 setTimeout(() => {
 setHorizBinRetrieving(false);
 setHorizItemRetrieving(false);
 setConfirmedSortbars(new Set());
 setSortbarAdjustedQtys(new Map());
 setHorizSortbarPickIdx(0);

 const byWorklist = new Map<string, typeof updatedRegistrations>();
 for (const reg of updatedRegistrations) {
 const arr = byWorklist.get(reg.workListId) ?? [];
 arr.push(reg);
 byWorklist.set(reg.workListId, arr);
 }

 const completedWorklistIds = new Set<string>();
 for (const [wlId, regs] of byWorklist) {
 const done = regs.every(r => r.items.every(item => r.processedItems.has(item.id)));
 if (done) completedWorklistIds.add(wlId);
 }

 for (const wlId of completedWorklistIds) {
 toast.success("Pick List Complete", {
 description: `All items picked for ${wlId}`,
 duration: 4000,
 style: { background: 'rgb(22 163 74)', color: 'white', border: '2px solid rgb(21 128 61)', fontSize: '1.125rem', padding: '1rem 1.5rem' },
 });
 }

 const remaining = updatedRegistrations.filter(r => !completedWorklistIds.has(r.workListId));
 setSortbarRegistrations(remaining);

 if (remaining.length === 0) {
 setActiveSortbar(null);
 setSelectedItem(null);
 setItems([]);
 setSelectedList(null);
 setProcessedQuantity(0);
 return;
 }

 const nextReg = remaining.find(r => r.items.some(item => !r.processedItems.has(item.id))) ?? remaining[0];
 const nextItem = nextReg.items.find(item => !nextReg.processedItems.has(item.id)) ?? null;

 setActiveSortbar(nextReg.sortbarId);
 setItems(nextReg.items);
 setSelectedList(nextReg.workListId);
 if (nextItem) {
 setSelectedItem(nextItem);
 setProcessedQuantity(nextReg.processedItems.get(nextItem.id) ?? nextItem.quantity);
 } else {
 setSelectedItem(null);
 setProcessedQuantity(0);
 }
 }, 2000);
 };

 // Handler for horizontal layout: confirm pick for a specific sortbar tile (any-order)
 const handleConfirmForSortbar = (sortbarId: string) => {
 const crossItem = crossSortbarItems.find(x => x.sortbarId === sortbarId);
 if (!crossItem || !selectedItem) return;
 const adjustedQty = sortbarAdjustedQtys.get(sortbarId) ?? crossItem.quantity;
 if (adjustedQty < crossItem.quantity) {
 // Reduced qty — ask Short Pick or Split Container first
 setPickChoiceSortbarId(sortbarId);
 setSplitStep(null);
 setSplitLpnInput("");
 setShortPickReasonCode("");
 setShortPickReasonSearch("");
 setShortPickReasonDropdownOpen(false);
 } else {
 doConfirmForSortbar(sortbarId);
 }
 };

 const handleShowDetails = () => {
 setPanelView("details");
 };

 const handleUnregister = () => {
 if (selectedSortbar) {
 setSortbarRegistrations(sortbarRegistrations.filter(reg => reg.sortbarId !== selectedSortbar));
 setItems([]);
 setSelectedList(null);
 setLpnInput("");
 setSelectedItem(null);
 setProcessedQuantity(0);
 setProcessedItems(new Map());
 setActiveSortbar(null);
 setShowSortbarMenu(false);
 setSelectedSortbar(null);
 
 toast.success("Sortbar Unregistered", {
 description: "The sortbar has been successfully unregistered",
 duration: 3000,
 style: {
 background: 'rgb(22 163 74)',
 color: 'white',
 border: '2px solid rgb(21 128 61)',
 fontSize: '1.125rem',
 padding: '1rem 1.5rem',
 },
 });
 }
 };

 const handleItemSelect = (item: ReplenItem, fromNavigation = false) => {
 setSelectedItem(item);
 // Load previously processed quantity if exists, otherwise default to item's quantity
 setProcessedQuantity(processedItems.get(item.id) ?? item.quantity);
 setIsEditingQuantity(false);
 // Start timing for this item if not already processed
 if (!processedItems.has(item.id)) {
 setItemPickStartTime(new Date());
 }

 // Find all sortbars that need this SKU
 const sortbarsNeedingItem = sortbarRegistrations
 .filter(reg => {
 // Check if this registration has an item with the same SKU that hasn't been fully processed
 return reg.items.some(i =>
 i.sku === item.sku &&
 (!reg.processedItems.has(i.id) || reg.processedItems.get(i.id)! < i.quantity)
 );
 })
 .map(reg => reg.sortbarId);

 setCurrentItemSortbars(sortbarsNeedingItem);
 setCurrentItemSortbarIndex(0);

 // Flash the first sortbar that needs this item
 if (sortbarsNeedingItem.length > 0) {
 setFlashingSortbar(sortbarsNeedingItem[0]);
 }

 // In Pack & Hold mode, check if we need to trigger arrival for the other bin when moving to next item
 if (layoutMode === "pack-hold") {
 const currentBin = itemBinAssignments.get(item.id);

 if (currentBin) {
 const otherBin = currentBin === 1 ? 2 : 1;

 // Check if there are remaining unprocessed items assigned to the other bin
 const remainingItemsInOtherBin = items.filter(i =>
 i.id !== item.id &&
 !processedItems.has(i.id) &&
 itemBinAssignments.get(i.id) === otherBin
 );

 if (remainingItemsInOtherBin.length > 0 && !binArrivals.has(otherBin) && !binArrivalTimers.has(otherBin)) {
 // Set a 5-second timer for the other bin to arrive
 const timer = setTimeout(() => {
 setBinArrivals(prev => new Set(prev).add(otherBin));
 setBinArrivalTimers(prev => {
 const newMap = new Map(prev);
 newMap.delete(otherBin);
 return newMap;
 });
 }, 5000);

 setBinArrivalTimers(prev => new Map(prev).set(otherBin, timer));
 }
 }
 }

 // Track navigation history only if not navigating via back/forward
 if (!fromNavigation) {
 setItemNavigationHistory(prev => [...prev.slice(0, currentHistoryIndex + 1), item.id]);
 setCurrentHistoryIndex(prev => prev + 1);
 }

 // Update the sortbar registration's selectedItemId
 if (activeSortbar) {
 setSortbarRegistrations(prev => prev.map(reg => {
 if (reg.sortbarId === activeSortbar) {
 return {
 ...reg,
 selectedItemId: item.id
 };
 }
 return reg;
 }));
 }
 };

 const handleQuantityIncrease = () => {
 if (selectedItem && processedQuantity < selectedItem.quantity) {
 setProcessedQuantity(processedQuantity + 1);
 }
 };

 const handleQuantityDecrease = () => {
 if (processedQuantity > 0) {
 setProcessedQuantity(processedQuantity - 1);
 }
 };

 const handleQuantityClick = () => {
 setQuantityInput(processedQuantity.toString());
 setShowNumberPad(true);
 };

 const handleNumberPadInput = (digit: string) => {
 if (digit === 'backspace') {
 setQuantityInput(prev => prev.slice(0, -1));
 } else if (digit === 'clear') {
 setQuantityInput("");
 } else {
 const newValue = quantityInput + digit;
 const numValue = parseInt(newValue) || 0;
 if (selectedItem && numValue >= 0 && numValue <= selectedItem.quantity) {
 setQuantityInput(newValue);
 }
 }
 };

 const handleNumberPadConfirm = () => {
 const numValue = parseInt(quantityInput) || 0;
 setProcessedQuantity(numValue);
 setShowNumberPad(false);
 };

 const handleNumberPadCancel = () => {
 setShowNumberPad(false);
 };

 const handleQuantityInputChange = (value: string) => {
 const numValue = parseInt(value) || 0;
 if (selectedItem && numValue >= 0 && numValue <= selectedItem.quantity) {
 setQuantityInput(value);
 }
 };

 const handleQuantityInputBlur = () => {
 const numValue = parseInt(quantityInput) || 0;
 setProcessedQuantity(numValue);
 setIsEditingQuantity(false);
 };

 const handleNextOrConfirm = () => {
 // Show SKU verification modal instead of proceeding directly
 setShowSkuVerification(true);
 setSkuVerificationInput("");
 };

 const handleSkuVerificationSubmit = () => {
 if (!selectedItem) return;

 // Check if SKU matches (case-insensitive)
 if (skuVerificationInput.trim().toUpperCase() === selectedItem.sku.toUpperCase()) {
 // SKU matches - proceed
 setShowSkuVerification(false);
 setSkuVerificationInput("");

 // Check if compartment is now empty
 const compartmentQty = compartmentInventory.get(selectedItem.compartmentLpn) || 0;
 if (processedQuantity === compartmentQty && compartmentQty > 0) {
 // Compartment is now empty - ask for confirmation
 setPendingCompartmentEmpty({
 item: selectedItem,
 compartmentId: selectedItem.compartmentLpn.split('-').pop() || ''
 });
 setShowCompartmentEmptyConfirm(true);
 return; // Wait for user confirmation before proceeding
 }

 // Check if item is being shorted
 if (processedQuantity < selectedItem.quantity) {
 // Item is shorted - show reason code modal
 setPendingShortItem(selectedItem);
 setShowReasonCodeModal(true);
 setReasonCodeInput("");
 } else if (containerAction === "swap") {
 // Check if we're in swap mode
 setShowSwapPrompt(true);
 } else {
 // Proceed normally (includes split and change modes)
 proceedToNextItem();
 }
 } else {
 // SKU does not match - show error and return to pick screen
 toast.error("SKU Mismatch", {
 description: `Expected ${selectedItem.sku}, but received ${skuVerificationInput.trim() || '(empty)'}. Please pick the correct item.`,
 duration: 5000,
 style: {
 background: 'rgb(220 38 38)',
 color: 'white',
 border: '2px solid rgb(185 28 28)',
 fontSize: '1.125rem',
 padding: '1rem 1.5rem',
 },
 });
 setShowSkuVerification(false);
 setSkuVerificationInput("");
 }
 };

 const handleSkuVerificationCancel = () => {
 setShowSkuVerification(false);
 setSkuVerificationInput("");
 };

 const handleCompleteConfirmation = () => {
 // Calculate pick list duration if we have a start time
 if (pickListStartTime) {
 const duration = Math.round((new Date().getTime() - pickListStartTime.getTime()) / 1000);
 const itemCount = items.length;
 setCompletedPickLists(prev => [...prev, { completedAt: new Date(), duration, itemCount }]);
 setPickListStartTime(null);
 }

 setShowCompletionConfirmation(false);

 // Remove current sortbar from registrations
 const remainingRegistrations = activeSortbar
 ? sortbarRegistrations.filter(reg => reg.sortbarId !== activeSortbar)
 : sortbarRegistrations;

 setSortbarRegistrations(remainingRegistrations);

 // Check if there are other registered sortbars
 if (remainingRegistrations.length > 0) {
 // Transition to the next registered sortbar
 const nextRegistration = remainingRegistrations[0];

 // Set up the next pick list
 setActiveSortbar(nextRegistration.sortbarId);
 setSelectedSortbar(nextRegistration.sortbarId);
 setSelectedList(nextRegistration.workListId);
 setItems(nextRegistration.items);
 setProcessedItems(nextRegistration.processedItems);

 // Initialize compartment inventory for next list
 const inventoryMap = new Map<string, number>();
 nextRegistration.items.forEach(item => {
 // Randomly set compartment inventory to either match pick quantity or have extra
 // 50% chance it matches exactly, 50% chance it has 1-10 extra units
 const extraUnits = Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 10) + 1;
 inventoryMap.set(item.compartmentLpn, item.quantity + extraUnits);
 });
 setCompartmentInventory(inventoryMap);

 // Set container LPNs
 if (nextRegistration.lpn) {
 setCurrentContainerLpn(nextRegistration.lpn);
 setOriginalContainerLpn(nextRegistration.lpn);
 }
 setContainerAction(null);

 // Select first item or previously selected item
 const itemToSelect = nextRegistration.selectedItemId
 ? nextRegistration.items.find(i => i.id === nextRegistration.selectedItemId)
 : nextRegistration.items[0];

 if (itemToSelect) {
 // Reset navigation history for new pick list
 setItemNavigationHistory([]);
 setCurrentHistoryIndex(-1);
 handleItemSelect(itemToSelect);
 }

 // Start timing for next pick list
 setPickListStartTime(new Date());

 // Flash the next sortbar
 setFlashingSortbar(nextRegistration.sortbarId);

 toast.success("Transitioning to Next Pick List", {
 description: `Now picking: ${nextRegistration.workListId}`,
 duration: 3000,
 });
 } else {
 // No more registered sortbars - reset everything
 setProcessedItems(new Map());
 setItems([]);
 setSelectedItem(null);
 setProcessedQuantity(0);
 setSelectedSortbar(null);
 setSelectedList(null);
 setActiveSortbar(null);
 setCurrentContainerLpn("");
 setOriginalContainerLpn("");
 setContainerAction(null);
 setFlashingSortbar(null); // Clear flashing when all complete

 toast.success("All Pick Lists Completed", {
 description: "No more registered pick lists",
 duration: 3000,
 });
 }
 };

 const handleAdjustInventoryClick = () => {
 setAdjustInventoryStep("select-item");
 setSelectedAdjustItem(null);
 setAdjustInventoryDelta(0);
 setAdjustInventoryReasonCode("");
 setShowAdjustInventory(true);
 };

 const handleAdjustItemSelect = (item: ReplenItem) => {
 setSelectedAdjustItem(item);
 setAdjustInventoryDelta(0);
 setAdjustInventoryStep("adjust-quantity");
 };

 const handleAdjustQuantityConfirm = () => {
 if (selectedAdjustItem && adjustInventoryDelta !== 0) {
 setAdjustInventoryStep("reason-code");
 setAdjustInventoryReasonCode("");
 }
 };

 const handleAdjustInventoryFinalConfirm = () => {
 if (selectedAdjustItem && adjustInventoryReasonCode.trim()) {
 const currentQty = compartmentInventory.get(selectedAdjustItem.compartmentLpn) || 0;
 const newQty = currentQty + adjustInventoryDelta;
 const updatedInventory = new Map(compartmentInventory);
 updatedInventory.set(selectedAdjustItem.compartmentLpn, newQty);
 setCompartmentInventory(updatedInventory);

 toast.success("Inventory Adjusted", {
 description: `${selectedAdjustItem.compartmentLpn.split('-').pop()}: ${currentQty} ${adjustInventoryDelta > 0 ? '+' : ''}${adjustInventoryDelta} = ${newQty} units`,
 });

 setShowAdjustInventory(false);
 setSelectedAdjustItem(null);
 setAdjustInventoryDelta(0);
 setAdjustInventoryReasonCode("");
 setAdjustInventoryStep("select-item");
 }
 };

 const handleAdjustInventoryCancel = () => {
 setShowAdjustInventory(false);
 setSelectedAdjustItem(null);
 setAdjustInventoryDelta(0);
 setAdjustInventoryReasonCode("");
 setAdjustInventoryStep("select-item");
 };

 const handleAdjustInventoryBack = () => {
 if (adjustInventoryStep === "reason-code") {
 setAdjustInventoryStep("adjust-quantity");
 setAdjustInventoryReasonCode("");
 } else if (adjustInventoryStep === "adjust-quantity") {
 setAdjustInventoryStep("select-item");
 setSelectedAdjustItem(null);
 setAdjustInventoryDelta(0);
 }
 };

 const handleChangeContainerClick = () => {
 setNewContainerLpn("");
 setShowChangeContainer(true);
 };

 const handleChangeContainerSubmit = (action: "swap" | "split" | "change") => {
 if (newContainerLpn.trim()) {
 setContainerAction(action === "split" ? null : action);
 setCurrentContainerLpn(newContainerLpn);
 setShowChangeContainer(false);

 // Persist the new LPN onto the sortbar registration so the tile reflects it
 const targetSortbarId = selectedSortbar ?? activeSortbar;
 if (targetSortbarId) {
 setSortbarRegistrations(prev => prev.map(reg =>
 reg.sortbarId === targetSortbarId ? { ...reg, lpn: newContainerLpn.trim() } : reg
 ));
 }

 toast.success(`Container ${action === "swap" ? "Swapped" : action === "split" ? "Split" : "Changed"}`, {
 description: `New container: ${newContainerLpn}`,
 });

 setNewContainerLpn("");
 }
 };

 const handleChangeContainerCancel = () => {
 setShowChangeContainer(false);
 setNewContainerLpn("");
 };

 const handleSwapContinue = (useNewContainer: boolean) => {
 setShowSwapPrompt(false);

 if (useNewContainer) {
 // Keep the current (new) container and stay in swap mode
 // containerAction remains "swap"
 proceedToNextItem();
 } else {
 // Return to original container and exit swap mode
 setCurrentContainerLpn(originalContainerLpn);
 setContainerAction(null);
 toast.success("Container Restored", {
 description: `Returning to original container: ${originalContainerLpn}`,
 });
 proceedToNextItem();
 }
 };

 const handleReasonCodeSubmit = () => {
 if (reasonCodeInput.trim()) {
 setShowReasonCodeModal(false);
 toast.warning("Item Shorted", {
 description: `Reason: ${reasonCodeInput}`,
 });
 setReasonCodeInput("");
 setPendingShortItem(null);

 // Now proceed with the normal flow
 if (containerAction === "swap") {
 setShowSwapPrompt(true);
 } else {
 proceedToNextItem();
 }
 }
 };

 const handleReasonCodeCancel = () => {
 setShowReasonCodeModal(false);
 setReasonCodeInput("");
 setPendingShortItem(null);
 };

 const handleCompartmentEmptyConfirm = (isEmpty: boolean) => {
 setShowCompartmentEmptyConfirm(false);

 if (isEmpty) {
 toast.success("Compartment Confirmed Empty", {
 description: `${pendingCompartmentEmpty?.compartmentId} confirmed empty`,
 duration: 2000,
 });
 } else {
 toast.info("Compartment Not Empty", {
 description: `${pendingCompartmentEmpty?.compartmentId} marked as not empty`,
 duration: 2000,
 });
 }

 setPendingCompartmentEmpty(null);

 // Continue with the normal flow
 if (selectedItem) {
 // Check if item is being shorted
 if (processedQuantity < selectedItem.quantity) {
 // Item is shorted - show reason code modal
 setPendingShortItem(selectedItem);
 setShowReasonCodeModal(true);
 setReasonCodeInput("");
 } else if (containerAction === "swap") {
 // Check if we're in swap mode
 setShowSwapPrompt(true);
 } else {
 // Proceed normally (includes split and change modes)
 proceedToNextItem();
 }
 }
 };

 const handleNavigateBack = () => {
 if (currentHistoryIndex > 0) {
 const newIndex = currentHistoryIndex - 1;
 const itemId = itemNavigationHistory[newIndex];
 const item = items.find(i => i.id === itemId);
 if (item) {
 setCurrentHistoryIndex(newIndex);
 handleItemSelect(item, true);
 }
 }
 };

 const handleNavigateForward = () => {
 if (currentHistoryIndex < itemNavigationHistory.length - 1) {
 const newIndex = currentHistoryIndex + 1;
 const itemId = itemNavigationHistory[newIndex];
 const item = items.find(i => i.id === itemId);
 if (item) {
 setCurrentHistoryIndex(newIndex);
 handleItemSelect(item, true);
 }
 }
 };

 const proceedToNextItem = () => {
 if (!selectedItem) return;

 // Calculate pick duration if we have a start time
 if (itemPickStartTime) {
 const duration = Math.round((new Date().getTime() - itemPickStartTime.getTime()) / 1000);
 setCompletedPicks(prev => [...prev, { completedAt: new Date(), duration }]);
 setItemPickStartTime(null);
 }

 // Save the processed quantity for this item in the CURRENT sortbar
 const newProcessedItems = new Map(processedItems);
 newProcessedItems.set(selectedItem.id, processedQuantity);
 setProcessedItems(newProcessedItems);

 // Update the current sortbar registration's processedItems
 if (activeSortbar) {
 setSortbarRegistrations(prev => prev.map(reg => {
 if (reg.sortbarId === activeSortbar) {
 return {
 ...reg,
 processedItems: newProcessedItems,
 selectedItemId: selectedItem.id
 };
 }
 return reg;
 }));
 }

 // Check if there are more sortbars that need this same item (SKU)
 if (currentItemSortbars.length > 1 && currentItemSortbarIndex < currentItemSortbars.length - 1) {
 // Move to the next sortbar that needs this item
 const nextSortbarIndex = currentItemSortbarIndex + 1;
 const nextSortbarId = currentItemSortbars[nextSortbarIndex];
 const nextRegistration = sortbarRegistrations.find(reg => reg.sortbarId === nextSortbarId);

 if (nextRegistration) {
 // Find the item with matching SKU in the next sortbar
 const matchingItem = nextRegistration.items.find(i => i.sku === selectedItem.sku);

 if (matchingItem) {
 // Switch to the next sortbar
 setActiveSortbar(nextSortbarId);
 setSelectedSortbar(nextSortbarId);
 setSelectedList(nextRegistration.workListId);
 setItems(nextRegistration.items);
 setProcessedItems(new Map(nextRegistration.processedItems));
 setCurrentContainerLpn(nextRegistration.lpn || "");
 setOriginalContainerLpn(nextRegistration.lpn || "");

 // Initialize compartment inventory for this sortbar
 const inventoryMap = new Map<string, number>();
 nextRegistration.items.forEach(item => {
 if (item.compartmentLpn) {
 const extraUnits = Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 10) + 1;
 inventoryMap.set(item.compartmentLpn, item.quantity + extraUnits);
 }
 });
 setCompartmentInventory(inventoryMap);

 // Select the matching item
 setSelectedItem(matchingItem);
 setProcessedQuantity(nextRegistration.processedItems.get(matchingItem.id) ?? matchingItem.quantity);
 setItemPickStartTime(new Date());

 // Update the index
 setCurrentItemSortbarIndex(nextSortbarIndex);

 // Flash the new sortbar
 setFlashingSortbar(nextSortbarId);

 toast.info("Switching Sortbar", {
 description: `Same item needed in ${initialSortbars.find(s => s.id === nextSortbarId)?.name}`,
 duration: 2000,
 });

 return; // Don't move to next item yet
 }
 }
 }

 // All sortbars that need this item are done - move to next item
 // Find current index
 const currentIndex = items.findIndex(i => i.id === selectedItem.id);
 const isLastItem = currentIndex === items.length - 1;

 if (!isLastItem) {
 // Move to next item
 const nextItem = items[currentIndex + 1];
 handleItemSelect(nextItem);
 } else {
 // This is the last item - check if all items in current sortbar processed
 const allItemsProcessed = items.every(item =>
 newProcessedItems.has(item.id) && (newProcessedItems.get(item.id) || 0) > 0
 );

 if (!allItemsProcessed) {
 // Some items not processed - show warning
 const unprocessedItems = items.filter(item =>
 !newProcessedItems.has(item.id) || (newProcessedItems.get(item.id) || 0) === 0
 );
 toast.warning("Incomplete Pick", {
 description: `${unprocessedItems.length} item(s) have not been processed.`,
 });
 }

 // Show completion confirmation regardless
 setShowCompletionConfirmation(true);
 }
 };

 const selectedSortbarData = initialSortbars.find(sb => sb.id === selectedSortbar);
 const selectedListData = mockPickLists.find(list => list.id === selectedList);
 const currentRegistration = selectedSortbar ? getRegistration(selectedSortbar) : null;
 const workListDetail = selectedList ? generateWorkListDetail(selectedList) : null;
 const workLines = selectedList ? generateWorkLines(selectedList) : [];
 const workOperations = selectedList ? generateWorkOperations(workLines) : [];

 // Move section handler
 const moveSection = (dragIndex: number, hoverIndex: number) => {
 const newOrder = [...sectionOrder];
 const [removed] = newOrder.splice(dragIndex, 1);
 newOrder.splice(hoverIndex, 0, removed);
 setSectionOrder(newOrder);
 };

 // Draggable Section Component
 const DraggableSection = ({ id, index, children, className }: { id: string; index: number; children: React.ReactNode; className?: string }) => {
 const ref = useRef<HTMLDivElement>(null);

 const [{ isDragging }, drag] = useDrag({
 type: 'section',
 item: { id, index },
 collect: (monitor) => ({
 isDragging: monitor.isDragging(),
 }),
 });

 const [, drop] = useDrop({
 accept: 'section',
 hover: (item: { id: string; index: number }) => {
 if (!ref.current) return;
 const dragIndex = item.index;
 const hoverIndex = index;
 if (dragIndex === hoverIndex) return;
 moveSection(dragIndex, hoverIndex);
 item.index = hoverIndex;
 },
 });

 drag(drop(ref));

 return (
 <div
 ref={ref}
 className={`${className} ${isDragging ? 'opacity-50' : 'opacity-100'} transition-opacity`}
 style={{ cursor: 'move' }}
 >
 <div className="absolute top-2 right-2 z-10 bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)] rounded p-1 hover:bg-[var(--surface-container-high)] transition-colors">
 <GripVertical size={16} className="text-[var(--muted-foreground)]" />
 </div>
 {children}
 </div>
 );
 };

 return (
 <div className="p-5 min-h-screen">
 {/* Breadcrumb and Header Combined */}
 <div className="mb-2 flex items-center justify-between gap-3">
 {/* Breadcrumb with Pick Icon */}
 <nav className="flex items-center gap-2 text-sm">
 <Link
 to="/app/home"
 className="text-[var(--muted-foreground)] hover:text-[var(--primary)] dark:hover:text-[var(--primary)] transition-colors flex items-center gap-1"
 >
 <Home size={14} />
 Home
 </Link>
 <ChevronRight size={16} className="text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]" />
 <Link
 to="/app/navigation"
 className="text-[var(--muted-foreground)] hover:text-[var(--primary)] dark:hover:text-[var(--primary)] transition-colors"
 >
 Navigation
 </Link>
 <ChevronRight size={16} className="text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]" />
 <Link
 to="/app/navigation?section=workstation"
 className="text-[var(--muted-foreground)] hover:text-[var(--primary)] dark:hover:text-[var(--primary)] transition-colors"
 >
 Workstation Operations
 </Link>
 <ChevronRight size={16} className="text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]" />
 <span className="text-[var(--foreground)]  font-semibold text-lg flex items-center gap-2">
 <RefreshCw size={20} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 Pick
 </span>
 </nav>

 {/* Layout Mode Toggle */}
 <div className="bg-[var(--surface-container-low)] dark:bg-[var(--card)] rounded-lg p-0.5 flex gap-0.5">
 <button
 onClick={() => setLayoutMode("pick-port")}
 className={`p-1.5 rounded-md transition-all ${
 layoutMode === "pick-port"
 ? "bg-[var(--primary)] text-[var(--primary-foreground)] "
 : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] dark:hover:text-[var(--foreground)]"
 }`}
 title="Pick Port"
 >
 <Grid3x3 size={16} />
 </button>
 <button
 onClick={() => setLayoutMode("pack-hold")}
 className={`p-1.5 rounded-md transition-all ${
 layoutMode === "pack-hold"
 ? "bg-[var(--primary)] text-[var(--primary-foreground)] "
 : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] dark:hover:text-[var(--foreground)]"
 }`}
 title="Pack & Hold"
 >
 <Columns size={16} />
 </button>
 <button
 onClick={() => setLayoutMode("pack-hold-horizontal")}
 className={`p-1.5 rounded-md transition-all ${
 layoutMode === "pack-hold-horizontal"
 ? "bg-[var(--primary)] text-[var(--primary-foreground)] "
 : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] dark:hover:text-[var(--foreground)]"
 }`}
 title="Pack & Hold Horizontal"
 >
 <Columns size={16} className="rotate-90" />
 </button>
 </div>

 {/* Auto Register Toggle */}
 <button
 onClick={() => setAutoRegisterEnabled(v => !v)}
 className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 transition-all ${
 autoRegisterEnabled
 ? "border-[var(--primary)] dark:border-[var(--primary)] bg-[var(--primary)]/10 /10"
 : "border-[var(--border)]  bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] hover:border-[var(--border)] dark:hover:border-[var(--border)]"
 }`}
 title="When enabled, clicking an unregistered sortbar automatically selects a work list and prompts for LPN"
 >
 {/* Track */}
 <div className={`relative w-9 h-5 rounded-full transition-colors ${
 autoRegisterEnabled ? "bg-[var(--primary)] " : "bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)]"
 }`}>
 {/* Thumb */}
 <div className={`absolute top-0.5 w-4 h-4 bg-[var(--surface-container-lowest)] rounded-full transition-all ${
 autoRegisterEnabled ? "left-4" : "left-0.5"
 }`} />
 </div>
 <span className={`text-xs font-medium whitespace-nowrap ${
 autoRegisterEnabled
 ? "text-[var(--primary)] dark:text-[var(--primary)]"
 : "text-[var(--muted-foreground)]"
 }`}>
 Auto Register
 </span>
 </button>

 {/* Information Section */}
 <div className="flex-1 flex justify-center">
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg px-3 py-1.5 flex items-center gap-4">
 {/* Pick Rate */}
 <div className="flex flex-col items-center">
 <div className="text-[10px] text-[var(--muted-foreground)] mb-0.5 uppercase tracking-wide">
 Pick Rate
 </div>
 {completedPicks.length < 5 && completedPickLists.length === 0 ? (
 <div className="text-[10px] text-[var(--muted-foreground)] italic">
 Perform {5 - completedPicks.length} more pick{5 - completedPicks.length !== 1 ? 's' : ''}
 </div>
 ) : (
 <div className="flex flex-col items-center gap-0.5">
 {completedPicks.length >= 5 && (
 <div className="flex items-baseline gap-1">
 <span className="text-lg font-bold text-[var(--primary)] dark:text-[var(--primary)]">
 {Math.round(completedPicks.reduce((sum, pick) => sum + pick.duration, 0) / completedPicks.length)}
 </span>
 <span className="text-[10px] text-[var(--muted-foreground)]">sec/item</span>
 </div>
 )}
 {completedPickLists.length > 0 && (
 <div className="flex items-baseline gap-1">
 <span className="text-sm font-bold text-[var(--state-info)] dark:text-[var(--state-info)]">
 {Math.round(completedPickLists.reduce((sum, list) => sum + list.duration, 0) / completedPickLists.length)}
 </span>
 <span className="text-[10px] text-[var(--muted-foreground)]">sec/list</span>
 </div>
 )}
 {itemPickStartTime && (
 <div className="text-[10px] text-[var(--muted-foreground)]">
 Current: {Math.round((new Date().getTime() - itemPickStartTime.getTime()) / 1000)}s
 </div>
 )}
 </div>
 )}
 </div>

 {/* Divider */}
 <div className="w-px h-6 bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)]"></div>

 {/* Registered Pick Lists */}
 <div className="flex flex-col items-center">
 <div className="text-[10px] text-[var(--muted-foreground)] mb-0.5 uppercase tracking-wide">
 Registered Lists
 </div>
 <div className="flex items-baseline gap-1">
 <span className="text-lg font-bold text-[var(--foreground)] ">
 {sortbarRegistrations.length}
 </span>
 <span className="text-[10px] text-[var(--muted-foreground)]">list{sortbarRegistrations.length !== 1 ? 's' : ''}</span>
 </div>
 </div>

 {/* Divider */}
 <div className="w-px h-6 bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)]"></div>

 {/* Pick Tasks */}
 <div className="flex flex-col items-center">
 <div className="text-[10px] text-[var(--muted-foreground)] mb-0.5 uppercase tracking-wide">
 Pick Tasks
 </div>
 {(() => {
 const totalItems = sortbarRegistrations.reduce((sum, reg) => sum + reg.items.length, 0);
 const completedItems = sortbarRegistrations.reduce((sum, reg) => {
 return sum + reg.items.filter(item => {
 const processed = reg.processedItems.get(item.id) || 0;
 return processed > 0;
 }).length;
 }, 0);
 const progressPercent = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

 return (
 <>
 <div className="flex items-baseline gap-1">
 <span className="text-lg font-bold text-[var(--foreground)] ">
 {completedItems}
 </span>
 <span className="text-[10px] text-[var(--muted-foreground)]">/ {totalItems}</span>
 </div>
 {totalItems > 0 && (
 <div className="w-16 h-1 bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)] rounded-full overflow-hidden mt-0.5">
 <div
 className="h-full bg-[var(--primary)]  transition-all duration-300"
 style={{ width: `${progressPercent}%` }}
 />
 </div>
 )}
 </>
 );
 })()}
 </div>

 {/* Divider */}
 <div className="w-px h-6 bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)]"></div>

 {/* Total QTY to Pick */}
 <div className="flex flex-col items-center">
 <div className="text-[10px] text-[var(--muted-foreground)] mb-0.5 uppercase tracking-wide">
 QTY to Pick
 </div>
 {(() => {
 const totalQty = sortbarRegistrations.reduce((sum, reg) =>
 sum + reg.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
 );
 const pickedQty = sortbarRegistrations.reduce((sum, reg) => {
 return sum + reg.items.reduce((itemSum, item) => {
 const processed = reg.processedItems.get(item.id) || 0;
 return itemSum + processed;
 }, 0);
 }, 0);
 const progressPercent = totalQty > 0 ? (pickedQty / totalQty) * 100 : 0;

 return (
 <>
 <div className="flex items-baseline gap-1">
 <span className="text-lg font-bold text-[var(--foreground)] ">
 {pickedQty}
 </span>
 <span className="text-[10px] text-[var(--muted-foreground)]">/ {totalQty}</span>
 </div>
 {totalQty > 0 && (
 <div className="w-16 h-1 bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)] rounded-full overflow-hidden mt-0.5">
 <div
 className="h-full bg-[var(--primary)]  transition-all duration-300"
 style={{ width: `${progressPercent}%` }}
 />
 </div>
 )}
 </>
 );
 })()}
 </div>

 {/* Divider */}
 <div className="w-px h-8 bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)] mx-1"></div>

 {/* Daily Pick Lists */}
 <div className="flex flex-col items-center">
 <div className="text-[10px] text-[var(--muted-foreground)] mb-0.5 uppercase tracking-wide">
 Daily Lists
 </div>
 {(() => {
 const registeredIds = new Set(sortbarRegistrations.map(r => r.workListId));
 const openLists = mockPickLists.filter(l => !registeredIds.has(l.id));
 const doneLists = mockPickLists.length - openLists.length;
 const progressPercent = mockPickLists.length > 0 ? (doneLists / mockPickLists.length) * 100 : 0;
 return (
 <>
 <div className="flex items-baseline gap-1">
 <span className="text-lg font-bold text-[var(--state-info)] dark:text-[var(--state-info)]">{doneLists}</span>
 <span className="text-[10px] text-[var(--muted-foreground)]">/ {mockPickLists.length}</span>
 </div>
 <div className="w-16 h-1 bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)] rounded-full overflow-hidden mt-0.5">
 <div
 className="h-full bg-[var(--state-info)] dark:bg-[var(--state-info)] transition-all duration-300"
 style={{ width: `${progressPercent}%` }}
 />
 </div>
 </>
 );
 })()}
 </div>

 {/* Divider */}
 <div className="w-px h-6 bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)]"></div>

 {/* Daily Tasks */}
 <div className="flex flex-col items-center">
 <div className="text-[10px] text-[var(--muted-foreground)] mb-0.5 uppercase tracking-wide">
 Daily Tasks
 </div>
 {(() => {
 const registeredIds = new Set(sortbarRegistrations.map(r => r.workListId));
 const openLists = mockPickLists.filter(l => !registeredIds.has(l.id));
 const dailyTotal = mockPickLists.reduce((sum, l) => sum + l.itemCount, 0);
 const openTasks = openLists.reduce((sum, l) => sum + l.itemCount, 0);
 const registeredTasks = sortbarRegistrations.reduce((sum, reg) => sum + reg.items.length, 0);
 const completedTasks = sortbarRegistrations.reduce((sum, reg) =>
 sum + reg.items.filter(item => (reg.processedItems.get(item.id) || 0) > 0).length, 0
 );
 const doneTasks = completedTasks;
 const progressPercent = dailyTotal > 0 ? (doneTasks / dailyTotal) * 100 : 0;
 return (
 <>
 <div className="flex items-baseline gap-1">
 <span className="text-lg font-bold text-[var(--state-info)] dark:text-[var(--state-info)]">{doneTasks}</span>
 <span className="text-[10px] text-[var(--muted-foreground)]">/ {dailyTotal}</span>
 </div>
 <div className="w-16 h-1 bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)] rounded-full overflow-hidden mt-0.5">
 <div
 className="h-full bg-[var(--state-info)] dark:bg-[var(--state-info)] transition-all duration-300"
 style={{ width: `${progressPercent}%` }}
 />
 </div>
 </>
 );
 })()}
 </div>

 {/* Divider */}
 <div className="w-px h-6 bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)]"></div>

 {/* Daily QTY */}
 <div className="flex flex-col items-center">
 <div className="text-[10px] text-[var(--muted-foreground)] mb-0.5 uppercase tracking-wide">
 Daily QTY
 </div>
 {(() => {
 // Each work line has a quantity; use generateWorkLines to compute daily totals
 const dailyTotalQty = mockPickLists.reduce((sum, l) => {
 return sum + generateWorkLines(l.id).reduce((s, line) => s + line.quantity, 0);
 }, 0);
 const pickedQty = sortbarRegistrations.reduce((sum, reg) => {
 return sum + reg.items.reduce((itemSum, item) => {
 const processed = reg.processedItems.get(item.id) || 0;
 return itemSum + processed;
 }, 0);
 }, 0);
 const progressPercent = dailyTotalQty > 0 ? (pickedQty / dailyTotalQty) * 100 : 0;
 return (
 <>
 <div className="flex items-baseline gap-1">
 <span className="text-lg font-bold text-[var(--state-info)] dark:text-[var(--state-info)]">{pickedQty}</span>
 <span className="text-[10px] text-[var(--muted-foreground)]">/ {dailyTotalQty}</span>
 </div>
 <div className="w-16 h-1 bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)] rounded-full overflow-hidden mt-0.5">
 <div
 className="h-full bg-[var(--state-info)] dark:bg-[var(--state-info)] transition-all duration-300"
 style={{ width: `${progressPercent}%` }}
 />
 </div>
 </>
 );
 })()}
 </div>
 </div>
 </div>

 {/* Action Buttons */}
 <div className="flex items-center gap-2">
 <button
 onClick={() => setShowHistory(true)}
 className="p-1.5 bg-[var(--surface-container)] dark:bg-[var(--card)] hover:bg-[var(--surface-container-high)] text-[var(--foreground)]  rounded-md transition-colors"
 title="History"
 >
 <History size={16} />
 </button>
 <button
 onClick={() => setShowLegend(true)}
 className="p-1.5 bg-[var(--surface-container)] dark:bg-[var(--card)] hover:bg-[var(--surface-container-high)] text-[var(--foreground)]  rounded-md transition-colors"
 title="Legend"
 >
 <Info size={16} />
 </button>
 </div>
 </div>

 <DndProvider backend={HTML5Backend}>
 {layoutMode === "pick-port" ? (
 /* Pick Port Layout - Left sortbars, center bin, right sortbars, and current item */
 <div
 className={`flex gap-4 transition-all duration-500 ease-in-out ${
 showSortbarMenu && panelView === "menu" ? 'mr-[400px]' : showSortbarMenu && panelView !== "menu" ? 'mr-0' : 'mr-0'
 }`}
 >
 {/* Combined Sortbars and Bin Section */}
 <div className="flex-1 h-[calc(100vh-96px)] flex gap-3">
 {/* Left Sortbar Column - A1 to A6 */}
 <div className="w-[15%] min-w-[180px]">
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-xl overflow-hidden h-full flex flex-col p-3">
 <div className="flex items-center gap-2 mb-2 flex-shrink-0">
 <div className="w-8 h-8 bg-[var(--primary)]/20 /20 rounded-lg flex items-center justify-center">
 <Grid3x3 size={16} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 </div>
 <h2 className="font-semibold text-[var(--foreground)] ">Sortbar(s)</h2>
 </div>
 <button
 onClick={() => {
 setShowAutoRegister(true);
 setAutoRegisterStep('count');
 }}
 className="w-full p-2.5 rounded-lg border-[var(--border)]  hover:border-[var(--primary)] dark:hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 /5 transition-all mb-2 flex-shrink-0"
 >
 <div className="flex items-center gap-2">
 <div className="w-8 h-8 bg-[var(--primary)]/10 /10 rounded-lg flex items-center justify-center">
 <RefreshCw size={16} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 </div>
 <div className="text-left">
 <p className="font-medium text-sm text-[var(--foreground)] ">Register Multiple</p>
 </div>
 </div>
 </button>
 <div className="flex-1 overflow-y-auto">
 {/* Render sortbars A1-A6 in vertical stack */}
 <div className="space-y-3">
 {['A1', 'A2', 'A3', 'A4', 'A5', 'A6'].map(sortbarName => {
 const sortbar = initialSortbars.find(sb => sb.name === sortbarName);
 if (!sortbar) return null;
 const registration = sortbarRegistrations.find(reg => reg.sortbarId === sortbar.id);
 const isActive = activeSortbar === sortbar.id;
 const isRegistered = !!registration;
 const status = getSortbarStatus(sortbar.id);

 const isFlashing = flashingSortbar === sortbar.id;

 return (
 <button
 key={sortbar.id}
 onClick={() => handleSortbarSelect(sortbar.id)}
 className={`w-full text-left px-2.5 py-1.5 rounded-lg border-2 h-[130px] flex flex-col ${
 isFlashing
 ? "animate-pulse bg-[var(--primary)]/20 /20 border-[var(--primary)] dark:border-[var(--primary)] "
 : isActive && isRegistered
 ? "animate-pulse bg-[var(--primary)]/20 /20 border-[var(--primary)] dark:border-[var(--primary)] "
 : isRegistered
 ? "border-[var(--state-info)]/40 dark:border-[var(--state-info)]/30 bg-[var(--state-info)]/5 dark:bg-[var(--state-info)]/5 hover:border-[var(--state-info)]/40/50 dark:hover:border-[var(--state-info)]/50 transition-all"
 : "border-[var(--border)]  hover:border-[var(--primary)] dark:hover:border-[var(--primary)] hover:bg-[var(--surface-container-lowest)] hover:bg-[var(--surface-container-high)]/30 transition-all"
 }`}
 >
 <div className="flex-1 flex flex-col">
 <div className="flex items-center justify-between mb-0.5">
 <h3 className="text-lg font-bold text-[var(--foreground)] ">{sortbar.name}</h3>
 <span
 className={`text-[10px] px-1.5 py-0.5 rounded-full ${
 status === "available"
 ? "bg-[var(--primary)]/10 /10 text-[var(--primary)] dark:text-[var(--primary)]"
 : "bg-[var(--state-info)]/10 text-[var(--state-info)] dark:text-[var(--state-info)]"
 }`}
 >
 {status}
 </span>
 </div>
 {registration?.lpn && (
 <div className="text-[10px] text-[var(--muted-foreground)] mb-0.5 font-mono">
 LPN: {registration.lpn}
 </div>
 )}
 <div className="pt-0.5 border-t border-[var(--border)]  flex-1">
 {registration ? (
 <>
 <p className="text-[10px] text-[var(--state-info)] dark:text-[var(--state-info)] font-medium mb-0.5">
 {registration.workListId}
 </p>
 <div className="flex items-baseline gap-2.5 mb-0.5">
 <div className="flex items-baseline gap-0.5">
 <div className="text-xl font-bold text-[var(--state-info)] dark:text-[var(--state-info)] leading-none">
 {registration.itemCount}
 </div>
 <div className="text-[10px] text-[var(--muted-foreground)]">items</div>
 </div>
 <div className="flex items-baseline gap-0.5">
 <div className="text-xl font-bold text-[var(--state-info)] dark:text-[var(--state-info)] leading-none">
 {registration.totalQuantity}
 </div>
 <div className="text-[10px] text-[var(--muted-foreground)]">qty</div>
 </div>
 </div>
 {(() => {
 const completedItems = registration.items.filter(item => {
 const processed = registration.processedItems.get(item.id) || 0;
 return processed > 0;
 }).length;
 const itemProgress = registration.itemCount > 0 ? (completedItems / registration.itemCount) * 100 : 0;

 return (
 <div className="h-1.5 bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)] rounded-full overflow-hidden">
 <div
 className="h-full bg-[var(--state-info)] dark:bg-[var(--state-info)] transition-all duration-300"
 style={{ width: `${itemProgress}%` }}
 />
 </div>
 );
 })()}
 </>
 ) : (
 <p className="text-xs text-[var(--muted-foreground)]">Click to register</p>
 )}
 </div>
 </div>
 </button>
 );
 })}
 </div>
 </div>
 </div>
 </div>

 {/* Center - Single Bin */}
 <div className="flex-1">
 {(() => {
 // Get the active sortbar's registration
 const registration = activeSortbar ? sortbarRegistrations.find(reg => reg.sortbarId === activeSortbar) : null;
 if (!registration) {
 return (
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-xl overflow-hidden h-full flex flex-col opacity-50 p-3">
 <div className="flex items-center gap-2 mb-3 flex-shrink-0">
 <div className="w-8 h-8 bg-[var(--primary)]/20 /20 rounded-lg flex items-center justify-center">
 <Box size={16} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 </div>
 <h2 className="font-semibold text-[var(--foreground)] ">Bin</h2>
 </div>
 <div className="h-full flex items-center justify-center">
 <div className="text-center max-w-xs">
 <div className="w-16 h-16 bg-[var(--surface-container-low)] dark:bg-[var(--card)] rounded-full flex items-center justify-center mx-auto mb-3">
 <Box size={32} className="text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]" />
 </div>
 <p className="text-[var(--muted-foreground)]">
 No active sortbar
 </p>
 </div>
 </div>
 </div>
 );
 }

 return (
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-xl overflow-hidden h-full flex flex-col p-3">
 <div className="flex items-center gap-2 mb-3 flex-shrink-0">
 <div className="w-8 h-8 bg-[var(--primary)]/20 /20 rounded-lg flex items-center justify-center">
 <Box size={16} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 </div>
 <h2 className="font-semibold text-[var(--foreground)] ">
 Bin - {selectedItem?.binNumber || currentContainerLpn}
 </h2>
 </div>

 {selectedItem ? (
 <div className="flex-1 flex flex-col overflow-hidden">
 {/* Compartment Grid */}
 <div className="flex-1 flex flex-col">
 <div className="mb-2">
 <div className="flex items-center justify-between mb-2">
 <p className="text-sm text-[var(--muted-foreground)] font-medium">
 Pick from Compartment
 </p>
 <button
 onClick={handleAdjustInventoryClick}
 className="px-2.5 py-1 text-xs bg-[var(--state-info)] dark:bg-[var(--state-info-container)] hover:bg-[var(--state-info)] dark:hover:bg-[var(--state-info)] text-[var(--state-on-info-container)] rounded font-medium transition-colors"
 >
 Adjust Inventory
 </button>
 </div>
 {selectedItem.compartmentLpn && (
 <p className="text-xl font-bold text-[var(--primary)] dark:text-[var(--primary)] text-center mb-2">
 {selectedItem.compartmentLpn.split('-').pop()}
 </p>
 )}
 {(() => {
 const compartments = generateCompartments(selectedItem.containerName, selectedItem.compartmentConfig);
 const { cols, rows } = selectedItem.compartmentConfig;
 const isSingleCompartment = compartments.length === 1;

 return (
 <div className="max-w-lg mx-auto">
 {/* Bin Container - Thick outer border */}
 <div className={`border-4 border-[var(--border)] dark:border-[var(--border)] rounded-lg overflow-hidden bg-[var(--surface-container-low)] dark:bg-[var(--card)] ${
 isSingleCompartment ? 'min-h-[160px]' : ''
 }`}>
 <div
 className="w-full h-full"
 style={{
 display: 'grid',
 gridTemplateColumns: `repeat(${cols}, 1fr)`,
 gridTemplateRows: `repeat(${rows}, 1fr)`,
 minHeight: isSingleCompartment ? '160px' : `${rows * 70}px`,
 maxHeight: '240px'
 }}
 >
 {compartments.map((compartment, index) => {
 const isPickFrom = selectedItem.compartmentLpn && compartment.lpn === selectedItem.compartmentLpn;
 const qty = compartmentInventory.get(compartment.lpn) || 0;
 const row = Math.floor(index / cols);
 const col = index % cols;

 // Add borders to create compartment divisions
 const borderClasses = [];
 if (col < cols - 1) borderClasses.push('border-r'); // Right border except last column
 if (row < rows - 1) borderClasses.push('border-b'); // Bottom border except last row

 return (
 <div
 key={compartment.lpn}
 className={`flex flex-col items-center justify-center transition-all ${borderClasses.join(' ')} border-[var(--border)] dark:border-[var(--border)] ${
 isPickFrom
 ? "bg-[var(--primary)] "
 : "bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)]"
 }`}
 >
 <div className={`text-lg font-mono font-bold leading-none ${
 isPickFrom
 ? "text-white"
 : "text-[var(--muted-foreground)]"
 }`}>
 {compartment.lpn.split('-').pop()}
 </div>
 {qty > 0 && (
 <div className={`text-[10px] font-medium mt-0.5 ${
 isPickFrom
 ? "text-[var(--muted-foreground)]"
 : "text-[var(--muted-foreground)]"
 }`}>
 {qty} units
 </div>
 )}
 </div>
 );
 })}
 </div>
 </div>
 </div>
 );
 })()}
 </div>

 {/* Quantity Controls */}
 <div className="mt-3 pt-3 border-t border-[var(--border)] ">
 <p className="text-sm text-[var(--muted-foreground)] text-center mb-2 font-medium">Quantity Processed</p>

 {/* Large Quantity Display/Input */}
 <div className="mb-3 text-center">
 <button
 onClick={handleQuantityClick}
 className="text-3xl font-bold text-[var(--primary)] dark:text-[var(--primary)] hover:opacity-80 transition-opacity"
 >
 {processedQuantity}
 </button>
 <div className="text-base text-[var(--muted-foreground)] mt-0.5">/ {selectedItem.quantity}</div>
 {crossSortbarItems.length > 1 && (
 <div className="mt-2">
 <div className="text-xs text-[var(--muted-foreground)] mb-1">
 Total: <span className="font-semibold text-[var(--foreground)] ">{crossSortbarItems.reduce((s, x) => s + x.quantity, 0)}</span>
 </div>
 <div className="flex flex-wrap justify-center gap-1">
 {crossSortbarItems.map(x => (
 <span key={x.sortbarId} className={`px-1.5 py-0.5 rounded text-xs font-medium border ${x.sortbarId === activeSortbar ? "bg-[var(--primary)]/20 /20 border-[var(--primary)] dark:border-[var(--primary)] text-[var(--primary)] dark:text-[var(--primary)]" : "bg-[var(--surface-container-low)] dark:bg-[var(--card)] border-[var(--border)] dark:border-[var(--border)] text-[var(--muted-foreground)]"}`}>
 {x.sortbarName}: {x.quantity}
 </span>
 ))}
 </div>
 </div>
 )}
 </div>

 {/* +/- Buttons */}
 <div className="flex items-center justify-center gap-3">
 <button
 onClick={handleQuantityDecrease}
 disabled={processedQuantity === 0}
 className="w-10 h-10 bg-[var(--surface-container)] dark:bg-[var(--card)] hover:bg-[var(--surface-container-high)] disabled:opacity-30 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-colors"
 >
 <Minus size={18} className="text-[var(--foreground)] " />
 </button>
 <button
 onClick={handleQuantityIncrease}
 disabled={processedQuantity >= selectedItem.quantity}
 className="w-10 h-10 bg-[var(--surface-container)] dark:bg-[var(--card)] hover:bg-[var(--surface-container-high)] disabled:opacity-30 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-colors"
 >
 <Plus size={18} className="text-[var(--foreground)] " />
 </button>
 </div>
 </div>
 </div>

 {/* Next/Confirm Button - Pinned */}
 <div className="flex-shrink-0 p-3 px-4">
 {(() => {
 const currentIndex = items.findIndex(i => i.id === selectedItem.id);
 const isLastItem = currentIndex === items.length - 1;
 return (
 <button
 onClick={handleNextOrConfirm}
 className="w-full px-5 py-2.5 bg-[var(--primary)] hover:opacity-90 active:scale-[0.98] text-[var(--primary-foreground)] rounded-lg font-semibold text-base transition-colors flex items-center justify-center gap-2 "
 >
 <Check size={20} />
 {isLastItem ? "Confirm" : "Next"}
 </button>
 );
 })()}
 </div>
 </div>
 ) : (
 <div className="flex-1 flex items-center justify-center p-6">
 <div className="text-center max-w-xs">
 <div className="w-16 h-16 bg-[var(--surface-container-low)] dark:bg-[var(--card)] rounded-full flex items-center justify-center mx-auto mb-3">
 <Package size={32} className="text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]" />
 </div>
 <p className="text-[var(--muted-foreground)]">
 Select an item from the list to begin processing
 </p>
 </div>
 </div>
 )}
 </div>
 );
 })()}
 </div>

 {/* Right Sortbar Column - B1 to B6 */}
 <div className="w-[15%] min-w-[180px]">
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-xl overflow-hidden h-full flex flex-col p-3">
 <div className="flex items-center gap-2 mb-2 flex-shrink-0">
 <div className="w-8 h-8 bg-[var(--primary)]/20 /20 rounded-lg flex items-center justify-center">
 <Grid3x3 size={16} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 </div>
 <h2 className="font-semibold text-[var(--foreground)] ">Sortbar(s)</h2>
 </div>
 <button
 onClick={() => {
 setShowAutoRegister(true);
 setAutoRegisterStep('count');
 }}
 className="w-full p-2.5 rounded-lg border-[var(--border)]  hover:border-[var(--primary)] dark:hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 /5 transition-all mb-2 flex-shrink-0"
 >
 <div className="flex items-center gap-2">
 <div className="w-8 h-8 bg-[var(--primary)]/10 /10 rounded-lg flex items-center justify-center">
 <RefreshCw size={16} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 </div>
 <div className="text-left">
 <p className="font-medium text-sm text-[var(--foreground)] ">Register Multiple</p>
 </div>
 </div>
 </button>
 <div className="flex-1 overflow-y-auto">
 {/* Render sortbars B1-B6 in vertical stack */}
 <div className="space-y-3">
 {['B1', 'B2', 'B3', 'B4', 'B5', 'B6'].map(sortbarName => {
 const sortbar = initialSortbars.find(sb => sb.name === sortbarName);
 if (!sortbar) return null;
 const registration = sortbarRegistrations.find(reg => reg.sortbarId === sortbar.id);
 const isActive = activeSortbar === sortbar.id;
 const isRegistered = !!registration;
 const status = getSortbarStatus(sortbar.id);

 const isFlashing = flashingSortbar === sortbar.id;

 return (
 <button
 key={sortbar.id}
 onClick={() => handleSortbarSelect(sortbar.id)}
 className={`w-full text-left px-2.5 py-1.5 rounded-lg border-2 h-[130px] flex flex-col ${
 isFlashing
 ? "animate-pulse bg-[var(--primary)]/20 /20 border-[var(--primary)] dark:border-[var(--primary)] "
 : isActive && isRegistered
 ? "animate-pulse bg-[var(--primary)]/20 /20 border-[var(--primary)] dark:border-[var(--primary)] "
 : isRegistered
 ? "border-[var(--state-info)]/40 dark:border-[var(--state-info)]/30 bg-[var(--state-info)]/5 dark:bg-[var(--state-info)]/5 hover:border-[var(--state-info)]/40/50 dark:hover:border-[var(--state-info)]/50 transition-all"
 : "border-[var(--border)]  hover:border-[var(--primary)] dark:hover:border-[var(--primary)] hover:bg-[var(--surface-container-lowest)] hover:bg-[var(--surface-container-high)]/30 transition-all"
 }`}
 >
 <div className="flex-1 flex flex-col">
 <div className="flex items-center justify-between mb-0.5">
 <h3 className="text-lg font-bold text-[var(--foreground)] ">{sortbar.name}</h3>
 <span
 className={`text-[10px] px-1.5 py-0.5 rounded-full ${
 status === "available"
 ? "bg-[var(--primary)]/10 /10 text-[var(--primary)] dark:text-[var(--primary)]"
 : "bg-[var(--state-info)]/10 text-[var(--state-info)] dark:text-[var(--state-info)]"
 }`}
 >
 {status}
 </span>
 </div>
 {registration?.lpn && (
 <div className="text-[10px] text-[var(--muted-foreground)] mb-0.5 font-mono">
 LPN: {registration.lpn}
 </div>
 )}
 <div className="pt-0.5 border-t border-[var(--border)]  flex-1">
 {registration ? (
 <>
 <p className="text-[10px] text-[var(--state-info)] dark:text-[var(--state-info)] font-medium mb-0.5">
 {registration.workListId}
 </p>
 <div className="flex items-baseline gap-2.5 mb-0.5">
 <div className="flex items-baseline gap-0.5">
 <div className="text-xl font-bold text-[var(--state-info)] dark:text-[var(--state-info)] leading-none">
 {registration.itemCount}
 </div>
 <div className="text-[10px] text-[var(--muted-foreground)]">items</div>
 </div>
 <div className="flex items-baseline gap-0.5">
 <div className="text-xl font-bold text-[var(--state-info)] dark:text-[var(--state-info)] leading-none">
 {registration.totalQuantity}
 </div>
 <div className="text-[10px] text-[var(--muted-foreground)]">qty</div>
 </div>
 </div>
 {(() => {
 const completedItems = registration.items.filter(item => {
 const processed = registration.processedItems.get(item.id) || 0;
 return processed > 0;
 }).length;
 const itemProgress = registration.itemCount > 0 ? (completedItems / registration.itemCount) * 100 : 0;

 return (
 <div className="h-1.5 bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)] rounded-full overflow-hidden">
 <div
 className="h-full bg-[var(--state-info)] dark:bg-[var(--state-info)] transition-all duration-300"
 style={{ width: `${itemProgress}%` }}
 />
 </div>
 );
 })()}
 </>
 ) : (
 <p className="text-xs text-[var(--muted-foreground)]">Click to register</p>
 )}
 </div>
 </div>
 </button>
 );
 })}
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* Work List and Current Item Section - Separate */}
 <div className="w-[28%] min-w-[360px] h-[calc(100vh-96px)] flex flex-col gap-3">
 {/* Work List Section */}
 {selectedList && (
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-xl p-3 flex-shrink-0">
 <div className="flex items-center gap-2 mb-2">
 <div className="w-8 h-8 bg-[var(--primary)]/20 /20 rounded-lg flex items-center justify-center">
 <ClipboardList size={16} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 </div>
 <h2 className="font-semibold text-[var(--foreground)] ">Work List</h2>
 </div>
 <div className="space-y-1.5">
 <div>
 <label className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-0.5 block">Pick List ID</label>
 <p className="text-[var(--foreground)]  font-mono text-sm">{selectedList}</p>
 </div>
 </div>
 </div>
 )}

 {/* Current Item Section */}
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-xl overflow-hidden flex-1 flex flex-col p-3 min-h-0">
 <div className="flex items-center justify-between mb-3 flex-shrink-0">
 <div className="flex items-center gap-2">
 <div className="w-8 h-8 bg-[var(--primary)]/20 /20 rounded-lg flex items-center justify-center">
 <Package size={16} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 </div>
 <h2 className="font-semibold text-[var(--foreground)] ">
 Current Item {selectedItem ? `(${items.findIndex(i => i.id === selectedItem.id) + 1} of ${items.length})` : `(0 of ${items.length})`}
 </h2>
 </div>
 <div className="flex items-center gap-1">
 <button
 onClick={handleNavigateBack}
 disabled={currentHistoryIndex <= 0}
 className="p-1.5 rounded hover:bg-[var(--surface-container-high)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
 title="Previous item"
 >
 <ChevronLeft size={20} className="text-[var(--foreground)] " />
 </button>
 <button
 onClick={handleNavigateForward}
 disabled={currentHistoryIndex >= itemNavigationHistory.length - 1}
 className="p-1.5 rounded hover:bg-[var(--surface-container-high)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
 title="Next item"
 >
 <ChevronRight size={20} className="text-[var(--foreground)] " />
 </button>
 </div>
 </div>

 <div className="overflow-y-auto flex-1 min-h-0">
 {selectedItem ? (
 <motion.div
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 className="space-y-4"
 >
 {/* Item Image */}
 {selectedItem.imageUrl && (
 <div className="w-full aspect-[4/3] bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-lg overflow-hidden flex items-center justify-center p-4">
 <img
 src={selectedItem.imageUrl}
 alt={selectedItem.description}
 className="max-w-full max-h-full object-contain"
 />
 </div>
 )}

 {/* Item Details */}
 <div className="space-y-2">
 <div>
 <div className="text-xs text-[var(--muted-foreground)] mb-0.5">SKU</div>
 <div className="font-mono text-2xl font-bold text-[var(--foreground)] ">
 {selectedItem.sku}
 </div>
 </div>

 <div>
 <div className="text-xs text-[var(--muted-foreground)] mb-0.5">Description</div>
 <div className="text-base text-[var(--foreground)]  leading-relaxed">
 {selectedItem.description}
 </div>
 </div>

 <div>
 <div className="text-xs text-[var(--muted-foreground)] mb-0.5">Quantity to Pick</div>
 <div className="text-3xl font-bold text-[var(--primary)] dark:text-[var(--primary)]">
 {selectedItem.quantity}
 </div>
 </div>

 {selectedItem.itemComment && (
 <div>
 <div className="text-xs text-[var(--muted-foreground)] mb-0.5 flex items-center gap-1.5">
 <Info size={14} />
 Item Comment
 </div>
 <div className="bg-[var(--state-info-container)] dark:bg-[var(--state-info-container)]/20 border border-[var(--secondary)]/30 dark:border-[var(--secondary-container)]/30 rounded-lg p-2 text-xs text-[var(--state-on-info-container)] dark:text-[var(--state-info)]">
 {selectedItem.itemComment}
 </div>
 </div>
 )}
 </div>
 </motion.div>
 ) : (
 <div className="h-full flex items-center justify-center">
 <div className="text-center max-w-xs">
 <div className="w-16 h-16 bg-[var(--surface-container-low)] dark:bg-[var(--card)] rounded-full flex items-center justify-center mx-auto mb-3">
 <Package size={32} className="text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]" />
 </div>
 <p className="text-[var(--muted-foreground)]">
 No item selected. Select an item to begin picking.
 </p>
 </div>
 </div>
 )}
 </div>
 </div>
 </div>
 </div>
 ) : layoutMode === "pack-hold" ? (
 /* Pack & Hold Layout - Combined sortbars and bins with Current Item separate */
 <div
 className={`flex gap-4 transition-all duration-500 ease-in-out ${
 showSortbarMenu && panelView === "menu" ? 'mr-[400px]' : showSortbarMenu && panelView !== "menu" ? 'mr-0' : 'mr-0'
 }`}
 >
 {/* Combined Sortbars and Bins Section */}
 <div className="flex-1 h-[calc(100vh-96px)] flex gap-3">
 {/* Left Sortbar */}
 <div className="w-[15%] min-w-[180px]">
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-xl overflow-hidden h-full flex flex-col p-3">
 <div className="flex items-center gap-2 mb-3 flex-shrink-0">
 <div className="w-8 h-8 bg-[var(--primary)]/20 /20 rounded-lg flex items-center justify-center">
 <Grid3x3 size={16} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 </div>
 <h2 className="font-semibold text-[var(--foreground)] ">Sortbar 1</h2>
 </div>
 <div className="flex-1 overflow-y-auto">
 {/* Single sortbar display - will show A1 sortbar */}
 {(() => {
 const sortbar = initialSortbars.find(sb => sb.id === "SB-A1");
 if (!sortbar) return null;
 const registration = sortbarRegistrations.find(reg => reg.sortbarId === "SB-A1");
 const isActive = activeSortbar === sortbar.id;
 const isRegistered = !!registration;
 const status = getSortbarStatus(sortbar.id);

 return (
 <button
 onClick={() => handleSortbarSelect(sortbar.id)}
 className={`w-full text-left px-2.5 py-1.5 rounded-lg border-2 h-[130px] flex flex-col ${
 isActive && isRegistered
 ? "animate-pulse bg-[var(--primary)]/20 /20 border-[var(--primary)] dark:border-[var(--primary)] "
 : isRegistered
 ? "border-[var(--state-info)]/40 dark:border-[var(--state-info)]/30 bg-[var(--state-info)]/5 dark:bg-[var(--state-info)]/5 hover:border-[var(--state-info)]/40/50 dark:hover:border-[var(--state-info)]/50 transition-all"
 : "border-[var(--border)]  hover:border-[var(--primary)] dark:hover:border-[var(--primary)] hover:bg-[var(--surface-container-lowest)] hover:bg-[var(--surface-container-high)]/30 transition-all"
 }`}
 >
 <div className="flex-1 flex flex-col">
 <div className="flex items-center justify-between mb-0.5">
 <h3 className="text-lg font-bold text-[var(--foreground)] ">{sortbar.name}</h3>
 <span
 className={`text-[10px] px-1.5 py-0.5 rounded-full ${
 status === "available"
 ? "bg-[var(--primary)]/10 /10 text-[var(--primary)] dark:text-[var(--primary)]"
 : "bg-[var(--state-info)]/10 text-[var(--state-info)] dark:text-[var(--state-info)]"
 }`}
 >
 {status}
 </span>
 </div>
 {registration?.lpn && (
 <div className="text-[10px] text-[var(--muted-foreground)] mb-0.5 font-mono">
 LPN: {registration.lpn}
 </div>
 )}
 <div className="pt-0.5 border-t border-[var(--border)]  flex-1">
 {registration ? (
 <>
 <p className="text-[10px] text-[var(--state-info)] dark:text-[var(--state-info)] font-medium mb-0.5">
 {registration.workListId}
 </p>
 <div className="flex items-baseline gap-2.5 mb-0.5">
 <div className="flex items-baseline gap-0.5">
 <div className="text-xl font-bold text-[var(--state-info)] dark:text-[var(--state-info)] leading-none">
 {registration.itemCount}
 </div>
 <div className="text-[10px] text-[var(--muted-foreground)]">items</div>
 </div>
 <div className="flex items-baseline gap-0.5">
 <div className="text-xl font-bold text-[var(--state-info)] dark:text-[var(--state-info)] leading-none">
 {registration.totalQuantity}
 </div>
 <div className="text-[10px] text-[var(--muted-foreground)]">qty</div>
 </div>
 </div>
 {(() => {
 const completedItems = registration.items.filter(item => {
 const processed = registration.processedItems.get(item.id) || 0;
 return processed > 0;
 }).length;
 const itemProgress = registration.itemCount > 0 ? (completedItems / registration.itemCount) * 100 : 0;

 return (
 <div className="h-1.5 bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)] rounded-full overflow-hidden">
 <div
 className="h-full bg-[var(--state-info)] dark:bg-[var(--state-info)] transition-all duration-300"
 style={{ width: `${itemProgress}%` }}
 />
 </div>
 );
 })()}
 </>
 ) : (
 <p className="text-xs text-[var(--muted-foreground)]">Click to register</p>
 )}
 </div>
 </div>
 </button>
 );
 })()}
 </div>
 </div>
 </div>

 {/* Center - Two Bins Side by Side */}
 <div className="flex-1 flex gap-3">
 {/* Bin 1 */}
 <div className="flex-1">
 {(() => {
 // Get the active sortbar's registration
 const registration = activeSortbar ? sortbarRegistrations.find(reg => reg.sortbarId === activeSortbar) : null;
 if (!registration) {
 return (
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-xl overflow-hidden h-full flex flex-col opacity-50 p-3">
 <div className="flex items-center gap-2 mb-3 flex-shrink-0">
 <div className="w-8 h-8 bg-[var(--primary)]/20 /20 rounded-lg flex items-center justify-center">
 <Box size={16} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 </div>
 <h2 className="font-semibold text-[var(--foreground)] ">Bin 1</h2>
 </div>
 <div className="h-full flex items-center justify-center">
 <div className="text-center max-w-xs">
 <div className="w-16 h-16 bg-[var(--surface-container-low)] dark:bg-[var(--card)] rounded-full flex items-center justify-center mx-auto mb-3">
 <Box size={32} className="text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]" />
 </div>
 <p className="text-[var(--muted-foreground)]">
 No active sortbar
 </p>
 </div>
 </div>
 </div>
 );
 }

 // Check if this bin has any items assigned to it that haven't been picked yet
 const bin1Items = registration.items.filter(item => {
 const assignedToBin1 = itemBinAssignments.get(item.id) === 1;
 const notCurrentItem = !selectedItem || item.id !== selectedItem.id;
 return assignedToBin1 && notCurrentItem;
 });
 const hasBin1Items = bin1Items.length > 0;
 const currentItemInBin1 = selectedItem && itemBinAssignments.get(selectedItem.id) === 1;
 const isActive = currentItemInBin1;
 const isReady = hasBin1Items && !currentItemInBin1 && binArrivals.has(1);

 return (
 <div className={`bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-xl overflow-hidden h-full flex flex-col p-3 ${
 isActive ? ' ' : isReady ? ' ' : 'opacity-50'
 }`}>
 <div className="flex items-center justify-between mb-3 flex-shrink-0">
 <div className="flex items-center gap-2">
 <div className="w-8 h-8 bg-[var(--primary)]/20 /20 rounded-lg flex items-center justify-center">
 <Box size={16} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 </div>
 <h2 className="font-semibold text-[var(--foreground)] ">
 Bin 1 {isActive && selectedItem?.binNumber ? `- ${selectedItem.binNumber}` : ''}
 </h2>
 </div>
 {isReady && (
 <span className="text-xs px-2 py-0.5 bg-[var(--state-warning)]/10 text-[var(--state-on-warning-container)] dark:text-[var(--state-warning)] rounded-full font-medium">
 Ready
 </span>
 )}
 </div>

 {isActive && selectedItem ? (
 <div className="flex-1 flex flex-col overflow-hidden">
 {/* Compartment Grid */}
 <div className="flex-1 p-3 flex flex-col overflow-y-auto">
 <div className="flex-shrink-0 mb-2">
 <div className="flex items-center justify-between mb-2">
 <p className="text-xs text-[var(--muted-foreground)]">
 Pick from Compartment
 </p>
 <button
 onClick={handleAdjustInventoryClick}
 className="px-2 py-1 text-xs bg-[var(--state-info)] dark:bg-[var(--state-info-container)] hover:bg-[var(--state-info)] dark:hover:bg-[var(--state-info)] text-[var(--state-on-info-container)] rounded font-medium transition-colors"
 >
 Adjust Inventory
 </button>
 </div>
 {selectedItem.compartmentLpn && (
 <p className="text-base font-bold text-[var(--primary)] dark:text-[var(--primary)] text-center mb-2">
 {selectedItem.compartmentLpn.split('-').pop()}
 </p>
 )}
 {(() => {
 const compartments = generateCompartments(selectedItem.containerName, selectedItem.compartmentConfig);
 const { cols, rows } = selectedItem.compartmentConfig;
 const isSingleCompartment = compartments.length === 1;

 return (
 <div className="max-w-sm mx-auto">
 {/* Bin Container - Thick outer border */}
 <div className="border-4 border-[var(--border)] dark:border-[var(--border)] rounded-lg overflow-hidden bg-[var(--surface-container-low)] dark:bg-[var(--card)] ">
 <div
 className="w-full"
 style={{
 display: 'grid',
 gridTemplateColumns: `repeat(${cols}, 1fr)`,
 gridTemplateRows: `repeat(${rows}, 1fr)`,
 minHeight: isSingleCompartment ? '120px' : `${Math.min(rows * 60, 240)}px`
 }}
 >
 {compartments.map((compartment, index) => {
 const isPickFrom = selectedItem.compartmentLpn && compartment.lpn === selectedItem.compartmentLpn;
 const qty = compartmentInventory.get(compartment.lpn) || 0;
 const row = Math.floor(index / cols);
 const col = index % cols;

 const borderClasses = [];
 if (col < cols - 1) borderClasses.push('border-r');
 if (row < rows - 1) borderClasses.push('border-b');

 return (
 <div
 key={compartment.lpn}
 className={`flex flex-col items-center justify-center transition-all ${borderClasses.join(' ')} border-[var(--border)] dark:border-[var(--border)] ${
 isPickFrom
 ? "bg-[var(--primary)] "
 : "bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)]"
 }`}
 >
 <div className={`text-sm font-mono font-bold leading-none ${
 isPickFrom
 ? "text-white"
 : "text-[var(--muted-foreground)]"
 }`}>
 {compartment.lpn.split('-').pop()}
 </div>
 {qty > 0 && (
 <div className={`text-[10px] font-medium mt-0.5 ${
 isPickFrom
 ? "text-[var(--muted-foreground)]"
 : "text-[var(--muted-foreground)]"
 }`}>
 {qty} units
 </div>
 )}
 </div>
 );
 })}
 </div>
 </div>
 </div>
 );
 })()}
 </div>

 {/* Quantity Controls */}
 <div className="flex-shrink-0 mt-2 pt-2 border-t border-[var(--border)]  flex flex-col items-center">
 <p className="text-xs text-[var(--muted-foreground)] mb-2">Quantity Processed</p>

 {/* Large Quantity Display/Input */}
 <div className="mb-2 text-center">
 <div className="text-3xl font-bold text-[var(--primary)] dark:text-[var(--primary)]">
 {processedQuantity}
 </div>
 <div className="text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] mt-1">/ {selectedItem.quantity}</div>
 {crossSortbarItems.length > 1 && (
 <div className="mt-2">
 <div className="text-xs text-[var(--muted-foreground)] mb-1">
 Total: <span className="font-semibold text-[var(--foreground)] ">{crossSortbarItems.reduce((s, x) => s + x.quantity, 0)}</span>
 </div>
 <div className="flex flex-wrap justify-center gap-1">
 {crossSortbarItems.map(x => (
 <span key={x.sortbarId} className={`px-1.5 py-0.5 rounded text-xs font-medium border ${x.sortbarId === activeSortbar ? "bg-[var(--primary)]/20 /20 border-[var(--primary)] dark:border-[var(--primary)] text-[var(--primary)] dark:text-[var(--primary)]" : "bg-[var(--surface-container-low)] dark:bg-[var(--card)] border-[var(--border)] dark:border-[var(--border)] text-[var(--muted-foreground)]"}`}>
 {x.sortbarName}: {x.quantity}
 </span>
 ))}
 </div>
 </div>
 )}
 </div>

 {/* Increase/Decrease Buttons */}
 <div className="flex items-center gap-2 mb-2">
 <button
 onClick={handleQuantityDecrease}
 disabled={processedQuantity === 0}
 className="w-16 h-10 bg-[var(--surface-container)] dark:bg-[var(--card)] hover:bg-[var(--surface-container-high)] disabled:opacity-30 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-colors"
 >
 <Minus size={18} className="text-[var(--foreground)] " />
 </button>
 <button
 onClick={handleQuantityIncrease}
 disabled={processedQuantity >= selectedItem.quantity}
 className="w-16 h-10 bg-[var(--surface-container)] dark:bg-[var(--card)] hover:bg-[var(--surface-container-high)] disabled:opacity-30 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-colors"
 >
 <Plus size={18} className="text-[var(--foreground)] " />
 </button>
 </div>

 {/* Keypad */}
 <div className="grid grid-cols-3 gap-1.5 max-w-[180px] mb-2">
 {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
 <button
 key={num}
 onClick={() => {
 const newValue = parseInt(`${processedQuantity}${num}`);
 if (newValue <= selectedItem.quantity) {
 setProcessedQuantity(newValue);
 }
 }}
 className="w-14 h-10 bg-[var(--surface-container)] dark:bg-[var(--card)] hover:bg-[var(--surface-container-high)] rounded-lg flex items-center justify-center text-[var(--foreground)]  font-semibold text-base transition-colors"
 >
 {num}
 </button>
 ))}
 <button
 onClick={() => setProcessedQuantity(0)}
 className="w-14 h-10 bg-[var(--surface-container)] dark:bg-[var(--card)] hover:bg-[var(--surface-container-high)] rounded-lg flex items-center justify-center text-[var(--foreground)]  font-semibold text-base transition-colors"
 >
 C
 </button>
 <button
 onClick={() => {
 const newValue = parseInt(`${processedQuantity}0`);
 if (newValue <= selectedItem.quantity) {
 setProcessedQuantity(newValue);
 }
 }}
 className="w-14 h-10 bg-[var(--surface-container)] dark:bg-[var(--card)] hover:bg-[var(--surface-container-high)] rounded-lg flex items-center justify-center text-[var(--foreground)]  font-semibold text-base transition-colors"
 >
 0
 </button>
 <button
 onClick={() => {
 const currentStr = processedQuantity.toString();
 const newValue = currentStr.length > 1 ? parseInt(currentStr.slice(0, -1)) : 0;
 setProcessedQuantity(newValue);
 }}
 className="w-14 h-10 bg-[var(--state-error)]/20 dark:bg-[var(--state-error)]/30 hover:bg-[var(--state-error)]/30 dark:hover:bg-[var(--state-error)]/40 rounded-lg flex items-center justify-center text-[var(--state-error)] dark:text-[var(--state-error)] font-semibold text-base transition-colors"
 >
 ⌫
 </button>
 </div>
 </div>
 </div>

 {/* Next/Confirm Button - Pinned */}
 <div className="flex-shrink-0 p-3">
 {(() => {
 const currentIndex = items.findIndex(i => i.id === selectedItem.id);
 const isLastItem = currentIndex === items.length - 1;
 return (
 <button
 onClick={handleNextOrConfirm}
 className="w-full px-6 py-3 bg-[var(--primary)] hover:opacity-90 active:scale-[0.98] text-[var(--primary-foreground)] rounded-lg font-semibold text-base transition-colors flex items-center justify-center gap-2 "
 >
 <Check size={20} />
 {isLastItem ? "Confirm" : "Next"}
 </button>
 );
 })()}
 </div>
 </div>
 ) : (
 <div className="h-full flex items-center justify-center">
 <div className="text-center max-w-xs">
 <div className="w-16 h-16 bg-[var(--surface-container-low)] dark:bg-[var(--card)] rounded-full flex items-center justify-center mx-auto mb-3">
 <Box size={32} className="text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]" />
 </div>
 <p className="text-[var(--muted-foreground)]">
 No active pick for this bin
 </p>
 </div>
 </div>
 )}
 </div>
 );
 })()}
 </div>

 {/* Bin 2 */}
 <div className="flex-1">
 {(() => {
 // Get the active sortbar's registration
 const registration = activeSortbar ? sortbarRegistrations.find(reg => reg.sortbarId === activeSortbar) : null;
 if (!registration) {
 return (
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-xl overflow-hidden h-full flex flex-col opacity-50 p-3">
 <div className="flex items-center gap-2 mb-3 flex-shrink-0">
 <div className="w-8 h-8 bg-[var(--primary)]/20 /20 rounded-lg flex items-center justify-center">
 <Box size={16} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 </div>
 <h2 className="font-semibold text-[var(--foreground)] ">Bin 2</h2>
 </div>
 <div className="h-full flex items-center justify-center">
 <div className="text-center max-w-xs">
 <div className="w-16 h-16 bg-[var(--surface-container-low)] dark:bg-[var(--card)] rounded-full flex items-center justify-center mx-auto mb-3">
 <Box size={32} className="text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]" />
 </div>
 <p className="text-[var(--muted-foreground)]">
 No active sortbar
 </p>
 </div>
 </div>
 </div>
 );
 }

 // Check if this bin has any items assigned to it that haven't been picked yet
 const bin2Items = registration.items.filter(item => {
 const assignedToBin2 = itemBinAssignments.get(item.id) === 2;
 const notCurrentItem = !selectedItem || item.id !== selectedItem.id;
 return assignedToBin2 && notCurrentItem;
 });
 const hasBin2Items = bin2Items.length > 0;
 const currentItemInBin2 = selectedItem && itemBinAssignments.get(selectedItem.id) === 2;
 const isActive = currentItemInBin2;
 const isReady = hasBin2Items && !currentItemInBin2 && binArrivals.has(2);

 return (
 <div className={`bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-xl overflow-hidden h-full flex flex-col p-3 ${
 isActive ? ' ' : isReady ? ' ' : 'opacity-50'
 }`}>
 <div className="flex items-center justify-between mb-3 flex-shrink-0">
 <div className="flex items-center gap-2">
 <div className="w-8 h-8 bg-[var(--primary)]/20 /20 rounded-lg flex items-center justify-center">
 <Box size={16} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 </div>
 <h2 className="font-semibold text-[var(--foreground)] ">
 Bin 2 {isActive && selectedItem?.binNumber ? `- ${selectedItem.binNumber}` : ''}
 </h2>
 </div>
 {isReady && (
 <span className="text-xs px-2 py-0.5 bg-[var(--state-warning)]/10 text-[var(--state-on-warning-container)] dark:text-[var(--state-warning)] rounded-full font-medium">
 Ready
 </span>
 )}
 </div>

 {isActive && selectedItem ? (
 <div className="flex-1 flex flex-col overflow-hidden">
 {/* Compartment Grid */}
 <div className="flex-1 p-3 flex flex-col overflow-y-auto">
 <div className="flex-shrink-0 mb-2">
 <div className="flex items-center justify-between mb-2">
 <p className="text-xs text-[var(--muted-foreground)]">
 Pick from Compartment
 </p>
 <button
 onClick={handleAdjustInventoryClick}
 className="px-2 py-1 text-xs bg-[var(--state-info)] dark:bg-[var(--state-info-container)] hover:bg-[var(--state-info)] dark:hover:bg-[var(--state-info)] text-[var(--state-on-info-container)] rounded font-medium transition-colors"
 >
 Adjust Inventory
 </button>
 </div>
 {selectedItem.compartmentLpn && (
 <p className="text-base font-bold text-[var(--primary)] dark:text-[var(--primary)] text-center mb-2">
 {selectedItem.compartmentLpn.split('-').pop()}
 </p>
 )}
 {(() => {
 const compartments = generateCompartments(selectedItem.containerName, selectedItem.compartmentConfig);
 const { cols, rows } = selectedItem.compartmentConfig;
 const isSingleCompartment = compartments.length === 1;

 return (
 <div className="max-w-sm mx-auto">
 {/* Bin Container - Thick outer border */}
 <div className="border-4 border-[var(--border)] dark:border-[var(--border)] rounded-lg overflow-hidden bg-[var(--surface-container-low)] dark:bg-[var(--card)] ">
 <div
 className="w-full"
 style={{
 display: 'grid',
 gridTemplateColumns: `repeat(${cols}, 1fr)`,
 gridTemplateRows: `repeat(${rows}, 1fr)`,
 minHeight: isSingleCompartment ? '120px' : `${Math.min(rows * 60, 240)}px`
 }}
 >
 {compartments.map((compartment, index) => {
 const isPickFrom = selectedItem.compartmentLpn && compartment.lpn === selectedItem.compartmentLpn;
 const qty = compartmentInventory.get(compartment.lpn) || 0;
 const row = Math.floor(index / cols);
 const col = index % cols;

 const borderClasses = [];
 if (col < cols - 1) borderClasses.push('border-r');
 if (row < rows - 1) borderClasses.push('border-b');

 return (
 <div
 key={compartment.lpn}
 className={`flex flex-col items-center justify-center transition-all ${borderClasses.join(' ')} border-[var(--border)] dark:border-[var(--border)] ${
 isPickFrom
 ? "bg-[var(--primary)] "
 : "bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)]"
 }`}
 >
 <div className={`text-sm font-mono font-bold leading-none ${
 isPickFrom
 ? "text-white"
 : "text-[var(--muted-foreground)]"
 }`}>
 {compartment.lpn.split('-').pop()}
 </div>
 {qty > 0 && (
 <div className={`text-[10px] font-medium mt-0.5 ${
 isPickFrom
 ? "text-[var(--muted-foreground)]"
 : "text-[var(--muted-foreground)]"
 }`}>
 {qty} units
 </div>
 )}
 </div>
 );
 })}
 </div>
 </div>
 </div>
 );
 })()}
 </div>

 {/* Quantity Controls */}
 <div className="flex-shrink-0 mt-2 pt-2 border-t border-[var(--border)]  flex flex-col items-center">
 <p className="text-xs text-[var(--muted-foreground)] mb-2">Quantity Processed</p>

 {/* Large Quantity Display/Input */}
 <div className="mb-2 text-center">
 <div className="text-3xl font-bold text-[var(--primary)] dark:text-[var(--primary)]">
 {processedQuantity}
 </div>
 <div className="text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] mt-1">/ {selectedItem.quantity}</div>
 {crossSortbarItems.length > 1 && (
 <div className="mt-2">
 <div className="text-xs text-[var(--muted-foreground)] mb-1">
 Total: <span className="font-semibold text-[var(--foreground)] ">{crossSortbarItems.reduce((s, x) => s + x.quantity, 0)}</span>
 </div>
 <div className="flex flex-wrap justify-center gap-1">
 {crossSortbarItems.map(x => (
 <span key={x.sortbarId} className={`px-1.5 py-0.5 rounded text-xs font-medium border ${x.sortbarId === activeSortbar ? "bg-[var(--primary)]/20 /20 border-[var(--primary)] dark:border-[var(--primary)] text-[var(--primary)] dark:text-[var(--primary)]" : "bg-[var(--surface-container-low)] dark:bg-[var(--card)] border-[var(--border)] dark:border-[var(--border)] text-[var(--muted-foreground)]"}`}>
 {x.sortbarName}: {x.quantity}
 </span>
 ))}
 </div>
 </div>
 )}
 </div>

 {/* Increase/Decrease Buttons */}
 <div className="flex items-center gap-2 mb-2">
 <button
 onClick={handleQuantityDecrease}
 disabled={processedQuantity === 0}
 className="w-16 h-10 bg-[var(--surface-container)] dark:bg-[var(--card)] hover:bg-[var(--surface-container-high)] disabled:opacity-30 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-colors"
 >
 <Minus size={18} className="text-[var(--foreground)] " />
 </button>
 <button
 onClick={handleQuantityIncrease}
 disabled={processedQuantity >= selectedItem.quantity}
 className="w-16 h-10 bg-[var(--surface-container)] dark:bg-[var(--card)] hover:bg-[var(--surface-container-high)] disabled:opacity-30 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-colors"
 >
 <Plus size={18} className="text-[var(--foreground)] " />
 </button>
 </div>

 {/* Keypad */}
 <div className="grid grid-cols-3 gap-1.5 max-w-[180px] mb-2">
 {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
 <button
 key={num}
 onClick={() => {
 const newValue = parseInt(`${processedQuantity}${num}`);
 if (newValue <= selectedItem.quantity) {
 setProcessedQuantity(newValue);
 }
 }}
 className="w-14 h-10 bg-[var(--surface-container)] dark:bg-[var(--card)] hover:bg-[var(--surface-container-high)] rounded-lg flex items-center justify-center text-[var(--foreground)]  font-semibold text-base transition-colors"
 >
 {num}
 </button>
 ))}
 <button
 onClick={() => setProcessedQuantity(0)}
 className="w-14 h-10 bg-[var(--surface-container)] dark:bg-[var(--card)] hover:bg-[var(--surface-container-high)] rounded-lg flex items-center justify-center text-[var(--foreground)]  font-semibold text-base transition-colors"
 >
 C
 </button>
 <button
 onClick={() => {
 const newValue = parseInt(`${processedQuantity}0`);
 if (newValue <= selectedItem.quantity) {
 setProcessedQuantity(newValue);
 }
 }}
 className="w-14 h-10 bg-[var(--surface-container)] dark:bg-[var(--card)] hover:bg-[var(--surface-container-high)] rounded-lg flex items-center justify-center text-[var(--foreground)]  font-semibold text-base transition-colors"
 >
 0
 </button>
 <button
 onClick={() => {
 const currentStr = processedQuantity.toString();
 const newValue = currentStr.length > 1 ? parseInt(currentStr.slice(0, -1)) : 0;
 setProcessedQuantity(newValue);
 }}
 className="w-14 h-10 bg-[var(--state-error)]/20 dark:bg-[var(--state-error)]/30 hover:bg-[var(--state-error)]/30 dark:hover:bg-[var(--state-error)]/40 rounded-lg flex items-center justify-center text-[var(--state-error)] dark:text-[var(--state-error)] font-semibold text-base transition-colors"
 >
 ⌫
 </button>
 </div>
 </div>
 </div>

 {/* Next/Confirm Button - Pinned */}
 <div className="flex-shrink-0 p-3">
 {(() => {
 const currentIndex = items.findIndex(i => i.id === selectedItem.id);
 const isLastItem = currentIndex === items.length - 1;
 return (
 <button
 onClick={handleNextOrConfirm}
 className="w-full px-6 py-3 bg-[var(--primary)] hover:opacity-90 active:scale-[0.98] text-[var(--primary-foreground)] rounded-lg font-semibold text-base transition-colors flex items-center justify-center gap-2 "
 >
 <Check size={20} />
 {isLastItem ? "Confirm" : "Next"}
 </button>
 );
 })()}
 </div>
 </div>
 ) : (
 <div className="h-full flex items-center justify-center">
 <div className="text-center max-w-xs">
 <div className="w-16 h-16 bg-[var(--surface-container-low)] dark:bg-[var(--card)] rounded-full flex items-center justify-center mx-auto mb-3">
 <Box size={32} className="text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]" />
 </div>
 <p className="text-[var(--muted-foreground)]">
 No active pick for this bin
 </p>
 </div>
 </div>
 )}
 </div>
 );
 })()}
 </div>
 </div>

 {/* Right Sortbar */}
 <div className="w-[15%] min-w-[180px]">
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-xl overflow-hidden h-full flex flex-col p-3">
 <div className="flex items-center gap-2 mb-3 flex-shrink-0">
 <div className="w-8 h-8 bg-[var(--primary)]/20 /20 rounded-lg flex items-center justify-center">
 <Grid3x3 size={16} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 </div>
 <h2 className="font-semibold text-[var(--foreground)] ">Sortbar 2</h2>
 </div>
 <div className="flex-1 overflow-y-auto">
 {/* Single sortbar display - will show A2 sortbar */}
 {(() => {
 const sortbar = initialSortbars.find(sb => sb.id === "SB-A2");
 if (!sortbar) return null;
 const registration = sortbarRegistrations.find(reg => reg.sortbarId === "SB-A2");
 const isActive = activeSortbar === sortbar.id;
 const isRegistered = !!registration;
 const status = getSortbarStatus(sortbar.id);

 return (
 <button
 onClick={() => handleSortbarSelect(sortbar.id)}
 className={`w-full text-left px-2.5 py-1.5 rounded-lg border-2 h-[130px] flex flex-col ${
 isActive && isRegistered
 ? "animate-pulse bg-[var(--primary)]/20 /20 border-[var(--primary)] dark:border-[var(--primary)] "
 : isRegistered
 ? "border-[var(--state-info)]/40 dark:border-[var(--state-info)]/30 bg-[var(--state-info)]/5 dark:bg-[var(--state-info)]/5 hover:border-[var(--state-info)]/40/50 dark:hover:border-[var(--state-info)]/50 transition-all"
 : "border-[var(--border)]  hover:border-[var(--primary)] dark:hover:border-[var(--primary)] hover:bg-[var(--surface-container-lowest)] hover:bg-[var(--surface-container-high)]/30 transition-all"
 }`}
 >
 <div className="flex-1 flex flex-col">
 <div className="flex items-center justify-between mb-0.5">
 <h3 className="text-lg font-bold text-[var(--foreground)] ">{sortbar.name}</h3>
 <span
 className={`text-[10px] px-1.5 py-0.5 rounded-full ${
 status === "available"
 ? "bg-[var(--primary)]/10 /10 text-[var(--primary)] dark:text-[var(--primary)]"
 : "bg-[var(--state-info)]/10 text-[var(--state-info)] dark:text-[var(--state-info)]"
 }`}
 >
 {status}
 </span>
 </div>
 {registration?.lpn && (
 <div className="text-[10px] text-[var(--muted-foreground)] mb-0.5 font-mono">
 LPN: {registration.lpn}
 </div>
 )}
 <div className="pt-0.5 border-t border-[var(--border)]  flex-1">
 {registration ? (
 <>
 <p className="text-[10px] text-[var(--state-info)] dark:text-[var(--state-info)] font-medium mb-0.5">
 {registration.workListId}
 </p>
 <div className="flex items-baseline gap-2.5 mb-0.5">
 <div className="flex items-baseline gap-0.5">
 <div className="text-xl font-bold text-[var(--state-info)] dark:text-[var(--state-info)] leading-none">
 {registration.itemCount}
 </div>
 <div className="text-[10px] text-[var(--muted-foreground)]">items</div>
 </div>
 <div className="flex items-baseline gap-0.5">
 <div className="text-xl font-bold text-[var(--state-info)] dark:text-[var(--state-info)] leading-none">
 {registration.totalQuantity}
 </div>
 <div className="text-[10px] text-[var(--muted-foreground)]">qty</div>
 </div>
 </div>
 {(() => {
 const completedItems = registration.items.filter(item => {
 const processed = registration.processedItems.get(item.id) || 0;
 return processed > 0;
 }).length;
 const itemProgress = registration.itemCount > 0 ? (completedItems / registration.itemCount) * 100 : 0;

 return (
 <div className="h-1.5 bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)] rounded-full overflow-hidden">
 <div
 className="h-full bg-[var(--state-info)] dark:bg-[var(--state-info)] transition-all duration-300"
 style={{ width: `${itemProgress}%` }}
 />
 </div>
 );
 })()}
 </>
 ) : (
 <p className="text-xs text-[var(--muted-foreground)]">Click to register</p>
 )}
 </div>
 </div>
 </button>
 );
 })()}
 </div>
 </div>
 </div>
 </div>

 {/* Current Item Section - Separate */}
 <div className="w-[28%] min-w-[360px] h-[calc(100vh-96px)]">
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-xl overflow-hidden h-full flex flex-col">
 <div className="bg-[var(--surface-container-low)] dark:bg-[var(--card)] p-3 border-b border-[var(--border)]  flex-shrink-0">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <Package size={20} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 <h2 className="font-semibold text-base text-[var(--foreground)] ">
 Current Item {selectedItem ? `(${items.findIndex(i => i.id === selectedItem.id) + 1} of ${items.length})` : `(0 of ${items.length})`}
 </h2>
 </div>
 <div className="flex items-center gap-1">
 <button
 onClick={handleNavigateBack}
 disabled={currentHistoryIndex <= 0}
 className="p-1.5 rounded hover:bg-[var(--surface-container-high)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
 title="Previous item"
 >
 <ChevronLeft size={20} className="text-[var(--foreground)] " />
 </button>
 <button
 onClick={handleNavigateForward}
 disabled={currentHistoryIndex >= itemNavigationHistory.length - 1}
 className="p-1.5 rounded hover:bg-[var(--surface-container-high)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
 title="Next item"
 >
 <ChevronRight size={20} className="text-[var(--foreground)] " />
 </button>
 </div>
 </div>
 </div>

 <div className="overflow-y-auto flex-1 p-3">
 {selectedItem ? (
 <motion.div
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 className="space-y-4"
 >
 {/* Item Image */}
 {selectedItem.imageUrl && (
 <div className="w-full aspect-[4/3] bg-[var(--surface-container-low)] dark:bg-[var(--card)] rounded-lg overflow-hidden">
 <img
 src={selectedItem.imageUrl}
 alt={selectedItem.description}
 className="w-full h-full object-cover"
 />
 </div>
 )}

 {/* Item Details */}
 <div className="space-y-2">
 <div>
 <div className="text-xs text-[var(--muted-foreground)] mb-0.5">SKU</div>
 <div className="font-mono text-2xl font-bold text-[var(--foreground)] ">
 {selectedItem.sku}
 </div>
 </div>

 <div>
 <div className="text-xs text-[var(--muted-foreground)] mb-0.5">Description</div>
 <div className="text-base text-[var(--foreground)]  leading-relaxed">
 {selectedItem.description}
 </div>
 </div>

 <div className="grid grid-cols-2 gap-3">
 <div>
 <div className="text-xs text-[var(--muted-foreground)] mb-0.5">Location</div>
 <div className="text-base font-medium text-[var(--foreground)]  mb-1">
 {selectedItem.location}
 </div>
 <div className="flex flex-col gap-0.5 text-xs text-[var(--muted-foreground)]">
 <span>Bin: {selectedItem.binNumber}</span>
 <span>Compartment: <span className="font-mono text-[var(--primary)] dark:text-[var(--primary)] font-bold">
 {selectedItem.compartmentLpn.split('-').pop()}
 </span></span>
 </div>
 </div>
 <div>
 <div className="text-xs text-[var(--muted-foreground)] mb-0.5">Priority</div>
 <div>
 <span
 className={`text-xs px-2.5 py-1 rounded-full font-medium inline-block ${
 selectedItem.priority === "High"
 ? "bg-[var(--state-error)]/10 text-[var(--state-error)] dark:text-[var(--state-error)]"
 : "bg-[var(--state-debug)]/10 text-[var(--muted-foreground)]"
 }`}
 >
 {selectedItem.priority}
 </span>
 </div>
 </div>
 </div>

 <div>
 <div className="text-xs text-[var(--muted-foreground)] mb-0.5">Quantity to Pick</div>
 <div className="text-3xl font-bold text-[var(--primary)] dark:text-[var(--primary)]">
 {selectedItem.quantity}
 </div>
 </div>

 {selectedItem.itemComment && (
 <div>
 <div className="text-xs text-[var(--muted-foreground)] mb-0.5 flex items-center gap-1.5">
 <Info size={14} />
 Item Comment
 </div>
 <div className="bg-[var(--state-info-container)] dark:bg-[var(--state-info-container)]/20 border border-[var(--secondary)]/30 dark:border-[var(--secondary-container)]/30 rounded-lg p-2 text-xs text-[var(--state-on-info-container)] dark:text-[var(--state-info)]">
 {selectedItem.itemComment}
 </div>
 </div>
 )}
 </div>
 </motion.div>
 ) : (
 <div className="h-full flex items-center justify-center">
 <div className="text-center max-w-xs">
 <div className="w-16 h-16 bg-[var(--surface-container-low)] dark:bg-[var(--card)] rounded-full flex items-center justify-center mx-auto mb-3">
 <Package size={32} className="text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]" />
 </div>
 <p className="text-[var(--muted-foreground)]">
 No item selected. Select an item to begin picking.
 </p>
 </div>
 </div>
 )}
 </div>
 </div>
 </div>
 </div>
 ) : (
 /* Pack & Hold Horizontal Layout */
 <div
 className={`flex flex-col gap-2 h-[calc(100vh-116px)] transition-all duration-500 ease-in-out ${
 showSortbarMenu && panelView === "menu" ? 'mr-[400px]' : 'mr-0'
 }`}
 >
 {/* ── SORTBARS (full width) ── */}
 <div className="flex-shrink-0 min-w-0">

 {/* Sortbars section */}
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-xl p-2">
 {/* Header row */}
 <div className="flex items-center justify-between mb-1.5">
 <div className="flex items-center gap-3">
 <div className="w-9 h-9 bg-[var(--primary)]/20 /20 rounded-lg flex items-center justify-center flex-shrink-0">
 <Grid3x3 size={18} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 </div>
 <h2 className="text-lg font-semibold text-[var(--foreground)] ">Sortbars</h2>
 </div>
 <button
 onClick={() => setShowAutoRegister(true)}
 className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] hover:opacity-90 active:scale-[0.98] text-[var(--primary-foreground)] rounded-lg text-sm font-semibold transition-colors border border-[var(--primary)] dark:border-[var(--primary)] "
 >
 <Grid3x3 size={15} />
 Register Multiple
 </button>
 </div>

 {/* A | B sortbar grids with centre divider */}
 <div className="flex gap-0 items-stretch">
 {/* ── Section A ── */}
 <div className="flex-1 pr-3">
 <p className="text-[11px] font-bold text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] uppercase tracking-widest text-center mb-1.5">← Section A</p>
 <div className="grid grid-cols-3 gap-1.5">
 {(['A1','A2','A3','A4','A5','A6'] as const).map(sortbarName => {
 const sortbar = initialSortbars.find(sb => sb.name === sortbarName);
 if (!sortbar) return null;
 const registration = sortbarRegistrations.find(reg => reg.sortbarId === sortbar.id);
 const status = getSortbarStatus(sortbar.id);
 const crossItem = crossSortbarItems.find(x => x.sortbarId === sortbar.id);
 const isFlashing = !!crossItem && !confirmedSortbars.has(sortbar.id);
 const isConfirmed = confirmedSortbars.has(sortbar.id);
 const adjustedQty = sortbarAdjustedQtys.get(sortbar.id) ?? crossItem?.quantity ?? 0;
 const isMenuOpen = showSortbarMenu && selectedSortbar === sortbar.id;
 const dividerColor = isFlashing ? "border-[var(--primary)]/30 dark:border-[var(--primary)]/30" : isConfirmed ? "border-[var(--state-success)]/30" : "border-[var(--border)] ";
 return (
 <div
 key={sortbar.id}
 className={`flex flex-col rounded-xl border-2 p-2 transition-all min-h-[110px] ${
 isFlashing
 ? "animate-pulse bg-[var(--primary)]/15 /15 border-[var(--primary)] dark:border-[var(--primary)] "
 : isConfirmed
 ? "bg-[var(--state-success-container)]/60 border-[var(--state-success)]/40/60"
 : registration
 ? "border-[var(--state-info)]/40/40 dark:border-[var(--state-info)]/40 bg-[var(--state-info)]/5 dark:bg-[var(--state-info)]/5"
 : status === "maintenance"
 ? "border-[var(--border)]  bg-[var(--surface-container-lowest)] dark:bg-[var(--surface-container)] opacity-40"
 : "border-[var(--border)]  hover:border-[var(--primary)]/50 dark:hover:border-[var(--primary)]/50 hover:bg-[var(--surface-container-lowest)] hover:bg-[var(--surface-container-high)]/30 cursor-pointer"
 }`}
 onClick={() => {
 if (!crossItem && !registration && status !== "maintenance") handleSortbarSelect(sortbar.id);
 }}
 >
 {/* ── Top info section ── */}
 <div className="flex-shrink-0">
 {/* Row 1: name + status badge + LPN + actions button */}
 <div className="flex items-center justify-between gap-1 mb-1">
 <div className="flex items-center gap-1.5 min-w-0">
 <h3 className={`text-base font-bold leading-tight flex-shrink-0 ${isFlashing ? "text-[var(--primary)] dark:text-[var(--primary)]" : isConfirmed ? "text-[var(--state-on-success-container)] dark:text-[var(--state-success)]" : "text-[var(--foreground)]"}`}>{sortbar.name}</h3>
 <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold flex-shrink-0 ${isConfirmed ? "bg-[var(--state-success-container)] text-[var(--state-on-success-container)] dark:text-[var(--state-success)]" : status === "available" ? "bg-[var(--primary)]/10 text-[var(--primary)] dark:text-[var(--primary)]" : "bg-[var(--state-info)]/10 text-[var(--state-info)] dark:text-[var(--state-info)]"}`}>{isConfirmed ? "✓" : status}</span>
 {registration?.lpn && <span className="text-[10px] font-mono text-[var(--muted-foreground)] truncate"><span className="text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">LPN:</span> {registration.lpn.split('-').pop()}</span>}
 </div>
 {registration && (
 <button
 onClick={(e) => { e.stopPropagation(); if (isMenuOpen) { handleCloseSortbarMenu(); } else { handleSortbarSelect(sortbar.id); } }}
 className={`p-1 rounded-md transition-colors flex-shrink-0 ${isMenuOpen ? "bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)]" : "hover:bg-[var(--surface-container-low)] hover:bg-[var(--surface-container-high)]"}`}
 title={isMenuOpen ? "Close actions" : "Actions"}
 >
 <MoreHorizontal size={15} className="text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]" />
 </button>
 )}
 </div>
 {/* Row 2: work list info (when registered) */}
 {registration && !isConfirmed && (
 <div className="mb-0.5 flex items-baseline gap-2 flex-wrap">
 <p className="text-[10px] font-semibold text-[var(--state-info)] dark:text-[var(--state-info)] font-mono leading-tight flex-shrink-0">{registration.workListId}</p>
 <span className="text-[10px] text-[var(--muted-foreground)] flex-shrink-0"><span className="font-bold text-[var(--foreground)] ">{registration.processedItems.size}</span>/{registration.itemCount} items</span>
 <span className="text-[10px] text-[var(--muted-foreground)] flex-shrink-0"><span className="font-bold text-[var(--foreground)] ">{(() => { let q = 0; registration.processedItems.forEach(v => { q += v; }); return q; })()}</span>/{registration.totalQuantity} qty</span>
 </div>
 )}
 {!registration && status !== "maintenance" && (
 <p className="text-[11px] text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">Tap to register</p>
 )}
 </div>

 {/* ── Always-visible divider ── */}
 <div className={`border-t ${dividerColor} my-1.5`} />

 {/* ── Bottom qty section (flex-1 so height is consistent) ── */}
 <div className="flex-1 flex items-center justify-center">
 {crossItem && !isConfirmed ? (
 <div className="w-full flex items-center justify-between gap-1">
 <button
 onClick={(e) => { e.stopPropagation(); setSortbarAdjustedQtys(prev => { const m = new Map(prev); m.set(sortbar.id, Math.max(0, (m.get(sortbar.id) ?? crossItem.quantity) - 1)); return m; }); }}
 className="w-9 h-9 rounded-full bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)] hover:bg-[var(--surface-container-high)] active:scale-95 flex items-center justify-center transition-all flex-shrink-0 "
 >
 <Minus size={15} className="text-[var(--foreground)] " />
 </button>
 <button
 onClick={(e) => { e.stopPropagation(); handleConfirmForSortbar(sortbar.id); }}
 className="text-4xl font-bold text-[var(--primary)] dark:text-[var(--primary)] hover:opacity-70 active:scale-95 transition-all leading-none select-none"
 title="Tap to confirm pick"
 >{adjustedQty}</button>
 <button
 onClick={(e) => { e.stopPropagation(); setSortbarAdjustedQtys(prev => { const m = new Map(prev); m.set(sortbar.id, (m.get(sortbar.id) ?? crossItem.quantity) + 1); return m; }); }}
 className="w-9 h-9 rounded-full bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)] hover:bg-[var(--surface-container-high)] active:scale-95 flex items-center justify-center transition-all flex-shrink-0 "
 >
 <Plus size={15} className="text-[var(--foreground)] " />
 </button>
 </div>
 ) : isConfirmed ? (
 <div className="flex items-center gap-1 text-[var(--state-on-success-container)] dark:text-[var(--state-success)]">
 <Check size={15} />
 <span className="text-sm font-bold">Done</span>
 </div>
 ) : null}
 </div>
 </div>
 );
 })}
 </div>
 </div>

 {/* Centre divider */}
 <div className="w-px bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)] self-stretch mx-0" />

 {/* ── Section B ── */}
 <div className="flex-1 pl-3">
 <p className="text-[11px] font-bold text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] uppercase tracking-widest text-center mb-1.5">Section B →</p>
 <div className="grid grid-cols-3 gap-1.5">
 {(['B1','B2','B3','B4','B5','B6'] as const).map(sortbarName => {
 const sortbar = initialSortbars.find(sb => sb.name === sortbarName);
 if (!sortbar) return null;
 const registration = sortbarRegistrations.find(reg => reg.sortbarId === sortbar.id);
 const status = getSortbarStatus(sortbar.id);
 const crossItem = crossSortbarItems.find(x => x.sortbarId === sortbar.id);
 const isFlashing = !!crossItem && !confirmedSortbars.has(sortbar.id);
 const isConfirmed = confirmedSortbars.has(sortbar.id);
 const adjustedQty = sortbarAdjustedQtys.get(sortbar.id) ?? crossItem?.quantity ?? 0;
 const isMenuOpen = showSortbarMenu && selectedSortbar === sortbar.id;
 const dividerColor = isFlashing ? "border-[var(--primary)]/30 dark:border-[var(--primary)]/30" : isConfirmed ? "border-[var(--state-success)]/30" : "border-[var(--border)] ";
 return (
 <div
 key={sortbar.id}
 className={`flex flex-col rounded-xl border-2 p-2 transition-all min-h-[110px] ${
 isFlashing
 ? "animate-pulse bg-[var(--primary)]/15 /15 border-[var(--primary)] dark:border-[var(--primary)] "
 : isConfirmed
 ? "bg-[var(--state-success-container)]/60 border-[var(--state-success)]/40/60"
 : registration
 ? "border-[var(--state-info)]/40/40 dark:border-[var(--state-info)]/40 bg-[var(--state-info)]/5 dark:bg-[var(--state-info)]/5"
 : status === "maintenance"
 ? "border-[var(--border)]  bg-[var(--surface-container-lowest)] dark:bg-[var(--surface-container)] opacity-40"
 : "border-[var(--border)]  hover:border-[var(--primary)]/50 dark:hover:border-[var(--primary)]/50 hover:bg-[var(--surface-container-lowest)] hover:bg-[var(--surface-container-high)]/30 cursor-pointer"
 }`}
 onClick={() => {
 if (!crossItem && !registration && status !== "maintenance") handleSortbarSelect(sortbar.id);
 }}
 >
 <div className="flex-shrink-0">
 <div className="flex items-start justify-between gap-1 mb-1">
 <h3 className={`text-base font-bold leading-tight ${isFlashing ? "text-[var(--primary)] dark:text-[var(--primary)]" : isConfirmed ? "text-[var(--state-on-success-container)] dark:text-[var(--state-success)]" : "text-[var(--foreground)]"}`}>{sortbar.name}</h3>
 {registration && (
 <button
 onClick={(e) => { e.stopPropagation(); if (isMenuOpen) { handleCloseSortbarMenu(); } else { handleSortbarSelect(sortbar.id); } }}
 className={`p-1 rounded-md transition-colors flex-shrink-0 ${isMenuOpen ? "bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)]" : "hover:bg-[var(--surface-container-low)] hover:bg-[var(--surface-container-high)]"}`}
 title={isMenuOpen ? "Close actions" : "Actions"}
 >
 <MoreHorizontal size={15} className="text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]" />
 </button>
 )}
 </div>
 <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 mb-1">
 <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${isConfirmed ? "bg-[var(--state-success-container)] text-[var(--state-on-success-container)] dark:text-[var(--state-success)]" : status === "available" ? "bg-[var(--primary)]/10 text-[var(--primary)] dark:text-[var(--primary)]" : "bg-[var(--state-info)]/10 text-[var(--state-info)] dark:text-[var(--state-info)]"}`}>{isConfirmed ? "✓ done" : status}</span>
 {registration?.lpn && <span className="text-[10px] font-mono text-[var(--muted-foreground)] truncate max-w-[60px]">{registration.lpn.split('-').pop()}</span>}
 </div>
 {registration && !isConfirmed && (
 <div className="mt-0.5 mb-0.5">
 <p className="text-[10px] font-semibold text-[var(--state-info)] dark:text-[var(--state-info)] font-mono truncate leading-tight">{registration.workListId}</p>
 <div className="flex gap-2 mt-0.5">
 <span className="text-[10px] text-[var(--muted-foreground)]"><span className="font-bold text-[var(--foreground)] ">{registration.processedItems.size}</span>/{registration.itemCount} items</span>
 <span className="text-[10px] text-[var(--muted-foreground)]"><span className="font-bold text-[var(--foreground)] ">{(() => { let q = 0; registration.processedItems.forEach(v => { q += v; }); return q; })()}</span>/{registration.totalQuantity} qty</span>
 </div>
 </div>
 )}
 {!registration && status !== "maintenance" && (
 <p className="text-[11px] text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">Tap to register</p>
 )}
 </div>

 <div className={`border-t ${dividerColor} my-1.5`} />

 <div className="flex-1 flex items-center justify-center">
 {crossItem && !isConfirmed ? (
 <div className="w-full flex items-center justify-between gap-1">
 <button
 onClick={(e) => { e.stopPropagation(); setSortbarAdjustedQtys(prev => { const m = new Map(prev); m.set(sortbar.id, Math.max(0, (m.get(sortbar.id) ?? crossItem.quantity) - 1)); return m; }); }}
 className="w-9 h-9 rounded-full bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)] hover:bg-[var(--surface-container-high)] active:scale-95 flex items-center justify-center transition-all flex-shrink-0 "
 >
 <Minus size={15} className="text-[var(--foreground)] " />
 </button>
 <button
 onClick={(e) => { e.stopPropagation(); handleConfirmForSortbar(sortbar.id); }}
 className="text-4xl font-bold text-[var(--primary)] dark:text-[var(--primary)] hover:opacity-70 active:scale-95 transition-all leading-none select-none"
 title="Tap to confirm pick"
 >{adjustedQty}</button>
 <button
 onClick={(e) => { e.stopPropagation(); setSortbarAdjustedQtys(prev => { const m = new Map(prev); m.set(sortbar.id, (m.get(sortbar.id) ?? crossItem.quantity) + 1); return m; }); }}
 className="w-9 h-9 rounded-full bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)] hover:bg-[var(--surface-container-high)] active:scale-95 flex items-center justify-center transition-all flex-shrink-0 "
 >
 <Plus size={15} className="text-[var(--foreground)] " />
 </button>
 </div>
 ) : isConfirmed ? (
 <div className="flex items-center gap-1 text-[var(--state-on-success-container)] dark:text-[var(--state-success)]">
 <Check size={15} />
 <span className="text-sm font-bold">Done</span>
 </div>
 ) : null}
 </div>
 </div>
 );
 })}
 </div>
 </div>
 </div>
 </div>
 </div>{/* end sortbars full-width row */}

 {/* ── BOTTOM ROW: Bin+Total combined (narrower) | Work List+Item (wider) ── */}
 <div className="flex gap-2 flex-1 min-h-0">

 {/* Left column: Work List (top) + Bin (flex-1) */}
 <div className="w-1/2 flex-shrink-0 flex flex-col gap-3">

 {/* Bin card — contains Total sidebar on right when multi-sortbar */}
 <div className="flex-1 min-h-0">
 {(() => {
 const registration = activeSortbar ? sortbarRegistrations.find(reg => reg.sortbarId === activeSortbar) : null;
 if (!registration) {
 return (
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-xl h-full flex flex-col opacity-50">
 <div className="p-4 border-b border-[var(--border)]  flex-shrink-0">
 <div className="flex items-center gap-2">
 <div className="w-8 h-8 bg-[var(--primary)]/20 /20 rounded-lg flex items-center justify-center">
 <Box size={16} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 </div>
 <h2 className="font-semibold text-[var(--foreground)] ">Bin</h2>
 </div>
 </div>
 <div className="flex-1 flex items-center justify-center">
 <div className="text-center">
 <Box size={40} className="text-[var(--foreground)] dark:text-[var(--muted-foreground)] mx-auto mb-3" />
 <p className="text-sm text-[var(--muted-foreground)]">Register a sortbar to begin picking</p>
 </div>
 </div>
 </div>
 );
 }
 return (
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-xl h-full flex flex-col )] )]">
 {/* Header */}
 <div className="px-3 py-1.5 border-b border-[var(--border)]  flex-shrink-0">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <div className="w-6 h-6 bg-[var(--primary)]/20 /20 rounded-lg flex items-center justify-center">
 <Box size={13} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 </div>
 <h2 className="font-semibold text-[var(--foreground)]  text-sm">
 Bin — {selectedItem?.binNumber || currentContainerLpn || "—"}
 </h2>
 </div>
 <button onClick={handleAdjustInventoryClick} className="px-2.5 py-1 text-xs bg-[var(--state-info)] dark:bg-[var(--state-info-container)] hover:bg-[var(--state-info)] dark:hover:bg-[var(--state-info)] text-[var(--state-on-info-container)] rounded-lg font-medium transition-colors">
 Adjust Inventory
 </button>
 </div>
 </div>
 {/* Body: pick- label (top) + all-sortbars strip + bin visual (middle) */}
 <div className="flex flex-col flex-1 min-h-0">
 {/* Pick From Bin label row — top of card */}
 {selectedItem && !horizBinRetrieving && (
 <div className="flex-shrink-0 border-b border-[var(--border)]  px-3 py-1.5 flex items-center justify-center gap-2">
 <p className="text-xs font-bold text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] uppercase tracking-wide">Pick From Bin:</p>
 <p className="text-base font-bold text-[var(--primary)] dark:text-[var(--primary)] font-mono">
 {selectedItem.compartmentLpn ? selectedItem.compartmentLpn.split('-').pop() : selectedItem.binNumber || "—"}
 </p>
 </div>
 )}
 {/* All Sortbars strip — only when multi-sortbar item */}
 {crossSortbarItems.length > 0 && (() => {
 const totalRequested = crossSortbarItems.reduce((s, x) => s + x.quantity, 0);
 // Picked = sum of actual adjusted qty for confirmed sortbars
 const totalPicked = crossSortbarItems.reduce((s, x) => {
 if (!confirmedSortbars.has(x.sortbarId)) return s;
 return s + (sortbarAdjustedQtys.get(x.sortbarId) ?? x.quantity);
 }, 0);
 // Remaining = total requested - original requested qty of confirmed sortbars
 const confirmedRequested = crossSortbarItems.reduce((s, x) =>
 confirmedSortbars.has(x.sortbarId) ? s + x.quantity : s, 0);
 const totalRemaining = totalRequested - confirmedRequested;
 return (
 <div className="flex-shrink-0 border-b border-[var(--border)]  px-3 py-1.5">
 {/* Top row: three stat blocks */}
 <div className="grid grid-cols-3 gap-2 mb-1.5">
 {/* Requested */}
 <div className="flex flex-col items-center">
 <p className="text-[9px] font-bold text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] uppercase tracking-wide mb-0.5">Requested</p>
 <p className="text-3xl font-black text-[var(--foreground)] leading-none tabular-nums">{totalRequested}</p>
 </div>
 {/* Picked */}
 <div className="flex flex-col items-center">
 <p className="text-[9px] font-bold text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] uppercase tracking-wide mb-0.5">Picked</p>
 <p className="text-3xl font-black text-[var(--primary)] dark:text-[var(--primary)] leading-none tabular-nums">{totalPicked}</p>
 </div>
 {/* Remaining */}
 <div className="flex flex-col items-center">
 <p className="text-[9px] font-bold text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] uppercase tracking-wide mb-0.5">Remaining</p>
 <p className={`text-3xl font-black leading-none tabular-nums ${totalRemaining > 0 ? "text-[var(--state-warning)]" : "text-[var(--state-success)]"}`}>{totalRemaining}</p>
 </div>
 </div>
 {/* Per-sortbar pills */}
 <div className="flex gap-1.5 flex-wrap justify-center">
 {crossSortbarItems.map(x => {
 const isDone = confirmedSortbars.has(x.sortbarId);
 const displayQty = isDone
 ? (sortbarAdjustedQtys.get(x.sortbarId) ?? x.quantity)
 : x.quantity;
 const isShort = isDone && displayQty < x.quantity;
 return (
 <div key={x.sortbarId} className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border ${
 isDone
 ? isShort
 ? "bg-[var(--state-warning)]/10 border-[var(--state-warning)]/40 opacity-80"
 : "bg-[var(--state-success-container)]/60 border-[var(--state-success)]/30 opacity-70"
 : "bg-[var(--primary)]/10 /10 border-[var(--primary)]/50 dark:border-[var(--primary)]/50"
 }`}>
 {isDone
 ? isShort
 ? <AlertTriangle size={11} className="text-[var(--state-warning)] flex-shrink-0" />
 : <Check size={11} className="text-[var(--state-success)] flex-shrink-0" />
 : <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]  animate-pulse flex-shrink-0" />}
 <span className={`text-sm font-bold ${isDone ? (isShort ? "text-[var(--state-warning)]" : "text-[var(--muted-foreground)]") : "text-[var(--primary)] dark:text-[var(--primary)]"}`}>{x.sortbarName}</span>
 <span className={`text-sm font-bold ${isDone ? (isShort ? "text-[var(--state-on-warning-container)] dark:text-[var(--state-warning)]" : "text-[var(--muted-foreground)]") : "text-[var(--foreground)] "}`}>{displayQty}</span>
 </div>
 );
 })}
 </div>
 </div>
 );
 })()}
 {/* Bin visual — fills remaining space */}
 <div className="flex-1 flex items-center justify-center p-2 min-h-0">
 {horizBinRetrieving ? (
 <div className="text-center">
 <motion.div
 animate={{ rotate: 360 }}
 transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
 className="w-10 h-10 border-4 border-[var(--primary)] dark:border-[var(--primary)] border-t-transparent rounded-full mx-auto mb-3"
 />
 <p className="text-sm font-semibold text-[var(--muted-foreground)]">Retrieving new bin…</p>
 </div>
 ) : selectedItem ? (
 <div className="w-1/2 h-1/2 border-4 border-[var(--border)] dark:border-[var(--border)] rounded-xl overflow-hidden bg-[var(--primary)] flex items-center justify-center">
 <div className="text-center">
 <div className="text-3xl font-mono font-bold text-[var(--foreground)]  leading-none">
 {selectedItem.compartmentLpn ? selectedItem.compartmentLpn.split('-').pop() : selectedItem.binNumber || "BIN"}
 </div>
 <div className="text-sm text-[var(--foreground)]/80 mt-2 font-semibold">Pick from here</div>
 </div>
 </div>
 ) : (
 <div className="text-center">
 <Box size={36} className="text-[var(--foreground)] dark:text-[var(--muted-foreground)] mx-auto mb-2" />
 <p className="text-sm text-[var(--muted-foreground)]">Select an item to begin picking</p>
 </div>
 )}
 </div>

 </div>
 </div>
 );
 })()}
 </div>

 </div>{/* end left column */}

 {/* Right column: Item card full height */}
 <div className="w-1/2 flex-shrink-0 flex flex-col">
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-xl overflow-hidden flex-1 flex flex-col p-2 min-h-0">
 <div className="flex items-center justify-between mb-1 flex-shrink-0">
 <div className="flex items-center gap-2">
 <div className="w-7 h-7 bg-[var(--primary)]/20 /20 rounded-lg flex items-center justify-center flex-shrink-0">
 <Package size={14} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 </div>
 <h2 className="font-semibold text-[var(--foreground)]  text-sm">
 Item {selectedItem ? `(${items.findIndex(i => i.id === selectedItem.id) + 1}/${items.length})` : `(0/${items.length})`}
 </h2>
 </div>
 <div className="flex items-center gap-0.5">
 <button onClick={handleNavigateBack} disabled={currentHistoryIndex <= 0} className="p-1 rounded hover:bg-[var(--surface-container-high)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
 <ChevronLeft size={16} className="text-[var(--foreground)] " />
 </button>
 <button onClick={handleNavigateForward} disabled={currentHistoryIndex >= itemNavigationHistory.length - 1} className="p-1 rounded hover:bg-[var(--surface-container-high)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
 <ChevronRight size={16} className="text-[var(--foreground)] " />
 </button>
 </div>
 </div>
 <div className="overflow-hidden flex-1 min-h-0">
 {horizItemRetrieving ? (
 <div className="h-full flex items-center justify-center">
 <div className="text-center">
 <motion.div
 animate={{ rotate: 360 }}
 transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
 className="w-10 h-10 border-4 border-[var(--primary)] dark:border-[var(--primary)] border-t-transparent rounded-full mx-auto mb-3"
 />
 <p className="text-sm font-semibold text-[var(--muted-foreground)]">Retrieving new item…</p>
 </div>
 </div>
 ) : selectedItem ? (
 <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3 h-full">
 {/* Left: image */}
 {selectedItem.imageUrl && (
 <div className="w-1/2 flex-shrink-0 rounded-xl overflow-hidden flex items-center justify-center">
 <img src={selectedItem.imageUrl} alt={selectedItem.description} className="max-w-full max-h-full object-contain" />
 </div>
 )}
 {/* Right: text details */}
 <div className={`flex flex-col gap-2 justify-center ${selectedItem.imageUrl ? "w-1/2" : "w-full"}`}>
 <div>
 <div className="text-xs text-[var(--muted-foreground)] mb-0.5">SKU</div>
 <div className="font-mono text-xl font-bold text-[var(--foreground)] ">{selectedItem.sku}</div>
 </div>
 <div>
 <div className="text-xs text-[var(--muted-foreground)] mb-0.5">Description</div>
 <div className="text-base text-[var(--foreground)]  leading-snug">{selectedItem.description}</div>
 </div>
 {selectedItem.itemComment && (
 <div className="bg-[var(--state-info-container)] dark:bg-[var(--state-info-container)]/20 border border-[var(--secondary)]/30 dark:border-[var(--secondary-container)]/30 rounded-lg p-2 text-xs text-[var(--state-on-info-container)] dark:text-[var(--state-info)]">{selectedItem.itemComment}</div>
 )}
 </div>
 </motion.div>
 ) : (
 <div className="h-full flex items-center justify-center">
 <div className="text-center">
 <Package size={28} className="text-[var(--foreground)] dark:text-[var(--muted-foreground)] mx-auto mb-2" />
 <p className="text-sm text-[var(--muted-foreground)]">Select an item to begin.</p>
 </div>
 </div>
 )}
 </div>
 </div>
 </div>
 </div>{/* end bottom row */}
 </div>
 )}
 </DndProvider>

 <PickModals
 showSortbarMenu={showSortbarMenu}
 panelView={panelView}
 setPanelView={setPanelView}
 selectedSortbarData={selectedSortbarData}
 currentRegistration={currentRegistration}
 workListDetail={workListDetail}
 workLines={workLines}
 workOperations={workOperations}
 sortbarRegistrations={sortbarRegistrations}
 lpnInput={lpnInput}
 setLpnInput={setLpnInput}
 handleCloseSortbarMenu={handleCloseSortbarMenu}
 handleRegistrationMethodSelect={handleRegistrationMethodSelect}
 handleListSelect={handleListSelect}
 handleLpnSubmit={handleLpnSubmit}
 handleUnregister={handleUnregister}
 handleShowDetails={handleShowDetails}
 handleChangeContainerClick={handleChangeContainerClick}
 showListSelection={showListSelection}
 setShowListSelection={setShowListSelection}
 showLpnInput={showLpnInput}
 setShowLpnInput={setShowLpnInput}
 showCompletionConfirmation={showCompletionConfirmation}
 items={items}
 processedItems={processedItems}
 handleCompleteConfirmation={handleCompleteConfirmation}
 showAdjustInventory={showAdjustInventory}
 adjustInventoryStep={adjustInventoryStep}
 compartmentInventory={compartmentInventory}
 selectedAdjustItem={selectedAdjustItem}
 adjustInventoryDelta={adjustInventoryDelta}
 setAdjustInventoryDelta={setAdjustInventoryDelta}
 adjustInventoryReasonCode={adjustInventoryReasonCode}
 setAdjustInventoryReasonCode={setAdjustInventoryReasonCode}
 handleAdjustInventoryCancel={handleAdjustInventoryCancel}
 handleAdjustItemSelect={handleAdjustItemSelect}
 handleAdjustInventoryBack={handleAdjustInventoryBack}
 handleAdjustQuantityConfirm={handleAdjustQuantityConfirm}
 handleAdjustInventoryFinalConfirm={handleAdjustInventoryFinalConfirm}
 showSkuVerification={showSkuVerification}
 selectedItem={selectedItem}
 skuVerificationInput={skuVerificationInput}
 setSkuVerificationInput={setSkuVerificationInput}
 handleSkuVerificationCancel={handleSkuVerificationCancel}
 handleSkuVerificationSubmit={handleSkuVerificationSubmit}
 showHistory={showHistory}
 setShowHistory={setShowHistory}
 showChangeContainer={showChangeContainer}
 newContainerLpn={newContainerLpn}
 setNewContainerLpn={setNewContainerLpn}
 currentContainerLpn={currentContainerLpn}
 handleChangeContainerCancel={handleChangeContainerCancel}
 handleChangeContainerSubmit={handleChangeContainerSubmit}
 showReasonCodeModal={showReasonCodeModal}
 pendingShortItem={pendingShortItem}
 processedQuantity={processedQuantity}
 reasonCodeInput={reasonCodeInput}
 setReasonCodeInput={setReasonCodeInput}
 handleReasonCodeSubmit={handleReasonCodeSubmit}
 handleReasonCodeCancel={handleReasonCodeCancel}
 showCompartmentEmptyConfirm={showCompartmentEmptyConfirm}
 pendingCompartmentEmpty={pendingCompartmentEmpty}
 handleCompartmentEmptyConfirm={handleCompartmentEmptyConfirm}
 showSwapPrompt={showSwapPrompt}
 originalContainerLpn={originalContainerLpn}
 handleSwapContinue={handleSwapContinue}
 showLegend={showLegend}
 setShowLegend={setShowLegend}
 showNumberPad={showNumberPad}
 quantityInput={quantityInput}
 handleNumberPadCancel={handleNumberPadCancel}
 handleNumberPadInput={handleNumberPadInput}
 handleNumberPadConfirm={handleNumberPadConfirm}
 showAutoRegister={showAutoRegister}
 setShowAutoRegister={setShowAutoRegister}
 autoRegisterStep={autoRegisterStep}
 setAutoRegisterStep={setAutoRegisterStep}
 autoRegisterCount={autoRegisterCount}
 setAutoRegisterCount={setAutoRegisterCount}
 autoRegisterAssignments={autoRegisterAssignments}
 setAutoRegisterAssignments={setAutoRegisterAssignments}
 autoRegisterCurrentIndex={autoRegisterCurrentIndex}
 setAutoRegisterCurrentIndex={setAutoRegisterCurrentIndex}
 autoRegisterLpnInput={autoRegisterLpnInput}
 setAutoRegisterLpnInput={setAutoRegisterLpnInput}
 setSortbarRegistrations={setSortbarRegistrations}
 setActiveSortbar={setActiveSortbar}
 setSelectedSortbar={setSelectedSortbar}
 setItems={setItems}
 setSelectedList={setSelectedList}
 setProcessedItems={setProcessedItems}
 setCurrentContainerLpn={setCurrentContainerLpn}
 setOriginalContainerLpn={setOriginalContainerLpn}
 setCompartmentInventory={setCompartmentInventory}
 setSelectedItem={setSelectedItem}
 setProcessedQuantity={setProcessedQuantity}
 setItemPickStartTime={setItemPickStartTime}
 layoutMode={layoutMode}
 itemBinAssignments={itemBinAssignments}
 setItemBinAssignments={setItemBinAssignments}
 setBinArrivals={setBinArrivals}
 setFlashingSortbar={setFlashingSortbar}
 setPickListStartTime={setPickListStartTime}
 showSingleLpnModal={showSingleLpnModal}
 setShowSingleLpnModal={setShowSingleLpnModal}
 singleLpnInput={singleLpnInput}
 setSingleLpnInput={setSingleLpnInput}
 singleLpnSortbarId={singleLpnSortbarId}
 setSingleLpnSortbarId={setSingleLpnSortbarId}
 singleLpnWorkListId={singleLpnWorkListId}
 setSingleLpnWorkListId={setSingleLpnWorkListId}
 handleSingleLpnSubmit={handleSingleLpnSubmit}
 />

 {/* ── Step 1: Short Pick or Split Container choice ── */}
 {pickChoiceSortbarId && splitStep === null && (() => {
 const crossItem = crossSortbarItems.find(x => x.sortbarId === pickChoiceSortbarId);
 const requested = crossItem?.quantity ?? 0;
 const picked = sortbarAdjustedQtys.get(pickChoiceSortbarId) ?? requested;
 const remaining = requested - picked;
 return (
 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
 onClick={() => setPickChoiceSortbarId(null)}>
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-2xl border-[var(--border)]  w-full max-w-sm mx-4 p-6 flex flex-col gap-5"
 onClick={e => e.stopPropagation()}>
 <div className="flex items-start gap-3">
 <div className="w-10 h-10 rounded-xl bg-[var(--state-warning)]/15 flex items-center justify-center flex-shrink-0">
 <AlertTriangle size={20} className="text-[var(--state-warning)]" />
 </div>
 <div>
 <h3 className="font-semibold text-[var(--foreground)]  text-base">Quantity Reduced</h3>
 <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
 Picking <span className="font-bold text-[var(--foreground)] ">{picked}</span> of <span className="font-bold text-[var(--foreground)] ">{requested}</span> for <span className="font-semibold text-[var(--primary)] dark:text-[var(--primary)]">{crossItem?.sortbarName}</span>. How would you like to proceed?
 </p>
 </div>
 </div>
 <div className="grid grid-cols-2 gap-3">
 <button
 onClick={() => {
 setSplitStep(null);
 setPickChoiceSortbarId(null);
 setShortPickSortbarId(pickChoiceSortbarId);
 }}
 className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-[var(--state-warning)] bg-[var(--state-warning)]/10 hover:bg-[var(--state-warning)]/20 transition-colors text-left"
 >
 <AlertTriangle size={22} className="text-[var(--state-warning)]" />
 <span className="font-bold text-[var(--foreground)]  text-sm">Short Pick</span>
 <span className="text-[11px] text-[var(--muted-foreground)] text-center leading-tight">Picking less than requested — provide a reason</span>
 </button>
 <button
 onClick={() => setSplitStep("lpn")}
 className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-[var(--state-info)] bg-[var(--state-info)]/10 hover:bg-[var(--state-info)]/20 transition-colors text-left"
 >
 <Package size={22} className="text-[var(--state-info)]" />
 <span className="font-bold text-[var(--foreground)]  text-sm">Split Container</span>
 <span className="text-[11px] text-[var(--muted-foreground)] text-center leading-tight">{remaining} remaining in a new container — enter new LPN</span>
 </button>
 </div>
 <button onClick={() => setPickChoiceSortbarId(null)}
 className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] dark:hover:text-[var(--foreground)] transition-colors text-center">
 Cancel
 </button>
 </div>
 </div>
 );
 })()}

 {/* ── Step 2a: Split Container — LPN entry ── */}
 {pickChoiceSortbarId && splitStep === "lpn" && (() => {
 const crossItem = crossSortbarItems.find(x => x.sortbarId === pickChoiceSortbarId);
 const requested = crossItem?.quantity ?? 0;
 const picked = sortbarAdjustedQtys.get(pickChoiceSortbarId) ?? requested;
 const remaining = requested - picked;
 return (
 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
 onClick={() => { setPickChoiceSortbarId(null); setSplitStep(null); }}>
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-2xl border-[var(--border)]  w-full max-w-sm mx-4 p-6 flex flex-col gap-5"
 onClick={e => e.stopPropagation()}>
 <div className="flex items-start gap-3">
 <div className="w-10 h-10 rounded-xl bg-[var(--state-info)]/15 flex items-center justify-center flex-shrink-0">
 <Package size={20} className="text-[var(--state-info)]" />
 </div>
 <div>
 <h3 className="font-semibold text-[var(--foreground)]  text-base">Split Container</h3>
 <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
 Remaining qty: <span className="font-bold text-[var(--state-info)] dark:text-[var(--state-info)]">{remaining}</span>. Scan or enter the LPN of the new container.
 </p>
 </div>
 </div>
 <div>
 <label className="block text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wide mb-2">New Container LPN <span className="text-[var(--state-error)]">*</span></label>
 <input
 type="text"
 value={splitLpnInput}
 onChange={e => setSplitLpnInput(e.target.value.toUpperCase())}
 onKeyDown={e => { if (e.key === "Enter" && splitLpnInput.trim()) e.currentTarget.blur(); }}
 placeholder="e.g. LPN-2024-0042"
 className="w-full px-4 py-3 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-xl text-[var(--foreground)]  font-mono font-bold text-sm placeholder-zinc-400 focus:outline-none focus:border-[var(--state-info)] dark:focus:border-[var(--state-info)]/40 transition-colors"
 autoFocus
 />
 </div>
 <div className="flex gap-3">
 <button onClick={() => { setSplitStep(null); }}
 className="flex-1 px-4 py-3 bg-[var(--surface-container-low)] dark:bg-[var(--card)] hover:bg-[var(--surface-container-high)] text-[var(--foreground)]  rounded-xl font-medium transition-colors text-sm">
 Back
 </button>
 <button
 disabled={!splitLpnInput.trim()}
 onClick={() => {
 const sortbarId = pickChoiceSortbarId!;
 const newLpn = splitLpnInput.trim();
 // Bank the already-picked qty so the final confirm records the full total
 setSplitContainerCredits(prev => {
 const m = new Map(prev);
 m.set(sortbarId, (m.get(sortbarId) ?? 0) + picked);
 return m;
 });
 // Update the sortbar's LPN to the new container
 setSortbarRegistrations(prev => prev.map(reg =>
 reg.sortbarId === sortbarId ? { ...reg, lpn: newLpn } : reg
 ));
 // Set the remaining qty as the new expected amount for this sortbar
 setSplitContainerQtyOverrides(prev => {
 const m = new Map(prev);
 m.set(sortbarId, remaining);
 return m;
 });
 // Reset the adjusted qty so the tile shows `remaining` as the new target
 setSortbarAdjustedQtys(prev => {
 const m = new Map(prev);
 m.delete(sortbarId);
 return m;
 });
 // Close modals and return to pick screen — sortbar stays active
 setPickChoiceSortbarId(null);
 setSplitStep(null);
 setSplitLpnInput("");
 toast.success("Split Container recorded", {
 description: `${newLpn} → ${crossItem?.sortbarName}: ${remaining} remaining to pick`,
 duration: 4000,
 });
 }}
 className="flex-1 px-4 py-3 bg-[var(--state-info)] hover:bg-[var(--state-info)] disabled:opacity-40 disabled:cursor-not-allowed text-[var(--foreground)] rounded-xl font-semibold transition-colors text-sm"
 >
 Confirm Split
 </button>
 </div>
 </div>
 </div>
 );
 })()}

 {/* ── Step 2b: Short Pick — reason code ── */}
 {shortPickSortbarId && (() => {
 const crossItem = crossSortbarItems.find(x => x.sortbarId === shortPickSortbarId);
 const requested = crossItem?.quantity ?? 0;
 const picked = sortbarAdjustedQtys.get(shortPickSortbarId) ?? requested;
 const filtered = SHORT_PICK_REASONS.filter(r => r.toLowerCase().includes(shortPickReasonSearch.toLowerCase()));
 return (
 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
 onClick={() => { setShortPickSortbarId(null); setShortPickReasonDropdownOpen(false); }}>
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-2xl border-[var(--border)]  w-full max-w-sm mx-4 p-6 flex flex-col gap-5"
 onClick={e => e.stopPropagation()}>
 <div className="flex items-start gap-3">
 <div className="w-10 h-10 rounded-xl bg-[var(--state-warning)]/15 flex items-center justify-center flex-shrink-0">
 <AlertTriangle size={20} className="text-[var(--state-warning)]" />
 </div>
 <div>
 <h3 className="font-semibold text-[var(--foreground)]  text-base">Short Pick</h3>
 <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
 Picked <span className="font-bold text-[var(--foreground)] ">{picked}</span> of <span className="font-bold text-[var(--foreground)] ">{requested}</span> for <span className="font-semibold text-[var(--primary)] dark:text-[var(--primary)]">{crossItem?.sortbarName}</span>
 </p>
 </div>
 </div>
 <div>
 <label className="block text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wide mb-2">Reason Code <span className="text-[var(--state-error)]">*</span></label>
 <div className="relative">
 <div className="w-full px-4 py-3 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-xl flex items-center justify-between cursor-pointer hover:border-[var(--border)] dark:hover:border-[var(--border)] transition-colors"
 onClick={() => setShortPickReasonDropdownOpen(o => !o)}>
 <span className={shortPickReasonCode ? "text-[var(--foreground)] text-sm font-medium" : "text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] text-sm"}>
 {shortPickReasonCode || "Select a reason..."}
 </span>
 <ChevronRight size={16} className={`text-[var(--muted-foreground)] transition-transform flex-shrink-0 ${shortPickReasonDropdownOpen ? "rotate-90" : ""}`} />
 </div>
 {shortPickReasonDropdownOpen && (
 <div className="absolute z-10 w-full mt-1 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-xl overflow-hidden">
 <div className="p-2 border-b border-[var(--border)] ">
 <input type="text" value={shortPickReasonSearch}
 onChange={e => setShortPickReasonSearch(e.target.value)}
 placeholder="Search reason codes..."
 className="w-full px-3 py-2 bg-[var(--surface-container-low)] dark:bg-[var(--card)] border border-transparent rounded-lg text-sm text-[var(--foreground)]  placeholder-zinc-400 focus:outline-none focus:border-[var(--border)] dark:focus:border-[var(--border)]"
 autoFocus onClick={e => e.stopPropagation()} />
 </div>
 <div className="max-h-48 overflow-y-auto">
 {filtered.map(opt => (
 <button key={opt}
 onClick={() => { setShortPickReasonCode(opt); setShortPickReasonSearch(""); setShortPickReasonDropdownOpen(false); }}
 className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${shortPickReasonCode === opt ? "bg-[var(--state-warning-container)] dark:bg-[var(--state-warning-container)]/20 text-[var(--state-on-warning-container)] dark:text-[var(--state-warning)] font-medium" : "text-[var(--foreground)] hover:bg-[var(--surface-container-low)] hover:bg-[var(--surface-container-high)]"}`}>
 {opt}
 </button>
 ))}
 {filtered.length === 0 && <div className="px-4 py-3 text-sm text-[var(--muted-foreground)] text-center">No matches found</div>}
 </div>
 </div>
 )}
 </div>
 </div>
 <div className="flex gap-3">
 <button onClick={() => { setShortPickSortbarId(null); setShortPickReasonCode(""); setShortPickReasonSearch(""); setShortPickReasonDropdownOpen(false); }}
 className="flex-1 px-4 py-3 bg-[var(--surface-container-low)] dark:bg-[var(--card)] hover:bg-[var(--surface-container-high)] text-[var(--foreground)]  rounded-xl font-medium transition-colors text-sm">
 Cancel
 </button>
 <button
 disabled={!shortPickReasonCode}
 onClick={() => {
 const id = shortPickSortbarId;
 setShortPickSortbarId(null);
 setShortPickReasonCode("");
 setShortPickReasonSearch("");
 setShortPickReasonDropdownOpen(false);
 doConfirmForSortbar(id);
 }}
 className="flex-1 px-4 py-3 bg-[var(--state-warning)] hover:bg-[var(--state-warning)] disabled:opacity-40 disabled:cursor-not-allowed text-[var(--foreground)] rounded-xl font-semibold transition-colors text-sm">
 Confirm Short Pick
 </button>
 </div>
 </div>
 </div>
 );
 })()}
 </div>
 );
}
