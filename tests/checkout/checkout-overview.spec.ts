/**
 * Checkout Overview Tests
 *
 * Covers FR-007: Checkout Overview
 * - Correct product, price, tax, and total displayed
 * - Cancel navigates away from overview
 *
 * Tags: @checkout @regression @P1
 */

import { test, expect } from '@fixtures/test.fixture';
import { products } from '@data/products';
import { validCheckoutData } from '@data/checkout';

test.describe('Checkout — Order Overview', () => {
  // Navigate to checkout overview before each test
  test.beforeEach(async ({ authenticatedInventoryPage, cartPage, checkoutInformationPage }) => {
    await authenticatedInventoryPage.addToCartByName(products.backpack.name);
    await authenticatedInventoryPage.header.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutInformationPage.fillAndContinue(validCheckoutData);
  });

  test(
    'should display the checkout overview page after valid information is submitted',
    {
      tag: ['@regression', '@checkout', '@P1'],
    },
    async ({ checkoutOverviewPage }) => {
      await checkoutOverviewPage.expectPageLoaded();
    },
  );

  test(
    'should display the selected product in the order overview',
    {
      tag: ['@regression', '@checkout', '@P1'],
    },
    async ({ checkoutOverviewPage }) => {
      await checkoutOverviewPage.expectItemInOverview(products.backpack.name);
    },
  );

  test(
    'should display the item total, tax, and grand total in the overview',
    {
      tag: ['@regression', '@checkout', '@P1'],
    },
    async ({ checkoutOverviewPage }) => {
      await checkoutOverviewPage.expectSummaryVisible();

      const summary = await checkoutOverviewPage.getSummary();

      expect(summary.itemTotal).toBeGreaterThan(0);
      expect(summary.tax).toBeGreaterThan(0);
      expect(summary.total).toBeGreaterThan(summary.itemTotal);
    },
  );

  test(
    'should display a grand total equal to item total plus tax',
    {
      tag: ['@regression', '@checkout', '@P1'],
    },
    async ({ checkoutOverviewPage }) => {
      const summary = await checkoutOverviewPage.getSummary();

      // Allow floating point tolerance
      expect(summary.total).toBeCloseTo(summary.itemTotal + summary.tax, 2);
    },
  );

  test(
    'should display the correct item price for the added product',
    {
      tag: ['@regression', '@checkout', '@P2'],
    },
    async ({ checkoutOverviewPage }) => {
      const summary = await checkoutOverviewPage.getSummary();
      expect(summary.itemTotal).toBe(products.backpack.price);
    },
  );

  test(
    'should navigate away from the overview when Cancel is clicked',
    {
      tag: ['@regression', '@checkout', '@P2'],
    },
    async ({ checkoutOverviewPage, page }) => {
      await checkoutOverviewPage.cancel();

      // Cancel on overview goes back to inventory per SauceDemo behavior
      await expect(page).not.toHaveURL(/checkout-step-two/);
    },
  );
});
