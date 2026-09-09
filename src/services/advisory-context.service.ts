import { ExecutiveProfileRecord } from '../intelligence/executive-profile/profile-types';
import { ExecutiveAdvisoryContext } from '../intelligence/executive-profile/advisory-context-types';
import { ExecutiveMemoryService } from '../intelligence/memory/executive-memory.service';
import { PortfolioSummaryService } from '../intelligence/executive-profile/portfolio-summary.service';
import { ExecutiveProfilePortfolio } from '../intelligence/executive-profile/portfolio-types';
import { DiagnosticDomain } from '../intelligence/diagnostics/core/diagnostic-types';
import { ExecutiveNarrativeService } from '../intelligence/executive-operating-model/executive-narrative.service';
import { DomainRegistry } from '../intelligence/diagnostics/core/domain-registry';

export class AdvisoryContextService {
  
  /**
   * Translates a ProfileRecord into a Context understandable by the Advisory/Copilot,
   * and injects it into the Memory Layer.
   */
  public static createAndInjectContext(record: ExecutiveProfileRecord): ExecutiveAdvisoryContext {
    const memoryService = ExecutiveMemoryService.getInstance();
    const memory = memoryService.getMemory(record.organizationId);
    
    // Reconstruct Portfolio from memory + new record
    const portfolio: ExecutiveProfilePortfolio = {
      organizationId: record.organizationId,
      domains: {},
      completedJourneys: [],
      intelligenceIndex: 0,
      updatedAt: new Date().toISOString()
    };

    const completedJourneys: DiagnosticDomain[] = [];

    // Load from memory dynamically
    if (memory) {
      Object.values(memory.activeContexts).forEach(ctx => {
        const domainPrefix = ctx.domain.replace('-governance', '') as DiagnosticDomain;
        portfolio.domains[domainPrefix] = {
          status: 'completed',
          currentMaturity: ctx.profile?.maturityLevel,
          lastExecution: ctx.generatedAt,
          confidence: 'medium', // Default for self-assessment diagnostic
          dataSources: ['Diagnostic Questionnaire'],
          profileRecord: { 
            id: ctx.profileId, 
            organizationId: record.organizationId,
            domain: ctx.domain, 
            profile: ctx.profile, 
            generatedAt: ctx.generatedAt,
            dataSource: 'diagnostic-v1',
            consumers: ['advisory']
          }
        };
        if (!completedJourneys.includes(domainPrefix)) {
          completedJourneys.push(domainPrefix);
        }
      });
    }

    // Apply current record
    const currentDomainPrefix = record.domain.replace('-governance', '') as DiagnosticDomain;
    portfolio.domains[currentDomainPrefix] = {
      status: 'completed',
      currentMaturity: record.profile?.maturityLevel,
      lastExecution: new Date().toISOString(),
      confidence: 'medium',
      dataSources: ['Diagnostic Questionnaire'],
      profileRecord: record
    };
    
    if (!completedJourneys.includes(currentDomainPrefix)) {
      completedJourneys.push(currentDomainPrefix);
    }
    
    portfolio.completedJourneys = completedJourneys;

    const summaryService = new PortfolioSummaryService();
    // Update intelligence index before generation
    portfolio.intelligenceIndex = summaryService.calculateIntelligenceIndex(portfolio);
    
    const summary = summaryService.generateSummary(portfolio);
    const narrativeService = new ExecutiveNarrativeService();
    const currentExecutiveReality = narrativeService.generateExecutiveReality(portfolio, summary.organizationalStage);
    const strategicConversation = narrativeService.generateStrategicConversation(summary.organizationalStage, summary.recommendedEvolution.nextJourneyId);

    const context: ExecutiveAdvisoryContext = {
      id: `ctx-${Date.now()}`,
      profileId: record.id,
      domain: record.domain,
      organizationStage: summary.organizationalStage,
      currentExecutiveReality,
      strategicConversation,
      intelligencePortfolio: portfolio,
      completedJourneys,
      maturityEvolution: summary.maturityEvolution,
      recommendedConversation: {
        topic: strategicConversation, // Using the narrative topic directly
        objective: `Focus on ${summary.recommendedEvolution.nextJourneyId} transformation.`
      },
      // Legacy
      currentChallenge: record.profile.attentionPoints.join(' | ') || 'Evolução contínua das capacidades',
      suggestedFocus: record.profile.recommendedActions,
      advisoryPriority: record.profile.executiveInsights.join(' '),
      profile: record.profile,
      generatedAt: new Date().toISOString()
    };

    memoryService.injectContext(record.organizationId, context as any);

    return context;
  }

  /**
   * Constructs the Runtime Context for the Advisory UI, completely isolating
   * the UI from memory and domains.
   */
  public static getCurrentRuntimeContext(organizationId: string, pageContext?: any): any {
    const memory = ExecutiveMemoryService.getInstance().getMemory(organizationId);
    
    // Fallback if no memory
    const activeContexts = memory ? Object.values(memory.activeContexts) : [];
    const latestContext = activeContexts.length > 0 ? activeContexts[activeContexts.length - 1] : null;
    
    return {
      identity: {
        userId: 'current-user',
        tenantId: organizationId,
        organizationId: organizationId,
        operationalRole: 'EXECUTIVE',
        executivePersona: 'CEO',
        permissions: [],
        sessionId: 'sess-' + Date.now(),
        issuedAt: new Date(),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
        identitySource: 'SYSTEM'
      },
      organization: {
        tenantId: organizationId,
        companyName: 'Current Organization',
        industry: 'Geral'
      },
      page: {
        route: typeof window !== 'undefined' ? window.location.pathname : '/dashboard',
        domain: latestContext?.domain || 'INSTITUTIONAL',
        capability: 'Analysis',
        purpose: pageContext?.title || 'Dashboard',
        title: pageContext?.title
      },
      objective: {
        currentDecision: ''
      },
      memory: {
        previousDecisions: [],
        unresolvedIssues: []
      },
      timestamp: new Date().toISOString(),
      contextVersion: "1.0",
      
      // Injecting the resolved context so the engine can use real data
      advisoryContext: latestContext
    };
  }
}
