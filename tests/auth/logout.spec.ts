/**
 * Logout Tests
 *
 * Covers FR-009: Logout
 * - Authenticated user can log out via the side menu
 * - After logout, user is redirected to the login page
 * - Inventory content is not accessible after logout
 *
 * Tags: @login @smoke @regression @P1
 */

import { expect, test } from '../../src/fixtures/test.fixture';
import { SideMenu } from '../../src/components/SideMenu';

test.describe('Authentication — Logout', () => {
  test(
    'should log out the user and redirect to the login page',
    {
      tag: ['@smoke', '@regression', '@login', '@P1'],
    },
    async ({ authenticatedInventoryPage: _authenticatedInventoryPage, page }) => {
      const sideMenu = new SideMenu(page);

      await sideMenu.logout();

      await expect(page).toHaveURL('/');
      await expect(page.locator('[data-test="login-button"]')).toBeVisible();
    },
  );

  test(
    'should not allow access to inventory after logout',
    {
      tag: ['@regression', '@login', '@P1'],
    },
    async ({ authenticatedInventoryPage: _authenticatedInventoryPage, page }) => {
      const sideMenu = new SideMenu(page);
      await sideMenu.logout();

      // Attempt to navigate directly to inventory
      await page.goto('/inventory.html');

      // Should be redirected back to login
      await expect(page).toHaveURL('/');
    },
  );

  test(
    'should open the side menu before logging out',
    {
      tag: ['@regression', '@login', '@P2'],
    },
    async ({ authenticatedInventoryPage: _authenticatedInventoryPage, page }) => {
      const sideMenu = new SideMenu(page);

      // Open menu and verify it appears before clicking logout
      await sideMenu.open();
      await expect(page.locator('[data-test="logout-sidebar-link"]')).toBeVisible();

      await sideMenu.logout();

      await expect(page).toHaveURL('/');
    },
  );
});
