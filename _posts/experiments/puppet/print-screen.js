const puppeteer = require('puppeteer');

var url = process.argv[2];

if (url.substring(0, 7) !== 'http://' && url.substring(0, 8) !== 'https://') {
    url = 'http://' + url;
}

const screenshot = async () => {
   const browser = await puppeteer.launch();
   const page    = await browser.newPage();
 
   await page.goto(url);
    
    if (url.substring(0, 7) === 'http://') {
        url = url.substring(7);
    } 
    
    else if (url.substring(0, 8) === 'https://') {
        url = url.substring(8);
    }

   await page.screenshot({
    path: `files/${url}.png`,
    fullPage: true
  });
 
  await page.close();
  await browser.close();
}

screenshot();