import { createTsupConfig } from '@prs/config/tsup-config';

/**
 * @prs/ui-shared is platform-agnostic: no DOM or React Native assumptions.
 */
export default createTsupConfig({
  platform: 'neutral',
});
