import { Identifier, Score } from '@illumine/core-primitives';
import { AgentEvidenceBundle, AgentRiskLevel } from '@illumine/agent-runtime';

export interface DecisionTracePipeline {
  readonly decisionTraceId: Identifier;
  readonly recommendationTraceId: Identifier;
  readonly executionTraceId: Identifier;
  readonly outcomeTraceId: Identifier;
  readonly learningTraceId: Identifier;
}

export interface ExecutiveDecision {
  readonly decisionId: Identifier;
  readonly tracePipeline: DecisionTracePipeline;
  readonly title: string;
  readonly context: string;
  readonly decisionCategory: string;
  readonly financialImpactBrl: number;
  readonly strategicAlignmentScore: Score;
  readonly operationalImpactScore: Score;
  readonly confidenceScore: Score;
  readonly evidenceBundle: AgentEvidenceBundle;
  readonly alternativesConsidered: string[];
  readonly tradeOffsAccepted: string[];
  readonly approvalRequirement: 'HUMAN_APPROVAL_COMPULSORY' | 'AUTONOMOUS_LEVEL_2';
  readonly owner: string;
  readonly dueDate: Date;
  readonly status: 'DRAFT' | 'RECOMMENDED' | 'UNDER_REVIEW' | 'APPROVED' | 'EXECUTED';
  readonly businessValueBrl: number;
  readonly riskExposure: AgentRiskLevel;
}
