# @prs/config

Internal, **private** package that centralizes shared development configuration
for the `prs-ui` monorepo. It is never published to npm.

## What it provides

| Export | Purpose |
| --- | --- |
| `@prs/config/tsconfig.package.json` | Base TypeScript config extended by every publishable package (`tsconfig.json` / `tsconfig.build.json`). |
| `@prs/config/tsup-config` | Factory that returns the shared tsup build options (dual ESM/CJS, sourcemaps, tree-shaking) which each package overrides with platform-specific settings. |

## Usage from a package

```jsonc
// packages/<name>/tsconfig.json
{ "extends": "@prs/config/tsconfig.package.json", "...": {} }
```

```ts
// packages/<name>/tsup.config.ts
import { createTsupConfig } from '@prs/config/tsup-config';
export default createTsupConfig({ platform: 'browser' });
```

Because `@prs/config` is a workspace package referenced via `workspace:*`,
pnpm links it into each consumer's `node_modules` — no publishing required.

## Commands

```sh
pnpm --filter @prs/config build      # compile tsup-config.ts -> .mjs/.cjs/.d.ts
pnpm --filter @prs/config typecheck
```
