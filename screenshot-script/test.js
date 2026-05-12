const { chromium } = require('playwright');
async function run() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('http://localhost:3104/login');
  await page.fill('input#identifier', 'GS-2018-001');
  await page.fill('input#pin', '29471');
  await page.click('button[type="submit"]');
  
  await page.waitForTimeout(5000); 
  console.log("Current URL after login:", page.url());
  const title = await page.title();
  console.log("Page title:", title);
  
  await browser.close();
}
run();
