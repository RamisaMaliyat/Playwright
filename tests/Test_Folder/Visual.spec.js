const { test, expect } = require('@playwright/test');
test('Wikipedia homepage visual test', async ({ page }) => {
  await page.goto('https://www.wikipedia.org/');

  // Wait for stable UI
  await page.waitForLoadState('networkidle');

  await expect(page).toHaveScreenshot('wikipedia-homepage.png');
});

test('Wikipedia logo visual test', async ({ page }) => {
  await page.goto('https://www.wikipedia.org/');

  const logo = page.locator('.central-featured-logo');

  await expect(logo).toBeVisible(); // stability step

  await expect(logo).toHaveScreenshot('wiki-logo.png');
});