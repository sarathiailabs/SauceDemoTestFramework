/**
 * Smoke Test Suite
 *
 * Validates the primary business journey end-to-end:
 *   Login → Inventory → Add Product → Cart → Checkout → Order Confirmation
 *
 * This suite is designed to run on every pull request and must complete quickly.
 * It tests the most critical path only — detailed edge cases live in the regression suite.
 *
 * Tags: @smoke @P0 @critical
 */

import { test, expect } from '@fixtures/test.fixture';
import { users } from '@data/users';
import { products } from '@data/products';
import { validCheckoutData } from '@data/checkout';

test.describe('Smoke Suite — Primary Business Journey', () => {
  test(
    'should complete the full purchase journey from login to order confirmation',
    {
      tag: ['@smoke', '@P0', '@critical'],
    },
    async ({
      loginPage,
      inventoryPage,
      cartPage,
      checkoutInformationPage,
      checkoutOverviewPage,
      checkoutCompletePage,
      page,
    }) => {
      // ── Step 1: Navigate to the application ────────────────────────────────
      await loginPage.navigate();
      await loginPage.expectPageLoaded();

      // ── Step 2: Login as standard_user ─────────────────────────────────────
      await loginPage.login(users.standard);
      await expect(page).toHaveURL(/inventory/);

      // ── Step 3: Verify inventory page is displayed ─────────────────────────
      await inventoryPage.expectPageLoaded();
      const productCount = await inventoryPage.getProductCount();
      expect(productCount).toBeGreaterThan(0);

      // ── Step 4: Add a product to the cart ─────────────────────────────────
      await inventoryPage.addToCartByName(products.backpack.name);
      const cartCount = await inventoryPage.getCartCount();
      expect(cartCount).toBe(1);

      // ── Step 5: Open the shopping cart ────────────────────────────────────
      await inventoryPage.header.goToCart();
      await cartPage.expectPageLoaded();
      await cartPage.expectItemInCart(products.backpack.name);

      // ── Step 6: Proceed to checkout ────────────────────────────────────────
      await cartPage.proceedToCheckout();
      await checkoutInformationPage.expectPageLoaded();

      // ── Step 7: Enter customer information ────────────────────────────────
      await checkoutInformationPage.fillAndContinue(validCheckoutData);
      await checkoutOverviewPage.expectPageLoaded();

      // ── Step 8: Verify order overview ─────────────────────────────────────
      await checkoutOverviewPage.expectItemInOverview(products.backpack.name);
      await checkoutOverviewPage.expectSummaryVisible();

      const summary = await checkoutOverviewPage.getSummary();
      expect(summary.itemTotal).toBe(products.backpack.price);
      expect(summary.total).toBeCloseTo(summary.itemTotal + summary.tax, 2);

      // ── Step 9: Complete the order ─────────────────────────────────────────
      await checkoutOverviewPage.finish();
      await checkoutCompletePage.expectPageLoaded();

      // ── Step 10: Verify order confirmation ────────────────────────────────
      await checkoutCompletePage.expectOrderConfirmed();
    },
  );

  test(
    'should deny login for invalid credentials',
    {
      tag: ['@smoke', '@P0'],
    },
    async ({ loginPage }) => {
      await loginPage.navigate();
      await loginPage.loginWithCredentials('invalid_user', 'wrong_password');

      await loginPage.expectErrorMessage(
        'Epic sadface: Username and password do not match any user',
      );
    },
  );

  test(
    'should display the inventory page with products after login',
    {
      tag: ['@smoke', '@P0'],
    },
    async ({ loginPage, inventoryPage }) => {
      await loginPage.navigate();
      await loginPage.login(users.standard);

      await inventoryPage.expectPageLoaded();
      const count = await inventoryPage.getProductCount();
      expect(count).toBe(6);
    },
  );
});
