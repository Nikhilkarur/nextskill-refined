import { test, expect } from '@playwright/test';

function uniqueEmail() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}@test.local`;
}

test('duplicate signup suggests sign in and shows error', async ({ page }) => {
  const email = uniqueEmail();
  const password = 'P@ssw0rd!';

  // First signup succeeds
  await page.goto('/frontend/auth.html?form=signup');
  await page.locator('#signup-email').fill(email);
  await page.locator('#signup-password').fill(password);
  await page.locator('#signup-btn').click();
  await expect(page).toHaveURL(/\/frontend\/questions.html$/);

  // Go back to try duplicate signup
  await page.goto('/frontend/auth.html?form=signup');
  await page.locator('#signup-email').fill(email);
  await page.locator('#signup-password').fill(password);
  await page.locator('#signup-btn').click();

  // Should still be on auth page and show error message guiding to sign in
  await expect(page).toHaveURL(/\/frontend\/auth.html/);
  await expect(page.locator('#auth-error')).toContainText('Email already exists');
  // It should switch to sign-in tab and prefill
  await expect(page.locator('#signin-form')).toBeVisible();
  await expect(page.locator('#signin-email')).toHaveValue(email);
});
