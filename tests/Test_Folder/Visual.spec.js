
const { test, expect } = require('@playwright/test');
// Screenshot tests for Wikipedia homepage, logo, mobile view, and element masking.

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

test('Mobile view', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });

  await page.goto('https://www.wikipedia.org/');
  // Wait for stable UI
  await page.waitForLoadState('networkidle');

  await expect(page).toHaveScreenshot('wiki-mobile.png');
});

test('Take Screenshot of an element', async ({ page }) => {
  await page.goto('https://www.wikipedia.org/');
   // Wait for stable UI
  await page.waitForLoadState('networkidle');

  const search = page.locator('input[name="search"]');

  await search.click(); // Focus the search input to ensure consistent screenshot

  await expect(search).toHaveScreenshot('wiki-search-focus.png');
});


// Layout Validation

test('Full page layout validation', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });

  await page.goto('https://www.wikipedia.org/');

  await expect(page).toHaveScreenshot('full-layout.png', {
    animations: 'disabled'
  });
});

test('Header layout validation', async ({ page }) => {
  await page.goto('https://www.wikipedia.org/');
  await page.waitForLoadState('networkidle');

  const header = page.locator('.central-textlogo');

  await expect(header).toBeVisible();

  await expect(header).toHaveScreenshot('header-layout.png', {
    animations: 'disabled'
  });
});

test('Specific element layout validation', async ({ page }) => {
  await page.goto('https://www.wikipedia.org/');
  await page.waitForLoadState('networkidle');

  const searchBox = page.locator('input[name="search"]');

  await expect(searchBox).toBeVisible();

  await searchBox.click();

  await expect(searchBox).toHaveScreenshot('search-layout.png', {
    animations: 'disabled',
    caret: 'hide'
  });
});

test('Mobile layout validation', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });

  await page.goto('https://www.wikipedia.org/');
  await page.waitForLoadState('networkidle');

  await expect(page).toHaveScreenshot('mobile-layout.png', {
    animations: 'disabled'
  });
});

/*
// Visual Regression Testing

test('Full page visual regression test', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });

  await page.goto('https://www.wikipedia.org/');

  // Stable anchor instead of networkidle (more reliable)
  await expect(page.locator('#www-wikipedia-org')).toBeVisible();

  // Full page visual comparison
  await expect(page).toHaveScreenshot('full-page.png', {
    fullPage: true,
    animations: 'disabled',
    caret: 'hide',
    maxDiffPixelRatio: 0.02
  });
});
*/