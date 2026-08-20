/**
 * CheckoutOverviewPage
 *
 * Encapsulates interactions with the checkout overview page (/checkout-step-two.html).
 * Displays the order summary (items, item total, tax, grand total).
 */

import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import type { CheckoutSummary } from '@types-local/index';
import { parseCurrency } from '@utils/helpers';
import { logger } from '@utils/logger';

export class CheckoutOverviewPage {
  readonly url = '/checkout-step-two.html';

  private readonly cartItems: Locator;
  private readonly itemTotal: Locator;
  private readonly tax: Locator;
  private readonly total: Locator;
  private readonly finishButton: Locator;
  private readonly cancelButton: Locator;
  private readonly pageTitle: Locator;

  constructor(private readonly page: Page) {
    this.cartItems = page.locator('[data-test="cart-item"]');
    this.itemTotal = page.locator('[data-test="subtotal-label"]');
    this.tax = page.locator('[data-test="tax-label"]');
    this.total = page.locator('[data-test="total-label"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.pageTitle = page.locator('[data-test="title"]');
  }

  // ── Actions ─────────────────────────────────────────────────────────────────

  /**
   * Click Finish to complete the purchase.
   */
  async finish(): Promise<void> {
    logger.step('Finishing order on checkout overview');
    await this.finishButton.click();
    await expect(this.page).toHaveURL(/checkout-complete/);
  }

  /**
   * Cancel the checkout and navigate back to the inventory page.
   */
  async cancel(): Promise<void> {
    logger.step('Cancelling order on checkout overview');
    await this.cancelButton.click();
  }

  // ── Queries ─────────────────────────────────────────────────────────────────

  /**
   * Get all item names displayed in the order overview.
   */
  async getItemNames(): Promise<string[]> {
    return this.page.locator('[data-test="inventory-item-name"]').allTextContents();
  }

  /**
   * Get the item subtotal (before tax) as a number.
   */
  async getItemTotal(): Promise<number> {
    const text = (await this.itemTotal.textContent())?.trim() ?? '';
    return parseCurrency(text);
  }

  /**
   * Get the tax amount as a number.
   */
  async getTax(): Promise<number> {
    const text = (await this.tax.textContent())?.trim() ?? '';
    return parseCurrency(text);
  }

  /**
   * Get the grand total as a number.
   */
  async getTotal(): Promise<number> {
    const text = (await this.total.textContent())?.trim() ?? '';
    return parseCurrency(text);
  }

  /**
   * Get the full checkout summary object (itemTotal, tax, total).
   */
  async getSummary(): Promise<CheckoutSummary> {
    const [itemTotal, tax, total] = await Promise.all([
      this.getItemTotal(),
      this.getTax(),
      this.getTotal(),
    ]);
    return { itemTotal, tax, total };
  }

  async getItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  // ── Assertions ───────────────────────────────────────────────────────────────

  async expectPageLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/checkout-step-two/);
    await expect(this.pageTitle).toHaveText('Checkout: Overview');
    await expect(this.finishButton).toBeVisible();
  }

  async expectItemInOverview(productName: string): Promise<void> {
    await expect(
      this.page.locator('[data-test="inventory-item-name"]').filter({ hasText: productName }),
    ).toBeVisible();
  }

  async expectSummaryVisible(): Promise<void> {
    await expect(this.itemTotal).toBeVisible();
    await expect(this.tax).toBeVisible();
    await expect(this.total).toBeVisible();
  }
}
