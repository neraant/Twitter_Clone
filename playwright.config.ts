import { defineConfig } from '@playwright/test';

import { BASE_URL } from '@/shared/lib/common';

export default defineConfig({
  testDir: './e2e',
  globalSetup: './e2e/setup.ts',
  workers: 1,
  use: {
    baseURL: BASE_URL,
    storageState: undefined,
    headless: true,
    contextOptions: {
      ignoreHTTPSErrors: true,
    },
  },
});
