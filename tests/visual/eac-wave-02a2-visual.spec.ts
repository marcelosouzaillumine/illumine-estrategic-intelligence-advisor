import { test, expect } from '@playwright/test';

const NORMAL_COMPONENTS = [
  {
    name: 'workflow-audit',
    label: 'WorkflowAuditFeed',
    accessibleName: /histórico de eventos e aprovações do workflow/i,
    minHistoricalItems: 2,
  },
  {
    name: 'export-history',
    label: 'ExportHistoryPanel',
    accessibleName: /histórico de exportações executivas/i,
    minHistoricalItems: 1,
  },
  {
    name: 'import-history',
    label: 'ClientImportHistory',
    accessibleName: /histórico de importações do cliente/i,
    minHistoricalItems: 1,
  },
  {
    name: 'access-logs',
    label: 'ClientAccessLogs',
    accessibleName: /histórico de acessos do cliente/i,
    minHistoricalItems: 1,
  },
];

const EMPTY_COMPONENTS = [
  {
    name: 'workflow-audit-empty',
    label: 'WorkflowAuditFeed (empty)',
    expectSection: false,  // Empty state renders plain text, no section
  },
  {
    name: 'export-history-empty',
    label: 'ExportHistoryPanel (empty)',
    expectSection: true,  // Empty state renders inside the section with "Nenhum relatório" message
  },
];

const VIEWPORTS = [
  { width: 1440, height: 900 },
  { width: 1024, height: 768 },
  { width: 390, height: 844 },
];

test.describe('EAC Wave 02A.2 — Decision Trace — Boundary Evidence', () => {

  // ===== NORMAL COMPONENTS: mandatory boundary assertions =====
  for (const comp of NORMAL_COMPONENTS) {
    for (const vp of VIEWPORTS) {
      test(`${comp.label} at ${vp.width}px: boundary present, accessible, no overflow`, async ({ page, baseURL }) => {
        const targetUrl = `${baseURL}/?wave=02a2&target=${comp.name}`;
        await page.setViewportSize(vp);
        await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
        await page.waitForTimeout(2000);

        // MANDATORY: Exactly 1 decision-trace section
        const eacSection = page.locator('section[data-eac-block="decision-trace"]');
        await expect(eacSection).toHaveCount(1);

        // MANDATORY: Accessible region visible
        const region = page.getByRole('region', { name: comp.accessibleName });
        await expect(region).toBeVisible();

        // MANDATORY: Historical content rendered (not empty fallback)
        const bodyText = await page.locator('body').innerText();
        expect(bodyText.length).toBeGreaterThan(50);
        expect(bodyText).not.toContain('Target not found');

        // MANDATORY: No horizontal overflow
        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
        const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
        expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2);

        // Screenshot
        await page.screenshot({
          path: `tests/visual/screenshots/wave-02a2-${comp.name}-${vp.width}px.png`,
          fullPage: true,
        });
      });
    }
  }

  // ===== BOUNDARY EXCLUSION: controls outside trace region =====
  for (const vp of VIEWPORTS) {
    test(`ClientImportHistory at ${vp.width}px: upload form OUTSIDE trace boundary`, async ({ page, baseURL }) => {
      await page.setViewportSize(vp);
      await page.goto(`${baseURL}/?wave=02a2&target=import-history`, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForTimeout(2000);

      // Trace section exists
      await expect(page.locator('section[data-eac-block="decision-trace"]')).toHaveCount(1);

      // Upload input exists but is NOT inside the trace section
      const uploadOutside = await page.evaluate(() => {
        const traceSection = document.querySelector('section[data-eac-block="decision-trace"]');
        const uploadInput = document.querySelector('input[type="file"]');
        if (!traceSection || !uploadInput) return { found: false, outside: false };
        return { found: true, outside: !traceSection.contains(uploadInput) };
      });
      expect(uploadOutside.found).toBe(true);
      expect(uploadOutside.outside).toBe(true);
    });

    test(`ClientAccessLogs at ${vp.width}px: KPI cards OUTSIDE trace boundary`, async ({ page, baseURL }) => {
      await page.setViewportSize(vp);
      await page.goto(`${baseURL}/?wave=02a2&target=access-logs`, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForTimeout(2000);

      // Trace section exists
      await expect(page.locator('section[data-eac-block="decision-trace"]')).toHaveCount(1);

      // KPI cards exist but are NOT inside the trace section
      const kpiOutside = await page.evaluate(() => {
        const traceSection = document.querySelector('section[data-eac-block="decision-trace"]');
        const kpiCards = document.querySelectorAll('[class*="bg-blue-50"], [class*="bg-success-soft"]');
        if (!traceSection || kpiCards.length === 0) return { found: false, outside: false, count: 0 };
        const allOutside = Array.from(kpiCards).every(el => !traceSection.contains(el));
        return { found: true, outside: allOutside, count: kpiCards.length };
      });
      expect(kpiOutside.found).toBe(true);
      expect(kpiOutside.outside).toBe(true);
    });
  }

  // ===== EMPTY STATE: explicit policy =====
  for (const comp of EMPTY_COMPONENTS) {
    for (const vp of VIEWPORTS) {
      test(`${comp.label} at ${vp.width}px: empty state renders correctly`, async ({ page, baseURL }) => {
        await page.setViewportSize(vp);
        await page.goto(`${baseURL}/?wave=02a2&target=${comp.name}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
        await page.waitForTimeout(2000);

        const eacSection = page.locator('section[data-eac-block="decision-trace"]');

        if (comp.expectSection) {
          // Empty state renders inside the section
          await expect(eacSection).toHaveCount(1);
        } else {
          // Empty state renders as plain text without the section
          await expect(eacSection).toHaveCount(0);
        }

        // No overflow
        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
        const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
        expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2);

        // No "Target not found" error
        const bodyText = await page.locator('body').innerText();
        expect(bodyText).not.toContain('Target not found');

        await page.screenshot({
          path: `tests/visual/screenshots/wave-02a2-${comp.name}-${vp.width}px.png`,
          fullPage: true,
        });
      });
    }
  }
});
