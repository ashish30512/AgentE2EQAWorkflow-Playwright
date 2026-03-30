# Page Object Model Framework Architecture

## 📐 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    TEST LAYER                                   │
│          (Playwright Test Specifications)                       │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  tests/e2e/saucedemo-checkout-pom.spec.ts                  ││
│  │  ✓ E2E-001: Single Item Checkout                           ││
│  │  ✓ E2E-002: Multiple Items Checkout                        ││
│  │  ✓ E2E-003: Form Validation                                ││
│  │  ✓ E2E-004: Cancel and Resume                              ││
│  │  ✓ E2E-005: Continue Shopping                              ││
│  │  ✓ E2E-006: Order Overview Verification                    ││
│  │  ✓ E2E-007: Empty Cart Handling                            ││
│  │  ✓ E2E-008: Remove Items                                   ││
│  └─────────────────────────────────────────────────────────────┘│
└──────────────────────┬──────────────────────────────────────────┘
                       │
       ┌───────────────┼───────────────┐
       │               │               │
       ▼               ▼               ▼
   ┌────────────────────────────────────────────┐
   │       PAGE OBJECT LAYER                    │
   │  (Encapsulated Business Logic)             │
   │                                            │
   │  ┌──────────────────────────────────────┐ │
   │  │  LoginPage                           │ │
   │  │  • login()                           │ │
   │  │  • fillUsername()                    │ │
   │  │  • fillPassword()                    │ │
   │  │  • getErrorMessage()                 │ │
   │  │  • isErrorMessageVisible()           │ │
   │  └──────────────────────────────────────┘ │
   │                                            │
   │  ┌──────────────────────────────────────┐ │
   │  │  InventoryPage                       │ │
   │  │  • addProductToCart()                │ │
   │  │  • addMultipleProductsToCart()       │ │
   │  │  • removeProductFromCart()           │ │
   │  │  • navigateToCart()                  │ │
   │  │  • getCartItemCount()                │ │
   │  │  • getAllProductNames()              │ │
   │  └──────────────────────────────────────┘ │
   │                                            │
   │  ┌──────────────────────────────────────┐ │
   │  │  CartPage                            │ │
   │  │  • proceedToCheckout()               │ │
   │  │  • removeItemFromCart()              │ │
   │  │  • continueShoppingButton            │ │
   │  │  • getCartItemsCount()               │ │
   │  │  • getAllCartItemNames()             │ │
   │  │  • isCartEmpty()                     │ │
   │  └──────────────────────────────────────┘ │
   │                                            │
   │  ┌──────────────────────────────────────┐ │
   │  │  CheckoutPage                        │ │
   │  │  • fillCheckoutForm()                │ │
   │  │  • fillFirstName()                   │ │
   │  │  • fillLastName()                    │ │
   │  │  • fillPostalCode()                  │ │
   │  │  • completeOrder()                   │ │
   │  │  • isOrderCompleted()                │ │
   │  │  • getItemTotal()                    │ │
   │  │  • clickBackToProducts()             │ │
   │  └──────────────────────────────────────┘ │
   │                                            │
   │         ▲                                  │
   │         │ All extend                       │
   │         │                                  │
   │  ┌──────┴──────────────────────────────┐  │
   │  │  BasePage (Foundation Class)         │  │
   │  │  • click(), fill(), type()          │  │
   │  │  • waitForElement(), isVisible()    │  │
   │  │  • takeScreenshot(), hover()        │  │
   │  │  • getText(), getInputValue()       │  │
   │  │  • expect*() assertion methods      │  │
   │  │  (30+ reusable methods)             │  │
   │  └─────────────────────────────────────┘  │
   └────────────────────────────────────────────┘
                       │
       ┌───────────────┼───────────────┐
       │               │               │
       ▼               ▼               ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Fixtures     │  │ Helpers      │  │ Utilities    │
│              │  │              │  │              │
│ ✓ loginPage  │  │ AuthHelper   │  │ TestDataFact │
│ ✓ inventory  │  │ ShoppingHlpr │  │ WaitHelper   │
│ ✓ cartPage   │  │ CheckoutHlpr │  │ ReportHelper │
│ ✓ checkout   │  │              │  │              │
│ ✓ setupBrwsr │  │              │  │              │
└──────────────┘  └──────────────┘  └──────────────┘
       │                  │                    │
       └──────────────────┼────────────────────┘
                          │
       ┌──────────────────┼──────────────────┐
       │                  │                  │
       ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Types        │  │ Config       │  │ Playwright   │
