import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('[data-test="email"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.submitButton = page.locator('[data-test="login-submit"]');
    this.errorMessage = page.locator('[data-test="login-error"]');
  }

  async goto() {
    await this.page.goto('/auth/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
    // waitForURL isn't covered by the global expect.timeout config (that
    // only applies to expect() assertions), so this stays explicit — fail
    // fast if login doesn't redirect rather than waiting the full default.
    await this.page.waitForURL('**/account', { timeout: 5000 });
  }

  async loginWithInvalidCredentials(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async expectLoginError() {
    await expect(this.errorMessage).toHaveText('Invalid email or password');
  }

  async expectNotLoggedIn() {
    await expect(this.page).toHaveURL(/\/auth\/login/);
  }
}
