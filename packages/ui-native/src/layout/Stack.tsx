/**
 * Stack family — flex containers built on native Box.
 *
 * Mirrors the web Stack/Row/Column/VStack API exactly: `direction`, `align`,
 * `justify`, `wrap` and the `space` shorthand (named spacing-scale step or
 * raw dp value). Pure presentational wrappers over View.
 */
import { forwardRef } from 'react';
import type { View } from 'react-native';
import type { FlexDirection, SpaceValue, StackProps } from '@prs/ui-shared';
import { resolveSpace, rawDesignTokens } from '@prs/ui-shared';
import { Box } from './Box';
import type { BoxProps } from './Box';

const SPACING_SCALE = rawDesignTokens.spacing.scale;

export interface NativeStackProps extends Omit<BoxProps, keyof StackProps | 'direction'> {
  direction?: FlexDirection;
  /** Cross-axis alignment. Default "stretch". */
  align?: StackProps['align'];
  /** Main-axis distribution. Default "start". */
  justify?: StackProps['justify'];
  /** Wrap children. Default false. */
  wrap?: boolean;
  /** Gap as raw length (number/string) or named scale step ("2", "4", …). */
  space?: SpaceValue | string;
}

function gapFromSpace(space: NativeStackProps['space']): SpaceValue | undefined {
  if (space === undefined) return undefined;
  return resolveSpace(space, SPACING_SCALE);
}

export const Stack = forwardRef<View, NativeStackProps>(function Stack(props, ref) {
  const { direction = 'column', align, justify, wrap, space, ...rest } = props;
  // `gap` may still be present inside rest (inherited from BoxProps); merge
  // it so an explicit gap always wins over the space shorthand.
  const explicitGap = (rest as { gap?: SpaceValue | readonly [SpaceValue, SpaceValue] }).gap;
  delete (rest as { gap?: unknown }).gap;
  return (
    <Box
      ref={ref}
      flexDirection={direction}
      alignItems={align ?? 'stretch'}
      justifyContent={justify}
      flexWrap={wrap ? 'wrap' : undefined}
      gap={explicitGap ?? gapFromSpace(space)}
      {...rest}
    />
  );
});

/** Horizontal stack (flexDirection: row). */
export const Row = forwardRef<View, Omit<NativeStackProps, 'direction'>>(function Row(props, ref) {
  return <Stack ref={ref} direction="row" {...props} />;
});

/** Vertical stack (flexDirection: column). Alias of Stack's default. */
export const Column = forwardRef<View, Omit<NativeStackProps, 'direction'>>(function Column(
  props,
  ref,
) {
  return <Stack ref={ref} direction="column" {...props} />;
});

/** Convenience alias kept for API parity with common libraries. */
export const VStack = Column;
