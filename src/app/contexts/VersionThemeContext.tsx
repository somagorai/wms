import React, { createContext, useContext, useState, useEffect } from "react";
import themeMasterGreen from "../../styles/theme-master-green.css?raw";
import themeGreenAdapted from "../../styles/theme-green-adapted.css?raw";
import themeMasterBlueV1 from "../../styles/theme-master-blue-v1.css?raw";
import themeMasterBlueV2 from "../../styles/theme-master-blue-v2.css?raw";
import themeMasterBlueV3 from "../../styles/theme-master-blue-v3.css?raw";
import themeMasterBlueV4 from "../../styles/theme-master-blue-v4.css?raw";
import themeMasterBlueV5 from "../../styles/theme-master-blue-v5.css?raw";
import themeMasterBlueV6 from "../../styles/theme-master-blue-v6.css?raw";

export type Version = "Master Green" | "Green Adapted" | "Master Blue V1" | "Master Blue V2" | "Master Blue V3" | "Master Blue V4" | "Master Blue V5" | "Master Blue V6";
export type Theme = "light" | "dark";

export interface VersionThemeOption {
  version: Version;
  theme: Theme;
  label: string;
}

interface VersionThemeContextType {
  version: Version;
  theme: Theme;
  setVersionAndTheme: (version: Version, theme: Theme) => void;
}

const STORAGE_VERSION_KEY = "opto_app_version";
const STORAGE_THEME_KEY = "opto_app_theme";
const STYLE_TAG_ID = "opto-dynamic-theme-stylesheet";

// Map version keys to raw CSS strings
const THEME_MAP: Record<Version, string> = {
  "Master Green": themeMasterGreen,
  "Green Adapted": themeGreenAdapted,
  "Master Blue V1": themeMasterBlueV1,
  "Master Blue V2": themeMasterBlueV2,
  "Master Blue V3": themeMasterBlueV3,
  "Master Blue V4": themeMasterBlueV4,
  "Master Blue V5": themeMasterBlueV5,
  "Master Blue V6": themeMasterBlueV6,
};

const VersionThemeContext = createContext<VersionThemeContextType | undefined>(undefined);

export function VersionThemeProvider({ children }: { children: React.ReactNode }) {
  const [version, setVersionState] = useState<Version>(() => {
    const saved = localStorage.getItem(STORAGE_VERSION_KEY);
    if (
      saved === "Master Green" ||
      saved === "Green Adapted" ||
      saved === "Master Blue V1" ||
      saved === "Master Blue V2" ||
      saved === "Master Blue V3" ||
      saved === "Master Blue V4" ||
      saved === "Master Blue V5" ||
      saved === "Master Blue V6"
    ) {
      return saved as Version;
    }
    // Migration fallback
    if (saved === "V1") return "Master Green";
    if (saved === "V3") return "Green Adapted";
    return "Master Blue V6"; // Default to Master Blue V6
  });

  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem(STORAGE_THEME_KEY);
    return saved === "light" ? "light" : "dark";
  });

  const applyStyles = (ver: Version, thm: Theme) => {
    // 1. Inject or update dynamic stylesheet <style> tag in document.head
    let styleTag = document.getElementById(STYLE_TAG_ID) as HTMLStyleElement | null;
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = STYLE_TAG_ID;
      document.head.appendChild(styleTag);
    }
    styleTag.textContent = THEME_MAP[ver] || THEME_MAP["Master Blue V1"];

    // 2. Toggle 'dark' class on <html> element
    const root = document.documentElement;
    if (thm === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  };

  useEffect(() => {
    applyStyles(version, theme);
  }, [version, theme]);

  const setVersionAndTheme = (newVersion: Version, newTheme: Theme) => {
    setVersionState(newVersion);
    setThemeState(newTheme);
    localStorage.setItem(STORAGE_VERSION_KEY, newVersion);
    localStorage.setItem(STORAGE_THEME_KEY, newTheme);
    localStorage.setItem("theme", newTheme);
    applyStyles(newVersion, newTheme);
  };

  return (
    <VersionThemeContext.Provider value={{ version, theme, setVersionAndTheme }}>
      {children}
    </VersionThemeContext.Provider>
  );
}

export function useVersionTheme() {
  const context = useContext(VersionThemeContext);
  if (!context) {
    throw new Error("useVersionTheme must be used within a VersionThemeProvider");
  }
  return context;
}
