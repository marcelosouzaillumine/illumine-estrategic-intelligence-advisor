import { PortfolioSummaryService } from './portfolio-summary.service';
import { ExecutiveProfilePortfolio } from './portfolio-types';
import { describe, it, expect } from 'vitest';

describe('Executive Intelligence Portfolio Engine™ - Calibration', () => {
  const service = new PortfolioSummaryService();

  const mockPortfolioBase: any = {
    organizationId: 'org-1',
    updatedAt: new Date().toISOString(),
    intelligenceIndex: 0,
    completedJourneys: [],
    domains: {}
  };

  it('Cenário 1 — Empresa em estruturação', () => {
    const portfolio: any = {
      ...mockPortfolioBase,
      domains: {
        financial: { status: 'completed', currentMaturity: 'developing', confidence: 'high', dataSources: [] },
        governance: { status: 'completed', currentMaturity: 'initial', confidence: 'high', dataSources: [] }
      },
      completedJourneys: ['financial', 'governance']
    };

    const summary = service.generateSummary(portfolio);
    expect(summary.organizationalStage).toBe('Foundation Building');
    expect(summary.recommendedEvolution.nextJourneyId).toBe('governance-intelligence'); // Will suggest governance evolution as the current one is initial, or leadership based on logic.
    // In our logic it is "Foundation Building" and if developing + initial without people, next Journey could be operational/governance.
  });

  it('Cenário 2 — Empresa em expansão', () => {
    const portfolio: any = {
      ...mockPortfolioBase,
      domains: {
        financial: { status: 'completed', currentMaturity: 'advanced', confidence: 'high', dataSources: [] },
        governance: { status: 'completed', currentMaturity: 'structured', confidence: 'high', dataSources: [] }
      },
      completedJourneys: ['financial', 'governance']
    };

    const summary = service.generateSummary(portfolio);
    expect(summary.organizationalStage).toBe('Enterprise Development');
    expect(summary.recommendedEvolution.nextJourneyId).toBe('operational-intelligence');
  });

  it('Cenário 3 — Empresa dependente do fundador', () => {
    const portfolio: any = {
      ...mockPortfolioBase,
      domains: {
        governance: { status: 'completed', currentMaturity: 'initial', confidence: 'high', dataSources: [] },
        people: { status: 'completed', currentMaturity: 'developing', confidence: 'high', dataSources: [] }
      },
      completedJourneys: ['governance', 'people']
    };

    const summary = service.generateSummary(portfolio);
    expect(summary.organizationalStage).toBe('Foundation Building');
    expect(summary.attentionAreas).toContain('Leadership Governance');
    expect(summary.recommendedEvolution.nextJourneyId).toBe('leadership-intelligence');
  });
});
