import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import dotenv from 'dotenv';
import path from 'path';

// .env is optional and gitignored — see .env.example for the variables this
// project reads (BASE_URL, API_BASE_URL). Falls back to Toolshop's default
// local Docker ports when absent.
dotenv.config({ path: path.resolve(__dirname, '.env') });

const testDir = defineBddConfig({
  features: 'features/*.feature',
  steps: 'features/steps/*.steps.ts',
});

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir,
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  /* Scenarios share a fixed Toolshop test account (see features/steps/*.steps.ts).
   * Confirmed via testing: running scenarios that log in with that account across
   * multiple parallel workers causes cross-test interference (one worker's login
   * redirect races another's). Single-worker on CI avoids that; local runs accept
   * the same risk for speed since failures there are just re-run, not a gate. */
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html'], ['list']],
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:4200',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