│              │  │              │  │              │
│ ✓ Creds      │  │ ✓ TIMEOUT    │  │ ✓ Page       │
│ ✓ FormData   │  │ ✓ PAGE_URL   │  │ ✓ Locator    │
│ ✓ Product    │  │ ✓ BASE_URL   │  │ ✓ expect()   │
│ ✓ CartItem   │  │ ✓ TESTDATA   │  │              │
│ ✓ OrderInfo  │  │              │  │              │
└──────────────┘  └──────────────┘  └──────────────┘
       │                  │                    │
       └──────────────────┼────────────────────┘
                          │
                          ▼
                  ┌──────────────────────┐
                  │  Browser/Application │
                  │  https://saucedemo.. │
                  └──────────────────────┘
```

## 🔄 Data Flow Diagram

```
Test Execution Flow:

1. Test Starts
   │
   ├─→ Fixtures Initialized (browser setup)
   │
   ├─→ Page Objects Created
   │   ├── LoginPage instance
   │   ├── InventoryPage instance
   │   ├── CartPage instance
   │   └── CheckoutPage instance
   │
   ├─→ Test Method Called
   │   │
   │   ├─→ Page Object Method Called
   │   │   │
   │   │   ├─→ BasePage Method
   │   │   │   │
   │   │   │   ├─→ Locator Identified
   │   │   │   │
   │   │   │   ├─→ Element Interaction
   │   │   │   │   (click, fill, etc.)
   │   │   │   │
   │   │   │   └─→ Wait/Verify
   │   │   │
   │   │   └─→ Return Result
   │   │
   │   ├─→ Assertion on Result
   │   │
   │   └─→ Next Step
   │
   ├─→ Helper Functions (Optional)
   │   ├── AuthHelper.loginAsStandardUser()
   │   ├── TestDataFactory.generateCheckoutFormData()
   │   └── etc.
   │
   └─→ Test Completes
       │
       └─→ Cleanup & Reporting
```

## 🎯 Class Hierarchy

```
              Playwright
                │
                ▼
      ┌─────────────────────┐
      │   BasePage          │
      │  (Foundation)       │
      │                     │
      │ - click()           │
      │ - fill()            │
      │ - waitFor...()      │
      │ - expect...()       │
      │ + 25 more methods   │
      └─────────────────────┘
              ▲ ▲ ▲ ▲
              │ │ │ │
      ┌───────┘ │ │ └────────────┐
      │         │ │              │
      ▼         ▼ ▼              ▼
   ┌─────┐  ┌──────┐  ┌──────┐  ┌────────┐
   │Login│  │Invnt │  │ Cart │  │Checkout│
   │Page │  │ory   │  │Page  │  │Page    │
   │     │  │Page  │  │      │  │        │
   └─────┘  └──────┘  └──────┘  └────────┘
```

## 📊 Method Organization Pattern

```
Each Page Object Follows This Pattern:

┌─ Page Object Class
│
├─ PRIVATE: Locators
│  ├── private readonly usernameInput
│  ├── private readonly loginButton
│  └── (element references)
│
├─ CONSTRUCTOR
│  └── Initialize all locators
│
├─ SECTION 1: Navigation Methods
│  ├── goto()
│  ├── navigateToNextPage()
│  └── waitForPageLoad()
│
├─ SECTION 2: Action Methods
│  ├── login()
│  ├── fillForm()
│  ├── clickButton()
│  └── (user interactions)
│
└─ SECTION 3: Assertion/Getter Methods
   ├── isPageDisplayed()
   ├── getErrorMessage()
   ├── isButtonEnabled()
   └── (state verification)
```

## 🔗 Helper Pattern

```
Helper Classes Provide Workflows:

