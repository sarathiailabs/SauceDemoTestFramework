/**
 * SideMenu Component
 *
 * Represents the hamburger navigation menu available on authenticated pages.
 * Encapsulates open, logout, reset app state, and close operations.
 */

import type { Locator, Page } from '@playwright/test';

export class SideMenu {
  private readonly menuButton: Locator;
  private readonly closeButton: Locator;
  private readonly logoutLink: Locator;
  private readonly resetLink: Locator;
  private readonly allItemsLink: Locator;
  private readonly aboutLink: Locator;

  constructor(private readonly page: Page) {
    // SauceDemo uses specific IDs for the burger menu buttons
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.closeButton = page.locator('#react-burger-cross-btn');
    this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
    this.resetLink = page.locator('[data-test="reset-sidebar-link"]');
    this.allItemsLink = page.locator('[data-test="inventory-sidebar-link"]');
    this.aboutLink = page.locator('[data-test="about-sidebar-link"]');
  }

  /**
   * Open the side navigation menu.
   * Idempotent — does nothing if the menu is already open.
   */
  async open(): Promise<void> {
    const isAlreadyOpen = await this.logoutLink.isVisible();
    if (!isAlreadyOpen) {
      await this.menuButton.click();
      // Wait for menu to be visible
      await this.logoutLink.waitFor({ state: 'visible' });
    }
  }

  /**
   * Close the side navigation menu.
   */
  async close(): Promise<void> {
    await this.closeButton.click();
    await this.logoutLink.waitFor({ state: 'hidden' });
  }

  /**
   * Log out the current user and navigate to the login page.
   */
  async logout(): Promise<void> {
    await this.open();
    await this.logoutLink.click();
  }

  /**
   * Reset the app state (clears cart, resets sort order, etc.).
   * Useful for test cleanup without a full page reload.
   */
  async resetAppState(): Promise<void> {
    await this.open();
    await this.resetLink.click();
    await this.close();
  }

  /**
   * Navigate to the All Items (inventory) page from the menu.
   */
  async goToAllItems(): Promise<void> {
    await this.open();
    await this.allItemsLink.click();
  }

  /**
   * Navigate to the About page.
   */
  async goToAbout(): Promise<void> {
    await this.open();
    await this.aboutLink.click();
  }
}
