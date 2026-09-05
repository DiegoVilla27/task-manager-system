import { type Locator, type Page, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  // readonly togglePasswordButton: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.emailInput = page.locator('input#login-email');
    this.passwordInput = page.locator('input#login-password');
    // this.togglePasswordButton = page.getByRole('button', { name: /(mostrar|ocultar) contraseña/i });
    this.submitButton = page.getByRole('button', { name: /acceder al panel/i });
  }

  async goto() {
    await this.page.goto('/auth/login');
  }

  async login(email: string, pass: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(pass);
    await this.submitButton.click();
  }

  async expectErrorMessage(message: string | RegExp) {
    // Si usas toasts de Sonner o alertas en el formulario
    await expect(this.page.getByText(message)).toBeVisible();
  }
}
