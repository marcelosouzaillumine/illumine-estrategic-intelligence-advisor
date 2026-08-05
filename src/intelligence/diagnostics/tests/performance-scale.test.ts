import { describe, it, expect } from 'vitest';
import { DomainRegistry } from '../core/domain-registry';
import { ExecutiveDomainGraph } from '../../progression/executive-domain-graph';
import { ExecutiveProfilePortfolio } from '../../executive-profile/portfolio-types';
import { PortfolioSummaryService } from '../../executive-profile/portfolio-summary.service';
import { ExecutiveNarrativeService } from '../../executive-operating-model/executive-narrative.service';

describe('Gate 5: Performance & Scale Certification', () => {
  it('Should process 30 concurrent domains within performance boundaries (< 500ms for portfolio evaluation)', () => {
    const registry = DomainRegistry.getInstance();
    const graph = ExecutiveDomainGraph.getInstance();
    
    // 1. Inject 30 mock domains
    const numDomains = 30;
    const portfolioDomains: any = {};
    const completedJourneys: any[] = [];

    for (let i = 0; i < numDomains; i++) {
      const domainKey = `scale-domain-${i}`;
      
      registry.register({
        domain: domainKey as any,
        name: `Scale Domain ${i}`,
        isCoreFoundation: false,
        supportedEngines: ['Diagnostic']
      });

      // Chain them in the graph
      if (i > 0) {
        graph.addEdge(`scale-domain-${i-1}` as any, domainKey as any, 1, `Edge to ${i}`);
      }

      portfolioDomains[domainKey] = {
        status: 'completed',
        currentMaturity: i % 2 === 0 ? 'excellence' : 'structured',
        confidence: 'high',
        dataSources: []
      };
      
      completedJourneys.push(`${domainKey}-intelligence`);
    }

    const portfolio: ExecutiveProfilePortfolio = {
      organizationId: 'org-scale',
      intelligenceIndex: 0,
      completedJourneys,
      updatedAt: new Date().toISOString(),
      domains: portfolioDomains
    };

    // 2. Measure Portfolio Summary Evaluation Performance
    const summaryService = new PortfolioSummaryService();
    
    const startTime = performance.now();
    const index = summaryService.calculateIntelligenceIndex(portfolio);
    const summary = summaryService.generateSummary(portfolio);
    const endTime = performance.now();
    
    const durationMs = endTime - startTime;
    
    // The evaluation of 30 domains must be fast (under 500ms)
    expect(durationMs).toBeLessThan(500);
    expect(index).toBeGreaterThan(0);
    expect(summary.dominantCapabilities.length).toBeGreaterThan(0);
    
    // 3. Measure Narrative Engine Performance
    const narrativeService = new ExecutiveNarrativeService();
    const narStartTime = performance.now();
    const conversation = narrativeService.generateStrategicConversation(summary.organizationalStage, 'scale-domain-0-intelligence');
    const narEndTime = performance.now();
    
    expect(narEndTime - narStartTime).toBeLessThan(500);
    expect(conversation).toBeDefined();

    // 4. Cleanup to prevent test bleed
    for (let i = 0; i < numDomains; i++) {
      registry.unregister(`scale-domain-${i}` as any);
      if (i > 0) {
         graph.removeEdge(`scale-domain-${i-1}` as any, `scale-domain-${i}` as any);
      }
    }
  });
});
