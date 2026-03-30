# POM Framework - Quick Reference Guide

## File Locations
```
src/
├── pages/              # Page Objects
├── types/              # TypeScript interfaces
├── config/             # App configuration
├── utils/              # Helper functions
└── fixtures/           # Test setup fixtures

tests/
└── e2e/                # E2E tests using POM
```

## Quick Start Examples

### Example 1: Login Test
```typescript
import { test } from '../fixtures/test-fixtures';
import { AuthHelper, TestDataFactory } from '../utils/test-helpers';

test('User can login', async ({ loginPage, page }) => {
  await loginPage.navigateToLoginPage();
  await loginPage.login(TestDataFactory.getStandardUserCredentials());
  // Your test continues...
});
```

### Example 2: Shopping Flow
```typescript
test('Add item to cart', async ({ inventoryPage, cartPage }) => {
  await inventoryPage.waitForInventoryPageLoad();
  await inventoryPage.addProductToCart('sauce-labs-backpack');
  
  const count = await inventoryPage.getCartItemCount();
  expect(count).toBe(1);
  
  await inventoryPage.navigateToCart();
  await cartPage.waitForCartPageLoad();
});
```

### Example 3: Complete Checkout
```typescript
import { CheckoutHelper, TestDataFactory, AuthHelper } from '../utils/test-helpers';

test('Complete checkout', async ({ page, checkoutPage }) => {
  // Setup
  await AuthHelper.loginAsStandardUser(page);
  
  // Checkout
  const formData = TestDataFactory.generateCheckoutFormData();
  await CheckoutHelper.completeCheckout(page, formData);
  
  // Verify
  expect(await CheckoutHelper.verifyOrderCompletion(page)).toBeTruthy();
});
```

## Page Objects At a Glance

### LoginPage
```typescript
loginPage.navigateToLoginPage()
loginPage.login(credentials)
loginPage.fillUsername(username)
loginPage.fillPassword(password)
loginPage.clickLoginButton()
loginPage.getErrorMessage()
loginPage.isLoginPageDisplayed()
```

### InventoryPage
```typescript
inventoryPage.waitForInventoryPageLoad()
inventoryPage.addProductToCart(productId)
inventoryPage.addMultipleProductsToCart(productIds)
inventoryPage.removeProductFromCart(productId)
inventoryPage.navigateToCart()
inventoryPage.getCartItemCount()
inventoryPage.getAllProductNames()
inventoryPage.getAllProductPrices()
```

### CartPage
```typescript
cartPage.waitForCartPageLoad()
cartPage.removeItemFromCart(productId)
cartPage.proceedToCheckout()
cartPage.continueShoppingButton.click()
cartPage.getCartItemsCount()
cartPage.getAllCartItemNames()
cartPage.isCartEmpty()
cartPage.isItemInCart(productName)
```

### CheckoutPage
```typescript
checkoutPage.waitForCheckoutStepOne()
checkoutPage.fillCheckoutForm(formData)
checkoutPage.fillFirstName(firstName)
checkoutPage.fillLastName(lastName)
checkoutPage.fillPostalCode(postalCode)
checkoutPage.clickContinue()
checkoutPage.waitForCheckoutStepTwo()
checkoutPage.completeOrder()
checkoutPage.getItemTotal()
checkoutPage.getTaxAmount()
checkoutPage.getTotalAmount()
checkoutPage.waitForCheckoutComplete()
checkoutPage.isOrderCompleted()
checkoutPage.clickBackToProducts()
```

## Helper Functions

### AuthHelper
```typescript
await AuthHelper.loginAsStandardUser(page)
await AuthHelper.loginWithCredentials(page, credentials)
await AuthHelper.loginExpectingError(page, credentials)
```

### ShoppingHelper
```typescript
await ShoppingHelper.addProductToCart(page, productId)
await ShoppingHelper.addMultipleProductsToCart(page, productIds)
await ShoppingHelper.viewCart(page)
await ShoppingHelper.removeFromCart(page, productId)
await ShoppingHelper.getCartCount(page)
```

### CheckoutHelper
```typescript
await CheckoutHelper.completeCheckout(page, formData)
await CheckoutHelper.verifyOrderCompletion(page)
await CheckoutHelper.returnToProducts(page)
```

### TestDataFactory
```typescript
TestDataFactory.generateCheckoutFormData()        // Random form data
TestDataFactory.getStandardUserCredentials()      // Get valid user
TestDataFactory.getRandomFirstName()
TestDataFactory.getRandomLastName()
TestDataFactory.getRandomPostalCode()
```

## BasePage Common Methods

```typescript
// Navigation
await page.goto(url)
await page.waitForNavigation(urlPattern)
page.getCurrentUrl()
await page.getPageTitle()

// Interactions
await page.click(locator)
await page.fill(locator, text)
await page.type(locator, text)
await page.hover(locator)

// Waiting
await page.waitForElementVisible(locator)
await page.waitForElementHidden(locator)
await page.isVisible(locator)

// Assertions
await page.expectVisible(locator)
await page.expectTextContent(locator, text)
await page.expectHasAttribute(locator, attr, value)

// Utilities
await page.takeScreenshot(filename)
await page.scrollToElement(locator)
```

