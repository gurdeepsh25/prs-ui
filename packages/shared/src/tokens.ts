/**
 * PRS UI design tokens — platform-agnostic source of truth.
 *
 * These raw (unmapped) token values are consumed by both `@prs/ui-web`
 * (emitted as CSS variables + a Tailwind preset) and `@prs/ui-native`
 * (emitted as a typed StyleSheet-friendly theme object). Components should
 * never hard-code colors, spacing or radii; they read from the resolved
 * theme of their platform package instead.
 */

export type ThemeMode = 'light' | 'dark';

/** Semantic color slots used across every component on both platforms. */
export interface ColorTokens {
  /** Brand colors */
  primary: string;
  primaryStrong: string;
  primarySubtle: string;
  primaryForeground: string;
  secondary: string;
  secondaryStrong: string;
  secondarySubtle: string;
  secondaryForeground: string;
  /** Surfaces */
  background: string;
  surface: string;
  surfaceRaised: string;
  surfaceInset: string;
  /** Text */
  foreground: string;
  mutedForeground: string;
  subtleForeground: string;
  /** Boundaries */
  border: string;
  borderStrong: string;
  /** Interactive states */
  focus: string;
  overlay: string;
  inverseSurface: string;
  inverseForeground: string;
  /** Feedback */
  success: string;
  successSubtle: string;
  successForeground: string;
  warning: string;
  warningSubtle: string;
  warningForeground: string;
  danger: string;
  dangerSubtle: string;
  dangerForeground: string;
  info: string;
  infoSubtle: string;
  infoForeground: string;
}

export interface TypographyTokens {
  fontFamily: string;
  fontSize: Record<string, number>;
  fontWeight: Record<string, number>;
  lineHeight: Record<string, number>;
}

export interface SpacingTokens {
  /** Base unit in px; every named step is an integer multiple of it. */
  base: number;
  scale: Record<string, number>;
}

export interface RadiusTokens {
  none: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  full: string;
}

export interface ShadowTokens {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  none: string;
}

export interface SizeTokens {
  /** Shared control sizes (height in px) used by Button, Input, Select, etc. */
  control: Record<'sm' | 'md' | 'lg', number>;
  /** Icon sizing aligned with control sizes. */
  icon: Record<'sm' | 'md' | 'lg', number>;
  /** Maximum content width for page/section containers (web). */
  container: Record<'sm' | 'md' | 'lg' | 'xl', number>;
  breakpoint: Record<'sm' | 'md' | 'lg' | 'xl', number>;
}

export interface MotionTokens {
  durationFast: number;
  durationBase: number;
  durationSlow: number;
  easeStandard: string;
  easeOut: string;
  easeIn: string;
}

export interface ZIndexTokens {
  hide: number;
  base: number;
  raised: number;
  dropdown: number;
  sticky: number;
  overlay: number;
  modal: number;
  popover: number;
  toast: number;
  tooltip: number;
}

export interface RawDesignTokens {
  colors: Record<ThemeMode, ColorTokens>;
  typography: TypographyTokens;
  spacing: SpacingTokens;
  radius: RadiusTokens;
  shadows: Record<ThemeMode, ShadowTokens>;
  sizes: SizeTokens;
  motion: MotionTokens;
  zIndex: ZIndexTokens;
}

/** Neutral gray ramp (slate-like), keys are steps 50–950. */
const gray: Record<number, string> = {
  50: '#f8fafc',
  100: '#f1f5f9',
  200: '#e2e8f0',
  300: '#cbd5e1',
  400: '#94a3b8',
  500: '#64748b',
  600: '#475569',
  700: '#334155',
  800: '#1e293b',
  900: '#0f172a',
  950: '#020617',
};

/** Indigo brand ramp. */
const indigo: Record<number, string> = {
  50: '#eef2ff',
  100: '#e0e7ff',
  200: '#c7d2fe',
  300: '#a5b4fc',
  400: '#818cf8',
  500: '#6366f1',
  600: '#4f46e5',
  700: '#4338ca',
  800: '#3730a3',
  900: '#312e81',
};

/** Violet secondary ramp. */
const violet: Record<number, string> = {
  100: '#ede9fe',
  500: '#8b5cf6',
  600: '#7c3aed',
  700: '#6d28d9',
};

const emerald: Record<number, string> = { 100: '#d1fae5', 500: '#10b981', 700: '#047857' };
const amber: Record<number, string> = { 100: '#fef3c7', 500: '#f59e0b', 800: '#92400e' };
const rose: Record<number, string> = { 100: '#ffe4e6', 500: '#f43f5e', 700: '#be123c' };
const sky: Record<number, string> = { 100: '#e0f2fe', 500: '#0ea5e9', 700: '#0369a1' };

