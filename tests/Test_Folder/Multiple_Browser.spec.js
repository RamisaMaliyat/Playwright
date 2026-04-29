const { test, expect } = require('@playwright/test');
const { it } = require('node:test');

test('Handle New Tab ', async ({ page, context }) => {
    await page.goto('https://demoqa.com/browser-windows');

    // Promise.all waits for both the click and the 'page' event to finish
    const [newTab] = await Promise.all([
        context.waitForEvent('page'),      // 1. Start the listener
        page.locator('#tabButton').click() // 2. Trigger the new tab
    ]);

    // Ensure the new page is ready
    await newTab.waitForLoadState();

    // Interact with the new tab
    console.log('URL of new tab:', newTab.url()); // Prints URL of new tab in console
    await expect(newTab.locator('#sampleHeading')).toHaveText('This is a sample page'); // Verifies content inside new tab; Confirms correct page opened

    // You can still use the original 'page' object freely
    await page.bringToFront();
    await expect(page.locator("//h1[text()='Browser Windows']")).toHaveText('Browser Windows'); //Verifies original page is still correct

    await page.waitForTimeout(3000) // Just to visually confirm the test before it ends
});


test('Handle New Window popup', async ({ page }) => {
    await page.goto('https://demoqa.com/browser-windows');

    // Use Promise.all to catch the popup as it opens
    const [newWindow] = await Promise.all([
        page.waitForEvent('popup'),        // Wait for the popup event
        page.locator('#windowButton').click() // Action that triggers the window
    ]);

    // Ensure the new window is stable
    await newWindow.waitForLoadState();

    // Interact with the new window
    console.log('Window Title:', await newWindow.title()); //Prints window title
    await expect(newWindow.locator('#sampleHeading')).toHaveText('This is a sample page');

    // Close the new window and return to parent
    await newWindow.close();
    await expect(page.locator('h1')).toHaveText('Browser Windows');
    await page.waitForTimeout(3000)
});


// ifreme handling

test('iframe ', async ({ page }) => {


  await page.goto('https://commitquality.com/practice-iframe');

  // Verify iframe is visible
  const iframe = page.locator('[data-testid="iframe"]');
  await expect(iframe).toBeVisible();

  // Switch to iframe
  const frame = page.frameLocator('[data-testid="iframe"]');

  // Verify initial element inside iframe
  const filterInput = frame.getByPlaceholder('Filter by product name');
  await expect(filterInput).toBeVisible();

  // Type into input
  await filterInput.fill('Subscribe!!');

  // Validate entered value
  await expect(filterInput).toHaveValue('Subscribe!!');

  // Click "Add Product" (navigation inside iframe)
  await frame.locator('[data-testid="navbar-addproduct"]').click();

  // Verify navigation happened (new page inside iframe)
  await expect(frame.locator('h1')).toHaveText('Add Product');

  // Validate form fields on new page
  const nameField = frame.getByPlaceholder('Enter a product name');
  const priceField = frame.getByPlaceholder('Enter a price');

  await expect(nameField).toBeVisible();
  await expect(priceField).toBeVisible();

  // Fill form fields
  await nameField.fill('Test Product');
  await priceField.fill('100');

  // Validate entered values
  await expect(nameField).toHaveValue('Test Product');
  await expect(priceField).toHaveValue('100');

  // Click cancel to go back
  await frame.getByText('cancel').click();

  // Verify back navigation to original iframe page
  await expect(frame.getByPlaceholder('Filter by product name')).toBeVisible();

  await page.waitForTimeout(3000) // Just to visually confirm the test before it ends

});



test('Handle Alerts ', async ({ page }) => {

  await page.goto('https://the-internet.herokuapp.com/javascript_alerts');

  // -----------------------------
  // 🔹 1. JS Alert (OK only)
  // -----------------------------
  page.once('dialog', async dialog => {
    console.log('Alert:', dialog.message());
    await dialog.accept(); // click OK
  });

  await page.click('button[onclick="jsAlert()"]');

  await expect(page.locator('#result'))
    .toHaveText('You successfully clicked an alert');
 await page.waitForTimeout(3000) 
  // -----------------------------
  // 🔹 2. JS Confirm (Accept / Dismiss)
  // -----------------------------
  page.once('dialog', async dialog => {
    console.log('Confirm:', dialog.message());
    await dialog.dismiss(); // click Cancel
  });

  await page.click('button[onclick="jsConfirm()"]');

  await expect(page.locator('#result'))
    .toHaveText('You clicked: Cancel');
 await page.waitForTimeout(3000) 
  // -----------------------------
  // 🔹 3. JS Prompt (Send text + Accept)
  // -----------------------------
  page.once('dialog', async dialog => {
    console.log('Prompt:', dialog.message());
    await dialog.accept('Playwright User'); // input text + OK
  });

  await page.click('button[onclick="jsPrompt()"]');

  await expect(page.locator('#result'))
    .toHaveText('You entered: Playwright User');
 await page.waitForTimeout(3000) 
});
