import { Monitor } from "lucide-react";
import { useLayout } from "../contexts/LayoutContext";

interface WorkstationGuardProps {
 children: React.ReactNode;
}

export function WorkstationGuard({ children }: WorkstationGuardProps) {
 const { assignedWorkstation, setShowWorkstations } = useLayout();

 if (!assignedWorkstation) {
 return (
 <div className="flex-1 flex items-center justify-center p-8">
 <div className="text-center max-w-sm">
 <div className="w-20 h-20 bg-[var(--surface-container-low)] dark:bg-[var(--card)] rounded-full flex items-center justify-center mx-auto mb-5">
 <Monitor size={40} className="text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]" />
 </div>
 <h2 className="text-xl font-bold text-[var(--foreground)]  mb-2">
 No Workstation Assigned
 </h2>
 <p className="text-sm text-[var(--muted-foreground)] mb-6">
 You must assign a workstation to this terminal before accessing this screen.
 </p>
 <button
 onClick={() => setShowWorkstations(true)}
 className="px-6 py-3 bg-[var(--brand-primary,var(--primary))] hover:opacity-90 active:scale-[0.98] text-[var(--brand-on-primary,var(--primary-foreground))] font-semibold rounded-lg transition-colors flex items-center gap-2 mx-auto"
 >
 <Monitor size={18} />
 Assign Workstation
 </button>
 </div>
 </div>
 );
 }

 return <>{children}</>;
}
