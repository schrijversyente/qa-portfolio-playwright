# QA Portfolio — Toolshop Test Automation

[![Playwright Tests](https://github.com/schrijversyente/qa-portfolio-playwright/actions/workflows/playwright.yml/badge.svg)](https://github.com/schrijversyente/qa-portfolio-playwright/actions/workflows/playwright.yml)

A Playwright + TypeScript + BDD test automation project built against [Practice Software Testing (Toolshop)](https://github.com/testsmith-io/practice-software-testing), run locally via Docker and validated in CI on three browsers.

**[View the latest test report →](https://schrijversyente.github.io/qa-portfolio-playwright/)**

This project isn't a step-by-step tutorial follow-along. It's built to demonstrate how I approach test automation as a senior/coordination-level exercise: risk-based strategy first, architecture second, code last — and it documents the real debugging process, including the parts that didn't go smoothly.

## The story, in short

1. I started from a risk analysis, not from writing tests (`docs/test-strategy.md`)
2. I mapped that analysis to concrete requirements and Gherkin scenarios (`docs/requirements-to-tests.md`)
3. I built a Page Object Model + fixtures architecture, not ad-hoc scripts
4. I deliberately implemented one scenario end-to-end and debugged it fully — including a CI pipeline failure that took five iterations and turned out to be a file-permission mismatch between the CI runner and the container user, not a timing issue as I initially assumed
5. I documented a known, unresolved limitation (see below) instead of hiding it

## Architecture

```
docs/                          Strategy and process documentation (Dutch)
features/
├── *.feature                  Implemented Gherkin scenarios (English)
├── pending/                   Scenarios written but not yet implemented
└── steps/                     Step definitions — thin translation layer to Page Objects
tests/
├── pages/                     Page Objects (locators + actions, no test logic)
└── fixtures/                  Reusable setup (e.g. API-based cart seeding)
.github/workflows/             CI pipeline (spins up the full app via Docker Compose)
```

**Key decisions and why:**

- **Playwright + `playwright-bdd`** instead of a separate Cucumber runner — generates standard Playwright tests, giving standard Playwright reporting/tracing for free, while still keeping Gherkin scenarios readable for non-technical stakeholders.
- **API-based fixtures over UI setup** (e.g. seeding a cart via `POST /carts` instead of clicking through the UI) — faster, and doesn't couple every test to unrelated parts of the UI.
- **`data-test` attributes over labels/text** for locators — stable across UI/copy changes.
- **The system under test (SUT) is never committed into this repo.** It's checked out separately (locally and in CI) and treated purely as infrastructure to test against — mixing application code and test code in one repository would blur exactly the distinction a test automation role is supposed to maintain.

## What's implemented vs. what's Gherkin-only

| Requirement                  | Status                                                                   |
|------------------------------|--------------------------------------------------------------------------|
| Authentication (login)       | ✅ Fully implemented, passing on 3 browsers                             |
| Postcode lookup (checkout)   | ⚠️ Implemented, tagged `@wip` and excluded from CI (see below)          |
| Checkout, Payment, Invoicing | 📝 Gherkin scenarios written (`features/pending/`), not yet implemented |

This is a deliberate choice: breadth of thought-through requirements and risk coverage, plus one fully-debugged deep example, rather than spreading effort thin trying to implement everything under time constraints.

## Known limitation

The postcode-lookup feature's automatic address lookup (an asynchronous, two-phase process in the Angular app) doesn't reliably trigger via Playwright's simulated input in every case. I investigated several hypotheses — `.fill()` vs. `pressSequentially()`, loading-indicator timing, polling strategies — and improved reliability significantly, but didn't fully resolve it within the available time. These scenarios are tagged `@wip` and excluded from the CI run (`--grep-invert @wip`) so the pipeline reflects what's actually verified, rather than reporting a false pass/fail on a known-flaky flow. Full details are in `docs/test-strategy.md`.

## CI/CD

The pipeline (`.github/workflows/playwright.yml`) checks out the Toolshop application separately, starts it via Docker Compose *inside the CI runner*, seeds the database, runs the full suite on Chromium/Firefox/WebKit, and publishes the HTML report to GitHub Pages.

Getting this working reliably took five debugging iterations, each with a different (and initially plausible) root cause — timeout length, step ordering, an unwaited one-shot dependency-install container, and finally a file-permission mismatch on the Docker bind mount. That process is preserved in the commit history rather than squashed away, since it reflects the actual work more honestly than a single "add CI" commit would.

## Documentation

- [`docs/test-strategy.md`](docs/test-strategy.md) — risk analysis, test levels, entry/exit criteria
- [`docs/requirements-to-tests.md`](docs/requirements-to-tests.md) — requirements mapped to test scenarios
- [`docs/onboarding-guide.md`](docs/onboarding-guide.md) — how to add a new test scenario to this framework
- [`docs/coding-conventions.md`](docs/coding-conventions.md) — conventions and lessons learned in this project

## Running locally

```bash
# 1. Clone and start the Toolshop application separately
git clone https://github.com/testsmith-io/practice-software-testing.git
cd practice-software-testing
docker compose up -d
docker exec -it pst-laravel-api-1 php artisan migrate:fresh --seed

# 2. In this repo
npm install
npm test            # runs bddgen automatically, then the full suite
npm run test:smoke  # fast subset: @smoke scenarios, excluding known-flaky @wip ones
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
npm run report        # open the last HTML report
```

## What I'd do with more time

- Resolve the postcode-lookup limitation with certainty (currently improved, not eliminated)
- Implement the remaining Gherkin scenarios (checkout, payment, invoicing)
- Add contract/API-level tests independent of the UI
- Add caching to the CI pipeline to reduce the ~10 minute cold-start time
