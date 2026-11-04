/**
 * Web theme context: lets consumers override the CSS-variable prefix and
 * inject base styles. Components themselves style via Tailwind utilities
 * referencing `var(--prs-*)`, so no context is required for theming — this
 * provider exists for advanced multi-root / scoped-theme setups.
 */
import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

export interface WebThemeContextValue {
  /** Prefix of the injected CSS custom properties. Defaults to "--prs". */
  variablePrefix: string;
}

const defaultContext: WebThemeContextValue = { variablePrefix: '--prs' };

export const WebThemeContext = createContext<WebThemeContextValue>(defaultContext);

export interface ThemeProviderProps {
  children: ReactNode;
  variablePrefix?: string;
}

export function ThemeProvider({ children, variablePrefix = '--prs' }: ThemeProviderProps) {
  return <WebThemeContext.Provider value={{ variablePrefix }}>{children}</WebThemeContext.Provider>;
}

export function useWebTheme(): WebThemeContextValue {
  return useContext(WebThemeContext);
}
