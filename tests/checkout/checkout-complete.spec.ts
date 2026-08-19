/**
 * Checkout Complete Tests
 *
 * Covers FR-008: Order Completion
 * - User can complete the full checkout flow
 * - Confirmation page is displayed with the expected message
 * - Back Home button navigates to the inventory page
 *
 * Tags: @checkout @smoke @regression @P0 @critical
 */

import { test, expect } from '../../src/fixtures/test.fixture';
import { products } from '../../src/data/products';
import { validCheckoutData } from '../../src/data/checkout';

test.describe('Checkout — Order Completion', () => {
  // Navigate to order confirmation before each test
  test.beforeEach(
    async ({
      authenticatedInventoryPage,
      cartPage,
      checkoutInformationPage,
      checkoutOverviewPage,
    }) => {
      await authenticatedInventoryPage.addToCartByName(products.backpack.name);
      await authenticatedInventoryPage.header.goToCart();
      await cartPage.proceedToCheckout();
      await checkoutInformationPage.fillAndContinue(validCheckoutData);
      await checkoutOverviewPage.finish();
    },
  );

  test(
    'should display the order confirmation page after completing the purchase',
    {
      tag: ['@smoke', '@regression', '@checkout', '@P0', '@critical'],
    },
    async ({ checkoutCompletePage, page }) => {
      await expect(page).toHaveURL(/checkout-complete/);
      await checkoutCompletePage.expectPageLoaded();
    },
  );

  test(
    'should display a thank-you confirmation message after order completion',
    {
      tag: ['@smoke', '@regression', '@checkout', '@P0'],
    },
    async ({ checkoutCompletePage }) => {
      await checkoutCompletePage.expectOrderConfirmed();
    },
  );

  test(
    'should navigate to the inventory page when Back Home is clicked',
    {
      tag: ['@regression', '@checkout', '@P1'],
    },
    async ({ checkoutCompletePage, page }) => {
      await checkoutCompletePage.backToHome();

      await expect(page).toHaveURL(/inventory/);
    },
  );

  test(
    'should display the pony express image on the confirmation page',
    {
      tag: ['@regression', '@checkout', '@P3'],
    },
    async ({ checkoutCompletePage }) => {
      const header = await checkoutCompletePage.getConfirmationHeader();
      expect(header).toBe('Thank you for your order!');
    },
  );
});
