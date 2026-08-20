/**
 * CartPage
 *
 * Encapsulates all interactions with the shopping cart page (/cart.html).
 */

import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { Header } from '@components/Header';
import type { CartItem } from '@types-local/index';
import { parseCurrency } from '@utils/helpers';
import { logger } from '@utils/logger';

export class CartPage {
  readonly url = '/cart.html';

  readonly header: Header;

  private readonly cartItems: Locator;
  private readonly continueShoppingButton: Locator;
  private readonly checkoutButton: Locator;
  private readonly pageTitle: Locator;

  constructor(private readonly page: Page) {
    this.header = new Header(page);
    this.cartItems = page.locator('[data-test="cart-item"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.pageTitle = page.locator('[data-test="title"]');
  }

  // ── Navigation ──────────────────────────────────────────────────────────────

  async navigate(): Promise<void> {
    await this.page.goto(this.url);
    await this.expectPageLoaded();
  }

  // ── Actions ─────────────────────────────────────────────────────────────────

  /**
   * Remove a cart item by its product name.
   * Uses the stable data-test attribute pattern "remove-*" rather than role/text
   * because SauceDemo's remove button in the cart uses data-test="remove-{product-slug}".
   */
  async removeItem(productName: string): Promise<void> {
    logger.step('Removing item from cart', productName);
    const item = this.getCartItemByName(productName);
    await item.locator('[data-test^="remove-"]').click();
  }

  /**
   * Click "Continue Shopping" to return to the inventory page.
   */
  async continueShopping(): Promise<void> {
    logger.step('Clicking Continue Shopping');
    await this.continueShoppingButton.click();
    await expect(this.page).toHaveURL(/inventory/);
  }

  /**
   * Proceed to the checkout information page.
   */
  async proceedToCheckout(): Promise<void> {
    logger.step('Proceeding to checkout');
    await this.checkoutButton.click();
    await expect(this.page).toHaveURL(/checkout-step-one/);
  }

  // ── Queries ─────────────────────────────────────────────────────────────────

  /**
   * Get all cart item names in display order.
   */
  async getItemNames(): Promise<string[]> {
    return this.page.locator('[data-test="inventory-item-name"]').allTextContents();
  }

  /**
   * Get all cart item prices as numbers.
   */
  async getItemPrices(): Promise<number[]> {
    const texts = await this.page.locator('[data-test="inventory-item-price"]').allTextContents();
    return texts.map(parseCurrency);
  }

  /**
   * Get all cart items as structured objects.
   */
  async getCartItems(): Promise<CartItem[]> {
    const count = await this.cartItems.count();
    const items: CartItem[] = [];

    for (let i = 0; i < count; i++) {
      const item = this.cartItems.nth(i);
      const name =
        (await item.locator('[data-test="inventory-item-name"]').textContent())?.trim() ?? '';
      const priceText =
        (await item.locator('[data-test="inventory-item-price"]').textContent())?.trim() ?? '';
      const quantityText =
        (await item.locator('[data-test="item-quantity"]').textContent())?.trim() ?? '1';

      items.push({
        name,
        price: parseCurrency(priceText),
        quantity: parseInt(quantityText, 10),
      });
    }

    return items;
  }

  /**
   * Get the number of items in the cart.
   */
  async getItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  /**
   * Check whether the cart is empty.
   */
  async isEmpty(): Promise<boolean> {
    return (await this.cartItems.count()) === 0;
  }

  // ── Assertions ───────────────────────────────────────────────────────────────

  async expectPageLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/cart/);
    await expect(this.pageTitle).toHaveText('Your Cart');
  }

  async expectItemInCart(productName: string): Promise<void> {
    await expect(
      this.page.locator('[data-test="inventory-item-name"]').filter({ hasText: productName }),
    ).toBeVisible();
  }

  async expectItemNotInCart(productName: string): Promise<void> {
    await expect(
      this.page.locator('[data-test="inventory-item-name"]').filter({ hasText: productName }),
    ).not.toBeVisible();
  }

  async expectCartEmpty(): Promise<void> {
    await expect(this.cartItems).toHaveCount(0);
  }

  async expectItemCount(count: number): Promise<void> {
    await expect(this.cartItems).toHaveCount(count);
  }

  // ── Private helpers ──────────────────────────────────────────────────────────

  private getCartItemByName(productName: string): Locator {
    return this.cartItems.filter({ hasText: productName });
  }
}
