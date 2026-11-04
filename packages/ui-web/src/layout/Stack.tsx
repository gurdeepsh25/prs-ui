/**
 * Stack family — flex containers built on Box.
 *
 * `Stack` is the general primitive (direction/align/justify/space props);
 * `Row`, `Column` and `VStack` are ergonomic presets. `space` accepts a raw
 * length or a named spacing-scale step ("4" → 16px via design tokens).
 * Pure presentational wrappers: server-renderable, no hooks.
 */
import { forwardRef } from 'react';
import type { ElementType, Ref } from 'react';
import type { FlexDirection, SpaceValue, StackProps } from '@prs/ui-shared';
import { resolveSpace } from '@prs/ui-shared';
import { rawDesignTokens } from '@prs/ui-shared';
import { Box } from './Box';
import type { BoxProps } from './Box';

const SPACING_SCALE = rawDesignTokens.spacing.scale;

export interface WebStackProps<P extends ElementType = 'div'>
  extends Omit<BoxProps<P>, keyof StackProps | 'direction'> {
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

function gapFromSpace(space: WebStackProps['space']): SpaceValue | undefined {
  if (space === undefined) return undefined;
  return resolveSpace(space, SPACING_SCALE);
}

export const Stack = forwardRef<HTMLElement, WebStackProps>(function Stack(props, ref) {
  const { direction = 'column', align, justify, wrap, space, ...rest } = props;
  // `gap` may still be present inside rest (inherited from BoxProps); merge it
  // so an explicit gap always wins over the space shorthand.
  const explicitGap = (rest as { gap?: SpaceValue | readonly [SpaceValue, SpaceValue] }).gap;
  delete (rest as { gap?: unknown }).gap;
  return (
    <Box
      ref={ref as Ref<HTMLElement>}
      display="flex"
      flexDirection={direction}
      alignItems={align ?? 'stretch'}
      justifyContent={justify}
      flexWrap={wrap ? 'wrap' : undefined}
      gap={explicitGap ?? gapFromSpace(space)}
      {...rest}
    />
  );
});

/** Horizontal stack (flex-direction: row). */
export const Row = forwardRef<HTMLElement, Omit<WebStackProps, 'direction'>>(function Row(props, ref) {
  return <Stack ref={ref} direction="row" {...props} />;
});

/** Vertical stack (flex-direction: column). Alias of Stack's default. */
export const Column = forwardRef<HTMLElement, Omit<WebStackProps, 'direction'>>(function Column(
  props,
  ref,
) {
  return <Stack ref={ref} direction="column" {...props} />;
});

/** Deprecated-friendly alias kept for API parity with common libraries. */
export const VStack = Column;
