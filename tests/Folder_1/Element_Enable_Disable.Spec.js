
const { test, expect } = require('@playwright/test');
const e = require('express');

test('WikiPides',  async ({page}) =>
{
    const url  = 'https://recruiter.bdjobs.com/RecruiterAccount/service-packages'
    await page.goto(url,
        {
               waitUntil: 'load',
               timeout: 10000
        });
    await expect(page).toHaveURL(url);

    //Number
    const number = await page.locator('	//input[@appnumericonly]');
    number.fill('9999');

    const quantitySection = page.getByText('Quantity').locator('..');
    const increment = quantitySection.locator('button').nth(1);

    await increment.click();
    await expect(increment).toBeDisabled();



    await page.waitForTimeout(5000);

})