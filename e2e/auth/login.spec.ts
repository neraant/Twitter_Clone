import { expect, test } from '@playwright/test';

import { routes } from '@/shared/config/routes';

test.describe('Login Form Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(routes.auth.login);
  });

  test('User can login successfully', async ({ page }) => {
    await page.getByPlaceholder('Email address').fill('neraant1111@gmail.com');
    await page.getByPlaceholder('Password').fill('Qwerty123!');
    await page.getByRole('button', { name: 'sign' }).click();

    await Promise.all([
      page.waitForURL(routes.app.home),
      page.getByRole('button', { name: 'sign' }).click(),
    ]);
  });

  test("User can't login with invalid credentials", async ({ page }) => {
    await page.getByPlaceholder('Email address').fill('neraant1111@gmail.com');
    await page.getByPlaceholder('Password').fill('WrongPassword');
    await page.getByRole('button', { name: 'sign' }).click();

    await expect(page).toHaveURL(routes.auth.login);
    await expect(page.getByText(/invalid email or password/i)).toBeVisible();
  });

  test('Sign up link navigates to SignUp page', async ({ page }) => {
    await page.getByText('Sign up to Twitter').click();
    await expect(page).toHaveURL(routes.auth.signUp);
  });
});
