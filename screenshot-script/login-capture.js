const { chromium } = require('playwright');
const fs = require('fs');

async function run() {
  const browser = await chromium.launch();
  
  const outDir = '/Users/kaeytee/Desktop/CODES/UG-SafeSpace/screenshots';
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // Login as Staff (Committee Dashboard)
  console.log('Logging in as Staff (Ama Mensah)...');
  const context1 = await browser.newContext();
  const page1 = await context1.newPage();
  await page1.goto('http://localhost:3104/login');
  
  await page1.fill('input#identifier', 'GS-2018-001');
  await page1.fill('input#pin', '29471');
  await page1.click('button[type="submit"]');
  
  // Wait for navigation to Committee Dashboard
  await page1.waitForURL('http://localhost:3102**', { timeout: 10000 }).catch(() => console.log('Did not redirect to 3102 immediately'));
  await page1.waitForTimeout(2000); // give it a moment to load
  await page1.screenshot({ path: `${outDir}/login_staff_dashboard.png`, fullPage: true });
  console.log('Saved staff dashboard screenshot.');
  await context1.close();

  // Login as Student (Participation Portal)
  console.log('Logging in as Student (Esi Quartey)...');
  const context2 = await browser.newContext();
  const page2 = await context2.newPage();
  await page2.goto('http://localhost:3104/login');
  
  await page2.fill('input#identifier', '10945023');
  await page2.fill('input#pin', '12345');
  await page2.click('button[type="submit"]');
  
  // Wait for navigation to Participation Portal
  await page2.waitForURL('http://localhost:3100**', { timeout: 10000 }).catch(() => console.log('Did not redirect to 3100 immediately'));
  await page2.waitForTimeout(2000); // give it a moment to load
  await page2.screenshot({ path: `${outDir}/login_student_dashboard.png`, fullPage: true });
  console.log('Saved student dashboard screenshot.');
  await context2.close();

  await browser.close();
  console.log('Done!');
}

run().catch(console.error);
