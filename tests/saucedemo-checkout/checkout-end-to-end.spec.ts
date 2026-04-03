import { test, expect, Page } from '@playwright/test';
import { SauceDemoPages } from './pages';

const APP_URL = 'https://www.saucedemo.com';
const TEST_USERNAME = 'standard_user';
const TEST_PASSWORD = 'secret_sauce';
<<<<<<< HEAD
//Ashish git test 123againb
=======
//Ashish git test julbline conflit
>>>>>>> d75a3a4 (Update checkout end-to-end test)
// End-to-End: Complete happy path checkout workflow
test.describe('E2E: Complete Checkout Workflow', () => {
  let page: Page;
//Ashish frtom Jupilent
  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    await page.setViewportSize({ width: 1920, height: 1080 });
  });

  test('E2E-001: Complete Checkout Flow - Single Item Happy Path', async () => {
    // Step 1: Navigate to login page
    await page.goto(`${APP_URL}/`);
    await expect(page.locator('text=Swag Labs')).toBeVisible();

    // Step 2: Login with valid credentials
    await page.fill('[data-test="username"]', TEST_USERNAME);
    await page.fill('[data-test="password"]', TEST_PASSWORD);
    await page.click('[data-test="login-button"]');
    
    // Verify logged in by checking inventory page loads
    await page.waitForURL('**/inventory.html', { timeout: 10000 });
    const inventoryHeading = page.locator('text=Products');
    await expect(inventoryHeading).toBeVisible();

    // Step 3: Add single item to cart
    await SauceDemoPages.addItemToCart(page, 'sauce-labs-backpack');
    
    // Verify cart count updates
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toContainText('1');

    // Step 4: Navigate to cart
    await SauceDemoPages.navigateToCart(page);
    
    // Verify cart page loads with item
    await expect(page.locator('text=Your Cart')).toBeVisible();
    const cartItems = page.locator('.cart_item');
    await expect(cartItems).toHaveCount(1);

    // Verify item details
    await expect(page.locator('.inventory_item_name', { hasText: 'Sauce Labs Backpack' })).toBeVisible();
    const priceSelector = page.locator('.inventory_item_price', { hasText: '$29.99' });
    await expect(priceSelector).toBeVisible();

    // Step 5: Click Checkout button
    await SauceDemoPages.clickCheckout(page);
    await expect(page.locator('text=Checkout: Your Information')).toBeVisible();

    // Step 6: Fill checkout form
    await SauceDemoPages.fillCheckoutForm(page, 'John', 'Doe', '12345');
    
    // Verify navigated to overview page
    await expect(page.locator('text=Checkout: Overview')).toBeVisible();

    // Step 7: Verify order overview
    // Check order summary
    await expect(page.locator('text=Sauce Labs Backpack')).toBeVisible();
    
    // Verify payment info
    await expect(page.locator('text=SauceCard #31337')).toBeVisible();
    
    // Verify shipping info
    await expect(page.locator('text=Free Pony Express Delivery!')).toBeVisible();
    
    // Verify price breakdown
    await expect(page.locator('text=Price Total')).toBeVisible();
    await expect(page.locator('[data-test="subtotal-label"]')).toBeVisible();
    await expect(page.locator('[data-test="total-label"]')).toBeVisible();

    // Step 8: Complete order by clicking Finish
    await SauceDemoPages.completeOrder(page);
    
    // Verify order completion page
    await expect(page.locator('text=Checkout: Complete!')).toBeVisible();
    await expect(page.locator('text=Thank you for your order!')).toBeVisible();
    await expect(page.locator('text=Your order has been dispatched')).toBeVisible();

    // Step 9: Navigate back home
    await SauceDemoPages.goBackHome(page);
    
    // Verify back on inventory page
    await expect(page.locator('text=Products')).toBeVisible();
  });

  test('E2E-002: Complete Checkout Flow - Multiple Items Happy Path', async () => {
    // Step 1: Login
    await SauceDemoPages.loginAndNavigateToInventory(page, TEST_USERNAME, TEST_PASSWORD);
    await expect(page.locator('text=Products')).toBeVisible();

    // Step 2: Add multiple items to cart
    await SauceDemoPages.addItemToCart(page, 'sauce-labs-backpack');
    await SauceDemoPages.addItemToCart(page, 'sauce-labs-bike-light');
    await SauceDemoPages.addItemToCart(page, 'sauce-labs-bolt-t-shirt');
    
    // Verify cart count
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toContainText('3');

    // Step 3: Navigate to cart
    await SauceDemoPages.navigateToCart(page);
    
    // Verify all items in cart
    const cartItems = page.locator('.cart_item');
    await expect(cartItems).toHaveCount(3);

    // Step 4: Proceed to checkout
    await SauceDemoPages.clickCheckout(page);
    
    // Step 5: Fill checkout information
    await page.fill('[data-test="firstName"]', 'Jane');
    await page.fill('[data-test="lastName"]', 'Smith');
    await page.fill('[data-test="postalCode"]', '54321');
    await page.click('[data-test="continue"]');
    
    // Verify on overview page
    await page.waitForURL('**/checkout-step-two.html');

    // Step 6: Verify all items on order overview
    const overviewItems = page.locator('.cart_item');
    await expect(overviewItems).toHaveCount(3);
    
    // Verify all item names
    const backpackName = page.locator('.inventory_item_name', { hasText: 'Sauce Labs Backpack' });
    const bikeLightName = page.locator('.inventory_item_name', { hasText: 'Sauce Labs Bike Light' });
    const tshirtName = page.locator('.inventory_item_name', { hasText: 'Sauce Labs Bolt T-Shirt' });
    
    await expect(backpackName).toBeVisible();
    await expect(bikeLightName).toBeVisible();
    await expect(tshirtName).toBeVisible();

    // Step 7: Complete order
    await page.click('[data-test="finish"]');
    await page.waitForURL('**/checkout-complete.html');

    // Verify order complete page
    const confirmationMessage = page.locator('text=Thank you for your order!');
    await expect(confirmationMessage).toBeVisible();

    // Step 8: Return home
    await page.click('[data-test="back-to-products"]');
    await page.waitForURL('**/inventory.html');

    // Verify cart is cleared
    const cartBadgeAfter = page.locator('.shopping_cart_badge');
    await expect(cartBadgeAfter).not.toBeVisible();
  });

  test('E2E-003: Complete Checkout With Form Error Recovery', async () => {
    // Step 1: Login and add item
    await SauceDemoPages.loginAndNavigateToInventory(page, TEST_USERNAME, TEST_PASSWORD);
    await SauceDemoPages.addItemToCart(page, 'sauce-labs-backpack');

    // Step 2: Navigate to checkout
    await SauceDemoPages.navigateToCart(page);
    await SauceDemoPages.clickCheckout(page);

    // Step 3: Try to submit form without First Name (error scenario)
    await page.fill('[data-test="lastName"]', 'Doe');
    await page.fill('[data-test="postalCode"]', '12345');
    await page.click('[data-test="continue"]');

    // Verify error message appears
    const errorMessage = page.locator('text=First Name is required');
    await expect(errorMessage).toBeVisible();

    // Step 4: Correct the error and proceed
    await page.fill('[data-test="firstName"]', 'John');
    
    // Verify error message is gone
    // (Usually cleared when field is filled)
    
    // Step 5: Click continue again
    await page.click('[data-test="continue"]');
    
    // Verify navigation to overview
    await page.waitForURL('**/checkout-step-two.html');

    // Step 6: Complete the order
    await page.click('[data-test="finish"]');
    await page.waitForURL('**/checkout-complete.html');

    // Verify successful completion
    const thankYouMessage = page.locator('text=Thank you for your order!');
    await expect(thankYouMessage).toBeVisible();
  });

  test('E2E-004: Complete Checkout With Cancel and Resume', async () => {
    // Step 1: Login and add item
    await SauceDemoPages.loginAndNavigateToInventory(page, TEST_USERNAME, TEST_PASSWORD);
    await SauceDemoPages.addItemToCart(page, 'sauce-labs-backpack');

    // Step 2: Navigate to checkout form
    await SauceDemoPages.navigateToCart(page);
    await SauceDemoPages.clickCheckout(page);

    // Step 3: Fill form but then click Cancel
    await page.fill('[data-test="firstName"]', 'John');
    await page.fill('[data-test="lastName"]', 'Doe');
    await page.fill('[data-test="postalCode"]', '12345');
    await page.click('[data-test="cancel"]');

    // Verify back on cart page
    await page.waitForURL('**/cart.html');
    const cartItems = page.locator('.cart_item');
    await expect(cartItems).toHaveCount(1);

    // Step 4: Proceed through checkout again
    await page.click('[data-test="checkout"]');
    await page.waitForURL('**/checkout-step-one.html');

    // Step 5: Fill form again (should be empty from previous cancel)
    await page.fill('[data-test="firstName"]', 'Jane');
    await page.fill('[data-test="lastName"]', 'Smith');
    await page.fill('[data-test="postalCode"]', '54321');
    await page.click('[data-test="continue"]');

    // Step 6: Complete from overview
    await page.waitForURL('**/checkout-step-two.html');
    await page.click('[data-test="finish"]');
    await page.waitForURL('**/checkout-complete.html');

    // Verify order complete
    const thankYouMessage = page.locator('text=Thank you for your order!');
    await expect(thankYouMessage).toBeVisible();
  });

  test('E2E-005: Complete Checkout With Continue Shopping Navigation', async () => {
    // Step 1: Login and add first item
    await SauceDemoPages.loginAndNavigateToInventory(page, TEST_USERNAME, TEST_PASSWORD);
    await SauceDemoPages.addItemToCart(page, 'sauce-labs-backpack');

    // Step 2: Go to cart
    await SauceDemoPages.navigateToCart(page);
    
    // Step 3: Click Continue Shopping
    await page.click('[data-test="continue-shopping"]');
    await page.waitForURL('**/inventory.html');

    // Step 4: Add another item
    await SauceDemoPages.addItemToCart(page, 'sauce-labs-bike-light');

    // Verify cart count is 2
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toContainText('2');

    // Step 5: Go to cart and proceed to checkout
    await SauceDemoPages.navigateToCart(page);
    const items = page.locator('.cart_item');
    await expect(items).toHaveCount(2);

    // Step 6: Checkout
    await page.click('[data-test="checkout"]');
    await page.waitForURL('**/checkout-step-one.html');

    // Step 7: Fill and submit form
    await page.fill('[data-test="firstName"]', 'John');
    await page.fill('[data-test="lastName"]', 'Doe');
    await page.fill('[data-test="postalCode"]', '12345');
    await page.click('[data-test="continue"]');

    // Step 8: Verify overview has both items
    await page.waitForURL('**/checkout-step-two.html');
    const overviewItems = page.locator('.cart_item');
    await expect(overviewItems).toHaveCount(2);

    // Step 9: Complete order
    await page.click('[data-test="finish"]');
    await page.waitForURL('**/checkout-complete.html');

    // Verify success
    const thankYouMessage = page.locator('text=Thank you for your order!');
    await expect(thankYouMessage).toBeVisible();
  });

  test('E2E-006: Complete Checkout Flow - Payment Info Verification', async () => {
    // Verify payment information is displayed correctly at checkout overview

    // Step 1: Login and add item
    await SauceDemoPages.loginAndNavigateToInventory(page, TEST_USERNAME, TEST_PASSWORD);
    await SauceDemoPages.addItemToCart(page, 'sauce-labs-backpack');

    // Step 2: Navigate to checkout overview
    await SauceDemoPages.navigateToCart(page);
    await SauceDemoPages.clickCheckout(page);
    await SauceDemoPages.fillCheckoutForm(page, 'John', 'Doe', '12345');

    // Step 3: Verify all expected information sections (Payment, Shipping, Price)
    // Payment Information
    const paymentLabel = page.locator('text=Payment Information:');
    await expect(paymentLabel).toBeVisible();
    
    const paymentMethod = page.locator('text=SauceCard #31337');
    await expect(paymentMethod).toBeVisible();

    // Shipping Information
    const shippingLabel = page.locator('text=Shipping Information:');
    await expect(shippingLabel).toBeVisible();
    
    const shippingMethod = page.locator('text=Free Pony Express Delivery!');
    await expect(shippingMethod).toBeVisible();

    // Price Total
    const priceTotal = page.locator('text=Price Total');
    await expect(priceTotal).toBeVisible();

    // Step 4: Complete order
    await page.click('[data-test="finish"]');
    await page.waitForURL('**/checkout-complete.html');

    // Verify completion
    await expect(page.locator('text=Thank you for your order!')).toBeVisible();
  });
});
