import { createBdd } from 'playwright-bdd';
import { LoginPage } from '../../tests/pages/LoginPage';
import { AccountPage } from '../../tests/pages/AccountPage';

const { Given, When, Then } = createBdd();

const VALID_ACCOUNT = {
  email: 'customer@practicesoftwaretesting.com',
  password: 'welcome01',
};

Given('I am on the login page', async function ({ page }) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
});

When('I log in with a valid email and password', async function ({ page }) {
  const loginPage = new LoginPage(page);
  await loginPage.login(VALID_ACCOUNT.email, VALID_ACCOUNT.password);
});

Then('I should be logged in', async function ({ page }) {
  const accountPage = new AccountPage(page);
  await accountPage.expectLoggedIn();
});

Then('I should have access to my account', async function ({ page }) {
  const accountPage = new AccountPage(page);
  await accountPage.expectLoggedIn('Jane Doe');
});

// NOTE: remaining scenarios (wrong password, non-existent account,
// registration, unauthorized access) are defined in authentication.feature
// but not yet implemented here — error message selectors and the
// registration page's DOM have not been inspected yet.