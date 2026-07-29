import { describe, it, expect } from 'vitest';
import { ExecutiveDecisionWorkspace, ExecutiveDecision } from '../index';
import { Score } from '@illumine/core-primitives';

describe('@illumine/executive-decision-workspace (Wave 16.5 Decision Object & Workspace)', () => {
  it('should register canonical ExecutiveDecision with Decision Trace ID pipeline', () => {
    const workspace = new ExecutiveDecisionWorkspace();

    const decision: ExecutiveDecision = {
      decisionId: 'dec-01',
      tracePipeline: {
        decisionTraceId: 'dt-01',
        recommendationTraceId: 'rt-01',
        executionTraceId: 'et-01',
        outcomeTraceId: 'ot-01',
        learningTraceId: 'lt-01'
      },
      title: 'Aprovação de CAPEX para Expansão',
      context: 'Plano de expansão regional',
      decisionCategory: 'Strategic',
      financialImpactBrl: 5000000,
      strategicAlignmentScore: Score.create(96),
      operationalImpactScore: Score.create(92),
      confidenceScore: Score.create(94),
      evidenceBundle: { bundleId: 'b-01', metricCodes: ['ROI'], factSummaries: ['DRE Projetada'], lineageHash: 'sha-01' },
      alternativesConsidered: ['Arrendamento', 'Parceria estratégica'],
      tradeOffsAccepted: ['Aumento de capex em Q3'],
      approvalRequirement: 'HUMAN_APPROVAL_COMPULSORY',
      owner: 'CEO',
      dueDate: new Date(),
      status: 'RECOMMENDED',
      businessValueBrl: 12000000,
      riskExposure: 'HIGH'
    };

    workspace.registerDecisionCard({
      cardId: 'card-01',
      title: decision.title,
      financialImpactBrl: decision.financialImpactBrl,
      strategicAlignmentScore: decision.strategicAlignmentScore,
      operationalImpactScore: decision.operationalImpactScore,
      consultedAgents: ['cfo-agent'],
      confidenceScore: decision.confidenceScore,
      riskLevel: decision.riskExposure,
      priorityClassification: 'HIGH',
      evidenceSummary: 'DRE Projetada',
      recommendationText: 'Aprovar CAPEX',
      status: 'UNDER_REVIEW'
    });

    expect(workspace.getDecisionCards().length).toBe(1);
    expect(decision.tracePipeline.decisionTraceId).toBe('dt-01');
  });
});
