/**
 * Center — centers children on both axes. Optional `inline` variant keeps
 * the element in document flow. Server-renderable Box preset.
 */
import { forwardRef } from 'react';
import type { ElementType, Ref } from 'react';
import { Box } from './Box';
import type { BoxProps } from './Box';

export type CenterProps<P extends ElementType = 'div'> = Omit<BoxProps<P>, 'display'> & {
  /** Use inline-flex instead of flex. Default false. */
  inline?: boolean;
};

export const Center = forwardRef<HTMLElement, CenterProps>(function Center(props, ref) {
  const { inline = false, ...rest } = props;
  return (
    <Box
      ref={ref as Ref<HTMLElement>}
      display={inline ? 'inline-flex' : 'flex'}
      alignItems="center"
      justifyContent="center"
      {...rest}
    />
  );
});
