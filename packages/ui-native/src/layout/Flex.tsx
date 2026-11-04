/**
 * Flex — Box preset with flex container defaults and flex-item friendly props.
 * Native counterpart of ui-web Flex. `inline` has no RN equivalent (all Views
 * are already flex containers), so it is accepted for API parity but ignored.
 */
import { forwardRef } from 'react';
import type { View } from 'react-native';
import { Box } from './Box';
import type { BoxProps } from './Box';

export type FlexProps = BoxProps & {
  /** No-op on native (kept for cross-platform API parity). Default false. */
  inline?: boolean;
};

export const Flex = forwardRef<View, FlexProps>(function Flex(props, ref) {
  const { inline: _inline, ...rest } = props;
  return <Box ref={ref} display="flex" {...rest} />;
});
