/**
 * Divider — thematic break between content sections.
 * Renders a native <hr> for horizontal orientation and a styled span with
 * role="separator" for vertical use inside flex rows (WAI-ARIA authoring
 * practice: decorative separators are exposed via role, not hidden).
 */
import { forwardRef } from 'react';
import type { HTMLAttributes, Ref } from 'react';
import type { DividerOrientation } from '@prs/ui-shared';
import { cn } from '@prs/ui-shared';

export interface DividerProps extends Omit<HTMLAttributes<HTMLElement>, 'color'> {
  /** Layout direction of the rule. Default "horizontal". */
  orientation?: DividerOrientation;
  /** Visual thickness in px. Default 1. */
  thickness?: number;
  /** Override stroke color with any CSS color/var expression. */
  color?: string;
  /** Dashed border style instead of solid. Default false. */
  dashed?: boolean;
}

export const Divider = forwardRef<HTMLElement, DividerProps>(function Divider(props, ref) {
  const {
    orientation = 'horizontal',
    thickness = 1,
    color,
    dashed = false,
    className,
    style,
    ...rest
  } = props;
  const lineStyle = {
    borderColor: color ?? 'var(--prs-border)',
    borderWidth: thickness,
    borderStyle: dashed ? ('dashed' as const) : ('solid' as const),
    ...style,
  };

  if (orientation === 'vertical') {
    return (
      <span
        ref={ref as Ref<HTMLSpanElement>}
        role="separator"
        aria-orientation="vertical"
        className={cn('inline-block self-stretch h-auto border-l', className)}
        style={{ ...lineStyle, width: thickness, height: 'auto' }}
        {...(rest as HTMLAttributes<HTMLSpanElement>)}
      />
    );
  }

  return (
    <hr
      ref={ref as Ref<HTMLHRElement>}
      aria-orientation="horizontal"
      className={cn('border-0 border-t w-full', className)}
      style={lineStyle}
      {...(rest as HTMLAttributes<HTMLHRElement>)}
    />
  );
});
