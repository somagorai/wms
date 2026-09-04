import { useState } from "react";
import { ChevronUp, ChevronDown, Star } from "lucide-react";
import { useBookmarks } from "../contexts/BookmarkContext";

export function WorkListMetrics() {
 const { toggleBookmark, isBookmarked } = useBookmarks();
 const [expandedMetrics, setExpandedMetrics] = useState<Set<string>>(
 new Set([
 "Pick Accuracy",
 "Short Picks",
 "Picks Per Hour",
 "Task Completion",
 "Average Cycle Time",
 "Order Completion Rate",
 "Forecast vs Actual Execution",
 "Hot Orders",
 "Aging Orders"
 ])
 );

 // Handle bookmark tile
 const handleBookmarkTile = (e: React.MouseEvent, metricName: string, value: string, iconName: string, data: any) => {
 e.stopPropagation();
 const tileId = `operations-metric-${metricName.toLowerCase().replace(/\s+/g, '-')}`;
 toggleBookmark({
 id: tileId,
 title: metricName,
 type: "operations",
 subType: "metrics",
 icon: iconName,
 data: {
 value,
 ...data
 }
 });
 };

 const toggleMetric = (metric: string) => {
 const newExpanded = new Set(expandedMetrics);
 if (newExpanded.has(metric)) {
 newExpanded.delete(metric);
 } else {
 newExpanded.add(metric);
 }
 setExpandedMetrics(newExpanded);
 };

 const expandAllMetrics = () => {
 setExpandedMetrics(new Set([
 "Pick Accuracy",
 "Short Picks",
 "Picks Per Hour",
 "Task Completion",
 "Average Cycle Time",
 "Order Completion Rate",
 "Forecast vs Actual Execution",
 "Hot Orders",
 "Aging Orders"
 ]));
 };

 const collapseAllMetrics = () => {
 setExpandedMetrics(new Set());
 };

 return (
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] border border-[var(--border)]  rounded-xl p-4">
 {/* Header with Expand/Collapse All buttons */}
 <div className="flex items-center justify-end gap-2 mb-3">
 <button
 onClick={expandAllMetrics}
 className="px-2 py-1 text-xs bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)] text-[var(--foreground)] rounded hover:bg-[var(--surface-container-high)] transition-colors"
 >
 Expand All
 </button>
 <button
 onClick={collapseAllMetrics}
 className="px-2 py-1 text-xs bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)] text-[var(--foreground)] rounded hover:bg-[var(--surface-container-high)] transition-colors"
 >
 Collapse All
 </button>
 </div>
 {/* Grid Layout for Metrics - Auto-fit based on available space */}
 <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3">

 {/* Pick Accuracy */}
 <div>
 <div className="flex items-center justify-between mb-1.5">
 <h4 className="text-[10px] font-semibold text-[var(--foreground)]  uppercase tracking-wide">Pick Accuracy</h4>
 <button
 onClick={(e) => handleBookmarkTile(e, "Pick Accuracy", "98.7%", "CheckCircle2", { trend: "+0.5% today" })}
 className="p-1 hover:bg-[var(--surface-container-high)] rounded transition-colors"
 title={isBookmarked("operations-metric-pick-accuracy") ? "Remove bookmark" : "Add bookmark"}
 >
 <Star className={`${isBookmarked("operations-metric-pick-accuracy") ? "fill-[var(--primary)] dark:fill-[var(--primary)]" : ""} text-[var(--primary)] dark:text-[var(--primary)]`} size={12} />
 </button>
 </div>
 <div className="bg-[var(--surface-container-low)] dark:bg-[var(--card)] border border-[var(--border)]  rounded-lg p-2">
 <div
 className="text-center mb-2 pb-2 border-b border-[var(--border)]  cursor-pointer"
 onClick={() => toggleMetric("Pick Accuracy")}
 >
 <div className="flex items-center justify-center gap-1.5 mb-1.5">
 <div className="text-[var(--muted-foreground)] text-[10px] font-medium">Total</div>
 {expandedMetrics.has("Pick Accuracy") ? (
 <ChevronUp className="text-[var(--muted-foreground)]" size={12} />
 ) : (
 <ChevronDown className="text-[var(--muted-foreground)]" size={12} />
 )}
 </div>
 <div className="text-xl font-bold text-[var(--foreground)]  mb-0.5">98.7%</div>
 <div className="text-[var(--primary)] dark:text-[var(--primary)] text-[10px]">+0.5% today</div>
 </div>
 {expandedMetrics.has("Pick Accuracy") && (
 <div className="space-y-1">
 <div className="flex items-center justify-between py-1 px-1.5 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] rounded text-[10px]">
 <span className="text-[var(--muted-foreground)] font-medium">Pick</span>
 <div className="flex items-center gap-1.5">
 <span className="text-xs font-bold text-[var(--foreground)] ">99.2%</span>
 <span className="text-[var(--primary)] dark:text-[var(--primary)] text-[9px] w-14 text-right">Excellent</span>
 </div>
 </div>
 <div className="flex items-center justify-between py-1.5 px-2 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] rounded">
 <span className="text-[var(--muted-foreground)] text-xs font-medium">Replen</span>
 <div className="flex items-center gap-1.5">
 <span className="text-xs font-bold text-[var(--foreground)] ">98.1%</span>
 <span className="text-[var(--primary)] dark:text-[var(--primary)] text-[9px] w-14 text-right">On target</span>
 </div>
 </div>
 <div className="flex items-center justify-between py-1.5 px-2 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] rounded">
 <span className="text-[var(--muted-foreground)] text-xs font-medium">Cycle Cnt</span>
 <div className="flex items-center gap-1.5">
 <span className="text-xs font-bold text-[var(--foreground)] ">97.8%</span>
 <span className="text-[var(--primary)] dark:text-[var(--primary)] text-[9px] w-14 text-right">Good</span>
 </div>
 </div>
 <div className="flex items-center justify-between py-1.5 px-2 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] rounded">
 <span className="text-[var(--muted-foreground)] text-xs font-medium">Inspect</span>
 <div className="flex items-center gap-1.5">
 <span className="text-xs font-bold text-[var(--foreground)] ">98.9%</span>
 <span className="text-[var(--primary)] dark:text-[var(--primary)] text-[9px] w-14 text-right">Excellent</span>
 </div>
 </div>
 </div>
 )}
 </div>
 </div>

 {/* Short Picks */}
 <div>
 <div className="flex items-center justify-between mb-1.5">
 <h4 className="text-[10px] font-semibold text-[var(--foreground)]  uppercase tracking-wide">Short Picks</h4>
 <button
 onClick={(e) => handleBookmarkTile(e, "Short Picks", "1.3%", "AlertTriangle", { trend: "Within threshold" })}
 className="p-1 hover:bg-[var(--surface-container-high)] rounded transition-colors"
 title={isBookmarked("operations-metric-short-picks") ? "Remove bookmark" : "Add bookmark"}
 >
 <Star className={`${isBookmarked("operations-metric-short-picks") ? "fill-orange-500" : ""} text-[var(--state-warning)]`} size={12} />
 </button>
 </div>
 <div className="bg-[var(--surface-container-low)] dark:bg-[var(--card)] border border-[var(--border)]  rounded-lg p-2">
 <div
 className="text-center mb-2 pb-2 border-b border-[var(--border)]  cursor-pointer"
 onClick={() => toggleMetric("Short Picks")}
 >
 <div className="flex items-center justify-center gap-1.5 mb-1.5">
 <div className="text-[var(--muted-foreground)] text-[10px] font-medium">Total</div>
 {expandedMetrics.has("Short Picks") ? (
 <ChevronUp className="text-[var(--muted-foreground)]" size={12} />
 ) : (
 <ChevronDown className="text-[var(--muted-foreground)]" size={12} />
 )}
 </div>
 <div className="text-xl font-bold text-[var(--foreground)]  mb-0.5">1.3%</div>
 <div className="text-[var(--state-warning)] text-[10px]">Within threshold</div>
 </div>
 {expandedMetrics.has("Short Picks") && (
 <div className="space-y-1">
 <div className="flex items-center justify-between py-1 px-1.5 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] rounded text-[10px]">
 <span className="text-[var(--muted-foreground)] font-medium">Pick</span>
 <div className="flex items-center gap-1.5">
 <span className="text-xs font-bold text-[var(--foreground)] ">0.8%</span>
 <span className="text-[var(--primary)] dark:text-[var(--primary)] text-[9px] w-14 text-right">Low</span>
 </div>
 </div>
 <div className="flex items-center justify-between py-1.5 px-2 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] rounded">
 <span className="text-[var(--muted-foreground)] text-xs font-medium">Replen</span>
 <div className="flex items-center gap-1.5">
 <span className="text-xs font-bold text-[var(--foreground)] ">1.9%</span>
 <span className="text-[var(--state-warning)] text-[9px] w-14 text-right">Moderate</span>
 </div>
 </div>
 <div className="flex items-center justify-between py-1.5 px-2 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] rounded">
 <span className="text-[var(--muted-foreground)] text-xs font-medium">Cycle Cnt</span>
 <div className="flex items-center gap-1.5">
 <span className="text-xs font-bold text-[var(--foreground)] ">0.0%</span>
 <span className="text-[var(--primary)] dark:text-[var(--primary)] text-[9px] w-14 text-right">None</span>
 </div>
 </div>
 <div className="flex items-center justify-between py-1.5 px-2 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] rounded">
 <span className="text-[var(--muted-foreground)] text-xs font-medium">Inspect</span>
 <div className="flex items-center gap-1.5">
 <span className="text-xs font-bold text-[var(--foreground)] ">2.1%</span>
 <span className="text-[var(--state-warning)] text-[9px] w-14 text-right">Moderate</span>
 </div>
 </div>
 </div>
 )}
 </div>
 </div>

 {/* Picks Per Hour */}
 <div>
 <div className="flex items-center justify-between mb-1.5">
 <h4 className="text-[10px] font-semibold text-[var(--foreground)]  uppercase tracking-wide">Picks Per Hour</h4>
 <button
 onClick={(e) => handleBookmarkTile(e, "Picks Per Hour", "142", "TrendingUp", { trend: "+8% vs avg" })}
 className="p-1 hover:bg-[var(--surface-container-high)] rounded transition-colors"
 title={isBookmarked("operations-metric-picks-per-hour") ? "Remove bookmark" : "Add bookmark"}
 >
 <Star className={`${isBookmarked("operations-metric-picks-per-hour") ? "fill-[var(--primary)] dark:fill-[var(--primary)]" : ""} text-[var(--primary)] dark:text-[var(--primary)]`} size={12} />
 </button>
 </div>
 <div className="bg-[var(--surface-container-low)] dark:bg-[var(--card)] border border-[var(--border)]  rounded-lg p-2">
 <div
 className="text-center mb-2 pb-2 border-b border-[var(--border)]  cursor-pointer"
 onClick={() => toggleMetric("Picks Per Hour")}
 >
 <div className="flex items-center justify-center gap-1.5 mb-1.5">
 <div className="text-[var(--muted-foreground)] text-[10px] font-medium">Total</div>
 {expandedMetrics.has("Picks Per Hour") ? (
 <ChevronUp className="text-[var(--muted-foreground)]" size={12} />
 ) : (
 <ChevronDown className="text-[var(--muted-foreground)]" size={12} />
 )}
 </div>
 <div className="text-xl font-bold text-[var(--foreground)]  mb-0.5">142</div>
 <div className="text-[var(--primary)] dark:text-[var(--primary)] text-[10px]">+8% vs avg</div>
 </div>
 {expandedMetrics.has("Picks Per Hour") && (
 <div className="space-y-1">
 <div className="flex items-center justify-between py-1 px-1.5 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] rounded text-[10px]">
 <span className="text-[var(--muted-foreground)] font-medium">Pick</span>
 <div className="flex items-center gap-1.5">
 <span className="text-xs font-bold text-[var(--foreground)] ">156</span>
 <span className="text-[var(--primary)] dark:text-[var(--primary)] text-[9px] w-14 text-right">+12%</span>
 </div>
 </div>
 <div className="flex items-center justify-between py-1.5 px-2 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] rounded">
 <span className="text-[var(--muted-foreground)] text-xs font-medium">Replen</span>
 <div className="flex items-center gap-1.5">
 <span className="text-xs font-bold text-[var(--foreground)] ">128</span>
 <span className="text-[var(--primary)] dark:text-[var(--primary)] text-[9px] w-14 text-right">+5%</span>
 </div>
 </div>
 <div className="flex items-center justify-between py-1.5 px-2 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] rounded">
 <span className="text-[var(--muted-foreground)] text-xs font-medium">Cycle Cnt</span>
 <div className="flex items-center gap-1.5">
 <span className="text-xs font-bold text-[var(--foreground)] ">95</span>
 <span className="text-[var(--primary)] dark:text-[var(--primary)] text-[9px] w-14 text-right">+3%</span>
 </div>
 </div>
 <div className="flex items-center justify-between py-1.5 px-2 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] rounded">
 <span className="text-[var(--muted-foreground)] text-xs font-medium">Inspect</span>
 <div className="flex items-center gap-1.5">
 <span className="text-xs font-bold text-[var(--foreground)] ">118</span>
 <span className="text-[var(--primary)] dark:text-[var(--primary)] text-[9px] w-14 text-right">+7%</span>
 </div>
 </div>
 </div>
 )}
 </div>
 </div>

 {/* Task Completion */}
 <div>
 <div className="flex items-center justify-between mb-1.5">
 <h4 className="text-[10px] font-semibold text-[var(--foreground)]  uppercase tracking-wide">Task Completion</h4>
 <button
 onClick={(e) => handleBookmarkTile(e, "Task Completion", "96.4%", "CheckCircle2", { trend: "On target" })}
 className="p-1 hover:bg-[var(--surface-container-high)] rounded transition-colors"
 title={isBookmarked("operations-metric-task-completion") ? "Remove bookmark" : "Add bookmark"}
 >
 <Star className={`${isBookmarked("operations-metric-task-completion") ? "fill-[var(--primary)] dark:fill-[var(--primary)]" : ""} text-[var(--primary)] dark:text-[var(--primary)]`} size={12} />
 </button>
 </div>
 <div className="bg-[var(--surface-container-low)] dark:bg-[var(--card)] border border-[var(--border)]  rounded-lg p-2">
 <div
 className="text-center mb-2 pb-2 border-b border-[var(--border)]  cursor-pointer"
 onClick={() => toggleMetric("Task Completion")}
 >
 <div className="flex items-center justify-center gap-1.5 mb-1.5">
 <div className="text-[var(--muted-foreground)] text-[10px] font-medium">Total</div>
 {expandedMetrics.has("Task Completion") ? (
 <ChevronUp className="text-[var(--muted-foreground)]" size={12} />
 ) : (
 <ChevronDown className="text-[var(--muted-foreground)]" size={12} />
 )}
 </div>
 <div className="text-xl font-bold text-[var(--foreground)]  mb-0.5">96.4%</div>
 <div className="text-[var(--primary)] dark:text-[var(--primary)] text-[10px]">On target</div>
 </div>
 {expandedMetrics.has("Task Completion") && (
 <div className="space-y-1">
 <div className="flex items-center justify-between py-1 px-1.5 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] rounded text-[10px]">
 <span className="text-[var(--muted-foreground)] font-medium">Pick</span>
 <div className="flex items-center gap-1.5">
 <span className="text-xs font-bold text-[var(--foreground)] ">97.1%</span>
 <span className="text-[var(--primary)] dark:text-[var(--primary)] text-[9px] w-14 text-right">Excellent</span>
 </div>
 </div>
 <div className="flex items-center justify-between py-1.5 px-2 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] rounded">
 <span className="text-[var(--muted-foreground)] text-xs font-medium">Replen</span>
 <div className="flex items-center gap-1.5">
 <span className="text-xs font-bold text-[var(--foreground)] ">95.8%</span>
 <span className="text-[var(--primary)] dark:text-[var(--primary)] text-[9px] w-14 text-right">Good</span>
 </div>
 </div>
 <div className="flex items-center justify-between py-1.5 px-2 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] rounded">
 <span className="text-[var(--muted-foreground)] text-xs font-medium">Cycle Cnt</span>
 <div className="flex items-center gap-1.5">
 <span className="text-xs font-bold text-[var(--foreground)] ">96.2%</span>
 <span className="text-[var(--primary)] dark:text-[var(--primary)] text-[9px] w-14 text-right">Good</span>
 </div>
 </div>
 <div className="flex items-center justify-between py-1.5 px-2 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] rounded">
 <span className="text-[var(--muted-foreground)] text-xs font-medium">Inspect</span>
 <div className="flex items-center gap-1.5">
 <span className="text-xs font-bold text-[var(--foreground)] ">95.5%</span>
 <span className="text-[var(--primary)] dark:text-[var(--primary)] text-[9px] w-14 text-right">Good</span>
 </div>
 </div>
 </div>
 )}
 </div>
 </div>

 {/* Average Cycle Time */}
 <div>
 <div className="flex items-center justify-between mb-1.5">
 <h4 className="text-[10px] font-semibold text-[var(--foreground)]  uppercase tracking-wide">Average Cycle Time</h4>
 <button
 onClick={(e) => handleBookmarkTile(e, "Average Cycle Time", "42m", "Clock", { trend: "-5% vs target" })}
 className="p-1 hover:bg-[var(--surface-container-high)] rounded transition-colors"
 title={isBookmarked("operations-metric-average-cycle-time") ? "Remove bookmark" : "Add bookmark"}
 >
 <Star className={`${isBookmarked("operations-metric-average-cycle-time") ? "fill-[var(--primary)] dark:fill-[var(--primary)]" : ""} text-[var(--primary)] dark:text-[var(--primary)]`} size={12} />
 </button>
 </div>
 <div className="bg-[var(--surface-container-low)] dark:bg-[var(--card)] border border-[var(--border)]  rounded-lg p-2">
 <div
 className="text-center mb-2 pb-2 border-b border-[var(--border)]  cursor-pointer"
 onClick={() => toggleMetric("Average Cycle Time")}
 >
 <div className="flex items-center justify-center gap-1.5 mb-1.5">
 <div className="text-[var(--muted-foreground)] text-[10px] font-medium">Total</div>
 {expandedMetrics.has("Average Cycle Time") ? (
 <ChevronUp className="text-[var(--muted-foreground)]" size={12} />
 ) : (
 <ChevronDown className="text-[var(--muted-foreground)]" size={12} />
 )}
 </div>
 <div className="text-xl font-bold text-[var(--foreground)]  mb-0.5">42m</div>
 <div className="text-[var(--primary)] dark:text-[var(--primary)] text-[10px]">-5% vs target</div>
 </div>
 {expandedMetrics.has("Average Cycle Time") && (
 <div className="space-y-1">
 <div className="flex items-center justify-between py-1 px-1.5 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] rounded text-[10px]">
 <span className="text-[var(--muted-foreground)] font-medium">Pick</span>
 <div className="flex items-center gap-1.5">
 <span className="text-xs font-bold text-[var(--foreground)] ">24m</span>
 <span className="text-[var(--primary)] dark:text-[var(--primary)] text-[9px] w-14 text-right">Fast</span>
 </div>
 </div>
 <div className="flex items-center justify-between py-1.5 px-2 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] rounded">
 <span className="text-[var(--muted-foreground)] text-xs font-medium">Replen</span>
 <div className="flex items-center gap-1.5">
 <span className="text-xs font-bold text-[var(--foreground)] ">18m</span>
 <span className="text-[var(--primary)] dark:text-[var(--primary)] text-[9px] w-14 text-right">Fast</span>
 </div>
 </div>
 <div className="flex items-center justify-between py-1.5 px-2 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] rounded">
 <span className="text-[var(--muted-foreground)] text-xs font-medium">Cycle Cnt</span>
 <div className="flex items-center gap-1.5">
 <span className="text-xs font-bold text-[var(--foreground)] ">15m</span>
 <span className="text-[var(--primary)] dark:text-[var(--primary)] text-[9px] w-14 text-right">Fast</span>
 </div>
 </div>
 <div className="flex items-center justify-between py-1.5 px-2 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] rounded">
 <span className="text-[var(--muted-foreground)] text-xs font-medium">Inspect</span>
 <div className="flex items-center gap-1.5">
 <span className="text-xs font-bold text-[var(--foreground)] ">32m</span>
 <span className="text-[var(--primary)] dark:text-[var(--primary)] text-[9px] w-14 text-right">Moderate</span>
 </div>
 </div>
 </div>
 )}
 </div>
 </div>

 {/* Order Completion Rate */}
 <div>
 <div className="flex items-center justify-between mb-1.5">
 <h4 className="text-[10px] font-semibold text-[var(--foreground)]  uppercase tracking-wide">Order Completion Rate</h4>
 <button
 onClick={(e) => handleBookmarkTile(e, "Order Completion Rate", "94.2%", "Package", { trend: "+2.3% today" })}
 className="p-1 hover:bg-[var(--surface-container-high)] rounded transition-colors"
 title={isBookmarked("operations-metric-order-completion-rate") ? "Remove bookmark" : "Add bookmark"}
 >
 <Star className={`${isBookmarked("operations-metric-order-completion-rate") ? "fill-[var(--primary)] dark:fill-[var(--primary)]" : ""} text-[var(--primary)] dark:text-[var(--primary)]`} size={12} />
 </button>
 </div>
 <div className="bg-[var(--surface-container-low)] dark:bg-[var(--card)] border border-[var(--border)]  rounded-lg p-2">
 <div
 className="text-center mb-2 pb-2 border-b border-[var(--border)]  cursor-pointer"
 onClick={() => toggleMetric("Order Completion Rate")}
 >
 <div className="flex items-center justify-center gap-1.5 mb-1.5">
 <div className="text-[var(--muted-foreground)] text-[10px] font-medium">Total</div>
 {expandedMetrics.has("Order Completion Rate") ? (
 <ChevronUp className="text-[var(--muted-foreground)]" size={12} />
 ) : (
 <ChevronDown className="text-[var(--muted-foreground)]" size={12} />
 )}
 </div>
 <div className="text-xl font-bold text-[var(--foreground)]  mb-0.5">94.2%</div>
 <div className="text-[var(--primary)] dark:text-[var(--primary)] text-[10px]">+2.3% today</div>
 </div>
 {expandedMetrics.has("Order Completion Rate") && (
 <div className="space-y-1">
 <div className="flex items-center justify-between py-1 px-1.5 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] rounded text-[10px]">
 <span className="text-[var(--muted-foreground)] font-medium">Pick</span>
 <div className="flex items-center gap-1.5">
 <span className="text-xs font-bold text-[var(--foreground)] ">95.8%</span>
 <span className="text-[var(--primary)] dark:text-[var(--primary)] text-[9px] w-14 text-right">+3.1%</span>
 </div>
 </div>
 <div className="flex items-center justify-between py-1.5 px-2 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] rounded">
 <span className="text-[var(--muted-foreground)] text-xs font-medium">Replen</span>
 <div className="flex items-center gap-1.5">
 <span className="text-xs font-bold text-[var(--foreground)] ">93.5%</span>
 <span className="text-[var(--primary)] dark:text-[var(--primary)] text-[9px] w-14 text-right">+1.8%</span>
 </div>
 </div>
 <div className="flex items-center justify-between py-1.5 px-2 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] rounded">
 <span className="text-[var(--muted-foreground)] text-xs font-medium">Cycle Cnt</span>
 <div className="flex items-center gap-1.5">
 <span className="text-xs font-bold text-[var(--foreground)] ">92.7%</span>
 <span className="text-[var(--primary)] dark:text-[var(--primary)] text-[9px] w-14 text-right">+2.0%</span>
 </div>
 </div>
 <div className="flex items-center justify-between py-1.5 px-2 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] rounded">
 <span className="text-[var(--muted-foreground)] text-xs font-medium">Inspect</span>
 <div className="flex items-center gap-1.5">
 <span className="text-xs font-bold text-[var(--foreground)] ">94.1%</span>
 <span className="text-[var(--primary)] dark:text-[var(--primary)] text-[9px] w-14 text-right">+2.5%</span>
 </div>
 </div>
 </div>
 )}
 </div>
 </div>

 {/* Forecast vs Actual Execution */}
 <div>
 <div className="flex items-center justify-between mb-1.5">
 <h4 className="text-[10px] font-semibold text-[var(--foreground)]  uppercase tracking-wide">Forecast vs Actual Execution</h4>
 <button
 onClick={(e) => handleBookmarkTile(e, "Forecast vs Actual Execution", "97.8%", "BarChart3", { trend: "On target" })}
 className="p-1 hover:bg-[var(--surface-container-high)] rounded transition-colors"
 title={isBookmarked("operations-metric-forecast-vs-actual-execution") ? "Remove bookmark" : "Add bookmark"}
 >
 <Star className={`${isBookmarked("operations-metric-forecast-vs-actual-execution") ? "fill-[var(--primary)] dark:fill-[var(--primary)]" : ""} text-[var(--primary)] dark:text-[var(--primary)]`} size={12} />
 </button>
 </div>
 <div className="bg-[var(--surface-container-low)] dark:bg-[var(--card)] border border-[var(--border)]  rounded-lg p-2">
 <div
 className="text-center mb-2 pb-2 border-b border-[var(--border)]  cursor-pointer"
 onClick={() => toggleMetric("Forecast vs Actual Execution")}
 >
 <div className="flex items-center justify-center gap-1.5 mb-1.5">
 <div className="text-[var(--muted-foreground)] text-[10px] font-medium">Total</div>
 {expandedMetrics.has("Forecast vs Actual Execution") ? (
 <ChevronUp className="text-[var(--muted-foreground)]" size={12} />
 ) : (
 <ChevronDown className="text-[var(--muted-foreground)]" size={12} />
 )}
 </div>
 <div className="text-xl font-bold text-[var(--foreground)]  mb-0.5">97.8%</div>
 <div className="text-[var(--primary)] dark:text-[var(--primary)] text-[10px]">On target</div>
 </div>
 {expandedMetrics.has("Forecast vs Actual Execution") && (
 <div className="space-y-1">
 <div className="flex items-center justify-between py-1 px-1.5 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] rounded text-[10px]">
 <span className="text-[var(--muted-foreground)] font-medium">Pick</span>
 <div className="flex items-center gap-1.5">
 <span className="text-xs font-bold text-[var(--foreground)] ">98.5%</span>
 <span className="text-[var(--primary)] dark:text-[var(--primary)] text-[9px] w-14 text-right">Excellent</span>
 </div>
 </div>
 <div className="flex items-center justify-between py-1.5 px-2 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] rounded">
 <span className="text-[var(--muted-foreground)] text-xs font-medium">Replen</span>
 <div className="flex items-center gap-1.5">
 <span className="text-xs font-bold text-[var(--foreground)] ">97.2%</span>
 <span className="text-[var(--primary)] dark:text-[var(--primary)] text-[9px] w-14 text-right">Good</span>
 </div>
 </div>
 <div className="flex items-center justify-between py-1.5 px-2 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] rounded">
 <span className="text-[var(--muted-foreground)] text-xs font-medium">Cycle Cnt</span>
 <div className="flex items-center gap-1.5">
 <span className="text-xs font-bold text-[var(--foreground)] ">96.8%</span>
 <span className="text-[var(--primary)] dark:text-[var(--primary)] text-[9px] w-14 text-right">Good</span>
 </div>
 </div>
 <div className="flex items-center justify-between py-1.5 px-2 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] rounded">
 <span className="text-[var(--muted-foreground)] text-xs font-medium">Inspect</span>
 <div className="flex items-center gap-1.5">
 <span className="text-xs font-bold text-[var(--foreground)] ">98.1%</span>
 <span className="text-[var(--primary)] dark:text-[var(--primary)] text-[9px] w-14 text-right">Excellent</span>
 </div>
 </div>
 </div>
 )}
 </div>
 </div>

 {/* Hot Orders */}
 <div>
 <div className="flex items-center justify-between mb-1.5">
 <h4 className="text-[10px] font-semibold text-[var(--foreground)]  uppercase tracking-wide">Hot Orders</h4>
 <button
 onClick={(e) => handleBookmarkTile(e, "Hot Orders", "23", "Flame", { trend: "Requires attention" })}
 className="p-1 hover:bg-[var(--surface-container-high)] rounded transition-colors"
 title={isBookmarked("operations-metric-hot-orders") ? "Remove bookmark" : "Add bookmark"}
 >
 <Star className={`${isBookmarked("operations-metric-hot-orders") ? "fill-orange-500" : ""} text-[var(--state-warning)]`} size={12} />
 </button>
 </div>
 <div className="bg-[var(--surface-container-low)] dark:bg-[var(--card)] border border-[var(--border)]  rounded-lg p-2">
 <div
 className="text-center mb-2 pb-2 border-b border-[var(--border)]  cursor-pointer"
 onClick={() => toggleMetric("Hot Orders")}
 >
 <div className="flex items-center justify-center gap-1.5 mb-1.5">
 <div className="text-[var(--muted-foreground)] text-[10px] font-medium">Total</div>
 {expandedMetrics.has("Hot Orders") ? (
 <ChevronUp className="text-[var(--muted-foreground)]" size={12} />
 ) : (
 <ChevronDown className="text-[var(--muted-foreground)]" size={12} />
 )}
 </div>
 <div className="text-xl font-bold text-[var(--foreground)]  mb-0.5">23</div>
 <div className="text-[var(--state-warning)] text-[10px]">Requires attention</div>
 </div>
 {expandedMetrics.has("Hot Orders") && (
 <div className="space-y-1">
 <div className="flex items-center justify-between py-1 px-1.5 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] rounded text-[10px]">
 <span className="text-[var(--muted-foreground)] font-medium">Pick</span>
 <div className="flex items-center gap-1.5">
 <span className="text-xs font-bold text-[var(--foreground)] ">12</span>
 <span className="text-[var(--state-warning)] text-[9px] w-14 text-right">High priority</span>
 </div>
 </div>
 <div className="flex items-center justify-between py-1.5 px-2 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] rounded">
 <span className="text-[var(--muted-foreground)] text-xs font-medium">Replen</span>
 <div className="flex items-center gap-1.5">
 <span className="text-xs font-bold text-[var(--foreground)] ">6</span>
 <span className="text-[var(--state-warning)] text-[9px] w-14 text-right">Moderate</span>
 </div>
 </div>
 <div className="flex items-center justify-between py-1.5 px-2 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] rounded">
 <span className="text-[var(--muted-foreground)] text-xs font-medium">Cycle Cnt</span>
 <div className="flex items-center gap-1.5">
 <span className="text-xs font-bold text-[var(--foreground)] ">2</span>
 <span className="text-[var(--primary)] dark:text-[var(--primary)] text-[9px] w-14 text-right">Low</span>
 </div>
 </div>
 <div className="flex items-center justify-between py-1.5 px-2 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] rounded">
 <span className="text-[var(--muted-foreground)] text-xs font-medium">Inspect</span>
 <div className="flex items-center gap-1.5">
 <span className="text-xs font-bold text-[var(--foreground)] ">3</span>
 <span className="text-[var(--state-warning)] text-[9px] w-14 text-right">Low</span>
 </div>
 </div>
 </div>
 )}
 </div>
 </div>

 {/* Aging Orders */}
 <div>
 <div className="flex items-center justify-between mb-1.5">
 <h4 className="text-[10px] font-semibold text-[var(--foreground)]  uppercase tracking-wide">Aging Orders</h4>
 <button
 onClick={(e) => handleBookmarkTile(e, "Aging Orders", "18", "Clock", { trend: "> 2hr elapsed" })}
 className="p-1 hover:bg-[var(--surface-container-high)] rounded transition-colors"
 title={isBookmarked("operations-metric-aging-orders") ? "Remove bookmark" : "Add bookmark"}
 >
 <Star className={`${isBookmarked("operations-metric-aging-orders") ? "fill-orange-500" : ""} text-[var(--state-warning)]`} size={12} />
 </button>
 </div>
 <div className="bg-[var(--surface-container-low)] dark:bg-[var(--card)] border border-[var(--border)]  rounded-lg p-2">
 <div
 className="text-center mb-2 pb-2 border-b border-[var(--border)]  cursor-pointer"
 onClick={() => toggleMetric("Aging Orders")}
 >
 <div className="flex items-center justify-center gap-1.5 mb-1.5">
 <div className="text-[var(--muted-foreground)] text-[10px] font-medium">Total</div>
 {expandedMetrics.has("Aging Orders") ? (
 <ChevronUp className="text-[var(--muted-foreground)]" size={12} />
 ) : (
 <ChevronDown className="text-[var(--muted-foreground)]" size={12} />
 )}
 </div>
 <div className="text-xl font-bold text-[var(--foreground)]  mb-0.5">18</div>
 <div className="text-[var(--state-warning)] text-[10px]">&gt; 2hr elapsed</div>
 </div>
 {expandedMetrics.has("Aging Orders") && (
 <div className="space-y-1">
 <div className="flex items-center justify-between py-1 px-1.5 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] rounded text-[10px]">
 <span className="text-[var(--muted-foreground)] font-medium">Pick</span>
 <div className="flex items-center gap-1.5">
 <span className="text-xs font-bold text-[var(--foreground)] ">8</span>
 <span className="text-[var(--state-warning)] text-[9px] w-14 text-right">Review needed</span>
 </div>
 </div>
 <div className="flex items-center justify-between py-1.5 px-2 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] rounded">
 <span className="text-[var(--muted-foreground)] text-xs font-medium">Replen</span>
 <div className="flex items-center gap-1.5">
 <span className="text-xs font-bold text-[var(--foreground)] ">5</span>
 <span className="text-[var(--state-warning)] text-[9px] w-14 text-right">Review needed</span>
 </div>
 </div>
 <div className="flex items-center justify-between py-1.5 px-2 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] rounded">
 <span className="text-[var(--muted-foreground)] text-xs font-medium">Cycle Cnt</span>
 <div className="flex items-center gap-1.5">
 <span className="text-xs font-bold text-[var(--foreground)] ">3</span>
 <span className="text-[var(--primary)] dark:text-[var(--primary)] text-[9px] w-14 text-right">Low</span>
 </div>
 </div>
 <div className="flex items-center justify-between py-1.5 px-2 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] rounded">
 <span className="text-[var(--muted-foreground)] text-xs font-medium">Inspect</span>
 <div className="flex items-center gap-1.5">
 <span className="text-xs font-bold text-[var(--foreground)] ">2</span>
 <span className="text-[var(--primary)] dark:text-[var(--primary)] text-[9px] w-14 text-right">Low</span>
 </div>
 </div>
 </div>
 )}
 </div>
 </div>

 </div>
 </div>
 );
}
