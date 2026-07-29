import { describe, it, expect } from 'vitest';
import { AgentCoordinator, CapabilitySelectionPolicy, OpinionAggregator } from '../index';
import { AgentDomainContext, ExecutiveOpinion } from '@illumine/executive-contracts';
import { Confidence } from '@illumine/core-primitives';

describe('@illumine/executive-orchestrator (Phase 3 Multi-Agent Orchestrator)', () => {
  const dummyContext: AgentDomainContext = {
    tenantId: 't-1',
    companyName: 'Illumine Corp',
    period: '2026-Q3',
    agendaItem: {
      agendaItemId: 'agenda-1',
      title: 'Reestruturação de Dívida',
      topic: 'Finanças',
      intent: {
        intentId: 'intent-1',
        type: 'REDUCE_DEBT',
        description: 'Reduzir endividamento',
        targetKpiCodes: ['DebtToEBITDA'],
        priority: 'CRITICAL'
      }
    },
    rawDomainData: {}
  };

  it('should select capabilities via CapabilitySelectionPolicy', () => {
    const selected = CapabilitySelectionPolicy.selectCapabilities(dummyContext);
    expect(selected).toContain('financial-intelligence');
    expect(selected).toContain('risk-intelligence');
  });

  it('should aggregate opinions and detect divergences neutraly via AgentCoordinator', () => {
    const op1: ExecutiveOpinion = {
      agentId: 'cfo-agent',
      agentName: 'CFO Agent',
      confidence: Confidence.create(0.92),
      executiveSummary: 'Resumo financeiro',
      keyRisks: ['Risco de taxa de juros'],
      keyOpportunities: ['Refinanciamento'],
      recommendations: ['Renegociar dívida']
    };

    const op2: ExecutiveOpinion = {
      agentId: 'cro-agent',
      agentName: 'CRO Agent',
      confidence: Confidence.create(0.80), // Menor que 0.85 para disparar nota de divergência
      executiveSummary: 'Resumo de risco',
      keyRisks: ['Risco de volatilidade cambial'],
      keyOpportunities: ['Hedge cambial'],
      recommendations: ['Travar dólar']
    };

    const result = AgentCoordinator.coordinateOrchestration(dummyContext, [op1, op2]);
    expect(result.selectedCapabilities.length).toBeGreaterThan(0);
    expect(result.aggregation.combinedRisks.length).toBe(2);
    expect(result.conflictReport.divergencesFound).toBe(true);
  });
});
