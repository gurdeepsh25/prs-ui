import { defineConfig } from 'vitest/config';

/**
 * Monorepo-wide test configuration with three projects:
 * - shared: framework-free logic in the plain node environment.
 * - web / native: component tests rendered with testing-library.
 *   Native tests alias react-native to react-native-web so RN primitives
 *   render inside jsdom without a simulator (logic/a11y verification; device
 *   behaviour is covered by the manual release checklist).
 * Test files live next to the code they cover.
 */
export default defineConfig({
  test: {
    globals: false,
    passWithNoTests: true,
    projects: [
      {
        test: {
          name: 'shared',
          environment: 'node',
          include: ['packages/shared/src/**/*.test.{ts,tsx}'],
        },
      },
      {
        resolve: {
          alias: { 'react-native': 'react-native-web' },
        },
        test: {
          name: 'web',
          environment: 'jsdom',
          include: ['packages/ui-web/src/**/*.test.{ts,tsx}'],
        },
      },
      {
        resolve: {
          alias: { 'react-native': 'react-native-web' },
        },
        test: {
          name: 'native',
          environment: 'jsdom',
          include: ['packages/ui-native/src/**/*.test.{ts,tsx}'],
        },
      },
    ],
  },
});
