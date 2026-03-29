
const { test, expect } = require('@playwright/test');
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


   // Clear theText and Auto Suggestion is hidden 

   /* SearchText.clear();
    await expect(suggestion).toBeHidden();*/



    //Click someting inside auto suggestion
    suggestion.click();
    

    // Check the title of this page
    const expected = 'Albert Einstein';
    const header = page.locator('//*[@id="firstHeading"]/span');
    await expect(header).toHaveText(expected);
    // Partial / substring match
    await expect(header).toContainText('Einstein');


    await page.waitForTimeout(5000);

})



// Meta data
test('WikiPidia',  async ({page}) =>
{
    const Url = 'https://www.wikipedia.org/';
    await page.goto(Url,
        {
               waitUntil: 'load',
               timeout: 10000
        });
    await expect(page).toHaveURL(Url)
    await expect(page).toHaveTitle('Wikipedia');

    // Check meta tag has correct content
    
    // <meta name="viewport" content="initial-scale=1,user-scalable=yes">
    const meta = await page.locator('head meta[name="viewport"]');
    await expect (meta).toHaveAttribute('content', 'initial-scale=1,user-scalable=yes');

    // <meta property="og:title" content="Wikipedia, the free encyclopedia">
    const meta1 = await page.locator('head meta[property="og:title"]')
    await expect (meta1).toHaveAttribute('content', 'Wikipedia, the free encyclopedia');
   
    // check that the <meta> tag exists
    await expect (meta1).toHaveCount(1);

    await page.waitForTimeout(5000);

})