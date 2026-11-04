/**
 * Container — centered, width-constrained page/section wrapper.
 * Max widths come from the shared size tokens (sm 640 / md 768 / lg 1024 /
 * xl 1280 px). Fluid mode fills available width; `paddingX` defaults to a
 * responsive Tailwind gutter so content never touches viewport edges.
 */
import { forwardRef } from 'react';
import type { ElementType, Ref } from 'react';
import type { ContainerSize } from '@prs/ui-shared';
import { rawDesignTokens } from '@prs/ui-shared';
import { cn } from '@prs/ui-shared';
import { Box } from './Box';
import type { BoxProps } from './Box';

const CONTAINER_SIZES = rawDesignTokens.sizes.container;

export type ContainerProps<P extends ElementType = 'div'> = Omit<BoxProps<P>, 'width'> & {
  /** Named max-width token, or a raw CSS length ("90rem"). Default "lg". */
  size?: ContainerSize | string;
  /** Fill the available width (no max-width). Overrides `size`. */
  fluid?: boolean;
  /** Gutter class override. Defaults to px-4 sm:px-6. */
  paddingX?: string;
};

export const Container = forwardRef<HTMLElement, ContainerProps>(function Container(props, ref) {
  const { size = 'lg', fluid = false, paddingX = 'px-4 sm:px-6', className, style, ...rest } = props;
  const maxWidth = fluid ? undefined : CONTAINER_SIZES[size as ContainerSize];
  return (
    <Box
      ref={ref as Ref<HTMLElement>}
      margin="0 auto"
      style={{ maxWidth: fluid ? '100%' : cssSize(maxWidth), ...style }}
      className={cn(paddingX, className)}
      {...rest}
    />
  );
});
