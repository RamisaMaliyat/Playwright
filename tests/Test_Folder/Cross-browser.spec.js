const { test, expect , devices } = require('@playwright/test');
const e = require('express');

test('WikiPides',  async ({page}) =>
{
    const title = 'https://www.wikipedia.org/';
    await page.goto(title,
        {
               waitUntil: 'load',
               timeout: 10000
        });
    await expect(page).toHaveURL(title)
    await expect(page).toHaveTitle('Wikipedia');

    const SearchText = await page.locator('#searchInput');
    SearchText.fill('Einstein');
    // Verify If Auto Suggestion List Displayed
    await expect(
                page.locator('.suggestions-dropdown')
            ).toBeVisible();

  //  auto suggestion        
  const suggestion = await page.locator('.suggestions-dropdown a[href*="Albert_Einstein"]');


    suggestion.click();
    

    // Check the title of this page
    const expected = 'Albert Einstein';
    const header = page.locator('//*[@id="firstHeading"]/span');
    await expect(header).toHaveText(expected);
    // Partial / substring match
    await expect(header).toContainText('Einstein');


    await page.waitForTimeout(5000);

})

const viewports = [
  { width: 375, height: 667 },
  { width: 768, height: 1024 },
  { width: 1280, height: 800 }
]; 

viewports.forEach((size) => {
  test(`Responsive Test - ${size.width}x${size.height}`, async ({ page }) => {
    await page.setViewportSize(size);

    // Use 'commit' to move on as soon as the network response is received
    await page.goto('https://www.wikipedia.org/', { timeout: 30000 });

    await expect(page).toHaveURL('https://www.wikipedia.org/');
    
    // Use the locator directly; Playwright auto-waits for visibility
    const searchBox = page.locator('#searchInput');
    await searchBox.fill('Einstein');

    const suggestion = page.locator('.suggestions-dropdown a[href*="Albert_Einstein"]');
    await suggestion.click();

    await expect(page.locator('#firstHeading')).toHaveText('Albert Einstein');
  });
});


test('Custom Mobile Emulation', async ({ page }) => {

  await page.setViewportSize({ width: 375, height: 667 });

  await page.goto('https://www.wikipedia.org/');

});



test.use({
  ...devices['iPhone 13']
});

test('Touch Simulation Test', async ({ page }) => {

  await page.goto('https://www.wikipedia.org/');

  const searchBox = page.locator('#searchInput');

  //This acts like a finger tap on mobile
  await searchBox.tap();

  await searchBox.fill('Einstein');

  await page.locator('.suggestions-dropdown a[href*="Albert_Einstein"]').tap();

  await expect(page.locator('#firstHeading')).toHaveText('Albert Einstein');
});