/**
 * LoginPage
 *
 * Encapsulates all interactions with the SauceDemo login page (/).
 *
 * Design decisions:
 * - Locators use stable data-test attributes where available, fallback to role/label.
 * - login() accepts a User object to keep tests decoupled from credentials.
 * - loginWithCredentials() accepts raw strings for negative testing with invalid inputs.
 * - getErrorMessage() returns the trimmed error text for assertion in tests.
 */

import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import type { User } from '@types-local/index';
import { logger } from '@utils/logger';

export class LoginPage {
  readonly url = '/';

  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;
  private readonly errorCloseButton: Locator;
  private readonly logo: Locator;

  constructor(private readonly page: Page) {
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.errorCloseButton = page.locator('[data-test="error"] button');
    this.logo = page.locator('.login_logo');
  }

  // ── Navigation ──────────────────────────────────────────────────────────────

  /**
   * Navigate to the login page.
   */
  async navigate(): Promise<void> {
    await this.page.goto(this.url);
    await expect(this.loginButton).toBeVisible();
  }

  // ── Actions ─────────────────────────────────────────────────────────────────

  /**
   * Login using a typed User object.
   * This is the preferred method for most tests.
   *
   * @param user - The User object from src/data/users.ts
   */
  async login(user: User): Promise<void> {
    logger.step('Logging in', user.username);
    await this.loginWithCredentials(user.username, user.password);
  }

  /**
   * Login with raw string credentials.
   * Use this for negative tests that require invalid or empty values.
   *
   * @param username - The username string (may be empty for negative tests)
   * @param password - The password string (may be empty for negative tests)
   */
  async loginWithCredentials(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    // Note: password is intentionally not logged
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /**
   * Clear only the username field.
   */
  async clearUsername(): Promise<void> {
    await this.usernameInput.clear();
  }

  /**
   * Clear only the password field.
   */
  async clearPassword(): Promise<void> {
    await this.passwordInput.clear();
  }

  /**
   * Dismiss the visible error message by clicking the close button.
   */
  async dismissError(): Promise<void> {
    await this.errorCloseButton.click();
  }

  // ── Queries ─────────────────────────────────────────────────────────────────

  /**
   * Get the visible error message text.
   * Waits for the error to be visible before reading text.
   */
  async getErrorMessage(): Promise<string> {
    await expect(this.errorMessage).toBeVisible();
    return (await this.errorMessage.textContent())?.trim() ?? '';
  }

  /**
   * Check whether an error message is currently visible.
   */
  async isErrorVisible(): Promise<boolean> {
    return this.errorMessage.isVisible();
  }

  // ── Assertions ───────────────────────────────────────────────────────────────

  /**
   * Assert the page is fully loaded and ready for interaction.
   */
  async expectPageLoaded(): Promise<void> {
    await expect(this.logo).toBeVisible();
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  /**
   * Assert a specific error message is displayed.
   */
  async expectErrorMessage(expectedMessage: string): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(expectedMessage);
  }

  /**
   * Assert no error message is visible.
   */
  async expectNoError(): Promise<void> {
    await expect(this.errorMessage).not.toBeVisible();
  }
}
