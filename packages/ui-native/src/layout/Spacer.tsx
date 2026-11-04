/**
 * Spacer — invisible flexible gap element for flex layouts.
 * Native counterpart of ui-web Spacer: grows to consume free space by
 * default, or reserves a fixed `size` along the chosen orientation.
 */
import { forwardRef } from 'react';
import type { View } from 'react-native';
import type { DividerOrientation } from '@prs/ui-shared';
import { Box } from './Box';
import type { BoxProps } from './Box';

export type SpacerProps = Omit<BoxProps, 'accessibilityElementsHidden'> & {
  /** Fixed length (dp). When omitted the spacer flexes. */
  size?: number;
  /** Axis along which a fixed `size` is applied inside flex parents. Default "horizontal". */
  orientation?: DividerOrientation;
};

export const Spacer = forwardRef<View, SpacerProps>(function Spacer(props, ref) {
  const { size, orientation = 'horizontal', ...rest } = props;
  return (
    <Box
      ref={ref}
      accessibilityElementsHidden
      importantForAccessibility="no"
      flex={size === undefined ? 1 : undefined}
      width={orientation === 'vertical' ? size : undefined}
      height={orientation === 'horizontal' ? size : undefined}
      {...rest}
    />
  );
});
