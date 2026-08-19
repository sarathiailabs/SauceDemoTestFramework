/**
 * ProductPage
 *
 * Encapsulates interactions with the individual product detail page
 * (/inventory-item.html?id=...).
 *
 * Design decisions:
 * - Assertions are written in tests, not here — this page exposes queries.
 * - backToProducts() handles navigation back to the inventory list.
 */

import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { Header } from '../components/Header.js';
import { parseCurrency } from '../utils/helpers.js';
import { logger } from '../utils/logger.js';

export class ProductPage {
  readonly header: Header;

  private readonly productName: Locator;
  private readonly productDescription: Locator;
  private readonly productPrice: Locator;
  private readonly productImage: Locator;
  private readonly addToCartButton: Locator;
  private readonly removeButton: Locator;
  private readonly backButton: Locator;

  constructor(private readonly page: Page) {
    this.header = new Header(page);
    this.productName = page.locator('[data-test="inventory-item-name"]');
    this.productDescription = page.locator('[data-test="inventory-item-desc"]');
    this.productPrice = page.locator('[data-test="inventory-item-price"]');
    this.productImage = page.locator(
      '[data-test="item-sauce-labs-backpack-img"], .inventory_details_img',
    );
    this.addToCartButton = page.getByRole('button', { name: /add to cart/i });
    this.removeButton = page.getByRole('button', { name: /remove/i });
    this.backButton = page.locator('[data-test="back-to-products"]');
  }

  // ── Actions ─────────────────────────────────────────────────────────────────

  /**
   * Add the displayed product to the cart.
   */
  async addToCart(): Promise<void> {
    logger.step('Adding product to cart from detail page');
    await this.addToCartButton.click();
  }

  /**
   * Remove the displayed product from the cart.
   */
  async removeFromCart(): Promise<void> {
    logger.step('Removing product from cart on detail page');
    await this.removeButton.click();
  }

  /**
   * Navigate back to the inventory/products listing page.
   */
  async backToProducts(): Promise<void> {
    logger.step('Navigating back to products');
    await this.backButton.click();
    await expect(this.page).toHaveURL(/inventory\.html/);
  }

  // ── Queries ─────────────────────────────────────────────────────────────────

  async getName(): Promise<string> {
    return (await this.productName.textContent())?.trim() ?? '';
  }

  async getDescription(): Promise<string> {
    return (await this.productDescription.textContent())?.trim() ?? '';
  }

  async getPrice(): Promise<number> {
    const text = (await this.productPrice.textContent())?.trim() ?? '';
    return parseCurrency(text);
  }

  async getPriceText(): Promise<string> {
    return (await this.productPrice.textContent())?.trim() ?? '';
  }

  async isAddToCartVisible(): Promise<boolean> {
    return this.addToCartButton.isVisible();
  }

  async isRemoveVisible(): Promise<boolean> {
    return this.removeButton.isVisible();
  }

  // ── Assertions ───────────────────────────────────────────────────────────────

  async expectPageLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/inventory-item/);
    await expect(this.productName).toBeVisible();
    await expect(this.productDescription).toBeVisible();
    await expect(this.productPrice).toBeVisible();
  }

  async expectProductName(name: string): Promise<void> {
    await expect(this.productName).toHaveText(name);
  }

  async expectAddToCartVisible(): Promise<void> {
    await expect(this.addToCartButton).toBeVisible();
  }

  async expectRemoveVisible(): Promise<void> {
    await expect(this.removeButton).toBeVisible();
  }
}
