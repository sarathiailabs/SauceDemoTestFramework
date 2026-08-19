# SauceDemo Test Automation Framework

## Requirements & Automation Context Document

**Application:** SauceDemo / Swag Labs  
**Application URL:** https://www.saucedemo.com/  
**Automation Technology:** Playwright + TypeScript  
**Test Type:** Web UI / End-to-End Automation  
**Document Purpose:** Context document for AI Coding Assistants

---

# 1. Purpose

This document defines the functional requirements, test scenarios, automation objectives, technical expectations, and framework guidelines for building a robust end-to-end test automation framework for the SauceDemo application.

The document is intended to be provided as context to an AI coding assistant so that the assistant can make appropriate architectural and implementation decisions while creating the automation framework.

The automation framework should be designed as a **production-style framework**, even though SauceDemo is a demonstration application.

The objective is not simply to automate individual test cases.

The objective is to demonstrate a framework that is:

- Maintainable
- Scalable
- Reusable
- Readable
- Reliable
- Parallelizable
- CI/CD ready
- Easy to debug
- Easy for multiple engineers to contribute to
- Suitable for future expansion
- Aligned with modern Playwright and TypeScript practices

---

# 2. Application Overview

SauceDemo is a demonstration e-commerce application representing an online shopping experience.

The major user journey is:

```text
Login
  ↓
Product Inventory
  ↓
Product Selection
  ↓
Shopping Cart
  ↓
Checkout Information
  ↓
Checkout Overview
  ↓
Order Completion
```

The application contains functionality around:

- User authentication
- Different user types
- Product inventory
- Product sorting
- Product details
- Add/remove products
- Shopping cart
- Checkout
- Order confirmation
- Navigation
- Logout
- Error handling

SauceDemo is specifically useful for automation-framework development because the application contains several interconnected user journeys while remaining relatively small and easy to understand.

---

# 3. Application URL

```text
https://www.saucedemo.com/
```

The base URL must not be hardcoded throughout the test code.

The framework should centralize the application URL through Playwright configuration/environment configuration.

Example conceptual configuration:

```text
BASE_URL
```

The framework should allow the application URL to be changed without modifying test cases.

---

# 4. Technology Requirements

The automation framework must use:

| Component          | Requirement              |
| ------------------ | ------------------------ |
| Language           | TypeScript               |
| Test Framework     | Playwright Test          |
| Browser Automation | Playwright               |
| Package Manager    | npm                      |
| Code Quality       | ESLint                   |
| Code Formatting    | Prettier                 |
| Version Control    | Git                      |
| CI/CD              | GitHub Actions           |
| Test Reports       | Playwright HTML Reporter |
| Debugging          | Playwright Trace Viewer  |
| IDE                | VS Code / compatible IDE |
| Node.js            | Current LTS version      |

Playwright supports TypeScript natively. TypeScript compilation/type checking should still be executed separately because Playwright does not perform complete type checking during test execution.

---

# 5. Test Automation Goals

The framework should provide automation coverage for the following areas.

## 5.1 Authentication

Verify:

- Successful login
- Invalid login
- Locked-out user
- Missing username
- Missing password
- Missing username and password
- Error messages
- Logout

---

## 5.2 Inventory

Verify:

- Inventory page loads successfully
- Products are displayed
- Product names are displayed
- Product prices are displayed
- Product images are displayed
- Add-to-cart functionality
- Remove-from-cart functionality
- Cart badge behavior
- Product sorting
- Navigation to product details

---

## 5.3 Product Details

Verify:

- User can open a product
- Product name is displayed
- Product description is displayed
- Product price is displayed
- Product image is displayed
- Product can be added to cart
- Product can be removed from cart
- User can navigate back to inventory

---

## 5.4 Shopping Cart

Verify:

- Cart can be opened
- Selected products are displayed
- Correct product name is displayed
- Correct product price is displayed
- Product quantity is displayed
- Product can be removed
- User can continue shopping
- User can proceed to checkout
- Empty cart behavior

---

## 5.5 Checkout

Verify:

