/**
 * Shared tsup configuration factory for every @prs/ui package.
 *
 * Each package composes this base with its own platform-specific options
 * (e.g. `platform: 'browser'` for web, React Native external rules for native).
 */
import type { Options } from 'tsup';

export interface PrsTsupOptions extends Options {
  /** Additional entries beyond the default `src/index.ts`. */
  extraEntries?: string[];
}

/**
 * Base build options applied to all packages:
 * dual ESM/CJS output, source maps, tree-shaking and clean dist output.
 * Type declarations are emitted separately by `tsc` (see package build scripts).
 */
export function createTsupConfig(options: PrsTsupOptions = {}): Options {
  const { extraEntries = [], ...overrides } = options;

  return {
    entry: ['src/index.ts', ...extraEntries],
    format: ['esm', 'cjs'],
    sourcemap: true,
    clean: true,
    dts: false,
    treeshake: true,
    target: 'es2022',
    outDir: 'dist',
    ...overrides,
  };
}

export default createTsupConfig;
