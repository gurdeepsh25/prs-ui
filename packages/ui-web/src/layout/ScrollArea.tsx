/**
 * ScrollArea — a styled scrollable region with keyboard access.
 *
 * Uses native overflow scrolling (best performance, inertial scrolling on
 * touch devices) rather than custom scrollbar widgets; the wrapper is given
 * tabIndex 0 + role=region so keyboard users can focus and arrow-scroll it.
 * Optional `maxHeight`/`height` constrain the viewport; `orientation` picks
 * the scroll axis. Server-renderable: no hooks or effects.
 */
import { forwardRef } from 'react';
import type { HTMLAttributes, Ref } from 'react';
import { cn } from '@prs/ui-shared';
import type { SpaceValue } from '@prs/ui-shared';

export interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
  /** Constrained height (number = px). Omit to size to content up to maxHeight. */
  height?: SpaceValue;
  /** Maximum height before scrolling kicks in (number = px). */
  maxHeight?: SpaceValue;
  /** Which axes can scroll. Default "vertical". */
  orientation?: 'vertical' | 'horizontal' | 'both';
  /** Accessible name for the scrollable region (required for good a11y). */
  ariaLabel?: string;
  /** Hide native scrollbars visually while keeping scroll behavior. Default false. */
  hideScrollbars?: boolean;
}

function px(v: SpaceValue | undefined): string | number | undefined {
  return v;
}

export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(
  function ScrollArea(props, ref) {
    const {
      height,
      maxHeight,
      orientation = 'vertical',
      ariaLabel,
      hideScrollbars = false,
      className,
      style,
      children,
      ...rest
    } = props;

    const overflowY = orientation === 'horizontal' ? 'hidden' : 'auto';
    const overflowX = orientation === 'vertical' ? 'hidden' : 'auto';

    return (
      <div
        ref={ref as Ref<HTMLDivElement>}
        role="region"
        aria-label={ariaLabel}
        tabIndex={0}
        className={cn(
          'prs-scroll-area relative',
          hideScrollbars && '[scrollbar-width:none]',
          className,
        )}
        style={{ overflowX, overflowY, height: px(height), maxHeight: px(maxHeight), ...style }}
        {...rest}
      >
        {children}
      </div>
    );
  },
);
