import { Page, Locator, expect } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly postcodeInput: Locator;
  readonly houseNumberInput: Locator;
  readonly streetInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // Verified against actual DOM (data-test attributes, confirmed 2026-08-15)
    this.postcodeInput = page.locator('[data-test="postal_code"]');
    this.houseNumberInput = page.locator('[data-test="house_number"]');
    this.streetInput = page.locator('[data-test="street"]');
    this.cityInput = page.locator('[data-test="city"]');
    this.stateInput = page.locator('[data-test="state"]');
    this.continueButton = page.locator('[data-test="proceed-3"]');
  }

  async goto() {
    await this.page.goto('http://localhost:4200/checkout');
  }

  /**
   * Fills postcode (and optionally house number), then waits for the
   * automatic address lookup to complete. There is no separate "lookup"
   * button — the lookup fires automatically (likely on blur/input, with
   * a brief loading indicator) once postcode + house number are filled.
   */
  async fillPostcodeAndWaitForLookup(postcode: string, houseNumber?: string) {
    await this.postcodeInput.fill(postcode);
    if (houseNumber) {
      await this.houseNumberInput.fill(houseNumber);
      await this.houseNumberInput.blur();
    }
    // Wait for either the street field to be populated (success path)
    // or a reasonable timeout to elapse (failure/validation path handled
    // separately by the caller via expectValidationError / mockUpstreamFailure).
    await this.page.waitForTimeout(1000); // TODO: replace with a proper wait
    // (e.g. waiting for the loading indicator to disappear) once its
    // exact selector/behavior has been inspected.
  }

  async fillInvalidPostcode(postcode: string) {
    await this.postcodeInput.fill(postcode);
    await this.postcodeInput.blur();
  }

  async expectAddressFilledIn() {
    await expect(this.streetInput).not.toHaveValue('');
    await expect(this.cityInput).not.toHaveValue('');
    await expect(this.stateInput).not.toHaveValue('');
  }

  async expectAddressEmpty() {
    await expect(this.streetInput).toHaveValue('');
  }

  async expectContinueEnabled() {
    await expect(this.continueButton).toBeEnabled();
  }

  async expectContinueDisabled() {
    await expect(this.continueButton).toBeDisabled();
  }

  async fillAddressManually(street: string, city: string, state: string) {
    await this.streetInput.fill(street);
    await this.cityInput.fill(city);
    await this.stateInput.fill(state);
  }

  /**
   * NOTE: the exact validation error text/selector is still unverified
   * against the real UI (Guessing). Replace this regex once inspected.
   */
  async expectValidationError(pattern: RegExp) {
    await expect(this.page.getByText(pattern)).toBeVisible();
  }

  async mockUpstreamFailure() {
    await this.page.route('**/postcode-lookup**', (route) => {
      route.fulfill({
        status: 502,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Upstream lookup failure' }),
      });
    });
  }
}