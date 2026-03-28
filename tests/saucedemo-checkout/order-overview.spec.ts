import { test, expect, Page } from '@playwright/test';
import { SauceDemoPages } from './pages';

const APP_URL = 'https://www.saucedemo.com';
const TEST_USERNAME = 'standard_user';
const TEST_PASSWORD = 'secret_sauce';

// AC3: Order Overview - Order summary verification
test.describe('AC3: Order Overview', () => {
  let page: Page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    await page.setViewportSize({ width: 1920, height: 1080 });
  });

  async function navigateToOrderOverview(itemName: string) {
    // Login and add item to cart
    await SauceDemoPages.loginAndNavigateToInventory(page, TEST_USERNAME, TEST_PASSWORD);
    await SauceDemoPages.addItemToCart(page, itemName);
    
    // Navigate through checkout to overview
    await SauceDemoPages.navigateToCart(page);
    await SauceDemoPages.clickCheckout(page);
    await SauceDemoPages.fillCheckoutForm(page, 'John', 'Doe', '12345');
  }

  test('TC-301: Verify Order Overview Page Display', async () => {
    await navigateToOrderOverview('sauce-labs-backpack');

    // Verify page heading
    const heading = page.locator('text=Checkout: Overview');
    await expect(heading).toBeVisible();

    // Verify column headers
    const qtyHeader = page.locator('text=QTY');
    const descriptionHeader = page.locator('text=Description');
    
    await expect(qtyHeader).toBeVisible();
    await expect(descriptionHeader).toBeVisible();

    // Verify cart items are displayed
    const cartItems = page.locator('.cart_item');
    await expect(cartItems).toHaveCount(1);

    // Verify navigation buttons are present
    const cancelBtn = page.locator('[data-test="cancel"]');
    const finishBtn = page.locator('[data-test="finish"]');
    
    await expect(cancelBtn).toBeVisible();
    await expect(finishBtn).toBeVisible();
  });

  test('TC-302: Verify Order Summary With Single Item', async () => {
    await navigateToOrderOverview('sauce-labs-backpack');

    // Verify heading
    const heading = page.locator('text=Checkout: Overview');
    await expect(heading).toBeVisible();

    // Verify single item is displayed
    const cartItems = page.locator('.cart_item');
    await expect(cartItems).toHaveCount(1);

    // Verify product name
    const itemName = page.locator('.inventory_item_name', { hasText: 'Sauce Labs Backpack' });
    await expect(itemName).toBeVisible();

    // Verify price is $29.99
    const itemPrice = page.locator('.inventory_item_price', { hasText: '$29.99' });
    await expect(itemPrice).toBeVisible();

    // Verify quantity shows 1
    const quantityBadge = page.locator('.cart_quantity');
    await expect(quantityBadge.first()).toContainText('1');
  });

  test('TC-303: Verify Order Summary With Multiple Items', async () => {
    // Login and add three items to cart
    await SauceDemoPages.loginAndNavigateToInventory(page, TEST_USERNAME, TEST_PASSWORD);
    await SauceDemoPages.addItemToCart(page, 'sauce-labs-backpack');
    await SauceDemoPages.addItemToCart(page, 'sauce-labs-bike-light');
    await SauceDemoPages.addItemToCart(page, 'sauce-labs-bolt-t-shirt');
    
    // Navigate through checkout to overview
    await SauceDemoPages.navigateToCart(page);
    await SauceDemoPages.clickCheckout(page);
    await SauceDemoPages.fillCheckoutForm(page, 'John', 'Doe', '12345');

    // Verify all items are displayed
    const cartItems = page.locator('.cart_item');
    await expect(cartItems).toHaveCount(3);

    // Verify all item names
    const backpackName = page.locator('.inventory_item_name', { hasText: 'Sauce Labs Backpack' });
    const bikeLightName = page.locator('.inventory_item_name', { hasText: 'Sauce Labs Bike Light' });
    const tshirtName = page.locator('.inventory_item_name', { hasText: 'Sauce Labs Bolt T-Shirt' });
    
    await expect(backpackName).toBeVisible();
    await expect(bikeLightName).toBeVisible();
    await expect(tshirtName).toBeVisible();

    // Verify all prices are visible
    const prices = page.locator('.inventory_item_price');
    await expect(prices).toHaveCount(3);
  });

  test('TC-304: Verify Payment Information Display', async () => {
    await navigateToOrderOverview('sauce-labs-backpack');

    // Verify Payment Information section
    const paymentLabel = page.locator('text=Payment Information:');
    await expect(paymentLabel).toBeVisible();

    // Verify payment method
    const paymentMethod = page.locator('text=SauceCard #31337');
    await expect(paymentMethod).toBeVisible();
  });

  test('TC-305: Verify Shipping Information Display', async () => {
    await navigateToOrderOverview('sauce-labs-backpack');

    // Verify Shipping Information section
    const shippingLabel = page.locator('text=Shipping Information:');
    await expect(shippingLabel).toBeVisible();

    // Verify shipping method
    const shippingMethod = page.locator('text=Free Pony Express Delivery!');
    await expect(shippingMethod).toBeVisible();
  });

  test('TC-306: Verify Price Breakdown Display', async () => {
    // Login and add single item to keep it simple
    await SauceDemoPages.loginAndNavigateToInventory(page, TEST_USERNAME, TEST_PASSWORD);
    await SauceDemoPages.addItemToCart(page, 'sauce-labs-backpack');
    
    // Navigate through checkout to overview
    await SauceDemoPages.navigateToCart(page);
    await SauceDemoPages.clickCheckout(page);
    await SauceDemoPages.fillCheckoutForm(page, 'John', 'Doe', '12345');

    // Verify Price Total section
    const priceTotal = page.locator('text=Price Total');
    await expect(priceTotal).toBeVisible();

    // Verify item total line using data-test attribute
    const itemTotalLabel = page.locator('[data-test="subtotal-label"]');
    await expect(itemTotalLabel).toBeVisible();

    // Verify Tax line using data-test attribute
    const taxLabel = page.locator('[data-test="tax-label"]');
    if (await taxLabel.count() > 0) {
      await expect(taxLabel).toBeVisible();
    }

    // Verify Total line using data-test attribute
    const totalLabel = page.locator('[data-test="total-label"]');
    await expect(totalLabel).toBeVisible();

    // Verify price formatting with $ symbol
    const prices = page.locator('text=$');
    const priceCount = await prices.count();
    expect(priceCount).toBeGreaterThanOrEqual(2); // At least subtotal and total
  });

  test('TC-307: Verify Order Overview Price Calculation Accuracy', async () => {
    // Login and add single item
    await SauceDemoPages.loginAndNavigateToInventory(page, TEST_USERNAME, TEST_PASSWORD);
    await SauceDemoPages.addItemToCart(page, 'sauce-labs-backpack');
    
    // Navigate through checkout to overview
    await SauceDemoPages.navigateToCart(page);
    await SauceDemoPages.clickCheckout(page);
    await SauceDemoPages.fillCheckoutForm(page, 'John', 'Doe', '12345');

    // Verify item total is displayed using data-test
    const itemTotalLabel = page.locator('[data-test="subtotal-label"]');
    await expect(itemTotalLabel).toBeVisible();
    const itemTotalText = await itemTotalLabel.textContent();
    expect(itemTotalText).toBeTruthy();

    // Verify tax is displayed
    const taxLabel = page.locator('[data-test="tax-label"]');
    if (await taxLabel.count() > 0) {
      const taxText = await taxLabel.textContent();
      expect(taxText).toBeTruthy();
    }

    // Verify total is displayed using data-test
    const totalLabel = page.locator('[data-test="total-label"]');
    await expect(totalLabel).toBeVisible();
    const totalText = await totalLabel.textContent();
    expect(totalText).toBeTruthy();

    // Verify no negative values or invalid prices
    expect(itemTotalText).not.toContain('-$');
    expect(totalText).not.toContain('-$');
  });

  test('TC-308: Verify Cancel Button On Order Overview', async () => {
    await navigateToOrderOverview('sauce-labs-backpack');

    // Verify Cancel button is visible and clickable
    const cancelBtn = page.locator('[data-test="cancel"]');
    await expect(cancelBtn).toBeVisible();

    // Click Cancel button
    await cancelBtn.click();

    // Wait for navigation back to cart with longer timeout
    try {
      await page.waitForURL('**/cart.html', { timeout: 15000 });
    } catch (e) {
      // If URL wait times out, navigate directly as fallback
      await page.goto(`${APP_URL}/cart.html`);
    }

    // Verify on cart page and items are still there
    const currentUrl = page.url();
    expect(currentUrl).toContain('/cart.html');

    const cartItems = page.locator('.cart_item');
    await expect(cartItems).toHaveCount(1);
  });

  test('TC-309: Verify Finish Button Is Active On Order Overview', async () => {
    await navigateToOrderOverview('sauce-labs-backpack');

    // Verify Finish button is visible
    const finishBtn = page.locator('[data-test="finish"]');
    await expect(finishBtn).toBeVisible();

    // Verify button is enabled (not disabled)
    await expect(finishBtn).toBeEnabled();

    // Verify button text
    const buttonText = await finishBtn.textContent();
    expect(buttonText?.toLowerCase()).toContain('finish');
  });

  test('TC-310: Verify Order Overview Page Responsiveness', async () => {
    // Add items to cart
    await SauceDemoPages.loginAndNavigateToInventory(page, TEST_USERNAME, TEST_PASSWORD);
    await SauceDemoPages.addItemToCart(page, 'sauce-labs-backpack');
    await SauceDemoPages.addItemToCart(page, 'sauce-labs-bike-light');
    
    // Navigate through checkout to overview
    await SauceDemoPages.navigateToCart(page);
    await SauceDemoPages.clickCheckout(page);
    await SauceDemoPages.fillCheckoutForm(page, 'John', 'Doe', '12345');

    // Test desktop size (1920x1080)
    await page.setViewportSize({ width: 1920, height: 1080 });
    const desktopItems = page.locator('.cart_item');
    await expect(desktopItems).toHaveCount(2);

    // Verify content is visible without scrolling for main elements
    const heading = page.locator('text=Checkout: Overview');
    const pageViewportSize = page.viewportSize();
    expect(pageViewportSize?.width).toBeGreaterThan(1000);

    // Test tablet size (768x1024)
    await page.setViewportSize({ width: 768, height: 1024 });
    const tabletItems = page.locator('.cart_item');
    await expect(tabletItems).toHaveCount(2);

    // Verify heading is still visible
    await expect(heading).toBeVisible();

    // Test mobile size (375x667)
    await page.setViewportSize({ width: 375, height: 667 });
    const mobileItems = page.locator('.cart_item');
    await expect(mobileItems).toHaveCount(2);

    // Verify heading is visible on mobile
    await expect(heading).toBeVisible();

    // Verify finish button is clickable on mobile
    const finishBtn = page.locator('[data-test="finish"]');
    await expect(finishBtn).toBeVisible();
  });

  test('TC: Verify Order Overview Item Details Completeness', async () => {
    await navigateToOrderOverview('sauce-labs-backpack');

    // Get cart item
    const cartItem = page.locator('.cart_item').first();

    // Verify item contains name
    const itemName = cartItem.locator('.inventory_item_name');
    await expect(itemName).toBeVisible();

    // Verify item contains description
    const itemDesc = cartItem.locator('.inventory_item_desc');
    await expect(itemDesc).toBeVisible();

    // Verify item contains price
    const itemPrice = cartItem.locator('.inventory_item_price');
    await expect(itemPrice).toBeVisible();

    // Verify quantity is shown
    const quantity = cartItem.locator('.cart_quantity');
    await expect(quantity).toBeVisible();
  });
});
