import { describe, it, expect } from 'vitest';
import {
  FinancialIntelligenceCapability,
  GovernanceIntelligenceCapability,
  OperationalIntelligenceCapability,
  StrategicAnalysisCapability,
  RiskIntelligenceCapability,
  ExecutiveAdvisorCapability
} from '../index';
import { Maturity, Stability, AgentDomainContext } from '@illumine/executive-contracts';
import { ExecutiveCaseAggregate } from '@illumine/executive-domain';

describe('@illumine/capabilities Cognition Engine (Wave 12B)', () => {
  const dummyContext: AgentDomainContext = {
    tenantId: 'tenant-1',
    companyName: 'Illumine Corporate OS',
    period: '2026-07',
    agendaItem: {
      agendaItemId: 'item-1',
      title: 'Plano Estratégico de Liquidez',
      topic: 'Finanças Executivas',
      intent: {
        intentId: 'intent-1',
        type: 'IMPROVE_MARGIN',
        description: 'Melhorar margem EBITDA',
        targetKpiCodes: ['EBITDA', 'ROIC'],
        priority: 'CRITICAL'
      }
    },
    rawDomainData: {}
  };

  it('should validate FinancialIntelligenceCapability manifest and evaluate opinion', () => {
    const manifest = FinancialIntelligenceCapability.manifest;
    expect(manifest.maturity).toBe(Maturity.CERTIFIED);
    expect(manifest.stability).toBe(Stability.CANONICAL);
    expect(manifest.cognitiveProfile.explanation).toBe(true);

    const opinion = FinancialIntelligenceCapability.evaluateOpinion(dummyContext);
    expect(opinion.agentId).toBe('cfo-agent');
    expect(opinion.recommendations.length).toBeGreaterThan(0);
  });

  it('should validate GovernanceIntelligenceCapability manifest and evaluate opinion', () => {
    const manifest = GovernanceIntelligenceCapability.manifest;
    expect(manifest.maturity).toBe(Maturity.CERTIFIED);
    expect(manifest.cognitiveProfile.explanation).toBe(true);

    const opinion = GovernanceIntelligenceCapability.evaluateOpinion(dummyContext);
    expect(opinion.agentId).toBe('governance-agent');
  });

  it('should validate OperationalIntelligenceCapability, StrategicAnalysisCapability and RiskIntelligenceCapability', () => {
    expect(OperationalIntelligenceCapability.manifest.cognitiveProfile.explanation).toBe(true);
    expect(StrategicAnalysisCapability.manifest.cognitiveProfile.explanation).toBe(true);
    expect(RiskIntelligenceCapability.manifest.cognitiveProfile.explanation).toBe(true);
  });

  it('should orchestrate opinions into BoardReportProjection via ExecutiveAdvisorCapability', () => {
    const caseAgg = new ExecutiveCaseAggregate('case-board-01', 'Sessão do Conselho Executivo', '2026-07-28T00:00:00Z');
    const finOpinion = FinancialIntelligenceCapability.evaluateOpinion(dummyContext);
    const govOpinion = GovernanceIntelligenceCapability.evaluateOpinion(dummyContext);

    const report = ExecutiveAdvisorCapability.generateBoardReport(caseAgg, [finOpinion, govOpinion]);
    expect(report.reportId).toBe('proj-case-board-01');
    expect(report.opinions.length).toBe(2);
  });
});
