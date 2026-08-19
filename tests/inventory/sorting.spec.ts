/**
 * Product Sorting Tests
 *
 * Covers FR-003: Product Sorting
 * - Sort A→Z: product names are in ascending alphabetical order
 * - Sort Z→A: product names are in descending alphabetical order
 * - Sort Low→High: product prices are in ascending order
 * - Sort High→Low: product prices are in descending order
 *
 * Tests validate the ACTUAL displayed order, not just the dropdown value.
 *
 * Tags: @inventory @regression @P2
 */

import { test, expect } from '../../src/fixtures/test.fixture';
import { isSortedNumbers, isSortedStrings } from '../../src/utils/helpers';

test.describe('Inventory — Product Sorting', () => {
  test(
    'should sort products alphabetically from A to Z',
    {
      tag: ['@regression', '@inventory', '@P2'],
    },
    async ({ authenticatedInventoryPage }) => {
      await authenticatedInventoryPage.sortBy('az');

      const names = await authenticatedInventoryPage.getProductNames();

      expect(isSortedStrings(names, 'asc')).toBe(true);
    },
  );

  test(
    'should sort products alphabetically from Z to A',
    {
      tag: ['@regression', '@inventory', '@P2'],
    },
    async ({ authenticatedInventoryPage }) => {
      await authenticatedInventoryPage.sortBy('za');

      const names = await authenticatedInventoryPage.getProductNames();

      expect(isSortedStrings(names, 'desc')).toBe(true);
    },
  );

  test(
    'should sort products by price from low to high',
    {
      tag: ['@regression', '@inventory', '@P2'],
    },
    async ({ authenticatedInventoryPage }) => {
      await authenticatedInventoryPage.sortBy('lohi');

      const prices = await authenticatedInventoryPage.getProductPrices();

      expect(isSortedNumbers(prices, 'asc')).toBe(true);
    },
  );

  test(
    'should sort products by price from high to low',
    {
      tag: ['@regression', '@inventory', '@P2'],
    },
    async ({ authenticatedInventoryPage }) => {
      await authenticatedInventoryPage.sortBy('hilo');

      const prices = await authenticatedInventoryPage.getProductPrices();

      expect(isSortedNumbers(prices, 'desc')).toBe(true);
    },
  );

  test(
    'should display all products after changing sort order multiple times',
    {
      tag: ['@regression', '@inventory', '@P2'],
    },
    async ({ authenticatedInventoryPage }) => {
      await authenticatedInventoryPage.sortBy('za');
      await authenticatedInventoryPage.sortBy('lohi');
      await authenticatedInventoryPage.sortBy('az');

      const count = await authenticatedInventoryPage.getProductCount();
      expect(count).toBe(6);
    },
  );
});
