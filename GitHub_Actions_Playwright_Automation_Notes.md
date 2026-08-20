# GitHub Actions for Playwright Automation

## 1. Why Do We Need GitHub Actions?

Imagine multiple developers are working on the same application. Every time someone pushes code, we want our Playwright test suite to run automatically.

### Without CI

```text
Developer
   ↓
Write code
   ↓
Push to GitHub
   ↓
QA manually runs tests
   ↓
Find failures
   ↓
Report to developer
```

### With GitHub Actions

```text
Developer
   ↓
git push
   ↓
GitHub
   ↓
GitHub Actions
   ↓
Create Runner
   ↓
Checkout code
   ↓
Install Node
   ↓
Install dependencies
   ↓
Install Playwright browsers
   ↓
Run Playwright tests
   ↓
Generate report
   ↓
Upload report
   ↓
Developer sees PASS/FAIL
```

### Business Value

GitHub Actions helps us make automated testing part of the software delivery process.

The goal is:

> Every important code change should be automatically validated.

---

# 2. What Is GitHub Actions?

GitHub Actions is GitHub's automation and CI/CD platform.

It can automate:

- Build
- Test
- Lint
- Security checks
- Deployment
- Scheduled jobs
- Release processes

For Playwright, GitHub Actions can automatically execute our test suite whenever code is pushed or a Pull Request is created.

---

# 3. GitHub Actions Architecture

The most important hierarchy to understand is:

```text
GitHub Repository
       │
       └── .github/
             │
             └── workflows/
                    │
                    └── playwright.yml
                           │
                           ├── Workflow
                           │
                           ├── Events
                           │
                           ├── Jobs
                           │
                           └── Steps
                                  │
                                  ├── Action
                                  └── Command
```

## Important Terminology

| Keyword  | Meaning                              |
| -------- | ------------------------------------ |
| Workflow | Complete automation process          |
| Event    | What triggers the workflow           |
| Job      | Major unit of work                   |
| Runner   | Machine that executes the job        |
| Step     | Individual operation inside a job    |
| Action   | Reusable piece of automation         |
| Command  | Shell command executed by the runner |

---

# 4. Where Do We Create a GitHub Actions Workflow?

Inside the repository:

```text
.github/
   workflows/
      playwright.yml
```

Example:

```text
my-playwright-project/
│
├── tests/
├── playwright.config.ts
├── package.json
├── package-lock.json
│
└── .github/
    └── workflows/
        └── playwright.yml
```

GitHub automatically detects workflow files placed under:

```text
.github/workflows/
```

---

# 5. Complete Playwright GitHub Actions Workflow

A practical Playwright workflow can look like this:

```yaml
name: Playwright Tests

on:
  push:
    branches: [main]

  pull_request:
    branches: [main]

jobs:
  test:
    timeout-minutes: 60

    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v6

      - name: Setup Node.js
        uses: actions/setup-node@v6
        with:
          node-version: lts/*

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run Playwright tests
        run: npx playwright test

      - name: Upload Playwright report
        if: ${{ !cancelled() }}
        uses: actions/upload-artifact@v5
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

---

# 6. Explain Every Keyword

## 6.1 `name`

```yaml
name: Playwright Tests
```

Defines the name of the workflow.

In GitHub Actions UI, you will see:

```text
Playwright Tests
```

Think:

> `name` = What should I call this workflow?

---

# 7. `on`

```yaml
on:
```

`on` defines **when the workflow should execute**.

Think:

> `on` = What event should trigger my workflow?

Examples:

```yaml
on:
  push:
```

```yaml
on:
  pull_request:
```

```yaml
on:
  workflow_dispatch:
```

```yaml
on:
  schedule:
```

---

# 8. `push`

```yaml
on:
  push:
```

Runs the workflow when code is pushed to the repository.

Example:

```bash
git push origin main
```

This can trigger the workflow.

---

# 9. `pull_request`

```yaml
on:
  pull_request:
```

Runs the workflow when a Pull Request event occurs.

Typical workflow:

```text
Developer
   ↓
Create feature branch
   ↓
Write code
   ↓
Create Pull Request
   ↓
GitHub Actions
   ↓
Playwright tests
   ↓
PASS / FAIL
   ↓
PR review
```

This is one of the most valuable uses of automation in a development team.

---

# 10. `branches`

```yaml
on:
  push:
    branches: [main]
```

This means:

> Run the workflow only when code is pushed to `main`.

Multiple branches can be specified:

```yaml
branches:
  - main
  - develop
