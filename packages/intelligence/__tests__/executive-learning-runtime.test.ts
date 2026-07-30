/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { LearningRecordContract } from '@illumine/executive-contracts';

describe('@illumine/intelligence (Wave 18.5 Executive Learning Runtime)', () => {
  it('should validate LearningRecordContract and calibration factor (ADR-083)', () => {
    const record: LearningRecordContract = {
      recordId: 'rec-learn-10',
      decisionId: 'dec-100',
      companyId: 'comp-100',
      expectedImpact: 500000,
      actualOutcome: 420000,
      deltaPercent: 84.0,
      varianceReason: 'Iniciativa entregou 84% do impacto previsto devido a atraso na homologação contratual.',
      calibrationFactor: 0.84,
      timestamp: '2026-07-30T04:30:00Z'
    };

    expect(record.calibrationFactor).toBe(0.84);
    expect(record.deltaPercent).toBe(84.0);
  });
});
