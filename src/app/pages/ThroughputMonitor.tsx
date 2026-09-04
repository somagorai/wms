import { useState, useEffect, useId } from "react";
import { Link } from "react-router-dom";
import {
 ComposedChart, Area, BarChart, Bar, Cell,
 XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine,
 ResponsiveContainer,
} from "recharts";
import {
 Home, ChevronRight, Activity, RefreshCw, Download,
 Target, Zap, TrendingUp, TrendingDown,
 AlertTriangle, ChevronDown, Lock, Unlock, ArrowRight,
 Cpu, ChevronLeft,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { TopCard } from "../components/TopCard";

// ─── Data model ───────────────────────────────────────────────────────────────

type Status = "ok" | "warn" | "critical";

interface Lane {
 id: string;
 name: string;
 uph: number;
 target: number;
 trend: "up" | "down";
 status: Status;
}

interface Section {
 id: string;
 name: string;
 uph: number;
 target: number;
 trend: "up" | "down";
 status: Status;
 lanes: Lane[];
}

interface SubSystem {
 id: string;
 name: string;
 uph: number;
 target: number;
 sections: Section[];
}

const SUBSYSTEMS: SubSystem[] = [
 {
 id: "inbound", name: "Inbound", uph: 1780, target: 1800,
 sections: [
 {
 id: "ib-merge", name: "IB Merge", uph: 1820, target: 1800, trend: "up", status: "ok",
 lanes: [
 { id: "ib-m-l1", name: "Lane 1", uph: 480, target: 450, trend: "up", status: "ok" },
 { id: "ib-m-l2", name: "Lane 2", uph: 390, target: 450, trend: "down", status: "warn" },
 { id: "ib-m-l3", name: "Lane 3", uph: 510, target: 450, trend: "up", status: "ok" },
 { id: "ib-m-recirc",name: "Recirc Lane", uph: 150, target: 200, trend: "down", status: "warn" },
 ],
 },
 {
 id: "ib-sorter", name: "IB Sorter", uph: 1740, target: 1800, trend: "down", status: "warn",
 lanes: [
 { id: "ib-s-a", name: "Sorter A", uph: 920, target: 900, trend: "up", status: "ok" },
 { id: "ib-s-b", name: "Sorter B", uph: 820, target: 900, trend: "down", status: "warn" },
 ],
 },
 {
 id: "ib-induction", name: "Induction", uph: 1800, target: 1800, trend: "up", status: "ok",
 lanes: [
 { id: "ib-i-1", name: "Station 1", uph: 600, target: 600, trend: "up", status: "ok" },
 { id: "ib-i-2", name: "Station 2", uph: 600, target: 600, trend: "up", status: "ok" },
 { id: "ib-i-3", name: "Station 3", uph: 600, target: 600, trend: "up", status: "ok" },
 ],
 },
 ],
 },
 {
 id: "outbound", name: "Outbound", uph: 1650, target: 1800,
 sections: [
 {
 id: "ob-sort", name: "OB Sort", uph: 1640, target: 1800, trend: "down", status: "warn",
 lanes: [
 { id: "ob-s-1", name: "Line 1", uph: 540, target: 600, trend: "down", status: "warn" },
 { id: "ob-s-2", name: "Line 2", uph: 580, target: 600, trend: "up", status: "ok" },
 { id: "ob-s-3", name: "Line 3", uph: 520, target: 600, trend: "down", status: "warn" },
 ],
 },
 {
 id: "ob-pack", name: "Pack", uph: 960, target: 1800, trend: "down", status: "critical",
 lanes: [
 { id: "ob-p-1", name: "Pack Station 1", uph: 320, target: 600, trend: "down", status: "critical" },
 { id: "ob-p-2", name: "Pack Station 2", uph: 640, target: 600, trend: "up", status: "ok" },
 ],
 },
 {
 id: "ob-ship", name: "Ship", uph: 1710, target: 1800, trend: "up", status: "ok",
 lanes: [
 { id: "ob-sh-a", name: "Dock A", uph: 870, target: 900, trend: "up", status: "ok" },
 { id: "ob-sh-b", name: "Dock B", uph: 840, target: 900, trend: "up", status: "ok" },
 ],
 },
 ],
 },
 {
 id: "processing", name: "Processing", uph: 1720, target: 1800,
 sections: [
 {
 id: "proc-putaway", name: "Auto Putaway", uph: 1780, target: 1800, trend: "up", status: "ok",
 lanes: [
 { id: "pp-a1", name: "Aisle 1", uph: 450, target: 450, trend: "up", status: "ok" },
 { id: "pp-a2", name: "Aisle 2", uph: 440, target: 450, trend: "up", status: "ok" },
 { id: "pp-a3", name: "Aisle 3", uph: 430, target: 450, trend: "up", status: "ok" },
 { id: "pp-a4", name: "Aisle 4", uph: 460, target: 450, trend: "up", status: "ok" },
 ],
 },
 {
 id: "proc-divert", name: "Divert", uph: 1660, target: 1800, trend: "down", status: "warn",
 lanes: [
 { id: "prd-1", name: "Divert 1", uph: 830, target: 900, trend: "down", status: "warn" },
 { id: "prd-2", name: "Divert 2", uph: 830, target: 900, trend: "down", status: "warn" },
 ],
 },
 ],
 },
 {
 id: "fulfillment", name: "Fulfillment", uph: 1540, target: 1800,
 sections: [
 {
 id: "ff-pick", name: "Pick", uph: 1540, target: 1800, trend: "down", status: "warn",
 lanes: [
 { id: "ff-p-a", name: "Zone A", uph: 390, target: 450, trend: "down", status: "warn" },
 { id: "ff-p-b", name: "Zone B", uph: 380, target: 450, trend: "down", status: "warn" },
 { id: "ff-p-c", name: "Zone C", uph: 410, target: 450, trend: "up", status: "ok" },
 { id: "ff-p-d", name: "Zone D", uph: 360, target: 450, trend: "down", status: "warn" },
 ],
 },
 {
 id: "ff-returns", name: "Returns", uph: 1540, target: 1800, trend: "down", status: "warn",
 lanes: [
 { id: "ff-r-1", name: "Returns Lane 1", uph: 770, target: 900, trend: "down", status: "warn" },
 { id: "ff-r-2", name: "Returns Lane 2", uph: 770, target: 900, trend: "down", status: "warn" },
 ],
 },
 ],
 },
];

const TARGET_DEFAULT = 1800;
const SHIFT_START = new Date(new Date().setHours(6, 0, 0, 0));

// ─── Chart data builders ──────────────────────────────────────────────────────

function buildRollingData(baseUph: number, target: number, points: number, seed = 1) {
 const now = new Date();
 const intervalMin = points <= 13 ? 5 : 60;
 return Array.from({ length: points }, (_, i) => {
 const t = new Date(now.getTime() - (points - 1 - i) * intervalMin * 60 * 1000);
 const label = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
 const noise = Math.sin(i * seed * 0.9) * 180 + Math.cos(i * 1.3) * 100;
 const uph = Math.max(400, Math.min(baseUph * 1.35, Math.round(baseUph * 0.9 + noise + i * 12)));
 return { time: label, uph, target };
 });
}

// ─── Status helpers ───────────────────────────────────────────────────────────

const statusBorder = { ok: "border-[var(--primary)] dark:border-[var(--primary)] bg-[var(--primary)]/5 /5", warn: "border-[var(--state-warning)]/40 bg-[var(--state-warning)]/5", critical: "border-[var(--state-error)]/40 bg-[var(--state-error)]/5" };
const statusBarFill = { ok: "var(--primary)", warn: "var(--tertiary)", critical: "var(--destructive)" };
const statusText = { ok: "text-[var(--primary)] dark:text-[var(--primary)]", warn: "text-[var(--state-warning)]", critical: "text-[var(--state-error)]" };
const statusBadge = { ok: "bg-[var(--primary)]/10 text-[var(--primary)] dark:text-[var(--primary)]", warn: "bg-[var(--state-warning)]/10 text-[var(--state-on-warning-container)]", critical: "bg-[var(--state-error)]/10 text-[var(--state-error)]" };
const statusLabel = { ok: "On Target", warn: "Below Target", critical: "Bottleneck" };

// ─── Tooltip ─────────────────────────────────────────────────────────────────

const ChartTooltip = ({ active, payload, label }: any) => {
 if (!active || !payload?.length) return null;
 return (
 <div className="bg-[var(--surface-container-high)] text-[var(--foreground)] border-[var(--border)]  rounded-xl p-3 min-w-[160px]">
 <p className="text-[var(--muted-foreground)] text-sm font-medium mb-2">{label}</p>
 {payload.map((p: any) => (
 <div key={p.dataKey} className="flex items-center justify-between gap-4">
 <span className="text-sm" style={{ color: p.color }}>{p.name}</span>
 <span className="text-[var(--foreground)] font-bold text-sm">{p.value?.toLocaleString()}</span>
 </div>
 ))}
 </div>
 );
};

// ─── Target modal ─────────────────────────────────────────────────────────────

function TargetModal({ current, onSave, onClose }: { current: number; onSave: (v: number) => void; onClose: () => void }) {
 const [val, setVal] = useState(String(current));
 return (
 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
 className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
 <motion.div initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 16 }}
 onClick={e => e.stopPropagation()}
 className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-2xl p-8 w-[380px]">
 <div className="flex items-center gap-3 mb-6">
 <div className="w-10 h-10 bg-[var(--state-warning)]/20 rounded-xl flex items-center justify-center">
 <Target size={20} className="text-[var(--state-warning)]" />
 </div>
 <div>
 <h2 className="text-lg font-bold text-[var(--foreground)] ">Adjust Rate Target</h2>
 <p className="text-xs text-[var(--muted-foreground)]">Controls — role-gated setting</p>
 </div>
 </div>
 <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">Target UPH</label>
 <input type="number" value={val} onChange={e => setVal(e.target.value)}
 onKeyDown={e => { if (e.key === "Enter") { onSave(Number(val)); onClose(); } }}
 className="w-full px-4 py-3 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-xl text-[var(--foreground)]  text-xl font-bold focus:outline-none focus:border-[var(--primary)] dark:focus:border-[var(--primary)] transition-colors mb-6"
 autoFocus />
 <div className="flex gap-3">
 <button onClick={onClose} className="flex-1 py-3 rounded-xl border-[var(--border)]  text-[var(--foreground)] font-semibold hover:bg-[var(--surface-container-lowest)] hover:bg-[var(--surface-container-high)] transition-colors">Cancel</button>
 <button onClick={() => { onSave(Number(val)); onClose(); }} className="flex-1 py-3 rounded-xl bg-[var(--state-warning)] hover:bg-[var(--state-warning)] text-[var(--foreground)] font-bold transition-colors">Apply & Log</button>
 </div>
 <p className="mt-4 text-[11px] text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] text-center">Change will be logged to the Controls audit trail</p>
 </motion.div>
 </motion.div>
 );
}

