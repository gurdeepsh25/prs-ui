/**
 * Grid — CSS grid container built on Box.
 * `columns` accepts a count (repeat(n, minmax(0,1fr))) or any raw
 * grid-template-columns value. Gap follows the same rules as Stack.space.
 */
import { forwardRef } from 'react';
import type { CSSProperties, ElementType, Ref } from 'react';
import type { SpaceValue } from '@prs/ui-shared';
import { resolveSpace } from '@prs/ui-shared';
import { rawDesignTokens } from '@prs/ui-shared';
import { Box } from './Box';
import type { BoxProps } from './Box';

const SPACING_SCALE = rawDesignTokens.spacing.scale;

export type GridPropsWeb<P extends ElementType = 'div'> = Omit<
  BoxProps<P>,
  'display' | 'gap' | 'aspectRatio'
> & {
  /** Column count or raw grid-template-columns value. Default 12. */
  columns?: number | string;
  /** Row count or raw grid-template-rows value. */
  rows?: number | string;
  /** Auto-placement for unstyled children. */
  autoFlow?: 'row' | 'column' | 'row dense' | 'column dense';
  /** Gap as raw length or named spacing-scale step. */
  space?: SpaceValue | string;
  /** Raw gap passthrough (CSS semantics) when you need per-axis control. */
  gap?: SpaceValue | readonly [SpaceValue, SpaceValue];
};

function template(value: number | string | undefined): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value === 'number') return `repeat(${value}, minmax(0, 1fr))`;
  return value;
}

export const Grid = forwardRef<HTMLElement, GridPropsWeb>(function Grid(props, ref) {
  const { columns, rows, autoFlow, space, gap, style, ...rest } = props;
  const resolvedGap = gap ?? (space !== undefined ? resolveSpace(space, SPACING_SCALE) : undefined);
  const gridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: template(columns),
    gridTemplateRows: template(rows),
    gridAutoFlow: autoFlow,
    gap: resolvedGap,
    ...style,
  };
  return <Box ref={ref as Ref<HTMLElement>} style={gridStyle} {...rest} />;
});
