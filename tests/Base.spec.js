// Base.spec.js
const { test: base } = require('@playwright/test'); // rename test to base

// extend test with a fixture called basePage
const RunTest = base.extend({
  basePage: async ({ page }, use) =>
     {
         await page.goto('https://the-internet.herokuapp.com/', {
             waitUntil: 'load',
               timeout: 80000
    });
    // Verify page load completed
    await page.waitForLoadState('load');
    await use(page); // pass the page to tests
  }
});

module.exports = { RunTest };
