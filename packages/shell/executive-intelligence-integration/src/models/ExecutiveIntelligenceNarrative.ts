import { Recommendation } from '@illumine/architecture-governance-recommendation';
import { InstitutionalLesson } from '@illumine/institutional-learning-intelligence';

export interface ExecutiveInsight {
  readonly title: string;
  readonly description: string;
}

export interface ExecutiveDecision {
  readonly decisionId: string;
  readonly summary: string;
  readonly status: string;
}

export interface ExecutiveAction {
  readonly actionId: string;
  readonly description: string;
  readonly type: 'APPROVE' | 'REVIEW' | 'ACKNOWLEDGE';
}

export interface ExecutiveIntelligenceNarrative {
  readonly summary: string;
  readonly context: string;
  readonly insights: readonly ExecutiveInsight[];
  readonly recommendations: readonly Recommendation[];
  readonly decisions: readonly ExecutiveDecision[];
  readonly learning: readonly InstitutionalLesson[];
  readonly nextActions: readonly ExecutiveAction[];
}
