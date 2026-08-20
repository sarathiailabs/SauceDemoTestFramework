/**
 * SideMenu Component
 *
 * Represents the hamburger navigation menu available on authenticated pages.
 * Encapsulates open, logout, reset app state, and close operations.
 */

import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

export class SideMenu {
  private readonly menuButton: Locator;
  private readonly closeButton: Locator;
  private readonly logoutLink: Locator;
  private readonly resetLink: Locator;
  private readonly allItemsLink: Locator;
  private readonly aboutLink: Locator;

  constructor(private readonly page: Page) {
    // SauceDemo uses react-burger-menu — buttons have accessible names set by the library
    this.menuButton = page.getByRole('button', { name: 'Open Menu' });
    this.closeButton = page.getByRole('button', { name: 'Close Menu' });
    this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
    this.resetLink = page.locator('[data-test="reset-sidebar-link"]');
    this.allItemsLink = page.locator('[data-test="inventory-sidebar-link"]');
    this.aboutLink = page.locator('[data-test="about-sidebar-link"]');
  }

  /**
   * Open the side navigation menu.
   * Idempotent — does nothing if the menu is already open.
   *
   * NOTE: react-burger-menu slides via CSS transform, NOT display:none / visibility:hidden.
   * isVisible() returns true even when the panel is off-screen, so we must use
   * getBoundingClientRect() to check whether the link is actually within the viewport.
   */
  async open(): Promise<void> {
    const isOpen = await this.logoutLink.evaluate((el) => {
      const { top, left, bottom, right } = el.getBoundingClientRect();
      return (
        top >= 0 &&
        left >= 0 &&
        bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    });

    if (!isOpen) {
      await this.menuButton.click();
      // Wait until slide-in animation fully completes before returning
      await expect(this.logoutLink).toBeInViewport();
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
