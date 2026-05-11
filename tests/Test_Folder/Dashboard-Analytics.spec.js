const { test, expect } = require('@playwright/test');
// Dashboard test
test('Unauthorized Access', async ({ page }) => {
    const Url = 'https://recruiter.bdjobs.com/';
    await page.goto(Url, { waitUntil: 'domcontentloaded' })
    await page.getByPlaceholder('Username').fill('sakib_test');
    await page.getByPlaceholder('Password').fill('963852');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL("https://recruiter.bdjobs.com/dashboard");
    const applicantsUrl = page.getByRole('link', { name: 'Junior iOS developer'});
    await applicantsUrl.click();
    await expect(page).toHaveURL("https://recruiter.bdjobs.com/recruitment-center/applicants?jobno=1475788");
    page.locator("//a//span[text()='Analytics']").click();
   // await expect(page).toHaveURL("https://recruiter.bdjobs.com/recruitment-center/analytics?jobno=1475788");
    /*const details = page.locator("//button[contains(., 'Detail Analytics')]");
    await expect(details).toHaveURL("https://corporate3.bdjobs.com/Analytics/Details.asp?rptType=TU&jp_id=1475788");*/
    await page.waitForTimeout(5000);

});