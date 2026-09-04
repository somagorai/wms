# OPTO 2.0 Dual-Token Blue Architecture

The OPTO 2.0 design system uses a specialized **Dual-Token Architecture** where **`brand-primary`** is immutable across modes, while **`use-primary`** adapts for optimal on-surface contrast.

---

## 1. Core Brand vs. Surface Contrast Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             IMMUTABLE BRAND                                 │
│  --brand-primary: #2B5DCA  (Same in BOTH Light & Dark Modes)                │
│  --brand-on-primary: #E9F0FF (High-contrast text on solid brand fills)      │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                ┌──────────────────────┴──────────────────────┐
                ▼                                             ▼
┌───────────────────────────────┐             ┌───────────────────────────────┐
│        LIGHT MODE             │             │          DARK MODE            │
│  --use-primary: #2B5DCA       │             │  --use-primary: #6997FB       │
│  (Deep blue on light surface) │             │  (Luminous blue on dark base) │
└───────────────────────────────┘             └───────────────────────────────┘
```

### When to use `--brand-primary` vs. `--use-primary`:
1. **`var(--brand-primary)` (`#2B5DCA` in Light & Dark)**:
   - Primary action buttons (`bg-brand-primary text-brand-on-primary`)
   - Solid brand badges & tag fills
   - Active navigation pills and brand logos
2. **`var(--use-primary)` (`#2B5DCA` in Light, `#6997FB` in Dark)**:
   - Text links and standalone text accents directly on surfaces
   - Interactive icons on dark cards/tables
   - Hairline focus rings and active tab underlines

---

## 2. Token Scheme Reference (Light vs. Dark)

| Token Key | CSS Variable | Light Mode | Dark Mode | Purpose |
|---|---|---|---|---|
| **Brand Primary** | `--brand-primary` | `#2B5DCA` | `#2B5DCA` | **Immutable** button & fill brand color |
| **Brand On-Primary** | `--brand-on-primary` | `#E9F0FF` | `#E9F0FF` | **Immutable** text on brand fills |
| **Use Primary** | `--use-primary` | `#2B5DCA` | `#6997FB` | **Adaptive** text & surface icon color |
| **Primary Container** | `--primary-container` | `#2B5DCA` | `#2B5DCA` | Filled primary container |
| **On Primary Container** | `--on-primary-container` | `#E9F0FF` | `#E9F0FF` | Text on primary container |
| **Secondary** | `--secondary` | `#1A5F95` | `#9BCBFF` | Ocean blue secondary accents |
| **Background** | `--background` | `#FCFCFD` | `#0E1013` | Canvas ground background |
| **Surface (Card)** | `--surface` | `#F5F7FA` | `#14161B` | Card & table surface |
| **Surface High** | `--surface-container-high` | `#E3E7EE` | `#232731` | Hover rows & elevated headers |
| **Border / Outline** | `--border` | `#D0D4DE` | `#282C36` | 1px hairline divider |

---

## 3. Semantic State Tokens

| State | Light Value | Dark Value | Light Container / Text | Dark Container / Text |
|---|---|---|---|---|
| **Success** | `#2E7D32` | `#81C784` | `bg-emerald-500/10 text-emerald-600` | `bg-emerald-500/15 text-emerald-400` |
| **Warning** | `#B06000` | `#FFD39B` | `bg-amber-500/10 text-amber-600` | `bg-amber-500/15 text-amber-400` |
| **Error** | `#BA1A1A` | `#FFB4AB` | `bg-rose-500/10 text-rose-600` | `bg-rose-500/15 text-rose-400` |
| **Info** | `#1A5F95` | `#83DCFB` | `bg-blue-500/10 text-blue-600` | `bg-blue-500/15 text-blue-400` |
