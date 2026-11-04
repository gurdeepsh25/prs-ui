/**
 * Splitter — accessible resizable split layout (WAI-ARIA "Split Pane" pattern).
 *
 * Panes are declared as `<Splitter.Pane>` children; sizes are percentages of
 * the container's main axis and can be uncontrolled (`defaultSize`) or fully
 * controlled (`value` + `onValueChange` on Splitter, or per-pane `size`).
 * Separators support pointer dragging, keyboard resizing (arrows / PageUp /
 * PageDown / Home / End) and double-click reset to equal distribution.
 * Only refs and synthetic events are used — no browser APIs at module scope —
 * so Server Components can render it and hydration stays deterministic.
 */
import { forwardRef, useCallback, useRef } from 'react';
import type {
  CSSProperties,
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
  ReactNode,
  Ref,
} from 'react';
import { clamp, cn } from '@prs/ui-shared';

/* ------------------------------------------------------------------ Pane */

export interface SplitterPaneProps {
  children?: ReactNode;
  /** Initial size in % (uncontrolled). Default: equal distribution. */
  defaultSize?: number;
  /** Minimum size in %. Default 10. */
  min?: number;
  /** Maximum size in %. Default 90. */
  max?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * Marker component: its props are read by <Splitter>; it renders nothing on
 * its own because the splitter wraps each pane in a measured flex item.
 */
export function SplitterPane(_props: SplitterPaneProps): null {
  return null;
}

/* ------------------------------------------------------------- internals */

interface PaneSpec {
  node: React.ReactElement<SplitterPaneProps>;
  min: number;
  max: number;
  initial: number;
}

function readPanes(children: ReactNode): PaneSpec[] {
  const nodes: React.ReactElement<SplitterPaneProps>[] = [];
  const walk = (chunk: ReactNode): void => {
    if (chunk == null || typeof chunk === 'boolean' || typeof chunk === 'string' || typeof chunk === 'number') {
      return;
    }
    if (Array.isArray(chunk)) {
      chunk.forEach(walk);
      return;
    }
    const el = chunk as React.ReactElement<SplitterPaneProps>;
    if (el.type === SplitterPane) nodes.push(el);
  };
  walk(children);

  const fallback = 100 / Math.max(nodes.length, 1);
  return nodes.map((node) => ({
    node,
    min: node.props.min ?? 10,
    max: node.props.max ?? 90,
    initial: node.props.defaultSize ?? fallback,
  }));
}

function normalize(raw: number[]): number[] {
  const total = raw.reduce((a, b) => a + b, 0) || 100;
  return raw.map((v) => (v / total) * 100);
}

/* -------------------------------------------------------------- Splitter */

export interface SplitterProps {
  /** Layout direction. Default "horizontal" (side-by-side panes). */
  orientation?: 'horizontal' | 'vertical';
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  id?: string;
  /** Controlled sizes in %. Length must match pane count. */
  value?: number[];
  /** Called with new percentage sizes during drag/keyboard resize. */
  onValueChange?: (sizes: number[]) => void;
  ref?: Ref<HTMLDivElement>;
}

const SplitterComponent = forwardRef<HTMLDivElement, SplitterProps>(function Splitter(props, ref) {
  const { orientation = 'horizontal', className, style, value, onValueChange, children, ...rest } = props;

  const specs = readPanes(children);
  const controlled = value !== undefined;
  const sizes = normalize(controlled ? value : specs.map((s) => s.initial));

  const containerRef = useRef<HTMLDivElement | null>(null);
  const liveSizesRef = useRef<number[]>(sizes);
  liveSizesRef.current = sizes;
  const dragRef = useRef<{ index: number; originX: number; originY: number; base: number[] } | null>(
    null,
  );

  const commit = useCallback(
    (next: number[]) => {
      if (!controlled) {
        // Uncontrolled: update flex-basis directly to avoid re-render churn mid-drag.
        const panes = containerRef.current?.querySelectorAll<HTMLElement>('[data-prs-pane]');
        panes?.forEach((pane, i) => {
          const pct = next[i];
          if (pct !== undefined) pane.style.flexBasis = `${pct}%`;
        });
      }
      onValueChange?.(next);
    },
    [controlled, onValueChange],
  );

  /** Move `deltaPct` of space between pane `index` and its right/bottom neighbor. */
  const applyPairDelta = useCallback(
    (base: number[], index: number, deltaPct: number): number[] => {
      const partner = index + 1;
      const spec = specs[index];
      const partnerSpec = specs[partner];
      const current = base[index];
      if (partner >= base.length || !spec || !partnerSpec || current === undefined) return base;
      const pairTotal = current + (base[partner] ?? 0);
      const target = clamp(current + deltaPct, spec.min, spec.max);
      // The partner must keep its own minimum too.
      const finalFirst = clamp(target, pairTotal - partnerSpec.min, pairTotal - spec.min);
      const next = [...base];
      next[index] = finalFirst;
      next[partner] = pairTotal - finalFirst;
      return next;
    },
    [specs],
  );

  const onPointerDown = useCallback(
    (index: number) => (event: ReactPointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      dragRef.current = {
        index,
        originX: event.clientX,
        originY: event.clientY,
        base: [...liveSizesRef.current],
      };
    },
    [],
  );

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      const el = containerRef.current;
      if (!drag || !el) return;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const deltaPct =
        orientation === 'horizontal'
          ? ((event.clientX - drag.originX) / rect.width) * 100
          : ((event.clientY - drag.originY) / rect.height) * 100;
      commit(applyPairDelta(drag.base, drag.index, deltaPct));
    },
    [applyPairDelta, commit, orientation],
  );