- Checkout can be initiated
- Checkout information form is displayed
- First name is required
- Last name is required
- Postal code is required
- Validation messages are displayed
- Valid checkout information is accepted
- Checkout overview is displayed
- Product information is correct
- Price information is correct
- User can complete purchase
- Order confirmation is displayed
- User can return to the inventory/home page

---

# 6. Known Test Users

The framework should support multiple application users.

The following users should be treated as **test data**, not hardcoded throughout test cases.

| Username                  | Purpose                                        |
| ------------------------- | ---------------------------------------------- |
| `standard_user`           | Normal successful user                         |
| `locked_out_user`         | Login failure / locked account                 |
| `problem_user`            | User exhibiting application behavior issues    |
| `performance_glitch_user` | User intended for performance-related behavior |
| `error_user`              | Error behavior testing                         |
| `visual_user`             | Visual behavior testing                        |

The commonly used SauceDemo password is:

```text
secret_sauce
```

Credentials should be centralized in test data/configuration rather than repeated in individual tests.

---

# 7. Functional Requirements

## FR-001 – Login Page

The application shall provide:

- Username input
- Password input
- Login button
- Error message area
- Application branding

### Acceptance Criteria

1. User can enter username.
2. User can enter password.
3. User can click Login.
4. Valid credentials navigate to the inventory page.
5. Invalid credentials display an appropriate error.
6. Locked-out users cannot successfully authenticate.
7. Required-field validation is displayed when credentials are missing.

---

# 8. FR-002 – Inventory Page

The inventory page shall display a collection of products.

Each product should provide:

- Product image
- Product name
- Product description
- Product price
- Add to cart/remove button

### Acceptance Criteria

1. Inventory page loads after successful login.
2. Products are displayed.
3. Product names are visible.
4. Product prices are visible.
5. Products can be added to cart.
6. Products can be removed from cart.
7. Cart item count updates correctly.

---

# 9. FR-003 – Product Sorting

The application provides product sorting options.

The framework should verify:

### Name

- A → Z
- Z → A

### Price

- Low → High
- High → Low

### Acceptance Criteria

The resulting product order must match the selected sorting criteria.

The test should validate the actual displayed product order rather than merely checking that the dropdown value changed.

---

# 10. FR-004 – Product Details

Users should be able to select a product and view its details.

### Acceptance Criteria

The product details page must display:

- Product name
- Description
- Price
- Image
- Add/remove cart action

The product displayed on the details page must correspond to the product selected from inventory.

---

# 11. FR-005 – Shopping Cart

The cart must display products selected by the user.

### Acceptance Criteria

1. User can open the cart.
2. Added products appear in the cart.
3. Removed products disappear.
4. Cart count is updated correctly.
5. User can continue shopping.
6. User can proceed to checkout.

---

# 12. FR-006 – Checkout Information

Checkout requires:

- First Name
- Last Name
- Postal Code

### Acceptance Criteria

1. Checkout page is displayed.
2. All required fields are available.
3. Valid information allows the user to continue.
4. Missing required information generates validation errors.
5. User cannot continue with incomplete mandatory information.

---

# 13. FR-007 – Checkout Overview

The checkout overview should display the selected purchase information.

Verify:

- Product name
- Product quantity
- Product price
- Item total
- Tax
- Total
- Cancel button
- Finish button

### Acceptance Criteria

The displayed product and pricing information must be consistent with the products selected earlier.

---

# 14. FR-008 – Order Completion

The user should be able to complete an order.

### Acceptance Criteria

1. User clicks Finish.
2. Order is successfully completed.
3. Confirmation page is displayed.
4. Confirmation message is displayed.
5. User can navigate back to the inventory/home page.

---

# 15. FR-009 – Logout

The application should allow the authenticated user to log out.

### Acceptance Criteria

1. User can open the navigation menu.
2. User can select Logout.
3. User is returned to the login page.
4. Authenticated inventory content is no longer displayed.

---

# 16. Test Scenario Categories

Tests should be categorized using tags.

Recommended categories:

