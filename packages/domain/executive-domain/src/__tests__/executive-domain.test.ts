import { describe, it, expect } from 'vitest';
import { ExecutiveCaseAggregate, ExecutiveDecisionScoringService, DecisionModelProjector, DomainRules } from '../index';
import { Fact, Evidence, Inference, Findings, Recommendation } from '@illumine/executive-contracts';
import { Confidence } from '@illumine/core-primitives';

describe('@illumine/executive-domain Pure Domain Logic', () => {
  it('should prevent adding recommendations without prior findings (Invariant 2)', () => {
    const caseAgg = new ExecutiveCaseAggregate('case-01', 'Reestruturação de Capital', '2026-07-28T00:00:00Z');

    const rec: Recommendation = {
      recommendationId: 'rec-1',
      alternativeId: 'alt-1',
      title: 'Emissão de Debêntures',
      strategicDescription: 'Emitir R$ 50M em debêntures incentivadas',
      expectedCost: { amount: 50000000, currency: 'BRL' } as any,
      predictedOutcome: {} as any
    };

    expect(() => caseAgg.addRecommendation(rec)).toThrow('[DomainViolation] Cannot add recommendation without prior findings');
  });

  it('should allow recommendations when findings exist and evaluate integrity score deterministically', () => {
    const caseAgg = new ExecutiveCaseAggregate('case-02', 'Expansão Internacional', '2026-07-28T00:00:00Z');

    const fact: Fact = { factId: 'f1', statement: 'EBITDA cresceu 15%', provenance: {} as any };
    const ev: Evidence = { evidenceId: 'e1', fact, confidence: Confidence.create(0.9), relevanceScore: 1.0 };
    const inf: Inference = { inferenceId: 'i1', supportingEvidenceIds: ['e1'], conclusion: 'Capacidade de caixa alta', confidence: Confidence.create(0.95) };
    const find: Findings = { findingId: 'find1', neutralInsight: 'Empresa possui liquidez para expansão', inferences: [inf], identifiedGaps: [] };

    caseAgg.addFact(fact);
    caseAgg.addEvidence(ev);
    caseAgg.addInference(inf);
    caseAgg.setFindings(find);

    const rec: Recommendation = {
      recommendationId: 'rec-2',
      alternativeId: 'alt-2',
      title: 'Abertura de Filial em Miami',
      strategicDescription: 'Expandir operação comercial para os EUA',
      expectedCost: { amount: 12000000, currency: 'BRL' } as any,
      predictedOutcome: {} as any
    };

    caseAgg.addRecommendation(rec);
    expect(caseAgg.recommendations.length).toBe(1);
    expect(DomainRules.validateCognitivePipeline(caseAgg)).toBe(true);

    const integrity = ExecutiveDecisionScoringService.evaluateCaseIntegrity(caseAgg);
    expect(integrity.value).toBeGreaterThan(0);
  });

  it('should project ExecutiveCase to BoardReportProjection via DecisionModelProjector', () => {
    const caseAgg = new ExecutiveCaseAggregate('case-03', 'M&A Estratégico', '2026-07-28T00:00:00Z');
    const projection = DecisionModelProjector.projectToBoardReport(caseAgg, []);

    expect(projection.reportId).toBe('proj-case-03');
    expect(projection.companyName).toBe('Illumine Corporate Enterprise');
  });
});
