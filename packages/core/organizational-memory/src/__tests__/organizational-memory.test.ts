import { describe, it, expect } from 'vitest';
import { DecisionOutcomeStatus, ExperienceRecord, MemoryRepository } from '../index';

describe('@illumine/organizational-memory (Phase 1 Memory Foundation)', () => {
  it('should validate DecisionOutcomeStatus enum', () => {
    expect(DecisionOutcomeStatus.EXCEEDED).toBe('EXCEEDED');
    expect(DecisionOutcomeStatus.EXPECTED).toBe('EXPECTED');
  });

  it('should persist and retrieve ExperienceRecord via MemoryRepository', () => {
    const repo = new MemoryRepository();

    const record: ExperienceRecord = {
      id: 'exp-100',
      decisionId: 'dec-50',
      context: {
        tenantId: 'tenant-01',
        companyName: 'Illumine OS Enterprise',
        sector: 'Technology',
        activeStrategy: 'Growth 2026',
        period: '2026-Q3'
      },
      reasoningTrace: {
        traceId: 'trace-1',
        caseId: 'case-50',
        provenance: { sourceId: 'src-1', evidenceIds: ['ev-1'], lineageHash: 'hash-1' },
        steps: [{ stepIndex: 1, phase: 'FACT', description: 'Receita cresceu 20%', confidence: 0.95 }]
      },
      outcome: {
        outcomeId: 'out-1',
        actionId: 'act-1',
        status: DecisionOutcomeStatus.EXCEEDED,
        measuredDelta: 5.2,
        metricCode: 'EBITDA',
        recordedAt: '2026-07-28T00:00:00Z'
      }
    };

    repo.save(record);

    const fetched = repo.findById('exp-100');
    expect(fetched).toBeDefined();
    expect(fetched?.outcome.status).toBe(DecisionOutcomeStatus.EXCEEDED);
    expect(fetched?.context.companyName).toBe('Illumine OS Enterprise');
  });
});