```text
@smoke
@regression
@functional
@negative
@checkout
@login
@inventory
@cart
@product
@critical
```

Example conceptual classification:

| Area              | Smoke | Regression |
| ----------------- | ----: | ---------: |
| Login             |   Yes |        Yes |
| Inventory         |   Yes |        Yes |
| Add to Cart       |   Yes |        Yes |
| Cart              |   Yes |        Yes |
| Checkout          |   Yes |        Yes |
| Sorting           |    No |        Yes |
| Product Details   |    No |        Yes |
| Negative Login    |    No |        Yes |
| Negative Checkout |    No |        Yes |
| Logout            |   Yes |        Yes |

---

# 17. Priority Classification

Every test should have a priority.

Recommended priorities:

```text
P0 – Critical
P1 – High
P2 – Medium
P3 – Low
```

### P0 – Critical

Core business journeys:

- Successful login
- Inventory loading
- Add product to cart
- Checkout
- Order completion

### P1 – High

- Logout
- Remove product
- Checkout validation
- Cart navigation
- Product details

### P2 – Medium

- Product sorting
- Continue shopping
- Additional validation scenarios

### P3 – Low

- Minor UI behavior
- Non-critical visual checks

---

# 18. Recommended Test Suite Structure

The automation suite should be organized by business capability rather than creating one large test file.

Recommended structure:

```text
tests/
├── auth/
│   ├── login.spec.ts
│   └── logout.spec.ts
│
├── inventory/
│   ├── inventory.spec.ts
│   ├── sorting.spec.ts
│   └── product-details.spec.ts
│
├── cart/
│   └── cart.spec.ts
│
├── checkout/
│   ├── checkout-information.spec.ts
│   ├── checkout-overview.spec.ts
│   └── checkout-complete.spec.ts
│
└── smoke/
    └── smoke.spec.ts
```

The exact structure may be adjusted if the coding assistant identifies a better scalable architecture.

---

# 19. Framework Architecture Requirements

The framework should follow a layered architecture.

Recommended conceptual architecture:

```text
                Test Specifications
                        │
                        ▼
                 Test Fixtures
                        │
                        ▼
                  Page Objects
                        │
                        ▼
               Component Objects
                        │
                        ▼
             Utility / Helper Layer
                        │
                        ▼
                 Playwright API
                        │
                        ▼
                 SauceDemo App
```

Tests should describe **business behavior**, while page/component objects should contain UI interaction details.

---

# 20. Page Object Model

The framework should use Page Object Model where it improves maintainability.

Recommended page objects:

```text
LoginPage
InventoryPage
ProductPage
CartPage
CheckoutInformationPage
CheckoutOverviewPage
CheckoutCompletePage
```

Potential component objects:

```text
Header
SideMenu
ProductCard
CartItem
ProductSort
```

Page objects should:

- Encapsulate locators
- Encapsulate UI interactions
- Expose meaningful business methods
- Avoid test assertions unless there is a strong architectural reason
- Avoid unnecessary abstraction
- Avoid exposing raw Playwright implementation details to tests

---

# 21. Locator Strategy

Locators must prioritize resilient, user-facing selectors.

Preferred order:

1. `getByRole`
2. `getByLabel`
3. `getByText`
4. `getByTestId`
5. Stable CSS selectors
6. XPath only when absolutely necessary

Avoid:

```text
nth()
```

unless there is no better semantic alternative.

Avoid fragile selectors based on:

- CSS hierarchy
- Generated classes
- DOM position
- Styling
- Implementation details

Playwright recommends prioritizing user-facing attributes and behavior rather than implementation details.

---

# 22. Test Data Management

Test data must be separated from test implementation.

Recommended structure:

```text
test-data/
├── users.ts
├── products.ts
├── checkout-data.ts
└── test-data.types.ts
```

Example conceptual model:

```text
User
 ├── username
 ├── password
 └── userType
```

Checkout data:

```text
CheckoutData
 ├── firstName
 ├── lastName
 └── postalCode
```

The framework should avoid duplicating test data across test files.

---

