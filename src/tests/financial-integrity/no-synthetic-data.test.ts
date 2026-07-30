import { describe, it } from 'node:test';
import assert from 'node:assert';
import { FinancialPipelineOrchestrator } from '../../core/runtime/financial-governance/pipeline/FinancialPipelineOrchestrator';
import { FinancialStatementType } from '../../../packages/executive-contracts/src/financial/index';

describe('CFDI v2.1 — No Synthetic Data / Fallback Contract', () => {
  it('must return FAILED certification and 0 score when database returns empty array (no synthetic mock generation allowed)', async () => {
    const governance = await FinancialPipelineOrchestrator.processAndCertify(
      [],
      [],
      'client-empty',
      FinancialStatementType.DRE_ACCOUNTING,
      2026
    );

    assert.strictEqual(governance.certificationStatus, 'FAILED');
    assert.strictEqual(governance.runtimePermission, 'BLOCK');
    assert.strictEqual(governance.dataset.entries.length, 0);
    assert.strictEqual(governance.dataset.healthIndex.index, 0);
    assert.strictEqual(governance.trustSignal.allowedDecisionLevel, 'BLOCKED');
  });
});
