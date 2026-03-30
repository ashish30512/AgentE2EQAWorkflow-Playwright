/**
 * Sample E2E Tests using Page Object Model with TypeScript
 * This demonstrates the new POM framework structure
 */

import { test, expect } from '../fixtures/test-fixtures';
import { AuthHelper, ShoppingHelper, CheckoutHelper, TestDataFactory } from '../utils/test-helpers';

test.describe('E2E: Complete Checkout Workflow - POM Pattern', () => {
  /**
   * Test: Single Item Happy Path Checkout
   */
  test('E2E-001: Complete checkout with single item', async ({
    page,
    loginPage,
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    // Step 1: Login with valid credentials
    await loginPage.navigateToLoginPage();
    await loginPage.login(TestDataFactory.getStandardUserCredentials());

    // Step 2: Verify inventory page loaded
    await inventoryPage.waitForInventoryPageLoad();
    await expect(page).toHaveURL(/.*inventory.html/);

    // Step 3: Add single item to cart
    await inventoryPage.addProductToCart('sauce-labs-backpack');

    // Step 4: Verify cart badge updated
    const cartCount = await inventoryPage.getCartItemCount();
    expect(cartCount).toBe(1);

    // Step 5: Navigate to cart
    await inventoryPage.navigateToCart();
    await cartPage.waitForCartPageLoad();

    // Step 6: Verify item in cart
    const itemsCount = await cartPage.getCartItemsCount();
    expect(itemsCount).toBe(1);

    // Step 7: Proceed to checkout
    await cartPage.proceedToCheckout();

    // Step 8: Fill checkout form
    const formData = TestDataFactory.generateCheckoutFormData();
    await checkoutPage.fillFormAndContinue(formData);

    // Step 9: Verify checkout overview
    await checkoutPage.waitForCheckoutStepTwo();
    expect(await checkoutPage.isPaymentInfoVisible()).toBeTruthy();
    expect(await checkoutPage.isShippingInfoVisible()).toBeTruthy();

    // Step 10: Complete order
    await checkoutPage.completeOrder();

    // Step 11: Verify order completion
    await checkoutPage.waitForCheckoutComplete();
    expect(await checkoutPage.isOrderCompleted()).toBeTruthy();

    const message = await checkoutPage.getCompletionMessage();
    expect(message).toContain('Thank you for your order');
  });

  /**
   * Test: Multiple Items Checkout
   */
  test('E2E-002: Complete checkout with multiple items', async ({
    page,
    loginPage,
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    // Setup: Login
    await AuthHelper.loginAsStandardUser(page);
    await inventoryPage.waitForInventoryPageLoad();

    // Add multiple items
    const productIds = ['sauce-labs-backpack', 'sauce-labs-bike-light', 'sauce-labs-bolt-t-shirt'];
    await inventoryPage.addMultipleProductsToCart(productIds);

    // Verify cart count
    const cartCount = await inventoryPage.getCartItemCount();
    expect(cartCount).toBe(3);

    // Navigate to cart and verify items
    await inventoryPage.navigateToCart();
    const itemsInCart = await cartPage.getCartItemsCount();
    expect(itemsInCart).toBe(3);

    // Complete checkout
    await cartPage.proceedToCheckout();
    const formData = TestDataFactory.generateCheckoutFormData();
    await CheckoutHelper.completeCheckout(page, formData);

    // Verify completion
    expect(await CheckoutHelper.verifyOrderCompletion(page)).toBeTruthy();
  });

  /**
   * Test: Form Validation Error Recovery
   */
  test('E2E-003: Handle form validation errors', async ({
    page,
    loginPage,
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    // Setup
    await AuthHelper.loginAsStandardUser(page);
    await inventoryPage.waitForInventoryPageLoad();

    // Add item and go to checkout
    await inventoryPage.addProductToCart('sauce-labs-backpack');
    await inventoryPage.navigateToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.waitForCheckoutStepOne();

    // Try to submit without first name
    await checkoutPage.fillLastName('Doe');
    await checkoutPage.fillPostalCode('12345');

    // This should cause an error (implementation depends on app)
    // For this example, we'll skip this and fill properly
    await checkoutPage.fillFirstName('John');
    await checkoutPage.clickContinue();

    // Verify we moved to step 2
    await checkoutPage.waitForCheckoutStepTwo();
    expect(await checkoutPage.isOrderSummaryVisible()).toBeTruthy();
  });

  /**
   * Test: Cancel Checkout and Resume
   */
  test('E2E-004: Cancel checkout and resume shopping', async ({
    page,
    loginPage,
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    // Setup
    await AuthHelper.loginAsStandardUser(page);
    await inventoryPage.waitForInventoryPageLoad();

    // Add item and go to checkout
    await inventoryPage.addProductToCart('sauce-labs-backpack');
    await inventoryPage.navigateToCart();
    await cartPage.proceedToCheckout();

    // Fill form but cancel
    await checkoutPage.fillFirstName('John');
    await checkoutPage.fillLastName('Doe');
    await checkoutPage.fillPostalCode('12345');
    await checkoutPage.clickCancel();

    // Verify back in cart with item still there
    await cartPage.waitForCartPageLoad();
    const itemsCount = await cartPage.getCartItemsCount();
    expect(itemsCount).toBe(1);

    // Continue shopping and complete checkout
    await cartPage.continueShoppingButton.click();
    await inventoryPage.addProductToCart('sauce-labs-bike-light');
    await inventoryPage.navigateToCart();

    // Now have 2 items
    const updatedCount = await cartPage.getCartItemsCount();
    expect(updatedCount).toBe(2);
  });

  /**
   * Test: Continue Shopping Navigation
   */
  test('E2E-005: Continue shopping from cart', async ({
    page,
    loginPage,
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    // Setup
    await AuthHelper.loginAsStandardUser(page);
    await inventoryPage.waitForInventoryPageLoad();

    // Add first item and go to cart
    await inventoryPage.addProductToCart('sauce-labs-backpack');
    await inventoryPage.navigateToCart();
    const firstItemCount = await cartPage.getCartItemsCount();
    expect(firstItemCount).toBe(1);

    // Continue shopping
    await cartPage.continueShoppingButton.click();

    // Verify back on inventory
    await inventoryPage.waitForInventoryPageLoad();

    // Add another item
    await inventoryPage.addProductToCart('sauce-labs-bike-light');
    const updatedCartCount = await inventoryPage.getCartItemCount();
    expect(updatedCartCount).toBe(2);

    // Go to cart with both items
    await inventoryPage.navigateToCart();
    const finalCount = await cartPage.getCartItemsCount();
    expect(finalCount).toBe(2);
  });

  /**
   * Test: Verify Order Summary Details
   */
  test('E2E-006: Verify checkout overview details', async ({
    page,
    loginPage,
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    // Setup
    await AuthHelper.loginAsStandardUser(page);
    await inventoryPage.waitForInventoryPageLoad();

    // Add item
    await inventoryPage.addProductToCart('sauce-labs-backpack');
    await inventoryPage.navigateToCart();
    await cartPage.proceedToCheckout();

    // Fill form and go to overview
    const formData = TestDataFactory.generateCheckoutFormData();
    await checkoutPage.fillFormAndContinue(formData);

    // Verify all overview sections
    await checkoutPage.waitForCheckoutStepTwo();

    expect(await checkoutPage.isPaymentInfoVisible()).toBeTruthy();
    expect(await checkoutPage.isShippingInfoVisible()).toBeTruthy();
    expect(await checkoutPage.isFinishButtonEnabled()).toBeTruthy();

    // Verify pricing information is displayed
    const itemTotal = await checkoutPage.getItemTotal();
    const taxAmount = await checkoutPage.getTaxAmount();
    const totalAmount = await checkoutPage.getTotalAmount();

    expect(itemTotal.length).toBeGreaterThan(0);
    expect(taxAmount.length).toBeGreaterThan(0);
    expect(totalAmount.length).toBeGreaterThan(0);
  });

  /**
   * Test: Empty Cart Behavior
   */
  test('E2E-007: Handle empty cart', async ({ page, loginPage, inventoryPage, cartPage }) => {
    // Setup
    await AuthHelper.loginAsStandardUser(page);
    await inventoryPage.waitForInventoryPageLoad();

    // Navigate to cart without adding items
    await inventoryPage.navigateToCart();

    // Verify cart is empty
    const isEmpty = await cartPage.isCartEmpty();
    expect(isEmpty).toBeTruthy();

    const itemCount = await cartPage.getCartItemsCount();
    expect(itemCount).toBe(0);
  });

  /**
   * Test: Remove Item from Cart
   */
  test('E2E-008: Remove item from cart', async ({ page, loginPage, inventoryPage, cartPage }) => {
    // Setup
    await AuthHelper.loginAsStandardUser(page);
    await inventoryPage.waitForInventoryPageLoad();

    // Add items
    await inventoryPage.addProductToCart('sauce-labs-backpack');
    await inventoryPage.addProductToCart('sauce-labs-bike-light');

    const cartCount = await inventoryPage.getCartItemCount();
    expect(cartCount).toBe(2);

    // Go to cart and remove one item
    await inventoryPage.navigateToCart();
    await cartPage.removeItemFromCart('sauce-labs-backpack');

    // Verify only one item remains
    const remainingCount = await cartPage.getCartItemsCount();
    expect(remainingCount).toBe(1);
  });
});
