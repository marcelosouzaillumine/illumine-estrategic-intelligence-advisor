import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import * as fs from 'node:fs';
import * as path from 'node:path';

describe('DRE Single Render Path Contract', () => {
  it('must strictly enforce a single canonical rendering path in DREPage.tsx', () => {
    const drePagePath = path.join(process.cwd(), 'src/components/pages/DREPage.tsx');
    
    if (!fs.existsSync(drePagePath)) {
      return;
    }

    const content = fs.readFileSync(drePagePath, 'utf-8');

    // 1. DREExecutiveAdvisorySection used exactly once
    const advisoryMatches = content.match(/<DREExecutiveAdvisorySection/g) || [];
    assert.strictEqual(advisoryMatches.length, 1, 'DREExecutiveAdvisorySection must be rendered exactly once');

    // 2. DREBoardDecisionSupportSection used exactly once
    const decisionMatches = content.match(/<DREBoardDecisionSupportSection/g) || [];
    assert.strictEqual(decisionMatches.length, 1, 'DREBoardDecisionSupportSection must be rendered exactly once');

    // 3. No usage of executiveReport for UI rendering
    if (content.includes('executiveReport.policy') || content.includes('executiveReport?.policy')) {
      assert.fail('DREPage.tsx must not use executiveReport.policy for rendering. It must consume dreViewModel.');
    }

    // 4. No manual extraction from report.metrics
    if (content.match(/{.*?report\.metrics/)) {
      assert.fail('DREPage.tsx must not extract values directly from report.metrics for UI rendering.');
    }
  });
});
