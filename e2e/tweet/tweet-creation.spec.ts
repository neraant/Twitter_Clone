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

  test('User can create text tweet successfully', async ({ page }) => {
    const tweetContent = 'This is a test tweet from automated testing!';

    // Создание твита
    const textarea = page.getByTestId('post-textarea');
    await textarea.fill(tweetContent);
    await expect(page.locator(`text=${tweetContent.length}/500`)).toBeVisible();

    const submitButton = page.getByTestId('add-post-button');
    await submitButton.click();

    await expect(textarea).toHaveValue('', { timeout: 30000 });
    await expect(page.locator('text=0/500')).toBeVisible();
    await expect(
      page.getByTestId('post-card').filter({ hasText: tweetContent }),
    ).toBeVisible();

    // Удаление твита
    const post = page
      .getByTestId('post-card')
      .filter({ hasText: tweetContent });
    await expect(post).toBeVisible({ timeout: 5000 });

    const managePostButton = post.getByTestId('manage-post');
    await expect(managePostButton).toBeVisible();
    await managePostButton.click();

    await page.getByRole('button', { name: /delete/i }).click();

    const modal = page.getByTestId('base-modal');
    await expect(modal).toBeVisible();
    await modal.getByRole('button', { name: /^delete$/i }).click();

    // Ждём исчезновения модалки и поста
    await expect(modal).toBeHidden({ timeout: 5000 });
    await expect(
      page.getByTestId('post-card').filter({ hasText: tweetContent }),
    ).toHaveCount(0, { timeout: 5000 });

    // Перезагрузка и повторная проверка
    await page.reload();
    await expect(
      page.getByTestId('post-card').filter({ hasText: tweetContent }),
    ).toHaveCount(0, { timeout: 10000 });
  });

  test('User can create tweet with images (up to 5)', async ({ page }) => {
    const tweetContent = 'Testing tweet with multiple images!';

    await page.getByTestId('post-textarea').fill(tweetContent);

    const testImages = [
      'e2e/fixtures/user-avatar.webp',
      'e2e/fixtures/user-avatar.webp',
      'e2e/fixtures/user-avatar.webp',
      'e2e/fixtures/user-avatar.webp',
      'e2e/fixtures/user-avatar.webp',
    ];

    const fileInput = page.locator('input[type="file"]');

    await fileInput.setInputFiles(testImages);

    const imagePreviews = page.locator('[data-testid*="image-preview"]');
    await expect(imagePreviews).toHaveCount(Math.min(testImages.length, 5));

    const submitButton = page.getByTestId('add-post-button');
    await submitButton.click();

    await expect(page.getByTestId('post-textarea')).toHaveValue('', {
      timeout: 30000,
    });

    await expect(page.locator(`text=${tweetContent}`).first()).toBeVisible();

    // deleting
    const post = page.getByRole('article').filter({ hasText: tweetContent });
    await post.getByTestId('manage-post').click();

    await page.getByRole('button', { name: /delete/i }).click();

    const modal = page.getByTestId('base-modal');
    await modal.getByRole('button', { name: /^delete$/i }).click();

    await expect(page.locator(`text=${tweetContent}`)).toHaveCount(0);

    await page.reload();

    await expect(page.locator(`text=${tweetContent}`)).toHaveCount(0, {
      timeout: 10000,
    });
  });
});
