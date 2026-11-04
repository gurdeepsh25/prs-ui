/**
 * Platform-agnostic layout prop vocabulary for Box/Flex/Stack/Grid family.
 * Keys mirror CSS property names; the web package maps them 1:1 to inline
 * styles, while the native package translates them to React Native style
 * objects. Values use design-token-friendly unions so consumers get strict
 * autocompletion without losing escape hatches (raw px / percentage strings).
 */

import type { Alignment, Justify } from './types';

export type { Alignment, Justify };

/**
 * Spacing accepts numeric steps of the shared scale (unitless multiples are
 * not assumed — numbers mean px on web and dp on native) or any CSS length
 * string such as "1rem", "50%", "auto".
 */
export type SpaceValue = number | string;

export type PaddingValue =
  | SpaceValue
  | readonly [SpaceValue, SpaceValue]
  | readonly [SpaceValue, SpaceValue, SpaceValue, SpaceValue];
export type GapValue = SpaceValue | readonly [SpaceValue, SpaceValue];

export type FlexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse';
export type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse';
export type AlignItems = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type JustifyContent = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
export type DisplayValue =
  'block' | 'inline-block' | 'inline' | 'flex' | 'inline-flex' | 'grid' | 'contents';
export type PositionValue = 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
export type OverflowValue = 'visible' | 'hidden' | 'clip' | 'scroll' | 'auto';
export type TextAlignmentValue = 'left' | 'center' | 'right' | 'justify' | 'start' | 'end';

/** Edge inset shorthand: single value applies to all four edges. */
export type InsetValue = number | string;
export type InsetProps = {
  top?: InsetValue;
  right?: InsetValue;
  bottom?: InsetValue;
  left?: InsetValue;
};

/** Common sizing props shared by every layout primitive on both platforms. */
export interface DimensionProps {
  width?: number | string;
  height?: number | string;
  minWidth?: number | string;
  minHeight?: number | string;
  maxWidth?: number | string;
  maxHeight?: number | string;
  flex?: number | string | boolean;
}

/** Spacing props (padding/margin/gap) expressed via design tokens. */
export interface SpaceProps {
  padding?: PaddingValue;
  paddingHorizontal?: PaddingValue;
  paddingVertical?: PaddingValue;
  paddingTop?: SpaceValue;
  paddingRight?: SpaceValue;
  paddingBottom?: SpaceValue;
  paddingLeft?: SpaceValue;
  margin?: PaddingValue;
  marginHorizontal?: PaddingValue;
  marginVertical?: PaddingValue;
  marginTop?: SpaceValue;
  marginRight?: SpaceValue;
  marginBottom?: SpaceValue;
  marginLeft?: SpaceValue;
  gap?: GapValue;
  rowGap?: SpaceValue;
  columnGap?: SpaceValue;
}

/** Purely presentational layout props understood by both platforms. */
export interface LayoutStyleProps extends DimensionProps, SpaceProps, InsetProps {
  display?: DisplayValue;
  flexDirection?: FlexDirection;
  flexWrap?: FlexWrap;
  flexGrow?: number;
  flexShrink?: number;
  basis?: number | string;
  alignItems?: AlignItems;
  alignContent?: AlignItems | 'between' | 'around';
  justifyContent?: JustifyContent;
  alignSelf?: 'start' | 'center' | 'end' | 'stretch' | 'baseline' | 'auto';
  position?: PositionValue;
  overflow?: OverflowValue;
  order?: number;
  textAlign?: TextAlignmentValue;
  aspectRatio?: number | string;
}

/** Grid-specific subset (web uses CSS grid; native emulates with flex rows). */
export interface GridProps {
  columns?: number | string;
  rows?: number | string;
}

/** Stack family props: direction + spacing shorthands used by Stack/Row/Column/VStack. */
export interface StackProps extends LayoutStyleProps {
  /** Flex direction. Row/Column presets override this. */
  direction?: FlexDirection;
  /** Cross-axis alignment. Default "stretch". */
  align?: AlignItems;
  /** Main-axis distribution. Default "start". */
  justify?: JustifyContent;
  /** Whether children wrap. Default false. */
  wrap?: boolean;
  /** Convenience gap accepting a raw length or a named spacing-scale step ("4"). */
  space?: SpaceValue | string;
}

/** Container size tokens matching SizeTokens["container"]. */
export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl';

/** Divider orientation vocabulary shared by web and native. */
export type DividerOrientation = 'horizontal' | 'vertical';

/** The named spacing scale (keys of SpacingTokens["scale"]). */
export type SpacingScale = Record<string, number>;

/** Resolve a `space` shorthand: numeric strings ("4") map onto the design
 *  token scale; anything else is treated as a raw length. */
export function resolveSpace(value: SpaceValue | string, scale: SpacingScale): SpaceValue {
  if (typeof value === 'number') return value;
  const hit = scale[value];
  return hit !== undefined ? hit : value;
}

/** Map legacy shared `Alignment`/`Justify` vocabularies to CSS-level values. */
export function normalizeAlignment(value: Alignment | AlignItems): AlignItems {
  switch (value) {
    case 'between':
      return 'stretch';
    default:
      return value as AlignItems;
  }
}

export function normalizeJustify(value: Justify | JustifyContent): JustifyContent {
  return value as JustifyContent;
}
