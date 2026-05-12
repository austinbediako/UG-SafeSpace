const { chromium } = require('playwright');
const fs = require('fs');

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const outDir = '/Users/kaeytee/Desktop/CODES/UG-SafeSpace/screenshots';
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // Phase 1: Public Awareness (3103)
  console.log('Testing Phase 1...');
  await page.goto('http://localhost:3103');
  await page.screenshot({ path: `${outDir}/phase1_home.png`, fullPage: true });

  const awarenessPaths = ['/about-policy', '/definitions', '/reporting-guide', '/your-rights', '/faq', '/support-resources', '/contact'];
  for (const p of awarenessPaths) {
    await page.goto(`http://localhost:3103${p}`);
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${outDir}/phase1_${p.replace(/\//g, '')}.png`, fullPage: true });
  }

  // Phase 2: Reporting Portal (3101)
  console.log('Testing Phase 2...');
  await page.goto('http://localhost:3101');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${outDir}/phase2_home.png`, fullPage: true });
  await page.goto('http://localhost:3101/report');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${outDir}/phase2_report_form.png`, fullPage: true });
  
  // Phase 3: Auth App (3104)
  console.log('Testing Phase 3...');
  await page.goto('http://localhost:3104/login');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${outDir}/phase3_login.png`, fullPage: true });
  await page.goto('http://localhost:3104/register');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${outDir}/phase3_register.png`, fullPage: true });
  await page.goto('http://localhost:3104/forgot-password');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${outDir}/phase3_forgot_password.png`, fullPage: true });

  // Phase 4: Participation Portal (3100)
  console.log('Testing Phase 4...');
  await page.goto('http://localhost:3100');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${outDir}/phase4_home.png`, fullPage: true });
  
  // Phase 5: Committee Dashboard (3102)
  console.log('Testing Phase 5...');
  await page.goto('http://localhost:3102');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${outDir}/phase5_home.png`, fullPage: true });

  console.log('Done screenshots.');
  await browser.close();
}

run().catch(console.error);
