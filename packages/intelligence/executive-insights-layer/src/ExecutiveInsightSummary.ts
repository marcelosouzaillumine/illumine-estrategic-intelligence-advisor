import { Score } from '@illumine/core-primitives';

export interface ExecutiveInsightSummary {
  readonly pageContext: string;
  readonly opportunities: string[];
  readonly risks: string[];
  readonly recommendedDecisions: string[];
  readonly priority: 'Low' | 'Medium' | 'High' | 'Critical';
  readonly confidence: Score;
  readonly evidenceCount: number;
}
