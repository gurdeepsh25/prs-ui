import { createTsupConfig } from '@prs/config/tsup-config';

/**
 * React Native consumers resolve the `react-native` export condition and load
 * TypeScript source directly (standard for RN CLI libraries — Metro compiles
 * it with Babel). The dist bundles below exist as a fallback for non-RN
 * resolvers (tests, tooling) and must never bundle react or react-native.
 */
export default createTsupConfig({
  platform: 'neutral',
  external: [
    'react',
    'react/jsx-runtime',
    'react-native',
    '@prs/ui-shared',
    /^@react-native-community\//,
  ],
});
