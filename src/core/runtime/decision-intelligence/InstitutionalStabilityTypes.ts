import { CrossStatementReconciliationReport } from '../governance/cross-statement/CrossStatementReconciliationEngine';
import { CashIntelligenceRuntimeOutput, LongitudinalCashIntelligenceOutput } from '../cash-intelligence/CashIntelligenceTypes';
import { FiduciaryTimelineSection } from '../institutional-reporting/institutional-reporting-types';
import { DecisionMemoryOutput } from './InstitutionalDecisionTypes';
import { DecisionToCashCausalityOutput } from './DecisionToCashCausalityTypes';
import { InstitutionalBehavioralPatternsOutput } from './InstitutionalBehavioralTypes';
import { GovernanceDriftDetectionOutput } from './GovernanceDriftTypes';
import { ExecutiveAccountabilityOutput } from './ExecutiveAccountabilityTypes';

export type StabilityClassification = 
  | 'STRUCTURALLY_STABLE'
  | 'STABLE_BUT_MONITORED'
  | 'APPARENT_STABILITY'
  | 'FRAGILE_STABILITY'
  | 'UNSTABLE'
  | 'CRITICAL_INSTABILITY'
  | 'COLLAPSE_RISK'
  | 'INSUFFICIENT_STABILITY_EVIDENCE'
  | 'BLOCKED_BY_ACCOUNTING_INTEGRITY';

export type ContinuityRiskLevel = 
  | 'LOW'
  | 'MODERATE'
  | 'HIGH'
  | 'CRITICAL'
  | 'BLOCKED';

export type ResilienceAssessment = 
  | 'HIGH_RESILIENCE'
  | 'MODERATE_RESILIENCE'
  | 'FRAGILE_RESILIENCE'
  | 'LOW_RESILIENCE'
  | 'NO_EVIDENCE_OF_RESILIENCE'
  | 'BLOCKED';

export interface InstitutionalStabilityInput {
  reconciliation: CrossStatementReconciliationReport;
  cashCycles: CashIntelligenceRuntimeOutput[];
  longitudinalCash: LongitudinalCashIntelligenceOutput;
  fiduciaryTimeline: FiduciaryTimelineSection;
  memoryOutput: DecisionMemoryOutput;
  causalityOutput: DecisionToCashCausalityOutput;
  behavioralPatterns: InstitutionalBehavioralPatternsOutput;
  driftOutput: GovernanceDriftDetectionOutput;
  accountabilityOutput: ExecutiveAccountabilityOutput;
  financialContext?: any;
}

export interface InstitutionalStabilityIndexOutput {
  stabilityScore: number | 'NOT_AVAILABLE';
  stabilityClassification: StabilityClassification;
  stabilityConfidence: 'HIGH' | 'MODERATE' | 'LOW' | 'BLOCKED';
  dominantStabilityDrivers: string[];
  destabilizingFactors: string[];
  stabilizingFactors: string[];
  structuralFragilityFlags: string[];
  continuityRiskLevel: ContinuityRiskLevel;
  resilienceAssessment: ResilienceAssessment;
  institutionalMaturitySignal: string;
  evidenceTrail: string[];
  fiduciaryWarnings: string[];
  narrativeStabilityAssessment: string;
  blockedReason?: string;
}
