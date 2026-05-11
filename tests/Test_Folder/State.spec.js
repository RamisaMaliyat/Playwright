
const { test, expect } = require('@playwright/test');

// Session Storage and Local Storage tests
// Read LocalStorage
test('Read localStorage value', async ({ page }) => {
  await page.goto('https://www.wikipedia.org/');

  const value = await page.evaluate(() => {
    return localStorage.getItem('testKey');
  });

  // Wikipedia may not have it, just validate access works
  expect(value).toBeNull();
  await page.waitForTimeout(1000); // Stability step
});

// Set LocalStorage BEFORE page load 

test('Set localStorage before page load', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('theme', 'dark');
  });

  await page.goto('https://www.wikipedia.org/');

  const value = await page.evaluate(() => localStorage.getItem('theme'));

  expect(value).toBe('dark');
});

// Verify LocalStorage persistence after reload
test('localStorage persists after reload', async ({ page }) => {
  await page.goto('https://www.wikipedia.org/');

  await page.evaluate(() => {
    localStorage.setItem('persistKey', '123');
  });

  await page.reload();

  const value = await page.evaluate(() => {
    return localStorage.getItem('persistKey');
  });

  expect(value).toBe('123');
});

//sessionStorage behavior (clears after new session)
test('sessionStorage clears in new browser context', async ({ browser }) => {
  const context1 = await browser.newContext();
  const page1 = await context1.newPage();

  await page1.goto('https://www.wikipedia.org/');
  await page1.evaluate(() => {
    sessionStorage.setItem('temp', 'abc');
  });

  await context1.close(); // simulate tab close

  const context2 = await browser.newContext();
  const page2 = await context2.newPage();

  await page2.goto('https://www.wikipedia.org/');

  const value = await page2.evaluate(() => {
    return sessionStorage.getItem('temp');
  });

  expect(value).toBeNull();
  await page2.waitForTimeout(1000); // Stability step
});

// Use storageState (save + reuse state)
test('Save storage state', async ({ page }) => {
  await page.goto('https://www.wikipedia.org/');

  await page.evaluate(() => {
    localStorage.setItem('userPref', 'en');
  });

  await page.context().storageState({ path: 'state.json' });
});

// Reuse saved state
test.use({ storageState: 'state.json' });

test('Reuse storage state', async ({ page }) => {
  await page.goto('https://www.wikipedia.org/');

  const value = await page.evaluate(() => {
    return localStorage.getItem('userPref');
  });

  expect(value).toBe('en');
  await page.waitForTimeout(1000); // Stability step
});

// Cookies test
// Read cookies

test('Read cookies', async ({ page }) => {
  await page.goto('https://recruiter.bdjobs.com/');

  const cookies = await page.context().cookies();

  console.log(cookies);

  expect(cookies.length).toBeGreaterThan(0);
  await page.waitForTimeout(1000); // Stability step
});
// Check specific cookie value
test('Check specific cookie exists', async ({ page }) => {
  await page.goto('https://www.wikipedia.org/');
  await page.waitForTimeout(5000); 

  const cookies = await page.context().cookies();

  const cookie = cookies.find(c => c.name.includes('GeoIP'));

  expect(cookie).toBeTruthy();
  console.log(cookie);
});
// Add cookie manually
test('Set cookie before page load', async ({ context, page }) => {
  await context.addCookies([{
    name: 'testCookie',
    value: '123',
    domain: '.bdjobs.com',
    path: '/'
  }]);

  await page.goto('https://recruiter.bdjobs.com/');

  const cookies = await context.cookies();

  const cookie = cookies.find(c => c.name === 'testCookie');

  expect(cookie.value).toBe('123');
  console.log(cookie);
});

// Verify cookie persistence
test('Cookie persists across reload', async ({ page }) => {
  await page.goto('https://recruiter.bdjobs.com/');

  await page.context().addCookies([{
    name: 'persistCookie',
    value: 'abc',
    domain: '.bdjobs.com',
    path: '/'
  }]);

  await page.reload();

  const cookies = await page.context().cookies();

  const cookie = cookies.find(c => c.name === 'persistCookie');

  expect(cookie).toBeDefined();
  console.log(cookie);
});
// Clear cookies
test('Clear cookies', async ({ context, page }) => {
  await page.goto('https://recruiter.bdjobs.com/');

  await context.clearCookies();

  const cookies = await context.cookies();

  expect(cookies.length).toBe(0);
  console.log(cookies);
});

// Validate cookie properties
test('Validate cookie security flags', async ({ page }) => {
  await page.goto('https://www.wikipedia.org/');

  const cookies = await page.context().cookies();

  const cookie = cookies[0];

  expect(cookie.secure).toBeTruthy();
  expect(cookie.sameSite).toBeTruthy();
});

// Cache validation

// Check resources are served from cache after reload
test('Static resources should be cached after reload', async ({ page }) => {
    await page.goto('https://recruiter.bdjobs.com/');

  const cachedResponses = [];

  page.on('response', async (res) => {
    const headers = res.headers();

    // Check cache-related headers
    const cacheControl = headers['cache-control'];

    if (cacheControl && !cacheControl.includes('no-cache')) {
      cachedResponses.push(res.url());
    }
  });

  await page.reload();

  expect(cachedResponses.length).toBeGreaterThan(0);
});

// Validate cache headers
test('Validate cache headers on static resources', async ({ page }) => {
  await page.goto('https://recruiter.bdjobs.com/');

  const cacheableResources = [];

  page.on('response', (res) => {
    const url = res.url();

    // Target static files only
    if (url.match(/\.(css|js|png|jpg|svg|woff2?)/)) {
      const headers = res.headers();

      if (headers['cache-control']) {
        cacheableResources.push({
          url,
          cache: headers['cache-control']
        });
      }
    }
  });

  await page.reload();

  expect(cacheableResources.length).toBeGreaterThan(0);
});

// reload should be faster than first load
test('Reload should be faster due to caching', async ({ page }) => {

  const t1 = Date.now();
  await page.goto('https://recruiter.bdjobs.com/');
  await page.waitForLoadState('networkidle');
  const firstLoad = Date.now() - t1;

  const t2 = Date.now();
  await page.reload();
  await page.waitForLoadState('networkidle');
  const reload = Date.now() - t2;

  console.log({ firstLoad, reload });

  expect(reload).toBeLessThan(firstLoad);
});


// No broken UI after reload

test('UI should remain stable after cache reload', async ({ page }) => {

  await page.goto('https://recruiter.bdjobs.com/');

  await page.reload();

  const imgCount = await page.locator('img').count();
  const buttonCount = await page.locator('button').count();

  // Validate UI is not broken
  expect(imgCount).toBeGreaterThan(0);
  expect(buttonCount).toBeGreaterThan(0);
});