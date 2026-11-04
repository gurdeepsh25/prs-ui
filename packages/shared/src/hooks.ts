/**
 * Shared, platform-agnostic React hooks used by both `@prs/ui-web` and
 * `@prs/ui-native`. Only uses APIs available on both React DOM and React
 * Native (no window/document access).
 *
 * IMPORTANT: this module imports React. The main `@prs/ui-shared` entry
 * re-exports it for convenience, but non-React consumers MUST import from
 * the deep path `@prs/ui-shared/hooks` instead to avoid pulling React in.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

/** Latest-value ref; stable identity, never stale. */
export function useLatestRef<T>(value: T): RefObject<T> {
  const ref = useRef<T>(value);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref;
}

/** Run `callback` on unmount only (cleanup-safe across StrictMode). */
export function useUnmount(callback: () => void): void {
  const ref = useLatestRef(callback);
  useEffect(
    () => () => {
      ref.current();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on unmount
    [],
  );
}

/** Debounce a fast-changing value (search inputs, sliders). */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = globalThis.setTimeout(() => setDebounced(value), delayMs);
    return () => globalThis.clearTimeout(timer);
  }, [value, delayMs]);
  return debounced;
}

interface ControllableStateOptions<T> {
  controlledValue: T | undefined;
  defaultValue: T;
  onChange?: (next: T) => void;
}

/**
 * Canonical controlled/uncontrolled state resolution used by every form
 * component (Input, Checkbox, Select, Slider, …) on both platforms.
 *
 * Functional updates are only supported in uncontrolled mode; when the
 * component is controlled, consumers must pass explicit next values.
 */
export function useControllableState<T>({
  controlledValue,
  defaultValue,
  onChange,
}: ControllableStateOptions<T>): [T, (next: T | ((prev: T) => T)) => void] {
  const isControlled = controlledValue !== undefined;
  const [internal, setInternal] = useState<T>(defaultValue);
  const value = isControlled ? (controlledValue as T) : internal;

  const latest = useLatestRef({ isControlled, onChange });
  const currentRef = useLatestRef(value);

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      const state = latest.current;
      const resolved =
        typeof next === 'function'
          ? (next as (prev: T) => T)(currentRef.current)
          : next;
      if (!state.isControlled) {
        setInternal(resolved);
      }
      state.onChange?.(resolved);
    },
    [latest, currentRef],
  );

  return [value, setValue];
}

/** Mount flag that survives StrictMode double-invocation. */
export function useIsMounted(): () => boolean {
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  return useCallback(() => mounted.current, []);
}