## Common Patterns

### Pattern 1: Setup and Test
```typescript
test('test name', async ({ loginPage, inventoryPage }) => {
  // Setup
  await loginPage.loginAndNavigateToInventory(credentials);
  
  // Test
  await inventoryPage.addProductToCart('product-id');
  
  // Verify
  expect(await inventoryPage.getCartItemCount()).toBe(1);
});
```

### Pattern 2: Using Helpers
```typescript
test('test name', async ({ page, cartPage }) => {
  // Setup
  await AuthHelper.loginAsStandardUser(page);
  await ShoppingHelper.addProductToCart(page, 'product-id');
  
  // Verify
  await ShoppingHelper.viewCart(page);
  expect(await cartPage.getCartItemsCount()).toBe(1);
});
```

### Pattern 3: Data Factory
```typescript
test('test name', async ({ checkoutPage }) => {
  const formData = TestDataFactory.generateCheckoutFormData();
  const credentials = TestDataFactory.getStandardUserCredentials();
  
  // Use in test...
});
```

## Type Definitions

```typescript
// User credentials
interface UserCredentials {
  username: string;
  password: string;
}

// Checkout form
interface CheckoutFormData {
  firstName: string;
  lastName: string;
  postalCode: string;
}

// Product
interface Product {
  id: string;
  name: string;
  price: string;
  description?: string;
}
```

## Configuration

### Test Credentials
```typescript
// Available in TEST_CREDENTIALS:
TEST_CREDENTIALS.STANDARD_USER
TEST_CREDENTIALS.PROBLEM_USER
TEST_CREDENTIALS.LOCKED_OUT_USER
TEST_CREDENTIALS.PERFORMANCE_GLITCH_USER
```

### Timeouts
```typescript
TIMEOUTS.SHORT      // 5 seconds
TIMEOUTS.MEDIUM     // 10 seconds
TIMEOUTS.LONG       // 30 seconds
TIMEOUTS.VERY_LONG  // 60 seconds
```

### Page URLs
```typescript
PAGE_URLS.LOGIN                  // /
PAGE_URLS.INVENTORY             // /inventory.html
PAGE_URLS.CART                  // /cart.html
PAGE_URLS.CHECKOUT_STEP_ONE     // /checkout-step-one.html
PAGE_URLS.CHECKOUT_STEP_TWO     // /checkout-step-two.html
PAGE_URLS.CHECKOUT_COMPLETE     // /checkout-complete.html
```

## Running Tests

### Run all tests
```bash
npx playwright test
```

### Run specific test file
```bash
npx playwright test tests/e2e/saucedemo-checkout-pom.spec.ts
```

### Run specific test
```bash
npx playwright test -g "Complete checkout with single item"
```

### Run with headed browser
```bash
npx playwright test --headed
```

### Debug test
```bash
npx playwright test --debug
```

## Best Practices Checklist

- [ ] Keep locators private in page objects
- [ ] Use descriptive method names
- [ ] Always await async operations
- [ ] Wait for element visibility before interaction
- [ ] Use TypeScript interfaces for type safety
- [ ] Group related methods together
- [ ] Create helper methods for repetitive tasks
- [ ] Use test fixtures for page objects
- [ ] Follow AAA pattern (Arrange, Act, Assert)
- [ ] Use test data factory for consistent data
- [ ] Take screenshots for debugging
- [ ] Handle errors gracefully

## Troubleshooting

### Element not found
```typescript
// Wait for element before interaction
await page.waitForElementVisible(locator, timeout);
await page.click(locator);
```

### Test timeout
```typescript
// Use appropriate timeout
await page.waitForNavigation(urlPattern, TIMEOUTS.LONG);
```

### Flaky tests
```typescript
// Add explicit waits
await page.waitForPageLoad();
await page.waitForMs(300); // Small delay if needed
```

### Debugging
```typescript
// Take screenshot at point of failure
await ReportHelper.takeScreenshot(page, 'debug-point');

// Get page state for analysis
const state = await ReportHelper.getPageState(page);
console.log(state);
```

## Tips & Tricks

1. **Reuse test data**: Use `TestDataFactory` for consistent test data
2. **Chain operations**: Most methods support chaining for efficiency
3. **Use helpers**: `AuthHelper`, `ShoppingHelper` for common workflows
4. **Type everything**: Always use TypeScript types for better code
5. **DRY principle**: Create helper methods to avoid code duplication
6. **Sleep sparingly**: Use explicit waits instead of hardcoded delays
7. **Screenshot debugging**: Always take screenshots when tests fail

## Need More Examples?

Check out: `tests/e2e/saucedemo-checkout-pom.spec.ts`

All examples in the file demonstrate:
- ✅ Login flows
- ✅ Shopping operations
- ✅ Checkout processes
- ✅ Error handling
- ✅ Using helpers and fixtures
- ✅ Data generation
- ✅ Assertions and verification
