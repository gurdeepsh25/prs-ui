# @prs/ui-web

Shared UI components for **React 18/19** and **Next.js** — compatible with both
the App Router (Server Components + client components) and the Pages Router.

> **Status:** Initial setup — no components are exported yet. Component
> development starts in a later phase.

## Installation (future consumer apps)

```sh
# npm
npm install @prs/ui-web @prs/ui-shared

# pnpm
pnpm add @prs/ui-web @prs/ui-shared
```

Peer dependencies provided by your app: `react` and `react-dom` (Next.js
supplies React to the module graph automatically).

## Isolation guarantees

- Depends only on web-side packages; **never** imports `react-native`.
- `react`, `react-dom` and `@prs/ui-shared` are marked external in the build so
  your app always resolves a single copy of each.
- Dual ESM/CJS output with conditional `exports` map → works with bundlers,
  Node SSR, and Next.js server/client boundaries. Tree-shakable (`sideEffects: false`).

## Commands (run from repository root)

```sh
pnpm --filter @prs/ui-web build      # ESM + CJS bundles + type declarations
pnpm --filter @prs/ui-web typecheck  # strict tsc check (DOM libs enabled)
pnpm --filter @prs/ui-web dev        # tsup watch mode
```

See the root README for monorepo-wide workflows and publishing.
