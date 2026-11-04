/**
 * Phase 1 — Foundation & Layout primitives (native).
 *
 * Public API mirrors @prs/ui-web's layout exports so cross-platform code
 * reads identically. Internals: style.ts translates the shared
 * LayoutStyleProps vocabulary to RN ViewStyle; surface.ts maps design tokens
 * (tone/radius/border/shadow) to theme-driven styles.
 */
export { Box } from './Box';
export type { BoxProps, BoxSurfaceProps } from './Box';
export { Stack, Row, Column, VStack } from './Stack';
export type { NativeStackProps } from './Stack';
export { Flex } from './Flex';
export type { FlexProps } from './Flex';
export { Center } from './Center';
export type { CenterProps } from './Center';
export { Container } from './Container';
export type { ContainerProps } from './Container';
export { Grid } from './Grid';
export type { GridPropsNative } from './Grid';
export { Divider } from './Divider';
export type { DividerProps } from './Divider';
export { Spacer } from './Spacer';
export type { SpacerProps } from './Spacer';
export { AspectRatio } from './AspectRatio';
export type { AspectRatioProps } from './AspectRatio';
export { ScrollArea } from './ScrollArea';
export type { ScrollAreaProps } from './ScrollArea';
export { Splitter, SplitterPane } from './Splitter';
export type { SplitterProps, SplitterPaneProps } from './Splitter';
export { ResizablePanel } from './ResizablePanel';
export type { ResizablePanelProps } from './ResizablePanel';
export { Separator } from './Separator';
export type { SeparatorProps } from './Separator';
export { layoutToStyle, mergeStyle } from './style';
export { surfaceStyle } from './surface';
export type { RadiusTokenName, ShadowTokenName, SurfaceTone } from './surface';
