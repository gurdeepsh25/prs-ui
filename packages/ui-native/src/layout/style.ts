/**
 * Internal style helpers shared by native layout primitives.
 *
 * Translates the platform-agnostic LayoutStyleProps vocabulary from
 * @prs/ui-shared into React Native `ViewStyle` objects. Numbers are treated
 * as density-independent pixels (dp); strings pass through untouched so
 * percentage layouts ("50%") work exactly like on web. Tuple shorthands
 * follow the RN box conventions (paddingHorizontal/Vertical, etc.).
 *
 * This module only imports from 'react-native' — never from react-dom or
 * any browser API — keeping the native package platform-pure.
 */
import type { ViewStyle, StyleProp } from 'react-native';
import type { LayoutStyleProps, SpaceValue } from '@prs/ui-shared';

type RnLength = number | `${number}%` | 'auto';

/** RN style lengths accept numbers, percentage strings or "auto"; anything
 *  else (rem/px/em CSS units) is meaningless on native and dropped. */
function len(value: SpaceValue | undefined): RnLength | undefined {
  if (value === undefined) return undefined;
  if (typeof value === 'number') return value;
  if (value.endsWith('%') || value === 'auto') return value as RnLength;
  const pxMatch = /^(-?\d+(?:\.\d+)?)px$/.exec(value);
  if (pxMatch && pxMatch[1] !== undefined) return Number.parseFloat(pxMatch[1]);
  return undefined;
}

