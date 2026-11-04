/**
 * @prs/ui-native entry point.
 *
 * Mobile-side shared UI components for React Native CLI projects.
 * Kept fully isolated from `@prs/ui-web`: no DOM APIs, no web-only
 * dependencies — only react-native primitives and platform-agnostic
 * helpers from `@prs/ui-shared`.
 *
 * NOTE: No public API is exported yet — component development starts in a
 * later phase. This file intentionally exists as the package entry point so
 * that tooling (tsup/tsc/Metro) resolves `src/index.ts` from day one.
 */

export {};
