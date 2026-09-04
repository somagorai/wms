import { useState, useMemo, useRef } from "react";
import { useVersionTheme } from "../contexts/VersionThemeContext";
import { Link } from "react-router-dom";
import {
  Home, ChevronRight, Search, X, Save, Settings2, ChevronUp, ChevronDown,
  Plus, Trash2, ToggleLeft, ToggleRight, Hash, Type, Braces, AlertCircle, Download,
  RefreshCw, LogOut, Info, Zap, RotateCcw, Copy, Check,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import {
  MasterTableContainer,
  MasterTable,
  MasterTableHead,
  MasterTableTh,
  MasterTableBody,
  MasterTableRow,
  MasterTableCell,
  MasterTableEmptyRow,
} from "../components/tables/MasterTable";
import { DetailSidePanel, PanelSection, PanelRow } from "../components/DetailSidePanel";

// ─── Types ────────────────────────────────────────────────────────────────────

type ParamType = "INT" | "BOOLEAN" | "STRING" | "JSON";
type ChangeRestriction = "None" | "Service Restart" | "Logout";

type JsonField = { key: string; value: string };

type SystemParam = {
  id: string;
  name: string;
  value: string; // For JSON: JSON.stringify of JsonField[]
  description: string;
  type: ParamType;
  scope: string;
  changeRestriction: ChangeRestriction;
  modifiedBy: string;
  modified: string;
};

type SortField = keyof SystemParam;
type SortDir = "asc" | "desc";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_PARAMS: SystemParam[] = [
  {
    id: "SYS-001", name: "MAX_PICK_ITEMS_PER_WAVE", value: "250",
    description: "Maximum number of pick items allowed per wave",
    type: "INT", scope: "Pick", changeRestriction: "Service Restart",
    modifiedBy: "admin", modified: "2026-05-12 09:14:33",
  },
  {
    id: "SYS-002", name: "ENABLE_AUTO_REGISTER", value: "true",
    description: "Automatically register sortbars when a work list is assigned",
    type: "BOOLEAN", scope: "Pick", changeRestriction: "None",
    modifiedBy: "john.smith", modified: "2026-06-01 14:22:05",
  },
  {
    id: "SYS-003", name: "DEFAULT_ZONE", value: "Zone A",
    description: "Default zone used when no zone is specified for a work list",
    type: "STRING", scope: "Global", changeRestriction: "None",
    modifiedBy: "admin", modified: "2026-04-20 08:00:00",
  },
  {
    id: "SYS-004", name: "PICK_TIMEOUT_SECONDS", value: "120",
    description: "Number of seconds before a pick task times out",
    type: "INT", scope: "Pick", changeRestriction: "None",
    modifiedBy: "admin", modified: "2026-05-30 11:05:44",
  },
  {
    id: "SYS-005", name: "ENABLE_SKU_VERIFICATION", value: "true",
    description: "Require SKU scan verification before a pick or count",
    type: "BOOLEAN", scope: "Global", changeRestriction: "Logout",
    modifiedBy: "sarah.jones", modified: "2026-06-03 16:47:12",
  },
  {
    id: "SYS-006", name: "REPLEN_BATCH_SIZE", value: "50",
    description: "Number of items included in a single replenishment batch",
    type: "INT", scope: "Replenishment", changeRestriction: "None",
    modifiedBy: "admin", modified: "2026-03-14 07:30:00",
  },
  {
    id: "SYS-007", name: "CYCLE_COUNT_VARIANCE_THRESHOLD", value: "5",
    description: "Percentage variance that triggers a recount flag",
    type: "INT", scope: "Cycle Count", changeRestriction: "None",
    modifiedBy: "mike.davis", modified: "2026-05-22 10:11:58",
  },
  {
    id: "SYS-008", name: "INSPECTION_HOLD_CODES",
    value: JSON.stringify([
      { key: "QUALITY_FAIL", value: "Quality Failure" },
      { key: "DAMAGED", value: "Damaged Goods" },
      { key: "EXPIRED", value: "Expired Product" },
      { key: "MISMATCH", value: "Quantity Mismatch" },
    ]),
    description: "Reason codes available when placing items on inspection hold",
    type: "JSON", scope: "Inspection", changeRestriction: "None",
    modifiedBy: "admin", modified: "2026-06-05 13:20:00",
  },
  {
    id: "SYS-009", name: "LABEL_PRINT_COPIES", value: "1",
    description: "Default number of label copies to print",
    type: "INT", scope: "Global", changeRestriction: "None",
    modifiedBy: "admin", modified: "2026-01-10 09:00:00",
  },
  {
    id: "SYS-010", name: "ENABLE_DARK_MODE_DEFAULT", value: "false",
    description: "Set dark mode as the default theme for new users",
    type: "BOOLEAN", scope: "Global", changeRestriction: "Logout",
    modifiedBy: "admin", modified: "2026-02-28 12:00:00",
  },
  {
    id: "SYS-011", name: "SESSION_TIMEOUT_MINUTES", value: "60",
    description: "Number of minutes of inactivity before a user session expires",
    type: "INT", scope: "Global", changeRestriction: "Service Restart",
    modifiedBy: "admin", modified: "2026-05-01 08:45:00",
  },
  {
    id: "SYS-012", name: "PURGE_REASON_CODES",
    value: JSON.stringify([
      { key: "QUALITY_FAIL", value: "Quality Failure" },
      { key: "DAMAGED", value: "Damaged Goods" },
      { key: "WRONG_ITEMS", value: "Wrong Items" },
      { key: "QTY_MISMATCH", value: "Quantity Mismatch" },
      { key: "EXPIRED", value: "Expired Product" },
      { key: "CONTAMINATION", value: "Contamination" },
      { key: "WRONG_LOC", value: "Incorrect Location" },
      { key: "SYS_ERROR", value: "System Error" },
      { key: "CUST_REQ", value: "Customer Request" },
      { key: "SUPPLIER", value: "Supplier Issue" },
      { key: "OTHER", value: "Other" },
    ]),
    description: "Reason codes available when purging a work list",
    type: "JSON", scope: "Inspection", changeRestriction: "None",
    modifiedBy: "admin", modified: "2026-06-10 08:00:00",
  },
  {
    id: "SYS-013", name: "ADJUSTMENT_REASON_CODES",
    value: JSON.stringify([
      { key: "COUNT_ERROR", value: "Count Error" },
      { key: "DAMAGED", value: "Damaged" },
      { key: "LOST", value: "Lost" },
      { key: "FOUND", value: "Found" },
      { key: "SYS_ERROR", value: "System Error" },
      { key: "OTHER", value: "Other" },
    ]),
    description: "Reason codes used for inventory adjustments",
    type: "JSON", scope: "Pick", changeRestriction: "None",
    modifiedBy: "admin", modified: "2026-06-10 08:00:00",
  },
  {
    id: "SYS-014", name: "WORKSTATION_HEARTBEAT_INTERVAL", value: "30",
    description: "Seconds between workstation heartbeat pings to the server",
    type: "INT", scope: "Global", changeRestriction: "Service Restart",
    modifiedBy: "admin", modified: "2026-04-05 11:00:00",
  },
  {
    id: "SYS-015", name: "MHE_ENABLED", value: "true",
    description: "Enable MHE integration for this installation",
    type: "BOOLEAN", scope: "MHE", changeRestriction: "Service Restart",
    modifiedBy: "admin", modified: "2026-03-01 07:00:00",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TYPE_ICONS: Record<ParamType, React.ReactNode> = {
  INT: <Hash size={13} className="text-[var(--state-info)]" />,
  BOOLEAN: <ToggleLeft size={13} className="text-[var(--state-fatal)]" />,
  STRING: <Type size={13} className="text-[var(--state-warning)]" />,
  JSON: <Braces size={13} className="text-[var(--state-success)]" />,
};

const TYPE_BADGE: Record<ParamType, string> = {
  INT: "bg-[var(--state-info)]/10 text-[var(--state-info)] dark:text-[var(--state-info)]",
  BOOLEAN: "bg-[var(--tertiary)]/10 text-[var(--tertiary)] dark:text-[var(--state-fatal)]",
  STRING: "bg-[var(--state-warning)]/10 text-[var(--state-on-warning-container)] dark:text-[var(--state-warning)]",
  JSON: "bg-[var(--state-success)]/10 text-[var(--state-on-success-container)] dark:text-[var(--state-success)]",
};

const RESTRICTION_BADGE: Record<ChangeRestriction, string> = {
  None: "bg-[var(--state-debug)]/10 text-[var(--muted-foreground)]",
  "Service Restart": "bg-[var(--state-error)]/10 text-[var(--state-error)] dark:text-[var(--state-error)]",
  Logout: "bg-[var(--state-warning)]/10 text-[var(--state-on-warning-container)] dark:text-[var(--state-warning)]",
};

const RESTRICTION_ICON: Record<ChangeRestriction, React.ReactNode> = {
  None: null,
  "Service Restart": <RefreshCw size={11} />,
  Logout: <LogOut size={11} />,
};

function parseJson(val: string): JsonField[] {
  try { return JSON.parse(val) as JsonField[]; } catch { return []; }
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SystemParameters() {
  const { version } = useVersionTheme();
  const isV6 = version === "Master Blue V6";
  const [params, setParams] = useState<SystemParam[]>(MOCK_PARAMS);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  // Side panel state
  const [selected, setSelected] = useState<SystemParam | null>(null);
  const [activeTab, setActiveTab] = useState<"details" | "actions">("details");
  const [editValue, setEditValue] = useState("");
  const [editJsonFields, setEditJsonFields] = useState<JsonField[]>([]);
  const [editingJsonIdx, setEditingJsonIdx] = useState<number | null>(null);
  const [editingJsonField, setEditingJsonField] = useState<JsonField>({ key: "", value: "" });
  const [hasChanges, setHasChanges] = useState(false);

  // Add JSON field at panel level
  const [showAddJson, setShowAddJson] = useState(false);
  const [newJsonKey, setNewJsonKey] = useState("");
  const [newJsonValue, setNewJsonValue] = useState("");

  const searchRef = useRef<HTMLInputElement>(null);

  // ── Sorting ─────────────────────────────────────────────────────────────────
  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  // ── Filtering ───────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return params
      .filter(p =>
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.scope.toLowerCase().includes(q) ||
        p.value.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q) ||
        p.modifiedBy.toLowerCase().includes(q)
      )
      .sort((a, b) => {
        const va = a[sortField] as string;
        const vb = b[sortField] as string;
        return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      });
  }, [params, search, sortField, sortDir]);

  // ── Open param ──────────────────────────────────────────────────────────────
  const openParam = (p: SystemParam) => {
    setSelected(p);
    setActiveTab("details");
    setHasChanges(false);
    setEditingJsonIdx(null);
    setShowAddJson(false);
    if (p.type === "JSON") {
      setEditJsonFields(parseJson(p.value));
      setEditValue("");
    } else {
      setEditValue(p.value);
      setEditJsonFields([]);
    }
  };

  // ── Save ────────────────────────────────────────────────────────────────────
  const handleSave = () => {
    if (!selected) return;
    const newValue = selected.type === "JSON"
      ? JSON.stringify(editJsonFields)
      : editValue;
    const updated: SystemParam = {
      ...selected,
      value: newValue,
      modifiedBy: "admin",
      modified: new Date().toISOString().replace("T", " ").slice(0, 19),
    };
    setParams(prev => prev.map(p => p.id === selected.id ? updated : p));
    setSelected(updated);
    setHasChanges(false);
    toast.success("Parameter saved", { description: selected.name });
  };

  const handleCancel = () => {
    if (selected) openParam(selected); // re-load original
    setHasChanges(false);
  };

  const handleRevert = () => {
    if (!selected) return;
    openParam(selected);
    toast.info("Parameter changes reverted", { description: selected.name });
  };

  const handleCopyJson = () => {
    if (!selected) return;
    navigator.clipboard.writeText(JSON.stringify(selected, null, 2));
    toast.success("Parameter details copied to clipboard");
  };

  // ── JSON field editing ───────────────────────────────────────────────────────
  const startEditJson = (idx: number) => {
    setEditingJsonIdx(idx);
    setEditingJsonField({ ...editJsonFields[idx] });
  };

  const saveEditJson = () => {
    if (editingJsonIdx === null) return;
    const updated = [...editJsonFields];
    updated[editingJsonIdx] = { ...editingJsonField };
    setEditJsonFields(updated);
    setEditingJsonIdx(null);
    setHasChanges(true);
  };

  const cancelEditJson = () => setEditingJsonIdx(null);

  const deleteJsonField = (idx: number) => {
    setEditJsonFields(prev => prev.filter((_, i) => i !== idx));
    if (editingJsonIdx === idx) setEditingJsonIdx(null);
    setHasChanges(true);
  };

  const addJsonField = () => {
    if (!newJsonKey.trim()) return;
    setEditJsonFields(prev => [...prev, { key: newJsonKey.trim(), value: newJsonValue.trim() }]);
    setNewJsonKey("");
    setNewJsonValue("");
    setShowAddJson(false);
    setHasChanges(true);
  };

  // ── Sort header helper ───────────────────────────────────────────────────────
  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronUp size={12} className="text-[var(--muted-foreground)] opacity-40" />;
    return sortDir === "asc"
      ? <ChevronUp size={12} className="text-[var(--primary)] dark:text-[var(--primary)]" />
      : <ChevronDown size={12} className="text-[var(--primary)] dark:text-[var(--primary)]" />;
  };

  const Th = ({ field, label, className = "" }: { field: SortField; label: string; className?: string }) => (
    <MasterTableTh
      type="actionable"
      density="compact"
      className={`cursor-pointer select-none hover:text-[var(--foreground)] transition-colors whitespace-nowrap ${className}`}
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-2">
        {label}
        <SortIcon field={field} />
      </div>
    </MasterTableTh>
  );

  const displayValue = (p: SystemParam) => {
    if (p.type === "JSON") {
      const fields = parseJson(p.value);
      return `{${fields.length} entries}`;
    }
    return p.value;
  };

  return (
    <div className="min-h-screen bg-[var(--background)] dark:bg-[var(--background)] text-[var(--foreground)] flex flex-col">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-[var(--background)]/95 backdrop-blur-md text-[var(--foreground)] border-b border-[var(--border)] px-8 pt-6 pb-4">
        <div className="flex items-center justify-between gap-4 mb-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/app/home" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] dark:hover:text-[var(--primary)] transition-colors flex items-center gap-1">
              <Home size={14} />Home
            </Link>
            <ChevronRight size={14} className="text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]" />
            <Link to="/app/navigation?section=system" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] dark:hover:text-[var(--primary)] transition-colors">System</Link>
            <ChevronRight size={14} className="text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]" />
            <span className="text-[var(--foreground)] font-semibold text-lg flex items-center gap-2">
              <Settings2 size={20} className="text-[var(--primary)] dark:text-[var(--primary)]" />
              System Parameters
            </span>
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={() => {}} className="p-2 rounded-lg border border-[var(--border)] bg-[var(--surface-container)] text-[var(--foreground)] hover:bg-[var(--surface-container-high)] text-[var(--muted-foreground)] transition-colors" title="Refresh"><RefreshCw size={16} /></button>
            <button className="p-2 rounded-lg border border-[var(--border)] bg-[var(--surface-container)] text-[var(--foreground)] hover:bg-[var(--surface-container-high)] text-[var(--muted-foreground)] transition-colors" title="Export"><Download size={16} /></button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3">
          {/* Global Search */}
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] pointer-events-none" />
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search parameters…"
              className="w-full pl-9 pr-8 py-2 bg-[var(--surface-container-low)] dark:bg-[var(--card)] border border-[var(--border)] rounded-lg text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                <X size={14} />
              </button>
            )}
          </div>

          <div className="text-sm text-[var(--muted-foreground)] ml-auto">
            {filtered.length} of {params.length} parameters
          </div>
        </div>
      </div>

      {/* Main Table Layout */}
      <div className="flex-1 overflow-y-auto px-8 pt-4 pb-8">
        <MasterTableContainer type="actionable">
          <MasterTable type="actionable" className="min-w-max">
            <MasterTableHead type="actionable" sticky>
              <tr>
                <Th field="id" label="ID" />
                <Th field="name" label="Name" />
                <Th field="value" label="Value" />
                <Th field="type" label="Type" />
                <Th field="scope" label="Scope" />
                <Th field="changeRestriction" label="Change Restriction" />
                <Th field="description" label="Description" className="min-w-[200px]" />
                <Th field="modifiedBy" label="Modified By" />
                <Th field="modified" label="Modified" />
              </tr>
            </MasterTableHead>
            <MasterTableBody type="actionable">
              {filtered.map(p => {
                const isSelected = selected?.id === p.id;
                return (
                  <MasterTableRow
                    key={p.id}
                    type="actionable"
                    clickable
                    selected={isSelected}
                    onClick={() => openParam(p)}
                    className={isSelected ? (isV6 ? "bg-[var(--primary)]/5 ring-1 ring-inset ring-[var(--primary)]" : "border-l-2 border-l-[var(--primary)]") : ""}
                  >
                    <MasterTableCell type="actionable" density="compact" className="font-mono text-[var(--muted-foreground)]">{p.id}</MasterTableCell>
                    <MasterTableCell type="actionable" density="compact" className="font-mono font-medium max-w-[240px] truncate">{p.name}</MasterTableCell>
                    <MasterTableCell type="actionable" density="compact" className="max-w-[180px]">
                      <span className="font-mono text-sm text-[var(--foreground)] truncate block">
                        {displayValue(p)}
                      </span>
                    </MasterTableCell>
                    <MasterTableCell type="actionable" density="compact">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${TYPE_BADGE[p.type]}`}>
                        {TYPE_ICONS[p.type]}
                        {p.type}
                      </span>
                    </MasterTableCell>
                    <MasterTableCell type="actionable" density="compact" className="text-[var(--muted-foreground)]">{p.scope}</MasterTableCell>
                    <MasterTableCell type="actionable" density="compact">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${RESTRICTION_BADGE[p.changeRestriction]}`}>
                        {RESTRICTION_ICON[p.changeRestriction]}
                        {p.changeRestriction}
                      </span>
                    </MasterTableCell>
                    <MasterTableCell type="actionable" density="compact" className="text-[var(--muted-foreground)] max-w-[280px] truncate">{p.description}</MasterTableCell>
                    <MasterTableCell type="actionable" density="compact" className="text-[var(--muted-foreground)]">{p.modifiedBy}</MasterTableCell>
                    <MasterTableCell type="actionable" density="compact" className="text-[var(--muted-foreground)]">{p.modified}</MasterTableCell>
                  </MasterTableRow>
                );
              })}
              {filtered.length === 0 && (
                <MasterTableEmptyRow colSpan={9}>
                  <Search size={32} className="mx-auto mb-2 opacity-30 text-[var(--muted-foreground)]" />
                  <p className="text-sm text-[var(--muted-foreground)]">No parameters match your search.</p>
                </MasterTableEmptyRow>
              )}
            </MasterTableBody>
          </MasterTable>
        </MasterTableContainer>

        {/* Modular Side Panel */}
        {selected && (
          <DetailSidePanel
            title={selected.name}
            subtitle={`${selected.id} • Scope: ${selected.scope}`}
            icon={<Settings2 size={24} className="text-[var(--primary)]" />}
            status={selected.changeRestriction === "None" ? "Active" : selected.changeRestriction}
            activeTab={activeTab}
            onTabChange={(tab) => setActiveTab(tab as any)}
            tabs={[
              { id: "details", label: "Details", icon: <Info size={16} /> },
              { id: "actions", label: "Actions", icon: <Zap size={16} />, isAction: true },
            ]}
            onClose={() => { setSelected(null); setHasChanges(false); }}
            footer={
              <div className="flex items-center justify-end gap-3 w-full">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)] hover:bg-[var(--surface-container-high)] text-[var(--foreground)] rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!hasChanges}
                  className="px-4 py-2 bg-[var(--primary)] hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed text-[var(--primary-foreground)] rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <Save size={15} />
                  Save Changes
                </button>
              </div>
            }
          >
            {activeTab === "details" && (
              <div className="space-y-6">
                {/* Value Section */}
                <PanelSection title="Edit Value">
                  {selected.type === "INT" && (
                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-[var(--muted-foreground)]">Integer Value</label>
                      <input
                        type="number"
                        value={editValue}
                        onChange={e => { setEditValue(e.target.value); setHasChanges(true); }}
                        className="w-full px-3 py-2 bg-[var(--surface-container-high)] border border-[var(--border)] rounded-lg text-[var(--foreground)] font-mono text-base focus:outline-none focus:border-[var(--primary)] transition-colors"
                      />
                    </div>
                  )}

                  {selected.type === "STRING" && (
                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-[var(--muted-foreground)]">String Value</label>
                      <input
                        type="text"
                        value={editValue}
                        onChange={e => { setEditValue(e.target.value); setHasChanges(true); }}
                        className="w-full px-3 py-2 bg-[var(--surface-container-high)] border border-[var(--border)] rounded-lg text-[var(--foreground)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
                      />
                    </div>
                  )}

                  {selected.type === "BOOLEAN" && (
                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-[var(--muted-foreground)]">Boolean Toggle</label>
                      <button
                        onClick={() => { setEditValue(editValue === "true" ? "false" : "true"); setHasChanges(true); }}
                        className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg border-2 transition-all ${
                          editValue === "true"
                            ? "bg-[var(--primary)]/10 border-[var(--primary)] text-[var(--primary)]"
                            : "bg-[var(--surface-container-high)] border-[var(--border)] text-[var(--muted-foreground)]"
                        }`}
                      >
                        {editValue === "true"
                          ? <ToggleRight size={24} className="flex-shrink-0 text-[var(--primary)]" />
                          : <ToggleLeft size={24} className="flex-shrink-0 text-[var(--muted-foreground)]" />}
                        <span className="text-sm font-semibold">{editValue === "true" ? "Enabled (true)" : "Disabled (false)"}</span>
                      </button>
                    </div>
                  )}

                  {selected.type === "JSON" && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-medium text-[var(--muted-foreground)]">
                          Entries ({editJsonFields.length})
                        </label>
                        <button
                          onClick={() => { setShowAddJson(v => !v); setNewJsonKey(""); setNewJsonValue(""); }}
                          className="flex items-center gap-1 px-2 py-1 text-xs bg-[var(--primary)]/10 text-[var(--primary)] hover:bg-[var(--primary)]/20 rounded font-medium transition-colors"
                        >
                          <Plus size={12} />
                          Add Entry
                        </button>
                      </div>

                      {/* Add new entry form */}
                      <AnimatePresence>
                        {showAddJson && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden mb-3"
                          >
                            <div className="bg-[var(--surface-container-high)] border border-[var(--border)] rounded-lg p-3 space-y-2">
                              <div>
                                <label className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-wider mb-0.5 block">Key</label>
                                <input
                                  type="text"
                                  value={newJsonKey}
                                  onChange={e => setNewJsonKey(e.target.value)}
                                  placeholder="KEY_NAME"
                                  className="w-full px-2.5 py-1.5 bg-[var(--surface-container)] border border-[var(--border)] rounded text-xs font-mono text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-wider mb-0.5 block">Value</label>
                                <input
                                  type="text"
                                  value={newJsonValue}
                                  onChange={e => setNewJsonValue(e.target.value)}
                                  placeholder="Display value"
                                  className="w-full px-2.5 py-1.5 bg-[var(--surface-container)] border border-[var(--border)] rounded text-xs text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors"
                                />
                              </div>
                              <div className="flex gap-2 pt-1">
                                <button onClick={() => setShowAddJson(false)} className="flex-1 py-1 text-xs bg-[var(--surface-container)] text-[var(--foreground)] rounded hover:bg-[var(--surface-container-low)] transition-colors">Cancel</button>
                                <button onClick={addJsonField} disabled={!newJsonKey.trim()} className="flex-1 py-1 text-xs bg-[var(--primary)] hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed text-[var(--primary-foreground)] rounded transition-colors">Add</button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* JSON entry list */}
                      <div className="space-y-1.5 max-h-60 overflow-y-auto">
                        {editJsonFields.map((field, idx) => (
                          <div key={idx}>
                            {editingJsonIdx === idx ? (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-[var(--primary)]/5 border border-[var(--primary)]/30 rounded-lg p-2.5 space-y-2"
                              >
                                <div>
                                  <label className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-wider mb-0.5 block">Key</label>
                                  <input
                                    type="text"
                                    value={editingJsonField.key}
                                    onChange={e => setEditingJsonField(f => ({ ...f, key: e.target.value }))}
                                    className="w-full px-2.5 py-1.5 bg-[var(--surface-container)] border border-[var(--border)] rounded text-xs font-mono text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-wider mb-0.5 block">Value</label>
                                  <input
                                    type="text"
                                    value={editingJsonField.value}
                                    onChange={e => setEditingJsonField(f => ({ ...f, value: e.target.value }))}
                                    autoFocus
                                    className="w-full px-2.5 py-1.5 bg-[var(--surface-container)] border border-[var(--border)] rounded text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors"
                                  />
                                </div>
                                <div className="flex gap-2 pt-1">
                                  <button onClick={cancelEditJson} className="flex-1 py-1 text-xs bg-[var(--surface-container)] text-[var(--foreground)] rounded hover:bg-[var(--surface-container-high)] transition-colors">Cancel</button>
                                  <button onClick={saveEditJson} className="flex-1 py-1 text-xs bg-[var(--primary)] hover:opacity-90 active:scale-[0.98] text-[var(--primary-foreground)] rounded transition-colors">Save Entry</button>
                                </div>
                              </motion.div>
                            ) : (
                              <div
                                onClick={() => startEditJson(idx)}
                                className="flex items-center justify-between px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface-container-high)] hover:border-[var(--primary)]/50 hover:bg-[var(--primary)]/5 cursor-pointer transition-all group"
                              >
                                <div className="min-w-0 flex-1">
                                  <div className="text-[10px] font-mono text-[var(--muted-foreground)] leading-none mb-0.5">{field.key}</div>
                                  <div className="text-xs text-[var(--foreground)] truncate">{field.value}</div>
                                </div>
                                <button
                                  onClick={e => { e.stopPropagation(); deleteJsonField(idx); }}
                                  className="flex-shrink-0 ml-2 p-1 opacity-0 group-hover:opacity-100 text-[var(--muted-foreground)] hover:text-[var(--state-error)] rounded transition-all"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                        {editJsonFields.length === 0 && (
                          <p className="text-xs text-[var(--muted-foreground)] text-center py-3">No entries configured.</p>
                        )}
                      </div>
                    </div>
                  )}
                </PanelSection>

                {/* Information Section */}
                <PanelSection title="Parameter Information">
                  <PanelRow label="Parameter ID" value={selected.id} mono />
                  <PanelRow label="Parameter Name" value={selected.name} mono />
                  <PanelRow
                    label="Data Type"
                    value={
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium ${TYPE_BADGE[selected.type]}`}>
                        {TYPE_ICONS[selected.type]}
                        {selected.type}
                      </span>
                    }
                  />
                  <PanelRow label="Scope" value={selected.scope} />
                  <PanelRow
                    label="Change Restriction"
                    value={
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium ${RESTRICTION_BADGE[selected.changeRestriction]}`}>
                        {RESTRICTION_ICON[selected.changeRestriction]}
                        {selected.changeRestriction}
                      </span>
                    }
                  />
                  <PanelRow label="Description" value={selected.description} />
                </PanelSection>

                {/* Audit Section */}
                <PanelSection title="Audit & Metadata">
                  <PanelRow label="Modified By" value={selected.modifiedBy} />
                  <PanelRow label="Modified Date" value={selected.modified} mono />
                </PanelSection>

                {/* Change Restriction Warning */}
                {selected.changeRestriction !== "None" && (
                  <div className={`flex items-start gap-2.5 p-3.5 rounded-lg text-xs border ${
                    selected.changeRestriction === "Service Restart"
                      ? "bg-[var(--state-error-container)] border-[var(--state-error)]/40 text-[var(--state-on-error-container)]"
                      : "bg-[var(--state-warning-container)] border-[var(--state-warning)]/40 text-[var(--state-on-warning-container)]"
                  }`}>
                    <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed">
                      {selected.changeRestriction === "Service Restart"
                        ? "Changes to this parameter require a service restart to take effect across the cluster."
                        : "Changes to this parameter will take effect after the user logs out and logs back in."}
                    </span>
                  </div>
                )}
              </div>
            )}

            {activeTab === "actions" && (
              <div className="space-y-4">
                {/* Revert Action */}
                <div className="bg-[var(--surface-container)] border border-[var(--border)] rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <RotateCcw size={16} className="text-[var(--state-warning)]" />
                      <span className="text-sm font-semibold text-[var(--foreground)]">Revert Changes</span>
                    </div>
                  </div>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    Discard unsaved modifications and restore the parameter value to the saved state.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={handleRevert}
                      disabled={!hasChanges}
                      className="w-full px-4 py-2 bg-[var(--surface-container-high)] hover:bg-[var(--surface-container-highest)] disabled:opacity-40 disabled:cursor-not-allowed text-[var(--foreground)] rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <RotateCcw size={14} />
                      Revert Unsaved Values
                    </button>
                  </div>
                </div>

                {/* Export Parameter JSON */}
                <div className="bg-[var(--surface-container)] border border-[var(--border)] rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Copy size={16} className="text-[var(--primary)]" />
                      <span className="text-sm font-semibold text-[var(--foreground)]">Copy Parameter JSON</span>
                    </div>
                  </div>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    Copy the complete parameter configuration to your clipboard as formatted JSON.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={handleCopyJson}
                      className="w-full px-4 py-2 bg-[var(--surface-container-high)] hover:bg-[var(--surface-container-highest)] text-[var(--foreground)] rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Copy size={14} />
                      Copy JSON Definition
                    </button>
                  </div>
                </div>
              </div>
            )}
          </DetailSidePanel>
        )}
      </div>
    </div>
  );
}
