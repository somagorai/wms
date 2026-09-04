import { Mail, MoreVertical, Home, ChevronRight, Users, RefreshCw, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  MasterTableContainer,
  MasterTable,
  MasterTableHead,
  MasterTableTh,
  MasterTableBody,
  MasterTableRow,
  MasterTableCell,
} from "../components/tables/MasterTable";

const team = [
 {
 name: "Sarah Chen",
 role: "Product Designer",
 email: "sarah.chen@example.com",
 avatar: "SC",
 status: "Active",
 color: " ",
 },
 {
 name: "Mike Johnson",
 role: "UI/UX Designer",
 email: "mike.j@example.com",
 avatar: "MJ",
 status: "Active",
 color: " ",
 },
 {
 name: "Emma Wilson",
 role: "Lead Designer",
 email: "emma.w@example.com",
 avatar: "EW",
 status: "Active",
 color: " ",
 },
 {
 name: "Alex Turner",
 role: "Visual Designer",
 email: "alex.turner@example.com",
 avatar: "AT",
 status: "Away",
 color: " ",
 },
 {
 name: "Lisa Martinez",
 role: "UX Researcher",
 email: "lisa.m@example.com",
 avatar: "LM",
 status: "Active",
 color: " ",
 },
 {
 name: "David Kim",
 role: "Design Engineer",
 email: "david.kim@example.com",
 avatar: "DK",
 status: "Active",
 color: " ",
 },
];

export function Team() {
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
 <Users size={20} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 Team
 </span>
 </nav>
 <div className="flex items-center gap-2">
 <button onClick={() => toast.info("Refreshed")} className="p-2 rounded-lg border-[var(--border)]  bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--surface-container-low)] dark:hover:bg-[var(--surface-container-high)] text-[var(--muted-foreground)] transition-colors" title="Refresh"><RefreshCw size={16} /></button>
 <button onClick={() => toast.info("Exported")} className="p-2 rounded-lg border-[var(--border)]  bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--surface-container-low)] dark:hover:bg-[var(--surface-container-high)] text-[var(--muted-foreground)] transition-colors" title="Export"><Download size={16} /></button>
 <button className="px-4 py-2 bg-[var(--primary)] hover:opacity-90 active:scale-[0.98] text-[var(--primary-foreground)] border border-[var(--primary)] dark:border-[var(--primary)] rounded-lg text-sm font-medium transition-colors">
 Invite Member
 </button>
 </div>
 </div>
 </div>
 <div className="flex-1 overflow-y-auto p-8">
 <MasterTableContainer type="display">
 <MasterTable type="display">
 <MasterTableHead type="display">
 <tr>
 <MasterTableTh type="display">Member</MasterTableTh>
 <MasterTableTh type="display">Role</MasterTableTh>
 <MasterTableTh type="display">Email</MasterTableTh>
 <MasterTableTh type="display">Status</MasterTableTh>
 <MasterTableTh type="display" align="right">Actions</MasterTableTh>
 </tr>
 </MasterTableHead>
 <MasterTableBody type="display">
 {team.map((member, i) => (
 <MasterTableRow key={i} type="display">
 <MasterTableCell type="display">
 <div className="flex items-center gap-3">
 <div className={`w-10 h-10 ${member.color} rounded-full flex items-center justify-center flex-shrink-0`}>
 <span className="text-[var(--foreground)] text-sm font-medium">{member.avatar}</span>
 </div>
 <span className="text-[var(--foreground)]  font-medium">{member.name}</span>
 </div>
 </MasterTableCell>
 <MasterTableCell type="display">
 <span className="text-[var(--foreground)]">{member.role}</span>
 </MasterTableCell>
 <MasterTableCell type="display">
 <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
 <Mail size={16} />
 <span>{member.email}</span>
 </div>
 </MasterTableCell>
 <MasterTableCell type="display">
 <span
 className={`px-3 py-1 rounded-full text-xs ${
 member.status === "Active"
 ? "bg-[var(--state-success)]/20 text-[var(--state-on-success-container)] dark:text-[var(--state-success)]"
 : "bg-[var(--state-warning)]/20 text-[var(--state-on-warning-container)] dark:text-[var(--state-warning)]"
 }`}
 >
 {member.status}
 </span>
 </MasterTableCell>
 <MasterTableCell type="display" align="right">
 <button className="p-2 hover:bg-[var(--surface-container-high)] rounded-lg transition-colors">
 <MoreVertical size={18} className="text-[var(--muted-foreground)]" />
 </button>
 </MasterTableCell>
 </MasterTableRow>
 ))}
 </MasterTableBody>
 </MasterTable>
 </MasterTableContainer>
 </div>
 </div>
 );
}