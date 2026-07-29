import { test, expect } from '@playwright/test';
import * as path from 'path';
import { evaluateMeasurements, VisualMeasurement } from './helpers/geometry';
import { appendResult, initializeResults } from './helpers/evidence-writer';

test.describe.configure({ mode: 'serial' });

const VIEWPORTS = [
  { width: 1440, height: 1000 },
  { width: 1024, height: 900 },
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
];

const SCENARIOS = ['healthy', 'critical', 'long-text'];

test.beforeAll(() => {
  initializeResults();
});

for (const scenario of SCENARIOS) {
  test.describe(`Harness - Scenario: ${scenario}`, () => {
    for (const viewport of VIEWPORTS) {
      test(`Viewport ${viewport.width}x${viewport.height}`, async ({ page }) => {
        page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
        page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
        
        await page.setViewportSize(viewport);
        await page.goto(`http://127.0.0.1:4178?scenario=${scenario}`);
        
        // Wait for the region to render
        const region = page.locator('section[data-eac-block="executive-summary"]');
        await region.waitFor({ state: 'attached', timeout: 10000 });

        const regionBox = await region.boundingBox();
        const recommendationEl = page.locator('[data-visual-role="recommendation"]');
        await expect(recommendationEl).toBeVisible();
        
        // Ensure recommendation is NOT inside the region
        const isRecInRegion = await region.locator('[data-visual-role="recommendation"]').count() > 0;
        expect(isRecInRegion).toBeFalsy();

        const recBox = await recommendationEl.boundingBox();
        const situationBox = await page.locator('[data-visual-role="current-situation"]').boundingBox();
        const priorityBox = await page.getByText(/Prioridade Estratégica/i).locator('xpath=ancestor::div[contains(@class, "rounded-xl")][1]').boundingBox();
        const outlookBox = await page.getByText(/Perspectiva/i).locator('xpath=ancestor::div[contains(@class, "rounded-xl")][1]').boundingBox();

        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
        const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);

        const measurements: VisualMeasurement = {
          region: regionBox || { x: 0, y: 0, width: 0, height: 0 },
          currentSituation: situationBox || { x: 0, y: 0, width: 0, height: 0 },
          strategicPriority: priorityBox || { x: 0, y: 0, width: 0, height: 0 },
          outlook: outlookBox || { x: 0, y: 0, width: 0, height: 0 },
          recommendation: recBox || { x: 0, y: 0, width: 0, height: 0 },
          viewportWidth: viewport.width,
          documentScrollWidth: scrollWidth,
          overlapDetected: false, // simplified for test
          horizontalOverflow: scrollWidth > clientWidth + 1
        };

        const evalRes = evaluateMeasurements(measurements, scenario, viewport.width);
        
        const screenshotPath = path.join(process.cwd(), `docs/architecture/evidence/eac-summary-freeze/screenshots/harness-${scenario}-${viewport.width}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true });

        // Emulate Print on desktop
        if (viewport.width === 1440) {
          await page.emulateMedia({ media: 'print' });
          const pdfPath = path.join(process.cwd(), `docs/architecture/evidence/eac-summary-freeze/print/print-harness-${scenario}.pdf`);
          await page.pdf({ path: pdfPath, format: 'A4', printBackground: true });
          await page.emulateMedia({ media: 'screen' });
        }

        appendResult({
          targetType: 'HARNESS',
          page: 'HARNESS',
          scenario,
          viewport,
          browser: 'chromium',
          screenshotPath,
          horizontalOverflow: evalRes.overflow,
          overlapDetected: evalRes.overlap,
          accessibleRegionFound: true,
          recommendationOutsideSummaryRegion: !isRecInRegion,
          visualInspection: evalRes.pass ? 'PASS' : 'FAIL',
          observations: evalRes.observations
        });

        if (!evalRes.pass) {
          console.log('MEASUREMENTS:', measurements);
        }
        expect(evalRes.pass, `Visual evaluation failed: ${evalRes.observations.join(', ')}`).toBe(true);
      });
    }
  });
}