/** Percentage of a track template? e.g. "repeat(3, 1fr)" → 3 equal tracks. */
function parseTrackCount(template: string): number | null {
  const match = /repeat\((\d+),/.exec(template);
  if (match && match[1] !== undefined) return Number.parseInt(match[1], 10);
  const parts = template.trim().split(/\s+/);
  return parts.length > 0 && parts.every((p) => p.endsWith('fr')) ? parts.length : null;
}

const JUSTIFY_MAP: Record<string, ViewStyle['justifyContent']> = {
  start: 'flex-start',
  end: 'flex-end',
  center: 'center',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
};

const ALIGN_MAP: Record<string, ViewStyle['alignItems']> = {
  start: 'flex-start',
  end: 'flex-end',
  center: 'center',
  stretch: 'stretch',
  baseline: 'baseline',
};

export interface NativeLayoutResult {
  style: ViewStyle;
  /** Inset edges that must be applied via absolute positioning. */
  positioned: boolean;
}

/** Convert layout props into an RN ViewStyle object. */
export function layoutToStyle(props: Partial<LayoutStyleProps>): ViewStyle {
  const style: ViewStyle & Record<string, unknown> = {};

  if (props.width !== undefined) style.width = len(props.width);
  if (props.height !== undefined) style.height = len(props.height);
  if (props.minWidth !== undefined) style.minWidth = len(props.minWidth);
  if (props.minHeight !== undefined) style.minHeight = len(props.minHeight);
  if (props.maxWidth !== undefined) style.maxWidth = len(props.maxWidth);
  if (props.maxHeight !== undefined) style.maxHeight = len(props.maxHeight);

  // flex: RN semantics differ subtly from CSS; numbers map 1:1, true → 1,
  // false → 0, string shorthand ("1 1 auto") is ignored with flexGrow kept.
  if (props.flex !== undefined) {
    style.flex = props.flex === true ? 1 : props.flex === false ? 0 : typeof props.flex === 'number' ? props.flex : 1;
  }

  applyPadding(style, props);
  applyMargin(style, props);

  if (props.gap !== undefined) {
    if (Array.isArray(props.gap)) {
      const [rowGap, colGap] = props.gap as readonly [SpaceValue, SpaceValue];
      style.rowGap = rowGap as number;
      style.columnGap = colGap as number;
    } else {
      style.gap = props.gap as number;
    }
  }
  if (props.rowGap !== undefined) style.rowGap = props.rowGap as number;
  if (props.columnGap !== undefined) style.columnGap = props.columnGap as number;

  if (props.display === 'none') style.display = 'none';
  if (props.flexDirection !== undefined) style.flexDirection = props.flexDirection;
  if (props.flexWrap !== undefined) style.flexWrap = props.flexWrap;
  if (props.flexGrow !== undefined) style.flexGrow = props.flexGrow;
  if (props.flexShrink !== undefined) style.flexShrink = props.flexShrink;
  if (props.basis !== undefined) style.flexBasis = len(props.basis);
  if (props.alignItems !== undefined) style.alignItems = ALIGN_MAP[props.alignItems] ?? 'stretch';
  if (props.justifyContent !== undefined) {
    style.justifyContent = JUSTIFY_MAP[props.justifyContent] ?? 'flex-start';
  }
  if (props.alignSelf !== undefined && props.alignSelf !== 'auto') {
    style.alignSelf = (ALIGN_MAP[props.alignSelf] ?? 'auto') as ViewStyle['alignSelf'];
  }
  if (props.position !== undefined) {
    style.position = props.position === 'static' ? 'relative' : (props.position as 'absolute' | 'relative');
  }
  if (props.overflow !== undefined) {
    style.overflow = props.overflow === 'visible' ? 'visible' : 'hidden';
  }
  if (props.order !== undefined) style.order = props.order;
  if (props.aspectRatio !== undefined) {
    style.aspectRatio = typeof props.aspectRatio === 'number' ? props.aspectRatio : Number.parseFloat(props.aspectRatio);
  }

  for (const edge of ['top', 'right', 'bottom', 'left'] as const) {
    const v = props[edge];
    if (v !== undefined) style[edge] = len(v);
  }

  return style;
}

function applyPadding(style: ViewStyle & Record<string, unknown>, props: Partial<LayoutStyleProps>): void {
  const p = props.padding;
  if (typeof p === 'number' || typeof p === 'string') {
    style.padding = len(p);
  } else if (Array.isArray(p)) {
    const [a, b = a] = p as readonly SpaceValue[];
    if (p.length === 2) {
      style.paddingVertical = len(a);
      style.paddingHorizontal = len(b);
    } else {
      const [t, r, bt = t, l = r] = p as readonly SpaceValue[];
      style.paddingTop = len(t);
      style.paddingRight = len(r);
      style.paddingBottom = len(bt);
      style.paddingLeft = len(l);
    }
  }
  if (props.paddingHorizontal !== undefined) style.paddingHorizontal = len(props.paddingHorizontal);
  if (props.paddingVertical !== undefined) style.paddingVertical = len(props.paddingVertical);
  if (props.paddingTop !== undefined) style.paddingTop = len(props.paddingTop);
  if (props.paddingRight !== undefined) style.paddingRight = len(props.paddingRight);
  if (props.paddingBottom !== undefined) style.paddingBottom = len(props.paddingBottom);
  if (props.paddingLeft !== undefined) style.paddingLeft = len(props.paddingLeft);
}

function applyMargin(style: ViewStyle & Record<string, unknown>, props: Partial<LayoutStyleProps>): void {
  const m = props.margin;
  if (typeof m === 'number' || typeof m === 'string') {
    style.margin = len(m);
  } else if (Array.isArray(m)) {
    const [a, b = a] = m as readonly SpaceValue[];
    if (m.length === 2) {
      style.marginVertical = len(a);
      style.marginHorizontal = len(b);
    } else {
      const [t, r, bt = t, l = r] = m as readonly SpaceValue[];
      style.marginTop = len(t);
      style.marginRight = len(r);
      style.marginBottom = len(bt);
      style.marginLeft = len(l);
    }
  }
  if (props.marginHorizontal !== undefined) style.marginHorizontal = len(props.marginHorizontal);
  if (props.marginVertical !== undefined) style.marginVertical = len(props.marginVertical);
  if (props.marginTop !== undefined) style.marginTop = len(props.marginTop);
  if (props.marginRight !== undefined) style.marginRight = len(props.marginRight);
  if (props.marginBottom !== undefined) style.marginBottom = len(props.marginBottom);
  if (props.marginLeft !== undefined) style.marginLeft = len(props.marginLeft);
}

/** Flatten consumer-provided styles after our computed style. */
export function mergeStyle(base: ViewStyle, ...overrides: Array<StyleProp<ViewStyle>>): StyleProp<ViewStyle> {
  return overrides.length === 0 ? base : [base, ...overrides];
}

export { parseTrackCount };
