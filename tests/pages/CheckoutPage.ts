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
    await this.page.goto('/checkout');
  }

  /**
   * The checkout flow is a multi-step wizard with buttons like
   * [data-test="proceed-1"], [data-test="proceed-2"], [data-test="proceed-3"].
   * This advances from a given step to the next.
   */
  async proceedToNextStep(step: number) {
    await this.page.locator(`[data-test="proceed-${step}"]`).click();
  }

  /**
   * Fills postcode (and optionally house number), then waits for the
   * automatic address lookup to complete. There is no separate "lookup"
   * button — the lookup fires automatically (likely on blur/input, with
   * a brief loading indicator) once postcode + house number are filled.
   */
  async fillPostcodeAndWaitForLookup(postcode: string, houseNumber: string) {
    // Using pressSequentially() instead of fill(): Angular's reactive form
    // (valueChanges + debounce) appears to require actual keystroke events,
    // not a single programmatic value change — confirmed by manual typing
    // working while .fill() did not trigger the lookup.
    await this.postcodeInput.pressSequentially(postcode, { delay: 50 });
    await this.houseNumberInput.pressSequentially(houseNumber, { delay: 50 });
    await this.houseNumberInput.blur();

    await expect(this.postcodeInput).toHaveValue(postcode);
    await expect(this.houseNumberInput).toHaveValue(houseNumber);

    // The lookup happens in two phases: a fast partial fill (street/city,
    // no state) followed by a slower "real" lookup that overwrites all
    // fields including state. Rather than depending on catching the
    // loading indicator's visible/hidden timing (unreliable — it can
    // change state faster than we observe it), we poll directly on the
    // field that is only ever populated by the SECOND, complete phase:
    // the state field. Once it's non-empty, the full lookup has settled.
    await expect
      .poll(async () => this.stateInput.inputValue(), {
        message: 'Waiting for postcode lookup to fully complete (state field populated)',
        timeout: 8000,
        intervals: [250, 500, 1000],
      })
      .not.toBe('');

    // Lookup should not have changed postcode/house number themselves
    await expect(this.postcodeInput).toHaveValue(postcode);
    await expect(this.houseNumberInput).toHaveValue(houseNumber);

    // Sanity check that the lookup actually produced a full address
    await expect(this.streetInput).not.toHaveValue('');
    await expect(this.cityInput).not.toHaveValue('');
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
