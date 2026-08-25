import { Given, When, Then } from '../fixtures';
import {
  CUSTOMER_WITH_INVALID_PASSWORD,
  UNREGISTERED_EMAIL,
} from '../../tests/data/users';

Given('I am on the login page', async ({ loginPage }) => {
  await loginPage.goto();
});

Given('I am on the registration page', async ({ registerPage }) => {
  await registerPage.goto();
});

When('I log in with a valid email and password', async ({ loginPage, testUser }) => {
  await loginPage.login(testUser.email, testUser.password);
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

When('I register with valid, unique account details', async ({ registerPage, registeredUser }) => {
  registeredUser.email = `testuser-${Date.now()}@example.com`;
  registeredUser.password = 'Xk9#mQ2vLp7z!';
  await registerPage.register({
    firstName: 'Test',
    lastName: 'User',
    birthDate: '2000-01-01',
    country: 'Albania',
    postalCode: '1000',
    houseNumber: '1',
    city: 'Testville',
    state: 'TS',
    phone: '1234567890',
    email: registeredUser.email,
    password: registeredUser.password,
  });
});

Then('I should be logged in', async ({ accountPage }) => {
  await accountPage.expectLoggedIn();
});

Then('I should have access to my account', async ({ accountPage, testUser }) => {
  await accountPage.expectLoggedIn(testUser.name);
});

Then('I should see an error message', async ({ loginPage }) => {
  await loginPage.expectLoginError();
});

Then('I should not be logged in', async ({ loginPage }) => {
  await loginPage.expectNotLoggedIn();
});

Then('my account should be created', async ({ registerPage }) => {
  await registerPage.expectRegistrationSuccess();
});

Then('I should be able to log in with those details', async ({ loginPage, accountPage, registeredUser }) => {
  await loginPage.login(registeredUser.email, registeredUser.password);
  await accountPage.expectLoggedIn();
});
