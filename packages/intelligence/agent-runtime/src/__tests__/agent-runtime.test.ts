import { describe, it, expect } from 'vitest';
import { AgentRecommendation, AgentEvidenceBundle } from '../index';
import { Score } from '@illumine/core-primitives';

describe('@illumine/agent-runtime (Wave 15B Phase 1 Foundation)', () => {
  it('should construct a valid canonical AgentRecommendation with evidence bundle and risk level', () => {
    const bundle: AgentEvidenceBundle = {
      bundleId: 'bun-01',
      metricCodes: ['EBITDA', 'FREE_CASH_FLOW'],
      factSummaries: ['Q3 EBITDA margin dropped by 4.2%'],
      lineageHash: 'sha256-evidence-bundle-001'
    };

    const recommendation: AgentRecommendation = {
      recommendationId: 'rec-cfo-01',
      agentId: 'cfo-intelligence-agent',
      domain: 'finance',
      title: 'Reestruturação de Dívida de Curto Prazo',
      executiveSummary: 'Recomenda-se emitir debêntures para alongar o perfil do passivo.',
      reasoningTrace: {
        traceId: 'tr-01',
        agentId: 'cfo-intelligence-agent',
        steps: ['Passo 1: Analisar DFC', 'Passo 2: Simular emissão'],
        confidence: Score.create(90),
        timestamp: new Date()
      },
      evidenceBundle: bundle,
      predictionExplanation: {
        explanationId: 'exp-01',
        topFactors: ['Alta taxa de juros de curto prazo'],
        identifiedRisks: ['Risco de refinanciamento'],
        confidence: Score.create(90),
        explainabilityScore: Score.create(95)
      },
      confidenceScore: Score.create(90),
      riskLevel: 'HIGH',
      timestamp: new Date()
    };

    expect(recommendation.agentId).toBe('cfo-intelligence-agent');
    expect(recommendation.riskLevel).toBe('HIGH');
    expect(recommendation.evidenceBundle.lineageHash).toBe('sha256-evidence-bundle-001');
  });
});
