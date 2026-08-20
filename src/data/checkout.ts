/**
 * Checkout test data for SauceDemo.
 *
 * Centralized here so the same data set can be reused across checkout tests
 * without repetition. Add new data sets for edge-case coverage.
 */

import type { CheckoutData } from '@types-local/index';

/** Valid checkout information — passes all form validation. */
export const validCheckoutData: CheckoutData = {
  firstName: 'Jane',
  lastName: 'Doe',
  postalCode: '10001',
};

/** Alternative valid checkout set — useful when two checkout tests run in parallel. */
export const alternateCheckoutData: CheckoutData = {
  firstName: 'John',
  lastName: 'Smith',
  postalCode: '90210',
};

/** Checkout data with empty first name — triggers validation error. */
export const missingFirstName: CheckoutData = {
  firstName: '',
  lastName: 'Doe',
  postalCode: '10001',
};

/** Checkout data with empty last name — triggers validation error. */
export const missingLastName: CheckoutData = {
  firstName: 'Jane',
  lastName: '',
  postalCode: '10001',
};

/** Checkout data with empty postal code — triggers validation error. */
export const missingPostalCode: CheckoutData = {
  firstName: 'Jane',
  lastName: 'Doe',
  postalCode: '',
};

/** All fields empty — triggers all validation errors. */
export const allFieldsEmpty: CheckoutData = {
  firstName: '',
  lastName: '',
  postalCode: '',
};

/** Data-driven negative test cases for checkout validation. */
export const checkoutValidationCases = [
  {
    data: missingFirstName,
    description: 'empty first name',
    expectedError: 'Error: First Name is required',
  },
  {
    data: missingLastName,
    description: 'empty last name',
    expectedError: 'Error: Last Name is required',
  },
  {
    data: missingPostalCode,
    description: 'empty postal code',
    expectedError: 'Error: Postal Code is required',
  },
] as const;
