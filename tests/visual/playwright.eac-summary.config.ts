import { defineConfig, devices } from '@playwright/test';
import * as path from 'path';
export default defineConfig({
  testDir: './',
  testMatch: '*.spec.ts',
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  reporter: 'list',
  use: {
    actionTimeout: 0,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    }
  ],
  webServer: [
    {
      command: 'npx vite build -c tests/visual/harness/vite.config.ts && npx vite preview -c tests/visual/harness/vite.config.ts --port 4178',
      cwd: process.cwd(),
      port: 4178,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'npm run dev -- --host 127.0.0.1 --port 4179',
      cwd: process.cwd(),
      port: 4179,
      reuseExistingServer: !process.env.CI,
    }
  ]
});
