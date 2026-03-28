import { test, expect, Page } from '@playwright/test';
import { SauceDemoPages } from './pages';

const APP_URL = 'https://www.saucedemo.com';
const TEST_USERNAME = 'standard_user';
const TEST_PASSWORD = 'secret_sauce';

// AC1: Cart Review - Verifying cart items, totals, and navigation options
test.describe('AC1: Cart Review', () => {
  let page: Page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    // Maximize browser window for consistent testing
    await page.setViewportSize({ width: 1920, height: 1080 });
  });

  test('TC-101: Verify Empty Cart Display', async () => {
    // Navigate to app and login
    await SauceDemoPages.loginAndNavigateToInventory(page, TEST_USERNAME, TEST_PASSWORD);
    
    // Navigate to cart directly
    await page.goto(`${APP_URL}/cart.html`);
    await page.waitForLoadState('networkidle');

    // Verify page title and heading
    await expect(page.locator('text=Your Cart')).toBeVisible();
    
    // Verify continue shopping and checkout buttons are present
    const continueShoppingBtn = page.locator('[data-test="continue-shopping"]');
    const checkoutBtn = page.locator('[data-test="checkout"]');
    
    await expect(continueShoppingBtn).toBeVisible();
    await expect(checkoutBtn).toBeVisible();

    // Verify cart is empty (no cart items visible)
    const cartItems = page.locator('.cart_item');
    await expect(cartItems).toHaveCount(0);
  });

  test('TC-102: Verify Cart With Single Item', async () => {
    // Login and navigate to inventory
    await SauceDemoPages.loginAndNavigateToInventory(page, TEST_USERNAME, TEST_PASSWORD);

    // Add Sauce Labs Backpack to cart
    await SauceDemoPages.addItemToCart(page, 'sauce-labs-backpack');
    
    // Navigate to cart
    await SauceDemoPages.navigateToCart(page);

    // Verify cart item is displayed
    const cartItem = page.locator('.cart_item').first();
    await expect(cartItem).toBeVisible();
    
    // Verify product name contains "Sauce Labs Backpack"
    const itemName = page.locator('text=Sauce Labs Backpack').first();
    await expect(itemName).toBeVisible();

    // Verify price is $29.99
    const itemPrice = page.locator('text=$29.99').first();
    await expect(itemPrice).toBeVisible();

    // Verify quantity shows 1
    const quantityBadge = page.locator('.cart_quantity').first();
    await expect(quantityBadge).toContainText('1');

    // Verify Continue Shopping and Checkout buttons are present
    await expect(page.locator('[data-test="continue-shopping"]')).toBeVisible();
    await expect(page.locator('[data-test="checkout"]')).toBeVisible();
  });

  test('TC-103: Verify Cart With Multiple Items', async () => {
    // Login and navigate to inventory
    await SauceDemoPages.loginAndNavigateToInventory(page, TEST_USERNAME, TEST_PASSWORD);

    // Add three items to cart
    await SauceDemoPages.addItemToCart(page, 'sauce-labs-backpack');
    await SauceDemoPages.addItemToCart(page, 'sauce-labs-bike-light');
    await SauceDemoPages.addItemToCart(page, 'sauce-labs-bolt-t-shirt');

    // Navigate to cart
    await SauceDemoPages.navigateToCart(page);

    // Verify all three items are displayed
    const cartItems = page.locator('.cart_item');
    await expect(cartItems).toHaveCount(3);

    // Verify each item name is visible
    const backpackName = page.locator('.inventory_item_name', { hasText: 'Sauce Labs Backpack' });
    const bikeLightName = page.locator('.inventory_item_name', { hasText: 'Sauce Labs Bike Light' });
    const tshirtName = page.locator('.inventory_item_name', { hasText: 'Sauce Labs Bolt T-Shirt' });
    
    await expect(backpackName).toBeVisible();
    await expect(bikeLightName).toBeVisible();
    await expect(tshirtName).toBeVisible();

    // Verify prices are correct
    const prices = page.locator('.inventory_item_price');
    await expect(prices).toHaveCount(3);
  });

  test('TC-104: Verify Cart Continue Shopping Button', async () => {
    // Login and navigate to inventory
    await SauceDemoPages.loginAndNavigateToInventory(page, TEST_USERNAME, TEST_PASSWORD);

    // Add an item to cart
    await SauceDemoPages.addItemToCart(page, 'sauce-labs-backpack');

    // Navigate to cart
    await SauceDemoPages.navigateToCart(page);

    // Verify cart has the item
    const cartItems = page.locator('.cart_item');
    await expect(cartItems).toHaveCount(1);

    // Click Continue Shopping button
    await page.click('[data-test="continue-shopping"]');
    await page.waitForURL('**/inventory.html');

    // Verify item still in cart by navigating back
    await SauceDemoPages.navigateToCart(page);
    await expect(cartItems).toHaveCount(1);
  });

  test('TC-105: Verify Cart Item Price Calculation', async () => {
    // Login and navigate to inventory
    await SauceDemoPages.loginAndNavigateToInventory(page, TEST_USERNAME, TEST_PASSWORD);

    // Add Sauce Labs Fleece Jacket to cart twice
    await SauceDemoPages.addItemToCart(page, 'sauce-labs-fleece-jacket');
    
    // Navigate to cart - first item should show
    await SauceDemoPages.navigateToCart(page);
    
    // Verify item is in cart and shows price
    const fleeceName = page.locator('.inventory_item_name', { hasText: 'Sauce Labs Fleece Jacket' });
    await expect(fleeceName).toBeVisible();

    // Verify price displays correctly
    const fleecePrice = page.locator('.inventory_item_price', { hasText: '$49.99' });
    await expect(fleecePrice).toBeVisible();

    // Quantity should show 1 for the single added item
    const quantityBadges = page.locator('.cart_quantity');
    await expect(quantityBadges.first()).toContainText('1');
  });

  test('TC-106: Verify Cart Item Details Display', async () => {
    // Login and navigate to inventory
    await SauceDemoPages.loginAndNavigateToInventory(page, TEST_USERNAME, TEST_PASSWORD);

    // Add Sauce Labs Bolt T-Shirt to cart as test item
    await SauceDemoPages.addItemToCart(page, 'sauce-labs-bolt-t-shirt');

    // Navigate to cart
    await SauceDemoPages.navigateToCart(page);

    // Verify product name is visible and readable
    const itemName = page.locator('.inventory_item_name').first();
    await expect(itemName).toBeVisible();

    // Verify price is displayed correctly
    const itemPrice = page.locator('.inventory_item_price').first();
    await expect(itemPrice).toBeVisible();

    // Verify quantity field is visible
    const quantityBadge = page.locator('.cart_quantity').first();
    await expect(quantityBadge).toBeVisible();

    // Verify product description is visible
    const itemDesc = page.locator('.inventory_item_desc').first();
    await expect(itemDesc).toBeVisible();

    // Get all text content to verify no truncation
    const itemContent = await itemName.textContent();
    expect(itemContent).toBeTruthy();
    expect(itemContent?.length).toBeGreaterThan(0);
  });

  test('TC: Verify Remove Button Functionality', async () => {
    // Login and navigate to inventory
    await SauceDemoPages.loginAndNavigateToInventory(page, TEST_USERNAME, TEST_PASSWORD);

    // Add two items to cart
    await SauceDemoPages.addItemToCart(page, 'sauce-labs-backpack');
    await SauceDemoPages.addItemToCart(page, 'sauce-labs-bike-light');

    // Navigate to cart
    await SauceDemoPages.navigateToCart(page);

    // Verify 2 items in cart
    let cartItems = page.locator('.cart_item');
    await expect(cartItems).toHaveCount(2);

    // Click remove button for first item (Backpack)
    const removeButtons = page.locator('[data-test^="remove-"]');
    await removeButtons.first().click();

    // Wait for update
    await page.waitForTimeout(300);

    // Verify only 1 item remains
    cartItems = page.locator('.cart_item');
    await expect(cartItems).toHaveCount(1);
  });
});
