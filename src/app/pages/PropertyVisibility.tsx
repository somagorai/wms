import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
 ChevronRight,
 Eye,
 EyeOff,
 Pin,
 Search,
 RotateCcw,
 Save,
 CheckCircle2,
 AlertCircle,
 GripVertical,
 Home,
} from "lucide-react";
import { useLayout } from "../contexts/LayoutContext";

type ColumnConfig = {
 id: string;
 label: string;
 visible: boolean;
 pinned: boolean;
 order: number;
};

type GridConfig = {
 id: string;
 name: string;
 screen: string;
 category: string;
 columns: ColumnConfig[];
};

// Define all grids in the system with their columns
const defaultGridConfigs: GridConfig[] = [
 {
 id: "worklist-main",
 name: "Work List Table",
 screen: "Work List",
 category: "Operations",
 columns: [
 { id: "workList", label: "Work List", visible: true, pinned: true, order: 0 },
 { id: "type", label: "Type", visible: true, pinned: false, order: 1 },
 { id: "status", label: "Status", visible: true, pinned: false, order: 2 },
 { id: "priority", label: "Priority", visible: true, pinned: false, order: 3 },
 { id: "priorityDateTime", label: "Priority Date Time", visible: true, pinned: false, order: 4 },
 { id: "hot", label: "Hot", visible: true, pinned: false, order: 5 },
 { id: "attribute1", label: "Attribute 1", visible: true, pinned: false, order: 6 },
 { id: "attribute2", label: "Attribute 2", visible: true, pinned: false, order: 7 },
 { id: "attribute3", label: "Attribute 3", visible: true, pinned: false, order: 8 },
 { id: "attribute4", label: "Attribute 4", visible: true, pinned: false, order: 9 },
 { id: "attribute5", label: "Attribute 5", visible: true, pinned: false, order: 10 },
 { id: "subType", label: "Sub Type", visible: true, pinned: false, order: 11 },
 { id: "started", label: "Started", visible: true, pinned: false, order: 12 },
 { id: "storage", label: "Storage", visible: true, pinned: false, order: 13 },
 { id: "destination", label: "Destination", visible: true, pinned: false, order: 14 },
 { id: "created", label: "Created", visible: true, pinned: false, order: 15 },
 { id: "modified", label: "Modified", visible: true, pinned: false, order: 16 },
 ],
 },
 {
 id: "worklist-lines",
 name: "Work Lines Table",
 screen: "Work List Detail",
 category: "Operations",
 columns: [
 { id: "workLine", label: "Work Line", visible: true, pinned: true, order: 0 },
 { id: "priority", label: "Priority", visible: true, pinned: false, order: 1 },
 { id: "item", label: "Item", visible: true, pinned: false, order: 2 },
 { id: "quantity", label: "Quantity", visible: true, pinned: false, order: 3 },
 { id: "status", label: "Status", visible: true, pinned: false, order: 4 },
 { id: "started", label: "Started", visible: true, pinned: false, order: 5 },
 { id: "comment", label: "Comment", visible: true, pinned: false, order: 6 },
 ],
 },
 {
 id: "worklist-operations",
 name: "Work Operations Table",
 screen: "Work List Detail",
 category: "Operations",
 columns: [
 { id: "workOperation", label: "Work Operation", visible: true, pinned: true, order: 0 },
 { id: "type", label: "Type", visible: true, pinned: false, order: 1 },
 { id: "destinationLocation", label: "Destination", visible: true, pinned: false, order: 2 },
 { id: "sourceLocation", label: "Source", visible: true, pinned: false, order: 3 },
 { id: "status", label: "Status", visible: true, pinned: false, order: 4 },
 { id: "started", label: "Started", visible: true, pinned: false, order: 5 },
 { id: "comment", label: "Comment", visible: true, pinned: false, order: 6 },
 ],
 },
 {
 id: "dashboard-worklists",
 name: "Work Lists Grid",
 screen: "Operations Dashboard",
 category: "Business Insights",
 columns: [
 { id: "type", label: "Type", visible: true, pinned: true, order: 0 },
 { id: "warning", label: "Warning", visible: true, pinned: false, order: 1 },
 { id: "inProgress", label: "In Progress", visible: true, pinned: false, order: 2 },
 { id: "queued", label: "Queued", visible: true, pinned: false, order: 3 },
 { id: "completed", label: "Completed", visible: true, pinned: false, order: 4 },
 { id: "shorted", label: "Shorted", visible: true, pinned: false, order: 5 },
 { id: "total", label: "Total", visible: true, pinned: false, order: 6 },
 ],
 },
 {
 id: "mhe-equipment",
 name: "Equipment Table",
 screen: "MHE Dashboard",
 category: "Business Insights",
 columns: [
 { id: "id", label: "Equipment ID", visible: true, pinned: true, order: 0 },
 { id: "type", label: "Type", visible: true, pinned: false, order: 1 },
 { id: "status", label: "Status", visible: true, pinned: false, order: 2 },
 { id: "zone", label: "Zone", visible: true, pinned: false, order: 3 },
 { id: "lastMaintenance", label: "Last Maintenance", visible: true, pinned: false, order: 4 },
 { id: "nextMaintenance", label: "Next Maintenance", visible: true, pinned: false, order: 5 },
 { id: "hoursOperated", label: "Hours Operated", visible: true, pinned: false, order: 6 },
 { id: "efficiency", label: "Efficiency", visible: true, pinned: false, order: 7 },
 { id: "actions", label: "Actions", visible: true, pinned: false, order: 8 },
 ],
 },
 {
 id: "worklist-workstations",
 name: "Workstations Table",
 screen: "Work List Workstations",
 category: "Operations",
 columns: [
 { id: "id", label: "Workstation ID", visible: true, pinned: true, order: 0 },
 ],
 },
 {
 id: "worklist-sortbars",
 name: "Sortbars Table",
 screen: "Work List Workstations",
 category: "Operations",
 columns: [
 { id: "id", label: "Sortbar ID", visible: true, pinned: true, order: 0 },
 { id: "workstationId", label: "Workstation", visible: true, pinned: false, order: 1 },
 { id: "status", label: "Status", visible: true, pinned: false, order: 2 },
 { id: "container", label: "Container", visible: true, pinned: false, order: 3 },
 { id: "registrationSequence", label: "Registration Sequence", visible: true, pinned: false, order: 4 },
 { id: "trailerType", label: "Trailer Type", visible: true, pinned: false, order: 5 },
 ],
 },
 {
 id: "storage-locations",
 name: "Storage Locations Table",
 screen: "Storage Locations",
 category: "Operations",
 columns: [
 { id: "name", label: "Name", visible: true, pinned: true, order: 0 },
 { id: "parentStorage", label: "Parent Storage", visible: true, pinned: false, order: 1 },
 { id: "status", label: "Status", visible: true, pinned: false, order: 2 },
 { id: "type", label: "Type", visible: true, pinned: false, order: 3 },
 { id: "attribute1", label: "Attribute 1", visible: true, pinned: false, order: 4 },
 { id: "attribute2", label: "Attribute 2", visible: true, pinned: false, order: 5 },
 { id: "attribute3", label: "Attribute 3", visible: true, pinned: false, order: 6 },
 { id: "attribute4", label: "Attribute 4", visible: true, pinned: false, order: 7 },
 { id: "attribute5", label: "Attribute 5", visible: true, pinned: false, order: 8 },
 { id: "created", label: "Created", visible: true, pinned: false, order: 9 },
 { id: "createdBy", label: "Created By", visible: true, pinned: false, order: 10 },
 ],
 },
 {
 id: "storage-location-allocation",
 name: "Storage Location Allocation",
 screen: "Storage Locations Detail",
 category: "Operations",
 columns: [
 { id: "workList", label: "Work List", visible: true, pinned: false, order: 0 },
 { id: "workLine", label: "Work Line", visible: true, pinned: false, order: 1 },
 { id: "workOperation", label: "Work Operation", visible: true, pinned: false, order: 2 },
 { id: "status", label: "Status", visible: true, pinned: false, order: 3 },
 { id: "created", label: "Created", visible: true, pinned: false, order: 4 },
 { id: "createdBy", label: "Created By", visible: true, pinned: false, order: 5 },
 { id: "completed", label: "Completed", visible: true, pinned: false, order: 6 },
 ],
 },
 {
 id: "items",
 name: "Items Table",
 screen: "Items",
 category: "Operations",
 columns: [
 { id: "item", label: "Item", visible: true, pinned: true, order: 0 },
 { id: "description", label: "Description", visible: true, pinned: false, order: 1 },
 { id: "itemClass", label: "Item Class", visible: true, pinned: false, order: 2 },
 { id: "handlingCode", label: "Handling Code", visible: true, pinned: false, order: 3 },
 { id: "dimensionUnits", label: "Dimension Units", visible: true, pinned: false, order: 4 },
 { id: "length", label: "Length", visible: true, pinned: false, order: 5 },
 { id: "width", label: "Width", visible: true, pinned: false, order: 6 },
 { id: "height", label: "Height", visible: true, pinned: false, order: 7 },
 { id: "weightUnits", label: "Weight Units", visible: true, pinned: false, order: 8 },
 { id: "weight", label: "Weight", visible: true, pinned: false, order: 9 },
 { id: "replenWindow", label: "Replen Window", visible: true, pinned: false, order: 10 },
 { id: "imageUrl", label: "Image URL", visible: true, pinned: false, order: 11 },
 { id: "attribute1", label: "Attribute 1", visible: true, pinned: false, order: 12 },
 { id: "attribute2", label: "Attribute 2", visible: true, pinned: false, order: 13 },
 { id: "attribute3", label: "Attribute 3", visible: true, pinned: false, order: 14 },
 { id: "attribute4", label: "Attribute 4", visible: true, pinned: false, order: 15 },
 { id: "attribute5", label: "Attribute 5", visible: true, pinned: false, order: 16 },
 { id: "fifoTracking", label: "FIFO Tracking", visible: true, pinned: false, order: 17 },
 { id: "expiryDateControlled", label: "Expiry Date Controlled", visible: true, pinned: false, order: 18 },
 { id: "comment", label: "Comment", visible: true, pinned: false, order: 19 },
 { id: "created", label: "Created", visible: true, pinned: false, order: 20 },
 { id: "createdBy", label: "Created By", visible: true, pinned: false, order: 21 },
 { id: "modified", label: "Modified", visible: true, pinned: false, order: 22 },
 { id: "modifiedBy", label: "Modified By", visible: true, pinned: false, order: 23 },
 ],
 },
 {
 id: "inventory",
 name: "Inventory Table",
 screen: "Items Detail",
 category: "Operations",
 columns: [
 { id: "storageLocation", label: "Storage Location", visible: true, pinned: false, order: 0 },
 { id: "quantity", label: "Quantity", visible: true, pinned: false, order: 1 },
 { id: "status", label: "Status", visible: true, pinned: false, order: 2 },
 { id: "parentStorage", label: "Parent Storage", visible: true, pinned: false, order: 3 },
 { id: "fifoDate", label: "FIFO Date", visible: true, pinned: false, order: 4 },
 { id: "attribute1", label: "Attribute 1", visible: true, pinned: false, order: 5 },
 { id: "attribute2", label: "Attribute 2", visible: true, pinned: false, order: 6 },
 { id: "attribute3", label: "Attribute 3", visible: true, pinned: false, order: 7 },
 { id: "attribute4", label: "Attribute 4", visible: true, pinned: false, order: 8 },
 { id: "attribute5", label: "Attribute 5", visible: true, pinned: false, order: 9 },
 { id: "created", label: "Created", visible: true, pinned: false, order: 10 },
 { id: "createdBy", label: "Created By", visible: true, pinned: false, order: 11 },
 { id: "modified", label: "Modified", visible: true, pinned: false, order: 12 },
 { id: "modifiedBy", label: "Modified By", visible: true, pinned: false, order: 13 },
 ],
 },
 {
 id: "user-management",
 name: "User Management Table",
 screen: "User Management",
 category: "System",
 columns: [
 { id: "username", label: "Username", visible: true, pinned: true, order: 0 },
 { id: "firstName", label: "First Name", visible: true, pinned: true, order: 1 },
 { id: "lastName", label: "Last Name", visible: true, pinned: true, order: 2 },
 { id: "status", label: "Status", visible: true, pinned: false, order: 3 },
 { id: "email", label: "Email", visible: true, pinned: false, order: 4 },
 { id: "localization", label: "Localization", visible: true, pinned: false, order: 5 },
 { id: "theme", label: "Theme", visible: true, pinned: false, order: 6 },
 { id: "created", label: "Created", visible: true, pinned: false, order: 7 },
 { id: "createdBy", label: "Created By", visible: true, pinned: false, order: 8 },
 { id: "modified", label: "Modified", visible: true, pinned: false, order: 9 },
 { id: "modifiedBy", label: "Modified By", visible: true, pinned: false, order: 10 },
 ],
 },
 {
 id: "group-management",
 name: "Group Management Table",
 screen: "Group Management",
 category: "System",
 columns: [
 { id: "name", label: "Name", visible: true, pinned: false, order: 0 },
 { id: "description", label: "Description", visible: true, pinned: false, order: 1 },
 { id: "users", label: "Users", visible: true, pinned: false, order: 2 },
 { id: "authorizations", label: "Authorizations", visible: true, pinned: false, order: 3 },
 { id: "created", label: "Created", visible: true, pinned: false, order: 4 },
 { id: "createdBy", label: "Created By", visible: true, pinned: false, order: 5 },
 { id: "modified", label: "Modified", visible: true, pinned: false, order: 6 },
 { id: "modifiedBy", label: "Modified By", visible: true, pinned: false, order: 7 },
 ],
 },
];

