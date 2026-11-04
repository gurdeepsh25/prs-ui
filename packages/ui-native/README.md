# @prs/ui-native

Shared UI components for **React Native CLI** projects (bare RN apps — not
Expo-managed, though Expo SDK projects can consume them via Metro as well).

> **Status:** Initial setup — no components are exported yet. Component
> development starts in a later phase.

## Installation (future consumer apps)

```sh
# npm
npm install @prs/ui-native @prs/ui-shared

# pnpm
pnpm add @prs/ui-native @prs/ui-shared
```

Peer dependencies provided by your app: `react`, `react-native`.

No additional native-module linking is required for pure-JS components. If any
future component ships native code, autolinking (React Native CLI) will pick it
up from the package's `package.json`.

## How resolution works

- The `exports` map exposes a **`react-native` condition pointing at the raw
  TypeScript source** (`src/index.ts`). This is the industry-standard approach
  for RN CLI libraries: Metro compiles the source with Babel, giving you
  hot-reload without a rebuild step in this library.
- Bundler/Node fallbacks (`import`/`require` → `dist/`) are provided for tooling
  and test runners that don't implement the `react-native` condition.
- `src/` is included in the published tarball intentionally (see `files`).

## Isolation guarantees

- Depends only on native-side packages; **never** imports `react`, `react-dom`
  web APIs or `@prs/ui-web`.
- `react`, `react-native` and `@prs/ui-shared` are externalized from bundles so
  your app resolves a single copy of each.

## Commands (run from repository root)

```sh
pnpm --filter @prs/ui-native build      # ESM + CJS fallback bundles + types
pnpm --filter @prs/ui-native typecheck  # strict tsc check (RN types enabled)
pnpm --filter @prs/ui-native dev        # tsup watch mode
```

See the root README for monorepo-wide workflows and publishing.
