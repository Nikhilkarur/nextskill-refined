import { test, expect } from '@playwright/test';

test.describe('Landing page', () => {
  test('loads hero and CTA', async ({ page, baseURL }) => {
    await page.goto('/frontend/index.html');
    await expect(page.getByRole('heading', { name: 'Your Skills, Upgraded.' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Join the Community' })).toBeVisible();
  });
});