const lightColors: ColorTokens = {
  primary: indigo[600]!,
  primaryStrong: indigo[700]!,
  primarySubtle: indigo[100]!,
  primaryForeground: '#ffffff',
  secondary: violet[600]!,
  secondaryStrong: violet[700]!,
  secondarySubtle: violet[100]!,
  secondaryForeground: '#ffffff',
  background: '#ffffff',
  surface: gray[50]!,
  surfaceRaised: '#ffffff',
  surfaceInset: gray[100]!,
  foreground: gray[900]!,
  mutedForeground: gray[500]!,
  subtleForeground: gray[400]!,
  border: gray[200]!,
  borderStrong: gray[300]!,
  focus: indigo[500]!,
  overlay: 'rgba(15, 23, 42, 0.5)',
  inverseSurface: gray[900]!,
  inverseForeground: gray[50]!,
  success: emerald[500]!,
  successSubtle: emerald[100]!,
  successForeground: emerald[700]!,
  warning: amber[500]!,
  warningSubtle: amber[100]!,
  warningForeground: amber[800]!,
  danger: rose[500]!,
  dangerSubtle: rose[100]!,
  dangerForeground: rose[700]!,
  info: sky[500]!,
  infoSubtle: sky[100]!,
  infoForeground: sky[700]!,
};

const darkColors: ColorTokens = {
  primary: indigo[400]!,
  primaryStrong: indigo[300]!,
  primarySubtle: indigo[900]!,
  primaryForeground: gray[950]!,
  secondary: violet[500]!,
  secondaryStrong: violet[400]!,
  secondarySubtle: violet[700]!,
  secondaryForeground: gray[950]!,
  background: gray[950]!,
  surface: gray[900]!,
  surfaceRaised: gray[800]!,
  surfaceInset: '#0b1120',
  foreground: gray[50]!,
  mutedForeground: gray[400]!,
  subtleForeground: gray[500]!,
  border: gray[700]!,
  borderStrong: gray[600]!,
  focus: indigo[400]!,
  overlay: 'rgba(2, 6, 23, 0.7)',
  inverseSurface: gray[50]!,
  inverseForeground: gray[900]!,
  success: emerald[500]!,
  successSubtle: '#064e3b',
  successForeground: '#6ee7b7',
  warning: amber[500]!,
  warningSubtle: '#78350f',
  warningForeground: '#fcd34d',
  danger: rose[500]!,
  dangerSubtle: '#881337',
  dangerForeground: '#fda4af',
  info: sky[500]!,
  infoSubtle: '#0c4a6e',
  infoForeground: '#7dd3fc',
};

export const rawDesignTokens: RawDesignTokens = {
  colors: { light: lightColors, dark: darkColors },
  typography: {
    fontFamily:
      "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
      '5xl': 48,
    },
    fontWeight: { normal: 400, medium: 500, semibold: 600, bold: 700 },
    lineHeight: { tight: 1.2, snug: 1.35, normal: 1.5, relaxed: 1.65 },
  },
  spacing: {
    base: 4,
    scale: {
      0: 0,
      px: 1,
      0.5: 2,
      1: 4,
      1.5: 6,
      2: 8,
      2.5: 10,
      3: 12,
      3.5: 14,
      4: 16,
      5: 20,
      6: 24,
      7: 28,
      8: 32,
      9: 36,
      10: 40,
      11: 44,
      12: 48,
      14: 56,
      16: 64,
      20: 80,
      24: 96,
      28: 112,
      32: 128,
      36: 144,
      40: 160,
      44: 176,
      48: 192,
      52: 208,
      56: 224,
      60: 240,
      64: 256,
      72: 288,
      80: 320,
      96: 384,
    },
  },
  radius: { none: 0, sm: 4, md: 6, lg: 8, xl: 12, full: '9999px' },
  shadows: {
    light: {
      xs: '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
      sm: '0 1px 3px 0 rgba(15, 23, 42, 0.1), 0 1px 2px -1px rgba(15, 23, 42, 0.1)',
      md: '0 4px 6px -1px rgba(15, 23, 42, 0.1), 0 2px 4px -2px rgba(15, 23, 42, 0.1)',
      lg: '0 10px 15px -3px rgba(15, 23, 42, 0.1), 0 4px 6px -4px rgba(15, 23, 42, 0.1)',
      xl: '0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.1)',
      none: 'none',
    },
    dark: {
      xs: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
      sm: '0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px -1px rgba(0, 0, 0, 0.4)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.4)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.45), 0 4px 6px -4px rgba(0, 0, 0, 0.45)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
      none: 'none',
    },
  },
  sizes: {
    control: { sm: 32, md: 40, lg: 48 },
    icon: { sm: 16, md: 20, lg: 24 },
    container: { sm: 640, md: 768, lg: 1024, xl: 1280 },
    breakpoint: { sm: 640, md: 768, lg: 1024, xl: 1280 },
  },
  motion: {
    durationFast: 120,
    durationBase: 200,
    durationSlow: 300,
    easeStandard: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  },
  zIndex: {
    hide: -1,
    base: 0,
    raised: 1,
    dropdown: 1000,
    sticky: 1100,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    toast: 1600,
    tooltip: 1700,
  },
};
