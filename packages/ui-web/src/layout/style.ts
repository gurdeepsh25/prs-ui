/**
 * Internal style helpers shared by web layout primitives.
 *
 * Translates the platform-agnostic LayoutStyleProps vocabulary from
 * @prs/ui-shared into React.CSSProperties. Numbers are treated as px,
 * strings pass through untouched (rem/%/vw/auto...). Tuple shorthands
 * follow CSS box conventions.
 */
import type { CSSProperties } from 'react';
import type { GapValue, LayoutStyleProps, PaddingValue, SpaceValue } from '@prs/ui-shared';

/** Map design-token spacing values to CSS lengths (numbers = px). */
export function space(value: SpaceValue | undefined): string | number | undefined {
  return value;
}

/** Convert a length-ish value to a CSS width string (numbers = px). */
export function cssSize(value: number | string | undefined): string | undefined {
  if (value === undefined) return undefined;
  return typeof value === 'number' ? `${value}px` : value;
}

function applyBoxShorthand(
  target: Record<string, unknown>,
  prefix: 'padding' | 'margin',
  value: PaddingValue | undefined,
): void {
  if (value === undefined) return;
  if (Array.isArray(value)) {
    const [a, b = a, c = a, d = b] = value as readonly SpaceValue[];
    target[`${prefix}Top`] = a;
    target[`${prefix}Right`] = b;
    target[`${prefix}Bottom`] = c;
    target[`${prefix}Left`] = d;
  } else {
    target[prefix] = value;
  }
}

const JUSTIFY_MAP: Record<string, string> = {
  start: 'flex-start',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
};

const ALIGN_MAP: Record<string, string> = {
  start: 'flex-start',
  end: 'flex-end',
};

function justify(value: string | undefined): string | undefined {
  if (!value) return undefined;
  return JUSTIFY_MAP[value] ?? value;
}

function align(value: string | undefined): string | undefined {
  if (!value) return undefined;
  return ALIGN_MAP[value] ?? value;
}

/** Convert layout props into inline CSS properties. */
export function layoutToCss(props: Partial<LayoutStyleProps>): CSSProperties {
  const out: Record<string, unknown> = {};

  const dim: Array<keyof LayoutStyleProps> = [
    'width',
    'height',
    'minWidth',
    'minHeight',
    'maxWidth',
    'maxHeight',
  ];
  for (const key of dim) {
    const v = props[key];
    if (v !== undefined) out[key] = v;
  }
  if (props.flex !== undefined) {
    out.flex = props.flex === true ? 1 : props.flex === false ? 0 : props.flex;
  }

  applyBoxShorthand(out, 'padding', props.padding);
  applyBoxShorthand(out, 'margin', props.margin);
  if (props.paddingHorizontal !== undefined) {
    out.paddingLeft = props.paddingHorizontal;
    out.paddingRight = props.paddingHorizontal;
  }
  if (props.paddingVertical !== undefined) {
    out.paddingTop = props.paddingVertical;
    out.paddingBottom = props.paddingVertical;
  }
  if (props.marginHorizontal !== undefined) {
    out.marginLeft = props.marginHorizontal;
    out.marginRight = props.marginHorizontal;
  }
  if (props.marginVertical !== undefined) {
    out.marginTop = props.marginVertical;
    out.marginBottom = props.marginVertical;
  }
  if (props.paddingTop !== undefined) out.paddingTop = props.paddingTop;
  if (props.paddingRight !== undefined) out.paddingRight = props.paddingRight;
  if (props.paddingBottom !== undefined) out.paddingBottom = props.paddingBottom;
  if (props.paddingLeft !== undefined) out.paddingLeft = props.paddingLeft;
  if (props.marginTop !== undefined) out.marginTop = props.marginTop;
  if (props.marginRight !== undefined) out.marginRight = props.marginRight;
  if (props.marginBottom !== undefined) out.marginBottom = props.marginBottom;
  if (props.marginLeft !== undefined) out.marginLeft = props.marginLeft;

  const gapOf = (g: GapValue | undefined): [SpaceValue | undefined, SpaceValue | undefined] =>
    Array.isArray(g) ? [(g[0] as SpaceValue) ?? undefined, (g[1] as SpaceValue) ?? undefined] : [g, g];

  if (props.gap !== undefined) {
    const [row, col] = gapOf(props.gap);
    out.rowGap = row;
    out.columnGap = col;
  }
  if (props.rowGap !== undefined) out.rowGap = props.rowGap;
  if (props.columnGap !== undefined) out.columnGap = props.columnGap;

  if (props.display !== undefined) out.display = props.display;
  if (props.flexDirection !== undefined) out.flexDirection = props.flexDirection;
  if (props.flexWrap !== undefined) out.flexWrap = props.flexWrap;
  if (props.flexGrow !== undefined) out.flexGrow = props.flexGrow;
  if (props.flexShrink !== undefined) out.flexShrink = props.flexShrink;
  if (props.basis !== undefined) out.flexBasis = props.basis;
  if (props.alignItems !== undefined) out.alignItems = align(props.alignItems);
  if (props.alignContent !== undefined) out.alignContent = align(props.alignContent);
  if (props.justifyContent !== undefined) out.justifyContent = justify(props.justifyContent);
  if (props.alignSelf !== undefined) out.alignSelf = align(props.alignSelf);
  if (props.position !== undefined) out.position = props.position;
  if (props.overflow !== undefined) out.overflow = props.overflow;
  if (props.order !== undefined) out.order = props.order;
  if (props.textAlign !== undefined) out.textAlign = props.textAlign;
  if (props.aspectRatio !== undefined) out.aspectRatio = props.aspectRatio;

  if (props.top !== undefined) out.top = props.top;
  if (props.right !== undefined) out.right = props.right;
  if (props.bottom !== undefined) out.bottom = props.bottom;
  if (props.left !== undefined) out.left = props.left;

  return out as CSSProperties;
}

/** The full set of prop keys consumed by layoutToCss. */
export const LAYOUT_PROP_KEYS: ReadonlyArray<keyof LayoutStyleProps> = [
  'width',
  'height',
  'minWidth',
  'minHeight',
  'maxWidth',
  'maxHeight',
  'flex',
  'padding',
  'paddingHorizontal',
  'paddingVertical',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'margin',
  'marginHorizontal',
  'marginVertical',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'gap',
  'rowGap',
  'columnGap',
  'display',
  'flexDirection',
  'flexWrap',
  'flexGrow',
  'flexShrink',
  'basis',
  'alignItems',
  'alignContent',
  'justifyContent',
  'alignSelf',
  'position',
  'overflow',
  'order',
  'textAlign',
  'aspectRatio',
  'top',
  'right',
  'bottom',
  'left',
];

const KEY_SET = new Set<string>(LAYOUT_PROP_KEYS);

/** Separate layout props from DOM/pass-through props and merge styles. */
export function splitLayoutProps<P extends Record<string, unknown>>(
  props: P,
): [CSSProperties, Record<string, unknown>] {
  const picked: Record<string, unknown> = {};
  const rest: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(props)) {
    if (KEY_SET.has(key)) picked[key] = value;
    else rest[key] = value;
  }
  const style = layoutToCss(picked as Partial<LayoutStyleProps>);
  const explicit = props.style as CSSProperties | undefined;
  if (explicit) Object.assign(style, explicit);
  return [style, rest];
}
