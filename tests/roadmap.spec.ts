import { test, expect } from '@playwright/test';

test('roadmap elements render and stats visible', async ({ page }) => {
  await page.goto('/frontend/roadmap.html');
  // Validate presence of key stats and phases container
  await expect(page.locator('#total-skills')).toBeVisible();
  await expect(page.locator('#estimated-time')).toBeVisible();
  await expect(page.locator('#difficulty-level')).toBeVisible();
  await expect(page.locator('#path-phases')).toBeVisible();
});
