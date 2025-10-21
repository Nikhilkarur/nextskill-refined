// playwright.config.js
import { defineConfig, devices } from '@playwright/test';

const base = process.env.BASE_URL || 'http://127.0.0.1:5500';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  globalSetup: './tests/global-setup.ts',
  webServer: {
    command: 'npx http-server -a 127.0.0.1 -p 5500 .',
    url: 'http://127.0.0.1:5500',
    reuseExistingServer: true,
    timeout: 120_000,
  },
  use: {
    baseURL: base,
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    // Disable animations during testing to prevent instability
    extraHTTPHeaders: {
      'Reduce-Motion': 'reduce'
    },
    // Emulate reduced motion preference
    colorScheme: 'dark',
    reducedMotion: 'reduce',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
