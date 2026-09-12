import { DecisionMemoryOutput } from './InstitutionalDecisionTypes';
import { DecisionToCashCausalityOutput } from './DecisionToCashCausalityTypes';
import { LongitudinalCashIntelligenceOutput } from '../../capabilities/financial/runtime/cash-intelligence/CashIntelligenceTypes';
import { FiduciaryTimelineSection } from '../institutional-reporting/institutional-reporting-types';
import { CrossStatementReconciliationReport } from '../governance/cross-statement/CrossStatementReconciliationEngine';

export type InstitutionalBehavioralPatternType = 
  | 'DISCIPLINED_EXECUTION'
  | 'STRATEGIC_DISCIPLINE'
  | 'GOVERNANCE_MATURITY_EVOLUTION'
  | 'REACTIVE_MANAGEMENT'
  | 'TREASURY_NEGLECT'
  | 'CHRONIC_OVEREXPANSION'
  | 'ARTIFICIAL_SCALING'
  | 'RECURRENT_WORKING_CAPITAL_STRESS'
  | 'CAPITAL_DEPENDENCY_BEHAVIOR'
  | 'VOLATILE_DECISION_PATTERN'
  | 'INSUFFICIENT_DECISION_EVIDENCE'
  | 'BLOCKED_BY_ACCOUNTING_INTEGRITY';

export type GovernanceMaturitySignal = 
  | 'MATURING'
  | 'STABLE'
  | 'FRAGILE'
  | 'REACTIVE'
  | 'DETERIORATING'
  | 'INSUFFICIENT_EVIDENCE'
  | 'BLOCKED';

export interface InstitutionalBehavioralPatternsInput {
  memoryOutput: DecisionMemoryOutput;
  causalityOutput: DecisionToCashCausalityOutput;
  longitudinalCash: LongitudinalCashIntelligenceOutput;
  fiduciaryTimeline: FiduciaryTimelineSection;
  reconciliation: CrossStatementReconciliationReport;
  financialContext?: any;
}

export interface InstitutionalBehavioralPatternsOutput {
  dominantBehavioralPattern: InstitutionalBehavioralPatternType;
  secondaryBehavioralPatterns: InstitutionalBehavioralPatternType[];
  behavioralRiskScore: number | 'NOT_AVAILABLE';
  governanceMaturitySignal: GovernanceMaturitySignal;
  behavioralEvidence: string[];
  repeatedPatterns: string[];
  correctiveSignals: boolean;
  fiduciaryWarnings: string[];
  confidence: 'HIGH' | 'MODERATE' | 'LOW' | 'BLOCKED';
  narrativeBehavioralAssessment: string;
  blockedReason?: string;
}