```

---

# 11. `jobs`

```yaml
jobs:
```

A workflow contains one or more jobs.

Example:

```yaml
jobs:
  test: ...

  security: ...

  deploy: ...
```

Conceptually:

```text
Workflow
│
├── Job 1 → Test
│
├── Job 2 → Security
│
└── Job 3 → Deploy
```

---

# 12. Job ID

```yaml
jobs:
  test:
```

`test` is the Job ID.

Other examples:

```yaml
jobs:
  playwright-tests:
```

```yaml
jobs:
  regression:
```

The Job ID identifies the job inside the workflow.

---

# 13. `timeout-minutes`

```yaml
timeout-minutes: 60
```

Defines the maximum amount of time the job can run.

Example:

```text
Test starts
    ↓
Tests hang
    ↓
60 minutes
    ↓
GitHub terminates the job
```

This is useful because browser processes or test processes can occasionally become stuck.

---

# 14. `runs-on`

```yaml
runs-on: ubuntu-latest
```

Answers:

> Where should the job execute?

GitHub provides a runner machine to execute the job.

Common options include:

```yaml
runs-on: ubuntu-latest
```

```yaml
runs-on: windows-latest
```

```yaml
runs-on: macos-latest
```

There are also self-hosted runners.

---

# 15. `steps`

```yaml
steps:
```

A job consists of multiple steps.

Example:

```text
JOB
 │
 ├── Step 1 → Checkout
 ├── Step 2 → Install Node
 ├── Step 3 → npm ci
 ├── Step 4 → Install browsers
 ├── Step 5 → Run tests
 └── Step 6 → Upload report
```

Steps normally execute in order.

---

# 16. `name` Inside a Step

Example:

```yaml
- name: Install dependencies
```

This is the display name of the step.

It makes the GitHub Actions UI easier to understand.

---

# 17. `uses`

Example:

```yaml
uses: actions/checkout@v6
```

`uses` means:

> Use an existing reusable GitHub Action.

Examples:

```yaml
uses: actions/checkout@v6
```

```yaml
uses: actions/setup-node@v6
```

```yaml
uses: actions/upload-artifact@v5
```

Think:

```text
uses → Reuse an existing Action
```

---

# 18. Understanding `actions/checkout@v6`

Break it down:

```text
actions / checkout @ v6
   │          │       │
   │          │       └── Version
   │          └────────── Action
   └──────────────────── GitHub organization
```

Therefore:

```yaml
uses: actions/checkout@v6
```

means:

> Use version 6 of the `checkout` action from the `actions` repository.

Its purpose is to make the repository code available on the runner.

Conceptually:

```text
GitHub Repository
       ↓
Runner
       ↓
Checkout repository code
```

---

# 19. `run`

Example:

```yaml
run: npm ci
```

`run` means:

> Execute a shell command on the runner.

Examples:

```yaml
run: npm ci
```

```yaml
run: npx playwright test
```

```yaml
run: npx playwright install --with-deps
```

Important distinction:

```text
uses → Use an existing Action

run  → Execute my command
```

---

# 20. `with`

Example:

```yaml
uses: actions/setup-node@v6

