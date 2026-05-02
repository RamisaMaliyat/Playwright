const { expect } = require('@playwright/test');
const { RunTest } = require('./Base.spec'); // import  extended test

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
  const fileName = 'test-upload.txt'; // file name
    // Click the file link
  await basePage.getByRole('link', { name: fileName }).click();
  
   const path = require('path'); //Imports Node.js path module.
   const fs = require('fs'); // Added to verify file existence

  // Path to your file inside 'resources' folder
   const filePath = path.resolve(__dirname, '../resources', fileName); 
   //Start listening for a download event.
  const downloadPromise = basePage.waitForEvent('download');
   const download = await downloadPromise; // This waits until: A file download starts and Playwright captures it
  await download.saveAs(filePath); // Saves the file to resources folder.
  expect(download.suggestedFilename()).toBe(fileName); // Check that the downloaded file’s name matches the name the server suggested.
  
   // Validation: Verify the file actually exists on your local system
  expect(fs.existsSync(filePath)).toBeTruthy();
});