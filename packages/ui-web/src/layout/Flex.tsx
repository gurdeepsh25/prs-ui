/**
 * Flex — Box preset with display:flex and flex-item friendly props.
 * Use when you want the full LayoutStyleProps vocabulary without Stack's
 * `space` shorthand; Stack/Row/Column cover the common spacing ergonomics.
 */
import { forwardRef } from 'react';
import type { ElementType, Ref } from 'react';
import { Box } from './Box';
import type { BoxProps } from './Box';

export type FlexProps<P extends ElementType = 'div'> = Omit<BoxProps<P>, 'display'> & {
  /** Inline flex instead of block-level flex. Default false. */
  inline?: boolean;
};

export const Flex = forwardRef<HTMLElement, FlexProps>(function Flex(props, ref) {
  const { inline = false, ...rest } = props;
  return <Box ref={ref as Ref<HTMLElement>} display={inline ? 'inline-flex' : 'flex'} {...rest} />;
});
