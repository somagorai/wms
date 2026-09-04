import { Link } from "react-router-dom";
import { Home, AlertCircle } from "lucide-react";

export function NotFound() {
 return (
 <div className="flex items-center justify-center min-h-screen bg-[var(--background)] dark:bg-[var(--background)] text-[var(--foreground)]">
 <div className="text-center">
 <div className="flex justify-center mb-6">
 <div className="w-24 h-24 bg-[var(--surface-container)] dark:bg-[var(--card)] rounded-full flex items-center justify-center">
 <AlertCircle size={48} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 </div>
 </div>
 <h1 className="text-6xl font-bold text-[var(--foreground)]  mb-4">404</h1>
 <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">Page Not Found</h2>
 <p className="text-[var(--muted-foreground)] mb-8">
 The page you're looking for doesn't exist or has been moved.
 </p>
 <Link
 to="/app"
 className="inline-flex items-center gap-2 bg-[var(--primary)]  hover:opacity-90 active:scale-[0.98] text-[var(--primary-foreground)] px-6 py-3 rounded-lg font-medium transition-colors"
 >
 <Home size={20} />
 Go to Dashboard
 </Link>
 </div>
 </div>
 );
}