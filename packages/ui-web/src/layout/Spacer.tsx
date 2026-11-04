/**
 * Spacer — invisible flexible gap element for flex layouts.
 * By default it grows to consume free space (push siblings apart); give it a
 * fixed `size` to reserve exact space instead. Purely decorative.
 */
import { forwardRef } from 'react';
import type { Ref } from 'react';
import type { DividerOrientation } from '@prs/ui-shared';
import { Box } from './Box';
import type { BoxProps } from './Box';

export type SpacerProps = Omit<BoxProps<'span'>, 'as'> & {
  /** Fixed length (number = px, string = CSS length). When omitted the spacer flexes. */
  size?: number | string;
  /** Axis along which a fixed `size` is applied inside flex parents. Default "horizontal". */
  orientation?: DividerOrientation;
};

export const Spacer = forwardRef<HTMLSpanElement, SpacerProps>(function Spacer(props, ref) {
  const { size, orientation = 'horizontal', ...rest } = props;
  return (
    <Box
      as="span"
      ref={ref as Ref<HTMLElement>}
      aria-hidden="true"
      flex={size === undefined ? 1 : undefined}
      width={orientation === 'vertical' ? size : undefined}
      height={orientation === 'horizontal' ? size : undefined}
      {...rest}
    />
  );
});
