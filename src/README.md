# POM Framework - Source Code Guide

> This directory contains the Page Object Model framework for Playwright automation tests.

## 📁 Directory Structure

```
src/
├── pages/              # Page Object classes
├── types/              # TypeScript interfaces and types
├── config/             # Application configuration
├── utils/              # Test utilities and helpers
└── fixtures/           # Playwright test fixtures
```

## 📄 Files Overview

### `pages/` - Page Object Classes

**Purpose:** Encapsulate page interactions and locators

| File | Purpose | Key Classes |
|------|---------|------------|
| `BasePage.ts` | Foundation class for all pages | `BasePage` |
| `LoginPage.ts` | Authentication page | `LoginPage` |
| `InventoryPage.ts` | Product listing page | `InventoryPage` |
| `CartPage.ts` | Shopping cart page | `CartPage` |
| `CheckoutPage.ts` | Checkout workflow | `CheckoutPage` |
| `index.ts` | Centralized exports | - |

**Usage:**
```typescript
import { LoginPage, InventoryPage } from '@/pages';

const loginPage = new LoginPage(page);
await loginPage.login(credentials);
```

### `types/` - TypeScript Definitions

**Purpose:** Define strong types for test data

| File | Contains |
|------|----------|
| `index.ts` | All interfaces and types |

**Defined Types:**
- `UserCredentials` - Login credentials
- `CheckoutFormData` - Checkout form fields
- `Product` - Product information
- `CartItem` - Item in cart
- `OrderInfo` - Order details
- `NavigationState` - Page state
- `TestConfig` - Test configuration

**Usage:**
```typescript
import { UserCredentials, CheckoutFormData } from '@/types';

const credentials: UserCredentials = {
  username: 'user',
  password: 'pass'
};
```

### `config/` - Configuration

**Purpose:** Centralize app configuration and constants

| File | Contains |
|------|----------|
| `app.config.ts` | URLs, credentials, timeouts, constants |

**Available Constants:**
- `APP_CONFIG` - App settings (base URL, viewport, timeout)
- `TEST_CREDENTIALS` - Valid test users
- `PAGE_URLS` - All page URL patterns
- `TIMEOUTS` - Wait timeout values

**Usage:**
```typescript
import { APP_CONFIG, TEST_CREDENTIALS } from '@/config/app.config';

console.log(APP_CONFIG.BASE_URL); // 'https://www.saucedemo.com'
```

### `utils/` - Helper Functions

**Purpose:** Provide reusable helper functions and utilities

| Class | Purpose | Methods |
|-------|---------|---------|
| `AuthHelper` | Authentication workflows | `loginAsStandardUser()`, `loginWithCredentials()` |
| `ShoppingHelper` | Shopping operations | `addProductToCart()`, `addMultipleProductsToCart()` |
| `CheckoutHelper` | Checkout workflows | `completeCheckout()`, `verifyOrderCompletion()` |
| `TestDataFactory` | Generate test data | `generateCheckoutFormData()`, `getRandomFirstName()` |
| `WaitHelper` | Synchronization utilities | `waitForElement()`, `waitForNavigation()` |
| `ReportHelper` | Screenshot and debugging | `takeScreenshot()`, `getPageState()` |

**Usage:**
```typescript
import { AuthHelper, TestDataFactory } from '@/utils/test-helpers';

await AuthHelper.loginAsStandardUser(page);
const formData = TestDataFactory.generateCheckoutFormData();
```

### `fixtures/` - Playwright Fixtures

**Purpose:** Auto-initialize page objects and setup browser

| File | Purpose | Fixtures |
|------|---------|----------|
| `test-fixtures.ts` | Custom test setup | `setupBrowser`, `loginPage`, `inventoryPage`, `cartPage`, `checkoutPage` |

**Available Fixtures:**
- `setupBrowser` - Auto-setup viewport and browser
- `loginPage` - Auto-created LoginPage instance
- `inventoryPage` - Auto-created InventoryPage instance
- `cartPage` - Auto-created CartPage instance
- `checkoutPage` - Auto-created CheckoutPage instance

**Usage:**
```typescript
import { test } from '@/fixtures/test-fixtures';

test('My Test', async ({ loginPage, inventoryPage }) => {
  // Page objects are ready to use
  await loginPage.login(credentials);
});
```

---

## 🚀 Quick Start

### 1. Basic Test
```typescript
import { test, expect } from '../../src/fixtures/test-fixtures';

test('Login test', async ({ loginPage }) => {
  await loginPage.navigateToLoginPage();
  await loginPage.login({
    username: 'standard_user',
    password: 'secret_sauce'
  });
});
```

### 2. Using Helpers
```typescript
import { AuthHelper, ShoppingHelper } from '../../src/utils/test-helpers';

test('Shopping test', async ({ page, inventoryPage }) => {
  await AuthHelper.loginAsStandardUser(page);
  await ShoppingHelper.addProductToCart(page, 'product-id');
});
```

### 3. With Test Data Factory
```typescript
import { TestDataFactory } from '../../src/utils/test-helpers';

test('Checkout test', async ({ checkoutPage }) => {
  const formData = TestDataFactory.generateCheckoutFormData();
  await checkoutPage.fillCheckoutForm(formData);
});
```

---

## 📊 Class Relationships

