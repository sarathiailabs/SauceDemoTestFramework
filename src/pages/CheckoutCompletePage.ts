/**
 * CheckoutCompletePage
 *
 * Encapsulates interactions with the order confirmation page (/checkout-complete.html).
 */

import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { logger } from '../utils/logger.js';

export class CheckoutCompletePage {
  readonly url = '/checkout-complete.html';

  private readonly confirmationHeader: Locator;
  private readonly confirmationText: Locator;
  private readonly ponyExpressImage: Locator;
  private readonly backToHomeButton: Locator;
  private readonly pageTitle: Locator;

  constructor(private readonly page: Page) {
    this.confirmationHeader = page.locator('[data-test="complete-header"]');
    this.confirmationText = page.locator('[data-test="complete-text"]');
    this.ponyExpressImage = page.locator('[data-test="pony-express"]');
    this.backToHomeButton = page.locator('[data-test="back-to-products"]');
    this.pageTitle = page.locator('[data-test="title"]');
  }

  // ── Actions ─────────────────────────────────────────────────────────────────

  /**
   * Navigate back to the inventory page using the "Back Home" button.
   */
  async backToHome(): Promise<void> {
    logger.step('Clicking Back Home on order confirmation');
    await this.backToHomeButton.click();
    await expect(this.page).toHaveURL(/inventory/);
  }

  // ── Queries ─────────────────────────────────────────────────────────────────

  async getConfirmationHeader(): Promise<string> {
    return (await this.confirmationHeader.textContent())?.trim() ?? '';
  }

  async getConfirmationText(): Promise<string> {
    return (await this.confirmationText.textContent())?.trim() ?? '';
  }

  // ── Assertions ───────────────────────────────────────────────────────────────

  async expectPageLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/checkout-complete/);
    await expect(this.pageTitle).toHaveText('Checkout: Complete!');
  }

  async expectOrderConfirmed(): Promise<void> {
    await expect(this.confirmationHeader).toBeVisible();
    await expect(this.confirmationHeader).toContainText('Thank you for your order!');
    await expect(this.confirmationText).toBeVisible();
    await expect(this.ponyExpressImage).toBeVisible();
  }

  async expectConfirmationHeader(text: string): Promise<void> {
    await expect(this.confirmationHeader).toHaveText(text);
  }
}
