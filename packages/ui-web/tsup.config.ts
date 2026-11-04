import { createTsupConfig } from '@prs/config/tsup-config';

/**
 * Web build targets browsers and Node (for Next.js SSR / RSC), so we use the
 * `browser` platform. React, react-dom and @prs/ui-shared stay external so
 * consumer apps (React/Next.js) provide a single copy of each dependency.
 */
export default createTsupConfig({
  platform: 'browser',
  extraEntries: ['src/theme/tailwind-preset.ts', 'src/theme/ThemeProvider.tsx'],
  external: ['react', 'react-dom', 'react/jsx-runtime', '@prs/ui-shared', 'tailwindcss'],
});
