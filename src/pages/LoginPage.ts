/**
 * LoginPage - Page Object for the Login page
 * Manages all interactions with the login page
 */

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { UserCredentials } from '../types';
import { APP_CONFIG, PAGE_URLS, TIMEOUTS } from '../config/app.config';

export class LoginPage extends BasePage {
  // ==================== Locators ====================
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;
  private readonly pageTitle: Locator;

  // ==================== Constructor ====================
  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('.error-message-container');
    this.pageTitle = page.locator('text=Swag Labs');
  }

  // ==================== Navigation ====================
  /**
   * Navigate to login page
   */
  async navigateToLoginPage(): Promise<void> {
    await this.goto(`${APP_CONFIG.BASE_URL}${PAGE_URLS.LOGIN}`);
    await this.waitForElementVisible(this.pageTitle, TIMEOUTS.MEDIUM);
  }

  // ==================== Public Actions ====================
  /**
   * Login with provided credentials
   */
  async login(credentials: UserCredentials): Promise<void> {
    await this.fillUsername(credentials.username);
    await this.fillPassword(credentials.password);
    await this.clickLoginButton();
  }

  /**
   * Login and wait for inventory page to load
   */
  async loginAndNavigateToInventory(credentials: UserCredentials): Promise<void> {
    await this.login(credentials);
    await this.waitForNavigation(`**${PAGE_URLS.INVENTORY}`, TIMEOUTS.LONG);
  }

  /**
   * Try to login and expect error
   */
  async loginExpectError(credentials: UserCredentials): Promise<void> {
    await this.login(credentials);
    await this.waitForElementVisible(this.errorMessage, TIMEOUTS.MEDIUM);
  }

  /**
   * Fill username field
   */
  async fillUsername(username: string): Promise<void> {
    await this.fill(this.usernameInput, username);
  }

  /**
   * Fill password field
   */
  async fillPassword(password: string): Promise<void> {
    await this.fill(this.passwordInput, password);
  }

  /**
   * Click the login button
   */
  async clickLoginButton(): Promise<void> {
    await this.click(this.loginButton);
  }

  // ==================== Getters/Assertions ====================
  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    return await this.getText(this.errorMessage);
  }

  /**
   * Check if login page is displayed
   */
  async isLoginPageDisplayed(): Promise<boolean> {
    return await this.isVisible(this.pageTitle);
  }

  /**
   * Check if error message is visible
   */
  async isErrorMessageVisible(): Promise<boolean> {
    return await this.isVisible(this.errorMessage);
  }

  /**
   * Check if username input is visible
   */
  async isUsernameInputVisible(): Promise<boolean> {
    return await this.isVisible(this.usernameInput);
  }

  /**
   * Check if password input is visible
   */
  async isPasswordInputVisible(): Promise<boolean> {
    return await this.isVisible(this.passwordInput);
  }

  /**
   * Check if login button is enabled
   */
  async isLoginButtonEnabled(): Promise<boolean> {
    return await this.isEnabled(this.loginButton);
  }

  /**
   * Get username input value
   */
  async getUsernameValue(): Promise<string | null> {
    return await this.getInputValue(this.usernameInput);
  }

  /**
   * Get password input value
   */
  async getPasswordValue(): Promise<string | null> {
    return await this.getInputValue(this.passwordInput);
  }
}
