
const { expect } = require('@playwright/test');
const { RunTest } = require('./Base.spec'); // import  extended test

RunTest('First PAge', async ({ basePage }) => {
  await expect(basePage).toHaveURL('https://the-internet.herokuapp.com/');
  await expect(basePage).toHaveTitle('The Internet');
 // await basePage.waitForTimeout(5000);  // Wait to see if everything works.
});

RunTest('Page Navigation and Click By Link',async ({basePage}) => {
    //CLICK ON  LINK
  const ClickByLink_ABTesting = await basePage.getByRole('link', { name: 'A/B Testing' });
  await ClickByLink_ABTesting.click();
    // Verify URL after redirect
  await expect(basePage).toHaveURL('https://the-internet.herokuapp.com/abtest'); // by url

  // Use Title
  const heading = basePage.locator('h3');
    // Wait for it to be visible
  await expect(heading).toBeVisible();
  // Verify heading contains the text
  // await expect(heading).toHaveText("A/B Test(Variation \d|Control)"); //Maybe dynamicly change title
 
  // Go back to the next page
  await basePage.goForward();
  //Reload page
  // Reload the current page
  await basePage.reload();

  // Go back to the previous page
  await basePage.goBack();

  //await basePage.waitForTimeout(5000); 

});


RunTest('Click By Button',async ({basePage}) => {
 const ClickByLink_AddRemove = await basePage.getByRole ('link', {name: 'Add/Remove Elements'});
 await ClickByLink_AddRemove.click();
 await expect(basePage).toHaveURL('https://the-internet.herokuapp.com/add_remove_elements/'); 

 const addElementBtn = basePage.getByRole('button', { name: 'Add Element' });
 //await addElementBtn.click();
 // Click 3 times
  for (let i = 0; i < 3; i++) {
    await addElementBtn.click();
  }
   // Verify 3 Delete buttons are added
  const deleteButtons = basePage.getByRole('button', { name: 'Delete' });
  await expect(deleteButtons).toHaveCount(3);

// Click and remove all Delete buttons
while (await deleteButtons.count() > 0) {
  await deleteButtons.first().click();
}

// Verify all removed
await expect(deleteButtons).toHaveCount(0);


  // Right Click
  const RightClickaddElement = basePage.getByRole('button', { name: 'Add Element' });
  await RightClickaddElement.click({ button: 'right' });

  await basePage.goBack();

//  await basePage.waitForTimeout(5000); 

});

RunTest('Hover',async ({basePage}) => {
 const ClickHover = await basePage.getByRole ('link', {name: 'Hovers'});
 await ClickHover.scrollIntoViewIfNeeded();
 await ClickHover.click();
 await expect.toHaveURL(' https://the-internet.herokuapp.com/hovers');
 const HoverImg1 = await basePage.getByRole('img', {name: 'User Avatar' }).nth(1); // 0 = first, 1 = second becuase the name is same for all.
 await HoverImg1.hover();
 await basePage.mouse.wheel(0, 10); //Position the mouse and scroll with the mouse wheel
 //Verfify If After Hover Text is visiable
 const Hovertext = basePage.locator('h5').nth(1); // Because all text are h5
 await expect(Hovertext).toBeVisible(); //Wait for it to be visible
const Visiable_Text = 'name: user2';
await expect(Hovertext).toHaveText(Visiable_Text);
await basePage.goBack();
});

RunTest('drag_and_drop',async ({basePage}) => {
  const Clickdrag_and_drop = await basePage.getByRole('link', {name:'Drag and Drop'});
  Clickdrag_and_drop.click();
  await expect.toHaveURL(' https://the-internet.herokuapp.com/drag_and_drop');
  const Source = await basePage.locator('#column-a'); // For Id 
  const Destination = await basePage.locator('#column-b')
  await Source.dragTo(Destination);
  //Verify 
   const sourceHeader = Source.locator('header'); // header tag
   await expect(sourceHeader).toBeVisible();
   await expect(sourceHeader).toHaveText('B');
   const DestinationHeder = Destination.locator('header');
   await expect(DestinationHeder).toBeVisible();
   await expect(DestinationHeder).toHaveText('A');
});


