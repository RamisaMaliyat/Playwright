const { test, expect } = require('@playwright/test');


test('Invaid Authentication', async ({ page }) => {
    const url1 = 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';

    // Increase timeout to 30s (default) or remove the timeout object entirely
    // Playwright will automatically wait for the URL to be reachable
    await page.goto(url1, { waitUntil: 'domcontentloaded' });

    // Verify the login page actually loaded

     await expect(page).toHaveTitle('OrangeHRM');

    // InValid Credential

    const username1 = await page.getByRole('textbox', {name: 'username'});
    await  username1.fill('Admin');
     const password1 = await page.getByRole('textbox', {name: 'password'});
    await password1.fill('123');
    const login1 = await page.getByRole('button', {name: 'Login'});
    await login1.click();

    // Locate the error message using the class provided in your snippet
    const errorAlert = page.locator('.oxd-alert-content-text');

    //Assert the specific error text is visible
    await expect(errorAlert).toBeVisible();
    await expect(errorAlert).toHaveText('Invalid credentials');

     
});



test('vaid Authentication', async ({ page }) => {
    const url = 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';

    // Increase timeout to 30s (default) or remove the timeout object entirely
    // Playwright will automatically wait for the URL to be reachable
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Verify the login page actually loaded

     await expect(page).toHaveTitle('OrangeHRM');

    // Valid Credential


    const username = await page.getByRole('textbox', {name: 'username'});
    await  username.fill('Admin');
     const password = await page.getByRole('textbox', {name: 'password'});
    await password.fill('admin123');
     const login = await page.getByRole('button', {name: 'Login'});
    await login.click();
    await expect(page).toHaveURL("https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index");

    // For Logout
     // Click the profile dropdown (the icon or the container)
     const dropdown = page.locator('.oxd-userdropdown-tab');
     await dropdown.click();
     //Click the Logout option (Wait for it to appear, then click)
     //Uses role="menuitem" for these links
     const logoutLink = page.getByRole('menuitem', { name: 'Logout' });
     await logoutLink.click();

    await expect(page).toHaveURL('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();


});

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
    await expect(page).toHaveURL("https://recruiter.bdjobs.com/dashboard");
    const newJobId = '1234567';
    await page.goto("https://recruiter.bdjobs.com/recruitment-center/applicants?jobno=1475788");




});





