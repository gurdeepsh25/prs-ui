/**
 * Platform-agnostic utilities shared by web and native packages.
 */

declare const process: { env?: Record<string, string | undefined> } | undefined;

/** Join class-name fragments, skipping falsy values (web helper). */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

/** Clamp `value` into the inclusive [min, max] range. */
export function clamp(value: number, min: number, max: number): number {
  if (typeof process !== 'undefined' && process?.env?.NODE_ENV === 'development' && min > max) {
    throw new RangeError(`clamp: min (${min}) must be <= max (${max})`);
  }
  return Math.min(Math.max(value, min), max);
}

let idCounter = 0;

/** Deterministic-enough unique id for a11y wiring (label ↔ control). */
export function generateId(prefix = 'prs'): string {
  idCounter += 1;
  return `${prefix}-${idCounter.toString(36)}`;
}

/** Reset the internal id counter — test helper only. */
export function __resetIdCounterForTests(): void {
  idCounter = 0;
}

/** Standard controlled/uncontrolled value resolution. */
export function resolveValue<T>(controlled: T | undefined, uncontrolled: T): T {
  return controlled !== undefined ? controlled : uncontrolled;
}

/** Whether a component is operating in controlled mode. */
export function isControlled<T>(value: T | undefined): boolean {
  return value !== undefined;
}

/** Type guard: non-null/undefined narrowing used across components. */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/** Convert any React-Native-ish color input to an rgba() string with alpha. */
export function withAlpha(color: string, alpha: number): string {
  const clamped = clamp(alpha, 0, 1);
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(color.trim());
  if (!hex?.[1]) {
    // Pass through anything we can't parse (rgb(), hsl(), named colors) by
    // wrapping it in color-mix which degrades gracefully on RN via fallback.
    return `rgba(${color.replace(/^(rgb|rgba)\(|\)$/g, '').replace(/,\s*[\d.]+\s*$/, '')}, ${clamped})`;
  }
  let digits = hex[1];
  if (digits.length === 3) {
    digits = digits
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const int = Number.parseInt(digits, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r}, ${g}, ${b}, ${clamped})`;
}
