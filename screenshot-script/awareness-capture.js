const { chromium } = require('playwright');

async function run() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  
  console.log('Navigating to Awareness Portal (port 3103)...');
  await page.goto('http://localhost:3103/');
  
  // Wait for initial load
  await page.waitForTimeout(2000);
  
  console.log('Scrolling and taking incremental screenshots...');
  let currentScroll = 0;
  let scrollStep = 800; // Viewport height
  let part = 1;
  let maxParts = 10;
  let reachedBottom = false;

  while (!reachedBottom && part <= maxParts) {
    // Wait for animations to settle
    await page.waitForTimeout(2000);
    
    // Take screenshot of current viewport
    const outPath = `/Users/kaeytee/Desktop/CODES/UG-SafeSpace/screenshots/awareness_home_part${part}.png`;
    await page.screenshot({ path: outPath });
    console.log(`Saved screenshot ${outPath}`);
    
    // Scroll down
    currentScroll += scrollStep;
    await page.evaluate((y) => window.scrollTo(0, y), currentScroll);
    
    // Check if we hit the bottom
    const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
    const windowHeight = await page.evaluate(() => window.innerHeight);
    const scrollY = await page.evaluate(() => window.scrollY);
    
    if (scrollY + windowHeight >= scrollHeight) {
      reachedBottom = true;
      // take final screenshot
      part++;
      await page.waitForTimeout(2000);
      const finalOutPath = `/Users/kaeytee/Desktop/CODES/UG-SafeSpace/screenshots/awareness_home_part${part}.png`;
      await page.screenshot({ path: finalOutPath });
      console.log(`Saved final screenshot ${finalOutPath}`);
    }
    part++;
  }

  await context.close();
  await browser.close();
  console.log('Done Awareness!');
}

run().catch(console.error);
