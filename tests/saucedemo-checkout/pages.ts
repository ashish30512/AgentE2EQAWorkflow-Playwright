import { Page, expect } from '@playwright/test';

export class SauceDemoPages {
  /**
   * Login page and navigate to inventory
   */
  static async loginAndNavigateToInventory(page: Page, username: string, password: string) {
    await page.goto('https://www.saucedemo.com/');
    await page.fill('[data-test="username"]', username);
    await page.fill('[data-test="password"]', password);
    await page.click('[data-test="login-button"]');
    await page.waitForURL('**/inventory.html');
  }

  /**
   * Add item to cart by product name
   */
  static async addItemToCart(page: Page, productName: string) {
    const selector = `[data-test="add-to-cart-${productName}"]`;
    await page.click(selector);
  }

  /**
   * Navigate to cart
   */
  static async navigateToCart(page: Page) {
    await page.click('.shopping_cart_link');
    await page.waitForURL('**/cart.html');
  }

  /**
   * Navigate from cart to checkout (step one)
   */
  static async clickCheckout(page: Page) {
    await page.click('[data-test="checkout"]');
    await page.waitForURL('**/checkout-step-one.html');
  }

  /**
   * Fill checkout form with customer info and continue
   */
  static async fillCheckoutForm(page: Page, firstName: string, lastName: string, zipCode: string) {
    await page.fill('[data-test="firstName"]', firstName);
    await page.fill('[data-test="lastName"]', lastName);
    await page.fill('[data-test="postalCode"]', zipCode);
    await page.click('[data-test="continue"]');
    await page.waitForURL('**/checkout-step-two.html');
  }

  /**
   * Complete order by clicking Finish button
   */
  static async completeOrder(page: Page) {
    await page.click('[data-test="finish"]');
    await page.waitForURL('**/checkout-complete.html');
  }

  /**
   * Navigate back to products from any page
   */
  static async goBackHome(page: Page) {
    await page.click('[data-test="back-to-products"]');
    await page.waitForURL('**/inventory.html');
  }
}
