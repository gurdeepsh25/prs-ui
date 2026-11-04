/**
 * ResizablePanel — a single panel whose cross-size the user can drag-adjust,
 * with optional collapsibility. Built on native pointer events; sizes are
 * pixels (number) or CSS lengths (string). Keyboard: arrows resize, Enter or
 * Space toggles collapse when `collapsible`.
 */
'use client';

import { forwardRef, useCallback, useRef } from 'react';
import type { CSSProperties, ReactNode, Ref } from 'react';
import { cn } from '@prs/ui-shared';
import { Divider } from './Divider';

export interface ResizablePanelProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Which edge the drag handle sits on. Default "end". */
  handleSide?: 'start' | 'end';
  /** Initial size along the main axis in px (or CSS length). */
  defaultSize?: number | string;
  /** Controlled size in px/CSS length. */
  size?: number | string;
  min?: number;
  max?: number;
  /** Allow collapsing to zero via double-click / keyboard. Default false. */
  collapsible?: boolean;
  /** Called with the new pixel size while resizing. */
  onResize?: (sizePx: number) => void;
  /** Axis of the parent flex container this panel lives in. Default "horizontal". */
  orientation?: 'horizontal' | 'vertical';
  ref?: Ref<HTMLDivElement>;
}

export const ResizablePanel = forwardRef<HTMLDivElement, ResizablePanelProps>(
  function ResizablePanel(props, ref) {
    const {
      children,
      className,
      style,
      handleSide = 'end',
      defaultSize,
      size,
      min = 80,
      max = Number.MAX_SAFE_INTEGER,
      collapsible = false,
      onResize,
      orientation = 'horizontal',
      ...rest
    } = props;

    const nodeRef = useRef<HTMLDivElement | null>(null);
    const dragRef = useRef<{ origin: number; basePx: number } | null>(null);
    const collapsedRef = useRef(false);

    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        nodeRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as { current: HTMLDivElement | null }).current = node;
      },
      [ref],
    );

    const commitPx = useCallback(
      (px: number) => {
        const el = nodeRef.current;
        if (!el) return;
        const dim = orientation === 'horizontal' ? 'width' : 'height';
        el.style[dim] = `${px}px`;
        onResize?.(px);
      },
      [onResize, orientation],
    );

    const onPointerDown = useCallback(
      (event: React.PointerEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
        const el = nodeRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        dragRef.current = {
          origin: orientation === 'horizontal' ? event.clientX : event.clientY,
          basePx: orientation === 'horizontal' ? rect.width : rect.height,
        };
      },
      [orientation],
    );

    const onPointerMove = useCallback(
      (event: React.PointerEvent<HTMLDivElement>) => {
        const drag = dragRef.current;
        if (!drag) return;
        const now = orientation === 'horizontal' ? event.clientX : event.clientY;
        const sign = handleSide === 'end' ? 1 : -1;
        const next = Math.min(max, Math.max(min, drag.basePx + (now - drag.origin) * sign));
        commitPx(next);
      },
      [commitPx, handleSide, max, min, orientation],
    );

    const endDrag = useCallback(() => {
      dragRef.current = null;
    }, []);

    const toggleCollapse = useCallback(() => {
      if (!collapsible) return;
      collapsedRef.current = !collapsedRef.current;
      commitPx(collapsedRef.current ? 0 : typeof defaultSize === 'number' ? defaultSize : min);
    }, [collapsible, commitPx, defaultSize, min]);

    const onKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        const step = event.shiftKey ? 20 : 5;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
          event.preventDefault();
          const el = nodeRef.current;
          if (el) {
            const rect = el.getBoundingClientRect();
            commitPx(Math.min(max, (orientation === 'horizontal' ? rect.width : rect.height) + step));
          }
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
          event.preventDefault();
          const el = nodeRef.current;
          if (el) {
            const rect = el.getBoundingClientRect();
            commitPx(Math.max(min, (orientation === 'horizontal' ? rect.width : rect.height) - step));
          }
        } else if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          toggleCollapse();
        }
      },
      [commitPx, max, min, orientation, toggleCollapse],
    );

    const initialSize =
      size !== undefined ? size : defaultSize !== undefined ? defaultSize : undefined;

    const handle = (
      <div
        role="separator"
        aria-orientation={orientation}
        aria-label="Resize panel"
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDoubleClick={toggleCollapse}
        onKeyDown={onKeyDown}
        className={cn(
          'absolute z-10 touch-none bg-transparent outline-none hover:bg-primary/25 focus-visible:bg-primary/40',
          orientation === 'horizontal' ? 'top-0 h-full w-1.5 cursor-col-resize' : 'left-0 h-1.5 w-full cursor-row-resize',
          handleSide === 'end' ? 'right-0' : 'left-0',
        )}
      />
    );

    return (
      <div
        ref={setRefs}
        className={cn('relative shrink-0 overflow-hidden', className)}
        style={{
          width: orientation === 'horizontal' ? initialSize : undefined,
          height: orientation === 'vertical' ? initialSize : undefined,
          ...style,
        }}
        {...rest}
      >
        {handleSide === 'start' && handle}
        {children}
        {handleSide === 'end' && handle}
      </div>
    );
  },
);

/** Convenience alias matching roadmap naming. Renders a plain separator line. */
export { Divider as PanelSeparator };
