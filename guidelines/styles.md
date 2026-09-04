# OPTO 2.0 Modular Styling Architecture

## 1. Zero Hardcoding Policy
- **Colors:** Never declare hardcoded HEX or RGB values (`#2B5DCA`, `rgb(30, 40, 50)`). Always use semantic CSS variables (`var(--primary)`, `var(--surface-container)`, `var(--border)`, `var(--brand-primary)`).
- **Spacing:** Use Tailwind scale based on 4px grid (`gap-1` = 4px, `p-2` = 8px, `p-3` = 12px, `p-4` = 16px, `p-6` = 24px).
- **Typography:** Use semantic font classes (`font-headline-medium`, `font-body-large`, `font-label-medium`) tied to `Nunito Sans` and `JetBrains Mono`.

## 2. Dynamic Theme Resolution
OPTO 2.0 dynamically shifts surfaces and brand tokens between Light and Dark modes without changing class markup:
- **Surface Elevation System:**
  - Base canvas: `bg-background` (Light: `#FAFBFA` / Dark: `#0B0E14`)
  - Primary cards & tables: `bg-card` / `bg-surface` (Light: `#FFFFFF` / Dark: `#111827`)
  - Elevated headers & hover rows: `bg-surface-container` (Light: `#F1F5F9` / Dark: `#1E293B`)
  - Popovers & modal overlays: `bg-popover` (Light: `#FFFFFF` / Dark: `#0F172A`)

## 3. Hairline Border & Elevation Matrix
- Replace heavy drop shadows with high-precision 1px hairline borders:
  - Default Border: `border border-border` (Subtle 1px boundary)
  - Interactive Hover Border: `hover:border-primary/40`
  - Active / Focus Border: `border-primary ring-1 ring-primary/20`
  - Selected Row Accent: `border-l-2 border-primary bg-primary/5`

## 4. Reusable Utility Classes & Color Mixing
- Use CSS `color-mix` for transparent container overlays:
  - `bg-[color-mix(in_srgb,var(--primary)_10%,transparent)]`
  - `border-[color-mix(in_srgb,var(--primary)_20%,transparent)]`
