# prs-ui

Centralized shared UI component library monorepo for **Web** (React / Next.js)
and **Mobile** (React Native CLI) applications, built with TypeScript and
pnpm workspaces.

> **Status:** Foundation only — architecture, package structure, tooling and CI
> are in place. **No UI components have been created yet**; component
> development starts in a later phase.

## Packages

| Package          | Path                 | Published | Description                                                            |
| ---------------- | -------------------- | --------- | ---------------------------------------------------------------------- |
| `@prs/ui-web`    | `packages/ui-web`    | ✔         | Shared UI components for React 18/19 and Next.js (App Router + Pages). |
| `@prs/ui-native` | `packages/ui-native` | ✔         | Shared UI components for React Native CLI projects.                    |
| `@prs/ui-shared` | `packages/shared`    | ✔         | Platform-agnostic types, utilities and design tokens used by both.     |
| `@prs/config`    | `packages/config`    | ✘ private | Internal dev configuration (TypeScript base config, tsup factory).     |

Each publishable package has its own README under its directory.

## Architecture

```
prs-ui/
├── .changeset/            # Changesets versioning & publishing config
├── .github/workflows/     # CI: format · lint · typecheck · test · build · pack
├── packages/
│   ├── config/            # @prs/config        (private tooling config)
│   ├── shared/            # @prs/ui-shared     (platform-agnostic core)
│   ├── ui-web/            # @prs/ui-web        (React / Next.js)
│   └── ui-native/         # @prs/ui-native     (React Native CLI)
├── eslint.config.js       # Flat ESLint config (repo-wide)
├── prettier config        # .prettierrc.json + .prettierignore
├── tsconfig.base.json     # Strict shared compiler options
├── vitest.config.ts       # Repo-wide test runner config
└── pnpm-workspace.yaml    # Workspace globs (packages/*, apps/*)
```

### Platform isolation

Web and native packages are fully isolated so platform-specific code can never
leak across boundaries:

- `@prs/ui-web` never imports `react-native`; peer deps are `react`/`react-dom`.
- `@prs/ui-native` never touches DOM APIs; peer deps are `react`/`react-native`,
  and its `exports` map exposes a `react-native` condition pointing at raw TS
  source so Metro compiles it directly (standard RN CLI library practice).
- `@prs/ui-shared` is runtime-free of any framework — it must never import
  `react`, `react-dom`, or `react-native`, so both platforms can depend on it.

### Build & package quality

- **tsup** produces dual ESM/CJS bundles with full `.d.ts` declarations.
- Conditional `exports` maps, `sideEffects: false`, and externalized peers give
  consumers tree-shakable, single-instance dependencies.
- `publishConfig.access: public` and repository metadata are already set for
  future npm publishing.

### Versioning & releases

[Changesets](https://github.com/changesets/changesets) manages versions. The
three published packages are _linked_, so a change to one bumps them together.

```sh
pnpm changeset           # record your change (run per PR)
pnpm version-packages    # consume changesets, bump versions, generate CHANGELOGs
pnpm release             # build + publish to npm (run after version PR merges)
```

## Getting started

Requirements: **Node ≥ 20** (CI runs Node 22 LTS) and **pnpm 9.15.9**
(the exact version is pinned via the root `packageManager` field; corepack
installs it automatically).

```sh
corepack enable          # use the pinned pnpm
pnpm install             # install all workspace dependencies
```

### Commands (run from the repository root)

| Command             | Purpose                                        |
| ------------------- | ---------------------------------------------- |
| `pnpm build`        | Build all packages (ESM + CJS + types)         |
| `pnpm typecheck`    | Strict TypeScript check across all packages    |
| `pnpm lint`         | ESLint (flat config)                           |
| `pnpm lint:fix`     | ESLint with autofix                            |
| `pnpm format`       | Prettier write                                 |
| `pnpm format:check` | Prettier check (used in CI)                    |
| `pnpm test`         | Vitest run                                     |
| `pnpm test:watch`   | Vitest watch mode                              |
| `pnpm clean`        | Remove all build output                        |
| `pnpm check`        | format:check → lint → typecheck → test → build |

To target a single package:

```sh
pnpm --filter @prs/ui-web build
pnpm --filter @prs/ui-native typecheck
```

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs on every push to `main` and on
all pull requests: install (`--frozen-lockfile`) → format check → lint →
typecheck → test → build → `pnpm pack` verification for each publishable
package. A single Node 22 LTS job is used since this repo builds
runtime-agnostic libraries; consumer-facing minimum engines are declared per
package.

## Adding a new package

1. Create `packages/<name>/` with `src/index.ts`, `package.json`,
   `tsconfig.json`, `tsconfig.build.json` and `tsup.config.ts`
   (copy the layout of `packages/shared` as the simplest template).
2. Extend the root `tsconfig.base.json` and use `createTsupConfig` from
   `@prs/config/tsup-config`.
3. Add a changeset, then `pnpm install && pnpm check` — CI picks it up
   automatically via the `packages/*` workspace glob.

An `apps/*` glob is already reserved in `pnpm-workspace.yaml` for future demo
or documentation apps.

## License

UNLICENSED (to be determined before first publish).
