import { createTsupConfig } from '@prs/config/tsup-config';

/**
 * @prs/ui-shared is platform-agnostic: no DOM or React Native assumptions.
 * `src/hooks.ts` is emitted as its own entry so consumers can deep-import it
 * via the "./hooks" export condition (see package.json exports map).
 */
export default createTsupConfig({
  platform: 'neutral',
  extraEntries: ['src/hooks.ts'],
});
