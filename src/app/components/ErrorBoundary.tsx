import { useRouteError, useNavigate } from "react-router-dom";
import { Home, AlertCircle } from "lucide-react";

export function ErrorBoundary() {
  const error = useRouteError() as any;
  const navigate = useNavigate();

  console.error("Route error:", error);

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="text-center max-w-md px-4">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center">
            <AlertCircle size={48} className="text-[#0d9488] dark:text-[#50e080]" />
          </div>
        </div>
        <h1 className="text-6xl font-bold text-zinc-900 dark:text-white mb-4">
          {error?.status || "Error"}
        </h1>
        <h2 className="text-2xl font-semibold text-zinc-700 dark:text-zinc-300 mb-4">
          {error?.statusText || "Something went wrong"}
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8">
          {error?.data || error?.message || "The page you're looking for doesn't exist or has been moved."}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Go Back
          </button>
          <button
            onClick={() => navigate("/app")}
            className="inline-flex items-center gap-2 bg-[#0d9488] dark:bg-[#50e080] hover:bg-[#0f766e] dark:hover:bg-[#3bc76a] text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <Home size={20} />
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
