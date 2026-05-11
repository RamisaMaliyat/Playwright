
const { test, expect } = require('@playwright/test');

// Search functionality test 
test('Product search', async ({ page }) => {
  await page.goto('https://www.daraz.com.bd');

  const searchBox = page.locator('input[type="search"]');

  await searchBox.fill('shirt');
  await searchBox.press('Enter');

  // Better selector based on your DOM
  const products = page.locator('img[type="product"]');

  await expect(products.first()).toBeVisible();

  const count = await products.count();
  expect(count).toBeGreaterThan(0);
});

/*
test('Product search by category', async ({ page }) => {
  await page.goto('https://www.daraz.com.bd');

  // Search product
  await page.fill('input[type="search"]', 'shirt');
  await page.press('input[type="search"]', 'Enter');

  // 1. Hover over the root Categories menu
const categoryMenu = page.locator('.lzd-site-menu-nav-category-text').first(); 
await categoryMenu.hover(); 
// 2. Wait for the flyout to be visible and stable 
const categoryOption = page.getByText("Women's & Girls' Fashion").first(); 
// 3. Perform the actions 
await categoryOption.hover(); // Hover first to trigger sub-sub-menus like 'Bags' 
await categoryOption.click(); 



  await page.waitForTimeout(2000); // Wait for results to load

});
*/


test('Add and remove product from cart', async ({ page }) => {

  // Open Daraz
  await page.goto('https://www.daraz.com.bd/');

  // Search product
  await page.locator('input[type="search"]').fill('shirt');
  await page.keyboard.press('Enter');

  // Wait search results
  await page.waitForLoadState('networkidle');

  // Open first product
  const firstProduct = page.locator('[data-qa-locator="product-item"]').first();

  await expect(firstProduct).toBeVisible();

  await firstProduct.click();

  // Product opens in new tab sometimes
  const productPage = page;

  await productPage.waitForLoadState('networkidle');

  // Add to cart button
  const addToCart = productPage.locator('button:has-text("Add to Cart")');

  await expect(addToCart).toBeVisible();
  // After that need to login, so click it to trigger loginC
});


