const { test, expect } = require('@playwright/test');

test('Failed Network Requests', async ({ page }) => {
    
  const failedRequests = [];

  page.on('requestfailed', request => {
    failedRequests.push(request.url());
  });

  await page.goto('https://www.wikipedia.org/');

  console.log('Failed Requests:', failedRequests); // Prints failed requests in terminal.

  expect(failedRequests.length).toBe(0);
});

test('Check HTTP Status Codes', async ({ page }) => {

  const badResponses = []; // Create an empty array to store bad responses

  page.on('response', response => {
    if (response.status() >= 400) {
      badResponses.push({
        url: response.url(),
        status: response.status()
      });
    }
  });

  await page.goto('https://www.wikipedia.org/');

  console.log(badResponses); // Prints any bad responses in terminal, showing URL and status code.

  expect(badResponses.length).toBe(0);
});


test('Key Resources Loaded', async ({ page }) => {

  const failedRequests = []; // Create an empty array to store failed requests

  page.on('requestfailed', request => {
    failedRequests.push(request.url());
  });

  await page.goto('https://www.wikipedia.org/');

  // Ensure no failed resources
  expect(failedRequests.length).toBe(0);

  // Check at least some images exist in DOM
  const images = await page.locator('img').count();
  expect(images).toBeGreaterThan(0);
});