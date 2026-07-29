import { test, expect } from '@playwright/test';

const COMPONENTS = [
  { name: 'historical-evidence', label: 'HistoricalEvidencePanel' },
  { name: 'executive-evidence', label: 'ExecutiveEvidenceViewer' },
  { name: 'evidence-detail', label: 'EvidenceDetailPanel' },
  { name: 'evidence-correlation', label: 'EvidenceCorrelationPanel' },
  { name: 'evidence-coverage', label: 'HistoricalEvidenceCoverage' },
];

const VIEWPORTS = [
  { width: 1440, height: 900 },
  { width: 1024, height: 768 },
  { width: 390, height: 844 },
];

test.describe('EAC Technical Layer Wave 02A.1 - Visual QA (Technical Evidence)', () => {
  for (const comp of COMPONENTS) {
    for (const vp of VIEWPORTS) {
      test(`Component ${comp.label} renders properly at ${vp.width}px without regressions`, async ({ page, baseURL }) => {
        const targetUrl = `${baseURL}/?wave=02a1&target=${comp.name}`;

        if (!baseURL || !targetUrl.startsWith('http')) {
          throw new Error(`Invalid URL: ${targetUrl}`);
        }

        await page.setViewportSize(vp);
        await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
        await page.waitForTimeout(2000);

        // Check no horizontal overflow
        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
        const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
        expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2);

        // Take screenshot
        await page.screenshot({
          path: `tests/visual/screenshots/wave-02a1-${comp.name}-${vp.width}px.png`,
          fullPage: true,
        });
      });
    }
  }
});