interface DraggableColumnRowProps {
 column: ColumnConfig;
 index: number;
 gridId: string;
 moveColumn: (gridId: string, dragIndex: number, hoverIndex: number) => void;
 toggleColumnVisibility: (gridId: string, columnId: string) => void;
 toggleColumnPin: (gridId: string, columnId: string) => void;
}

const DraggableColumnRow = ({
 column,
 index,
 gridId,
 moveColumn,
 toggleColumnVisibility,
 toggleColumnPin,
}: DraggableColumnRowProps) => {
 const ref = useRef<HTMLDivElement>(null);

 const [{ handlerId }, drop] = useDrop({
 accept: 'column',
 collect(monitor) {
 return {
 handlerId: monitor.getHandlerId(),
 };
 },
 hover(item: { index: number }, monitor) {
 if (!ref.current) {
 return;
 }
 const dragIndex = item.index;
 const hoverIndex = index;

 if (dragIndex === hoverIndex) {
 return;
 }

 const hoverBoundingRect = ref.current.getBoundingClientRect();
 const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
 const clientOffset = monitor.getClientOffset();
 const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

 if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
 return;
 }
 if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
 return;
 }

 moveColumn(gridId, dragIndex, hoverIndex);
 item.index = hoverIndex;
 },
 });

 const [{ isDragging }, drag, preview] = useDrag({
 type: 'column',
 item: () => {
 return { id: column.id, index };
 },
 collect: (monitor) => ({
 isDragging: monitor.isDragging(),
 }),
 });

 preview(drop(ref));

 return (
 <div
 ref={ref}
 data-handler-id={handlerId}
 className={`grid grid-cols-12 gap-4 items-center p-4 rounded-lg border-2 transition-all ${
 column.visible
 ? "bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)] "
 : "bg-[var(--surface-container-high)] text-[var(--foreground)] border-[var(--border)]  opacity-60"
 } ${isDragging ? "opacity-50" : ""}`}
 >
 {/* Drag Handle + Column Name */}
 <div className="col-span-5 flex items-center gap-3">
 <div
 ref={drag}
 className="cursor-move text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
 >
 <GripVertical size={20} />
 </div>
 <div className="w-8 h-8 bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] rounded flex items-center justify-center text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] font-mono">
 {index + 1}
 </div>
 <div>
 <p className="font-semibold text-[var(--foreground)] ">{column.label}</p>
 <p className="text-xs text-[var(--muted-foreground)] font-mono">{column.id}</p>
 </div>
 </div>

 {/* Visibility Toggle */}
 <div className="col-span-3 flex justify-center">
 <button
 onClick={() => toggleColumnVisibility(gridId, column.id)}
 className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium ${
 column.visible
 ? "bg-[var(--primary)] text-black hover:bg-[var(--brand-accent-light)]"
 : "bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] text-[var(--muted-foreground)] hover:bg-[var(--surface-container-high)]"
 }`}
 >
 {column.visible ? (
 <>
 <Eye size={16} />
 <span>Visible</span>
 </>
 ) : (
 <>
 <EyeOff size={16} />
 <span>Hidden</span>
 </>
 )}
 </button>
 </div>

 {/* Pin Toggle */}
 <div className="col-span-3 flex justify-center">
 <button
 onClick={() => toggleColumnPin(gridId, column.id)}
 disabled={!column.visible}
 className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium ${
 !column.visible
 ? "bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] text-[var(--muted-foreground)] cursor-not-allowed"
 : column.pinned
 ? "bg-[var(--primary)] text-black hover:bg-[var(--brand-accent-light)]"
 : "bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] text-[var(--muted-foreground)] hover:bg-[var(--surface-container-high)]"
 }`}
 >
 <Pin
 size={16}
 className={column.pinned ? "fill-current" : ""}
 />
 <span>{column.pinned ? "Pinned" : "Pin"}</span>
 </button>
 </div>

 {/* Status Indicator */}
 <div className="col-span-1 flex justify-end">
 {column.pinned && (
 <div className="w-2 h-2 bg-[var(--primary)] rounded-full"></div>
 )}
 </div>
 </div>
 );
};

