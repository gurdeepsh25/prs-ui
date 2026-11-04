/**
 * AspectRatio — constrains its child to a fixed width/height ratio.
 * RN supports `aspectRatio` natively on View styles; the single wrapper
 * fills it exactly like the web version (children stretch to the box).
 */
import { forwardRef } from 'react';
import { View } from 'react-native';
import type { ViewStyle } from 'react-native';
import type { ReactNode } from 'react';

export interface AspectRatioProps {
  /** Width ÷ height ratio, e.g. 16 / 9. Default 1. */
  ratio?: number;
  children?: ReactNode;
  style?: ViewStyle | ViewStyle[];
  testID?: string;
}

export const AspectRatio = forwardRef<View, AspectRatioProps>(function AspectRatio(props, ref) {
  const { ratio = 1, children, style, testID } = props;
  return (
    <View
      ref={ref}
      testID={testID}
      style={[{ width: '100%', aspectRatio: ratio, overflow: 'hidden' }, style]}
    >
      {children}
    </View>
  );
});