# 23. Environment Configuration

Configuration must be externalized.

Potential configuration:

```text
BASE_URL
DEFAULT_USERNAME
DEFAULT_PASSWORD
TEST_ENV
CI
```

Environment-specific configuration should be supported.

Conceptually:

```text
.env
.env.qa
.env.staging
.env.production
```

Secrets must never be committed to Git.

---

# 24. Playwright Configuration

The framework must have a centralized:

```text
playwright.config.ts
```

The configuration should manage:

- `baseURL`
- Test directory
- Timeout
- Expect timeout
- Retries
- Workers
- Parallel execution
- Trace
- Screenshot
- Video
- Reporter
- Projects
- Browser configuration

Playwright configuration is specifically intended to centralize options such as browsers, timeouts, retries, projects and reporters.

---

# 25. Browser Strategy

The framework should support Playwright projects.

Initial projects:

```text
chromium
firefox
webkit
```

The framework should make it possible to execute:

```text
All browsers
Chromium only
Firefox only
WebKit only
Smoke only
Regression only
```

Playwright projects are designed for running the same tests against different browsers, devices, environments, or configurations.

---

# 26. Fixture Strategy

The framework should use Playwright fixtures for reusable test setup.

Potential custom fixtures:

```text
loginPage
inventoryPage
productPage
cartPage
checkoutPage
authenticatedPage
testData
```

Fixtures should be introduced when they provide real reuse and lifecycle management.

Do not create fixtures simply to wrap every object.

Playwright fixtures are isolated and composable, making them appropriate for reusable test setup and page-object initialization.

---

# 27. Authentication Strategy

The framework should support an optimized authentication strategy.

Two approaches may be evaluated:

### Approach A – Login through UI

```text
Test
 ↓
LoginPage
 ↓
Username/password
 ↓
Login
 ↓
Inventory
```

### Approach B – Reusable authenticated state

```text
Authentication Setup
        ↓
storageState
        ↓
Authenticated Tests
```

The coding assistant should determine whether reusable authentication state is beneficial based on the application's behavior and the test suite.

Authentication setup must not compromise test isolation.

---

# 28. Test Isolation

Every test must be independently executable.

A test must not depend on:

```text
Test A → Test B → Test C
```

Instead:

```text
Test A
Test B
Test C
```

Each test should establish its own required state.

Playwright explicitly recommends test isolation because it improves reproducibility and prevents cascading failures.

---

# 29. Assertions

Assertions must validate business outcomes.

Bad example:

```text
Click button
Check button exists
```

Better:

```text
Add product
Verify cart contains the product
```

Assertions should verify:

- URL
- Page title
- Visible text
- Product data
- Cart state
- Checkout data
- Order confirmation
- Error messages
- Sorting results

Use Playwright's web-first assertions wherever possible.

---

# 30. Waiting Strategy

The framework must not use arbitrary waits such as:

```text
waitForTimeout()
```

unless there is a documented exceptional reason.

Prefer:

- Locator auto-waiting
- Web-first assertions
- `waitForURL`
- `waitForResponse`
- `waitForLoadState`
- Explicit state-based synchronization

The objective is to avoid unnecessary test flakiness.

---

# 31. Error Handling

Tests should fail with useful diagnostics.

When a test fails, the framework should provide:

- Test name
- Error message
- Screenshot
- Trace
- Relevant test steps
- Browser information
- Environment information

Trace collection should be enabled appropriately, particularly for failures/retries.

Playwright's trace viewer provides detailed debugging information including actions and DOM snapshots.

---

# 32. Screenshot Strategy

Screenshots should be captured:

- On failure
- For important visual checkpoints where appropriate

Do not capture screenshots after every action unless specifically required.

---

# 33. Video Strategy

Video recording should primarily be enabled when useful for debugging or CI failures.

The framework should balance:

```text
Debugging capability
vs
Execution speed
vs
Storage requirements
```

---

# 34. Reporting

The framework must generate a Playwright HTML report.

The report should provide:

- Passed tests
- Failed tests
- Skipped tests
- Test duration
- Error details
- Attachments
- Trace information

