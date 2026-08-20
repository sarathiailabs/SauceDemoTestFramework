/**
 * InventoryPage
 *
 * Encapsulates all interactions with the product inventory page (/inventory.html).
 *
 * Design decisions:
 * - Products are located by name (getByText) for semantic resilience.
 * - Sort dropdown uses data-test attribute (most stable locator available).
 * - cart badge and header nav are delegated to the Header component.
 * - Price parsing is delegated to the helpers utility.
 */

import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { Header } from '@components/Header';
import type { SortOption } from '@types-local/index';
import { SortOptionValues } from '@types-local/index';
import { parseCurrency } from '@utils/helpers';
import { logger } from '@utils/logger';

export class InventoryPage {
  readonly url = '/inventory.html';

  readonly header: Header;

  private readonly productList: Locator;
  private readonly productItems: Locator;
  private readonly sortDropdown: Locator;
  private readonly pageTitle: Locator;

  constructor(private readonly page: Page) {
    this.header = new Header(page);
    this.productList = page.locator('[data-test="inventory-list"]');
    this.productItems = page.locator('[data-test="inventory-item"]');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.pageTitle = page.locator('[data-test="title"]');
  }

  // ── Navigation ──────────────────────────────────────────────────────────────

  async navigate(): Promise<void> {
    await this.page.goto(this.url);
    await this.expectPageLoaded();
  }

  // ── Product Actions ─────────────────────────────────────────────────────────

  /**
   * Add a product to the cart by its exact display name.
   * Waits for the Add to Cart button to change to Remove, confirming the add was registered.
   */
  async addToCartByName(productName: string): Promise<void> {
    logger.step('Adding product to cart', productName);
    const item = this.getInventoryItemByName(productName);
    await item.getByRole('button', { name: /add to cart/i }).click();
    // Confirm the item was added — button transitions to "Remove"
    await item.getByRole('button', { name: /remove/i }).waitFor({ state: 'visible' });
  }

  /**
   * Remove a product from the cart by its exact display name.
   */
  async removeFromCartByName(productName: string): Promise<void> {
    logger.step('Removing product from cart', productName);
    const item = this.getInventoryItemByName(productName);
    await item.getByRole('button', { name: /remove/i }).click();
  }

  /**
   * Click a product name to navigate to the product detail page.
   */
  async openProductByName(productName: string): Promise<void> {
    logger.step('Opening product detail', productName);
    await this.page.getByText(productName, { exact: true }).click();
  }

  // ── Sorting ─────────────────────────────────────────────────────────────────

  /**
   * Select a sort option from the dropdown.
   *
   * @param option - A SortOption key ('az' | 'za' | 'lohi' | 'hilo')
   */
  async sortBy(option: SortOption): Promise<void> {
    logger.step('Sorting products', option);
    await this.sortDropdown.selectOption(SortOptionValues[option]);
  }

  // ── Queries ─────────────────────────────────────────────────────────────────

  /**
   * Get all displayed product names in DOM order.
   */
  async getProductNames(): Promise<string[]> {
    const nameLocators = this.page.locator('[data-test="inventory-item-name"]');
    return nameLocators.allTextContents();
  }

  /**
   * Get all displayed product prices as numbers in DOM order.
   */
  async getProductPrices(): Promise<number[]> {
    const priceLocators = this.page.locator('[data-test="inventory-item-price"]');
    const texts = await priceLocators.allTextContents();
    return texts.map(parseCurrency);
  }

  /**
   * Get the current cart item count from the header badge.
   */
  async getCartCount(): Promise<number> {
    return this.header.getCartCount();
  }

  /**
   * Get the number of product cards displayed on the page.
   */
  async getProductCount(): Promise<number> {
    return this.productItems.count();
  }

  // ── Assertions ───────────────────────────────────────────────────────────────

  /**
   * Assert the inventory page has loaded correctly.
   */
  async expectPageLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/inventory/);
    await expect(this.pageTitle).toHaveText('Products');
    await expect(this.productList).toBeVisible();
  }

  /**
   * Assert that a product with the given name is visible on the inventory page.
   */
  async expectProductVisible(productName: string): Promise<void> {
    await expect(this.page.getByText(productName, { exact: true })).toBeVisible();
  }

  // ── Private helpers ──────────────────────────────────────────────────────────

  /**
   * Get the inventory item container that contains the given product name.
   * Used internally to scope button clicks to the correct product card.
   */
  private getInventoryItemByName(productName: string): Locator {
    return this.productItems.filter({ hasText: productName });
  }
}
