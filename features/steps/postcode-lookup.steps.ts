import { expect } from '@playwright/test';
import { Given, When, Then } from '../fixtures';
import { CUSTOMER } from '../../tests/data/users';

// NOTE: no Before-hook navigation anymore — navigation now happens explicitly
// AFTER sessionStorage seeding, since addInitScript only affects future
// navigations, not the currently-loaded page.

Given('I am on the checkout page', async () => {
  // handled as part of the combined flow below
});

Given('I have at least one product in my cart', async ({ seedCart, checkoutPage, loginPage }) => {
  await seedCart();
  await checkoutPage.goto();
  await checkoutPage.proceedToNextStep(1); // cart -> login step

  await loginPage.login(CUSTOMER.email, CUSTOMER.password);
  await checkoutPage.proceedToNextStep(2);

  // TODO: verify whether a proceed-2 step exists between login and the
  // address form (proceed-3) — add checkoutPage.proceedToNextStep(2) here
  // if the login doesn't automatically advance to the address step.
});

Given(
  'the postcode lookup upstream service is simulated to fail with a 502 error',
  async ({ checkoutPage }) => {
    await checkoutPage.mockUpstreamFailure();
  }
);

When(
  'I enter a valid postcode {string} and house number {string}',
  async ({ checkoutPage }, postcode: string, houseNumber: string) => {
    await checkoutPage.fillPostcodeAndWaitForLookup(postcode, houseNumber);
  }
);

When('I enter an invalid postcode {string}', async ({ checkoutPage }, postcode: string) => {
  await checkoutPage.fillInvalidPostcode(postcode);
});

Then(
  'the street, city and state fields should be automatically filled in',
  async ({ checkoutPage }) => {
    await checkoutPage.expectAddressFilledIn();
  }
);

Then('I should be able to continue to the next checkout step', async ({ checkoutPage }) => {
  await checkoutPage.expectContinueEnabled();
});

Then(
  'I should see a validation error indicating the postcode is invalid',
  async ({ checkoutPage }) => {
    await checkoutPage.expectValidationError(/invalid postcode/i);
  }
);

Then('the address fields should remain empty', async ({ checkoutPage }) => {
  await checkoutPage.expectAddressEmpty();
});

Then('I should not be able to continue to the next checkout step', async ({ checkoutPage }) => {
  await checkoutPage.expectContinueDisabled();
});

Then(
  'I should see a clear error message indicating the lookup failed',
  async ({ checkoutPage }) => {
    await checkoutPage.expectValidationError(/could not look up your address/i);
  }
);

Then('I should still be able to manually fill in my address', async ({ checkoutPage }) => {
  await expect(checkoutPage.streetInput).toBeEditable();
});

Then(
  'I should be able to continue to the next checkout step after manually completing the address',
  async ({ checkoutPage }) => {
    await checkoutPage.fillAddressManually('Teststraat 1', 'Testville', 'Test');
    await checkoutPage.expectContinueEnabled();
  }
);
