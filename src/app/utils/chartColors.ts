/**
 * OPTO UNIVERSAL CHART COLOR SYSTEM
 * Standardized data visualization colors across all versions and themes.
 * Calibrated for light mode (high-contrast 800 shades) and dark mode (luminous 300 shades).
 */

export const UNIVERSAL_CHART_COLORS_LIGHT = {
  blue: '#1E40AF',   // Deep Royal Blue (800)
  green: '#166534',  // Deep Forest Emerald (800)
  orange: '#9A3412', // Deep Russet Terracotta (800)
  yellow: '#854D0E', // Deep Ochre Amber (800)
  red: '#991B1B',    // Deep Crimson Burgundy (800)
  purple: '#6B21A8', // Deep Regal Violet (800)
  brown: '#573010',  // Deep Espresso Brown (900)
  teal: '#115E59',   // Deep Ocean Teal (800)
  pink: '#9D174D',   // Deep Berry Magenta (800)
  indigo: '#3730A3', // Deep Midnight Indigo (800)
} as const;

export const UNIVERSAL_CHART_COLORS_DARK = {
  blue: '#93C5FD',   // Luminous Sky Ice Blue (300)
  green: '#86EFAC',  // Luminous Mint Emerald (300)
  orange: '#FDBA74', // Luminous Coral Tangerine (300)
  yellow: '#FDE047', // Radiant Sun Yellow (300)
  red: '#FCA5A5',    // Luminous Coral Rose (300)
  purple: '#D8B4FE', // Luminous Lavender Violet (300)
  brown: '#FCD34D',  // Warm Golden Honey (300)
  teal: '#5EEAD4',   // Radiant Aqua Turquoise (300)
  pink: '#F9A8D4',   // Luminous Orchid Rose (300)
  indigo: '#A5B4FC', // Luminous Periwinkle Iris (300)
} as const;

export const UNIVERSAL_CHART_COLORS = {
  blue: 'var(--chart-blue)',
  green: 'var(--chart-green)',
  orange: 'var(--chart-orange)',
  yellow: 'var(--chart-yellow)',
  red: 'var(--chart-red)',
  purple: 'var(--chart-purple)',
  brown: 'var(--chart-brown)',
  teal: 'var(--chart-teal)',
  pink: 'var(--chart-pink)',
  indigo: 'var(--chart-indigo)',
} as const;

export const CHART_PALETTE = [
  'var(--chart-blue)',
  'var(--chart-green)',
  'var(--chart-orange)',
  'var(--chart-purple)',
  'var(--chart-yellow)',
  'var(--chart-teal)',
  'var(--chart-red)',
  'var(--chart-brown)',
  'var(--chart-pink)',
  'var(--chart-indigo)',
];

export const WORK_TYPE_CHART_COLORS: Record<string, string> = {
  'Pick': 'var(--chart-pick)',
  'Replenishment': 'var(--chart-replenishment)',
  'Cycle Count': 'var(--chart-cycle-count)',
  'Inspection': 'var(--chart-inspection)',
  'Putaway': 'var(--chart-putaway)',
  'Move': 'var(--chart-move)',
  'Transfer': 'var(--chart-transfer)',
};

/**
 * 20% transparent primary cursor hover style for Recharts
 */
export const CHART_HOVER_CURSOR = {
  fill: 'var(--chart-cursor-hover, color-mix(in srgb, var(--primary) 20%, transparent))',
};