  const endDrag = useCallback(() => {
    dragRef.current = null;
  }, []);

  const onKeyDown = useCallback(
    (index: number) => (event: ReactKeyboardEvent<HTMLDivElement>) => {
      let delta: number | null = null;
      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          delta = 2;
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          delta = -2;
          break;
        case 'PageUp':
          delta = 10;
          break;
        case 'PageDown':
          delta = -10;
          break;
        case 'Home':
          delta = -100;
          break;
        case 'End':
          delta = 100;
          break;
        default:
          return;
      }
      event.preventDefault();
      commit(applyPairDelta(liveSizesRef.current, index, delta));
    },
    [applyPairDelta, commit],
  );

  const mergedRef = useCallback(
    (node: HTMLDivElement | null) => {
      containerRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as { current: HTMLDivElement | null }).current = node;
    },
    [ref],
  );

  return (
    <div
      ref={mergedRef}
      role="group"
      aria-orientation={orientation}
      className={cn('flex h-full w-full', orientation === 'horizontal' ? 'flex-row' : 'flex-col', className)}
      style={style}
      {...rest}
    >
      {specs.map((spec, i) => (
        <div
          key={i}
          data-prs-pane=""
          className={cn('relative min-h-0 min-w-0 overflow-hidden', spec.node.props.className)}
          style={{ flexGrow: 0, flexShrink: 0, flexBasis: `${sizes[i]}%`, ...spec.node.props.style }}
        >
          {spec.node.props.children}
          {i < specs.length - 1 && (
            <div
              role="separator"
              aria-orientation={orientation}
              aria-label={`Resize between panel ${i + 1} and panel ${i + 2}`}
              aria-valuenow={Math.round(sizes[i] ?? 0)}
              aria-valuemin={spec.min}
              aria-valuemax={spec.max}
              tabIndex={0}
              onPointerDown={onPointerDown(i)}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onDoubleClick={() => commit(specs.map(() => 100 / specs.length))}
              onKeyDown={onKeyDown(i)}
              className={cn(
                'absolute z-10 touch-none bg-transparent outline-none hover:bg-primary/25 focus-visible:bg-primary/40',
                orientation === 'horizontal'
                  ? 'top-0 right-0 h-full w-1.5 cursor-col-resize'
                  : 'bottom-0 left-0 h-1.5 w-full cursor-row-resize',
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
});

export const Splitter = Object.assign(SplitterComponent, { Pane: SplitterPane });
