const { test, expect } = require('@playwright/test');
// Concurrent Login Tests for Admin and User

// Run tests in parallel
test.describe.configure({ mode: 'parallel' });

const url_unique = 'https://recruiter.bdjobs.com/';

test('Admin Login', async ({ page }) => {
    await page.goto(url_unique);

    await page.getByPlaceholder('Username').fill('ramisa_123');
    await page.getByPlaceholder('Password').fill('a');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page).toHaveURL("https://recruiter.bdjobs.com/dashboard");
});

test('User Login', async ({ page }) => {
    await page.goto(url_unique);

    await page.getByPlaceholder('Username').fill('Ramisa123');
    await page.getByPlaceholder('Password').fill('a');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page).toHaveURL("https://recruiter.bdjobs.com/dashboard");
});


// Unthorized Access Test

test('Unauthorized Access', async ({ page }) => {
    const Url = 'https://recruiter.bdjobs.com/';
    await page.goto(Url, { waitUntil: 'domcontentloaded' })
    await page.getByPlaceholder('Username').fill('sakib_test');
    await page.getByPlaceholder('Password').fill('963852');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL("https://recruiter.bdjobs.com/dashboard");
    const applicantsUrl = "https://recruiter.bdjobs.com/recruitment-center/applicants?jobno=1475788";
    const newJobId = '1234567';

    // Replace only jobno
    const updatedUrl = applicantsUrl.replace(/jobno=\d+/, `jobno=${newJobId}`);

    await page.goto(updatedUrl);  
    await expect(page.locator('img[src*="unauthorized.svg"]')).toBeVisible();

});
