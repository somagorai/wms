# OPTO 2.0 System & UX Guidelines (Blue V6 Edition)

These guidelines define the layout structures, macro patterns, and token hierarchy of the OPTO 2.0 Enterprise Warehouse Management System.

---

## 1. UX Principles & Macro Patterns
* **Recall and Apply:** Enforce 100% component reuse for standard data grids, forms, and nested lists. Replicate standard left-label, right-input form layouts.
* **Progressive Disclosure:** Use dedicated Right Side Panels (`DetailSidePanel`) for expanded record inspection (tracking IDs, routing details, sub-items). Keep primary overview tables uncluttered.
* **At-a-Glance Metrics:** Fixed Top Metric Bands (height: 80px–110px) at the top of high-level overview views with 4 metric cards (`TopCard` with status pill, large numeric value, and % trend delta).
* **High-Density Data Grids:** Compact row heights (36px–40px) with hairline bottom borders (`border-b border-border/40`). Selection checkboxes pinned to the first column and action menus pinned to the right.
* **Persistent Filter Bars:** Height 48px immediately below the global header or metric band. Includes full-text search and chip-based dropdown filters with quick-clear buttons.

---

## 2. Layout, Spacing, and Elevation (v0 Enterprise Aesthetic)
* **Depth through Hairline Borders:** Rely on 1px crisp borders (`1px solid var(--border)`), avoiding heavy muddy drop shadows.
* **Base 4px Spacing Grid:** 4px (`gap-1`), 8px (`gap-2`), 12px (`p-3`), 16px (`p-4`), 24px (`p-6`), 32px (`p-8`), 48px, 64px.
* **Border Radii Scale:**
  - Micro-elements (Tags, Status Pills, Table Checkboxes, Inputs): `4px` (`rounded`)
  - Interactive Cards, Buttons, Form Fields: `6px` (`rounded-md`)
  - Slide-out Drawers, Dialogs, Outer Grid Containers: `8px` (`rounded-lg`)

---

## 3. Typography
* **Base UI Font:** `Nunito Sans` (Clean, highly legible geometric sans for all interfaces).
* **Identifiers & Code Font:** `JetBrains Mono` (Barcodes, SKUs, LOT numbers, Container IDs, and telemetry timestamps).

| Style | Font Family | Size | Weight | Line Height | Purpose |
|---|---|---|---|---|---|
| **Display Large** | Nunito Sans | 57px | Bold (700) | 64px | Hero Dashboards |
| **Headline Medium** | Nunito Sans | 28px | Bold (700) | 36px | Page Titles, Key Metrics |
| **Title Medium** | Nunito Sans | 16px | Semibold (600) | 24px | Section Headers, Card Titles |
| **Body Medium** | Nunito Sans | 14px | Regular (400) | 20px | Table Data, Form Labels |
| **Label Small** | Nunito Sans | 11px | Semibold (600) | 16px | Status Badges, Micro-tags |
| **Code / Monospace** | JetBrains Mono | 13px | Regular (400) | 18px | SKUs, Tracking IDs, Timestamps |

---

## 4. OPTO 2.0 Design Tokens (Blue V6 - Production)

### Core Brand & Surface Tokens
| Token | Light Value | Dark Value | Token Semantic Purpose |
|---|---|---|---|
| `--brand-primary` | `#2B5DCA` | `#2B5DCA` | Brand accent buttons, active tab indicators, primary actions |
| `--brand-on-primary` | `#E9F0FF` | `#E9F0FF` | High-contrast white/ice text on brand button fills |
| `--use-primary` | `#2B5DCA` | `#6997FB` | Text links, primary surface icons, focused border accents |
| `--background` | `#f2f3f3` | `#0f1115` | Viewport canvas background |
| `--surface` | `#fafafa` | `#111111` | Card surfaces, modal drawers, table header backgrounds |
| `--surface-container` | `#ffffff` | `#16191f` | Data table rows, card contents, form background |
| `--surface-container-high` | `#fafafa` | `#1c2026` | Interactive hover rows, active dropdown items |
| `--surface-container-highest` | `#eaeded` | `#23272e` | Selected table row background, active chips |
| `--border` | `#d5dbdb` | `#1e2229` | 1px hairline dividing borders |

### Semantic State Indicators
| State | Container BG | Foreground Text | Border / Icon |
|---|---|---|---|
| **Success** (Optimal / Active) | `rgba(16, 185, 129, 0.1)` | `#059669` (Dark: `#34D399`) | `#10B981` |
| **Warning** (Degraded / Pending)| `rgba(245, 158, 11, 0.1)` | `#D97706` (Dark: `#FBBF24`) | `#F59E0B` |
| **Error** (Critical / Alert) | `rgba(239, 68, 68, 0.1)` | `#DC2626` (Dark: `#F87171`) | `#EF4444` |
| **Info** (System Notice) | `rgba(59, 130, 246, 0.1)` | `#2563EB` (Dark: `#60A5FA`) | `#3B82F6` |