```
BasePage (Abstract Foundation)
    ↑
    ├─ LoginPage
    ├─ InventoryPage
    ├─ CartPage
    └─ CheckoutPage

Helpers (Independent Utilities)
    ├─ AuthHelper (uses page objects)
    ├─ ShoppingHelper (uses page objects)
    ├─ CheckoutHelper (uses page objects)
    └─ TestDataFactory (generates data)
    └─ WaitHelper (synchronization)
    └─ ReportHelper (debugging)

Fixtures (Test Setup)
    ├─ setupBrowser (auto-runs)
    └─ Page Object Fixtures (auto-created per fixture)

Type System (No instances, pure types)
    ├─ UserCredentials
    ├─ CheckoutFormData
    └─ (other interfaces)

Configuration (Constants)
    ├─ APP_CONFIG
    ├─ TEST_CREDENTIALS
    ├─ PAGE_URLS
    └─ TIMEOUTS
```

---

## 🎯 Design Patterns Used

### 1. **Page Object Pattern**
- Each page is a class
- Locators are private
- Actions are public methods
- See: `pages/*.ts`

### 2. **Fixture Pattern**
- Auto-setup page objects
- Browser configuration
- See: `fixtures/test-fixtures.ts`

### 3. **Helper Pattern**
- Encapsulate workflows
- DRY principle
- See: `utils/test-helpers.ts`

### 4. **Data Factory Pattern**
- Generate test data
- Consistent data
- See: `TestDataFactory` class

### 5. **Type Safety Pattern**
- TypeScript interfaces
- No `any` types
- See: `types/index.ts`

---

## 🔧 Extending the Framework

### Add New Page Object

1. Create `pages/NewPage.ts`:
```typescript
import { BasePage } from './BasePage';

export class NewPage extends BasePage {
  private readonly locator1 = this.page.locator('...');
  
  async action1(): Promise<void> {
    // Implementation
  }
  
  async getState(): Promise<string> {
    // Implementation
  }
}
```

2. Export from `pages/index.ts`:
```typescript
export { NewPage } from './NewPage';
```

3. Add fixture in `fixtures/test-fixtures.ts`:
```typescript
newPage: async ({ page }, use) => {
  const newPage = new NewPage(page);
  await use(newPage);
}
```

4. Use in tests:
```typescript
test('test', async ({ newPage }) => {
  await newPage.action1();
});
```

### Add New Helper

1. Add to `utils/test-helpers.ts`:
```typescript
export class NewHelper {
  static async operation1(page: Page): Promise<void> {
    // Implementation
  }
}
```

2. Use in tests:
```typescript
import { NewHelper } from '@/utils/test-helpers';

await NewHelper.operation1(page);
```

### Add New Configuration

1. Add to `config/app.config.ts`:
```typescript
export const NEW_CONFIG = {
  SETTING1: 'value1',
  SETTING2: 123,
} as const;
```

2. Use in code:
```typescript
import { NEW_CONFIG } from '@/config/app.config';
```

---

## 📚 Documentation

- **POM_FRAMEWORK_GUIDE.md** - Complete comprehensive guide
- **QUICK_REFERENCE.md** - Quick lookup reference
- **ARCHITECTURE.md** - Architecture diagrams
- **IMPLEMENTATION_SUMMARY.md** - Implementation overview

---

## 🧪 Testing Best Practices

1. ✅ Use page object methods, not direct element access
2. ✅ Leverage fixtures for page object creation
3. ✅ Use helpers for common workflows
4. ✅ Generate test data with factories
5. ✅ Always await async operations
6. ✅ Wait for elements before interaction
7. ✅ Use TypeScript interfaces
8. ✅ Keep locators private
9. ✅ Group related methods
10. ✅ Write descriptive test names

---

## 📈 Framework Statistics

| Metric | Value |
|--------|-------|
| Base Class Methods | 30+ |
| Page Object Classes | 4 |
| Helper Classes | 6 |
| Type Definitions | 6+ |
| Test Examples | 8 |
| Total Methods | 100+ |
| Lines of Code | 1800+ |

---

## 🔗 Import Paths

```typescript
// From tests, import relative to test file location
import { test, expect } from '../../src/fixtures/test-fixtures';
import { LoginPage, InventoryPage } from '../../src/pages';
import { AuthHelper, ShoppingHelper } from '../../src/utils/test-helpers';
import { UserCredentials, CheckoutFormData } from '../../src/types';
import { APP_CONFIG, TEST_CREDENTIALS } from '../../src/config/app.config';

// Or use path aliases if configured in tsconfig.json
import { test, expect } from '@/fixtures/test-fixtures';
import { LoginPage } from '@/pages';
```

---

## 🎓 Learning Resources

### Official Documentation
- [Playwright Docs](https://playwright.dev)
- [Playwright POM](https://playwright.dev/docs/pom)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

### In This Project
- `POM_FRAMEWORK_GUIDE.md` - How to use the framework
- `QUICK_REFERENCE.md` - Quick lookup
- `tests/e2e/saucedemo-checkout-pom.spec.ts` - Example tests

---

## ✨ Key Features

- ✅ Modular page object classes
- ✅ Fixture-based test setup
- ✅ Strong TypeScript typing
- ✅ Reusable helper functions
- ✅ Centralized configuration
- ✅ Test data factories
- ✅ Comprehensive documentation
- ✅ Production-ready code

---

**Happy Testing! 🚀**