with:
  node-version: lts/*
```

`with` provides inputs/configuration to an Action.

Think:

```text
Action
   +
Configuration
   ↓
Configured Action
```

Here:

```yaml
node-version: lts/*
```

configures the Node.js version.

---

# 21. `npm ci`

```yaml
run: npm ci
```

`npm ci` is designed for CI environments.

It installs dependencies based on the lockfile.

Conceptually:

```text
package.json
package-lock.json
       ↓
     npm ci
       ↓
node_modules
```

For CI, `npm ci` provides a more predictable dependency installation process than `npm install`.

---

# 22. Installing Playwright Browsers

```yaml
run: npx playwright install --with-deps
```

Break it down:

```text
npx
 ↓
playwright
 ↓
install
 ↓
--with-deps
```

This installs Playwright browser binaries and required system dependencies for the CI environment.

---

# 23. Running Playwright Tests

```yaml
run: npx playwright test
```

This executes the Playwright test suite.

Important concept:

> GitHub Actions does not replace Playwright.

GitHub Actions provides the environment in which Playwright executes automatically.

```text
GitHub Actions
      ↓
Runner Environment
      ↓
Node.js
      ↓
Playwright
      ↓
Tests
```

---

# 24. `if`

Example:

```yaml
if: ${{ !cancelled() }}
```

`if` defines a condition for executing a step.

This example means:

> Execute this step if the workflow has not been cancelled.

This is particularly useful when uploading test reports after a test failure.

---

# 25. `${{ }}`

Example:

```yaml
if: ${{ !cancelled() }}
```

`${{ }}` is GitHub Actions expression syntax.

You will encounter expressions such as:

```yaml
${{ github.ref }}
```

```yaml
${{ github.event_name }}
```

```yaml
${{ secrets.API_KEY }}
```

```yaml
${{ matrix.browser }}
```

Expressions allow workflow behavior to depend on dynamic GitHub Actions values.

---

# 26. `env`

Environment variables can be defined using `env`.

Example:

```yaml
env:
  BASE_URL: https://www.saucedemo.com
```

Playwright/TypeScript can access it:

```typescript
const baseURL = process.env.BASE_URL;
```

This is useful when testing different environments:

```text
DEV
QA
STAGING
PRODUCTION
```

Instead of hardcoding URLs:

```typescript
https://www.saucedemo.com
```

we can configure them through the workflow.

Conceptually:

```text
GitHub Actions
       ↓
BASE_URL
       ↓
Playwright
```

---

# 27. Secrets

Sensitive information should never be hardcoded.

Avoid:

```yaml
USERNAME: admin
PASSWORD: password123
```

Use GitHub Secrets instead:

```yaml
env:
  USERNAME: ${{ secrets.TEST_USERNAME }}
  PASSWORD: ${{ secrets.TEST_PASSWORD }}
```

Typical flow:

```text
GitHub Repository
       ↓
Settings
       ↓
Secrets and variables
       ↓
Actions
       ↓
TEST_USERNAME
TEST_PASSWORD
```

Then the workflow can access:

```yaml
${{ secrets.TEST_USERNAME }}
```

Use secrets for:

- Usernames
- Passwords
- API keys
- Tokens
- Cloud credentials
- Other sensitive configuration

---

# 28. `with` vs `env`

This is an important interview question.

## `with`

Used to provide inputs to an Action.

```yaml
uses: actions/setup-node@v6

with:
  node-version: lts/*
```

## `env`

Used to define environment variables.

```yaml
env:
  BASE_URL: https://example.com
```

Remember:

```text
with → Action input

env  → Environment variable
```

---

# 29. Artifacts

Playwright generates useful output such as:

```text
playwright-report/
```

We can upload the report using:

```yaml
- name: Upload Playwright report
  if: ${{ !cancelled() }}
  uses: actions/upload-artifact@v5
  with:
    name: playwright-report
    path: playwright-report/
```

Conceptually:

```text
Playwright Test
      ↓
HTML Report
Screenshots
Traces
Videos
Logs
      ↓
GitHub Artifact
```

This allows the team to inspect test results after the workflow completes.

---

# 30. `retention-days`

```yaml
retention-days: 30
```

Defines how long the artifact should be retained.

Example:

```text
Artifact created
      ↓
Available for 30 days
      ↓
Automatically removed
```

---

# 31. `needs`

`needs` defines dependencies between jobs.

Example:

```yaml
jobs:
  test: ...

  report:
    needs: test
```

This means:

```text
test
 ↓
report
```

The `report` job waits for the `test` job.

Multiple dependencies are possible:

```yaml
needs: [test, security]
```

Conceptually:

```text
test ──────┐
           ├──→ deploy
security ──┘
```

---

# 32. Matrix Strategy

Matrix execution is very useful for Playwright.

Suppose we want to run tests against:

```text
Chromium
Firefox
WebKit
```

Instead of creating three separate jobs, use a matrix.

Example:

```yaml
strategy:
  matrix:
    browser:
      - chromium
      - firefox
      - webkit
```

Conceptually:

```text
             Matrix
               │
       ┌───────┼────────┐
       ↓       ↓        ↓
   Chromium  Firefox  WebKit
       ↓       ↓        ↓
    Tests     Tests     Tests
```

---

# 33. `strategy`

```yaml
strategy:
```

Controls how a job is executed.

One common use is:

```yaml
strategy:
  matrix:
```

---

# 34. `matrix`

Example:

```yaml
matrix:
  browser: [chromium, firefox, webkit]
```

This creates multiple executions.

We can access the current matrix value using:

```yaml
${{ matrix.browser }}
```

For example:

```yaml
run: npx playwright test --project=${{ matrix.browser }}
```

Conceptually:

```text
matrix.browser
      ↓
chromium
firefox
webkit
```

---

# 35. `continue-on-error`

Example:

```yaml
continue-on-error: true
```

This means:

> Do not stop the workflow just because this job or step fails.

Use this carefully.

For normal regression testing, you usually want the workflow to become **FAILED when Playwright tests fail**.

Do not use `continue-on-error` just to make a failing test suite appear successful.

---

# 36. `fail-fast`

For matrix jobs:

```yaml
strategy:
  fail-fast: false
```

This can allow the other matrix jobs to continue even if one fails.

For example:

```text
Chromium → FAIL
Firefox  → PASS
WebKit   → PASS
```

You may want all browser results rather than stopping after Chromium fails.

---

# 37. `permissions`

Example:

```yaml
permissions:
  contents: read
```

Permissions control what the workflow's GitHub token can access.

Security principle:

> Give the workflow only the permissions it actually needs.

This is especially important in production workflows.

---

# 38. `workflow_dispatch`

Example:

```yaml
on:
  workflow_dispatch:
```

This allows a user to manually start the workflow from the GitHub UI.

Conceptually:

```text
Automatic execution
       ↓
Push / Pull Request

OR

Manual execution
       ↓
Run workflow button
```

This is very useful for QA teams that want to run regression testing on demand.

---

# 39. `schedule`

GitHub Actions can run workflows on a schedule.

Example:

```yaml
on:
  schedule:
    - cron: '0 18 * * *'
```

Conceptually:

```text
Scheduled Time
      ↓
GitHub Actions
      ↓
Playwright Regression
      ↓
Report
```

This is useful for nightly regression testing.

---

# 40. Artifact vs Cache

Students often confuse these two.

## Cache

Used primarily to make future workflow runs faster.

```text
Dependencies
     ↓
Cache
     ↓
Reuse
     ↓
Faster workflow
```

## Artifact

Used to preserve outputs from a workflow.

```text
Playwright Test
      ↓
HTML report
Screenshots
Traces
Logs
      ↓
Artifact
```

Easy way to remember:

> **Cache is for speed; Artifact is for results.**

---

# 41. Important Playwright CI Flow

Students should remember this complete lifecycle:

```text
Developer
    ↓
git push / Pull Request
    ↓
GitHub
    ↓
Workflow triggered
    ↓
Runner created
    ↓
Checkout repository
    ↓
Setup Node.js
    ↓
Install dependencies
    ↓
Install Playwright browsers
    ↓
Run Playwright tests
    ↓
Generate report
    ↓
Upload artifacts
    ↓
PASS / FAIL
```

---

# 42. Playwright + GitHub Actions Mental Model

```text
                    GitHub Actions
                          │
                       WORKFLOW
                          │
                        EVENT
                          │
                         JOB
                          │
                        RUNNER
                          │
                        STEPS
                    ┌─────┴─────┐
                  uses          run
                   │             │
                ACTION        COMMAND
                   │             │
                   └──────┬──────┘
                          ↓
                      PLAYWRIGHT
                          ↓
                        TESTS
                          ↓
                 ┌────────┴────────┐
                 ↓                 ↓
               PASS              FAIL
                 │                 │
                 └────────┬────────┘
                          ↓
                       REPORT
                          ↓
                       ARTIFACT
```

---

# 43. AI-Assisted Test Automation Angle

For an AI Automation batch, GitHub Actions should not be taught as only a DevOps topic.

The bigger workflow is:

```text
Requirement
     ↓
AI Coding Assistant
     ↓
Playwright Framework
     ↓
playwright.config.ts
     ↓
Tests
     ↓
GitHub Actions Workflow
     ↓
Automated CI Execution
     ↓
Reports
```

A useful question to ask students:

> If an AI coding assistant creates our Playwright framework, can it also create the CI pipeline?

The answer is yes, but the engineer must understand the generated workflow and validate it.

The goal is not:

> "AI wrote the YAML."

The goal is:

> "I understand what the YAML does, so I can review, modify, debug and improve AI-generated CI automation."

---

# 44. Recommended 2-Hour Teaching Sequence

|        Time | Topic                                      |
| ----------: | ------------------------------------------ |
|    0–10 min | Why CI/CD is needed for Playwright         |
|   10–20 min | GitHub Actions architecture                |
|   20–30 min | Workflow → Event → Job → Runner → Step     |
|   30–45 min | Build first Playwright workflow            |
|   45–60 min | Explain YAML keywords                      |
|   60–75 min | Execute workflow with SauceDemo            |
|   75–90 min | Reports, screenshots, traces and artifacts |
|  90–105 min | Environment variables and Secrets          |
| 105–115 min | Matrix / multiple browsers                 |
| 115–120 min | Assignment + interview questions           |

---

# 45. Keywords Cheat Sheet

| Keyword             | Purpose                          |
| ------------------- | -------------------------------- |
| `name`              | Workflow/step name               |
| `on`                | Trigger event                    |
| `push`              | Trigger on push                  |
| `pull_request`      | Trigger on PR                    |
| `branches`          | Restrict trigger to branches     |
| `workflow_dispatch` | Manual trigger                   |
| `schedule`          | Scheduled execution              |
| `jobs`              | Define jobs                      |
| `runs-on`           | Select runner                    |
| `steps`             | Define job steps                 |
| `uses`              | Use reusable Action              |
| `run`               | Execute shell command            |
| `with`              | Pass Action inputs               |
| `env`               | Define environment variables     |
| `secrets`           | Access sensitive values          |
| `if`                | Conditional execution            |
| `${{ }}`            | Expression syntax                |
| `needs`             | Job dependency                   |
| `strategy`          | Control job execution strategy   |
| `matrix`            | Generate multiple job variations |
| `fail-fast`         | Control matrix cancellation      |
| `continue-on-error` | Allow failure without stopping   |
| `permissions`       | Control workflow permissions     |
| `upload-artifact`   | Store workflow outputs           |
| `retention-days`    | Artifact retention period        |
| `timeout-minutes`   | Job timeout                      |

---

# 46. Key Interview Questions

### Beginner

1. What is GitHub Actions?
2. What is a workflow?
3. Where do we store GitHub Actions workflow files?
4. What is the purpose of `on`?
5. What is a runner?
6. What is the difference between `run` and `uses`?
7. What is the purpose of `runs-on`?
8. Why do we use `npm ci` in CI?
9. Why do we need to install Playwright browsers?
10. What is an artifact?

### Intermediate

11. What is the difference between `with` and `env`?
12. How do you pass secrets to Playwright?
13. How do you run tests only on `main`?
14. How do you trigger tests on Pull Requests?
15. How do you run Playwright against multiple browsers?
16. What is a matrix strategy?
17. What is `needs`?
18. What is `workflow_dispatch`?
19. How do you schedule nightly Playwright tests?
20. What is the difference between cache and artifact?

### Advanced

21. How would you parallelize Playwright tests in GitHub Actions?
22. How would you preserve traces and screenshots after failures?
23. How would you run the same tests against DEV, QA and STAGING?
24. How would you secure credentials in GitHub Actions?
25. How would you design a scalable CI pipeline for a large Playwright suite?

---

# 47. Suggested Student Assignment

Build a GitHub Actions pipeline for the SauceDemo Playwright project.

### Requirements

- [ ] Create `.github/workflows/playwright.yml`
- [ ] Trigger on `push`
- [ ] Trigger on `pull_request`
- [ ] Run on `ubuntu-latest`
- [ ] Checkout repository
- [ ] Setup Node.js
- [ ] Install dependencies using `npm ci`
- [ ] Install Playwright browsers
- [ ] Execute Playwright tests
- [ ] Upload Playwright HTML report
- [ ] Upload report even when tests fail
- [ ] Configure `BASE_URL` using `env`
- [ ] Add manual execution using `workflow_dispatch`
- [ ] Add a browser matrix for Chromium, Firefox and WebKit
- [ ] Verify the workflow from the GitHub Actions tab

---

# 48. Final Takeaway

The most important mental model is:

```text
EVENT
  ↓
WORKFLOW
  ↓
JOB
  ↓
RUNNER
  ↓
STEPS
  ↓
PLAYWRIGHT
  ↓
TESTS
  ↓
REPORT
  ↓
ARTIFACT
```

GitHub Actions is not the test automation framework.

**Playwright = Test Automation**

**GitHub Actions = Automation/CI Platform that executes the tests**

Together:

```text
Playwright
     +
GitHub Actions
     ↓
Continuous Test Automation
```

---

## Official References

- GitHub Actions documentation: https://docs.github.com/en/actions
- Understanding GitHub Actions: https://docs.github.com/en/actions/get-started/understand-github-actions
- GitHub Actions workflow syntax: https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions
- Playwright CI documentation: https://playwright.dev/docs/ci-intro
- Playwright CI with GitHub Actions: https://playwright.dev/docs/ci
