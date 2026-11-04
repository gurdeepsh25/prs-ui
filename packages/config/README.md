# @prs/config

Internal, **private** package that centralizes shared development configuration
for the `prs-ui` monorepo. It is never published to npm.

## What it provides

| Export                              | Purpose                                                                                                                                                   |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@prs/config/tsconfig.package.json` | Template base TypeScript config for publishable packages (kept in sync with the root `tsconfig.base.json`; packages extend the root base directly).       |
| `@prs/config/tsup-config`           | Factory that returns the shared tsup build options (dual ESM/CJS, sourcemaps, tree-shaking) which each package overrides with platform-specific settings. |

## Usage from a package

```ts
// packages/<name>/tsup.config.ts
import { createTsupConfig } from '@prs/config/tsup-config';
export default createTsupConfig({ platform: 'browser' });
```

`@prs/config/tsup-config` resolves to `tsup-config.js` at runtime (Node's ESM
loader cannot import a `.ts` file reached through a package `exports` subpath
on Node 20 — it throws `ERR_UNKNOWN_FILE_EXTENSION`) while `tsup-config.ts`
provides the type declarations used by TypeScript. Because `@prs/config` is a
workspace package referenced via `workspace:*`, pnpm links it into each
consumer's `node_modules` — no publishing required.

For TypeScript project configs, packages extend the root `tsconfig.base.json`
directly (see `packages/*/tsconfig*.json`).

## Commands

```sh
pnpm --filter @prs/config typecheck   # source-only package: no build step
```
