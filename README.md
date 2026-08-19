# SauceDemo Playwright Test Automation Framework

[![GitHub Repository](https://img.shields.io/badge/GitHub-sarathiailabs%2FSauceDemoTestFramework-blue?logo=github)](https://github.com/sarathiailabs/SauceDemoTestFramework.git)

A **production-grade** end-to-end test automation framework for [SauceDemo (Swag Labs)](https://www.saucedemo.com/) built with **Playwright** and **TypeScript**.

This framework demonstrates how a professional QA automation team architects a maintainable, scalable, and CI/CD-ready Playwright framework — not just a collection of test scripts.

> 🔗 **Repository**: [https://github.com/sarathiailabs/SauceDemoTestFramework.git](https://github.com/sarathiailabs/SauceDemoTestFramework.git)

---

## Technology Stack

| Component          | Technology                    |
| ------------------ | ----------------------------- |
| Language           | TypeScript (strict mode)      |
| Test Framework     | Playwright Test               |
| Browser Automation | Playwright                    |
| Package Manager    | npm                           |
| Code Quality       | ESLint + `@typescript-eslint` |
| Code Formatting    | Prettier                      |
| CI/CD              | GitHub Actions                |
| Test Reports       | Playwright HTML Reporter      |
| Debugging          | Playwright Trace Viewer       |

---

## Project Structure

```
saucedemo-playwright/
│
├── .github/workflows/        # GitHub Actions CI/CD pipeline
│   └── playwright.yml
│
├── src/
│   ├── pages/                # Page Object Models
│   │   ├── LoginPage.ts
│   │   ├── InventoryPage.ts
│   │   ├── ProductPage.ts
│   │   ├── CartPage.ts
│   │   ├── CheckoutInformationPage.ts
│   │   ├── CheckoutOverviewPage.ts
│   │   └── CheckoutCompletePage.ts
│   │
│   ├── components/           # Reusable UI components
│   │   ├── Header.ts
│   │   └── SideMenu.ts
│   │
│   ├── fixtures/             # Custom Playwright test fixtures
│   │   └── test.fixture.ts
│   │
│   ├── data/                 # Test data (separated from test logic)
│   │   ├── users.ts
│   │   ├── products.ts
│   │   └── checkout.ts
│   │
│   ├── types/                # TypeScript interfaces and types
│   │   └── index.ts
│   │
│   └── utils/                # Generic utilities
│       ├── logger.ts
│       └── helpers.ts
│
├── tests/                    # Test specifications
│   ├── auth/
│   │   ├── login.spec.ts
│   │   └── logout.spec.ts
│   ├── inventory/
│   │   ├── inventory.spec.ts
│   │   ├── sorting.spec.ts
│   │   └── product-details.spec.ts
│   ├── cart/
│   │   └── cart.spec.ts
│   ├── checkout/
│   │   ├── checkout-information.spec.ts
│   │   ├── checkout-overview.spec.ts
│   │   └── checkout-complete.spec.ts
│   └── smoke/
│       └── smoke.spec.ts
│
├── config/
│   └── environments.ts       # Typed environment configuration
│
├── playwright.config.ts      # Playwright central configuration
├── tsconfig.json             # TypeScript strict configuration
├── eslint.config.mjs         # ESLint flat config
├── .prettierrc               # Prettier formatting rules
├── .env.example              # Environment variable template
└── package.json              # Scripts and dependencies
```

---

## Getting Started

### Prerequisites

- Node.js LTS (v20+)
- npm v9+

### 1. Clone the repository

```bash
git clone <repository-url>
cd saucedemo-playwright
```

### 2. Install dependencies

```bash
npm install
```

### 3. Install Playwright browsers

```bash
npx playwright install
```

### 4. Configure environment

Copy the example env file and review the values:

```bash
cp .env.example .env
```

> **Note:** The defaults in `.env.example` point to the live SauceDemo application. For a local or staging environment, update `BASE_URL`.
>
> **Never commit your `.env` file.** It is already listed in `.gitignore`.

---

## Running Tests

### Run all tests

```bash
npm test
```

### Run the smoke suite (fast, critical path only)

```bash
npm run test:smoke
```

### Run the full regression suite

```bash
npm run test:regression
```

### Run on a specific browser

```bash
npm run test:chromium
npm run test:firefox
npm run test:webkit
```

### Run in headed mode (see the browser)

```bash
npm run test:headed
```

### Run in debug mode (Playwright Inspector)

```bash
npm run test:debug
```

### Open Playwright UI mode

```bash
npm run test:ui
```

### Open the HTML test report

```bash
npm run test:report
```

---

## Code Quality

### TypeScript type check

```bash
npm run typecheck
```

### Lint

```bash
npm run lint
npm run lint:fix
```

### Format

```bash
npm run format
npm run format:check
```

---

## Framework Architecture

The framework follows a layered architecture:

```
Test Specifications  (tests/**/*.spec.ts)
        │
        ▼
Test Fixtures        (src/fixtures/test.fixture.ts)
        │
        ▼
Page Objects         (src/pages/*.ts)
        │
        ▼
Component Objects    (src/components/*.ts)
        │
        ▼
Utility Layer        (src/utils/*.ts)
        │
        ▼
Playwright API
        │
        ▼
SauceDemo Application
```

### Key Design Decisions

| Decision       | Choice                                                     | Reason                                           |
| -------------- | ---------------------------------------------------------- | ------------------------------------------------ |
| Authentication | UI login per test via `authenticatedInventoryPage` fixture | Simplest reliable strategy; keeps tests isolated |
| Locators       | `data-test` attributes → role → text                       | Stable, resilient to UI refactoring              |
| Waiting        | Playwright auto-wait + web-first assertions                | No `waitForTimeout()` used                       |
| Test data      | Separated in `src/data/`                                   | Single source of truth; no duplication           |
| Secrets        | Environment variables                                      | Never committed to Git                           |

---

## Test Tags

Tests are tagged for selective execution:

| Tag           | Purpose                            |
| ------------- | ---------------------------------- |
| `@smoke`      | Critical path — run on every PR    |
| `@regression` | Full coverage — run on main branch |
| `@login`      | Authentication tests               |
| `@inventory`  | Inventory tests                    |
| `@cart`       | Shopping cart tests                |
| `@checkout`   | Checkout tests                     |
| `@product`    | Product detail tests               |
| `@negative`   | Negative/validation tests          |
| `@P0`         | Critical priority                  |
| `@P1`         | High priority                      |
| `@P2`         | Medium priority                    |
| `@P3`         | Low priority                       |
| `@critical`   | Business-critical scenarios        |

Run tests by tag:

```bash
npx playwright test --grep @smoke
npx playwright test --grep @checkout
npx playwright test --grep @negative
```

---

## CI/CD Pipeline

The GitHub Actions pipeline (`.github/workflows/playwright.yml`) includes:

| Job          | Trigger               | What it does                                   |
| ------------ | --------------------- | ---------------------------------------------- |
| `validate`   | All events            | TypeScript + ESLint + Prettier                 |
| `smoke`      | PR + push to main     | Smoke tests on Chromium                        |
| `regression` | Main branch + nightly | Full regression on Chromium + Firefox + WebKit |

### Quality Gates

**Pull Request:**

```
TypeScript → ESLint → Prettier → Smoke Tests
```

**Main Branch / Release:**

```
TypeScript → ESLint → Prettier → Smoke → Regression (3 browsers)
```

Test artifacts (HTML report, trace files, screenshots) are uploaded as GitHub Actions artifacts for every run.

---

## Environment Variables

| Variable           | Default                     | Description                        |
| ------------------ | --------------------------- | ---------------------------------- |
| `BASE_URL`         | `https://www.saucedemo.com` | Application base URL               |
| `DEFAULT_USERNAME` | `standard_user`             | Username for authenticated fixture |
| `DEFAULT_PASSWORD` | `secret_sauce`              | Password for authenticated fixture |
| `TEST_ENV`         | `qa`                        | Test environment label             |
| `CI`               | _(set by GitHub Actions)_   | Enables CI-specific behavior       |

---

## Known Test Users

| Username                  | Purpose                                  |
| ------------------------- | ---------------------------------------- |
| `standard_user`           | Normal user — used for most tests        |
| `locked_out_user`         | Cannot log in — used for locked-out test |
| `problem_user`            | Exhibits application issues              |
| `performance_glitch_user` | Simulates slow responses                 |
| `error_user`              | Error behavior testing                   |
| `visual_user`             | Visual behavior testing                  |

---

## Debugging Failures

When a test fails, Playwright captures:

- **Screenshot** (on failure)
- **Video** (retained on failure)
- **Trace** (on first retry)

To view the trace:

```bash
npx playwright show-trace test-results/<test-folder>/trace.zip
```

Or open the HTML report which links directly to traces:

```bash
npm run test:report
```

---

## Adding New Tests

1. Create a new `.spec.ts` file in the appropriate `tests/` subdirectory.
2. Import `test` and `expect` from `../../src/fixtures/test.fixture`.
3. Use the provided page object fixtures (`inventoryPage`, `cartPage`, etc.).
4. Use data from `src/data/` — avoid hardcoding test data.
5. Tag your tests appropriately (`@smoke`, `@regression`, `@P0`, etc.).

---

## Contributing

- Run `npm run typecheck && npm run lint && npm run format:check` before committing.
- Follow the naming convention: `should [actor] [action] [expected outcome]`.
- Keep tests independent — no test should rely on another test's state.
- Do not commit `.env` or any file containing credentials.
