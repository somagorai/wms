import { useVersionTheme, type Version } from "../contexts/VersionThemeContext";
import { Sun, Moon, Bookmark } from "lucide-react";

export function VersionThemeSwitcher() {
  const { version, theme, setVersionAndTheme } = useVersionTheme();

  const versions: Array<{
    id: Version;
    label: string;
    lightSeed: string;
    darkSeed: string;
  }> = [
    { id: "Master Blue V1", label: "Original (V1)", lightSeed: "#194BB7", darkSeed: "#B5CCE3" },
    { id: "Master Green", label: "Master Green", lightSeed: "#00C658", darkSeed: "#00C658" },
    { id: "Green Adapted", label: "Green Adapted", lightSeed: "#3FE371", darkSeed: "#3FE371" },
    { id: "Master Blue V4", label: "Blue V4", lightSeed: "#194BB8", darkSeed: "#4A7BE5" },
    { id: "Master Blue V5", label: "Blue V5", lightSeed: "#2B5DCA", darkSeed: "#6997FB" },
    { id: "Master Blue V6", label: "Blue V6 (Current)", lightSeed: "#2B5DCA", darkSeed: "#6997FB" },
  ];

  return (
    <header className="shrink-0 z-[999] bg-[#101216] text-[#E4E6ED] border-b border-[#232730] px-2 sm:px-3 py-1 shadow-xs select-none font-sans">
      <div className="flex items-center justify-between gap-2 max-w-full overflow-x-auto">
        {/* Left: Bookmark Toolbar Title & Active Indicator */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#181B22] border border-[#2A2F3D] text-xs font-semibold text-[#A0A6B5]">
            <Bookmark size={12} className="text-[#60A5FA]" />
            <span className="tracking-wide uppercase text-[10px] font-bold text-[#E4E6ED]">Themes</span>
          </div>
          <div className="hidden xl:flex items-center gap-1.5 text-xs text-[#8B93A7]">
            <span className="text-[#4B5569]">•</span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#181B22] text-[#E4E6ED] font-mono text-[11px] font-medium border border-[#2A2F3D]">
              <span
                className="w-2 h-2 rounded-full inline-block shrink-0"
                style={{
                  backgroundColor:
                    version === "Master Green"
                      ? "#00C658"
                      : version === "Green Adapted"
                      ? "#3FE371"
                      : version === "Master Blue V1"
                      ? theme === "light" ? "#194BB7" : "#B5CCE3"
                      : version === "Master Blue V2"
                      ? theme === "light" ? "#2354A2" : "#8FB5D6"
                      : version === "Master Blue V3"
                      ? theme === "light" ? "#082C79" : "#85CCE6"
                      : version === "Master Blue V4"
                      ? theme === "light" ? "#194BB8" : "#4A7BE5"
                      : version === "Master Blue V5"
                      ? theme === "light" ? "#2B5DCA" : "#6997FB"
                      : theme === "light" ? "#2B5DCA" : "#6997FB",
                }}
              />
              <span className="font-semibold text-white">{version}</span>
              <span className="text-[#94A3B8]">({theme === "light" ? "Light" : "Dark"})</span>
            </span>
          </div>
        </div>

        {/* Right: Version Name + Sun (Light) + Moon (Dark) Capsules */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 overflow-x-auto py-0.5">
          {versions.map((ver) => {
            const isVersionActive = version === ver.id;
            const currentSeed = isVersionActive
              ? theme === "light"
                ? ver.lightSeed
                : ver.darkSeed
              : ver.lightSeed;

            return (
              <div
                key={ver.id}
                className={`flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-lg border text-xs font-medium transition-all ${
                  isVersionActive
                    ? "bg-[#1D222C] border-[#3B82F6]/70 text-white shadow-xs ring-1 ring-[#3B82F6]/40"
                    : "bg-[#15171C] border-[#252830] text-[#94A3B8] hover:border-[#373C48] hover:text-[#D1D5DB]"
                }`}
              >
                {/* Seed Swatch Dot */}
                <span
                  className="w-2 h-2 rounded-full inline-block shrink-0 border border-black/40"
                  style={{ backgroundColor: currentSeed }}
                />

                {/* Version Name */}
                <span
                  onClick={() => setVersionAndTheme(ver.id, isVersionActive ? theme : "light")}
                  className="cursor-pointer font-semibold text-[11px] whitespace-nowrap hover:text-white transition-colors"
                  title={`Switch to ${ver.id}`}
                >
                  {ver.label}
                </span>

                {/* Divider */}
                <span className="text-[#373B46] text-[10px]">|</span>

                {/* Sun Button (Light) */}
                <button
                  onClick={() => setVersionAndTheme(ver.id, "light")}
                  className={`p-0.5 sm:p-1 rounded-sm transition-all cursor-pointer ${
                    isVersionActive && theme === "light"
                      ? "bg-[#283142] text-[#FBBF24] ring-1 ring-[#FBBF24]/50 shadow-xs"
                      : "text-[#64748B] hover:text-[#FBBF24] hover:bg-[#202530]"
                  }`}
                  title={`${ver.id} Light Mode`}
                >
                  <Sun size={11} className={isVersionActive && theme === "light" ? "stroke-[2.5]" : "stroke-[1.75]"} />
                </button>

                {/* Moon Button (Dark) */}
                <button
                  onClick={() => setVersionAndTheme(ver.id, "dark")}
                  className={`p-0.5 sm:p-1 rounded-sm transition-all cursor-pointer ${
                    isVersionActive && theme === "dark"
                      ? "bg-[#283142] text-[#818CF8] ring-1 ring-[#818CF8]/50 shadow-xs"
                      : "text-[#64748B] hover:text-[#818CF8] hover:bg-[#202530]"
                  }`}
                  title={`${ver.id} Dark Mode`}
                >
                  <Moon size={11} className={isVersionActive && theme === "dark" ? "stroke-[2.5]" : "stroke-[1.75]"} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </header>
  );
}
