/**
 * Center — centers children on both axes using RN flex defaults.
 * Native counterpart of ui-web Center.
 */
import { forwardRef } from 'react';
import type { View } from 'react-native';
import { Box } from './Box';
import type { BoxProps } from './Box';

export type CenterProps = BoxProps & {
  /** No-op on native (kept for cross-platform API parity). Default false. */
  inline?: boolean;
};

export const Center = forwardRef<View, CenterProps>(function Center(props, ref) {
  const { inline: _inline, ...rest } = props;
  return <Box ref={ref} display="flex" alignItems="center" justifyContent="center" {...rest} />;
});
