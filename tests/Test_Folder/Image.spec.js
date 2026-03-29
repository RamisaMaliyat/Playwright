const { test, expect } = require('@playwright/test');
require('express');

// Checking if images load
test('Loading Image',  async ({page, request}) =>
{
 const Url = 'https://accessibility.huit.harvard.edu/describe-content-images';
    await page.goto(Url,
        {
               waitUntil: 'load',
               timeout: 10000
        });

// If image is loaded        
// Wait for images to appear
const images = page.locator("//img[contains(@src, 'AdobeStock_Students_Walking.jpg')]");

// Evaluate all images at once
 // Check if all images are loaded in the browser
const allLoaded = await images.evaluateAll(nodes =>
    nodes.every(node => node.complete && node.naturalWidth > 0)
);

// Assert that all images are loaded
expect(allLoaded).toBeTruthy();

// via API request

    // Check images via API request
    const srcList = await images.evaluateAll(nodes =>
        nodes.map(node => node.getAttribute('src'))
    );
    //Loop through each image URL
    for (let src of srcList) 
        {   
            // Prevents errors when making API requests.
            if (!src) //If src is null, undefined, or empty → skip it.
                continue;  //continue moves to the next loop iteration.

            // Convert relative URLs to absolute
            if (src.startsWith('/'))   // Checks if the image URL starts with /.
                {
                    const base = new URL(page.url());// Gets the current page URL.
                    src = base.origin + src; // Adds the relative path to create a full URL:
                }
        //Sends an HTTP GET request to the image URL. request is Playwright’s API request context.

        //This checks if the image exists on the server.
        const response = await request.get(src);  // request is now defined
        expect(response.status()).toBeLessThan(400);
        console.log(`Image OK: ${src} - Status: ${response.status()}`); // ${src} allow to insert variables inside text
    }


    // Validate Alt Text
     const allValid = await page.locator('img').evaluateAll(nodes =>
        nodes.every(node =>
            node.hasAttribute('alt') &&
            node.getAttribute('alt')?.trim().length > 0
        )
    );

    expect(allValid).toBeTruthy();


// Validate Alt Text

 const genericWords = ['image', 'photo', 'picture', 'img']; // We define a list of generic words that are not meaningful as alt text. If an image’s alt text is exactly one of these words, it will be considered invalid.
    const invalidImages = await images.evaluateAll((nodes, genericWords) => {
        return nodes
            .map(node => {
                const alt = node.getAttribute('alt'); //alt: reads the image’s alt attribute.

                const src = node.getAttribute('src'); // src: reads the image’s src attribute (so we know which image fails, for logging).

                // Missing alt attribute
                if (alt === null)
                    return `Missing alt attribute: ${src}`;

                const trimmedAlt = alt.trim().toLowerCase(); // Remove extra spaces and normalize to lowercase for comparison.

                // Allow decorative images (empty alt)
                if (trimmedAlt === '') 
                    return null;

                // Generic words
                if (genericWords.includes(trimmedAlt)) // Alt text should not be a generic word like "image", "photo", etc.
                    return `Generic alt text: ${src}`;

                // Should not start with "image of", "photo of", "picture of"
                if (
                    trimmedAlt.startsWith('image of') ||
                    trimmedAlt.startsWith('photo of') ||
                    trimmedAlt.startsWith('picture of')
                )
                {
                    return `Alt starts with invalid phrase: ${src}`;
                }

                // Too short alt text
                if (trimmedAlt.length <= 2) 
                    return `Alt too short: ${src}`; // If alt text is too short, it may not describe the image properly.

                return null; // valid alt: no issue detected for this image.
            })
            .filter(Boolean); // only invalid entries: The resulting array invalidImages contains only images that failed the alt-text checks.
    }, genericWords);

    expect(invalidImages, `Alt text issues found:\n${invalidImages.join('\n')}`).toEqual([]);


     await page.waitForTimeout(5000);
});