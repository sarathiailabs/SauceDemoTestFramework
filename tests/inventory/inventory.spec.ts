/**
 * Inventory Tests
 *
 * Covers FR-002: Inventory Page
 * - Page loads after login
 * - All 6 products are displayed with name, price, and image
 * - Add to cart and remove from cart
 * - Cart badge updates correctly
 *
 * Tags: @inventory @smoke @regression @P0 @P1
 */

import { expect, test } from '@fixtures/test.fixture';
import { products } from '@data/products';

test.describe('Inventory — Product Listing', () => {
  test(
    'should display the inventory page after successful login',
    {
      tag: ['@smoke', '@regression', '@inventory', '@P0'],
    },
    async ({ authenticatedInventoryPage, page }) => {
      await authenticatedInventoryPage.expectPageLoaded();
      await expect(page).toHaveTitle(/Swag Labs/);
    },
  );

  test(
    'should display all 6 products on the inventory page',
    {
      tag: ['@regression', '@inventory', '@P1'],
    },
    async ({ authenticatedInventoryPage }) => {
      const count = await authenticatedInventoryPage.getProductCount();
      expect(count).toBe(6);
    },
  );

  test(
    'should display product names for all inventory items',
    {
      tag: ['@regression', '@inventory', '@P1'],
    },
    async ({ authenticatedInventoryPage }) => {
      const names = await authenticatedInventoryPage.getProductNames();

      expect(names).toContain(products.backpack.name);
      expect(names).toContain(products.bikeLight.name);
      expect(names).toContain(products.boltShirt.name);
    },
  );

  test(
    'should display product prices for all inventory items',
    {
      tag: ['@regression', '@inventory', '@P1'],
    },
    async ({ authenticatedInventoryPage }) => {
      const prices = await authenticatedInventoryPage.getProductPrices();

      expect(prices.length).toBe(6);
      prices.forEach((price) => {
        expect(price).toBeGreaterThan(0);
      });
    },
  );

  test(
    'should add a product to the cart and update the cart badge',
    {
      tag: ['@smoke', '@regression', '@inventory', '@P0', '@critical'],
    },
    async ({ authenticatedInventoryPage }) => {
      await authenticatedInventoryPage.addToCartByName(products.backpack.name);

      const count = await authenticatedInventoryPage.getCartCount();
      expect(count).toBe(1);
    },
  );

  test(
    'should increment the cart badge count when multiple products are added',
    {
      tag: ['@regression', '@inventory', '@P1'],
    },
    async ({ authenticatedInventoryPage }) => {
      await authenticatedInventoryPage.addToCartByName(products.backpack.name);
      await authenticatedInventoryPage.addToCartByName(products.bikeLight.name);

      const count = await authenticatedInventoryPage.getCartCount();
      expect(count).toBe(2);
    },
  );

  test(
    'should remove a product from the cart and update the cart badge',
    {
      tag: ['@regression', '@inventory', '@P1'],
    },
    async ({ authenticatedInventoryPage }) => {
      // Add first
      await authenticatedInventoryPage.addToCartByName(products.backpack.name);
      expect(await authenticatedInventoryPage.getCartCount()).toBe(1);

      // Then remove
      await authenticatedInventoryPage.removeFromCartByName(products.backpack.name);
      expect(await authenticatedInventoryPage.getCartCount()).toBe(0);
    },
  );

  test(
    'should hide the cart badge when the cart is empty',
    {
      tag: ['@regression', '@inventory', '@P2'],
    },
    async ({ authenticatedInventoryPage }) => {
      const count = await authenticatedInventoryPage.getCartCount();
      expect(count).toBe(0);
    },
  );

  test(
    'should navigate to the product detail page when a product name is clicked',
    {
      tag: ['@regression', '@inventory', '@P1'],
    },
    async ({ authenticatedInventoryPage, page }) => {
      await authenticatedInventoryPage.openProductByName(products.backpack.name);

      await expect(page).toHaveURL(/inventory-item/);
    },
  );
});
