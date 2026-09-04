---
version: alpha
name: OPTO 2.0 Design System
description: Enterprise Industrial Warehouse Management System Design System built with Material 3 tokens, WCAG 2.1 AA accessibility standards, and specialized warehouse operational patterns.
colors:
  primary: "#006E2D"
  surfaceTint: "#006E2D"
  onPrimary: "#FFFFFF"
  primaryContainer: "#00C658"
  onPrimaryContainer: "#004B1D"
  secondary: "#3E6071"
  onSecondary: "#FFFFFF"
  secondaryContainer: "#57798B"
  onSecondaryContainer: "#FBFDFF"
  tertiary: "#825500"
  onTertiary: "#FFFFFF"
  tertiaryContainer: "#FBB03B"
  onTertiaryContainer: "#6C4500"
  error: "#BA1A1A"
  onError: "#FFFFFF"
  errorContainer: "#FFDAD6"
  onErrorContainer: "#93000A"
  background: "#F3FCEF"
  onBackground: "#151E16"
  surface: "#F3FCEF"
  onSurface: "#151E16"
  surfaceVariant: "#DFE4DB"
  onSurfaceVariant: "#434842"
  outline: "#737971"
  outlineVariant: "#C3C8C0"
  shadow: "#000000"
  scrim: "#000000"
  inverseSurface: "#2A332A"
  inverseOnSurface: "#EAF3E6"
  inversePrimary: "#3EE270"
  surfaceContainerLowest: "#FFFFFF"
  surfaceContainerLow: "#EDF6E9"
  surfaceContainer: "#E7F1E3"
  surfaceContainerHigh: "#E2EBDE"
  surfaceContainerHighest: "#DCE5D8"
  dark-primary: "#3FE371"
  dark-onPrimary: "#003914"
  dark-background: "#0D150E"
  dark-onBackground: "#DCE5D8"
  dark-surface: "#0D150E"
  dark-onSurface: "#DCE5D8"
  dark-surfaceVariant: "#434842"
  dark-onSurfaceVariant: "#C3C8C0"
  dark-outline: "#8D928B"
typography:
  headline-display:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.3
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.4
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.4
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.5
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.4
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.4
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.05em
rounded:
  none: 0px
  sm: 4px
  md: 8px
  lg: 12px
  xl: 16px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  gutter: 24px
  margin: 32px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.onPrimary}"
    rounded: "{rounded.md}"
    padding: 10px 16px
  button-primary-hover:
    backgroundColor: "{colors.primaryContainer}"
    textColor: "{colors.onPrimaryContainer}"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.onSecondary}"
    rounded: "{rounded.md}"
    padding: 10px 16px
  button-tertiary:
    backgroundColor: transparent
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    padding: 10px 16px
  header-bar:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.onSurface}"
    padding: 16px 32px
  filter-button-active:
    backgroundColor: "{colors.primaryContainer}"
    textColor: "{colors.onPrimaryContainer}"
    rounded: "{rounded.md}"
  filter-button-inactive:
    backgroundColor: "{colors.surfaceVariant}"
    textColor: "{colors.onSurfaceVariant}"
    rounded: "{rounded.md}"
  data-grid-header:
    backgroundColor: "{colors.surfaceContainerHigh}"
    textColor: "{colors.onSurface}"
    typography: "{typography.label-lg}"
  data-grid-row-hover:
    backgroundColor: "{colors.surfaceContainerLow}"
  status-badge-active:
    backgroundColor: "{colors.primaryContainer}"
    textColor: "{colors.onPrimaryContainer}"
    rounded: "{rounded.full}"
    padding: 4px 8px
  status-badge-warning:
    backgroundColor: "{colors.tertiaryContainer}"
    textColor: "{colors.onTertiaryContainer}"
    rounded: "{rounded.full}"
    padding: 4px 8px
  status-badge-error:
    backgroundColor: "{colors.errorContainer}"
    textColor: "{colors.onErrorContainer}"
    rounded: "{rounded.full}"
    padding: 4px 8px
---

# OPTO 2.0 Design System

## Overview

