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


test('Multi page Form Test',  async ({page}) =>
{
    const url = 'https://automationexercise.com/login';
    await page.goto(url, { waitUntil: 'load', timeout: 10000 });
    await expect(page).toHaveURL(url);

    // Signup - Added 'await' to all interactions
    await page.locator('//input[@data-qa="signup-name"]').fill('John Doe');
    await page.locator('//input[@data-qa="signup-email"]').fill('abc@gmail.bd');
    await page.getByRole('button', { name: 'Signup' }).click();

    await page.waitForTimeout(3000) // Wait for the next page to load



});