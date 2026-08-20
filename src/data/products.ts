/**
 * Reference product data for SauceDemo.
 *
 * Used for assertions — e.g., confirming the correct product appears in the cart
 * or that product details match what was selected from inventory.
 *
 * Prices are stored as numbers (USD). Use helpers.formatCurrency() to display.
 */

import type { Product } from '@types-local/index';

export const products = {
  backpack: {
    name: 'Sauce Labs Backpack',
    description:
      'carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.',
    price: 29.99,
  } satisfies Product,

  bikeLight: {
    name: 'Sauce Labs Bike Light',
    description:
      "A red light isn't the desired state in testing but it sure helps when riding your bike at night. Water-resistant with 3 lighting modes, 1 AAA battery included.",
    price: 9.99,
  } satisfies Product,

  boltShirt: {
    name: 'Sauce Labs Bolt T-Shirt',
    description:
      'Get your testing superhero on with the Sauce Labs bolt T-shirt. From American Apparel, 100% ringspun combed cotton, heather gray with red bolt.',
    price: 15.99,
  } satisfies Product,

  fleeceJacket: {
    name: 'Sauce Labs Fleece Jacket',
    description:
      "It's not every day that you come across a midweight quarter-zip fleece jacket capable of handling everything from a relaxed stroll to a daily commute.",
    price: 49.99,
  } satisfies Product,

  onesie: {
    name: 'Sauce Labs Onesie',
    description:
      "Rib snap infant onesie for the junior automation engineer in development. Reinforced 3-snap bottom closure, two-needle hemmed sleeved and bottom won't unravel.",
    price: 7.99,
  } satisfies Product,

  redShirt: {
    name: 'Test.allTheThings() T-Shirt (Red)',
    description:
      'This classic Unisex crew-neck runs middle-to-large in size. An everyday essential!',
    price: 15.99,
  } satisfies Product,
} as const;

/** All products as an array — useful for inventory verification. */
export const allProducts = Object.values(products);

/** All product names — used for sorting assertion helpers. */
export const allProductNames = allProducts.map((p) => p.name);

/** All product prices — used for price sorting assertions. */
export const allProductPrices = allProducts.map((p) => p.price);
