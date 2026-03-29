
const { test, expect } = require('@playwright/test');
const { it } = require('node:test');

test('Data Table Test',  async ({page}) =>
{

    const url= 'https://www.saucedemo.com';
    await page.goto(url, { waitUntil: 'load', timeout: 10000 });

    await expect(page).toHaveURL(url);
    await expect(page).toHaveTitle('Swag Labs');

    // Login
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    // Verify successful login
    await expect(page).toHaveURL(/inventory\.html/);


    // Select option 
   const option = await page.locator(" //select[@class='product_sort_container']");
   option.click();

    //Get initial product names (default A-Z)
    const items = page.locator('.inventory_item_name');
    const initialNames = await items.allTextContents();
    const initialCount = initialNames.length;
   
   // Sort by alphabet decending order

   // Change sorting to Z-A
    await option.selectOption({ label: 'Name (Z to A)' });

    // Get names after sorting
    const sortedNamesUI = await items.allTextContents();

    //Create expected sorted array (Z-A)
    const expectedSorted = [...initialNames].sort((a, b) =>
        b.localeCompare(a)
    );
    //Validate sorting logic
    expect(sortedNamesUI).toEqual(expectedSorted);

    //Validate item count didn't change
    expect(sortedNamesUI.length).toBe(initialCount);



 // Sort by number 
    // Get all the price texts from the page
    const prices = page.locator('.inventory_item_price');
    const initialPricesText = await prices.allTextContents();
    const initialPrices = initialPricesText.map(p => parseFloat(p.replace('$',''))); // Convert the text to numbers
    const initialPriceCount = initialPrices.length; // Count the number of price items


     option.click();  // Click the option again
   // Change sorting to high to low
    await option.selectOption({ label: 'Price (high to low)' });

    const sortedPricesText = await prices.allTextContents();
    const sortedPricesUI = sortedPricesText.map(p => parseFloat(p.replace('$','')));
    const expectedSortedPrices = [...initialPrices].sort((a, b) => b - a);

    expect(sortedPricesUI).toEqual(expectedSortedPrices);
    expect(sortedPricesUI.length).toBe(initialPriceCount);

    await page.waitForTimeout(5000); 

})


test('Filtering and Sorting', async ({ page }) => 
    {    
    // Go to site
    await page.goto('https://automationbookstore.dev/');
    // by keyword

    // Locate the search/filter input
    const searchBox = page.locator("//input[@id='searchBar']");
    //Locate all book items
    const bookItems = page.locator("//ul[@id='productList']/li");
    //Type a keyword to filter books
    const filterKeyword = 'Agile';
    await searchBox.fill(filterKeyword);
    //Get filtered book titles
    const filteredTitles = await page.locator("//ul[@id='productList']/li//h2").allTextContents();

    console.log('Filtered book titles:', filteredTitles);

    await expect(page.locator('#productList li:visible')).toHaveCount(1);

    await expect(page.locator('#productList li:visible h2')).toHaveText(/Agile/i);

    //by price

    // Get all visible books
    const visibleBooks = page.locator('#productList li:visible');
    // Validate only 1 book is visible
    await expect(visibleBooks).toHaveCount(1);
    //Check the title of the visible book contains the keyword
    await expect(visibleBooks.locator('h2')).toHaveText(/Agile/i);
    // Get the price of the visible book
    const priceText = await visibleBooks.locator('.ui-li-aside').textContent();
    const price = parseFloat(priceText.replace('$', ''));
    console.log('Visible book price:', price);
    //Validate the price is below a certain threshold
    expect(price).toBeLessThanOrEqual(50);
        
    await page.waitForTimeout(5000); 
});


