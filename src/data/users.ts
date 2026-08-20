/**
 * Test user data for SauceDemo.
 *
 * Users are centralized here — never duplicate credentials in test files.
 * The password is sourced from environment variables to avoid committing secrets.
 *
 * NOTE: process.env is loaded via dotenv in playwright.config.ts before tests run.
 */

import type { User } from '@types-local/index';

const PASSWORD = process.env.DEFAULT_PASSWORD ?? 'secret_sauce';

export const users = {
  /**
   * Standard user — normal application behavior.
   * Used as the default user for the majority of test scenarios.
   */
  standard: {
    username: 'standard_user',
    password: PASSWORD,
    description: 'standard user with normal application behavior',
  } satisfies User,

  /**
   * Locked-out user — blocked from logging in.
   * Used for negative authentication scenarios.
   */
  lockedOut: {
    username: 'locked_out_user',
    password: PASSWORD,
    description: 'locked-out user who cannot authenticate',
  } satisfies User,

  /**
   * Problem user — exhibits intentional UI behavior issues.
   * Used to validate application behavior under degraded conditions.
   */
  problem: {
    username: 'problem_user',
    password: PASSWORD,
    description: 'problem user exhibiting application behavior issues',
  } satisfies User,

  /**
   * Performance glitch user — slow response simulation.
   */
  performanceGlitch: {
    username: 'performance_glitch_user',
    password: PASSWORD,
    description: 'performance glitch user with simulated slow responses',
  } satisfies User,

  /**
   * Error user — error behavior testing.
   */
  error: {
    username: 'error_user',
    password: PASSWORD,
    description: 'error user for error behavior testing',
  } satisfies User,

  /**
   * Visual user — visual behavior testing.
   */
  visual: {
    username: 'visual_user',
    password: PASSWORD,
    description: 'visual user for visual behavior testing',
  } satisfies User,
} as const;

/** All users as an array — useful for data-driven tests. */
export const allUsers = Object.values(users);

/** Users expected to log in successfully. */
export const validUsers = [
  users.standard,
  users.problem,
  users.performanceGlitch,
  users.error,
  users.visual,
];

/** Invalid credential sets for negative testing. */
export const invalidCredentials = [
  {
    username: 'invalid_user',
    password: 'wrong_password',
    description: 'invalid username and password',
  },
  {
    username: 'standard_user',
    password: 'wrong_password',
    description: 'valid username with wrong password',
  },
  {
    username: 'nonexistent_user',
    password: PASSWORD,
    description: 'nonexistent username with valid password',
  },
];
