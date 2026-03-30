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


test('Session Authentication', async ({ page }) => {
    //Setup Clock 
    await page.clock.install();
    
    const url = 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';

    await page.goto(url, { waitUntil: 'domcontentloaded' });

     await expect(page).toHaveTitle('OrangeHRM');
      const username = await page.getByRole('textbox', {name: 'username'});
    await  username.fill('Admin');
     const password = await page.getByRole('textbox', {name: 'password'});
    await password.fill('admin123');
     const login = await page.getByRole('button', {name: 'Login'});
    await login.click();
 
     // Refresh and verify persistence : Log in, refresh the page, and verify the "Dashboard" is still visible.
     await page.reload();
     await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

    
     
   

});
