const { test, expect } = require('@playwright/test');

test('Page Load Performance', async ({ page }) => {

  const start = Date.now();

  await page.goto('https://www.wikipedia.org/', {
    waitUntil: 'load'
  });

  const loadTime = Date.now() - start;

  console.log('Page Load Time:', loadTime);

  // Assert page loads within 3 seconds
  expect(loadTime).toBeLessThan(3000);

});

test('Detailed Performance Metrics', async ({ page }) => {

  await page.goto('https://www.wikipedia.org/');

  const performanceTiming = await page.evaluate(() => {
    const timing = performance.timing;

    return {
      domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
      loadComplete: timing.loadEventEnd - timing.navigationStart
    };
  });

  console.log(performanceTiming);

  expect(performanceTiming.domContentLoaded).toBeLessThan(2000);
  expect(performanceTiming.loadComplete).toBeLessThan(3000);

});

test('Modern Performance Metrics', async ({ page }) => {

  await page.goto('https://www.wikipedia.org/');

  const metrics = await page.evaluate(() => {
    const [entry] = performance.getEntriesByType('navigation');

    return {
      domContentLoaded: entry.domContentLoadedEventEnd,
      loadTime: entry.loadEventEnd,
    };
  });

  console.log(metrics);

  expect(metrics.loadTime).toBeLessThan(5000);
  expect(metrics.domContentLoaded).toBeLessThan(2000);
});

test('Performance on Slow Network', async ({ page, context }) => {

  await context.route('**/*', route => {
    setTimeout(() => route.continue(), 200); // artificial delay
  });

  const start = Date.now();

  await page.goto('https://www.wikipedia.org/');

  const loadTime = Date.now() - start;
  expect(loadTime).toBeLessThan(12000); // allow more time for slow network

  console.log('Slow Network Load Time:', loadTime);
  

});