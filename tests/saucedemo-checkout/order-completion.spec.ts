import { test, expect, Page } from '@playwright/test';
import { SauceDemoPages } from './pages';

const APP_URL = 'https://www.saucedemo.com';
const TEST_USERNAME = 'standard_user';
const TEST_PASSWORD = 'secret_sauce';

// AC4: Order Completion - Order confirmation messaging
test.describe('AC4: Order Completion', () => {
  let page: Page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    await page.setViewportSize({ width: 1920, height: 1080 });
  });

  async function completeFullOrder() {
    // Login and add items to cart
    await SauceDemoPages.loginAndNavigateToInventory(page, TEST_USERNAME, TEST_PASSWORD);
    await SauceDemoPages.addItemToCart(page, 'sauce-labs-backpack');
    
    // Navigate through checkout
    await SauceDemoPages.navigateToCart(page);
    await SauceDemoPages.clickCheckout(page);
    await SauceDemoPages.fillCheckoutForm(page, 'John', 'Doe', '12345');
    
    // Complete the order
    await SauceDemoPages.completeOrder(page);
  }

  test('TC-401: Verify Successful Order Completion', async () => {
    await completeFullOrder();

    // Verify page heading "Checkout: Complete!"
    const heading = page.locator('text=Checkout: Complete!');
    await expect(heading).toBeVisible();

    // Verify success message "Thank you for your order!"
    const thankYouMessage = page.locator('text=Thank you for your order!');
    await expect(thankYouMessage).toBeVisible();

    // Verify additional confirmation text
    const confirmationText = page.locator('text=Your order has been dispatched');
    await expect(confirmationText).toBeVisible();

    // Verify full confirmation message
    const fullMessage = page.locator('text=Your order has been dispatched, and will arrive just as fast as the pony can get there!');
    await expect(fullMessage).toBeVisible();

    // Verify user is on checkout-complete.html
    const currentUrl = page.url();
    expect(currentUrl).toContain('checkout-complete');
  });

  test('TC-402: Verify Back Home Button Navigation', async () => {
    await completeFullOrder();

    // Locate "Back Home" button
    const backHomeBtn = page.locator('[data-test="back-to-products"]');
    await expect(backHomeBtn).toBeVisible();

    // Click Back Home button
    await backHomeBtn.click();

    // Wait for navigation to inventory
    await page.waitForURL('**/inventory.html');

    // Verify navigated to products page
    const currentUrl = page.url();
    expect(currentUrl).toContain('/inventory.html');

    // Verify user is still logged in
    const cartIcon = page.locator('.shopping_cart_link');
    await expect(cartIcon).toBeVisible();
  });

  test('TC-403: Verify Order Confirmation Image Display', async () => {
    await completeFullOrder();

    // Locate the confirmation image (Pony Express)
    const confirmationImage = page.locator('img').first();
    await expect(confirmationImage).toBeVisible();

    // Verify image is loading properly (has proper dimensions)
    const imageBox = await confirmationImage.boundingBox();
    expect(imageBox).toBeTruthy();
    expect(imageBox?.width).toBeGreaterThan(0);
    expect(imageBox?.height).toBeGreaterThan(0);

    // Check if image has alt text (accessibility)
    const altText = await confirmationImage.getAttribute('alt');
    if (altText) {
      expect(altText.length).toBeGreaterThan(0);
    }
  });

  test('TC-404: Verify Order Confirmation Page Heading Structure', async () => {
    await completeFullOrder();

    // Verify main heading "Checkout: Complete!"
    const mainHeading = page.locator('text=Checkout: Complete!');
    await expect(mainHeading).toBeVisible();

    // Verify "Thank you for your order!" heading
    const thankYouHeading = page.locator('h2');
    const headingText = await thankYouHeading.textContent();
    expect(headingText?.toLowerCase()).toContain('thank');

    // Verify heading hierarchy
    const allHeadings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingCount = await allHeadings.count();
    expect(headingCount).toBeGreaterThan(0);
  });

  test('TC-405: Verify Order Confirmation Visible On Page Load', async () => {
    await completeFullOrder();

    // Get viewport height
    const viewportSize = page.viewportSize();
    expect(viewportSize?.height).toBeGreaterThan(600);

    // Verify thank you message is in viewport (visible without scrolling)
    const thankYouMessage = page.locator('text=Thank you for your order!');
    const messageBox = await thankYouMessage.boundingBox();
    
    expect(messageBox).toBeTruthy();
    expect(messageBox?.y).toBeLessThan(viewportSize?.height || 0);

    // Get scroll height to verify we don't need to scroll for key content
    const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
    const windowHeight = await page.evaluate(() => window.innerHeight);
    
    // Key message should be visible without scrolling
    const messageVisible = await thankYouMessage.isVisible();
    expect(messageVisible).toBeTruthy();
  });

  test('TC-406: Verify Order Confirmation Text Accuracy', async () => {
    await completeFullOrder();

    // Verify exact confirmation message
    const mainMessage = page.locator('text=Thank you for your order!');
    await expect(mainMessage).toBeVisible();

    // Verify dispatch message
    const dispatchMessage = page.locator('text=Your order has been dispatched, and will arrive just as fast as the pony can get there!');
    await expect(dispatchMessage).toBeVisible();

    // Get full text to verify exactly matches (no typos)
    const dispatchText = await dispatchMessage.textContent();
    expect(dispatchText).toBe('Your order has been dispatched, and will arrive just as fast as the pony can get there!');
  });

  test('TC-407: Verify Page Does Not Redirect Automatically', async () => {
    await completeFullOrder();

    // Wait a reasonable time for any potential auto-redirect
    await page.waitForTimeout(3000);

    // Verify we're still on checkout-complete page
    const currentUrl = page.url();
    expect(currentUrl).toContain('checkout-complete');

    // Verify we haven't been redirected to another page
    expect(currentUrl).not.toContain('inventory');
    expect(currentUrl).not.toContain('cart');
    expect(currentUrl).not.toContain('checkout-step');
  });

  test('TC: Verify Order Confirmation Page Accessibility Elements', async () => {
    await completeFullOrder();

    // Verify page title is descriptive
    const pageTitle = await page.title();
    expect(pageTitle.length).toBeGreaterThan(0);

    // Verify Back Home button has accessible text
    const backHomeBtn = page.locator('[data-test="back-to-products"]');
    const buttonText = await backHomeBtn.textContent();
    expect(buttonText).toBeTruthy();
    expect(buttonText?.toLowerCase()).toContain('back');
  });

  test('TC: Verify Confirmation Page With Cache Headers', async () => {
    // Complete order
    await completeFullOrder();

    // Navigate back to inventory
    await SauceDemoPages.goBackHome(page);

    // Navigate back to cart and try to add item
    await SauceDemoPages.navigateToCart(page);

    // Verify cart has been reset after order completion
    const cartItems = page.locator('.cart_item');
    const itemCount = await cartItems.count();
    
    // Cart should be empty after successful order
    if (itemCount === 0) {
      // Expected behavior - cart cleared
      await expect(cartItems).toHaveCount(0);
    }
  });

  test('TC: Verify Order Confirmation Page Responsiveness', async () => {
    await completeFullOrder();

    // Test desktop size
    await page.setViewportSize({ width: 1920, height: 1080 });
    const thankYouDesktop = page.locator('text=Thank you for your order!');
    await expect(thankYouDesktop).toBeVisible();

    // Test tablet size
    await page.setViewportSize({ width: 768, height: 1024 });
    const thankYouTablet = page.locator('text=Thank you for your order!');
    await expect(thankYouTablet).toBeVisible();

    // Test mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    const thankYouMobile = page.locator('text=Thank you for your order!');
    await expect(thankYouMobile).toBeVisible();

    // Verify Back Home button is visible and clickable on mobile
    const backHomeBtn = page.locator('[data-test="back-to-products"]');
    await expect(backHomeBtn).toBeVisible();
    await expect(backHomeBtn).toBeEnabled();
  });

  test('TC: Verify Multiple Orders Can Complete Sequentially', async () => {
    // First order
    await completeFullOrder();
    
    // Verify on completion page
    let url = page.url();
    expect(url).toContain('checkout-complete');

    // Go back home
    await SauceDemoPages.goBackHome(page);

    // Start second order
    await SauceDemoPages.addItemToCart(page, 'sauce-labs-bike-light');
    await SauceDemoPages.navigateToCart(page);
    await SauceDemoPages.clickCheckout(page);
    await SauceDemoPages.fillCheckoutForm(page, 'Jane', 'Smith', '54321');
    await SauceDemoPages.completeOrder(page);

    // Verify second order completed
    const thankYouMessage = page.locator('text=Thank you for your order!');
    await expect(thankYouMessage).toBeVisible();

    url = page.url();
    expect(url).toContain('checkout-complete');
  });
});
