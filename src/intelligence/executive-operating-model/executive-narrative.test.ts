import { ExecutiveNarrativeService } from './executive-narrative.service';
import { PortfolioSummaryService } from '../executive-profile/portfolio-summary.service';
import { ExecutiveProfilePortfolio } from '../executive-profile/portfolio-types';
import { describe, it, expect } from 'vitest';

describe('Executive Narrative Governance Engine™', () => {
  const summaryService = new PortfolioSummaryService();
  const narrativeService = new ExecutiveNarrativeService();

  const mockPortfolioBase: any = {
    organizationId: 'org-1',
    updatedAt: new Date().toISOString(),
    intelligenceIndex: 0,
    completedJourneys: [],
    domains: {}
  };

  it('Cenário Enterprise', () => {
    const portfolio: any = {
      ...mockPortfolioBase,
      domains: {
        financial: { status: 'completed', currentMaturity: 'advanced', confidence: 'high', dataSources: [] },
        governance: { status: 'completed', currentMaturity: 'structured', confidence: 'high', dataSources: [] }
      },
      completedJourneys: ['financial', 'governance']
    };

    const summary = summaryService.generateSummary(portfolio);
    expect(summary.organizationalStage).toBe('Enterprise Development');

    const reality = narrativeService.generateExecutiveReality(portfolio, summary.organizationalStage);
    expect(reality).toContain('A organização demonstra evolução consistente');

    const conversation = narrativeService.generateStrategicConversation(summary.organizationalStage, summary.recommendedEvolution.nextJourneyId);
    // nextJourneyId should be operational-intelligence
    expect(conversation).toContain('fortalecer capacidades operacionais para sustentar crescimento');
  });

  it('Cenário Foundation', () => {
    const portfolio: any = {
      ...mockPortfolioBase,
      domains: {
        financial: { status: 'completed', currentMaturity: 'developing', confidence: 'high', dataSources: [] },
        governance: { status: 'completed', currentMaturity: 'initial', confidence: 'high', dataSources: [] }
      },
      completedJourneys: ['financial', 'governance']
    };

    const summary = summaryService.generateSummary(portfolio);
    expect(summary.organizationalStage).toBe('Foundation Building');

    const reality = narrativeService.generateExecutiveReality(portfolio, summary.organizationalStage);
    expect(reality).toContain('A organização está estruturando sua base');

    const conversation = narrativeService.generateStrategicConversation(summary.organizationalStage, summary.recommendedEvolution.nextJourneyId);
    // nextJourneyId should be governance-intelligence
    expect(conversation).toContain('consolidar a estrutura de governança');
  });
});
