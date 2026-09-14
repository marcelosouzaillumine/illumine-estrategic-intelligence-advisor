import { ExecutiveIntelligenceContext, ExecutiveAdvisorRuntimeContext } from '../models/ExecutiveIntelligenceContext';
import { Recommendation } from '@illumine/architecture-governance-recommendation';
import { ExecutiveDecisionContext } from '@illumine/executive-decision-intelligence';
import { InstitutionalLesson, LearningPattern } from '@illumine/institutional-learning-intelligence';

export class ExecutiveIntelligenceContextAssembler {
  assemble(
    runtimeContext: ExecutiveAdvisorRuntimeContext,
    recommendations: Recommendation[],
    decisions: ExecutiveDecisionContext[],
    learnings: InstitutionalLesson[],
    patterns: LearningPattern[]
  ): ExecutiveIntelligenceContext {
    
    // Core assembly logic combining all states for the UI
    const activeRecommendations = recommendations.filter(r => (r as any).status === 'VALIDATED' || (r as any).priority === 'CRITICAL');
    const pendingDecisions = decisions.filter(d => !(d as any).resolved);
    const relevantPatterns = patterns.filter(p => p.maturity === 'INSTITUTIONAL_PRINCIPLE');
    
    return {
      executiveContext: runtimeContext,
      activeRecommendations,
      pendingDecisions,
      historicalLearnings: learnings,
      relevantPatterns
    };
  }
}
