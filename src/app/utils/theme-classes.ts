// Centralized theme class utilities for consistent theming across all components

export const themeClasses = {
  // Backgrounds
  bgPrimary: 'bg-white dark:bg-zinc-950',
  bgSecondary: 'bg-zinc-50 dark:bg-zinc-900',
  bgTertiary: 'bg-zinc-100 dark:bg-zinc-800',
  bgHover: 'hover:bg-zinc-100 dark:hover:bg-zinc-800',
  
  // Text colors
  textPrimary: 'text-zinc-900 dark:text-white',
  textSecondary: 'text-zinc-600 dark:text-zinc-400',
  textTertiary: 'text-zinc-500 dark:text-zinc-500',
  
  // Borders
  borderPrimary: 'border-zinc-200 dark:border-zinc-800',
  borderSecondary: 'border-zinc-300 dark:border-zinc-700',
  
  // Accent colors (adjusted for WCAG compliance)
  accentBg: 'bg-[#0d9488] dark:bg-[#50e080]',
  accentBorder: 'border-[#0d9488] dark:border-[#50e080]',
  accentText: 'text-[#0d9488] dark:text-[#50e080]',
  accentHover: 'hover:bg-[#0f766e] dark:hover:bg-[#3bc76a]',
  
  // Cards
  card: 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800',
  cardHover: 'hover:border-[#0d9488] dark:hover:border-[#50e080]',
  
  // Inputs
  input: 'bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500',
  inputFocus: 'focus:border-[#0d9488] dark:focus:border-[#50e080] focus:ring-[#0d9488] dark:focus:ring-[#50e080]',
  
  // Buttons
  btnPrimary: 'bg-[#0d9488] dark:bg-[#50e080] hover:bg-[#0f766e] dark:hover:bg-[#3bc76a] text-white border-[#0d9488] dark:border-[#50e080]',
  btnSecondary: 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white border-zinc-200 dark:border-zinc-700',
};
