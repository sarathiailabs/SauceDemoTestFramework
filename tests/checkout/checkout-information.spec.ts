/**
 * Checkout Information Tests
 *
 * Covers FR-006: Checkout Information Form
 * - Required field validation (firstName, lastName, postalCode)
 * - Valid information allows proceeding to checkout overview
 * - Validation error messages are correct
 *
 * Tags: @checkout @regression @negative @P1
 */

import { test, expect } from '../../src/fixtures/test.fixture';
import { products } from '../../src/data/products';
import {
  checkoutValidationCases,
  validCheckoutData,
  allFieldsEmpty,
} from '../../src/data/checkout';

test.describe('Checkout — Information Form', () => {
  // Navigate to checkout information page before each test
  test.beforeEach(async ({ authenticatedInventoryPage, cartPage }) => {
    await authenticatedInventoryPage.addToCartByName(products.backpack.name);
    await authenticatedInventoryPage.header.goToCart();
    await cartPage.proceedToCheckout();
  });

  // ── Happy Path ──────────────────────────────────────────────────────────────

  test(
    'should accept valid checkout information and proceed to the overview page',
    {
      tag: ['@regression', '@checkout', '@P1'],
    },
    async ({ checkoutInformationPage, page }) => {
      await checkoutInformationPage.fillAndContinue(validCheckoutData);

      await expect(page).toHaveURL(/checkout-step-two/);
    },
  );

  // ── Validation — data-driven ─────────────────────────────────────────────────

  for (const { data, description, expectedError } of checkoutValidationCases) {
    test(
      `should display a validation error for ${description}`,
      {
        tag: ['@regression', '@checkout', '@negative', '@P1'],
      },
      async ({ checkoutInformationPage }) => {
        await checkoutInformationPage.fillForm(data);
        await checkoutInformationPage.continue();

        await checkoutInformationPage.expectErrorMessage(expectedError);
      },
    );
  }

  // ── All Fields Empty ────────────────────────────────────────────────────────

  test(
    'should display a validation error when all checkout fields are empty',
    {
      tag: ['@regression', '@checkout', '@negative', '@P1'],
    },
    async ({ checkoutInformationPage }) => {
      await checkoutInformationPage.fillForm(allFieldsEmpty);
      await checkoutInformationPage.continue();

      // First field validation fires first
      await checkoutInformationPage.expectErrorMessage('Error: First Name is required');
    },
  );

  // ── Checkout Page Elements ──────────────────────────────────────────────────

  test(
    'should display all required form fields on the checkout information page',
    {
      tag: ['@regression', '@checkout', '@P2'],
    },
    async ({ checkoutInformationPage }) => {
      await checkoutInformationPage.expectPageLoaded();
    },
  );

  // ── Error Dismissal ─────────────────────────────────────────────────────────

  test(
    'should dismiss the validation error message when the close button is clicked',
    {
      tag: ['@regression', '@checkout', '@P3'],
    },
    async ({ checkoutInformationPage }) => {
      await checkoutInformationPage.continue();
      await checkoutInformationPage.expectErrorMessage('Error: First Name is required');

      await checkoutInformationPage.dismissError();

      await checkoutInformationPage.expectNoError();
    },
  );
});
