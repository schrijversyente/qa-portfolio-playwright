import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('[data-test="email"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.submitButton = page.locator('[data-test="login-submit"]');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();

    // The click doesn't wait for the resulting navigation/re-render on its
    // own — without an explicit wait here, the caller can end up interacting
    // with a stale page (still showing the login form) before the redirect
    // to the address step actually completes.
    // GUESSING: waiting for the login form itself to disappear is a
    // reasonable generic signal, but verify this against the real app —
    // a more specific signal (e.g. waiting for the proceed-2 button to
    // become visible) may be more reliable if this proves flaky.
    await this.emailInput.waitFor({ state: 'hidden', timeout: 5000 });
  }
}