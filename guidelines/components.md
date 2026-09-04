# OPTO 2.0 Modular Component & Variant Guidelines

The OPTO 2.0 design system is strictly **modular, token-driven, and variant-based**. No styles, colors, padding, or dimensions should ever be hardcoded into components. Every component is built using composable slots and declarative variant props (powered by `class-variance-authority` / design tokens).

---

## 1. Core Modularity Principles

1. **Zero Hardcoded Values:** Never use arbitrary hex colors (e.g. `#2B5DCA`) or hardcoded pixel spacing in component templates. Always reference semantic CSS variable tokens (e.g., `var(--brand-primary)`, `var(--surface-container)`, `border-border`, `text-foreground`).
2. **Atomic Composition & Slots:** Components expose slot props (`children`, `header`, `actions`, `footer`, `icon`) and custom renderers rather than monolithic inflexible templates.
3. **Compound Variant Architecture:** Styling is mapped across orthogonal axes: `variant` (intent/color), `size` (density), and `state` (interactive/selection).

---

## 2. Component Variant Specifications

### A. Buttons & Actions (`Button.tsx`)
Buttons support standard enterprise variants with crisp, hairline borders and state transitions:

| Prop | Options | Description / Token Mapping |
|---|---|---|
| `variant` | `default` / `primary` | Solid brand background (`bg-brand-primary text-brand-on-primary hover:bg-brand-primary/90`) |
| | `secondary` | Muted surface (`bg-secondary text-secondary-foreground hover:bg-secondary/80`) |
| | `outline` | Hairline border (`border border-border bg-transparent hover:bg-surface-container`) |
| | `ghost` | Transparent background (`hover:bg-accent hover:text-accent-foreground`) |
| | `destructive` | Error styling (`bg-destructive text-destructive-foreground hover:bg-destructive/90`) |
| | `brand-subtle` | Soft primary container (`bg-primary/10 text-primary border border-primary/20`) |
| `size` | `xs` (24px) | Micro buttons for table row actions (`h-6 px-2 text-xs`) |
| | `sm` (32px) | Compact toolbar and panel buttons (`h-8 px-3 text-xs`) |
| | `default` (36px) | Standard UI forms and action bars (`h-9 px-4 text-sm`) |
| | `lg` (44px) | Hero operations and modal confirmations (`h-11 px-6 text-base`) |
| | `icon` (32px/36px) | Square icon container (`h-9 w-9 p-0`) |

---

### B. Status Badges & Pills (`Badge.tsx`)
Badges are fully modular across semantic statuses and display modes:

| Status Variant | Subtle Mode (Default) | Outline Mode | Solid Mode | Dot / Indicator |
|---|---|---|---|---|
| `success` (Optimal/Active) | `bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20` | `border-emerald-500 text-emerald-500 bg-transparent` | `bg-emerald-600 text-white` | Green pulse dot + text |
| `warning` (Pending/Degraded)| `bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20` | `border-amber-500 text-amber-500 bg-transparent` | `bg-amber-600 text-white` | Amber dot + text |
| `error` / `critical` | `bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20` | `border-rose-500 text-rose-500 bg-transparent` | `bg-rose-600 text-white` | Red alert dot + text |
| `info` / `neutral` | `bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20` | `border-blue-500 text-blue-500 bg-transparent` | `bg-blue-600 text-white` | Blue dot + text |
| `outline` (General Meta) | `bg-transparent text-muted-foreground border-border` | Default border | N/A | Gray dot |

```tsx
// Modular Badge Example
<Badge variant="success" mode="subtle" size="sm">
  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
  In Service
</Badge>
```

---

### C. TopCard / KPI Metric Cards (`TopCard.tsx`)
Metric cards adapt modularly based on status level, layout density, and interactive states:

