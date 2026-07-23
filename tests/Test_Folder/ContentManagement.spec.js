const { test, expect } = require('@playwright/test');

test('CURD Operations', async ({ page }) => {

     const Url = 'https://recruiter.bdjobs.com/';
    await page.goto(Url, { waitUntil: 'domcontentloaded' })
    await page.getByPlaceholder('Username').fill('sakib_test');
    await page.getByPlaceholder('Password').fill('963852');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL("https://recruiter.bdjobs.com/dashboard");
    
    const loadMoreButton = page.getByRole('button', { name: 'Load More' });
     await loadMoreButton.click();
     await page.waitForTimeout(3000);
      await page.mouse.wheel(0,500)
     await page.waitForTimeout(2000)
     await page.locator('span[role="button"]').filter({
    hasText: 'Junior iOS developer'
    }).click();
    await page.waitForTimeout(9000)
    await expect(page).toHaveURL( /jobno=1475788&enc=.*/); //Use regex to match the URL pattern with dynamic 'enc' parameter
    await page.locator("//span[text()=' Video Interview ']").click();
     await page.mouse.wheel(0,500)
     await page.waitForTimeout(2000)
    // Create: Add a comment to an applicant.
    const commentButton = page.getByRole('button', { name: 'Comment' }).first();
    await commentButton.waitFor({ state: 'visible', timeout: 10000 });
    await commentButton.click();
    const commentInput = page.getByPlaceholder('Write comment...');
    await commentInput.fill('This is a test comment');
    const saveButton = page.getByRole('button', { name: 'Save' });
    await saveButton.click();
    await page.waitForTimeout(3000)
    //Read: Verify the comment is displayed and confirm the comment count increases.
    const applied = await page.locator('//*[@id="394100182"]/div[1]/div[1]/div[2]/div/div[1]/h2[3]/app-applied-history-new/button');
    await applied.waitFor({ state: 'visible', timeout: 10000 });
    await applied.click();
    const commentCountSpan = page.locator('span.cursor-pointer', { hasText: 'Commented (1)' }).first();
    await expect(commentCountSpan).toBeVisible();
    await page.waitForTimeout(1000)
    const cross = await page.locator("//button[contains(@class, 'text-[#475467]')]");
    await cross.waitFor({ state: 'visible', timeout: 10000 });
    await cross.click();
    //Update: Edit the comment and verify the updated comment is displayed.
    const editButton = await page.locator("//button[i[contains(@class, 'commentEdit')]]");
    expect(editButton).toBeVisible();
    await editButton.click();
    await page.waitForTimeout(1000);
    //Delete: Delete the added comment.


    

});