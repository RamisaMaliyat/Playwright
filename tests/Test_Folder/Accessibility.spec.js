// ARIA Lebel Verification 
const { test, expect } = require('@playwright/test');
test('Verify aria-label', async ({ page }) => {

  await page.goto('https://www.w3.org/WAI/');

  const footer = page.locator('footer');

  await expect(footer).toHaveAttribute('aria-label', 'Site');
});

test('Verify accessible name', async ({ page }) => {

  await page.goto('https://www.w3.org/WAI/');

  const footer = page.getByRole('contentinfo', { name: 'Site' });

  await expect(footer).toBeVisible();
});


test('Verify roles', async ({ page }) => {

  await page.goto('https://www.w3.org/WAI/');

  const footer = page.getByRole('contentinfo');
  const list = page.getByRole('list');

  await expect(footer).toBeVisible();
  await expect(list.first()).toBeVisible();
});



test('Tab until specific element is reached', async ({ page }) => {
  // Increase timeout for this specific test since looping is slow
  test.setTimeout(60000); 

  await page.goto('https://www.w3.org/');

  // Use a locator that matches the snapshot (a link named Search)
  const target = page.getByRole('link', { name: 'Search' });
  
  let found = false;
  for (let i = 0; i < 50; i++) {
    // Safety check: stop if page closed
    if (page.isClosed()) break;

    await page.keyboard.press('Tab');

    // Efficiently check if the current focused element matches our target
    const isFocused = await target.evaluate(node => document.activeElement === node)
                        .catch(() => false);

    if (isFocused) {
      found = true;
      break;
    }
  }

  expect(found).toBe(true);
  await expect(target).toBeFocused();
});


// Verify Screen reader output using accessibility snapshot
