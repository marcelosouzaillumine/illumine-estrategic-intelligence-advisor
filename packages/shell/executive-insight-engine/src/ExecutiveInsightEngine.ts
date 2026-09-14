import { Identifier, Score } from '@illumine/core-primitives';
import { AgentEvidenceBundle } from '@illumine/agent-runtime';

export type InsightCategory =
  | 'Opportunity'
  | 'Risk'
  | 'Performance Deviation'
  | 'Strategic Recommendation'
  | 'Required Decision';

export interface ExecutiveInsight {
  readonly insightId: Identifier;
  readonly category: InsightCategory;
  readonly businessContext: string;
  readonly evidence: AgentEvidenceBundle;
  readonly contributingAgents: string[];
  readonly confidence: Score;
  readonly expectedImpactSummary: string;
  readonly recommendedDecision: string;
  readonly createdAt: Date;
}

export class ExecutiveInsightEngine {
  public static createInsight(
    category: InsightCategory,
    context: string,
    agents: string[],
    recommendedDecision: string
  ): ExecutiveInsight {
    return {
      insightId: `ins-${Date.now()}`,
      category,
      businessContext: context,
      evidence: { bundleId: 'b-ins-01', metricCodes: ['EBITDA'], factSummaries: ['Sinal gerado'], lineageHash: 'sha-ins-01' },
      contributingAgents: agents,
      confidence: Score.create(92),
      expectedImpactSummary: 'Impacto positivo estimado na margem operacional',
      recommendedDecision,
      createdAt: new Date()
    };
  }
}
