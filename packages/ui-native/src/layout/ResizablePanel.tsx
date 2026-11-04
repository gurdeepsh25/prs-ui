/**
 * ResizablePanel — a single panel whose main-axis size the user can drag-
 * adjust, with optional collapsibility. Native counterpart of ui-web's
 * ResizablePanel: sizes are dp numbers (or percentage strings), dragging is
 * handled by PanResponder, and collapse toggles via double-tap on the handle
 * where `collapsible` is enabled. Keyboard resizing is web-only; the native
 * handle exposes accessibilityRole="adjustable" instead.
 */
import { forwardRef, useCallback, useRef, useState } from 'react';
import type { GestureResponderHandlers, ViewStyle } from 'react-native';
import type { View } from 'react-native';
import type { ReactNode } from 'react';
import { clamp } from '@prs/ui-shared';
import { Box } from './Box';

export interface ResizablePanelProps {
  children?: ReactNode;
  style?: ViewStyle | ViewStyle[];
  testID?: string;
  /** Which edge the drag handle sits on. Default "end". */
  handleSide?: 'start' | 'end';
  /** Initial size along the main axis in dp (or % string). */
  defaultSize?: number | string;
  /** Controlled size in dp / % string. */
  size?: number | string;
  min?: number;
  max?: number;
  /** Allow collapsing to zero via double-tap. Default false. */
  collapsible?: boolean;
  /** Called with the new dp size while resizing. */
  onResize?: (sizeDp: number) => void;
  /** Axis of the parent flex container this panel lives in. Default "horizontal". */
  orientation?: 'horizontal' | 'vertical';
}

const HANDLE_DP = 10;

export const ResizablePanel = forwardRef<View, ResizablePanelProps>(function ResizablePanel(props, ref) {
  const {
    children,
    style,
    testID,
    handleSide = 'end',
    defaultSize,
    size,
    min = 80,
    max = Number.MAX_SAFE_INTEGER,
    collapsible = false,
    onResize,
    orientation = 'horizontal',
  } = props;

  const controlled = size !== undefined;
  const [liveSize, setLiveSize] = useState<number | string>(defaultSize ?? '50%');
  const current = controlled ? size : liveSize;

  const containerPxRef = useRef(0);
  const dragRef = useRef<{ originPx: number; basePx: number } | null>(null);
  const lastTapRef = useRef(0);

  const commitPx = useCallback(
    (px: number) => {
      const next = clamp(Math.round(px), min, max);
      if (!controlled) setLiveSize(next);
      onResize?.(next);
    },
    [controlled, min, max, onResize],
  );

  const handlers: GestureResponderHandlers = {
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      const pos = orientation === 'horizontal' ? evt.nativeEvent.pageX : evt.nativeEvent.pageY;
      const basePx = typeof current === 'number' ? current : (containerPxRef.current * parseFloat(current)) / 100;
      dragRef.current = { originPx: pos, basePx };
    },
    onPanResponderMove: (evt) => {
      const drag = dragRef.current;
      if (!drag) return;
      const pos = orientation === 'horizontal' ? evt.nativeEvent.pageX : evt.nativeEvent.pageY;
      commitPx(drag.basePx + (pos - drag.originPx));
    },
    onPanResponderRelease: (evt) => {
      dragRef.current = null;
      if (!collapsible) return;
      // Double-tap detection on the handle toggles collapse (0dp <-> previous).
      const now = Date.now();
      if (now - lastTapRef.current < 300) {
        commitPx(typeof current === 'number' && current === 0 ? min : 0);
      }
      lastTapRef.current = now;
      void evt;
    },
    onPanResponderTerminate: () => {
      dragRef.current = null;
    },
  };

  const isRow = orientation === 'horizontal';
  const dimensionStyle: ViewStyle = isRow ? { width: current as never } : { height: current as never };

  const handle = (
    <Box
      {...handlers}
      accessibilityRole="adjustable"
      accessibilityLabel={collapsible ? 'Resize panel, double tap to collapse' : 'Resize panel'}
      style={{
        flexGrow: 0,
        flexShrink: 0,
        justifyContent: 'center',
        alignItems: 'center',
        ...(isRow ? { width: HANDLE_DP, alignSelf: 'stretch' } : { height: HANDLE_DP, width: '100%' }),
      }}
    >
      <Box
        pointerEvents="none"
        style={{
          backgroundColor: '#94a3b8',
          borderRadius: 2,
          ...(isRow ? { width: 2, height: 28 } : { height: 2, width: 28 }),
        }}
      />
    </Box>
  );

  return (
    <Box
      ref={ref}
      testID={testID}
      onLayout={(event) => {
        const rect = event.nativeEvent.layout;
        containerPxRef.current = isRow ? rect.width : rect.height;
      }}
      style={[{ flexGrow: 0, flexShrink: 0, overflow: 'hidden' }, dimensionStyle, style]}
    >
      {handleSide === 'start' && handle}
      {children}
      {handleSide === 'end' && handle}
    </Box>
  );
});
