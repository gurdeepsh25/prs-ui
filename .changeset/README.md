# Changesets

Hello and welcome! This folder stores changeset files used by
`@changesets/cli` to version and publish the packages in this monorepo.

## Using changesets in this repository

1. Create a changeset after changing any publishable package
   (`@prs/ui-shared`, `@prs/ui-web`, `@prs/ui-native`):

   ```sh
   pnpm changeset
   ```

2. Version packages (run locally or in CI on the default branch):

   ```sh
   pnpm version-packages
   ```

3. Publish packages to npm:

   ```sh
   pnpm release
   ```

Only packages without `"private": true` are published. The internal
`@prs/config` package stays private forever.
