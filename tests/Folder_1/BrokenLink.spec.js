const { test, expect } = require('@playwright/test');
const e = require('express');

test('Broken site detection',  async ({page}) =>
{
     const url = 'https://httpstat.us/500';

    try {
        const response = await page.request.get(url);
        if (response.status() >= 400) {
            console.log('Broken link detected:', response.status());
        } else {
            console.log('Link is valid:', response.status());
        }
    } catch (err) {
        // Any network failure is considered a broken link
        console.log('Broken link detected (network error):', err.message);
    }

     await page.waitForTimeout(5000);

});



test('Broken link detection',  async ({page}) =>
{
     const url = 'https://www.eddymens.com/blog/page-with-broken-pages-for-testing-53049e870421';
     await page.goto(url);

     const linkLocator = page.locator('.badge.badge-secondary.text-white.a9169a5');
    // Get the href attribute
    const link = await linkLocator.nth(0).getAttribute('href');
     if (!link) {
        console.log('No URL found on the link!');
        return;
    }
      try {
        // 3️⃣ Use APIRequestContext to fetch the link
        const response = await page.request.get(link);

        // 4️⃣ Check HTTP status
        if (response.status() >= 400) {
            console.log('Broken link detected:', link, response.status());
        } else {
            console.log('Link is valid:',link, response.status());
        }
    } catch (err) {
        console.log('Broken link detected (network error):', link, err.message);
    }

    await page.waitForTimeout(5000);

});