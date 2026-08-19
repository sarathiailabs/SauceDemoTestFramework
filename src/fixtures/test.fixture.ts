/**
 * Custom Test Fixtures
 *
 * Extends Playwright's base `test` to inject initialized page objects into tests.
 * All tests should import `test` and `expect` from this file — NOT from '@playwright/test'.
 *
 * Design decisions:
 * - Each page object is instantiated per-test (fresh page per test = isolation).
 * - `authenticatedPage` fixture logs in as standard_user before the test body runs.
 *   Tests needing a different user should use `loginPage` directly.
 * - The fixture only provides page objects — business logic stays in tests.
 * - No teardown needed; Playwright closes the browser context after each test.
 *
 * Usage:
 *   import { test, expect } from '../fixtures/test.fixture';
 *
 *   test('example', async ({ inventoryPage }) => {
 *     await inventoryPage.navigate();
 *     ...
 *   });
 */

import { test as base } from '@playwright/test';
import { users } from '../data/users.js';
import { CartPage } from '../pages/CartPage.js';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage.js';
import { CheckoutInformationPage } from '../pages/CheckoutInformationPage.js';
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage.js';
import { InventoryPage } from '../pages/InventoryPage.js';
import { LoginPage } from '../pages/LoginPage.js';
import { ProductPage } from '../pages/ProductPage.js';
import { logger } from '../utils/logger.js';

// ── Fixture type definitions ─────────────────────────────────────────────────

type PageObjects = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  productPage: ProductPage;
  cartPage: CartPage;
  checkoutInformationPage: CheckoutInformationPage;
  checkoutOverviewPage: CheckoutOverviewPage;
  checkoutCompletePage: CheckoutCompletePage;
};

type AuthenticatedFixtures = {
  /**
   * Provides an already-authenticated InventoryPage.
   * The standard_user is logged in before the test body runs.
   * Use this fixture for any test that starts from the inventory page.
   */
  authenticatedInventoryPage: InventoryPage;
};

type SauceFixtures = PageObjects & AuthenticatedFixtures;

// ── Extended test ─────────────────────────────────────────────────────────────

export const test = base.extend<SauceFixtures>({
  // ── Page object fixtures ───────────────────────────────────────────────────
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },

  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkoutInformationPage: async ({ page }, use) => {
    await use(new CheckoutInformationPage(page));
  },

  checkoutOverviewPage: async ({ page }, use) => {
    await use(new CheckoutOverviewPage(page));
  },

  checkoutCompletePage: async ({ page }, use) => {
    await use(new CheckoutCompletePage(page));
  },

  // ── Authenticated page fixture ─────────────────────────────────────────────
  authenticatedInventoryPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    logger.testStart('Setup: Authenticating as standard_user', users.standard.username);
    await loginPage.navigate();
    await loginPage.login(users.standard);
    await inventoryPage.expectPageLoaded();

    await use(inventoryPage);
  },
});

// Re-export expect so tests only need one import
export { expect } from '@playwright/test';
