/**
 * Tailwind CSS v3 preset generated from the shared PRS design tokens.
 *
 * Colors reference the `--prs-*` CSS variables (defined by `prsStylesheet`),
 * so switching `.dark` on <html> re-themes every component with zero rebuild.
 *
 * Usage in a consumer's tailwind.config.ts:
 * ```ts
 * import prsPreset from '@prs/ui-web/tailwind-preset';
 * export default { presets: [prsPreset], content: [require('@prs/ui-web/content-glob')] };
 * ```
 */
import type { Config } from 'tailwindcss';
import { rawDesignTokens } from '@prs/ui-shared';

const colorKeys = Object.keys(rawDesignTokens.colors.light) as Array<
  keyof typeof rawDesignTokens.colors.light
>;

/** camelCase token key → kebab-case CSS variable name. */
function varFor(key: string): string {
  return `var(--prs-${key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)})`;
}

export const prsTailwindPreset: Partial<Config> = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: Object.fromEntries(colorKeys.map((key) => [key, varFor(key)])),
      fontFamily: {
        sans: ['var(--prs-font-family)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: Object.fromEntries(
        Object.entries(rawDesignTokens.typography.fontSize).map(([k, v]) => [
          k,
          [`${v}px`, { lineHeight: `${Math.round(v * rawDesignTokens.typography.lineHeight.normal)}px` }],
        ]),
      ),
      fontWeight: rawDesignTokens.typography.fontWeight,
      spacing: rawDesignTokens.spacing.scale,
      borderRadius: {
        none: `${rawDesignTokens.radius.none}px`,
        sm: `${rawDesignTokens.radius.sm}px`,
        md: `${rawDesignTokens.radius.md}px`,
        lg: `${rawDesignTokens.radius.lg}px`,
        xl: `${rawDesignTokens.radius.xl}px`,
        full: rawDesignTokens.radius.full,
      },
      boxShadow: {
        xs: 'var(--prs-shadow-xs)',
        sm: 'var(--prs-shadow-sm)',
        md: 'var(--prs-shadow-md)',
        lg: 'var(--prs-shadow-lg)',
        xl: 'var(--prs-shadow-xl)',
      },
      maxWidth: Object.fromEntries(
        Object.entries(rawDesignTokens.sizes.container).map(([k, v]) => [k, `${v}px`]),
      ),
      screens: Object.fromEntries(
        Object.entries(rawDesignTokens.sizes.breakpoint).map(([k, v]) => [k, `${v}px`]),
      ),
      zIndex: Object.fromEntries(
        Object.entries(rawDesignTokens.zIndex).map(([k, v]) => [k, String(v)]),
      ),
      transitionDuration: {
        fast: `${rawDesignTokens.motion.durationFast}ms`,
        base: `${rawDesignTokens.motion.durationBase}ms`,
        slow: `${rawDesignTokens.motion.durationSlow}ms`,
      },
      transitionTimingFunction: {
        standard: rawDesignTokens.motion.easeStandard,
        out: rawDesignTokens.motion.easeOut,
        in: rawDesignTokens.motion.easeIn,
      },
    },
  },
};

export default prsTailwindPreset;
