/**
 * CheckoutPage - Page Object for the Checkout pages (Step 1, 2, and Complete)
 * Manages all interactions with checkout process
 */

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { CheckoutFormData } from '../types';
import { PAGE_URLS, TIMEOUTS } from '../config/app.config';

export class CheckoutPage extends BasePage {
  // ==================== Locators - Step 1 ====================
  private readonly stepOneTitle: Locator;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly postalCodeInput: Locator;
  private readonly continueButton: Locator;
  private readonly cancelButton: Locator;
  private readonly errorMessage: Locator;

  // ==================== Locators - Step 2 ====================
  private readonly stepTwoTitle: Locator;
  private readonly finishButton: Locator;
  private readonly cartItems: Locator;
  private readonly paymentLabel: Locator;
  private readonly shippingLabel: Locator;
  private readonly itemTotal: Locator;
  private readonly tax: Locator;
  private readonly total: Locator;

  // ==================== Locators - Complete ====================
  private readonly completeTitle: Locator;
  private readonly completeMessage: Locator;
  private readonly completeDescription: Locator;
  private readonly backToProductsButton: Locator;

  // ==================== Constructor ====================
  constructor(page: Page) {
    super(page);
    // Step 1 Locators
    this.stepOneTitle = page.locator('text=Checkout: Your Information');
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorMessage = page.locator('[data-test*="error"]');

    // Step 2 Locators
    this.stepTwoTitle = page.locator('text=Checkout: Overview');
    this.finishButton = page.locator('[data-test="finish"]');
    this.cartItems = page.locator('.cart_item');
    this.paymentLabel = page.locator('text=Payment Information:');
    this.shippingLabel = page.locator('text=Shipping Information:');
    this.itemTotal = page.locator('[data-test="subtotal-label"]');
    this.tax = page.locator('[data-test="tax-label"]');
    this.total = page.locator('[data-test="total-label"]');

    // Complete Locators
    this.completeTitle = page.locator('text=Checkout: Complete!');
    this.completeMessage = page.locator('text=Thank you for your order!');
    this.completeDescription = page.locator('text=Your order has been dispatched');
    this.backToProductsButton = page.locator('[data-test="back-to-products"]');
  }

  // ==================== Step 1 - Checkout Information ====================
  /**
   * Wait for checkout step 1 to load
   */
  async waitForCheckoutStepOne(): Promise<void> {
    await this.waitForElementVisible(this.stepOneTitle, TIMEOUTS.MEDIUM);
  }

  /**
   * Fill checkout form with user information
   */
  async fillCheckoutForm(formData: CheckoutFormData): Promise<void> {
    await this.fillFirstName(formData.firstName);
    await this.fillLastName(formData.lastName);
    await this.fillPostalCode(formData.postalCode);
  }

  /**
   * Fill first name field
   */
  async fillFirstName(firstName: string): Promise<void> {
    await this.fill(this.firstNameInput, firstName);
  }

  /**
   * Fill last name field
   */
  async fillLastName(lastName: string): Promise<void> {
    await this.fill(this.lastNameInput, lastName);
  }

  /**
   * Fill postal code field
   */
  async fillPostalCode(postalCode: string): Promise<void> {
    await this.fill(this.postalCodeInput, postalCode);
  }

  /**
   * Click continue button
   */
  async clickContinue(): Promise<void> {
    await this.click(this.continueButton);
    await this.waitForNavigation(`**${PAGE_URLS.CHECKOUT_STEP_TWO}`, TIMEOUTS.MEDIUM);
  }

  /**
   * Fill form and continue to step 2
   */
  async fillFormAndContinue(formData: CheckoutFormData): Promise<void> {
    await this.fillCheckoutForm(formData);
    await this.clickContinue();
  }

  /**
   * Click cancel button
   */
  async clickCancel(): Promise<void> {
    await this.click(this.cancelButton);
    await this.waitForNavigation(`**${PAGE_URLS.CART}`, TIMEOUTS.MEDIUM);
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    return await this.getText(this.errorMessage);
  }

  /**
   * Check if error message is visible
   */
  async isErrorMessageVisible(): Promise<boolean> {
    return await this.isVisible(this.errorMessage);
  }

  // ==================== Step 2 - Checkout Overview ====================
  /**
   * Wait for checkout step 2 to load
   */
  async waitForCheckoutStepTwo(): Promise<void> {
    await this.waitForElementVisible(this.stepTwoTitle, TIMEOUTS.MEDIUM);
  }

  /**
   * Complete the order by clicking finish
   */
  async completeOrder(): Promise<void> {
    await this.click(this.finishButton);
    await this.waitForNavigation(`**${PAGE_URLS.CHECKOUT_COMPLETE}`, TIMEOUTS.MEDIUM);
  }

  /**
   * Get total number of items in checkout
   */
  async getCheckoutItemsCount(): Promise<number> {
    return await this.getElementCount(this.cartItems);
  }

  /**
   * Check if payment information is visible
   */
  async isPaymentInfoVisible(): Promise<boolean> {
    return await this.isVisible(this.paymentLabel);
  }

  /**
   * Check if shipping information is visible
   */
  async isShippingInfoVisible(): Promise<boolean> {
    return await this.isVisible(this.shippingLabel);
  }

  /**
   * Get item total
   */
  async getItemTotal(): Promise<string> {
    return await this.getText(this.itemTotal);
  }

  /**
   * Get tax amount
   */
  async getTaxAmount(): Promise<string> {
    return await this.getText(this.tax);
  }

  /**
   * Get total amount
   */
  async getTotalAmount(): Promise<string> {
    return await this.getText(this.total);
  }

  /**
   * Check if finish button is enabled
   */
  async isFinishButtonEnabled(): Promise<boolean> {
    return await this.isEnabled(this.finishButton);
  }

  /**
   * Verify order summary section exists
   */
  async isOrderSummaryVisible(): Promise<boolean> {
    return await this.isVisible(this.stepTwoTitle);
  }

  // ==================== Checkout Complete ====================
  /**
   * Wait for checkout completion page
   */
  async waitForCheckoutComplete(): Promise<void> {
    await this.waitForElementVisible(this.completeTitle, TIMEOUTS.MEDIUM);
  }

  /**
   * Check if purchase was successful
   */
  async isOrderCompleted(): Promise<boolean> {
    return await this.isVisible(this.completeMessage);
  }

  /**
   * Get completion message
   */
  async getCompletionMessage(): Promise<string> {
    return await this.getText(this.completeMessage);
  }

  /**
   * Get order dispatch description
   */
  async getDispatchDescription(): Promise<string> {
    return await this.getText(this.completeDescription);
  }

  /**
   * Click back to products button
   */
  async clickBackToProducts(): Promise<void> {
    await this.click(this.backToProductsButton);
    await this.waitForNavigation(`**${PAGE_URLS.INVENTORY}`, TIMEOUTS.MEDIUM);
  }

  // ==================== General Checkout Methods ====================
  /**
   * Complete entire checkout process
   */
  async completeCheckout(formData: CheckoutFormData): Promise<void> {
    await this.waitForCheckoutStepOne();
    await this.fillFormAndContinue(formData);
    await this.waitForCheckoutStepTwo();
    await this.completeOrder();
    await this.waitForCheckoutComplete();
  }

  /**
   * Skip checkout and return to cart
   */
  async skipCheckout(): Promise<void> {
    await this.clickCancel();
  }
}
