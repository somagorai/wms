import { Outlet } from "react-router-dom";
import { VersionThemeSwitcher } from "./VersionThemeSwitcher";

export function Root() {
  const isLocalhost =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname.includes("192.168.") ||
      window.location.hostname.includes("10."));

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[var(--background)]">
      {/* 1. Dedicated Version Toolbar (Active on GitHub Pages / remote, hidden on localhost for pure V6) */}
      {!isLocalhost && <VersionThemeSwitcher />}

      {/* 2. Isolated OPTO 2.0 Screen Frame — Creates a CSS containing block for all fixed panels, sidebars, and dialogs */}
      <div
        className="flex-1 min-h-0 w-full overflow-hidden relative"
        style={{ transform: "translate3d(0, 0, 0)", isolation: "isolate" }}
      >
        <Outlet />
      </div>
    </div>
  );
}