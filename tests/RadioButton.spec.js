
const { test, expect } = require('@playwright/test');


test('Radio Button Test',  async ({page}) =>
{
    const URL = 'https://qa-automation-practice.netlify.app/radiobuttons.html';
    await page.goto(URL,
        {
               waitUntil: 'load',
        });
    await expect(page).toHaveURL(URL)

     // Click on the radio button 1
     const optionl =  page.getByRole('radio', { name: 'Radio button 1' });
     optionl.check();
     // Check if radio button 1 is checked
     await expect(optionl).toBeChecked();
     // Click on the radio button 2
     const option2 =  page.getByRole('radio', { name: 'Radio button 3' });
     option2.check();
     // Check if radio button 2 is checked
     await expect(option2).toBeChecked();
     // Check if radio button 1 is unchecked
     await expect(optionl).not.toBeChecked();
     await page.waitForTimeout(5000);
    
})

