import { test, expect } from '@playwright/test';

test('auth page renders and allows typing', async ({ page }) => {
  await page.goto('/frontend/auth.html');
  // Use Sign In form which is visible by default
  await page.locator('#signin-email').fill('user@example.com');
  await page.locator('#signin-password').fill('secret');
  await expect(page.locator('#signin-btn')).toBeVisible();
});
