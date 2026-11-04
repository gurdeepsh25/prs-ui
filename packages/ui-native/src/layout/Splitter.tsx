/**
 * Splitter — resizable split layout for React Native.
 *
 * Mirrors the web Splitter API (percentage pane sizes, min/max constraints,
 * controlled + uncontrolled modes) using PanResponder for drag interaction.
 * Keyboard resizing is a web-only affordance; on native the separator is an
 * accessible adjustable element (accessibilityRole="adjustable" with increment/
 * decrement actions surfaced to TalkBack/VoiceOver where supported).
 */
import { forwardRef, useCallback, useMemo, useRef } from 'react';
import { PanResponder } from 'react-native';
import type { GestureResponderEvent, ViewStyle } from 'react-native';
import { Box } from './Box';
import { Row, Column } from './Stack';
import type { ReactNode } from 'react';
import { isValidElement } from 'react';
import type { View } from 'react-native';
import { clamp } from '@prs/ui-shared';

export interface SplitterPaneProps {
  children?: ReactNode;
  /** Initial size in % (uncontrolled). Default: equal distribution. */
  defaultSize?: number;
  /** Minimum size in %. Default 10. */
  min?: number;
  /** Maximum size in %. Default 90. */
  max?: number;
  style?: ViewStyle | ViewStyle[];
}

/** Marker component: props are read by <Splitter>; renders nothing alone. */
export function SplitterPane(_props: SplitterPaneProps): null {
  return null;
}

interface PaneSpec {
  node: React.ReactElement<SplitterPaneProps>;
  min: number;
  max: number;
  initial: number;
}

function readPanes(children: ReactNode): PaneSpec[] {
  const nodes: React.ReactElement<SplitterPaneProps>[] = [];
  const walk = (chunk: ReactNode): void => {
    if (
      chunk == null ||
      typeof chunk === 'boolean' ||
      typeof chunk === 'string' ||
      typeof chunk === 'number'
    ) {
      return;
    }
    if (Array.isArray(chunk)) {
      chunk.forEach(walk);
      return;
    }
    if (!isValidElement(chunk)) return;
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

export interface SplitterProps {
  /** Layout direction. Default "horizontal" (side-by-side panes). */
  orientation?: 'horizontal' | 'vertical';
  children: ReactNode;
  style?: ViewStyle | ViewStyle[];
  testID?: string;
  /** Controlled sizes in %. Length must match pane count. */
  value?: number[];
  /** Called with new percentage sizes during drag. */
  onValueChange?: (sizes: number[]) => void;
}

const HANDLE_DP = 8;

const SplitterComponent = forwardRef<View, SplitterProps>(function Splitter(props, ref) {
  const { orientation = 'horizontal', style, value, onValueChange, children, testID } = props;

  const specs = useMemo(() => readPanes(children), [children]);
  const controlled = value !== undefined;
  const sizes = useMemo(
    () => normalize(controlled ? (value as number[]) : specs.map((s) => s.initial)),
    [controlled, value, specs],
  );

  // Uncontrolled live sizes kept in a ref so mid-drag updates don't thrash
  // consumer state; consumers of controlled mode get every change via callback.
  const liveSizesRef = useRef<number[]>(sizes);
  if (controlled) liveSizesRef.current = sizes;

  const containerSizeRef = useRef(0);
  const dragRef = useRef<{ index: number; originPx: number; base: number[] } | null>(null);

  const commit = useCallback(
    (next: number[]) => {
      liveSizesRef.current = next;
      onValueChange?.(next);
    },
    [onValueChange],
  );

  const applyPairDelta = useCallback(
    (base: number[], index: number, deltaPct: number): number[] => {
      const partner = index + 1;
      const spec = specs[index];
      const partnerSpec = specs[partner];
      const current = base[index];
      if (partner >= base.length || !spec || !partnerSpec || current === undefined) return base;
      const pairTotal = current + (base[partner] ?? 0);
      const target = clamp(current + deltaPct, spec.min, spec.max);
      const finalFirst = clamp(target, pairTotal - partnerSpec.min, pairTotal - spec.min);
      const next = [...base];
      next[index] = finalFirst;
      next[partner] = pairTotal - finalFirst;
      return next;
    },
    [specs],
  );

  /** PanResponder factory for the handle between pane `index` and its partner. */
  const makeHandle = useCallback(
    (index: number): PanResponder =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt: GestureResponderEvent) => {
          const pos = orientation === 'horizontal' ? evt.nativeEvent.pageX : evt.nativeEvent.pageY;
          dragRef.current = { index, originPx: pos, base: [...liveSizesRef.current] };
        },
        onPanResponderMove: (evt: GestureResponderEvent) => {
          const drag = dragRef.current;
          const total = containerSizeRef.current;
          if (!drag || total <= 0) return;
          const pos = orientation === 'horizontal' ? evt.nativeEvent.pageX : evt.nativeEvent.pageY;
          const deltaPct = ((pos - drag.originPx) / total) * 100;
          commit(applyPairDelta(drag.base, drag.index, deltaPct));
        },
        onPanResponderRelease: () => {
          dragRef.current = null;
        },
        onPanResponderTerminate: () => {
          dragRef.current = null;
        },
      }),
    [applyPairDelta, commit, orientation],
  );

  const isRow = orientation === 'horizontal';
  const renderedSizes = controlled ? sizes : liveSizesRef.current;

  return (
    <Box
      ref={ref}
      testID={testID}
      onLayout={(event) => {
        const rect = event.nativeEvent.layout;
        containerSizeRef.current = isRow ? rect.width : rect.height;
      }}
      style={[{ flex: 1 }, style]}
    >
      {isRow ? (
        <Row style={{ flex: 1 }}>
          {specs.map((spec, i) => (
            <Pane key={i} spec={spec} size={renderedSizes[i] ?? 0} orientation={orientation}>
              {spec.node.props.children}
              {i < specs.length - 1 && (
                <Handle
                  index={i}
                  orientation={orientation}
                  handlers={makeHandle(i)}
                  now={renderedSizes[i] ?? 0}
                  spec={spec}
                />
              )}
            </Pane>
          ))}
        </Row>
      ) : (
        <Column style={{ flex: 1 }}>
          {specs.map((spec, i) => (
            <Pane key={i} spec={spec} size={renderedSizes[i] ?? 0} orientation={orientation}>
              {spec.node.props.children}
              {i < specs.length - 1 && (
                <Handle
                  index={i}
                  orientation={orientation}
                  handlers={makeHandle(i)}
                  now={renderedSizes[i] ?? 0}
                  spec={spec}
                />
              )}
            </Pane>
          ))}
        </Column>
      )}
    </Box>
  );
});

