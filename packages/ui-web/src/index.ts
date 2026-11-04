/**
 * @prs/ui-web entry point.
 *
 * Web-side shared UI components for React 18/19 and Next.js
 * (App Router with Server Components support, and Pages Router).
 *
 * All modules are client-safe; server components can import this package
 * freely as long as they render interactive primitives inside Client
 * Components. Styling is Tailwind-driven via `prsTailwindPreset` plus the
 * `--prs-*` CSS variables emitted by `prsStylesheet`.
 */

export * from './theme/css-vars';
export { prsTailwindPreset, default as tailwindPreset } from './theme/tailwind-preset';
export { ThemeProvider, useWebTheme, WebThemeContext } from './theme/ThemeProvider';
export type { ThemeProviderProps, WebThemeContextValue } from './theme/ThemeProvider';

/* ---- Phase 1: Foundation & Layout ---- */
export { Box } from './layout/Box';
export type { BoxProps, BoxSurfaceProps } from './layout/Box';
export { Stack, Row, Column, VStack } from './layout/Stack';
export type { WebStackProps } from './layout/Stack';
export { Flex } from './layout/Flex';
export type { FlexProps } from './layout/Flex';
export { Center } from './layout/Center';
export type { CenterProps } from './layout/Center';
export { Container } from './layout/Container';
export type { ContainerProps } from './layout/Container';
export { Grid } from './layout/Grid';
export type { GridPropsWeb } from './layout/Grid';
export { Divider } from './layout/Divider';
export type { DividerProps } from './layout/Divider';
export { Spacer } from './layout/Spacer';
export type { SpacerProps } from './layout/Spacer';
export { AspectRatio } from './layout/AspectRatio';
export type { AspectRatioProps } from './layout/AspectRatio';
export { ScrollArea } from './layout/ScrollArea';
export type { ScrollAreaProps } from './layout/ScrollArea';
export { Splitter, SplitterPane } from './layout/Splitter';
export type { SplitterProps, SplitterPaneProps } from './layout/Splitter';
export { ResizablePanel } from './layout/ResizablePanel';
export type { ResizablePanelProps } from './layout/ResizablePanel';
export { Separator } from './layout/Separator';
export type { SeparatorProps } from './layout/Separator';
export { splitLayoutProps, layoutToCss } from './layout/style';