export function PropertyVisibility() {
 const [gridConfigs, setGridConfigs] = useState<GridConfig[]>(defaultGridConfigs);
 const [selectedGrid, setSelectedGrid] = useState<string | null>(null);
 const [searchTerm, setSearchTerm] = useState("");
 const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
 const [showSaveSuccess, setShowSaveSuccess] = useState(false);
 const [selectedCategory, setSelectedCategory] = useState<string>("all");
 
 // Get layout context for syncing with Work List
 const { workListHiddenColumns, setWorkListHiddenColumns, workListPinnedColumns, setWorkListPinnedColumns, storageLocationsHiddenColumns, setStorageLocationsHiddenColumns, storageLocationsPinnedColumns, setStorageLocationsPinnedColumns, storageLocationAllocationHiddenColumns, setStorageLocationAllocationHiddenColumns, storageLocationAllocationPinnedColumns, setStorageLocationAllocationPinnedColumns, itemsHiddenColumns, setItemsHiddenColumns, itemsPinnedColumns, setItemsPinnedColumns, inventoryHiddenColumns, setInventoryHiddenColumns, inventoryPinnedColumns, setInventoryPinnedColumns, userManagementHiddenColumns, setUserManagementHiddenColumns, userManagementPinnedColumns, setUserManagementPinnedColumns, groupManagementHiddenColumns, setGroupManagementHiddenColumns, groupManagementPinnedColumns, setGroupManagementPinnedColumns } = useLayout() as any;

 // Load saved configurations from localStorage
 useEffect(() => {
 const savedConfigs = localStorage.getItem("propertyVisibilityConfigs");
 if (savedConfigs) {
 try {
 setGridConfigs(JSON.parse(savedConfigs));
 } catch (error) {
 console.error("Error loading saved configurations:", error);
 }
 }
 }, []);
 
 // Sync Work List grid with context on mount and when context changes
 useEffect(() => {
 setGridConfigs(prevConfigs =>
 prevConfigs.map(grid => {
 if (grid.id === "worklist-main") {
 return {
 ...grid,
 columns: grid.columns.map(col => ({
 ...col,
 visible: !workListHiddenColumns.includes(col.id),
 pinned: workListPinnedColumns.includes(col.id)
 }))
 };
 }
 return grid;
 })
 );
 }, [workListHiddenColumns, workListPinnedColumns]);

 // Sync Storage Locations grid with context on mount and when context changes
 useEffect(() => {
 setGridConfigs(prevConfigs =>
 prevConfigs.map(grid => {
 if (grid.id === "storage-locations") {
 return {
 ...grid,
 columns: grid.columns.map(col => ({
 ...col,
 visible: !storageLocationsHiddenColumns.includes(col.id),
 pinned: storageLocationsPinnedColumns.includes(col.id)
 }))
 };
 }
 return grid;
 })
 );
 }, [storageLocationsHiddenColumns, storageLocationsPinnedColumns]);

 // Sync Storage Location Allocation grid with context on mount and when context changes
 useEffect(() => {
 setGridConfigs(prevConfigs =>
 prevConfigs.map(grid => {
 if (grid.id === "storage-location-allocation") {
 return {
 ...grid,
 columns: grid.columns.map(col => ({
 ...col,
 visible: !storageLocationAllocationHiddenColumns.includes(col.id),
 pinned: storageLocationAllocationPinnedColumns.includes(col.id)
 }))
 };
 }
 return grid;
 })
 );
 }, [storageLocationAllocationHiddenColumns, storageLocationAllocationPinnedColumns]);

 // Sync Items grid with context on mount and when context changes
 useEffect(() => {
 setGridConfigs(prevConfigs =>
 prevConfigs.map(grid => {
 if (grid.id === "items") {
 return {
 ...grid,
 columns: grid.columns.map(col => ({
 ...col,
 visible: !itemsHiddenColumns.includes(col.id),
 pinned: itemsPinnedColumns.includes(col.id)
 }))
 };
 }
 return grid;
 })
 );
 }, [itemsHiddenColumns, itemsPinnedColumns]);

 // Sync Inventory grid with context on mount and when context changes
 useEffect(() => {
 setGridConfigs(prevConfigs =>
 prevConfigs.map(grid => {
 if (grid.id === "inventory") {
 return {
 ...grid,
 columns: grid.columns.map(col => ({
 ...col,
 visible: !inventoryHiddenColumns.includes(col.id),
 pinned: inventoryPinnedColumns.includes(col.id)
 }))
 };
 }
 return grid;
 })
 );
 }, [inventoryHiddenColumns, inventoryPinnedColumns]);

 // Sync User Management grid with context on mount and when context changes
 useEffect(() => {
 setGridConfigs(prevConfigs =>
 prevConfigs.map(grid => {
 if (grid.id === "user-management") {
 return {
 ...grid,
 columns: grid.columns.map(col => ({
 ...col,
 visible: !userManagementHiddenColumns.includes(col.id),
 pinned: userManagementPinnedColumns.includes(col.id)
 }))
 };
 }
 return grid;
 })
 );
 }, [userManagementHiddenColumns, userManagementPinnedColumns]);

 // Sync Group Management grid with context on mount and when context changes
 useEffect(() => {
 setGridConfigs(prevConfigs =>
 prevConfigs.map(grid => {
 if (grid.id === "group-management") {
 return {
 ...grid,
 columns: grid.columns.map(col => ({
 ...col,
 visible: !groupManagementHiddenColumns.includes(col.id),
 pinned: groupManagementPinnedColumns.includes(col.id)
 }))
 };
 }
 return grid;
 })
 );
 }, [groupManagementHiddenColumns, groupManagementPinnedColumns]);

 // Get unique categories
 const categories = ["all", ...Array.from(new Set(gridConfigs.map(g => g.category)))];

 // Filter grids based on search and category
 const filteredGrids = gridConfigs.filter(grid => {
 const matchesSearch = grid.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
 grid.screen.toLowerCase().includes(searchTerm.toLowerCase());
 const matchesCategory = selectedCategory === "all" || grid.category === selectedCategory;
 return matchesSearch && matchesCategory;
 });

 const selectedGridConfig = gridConfigs.find(g => g.id === selectedGrid);

 const toggleColumnVisibility = (gridId: string, columnId: string) => {
 setGridConfigs(prevConfigs =>
 prevConfigs.map(grid =>
 grid.id === gridId
 ? {
 ...grid,
 columns: grid.columns.map(col =>
 col.id === columnId ? { ...col, visible: !col.visible } : col
 ),
 }
 : grid
 )
 );
 
 // Sync with context for Work List grid
 if (gridId === "worklist-main") {
 const grid = gridConfigs.find(g => g.id === gridId);
 const column = grid?.columns.find(c => c.id === columnId);
 if (column) {
 if (column.visible) {
 // Currently visible, so hide it
 setWorkListHiddenColumns([...workListHiddenColumns, columnId]);
 } else {
 // Currently hidden, so show it
 setWorkListHiddenColumns(workListHiddenColumns.filter(c => c !== columnId));
 }
 }
 }
 
 // Sync with context for Storage Locations grid
 if (gridId === "storage-locations") {
 const grid = gridConfigs.find(g => g.id === gridId);
 const column = grid?.columns.find(c => c.id === columnId);
 if (column) {
 if (column.visible) {
 // Currently visible, so hide it
 setStorageLocationsHiddenColumns([...storageLocationsHiddenColumns, columnId]);
 } else {
 // Currently hidden, so show it
 setStorageLocationsHiddenColumns(storageLocationsHiddenColumns.filter(c => c !== columnId));
 }
 }
 }
 
 // Sync with context for Storage Location Allocation grid
 if (gridId === "storage-location-allocation") {
 const grid = gridConfigs.find(g => g.id === gridId);
 const column = grid?.columns.find(c => c.id === columnId);
 if (column) {
 if (column.visible) {
 // Currently visible, so hide it
 setStorageLocationAllocationHiddenColumns([...storageLocationAllocationHiddenColumns, columnId]);
 } else {
 // Currently hidden, so show it
 setStorageLocationAllocationHiddenColumns(storageLocationAllocationHiddenColumns.filter(c => c !== columnId));
 }
 }
 }
 
 // Sync with context for Items grid
 if (gridId === "items") {
 const grid = gridConfigs.find(g => g.id === gridId);
 const column = grid?.columns.find(c => c.id === columnId);
 if (column) {
 if (column.visible) {
 // Currently visible, so hide it
 setItemsHiddenColumns([...itemsHiddenColumns, columnId]);
 } else {
 // Currently hidden, so show it
 setItemsHiddenColumns(itemsHiddenColumns.filter(c => c !== columnId));
 }
 }
 }
 
 // Sync with context for Inventory grid
 if (gridId === "inventory") {
 const grid = gridConfigs.find(g => g.id === gridId);
 const column = grid?.columns.find(c => c.id === columnId);
 if (column) {
 if (column.visible) {
 // Currently visible, so hide it
 setInventoryHiddenColumns([...inventoryHiddenColumns, columnId]);
 } else {
 // Currently hidden, so show it
 setInventoryHiddenColumns(inventoryHiddenColumns.filter(c => c !== columnId));
 }
 }
 }
 
 // Sync with context for User Management grid
 if (gridId === "user-management") {
 const grid = gridConfigs.find(g => g.id === gridId);
 const column = grid?.columns.find(c => c.id === columnId);
 if (column) {
 if (column.visible) {
 // Currently visible, so hide it
 setUserManagementHiddenColumns([...userManagementHiddenColumns, columnId]);
 } else {
 // Currently hidden, so show it
 setUserManagementHiddenColumns(userManagementHiddenColumns.filter(c => c !== columnId));
 }
 }
 }
 
 // Sync with context for Group Management grid
 if (gridId === "group-management") {
 const grid = gridConfigs.find(g => g.id === gridId);
 const column = grid?.columns.find(c => c.id === columnId);
 if (column) {
 if (column.visible) {
 // Currently visible, so hide it
 setGroupManagementHiddenColumns([...groupManagementHiddenColumns, columnId]);
 } else {
 // Currently hidden, so show it
 setGroupManagementHiddenColumns(groupManagementHiddenColumns.filter(c => c !== columnId));
 }
 }
 }
 
 setHasUnsavedChanges(true);
 };

 const toggleColumnPin = (gridId: string, columnId: string) => {
 setGridConfigs(prevConfigs =>
 prevConfigs.map(grid =>
 grid.id === gridId
 ? {
 ...grid,
 columns: grid.columns.map(col =>
 col.id === columnId ? { ...col, pinned: !col.pinned } : col
 ),
 }
 : grid
 )
 );
 
 // Sync with context for Work List grid
 if (gridId === "worklist-main") {
 const grid = gridConfigs.find(g => g.id === gridId);
 const column = grid?.columns.find(c => c.id === columnId);
 if (column) {
 if (column.pinned) {
 // Currently pinned, so unpin it
 setWorkListPinnedColumns(workListPinnedColumns.filter(c => c !== columnId));
 } else {
 // Currently unpinned, so pin it
 setWorkListPinnedColumns([...workListPinnedColumns, columnId]);
 }
 }
 }
 
 // Sync with context for Storage Locations grid
 if (gridId === "storage-locations") {
 const grid = gridConfigs.find(g => g.id === gridId);
 const column = grid?.columns.find(c => c.id === columnId);
 if (column) {
 if (column.pinned) {
 // Currently pinned, so unpin it
 setStorageLocationsPinnedColumns(storageLocationsPinnedColumns.filter(c => c !== columnId));
 } else {
 // Currently unpinned, so pin it
 setStorageLocationsPinnedColumns([...storageLocationsPinnedColumns, columnId]);
 }
 }
 }
 
 // Sync with context for Storage Location Allocation grid
 if (gridId === "storage-location-allocation") {
 const grid = gridConfigs.find(g => g.id === gridId);
 const column = grid?.columns.find(c => c.id === columnId);
 if (column) {
 if (column.pinned) {
 // Currently pinned, so unpin it
 setStorageLocationAllocationPinnedColumns(storageLocationAllocationPinnedColumns.filter(c => c !== columnId));
 } else {
 // Currently unpinned, so pin it
 setStorageLocationAllocationPinnedColumns([...storageLocationAllocationPinnedColumns, columnId]);
 }
 }
 }
 
 // Sync with context for Items grid
 if (gridId === "items") {
 const grid = gridConfigs.find(g => g.id === gridId);
 const column = grid?.columns.find(c => c.id === columnId);
 if (column) {
 if (column.pinned) {
 // Currently pinned, so unpin it
 setItemsPinnedColumns(itemsPinnedColumns.filter(c => c !== columnId));
 } else {
 // Currently unpinned, so pin it
 setItemsPinnedColumns([...itemsPinnedColumns, columnId]);
 }
 }
 }
 
 // Sync with context for Inventory grid
 if (gridId === "inventory") {
 const grid = gridConfigs.find(g => g.id === gridId);
 const column = grid?.columns.find(c => c.id === columnId);
 if (column) {
 if (column.pinned) {
 // Currently pinned, so unpin it
 setInventoryPinnedColumns(inventoryPinnedColumns.filter(c => c !== columnId));
 } else {
 // Currently unpinned, so pin it
 setInventoryPinnedColumns([...inventoryPinnedColumns, columnId]);
 }
 }
 }
 
 // Sync with context for User Management grid
 if (gridId === "user-management") {
 const grid = gridConfigs.find(g => g.id === gridId);
 const column = grid?.columns.find(c => c.id === columnId);
 if (column) {
 if (column.pinned) {
 // Currently pinned, so unpin it
 setUserManagementPinnedColumns(userManagementPinnedColumns.filter(c => c !== columnId));
 } else {
 // Currently unpinned, so pin it
 setUserManagementPinnedColumns([...userManagementPinnedColumns, columnId]);
 }
 }
 }
 
 // Sync with context for Group Management grid
 if (gridId === "group-management") {
 const grid = gridConfigs.find(g => g.id === gridId);
 const column = grid?.columns.find(c => c.id === columnId);
 if (column) {
 if (column.pinned) {
 // Currently pinned, so unpin it
 setGroupManagementPinnedColumns(groupManagementPinnedColumns.filter(c => c !== columnId));
 } else {
 // Currently unpinned, so pin it
 setGroupManagementPinnedColumns([...groupManagementPinnedColumns, columnId]);
 }
 }
 }
 
 setHasUnsavedChanges(true);
 };

 const resetToDefaults = (gridId: string) => {
 const defaultConfig = defaultGridConfigs.find(g => g.id === gridId);
 if (defaultConfig) {
 setGridConfigs(prevConfigs =>
 prevConfigs.map(grid => (grid.id === gridId ? { ...defaultConfig } : grid))
 );
 setHasUnsavedChanges(true);
 }
 };

 const saveConfigurations = () => {
 localStorage.setItem("propertyVisibilityConfigs", JSON.stringify(gridConfigs));
 setHasUnsavedChanges(false);
 setShowSaveSuccess(true);
 setTimeout(() => setShowSaveSuccess(false), 3000);
 };

 const getVisibleColumnsCount = (grid: GridConfig) => {
 return grid.columns.filter(col => col.visible).length;
 };

 const getPinnedColumnsCount = (grid: GridConfig) => {
 return grid.columns.filter(col => col.pinned).length;
 };

 const moveColumn = (gridId: string, dragIndex: number, hoverIndex: number) => {
 setGridConfigs(prevConfigs =>
 prevConfigs.map(grid => {
 if (grid.id !== gridId) return grid;
 
 const sortedColumns = [...grid.columns].sort((a, b) => a.order - b.order);
 const dragColumn = sortedColumns[dragIndex];
 const newColumns = [...sortedColumns];
 newColumns.splice(dragIndex, 1);
 newColumns.splice(hoverIndex, 0, dragColumn);
 
 // Update order for all columns
 return {
 ...grid,
 columns: newColumns.map((col, index) => ({ ...col, order: index })),
 };
 })
 );
 setHasUnsavedChanges(true);
 };

 return (
 <DndProvider backend={HTML5Backend}>
 <div className="flex flex-col min-h-screen">
 {/* Sticky Header */}
 <div className="sticky top-0 z-40 bg-[var(--background)]/95 backdrop-blur-md text-[var(--foreground)] border-b border-[var(--border)] px-8 pt-6 pb-4">
 <div className="flex items-center justify-between gap-4">
 <nav className="flex items-center gap-2 text-sm">
 <Link to="/app/home" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] dark:hover:text-[var(--primary)] transition-colors flex items-center gap-1">
 <Home size={14} />Home
 </Link>
 <ChevronRight size={14} className="text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]" />
 <Link to="/app/navigation?section=system" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] dark:hover:text-[var(--primary)] transition-colors">
 System
 </Link>
 <ChevronRight size={14} className="text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]" />
 <span className="text-[var(--foreground)]  font-semibold text-lg flex items-center gap-2">
 <Eye size={20} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 Property Visibility
 </span>
 </nav>
 <div className="flex items-center gap-3">
 {hasUnsavedChanges && (
 <div className="flex items-center gap-2 text-[var(--state-warning)] bg-[var(--state-warning)]/10 border border-[var(--state-warning)]/40/20 px-4 py-2 rounded-lg">
 <AlertCircle size={18} />
 <span className="text-sm font-medium">Unsaved Changes</span>
 </div>
 )}
 {showSaveSuccess && (
 <div className="flex items-center gap-2 text-[var(--primary)] bg-[var(--primary)]/10 border border-[var(--primary)]/20 px-4 py-2 rounded-lg animate-in fade-in duration-200">
 <CheckCircle2 size={18} />
 <span className="text-sm font-medium">Saved Successfully</span>
 </div>
 )}
 <button
 onClick={saveConfigurations}
 disabled={!hasUnsavedChanges}
 className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
 hasUnsavedChanges
 ? "bg-[var(--primary)] hover:bg-[var(--brand-accent-light)] text-black font-medium"
 : "bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] text-[var(--muted-foreground)] cursor-not-allowed"
 }`}
 >
 <Save size={18} />
 Save Changes
 </button>
 </div>
 </div>
 </div>

 <div className="flex-1 overflow-y-auto p-8">
 <div className="grid grid-cols-12 gap-6">
 {/* Left Panel - Grid Selection */}
 <div className="col-span-4 bg-[var(--surface-container-high)] text-[var(--foreground)] border-[var(--border)]  rounded-lg p-6">
 <div className="mb-4">
 <h3 className="text-lg font-semibold text-[var(--foreground)]  mb-4">Select Grid</h3>
 
 {/* Search */}
 <div className="relative mb-4">
 <Search
 size={18}
 className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]"
 />
 <input
 type="text"
 placeholder="Search grids..."
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 className="w-full pl-10 pr-4 py-2 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg text-[var(--foreground)] placeholder-zinc-500 focus:outline-none focus: focus:)] focus:border-transparent"
 />
 </div>

 {/* Category Filter */}
 <div className="flex gap-2 mb-4 flex-wrap">
 {categories.map(category => (
 <button
 key={category}
 onClick={() => setSelectedCategory(category)}
 className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
 selectedCategory === category
 ? "bg-[var(--primary)] text-black"
 : "bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] hover:text-[var(--foreground)]"
 }`}
 >
 {category === "all" ? "All" : category}
 </button>
 ))}
 </div>
 </div>

 {/* Grid List */}
 <div className="space-y-2">
 {filteredGrids.length === 0 ? (
 <div className="text-center py-8 text-[var(--muted-foreground)]">
 <Search size={32} className="mx-auto mb-2 opacity-50" />
 <p>No grids found</p>
 </div>
 ) : (
 filteredGrids.map((grid) => (
 <button
 key={grid.id}
 onClick={() => setSelectedGrid(grid.id)}
 className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
 selectedGrid === grid.id
 ? "bg-[var(--primary)]/10 border-[var(--primary)] "
 : "bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  hover:border-[var(--border)] hover:bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)]/80"
 }`}
 >
 <div className="flex items-start justify-between gap-2">
 <div className="flex-1">
 <h4 className="font-semibold text-[var(--foreground)]  mb-1">{grid.name}</h4>
 <p className="text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] mb-2">{grid.screen}</p>
 <div className="flex gap-3 text-xs">
 <span className="text-[var(--muted-foreground)]">
 {getVisibleColumnsCount(grid)}/{grid.columns.length} visible
 </span>
 {getPinnedColumnsCount(grid) > 0 && (
 <span className="text-[var(--primary)]">
 {getPinnedColumnsCount(grid)} pinned
 </span>
 )}
 </div>
 </div>
 <div className="text-xs px-2 py-1 bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] text-[var(--foreground)] rounded">
 {grid.category}
 </div>
 </div>
 </button>
 ))
 )}
 </div>
 </div>

 {/* Right Panel - Column Configuration */}
 <div className="col-span-8 bg-[var(--surface-container-high)] text-[var(--foreground)] border-[var(--border)]  rounded-lg p-6">
 {selectedGridConfig ? (
 <>
 {/* Header */}
 <div className="mb-6 pb-4 border-b border-[var(--border)] ">
 <div className="flex items-center justify-between mb-2">
 <div>
 <h3 className="text-xl font-bold text-[var(--foreground)]  mb-1">
 {selectedGridConfig.name}
 </h3>
 <p className="text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">{selectedGridConfig.screen}</p>
 </div>
 <button
 onClick={() => resetToDefaults(selectedGridConfig.id)}
 className="flex items-center gap-2 px-4 py-2 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] text-[var(--foreground)] rounded-lg transition-colors text-sm"
 >
 <RotateCcw size={16} />
 Reset to Defaults
 </button>
 </div>
 <div className="flex gap-4 text-sm">
 <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
 <Eye size={16} className="text-[var(--primary)]" />
 <span>
 {getVisibleColumnsCount(selectedGridConfig)} of{" "}
 {selectedGridConfig.columns.length} columns visible
 </span>
 </div>
 <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
 <Pin size={16} className="text-[var(--primary)]" />
 <span>{getPinnedColumnsCount(selectedGridConfig)} columns pinned</span>
 </div>
 </div>
 </div>

 {/* Column List */}
 <div className="space-y-2">
 <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wide">
 <div className="col-span-5">Column Name</div>
 <div className="col-span-3 text-center">Visibility</div>
 <div className="col-span-3 text-center">Pinned</div>
 <div className="col-span-1"></div>
 </div>

 {selectedGridConfig.columns
 .sort((a, b) => a.order - b.order)
 .map((column, index) => (
 <DraggableColumnRow
 key={column.id}
 column={column}
 index={index}
 gridId={selectedGridConfig.id}
 moveColumn={moveColumn}
 toggleColumnVisibility={toggleColumnVisibility}
 toggleColumnPin={toggleColumnPin}
 />
 ))}
 </div>

 {/* Info Panel */}
 <div className="mt-6 p-4 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg">
 <div className="flex items-start gap-3">
 <AlertCircle size={20} className="text-[var(--primary)] mt-0.5 flex-shrink-0" />
 <div className="text-sm text-[var(--foreground)]">
 <p className="font-semibold mb-1">How it works:</p>
 <ul className="space-y-1 text-[var(--muted-foreground)]">
 <li>• <strong className="text-[var(--foreground)]">Drag and drop</strong> columns to reorder them</li>
 <li>• <strong className="text-[var(--foreground)]">Visible columns</strong> are shown in the grid</li>
 <li>• <strong className="text-[var(--foreground)]">Hidden columns</strong> are completely removed from view</li>
 <li>• <strong className="text-[var(--foreground)]">Pinned columns</strong> stay fixed on the left side when scrolling horizontally</li>
 <li>• Changes are saved per grid and persist across sessions</li>
 </ul>
 </div>
 </div>
 </div>
 </>
 ) : (
 <div className="flex items-center justify-center h-full text-[var(--muted-foreground)]">
 <div className="text-center">
 <Eye size={48} className="mx-auto mb-4 opacity-50" />
 <p className="text-lg font-medium mb-2">No Grid Selected</p>
 <p className="text-sm">Select a grid from the left panel to configure its columns</p>
 </div>
 </div>
 )}
 </div>
 </div>
 </div>
 </div>
 </DndProvider>
 );
}