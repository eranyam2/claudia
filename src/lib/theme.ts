export type Theme = 'dark' | 'light';

export const themes = {
  dark: {
    background: 'oklch(0.12 0.01 240)',
    foreground: 'oklch(0.98 0.01 240)',
    card: 'oklch(0.14 0.01 240)',
    cardForeground: 'oklch(0.98 0.01 240)',
    popover: 'oklch(0.12 0.01 240)',
    popoverForeground: 'oklch(0.98 0.01 240)',
    primary: 'oklch(0.98 0.01 240)',
    primaryForeground: 'oklch(0.17 0.01 240)',
    secondary: 'oklch(0.16 0.01 240)',
    secondaryForeground: 'oklch(0.98 0.01 240)',
    muted: 'oklch(0.16 0.01 240)',
    mutedForeground: 'oklch(0.68 0.01 240)',
    accent: 'oklch(0.16 0.01 240)',
    accentForeground: 'oklch(0.98 0.01 240)',
    destructive: 'oklch(0.6 0.2 25)',
    destructiveForeground: 'oklch(0.98 0.01 240)',
    border: 'oklch(0.16 0.01 240)',
    input: 'oklch(0.16 0.01 240)',
    ring: 'oklch(0.52 0.015 240)',
    green500: 'oklch(0.72 0.20 142)',
    green600: 'oklch(0.64 0.22 142)',
  },
  light: {
    background: 'oklch(0.98 0.01 240)',
    foreground: 'oklch(0.12 0.01 240)',
    card: 'oklch(0.96 0.01 240)',
    cardForeground: 'oklch(0.12 0.01 240)',
    popover: 'oklch(0.98 0.01 240)',
    popoverForeground: 'oklch(0.12 0.01 240)',
    primary: 'oklch(0.12 0.01 240)',
    primaryForeground: 'oklch(0.98 0.01 240)',
    secondary: 'oklch(0.94 0.01 240)',
    secondaryForeground: 'oklch(0.12 0.01 240)',
    muted: 'oklch(0.94 0.01 240)',
    mutedForeground: 'oklch(0.45 0.01 240)',
    accent: 'oklch(0.94 0.01 240)',
    accentForeground: 'oklch(0.12 0.01 240)',
    destructive: 'oklch(0.6 0.2 25)',
    destructiveForeground: 'oklch(0.98 0.01 240)',
    border: 'oklch(0.88 0.01 240)',
    input: 'oklch(0.88 0.01 240)',
    ring: 'oklch(0.52 0.015 240)',
    green500: 'oklch(0.72 0.20 142)',
    green600: 'oklch(0.64 0.22 142)',
  },
} as const;

export const DEFAULT_THEME: Theme = 'dark';
export const THEME_STORAGE_KEY = 'claudia-theme';

export function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return DEFAULT_THEME;
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches 
    ? 'dark' 
    : 'light';
}

export function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return DEFAULT_THEME;
  
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === 'dark' || stored === 'light') {
    return stored;
  }
  
  return getSystemTheme();
}

export function setStoredTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

export function applyTheme(theme: Theme): void {
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  const themeColors = themes[theme];
  
  // Apply CSS variables
  Object.entries(themeColors).forEach(([key, value]) => {
    const cssVar = `--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
    root.style.setProperty(cssVar, value);
  });
  
  // Set data attribute for conditional styling
  root.setAttribute('data-theme', theme);
}