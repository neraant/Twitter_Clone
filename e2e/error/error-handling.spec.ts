import test, { expect } from '@playwright/test';

import { routes } from '@/shared/config/routes';

test.describe('error-handling tests', () => {
  test('404 page displays for invalid URLs', async ({ page }) => {
    await page.goto('/non-existent-page-123');

    await expect(page.getByText(/You are lost/i)).toBeVisible();
  });

  test('User cannot access protected routes when logged out', async ({
    page,
  }) => {
    await page.goto(routes.app.home);

    await expect(page).toHaveURL(routes.auth.signUpMain);
  });
});
