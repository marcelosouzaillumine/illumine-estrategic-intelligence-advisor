import { ExecutiveDecisionContext } from '@illumine/executive-decision-intelligence';
import { InstitutionalLesson, LearningPattern } from '@illumine/institutional-learning-intelligence';
import { Recommendation } from '@illumine/architecture-governance-recommendation';

export interface ExecutiveAdvisorRuntimeContext {
  readonly pageContext: string;
  readonly activeTenantId: string;
  readonly executiveIdentity: {
    readonly name: string;
    readonly role: string;
  };
}

export interface ExecutiveIntelligenceContext {
  readonly executiveContext: ExecutiveAdvisorRuntimeContext;
  readonly activeRecommendations: readonly Recommendation[];
  readonly pendingDecisions: readonly ExecutiveDecisionContext[];
  readonly historicalLearnings: readonly InstitutionalLesson[];
  readonly relevantPatterns: readonly LearningPattern[];
}