// ─── Contribution card (shared by sections and lanes) ────────────────────────

function ContribCard({ name, label, uph, target, trend, status, onClick }: {
 name: string; label?: string; uph: number; target: number;
 trend: "up" | "down"; status: Status; onClick?: () => void;
}) {
 const pct = Math.round((uph / target) * 100);
 return (
 <button
 onClick={onClick}
 disabled={!onClick}
 className={`group text-left rounded-xl border-2 p-3 transition-all ${onClick ? " hover:-translate-y-0.5 cursor-pointer" : "cursor-default"} ${statusBorder[status]}`}
 >
 <div className="flex items-start justify-between mb-1">
 <div className="min-w-0">
 {label && <p className="text-[10px] text-[var(--muted-foreground)] font-medium uppercase tracking-wide leading-tight truncate">{label}</p>}
 <h3 className="text-sm font-bold text-[var(--foreground)]  leading-tight truncate">{name}</h3>
 </div>
 <div className="flex items-center gap-0.5 flex-shrink-0 ml-1">
 {trend === "up"
 ? <TrendingUp size={12} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 : <TrendingDown size={12} className="text-[var(--state-error)]" />}
 {onClick && <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--muted-foreground)]" />}
 </div>
 </div>
 <div className={`text-xl font-black tabular-nums leading-tight ${statusText[status]}`}>{uph.toLocaleString()}</div>
 <p className="text-[10px] text-[var(--muted-foreground)] mb-1.5">UPH · target {target.toLocaleString()}</p>
 <div className="h-1 bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)] rounded-full overflow-hidden">
 <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, pct)}%`, backgroundColor: statusBarFill[status] }} />
 </div>
 <div className="flex items-center justify-between mt-1">
 <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${statusBadge[status]}`}>{statusLabel[status]}</span>
 <p className="text-[9px] text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">{pct}%</p>
 </div>
 </button>
 );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ThroughputMonitor() {
 const [timeWindow, setTimeWindow] = useState<"1h" | "12h">("1h");
 const [targetRate, setTargetRate] = useState(TARGET_DEFAULT);
 const [showTargetModal, setShowTargetModal] = useState(false);
 const [isRoleAuthorised] = useState(true);
 const [selectedSubsystemId, setSelectedSubsystemId] = useState(SUBSYSTEMS[0].id);
 const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null); // null = subsystem view
 const [liveData, setLiveData] = useState(() => buildRollingData(SUBSYSTEMS[0].uph, TARGET_DEFAULT, 13));
 const [elapsedMin, setElapsedMin] = useState(0);

 const subsystem = SUBSYSTEMS.find(s => s.id === selectedSubsystemId)!;
 const section = selectedSectionId ? subsystem.sections.find(s => s.id === selectedSectionId) ?? null : null;

 // Rebuild chart data when selection or time window changes
 useEffect(() => {
 const baseUph = section ? section.uph : subsystem.uph;
 const points = timeWindow === "12h" ? 13 : 13; // 12h uses 60-min intervals, 1h uses 5-min
 setLiveData(buildRollingData(baseUph, targetRate, points, Math.random() * 3 + 1));
 }, [selectedSubsystemId, selectedSectionId, timeWindow, targetRate]);

 // Live tick every 10 s
 useEffect(() => {
 const baseUph = section ? section.uph : subsystem.uph;
 const id = setInterval(() => {
 setLiveData(buildRollingData(baseUph, targetRate, 13, Math.random() * 3 + 1));
 }, 10_000);
 return () => clearInterval(id);
 }, [selectedSubsystemId, selectedSectionId, targetRate]);

 // Shift elapsed time
 useEffect(() => {
 const tick = () => setElapsedMin(Math.round((Date.now() - SHIFT_START.getTime()) / 60_000));
 tick();
 const id = setInterval(tick, 60_000);
 return () => clearInterval(id);
 }, []);

 const currentUph = liveData[liveData.length - 1]?.uph ?? 0;
 const peakUph = Math.max(...liveData.map(d => d.uph));
 const peakTime = liveData.find(d => d.uph === peakUph)?.time ?? "—";
 const avgUph = Math.round(liveData.reduce((s, d) => s + d.uph, 0) / liveData.length);
 const shiftHours = `${Math.floor(elapsedMin / 60)}h ${elapsedMin % 60}m`;

 // Zone bar chart data: sections or lanes
 const barItems = section
 ? section.lanes.map(l => ({ id: l.id, name: l.name, uph: l.uph, target: l.target, status: l.status }))
 : subsystem.sections.map(s => ({ id: s.id, name: s.name, uph: s.uph, target: s.target, status: s.status }));

 const gradId = useId().replace(/:/g, "");

 const sharedAxisProps = {
 tick: { fill: "var(--muted-foreground)", fontSize: 12, fontWeight: 600 },
 stroke: "var(--border)",
 };

 const handleSelectSubsystem = (id: string) => {
 setSelectedSubsystemId(id);
 setSelectedSectionId(null);
 };

 const handleSelectSection = (id: string) => {
 setSelectedSectionId(id);
 };

 const handleBack = () => {
 setSelectedSectionId(null);
 };

 const handleExport = () => {
 const rows = [["Time", "UPH", "Target"], ...liveData.map(d => [d.time, d.uph, d.target])];
 const csv = rows.map(r => r.join(",")).join("\n");
 const blob = new Blob([csv], { type: "text/csv" });
 const url = URL.createObjectURL(blob);
 const a = document.createElement("a");
 a.href = url; a.download = `throughput_controls_${Date.now()}.csv`; a.click();
 URL.revokeObjectURL(url);
 toast.success("Export complete");
 };

 // Right-panel label
 const panelTitle = section
 ? `${section.name} — Lanes / Feeds`
 : `${subsystem.name} — Sub-sections`;

 const panelHint = section
 ? "Individual lanes feeding into or taking away from this section"
 : "Click a section to drill into its lane-level view";

 const criticalCount = barItems.filter(x => x.status === "critical").length;

  return (
    <div className="flex flex-col min-h-screen">

      {/* Gradient outside recharts */}
      <svg style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }} aria-hidden>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.25} />
            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
      </svg>

      {/* ── Sticky header ── */}
      <div className="sticky top-0 z-40 bg-[var(--background)]/95 backdrop-blur-md text-[var(--foreground)] border-b border-[var(--border)] px-8 pt-6 pb-4">

        {/* Row 1: breadcrumb + controls */}
        <div className="flex items-center justify-between gap-4 mb-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/app/home" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] dark:hover:text-[var(--primary)] transition-colors flex items-center gap-1">
              <Home size={14} />Home
            </Link>
            <ChevronRight size={16} className="text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]" />
            <Link to="/app/navigation?section=dashboards" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] dark:hover:text-[var(--primary)] transition-colors">
              Business Insights
            </Link>
            <ChevronRight size={16} className="text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]" />
            <span className="text-[var(--foreground)]  font-semibold text-lg flex items-center gap-2">
              <Cpu size={20} className="text-[var(--primary)] dark:text-[var(--primary)]" />
              Throughput Controls Monitor
            </span>
          </nav>

          <div className="flex items-center gap-2">
            {/* Time window — 2 options only */}
            <div className="flex items-center bg-[var(--surface-container-low)] dark:bg-[var(--card)] rounded-xl p-1 gap-1 border-[var(--border)] ">
              {(["1h", "12h"] as const).map(w => (
                <button key={w} onClick={() => setTimeWindow(w)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                    timeWindow === w
                      ? "bg-[var(--surface-container-lowest)] dark:bg-[var(--surface-container-high)] text-[var(--foreground)] "
                      : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] dark:hover:text-[var(--foreground)]"
                  }`}
                >
                  {w === "1h" ? "Last Hour" : "Last 12 Hrs"}
                </button>
              ))}
            </div>

            <button
              onClick={() => { if (!isRoleAuthorised) { toast.error("Supervisor role required"); return; } setShowTargetModal(true); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all border-[var(--state-warning)] bg-[var(--state-warning)]/10 text-[var(--state-on-warning-container)] dark:text-[var(--state-warning)] hover:bg-[var(--state-warning)]/20 cursor-pointer"
            >
              <Unlock size={14} />
              Target: {targetRate.toLocaleString()} UPH
              <ChevronDown size={14} />
            </button>

            <button onClick={() => { const b = section ? section.uph : subsystem.uph; setLiveData(buildRollingData(b, targetRate, 13, Math.random() * 5 + 1)); toast.info("Data refreshed"); }}
              className="p-2 rounded-xl border-[var(--border)]  bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--surface-container-low)] dark:hover:bg-[var(--surface-container-high)] text-[var(--muted-foreground)] transition-colors cursor-pointer">
              <RefreshCw size={16} />
            </button>
            <button onClick={handleExport}
              className="p-2 rounded-xl border-[var(--border)]  bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--surface-container-low)] dark:hover:bg-[var(--surface-container-high)] text-[var(--muted-foreground)] transition-colors cursor-pointer">
              <Download size={16} />
            </button>
          </div>
        </div>

        {/* Row 2: Sub-system tabs */}
        <div className="flex items-center gap-1 border-b border-[var(--border)] ">
          {SUBSYSTEMS.map(sys => {
            const isActive = sys.id === selectedSubsystemId;
            const hasCritical = sys.sections.some(s => s.status === "critical" || s.lanes.some(l => l.status === "critical"));
            return (
              <button
                key={sys.id}
                onClick={() => handleSelectSubsystem(sys.id)}
                className={`relative flex items-center gap-1.5 px-4 py-2 text-sm font-semibold transition-colors border-b-2 -mb-px cursor-pointer ${
                  isActive
                    ? "border-[var(--primary)] dark:border-[var(--primary)] text-[var(--primary)] dark:text-[var(--primary)]"
                    : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)] dark:hover:text-[var(--foreground)]"
                }`}
              >
                {sys.name}
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                  isActive ? "bg-[var(--primary)]/15 text-[var(--primary)] /15 dark:text-[var(--primary)]" : "bg-[var(--surface-container-low)] dark:bg-[var(--card)] text-[var(--muted-foreground)]"
                }`}>
                  {sys.uph.toLocaleString()}
                </span>
                {hasCritical && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--state-error)] flex-shrink-0" />
                )}
              </button>
            );
          })}
 {/* Section breadcrumb when drilled in */}
 {section && (
 <>
 <ChevronRight size={14} className="text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] mx-1" />
 <div className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-[var(--primary)] dark:text-[var(--primary)] border-b-2 border-[var(--primary)] dark:border-[var(--primary)] -mb-px">
 {section.name}
 <span className="text-[10px] bg-[var(--primary)]/15 /15 px-1.5 py-0.5 rounded-full">
 {section.uph.toLocaleString()}
 </span>
 </div>
 </>
 )}
 </div>
 </div>

      {/* ── Content ── */}
      <div className="flex-1 p-8 min-h-0 flex flex-col gap-3">

        {/* KPI strip — 3 cards only */}
        <div className="flex-none grid grid-cols-3 gap-3">
          <TopCard
            type="info"
            layout="compact"
            status={currentUph >= targetRate ? "primary" : "error"}
            label="Live Rate"
            value={`${currentUph.toLocaleString()} UPH`}
            subText={currentUph >= targetRate ? "On target" : `${(targetRate - currentUph).toLocaleString()} below target`}
            icon={<Activity size={18} />}
            isLive={true}
          />
          <TopCard
            type="info"
            layout="compact"
            status="warning"
            label="Session Peak"
            value={`${peakUph.toLocaleString()} UPH`}
            subText={`at ${peakTime} · ${Math.round((peakUph / targetRate) * 100)}% of target`}
            icon={<Zap size={18} />}
          />
          <TopCard
            type="info"
            layout="compact"
            status="info"
            label="Shift Average"
            value={`${avgUph.toLocaleString()} UPH`}
            subText={`${shiftHours} elapsed`}
            icon={<TrendingUp size={18} />}
          />
        </div>

 {/* Main area */}
 <div className="flex-1 min-h-0 flex gap-3">

 {/* Left: live chart + zone bar */}
 <div className="flex-1 min-h-0 flex flex-col gap-3">

 {/* Rolling live chart */}
 <div className="flex-1 min-h-0 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-xl p-4 flex flex-col">
 <div className="flex items-center justify-between mb-2 flex-none">
 <div className="flex items-center gap-2">
 <Activity size={15} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 <h2 className="text-sm font-bold text-[var(--foreground)] ">
 {section ? `${section.name}` : subsystem.name} — Live Throughput
 </h2>
 <span className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">· {timeWindow === "1h" ? "5-min" : "1-hr"} intervals</span>
 </div>
 <div className="flex items-center gap-3 text-xs text-[var(--muted-foreground)]">
 <span className="flex items-center gap-1"><span className="w-4 h-0.5 bg-[var(--primary)]  inline-block rounded" />Live UPH</span>
 <span className="flex items-center gap-1"><span className="w-4 h-0 border-t-2 border-dashed border-[var(--state-warning)]/40 inline-block" />Target</span>
 </div>
 </div>
 <div className="flex-1 min-h-0">
 <ResponsiveContainer width="100%" height="100%">
 <ComposedChart data={liveData} margin={{ top: 4, right: 20, bottom: 0, left: 8 }}>
 <CartesianGrid key="grid" strokeDasharray="4 4" stroke="var(--border)" opacity={0.5} />
 <XAxis key="x" dataKey="time" {...sharedAxisProps} tickLine={false} />
 <YAxis key="y" domain={[0, Math.max(2400, targetRate * 1.4)]} {...sharedAxisProps} tickLine={false} axisLine={false} width={52} />
 <Tooltip key="tip" content={<ChartTooltip />} />
 <ReferenceLine key="ref" y={targetRate} stroke="var(--tertiary)" strokeDasharray="8 4" strokeWidth={2}
 label={{ value: `Target ${targetRate.toLocaleString()}`, position: "insideTopRight", fill: "var(--tertiary)", fontSize: 11, fontWeight: 700 }} />
 <Area key="area" type="monotone" dataKey="uph" name="Live UPH" stroke="var(--primary)" strokeWidth={2.5}
 fill={`url(#${gradId})`} dot={{ r: 3, fill: "var(--primary)", strokeWidth: 0 }}
 activeDot={{ r: 5, fill: "var(--primary)", stroke: "var(--card)", strokeWidth: 2 }} />
 </ComposedChart>
 </ResponsiveContainer>
 </div>
 </div>

 {/* Zone/lane bar chart */}
 <div className="flex-none h-[190px] bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-xl p-3 flex flex-col">
 <div className="flex items-center justify-between mb-1.5 flex-none">
 <div className="flex items-center gap-1.5">
 <Target size={13} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 <h3 className="text-xs font-bold text-[var(--foreground)] ">
 {section ? `${section.name} — Lane UPH vs Target` : `${subsystem.name} — Section UPH vs Target`}
 </h3>
 </div>
 {criticalCount > 0 && (
 <div className="flex items-center gap-1 px-2 py-0.5 bg-[var(--state-error)]/10 border border-[var(--state-error)]/40 rounded-lg text-[var(--state-error)] dark:text-[var(--state-error)] text-[10px] font-semibold">
 <AlertTriangle size={10} />
 {criticalCount} bottleneck{criticalCount > 1 ? "s" : ""}
 </div>
 )}
 </div>
 <div className="flex-1 min-h-0">
 <ResponsiveContainer width="100%" height="100%">
 <BarChart data={barItems} margin={{ top: 4, right: 16, bottom: 0, left: 8 }} barGap={4}>
 <CartesianGrid key="grid" strokeDasharray="4 4" stroke="var(--border)" opacity={0.5} horizontal vertical={false} />
 <XAxis key="x" dataKey="name" {...sharedAxisProps} tickLine={false} tick={{ ...sharedAxisProps.tick, fontSize: 10 }} />
 <YAxis key="y" domain={[0, Math.max(2400, targetRate * 1.4)]} {...sharedAxisProps} tickLine={false} axisLine={false} width={44} tick={{ ...sharedAxisProps.tick, fontSize: 10 }} />
 <Tooltip key="tip" content={<ChartTooltip />} />
 <ReferenceLine key="ref" y={targetRate} stroke="var(--tertiary)" strokeDasharray="8 4" strokeWidth={1.5}
 label={{ value: "Target", position: "insideTopRight", fill: "var(--tertiary)", fontSize: 10, fontWeight: 700 }} />
 <Bar key="bar" dataKey="uph" name="UPH" radius={[3, 3, 0, 0]} maxBarSize={48}>
 {barItems.map((item, i) => (
 <Cell key={`cell-${i}`} fill={statusBarFill[item.status as Status]} />
 ))}
 </Bar>
 </BarChart>
 </ResponsiveContainer>
 </div>
 </div>

 </div>

 {/* Right: contribution cards */}
 <div className="flex-none w-[340px] flex flex-col">
 <div className="flex items-center justify-between mb-2 flex-none">
 <div className="min-w-0 flex-1">
 <div className="flex items-center gap-1.5">
 {section && (
 <button onClick={handleBack}
 className="p-1 rounded-lg hover:bg-[var(--surface-container-low)] hover:bg-[var(--surface-container-high)] transition-colors flex-shrink-0"
 title="Back to sub-sections">
 <ChevronLeft size={14} className="text-[var(--muted-foreground)]" />
 </button>
 )}
 <h2 className="text-sm font-bold text-[var(--foreground)]  truncate">{panelTitle}</h2>
 </div>
 <p className="text-[10px] text-[var(--muted-foreground)] mt-0.5 leading-tight">{panelHint}</p>
 </div>
 </div>

 <div className="flex-1 min-h-0 overflow-y-auto">
 <AnimatePresence mode="wait">
 <motion.div
 key={section ? section.id : subsystem.id}
 initial={{ opacity: 0, x: section ? 16 : -16 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0 }}
 transition={{ duration: 0.18 }}
 className="grid grid-cols-2 gap-2 content-start pb-1"
 >
 {section
 ? section.lanes.map(lane => (
 <ContribCard
 key={lane.id}
 name={lane.name}
 uph={lane.uph}
 target={lane.target}
 trend={lane.trend}
 status={lane.status}
 />
 ))
 : subsystem.sections.map(sec => (
 <ContribCard
 key={sec.id}
 name={sec.name}
 uph={sec.uph}
 target={sec.target}
 trend={sec.trend}
 status={sec.status}
 onClick={() => handleSelectSection(sec.id)}
 />
 ))
 }
 </motion.div>
 </AnimatePresence>
 </div>
 </div>

 </div>
 </div>

 <AnimatePresence>
 {showTargetModal && (
 <TargetModal
 current={targetRate}
 onSave={v => {
 setTargetRate(v);
 toast.success("Rate target updated", { description: `New target: ${v.toLocaleString()} UPH — logged to Controls audit trail` });
 }}
 onClose={() => setShowTargetModal(false)}
 />
 )}
 </AnimatePresence>
 </div>
 );
}
