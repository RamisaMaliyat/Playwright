const { test, expect } = require('@playwright/test');
// Dashboard test
test('Chart', async ({ page }) => {
    const Url = 'https://recruiter.bdjobs.com/';
    await page.goto(Url, { waitUntil: 'domcontentloaded' })
    await page.getByPlaceholder('Username').fill('sakib_test');
    await page.getByPlaceholder('Password').fill('963852');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL("https://recruiter.bdjobs.com/dashboard");
    
    const loadMoreButton = page.getByRole('button', { name: 'Load More' });
     await loadMoreButton.click();
     await page.waitForTimeout(3000)

     await page.mouse.wheel(0,500)
     await page.waitForTimeout(2000)
     await page.locator('span[role="button"]').filter({
    hasText: 'Junior iOS developer'
    }).click();
    await page.waitForTimeout(9000)
    await expect(page).toHaveURL( /jobno=1475788&enc=.*/); //Use regex to match the URL pattern with dynamic 'enc' parameter
  
  page.locator("//a//span[text()='Analytics']").click();
  //await expect(page).toHaveURL("https://recruiter.bdjobs.com/recruitment-center/analytics?jobno=1475788");
    const details = page.locator("//button[contains(., 'Detail Analytics')]");
    const [newPage] = await Promise.all([
        page.context().waitForEvent('page'),
        details.click()
    ]);
    await newPage.waitForLoadState();
    await expect(newPage).toHaveURL(
        'https://corporate3.bdjobs.com/Analytics/Details.asp?rptType=TU&jp_id=1475788'
    );
    
    // FIX: Change 'page' to 'newPage' to target the active tab
    const Nature = await newPage.locator('#cboNature');
    await expect(Nature).toBeVisible();
    await Nature.selectOption('PartTime');


    // 1. Ensure you are using 'newPage' (the popup tab)
// 2. Wait for at least one data rectangle to be visible
const barSelector = 'svg g rect[box-text]';
await newPage.locator(barSelector).first().waitFor({ state: 'visible', timeout: 10000 });

// 3. Now collect all matching elements
const bars = await newPage.locator(barSelector).all();
const chartData = [];

for (const bar of bars) {
  const value = await bar.getAttribute('box-text');
  const x = await bar.getAttribute('x');
  const fill = await bar.getAttribute('fill');
  
  if (value) {
    chartData.push({ x, value, fill });
  }
}

console.log(`Successfully extracted ${chartData.length} data points:`, chartData);

await newPage.waitForTimeout(5000);

});



test('Data  Export', async ({ page }) => 
  {

    // CSV Export Test

  await page.goto(
    'https://datatables.net/extensions/buttons/examples/initialisation/export.html'
  );

  const exportButton = page.locator('button:has-text("CSV")');
  await expect(exportButton).toBeVisible();
  await exportButton.click();

  await page.waitForTimeout(5000);
  const path = require('path'); //Imports Node.js path module.
   const fs = require('fs'); // Added to verify file existence


     // 1. Start listening for the download event FIRST
  const downloadPromise = page.waitForEvent('download');

  // 2. Trigger the download SECOND
  await exportButton.click();

  // 3. Wait for Playwright to capture the completed download
  const download = await downloadPromise; 

  // 4. Get the real filename string from the download object
  const fileName = download.suggestedFilename();

  // 5. Construct your file path safely using the string variable
  const filePath = path.resolve(__dirname, '../resources', fileName); 

  // 6. Save the file to your resources folder
  await download.saveAs(filePath); 
  
  // 7. Verify the file exists on your machine
  expect(fs.existsSync(filePath)).toBeTruthy();


});

