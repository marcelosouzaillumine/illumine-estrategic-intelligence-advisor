import { describe, it, expect } from 'vitest';
import { HumanApprovalGateway } from '../index';
import { AgentRecommendation } from '@illumine/agent-runtime';
import { Score } from '@illumine/core-primitives';

describe('@illumine/human-governance-gateway (Wave 15B Phase 6)', () => {
  it('should enforce PENDING_HUMAN_REVIEW for HIGH risk recommendations (ADR-027)', () => {
    const highRiskRec: AgentRecommendation = {
      recommendationId: 'rec-high-01',
      agentId: 'cfo-intelligence-agent',
      domain: 'finance',
      title: 'Emissão de Debêntures',
      executiveSummary: 'Operação de crédito de R$ 50M',
      reasoningTrace: {} as any,
      evidenceBundle: {} as any,
      predictionExplanation: {} as any,
      confidenceScore: Score.create(92),
      riskLevel: 'HIGH',
      timestamp: new Date()
    };

    const res = HumanApprovalGateway.evaluateApprovalRequirement(highRiskRec);
    expect(res.status).toBe('PENDING_HUMAN_REVIEW');
    expect(res.humanNotes).toContain('risco elevado exige aprovação humana');
  });

  it('should approve LOW risk recommendations automatically', () => {
    const lowRiskRec: AgentRecommendation = {
      recommendationId: 'rec-low-01',
      agentId: 'controller-agent',
      domain: 'controladoria',
      title: 'Alerta Orçamentário',
      executiveSummary: 'Variação irrelevante em OPEX de 0.2%',
      reasoningTrace: {} as any,
      evidenceBundle: {} as any,
      predictionExplanation: {} as any,
      confidenceScore: Score.create(98),
      riskLevel: 'LOW',
      timestamp: new Date()
    };

    const res = HumanApprovalGateway.evaluateApprovalRequirement(lowRiskRec);
    expect(res.status).toBe('APPROVED');
  });
});
