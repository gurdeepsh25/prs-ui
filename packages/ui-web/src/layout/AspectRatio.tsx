/**
 * AspectRatio — constrains its child to a fixed width/height ratio using the
 * modern CSS `aspect-ratio` property with a padding-top fallback-free markup
 * (single wrapper, one child). The child fills the box absolutely.
 */
import { forwardRef, isValidElement, cloneElement } from 'react';
import type { ReactNode, Ref } from 'react';
import { cn } from '@prs/ui-shared';

export interface AspectRatioProps {
  /** Width ÷ height ratio, e.g. 16 / 9. Default 1. */
  ratio?: number;
  children: ReactNode;
  className?: string;
  id?: string;
  ref?: Ref<HTMLDivElement>;
}

export const AspectRatio = forwardRef<HTMLDivElement, AspectRatioProps>(
  function AspectRatio(props, ref) {
    const { ratio = 1, children, className, ...rest } = props;
    const child = isValidElement(children)
      ? cloneElement(
          children as React.ReactElement<{ className?: string; style?: React.CSSProperties }>,
          {
            className: cn(
              'absolute inset-0 h-full w-full',
              (children.props as { className?: string }).className,
            ),
            style: {
              objectFit: 'cover',
              ...(children.props as { style?: React.CSSProperties }).style,
            },
          },
        )
      : children;

    return (
      <div
        ref={ref}
        className={cn('relative w-full', className)}
        style={{ aspectRatio: String(ratio) }}
        {...rest}
      >
        {child}
      </div>
    );
  },
);
