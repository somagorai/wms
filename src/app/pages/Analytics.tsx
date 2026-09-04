import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Link } from "react-router-dom";
import { Home, ChevronRight, BarChart2, RefreshCw, Download } from "lucide-react";
import { toast } from "sonner";

const data = [
 { name: "Mon", value: 400, projects: 24 },
 { name: "Tue", value: 300, projects: 13 },
 { name: "Wed", value: 600, projects: 38 },
 { name: "Thu", value: 800, projects: 39 },
 { name: "Fri", value: 500, projects: 48 },
 { name: "Sat", value: 200, projects: 12 },
 { name: "Sun", value: 100, projects: 8 },
];

export function Analytics() {
 return (
 <div className="flex flex-col min-h-screen">
 {/* Sticky Header */}
 <div className="sticky top-0 z-40 bg-[var(--background)]/95 backdrop-blur-md text-[var(--foreground)] border-b border-[var(--border)] px-8 pt-6 pb-4">
 <div className="flex items-center justify-between gap-4">
 <nav className="flex items-center gap-2 text-sm">
 <Link to="/app/home" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] dark:hover:text-[var(--primary)] transition-colors flex items-center gap-1">
 <Home size={14} />Home
 </Link>
 <ChevronRight size={14} className="text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]" />
 <Link to="/app/navigation?section=reports" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] dark:hover:text-[var(--primary)] transition-colors">
 Business Insights
 </Link>
 <ChevronRight size={14} className="text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]" />
 <span className="text-[var(--foreground)]  font-semibold text-lg flex items-center gap-2">
 <BarChart2 size={20} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 Analytics
 </span>
 </nav>
 <div className="flex items-center gap-2">
 <button onClick={() => toast.info("Refreshed")} className="p-2 rounded-lg border-[var(--border)]  bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--surface-container-low)] dark:hover:bg-[var(--surface-container-high)] text-[var(--muted-foreground)] transition-colors" title="Refresh">
 <RefreshCw size={16} />
 </button>
 <button onClick={() => toast.info("Exported")} className="p-2 rounded-lg border-[var(--border)]  bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--surface-container-low)] dark:hover:bg-[var(--surface-container-high)] text-[var(--muted-foreground)] transition-colors" title="Export">
 <Download size={16} />
 </button>
 </div>
 </div>
 </div>

 {/* Content */}
 <div className="flex-1 overflow-y-auto p-8">
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 {/* Line Chart */}
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)]  rounded-xl p-6">
 <h3 className="text-xl font-semibold text-[var(--foreground)]  mb-6">User Activity</h3>
 <ResponsiveContainer width="100%" height={300}>
 <LineChart data={data}>
 <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" className="dark:stroke-[var(--border)] stroke-[var(--border)]" />
 <XAxis dataKey="name" stroke="var(--muted-foreground)" className="dark:stroke-[var(--muted-foreground)] stroke-[var(--outline)]" />
 <YAxis stroke="var(--muted-foreground)" className="dark:stroke-[var(--muted-foreground)] stroke-[var(--outline)]" />
 <Tooltip cursor={{ fill: "var(--chart-cursor-hover, color-mix(in srgb, var(--primary) 20%, transparent))" }} contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--foreground)" }} />
 <Line type="monotone" dataKey="value" stroke="var(--chart-blue)" strokeWidth={2} />
 </LineChart>
 </ResponsiveContainer>
 </div>

 {/* Bar Chart */}
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)]  rounded-xl p-6">
 <h3 className="text-xl font-semibold text-[var(--foreground)]  mb-6">Project Distribution</h3>
 <ResponsiveContainer width="100%" height={300}>
 <BarChart data={data}>
 <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" className="dark:stroke-[var(--border)] stroke-[var(--border)]" />
 <XAxis dataKey="name" stroke="var(--muted-foreground)" className="dark:stroke-[var(--muted-foreground)] stroke-[var(--outline)]" />
 <YAxis stroke="var(--muted-foreground)" className="dark:stroke-[var(--muted-foreground)] stroke-[var(--outline)]" />
 <Tooltip cursor={{ fill: "var(--chart-cursor-hover, color-mix(in srgb, var(--primary) 20%, transparent))" }} contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--foreground)" }} />
 <Bar dataKey="projects" fill="var(--chart-teal)" className="dark:fill-[var(--chart-teal)] fill-[var(--chart-teal)]" />
 </BarChart>
 </ResponsiveContainer>
 </div>
 </div>

 {/* Metrics */}
 <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)]  rounded-xl p-6">
 <p className="text-[var(--muted-foreground)] text-sm mb-2">Total Views</p>
 <p className="text-3xl font-bold text-[var(--foreground)] ">12,458</p>
 <p className="text-[var(--state-on-success-container)] dark:text-[var(--state-success)] text-sm mt-2">+23% from last week</p>
 </div>
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)]  rounded-xl p-6">
 <p className="text-[var(--muted-foreground)] text-sm mb-2">Avg. Session</p>
 <p className="text-3xl font-bold text-[var(--foreground)] ">4m 32s</p>
 <p className="text-[var(--state-on-success-container)] dark:text-[var(--state-success)] text-sm mt-2">+5% from last week</p>
 </div>
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)]  rounded-xl p-6">
 <p className="text-[var(--muted-foreground)] text-sm mb-2">Bounce Rate</p>
 <p className="text-3xl font-bold text-[var(--foreground)] ">32%</p>
 <p className="text-[var(--state-error)] dark:text-[var(--state-error)] text-sm mt-2">-8% from last week</p>
 </div>
 </div>
 </div>
 </div>
 );
}
