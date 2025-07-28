import test, { expect } from '@playwright/test';

import { routes } from '@/shared/config/routes';

test.describe('Home page tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(routes.auth.login);

    await page.getByPlaceholder('Email address').fill('neraant1111@gmail.com');
    await page.getByPlaceholder('Password').fill('Qwerty123!');
    await page.getByRole('button', { name: 'sign' }).click();

    await expect(page).toHaveURL(routes.app.home);
  });

  test('Posts load on scroll (pagination)', async ({ page }) => {
    const initialPosts = page.locator('[data-testid="post-card"]');
    await expect(initialPosts).toHaveCount(10);

    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });

    await page.waitForTimeout(1000);

    await expect(initialPosts).toHaveCount(20);
  });
});
