/**
 * Box — the foundational web layout primitive.
 *
 * Renders a semantic HTML element (div by default) styled through the shared
 * LayoutStyleProps vocabulary (numbers = px, strings = CSS lengths) plus
 * design-token surface props (tone / radius / border / shadow). Everything
 * else is forwarded to the underlying DOM element, so className, id, data-*
 * and ARIA attributes work as expected. Fully server-renderable: no hooks,
 * no browser APIs — compatible with Next.js App Router Server Components
 * and Pages Router alike.
 */
import { createElement, forwardRef } from 'react';
import type { ElementType, HTMLAttributes, ReactNode, Ref } from 'react';
import { cn } from '@prs/ui-shared';
import type { LayoutStyleProps } from '@prs/ui-shared';
import { splitLayoutProps } from './style';
import { radiusClass, shadowClass, toneBackground, toneForeground } from './surface';
import type { RadiusTokenName, ShadowTokenName, SurfaceTone } from './surface';

export interface BoxSurfaceProps {
  /** Semantic background tone from the design system. Default "auto" (transparent). */
  tone?: SurfaceTone;
  /** Also apply the matching foreground text color for `tone`. Default false. */
  colored?: boolean;
  /** Border radius token name. */
  radius?: RadiusTokenName;
  /** Apply a hairline border using --prs-border. */
  bordered?: boolean;
  /** Elevation shadow token. */
  shadow?: ShadowTokenName;
}

export type BoxProps<P extends ElementType = 'div'> = Omit<HTMLAttributes<HTMLElement>, keyof LayoutStyleProps> &
  LayoutStyleProps &
  BoxSurfaceProps & {
    /** Rendered element/tag. Default "div". */
    as?: P;
    children?: ReactNode;
    ref?: Ref<HTMLElement>;
  };

export const Box = forwardRef<HTMLElement, BoxProps>(function Box(props, ref) {
  const {
    as: Component = 'div' as ElementType,
    tone = 'auto',
    colored = false,
    radius,
    bordered = false,
    shadow,
    className,
    children,
    ...rest
  } = props;

  const [style, domProps] = splitLayoutProps(rest as Record<string, unknown>);

  return createElement(Component, {
    ...(domProps as HTMLAttributes<HTMLElement>),
    ref: ref as Ref<never>,
    className: cn(
      toneBackground(tone),
      colored && tone !== 'auto' ? toneForeground(tone) : '',
      radiusClass(radius),
      bordered && 'border border-border',
      shadowClass(shadow),
      className,
    ),
    style,
    children,
  });
});
