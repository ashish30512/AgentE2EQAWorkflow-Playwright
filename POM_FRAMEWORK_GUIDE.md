# Page Object Model (POM) Framework - Complete Guide

## Table of Contents
1. [Project Structure](#project-structure)
2. [Architecture Overview](#architecture-overview)
3. [Page Object Classes](#page-object-classes)
4. [Types and Interfaces](#types-and-interfaces)
5. [Fixtures](#fixtures)
6. [Test Helpers](#test-helpers)
7. [Best Practices](#best-practices)
8. [Usage Examples](#usage-examples)
9. [Improvements Over Previous Structure](#improvements-over-previous-structure)

---

## Project Structure

```
project-root/
├── src/
│   ├── pages/                          # Page Object classes
│   │   ├── BasePage.ts                # Base class with common methods
│   │   ├── LoginPage.ts               # Login page object
│   │   ├── InventoryPage.ts           # Products/Inventory page object
│   │   ├── CartPage.ts                # Shopping cart page object
│   │   ├── CheckoutPage.ts            # Checkout process page object
│   │   └── index.ts                   # Export all page objects
│   │
│   ├── types/                          # TypeScript types and interfaces
│   │   └── index.ts                   # All type definitions
│   │
│   ├── config/                         # Configuration and constants
│   │   └── app.config.ts              # App config, credentials, URLs
│   │
│   ├── utils/                          # Utility and helper functions
│   │   └── test-helpers.ts            # Test helpers and data factories
│   │
│   └── fixtures/                       # Playwright fixtures
│       └── test-fixtures.ts           # Custom test fixtures
│
├── tests/
│   └── e2e/
│       └── saucedemo-checkout-pom.spec.ts  # Refactored tests using POM
│
└── playwright.config.ts               # Playwright configuration
```

---

## Architecture Overview

### Three-Layer Architecture

```
┌─────────────────────────────────────────┐
│         TEST LAYER                      │
│   (Test specifications/cases)           │
│   - saucedemo-checkout-pom.spec.ts     │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      PAGE OBJECT LAYER                  │
│   (Page interactions abstraction)       │
│   - LoginPage, InventoryPage, etc.     │
│   - Encapsulates locators & actions    │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      BASE LAYER                         │
│   (Foundation & utilities)              │
│   - BasePage (common methods)          │
│   - Helpers (auth, shopping, etc.)     │
│   - Types & Configuration              │
└─────────────────────────────────────────┘
```

---

## Page Object Classes

### BasePage - Foundation Class

**Purpose:** Provides reusable methods for all page objects

**Key Methods:**
- Navigation: `goto()`, `waitForNavigation()`, `getCurrentUrl()`
- Element Interaction: `click()`, `fill()`, `type()`, `hover()`
- Element Waiting: `waitForElementVisible()`, `waitForElementHidden()`
- Assertions: `expectVisible()`, `expectTextContent()`, `expectHasAttribute()`
- Utilities: `takeScreenshot()`, `scrollToElement()`, `reloadPage()`

**Usage:**
```typescript
// BasePage provides common functionality
await basePage.click(locator);
await basePage.fill(inputLocator, 'text');
await basePage.waitForElementVisible(elementLocator);
```

### Individual Page Objects

**Pattern:** Each page extends `BasePage` and encapsulates:
1. **Locators** - Private locators for page elements
2. **Actions** - Public methods representing user interactions
3. **Assertions** - Methods to verify page state

**Example: LoginPage Structure**
```typescript
class LoginPage extends BasePage {
  // Private locators
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;

  // Public actions
  async login(credentials: UserCredentials): Promise<void>
  async loginAndNavigateToInventory(credentials: UserCredentials): Promise<void>
  async fillUsername(username: string): Promise<void>

  // Getters/Assertions
  async getErrorMessage(): Promise<string>
  async isLoginPageDisplayed(): Promise<boolean>
  async isErrorMessageVisible(): Promise<boolean>
}
```

### Page Objects in This Framework

| Page | Purpose | Key Methods |
|------|---------|------------|
| **LoginPage** | Handle authentication | `login()`, `fillUsername()`, `fillPassword()` |
| **InventoryPage** | Product listing & cart mgmt | `addProductToCart()`, `navigateToCart()`, `getCartItemCount()` |
| **CartPage** | Shopping cart operations | `proceedToCheckout()`, `removeItemFromCart()`, `continueShoppingButton` |
| **CheckoutPage** | Checkout workflow | `fillCheckoutForm()`, `completeOrder()`, `isOrderCompleted()` |

---

## Types and Interfaces

### Key Interfaces Defined

```typescript
// User authentication
interface UserCredentials {
  username: string;
  password: string;
}

// Checkout form data
interface CheckoutFormData {
  firstName: string;
  lastName: string;
  postalCode: string;
}

// Product information
interface Product {
  id: string;
  name: string;
  price: string;
  description?: string;
}

// Cart item representation
interface CartItem {
  product: Product;
  quantity: number;
}

// Order information
interface OrderInfo {
  items: CartItem[];
  subtotal: string;
  tax: string;
  total: string;
}
```

**Benefits:**
- Strong typing for better IDE support
- Prevents runtime errors
- Self-documenting code
- Better refactoring with TypeScript

---

## Fixtures

### Playwright Custom Fixtures

Located in: `src/fixtures/test-fixtures.ts`

**Available Fixtures:**
```typescript
test.extend<PageFixtures>({
  setupBrowser: auto-setup viewport
  loginPage: auto-created LoginPage instance
  inventoryPage: auto-created InventoryPage instance
  cartPage: auto-created CartPage instance
  checkoutPage: auto-created CheckoutPage instance
})
```

**Usage:**
```typescript
test('my test', async ({ loginPage, cartPage, inventoryPage }) => {
  // All page objects are ready to use
  await loginPage.login(credentials);
  // ...
});
```

**Advantages:**
- ✅ Automatic page object creation per test
- ✅ Consistent browser setup (viewport, etc.)
- ✅ Cleaner test code
- ✅ Type-safe with TypeScript

---

## Test Helpers

### Helper Classes for Common Operations

**AuthHelper** - Authentication operations
```typescript
await AuthHelper.loginAsStandardUser(page);
await AuthHelper.loginWithCredentials(page, credentials);
await AuthHelper.loginExpectingError(page, credentials);
```

**ShoppingHelper** - Shopping cart operations
```typescript
await ShoppingHelper.addProductToCart(page, 'product-id');
await ShoppingHelper.addMultipleProductsToCart(page, productIds);
await ShoppingHelper.viewCart(page);
```

**CheckoutHelper** - Checkout workflow
```typescript
await CheckoutHelper.completeCheckout(page, formData);
await CheckoutHelper.verifyOrderCompletion(page);
await CheckoutHelper.returnToProducts(page);
```

**TestDataFactory** - Generate test data
```typescript
const formData = TestDataFactory.generateCheckoutFormData();
const credentials = TestDataFactory.getStandardUserCredentials();
const firstName = TestDataFactory.getRandomFirstName();
```

**WaitHelper** - Synchronization utilities
```typescript
await WaitHelper.waitForElement(page, selector);
await WaitHelper.waitForNavigation(page, urlPattern);
await WaitHelper.waitForMs(1000);
```

**ReportHelper** - Screenshot and debugging
```typescript
await ReportHelper.takeScreenshot(page, 'test-name');
const state = await ReportHelper.getPageState(page);
```

---

## Best Practices

### 1. **Locator Management**
✅ Keep locators private in page classes
✅ Use data-test attributes when available
✅ Avoid hardcoding XPath expressions
✅ Use descriptive locator variable names

```typescript
// Good
private readonly checkoutButton: Locator = page.locator('[data-test="checkout"]');

// Avoid
const btn = page.locator('//button');
```

### 2. **Method Organization**
✅ Group methods by functionality (Navigation, Actions, Assertions)
✅ Use clear, descriptive method names
✅ One action per method
✅ Use consistent naming patterns

```typescript
// Good
async clickLoginButton(): Promise<void> { }
async fillUsername(username: string): Promise<void> { }
async isLoginButtonEnabled(): Promise<boolean> { }

// Avoid
async click(): Promise<void> { }
async f(u: string): Promise<void> { }
```

### 3. **Error Handling**
✅ Use appropriate timeouts
✅ Wait for page state before interactions
✅ Handle async operations properly

```typescript
// Good
await this.waitForElementVisible(this.loginButton, TIMEOUTS.MEDIUM);
await this.click(this.loginButton);

// Avoid
await this.click(this.loginButton); // May fail if not visible
```

### 4. **Test Structure**
✅ Use AAA pattern: Arrange → Act → Assert
✅ One primary assertion per test
✅ Use descriptive test names
✅ Leverage fixtures for page objects

```typescript
test('E2E-001: Complete checkout with single item', async ({
  loginPage, inventoryPage, cartPage, checkoutPage
}) => {
  // Arrange
  await AuthHelper.loginAsStandardUser(page);

  // Act
  await inventoryPage.addProductToCart('product-id');
  await inventoryPage.navigateToCart();

  // Assert
  expect(await cartPage.getCartItemsCount()).toBe(1);
});
```

### 5. **Reusability**
✅ Create helper functions for common workflows
✅ Use data factories for test data
✅ Leverage base class methods
✅ Create fixtures for setup/teardown

### 6. **Type Safety**
✅ Always specify return types
✅ Use interfaces for data structures
✅ Avoid `any` type
✅ Use const assertions for constants

```typescript
// Good
async login(credentials: UserCredentials): Promise<void> { }
const formData: CheckoutFormData = { /* ... */ };

// Avoid
async login(credentials: any) { }
const formData = { /* ... */ };
```

### 7. **Async/Await**
✅ Always use async/await
✅ Don't mix promises and callbacks
✅ Wait for page states before interactions
✅ Use proper timeout values

```typescript
// Good
await this.page.waitForURL('**/inventory.html');
await this.click(this.loginButton);

// Avoid
this.page.goto(url)
  .then(() => page.click(selector));
```

---

## Usage Examples

### Example 1: Simple Login Test
```typescript
test('User can login successfully', async ({ loginPage }) => {
  await loginPage.navigateToLoginPage();
  await loginPage.login({
    username: 'standard_user',
    password: 'secret_sauce'
  });
  // Test continues after login
});
```

### Example 2: Complete Checkout Flow
```typescript
test('Complete checkout with multiple items', async ({
  loginPage, inventoryPage, cartPage, checkoutPage
}) => {
  // Login
  await loginPage.navigateToLoginPage();
  await loginPage.loginAndNavigateToInventory({
    username: 'standard_user',
    password: 'secret_sauce'
  });

  // Shop
  await inventoryPage.addMultipleProductsToCart([
    'sauce-labs-backpack',
    'sauce-labs-bike-light'
  ]);

  // Checkout
  await inventoryPage.navigateToCart();
  await cartPage.proceedToCheckout();
  
  const formData = {
    firstName: 'John',
    lastName: 'Doe',
    postalCode: '12345'
  };
  
  await checkoutPage.fillFormAndContinue(formData);
  await checkoutPage.completeOrder();
  
  // Verify
  expect(await checkoutPage.isOrderCompleted()).toBeTruthy();
});
```

### Example 3: Using Test Helpers
```typescript
test('Quick checkout with helpers', async ({ page, cartPage, checkoutPage }) => {
  // Setup
  await AuthHelper.loginAsStandardUser(page);
  await ShoppingHelper.addProductToCart(page, 'product-id');
  
  // Checkout
  await ShoppingHelper.viewCart(page);
  const formData = TestDataFactory.generateCheckoutFormData();
  await CheckoutHelper.completeCheckout(page, formData);
  
  // Verify
  expect(await CheckoutHelper.verifyOrderCompletion(page)).toBeTruthy();
});
```

### Example 4: Error Handling
```typescript
test('Handle invalid credentials', async ({ loginPage }) => {
  await loginPage.navigateToLoginPage();
  
  const errorMessage = await AuthHelper.loginExpectingError(page, {
    username: 'invalid_user',
    password: 'wrong_password'
  });
  
  expect(errorMessage).toContain('do not match');
});
```

---

## Improvements Over Previous Structure

### Before (Old Structure)
```typescript
// Old approach - Mixed concerns in tests
test('E2E-001', async () => {
  await page.goto(URL);
  await page.fill('[data-test="username"]', username);
  await page.fill('[data-test="password"]', password);
  await page.click('[data-test="login-button"]');
  
  // ... many more direct element interactions
  const cartBadge = page.locator('.shopping_cart_badge');
  await expect(cartBadge).toContainText('1');
});
```

### After (New POM Framework)
```typescript
// New approach - Clean, maintainable, reusable
test('E2E-001: Complete checkout with single item', async ({
  loginPage, inventoryPage, cartPage, checkoutPage
}) => {
  await loginPage.loginAndNavigateToInventory(TestDataFactory.getStandardUserCredentials());
  await inventoryPage.addProductToCart('sauce-labs-backpack');
  expect(await inventoryPage.getCartItemCount()).toBe(1);
  
  // ... continues with high-level actions
});
```

### Key Improvements

| Aspect | Before | After |
|--------|--------|-------|
| **Locator Management** | Scattered in tests | Centralized in page classes |
| **Reusability** | Low - copy/paste code | High - shared page objects |
| **Maintenance** | Hard - change = update many tests | Easy - change locator once |
| **Readability** | Hard - complex steps | Easy - clear method names |
| **Type Safety** | None - `any` types | Full - TypeScript interfaces |
| **Test Data** | Hardcoded | Centralized in factories |
| **Setup/Config** | Ad-hoc | Organized with fixtures |
| **Code Organization** | Monolithic | Modular layers |

---

## Getting Started

### 1. Update your tests to use new fixtures:
```typescript
import { test, expect } from '../fixtures/test-fixtures';
```

### 2. Use page object methods instead of direct element access:
```typescript
// Instead of: await page.click('[data-test="login-button"]');
await loginPage.clickLoginButton();
```

### 3. Leverage helpers for common workflows:
```typescript
await AuthHelper.loginAsStandardUser(page);
```

### 4. Use TypeScript interfaces for type safety:
```typescript
const credentials: UserCredentials = { /* ... */ };
```

---

## Migration Checklist

- [ ] Install types: `npm install --save-dev @types/node`
- [ ] Update imports in existing tests
- [ ] Replace element locators with page object methods
- [ ] Use fixtures instead of manual setup
- [ ] Add TypeScript interfaces for test data
- [ ] Run tests to verify everything works
- [ ] Remove old test utilities and duplicate code
- [ ] Document new patterns in team guidelines

---

## Common Questions

**Q: Should I make page object methods static?**
A: No - keep them as instance methods. This allows better state management and flexibility.

**Q: How do I handle dynamic elements?**
A: Create methods that accept the dynamic part as a parameter:
```typescript
async removeItemFromCart(productId: string): Promise<void> {
  const removeButton = this.page.locator(`[data-test="remove-${productId}"]`);
  await this.click(removeButton);
}
```

**Q: Can I have multiple page classes?**
A: Yes! Create one for each logical page/flow. Group related pages together conceptually.

**Q: How do I test error scenarios?**
A: Create dedicated methods for error cases in page objects:
```typescript
async loginExpectError(credentials: UserCredentials): Promise<void>
async getErrorMessage(): Promise<string>
```

---

## Conclusion

The Page Object Model framework provides:
- ✅ **Maintainability** - Easy to update and refactor
- ✅ **Reusability** - DRY principle applied
- ✅ **Scalability** - Grows with your application
- ✅ **Readability** - Clear test intent
- ✅ **Type Safety** - Catch errors early with TypeScript

This structure is production-ready and follows industry best practices!
