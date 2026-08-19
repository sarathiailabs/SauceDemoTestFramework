/**
 * Header Component
 *
 * Represents the persistent header present on all authenticated pages.
 * Encapsulates the cart icon and cart badge — used by page objects that need
 * cart-related assertions or navigation.
 */

import type { Locator, Page } from '@playwright/test';

export class Header {
  private readonly cartIcon: Locator;
  private readonly cartBadge: Locator;

  constructor(private readonly page: Page) {
    this.cartIcon = page.locator('[data-test="shopping-cart-link"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
  }

  /**
   * Navigate to the shopping cart page.
   * Waits for the cart URL to be active before returning.
   */
  async goToCart(): Promise<void> {
    await this.cartIcon.click();
    await this.page.waitForURL(/cart/);
  }

  /**
   * Get the current cart item count from the badge.
   * Returns 0 if the badge is not visible (empty cart).
   */
  async getCartCount(): Promise<number> {
    const isVisible = await this.cartBadge.isVisible();
    if (!isVisible) return 0;
    const text = await this.cartBadge.textContent();
    return parseInt(text ?? '0', 10);
  }

  /**
   * Assert that the cart badge is visible with the expected count.
   */
  async expectCartCount(count: number): Promise<void> {
    if (count === 0) {
      await this.cartBadge.waitFor({ state: 'hidden' });
    } else {
      await this.cartBadge.waitFor({ state: 'visible' });
    }
  }
}
