import { FolderKanban, Clock, Users, Home, ChevronRight, FolderOpen, RefreshCw, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const projects = [
 {
 name: "Mobile App Redesign",
 status: "In Progress",
 team: 5,
 progress: 65,
 color: "violet",
 updated: "2 hours ago",
 },
 {
 name: "Website Dashboard",
 status: "Review",
 team: 3,
 progress: 90,
 color: "blue",
 updated: "5 hours ago",
 },
 {
 name: "Brand Identity",
 status: "In Progress",
 team: 4,
 progress: 40,
 color: "emerald",
 updated: "1 day ago",
 },
 {
 name: "Marketing Campaign",
 status: "Planning",
 team: 6,
 progress: 15,
 color: "orange",
 updated: "3 days ago",
 },
 {
 name: "Product Launch",
 status: "In Progress",
 team: 8,
 progress: 75,
 color: "pink",
 updated: "4 hours ago",
 },
 {
 name: "User Research",
 status: "Completed",
 team: 2,
 progress: 100,
 color: "cyan",
 updated: "1 week ago",
 },
];

export function Projects() {
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
 <span className="text-[var(--muted-foreground)]">Administration</span>
 <ChevronRight size={14} className="text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]" />
 <span className="text-[var(--foreground)]  font-semibold text-lg flex items-center gap-2">
 <FolderOpen size={20} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 Projects
 </span>
 </nav>
 <div className="flex items-center gap-2">
 <button onClick={() => toast.info("Refreshed")} className="p-2 rounded-lg border-[var(--border)]  bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--surface-container-low)] dark:hover:bg-[var(--surface-container-high)] text-[var(--muted-foreground)] transition-colors" title="Refresh"><RefreshCw size={16} /></button>
 <button onClick={() => toast.info("Exported")} className="p-2 rounded-lg border-[var(--border)]  bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--surface-container-low)] dark:hover:bg-[var(--surface-container-high)] text-[var(--muted-foreground)] transition-colors" title="Export"><Download size={16} /></button>
 <button className="px-4 py-2 bg-[var(--primary)] hover:opacity-90 active:scale-[0.98] text-[var(--primary-foreground)] border border-[var(--primary)] dark:border-[var(--primary)] rounded-lg text-sm font-medium transition-colors">
 New Project
 </button>
 </div>
 </div>
 </div>
 <div className="flex-1 overflow-y-auto p-8">

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {projects.map((project, i) => (
 <div
 key={i}
 className="bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)]  rounded-xl p-6 hover:border-[var(--border)] dark:hover:border-[var(--border)] transition-all cursor-pointer group"
 >
 <div className="flex items-start justify-between mb-4">
 <div className={`w-12 h-12 bg-${project.color}-600 rounded-lg flex items-center justify-center`}>
 <FolderKanban size={24} className="text-[var(--foreground)]" />
 </div>
 <span className="px-3 py-1 bg-[var(--surface-container-low)] dark:bg-[var(--card)] text-[var(--foreground)] text-xs rounded-full">
 {project.status}
 </span>
 </div>

 <h3 className="text-lg font-semibold text-[var(--foreground)]  mb-3 group-hover:text-[var(--tertiary)] dark:group-hover:text-[var(--tertiary)] transition-colors">
 {project.name}
 </h3>

 <div className="mb-4">
 <div className="flex items-center justify-between text-sm text-[var(--muted-foreground)] mb-2">
 <span>Progress</span>
 <span>{project.progress}%</span>
 </div>
 <div className="w-full bg-[var(--surface-container)] dark:bg-[var(--card)] rounded-full h-2">
 <div
 className={`bg-${project.color}-600 h-2 rounded-full transition-all`}
 style={{ width: `${project.progress}%` }}
 />
 </div>
 </div>

 <div className="flex items-center justify-between text-sm text-[var(--muted-foreground)]">
 <div className="flex items-center gap-1">
 <Users size={16} />
 <span>{project.team} members</span>
 </div>
 <div className="flex items-center gap-1">
 <Clock size={16} />
 <span>{project.updated}</span>
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 );
}