import { ExecutiveIntelligenceContext } from '../models/ExecutiveIntelligenceContext';
import { ExecutiveIntelligenceNarrative } from '../models/ExecutiveIntelligenceNarrative';

export class ExecutiveIntelligenceNarrativeEngine {
  generateNarrative(context: ExecutiveIntelligenceContext): ExecutiveIntelligenceNarrative {
    // Translates the raw context into a unified narrative for the Copilot UI
    return {
      summary: `You have ${context.pendingDecisions.length} pending decisions and ${context.activeRecommendations.length} active recommendations.`,
      context: `Operating under context: ${context.executiveContext.pageContext}`,
      insights: context.relevantPatterns.map(p => ({
        title: 'Institutional Principle Identified',
        description: p.description
      })),
      recommendations: context.activeRecommendations,
      decisions: context.pendingDecisions.map(d => ({
        decisionId: d.decisionId,
        summary: `Decision related to tenant: ${(d as any).tenantId || (d as any).organizationId || 'default'}`,
        status: (d as any).resolved ? 'RESOLVED' : 'PENDING'
      })),
      learning: context.historicalLearnings,
      nextActions: []
    };
  }
}
