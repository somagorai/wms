import { useRouteError, useNavigate } from "react-router-dom";
import { Home, AlertCircle } from "lucide-react";

export function ErrorBoundary() {
 const error = useRouteError() as any;
 const navigate = useNavigate();

 console.error("Route error:", error);

 return (
 <div className="flex items-center justify-center min-h-screen bg-[var(--surface-container-lowest)] dark:bg-[var(--background)]">
 <div className="text-center max-w-md px-4">
 <div className="flex justify-center mb-6">
 <div className="w-24 h-24 bg-[var(--surface-container)] dark:bg-[var(--card)] rounded-full flex items-center justify-center">
 <AlertCircle size={48} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 </div>
 </div>
 <h1 className="text-6xl font-bold text-[var(--foreground)]  mb-4">
 {error?.status || "Error"}
 </h1>
 <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">
 {error?.statusText || "Something went wrong"}
 </h2>
 <p className="text-[var(--muted-foreground)] mb-8">
 {error?.data || error?.message || "The page you're looking for doesn't exist or has been moved."}
 </p>
 <div className="flex gap-4 justify-center">
 <button
 onClick={() => navigate(-1)}
 className="inline-flex items-center gap-2 bg-[var(--surface-container)] dark:bg-[var(--card)] hover:bg-[var(--surface-container-high)] text-[var(--foreground)]  px-6 py-3 rounded-lg font-medium transition-colors"
 >
 Go Back
 </button>
 <button
 onClick={() => navigate("/app")}
 className="inline-flex items-center gap-2 bg-[var(--primary)]  hover:opacity-90 active:scale-[0.98] text-[var(--primary-foreground)] px-6 py-3 rounded-lg font-medium transition-colors"
 >
 <Home size={20} />
 Go to Dashboard
 </button>
 </div>
 </div>
 </div>
 );
}