OPTO 2.0 is an enterprise-grade Warehouse Management System (WMS) and Material Handling Equipment (MHE) control platform. The visual identity balances high-density operational clarity, technical precision, and modern tactile aesthetics.

### Brand Personality & Aesthetic Rationale
- **Industrial Precision**: Clean lines, high legibility, structured grids, and unambiguous state signifiers ensure operators can make rapid decisions under high throughput warehouse conditions.
- **Vibrant Purposeful Accent**: Rooted in a core vibrant green (`#00C658`), used deliberately to highlight active states, primary CTAs, saved filter indicators, and AI guidance without causing visual fatigue.
- **Accessible & High-Contrast**: Designed from the ground up for strict compliance with [WCAG 2.1 Level AA Guidelines](https://www.w3.org/TR/2025/REC-WCAG21-20250506/), supporting both light and dark operational warehouse environments.

---

## Colors

The OPTO 2.0 color palette is generated from the M3 seed color `#00C658` (`primary with additional colors.json`). It incorporates semantic roles for primary operations, secondary metadata, tertiary alerts, surface elevations, and dark mode variants.

### Palette Definitions

- **Primary (`#006E2D` / `#00C658`):** Deep emerald green used for primary buttons, active headers, and core brand indicators. Contrast with white is **6.43:1** (WCAG AA pass).
- **Secondary (`#3E6071`):** Sophisticated slate blue utilized for secondary actions, structural tabs, and secondary navigation elements. Contrast with white is **6.74:1** (WCAG AA pass).
- **Tertiary (`#825500` / `#FBB03B`):** Warm amber used for warnings, cycle count indicators, and attention-requiring inventory statuses. Contrast with white is **6.46:1** (WCAG AA pass).
- **Neutral Background (`#F3FCEF`):** Subtle warm mint tint serving as the foundational surface, reducing glare under bright warehouse lighting. Contrast with text `#151E16` is **16.26:1** (WCAG AAA pass).
- **Error (`#BA1A1A`):** Vivid alert red for critical system exceptions, workstation warnings, and stockout notifications. Contrast with white is **6.46:1** (WCAG AA pass).

### WCAG 2.1 Level AA Contrast Matrix

| Context | Foreground Color | Background Color | Calculated Contrast | WCAG 2.1 AA Standard (4.5:1) |
|---|---|---|---|---|
| Light Primary Text | `#006E2D` (Primary) | `#FFFFFF` | **6.43:1** | PASS (AA & AAA) |
| Light Primary Container Text | `#004B1D` (On Primary Container) | `#00C658` (Primary Container) | **4.55:1** | PASS (AA) |
| Light Body Text | `#151E16` (On Background) | `#F3FCEF` (Background) | **16.26:1** | PASS (AAA) |
| Light Secondary Text | `#434842` (On Surface Variant) | `#DFE4DB` (Surface Variant) | **7.24:1** | PASS (AA & AAA) |
| Light Secondary Action | `#3E6071` (Secondary) | `#FFFFFF` | **6.74:1** | PASS (AA & AAA) |
| Light Tertiary Action | `#825500` (Tertiary) | `#FFFFFF` | **6.46:1** | PASS (AA & AAA) |
| Light Error Text | `#93000A` (On Error Container) | `#FFDAD6` (Error Container) | **7.24:1** | PASS (AA & AAA) |
| Dark Primary Accent | `#3FE371` (Dark Primary) | `#0D150E` (Dark Background) | **11.00:1** | PASS (AAA) |
| Dark Primary Button Text | `#003914` (Dark On Primary) | `#3FE371` (Dark Primary) | **7.80:1** | PASS (AAA) |
| Dark Body Text | `#DCE5D8` (Dark On Background) | `#0D150E` (Dark Background) | **14.36:1** | PASS (AAA) |
| Dark Secondary Text | `#C3C8C0` (Dark On Surface Variant) | `#434842` (Dark Surface Variant) | **5.50:1** | PASS (AA & AAA) |

---

## Typography

OPTO 2.0 utilizes **Inter** (with system sans-serif fallbacks) to ensure optimal legibility across high-resolution desktop displays, warehouse touch terminals, and handheld RF scanners.

### Type Scale

- **Headline Display (`32px` / `700` weight / `1.2` line-height / `-0.02em` spacing):** Applied to major dashboard headers and executive summaries.
- **Headline Large (`24px` / `600` weight / `1.3` line-height):** Section titles, modal titles, and high-level card headers.
- **Headline Medium (`20px` / `600` weight / `1.4` line-height):** Page title in page headers next to page icon.
- **Headline Small (`18px` / `600` weight / `1.4` line-height):** Panel section titles and table group headers.
- **Body Large (`16px` / `400` weight / `1.5` line-height):** Primary body text, modal description text, form inputs.
- **Body Medium (`14px` / `400` weight / `1.5` line-height):** Standard table row text, list content, description paragraphs.
- **Body Small (`12px` / `400` weight / `1.5` line-height):** Table cell metadata, secondary subtitles, timestamps.
- **Label Large (`14px` / `500` weight / `1.4` line-height):** Button text, tab headers, filter panel dropdown labels.
- **Label Medium (`12px` / `500` weight / `1.4` line-height):** Data grid column headers, status badge labels, tooltip text.
- **Label Small (`11px` / `500` weight / `1.4` line-height / `0.05em` spacing):** Uppercase category tags, barcode metadata, micro badges.

---

## Layout

The layout system is designed for complex data-dense screens, supporting pinned navigation, sticky header controls, fluid grids, and slide-out detail panels.

### Structural Blueprint

1. **Collapsible Sidebar**:
   - Expanded width: `256px` (`w-64`). Collapsed width: `80px` (`w-20`).
   - Sticky left positioning, scrollable pinned items with HTML5 Drag-and-Drop reordering.
2. **Pinned Page Header**:
   - Pinned to top (`sticky top-0 z-40`).
   - Height: Dynamic (`pt-6 pb-4 px-8`).
   - Left side: Breadcrumb path (`Home > Category > Page Icon + Page Title`).
   - Right side: Quick action buttons, Search input, Refresh & Export icons, and Filter toggle button.
3. **Header Filter Section**:
   - Appears inline directly below the header title row when triggered.
   - Contains page-specific inputs, dropdowns, **Apply Filter** and **Reset** buttons, and a **Bookmark Filter** toggle button.
4. **Data Grid & Main Workspace Area**:
   - Fluid grid adapting to 100% viewport width with a maximum container max-width of `1600px`.
   - Grid padding: `24px` (`spacing.lg`). Gutter: `24px`.
5. **Notification Ticker**:
   - Positioned immediately below the sticky header area for immediate operational visibility.

---

## Elevation & Depth

Visual hierarchy is maintained through **tonal container surfaces** and explicit structural borders rather than heavy blur shadows, maximizing clarity in ambient warehouse light.

### Elevation Levels

- **Level 0 (Flat Base)**: Page background (`#F3FCEF` light / `#0D150E` dark).
- **Level 1 (Card & Section Containers)**: `surfaceContainerLow` (`#EDF6E9` light / `#151E16` dark) with `1px` border (`#DFE4DB` / `#434842`).
- **Level 2 (Active Containers & Rows)**: `surfaceContainer` (`#E7F1E3` light / `#192219` dark).
- **Level 3 (Header & Floating Bars)**: `surface` (`#FFFFFF` or `#F3FCEF`) with sticky border `border-b border-zinc-200` (`dark:border-zinc-800`).
- **Level 4 (Flyout Menus & Tooltips)**: Elevated popovers with subtle shadow `shadow-xl` (`rgba(0,0,0,0.15)`) and `1px` border.
- **Level 5 (Modals & Slide-out Panels)**: Overlay screens with `bg-black/50` backdrop scrim and elevated modal surface.

---

## Shapes

A clean architectural shape language is enforced with consistent corner radius scale:

- **Radius None (`0px`)**: Full-bleed page header bars, table dividers, edge-to-edge container separators.
- **Radius Small (`4px`)**: Table cell tags, micro-badges, checkbox/radio inputs.
- **Radius Medium (`8px`)**: Primary buttons, input text fields, filter controls, navigation items.
- **Radius Large (`12px`)**: Cards, modal dialogs, slide-out drawer panels.
- **Radius Extra Large (`16px`)**: Floating AI prompts and toast notification containers.
- **Radius Full (`9999px`)**: Status pill badges, user avatar indicators, active count counters.

---

## Components

Guidance and design tokens for core UI component atoms derived from current screens (`PageHeader.tsx`, `Sidebar.tsx`, `Dashboard.tsx`, `Pick.tsx`, `WorkList.tsx`, `Containers.tsx`):

### 1. Page Header & Breadcrumbs
- **Structure**: Sticky container featuring breadcrumbs starting with Home icon, chevron delimiters, and large bold page title prefixed with the page's Lucide icon.
- **Right Action Group**: Icon-only Refresh and Export buttons located immediately to the left of the Filter button.
- **Color Token**: `{components.header-bar}`

### 2. Filter Controls & Bookmark State
- **Filter Button**:
  - Inactive state: `{components.filter-button-inactive}` (`bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300`).
  - Active state (filters applied): `{components.filter-button-active}` filled with green brand accent (`bg-[#00C658] text-white` or `bg-[#0d9488]`), displaying numeric badge.
  - Hover behavior: Shows tooltip summary listing all currently applied filter criteria.
- **Bookmark Button**:
  - Located beside filter button. Clicking saves current filter configuration for future page loads.
  - Saved state: Icon turns green (`text-[#00C658]` / `text-[#0d9488]` with filled icon).

### 3. Primary, Secondary & Tertiary Buttons
- **Primary Button**: Master green background (`#006E2D` / `#00C658`), bold white text, subtle hover lift. Used for main action per screen (e.g. "Save", "Submit Pick", "Ask OPTO").
- **Secondary Button**: Outlined border (`#737971`), transparent background, secondary text (`#3E6071`).
- **Tertiary Button**: Borderless text button for low-priority actions ("Cancel", "Clear All").

### 4. Data Grid & Global Search
- **Search Bar**: Universal text search input present on all grid screens, supporting instant filtering across all columns.
- **Header Cells**: Surface container high background (`#E2EBDE`), uppercase label-medium typography, sort direction indicator arrows.
- **Row States**: Default white/surface, alternate zebra striping (`surfaceContainerLow`), hover state (`surfaceContainer`), selected row (`primaryContainer` tint with 2px accent border).

### 5. Status Badges & Chips
- **Success / Active**: Green container (`#00C658` / `#004B1D` text). Dual-encoded with Check icon + text label.
- **Warning / Pending**: Amber container (`#FBB03B` / `#6C4500` text). Dual-encoded with Alert Triangle icon + text label.
- **Error / Exception**: Red container (`#FFDAD6` / `#93000A` text). Dual-encoded with Alert Circle icon + text label.
- **Inactive / Disabled**: Slate gray container (`#DFE4DB` / `#434842` text).

### 6. Collapsible Sidebar & Pinned Navigation
- **Pinned List**: Drag-and-drop customizable quick nav items.
- **Workstation Selector**: Dedicated footer button prompting user to select a registered workstation before accessing workstation-restricted operations.

### 7. Notification Ticker & Alerts
- Positioned directly below the header. Color-coded severity banner (Info: Blue/Slate, Warning: Amber, Error: Red).

---

## Do's and Don'ts

- **Do** maintain strict WCAG 2.1 Level AA contrast (minimum 4.5:1 for normal text, 3:1 for large text and UI borders).
- **Don't** rely on color alone to convey status; always pair colors with icons or readable text labels.
- **Do** pin the page header to the top of the viewport with breadcrumbs and page icon visible at all times.
- **Don't** move the filter button or data grid search/export buttons to non-standard locations; keep header action placement consistent across all screens.
- **Do** highlight active/saved filters in vibrant green (`#00C658` / `#006E2D`) with hover tooltip summaries.
- **Don't** use more than one primary green button per section or card.
- **Do** ensure keyboard focus indicators (visible `outline-ring`) are present on all interactive inputs, buttons, and grid rows.
- **Don't** mix rounded and sharp corners within the same component hierarchy.
