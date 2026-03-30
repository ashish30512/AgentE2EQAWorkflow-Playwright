/**
 * BasePage - Base class for all Page Objects
 * Provides common methods and utilities for interacting with pages
 */

import { Page, Locator, expect } from '@playwright/test';
import { TIMEOUTS } from '../config/app.config';

export abstract class BasePage {
  protected page: Page;
  protected readonly DEFAULT_TIMEOUT = TIMEOUTS.LONG;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a specific URL
   */
  async goto(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Get current page URL
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Get current page title
   */
  async getPageTitle(): Promise<string> {
    return this.page.title();
  }

  /**
   * Wait for navigation to a specific URL pattern
   */
  async waitForNavigation(urlPattern: string, timeout: number = this.DEFAULT_TIMEOUT): Promise<void> {
    await this.page.waitForURL(urlPattern, { timeout });
  }

  /**
   * Click on an element using provided locator
   */
  async click(locator: Locator): Promise<void> {
    await locator.click();
  }

  /**
   * Fill input field with text
   */
  async fill(locator: Locator, text: string): Promise<void> {
    await locator.fill(text);
  }

  /**
   * Type text into input field slowly (character by character)
   */
  async type(locator: Locator, text: string, delay: number = 50): Promise<void> {
    await locator.type(text, { delay });
  }

  /**
   * Get text content of an element
   */
  async getText(locator: Locator): Promise<string> {
    return await locator.textContent() || '';
  }

  /**
   * Get input value
   */
  async getInputValue(locator: Locator): Promise<string | null> {
    return await locator.inputValue();
  }

  /**
   * Check if element is visible
   */
  async isVisible(locator: Locator, timeout: number = this.DEFAULT_TIMEOUT): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if element is enabled
   */
  async isEnabled(locator: Locator): Promise<boolean> {
    return await locator.isEnabled();
  }

  /**
   * Wait for element to be visible
   */
  async waitForElementVisible(locator: Locator, timeout: number = this.DEFAULT_TIMEOUT): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Wait for element to be hidden
   */
  async waitForElementHidden(locator: Locator, timeout: number = this.DEFAULT_TIMEOUT): Promise<void> {
    await locator.waitFor({ state: 'hidden', timeout });
  }

  /**
   * Get count of elements matching locator
   */
  async getElementCount(locator: Locator): Promise<number> {
    return await locator.count();
  }

  /**
   * Take screenshot of the entire page
   */
  async takeScreenshot(filename: string): Promise<void> {
    await this.page.screenshot({ path: `screenshots/${filename}.png`, fullPage: true });
  }

  /**
   * Take screenshot of specific element
   */
  async takeElementScreenshot(locator: Locator, filename: string): Promise<void> {
    await locator.screenshot({ path: `screenshots/${filename}.png` });
  }

  /**
   * Hover over an element
   */
  async hover(locator: Locator): Promise<void> {
    await locator.hover();
  }

  /**
   * Scroll element into view
   */
  async scrollToElement(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  /**
   * Assert that element is visible
   */
  async expectVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
  }

  /**
   * Assert that element contains specific text
   */
  async expectTextContent(locator: Locator, text: string): Promise<void> {
    await expect(locator).toContainText(text);
  }

  /**
   * Assert that element has specific attribute value
   */
  async expectHasAttribute(locator: Locator, attribute: string, value: string): Promise<void> {
    await expect(locator).toHaveAttribute(attribute, value);
  }

  /**
   * Wait for page load
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Press keyboard key
   */
  async pressKey(key: string): Promise<void> {
    await this.page.press('body', key);
  }

  /**
   * Get all text values from elements matching locator
   */
  async getAllTextContent(locator: Locator): Promise<string[]> {
    return await locator.allTextContents();
  }

  /**
   * Close the page
   */
  async closePage(): Promise<void> {
    await this.page.close();
  }

  /**
   * Reload the page
   */
  async reloadPage(): Promise<void> {
    await this.page.reload();
  }

  /**
   * Set viewport size
   */
  async setViewportSize(width: number, height: number): Promise<void> {
    await this.page.setViewportSize({ width, height });
  }
}
