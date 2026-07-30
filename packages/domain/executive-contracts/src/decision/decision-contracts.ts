import { Identifier, Version, Timestamp, Money, Probability } from '@illumine/core-primitives';

export interface ExpectedKPIShift {
  readonly kpiCode: string;
  readonly pessimisticShift: number;
  readonly expectedShift: number;
  readonly optimisticShift: number;
}

export interface PredictionRange {
  readonly shift: ExpectedKPIShift;
  readonly confidenceProbability: Probability;
}

export interface Recommendation {
  readonly recommendationId: Identifier;
  readonly alternativeId: Identifier;
  readonly title: string;
  readonly strategicDescription: string;
  readonly expectedCost: Money;
  readonly predictedOutcome: PredictionRange;
}

export interface BoardResolution {
  readonly resolutionId: Identifier;
  readonly resolutionVersion: Version; // v1, v2, v3
  readonly caseId: Identifier;
  readonly title: string;
  readonly boardDecision: 'APPROVED' | 'DEFERRED' | 'REJECTED' | 'AMENDED';
  readonly approvedByHumanUser: string;
  readonly resolutionText: string;
  readonly effectiveTimestamp: Timestamp;
}

export interface WorkflowBinding {
  readonly targetSystem: 'JIRA' | 'MONDAY' | 'ASANA' | 'SAP' | 'ERP' | 'CRM';
  readonly externalTaskId: string;
}

export interface ExecutiveAction {
  readonly actionId: Identifier;
  readonly resolutionId: Identifier;
  readonly title: string;
  readonly assignedRole: string;
  readonly deadlineTimestamp: Timestamp;
  readonly binding: WorkflowBinding;
}

export interface DecisionPackageContract {
  readonly packageId: Identifier;
  readonly recommendations: Recommendation[];
  readonly consensusScore: number;
}

export * from './ExecutiveDecisionContext';
