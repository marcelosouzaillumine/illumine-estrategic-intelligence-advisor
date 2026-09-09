import { describe, it, expect } from 'vitest';
import { ExecutiveAdvisoryCouncil } from '../index';
import { AgentRecommendation } from '@illumine/agent-runtime';
import { Score } from '@illumine/core-primitives';

describe('@illumine/executive-orchestrator (Wave 16 Phase 3 Executive Advisory Council)', () => {
  it('should coordinate multi-agent council and generate UnifiedExecutiveAdvisoryBrief (ADR-039)', () => {
    const rec1: AgentRecommendation = {
      recommendationId: 'r-cfo-1',
      agentId: 'cfo-governance-agent',
      domain: 'finance',
      title: 'Emitir debêntures',
      executiveSummary: 'Alongar perfil de dívida',
      reasoningTrace: {} as any,
      evidenceBundle: {} as any,
      predictionExplanation: {} as any,
      confidenceScore: Score.create(92),
      riskLevel: 'HIGH',
      timestamp: new Date()
    };

    const rec2: AgentRecommendation = {
      recommendationId: 'r-risk-1',
      agentId: 'risk-agent',
      domain: 'risk',
      title: 'Hedge cambial',
      executiveSummary: 'Estruturar hedge para passivo em USD',
      reasoningTrace: {} as any,
      evidenceBundle: {} as any,
      predictionExplanation: {} as any,
      confidenceScore: Score.create(94),
      riskLevel: 'MEDIUM',
      timestamp: new Date()
    };

    const brief = ExecutiveAdvisoryCouncil.coordinateCouncil('trig-01', 'FINANCE', [rec1, rec2]);
    expect(brief.participatingAgents.length).toBe(2);
    expect(brief.participatingAgents).toContain('cfo-governance-agent');
    expect(brief.overallConfidenceScore.value).toBe(93);
  });
});