| Prop | Options | Visual Behavior |
|---|---|---|
| `variant` | `default` | Standard neutral surface card (`bg-card border-border`) |
| | `success` | Soft green accent indicator bar + tint on surface |
| | `warning` | Amber warning accent indicator bar |
| | `critical` | Rose critical accent indicator bar |
| | `interactive` | Adds hover glow: `hover:border-primary/40 hover:shadow-sm cursor-pointer` |
| `density` | `compact` (80px) | Single row: Icon, Value, Delta pill side-by-side |
| | `standard` (108px)| Stacked: Status badge top, Value (H3/H2) middle, Trend + subtext bottom |
| `trendDirection`| `up` / `down` / `neutral` | Automatically styles delta badge (`+12%` in green, `-4%` in red, `0%` in gray) |

```tsx
// Modular KPI TopCard
<TopCard
  variant="interactive"
  status="Optimal"
  statusVariant="success"
  title="System Throughput"
  value="4,820 UPH"
  trend="+8.2%"
  trendDirection="up"
  subtext="vs last hour benchmark"
  onClick={() => handleDrillDown('throughput')}
/>
```

---

### D. MasterTable Data Grid (`MasterTable.tsx`)
A modular table composed of independent, pluggable layers:

| Layer / Feature | Variant Options | Configuration / Implementation |
|---|---|---|
| `density` | `compact` (32px row) | High-density warehouse monitoring (MPC, Item grids) |
| | `normal` (40px row) | Standard data entry and management tables |
| | `spacious` (48px row) | Detail view inspection tables |
| `selectionMode` | `none` / `single` / `multi` | Modular checkbox/radio column with sticky freeze |
| `rowStateVariants`| `default` / `hover` / `selected` | Selected rows receive `bg-primary/5 border-l-2 border-primary` |
| `actionColumn` | `dropdown` / `inline` / `none` | Pinned right-side action slot (`PinRight` column freeze) |
| `filterBarSlot` | Composable `children` | Supports search inputs, chip filters, date-pickers, column toggles |

```tsx
// Composable MasterTable with modular slots
<MasterTable
  data={workOrders}
  columns={workOrderColumns}
  density="compact"
  selectionMode="multi"
  selectedRows={selectedIds}
  onSelectionChange={setSelectedIds}
  toolbarSlot={
    <div className="flex items-center justify-between gap-2 w-full">
      <TableSearchInput placeholder="Filter orders..." />
      <div className="flex items-center gap-2">
        <TableFilterDropdown title="Status" options={statusOptions} />
        <TableColumnToggle columns={workOrderColumns} />
      </div>
    </div>
  }
/>
```

---

### E. DetailSidePanel (`DetailSidePanel.tsx`)
Slide-over inspection panel supporting multiple sizes, docking positions, and segmented body layouts:

| Prop | Options | Description |
|---|---|---|
| `size` | `sm` (400px) | Quick summary & property visibility checks |
| | `md` (520px) | Standard item/location operational details |
| | `lg` (720px) | Multi-tab diagnostics with embedded sub-tables |
| `position` | `right` (default) / `left` | Anchored slide-over direction |
| `variant` | `drawer` (overlay) | Dark backdrop with modal lock (`bg-background/80 backdrop-blur-sm`) |
| | `docked` (split-screen) | Resizes sibling layout without overlaying |
| `headerSlot` | Custom ReactNode | Title, status badge, timestamp, and close trigger |
| `footerSlot` | Custom ReactNode | Sticky primary confirmation and secondary action buttons |

---

### F. Form Controls & Inputs (`Input.tsx`, `Select.tsx`, `Switch.tsx`)
Form components support unified states across the design system:

| State | Visual Token | Behavioral Rule |
|---|---|---|
| `Default` | `bg-input/20 border-border text-foreground` | Clean hairline outline |
| `Hover` | `border-border-hover bg-input/30` | Subtle contrast enhancement |
| `Focus` | `border-primary ring-1 ring-primary/30 outline-none` | Crisp brand-primary outline |
| `Error` | `border-destructive text-destructive ring-1 ring-destructive/20` | Accessible error indicator with text feedback |
| `Disabled` | `opacity-50 cursor-not-allowed bg-muted` | Non-interactive styling |