┌─ AuthHelper
│  ├── loginAsStandardUser(page)
│  ├── loginWithCredentials(page, creds)
│  └── loginExpectingError(page, creds)
│
├─ ShoppingHelper
│  ├── addProductToCart(page, id)
│  ├── addMultipleProductsToCart(page, ids)
│  ├── viewCart(page)
│  └── removeFromCart(page, id)
│
├─ CheckoutHelper
│  ├── completeCheckout(page, formData)
│  ├── verifyOrderCompletion(page)
│  └── returnToProducts(page)
│
├─ TestDataFactory
│  ├── generateCheckoutFormData()
│  ├── getStandardUserCredentials()
│  └── getRandomFirstName()
│
└─ WaitHelper / ReportHelper
   └── Various utility functions
```

## 💾 Data Model

```
┌─ UserCredentials
│  ├── username: string
│  └── password: string
│
├─ CheckoutFormData
│  ├── firstName: string
│  ├── lastName: string
│  └── postalCode: string
│
├─ Product
│  ├── id: string
│  ├── name: string
│  ├── price: string
│  └── description?: string
│
├─ CartItem
│  ├── product: Product
│  └── quantity: number
│
└─ OrderInfo
   ├── items: CartItem[]
   ├── subtotal: string
   ├── tax: string
   └── total: string
```

## 🎭 Test Execution Sequence

```
┌─ Test Starts
│  │
│  ├─ Browser Initialized (Fixture Setup)
│  │  └─ Viewport set (1920x1080)
│  │
│  ├─ Page Objects Created
│  │  ├─ loginPage = new LoginPage(page)
│  │  ├─ inventoryPage = new InventoryPage(page)
│  │  ├─ cartPage = new CartPage(page)
│  │  └─ checkoutPage = new CheckoutPage(page)
│  │
│  ├─ Test Method Execution
│  │  │
│  │  ├─ Login
│  │  │  └─ await loginPage.login(credentials)
│  │  │
│  │  ├─ Shop
│  │  │  ├─ inventoryPage.addProductToCart()
│  │  │  └─ inventoryPage.navigateToCart()
│  │  │
│  │  ├─ Review & Checkout
│  │  │  └─ cartPage.proceedToCheckout()
│  │  │
│  │  ├─ Fill Form
│  │  │  └─ checkoutPage.fillCheckoutForm(formData)
│  │  │
│  │  ├─ Complete Order
│  │  │  └─ checkoutPage.completeOrder()
│  │  │
│  │  └─ Verify
│  │     └─ expect(await checkoutPage.isOrderCompleted()).toBeTruthy()
│  │
│  └─ Browser Closed (Auto-cleanup)
│
└─ Test Completes
   └─ Report Generated
```

## 🌐 File Dependencies

```
Test File
    │
    ├─→ Test Fixtures
    │   ├─→ Page Objects
    │   │   └─→ BasePage
    │   │       └─→ Playwright Test
    │   │
    │   ├─→ Types
    │   │   └─→ TypeScript
    │   │
    │   └─→ Config
    │       └─→ Constants
    │
    ├─→ Helpers
    │   ├─→ Types
    │   └─→ Page Objects
    │
    └─→ Test Data
        └─→ TestDataFactory
```

## 🔐 Encapsulation Layers

```
Layer 1: Tests (What to test)
│
Layer 2: Page Objects (How to interact)
│   └─ Encapsulate: Element locators, Element interactions
│
Layer 3: BasePage (Foundation)
│   └─ Encapsulate: Common browser interactions
│
Layer 4: Helpers (Workflows)
│   └─ Encapsulate: Multi-step processes
│
Layer 5: Configuration (Constants)
│   └─ Encapsulate: Credentials, URLs, Timeouts
```

---

## 📈 Scalability Growth

```
Phase 1: Single Page Tests
├─ LoginPage ✓
├─ InventoryPage ✓
├─ CartPage ✓
└─ CheckoutPage ✓

Phase 2: Add More Pages
├─ AddProductDetailPage
├─ AddUserProfilePage
├─ AddOrderHistoryPage
└─ Extend helpers as needed

Phase 3: Add Features
├─ AddFiltersPage
├─ AddComparisonPage
├─ AddReviewPage
└─ AddWishlistPage

Phase 4: Production Scale
├─ Multiple test suites
├─ Parallel execution
├─ CI/CD integration
└─ Advanced reporting
```

---

**This architecture ensures scalability, maintainability, and professional test automation practices! ✨**
