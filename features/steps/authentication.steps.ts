import { createBdd } from 'playwright-bdd';
import { LoginPage } from '../../tests/pages/LoginPage';
import { AccountPage } from '../../tests/pages/AccountPage';

const { Given, When, Then } = createBdd();

const VALID_ACCOUNT = {
  email: 'customer@practicesoftwaretesting.com',
  password: 'welcome01',
};

const INVALID_PASSWORD = {
  email: 'customer2@practicesoftwaretesting.com',
  password: 'incorrect01',
};

const INVALID_EMAIL = {
  email: 'nonexistent@practicesoftwaretesting.com',
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

When('I log in with a valid email and an incorrect password', async function ({ page }) {
  const loginPage = new LoginPage(page);
  await loginPage.loginWithInvalidCredentials(INVALID_PASSWORD.email, INVALID_PASSWORD.password);
});

When('I log in with an email that is not registered', async function ({ page }) {
  const loginPage = new LoginPage(page);
  await loginPage.loginWithInvalidCredentials(INVALID_EMAIL.email, INVALID_EMAIL.password);
});

Then('I should be logged in', async function ({ page }) {
  const accountPage = new AccountPage(page);
  await accountPage.expectLoggedIn();
});

Then('I should have access to my account', async function ({ page }) {
  const accountPage = new AccountPage(page);
  await accountPage.expectLoggedIn('Jane Doe');
});

Then('I should see an error message', async function ({ page }) {
  const loginPage = new LoginPage(page);
  await loginPage.expectLoginError();
});

Then('I should not be logged in', async function ({ page }) {
  const loginPage = new LoginPage(page);
  await loginPage.expectLoginError();
});
