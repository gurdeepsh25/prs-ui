/**
 * Native ThemeProvider / useTheme — context-based runtime theming for
 * React Native. No DOM APIs, no CSS; pure RN-compatible React.
 */
import { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { ThemeMode } from '@prs/ui-shared';
import { createNativeTheme, lightTheme } from './tokens';
import type { NativeTheme } from './tokens';

const ThemeContext = createContext<NativeTheme>(lightTheme);

export interface ThemeProviderProps {
  mode?: ThemeMode;
  /** Fully custom theme; takes precedence over `mode`. */
  theme?: NativeTheme;
  children: ReactNode;
}

export function ThemeProvider({ mode = 'light', theme, children }: ThemeProviderProps) {
  const value = useMemo(() => theme ?? createNativeTheme(mode), [theme, mode]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/** Access the current native theme inside any PRS component or consumer code. */
export function useTheme(): NativeTheme {
  return useContext(ThemeContext);
}
