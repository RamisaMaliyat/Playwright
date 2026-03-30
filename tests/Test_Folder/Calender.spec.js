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

//await page.waitForTimeout(3000);

});



test('Date Picker - Select Future and Verify Past is Interactive', async ({ page }) => {
    //  Navigate to the application
    const url = 'https://opensource-demo.orangehrmlive.com';
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    
    // Perform Login
    await page.getByPlaceholder('Username').fill('Admin');
    await page.getByPlaceholder('Password').fill('admin123');
    await page.getByRole('button', { name: 'Login' }).click();

    //  Navigate to the Leave module
    await page.getByRole('link', { name: 'Leave' }).click();
    
    //  Open the "From Date" Picker
    const dateInput = page.locator('.oxd-date-input i').nth(0); // Target the first date input's calendar icon
    await dateInput.click();

    // 5. SELECT A FUTURE DATE (e.g., 25th)
    // Using a scoped locator to avoid timeout errors
    const futureDate = page.locator('.oxd-calendar-wrapper').getByText('25', { exact: true });
    await futureDate.click();
    
    // 6. VERIFY A PREVIOUS DATE IS INTERACTIVE
    // Re-open the calendar
    await dateInput.click();
    
    // Target date '1' (which appeared enabled in your snapshot)
    const pastDate = page.locator('.oxd-calendar-wrapper').getByText('1', { exact: true });
    
    // ASSERT: Verify it is visible and NOT disabled
    await expect(pastDate).toBeVisible();
    await expect(pastDate).not.toHaveClass(/--disabled/);
    

    //If the preious date is disabled
    // await expect(pastDate).toHaveClass(/--disabled/);

    
    
    // 7. FUNCTIONAL VERIFICATION: Confirm clicking it updates the input
    // Get the current value (which is '25')
    const valueBefore = await page.locator('.oxd-date-input input').nth(0).inputValue();
    
    // Click the past date ('1')
    await pastDate.click();
    
    // Get the new value and verify it changed
    const valueAfter = await page.locator('.oxd-date-input input').nth(0).inputValue();
    
    // Verify that the value now contains '01' instead of '25'
    expect(valueAfter).not.toBe(valueBefore);
    expect(valueAfter).toContain('-01');

    //If the past date is disabled, then the value should not change
    // expect(valueAfter).toBe(valueBefore);


    await page.waitForTimeout(5000);
});

