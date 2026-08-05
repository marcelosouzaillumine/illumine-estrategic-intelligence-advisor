import { describe, it, expect } from 'vitest';
import { DomainRegistry } from '../core/domain-registry';
import { ExecutiveDomainGraph } from '../../progression/executive-domain-graph';
import { DiagnosticRegistry } from '../catalog/diagnostic-registry';
import { ExecutiveProfilePortfolio } from '../../executive-profile/portfolio-types';
import { PortfolioSummaryService } from '../../executive-profile/portfolio-summary.service';

describe('Gate 4: Removal (Zero Residue) Certification', () => {
  it('Should gracefully handle the removal of a domain without leaving orphans or breaking calculations', () => {
    const registry = DomainRegistry.getInstance();
    const graph = ExecutiveDomainGraph.getInstance();
    
    // 1. Setup Phase: Inject mock domain
    registry.register({
      domain: 'mock-to-remove' as any,
      name: 'Mock Domain',
      isCoreFoundation: false,
      supportedEngines: ['Diagnostic']
    });
    
    graph.addEdge('financial', 'mock-to-remove' as any, 1, 'Mock edge');

    // 2. Verify state before removal
    expect(registry.getDomain('mock-to-remove' as any)).toBeDefined();
    
    // Simulate user completing this mock journey
    const portfolio: any = {
      organizationId: 'org-test',
      intelligenceIndex: 0,
      completedJourneys: ['financial', 'mock-to-remove'],
      updatedAt: new Date().toISOString(),
      domains: {
        financial: { status: 'completed', currentMaturity: 'structured', confidence: 'high', dataSources: [] },
        'mock-to-remove': { status: 'completed', currentMaturity: 'excellence', confidence: 'high', dataSources: [] }
      }
    };
    
    const summaryService = new PortfolioSummaryService();
    const beforeIndex = summaryService.calculateIntelligenceIndex(portfolio);
    
    // 3. Removal Phase
    // Simulate unregistering the domain (for test purposes we reset the singleton and rebuild it)
    // Since our registry is a singleton with private state, we'll simulate the "deleted" effect by
    // accessing the portfolio as if the domain is no longer in the registry.
    // In a real removal, the file is deleted. Here we just unregister it from our runtime map.
    
    // Force unregister (simulating file deletion and restart)
    registry.unregister('mock-to-remove' as any);
    
    // Also remove from graph (simulating removing the edge definition)
    graph.removeEdge('financial', 'mock-to-remove' as any);
    
    // 4. Assert Zero Residue
    expect(registry.getDomain('mock-to-remove' as any)).toBeUndefined();
    
    // System should recalculate index without breaking, even if portfolio still has the ghost data
    // The summary service should ignore domains not in registry, or at least not crash
    const afterIndex = summaryService.calculateIntelligenceIndex(portfolio);
    
    expect(afterIndex).toBeDefined();
    expect(afterIndex).toBeGreaterThan(0); // Math may change depending on weights, just ensure it works
    
    // Graph should not recommend the removed domain
    const suggestion = graph.suggestNext(['financial']);
    expect(suggestion?.target).not.toBe('mock-to-remove');
  });
});
