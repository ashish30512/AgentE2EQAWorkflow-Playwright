/**
 * InventoryPage - Page Object for the Products/Inventory page
 * Manages all interactions with the inventory listing
 */

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { Product } from '../types';
import { PAGE_URLS, TIMEOUTS } from '../config/app.config';

export class InventoryPage extends BasePage {
  // ==================== Locators ====================
  private readonly pageTitle: Locator;
  private readonly cartIcon: Locator;
  private readonly cartBadge: Locator;
  private readonly inventoryItems: Locator;
  private readonly sortDropdown: Locator;
  private readonly productNames: Locator;
  private readonly productPrices: Locator;

  // ==================== Constructor ====================
  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('text=Products');
    this.cartIcon = page.locator('.shopping_cart_link');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.inventoryItems = page.locator('.inventory_item');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.productNames = page.locator('.inventory_item_name');
    this.productPrices = page.locator('.inventory_item_price');
  }

  // ==================== Navigation ====================
  /**
   * Wait for inventory page to load
   */
  async waitForInventoryPageLoad(): Promise<void> {
    await this.waitForElementVisible(this.pageTitle, TIMEOUTS.MEDIUM);
  }

  /**
   * Navigate to cart
   */
  async navigateToCart(): Promise<void> {
    await this.click(this.cartIcon);
    await this.waitForNavigation(`**${PAGE_URLS.CART}`, TIMEOUTS.MEDIUM);
  }

  // ==================== Product Actions ====================
  /**
   * Add product to cart by product ID
   */
  async addProductToCart(productId: string): Promise<void> {
    const addButton = this.page.locator(`[data-test="add-to-cart-${productId}"]`);
    await this.click(addButton);
  }

  /**
   * Remove product from cart by product ID
   */
  async removeProductFromCart(productId: string): Promise<void> {
    const removeButton = this.page.locator(`[data-test="remove-${productId}"]`);
    await this.click(removeButton);
  }

  /**
   * Add multiple products to cart
   */
  async addMultipleProductsToCart(productIds: string[]): Promise<void> {
    for (const productId of productIds) {
      await this.addProductToCart(productId);
      // Small delay to ensure UI updates
      await this.page.waitForTimeout(200);
    }
  }

  /**
   * Get product by name and click it to view details
   */
  async clickProductByName(productName: string): Promise<void> {
    const productLink = this.page.locator(`text=${productName}`);
    await this.click(productLink);
  }

  /**
   * Sort products by option (e.g., 'name (A to Z)', 'price (low to high)')
   */
  async sortProductsBy(sortOption: string): Promise<void> {
    await this.click(this.sortDropdown);
    const option = this.page.locator(`[data-test-id="${sortOption}"]`);
    await this.click(option);
  }

  // ==================== Getters/Assertions ====================
  /**
   * Get current cart item count
   */
  async getCartItemCount(): Promise<number> {
    const count = await this.getText(this.cartBadge);
    return parseInt(count, 10);
  }

  /**
   * Check if cart badge is visible (has items)
   */
  async isCartBadgeVisible(): Promise<boolean> {
    return await this.isVisible(this.cartBadge);
  }

  /**
   * Get total number of products on page
   */
  async getTotalProductsCount(): Promise<number> {
    return await this.getElementCount(this.inventoryItems);
  }

  /**
   * Get all product names
   */
  async getAllProductNames(): Promise<string[]> {
    return await this.getAllTextContent(this.productNames);
  }

  /**
   * Get all product prices
   */
  async getAllProductPrices(): Promise<string[]> {
    return await this.getAllTextContent(this.productPrices);
  }

  /**
   * Check if inventory page is displayed
   */
  async isInventoryPageDisplayed(): Promise<boolean> {
    return await this.isVisible(this.pageTitle);
  }

  /**
   * Get product by ID as locator
   */
  getProductLocator(productId: string): Locator {
    return this.page.locator(`[data-test="inventory-item-${productId}"]`);
  }

  /**
   * Get add to cart button for product
   */
  getAddToCartButton(productId: string): Locator {
    return this.page.locator(`[data-test="add-to-cart-${productId}"]`);
  }

  /**
   * Check if product is visible
   */
  async isProductVisible(productId: string): Promise<boolean> {
    return await this.isVisible(this.getProductLocator(productId));
  }

  /**
   * Get all visible product IDs
   */
  async getAllVisibleProductIds(): Promise<string[]> {
    const items = await this.page.locator('.inventory_item_name').all();
    const ids: string[] = [];
    for (const item of items) {
      const text = await item.textContent();
      ids.push(text || '');
    }
    return ids;
  }
}
