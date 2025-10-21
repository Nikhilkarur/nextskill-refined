import { test, expect } from '@playwright/test';

// Basic link checks to ensure top-level pages are reachable and nav links work

test.describe('Top-level link checks', () => {
  test('index -> about, auth links work', async ({ page }) => {
    await page.goto('/frontend/index.html');

    // About Us link
    await page.getByRole('link', { name: 'About Us' }).click();
    await expect(page).toHaveURL(/\/frontend\/about.html$/);

    // Back to index via header brand
    await page.getByRole('banner').getByRole('link', { name: 'NextSkill' }).click();
    await expect(page).toHaveURL(/\/frontend\/index.html$/);

    // Auth link (header)
    await page.getByRole('banner').getByRole('link', { name: 'Sign In' }).click();
    await expect(page).toHaveURL(/\/frontend\/auth.html/);
  });

  test('direct loads are OK', async ({ page }) => {
    for (const path of ['/frontend/auth.html', '/frontend/about.html', '/frontend/questions.html', '/frontend/roadmap.html', '/frontend/learning.html']) {
      await page.goto(path);
      const escaped = path.replaceAll('.', String.raw`\.`);
      await expect(page).toHaveURL(new RegExp(String.raw`${escaped}$`));
    }
  });
});
