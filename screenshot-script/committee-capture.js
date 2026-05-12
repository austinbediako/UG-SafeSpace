const { chromium } = require('playwright');
const fs = require('fs');

async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            var totalHeight = 0;
            var distance = 200;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight - window.innerHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 200);
        });
    });
    // Scroll back to top after reaching bottom
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1000);
}

async function run() {
  const browser = await chromium.launch();
  const outDir = '/Users/kaeytee/Desktop/CODES/UG-SafeSpace/screenshots';
  const validRoutes = [];

  console.log('Logging in as Staff (Ama Mensah)...');
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  
  await page.goto('http://localhost:3104/login');
  await page.fill('input#identifier', 'GS-2018-001');
  await page.fill('input#pin', '29471');
  await page.click('button[type="submit"]');
  
  await page.waitForURL('http://localhost:3102**', { timeout: 15000 }).catch(() => console.log('Did not redirect to 3102 immediately'));
  await page.waitForTimeout(4000); 
  
  const routes = [
    '/',
    '/analytics',
    '/cases',
    '/cases/closed',
    '/complaints',
    '/complaints/new',
    '/decisions',
    '/decisions/deliberate',
    '/hearings',
    '/hearings/schedule',
    '/members',
    '/members/add',
    '/reports',
    '/settings',
    '/tasks',
    '/tasks/new'
  ];

  for (const route of routes) {
    const url = `http://localhost:3102${route}`;
    console.log(`Navigating to ${url}`);
    await page.goto(url);
    await page.waitForTimeout(3000); 
    
    const title = await page.title();
    const bodyText = await page.innerText('body');
    
    if (title.includes('404') || bodyText.includes('404') || bodyText.toLowerCase().includes('page not found') || bodyText.toLowerCase().includes('could not find requested resource')) {
      console.log(`Skipping ${route} (404 Not Found)`);
      continue;
    }

    await autoScroll(page);

    const name = route === '/' ? 'home' : route.replace(/\//g, '_').replace(/^_/, '');
    await page.screenshot({ path: `${outDir}/committee_${name}.png`, fullPage: true });
    console.log(`Saved screenshot for ${route}`);
    validRoutes.push(route);
  }

  fs.writeFileSync(`${outDir}/valid_committee_routes.json`, JSON.stringify(validRoutes));

  await context.close();
  await browser.close();
  console.log('Done Committee!');
}

run().catch(console.error);
