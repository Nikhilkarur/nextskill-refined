import { test, expect } from '@playwright/test';

function uniqueEmail() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}@test.local`;
}

test.describe('Auth UI flows', () => {
  test('landing CTA navigates to auth signup and can create account', async ({ page }) => {
    await page.goto('/frontend/index.html');
    await page.getByRole('link', { name: 'Create Your Account' }).click();
    await expect(page).toHaveURL(/\/frontend\/auth.html\?form=signup/);

    // Ensure signup form is visible
    await expect(page.locator('#signup-form')).toBeVisible();

    const email = uniqueEmail();
    await page.locator('#signup-email').fill(email);
    await page.locator('#signup-password').fill('P@ssw0rd!');
    await page.locator('#signup-btn').click();

    // Expect redirect to questions page
    await expect(page).toHaveURL(/\/frontend\/questions.html$/);
  });

  test('header Sign In navigates to auth sign-in', async ({ page }) => {
    await page.goto('/frontend/index.html');
    await page.getByRole('banner').getByRole('link', { name: 'Sign In' }).click();
    await expect(page).toHaveURL(/\/frontend\/auth.html$/);

    // Ensure signin form is visible
    await expect(page.locator('#signin-form')).toBeVisible();
  });
});
