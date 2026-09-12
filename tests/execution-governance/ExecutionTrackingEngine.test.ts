import { test, describe } from 'node:test';
import * as assert from 'node:assert';
import { calculateExecutionSlippage, updateExecutionCommitment } from '../../src/capabilities/runtime/execution-governance/ExecutionTrackingEngine';
import { ExecutionCommitment } from '../../src/capabilities/runtime/execution-governance/ExecutionGovernanceTypes';

describe('ExecutionTrackingEngine', () => {
  test('should calculate correct slippage for perfectly executed commitment', () => {
    const commitment: ExecutionCommitment = {
      id: 'c1',
      sourceRecommendationId: 'r1',
      title: 'Ação 1',
      description: 'Desc',
      expectedCompletionDate: new Date('2026-06-01'),
      actualCompletionDate: new Date('2026-06-01'),
      expectedCapex: 10000,
      actualCapex: 10000,
      expectedRevenueImpact: 50000,
      actualRevenueImpact: 50000,
      status: 'EXECUTED',
      slippage: {} as any,
      ownerRole: 'CEO',
      lastUpdated: new Date()
    };

    const slippage = calculateExecutionSlippage(commitment, new Date('2026-06-02'));
    assert.strictEqual(slippage.timeSeverity, 'NONE');
    assert.strictEqual(slippage.scopeSeverity, 'NONE');
    assert.strictEqual(slippage.impactSeverity, 'NONE');
    assert.strictEqual(slippage.overallSlippageScore, 0);
  });

  test('should calculate correct slippage for multidimensional deviation', () => {
    const commitment: ExecutionCommitment = {
      id: 'c1',
      sourceRecommendationId: 'r1',
      title: 'Ação 1',
      description: 'Desc',
      expectedCompletionDate: new Date('2026-06-01'),
      actualCompletionDate: new Date('2026-07-05'), // > 30 days overdue (MODERATE)
      expectedCapex: 10000,
      actualCapex: 16000, // +60% scope deviation (CRITICAL)
      expectedRevenueImpact: 50000,
      actualRevenueImpact: 20000, // -60% impact deviation (CRITICAL)
      status: 'DEVIATED',
      slippage: {} as any,
      ownerRole: 'CEO',
      lastUpdated: new Date()
    };

    const slippage = calculateExecutionSlippage(commitment, new Date('2026-07-06'));
    assert.strictEqual(slippage.timeSeverity, 'MODERATE');
    assert.strictEqual(slippage.scopeSeverity, 'CRITICAL');
    assert.strictEqual(slippage.impactSeverity, 'CRITICAL');
    
    // totalSeverity = 2 + 3 + 3 = 8
    // score = 8 / 9 * 100 = 89
    assert.strictEqual(slippage.overallSlippageScore, 89);
  });
});
