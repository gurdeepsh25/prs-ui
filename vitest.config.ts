import { defineConfig } from 'vitest/config';

/**
 * Monorepo-wide test configuration.
 * Tests live next to the code they cover: packages/<name>/src/**/*.test.ts
 * (or a packages/<name>/test/ folder). Add platform-specific environments
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
