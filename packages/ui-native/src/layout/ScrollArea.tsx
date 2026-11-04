/**
 * ScrollArea — a scrollable region with constrained viewport.
 *
 * Native counterpart of ui-web ScrollArea. Uses react-native's ScrollView
 * (native inertial scrolling + keyboard avoidance handled by the platform).
 * `orientation="horizontal"` maps to horizontal paging-free scrolling;
 * `hideScrollbars` toggles the platform scrollbar indicators.
 */
import { forwardRef } from 'react';
import { ScrollView } from 'react-native';
import type { ScrollViewProps, StyleProp, ViewStyle } from 'react-native';
import type { SpaceValue } from '@prs/ui-shared';

export interface ScrollAreaProps extends Omit<ScrollViewProps, 'style'> {
  /** Constrained height (dp). Omit to size to content up to maxHeight. */
  height?: SpaceValue;
  /** Maximum height before scrolling kicks in (dp). */
  maxHeight?: SpaceValue;
  /** Which axes can scroll. Default "vertical". */
  orientation?: 'vertical' | 'horizontal' | 'both';
  /** Accessible name for the scrollable region. */
  ariaLabel?: string;
  /** Hide native scrollbars visually while keeping scroll behavior. Default false. */
  hideScrollbars?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const ScrollArea = forwardRef<ScrollView, ScrollAreaProps>(function ScrollArea(props, ref) {
  const {
    height,
    maxHeight,
    orientation = 'vertical',
    ariaLabel,
    hideScrollbars = false,
    style,
    ...rest
  } = props;

  const horizontal = orientation === 'horizontal' || orientation === 'both';

  return (
    <ScrollView
      ref={ref}
      accessible
      accessibilityLabel={ariaLabel}
      accessibilityRole="summary"
      horizontal={horizontal}
      scrollEnabled
      showsHorizontalScrollIndicator={horizontal && !hideScrollbars}
      showsVerticalScrollIndicator={!hideScrollbars}
      bounces={false}
      style={[
        {
          flexGrow: horizontal ? 0 : undefined,
          height: lenDimension(height),
          maxHeight: lenDimension(maxHeight),
        },
        style,
      ]}
      {...rest}
    />
  );
});

/** Dp numbers pass through; percentage strings are accepted as RN dimensions. */
function lenDimension(value: SpaceValue | undefined): number | `${number}%` | undefined {
  if (value === undefined) return undefined;
  if (typeof value === 'number') return value;
  if (/^-?\d+(?:\.\d+)?%$/.test(value)) return value as `${number}%`;
  const pxMatch = /^(-?\d+(?:\.\d+)?)px$/.exec(value);
  if (pxMatch?.[1] !== undefined) return Number.parseFloat(pxMatch[1]);
  const num = Number.parseFloat(value);
  return Number.isNaN(num) ? undefined : num;
}