test('Filter by date range', async ({ page }) => {
  await page.goto('https://demo.mobiscroll.com/range/date-filtering-with-predefined-ranges');

  // Wait for date picker
  const demoFrame = page.locator('#date-filtering');
  await demoFrame.scrollIntoViewIfNeeded();

  // Click the input inside the iframe to open the date picker
  await demoFrame.click();

    // Validate calendar is visible
  const calendar = page.locator('#date-filtering-calendar');
  await expect(calendar).toBeVisible();
  

  // Select start date
  await page.locator('#date-filtering-calendar')
          .getByRole('button', { name: 'Wednesday, March 18, 2026' })
          .click();

  // Select end date
  await page.locator('#date-filtering-calendar')
          .getByRole('button', { name: 'Wednesday, March 25, 2026' })
          .click();

 // Click Apply
 await page.getByRole('button', { name: 'Apply' }).last().click({ force: true });



  await page.waitForTimeout(5000); 





});


test('Row Selection and Sorting', async ({ page }) => 
{
    await page.goto("https://the-internet.herokuapp.com/tables");
    const table = page.locator('#table1');
    const rows = table.locator('tbody tr');
    // row selection

    //Validate row count
    await expect(rows).toHaveCount(4);
    // Validate specific cell data 
    await expect(rows.nth(0).locator('td').nth(0)).toHaveText('Smith');
    await expect(rows.nth(0).locator('td').nth(1)).toHaveText('John');
    await expect(rows.nth(0).locator('td').nth(2)).toHaveText('jsmith@gmail.com');
    await expect(rows.nth(0).locator('td').nth(3)).toHaveText('$50.00');
    // Select row by index 
    const selectedRow = rows.nth(1);  // 2nd row
    await selectedRow.click();
    //Validate selected row data
    const lastName = await selectedRow.locator('td').nth(0).textContent();
    const firstName = await selectedRow.locator('td').nth(1).textContent();
    const email = await selectedRow.locator('td').nth(2).textContent();

    expect(lastName).toBe('Bach');
    expect(firstName).toBe('Frank');
    expect(email).toContain('@');
    console.log('Selected Row Data:', lastName, firstName, email);
    // Filter Rows using a column
      const filtered_rows = page.locator('#table1 tbody tr');
      const count = await filtered_rows.count();
      let matchingRows = 0;
      for (let i = 0; i < count; i++) {
        const due = await filtered_rows.nth(i).locator('td').nth(3).textContent();
        if (due === '$50.00') {
            matchingRows++;
    }
  }

  expect(matchingRows).toBe(2); // Smith and Conway

  // Link/Button Inside Row Validation --> Click Edit for a row
   const doeRow = page.locator('#table1 tbody tr', 
    {
        has: page.locator('text=Doe')
    });

  await doeRow.locator('a:has-text("edit")').click();
  //Verify if the links are exists
   const editLinks = page.locator('#table1 tbody tr a:has-text("edit")');
   await expect(editLinks).toHaveCount(4);

   const deleteLinks = page.locator('#table1 tbody tr a:has-text("delete")');
   await expect(deleteLinks).toHaveCount(4);

  // Cloumn data

  // Table existence
  await expect(table).toBeVisible();

  // Column count validation
  const columns = table.locator('thead th');
  await expect(columns).toHaveCount(6);

  // Column header validation
  await expect(columns.nth(0)).toHaveText('Last Name');
  await expect(columns.nth(1)).toHaveText('First Name');
  await expect(columns.nth(2)).toHaveText('Email');
  await expect(columns.nth(3)).toHaveText('Due');
  await expect(columns.nth(4)).toHaveText('Web Site');
  await expect(columns.nth(5)).toHaveText('Action');

  // Cell value validation (Specific cell)
  await expect(rows.nth(0).locator('td').nth(0)).toHaveText('Smith');   // Row 1, Column 1 should be Smith

  // Validate Email format contains "@"
  await expect(rows.nth(0).locator('td').nth(2)).toContainText('@');

  // Numeric column validation (Due column)
  const dueColumn = table.locator('tbody tr td:nth-child(4)');
  const ccount = await dueColumn.count();

  for (let i = 0; i < ccount; i++) {

    const text = await dueColumn.nth(i).textContent();
    const value = parseFloat(text.replace('$', ''));

    expect(value).toBeGreaterThan(0);
  }



    await page.waitForTimeout(5000); 
});






