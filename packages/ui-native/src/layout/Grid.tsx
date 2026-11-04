/**
 * Grid — flex-wrapped grid emulation for React Native.
 *
 * RN has no CSS grid; this mirrors the web Grid API by computing an equal
 * track count from `columns` (number, or parsed from "repeat(n, …)" /
 * "1fr 1fr …") and giving each direct child a percentage basis minus the
 * inter-column gap. Children are wrapped individually so consumers keep the
 * same declarative markup as on web.
 */
import { forwardRef, isValidElement } from 'react';
import { View } from 'react-native';
import type { ViewStyle } from 'react-native';
import type { ReactNode } from 'react';
import type { SpaceValue } from '@prs/ui-shared';
import { resolveSpace, rawDesignTokens } from '@prs/ui-shared';
import { Box } from './Box';
import type { BoxProps } from './Box';
import { parseTrackCount } from './style';

const SPACING_SCALE = rawDesignTokens.spacing.scale;

export type GridPropsNative = Omit<BoxProps, 'gap' | 'aspectRatio'> & {
  /** Column count or raw template string ("repeat(3, 1fr)", "1fr 1fr"). Default 12. */
  columns?: number | string;
  /** Row count (accepted for API parity; rows flow naturally on native). */
  rows?: number | string;
  /** Auto-placement mode (accepted for API parity; native always flows row-wise). */
  autoFlow?: 'row' | 'column' | 'dense' | 'row dense' | 'column dense';
  /** Gap as raw dp value or named spacing-scale step. */
  space?: SpaceValue | string;
  /** Raw gap passthrough; wins over `space`. */
  gap?: SpaceValue;
};

function trackCount(columns: number | string | undefined): number {
  if (columns === undefined) return 12;
  if (typeof columns === 'number') return Math.max(1, Math.floor(columns));
  const parsed = parseTrackCount(columns);
  return parsed && parsed > 0 ? parsed : 12;
}

export const Grid = forwardRef<View, GridPropsNative>(function Grid(props, ref) {
  const { columns, rows: _rows, autoFlow: _autoFlow, space, gap, children, style, ...rest } = props;
  const resolvedGap =
    gap ?? (space !== undefined ? (resolveSpace(space, SPACING_SCALE) as number) : undefined);
  const gapDp = typeof resolvedGap === 'number' ? resolvedGap : 0;
  const count = trackCount(columns);

  // Wrap each element child in a track-sized cell.
  let index = 0;
  const cells: ReactNode[] = [];
  const place = (chunk: ReactNode): void => {
    if (chunk == null || typeof chunk === 'boolean') return;
    if (Array.isArray(chunk)) {
      chunk.forEach(place);
      return;
    }
    if (!isValidElement(chunk)) return;
    const i = index++;
    const cellStyle: ViewStyle = { flexGrow: 0, flexShrink: 0 };
    if (count > 0) {
      // Subtract proportional gap share so n columns + (n-1) gaps fit exactly.
      cellStyle.width = `${100 / count}%` as `${number}%`;
      cellStyle.paddingRight = gapDp > 0 ? gapDp / 2 : 0;
      cellStyle.paddingLeft = gapDp > 0 ? gapDp / 2 : 0;
      cellStyle.marginTop = gapDp > 0 && i >= count ? gapDp : 0;
    }
    cells.push(
      <View key={`prs-grid-cell-${i}`} style={cellStyle}>
        {chunk}
      </View>,
    );
  };
  place(children);

  return (
    <Box
      ref={ref}
      display="flex"
      flexDirection="row"
      flexWrap="wrap"
      marginHorizontal={gapDp > 0 ? -(gapDp / 2) : undefined}
      style={style}
      {...rest}
    >
      {cells}
    </Box>
  );
});
