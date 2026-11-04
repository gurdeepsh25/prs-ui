/**
 * Separator — non-visual semantic boundary between elements.
 * Native counterpart of ui-web Separator: an invisible View exposed to
 * TalkBack/VoiceOver via accessibilityRole="separator". Optional `spacing`
 * makes it occupy layout space on the chosen axis.
 */
import { forwardRef } from 'react';
import { View } from 'react-native';
import type { StyleProp, ViewProps, ViewStyle } from 'react-native';
import type { DividerOrientation } from '@prs/ui-shared';

export interface SeparatorProps extends Omit<ViewProps, 'style'> {
  /** Orientation reported to assistive tech and used for layout spacing. Default "horizontal". */
  orientation?: DividerOrientation;
  /** Also apply decorative spacing so the element occupies space. Default 0 (invisible). */
  spacing?: number;
  style?: StyleProp<ViewStyle>;
}

export const Separator = forwardRef<View, SeparatorProps>(function Separator(props, ref) {
  const { orientation = 'horizontal', spacing, style, ...rest } = props;
  const size = spacing ?? 0;
  return (
    <View
      ref={ref}
      // RN has no dedicated "separator" role; expose as a non-important
      // image element so TalkBack/VoiceOver can announce the boundary.
      accessibilityRole="image"
      accessibilityLabel="Separator"
      importantForAccessibility={spacing ? 'yes' : 'no'}
      style={[
        orientation === 'horizontal'
          ? { width: '100%', height: size }
          : { height: '100%', width: size, alignSelf: 'stretch' },
        style,
      ]}
      {...rest}
    />
  );
});
