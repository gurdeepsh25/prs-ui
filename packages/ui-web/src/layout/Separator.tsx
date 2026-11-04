/**
 * Separator — non-visual semantic boundary between elements.
 * Unlike Divider (a styled rule), Separator renders an invisible element with
 * role="separator" for assistive technology; use it to delimit groups of
 * controls or content where a visible line is not wanted.
 */
import { forwardRef } from 'react';
import type { HTMLAttributes, Ref } from 'react';
import { cn } from '@prs/ui-shared';
import type { DividerOrientation } from '@prs/ui-shared';

export interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
  /** Orientation reported to assistive tech and used for layout spacing. Default "horizontal". */
  orientation?: DividerOrientation;
  /** Also apply decorative styling so the element occupies space. Default false (zero-size). */
  spacing?: number | string;
}

export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(function Separator(props, ref) {
  const { orientation = 'horizontal', spacing, className, ...rest } = props;
  return (
    <div
      ref={ref as Ref<HTMLDivElement>}
      role="separator"
      aria-orientation={orientation}
      className={cn(
        orientation === 'horizontal' ? 'w-full' : 'h-full inline-block align-middle',
        className,
      )}
      style={
        spacing !== undefined
          ? orientation === 'horizontal'
            ? { height: spacing }
            : { width: spacing }
          : { width: 0, height: 0 }
      }
      {...rest}
    />
  );
});
