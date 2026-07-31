import { Identifier, Score } from '@illumine/core-primitives';
import { ReasoningTrace } from '@illumine/intelligence-kernel';

export type AgentRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface AgentEvidenceBundle {
  readonly bundleId: Identifier;
  readonly metricCodes: string[];
  readonly factSummaries: string[];
  readonly lineageHash: string;
}

export interface AgentRecommendation {
  readonly recommendationId: Identifier;
  readonly agentId: string;
  readonly domain: string;
  readonly title: string;
  readonly executiveSummary: string;
  readonly reasoningTrace: ReasoningTrace;
  readonly evidenceBundle: AgentEvidenceBundle;
  readonly predictionExplanation: any;
  readonly confidenceScore: Score;
  readonly riskLevel: AgentRiskLevel;
  readonly timestamp: Date;
}
