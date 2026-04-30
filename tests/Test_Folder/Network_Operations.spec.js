import { test, expect } from '@playwright/test';

test('mock API from demo site', async ({ page }) => {
  // Step 1: Intercept the correct Fruit API
  await page.route('*/**/api/v1/fruits', async route => {
    const response = await route.fetch();
    const data = await response.json();

    // Step 2: Use 'name' instead of 'title' to match the app's logic
    data.push({
      name: 'This is a mocked fruit',
      id: 99999
    });

    // Step 3: Fulfill with the modified JSON
    await route.fulfill({
      response,
      contentType: 'application/json',
      body: JSON.stringify(data)
    });
  });

  await page.goto('https://demo.playwright.dev/api-mocking/');  // Opens the demo website --> When page loads: it calls /api/v1/fruits
 
  // Step 4: Verify the mocked fruit is visible
  await expect(page.getByText('This is a mocked fruit')).toBeVisible(); //Verifies: UI shows your mocked data

  await page.waitForTimeout(1000) // Just to visually confirm the test before it ends
});




test('validate API response', async ({ request, page }) => {

  const response = await request.get('https://dummyjson.com/products');

  // Validation
  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.products.length).toBeGreaterThan(0);

  // Show data in browser
  const productList = body.products
    .slice(0, 5) // show only first 5
    .map(p => `<li>${p.title} - $${p.price}</li>`)
    .join('');

  await page.setContent(`
    <h1>Products</h1>
    <ul>${productList}</ul>
  `);

  // Verify UI
  await expect(page.getByText(body.products[0].title)).toBeVisible();

  // Wait to see it
  await page.waitForTimeout(1000);
});




test('handle 500 error', async ({ page }) => {
  // 1. Target the CORRECT API URL for this site
  await page.route('*/**/api/v1/fruits', route => {
    route.fulfill({
      status: 500,
      contentType: 'text/plain',
      body: 'Internal Server Error'
    });
  });

  await page.goto('https://demo.playwright.dev/api-mocking/');

  // 2. Since the app doesn't show an "Error" text, 
  // we verify that the fruit list items are NOT present.
  await expect(page.locator('li')).toHaveCount(0);
  
  // Or verify a generic heading is still there but data is gone
  await expect(page.getByRole('heading', { name: 'Render a List of Fruits' })).toBeVisible();

  await page.waitForTimeout(1000) // Just to visually confirm the test before it ends
});


test('network failure', async ({ page }) => {

  await page.route('*/**/api/v1/fruits', route => {
    route.abort(); // kills request
  });

  await page.goto('https://demo.playwright.dev/api-mocking/');

  await page.waitForTimeout(2000) // Just to visually confirm the test before it ends
});

test('invalid JSON response', async ({ page }) => {

  await page.route('*/**/api/v1/fruits', route => {
    route.fulfill({
      status: 200,
      body: 'INVALID_JSON'
    });
  });

  await page.goto('https://demo.playwright.dev/api-mocking/');
});

test('slow network', async ({ page }) => {

  await page.route('*/**/api/v1/fruits', async route => {
    await new Promise(res => setTimeout(res, 5000));

    route.continue();
  });

  await page.goto('https://demo.playwright.dev/api-mocking/');
});




test('loading state during API call', async ({ page }) => {

  // Step 1: Delay API response
  await page.route('**/api/v1/fruits', async route => {
    await new Promise(res => setTimeout(res, 5000)); // 5 sec delay
    route.continue();
  });

  // Step 2: Open page
  await page.goto('https://demo.playwright.dev/api-mocking/');

  // Step 3: Check loading state appears
  await expect(page.getByText('Loading...')).toBeVisible();

  // Step 4: Wait for data to load
   await expect(page.locator('li').first()).toBeVisible({ timeout: 10000 });

  // Step 5: Ensure loading disappears
  await expect(page.getByText('Loading...')).not.toBeVisible();

  await page.waitForTimeout(3000) // Just to visually confirm the test before it ends

});