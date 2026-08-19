/**
 * Generic utility helpers for the SauceDemo test framework.
 *
 * These are pure, stateless functions that don't represent any specific page.
 * Keep them focused — only add helpers that are actually reused across tests.
 */

/**
 * Parse a currency string like "$29.99" and return the numeric value.
 * @example parseCurrency('$29.99') // → 29.99
 */
export function parseCurrency(value: string): number {
  const parsed = parseFloat(value.replace(/[^0-9.-]/g, ''));
  if (isNaN(parsed)) {
    throw new Error(`[helpers] parseCurrency: Cannot parse "${value}" as a number.`);
  }
  return parsed;
}

/**
 * Format a number as a USD currency string.
 * @example formatCurrency(29.99) // → '$29.99'
 */
export function formatCurrency(value: number): string {
  return `$${value.toFixed(2)}`;
}

/**
 * Sort an array of strings in ascending (A→Z) or descending (Z→A) order.
 * Returns a new array — does not mutate the original.
 */
export function sortStrings(values: string[], direction: 'asc' | 'desc'): string[] {
  return [...values].sort((a, b) => {
    const cmp = a.localeCompare(b);
    return direction === 'asc' ? cmp : -cmp;
  });
}

/**
 * Sort an array of numbers in ascending (low→high) or descending (high→low) order.
 * Returns a new array — does not mutate the original.
 */
export function sortNumbers(values: number[], direction: 'asc' | 'desc'): number[] {
  return [...values].sort((a, b) => (direction === 'asc' ? a - b : b - a));
}

/**
 * Check whether an array of strings is sorted in the given direction.
 * Useful for asserting product sort order without re-sorting in tests.
 */
export function isSortedStrings(values: string[], direction: 'asc' | 'desc'): boolean {
  for (let i = 0; i < values.length - 1; i++) {
    const cmp = values[i].localeCompare(values[i + 1]);
    if (direction === 'asc' && cmp > 0) return false;
    if (direction === 'desc' && cmp < 0) return false;
  }
  return true;
}

/**
 * Check whether an array of numbers is sorted in the given direction.
 */
export function isSortedNumbers(values: number[], direction: 'asc' | 'desc'): boolean {
  for (let i = 0; i < values.length - 1; i++) {
    if (direction === 'asc' && values[i] > values[i + 1]) return false;
    if (direction === 'desc' && values[i] < values[i + 1]) return false;
  }
  return true;
}

/**
 * Generate a random alphanumeric string of the specified length.
 * Useful for generating unique test data identifiers at runtime.
 */
export function randomString(length = 8): string {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length);
}
