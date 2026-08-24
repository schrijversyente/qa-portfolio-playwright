import { test as base, createBdd } from 'playwright-bdd';
import { LoginPage } from '../tests/pages/LoginPage';
import { AccountPage } from '../tests/pages/AccountPage';
import { CheckoutPage } from '../tests/pages/CheckoutPage';
import { seedCart as seedCartApi } from '../tests/fixtures/cart';
import { seedUser, deleteUser, getAdminAccessToken } from '../tests/fixtures/user';

type Fixtures = {
  loginPage: LoginPage;
  accountPage: AccountPage;
  checkoutPage: CheckoutPage;
  seedCart: (productId?: string, quantity?: number) => Promise<void>;
  testUser: { email: string; password: string; name: string };
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  accountPage: async ({ page }, use) => {
    await use(new AccountPage(page));
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
});

export const { Given, When, Then } = createBdd(test);
