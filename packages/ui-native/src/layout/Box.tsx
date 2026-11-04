/**
 * Box — the foundational native layout primitive.
 *
 * Mirrors the web Box API (same LayoutStyleProps vocabulary from
 * @prs/ui-shared plus tone/radius/border/shadow surface props), but renders
 * a react-native <View>. Numbers mean dp, strings pass through so "50%"
 * layouts work on both platforms. All remaining View props (testID,
 * accessibilityLabel, onStartShouldSetResponder, …) are forwarded.
 */
import { forwardRef, useMemo } from 'react';
import { View } from 'react-native';
import type { ViewProps, ViewStyle } from 'react-native';
import type { LayoutStyleProps } from '@prs/ui-shared';
import { useTheme } from '../theme/ThemeProvider';
import { layoutToStyle, mergeStyle } from './style';
import { surfaceStyle } from './surface';
import type { RadiusTokenName, ShadowTokenName, SurfaceTone } from './surface';

export interface BoxSurfaceProps {
  /** Semantic background tone from the design system. Default "auto" (transparent). */
  tone?: SurfaceTone;
  /** Also apply the matching foreground text color for `tone`. Default false. */
  colored?: boolean;
  /** Border radius token name. */
  radius?: RadiusTokenName;
  /** Apply a hairline border using the theme border color. */
  bordered?: boolean;
  /** Elevation shadow token (iOS shadow + Android elevation). */
  shadow?: ShadowTokenName;
}

export type BoxProps = Omit<ViewProps, 'style'> &
  Omit<LayoutStyleProps, keyof ViewProps> &
  BoxSurfaceProps & {
    style?: ViewStyle | ViewStyle[];
  };

/** Keys consumed by the layout translator (never forwarded to View). */
const LAYOUT_KEYS = new Set<string>([
  'width',
  'height',
  'minWidth',
  'minHeight',
  'maxWidth',
  'maxHeight',
  'flex',
  'padding',
  'paddingHorizontal',
  'paddingVertical',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'margin',
  'marginHorizontal',
  'marginVertical',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'gap',
  'rowGap',
  'columnGap',
  'display',
  'flexDirection',
  'flexWrap',
  'flexGrow',
  'flexShrink',
  'basis',
  'alignItems',
  'alignContent',
  'justifyContent',
  'alignSelf',
  'position',
  'overflow',
  'order',
  'textAlign',
  'aspectRatio',
  'top',
  'right',
  'bottom',
  'left',
]);

export const Box = forwardRef<View, BoxProps>(function Box(props, ref) {
  const {
    tone = 'auto',
    colored = false,
    radius,
    bordered = false,
    shadow,
    style,
    ...rest
  } = props;

  const theme = useTheme();

  const [layoutProps, viewProps] = useMemo(() => {
    const layout: Record<string, unknown> = {};
    const view: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(rest)) {
      if (LAYOUT_KEYS.has(key)) layout[key] = value;
      else view[key] = value;
    }
    return [layout as Partial<LayoutStyleProps>, view as ViewProps];
  }, [rest]);

  const computed = useMemo(
    () => [
      layoutToStyle(layoutProps),
      surfaceStyle({ tone, colored, radius, bordered, shadow }, theme),
    ],
    [layoutProps, tone, colored, radius, bordered, shadow, theme],
  );

  return (
    <View
      ref={ref}
      {...viewProps}
      style={mergeStyle(computed[0] as ViewStyle, computed[1], style)}
    />
  );
});
