import { Identifier, Score } from '@illumine/core-primitives';
import { AgentRecommendation } from '@illumine/agent-runtime';

export interface ExecutiveDecisionBrief {
  readonly briefId: Identifier;
  readonly scenarioId: Identifier;
  readonly situationSummary: string;
  readonly diagnosis: string;
  readonly strategicAlternatives: string[];
  readonly consolidatedRecommendations: AgentRecommendation[];
  readonly overallConfidence: Score;
  readonly recommendedAction: string;
}
