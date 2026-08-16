import { test as base, createBdd } from 'playwright-bdd';
import { LoginPage } from '../tests/pages/LoginPage';
import { AccountPage } from '../tests/pages/AccountPage';
import { CheckoutPage } from '../tests/pages/CheckoutPage';
import { seedCart as seedCartApi } from '../tests/fixtures/cart';

type Fixtures = {
  loginPage: LoginPage;
  accountPage: AccountPage;
  checkoutPage: CheckoutPage;
  seedCart: (productId?: string, quantity?: number) => Promise<void>;
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
});

export const { Given, When, Then } = createBdd(test);