Playwright's HTML reporter supports filtering by browser, status and other test information and integrates with trace debugging.

Potential future reporting:

```text
HTML
JSON
JUnit
Allure
```

The framework should not introduce additional reporting dependencies unless there is a clear requirement.

---

# 35. Logging

The framework should provide useful logging.

Logging should help identify:

```text
Test started
User used
Product selected
Cart operation
Checkout operation
Test completed
```

Avoid excessive logging of every Playwright action.

Sensitive information such as passwords must never appear in logs.

---

# 36. ESLint

The framework must use ESLint.

ESLint should enforce:

- TypeScript best practices
- No unused variables
- No floating promises
- Consistent coding patterns
- Async/await correctness
- Import rules

The Playwright documentation specifically recommends ESLint and highlights `@typescript-eslint/no-floating-promises` to detect missing `await` statements in Playwright API calls.

---

# 37. Prettier

Prettier must be used for consistent formatting.

Recommended files:

```text
.prettierrc
.prettierignore
```

The framework should provide scripts such as:

```text
format
format:check
```

ESLint and Prettier should work together without conflicting formatting rules.

---

# 38. TypeScript Quality

The framework must use strict TypeScript practices.

Recommended:

```text
strict: true
```

Type checking must be performed separately from Playwright execution.

Conceptually:

```text
TypeScript Check
      ↓
Playwright Tests
```

The CI pipeline must fail when TypeScript compilation/type checking fails. Playwright recommends running `tsc --noEmit` alongside Playwright tests.

---

# 39. Package Scripts

The framework should provide simple commands.

Recommended commands:

```text
npm test
npm run test:smoke
npm run test:regression
npm run test:chromium
npm run test:firefox
npm run test:webkit
npm run test:headed
npm run test:debug
npm run test:ui
npm run test:report
npm run lint
npm run lint:fix
npm run typecheck
npm run format
npm run format:check
```

The exact scripts can be adjusted according to the final framework implementation.

---

# 40. CI/CD Requirements

The framework must be CI-ready.

Initial CI platform:

```text
GitHub Actions
```

CI pipeline should perform:

```text
Checkout repository
        ↓
Install Node.js
        ↓
Install dependencies
        ↓
TypeScript validation
        ↓
ESLint
        ↓
Install Playwright browsers
        ↓
Run smoke tests
        ↓
Run regression tests
        ↓
Generate reports
        ↓
Upload artifacts
```

The pipeline should support:

- Pull request validation
- Main branch validation
- Scheduled regression
- Test artifacts
- HTML report
- Screenshots
- Traces

Playwright's installation guidance recommends GitHub Actions integration, and Playwright supports parallel execution and sharding for scaling larger suites.

---

# 41. Parallel Execution

Tests should be designed to support parallel execution.

The framework must avoid:

- Shared mutable state
- Shared browser contexts
- Test ordering dependencies
- Shared test data
- Tests depending on another test's cart/session

Playwright runs tests in parallel by default and also supports sharding across multiple machines.

---

# 42. Smoke Suite

The smoke suite should validate the most important business journey.

Minimum smoke flow:

```text
Launch application
      ↓
Login
      ↓
Verify inventory
      ↓
Add product
      ↓
Open cart
      ↓
Verify product
      ↓
Checkout
      ↓
Enter customer information
      ↓
Verify order overview
      ↓
Complete order
      ↓
Verify confirmation
```

Smoke tests should be fast enough to execute on every pull request.

---

# 43. Regression Suite

Regression should cover all important application functionality.

Regression areas:

```text
Authentication
Inventory
Sorting
Product Details
Cart
Checkout
Validation
Logout
Negative scenarios
```

Regression should execute:

- On main branch
- Before release
- On scheduled execution
- On demand

---

# 44. Negative Testing

The framework must contain negative scenarios.

Examples:

### Login

- Empty username
- Empty password
- Invalid username
- Invalid password
- Locked user

### Checkout

- Empty first name
- Empty last name
- Empty postal code
- All checkout fields empty

