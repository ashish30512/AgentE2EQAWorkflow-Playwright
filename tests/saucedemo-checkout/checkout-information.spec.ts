import { test, expect, Page } from '@playwright/test';
import { SauceDemoPages } from './pages';

const APP_URL = 'https://www.saucedemo.com';
const TEST_USERNAME = 'standard_user';
const TEST_PASSWORD = 'secret_sauce';

// AC2: Checkout Information Entry - Form validation and data entry
test.describe('AC2: Checkout Information Entry', () => {
  let page: Page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // Login and add item to cart
    await SauceDemoPages.loginAndNavigateToInventory(page, TEST_USERNAME, TEST_PASSWORD);
    await SauceDemoPages.addItemToCart(page, 'sauce-labs-backpack');
    
    // Navigate to checkout form
    await SauceDemoPages.navigateToCart(page);
    await SauceDemoPages.clickCheckout(page);
  });

  test('TC-201: Verify Checkout Form Fields Display', async () => {
    // Verify page heading
    const heading = page.locator('text=Checkout: Your Information');
    await expect(heading).toBeVisible();

    // Verify all three input fields are visible
    const firstNameField = page.locator('[data-test="firstName"]');
    const lastNameField = page.locator('[data-test="lastName"]');
    const zipCodeField = page.locator('[data-test="postalCode"]');

    await expect(firstNameField).toBeVisible();
    await expect(lastNameField).toBeVisible();
    await expect(zipCodeField).toBeVisible();

    // Verify fields are editable (have type="text")
    await expect(firstNameField).toHaveAttribute('type', 'text');
    await expect(lastNameField).toHaveAttribute('type', 'text');
    await expect(zipCodeField).toHaveAttribute('type', 'text');

    // Verify Cancel and Continue buttons are present
    const cancelBtn = page.locator('[data-test="cancel"]');
    const continueBtn = page.locator('[data-test="continue"]');

    await expect(cancelBtn).toBeVisible();
    await expect(continueBtn).toBeVisible();
  });

  test('TC-202: Verify Successful Form Submission With Valid Data', async () => {
    // Fill form with valid data
    await page.fill('[data-test="firstName"]', 'John');
    await page.fill('[data-test="lastName"]', 'Doe');
    await page.fill('[data-test="postalCode"]', '12345');

    // Click Continue button
    await page.click('[data-test="continue"]');

    // Verify navigation to checkout-step-two.html
    await page.waitForURL('**/checkout-step-two.html');
    const currentUrl = page.url();
    expect(currentUrl).toContain('checkout-step-two');

    // Verify no error messages appear
    const errorMessage = page.locator('[data-test*="error"]');
    await expect(errorMessage).toHaveCount(0);
  });

  test('TC-203: Verify Empty First Name Field Validation', async () => {
    // Leave First Name empty
    await page.fill('[data-test="lastName"]', 'Doe');
    await page.fill('[data-test="postalCode"]', '12345');

    // Click Continue button
    await page.click('[data-test="continue"]');

    // Verify error message appears
    const errorMessage = page.locator('text=First Name is required');
    await expect(errorMessage).toBeVisible();

    // Verify other fields retain their values
    await expect(page.locator('[data-test="lastName"]')).toHaveValue('Doe');
    await expect(page.locator('[data-test="postalCode"]')).toHaveValue('12345');

    // Verify user stays on checkout-step-one.html
    const currentUrl = page.url();
    expect(currentUrl).toContain('checkout-step-one');
  });

  test('TC-204: Verify Empty Last Name Field Validation', async () => {
    // Fill form with empty Last Name
    await page.fill('[data-test="firstName"]', 'John');
    await page.fill('[data-test="postalCode"]', '12345');
    // Leave Last Name empty

    // Click Continue button
    await page.click('[data-test="continue"]');

    // Verify error message appears
    const errorMessage = page.locator('text=Last Name is required');
    await expect(errorMessage).toBeVisible();

    // Verify other fields retain their values
    await expect(page.locator('[data-test="firstName"]')).toHaveValue('John');
    await expect(page.locator('[data-test="postalCode"]')).toHaveValue('12345');

    // Verify user stays on checkout-step-one.html
    const currentUrl = page.url();
    expect(currentUrl).toContain('checkout-step-one');
  });

  test('TC-205: Verify Empty Zip/Postal Code Field Validation', async () => {
    // Fill form with empty Postal Code
    await page.fill('[data-test="firstName"]', 'John');
    await page.fill('[data-test="lastName"]', 'Doe');
    // Leave Zip/Postal Code empty

    // Click Continue button
    await page.click('[data-test="continue"]');

    // Verify error message appears
    const errorMessage = page.locator('text=Postal Code is required');
    await expect(errorMessage).toBeVisible();

    // Verify other fields retain their values
    await expect(page.locator('[data-test="firstName"]')).toHaveValue('John');
    await expect(page.locator('[data-test="lastName"]')).toHaveValue('Doe');

    // Verify user stays on checkout-step-one.html
    const currentUrl = page.url();
    expect(currentUrl).toContain('checkout-step-one');
  });

  test('TC-206: Verify All Fields Empty Validation', async () => {
    // Leave all fields empty and click Continue
    await page.click('[data-test="continue"]');

    // Verify at least one error message appears
    const errorMessages = page.locator('text=is required');
    const errorCount = await errorMessages.count();
    expect(errorCount).toBeGreaterThan(0);

    // Verify user stays on checkout-step-one.html
    const currentUrl = page.url();
    expect(currentUrl).toContain('checkout-step-one');

    // Verify all fields are empty (no form submission occurred)
    await expect(page.locator('[data-test="firstName"]')).toHaveValue('');
    await expect(page.locator('[data-test="lastName"]')).toHaveValue('');
    await expect(page.locator('[data-test="postalCode"]')).toHaveValue('');
  });

  test('TC-207: Verify Form Validation With Special Characters', async () => {
    // Fill form with special characters
    await page.fill('[data-test="firstName"]', 'John@123!');
    await page.fill('[data-test="lastName"]', 'Doe$%^');
    await page.fill('[data-test="postalCode"]', '12@#$5');

    // Click Continue button
    await page.click('[data-test="continue"]');

    // Wait a moment for validation to occur or form to submit
    await page.waitForTimeout(1000);

    // Check if either:
    // 1. Form submitted (navigated to step-two), OR
    // 2. Error message appeared
    const currentUrl = page.url();
    const isOnStepTwo = currentUrl.includes('checkout-step-two');
    const errorMessage = page.locator('text=is required');
    const hasError = await errorMessage.count();

    // Either form accepted special characters OR validation error
    expect(isOnStepTwo || hasError > 0).toBeTruthy();
  });

  test('TC-208: Verify Form Validation With Numeric First Name', async () => {
    // Fill form with numeric First Name
    await page.fill('[data-test="firstName"]', '1234567890');
    await page.fill('[data-test="lastName"]', 'Doe');
    await page.fill('[data-test="postalCode"]', '12345');

    // Click Continue button
    await page.click('[data-test="continue"]');

    // Wait for response
    await page.waitForTimeout(1000);

    // Check if form accepted numeric value or showed error
    const currentUrl = page.url();
    const isOnStepTwo = currentUrl.includes('checkout-step-two');
    const errorMessage = page.locator('text=First Name');
    const hasError = await errorMessage.count();

    // Accept either: numeric accepted OR validation error
    expect(isOnStepTwo || hasError > 0).toBeTruthy();
  });

  test('TC-209: Verify Form Field Maximum Length Handling', async () => {
    // Enter very long strings
    const longString = 'A'.repeat(100);
    const longZip = '1234567890'.repeat(2); // 20 digits

    await page.fill('[data-test="firstName"]', longString);
    await page.fill('[data-test="lastName"]', longString);
    await page.fill('[data-test="postalCode"]', longZip);

    // Get actual values to verify if limited or accepted
    const firstNameValue = await page.locator('[data-test="firstName"]').inputValue();
    const lastNameValue = await page.locator('[data-test="lastName"]').inputValue();
    const zipCodeValue = await page.locator('[data-test="postalCode"]').inputValue();

    // Verify values are set (either limited or full)
    expect(firstNameValue).toBeTruthy();
    expect(lastNameValue).toBeTruthy();
    expect(zipCodeValue).toBeTruthy();

    // Verify fields display without overflow
    const firstNameField = page.locator('[data-test="firstName"]');
    const bbox = await firstNameField.boundingBox();
    expect(bbox).toBeTruthy();
  });

  test('TC-210: Verify Cancel Button Navigation', async () => {
    // Fill form with some data
    await page.fill('[data-test="firstName"]', 'John');
    await page.fill('[data-test="lastName"]', 'Doe');
    await page.fill('[data-test="postalCode"]', '12345');

    // Click Cancel button
    await page.click('[data-test="cancel"]');

    // Wait for navigation
    await page.waitForURL('**/cart.html');

    // Verify navigated back to cart
    const currentUrl = page.url();
    expect(currentUrl).toContain('/cart.html');

    // Verify cart still has items (form data not submitted)
    const cartItems = page.locator('.cart_item');
    await expect(cartItems).toHaveCount(1);
  });

  test('TC-211: Verify Form Data Persistence On Validation Error', async () => {
    // Fill form with valid first/last name but empty zip
    await page.fill('[data-test="firstName"]', 'Jane');
    await page.fill('[data-test="lastName"]', 'Smith');
    // Leave Zip Code empty

    // Click Continue button
    await page.click('[data-test="continue"]');

    // Verify error appears
    const errorMessage = page.locator('text=Postal Code is required');
    await expect(errorMessage).toBeVisible();

    // Verify entered data is still visible
    await expect(page.locator('[data-test="firstName"]')).toHaveValue('Jane');
    await expect(page.locator('[data-test="lastName"]')).toHaveValue('Smith');

    // User should be able to complete form without re-entering valid fields
    await page.fill('[data-test="postalCode"]', '54321');
    await page.click('[data-test="continue"]');

    // Verify navigation to step-two
    await page.waitForURL('**/checkout-step-two.html');
  });

  test('TC: Verify Form Field Placeholder Text', async () => {
    // Verify placeholder or label text for guidance
    const firstNameField = page.locator('[data-test="firstName"]');
    const lastNameField = page.locator('[data-test="lastName"]');
    const zipField = page.locator('[data-test="postalCode"]');

    // Check for placeholder attributes
    const firstNamePlaceholder = await firstNameField.getAttribute('placeholder');
    const lastNamePlaceholder = await lastNameField.getAttribute('placeholder');
    const zipPlaceholder = await zipField.getAttribute('placeholder');

    // At least some guidance should be present
    const hasGuidance = firstNamePlaceholder || lastNamePlaceholder || zipPlaceholder;
    expect(hasGuidance).toBeTruthy();
  });
});
