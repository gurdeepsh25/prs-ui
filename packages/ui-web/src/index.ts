/**
 * @prs/ui-web entry point.
 *
 * Web-side shared UI components for React 18/19 and Next.js
 * (App Router with Server Components support, and Pages Router).
 *
 * All modules are client-safe; server components can import this package
 * freely as long as they render interactive primitives inside Client
 * Components. Styling is Tailwind-driven via `prsTailwindPreset` plus the
 * `--prs-*` CSS variables emitted by `prsStylesheet`.
 */

export * from './theme/css-vars';
export { prsTailwindPreset, default as tailwindPreset } from './theme/tailwind-preset';
export { ThemeProvider, useWebTheme, WebThemeContext } from './theme/ThemeProvider';
export type { ThemeProviderProps, WebThemeContextValue } from './theme/ThemeProvider';
