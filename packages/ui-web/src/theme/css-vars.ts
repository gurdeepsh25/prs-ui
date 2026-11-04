/**
 * Web theme: maps raw shared design tokens to CSS custom properties and a
 * typed ThemeColors surface. Components consume `var(--prs-*)` so runtime
 * theming (light/dark/custom) never requires rebuilding components.
 */
import { rawDesignTokens } from '@prs/ui-shared';
import type { ColorTokens, ThemeMode } from '@prs/ui-shared';

/** kebab-case CSS variable name for a camelCase token key, e.g. mutedForeground → --prs-muted-foreground */
export function cssVarName(token: string): string {
  return `--prs-${token.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}`;
}

/** Reference a color token as a CSS var expression, e.g. `var(--prs-primary)`. */
export function colorVar(token: keyof ColorTokens): string {
  return `var(${cssVarName(token)})`;
}

/** Build the `--prs-*: value;` declarations for one mode. */
export function buildCssVariables(mode: ThemeMode): string {
  const colors = rawDesignTokens.colors[mode];
  const shadows = rawDesignTokens.shadows[mode];
  const lines: string[] = [];
  for (const [key, value] of Object.entries(colors)) {
    lines.push(`  ${cssVarName(key)}: ${value};`);
  }
  for (const [key, value] of Object.entries(shadows)) {
    lines.push(`  ${cssVarName(`shadow${key.charAt(0).toUpperCase()}${key.slice(1)}`)}: ${value};`);
  }
  return lines.join('\n');
}

/**
 * Complete stylesheet defining light variables on `:root` and dark overrides
 * under `.dark` (class strategy — works with next-themes and manual toggles).
 * Import once in your app entry (`app/layout.tsx` or `_app.tsx`).
 */
export const prsStylesheet: string = [
  ':root {\n',
  buildCssVariables('light'),
  '\n  --prs-font-family: ',
  rawDesignTokens.typography.fontFamily,
  ';\n}\n\n.dark {\n',
  buildCssVariables('dark'),
  '}\n',
].join('');

/** Typed accessor for consumers building inline styles on web. */
export type WebThemeColors = Record<keyof ColorTokens, string>;

export function getWebThemeColors(mode: ThemeMode = 'light'): WebThemeColors {
  const colors = rawDesignTokens.colors[mode];
  const out = {} as WebThemeColors;
  for (const key of Object.keys(colors) as Array<keyof ColorTokens>) {
    out[key] = colorVar(key);
  }
  return out;
}
