import { Outlet } from "react-router-dom";
import { VersionThemeSwitcher } from "./VersionThemeSwitcher";

export function Root() {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[var(--background)]">
      {/* 1. Dedicated Version Toolbar (Separate from OPTO 2.0) */}
      <VersionThemeSwitcher />

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