/**
 * Product Details Tests
 *
 * Covers FR-004: Product Details Page
 * - Product details page displays correct information
 * - Product from inventory matches the product detail page
 * - Add/remove from cart on detail page
 * - Back navigation returns to inventory
 *
 * Tags: @product @regression @P1
 */

import { test, expect } from '@fixtures/test.fixture';
import { products } from '@data/products';

test.describe('Inventory — Product Details', () => {
  test(
    'should display the correct product name on the detail page',
    {
      tag: ['@regression', '@product', '@P1'],
    },
    async ({ authenticatedInventoryPage, productPage }) => {
      await authenticatedInventoryPage.openProductByName(products.backpack.name);

      await productPage.expectPageLoaded();
      await productPage.expectProductName(products.backpack.name);
    },
  );

  test(
    'should display the product description on the detail page',
    {
      tag: ['@regression', '@product', '@P1'],
    },
    async ({ authenticatedInventoryPage, productPage }) => {
      await authenticatedInventoryPage.openProductByName(products.backpack.name);

      const description = await productPage.getDescription();
      expect(description.length).toBeGreaterThan(0);
    },
  );

  test(
    'should display the correct product price on the detail page',
    {
      tag: ['@regression', '@product', '@P1'],
    },
    async ({ authenticatedInventoryPage, productPage }) => {
      await authenticatedInventoryPage.openProductByName(products.backpack.name);

      const price = await productPage.getPrice();
      expect(price).toBe(products.backpack.price);
    },
  );

  test(
    'should show the Add to Cart button when the product is not in the cart',
    {
      tag: ['@regression', '@product', '@P1'],
    },
    async ({ authenticatedInventoryPage, productPage }) => {
      await authenticatedInventoryPage.openProductByName(products.backpack.name);

      await productPage.expectAddToCartVisible();
    },
  );

  test(
    'should add the product to the cart from the detail page',
    {
      tag: ['@regression', '@product', '@P1'],
    },
    async ({ authenticatedInventoryPage, productPage }) => {
      await authenticatedInventoryPage.openProductByName(products.backpack.name);

      await productPage.addToCart();

      await productPage.expectRemoveVisible();
      const cartCount = await productPage.header.getCartCount();
      expect(cartCount).toBe(1);
    },
  );

  test(
    'should remove the product from the cart on the detail page',
    {
      tag: ['@regression', '@product', '@P1'],
    },
    async ({ authenticatedInventoryPage, productPage }) => {
      await authenticatedInventoryPage.openProductByName(products.backpack.name);
      await productPage.addToCart();

      await productPage.removeFromCart();

      await productPage.expectAddToCartVisible();
      const cartCount = await productPage.header.getCartCount();
      expect(cartCount).toBe(0);
    },
  );

  test(
    'should navigate back to the inventory page using the back button',
    {
      tag: ['@regression', '@product', '@P1'],
    },
    async ({ authenticatedInventoryPage, page }) => {
      await authenticatedInventoryPage.openProductByName(products.backpack.name);

      await page.locator('[data-test="back-to-products"]').click();

      await expect(page).toHaveURL(/inventory\.html/);
    },
  );

  test(
    'should display matching product details for a different product (Bike Light)',
    {
      tag: ['@regression', '@product', '@P2'],
    },
    async ({ authenticatedInventoryPage, productPage }) => {
      await authenticatedInventoryPage.openProductByName(products.bikeLight.name);

      await productPage.expectProductName(products.bikeLight.name);
      const price = await productPage.getPrice();
      expect(price).toBe(products.bikeLight.price);
    },
  );
});
