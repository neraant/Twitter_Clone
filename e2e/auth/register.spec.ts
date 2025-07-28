import { expect, test } from '@playwright/test';

import { routes } from '@/shared/config/routes';

test.describe('Registration Form Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(routes.auth.signUp);
  });

  test('User can register successfully (happy path)', async ({ page }) => {
    const name = 'TestUser';
    const phoneNumber = '299999999';
    const email = `test${Date.now()}@gmail.com`;
    const password = 'Qwerty123!';

    await page.getByPlaceholder('Name').fill(name);
    await page.getByPlaceholder('Phone number').fill(phoneNumber);
    await page.getByPlaceholder('Email').fill(email);
    await page.locator('input[name="password"]').fill(password);
    await page.locator('input[name="confirmPassword"]').fill(password);

    await page.getByRole('button', { name: 'Year' }).click();
    await page.getByText('2005').click();
    await page.getByRole('button', { name: 'Month' }).click();
    await page.getByText('November').click();
    await page.getByRole('button', { name: 'Day' }).click();
    await page.getByText('11', { exact: true }).click();

    await page.locator('button[type="submit"]').click();
    await expect(page.getByText('You are sign up successfully!')).toBeVisible();
    await expect(page).toHaveURL(routes.auth.login);
  });

  test('Registration fails with duplicate email', async ({ page }) => {
    const name = 'TestUser';
    const phoneNumber = '299999999';
    const email = 'cherednik0311@gmail.com';
    const password = 'Qwerty123!';

    await page.getByPlaceholder('Name').fill(name);
    await page.getByPlaceholder('Phone number').fill(phoneNumber);
    await page.getByPlaceholder('Email').fill(email);
    await page.locator('input[name="password"]').fill(password);
    await page.locator('input[name="confirmPassword"]').fill(password);

    await page.getByRole('button', { name: 'Year' }).click();
    await page.getByText('2000').click();
    await page.getByRole('button', { name: 'Month' }).click();
    await page.getByText('January').click();
    await page.getByRole('button', { name: 'Day' }).click();
    await page.getByText('15', { exact: true }).click();

    await page.locator('button[type="submit"]').click();
    await expect(page.getByText('Error!')).toBeVisible();
  });

  test('Age validation prevents registration of underage users', async ({
    page,
  }) => {
    await page.getByPlaceholder('Name').fill('TestUser');
    await page.getByPlaceholder('Phone number').fill('299999999');
    await page.getByPlaceholder('Email').fill(`test${Date.now()}@gmail.com`);
    await page.locator('input[name="password"]').fill('Qwerty123!');
    await page.locator('input[name="confirmPassword"]').fill('Qwerty123!');

    const currentYear = new Date().getFullYear();
    const underageYear = (currentYear - 15).toString();

    await page.getByRole('button', { name: 'Year' }).click();
    await page.getByText(underageYear).click();
    await page.getByRole('button', { name: 'Month' }).click();
    await page.getByText('January').click();
    await page.getByRole('button', { name: 'Day' }).click();
    await page.getByText('15', { exact: true }).click();

    await page.locator('button[type="submit"]').click();
    await expect(page.getByText(/16 y\.o\./)).toBeVisible();
  });
});
