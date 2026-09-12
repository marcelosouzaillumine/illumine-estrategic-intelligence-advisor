import { describe, it, expect } from 'vitest';
import { ExecutiveDecisionGate } from '../index';
import { AgentRecommendation } from '@illumine/agent-runtime';
import { Score } from '@illumine/core-primitives';

describe('@illumine/human-governance-gateway (Wave 16 Phase 7 Executive Decision Gate)', () => {
  it('should enforce BOARD_LEVEL_WORKFLOW_REQUIRED for critical scenario', () => {
    const rec: AgentRecommendation = {
      recommendationId: 'rec-crit-01',
      agentId: 'strategy-agent',
      domain: 'strategy',
      title: 'Fusão M&A',
      executiveSummary: 'Operação de M&A de grande porte',
      reasoningTrace: {} as any,
      evidenceBundle: {} as any,
      predictionExplanation: {} as any,
      confidenceScore: Score.create(95),
      riskLevel: 'HIGH',
      timestamp: new Date()
    };

    const res = ExecutiveDecisionGate.evaluateDecisionGate(rec, true);
    expect(res.gateAction).toBe('BOARD_LEVEL_WORKFLOW_REQUIRED');
    expect(res.isCritical).toBe(true);
  });

  it('should enforce MANDATORY_APPROVAL_REQUIRED for HIGH risk recommendation', () => {
    const rec: AgentRecommendation = {
      recommendationId: 'rec-high-01',
      agentId: 'cfo-agent',
      domain: 'finance',
      title: 'Emissão de Dívida',
      executiveSummary: 'Captação no mercado',
      reasoningTrace: {} as any,
      evidenceBundle: {} as any,
      predictionExplanation: {} as any,
      confidenceScore: Score.create(90),
      riskLevel: 'HIGH',
      timestamp: new Date()
    };

    const res = ExecutiveDecisionGate.evaluateDecisionGate(rec, false);
    expect(res.gateAction).toBe('MANDATORY_APPROVAL_REQUIRED');
  });
});
