import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env file — ignored in CI (CI uses repository secrets via env vars)
dotenv.config({ path: path.resolve(__dirname, '.env') });

const BASE_URL = process.env.BASE_URL ?? 'https://www.saucedemo.com';
const IS_CI = !!process.env.CI;

export default defineConfig({
  // ── Test discovery ──────────────────────────────────────────────────────────
  testDir: './tests',
  testMatch: '**/*.spec.ts',

  // ── Execution ───────────────────────────────────────────────────────────────
  fullyParallel: true,
  workers: IS_CI ? 4 : undefined, // CI: fixed workers; local: auto
  retries: IS_CI ? 2 : 0, // Retry on CI only

  // ── Timeouts ────────────────────────────────────────────────────────────────
  timeout: 30_000,
  expect: { timeout: 10_000 },

  // ── Reporting ────────────────────────────────────────────────────────────────
  reporter: IS_CI
    ? [
        ['github'],
        ['html', { outputFolder: 'playwright-report', open: 'never' }],
        ['json', { outputFile: 'test-results/results.json' }],
      ]
    : [['html', { outputFolder: 'playwright-report', open: 'on-failure' }], ['list']],

  // ── Global browser context defaults ─────────────────────────────────────────
  use: {
    baseURL: BASE_URL,

    // Capture on failure only — balance debuggability vs. speed
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',

    // Viewport
    viewport: { width: 1280, height: 720 },
  },

  // ── Projects (browsers) ─────────────────────────────────────────────────────
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
    // Smoke-only project for fast PR validation
    {
      name: 'smoke',
      use: { ...devices['Desktop Chrome'] },
      grep: /@smoke/,
    },
  ],

  // ── Output directory ─────────────────────────────────────────────────────────
  outputDir: 'test-results',
});
