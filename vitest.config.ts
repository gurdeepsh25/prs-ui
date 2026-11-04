import { defineConfig } from 'vitest/config';

/**
 * Monorepo-wide test configuration.
 * Tests live next to the code they cover, e.g. inside each package's src
 * folder (or a test/ folder in the package). Add platform-specific environments
 * (jsdom for web, react-native preset for native) when tests are introduced.
 */
export default defineConfig({
  test: {
    include: ['packages/*/src/**/*.test.{ts,tsx}', 'packages/*/test/**/*.test.{ts,tsx}'],
    environment: 'node',
    passWithNoTests: true,
    globals: false,
  },
});
