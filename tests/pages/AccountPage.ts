import { Page, Locator, expect } from '@playwright/test';

export class AccountPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly navMenuButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('[data-test="page-title"]');
    this.navMenuButton = page.locator('[data-test="nav-menu"]');
  }

  async expectLoggedIn(expectedName?: string) {
    await expect(this.page).toHaveURL(/\/account/);
    // The account page appears to render slowly after the URL changes
    await expect(this.pageTitle).toHaveText('My account', { timeout: 15000 });
    if (expectedName) {
      await expect(this.navMenuButton).toContainText(expectedName, { timeout: 15000 });
    }
  }
}