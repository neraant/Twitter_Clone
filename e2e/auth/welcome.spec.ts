import { expect, test } from '@playwright/test';

import { routes } from '@/shared/config/routes';

test.describe('Welcome Form Tests', () => {
  test('Redirect to /welcome page by default', async ({ page }) => {
    await page.goto(routes.app.home);
    await expect(page).toHaveURL(routes.auth.signUpMain);
  });

  test('SignUp button redirect to signUp page', async ({ page }) => {
    await page.goto(routes.auth.signUpMain);
    await page.getByText('Sign up with email').click();
    await expect(page).toHaveURL(routes.auth.signUp);
  });

  test('SignUp with google button redirect to signUp with google page', async ({
    page,
  }) => {
    await page.goto(routes.auth.signUpMain);
    await page.getByText('Sign up with Google').click();
    await expect(page).toHaveURL(/accounts\.google\.com/);
  });
});
