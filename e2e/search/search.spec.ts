import test, { expect } from '@playwright/test';

import { routes } from '@/shared/config/routes';

test.describe('', () => {
  const userEmail = 'neraant1111@gmail.com';
  const userPassword = 'Qwerty123!';

  test.beforeEach(async ({ page }) => {
    await page.goto(routes.auth.login);

    await page.getByPlaceholder('Email address').fill(userEmail);
    await page.getByPlaceholder('Password').fill(userPassword);
    await page.getByRole('button', { name: 'sign' }).click();

    await expect(page).toHaveURL(routes.app.home);
  });

  test('User can search for posts in sidebar', async ({ page }) => {
    await page.goto(routes.app.home);

    const rightSidebar = page.getByTestId('right-sidebar');
    await rightSidebar.getByTestId('search-input').fill('a');

    await expect(
      rightSidebar.getByTestId('post-search-card').first(),
    ).toBeVisible();
  });

  test('User can search for posts in explore page', async ({ page }) => {
    await page.goto(`${routes.app.explore}?tab=posts`);

    const wrapper = page.getByTestId('explore-input-wrapper');
    await wrapper.getByTestId('explore-input').fill('a');

    const resWrapper = page.getByTestId('search-results');

    await expect(
      resWrapper.getByTestId('post-search-card').first(),
    ).toBeVisible();
  });

  test('User can search for other users in explore page', async ({ page }) => {
    await page.goto(`${routes.app.explore}?tab=users`);

    const wrapper = page.getByTestId('explore-input-wrapper');
    await wrapper.getByTestId('explore-input').fill('a');

    const resWrapper = page.getByTestId('search-results');

    await expect(
      resWrapper.getByTestId('user-small-card').first(),
    ).toBeVisible();
  });
});
