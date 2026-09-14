import { DecisionEvidence } from './DecisionEvidence';
import { DecisionConfidence } from './DecisionConfidence';
import { ConstitutionReference } from './ConstitutionReference';
import { DecisionLineage } from './DecisionLineage';

export type DecisionOutcome = 'NO_ACTION' | 'MONITOR' | 'INVESTIGATE' | 'ARCHITECTURAL_REVIEW';
export type DecisionClassification = 'STRATEGIC' | 'ARCHITECTURAL' | 'TECHNICAL' | 'GOVERNANCE' | 'COMPLIANCE' | 'SECURITY' | 'UX' | 'PERFORMANCE' | 'DATA' | 'GOVERNANCE';

export interface ArchitectureDecision {
  readonly id: string;
  readonly subject: string;
  readonly classification: DecisionClassification;
  readonly contextHash: string;
  readonly evidence: readonly DecisionEvidence[];
  readonly narrative: string;
  readonly policyVersion: string;
  readonly decisionOutcome: DecisionOutcome;
  readonly confidence: DecisionConfidence;
  readonly constitutionReferences: readonly ConstitutionReference[];
  readonly lineage: DecisionLineage;
  readonly generatedAt: string;
}
