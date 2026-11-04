/**
 * Native theme: resolves shared design tokens into plain JS objects usable
 * directly with React Native's StyleSheet / inline styles. Colors are raw
 * hex/rgba strings (no CSS vars) because RN has no cascade; runtime theming
 * is done via ThemeProvider context below.
 */
import { rawDesignTokens } from '@prs/ui-shared';
import type { ColorTokens, RadiusTokens, SizeTokens, SpacingTokens, ThemeMode, TypographyTokens, MotionTokens, ZIndexTokens } from '@prs/ui-shared';

/** RN-friendly shadow spec (offsets + radius map to View style props). */
export interface NativeShadow {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

export interface NativeTheme {
  mode: ThemeMode;
  colors: ColorTokens;
  spacing: SpacingTokens['scale'];
  spacingBase: number;
  radius: RadiusTokens;
  typography: TypographyTokens;
  sizes: SizeTokens;
  shadows: Record<keyof RadiusTokens | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'none', NativeShadow> | Record<string, NativeShadow>;
  motion: MotionTokens;
  zIndex: ZIndexTokens;
}

const shadowSpecs: Record<ThemeMode, Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', NativeShadow>> = {
  light: {
    xs: { shadowColor: '#0f172a', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
    sm: { shadowColor: '#0f172a', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
    md: { shadowColor: '#0f172a', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
    lg: { shadowColor: '#0f172a', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 6 },
    xl: { shadowColor: '#0f172a', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 20, elevation: 12 },
  },
  dark: {
    xs: { shadowColor: '#000000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.3, shadowRadius: 2, elevation: 1 },
    sm: { shadowColor: '#000000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.4, shadowRadius: 3, elevation: 2 },
    md: { shadowColor: '#000000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.4, shadowRadius: 6, elevation: 3 },
    lg: { shadowColor: '#000000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.45, shadowRadius: 12, elevation: 6 },
    xl: { shadowColor: '#000000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.5, shadowRadius: 20, elevation: 12 },
  },
};

/** Build a complete native theme for the given mode. */
export function createNativeTheme(mode: ThemeMode = 'light'): NativeTheme {
  return {
    mode,
    colors: rawDesignTokens.colors[mode],
    spacing: rawDesignTokens.spacing.scale,
    spacingBase: rawDesignTokens.spacing.base,
    radius: rawDesignTokens.radius,
    typography: rawDesignTokens.typography,
    sizes: rawDesignTokens.sizes,
    shadows: shadowSpecs[mode],
    motion: rawDesignTokens.motion,
    zIndex: rawDesignTokens.zIndex,
  };
}

export const lightTheme: NativeTheme = createNativeTheme('light');
export const darkTheme: NativeTheme = createNativeTheme('dark');
