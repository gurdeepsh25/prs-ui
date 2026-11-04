/**
 * Surface helpers: map semantic tone / radius / shadow tokens to Tailwind
 * utility class fragments referencing the --prs-* CSS variables.
 */
import type { RadiusTokens } from '@prs/ui-shared';

export type SurfaceTone =
  | 'auto'
  | 'background'
  | 'surface'
  | 'raised'
  | 'inset'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';

const TONE_BG: Record<SurfaceTone, string> = {
  auto: '',
  background: 'bg-background',
  surface: 'bg-surface',
  raised: 'bg-surface-raised',
  inset: 'bg-surface-inset',
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  info: 'bg-info',
};

const TONE_FG: Record<SurfaceTone, string> = {
  auto: '',
  background: 'text-foreground',
  surface: 'text-foreground',
  raised: 'text-foreground',
  inset: 'text-foreground',
  primary: 'text-primary-foreground',
  secondary: 'text-secondary-foreground',
  success: 'text-success-foreground',
  warning: 'text-warning-foreground',
  danger: 'text-danger-foreground',
  info: 'text-info-foreground',
};

export function toneBackground(tone: SurfaceTone): string {
  return TONE_BG[tone];
}

export function toneForeground(tone: SurfaceTone): string {
  return TONE_FG[tone];
}

export type RadiusTokenName = keyof Omit<RadiusTokens, 'full'> | 'none' | 'full';

const RADIUS_CLASS: Record<string, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
};

export function radiusClass(radius: RadiusTokenName | undefined): string {
  if (!radius) return '';
  return RADIUS_CLASS[radius] ?? '';
}

export type ShadowTokenName = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export function shadowClass(shadow: ShadowTokenName | undefined): string {
  if (!shadow || shadow === 'none') return '';
  return `shadow-${shadow}`;
}
