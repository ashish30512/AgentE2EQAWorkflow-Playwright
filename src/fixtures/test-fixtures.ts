/**
 * Playwright Test Fixtures
 * Custom fixtures for Page Objects and utilities
 */

import { test as base, Page } from '@playwright/test';
import {
  LoginPage,
  InventoryPage,
  CartPage,
  CheckoutPage,
} from '../pages';
import { APP_CONFIG } from '../config/app.config';

/**
 * Define custom fixtures
 */
type PageFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  setupBrowser: void;
};

/**
 * Create custom test with fixtures
 */
export const test = base.extend<PageFixtures>({
  /**
   * Fixture: Setup browser viewport and navigation
   */
  setupBrowser: [
    async ({ page }, use) => {
      // Before test
      await page.setViewportSize({
        width: APP_CONFIG.VIEWPORT_WIDTH,
        height: APP_CONFIG.VIEWPORT_HEIGHT,
      });
      
      // Use the fixture
      await use();
      
      // After test cleanup is handled by Playwright
    },
    { auto: true }, // Auto-run before each test
  ],

  /**
   * Fixture: LoginPage instance
   */
  loginPage: async ({ page, setupBrowser }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  /**
   * Fixture: InventoryPage instance
   */
  inventoryPage: async ({ page, setupBrowser }, use) => {
    const inventoryPage = new InventoryPage(page);
    await use(inventoryPage);
  },

  /**
   * Fixture: CartPage instance
   */
  cartPage: async ({ page, setupBrowser }, use) => {
    const cartPage = new CartPage(page);
    await use(cartPage);
  },

  /**
   * Fixture: CheckoutPage instance
   */
  checkoutPage: async ({ page, setupBrowser }, use) => {
    const checkoutPage = new CheckoutPage(page);
    await use(checkoutPage);
  },
});

export { expect } from '@playwright/test';
