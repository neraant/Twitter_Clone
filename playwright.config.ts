import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  globalSetup: './e2e/setup.ts',
  workers: 1,
  use: {
    baseURL: 'http://localhost:3000',
    storageState: undefined,
    headless: true,
    contextOptions: {
      ignoreHTTPSErrors: true,
    },
  },
});
