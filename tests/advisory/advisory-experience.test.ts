import { describe, it, expect, beforeEach } from 'vitest';
import { AdvisoryContextService } from '../../src/services/advisory-context.service';
import { ExecutiveMemoryService } from '../../src/intelligence/memory/executive-memory.service';
import { DomainRegistry } from '../../src/intelligence/diagnostics/core/domain-registry';
import { BRAND } from '../../src/config/brand';

describe('Gate 3 — Advisory Governance Connectivity', () => {
  beforeEach(() => {
    // Inject mock data into MemoryService for testing
    const memoryService = ExecutiveMemoryService.getInstance();
    const orgId = 'test-advisory-org';
    
    // Register domain
    DomainRegistry.getInstance().register({
      domain: 'financial-governance' as any,
      name: 'Financial Governance™',
      isCoreFoundation: true,
      supportedEngines: ['Advisory']
    });

    memoryService.injectContext(orgId, {
      id: 'ctx-123',
      profileId: 'prof-123',
      domain: 'financial-governance',
      organizationStage: 'Enterprise Development' as any,
      currentExecutiveReality: 'Realidade Executiva Teste',
      strategicConversation: 'Conversa Estratégica Teste',
      intelligencePortfolio: {
        organizationId: orgId,
        domains: {
          financial: {
            status: 'completed',
            currentMaturity: 'advanced',
            lastExecution: new Date().toISOString(),
            confidence: 'high',
            dataSources: [],
            profileRecord: {} as any
          }
        },
        completedJourneys: ['financial'],
        intelligenceIndex: 85,
        updatedAt: new Date().toISOString()
      },
      completedJourneys: ['financial'],
      maturityEvolution: [],
      recommendedConversation: {
        topic: 'Investimentos',
        objective: 'Alocação'
      },
      currentChallenge: 'Risco',
      suggestedFocus: [],
      advisoryPriority: 'Alta',
      profile: {} as any,
      generatedAt: new Date().toISOString()
    });
  });

  it('should generate a connected runtime context for the UI', () => {
    const context = AdvisoryContextService.getCurrentRuntimeContext('test-advisory-org', { title: 'Dashboard' });

    // Ensure it was generated
    expect(context).toBeDefined();

    // Check basic identity
    expect(context.identity.tenantId).toBe('test-advisory-org');
    
    // Check page context binding
    expect(context.page.purpose).toBe('Dashboard');
    expect(context.page.title).toBe('Dashboard');
    
    // Validate that the context is fully aware of the Intelligence Portfolio
    const advisory = context.advisoryContext;
    expect(advisory).toBeDefined();
    
    expect(advisory.organizationStage).toBe('Enterprise Development');
    expect(advisory.strategicConversation).toBe('Conversa Estratégica Teste');
    
    // Validate Portfolio structure
    expect(advisory.intelligencePortfolio).toBeDefined();
    expect(advisory.intelligencePortfolio.domains).toBeDefined();
    expect(advisory.intelligencePortfolio.domains.financial).toBeDefined();
    expect(advisory.intelligencePortfolio.domains.financial.currentMaturity).toBe('advanced');
  });

  it('should enforce correct brand naming in configuration', () => {
    expect(BRAND.advisoryName).toBe('Illumine Advisory™');
    expect(BRAND.advisoryRole).toBe('Executive Advisor');
  });
});
