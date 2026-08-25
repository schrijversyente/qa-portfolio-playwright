import { test as base, createBdd } from 'playwright-bdd';
import { LoginPage } from '../tests/pages/LoginPage';
import { AccountPage } from '../tests/pages/AccountPage';
import { CheckoutPage } from '../tests/pages/CheckoutPage';
import { seedCart as seedCartApi } from '../tests/fixtures/cart';
import { seedUser, deleteUser, getAdminAccessToken } from '../tests/fixtures/user';
import { RegisterPage } from '../tests/pages/RegisterPage';

type Fixtures = {
  loginPage: LoginPage;
  accountPage: AccountPage;
  registerPage: RegisterPage;
  checkoutPage: CheckoutPage;
  seedCart: (productId?: string, quantity?: number) => Promise<void>;
  testUser: { email: string; password: string; name: string };
  registeredUser: { email: string; password: string };
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  accountPage: async ({ page }, use) => {
    await use(new AccountPage(page));
  },
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  seedCart: async ({ page, request }, use) => {
    await use((productId, quantity = 1) => seedCartApi(page, request, productId, quantity));
  },
  testUser: async ({ request }, use) => {
    const adminAccessToken = await getAdminAccessToken(request);
    const user = await seedUser(request);
    await use({ email: user.email, password: user.password, name: user.name });
    await deleteUser(request, user.id, adminAccessToken);
  },
  registeredUser: async ({}, use) => {
    await use({ email: '', password: '' });
  },
});

export const { Given, When, Then } = createBdd(test);
