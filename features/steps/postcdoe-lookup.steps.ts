import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { CheckoutPage } from '../../tests/pages/CheckoutPage';

const { Given, When, Then, Before } = createBdd();

Before(async ({ page }) => {
  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.goto();
});

Given('I am on the checkout page', async function () {
  // handled in Before-hook
});

Given('I have at least one product in my cart', async function ({ page }) {
  // Placeholder: seed via API instead of clicking through the UI (faster, more reliable)
  // TODO: implement once the /carts endpoint is wired into the test setup
});

Given('the postcode lookup upstream service is simulated to fail with a 502 error', async function ({ page }) {
  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.mockUpstreamFailure();
});

When('I enter a valid postcode {string} and house number {string}', async function ({ page }, postcode: string, houseNumber: string) {
  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.fillPostcodeAndWaitForLookup(postcode, houseNumber);
});

When('I enter an invalid postcode {string}', async function ({ page }, postcode: string) {
  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.fillInvalidPostcode(postcode);
});

Then('the street, city and state fields should be automatically filled in', async function ({ page }) {
  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.expectAddressFilledIn();
});

Then('I should be able to continue to the next checkout step', async function ({ page }) {
  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.expectContinueEnabled();
});

Then('I should see a validation error indicating the postcode is invalid', async function ({ page }) {
  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.expectValidationError(/invalid postcode/i);
});

Then('the address fields should remain empty', async function ({ page }) {
  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.expectAddressEmpty();
});

Then('I should not be able to continue to the next checkout step', async function ({ page }) {
  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.expectContinueDisabled();
});

Then('I should see a clear error message indicating the lookup failed', async function ({ page }) {
  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.expectValidationError(/could not look up your address/i);
});

Then('I should still be able to manually fill in my address', async function ({ page }) {
  const checkoutPage = new CheckoutPage(page);
  await expect(checkoutPage.streetInput).toBeEditable();
});

Then('I should be able to continue to the next checkout step after manually completing the address', async function ({ page }) {
  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.fillAddressManually('Teststraat 1', 'Testville', 'Test');
  await checkoutPage.expectContinueEnabled();
});