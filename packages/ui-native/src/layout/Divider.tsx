/**
 * Divider — thematic break between content sections.
 *
 * Native implementation renders a thin View with the theme border color.
 * RN has no <hr>; accessibilityRole="separator" exposes the boundary to
 * TalkBack/VoiceOver, mirroring the web ARIA semantics.
 */
import { forwardRef } from 'react';
import type { View, ViewProps } from 'react-native';
import type { DividerOrientation } from '@prs/ui-shared';
import { useTheme } from '../theme/ThemeProvider';

export interface DividerProps extends Omit<ViewProps, 'style'> {
  /** Layout direction of the rule. Default "horizontal". */
  orientation?: DividerOrientation;
  /** Visual thickness in dp. Default 1. */
  thickness?: number;
  /** Override stroke color with any theme color string. */
  color?: string;
}

export const Divider = forwardRef<View, DividerProps>(function Divider(props, ref) {
  const { orientation = 'horizontal', thickness = 1, color, style, ...rest } = props;
  const theme = useTheme();
  const stroke = color ?? theme.colors.border;

  return (
    <View
      ref={ref}
      accessibilityRole="separator"
      importantForAccessibility="no"
      style={
        orientation === 'horizontal'
          ? { width: '100%', height: thickness, backgroundColor: stroke, ...style }
          : { width: thickness, alignSelf: 'stretch', backgroundColor: stroke, ...style }
      }
      {...rest}
    />
  );
});
