/**
 * Login Tests
 *
 * Covers FR-001: Authentication
 * - Successful login scenarios
 * - Negative login scenarios (invalid credentials, locked out, missing fields)
 * - Error message validation
 *
 * Tags: @login @smoke @regression @negative @P0 @P1
 */

import { expect, test } from '../../src/fixtures/test.fixture';
import { invalidCredentials, users } from '../../src/data/users';

test.describe('Authentication — Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
  });

  // ── Successful Login ────────────────────────────────────────────────────────

  test(
    'should allow a standard user to login successfully',
    {
      tag: ['@smoke', '@regression', '@login', '@P0', '@critical'],
    },
    async ({ loginPage, page }) => {
      await loginPage.login(users.standard);

      await expect(page).toHaveURL(/inventory/);
      await expect(page).toHaveTitle(/Swag Labs/);
    },
  );

  // ── Invalid Credentials ─────────────────────────────────────────────────────

  for (const { username, password, description } of invalidCredentials) {
    test(
      `should display an error for ${description}`,
      {
        tag: ['@regression', '@login', '@negative', '@P1'],
      },
      async ({ loginPage }) => {
        await loginPage.loginWithCredentials(username, password);

        await loginPage.expectErrorMessage(
          'Epic sadface: Username and password do not match any user',
        );
      },
    );
  }

  // ── Locked Out User ─────────────────────────────────────────────────────────

  test(
    'should display a locked-out error for the locked_out_user',
    {
      tag: ['@regression', '@login', '@negative', '@P1'],
    },
    async ({ loginPage }) => {
      await loginPage.login(users.lockedOut);

      await loginPage.expectErrorMessage('Epic sadface: Sorry, this user has been locked out.');
    },
  );

  // ── Missing Credentials ─────────────────────────────────────────────────────

  test(
    'should display an error when username is missing',
    {
      tag: ['@regression', '@login', '@negative', '@P2'],
    },
    async ({ loginPage }) => {
      await loginPage.loginWithCredentials('', users.standard.password);

      await loginPage.expectErrorMessage('Epic sadface: Username is required');
    },
  );

  test(
    'should display an error when password is missing',
    {
      tag: ['@regression', '@login', '@negative', '@P2'],
    },
    async ({ loginPage }) => {
      await loginPage.loginWithCredentials(users.standard.username, '');

      await loginPage.expectErrorMessage('Epic sadface: Password is required');
    },
  );

  test(
    'should display an error when both username and password are missing',
    {
      tag: ['@regression', '@login', '@negative', '@P2'],
    },
    async ({ loginPage }) => {
      await loginPage.loginWithCredentials('', '');

      await loginPage.expectErrorMessage('Epic sadface: Username is required');
    },
  );

  // ── Error Dismissal ─────────────────────────────────────────────────────────

  test(
    'should dismiss the error message when the close button is clicked',
    {
      tag: ['@regression', '@login', '@P3'],
    },
    async ({ loginPage }) => {
      await loginPage.loginWithCredentials('invalid', 'invalid');
      await loginPage.expectErrorMessage('Epic sadface');

      await loginPage.dismissError();

      await loginPage.expectNoError();
    },
  );

  // ── Login Page Loaded ───────────────────────────────────────────────────────

  test(
    'should display all expected elements on the login page',
    {
      tag: ['@regression', '@login', '@P2'],
    },
    async ({ loginPage }) => {
      await loginPage.expectPageLoaded();
    },
  );
});
