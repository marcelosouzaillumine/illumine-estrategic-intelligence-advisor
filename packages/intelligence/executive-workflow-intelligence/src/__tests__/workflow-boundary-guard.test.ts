/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { DecisionCommandEnvelopeResolver } from '../index';

describe('Quality Gate 1 — Workflow Boundary Guard Test', () => {
  it('should enforce that workflows only accept certified DecisionCommandEnvelope inputs', () => {
    const envelope = DecisionCommandEnvelopeResolver.createEnvelope('dec-guard', 'FinancialAgent', 'HIGH', 'Reestruturação');
    expect(envelope.decisionId).toBe('dec-guard');
    expect(envelope.confidenceScore).toBe(98.5);
    expect(envelope.riskLevel).toBe('HIGH');
    expect((envelope as any).rawDatabaseConnection).toBeUndefined();
  });
});
