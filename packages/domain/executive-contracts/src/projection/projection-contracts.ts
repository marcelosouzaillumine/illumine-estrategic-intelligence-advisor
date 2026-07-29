import { Identifier, Confidence, Score } from '@illumine/core-primitives';

export interface ExecutiveOpinion {
  readonly agentId: string;
  readonly agentName: string;
  readonly confidence: Confidence;
  readonly executiveSummary: string;
  readonly keyRisks: string[];
  readonly keyOpportunities: string[];
  readonly recommendations: string[];
}

export interface BoardReportProjection {
  readonly reportId: Identifier;
  readonly boardSessionId: Identifier;
  readonly companyName: string;
  readonly period: string;
  readonly executiveSummary: string;
  readonly opinions: ExecutiveOpinion[];
  readonly overallIntegrityScore: Score;
  readonly generatedAt: string;
}
