import { DecisionMemoryOutput } from './InstitutionalDecisionTypes';
import { DecisionToCashCausalityOutput } from './DecisionToCashCausalityTypes';
import { InstitutionalBehavioralPatternsOutput } from './InstitutionalBehavioralTypes';
import { GovernanceDriftDetectionOutput } from './GovernanceDriftTypes';
import { LongitudinalCashIntelligenceOutput } from '../../capabilities/financial/runtime/cash-intelligence/CashIntelligenceTypes';
import { CrossStatementReconciliationReport } from '../governance/cross-statement/CrossStatementReconciliationEngine';
import { FiduciaryTimelineSection } from '../institutional-reporting/institutional-reporting-types';

export type AccountabilityStatus = 
  | 'HIGH_EXECUTIVE_DISCIPLINE'
  | 'STABILIZING_RESPONSE'
  | 'REACTIVE_CORRECTION'
  | 'CHRONIC_REACTION_DELAY'
  | 'RECURRENT_STRUCTURAL_FAILURE'
  | 'NON_CORRECTIVE_MANAGEMENT_PATTERN'
  | 'IMPROVING_GOVERNANCE_DISCIPLINE'
  | 'EXECUTION_VOLATILITY'
  | 'INSUFFICIENT_ACCOUNTABILITY_EVIDENCE'
  | 'BLOCKED_BY_ACCOUNTING_INTEGRITY';

export interface ExecutiveAccountabilityInput {
  memoryOutput: DecisionMemoryOutput;
  causalityOutput: DecisionToCashCausalityOutput;
  behavioralPatterns: InstitutionalBehavioralPatternsOutput;
  driftOutput: GovernanceDriftDetectionOutput;
  longitudinalCash: LongitudinalCashIntelligenceOutput;
  fiduciaryTimeline: FiduciaryTimelineSection;
  executiveIntelligenceReport?: any;
  reconciliation: CrossStatementReconciliationReport;
  financialContext?: any;
}

export interface ExecutiveAccountabilityOutput {
  accountabilityScore: number | 'NOT_AVAILABLE';
  accountabilityStatus: AccountabilityStatus;
  reactionSpeedAssessment: string;
  correctiveDisciplineAssessment: string;
  crisisResponseQuality: string;
  institutionalLearningAssessment: string;
  recurrenceSeverity: string;
  executiveConsistencySignal: string;
  stabilizationCapability: string;
  accountabilityWarnings: string[];
  evidenceTrail: string[];
  confidence: 'HIGH' | 'MODERATE' | 'LOW' | 'BLOCKED';
  narrativeAccountabilityAssessment: string;
  blockedReason?: string;
}
