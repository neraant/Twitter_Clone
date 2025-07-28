import test, { expect } from '@playwright/test';

import { routes } from '@/shared/config/routes';

test.describe('', () => {
  const userEmail = 'neraant1111@gmail.com';
  const userPassword = 'Qwerty123!';
  const expectedUserName = 'AntonCherednik';
  const expectedUserTelegram = '@nochnoychort';

  test.beforeEach(async ({ page }) => {
    await page.goto(routes.auth.login);

    await page.getByPlaceholder('Email address').fill(userEmail);
    await page.getByPlaceholder('Password').fill(userPassword);
    await page.getByRole('button', { name: 'sign' }).click();

    await expect(page).toHaveURL(routes.app.home);
  });

  test('User can view own profile with personal data', async ({ page }) => {
    await page.goto(routes.app.profile);

    await expect(page.getByTestId('user-telegram')).toHaveText(
      expectedUserTelegram,
    );
    await expect(page.getByTestId('user-name')).toHaveText(expectedUserName);
  });

  test('User can edit profile information', async ({ page }) => {
    const curDate = Date.now();
    const newBio = `new Bio ${curDate}`;

    await page.goto(routes.app.profile);

    page.getByRole('button', { name: 'edit profile' }).click();

    await page.fill('input[name="bio"]', newBio);

    await page.getByRole('button', { name: 'save' }).click();

    await expect(page.getByTestId('user-bio')).toHaveText(newBio);
  });

  test('User can change avatar and banner', async ({ page }) => {
    await page.goto(routes.app.profile);

    await page.getByRole('button', { name: 'edit profile' }).click();

    const avatarInput = page.locator('input[name="avatar"]');
    await avatarInput.setInputFiles('e2e/fixtures/user-avatar.webp');

    const bannerInput = page.locator('input[name="banner"]');
    await bannerInput.setInputFiles('e2e/fixtures/user-banner.webp');

    await page.getByRole('button', { name: 'save' }).click();

    const avatarImage = page.locator('[data-testid="user-avatar"]');
    const src = await avatarImage.getAttribute('src');

    expect(decodeURIComponent(src!)).toContain('/avatars/');
    expect(decodeURIComponent(src!)).toMatch(/\.webp/);

    const bannerImage = page.locator('[data-testid="user-banner"]');
    const bannerSrc = await bannerImage.getAttribute('src');

    expect(decodeURIComponent(bannerSrc!)).toContain('/banners/');
    expect(decodeURIComponent(bannerSrc!)).toMatch(/\.webp/);
  });
});
