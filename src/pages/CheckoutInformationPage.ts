/**
 * CheckoutInformationPage
 *
 * Encapsulates interactions with the checkout step 1 page (/checkout-step-one.html).
 * Handles form filling, field-level operations, and validation error queries.
 */

import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import type { CheckoutData } from '../types/index.js';
import { logger } from '../utils/logger.js';

export class CheckoutInformationPage {
  readonly url = '/checkout-step-one.html';

  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly postalCodeInput: Locator;
  private readonly continueButton: Locator;
  private readonly cancelButton: Locator;
  private readonly errorMessage: Locator;
  private readonly errorCloseButton: Locator;
  private readonly pageTitle: Locator;

  constructor(private readonly page: Page) {
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.errorCloseButton = page.locator('[data-test="error"] button');
    this.pageTitle = page.locator('[data-test="title"]');
  }

  // ── Actions ─────────────────────────────────────────────────────────────────

  /**
   * Fill all checkout information fields and click Continue.
   * Use empty string fields in CheckoutData for negative test scenarios.
   *
   * @param data - CheckoutData object (firstName, lastName, postalCode)
   */
  async fillForm(data: CheckoutData): Promise<void> {
    logger.step('Filling checkout information');
    if (data.firstName) await this.firstNameInput.fill(data.firstName);
    if (data.lastName) await this.lastNameInput.fill(data.lastName);
    if (data.postalCode) await this.postalCodeInput.fill(data.postalCode);
  }

  /**
   * Click the Continue button.
   */
  async continue(): Promise<void> {
    logger.step('Clicking Continue on checkout information');
    await this.continueButton.click();
  }

  /**
   * Fill form data and submit — convenience method for the happy path.
   */
  async fillAndContinue(data: CheckoutData): Promise<void> {
    await this.fillForm(data);
    await this.continue();
  }

  /**
   * Cancel checkout and return to the cart page.
   */
  async cancel(): Promise<void> {
    logger.step('Cancelling checkout information');
    await this.cancelButton.click();
  }

  /**
   * Dismiss the visible error message.
   */
  async dismissError(): Promise<void> {
    await this.errorCloseButton.click();
  }

  // ── Queries ─────────────────────────────────────────────────────────────────

  async getErrorMessage(): Promise<string> {
    await expect(this.errorMessage).toBeVisible();
    return (await this.errorMessage.textContent())?.trim() ?? '';
  }

  // ── Assertions ───────────────────────────────────────────────────────────────

  async expectPageLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/checkout-step-one/);
    await expect(this.pageTitle).toHaveText('Checkout: Your Information');
    await expect(this.firstNameInput).toBeVisible();
    await expect(this.lastNameInput).toBeVisible();
    await expect(this.postalCodeInput).toBeVisible();
  }

  async expectErrorMessage(expectedMessage: string): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(expectedMessage);
  }

  async expectNoError(): Promise<void> {
    await expect(this.errorMessage).not.toBeVisible();
  }
}