RunTest('Press key',async ({basePage}) => {
   const ClickKey_Presses = await basePage.getByRole('link', {name:'Key Presses'});
  ClickKey_Presses.click();
  await expect.toHaveURL('https://the-internet.herokuapp.com/key_presses');

// Press Tab on keyboard
const keyTextBox = await basePage.locator('#target');
await keyTextBox.press("Tab");

const expectedText1 = "You entered: TAB";
const result = basePage.locator('#result');
await expect(result).toHaveText(expectedText1);

// Press $ on keyboard
await keyTextBox.press("$");
const expectedText2 = "You entered: 4";
await expect(result).toHaveText(expectedText2);

});

RunTest('Text Field Input',async ({basePage}) => {
  const ClickInputs =  await basePage.getByRole('link', {name:'Inputs'});
  ClickInputs.click();
  const numberInput = await basePage.locator('input[type="number"]');
  await numberInput.fill('1');
  await numberInput.press('ArrowUp');
  await numberInput.press('ArrowDown');
});

RunTest('DropDown',async ({basePage}) => {
  const ClickDropDown =  await basePage.getByRole('link', {name:'Dropdown'});
  ClickDropDown.click();

  const dropdown = await basePage.locator('#dropdown');
  // Check if dropdown list is visiable
  await expect(dropdown).toBeVisible();
  // Click on the Option 1
  await dropdown.selectOption({ label: 'Option 1' });
});

RunTest('Checkboxes',async ({basePage}) => {
  const ClickCheckboxes =  await basePage.getByRole('link', {name:'Checkboxes'});
  ClickCheckboxes.click();
  const checkboxes = basePage.locator('input[type="checkbox"]');
  
  const checkbox2 = checkboxes.nth(1);  // Checkbox 2
  await checkbox2.uncheck();  // Uncheck Checkbox 2

  const checkbox1 = checkboxes.nth(0); // Checkbox 1
  await checkbox1.check(); // Uncheck Checkbox 1
  // Assert the checked state 
  await expect(checkbox1).toBeChecked();

});



RunTest('File Upload',async ({basePage}) => {
  const ClickFileUpload =  await basePage.getByRole('link', {name:'File Upload'});
  ClickFileUpload.click();

   const path = require('path');
  // Path to your file inside 'resources' folder

  const filePath = path.join(__dirname, '../resources/File.txt');
  // Upload the file
  await basePage.locator('#file-upload').setInputFiles(filePath);

 // click on the submit button
 const submit = basePage.locator('#file-submit')
 await submit.click();

 await expect(basePage).toHaveURL(' https://the-internet.herokuapp.com/upload');
  const filename = basePage.locator('#uploaded-files');
  await expect(filename).toHaveText('File.txt')
});



RunTest('File Download',async ({basePage}) => {
  const ClickFileDownload=  await basePage.getByRole('link', {name: 'File Download', exact: true});
  ClickFileDownload.click();
  const fileName = 'image2.jpeg'; // file name
    // Click the file link
  await basePage.getByRole('link', { name: fileName }).click();
  
   const path = require('path'); //Imports Node.js path module.

  // Path to your file inside 'resources' folder
   const filePath = path.resolve(__dirname, '../resources', fileName); 
   //Start listening for a download event.
  const downloadPromise = basePage.waitForEvent('download');
   const download = await downloadPromise; // This waits until: A file download starts and Playwright captures it
  await download.saveAs(filePath); // Saves the file to resources folder.
  expect(download.suggestedFilename()).toBe(fileName); // Check that the downloaded file’s name matches the name the server suggested.

});



RunTest('Enable Disable',async ({basePage}) => {
  const ClickJQuery=  await basePage.getByRole('link', {name: 'JQuery UI Menus', exact: true});
  ClickJQuery.click();
  // Click on disable link
  const disable = await basePage.getByRole('link', { name: 'Disabled' });
  await expect(disable).toBeDisabled(); // Check if is disabled 
  // Click on enable link
  const enable = await basePage.getByRole('link', { name: 'Enabled' });
  enable.click();
  

  await basePage.waitForTimeout(5000); 

});