Negative tests should verify both:

```text
Application behavior
+
Correct validation message
```

---

# 45. Data-Driven Testing

Where multiple data variations test the same behavior, data-driven tests should be preferred over duplicated test implementations.

Example:

```text
Login test
    ├── standard_user
    ├── locked_out_user
    ├── problem_user
    ├── performance_glitch_user
    └── error_user
```

However, data-driven testing should not make tests unreadable.

---

# 46. Test Naming

Test names must describe business behavior.

Preferred:

```text
should allow a standard user to login successfully
```

Avoid:

```text
test1
loginTest
verifyLogin
```

Test names should clearly communicate:

```text
Actor
+
Action
+
Expected outcome
```

---

# 47. Test Design Principles

The framework must follow these principles:

### Principle 1 – Independent Tests

Every test should run independently.

### Principle 2 – Single Business Objective

A test should have a clear purpose.

### Principle 3 – Reusable Components

Common UI behavior should be reusable.

### Principle 4 – Minimal Abstraction

Do not create unnecessary framework layers.

### Principle 5 – Business-Oriented Tests

Tests should read like user behavior.

### Principle 6 – Stable Locators

Prefer resilient locators.

### Principle 7 – No Arbitrary Sleeps

Use Playwright synchronization.

### Principle 8 – Fast Feedback

Smoke tests should be fast.

### Principle 9 – Debuggability

Failures must provide actionable diagnostics.

### Principle 10 – CI First

Everything executable locally should also be executable in CI.

---

# 48. Suggested Repository Structure

The coding assistant should target a structure similar to:

```text
saucedemo-playwright/
│
├── .github/
│   └── workflows/
│       └── playwright.yml
│
├── src/
│   ├── pages/
│   │   ├── LoginPage.ts
│   │   ├── InventoryPage.ts
│   │   ├── ProductPage.ts
│   │   ├── CartPage.ts
│   │   ├── CheckoutInformationPage.ts
│   │   ├── CheckoutOverviewPage.ts
│   │   └── CheckoutCompletePage.ts
│   │
│   ├── components/
│   │   ├── Header.ts
│   │   ├── SideMenu.ts
│   │   ├── ProductCard.ts
│   │   └── CartItem.ts
│   │
│   ├── fixtures/
│   │   └── test.fixture.ts
│   │
│   ├── data/
│   │   ├── users.ts
│   │   ├── products.ts
│   │   └── checkout.ts
│   │
│   ├── types/
│   │   └── test-data.types.ts
│   │
│   └── utils/
│       ├── logger.ts
│       └── helpers.ts
│
├── tests/
│   ├── auth/
│   ├── inventory/
│   ├── product/
│   ├── cart/
│   ├── checkout/
│   └── smoke/
│
├── config/
│   └── environments.ts
│
├── playwright.config.ts
├── tsconfig.json
├── eslint.config.ts
├── .prettierrc
├── .prettierignore
├── .gitignore
├── package.json
└── README.md
```

This is a suggested structure, not a mandatory structure.

The coding assistant should simplify it if a smaller structure provides the same maintainability.

---

# 49. Framework Non-Functional Requirements

## NFR-001 – Maintainability

A change to a locator should ideally require modification in one place.

---

## NFR-002 – Scalability

The framework should support adding:

```text
New pages
New tests
New browsers
New environments
New test data
New test suites
```

without major architectural changes.

---

## NFR-003 – Reliability

The framework should minimize flaky tests.

Target:

```text
Low false-positive rate
```

---

## NFR-004 – Performance

Tests should execute efficiently through:

- Parallel execution
- Reusable authentication state where appropriate
- Avoiding unnecessary navigation
- Avoiding unnecessary waits
- Appropriate browser projects

---

## NFR-005 – Debuggability

A failed CI test should provide enough information to reproduce and diagnose the issue.

---

## NFR-006 – Security

The framework must not commit:

- Passwords
- API keys
- Access tokens
- CI secrets

Secrets should be provided through environment variables or CI secret management.

---

## NFR-007 – Developer Experience

