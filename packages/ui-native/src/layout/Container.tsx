/**
 * Container — width-constrained content wrapper.
 *
 * On the web this centers a max-width box in the viewport; on native the
 * parent already fills the screen, so "centering" maps to horizontal padding
 * derived from the same shared size tokens (the gutter grows with the named
 * size). `fluid` removes the gutter entirely. This is the documented
 * platform difference between the two implementations.
 */
import { forwardRef } from 'react';
import type { View } from 'react-native';
import type { ContainerSize } from '@prs/ui-shared';
import { rawDesignTokens } from '@prs/ui-shared';
import { Box } from './Box';
import type { BoxProps } from './Box';

const CONTAINER_SIZES = rawDesignTokens.sizes.container;

/** Gutter that keeps content readable at typical phone widths per size step. */
const GUTTER: Record<ContainerSize, number> = { sm: 12, md: 16, lg: 20, xl: 24 };

export type ContainerProps = Omit<BoxProps, 'width'> & {
  /** Named size token controlling the horizontal gutter. Default "lg". */
  size?: ContainerSize | string;
  /** Full-bleed: no horizontal gutter. Overrides `size`. */
  fluid?: boolean;
};

export const Container = forwardRef<View, ContainerProps>(function Container(props, ref) {
  const { size = 'lg', fluid = false, style, ...rest } = props;
  const named = CONTAINER_SIZES[size as ContainerSize];
  const gutter = fluid ? 0 : (GUTTER[size as ContainerSize] ?? (named !== undefined ? 20 : 16));
  return <Box ref={ref} paddingHorizontal={gutter} style={style} {...rest} />;
});
