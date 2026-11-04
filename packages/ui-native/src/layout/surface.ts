/**
 * Native surface helpers: map semantic tone / radius / shadow design tokens
 * to React Native style fragments. Colors come from the active theme (raw
 * hex strings — RN has no CSS variables), radii/shadows from the shared
 * token scale. This is the native counterpart of ui-web's `surface.ts`.
 */
import type { ViewStyle } from 'react-native';
import type { RadiusTokens } from '@prs/ui-shared';
import type { NativeTheme, NativeShadow } from '../theme/tokens';

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

const TONE_BG_KEY: Record<SurfaceTone, keyof NativeTheme['colors'] | null> = {
  auto: null,
  background: 'background',
  surface: 'surface',
  raised: 'surfaceRaised',
  inset: 'surfaceInset',
  primary: 'primary',
  secondary: 'secondary',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
  info: 'info',
};

const TONE_FG_KEY: Record<SurfaceTone, keyof NativeTheme['colors']> = {
  auto: 'foreground',
  background: 'foreground',
  surface: 'foreground',
  raised: 'foreground',
  inset: 'foreground',
  primary: 'primaryForeground',
  secondary: 'secondaryForeground',
  success: 'successForeground',
  warning: 'warningForeground',
  danger: 'dangerForeground',
  info: 'infoForeground',
};

export function toneBackground(tone: SurfaceTone, theme: NativeTheme): string | undefined {
  const key = TONE_BG_KEY[tone];
  return key === null ? undefined : theme.colors[key];
}

export function toneForeground(tone: SurfaceTone, theme: NativeTheme): string {
  return theme.colors[TONE_FG_KEY[tone]];
}

export type RadiusTokenName = keyof Omit<RadiusTokens, 'full'> | 'none' | 'full';

export function radiusStyle(radius: RadiusTokenName | undefined, theme: NativeTheme): ViewStyle {
  if (!radius) return {};
  const value = theme.radius[radius as keyof RadiusTokens];
  return value === undefined ? {} : { borderRadius: value };
}

export type ShadowTokenName = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export function shadowStyle(shadow: ShadowTokenName | undefined, theme: NativeTheme): ViewStyle {
  if (!shadow || shadow === 'none') return {};
  const spec = (theme.shadows as Record<string, NativeShadow>)[shadow];
  return spec ? { ...spec } : {};
}

export function borderStyle(theme: NativeTheme, width = 1): ViewStyle {
  return { borderWidth: width, borderColor: theme.colors.border };
}

/** Compose the full Box surface style from semantic props + theme. */
export function surfaceStyle(
  opts: {
    tone: SurfaceTone;
    colored?: boolean;
    radius?: RadiusTokenName;
    bordered?: boolean;
    shadow?: ShadowTokenName;
  },
  theme: NativeTheme,
): ViewStyle {
  const bg = toneBackground(opts.tone, theme);
  return {
    ...(bg !== undefined ? { backgroundColor: bg } : {}),
    ...(opts.colored && opts.tone !== 'auto' ? { color: toneForeground(opts.tone, theme) } : {}),
    ...radiusStyle(opts.radius, theme),
    ...(opts.bordered ? borderStyle(theme) : {}),
    ...shadowStyle(opts.shadow, theme),
  };
}
