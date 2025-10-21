import { test, expect } from '@playwright/test';

test.describe('Questionnaire to Roadmap flow', () => {
  test('signup -> questions -> generate roadmap', async ({ page }) => {
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2)}@test.local`;

  // Sign in (form is visible by default in this static build)
  await page.goto('/frontend/auth.html');
  await page.locator('#signin-email').fill(unique);
  await page.locator('#signin-password').fill('P@ssw0rd!');
  await page.locator('#signin-btn').click();

  // Navigate to questions page
  await page.goto('/frontend/questions.html');

    // Answer Q1: target role (click option card)
    await page.locator('[data-option="software-engineer"]').click();
    await page.locator('#next-btn').click();

    // Answer Q2: experience
    await page.locator('[data-option="entry"]').click();
    await page.locator('#next-btn').click();

    // Answer Q3: priority
    await page.locator('[data-option="technical-skills"]').click();
    await page.locator('#next-btn').click();

    // Answer Q4: time commitment
    await page.locator('[data-option="5-hours"]').click();
    await page.locator('#next-btn').click();

  // Skip resume step to results (choose the visible button by name)
  await page.getByRole('button', { name: 'Skip This Step' }).click();

    // We should be on roadmap
    await page.waitForURL('**/frontend/roadmap.html');
    // Verify key roadmap stats are visible
    await expect(page.locator('#total-skills')).toBeVisible();
    await expect(page.locator('#estimated-time')).toBeVisible();
  });
});
