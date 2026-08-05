import { describe, it, expect } from 'vitest';
import { SampleDiagnosticJourney } from '../sample-domain/sample-diagnostic';
import { ExecutiveProfilePortfolio } from '../../executive-profile/portfolio-types';
import { PortfolioSummaryService } from '../../executive-profile/portfolio-summary.service';
import { ExecutiveNarrativeService } from '../../executive-operating-model/executive-narrative.service';
import { ProgressionEngine } from '../../progression/progression-engine';
import { ExecutiveProfileRecord } from '../../executive-profile/profile-types';
import { DomainRegistry } from '../core/domain-registry';
import { ExecutiveDomainGraph } from '../../progression/executive-domain-graph';

describe('Gate 3: Runtime Lifecycle Certification', () => {
  it('Should execute the full lifecycle of a newly injected plugin domain', async () => {
    // 1. Ensure Domain is Registered
    const registry = DomainRegistry.getInstance();
    const sampleMeta = registry.getDomain('sample');
    expect(sampleMeta).toBeDefined();
    expect(sampleMeta?.name).toBe('Sample Intelligence™');

    // 2. Diagnostic Execution
    const journey = new SampleDiagnosticJourney();
    expect(journey.descriptor.domain).toBe('sample');
    
    // Evaluate answers
    await journey.initialize({ responses: [], journeyId: 'sample-journey', source: 'workspace' });
    await journey.collectResponses([
      { questionId: 'q_sample_1', selectedOptionId: 'opt_1', timestamp: new Date().toISOString() }
    ]);
    
    const profile = await journey.generateProfile();
    
    expect(profile.maturityLevel).toBe('excellence');
    expect(profile.isSample).toBe(true);

    // 3. Profile Stored and Portfolio Updated
    const portfolio: any = {
      organizationId: 'org-test',
      intelligenceIndex: 0,
      completedJourneys: ['sample'],
      updatedAt: new Date().toISOString(),
      domains: {
        sample: {
          status: 'completed',
          currentMaturity: profile.maturityLevel,
          confidence: 'high',
          dataSources: ['diagnostic-v1']
        }
      }
    };

    // 4. Portfolio calculates index without knowing it's "sample"
    const summaryService = new PortfolioSummaryService();
    const index = summaryService.calculateIntelligenceIndex(portfolio);
    
    expect(index).toBeGreaterThan(0); // Should calculate points

    const summary = summaryService.generateSummary(portfolio);
    
    // Because it's "excellence", it should be a dominant capability
    expect(summary.dominantCapabilities).toContain('Sample Intelligence™');

    // 5. Narrative Generated
    const narrativeService = new ExecutiveNarrativeService();
    const strategicConversation = narrativeService.generateStrategicConversation(summary.organizationalStage, 'sample-intelligence');
    
    expect(strategicConversation).toContain('Sample Intelligence™');

    // 6. Recommendation Created (Graph traversal)
    // We haven't added an edge FROM sample yet, so it should fallback or we can add a temporary edge
    const graph = ExecutiveDomainGraph.getInstance();
    graph.addEdge('sample', 'financial', 0.9, 'Testing edge from sample');
    
    const record: ExecutiveProfileRecord = {
      id: 'prof-1',
      organizationId: 'org-1',
      domain: 'sample',
      generatedAt: new Date().toISOString(),
      dataSource: 'diagnostic-v1',
      consumers: [],
      profile
    };

    const recommendation = ProgressionEngine.getNextExecutiveJourney(portfolio, record);
    
    // It should recommend financial because we just added an edge from sample -> financial
    expect(recommendation.recommendedJourney).toBe('financial-intelligence');
    expect(recommendation.reason).toBe('Testing edge from sample');
  });
});
