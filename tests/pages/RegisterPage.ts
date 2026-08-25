import { Page, Locator } from '@playwright/test';

export type NewUser = {
    firstName: string;
    lastName: string;
    birthDate: string;
    country: string;
    postalCode: string;
    houseNumber: string;
    city: string;
    state: string;
    phone: string;
    email: string;
    password: string;
};

export class RegisterPage {
    readonly page: Page;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly birthDateInput: Locator;
    readonly countryDropdown: Locator;
    readonly postalCodeInput: Locator;
    readonly houseNumberInput: Locator;
    readonly cityInput: Locator;
    readonly stateInput: Locator;
    readonly phoneInput: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly registerButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.firstNameInput = page.locator('[data-test="first-name"]');
        this.lastNameInput = page.locator('[data-test="last-name"]');
        this.birthDateInput = page.locator('[data-test="dob"]');
        this.countryDropdown = page.locator('[data-test="country"]');
        this.postalCodeInput = page.locator('[data-test="postal_code"]');
        this.houseNumberInput = page.locator('[data-test="house_number"]');
        this.cityInput = page.locator('[data-test="city"]');
        this.stateInput = page.locator('[data-test="state"]');
        this.phoneInput = page.locator('[data-test="phone"]');
        this.emailInput = page.locator('[data-test="email"]');
        this.passwordInput = page.locator('[data-test="password"]');
        this.registerButton = page.locator('[data-test="register-submit"]');
    }

    async goto() {
        await this.page.goto('/auth/register');
    }

    private async fillRegistrationForm(user: NewUser) {
        await this.firstNameInput.fill(user.firstName);
        await this.lastNameInput.fill(user.lastName);
        await this.birthDateInput.fill(user.birthDate);
        await this.countryDropdown.selectOption(user.country);
        await this.postalCodeInput.fill(user.postalCode);
        await this.houseNumberInput.fill(user.houseNumber);
        await this.cityInput.fill(user.city);
        await this.stateInput.fill(user.state);
        await this.phoneInput.fill(user.phone);
        await this.emailInput.fill(user.email);
        await this.passwordInput.fill(user.password);
    }

    async register(user: NewUser) {
        await this.fillRegistrationForm(user);
        await this.registerButton.click();
    }

    async expectRegistrationSuccess() {
        await this.page.waitForURL('**/auth/login', { timeout: 5000 });
    }

}