import { test, describe } from 'node:test';
import * as assert from 'node:assert';
import { generateBoardFollowupAgenda } from '../../src/core/runtime/execution-governance/BoardFollowupEngine';
import { ExecutionCommitment } from '../../src/core/runtime/execution-governance/ExecutionGovernanceTypes';

describe('BoardFollowupEngine', () => {
  test('should convert trackers back to MONITORAMENTO items with correct urgency', () => {
    const commitments: ExecutionCommitment[] = [
      {
        id: 'c1',
        sourceRecommendationId: 'r1',
        title: 'Pending Action',
        description: 'Desc',
        expectedCompletionDate: new Date('2026-06-01'),
        expectedCapex: 10000,
        expectedRevenueImpact: 50000,
        status: 'PENDING',
        slippage: {
          timeSlippageDays: 0,
          timeSeverity: 'NONE',
          scopeDeviationPercent: 0,
          scopeSeverity: 'NONE',
          impactDeviationPercent: 0,
          impactSeverity: 'NONE',
          overallSlippageScore: 0
        },
        ownerRole: 'CEO',
        lastUpdated: new Date()
      },
      {
        id: 'c2',
        sourceRecommendationId: 'r2',
        title: 'Critical Deviated Action',
        description: 'Desc',
        expectedCompletionDate: new Date('2026-06-01'),
        actualCompletionDate: new Date('2026-06-01'),
        expectedCapex: 10000,
        actualCapex: 20000,
        expectedRevenueImpact: 50000,
        actualRevenueImpact: 10000,
        status: 'DEVIATED',
        slippage: {} as any,
        ownerRole: 'CFO',
        lastUpdated: new Date()
      }
    ];

    const agenda = generateBoardFollowupAgenda(commitments);
    assert.strictEqual(agenda.length, 2);
    
    // c2 should be HIGH urgency, c1 should be NORMAL
    assert.strictEqual(agenda[0].commitmentId, 'c2');
    assert.strictEqual(agenda[0].urgency, 'HIGH');
    
    assert.strictEqual(agenda[1].commitmentId, 'c1');
    assert.strictEqual(agenda[1].urgency, 'NORMAL');
  });
});
