/**
 * Test Utilities and Helpers
 * Common functions used across tests
 */

import { Page } from '@playwright/test';
import { LoginPage, InventoryPage, CartPage, CheckoutPage } from '../pages';
import { UserCredentials, CheckoutFormData } from '../types';
import { TEST_CREDENTIALS, TIMEOUTS } from '../config/app.config';

/**
 * Authentication Helper
 */
export class AuthHelper {
  /**
   * Login with standard user credentials
   */
  static async loginAsStandardUser(page: Page): Promise<void> {
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
    await loginPage.loginAndNavigateToInventory(TEST_CREDENTIALS.STANDARD_USER);
  }

  /**
   * Login with custom credentials
   */
  static async loginWithCredentials(page: Page, credentials: UserCredentials): Promise<void> {
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
    await loginPage.loginAndNavigateToInventory(credentials);
  }

  /**
   * Login and expect error
   */
  static async loginExpectingError(page: Page, credentials: UserCredentials): Promise<string> {
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
    await loginPage.loginExpectError(credentials);
    return await loginPage.getErrorMessage();
  }
}

/**
 * Shopping Helper
 */
export class ShoppingHelper {
  /**
   * Add single product to cart
   */
  static async addProductToCart(page: Page, productId: string): Promise<void> {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addProductToCart(productId);
    // Wait for cart badge to update
    await page.waitForTimeout(300);
  }

  /**
   * Add multiple products to cart
   */
  static async addMultipleProductsToCart(page: Page, productIds: string[]): Promise<void> {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addMultipleProductsToCart(productIds);
  }

  /**
   * View cart
   */
  static async viewCart(page: Page): Promise<void> {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.navigateToCart();
  }

  /**
   * Remove product from cart
   */
  static async removeFromCart(page: Page, productId: string): Promise<void> {
    const cartPage = new CartPage(page);
    await cartPage.removeItemFromCart(productId);
  }

  /**
   * Get cart item count
   */
  static async getCartCount(page: Page): Promise<number> {
    const inventoryPage = new InventoryPage(page);
    try {
      return await inventoryPage.getCartItemCount();
    } catch {
      return 0; // No cart badge visible
    }
  }
}

/**
 * Checkout Helper
 */
export class CheckoutHelper {
  /**
   * Complete entire checkout process
   */
  static async completeCheckout(page: Page, formData: CheckoutFormData): Promise<void> {
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.completeCheckout(formData);
  }

  /**
   * Verify order completion
   */
  static async verifyOrderCompletion(page: Page): Promise<boolean> {
    const checkoutPage = new CheckoutPage(page);
    return await checkoutPage.isOrderCompleted();
  }

  /**
   * Return to products after checkout
   */
  static async returnToProducts(page: Page): Promise<void> {
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.clickBackToProducts();
  }
}

/**
 * Data Factory for test data
 */
export class TestDataFactory {
  /**
   * Generate random first name
   */
  static getRandomFirstName(): string {
    const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emma'];
    return firstNames[Math.floor(Math.random() * firstNames.length)];
  }

  /**
   * Generate random last name
   */
  static getRandomLastName(): string {
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia'];
    return lastNames[Math.floor(Math.random() * lastNames.length)];
  }

  /**
   * Generate random postal code
   */
  static getRandomPostalCode(): string {
    return Math.floor(Math.random() * 99999)
      .toString()
      .padStart(5, '0');
  }

  /**
   * Generate checkout form data
   */
  static generateCheckoutFormData(): CheckoutFormData {
    return {
      firstName: this.getRandomFirstName(),
      lastName: this.getRandomLastName(),
      postalCode: this.getRandomPostalCode(),
    };
  }

  /**
   * Get valid test credentials
   */
  static getStandardUserCredentials(): UserCredentials {
    return TEST_CREDENTIALS.STANDARD_USER;
  }

  /**
   * Get problem user credentials
   */
  static getProblemUserCredentials(): UserCredentials {
    return TEST_CREDENTIALS.PROBLEM_USER;
  }
}

/**
 * Wait/Assertion Helper
 */
export class WaitHelper {
  /**
   * Wait for element to appear
   */
  static async waitForElement(page: Page, selector: string, timeout: number = TIMEOUTS.MEDIUM): Promise<void> {
    await page.waitForSelector(selector, { timeout });
  }

  /**
   * Wait for navigation
   */
  static async waitForNavigation(page: Page, urlPattern: string, timeout: number = TIMEOUTS.MEDIUM): Promise<void> {
    await page.waitForURL(urlPattern, { timeout });
  }

  /**
   * Wait for specific time
   */
  static async waitForMs(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/**
 * Screenshot/Report Helper
 */
export class ReportHelper {
  /**
   * Take screenshot with timestamp
   */
  static async takeScreenshot(page: Page, name: string): Promise<void> {
    const timestamp = new Date().getTime();
    await page.screenshot({
      path: `screenshots/${name}-${timestamp}.png`,
      fullPage: true,
    });
  }

  /**
   * Get page state for debugging
   */
  static async getPageState(page: Page): Promise<{
    url: string;
    title: string;
    content: string;
  }> {
    return {
      url: page.url(),
      title: await page.title(),
      content: await page.content(),
    };
  }
}
