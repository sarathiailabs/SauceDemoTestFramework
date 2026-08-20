/**
 * Shopping Cart Tests
 *
 * Covers FR-005: Shopping Cart
 * - Selected products appear in the cart
 * - Correct product name, price, and quantity shown
 * - Product can be removed
 * - Continue Shopping returns to inventory
 * - Proceed to Checkout navigates to checkout info page
 * - Empty cart behavior
 *
 * Tags: @cart @smoke @regression @P0 @P1
 */

import { test, expect } from '@fixtures/test.fixture';
import { products } from '@data/products';

test.describe('Shopping Cart', () => {
  test(
    'should display the product added from the inventory page',
    {
      tag: ['@smoke', '@regression', '@cart', '@P0', '@critical'],
    },
    async ({ authenticatedInventoryPage, cartPage }) => {
      await authenticatedInventoryPage.addToCartByName(products.backpack.name);
      await authenticatedInventoryPage.header.goToCart();

      await cartPage.expectPageLoaded();
      await cartPage.expectItemInCart(products.backpack.name);
    },
  );

  test(
    'should display the correct product name in the cart',
    {
      tag: ['@regression', '@cart', '@P1'],
    },
    async ({ authenticatedInventoryPage, cartPage }) => {
      await authenticatedInventoryPage.addToCartByName(products.backpack.name);
      await authenticatedInventoryPage.header.goToCart();

      const names = await cartPage.getItemNames();
      expect(names).toContain(products.backpack.name);
    },
  );

  test(
    'should display the correct product price in the cart',
    {
      tag: ['@regression', '@cart', '@P1'],
    },
    async ({ authenticatedInventoryPage, cartPage }) => {
      await authenticatedInventoryPage.addToCartByName(products.backpack.name);
      await authenticatedInventoryPage.header.goToCart();

      const prices = await cartPage.getItemPrices();
      expect(prices).toContain(products.backpack.price);
    },
  );

  test(
    'should display multiple products when multiple items have been added',
    {
      tag: ['@regression', '@cart', '@P1'],
    },
    async ({ authenticatedInventoryPage, cartPage }) => {
      await authenticatedInventoryPage.addToCartByName(products.backpack.name);
      await authenticatedInventoryPage.addToCartByName(products.bikeLight.name);
      await authenticatedInventoryPage.header.goToCart();

      await cartPage.expectItemCount(2);
      await cartPage.expectItemInCart(products.backpack.name);
      await cartPage.expectItemInCart(products.bikeLight.name);
    },
  );

  test(
    'should remove a product from the cart',
    {
      tag: ['@regression', '@cart', '@P1'],
    },
    async ({ authenticatedInventoryPage, cartPage }) => {
      await authenticatedInventoryPage.addToCartByName(products.backpack.name);
      await authenticatedInventoryPage.header.goToCart();

      await cartPage.removeItem(products.backpack.name);

      await cartPage.expectItemNotInCart(products.backpack.name);
      await cartPage.expectCartEmpty();
    },
  );

  test(
    'should update the cart badge after removing an item',
    {
      tag: ['@regression', '@cart', '@P1'],
    },
    async ({ authenticatedInventoryPage, cartPage }) => {
      await authenticatedInventoryPage.addToCartByName(products.backpack.name);
      await authenticatedInventoryPage.addToCartByName(products.bikeLight.name);
      await authenticatedInventoryPage.header.goToCart();

      await cartPage.removeItem(products.backpack.name);

      const count = await cartPage.header.getCartCount();
      expect(count).toBe(1);
    },
  );

  test(
    'should navigate back to the inventory page when Continue Shopping is clicked',
    {
      tag: ['@regression', '@cart', '@P1'],
    },
    async ({ authenticatedInventoryPage, cartPage, page }) => {
      await authenticatedInventoryPage.addToCartByName(products.backpack.name);
      await authenticatedInventoryPage.header.goToCart();

      await cartPage.continueShopping();

      await expect(page).toHaveURL(/inventory/);
    },
  );

  test(
    'should navigate to the checkout information page when Checkout is clicked',
    {
      tag: ['@regression', '@cart', '@P1'],
    },
    async ({ authenticatedInventoryPage, cartPage, page }) => {
      await authenticatedInventoryPage.addToCartByName(products.backpack.name);
      await authenticatedInventoryPage.header.goToCart();

      await cartPage.proceedToCheckout();

      await expect(page).toHaveURL(/checkout-step-one/);
    },
  );

  test(
    'should display an empty cart when no products have been added',
    {
      tag: ['@regression', '@cart', '@P2'],
    },
    async ({ authenticatedInventoryPage, cartPage }) => {
      await authenticatedInventoryPage.header.goToCart();

      await cartPage.expectCartEmpty();
    },
  );
});