A new engineer should be able to:

```text
Clone repository
        ↓
Install dependencies
        ↓
Run tests
        ↓
View report
```

with minimal configuration.

---

# 50. Definition of Done

The automation framework will be considered complete when:

- [ ] Playwright + TypeScript is configured
- [ ] Base URL is configurable
- [ ] ESLint is configured
- [ ] Prettier is configured
- [ ] TypeScript strict checking is enabled
- [ ] Page objects are implemented where appropriate
- [ ] Fixtures are implemented where appropriate
- [ ] Test data is separated from tests
- [ ] Login tests are implemented
- [ ] Inventory tests are implemented
- [ ] Product tests are implemented
- [ ] Cart tests are implemented
- [ ] Checkout tests are implemented
- [ ] Negative tests are implemented
- [ ] Smoke suite is implemented
- [ ] Regression suite is implemented
- [ ] Browser projects are configured
- [ ] Parallel execution works
- [ ] Retry strategy is configured
- [ ] Screenshots are available on failure
- [ ] Traces are available for debugging
- [ ] HTML report is configured
- [ ] CI/CD pipeline is configured
- [ ] Linting passes
- [ ] Type checking passes
- [ ] Formatting checks pass
- [ ] README contains setup instructions
- [ ] README contains execution commands
- [ ] Tests can run independently
- [ ] No unnecessary hard waits are used
- [ ] No secrets are committed

---

# 51. AI Coding Assistant Instructions

The following instructions are specifically intended for an AI coding assistant.

## Architecture

Do not immediately generate test cases.

First analyze this requirement document and determine the appropriate framework architecture.

The framework must prioritize:

```text
Maintainability
Reliability
Scalability
Readability
Debuggability
CI/CD compatibility
```

---

## Implementation Rules

The coding assistant must:

1. Use TypeScript.
2. Use Playwright Test.
3. Follow modern Playwright best practices.
4. Prefer user-facing locators.
5. Use Page Objects where they provide value.
6. Use fixtures for reusable lifecycle/setup concerns.
7. Keep test data separate from test logic.
8. Avoid unnecessary abstractions.
9. Avoid hardcoded URLs.
10. Avoid arbitrary `waitForTimeout()` calls.
11. Use async/await correctly.
12. Use strong TypeScript typing.
13. Keep tests independent.
14. Design tests for parallel execution.
15. Provide meaningful assertions.
16. Provide useful failure diagnostics.
17. Configure HTML reporting.
18. Configure traces appropriately.
19. Configure screenshots appropriately.
20. Integrate ESLint and Prettier.
21. Provide type checking.
22. Provide CI/CD support.
23. Keep the framework easy for another engineer to understand.

---

# 52. AI Decision-Making Guidelines

When multiple technical approaches are possible, the coding assistant should evaluate:

```text
Option
 ↓
Maintainability
 ↓
Complexity
 ↓
Scalability
 ↓
Performance
 ↓
Debuggability
 ↓
Team usability
```

The simplest solution that satisfies the requirements should be preferred.

Do not introduce:

- Dependency injection frameworks
- Complex service layers
- Excessive base classes
- Custom test runners
- Unnecessary wrapper libraries
- Excessive utility classes

unless there is a demonstrated requirement.

---

# 53. Page Object Decision Rule

Create a Page Object when:

```text
A page contains multiple reusable interactions
OR
Multiple tests interact with the same page
```

Do not create a Page Object merely because every URL needs a class.

---

# 54. Fixture Decision Rule

Create a fixture when:

```text
Setup/teardown
+
Reusable dependency
+
Lifecycle management
```

requires framework-level handling.

Do not use fixtures simply to hide test logic.

---

# 55. Helper Decision Rule

Create a helper when the functionality:

```text
is generic
+
is reusable
+
does not represent a specific page
```

Examples:

```text
date formatting
random test data
logging
environment handling
```

---

# 56. Assertion Decision Rule

Assertions should validate outcomes rather than implementation details.

Prefer:

```text
expect(cart).toContainText(productName)
```

