# SauceDemo E-Commerce Checkout Test Plan
## SCRUM-101: Ecommerce Checkout Process

---

## Test Plan Overview

**Application URL:** https://www.saucedemo.com  
**Test Environment:** Chrome/Firefox/Safari  
**Test Credentials:**
- Username: `standard_user`
- Password: `secret_sauce`

**Tested Workflow Steps:**
1. Login to application
2. Add items to cart
3. Review cart contents
4. Initiate checkout
5. Enter shipping information
6. Review order details
7. Complete order
8. Verify order confirmation

---

## Acceptance Criteria Coverage

- **AC1:** Cart Review - Verifying cart items, totals, and navigation options
- **AC2:** Checkout Information Entry - Form validation and data entry
- **AC3:** Order Overview - Order summary verification
- **AC4:** Order Completion - Order confirmation messaging
- **AC5:** Error Handling - Validation errors and edge cases

---

# Test Scenarios

## AC1: Cart Review

### TC-101: Verify Empty Cart Display

**Acceptance Criteria:** AC1  
**Test Data:** None (start with empty cart)

**Steps:**
1. Navigate to https://www.saucedemo.com
2. Log in with credentials: `standard_user` / `secret_sauce`
3. Navigate to Cart page (https://www.saucedemo.com/cart.html)
4. Observe the cart contents area

**Expected Results:**
- Cart page displays with "Your Cart" heading
- Cart is empty (no items displayed)
- "Continue Shopping" button is present
- "Checkout" button is present (may be disabled)

---

### TC-102: Verify Cart With Single Item

**Acceptance Criteria:** AC1  
**Test Data:**
- Product: Sauce Labs Backpack
- Price: $29.99

**Steps:**
1. Navigate to inventory.html after logging in
2. Click "Add to cart" button for "Sauce Labs Backpack"
3. Navigate to the cart page
4. Observe the cart items section

**Expected Results:**
- Sauce Labs Backpack appears in cart with correct price ($29.99)
- Quantity field shows 1
- Product description is visible
- Item total displays correctly ($29.99)
- "Continue Shopping" button is present
- "Checkout" button is present and active

---

### TC-103: Verify Cart With Multiple Items

**Acceptance Criteria:** AC1  
**Test Data:**
- Items to add:
  - Sauce Labs Backpack ($29.99)
  - Sauce Labs Bike Light ($9.99)
  - Sauce Labs Bolt T-Shirt ($15.99)
- Expected Total: $55.97

**Steps:**
1. Navigate to inventory page after login
2. Add "Sauce Labs Backpack" to cart
3. Add "Sauce Labs Bike Light" to cart
4. Add "Sauce Labs Bolt T-Shirt" to cart
5. Navigate to cart page
6. Observe all items and total price

**Expected Results:**
- All three items appear in cart
- Each item displays correct name, price, and quantity (1 each)
- Item descriptions are visible
- Cart displays all items with correct pricing
- Subtotal shows $55.97
- Total price calculation is accurate

---

### TC-104: Verify Cart Continue Shopping Button

**Acceptance Criteria:** AC1  
**Test Data:** At least one item in cart

**Steps:**
1. Add a product to cart from inventory page
2. Navigate to cart page
3. Click "Continue Shopping" button
4. Verify navigation

**Expected Results:**
- Continue Shopping button is clickable
- User is redirected back to inventory page (inventory.html)
- Added items remain in cart (verified by navigating back to cart)

---

### TC-105: Verify Cart Item Price Calculation

**Acceptance Criteria:** AC1  
**Test Data:**
- Sauce Labs Fleece Jacket ($49.99) x2
- Expected Item Total: $99.98

**Steps:**
1. Add "Sauce Labs Fleece Jacket" to cart
2. Add another "Sauce Labs Fleece Jacket" to cart (or increase quantity to 2)
3. Navigate to cart page
4. Observe total price displayed

**Expected Results:**
- Both items appear in cart
- Quantity shows as 2 for the item
- Item total calculation is correct: $49.99 × 2 = $99.98
- Price displays with proper currency formatting ($)

---

### TC-106: Verify Cart Item Details Display

**Acceptance Criteria:** AC1  
**Test Data:** 
- Product: Test.allTheThings() T-Shirt (Red) ($15.99)

**Steps:**
1. Add "Test.allTheThings() T-Shirt (Red)" to cart
2. Navigate to cart page
3. Verify item information displayed

**Expected Results:**
- Product name is fully visible and readable
- Price is displayed correctly ($15.99)
- Quantity field is visible
- Product description details are shown
- Item layout is responsive and well-formatted
- No truncated text in item name or price fields

---

## AC2: Checkout Information Entry (with Validation)

### TC-201: Verify Checkout Form Fields Display

**Acceptance Criteria:** AC2  
**Test Data:** None

**Steps:**
1. Navigate to https://www.saucedemo.com/checkout-step-one.html
2. Observe the checkout form
3. Verify all form fields are present and properly labeled

**Expected Results:**
- Page heading displays "Checkout: Your Information"
- Three input fields are visible:
  - First Name (text input)
  - Last Name (text input)
  - Zip/Postal Code (text input)
- "Cancel" button is present (with back arrow icon)
- "Continue" button is present
- Form is cleanly formatted and readable
- All fields are active and accepting input

---

### TC-202: Verify Successful Form Submission With Valid Data

**Acceptance Criteria:** AC2  
**Test Data:**
- First Name: John
- Last Name: Doe
- Zip/Postal Code: 12345

**Steps:**
1. Navigate to checkout-step-one.html
2. Enter "John" in First Name field
3. Enter "Doe" in Last Name field
4. Enter "12345" in Zip/Postal Code field
5. Click "Continue" button
6. Verify navigation to next step

**Expected Results:**
- All fields accept input without errors
- Continue button is clickable
- User is redirected to checkout-step-two.html (Order Overview)
- No error messages appear
- Form submission is successful

---

### TC-203: Verify Empty First Name Field Validation

**Acceptance Criteria:** AC2  
**Test Data:**
- First Name: (empty)
- Last Name: Doe
- Zip/Postal Code: 12345

**Steps:**
1. Navigate to checkout-step-one.html
2. Leave First Name field empty
3. Enter "Doe" in Last Name field
4. Enter "12345" in Zip/Postal Code field
5. Click "Continue" button
6. Observe error message

**Expected Results:**
- Error message appears indicating "First Name is required"
- First Name field is highlighted with error indicator (red border/icon)
- Continue button remains clickable
- User stays on checkout-step-one.html
- Form data in other fields is preserved
- Other fields do not show error messages

---

### TC-204: Verify Empty Last Name Field Validation

**Acceptance Criteria:** AC2  
**Test Data:**
- First Name: John
- Last Name: (empty)
- Zip/Postal Code: 12345

**Steps:**
1. Navigate to checkout-step-one.html
2. Enter "John" in First Name field
3. Leave Last Name field empty
4. Enter "12345" in Zip/Postal Code field
5. Click "Continue" button
6. Observe error message

**Expected Results:**
- Error message appears indicating "Last Name is required"
- Last Name field is highlighted with error indicator
- First Name and Zip/Postal Code fields do not show errors
- User remains on checkout-step-one.html
- Form data in completed fields is preserved
- Continue button remains active

---

### TC-205: Verify Empty Zip/Postal Code Field Validation

**Acceptance Criteria:** AC2  
**Test Data:**
- First Name: John
- Last Name: Doe
- Zip/Postal Code: (empty)

**Steps:**
1. Navigate to checkout-step-one.html
2. Enter "John" in First Name field
3. Enter "Doe" in Last Name field
4. Leave Zip/Postal Code field empty
5. Click "Continue" button
6. Observe error message

**Expected Results:**
- Error message appears indicating "Zip/Postal Code is required"
- Zip/Postal Code field is highlighted with error indicator
- First Name and Last Name fields do not show errors
- User remains on checkout-step-one.html
- Previously entered data is preserved

---

### TC-206: Verify All Fields Empty Validation

**Acceptance Criteria:** AC2  
**Test Data:**
- First Name: (empty)
- Last Name: (empty)
- Zip/Postal Code: (empty)

**Steps:**
1. Navigate to checkout-step-one.html
2. Leave all three fields empty
3. Click "Continue" button
4. Observe all error messages

**Expected Results:**
- Multiple error messages appear (or one comprehensive error)
- At minimum one error message visible stating field is required
- All three fields show error indicators (red highlighting)
- User remains on checkout page
- Continue button remains active
- No form submission occurs

---

### TC-207: Verify Form Validation With Special Characters

**Acceptance Criteria:** AC2  
**Test Data:**
- First Name: John@123!
- Last Name: Doe$%^
- Zip/Postal Code: 12@#$5

**Steps:**
1. Navigate to checkout-step-one.html
2. Enter "John@123!" in First Name field
3. Enter "Doe$%^" in Last Name field
4. Enter "12@#$5" in Zip/Postal Code field
5. Click "Continue" button
6. Observe result

**Expected Results:**
- Special characters are accepted in input fields (no immediate validation error)
- Either:
  - Form submits successfully with special characters, OR
  - Validation error appears specifying which field contains invalid characters
- Error message is clear and specific if validation fails
- Fields are clearly marked with error indicators if invalid

---

### TC-208: Verify Form Validation With Numeric First Name

**Acceptance Criteria:** AC2  
**Test Data:**
- First Name: 1234567890
- Last Name: Doe
- Zip/Postal Code: 12345

**Steps:**
1. Navigate to checkout-step-one.html
2. Enter "1234567890" in First Name field
3. Enter valid data in remaining fields
4. Click "Continue" button
5. Observe result

**Expected Results:**
- Numeric value is accepted in the First Name field (if no specific validation exists), OR
- Validation error appears indicating First Name should contain letters
- If error appears, error message is clear and field is highlighted
- User can correct the field and resubmit

---

### TC-209: Verify Form Field Maximum Length Handling

**Acceptance Criteria:** AC2  
**Test Data:**
- First Name: A very long name with many characters that exceeds normal field length limitations when entered into the form field
- Last Name: Another extremely long last name entry
- Zip/Postal Code: 123456789012345

**Steps:**
1. Navigate to checkout-step-one.html
2. Attempt to enter very long text in First Name field (100+ characters)
3. Attempt to enter very long text in Last Name field (100+ characters)
4. Attempt to enter long zip code (15+ digits)
5. Click "Continue" button
6. Verify field behavior

**Expected Results:**
- Fields either:
  - Limit character input (maximum length enforcement), OR
  - Accept input and process successfully
- Form submission succeeds or fails with clear error message
- Fields are properly visible without breaking layout
- Text does not overflow outside field boundaries

---

### TC-210: Verify Cancel Button Navigation

**Acceptance Criteria:** AC2  
**Test Data:**
- First Name: John
- Last Name: Doe
- Zip/Postal Code: 12345

**Steps:**
1. Navigate to checkout-step-one.html
2. Enter data in all three fields (as listed above)
3. Click "Cancel" button
4. Observe navigation

**Expected Results:**
- Cancel button is clickable
- User is navigated back to cart page (cart.html)
- Entered form data is not saved/submitted
- Cart view is displayed with appropriate content

---

### TC-211: Verify Form Data Persistence On Validation Error

**Acceptance Criteria:** AC2  
**Test Data:**
- First Name: Jane
- Last Name: Smith
- Zip/Postal Code: (empty)

**Steps:**
1. Navigate to checkout-step-one.html
2. Enter "Jane" in First Name field
3. Enter "Smith" in Last Name field
4. Leave Zip/Postal Code field empty
5. Click "Continue" button
6. Verify error appears
7. Check if previously entered data is still visible in form fields

**Expected Results:**
- Validation error appears for empty Zip/Postal Code field
- First Name field still displays "Jane"
- Last Name field still displays "Smith"
- User can correct the error without re-entering valid fields
- User does not need to restart the form

---

### TC-212: Verify Browser Input Validation (HTML 5)

**Acceptance Criteria:** AC2  
**Test Data:**
- Zip/Postal Code field

**Steps:**
1. Navigate to checkout-step-one.html
2. Right-click on Zip/Postal Code field
3. Inspect the field element using browser developer tools
4. Verify input type attribute and validation constraints
5. Observe if HTML5 input type provides additional browser-level validation

**Expected Results:**
- Input field has appropriate type attribute (text, number, postal-code, etc.)
- If numeric type: browser may prevent non-numeric character input
- Placeholder text or label clearly indicates expected format
- Field accepts valid postal code format (5 digits for US)

---

## AC3: Order Overview

### TC-301: Verify Order Overview Page Display

**Acceptance Criteria:** AC3  
**Test Data:**
- Items in cart (from previous steps)
- Shipping Information: First Name: John, Last Name: Doe, Zip: 12345

**Steps:**
1. Complete checkout form from TC-202 with valid data
2. Verify page navigation to checkout-step-two.html
3. Observe the order overview page content

**Expected Results:**
- Page heading displays "Checkout: Overview"
- QTY (Quantity) column header is visible
- Description column header is visible
- All cart items are displayed in the overview
- Page layout is clear and well-formatted
- Navigation is successful without errors

---

### TC-302: Verify Order Summary With Single Item

**Acceptance Criteria:** AC3  
**Test Data:**
- Single item: Sauce Labs Backpack ($29.99)
- Item total: $29.99

**Steps:**
1. Add only Sauce Labs Backpack to cart
2. Navigate through checkout to Order Overview page
3. Verify order summary displays correctly

**Expected Results:**
- Order Overview page displays with heading "Checkout: Overview"
- Sauce Labs Backpack item is shown in the summary
- Price displays as $29.99
- Quantity shows as 1
- Item description/details are visible
- Order summary is accurate and matches cart

---

### TC-303: Verify Order Summary With Multiple Items

**Acceptance Criteria:** AC3  
**Test Data:**
- Item 1: Sauce Labs Backpack ($29.99)
- Item 2: Sauce Labs Bike Light ($9.99)
- Item 3: Sauce Labs Bolt T-Shirt ($15.99)
- Expected Item Total: $55.97

**Steps:**
1. Add three items to cart as specified
2. Navigate through checkout to Order Overview
3. Verify all items appear in summary with correct details

**Expected Results:**
- All three items are listed in order overview
- Each item displays correct name, price, and quantity
- Item subtotal is $55.97
- No items are missing from the overview
- Item layout clearly displays quantity and description

---

### TC-304: Verify Payment Information Display

**Acceptance Criteria:** AC3  
**Test Data:** None (static payment info)

**Steps:**
1. Navigate to Order Overview page (checkout-step-two.html)
2. Locate Payment Information section
3. Verify payment details displayed

**Expected Results:**
- "Payment Information:" label is visible
- Payment method is displayed as "SauceCard #31337"
- Payment information is clearly formatted
- No sensitive data is exposed (only last 5 digits shown for card)
- Payment section is clearly separated from other sections

---

### TC-305: Verify Shipping Information Display

**Acceptance Criteria:** AC3  
**Test Data:**
- Entered during checkout: First Name: John, Last Name: Doe, Zip: 12345

**Steps:**
1. Complete checkout form with provided data
2. Navigate to Order Overview page
3. Locate Shipping Information section
4. Verify shipping details displayed

**Expected Results:**
- "Shipping Information:" label is visible
- Shipping method displays as "Free Pony Express Delivery!"
- Shipping information is clearly presented
- Shipping method name is complete and readable
- Shipping section is clearly separated from other information

---

### TC-306: Verify Price Breakdown Display

**Acceptance Criteria:** AC3  
**Test Data:**
- Item total: (varies based on items in cart)
- Tax: $0.00
- Total: (Item total after tax)

**Steps:**
1. Add items to cart (exact items not critical for this test)
2. Navigate to Order Overview page
3. Locate the Price Total section
4. Verify all price components are displayed

**Expected Results:**
- "Price Total" label/heading is visible
- "Item total:" displays with calculated subtotal
- "Tax:" displays the tax amount ($0.00 in this system)
- "Total:" displays the final total amount
- All prices are formatted with currency symbol ($)
- Price breakdown is easy to read and understand
- All calculations are mathematically correct

---

### TC-307: Verify Order Overview With Zero-Priced Item

**Acceptance Criteria:** AC3  
**Test Data:**
- Empty cart or items showing $0.00 total

**Steps:**
1. Navigate to checkout with empty/zero-value cart
2. Observe Order Overview page
3. Verify price display

**Expected Results:**
- Order Overview page displays with all sections visible
- Item total displays as $0.00
- Tax displays as $0.00
- Total displays as $0.00
- No errors occur with zero-value orders
- All currency formatting remains consistent

---

### TC-308: Verify Cancel Button On Order Overview

**Acceptance Criteria:** AC3  
**Test Data:** Any items in order overview

**Steps:**
1. Navigate to Order Overview page (checkout-step-two.html)
2. Click the "Cancel" button
3. Verify navigation

**Expected Results:**
- Cancel button is present and clickable
- Cancel button has back arrow icon
- User is navigated back to cart page (cart.html)
- Checkout process is cancelled
- Cart contents are preserved (can verify by navigating back to cart)

---

### TC-309: Verify Finish Button Is Active On Order Overview

**Acceptance Criteria:** AC3  
**Test Data:** Order with any items

**Steps:**
1. Navigate to Order Overview page
2. Observe the Finish button
3. Verify button state and appearance

**Expected Results:**
- Finish button is visible
- Finish button is active/enabled (clickable)
- Finish button label clearly states "Finish"
- Button styling indicates it is interactive
- Button cursor changes to pointer on hover

---

### TC-310: Verify Order Overview Page Responsiveness

**Acceptance Criteria:** AC3  
**Test Data:** Order overview page with multiple items

**Steps:**
1. Navigate to Order Overview page
2. Test on different browser window sizes:
   - Desktop (1920x1080)
   - Tablet (768x1024)
   - Mobile (375x667)
3. Verify layout and readability at each size

**Expected Results:**
- All information remains visible on all screen sizes
- Text is readable without horizontal scrolling
- Price information is clearly visible
- Buttons are clickable on all device sizes
- Images/layout reflows appropriately for smaller screens
- No content is cut off or overlapping

---

## AC4: Order Completion

### TC-401: Verify Successful Order Completion

**Acceptance Criteria:** AC4  
**Test Data:**
- Complete order with valid information

**Steps:**
1. Fill checkout form with valid data (First Name: John, Last Name: Doe, Zip: 12345)
2. Navigate through checkout overview
3. Click "Finish" button on Order Overview page
4. Observe order confirmation page

**Expected Results:**
- User is redirected to checkout-complete.html
- Page heading displays "Checkout: Complete!"
- Success message "Thank you for your order!" is visible
- Confirmation text displays: "Your order has been dispatched, and will arrive just as fast as the pony can get there!"
- Order confirmation page loads without errors
- All confirmation messaging is clearly visible and readable

---

### TC-402: Verify Back Home Button Navigation

**Acceptance Criteria:** AC4  
**Test Data:** Completion page after successful order

**Steps:**
1. Complete order successfully (follow TC-401 steps)
2. Locate "Back Home" button on completion page
3. Click "Back Home" button
4. Verify navigation

**Expected Results:**
- "Back Home" button is visible on order confirmation page
- Button is clickable
- Clicking the button navigates to the products page (inventory.html)
- User is logged in and can continue browsing/shopping

---

### TC-403: Verify Order Confirmation Image Display

**Acceptance Criteria:** AC4  
**Test Data:** Completion page

**Steps:**
1. Navigate to order confirmation page (checkout-complete.html)
2. Observe image on the page
3. Verify image displays correctly

**Expected Results:**
- Pony Express confirmation image is displayed
- Image is visible and renders without errors
- Image adds visual confirmation of successful order
- Image dimensions are appropriate for page layout (not stretched or distorted)

---

### TC-404: Verify Order Confirmation Page Heading Structure

**Acceptance Criteria:** AC4  
**Test Data:** Completion page

**Steps:**
1. Navigate to order confirmation page
2. Inspect page structure using browser developer tools
3. Verify heading hierarchy

**Expected Results:**
- Page title/heading clearly states order completion (e.g., "Checkout: Complete!")
- "Thank you for your order!" appears as a heading (H2)
- Heading structure follows HTML standards
- Headings are appropriately nested
- Screen readers can properly interpret page structure

---

### TC-405: Verify Order Confirmation Visible On Page Load

**Acceptance Criteria:** AC4  
**Test Data:** Order confirmation page

**Steps:**
1. Navigate to checkout-complete.html
2. Once page fully loads, observe content above the fold
3. Verify confirmation message is immediately visible

**Expected Results:**
- "Thank you for your order!" message is visible without scrolling
- Key confirmation text is in viewport on page load
- User does not need to scroll to see order was successful
- Confirmation content is prominently displayed
- Page layout prioritizes the confirmation message

---

### TC-406: Verify Order Confirmation Text Accuracy

**Acceptance Criteria:** AC4  
**Test Data:** Completion page

**Steps:**
1. Navigate to order confirmation page
2. Read the entire confirmation text
3. Verify text matches expected messaging

**Expected Results:**
- Confirmation text reads: "Your order has been dispatched, and will arrive just as fast as the pony can get there!"
- Text is grammatically correct
- Message is clear and reassuring
- No typos or spelling errors
- Message tone is appropriate and professional

---

### TC-407: Verify Page Does Not Redirect Automatically

**Acceptance Criteria:** AC4  
**Test Data:** Completion page URL

**Steps:**
1. Navigate to order confirmation page
2. Wait for 10 seconds without clicking anything
3. Verify page remains at checkout-complete.html

**Expected Results:**
- Page does not automatically redirect
- URL remains https://www.saucedemo.com/checkout-complete.html
- User has time to review the confirmation
- "Back Home" button is manually clicked by user when ready
- No JavaScript auto-redirects occur

---

### TC-408: Verify User Can Refresh Confirmation Page

**Acceptance Criteria:** AC4  
**Test Data:** Completion page

**Steps:**
1. Navigate to order confirmation page
2. Press F5 or click browser refresh button
3. Verify page refreshes successfully

**Expected Results:**
- Page refreshes without errors
- Confirmation message is still displayed after refresh
- Page does not redirect to login or other page
- All content loads correctly after refresh
- Confirmation is persistent (data persists across refresh)

---

### TC-409: Verify Back Button Browser Behavior

**Acceptance Criteria:** AC4  
**Test Data:** Completion page

**Steps:**
1. Navigate to order confirmation page
2. Click browser back button
3. Observe navigation

**Expected Results:**
- Browser back button is functional
- User is navigated back to Order Overview page (checkout-step-two.html)
- Confirmation page content is not repeated
- Navigation history works correctly

---

### TC-410: Verify Confirmation Page Responsive Design

**Acceptance Criteria:** AC4  
**Test Data:** Completion page

**Steps:**
1. Navigate to order confirmation page
2. Test on various screen sizes:
   - Desktop (1920x1080)
   - Tablet (768x1024)
   - Mobile (375x667)
3. Verify layout and functionality at each size

**Expected Results:**
- Pony image scales appropriately for screen size
- Confirmation text is readable on all devices
- "Back Home" button is clickable and visible on all screen sizes
- No content overlaps or is cut off
- Touch targets (button) are appropriately sized for mobile (min 44x44px)
- Layout maintains proper spacing and alignment

---

## AC5: Error Handling

### TC-501: Verify Required Field Error Message Display

**Acceptance Criteria:** AC5  
**Test Data:**
- First Name: (empty)
- Other fields: (valid)

**Steps:**
1. Navigate to checkout-step-one.html
2. Leave First Name empty, fill other fields
3. Click Continue
4. Observe error message display

**Expected Results:**
- Error message clearly states which field is required
- Error message is prominently displayed
- Error indicator appears next to the affected field (red border, icon, etc.)
- Error does not obscure other form content
- Error message is easily readable (high contrast, appropriate font size)
- Error message text is specific (e.g., "First Name is required")

---

### TC-502: Verify Multiple Field Error Messages

**Acceptance Criteria:** AC5  
**Test Data:**
- First Name: (empty)
- Last Name: (empty)
- Zip/Postal Code: (empty)

**Steps:**
1. Navigate to checkout-step-one.html
2. Leave all fields empty
3. Click Continue
4. Observe all error messages

**Expected Results:**
- Error message(s) appear for all empty fields, OR single comprehensive error shown
- Each empty field is visually indicated with error highlighting
- User can identify which fields are causing the validation failure
- Multiple errors do not cause page to crash or freeze
- Errors are clearly associated with their respective fields

---

### TC-503: Verify Error Clearing On Field Update

**Acceptance Criteria:** AC5  
**Test Data:**
- Initial state: First Name empty with error
- Corrected data: John

**Steps:**
1. Trigger validation error for First Name (empty field, click Continue)
2. Observe error message displayed
3. Click on First Name field and enter "John"
4. Observe if error message clears

**Expected Results:**
- Error message appears when field is empty and Continue is clicked
- When user begins typing in the field, error message clears or updates
- Error indicator (red border) is removed from field
- Form accepts the correction without requiring another Continue click (real-time validation), OR
- User can retry submission after correction

---

### TC-504: Verify Error Handling For Special Characters

**Acceptance Criteria:** AC5  
**Test Data:**
- First Name: <>?:<>
- Last Name: []{};:',"
- Zip Code: !@#$%^

**Steps:**
1. Navigate to checkout-step-one.html
2. Enter special characters in all fields as specified
3. Click Continue
4. Observe response

**Expected Results:**
- Application handles special characters without crashing
- Either:
  - Form accepts and submits successfully, OR
  - Validation error appears with clear message about invalid characters
- Application remains stable
- Error message (if any) does not leak sensitive information
- No JavaScript errors in browser console

---

### TC-505: Verify Error Handling For SQL Injection Attempt

**Acceptance Criteria:** AC5  
**Test Data:**
- First Name: '; DROP TABLE users; --
- Last Name: " OR 1=1 --
- Zip Code: 1' UNION SELECT * FROM passwords

**Steps:**
1. Navigate to checkout-step-one.html
2. Enter SQL injection payloads in form fields
3. Click Continue
4. Observe application behavior

**Expected Results:**
- Application does not execute injected SQL commands
- Form either accepts input as plain text or validates/rejects it
- Application remains stable and does not crash
- No database errors are displayed to user
- Application properly escapes/sanitizes input
- No sensitive data is exposed

---

### TC-506: Verify Error Handling For XSS Script Injection

**Acceptance Criteria:** AC5  
**Test Data:**
- First Name: <script>alert('XSS')</script>
- Last Name: <img src=x onerror="alert('XSS')">
- Zip Code: javascript:void(0)

**Steps:**
1. Navigate to checkout-step-one.html
2. Enter XSS payloads in form fields
3. Click Continue
4. Observe if scripts execute

**Expected Results:**
- Scripts do not execute on the page
- No popup alerts or unexpected behavior occurs
- Input is treated as plain text string
- Form either accepts input or validates and rejects it
- Application remains secure and stable
- No malicious scripts run in browser context

---

### TC-507: Verify Very Long Input Handling

**Acceptance Criteria:** AC5  
**Test Data:**
- First Name: 500 character string (aaaaaa...aaaaaa)
- Last Name: 500 character string
- Zip Code: 500 character string

**Steps:**
1. Navigate to checkout-step-one.html
2. Enter 500-character strings in all fields
3. Click Continue
4. Verify application behavior

**Expected Results:**
- Application handles long input without crashing
- Either:
  - Input is accepted and form proceeds, OR
  - Field limits input to maximum length (e.g., 50 chars), OR
  - Validation error appears
- Page layout does not break or become distorted
- Form remains functional
- No console errors occur

---

### TC-508: Verify Numeric Input In Name Fields

**Acceptance Criteria:** AC5  
**Test Data:**
- First Name: 12345
- Last Name: 67890
- Zip Code: ABC123DEF

**Steps:**
1. Navigate to checkout-step-one.html
2. Enter numeric values in name fields
3. Enter alphanumeric value in zip field
4. Click Continue
5. Observe validation

**Expected Results:**
- Numeric input is either:
  - Accepted and form submits, OR
  - Validation error appears: "First Name must contain letters"
- Alphanumeric zip code behavior is:
  - Accepted and form submits, OR
  - Validation error appears
- Error messages (if any) are clear and specific
- Form does not break or behave unexpectedly

---

### TC-509: Verify Error Recovery Flow

**Acceptance Criteria:** AC5  
**Test Data:**
- Initial: All fields empty (triggering validation error)
- Corrected: Valid data across all fields

**Steps:**
1. Navigate to checkout-step-one.html
2. Click Continue with empty fields (expecting error)
3. Verify error appears
4. Fill all fields with valid data (John, Doe, 12345)
5. Click Continue
6. Verify page navigates to order overview

**Expected Results:**
- Validation error appears for empty fields
- User can correct all fields and resubmit form
- Form submission succeeds after error is resolved
- User is not stuck in error loop
- Navigation to next page completes successfully
- Error state does not prevent subsequent submissions

---

### TC-510: Verify Form Validation Consistency

**Acceptance Criteria:** AC5  
**Test Data:**
- Multiple test attempts with same data

**Steps:**
1. Navigate to checkout-step-one.html
2. Leave First Name empty, click Continue
3. Note error message
4. Refresh page (F5)
5. Repeat steps 1-3
6. Compare error messages

**Expected Results:**
- Same validation error appears consistently
- Error message text is identical on both attempts
- Error display behavior is consistent
- Validation logic is deterministic (same input = same result)
- No random or intermittent errors occur

---

### TC-511: Verify Error Message Localization/Language

**Acceptance Criteria:** AC5  
**Test Data:** Error message text

**Steps:**
1. Navigate to checkout-step-one.html
2. Trigger validation error by leaving field empty and clicking Continue
3. Read error message text
4. Verify language and clarity

**Expected Results:**
- Error message is in English (for standard_user)
- Error message is clear and understandable
- Grammar and spelling are correct
- Error message uses proper terminology (e.g., "required" not "mandatory")
- Message is appropriately formal/professional in tone

---

### TC-512: Verify Page Does Not Break On Validation Error

**Acceptance Criteria:** AC5  
**Test Data:** Any validation error

**Steps:**
1. Navigate to checkout-step-one.html
2. Fill form to trigger validation error
3. Click Continue
4. Verify page state

**Expected Results:**
- Error appears but page remains functional
- Form is still interactive and editable
- Fields remain accessible and can be modified
- Continue button is still clickable (to retry submission)
- Cancel button is still clickable
- No CSS breakage or layout corruption occurs
- No JavaScript errors appear in browser console

---

### TC-513: Verify Tab Navigation With Validation Errors

**Acceptance Criteria:** AC5  
**Test Data:** Form with validation error

**Steps:**
1. Navigate to checkout-step-one.html
2. Leave First Name empty, trigger validation error
3. Use Tab key to navigate between form fields
4. Verify accessibility

**Expected Results:**
- Tab navigation works correctly even with error displayed
- Focus management is proper (focus visible on each field)
- User can tab through all interactive elements
- Error does not prevent keyboard navigation
- All form fields remain accessible via keyboard

---

### TC-514: Verify Accessibility Of Error Messages

**Acceptance Criteria:** AC5  
**Test Data:** Form with validation errors

**Steps:**
1. Navigate to checkout-step-one.html
2. Trigger validation error
3. Use screen reader or accessibility inspector
4. Verify error message is announced

**Expected Results:**
- Error message is semantically marked (e.g., role="alert")
- Screen reader announces the error
- Error is associated with the affected field
- Screen reader users can identify which field caused the error
- Error message is not hidden from assistive technologies
- Color is not the only indicator of error (text message also provided)

---

# Test Execution Summary

## Environment Requirements
- Browser: Chrome, Firefox, Safari (test on at least one)
- Network: Stable internet connection
- Screen Resolution: Minimum 1024x768 (desktop); test mobile at 375x667
- Test User Account: credentials provided (standard_user)

## Pre-Test Checklist
- [ ] Test environment is accessible
- [ ] Application URL is reachable (https://www.saucedemo.com)
- [ ] Browser cookies/cache cleared before testing
- [ ] Test credentials are valid
- [ ] Test data is prepared

## Post-Test Review
- [ ] All test results documented
- [ ] Screenshots captured for key steps and errors
- [ ] Any issues logged with reproduction steps
- [ ] Test coverage verified against acceptance criteria
- [ ] Results communicated to development team

---

## Notes & Observations

### Browser Compatibility Considerations
- Test payment information display for proper formatting across browsers
- Verify responsive design on multiple screen sizes
- Test keyboard navigation and tab order
- Verify form placeholder text displays correctly

### Performance Considerations
- Monitor page load times during checkout
- Verify form submission response time
- Check if loading indicators appear during form processing

### Security Considerations  
- Verify HTTPS protocol is used for all checkout pages
- Ensure no sensitive data is logged in network requests
- Verify input sanitization to prevent injection attacks
- Confirm payment card details are not exposed

### Usability Considerations
- Error messages should be specific and actionable
- Form should be intuitive for first-time users
- Buttons should be clearly labeled and visible
- Checkout flow should be completed in under 2 minutes for typical user

---

**Document Version:** 1.0  
**Last Updated:** March 28, 2026  
**Test Plan Lead:** QA Team  
**Approval Status:** Ready for Execution
