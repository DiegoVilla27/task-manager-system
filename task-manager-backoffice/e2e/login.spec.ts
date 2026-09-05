import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/login.page';

test.describe('Login: E2E', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should logged successfully', async ({ page }) => {
    await loginPage.login('admin@taskmanager.com', '12345678');

    await expect(page).toHaveURL(/.*\/dashboard\/users/);

    await expect(
      page.getByRole('heading', { level: 1, name: /gestión de usuarios/i }),
    ).toBeVisible();
    const token = await page.evaluate(() =>
      localStorage.getItem('access_token'),
    );
    expect(token).toBeTruthy();
  });
});
