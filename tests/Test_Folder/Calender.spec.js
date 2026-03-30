const { test, expect } = require('@playwright/test');

test('Date Picker Test',  async ({page}) =>
{
    const url= 'https://testautomationpractice.blogspot.com/';
    await page.goto(url);
    const datepicker = page.locator('#datepicker');
    await datepicker.scrollIntoViewIfNeeded();
    //await datepicker.fill('03/29/2026');
    const year = "2027"
    const month = "May"
    const date = "29"
    //Verify the correct date is entered
    await datepicker.click();
    
    while (true) 
        {
            const selectedYear = await page.locator('.ui-datepicker-year').textContent();

            const selectedMonth = await page.locator('.ui-datepicker-month').textContent();
                if(selectedYear === year && selectedMonth === month) 
                    {
                        break;
                    }
                await page.locator('[title="Next"]').click(); // Click the "Next" button to navigate to the next month
            
}

//Use $ because there are multiple elements with the same class name, we need to specify the index to select the correct one
//For date all the dates are in the same class name, so we need to specify the index to select the correct one

//Date selection using loop because there are multiple elements with the same class name, we need to specify the index to select the correct one
/*
const dates = await page.$$("//a[@class='ui-state-default']")
for (const dt of dates)
    {
        if(await dt.textContent() === date)
        {   await dt.click();
            break;
        }
    }

*/

// Date selectionwithout loop using nth-child selector
await page.click(`//a[@class='ui-state-default'][text()='${date}']`); //use ` for template literals to insert the date variable into the selector   


await page.waitForTimeout(5000);

});