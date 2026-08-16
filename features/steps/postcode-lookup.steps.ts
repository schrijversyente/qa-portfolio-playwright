import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { CheckoutPage } from '../../tests/pages/CheckoutPage';
import { LoginPage } from '../../tests/pages/LoginPage';
import { seedCart } from '../../tests/fixtures/cart';

const { Given, When, Then } = createBdd();

// NOTE: no Before-hook navigation anymore — navigation now happens explicitly
// AFTER sessionStorage seeding, since addInitScript only affects future
// navigations, not the currently-loaded page.

const TEST_ACCOUNT = {
  email: 'customer@practicesoftwaretesting.com',
  password: 'welcome01',
};

Given('I am on the checkout page', async function () {
  // handled as part of the combined flow below
});

Given('I have at least one product in my cart', async function ({ page, request }) {
  await seedCart(page, request, '01M02N50JG0W1SQWVKB1VZHN84', 1); // TODO: replace with a real product id
  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.goto();
  await checkoutPage.proceedToNextStep(1); // cart -> login step

  const loginPage = new LoginPage(page);
  await loginPage.login(TEST_ACCOUNT.email, TEST_ACCOUNT.password);
  await checkoutPage.proceedToNextStep(2);

  // TODO: verify whether a proceed-2 step exists between login and the
  // address form (proceed-3) — add checkoutPage.proceedToNextStep(2) here
  // if the login doesn't automatically advance to the address step.
});

Given(
  'the postcode lookup upstream service is simulated to fail with a 502 error',
  async function ({ page }) {
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.mockUpstreamFailure();
  }
);

When(
  'I enter a valid postcode {string} and house number {string}',
  async function ({ page }, postcode: string, houseNumber: string) {
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.fillPostcodeAndWaitForLookup(postcode, houseNumber);
  }
);

When('I enter an invalid postcode {string}', async function ({ page }, postcode: string) {
  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.fillInvalidPostcode(postcode);
});

Then(
  'the street, city and state fields should be automatically filled in',
  async function ({ page }) {
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.expectAddressFilledIn();
  }
);

Then('I should be able to continue to the next checkout step', async function ({ page }) {
  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.expectContinueEnabled();
});

Then(
  'I should see a validation error indicating the postcode is invalid',
  async function ({ page }) {
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.expectValidationError(/invalid postcode/i);
  }
);

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

Then(
  'I should be able to continue to the next checkout step after manually completing the address',
  async function ({ page }) {
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.fillAddressManually('Teststraat 1', 'Testville', 'Test');
    await checkoutPage.expectContinueEnabled();
  }
);
