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
export type DisplayValue = 'block' | 'inline-block' | 'inline' | 'flex' | 'inline-flex' | 'grid' | 'contents';
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
