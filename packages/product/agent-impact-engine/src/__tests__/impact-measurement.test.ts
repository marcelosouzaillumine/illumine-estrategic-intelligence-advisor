import { describe, it, expect } from 'vitest';
import { AgentImpactEngine } from '../index';
import { AgentRecommendation } from '@illumine/agent-runtime';
import { Score, Currency } from '@illumine/core-primitives';

describe('@illumine/agent-impact-engine (Wave 15B Phase 7 Impact Measurement)', () => {
  it('should calculate estimated financial, strategic, and operational impact for an AgentRecommendation', () => {
    const recommendation: AgentRecommendation = {
      recommendationId: 'rec-01',
      agentId: 'operations-agent',
      domain: 'operations',
      title: 'Otimização da Cadeia de Suprimentos',
      executiveSummary: 'Integração de ordens de produção',
      reasoningTrace: {} as any,
      evidenceBundle: {} as any,
      predictionExplanation: {} as any,
      confidenceScore: Score.create(90),
      riskLevel: 'MEDIUM',
      timestamp: new Date()
    };

    const impact = AgentImpactEngine.calculateImpact(recommendation);
    expect(impact.financialImpactValue.amount).toBe(1500000);
    expect(impact.financialImpactValue.currency).toBe(Currency.BRL);
    expect(impact.strategicAlignmentScore.value).toBe(92);
    expect(impact.operationalEfficiencyGainPct).toBe(8.5);
  });
});