over assertions that inspect internal implementation.

---

# 57. Locator Decision Rule

Before creating a locator, inspect the DOM and determine the most stable user-facing locator.

Preferred:

```text
Role
Label
Text
Test ID
Stable attribute
```

Avoid relying on generated CSS classes.

---

# 58. Authentication Decision Rule

Before implementing authentication reuse, determine:

1. How the application manages authentication.
2. Whether storage state is stable.
3. Whether tests require independent authentication.
4. Whether login performance is a meaningful suite bottleneck.

Choose the simplest reliable strategy.

---

# 59. CI Decision Rule

The framework should support two major execution modes.

### Developer

```text
Fast feedback
Debugging
UI Mode
Headed execution
```

### CI

```text
Headless
Parallel
Retry
Artifacts
HTML report
Trace
Screenshots
```

---

# 60. Future Extensibility

The framework should be designed so that future capabilities can be added without redesigning the entire framework.

Potential future capabilities:

```text
API testing
Visual regression
Accessibility testing
Performance testing
Mobile emulation
Remote browser execution
Sauce Labs cloud execution
Allure reporting
Test management integration
Slack/Teams notifications
Advanced CI/CD
```

These capabilities should not be implemented unless explicitly required.

The initial implementation should remain focused on robust Playwright UI automation.

---

# 61. Expected Automation Coverage

The initial target is approximately:

```text
Authentication       → High
Inventory             → High
Product Details       → High
Cart                  → High
Checkout              → Very High
Logout                → Medium
Negative Testing      → High
Sorting               → Medium
Visual Testing        → Future
Accessibility         → Future
API Testing           → Future
Performance Testing   → Future
```

---

# 62. Primary Business Journey

The most important automated journey is:

```text
standard_user
     ↓
Login
     ↓
Inventory
     ↓
Select Product
     ↓
Add to Cart
     ↓
Open Cart
     ↓
Checkout
     ↓
Enter Customer Details
     ↓
Review Order
     ↓
Finish
     ↓
Verify Order Confirmation
```

This journey should form the foundation of the smoke suite.

---

# 63. Quality Gates

The framework should define the following quality gates.

### Local Development

```text
TypeScript
   +
ESLint
   +
Prettier
   +
Tests
```

### Pull Request

```text
TypeScript
   ↓
Lint
   ↓
Smoke
   ↓
Report
```

### Main Branch

```text
TypeScript
   ↓
Lint
   ↓
Smoke
   ↓
Regression
   ↓
Multi-browser
   ↓
Artifacts
```

---

# 64. Final Architecture Objective

The final framework should demonstrate how a professional QA automation team would build a Playwright framework rather than simply demonstrating Playwright syntax.

The framework should clearly separate:

```text
WHAT to test
        ↓
Test Specifications

HOW to interact
        ↓
Page Objects / Components

HOW to initialize
        ↓
Fixtures

WHAT data to use
        ↓
Test Data

HOW to configure
        ↓
Playwright Configuration

HOW to execute
        ↓
Scripts / CI

HOW to diagnose
        ↓
Reports / Traces / Screenshots
```

The final implementation should be easy for a new automation engineer to understand within a short onboarding period.

---

# 65. Reference Documentation

The implementation should follow current Playwright guidance where applicable:

- Playwright TypeScript support
- Playwright best practices
- Playwright fixtures
- Playwright projects
- Playwright configuration
- Playwright reporting
- Playwright debugging and trace viewer

The framework should favor official Playwright capabilities over third-party wrappers whenever Playwright already provides the required functionality.

---

# 66. Important Constraint

This document defines **requirements and desired outcomes**, not a rigid implementation.

The AI coding assistant is expected to make engineering decisions based on these requirements.

If it chooses a different architecture, it should:

1. Explain why.
2. Explain the trade-offs.
3. Ensure all requirements remain satisfied.
4. Avoid unnecessary complexity.
5. Prefer native Playwright capabilities.

The goal is a **robust, maintainable Playwright TypeScript framework**, not merely maximum abstraction or maximum number of files.
