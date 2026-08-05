import { describe, it, expect } from 'vitest';
import { DomainRegistry } from '../core/domain-registry';
import { PortfolioSummaryService } from '../../executive-profile/portfolio-summary.service';
import { ExecutiveNarrativeService } from '../../executive-operating-model/executive-narrative.service';
import { ExecutiveProfilePortfolio } from '../../executive-profile/portfolio-types';

describe('Phase C Extensibility - Plugin Architecture', () => {
  it('Should seamlessly integrate a non-existent Future Domain (AI Intelligence) without modifying core engines', () => {
    
    // 1. Registry (Plugin Installation)
    const registry = DomainRegistry.getInstance();
    registry.register({
      domain: 'ai' as any,
      name: 'AI Intelligence™',
      isCoreFoundation: false,
      supportedEngines: ['Diagnostic']
    });

    const aiDomain = registry.getDomain('ai' as any);
    expect(aiDomain).toBeDefined();
    expect(aiDomain?.name).toBe('AI Intelligence™');

    // 2. Portfolio Construction with the new plugin
    const portfolio: ExecutiveProfilePortfolio = {
      organizationId: 'org-test',
      intelligenceIndex: 0,
      completedJourneys: ['financial', 'ai' as any],
      updatedAt: new Date().toISOString(),
      domains: {
        financial: {
          status: 'completed',
          currentMaturity: 'structured',
          confidence: 'high',
          dataSources: ['ERP']
        },
        ai: {
          status: 'completed',
          currentMaturity: 'developing',
          confidence: 'medium',
          dataSources: ['Diagnostic']
        }
      }
    };

    // 3. Engine Processing
    const summaryService = new PortfolioSummaryService();
    const index = summaryService.calculateIntelligenceIndex(portfolio);
    
    // Index should calculate correctly without crashing, processing both Financial and AI
    expect(index).toBeGreaterThan(0);
    expect(index).toBeLessThan(100);

    const summary = summaryService.generateSummary(portfolio);
    
    // Should extract AI Intelligence properly in the summary maps
    expect(summary.attentionAreas).toContain('AI Intelligence™');

    // 4. Narrative Engine Extensibility
    const narrativeService = new ExecutiveNarrativeService();
    const strategicConversation = narrativeService.generateStrategicConversation(summary.organizationalStage, 'ai-intelligence');
    
    // Narrative should dynamically insert the domain name
    expect(strategicConversation).toContain('AI Intelligence™');
  });
});
