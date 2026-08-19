/**
 * Shared TypeScript types and interfaces for the SauceDemo test framework.
 *
 * All types live here to ensure consistency across pages, fixtures, and tests.
 */

// ── User ─────────────────────────────────────────────────────────────────────

export type UserType =
  | 'standard_user'
  | 'locked_out_user'
  | 'problem_user'
  | 'performance_glitch_user'
  | 'error_user'
  | 'visual_user';

export interface User {
  username: UserType | string;
  password: string;
  /** Human-readable description used for test naming and logging */
  description: string;
}

// ── Product ──────────────────────────────────────────────────────────────────

export interface Product {
  name: string;
  description: string;
  price: number;
}

export interface CartItem {
  name: string;
  price: number;
  quantity: number;
}

// ── Sorting ───────────────────────────────────────────────────────────────────

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

export const SortOptionValues: Record<SortOption, string> = {
  az: 'az',
  za: 'za',
  lohi: 'lohi',
  hilo: 'hilo',
};

// ── Checkout ──────────────────────────────────────────────────────────────────

export interface CheckoutData {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export interface CheckoutSummary {
  itemTotal: number;
  tax: number;
  total: number;
}

// ── Environment ───────────────────────────────────────────────────────────────

export type TestEnvironment = 'qa' | 'staging' | 'production';
