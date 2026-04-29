const { test, expect } = require('@playwright/test');
const { it } = require('node:test');

test('Shopping Cart Test',  async ({page}) =>
{

    const url= 'https://www.saucedemo.com';
    await page.goto(url, { waitUntil: 'load', timeout: 10000 });

    await expect(page).toHaveURL(url);
    await expect(page).toHaveTitle('Swag Labs');

    // Login
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    // Verify successful login
    await expect(page).toHaveURL(/inventory\.html/);

    // Add items to cart
    const i1 = page.locator("#add-to-cart-sauce-labs-backpack"); // By id
    await i1.click();
    const i2 = page.locator("#add-to-cart-sauce-labs-bike-light"); // By id
    await i2.click();
    const i3 = page.locator("#add-to-cart-sauce-labs-onesie"); // By id
    await i3.scrollIntoViewIfNeeded
    await i3.click();
    const cartLink = page.locator('//*[@id="shopping_cart_container"]'); // By XPath
    await cartLink.click();
    await page.reload();
    // Verify items in cart
    const cartItems = page.locator('.cart_item');
    await expect(cartItems).toHaveCount(3);

    //Remove one item from cart
    const removeButton = page.locator('#remove-sauce-labs-backpack');    
    await removeButton.click();
     // Verify items count
    await expect(cartItems).toHaveCount(2);

    // Checkout
    const checkoutButton = page.locator('#checkout'); // By id
    await checkoutButton.click();

    // Fill in checkout information
  
    const fname = page.locator('#first-name');    
    await fname.fill('John');
    const lname = page.locator('#last-name');    
    await lname.fill('Doe');
    const Pcode = page.locator('#postal-code');    
    await Pcode.fill('12345');
    const continueButton = page.getByRole('button', { name: 'Continue' });
    await continueButton.click();

    // Calculate total price

    // Get all item prices and sum them
    const prices = page.locator('.inventory_item_price');
    const count = await prices.count();
    let sum = 0;
    for (let i = 0; i < count; i++) 
    {
    const text = await prices.nth(i).textContent(); // "$29.99"
    sum += parseFloat(text.replace('$', ''));
    }
    console.log('Total:', sum);
    // Get total text
    const totalText = await page.locator('.summary_subtotal_label').textContent();
    const total = parseFloat(totalText.replace('Item total: $', ''));
    // Assertion
    expect(sum).toBeCloseTo(total, 2); //compare values up to 2 decimal places

    // Finish checkout
    const finishButton = page.getByRole('button', { name: 'Finish' });
    await finishButton.click();
    // Verify checkout completion
    const confirmationMessage = page.locator('span[data-test="title"]');
    await expect(confirmationMessage).toHaveText('Checkout: Complete!');

});
/*

test('Multi page Form Test',  async ({page}) =>
{
    const url = 'https://automationexercise.com/login';
    await page.goto(url, { waitUntil: 'load', timeout: 10000 });
    await expect(page).toHaveURL(url);

    // Signup - Added 'await' to all interactions
    await page.locator('//input[@data-qa="signup-name"]').fill('John Doe');
    await page.locator('//input[@data-qa="signup-email"]').fill('1234abc@gmail.bd');
    await page.getByRole('button', { name: 'Signup' }).click();
    await page.waitForTimeout(3000) // Wait for the next page to load
    // Fill in account information

    // Click on the radio button 1
     const optionl =  page.locator('#uniform-id_gender2'); // By id
     optionl.check();
     // Check if radio button 1 is checked
     await expect(optionl).toBeChecked()

     const password = page.locator('#password'); // By id
    await password.fill('password123');

    // Select date of birth
  const days = await page.locator('#days');
  await expect(days).toBeVisible(); // Check if the dropdown list is visible
  await days.selectOption({ label: '5' });

  const months = await page.locator('#months');
  await expect(months).toBeVisible(); // Check if the dropdown list is visible
  await months.selectOption({ label: 'November' });

  const years = await page.locator('#years');
  await expect(years).toBeVisible(); // Check if the dropdown list is visible
  await years.selectOption({ label: '1990' });

  // Checkboxes
    const newsletterCheckbox = page.locator('#newsletter'); // By id
    await newsletterCheckbox.check();
    await expect(newsletterCheckbox).toBeChecked();
    const offersCheckbox = page.locator('#optin'); // By id
    await offersCheckbox.check();
    await expect(offersCheckbox).toBeChecked();
   // Fill in additional details
    await page.locator('#first_name').fill('John');
    await page.locator('#last_name').fill('Doe');  
    await page.locator('#company').fill('ABC Company');
    await page.locator('#address1').fill('123 Main St');
    await page.locator('#address2').fill('Apt 4B'); 
    await page.locator('#country').selectOption({ label: 'United States' });
    await page.locator('#state').fill('California');
    await page.locator('#city').fill('Los Angeles');        
    await page.locator('#zipcode').fill('90001');
    await page.locator('#mobile_number').fill('1234567890');
    await page.getByRole('button', { name: 'Create Account' }).click();


});

*/
test('Progress Bar Test',  async ({page}) =>
{
    const url= 'https://demoqa.com/progress-bar';
    await page.goto(url, { waitUntil: 'load', timeout: 10000 });

    await expect(page).toHaveURL(url);

    const startButton = page.locator('#startStopButton'); // By id
    await startButton.click();
     const progressBar = page.getByRole('progressbar');

    // This automatically retries until the condition is met or the timeout is reached.
    await expect(progressBar).toHaveText('100%', { timeout: 20000 });

    // Final verification of the style/state
    await expect(progressBar).toHaveAttribute('aria-valuenow', '100');
    await expect(page.getByRole('button', { name: 'Reset' })).toBeVisible();

    // Reset the progress bar
    const resetButton = page.getByRole('button', { name: 'Reset' });
    await resetButton.click();

});
 