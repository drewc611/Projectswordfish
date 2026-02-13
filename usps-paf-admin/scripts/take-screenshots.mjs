import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const screenshotDir = path.resolve(__dirname, '../docs/screenshots');

const BASE_URL = 'http://localhost:5173';

const pages = [
  { name: '01-dashboard', path: '/', title: 'Dashboard Overview' },
  { name: '02-paf-management', path: '/paf', title: 'PAF Management' },
  { name: '03-crid-management', path: '/crid', title: 'CRID Management' },
  { name: '04-mailer-id-management', path: '/mid', title: 'Mailer ID Management' },
  { name: '05-ai-insights-anomaly', path: '/ai-insights', title: 'AI Insights - Anomaly Detection' },
  { name: '06-address-validation', path: '/address', title: 'Address Validation' },
  { name: '07-reports', path: '/reports', title: 'Reports & Analytics' },
  { name: '08-settings', path: '/settings', title: 'Settings' },
  { name: '09-help', path: '/help', title: 'Help & Documentation' },
];

async function takeScreenshots() {
  process.env.TMPDIR = '/home/user/Projectswordfish/tmp-chrome';

  const userDataDir = '/home/user/Projectswordfish/tmp-chrome/user-data';

  const context = await chromium.launchPersistentContext(userDataDir, {
    headless: true,
    executablePath: '/root/.cache/ms-playwright/chromium-1194/chrome-linux/chrome',
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--disable-software-rasterizer',
      '--single-process',
    ],
  });

  const page = await context.newPage();

  for (const pg of pages) {
    console.log(`Capturing: ${pg.title} (${pg.path})`);
    await page.goto(`${BASE_URL}${pg.path}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);

    await page.screenshot({
      path: path.join(screenshotDir, `${pg.name}.png`),
      fullPage: false,
    });
    console.log(`  ✓ Saved ${pg.name}.png`);
  }

  // --- Special screenshots ---

  // AI Insights - Risk Scoring tab
  console.log('Capturing: AI Insights - Risk Scoring tab');
  await page.goto(`${BASE_URL}/ai-insights`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  const riskTab = page.locator('button:has-text("Risk Scoring")');
  if (await riskTab.count() > 0) {
    await riskTab.click();
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: path.join(screenshotDir, '10-ai-risk-scoring.png'),
      fullPage: false,
    });
    console.log('  ✓ Saved 10-ai-risk-scoring.png');
  }

  // AI Insights - Predictive Analytics tab
  console.log('Capturing: AI Insights - Predictive Analytics tab');
  const predTab = page.locator('button:has-text("Predictive Analytics")');
  if (await predTab.count() > 0) {
    await predTab.click();
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: path.join(screenshotDir, '11-ai-predictive-analytics.png'),
      fullPage: false,
    });
    console.log('  ✓ Saved 11-ai-predictive-analytics.png');
  }

  // AI Insights - Fraud Detection tab
  console.log('Capturing: AI Insights - Fraud Detection tab');
  const fraudTab = page.locator('button:has-text("Fraud Detection")');
  if (await fraudTab.count() > 0) {
    await fraudTab.click();
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: path.join(screenshotDir, '12-ai-fraud-detection.png'),
      fullPage: false,
    });
    console.log('  ✓ Saved 12-ai-fraud-detection.png');
  }

  // PAF Management - open a detail modal
  console.log('Capturing: PAF Detail Modal');
  await page.goto(`${BASE_URL}/paf`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const firstRow = page.locator('table tbody tr').first();
  if (await firstRow.count() > 0) {
    await firstRow.click();
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(screenshotDir, '13-paf-detail-modal.png'),
      fullPage: false,
    });
    console.log('  ✓ Saved 13-paf-detail-modal.png');
  }

  // Dashboard - full page scroll capture
  console.log('Capturing: Dashboard (full page)');
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({
    path: path.join(screenshotDir, '14-dashboard-full.png'),
    fullPage: true,
  });
  console.log('  ✓ Saved 14-dashboard-full.png');

  await context.close();
  console.log('\nAll screenshots captured successfully!');
}

takeScreenshots().catch(console.error);
