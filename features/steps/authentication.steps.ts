import { Given, When, Then } from '../fixtures';
import {
  CUSTOMER,
  CUSTOMER_WITH_INVALID_PASSWORD,
  UNREGISTERED_EMAIL,
} from '../../tests/data/users';

Given('I am on the login page', async ({ loginPage }) => {
  await loginPage.goto();
});

When('I log in with a valid email and password', async ({ loginPage }) => {
  await loginPage.login(CUSTOMER.email, CUSTOMER.password);
});

When('I log in with a valid email and an incorrect password', async ({ loginPage }) => {
  await loginPage.loginWithInvalidCredentials(
    CUSTOMER_WITH_INVALID_PASSWORD.email,
    CUSTOMER_WITH_INVALID_PASSWORD.password
  );
});

When('I log in with an email that is not registered', async ({ loginPage }) => {
  await loginPage.loginWithInvalidCredentials(
    UNREGISTERED_EMAIL.email,
    UNREGISTERED_EMAIL.password
  );
});

Then('I should be logged in', async ({ accountPage }) => {
  await accountPage.expectLoggedIn();
});

Then('I should have access to my account', async ({ accountPage }) => {
  await accountPage.expectLoggedIn('Jane Doe');
});

Then('I should see an error message', async ({ loginPage }) => {
  await loginPage.expectLoginError();
});

Then('I should not be logged in', async ({ loginPage }) => {
  await loginPage.expectNotLoggedIn();
});
