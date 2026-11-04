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
import type { ScrollViewProps, ViewStyle } from 'react-native';
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
  style?: ViewStyle | ViewStyle[];
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
  const vertical = orientation === 'vertical' || orientation === 'both';

  return (
    <ScrollView
      ref={ref}
      accessible
      accessibilityLabel={ariaLabel}
      accessibilityRole="summary"
      horizontal={horizontal && !vertical ? true : horizontal}
      scrollEnabled
      showsHorizontalScrollIndicator={horizontal && !hideScrollbars}
      showsVerticalScrollIndicator={!hideScrollbars}
      bounces={false}
      style={[{ height: height as number | string | undefined, maxHeight: maxHeight as number | string | undefined }, style]}
      {...rest}
    />
  );
});
