/**
 * CartPage - Page Object for the Shopping Cart page
 * Manages all interactions with the shopping cart
 */

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { PAGE_URLS, TIMEOUTS } from '../config/app.config';

export class CartPage extends BasePage {
  // ==================== Locators ====================
  private readonly pageTitle: Locator;
  private readonly cartItems: Locator;
  private readonly cartBadge: Locator;
  private readonly checkoutButton: Locator;
  private readonly continueShoppingButton: Locator;
  private readonly emptyCartMessage: Locator;
  private readonly cartItemNames: Locator;
  private readonly cartItemPrices: Locator;
  private readonly cartItemQuantities: Locator;

  // ==================== Constructor ====================
  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('text=Your Cart');
    this.cartItems = page.locator('.cart_item');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.emptyCartMessage = page.locator('text=Your cart is empty');
    this.cartItemNames = page.locator('.inventory_item_name');
    this.cartItemPrices = page.locator('.inventory_item_price');
    this.cartItemQuantities = page.locator('.cart_quantity');
  }

  // ==================== Navigation ====================
  /**
   * Wait for cart page to load
   */
  async waitForCartPageLoad(): Promise<void> {
    await this.waitForElementVisible(this.pageTitle, TIMEOUTS.MEDIUM);
  }

  /**
   * Click continue shopping button
   */
  async continueShopping(): Promise<void> {
    await this.click(this.continueShoppingButton);
    await this.waitForNavigation(`**${PAGE_URLS.INVENTORY}`, TIMEOUTS.MEDIUM);
  }

  /**
   * Proceed to checkout
   */
  async proceedToCheckout(): Promise<void> {
    await this.click(this.checkoutButton);
    await this.waitForNavigation(`**${PAGE_URLS.CHECKOUT_STEP_ONE}`, TIMEOUTS.MEDIUM);
  }

  // ==================== Cart Item Actions ====================
  /**
   * Remove item from cart by product ID
   */
  async removeItemFromCart(productId: string): Promise<void> {
    const removeButton = this.page.locator(`[data-test="remove-${productId}"]`);
    await this.click(removeButton);
    // Wait for item to be removed
    await this.page.waitForTimeout(200);
  }

  /**
   * Get quantity of item in cart by product ID
   */
  async getItemQuantity(productId: string): Promise<number> {
    const quantityLocator = this.page.locator(`[data-test="item-quantity-${productId}"]`);
    const quantity = await this.getText(quantityLocator);
    return parseInt(quantity, 10);
  }

  /**
   * Update item quantity (if UI supports it)
   */
  async updateItemQuantity(productId: string, quantity: number): Promise<void> {
    const quantityInput = this.page.locator(`[data-test="quantity-${productId}"]`);
    await this.fill(quantityInput, quantity.toString());
  }

  // ==================== Getters/Assertions ====================
  /**
   * Get total number of items in cart
   */
  async getCartItemsCount(): Promise<number> {
    return await this.getElementCount(this.cartItems);
  }

  /**
   * Get cart badge count
   */
  async getCartBadgeCount(): Promise<number> {
    const count = await this.getText(this.cartBadge);
    return parseInt(count, 10);
  }

  /**
   * Check if cart is empty
   */
  async isCartEmpty(): Promise<boolean> {
    return await this.isVisible(this.emptyCartMessage);
  }

  /**
   * Check if cart page is displayed
   */
  async isCartPageDisplayed(): Promise<boolean> {
    return await this.isVisible(this.pageTitle);
  }

  /**
   * Get all cart item names
   */
  async getAllCartItemNames(): Promise<string[]> {
    return await this.getAllTextContent(this.cartItemNames);
  }

  /**
   * Get all cart item prices
   */
  async getAllCartItemPrices(): Promise<string[]> {
    return await this.getAllTextContent(this.cartItemPrices);
  }

  /**
   * Check if specific item is in cart
   */
  async isItemInCart(productName: string): Promise<boolean> {
    const itemLocator = this.page.locator(`text=${productName}`);
    return await this.isVisible(itemLocator);
  }

  /**
   * Check if checkout button is enabled
   */
  async isCheckoutButtonEnabled(): Promise<boolean> {
    return await this.isEnabled(this.checkoutButton);
  }

  /**
   * Get cart item locator by product name
   */
  getCartItemLocator(productName: string): Locator {
    return this.page.locator(`text=${productName}`).locator('..').locator('.cart_item');
  }

  /**
   * Get item price by product name
   */
  async getItemPrice(productName: string): Promise<string> {
    const priceLocator = this.page.locator(`text=${productName}`).locator('..').locator('.inventory_item_price');
    return await this.getText(priceLocator);
  }
}
