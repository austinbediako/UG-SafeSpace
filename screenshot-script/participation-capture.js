const { chromium } = require('playwright');
const fs = require('fs');

async function run() {
  const browser = await chromium.launch();
  const outDir = '/Users/kaeytee/Desktop/CODES/UG-SafeSpace/screenshots';
  const validRoutes = [];

  console.log('Logging in as Student (Esi Quartey)...');
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  
  await page.goto('http://localhost:3104/login');
  
  // Choose "Student" visual tab
  await page.click('text=Student');

  await page.fill('input#identifier', '10945023');
  await page.fill('input#pin', '12345');
  await page.click('button[type="submit"]');
  
  await page.waitForURL('http://localhost:3100**', { timeout: 10000 }).catch(() => console.log('Did not redirect immediately'));
  await page.waitForTimeout(2000);
  
  const routes = [
    '/',
    '/resources',
    '/resources/faq',
    '/resources/support',
    '/resources/policy',
    '/cases',
    '/cases/archived',
    '/hearings',
    '/outcomes',
    '/rights',
    '/appeals',
    '/deadlines',
    '/account',
    '/account/privacy',
    '/account/security',
    '/account/profile',
    '/timeline',
    '/participation',
    '/participation/response',
    '/participation/evidence',
    '/participation/witnesses',
    '/participation/requests',
    '/participation/representation',
    '/notifications',
    '/communications',
    '/communications/messages',
    '/communications/notices',
    '/communications/documents'
  ];

  for (const route of routes) {
    const url = `http://localhost:3100${route}`;
    console.log(`Navigating to ${url}`);
    await page.goto(url);
    await page.waitForTimeout(2000);
    
    const title = await page.title();
    if (title.includes('404')) {
      console.log(`Skipping ${route} (404 Not Found)`);
      continue;
    }

    const name = route === '/' ? 'home' : route.replace(/\//g, '_').replace(/^_/, '');
    await page.screenshot({ path: `${outDir}/participation_${name}.png`, fullPage: true });
    console.log(`Saved screenshot for ${route}`);
    validRoutes.push(route);
  }

  fs.writeFileSync(`${outDir}/valid_participation_routes.json`, JSON.stringify(validRoutes));

  await context.close();
  await browser.close();
  console.log('Done Participation!');
}

run().catch(console.error);
