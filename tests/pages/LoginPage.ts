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

  async goto() {
    await this.page.goto('http://localhost:4200/auth/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();

    // Verified: after a successful login, the app navigates to /account.
    // Waiting for this specific URL is more reliable than a generic
    // "form element disappeared" signal, and also fails clearly/fast if
    // login was unsuccessful for some other reason (wrong credentials etc.)
    // — in that case the caller should use loginExpectingFailure() instead.
    await this.page.waitForURL('**/account', { timeout: 5000 });
  }

  /**
   * For scenarios where login is expected to fail (wrong password,
   * non-existent account) — does not wait for navigation to /account.
   */
  async loginExpectingFailure(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}