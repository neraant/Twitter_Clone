import test, { expect } from '@playwright/test';

import { routes } from '@/shared/config/routes';

test('User can logout and redirect to welcome page', async ({ page }) => {
  await page.goto(routes.auth.login);

  await page.getByPlaceholder('Email address').fill('neraant1111@gmail.com');
  await page.getByPlaceholder('Password').fill('Qwerty123!');
  await page.getByRole('button', { name: 'sign' }).click();

  await expect(page).toHaveURL(routes.app.home);

  await page.getByRole('button', { name: 'More', exact: true }).click();
  const moreActionsWrapper = page.getByTestId('more-actions');

  moreActionsWrapper.getByRole('button', { name: 'logout' }).click();

  const confirmModal = page.getByTestId('base-modal');
  await confirmModal.getByText('Logout', { exact: true }).click();

  await expect(page).toHaveURL(routes.auth.signUpMain);
});