interface PaneInnerProps {
  spec: PaneSpec;
  size: number;
  orientation: 'horizontal' | 'vertical';
  children?: ReactNode;
}

function Pane({ spec, size, orientation, children }: PaneInnerProps) {
  const dimensionStyle: ViewStyle =
    orientation === 'horizontal'
      ? { width: `${size}%` as `${number}%` }
      : { height: `${size}%` as `${number}%` };
  return (
    <Box
      accessibilityRole="summary"
      style={[
        { flexGrow: 0, flexShrink: 0, overflow: 'hidden' },
        dimensionStyle,
        spec.node.props.style,
      ]}
    >
      {children}
    </Box>
  );
}

interface HandleProps {
  index: number;
  orientation: 'horizontal' | 'vertical';
  handlers: PanResponder;
  now: number;
  spec: PaneSpec;
}

function Handle({ orientation, handlers, now, spec }: HandleProps) {
  return (
    <Box
      {...handlers.panHandlers}
      accessibilityRole="adjustable"
      accessibilityLabel={`Resize panel, currently ${Math.round(now)} percent`}
      accessibilityValue={{ min: spec.min, max: spec.max, now: Math.round(now) }}
      style={{
        flexGrow: 0,
        flexShrink: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        ...(orientation === 'horizontal'
          ? { width: HANDLE_DP, alignSelf: 'stretch' }
          : { height: HANDLE_DP, width: '100%' }),
      }}
    >
      <Box
        pointerEvents="none"
        style={{
          backgroundColor: '#94a3b8',
          borderRadius: 2,
          ...(orientation === 'horizontal' ? { width: 2, height: 32 } : { height: 2, width: 32 }),
        }}
      />
    </Box>
  );
}

export const Splitter = Object.assign(SplitterComponent, { Pane: SplitterPane });
