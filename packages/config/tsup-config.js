/**
 * Shared tsup configuration factory for every @prs/ui package (plain JS).
 *
 * This file must stay JavaScript, not TypeScript: tsup loads each package's
 * `tsup.config.ts` through Node's ESM loader via bundle-require, and Node 20
 * cannot import a `.ts` file reached through a package `exports` subpath
 * (`ERR_UNKNOWN_FILE_EXTENSION`). The sibling `tsup-config.ts` remains the
 * typed source of truth for editors/typecheckers.
 *
 * Each package composes this base with its own platform-specific options
 * (e.g. `platform: 'browser'` for web, React Native external rules for native).
 */

/**
 * Base build options applied to all packages:
 * dual ESM/CJS output, source maps, tree-shaking and clean dist output.
 * Type declarations are emitted separately by `tsc` (see package build scripts).
 *
 * @param {Record<string, unknown> & { extraEntries?: string[] }} [options]
 * @returns {Record<string, unknown>}
 */
export function createTsupConfig(options = {}) {
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
