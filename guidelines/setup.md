# OPTO 2.0 Setup & Integration Guidelines

Follow these steps to configure and build components with the OPTO 2.0 design system.

---

## Step 1: Fonts & Typography Setup
OPTO 2.0 utilizes **Nunito Sans** for all UI surfaces and **JetBrains Mono** for serial numbers, barcodes, and code identifiers.

Add the following to your root `index.html` or `fonts.css`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
```

---

## Step 2: Stylesheets & CSS Tokens
Import design tokens and CSS layers in `src/styles/index.css`:
```css
@import './fonts.css';
@import './tailwind.css';
@import './theme.css';
@import './default_shadcn_theme.css';
```

---

## Step 3: Context & Theme Providers
Wrap your application tree with required OPTO 2.0 context providers:
```tsx
import { AuthProvider } from './app/contexts/AuthContext';
import { VersionThemeProvider } from './app/contexts/VersionThemeContext';
import { ThemeProvider } from './app/contexts/ThemeContext';
import { LayoutProvider } from './app/contexts/LayoutContext';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <VersionThemeProvider>
        <ThemeProvider>
          <LayoutProvider>
            {children}
          </LayoutProvider>
        </ThemeProvider>
      </VersionThemeProvider>
    </AuthProvider>
  );
}
```

---

## Step 4: Component Imports
Import common components from `src/app/components`:
- Data Tables: `import { MasterTable } from '@/app/components/tables/MasterTable'`
- Detail Panels: `import { DetailSidePanel } from '@/app/components/DetailSidePanel'`
- Metrics: `import { TopCard } from '@/app/components/TopCard'`
- Alerts: `import { NotificationTicker } from '@/app/components/NotificationTicker'`
